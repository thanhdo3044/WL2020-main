<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-10 top-title">
            Danh sách nhập lại
          </div>
        </div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <div class="row q-mb-sm">
           <div class="col-3 q-pa-md">
                      <DateBox :onChange="chonFromDate" :value="fromDate" :title="'Từ ngày'"/>
                  </div>
                  <div class="col-3 q-pa-md">
                      <DateBox :onChange="chonToDate" :value="toDate" :title="'Đến ngày'"/>
                  </div>
          <div class="col-4"></div>
        </div>
        <DxDataGrid
          :data-source="dataSource"
          :show-borders="true"
          :no-data-text="'Không có dữ liệu !'"
          :show-column-lines="true"
          :allow-column-resizing="true"
        >
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Danh sách trả về'"
          />
          <DxSearchPanel
            :visible="true"
            :placeholder="'Tìm kiếm'"
            :width="400"
          />
             <DxHeaderFilter :visible="true" />
          <DxColumn
            caption="STT"
            data-field="ID"
            alignment="center"
            width="50"
            cell-template="cellTemplate"
          />
          <DxColumn
            data-field="SOPHIEU"
            caption="Số Phiếu"
            alignment="center"
            width="180"
          />
          <DxColumn
            data-field="CREATED_AT"
            caption="Ngày xuất"
            alignment="center"
            width="100"
            data-type="date"
            format="dd/MM/yyyy"
          />
          <DxColumn caption="Qui Cách" alignment="center">
            <DxColumn
              caption="Dầy"
              data-field="DAY"
              format="fixedPoint"
              alignment="center"
              width="50"
            />
            <DxColumn
              caption="Rộng"
              data-field="RONG"
              format="fixedPoint"
              alignment="center"
              width="50"
            />
            <DxColumn
              caption="Dài"
              data-field="CAO"
              format="fixedPoint"
              alignment="center"
              width="50"
            />
          </DxColumn>
          <DxColumn
            data-field="SOBO"
            caption="Số bó"
            alignment="center"
            width="70"
          />
          <DxColumn
            data-field="SOTHANHBO"
            caption="Số thanh/bó"
            alignment="center"
            width="100"
          />
          <DxColumn
            data-field="KHOILUONG"
            caption="Khối lượng(m³)"
            format="##0.####"
            alignment="center"
            width="120"
          />
           <DxColumn
            data-field="dongia"
            caption="Đơn giá"
            format="###,###,##0"
            alignment="center"
            width="120"
          />
          <DxColumn data-field="MAKHO" caption="Mã kho" width="80" />
          <DxColumn data-field="NAME_NCC" caption="NCC" width="200" />

          <DxColumn data-field="NOTE" caption="Ghi chú" width="170" />
          <DxColumn caption="..." width="100" cell-template="edit-template" />

          <DxSummary>
            <DxTotalItem
              column="ID"
              summary-type="count"
              value-format="fixedpoint"
              display-format="Tổng cộng : "
              show-in-column="ACTUALDATE"
            />
            <DxTotalItem
              column="KHOILUONG"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
          </DxSummary>
          <template #cellTemplate="cell">
            <p>{{ cell.data.rowIndex + 1 }}</p>
          </template>
          <template #edit-template="cell">
            <div>
              <span @click="goAdd(cell.data.data.SOPHIEU)" class="fake-link"
                >XEM</span
              >
            </div>
          </template>
          <template #cellTemplateOverPlan="cell">
            <span style="font-weight:700;color:red" v-if="cell.data.value === 1"
              >Ngoài kế hoạch</span
            >
            <span v-else></span>
          </template>
        </DxDataGrid>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import DateBox from '../../../components/commons/DateBox'
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxExport,
  DxHeaderFilter,
  DxSummary,
  DxGroupItem,
  DxTotalItem
} from "devextreme-vue/data-grid";
import {
  showLoadingIos,
  closeLoading,
  formatDateISO,
  showNotifySuccess,
  showNotifyError
} from "../../../ultils";
import SelectBoxKho from "../../../components/NLG/SelectBoxKho";
import SelectBox from "../../../components/commons/SelectBoxInt";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DateBox,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxExport,
    DxHeaderFilter,
    DxSummary,
    DxGroupItem,
    DxTotalItem,
    SelectBoxKho
  },
  data() {
    return {
      dataSource: [],
      dupplicateNcc: [],
      showEdit: false,
      makho: null,
       fromDate:new Date(),
          toDate:new Date(),
      dskhos: [],
      dataTrave: [],
      confirmTrave: false
    };
  },
  created() {
    //this.dskhos = this.$store.getters['base/myKhoCBG']
    // if (this.dskhos.length===1) {
    //   this.makho =this.dskhos[0].id
    // }
    this.makho = this.getKhoByAccount(this.userInfo);
    this.loadkho();
    this.loadDelai();
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("nlg", ["getKhoByAccount", "getAllKhos", "phieuNhapKhos"])
  },
  methods: {
    async loadkho() {
      const duppp = [];
      const data = await this.$store.dispatch("nlg/GET_DS_KHO");
      data.data.forEach(e => {
        duppp.push({
          text: (e.name = e.tenkho),
          value: e.makho
        });
      });
      this.dupplicateNcc = duppp;

      this.dskhos = data.data;
    },
    async loadDelai() {
      // showLoadingIos()
         const payload = {
                from:formatDateISO(this.fromDate),
                to:formatDateISO(this.toDate)
              
            }
      const data = await this.$store.dispatch("nlg/GET_DS_NHAPLAI", payload);
      this.dataSource = data.data;

      //closeLoading()
    },

    calculateTongThanh(rowData) {
      return rowData.SOBO * rowData.SOTHANHBO;
    },

    goAdd(guid) {
      this.$router.push({ path: "/nlg-phieu-nhaplai", query: { guid: guid } });
    },
    chonFromDate(e){
            this.fromDate = e.value
            this.loadDelai()
        },
        chonToDate(e){
            this.toDate = e.value
            this.loadDelai()
        },
    eventChonKho(e) {
      this.makho = e.value;
      console.log(this.makho);
      this.loadDelai();
    }
  }
};
</script>

<style></style>
