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
        :no-data-text="'Không có dữ liệu'"
      >
        <DxExport
                :enabled="true"
                :allow-export-selected-data="true"
                :file-name="title"
              />
        <DxSorting mode="none" />
            <DxScrolling mode="infinite" />
              <DxGroupPanel
            :visible="true"
            :empty-panel-text="
              'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'
            "
          />
      <DxHeaderFilter :visible="true" />
      <DxFilterRow :visible="true" />
         <DxColumn data-field="createdAt" :width="200" caption="Ngày tạo" data-type="date"
                  format="dd/MM/yyyy HH:mm:ssZ" />
        <DxColumn data-field="NAME" caption="Chi tiết" :width="550" />
        <DxColumn alignment="center" caption="Quy Cách">
          <DxColumn data-field="DAI" :width="90" alignment="center" caption="Dài" />
          <DxColumn data-field="RONG" :width="90" alignment="center" caption="Rộng" />
          <DxColumn data-field="DAY" :width="90" alignment="center" caption="Dày" />
        </DxColumn>
        <DxColumn data-field="SL_TH" :width="90" caption="Số lượng" />
          <DxColumn data-field="volumn" :width="90" caption="khối lượng" format="#,##0.00##" :calculate-cell-value="calculateKL" />
        <DxColumn data-field="XUATNHAP" :group-index="0" :width="90" caption="Xuất LP/HC" />
        <DxColumn data-field="SOURCE_NAME" :width="150" caption="Công đoạn giao" />
         <DxColumn alignment="center"  :visible="true" caption="Quy Cách hạ cấp về">
          <DxColumn data-field="LENGTH" :width="90" alignment="center" caption="Dài" />
          <DxColumn data-field="WIDTH" :width="90" alignment="center" caption="Rộng" />
          <DxColumn data-field="HEIGHT" :width="90" alignment="center" caption="Dày" />
        </DxColumn>
        <DxColumn data-field="SL_HC" :width="90" caption="Số lượng HC" />
         <DxColumn data-field="volumnhc" :width="90" caption="khối lượng HC" format="#,##0.00##" :calculate-cell-value="calculateKLHC" />
          <DxColumn data-field="DESTINATION_NAME" :width="150" caption="Công đoạn nhận " />
        <DxColumn data-field="KLC_HC" :width="90" format="#,##0.####" caption="Khối lượng rối" />
         <DxColumn data-field="DESTINATION_NAME_HC"  :width="150" caption="Công đoạn nhận KL rối " />
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
             <DxGroupItem
              :show-in-group-footer="false"
                :align-by-column="true"
              column="SL_TH"
              summary-type="sum"
              value-format="###,##0.####"
              display-format="{0}"
            />
             <DxGroupItem
              :show-in-group-footer="false"
                :align-by-column="true"
              column="SL_HC"
              summary-type="sum"
              value-format="###,##0.####"
              display-format="{0}"
            />
              <DxGroupItem
              :show-in-group-footer="false"
                :align-by-column="true"
              column="volumn"
              summary-type="sum"
              value-format="###,##0.####"
              display-format="{0}"
            />  <DxGroupItem
              :show-in-group-footer="false"
                :align-by-column="true"
              column="volumnhc"
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
              <DxTotalItem
              column="volumnhc"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
                      <DxTotalItem
              column="KLC_HC"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
             <DxTotalItem
              column="SL_HC"
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
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../ultils";
import { DxDataGrid,DxExport,DxGroupItem,DxGroupPanel, DxHeaderFilter,DxColumn,DxSummary,DxTotalItem, DxFilterRow,
DxScrolling } from "devextreme-vue/data-grid";
export default {
  components: {
    DialogSelectDate,
    DxDataGrid,
    DxExport,
    DxGroupItem,
    DxGroupPanel,
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
      cat:true,
      fa: 100000,
      idDepartment: 
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102299,
          code: "YS1B",
        },
        options: [
        // {
        //   label: "Nhà máy CBG Thuận Hưng",
        //   factoryId: 100000,
        //   code: "TH",
        // },
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
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.loadCode();

  },
  methods: {
    ...mapActions("production", [
      "VIEW_XUAT_GO_DETAIL_LUA_PHOI"
    ]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
       calculateKL(rowData){
      if (rowData.DAI > 0)  rowData.volumn = (rowData.DAI*rowData.RONG*rowData.DAY*rowData.SL_TH)/1000000000;
      else rowData.volumn = rowData.SL_TH
      return rowData.volumn;
    },
         calculateKLHC(rowData){
      if (rowData.DAI > 0)  rowData.volumnhc = (rowData.DAI*rowData.RONG*rowData.DAY*rowData.SL_HC)/1000000000;
      else rowData.volumnhc = rowData.SL_HC
      return rowData.volumnhc;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadCode();
    },
    async loadCode() {
           if (this.idDepartment.code == "TH")  this.fa = 100000; 
            if (this.idDepartment.code == "YS1A")  this.fa = 100003; 
             if (this.idDepartment.code == "YS1B")  this.fa = 100004; 
              if (this.idDepartment.code == "TB")  this.fa = 100005; 
      let payload = {
        fromDate: formatDateISO(this.fromDate),
        toDate: formatDateISO(this.toDate),
        factoryId:this.fa,
      };
      let data = await this.VIEW_XUAT_GO_DETAIL_LUA_PHOI(payload);
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
