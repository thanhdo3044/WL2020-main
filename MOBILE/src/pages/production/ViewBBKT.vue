<template>
  <q-page class="q-pa-md">
      <app-bar>BÁO CÁO KHẢO SÁT TỶ LỆ KHUYẾT TẬT SẤY GỖ</app-bar>
      <q-separator></q-separator>
      <div class="row justify-center">
          <div class="col-12 col-sm-6">
              <p class="prodTextNormal">
                  Khảo sát cho mẻ sấy : {{dataKT.kilnBatchId}}
              </p>
              <p class="prodTextNormal">
                  Ngày khảo sát : {{dataKT.createDate}}
              </p>
              <p class="prodTextNormal">
                  Nhà máy :
              </p>
              <p class="prodTextNormal" style="font-weight:800">
                  Tỷ lệ mo , Tóp trung bình  : {{dataKT.data.moRate}} %
              </p>
              <p class="prodTextNormal" style="font-weight:800">
                  Tỷ lệ cong trung bình  : {{dataKT.data.congRate}} %
              </p>
              <p class="prodTextNormal" style="font-weight:800">
                  Tổng khuyết tật  : {{dataKT.data.totalKT}} 
              </p>
          </div>
      </div>
      <div class="row justify-center ">
          <div class="col-12 col-sm-3 q-ma-sm" v-for="(item,index) in dataKT.data.record" v-bind:key="index">
              <q-card class="bg-secondary text-white">
                  <q-card-section>
                      <p class="prodTextNormal">Số plallet : {{item.palletCode}} </p>
                      <p class="prodTextNormal">SL mẫu : {{item.sampleQty}}</p>
                      <p class="prodTextNormal">SL mo, Tóp: {{item.moTopQty}}</p>
                      <p class="prodTextNormal">SL Cong : {{item.congQty}}</p>
                      <p class="prodTextNormal">Tỷ lệ mo, Tóp : {{(item.moTopQty/item.sampleQty*100).toFixed(2)}} %</p>
                      <p class="prodTextNormal">Tỷ lệ cong : {{(item.congQty/item.sampleQty*100).toFixed(2)}} %</p>
                      <p class="prodTextNormal">Ghi chú :{{item.note}}</p>
                  </q-card-section>
              </q-card>
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
            palletCode:'',
            sampleQty:'',
            moTopQty:'',
            congQty:'',
            dataKT:{},
            kilnBatchId:null,
            note:'',
            moRate:0,
            congRate:0,
            totalKT:0,
            confirm:false
        }
    },
    watch:{
        
    },
    created(){
        this.dataKT = this.$store.state.production.bbktSelected
    },
    methods:{
        calRate(){
            this.moRate=0
            this.congRate =0
            this.totalKT =0
            let arrMoTopQty = []
            let arrCongQty = []
            this.dataKT.record.forEach(element => {
                arrMoTopQty.push(element.moTopQty)
                arrCongQty.push(element.congQty)
                this.totalKT+=element.moTopQty+element.congQty
            });
            const  avg  = arr => arr.reduce((a,b) => a + b, 0) / arr.length
            this.moRate = avg(arrMoTopQty).toFixed(2)
            this.congRate = avg(arrCongQty).toFixed(2)
            this.dataKT.congRate = this.congRate
            this.dataKT.moRate = this.moRate
            this.dataKT.totalKT = this.totalKT
        },
    }
}
</script>

<style>

</style>