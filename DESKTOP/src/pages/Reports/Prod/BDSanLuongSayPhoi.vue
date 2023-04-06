<template>
  <q-page>
    <q-card class="my-card">
      <q-card-section class="bg-blue-grey-1" style="padding: 3px">
        <div class="row">
          <div style="clear: both">
            <div
              style="float: left; margin-right: 10px; padding-top:3px"
              class="top-title text-teal"
            >
              Biểu đồ tổng sản lượng sấy phôi khối CBG năm -
            </div>
            <input class="cssYear" @input="load" type="number" v-model="year" />
          </div>
        </div>

        <div class="row">
          <div class="col-4 q-pl-sm q-pt-sm" align="center">
            <span class="text-primary text-bold"
              >SO SÁNH KL SẤY {{ year }} & {{ year - 1 }}</span
            >
            <DxDataGrid
              :data-source="dataSource"
              :show-row-lines="true"
              :show-borders="true"
              id="gridContainer"
            >
              <DxColumn
                :allow-sorting="false"
                css-class="rowBDSLSP"
                data-field="NAME"
                width="200"
                caption="Nhà Máy"
              />
              <DxColumn
                :allow-sorting="false"
                data-field="volumnBefore"
                width="100"
                format="#,##0.00##"
                :caption="'' + year - 1"
              />
              <DxColumn
                :allow-sorting="false"
                data-field="volumnNow"
                width="100"
                format="#,##0.00##"
                :caption="'' + year"
              />
              <DxColumn
                :allow-sorting="false"
                data-field="soSanh"
                width="100"
                :calculate-cell-value="calculateSoSanh"
                format="percent"
                caption="So Sánh"
              />
              <DxSummary>
                <DxTotalItem
                  column="NAME"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'Tổng:'"
                  :value-format="'decimal'"
                />
                <DxTotalItem
                  column="volumnBefore"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.####'"
                />
                <DxTotalItem
                  column="volumnNow"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.####'"
                />
              </DxSummary>
            </DxDataGrid>
          </div>
          <div class="col-4 q-pl-sm q-pt-sm" align="center">
            <span class="text-primary text-bold"
              >KL SẤY CÁC NHÀ MÁY (m3) - {{ year }}</span
            >
            <DxDataGrid
              :data-source="dataSource2"
              :show-row-lines="true"
              :show-borders="true"
              id="gridContainer"
            >
              <DxColumn
                :allow-sorting="false"
                css-class="rowBDSLSP"
                data-field="NAME"
                width="200"
                caption="Nhà Máy"
              />
              <DxColumn
                :allow-sorting="false"
                width="100"
                data-field="volumnSayChinh"
                format="#,##0.00##"
                caption="Sấy chính"
              />
              <DxColumn
                :allow-sorting="false"
                data-field="volumnSayLai"
                width="100"
                format="#,##0.00##"
                caption="Sấy lại"
              />
              <DxColumn
                :allow-sorting="false"
                data-field="TOTAL"
                width="100"
                format="#,##0.00##"
                caption="Tổng cộng"
              />
              <DxColumn
                :allow-sorting="false"
                data-field="tyLeSayLai"
                width="100"
                :calculate-cell-value="calculateTyLeSayLai"
                format="percent"
                caption="Tỷ lệ sấy lại"
              />
              <DxSummary>
                <DxTotalItem
                  column="NAME"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'Tổng:'"
                  :value-format="'decimal'"
                />
                <DxTotalItem
                  column="volumnSayChinh"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.####'"
                />
                <DxTotalItem
                  column="volumnSayLai"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.####'"
                />
                <DxTotalItem
                  column="TOTAL"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.####'"
                />
              </DxSummary>
            </DxDataGrid>
          </div>
          <div class="col-4 q-pl-sm q-pt-sm">
            <DxPieChart
              id="pie"
              :data-source="dataSource2"
              :palette="['#9575cd', '#31ccec', '#009688']"
            >
              <DxTitle :text="'Tỷ lệ sấy các nm năm ' + year + ' (%)'">
                <DxFont weight="900" color="#1976d2" />
              </DxTitle>
              <DxSeries argument-field="NAME" value-field="TOTAL">
                <DxLabel
                  :visible="true"
                  :customize-text="formatLabel"
                  format="fixedPoint"
                >
                  <DxConnector :visible="true" :width="0.5" />
                </DxLabel>
              </DxSeries>
              <DxSize :width="500" />
              <DxLegend
                horizontal-alignment="center"
                vertical-alignment="bottom"
              />
              <DxExport :enabled="true" />
            </DxPieChart>
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pl-sm q-pt-sm">
            <DxChart id="chart" :data-source="dataSourceTH">
              <DxTitle :text="'Sản lượng sấy NM Thuận Hưng - ' + year">
                <DxFont weight="900" size="15" color="#1976d2" />
              </DxTitle>
              <DxCommonSeriesSettings
                argument-field="thang"
                type="stackedbar"
              />
              <DxValueAxis
                :visual-range="[0, 5000]"
                :tick-interval="500"
                position="right"
              >
                <DxTitle text="M³" />
              </DxValueAxis>
              <DxSeries value-field="INDOOR" name="INDOOR" color="#4caf50" />
              <DxSeries value-field="OUTDOOR" name="OUTDOOR" color="#ffc107" />
              <DxSeries
                value-field="SẤY LẠI INDOOR"
                name="SẤY LẠI INDOOR"
                color="#ff9800"
              />
              <DxSeries
                value-field="SẤY LẠI OUTDOOR"
                name="SẤY LẠI OUTDOOR"
                color="#ff9800"
              />
              <DxSeries value-field="SẤY UỐN" name="SẤY UỐN" color="#2196f3" />
              <DxLegend
                vertical-alignment="bottom"
                horizontal-alignment="center"
                item-text-position="top"
              />
              <DxExport :enabled="true" />
              <DxTooltip
                :enabled="true"
                :customize-tooltip="customizeTooltip"
                location="edge"
              />
            </DxChart>
          </div>
          <div class="col-4 q-pl-sm q-pt-sm">
            <DxChart id="chart" :data-source="dataSourceYS1A">
              <DxTitle :text="'Sản lượng sấy NM Yên Sơn 1A - ' + year">
                <DxFont weight="900" size="15" color="#1976d2" />
              </DxTitle>
              <DxCommonSeriesSettings
                argument-field="thang"
                type="stackedbar"
              />
              <DxValueAxis
                :visual-range="[0, 5000]"
                :tick-interval="500"
                position="right"
              >
                <DxTitle text="M³" />
              </DxValueAxis>
              <DxSeries value-field="INDOOR" name="INDOOR" color="#4caf50" />
              <DxSeries value-field="OUTDOOR" name="OUTDOOR" color="#ffc107" />
              <DxSeries
                value-field="SẤY LẠI INDOOR"
                name="SẤY LẠI INDOOR"
                color="#ff9800"
              />
              <DxSeries
                value-field="SẤY LẠI OUTDOOR"
                name="SẤY LẠI OUTDOOR"
                color="#ff9800"
              />
              <DxSeries value-field="SẤY UỐN" name="SẤY UỐN" color="#2196f3" />
              <DxLegend
                vertical-alignment="bottom"
                horizontal-alignment="center"
                item-text-position="top"
              />
              <DxExport :enabled="true" />
              <DxTooltip
                :enabled="true"
                :customize-tooltip="customizeTooltip"
                location="edge"
              />
            </DxChart>
          </div>
          <div class="col-4 q-pl-sm q-pt-sm">
            <DxChart id="chart" :data-source="dataSourceTB">
              <DxTitle :text="'Sản lượng sấy NM Thái Bình - ' + year">
                <DxFont weight="900" size="15" color="#1976d2" />
              </DxTitle>
              <DxCommonSeriesSettings
                argument-field="thang"
                type="stackedbar"
              />
              <DxValueAxis
                :visual-range="[0, 5000]"
                :tick-interval="500"
                position="right"
              >
                <DxTitle text="M³" />
              </DxValueAxis>
              <DxSeries value-field="INDOOR" name="INDOOR" color="#4caf50" />
              <DxSeries value-field="OUTDOOR" name="OUTDOOR" color="#ffc107" />
              <DxSeries
                value-field="SẤY LẠI INDOOR"
                name="SẤY LẠI INDOOR"
                color="#ff9800"
              />
              <DxSeries
                value-field="SẤY LẠI OUTDOOR"
                name="SẤY LẠI OUTDOOR"
                color="#ff9800"
              />
              <DxSeries value-field="SẤY UỐN" name="SẤY UỐN" color="#2196f3" />
              <DxLegend
                vertical-alignment="bottom"
                horizontal-alignment="center"
                item-text-position="top"
              />
              <DxExport :enabled="true" />
              <DxTooltip
                :enabled="true"
                :customize-tooltip="customizeTooltip"
                location="edge"
              />
            </DxChart>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxSummary,
  DxTotalItem,
  DxScrolling,
} from "devextreme-vue/data-grid";
import DxPieChart, {
  DxSize,
  DxSeries,
  DxLabel,
  DxConnector,
  DxLegend,
  DxExport,
} from "devextreme-vue/pie-chart";
import {
  DxChart,
  DxCommonSeriesSettings,
  DxValueAxis,
  DxTitle,
  DxFont,
  DxTooltip,
} from "devextreme-vue/chart";
import moment from "moment";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSummary,
    DxTotalItem,
    DxScrolling,
    DxChart,
    DxPieChart,
    DxTooltip,
    DxCommonSeriesSettings,
    DxValueAxis,
    DxTitle,
    DxSize,
    DxFont,
    DxSeries,
    DxLabel,
    DxConnector,
    DxLegend,
    DxExport,
  },
  data() {
    return {
      year: moment().year(),
      dataSource: [],
      dataSource2: [],
      dataSourceTH: [],
      dataSourceYS1A: [],
      dataSourceTB: [],
    };
  },
  created() {
    this.load();
  },
  methods: {
    formatLabel(pointInfo) {
      return `${pointInfo.argumentText} (${pointInfo.percentText})`;
    },
    customizeTooltip(pointInfo) {
      return {
        text: `${pointInfo.seriesName}: ${pointInfo.valueText}`,
      };
    },
    calculateSoSanh(rowData) {
      if (rowData.volumnBefore == null) {
        rowData.soSanh = 0;
      } else {
        rowData.soSanh = rowData.volumnNow / rowData.volumnBefore;
      }
      return rowData.soSanh;
    },
    calculateTyLeSayLai(rowData) {
      rowData.soSanh = rowData.volumnSayLai / rowData.volumnSayChinh;
      return rowData.soSanh;
    },
    async load() {
      Promise.all([
        this.loadSoSanhKhoiLuongSay(), 
        this.loadKhoiLuongSayTheoLoai(), 
        this.loadKhoiLuongSayTheoNhaMayThuanHung(), 
        this.loadKhoiLuongSayTheoNhaMayYenSon1A(), 
        this.loadKhoiLuongSayTheoNhaMayThaiBinh()]);
    },
    async loadSoSanhKhoiLuongSay() {
      const payload = {
        year: this.year,
      };
      const data = await this.$store.dispatch(
        "prod/GET_REPORT_SO_SANH_KHOI_LUONG_SAY_PHOI",
        payload
      );
      this.dataSource = data.data;
    },
    async loadKhoiLuongSayTheoLoai() {
      const payload = {
        year: this.year,
      };
      const data = await this.$store.dispatch(
        "prod/GET_REPORT_KHOI_LUONG_SAY_PHOI_THEO_LOAI",
        payload
      );
      this.dataSource2 = data.data;
    },
    async loadKhoiLuongSayTheoNhaMayThuanHung() {
      const payload = {
        year: this.year,
        factoryId: 100000,
      };
      const data = await this.$store.dispatch(
        "prod/GET_REPORT_KHOI_LUONG_SAY_PHOI_THEO_NHA_MAY",
        payload
      );
      this.dataSourceTH = data.data;
      console.log("this.dataSourceTH", this.dataSourceTH);
    },
    async loadKhoiLuongSayTheoNhaMayYenSon1A() {
      const payload = {
        year: this.year,
        factoryId: 100003,
      };
      const data = await this.$store.dispatch(
        "prod/GET_REPORT_KHOI_LUONG_SAY_PHOI_THEO_NHA_MAY",
        payload
      );
      this.dataSourceYS1A = data.data;
      console.log("this.dataSourceYS1A", this.dataSourceYS1A);
    },
    async loadKhoiLuongSayTheoNhaMayThaiBinh() {
      const payload = {
        year: this.year,
        factoryId: 100005,
      };
      const data = await this.$store.dispatch(
        "prod/GET_REPORT_KHOI_LUONG_SAY_PHOI_THEO_NHA_MAY",
        payload
      );
      this.dataSourceTB = data.data;
      console.log("this.dataSourceTB", this.dataSourceTB);
    },
  },
};
</script>

<style>
#chart {
  height: 600px;
}
#pie {
  height: 200px;
}
.cssYear {
  width: 100px;
  float: left;
  font-size: 27px;
  font-weight: bold;
  background-color: #eceff1;
  color: teal;
  border: none;
}
.dx-datagrid-table .dx-row .rowBDSLSP {
  font-weight: bold;
}
</style>