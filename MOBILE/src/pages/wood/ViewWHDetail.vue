<template>
    <q-page class="q-pa-ma-sm">
        <!-- <app-bar class="print-hide">Chi tiết số phiếu {{numberReceipt}}</app-bar> -->
        <div id="topbb" class="row justify-center">
            <div class="col-3" align="left">
                <img src="/statics/app-logo-128x128.png" alt="">
            </div>
            <div class="col-9">
                <p class="bbTitle">BIÊN BẢN GIAO NHẬN GỖ</p>
                <p class="bbSubTitle">(KIÊM PHIẾU NHẬP KHO)</p>
            </div>
        </div>
        <q-separator style="margin-top:-23px"></q-separator>
        <div class="row justify-center q-ma-sm">
             <div class="col-6 woodText">
               Số phiếu nhập :
            </div>
            <div class="col-6 woodText">
                {{ receipt ? receipt.YEAR+'.'+receipt.NUMBER_OF_MONTH+'/'+receipt.MONTH+''+receipt.WH_CODE : ''}}
            </div>
            <div class="col-6 woodText">
                Nhà cung cấp :
            </div>
            <div class="col-6 woodText">
                {{ receipt ? receipt.VENDOR_NAME : ''}}
            </div>
            <div class="col-6 woodText">
                Địa chỉ :
            </div>
            <div class="col-6 woodText">
                {{ receipt ? receipt.VENDOR_ADDRESS : ''}}
            </div>
            <div class="col-6 woodText">
                Nhập tại kho :
            </div>
            <div class="col-6 woodText">
                {{ receipt ? receipt.WAREHOUSE_NAME : ''}}
            </div>
            <div class="col-12 woodText">
                Cùng nhau kiểm đếm khối lượng gỗ như sau :
            </div>
        </div>
        <div class="row justify-center q-ma-sm">
            <table style="width:100%;font-family:'Time New Roman'">
                <tr>
                    <th style="width:10px;text-align:center" rowspan="2" colspan="1" class="text-center">STT</th>
                    <th rowspan="1" colspan="3" class="text-center">Qui cách</th>
                    <th rowspan="2" colspan="1" class="text-center">Số bó</th>
                    <th rowspan="2" colspan="1" class="text-center">Số tờ/bó</th>
                    <th rowspan="2" colspan="1" class="text-center">Tổng số tờ</th>
                    <th rowspan="2" colspan="1" class="text-center">KL thực nhập(m³)</th>
                    <th rowspan="2" colspan="1" class="text-center">Ghi chú</th>
                </tr>
                <tr>
                    <th>Dày</th>
                    <th>Rộng</th>
                    <th>Dài</th>
                </tr>
                <tr v-for="(item,index) in detail" v-bind:key="item.ID">
                    <td style="text-align:center">{{index+1}}</td>
                    <td style="text-align:center">{{item.HEIGHT}}</td>
                    <td style="text-align:center">{{item.WIDTH}}</td>
                    <td style="text-align:center">{{item.LENGTH}}</td>
                    <td style="text-align:center">{{format(item.PACKAGE_QUANTITY)}}</td>
                    <td style="text-align:center">{{item.PCS_PER_PACKAGE}}</td>
                    <td style="text-align:center">{{format(item.PACKAGE_QUANTITY*item.PCS_PER_PACKAGE)}}</td>
                    <td style="text-align:center">{{item.VOLUMN.toFixed(4)}}</td>
                    <td style="text-align:center">{{item.NOTE}},{{item.WOOD_TYPE}}
                        <br/>
                        <span v-if="receipt.LOCK===0&&receipt.ALLOW_PAY===false" class="fake-link print-hide" @click="goEdit(item.ID)"> Sửa</span>
                    </td>
                </tr>
                <tr v-if="detail.length>0" style="background-color: darkgray;">
                    <td colspan="6" class="text-center">Tổng cộng</td>                        
                    <td class="text-right"></td>
                    <td class="text-right" style="text-align:center">{{sumVolumn}}</td>
                    <td class="text-right"></td>
                </tr>
                <tr v-else>
                    <td colspan="9" style="text-align:center">
                        không có dữ liệu !
                    </td>
                </tr>
            </table>
        </div>
        <div class="row woodText" style="font-weight:600">
            <div class="col-1"></div>
            <div class="col-2">
                Người giao
            </div>
            <div class="col-3">
                Kế toán
            </div>
            <div class="col-3">
                Thủ kho
            </div>
            <div class="col-3">
                Xưởng
            </div>
        </div>
        <q-page-sticky v-if="receipt"  class="print-hide"  position="bottom-right" :offset="[18, 18]">
            <q-btn v-if="receipt.ALLOW_PAY" @click="print" fab icon="print" color="accent" />
            <q-btn v-else @click="goAdd" fab icon="add" color="accent" />
        </q-page-sticky>
        <q-page-sticky v-if="detail.length>0&&receipt.ALLOW_PAY===false" position="top-right" :offset="[18, 58]">
            <q-btn v-model="fab1" label="Hoàn thành" color="primary" @click="confirm=true" label-position="left" icon="save_alt" />
        </q-page-sticky>
        <q-dialog v-model="confirm" persistent>
            <q-card>
                <q-card-section class="row items-center">
                    <div class="top-title">Xác nhận hoàn thành biên bản</div>
                </q-card-section>
                <q-card-section>
                    <h6>Sau khi hoàn thành bạn sẽ không còn cơ hội sửa dữ liệu biên bản !</h6>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Hủy" color="primary" v-close-popup />
                    <q-btn flat label="Đồng Ý" @click="save" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script>
