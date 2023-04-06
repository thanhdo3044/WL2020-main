<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-6 top-title text-orange">
            Báo cáo hiệu suất máy theo tháng
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
        <div class="q-pa-md" style="max-width: 300px">
          <div class="q-gutter-md">
            <q-select
              v-model="machine"
              :options="machines"
              @input="onChange"
              label="Chọn máy"
            />
          </div>
        </div>
        <DxChart
          id="chart"
          :data-source="dataSource"
          title="Biểu đồ báo cáo hiệu suất theo ngày (Md)"
        >
          <DxCommonSeriesSettings
            argument-field="monthRFM"
            type="bar"
            hover-mode="allArgumentPoints"
            selection-mode="allArgumentPoints"
          >
            <DxLabel :visible="true">
              <DxFormat :precision="0" type="fixedPoint" />
            </DxLabel>
          </DxCommonSeriesSettings>
          <DxSeries value-field="100000" name="Thuận Hưng" color="#0d47a1" />
          <DxSeries value-field="100003" name="Yên Sơn 1A" color="orange" />
          <DxSeries value-field="100004" name="Yên Sơn 1B" color="#21ba45" />
          <DxSeries value-field="100005" name="Thái Bình" color="#dd2c00" />
          <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
          <DxExport :enabled="true" />
        </DxChart>
        <DxChart
          id="chart"
          :data-source="chartM3"
          title="Biểu đồ báo cáo hiệu suất theo ngày (M3)"
        >
          <DxCommonSeriesSettings
            argument-field="monthRFM"
            type="bar"
            hover-mode="allArgumentPoints"
            selection-mode="allArgumentPoints"
          >
            <DxLabel :visible="true">
              <DxFormat :precision="4" type="fixedPoint" />
            </DxLabel>
          </DxCommonSeriesSettings>
          <DxSeries value-field="100000" name="Thuận Hưng" color="#0d47a1" />
          <DxSeries value-field="100003" name="Yên Sơn 1A" color="orange" />
          <DxSeries value-field="100004" name="Yên Sơn 1B" color="#21ba45" />
          <DxSeries value-field="100005" name="Thái Bình" color="#dd2c00" />
          <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
          <DxExport :enabled="true" />
        </DxChart>
        <DxChart
          id="chart"
          :data-source="chartSL"
          title="Biểu đồ báo cáo hiệu suất theo ngày (Thanh)"
        >
          <DxCommonSeriesSettings
            argument-field="monthRFM"
            type="bar"
            hover-mode="allArgumentPoints"
            selection-mode="allArgumentPoints"
          >
            <DxLabel :visible="true">
              <DxFormat :precision="0" type="fixedPoint" />
            </DxLabel>
          </DxCommonSeriesSettings>
          <DxSeries value-field="100000" name="Thuận Hưng" color="#0d47a1" />
          <DxSeries value-field="100003" name="Yên Sơn 1A" color="orange" />
          <DxSeries value-field="100004" name="Yên Sơn 1B" color="#21ba45" />
          <DxSeries value-field="100005" name="Thái Bình" color="#dd2c00" />
          <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
          <DxExport :enabled="true" />
        </DxChart>
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
  DxFormat,
  DxLegend,
  DxExport,
} from "devextreme-vue/chart";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../../ultils";
import DialogSelectDate from "../../components/commons/DialogSelectFromDateToDate";
import moment from "moment";
export default {
  name: "bao-cao-san-luong-may",
  components: {
    DialogSelectDate,
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxLabel,
    DxFormat,
    DxLegend,
    DxExport,
  },
  data() {
    return {
      dataSource: [],
      fromDate: null,
      toDate: null,
      showChooseDate: false,
      machine: null,
      machines: [],
      chartM3: [],
      chartSL: []
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
    this.loadMachine();
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load();
  },
  methods: {
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
    async loadMachine() {
      this.machines = [];
      let data = await this.$store.dispatch("machine/getMachineName");
      data.data.forEach((el) => {
        this.machines.push({
          label: el.NAME,
          value: el.NAME,
        });
      });
    },
    onChange() {
      this.load();
    },
    async load() {
      if (this.machine != null) {
        let payload = {
          fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
          toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
          machineName: this.machine.value,
        };
        const data = await this.$store.dispatch(
          "machine/GET_REPORT_CHART_MD_MONTH",
          payload
        );
        const m3 = await this.$store.dispatch(
          "machine/GET_REPORT_CHART_M3_MONTH",
          payload
        );
        const sl = await this.$store.dispatch(
          "machine/GET_REPORT_CHART_SL_MONTH",
          payload
        );
        this.dataSource = data.data;
        this.chartM3 = m3.data;
        this.chartSL = sl.data;
        console.log(this.dataSource);
      }
    },
  },
};
</script>

<style>
</style>