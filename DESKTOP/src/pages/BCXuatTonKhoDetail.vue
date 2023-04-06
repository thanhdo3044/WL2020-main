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
        <q-select
          class="col-2"
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
  <DxHeaderFilter :visible="true" />
        <DxPaging :enabled="false" />
           <DxExport
          :enabled="true"
          :allow-export-selected-data="false"
          :file-name="tieude"
        />
        <DxScrolling column-rendering-mode="virtual" />
             <DxSearchPanel
                :visible="true"
                :width="240"
                placeholder="Tìm kiếm..."
              />
        <!-- <DxColumn data-field="YEAR" :width="90" alignment="center" caption="Năm" />
        <DxColumn data-field="WEEK" :width="90" alignment="center" caption="Tuần" />
        <DxColumn data-field="WEEKDAY" :width="90" alignment="center" caption="Thứ" /> -->
        <DxColumn data-field="Chi tiết/cụm" :width="300" caption="Chi tiết/Cụm" />
        <DxColumn data-field="Dài" :width="90" alignment="center" caption="Dài" />
        <DxColumn data-field="Rộng" :width="90" alignment="center" caption="Rộng" />
        <DxColumn data-field="Dầy" :width="90" alignment="center" caption="Dày" />
   
        <DxColumn data-field="Số lượng" :width="90" caption="Số lượng" />
        <DxColumn data-field="khoiluong" :width="100" caption="Khối lượng" format="#,##0.####" />
        <!-- <DxColumn data-field="DEPARTMENT_NAME" :width="200" caption="Nơi nhận" /> -->
 
        <DxColumn data-field="Người giao" caption="Người giao" />
        <DxColumn data-field="Ngày giờ giao" caption="Ngày giao" />
        <DxColumn data-field="Nơi xuất" caption="Nơi nhận" />
         <DxColumn data-field="Ngày giờ nhận" caption="Ngày nhận" />
         <DxColumn data-field="Người nhận" caption="Người nhận" />
           <DxColumn data-field="GHICHU" caption="Ghi chu" />
        <DxSummary>
          <DxTotalItem column="Chi tiết/cụm" :display-format="'Tổng cộng:'" />
          <DxTotalItem
            column="Số lượng"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'decimal'"
          />
          <DxTotalItem
            column="khoiluong"
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
  DxExport,
  DxSearchPanel,
  DxHeaderFilter,
  DxFilterPanel,
  DxTotalItem,
  DxGroupPanel,
    DxPaging,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DialogSelectDate,
    DxDataGrid,
    DxColumn,
    DxExport,
    DxSummary,
    DxSearchPanel,
    DxHeaderFilter,
    DxFilterPanel,
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
      department: null,
      departments: [],
    };
  },
  created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.loadDepartment();
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
    ...mapActions("prod", ["getDepartmentByKho", "getXuatKhoDetail"]),
    async loadDepartment() {
      this.departments = [];
      let data = await this.getDepartmentByKho();
      data.data.forEach((el) => {
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
      };
      console.log("payload", payload);
      let data = await this.getXuatKhoDetail(payload);
      this.dataSource = data.data;
    },
    onChange() {
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