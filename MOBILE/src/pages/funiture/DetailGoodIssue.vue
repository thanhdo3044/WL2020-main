<template>
  <q-page class="q-pa-md">
    <div class="row justify-end print-hide">
      <div class="col-12 col-sm-6">
        <q-btn-group push>
          <q-btn v-if="showButton" @click="showDialogAdd=true" color="secondary" push label="Thêm mã" icon="add" />
          <q-btn v-if="showCompletedButton" @click="showDialog=true" color="primary" push label="Hoàn thành" icon="check" />
          <q-btn v-if="showQCVerify" @click="showDialogQCVerify=true" color="primary" push label="Xác nhận QC" icon="check" />
          <q-btn v-if="showReciverVerify" @click="showDialogRecivedVerify=true" color="warning" push label="Xác nhận Người nhận" icon="check" />
          <q-btn v-if="showXuongVerify" @click="showDialogXuongVerify=true" color="primary" push label="Xác nhận Xưởng" icon="check" />
          <q-btn color="secondary" @click="showPrint" push label="In Biên bản" icon="print" />
        </q-btn-group>
      </div>
    </div>
      <div class="row justify-center q-mt-md">
          <div class="col-12" style="text-align:center">
              <div class="prodTextTitle">
                  BIÊN BẢN BÀN GIAO HÀNG HÓA
                  
              </div>
          </div>
          <div class="col-12"  style="text-align:center">
              <div class="prodTextNormal">
                  (KIÊM PHIẾU XUẤT KHO)
              </div>
          </div>
      </div>
      <div class="row">
          <div class="col-12" style="background-color: black;height:1px"></div>
      </div>
      <div class="row q-mt-sm prodTextNormal" >
          <div class="col-12" style="text-align:center">
              SỐ PHIẾU : {{goodIssue.goodsIssueNumber}}
          </div>
      </div>
      <div class="row q-mt-sm prodTextNormal">
        <div class="col-6">Tên khách hàng :</div>
        <div class="col-6" style="font-weight:600">????</div>
      </div>
      <div class="row prodTextNormal">
        <div class="col-6">Địa chỉ :</div>
        <div class="col-6" style="font-weight:600">{{goodIssue.address}}</div>
      </div>
      <div class="row prodTextNormal">
        <div class="col-6">Lệnh xuất hàng ngày :</div>
        <div class="col-6" style="font-weight:600">{{goodIssue.orderedGoods}}</div>
      </div>
      <div class="row prodTextNormal">
        <div class="col-6">Ngày giao hàng :</div>
        <div class="col-6" style="font-weight:600">{{goodIssue.deliverDate}}</div>
      </div>
      <div class="row prodTextNormal">
        <div class="col-6">Xuất tại kho :</div>
        <div class="col-6" style="font-weight:600"> NAM HỒNG</div>
      </div>
      <div class="row prodTextNormal">
        <div class="col-6">Biển số xe, Số Con't :</div>
        <div class="col-6" style="font-weight:600">{{goodIssue.numberPalte}}</div>
      </div>
      <div class="row q-mt-sm">
        <div class="col-10"></div>
        <div class="col-2">
          <!-- <q-btn class="print-hide" round color="primary" @click="showDialogAdd=true" icon="add" size="sm" /> -->
        </div>
      </div>
      <div class="row q-mt-sm">
        <div class="col-12">
          <table style="width:100%;font-family:'Time New Roman'">
            <tr>
              <th style="width:10px;text-align:center">STT</th>
              <th>Qui cách</th>
              <th>Tên sản phẩm</th>
              <th>Đvt</th>
              <th>SL</th>
              <th>Ghi Chú</th>
            </tr>
            <tr v-for="(product,index) in products" :key="product.id">
              <td style="text-align:center">{{index+1}}</td>
              <td v-if="product.height" >{{product.height|| '?'}}*{{product.width || '?'}}*{{product.length || '?'}}</td>
              <td v-else></td>
              <td>{{product.name|| '?'}}</td>
              <td style="text-align:center">{{product.unit.name || 'bộ'}}</td>
              <td style="text-align:center">{{product.quantity}}</td>
              <td>{{product.note}}</td>
            </tr>
            
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col-12 q-mt-sm" style="font-style: italic;
    font-family: 'Time New Roman'; ">
          Ghi chú: Hàng đạt tiêu chuẩn xuất kho, xếp an toàn, không hư hỏng, xây xước
        </div>
      </div>
      <div class="row q-mt-md" style="height:200px">
        <div class="col-3 prodTextNormal">
          Người nhận
          <p style="font-style:italic;font-family:'Time New Roman'" v-show="isConfirmRecived">(Đã ký)</p>
        </div>
        <div class="col-3 prodTextNormal">
          Xưởng sản xuất
          <p style="font-style:italic;font-family:'Time New Roman'" v-show="isConfirmXuong">(Đã ký)</p>
        </div>
        <div class="col-3 prodTextNormal">
          Phòng QC
          <p style="font-style:italic;font-family:'Time New Roman'" v-show="isConfirmQC">(Đã ký)</p>
        </div>
        <div class="col-3 prodTextNormal">
          Thủ kho
          <p style="font-style:italic;font-family:'Time New Roman'" v-show="isCompleted">(Đã ký)</p>
        </div>
      </div>
      <q-inner-loading :showing="showLoading">
        <q-spinner-gears size="150px" color="primary" />
      </q-inner-loading>
      <q-dialog v-model="showDialogAdd" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="prodTextTitle">Thêm sản phẩm vào biên bản</span>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <q-select outlined v-model="item" :options="items" label="Chọn sản phẩm" />
          <br>
          <q-input outlined type="number" v-model.number="qty" label="Số lượng xuất" />
          <br>
          <q-input outlined  v-model="note" label="Ghi chú" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn @click="add" flat label="Đồng ý" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn ? !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" color="primary" @click="completed" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showDialogQCVerify" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn ? !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" color="primary" @click="qcConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showDialogRecivedVerify" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn ? !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" color="primary" @click="recivedConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showDialogXuongVerify" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn ? !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" color="primary" @click="xuongConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {feature} from '../../configs/constants'
