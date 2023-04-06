<template>
  <q-page>
    <div class="text-h6 text-primary" style="padding-left: 5px">
      Phê duyệt phiếu chỉ định cấp gỗ - {{ idDepartment.label }}
    </div>
    <div>
      <div class="row print-hide">
        <q-input
          class="col-1"
          @input="loadGrid"
          outlined
          label-color="orange"
          v-model.number="year"
          type="number"
          label="Năm"
          dense
        />
        <q-input
          class="col-1"
          @input="loadGrid"
          outlined
          label-color="orange"
          v-model.number="week"
          type="number"
          label="Tuần"
          dense
        />
        <q-select
          class="col-2"
          @input="loadGrid"
          outlined
          label-color="orange"
          v-model="idDepartment"
          :options="options"
          label="Chọn nhà máy"
          dense
        />
        <q-select
          dense
          label-color="orange"
          class="col-2"
          @input="loadHistory"
          outlined
          v-model="number"
          :options="listNumber"
          label="Lệnh sản xuất"
        />
        <q-select
          dense
          label-color="orange"
          class="col-1"
          outlined
          v-model="khachhang"
          :options="khachhangs"
          label="khách hàng"
        />
        <div class="col-3">
          <q-radio @input="onChange" class="text-orange" v-model="type" val="chua-duyet" label="Biên bản chưa duyệt" />
        <q-radio @input="onChange" class="text-positive" style="margin-right: 30px;" v-model="type" val="da-duyet" label="Biên bản đã duyệt" /> 
        </div>
        <div class="col-1" align="center">
          <q-btn
            v-if="
              $store.state.base.userInfo.id == 101674 ||
              $store.state.base.userInfo.id == 100400
            "
            color="positive"
            style="height: 42px"
            :disable="!showEdit"
            label="Phê duyệt"
            @click="confirmTrave = true"
          />
        </div>

        <div class="col-1" align="center">
          <q-btn
            v-if="
              $store.state.base.userInfo.id == 101674 ||
              $store.state.base.userInfo.id == 100400 ||
              $store.state.base.userInfo.id == 101750 ||
              $store.state.base.userInfo.id == 101733 ||
              $store.state.base.userInfo.id == 101976 ||
              $store.state.base.userInfo.id == 105353
            "
            color="red"
            :disable="!showEdit"
            style="height: 42px"
            label="Từ chối"
            @click="confirmphieu = true"
          />
        </div>
        <div class="col-1" align="right">
          <q-checkbox
            v-if="
             ( $store.state.base.userInfo.id == 102089 ||
              $store.state.base.userInfo.id == 100400 ||
              $store.state.base.userInfo.id == 101750 ||
              $store.state.base.userInfo.id == 101733 ||
              $store.state.base.userInfo.id == 101976 ||
              $store.state.base.userInfo.id == 105353||
              $store.state.base.userInfo.id == 108173||
              $store.state.base.userInfo.id == 101975) && type == 'chua-duyet'
            "
            color="blue"
            v-show="xoapcd"
             v-model="selection"
            style="height: 42px"
            label="Sửa phiếu chỉ định"
            @click="duyetbs"
          />
        </div>

        <q-select
          v-if="showdvt"
          class="col-1 q-mb-sm q-ml-sm"
          @input="loadHistory"
          outlined
          v-model="landvt"
          :options="sodvt"
          label="Phiếu theo ĐVT"
        />
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
    </div>

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
            <td>{{ number ? number.number : "" }}</td>
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

    <!-- <q-card-section>
        <div class="row">
          <div class="col-10 top-title">
            Phê duyệt hệ số cấp gỗ
          </div>
          <q-btn
            color="primary"
            icon="assignment_return"
            :disable="!showEdit"
            label="Tạo phiếu chỉ định"
            @click="confirmTrave = true"
          />
        
        </div>
       
      </q-card-section> -->
    <div v-if="!checkAccount" class="row q-mt-md">
      <q-card class="my-card">
        <DxDataGrid
          :data-source="historys"
          :show-borders="true"
          :show-column-lines="true"
          :allow-column-resizing="true"
          :show-row-lines="true"
          :word-wrap-enabled="true"
          @row-removed="del"
          @row-updated="update"
          @selection-changed="onSelectionChanged"
        >
          <DxEditing
            :allow-updating="false"
            :allow-deleting="selection"
            mode="popup"
          />

          <DxFilterRow :visible="false" />
          <DxScrolling mode="infinite" />
          <!-- <DxGroupPanel :visible="true"/>
            <DxGrouping :auto-expand-all="true"/> -->
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
            css-class="mauPCDHSCG"
          />
          <DxColumn
            data-field="tensp"
            caption="Chi tiết"
            width="350"
            css-class="mauPCDHSCG"
          />
          <DxColumn
            data-field="tenqc"
            caption="Nhóm Qui Cách"
            width="240"
            css-class="mauPCDHSCG"
          >
          </DxColumn>
          <DxColumn
            data-field="PHOI"
            caption="Loại phôi"
            width="80"
            css-class="mauPCDHSCG"
          >
            <DxLookup
              :data-source="phoi"
              display-expr="name"
              value-expr="code"
            />
          </DxColumn>
          <DxColumn
            data-field="keHoach"
            caption="Nhu cầu cần"
            alignment="center"
            format="#,##0.####"
            width="100"
            css-class="mauPCDHSCG"
          />
          <DxColumn
            data-field="HESO"
            caption="Hệ số"
            alignment="center"
            width="100"
            css-class="mauPCDHSCG"
          />

          <DxColumn
            data-field="capgo"
            caption="KL(SL) cấp"
            alignment="center"
            format="#,##0.####"
            width="100"
            css-class="mauPCDHSCG"
          />
          <DxColumn
            data-field="DVT"
            caption="Đơn vị tính"
            alignment="center"
            width="100"
            css-class="mauPCDHSCG"
          />

          <DxColumn
            data-field="GHICHU"
            caption="Ghi chú"
            alignment="center"
            css-class="mauPCDHSCG"
          />

          <DxColumn
            data-field="MALOGO"
            caption="Mã lô gỗ"
            alignment="center"
            css-class="mauPCDHSCG"
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
    </div>
    <div v-if="checkAccount" class="row q-mt-md">
      <q-card class="col-10 my-card">
        <DxDataGrid
          :data-source="historys"
          :show-borders="true"
          :show-column-lines="true"
          :allow-column-resizing="true"
          :show-row-lines="true"
          :word-wrap-enabled="true"
          @row-removed="del"
          @row-updated="update"
          @selection-changed="onSelectionChanged"
        >
          <DxEditing
            :allow-updating="false"
            :allow-deleting="xoapcd"
            mode="popup"
          />

          <DxFilterRow :visible="false" />
          <DxScrolling mode="infinite" />

          <DxColumn
            data-field="sp"
            caption="Sẩn phảm"
            :visible="false"
            sort-order="asc"
            css-class="mauPCDHSCG"
          />
          <DxColumn
            data-field="tensp"
            caption="Chi tiết"
            width="350"
            css-class="mauPCDHSCG"
          />
          <DxColumn
            data-field="tenqc"
            caption="Nhóm Qui Cách"
            width="240"
            css-class="mauPCDHSCG"
          >
          </DxColumn>
          <DxColumn
            data-field="keHoach"
            caption="Nhu cầu cần"
            alignment="center"
            format="#,##0.####"
            width="100"
            css-class="mauPCDHSCG"
          />
          <DxColumn
            data-field="HESO"
            caption="Hệ số"
            alignment="center"
            width="100"
            css-class="mauPCDHSCG"
          />

          <DxColumn
            data-field="capgo"
            caption="KL cấp"
            alignment="center"
            format="#,##0.####"
            width="100"
            css-class="mauPCDHSCG"
          />

          <DxColumn
            data-field="GHICHU"
            caption="Ghi chú"
            alignment="center"
            css-class="mauPCDHSCG"
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
      <div class="col-2 bg-white print-hide">
        <q-list bordered separator>
          <q-toolbar class="bg-warning text-white shadow-2">
            <q-toolbar-title>Phiếu chỉ định chưa duyệt</q-toolbar-title>
          </q-toolbar>
          <q-item clickable v-ripple>
            <q-item-section>Phiếu chỉ định</q-item-section>
            <q-item-section side>Bổ sung</q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            v-for="(value, index) of listNumberByApprovedAt"
            v-bind:key="index"
          >
            <q-item-section>{{ value.number }}</q-item-section>
            <q-item-section side>{{ value.BX }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <q-dialog v-model="confirmTrave" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title">
              Xác nhận phê duyệt phiếu chỉ định
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="pheduyet"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmphieu" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title">Xác nhận hủy phiếu chỉ định</div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="xoa"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { DxNumberBox } from "devextreme-vue/number-box";
import SelectBox from "../../../components/commons/SelectBoxInt";
import SelectNcc from "../../../components/NLG/SelectBoxNcc";
import SelectNhomQuiCach from "../../../components/commons/SelectBoxInt";
import SelectThang from "../../../components/commons/SelectBoxInt";
import SelectNam from "../../../components/commons/SelectBoxInt";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
  roundNumber,
  getWeekNumber,
  showLoadingIos,
  closeLoading,
} from "../../../ultils";
import {
  showNotifySuccess,
  showNotifyError,
  showNotifyValidate,
  thangs,
  nams,
} from "../../../ultils";
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
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    SelectNcc,
    SelectBox,
    SelectNhomQuiCach,
    DxNumberBox,
    DxTotalItem,
    SelectThang,
    SelectNam,
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
      chuyen_slkh: 0,
      chuyen_nhomqc: null,
      chuyen_ncc: null,
      nhan_ncc: null,
      khconlai: 0,
      xoapcd:false,
       selection: false,
      id: 0,
      phoi: [
        { code: "phoitho", name: "Phôi thô" },
         { code: "phoithocom3", name: "Phôi thô com 3" },
         { code: "phoithocom12", name: "Phôi thô com 1&2" },
        { code: "phoi2M", name: "Phôi 2M" },
        { code: "phoi4M", name: "Phôi 4M" },
        { code: "CXL", name: "Phôi CXL" },
      ],
      checkAccount: false,
      ngay: "",
      thang: "",
      listNumber: [],
      listlan: [],
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102299,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102299,
          code: "TB",
        },
      ],
      khachhang: {
        label: "IKEA",
      },
      khachhangs: [
        {
          label: "IKEA",
        },
        {
          label: "WALMART",
        },
        {
          label: "VINGSON",
        },
        {
          label: "THE HOME DEPOT",
        },
        {
          label: "SEDO",
        },
      ],
      mydsncc: [],
      chuyen_thang: null,
      chuyen_nam: null,
      dsNCC: [],
      confirmTrave: false,
      confirmphieu: false,
      nhomquicachs: [],
      nhomkhos: [],
      ncc: null,
      tongKL: 0,
      week: "",
      nguoitao: "",
      idnguoitao: "",
      year: null,
      dupplicateNcc: [],
      nhomqc: null,
      nhomkho: null,
      slkh: 0,
      solan: "",
      type: 'chua-duyet',
      lan: "",
      namcd: "",
      bosung: [],
      sodvt: [],
      showdvt: false,
      landvt: "",
      number: {
        number: "",
        label: "",
      },
      showEdit: true,
      showEdit1: false,
      dataTrave: [],
      fix: null,
      nhap_year: null,
      nhap_month: null,
      thangs: thangs,
      nams: nams,
      idDepartment: {
        label: "Nhà máy CBG Thuận Hưng",
        factoryId: 100000,
        code: "TH",
      },
      nhamay: null,
      history_thang: null,
      history_nam: null,
      historys: [],
      congdoans: [],
      items: [],
      duyet: ``,
      trangthai: [
        { code: null, name: "chưa duyệt" },
        { code: !null, name: "đã duyệt" },
      ],
      congdoan: null,
      item: null,
      sl: 0,
      chonkhochuyen: null,
      dataSource: [],
      showLeave: false,
      answer: false,
      listNumberByApprovedAt: [],
    };
  },
  created() {
    const today = new Date();
    const currentMonth = today.getMonth();
    this.nhap_month = currentMonth + 1;
    this.chuyen_thang = this.nhap_month;
    this.history_thang = currentMonth + 1;
    const currentYear = today.getFullYear();
    this.year = currentYear;
    this.week = getWeekNumber(today);
    this.nhap_year = currentYear;
    this.chuyen_nam = currentYear;
    this.history_nam = currentYear;
    if (this.$store.state.base.userInfo.id == 101676) {
      this.getNumberByApproved();
      this.checkAccount = true;
    }
      if(this.$store.state.base.userInfo.id == 101976 || this.$store.state.base.userInfo.id == 101750 || this.$store.state.base.userInfo.id == 101733 
      || this.$store.state.base.userInfo.id == 105353 || this.$store.state.base.userInfo.id == 102089|| this.$store.state.base.userInfo.id == 108173
      || this.$store.state.base.userInfo.id == 101975)
      this.xoapcd = true
    Promise.all([this.loadGroupQuiCach(), this.loadItem()]);
   console.log( this.xoapcd)
  },
  methods: {
    ...mapActions("messages", ["sendNotificationMail"]),
    async addPlan() {
      if (this.nhomqc) {
        const payload = {
          groupCode: this.nhomqc,

          //  month:this.nhap_month,
          //  year:this.nhap_year,
          ITEM_ID: this.item.value,
          HESO: this.slkh,
          createBy: this.$store.state.base.userInfo.account,
        };
        const data = await this.$store.dispatch("nlg/ADD_HE_SO", payload);
        if (data.meta.success) {
          await this.loadHistory();
          showNotifySuccess();
          this.slkh = 0;
        } else {
          showNotifyError();
        }
      } else {
        showNotifyValidate();
      }
      this.loadHistory();
    },
    async loadHistory() {
      this.showEdit1 = false;
      this.showEdit = true;
      this.showdvt = false;
      this.historys = [];
      this.tongKL = 0;
      this.solan = "";
      this.lan = "";
      this.listlan = [];
      this.sodvt = [];
      this.duyet = ``;
      const payload = {
        number: this.number.number,
        bx: this.number.BX ? this.number.BX : 0
      };
      const data = await this.$store.dispatch(
        "nlg/GET_PHIEU_CHI_DINH",
        payload
      );
      this.historys = data.data;
      this.bosung = data.data;
      this.nguoitao = data.data[0].nguoitao;
      this.idnguoitao = data.data[0].idNguoiTao;


      if (this.historys.length > 0) {
        if (this.historys[0].approvedByAccount != null) {
          this.duyet = `đã duyệt`;
          this.showEdit = false;
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
    },
    async pheduyet() {
      const payload = {
        number: this.number.number,
        createBy: this.$store.state.base.userInfo.id,
        DVT: this.landvt,
      };
      const data = await this.$store.dispatch("nlg/PHE_DUYET_PHIEU", payload);
      if (data.meta.success) {
        if (this.$store.state.base.userInfo.id == 101674) {
          this.getNumberByApproved();
        }
        showNotifySuccess();
        console.log("BX:", this.historys[0]);
        if (this.historys[0].BX != null && this.historys[0].BX != "") {
          this.historys = [];
          this.duyetbs();
        } else {
          this.historys = [];
          this.loadHistory();
        }
        if (this.idDepartment.code == "TH") {
          this.sendMailViewToPCD("duyhungwl@gmail.com", 100374);
          this.sendMailViewToPCD("chinhhd@woodsland.com.vn", 101674);
          this.sendMailViewToPCD("dungwl13@gmail.com", 100304);
          this.sendMailViewToPCD("hquanvp@gmail.com", 100355);
          this.sendMailViewToPCD("trangnt@woodsland.vn", 101679);
          this.sendMailViewToPCD("hientv@woodsland.com.vn", 101733);
          this.sendMailViewToPCD("trangnt@woodsland.vn", 101641);
          this.sendMailViewToPCD("kiemspwl@gmail.com", 101587);
          this.sendMailViewToPCD("vuhang120784@gmail.com", 100340);
          this.sendMailViewToPCD("hienttt@woodsland.com.vn", 101672);
          this.sendMailViewToPCD("nguyenthinhan2891984@gmail.com", 100275);
          this.sendMailViewToPCD("halewl.90@gmail.com", 101633);
          this.sendMailViewToPCD("letrungkien.huong@gmail.com", 100291);
          this.sendMailViewToPCD("quocduy1708@gmail.com", 101662);
          this.sendMailViewToPCD("nguyenhung20011992@gmail.com", 100307);
          this.sendMailViewToPCD("thanhpt.woodsland@gmail.com", 102050);
          this.sendMailViewToPCD("tavanphuong1996@gmail.com", 101750);
          this.sendMailViewToPCD("ngocntb.woodsland@gmail.com", 101783);
          this.sendMailViewToPCD("tuantt@woodsland.com.vn", 101651);
        }
        if(this.idDepartment.code == "TB"){
          this.sendMailViewToPCD("chinhhd@woodsland.com.vn", 101674);
          this.sendMailViewToPCD("hientv@woodsland.com.vn", 101733);
          this.sendMailViewToPCD("nguyenvanchungtq2016@gmail.com", 101932);
          this.sendMailViewToPCD("Nguyenngoctoan2019tq@.com.vn", 101943);
          this.sendMailViewToPCD("dominhquywltq@gmail.com", 101948);
          this.sendMailViewToPCD("tranthithuy27101987@gmail.com", 101939);
          this.sendMailViewToPCD("Thudat.vn@gmail.com ", 105353);
          this.sendMailViewToPCD("nguyenvanhungtq1979@gmail.com", 101944);
          this.sendMailViewToPCD("maiph@woodsland.vn", 101966);
          this.sendMailViewToPCD("ducdai.gbb@gmail.com", 101931);
          this.sendMailViewToPCD("thanhlientq@gmail.com ", 102047);
          this.sendMailViewToPCD("tuantt@woodsland.com.vn", 101651);
        }
        if(this.idDepartment.code == "YS1A" || this.idDepartment.code == "YS1B"){
          this.sendMailViewToPCD("chinhhd@woodsland.com.vn", 101674);
          this.sendMailViewToPCD("hientv@woodsland.com.vn", 101733);
          this.sendMailViewToPCD("Maihiensytq@gmai.com.vn", 101861);
          this.sendMailViewToPCD("manhlan078@gmail.com", 101878);
          this.sendMailViewToPCD("Chungdunghoa1988@gmail.com", 101985);
          this.sendMailViewToPCD("hongtham91@gmail.com", 101860);
          this.sendMailViewToPCD("Vanhtl.wltq@gmail.com", 101963);
          this.sendMailViewToPCD("duongquanwl@gmail.com", 101856);
          this.sendMailViewToPCD("nguyenthingattq2@gmail.com", 101986);
          this.sendMailViewToPCD("minhpn.wltq@gmail.com", 101665);
          
          this.sendMailViewToPCD("lathikimhoan.hus.bg@gmail.com", 101975);
          this.sendMailViewToPCD("Ntx020488@gmail.com", 101858);
          this.sendMailViewToPCD("tuantt@woodsland.com.vn", 101651);
        }
      } else {
        showNotifyError();
      }
    },
    async sendMailViewToPCD(mail, accountId) {
      let baseUrl = null;
      if (process.env.PROD) {
        baseUrl = `https://app.woodsland.com.vn:2002/#/view-phieu-chi-dinh/${this.number.number}/${this.landvt ? this.landvt.trim() : 'M3'}/${this.lan ? this.lan : 'none' }`;
      } else {
        baseUrl = `http://localhost:5000/#/view-phieu-chi-dinh/${this.number.number}/${this.landvt ? this.landvt.trim() : 'M3'}/${this.lan ? this.lan : 'none' }`;
      }
      let payloadMail = {
        baseUrl: baseUrl,
        email: mail,
        accountId: this.$store.state.base.userInfo.id,
        toAccountId: accountId,
        subject: `Có phiếu chỉ định ${this.lan ? 'bổ xung lần '+ this.lan : 'mới'}: ${this.number.number} vừa được duyệt`,
        title: "Mời bạn vào đây để xem chi tiết !",
        dataBody: ``,
      };
      await this.sendNotificationMail(payloadMail);
    },
    async duyetbs() {
      this.historys = [];
      this.duyet = "";
      this.showdvt = false;
      this.showEdit = true;

      const payload = {
        number: this.number.number,
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
    async getNumberByApproved() {
      const dataNumberByApproved = await this.$store.dispatch(
        "nlg/GET_NUMBER_CHUA_PHE_DUYET"
      );
      this.listNumberByApprovedAt = dataNumberByApproved.data;
    },
    async xoa() {
      const payload = {
        number: this.number.number,
      };
      const data = await this.$store.dispatch(
        "nlg/XOA_PHE_DUYET_PHIEU",
        payload
      );
      if (data.meta.success) {
        showNotifySuccess();
        this.loadHistory();
      } else {
        showNotifyError();
      }
    },
    onSelectionChanged({ selectedRowsData }) {
      this.idSelect = selectedRowsData[0].ID;
      this.showEdit = true;
      this.dataTrave = selectedRowsData;
      console.log("nhóm:", this.dataTrave);
    },
    formatnumber(d) {
      return roundNumber(d, 4);
    },
    // async loadNhaCungCap(){
    //    const data = await this.$store.dispatch('nlg/GET_DS_NHA_CUNG_CAP')
    //         let converrtData = []
    //         data.data.forEach(element => {

    //            element.name2 =  element.name
    //             converrtData.push(element)
    //         })
    //         this.dsNCC = converrtData

    // },
    async del(e) {
      console.log("ID:", e.data.ID);
      const payload = {
        id: e.data.ID,
      };
     const data3 = await this.$store.dispatch("nlg/XOA_CHI_TIET_PCD", payload);
      if (data3.meta.success) {
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
    async onChange(){
      this.duyet = ''
      this.loadGrid();
      if (this.type == 'da-duyet') this.selection = false
    },
    async loadGrid() {
      this.number = null;
      this.historys = null;
      this.listNumber = [];
      this.nhamay = this.idDepartment.label;
      if (this.idDepartment.code == "TH") this.fa = 100000;

      if (this.idDepartment.code == "YS1A") this.fa = 100003;
      if (this.idDepartment.code == "YS1B") this.fa = 100004;
      if (this.idDepartment.code == "TB") this.fa = 100005;
      const payload = {
        week: this.week,
        year: this.year,
        factoryId: this.fa,
      };

      // let dataPivort = [];
      const data = await this.$store.dispatch("prod/GET_HE_SO_LSX_2", payload);
      if(this.type == "da-duyet"){
        this.listNumber = data.data.filter( d => d.approvedByAccount != null)
      }else{
        this.listNumber = data.data.filter( d => d.approvedByAccount == null)
      }
    },

    async update(e) {
      console.log(e.data);
      const payload = {
        ID: e.data.ID,

        quantity: e.data.PLANQTY,

        FIX: e.data.FIX,
      };
      const data = await this.$store.dispatch("nlg/UPDATE_KHO", payload);
      // console.log(e)
      if (data.meta.success) {
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
    async loadGroupQuiCach() {
      const duppp = [];
      const data = await this.$store.dispatch("nlg/GET_GROUP_QUI_CACH");
      data.data.forEach((e) => {
        duppp.push({
          // text: e.name,
          value: (e.name4 = e.name),
        });
      });
      this.dupplicateNcc = duppp;

      this.nhomquicachs = data.data;
    },
    //     async loadkho(){
    //        const duppp = []
    //          const data = await this.$store.dispatch("production/ACTION_FETCH_ITEMS", {
    //     factoryId: 100000,
    //   });
    //         data.forEach(e=>{
    //             this.nhomkhos.push({
    //                 value: e.name3 = e.name,

    //             })
    //         })

    //     },
    async loadItem() {
      const data = await this.$store.dispatch("production/ACTION_FETCH_ITEMS", {
        factoryId: 100000,
      });
      data.forEach((d) => {
        const itemNameConvert = `[${d.code}] ${d.name} (${d.height}*${d.width}*${d.length})`;
        this.items.push({
          label: itemNameConvert,
          value: d.id,
          unit: d.unit,
        });
      });
      this.itemDupplicate = this.items;
    },
    searchItem(val, update) {
      let itemDupplicate = [];
      if (val === "") {
        update(() => {
          this.items = this.itemDupplicate;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.items = this.itemDupplicate.filter((v) => {
          const quicach = v.label.toString().toLowerCase();
          if (quicach.indexOf(needle) > -1) {
            return v;
          }
        });
      });
    },
    chonNhomQuiCach(e) {
      this.nhomqc = e.value;
    },
    chonNhomkho(e) {
      this.chonkho = e.value;
    },
    changeslkh(e) {
      this.slkh = e.value;
    },
    changesfix(e) {
      this.fix = e.value;
    },
    chonNam(e) {
      this.nhap_year = e.value;
    },
    chonThang(e) {
      this.nhap_month = e.value;
    },

    // chonNamHistory(e){
    //     this.history_nam = e.value
    //     this.loadHistory()
    // },
    // chonThangHistory(e){
    //     this.history_thang = e.value
    //     this.loadHistory()
    // },
  },
};
</script>


<style  type="text/css">
#tableHead tr,
th,
td {
  border: 2px solid black;
}
table {
  border-collapse: collapse;
  table-layout: fixed;
}
thead {
  width: 100%;
}
.mauPCDHSCG {
  border: 1px solid !important;
  background-color: white;
  color: black;
}
</style>