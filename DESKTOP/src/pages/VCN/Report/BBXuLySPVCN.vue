<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary print-hide">
      <div class="row">
        <div class="col-6 top-title text-orange">
          Biên bản xử lý sản phẩm không phù hợp
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
      <div class="q-gutter-md row print-hide">
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
        <q-btn
          v-if="userInfo.id === factory.gdsx && !verify"
          class="col-2"
          color="primary"
          label="Duyệt"
          @click="onVerify"
        />
        <q-btn
          v-if="userInfo.id === factory.qc && !verifyQC"
          class="col-2"
          color="primary"
          label="Duyệt"
          @click="onVerifyQC"
        />
        <q-btn
          v-if="
            (userInfo.id === factory.gdsx || userInfo.id === created_by) &&
            !verify
          "
          class="col-2"
          color="primary"
          label="Từ chối"
          @click="onReject"
        />
      </div>
    </q-card-section>
    <q-card-section>
      <table border="1" style="width: 100%; border-collapse: collapse">
        <thead class="w-100">
          <tr>
            <th rowspan="2" style="width: 100px">
              <img src="~assets/logo.png" style="width: auto; height: 90px" />
            </th>
            <th style="font-size: 16px">
              QUY TRÌNH KIỂM SOÁT SP KHÔNG PHÙ HỢP
            </th>
            <td rowspan="2" style="width: 200px">
              QT-05/BM-02 <br />
              Ngày ban hành: 10.09.2018 <br />
              Lần ban hành: 05 <br />
              Trang: 1/1
            </td>
          </tr>
          <tr>
            <th style="font-size: 18px">
              BIÊN BẢN XỬ LÝ SẢN PHẨM KHÔNG PHÙ HỢP
            </th>
          </tr>
        </thead>
      </table>
      <div class="row">
        <div class="col-12">
          Ngày {{ day }} Tháng {{ month }} Năm {{ year }}
        </div>
      </div>
      <div class="row">
        <div class="col-4">Người tạo: {{ create_name }}</div>
        <div class="col-4">Mã biên bản: {{ codeBB }}</div>
      </div>
      <DxDataGrid
        :data-source="dataSource"
        :show-borders="true"
        :word-wrap-enabled="true"
        :show-row-lines="true"
        :show-column-lines="true"
        :no-data-text="'Không có dữ liệu'"
      >
        <DxSelection mode="multiple" />
        <DxFilterPanel :visible="true" />

        <DxColumn data-field="ID" caption="Mã" :visible="false" />
        <DxColumn data-field="ITEM_FROM_NAME" caption="Công đoạn báo lỗi" />
        <DxColumn data-field="ITEM_NAME" caption="Tên sản phẩm" />

        <DxColumn data-field="TYPE_NAME" caption="Loại lỗi" width="150" />
        <DxColumn
          data-field="QUANTITY"
          caption="Số lỗi"
          data-type="number"
          format="#,##0.####"
          width="100"
        />
        <DxColumn data-field="DESCRIPTION" caption="Diễn giải" />
        <DxColumn data-field="REMEDIES_NAME" caption="Cách xử lý" />
        <DxColumn data-field="DEPARTMENT_NAME" caption="Công đoạn xử lý" />
      </DxDataGrid>
      <div style="background-color: white">
        <div class="row">
          <div class="col-6 text-center"><b>Giám đốc sản xuất</b></div>
          <div class="col-6 text-center"><b>Trưởng bộ phận QC</b></div>
        </div>
        <div class="row">
          <div v-if="verify" class="col-6 text-center" style="height: 100px">
            <img
              alt="Không có chữ kí số"
              width="auto"
              height="50"
              v-bind:src="'/statics/' + chuKy + '.png'"
            />
          </div>
          <div v-else class="col-6 text-center" style="height: 100px"></div>
          <div v-if="verifyQC" class="col-6 text-center" style="height: 100px">
            <img
              alt="Không có chữ kí số"
              width="auto"
              height="50"
              v-bind:src="'/statics/' + chuKyQC + '.png'"
            />
          </div>
          <div v-else class="col-6 text-center" style="height: 100px"></div>
        </div>
        <div class="row">
          <div v-if="verify" class="col-6 text-center">
            {{ nguoiDuyet }}
          </div>
          <div v-else class="col-6 text-center"></div>
          <div v-if="verifyQC" class="col-6 text-center">
            {{ nguoiDuyetQC }}
          </div>
          <div v-else class="col-6 text-center"></div>
        </div>
      </div>
    </q-card-section>
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
  </q-page>
</template>

