<template>
    <q-page class="q-pa-sm">
        <div>
            <transition-group
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            >
            <div id="topbb" key="1" class="row justify-center">
            <div class="col-3"  align="left">
                <img src="/statics/app-logo-128x128.png" alt="">
            </div>
            <div class="col-9">
                <p class="bbTitle">BẢNG KÊ VÀ SỐ LIỆU NGHIỆM THU VÁN BÓC</p>
                
            </div>
            <div class="col-12" align="right">
                <q-btn v-if="!receipt.ALLOW_PAY" @click="confirm=true" label="Hoàn thành" color="primary"></q-btn>
                <q-btn class="print-hide" v-else @click="print" color="secondary" label="In biên bản"></q-btn> 
            </div>
        </div>
        <q-separator key="2" class="q-mt-sm"></q-separator>
        <div key="3" class="row justify-center q-mt-sm">
            <div class="col-12">
                <div class="prodTextNormal">
                    Nhà cung cấp : <strong>{{receipt.VENDOR_NAME || '...'}}</strong>
                </div>
            </div>
        </div>
        <div key="4" class="row justify-center">
            <div class="col-12">
                <div class="prodTextNormal">
                    Địa chỉ : <strong>{{receipt.VENDOR_ADDRESS || '...'}}</strong>
                </div>
            </div>
        </div>
        <div key="5" class="row justify-center">
            <div class="col-12">
                <div class="prodTextNormal">
                    Thời gian giao hàng : <strong>{{receipt.RECEIPT_DATE || '...'}}</strong>
                </div>
            </div>
        </div>
        <div key="6" class="row justify-center">
            <div class="col-12">
                <div class="prodTextNormal">
                    Thời gian kiểm tra : <strong>{{ new Date().toISOString().slice(0,10) || '...'}}</strong>
                </div>
            </div>
        </div>
        <div key="7" class="row justify-center q-ma-sm">
            <table style="width:100%;font-family:'Time New Roman'">
                <tr>
                    <th style="width:10px;text-align:center" rowspan="2" colspan="1" class="text-center">STT</th>
                    <th rowspan="2" colspan="1">Phân loại</th>
                    <th rowspan="1" colspan="3" class="text-center">Qui cách(mm)</th>
                    <th rowspan="2" colspan="1" class="text-center">Số bó giao(bó)</th>
                    <th rowspan="2" colspan="1" class="text-center">SL mẫu kiểm tra(tờ)</th>
                    <th rowspan="2" colspan="1" class="text-center">Số tờ loại(tờ)</th>
                    <th rowspan="2" colspan="1" class="text-center">Tỷ lệ(%)</th>
                    <!-- <th rowspan="2" colspan="1" class="text-center">Loại A(%)</th>
                    <th rowspan="2" colspan="1" class="text-center">Loại B(%)</th>
                    <th rowspan="2" colspan="1" class="text-center">Loại C(%)</th> -->
                    <th rowspan="2" colspan="1" class="text-center">Loại gỗ</th>
                    <th rowspan="2" colspan="1" class="text-center">Ghi chú</th>
                </tr>
                <tr>
                    <th>Dày</th>
                    <th>Rộng</th>
                    <th>Dài</th>
                </tr>
                <tr v-for="(item,index) in dataDetail"  v-bind:key="index" >
                    <td v-if="item.itype==='INPUT'" style="text-align:center" :rowspan="item.totalChild+1">{{item.STT}}</td>
                    <td v-if="item.itype==='INPUT'" style="text-align:center"><span class="fake-link" @click="goEdit(item.id)">{{item.type}}</span></td>
                    <td v-if="item.itype==='INSPECT'" style="text-align:center"><span class="fake-link" @click="goEdit(item.receiptDltId)">{{item.type}}</span></td>
                    <td v-if="item.itype!=='NULL'" style="text-align:center">{{item.itemHeight}}</td>
                    <td v-if="item.itype!=='NULL'" style="text-align:center">{{item.itemWidth}}</td>
                    <td v-if="item.itype!=='NULL'" style="text-align:center">{{item.itemLength}}</td>
                    <td v-if="item.itype!=='NULL'" style="text-align:center">{{item.packageQuantity > 0 ? format(item.packageQuantity) : '-'}}</td>
                    <td v-if="item.itype!=='NULL'" style="text-align:center">{{item.sampleQty > 0 ? format(item.sampleQty): '-'}}</td>
                    <td v-if="item.itype!=='NULL'" style="text-align:center">{{item.defectQty >0 ? item.defectQty : '-'}}</td>
                    <td v-if="item.itype!=='NULL'" style="text-align:center">{{ item.insRate ?  (item.insRate*100).toFixed(2) : (item.defectQty/dataDetail[0].sampleQty*100).toFixed(2)}} %</td>
                    <td v-if="item.itype==='INPUT'" style="text-align:center" :rowspan="item.totalChild+1">{{item.woodType}}</td>
                    <td v-if="item.itype==='INPUT'" style="text-align:center" :rowspan="item.totalChild+1"><div v-html="item.insNote"></div></td>
