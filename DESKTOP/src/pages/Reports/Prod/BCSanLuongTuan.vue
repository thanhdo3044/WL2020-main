<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-6 top-title text-orange">
            Nhận sản lượng về Thuận Hưng
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
      <q-separator inset />
      <q-card-section>
        <div class="row">
          <div class="col-2">
            <q-select
              outlined
              v-model="factory"
              :options="options"
              label="Chọn nhà máy"
              @input="onChange"
            />
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
              id="gridContainer"
              :data-source="dataSource"
              :show-borders="true"
              :show-row-lines="true"
              :word-wrap-enabled="true"
            >
              <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              />
              <DxExport :enabled="true" :allow-export-selected-data="true" />
              <DxPaging :enabled="false" />
              <DxScrolling column-rendering-mode="virtual" />
              <DxHeaderFilter :visible="true" />
              <DxFilterRow :visible="true" />
              <DxColumn data-field="departmentName" caption="Công đoạn" :group-index="0" />
              <DxColumn data-field="parentName" caption="Sản phẩm" :group-index="1" />
              <DxColumn data-field="itemName" caption="Chi tiết" />
                <DxColumn caption="Số lượng" alignment="center">
                <DxColumn data-field="Monday"  caption="Thứ 2" :width="90" alignment="center" format="#,##0.####"/>
                <DxColumn data-field="Tuesday"  caption="Thứ 3" :width="90" alignment="center" format="#,##0.####"/>
                <DxColumn data-field="Wednesday"  caption="Thú 4" :width="90" alignment="center" format="#,##0.####"/>
                <DxColumn data-field="Thursday"  caption="Thứ 5" :width="90" alignment="center" format="#,##0.####"/>
                <DxColumn data-field="Friday"  caption="Thứ 6" :width="90" alignment="center" format="#,##0.####"/>
                <DxColumn data-field="Saturday"  caption="Thứ 7" :width="90" alignment="center" format="#,##0.####"/>
                <DxColumn data-field="Sunday"  caption="Chủ nhật" :width="90" alignment="center" format="#,##0.####"/>
                </DxColumn>
              <DxColumn
                data-field="tong"
                caption="Tổng cộng"
                :width="120"
                alignment="center"
                format="#,##0.####"
                :calculate-cell-value="calculateTong"
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
import { mapActions } from "vuex";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import { getFisrtDayOfMonth, formatDateVN } from "../../../ultils";
import {
  DxDataGrid,
  DxFilterRow,
  DxHeaderFilter,
  DxSummary,
  DxColumn,
  DxGroupPanel,
  DxPaging,
  DxScrolling,
  DxExport,
} from "devextreme-vue/data-grid";
import moment from "moment";
export default {
  components: {
    DialogSelectDate,
    DxFilterRow,
    DxSummary,
    DxHeaderFilter,
    DxDataGrid,
    DxColumn,
    DxGroupPanel,
    DxPaging,
    DxScrolling,
    DxExport,
  },
  data() {
    return {
      dataSource: [],
      ys1a: true,
      ys1b: true,
      tb: true,
      factory: {
        label: "Nhà máy CBG Thuận Hưng",
        factoryId: 100000,
      },
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 100004,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 100005,
        },
      ],
      showChooseDate: false,
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
  },
  async created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load();
  },
  methods: {
    ...mapActions("production", ["GET_SAN_LUONG_THEO_TUAN"]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.load();
    },
    calculateTong(rowData) {
        rowData.tong = rowData.Monday + rowData.Tuesday + rowData.Wednesday + rowData.Thursday + rowData.Friday + rowData.Saturday + rowData.Sunday;
        return rowData.tong;
    },
    async onChange(value) {
      this.load();
    },
    async load() {
      let payload = {
        fromDate: moment(this.fromDate).format().slice(0, 10),
        toDate: moment(this.toDate).format().slice(0, 10),
        factoryId: this.factory.factoryId,
      };
      let data = await this.GET_SAN_LUONG_THEO_TUAN(payload);
      this.dataSource = data.data;
    },
  },
};
</script>

<style>
#gridContainer {
  max-height: 800px;
}
</style>