<script>
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import moment from "moment";
import {
  formatDateISO,
  formatDateVN,
  getFisrtDayOfMonth,
  showNotifySuccess,
  showNotifyError,
} from "../../../ultils";
import { mapGetters, mapActions } from "vuex";
import { DxDataGrid, DxColumn, DxFilterRow } from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxFilterRow,

    DxColumn,
    DialogSelectDate,
  },
  data() {
    return {
      day: "00",
      month: "00",
      year: "201",
      codeBB: "",
      create_name: "",
      created_by: 0,
      fromDate: null,
      toDate: null,
      code: "",
      codes: [],
      verify: false,
      chuKy: "",
      nguoiDuyet: "",
      verifyQC: false,
      chuKyQC: "",
      nguoiDuyetQC: "",
      showChooseDate: false,
      dataSource: [],
      factory: {
        label: "Nhà máy YS2",
          factoryId: 102451,
          code: "YS2",
          gdsx: 101914,
          qc: 101916,
      },
      options: [
        {
          label: "Nhà máy YS2",
          factoryId: 102451,
          code: "YS2",
          gdsx: 101914,
          qc: 101916,
        },
        {
          label: "Nhà máy YS3 - Plywood",
          factoryId: 102498,
          code: "YS3-Ply",
          gdsx: 101914,
          qc: 101916,
        },
        {
          label: "Nhà máy YS3 – LVL",
          factoryId: 102531,
          code: "YS3-LVL",
          gdsx: 101914,
          qc: 101916,
        },
        {
          label: "Nhà máy Viforex",
          factoryId: 102533,
          code: "Viforex",
          gdsx: 101914,
          qc: 101916,
        },
      ],
    };
  },
  created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.loadCode();
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("prod", [
      "updateListBCXuLyLoi",
      "deleteListBCXuLyLoi",
      "getListCodeInItemError",
      "updateQcItemErrorGDSX",
      "updateQcItemErrorQC"
    ]),
    ...mapActions("vcn", [
      "getItemErrorByCodeVCN",
    ]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadCode();
    },
    async onChange() {
      this.chuKy = "";
      this.nguoiDuyet = "";
      this.chuKyQC = "";
      this.nguoiDuyetQC = "";
      this.verify = false;
      this.verifyQC = false;
      this.dataSource = [];
      this.loadCode();
    },
    async loadCode() {
      if (this.factory != null && this.fromDate != null) {
        let payload = {
          fromDate: formatDateISO(this.fromDate),
          toDate: formatDateISO(this.toDate),
          factoryId: this.factory.factoryId,
        };
        this.codes = [];
        this.code = "";
        let data = await this.getListCodeInItemError(payload);
        data.data.forEach((el) => {
          if(el.VERIFY_BY == null){
            this.codes.push({
            label: el.CODE + " | " + el.CREATED_DATE,
            value: el.CODE,
            created_at: el.CREATED_DATE,
            create_name: el.LAST_NAME,
            created_by: el.CREATED_BY,
          });
          }else{
            this.codes.push({
            label: el.CODE + " | " + el.CREATED_DATE + " | Đã duyệt",
            value: el.CODE,
            created_at: el.CREATED_DATE,
            create_name: el.LAST_NAME,
            created_by: el.CREATED_BY,
          });
          }
          
        });
      }
      console.log("user info id:", this.userInfo.id);
      console.log("factory gdsx", this.factory.gdsx);
    },
    async onChangeCode() {
      this.chuKy = "";
      this.nguoiDuyet = "";
      this.chuKyQC = "";
      this.nguoiDuyetQC = "";
      let check = moment(this.code.created_at, "YYYY/MM/DD");
      this.day = check.format("D");
      this.month = check.format("M");
      this.year = check.format("YYYY");
      this.codeBB = this.code.value;
      this.create_name = this.code.create_name;
      this.created_by = this.code.created_by;
      let data = await this.getItemErrorByCodeVCN(this.code.value);
      this.dataSource = data.data;
      if (this.dataSource[0].VERIFY_BY != null) {
        this.verify = true;
        this.chuKy = this.dataSource[0].VERIFY_BY;
        this.nguoiDuyet = this.dataSource[0].VERIFY_NAME;
      } else {
        this.verify = false;
      }
      if (this.dataSource[0].QC_VERIFY_BY != null) {
        this.verifyQC = true;
        this.chuKyQC = this.dataSource[0].QC_VERIFY_BY;
        this.nguoiDuyetQC = this.dataSource[0].QC_VERIFY_NAME;
      } else {
        this.verifyQC = false;
      }
    },
    async onVerify() {
      let payload = {
        code: this.code.value,
        accountId: this.userInfo.id,
      };
      console.log("payload:", payload);
      let result = await this.updateQcItemErrorGDSX(payload);
      if (result.meta.success) {
        this.onChangeCode();
        showNotifySuccess("Duyệt thành công !");
      } else {
        showNotifyError();
      }
    },
    async onVerifyQC() {
      let payload = {
        code: this.code.value,
        accountId: this.userInfo.id,
      };
      console.log("payload:", payload);
      let result = await this.updateQcItemErrorQC(payload);
      if (result.meta.success) {
        this.onChangeCode();
        showNotifySuccess("Duyệt thành công !");
      } else {
        showNotifyError();
      }
    },
    async onReject() {
      let payload = {
        code: this.codeBB,
      };
      let result = await this.deleteListBCXuLyLoi(payload);
      if (result.meta.success) {
        this.codeBB = "";
        this.dataSource = [];
        this.loadCode();
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
  },
};
</script>