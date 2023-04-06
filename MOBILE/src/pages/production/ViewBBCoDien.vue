<template>
  <q-page class="q-pa-sm">
     <app-bar> BIÊN BẢN KIỂM TRA LÒ SẤY</app-bar>
      <div class="row justify-center">
          <div class="col-12 col-sm-6">
            <q-separator></q-separator>
            <br>
        </div>
      </div>
      <div class="row justify-center">
          <div class="col-12 col-sm-6 col-md-4 col-lg-3 q-ma-xs" v-for="(item,index) in data" v-bind:key="item.id">
              <q-card>
                  <q-card-section>
                      <strong style="font-family: 'Time New Roman';"> {{index+1}} .{{item.checkName}}</strong>
                  </q-card-section>
                  <q-separator></q-separator>
                  <q-card-section>
                      <div class="row">
                         <div class="col-8">
                              <p class="prodTextNormal">
                                {{item.require}}
                            </p>
                         </div>
                        <div class="col-4">
                             <q-checkbox disable  @input="changeStatus"  v-model="item.status" label="ĐẠT" />
                        </div>
                      </div>
                      <div class="row">
                         
                      </div>
                  </q-card-section>
              </q-card>
          </div>
      </div>
      <div class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <p style="font-family: 'Time New Roman';font-style: italic;">Ghi chú : Lò sấy chỉ được phép hoạt động khi đáp ứng tất cả các yêu cầu trên đây.</p>
              <q-separator></q-separator>
              <div class="prodTextTitle q-mt-sm">
                  <strong>Kết luận : </strong> <strong v-if="resultCode==='NG'" style="color:red">{{resultMessage}}</strong>
                  <strong v-else style="color:green">{{resultMessage}}</strong>
              </div>
          </div>
      </div>
  </q-page>
</template>

<script>
import AppBar from '../../components/AppBar'
import { QSpinnerFacebook } from 'quasar'
import {bienban} from '../../configs/constants'
export default {
    components:{
        'app-bar':AppBar
    },
    data (){
        return {
            totalCheck:0,
            data :[
                {
                    checkName:'Hệ thống quạt lò',
                    require:'Tất cả các động cơ phải hoạt động tốt',
                    status:false,
                    id:1
                },
                {
                    checkName:'Hệ thống gia nhiệt',
                    require:'Hoạt động tốt',
                    status:false,
                    id:2
                },{
                    checkName:'Hệ thống điều tiết ẩm',
                    require:'Hoạt động tốt',
                    status:false,
                    id:3
                },{
                    checkName:'Van hơi',
                    require:'Kín, không bị rò rỉ',
                    status:false,
                    id:4
                },{
                    checkName:'Van nước hồi',
                    require:'Kín, không bị  rò rỉ',
                    status:false,
                    id:5
                },{
                    checkName:'Trần lò',
                    require:'Kín, không thủng',
                    status:false,
                    id:6
                },{
                    checkName:'Cửa lò',
                    require:'Kín, không hở',
                    status:false,
                    id:7
                },{
                    checkName:'Giấy Xenlulo (cảm biến ẩm, môi trường)',
                    require:'Hoạt động tốt',
                    status:false,
                    id:8
                },{
                    checkName:'Cửa ven',
                    require:'Hoạt động tốt',
                    status:false,
                    id:9
                },{
                    checkName:'Đinh, dây đo độ ẩm',
                    require:'Hoạt động tốt',
                    status:false,
                    id:10
                },{
                    checkName:'Thiết bị điều khiển sấy',
                    require:'Hoạt động tốt',
                    status:false,
                    id:11
                },{
                    checkName:'Vệ sinh lò sấy',
                    require:'Sạch sẽ , không có các vật thể lạ trong lò',
                    status:false,
                    id:12
                },{
                    checkName:'Không bị rò rỉ nước',
                    require:'Giàn nhiệt kín không bị rò rỉ nước',
                    status:false,
                    id:13
                },
            ],
            resultMessage:'Mẻ sấy chưa đạt tiêu chuẩn để hoạt động',
            resultCode:'NG',
            kilnBatchId:null
        }
    },
    created(){
        let dataStore =this.$store.state.production.bbCoDienSelected
        this.data = JSON.parse(dataStore.data.data)
        this.resultMessage=dataStore.data.resultMessage
        this.resultCode = dataStore.data.resultCode
        this.totalCheck=dataStore.data.totalCheck
    },
    methods:{
        async pushBB(){
            let payload = {
                type:bienban.BB_KIEM_TRA_LO_SAY,
                data:this.data,
                linkId:this.kilnBatchId,
                linkType:'kilnBatch',
                resultCode:this.resultCode,
                resultMessage:this.resultMessage,
                totalCheck:this.totalCheck
            }
            if(navigator.onLine){
                this.$q.loading.show({
                    QSpinnerFacebook
                })
                 let data = await this.$store.dispatch('production/ACTION_CREATE_BB_MC',payload)
                
                if (data.meta.success===true) {
                    this.$q.notify({
                        message:'Tạo biên bản thành công !',
                        color:'green'
                    })
                    if (this.totalCheck>=13) {
                        let factoryId = this.$store.getters["base/myFactoryInfor"].id
                        const topic = factoryId+'-LOSAY'
                        const titleMessage = 'Đã có biên bản kiểm tra lò sấy'
                        const bodyMessgae = this.resultMessage
                        const path ='/'
                        this.$sendFcm(titleMessage,bodyMessgae,path,topic,{}).then(res=>{
                            console.log('send fcm success',res)
                        }).catch(err=>{
                            console.log('send Error: '+err)
                        })
                    }
                    this.$q.loading.hide()
                    localStorage.setItem('bbktls'+this.kilnBatchId,'')
                    this.$router.go(-1)
                }else {
                    this.$q.notify({
                        message:data.meta.messages.message,
                        color:'red'
                    })
                }
            }else {
                this.$q.notify({
                    message:'Không có kết nối internet',
                    color:'red'
                })
            }
        },
        changeStatus(val){
            if (val) {
                this.totalCheck++
            }else{
                this.totalCheck--
            }
            this.saveDataToLocal()
        },
        saveDataToLocal(){
            let dataSave = {
                totalCheck:this.totalCheck,
                resultCode:this.resultCode,
                resultMessage: this.resultMessage,
                kinlbatchid:this.kilnBatchId,
                data:this.data
            }
            localStorage.setItem('bbktls'+this.kilnBatchId,JSON.stringify(dataSave))
        }
    },
    watch:{
        
    }
}
</script>

<style>

</style>