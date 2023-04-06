<template>
  <q-page class="q-pa-sm print-hide">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          In LSX từng công đoạn
        </div>
      </div>
    
      
          
          <!-- <div class="col-12 col-md-2 col-sm-4 q-pa-sm">
                    <q-input @input="loadGrid" v-model.number="week" type="number" label="Tuần" />
                </div>
                <div class="col-12 col-md-2 col-sm-4 q-pa-sm">
                    <q-input @input="loadGrid" v-model.number="year" type="number" label="Năm" />
          </div>-->
          <!-- <div class="col-2" align="right">
            <q-btn flat color="orange" icon="search" @click="showFilterDialog = true" />
          </div> -->
       
   
      <q-separator inset />
     
        <div class="row print-hide">
          <q-input  
          dense
            class="col-1 q-pa-sm"
            @input="loadGrid"
            outlined
            label-color="orange"
            v-model.number="year"
            type="number"
            label="Năm"
          />
          <q-input
          dense
            class="col-1 q-pa-sm"
            @input="loadGrid"
            outlined
            label-color="orange"
            v-model.number="week"
            type="number"
            label="Tuần"
          />
          <q-select
          dense
            class="col-2 q-pa-sm"
            @input="onChange"
            outlined
            label-color="orange"
            v-model="idDepartment"
            :options="options"
            label="Chọn nhà máy"
          />
            <q-select
            dense
            class="col-2 q-pa-sm"
            outlined
            v-model="stepId"
            :options="data"
            label="Chọn công đoạn"
            label-color="orange"
            @input="loadGrid"
          />
            
          <!-- <q-select label-color="orange" class="col-2 q-mb-sm q-ml-sm"  outlined v-model="number" :options="listNumber" @input="loadLSX" label="Lệnh sản xuất" 
          :readonly="gop"
          />
           <q-checkbox  v-model="selection" @input="goplenh()" label="CHỌN GỘP LSX" />    -->
          <!-- <q-btn class="col-2 q-ml-sm" color="primary" icon="print" flat @click="print" /> -->
        </div>
      
      
            <DxDataGrid
              :word-wrap-enabled="true"
              :data-source="dataSourceGrid"
              :show-row-lines="true"
              :show-column-lines="true"
              :show-borders="true"
              @cell-prepared="onCellPrepared"
            
           
              :no-data-text="'Không có dữ liệu !'"
            >
              <DxExport
                :enabled="true"
                :allow-export-selected-data="true"
                :file-name="title"
              />
              <!-- <DxGroupPanel :visible="true" /> -->
              <!-- <DxScrolling mode="infinite" />
              <DxSorting mode="none" /> -->
              <!-- <DxFilterPanel :visible="true" /> -->
              <!-- <DxFilterRow :visible="true" />
              <DxHeaderFilter :visible="true" /> -->
              <!-- <DxSummary>
                <DxGroupItem
                  column="total"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
                <DxGroupItem
                  column="thu2m"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
                <DxGroupItem
                  column="thu3m"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
                <DxGroupItem
                  column="thu4m"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
                <DxGroupItem
                  column="thu5m"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
                <DxGroupItem
                  column="thu6m"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
                <DxGroupItem
                  column="thu7m"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
                <DxGroupItem
                  column="cnm"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
              </DxSummary> -->
              <!-- <DxSearchPanel
                :visible="true"
                :width="240"
                placeholder="Tìm kiếm..."
              /> -->
               <DxScrolling mode="infinite" />
              <DxColumn
                data-field="congdoan"
                caption="Tổ"
                :group-index="0"
                :width="280"
                
                
              />
              <DxColumn
                data-field="ten san pham"
                :width="320"
                caption="Tên"
                 sort-order="asc"
                :fixed="true"
                :visible="true" 
              />
              <DxColumn
                data-field="item_parent"
                caption="Sản phẩm"
                :group-index="1" 
                :width="280"
              />
              <DxColumn
                caption="Quy cách (Tinh)"
                :width="90"
                alignment="center"
                :fixed="true"
                  :visible="true" 
              >
                <DxColumn
                  data-field="LENGTH"
                  caption="Dài"
                  data-type="number"
                  format="fixedpoint"
                  alignment="left"
                  :width="60"
                />
                <DxColumn
                  data-field="WIDTH"
                  caption="Rộng"
                  data-type="number"
                  format="fixedpoint"
                  alignment="left"
                   :width="70"
                />
                <DxColumn
                  data-field="HEIGHT"
                  caption="Dày"
                  data-type="number"
                  format="fixedpoint"
                  alignment="left"
                   :width="60"
                />
              </DxColumn>
              <!-- <DxColumn data-field="ton" :width="60" caption="Tồn tại tổ" /> -->
            
                <DxColumn
                  data-field="KeHoach"
                  caption="Tổng SL theo LSX"
                  data-type="number"
                  :width="110"
                  format="fixedpoint"
                  alignment="center"
                  
                  sort-order="desc"
          
                />
                
                <DxColumn
                  data-field="dvt"
                  caption="ĐVT"
                  data-type="number"
                  format="fixedpoint"
                  alignment="center"
                  width="60"
                  
                />
              
              <DxColumn caption="Số lượng đã thực hiện"    alignment="center">
                <DxColumn
                  data-field="thu2"
                  caption="T2"
                  data-type="number"
                  format="fixedpoint"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu3"
                  caption="T3"
                  data-type="number"
                  format="fixedpoint"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu4"
                  caption="T4"
                  data-type="number"
                  format="fixedpoint"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu5"
                  caption="T5"
                  data-type="number"
                  format="fixedpoint"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu6"
                  caption="T6"
                  data-type="number"
                  format="fixedpoint"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu7"
                  caption="T7"
                  data-type="number"
                  format="fixedpoint"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="cn"
                  caption="CN"
                  data-type="number"
                  format="fixedpoint"
                  alignment="center"
                  :width="70"
                />
              </DxColumn>
              <DxColumn
                data-field="WEEK_PO"
                caption="Tổng SL đã làm trong tuần"
                data-type="number"
                format="#,##0.####"
                alignment="center"
                :width="80"
              />
              <!-- <DxColumn
                data-field="volumn"
                caption="m³/SP"
                data-type="number"
                format="0.######"
                alignment="center"
              /> -->
              <!-- <DxColumn
                caption="Khối lượng"
                alignment="center"
                :visible="showVolumnColumn"
              >
                <DxColumn
                  data-field="thu2m"
                  caption="T2"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu3m"
                  caption="T3"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu4m"
                  caption="T4"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu5m"
                  caption="T5"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu6m"
                  caption="T6"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu7m"
                  caption="T7"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="cn"
                  caption="CN"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="75"
                />
              </DxColumn> -->
              <DxColumn
                data-field="conPhaiThucHien"
                caption="Số lượng còn phải làm"
                format="#,##0.####"
                cssClass="ColumnsAutomatic"
                alignment="center"
                :width="120"
                cellTemplate ="changeColor"
              />
           
              <DxColumnFixing :enabled="true" />
               <template #changeColor="cell">
            <div 
           
              ><div class="text" style="border-radius:5px;width: 100% ; height:100% ; color:red	 ; padding:5px">
                  <b style="text-color:orange">{{ cell.data.data.conPhaiThucHien}}</b>
                </div> 
            </div>
         
            </template>
            </DxDataGrid>
          <!-- </div>
        </div> -->
   
