<template>
  <q-page class="q-pa-md">
      <div class="row justify-center">
          <div class="col-12" align="center">
            <div style="font-size:14px; font-weight: bold">BIỂU MẪU KIỂM TRA ĐỘ ẨM GỖ SẤY</div>
          </div>
      </div>
      <q-separator></q-separator>
      <div class="row justify-center">
          <div class="col-12 col-sm-6">
              <p>Ngày kiểm tra : <strong>{{mc.createDate}} </strong></p>
              <p>Địa điểm : <strong>{{kilnName}} </strong></p>
              <p>Đơn vị quản lý : <strong>{{factoryName}} </strong></p>
              <p>Mẻ sấy số : <strong>{{mc.data.kilnBatchId}}</strong></p>
              <p>Tổng số lượng mẫu : <strong>{{mc.data.mc.length}} </strong></p>
          </div>
      </div>
      <div class="row justify-center">
        <div class="col-12 col-sm-6">
          <q-card >
            <q-card-section>
              <div class="prodTextTitle">Bảng phân bố độ ẩm</div>
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
                  <td style="text-align:center">Thấp ({{cacmoc[0]}})</td>
                  <td style="text-align:center">{{mc.data.alloc.quantity.thap}}</td>
                  <td style="text-align:center">{{mc.data.alloc.rate.thap}} %</td>
                </tr>
                <tr class="bg-amber-2">
                  <td style="text-align:center"><strong>Đích ({{cacmoc[0]}}-{{cacmoc[1]-1}})</strong></td>
                  <td style="text-align:center">{{mc.data.alloc.quantity.dich}}</td>
                  <td style="text-align:center">{{mc.data.alloc.rate.dich}} %</td>
                </tr>
                <tr style="background-color: yellow;">
                  <td style="text-align:center">Cao({{cacmoc[1]}}-{{cacmoc[2]}})</td>
                  <td style="text-align:center">{{mc.data.alloc.quantity.cao}}</td>
                  <td style="text-align:center">{{mc.data.alloc.rate.cao}} %</td>
                </tr>
                <tr style="background-color: red;">
                  <td style="text-align:center">Rất cao(trên {{cacmoc[2]}})</td>
                  <td style="text-align:center">{{mc.data.alloc.quantity.ratcao}}</td>
                  <td style="text-align:center">{{mc.data.alloc.rate.ratcao}} %</td>
                </tr>
              </table>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row justify-center q-mt-sm">
        <div class="col-12 col-sm-6">
          <table style="width:100%">
            <tr>
              <th>STT</th>
              <th>Độ ẩm</th>
            </tr>
            <tr v-for="(mcdata,index) in mc.data.mc" v-bind:key="index">
              <td style="text-align:center">{{index+1}}</td>
              <td style="text-align:center">{{mcdata}}</td>
            </tr>
          </table>
        </div>
      </div>
  </q-page>
</template>

<script>
import AppBar from '../../components/AppBar'
export default {
  components:{
    'app-bar':AppBar
  },
    data (){
        return {
            mc:[],
            currentKinlBatchId:null,
            doam:'',
            thap:0,
            dich:0,
            cao:0,
            ratcao:0,
            kilnName: null,
            factoryName: null,
            connectionStatus:'',
            confirm:false,
            cachkhac:'',
            cacmoc:[
              7,
              10,
              15
            ],
            group: null,
            showTextCachKhac:false,
            disableOption:false,
            options: [
              {
                label: 'Ra lò',
                value: 'ralo'
              },
              {
                label: 'Sấy tiếp',
                value: 'saytiep'
              },
              {
                label: 'Cách khác',
                value: 'cachkhac'
              }
            ]
        }
    },
    created(){
       this.mc = this.$store.state.production.bbmcSelected;
        console.log("mc", this.mc);
       let batchType = this.$store.state.production.batchs.find((b)=>{ return b.id===this.mc.linkId});
       this.kilnName = batchType.kilnName;
       this.factoryName = batchType.name;
        if (batchType.type==='Outdoor') {
          this.cacmoc =[
            8,14,17
          ]
        }
        if (batchType.type==='SẤY UỐN') {
          this.cacmoc =[
            15,25,30
          ]
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

    }
}
</script>

<style scoped>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>