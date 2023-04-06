<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-10 top-title text-orange">
            Báo cáo cấp sơn theo định mức
          </div>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <div class="row">
          <q-input
            class="col-2 q-ml-sm"
            label-color="orange"
            @input="loadGrid"
            outlined
            v-model.number="year"
            type="number"
            label="Năm"
          />
          <q-input
            class="col-2 q-ml-sm"
            @input="loadGrid"
            label-color="orange"
            outlined
            v-model.number="week"
            type="number"
            label="Tuần"
          />
          <q-select
            class="col-2 q-ml-sm"
            @input="onChange"
            label-color="orange"
            outlined
            v-model="idDepartment"
            :options="options"
            label="Chọn nhà máy"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <div>
          <b class="text-positive">Danh sách các LSX :</b>
        </div>
        <div class="row">
          <div class="col-3" v-for="(lsx, key) in dataTotal" :key="key">
            <q-radio
              @input="xemlsx()"
              :val="lsx.number"
              :label="lsx.number"
              v-model="selection"
              color="teal"
              class="text-weight-bold"
            />
            <!-- hiển thị % tỷ lệ đạt kế hoạch -->
            <!-- <q-badge align="top">{{ lsx.avgTiLeTH }}%</q-badge> -->
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <DxDataGrid
          id="gridContainer"
          :word-wrap-enabled="true"
          :data-source="dataSource"
          :show-row-lines="true"
          :show-column-lines="true"
          :show-borders="true"
          :column-auto-width="true"
          :no-data-text="'Không có dữ liệu !'"
        >
          <DxColumn data-field="ma_vt" caption="Mã VT" :width="100" />
          <DxColumn data-field="ten_vt" caption="Tên VT" />
          <DxColumn data-field="marketName" caption="Sản phẩm" :width="320" />
          <DxColumn
            data-field="SLSX"
            caption="SLSX"
            data-type="number"
            format="###,##0.##"
            alignment="center"
            :width="100"
          />
          <DxColumn
          v-for="number in soLans"
          :key="number"
            :data-field="''+number"
            :caption="'Lần '+ number "
            data-type="number"
            format="###,##0.##"
            alignment="center"
            :width="100"
          />
          <DxColumn
            data-field="total"
            caption="Tổng"
            data-type="number"
            format="###,##0.##"
            alignment="center"
            cell-template="cellTemplate"
            :width="100"
          />
          <template #cellTemplate="{ data }">
        <span style="font-weight:800;color:red" v-if="data.data.SLSX - data.value < 0">{{ data.value }}</span>
        <span v-else> {{ data.value }} </span>
      </template>
        </DxDataGrid>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { DxDataGrid, DxColumn } from "devextreme-vue/data-grid";
import { getWeekNumber } from "../../../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
  },
  data() {
    return {
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 100004,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 100005,
          code: "TB",
        },
      ],
      year: null,
      week: null,
      soLans: [],
      dataTotal: [],
      selection: null,
      idDepartment: null,
      dataSource: [],
    };
  },
  created() {
    const today = new Date();
    const currentYear = today.getFullYear();
    this.year = currentYear;
    this.week = getWeekNumber(today);
    this.idDepartment = this.options[0];
    this.loadGrid();
  },
  methods: {
    async loadGrid() {
      const payload = {
        year: this.year,
        week: this.week,
        factoryId: this.idDepartment.factoryId,
      };
      const data = await this.$store.dispatch("prod/LSX_IN_VT_SON", payload);
      this.dataTotal = data.data;
      this.dataSource = [];
    },
    onChange() {
      this.loadGrid();
    },
    async xemlsx() {
      const payload = {
        number: this.selection,
      };
      const dataSoLan = await this.$store.dispatch("prod/GET_SO_LAN_IN_VT_SON", payload);
      let soLan = dataSoLan.data[0].soLan;
      let numbers = "";
      for (let i = 1; i <= soLan; i++) {
        numbers += `[${i}],`;
        this.soLans.push(i);     
      }
      numbers = numbers.substring(0, numbers.length - 1);
      console.log("numbers", numbers);
      const payload2 = {
        number: this.selection,
        arrSoLan: numbers,
      }
      const data = await this.$store.dispatch("prod/REPORT_VT_SON", payload2);
      console.log("data", data);
      this.dataSource = data.data;
    },
  },
};
</script>

<style>
</style>