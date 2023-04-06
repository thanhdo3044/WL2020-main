<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row print-hide" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Phê duyệt biên bản xử lý sản phẩm không phù hợp
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

    <q-card>
      <div style="padding: 5px" >
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
          <q-radio
            @input="onChange"
            class="text-orange"
            v-model="type"
            val="chua-duyet"
            label="Biên bản chưa duyệt"
          />
          <q-radio
            @input="onChange"
            class="text-positive"
            style="margin-right: 30px"
            v-model="type"
            val="da-duyet"
            label="Biên bản đã duyệt"
          />
          <q-btn
            v-if="
              (userInfo.id === factory.gdsx) &&
              !verify &&
              code
            "
            class="col-1"
            color="positive"
            label="Duyệt"
            @click="onVerify"
          />
          <q-btn
            v-if="userInfo.id === factory.qc && !verifyQC && code"
            class="col-1"
            color="positive"
            label="Duyệt"
            @click="onVerifyQC"
          />
          <q-btn
            v-if="
              (userInfo.id === factory.gdsx || 
                userInfo.id === created_by) &&
              !verify &&
              code
            "
            class="col-1"
            color="orange"
            label="Hủy biên bản"
            @click="onReject"
          />
               <q-btn
            v-if="
              (userInfo.id === factory.qc|| userInfo.id === 102089) &&
              code
            "
            class="col-1"
            color="orange"
            label="Hủy biên bản"
            @click="onReject"
          />
        </div>

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
            {{ gio }} giờ {{ phut }} phút, ngày {{ day }} tháng {{ month }} năm
            {{ year }}
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
          <DxExport
            :enabled="true"
            :allow-export-selected-data="true"
            file-name="biên bản QC"
          />
          <DxSelection mode="multiple" />
          <DxFilterPanel :visible="true" />

          <DxColumn data-field="ID" caption="Mã" :visible="false" />
          <DxColumn data-field="ITEM_FROM_NAME" caption="Công đoạn báo lỗi" width="150" />
          <DxColumn data-field="ITEM_NAME" caption="Tên sản phẩm" width="300" />

          <DxColumn data-field="TYPE_NAME" caption="Loại lỗi" width="150" />
          <DxColumn data-field="number" caption="Lệnh sản xuất" width="130" />
          <DxColumn
            data-field="UNIT_NAME"
            caption="ĐVT"
            width="70"
            alignment="center"
          />
          <DxColumn
            data-field="QUANTITY"
            caption="Số lượng"
            data-type="number"
            format="#,##0.######"
            width="100"
          />
          <DxColumn data-field="DESCRIPTION" caption="Diễn giải" width="200" />
          <DxColumn data-field="REMEDIES_NAME" caption="Cách xử lý" width="150" />
          <DxColumn data-field="DEPARTMENT_NAME" caption="Công đoạn xử lý" width="150" />
        </DxDataGrid>
        <div style="background-color: white">
          <div class="row">
            <div v-if="verify" class="col-6 text-center">
              {{ verifyGio }} Giờ {{ verifyPhut }} phút, ngày
              {{ verifyDay }} tháng {{ verifyMonth }} năm {{ verifyYear }}
            </div>
            <div v-if="verifyQC" class="col-6 text-center">
              {{ verifyQCGio }} Giờ {{ verifyQCPhut }} phút, ngày
              {{ verifyQCDay }} tháng {{ verifyQCMonth }} năm {{ verifyQCYear }}
            </div>
          </div>
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
            <div
              v-if="verifyQC"
              class="col-6 text-center"
              style="height: 100px"
            >
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
      </div>
    </q-card>
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
import {
  DxDataGrid,
  DxExport,
  DxColumn,
  DxFilterRow,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxFilterRow,
    DxExport,
    DxColumn,
    DialogSelectDate,
  },
  data() {
    return {
      gio: "00",
      phut: "00",
      day: "00",
      month: "00",
      year: "201",
      codeBB: "",
      create_name: "",
      type: "chua-duyet",
      created_by: 0,
      fromDate: null,
      toDate: null,
      code: "",
      codes: [],
      verify: false,
      verifyGio: null,
      verifyPhut: null,
      verifyDay: null,
      verifyMonth: null,
      verifyYear: null,
      chuKy: "",
      nguoiDuyet: "",
      verifyQC: false,
      verifyQCGio: null,
      verifyQCPhut: null,
      verifyQCDay: null,
      verifyQCMonth: null,
      verifyQCYear: null,
      chuKyQC: "",
      nguoiDuyetQC: "",
      showChooseDate: false,
      dataSource: [],
      factory: {
        label: "Nhà máy CBG Thuận Hưng",
        factoryId: 100000,
        code: "TH",
        gdsx: 100374,
        qc: 101690,
      },
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
          gdsx: 100374,
          qc: 101690,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 100004,
          code: "YS1",
          gdsx: 101863,
          qc: 101881,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 100005,
          code: "TB",
          gdsx: 101931,
          qc: 102079,
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
      "getItemErrorByCode",
      "updateQcItemErrorGDSX",
      "updateQcItemErrorQC",
      "getListCodeInItemErrorDaDuyet",
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
      this.codeBB = null;
      this.create_name = null;
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
        let data;
        if (this.type == "chua-duyet") {
          data = await this.getListCodeInItemError(payload);
        } else {
          data = await this.getListCodeInItemErrorDaDuyet(payload);
        }
        data.data.forEach((el) => {
          if (el.VERIFY_BY == null) {
            this.codes.push({
              label: el.CODE + " | " + el.CREATED_DATE,
              value: el.CODE,
              created_at: el.CREATED_DATE,
              create_name: el.LAST_NAME,
              created_by: el.CREATED_BY,
              gio: el.gio,
              phut: el.phut,
            });
          } else {
            this.codes.push({
              label: el.CODE + " | " + el.CREATED_DATE + " | Đã duyệt",
              value: el.CODE,
              created_at: el.CREATED_DATE,
              create_name: el.LAST_NAME,
              created_by: el.CREATED_BY,
              gio: el.gio,
              phut: el.phut,
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
      let check = moment(this.code.created_at, "YYYY-MM-DD HH:mm:ss", "UTC");
      this.gio = this.code.gio;
      this.phut = this.code.phut;
      this.day = check.format("D");
      this.month = check.format("M");
      this.year = check.format("YYYY");
      this.codeBB = this.code.value;
      this.create_name = this.code.create_name;
      this.created_by = this.code.created_by;
      let data = await this.getItemErrorByCode(this.code.value);
      this.dataSource = data.data;
      console.log("this.dataSource[0]", this.dataSource[0]);
      if (this.dataSource.length > 0) {
        if (this.dataSource[0].VERIFY_BY != null) {
          this.verify = true;
          this.chuKy = this.dataSource[0].VERIFY_BY;
          this.nguoiDuyet = this.dataSource[0].VERIFY_NAME;
          const verifyAt = this.dataSource[0].VERIFY_AT;
          console.log("verifyAt", verifyAt);
          this.verifyGio = moment(
            verifyAt,
            "YYYY-MM-DD HH:mm:ss",
            "UTC"
          ).hours();
          this.verifyPhut = moment(
            verifyAt,
            "YYYY-MM-DD HH:mm:ss",
            "UTC"
          ).minutes();
          this.verifyDay = new Date(verifyAt).getDate();
          this.verifyMonth =
            moment(verifyAt, "YYYY-MM-DD HH:mm:ss", "UTC").month() + 1;
          this.verifyYear = moment(
            verifyAt,
            "YYYY-MM-DD HH:mm:ss",
            "UTC"
          ).year();
        } else {
          this.verify = false;
        }
        if (this.dataSource[0].QC_VERIFY_BY != null) {
          this.verifyQC = true;
          this.chuKyQC = this.dataSource[0].QC_VERIFY_BY;
          this.nguoiDuyetQC = this.dataSource[0].QC_VERIFY_NAME;
          const qcVerifyAt = this.dataSource[0].QC_VERIFY_AT;
          this.verifyQCGio = moment(
            qcVerifyAt,
            "YYYY-MM-DD HH:mm:ss",
            "UTC"
          ).hours();
          this.verifyQCPhut = moment(
            qcVerifyAt,
            "YYYY-MM-DD HH:mm:ss",
            "UTC"
          ).minutes();
          this.verifyQCDay = new Date(qcVerifyAt).getDate();
          this.verifyQCMonth =
            moment(qcVerifyAt, "YYYY-MM-DD HH:mm:ss", "UTC").month() + 1;
          this.verifyQCYear = moment(
            qcVerifyAt,
            "YYYY-MM-DD HH:mm:ss",
            "UTC"
          ).year();
        } else {
          this.verifyQC = false;
        }
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
      if (result.success) {
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