<template>
  <q-page class="q-pa-md">
    <q-btn
      color="red"
      icon="assignment_return"
      label="Xuất gỗ"
      @click="confirmphieu = true"
    />

    <DateBoxNgayNhapKho
      :ngaynhapkho="ngaynhapkho"
      :onChange="eventChangeNgayNhapKho"
    />
    <div class="row">
    <q-input
      color="grey-3"
      label-color="orange"
      outlined
      v-model="number"
      label="Số phiếu"
      dense
    />
    &emsp; &emsp; &emsp;  &emsp; 
     <q-input
      color="grey-3"
      label-color="orange"
      outlined
      v-model="BSX"
      label="Biển số xe"
      dense
    />
    </div>
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
         
          <!-- <DxGroupPanel :visible="true"/>
            <DxGrouping :auto-expand-all="true"/> -->

          <DxColumn
            data-field="NAME"
            caption="Nhóm Qui Cách"
            width="400"
            css-class="mauXGLC"
          />
          <DxColumn data-field="DAY" caption="Cao" width="80" css-class="mauXGLC" />
          <DxColumn
            data-field="RONG"
            caption="Rộng"
            width="80"
            css-class="mauXGLC"
          />
          <DxColumn data-field="DAI" caption="Dài" width="80" css-class="mauXGLC" />

          <DxColumn
            caption="SL xuất"
            data-field="THANH"
            alignment="center"
            width="100"
            css-class="mauXGLC"
          />
          <DxColumn
            caption="KL xuất"
            data-field="TonTH"
            alignment="center"
            width="100"
            format="#,##0.####"
            css-class="mauXGLC"
            :calculate-cell-value="calculateTongThanh"
          />

         
          <DxColumn
            caption="Công đoạn nhận"
            data-field="noiden"
            alignment="center"
            width="160"
            css-class="mauXGLC"
          >
            <DxLookup
              :data-source="congdoannhan"
              display-expr="label"
              value-expr="id"
            />
           
          </DxColumn>
          <DxColumn data-field="GHICHU" caption="Ghi chú" css-class="mauXGLC" />
<DxSummary>
            <DxTotalItem
              column="tenqc"
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
                @click="xuatgo"
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
import moment from "moment";
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
      congdoannhan: [
        
        {
          label: "Kho Thái Bình",
          id: 102806,
        },
        {
          label: "Kho Yên Sơn 1A",
          id: 102807,
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
          code: "YS1B",
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
      confirmnhap: false,
      confirmxuatbuam: false,
      confirmxuatkhac: false,
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
      BSX:"",
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
    if (this.$store.state.base.userInfo.factoryId == 100003) this.congdoannhan = [  {
          label: "Kho Thái Bình",
          id: 102806,
        },]
   if (this.$store.state.base.userInfo.factoryId == 100005)      this.congdoannhan = [ {
          label: "Kho Yên Sơn 1A",
          id: 102807,
        },]
    Promise.all([this.loadHistory()]);
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
      const data = await this.$store.dispatch("nlg/XUAT_GO_THEO_NM", payload);

      this.historys = data.data.filter((d) => d.USEFLAG.trim() === 'Y');
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
      this.historys.forEach((d) => {
        if (d.tensp == oldData.tensp)
          this.canhbao +=
            (d.THANH * d.DAY * d.DAI * d.RONG) / 1000000000 + d.KL;
      });

      console.log("cảnh báo:", this.canhbao);
      if (
        ((newData.THANH - oldData.THANH) *
          oldData.DAY *
          oldData.DAI *
          oldData.RONG) /
          1000000000 +
          this.canhbao >
        oldData.capgo * 1.05
      )
        this.$q.dialog({
          title: "Xác nhận",
          message: `Bạn nhập quá khối lượng cần cấp`,
          cancel: true,
          persistent: true,
        });
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
    async xuatgo() {
      let capgo = [];
      this.historys.forEach((d) => {
        if (d.THANH > 0) capgo.push(d);
      });
      this.dulieu = capgo;
      console.log("dữ liệu:", this.$store.state.base.userInfo);

      const payload = {
        number: this.number,
        BSX:this.BSX,
        SOURCE_ID: this.$store.state.base.userInfo.structure.kho.id,
        week: this.week,
        XUATNHAP: "xuatluanchuyen",
        year: this.year,
        createdAt: formatDateISO(this.f_ngaynhapkho) + " 06:00:00",
        factoryId: this.$store.state.base.userInfo.factoryId,
        createBy: this.$store.state.base.userInfo.id,
        dataDelai: this.dulieu,
      };
      const data = await this.$store.dispatch("nlg/XUAT_GOLUANCHUYEN", payload);
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
.mauXGLC {
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