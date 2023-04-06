<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo sản lượng lỗi theo ngày -
          <span class="text-amber-14">{{ factory ? factory.label : "" }}</span>
        </div>

        <div class="col-6 cursor-pointer text-blue text-bold" style="font-size: 18px" align="right"
          @click="showChooseDate = true">
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
          <span class="text-amber-14">{{ denNgay }}</span>
        </div>
      </div>
    </div>
    <q-card>
      <div style="padding: 5px">
        <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
          <div class="col-8">
            <div class="row">
              <div class="col-2 col-md-2" v-for="(congDoan, index) in options" :key="index">
                <q-radio dense @input="loadDepartment" v-model="factory" :val="congDoan" :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px" class="text-weight-bold" v-bind:class="{ isActive: true }"
                  color="amber-6" />
              </div>
            </div>
          </div>
          <div class="col-4" align="right">
            <q-checkbox v-model="isShow" color="amber-6" style="margin-right:30px" class="text-weight-bold text-blue"
              label="Mở rộng" dense />
            <q-checkbox v-model="isExcel" color="amber-6" class="text-weight-bold text-blue" label="Xuất Excel" dense />
          </div>
        </div>
        <div v-if="factory" class="row" style="font-size: 12px; vertical-align: top">
          <div class="col-12">
            <table style="border: 1px solid black; width: 100%">
              <tr>
                <td scope="col" style="border-right: 1px solid black">
                  <div>
                    <q-checkbox v-if="factory.id == 100000" @input="selectAll()" dense color="amber-6" class="text-blue"
                      style="font-weight: bold" v-model="allDepartmentTH" label="Chọn tất" />
                    <q-checkbox v-if="factory.id == 102340" @input="selectAll()" dense color="amber-6" class="text-blue"
                      style="font-weight: bold" v-model="allDepartmentYS1" label="Chọn tất" />
                    <q-checkbox v-if="factory.id == 102366" @input="selectAll()" dense color="amber-6" class="text-blue"
                      style="font-weight: bold" v-model="allDepartmentTB" label="Chọn tất" />
                    <q-checkbox v-if="factory.id == 102427" @input="selectAll()" dense color="amber-6" class="text-blue"
                      style="font-weight: bold" v-model="allDepartmentQM" label="Chọn tất" />
                    <q-checkbox v-if="factory.id == 102299" @input="selectAll()" dense color="amber-6" class="text-blue"
                      style="font-weight: bold" v-model="allDepartmentCBG" label="Chọn tất" />
                  </div>
                </td>

                <td scope="col" style="vertical-align: top" v-for="(value, index) in listGroupDepartment" :key="index">
                  <div v-if="checkCountSayPhoi.length > 1">
                    <q-checkbox v-if="value.ORDER == 1 && factory.id != 102299" dense @input="chonTatCa(1)"
                      v-model="chonTatcaSayPhoi" :val="value" style="font-weight: bold;color: orange;"
                      label="Chọn tất" />
                  </div>
                  <div v-if="checkcountLuaPhoi.length > 1">
                    <q-checkbox v-if="value.ORDER == 2 && factory.id != 102299" dense @input="chonTatCa(2)"
                      v-model="chonTatcaLuaPhoi" :val="value" style="font-weight: bold;color: orange;" label="Chọn tất"
                      color="warning" />
                  </div>
                  <div v-if="checkcountSoChe.length > 1">
                    <q-checkbox v-if="value.ORDER == 3 && factory.id != 102299" dense @input="chonTatCa(3)"
                      v-model="chonTatcaSoChe" :val="value" style="font-weight: bold;color: orange;" label="Chọn tất"
                      color="amber-6" />
                  </div>
                  <div v-if="checkcountTinhChe.length > 1">
                    <q-checkbox v-if="value.ORDER == 4 && factory.id != 102299" dense @input="chonTatCa(4)"
                      v-model="chonTatcaTinhChe" :val="value" style="font-weight: bold;color: orange;" label="Chọn tất"
                      color="amber-6" />
                  </div>
                  <div v-if="checkcountHTM.length > 1">
                    <q-checkbox v-if="value.ORDER == 5 && factory.id != 102299" dense @input="chonTatCa(5)"
                      v-model="chonTatcaHTM" :val="value" style="font-weight: bold;color: orange;" label="Chọn tất"
                      color="amber-6" />
                  </div>
                  <div v-if="checkcountHT.length > 1">
                    <q-checkbox v-if="value.ORDER == 6 && factory.id != 102299" dense @input="chonTatCa(6)"
                      v-model="chonTatcaHoanThien" :val="value" style="font-weight: bold;color: orange;"
                      label="Chọn tất" color="amber-6" />
                  </div>
                  <div v-if="checkcountDongGoi.length > 1">
                    <q-checkbox v-if="value.ORDER == 7 && factory.id != 102299" dense @input="chonTatCa(7)"
                      v-model="chonTatcaDongGoi" :val="value" style="font-weight: bold;color: orange;" label="Chọn tất"
                      color="amber-6" />
                  </div>
                  <div>
                    <q-checkbox v-if="factory.id == 102299" @input="load" dense v-model="chonCongDoansCBG"
                      :val="value.NAME" style="font-weight: bold" :label="value.NAME" color="amber-6" />
                  </div>
                  <div v-for="(congDoan, index1) in departments.filter(
                    (d) => d.groupOrder == value.ORDER
                  )" :key="index1">
                    <q-checkbox v-if="
                      congDoan.value != 102484 &&
                      congDoan.id != 102490 &&
                      congDoan.factoryId == 100000
                    " @input="load" dense v-model="chonCongDoansTH" :val="congDoan.ID" style="font-weight: bold"
                      :label="congDoan.departmentName" color="amber-6" />
                    <q-checkbox v-if="
                      congDoan.value != 102484 &&
                      congDoan.id != 102490 &&
                      congDoan.factoryId == 102340
                    " @input="load" dense v-model="chonCongDoansYS1" :val="congDoan.ID" style="font-weight: bold"
                      :label="congDoan.departmentName" color="amber-6" />
                    <q-checkbox v-if="
                      congDoan.value != 102484 &&
                      congDoan.id != 102490 &&
                      congDoan.factoryId == 102366
                    " @input="load" dense v-model="chonCongDoansTB" :val="congDoan.ID" style="font-weight: bold"
                      :label="congDoan.departmentName" color="amber-6" />
                    <q-checkbox v-if="
                      congDoan.value != 102484 &&
                      congDoan.id != 102490 &&
                      congDoan.factoryId == 102427
                    " @input="load" dense v-model="chonCongDoansQM" :val="congDoan.ID" style="font-weight: bold"
                      :label="congDoan.departmentName" color="amber-6" />
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div class="col-2 col-md-2" v-for="(congDoan, index) in departments" :key="index"></div>
        </div>
        <div class="row">
        
      
          
          <div class="col-10">
            <DxDataGrid id="gridContainer" :data-source="dataSource" :show-borders="true" :show-row-lines="true"
              :hover-state-enabled="true" :row-alternation-enabled="true" :no-data-text="'Vui lòng chọn công đoạn'"
              :word-wrap-enabled="true"
              :show-column-lines="true" :allow-column-resizing="true" @cell-prepared="onCellPrepared"
              @content-ready="onContentReady">
              <DxScrolling mode="virtual" />
              <DxSorting mode="none" />
              <DxGroupPanel :visible="isExcel" :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'" />
              <DxHeaderFilter :visible="true" />
              <DxSorting mode="single" />
              <DxGrouping :auto-expand-all="isShow" />
              <!-- <DxColumn data-field="ID" caption="#" /> -->
              <DxColumn data-field="groupName" caption="" :group-index="0" group-cell-template="groupCellTemplate"
                :sort-index="0" sort-order="asc" />
              <template #groupCellTemplate="{ data }">
                <div style="font-weight: bold">
                  {{ data.value.substring(2) }}
                </div>
              </template>
              <DxColumn data-field="departmentName2" caption="" :group-index="1"
                group-cell-template="groupCellTemplate2" />
              <template #groupCellTemplate2="{ data }">
                <div>{{ data.value }}</div>
              </template>
              <DxColumn data-field="sanPham" caption="Chọn sản phẩm" :group-index="2" />
              <DxColumn data-field="itemName" caption="Tên" />
              <DxColumn caption="Dầy" data-field="height" format="fixedPoint" alignment="center" width="90" />
              <DxColumn caption="Rộng" data-field="width" format="fixedPoint" alignment="center" width="90" />
              <DxColumn caption="Dài" data-field="length" format="fixedPoint" alignment="center" width="90" />
              <DxColumn caption="Sản lượng" alignment="center">
              <DxColumn data-field="QUANTITY" caption="Số lượng" data-type="number" format="#,##0.##" width="120" />
              <DxColumn data-field="KL" caption="M³" data-type="number" format="#,##0.00" width="120"
          
                :calculate-cell-value="calculateKL_KL" />
              </DxColumn>
                   <DxColumn caption="Lỗi do công đoạn sau trả lại" alignment="center">
              <DxColumn data-field="loi" caption="Số lượng" data-type="number" format="#,##0.##" width="120" />
                        <DxColumn data-field="KLL" caption="M³" data-type="number" format="#,##0.00" width="120"
                        :calculate-cell-value="calculateKL_LOI"/>
                   </DxColumn>
                   <DxColumn data-field="TYLE" caption="Tỷ lệ % lỗi do công đoạn sau trả lại" data-type="number" format="#,##0.##%" width="120"
                        :calculate-cell-value="calculateKL_TILE"/>   
                 
              <DxSummary :calculate-custom-summary="calculateAreaSummary">
                <!-- <DxTotalItem
                  column="QUANTITY"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.####'"
                />-->
                  <DxGroupItem
              name="tyleloi"
              show-in-column="TYLE"
              :show-in-group-footer="false"
              :align-by-column="true"
              summary-type="custom"
              :value-format="'#,##0.##%'"
              display-format="{0}"
            />
                <DxGroupItem column="KL" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.##'" />
                           <DxGroupItem column="KLL" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.##'" />
              </DxSummary>
              <DxExport :enabled="isExcel" :allow-export-selected-data="false" :file-name="
                'Dữ liệu sản xuất chi tiết từ ngày ' +
                tuNgay +
                ' đến ngày ' +
                denNgay
              " />
            </DxDataGrid>
          </div>
        </div>
      </div>
    </q-card>
    <q-dialog v-model="dialog" persistent :maximized="maximizedToggle" transition-show="slide-up"
      transition-hide="slide-down">
      <q-card class="bg-white text-black">
        <q-bar>
          <q-space />

          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">Thông tin sản lượng chi tiết</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <DxDataGrid id="gridContainer" :data-source="dataSource" :show-borders="true" :show-row-lines="true"
            :hover-state-enabled="true" :row-alternation-enabled="true" :no-data-text="'Vui lòng chọn công đoạn'"
            :show-column-lines="true" :allow-column-resizing="true" @cell-prepared="onCellPrepared"
            @content-ready="onContentReady">
            <DxScrolling mode="virtual" />
            <DxSorting mode="none" />
            <DxGroupPanel :visible="true" :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'" />
            <DxHeaderFilter :visible="true" />
            <DxSorting mode="single" />
            <DxGrouping :auto-expand-all="true" />
            <!-- <DxColumn data-field="ID" caption="#" /> -->
            <DxColumn data-field="groupName" caption="" :group-index="0" group-cell-template="groupCellTemplate"
              :sort-index="0" sort-order="asc" />
            <template #groupCellTemplate="{ data }">
              <div style="font-weight: bold">
                {{ data.value.substring(2) }}
              </div>
            </template>
            <DxColumn data-field="departmentName2" caption="" :group-index="1"
              group-cell-template="groupCellTemplate2" />
            <template #groupCellTemplate2="{ data }">
              <div>{{ data.value }}</div>
            </template>
            <DxColumn data-field="sanPham" caption="Chọn sản phẩm" :group-index="2" />
            <DxColumn data-field="itemName" caption="Tên" />
            <DxColumn caption="Dầy" data-field="height" format="fixedPoint" alignment="center" width="90" />
            <DxColumn caption="Rộng" data-field="width" format="fixedPoint" alignment="center" width="90" />
            <DxColumn caption="Dài" data-field="length" format="fixedPoint" alignment="center" width="90" />
            <DxColumn data-field="QUANTITY" caption="Số lượng" data-type="number" format="#,##0.##" width="120" />
            <DxColumn data-field="KL" caption="M³" data-type="number" format="#,##0.00" width="120"
              :calculate-cell-value="calculateKL_KL" />
            <DxSummary>
              <!-- <DxTotalItem
                  column="QUANTITY"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.####'"
                />-->
              <DxGroupItem column="KL" summary-type="sum" data-type="number" :show-in-group-footer="false"
                :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.##'" />
            </DxSummary>
            <DxExport :enabled="true" :allow-export-selected-data="false" :file-name="
              'Dữ liệu sản xuất chi tiết từ ngày ' +
              tuNgay +
              ' đến ngày ' +
              denNgay
            " />
          </DxDataGrid>
        </q-card-section>
      </q-card>
    </q-dialog>
    <DialogSelectDate :selectDate="chooseDate" :showChooseDate="showChooseDate" :cancelChooseDate="cancelChooseDate" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxScrolling,
  DxSorting,
  DxExport,
  DxSummary,
  DxGroupItem,
  DxTotalItem,
  DxHeaderFilter,
  DxColumnChooser,
} from "devextreme-vue/data-grid";
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxLabel,
  DxFormat,
  DxLegend,
  DxValueAxis,
  DxTitle,
  DxConstantLine,
  DxFont,
  DxTooltip
} from "devextreme-vue/chart";
import DialogSelectDate from "../components/commons/DialogSelectFromDateToDate";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../ultils";
let collapsed = false;
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxScrolling,
    DxSorting,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxExport,
    DialogSelectDate,
    DxTooltip,
    DxSummary,
    DxGroupItem,
    DxTotalItem,
    DxHeaderFilter,
    DxColumnChooser,
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxLabel,
    DxFormat,
    DxLegend,
    DxValueAxis,
    DxTitle,
    DxConstantLine,
    DxFont,
  },

  data() {
    return {
      factory: null,
      factory1: false,
      dataChart: [],
      isSayPhoi: false,
      isExcel: false,
      isShow: true,
      showChooseDate: false,
      listGroupDepartment: [],
      color: [
        "#9C27B0",
        "#21BA45",
        "#673ab7",
        "#31CCEC",
        "#7cb342",
        "#26A69A",
        "#1976d2",
      ],
      dataSource: [],
      open: 0,
      lowAverage: 75,
      fromDate: null,
      departments: [],
      chonCongDoans: [],
      toDate: null,
      allDepartment: false,
      allDepartmentTH: false,
      allDepartmentYS1: false,
      allDepartmentTB: false,
      allDepartmentQM: false,
      allDepartmentCBG: false,
      chonCongDoansTH: [],
      chonCongDoansYS1: [],
      chonCongDoansTB: [],
      chonCongDoansQM: [],
      chonCongDoansCBG: [],
      arrDepartment: [],
      chonTatcaDongGoi: false,
      chonTatcaHoanThien: false,
      chonTatcaHTM: false,
      chonTatcaTinhChe: false,
      chonTatcaSoChe: false,
      chonTatcaLuaPhoi: false,
      chonTatcaSayPhoi: false,
      checkCountSayPhoi: [],
      checkcountLuaPhoi: [],
      checkcountSoChe: [],
      checkcountTinhChe: [],
      checkcountHTM: [],
      checkcountHT: [],
      checkcountDongGoi: [],

      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          id: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          id: 102340,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          id: 102366,
          code: "TB",
        },
        // {
        //   label: "Nhà máy CBG Quang Minh",
        //   id: 102427,
        //   code: "QM",
        // },
        // {
        //   label: "Khối Chế biến gỗ",
        //   id: 102299,
        //   code: "CBG",
        // },
      ],
      dialog: false,
      maximizedToggle: true,
    };
  },

  created() {
    this.toDate = new Date();
    this.fromDate = new Date();
    this.toDate.setDate(this.toDate.getDate());
    this.fromDate.setDate(this.fromDate.getDate() - 21);
    this.loadListGroupDepartment();
  },
  methods: {
    ...mapActions("sanxuat", ["getAllSanLuong", "getSanLuongLuaPhoi"]),
    ...mapActions("prod", [
      "getKllosayngay",
      "getSLTheoDayloi",
      "getChartSLTheoDay",
    ]),
    customizeTooltip({ valueText }) {
      return {
        text: `${parseFloat(valueText).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      };
    },
    customizeText({ argument, value }) {
      return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    onCellPrepared(e) {
      if (e.rowType === "group") {
        if (e.row.groupIndex == 0) {
          e.cellElement.style.backgroundColor = "#64b5f6";
        }
        if (e.row.groupIndex == 1) {
          e.cellElement.style.backgroundColor = "#bbdefb";
        }
      }
    },
        calculateAreaSummary(options) {
      if (options.name === "tyleloi") {
        if (options.summaryProcess === "start") {
          this.tongklloi = 0;
          this.tongsl = 0;
       
        }
        if (options.summaryProcess === "calculate") {
          this.tongklloi += options.value.loi*options.value.VOLUMN;
            this.tongsl += options.value.QUANTITY*options.value.VOLUMN;
           if (this.tongklloi>0)
          options.totalValue =  this.tongklloi/this.tongsl
     
        }
      }
        },
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    ...mapActions("prod", [
      "getDepartmentByFactoryId",
      "getGroupDepartment",
      "getListGroupDepartment",
    ]),
    async loadListGroupDepartment() {
      const data = await this.getListGroupDepartment();
      this.listGroupDepartment = data;
    },
    onContentReady(e) {
      if (this.open == 1) {
        if (this.factory.id == 102299) {
          e.component.expandAll(0);
          this.open = 0;
        } else {
          e.component.expandAll(0);
          e.component.expandAll(1);
          this.open = 0;
        }
      }
    },
    showDialogDetail() {
      this.dialog = true;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.load();
      await this.loadDepartment(this.factory);
    },
      calculateKL_LOI(rowData) {
     
      return rowData.VOLUMN * rowData.loi;
    },
     calculateKL_TILE(rowData) {
    if(rowData.loi>0)
   return  rowData.loi/ rowData.QUANTITY;
    },
    calculateKL_KL(rowData) {
      if (rowData.QUANTITY == 0) {
        return rowData.VOLUMN;
      }
      return rowData.VOLUMN * rowData.QUANTITY;
    },
    async selectAll() {
      this.open = 1;
      if (this.allDepartmentCBG) {
        this.listGroupDepartment.forEach((el) => {
          if (this.factory.id == 102299) this.chonCongDoansCBG.push(el.NAME);
        });
      } else this.chonCongDoansCBG = [];
      if (this.allDepartmentYS1) {
        this.departments.forEach((el) => {
          if (this.factory.id == 102340) this.chonCongDoansYS1.push(el.ID);
        });
      } else this.chonCongDoansYS1 = [];
      if (this.allDepartmentTB) {
        this.departments.forEach((el) => {
          if (this.factory.id == 102366) this.chonCongDoansTB.push(el.ID);
        });
      } else this.chonCongDoansTB = [];
      if (this.allDepartmentQM) {
        this.departments.forEach((el) => {
          if (this.factory.id == 102427) this.chonCongDoansQM.push(el.ID);
        });
      } else this.chonCongDoansQM = [];
      if (this.allDepartmentTH) {
        this.departments.forEach((el) => {
          if (this.factory.id == 100000) this.chonCongDoansTH.push(el.ID);
        });
      } else {
        this.chonCongDoansTH = [];
      }
      this.load();
    },
    async chonTatCa(number) {
      if (number == 1) {
        if (this.chonTatcaSayPhoi) {
          if (this.factory.id == 100000) {
            this.departments.forEach((el) => {
              if (this.factory.id == 100000 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                  if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTH.push(el.ID); });
          }
          if (this.factory.id == 102340) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102340 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                  if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansYS1.push(el.ID); });
          }
          if (this.factory.id == 102366) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102366 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                  if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTB.push(el.ID); });
          }
          if (this.factory.id == 102427) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102427 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                  if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansQM.push(el.ID); });
          }
          if (this.factory.id == 102299) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102299 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                  if (el.ID == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansCBG.push(el.ID); });
          }
        }
        else {
          this.departments.forEach((el) => {
            if (this.factory.id == 100000 && number == el.groupOrder) { this.chonCongDoansTH.shift(el.ID) }
            if (this.factory.id == 102340 && number == el.groupOrder) { this.chonCongDoansYS1.shift(el.ID) }
            if (this.factory.id == 102366 && number == el.groupOrder) { this.chonCongDoansTB.shift(el.ID) }
            if (this.factory.id == 102427 && number == el.groupOrder) { this.chonCongDoansQM.shift(el.ID) }
            if (this.factory.id == 102299 && number == el.groupOrder) { this.chonCongDoansCBG.shift(el.NAME) }
          });
        }
      }
      else if (number == 2) {
        if (this.chonTatcaLuaPhoi) {
          if (this.factory.id == 100000) {
            this.departments.forEach((el) => {
              if (this.factory.id == 100000 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                  if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTH.push(el.ID); });
          }
          if (this.factory.id == 102340) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102340 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                  if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansYS1.push(el.ID); });
          }
          if (this.factory.id == 102366) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102366 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                  if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTB.push(el.ID); });
          }
          if (this.factory.id == 102427) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102427 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                  if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansQM.push(el.ID); });
          }
          if (this.factory.id == 102299) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102299 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                  if (el.ID == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansCBG.push(el.ID); });
          }
        } else {
          this.departments.forEach((el) => {
            if (this.factory.id == 100000 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
              }
            }
            if (this.factory.id == 102340 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
              }
            }
            if (this.factory.id == 102366 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
              }
            }
            if (this.factory.id == 102427 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
              }
            }
            if (this.factory.id == 102299 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                if (el.NAME == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
              }
            }
          });
        }
      }
      else if (number == 3) {
        if (this.chonTatcaSoChe) {
          if (this.factory.id == 100000) {
            this.departments.forEach((el) => {
              if (this.factory.id == 100000 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                  if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTH.push(el.ID); });
          }
          if (this.factory.id == 102340) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102340 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                  if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansYS1.push(el.ID); });
          }
          if (this.factory.id == 102366) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102366 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                  if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTB.push(el.ID); });
          }
          if (this.factory.id == 102427) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102427 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                  if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansQM.push(el.ID); });
          }
          if (this.factory.id == 102299) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102299 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                  if (el.ID == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansCBG.push(el.ID); });
          }
        }
        else {
          this.departments.forEach((el) => {
            if (this.factory.id == 100000 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
              }
            }
            if (this.factory.id == 102340 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
              }
            }
            if (this.factory.id == 102366 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
              }
            }
            if (this.factory.id == 102427 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
              }
            }
            if (this.factory.id == 102299 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                if (el.NAME == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
              }
            }
          });
        }
      }
      else if (number == 4) {
        if (this.chonTatcaTinhChe) {
          if (this.factory.id == 100000) {
            this.departments.forEach((el) => {
              if (this.factory.id == 100000 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                  if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTH.push(el.ID); });
          }
          if (this.factory.id == 102340) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102340 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                  if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansYS1.push(el.ID); });
          }
          if (this.factory.id == 102366) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102366 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                  if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTB.push(el.ID); });
          }
          if (this.factory.id == 102427) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102427 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                  if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansQM.push(el.ID); });
          }
          if (this.factory.id == 102299) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102299 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                  if (el.ID == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansCBG.push(el.ID); });
          }
        }
        else {
          this.departments.forEach((el) => {
            if (this.factory.id == 100000 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
              }
            }
            if (this.factory.id == 102340 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
              }
            }
            if (this.factory.id == 102366 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
              }
            }
            if (this.factory.id == 102427 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
              }
            }
            if (this.factory.id == 102299 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                if (el.NAME == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
              }
            }
          });
        }
      }
      else if (number == 5) {
        if (this.chonTatcaHTM) {
          if (this.factory.id == 100000) {
            this.departments.forEach((el) => {
              if (this.factory.id == 100000 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                  if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTH.push(el.ID); });
          }
          if (this.factory.id == 102340) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102340 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                  if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansYS1.push(el.ID); });
          }
          if (this.factory.id == 102366) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102366 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                  if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTB.push(el.ID); });
          }
          if (this.factory.id == 102427) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102427 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                  if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansQM.push(el.ID); });
          }
          if (this.factory.id == 102299) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102299 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                  if (el.ID == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansCBG.push(el.ID); });
          }
        }
        else {
          this.departments.forEach((el) => {
            if (this.factory.id == 100000 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
              }
            }
            if (this.factory.id == 102340 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
              }
            }
            if (this.factory.id == 102366 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
              }
            }
            if (this.factory.id == 102427 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
              }
            }
            if (this.factory.id == 102299 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                if (el.NAME == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
              }
            }
          });
        }
      }
      else if (number == 6) {
        if (this.chonTatcaHoanThien) {
          if (this.factory.id == 100000) {
            this.departments.forEach((el) => {
              if (this.factory.id == 100000 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                  if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTH.push(el.ID); });
          }
          if (this.factory.id == 102340) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102340 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                  if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansYS1.push(el.ID); });
          }
          if (this.factory.id == 102366) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102366 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                  if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTB.push(el.ID); });
          }
          if (this.factory.id == 102427) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102427 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                  if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansQM.push(el.ID); });
          }
          if (this.factory.id == 102299) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102299 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                  if (el.ID == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansCBG.push(el.ID); });
          }
        }
        else {
          this.departments.forEach((el) => {
            if (this.factory.id == 100000 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
              }
            }
            if (this.factory.id == 102340 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
              }
            }
            if (this.factory.id == 102366 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
              }
            }
            if (this.factory.id == 102427 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
              }
            }
            if (this.factory.id == 102299 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                if (el.NAME == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
              }
            }
          });
        }
      }
      else if (number == 7) {
        if (this.chonTatcaDongGoi) {
          if (this.factory.id == 100000) {
            this.departments.forEach((el) => {
              if (this.factory.id == 100000 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                  if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTH.push(el.ID); });
          }
          if (this.factory.id == 102340) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102340 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                  if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansYS1.push(el.ID); });
          }
          if (this.factory.id == 102366) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102366 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                  if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTB.push(el.ID); });
          }
          if (this.factory.id == 102427) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102427 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                  if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansQM.push(el.ID); });
          }
          if (this.factory.id == 102299) {
            this.departments.forEach((el) => {
              if (this.factory.id == 102299 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                  if (el.ID == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansCBG.push(el.ID); });
          }
        }
        else {
          this.departments.forEach((el) => {
            if (this.factory.id == 100000 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
              }
            }
            if (this.factory.id == 102340 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
              }
            }
            if (this.factory.id == 102366 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
              }
            }
            if (this.factory.id == 102427 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
              }
            }
            if (this.factory.id == 102299 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                if (el.NAME == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
              }
            }
          });
        }
      }
      this.load();
    },
    async loadDepartment() {
      let data = await this.getGroupDepartment();
      data = data.filter((d) => d.factoryId == this.factory.id);
      this.allDepartment = false;
      this.chonCongDoans = [];
      this.departments = data;
      this.load();
    },
    async load() {
      this.open = 1;
      let listGroupDepartment = [];
      this.checkCountSayPhoi = [];
      this.checkcountLuaPhoi = [];
      this.checkcountSoChe = [];
      this.checkcountTinhChe = [];
      this.checkcountHTM = [];
      this.checkcountHT = [];
      this.checkcountDongGoi = [];
      listGroupDepartment = this.departments;
      for (let i = 0; i < listGroupDepartment.length; i++) {
        if (listGroupDepartment[i].groupOrder == 1) {
          this.checkCountSayPhoi.push(listGroupDepartment[i]);
        }
        if (listGroupDepartment[i].groupOrder == 2) {
          this.checkcountLuaPhoi.push(listGroupDepartment[i]);
        }
        if (listGroupDepartment[i].groupOrder == 3) {
          this.checkcountSoChe.push(listGroupDepartment[i]);
        }
        if (listGroupDepartment[i].groupOrder == 4) {
          this.checkcountTinhChe.push(listGroupDepartment[i]);
        }
        if (listGroupDepartment[i].groupOrder == 5) {
          this.checkcountHTM.push(listGroupDepartment[i]);
        }
        if (listGroupDepartment[i].groupOrder == 6) {
          this.checkcountHT.push(listGroupDepartment[i]);
        }
        if (listGroupDepartment[i].groupOrder == 7) {
          this.checkcountDongGoi.push(listGroupDepartment[i]);
        }
      }
      if (this.factory.id == 100000) {
        this.arrDepartment = this.chonCongDoansTH;
      }
      if (this.factory.id == 102340) {
        this.arrDepartment = this.chonCongDoansYS1;
      }
      if (this.factory.id == 102366) {
        this.arrDepartment = this.chonCongDoansTB;
      }
      if (this.factory.id == 102427) {
        this.arrDepartment = this.chonCongDoansQM;
      }
      if (this.factory.id == 102299) {
        this.arrDepartment = this.chonCongDoansCBG;
      };
      let countSayPhoi = 0;
      let countLuaPhoi = 0;
      let countSoChe = 0;
      let countTinhChe = 0;
      let countHTM = 0;
      let countHT = 0;
      let countDongGoi = 0;
      this.checkCountSayPhoi.forEach(e => {
        this.arrDepartment.forEach(el => {
          if (e.ID == el) {
            countSayPhoi++;
          }
        });
      });
      this.checkcountLuaPhoi.forEach(e => {
        this.arrDepartment.forEach(el => {
          if (e.ID == el) {
            countLuaPhoi++;
          }
        });
      });
      this.checkcountSoChe.forEach(e => {
        this.arrDepartment.forEach(el => {
          if (e.ID == el) {
            countSoChe++;
          }
        });
      });
      this.checkcountTinhChe.forEach(e => {
        this.arrDepartment.forEach(el => {
          if (e.ID == el) {
            countTinhChe++;
          }
        });
      });
      this.checkcountHTM.forEach(e => {
        this.arrDepartment.forEach(el => {
          if (e.ID == el) {
            countHTM++;
          }
        });
      });
      this.checkcountHT.forEach(e => {
        this.arrDepartment.forEach(el => {
          if (e.ID == el) {
            countHT++;
          }
        });
      });
      this.checkcountDongGoi.forEach(e => {
        this.arrDepartment.forEach(el => {
          if (e.ID == el) {
            countDongGoi++;
          }
        });
      });
      if (countLuaPhoi == this.checkcountLuaPhoi.length || countLuaPhoi > this.checkcountLuaPhoi.length) {
        this.chonTatcaLuaPhoi = true
      } else {
        this.chonTatcaLuaPhoi = false

      }
      if (countSoChe == this.checkcountSoChe.length || countSoChe > this.checkcountSoChe.length) {
        this.chonTatcaSoChe = true
      } else {
        this.chonTatcaSoChe = false

      }

      if (countTinhChe == this.checkcountTinhChe.length || countTinhChe > this.checkcountTinhChe.length) {
        this.chonTatcaTinhChe = true
      } else {
        this.chonTatcaTinhChe = false
      }

      if (countLuaPhoi == this.checkcountLuaPhoi.length || countLuaPhoi > this.checkcountLuaPhoi.length) {
        this.chonTatcaLuaPhoi = true
      } else {
        this.chonTatcaLuaPhoi = false

      }
      if (countHTM == this.checkcountHTM.length || countHTM > this.checkcountHTM.length) {
        this.chonTatcaHTM = true
      } else {
        this.chonTatcaHTM = false

      }
      if (countHT == this.checkcountHT.length || countHT > this.checkcountHT.length) {
        this.chonTatcaHoanThien = true
      } else {
        this.chonTatcaHoanThien = false
      }

      if (countDongGoi == this.checkcountDongGoi.length || countDongGoi > this.checkcountDongGoi.length) {
        this.chonTatcaDongGoi = true
      } else {
        this.chonTatcaDongGoi = false
      }
      let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
        departmentId: this.factory.id,
        arrDepartment: this.arrDepartment,
      };
      let data = [];
      let data3 = [];
      if (this.arrDepartment.length == 0) {
        data = [];
        data3 = [];
      } else {
        data = await this.getSLTheoDayloi(payload);
       // data3 = await this.getChartSLTheoDay(payload);
      }
      if (this.arrDepartment.length == 1 && (this.arrDepartment[0] == 100013 || this.arrDepartment[0] == 102342 || this.arrDepartment[0] == 102368 || this.arrDepartment[0] == "Sấy phôi")) {
        this.isSayPhoi = true;
      } else {
        this.isSayPhoi = false;
      }
     
      this.dataSource = data;
      for (let i = 0; i < this.dataSource.length; i++) {
        if (this.dataSource[i].VOLUMN == 1) {
          this.dataSource[i].VOLUMN = this.dataSource[i].QUANTITY;
          this.dataSource[i].QUANTITY = 0;
        }
      }
    },
  },
//
  computed: {
    ...mapGetters("base", ["congDoans", "myFactoryInfor"]),
    ...mapGetters("sanxuat", ["sanLuongs"]),
    ...mapGetters("prod", ["factories"]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
};
</script>

<style>
#gridContainer {
  height: 800px;
}

.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  font-weight: 500;
  background-color: white;
  width: 280;
}

.dx-datagrid-headers .dx-datagrid-table .dx-row>td {
  border-bottom: 1px solid #ddd;
  font-size: 13px;
  font-weight: bold;
}

.dx-datagrid-summary-item {
  color: black;
  font-weight: 500;
}

.dx-datagrid .dx-row>td {
  font-size: 16px;
}

.title {
  font-size: 18px;
  color: #1976d2;
  font-weight: 500;
}

.dx-group-panel-item:nth-child(1) {
  visibility: hidden;
}

.dx-group-panel-item:nth-child(2) {
  visibility: hidden;
}

.dx-group-panel-item:nth-child(3) {
  margin-left: -130px;
  color: #ffc107;
  font-weight: bold;
  background-color: white;
}
</style>