import AppBar from '../../components/AppBar'
import {formatNumber, showNotifyError} from '../../utils/utils'
export default {
    components:{
        'app-bar':AppBar
    },
    data () {
        return {
            receipt:null,
            showAdd:false,
            detail:[],
            fab1:true,
            confirm:false
        }
    },
    created() {
        this.initData()
    },
    computed: {
        numberReceipt(){
            if (this.receipt) {
                return this.receipt.YEAR+'.'+this.receipt.NUMBER_OF_MONTH+'/'+this.receipt.MONTH
            }else {
                return '.....'
            }
        },
        sumVolumn(){
            let sum = 0
            if (this.detail.length>0) {
                this.detail.forEach(element => {
                    sum += element.VOLUMN
                })
            }
            return sum.toFixed(4)
        }
    },
    methods: {
        format(num){
            return formatNumber(num)
        },
        print(){
            window.print()
        },
        async initData() {
            let id = this.$route.params.id
            let data = await this.$store.dispatch('wood/GET_DETAIL_RECEIPT',id)
            if (data.data.length>0) {
                this.receipt = data.data[0]
                await this.loadDetailReceipt(this.receipt.ID)
            }
        },
        async loadDetailReceipt(id){
            let dataDetail = await this.$store.dispatch('wood/GET_DETAIL_RECEIPT_BY_RECEIPT',id)
            this.detail = dataDetail.data
        },
        goAdd(){
            let id = this.$route.params.id
            this.$router.push({ name: 'add-wh-detail', params: { id:  id} })
        },
        goEdit(id){
            this.$router.push({name:'edit-wh-detail',params:{id:id}})
        },
        async save(){
            let itemIdString ='',itemQtyString=''
            if (this.detail.length>0) {
                for (let i = 0; i < this.detail.length; i++) {
                    const element = this.detail[i];
                    if (element.PACKAGE_QUANTITY>0&&element.PCS_PER_PACKAGE>0) {
                        itemIdString+=element.ITEM_ID+','
                        itemQtyString +=(element.PCS_PER_PACKAGE*element.PACKAGE_QUANTITY)+','
                    }
                }
            }
            const dataSave =  await this.$store.dispatch('wood/LOCK_RECEIPT',this.receipt.ID)
            if (dataSave.meta.success) {
                const sourceId = this.$store.getters['base/myWarehouses'][0].id
                    const destinationId = this.$store.getters['base/myDestinations'][0].id
                    const itemId = itemIdString.slice(0,-1)
                    const itemQty = itemQtyString.slice(0,-1)
                    const payload = {
                        sourceId: null,
                        destinationId:sourceId,
                        itemId:itemId,
                        quantity:itemQty,
                        receiptId:this.receipt.ID
                    }
                    this.$store.dispatch('production/ACTION_CREATE_PALLET',payload).then(res=>{
                    if(res.meta.success===true){
                    this.$q.notify({
                        message:'Hoàn thành',
                        color:'green',
                    })
                    }else {
                        showNotifyError('Đã xảy ra lỗi !')
                    }
                })
                this.$router.push('/wood-list-receipt?type=wh')
            }else{
                showNotifyError('Hoàn thành lỗi !')
            }
            
        }
    }
}
</script>

<style scoped>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
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
}
</style>