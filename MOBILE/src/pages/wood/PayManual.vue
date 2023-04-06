<template>
  <q-page class="q-pa-md">
      <div class="row">
          <div class="col-12">
              <q-card class="q-my-lg">
                <q-card-section>
                <div class="box-ribbon-wrapper">
                    <!-- <q-ribbon style="margin-left:-17px" color="white" background-color="#FF0000">Tùy chỉnh đơn giá</q-ribbon> -->
                    <q-ribbon style="margin-left:-17px" decoration="point-in" background-color="secondary" inline>Tùy chỉnh đơn giá</q-ribbon>
                </div>
                </q-card-section>
                <q-card-section>
                    <div class="row">
                        <div class="col-12">
                            <p class="woodText">Biên bản <b> {{payInfo.info.YEAR}}.{{payInfo.info.NUMBER_OF_MONTH}}/{{payInfo.info.MONTH}}{{payInfo.info.WH_CODE}}</b> </p>                            

                            <p class="woodText">Tổng khối lượng nhập kho : <b>{{payInfo.total.totalWHVolumn}}</b> m³</p>
                            <p class="woodText">Tổng thành tiền : <b>{{tAmount}}</b> VNĐ</p>
                            <q-checkbox @input="changeTax" class="woodText" left-label v-model="isTax" label="Thuế 10%" />
                            <p v-show="isTax" class="woodText">Thuế 10% : {{taxVAT}}</p>
                            <p class="woodText">Tổng thanh toán : <b>{{totalPay}} VNĐ</b></p>
                            <p class="woodText">Đơn giá trung bình của biên bản : <b>{{this.AVGAmount}}</b></p>
                        </div>
                    </div>
                </q-card-section>
                <q-card-section align="right">
                    <q-btn color="primary" icon="check" label="Lưu lại" @click="showConfirm=true" />
                </q-card-section>
            </q-card>
          </div>
      </div>
      <div class="row q-mt-md">
          <div class="col-12">
              <DxDataGrid
              :data-source="sortArr"
              :show-borders="true"
              key-expr="CID"
              :word-wrap-enable="true"
              :allow-column-reordering="true"
              @editorPreparing="onEditorPreparing"
              :on-content-ready="onContent"
              :repaint-changes-only="true"
            >
           
              <DxEditing
                :allow-updating="true"
                mode="row"
              />
              <DxColumn
                    :group-index="0"
                    data-field="PID"
                />
              <DxColumn
                data-field="INPUT_NAME"
                caption="Phân Loại nhập"
              >
              <DxRequiredRule/>
              </DxColumn>
              <DxColumn
                data-field="ITEM_ID"
                caption="Sản phẩm"
                :calculate-cell-value="calculateItem"
              >
              </DxColumn>
              <DxColumn
                caption="Số thanh giao"
                data-type="number"
                format="fixedPoint"
                data-field="TOTAL_QTY"
              >
              </DxColumn>
               <DxColumn
                caption="Tỷ lệ % Nghiệm Thu"
                formar="#0.00%"
                data-type="number"  
                data-field="INS_RATE"
                :calculate-cell-value="calculateInsRate"
              >
              </DxColumn>
              <DxColumn
                caption="Tỷ lệ % thanh toán"
                data-type="number"
                format="#0.00%"
                data-field="PAY_RATE"
                :calculate-cell-value="calculatePayRate"
              >
              </DxColumn>
              <DxColumn
                caption="Thể tích theo QC TT (m³)"
                data-type="number"
                format="#0.0000"
                data-field="QCTTVolum"
              >
              </DxColumn>
              <DxColumn
                caption="Thể tích theo QC (m³)"
                data-type="number"
                format="#0.0000"
                data-field="QC_VOLUMN"
              >
              </DxColumn>
               <DxColumn
                caption="Thể tích theo kho (m³)"
                data-type="number"
                format="#0.0000"
                data-field="WH_VOLUMN"
              >
              </DxColumn>
              <DxColumn
                data-field="NOTE"
                caption="Note"
              >
              </DxColumn>
              <DxColumn
                data-field="COM_PRICE"
                caption="Đơn giá"
                data-type="number"
                format="fixedPoint"
              >
              <DxRequiredRule/>
              </DxColumn>
              <DxColumn
                data-field="ITYPE_PRICE"
                caption="Đơn giá Loại"
                data-type="number"
                format="fixedPoint"
              >
              <DxRequiredRule/>
              </DxColumn>
              <DxColumn
                data-field="SaleAmount"
                caption="Thành Tiền  (VNĐ)"
                data-type="number"
                format="fixedPoint"
                :calculate-cell-value="calculateAmount"
                width="180"
              >
              </DxColumn>
              <DxSummary>
                <DxTotalItem
                column="WH_VOLUMN"
                summary-type="sum"
                value-format="000.0000#"
                display-format="{0}"
                />
                
                <DxTotalItem
                column="SaleAmount"
                summary-type="sum"
                value-format="fixedPoint"
                display-format="{0}"
                width="600"
                />
                <DxGroupItem
                :show-in-group-footer="true"
                column="SaleAmount"
                summary-type="sum"
                value-format="fixedPoint"
                display-format="{0}"
                />
                 <DxGroupItem
                :show-in-group-footer="true"
                column="WH_VOLUMN"
                summary-type="sum"
                value-format="00.0000#"
                display-format="{0}"
                />
            </DxSummary>
              <!-- <DxColumn
                    :group-index="0"
                    data-field="PARENTID"
                /> -->
            </DxDataGrid>
          </div>
      </div>
      <q-dialog v-model="showConfirm" persistent>
          <q-card style="min-width:320px">
              <q-card-section class="row items-center">
                  <span class="q-ml-sm">Bạn đã chắc chắn !</span>
              </q-card-section>
              <q-card-actions align="right">
                  <q-btn flat label="Hủy" color="primary" v-close-popup />
                  <q-btn flat label="Đồng Ý" @click="savePrice" color="primary" v-close-popup />
              </q-card-actions>
          </q-card>
      </q-dialog>
  </q-page>
