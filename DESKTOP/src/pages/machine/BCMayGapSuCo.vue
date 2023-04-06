<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-6 top-title text-orange">
            Báo cáo chi tiết thời gian máy chết
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
        <div class="q-pa-md" style="max-width: 300px">
          <div class="q-gutter-md">
            <q-select
              v-model="factory"
              :options="options"
              @input="onChange"
              label="Chọn Nhà Máy"
            />
          </div>
        </div>
        <DxDataGrid
          :data-source="dataSource"
          :word-wrap-enabled="true"
          :no-data-text="'Không có dữ liệu !'"
          :show-borders="true"
        >
          <DxExport :enabled="true" :allow-export-selected-data="true" />
          <DxColumn data-field="NAME" caption="Tên máy" :width="380" />
          <DxColumn data-field="TYPE" caption="Kiểu lỗi">
            <DxLookup
              :data-source="types"
              display-expr="label"
              value-expr="value"
            />
          </DxColumn>
          <DxColumn data-field="DESCRIPTION" caption="Nguyên nhân" />
          <DxColumn data-field="PLAN_MAINTAIN" caption="Giải pháp" />
          <DxColumn
            data-field="START_TIME"
            caption="Thời gian bắt đầu"
            data-type="date"
            format="dd/MM/yyyy HH:mm:ssZ"
          />
          <DxColumn
            data-field="END_TIME"
            caption="Thời gian kết thúc"
            data-type="date"
            format="dd/MM/yyyy HH:mm:ssZ"
          />
          <DxColumn data-field="DURATION_TIME" caption="Tổng số giờ máy dừng chạy" />
          <DxColumn data-field="LAST_NAME" caption="Người báo lỗi" />
          <DxColumn data-field="IMPORTANT_FACTOR" caption="Hệ số quan trọng" />
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
  },
  data() {
    return {
      dataSource: [],
      factory: {
        label: "Nhà máy CBG Thuận Hưng",
        id: 100000,
      },
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          id: 100000,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          id: 100004,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          id: 100005,
        },
      ],
      types: [
        {
          label: "Sự cố",
          value: "trouble",
        },
        {
          label: "Bảo dưỡng",
          value: "maintenance",
        },
      ],
      fromDate: null,
      toDate: null,
      showChooseDate: false,
      grafts: [
        {
          label: "Khác",
          value: null,
        },
        {
          label: "Kín",
          value: "K",
        },
        {
          label: "Hở",
          value: "H",
        },
      ],
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
    onChange() {
      this.load();
    },
    async load() {
      let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
        factoryId: this.factory.id,
      };
      const data = await this.$store.dispatch(
        "machine/GET_REPORT_SU_CO_MAY",
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