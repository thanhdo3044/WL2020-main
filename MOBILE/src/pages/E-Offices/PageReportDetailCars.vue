<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary text-orange">
        <div class="row text-h6 text-orange">
          <div class="col-md-6 top-title text-orange">
            Báo cáo Chi tiết lịch đặt xe đi công tác
          </div>
          <div
            class="col-md-6 top-title cursor-pointer text-orange"
            align="right"
            @click="showChooseDate = true"
          >
            Từ {{ tuNgay }} đến {{ denNgay }}
          </div>
        </div>
      </q-card-section>
      <q-separator inset />
      <!-- {{ dataTable.data }} -->
      <q-card-section>
        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
              :data-source="dataTable.data"
              :columns="columns"
              :show-borders="true"
              :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
              :show-column-lines="true"
              :allow-column-resizing="true"
            >
              <DxExport
                :enabled="true"
                :allow-export-selected-data="false"
                :file-name="
                  'Báo cáo chi tiết lịch đặt xe từ ngày ' +
                    tuNgay +
                    ' đến ngày ' +
                    denNgay
                "
              />
              <DxHeaderFilter :visible="true" />
              <DxGroupPanel
                :visible="true"
                :empty-panel-text="
                  'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'
                "
              />
              <DxGrouping :auto-expand-all="true" />
              <DxSearchPanel
                :visible="true"
                :placeholder="'Tìm kiếm'"
                :width="400"
              />
              <DxSummary>
                <DxGroupItem
                  column="Số giờ"
                  summary-type="sum"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="' {0}'"
                  :value-format="'######0.####'"
                />
              </DxSummary>
            </DxDataGrid>
          </div>
        </div>
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
import DialogSelectDate from "../../components/commons/DialogSelectFromDateToDate";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxExport,
  DxHeaderFilter,
  DxSummary,
  DxGroupItem
} from "devextreme-vue/data-grid";
import { DxDateBox } from "devextreme-vue";
import { mapGetters, mapActions } from "vuex";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../../ultils";
import axios from "axios";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxDateBox,
    DxExport,
    DialogSelectDate,
    DxHeaderFilter,
    DxSummary,
    DxGroupItem
  },
  data() {
    return {
      dataTable: [],
      showChooseDate: false,
      dataSource: [],
      columns: [
        {
          dataField: "ID",
          caption: "MÃ NV"
        },
        {
          dataField: "LAST_NAME",
          caption: "Họ Tên",
          sortOrder: "desc"
        },
        {
          dataField: "POSITION",
          caption: "Chức vụ"
        },
        {
          dataField: "NAME",
          caption: "Loại xe"
        },
        {
          dataField: "CODE",
          caption: "Biển số"
        },
        {
          dataField: "seats",
          caption: "Chỗ ngồi",
          width: "100",
          align: "center"
        },
        {
          dataField: "fromLocation",
          caption: "Địa điểm xuất phát",
          width: "200"
        },
        {
          dataField: "toLocation",
          caption: "Địa điểm đến",
          width: "200"
        },
        {
          dataField: "dateStart",
          caption: "Ngày/giờ bắt đầu",
          width: "150"
        },
        {
          dataField: "dateEnd",
          caption: "Ngày/giờ kết thúc",
          width: "150"
        },
        {
          dataField: "HOUR",
          caption: "Số giờ"
        },
        {
          dataField: "day",
          caption: "Số ngày"
        }
      ],
      fromDate: null,
      toDate: null
    };
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
    ...mapGetters("base", ["myFactoryInfor"])
  },
  async created() {
    this.toDate = new Date();
    this.fromDate = getFisrtDayOfMonth(new Date());
    await axios
      .get("http://localhost:2003/api/v3/cars/reportDetailCarAll")
      .then(res => (this.dataTable = res.data))
      .catch(err => console.log("err", err));
    console.log("data", this.dataTable.data);
    this.loadData();
  },
  methods: {
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.load();
    },
    async loadData() {
      await axios
        .get("http://localhost:2003/api/v3/cars/reportDetailCarAll")
        .then(res => (this.dataTable = res.data))
        .catch(err => console.log("err", err));
      console.log("data", this.dataTable.data);
      this.$q.notify({
        message: `Đã tải xong  dữ liệu!`
      });
    },
    async searchData() {
      await axios({
        method: "GET",
        url: `http://localhost:2003/api/v3/cars/searchCarDetailAll?fromYear=${this.dateApp.slice(
          0,
          4
        )}&toYear=${this.dateEnd.slice(0, 4)}&fromDay=${this.dateApp.slice(
          8,
          10
        )}&toDay=${this.dateEnd.slice(8, 10)}&fromMonth=${this.dateApp.slice(
          5,
          7
        )}&toMonth=${this.dateEnd.slice(5, 7)}`
      })
        .then(res => (this.dataTable = res.data))
        .catch(err => console.log("err", err));
      console.log("data", this.dataTable.data);
    },
    async load() {
      this.$q.loading.show();
      //   const myFactoryId = this.myFactoryInfor.id;
      //   if (myFactoryId) {
      //     let payload = {
      //       fromDate: formatDateISO(this.fromDate),
      //       toDate: formatDateISO(this.toDate),
      //     };
      //     const data = await this.$store.dispatch(
      //       "prod/GET_REPORT_DATE",
      //       payload
      //     );
      //     this.dataSource = data.data;
      //   }
      console.log("fromDate", this.fromDate);
      console.log("todate", this.toDate);
      await axios({
        method: "GET",
        url: `http://localhost:2003/api/v3/cars/searchCarDetailAll?fromYear=${this.fromDate.slice(
          0,
          4
        )}&toYear=${this.toDate.slice(0, 4)}&fromDay=${this.fromDate.slice(
          8,
          10
        )}&toDay=${this.toDate.slice(8, 10)}&fromMonth=${this.fromDate.slice(
          5,
          7
        )}&toMonth=${this.toDate.slice(5, 7)}`
      })
        .then(res => (this.dataTable = res.data))
        .catch(err => console.log("err", err));
      console.log("data", this.dataTable.data);
      this.$q.loading.hide();
      this.$q.notify({
        message: `Đã tải xong  dữ liệu từ ngày ${this.tuNgay} đến ngày ${this.denNgay}!`
      });
    }
  }
};
</script>

<style>
</style>