<template>
<div>
  <q-dialog v-model="show" persistent transition-show="scale" transition-hide="scale">
    <q-card v-show="!visible" style="min-width: 300px">
      <q-card-section>
        <div class="text-h6">Điền thông tin</div>
      </q-card-section>

      <q-card-section>
        <div class="row">
          <div class="col-12">
            <q-select
              style="font-family:'Time New Roman';font-size:16px"
              v-model="stepOfPallet"
              behavior="dialog"
              :options="stepsOfPallet"
              label="Chọn công đoạn sử dụng :"
              v-if="this.$store.state.production.palletSelected.step.length>1"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-select
              style="font-family:'Time New Roman';font-size:16px"
              v-model="supplie"
              behavior="dialog"
              :options="supplies"
              label="Chọn vật tư :"
              use-input input-debounce="0" @filter="searchSupplies" 
            />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-select
              style="font-family:'Time New Roman';font-size:16px"
              v-model="provider"
              behavior="dialog"
              :options="providers"
              label="Nhà cung cấp :"
              use-input input-debounce="0" @filter="searchProvider" 
            />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-input @blur="testBlur" outlined v-model="parcelText" label="Số lô :" />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn @click="cancelForm" flat label="Hủy" />
        <q-btn @click="submitForm" flat label="Đồng ý" />
      </q-card-actions>
    </q-card>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="150px" color="primary" />
    </q-inner-loading>
  </q-dialog>
  
</div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    cancelForm:{
      type:Function
    }
  },
  data(){
    return {
      supplies:[],
      supplie:null,
      providers:[],
      provider:null,
      parcel:null,
      parcelText:'',
      parcels:[],
      visible:false,
      stepOfPallet:null,
      stepsOfPallet:[]
    }
  },
  beforeCreate(){

  },
  created(){
    setTimeout(() => {
      this.loadAll()
    }, 500);
    let solo = localStorage.getItem('solohoachat')
    if (solo) {
      this.parcelText=solo
    }
  },
  methods:{
    testBlur(){
      localStorage.setItem('solohoachat',this.parcelText)
    },
    initData(){
      const sps = this.$store.state.production.supplies
      sps.forEach(sp => {
        const s = {
          label:sp.name || '??',
          value:sp.id
        }
        this.supplies.push(s)
      });
      
      const pros = this.$store.state.production.providers
      pros.forEach(pr=>{
        const p = {
          label:pr.code || '???',
          value:pr.id
        }
        this.providers.push(p)
      })
      
      const pars = this.$store.state.production.parcels
      pars.forEach(par=>{
        const pa = {
          label:par.name || '???',
          value:par.id
        }
        this.parcels.push(pa)
      })
      const steps = this.$store.state.production.palletSelected.step
      steps.forEach(st=>{
        const stp = {
          label:st.stepName,
          value:st.id
        }
        this.stepsOfPallet.push(stp)
      })
    },
    loadAll(){
      const token = this.$store.state.production.userInfo.token
      return Promise.all([
        this.$store.dispatch('production/ACTION_GET_SUPPLIES',token),
        this.$store.dispatch('production/ACTION_GET_PROVIDERS',token),
        this.$store.dispatch('production/ACTION_GET_PARCELS',token)
      ]).then(r=>{
        this.initData()
      })
    },
    submitForm(){
      let _stepOfPalletId = 0
      if (this.$store.state.production.palletSelected.step.length>1) {
        _stepOfPalletId = this.stepOfPallet.value
      }else {
        _stepOfPalletId = this.$store.state.production.palletSelected.step[0].id
      }
      let palletCode=this.$store.state.production.palletSelected.code
      if (palletCode&&this.supplie&&this.parcelText&&this.provider) {
        this.visible = true
        const data={
          palletCode:palletCode,
          suppliesId :this.supplie.value,
          stepOfPalletId:_stepOfPalletId,
          quantity:1,
          parcelCode :this.parcelText,
          vendorId:this.provider.value,
          token:this.$store.state.production.userInfo.token
        }
        const params = {
          palletCode:this.$store.state.production.palletSelected.code,
          token:this.$store.state.production.userInfo.token
        }
        this.$store.dispatch('production/ACTION_ADD_SUPPLIES_TO_PALLET',data).then(res=>{
          
          this.$store.dispatch('production/ACTION_GET_DETAIL_PALLET',params).then(res2=>{
            this.visible = false
            this.$root.$emit('add-supplies-success', res)
          })
        })
      }else{
        this.$q.notify({
          message:'Vui lòng nhập đầy đủ thông tin !',
          color:'red'
        })
      }
    },
    searchSupplies(val, update){
      let itemDupplicate=[]
        this.$store.state.production.supplies.forEach(it=>{
          const i = {
            label:it.name || '??',
            value:it.id
          }
          itemDupplicate.push(i)
        })
        if (val === '') {
          update(() => {
            this.supplies = itemDupplicate
          })
          return
        }

        update(() => {
          const needle = val.toLowerCase()
          this.supplies = itemDupplicate.filter(v => {
            const quicach =v.label
            if (quicach.toString().indexOf(needle) > -1) {
              return v
            }
          })
        })
    },
    searchLo(val,update){
      let itemDupplicate=[]
        this.$store.state.production.parcels.forEach(it=>{
          const i = {
            label:it.code || '??',
            value:it.id
          }
          itemDupplicate.push(i)
        })
        if (val === '') {
          update(() => {
            this.parcels = itemDupplicate
          })
          return
        }

        update(() => {
          const needle = val.toLowerCase()
          this.parcels = itemDupplicate.filter(v => {
            const quicach =v.label
            if (quicach.toString().indexOf(needle) > -1) {
              return v
            }
          })
        })
    },
    searchProvider(val, update){
        let itemDupplicate=[]
        this.$store.state.production.providers.forEach(it=>{
          const i = {
            label:it.name,
            value:it.id
          }
          itemDupplicate.push(i)
        })
        if (val === '') {
          update(() => {
            this.providers = itemDupplicate
          })
          return
        }

        update(() => {
          const needle = val.toLowerCase()
          this.providers = itemDupplicate.filter(v => {
            const quicach =v.label
            if (quicach.toString().indexOf(needle) > -1) {
              return v
            }
          })
        })
      },
  }
};
</script>

<style>
</style>