<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Thống kê chi tiết phiếu xin nghỉ việc
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
    <div class="q-ma-sm">
      <DxDataGrid
        :allow-column-reordering="true"
        :data-source="customers"
        :show-borders="true"
        :hover-state-enabled="true"
        :show-row-lines="true"
        :allow-column-resizing="true"
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
        <DxColumn data-field="selection" caption="Loại phiếu" width="100px" />
        <DxColumn
          data-field="selection"
          caption="Mã phép"
          cell-template="cellTemplateLoaiPhieu"
          width="50px"
        />
        <DxColumn data-field="dateStart" caption="Thời gian từ" />
        <DxColumn data-field="dateEnd" caption="Thời gian đến" />
        <DxColumn data-field="description" caption="Lý do" />
        <DxColumn data-field="status" caption="Trạng thái" />

        <DxColumn
          :group-index="0"
          caption="Phòng ban"
          data-field="department"
        />
        <DxColumn
          data-field="createdAt"
          cell-template="cellTemplateCreatedAt"
          caption="Ngày tạo phiếu"
          width="100"
        />
        <DxColumn data-field="successRequest" caption="Ngày được duyệt" />
        <DxColumn data-field="lastName" caption="Người duyệt" />

        <DxGroupPanel :visible="true" />
        <DxGrouping :auto-expand-all="autoExpandAll" />
        <DxPaging :page-size="1000" />
        <DxSearchPanel :visible="true" />
        <template #cellTemplateLoaiPhieu="{ data }">
          <a class="text-bold" v-if="data.value == 'Nghỉ phép'">P</a>
          <a class="text-bold" v-else-if="data.value == 'Nghỉ ốm'">O</a>
          <a
            class="text-bold"
            v-else-if="data.value == 'Nghỉ việc riêng có hưởng lương'"
            >R</a
          >
          <a class="text-bold" v-else-if="data.value == 'Xin nghỉ không lương'"
            >KL</a
          >
          <a class="text-bold" v-else-if="data.value == 'Xin nghỉ Thai sản'"
            >TS</a
          >
          <a class="text-bold" v-else>{{ data.value }}</a>
        </template>
        <template #cellTemplateCreatedAt="{ data }">
          <a>{{ moment(data.value).format("l") }}</a>
        </template>
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
  DxCheckBox,
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
    DialogSelectDate,
  },
  data() {
    return {
      autoExpandAll: true,
      customers: null,
      fromDate: null,
      toDate: null,
      showChooseDate: false,
      title: "",
    };
  },
  methods: {
    ...mapActions("orders", [
      "getAllOrders",
      "getAllOrder",
      "activeSeenOrder",
      "getXNVOrders",
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
      let payload = {
        dateStart: formatDateISO(this.fromDate) + " 00:00",
        dateEnd: formatDateISO(this.toDate) + " 23:59",
        idDepartment: this.userInfo.department,
        activeSuccess: 2,
      };
      const data = await this.getXNVOrders(payload);
      this.customers = data.data[0];
    },
  },
  async created() {
    this.toDate = new Date();
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.title = "Phiếu xin nghỉ việc ngày " + moment().format("DD-MM-YYYY");
    let payload = {
      dateStart: formatDateISO(this.fromDate) + " 00:00",
      dateEnd: formatDateISO(this.toDate) + " 23:59",
      idDepartment: this.userInfo.department,
      activeSuccess: 2,
    };
    const data = await this.getXNVOrders(payload);
    this.customers = data.data[0];
    console.log("this.customers", this.customers);
  },
  computed: {
    ...mapGetters("orders", ["orders"]),
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("ordersm", ["getAccountById"]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
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
