<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo nhanh về NSLĐ -
          <span class="text-amber-14">{{
            idDepartment ? idDepartment.label : ""
          }}</span>
        </div>
        <div class="col-3" align="right">
          <q-radio
            style="font-weight: bold; padding-right: 40px"
            @input="loadData"
            color="amber-6"
            v-model="typeBC"
            val="tuan"
            label="Tuần"
          />
          <q-radio
            style="font-weight: bold; padding-right: 20px"
            color="amber-6"
            @input="loadData"
            v-model="typeBC"
            val="thang"
            label="Tháng"
          />
        </div>
        <div class="col-3 text-blue text-bold" align="right">
          <div v-if="typeBC == 'tuan'">
            <span style="font-size: 18px">Từ tuần: </span>
            <input
              class="text-amber-14"
              type="number"
             
              v-model="month"
              style="
                border: none;
                background-color: #daf8e1;
                font-size: 18px;
                width: 40px;
              "
            />
            <span
              class="text-blue text-bold"
              style="font-size: 18px; padding-right: 20px"
              >-</span
            >
            <span style="font-size: 18px">Đến tuần: </span>
            <input
              class="text-amber-14"
              type="number"
          
              v-model="tuan"
              style="
                border: none;
                background-color: #daf8e1;
                font-size: 18px;
                width: 40px;
              "
            />
            <span
              class="text-blue text-bold"
              style="font-size: 18px; padding-right: 20px"
              >-</span
            >
            <input
              class="text-amber-14"
              type="number"
              @input="changeDate"
              v-model="year"
              style="
                border: none;
                background-color: #daf8e1;
                font-size: 18px;
                width: 60px;
              "
            />
