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
              Biểu đồ tổng sản lượng năm khối CBG -
            </div>
            <input class="cssYear" @input="onView" type="number" v-model="year" />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-6" align="center">
            <div style="width: 80%">
              <DxChart
                v-if="bieudo"
                @series-click="onSeriesClick"
                id="chart1"
                :data-source="dateYearBefore"
              >
                <DxTitle
                  :text="'Tổng sản lượng khối CBG ' + (year - 1) + ' (m3)'"
                >
                  <DxFont weight="900" color="#1976d2" />
                </DxTitle>
                <DxCommonSeriesSettings argument-field="NAME" type="stackedbar">
                </DxCommonSeriesSettings>
                <DxSeries value-field="TH" name="Thuận Hưng" color="#31ccec" />
                <DxSeries value-field="YS1A" name="Yên Sơn 1A" color="#009688" />
                <DxSeries
                  value-field="YS1B"
                  name="Yên Sơn 1B"
                  color="#8bc34a"
                />
                <DxSeries value-field="TB" name="Thái Bình" color="#9575cd" />
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
          <div class="col-6">
            <div style="width: 80%; height:300px" align="center">
              <DxChart
                v-if="bieudo"
                @series-click="onSeriesClick"
                id="chart2"
                :data-source="dataYearNow"
              >
                <DxTitle :text="'Tổng sản lượng khối CBG ' + year + ' (m3)'">
                  <DxFont weight="900" color="#1976d2" />
                </DxTitle>
                <DxCommonSeriesSettings argument-field="NAME" type="stackedbar">
                </DxCommonSeriesSettings>
                <DxSeries value-field="TH" name="Thuận Hưng" color="#31ccec" />
                <DxSeries value-field="YS1A" name="Yên Sơn 1A" color="#009688" />
                <DxSeries
                  value-field="YS1B"
                  name="Yên Sơn 1B"
                  color="#8bc34a"
                />
                <DxSeries value-field="TB" name="Thái Bình" color="#9575cd" />
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
          
          
        </div>
        <div class="row" style="margin-top:50px">
          <div style="padding-top:10px" class="col-6">
            <DxChart id="chart" :data-source="dataSource1" :rotated="true">
              <DxTitle :text="'KL hoàn thành các công đoạn ' + year + ' (m3)'">
                <DxFont weight="900" color="#1976d2" />
              </DxTitle>
              <DxSeries
                argument-field="NAME"
                value-field="m3"
                type="bar"
                color="#f6b024"
              >
              </DxSeries>
              <DxLegend :visible="false" />
            </DxChart>
          </div>
          <div class="col-6" align="center">
            <div class="title">Chênh lệnh khối lượng các công đoạn so với đóng gói</div>
            <DxDataGrid
              :data-source="dataSource"
              :show-row-lines="true"
              :show-borders="true"
              id="gridContainer"
            >
              <DxColumn
                css-class="mau"
                data-field="NAME"
                width="320"
                caption="Danh sách các công đoạn"
              />
              <DxColumn
                css-class="mau"
                width="120"
                data-field="m3"
                format="#,##0.00##"
                caption="Khối lượng"
              />
              <DxColumn
                caption="Chênh lệnh KL so với ĐG"
                css-class="mau"
                alignment="center"
              >
                <DxColumn
                  width="120"
                  data-field="m3SoDG"
                  css-class="mau"
                  format="#,##0.00##"
                  :calculate-cell-value="calculateM3SoDG"
                  caption="m3"
                />

                <DxColumn
                  width="120"
                  data-field="percentSoDG"
                  css-class="mau"
                  :calculate-cell-value="calculatePercentSoDG"
                  format="#0.##%"
                  caption="%"
                />
              </DxColumn>
              <DxScrolling mode="infinite" />
            </DxDataGrid>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {
  DxValueAxis,
  DxTick,
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxLabel,
  DxArgumentAxis,
  DxGrid,
  DxMargin,
  DxTooltip,
  DxFormat,
  DxLegend,
  DxExport,
  DxTitle,
  DxFont,
} from "devextreme-vue/chart";
import {
  DxDataGrid,
  DxColumn,
  DxSummary,
  DxGroupItem,
  DxScrolling,
} from "devextreme-vue/data-grid";
import moment from "moment";
export default {
  name: "bao-cao-san-luong-may",
  components: {
    DxDataGrid,
    DxColumn,
    DxSummary,
    DxGroupItem,
    DxValueAxis,
    DxTick,
    DxScrolling,
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxLabel,
    DxArgumentAxis,
    DxGrid,
    DxMargin,
    DxTooltip,
    DxFormat,
    DxLegend,
    DxExport,
    DxTitle,
    DxFont,
  },
  data() {
    return {
      dataSource: [],
      dataSource1: [],
      dataYearNow: [],
      dateYearBefore: [],
      showChooseDate: false,
      dataDepartment: [],
      dongGoi: 0,
      bieudo: "cot",
      year: moment().year(),
    };
  },
  created() {
    this.onView();
  },
  methods: {
    changeChart(value) {
      if (this.value === "cot") {
        this.bieudo = "cot";
      } else {
        this.bieudo = "duong";
      }
    },
    calculateM3SoDG(rowData) {
      rowData.m3SoDG = rowData.m3 - this.dongGoi;
      return rowData.m3SoDG;
    },
    calculatePercentSoDG(rowData) {
      rowData.percentSoDG = (rowData.m3 - this.dongGoi) / this.dongGoi;
      return rowData.percentSoDG;
    },
    async onView() {
      const payload = {
        year: this.year,
      };
      const data = await this.$store.dispatch(
        "prod/GET_REPORT_CHART_SAN_LUONG_WEEK_CONG_DOAN",
        payload
      );
      const payload2 = {
        year: this.year - 1,
      };
      const data2 = await this.$store.dispatch(
        "prod/GET_REPORT_CHART_SAN_LUONG_WEEK_CONG_DOAN",
        payload2
      );
      const data3 = await this.$store.dispatch(
        "prod/GET_REPORT_CHART_SAN_LUONG_WITH_CONG_DOAN",
        payload
      );
      const data4 = await this.$store.dispatch(
        "prod/GET_REPORT_CHART_SAN_LUONG_WITH_CONG_DOAN2",
        payload
      );
      this.dataYearNow = data.data;
      this.dateYearBefore = data2.data;
      this.dataSource = data3.data;
      this.dataSource1 = data4.data;
      console.log("dataSource", this.dataSource);
      let dg = this.dataSource.find((d) => d.NAME == "7. Đóng gói");
      this.dongGoi = dg.m3;
      console.log("dg", this.dongGoi);
    },
    customizeLabelText({ valueText }) {
      return `${valueText}`;
    },
    async onSeriesClick({ target: series }) {
      console.log("series", series);
      let factoryId = 0;
      if (series.name == "Thuận Hưng") {
        factoryId = 100000;
      }
      if (series.name == "Yên Sơn 1A") {
        factoryId = 102339;
      }
      if (series.name == "Yên Sơn 1B") {
        factoryId = 102340;
      }
      if (series.name == "Thái Bình") {
        factoryId = 102366;
      }
      const payload = {
        factoryId: factoryId,
        year: this.year,
      };
      const data = await this.$store.dispatch(
        "prod/GET_SAN_LUONG_IN_FACTORY",
        payload
      );
      this.dataDepartment = data.data;
      console.log("data", data);
    },
    customizeTooltip(pointInfo) {
      return {
        text: `${pointInfo.seriesName}: ${Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 4,
        }).format(pointInfo.valueText)}`,
      };
    },
  },
};
</script>

<style>
#chart1{
  height: 350px;
}
#chart2{
  height: 350px;
}
.dx-row .mau {
  border: 1px solid black !important;
}
g .dxc-item {
  color: red;
  font-weight: bold !important;
}
g .dxc-arg-elements text {
  font-weight: bold !important;
}
.title-factory {
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  color: #009688;
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
.title{
  font-size: 25px;
  padding: 10px;
  font-weight: bold;
  font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif;
  color: #1976d2;
}
</style>