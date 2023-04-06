<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row print-hide" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Biên bản giao nhận gỗ bán thành phẩm
          <span class="text-amber-14">{{ factory ? factory.label : "" }}</span>
        </div>

        <div
          class="col-6 cursor-pointer text-blue text-bold"
          style="font-size: 18px"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
          <span class="text-amber-14">{{ denNgay }}</span>
        </div>
      </div>
    </div>
    <div style="padding: 5px">
      <div class="row bg-grey-1 print-hide" style="padding: 5px 0 5px 0">
        <div class="col-8">
          <div class="row">
            <div
              class="col-2 col-md-2"
              v-for="(congDoan, index) in options"
              :key="index"
            >
              <q-radio
                dense
                @input="onChange"
                v-model="factory"
                :val="congDoan"
                :label="congDoan.label"
                style="border-radius: 5px; font-size: 13px"
                class="text-weight-bold"
                color="amber-6"
              />
            </div>
          </div>
        </div>
        <div class="col-4" align="right"></div>
      </div>
      <div class="q-gutter-md row print-hide">
        <q-select
          class="col-2"
          color="grey-3"
          label-color="orange"
          filled
          v-model="code"
          :options="codes"
          label="Chọn biên bản"
          @input="onChangeCode"
          dense
        />
      </div>
      <div class="row" v-if="dataSource.length > 0">
        <table border="1" style="width: 100%; border-collapse: collapse">
          <thead class="w-100">
            <tr>
              <th rowspan="2" style="width: 100px">
                <img src="~assets/logo.png" style="width: auto; height: 90px" />
              </th>
              <th style="font-size: 16px">SỔ TAY COC</th>
              <td rowspan="2" style="width: 200px">
                BM.COC-026 <br />
                Ngày ban hành: 20.06.2018 <br />
                Lần ban hành: 03
              </td>
            </tr>
            <tr>
              <th style="font-size: 18px">
                BIÊN BẢN GIAO NHẬN GỖ BÁN THÀNH PHẨM <br />
                (KIỂM PHIẾU NHẬP KHO)
              </th>
            </tr>
          </thead>
        </table>
        <table border="1" style="width: 100%; border-collapse: collapse">
          <tbody class="w-100">
            <tr>
              <td style="width: 50%">
                Đơn vị giao hàng <b>{{ factory.label }}</b>
              </td>
              <td style="width: 50%">
                Số phiếu: <b>{{ code.value }}</b>
              </td>
            </tr>
            <tr>
              <td>
                Địa chỉ: <b>{{ factory.location }}</b>
              </td>
              <td>Biển số xe:</td>
            </tr>
            <tr>
              <td>Kho nhập: <b>Thuận Hưng</b></td>
              <td>Ngày nhập: {{ ngayNhap }}</td>
            </tr>
            <tr>
              <td>
                Trạng thái MT:&emsp; <b>FSC 100%</b>&emsp; <b>19.6YS</b>&emsp;
                Nhóm SP: W5
              </td>
              <td>Mã lô gỗ nhập:</td>
            </tr>
          </tbody>
        </table>
        <DxDataGrid
          :data-source="dataSource"
          :show-borders="true"
          :word-wrap-enabled="true"
          :show-row-lines="true"
          :show-column-lines="true"
          :no-data-text="'Không có dữ liệu'"
        >
          <DxFilterPanel :visible="true" />

          <DxColumn data-field="NAME" caption="Tên" width="320" />

          <DxColumn caption="Quy cách" alignment="center">
            <DxColumn
              data-field="HEIGHT"
              caption="Dày"
              width="80"
              alignment="center"
            />
            <DxColumn
              data-field="WIDTH"
              caption="Rộng"
              width="80"
              alignment="center"
            />
            <DxColumn
              data-field="LENGTH"
              caption="Dài"
              width="80"
              alignment="center"
            />
          </DxColumn>
          <DxColumn
            data-field="QUANTITY"
            caption="Số Thanh"
            data-type="number"
            format="#,##0.######"
            width="100"
          />
          <DxColumn
            data-field="KL"
            caption="Khối lượng thực nhập (M3)"
            data-type="number"
            format="#,##0.######"
            width="100"
          />
          <DxColumn data-field="DESCRIPTION" caption="Ghi chú" />
          <DxSummary>
            <DxTotalItem column="NAME" :display-format="'Tổng'" />
            <DxTotalItem
              column="QUANTITY"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
            <DxTotalItem
              column="KL"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
          </DxSummary>
        </DxDataGrid>
      </div>
      <div
        v-if="dataSource.length > 0"
        class="row text-bold"
        style="margin-bottom: 50px"
      >
        <div class="col-6" align="center">Người nhận</div>
        <div class="col-6" align="center">Thủ kho</div>
      </div>
      <div class="row text-bold">
        <div class="col-6" align="center">Nguyễn Hồng Quân</div>
        <div class="col-6" align="center">Đào Quốc Duy</div>
      </div>
    </div>
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
  DxExport,
  DxColumn,
  DxFilterRow,
  DxSummary,
  DxTotalItem,
} from "devextreme-vue/data-grid";
import { mapGetters, mapActions } from "vuex";
import DialogSelectDate from "../components/commons/DialogSelectFromDateToDate";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../ultils";
import moment from "moment";
export default {
  components: {
    DxDataGrid,
    DxFilterRow,
    DxExport,
    DxColumn,
    DialogSelectDate,
    DxSummary,
    DxTotalItem,
  },
  data() {
    return {
      factory: null,
      options: [
        {
          label: "Nhà máy CBG Yên Sơn 1",
          location: "Yên Sơn - Tuyên Quang",
          code: "YS1",
          id: 100004,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          location: "Thái Bình",
          code: "TB",
          id: 100005,
        },
      ],
      fromDate: null,
      toDate: null,
      showChooseDate: false,
      codes: [],
      code: null,
      ngayNhap: null,
      dataSource: [],
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
  },
  methods: {
    ...mapActions("prod", ["getCodeNhanPhoiByFactoryId", "getBBNhanPhoi"]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadCodeNhanPhoi();
    },
    async onChange() {
      this.loadCodeNhanPhoi();
    },
    async loadCodeNhanPhoi() {
      const payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).add(1, "day").format("YYYY-MM-DD 00:00:00"),
        factoryId: this.factory.id,
      };
      const data = await this.getCodeNhanPhoiByFactoryId(payload);
      this.codes = data.data;
    },
    async onChangeCode() {
      const payload = {
        code: this.code.value,
      };
      const data = await this.getBBNhanPhoi(payload);
      console.log("data", data);
      this.ngayNhap = data.data[0].NGAY_NHAP;
      this.dataSource = data.data;
    },
  },
};
</script>

<style>
</style>