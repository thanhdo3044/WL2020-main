<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
         {{ title }} - {{ idDepartment ? idDepartment.label : "" }}
        </div>
        <div class="col-6 text-blue text-bold" align="right">
          <span style="font-size: 18px">Tuần: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="loadGrid"
            v-model="week"
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
            @input="loadGrid"
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

    <q-card class="my-card">
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
                  @input="onChange"
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
            <q-checkbox
              v-model="isExcel"
              color="amber-6"
              class="text-weight-bold"
              label="Xuất Excel"
              dense
            />
          </div>
        </div>
        <div
          v-if="idDepartment"
          class="row"
          style="font-size: 12px; vertical-align: top"
        >
          <div class="col-12">
            <table style="border: 1px solid black; width: 100%">
              <tr>
                <td scope="col" style="border-right: 1px solid black">
                  <div>
                    <q-checkbox
                      v-if="idDepartment.factoryId == 100000"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentTH"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="idDepartment.factoryId == 102340"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentYS1"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="idDepartment.factoryId == 102366"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentTB"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="idDepartment.factoryId == 102427"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentQM"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="idDepartment.factoryId == 102299"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentCBG"
                      label="Chọn tất"
                    />
                  </div>
                </td>
                <td
                  scope="col"
                  style="vertical-align: top"
                  v-for="(value, index) in listGroupDepartment"
                  :key="index"
                >
                  <div>
                    <q-checkbox
                      v-if="idDepartment.factoryId == 102299"
                      dense
                      v-model="chonCongDoansCBG"
                      :val="value.NAME"
                      style="font-weight: bold"
                      :label="value.NAME"
                      color="amber-6"
                    />
                  </div>
                  <div
                    v-for="(congDoan, index1) in departments.filter(
                      (d) => d.groupOrder == value.ORDER
                    )"
                    :key="index1"
                  >
                    <q-checkbox
                      v-if="
                        congDoan.value != 102484 &&
                        congDoan.id != 102490 &&
                        congDoan.factoryId == 100000
                      "
                      dense
                      v-model="chonCongDoansTH"
                      :val="congDoan.ID"
                      style="font-weight: bold"
                      :label="congDoan.departmentName"
                      color="amber-6"
                    />
                    <q-checkbox
                      v-if="
                        congDoan.value != 102484 &&
                        congDoan.id != 102490 &&
                        congDoan.factoryId == 102340
                      "
                      dense
                      v-model="chonCongDoansYS1"
                      :val="congDoan.ID"
                      style="font-weight: bold"
                      :label="congDoan.departmentName"
                      color="amber-6"
                    />
                    <q-checkbox
                      v-if="
                        congDoan.value != 102484 &&
                        congDoan.id != 102490 &&
                        congDoan.factoryId == 102366
                      "
                      dense
                      v-model="chonCongDoansTB"
                      :val="congDoan.ID"
                      style="font-weight: bold"
                      :label="congDoan.departmentName"
                      color="amber-6"
                    />
                    <q-checkbox
                      v-if="
                        congDoan.value != 102484 &&
                        congDoan.id != 102490 &&
                        congDoan.factoryId == 102427
                      "
                      dense
                      v-model="chonCongDoansQM"
                      :val="congDoan.ID"
                      style="font-weight: bold"
                      :label="congDoan.departmentName"
                      color="amber-6"
                    />
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div
            class="col-2 col-md-2"
            v-for="(congDoan, index) in departments"
            :key="index"
          ></div>
        </div>
        <div class="row">
          <div class="col-12">
            <!-- <DxPivotGrid
              v-show="showPivort"
              id="pivotgrid"
              ref="grid"
              :data-source="dataSource"
              :allow-sorting-by-summary="false"
              :allow-filtering="true"
              :show-borders="true"
              :show-column-grand-totals="true"
              :show-row-grand-totals="false"
              :show-column-totals="false"
              :row-header-layout="'tree'"
              @cell-prepared="onCellPrepared"
            >
              <DxFieldChooser :enabled="true" :height="400" />
              <DxExport :enabled="true" :allow-export-selected-data="true" :file-name="title" />
            </DxPivotGrid> -->
            <DxDataGrid
              id="gridContainer"
              :word-wrap-enabled="true"
              :data-source="dataSourceFilter"
              :show-row-lines="true"
              :show-column-lines="true"
              :show-borders="true"
              :column-auto-width="true"
              @cell-prepared="onCellPrepared"
              @row-prepared="onRowPrepared"
              :no-data-text="'Không có dữ liệu !'"
            >
              <DxExport
                :enabled="isExcel"
                :allow-export-selected-data="true"
                :file-name="titleExcel"
              />
              <DxGroupPanel :visible="isExcel" />
              <DxScrolling mode="infinite" />
              <DxSorting mode="none" />
              <DxFilterPanel :visible="isExcel" />
              <DxFilterRow :visible="isExcel" />
              <DxHeaderFilter :visible="isExcel" />
              <DxSummary>
                <DxGroupItem
                  column="total"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
                <DxGroupItem
                  column="thu2m"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
                <DxGroupItem
                  column="thu3m"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
                <DxGroupItem
                  column="thu4m"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
                <DxGroupItem
                  column="thu5m"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
                <DxGroupItem
                  column="thu6m"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
                <DxGroupItem
                  column="thu7m"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
                <DxGroupItem
                  column="TONGKL"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.##'"
                />
              </DxSummary>
              <DxSearchPanel
                :visible="isExcel"
                :width="240"
                placeholder="Tìm kiếm..."
              />
              <DxColumn data-field="congdoan" caption="Tổ" group-index="0" />
                 <DxColumn
                data-field="item_parent"
                caption="SP"
                  :width="280"
               :fixed="true"
              />
              <DxColumn
                data-field="ten san pham"
                :width="280"
                caption="SP/Chi tiết"
                sort-order="asc"
                :fixed="true"
              />
                <DxColumn
                data-field="ACCOUNTING_CODE"
                :width="120"
                caption="Mã kế toán"
               
                
                :fixed="true"
              />
              <DxColumn
                data-field="item_parent"
                caption="Sản phẩm"
                group-index="1"
              />
              <DxColumn caption="KT Tinh(mm)" alignment="center" :fixed="true">
                <DxColumn
                  data-field="LENGTH"
                  caption="Dài"
                  data-type="number"
                  format="fixedpoint"
                  alignment="center"
                  :width="90"
                />
                <DxColumn
                  data-field="WIDTH"
                  caption="Rộng"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="90"
                />
                <DxColumn
                  data-field="HEIGHT"
                  caption="Dày"
                  data-type="number"
                  format="fixedpoint"
                  alignment="center"
                  :width="90"
                />
              </DxColumn>
               <DxColumn
                  data-field="chungloai"
                  caption="Chủng loại"
                  alignment="center"
                   :fixed="true"
                  :width="90"
                />
              <DxColumn
                caption="Kế hoạch thực hiện"
                :width="180"
                alignment="center"
                :fixed="true"
              >
                <DxColumn
                  data-field="KeHoach"
                  caption="Sản lượng"
                  data-type="number"
                  :width="100"
                  format="fixedpoint"
                  alignment="left"
                  cellTemplate="changeColor"
                />

                <DxColumn
                  data-field="dvt"
                  caption="Đơn vị tính"
                  data-type="number"
                  format="fixedpoint"
                  alignment="left"
                  width="100"
                />
                <DxColumn
                  data-field="total"
                  caption="Tổng m3"
                  data-type="number"
                  format="#,##0.##"
                  alignment="left"
                  :width="80"
                />
              </DxColumn>
              <DxColumn caption="Số lượng" alignment="center">
                <DxColumn
                  data-field="thu2"
                  caption="T2"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu3"
                  caption="T3"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu4"
                  caption="T4"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu5"
                  caption="T5"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu6"
                  caption="T6"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu7"
                  caption="T7"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="cn"
                  caption="CN"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="75"
                />
              </DxColumn>
              <DxColumn
                data-field="WEEK_PO"
                caption="Tổng SL đạt được"
                data-type="number"
                format="#,##0.##"
                alignment="center"
                :width="100"
              />
              <DxColumn
                data-field="loi"
                caption="Sản lượng lỗi"
                data-type="number"
                format="###,##0.##"
                alignment="center"
                :width="100"
              />
              <DxColumn
                data-field="TT"
                caption="Tổng SL Thực tế"
                data-type="number"
                format="#,##0.##"
                alignment="center"
                :width="100"
              />
              <DxColumn
                caption="M3"
                alignment="center"
                :visible="showVolumnColumn"
              >
                <DxColumn
                  data-field="thu2m"
                  caption="T2"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu3m"
                  caption="T3"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu4m"
                  caption="T4"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu5m"
                  caption="T5"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu6m"
                  caption="T6"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="thu7m"
                  caption="T7"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="70"
                />
                <DxColumn
                  data-field="cnm"
                  caption="CN"
                  data-type="number"
                  format="#,##0.##"
                  alignment="center"
                  :width="75"
                />
              </DxColumn>
              <DxColumn
                data-field="TONGKL"
                caption="Tổng KL đạt được"
                data-type="number"
                format="#,##0.##"
                alignment="center"
                :width="100"
              />
              <!-- <DxColumn
                data-field="KLTT"
                caption="Tổng KL thực tế"
                data-type="number"
                format="#,##0.##"
                alignment="center"
                :width="100"
              /> -->
              <DxColumn
                data-field="conPhaiThucHien"
                caption="KL còn phải làm"
                css-class="mauRW2"
                format="#,##0.##"
                alignment="center"
                :width="80"
              />

              <DxColumn
                data-field="UNIT_ID"
                caption="% đạt KH"
                alignment="center"
                :width="120"
              />
              <!-- <DxColumnFixing :enabled="true" /> -->
              <template #changeColor="cell">
                <div v-if="cell.data.data.KeHoach == null">
                  <div
                    class="text"
                    style="
                      border-radius: 5px;
                      width: 100%;
                      height: 100%;
                      background-color: #ffff00;
                      padding: 5px;
                    "
                  >
                    <b style="text-color: blue">{{ cell.data.data.KeHoach }}</b>
                  </div>
                </div>
                <div v-else>{{ cell.data.data.KeHoach }}</div>
              </template>
            </DxDataGrid>
          </div>
        </div>
      </div>
    </q-card>
    <!-- <q-dialog v-model="showFilterDialog" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <div class="col-12">
            <h6>Tùy chỉnh tìm kiếm</h6>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <q-input v-model.number="week" type="number" label="Tuần" />
            </div>
            <div class="col-12">
              <q-input v-model.number="year" type="number" label="Năm" />
            </div>
            <div class="col-12">
              <q-toggle v-model="showVolumnColumn" label="Hiển thị cột khối lượng" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" @click="loadGrid" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    </div>
  </q-page>