<!--                       
                    <td v-if="item.itype==='NULL'&&item.insNote" style="text-align:center">
                        <a class="print-hide" href="#" @click="goEdit(item.id)">Sửa</a>
                    </td> -->
                    <td v-if="item.itype==='NULL'" style="text-align:center" colspan="11">
                        <router-link v-if="item.packageQuantity===0" :to="{name:'add-inspection',params:{id:item.receiptId}}">Nhấn để nghiệm thu</router-link>
                        <router-link v-else :to="{name:'edit-inspection',params:{id:item.receiptId}}">Nhấn để sửa</router-link>
                    </td>  
                </tr>
                <tr v-if="detail.length>0" style="background-color: darkgray;">
                    <td colspan="5" class="text-center">Tổng cộng</td>                        
                    <td class="text-right" style="text-align:center">{{sumPackage}}</td>
                    <td class="text-right"></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr v-else>
                    <td colspan="11" style="text-align:center">
                        không có dữ liệu !
                    </td>
                </tr>
            </table>
        </div>
        <div key="8" class="row">
            <div class="col-4">
                <p class="woodText" style="font-weight:800">
                    Đại diện Nhà cung cấp
                </p>
            </div>
            <div class="col-4">
                <p class="woodText" style="font-weight:800">
                    Đại diện xưởng sản xuất
                </p>
            </div>
            <div class="col-4">
                <p class="woodText" style="font-weight:800">
                    Người kiểm tra
                </p>
            </div>
        </div>
            </transition-group>
        </div>
      <q-dialog v-model="confirm" persistent>
      <q-card style="min-width:90%">
        <q-card-section class="row items-center">
          <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn @click="completed" flat label="Đồng ý" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="isLoading">
        <q-spinner-gears size="150px" color="primary" />
    </q-inner-loading>
    </q-page>
</template>