<q-btn
        color="blue"
     
        label="Xem"
        @click="changeFactory"
      />
          </div>
          <div v-else>
            <span style="font-size: 18px">Tháng: </span>
            <input
              class="text-amber-14"
              type="number"
              @input="changeFactory"
              v-model="thang"
              style="
                border: none;
                background-color: #daf8e1;
                font-size: 18px;
                width: 60px;
              "
            />
            <span
              class="text-blue text-bold"
              style="font-size: 18px; padding-right: 30px"
              >-</span
            >
            <input
              class="text-amber-14"
              type="number"
              @input="changeDate"
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
    </div>
    <q-card>
      <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
        <div
          class="col-1 col-md-2"
          v-for="(congDoan, index) in options"
          :key="index"
        >
          <q-radio
            dense
            @input="changeFactory"
            v-model="idDepartment"
            :val="congDoan"
            :label="congDoan.label"
            style="border-radius: 5px; font-size: 13px"
            class="text-weight-bold"
            color="amber-6"
          />
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

      <div align="left">
        <i class="text-blue text-bold"
          >Định mức ngày công lao động nhà máy -
          {{ idDepartment ? idDepartment.label : "" }}:
          <span class="text-amber-14">{{ DM_NCLD1 }} đ/ng/ngày công </span></i
        >
      </div>
      <DxDataGrid
        id="gridContainer"
        :data-source="dataSource"
        :show-row-lines="true"
        :show-column-lines="true"
        :show-borders="true"
        :word-wrap-enabled="true"
        @cell-prepared="onCellPrepared"
      >
        <DxSorting mode="none" />
        <DxScrolling mode="virtual" />
        <DxExport :enabled="isExcel" file-name="Báo cáo " />
        <DxColumn
          data-field="xuongName"
          caption=""
          :group-index="0"
          group-cell-template="groupCellTemplate2"
        />
        <template #groupCellTemplate2="{ data }">
          <div style="font-weight: bold">{{ data.value.toUpperCase() }}</div>
        </template>
        <!-- <DxColumn
            data-field="ORDER"
            caption="STT"
            :allowEditing="false"
            :width="60"
            css-class="rowBGNSLD"
          /> git -->
        <DxColumn
          data-field="NAME"
          caption="Bộ phận"
          :allowEditing="false"
          alignment="left"
          :width="230"
          css-class="rowBGNSLD"
        />
        <DxColumn
          data-field="TONG_CONG"
          :width="120"
          caption="Công thực tế"
          alignment="right"
          css-class="rowBGNSLD"
          format="#,##0.###"
          header-cell-template="title-header1"
        />
        <template #title-header1="{ data }">
          <p>
            {{ data.column.caption }}
            <i style="font-weight: 400">(ngày công)</i>
          </p>
        </template>
        <DxColumn
          data-field="TONG_DIEM"
          :width="120"
          caption="Điểm tính công "
          alignment="right"
          css-class="rowBGNSLD"
          format="#,##0.###"
        />

        <DxColumn
          data-field="tyle"
          :width="120"
          caption="Tỷ lệ điểm/công"
          alignment="center"
          format="#,##0%"
          css-class="rowBGNSLD"
        />
        <DxColumn
          data-field="tinhluong"
          :width="150"
          :caption="'Quỹ lương SXTT'"
          alignment="right"
          css-class="rowBGNSLD"
          format="#,###,###,###,##0"
          header-cell-template="title-header"
        />
        <DxColumn
          data-field="candoiquyluong"
          :width="160"
          caption="Cân đối quỹ lương"
          alignment="right"
          css-class="rowBGNSLD"
          format="#,###,###,###,##0"
          cell-template="candoiquyluong-cellTemplate"
          header-cell-template="title-header"
        />
        <template #title-header="{ data }">
          <p>
            {{ data.column.caption }} <i style="font-weight: 400">(đồng)</i>
          </p>
        </template>
        <template #candoiquyluong-cellTemplate="{ data }">
          <span style="font-weight: 800; color: red" v-if="data.value < 0">{{
            data.value
              ? data.value.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              : 0
          }}</span>
          <span v-else>
            {{
              data.value
                ? data.value.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : 0
            }}
          </span>
        </template>
        <DxColumn
          :width="100"
          caption="NSLĐ"
          alignment="right"
          css-class="rowBGNSLD"
        >
          <DxColumn
            data-field="NSLD"
            :width="120"
            caption="đ/người/công"
            alignment="right"
            css-class="rowBGNSLD"
            format="#,###,###,###,##0"
            header-cell-template="title-header2"
          />
          <DxColumn
            data-field="hssdld"
            :width="120"
            caption="%"
            alignment="center"
            css-class="rowBGNSLD"
            format="#,##0%"
            cell-template="hssdld-cellTemplate"
            header-cell-template="title-header2"
          />
        </DxColumn>
        <template #title-header2="{ data }">
          <span>
            <i style="font-weight: 400">{{ data.column.caption }}</i></span
          >
        </template>
        <template #hssdld-cellTemplate="{ data }">
          <span
            style="font-weight: 800"
            class="text-positive"
            v-if="data.value > 1"
            >{{
              (data.value * 100).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }) + "%"
            }}</span
          >
          <span
            style="font-weight: 800"
            class="text-amber"
            v-else-if="data.value < 1 && data.value >= 0.9"
          >
            {{
              (data.value * 100).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }) + "%"
            }}
          </span>
          <span style="font-weight: 800" class="text-red" v-else>
            {{
              (data.value * 100).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }) + "%"
            }}
          </span>
        </template>
        <DxSummary :calculate-custom-summary="calculateCustomSummary">
          <DxGroupItem
            column="TONG_CONG"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.##'"
          />
          <DxGroupItem
            column="TONG_DIEM"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.##'"
          />
          <DxGroupItem
            name="AreaSummaryTyLe"
            show-in-column="tyle"
            :show-in-group-footer="false"
            :align-by-column="true"
            summary-type="custom"
            :value-format="'#,##0%'"
            display-format="{0}"
          />
          <DxGroupItem
            column="tinhluong"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0'"
          />
          <DxGroupItem
            name="AreaSummaryCDQL"
            show-in-column="candoiquyluong"
            :show-in-group-footer="false"
            :align-by-column="true"
            summary-type="custom"
            :value-format="'#,##0'"
            display-format="{0}"
          />
          <DxGroupItem
            name="AreaSummaryNSLD"
            show-in-column="NSLD"
            :show-in-group-footer="false"
            :align-by-column="true"
            summary-type="custom"
            :value-format="'#,##0'"
            display-format="{0}"
          />
          <DxGroupItem
            name="AreaSummaryHDSDLD"
            show-in-column="hssdld"
            :show-in-group-footer="false"
            :align-by-column="true"
            summary-type="custom"
            :value-format="'#,##0%'"
            display-format="{0}"
          />
        </DxSummary>
      </DxDataGrid>
    </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxScrolling,
  DxSorting,
  DxEditing,
  DxButton,
  DxColumn,
  DxLoadPanel,
  DxExport,
  DxLookup,
  DxGroupPanel,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupItem,
  DxSummary,
} from "devextreme-vue/data-grid";
import { formatNumber, showNotifySuccess, showNotifyError } from "../ultils";
import { mapActions, mapGetters } from "vuex";

