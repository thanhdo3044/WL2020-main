<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo thống kê lỗi các công đoạn -
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
            <hr />
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
              :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
              :show-column-lines="true"
              :allow-column-resizing="true"
            >
              <DxColumnChooser :enabled="true" />
              <DxScrolling mode="virtual" />
              <DxHeaderFilter :visible="true" />
              <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              />
              <DxGrouping :auto-expand-all="true" />
              <DxSummary>
                <DxGroupItem
                  column="QUANTITY"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'decimal'"
                />
              </DxSummary>
              <DxExport
                :enabled="true"
                :allow-export-selected-data="false"
                :file-name="
                  'Dữ liệu sản xuất chi tiết từ ngày ' +
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
  DxExport,
  DxSummary,
  DxTotalItem,
  DxScrolling,
  DxGroupItem,
  DxHeaderFilter,
  DxColumnChooser,
} from "devextreme-vue/data-grid";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import { mapGetters } from "vuex";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxGroupItem,
    DxSearchPanel,
    DxExport,
    DialogSelectDate,
    DxSummary,
    DxTotalItem,
    DxScrolling,
    DxHeaderFilter,
    DxColumnChooser,
  },
  data() {
    return {
      showChooseDate: false,
      dataSource: [],
      factory: null,
      options: [],
      xuong: null,
      xuongs: [],
      columns: [
        {
          dataField: "tong",
          caption: "Tổng",
          groupIndex: 0,
        },
        {
          dataField: "WEEK",
          caption: "Tuần",
        },
        {
          dataField: "DEPARTMENT_NAME",
          caption: "Tổ",
        },
        {
          dataField: "SOURCE_NAME",
          caption: "Nguồn phôi",
        },
        {
          dataField: "ITEM_NAME",
          caption: "Chi tiết/cụm",
        },
        {
          dataField: "QUANTITY",
          caption: "Số lượng",
        },
        {
          dataField: "LAST_NAME",
          caption: "Người tạo",
        },
        {
          dataField: "CREATE_DATE",
          caption: "Ngày tạo",
          format: "dd/MM/yyyy HH:mm:ssZ",
        },
      ],
      fromDate: null,
      toDate: null,
    };
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
    ...mapGetters("base", ["myFactoryInfor"]),
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
      let factories1 = await this.$store.dispatch("vcn/getFactory");
      factories1.map((factory) => {
        factory.label = factory.name;
        factory.factoryId = factory.id;
      });
      this.options = factories1;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      // console.log(this.factory.factoryId)
      this.load(this.factory.factoryId);
    },
    async onChange(value) {
      console.log(value.factoryId);
      // this.factory = value
      await this.load(value.factoryId);
    },
    async onChange() {
      const payload = {
        factoryId: this.factory.id,
      };
      const data = await this.$store.dispatch(
        "vcn/getXuongByFactoryId",
        payload
      );
      data.map((e) => (e.label = e.name));
      this.xuongs = data;
      this.factoryName = this.factory.label;
    },
    async chonXuong() {
      await this.load();
    },
    async load() {
      if (this.xuong.id) {
        let payload = {
          fromDate: formatDateISO(this.fromDate),
          toDate: formatDateISO(this.toDate),
          factoryId: this.xuong.id,
        };
        const data = await this.$store.dispatch(
          "vcn/GET_REPORT_DEFECT_DETAIL_VCN",
          payload
        );
        this.dataSource = data;
      }
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
</style>
