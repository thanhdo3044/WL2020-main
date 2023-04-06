<template>
  <q-page class="q-pa-sm">
    <div class="print-hide">
      <div class="row" style="background-color: #daf8e1">
        <div class="col-8 text-blue text-bold" style="font-size: 18px">
          Báo cáo nhập - xuất - tồn thành phẩm
        </div>
        <div class="col-4 cursor-pointer text-blue text-bold" style="font-size: 18px" align="right"
          @click="showChooseDate = true">
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
          <span class="text-amber-14">{{ denNgay }}</span>
        </div>
      </div>
    </div>
    <q-card class="my-card">
      <div class="row">
        <div class="col-1"></div>
        <div class="col-10">
          <div class="row">
            <div class="col-2" style="border: 1px solid black; margin-top: 20px; text-align: center;">
              <img src="~assets/logo.png" style="width: auto; height: auto;" />
            </div>
            <div class="col-8" style="border: 1px solid black; margin-top: 20px;">
              <div style="text-align: center;border-bottom: 1px solid black;">
                <h5 style="margin: 0;"><i>Quy trình quản lý kho thành phẩm</i></h5>
              </div>
              <div
                style="font-weight: bold; padding: 0px; margin-top: 30px;margin-bottom:  0px;text-transform: uppercase;text-align: center">
                <h4 style="margin: 0;">Báo cáo nhập - xuất - tồn thành phẩm</h4>
              </div>
            </div>
            <div class="col-2" style="border: 1px solid black; margin-top: 20px;">
              <div style="text-align: center;">
                <label style="font-weight: bold;"><i>QT20/ BM05</i></label>
                <br />
                <label style="font-weight: bold;"><i>Ngày BH: 22/10/2022</i></label>
              </div>
            </div>
          </div>
          <div style="margin-top: 30px; text-align: center;">
            <label style="font-weight: bold; ">Kho:
              ..........................................</label>
            <br />
            <label style="">Từ ngày ........ đến ngày ........ tháng ........ năm ........ </label>
          </div>
          <div style="padding-top: 50px;">
            <q-card style="margin: 0 auto">
              <DxDataGrid id="gridContainer" :data-source="datasource" key-expr="stt" :show-borders="true"
                :show-row-lines="true" :word-wrap-enabled="true">
                <DxPaging :page-size="10000" />
                <DxColumn :width="50" data-field="stt" caption="STT" />
                <DxColumn data-field="masp" caption="Mã sản phẩm" />
                <DxColumn data-field="tensp" caption="Tên sản phẩm" />
                <DxColumn data-field="donvitinh" caption="Đơn vị tính" />
                <DxColumn data-field="tondauky" caption="Tồn đầu kỳ" />
                <DxColumn data-field="slnhap" caption="Nhập sản xuất" />
                <DxColumn data-field="slxuat" caption="Xuất bán" />
                <DxColumn data-field="toncuoiky" caption="Tồn cuối kỳ" />
                <DxColumn data-field="ghichu" caption="Ghi chú" />
              </DxDataGrid>
            </q-card>
          </div>
          <div class="row" style="margin-top:50px; text-align: center">
            <div class="col-6" style="padding-bottom: 120px;">
              <label style="font-weight: bold ;">Phụ trách bộ phận</label>
              <br />
              <label><i>(Ký, ghi rõ họ tên)</i></label>
            </div>
            <div class="col-6" style="padding-bottom: 120px;">
              <label style="font-weight: bold ;">Thủ kho</label>
              <br />
              <label><i>(Ký, ghi rõ họ tên)</i></label>
            </div>
          </div>
        </div>
        <div class="col-1"></div>
      </div>

    </q-card>
    <DialogSelectDate :selectDate="chooseDate" :showChooseDate="showChooseDate" :cancelChooseDate="cancelChooseDate" />
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging
} from "devextreme-vue/data-grid";
import {
  formatDateVN,
  getFisrtDayOfMonth
} from "../ultils";
import DialogSelectDate from "../components/commons/DialogSelectFromDateToDate";
import moment from "moment";
import { mapActions } from "vuex";
export default {
  components: {
    DialogSelectDate,
    DxDataGrid,
    DxColumn,
    DxPaging
  },
  data() {
    return {
      fromDate: null,
      toDate: null,
      showChooseDate: false,
      datasource: [],
    };
  },
  created() {
    this.toDate = this.formatDate(new Date());
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load();
  },
  methods: {
    ...mapActions("prod", ["getBCNHAPXUATTONTHANHPHAM"]),

    formatDate(value) {
      return moment(value).format("MM/DD/YYYY")
    },
    changeDate() {
      this.toDate = moment(this.toDate).format("MM/DD/YYYY")
      this.load();
      this.showChooseDate = false
    },
    async chooseDate(f, t) {
      this.chonngay = true
      this.fromDate = f;
      this.toDate = t;
      this.load()
      this.showChooseDate = false;
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async load() {
      let payload = {
        tuNgay: moment(this.fromDate).format("MM/DD/YYYY"),
        denNgay: moment(this.toDate).format("MM/DD/YYYY"),
      }
      const data = await this.getBCNHAPXUATTONTHANHPHAM(payload)
      this.datasource = data.data
      for (let index = 0; index < this.datasource.length; index++) {
        this.datasource[index].stt = index + 1;
      }
    }
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
}
</script>

<style>

</style>