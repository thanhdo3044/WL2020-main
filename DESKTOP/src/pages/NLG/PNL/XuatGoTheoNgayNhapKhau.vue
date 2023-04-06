<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary print-hide">
        <div class="row">
          <div class="col-6 top-title text-orange">
            Biên bản xuất gỗ theo ngày
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
      <q-card-section>
      <div class="row print-hide">
        <div class="col-3 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="number"
            :options="numbers"
            label="Chọn biên bản"
            @input="onchangeNumber"
          />
        </div>
      </div>
      <table border="1" style="width: 100%; border-collapse: collapse">
        <thead class="w-100">
          <tr>
            <th rowspan="2" style="width: 100px">
              <img src="~assets/logo.png" style="width: auto; height: 100px" />
            </th>
            <th style="font-size: 16px">SỔ TAY COC</th>
            <td rowspan="2" style="width: 200px">
              MB-COC-32 <br />
              Ngày ban hành: 29/9/2016 <br />
              Lần ban hành: 01
            </td>
          </tr>
          <tr>
            <th style="font-size: 18px">
              BIÊN BẢN GIAO NHẬN KIỂM PHIẾU XUẤT KHO
            </th>
          </tr>
        </thead>
      </table>
      <div class="row">
        <div class="col-6">Loại gỗ: Acacia (Keo)</div>
        <div class="col-6">Mã biên bản:{{ soPhieu }} </div>
      </div>
      <div class="row">
        <div class="col-6">Xuất tại kho: <span>{{sourceName}}</span></div>
        <div class="col-6">Tuần : {{ week }}</div>
      </div>
      <div class="row">
        <div class="col-6">BP nhận: <span>{{ destinationName }}</span></div>
        <div class="col-6">Biển số xe: {{ bienSoXe }}</div>
      </div>
      <div class="row">
        <div class="col-6">Mã phiếu: {{ maPhieu }}</div>
      </div>
      <DxDataGrid
        :data-source="dataSource"
        :show-borders="true"
        :word-wrap-enabled="true"
        :show-row-lines="true"
        :show-column-lines="true"
        :no-data-text="'Không có dữ liệu'"
      >
        <DxExport :enabled="true" :allow-export-selected-data="true" />
        <DxScrolling mode="infinite" />
        <DxColumn data-field="itemName" caption="Tên chi tiết" />
        <DxColumn caption="Kích thước" alignment="center">
          <DxColumn
            caption="Dầy"
            data-field="HEIGHT"
            format="fixedPoint"
            alignment="center"
            width="70"
          />
          <DxColumn
            caption="Rộng"
            data-field="WIDTH"
            format="fixedPoint"
            alignment="center"
            width="70"
          />
          <DxColumn
            caption="Dài"
            data-field="LENGTH"
            format="fixedPoint"
            alignment="center"
            width="70"
          />
        </DxColumn>
        <DxColumn
          data-field="unitName"
          caption="ĐVT"
          data-type="number"
          width="50"
        />
        <DxColumn
          data-field="SL_TH"
          caption="Số lượng"
          data-type="number"
          format="#,##0"
          width="100"
        />
        <DxColumn
          data-field="KLC_TH"
          caption="Khối lượng"
          data-type="number"
          format="#,##0.####"
          width="100"
        />
        <DxSummary>
          <DxTotalItem
            column="NAME"
            value-format="fixedpoint"
            display-format="Tổng cộng : "
          />
          <DxTotalItem
            column="KLC_TH"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'decimal'"
          />
        </DxSummary>
      </DxDataGrid>
      <div class="row">
          <div class="col-6"></div>
        <div class="col-6 text-center">{{diadiem}}, Ngày {{ day }} tháng {{month}} năm {{ year }}</div>
      </div>
      <div class="row">
          <div class="col-6 text-center">
              Xưởng SX
          </div>
          <div class="col-6 text-center">
              Thủ kho
          </div>
      </div>
      <div class="row" style="height:100px">
        <div class="col-6 text-center">
              
          </div>
          <div class="col-6 text-center">
               <img
               v-if="createdby != null"
              alt="Không có chữ kí số"
              width="auto"
              height="50"
              v-bind:src="'/statics/' + createdby + '.png'"
            />
          </div>
      </div>
      <div class="row">
        <div class="col-6 text-center">
              
          </div>
          <div class="col-6 text-center">
              {{ createdName }}
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
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate.vue";
import { getFisrtDayOfMonth, formatDateVN } from "../../../ultils";
import moment from "moment";
import {
  DxDataGrid,
  DxColumn,
  DxScrolling,
  DxSummary,
  DxTotalItem,
  DxExport,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DialogSelectDate,
     DxDataGrid,
    DxColumn,
    DxSummary,
    DxScrolling,
    DxTotalItem,
    DxExport,
  },
  data() {
    return {
      fromDate: null,
      toDate: null,
      showChooseDate: false,
      numbers: [],
      number: null,
      sourceName: null,
      week: null,
      destinationName: null,
      createdby: null,
      createdName: null,
      soPhieu: null,
      diadiem: "Hà Nội",
      day: null,
      month: null,
      year: null,
      dataSource: [],
      bienSoXe: '',
      maPhieu: '',
      xuatNhap: null,
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
    this.day = moment().day();
    this.month = moment().month();
    this.year = moment().year();
    this.loadNumber();
  },
  methods: {
    ...mapActions("nlg", [
      "getNumberInXuatGoNhapKhau",
      "getXuatGoNKByNumber"
    ]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
    },
    async loadNumber(){
      const payload = {
        from: moment(this.fromDate).format("YYYY-MM-DD 00:00"),
        to: moment(this.toDate).format("YYYY-MM-DD 23:59")
      }
      this.numbers = [];
      const data = await this.getNumberInXuatGoNhapKhau(payload);
      data.data.forEach(el => {
        this.numbers.push({
          label: el.number + " | " + el.createdAt,
          value: el.number,
          sourceName: el.sourceName,
          week: el.week,
          destinationName: el.destinationName,
          bienSoXe: el.bienSoXe,
          maPhieu: el.maPhieu,
          xuatNhap: el.XUATNHAP,
          createdby: el.createdby,
          createdName: el.LAST_NAME
        });
      });
    },
    async onchangeNumber(){
      this.soPhieu = this.number.value;
      this.sourceName = this.number.sourceName;
      this.week = this.number.week;
      this.destinationName = this.number.destinationName;
      this.bienSoXe = this.number.bienSoXe;
      this.maPhieu = this.number.maPhieu;
      this.xuatNhap = this.number.xuatNhap;
      this.createdby = this.number.createdby;
      this.createdName = this.number.createdName;
      this.loadData();
    },
    async loadData(){
      const payload = {
        number: this.number.value
      }
      const data = await this.getXuatGoNKByNumber(payload);
      this.dataSource = data.data;
    }
  },
};
</script>

<style>
</style>