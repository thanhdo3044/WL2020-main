<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-5 text-blue text-bold" style="font-size: 18px">
          Báo cáo sản lượng quy đổi công đoạn đóng gói khối CBG
        </div>
        <div class="col-5"></div>
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
      <div class="row">
        <div class="col-12">
          <DxChart
            id="chart"
            :data-source="bieuDoKhoi"
            title="SLQĐ khối CBG (tỷ đồng)"
          >
            <DxCommonSeriesSettings argument-field="week" type="stackedbar" />
            <DxValueAxis position="right">
              <DxTitle text="Tỷ đồng" />
            </DxValueAxis>
            <DxSeries value-field="100000" name="Thuận Hưng" color="#1976d2" />
            <DxSeries value-field="100004" name="Yên Sơn 1" color="#21ba45" />
            <DxSeries value-field="100005" name="Thái Bình" color="#ffc107" />
            <DxLegend
              vertical-alignment="bottom"
              horizontal-alignment="center"
              item-text-position="top"
            />
            <DxTooltip :enabled="true" :customize-tooltip="customizeTooltip" />
            <DxExport :enabled="true" />
          </DxChart>
        </div>
        <div class="col-12">
          <DxDataGrid
            id="BCSanLuongQuyDoi"
            :data-source="dataSource"
            :hover-state-enabled="true"
        :row-alternation-enabled="true"
            :show-borders="true"
            @cell-prepared="onCellPrepared"
          >
            <DxColumn data-field="totalN" group-index="0" caption="Tổng" />
            <DxColumn data-field="factory" caption="Nhà máy" width="100" :fixed="true" />
            <DxColumn
          caption="Tổng"
          data-field="total"
          css-class="totalColor"
          width="80"
          alignment="right"
          format="#,##0"
          :fixed="true"
          :calculate-cell-value="calculateTong"
        />
            <DxColumn
              v-for="(value, index) in listWeek"
              :key="index"
              :data-field="'week' + value"
              :caption="'Tuần ' + value"
              width="80"
              format="#,##0.##"
            />
            
            <DxSummary>
              <DxGroupItem
                v-for="(value, index) in listWeek"
                :key="index"
                :column="'week' + value"
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
          </DxDataGrid>
        </div>
        <div class="col-12">
          <DxChart
            id="chart"
            :data-source="bieuDoKhoi"
            title="Biểu đồ đóng góp SLQĐ từng nhà máy (tỷ đồng)"
          >
            <DxCommonSeriesSettings
              argument-field="week"
              type="bar"
              hover-mode="allArgumentPoints"
              selection-mode="allArgumentPoints"
            >
              <!-- <DxLabel :visible="true">
        <DxFormat
          :precision="0"
          type="fixedPoint"
        />
      </DxLabel> -->
            </DxCommonSeriesSettings>
            <DxSeries value-field="100000" name="Thuận Hưng" color="#1976d2" />
            <DxSeries value-field="100004" name="Yên Sơn 1" color="#21ba45" />
            <DxSeries value-field="100005" name="Thái Bình" color="#ffc107" />
            <DxTooltip :enabled="true" :customize-tooltip="customizeTooltip" />
            <DxLegend
              vertical-alignment="bottom"
              horizontal-alignment="center"
            />
            <DxExport :enabled="true" />
          </DxChart>
        </div>
        <!-- <div class="col-6">
          <DxChart
            id="chart"
            :data-source="bieuDoKhoi"
            title="Nhà máy Thuận Hưng"
          >
            <DxCommonSeriesSettings argument-field="week" type="stackedbar" />
            <DxValueAxis position="right">
              <DxTitle text="Tỷ đồng" />
            </DxValueAxis>
            <DxSeries value-field="100000" name="Thuận Hưng" color="#1976d2" />
            <DxLegend
              vertical-alignment="bottom"
              horizontal-alignment="center"
              item-text-position="top"
            />
            <DxExport :enabled="true" />
          </DxChart>
        </div>
        <div class="col-6">
          <DxChart
            id="chart"
            :data-source="bieuDoKhoi"
            title="Nhà máy Yên Sơn 1"
          >
            <DxCommonSeriesSettings argument-field="week" type="stackedbar" />
            <DxValueAxis position="right">
              <DxTitle text="Tỷ đồng" />
            </DxValueAxis>
            <DxSeries value-field="100004" name="Yên Sơn 1" color="#21ba45" />
            <DxLegend
              vertical-alignment="bottom"
              horizontal-alignment="center"
              item-text-position="top"
            />
            <DxExport :enabled="true" />
          </DxChart>
        </div>
        <div class="col-6">
          <DxChart
            id="chart"
            :data-source="bieuDoKhoi"
            title="Nhà máy Thái Bình"
          >
            <DxCommonSeriesSettings argument-field="week" type="stackedbar" />
            <DxValueAxis position="right">
              <DxTitle text="Tỷ đồng" />
            </DxValueAxis>
            <DxSeries value-field="100005" name="Thái Bình" color="#ffc107" />
            <DxLegend
              vertical-alignment="bottom"
              horizontal-alignment="center"
              item-text-position="top"
            />
            <DxExport :enabled="true" />
          </DxChart>
        </div> -->
      </div>
    </q-card>
  </q-page>
</template>

<script>
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxLabel,
  DxFormat,
  DxValueAxis,
  DxTitle,
  DxLegend,
  DxExport,
  DxTooltip,
  DxZoomAndPan,
} from "devextreme-vue/chart";
import {
  DxDataGrid,
  DxColumn,
  DxSummary,
  DxGroupItem,
} from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
export default {
  components: {
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxValueAxis,
    DxTitle,
    DxLegend,
    DxExport,
    DxTooltip,
    DxZoomAndPan,
    DxDataGrid,
    DxColumn,
    DxLabel,
    DxFormat,
    DxSummary,
    DxGroupItem,
  },
  data() {
    return {
      year: moment().year(),
      listWeek: [],
      bieuDoKhoi: [],
      dataSource: [],
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    ...mapActions("prod", [
      "getSLQuyDoiTungNhaMay",
      "getBieuDoSLQuyDoiTungNhaMay",
    ]),
    changeDate() {
      this.loadData();
    },
    onCellPrepared(e) {
      if (e.rowType === "group") {
        if (e.row.groupIndex == 0) {
          e.cellElement.style.backgroundColor = "#bbdefb";
        }
      }
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
    customizeTooltip({ valueText }) {
      return {
        text: `${parseFloat(valueText).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      };
    },
    async loadData() {
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
      this.dataSource = await this.getSLQuyDoiTungNhaMay({
        year: this.year,
        strWeek: strWeek,
      });
      this.bieuDoKhoi = await this.getBieuDoSLQuyDoiTungNhaMay({
        year: this.year,
        strWeek: strWeek,
      });
    },
  },
};
</script>

<style>
#BCSanLuongQuyDoi {
  height: 180px;
}
.dx-scrollable-scroll {
  background-color: orange;
}
.dx-scrollable-scroll-content {
  background-color: orange;
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
  font-weight: 900;
}
.dx-datagrid-table .dx-row > td{
  color: black;
}
.totalColor{
  font-weight: bold;
}
</style>