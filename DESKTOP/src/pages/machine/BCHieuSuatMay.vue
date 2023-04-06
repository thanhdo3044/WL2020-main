<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <div class="row" style="background-color: #daf8e1">
        <div class="col-10 text-blue text-bold" style="font-size: 18px">
          Báo cáo hiệu suất máy <span class="text-amber-14">{{ factory.label }}</span>
        </div>
        <div class="col-2 cursor-pointer text-blue text-bold" style="font-size: 18px" align="right"
          @click="showChooseDate = true">
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
          <span class="text-amber-14">{{ denNgay }}</span>
        </div>
      </div>
      <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
        <div class="col-8">
          <div class="row">
            <div class="col-2 col-md-2" v-for="(option, index) in options" :key="index">
              <q-radio dense @input="onChange" v-model="factory" :val="option" :label="option.label"
                style="border-radius: 5px; font-size: 13px" class="text-weight-bold" color="amber-6" />
            </div>
          </div>
        </div>
      </div>
    </q-card>
    <!-- </div>
        <div class="row">
          <div class="col-6 top-title text-orange">Báo cáo hiệu suất máy</div>

          <div
            class="col-6 top-title cursor-pointer text-orange"
            align="right"
            @click="showChooseDate = true"
          >
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
          </div>
        </div> -->
    <q-card-section>
      <!-- <div class="q-pa-md" style="max-width: 300px">
        <div class="q-gutter-md">
          <q-select v-model="factory" :options="options" @input="onChange" label="Chọn Nhà Máy" />
        </div>
      </div> -->
      <DxDataGrid :data-source="dataSource" :word-wrap-enabled="true" :no-data-text="'Không có dữ liệu !'"
        :show-borders="true">
        <DxExport :enabled="true" :allow-export-selected-data="true" />
        <DxColumn data-field="NAME" caption="Tên máy" :width="150" />
        <DxColumn data-field="ITEM_NAME" caption="Tên sản phẩm / chi tiết" :width="380" />
        <DxColumn caption="Quy cách" alignment="center">
          <DxColumn data-field="LENGTH" :width="90" caption="Dài" alignment="center" />
          <DxColumn data-field="WIDTH" :width="90" caption="Rộng" alignment="center" />
          <DxColumn data-field="HEIGHT" :width="90" caption="Dày" alignment="center" />
        </DxColumn>
        <DxColumn data-field="STANDARD_POWER" format="##0.00" caption="Công suất tiêu chuẩn (MD/H)" alignment="center"
          :width="150" />
        <!-- <DxColumn
            data-field="OPTIMIZED_OUTPUT"
            format="##0.00"
            caption="Sản lượng (MD)"
            alignment="center"
          /> -->

        <DxColumn data-field="actualOutput" alignment="center" :width="150" caption="Sản lượng thực tế (Số lượng)" />
        <DxColumn data-field="Md" alignment="center" format="##0.00" :width="150" caption="Sản lượng thực tế (MD)" />
        <DxColumn data-field="volumn" format="##0.00##" caption="Sản lượng thực tế (M3)" :width="150" />
        <DxColumn data-field="totalTime" alignment="center" format="##0.##" :width="150"
          caption="Thời gian máy chạy (giờ)" />
        <DxColumn data-field="HSSD" alignment="center" :width="100" format="#0.##%" caption="HSSD(%)" />
        <DxColumn data-field="DATETIME_IN" caption="Ngày" :group-index="0" />
        <DxSummary>
          <DxTotalItem column="NAME" :display-format="'Tổng'" />
          <DxTotalItem column="VOLUMN" summary-type="sum" data-type="number" :show-in-group-footer="false"
            :align-by-column="true" :display-format="'{0}'" :value-format="'decimal'" />
        </DxSummary>
      </DxDataGrid>
    </q-card-section>
    <DialogSelectDate :selectDate="chooseDate" :showChooseDate="showChooseDate" :cancelChooseDate="cancelChooseDate" />
  </q-page>
</template>

<script>
import { DxDataGrid, DxColumn, DxExport, DxLookup, DxSummary, DxTotalItem } from "devextreme-vue/data-grid";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../../ultils";
import DialogSelectDate from "../../components/commons/DialogSelectFromDateToDate";
import moment from "moment";
export default {
  name: "bao-cao-san-luong-may",
  components: {
    DxDataGrid,
    DxColumn,
    DxExport,
    DialogSelectDate,
    DxLookup,
    DxSummary,
    DxTotalItem
  },
  data() {
    return {
      dataSource: [],
      fromDate: null,
      toDate: null,
      showChooseDate: false,
      factory: {
        // label: "Nhà máy CBG Thuận Hưng",
        // id: 100000,
      },
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          id: 100000,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          id: 100004,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          id: 100005,
        },
      ],
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
  created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load();
  },
  methods: {
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.load();
    },
    chonFromDate(e) {
      this.fromDate = e.value;
      this.load();
    },
    chonToDate(e) {
      this.toDate = e.value;
      this.load();
    },
    onChange() {
      this.load();
    },
    async load() {
      let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
        factoryId: this.factory.id
      };
      const data = await this.$store.dispatch(
        "machine/GET_REPORT_HIEU_SUAT_MAY",
        payload
      );
      this.dataSource = data.data;
      console.log(this.dataSource);
    },
  },
};
</script>

<style>

</style>