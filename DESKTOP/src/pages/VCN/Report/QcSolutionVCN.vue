<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo QC xử lý hàng lỗi - 
          <span class="text-amber-14">{{ factory ? factory.label : "" }}</span>
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
        <div class="row">
          <div class="col-12">
            
            <DxDataGrid       
              id="gridContainer"
              :data-source="dataSource"
              :columns="columns"
              :show-borders="true"
              :no-data-text="'Không có dữ liệu !'"
            >
            <DxScrolling mode="virtual" />
              <DxHeaderFilter :visible="true" />
              <DxExport
                :enabled="true"
                :allow-export-selected-data="false"
                :file-name="
                  'Báo cáo hàng đến kho QC xử lý từ ngày ' +
                  tuNgay +
                  ' đến ngày ' +
                  denNgay
                "
              />
              <DxSearchPanel
                :visible="true"
                :placeholder="'Tìm kiếm'"
                :width="400"
              />
              <DxSummary>
                <DxGroupItem
                  column="Số lượng"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'decimal'"
                />
              </DxSummary>
            </DxDataGrid>
          </div>
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
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxScrolling,
  DxExport,
  DxHeaderFilter,
  DxSummary,
  DxGroupItem,
  DxTotalItem,
} from "devextreme-vue/data-grid";
import { DxDateBox } from "devextreme-vue";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxScrolling,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxDateBox,
    DxExport,
    DxHeaderFilter,
    DialogSelectDate,
    DxSummary,
    DxGroupItem,
    DxTotalItem,
  },
  data() {
    return {
      dataSource: [],
      columns: [
        {
          dataField: "tong",
          caption: "Tổng",
          groupIndex: 0,
        },
        {
          dataField: "Tuần",
          alignment: "center",
          width: "100"
        },
        {
          dataField: "Mã tổ QC",
           width: "200"
        },
        {
          dataField: "Kho đến",
           width: "200"
        },
        {
          dataField: "Loại lỗi",
           width: "200"
        },
        {
          dataField: "Biện pháp xử lý",
        },
        {
          dataField: "Chi tiết/cụm",
           width: "320"
        },
        {
          dataField: "Số lượng",
           width: "100"
        },
        {
          dataField: "Người tạo",
           width: "200"
        },
        { dataField: "Ngày tạo", dataType: "date", format: "dd/MM/yyyy", width: "200" },
      ],
      fromDate: null,
      toDate: null,
      showChooseDate: false,
      options: [],
      xuong: null,
      xuongs: [],
      factory: null,
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
    this.toDate = new Date();
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.loadFactory();
  },
  methods: {
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async loadFactory() {
      let options1 = await this.$store.dispatch("vcn/getFactory");
      options1.map((factory) => {
        factory.label = factory.name;
        factory.factoryId = factory.id;
      });
      this.options = options1;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.load();
    },
    async load() {
    console.log("factory", this.factory);
        let payload = {
          fromDate: formatDateISO(this.fromDate),
          toDate: formatDateISO(this.toDate),
          departmentId: this.xuong.id,
        };
        console.log("payload", payload);
        const data = await this.$store.dispatch(
          "vcn/GET_REPORT_QC_SOLUTION_VCN",
          payload
        );
        this.dataSource = data.data;
        console.log("pass", this.dataSource);

    },
    async changeFactory() {
      await this.load();
    },
    async onChange() {
      const payload = {
        factoryId: this.factory.id
      }
      const data = await this.$store.dispatch(
          "vcn/getXuongByFactoryId",
          payload);
      data.map(e => (e.label = e.name));
      this.xuongs = data;
      this.factoryName = this.factory.label;
    },
    async chonXuong() {
      await this.load();
    },
  },
};
</script>

<style>
#gridContainer {
  height: 700px;
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
