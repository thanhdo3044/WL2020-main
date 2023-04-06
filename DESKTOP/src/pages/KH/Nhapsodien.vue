<template>
  <q-page class="q-pa-sm">
    <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
         Cập nhật số điện tiêu thụ hàng tháng các nhà máy khối chế biến gỗ
        </div>
        <div class="col-6 text-blue text-bold" align="right">
          <span style="font-size: 18px">Tháng: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="loadHistory"
            v-model="thang"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 40px;
            "
          />
          <span style="margin-right: 15px">-</span>
          <span style="font-size: 18px">Năm: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="loadHistory"
            v-model="year"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 60px;
            "
          />
        </div>
      </div>
    <q-card>
      <div style="padding: 5px">
        <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
          <div class="col-8">
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in options"
                :key="index"
              >
                <q-radio
                  dense
                  @input="loadHistory"
                  v-model="idDepartment"
                  :val="congDoan"
                  :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  v-bind:class="{ isActive: true }"
                  color="amber-6"
                />
              </div>
            </div>
          </div>
          <div class="col-4">
            <q-btn
            class="col-1 q-ml-sm"
            style="height: 42px"
            color="positive"
            outlined
            label="Cập nhật"
            @click="confirmphieu = true"
            />
          </div>
        </div>
        <div class="row q-mt-md">
          <DxDataGrid
            id="gridContainer"
            :data-source="historys"
            :show-borders="true"
            :column-auto-width="true"
            :show-column-lines="true"
            :allow-column-reordering="true"
            :show-row-lines="true"
            :word-wrap-enabled="true"
            @row-updating="onUpdate"
            @selection-changed="onSelectionChanged"
          >
            <!-- <DxEditing :allow-updating="true" mode="cell" /> -->
            <!-- <DxGroupPanel :visible="true" /> -->
            <!-- <DxGrouping :auto-expand-all="true" /> -->
            <!-- <DxHeaderFilter :visible="true" /> -->
            <DxFilterRow :visible="false" />
            <DxScrolling mode="infinite" />
            <DxSorting mode="none" />

            <DxColumn data-field="GROUP" caption="Xưởng" :group-index="0" />
            <DxColumn
              data-field="NAME"
              caption="Danh sách xưởng"
              css-class="rowNSD"
              width="350"
              
              :allowEditing="false"
            />
            <DxColumn
              data-field="SODIEN"
              css-class="rowNSD"
              caption="Số điện tiêu thụ (kWh)"
              width="80"
                alignment="center"
              format="#,##0.####"
                 cell-template="cellTemplateCreatedAt"
            
            >
            </DxColumn>

            <DxColumn
              data-field="GHICHU"
              css-class="rowNSD"
              caption="Ghi chú"
              width="220"
            />
        <template  #cellTemplateCreatedAt="{ data }">
      <q-input  dense  borderless v-if="data.data.SODIEN1>0" :readonly="true"  v-model="data.data.SODIEN" ></q-input>
          <q-input dense borderless   debounce="1000" v-else :readonly="false" v-model="data.data.SODIEN" @input="nhap(data)" ></q-input>
    </template>
            <!-- <template #cellTemplate="cell">
            <p>{{ cell.data.rowIndex + 1 }}</p>
          </template> -->
          </DxDataGrid>

          <q-dialog v-model="confirmphieu" persistent>
            <q-card style="min-width: 400px">
              <q-card-section class="row items-center">
                <div class="row">
                  <div class="col-12 top-title">Xác nhận nhập số điện</div>
                </div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="Hủy" color="primary" v-close-popup />
                <q-btn
                  flat
                  label="Đồng ý"
                  @click="nhapsodien"
                  color="primary"
                  v-close-popup
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { DxNumberBox } from "devextreme-vue/number-box";
import SelectBox from "../../components/commons/SelectBoxInt";
import SelectNcc from "../../components/NLG/SelectBoxNcc";
import SelectNhomQuiCach from "../../components/commons/SelectBoxInt";
import DateBoxNgayNhapKho from "../../components/NLG/DateBoxNgayNhapKho";
import SelectThang from "../../components/commons/SelectBoxInt";
import SelectNam from "../../components/commons/SelectBoxInt";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
  roundNumber,
  getWeekNumber,
  showLoadingIos,
  closeLoading,
} from "../../ultils";
import {
  showNotifySuccess,
  showNotifyError,
  showNotifyValidate,
  thangs,
  nams,
} from "../../ultils";
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

      congdoannhan: "",

      options: [],
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
      thang: null,
      thangs: [
        { label: 1, id: 1 },
        { label: 2, id: 2 },
        { label: 3, id: 3 },
        { label: 4, id: 4 },
        { label: 5, id: 5 },
        { label: 6, id: 6 },
        { label: 7, id: 7 },
        { label: 8, id: 8 },
        { label: 9, id: 9 },
        { label: 10, id: 10 },
        { label: 11, id: 11 },
        { label: 12, id: 12 },
      ],
      nams: nams,
      idDepartment: {
        label: "Nhà máy CBG Thuận Hưng",
        factoryId: 100000,
        code: "TH",
      },
      history_thang: null,
      history_nam: null,
      historys: [],
      congdoans: [],
      items: [],
      capvt1:[],
      congdoan: null,
      item: null,
      sl: 0,
      sd:0,
      chonkhochuyen: null,
      dataSource: [],
      showLeave: false,
      answer: false,
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo", "myFactoryInfor", "dSNhanVien"]),
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
    this.thang = today.getMonth() + 1;
    this.loadHistory();
    this.loadFactory();

    // console.log('nguoi dung:',this.$store.state.base.userInfo.structure.department.id)
  },
  methods: {
    loadFactory() {
      this.options = [];
      const data = this.userInfo.role.types[0].value;
      console.log("data", data);
      const factory = data.filter(
        (d) => d.type2 == "nhaMay" && d.parentId == 102299
      );
      factory.forEach((el) => {
        this.options.push({
          label: el.name,
          factoryId: el.id,
          code: el.code,
        });
      });
      console.log("this.options", this.options);
    },
    nhap(data) {
            console.log('so dien:',data)
    },
    nhap(e) {
 
      const regex = /^[0-9]+$/;
      if (!regex.test(e.data.SODIEN)) {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng nhập số ! </span>`,
          persistent: true,
        });
        e.data.SODIEN = "";
      }
       
    },
    eventChangeNgayNhapKho(e) {
      console.log(e);
      this.f_ngaynhapkho = e.value;
      console.log(formatDateISO(this.f_ngaynhapkho));
    },
    async loadHistory() {
      this.historys = [];

      const payload = {
        thang: this.thang,
        nam: this.year,
        factoryId: this.idDepartment.factoryId,
      };
      const data = await this.$store.dispatch("prod/GET_NHAP_SO_DIEN", payload);
      this.historys = data;
    },

    async nhapsodien() {
     
      let capvt = [];
      this.historys.forEach((d) => {
        if (d.SODIEN > 0 && d.SODIEN1 == null) capvt.push(d);
      });
    console.log('nhap so:',capvt)
      this.dulieu = capvt;
      const payload = {
        thang: this.thang,
        year: this.year,
        factoryId: this.idDepartment.factoryId,
        createBy: this.$store.state.base.userInfo.id,
        dataDelai: this.dulieu,
      };
      const data = await this.$store.dispatch(
        "lenhSanXuats/POST_NHAP_SO_DIEN",
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
      const data3 = await this.$store.dispatch("nlg/PUT_DINH_MUC_KHO", payload);
      if (data.meta.success) {
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
  },
};
</script>


<style>
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  font-weight: 900;
}
.dx-datagrid-headers .rowNSD  {
  color: orange;
}
#gridContainer {
  max-height: 700px;
}

.dx-datagrid .dx-row-lines > td {
  color: black;

}
.dx-datagrid .dx-row > td {
  padding-left: 20px;

}

.relative-position  {
    padding-bottom: 0px !important;
}

</style>