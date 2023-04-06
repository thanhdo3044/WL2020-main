<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-blue-grey-1" style="padding: 3px">
        <div class="row">
          <div class="col-6 top-title text-orange">
            Biểu đồ tổng tồn từng SP/CT khối CBG
          </div>
        </div>
      </q-card-section>
      <q-separator spaced />

      <q-card-section>
        <div class="q-gutter-md row">
          <q-select
            class="col-2"
            color="grey-3"
            label-color="orange"
            filled
            v-model="item"
            :options="options"
            use-input
            @filter="filterFn"
            label="Chọn Sản phẩm"
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
          <div class="col-8">
            <DxChart
              id="chart"
              :data-source="dataSource"
              @series-click="onSeriesClick"
            >
              <DxCommonSeriesSettings argument-field="sanpham" type="bar">
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
                :value-field="value.congdoan"
                :name="value.congdoan"
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
          <div class="col-4 q-pa-md">
            <DxDataGrid
              :data-source="listItem"
              :show-borders="true"
              id="gridContainer"
            >
              <DxColumn
                data-field="paren"
                :group-index="0"
                caption="Sản phẩm"
              />
              <DxColumn data-field="sanpham" caption="Tên" />
              <DxColumn
                data-field="QUANTITY"
                :width="120"
                format="#,##0.00##"
                caption="Số lượng"
              />
              <DxColumn
                :width="120"
                data-field="m3"
                format="#,##0.00##"
                caption="Khối lượng"
              />
              <DxScrolling mode="infinite" />
              <DxSummary>
                <DxTotalItem
                  column="m3"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.00##'"
                />
              </DxSummary>
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
      congdoans: [],
      showChooseDate: false,
      departments: [],
      listItem: [],
      item: null,
      toDate: moment().format("YYYY-MM-DD"),
      options: [],
      items: []
    };
  },
  created() {
    this.loadDepartmentByFactory();
    this.loadItemTon();
    this.load();
  },
  methods: {
    async onSeriesClick({ target: series }) {
      this.congdoan = series.name;
      console.log("series", series);
      if (this.congdoan == null) {
        this.$q.dialog({
          title: "Thiếu thông tin",
          message:
            "Bạn chưa chọn công đoạn hoặc tuần. Vui lòng chọn để xem chi tiết !",
        });
      } else {
        const payload = {
          departmentName: this.congdoan,
          itemId: this.item.value,
          toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
        };
        const data = await this.$store.dispatch(
          "prod/GET_ITEM_IN_TON_DEPARTMENT_NAME_DETAIL",
          payload
        );
        this.listItem = [];
        this.listItem = data.data;
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
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = this.items
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.items.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    onChange() {
      this.loadDepartmentByFactory();
      this.load();
    },
    async loadItemTon() {
      const data = await this.$store.dispatch("prod/GET_ITEM_TON");
      data.data.forEach((el) => {
        this.options.push({
          value: el.ID,
          label: el.NAME,
        });
      });
      this.items = this.options;
    },
    async loadDepartmentByFactory() {
      let payload = {
        itemId: this.item.value,
      };
      const data = await this.$store.dispatch(
        "prod/GET_DEPARTMENT_ITEM_TON",
        payload
      );
      this.departments = [];
      this.departments = data.data;
      this.congdoans = [];
      this.departments.forEach((el) => {
        this.congdoans.push({
          value: el.STEP_ID,
          label: el.congdoan,
        });
      });
    },
    async load() {
      let payload = {
        itemId: this.item.value,
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
      };
      const data = await this.$store.dispatch(
        "prod/GET_REPORT_CHART_ITEM_TON_CONG_DOAN",
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
  height: 700px;
}

</style>