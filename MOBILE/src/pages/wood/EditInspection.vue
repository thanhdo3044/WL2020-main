<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-sm-6 q-mt-sm">
        <q-card>
          <q-card-section>
            <div class="prodTextTitle">Thông tin chính phẩm</div>
          </q-card-section>
          <q-card-section>
            <p class="woodText">- Loại gỗ : {{receipt ? receipt.WOOD_TYPE : '...'}}</p>
            <p
              class="woodText"
            >- Tổng số tấm : {{receipt ? receipt.PCS_PER_PACKAGE*receipt.PACKAGE_QUANTITY : '...'}}</p>
            <p class="woodText">- Tổng khối lượng : {{receipt ? receipt.VOLUMN : '...'}} (m³)</p>
            <p
              class="woodText"
              style="font-weight:800;text-align:center"
            >{{receipt ? receipt.HEIGHT : ''}}*{{receipt ? receipt.WIDTH : ''}}*{{receipt ? receipt.LENGTH : ''}}</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row justify-center q-mt-sm">
      <div class="col-12 col-sm-6">
        <q-input outlined type="number" v-model.number="sampleQty" label="Số tờ mẫu" />
      </div>
    </div>
    <div  class="row justify-center q-mt-sm">
        <div class="col-12 col-sm-6">
            <q-input outlined v-model="rateA1" label="Tỷ lệ A1" suffix="%" />
        </div>
    </div>
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
        <div class="col-12 col-sm-6" align="right">
            <!-- <a href="#" @click="showAdd=true">Thêm</a> -->
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
                      <th>Tỷ lệ (%)</th>
                      <td></td>
                  </tr>
                  <tr v-if="arrayData.length===0" style="text-align:center">
                      <td colspan="6">
                        <span class="fake-link" @click="showAdd=true">Nhấn để thêm dữ liêu !</span>
                      </td>
                  </tr>
                  <tr v-else v-for="(item,index) in arrayData" v-bind:key="index">
                      <td>{{item.ITYPE_NAME}}</td>
                      <td>{{item.ITEM_NAME}}</td>
                      <td>{{item.DTYPE_NAME}}</td>
                      <td style="text-align: center">{{item.DEFECT_QTY}}</td>
                      <td style="text-align: center">{{item.DEFECT_QTY>0 ? (item.DEFECT_QTY/receipt.SAMPLE_QTY ).toFixed(4)*100: item.PAY_RATE.toFixed(4)*100 }}</td>
                      <td>
                        <span class="fake-link"  @click="removeArray(index,item.ID)">Xóa</span>
                        </td>
                  </tr>
              </table>
          </div>
      </div>
      <div class="row justify-center q-mt-md">
        <div class="col-12 col-sm-6">
          <q-btn color="primary" class="full-width"  label="Lưu lại" @click="save" />
        </div>
      </div>
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
                            v-model="iType"
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
import {showNotifyValidate,showNotifySuccess} from '../../utils/utils'
export default {
  data() {
    return {
      receipt: {},
      sampleQty: 0,
      dTypes: [],
      dType: null,
      items: [],
      item: null,
      iTypes: [],
      iType: null,
      rateA1:'',
      humidity:'',
      note:'',
      arrayData:[],
      showAdd:false,
      defectQty:'',
      rateInspect:''
    };
  },
  created() {
    this.loadInputType();
    this.loadDetailInput();
    this.loadDType();
  },
  methods: {
    async save(){
      let receiptDetailId = this.$route.params.id
      let payload = {
        id:this.receipt.INS_ID,
        receiptDetailId:this.$route.params.id,
        note:this.note,
        humidity:this.humidity,
        sampleQuantity:this.sampleQty,
        rateA1:this.rateA1,
        arrayInspection:this.arrayData
      }
        let data = await this.$store.dispatch('wood/EDIT_INSPECTION',payload)
        if (data.meta.success) {
          showNotifySuccess('Thành công !')
          this.$router.push({name:'wood-inspection',params:{id:this.receipt.WH_RECEIPT_ID}})
        }
    },
    addKT(){
      // console.log(this.defectQty,this.sampleQty)
      let rate = 0
      if (parseInt(this.defectQty)>0) {
        rate = this.defectQty/this.sampleQty
      }else {
        rate = this.rateInspect
      }
      // console.log(rate)
      this.arrayData.push({
        ITEM_ID:this.item.value,
        ITEM_NAME:this.item.label,
        ITYPE_NAME:this.iType.label,
        INPUT_TYPE_ID:this.iType.value,
        DTYPE_NAME:this.dType.label,
        DTYPE:this.dType.value,
        DEFECT_QTY:parseInt(this.defectQty)>0 ? this.defectQty : 0,
        WTYPE:this.receipt.WOOD_TYPE_ID,
        RATE: rate,
        PAY_RATE:rate/100
      })
    },
    removeArray(index,id){
      this.arrayData.splice(index,1)
    },
    async loadDetailInput() {
      let id = this.$route.params.id;
      let dataDetail = await this.$store.dispatch("wood/GET_DETAIL_DLT", id);
      this.receipt = dataDetail.data[0];
      if (this.receipt) {
        this.sampleQty = this.receipt.SAMPLE_QTY
        this.note = this.receipt.INS_NOTE
        this.humidity = this.receipt.HUMIDITY_RATE
        this.rateA1 =this.receipt.A1_RATE
        this.loadItems();
        this.loadArrayData()
      }
    },
    async loadDType() {
      let dataDType = await this.$store.dispatch(
        "wood/GET_DTYPE",
       'VCN'
      );
      dataDType.data.forEach(element => {
        let dt = {
          label: element.NAME,
          value: element.CODE
        };
        this.dTypes.push(dt);
      });
      if (this.dTypes.length > 0) {
        this.dType = this.dTypes[0];
      }
    },
    async loadItems() {
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
    loadInputType() {
      return new Promise(async (resolve, reject) => {
        let payload = {
            moduleCode:'vcn',
            type:'INSPECTION'
        }
        let dataInputType = await this.$store.dispatch(
          "wood/GET_INPUT_TYPE",
          payload
        );
        dataInputType.data.forEach(element => {
          let sc = {
            label: element.NAME,
            value: element.ID
          };
          this.iTypes.push(sc);
        });
        if (this.iTypes.length > 0) {
          this.iType = this.iTypes[0];
        }
        resolve(true);
      });
    },
    async loadArrayData() {
      let receiptDetailId = this.$route.params.id
      let data = await this.$store.dispatch('wood/GET_LIST_INSP_BY_RDLT_ID',receiptDetailId)
      this.arrayData = data.data
    }
  }
};
</script>

<style scoped>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>