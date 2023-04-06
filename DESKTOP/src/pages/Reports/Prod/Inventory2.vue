<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-10 text-blue text-bold" style="font-size: 18px">
          Tồn từng công đoạn
        </div>

        <div class="col-2" align="right">
          <input @input="chonToDate" type="date" v-model="toDate">
        </div>
      </div>
      <div style="padding: 5px">
        <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
          <div class="col-8">
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in factories1"
                :key="index"
              >
                <q-radio
                  dense
                 @input="loadGrid"
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
          </div>
        </div>
        <DxPivotGrid
          id="pivotgrid"
          ref="grid"
          :data-source="dataSource"
          :allow-sorting-by-summary="false"
          :allow-filtering="true"
          :show-borders="true"
          :show-column-grand-totals="true"
          :show-row-grand-totals="true"
          :show-column-totals="true"
          :show-row-totals="true"
          show-totals-prior="rows"
          :row-header-layout="'tree'"
          @cell-prepared="onCellPrepared"
        >
          <DxScrolling mode="virtual" />
          <DxSorting mode="none" />
          <DxFieldChooser :enabled="true" :height="400" />
          <DxHeaderFilter
            :allow-search="true"
            :show-relevant-values="false"
            :width="300"
            :height="400"
          />
          <DxFieldPanel :visible="showFilterPanel" />
          <DxExport
            :enabled="true"
            :allow-export-selected-data="true"
            :file-name="title"
          />
        </DxPivotGrid>
      </div>
    </div>
  </q-page>
</template>

<script>
import {
  DxPivotGrid,
  DxFieldChooser,
  DxScrolling,
  DxSorting,
  DxExport,
  DxHeaderFilter,
  DxFieldPanel,
} from "devextreme-vue/pivot-grid";
import { getWeekNumber } from "../../../ultils";
import DateBox from "../../../components/commons/DateBox";
import { DxNumberBox } from "devextreme-vue/number-box";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  components: {
    DxPivotGrid,
    DxFieldChooser,
    DxExport,
    DxScrolling,
    DxSorting,
    DateBox,
    DxNumberBox,
    DxHeaderFilter,
    DxFieldPanel,
  },
  data() {
    return {
      units: ["Số lượng(t)", "Khối lượng (m³)"],
      unit: "Số lượng(t)",
      departments: [],
      format: "fixepoint",
      dataSource: null,
      factories1: null,
      columns: [],
      //  factory: {
      //   label: "NM Thuận Hưng",
      //   factoryId: 100000,
      //   value: "100000",
      //   code: "TH",
      // },
      department: null,
      title: "cascs",
      week: "",
      year: "",
      fromDate: new Date(),
      toDate: moment().format("YYYY-MM-DD"),
      showSetting: false,
      showFilterPanel: true,
    };
  },
  created() {
    this.factory = this.factories[0];
    this.factories1 = this.factories;
    const factoryId = this.factory.factoryId;
    const today = new Date();
    this.week = getWeekNumber(today);
    this.toDate = moment().format("YYYY-MM-DD");
    this.fromDate = getFisrtDayOfMonth(new Date());
    const currentYear = today.getFullYear();
    this.year = currentYear;
    // this.loadDepartment()
    const myFactoryId = this.factory;
    this.loadGrid(myFactoryId);
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("prod", ["factories", "goodsTypes"]),
  },
  beforeRouteUpdate(to, from, next) {
    //  const newQuery = this.myFactoryInfor.id;
    // const currentFactoryId = this.myFactoryInfor.id;
    if (newQuery !== currentFactoryId) {
      this.loadGrid(newQuery).then(() => {
        next();
      });
    }
    next();
  },
  mounted() {
    //  console.log(this.$refs.grid.instance);
  },
  methods: {
    chonFromDate(e) {
      this.fromDate = e.value;
      //this.loadGrid(myFactoryId)
    },
    chonToDate() {
      this.refresh();
    },
    // onChangeWeek(e) {
    //   this.week = e.value;
    // },
    // onChangeYear(e) {
    //   this.year = e.value;
    // },
    refresh() {
      const factoryId = this.factory;
      if (factoryId) {
        this.loadGrid(factoryId);
      }
    },
    changeUnit(val) {},
    async loadGrid(myFactoryId) {
      console.log("Nhà máy:", myFactoryId.factoryId);
      if (myFactoryId) {
        const payload = {
          factoryId: myFactoryId.factoryId,
          from: formatDateISO(this.fromDate),
          to: formatDateISO(this.toDate),
        };
        const data = await this.$store.dispatch(
          "prod/GET_REPORT_INVENTORY2",
          payload
        );
        let dataPivort = [];
        data.data.forEach((element) => {
          // if (element['Tổ']!=='-') {
          //     dataPivort.push(element)
          // }
          dataPivort.push(element);
        });
        this.dataSource = {
          fields: [
            {
              caption: "PARENT",
              dataField: "PARENT",
              area: "row",
              expanded: true,
            },
            //   {
            //    caption: "hệ số",
            //   dataField: "rate",
            //   area: "row",
            // },
            {
              caption: "Sản phẩm",
              width: 120,
              dataField: "SP",
              area: "row",
              width: 220,
            },

            {
              dataField: "Tổ",
              area: "column",
            },

            {
              dataField: "Kho/Xưởng",
              area: "filter",
            },

            {
              caption: "Tồn(SL)",
              dataField: "Tồn",
              dataType: "number",
              // summaryType: 'sum',
              format: "fixedpoint",
              area: "data",
              alignment: "center",
              summaryType: "sum",
            },
            {
              caption: "Xuất",
              dataField: "Xuất",
              //   area: 'data',
              dataType: "number",
              format: "fixedpoint",
              summaryType: "sum",
            },
            {
              caption: "Tồn(M3)",
              dataField: "Tồn m3",
              area: "data",
              dataType: "number",
              format: "##0.####",
              summaryType: "sum",
              // calculateSummaryValue: (summaryCell) => {
              //   if (summaryCell.field("row")) {
              //     if (summaryCell.field("row").dataField === "parentName") {
              //       return "";
              //     }
              //   }
              //   return summaryCell.value();
              // },
            },
          ],
          store: dataPivort,
        };
      }
    },
    onCellPrepared: function (e) {
      if (e.cell.type === "GT" && e.cell.text === "Grand Total") {
        e.cellElement.innerText = "Tổng";
      }
      if (e.cell.value < 0) {
        e.cellElement.style.fontWeight = "bold";
        e.cellElement.style.color = "red";
        e.cellElement.style.border = "2px solid red";
      }
      if (e.area == "column") {
        e.cellElement.style.backgroundColor = "#ffcc80";
        e.cellElement.style.color = "black";
      }
    },
  },
};
</script>

<style>
#pivotgrid {
  height: 700px;
}
.active {
  color: #f6b024;
}
</style>