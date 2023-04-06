<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
           Báo cáo sản lượng theo ngày -
          <span class="text-amber-14">{{factoryName}}</span>
        </div>

        <div
          class="col-6 cursor-pointer text-blue text-bold"
          style="font-size: 18px"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
          <span class="text-amber-14">{{ denNgay }}</span>
        </div>
      </div>
    </div>

    <q-card class="my-card">

       <div style="padding: 5px">
        <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
          <div class="col-12">
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in options"
                :key="index"
              >
                <q-radio
                  dense
                  @input="onChange"
                  v-model="factory"
                  :val="congDoan"
                  :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  v-bind:class="{ isActive: true }"
                  color="amber-6"
                />
              </div>
            </div>
          <hr>
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in xuongs"
                :key="index"
              >
                <q-radio
                  dense
                  @input="chonXuong"
                  v-model="xuong"
                  :val="congDoan"
                  :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  v-bind:class="{ isActive: true }"
                  color="amber-6"
                />
              </div>
            </div>
          </div>
        </div>
        <DxDataGrid
        id="gridContainer"
          :data-source="dataSource"
          :word-wrap-enabled="true"
          :no-data-text="'Không có dữ liệu !'"
          :show-borders="true"
          :show-row-lines="true"
          :show-column-lines="true"
        >
          <DxExport :enabled="true" :allow-export-selected-data="true" />
          <DxColumnChooser :enabled="true" />
          <DxScrolling mode="virtual" />
          <DxFilterRow :visible="true" />
          <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              />
          <DxGrouping :auto-expand-all="true" />
          <DxHeaderFilter
        :visible="true"
      />
          <DxColumn
                data-field="departmentName"
                caption="Công đoạn"
                :group-index="0"
                cell-template="cellTemplateSL"
              />
              <!-- <template #cellTemplateSL="cell">
               <span style="color:red">{{cell.data.value}}</span>
            </template> -->
              <DxColumn data-field="itemName" caption="Chi tiết" />
              
              <DxColumn caption="Quy Cách" alignment="center">
                <DxColumn
                  caption="Dầy"
                  data-field="height"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  caption="Rộng"
                  data-field="width"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  caption="Dài"
                  data-field="length"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
              </DxColumn>
              <DxColumn
                data-field="QUANTITY"
                caption="Số lượng"
                data-type="number"
                format="#,##0.####"
                width="160"
              />
              <DxColumn
                data-field="volumn"
                caption="M3"
                data-type="number"
                format="#,##0.0000"
                width="160"
              />
              <DxColumn
                data-field="CREATE_DATE"
                caption="Ngày tạo"
                data-type="date"
                format="dd/MM/yyyy" 
                width="160"
              />
              <DxSummary>
                <DxGroupItem
                  column="QUANTITY"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0'"
                />
                <DxGroupItem
                  column="volumn"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.0000'"
                />
              </DxSummary>
        </DxDataGrid>
      </div>
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
  DxDataGrid,
  DxColumn,
  DxExport,
  DxLookup,
  DxSummary,
  DxGroupItem,
  DxFilterRow,
  DxScrolling,
  DxHeaderFilter,
  DxColumnChooser,
  DxGrouping,
  DxGroupPanel
} from "devextreme-vue/data-grid";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import DialogSelectDate from "./../../../components/commons/DialogSelectFromDateToDate";
import moment from "moment";
import { mapActions } from "vuex";
export default {
  name: "bao-cao-san-luong-may",
  components: {
    DxDataGrid,
    DxColumn,
    DxExport,
    DialogSelectDate,
    DxLookup,
    DxSummary,
    DxScrolling,
    DxGroupItem,
    DxFilterRow,
    DxHeaderFilter,
    DxColumnChooser,
    DxGrouping,
    DxGroupPanel
  },
  data() {
    return {
      dataSource: [],
      factory: null,
      options: [],
      mode: "select",
      fromDate: null,
      toDate: null,
      xuong: null,
      xuongs: [],
      factoryName: null,
      showChooseDate: false,
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
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load();
  },
  methods: {
    ...mapActions("vcn", ["getFactory", "getBCSanLuongByDayVCN", "getXuongByFactoryId"]),
    async loadFactory() {
      const factory = await this.getFactory();
      factory.map((e) => (e.label = e.name));
      this.options = factory;
      this.factory = factory[0];
      this.factoryName = factory[0].label;
    },
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
    async onChange() {
      const payload = {
        factoryId: this.factory.id
      }
      const data = await this.getXuongByFactoryId(payload);
      data.map(e => (e.label = e.name));
      this.xuongs = data;
      this.factoryName = this.factory.label;
    },
    async chonXuong() {
      this.load();
      this.factoryName = this.factory.label;
    },
    async load() {
      let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
        factoryId: this.xuong.id,
      };
      const data = await this.getBCSanLuongByDayVCN(payload);
      this.dataSource = data;
      console.log(this.dataSource);
    },
  },
};
</script>

<style>
#gridContainer {
  height: 700px;
}
.mauSlTheoNgay {
    background-color: red;
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
</style>