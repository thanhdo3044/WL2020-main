<template>
  <q-page class="q-pa-md">
      <app-bar>Xác nhận kết quả cho pallet số {{this.$store.state.production.palletSelected.code}}</app-bar>
      <div class="row q-mt-md q-pa-md">
          <div class="col-12 col-md-6">
              <info-factoryfsc/>
              <div class="row q-mb-md" style="    margin-left: -22px;margin-right: -22px;">
                  <div class="col-12">
                      <table-coc/>
                  </div>
              </div>
              <div class="row" style="    margin-left: -22px;margin-right: -22px;">
                  <div class="col-12">
                      <q-card>
                        <q-card-section>
                            <p class="prodTextTitle">{{this.$store.state.production.palletSelected.item[0].name}}</p>
                            <div class="prodTextNormal">
                                QC: {{this.$store.state.production.palletSelected.item[0].height+' '+
                                this.$store.state.production.palletSelected.item[0].width+' '+
                                 this.$store.state.production.palletSelected.item[0].length}} x {{this.$store.state.production.palletSelected.inventory}}
                                 <span v-if="this.$store.state.production.palletSelected.item[0].unit.name">({{this.$store.state.production.palletSelected.item[0].unit.name}})</span>
                            </div>
                            <!-- <strong style="font-family:'Time'" v-if="this.$store.state.production.palletSelected.destinationDefaultId.length>0">
                                Công đoạn tiếp theo : {{this.$store.state.production.palletSelected.destinationDefaultId[0].name}}
                            </strong> -->
                            <q-select :readonly="!allowSelectDestination" style="font-family:'Time New Roman';font-size:16px" v-model="destinationSelect" behavior="dialog" :options="destinations" label="Xuất đến :" />
                        </q-card-section>
                        <q-separator inset />
                        <q-card-section>
                            <div class="row">
                                <div class="col-6 q-pa-md">
                                    <q-input outlined v-model="passQty" label="SL đạt" />
                                </div>
                                <div class="col-6 q-pa-md">
                                    <q-input outlined v-model="failQty"  readonly="" label="SL Lỗi" />
                                </div>
                            </div>
                            <div class="row">
                                 <q-btn @click="confirm" class="glossy full-width"  color="secondary" label="Xác nhận" />
                            </div>
                        </q-card-section>
                    </q-card>
                  </div>
              </div>
              <!-- <card-itempallet>
                  <div slot="nameOfItem">{{this.$store.state.production.palletSelected.item[0].name}}</div>
                  <div slot="qcOfItem">{{this.$store.state.production.palletSelected.item[0].height+' '+this.$store.state.production.palletSelected.item[0].width+' '+ this.$store.state.production.palletSelected.item[0].length}}</div>
                  <div slot="qtyOfItem">{{this.$store.state.production.palletSelected.inventory}}</div>
              </card-itempallet> -->
          </div>
      </div>
      <q-inner-loading :showing="show">
        <q-spinner-gears size="150px" color="primary" />
      </q-inner-loading>
  </q-page>
</template>

