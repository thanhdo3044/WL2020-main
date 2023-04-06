<template>
  <q-page class="q-pa-sm">
    <div class="print-hide">
      <div class="row" style="background-color: #daf8e1">
        <div class="col-8 text-blue text-bold row" style="font-size: 18px">
          <div class="col-2">
            Phiếu xuất kho
          </div>
          <div class="col-3"><q-btn  color="primary" @click="AddGassPass">Hoàn thành phiếu</q-btn></div>
          <div class="col-3"><q-btn  color="primary" @click="$router.push({ path: `/phieu-xuat-kho-xem` })">Xem phiếu ra cổng</q-btn></div>
          <div class="col-3"><q-btn  color="deep-orange" @click="$router.push({ path: `/phieu-xuat-kho-tao` })">Tạo ngưới ký ra cổng</q-btn></div>
        </div>
        <div class="col-4 cursor-pointer text-blue text-bold" style="font-size: 18px" align="right"
          @click="showChooseDate = true">
          Ngày <span class="text-amber-14">{{ tuNgay }}</span>
        </div>
      </div>
    </div>
    <q-card class="my-card">
      <div class="row">
        <div class="col-2">
          <img src="~assets/logo.png" style="width: auto; height: auto;padding-left: 50px;" />
        </div>
        <div class="col-7">
          <h5 style="font-weight: bold; padding: 0px; margin-top: 50px;margin-bottom: -18px;text-transform: uppercase;">
            Công ty cổ phần woodsland
          </h5>
          <br />
          <label>Địa Chỉ: </label>
          <input type="text" v-model="diaChiCT" placeholder="Nhập địa chỉ" style="width: 500px" class="input-loction" />
          <br />
          <p style="margin-bottom: -18px;text-transform: uppercase;">ĐT:+84 435 840 122 - Fax: +84. 438 134 944</p>
          <br />
          <b>Webiste:<a href="www.woodsland.vn" style="color: black;"> www.woodsland.vn</a></b>
        </div>
        <div class="col-3">
          <div
            style="width:150px;height: 50px;border: 1px solid black;text-align: center;margin: 0 auto;margin-top: 50px; margin-bottom: 0px;">
            <label style="font-weight: bold;">BM-XK-02</label>
            <br />
            <label style="font-weight: bold;">Ban hành: 05.9.2022</label>
          </div>
        </div>
      </div>
      <div>
        <h4
          style="font-weight: bold; padding: 0px; margin-top: 30px;margin-bottom:  0px;text-transform: uppercase;text-align: center">
          LỆNH XUẤT HÀNG KIÊM PHIẾU RA CỔNG
        </h4>
        <p style="font-weight: bold; padding: 0px; margin-top: 0px;text-align: center">
          Số :<input v-model="so" type="text" class="input-loction" style="width: 132px;" />
          Ngày <input v-model="ngay" type="text" class="input-loction" style="width: 30px;" />
          Tháng <input v-model="thang" type="text" class="input-loction" style="width: 30px;" />
          Năm <input v-model="nam" type="text" class="input-loction" style="width: 45px;" />
        </p>
      </div>
      <div style="margin-top: 30px">
        <div class="row" style="margin: 5px;">
          <label style="font-weight: bold; padding-left: 100px;">Căn cứ vào hợp đồng hàng:</label>
          <input type="text" class="col-6 input-title" v-model="TenHopDong" />
        </div>
        <div class="row" style="margin: 5px;">
          <label style="font-weight: bold; padding-left: 100px;">Công ty ký hợp đồng với khách hàng:</label>
          <input type="text" class="col-6 input-title" v-model="TenKhachHang" />
        </div>
        <div class="row" style="margin: 5px;">
          <label style="font-weight: bold; padding-left: 100px;">Địa chỉ:</label>
          <input type="text" class="col-8 input-title" v-model="DiaChiaKH" />
        </div>
        <div class="row" style="margin: 5px;">
          <label style="font-weight: bold; padding-left: 100px;">Đề nghị xuất hàng theo chi tiết dưới đây:</label>
        </div>

      </div>
      <div>

        <div style="max-width: 90%;margin: 0 auto">
          <div class="row" style="margin: 5px;">

          </div>
          <DxDataGrid class="responstable" :data-source="dataTable" :allow-column-reordering="true" :show-borders="true"
            key-expr="ID" @row-inserted="Saved" @editing-start="EditRow" @row-updating="" @row-updated="EditRowUpdated"
            @row-removed="RemovedRow" @init-new-row="AddTable" @row-remove="DeleteRow">
            <DxPaging :enabled="true" />
            <DxEditing :allow-updating="true" :allow-deleting="true" :allow-adding="true" mode="row" />
            <DxColumn data-field="tenSP" caption="Tên sản phẩm" />
            <DxColumn data-field="quyCach" caption="Quy cách (mm)/ Mã sản phẩm" />
            <DxColumn data-field="dvt" caption="ĐVT" />
            <DxColumn data-field="lxh" caption="Theo LXH" data-type="number" />
            <DxColumn data-field="thucTe" caption="Thực tế" data-type="number" />
            <DxColumn data-field="ghiChu" caption="Ghi chú" />

          </DxDataGrid>
        </div>
      </div>
      <div class="row" style="margin-top:50px; text-align: center; ">
        <!-- <div class="col-3" style="padding-bottom: 120px;">
          <label style="font-weight: bold ;text-transform: uppercase;">Ban giám đốc</label>
        </div> -->
        <div class="col-4" v-for="(a, index) in dataChuKy" v-bind:key="index" style="margin-bottom: 90px;">
          <label style="font-weight: bold; text-transform: uppercase"> {{ a.tenBoPhan }}</label>
          <div>
            <!-- <div v-if="a.img != null"> -->
              <img v-bind:src="'../statics/' + a.img + '.png'" width="100" height="100" />

            <!-- </div>
            <div v-else style="height: 100px ; width: 100;"></div> -->
          </div>
          <div>
            <b>{{ a.taoPhieu }}</b>
          </div>
        </div>
      </div>
    </q-card>
    <DialogSelectDate :selectDate="chooseDate" :showChooseDate="showChooseDate" :cancelChooseDate="cancelChooseDate" />
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxButton,
  DxPaging,
  DxLookup,
} from "devextreme-vue/data-grid";
import {
  formatDateVN, formatDateISO,
  getFisrtDayOfMonth, showNotifySuccess, showNotifyError
} from "../ultils";

