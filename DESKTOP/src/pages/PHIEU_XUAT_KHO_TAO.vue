<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <div class="row">
        <div class="col-5">
          <h4 class="title">Tạo người ký ra cổng</h4>
        </div>
      </div>
      <DxDataGrid  :data-source="dataTable" :allow-column-reordering="true" :show-borders="true"
            key-expr="ID" @editing-start="EditRow" @row-updating="" @row-updated="EditRowUpdated"
            @row-removed="RemovedRow" @init-new-row="AddTable" @row-remove="DeleteRow"
            class="responstable" 
            >
        <DxPaging :enabled="true" />
        <DxEditing :allow-updating="true" mode="row" />
        <DxColumn data-field="TENNGUOITAOPHIEU" caption="Tên người tạo phiếu">
          <!-- <DxLookup :data-source="nameData" value-expr="Value" display-expr="Text" />
          <DxStringLengthRule :max="5" message="The field Customer must be a string with a maximum length of 5." /> -->
        </DxColumn>
        <DxColumn data-field="MANV" caption="Mã nhân viên" />
        <DxColumn data-field="TENBOPHAN" caption="Tên bộ phận" />
      </DxDataGrid>
      <div class="row">
        <div class="col-10"></div>
        <div class="col-2"><div class="remover">
          <q-btn color="primary" @click="$router.push({ path: `/phieu-xuat-kho` })" >Hoàn thành</q-btn></div>
        </div>
      </div>
    </q-card>
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
  DxStringLengthRule,
} from "devextreme-vue/data-grid";
import {
  formatDateVN, formatDateISO,
  getFisrtDayOfMonth, showNotifySuccess, showNotifyError
} from "../ultils";


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
    DxStringLengthRule,
  },
  data() {
    return {
      // nameData: [],
      dataTable: [],
      tenNguoiTaoPhieu:'',
      maNV:'',
      tenBoPhan:'',
    };
  },
  created() {
    this.load()
  },
  methods: {
    AddTable() { },
    EditRow() { },
    async EditRowUpdated(e) {
      const payload = {
        ID: e.data.ID,
        maNV:e.data.MANV,
        tenBoPhan:e.data.TENBOPHAN,
        tenNguoiTaoPhieu:e.data.TENNGUOITAOPHIEU
      };
      // console.log("hien thi sua du lieu ",payload);
      const data = await this.$store.dispatch("production/PUT_GATE_PASS_CREATE", payload);
    },
    async RemovedRow(e) {
      const payload = {
        ID: e.data.ID,
      };
      // console.log("hien thhi xoa ", e);
      const data = await this.$store.dispatch("production/DELETE_GATE_PASS_CREATE", payload);
    },
    async Saved(e){
      const payload= {
        maNV:e.data.MANV,
        tenBoPhan: e.data.TENBOPHAN,
        tenNguoiTaoPhieu: e.data.TENNGUOITAOPHIEU,
      }
      const dsataImg = await this.$store.dispatch("production/POST_GATE_PASS_CREATE",payload)
    },
    async DeleteRow(e){
      // console.log("thong tin xoa bang ",e);
    },
    async load(){
      // cho ten nguoi nhan
      const dataAccout = await this.$store.dispatch("production/GET_GATE_PASS_CREATE");
      // console.log("hien thi phong ban ",dataAccout);
      this.dataTable = dataAccout
    }
  },
  computed: {
  },
}


</script>

<style lang="scss">
.remover{
  display: flex;
  justify-content: end;
  margin-right: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
}
.title{
  font-size: 30px;
  margin-bottom: -10px;
  margin-left: 5%;
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
$table-outer-border: 1px solid #135C7C;
$table-cell-border: 1px solid #D9E4E6;

// Extra options for table style (parse these arguments when including your mixin)
$table-border-radius: 10px;
$table-highlight-color: #EAF3F3;
$table-header-background-color: #135C7C;
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
    // overflow: hidden;  
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