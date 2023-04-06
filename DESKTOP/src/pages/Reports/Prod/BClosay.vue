<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo lò đang sấy
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
            <q-checkbox
              v-model="isExcel"
              color="amber-6"
              class="text-weight-bold"
              label="Xuất Excel"
              dense
            />
          </div>
        </div>

      <q-card-section>
        <div class="row">
          <!-- <div class="col-3 q-pa-md">
                      <DateBox :onChange="chonFromDate" :value="fromDate" :title="'Từ ngày'"/>
                  </div>
                  <div class="col-3 q-pa-md">
                      <DateBox :onChange="chonToDate" :value="toDate" :title="'Đến ngày'"/>
                  </div>
              </div> -->
          <!-- <div class="col-12 col-sm-4 col-md-3 q-pa-sm">
            <div class="dx-field">
              <div class="dx-field-label text-orange">Năm</div>
              <div class="dx-field-value text-white">
                <DxNumberBox
                  ref="week"
                  :value="year"
                  :show-spin-buttons="true"
                  :show-clear-button="true"
                  @value-changed="onChangeYear"
                />
              </div>
            </div>
          </div> -->
          <!-- <div class="col-12 col-sm-4 col-md-6" align="right">
            <q-btn color="primary" glossy icon="search" label="Kiểm tra" @click="refresh" />
          </div> -->
        </div>
        <DxDataGrid
          id="gridContainer"
          :data-source="dataSource"
          :hover-state-enabled="true"
          :word-wrap-enabled="true"
          :show-row-lines="true"
          :row-alternation-enabled="true"
          :selection="{ mode: 'single' }"
        >
             <DxFilterRow :visible="true" />
        <DxExport :enabled="isExcel" file-name="Báo cáo lò đang sấy" />
        <DxScrolling mode="virtual" />
          <DxColumn data-field="nhom" caption="Tên nhóm" :group-index="1" />
          <DxColumn data-field="tenQC" caption="Sản phẩm" :fixed="true" width="420" />
          <DxColumn caption="Quy Cách" alignment="center" :fixed="true" :allowEditing="false">
            <DxColumn
              caption="Dầy"
              data-field="DAY"
              alignment="center"
              width="90"
            />
            <DxColumn
              caption="Rộng"
              data-field="RONG"
              alignment="center"
              width="90"
            />
            <DxColumn
              caption="Dài"
              data-field="DAI"
              alignment="center"
              width="90"
            />
          </DxColumn>
          <DxColumn
            v-for="kiln in kilns"
            :key="kiln.ID"
            alignment="center"
             width="100"
            
            :caption="kiln.NAME"
          >
           <DxColumn
          
            alignment="center"
             width="100"
            :data-field="kiln.CODE"
            caption="SL"
          />
            <DxColumn
          
            alignment="center"
             width="100"
            :data-field="kiln.CODEKL"
            caption="KL"
             format="#,##0.####"
          />
          </DxColumn>
            <!-- <DxColumn
              caption="Tổng cộng (m3)"
              data-field="tongcong"
              alignment="center"
              width="90"
                 format="#,##0.####"
             
            /> -->
            <DxSummary>
              <DxTotalItem column="tenQC" :display-format="'Tổng'" />
              <DxTotalItem
              :column="kiln.CODEKL"
              v-for="kiln in kilns"
              :key="kiln.CODEKL"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            </DxSummary>
        </DxDataGrid>

      </q-card-section>
      <q-card-section>
        
        <!-- <DxPivotGrid
          id="pivotgrid"
          ref="grid"
          :data-source="dataSource"
          :allow-sorting-by-summary="true"
          :allow-filtering="true"
          :show-borders="true"
          :show-column-grand-totals="true"
          :show-row-grand-totals="true"
          :show-column-totals="true"
          :row-header-layout="'tree'"
          show-totals-prior="rows"
          @cell-prepared="onCellPrepared"
        >
         <DxScrolling
      mode="virtual"
    />
     <DxSorting mode="none" />
          <DxFieldChooser :enabled="true" :height="400" />
          <DxHeaderFilter
            :allow-search="true"
            :show-relevant-values="false"
            :width="300"
            :height="400"
          />
          <DxFieldPanel :visible="showFilterPanel" />
          <DxExport :enabled="true" :allow-export-selected-data="true" :file-name="title" />
        </DxPivotGrid> -->
      </q-card-section>
      </div>
    </q-card>

    <q-dialog v-model="showSetting" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <div class="col-12">Cài đặt</div>
        </q-card-section>
        <q-card-section>
          <q-toggle
            v-model="showFilterPanel"
            label="Hiển thị khung lọc dữ liệu"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        glossy
        icon="fas fa-cog"
        color="primary"
        @click="showSetting = true"
      />
    </q-page-sticky>

  </q-page>
</template>

