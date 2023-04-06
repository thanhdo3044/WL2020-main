<template>
  <q-page>
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo sản lượng theo LSX khối VCN
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
    <q-card>
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
      <div v-if="xuong" style="padding: 0 10px 0 10px">
        <DxDataGrid
          id="gridContainer"
          :data-source="dataSource"
          :hover-state-enabled="true"
          :word-wrap-enabled="true"
          :show-row-lines="true"
          :row-alternation-enabled="true"
        >
          <DxHeaderFilter :visible="true" />
          <DxScrolling mode="infinite" />
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Báo cáo SL theo LSX khối VCN - ngày '+ ngay"
          />
          <DxColumn
            data-field="tong"
            caption="Tổng"
            group-index="0"
          />
          <DxColumn
            data-field="number"
            caption="Lệnh sản xuất"
            width="250"
            cell-template="cellTemplateNumber"
          />
          <template #cellTemplateNumber="{ data }">
            <span class="text-bold">{{ data.value }}</span>
          </template>
          <DxColumn data-field="name" caption="Loại ván" width="320" cell-template="cellTemplateName" />
          <template #cellTemplateName="{ data }">
            <span class="text-bold">{{ data.value }}</span>
          </template>
          <DxColumn caption="Quy cách" alignment="center">
            <DxColumn
              data-field="height"
              caption="Dày"
              width="80"
              alignment="center"
            />
            <DxColumn
              data-field="width"
              caption="Rộng"
              width="90"
              alignment="center"
            />
            <DxColumn
              data-field="length"
              caption="Dài"
              width="80"
              alignment="center"
            />
          </DxColumn>
          <DxColumn
            data-field="UNIT_NAME"
            caption="ĐVT"
            width="80"
            alignment="center"
          />
          <DxColumn
            data-field="keHoach"
            caption="Số lượng theo LSX"
            format="#,##0.####"
            data-type="number"
            width="150"
          />
          <DxColumn
            v-if="xuong.id == 102498"
            data-field="102753"
            caption="1. Tạo Ván"
            data-type="number"
            width="120"
          />
          <DxColumn
            v-if="xuong.id == 102498"
            data-field="102755"
            caption="2. Lên lớp"
            data-type="number"
            width="120"
          />
          <DxColumn
            v-if="xuong.id == 102498"
            data-field="102756"
            caption="3. Lọc ván"
            data-type="number"
            width="120"
          />
          <DxColumn
            v-if="xuong.id == 102498"
            data-field="102757"
            caption="4. Kho Ván cốt"
            data-type="number"
            width="120"
          />
          <DxColumn
            v-if="xuong.id == 102498"
            data-field="102758"
            caption="5. Dán mặt"
            data-type="number"
            width="120"
          />
          <DxColumn
            v-if="xuong.id == 102498"
            data-field="102759"
            caption="6. Hoàn thiện"
            data-type="number"
            width="120"
          />
          <DxColumn
            v-if="xuong.id == 102531"
            data-field="102749"
            caption="1. Tạo Ván"
            format="#,##0.####"
            data-type="number"
            width="120"
          />
          <DxColumn
            v-if="xuong.id == 102531"
            data-field="102751"
            format="#,##0.####"
            caption="2. Hoàn thiện"
            data-type="number"
            width="120"
          />
          <DxColumn
            v-if="xuong.id == 102744"
            data-field="102761"
            caption="1. Tạo Ván"
            format="#,##0.####"
            data-type="number"
            width="120"
          />
          <DxColumn
            v-if="xuong.id == 102744"
            data-field="102762"
            format="#,##0.####"
            caption="2. Hoàn thiện"
            data-type="number"
            width="120"
          />
          <DxColumn
            v-if="xuong.id == 102818"
            data-field="102819"
            caption="1. Tạo Ván"
            format="#,##0.####"
            data-type="number"
            width="120"
          />
          <DxColumn
            v-if="xuong.id == 102818"
            data-field="102820"
            format="#,##0.####"
            caption="2. Hoàn thiện"
            data-type="number"
            width="120"
          />
          <DxColumn
            data-field="loiLoai"
            caption="Lỗi"
            data-type="number"
            width="120"
          />
          <DxColumn
            data-field="TY_LE"
            caption="Tỷ lệ đạt (không bao gồm lỗi)"
            format="#0.##%"
            data-type="number"
            width="140"
          />
          <DxColumn
            data-field="TY_LE_HOAN_THANH"
            caption="Tỷ lệ hoàn thành LSX (đã bao gồm lỗi)"
            format="#0.##%"
            data-type="number"
            width="160"
          />
          <DxSummary>
                <DxGroupItem
                  column="102749"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0'"
                />
                <DxGroupItem
                  column="102761"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0'"
                />
                <DxGroupItem
                  column="102762"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0'"
                />
                <DxGroupItem
                  column="102819"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0'"
                />
                <DxGroupItem
                  column="102820"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0'"
                />
                <DxGroupItem
                  column="102751"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.0000'"
                />


                <DxGroupItem
                  column="102753"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0'"
                />
                <DxGroupItem
                  column="102755"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0'"
                />
                <DxGroupItem
                  column="102756"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0'"
                />
                <DxGroupItem
                  column="102757"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0'"
                />
                <DxGroupItem
                  column="102758"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0'"
                />
                <DxGroupItem
                  column="102759"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0'"
                />
                <DxGroupItem
                  column="loiLoai"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0'"
                />
              </DxSummary>
        </DxDataGrid>
      </div>
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
  DxScrolling,
  DxExport,
  DxSummary,
    DxGroupItem
} from "devextreme-vue/data-grid";
import moment from "moment";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import DialogSelectDate from "./../../../components/commons/DialogSelectFromDateToDate";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxHeaderFilter,
    DialogSelectDate,
    DxScrolling,
    DxExport,
    DxSummary,
    DxGroupItem
  },
  data() {
    return {
      ngay: moment().format("DD/MM/YYYY"),
      factory: {
        factoryId: 0,
        label: "",
      },
      options: [],
      xuong: null,
      xuongs: [],
      dataSource: [],
      fromDate: null,
      toDate: null,
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
  async created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    await this.loadFactory();
  },
  methods: {
    ...mapActions("vcn", [
      "getFactory",
      "getDepartmentVCN",
      "getBCLSXTheoCongDoan",
      "getXuongByFactoryId"
    ]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.loadData();
    },
    async loadFactory() {
      let factories1 = await this.getFactory();
      factories1.map((factory) => {
        factory.label = factory.name;
        factory.factoryId = factory.id;
      });
      this.options = factories1;
    },
    async loadData() {
      this.dataSource = [];
      let payload = {
        factoryId: this.xuong.id,
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
      };
      let data = await this.getBCLSXTheoCongDoan(payload);
      this.dataSource = data;
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
      this.congdoans = [];
      const payload = {
        factoryId: this.xuong.id,
      };
      let departments = await this.getDepartmentVCN(payload);
      console.log("department: ", departments);
      this.congdoans = departments;
      this.loadData();
    },
  },
};
</script>

<style>
#gridContainer {
  height: 800px;
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