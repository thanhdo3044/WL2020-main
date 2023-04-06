<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-10 top-title text-orange">
            {{ title }} - {{ idDepartment ? idDepartment.label : "" }}
          </div>
        
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <div class="row">
          <q-input
            class="col-2 q-ml-sm"
            @input="loadGrid"
            outlined
            v-model.number="year"
            type="number"
            label-color="orange"
            label="Năm"
          />
          <q-input
            class="col-2 q-ml-sm"
            @input="loadGrid"
            outlined
            v-model.number="week"
            type="number"
            label-color="orange"
            label="Tuần"
          />
          <q-select
            class="col-2 q-ml-sm"
            @input="onChange"
            outlined
            v-model="idDepartment"
            :options="options"
            label-color="orange"
            label="Chọn nhà máy"
          />
        </div>
        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
              id="gridContainer"
              :word-wrap-enabled="true"
              :data-source="dataSourceGrid"
              :show-row-lines="true"
              :show-column-lines="true"
              :show-borders="true"
              :column-auto-width="true"
              :no-data-text="'Không có dữ liệu !'"
            >
              <DxExport
                :enabled="true"
                :allow-export-selected-data="true"
                :file-name="title"
              />
              <DxGroupPanel :visible="true" />
              <DxScrolling mode="infinite" />
              <DxSorting mode="none" />

              <DxFilterRow :visible="true" />
              <DxHeaderFilter :visible="true" />
              <DxSummary>
                <DxGroupItem
                  column="total"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />

                <DxTotalItem
                  column="TONGKL"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
         
              </DxSummary>
              <DxSearchPanel
                :visible="true"
                :width="240"
                placeholder="Tìm kiếm..."
              />
              <DxColumn data-field="MA_VT" caption="Mã VT" :width="380" />
              <DxColumn data-field="TEN_VT" :width="380" caption="Tên vật tư" />

              <DxColumn data-field="TON" :width="180" caption="Tồn tại tổ" />

              <DxColumnFixing :enabled="true" />
            </DxDataGrid>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

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
  DxTotalItem,
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
    DxTotalItem,
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
          factoryId: 102340,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102366,
          code: "TB",
        },
      ],
      data1: [],
      idDepartment:  {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
      xoa: false,
      showChooseMonth: false,
      dataSource: null,
      year: null,
      month: null,
      stepId: null,
      week: "",
      departments: [],
      department: null,
      title: "Báo cáo tồn sơn",
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
    ...mapActions("base", ["getAllDepartment"]),
    calculateTyLe(rowData) {
      if (parseFloat(rowData.tongSanLuong) > 0 && parseFloat(rowData.po) > 0) {
        const tyle = rowData.tongSanLuong / rowData.po;
        return tyle;
      }
    },
    async onChange(value) {
      this.loadGrid();
    
    },
 
    exportToExcel() {
      // this.pivortGrid.exportToExcel()
    },
  
    async selectMonthYear(m, y) {
      this.month = m;
      this.year = y;
      this.$q.loading.show();
      await this.load();
      this.showChooseMonth = false;
      this.$q.loading.hide();
    },
 
    async loadGrid() {
      if (this.idDepartment.code == "TH") this.fa = 100000;
      if (this.idDepartment.code == "YS1A") this.fa = 100003;
      if (this.idDepartment.code == "YS1B") this.fa = 100004;
      if (this.idDepartment.code == "TB") this.fa = 100005;
      const payload = {
        week: this.week + 1,
        year: this.year,
        factoryId: this.idDepartment.factoryId,
      };
      this.title = `Báo cáo tồn sơn tuần ${this.week} - ${this.year}`;
      showLoadingIos();
      // let dataPivort = [];
      const data = await this.$store.dispatch(
        "prod/GET_REPORT_TON_SON",
        payload
      );


 
      // console.log('dataConvert',dataConvert)
      this.dataSourceGrid = data.data;
      closeLoading();
    },
  },
};
</script>

<style scoped>
#gridContainer {
  height: 800px;
}
</style>