<template>
  <q-page class="q-pa-sm">
    
       <q-card-section>
      
          <div class="col-10 top-title text-orange">
            {{ title }} - {{ idDepartment ? idDepartment.label : "" }}
         
              
            
          </div> 
      <q-separator inset />
     
        <div class="row print-hide">
          <q-input  
            class="col-2 q-ml-sm"
            @input="loadGrid"
            outlined
            v-model.number="year"
            type="number"
            label="Năm"
          />
          <q-input
            class="col-2 q-ml-sm"
            @input="loadGrid"
            outlined
            v-model.number="week"
            type="number"
            label="Tuần"
          />
          <q-select
            class="col-2 q-ml-sm"
            @input="onChange"
            outlined
            v-model="idDepartment"
            :options="options"
            label="Chọn nhà máy"
          />
          <q-btn class="col-2 q-ml-sm" color="primary" size="20px" icon="print" flat @click="print" />
        </div>
      
            <DxDataGrid
              :word-wrap-enabled="true"
              :data-source="dataSourceGrid"
              :show-row-lines="true"
              :show-column-lines="true"
              :show-borders="true"
            
           
              :no-data-text="'Không có dữ liệu !'"
            >
              <DxExport
                :enabled="true"
                :allow-export-selected-data="true"
                :file-name="title"
              />
               <DxScrolling mode="infinite" />
              <DxColumn
                data-field="DEPARTMENT_NAME"
                caption="Tổ"
               cssClass="ColumnsAutomatic1"
                :group-index="0"
                :width="280"
                
                
              />
              <DxColumn
                data-field="ITEM_NAME"
                :width="280"
                caption="SP/Chi tiết"
                cssClass="ColumnsAutomatic1"
                 sort-order="asc"
                :fixed="true"
                :visible="true" 
              />
              
              <DxColumn
                caption="Quy Cách (Tinh)"
                :width="90"
                alignment="center"
                  cssClass="ColumnsAutomatic1"
                :fixed="true"
                  :visible="true" 
              >
                <DxColumn
                  data-field="length"
                  caption="Dài"
                  data-type="number"
                  format="fixedpoint"
                    cssClass="ColumnsAutomatic1"
                  alignment="left"
                  :width="60"
                />
                <DxColumn
                  data-field="width"
                  caption="Rộng"
                  data-type="number"
                  format="fixedpoint"
                    cssClass="ColumnsAutomatic1"
                  alignment="left"
                   :width="70"
                />
                <DxColumn
                  data-field="height"
                  caption="Dày"
                  data-type="number"
                  format="fixedpoint"
                    cssClass="ColumnsAutomatic1"
                  alignment="left"
                   :width="60"
                />
              </DxColumn>
              <DxColumn
                data-field="number"
                :width="280"
                caption="Lệnh sản xuất"
                cssClass="ColumnsAutomatic1"
                 sort-order="asc"
                :fixed="true"
                :visible="true" 
              />
              <DxColumn
                caption="Kế hoạch thực hiện"
                :width="180"
                  cssClass="ColumnsAutomatic1"
                alignment="center"
              >
                <DxColumn
                  data-field="keHoach"
                  caption="Số lượng phải làm"
                  data-type="number"
                  :width="120"
                    cssClass="ColumnsAutomatic1"
                  format="fixedpoint"
                  alignment="center"
                  
                  sort-order="desc"
          
                />
                
                <DxColumn
                  data-field="UNIT_NAME"
                  caption="ĐVT"
                  data-type="number"
                  format="fixedpoint"
                  alignment="center"
                    cssClass="ColumnsAutomatic1"
                  width="60"
                  
                />
              </DxColumn>
              <DxColumn caption="Số lượng đã thực hiện"   cssClass="ColumnsAutomatic1" alignment="center">
                <DxColumn
                  data-field="thu2"
                  caption="T2"
                  data-type="number"
                    cssClass="ColumnsAutomatic1"
                  format="fixedpoint"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu3"
                  caption="T3"
                  data-type="number"
                  format="fixedpoint"
                    cssClass="ColumnsAutomatic1"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu4"
                  caption="T4"
                  data-type="number"
                    cssClass="ColumnsAutomatic1"
                  format="fixedpoint"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu5"
                  caption="T5"
                  data-type="number"
                    cssClass="ColumnsAutomatic1"
                  format="fixedpoint"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu6"
                  caption="T6"
                  data-type="number"
                    cssClass="ColumnsAutomatic1"
                  format="fixedpoint"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu7"
                  caption="T7"
                  data-type="number"
                    cssClass="ColumnsAutomatic1"
                  format="fixedpoint"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="cn"
                  caption="CN"
                  data-type="number"
                    cssClass="ColumnsAutomatic1"
                  format="fixedpoint"
                  alignment="center"
                  :width="70"
                />
              </DxColumn>
              <DxColumn
                data-field="WEEK_PO"
                caption="Tổng SL tuần"
                data-type="number"
                  cssClass="ColumnsAutomatic1"
                format="#,##0.####"
                alignment="center"
                :width="80"
                :calculate-cell-value="calculateTongSLTuan"
              />
              <DxColumn
                data-field="conPhaiThucHien"
                caption="Số lượng còn phải làm"
                cssClass="ColumnsAutomatic"
                format="#,##0.####"
                alignment="center"
                :width="120"
                :calculate-cell-value="calculateConPhaiThucHien"
              />
              <DxColumnFixing :enabled="true" />
            </DxDataGrid>
      </q-card-section>
  </q-page>
