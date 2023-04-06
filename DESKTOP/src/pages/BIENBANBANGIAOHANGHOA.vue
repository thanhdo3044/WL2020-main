<template>
  <q-page class="q-pa-sm">
    <div class="print-hide">
      <div class="row" style="background-color: #daf8e1">
        <div class="col-8 text-blue text-bold" style="font-size: 18px">
          Biên bản bàn giao hàng hóa
        </div>
        <div class="col-4 cursor-pointer text-blue text-bold" style="font-size: 18px" align="right"
          @click="showChooseDate = true">
          Ngày <span class="text-amber-14">{{ toDate }}</span>
        </div>
      </div>
    </div>
    <q-card class="my-card">
      <div class="row">
        <div class="col-1"></div>
        <div class="col-10">
          <div class="row">
            <div class="col-2" style="border: 1px solid black; margin-top: 20px;">
              <img src="~assets/logo.png" style="width: auto; height: auto;" />
            </div>
            <div class="col-8" style="border: 1px solid black; margin-top: 20px;">
              <div style="text-align: center;border-bottom: 1px solid black;">
                <h5 style="margin: 0;"><i>Quy trình quản lý kho thành phẩm</i></h5>
              </div>
              <div
                style="font-weight: bold; padding: 0px; margin-top: 30px;margin-bottom:  0px;text-transform: uppercase;text-align: center">
                <h4 style="margin: 0;">Biên bản bàn giao hàng hóa</h4>
              </div>
              <div style="text-align: center;">
                <h5 style="margin: 0; font-weight: 400;"><i>Kiêm phiếu nhập kho</i></h5>
              </div>
            </div>
            <div class="col-2" style="border: 1px solid black; margin-top: 20px;">
              <div style="text-align: center;">
                <label style="font-weight: bold;"><i>QT20/ BM NK01</i></label>
                <br />
                <label style="font-weight: bold;"><i>Ngày BH: 22/10/2022</i></label>
              </div>
            </div>
          </div>
          <div style="margin-top: 30px">
            <label style="font-weight: bold; ;text-transform: uppercase">Bên giao:
              ..................................................................</label>
            <label style="font-weight: bold; ;text-transform: uppercase">Bộ phận:
              ..................................................................</label>
            <br />
            <label style="font-weight: bold; ;text-transform: uppercase">Bên nhận:
              ..................................................................</label>
            <label style="font-weight: bold; ;text-transform: uppercase">Bộ phận:
              ..................................................................</label>
            <br />
            <br />
            <br />
            <label style="font-weight: bold;">Căn cứ vào Báo cáo sản lượng ngày {{ ngay }}
              hai bên cùng tiến hành giao nhận thành phẩm đóng gói đủ điều kiện nhập kho theo chi tiết dưới đây :
            </label>
          </div>
          <div style="padding-top: 50px;">
            <q-card style="margin: 0 auto">
              <DxDataGrid id="gridContainer" :data-source="datasource" key-expr="stt" :show-borders="true"
                :show-row-lines="true" :word-wrap-enabled="true">
                <DxColumn :width="70" data-field="stt" caption="STT" />
                <DxColumn :width="200" data-field="masp" caption="Mã sản phẩm" />
                <DxColumn :width="300" data-field="tensp" caption="Tên sản phẩm" />
                <DxColumn :width="200" data-field="dovitinh" caption="Đơn vị tính" />
                <DxColumn :width="200" data-field="sl" caption="Số lượng thực xuất ra cổng" />
                <DxColumn data-field="ghichu" caption="Ghi chú" />
              </DxDataGrid>
            </q-card>
          </div>
          <div class="row" style="margin-top:50px; text-align: center">
            <div class="col-6" style="padding-bottom: 120px;">
              Ngày ....... tháng ....... năm .......
              <br>
              <label style="font-weight: bold ;text-transform: uppercase;">Đại diện bên giao</label>
            </div>
            <div class="col-6" style="padding-bottom: 120px;">
              Ngày ....... tháng ....... năm .......
              <br>
              <label style="font-weight: bold; text-transform: uppercase">Đại diện bên nhận</label>
            </div>
          </div>
        </div>
        <div class="col-1"></div>
      </div>

    </q-card>
    <q-dialog v-model="showChooseDate" class="q-pa-md">
      <div>
        <div>
          <q-date v-model="toDate" title="Chọn ngày" simple today-btn mask="MM-DD-YYYY" />
        </div>
        <div class="q-pa-md q-gutter-sm" align="right" style="background-color: #fff;">
          <q-btn color="primary" label="Đồng ý" @click="changeDate" />
          <q-btn color="red" label="Hủy" @click="showChooseDate = false" />
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
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
  },
  data() {
    return {
      fromDate: null,
      toDate: null,
      showChooseDate: false,
      datasource: [],
      ngay: "..............."
    };
  },
  created() {
    this.toDate = this.formatDate(new Date());
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load()
  },
  methods: {
    ...mapActions("prod", ["getBienBanGiaoNhanHangHoa"]),

    formatDate(value) {
      return moment(value).format("MM/DD/YYYY")
    },
    changeDate() {
      this.toDate = moment(this.toDate).format("MM/DD/YYYY")
      this.load();
      this.showChooseDate = false
    },
    async load() {
      let daungay = null;
      let cuoingay = null;
      this.ngay = this.toDate
      this.ngay = moment(this.toDate).format("DD/MM/YYYY")
      daungay = this.toDate + ' 00:00:00'
      cuoingay = this.toDate + ' 23:59:59'
      let payload = {
        daungay: daungay,
        cuoingay: cuoingay,
      }
      const data = await this.getBienBanGiaoNhanHangHoa(payload);
      this.datasource = data.data
      this.datasource.forEach(element => {
        element.ngayxuat = moment(element.ngayxuat).format("MM/DD/YYYY")
      });
      for (let index = 0; index < this.datasource.length; index++) {
        this.datasource[index].stt = index + 1;
        this.datasource[index].dovitinh = 'Bộ';
      }
    }
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.toDate);
    },
  },
}
</script>

<style>

</style>