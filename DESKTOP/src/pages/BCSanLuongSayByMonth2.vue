<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo sản lượng sấy -
          <span class="text-amber-14">{{
            idDepartment ? idDepartment.label : ""
          }}</span>
        </div>
        <div class="col-6 text-blue text-bold" align="right">
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
      <div class="col-6">
        <DxChart id="chart" :data-source="dataChart">
          <DxTitle text="Biểu đồ sản lượng sấy theo tháng">
            <DxFont weight="900" size="19" color="#1976d2" />
          </DxTitle>
          <DxCommonSeriesSettings
            argument-field="thang"
            type="bar"
            hover-mode="allArgumentPoints"
            selection-mode="allArgumentPoints"
          >
            <DxLabel :visible="false">
              <DxFormat :precision="0" type="fixedPoint" />
            </DxLabel>
          </DxCommonSeriesSettings>
          <DxValueAxis :tick-interval="200" name="frequency" position="left">
            <DxTitle text="M³" />
          </DxValueAxis>
          <DxSeries value-field="yearOld" :name="year - 1" color="#c5e1a5" />
          <DxSeries value-field="yearNew" :name="year" color="#21ba45" />

          <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
          <DxExport :enabled="true" />
        </DxChart>
      </div>
      <div class="col-6">
        <DxChart id="chart" :data-source="dataChartsaylai">
          <DxTitle text="Biểu đồ sấy lại theo tháng">
            <DxFont weight="900" size="19" color="#FFC107" />
          </DxTitle>
          <DxCommonSeriesSettings
            argument-field="thang"
            type="bar"
            hover-mode="allArgumentPoints"
            selection-mode="allArgumentPoints"
          >
            <DxLabel :visible="false">
              <DxFormat :precision="0" type="fixedPoint" />
            </DxLabel>
          </DxCommonSeriesSettings>
          <DxValueAxis :tick-interval="100" name="frequency" position="left">
            <DxTitle text="M³" />
          </DxValueAxis>
          <DxSeries value-field="yearOldsl" :name="year - 1" color="#FFE082" />
          <DxSeries value-field="yearNewsl" :name="year" color="#FFC107" />

          <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
          <DxExport :enabled="true" />
        </DxChart>
      </div>
      <div class="col-12" style="margin-top: 20px" align="center">
        <span class="title"> <u>Thông tin sản lượng chi tiết</u></span>
      </div>
      <div class="col-12">
        <DxDataGrid
          id="BCSanLuongSayByMonth2"
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
        <DxGroupPanel
            :visible="true"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />

          <DxScrolling mode="virtual" />
          <DxSorting mode="none" />
          <DxHeaderFilter :visible="true" />
          <DxSorting mode="single" />
          <DxGrouping :auto-expand-all="false" />
          <DxColumn
            data-field="groupName"
            caption=""
            :group-index="0"
            group-cell-template="groupCellTemplate"
            :sort-index="0"
            sort-order="asc"
          />
          <template #groupCellTemplate="{ data }">
            <div style="font-weight: bold">{{ data.value.substring(2) }}</div>
          </template>
          <DxColumn
            data-field="departmentName2"
            caption=""
            :group-index="1"
            group-cell-template="groupCellTemplate2"
          />
          <template #groupCellTemplate2="{ data }">
            <div>{{ data.value }}</div>
          </template>
          <DxColumn
            data-field="sanPham"
            caption="Chọn sản phẩm"
            :group-index="2"
          />
          <DxColumn
            data-field="itemName"
            caption="Tên"
            width="350"
            :fixed="true"
          />
          <DxColumn
            caption="Dầy"
            data-field="HEIGHT"
            format="fixedPoint"
            alignment="center"
            width="90"
            :fixed="true"
          />
          <DxColumn
            caption="Rộng"
            data-field="WIDTH"
            format="fixedPoint"
            alignment="center"
            width="90"
            :fixed="true"
          />
          <DxColumn
            caption="Dài"
            data-field="LENGTH"
            format="fixedPoint"
            alignment="center"
            width="90"
            :fixed="true"
          />
          <DxColumn
            caption="Tổng"
            data-field="total"
            width="120"
            :calculate-cell-value="calculateTong"
            format="#,##0.##"
            :fixed="true"
          />
          <DxColumn
            v-for="(value, index) in thangs"
            :key="'y' + index + 20"
            :caption="'Tháng ' + value.id"
            :data-field="'thang' + value.id"
            width="120"
            alignment="center"
            format="#,##0.##"
          />

          <DxSummary>
            <DxGroupItem
              v-for="(value, index) in thangs"
              :key="'y' + index + 40"
              :column="'thang' + value.id"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.##'"
            />
            <DxGroupItem
              column="total"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.##'"
            />
          </DxSummary>
          <DxExport
            :enabled="isExcel"
            :allow-export-selected-data="false"
            :file-name="tieude"
          />
        </DxDataGrid>
      </div>
    </div>
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
    DxTooltip,
  },
  data() {
    return {
      dataSource: [],
      dataChart: [],
      dataChartsaylai: [],
      showVolumnColumn: true,
      year: moment().year(),
      dulieu: [],
      type: "sl",
      ngaythang: null,
      typeBC: "nam",
      table: "",
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
      chonFactoryId: null,
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
    };
  },
  created() {},
  methods: {
    ...mapActions("prod", [
      "getSLSayTheoThang",
      "getChartSLSayTheoThang",
      "getChartSLSayTheoThangsaylai",
    ]),
    onCellPrepared(e) {
      if (e.rowType === "group") {
        if (e.row.groupIndex == 0) {
          if (e.row.data.key === "1 SẤY PHÔI")
            e.cellElement.style.backgroundColor = "#64b5f6";
          else e.cellElement.style.backgroundColor = "#FFC107";
        }
        if (e.row.groupIndex == 1) {
          console.log("e.row", e.row);
          if (e.row.key[0] === "1 SẤY PHÔI")
            e.cellElement.style.backgroundColor = "#bbdefb";
          else e.cellElement.style.backgroundColor = "#FFE082";
        }
      }
    },
    calculateTong(rowData) {
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
    onRowPrepared(e) {
      var alignByColumn,
        groupSummary,
        colspan = 0;

      if (e.rowType === "group") {
        groupSummary = e.component.option("summary.groupItems");

        groupSummary &&
          $.each(groupSummary, function (_, summaryCell) {
            alignByColumn = summaryCell.alignByColumn;
            return !alignByColumn;
          });

        if (alignByColumn) {
          $.each(e.columns, function (_, column) {
            if (column.fixed && column.fixedPosition !== "right") {
              colspan++;
            }
          });

          if (
            e.rowElement.find(".dx-group-cell").css("visibility") === "hidden"
          ) {
            e.rowElement
              .find(".dx-group-cell")
              .css("visibility", "")
              .attr("colspan", colspan);
          } else {
            e.rowElement.find(".dx-group-cell").text("");
          }
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
    async changeDate() {
      await this.loadData();
    },
    async loadData() {
      this.open = 1;
      this.dataChart = await this.getChartSLSayTheoThang({
        year: this.year,
        departmentId: this.idDepartment.id,
      });
      this.dataChartsaylai = await this.getChartSLSayTheoThangsaylai({
        year: this.year,
        departmentId: this.idDepartment.id,
      });
      this.dataSource = await this.getSLSayTheoThang({
        year: this.year,
        departmentId: this.idDepartment.id,
      });
      console.log("dataSource", this.dataSource);
    },
  },
};
</script>
<style>
#BCSanLuongSayByMonth2 {
  height: 320px;
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
    margin-left:-130px;
    color: #ffc107;
    font-weight: bold;
    background-color: white;
}
</style>