import img1 from "../statics/100281.png"

import DialogSelectDate from "../components/commons/DialogSelectFromDate";
import moment from "moment";
import { mapActions } from "vuex";


export default {
  components: {
    DialogSelectDate,
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxButton,
    DxPaging,
    DxLookup,
  },
  data() {
    return {
      fromDate: moment().format("YYYY-MM-DD"),
      toDate: moment().format("YYYY-MM-DD"),
      showChooseDate: false,
      datasource: [],
      dataTable: [],
      addRow: 0,

      diaChiCT: '',
      so: '',
      ngay: '',
      thang: '',
      nam: '',
      TenHopDong: '',
      TenKhachHang: '',
      DiaChiaKH: '',
      dataChuKy: [],
    };
  },
  created() {
    this.fromDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate());
    //  this.fromDate = getFisrtDayOfMonth(new Date());
    this.load()
  },
  methods: {
    ...mapActions("prod", ["GET_KYGUI"]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async AddGassPass() {
      var today = new Date();
      var time = moment(today).format("YYYY/MM/DD HH:mm:ss");
      const payload = {
        date: time,
        diaChiCT: this.diaChiCT,
        so: this.so,
        tenHopDong: this.TenHopDong,
        tenKhachHang: this.TenKhachHang,
        diaChiaKH: this.DiaChiaKH,
      }
      // console.log("du lieu tao bang", payload);
      const data = await this.$store.dispatch("production/POST_GATE_PASS", payload);
      showNotifySuccess();
      this.$router.go();

    },
    async RemovedRow(e) {
      const payload = {
        ID: e.data.ID,
      };
      // console.log("hien thhi xoa ", payload);
      const data = await this.$store.dispatch("production/DELETE_GATE_PASS", payload);
      // this.$router.go();
    },
    AddTable() { },
    async Saved(e) {
      var today = new Date();
      var time = moment(today).format("YYYY/MM/DD HH:mm:ss");
      const payload = {
        ID: e.data.ID,
        tenSP: e.data.tenSP,
        quyCach: e.data.quyCach,
        dvt: e.data.dvt,
        lxh: e.data.lxh,
        thucTe: e.data.thucTe,
        ghiChu: e.data.ghiChu,
        date: time,
        tabelId: this.so,
      };
      const data = await this.$store.dispatch("production/POST_GATE_PASS_TABLE", payload);

    },
    EditRow() { },
    async EditRowUpdated(e) {
      var today = new Date();
      var time = moment(today).format("YYYY/MM/DD HH:mm:ss");
      const payload = {
        ID: e.data.ID,
        tenSP: e.data.tenSP,
        quyCach: e.data.quyCach,
        dvt: e.data.dvt,
        lxh: e.data.lxh,
        thucTe: e.data.thucTe,
        ghiChu: e.data.ghiChu,
        date: time,
      };
      const data = await this.$store.dispatch("production/PUT_GATE_PASS_TABLE", payload);
    },
    DeleteRow() {
      // console.log("hien thi xoa du lieu thanh");
    },

    formatDate(value) {
      return moment(value).format("DD/MM/YYYY")
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      //  this.toDate = t;
      this.showChooseDate = false;
      this.load()
    },
    cancelChooseDate() {
      this.showChooseDate = false;
      this.load()
    },
    // changeDate() {
    //   this.toDate = moment(this.toDate).format("DDMMYYYY")
    //   this.load();
    //   this.showChooseDate = false
    // },
    async load() {
      //khoi tao dia chi lieu ket voi bang
      var today = new Date();
      this.ngay = moment(today).format("DD");
      this.thang = moment(today).format("MM")
      this.nam = moment(today).format("YYYY");
      this.so = "PRC" + this.nam + this.thang + moment(today).format("HH") + moment(today).format("mm") + moment(today).format("ss");

      //chu ky
      const dataAccout = await this.$store.dispatch("production/GET_GATE_PASS_CREATE_ACCOUNT");
      // console.log("hein hti thng tin chu ky", dataAccout);
      dataAccout.forEach(x => {
        this.dataChuKy.push({
          tenBoPhan: x.TENBOPHAN,
          img: x.ID,
          taoPhieu: x.TENNGUOITAOPHIEU
        })
      })
      console.log("hien thi data chu ky", this.dataChuKy);

      const data = await this.GET_KYGUI(formatDateISO(this.fromDate));
      this.datasource = data.data
      this.datasource = this.datasource.filter(f => f.ngayxuat != null)
      this.datasource.forEach(element => {
        element.ngayxuat = moment(element.ngayxuat).format("DD/MM/YYYY")
      });
      //  this.datasource = this.datasource.filter(f => formatDateVN(this.fromDate) == f.ngayxuat)
      for (let index = 0; index < this.datasource.length; index++) {
        this.datasource[index].stt = index + 1;
        this.datasource[index].dovitinh = 'Bộ';
      }
    },
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
  },
}
</script>

