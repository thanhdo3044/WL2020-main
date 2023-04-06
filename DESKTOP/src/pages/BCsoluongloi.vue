<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-9 text-blue text-bold" style="font-size: 18px">
          Báo cáo số lượng lỗi từng công đoạn -
          <span class="text-amber-14">{{ factory ? factory.label : "" }}</span>
        </div>
        <div class="col-3 text-blue text-bold" align="right">
          <span style="font-size: 18px">Từ tuần: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="load"
            v-model="fromWeek"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 40px;
            "
          />
          <span style="margin-right: 15px">-</span>
          <span style="font-size: 18px">Đến tuần: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="load"
            v-model="toWeek"
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
            @input="load"
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
                  @input="loadDepartment"
                  v-model="factory"
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
          v-if="factory"
          class="row"
          style="font-size: 12px; vertical-align: top"
        >
          <div class="col-12">
            <table style="border: 1px solid black; width: 100%">
              <tr>
                <td scope="col" style="border-right: 1px solid black">
                  <div>
                    <q-checkbox
                      v-if="factory.id == 100000"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentTH"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="factory.id == 102340"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentYS1"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="factory.id == 102366"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentTB"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="factory.id == 102427"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentQM"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="factory.id == 102299"
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
                      v-if="factory.id == 102299"
                      @input="load"
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
                      @input="load"
                      dense
                      v-model="chonCongDoansTH"
                      :val="congDoan.departmentName"
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
                      @input="load"
                      dense
                      v-model="chonCongDoansYS1"
                      :val="congDoan.departmentName"
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
                      @input="load"
                      dense
                      v-model="chonCongDoansTB"
                      :val="congDoan.departmentName"
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
                      @input="load"
                      dense
                      v-model="chonCongDoansQM"
                      :val="congDoan.departmentName"
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
            <DxChart id="chart" :data-source="dataChart">
              <DxTitle :text="'Biểu đồ số lượng lỗi từng công đoạn '">
                <DxFont weight="900" size="19" color="#1976d2" />
              </DxTitle>
              <DxCommonSeriesSettings
                argument-field="donvi"
                type="bar"
                hover-mode="allArgumentPoints"
                selection-mode="allArgumentPoints"
              >
              </DxCommonSeriesSettings>

              <DxValueAxis position="left">
                <DxTitle text="M³" />
              </DxValueAxis>
              <!-- <DxSeries value-field="sayPhoi" name="Sấy phôi" color="#9C27B0" /> -->
              <DxSeries value-field="luaPhoi" name="Lựa phôi" color="#ea7ccc" />
              <DxSeries value-field="soChe" name="Sơ chế" color="#673ab7" />
              <DxSeries value-field="tinhChe" name="Tinh chế" color="#cddc39" />
              <DxSeries
                value-field="hoanThienMoc"
                name="Hoàn thiện mộc"
                color="#42a5f5"
              />
              <DxSeries
                value-field="hoanThien"
                name="Hoàn thiện"
                color="#ffc107"
              />
              <DxSeries value-field="dongGoi" name="Đóng gói" color="#4caf50" />
              <DxLegend
                vertical-alignment="bottom"
                horizontal-alignment="center"
              />
            </DxChart>
          </div>
          <div class="col-7" >
            <div align="center">
              <span class="title"
              > <u>Thông tin số lượng lỗi</u></span
            >
            <DxDataGrid
              id="baoCaoSoLuongLoi"
              :data-source="dataSourcefilter"
              :show-borders="true"
              :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
              :show-column-lines="true"
              :show-row-lines="true"
              :allow-column-resizing="true"
              @cell-prepared="onCellPrepared"
              @content-ready="onContentReady"
            >
              <DxColumnChooser :enabled="isExcel" />
              <DxHeaderFilter :visible="isExcel" />
              <DxScrolling mode="virtual" />
              <DxGroupPanel
                :visible="isExcel"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              />
              <DxGrouping :auto-expand-all="true" />
              <!-- <DxColumn data-field="ID" caption="#" /> -->
              <DxColumn
                data-field="groupName"
                caption=""
                :group-index="0"
                group-cell-template="groupCellTemplate"
                :sort-index="0"
                sort-order="asc"
              />
              <template #groupCellTemplate="{ data }">
                <div style="font-weight: bold">
                  {{ data.value.substring(2) }}
                </div>
              </template>
              <DxColumn
                data-field="departmentName2"
                caption=""
                :group-index="1"
                group-cell-template="groupCellTemplate2"
              />
              <template #groupCellTemplate2="{ data }">
                <div>{{ data.value }}</div>
              </template>
              <DxColumn
                data-field="paren"
                caption="Sản phẩm"
                :group-index="2"
              />
              <DxColumn data-field="chitiet" caption="Tên" width="380" />
              <DxColumn
                caption="Dầy"
                data-field="HEIGHT"
                format="fixedPoint"
                alignment="center"
                width="90"
              />
              <DxColumn
                caption="Rộng"
                data-field="WIDTH"
                format="fixedPoint"
                alignment="center"
                width="90"
              />
              <DxColumn
                caption="Dài"
                data-field="LENGTH"
                format="fixedPoint"
                alignment="center"
                width="90"
              />
              <DxColumn
                data-field="soluong"
                caption="Số lượng"
                data-type="number"
                format="#,##0.00"
                width="160"
              />
              <DxColumn
                data-field="tongKL"
                caption="M³"
                data-type="number"
                format="#,##0.00"
                width="160"
              />
              <DxSummary>
                <DxGroupItem
                  column="soluong"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'fixedpoint'"
                />
                <DxGroupItem
                  column="tongKL"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  value-format="###0.00"
                />
              </DxSummary>

              <DxExport
                :enabled="isExcel"
                :allow-export-selected-data="false"
                :file-name="'Dữ liệu lỗi từ ngày '"
              />
              <DxSearchPanel
                :visible="isExcel"
                :placeholder="'Tìm kiếm'"
                :width="400"
              />
            </DxDataGrid>
            </div>
            
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxExport,
  DxSummary,
  DxGroupItem,
  DxHeaderFilter,
  DxColumnChooser,
  DxScrolling,
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
} from "devextreme-vue/chart";
import moment from "moment";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxExport,
    DxSummary,
    DxGroupItem,
    DxHeaderFilter,
    DxColumnChooser,
    DxScrolling,
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
      dataSource: [],
      dataChart: [],
      chonCongDoans: [],
      departments: [],
      allDepartmentTH: false,
      allDepartmentYS: false,
      allDepartmentYS1B: false,
      allDepartmentTB: false,
      chonCongDoansTH: [],
      chonCongDoansYS: [],
      chonCongDoansYS1B: [],
      chonCongDoansTB: [],
      arrDepartment: [],
      sanLuongs: [],
      isExcel: false,
      showChooseDate: false,
      fromWeek: null,
      toWeek: null,
      year: null,
      factory: null,
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          id: 100000,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          id: 102340,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          id: 102366,
        },
        {
          label: "Nhà máy CBG Quang Minh",
          id: 102427,
        },
      ],
    };
  },

  created() {
    this.year = moment().year();
    this.toWeek = moment().week();
    console.log("this.toWeek", this.toWeek);
    this.fromWeek = this.toWeek - 10;
    this.loadListGroupDepartment();
  },
  methods: {
    ...mapActions("sanxuat", ["getAllSanLuongchonhan"]),
    ...mapActions("prod", [
      "getDepartmentByFactoryId",
      "getGroupDepartment",
      "getListGroupDepartment",
    ]),
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
    async loadListGroupDepartment() {
      const data = await this.getListGroupDepartment();
      this.listGroupDepartment = data;
    },
    ...mapActions("prod", [
      "getDepartmentByFactoryId",
      "getSLTheoThangSL",
      "getSLloi",
      "getChartSLloi",
    ]),
    async selectAll() {
      if (this.allDepartmentYS1) {
        this.departments.forEach((el) => {
          if (this.factory.id == 102340)
            this.chonCongDoansYS1B.push(el.departmentName);
        });
      } else this.chonCongDoansYS1B = [];
      if (this.allDepartmentTB) {
        this.departments.forEach((el) => {
          if (this.factory.id == 102366)
            this.chonCongDoansTB.push(el.departmentName);
        });
      } else this.chonCongDoansTB = [];
      if (this.allDepartmentTH) {
        this.departments.forEach((el) => {
          if (this.factory.id == 100000)
            this.chonCongDoansTH.push(el.departmentName);
        });
      } else {
        this.chonCongDoansTH = [];
      }
      this.load(this.factory.id);
    },

    async loadDepartment(value) {
      let data = await this.getGroupDepartment();
      data = data.filter((d) => d.factoryId == this.factory.id);
      this.allDepartment = false;
      this.chonCongDoans = [];
      this.departments = data;
      this.load();
    },
    async load(departmentId) {
      if (this.factory) {
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
        if (this.arrDepartment.length == 0) {
          this.dataSource = [];
          this.dataChart = [];
        } else {
          let payload2 = {
            fromWeek: this.fromWeek,
            toWeek: this.toWeek,
            year: this.year,
            arrDepartment: this.arrDepartment,
          };
          this.dataChart = await this.getChartSLloi(payload2);
          console.log("this.dataChart", this.dataChart);
        }
      }

      let payload = {
        fromWeek: this.fromWeek,
        toWeek: this.toWeek,
        year: this.year,
        departmentId,
      };
      this.sanLuongs = await this.getSLloi(payload);
    },
  },
  computed: {
    ...mapGetters("base", ["congDoans", "myFactoryInfor"]),
    ...mapGetters("prod", ["factories"]),
    dataSourcefilter() {
      console.log("this.sanLuongs", this.sanLuongs);
      if (this.factory) {
        if (this.factory.id == 100000)
          return this.sanLuongs.filter((i) =>
            this.chonCongDoansTH.includes(i.departmentName)
          );
        if (this.factory.id == 102339)
          return this.sanLuongs.filter((i) =>
            this.chonCongDoansYS.includes(i.departmentName)
          );
        if (this.factory.id == 102340)
          return this.sanLuongs.filter((i) =>
            this.chonCongDoansYS1B.includes(i.departmentName)
          );
        if (this.factory.id == 102366)
          return this.sanLuongs.filter((i) =>
            this.chonCongDoansTB.includes(i.departmentName)
          );
      }
    },
  },
};
</script>

<style>
#baoCaoSoLuongLoi {
  height: 300px;
}
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  font-weight: 500;
  background-color: white;
  width: 280;
}
.dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  border-bottom: 1px solid #ddd;
  font-size: 13px;
  font-weight: bold;
}
.dx-datagrid-summary-item {
  color: black;
  font-weight: 500;
}
.dx-datagrid .dx-row > td {
  font-size: 16px;
}
.active {
  color: #f6b024;
}
</style>