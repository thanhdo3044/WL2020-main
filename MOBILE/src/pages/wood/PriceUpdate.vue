<template>
  <q-page class="q-pa-sm">
    <div class="row justify-center q-mt-sm">
      <div class="col-6 prodTextTitle">Cập nhật bảng giá</div>
      <div class="col-4" align="right">
        <q-btn v-show="!showPreView" :disable="newPriceList.length>0? false :true" @click="preview" icon="view" color="primary" label="Xem trước" />
      </div>
    </div>
    <div v-show="!showPreView" class="row justify-center q-mt-sm">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <q-select  v-model="region" :options="regions" label="Chọn bảng giá" />
          </q-card-section>
          <q-card-section>
            <DxDataGrid
              :data-source="newPriceList"
              :show-borders="true"
              key-expr="ID"
              @editorPreparing="onEditorPreparing"
              @init-new-row="initNewRow"
              @row-inserted="inserted"
              @row-inserting="inserting"
            >
            <DxColumn
                data-field="ID"
              />
              <DxEditing
                :allow-adding="true"
                :allow-deleting="true"
                mode="row"
              />
              <DxColumn
                data-field="WTYPE"
                caption="Loại gỗ"
              >
                <DxRequiredRule/>
                <DxLookup
                  :data-source="wTypes"
                  display-expr="label"
                  value-expr="value"
                />
              </DxColumn>
              <DxColumn
                data-field="DTYPE"
                caption="Trạng Thái gỗ"
              >
              <DxRequiredRule/>
                <DxLookup
                  :data-source="dTypes"
                  display-expr="label"
                  value-expr="value"
                />
              </DxColumn>
              <DxColumn
                data-field="ITYPE"
                caption="Phân Loại nhập"
              >
              <DxRequiredRule/>
                <DxLookup
                  :data-source="iTypes"
                  display-expr="label"
                  value-expr="value"
                />
              </DxColumn>
              <DxColumn
                data-field="ItemID"
                caption="Sản phẩm"
              >
              <DxRequiredRule/>
                <DxLookup
                  :data-source="items"
                  display-expr="label"
                  value-expr="value"
                />
              </DxColumn>
              <DxColumn
                data-field="OLD_PRICE"
                caption="Đơn giá hiện tại"
                data-type="number"
                format="fixedPoint"
              >
              </DxColumn>
              <DxColumn
                data-field="PRICE"
                caption="Đơn giá mới"
                data-type="number"
                format="fixedPoint"
              >
              <DxRequiredRule/>
              </DxColumn>
            </DxDataGrid>
          </q-card-section>
        </q-card>
      </div>


      <!-- <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="col-12 col-sm-4">
                <q-select
                  use-input
                  input-debounce="0"
                  @filter="searchItem"
                  style="font-family:'Time New Roman';font-size:16px"
                  v-model="item"
                  behavior="dialog"
                  :options="items"
                  label="Chọn sản phẩm :"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-select
                  use-input
                  input-debounce="0"
                  @filter="searchItem"
                  style="font-family:'Time New Roman';font-size:16px"
                  v-model="item"
                  behavior="dialog"
                  :options="items"
                  label="Chọn sản phẩm :"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div> -->
    </div>

    <div class="row">
      <div class="col-12">
        <q-card class="my-card">
          <q-card-section>
           <div class="text-h6">Lý do cập nhật</div>
          </q-card-section>
          <q-card-section>
             <q-input
              v-model="reason"
              outlined
              type="textarea"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-show="showPreView" class="row justify-center q-mt-md">
      <div class="col-12">
        <q-card>
          <q-card-section class="prodTextTitle">
           <div class="row">
             <div class="col-4">
                Xem trước 
             </div>
             <div class="col-4" align="right">
               <q-btn @click="sendRequest" color="secondary" icon-right="save" label="Lưu và Gửi Phê Duyệt" />
             </div>
             <div class="col-4" align="right">
               <q-btn color="primary" @click="showPreView=false" icon-right="pen" label="Chỉnh sửa" />
             </div>
           </div>
          </q-card-section>
          <q-card-section>
            <DxPivotGrid
                id="pivotgrid"
                ref="grid"
                :data-source="dataSource"
                
                :allow-filtering="true"
                :show-borders="true"
                :show-column-grand-totals="false"
                :show-row-grand-totals="false"
                :show-row-totals="false"
                :show-column-totals="false"
                >
                <!-- <DxFieldChooser
                    :enabled="true"
                    :height="400"
                /> -->
                </DxPivotGrid>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row justify-center q-mt-lg">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <h5>Danh sách yêu cầu của tôi</h5>
          </q-card-section>
          <q-card-section>
            <table-request :dataSource="dataRequest"/>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { DxSelectBox } from "devextreme-vue";
