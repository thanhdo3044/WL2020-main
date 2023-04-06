<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary">
      <div class="row">
        <div class="col-6 top-title text-orange">Báo cáo xuất nhập tồn kho gỗ tươi</div>
        <div
          class="col-6 top-title text-orange cursor-pointer"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày {{ tuNgay }} đến {{ denNgay }}
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row">
         <q-select
         class="col-2"
            color="grey-3"
            label-color="orange"
            filled
            v-model="factory1"
            :options="options"
            label="Chọn Nhà Máy"
            @input="onChange"
            dense
          />
      </div>
    </q-card-section>
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
            :allow-export-selected-data="false"
            :file-name="'Xuất gỗ'"
            />
          <DxHeaderFilter :visible="true" />
        <DxPaging :enabled="false" />
        <DxScrolling column-rendering-mode="virtual" />
               <DxSearchPanel
                :visible="true"
                :width="240"
                placeholder="Tìm kiếm..."
              />
        <DxColumn
          data-field="NAME"
          caption="Sản phẩm/Chi tiết"
           :width="400"
          sort-order="asc"
        />
        <DxColumn alignment="center" caption="Quy Cách">
          <DxColumn
            data-field="DAI"
            :width="90"
            alignment="center"
            caption="Dài"
          />
          <DxColumn
            data-field="RONG"
            :width="90"
            alignment="center"
            caption="Rộng"
          />
          <DxColumn
            data-field="DAY"
            :width="90"
            alignment="center"
            caption="Dày"
          />
        </DxColumn>
        <DxColumn alignment="center" caption="Thanh">
          <DxColumn
            :width="100"
            data-field="TON_DAU_KY"
            caption="Tồn đầu kỳ"
            data-type="number"
            format="#,##0.00"
          />
           <DxColumn alignment="center" caption="Nhập">
          <DxColumn
            :width="100"
            data-field="NHAP"
            caption="Nhập trong kỳ"
            data-type="number"
            format="#,##0.00"
          />
            <DxColumn
            :width="100"
            data-field="nhapnb"
            caption="Nhập nội bộ"
            data-type="number"
            format="#,##0.00"
          />
           </DxColumn>
            <DxColumn alignment="center" caption="Xuất">
          <DxColumn
            :width="100"
            data-field="xepsay"
            caption="Số lượng xếp sấy"
            data-type="number"
            format="#,##0.00"
          />
            <DxColumn
            :width="100"
            data-field="xuatnb"
            caption="Xuất nội bộ"
            data-type="number"
            format="#,##0.00"
          />
            </DxColumn>
          <DxColumn
            :width="100"
            data-field="TONKKHOYS"
            caption="Tồn cuối kỳ"
            format="#,##0.00"
       
          />
        </DxColumn>

        <DxColumn
          :width="100"
          data-field="VOLUMN"
          caption="Khối lượng thanh"
          data-type="number"
          format="#,##0.00"
          :visible="false"
        />
        <DxColumn alignment="center" caption="M3">

          <DxColumn
            :width="100"
            data-field="KLTDK"
            format="#,##0.00##"
            caption="Khối lượng tồn đầu kỳ"
            :calculate-cell-value="calculateKLTDK"
          />
           <DxColumn alignment="center" caption="Nhập">
          <DxColumn
            :width="100"
            data-field="KLN"
            format="#,##0.00##"
            caption="KL nhập trong kỳ"
            :calculate-cell-value="calculateKLN"
          />
        
             <DxColumn
            :width="100"
            data-field="KLNNB"
            format="#,##0.00##"
            caption="KLnhập nội bộ"
            :calculate-cell-value="calculateKLNnb"
          />
             </DxColumn>
           <DxColumn alignment="center" caption="Xuất">
          <DxColumn
            :width="100"
            data-field="KLX"
            format="#,##0.00##"
            caption="KL xuất trong kỳ"
            :calculate-cell-value="calculateKLX"
          />
              <DxColumn
            :width="100"
            data-field="KLXNB"
            format="#,##0.00##"
            caption="KL xuất nội bộ"
            :calculate-cell-value="calculateKLXnb"
          />
           </DxColumn>
          <DxColumn
            :width="100"
            data-field="KL"
            format="#,##0.00##"
            caption="Khối lượng tồn cuối kỳ"
            :calculate-cell-value="calculateKL"
          />
        </DxColumn>
        <DxSummary>
          <DxTotalItem column="NAME" :display-format="'Tổng cộng:'" />
          <DxTotalItem
            column="xepsay"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'decimal'"
          />
          <DxTotalItem
            column="TON_DAU_KY"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'decimal'"
          />

          <DxTotalItem
            column="NHAP"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'decimal'"
          />
          <DxTotalItem
            column="TONKKHOYS"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'decimal'"
          />
          <DxTotalItem
            column="KLTDK"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.0000'"
          />
            <DxTotalItem
            column="xuatnb"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0'"
          />
            <DxTotalItem
            column="nhapnb"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0'"
          />
            <DxTotalItem
            column="KLNNB"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.0000'"
          />
            <DxTotalItem
            column="KLXNB"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.0000'"
          />
          <DxTotalItem
            column="KLN"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.0000'"
          />
          <DxTotalItem
            column="KLX"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.0000'"
          />
          <DxTotalItem
            column="KL"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.0000'"
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
import DialogSelectDate from "components/commons/DialogSelectFromDateToDate";
import {
  formatDateISO,
  formatDateVN,
  getFisrtDayOfMonth,
  showNotifySuccess,
  showNotifyError,
} from "../ultils";
import { mapGetters, mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxSummary,
  DxHeaderFilter,
  DxSearchPanel,
  DxExport,
  DxFilterRow,
  DxTotalItem,
  DxGroupPanel,
    DxPaging,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DialogSelectDate,
    DxDataGrid,
    DxColumn,
    DxHeaderFilter,
    DxSearchPanel,
    DxExport,
    DxFilterRow,
    DxSummary,
    DxTotalItem,
    DxGroupPanel,
    DxPaging,
  },
  data() {
    return {
      fromDate: null,
      toDate: null,
      showChooseDate: false,
      dataSource: [],
      ngay: null,
      stepId:102337,
      factory1:    {
          id: 100003,
          label: "Nhà máy CBG YS1",
        },
      
      kho: "YS1",
        options: [
        {
          id: 100000,
          label: "Nhà máy CBG Thuận Hưng",
        },
        {
          id: 100003,
          label: "Nhà máy CBG YS1",
        },
      
        {
          id: 100005,
          label: "NMCBG TB",
        },
      ],
      department: null,
      departments: [],
    };
  },
  created() {
     if (this.factory1.id == 100000) { this.kho = 'TH';this.stepId = 102805; this.ngay = '2023-02-02 00:00' }
        if (this.factory1.id == 100003) { this.kho = 'YS1';this.stepId = 102807; this.ngay = '2023-02-01 00:00'}
        if (this.factory1.id == 100005) { this.kho = 'TB';this.stepId = 102806;this.ngay = '2023-02-01 00:00' }
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    //this.loadDepartment();
    this.load();
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
  methods: {
    ...mapActions("prod", ["getXuatNhapKhogotuoi"]),
    
   
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
  
        this.load();
      
    },
    async load() {
      let payload = {
        fromDate: formatDateISO(this.fromDate),
        toDate: formatDateISO(this.toDate),
        stepId: this.stepId,
        makho:this.kho,
        factoryId: this.factory1.id ,
        ngay:this.ngay
      };
    
      let data = await this.getXuatNhapKhogotuoi(payload);
      this.dataSource = data.data;
    },
    // calculateTong(rowData) {
    //   rowData.tong = rowData.TON_DAU_KY + rowData.NHAP - rowData.XUAT;
    //   return rowData.tong;
    // },
    calculateKLTDK(rowData) {
      rowData.KLTDK = rowData.TON_DAU_KY * rowData.DAY*rowData.DAI*rowData.RONG/1000000000;
      return rowData.KLTDK;
    },
    calculateKLN(rowData) {
      rowData.KLN = rowData.NHAP * rowData.DAY*rowData.DAI*rowData.RONG/1000000000;
      return rowData.KLN;
    },
     calculateKLNnb(rowData) {
      rowData.KLNNB = rowData.nhapnb * rowData.DAY*rowData.DAI*rowData.RONG/1000000000;
      return rowData.KLNNB;
    },
    calculateKLX(rowData) {
      rowData.KLX = rowData.xepsay * rowData.DAY*rowData.DAI*rowData.RONG/1000000000;
      return rowData.KLX;
    },
       calculateKLXnb(rowData) {
      rowData.KLXNB = rowData.xuatnb * rowData.DAY*rowData.DAI*rowData.RONG/1000000000;
      return rowData.KLXNB;
    },
    calculateKL(rowData) {
      rowData.KL = rowData.TONKKHOYS * rowData.DAY*rowData.DAI*rowData.RONG/1000000000;
      return rowData.KL;
    },
    onChange() {
         if (this.factory1.id == 100000) { this.kho = 'TH';this.stepId = 102805; this.ngay = '2023-02-02 00:00' }
        if (this.factory1.id == 100003) { this.kho = 'YS1';this.stepId = 102807; this.ngay = '2023-02-01 00:00'}
        if (this.factory1.id == 100005) { this.kho = 'TB';this.stepId = 102806;this.ngay = '2023-02-01 00:00' }
      this.load();
    },
  },
};
</script>

<style>
#gridContainer {
  max-height: 800px;
}
</style>