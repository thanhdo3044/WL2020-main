<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-5 text-blue text-bold" style="font-size: 18px">
          Báo cáo sản lượng quy đổi khối CBG - {{ year }}
        </div>
        <div class="col-5" align="right">
          <q-radio
            style="font-weight: bold; padding-right: 40px"
            @input="loadData"
            color="amber-6"
            v-model="typeBC"
            val="tuan"
            label="Tuần"
          />
          <q-radio
            style="font-weight: bold; padding-right: 40px"
            color="amber-6"
            @input="loadData"
            v-model="typeBC"
            val="nam"
            label="Tháng"
          />
        <!--   <q-radio
            v-if="idDepartment"
            color="amber-6"
            style="font-weight: bold"
            @input="loadData"
            v-model="type"
            val="sl"
            label="SL"
          />
          <q-radio
            v-if="idDepartment"
            color="amber-6"
            style="font-weight: bold"
            @input="loadData"
            v-model="type"
            val="m3"
            label="M³"
          /> -->
        </div>
        <div class="col-2 text-blue text-bold" align="right">
          <span style="font-size: 18px">Năm: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="changeDate"
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
    </div>
    <q-card>
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
              @input="loadData"
                v-model="idDepartment"
                :val="congDoan"
                :label="congDoan.label"
                style="border-radius: 5px; font-size: 13px"
                class="text-weight-bold"
                color="amber-6"
              />
            </div>
          </div>
        </div>

        <div class="col-4" align="right">
          <q-checkbox
            v-model="isShow"
            color="amber-6"
            style="margin-right: 30px"
            class="text-weight-bold text-blue"
            label="Mở rộng"
            dense
          />
          <q-checkbox
            v-model="isExcel"
            @input="xuattieude"
            color="amber-6"
            class="text-weight-bold text-blue"
            label="Xuất Excel"
            dense
          />
        </div>
      </div>
      <div class="row" style="font-size: 12px; vertical-align: top">
        <div class="col-12">
          <table style="border: 1px solid black; width: 100%">
            <tr>
              <td scope="col" style="border-right: 1px solid black">
                <div>
                  <q-checkbox
                    @input="selectAll()"
                    dense
                    color="amber-6"
                    class="text-blue"
                    style="font-weight: bold"
                    v-model="allDepartmentCBG"
                    label="Chọn tất"
                  />
                </div>
              </td>
              <td
                scope="col"
                style="vertical-align: top"
                v-for="(value, index) in listGroupDepartment"
                :key="index"
              >
                <div>
                  <q-checkbox
                    @input="loadData"
                    dense
                    v-model="chonCongDoansCBG"
                    :val="value.NAME"
                    style="font-weight: bold"
                    :label="value.NAME"
                    color="amber-6"
                  />
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </q-card>

    <div class="col-12">
      <DxDataGrid
        id="BCSanLuongTheoThang2"
        :data-source="dataSource"
        :show-borders="true"
        :show-row-lines="true"
        :hover-state-enabled="true"
        :row-alternation-enabled="true"
        :no-data-text="'Vui lòng chọn công đoạn'"
        :show-column-lines="true"
        :allow-column-resizing="true"
        @cell-prepared="onCellPrepared"
        @row-prepared="onRowPrepared"
        @content-ready="onContentReady"
      >
        <DxScrolling mode="virtual" />
        <DxGroupPanel
          :visible="isExcel"
          :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
        />
        <DxSorting mode="none" />
        <DxHeaderFilter :visible="true" />
        <DxSorting mode="single" />
        <DxGrouping :auto-expand-all="isShow" />
        <DxColumn
     data-field="tong"
        
          :group-index="0"
           :sort-index="0"
          sort-order="asc"
            group-cell-template="groupCellTemplate1"
        />
           <template #groupCellTemplate1="{ data }">
          <div style="font-weight: bold">{{ data.value.substring(2) }}</div>
        </template>
        <DxColumn
          data-field="groupName"
          caption=""
          :group-index="1"
          group-cell-template="groupCellTemplate"
          :sort-index="0"
          sort-order="asc"
        />
        <template #groupCellTemplate="{ data }">
          <div style="font-weight: bold">{{ data.value.substring(2) }}</div>
        </template>
    <DxColumn
          caption="ID"
          data-field="ID_SP"
        
          width="90"
      :fixed="true"
        />
        <DxColumn
          caption="Sản phẩm"
          data-field="sanPham"
          format="fixedPoint"
          alignment="left"
          width="420"
          :fixed="true"
        />
        <DxColumn
        v-if="typeBC == 'tuan'"
          caption="Tổng"
          data-field="total"
          width="180"
          alignment="right"
          format="#,##0"
          :fixed="true"
          :calculate-cell-value="calculateTong"
        />
            <DxColumn
        v-if="typeBC == 'nam'"
          caption="Tổng"
          data-field="total"
          width="180"
          alignment="right"
          format="#,##0"
          :fixed="true"
          :calculate-cell-value="calculateTong_thang"
        />
       <DxColumn v-if="typeBC == 'nam'" v-for="(value, index) in thangs" :key="'y' + index + 20"
          :caption="'Tháng ' + value.id" :data-field="'thang' + value.id" width="120" alignment="center"
          format="#,##0" />

        <DxColumn
         v-if="typeBC == 'tuan'"
          v-for="(value, index) in listWeek"
          :key="'m' + index"
          :caption="'Tuần ' + value"
          :data-field="'week' + value"
          width="130"
          alignment="right"
          format="#,###,###,##0"
        />

        <DxSummary>
          <DxGroupItem
            v-for="(value, index) in listWeek"
            :key="'w' + index + 10"
            :column="'week' + value"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0'"
          />
    <DxGroupItem
            v-for="(value, index) in thangs"
            :key="'y' + index + 10"
            :column="'thang' + value.id"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0'"
          />
          <DxGroupItem
            column="total"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0'"
          />
        </DxSummary>
        <DxExport
          :enabled="isExcel"
          :allow-export-selected-data="false"
          :file-name="tieude"
        />
      </DxDataGrid>
    </div>
    <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white text-black">
        <q-bar>
          <q-space />

          <q-btn
            dense
            flat
            icon="minimize"
            @click="maximizedToggle = false"
            :disable="!maximizedToggle"
          >
            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary"
              >Minimize</q-tooltip
            >
          </q-btn>
          <q-btn
            dense
            flat
            icon="crop_square"
            @click="maximizedToggle = true"
            :disable="maximizedToggle"
          >
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary"
              >Maximize</q-tooltip
            >
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxScrolling,
  DxSorting,
  DxExport,
  DxSummary,
  DxGroupItem,
  DxTotalItem,
  DxHeaderFilter,
  DxColumnChooser,
} from "devextreme-vue/data-grid";
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxLabel,
  DxFormat,
  DxLegend,
  DxValueAxis,
  DxTitle,
  DxConstantLine,
  DxFont,
  DxVisualRange,
  DxTooltip,
} from "devextreme-vue/chart";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxScrolling,
    DxSorting,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxExport,
    DxSummary,
    DxGroupItem,
    DxTotalItem,
    DxHeaderFilter,
    DxColumnChooser,
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxLabel,
    DxFormat,
    DxLegend,
    DxValueAxis,
    DxTitle,
    DxConstantLine,
    DxFont,
    DxVisualRange,
    DxTooltip,
  },
  data() {
    return {
      dataSource: [],
      dataChart: [],
      congSuat: null,
      isShow: false,
      isSayPhoi: true,
      showVolumnColumn: true,
      week: moment().week(),
      year: moment().year(),
      month: moment().month() + 1,
      weeks: [
        {
          label: "Thứ 2",
          value: "thu2",
        },
        {
          label: "Thứ 3",
          value: "thu3",
        },
        {
          label: "Thứ 4",
          value: "thu4",
        },
        {
          label: "Thứ 5",
          value: "thu5",
        },
        {
          label: "Thứ 6",
          value: "thu6",
        },
        {
          label: "Thứ 7",
          value: "thu7",
        },
        {
          label: "CN",
          value: "thu1",
        },
      ],
      thangs: [
        { label: 1, id: 1 },
        { label: 2, id: 2 },
        { label: 3, id: 3 },
        { label: 4, id: 4 },
        { label: 5, id: 5 },
        { label: 6, id: 6 },
        { label: 7, id: 7 },
        { label: 8, id: 8 },
        { label: 9, id: 9 },
        { label: 10, id: 10 },
        { label: 11, id: 11 },
        { label: 12, id: 12 },
      ],
      listWeek: [],
      chonCongDoans: [],
      dulieu: [],
      type: "sl",
      ngaythang: null,
      typeBC: "tuan",
      group: null,
      chonFactoryId: null,
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
      listGroupDepartment: [],
      arrDepartment: [],
      arrGroupDepartment: [],
      departments: [],
      open: 0,
      isExcel: false,
      tieude: null,
      idDepartment: null,
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          id: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          id: 102340,
          code: "YS1",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          id: 102366,
          code: "TB",
        },
        {
          label: "Khối Chế biến gỗ",
          id: 102299,
          code: "CBG",
        },
      ],
      dialog: false,
      maximizedToggle: true,
    };
  },
  created() {
    if (this.typeBC == "nam") this.ngaythang = "tháng";
    if (this.typeBC == "tuan") this.ngaythang = "tuần";

    this.loadListGroupDepartment();
  },
  methods: {
    ...mapActions("prod", [
      "getDepartmentByFactoryId",
      "getSLTheoTuanSL",
      "getSLTheoTuanM3_quidoi",
      "getSLTheoThangSL2",
      "getSLTheoThangM32",
      "getSLTheoNamSL",
      "getSLTheoNamSL_quidoi",
      "getChartSLTheoNam",
      "getChartSLTheoTuanSS",
      "getChartSLTheoThangSS",
      "getSLTheoNamM3",
      "getDepartmentByFactoryId",
      "getGroupDepartment",
      "getListGroupDepartment",
      "getCongSuatInDepartment",
      "getChartSLTheoWeek",
    ]),
    customizeTooltip({ valueText }) {
      return {
        text: `${parseFloat(valueText).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      };
    },
    showDialogDetail() {
      this.dialog = true;
      this.open = 1;
    },
    calculateTong(rowData) {
      rowData.total =
        rowData.week1 +
        rowData.week2 +
        rowData.week3 +
        rowData.week4 +
        rowData.week5 +
        rowData.week6 +
        rowData.week7 +
        rowData.week8 +
        rowData.week9 +
        rowData.week10 +
        rowData.week11 +
        rowData.week12 +
        rowData.week13 +
        rowData.week14 +
        rowData.week15 +
        rowData.week16 +
        rowData.week17 +
        rowData.week18 +
        rowData.week19 +
        rowData.week20 +
        rowData.week21 +
        rowData.week22 +
        rowData.week23 +
        rowData.week24 +
        rowData.week25 +
        rowData.week26 +
        rowData.week27 +
        rowData.week28 +
        rowData.week29 +
        rowData.week30 +
        rowData.week31 +
        rowData.week32 +
        rowData.week33 +
        rowData.week34 +
        rowData.week35 +
        rowData.week36 +
        rowData.week37 +
        rowData.week38 +
        rowData.week39 +
        rowData.week40 +
        rowData.week41 +
        rowData.week42 +
        rowData.week43 +
        rowData.week44 +
        rowData.week45 +
        rowData.week46 +
        rowData.week47 +
        rowData.week48 +
        rowData.week49 +
        rowData.week50 +
        rowData.week51 +
        rowData.week52;
      return rowData.total;
    },
     calculateTong_thang(rowData) {
      rowData.total =
        rowData.thang1 +
        rowData.thang2 +
        rowData.thang3 +
        rowData.thang4 +
        rowData.thang5 +
        rowData.thang6 +
        rowData.thang7 +
        rowData.thang8 +
        rowData.thang9 +
        rowData.thang10 +
        rowData.thang11 +
        rowData.thang12;
      return rowData.total;
    },
    onCellPrepared(e) {
      if (e.rowType === "group") {
        if (e.row.groupIndex == 0) {
          e.cellElement.style.backgroundColor = "#64b5f6";
        }
        if (e.row.groupIndex == 1) {
          e.cellElement.style.backgroundColor = "#bbdefb";
        }
      }
    },
    onRowPrepared(e) {
      var alignByColumn,
        groupSummary,
        colspan = 0;

      if (e.rowType === "group") {
        groupSummary = e.component.option("summary.groupItems");
        groupSummary.forEach((el) => {
          alignByColumn = el.alignByColumn;
          return !alignByColumn;
        });
        if (alignByColumn) {
          e.columns.forEach((el) => {
            if (el.fixed && el.fixedPosition !== "right") {
              colspan++;
            }
          });
        }
      }
    },
    onContentReady(e) {
      if (this.open == 1) {
        if (this.idDepartment) {
          if (this.idDepartment.id == 102299) {
            e.component.expandAll(0);
            this.open = 0;
          } else {
            e.component.expandAll(0);
            e.component.expandAll(1);
            this.open = 0;
          }
        }
      }
    },
    xuattieude() {
      if (this.idDepartment)
        this.tieude =
          "Báo Cáo sản lượng - " +
          this.ngaythang +
          " - " +
          this.idDepartment.label;
    },
    async loadListGroupDepartment() {
      const data = await this.getListGroupDepartment();
      this.listGroupDepartment = data;
    },
    async changeDate() {
      await this.loadData();
      await this.loadDepartment();
    },
    async loadDepartment() {
      let data = await this.getGroupDepartment();
      data = data.filter((d) => d.factoryId == this.idDepartment.id);
      this.allDepartment = false;
      this.chonCongDoans = [];
      this.departments = data;
      this.loadData();
    },

    async selectAll() {
      this.open = 1;
      if (this.allDepartmentCBG) {
        this.listGroupDepartment.forEach((el) => {
          this.chonCongDoansCBG.push(el.NAME);
        });
      } else this.chonCongDoansCBG = [];
      // if (this.allDepartmentYS1) {
      //   this.departments.forEach((el) => {
      //     if (this.idDepartment.id == 102340) this.chonCongDoansYS1.push(el.ID);
      //   });
      // } else this.chonCongDoansYS1 = [];
      // if (this.allDepartmentTB) {
      //   this.departments.forEach((el) => {
      //     if (this.idDepartment.id == 102366) this.chonCongDoansTB.push(el.ID);
      //   });
      // } else this.chonCongDoansTB = [];
      // if (this.allDepartmentQM) {
      //   this.departments.forEach((el) => {
      //     if (this.idDepartment.id == 102427) this.chonCongDoansQM.push(el.ID);
      //   });
      // } else this.chonCongDoansQM = [];
      // if (this.allDepartmentTH) {
      //   this.departments.forEach((el) => {
      //     if (this.idDepartment.id == 100000) this.chonCongDoansTH.push(el.ID);
      //   });
      // } else {
      //   this.chonCongDoansTH = [];
      // }
      this.loadData();
    },
    async loadData() {
      this.open = 1;

      this.arrDepartment = this.chonCongDoansCBG;
if (this.chonCongDoansCBG.length>=0) {
      if (this.typeBC == "tuan") {
        this.ngaythang = "tuần";
        this.loadDataWeek();
      }
        if (this.typeBC == "nam") {
        this.ngaythang = "tháng";
        this.loadDataYear();
      }
}
    },
    async loadDataYear() {
 this.dataSource = []
        this.dataSource = await this.getSLTheoNamSL_quidoi({
          year: this.year,
          departmentId: this.idDepartment.id,
          arrDepartment: this.arrDepartment,
        });
     this.dataSource = this.dataSource.filter((i) =>
          this.arrDepartment.includes(i.groupDepartment)
        );
      // if (this.idDepartment.id == 102299) {
      //   this.dataSource = this.dataSource.filter((i) =>
      //     this.arrDepartment.includes(i.groupDepartment)
      //   );
      // }
      // if (this.arrDepartment.length == 1 && this.idDepartment.id != 102299) {
      //   this.group = this.departments.find(
      //     (d) => d.ID == this.arrDepartment[0]
      //   );
      //   this.dataChart = await this.getChartSLTheoThangSS({
      //     year: this.year,
      //     departmentId: this.idDepartment.id,
      //     stepId: this.arrDepartment[0],
      //   });
      //   if (this.idDepartment.id != 102299) {
      //     this.loadCongSuat();
      //   }
      // } else {
      //   let dateNow = moment().add(1, "months");
      //   let dateNew = dateNow.format("YYYY-MM-01");
      //   let dateOld = dateNow.subtract(12, "months").format("YYYY-MM-DD");
      //   this.dataChart = await this.getChartSLTheoNam({
      //     dateNew: dateNew,
      //     dateOld: dateOld,
      //     departmentId: this.idDepartment.id,
      //     arrDepartment: this.arrDepartment,
      //   });
      // }
      // if (
      //   this.arrDepartment.length == 1 &&
      //   (this.arrDepartment[0] == 100013 ||
      //     this.arrDepartment[0] == 102342 ||
      //     this.arrDepartment[0] == 102529 ||
      //     this.arrDepartment[0] == 102368 ||
      //     this.arrDepartment[0] == "Sấy phôi")
      // ) {
      //   this.isSayPhoi = true;
      // } else {
      //   this.isSayPhoi = false;
      // }
    },
    async loadDataWeek() {
      let weekStart = 1;
      let weekStartend = 52;
      let strWeek = "";
      this.listWeek = [];
      if (this.month == 1) weekStart = 1;
      for (let i = weekStart; i <= weekStartend; i++) {
        strWeek += `[week${i}],`;
        this.listWeek.push(i);
      }
      strWeek = strWeek.substring(0, strWeek.length - 1);

      this.dataSource = []
        this.dataSource = await this.getSLTheoTuanM3_quidoi({
          year: this.year,
          strWeek: strWeek,
          arrDepartment: this.arrDepartment,
          departmentId: this.idDepartment.id,
        });

        this.dataSource = this.dataSource.filter((i) =>
          this.arrDepartment.includes(i.groupDepartment)
        );
      
      //   if (this.arrDepartment.length == 1 && this.idDepartment.id != 102299) {
      //     this.group = this.departments.find(
      //       (d) => d.ID == this.arrDepartment[0]
      //     );
      //     this.dataChart = await this.getChartSLTheoTuanSS({
      //       year: this.year,
      //       departmentId: this.idDepartment.id,
      //       stepId: this.arrDepartment[0],
      //     });
      //     if (this.idDepartment.id != 102299) {
      //       this.loadCongSuat();
      //     }
      //   } else {
      //     this.dataChart = await this.getChartSLTheoWeek({
      //       year: this.year,
      //       arrDepartment: this.arrDepartment,
      //       departmentId: this.idDepartment.id,
      //     });
      //   }
      //   if(this.arrDepartment.length == 1 && (this.arrDepartment[0] == 100013 || this.arrDepartment[0] == 102342 || this.arrDepartment[0] == 102529 || this.arrDepartment[0] == 102368 || this.arrDepartment[0] == "Sấy phôi")){
      //     this.isSayPhoi = true;
      //   }else{
      //     this.isSayPhoi = false;
      //   }
    },
    async loadCongSuat() {
      const payload = {
        departmentId: this.arrDepartment[0],
      };
      const data = await this.getCongSuatInDepartment(payload);
      console.log("data", data);
      if (this.typeBC == "nam") {
        this.congSuat = data[0].CONG_SUAT_TUAN * 4;
      } else {
        this.congSuat = data[0].CONG_SUAT_TUAN;
      }
      if (data[0].CONG_SUAT_TUAN == null) {
        this.congSuat = 0;
      }
      console.log("this.congSuat", this.congSuat);
    },
  },
};
</script>
<style>
#BCSanLuongTheoThang2 {
  height: 700px;
}
#BCSanLuongTheoThang3 {
  height: 700px;
}
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  font-weight: 500;
  background-color: white;
  width: 280;
}
.dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  border-bottom: 1px solid #ddd;
  font-size: 13px;
  font-weight: bold;
}
.dx-datagrid-summary-item {
  color: black;
  font-weight: 500;
}
.dx-datagrid .dx-row > td {
  font-size: 16px;
}
.title {
  font-size: 18px;
  color: #1976d2;
  font-weight: 500;
}
.dx-group-panel-item:nth-child(1) {
  visibility: hidden;
}
.dx-group-panel-item:nth-child(2) {
  visibility: hidden;
}
.dx-group-panel-item:nth-child(3) {
  margin-left: -130px;
  color: #ffc107;
  font-weight: bold;
  background-color: white;
}
.dx-scrollable-scroll {
  background-color: orange;
}
.dx-scrollable-scroll-content {
  background-color: orange;
}
</style>