<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-6 top-title text-orange">
            Báo cáo danh sách xác nhận xem thông báo
          </div>

          <div
            class="col-6 top-title cursor-pointer text-orange"
            align="right"
            @click="showChooseDate = true"
          >
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
          </div>
        </div>
      </q-card-section>
      <q-separator spaced />

      <q-card-section>
        <DxDataGrid
          :data-source="dataSource"
          :word-wrap-enabled="true"
          :no-data-text="'Không có dữ liệu !'"
          :show-borders="true"
        >
          <DxHeaderFilter :visible="true" />
          <DxColumn
            data-field="CODE"
            caption="Thông báo số"
            cssClass="header-confirm-info"
          />
          <DxColumn
            data-field="ngayBanHanh"
            data-type="date"
            format="dd/MM/yyyy HH:mm:ssZ"
            caption="Ngày ban hành"
            cssClass="header-confirm-info"
          />
          <DxColumn
            data-field="veViec"
            caption="Về việc"
            cssClass="header-confirm-info"
          />
          <DxColumn
            data-field="DEPARTMENT_NAME"
            caption="Phòng ban"
            :width="280"
            cssClass="header-confirm-info"
          />
          <DxColumn
            data-field="ACCOUNT"
            caption="Mã nhân viên"
            :width="280"
            cssClass="header-confirm-info"
          />
          <DxColumn
            data-field="LAST_NAME"
            caption="Họ tên"
            :width="280"
            cssClass="header-confirm-info"
          />
          <DxColumn
            data-field="createdAt"
            cssClass="header-confirm-info"
            :width="280"
            caption="Thời gian xác nhận"
            data-type="date"
            format="dd/MM/yyyy HH:mm:ssZ"
          />
        </DxDataGrid>
      </q-card-section>
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
  DxHeaderFilter,
} from "devextreme-vue/data-grid";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../../ultils";
import DialogSelectDate from "../../components/commons/DialogSelectFromDateToDate";
import moment from "moment";
export default {
  name: "bao-cao-san-luong-may",
  components: {
    DxDataGrid,
    DxColumn,
    DxExport,
    DialogSelectDate,
    DxLookup,
    DxHeaderFilter,
  },
  data() {
    return {
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
  created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load();
  },
  methods: {
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
    async load() {
      let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
      };
      const data = await this.$store.dispatch(
        "NOTIFY/CONFIRM_INFORMATION",
        payload
      );
      this.dataSource = data.data;
      console.log(this.dataSource);
    },
  },
};
</script>

<style>

</style>