import moment from "moment";
export default {
  data() {
    return {
      dataSource: [],
      showVolumnColumn: true,
      year: moment().year(),
      month: moment().week() - 1,
      thang: moment().month() + 1,
      tuan: moment().week(),
      typeBC: "tuan",
      listWeek: [],
      chonCongDoans: [],
      dulieu: [],
      totalCTT: 0,
      totalDTC1: 0,
      totalDTC2: 0,
      totalDTC3: 0,
      totalDTC4: 0,
      totalTyLe: 0,
      totalQL: 0,
      totalQL2: 0,
      totalQL3: 0,
      totalNSLD: 0,
      totalNSLD2: 0,

      isExcel: false,
      confirmphieu: false,
      chonFactoryId: null,
      idDepartment: null,
      options: [
        {
          id: 100000,
          label: "Nhà máy CBG Thuận Hưng",
        },
        {
          id: 102340,
          label: "Nhà máy CBG Yên Sơn 1",
        },
        {
          id: 102366,
          label: "Nhà máy CBG Thái Bình",
        },
        // {
        //   label: "Nhà máy CBG Quang Minh",
        //   id: 102427,
        // },
      ],
    };
  },
  components: {
    DxDataGrid,
    DxScrolling,
    DxSorting,
    DxColumn,
    DxExport,
    DxLookup,
    DxEditing,
    DxButton,
    DxLoadPanel,
    DxGroupPanel,
    DxColumnChooser,
    DxHeaderFilter,
    DxGroupItem,
    DxSummary,
  },
  created() {
    this.idDepartment = this.options[0];
    this.loadData();
  },
  methods: {
    ...mapActions("prod", [
      "getbaocaoNSLD",
      "getbaocaoNSLDMonth",
      "getTongCongByDepartment",
      "insertTongCong",
      "updateTongCong",
    ]),
    calculateCustomSummary(options) {
      console.log("options", options);
      if (options.name === "AreaSummaryTyLe") {
        if (options.summaryProcess === "start") {
          this.totalCTT = 0;
          this.totalDTC1 = 0;
        }
        if (options.summaryProcess === "calculate") {
          this.totalCTT += options.value.TONG_CONG;
          this.totalDTC1 += options.value.TONG_DIEM;
          if (this.totalCTT == 0) {
            options.totalValue = 0;
          } else options.totalValue = this.totalDTC1 / this.totalCTT;
        }
      }
      if (options.name === "AreaSummaryNSLD") {
        if (options.summaryProcess === "start") {
          this.totalQL = 0;
          this.totalDTC2 = 0;
        }
        if (options.summaryProcess === "calculate") {
          this.totalQL += options.value.tinhluong;
          this.totalDTC2 += options.value.TONG_DIEM;
          if (this.totalDTC2 == 0) {
            options.totalValue = 0;
          } else options.totalValue = this.totalQL / this.totalDTC2;
        }
      }
      if (options.name === "AreaSummaryCDQL") {
        if (options.summaryProcess === "start") {
          this.totalQL2 = 0;
          this.totalDTC3 = 0;
        }
        if (options.summaryProcess === "calculate") {
          this.totalQL2 += options.value.tinhluong;
          this.totalDTC3 += options.value.TONG_DIEM;
          if (this.totalDTC3 == 0) {
            options.totalValue = 0;
          } else
            options.totalValue =
              (this.totalQL2 / this.totalDTC3 - this.dataSource[0].DM_NCLD) *
              this.totalDTC3;
        }
      }
      if (options.name === "AreaSummaryHDSDLD") {
        if (options.summaryProcess === "start") {
          this.totalQL3 = 0;
          this.totalDTC4 = 0;
        }
        if (options.summaryProcess === "calculate") {
          this.totalQL3 += options.value.tinhluong;
          this.totalDTC4 += options.value.TONG_DIEM;
          if (this.totalDTC4 == 0) {
            options.totalValue = 0;
          } else
            options.totalValue =
              this.totalQL3 / (this.totalDTC4 * this.DM_NCLD);
        }
      }
    },
    onCellPrepared(e) {
      if (e.rowType === "group") {
        if (e.row.groupIndex == 0) {
          e.cellElement.style.backgroundColor = "#bbdefb";
        }
        if (e.row.groupIndex == 1) {
          e.cellElement.style.backgroundColor = "#bbdefb";
        }
        if (parseFloat(e.cellElement.innerText) < 0) {
          e.cellElement.querySelector(".dx-datagrid-summary-item").style.color =
            "red";
          e.cellElement.querySelector(
            ".dx-datagrid-summary-item"
          ).style.fontWeight = 900;
          e.cellElement.querySelector(
            ".dx-datagrid-summary-item"
          ).style.fontSize = "15px";
        }
      }
    },
    changeDate() {
      this.loadData();
    },
    changeFactory() {
      this.loadData();
    },

    async loadData() {
      this.dataSource = []
      this.DM_NCLD = 0;
      this.DM_NCLD1 = 0;
      if (this.typeBC == "tuan") {
        this.dataSource = await this.getbaocaoNSLD({
          factoryId: this.idDepartment.id,
          nam: this.year,
          from: this.month,
          to: parseInt(this.tuan) + 1,
        });
      } else {
        this.dataSource = await this.getbaocaoNSLDMonth({
          factoryId: this.idDepartment.id,
          year: this.year,
          month: this.thang,
        });
      }

      for (let i = 0; i < this.dataSource.length; i++)
        if (this.dataSource[i].DM_NCLD > 0)
          this.DM_NCLD = this.dataSource[i].DM_NCLD;
      this.DM_NCLD1 = formatNumber(this.DM_NCLD);
    },
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
};
</script>
<style>
.dx-datagrid-headers .rowBGNSLD {
  text-align: center !important;
  vertical-align: top;
}
.dx-datagrid-headers.dx-header-multi-row .dx-row.dx-header-row .rowBGNSLD {
  vertical-align: top;
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
  font-weight: 900;
}
.dx-datagrid .dx-row > td {
  font-size: 16px;
}
</style>
