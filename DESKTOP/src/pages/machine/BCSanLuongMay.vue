<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <!-- <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-6 top-title text-orange">Báo cáo sản lượng máy</div>
          <div
            class="col-6 top-title cursor-pointer text-orange"
            align="right"
            @click="showChooseDate = true"
          >
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
          </div>
        </div>
      </q-card-section>
      <q-separator spaced /> -->
      <q-card class="my-card">
        <div class="row" style="background-color: #daf8e1">
          <div class="col-10 text-blue text-bold" style="font-size: 18px">
            Báo cáo sản lượng máy - <span class="text-amber-14">{{ factory.label }}</span>
          </div>
          <div class="col-2 cursor-pointer text-blue text-bold" style="font-size: 18px" align="right"
            @click="showChooseDate = true">
            Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
            <span class="text-amber-14">{{ denNgay }}</span>
          </div>
        </div>
        <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
          <div class="col-8">
            <div class="row">
              <div class="col-2 col-md-2" v-for="(option, index) in options" :key="index">
                <q-radio dense @input="onChange" v-model="factory" :val="option" :label="option.label"
                  style="border-radius: 5px; font-size: 13px" class="text-weight-bold" color="amber-6" />
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
        <div class="col-8">
          <div class="row">
            <div class="col-2 col-md-2" v-for="(option, index) in options" :key="index">
              <q-radio dense @input="onChange" v-model="factory" :val="option" :label="option.label"
                style="border-radius: 5px; font-size: 13px" class="text-weight-bold" color="amber-6" />
            </div>
          </div>
        </div>
      </div> -->
      </q-card>
      <q-card-section>
        <DxDataGrid :data-source="dataSource" :word-wrap-enabled="true" :no-data-text="'Không có dữ liệu !'"
          :show-borders="true">
          <DxExport :enabled="true" :allow-export-selected-data="true" />
          <DxColumn data-field="nhaMay" caption="Nhà Máy" width="100" />
          <DxColumn data-field="MACHINE_NAME" width="150" caption="Tên máy" />
          <DxColumn data-field="NAME" width="300" caption="Chạy loại hàng" />
          <DxColumn data-field="StartTime" width="200" format="dd/MM/yyyy HH:mm:ssZ" data-type="date"
            caption="Thời gian bắt đầu" />
          <DxColumn data-field="EndTime" width="200" format="dd/MM/yyyy HH:mm:ssZ" data-type="date"
            caption="Thời gian kết thúc" />
          <DxColumn data-field="tgLam" alignment="center" format="##0.##" width="100" caption="Tổng số giờ máy chạy" />
          <DxColumn data-field="actualOutput" width="100" caption="Số lượng(T)" />
          <DxColumn data-field="M3" format="##0.##" width="100" caption="Khối lượng (M3)" />
          <DxColumn data-field="Md" caption="Tổng MD" width="100" />
          <DxColumn data-field="M3_h" caption="Tỷ lệ M3/ giờ" width="100" />
          <DxColumn data-field="Md_h" format="##" width="100" caption="Tỷ lệ MD/ giờ" />
          <DxColumn data-field="tyLeMd" format="#0%" width="100" caption="Tỷ lệ %/ lý thuyết (MD)" />
        </DxDataGrid>
      </q-card-section>
    </q-card>
    <DialogSelectDate :selectDate="chooseDate" :showChooseDate="showChooseDate" :cancelChooseDate="cancelChooseDate" />
  </q-page>
</template>

<script>
import { DxDataGrid, DxColumn, DxExport } from "devextreme-vue/data-grid";
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
  },
  data() {
    return {
      dataSource: [],
      fromDate: null,
      toDate: null,
      showChooseDate: false,
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
      factory: {
        // label: "Nhà máy CBG Thuận Hưng",
        // id: 100000,
      },
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
        "machine/GET_REPORT_SAN_LUONG_MAY",
        payload
      );
      this.dataSource = data.data;
      this.dataSource = this.dataSource.filter(f => f.factoryId == this.factory.id)
    },
    onChange() {
      this.load();
    },
  },
};
</script>

<style>

</style>