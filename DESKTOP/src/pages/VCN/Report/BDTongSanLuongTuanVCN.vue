<template>
  <q-page>
    <q-card class="my-card">
      <q-card-section class="bg-blue-grey-1" style="padding: 3px">
        <div class="row">
          <div class="col-6 top-title text-orange">
            Biểu đồ tổng sản lượng tuần khối VCN
          </div>
          <div
            class="col-6 top-title cursor-pointer text-orange"
            align="right"
            @click="showChooseDate = true"
          >
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-orange row widget-container"></div>
        <div class="row" style="border: 1px solid black">
          <div class="col-2">
            <table class="w-100" style="height: 100%">
              <tr>
                <td rowspan="2" style="width: 50%">
                    <p class="title-factory" >
                      Nhà máy YS2&nbsp;&nbsp;&nbsp;&nbsp;
                    </p>
                </td>
                <td style="width: 30%; text-align: center">
                  <button style="color: orange" @click="selectAll('TH')">
                    <span class="material-icons"> check_box </span>
                  </button>
                </td>
              </tr>
              <tr>
                <td style="text-align: center">
                  <button @click="unSelect('TH')">
                    <span class="material-icons">
                      check_box_outline_blank
                    </span>
                  </button>
                </td>
              </tr>
            </table>
          </div>
          <div class="col-10">
            <q-checkbox
              v-for="(value, index) in departmentYS2"
              :key="index"
              v-model="selectionYS2"
              :val="value.ID"
              :label="value.NAME"
              color="orange"
              style="color: #0a3f0d"
            />
          </div>
        </div>
        <div class="row" style="border: 1px solid black">
          <div class="col-2">
            <table class="w-100" style="height: 100%">
              <tr>
                <th rowspan="2" style="width: 50%">
                    <p class="title-factory" >
                      Nhà máy YS3 - Plywood
                    </p>
                </th>
                <td style="width: 30%; text-align: center">
                  <button style="color: orange" @click="selectAll('YS1A')">
                    <span class="material-icons"> check_box </span>
                  </button>
                </td>
              </tr>
              <tr>
                <td style="text-align: center">
                  <button @click="unSelect('YS1A')">
                    <span class="material-icons">
                      check_box_outline_blank
                    </span>
                  </button>
                </td>
              </tr>
            </table>
          </div>
          <div class="col-10">
            <q-checkbox
              v-for="(value, index) in departmentPLYWOOD"
              :key="index"
              v-model="selectionPLYWOOD"
              :val="value.ID"
              :label="value.NAME"
              color="orange"
              style="color: #0a3f0d"
            />
          </div>
        </div>
        <div class="row" style="border: 1px solid black">
          <div class="col-2">
            <table class="w-100" style="height: 100%">
              <tr>
                <th rowspan="2" style="width: 50%">
                    <p class="title-factory">
                      Nhà máy YS3 – LVL
                    </p>
                </th>
                <td style="width: 30%; text-align: center">
                  <button style="color: orange" @click="selectAll('YS1B')">
                    <span class="material-icons"> check_box </span>
                  </button>
                </td>
              </tr>
              <tr>
                <td style="text-align: center">
                  <button @click="unSelect('YS1B')">
                    <span class="material-icons">
                      check_box_outline_blank
                    </span>
                  </button>
                </td>
              </tr>
            </table>
          </div>
          <div class="col-10">
            <q-checkbox
              v-for="(value, index) in departmentLVL"
              :key="index"
              v-model="selectionLVL"
              :val="value.ID"
              :label="value.NAME"
              color="orange"
              style="color: #0a3f0d"
            />
          </div>
        </div>
        <div class="row" style="border: 1px solid black">
          <div class="col-2">
            <table class="w-100" style="height: 100%">
              <tr>
                <th rowspan="2" style="width:50%">
                    <p class="title-factory" >
                      Nhà máy Viforex
                    </p>

                </th>
                <td style="width: 30%; text-align: center">
                  <button style="color: orange" @click="selectAll('TB')">
                    <span class="material-icons"> check_box </span>
                  </button>
                </td>
              </tr>
              <tr>
                <td style="text-align: center">
                  <button @click="unSelect('TB')">
                    <span class="material-icons">
                      check_box_outline_blank
                    </span>
                  </button>
                </td>
              </tr>
            </table>
          </div>
          <div class="col-10">
            <q-checkbox
              v-for="(value, index) in departmentVIFOREX"
              :key="index"
              v-model="selectionVIFOREX"
              :val="value.ID"
              :label="value.NAME"
              color="orange"
              style="color: #0a3f0d"
            />
          </div>
        </div>
        <br />
        <div class="row">
          <q-btn
            push
            style="margin-right: 20px"
            color="white"
            @click="onView"
            text-color="primary"
            label="Xem"
          />
          <q-btn
            push
            color="white"
            @click="bieudo = false"
            text-color="primary"
          >
            <span class="material-icons"> show_chart </span>
          </q-btn>
          <q-btn push color="white" @click="bieudo = true" text-color="primary">
            <span class="material-icons"> signal_cellular_alt </span>
          </q-btn>
        </div>
        <DxChart v-if="bieudo" id="chart" :data-source="dataSource">
          <DxCommonSeriesSettings
            argument-field="createdDate"
            type="stackedbar"
          >
          </DxCommonSeriesSettings>
          <DxSeries value-field="YS2" name="Nhà máy YS2" color="#0288d1" />
          <DxSeries value-field="PLYWOOD" name="Nhà máy YS3 - Plywood" color="orange" />
          <DxSeries value-field="LVL" name="Nhà máy YS3 – LVL" color="#21ba45" />
          <DxSeries value-field="VIFOREX" name="Nhà máy Viforex" color="#673ab7" />
          <DxLegend
            vertical-alignment="bottom"
            horizontal-alignment="center"
            item-text-position="top"
          />
          <DxExport :enabled="true" />
          <DxTooltip
            :enabled="true"
            :customize-tooltip="customizeTooltip"
            location="edge"
          />
        </DxChart>
        <DxChart v-else id="chart" :data-source="dataSource" palette="Violet">
          <DxCommonSeriesSettings argument-field="createdDate">
          </DxCommonSeriesSettings>
          <DxSeries value-field="YS2" name="Nhà máy YS2" color="#0288d1" />
          <DxSeries value-field="PLYWOOD" name="Nhà máy YS3 - Plywood" color="orange" />
          <DxSeries value-field="LVL" name="Nhà máy YS3 – LVL" color="#21ba45" />
          <DxSeries value-field="VIFOREX" name="Nhà máy Viforex" color="#673ab7" />
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
          <DxTooltip
            :enabled="true"
            :customize-tooltip="customizeTooltip"
            location="edge"
          />
        </DxChart>
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
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxLabel,
  DxArgumentAxis,
  DxGrid,
  DxMargin,
  DxTooltip,
  DxFormat,
  DxLegend,
  DxExport,
  DxTitle,
  DxFont,
} from "devextreme-vue/chart";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import moment from "moment";
export default {
  components: {
    DialogSelectDate,
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxLabel,
    DxArgumentAxis,
    DxGrid,
    DxMargin,
    DxTooltip,
    DxFormat,
    DxLegend,
    DxExport,
    DxTitle,
    DxFont,
  },
  data() {
    return {
      dataSource: [],
      fromDate: null,
      showChooseDate: false,
      toDate: null,
      bieudo: "cot",
      selection: [],
      selectionYS2: [],
      selectionPLYWOOD: [],
      selectionLVL: [],
      selectionVIFOREX: [],
      departmentYS2: [],
      departmentPLYWOOD: [],
      departmentLVL: [],
      departmentVIFOREX: [],
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
    this.getDepartment();
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
    async getDepartment() {
      this.departmentYS2 = await this.loadDepartmentByFactory(102451);
      this.departmentPLYWOOD = await this.loadDepartmentByFactory(102498);
      this.departmentLVL = await this.loadDepartmentByFactory(102531);
      this.departmentVIFOREX = await this.loadDepartmentByFactory(102533);
    },
    changeChart(value) {
      if (this.value === "cot") {
        this.bieudo = "cot";
      } else {
        this.bieudo = "duong";
      }
    },
    selectAll(value) {
      if (value === "TH") {
        this.departmentYS2.forEach((el) => {
          this.selectionYS2.push(el.ID);
        });
      } else if (value === "YS1A") {
        this.departmentPLYWOOD.forEach((el) => {
          this.selectionPLYWOOD.push(el.ID);
        });
      } else if (value === "YS1B") {
        this.departmentLVL.forEach((el) => {
          this.selectionLVL.push(el.ID);
        });
      } else {
        this.departmentVIFOREX.forEach((el) => {
          this.selectionVIFOREX.push(el.ID);
        });
      }
    },
    unSelect(value) {
      if (value === "TH") {
        this.selectionYS2 = [];
      } else if (value === "YS1A") {
        this.selectionPLYWOOD = [];
      } else if (value === "YS1B") {
        this.selectionLVL = [];
      } else {
        this.selectionVIFOREX = [];
      }
    },
    async onView() {
      this.selection = [];
      if (
        this.selectionYS2.length === 0 &&
        this.selectionPLYWOOD.length === 0 &&
        this.selectionLVL.length === 0 &&
        this.selectionVIFOREX.length === 0
      ) {
        this.$q.dialog({
          title: "Bạn chưa chọn công đoạn",
          message: "Vui lòng chọn công đoạn trước khi xem !",
        });
      } else {
        if (this.selectionYS2.length != 0) {
          this.selection.push(this.selectionYS2);
        }
        if (this.selectionPLYWOOD.length != 0) {
          this.selection.push(this.selectionPLYWOOD);
        }
        if (this.selectionLVL.length != 0) {
          this.selection.push(this.selectionLVL);
        }
        if (this.selectionVIFOREX.length != 0) {
          this.selection.push(this.selectionVIFOREX);
        }
        const listDepartment = this.selection.join();
        const payload = {
          fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
          toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
          listDepartment: listDepartment,
        };
        const data = await this.$store.dispatch(
          "vcn/GET_REPORT_CHART_SAN_LUONG_WEEK_CONG_DOAN_VCN",
          payload
        );
        this.dataSource = data;
      }
    },
    async loadDepartmentByFactory(value) {
      let payload = {
        factoryId: value,
      };
      const data = await this.$store.dispatch(
        "vcn/GET_DEPARTMENT_BY_FACTORY_VCN",
        payload
      );
      console.log("data",data);
     return data;
    },
    onChangeFromWeek() {
      this.onView();
    },
    onChangeToWeek() {
      this.onView();
    },
    onChangeYear() {
      this.onView();
    },
    customizeTooltip(pointInfo) {
      return {
        text: `${pointInfo.seriesName}: ${Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(pointInfo.valueText)}`,
      };
    },
  },
};
</script>

<style>
g .dxc-item {
  color: red;
  font-weight: bold !important;
}
g .dxc-arg-elements text {
  font-weight: bold !important;
}
.title-factory {
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  color: #009688
}
</style>