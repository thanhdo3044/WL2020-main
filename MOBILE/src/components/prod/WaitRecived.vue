<template>
  <div>
      <div class="row justify-center">
          <div class="col-12 col-md-3 q-ma-sm" v-for="pallet in pallets" v-bind:key="pallet.id">
              <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated hinge"
        >
              <card-pallet :pallet="pallet">
                  <div slot="action">
                      <q-btn color="primary" @click="recive(pallet)" glossy label="Nhận" />
                  </div>
              </card-pallet>
              </transition>
          </div>
      </div>
      <q-inner-loading :showing="visible">
        <q-spinner-gears size="150px" color="primary" />
      </q-inner-loading>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab
            icon="search"
            color="accent"
             @click="showSearch"
        >
        </q-fab>
    </q-page-sticky>
    <q-dialog v-model="showSearchModel" transition-show="rotate" transition-hide="rotate">
      <q-card  style="width: 300px">
        <q-card-section>
          <div class="prodTextTitle">Tìm kiếm</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined v-model="quicachSearch" @input="search" label="Tìm theo qui cách" />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import CardPallet from './CardPallet'
export default {
    components:{
        'card-pallet':CardPallet
    },
    data(){
        return {
            visible:true,
            pallets:[],
            quicachSearch:'',
            showSearchModel:false,
        }
    },
    created(){
        this.initData()
    },
    methods:{
        initData() {
            const params = {
                token : this.$store.state.production.userInfo.token,
                stepId: this.$store.state.production.sourceSelected.id
            }
            this.$store.dispatch('production/ACTION_FETCH_PALLET_WAIT_RECIVE',params).then(res=>{
                this.pallets = res
                this.visible = false
            }).catch(err=>{
                this.visible = false
                console.log('fetch Errr: '+err)
            })
            this.pallets = this.$store.state.production.palletWaitRecive         
        },
        showSearch(){
            this.quicachSearch =''
            this.search('')
            this.showSearchModel=true
        },
        search(query){
            let pss = this.$store.state.production.palletWaitRecive.filter(obj=>{
                let quicach = obj.item[0].height.toString()+obj.item[0].width.toString()+obj.item[0].length.toString()
                if (quicach.toString().search(query)!==-1) {
                    return obj;
                }
            })
            if (pss.length>0) {
                this.pallets = pss
                this.numberPalletFound = pss.length
                this.showFiltterResult = true
            } else {
                this.pallets = this.$store.state.production.palletWaitRecive
            }
        },
        async recive(pallet){
            this.visible =true
            const payload ={
                token: this.$store.state.production.userInfo.token,
                packageId: pallet.packageId
            }
            let res = await this.$store.dispatch('production/ACTION_RECIVED_PALLET',payload)
            if (res.meta.success===true) {
                    this.$q.notify({
                        message:'Đã nhận pallet về công đoạn '+this.$store.state.production.sourceSelected.name,
                        color:'green'
                    })
                    this.visible = false
                    // const pIndex = this.pallets.findIndex(p=>{ return p.id===pallet.id})
                    // this.pallets.splice(pIndex,1)
                    
                    let clone = this.pallets.filter(p=>{
                        return p.id!==pallet.id
                    })
                    console.log(clone)
                    this.pallets = clone
                }else {
                    this.$q.notify({
                        message:res.meta.messages.message,
                        color:'red'
                    })
                }
        }
    }
}
</script>

<style>

</style>