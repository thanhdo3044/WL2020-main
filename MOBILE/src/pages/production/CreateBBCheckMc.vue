<template>
  <q-page class="q-pa-md">
      <div class="row justify-center">
          <div class="col-12" align="center">
            <div style="font-size:14px; font-weight: bold">BIỂU MẪU KIỂM TRA ĐỘ ẨM GỖ SẤY</div>
          </div>
      </div>
      <hr style="width:50%">
      <div class="row justify-center">
          <div class="col-12 col-sm-6">
              <p>Ngày kiểm tra : <strong>{{new Date().toISOString().slice(0,10)}} </strong></p>
              <p>Địa điểm : <strong>{{kilnName}} </strong></p>
              <p>Đơn vị quản lý : <strong>{{ factoryName }} </strong></p>
              <p>Mẻ sấy số : <strong>{{currentKinlBatchId}}</strong></p>
              <p>Tổng số lượng mẫu : <strong>{{mc.length}} </strong></p>
          </div>
      </div>
      <div class="row justify-center">
        <div class="col-12 col-sm-6">
          <q-card >
            <q-card-section>
              <div class="prodTextTitle">Phân bố độ ẩm: {{mucDich}} </div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section>
              <table style="width:100%">
                <tr>
                  <th>Độ ẩm(MC%)</th>
                  <th>SL Mẫu</th>
                  <th>Tỷ lệ</th>
                </tr>
                <tr>
                  <td style="text-align:center">Thấp (nhỏ hơn {{cacmoc[0]}})</td>
                  <td style="text-align:center">{{thap}}</td>
                  <td v-if="mc.length == 0" style="text-align:center">-</td>
                  <td v-else style="text-align:center">{{(thap/mc.length*100).toFixed(2)}} %</td>
                </tr>
                <tr class="bg-amber-2">
                  <td style="text-align:center"><strong>Đích ({{cacmoc[0]}}-{{cacmoc[1]-1}})</strong></td>
                  <td style="text-align:center">{{dich}}</td>
                  <td v-if="mc.length == 0" style="text-align:center">-</td>
                  <td v-else style="text-align:center">{{(dich/mc.length*100).toFixed(2)}} %</td>
                </tr>
                <tr style="background-color: yellow;">
                  <td style="text-align:center">Cao({{cacmoc[1]}}-{{cacmoc[2]}})</td>
                  <td style="text-align:center">{{cao}}</td>
                  <td v-if="mc.length == 0" style="text-align:center">-</td>
                  <td v-else style="text-align:center">{{(cao/mc.length*100).toFixed(2)}} %</td>
                </tr>
                <tr style="background-color: red;">
                  <td style="text-align:center">Rất cao(trên {{cacmoc[2]}})</td>
                  <td style="text-align:center">{{ratcao}}</td>
                  <td v-if="mc.length == 0" style="text-align:center">-</td>
                  <td v-else style="text-align:center">{{(ratcao/mc.length*100).toFixed(2)}} %</td>
                </tr>
              </table>
              <span v-if="mucDich === 'INDOOR'" class="text-orange" style="font-size:10px; font-weight:bold">{{ghiChuInDoor}}</span>
              <span v-if="mucDich === 'OUTDOOR'" class="text-orange" style="font-size:10px; font-weight:bold">{{ghiChuOutDoor}}</span>
              <span v-if="mucDich === 'SẤY UỐN'" class="text-orange" style="font-size:10px; font-weight:bold">{{ghiChuUon}}</span>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row justify-center q-mt-sm">
        <div class="col-4">
          <q-input v-on:keyup.enter="add" outlined v-model.number="doam" label="Độ ẩm " />
        </div>
        <div class="col-4">
          <q-btn color="primary" @click="add" glossy label="Ghi nhận độ ẩm" style="    height: 100%;
    margin-left: 10px;
    width: 90%; font-size:10px" />
        </div>
        <div class="col-4">
           <q-btn color="secondary" @click="confirm=true" label="Hoàn thành" style="margin-left: 10px;width: 90%;" />
        </div>
      </div>
      <div class="row justify-center q-mt-sm">
        <div class="col-12 col-sm-6">
          <table style="width:100%">
            <tr>
              <th>STT</th>
              <th>Độ ẩm</th>
              <th style="width:50px">Xóa</th>
            </tr>

            <tr v-for="(mcdata,index) in mc" v-bind:key="index">
              <td style="text-align:center">{{index+1}}</td>
              <td style="text-align:center">{{mcdata}}</td>
              <td><button v-on:click="deleteMC(index)">delete</button></td>
            </tr>
          </table>
        </div>
      </div>
      <q-dialog style="min-width:300px" v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Xác nhận hoàn thành !</span>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div class="col-12">
            <strong>Kết luận : </strong>
          </div>
          <div class="col-12">
            <q-option-group
                v-model="group"
                :options="options"
                color="primary"
                inline
              />
          </div>
          <div v-show="showTextCachKhac" class="col-12">
            <q-input outlined v-model="cachkhac" label="Hướng xử lý " />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat @click="save" label="Đồng ý" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {bienban} from '../../configs/constants'