export default {
    data(){
        return {
            goodIssue:{},
            products:[],
            showLoading:true,
            showDialogAdd:false,
            showDialog:false,
            item:null,
            items:[],
            qty:'',
            note:'',
            showButton:false,
            showQCVerify:false,
            showXuongVerify:false,
            showReciverVerify:false,
            showDialogQCVerify:false,
            showDialogRecivedVerify:false,
            showDialogXuongVerify:false,
            showCompletedButton:false,
            isConfirmQC:false,
            isConfirmRecived:false,
            isConfirmXuong:false,
            isCompleted:false
        }
    },
    created(){
     this.goodIssue = this.$store.state.funiture.goodIssueSelected
     const gId = this.$route.params.id;
     if (this.goodIssue.completed===1) {
       this.showButton = false
       this.showCompletedButton = false
       this.isCompleted = true
       //Nếu biên bản chưa hoàn thành thì sẽ không thể xác nhận
       if (this.$store.getters['production/myFeatures'].findIndex((f)=>{return f.id==feature.CONFIRM_GI})!==-1) {
          if (this.goodIssue.reciverBy===null) {
            this.showReciverVerify = true
          }else {
            this.isConfirmRecived= true
          }
      }
      if (this.$store.getters['production/myFeatures'].findIndex((f)=>{return f.id==feature.QC_CONFIRM_GI})!==-1) {
          if (this.goodIssue.qcVerify===null) {
            this.showQCVerifyVerify = true
          }else{
            this.isConfirmQC = true
          }
      }
      if (this.$store.getters['production/myFeatures'].findIndex((f)=>{return f.id==feature.XUONG_CONFIRM_GI})!==-1) {
        if (this.goodIssue.factoryBy===null) {
          this.showXuongVerify = true
        }else{
          this.isConfirmXuong = true
        }
      }
     }else {
       if (this.$store.getters['production/myFeatures'].findIndex((f)=>{return f.id==feature.GOOD_ISSUE})!==-1) {
         this.showButton = true
         this.showCompletedButton = true
       }
       
     }
     
     Promise.all([this.loadProduct(gId),this.loadProductInProject(this.$store.state.funiture.goodIssueSelected)])
    },
    methods:{
      async xuongConfirm(){
        this.showDialogXuongVerify = false
        this.showLoading = true
        let data = await this.$store.dispatch('funiture/ACTION_XUONG_CONFIRM_GI',this.goodIssue.id)
        if (data.meta.success===true) {
          this.showLoading = false
          this.$q.notify({
            message:'Xác nhận thành công !',
            color:'green'
          })
          this.$router.go(-1)
        }else {
          this.$q.notify({
            message:data.meta.messages.message,
            color:'red'
          })
        }
      },
      async recivedConfirm(){
        this.showDialogRecivedVerify = false
        this.showLoading = true
        let data = await this.$store.dispatch('funiture/ACTION_RECIVED_CONFIRM_GI',this.goodIssue.id)
        if (data.meta.success===true) {
          this.showLoading = false
          this.$q.notify({
            message:'Xác nhận thành công !',
            color:'green'
          })
          this.$router.go(-1)
        }else {
          this.$q.notify({
            message:data.meta.messages.message,
            color:'red'
          })
        }
      },
      async qcConfirm(){
        this.showDialogQCVerify = false
        this.showLoading = true
        let data = await this.$store.dispatch('funiture/ACTION_QC_CONFIRM_GI',this.goodIssue.id)
        if (data.meta.success===true) {
          this.showLoading = false
          this.$q.notify({
            message:'Xác nhận thành công !',
            color:'green'
          })
          this.$router.go(-1)
        }else {
          this.$q.notify({
            message:data.meta.messages.message,
            color:'red'
          })
        }
      },
      async completed(){
        this.showDialog = false
        this.showLoading = true
        let data = await this.$store.dispatch('funiture/ACTION_GI_COMPLETED',this.goodIssue.id)
        if (data.meta.success===true) {
          this.showLoading = false
          this.$q.notify({
            message:'Đã đóng biên bản',
            color:'green'
          })
          const topic = 'NAMHONG-CONFIRM-GI'
          const titleMessage = 'Yêu cầu xác nhận biên bản xuất kho'
          const bodyMessgae = 'Xác nhận biên bản xuất kho '
          const path ='/#/funiture-packing?id='+this.goodIssue.goodsIssueNumber
          this.$sendFcm(titleMessage,bodyMessgae,path,topic,{}).then(res=>{
            console.log('send fcm success',res)
          }).catch(err=>{
            console.log('send Error: '+err)
          })
          this.$router.push('/funiture-packing')
        }else {
          this.$q.notify({
            message:data.meta.messages.message,
            color:'red'
          })
        }
      },
      showPrint(){
        window.print()
      },
      async loadProduct(gId){
        let data = await this.$store.dispatch('funiture/ACTION_GET_PRODUCT_IN_GOOD_ISSUES',gId)
        if (data.meta.success===true) {
          this.products = data.data
          this.showLoading = false
        }else {
          this.$q.notify({
            message:data.meta.messages.message,
            color:'red'
          })
        }
      },
      async loadProductInProject(goodIssue){
        let data = await this.$store.dispatch('funiture/ACTION_LOAD_ITEM_FROM_PROJECT',goodIssue.projectId)
        data.data.forEach(element => {
          const quicach = element.width +'*' + element.length+'*'+element.height
          const it = {
            label:quicach+'  -> '+ element.name,
            value:element.itemId
          }
          this.items.push(it)
        });
      },
      async add(){
        this.showLoading = true
        const payload = {
          goodsIssueId:this.goodIssue.id,
          productId:this.item.value,
          quantity:this.qty,
          note:this.note
        }
        let data  = await this.$store.dispatch('funiture/ACTION_ADD_ITEM_TO_GOOD_ISSUE',payload)
        if (data.meta.success===true) {
          this.$q.notify({
            message:'Thêm sản phẩm thành công !',
            color:'green'
          })
          this.loadProduct(this.goodIssue.id)
          this.showLoading = false
        }else {
          this.$q.notify({
            message:data.meta.messages.message,
            color:'red'
          })
          this.showLoading = false
        }
      }
    }
}
</script>
<style scope>
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
}
</style>