<script>
import {
  DxPivotGrid,
  DxFieldChooser,
  DxSorting,
  DxHeaderFilter,
  DxFieldPanel,
} from "devextreme-vue/pivot-grid";
import { DxDataGrid, DxColumn, DxExport,DxFilterRow, DxScrolling, DxSummary, DxTotalItem } from "devextreme-vue/data-grid";
import { getWeekNumber } from "../../../ultils";
import DateBox from "../../../components/commons/DateBox";
import { DxNumberBox } from "devextreme-vue/number-box";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import { mapGetters } from "vuex";
export default {
  components: {
    DxPivotGrid,
    DxFieldChooser,
    DxExport,
    DxScrolling,
    DxSorting,
    DateBox,
    DxFilterRow,
    DxNumberBox,
    DxHeaderFilter,
    DxFieldPanel,
    DxDataGrid,
    DxColumn,
    DxSummary, 
    DxTotalItem
  },
  data() {
    return {
      units: ["Số lượng(t)", "Khối lượng (m³)"],
      unit: "Số lượng(t)",
      departments: [],
      kilns: [],
      format: "fixepoint",
      dataSource: null,
      factories1: null,
      columns: [],
      fa:null,
      isExcel: false,
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
      toDate: new Date(),
      showSetting: false,
      showFilterPanel: false,
    };
  },
  created() {
    this.factory = this.factories[0];
    console.log("this.factories", this.factories);
    this.factories1 = this.factories.filter(f => f.factoryId != 100003);
    const factoryId = this.factory.factoryId;
    const today = new Date();
    this.week = getWeekNumber(today);
    this.toDate = new Date();
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
    chonToDate(e) {
      this.toDate = e.value;
      //this.loadGrid(myFactoryId)
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
    async loadKilnProcess() {
      if (this.factory.factoryId == 100004)
      this.fa = 100003
      else this.fa = this.factory.factoryId
      const payload = {
        factoryId: this.fa,
      };
      const data = await this.$store.dispatch("prod/GET_KILN_PROCESS", payload);
      this.kilns = data.data;
      console.log("data", this.kilns);
    },
  //   calculateTongThanh(rowData) {
  //     rowData.tongcong = 0
  //            for (let i =0;i<this.kilns.length;i++)
  //     rowData.tongcong += rowData[this.kilns[i].CODEKL] ;
    
  //      return rowData.tongcong ;
  // },
    async loadGrid(myFactoryId) {
      console.log("Nhà máy:", myFactoryId.factoryId);
      if (myFactoryId) {
     
        if (myFactoryId.factoryId == 100004)
        this.fa = 100003
        else this.fa = myFactoryId.factoryId 
        const payload = {
          factoryId: this.fa,
          from: formatDateISO(this.fromDate),
          to: formatDateISO(this.toDate),
        };
        await this.loadKilnProcess();
        const data = await this.$store.dispatch(
          "prod/GET_REPORT_WEEK",
          payload
        );
        this.dataSource = data.data;
          // data.data.forEach((element) => {
          //   element.tongcong = 0;
          //     for (let i =0;i<this.kilns.length;i++)
          //      element.tongcong += element[this.kilns[i].CODEKL] ;
          //       this.dataSource.push(element);
          // })
        // let dataPivort = [];
        // data.data.forEach((element) => {
        //   // if (element['Tổ']!=='-') {
        //   //     dataPivort.push(element)
        //   // }
        //   dataPivort.push(element);
        // });
        // this.dataSource = {
        //   fields: [
        //     {
        //       caption: "ten nhóm",
        //       dataField: "nhom",
        //       area: "row",
        //       expanded: true,
        //     },
        //     //   {
        //     //    caption: "hệ số",
        //     //   dataField: "rate",
        //     //   area: "row",
        //     // },
        //     {
        //       caption: "Sản phẩm",
        //       width: 120,
        //       dataField: "tenQC",
        //       area: "row",
        //       width: 220,
        //     },

        //     {
        //       dataField: "lo",
        //       area: "column",
        //     },

        //     // {
        //     //   dataField: "Kho/Xưởng",
        //     //   area: "filter",
        //     // },
        //     // {
        //     //   caption: "Tồn đầu kỳ",
        //     //   dataField: "Tồn đầu kỳ",
        //     //  area: "data",
        //     //   dataType: "number",
        //     //   format: "fixedpoint",
        //     //   summaryType: "sum",
        //     // },
        //     {
        //        caption: "SL",
        //       dataField: "QUANTITY",
        //       dataType: "number",
        //       // summaryType: 'sum',
        //       format:"##0.####",
        //        area: 'data',
        //       alignment: "center",
        //       summaryType: "sum",

        //     },
        //     {
        //       caption: "Xuất",
        //       dataField: "Xuất",
        //     //   area: 'data',
        //       dataType: "number",
        //       format: "fixedpoint",
        //       summaryType: "sum",
        //     },
        //     {
        //       caption: "KL m3",
        //       dataField: "QUANTITYM3",
        //      area: 'data',
        //       dataType: "number",
        //       format:"##0.####",
        //       summaryType: "sum",
        //       calculateSummaryValue: (summaryCell) => {
        //         if (summaryCell.field("row")) {
        //           if (summaryCell.field("row").dataField === "parentName") {
        //             return "";
        //           }
        //         }
        //         return summaryCell.value();
        //       },
        //     },
        //   ],
        //   store: dataPivort,
        // };
      }
    },
    // onCellPrepared: function (e) {
    //   if (e.cell.type === "GT" && e.cell.text === "Grand Total") {
    //     e.cellElement.innerText = "Tổng";
    //   }
    // },
  },
};
</script>

<style scoped>
/* #gridContainer {
  height: 700px;
 
} */

</style>