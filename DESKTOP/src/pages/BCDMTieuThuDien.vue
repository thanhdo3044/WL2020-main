<template>
  <q-page class="q-pa-sm">
    <div class="row" style="background-color: #daf8e1">
      <div class="col-6 text-blue text-bold" style="font-size: 18px">
        Báo cáo sản lượng điện tiêu thụ so với định mức khối CBG
      </div>
      <div class="col-6 text-blue text-bold" align="right">
        <span style="font-size: 18px">Tháng: </span>
        <input
          class="text-amber-14"
          type="number"
          @input="loadData"
          v-model="thang"
          style="
            border: none;
            background-color: #daf8e1;
            font-size: 18px;
            width: 40px;
          "
        />
        <span style="margin-right: 15px">-</span>
        <span style="font-size: 18px">Năm: </span>
        <input
          class="text-amber-14"
          type="number"
          @input="loadData"
          v-model="year"
          style="
            border: none;
            background-color: #daf8e1;
            font-size: 18px;
            width: 60px;
          "
        />
      </div>
    </div>
    <q-card>
      <div style="padding: 5px">
        <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
          <div class="col-8">
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in options"
                :key="index"
              >
                <q-radio
                  dense
                  @input="loadData"
                  v-model="idDepartment"
                  :val="congDoan"
                  :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  v-bind:class="{ isActive: true }"
                  color="amber-6"
                />
              </div>
            </div>
          </div>
          <div class="col-4" align="right">
             <q-btn v-if="isInsert && isSoDienTT" color="positive" @click="showGhiChu = true" label="Thêm ghi chú" />
          </div>
        </div>
        <div id="chart-demo">
          <DxChart id="chart" :data-source="dataSourceBD" palette="Material">
            <DxCommonSeriesSettings :type="type" argument-field="GROUP">
              <DxLabel :visible="true">
                <DxFormat :precision="4" type="fixedPoint" />
              </DxLabel>
            </DxCommonSeriesSettings>
            <DxSeries
              :value-field="thang2.value"
              color="orange"
              :name="thang2.label"
            />
            <DxSeries
              :value-field="thang1.value"
              color="#21ba45"
              :name="thang1.label"
            />
            
            <DxMargin :bottom="20" />
            <DxArgumentAxis
              :value-margins-enabled="false"
              discrete-axis-division-mode="crossLabels"
            >
              <DxGrid :visible="true" />
            </DxArgumentAxis>
            <DxLegend
              vertical-alignment="bottom"
              horizontal-alignment="center"
              item-text-position="bottom"
            />
            <DxExport :enabled="true" />
            <DxTitle
              style="font-weight: bold"
              :text="'Biểu đồ so sánh tiêu thụ điện tháng '+ thang2.name +' và '+ thang1.name" 
            >
              <DxFont weight="900" />
              <DxSubtitle text="(Số sánh thực tế với định mức)" />
            </DxTitle>
            <DxTooltip :enabled="true" />
          </DxChart>
        </div>
        <div class="row">
          <div class="col-12" align="right">
            <q-btn
              class="col-1 q-ml-sm text-orange"
              style="height: 20px; font-size: 10px"
              color="teal"
              outlined
              label="Xuất Excel"
              @click="xuat"
            />
          </div>
          <div class="col-12">
            <div style="margin-top: 5px" v-html="table"></div>
          </div>
        </div>
      </div>
    </q-card>
    <q-dialog v-model="showGhiChu" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nhập thông tin ghi chú</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select outlined label-color="amber"  v-model="xuong" :options="xuongs" label="Chọn xưởng" />
        </q-card-section>
         <q-card-section class="q-pt-none">
          <q-input
          outlined 
      v-model="txtGhiChu"
      type="textarea"
    />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn color="positive" @click="addGhiChu" label="Thêm" v-close-popup />
          <q-btn color="orange" label="Hủy" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  DxChart,
  DxSeries,
  DxArgumentAxis,
  DxCommonSeriesSettings,
  DxExport,
  DxGrid,
  DxMargin,
  DxLegend,
  DxTitle,
  DxSubtitle,
  DxTooltip,
  DxLabel,
  DxFormat,
  DxFont,
} from "devextreme-vue/chart";
import XLSX from "xlsx";
import { mapGetters, mapActions } from "vuex";
import { showNotifyError, showNotifySuccess } from 'src/utils/utils';
export default {
  components: {
    DxChart,
    DxSeries,
    DxArgumentAxis,
    DxCommonSeriesSettings,
    DxExport,
    DxGrid,
    DxMargin,
    DxLegend,
    DxTitle,
    DxSubtitle,
    DxTooltip,
    DxLabel,
    DxFormat,
    DxFont,
  },
  data() {
    return {
      table: null,
      dataSourceBD: [],
      showGhiChu: false,
      xuongs: [],
      xuong: null,
      txtGhiChu: null,
      isInsert: false,
      thang1: 0,
      thang2: 0,
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
          factoryId: 102340,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102366,
          code: "TB",
        },
      ],
      year: null,
      thang: null,
      thangs: [
        { label: 1, id: 1 },
        { label: 2, id: 2 },
        { label: 3, id: 3 },
        { label: 4, id: 4 },
        { label: 5, id: 5 },
        { label: 6, id: 6 },
        { label: 7, id: 7 },
        { label: 8, id: 8 },
        { label: 9, id: 9 },
        { label: 10, id: 10 },
        { label: 11, id: 11 },
        { label: 12, id: 12 },
      ],
      isSoDienTT: false,
    };
  },
  created() {
    const today = new Date();
    const currentYear = today.getFullYear();
    this.year = currentYear;
    this.thang = today.getMonth() + 1;
    this.idDepartment = this.options[0];
    this.loadData();
    this.loadPermission();
  },
  methods: {
    ...mapActions("prod", ["getPermissionInScreen"]),
    async loadPermission() {
      console.log("router dinh tuyen", this.$route.path);
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.$store.state.base.userInfo.id,
      };
      let listPermission = await this.getPermissionInScreen(payloadPermission);
      listPermission.data.forEach((el) => {
        if (el.CODE == "insert") {
          this.isInsert = true;
        }
      });
    },
    async html_table_to_excel(type) {
      var data = document.getElementById("employee_data");

      var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });

      XLSX.write(file, { bookType: type, bookSST: true, type: "base64" });

      XLSX.writeFile(
        file,
        `BCSL_${this.idDepartment.label}_${this.year}.` + type
      );
    },
    xuat() {
      this.html_table_to_excel("xlsx");
    },
    async addGhiChu(){
      const payload = {
        xuong: this.xuong.value,
        month: this.thang,
        year: this.year,
        factoryId: this.idDepartment.factoryId,
        ghiChu: this.txtGhiChu,
        accountId: this.$store.state.base.userInfo.id
      }
      console.log("payload", payload);
      const data = await this.$store.dispatch(
        "prod/ADD_TIEU_THU_DIEN_GHI_CHU",
        payload
      );
      if(data.meta.success){
        showNotifySuccess();
        this.loadData();
        this.xuong = null;
        this.txtGhiChu = null;
      }else{
        showNotifyError();
      }
    },
    async loadData() {
      const payload = {
        month: this.thang,
        year: this.year,
        factoryId: this.idDepartment.factoryId,
      };
      const data = await this.$store.dispatch(
        "prod/GET_REPORT_DINH_MUC_DIEN_TIEU_THU",
        payload
      );
      if(data.data[0].SODIENTT){
        this.isSoDienTT = true;
      }else{
        this.isSoDienTT = false;
      }
      console.log("this.isSoDienTT", this.isSoDienTT);
      let year2 = 0;
      let month2 = 0;
      if (this.thang == 1) {
        month2 = 12;
        year2 = this.year - 1;
      } else {
        month2 = this.thang - 1;
        year2 = this.year;
      }
      this.thang1 = {
        label: "Tháng " + this.thang + "-" + this.year,
        value: this.thang,
        name: `${this.thang}/${this.year}`
      };
      this.thang2 = {
        label: "Tháng " + month2 + "-" + year2,
        value: month2,
        name: `${month2}/${year2}`
      };
      const payload2 = {
        month1: this.thang,
        year1: this.year,
        month2: month2,
        year2: year2,
        factoryId: this.idDepartment.factoryId,
      };
      const dataBD = await this.$store.dispatch(
        "prod/GET_BIEU_DO_TIEU_THU_DIEN",
        payload2
      );
      this.dataSourceBD = dataBD.data;
      console.log("dataBD", dataBD);
      const data2 = await this.$store.dispatch("prod/GET_XUONG_TIEU_THU_DIEN", {
        month: this.thang,
        year: this.year,
        factoryId: this.idDepartment.factoryId,

      });
      this.table = `
      <table id="employee_data">
        <tr>
          <th class="colorHeader" rowspan="2">Xưởng</th>
          <th class="colorHeader" rowspan="2">Nhóm sp</th>
          <th class="colorHeader" rowspan="2">Tổ</th>
          <th class="colorHeader" rowspan="2">Sản lượng (m3)</th>
          <th class="colorHeader" colspan="3" col>Định mức được sử dụng (kWh/m3)</th>
          <th class="colorHeader" rowspan="2">Điện năng thực tế tiêu thụ</th>
          <th class="colorHeader" colspan="2">So sánh thực tế với định mức</th>
          <th class="colorHeader" rowspan="2">Ghi chú</th>
        </tr>
        <tr>
          <th class="colorHeader">kWh/m3</th>
          <th class="colorHeader">Định mức * slg(kWh)</th>
          <th class="colorHeader">Tổng</th>
          <th class="colorHeader">kWh</th>
          <th class="colorHeader">%</th>
        </tr>
        <tbody>
      `;
      this.xuongs = [];
      data2.data.forEach((xuong) => {
        this.xuongs.push({
          label: xuong.GROUP,
          value: xuong.GROUP
        })
        let fisrt = true;
        let arrData = data.data.filter((f) => f.GROUP == xuong.GROUP);
        let total = 0;
        arrData.forEach((el) => {
          // if (el.NHOMSP_TTD == 'SL')
          // total += el.SODIENDM*0.15;
          // else
          total += el.SODIENDM;
        });
        arrData.forEach((el) => {
          let length = arrData.length;
          if (fisrt) {
            fisrt = false;
            this.table += `
            <tr>
                <td class="center colorTotal" rowspan="${length}">${
              xuong.GROUP
            }</td>
                <td class="center colorTotal">${el.NHOMSP_TTD}</td>
                <td class="colorTotal">${el.NAME}</td>
                <td class="right colorMonth">${el.KL.toLocaleString(
                  "en-US"
                )}</td>
                <td class="center colorMonth">${el.DM_TTD.toLocaleString(
                  "en-US"
                )}</td>
                <td class="right colorMonth">${el.SODIENDM.toLocaleString(
                  "en-US"
                )}</td>
                <td class="right colorMonth" rowspan="${length}">${total.toLocaleString(
              "en-US"
            )}</td>
                <td class="right colorMonth" rowspan="${length}">${
              el.SODIENTT ? el.SODIENTT.toLocaleString("en-US") : 0
            }</td>
                <td class="right colorTotal" rowspan="${length}">${(
              el.SODIENTT - total
            ).toLocaleString("en-US")}</td>
                <td class="right colorTotal" rowspan="${length}">${(
              (el.SODIENTT / total - 1) *
              100
            ).toLocaleString("en-US")}%</td>
                <td width="200px" class="colorTotal" style="word-wrap: break-word" rowspan="${length}">
                <i>${xuong.GHI_CHU ? xuong.GHI_CHU : ''}</i>
                </td>
            </tr>
              `;
          } else {
            this.table += `
            <tr>
                <td class="center colorTotal">${el.NHOMSP_TTD}</td>
                <td class="colorTotal">${el.NAME}</td>
                <td class="right colorMonth">${el.KL.toLocaleString(
                  "en-US"
                )}</td>
                <td class="center colorMonth">${el.DM_TTD.toLocaleString(
                  "en-US"
                )}</td>
                <td class="right colorMonth">${el.SODIENDM.toLocaleString(
                  "en-US"
                )}</td>
            </tr>
              `;
          }
        });
      });
      this.table += `
      </tbody>
      </table>
      `;
    },
  },
};
</script>

<style>
table,
td,
th {
  border: 1px solid black;
}

table {
  width: 100%;
  border-collapse: collapse;
}
.center {
  text-align: center;
}
.right {
  text-align: right;
}
.colorHeader {
  background-color: #daf8e1;
  color: black;
  padding: 10px 5px 10px 5px;
}
.colorMonth {
  padding: 3px;
  font-size: 16px;
}
.colorTotal {
  padding: 3px;
  font-size: 16px;
  font-weight: bold;
}
</style>