</template>

<script>
import {
  DxChart,
  DxAdaptiveLayout,
  DxCommonSeriesSettings,
  DxSize,
  DxTooltip,
} from "devextreme-vue/chart";
import { DxDateBox } from "devextreme-vue";
import { mapGetters, mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
  DxRequiredRule,
  DxScrolling,
  DxSearchPanel,
  DxSelection,
  DxColumnFixing,
  DxSorting,
  DxGroupPanel,
  DxFilterRow,
  DxFilterPanel,
  DxHeaderFilter,
  DxGroupItem,
  DxSummary,
} from "devextreme-vue/data-grid";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
  getWeekNumber,
  showLoadingIos,
  closeLoading,
} from "../../../ultils";
import {
  DxPivotGrid,
  DxFieldChooser,
  DxExport,
} from "devextreme-vue/pivot-grid";
import moment from "moment";
export default {
  components: {
    DxHeaderFilter,
    DxChart,
    DxAdaptiveLayout,
    DxCommonSeriesSettings,
    DxSize,
    DxFilterPanel,
    DxTooltip,
    DxPivotGrid,
    DxFieldChooser,
    DxExport,
    DxFilterRow,
    DxSorting,
    DxGroupPanel,
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxLookup,
    DxRequiredRule,
    DxScrolling,
    DxSearchPanel,
    DxSelection,
    DxColumnFixing,
    DxGroupItem,
    DxSummary,
  },
  computed: {
    pivortGrid: function () {
      return this.$refs.grid.instance;
    },
    ...mapGetters("base", [
      "opCongDoans",
      "myFactoryInfor",
      "userInfo",
      "dsCongDoans",
    ]),
    dataSourceFilter() {
      console.log("idDepartment", this.idDepartment);
      console.log("chonCongDoansTH", this.chonCongDoansTH);
      if (this.idDepartment) {
        if (this.idDepartment.factoryId == 100000)
          return this.dataSourceGrid.filter((i) =>
            this.chonCongDoansTH.includes(i.STEP_ID)
          );
        if (this.idDepartment.factoryId == 102427)
          return this.dataSourceGrid.filter((i) =>
            this.chonCongDoansQM.includes(i.STEP_ID)
          );
        if (this.idDepartment.factoryId == 102340)
          return this.dataSourceGrid.filter((i) =>
            this.chonCongDoansYS1.includes(i.STEP_ID)
          );
        if (this.idDepartment.factoryId == 102366)
          return this.dataSourceGrid.filter((i) =>
            this.chonCongDoansTB.includes(i.STEP_ID)
          );
      }
    },
  },
  data() {
    return {
      
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
        //  {
        //   label: "Nhà máy CBG Quang Minh",
        //   factoryId: 102427,
        //    code: "QM",
        // },
      ],
      data2: [],
      data1: [],
      isExcel: false,
      titleExcel: null,
      chonCongDoans: [],
      ngaythang: null,
      idDepartment: null,
      xoa: false,
      showChooseMonth: false,
      allDepartmentTH: false,
      allDepartmentQM: false,
      allDepartmentYS1: false,
      allDepartmentTB: false,
      chonCongDoansTH: [],
      chonCongDoansQM: [],
      chonCongDoansYS1: [],
      chonCongDoansTB: [],
      dataSource: null,
      listGroupDepartment: [],
      year: null,
      month: null,
      stepId: null,
      week: null,
      departments: [],
      department: null,
      title: "Báo cáo sản lượng tuần chi tiết",
      countData: 0,
      fa: 0,
      dataSourceGrid: [],
      showPivort: false,
      showFilterDialog: false,
      showVolumnColumn: true,
    };
  },
  created() {
    const today = new Date();
    const currentMonth = today.getMonth();
    this.month = currentMonth;
    const currentYear = today.getFullYear();
    this.year = currentYear;
    //this.load()
    this.week = getWeekNumber(today);
    this.loadListGroupDepartment();
    // this.loadDepartments()
    // this.loadGrid();
  },
  methods: {
    ...mapActions("base", ["getAllDepartment", "getAllCongDoans"]),
        ...mapActions("prod", [
      "getDepartmentByFactoryId",
      "getGroupDepartment",
      "getListGroupDepartment",
    ]),
    async loadListGroupDepartment() {
      const data = await this.getListGroupDepartment();
      this.listGroupDepartment = data;
    },
    calculateTyLe(rowData) {
      if (parseFloat(rowData.tongSanLuong) > 0 && parseFloat(rowData.po) > 0) {
        const tyle = rowData.tongSanLuong / rowData.po;
        return tyle;
      }
    },
    onCellPrepared(e) {
      if (e.rowType === "group") {
        if (e.row.groupIndex == 0) {
          e.cellElement.style.backgroundColor = "#bbdefb";
        }
      }
    },
    async selectAll() {
      this.open = 1;
      if (this.allDepartmentCBG) {
        this.listGroupDepartment.forEach((el) => {
          if (this.idDepartment.factoryId == 102299) this.chonCongDoansCBG.push(el.NAME);
        });
      } else this.chonCongDoansCBG = [];
      if (this.allDepartmentYS1) {
        this.departments.forEach((el) => {
          if (this.idDepartment.factoryId == 102340) this.chonCongDoansYS1.push(el.ID);
        });
      } else this.chonCongDoansYS1 = [];
      if (this.allDepartmentTB) {
        this.departments.forEach((el) => {
          if (this.idDepartment.factoryId == 102366) this.chonCongDoansTB.push(el.ID);
        });
      } else this.chonCongDoansTB = [];
      if (this.allDepartmentQM) {
        this.departments.forEach((el) => {
          if (this.idDepartment.factoryId == 102427) this.chonCongDoansQM.push(el.ID);
        });
      } else this.chonCongDoansQM = [];
      if (this.allDepartmentTH) {
        this.departments.forEach((el) => {
          if (this.idDepartment.factoryId == 100000) this.chonCongDoansTH.push(el.ID);
        });
      } else {
        this.chonCongDoansTH = [];
      }
    },
    async onChange(value) {
      let data = await this.getGroupDepartment();
      data = data.filter((d) => d.factoryId == this.idDepartment.factoryId);
      this.chonCongDoans = [];
      this.departments = data;
      console.log("this.departments", this.departments);
      await this.loadGrid();
    },

    checkDepartment(id) {
      let data = null;
      data = this.dataSourceGrid.find((s) => s.STEP_ID == id);
      if (data) {
        return true;
      } else {
        return false;
      }
    },

    async filterFn(val, update) {
      console.log("this.data", this.data);
      if (val === "") {
        update(() => {
          this.data1 = this.data2;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.data1 = this.data2.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    exportToExcel() {
      // this.pivortGrid.exportToExcel()
    },
    async loadDepartments() {
      const myFactoryId = this.idDepartment.factoryId;
      const payload = {
        factoryId: myFactoryId,
      };
      if (myFactoryId) {
        const data = await this.$store.dispatch(
          "base/GET_DEPARTMENTS",
          payload
        );

        // this.departments = data.data
        data.data.forEach((element) => {
          if (element.type === "Tổ") {
            this.departments.push({
              value: element.id,
              label: element.name,
            });
          }
        });
        if (this.departments.length > 0) {
          this.department = this.departments[0];
        }
      }
    },
    async selectMonthYear(m, y) {
      this.month = m;
      this.year = y;
      this.$q.loading.show();
      await this.load();
      this.showChooseMonth = false;
      this.$q.loading.hide();
    },
    onRowPrepared(e) {
      var alignByColumn,
        groupSummary,
        colspan = 0;

      if (e.rowType === "group") {
        groupSummary = e.component.option("summary.groupItems");
        groupSummary.forEach((el) => {
          alignByColumn = el.alignByColumn;
          return !alignByColumn;
        });
        if (alignByColumn) {
          e.columns.forEach((el) => {
            if (el.fixed && el.fixedPosition !== "right") {
              colspan++;
            }
          });

          if(e.rowElement.find(".dx-group-cell").css("visibility") === "hidden") {
        				e.rowElement.find(".dx-group-cell").css("visibility", "").attr("colspan", colspan);
        			} 
        			else {
        				e.rowElement.find(".dx-group-cell").text("");
        			}
        }
      }
    },
    onCellPrepared: function (e) {
      if (e.cell.type === "GT" && e.cell.text === "Grand Total") {
        // e.cell.text='Tổng'
        // return 'Tổng'
        // e.cellElement.find("span").text('Tổng')
        // e.cellElement.text('Tổng')
        // e.cell.text="Tổng"
        // e.cellElement=`<td style="border-right:0px;border-bottom-width:0px" class="dx-row-total dx-grandtotal"><span>Tổng</span></td>`
        // e.cell.isLast = false
        // console.log(e)
        e.cellElement.innerText = "Tổng";
      }
      // console.log(e.cell)
      // if (e.area == "data" && e.cell.rowType == "GT" && e.cell.columnPath.length) {
      //     var quarter = e.cell.columnPath.length > 1 ?
      //                 "+Q"+e.cell.columnPath[1].toString() : "";
      //     e.cellElement.find("span")
      //     .text("Drilldown:"+e.cell.columnPath[0].toString() + quarter);
      // }
    },
    async loadGrid() {
      if (this.idDepartment.code == "TH") this.fa = 100000;
      if (this.idDepartment.code == "QM") this.fa = 102427;
      if (this.idDepartment.code == "YS1B") this.fa = 100004;
      if (this.idDepartment.code == "TB") this.fa = 100005;
      if (this.year == 2022) {
        if (this.week == 1) this.ngaythang = "2022-01-03";
        else
          this.ngaythang = moment("2022-01-03")
            .add((this.week - 1) * 7, "days")
            .format("YYYY/MM/DD");
      }
    else 
     this.ngaythang = moment("2023-01-02")
            .add((this.week - 1) * 7, "days")
            .format("YYYY/MM/DD");
      const payload = {
        week:this.year<2023?parseInt(this.week) + 1:parseInt(this.week),
        year: this.year,
        factoryId: this.fa,
        ngay: this.ngaythang,
        departmentId: this.stepId ? this.stepId.value : 0,
      };
      this.titleExcel = `Báo cáo sản lượng tuần chi tiết tuần ${this.week} - ${this.year}`;
      showLoadingIos();
      // let dataPivort = [];
      const data = await this.$store.dispatch("prod/GET_REPORT_WEEK4", payload);
      let dataConvert = [];

      data.data.forEach((element) => {
        if (element["KeHoach"] != null) {
          element.thu2m = Number.isNaN(element["thu2"] * element.volumn)
            ? 0
            : element["thu2"] * element.volumn;
        } else {
          element["thu2m"] = null;
        }
        if (element["KeHoach"] != null) {
          element.thu3m = Number.isNaN(element["thu3"] * element.volumn)
            ? 0
            : element["thu3"] * element.volumn;
        } else {
          element["thu3m"] = null;
        }
        if (element["KeHoach"] != null) {
          element.thu4m = Number.isNaN(element["thu4"] * element.volumn)
            ? 0
            : element["thu4"] * element.volumn;
        } else {
          element["thu4m"] = null;
        }
        if (element["KeHoach"] != null) {
          element.thu5m = Number.isNaN(element["thu5"] * element.volumn)
            ? 0
            : element["thu5"] * element.volumn;
        } else {
          element["thu5m"] = null;
        }
        if (element["KeHoach"] != null) {
          element.thu6m = Number.isNaN(element["thu6"] * element.volumn)
            ? 0
            : element["thu6"] * element.volumn;
        } else {
          element["thu6m"] = null;
        }
        if (element["KeHoach"] != null) {
          element.thu7m = Number.isNaN(element["thu7"] * element.volumn)
            ? 0
            : element["thu7"] * element.volumn;
        } else {
          element["thu7m"] = null;
        }
        if (element["KeHoach"] != null) {
          element.cnm = Number.isNaN(element["cn"] * element.volumn)
            ? 0
            : element["cn"] * element.volumn;
        } else {
          element["cnm"] = null;
        }

        if (element["po"] <= 0) {
          element.po = null;
        }
        if (element.tongSanLuong <= 0) {
          element.tongSanLuong = null;
        }
        if (element.tyleDatKH <= 0) {
          element.tyleDatKH = null;
        }
        if (element.WEEK_PO) {
          element.WEEK_PO =
            element["thu2"] +
            element["thu3"] +
            element["thu4"] +
            element["thu5"] +
            element["thu6"] +
            element["thu7"] +
            element["cn"];
          // console.log("WEEK_PO",element.WEEK_PO)
        }
        element.TT = element.WEEK_PO - element.loi;
        element.TONGKL =
          element["thu2m"] +
          element["thu3m"] +
          element["thu4m"] +
          element["thu5m"] +
          element["thu6m"] +
          element["thu7m"] +
          element["cnm"];
        element.KLTT = element.TT * element.volumn;
        if (element.UNIT_ID) {
          element.UNIT_ID =
            parseFloat((element.WEEK_PO / element.KeHoach) * 100).toFixed(2) +
            "%";
          // console.log("UNIT_ID",element.UNIT_ID)
        } else {
          element.UNIT_ID = null;
        }
        if (element.KeHoach == null || element.KeHoach == 0) {
          element.UNIT_ID = null;
        }
        if (element.KeHoach) {
          if (element.volumn == "M3") {
            element.total = element.KeHoach;
          } else {
            element.total = parseFloat(element.KeHoach * element.volumn);
          }
          if (element.KeHoach == null) {
            element.total == null;
          }
          // console.log(" element.total", element.total)
        }
        // if (element.total == null) {
        //   if (element.volumn == "M3") {
        //     element.total = element.KeHoach;
        //   } else {
        //     element.total = parseFloat(element.KeHoach * element.volumn);
        //   }
        //   // console.log(" element.total", element.total)
        // }
        if (element.total != null && element.TONGKL != null) {
          element.conPhaiThucHien =
            parseFloat(element.total) - parseFloat(element.TONGKL);
        }
        dataConvert.push(element);
      });
      // console.log('dataConvert',dataConvert)
      this.dataSourceGrid = dataConvert;
      closeLoading();
    },
  },
};
</script>

<style>
#gridContainer {
  height: 700px;
}
.dx-datagrid-rowsview .dx-group-row.dx-row > td {
  font-weight: bold;
  color: black;
}
.mauRW2 {
  color: orange;
  font-weight: bold;
}
.active{
  color: #f6b024;
}
</style>