</template>

<script>
import {sortParent, roundNumber,formatNumber } from '../../utils/utils'
import { DxDataGrid, DxColumn, DxEditing, DxLookup,DxRequiredRule,DxGroupItem,
 DxSummary,DxTotalItem } from 'devextreme-vue/data-grid';

export default {
    components: {
        DxDataGrid,
        DxColumn,
        DxEditing,
        DxLookup,
        DxRequiredRule,
        DxSummary,DxTotalItem,
        DxGroupItem
    },
    data() {
        return {
            isTax:false,
            receipt: {},
            payInfo: {},
            sortArr: [],
            dataSource:[],
            items: [],
            iTypes: [],
            dTypes:[],
            wTypes:[],
            totalAmount:0,
            showConfirm:false,
            totalWHVolumn:0,
            totalQCVolumn:0,
            insRate:0,
            AVGAmount:0,
            payRate:0,
            taxVAT:0,
            tAmount:0,
            totalPay:0,
            tAmountValue:0
        }
    },
    watch:{
        totalPay(val){
            this.AVGAmount= formatNumber(roundNumber(this.tAmountValue/this.payInfo.total.totalWHVolumn,0))
        }
    },
    created(){
        let receiptId = this.$route.params.id;
        let pdata =this.$store.state.wood.payCalInfo.detail
        this.payInfo = this.$store.state.wood.payCalInfo
        this.sortArr = pdata
       Promise.all([this.loadItems()]).then(()=>{
           this.totalPay = this.tAmount
       });
    },
    computed: {
        format:function(e){
            return formatNumber(e)
        }
    },
    methods:{
        changeTax(val){
            if (val) {
                let tax = this.tAmountValue*0.1
                this.taxVAT= formatNumber(roundNumber(tax,0))
                this.totalPay=formatNumber(roundNumber(tax,0)+this.tAmountValue)
            }else {
                this.taxVAT=0
                this.totalPay = this.tAmount
            }
            
        },
        onContent(e){
            let amount = 0
            if (this.isTax) {
                amount = roundNumber(e.component.getTotalSummaryValue('SaleAmount'),0)
                this.taxVAT = formatNumber(roundNumber(0.1*amount,0))
                this.totalPay=formatNumber(roundNumber(amount+(0.1*amount,0),0))
            }else {
                this.totalPay=formatNumber(amount)
            }
            this.tAmountValue = roundNumber(e.component.getTotalSummaryValue('SaleAmount'),0)
            this.tAmount =formatNumber(this.tAmountValue)
            return this.tAmount
        },
        async savePrice(){
           const rcDatas = this.sortArr.filter((s)=>{return s.ICODE==='INP'})
           rcDatas.forEach(rc => {
               let rcIndex = this.sortArr.findIndex((s)=>{return s.CID===rc.CID})
               let rcAmount = roundNumber(rc.QCTTVolum*rc.ITYPE_PRICE,0)
                let subTotalAmount = rcAmount
                let insDatas = this.sortArr.filter((s)=>{return s.ICODE==='INS'&&s.PARENTID===rc.CID})
                this.sortArr[rcIndex].Amount=rcAmount
                insDatas.forEach(ins => {
                    let insIndex = this.sortArr.findIndex((s)=>{return s.CID===ins.CID})
                    let insAmount = roundNumber(ins.ITYPE_PRICE*ins.QCTTVolum,0)
                    this.sortArr[insIndex].Amount = insAmount
                    subTotalAmount+=insAmount
                });
                let avgPrice =roundNumber( subTotalAmount/rc.WH_VOLUMN,0)
                this.sortArr[rcIndex].avgAmount=avgPrice
                this.totalAmount+=subTotalAmount
                this.totalWHVolumn+=rc.WH_VOLUMN
           });
           this.AVGAmount=roundNumber(this.totalAmount/this.totalWHVolumn,0)
           this.insRate = roundNumber(this.payInfo.total.insRate,4)
            let listItem = ''
            let listQty =''
            for (let i = 0; i < this.sortArr.length; i++) {
              if (this.sortArr[i].ICODE==='INP') {
                listItem+=this.sortArr[i].ITEM_ID+','
                listQty +=this.sortArr[i].TOTAL_QTY+','
              }
            }
            let payload = {
                id: this.$route.params.id,
                data:{
                arr:this.sortArr,
                total: {
                    totalAmount: this.totalAmount,
                    totalWHVolumn: this.totalWHVolumn,
                    totalQCVolumn:this.totalQCVolumn,
                    AVGAmount: this.AVGAmount,
                    insRate: this.insRate,
                    payRate:this.payRate,
                    taxVAT:this.isTax ? roundNumber(this.tAmountValue*0.1,0) : 0
                },
                manual:1,
               
                },
                 pallet:{
                   sourceId:this.$store.getters['base/mySources'][0].id,
                  destinationId:this.$store.getters['base/myDestinations'][0].id,
                  itemId:listItem.slice(0,listItem.length-1),
                  quantity:listQty.slice(0,listQty.length-1)
                }
            }
            let data  = await this.$store.dispatch('wood/COMPLETED_PAYMENT',payload)
            if (data.meta.success===true) {
                this.$q.notify({
                message:'Thành công !',
                color:'green'
                })
                this.$router.push({name:'view-payment-completed',params:{'id':this.$route.params.id}})
            }
        },
        calculateItem(data){
            // console.log(data)
            let lookupItem = this.items.find((it)=>{return it.value===data.ITEM_ID})
            // console.log(lookupItem)
            if (lookupItem) {
                return lookupItem.label
            }
            return '...'
        },
        calculateAVGAmount(data){
           
        },
        onEditorPreparing(e) {
            if (e.dataField === 'SaleAmount') {
                e.editorOptions.disabled = true
            }
        },
        calculateNote(data) {
            let findDtype = this.dTypes.find((d)=>{ return d.value.trim()===data.DTYPE.trim()})
            // console.log(data.DTYPE)
            return data.WOOD_TYPE+' '+findDtype.label
        },
        calculateAmount(data){
            return data.ITYPE_PRICE*data.QCTTVolum
        },
        calculateWHVOLUMN(data) {
            if (data.ITYPE==='INPUT'){
                return data.WH_VOLUMN
            }else{
                return 0
            }
        },
        calculateQCVOLUMN(data){
            if (data.ITYPE==='INPUT'){
                return data.QC_VOLUMN
            }else{
                return 0
            }
        },
        calculateQCVOLUMNTT(data) {
            if (data.ITYPE==='INPUT') {
                return roundNumber(data.PAY_RATE*data.ITEM_VOLUMN*data.PCS_PER_PACKAGE*data.PACKAGE_QUANTITY,4)
            }else {
                let rcIndex = this.sortArr.findIndex((rc)=>{return rc.CID===data.PARENTID})
                let rcData = this.sortArr[rcIndex]
                return roundNumber(roundNumber(1-rcData.PAY_RATE,2)*data.ITEM_VOLUMN*rcData.TOTAL_QTY,4)
                
            }
        },
        calculateTotalQty(data){
            return data.PACKAGE_QUANTITY*data.PCS_PER_PACKAGE
        },
        calculatePayRate(data){
            if (data.ITYPE==='INPUT') {
                return data.PAY_RATE
            }else {
                let rcIndex = this.sortArr.findIndex((rc)=>{return rc.CID===data.PARENTID})
                let insPayRate = roundNumber(1-this.sortArr[rcIndex].PAY_RATE,2)
                return insPayRate
            }
        },
        calculateInsRate(data){
            if (data.ITYPE==='INPUT') {
                return data.INS_RATE*100
            }else {
                return data.INS_RATE.toFixed(0)
            }
        },
         async loadReceiptInfo(id) {
        let receiptInfo = await this.$store.dispatch(
            "wood/GET_DETAIL_RECEIPT",
            id
        );
        this.receipt = receiptInfo.data[0];
        },
        async loadPay(id) {
        let dataPay = await this.$store.dispatch(
            "wood/GET_PAYMENT_DETAIL_BY_RECEIPT_ID",
            id
        );
        this.sortArr = sortParent(dataPay.data);
        this.payInfo = dataPay.data;
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
}
</script>

<style>
.dx-datagrid-nowrap .dx-header-row  td  .dx-datagrid-text-content {
        white-space: normal !important;
    }
</style>