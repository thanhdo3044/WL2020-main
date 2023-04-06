<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-6 top-title text-orange">Nhận gỗ sấy lại</div>

          <div
            class="col-6 top-title cursor-pointer text-orange"
            align="right"
            @click="showChooseDate = true"
          >
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
          </div>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
              :data-source="dataSource"
              :show-borders="true"
              :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
              :show-column-lines="true"
              :allow-column-resizing="true"
            >
              <DxColumnChooser :enabled="true" />
              <DxHeaderFilter :visible="true" />
              <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              />
              <DxGrouping :auto-expand-all="true" />
              <!-- <DxColumn data-field="ID" caption="#" /> -->
              <DxColumn
                data-field="itemName"
                caption="Tên chi tiết"
                width="380"
              />
              <DxColumn caption="Qui Cách" alignment="center">
                <DxColumn
                  caption="Dầy"
                  data-field="height"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  caption="Rộng"
                  data-field="width"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  caption="Dài"
                  data-field="length"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
              </DxColumn>
              <DxColumn
                data-field="QUANTITY"
                caption="Số lượng"
                alignment="center"
                data-type="number"
                format="#,##0.####"
                width="160"
              />
                 <DxColumn
                data-field="KL"
                caption="Khối lượng"
                alignment="center"
                data-type="number"
                format="#,##0.####"
                width="160"
              />
              <DxColumn
                data-field="createDate"
                caption="Ngày giao"
                 data-type="date"
               format="dd/MM/yyyy"
                alignment="center"
                width="180"
              />
              <DxColumn data-field="VERIFY_BY"  alignment="center" caption="Xác nhận" width="160" />
              <DxColumn caption="..." width="100" cell-template="del-cell" />
              <template #del-cell="cell">
                <span
                  v-if="cell.data.data.VERIFY_BY == 'Chưa nhận'"
                  class="fake-link"
                  @click="onSelectionChanged(cell)"
                  >Xác nhận</span
                >
              </template>
              <DxSummary>
                <DxTotalItem
                  column="KL"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                   value-format="#,##0.####"
                />
                  <DxGroupItem
                  column="KL"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                   value-format="#,##0.####"
                />
              </DxSummary>

              <DxExport
                :enabled="true"
                :allow-export-selected-data="false"
                :file-name="
                  'Dữ liệu sản xuất chi tiết từ ngày ' +
                  tuNgay +
                  ' đến ngày ' +
                  denNgay
                "
              />
              <DxSearchPanel
                :visible="true"
                :placeholder="'Tìm kiếm'"
                :width="400"
              />
            </DxDataGrid>
          </div>
        </div>
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
import { mapGetters, mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxTotalItem,
  DxPaging,
  DxSearchPanel,
  DxExport,
  DxSummary,
  DxGroupItem,
  DxHeaderFilter,
  DxColumnChooser,
} from "devextreme-vue/data-grid";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import moment from "moment";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxTotalItem,
    DxPaging,
    DxSearchPanel,
    DxExport,
    DialogSelectDate,
    DxSummary,
    DxGroupItem,
    DxHeaderFilter,
    DxColumnChooser,
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
    ...mapGetters("base", ["userInfo"]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load();
  },
  methods: {
    ...mapActions("prod", ["getBCNhanSauSay", "updateBCNhanSauSay"]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.load();
    },
    async onChange(value) {
      // console.log(value.id);

      await this.load();
    },
    async load() {
      let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 07:00:00"),
        toDate: moment(this.toDate).add(1, "day").format("YYYY-MM-DD 06:59:59"),
      };

      const data = await this.getBCNhanSauSay(payload);
      this.dataSource = data.data;
      //  data.data.map((el) =>
      //   el.VERIFY_BY ? (el.VERIFY_BY = "Đã nhận") : (el.VERIFY_BY = "Chưa nhận")
      // );
    },
    async onSelectionChanged(e) {
      let payload = {
        accountId: this.userInfo.id,
        packageId: e.data.data.ID,
      };
      let result = await this.updateBCNhanSauSay(payload);
      this.load();
    },
  },
};
</script>

<style>
</style>