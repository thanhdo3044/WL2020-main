<template>
  <div>
      <div class="row">
          <div class="col-12 col-md-6 q-pa-sm" v-for="pallet in pallets" v-bind:key="pallet.id">
              <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated hinge"
        >
              <card-pallet :pallet="pallet">
                 <div slot="action">
                      <q-btn color="secondary" @click="view(pallet)" glossy label="Xem" />
                  </div>
              </card-pallet>
              </transition>
          </div>
      </div>
      <q-inner-loading :showing="visible">
        <q-spinner-gears size="150px" color="primary" />
      </q-inner-loading>
      <q-page-sticky position="top-right" :offset="[18, 18]">
        <q-fab
            icon="search"
            color="primary"
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
            showSearchModel:false
        }
    },
    created(){
        this.initData()
    },
    methods:{
        initData(){
            const token = this.$store.state.production.userInfo.token
            const params = {
                token :token,
                sourceId: this.$store.state.production.sourceSelected.id
            }
            this.$store.dispatch('production/ACTION_GET_PALLET_IN_LINE',params).then(res=>{
                this.pallets = this.$store.state.production.palletsInLine
                this.visible = false
            })
        },
        showSearch(){
            this.quicachSearch =''
            this.search('')
            this.showSearchModel=true
        },
        view(pallet){
            this.$router.push({name:'detailpallet',params:{code:pallet.code}})
        },
        search(query){
            let pss = this.$store.state.production.palletsInLine.filter(obj=>{
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
                this.pallets = this.$store.state.production.palletsInLine
            }
        },
        recive(pallet){
            this.visible =true
            const payload ={
                token: this.$store.state.production.userInfo.token,
                packageId: pallet.packageId
            }
            this.$store.dispatch('production/ACTION_RECIVED_PALLET',payload).then(res=>{
                if (res.meta.success===true) {
                    this.$q.notify({
                        message:'Đã nhận pallet về công đoạn '+this.$store.state.production.sourceSelected.name,
                        color:'green'
                    })
                    this.initData()
                    // const pIndex = this.pallets.findIndex((p)=>{
                    //     return p.id===pallet.id
                    // })
                    // this.pallets.splice(pIndex,1)
                }else {
                    this.$q.notify({
                        message:res.meta.messages.message,
                        color:'red'
                    })
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    }
}
</script>

<style>

</style>