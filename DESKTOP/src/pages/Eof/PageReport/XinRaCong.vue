<template>
  <q-page class="q-pa-sm">
  <div class="row" style="background-color: #daf8e1">
      <div class="col-6 text-blue text-bold" style="font-size: 18px">
        Thống kê chi tiết phiếu xin ra cổng
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
    <div class="q-ma-lg">
      <DxDataGrid
        :allow-column-reordering="true"
        :data-source="customers"
        :show-borders="true"
        :hover-state-enabled="true"
        :show-row-lines="true"
      >
        <DxExport :enabled="true" :allow-export-selected-data="true" />
        <DxFilterRow :visible="true" />
        <DxFilterPanel :visible="true" />
        <DxHeaderFilter :visible="true" />
        <DxColumn data-field="maNV" caption="Mã nhân viên" />
        <DxColumn data-field="fullName" caption="Họ và Tên" />
        <DxColumn data-field="dateStart" caption="Thời gian từ" />
        <DxColumn data-field="dateEnd" caption="Thời gian đến" />
        <DxColumn data-field="description" caption="Lý do" />
         <DxColumn data-field="successRequest" caption="Trưởng BP phê duyệt" />
        <DxColumn data-field="timeVTAccept" caption="BV xác nhận ra" />
        <DxColumn data-field="timeVTAcceptEnd" caption="BV xác nhận vào" />
        <DxColumn data-field="status" caption="Trạng thái" />
        <DxColumn
          :group-index="0"
          caption="Phòng ban"
          data-field="department"
        />

        <DxGroupPanel :visible="true" />
        <DxGrouping :auto-expand-all="autoExpandAll" />
        <DxPaging :page-size="1000" />
        <DxSearchPanel :visible="true" />
      </DxDataGrid>

      <div class="options">
        <div class="caption">Tùy chọn</div>
        <div class="option">
          <DxCheckBox
            v-model:value="autoExpandAll"
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
    DialogSelectDate
  },
  data() {
    return {
      autoExpandAll: true,
      customers: [],
      dataBiding: [],
      fromDate: null,
      toDate: null,
      showChooseDate: false,
    };
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
  methods: {
    ...mapActions("orders", ["getXRCOrders"]),
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
      const payload = {
         dateStart: formatDateISO(this.fromDate) + " 00:00",
        dateEnd: formatDateISO(this.toDate) + " 23:59",
      };
      let { data } = await this.getXRCOrders(payload);
      this.customers = data[0];
    },
  },
  created() {
    this.toDate = new Date();
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.searchData();
  },
};
</script>
<style scoped>
.options {
  padding: 20px;
  margin-top: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}
</style>
