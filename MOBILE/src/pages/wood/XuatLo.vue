<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-sm-6 q-ma-sm">
        <q-card class="q-pa-md">
          <div class="row">
            <div class="col-12">
              <p class="prodTextTitle">Xuất Số Lô</p>
            </div>
          </div>
          <div class="row">
            <div class="col-8 q-pa-xs">
              <q-input @clear="clearCode" clearable outlined v-model.number="palletCode" label="Số Lô" />
            </div>
            <div v-if="showButtonCheck" class="col-4 q-pa-xs">
              <q-btn
                class="full-width"
                style="height: 100%;"
                label="Kiểm tra"
                stack
                glossy
                @click="check"
                color="blue"
              />
            </div>
            <div v-else class="col-4 q-pa-sm justify-center">
              <q-spinner-ios color="primary" size="4em" />
            </div>
          </div>
        </q-card>
      </div>
    </div>
    <div v-if="showFakeKeyboard" class="row justify-center q-mt-md">
      <div class="col-12 col-sm-6" >
        <div class="row justify-center" style="text-align: center;">
          <div class="col-4 q-ms-sm" v-for="number in 12" :key="number">
            <div v-if="number<10" @click="inputCode(number)" class="fakeKeyboard">{{number}}</div>
            <div v-if="number===11" @click="inputCode(0)" class="fakeKeyboard">0</div>
            <div @click="backspace" style="background-color: #f5a278" v-if="number===10" class="fakeKeyboard">
              <q-icon  name="backspace"  style="font-size: 32px;" />
            </div>
            <div v-if="number===12" style="background-color:red" @click="clearInput" class="fakeKeyboard">Xóa</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showPallet" class="row justify-center">
     
      <div class="col-12 col-sm-6 q-ma-sm">
        <q-card>
          <q-card-section>
              <p class="prodTextTitle">{{pallet.item[0].name}}</p>
              <p>QC: {{pallet.item[0].height+' '+
                  pallet.item[0].width+' '+
                    pallet.item[0].length}} x {{pallet.inventory}}</p>
              
              <q-select :readonly="!allowSelectDestination"  style="font-family:'Time New Roman';font-size:16px" v-model="destination" behavior="dialog" :options="destinations" label="Công đoạn tiếp theo : :" />
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
              <div v-show="showButtonStockOut" class="row">
                    <q-btn @click="validate" class="glossy full-width"  color="secondary" label="Xuất Pallet" />
              </div>
          </q-card-section>
      </q-card>
      </div>
    </div>
    <div v-else class="row q-pa-sm justify-center">
      <div v-if="!showButtonCheck" class="col-12 justify-centerquas" style="text-align:center;min-height:300px">
        <q-spinner-ios color="primary" size="4em" />
      </div>
    </div>
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn ? !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" color="primary" @click="confirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import TableCOC from "../../components/prod/TableCOC";
import { showNotifyError } from '../../utils/utils';
export default {
  components: {
    "table-coc": TableCOC
  },
  data() {
    return {
      palletCode: "",
      showButtonCheck: true,
      pallet:{},
      showFakeKeyboard:true,
      destinations:[],
      destination:null,
      showPallet:false,
      mySources:[],
      passQty:'',
      failQty:'',
      showButtonRecive:false,
      toStep:{},
      showButtonStockOut:false,
      showDialog:false,
      myStep:null,
      allowSelectDestination:false
    };
  },
  created(){
    const queryPalletCode = this.$route.query.code;
    if (queryPalletCode&&queryPalletCode.length===8) {
      this.palletCode=queryPalletCode
      const payload = {
        token: this.$store.state.production.userInfo.token,
        palletCode: queryPalletCode.trim()
      };
      this.loaData(payload)
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
  methods:{
    loaData(payload){
      this.allowSelectDestination = false
      this.showPallet = false
      this.destinations=[]
      this.destination=null
      this.$store.dispatch("production/ACTION_GET_DETAIL_PALLET", payload)
        .then(res => {
          if (res.meta.success === true) {
            this.pallet = res.data;
            
            let isExist = false;
            const palletToDestiantionId = res.data.step.slice(-1).pop();
            let packagePallet = palletToDestiantionId.package.find(p=>{return p.destinationId===palletToDestiantionId.stepNextId})
            this.mySources = this.$store.getters["base/mySources"]
            this.myStep =this.mySources.find(s=>{return s.id===palletToDestiantionId.stepNextId})
            //Kiểm tra user có quyền nhận pallet này hay không
            if (this.mySources.findIndex(s=>{return s.id===palletToDestiantionId.stepNextId})!==-1) {
              //kiểm tra đã nhận pallet chưa
              if (packagePallet.verifyBy) { 
                //Nếu đã nhận-> cho phep xuất
                this.showButtonStockOut=true
                const payloadGetDes = {
                  itemId:this.pallet.item[0].id,
                  token:this.$store.state.production.userInfo.token
                }
                if (res.data.destinationDefaultId.length>0) {
                    const destinationDefaulByPallet = res.data.destinationDefaultId[0]
                    this.destinations.push({
                        label:destinationDefaulByPallet.name,
                        value:destinationDefaulByPallet.id
                    })
                    this.destination = this.destinations[0]
                }else{
                    showNotifyError('Lệnh sản xuất theo số lô này chưa được định tuyến')
                }
                
                // this.$store.dispatch('production/ACTION_GET_DESTINATION_BY_ITEM',payloadGetDes).then(resp=>{
                //   if (resp.data.length>0) {
                //     const desIndex = resp.data.findIndex((d)=>{ return d.id===palletToDestiantionId.stepNextId})
                //     const defaultDes = {
                //       label:resp.data[desIndex+1].name,
                //       value:resp.data[desIndex+1].id
                //     }
                //     this.destinations.push(defaultDes)
                //     this.destination=defaultDes //set côgn đoạn xuất mặc định
                //   }
                  //kiểm tra nếu có tài khoản có gắn công đoạn xuất hàng
                  // thì gộp cmn luôn vào

                  // không cho phép xuất ngoài định tuyến 2020-03-15
                //   if (this.$store.getters["base/myDestinations"].length>0) {
                //     this.$store.getters["base/myDestinations"].forEach(element => {
                //       if (this.destinations.findIndex(d=>{return d.value===element.id})===-1) {
                //         const de ={
                //           label:element.name,
                //           value:element.id
                //         }
                //         this.destinations.push(de)
                //       }
                //     });
                //   }

                  //kiểm tra nếu có nhiều hơn 1 nơi xuất
                  // đưa ra cảnh báo
                //   if (this.destinations.length>1) {
                //     this.allowSelectDestination = true
                //       this.$q.notify({
                //         message:'Hãy chú ý nơi xuất pallet !',
                //         color:'orange'
                //     })
                //   }
                //   if (this.destinations.length===0) {
                //     //Nếu không có công đoạn xuất hàng theo định tuyến sản phẩm
                //     //không cho xuất
                //     this.$q.notify({
                //       message:'Không tìm thấy công đoạn tiếp theo ! Vui lòng kiểm tra lại',
                //       color:'red',
                //       position:'center'
                //     })
                //     this.showPallet = false
                //   }
                //   if (this.destinations.length===1) {
                //     this.destination=this.destinations[0]
                //   }
                // })
                this.showFakeKeyboard = false
              }else {
                //Nếu pallet chưa được nhận chuyển
                //Chuyển hướng về nhận pallet
                this.$q.notify({
                  message:'Pallet này chưa được nhận !',
                  color:'warnning'
                }) 
                setTimeout(() => {
                  this.$router.push('/production-dashboard?code='+this.pallet.code+'&path=xuat-so-lo?code='+this.pallet.code)
                }, 1000);
              }
            }else {
              this.showButtonStockOut=false
              this.$q.notify({
                message:'Bạn không có quyền xuất pallet này !',
                color:'red'
              })
              
            }
          } else {
            this.$q.notify({
              message: res.meta.messages.message,
              color: "red"
            });
          }
          this.showButtonCheck = true;
          this.showPallet = true;
        })
        .catch(err => {
          console.log(err);
          this.$q.notify({
              message: 'Không tìm thấy pallet',
              color: "red"
            });
            this.showPallet= false
            this.showButtonCheck = true
            this.palletCode=''
        });
    },
    validate(){
      if (this.destination!==null&&this.passQty>0) {
        this.showDialog = true
      }else {
        this.$q.notify({
          message:'Dữ liệu không chính xác !',
          color:'red',
          position:'center'
        })
        this.showDialog = false
      }
    },
    checkPalletRecived(){

    },
    confirm(){
      this.showDialog = false
      this.showPallet = false
      this.showButtonCheck = false
      const maxQtyAvalibale = this.pallet.inventory
      if (parseFloat(this.passQty)>0&&parseFloat(this.passQty)<=parseFloat(maxQtyAvalibale)) {
        let payload ={
            data : {
                sourceId:this.myStep.id,
                destinationId:this.destination.value,
                notPass:this.failQty,
                pass:this.passQty,
                token:this.$store.state.production.userInfo.token,

            },
            palletCode:this.pallet.code
        }
        this.$store.dispatch('production/ACTION_STEP_PALLET',payload).then(res=>{
            if (res.meta.success===true) {
                this.$q.notify({
                    message:'Xác nhận thành công !',
                    color:'green'
                })
                let desName = this.destination.label
                const topic = this.destination.value.toString()+'-RECIVED-PALLET'
                const titleMessage = 'Đã nhận được pallet số '+payload.palletCode
                const bodyMessgae = 'Nhận được pallet từ công đoạn '+this.myStep.name+' chuyển đến công đoạn '+desName
                const path ='/#/production-dashboard?code='+payload.palletCode
                this.$sendFcm(titleMessage,bodyMessgae,path,topic,{palletCode:payload.palletCode}).then(resp=>{
                    console.log(resp)
                })
                this.showPallet=false
                this.pallet=null
                this.destinations=[]
                this.destination=null
                this.palletCode = ''
                this.showButtonCheck = true
                this.showFakeKeyboard = true

                if (parseFloat(this.failQty)>0) {
                  //Gửi thông báo cho qc nhà máy
                  const quicachloi = this.pallet.item[0].height+' '+this.pallet.item[0].width+' '+this.pallet.item[0].length
                  const myFactoryId = this.$store.getters['base/myFactoryInfor'].id
                  const topicQC = myFactoryId+'-QC'
                  const titleMessageQC = 'Phát sinh lỗi tại công đoạn '+this.myStep.name
                  const bodyMessgaeQC = 'Nhận được Qui cách : '+quicachloi+'   Số lượng : '+this.failQty
                  const pathQC ='/#/production-qc-inspection'
                  this.$sendFcm(titleMessageQC,bodyMessgaeQC,pathQC,topicQC)
                }
                
                
            }else {
              this.$q.notify({
                message:res.meta.messages.message || res.meta.messages.originalError.info.message,
                color:'red'
              })
              this.showButtonCheck = true
            }
        })
    }else {
        this.$q.notify({
            message:'Dữ liệu không chính xác , Vui lòng kiểm tra lại !',
            color:'red'
        })
        this.showPallet = true
        this.showButtonCheck = true
    }
    },
    clearCode(val){
      this.showPallet=false
      this.pallet = null
      this.showFakeKeyboard = true
    },
    clearInput(){
      this.palletCode=''
    },
    backspace(){
      if (this.palletCode.length>0) {
        this.palletCode = this.palletCode.toString().slice(0,-1)
      }
    },
    
    inputCode(numb){
      if (this.palletCode===null) {
        this.palletCode=''
      }
      this.palletCode+=numb.toString()
    },
    check(){
      if (this.palletCode.toString().length === 8) {
        this.showFakeKeyboard = false
        this.showButtonCheck = false;
        const payload = {
          token: this.$store.state.production.userInfo.token,
          palletCode: this.palletCode
        };
        this.loaData(payload)
      } else {
        this.$q.notify({
          message: "Số pallet không chính xác !",
          color: "red"
        });
      }
    }
  }
};
</script>

<style>
</style>