<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-blue-grey-1" style="padding: 3px">
      <div class="row">
        <div class="col-6 top-title text-teal">
          Biểu đồ tổng sản lượng từng công đoạn -
          <span style="font-weight: bold"> {{ factory.label }}</span>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="q-gutter-md row">
        <q-select
          class="col-12 col-md-2"
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
          label="Năm"
          class="col-12 col-md-1"
          label-color="orange"
          v-model.number="year"
          @input="load"
          type="number"
          filled
          dense
        />
        <q-select
          class="col-12 col-md-1"
          filled
          dense
          v-model="type"
          :options="types"
          @input="load"
          label-color="orange"
          label="Kiểu báo cáo"
        />
        
        <q-select
          v-if="type.value == 'thang'"
          class="col-12 col-md-1"
          filled
          dense
          v-model.number="month"
          :options="thangs"
          @input="load"
          type="number"
          label-color="orange"
          label="Tháng"
        />
        <q-select
          v-if="type.value == 'quy'"
          class="col-12 col-md-1"
          filled
          dense
          v-model.number="quy"
          :options="quys"
          @input="load"
          type="number"
          label-color="orange"
          label="Quý"
        />
      </div>
      <div class="row">
        <DxChart
          id="chart1"
          v-if="type.value == 'thang'"
          :data-source="dataSource"
          @pointClick="onPointClick"
        >
          <DxCommonSeriesSettings
            argument-field="NAME"
            type="bar"
            hover-mode="allArgumentPoints"
            selection-mode="allArgumentPoints"
          >
            <DxLabel :visible="true">
              <DxFormat :precision="0" weight="900" type="fixedPoint" />
            </DxLabel>
          </DxCommonSeriesSettings>
          <DxSeries
            :value-field="monthBefore"
            color="#03a9f4"
            :name="'Tháng ' + monthBefore"
          />
          <DxSeries
            :value-field="month.id"
            color="#ffc107"
            :name="'Tháng ' + month.id"
          />

          <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
          <DxExport :enabled="true" />
        </DxChart>
        <DxChart
          id="chart2"
          v-if="type.value == 'quy'"
          :data-source="dataSource"
          @pointClick="onPointClick"
        >
          <DxCommonSeriesSettings
            argument-field="NAME"
            type="bar"
            hover-mode="allArgumentPoints"
            selection-mode="allArgumentPoints"
          >
            <DxLabel :visible="true">
              <DxFormat :precision="0" weight="900" type="fixedPoint" />
            </DxLabel>
          </DxCommonSeriesSettings>
          <DxSeries
            :value-field="quyBefore"
            color="#03a9f4"
            :name="'Quý ' + quyBefore"
          />
          <DxSeries
            :value-field="quy.id"
            color="#ffc107"
            :name="'Quý ' + quy.id"
          />

          <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
          <DxExport :enabled="true" />
        </DxChart>
        <DxChart
          id="chart3"
          v-if="type.value == 'nam'"
          :data-source="dataSource"
          @pointClick="onPointClick"
        >
          <DxCommonSeriesSettings
            argument-field="NAME"
            type="bar"
            hover-mode="allArgumentPoints"
            selection-mode="allArgumentPoints"
          >
            <DxLabel :visible="true">
              <DxFormat :precision="0" weight="900" type="fixedPoint" />
            </DxLabel>
          </DxCommonSeriesSettings>
          <DxSeries
            :value-field="yearBefore"
            color="#03a9f4"
            :name="'Năm ' + yearBefore"
          />
          <DxSeries
            :value-field="year"
            color="#ffc107"
            :name="'Năm ' + year"
          />

          <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
          <DxExport :enabled="true" />
        </DxChart>
      </div>
    </q-card-section>
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
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
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
      dataSource2: [],
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
      types: [
        { label: "Năm", value: "nam" },
        { label: "Quý", value: "quy" },
        { label: "Tháng", value: "thang" },
      ],
      type: { label: "Năm", value: "nam" },
      year: moment().year(),
      monthBefore: null,
      yearBefore: null,
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
      month: { label: moment().month() + 1, id: moment().month() + 1 },
      quys: [
        { label: 1, id: 1 },
        { label: 2, id: 2 },
        { label: 3, id: 3 },
        { label: 4, id: 4 },
      ],
      quyBefore: null,
      quy: { label: 1, id: 1 },
    };
  },
  created(){
    this.load();
  },
  methods: {
    ...mapActions("prod", ["getSLCongDoanThang", "getSLCongDoanQuy", "getSLCongDoanNam"]),
    onChange() {
      this.load();
    },
    changeDate() {
      this.loadDataMonth();
    },
    load(){
      if(this.type.value == "thang"){
        this.loadDataMonth()
      }
      if(this.type.value == "quy"){
        this.loadDataQuarter();
      }
      if(this.type.value == "nam"){
        this.loadDataYear();
      }
    },
    async loadDataMonth() {
      if (this.month.id == 1) {
        this.monthBefore = 12;
        this.yearBefore = this.year - 1;
      } else {
        this.monthBefore = this.month.id - 1;
        this.yearBefore = this.year;
      }
      const payload = {
        factoryId: this.factory.id,
        year: this.year,
        month: this.month.id,
        yearBefore: this.yearBefore,
        monthBefore: this.monthBefore,
      };
      const data = await this.getSLCongDoanThang(payload);
      this.dataSource = data;
    },
    async loadDataQuarter() {
      if (this.quy.id == 1) {
        this.quyBefore = 4;
        this.yearBefore = this.year - 1;
      } else {
        this.quyBefore = this.quy.id - 1;
        this.yearBefore = this.year;
      }
      const payload = {
        factoryId: this.factory.id,
        year: this.year,
        quy: this.quy.id,
        yearBefore: this.yearBefore,
        quyBefore: this.quyBefore,
      };
      const data = await this.getSLCongDoanQuy(payload);
      this.dataSource = data;
    },
    async loadDataYear() {
      this.yearBefore = this.year -1;
      const payload = {
        factoryId: this.factory.id,
        year: this.year,
        yearBefore: this.yearBefore,
      };
      const data = await this.getSLCongDoanNam(payload);
      this.dataSource = data;
    },
  },
};
</script>

<style>
#chart1 {
  width: 100%;
  height: 700px;
}
#chart2 {
  width: 100%;
  height: 700px;
}
#chart3 {
  width: 100%;
  height: 700px;
}
g .dxc-item {
  color: red;
  font-weight: bold !important;
}
g .dxc-arg-elements text {
  font-weight: bold !important;
}
</style>