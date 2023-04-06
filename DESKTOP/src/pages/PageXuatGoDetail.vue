<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary print-hide">
      <div class="row">
        <div class="col-6 top-title text-orange">
          Báo cáo xuất nhập gỗ chi tiết
        </div>
        <div
          class="col-6 top-title text-orange cursor-pointer"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày {{ tuNgay }} đến {{ denNgay }}
        </div>
      </div>
      
    </q-card-section>
    <div class="row print-hide" >
         <q-select
            class="col-2 q-ml-sm"
            @input="loadCode"
            outlined
            v-model="idDepartment"
            :options="options"
            label="Chọn nhà máy"
          />
          </div>
    <q-card-section>
      <DxDataGrid
       id="gridContainer"
        :data-source="dataSource"
        :show-borders="true"
        :word-wrap-enabled="true"
        :show-row-lines="true"
        :show-column-lines="true"
         @row-updated="update"
         @row-removed="removed"
        :no-data-text="'Không có dữ liệu'"
      >
       <DxEditing 
        :allow-updating="sua"
        :allow-deleting="sua"
         mode="ppop"/>
        <DxExport
                :enabled="true"
                :allow-export-selected-data="true"
                :file-name="title"
              />
        <DxSorting mode="none" />
            <DxScrolling mode="infinite" />
      <DxHeaderFilter :visible="true" />
      <DxFilterRow :visible="true" />
         <DxColumn data-field="createdAt" :width="120" caption="Ngày tạo"
                   />
       <DxColumn data-field="gionhan" :width="120" caption="Ngày nhận"
                   />
        <DxColumn data-field="makt" caption="Mã kế toán" :width="100" />
        <DxColumn data-field="soPhieu" caption="Số phiếu" :width="300" />
        <DxColumn data-field="NAME" caption="Chi tiết" :width="550" />
        <DxColumn alignment="center" caption="Quy Cách">
          <DxColumn data-field="DAI" :width="90" alignment="center" caption="Dài" />
          <DxColumn data-field="RONG" :width="90" alignment="center" caption="Rộng" />
          <DxColumn data-field="DAY" :width="90" alignment="center" caption="Dày" />
        </DxColumn>
        <DxColumn data-field="SL_TH" :width="90" caption="Số lượng" />
          <DxColumn data-field="volumn" :width="90" caption="khối lượng" format="#,##0.00##" :calculate-cell-value="calculateKL" />
        <DxColumn data-field="XUATNHAP" :width="90" caption="Nhập xuất" />
          <DxColumn data-field="DESTINATION_NAME" :width="150" caption="Công đoạn nhận - nhập" />
          <DxColumn data-field="IDCONGDOAN" :width="100" caption="ID-Công đoạn" />
        <DxColumn data-field="luadat" :width="90" caption="Lựa" >
           <DxLookup
                  :data-source="dalua"
                  display-expr="label"
                  value-expr="id"
                />
               </DxColumn>
        <DxColumn data-field="GHICHU" :width="150" caption="Ghi chú" />
        <DxColumn data-field="LAST_NAME" :width="150" caption="Người tạo" />
      
           <DxSummary>
            <DxTotalItem
              column="createdAt"
              summary-type="count"
              value-format="fixedpoint"
              display-format="Tổng cộng : "
            />
             <DxTotalItem
              column="SL_TH"
              summary-type="sum"
              value-format="###,##0.####"
              display-format="{0}"
            />
                        <DxTotalItem
              column="volumn"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            </DxSummary>
      </DxDataGrid>
    </q-card-section>
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DialogSelectDate from "../components/commons/DialogSelectFromDateToDate";
import { formatDateISO,roundNumber,showNotifySuccess,showNotifyError, getFisrtDayOfMonth, formatDateVN } from "../ultils";
import { DxDataGrid,DxExport,DxEditing,DxLookup, DxHeaderFilter,DxColumn,DxSummary,DxTotalItem, DxFilterRow,
DxScrolling } from "devextreme-vue/data-grid";
export default {
  components: {
    DialogSelectDate,
    DxDataGrid,
    DxEditing,
    DxLookup,
    DxExport,
    DxScrolling,
    DxTotalItem,
    DxSummary,
    DxHeaderFilter,
    DxColumn,
    DxFilterRow
  },
  data() {
    return {
      fromDate: null,
      toDate: null,
      fa: 100000,
       dalua:[
         {
          label: "Đã lựa",
          id:"daluadat",
        },
         {
          label: "Đã lựa không đạt",
          id:"daluakodat",
        },
            {
          label: "chưa lựa",
          id:"chualua",
        },
       
      ],
      idDepartment: 
      {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
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
      sua:false,
      showChooseDate: false,
      dataSource: [],
    };
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
    ...mapGetters("base", ["userInfo"]),
  },
  created() {
           if (this.$store.state.base.userInfo.id == 102050 || this.$store.state.base.userInfo.id == 102089 )  this.sua = true
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.loadCode();

  },
  methods: {
    ...mapActions("production", [
      "VIEW_XUAT_GO_DETAIL"
    ]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
       calculateKL(rowData){
      if (rowData.DAI > 0 && rowData.RONG > 0 && rowData.DAY > 0) 
      rowData.volumn = (rowData.DAI*rowData.RONG*rowData.DAY*rowData.SL_TH)/1000000000;
         else rowData.volumn = rowData.SL_TH
          if (rowData.DAI == 1270 && rowData.DAY == 55 )  rowData.volumn = (3.14*rowData.DAI*rowData.RONG*rowData.DAY*rowData.SL_TH)/4000000000;
   
      return rowData.volumn;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadCode();
    },
    async removed(e){
          const    payload = {
            ID:e.data.id,
          
            }
            const data = await this.$store.dispatch('nlg/DEL_XUAT_GO_THEP_LSX',payload)
            // console.log(e)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
    },
      async update(e){

        const    payload = {
            ID:e.data.id,
            SL_TH: e.data.SL_TH,
            KLC_TH:roundNumber(((e.data.SL_TH * e.data.DAY*e.data.DAI*e.data.RONG)/1000000000),4),
            luadat: e.data.luadat,
            GHICHU:e.data.GHICHU,
        IDCONGDOAN:e.data.IDCONGDOAN,
            }
            const data = await this.$store.dispatch('nlg/UPDATE__XUAT_GO_THEP_LSX',payload)
            // console.log(e)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
    async loadCode() {
           if (this.idDepartment.code == "TH")  this.fa = 100000; 
            if (this.idDepartment.code == "YS1")  this.fa = 100003; 
             if (this.idDepartment.code == "YS1B")  this.fa = 100004; 
              if (this.idDepartment.code == "TB")  this.fa = 100005; 
      let payload = {
        fromDate: formatDateISO(this.fromDate),
        toDate: formatDateISO(this.toDate),
        factoryId:this.fa,
      };
      let data = await this.VIEW_XUAT_GO_DETAIL(payload);
      this.dataSource = data.data;
    },
  },
};
</script>
<style scoped>

#gridContainer {
  height: 650px;
 
}
</style>
