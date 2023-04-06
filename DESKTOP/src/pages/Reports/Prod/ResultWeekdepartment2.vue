<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          {{ title }} - {{ idDepartment ? idDepartment.label : "" }}
        </div>
        <div class="col-6 text-blue text-bold" align="right">
          <span style="font-size: 18px">Tuần: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="loadGrid"
            v-model="week"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 40px;
            "
          />
          <span style="margin-right: 15px">-</span>
          <span style="font-size: 18px">Năm: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="loadGrid"
            v-model="year"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 60px;
            "
          />
        </div>
      </div>
      <q-card>
           <div style="padding: 5px">
        <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
          <div class="col-8">
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in options"
                :key="index"
              >
                <q-radio
                  dense
                  @input="onChange"
                  v-model="idDepartment"
                  :val="congDoan"
                  :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  v-bind:class="{ isActive: true }"
                  color="amber-6"
                />
              </div>
            </div>
          </div>
          <div class="col-4" align="right">
            <q-checkbox
              v-model="isExcel"
              color="amber-6"
              class="text-weight-bold"
              label="Xuất Excel"
              dense
            />
          </div>
        </div>
        

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

          <DxSearchPanel
            :visible="true"
            :width="240"
            placeholder="Tìm kiếm..."
          />
          <DxColumn data-field="condoan" caption="Tổ" :width="280" />

          <DxColumn caption="Khối lượng" alignment="center">
            <DxColumn
              data-field="thu2"
              caption="T2"
              data-type="number"
              format="#,##0.##"
              alignment="center"
              :width="70"
            />
            <DxColumn
              data-field="thu3"
              caption="T3"
              data-type="number"
              format="#,##0.##"
              alignment="center"
              :width="70"
            />
            <DxColumn
              data-field="thu4"
              caption="T4"
              data-type="number"
              format="#,##0.##"
              alignment="center"
              :width="70"
            />
            <DxColumn
              data-field="thu5"
              caption="T5"
              data-type="number"
              format="#,##0.##"
              alignment="center"
              :width="70"
            />
            <DxColumn
              data-field="thu6"
              caption="T6"
              data-type="number"
              format="#,##0.##"
              alignment="center"
              :width="70"
            />
            <DxColumn
              data-field="thu7"
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
          </DxColumn>

          <DxColumn
            data-field="TONGKL"
            caption="Tổng KL đạt được"
            data-type="number"
            format="#,##0.##"
            alignment="center"
            :width="100"
          />

          <DxColumnFixing :enabled="true" />
        </DxDataGrid>
        </div>
      </q-card>
    </div>
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
      isExcel: false,
      idDepartment: null,
      xoa: false,
      showChooseMonth: false,
      dataSource: null,
      year: null,
      month: null,
      stepId: null,
      week: "",
      departments: [],
      department: null,
      title: "Báo cáo sản lượng tuần",
      countData: 0,
      fa: 0,
      dataSourceGrid: [],
      allDepartment: false,
      allDepartmentTH: false,
      allDepartmentYS1: false,
      allDepartmentTB: false,
      allDepartmentQM: false,
      allDepartmentCBG: false,
      chonCongDoansTH: [],
      chonCongDoansYS1: [],
      chonCongDoansTB: [],
      chonCongDoansQM: [],
      chonCongDoansCBG: [],
      arrDepartment: [],
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
    this.loadListGroupDepartment();
  },
  methods: {
    ...mapActions("base", ["getAllDepartment"]),
    calculateTyLe(rowData) {
      if (parseFloat(rowData.tongSanLuong) > 0 && parseFloat(rowData.po) > 0) {
        const tyle = rowData.tongSanLuong / rowData.po;
        return tyle;
      }
    },
    async onChange() {
      this.loadGrid();
    },

    exportToExcel() {
      // this.pivortGrid.exportToExcel()
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
      if (e.cell.type === "GT" && e.cell.text === "Grand Total") {
        e.cellElement.innerText = "Tổng";
      }
    },
    async loadGrid() {
      if (this.idDepartment.code == "TH") this.fa = 100000;
      if (this.idDepartment.code == "YS1A") this.fa = 100003;
      if (this.idDepartment.code == "YS1B") this.fa = 100004;
      if (this.idDepartment.code == "TB") this.fa = 100005;
      const payload = {
        week:this.year<2023?parseInt(this.week)  + 1:parseInt(this.week),
        year: this.year,
        factoryId: this.idDepartment.factoryId,
      };
      this.title = `Báo cáo sản lượng tuần ${this.week} - ${this.year}`;
      showLoadingIos();
      // let dataPivort = [];
      const data = await this.$store.dispatch(
        "prod/GET_REPORT_WEEKDEPARTMENT",
        payload
      );
      let dataConvert = [];

      data.data.forEach((element) => {
        element.TONGKL =
          element["thu2"] +
          element["thu3"] +
          element["thu4"] +
          element["thu5"] +
          element["thu6"] +
          element["thu7"] +
          element["cn"];
        // console.log("WEEK_PO",element.WEEK_PO)

        dataConvert.push(element);
      });
      // console.log('dataConvert',dataConvert)
      this.dataSourceGrid = dataConvert;
      closeLoading();
    },
  },
};
</script>

<style>
/* #gridContainer {
  height: 700px;
} */
.active {
  color: #f6b024;
}
</style>