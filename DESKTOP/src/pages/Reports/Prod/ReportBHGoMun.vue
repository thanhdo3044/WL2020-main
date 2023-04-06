<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-6 top-title text-orange">Bảng tổng hợp bán hàng</div>
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
        <DxDataGrid
          :data-source="dataSource"
          :show-borders="true"
          :word-wrap-enabled="true"
          :show-row-lines="true"
          :show-column-lines="true"
          :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
          :allow-column-resizing="true"
        >
          <DxHeaderFilter :visible="true" />
          <DxExport :enabled="true" />

          <DxColumn caption="Thời gian bốc hàng" alignment="center">
            <DxColumn
              data-field="CREATED_AT"
              caption="Ngày"
              data-type="date"
              format="dd/MM/yyyy"
              :width="150"
              alignment="center"
            />
            <DxColumn
              data-field="THU"
              caption="Thứ"
              :width="90"
              alignment="center"
            />
            <DxColumn
              data-field="TUAN"
              caption="Tuần"
              :width="90"
              alignment="center"
            />
            <DxColumn
              data-field="THANG"
              caption="Tháng"
              :width="90"
              alignment="center"
            />
            <DxColumn
              data-field="NAM"
              caption="Năm"
              :width="90"
              alignment="center"
            />
          </DxColumn>
          <DxColumn
            data-field="CUSTOMER_NAME"
            caption="Khách hàng"
          />
          <DxColumn data-field="CODE" caption="Số phiếu cân" :width="120" />
          <DxColumn :group-index="0" sort-order="desc" data-field="HANG_HOA" caption="Loại hàng" :width="150" />
          <DxColumn data-field="FACTORY_NAME" caption="Kho bốc" :width="230" />
          <DxColumn
            data-field="TOTAL_VOLUMN"
            format="#,##0"
            caption="Trọng lượng tổng (Kg)"
            :width="120"
          />
          <DxColumn
            data-field="BI_VOLUMN"
            format="#,##0"
            caption="Trọng lượng bì (Kg)"
            :width="120"
          />
          <DxColumn
            data-field="VOLUMN"
            format="#,##0"
            caption="Trọng lượng hàng (Kg)"
            :width="120"
          />
          <DxColumn
            data-field="GIATIEN"
            format="#,##0"
            caption="Tiên cân hàng (VND)"
            :width="120"
          />
          <DxColumn
            data-field="GIATIENCB"
            format="#,##0"
            caption="Tiền cân bì (VND)"
            :width="120"
          />
          <DxColumn
            data-field="total"
            format="#,##0"
            caption="Tổng tiền"
            :width="120"
            :calculate-cell-value="calculatePrice"
          />
          <DxSummary>
            <DxGroupItem
              column="TOTAL_VOLUMN"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
            <DxGroupItem
              column="BI_VOLUMN"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
            <DxGroupItem
              column="VOLUMN"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
            <DxGroupItem
              column="GIATIEN"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
            <DxGroupItem
              column="GIATIENCB"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
            <DxGroupItem
              column="total"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />

            <DxTotalItem
              column="TOTAL_VOLUMN"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
            <DxTotalItem
              column="BI_VOLUMN"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
            <DxTotalItem
              column="VOLUMN"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
            <DxTotalItem
              column="GIATIEN"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
            <DxTotalItem
              column="GIATIENCB"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
            <DxTotalItem
              column="total"
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
    </q-card>
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxSummary,
  DxTotalItem,
  DxHeaderFilter,
  DxExport,
  DxGroupItem
} from "devextreme-vue/data-grid";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
  showNotifySuccess,
  showNotifyError,
} from "../../../ultils";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSummary,
    DxTotalItem,
    DxHeaderFilter,
    DxExport,
    DxGroupItem,
    DialogSelectDate,
  },
  data() {
    return {
      showChooseDate: false,
      dataSource: [],
      fromDate: null,
      toDate: null,
    };
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
    ...mapGetters("base", ["myFactoryInfor", "userInfo"]),
  },
  created() {
    this.toDate = new Date();
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load();
  },
  methods: {
    calculatePrice( rowData){
      rowData.total = rowData.GIATIEN + rowData.GIATIENCB;
      return rowData.total;
    },
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
      };
      const data = await this.$store.dispatch(
        "prod/GET_REPORT_EP_MUN",
        payload
      );
      this.dataSource = data;
      console.log("data", data);
    },
  },
};
</script>

<style>
</style>