<script>
import InfoFactoryAndFSC from '../../components/prod/InforFactoryAndFSC'
import CardItemPalllet from '../../components/prod/CardItemInPallet'
import TableCOC from '../../components/prod/TableCOC'
import AppBar from '../../components/AppBar'
import { types } from "../../configs/constants"
export default {
    components:{
        'app-bar':AppBar,
        'info-factoryfsc': InfoFactoryAndFSC,
        'card-itempallet': CardItemPalllet,
        'table-coc':TableCOC
    },
    data() {
        return {
            show:false,
            passQty:'',
            failQty:'0',
            destinations:[],
            destinationSelect:null,
            allowSelectDestination:false
        }
    },
    methods:{
        confirm(){
            this.show = true
            const maxQtyAvalibale = this.$store.state.production.palletSelected.inventory
            

            // if (this.$store.state.production.palletSelected.destinationDefaultId.length>0) {
            //     //có destination được định tuyến
            //     desId = this.$store.state.production.palletSelected.destinationDefaultId[0].id
            // }else {
            //     if (this.destinationSelect!==null) {
            //         desId = this.destinationSelect.value
            //     }
            // }
            if (this.destinationSelect!==null&&parseFloat(this.passQty)>0&&parseFloat(this.passQty)<=parseFloat(maxQtyAvalibale)) {
                let payload ={
                    data : {
                        sourceId:this.$store.state.production.sourceSelected.id,
                        destinationId:this.destinationSelect.value,
                        notPass:this.failQty,
                        pass:this.passQty,
                        token:this.$store.state.production.userInfo.token,

                    },
                    palletCode:this.$store.state.production.palletSelected.code
                }
                this.$store.dispatch('production/ACTION_STEP_PALLET',payload).then(res=>{
                    if (res.meta.success===true) {
                        this.$q.notify({
                            message:'Xác nhận thành công !',
                            color:'green'
                        })
                        let desName = this.destinationSelect===null ? this.$store.state.production.palletSelected.destinationDefaultId[0].name : this.destinationSelect.label
                        const topic = this.destinationSelect.value.toString()+'-RECIVED-PALLET'
                        const titleMessage = 'Đã nhận được pallet số '+payload.palletCode
                        const bodyMessgae = 'Nhận được pallet từ công đoạn '+this.$store.state.production.sourceSelected.name+' chuyển đến công đoạn '+desName
                        const path ='/#/production-dashboard?code='+payload.palletCode
                        this.$sendFcm(titleMessage,bodyMessgae,path,topic,{palletCode:payload.palletCode}).then(resp=>{
                            console.log(resp)
                        })
                        this.$router.go(-1)
                    }
                })
            }else {
                this.$q.notify({
                    message:'Thông tin chưa đủ !',
                    color:'red'
                })
                this.show = false
            }
        },
        async initDestination(){
            const payloadGetDes = {
                itemId:this.$store.state.production.palletSelected.item[0].id,
                token:this.$store.state.production.userInfo.token
            }
            await this.$store.dispatch('production/ACTION_GET_DESTINATION_BY_ITEM',payloadGetDes).then(resp=>{
                if (resp.data.length>0) {
                    const desIndex = resp.data.findIndex((d)=>{ return d.id===this.$store.state.production.sourceSelected.id})
                    const defaultDes = {
                        label:resp.data[desIndex+1].name,
                        value:resp.data[desIndex+1].id
                    }
                    this.destinations.push(defaultDes)
                    this.destinationSelect=defaultDes //set côgn đoạn xuất mặc định
                    
                    

                }
                //kiểm tra nếu có tài khoản có gắn công đoạn xuất hàng
                // thì gộp cmn luôn vào
                if (this.$store.getters["base/myDestinations"].length>0) {
                    this.$store.getters["base/myDestinations"].forEach(element => {
                    if (this.destinations.findIndex(d=>{return d.value===element.id})===-1) {
                        const de ={
                        label:element.name,
                        value:element.id
                        }
                        this.destinations.push(de)
                    }
                    });
                }
                //kiểm tra danh sách công đoạn xuất 
                // nếu có nhiều hơn 1 -> cho phép chọn nơi xuất
                if (this.destinations.length===1) {
                    this.allowSelectDestination = true
                    this.destinationSelect = this.destinations[0]
                    this.$q.notify({
                        message:'Hãy chú ý nơi xuất pallet !',
                        color:'orange'
                    })
                }
                this.allowSelectDestination = true
                this.passQty=this.$store.state.production.palletSelected.inventory.toString()
                this.failQty = '0'
            })
        }
    },
    watch:{
        passQty(val){
            let maxQty = parseFloat(this.$store.state.production.palletSelected.inventory)
            if (val.trim()==='') {
                this.failQty='0'
            }else {
                if (val>maxQty) {
                    this.$q.notify({
                        message:'Vượt quá số lượng !',
                        color:'red'
                    })
                    this.failQty='0'
                }else {
                    this.failQty = maxQty-parseFloat(val)
                }
            }
            
        }
    },
    created(){
        this.initDestination()
    },
    beforeMount(){
        console.log(this.$store.state.production.palletSelected)
        if (this.$store.state.production.palletSelected.code===''||this.$store.state.production.palletSelected.code===undefined || this.$store.state.production.palletSelected.code===null) {
            this.$q.notify({
                color:'red',
                message:'Đã xảy ra lỗi !',
                timeout:3000
            })
            this.$router.push('/production-select-source')
        }
    },
}
</script>

<style>
.bg-danger2 {
    background-color: red
}

</style>