export default {
    data (){
        return {
            mc:[],
            currentKinlBatchId:null,
            doam:'',
            kilnName: null,
            factoryName: null,
            thap:0,
            dich:0,
            cao:0,
            ratcao:0,
            mucDich: null,
            connectionStatus:'',
            confirm:false,
            cachkhac:'',
            group: null,
            ghiChuInDoor: "Ghi chú: INDOOR: MC<10% chiếm tỉ lệ ≥85%, OUTDOOR: MC<14% chiếm tỉ lệ ≥85% thì cho ra lò.",
            ghiChuOutDoor: "Ghi chú: INDOOR: MC<10% chiếm tỉ lệ ≥85%, OUTDOOR: MC<14% chiếm tỉ lệ ≥85% thì cho ra lò.",
            ghiChuUon: "Ghi chú: Uốn: MC<25% chiếm tỉ lệ ≥90% thì cho ra lò.",
            showTextCachKhac:false,
            disableOption:false,
            cacmoc:[
              7,
              10,
              15
            ],
            options: []
        }
    },
    created(){
        let kilnBatchId1 = this.$route.params.kinlbatchid
        this.currentKinlBatchId = kilnBatchId1;
        let today = new Date().toISOString()
        let batchType = this.$store.state.production.batchs.find((b)=>{ return b.id===kilnBatchId1});
        this.kilnName = batchType.kilnName;
        this.factoryName = batchType.name;
        console.log("batchType", batchType);
        this.mucDich = batchType.type;
        if (batchType.type==='OUTDOOR') {
          this.cacmoc =[
            8,14,17
          ]
        }
        if (batchType.type==='SẤY UỐN') {
          this.cacmoc =[
            15,25,30
          ]
        }
        
        if (kilnBatchId1) {
            const dataLocal = localStorage.getItem('mc'+kilnBatchId1)
            console.log(dataLocal)
            if (dataLocal) {
                let mcLocal = JSON.parse(dataLocal)
                this.mc=mcLocal
                mcLocal.forEach(element => {
                  if (parseInt(element)<this.cacmoc[0]) {
                      this.thap+=1
                    }else if(parseInt(element)<this.cacmoc[1]){
                      this.dich+=1
                    }else if(parseInt(element)<=this.cacmoc[2]){
                      this.cao+=1
                    }else {
                      this.ratcao+=1
                  }
                });
            }
        }
        if(this.mc.length <= 50){
          if((this.thap + this.dich)/50 >= 0.85){
            this.options = [];
            this.options.push(
              {
                label: 'Ra lò',
                value: 'ralo'
              });
            console.log("option if ", this.options);
          }else{
            this.options = [];
            this.options.push(
              {
                label: 'Sấy tiếp',
                value: 'saytiep'
              },
              {
                label: 'Cách khác',
                value: 'cachkhac'
              });
              console.log("option else ", this.options);
          }
        }else{
           if((this.thap + this.dich)/this.mc.length >= 0.85){
            this.options = [];
            this.options.push(
              {
                label: 'Ra lò',
                value: 'ralo'
              });
            console.log("option if ", this.options);
          }else{
            this.options = [];
            this.options.push(
              {
                label: 'Sấy tiếp',
                value: 'saytiep'
              },
              {
                label: 'Cách khác',
                value: 'cachkhac'
              });
              console.log("option else ", this.options);
          }
        }
        
        
    },
    watch: {
      confirm(val){
        if (val) {
          let tonggate = parseInt(this.dich+this.thap)/this.mc.length
          if (tonggate>=0.9) {
            this.group='ralo'
            this.disableOption = true
          }else{
            this.group='saytiep'
            this.disableOption = false
          }
        }
      },
      group(val){
        if (val==='cachkhac') {
          this.showTextCachKhac = true
        }else {
          this.showTextCachKhac = false
        }
      }
    },
    methods:{
      async save(){
        if(navigator.onLine){
          this.$q.loading.show()
          let payload ={
            kilnBatchId:this.currentKinlBatchId,
            type:bienban.BB_KIEM_TRA_DO_AM_LO_SAY,
            linkId:this.currentKinlBatchId,
            linkType:'kilnBatch',
            mc:this.mc,
              alloc:{
                quantity:{
                  thap:this.thap,
                  dich:this.dich,
                  cao:this.cao,
                  ratcao:this.ratcao
                },
                rate:{
                  thap:(this.thap/this.mc.length*100).toFixed(2),
                  dich:(this.dich/this.mc.length*100).toFixed(2),
                  cao:(this.cao/this.mc.length*100).toFixed(2),
                  ratcao:(this.ratcao/this.mc.length*100).toFixed(2)
                }
              },
              result:{
                type:this.group,
                note:this.cachkhac
              }
          }
          let data = await this.$store.dispatch('production/ACTION_CREATE_BB_MC',payload)
          
          this.$q.loading.hide()
          if (data.meta.success===true) {
            this.$q.notify({
              message:'Tạo biên bản thành công !',
              color:'green'
            })
            localStorage.setItem('mc'+this.currentKinlBatchId,'[]')
            if (this.group==='ralo') {
              
              const payload ={
                  batchId:this.$store.state.production.batchSelected.id,
                  data:{
                      token:this.$store.state.production.userInfo.token,
                      humidity:(this.thap+this.dich)/this.mc.length*100,
                      state:'ok'
                  }
              }
              this.$store.dispatch('production/ACTION_QC_CONFIRM_BATCH',payload).then(res=>{
                if (res.meta.success===true) {
                  this.$router.go(-1)
                  this.showButtonComfirmBatch = true
                  }else {
                      this.$q.notify({
                          message:res.meta.messages.message,
                          color:'red'
                      })
                  }
                }).catch(err=>{
                  console.log(err)
                  this.$q.notify({
                      message:err,
                      color:'red'
                  })
                })
            }
            this.$router.go(-1)
          }else {
            this.$q.notify({
              message:data.meta.messages.message,
              color:'red'
            })
          }
        }else{
        this.connectionStatus = "Không có kết nối internet";	
        this.$q.notify({
          message:this.connectionStatus,
          color:'red'
        })
        }
      },
      deleteMC(index){
        let mcData = this.mc[index];
        if (parseInt(mcData)<this.cacmoc[0]) {
              this.thap-=1
            }else if(parseInt(mcData)<this.cacmoc[1]){
              this.dich-=1
            }else if(parseInt(mcData)<this.cacmoc[2]){
              this.cao-=1
            }else {
              this.ratcao-=1
          }
          if(this.mc.length <= 50){
          if((this.thap + this.dich)/50 >= 0.85){
            this.options = [];
            this.options.push(
              {
                label: 'Ra lò',
                value: 'ralo'
              });
            console.log("option if ", this.options);
          }else{
            this.options = [];
            this.options.push(
              {
                label: 'Sấy tiếp',
                value: 'saytiep'
              },
              {
                label: 'Cách khác',
                value: 'cachkhac'
              });
              console.log("option else ", this.options);
          }
        }else{
           if((this.thap + this.dich)/this.mc.length >= 0.85){
            this.options = [];
            this.options.push(
              {
                label: 'Ra lò',
                value: 'ralo'
              });
            console.log("option if ", this.options);
          }else{
            this.options = [];
            this.options.push(
              {
                label: 'Sấy tiếp',
                value: 'saytiep'
              },
              {
                label: 'Cách khác',
                value: 'cachkhac'
              });
              console.log("option else ", this.options);
          }
        }
        this.mc.splice(index, 1);
      },
      add(){
        if (parseInt(this.doam)>0&&parseInt(this.doam)<30) {
          this.mc.push(this.doam)
          localStorage.setItem('mc'+this.currentKinlBatchId,JSON.stringify(this.mc))
          if (parseInt(this.doam)<this.cacmoc[0]) {
              this.thap+=1
            }else if(parseInt(this.doam)<this.cacmoc[1]){
              this.dich+=1
            }else if(parseInt(this.doam)<=this.cacmoc[2]){
              this.cao+=1
            }else {
              this.ratcao+=1
          }
          if(this.mc.length <= 50){
          if((this.thap + this.dich)/50 >= 0.85){
            this.options = [];
            this.options.push(
              {
                label: 'Ra lò',
                value: 'ralo'
              });
            console.log("option if ", this.options);
          }else{
            this.options = [];
            this.options.push(
              {
                label: 'Sấy tiếp',
                value: 'saytiep'
              },
              {
                label: 'Cách khác',
                value: 'cachkhac'
              });
              console.log("option else ", this.options);
          }
        }else{
           if((this.thap + this.dich)/this.mc.length >= 0.85){
            this.options = [];
            this.options.push(
              {
                label: 'Ra lò',
                value: 'ralo'
              });
            console.log("option if ", this.options);
          }else{
            this.options = [];
            this.options.push(
              {
                label: 'Sấy tiếp',
                value: 'saytiep'
              },
              {
                label: 'Cách khác',
                value: 'cachkhac'
              });
              console.log("option else ", this.options);
          }
        }
        }else {
          this.$q.notify({
            message:'Số lượng nhập vào không chính xác !',
            color:'red'
          })
        }
        this.doam=''
      }
    }
}
</script>

<style scoped>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>