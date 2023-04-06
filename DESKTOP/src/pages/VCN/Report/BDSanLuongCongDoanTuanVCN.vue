<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-blue-grey-1" style="padding: 3px">
        <div class="row">
          <div class="col-6 top-title text-orange">
            Biểu đồ theo ngày tổng sản lượng từng nhà máy khối VCN
          </div>

          <div
            class="col-6 top-title cursor-pointer text-orange"
            align="right"
            @click="showChooseDate = true"
          >
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
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
            v-model="factory"
            :options="options"
            label="Chọn Nhà Máy"
            @input="onChange"
            dense
          />
          <q-select
            class="col-2"
            filled
            v-model="congdoan"
            :options="congdoans"
            @input="onChangeCongDoan"
            dense
            label="Công đoạn"
          />
        </div>
        <div class="row">
          <div class="col-9">
            <DxChart
              id="chart"
              :data-source="dataSource"
              @series-click="onSeriesClick"
            >
              <DxCommonSeriesSettings
                argument-field="createdDate"
                type="stackedbar"
              >
                <!-- <DxLabel :visible="true">
                  <DxFormat :precision="0" type="fixedPoint" />
                </DxLabel> -->
              </DxCommonSeriesSettings>

              <DxValueAxis position="left" :tick-interval="300">
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
              <div style="color:#2e7d32;font-weight:bold" class="col-12">
                Tổng sản lượng (M<span style="font-size:20px">&sup3;</span>) : {{Intl.NumberFormat("en", { 
  maximumFractionDigits: 2, 
  minimumFractionDigits: 2, 
}).format(total)}}
              </div>
            </div>
            <DxDataGrid
              :data-source="listItem"
              :show-borders="true"
              id="gridContainer"
            >
              <DxColumn data-field="itemName" caption="Tên" />
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
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
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
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import { mapGetters, mapActions } from "vuex";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import moment from "moment";
export default {
  name: "bao-cao-san-luong-may",
  components: {
    DialogSelectDate,
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
      fromDate: null,
      toDate: null,
      congdoan: null,
      congdoans: [],
      showChooseDate: false,
      departments: [],
      listItem: [],
      total: null,
      factory: null,
      options: [],
    };
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  created() {
    this.loadFactory();
    this.factory = this.options[0];
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
  },
  methods: {
      ...mapActions("vcn", ["getFactory"]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.load();
    },
    chonFromDate(e) {
      this.fromDate = e.value;
      this.load();
    },
    chonToDate(e) {
      this.toDate = e.value;
      this.load();
    },
    async loadFactory() {
      let factories1 = await this.getFactory();
      factories1.map((factory) => {
        factory.label = factory.name;
        factory.id = factory.id;
      });
      this.options = factories1;     
    },
    async onChangeCongDoan(){
      if(this.congdoan == null){
        this.$q.dialog({
          title: "Thiếu thông tin",
          message: "Bạn chưa chọn công đoạn hoặc tuần. Vui lòng chọn để xem chi tiết !"
        });
      }else{
        const payload = {
        departmentName: this.congdoan.value,
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
      };
      const data = await this.$store.dispatch(
        "vcn/GET_ITEM_IN_DEPARTMENT_NAME_VCN",
        payload
      );
      this.listItem = [];
      this.listItem = data;
      this.total = this.listItem[0].total;
      }
    },
    async onSeriesClick({ target: series }) {
      this.congdoan = series.name;
      if(this.congdoan == null){
        this.$q.dialog({
          title: "Thiếu thông tin",
          message: "Bạn chưa chọn công đoạn hoặc tuần. Vui lòng chọn để xem chi tiết !"
        });
      }else{
        const payload = {
        departmentName: this.congdoan,
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
      };
      const data = await this.$store.dispatch(
        "vcn/GET_ITEM_IN_DEPARTMENT_NAME_VCN",
        payload
      );
      this.listItem = [];
      this.listItem = data;
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
        console.log("factory",this.factory);
      let payload = {
        factoryId: this.factory.id,
      };
      const data = await this.$store.dispatch(
        "vcn/GET_DEPARTMENT_BY_FACTORY_VCN",
        payload
      );
      this.departments = [];
      this.departments = data;
      this.congdoans = [];
      this.departments.forEach((el) => {
        this.congdoans.push({
          value: el.NAME,
          label: el.NAME,
        });
      });
    },
    async load() {
      let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
        factoryId: this.factory.id,
      };
      const data = await this.$store.dispatch(
        "vcn/GET_REPORT_CHART_SAN_LUONG_CONG_DOAN_WEEK_VCN",
        payload
      );
      this.dataSource = [];
      this.dataSource = data;
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
  height: 1000px;
}

</style>