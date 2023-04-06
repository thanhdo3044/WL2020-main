<template>
  <q-page class="q-pa-sm">
     <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo sản lượng từng công đoạn - 
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


    <q-card >
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
          :data-source="dataSource"
          :word-wrap-enabled="true"
          :no-data-text="'Không có dữ liệu !'"
          :show-borders="true"
          :show-row-lines="true"
          :show-column-lines="true"
        >
        <DxHeaderFilter :visible="true" />
          <DxExport :enabled="true" :allow-export-selected-data="true" />
          <DxColumn caption="Công đoạn" data-field="NAME" :width="150" :group-index="0" />
          <DxColumn caption="Chi tiết" data-field="ITEM_NAME" :width="280" />
          <DxColumn caption="Quy cách" alignment="center" >
              <DxColumn caption="Dài" data-field="length" :width="90" alignment="center" />
              <DxColumn caption="Rộng" data-field="width" :width="90" alignment="center" />
              <DxColumn caption="Dày" data-field="height" :width="90" alignment="center" />
          </DxColumn>
          <DxColumn caption="ĐVT" data-field="UNIT_NAME" :width="90" alignment="center" />
          <DxColumn
            caption="Thứ 2"
            data-field="Monday"
            data-type="number"
            format="#,##0.00"
            :width="150"
            alignment="center"
          >
            <DxColumn
            caption="SL"
            data-field="Monday"
            data-type="number"
            format="#,##0.00"
            :width="90"
            alignment="center"
          />
          <DxColumn
            caption="KL"
            data-field="KLMonday"
            data-type="number"
            format="#,##0.00"
            :width="90"
            alignment="center"
            :calculate-cell-value="calculateKLMonday"
          />
          </DxColumn>
          <DxColumn
            caption="Thứ 3"
            alignment="center"
          >
          <DxColumn
            caption="SL"
            data-field="Tuesday"
            data-type="number"
            format="#,##0.00"
            :width="90"
            alignment="center"
          />
          <DxColumn
            caption="KL"
            data-field="KLTuesday"
            data-type="number"
            format="#,##0.00"
            :width="90"
            alignment="center"
            :calculate-cell-value="calculateKLTuesday"
          />
          </DxColumn>
          <DxColumn
            caption="Thứ 4"
            alignment="center"
          >
          <DxColumn
            caption="SL"
            data-field="Wednesday"
            data-type="number"
            format="#,##0.00"
            :width="90"
            alignment="center"
          />
          <DxColumn
            caption="KL"
            data-field="KLWednesday"
            data-type="number"
            format="#,##0.00"
            :width="90"
            alignment="center"
            :calculate-cell-value="calculateKLWednesday"
          />
          </DxColumn>
          <DxColumn
            caption="Thứ 5"
            alignment="center"
          >
          <DxColumn
            caption="SL"
            data-field="Thursday"
            data-type="number"
            format="#,##0.00"
            :width="90"
            alignment="center"
          />
          <DxColumn
            caption="KL"
            data-field="KLThursday"
            data-type="number"
            format="#,##0.00"
            :width="90"
            alignment="center"
            :calculate-cell-value="calculateKLThursday"
          />
          </DxColumn>
          <DxColumn
            caption="Thứ 6"
            alignment="center"
          >
          <DxColumn
            caption="SL"
            data-field="Friday"
            data-type="number"
            format="#,##0.00"
            :width="90"
            alignment="center"
          />
          <DxColumn
            caption="KL"
            data-field="KLFriday"
            data-type="number"
            format="#,##0.00"
            :width="90"
            alignment="center"
            :calculate-cell-value="calculateKLFriday"
          />
          </DxColumn>
          <DxColumn
            caption="Thứ 7"
            alignment="center"
          >
          <DxColumn
            caption="SL"
            data-field="Saturday"
            data-type="number"
            format="#,##0.00"
            :width="90"
            alignment="center"
          />
          <DxColumn
            caption="KL"
            data-field="KLSaturday"
            data-type="number"
            format="#,##0.00"
            :width="90"
            alignment="center"
            :calculate-cell-value="calculateKLSaturday"
          />
          </DxColumn>
          <DxColumn
            caption="Chủ nhật"
            alignment="center"
          >
          <DxColumn
            caption="SL"
            data-field="Sunday"
            data-type="number"
            format="#,##0.00"
            :width="90"
            alignment="center"
          />
          <DxColumn
            caption="KL"
            data-field="KLSunday"
            data-type="number"
            format="#,##0.00"
            :width="90"
            alignment="center"
            :calculate-cell-value="calculateKLSunday"
          />
          </DxColumn>
          <DxColumn
            caption="Tổng tuần"
            alignment="center"
          >
          <DxColumn
            caption="SL"
            data-field="total"
            data-type="number"
            format="#,##0.00"
            :width="120"
            alignment="center"
            :calculate-cell-value="calculateSL"
          />
          <DxColumn
            caption="KL"
            data-field="KLTotal"
            data-type="number"
            format="#,##0.00"
            :width="120"
            alignment="center"
            :calculate-cell-value="calculateKLTotal"
          />
          </DxColumn>
          <DxSummary>
            <DxGroupItem
                  column="KLMonday"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
            <DxGroupItem
                  column="KLTuesday"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
            <DxGroupItem
                  column="KLWednesday"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
            <DxGroupItem
                  column="KLThursday"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
            <DxGroupItem
                  column="KLFriday"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
            <DxGroupItem
                  column="KLSaturday"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
            <DxGroupItem
                  column="KLSunday"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
            <DxGroupItem
                  column="KLTotal"
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
  DxHeaderFilter,
  DxSummary,
  DxGroupItem,
  DxExport,
  DxLookup,
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
    DxHeaderFilter,
    DxSummary,
    DxGroupItem,
    DialogSelectDate,
    DxLookup,
  },
  data() {
    return {
      dataSource: [],
      factory: null,
      options: [],
      xuong: null,
      xuongs: [],
      mode: "select",
      fromDate: null,
      toDate: null,
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
    ...mapActions("vcn", ["getFactory", "getBCStepByWeek", "getXuongByFactoryId"]),
    async loadFactory() {
      const factory = await this.getFactory();
      factory.map((e) => (e.label = e.name));
      this.options = factory;
    },
    calculateKLMonday(rowData){
        rowData.KLMonday = rowData.Monday * rowData.volumn;
        return rowData.KLMonday;
    },
    calculateKLTuesday(rowData){
        rowData.KLTuesday = rowData.Tuesday * rowData.volumn;
        return rowData.KLTuesday;
    },
    calculateKLWednesday(rowData){
        rowData.KLWednesday = rowData.Wednesday * rowData.volumn;
        return rowData.KLWednesday;
    },
    calculateKLThursday(rowData){
        rowData.KLThursday = rowData.Thursday * rowData.volumn;
        return rowData.KLThursday;
    },
    calculateKLFriday(rowData){
        rowData.KLFriday = rowData.Friday * rowData.volumn;
        return rowData.KLFriday;
    },
    calculateKLSaturday(rowData){
        rowData.KLSaturday = rowData.Saturday * rowData.volumn;
        return rowData.KLSaturday;
    },
    calculateKLSunday(rowData){
        rowData.KLSunday = rowData.Sunday * rowData.volumn;
        return rowData.KLSunday;
    },
    calculateKLTotal(rowData){
        rowData.KLTotal = rowData.total * rowData.volumn;
        return rowData.KLTotal;
    },
    calculateSL(rowData) {
      rowData.total =
        rowData.Monday +
        rowData.Tuesday +
        rowData.Wednesday +
        rowData.Thursday +
        rowData.Friday +
        rowData.Saturday +
        rowData.Sunday;
      return rowData.total;
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

    },
    async load() {
      let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
        factoryId: this.xuong.id,
      };
      const data = await this.getBCStepByWeek(payload);
      this.dataSource = data;
      console.log(this.dataSource);
    },
  },
};
</script>

<style>
.title{
  padding-top: 8px;
  font-weight: bold;
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