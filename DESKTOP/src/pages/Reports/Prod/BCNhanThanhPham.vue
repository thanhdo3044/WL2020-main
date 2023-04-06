<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-6 top-title text-orange">Báo cáo nhận thành phẩm</div>

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
              :word-wrap-enabled="true"
              :show-borders="true"
              :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
              :show-column-lines="true"
              :allow-column-resizing="true"
            >
              <DxEditing :allow-updating="true" mode="cell" />
              <DxColumnChooser :enabled="true" />
              <DxHeaderFilter :visible="true" />
              <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              />
              <DxGrouping :auto-expand-all="true" />
              <!-- <DxColumn data-field="ID" caption="#" /> -->
              <!-- <DxColumn
                data-field="TENSP"
                caption="Thị trường - Màu sắc"
                :allowEditing="false"
                width="320"
              /> -->
              <DxColumn
                data-field="itemName"
                caption="Chi tiết"
                :allowEditing="false"
                 sort-order="asc"
                width="320"
              />
              <DxColumn
                caption="Qui Cách"
                :allowEditing="false"
                alignment="center"
              >
                <DxColumn
                  caption="Dầy"
                  data-field="height"
                  format="fixedPoint"
                  :allowEditing="false"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  caption="Rộng"
                  data-field="width"
                  format="fixedPoint"
                  :allowEditing="false"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  caption="Dài"
                  data-field="length"
                  format="fixedPoint"
                  :allowEditing="false"
                  alignment="center"
                  width="90"
                />
              </DxColumn>
              <DxColumn
                data-field="QUANTITY"
                  alignment="left"
                caption="Số lượng ĐG đã giao"
                data-type="number"
                :allowEditing="false"
                format="###,##0"
                width="170"
              />
              <DxColumn
                data-field="QUANTITY_CON_LAI"
                caption="Số lượng chờ nhập kho"
                :allowEditing="false"
                alignment="left"
                data-type="number"
                format="#,##0.####"
                width="170"
              />
              <DxColumn
                data-field="DEPARTMENT_NAME"
                :allowEditing="false"
                caption="Công đoạn giao"
                width="170"
              />
                 <!-- <DxColumn
                data-field="market"
                caption="Mã thị trường"
                 alignment="left"
                width="160"
              /> -->
              <!-- <DxColumn
                data-field="SLNhan"
                caption="Số lượng nhận"
                alignment="left"
                width="120"
              /> -->
              <DxColumn
                data-field="QUANTITY_DA_NHAN"
                caption="Số lượng kho đã nhận"
                alignment="left"
                format="#,##0.####"
                :allowEditing="false"
                width="200"
              />
              <!-- <DxColumn
                alignment="center"
                :allowEditing="false"
                caption="Nhận về kho"
                width="100"
                cell-template="del-cell"
              />
              <template #del-cell="cell">
                <span
                  v-if="cell.data.data.QUANTITY_CON_LAI>0"
                  class="fake-link"
                  @click="onSelectionChanged(cell)"
                  >Nhận</span
                >
              </template> -->
              <DxSummary>
                <DxGroupItem
                  column="KL"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.00'"
                />
                <DxTotalItem
                  column="KL"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.00'"
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
  DxPaging,
  DxSearchPanel,
  DxEditing,
  DxExport,
  DxSummary,
  DxGroupItem,
  DxTotalItem,
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
import { showNotifySuccess, showNotifyError } from "../../../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxEditing,
    DxExport,
    DialogSelectDate,
    DxSummary,
    DxGroupItem,
    DxTotalItem,
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
    this.toDate.setDate(this.toDate.getDate());
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load();
  },
  methods: {
    ...mapActions("prod", ["getBCNhanThanhPham", "createBCNhanThanhPham"]),
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
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
      };

      const data = await this.getBCNhanThanhPham(payload);
      this.dataSource = data.data;
    },
    async onSelectionChanged(e) {
      if (e.data.data.SLNhan>e.data.data.QUANTITY_CON_LAI)
      {
            this.$q
          .dialog({
           
            message: "Bạn đã nhập vượt quá số lượng giao",
            cancel: true,
            persistent: true,
          })
      } else {
      let payload = {
        accountId: this.userInfo.id,
        quantity: e.data.data.SLNhan,
        itemId: e.data.data.ID,
        market_code:e.data.data.market,
        week:moment().weeks(),
        thang:moment().month() + 1,
      };
      let result = await this.createBCNhanThanhPham(payload);
      if (result.meta.success) {
        showNotifySuccess("Cập nhật thành công !");
      } else {
        showNotifyError();
      }
      }
      
      this.load();
    },
  },
};
</script>

<style>
</style>