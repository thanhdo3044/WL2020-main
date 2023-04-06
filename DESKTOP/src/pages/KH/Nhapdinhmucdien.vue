<template>
  <q-page class="q-pa-md">
    <q-banner class="text-primary">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div class="text-h6 q-mt-lg">
        Cập nhật định mức điện các tổ trong nhà máy khối chế biến gỗ
      </div>
    </q-banner>
    <q-card class="my-card">
      <q-separator spaced />
      <q-card-section>
        <div class="row print-hide">
          <!-- <q-input
            class="col-1 q-ml-sm"
            outlined
            @input="loadHistory"
            v-model.number="year"
            type="number"
            label-color="orange"
            label="Năm"
            dense
          />

          <q-select
            class="col-1 q-ml-sm"
            outlined
            @input="loadHistory"
            v-model="thang"
            :options="thangs"
            label-color="orange"
            label="Chọn tháng"
            dense
          />
          <q-select
            class="col-2 q-ml-sm"
            @input="loadHistory"
            outlined
            v-model="idDepartment"
            :options="options"
            label-color="orange"
            label="Chọn nhà máy"
            dense
          /> -->
          <!-- <div class="col-1"></div> -->
          <q-btn
            class="col-1 q-ml-sm"
            style="height: 42px"
            color="positive"
            outlined
            label="Cập nhật"
            @click="confirmphieu = true"
          />
        </div>
    
          <DxDataGrid
            :data-source="historys"
            :show-borders="true"
            :show-column-lines="true"
            :show-row-lines="true"
            :word-wrap-enabled="true"
            @row-updating="onUpdate"
          >
            <DxEditing :allow-updating="true" mode="cell" />
            <!-- <DxGroupPanel :visible="true" /> -->
            <!-- <DxGrouping :auto-expand-all="true" /> -->
            <!-- <DxHeaderFilter :visible="true" /> -->
            <DxFilterRow :visible="false" />
            <DxScrolling mode="infinite" />
            <!-- <DxSorting mode="none" /> -->

            <DxColumn data-field="NAME" caption="Tổ" :group-index="0" />
            <!-- <DxColumn
              data-field="NAME"
              caption="Danh sách xưởng"
              css-class="rowNDMD"
              width="350"
             sort-order="asc"
              :allowEditing="false"
            /> -->
            <DxColumn
              data-field="NHOMSP_TTD"
              caption="Nhóm sản phẩm"
              css-class="rowNDMD"
              width="350"
              :allowEditing="false"
            />
            <DxColumn
              data-field="DM_TTD"
              css-class="rowNDMD"
              caption="Định mức tiêu thụ điện (kWh)"
              width="150"
              alignment="center"
              format="#,##0.####"
              :allowEditing="false"
            >
            </DxColumn>
            <DxColumn
              data-field="DM_TTD1"
              css-class="rowNDMD"
              caption="Update định mức tiêu thụ điện (kWh)"
              width="150"
              alignment="center"
              format="#,##0.####"
            />

            <template #cellTemplateCreatedAt="{ data }">
              <q-input
                dense
                borderless
                v-if="data.data.SODIEN1 > 0"
                :readonly="true"
                v-model="data.data.SODIEN"
              ></q-input>
              <q-input
                dense
                borderless
                debounce="1000"
                v-else
                :readonly="false"
                v-model="data.data.SODIEN"
                @input="nhap(data)"
              ></q-input>
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
     
      </q-card-section>
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
      capvt1: [],
      congdoan: null,
      item: null,
      sl: 0,
      sd: 0,
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
    this.thang = { label: today.getMonth() + 1, id: today.getMonth() + 1 };
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
        thang: this.thang.id,
        nam: this.year,
        factoryId: this.idDepartment.factoryId,
      };
      const data = await this.$store.dispatch("prod/GET_NHAP_DM_DIEN", payload);
      this.historys = data;
    },

    async nhapsodien() {
      let capvt = [];
      this.historys.forEach((d) => {
        if (d.DM_TTD1 > 0) capvt.push(d);
      });
      console.log("nhap so:", capvt);
      this.dulieu = capvt;
      const payload = {
    
        dataDelai: this.dulieu,
      };
      const data = await this.$store.dispatch(
        "lenhSanXuats/POST_NHAP_DM_DIEN",
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
.dx-datagrid-headers .rowNDMD {
  color: white;
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

.relative-position {
  padding-bottom: 0px !important;
}
.dx-datagrid-headers .rowNDMD {
  color: orange;
}
</style>