<template>
  <q-page class="q-pa-md">
    <div class="row print-hide">
      <q-input
        class="col-2 q-ml-sm"
        @input="loadGrid"
        outlined
        v-model.number="year"
        type="number"
        label="Năm"
      />
      <q-input
        class="col-2 q-ml-sm"
        @input="loadGrid"
        outlined
        v-model.number="week"
        type="number"
        label="Tuần"
      />
      <q-select
        class="col-2 q-ml-sm"
        @input="loadGrid"
        outlined
        v-model="idDepartment"
        :options="options"
        label="Chọn nhà máy"
      />
      <q-select
        class="col-2 q-mb-sm q-ml-sm"
        @input="loadHistory"
        outlined
        v-model="number"
        :options="listNumber"
        label="Lệnh sản xuất"
      />

      <q-btn
        color="primary"
        icon="assignment_return"
        label="Xuất gỗ"
        @click="confirmphieu = true"
      />
      <!-- <DateBoxNgayNhapKho
        :ngaynhapkho="ngaynhapkho"
        :onChange="eventChangeNgayNhapKho"
      />
      &emsp; &emsp; &emsp; -->
      <q-btn
        color="red"
        icon="assignment_return"
        :disable="!showEdit1"
        label="Phiếu chỉ định bổ sung"
        @click="duyetbs"
      />
      <q-select
        v-if="solan"
        class="col-2 q-mb-sm q-ml-sm"
        @input="duyetbs"
        outlined
        v-model="lan"
        :options="listlan"
        label="Lần bổ sung"
      />
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
            <td>IKEA</td>
            <td class="text-left">Số LSX</td>
            <td>{{ number }}</td>
          </tr>
          <tr>
            <td colspan="4" class="text-center">
              Nhà máy: <strong>Thuận Hưng</strong> Loại gỗ: Acacia Magium Trạng
              thái MT: FSC 100%
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

    <div class="row q-mt-md">
      <q-card class="my-card">
        <DxDataGrid
          id="gridContainer"
          :data-source="historys"
          :show-borders="true"
          :column-auto-width="true"
          :show-column-lines="true"
          class="mau"
          :allow-column-reordering="true"
          :show-row-lines="true"
          :word-wrap-enabled="true"
          @row-updating="rowUpdating"
          @selection-changed="onSelectionChanged"
         
        >
          <DxEditing :allow-updating="true" mode="cell" />
          <DxGroupPanel :visible="true" />
          <DxGrouping :auto-expand-all="true" />
          <DxHeaderFilter :visible="true" />
          <DxFilterRow :visible="false" />
          <DxScrolling mode="infinite" />
           <DxExport :enabled="true" :allow-export-selected-data="false" :file-name="
                'Dữ liệu sản xuất chi tiết từ ngày ' +
                tuNgay +
                ' đến ngày ' +
                denNgay
              " />
          <!-- <DxSorting mode="none" /> -->

          <DxColumn
            data-field="tensp"
            caption="Chi tiết"
            width="320"
            :group-index="0"
          />
          <DxColumn
            data-field="tenqc"
            caption="Nhóm Qui Cách"
            width="400"
            css-class="mauXGTL"
          />
          <DxColumn data-field="DAY" caption="Cao" width="60" css-class="mauXGTL" />
          <DxColumn
            data-field="RONG"
            caption="Rộng"
            width="60"
            css-class="mauXGTL"
          />
          <DxColumn data-field="DAI" caption="Dài" width="60" css-class="mauXGTL" />
          <DxColumn
            data-field="PHOI"
            caption="Loại phôi"
            width="120"
            css-class="mauXGTL"
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
            width="90"
            css-class="mauXGTL"
          />
          <DxColumn
            data-field="HESO"
            caption="Hệ số"
            alignment="center"
            width="80"
            css-class="mauXGTL"
          />

          <DxColumn
            data-field="capgo"
            caption="KL/SL cấp"
            alignment="center"
            format="#,##0.####"
            width="90"
            css-class="mauXGTL"
          />
          <DxColumn
            data-field="DVT"
            caption="ĐVT"
            alignment="center"
            format="#,##0.####"
            width="90"
            css-class="mauXGTL"
          />
          <DxColumn
            data-field="capgoT"
            caption="Số thanh cấp tối đa"
            alignment="center"
            format="#,##0.####"
            width="90"
            css-class="mauXGTL"
            :calculate-cell-value="calculatecapgoT"
          />
          <DxColumn
            caption="SL cấp thực tế"
            data-field="THANH"
            alignment="center"
            width="100"
            css-class="mauXGTL"
          />
          <DxColumn
            caption="KL cấp thực tế"
            data-field="TonTH"
            alignment="center"
            width="100"
            format="#,##0.####"
            css-class="mauXGTL"
            :calculate-cell-value="calculateTongThanh"
          />

          <DxColumn
            caption="KL đã cấp"
            data-field="KL"
            width="100"
            alignment="center"
            css-class="mauXGTL"
          />
           <DxColumn
            caption="Tồn kho LĐ YS"
            data-field="TON_DAU_KYYS"
            width="100"
            alignment="center"
            css-class="mauXGTL"
            format="###,##0.####"
            :visible = khoys
          />
               <DxColumn
            caption="Tồn kho sau sấy YS"
            data-field="TON_DAU_KY_SAY_YS"
            width="100"
            alignment="center"
            css-class="mauXGTL"
            format="###,##0.####"
            :visible = khoys
          />
           <DxColumn
            caption="Tồn kho LĐ TB"
            data-field="TON_DAU_KYTB"
            width="100"
            alignment="center"
            css-class="mauXGTL"
            format="###,##0.####"
               :visible = khotb
          />
           <DxColumn
            caption="Tồn kho sau sấy TB"
            data-field="TON_DAU_KY_SAY_TB"
            width="100"
            alignment="center"
            css-class="mauXGTL"
            format="###,##0.####"
               :visible = khotb
          />
          <DxColumn
            caption="Lựa đạt"
            data-field="luadat"
            alignment="center"
            width="100"
            css-class="mauXGTL"
          >
            <DxLookup
              :data-source="dalua"
              display-expr="label"
              value-expr="id"
            />
          </DxColumn>
          <DxColumn
            caption="Công đoạn nhận"
            data-field="noiden"
            alignment="center"
            width="160"
            css-class="mauXGTL"
          >
            <DxLookup
              :data-source="congdoannhan"
              display-expr="label"
              value-expr="id"
            />
          </DxColumn>
          <DxColumn data-field="GHICHU" caption="Ghi chú" css-class="mauXGTL" />

          <DxSummary>
            <DxTotalItem
              column="tenqc"
              summary-type="count"
              value-format="fixedpoint"
              display-format="Tổng cộng : "
            />
            <!-- <DxTotalItem
                column="keHoach"
                summary-type="sum"
                value-format="###0.####"
                display-format="{0}"
              />     -->
            <!-- <DxTotalItem
              column="TonTH"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
              :calculate-cell-value="calculatesoThanh"
            /> -->
            <DxTotalItem
              column="THANH"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="KL"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxGroupItem
              column="THANH"
              name="sothanh"
              summary-type="sum"
              value-format="###0.####"
              :show-in-group-footer="false"
              :align-by-column="true"
              display-format="{0}"
            />
            <DxGroupItem
              column="DAY"
              summary-type="sum"
              value-format="###0.####"
              :show-in-group-footer="false"
              :align-by-column="true"
              display-format=" "
            />
            <DxGroupItem
              column="TonTH"
              summary-type="sum"
              value-format="###0.####"
              :show-in-group-footer="false"
              :align-by-column="true"
              display-format="{0}"
            />
            <DxGroupItem
              column="KL"
              summary-type="sum"
              value-format="###0.####"
              :show-in-group-footer="false"
              :align-by-column="true"
              display-format="{0}"
            />
          </DxSummary>
        </DxDataGrid>

        <q-dialog v-model="confirmphieu" persistent>
          <q-card style="min-width: 400px">
            <q-card-section class="row items-center">
              <div class="row">
                <div class="col-12 top-title">Xác nhận xuất gỗ</div>
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
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { DxNumberBox } from "devextreme-vue/number-box";
import SelectBox from "../../../components/commons/SelectBoxInt";
import SelectNcc from "../../../components/NLG/SelectBoxNcc";
import SelectNhomQuiCach from "../../../components/commons/SelectBoxInt";
import DateBoxNgayNhapKho from "../../../components/NLG/DateBoxNgayNhapKho";
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
  DxSorting,
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
    SelectNcc,
    SelectBox,
    SelectNhomQuiCach,
    DxNumberBox,
    DxTotalItem,
    SelectThang,
    SelectNam,
    DxSorting,
    DateBoxNgayNhapKho,
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
      khoys:false,
      khotb:false,
      id: 0,
      solan: "",
      lan: "",
      listNumber: [],
      ngaynhapkho: new Date(),
      f_ngaynhapkho: "",
      phoi: [
        { code: "phoitho", name: "thô" },
        { code: "phoithocom3", name: "Phôi thô com 3" },
        { code: "phoithocom12", name: "Phôi thô com 1&2" },
        { code: "phoi2M", name: "2M" },
        { code: "phoi4M", name: "4M" },
        { code: "CXL", name: "Phôi CXL" },
      ],
      dalua: [
        {
          label: "Đã lựa đạt",
          id: "daluadat",
        },
        {
          label: "Đã lựa không đạt",
          id: "daluakodat",
        },
        {
          label: "chưa lựa",
          id: "chualua",
        },
      ],
      congdoannhan: "",
      dongsanpham: [
        {
          label: "1.Lựa phôi - X1 (TH)",
          id: 100264,
        },
        {
          label: "1.Lựa phôi - X3 (TH)",
          id: 100274,
        },
        {
          label: "2.Sơ chế - X3 (TH)",
          id: 100276,
        },
        {
          label: "2.VGT (indoor) - X1 (TH)",
          id: 100265,
        },
        //     {
        //   label: "2.VGT (indoor) - X3 (TH)",
        //   id:100278,
        // },
        {
          label: "2.Tổ Lựa phôi ghép (TB)",
          id: 102370,
        },
        {
          label: "2. Tổ Lựa phôi (TB)",
          id: 102809,
        },
        {
          label: "3.Tổ Sơ Chế (TB)",
          id: 102380,
        },
        //      {
        //   label: "Tổ sơ chế 2 (TB)",
        //   id:102373,
        // },
        {
          label: "3.Tổ sơ chế X5 (YS1)",
          id: 102355,
        },
        {
          label: "3.Tổ sơ chế X3 (YS1)",
          id: 102353,
        },
        {
          label: "2.Tổ Lựa phôi X3 mới (YS1)",
          id: 102789,
        },
        {
          label: "Tổ Runnen (YS1)",
          id: 102354,
        },
        {
          label: "2.Tổ lựa phôi X3 (YS1)",
          id: 102855,
        },
        {
          label: "2.Tổ lựa phôi X5 (YS1)",
          id: 102347,
        },
         {
          label: "4.Tổ tinh chế 3 (YS1)",
          id: 102530,
        },
      ],
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102299,
          code: "YS1",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102299,
          code: "TB",
        },
      ],
      mydsncc: [],
      chuyen_thang: null,
      chuyen_nam: null,
      dsNCC: [],
      dulieu: [],
      confirmTrave: false,
      confirmphieu: false,
      nhomquicachs: [],
      nhomkhos: [],
      ncc: null,
      tongKL: 0,
      week: "",
      year: null,
      dupplicateNcc: [],
      nhomqc: null,
      nhomkho: null,
      slkh: 0,
      listlan: [],
      number: "",
      showEdit: false,
      showEdit1: false,
      dataTrave: [],
      fix: null,
      nhap_year: null,
      nhap_month: null,
      thangs: thangs,
      nams: nams,
      idDepartment: null,
      history_thang: null,
      history_nam: null,
      historys: [],
      congdoans: [],
      items: [],
      duyet: "",
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
    };
  },
  created() {
    const today = new Date();
    const currentMonth = today.getMonth();
    this.f_ngaynhapkho = this.ngaynhapkho;
    this.nhap_month = currentMonth + 1;
    this.chuyen_thang = this.nhap_month;
    this.history_thang = currentMonth + 1;
    const currentYear = today.getFullYear();
    this.year = currentYear;
    this.week = getWeekNumber(today);
    this.nhap_year = currentYear;
    this.chuyen_nam = currentYear;
    this.history_nam = currentYear;
    Promise.all([this.loadItem()]);
  },
  methods: {
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
    eventChangeNgayNhapKho(e) {
      this.f_ngaynhapkho = e.value;
    },
    async loadHistory() {
      this.historys = [];
      this.showEdit1 = false;
      this.duyet = "";
      this.solan = "";
      this.lan = "";
      const payload = {
        number: this.number,
      };
      const data = await this.$store.dispatch("nlg/XUAT_GO_THEP_LSX", payload);

      data.data.forEach((d) => {
        if (d.BX != null && d.BX != "") this.showEdit1 = true;
        if (d.BX == null || d.BX == "") this.historys.push(d);
      });
    },
    async duyetbs() {
      this.historys = [];
      this.duyet = "";
      const payload = {
        number: this.number,
      };
      const data = await this.$store.dispatch(
        "nlg/XUAT_GO_THEP_LSX_BS",
        payload
      );
      this.solan = data.data[0].BX;
      // data.data.filter((v,i,a)=> a.indexOf(v)===i)
      data.data.forEach((e) => {
        this.listlan.push(e.BX);
      });
      this.listlan = this.listlan.filter((v, i, a) => a.indexOf(v) === i);
      data.data.forEach((d) => {
        if (d.BX == this.lan) {
          this.historys.push(d);
        }
      });
    },
    calculateTongThanh(rowData) {
      if (rowData.DAI == 0) {
        rowData.TonTH = rowData.THANH;
      } else
        rowData.TonTH = roundNumber(
          (rowData.THANH * rowData.DAY * rowData.DAI * rowData.RONG) /
            1000000000,
          4
        );

      return rowData.TonTH;
    },
    calculatecapgoT(rowData) {
      //rowData.capgoT = rowData.capgo
      if (!rowData.DAI || rowData.DVT.trim() == "T") {
        rowData.capgoT = rowData.capgo;
      } else
        rowData.capgoT = roundNumber(
          (rowData.capgo * 1000000000) /
            (rowData.DAY * rowData.DAI * rowData.RONG),
          0
        );

      return rowData.capgoT;
    },
    async rowUpdating(e) {
      let capgo1 = [];
      this.canhbao = 0;
      this.canhbaoT = 0;
      const { newData, oldData } = e;
      console.log("so thanh:", oldData.DVT);
      this.historys.forEach((d) => {
        if (d.tensp == oldData.tensp && d.tenqc == oldData.tenqc ) {
          this.canhbao +=
            (d.THANH * d.DAY * d.DAI * d.RONG) / 1000000000 + d.KL;
          this.canhbaoT += d.THANH;
        }
      });
      if (oldData.DVT.trim() == "T") {
        if (
          newData.THANH - oldData.THANH + this.canhbaoT >
          oldData.capgo * 1.03
        ) {
          this.$q.dialog({
            title: "Xác nhận",
            message: `Bạn nhập quá số lượng cần cấp`,
            cancel: true,
            persistent: true,
          });
          newData.THANH = 0;
        }
      } else {
        if (
          ((newData.THANH - oldData.THANH) *
            oldData.DAY *
            oldData.DAI *
            oldData.RONG) /
            1000000000 +
            this.canhbao >
          oldData.capgo * 1.03
        ) {
          this.$q.dialog({
            title: "Xác nhận",
            message: `Bạn nhập quá khối lượng cần cấp`,
            cancel: true,
            persistent: true,
          });
         
        }
      }
    },
    async pheduyet() {
      const payload = {
        number: this.number,
        createBy: this.$store.state.base.userInfo.id,
      };
      const data = await this.$store.dispatch("nlg/PHE_DUYET_PHIEU", payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.loadHistory();
      } else {
        showNotifyError();
      }
    },
    async xoa() {
      let capgo = [];
      this.historys.forEach((d) => {
        if (d.THANH > 0) capgo.push(d);
      });
      this.dulieu = capgo;

      const payload = {
        number: this.number,
        SOURCE_ID: this.$store.state.base.userInfo.structure.kho.id,
        week: this.week,
        year: this.year,
        XUATNHAP: "xuat",
        // createdAt: formatDateISO(this.f_ngaynhapkho) + " 06:00:00",
        factoryId: this.fa,
        createBy: this.$store.state.base.userInfo.id,
        dataDelai: this.dulieu,
      };
      const data = await this.$store.dispatch("nlg/XUAT_GOTH", payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.$router.push("/bang-xuat-go/");
      } else {
        showNotifyError();
      }
    },
    onSelectionChanged({ selectedRowsData }) {
      this.idSelect = selectedRowsData[0].ID;
      this.showEdit = true;
      this.dataTrave = selectedRowsData;
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
      const payload = {
        id: e.data.ID,
      };
      const data3 = await this.$store.dispatch("nlg/PUT_DINH_MUC_KHO", payload);
      if (data.meta.success) {
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
    async loadGrid() {
      this.listNumber = [];
      this.congdoannhan = [];
      if (this.idDepartment.code == "TH") {
        this.fa = 100000;
          this.khoys = false;this.khotb = false
        // this.dongsanpham.forEach((element) =>{
        //   if (element.label.indexOf(`(${value.code})`) > -1) this.congdoannhan.push(element);
        // });
        this.congdoannhan = this.dongsanpham.filter(
          (d) => d.label.indexOf(`(TH)`) > -1
        );
      }
      if (this.idDepartment.code == "YS1A") {
        this.fa = 100003;
        this.congdoannhan = this.dongsanpham.filter(
          (d) => d.label.indexOf(`(YS1A)`) > -1 || d.label.indexOf(`(YS1B)`) > -1
        );
      }

      if (this.idDepartment.code == "YS1B") {
        this.fa = 100004;
        this.congdoannhan = this.dongsanpham.filter(
          (d) => d.label.indexOf(`(YS1B)`) > -1 || d.label.indexOf(`(YS1A)`) > -1 
        );
      }
        if (this.idDepartment.code == "YS1") {
        this.fa = 100004;
        this.khoys = true;this.khotb = false
        this.congdoannhan = this.dongsanpham.filter(
          (d) => d.label.indexOf(`(YS1)`) > -1 
        );
      }
      if (this.idDepartment.code == "TB") {
        this.fa = 100005;
          this.khoys = false;this.khotb = true;
        this.congdoannhan = this.dongsanpham.filter(
          (d) => d.label.indexOf(`(TB)`) > -1
        );
      }
      const payload = {
        week: this.week,
        year: this.year,
        factoryId: this.fa,
      };

      // let dataPivort = [];
      const data = await this.$store.dispatch("prod/GET_HE_SO_LSX", payload);
      data.data.forEach((element) => {
        this.listNumber.push(element.number);
      });
    },

    async update(e) {
      const payload = {
        ID: e.data.ID,

        quantity: e.data.PLANQTY,

        FIX: e.data.FIX,
      };
      const data = await this.$store.dispatch("nlg/UPDATE_KHO", payload);
      if (data.meta.success) {
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
    // async loadGroupQuiCach(){
    //    const duppp = []
    //    const data = await this.$store.dispatch('nlg/GET_GROUP_QUI_CACH')
    //     data.data.forEach(e=>{
    //         duppp.push({
    //            // text: e.name,
    //             value: e.name4 = e.name
    //         })
    //     })
    //    this.dupplicateNcc = duppp

    //       this.nhomquicachs = data.data

    // },
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
.mauXGTL {
  border: 1px solid !important;
  background-color: white;
  color: black;
}
.dx-datagrid-summary-item {
  font-weight: 900;
  color: black;
}
.dx-command-expand {
  background: white;

  font-weight: 900;
  width: 280;
  font-family: Arial, Helvetica, sans-serif;
}
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  background-color: #f7f7f7;

  font-weight: 900;
  width: 280;
}
.dx-group-cell {
  border: 1px solid black !important;
}
#gridContainer {
  height: 800px;
}
</style>