<style lang="scss">
.input-title {
  outline: none;
  margin-top: 1px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: transparent;
  background-color: transparent;
  border-bottom-style: dotted;
  margin-top: -5px;
}

.input-loction {
  outline: none;
  margin-top: 1px;
  border-color: transparent;
  background-color: transparent;
}

.input-table {
  outline: none;
  width: 100%;
  border-color: transparent;
  background-color: transparent;
}

.table-product>table {
  border-collapse: collapse;
  width: 100%;
}

.table-product>th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table-product>tr:hover {
  background-color: rgba(188, 220, 255, 0.61);
}

.table-nameproduct {
  width: 40%;
}

.table-note {
  width: 30%;
  text-align: center;
}

.tabel-specification {
  width: 12%;
}



/*

RESPONSTABLE 2.0 by jordyvanraaij
  Designed mobile first!

If you like this solution, you might also want to check out the 1.0 version:
  https://gist.github.com/jordyvanraaij/9069194

*/

// Default options for table style
$table-breakpoint: 480px;
$table-background-color: #FFF;
$table-text-color: #024457;
$table-outer-border: 1px solid #167F92;
$table-cell-border: 1px solid #D9E4E6;

// Extra options for table style (parse these arguments when including your mixin)
$table-border-radius: 10px;
$table-highlight-color: #EAF3F3;
$table-header-background-color: #167F92;
$table-header-text-color: #FFF;
$table-header-border: 1px solid #FFF;

// The Responstable mixin

@mixin responstable(
  $breakpoint: $table-breakpoint,
  $background-color: $table-background-color,
  $text-color: $table-text-color,
  $outer-border: $table-outer-border,
  $cell-border: $table-cell-border,
  $border-radius: none,
  $highlight-color: none,
  $header-background-color: $table-background-color,
  $header-text-color: $table-text-color,
  $header-border: $table-cell-border) {
  
  .responstable {
    margin: 1em 0;
    width: 100%;
    overflow: hidden;  
    background: $background-color;
    color: $text-color;
    border-radius: $border-radius;
    border: $outer-border;
  
    tr {
      border: $cell-border; 
      &:nth-child(odd) { // highlight the odd rows with a color
        background-color: $highlight-color;
      }  
    }
  
    th {
      display: none; // hide all the table header for mobile
      border: $header-border;
      background-color: $header-background-color;
      color: $header-text-color;
      padding: 1em;  
      &:first-child { // show the first table header for mobile
        display: table-cell;
        text-align: center;
      }
      &:nth-child(2) { // show the second table header but replace the content with the data-th from the markup for mobile
        display: table-cell;
        span {display:none;}
        &:after {content:attr(data-th);}
      }
      @media (min-width: $breakpoint) {
        &:nth-child(2) { // hide the data-th and show the normal header for tablet and desktop
          span {display: block;}
          &:after {display: none;}
        }
      }
    }
  
    td {
      display: block; // display the table data as one block for mobile
      word-wrap: break-word;
      max-width: 7em;
      &:first-child { 
        display: table-cell; // display the first one as a table cell (radio button) for mobile
        text-align: center;
        border-right: $cell-border;
      }
      @media (min-width: $breakpoint) {
        border: $cell-border;
      }
    }
  
    th, td {
      text-align: left;
      margin: .5em 1em;  
      @media (min-width: $breakpoint) {
        display: table-cell; // show the table as a normal table for tablet and desktop
        padding: 1em;
      }
    }  
  }    
}

// Include the mixin (with extra options as overrides)

@include responstable(
  $border-radius: $table-border-radius,
  $highlight-color: $table-highlight-color,
  $header-background-color: $table-header-background-color,
  $header-text-color: $table-header-text-color,
  $header-border: $table-header-border);

</style>