<script>
import { roundNumber,formatNumber }  from '../../utils/utils'
export default {
    data(){
        return {
            receipt:{},
            dataDetail:[],
            detail:[],
            visible:true,
            confirm:false,
            isLoading:true
        }
    },
    created(){
        this.loadReceipt()
    },
    computed: {
        numberReceipt(){
            if (this.receipt) {
                return this.receipt.YEAR+'.'+this.receipt.NUMBER_OF_MONTH+'/'+this.receipt.MONTH
            }else {
                return '.....'
            }
        },
        sumPackage(){
            let sum = 0
            if (this.dataDetail.length>0) {
                this.dataDetail.forEach(element => {
                    sum += parseInt(element.packageQuantity)
                })
            }
            return formatNumber(sum)
        }
    },
    methods:{
        goEdit(receiptDetailId){
            if (this.receipt.ALLOW_PAY===false&&this.receipt.LOCK===0) {
                const currentInspect = this.dataDetail.find(s=>{return s.id===receiptDetailId})
                if (currentInspect.sampleQty&&currentInspect.sampleQty>0) {
                    this.$router.push({name:'edit-inspection',params:{id:receiptDetailId}})    
                }else {
                    this.$router.push({name:'add-inspection',params:{id:receiptDetailId}})
                }
            }else {
                this.$q.notify({
                    message:'Biên bản đã khóa !'
                })
            }
        },
        print(){
            window.print()
        },
        format(num){
            if (num) {
                return formatNumber(num)
            }
            return 0
        },
        async completed(){
            let payload = {
                receiptDetailId:this.$route.params.id,
                data: {
                    allowPay:1,
                    allowInspection:0,
                    delFlag: 'N',
                    qcCompleted:true
                }
            }
            let data = await this.$store.dispatch('wood/UPDATE_WH_RECEIPT',payload)
            if (data.data[0].RESULT) {
                this.$q.notify({
                    message:'Thành công !',
                    color:'green'
                })
                this.$router.push('/wood-list-receipt')
            } else {
                this.$q.notify({
                    message:data.data[0].MESSAGE,
                    color:'red'
                })
            }
        },
        async initData(){

        },
        async loadReceipt(){
            let id = this.$route.params.id
            let data = await this.$store.dispatch('wood/GET_DETAIL_RECEIPT',id)
            if (data.data[0]) {
                this.receipt = data.data[0]
                this.visible = false
                // Promise.all([this.loadDetailReceipt(this.receipt.ID),this.loadInspection(this.receipt.ID)])
                await this.loadDetailReceipt(this.receipt.ID)
                this.loadInspection(this.receipt.ID)
            }
            this.visible = false
        },
        async loadDetailReceipt(id){
            let dataDetail = await this.$store.dispatch('wood/GET_DETAIL_RECEIPT_BY_RECEIPT',id)
            this.detail = dataDetail.data
        },
        async loadInspection(id){
            let dataInspection = await this.$store.dispatch('wood/GET_INSPECTION_BY_RECEIPT_ID',id)
            let elDataInspect=[]
            let stt =1
            this.detail.forEach(dlt=>{
                let countInspection = 0
                let detail = {
                    id: dlt.ID,
                    itype:'INPUT',
                    type: dlt.PHANLOAI,
                    itemHeight:dlt.HEIGHT,
                    itemWidth:dlt.WIDTH,
                    itemLength : dlt.LENGTH,
                    pcsPerPackage: dlt.PCS_PER_PACKAGE,
                    packageQuantity: dlt.PACKAGE_QUANTITY,
                    sampleQty:dlt.SAMPLE_QTY,
                    volumn:dlt.VOLUMN,
                    defectQty:0,
                    rateA:roundNumber(dlt.RATE_A*100,2),
                    rateB:roundNumber(dlt.RATE_B*100,2),
                    rateC: roundNumber(dlt.RATE_C*100,2),
                    insNote:dlt.INS_NOTE,
                    totalChild:0,
                    woodType:dlt.WOOD_TYPE,
                    STT:stt
                }
                stt+=1
                let totalInsRateOfInspection = 0
                elDataInspect.push(detail)
                if (dataInspection.data[0].length>0) {
                    if (dataInspection.data[0].findIndex((is)=>{ return is.RECEIPT_ID===dlt.ID})!==-1) {
                        dataInspection.data[0].forEach(ins=>{
                            if (ins.RECEIPT_ID===dlt.ID) {
                                let woodType = ins.WOOD_TYPE
                                let note = `
                                    <p class="woodText">${woodType}</p>
                                `
                                let inspect = {
                                    id: ins.ID,
                                    itype:'INSPECT',
                                    type: ins.TYPE,
                                    itemHeight:ins.HEIGHT,
                                    itemWidth:ins.WIDTH,
                                    itemLength : ins.LENGTH,
                                    pcsPerPackage: '',
                                    packageQuantity: 0,
                                    sampleQty:'',
                                    volumn:0,
                                    defectQty:ins.DEFECT_QTY,
                                    rateA:dlt.SAMPLE_QUANTITY ? 100-(ins.DEFECT_QTY/dlt.SAMPLE_QUANTITY*100).toFixed(2) : '',
                                    rateB: dlt.SAMPLE_QUANTITY ? (ins.DEFECT_QTY/dlt.SAMPLE_QUANTITY*100).toFixed(2) : '',
                                    receiptDltId:ins.RECEIPT_ID,
                                    note:note,
                                    insRate: ins.DEFECT_QTY<=0 ? ins.PAY_RATE : ins.DEFECT_QTY/dlt.SAMPLE_QTY
                                }
                                elDataInspect.push(inspect)
                                totalInsRateOfInspection+=(ins.DEFECT_QTY/dlt.SAMPLE_QTY)
                            }
                        })
                        // ghi số dòng hạ cấp của chính phẩm đó
                        let currentCPIndex = elDataInspect.findIndex(s=>{return s.id===dlt.ID})
                        elDataInspect[currentCPIndex].totalChild=dataInspection.data[0].filter((is)=>{ return is.RECEIPT_ID===dlt.ID}).length                        
                        elDataInspect[currentCPIndex].insRate = 1-totalInsRateOfInspection
                    }else {
                        let inspect = {
                            itype:'NULL',
                            receiptId:dlt.ID,
                            rateB:null,
                            rateA:null,
                            packageQuantity:0
                        }
                        elDataInspect.push(inspect)
                    }
                }else {
                    let inspect = {
                        itype:'NULL',
                        receiptId:dlt.ID,
                        rateB:null,
                        rateA:null,
                        packageQuantity:0
                    }
                    elDataInspect.push(inspect)
                }
            })
            this.dataDetail = elDataInspect
            this.isLoading=false
        }
    }
}
</script>

<style scoped>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
.bg-grey{
      background-color: rgb(236, 229, 229)
  }
  a:visited {
      color: blue
  }
  a:link{
      text-decoration: none;
  }
@media print {
  .print-hide, aside {
    display:none !important;
  }
  .layout-page-container {
    padding: 0px !important;
  }
  #topbb {
      margin-top: -75px
  }
  .bg-dark {
      background-color: rgb(236, 229, 229)
  }
}
</style>