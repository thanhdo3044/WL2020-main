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
        label="Số phiếu"
      />

      <q-btn
        color="primary"
        icon="assignment_return"
        label="Xuất gỗ"
        @click="confirmphieu = true"
      />
      <DateBoxNgayNhapKho
        :ngaynhapkho="ngaynhapkho"
        :onChange="eventChangeNgayNhapKho"
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
              <strong> XUẤT NGUYÊN VẬT LIỆU </strong>
            </th>
          </tr>
          <tr></tr>
          <tr class="text-center">
            <td>Tuần SX</td>
            <th>{{ week }}</th>
            <td>KHÁCH HÀNG</td>
            <td>IKEA</td>
            <td class="text-left">Số phiếu</td>
            <td>{{ number }}</td>
          </tr>
          <tr>
            <td colspan="4" class="text-center">
              Nhà máy: <strong>Yên Sơn</strong> Loại gỗ: Acacia Magium Trạng
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
    <div class="row q-mt-md">
      <q-card class="my-card">
        <!-- <q-card-section>
                 <div class="top-title">
                     Lịch sử nhập
                 </div>
              </q-card-section>
              <q-card-section>
                  <div class="row">
                      <div class="col-6 q-pa-md">
                        <SelectThang :dataSource="thangs" :onChange="chonThangHistory" :title="'Chọn Tháng'" :defaultValue="history_thang"/>
                      </div>
                      <div class="col-6  q-pa-md">
                          <SelectThang :dataSource="nams" :onChange="chonNamHistory" :title="'Chọn Năm'" :defaultValue="history_nam"/>
                      </div>
                  </div>
              </q-card-section> -->

        <DxDataGrid
          id="gridContainer"
          :data-source="historys"
          :show-borders="true"
          :column-auto-width="true"
          :show-column-lines="true"
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
          <DxSorting mode="none" />
          <!-- <DxGroupPanel :visible="true"/>
            <DxGrouping :auto-expand-all="true"/> -->

          <!-- <DxColumn
                data-field="paren"
                caption="Sẩn phảm"
                :group-index="0"
            /> -->

          <DxColumn
            data-field="NAME"
            caption="Nhóm Qui Cách"
            width="400"
            css-class="mauXG2M"
          />
          <DxColumn data-field="DAY" caption="Dày" width="60" css-class="mauXG2M" />
          <DxColumn
            data-field="RONG"
            caption="Rộng"
            width="60"
            css-class="mauXG2M"
          />
          <DxColumn data-field="DAI" caption="Dài" width="60" css-class="mauXG2M" />

          <DxColumn
            data-field="SL_TH"
            caption="Kế hoạch cấp"
            alignment="center"
            format="#,##0.####"
            width="90"
            css-class="mauXG2M"
          />

          <DxColumn
            caption="SL cấp thực tế"
            data-field="THANH"
            alignment="center"
            width="100"
            css-class="mauXG2M"
          />
          <DxColumn
            caption="KL cấp thực tế"
            data-field="TonTH"
            alignment="center"
            width="100"
            format="#,##0.####"
            css-class="mauXG2M"
            :calculate-cell-value="calculateTongThanh"
          />
          <DxColumn
            data-field="daxuat"
            caption="đã xuất"
            alignment="center"
            format="#,##0.####"
            width="90"
            css-class="mauXG2M"
          />

          <DxColumn
            caption="Công đoạn nhận"
            data-field="noiden"
            alignment="center"
            width="160"
            css-class="mauXG2M"
          >
            <DxLookup
              :data-source="congdoannhan"
              display-expr="label"
              value-expr="id"
            />
          </DxColumn>

          <DxSummary>
            <DxTotalItem
              column="NAME"
              summary-type="count"
              value-format="fixedpoint"
              display-format="Tổng cộng : "
            />

            <DxTotalItem
              column="TonTH"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
              :calculate-cell-value="calculatesoThanh"
            />
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
            <!-- <DxGroupItem  
                column="THANH"
                name = "sothanh"
                summary-type="sum"
                value-format="###0.####"
                :show-in-group-footer="false"
                  :align-by-column="true"
                display-format="{0}"
              /> -->
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
      id: 0,
      solan: "",
      lan: "",
      listNumber: [],
      ngaynhapkho: new Date(),
      f_ngaynhapkho: "",
      dalua: [
        {
          label: "Đã lựa",
          id: "dalua",
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
          label: "Tổ lựa phôi  (TB)",
          id: 102809,
        },

        {
          label: "2.Tổ Lựa phôi X3 mới (YS1)",
          id: 102789,
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
    // console.log('nguoi dung:',this.$store.state.base.userInfo.structure.department.id)
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
      console.log(e);
      this.f_ngaynhapkho = e.value;
      console.log(formatDateISO(this.f_ngaynhapkho));
    },
    async loadHistory() {
      console.log("LSX:", this.number);
      this.historys = [];
      this.showEdit1 = false;
      this.duyet = "";
      this.solan = "";
      this.lan = "";
      const payload = {
        number: this.number,
      };
      const data = await this.$store.dispatch(
        "nlg/XUAT_GO_THEO_LSX_2M",
        payload
      );

      this.historys = data.data;
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
    calculatesoThanh(e) {
      console.log("thanh:", e);
    },
    async rowUpdating(e) {
      let capgo1 = [];
      this.canhbao = 0;
      const { newData, oldData } = e;
      // this.historys.forEach((d) => {
      //   if (d.tensp == oldData.tensp)
      //     this.canhbao +=
      //       (d.THANH * d.DAY * d.DAI * d.RONG) / 1000000000 + d.KL;
      // });

     // console.log("cảnh báo:", this.canhbao);
      if (
        (newData.THANH + oldData.daxuat)  > oldData.SL_TH * 1.05
      ) {
        this.$q.dialog({
          title: "Xác nhận",
          message: `Bạn nhập quá khối lượng cần cấp`,
          cancel: true,
          persistent: true,
        });
       //   newData.THANH = 0
      }
    },

    async xoa() {
      let capgo = [];
      this.historys.forEach((d) => {
        if (d.THANH > 0) capgo.push(d);
      });
      this.dulieu = capgo;
      console.log("dữ liệu:", this.dulieu[0].THANH);

      const payload = {
        number: this.number,
        SOURCE_ID: this.$store.state.base.userInfo.structure.kho.id,
        week: this.week,
        year: this.year,
        XUATNHAP: "xuat",
        createdAt: formatDateISO(this.f_ngaynhapkho) + " 06:00:00",
        factoryId: this.fa,
        createBy: this.$store.state.base.userInfo.id,
        dataDelai: this.dulieu,
      };
      const data = await this.$store.dispatch("nlg/XUAT_GOTQ", payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.$router.push("/bang-xuat-go-2M/");
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

    async del(e) {
      console.log("ID:", e.data.ID);
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
          (d) => d.label.indexOf(`(YS1A)`) > -1
        );
      }

      if (this.idDepartment.code == "YS1") {
        this.fa = 100004;
        this.congdoannhan = this.dongsanpham.filter(
          (d) => d.label.indexOf(`(YS1)`) > -1
        );
      }
      if (this.idDepartment.code == "TB") {
        this.fa = 100005;
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
      const data = await this.$store.dispatch("nlg/GET_HE_SO_2M", payload);
      data.data.forEach((element) => {
        this.listNumber.push(element.number);
      });
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
.mauXG2M {
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