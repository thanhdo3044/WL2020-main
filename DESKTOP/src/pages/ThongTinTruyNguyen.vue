<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div
            class="col-6 top-title text-orange"
          >Báo cáo thông tin truy nguyên - {{myFactoryInfor.name}}</div>
          <div
            class="col-6 top-title cursor-pointer text-orange"
            align="right"
            @click="showChooseDate=true"
          >Từ ngày {{tuNgay}} đến {{denNgay}}</div>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
              :data-source="thongTinTruyNguyens"
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
              <!-- <DxColumn data-field="id" caption="#" /> -->
              <!-- <DxColumn data-field="po" caption="po" /> -->
              <DxColumn data-field="number" caption="Lệnh sản xuất" />
              <DxColumn data-field="departmentName" caption="Công đoạn" />
              <DxColumn data-field="sanPham" caption="Sản phẩm" />
              <DxColumn caption="Qui Cách" alignment="center">
                <DxColumn
                  caption="Dầy"
                  data-field="height"
                  format="fixedPoint"
                  alignment="center"
                  width="60"
                />
                <DxColumn
                  caption="Rộng"
                  data-field="width"
                  format="fixedPoint"
                  alignment="center"
                  width="60"
                />
                <DxColumn
                  caption="Dài"
                  data-field="length"
                  format="fixedPoint"
                  alignment="center"
                  width="60"
                />
              </DxColumn>

              <DxColumn data-field="supplies" caption="Tên/Loại" />
              <DxColumn data-field="quantity" caption="SL" />

              <DxColumn data-field="vendor" caption="Nhà CC" />
              <DxColumn data-field="parcel" caption="Mã lô" />
              <DxColumn data-field="createDate" caption="Ngày tháng" data-type="date" />
              <DxSummary>
                <DxGroupItem
                  column="quantity"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'fixedpoint'"
                />
              </DxSummary>
              <DxExport
                :enabled="true"
                :allow-export-selected-data="false"
                :file-name="'Dữ liệu sản xuất chi tiết từ ngày '+tuNgay+' đến ngày '+denNgay"
              />
              <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400" />
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
  DxExport,
  DxSummary,
  DxGroupItem,
  DxHeaderFilter,
  DxColumnChooser,
} from "devextreme-vue/data-grid";
import DialogSelectDate from "../components/commons/DialogSelectFromDateToDate";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
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
    ...mapGetters("sanxuat", ["thongTinTruyNguyens"]),
    ...mapGetters("base", ["myFactoryInfor"]),
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
    ...mapActions("sanxuat", ["getAllTruyNguyen"]),
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
        factoryId: this.myFactoryInfor.id,
      };
      this.getAllTruyNguyen(payload);
    },
  },
};
</script>

<style>
</style>