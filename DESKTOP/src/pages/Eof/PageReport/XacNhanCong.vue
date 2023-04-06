<template>
  <q-page class="q-pa-sm">
    <div class="row" style="background-color: #daf8e1">
      <div class="col-6 text-blue text-bold" style="font-size: 18px">
        Thống kê chi tiết phiếu làm thêm giờ
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
    <div class="q-ma-sm">
      <DxDataGrid
        :allow-column-reordering="true"
        :data-source="customers"
        :show-borders="true"
        :hover-state-enabled="true"
        :show-row-lines="true"
      >
        <DxExport
          :enabled="true"
          :allow-export-selected-data="true"
          :file-name="title"
        />
        <DxFilterRow :visible="true" />
        <DxFilterPanel :visible="true" />
        <DxHeaderFilter :visible="true" />
        <DxColumn data-field="maNV" caption="Mã nhân viên" />
        <DxColumn data-field="fullName" caption="Họ và Tên" />
        <DxColumn data-field="work" caption="Công việc" />
        <DxColumn data-field="date" caption="Ngày làm thêm" />
        <DxColumn data-field="hoursIn" caption="Thời gian từ" />
        <DxColumn data-field="hoursOut" caption="Thời gian đến" />
        <DxColumn data-field="total" caption="Tổng số giờ" />
        <DxColumn data-field="totalTime" caption="Tổng giờ" />
        <DxColumn data-field="status" caption="Trạng thái" />
        <DxColumn
          data-field="createdAt"
          :allow-exporting="true"
          caption="Ngày tạo phiếu"
        />
        <DxColumn
          :group-index="0"
          caption="Phòng ban"
          data-field="department"
        />
        <DxSummary>
          <DxGroupItem
            column="totalTime"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.##'"
          />
        </DxSummary>
        <DxGroupPanel :visible="true" />
        <DxGrouping :auto-expand-all="autoExpandAll" />
        <DxPaging :page-size="1000" />
        <DxSearchPanel :visible="true" />
      </DxDataGrid>

      <div class="options">
        <div class="caption">Tùy chọn</div>
        <div class="option">
          <DxCheckBox
            :value="autoExpandAll"
            text="Ẩn hiện chi tiết dữ liệu"
          />
        </div>
      </div>
    </div>
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
  </q-page>
</template>
<script>
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
  showNotifySuccess,
  showNotifyError,
} from "../../../ultils";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import DxCheckBox from "devextreme-vue/check-box";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxSearchPanel,
  DxPaging,
  DxHeaderFilter,
  DxFilterRow,
  DxFilterPanel,
  DxExport,
  DxSummary,
  DxGroupItem,
} from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";

export default {
  components: {
    DxCheckBox,
    DxColumn,
    DxGroupPanel,
    DxGrouping,
    DxPaging,
    DxSearchPanel,
    DxDataGrid,
    DxHeaderFilter,
    DxFilterRow,
    DxFilterPanel,
    DxExport,
    DxSummary,
    DxGroupItem,
    DialogSelectDate
  },
  computed: {
    ...mapGetters("orders", ["orders"]),
    ...mapGetters("base", ["userInfo"]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  data() {
    return {
      expandedRowKeys: [1, 2],
      selectedRowKeys: [1, 29, 42],
      dataSource: null,
      dataBiding: [],
      customers: [],
      fromDate: null,
      toDate: null,
      showChooseDate: false,
      autoExpandAll: true,
      title: "",
    };
  },
  async created() {
    this.toDate = new Date();
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.title = "Phiếu làm thêm giờ ngày " + moment().format("DD-MM-YYYY");
    this.customers = [];
    let payload = {
      dateStart: formatDateISO(this.fromDate) + " 00:00",
      dateEnd: formatDateISO(this.toDate) + " 23:59",
      idDepartment: this.userInfo.department,
      activeSuccess: 3,
    };
    let { data } = await this.getLTGOrders(payload);
    // let { data } = await this.getAllOrder();

    console.log(data);
    //lọc dữ liệu làm thêm giờ
    data[0].forEach(async (element) => {
      if (element.maNV != null) {
          var a = moment(element.hoursIn, "HH:mm");
          var b = moment(element.hoursOut, "HH:mm");
          let totalTime = Math.round((b.diff(a, "minutes") / 60) * 100) / 100;
          this.customers.push({
            ...element,
            totalTime: totalTime,
          });
        }
    });
    console.log("dataBiding", this.customers);
  },
  methods: {
    ...mapActions("orders", [
      "getAllOrders",
      "getAllOrder",
      "activeSeenOrder",
      "getLTGOrders",
    ]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.searchData();
    },
    async searchData() {
      this.customers = [];
      let payload = {
        dateStart: formatDateISO(this.fromDate) + " 00:00",
        dateEnd: formatDateISO(this.toDate) + " 23:59",
        idDepartment: this.userInfo.department,
        activeSuccess: 3,
      };
      let { data } = await this.getLTGOrders(payload);
      this.title = "Phiếu làm thêm giờ ngày " + moment().format("DD-MM-YYYY");
      //lọc dữ liệu làm thêm giờ
      data[0].forEach(async (element) => {
      if (element.maNV != null) {
          var a = moment(element.hoursIn, "HH:mm");
          var b = moment(element.hoursOut, "HH:mm");
          let totalTime = Math.round((b.diff(a, "minutes") / 60) * 100) / 100;
          this.customers.push({
            ...element,
            totalTime: totalTime,
          });
        }
    });
    },

    customizeTaskCompletionText(cellInfo) {
      return `${cellInfo.valueText}%`;
    },
  },
};
</script>
<style>
#tasks {
  max-height: 540px;
}
#tasks .dx-treelist-rowsview td {
  vertical-align: middle;
}
</style>
