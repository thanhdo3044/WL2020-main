<template>
  <q-page class="q-pa-md">
      <app-bar>Nghiệm thu</app-bar>
      <div class="row justify-center">
          <div class="col-12 col-sm-6 q-mt-sm">
              <q-card>
                  <q-card-section>
                      <div class="prodTextTitle">
                          Thông tin chính phẩm
                      </div>
                  </q-card-section>
                  <q-card-section>
                      <p class="woodText">- Loại gỗ : {{receipt ? receipt.WOOD_TYPE : '...'}}</p>
                      <p class="woodText">- Tổng số tờ : {{receipt ? receipt.PCS_PER_PACKAGE*receipt.PACKAGE_QUANTITY : '...'}}</p>
                      <p class="woodText">- Tổng khối lượng : {{receipt ? receipt.VOLUMN : '...'}} (m³)</p>
                      <p class="woodText" style="font-weight:800;text-align:center">{{receipt ? receipt.HEIGHT : ''}}*{{receipt ? receipt.WIDTH : ''}}*{{receipt ? receipt.LENGTH : ''}}</p> 
                  </q-card-section>
              </q-card>
          </div>
      </div>
      <div class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <q-input outlined type="number" v-model.number="sampleQty" label="Số tờ mẫu" />
          </div>
      </div>
      <!-- <div  class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <q-input outlined v-model="sizeOutRate" label="Tỷ lệ hụt chiều dài,chiều rộng" suffix="%" />
          </div>
      </div>
      <div  class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <q-input outlined v-model="heightRate" label="Tỷ lệ hụt chiều dầy" suffix="%" />
          </div>
      </div> -->
      <div  class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <q-input outlined v-model="rateA1" label="Tỷ lệ A1" suffix="%" />
          </div>
      </div>
       <!-- <div  class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <q-input outlined v-model="rateNonLi" label="Tỷ lệ non li" suffix="%" />
          </div>
      </div>
       <div  class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <q-input outlined v-model="rateLuonLi" label="Tỷ lệ lượn li" suffix="%" />
          </div>
      </div> -->
      <div  class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <q-input outlined v-model="humidity" suffix="%" label="Độ ẩm" :rules="[val => !!val || 'Field is required']" />
          </div>
      </div>
      <div class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <q-input v-model="note" outlined type="textarea" label="Ghi chú" placeholder="Lẫn keo + tạp màu 2%"/>
          </div>
      </div>
      <div class="row justify-center">
          <div class="col-12 col-sm-6">
              <q-separator  inset class="q-mt-sm" />
          </div>
      </div>
      <div class="row justify-center">
          <div class="col-12 col-sm-6" align="right">
              <span class="fake-link" @click="showAdd=true">Thêm</span>
          </div>
      </div>
      <div class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <table style="width:100%">
                  <tr>
                      <th>Phân loại</th>
                      <th>Kích thước</th>
                      <th>Tình trạng</th>
                      <th>Số lượng</th>
                      <th>Tỷ lệ(%)</th>
                      <th></th>
                  </tr>
                  <tr v-if="inspectArray.length===0" style="text-align:center">
                      <td colspan="6"> 
                          <!-- <a href="#" @click="showAdd=true">Nhấn để thêm dữ liêu !</a> -->
                          <span class="fake-link" @click="showAdd=true">Nhấn để thêm dữ liêu !</span>
                          </td>
                  </tr>
                  <tr v-else v-for="(item,index) in inspectArray" v-bind:key="index">
                      <td>{{item.iTypeName}}</td>
                      <td>{{item.itemName}}</td>
                      <td>{{item.dTypeName}}</td>
                      <td style="text-align: center">{{item.defectQty}}</td>
                      <td style="text-align: center">{{(item.payRate*100).toFixed(2)}}</td>
                      <td>
                          <!-- <a href="#" @click="remove(index)">Xóa</a> -->
                          <span class="fake-link" @click="remove(index)">Xóa</span>
                          </td>
                  </tr>
              </table>
          </div>
      </div>
      <div class="row justify-center q-mt-md q-mb-md">
          <div class="col-12 col-sm-6">
              <q-btn @click="confirm=true" color="secondary" label="Lưu lại"  class="full-width" />
          </div>
      </div>
      <q-dialog v-model="confirm" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Bạn đã chắc chắn !.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn @click="save" flat label="Đồng Ý" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showAdd" persistent>
        <q-card style="min-width:350px">
            <q-card-section class="row items-center">
                <span class="q-ml-sm">Chọn kích thước nghiệm thu</span>
            </q-card-section>
            <q-card-section>
                 <div class="row justify-center q-mt-sm">
                    <div class="col-12">
                        <q-select
                            outlined
                            v-model="itype"
                            :options="iTypes"
                            label="Phận loại"
                        />
                    </div>
                </div>
                <div class="row justify-center q-mt-sm">
                    <div class="col-12">
                        <q-select
                            outlined
                            v-model="dType"
                            :options="dTypes"
                            label="Tình trạng gỗ"
                        />
                    </div>
                </div>
                <div class="row justify-center q-mt-sm">
                    <div class="col-12">
                        <q-select
                            outlined
                            v-model="item"
                            :options="items"
                            label="Kích thước nghiệm thu"
                        />
                    </div>
                </div>
                <div class="row justify-center q-mt-sm">
                    <div class="col-12">
                        <q-input outlined type="number" v-model.number="defectQty" label="Số tấm loại" />
                    </div>
                </div>
                 <div class="row justify-center q-mt-sm">
                    <div class="col-12">
                        <q-input outlined type="number" v-model.number="rateInspect" label="Tỷ lệ loại" />
                    </div>
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn glossy label="Hủy" color="deep-orange" v-close-popup />
                <q-btn glossy @click="addKT"  label="Đồng ý" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import AppBar from '../../components/AppBar'
