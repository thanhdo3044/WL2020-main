<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-6 top-title text-orange">
            Báo cáo sản lượng lựa đạt
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
      <div class="row print-hide">
        <q-select
          class="col-2 q-ml-sm"
          @input="loadCode"
          label-color="orange"
          dense
          filled
          v-model="idDepartment"
          :options="options"
          label="Chọn nhà máy"
        />
      </div>
      <q-card-section>
        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
              id="gridContainer"
              :data-source="dataSource"
              :show-borders="true"
              key-expr="NAME"
              :show-row-lines="true"
              :word-wrap-enabled="true"
            >
              <DxExport :enabled="true" :allow-export-selected-data="true" />
              <DxPaging :enabled="false" />
              <DxScrolling column-rendering-mode="virtual" />
              <DxHeaderFilter :visible="true" />
              <DxFilterRow :visible="true" />
              <DxColumn caption="Tổng" alignment="center"
               :group-index="0"
              />
              <DxColumn data-field="NAME" caption="Tên chi tiết" width="350" />
              <DxColumn caption="Quy cách" alignment="center">
                <DxColumn
                  data-field="DAY"
                  caption="Dày"
                  alignment="center"
                  width="100"
                />
                <DxColumn
                  data-field="RONG"
                  caption="Rộng"
                  alignment="center"
                  width="100"
                />
                <DxColumn
                  data-field="DAI"
                  caption="Dài"
                  alignment="center"
                  width="100"
                />
              </DxColumn>
           
              <DxColumn
                data-field="QUANTITY"
                caption="Số lượng"
                alignment="center"
                width="150"
              />
              <DxColumn
                data-field="KLBAO"
                caption="Khối lượng"
                alignment="center"
                width="150"
                format="#,##0.####"
             
              />
              <DxColumn
                  data-field="nguoigiao"
                  caption="Người giao"
                  alignment="center"
                  width="180"
                />
                  <DxColumn
                  data-field="createdAt"
                  caption="Ngày giao"
                  alignment="center"
                  width="200"
                />
              <DxColumn
                  data-field="nguoiNhan"
                  caption="Người nhận"
                  alignment="center"
                  width="180"
                />
                  <DxColumn
                  data-field="approvedAt"
                  caption="Ngày nhận"
                  alignment="center"
                  width="200"
                />
            <DxColumn
                  data-field="nhan"
                  caption="Trạng thái"
                  alignment="center"
                  width="100"
                />
              <DxSummary>
                <DxGroupItem
                  column="KLBAO"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
              </DxSummary>
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
  DxGroupItem,
  DxTotalItem,
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
    DxGroupItem,
    DxTotalItem,
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
      lkh: 0,
      idDepartment: {
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
      fa: 100000,
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
    ...mapActions("production", ["GET_SL_DO_BAO"]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.load();
    },
    // tinhKLBAO(rowData) {
    //   //  if (rowData.xuatbao2M)
    //   rowData.KLBAO =
    //     (rowData.xuatluaphoi * rowData.DAI * rowData.RONG * rowData.DAY) /
    //     1000000000;
    //   //   else
    //   //   rowData.tienDoKH = '-'
    //   return rowData.KLBAO;
    // },
    tienDoXuatKho(rowData) {
      if (rowData.xuatluaphoi == null) {
        return 0;
      } else {
        if (rowData.xuat) rowData.tienDoXK = rowData.xuatluaphoi / rowData.xuat;
        else rowData.tienDoXK = "-";
        return rowData.tienDoXK;
      }
    },
    async loadCode() {
      //  if (this.idDepartment.code == "TH")  this.fa = 100000;
      //   if (this.idDepartment.code == "YS1A")  this.fa = 100003;
      //    if (this.idDepartment.code == "YS1B")  this.fa = 100004;
      //     if (this.idDepartment.code == "TB")  this.fa = 100005;
      this.load();
    },
    async load() {
      let payload = {
        fromDate: moment(this.fromDate).format().slice(0, 10),
        toDate: moment(this.toDate).format().slice(0, 10),
        factoryId: this.idDepartment.factoryId,
      };
      let data = await this.GET_SL_DO_BAO(payload);
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