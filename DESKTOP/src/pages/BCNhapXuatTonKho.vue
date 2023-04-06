<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary">
      <div class="row">
        <div class="col-6 top-title text-orange">Báo cáo xuất nhập tồn kho</div>
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
         <div class="col-2 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="factory1"
            :options="options"
            label="Chọn Nhà Máy"
            @input="loadDepartment"
            dense
          />
        </div>
        <div class="col-2 q-pa-sm">
        <q-select
         
          color="grey-3"
          label-color="orange"
          filled
          v-model="department"
          :options="departments"
          label="Chọn Công đoạn"
          @input="onChange"
          dense
        />
        </div>
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
          data-field="ITEM_ID"
          caption="ID"
           :width="90"
     
        />  
        <DxColumn
          data-field="NAME"
          caption="Sản phẩm/Chi tiết"
           :width="400"
          sort-order="asc"
        />
        <DxColumn alignment="center" caption="Quy Cách">
          <DxColumn
            data-field="LENGTH"
            :width="90"
            alignment="center"
            caption="Dài"
          />
          <DxColumn
            data-field="WIDTH"
            :width="90"
            alignment="center"
            caption="Rộng"
          />
          <DxColumn
            data-field="HEIGHT"
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
            format="#,##0.####"
          />
          <DxColumn
            :width="100"
            data-field="NHAP"
            caption="Nhập trong kỳ"
            data-type="number"
            format="#,##0.####"
          />
          <DxColumn
            :width="100"
            data-field="XUAT"
            caption="Số lượng xuất"
            data-type="number"
            format="#,##0.####"
          />

          <DxColumn
            :width="100"
            data-field="tong"
            caption="Tồn cuối kỳ"
            format="#,##0.####"
            :calculate-cell-value="calculateTong"
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
          <DxColumn
            :width="100"
            data-field="KLN"
            format="#,##0.00##"
            caption="Khối lượng nhập"
            :calculate-cell-value="calculateKLN"
          />
          <DxColumn
            :width="100"
            data-field="KLX"
            format="#,##0.00##"
            caption="Khối lượng xuất"
            :calculate-cell-value="calculateKLX"
          />
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
            column="XUAT"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.####'"
          />
          <DxTotalItem
            column="TON_DAU_KY"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.####'"
          />

          <DxTotalItem
            column="NHAP"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
           :value-format="'#,##0.####'"
          />
          <DxTotalItem
            column="tong"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.####'"
          />
          <DxTotalItem
            column="KLTDK"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.####'"
          />
          <DxTotalItem
            column="KLN"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.####'"
          />
          <DxTotalItem
            column="KLX"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.####'"
          />
          <DxTotalItem
            column="KL"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.####'"
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
      ngay:'20210712',
        factory1: null,
        options: [
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102340,
          code: "YS1B",
        },
        {
          label: "NM CBG Thái Bình",
          factoryId: 102366,
          code: "TB",
        },
      ],
      factoryId:null,
      showChooseDate: false,
      dataSource: [],
      department: null,
      departments: [],
    };
  },
  created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    //this.loadDepartment();
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
    ...mapActions("prod", ["getDepartmentByKho", "getXuatNhapKho"]),
    async loadDepartment() {
      this.departments = [];
      this.department = null
      let data = await this.getDepartmentByKho();
      data.data.forEach((el) => {
        if (el.factoryId ==  this.factory1.factoryId)
        this.departments.push({
          label: el.NAME,
          value: el.ID,
        });
      });
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      if (this.department != null) {
        this.load();
      }
    },
    async load() {
      let payload = {
        fromDate: formatDateISO(this.fromDate),
        toDate: formatDateISO(this.toDate),
        stepId: this.department.value,
        ngay:this.ngay,
        factoryId: this.factoryId
      };
      console.log("payload", payload);
      let data = await this.getXuatNhapKho(payload);
      this.dataSource = data.data;
    },
    calculateTong(rowData) {
      rowData.tong = rowData.TON_DAU_KY + rowData.NHAP - rowData.XUAT;
      return rowData.tong;
    },
    calculateKLTDK(rowData) {
      rowData.KLTDK = rowData.TON_DAU_KY * rowData.VOLUMN;
      return rowData.KLTDK;
    },
    calculateKLN(rowData) {
      rowData.KLN = rowData.NHAP * rowData.VOLUMN;
      return rowData.KLN;
    },
    calculateKLX(rowData) {
      rowData.KLX = rowData.XUAT * rowData.VOLUMN;
      return rowData.KLX;
    },
    calculateKL(rowData) {
      rowData.KL = rowData.tong * rowData.VOLUMN;
      return rowData.KL;
    },
    onChange() {
    
      this.ngay = '20210712'
      if (this.department.value == 102488) this.ngay = '20220428'
       if (this.department.value == 102487) this.ngay = '2022-06-09 11:30:00'
       if (this.department.value == 102608) this.ngay = '20211015'
      if (this.department.value == 102610) this.ngay = '20210926'
       if (this.department.value == 102460) this.ngay = '2022-04-07 13:00:00'
      if (this.department.value == 102495) this.ngay = '20220609'
        if (this.department.value == 102543) this.ngay = '20220425'
      if (this.department.value == 102493){ 
        this.factoryId = 100003
        this.ngay = '20220606'
      }
      if (this.department.value == 102494) { this.factoryId = 100005
        this.ngay = '20220609'
      }
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