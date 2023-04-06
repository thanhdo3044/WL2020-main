<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-6 top-title text-orange">Báo cáo sản lượng nhóm cắt</div>

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
          <q-select
          class="col-2"
          color="grey-3"
          label-color="orange"
          filled
          v-model="factory"
          :options="options"
          label="Chọn Nhà Máy"
          @input="onChange"
          dense
        />
          <div class="col-12">
            <DxDataGrid
              :data-source="dataSource"
              :show-borders="true"
              :word-wrap-enabled="true"
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
              <DxColumn
                data-field="SOURCE_NAME"
                caption="Công đoạn giao"
                width="160"
              />
              <DxColumn caption="Qui Cách" alignment="center">
                <DxColumn
                  caption="Dầy"
                  data-field="DAY"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  caption="Rộng"
                  data-field="RONG"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  caption="Dài"
                  data-field="DAI"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
              </DxColumn>
               <DxColumn
                data-field="SL_TH"
                caption="Số lượng thanh hạ cấp"
                alignment="center"
                data-type="number"
                format="#,##0.####"
                width="180"
              />
               <DxColumn
                data-field="KLC_TH"
                caption="Khối lượng thanh hạ cấp"
                alignment="center"
                data-type="number"
                format="#,##0.####"
                width="180"
              />
              <DxColumn caption="Qui Cách Hạ Cấp Về" alignment="center">
                <DxColumn
                  caption="Dầy"
                  data-field="HEIGHT"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  caption="Rộng"
                  data-field="WIDTH"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  caption="Dài"
                  data-field="LENGTH"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
              </DxColumn>
              <DxColumn
                data-field="SL_HC"
                caption="Số lượng cắt đạt"
                alignment="center"
                data-type="number"
                format="#,##0.####"
                width="160"
              />
              <DxColumn
                data-field="KLC_HC"
                caption="Khối lượng cắt đạt"
                alignment="center"
                data-type="number"
                format="#,##0.####"
                width="160"
              />
              <DxColumn
                data-field="DESTINATION_NAME"
                caption="Công đoạn nhận"
                width="160"
              />
              <DxColumn
                data-field="DESTINATION_NAME_HC"
                caption="Công đoạn nhận khối lượng thừa"
                alignment="center"
                width="160"
              />

                
                 
                 <DxColumn
                data-field="KLC_HC"
                caption="Phôi ván ghép thanh"
                alignment="center"
                data-type="number"
                format="#,##0.####"
                width="180"
              />
              
              <DxSummary>
                <DxTotalItem
                  column="KLC_TH"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                   value-format="#,##0.####"
                />
                <DxTotalItem
                  column="KLC_HC"
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
      factory: {
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
          factoryId: 100004,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 100005,
          code: "TB",
        },
      ],
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
    ...mapActions("item", ["getBCXuatCatHaCap"]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.load();
    },
    async onChange() {
      await this.load();
    },
    async load() {
      let payload = {
        factoryId: this.factory.factoryId,
        fromDate: moment(this.fromDate).format("YYYY-MM-DD"),
        toDate: moment(this.toDate).format("YYYY-MM-DD"),
      };
      const data = await this.getBCXuatCatHaCap(payload);
      this.dataSource = data;
    },
  },
};
</script>

<style>
</style>