</div>
  </q-page>
</template>
<style >
.ColumnsAutomatic {
        color:red;
     border-style: inset;
      border-color:black;
        text-align: center;
    }
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
    color: black;
    background-color: #f7f7f7;
     font-weight: 900 ;
     width: 280;
}
</style>
<script>
import {
  DxChart,
  DxAdaptiveLayout,
  DxCommonSeriesSettings,
  DxSize,
  DxTooltip,
} from "devextreme-vue/chart";
import { DxDateBox } from "devextreme-vue";
import { mapGetters, mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
  DxRequiredRule,
  DxScrolling,
  DxSearchPanel,
  DxSelection,
  DxColumnFixing,
  DxSorting,
  DxGroupPanel,
  DxFilterRow,
  DxFilterPanel,
  DxHeaderFilter,
  DxGroupItem,
  DxSummary,
} from "devextreme-vue/data-grid";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
  getWeekNumber,
  showLoadingIos,
  closeLoading,
} from "../../../ultils";
import {
  DxPivotGrid,
  DxFieldChooser,
  DxExport,
} from "devextreme-vue/pivot-grid";
export default {
  components: {
    DxHeaderFilter,
    DxChart,
    DxAdaptiveLayout,
    DxCommonSeriesSettings,
    DxSize,
    DxFilterPanel,
    DxTooltip,
    DxPivotGrid,
    DxFieldChooser,
    DxExport,
    DxFilterRow,
    DxSorting,
    DxGroupPanel,
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxLookup,
    DxRequiredRule,
    DxScrolling,
    DxSearchPanel,
    DxSelection,
    DxColumnFixing,
    DxGroupItem,
    DxSummary,
  },
  computed: {
    pivortGrid: function () {
      return this.$refs.grid.instance;
    },
    ...mapGetters("base", [
      "opCongDoans",
      "myFactoryInfor",
      "userInfo",
      "dsCongDoans",
    ]),
  },
  data() {
    return {
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102299,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102299,
          code: "TB",
        },
      ],
      selection:false,
      number:"",
      listNumber: [],
      data1: [],
      idDepartment: null,
      showChooseMonth: false,
      dataSource: null,
      year: null,
      gop:false,
      fa:100000,
      month: null,
      stepId: null,
      week: "",
      departments: [],
      department: null,
      title: "Sản lượng cần thực hiện trong tuần",
      countData: 0,
      fa: 0,
      dataSourceGrid: [],
      showPivort: false,
      showFilterDialog: false,
      showVolumnColumn: true,
    };
  },
  created() {
    const today = new Date();
    const currentMonth = today.getMonth();
    this.month = currentMonth;
    const currentYear = today.getFullYear();
    this.year = currentYear;
    //this.load()
    this.week = getWeekNumber(today);
    // this.loadDepartments()
    this.loadGrid();
  },
  methods: {
    ...mapActions("base", ["getAllDepartment","getAllCongDoans"]),
    calculateTyLe(rowData) {
      if (parseFloat(rowData.tongSanLuong) > 0 && parseFloat(rowData.po) > 0) {
        const tyle = rowData.tongSanLuong / rowData.po;
        return tyle;
      }
    },
    async onChange(value) {
      await this.getAllCongDoans({ factoryId:value.factoryId})
      
    let congdoan = this.dsCongDoans
        .filter(
          (s) =>
             s.type2 === 'to'
        )
        .map((o) => ({
          label: o.name,
          value: o.id,
          description: `[${o.code}] ${o.name}`,
          icon: "mail",
          factoryId:o.factoryId
        }));
      // this.stepId = null;
    this.data = congdoan;
          if (this.idDepartment.code == "TH") this.fa = 100000;
      if (this.idDepartment.code == "YS1A") this.fa = 100003;
      if (this.idDepartment.code == "YS1B") this.fa = 100004;
      if (this.idDepartment.code == "TB") this.fa = 100005;
       this.listNumber = []
       const payload = {
        week: this.week ,
        year: this.year,
        factoryId: this.fa,
   
      };
     
   
      const data2 = await this.$store.dispatch("prod/GET_HE_SO_LSX", payload);
         data2.data.forEach((element) => {
       
            this.listNumber.push(element.number);
         });
       
    },
    async filterFn(val, update) {
      console.log("this.data", this.data);
      if (val === "") {
        update(() => {
          this.data1 = this.data;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.data1 = this.data.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    exportToExcel() {
      // this.pivortGrid.exportToExcel()
    },
      print(){
        window.print()
    },
    async goplenh(){
         if (this.selection){
           this.gop = true
           this.loadGrid();
         } else {
           this.gop = false
         this.loadLSX();
         }
    },
    async loadDepartments() {
      const myFactoryId = this.myFactoryInfor.id;
      const payload = {
        factoryId: myFactoryId,
      };
      if (myFactoryId) {
        const data = await this.$store.dispatch(
          "base/GET_DEPARTMENTS",
          payload
        );

        // this.departments = data.data
        data.data.forEach((element) => {
          if (element.type === "Tổ") {
            this.departments.push({
              value: element.id,
              label: element.name,
            });
          }
        });
        if (this.departments.length > 0) {
          this.department = this.departments[0];
        }
      }
    },
    async selectMonthYear(m, y) {
      this.month = m;
      this.year = y;
      this.$q.loading.show();
      await this.load();
      this.showChooseMonth = false;
      this.$q.loading.hide();
    },
    onCellPrepared: function (e) {
       if (e.rowType === "group") {
        if (e.row.groupIndex == 0) {
          e.cellElement.style.backgroundColor = "#bbdefb";
        }
      }

      if (e.cell.type === "GT" && e.cell.text === "Grand Total") {
        // e.cell.text='Tổng'
        // return 'Tổng'
        // e.cellElement.find("span").text('Tổng')
        // e.cellElement.text('Tổng')
        // e.cell.text="Tổng"
        // e.cellElement=`<td style="border-right:0px;border-bottom-width:0px" class="dx-row-total dx-grandtotal"><span>Tổng</span></td>`
        // e.cell.isLast = false
        // console.log(e)
        e.cellElement.innerText = "Tổng";
      }
      // console.log(e.cell)
      // if (e.area == "data" && e.cell.rowType == "GT" && e.cell.columnPath.length) {
      //     var quarter = e.cell.columnPath.length > 1 ?
      //                 "+Q"+e.cell.columnPath[1].toString() : "";
      //     e.cellElement.find("span")
      //     .text("Drilldown:"+e.cell.columnPath[0].toString() + quarter);
      // }
    },
    async loadLSX(){
          if (this.stepId){
              const payload = {
        week: this.week + 1,
        year: this.year,
        factoryId: this.fa,
        departmentId: this.stepId ? this.stepId.value : 0,
        number:this.number,
      };
       const data = await this.$store.dispatch("prod/GET_REPORT_WEEK_IN_LSX", payload);
           let dataConvert = [];

      data.data.forEach((element) => {   
        if (element["po"] <= 0) {
          element.po = null;
        }
        if (element.tongSanLuong <= 0) {
          element.tongSanLuong = null;
        }
     
        if (element.WEEK_PO) {
          element.WEEK_PO =
            element["thu2"] +
            element["thu3"] +
            element["thu4"] +
            element["thu5"] +
            element["thu6"] +
            element["thu7"] +
            element["cn"];
        
        }
        if (element.UNIT_ID) {
          element.UNIT_ID = parseFloat((element.WEEK_PO/element.KeHoach ) * 100).toFixed(2) + "%"
         
        } else {
          element.UNIT_ID = null
        }
        if (element.KeHoach) {
          if (element.volumn == "M3") {
            element.total = element.KeHoach;
          } else {
            element.total = parseFloat(element.KeHoach * element.volumn);
          }
          if (element.KeHoach == null){
            element.total == null
          }
         
        }
      
        if (element.conPhaiThucHien == null) {
         
          if (parseFloat(element.KeHoach) - parseFloat(element.WEEK_PO)>=0){
          element.conPhaiThucHien =
            parseFloat(element.KeHoach) - parseFloat(element.WEEK_PO);
         
          }
        }
        dataConvert.push(element);
      });
    
      this.dataSourceGrid = dataConvert;
      closeLoading();
          }
          else  {
            this.number = ""
          this.$q.dialog({
          html: true,
          
          message:"Bạn phải chọn công đoạn cần in "
            
        });
          }
    },
    async loadGrid() {
      this.number = ""
      if (this.idDepartment.code == "TH") this.fa = 100000;
      if (this.idDepartment.code == "YS1A") this.fa = 100003;
      if (this.idDepartment.code == "YS1B") this.fa = 100004;
      if (this.idDepartment.code == "TB") this.fa = 100005;
          this.listNumber = []
          if (this.fa){
       let payload = {
        week: this.week ,
        year: this.year,
        factoryId: this.fa,
   
      };
     
   
      let data2 = await this.$store.dispatch("prod/GET_HE_SO_LSX", payload);
         data2.data.forEach((element) => {
       
            this.listNumber.push(element.number);
         });
          }
      const payload = {
        week: this.week + 1,
        year: this.year,
        factoryId: this.fa,
        departmentId: this.stepId ? this.stepId.value : 0,
      };
      this.title = `Sản lượng thực hiện trong tuần ${this.week} - ${this.year}`;
      showLoadingIos();
      // let dataPivort = [];
      const data = await this.$store.dispatch("prod/GET_REPORT_WEEK_IN", payload);
      let dataConvert = [];

      data.data.forEach((element) => {   
        if (element["po"] <= 0) {
          element.po = null;
        }
        if (element.tongSanLuong <= 0) {
          element.tongSanLuong = null;
        }
     
        if (element.WEEK_PO) {
          element.WEEK_PO =
            element["thu2"] +
            element["thu3"] +
            element["thu4"] +
            element["thu5"] +
            element["thu6"] +
            element["thu7"] +
            element["cn"];
        
        }
        if (element.UNIT_ID) {
          element.UNIT_ID = parseFloat((element.WEEK_PO/element.KeHoach ) * 100).toFixed(2) + "%"
         
        } else {
          element.UNIT_ID = null
        }
        if (element.KeHoach) {
          if (element.volumn == "M3") {
            element.total = element.KeHoach;
          } else {
            element.total = parseFloat(element.KeHoach * element.volumn);
          }
          if (element.KeHoach == null){
            element.total == null
          }
         
        }
      
        if (element.conPhaiThucHien == null) {
         
          if (parseFloat(element.KeHoach) - parseFloat(element.WEEK_PO)>=0){
          element.conPhaiThucHien =
            parseFloat(element.KeHoach) - parseFloat(element.WEEK_PO);
         
          }
        }
        dataConvert.push(element);
      });
    
      this.dataSourceGrid = dataConvert;
      closeLoading();
    },
  },
};
</script>

<style scoped>
#gridContainer {
  height: 600px;
}


</style>