import {
  DxPivotGrid,
  DxFieldChooser
} from 'devextreme-vue/pivot-grid';
import { DxDataGrid, DxColumn, DxEditing, DxLookup,DxRequiredRule } from 'devextreme-vue/data-grid';
import TableRequest from '../../components/wood/TableRequest'
import { QSpinnerIos} from 'quasar'
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxLookup,
    DxPivotGrid,
    DxFieldChooser,
    DxRequiredRule,
    'table-request':TableRequest
  },
  data() {
    return {
      items: [],
      item: null,
      itemsDuplicate: [],
      iTypes: [],
      iType: null,
      dTypes:[],
      dType:null,
      wTypes:[],
      wType: null,
      newPriceList:[],
      newPricePivortData: [],
      dataSource:{},
      showPreView : false,
      currentPrices: [],
      dataRequest : [],
      regions:[],
      region:null,
      reason:''
    };
  },
  created() {
    Promise.all([this.loadItems(), 
    this.loadInputType(),
     this.loadwType(),
     this.loadDType(),
     this.loadMyRequest(),
     this.loadRegion()]).then(v=>{
       this.loadCurrentPrice()
     });
  },
  watch:{
    newPriceList(val) {
      

    }
  },
  methods: {
    async sendRequest(){
      this.$q.loading.show({
        spinner:QSpinnerIos,
        spinnerColor:'primary',
        spinnerSize:100
      })
      let payload = {
        data: this.newPricePivortData,
        reason: this.reason
      }
      let data = await this.$store.dispatch('wood/CREATE_REQ_PRICE',payload)
      if (data.meta.success===true) {
        this.newPricePivortData=[]
        this.showPreView=false
        this.newPriceList=[]
        await this.loadMyRequest()
        this.$q.loading.hide()
      }else {
        this.$q.notify({
          message:data.meta.messages.message || 'ERRRRRRRROOOOOOOOOR!',
          color:'red',
          position:'center'
        })
      }
    },
    preview(){
      this.newPricePivortData=[]
      this.newPriceList.forEach(element => {
        let currentPrice = element
        let dataPivort = {
          dType: this.dTypes.find((d)=>{ return d.value===currentPrice.DTYPE}),
          iType:this.iTypes.find((i)=>{ return i.value===currentPrice.ITYPE}),
          wType: this.wTypes.find((w)=>{ return w.value===currentPrice.WTYPE}),
          item: this.items.find((it)=>{ return it.value===currentPrice.ItemID}),
        }
        let rawDataPivort = {
          dTypeCode : dataPivort.dType.value,
          dTypeName : dataPivort.dType.label,
          iTypeID: dataPivort.iType.value,
          iTypeName: dataPivort.iType.label,
          wTypeID : dataPivort.wType.value,
          wTypeName: dataPivort.wType.label,
          itemID: dataPivort.item.value,
          itemName: dataPivort.item.label,
          price: currentPrice.PRICE,
          oldPrice : currentPrice.OLD_PRICE,
          regionId:this.region.value
        }
        this.newPricePivortData.push(rawDataPivort)
        });
        let source = {
          fields: [{
          caption: 'ITYPE',
          width: 120,
          dataField: 'iTypeName',
          area: 'row',
          expanded: true,
          }, {
          caption: 'itemName',
          dataField:'itemName',
          area: 'row',
          width: 150,
          expanded: true,
          
          }, {
          dataField: 'wTypeName',
          area: 'column',
          expanded: true,
          }, {
          dataField: 'dTypeName',
          area: 'column',
          expanded: true,
          }, {
          caption: 'ĐG Mới',
          dataField: 'price',
          dataType: 'number',
          summaryType: 'sum',
          area: 'data',
          format:"fixedPoint"
          },{
          caption: 'ĐG Hiện tại',
          dataField: 'oldPrice',
          dataType: 'number',
          summaryType: 'sum',
          area: 'data',
          format:"fixedPoint"
          }],
          store: this.newPricePivortData
      }
      this.dataSource = source
        this.showPreView =true
    },
    async loadCurrentPrice () {
      let payload = {
        moduleId: this.$store.state.base.moduleSelected.id,
        regionId: this.region.value
      }
      let data = await this.$store.dispatch('wood/GET_PRICE_RAW_DATA',payload)
      this.currentPrices = data.data
    },
    inserting(e) {
      let newRecord = e.data
      if (!this.checkDupplicate(newRecord)) {
        e.cancel =true
        this.$q.notify({
          message:'Dữ liệu đã tồn tại !',
          color:'red',
          position:'center'
        })
      }else {
        // Điền đơn giá hiện tại
        
        let curentPriceIndex = this.currentPrices.findIndex((cp)=>{
          return parseInt(cp.ITEM_ID)===newRecord.ItemID&&cp.WTYPE===newRecord.WTYPE&&
          cp.ITYPE===newRecord.ITYPE&&cp.DTYPE_CODE.trim()===newRecord.DTYPE.trim()&&this.region.value===cp.REGION_ID})
        curentPriceIndex>-1 ? e.data.OLD_PRICE=this.currentPrices[curentPriceIndex].PRICE : e.data.OLD_PRICE=0
      }
    },
    inserted(e){
      this.newPriceList[this.newPriceList.length-1].ID=this.newPriceList.length
      let currentPrice = this.newPriceList[this.newPriceList.length-1]
      
    },
    initNewRow(){

    },
    getFilteredCities: (options) => {
      
    },
    checkDupplicate(record) {
      let existsRecord = this.newPriceList.findIndex((np)=>{ 
        return np.WTYPE===record.WTYPE&&np.DTYPE===record.DTYPE&&np.ITYPE===record.ITYPE&&np.ItemID===record.ItemID})
      if (existsRecord===-1) {
        return true
      }
      return false
    },
    onEditorPreparing(e) {
      if (e.dataField === 'ID' || e.dataField === 'OLD_PRICE') {
        e.editorOptions.disabled = true
      }
    },
    async loadRegion(){
      let data = await this.$store.dispatch('wood/GET_REGION',this.$store.state.base.moduleSelected.id)
      data.data.forEach(element => {
          let r ={
              value: element.ID,
              label: element.NAME
          }
          this.regions.push(r)
      });
      if (this.regions.length>0) {
          this.region=this.regions[0]
      }
    },
    loadMyRequest(){
      return new Promise(async(resolve,reject)=>{
        let myId = this.$store.state.base.userInfo.id
        let data = await this.$store.dispatch('wood/GET_MY_REQUEST',myId)
        this.dataRequest = data.data
        resolve(true)
      })
    },
    loadDType() {
      return new Promise(async (resolve, reject) => {
        let dataDType = await this.$store.dispatch(
          "wood/GET_DTYPE",
          this.$store.state.base.moduleSelected.id
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
        resolve(true);
      });
    },
    loadwType() {
      // keo, keo F1
      return new Promise(async (resolve, reject) => {
        let data = await this.$store.dispatch("wood/GET_WOOD_TYPE");
        if (data.data.length > 0) {
          data.data.forEach(element => {
            let wt = {
              value: element.ID,
              label: element.NAME
            };
            this.wTypes.push(wt);
          });
        }
        resolve(true);
      });
    },
    loadInputType() {
      // Hàng Loại A, Loại B
      return new Promise(async (resolve, reject) => {
        let payload = {
          moduleId: this.$store.state.base.moduleSelected.id
        };
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
    loadItems() {
      return new Promise(async (resolve, reject) => {
        let moduleId = this.$store.state.base.moduleSelected.id;
        let dataItems = await this.$store.dispatch(
          "wood/GET_ITEM_BY_MODULE_ID",
          moduleId
        );
        if (dataItems.data.length > 0) {
          dataItems.data.forEach(element => {
            let it = {
              value: element.id,
              label:
                element.height +
                "*" +
                element.width +
                "*" +
                element.length +
                " (" +
                element.name +
                ")"
            };
            this.items.push(it);
          });
          this.itemsDuplicate = this.items;
        }
        resolve(dataItems);
      });
    },
  }
};
</script>

<style>
</style>