</template>
<style >
.ColumnsAutomatic {
        color:red;
     border-style: inset;
      border-color:black;
        background-color: white;
        text-align: center;
    }
    .ColumnsAutomatic1 {
        color: black;
        background-color: white;
       font-weight: 500;
       font-size: 32px
    }
    .dx-command-expand{
 
  background: white ;
  font-weight: 900 ;
   width: 280;
  font-family: Arial, Helvetica, sans-serif;
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
      options: [],
      data1: [],
      idDepartment: null,
      showChooseMonth: false,
      dataSource: null,
      year: null,
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
    this.week = getWeekNumber(today);
    this.loadGrid();
    this.loadFactory();
  },
  methods: {
    ...mapActions("base", ["getAllDepartment"]),
    async loadFactory() {
      let factories1 = await this.$store.dispatch("vcn/getFactory");
      factories1.map((factory) => {
        factory.label = factory.name;
        factory.factoryId = factory.id;
      });
      this.options = factories1;
    },
    calculateTongSLTuan(rowData){
        rowData.WEEK_PO = rowData.thu2 + rowData.thu3 + rowData.thu4 + rowData.thu5 + rowData.thu6 + rowData.thu7 + rowData.cn;
        return rowData.WEEK_PO;
    },
    calculateConPhaiThucHien(rowData){
        rowData.conPhaiThucHien = rowData.keHoach - rowData.WEEK_PO;
        return rowData.conPhaiThucHien;
    },
    async onChange() {
      this.loadGrid();
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
    },
      print(){
        window.print()
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
      if (e.cell.type === "GT" && e.cell.text === "Grand Total") {
        
        e.cellElement.innerText = "Tổng";
      }
      
    },
    async loadGrid() {
      const payload = {
        week: this.week,
        year: this.year,
        factoryId: this.idDepartment.factoryId,
      };
      console.log("payload", payload);
      this.title = `Sản lượng thực hiện trong tuần ${this.week} - ${this.year}`;
      const data = await this.$store.dispatch("vcn/GET_REPORT_WEEK_IN_VCN", payload);
      this.dataSourceGrid = data.data;
    },
  },
};
</script>

<style scoped>
#gridContainer {
  height: 600px;
}


</style>