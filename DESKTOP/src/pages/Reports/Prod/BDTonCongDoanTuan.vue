<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-blue-grey-1" style="padding: 3px">
        <div class="row">
          <div class="col-6 top-title text-teal">
            Biểu đồ tồn từng công đoạn theo nhà máy -
            <span style="font-weight: bold"> {{ factory.label }}</span>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-md row">
          <q-select
            class="col-1.5"
            color="grey-3"
            label-color="orange"
            filled
            v-model="factory"
            :options="options"
            label="Chọn Nhà Máy"
            @input="onChange"
            dense
          />
          <q-input
            label-color="orange"
            dense
            label="Chọn thời gian"
            fill-mask
            mask="####-##-##"
            class="q-mb-sm"
            filled
            v-model="toDate"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date mask="YYYY-MM-DD" v-model="toDate">
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Close"
                        color="primary"
                        @click="load"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="row">
          <div class="col-9">
            <DxChart
              id="chart"
              :data-source="dataSource"
              @series-click="onSeriesClick"
            >
              <DxCommonSeriesSettings argument-field="thoiDiem" type="bar">
                <!-- <DxLabel :visible="true">
                  <DxFormat :precision="0" type="fixedPoint" />
                </DxLabel> -->
              </DxCommonSeriesSettings>

              <DxValueAxis position="left">
                <DxTitle text="m3" />
              </DxValueAxis>
              <DxSeries
                v-for="(value, index) in departments"
                :key="index"
                :value-field="value.NAME"
                :name="value.NAME"
              />
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
          <div class="col-3 q-pa-md">
            
            <div class="row" align="right">
              <div class="col-12">
                <div class="row">
                  <div class="col-6"  align="left"><div style="padding-top:7px; font-weight:bold">{{congdoan ? congdoan : ''}}</div></div>
                  <div class="col-6">
                    <div style="color: red; font-weight: bold" class="col-12">
                Tổng tồn (M<span style="font-size: 20px">&sup3;</span>) :
                {{
                  Intl.NumberFormat("en", {
                    maximumFractionDigits: 4,
                    minimumFractionDigits: 0,
                  }).format(total)
                }}
              </div>
                  </div>
                </div>
              </div>
              
            </div>
            <DxDataGrid
              :data-source="listItem"
              :show-row-lines="true"
              :show-borders="true"
              
              id="gridContainer"
            >
              <!-- <DxColumn data-field="paren" :group-index="0" caption="Sản phẩm" /> -->
              <DxColumn data-field="sanpham" caption="Tên" />
              <DxColumn
                width="120"
                data-field="m3"
                cell-template="cellTemplateKL"
                format="#,##0.00##"
                caption="Khối lượng"
              />
              <template #cellTemplateKL="{ data }">
                <span v-if="data.value < 0" class="text-red">{{
                  data.value.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 4,
                    })
                }}</span>
                <span v-else>{{ data.value.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 4,
                    }) }}</span>
              </template>
              <DxScrolling mode="infinite" />
              <!-- <DxSummary>
                <DxTotalItem
                  column="m3"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.00##'"
                />
              </DxSummary> -->
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
  DxSeries,
  DxCommonSeriesSettings,
  DxLabel,
  DxArgumentAxis,
  DxGrid,
  DxMargin,
  DxValueAxis,
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
  DxTotalItem,
  DxScrolling,
} from "devextreme-vue/data-grid";
import moment from "moment";
export default {
  name: "bao-cao-san-luong-may",
  components: {
    DxDataGrid,
    DxColumn,
    DxSummary,
    DxTotalItem,
    DxScrolling,
    DxChart,
    DxSeries,
    DxValueAxis,
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
      factoryDongGoi: [],
      congdoan: null,
      total: null,
      congdoans: [],
      toDate: moment().format("YYYY-MM-DD"),
      showChooseDate: false,
      departments: [],
      listItem: [],
      factory: {
        label: "Nhà máy CBG Thuận Hưng",
        id: 100000,
        code: "TH",
      },
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          id: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          id: 102340,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          id: 102366,
          code: "TB",
        },
      ],
    };
  },
  created() {
    this.toDate = moment().format("YYYY-MM-DD");
    this.loadDepartmentByFactory();
    this.load();
  },
  methods: {
    async onChangeCongDoan() {
      if (this.congdoan == null) {
        this.$q.dialog({
          title: "Thiếu thông tin",
          message:
            "Bạn chưa chọn công đoạn hoặc tuần. Vui lòng chọn để xem chi tiết !",
        });
      } else {
        const payload = {
          departmentName: this.congdoan.value,
          toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
        };
        const data = await this.$store.dispatch(
          "prod/GET_ITEM_IN_TON_DEPARTMENT_NAME",
          payload
        );
        this.listItem = [];
        this.listItem = data.data;
      }
    },
    async onSeriesClick({ target: series }) {
      this.congdoan = series.name;
      if (this.congdoan == null) {
        this.$q.dialog({
          title: "Thiếu thông tin",
          message:
            "Bạn chưa chọn công đoạn hoặc tuần. Vui lòng chọn để xem chi tiết !",
        });
      } else {
        const payload = {
          departmentName: this.congdoan,
          toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
        };
        const data = await this.$store.dispatch(
          "prod/GET_ITEM_IN_TON_DEPARTMENT_NAME",
          payload
        );
        console.log("this.congdoan",this.congdoan);
        this.listItem = [];
        this.listItem = data.data;
        this.total = this.listItem[0].total;
      }
    },
    customizeTooltip(pointInfo) {
      return {
        text: `${pointInfo.seriesName}: ${Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(pointInfo.valueText)}`,
      };
    },
    onChange() {
      this.loadDepartmentByFactory();
      this.load();
    },
    async loadDepartmentByFactory() {
      let payload = {
        factoryId: this.factory.id,
      };
      const data = await this.$store.dispatch(
        "prod/GET_DEPARTMENT_TON_BY_FACTORY",
        payload
      );
      this.departments = [];
      this.departments = data.data.filter(d => d.ID != 100264 && d.ID != 100274);
      this.congdoans = [];
      console.log("this.departments", this.departments);
      this.departments.forEach((el) => {
          this.congdoans.push({
          value: el.NAME,
          label: el.NAME,
        });
      });
    },
    async load() {
      let payload = {
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
        factoryId: this.factory.id,
      };
      const data = await this.$store.dispatch(
        "prod/GET_REPORT_CHART_TON_CONG_DOAN_WEEK",
        payload
      );
      this.dataSource = [];
      this.dataSource = data.data;
    },
  },
};
</script>

<style>
g .dxc-item {
  color: red;
  font-weight: bold !important;
}
g .dxc-arg-elements text {
  font-weight: bold !important;
}
#chart {
  height: 700px;
}
#gridContainer {
  height: 650px;
}

</style>