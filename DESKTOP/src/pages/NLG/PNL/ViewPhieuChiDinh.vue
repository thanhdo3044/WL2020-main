<template>
  <q-page>
    <q-card class="my-card">
      <table id="tableHead" width="100%">
        <thead class="w-100">
          <tr>
            <td style="border-right-style: none">
              <img
                style="margin: 0px"
                src="https://app.woodsland.com.vn:2002/img/logo.06aa324e.png"
                alt="Graphic1"
                width="100"
                height="80"
                data-cke-widget-upcasted="1"
                data-cke-widget-keep-attr="0"
                data-widget="image"
                class="cke_widget_element p-2"
              />
            </td>
            <td colspan="3" class="text-center" style="border-left-style: none">
              <span class="p-2">SỔ TAY COC</span>
            </td>
            <td class="text-right" rowspan="2" colspan="2">
              <pre>
                  BM-COC-16
                  Ngày BH: 29/9/2016
                  Lần BH: 03
                </pre
              >
            </td>
          </tr>
          <tr>
            <th colspan="4">
              <strong> PHIẾU CHỈ ĐỊNH XUẤT NGUYÊN VẬT LIỆU - INDOOR </strong>
            </th>
          </tr>
          <tr></tr>
          <tr class="text-center">
            <td>Tuần SX</td>
            <th>{{ week }}</th>
            <td>KHÁCH HÀNG</td>
            <td>{{ khachhang.label }}</td>
            <td class="text-left">Số LSX</td>
            <td>{{ number ? number : "" }}</td>
          </tr>
          <tr>
            <td colspan="4" class="text-center">
              Nhà máy: <strong>{{ nhamay }}</strong> Loại gỗ: Acacia Magium
              Trạng thái MT: FSC 100%
            </td>
            <td>Tổng KL (m3)</td>
            <td class="text-right">{{ formatnumber(tongKL) }}</td>
          </tr>
          <tr>
            <th colspan="6">KHỐI LƯỢNG PHÔI XUẤT THỰC TẾ TRONG TUẦN</th>
          </tr>
        </thead>
      </table>
    </q-card>
    <div class="row print-hide" v-if="lan != 'none'">
      <span style="margin-top:10px;color:#f6b024">Phiếu chỉ định bổ sung:</span>
      <q-radio color="amber" @input="duyetbs" v-for="(value, index) in listlan" :key="index" v-model="lan" :val="value" :label="value" />
      <!-- <q-select
      
          v-if="solan"
          class="col-2 q-mb-sm q-ml-sm"
          @input="duyetbs"
          outlined
          v-model="lan"
          :options="listlan"
          label="Lần bổ sung"
        /> -->
    </div>
    <q-card class="my-card">
      <DxDataGrid
        :data-source="historys"
        :show-borders="true"
        :show-column-lines="true"
        :allow-column-resizing="true"
        :show-row-lines="true"
        :word-wrap-enabled="true"
      >
        <DxFilterRow :visible="false" />
        <DxScrolling mode="infinite" />
        <DxExport
          :enabled="true"
          :allow-export-selected-data="false"
          :file-name="'phiếu chỉ định'"
        />

        <DxColumn
          data-field="sp"
          caption="Sẩn phảm"
          :visible="false"
          sort-order="asc"
        />
        <DxColumn
          data-field="tensp"
          caption="Chi tiết"
          width="350"
        />
        <DxColumn
          data-field="tenqc"
          caption="Nhóm Qui Cách"
          width="240"
        >
        </DxColumn>
        <DxColumn
          data-field="PHOI"
          caption="Loại phôi"
          width="80"
        >
          <DxLookup :data-source="phoi" display-expr="name" value-expr="code" />
        </DxColumn>
        <DxColumn
          data-field="keHoach"
          caption="Nhu cầu cần"
          alignment="center"
          format="#,##0.####"
          width="100"
        />
        <DxColumn
          data-field="HESO"
          caption="Hệ số"
          alignment="center"
          width="100"
        />

        <DxColumn
          data-field="capgo"
          caption="KL(SL) cấp"
          alignment="center"
          format="#,##0.####"
          width="100"
        />
        <DxColumn
          data-field="DVT"
          caption="Đơn vị tính"
          alignment="center"
          width="100"
        />

        <DxColumn
          data-field="GHICHU"
          caption="Ghi chú"
          alignment="center"
        />

        <DxColumn
          data-field="MALOGO"
          caption="Mã lô gỗ"
          alignment="center"
        />

        <DxSummary>
          <DxTotalItem
            column="tensp"
            summary-type="count"
            value-format="fixedpoint"
            display-format="Tổng cộng : "
          />
          <DxTotalItem
            column="keHoach"
            summary-type="sum"
            value-format="###0.####"
            display-format="{0}"
          />
          <DxTotalItem
            column="capgo"
            summary-type="sum"
            value-format="###0.####"
            display-format="{0}"
          />
        </DxSummary>
      </DxDataGrid>

      <div class="q-pa-md doc-container" style="margin-top: 30px">
        <div class="row justify-end">
          <div class="col-4 text-center">
            <br />
            <b>Trưởng Phòng NLG</b><br />

            <img
              v-if="this.duyet"
              v-bind:src="'/statics/101674.png'"
              alt="Graphic1"
              width="180"
              height="auto"
            />
            <br /><br />
            Hà Đăng Chỉnh
          </div>
          <div class="col-4 text-center">
            Ngày {{ ngay }} tháng {{ thang }} năm {{ namcd }} <br />
            <b>Người lập phiếu</b><br />
            <img
              v-if="this.duyet"
              v-bind:src="'/statics/' + idnguoitao + '.png'"
              alt="Graphic1"
              width="180"
              height="auto"
            />
            <br /><br />
            {{ nguoitao }}
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { roundNumber } from "../../../ultils";
import {
  DxDataGrid,
  DxGrouping,
  DxTotalItem,
  DxGroupPanel,
  DxSummary,
  DxGroupItem,
  DxEditing,
  DxExport,
  DxHeaderFilter,
  DxColumn,
  DxScrolling,
  DxFilterRow,
  DxSearchPanel,
  DxLookup,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxTotalItem,
    DxEditing,
    DxDataGrid,
    DxGrouping,
    DxGroupPanel,
    DxSummary,
    DxGroupItem,
    DxExport,
    DxHeaderFilter,
    DxScrolling,
    DxFilterRow,
    DxSearchPanel,
    DxLookup,
    DxColumn,
  },
  data() {
    return {
      khachhang: {
        label: "IKEA",
      },
      week: null,
      number: null,
      nhamay: null,
      sodvt: [],
      tongKL: null,
      listlan: [],
      solan: null,
      historys: [],
      phoi: null,
      duyet: false,
      ngay: null,
      thang: null,
      namcd: null,
      duyet: null,
      nguoitao: null,
    };
  },
  created() {
    this.number = this.$route.params.number;
    this.landvt = this.$route.params.dvt;
    this.lan = this.$route.params.lan;
    console.log("number", this.number);
    console.log("landvt", this.landvt);
    console.log("lan", this.lan);
    this.loadHistory();
  },
  methods: {
    formatnumber(d) {
      return roundNumber(d, 4);
    },
    async loadHistory() {
      this.historys = [];
      this.tongKL = 0;
      this.week = 0;
      this.duyet = ``;

      let data = null;
      const payload = {
        number: this.number,
      };
      if (this.lan == "none") {
        payload.bx = 0;
        data = await this.$store.dispatch("nlg/GET_PHIEU_CHI_DINH", payload);
        this.historys = data.data.filter(d => d.DVT.trim() == this.landvt);
        console.log("this.landvt",this.landvt);
      } else {
        this.duyetbs();
      }
      console.log("this.historys", this.historys);
      this.bosung = data.data;
      this.nguoitao = data.data[0].nguoitao;
      this.idnguoitao = data.data[0].idNguoiTao;
      this.week = data.data[0].week;
      let factory = data.data[0].factoryId;
      if (factory == 100000) {
        this.nhamay = "Nhà máy CBG Thuận Hưng";
      } else if (factory == 100004) {
        this.nhamay == "Nhà máy CBG Yên Sơn 1B";
      } else {
        this.nhamay == "Nhà máy CBG Thái Bình";
      }
      if (this.historys.length > 0) {
        if (this.historys[0].approvedByAccount != null) {
          this.duyet = `đã duyệt`;
          this.showEdit = false;
          // this.ngay = this.historys[0].approvedAt.getday()
          let month = new Date(this.historys[0].approvedAt);
          this.thang = month.getMonth() + 1;
          this.ngay = month.getDate();
          this.namcd = month.getFullYear();
        }
        this.tongKL = 0;
        for (let i = 0; i < this.historys.length; i++) {
          this.tongKL = this.tongKL + this.historys[i].capgo;
        }
      }
      console.log("tongKL:", this.tongKL);
    },
    async duyetbs() {
      this.historys = [];
      this.duyet = "";
      this.showdvt = false;
      this.showEdit = true;

      const payload = {
        number: this.number,
      };
      const data = await this.$store.dispatch(
        "nlg/GET_PHIEU_CHI_DINH_BS",
        payload
      );
      this.solan = data.data[0].BX;
      data.data.filter((v, i, a) => a.indexOf(v) === i);
      data.data.forEach((e) => {
        this.listlan.push(e.BX);
      });
      this.listlan = this.listlan.filter((v, i, a) => a.indexOf(v) === i);
      this.listlan = this.listlan.sort();
      if (this.lan == "") this.lan = this.listlan[0];
      data.data.forEach((d) => {
        if (d.BX == this.lan) {
          this.historys.push(d);
        }
      });
      //  this.landvt = this.historys[0].DVT
      if (this.historys[0].approvedByAccount != null) {
        this.duyet = `đã duyệt`;
        this.showEdit = false;
        // this.ngay = this.historys[0].approvedAt.getday()
        let month = new Date(this.historys[0].approvedAt);
        this.thang = month.getMonth() + 1;
        this.ngay = month.getDate();
      }
      this.tongKL = 0;
      for (let i = 0; i < this.historys.length; i++) {
        this.tongKL = this.tongKL + this.historys[i].capgo;
      }
    },
  },
};
</script>

<style>
#tableHead tr,
th,
td {
  border: 2px solid black;
}
table {
  border-collapse: collapse;
  table-layout: fixed;
}
</style>