<template>
  <q-page class="q-pa-md">
      <div class="row justify-center">
          <div class="col-8 col-sm-6">
              <p class="prodTextTitle">BÁO CÁO KHẢO SÁT TỶ LỆ KHUYẾT TẬT SẤY GỖ</p>
          </div>
          <div class="col-4">
              <q-btn color="secondary" @click="confirm=true" label="Hoàn thành" />
          </div>
      </div>
      <q-separator></q-separator>
      <div class="row justify-center">
          <div class="col-12 col-sm-6">
              <p class="prodTextNormal">
                  Khảo sát cho mẻ sấy : {{kilnBatchId}}
              </p>
              <p class="prodTextNormal">
                  Ngày khảo sát : {{new Date().toISOString().slice(0,10)}}
              </p>
              <p class="prodTextNormal">
                  Nhà máy :
              </p>
              <p class="prodTextNormal" style="font-weight:800">
                  Tỷ lệ mo , Tóp trung bình  : {{moRate}} %
              </p>
              <p class="prodTextNormal" style="font-weight:800">
                  Tỷ lệ cong trung bình  : {{congRate}} %
              </p>
              <p class="prodTextNormal" style="font-weight:800">
                  Tổng khuyết tật  : {{totalKT}} 
              </p>
          </div>
      </div>
      <q-separator></q-separator>
      <div class="row justify-center">
          <div class="col-12 col-sm-6">
              <q-card>
                  <q-card-section>
                      <p class="prodTextTitle">Nhập thông tin khảo sát</p>
                  </q-card-section>
                  <q-separator></q-separator>
                  <q-card-section>
                      <q-input clearable type="number" outlined v-model.number="palletCode" label="Số pallet" />
                      <br>
                      <q-input clearable type="number" outlined v-model.number="sampleQty" label="Số lượng mẫu" />
                      <br>
                      <q-input clearable type="number" outlined v-model.number="moTopQty" label="SL Mo,Tóp" />
                      <br>
                      <q-input clearable type="number" outlined v-model.number="congQty" label="SL Cong" />
                      <br>
                      <q-input
                            v-model="note"
                            outlined
                            clearable
                            type="textarea"
                            />
                        <br>
                       <q-btn @click="add" class="full-width" color="deep-orange" glossy label="Ghi nhận" />
                  </q-card-section>
              </q-card>
          </div>
      </div>
      <div class="row justify-center ">
          <div class="col-12 col-sm-3 q-ma-sm" v-for="(item,index) in dataKT.record" v-bind:key="index">
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
      <q-dialog  v-model="confirm" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="prodTextTitle">Bạn đã chắc chắn !.</span>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
            <p class="prodTextNormal">- Dữ liệu được lưu lại tự động </p>
            <p class="prodTextNormal">- Sau khi hoàn thành biên bản sẽ không thể chỉnh sửa "Hãy cân nhắc"</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn @click="save" flat label="Đồng ý" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import {bienban}  from '../../configs/constants'
export default {
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
        this.kilnBatchId = this.$route.params.kinlbatchid
        let dataKTLocal = localStorage.getItem('kt'+this.kilnBatchId)
        if (dataKTLocal!==null&&dataKTLocal!==undefined&&dataKTLocal.toString()!=='null') {
            let parserJsonLocal = JSON.parse(dataKTLocal)
            this.dataKT = parserJsonLocal
            if (this.dataKT) {
                this.calRate()
            }
        }else {
            this.dataKT = {
                type:bienban.BB_KHAO_SAT_KHUYET_TAT_LO_SAY,
                linkId:this.kilnBatchId,
                linkType:'kilnBatch',
                record:[]
            }
        }
    },
    methods:{
        calRate(){
            this.moRate=0;
            this.congRate =0;
            this.totalKT =0;
            let sumMoTopQty = 0;
            let sumCongQty = 0;
            let sampleQty = 0;
            this.dataKT.record.forEach(element => {
                sumMoTopQty += element.moTopQty
                sumCongQty += element.congQty
                this.totalKT+=element.moTopQty+element.congQty
                sampleQty = element.sampleQty
            });
            this.moRate = (sumMoTopQty/sampleQty*100).toFixed(2)
            this.congRate = (sumCongQty/sampleQty*100).toFixed(2)
            this.dataKT.congRate = this.congRate
            this.dataKT.moRate = this.moRate
            this.dataKT.totalKT = this.totalKT
        },
        async save(){
            if (this.dataKT.record.length>0) {
                if(navigator.onLine){
                    this.$q.loading.show()
                   
                    let data = await this.$store.dispatch('production/ACTION_CREATE_BB_KT',this.dataKT)
                    this.$q.loading.hide()
                    if (data.meta.success===true) {
                        this.$q.notify({
                            message:'Lưu biên bản thành công !',
                            color:'green'
                        })
                        localStorage.setItem('kt'+this.kilnBatchId,null)
                        this.$router.go(-1)
                    }
                    else {
                        this.$q.notify({
                            message:data.meta.messages.message,
                            color:'red'
                        })
                    }
                }
                else {
                    this.$q.notify({
                        message:'Không có kết nối Internet !',
                        color:'red'
                    })
                }
                
                
            }else {
                this.$q.notify({
                    message:'Biên bản chưa cố dữ liệu !',
                    color:'red'
                })
            }
        },
        add(){
            if (this.palletCode&&this.congQty&&this.moTopQty&&this.sampleQty) {
                let record = {
                    palletCode:this.palletCode,
                    sampleQty:this.sampleQty,
                    moTopQty:this.moTopQty,
                    congQty:this.congQty,
                    note:this.note
                }
                this.dataKT.record.push(record)
                this.calRate()
                this.$q.notify({
                    message:'Đã thêm dữ liệu !',
                    color:'green'
                })
                localStorage.setItem('kt'+this.kilnBatchId,JSON.stringify(this.dataKT))
                this.moTopQty=''
                this.congQty=''
            }else {
                this.$q.notify({
                    message:'Vui lòng điền đầy đủ thông tin !',
                    color:'red'
                })
            }
        }
    }
}
</script>

<style>

</style>