import { roundNumber,showNotifyValidate,arrSum } from '../../utils/utils'
export default {
    components:{
        'app-bar':AppBar
    },
    data(){
        return {
            iTypes:[],
            itype:null,
            defectQty:'',
            sampleQty:0,
            receipt:null,
            rateA1:0,
            sizeRate:true,
            sizeOutRate:0,
            humidity:'',
            item:null,
            items:[],
            confirm:false,
            receiptRate:0,
            dTypes:[],
            dType:null,
            rateNonLi:0,
            showAdd:false,
            rateLuonLi:0,
            inspectArray:[],
            note:'',
            noteRateA1:'',
            noteRateSize:'Chiều dài, chiều rộng đạt',
            noteRateNonLi:'',
            noteRateLuonLi: '',
            noteHieghtRate:'',
            noteDoAm: '',
            heightRate: 0,
            rateMc:0,
            noteRateMc :'',
            showRateMc:false,
            rateInspect:''
        }
    },
    created(){
        this.loadInputType()
        this.loadDetailInput()
        this.loadDType()
    },
    watch:{
        sizeRate(val){
            console.log(val)
        },
        sizeOutRate(val){
            if (val>0) {
                this.noteRateSize ='Tỷ lệ hụt kích thước '+val+' %'
            }else {
                this.noteRateSize ='Chiều dài, chiều rộng đạt'
            }
            this.loadNote()
        },
        rateNonLi(val){
            if (val>0) {
                this.noteRateNonLi =`Tỷ lệ non li ${val} %`
            }else {
                this.noteRateNonLi =''
            }
            this.loadNote()
        },
        rateLuonLi(val) {
            if (val>0) {
                this.noteRateLuonLi =`Tỷ lệ lượn li ${val} %`
            }else {
                this.noteRateLuonLi =''
            }
            this.loadNote()
        },
        rateA1(val) {
            if (val>0) {
                this.noteRateA1 =`Tỷ lệ A1 ${val} %`
            }else {
                this.noteRateA1 =''
            }
            this.loadNote()
        },
        humidity(val) {
            if (val>0) {
                this.noteDoAm =`Độ ẩm ${val} % `+this.noteRateMc
                if (val>=20) {
                    this.showRateMc = true
                }else {
                    this.showRateMc =false
                    this.rateMc = 0
                    this.noteRateMc=''
                }
            }else {
                this.noteDoAm =''
            }
            this.loadNote()
        },
        heightRate(val){
            if (val>0) {
                this.noteHieghtRate =`Tỷ lệ chiều dầy hụt ${val} %`
            }else {
                this.noteHieghtRate =''
            }
            this.loadNote()
        },
        rateMc(val){
            if (val>0) {
                this.noteRateMc =`(Hạ cấp độ ẩm ${val} %)`
            }else {
                this.noteRateMc =''
            }
            this.loadNote()
        }
    },
    methods:{
        remove(index){
            this.inspectArray.splice(index,1)
        },
        loadNote(){
            this.note = this.noteDoAm 
        },
        addKT(){
            if (this.dType&&this.item&&this.itype) {
               // nếu đã nhập lần trước rồi thỳ cộng dồn số lượng
               let  aIndex = this.inspectArray.findIndex(s=>{return s.iTypeId === this.itype.value})
                if (aIndex===-1) {
                    let payload = {
                        itemId: this.item.value,
                        itemName: this.item.label,
                        iTypeId: this.itype.value,
                        iTypeName: this.itype.label,
                        dTypeId: this.dType.value,
                        dTypeName: this.dType.label,
                        defectQty : this.defectQty || 0,
                        wTypeId:this.receipt.WOOD_TYPE_ID,
                        payRate: this.rateInspect/100 || this.defectQty/this.sampleQty
                    }
                    this.inspectArray.push(payload)
                    this.defectQty = ''
                }else {
                    // nếu đã tồn tại thỳ công dồn
                    this.inspectArray[aIndex].defectQty+=this.defectQty
                }
            }else{
               showNotifyValidate()
            }
        },
        changeRate(){
            let df = parseInt(roundNumber(this.receiptRate/100*this.sampleQty,0))
            this.defectQty =this.sampleQty-df
        },
        async loadDType() {
            let dataDType = await this.$store.dispatch('wood/GET_DTYPE','vcn')
            dataDType.data.forEach(element => {
                let dt = {
                    label: element.NAME,
                    value:element.CODE
                }
                this.dTypes.push(dt)
            });
            if (this.dTypes.length>0) {
                this.dType=this.dTypes[0]
            }
        },
        async loadDetailInput(){
            let id = this.$route.params.id
            let dataDetail = await this.$store.dispatch('wood/GET_DETAIL_DLT',id)
            this.receipt = dataDetail.data[0]
            if (this.receipt) {
                this.sampleQty=(0.05*this.receipt.PACKAGE_QUANTITY*this.receipt.PCS_PER_PACKAGE).toFixed(0)
                this.loadItems()
            }
            
        },
        async save(){
            let receiptDetailId = this.$route.params.id
            if (receiptDetailId&&this.humidity&&this.inspectArray.length>0) {
                let payload = {
                    receiptDetailId:receiptDetailId,
                    note:this.note,
                    sizeOutRate:this.sizeOutRate,
                    heightOutRate: this.heightRate,
                    humidity:this.humidity,
                    isDouble:'N',
                    sampleQuantity:this.sampleQty,
                    rateA1:this.rateA1,
                    rateNonLi:this.rateNonLi,
                    rateLuonLi: this.rateLuonLi,
                    arrayInspection:this.inspectArray
                }
                let data = await this.$store.dispatch('wood/CREATE_INSPECTION',payload)
                if (data.meta.success) {
                    this.$q.notify({
                        message:'Thành công !',
                        color:'green'
                    })
                    this.$router.go(-1)
                }else {
                    this.$q.notify({
                        message:data.meta.message,
                        color:'red'
                    })
                }
            }else {
                showNotifyValidate()
            }
        },
        async loadItems(){
            let woodTypeSelectedId = this.receipt.XTYPE
            const typeItemId =100010
            const payload = {
                typeId:typeItemId
            }
            let dataItems = await this.$store.dispatch('wood/GET_ITEM_BY_TYPE',payload)
            if (dataItems.data.length>0) {
                dataItems.data.forEach(element => {
                    let it = {
                        value:element.id,
                        label: element.height+'*'+element.width+'*'+element.length+' ('+this.receipt.WOOD_TYPE+')'
                    }
                    this.items.push(it)
                });
                let currentItemIndex = this.items.findIndex(i=>{return i.value===this.receipt.ITEM_ID})
                this.item = this.items[currentItemIndex]
            }
        },
        loadInputType(){
            return new Promise(async(resolve,reject)=>{
                let payload = {
                    moduleCode:'vcn',
                    type:'INSPECTION'
                }
                let dataInputType = await this.$store.dispatch('wood/GET_INPUT_TYPE',payload)
                dataInputType.data.forEach(element => {
                    let sc = {
                        label:element.NAME,
                        value: element.ID
                    }
                    this.iTypes.push(sc)
                })
                if (this.iTypes.length>0) {
                    this.itype = this.iTypes[0]
                }
                resolve(true)
            })
        },
    }
}
</script>

<style scoped>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>