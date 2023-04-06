<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo Nhập Xuất Tồn từng công đoạn sản xuất -
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
      <div style="padding: 5px">
        <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
          <div class="col-12">
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
                  v-bind:class="{ isActive: true }"
                  color="amber-6"
                />
              </div>
            </div>
            <hr />
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in xuongs"
                :key="index"
              >
                <q-radio
                  dense
                  @input="chonXuong"
                  v-model="xuong"
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
        </div>
        <DxDataGrid
          id="gridContainer"
          :data-source="tonPhois"
          :hover-state-enabled="true"
          :row-alternation-enabled="true"
          :selection="{ mode: 'single' }"
        >
          <DxColumnChooser :enabled="true" />
          <DxHeaderFilter :visible="true" />
          <DxGroupPanel
            :visible="true"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
          <DxScrolling mode="infinite" />
          <DxSorting mode="none" />
          <DxGrouping :auto-expand-all="true" />
          <!-- <DxEditing :allow-updating="true" mode="cell" /> -->
          <DxColumn
            data-field="tong"
            caption="Tổng"
            :allowEditing="false"
            :group-index="0"
          />
          <DxColumn
            data-field="STEP_ID"
            caption="Công đoạn"
            :allowEditing="false"
            :group-index="1"
          >
            <DxLookup
              :data-source="congdoans"
              display-expr="NAME"
              value-expr="ID"
            />
          </DxColumn>

          <DxColumn
            data-field="name"
            caption="SP/Chi tiết"
            width="250"
            :allowEditing="false"
          />
          <DxColumn caption="Quy Cách" alignment="center" :allowEditing="false">
            <DxColumn
              caption="Dầy"
              data-field="height"
              alignment="center"
              width="90"
              :allowEditing="false"
            />
            <DxColumn
              caption="Rộng"
              data-field="width"
              alignment="center"
              width="90"
              :allowEditing="false"
            />
            <DxColumn
              caption="Dài"
              data-field="length"
              alignment="center"
              width="90"
              :allowEditing="false"
            />
          </DxColumn>

          <DxColumn caption="Tồn đầu kỳ" alignment="center">
            <DxColumn
              data-field="TON_DAU_KY"
              caption="Số lượng"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              format="#,##0"
            />
            <DxColumn
              data-field="TON_DAU_KY_M3"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              format="#,##0.###0"
            />
          </DxColumn>
          <DxColumn caption="Nhập" alignment="center">
            <DxColumn
              data-field="NHAP"
              caption="Số lượng"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              format="#,##0"
            />
            <DxColumn
              data-field="NHAP_M3"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              format="#,##0.###0"
            />
          </DxColumn>
          <DxColumn caption="Lỗi" alignment="center">
            <DxColumn
              data-field="LOI"
              caption="Số lượng"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              format="#,##0"
            />
            <DxColumn
              data-field="LOI_M3"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              format="#,##0.###0"
            />
          </DxColumn>
          <DxColumn caption="Xuất" alignment="center">
            <DxColumn
              data-field="XUAT"
              caption="Số lượng"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              format="#,##0"
            />
            <DxColumn
              data-field="XUAT_M3"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              format="#,##0.###0"
            />
          </DxColumn>
          <!-- <DxColumn caption="Nhập KL tại tổ" alignment="center">
            <DxColumn
              data-field="nhapquantity"
              caption="Số lượng"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              format="#,##0"
            />
            <DxColumn
              data-field="nhapquantityM3"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              format="#,##0.###0"
            />
          </DxColumn> -->
          <DxColumn caption="Tồn cuối kỳ" alignment="center">
            <DxColumn
              v-if="
                xuong.id == 102498 || xuong.id == 102817 || xuong.id == 102745
              "
              data-field="tonCuoiKy"
              caption="Số lượng"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              format="#,##0"
              :calculate-cell-value="calculateTonCuoiKy"
            />
            <DxColumn
              data-field="tonCuoiKyM3"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              format="#,##0.###0"
              :calculate-cell-value="calculateTonCuoiKyM3"
            />
          </DxColumn>
          <DxSummary>
            
            <DxGroupItem
              :show-in-group-footer="false"
              :align-by-column="true"
              column="NHAP"
              summary-type="sum"
              value-format="#,##0.####"
              display-format="{0}"
            />
            <DxGroupItem
              :show-in-group-footer="false"
              :align-by-column="true"
              column="NHAP_M3"
              summary-type="sum"
              value-format="#,##0.####"
              display-format="{0}"
            />
            <DxGroupItem
              :show-in-group-footer="false"
              :align-by-column="true"
              column="XUAT_M3"
              summary-type="sum"
              value-format="#,##0.####"
              display-format="{0}"
            />
            <DxGroupItem
              :show-in-group-footer="false"
              :align-by-column="true"
              column="tonCuoiKy"
              summary-type="sum"
              value-format="#,##0.####"
              display-format="{0}"
            />
            <DxGroupItem
              :show-in-group-footer="false"
              :align-by-column="true"
              column="tonCuoiKyM3"
              summary-type="sum"
              value-format="#,##0.####"
              display-format="{0}"
            />
            <DxGroupItem
              :show-in-group-footer="false"
              :align-by-column="true"
              column="TON_DAU_KY_M3"
              summary-type="sum"
              value-format="#,##0.####"
              display-format="{0}"
            />
            <DxGroupItem
              :show-in-group-footer="false"
              :align-by-column="true"
              column="TON_DAU_KY"
              summary-type="sum"
              value-format="#,##0.####"
              display-format="{0}"
            />
            <DxGroupItem
              :show-in-group-footer="false"
              :align-by-column="true"
              column="XUAT"
              summary-type="sum"
              value-format="#,##0.####"
              display-format="{0}"
            />
          </DxSummary>
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'In Tồn Phôi'"
          />
          <DxSearchPanel
            :visible="true"
            :placeholder="'Tìm kiếm'"
            :width="400"
          />
        </DxDataGrid>
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
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import { formatDateVN } from "../../../ultils";
import DialogSelectDate from "components/commons/DialogSelectFromDateToDate";
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxExport,
  DxColumnChooser,
  DxHeaderFilter,
  DxSummary,
  DxTotalItem,
  DxGroupPanel,
  DxScrolling,
  DxSorting,
  DxGrouping,
  DxLookup,
  DxGroupItem,
} from "devextreme-vue/data-grid";
export default {
  // name: 'PageName',
  components: {
    DxDataGrid,
    DxColumn,
    DxSearchPanel,
    DxExport,
    DxColumnChooser,
    DxHeaderFilter,
    DxSummary,
    DxTotalItem,
    DxGroupPanel,
    DxScrolling,
    DxSorting,
    DxGrouping,
    DialogSelectDate,
    DxLookup,
    DxGroupItem,
  },
  data() {
    return {
      showChooseDate: false,
      fromDate: moment().startOf("month"),
      toDate: moment(),
      showVolumnColumn: false,
      factory: null,
      congdoans: [],
      xuong: {
        id: 102498,
      },
      xuongs: [],
      stepId: null, // string,
      options: [],
      tonPhois: [],
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
  methods: {
    ...mapActions("vcn", [
      "getFactory",
      "getDepartmentVCN",
      "getTonsByStepIdVCN",
      "getTonsLVLByStepIdVCN",
      "getXuongByFactoryId",
    ]),
    calculateTonCuoiKy(rowData) {
      rowData.tonCuoiKy = rowData.TON_DAU_KY + rowData.NHAP - rowData.XUAT;
      return rowData.tonCuoiKy;
    },
    calculateTonCuoiKyM3(rowData) {
      rowData.tonCuoiKyM3 =
        rowData.TON_DAU_KY_M3 + rowData.NHAP_M3 - rowData.XUAT_M3;
      return rowData.tonCuoiKyM3;
    },
    async loadFactory() {
      let factories1 = await this.getFactory();
      factories1.map((factory) => {
        factory.label = factory.name;
        factory.factoryId = factory.id;
      });
      this.options = factories1;
    },
    async loadData() {
      this.tonPhois = [];
      let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
        factoryId: this.xuong.id,
      };
      let data = [];
      if (
        this.xuong.id == 102498 ||
        this.xuong.id == 102817 ||
        this.xuong.id == 102745
      ) {
        data = await this.getTonsByStepIdVCN(payload);
      } else {
        data = await this.getTonsLVLByStepIdVCN(payload);
      }

      this.tonPhois = data;
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },

    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadData();
    },
    async onChange() {
      const payload = {
        factoryId: this.factory.id,
      };
      const data = await this.getXuongByFactoryId(payload);
      data.map((e) => (e.label = e.name));
      this.xuongs = data;
      this.factoryName = this.factory.label;
    },
    async chonXuong() {
      this.congdoans = [];
      const payload = {
        factoryId: this.xuong.id,
      };
      let departments = await this.getDepartmentVCN(payload);
      console.log("department: ", departments);
      this.congdoans = departments;
      this.loadData();
    },
  },
  async created() {
    await this.loadFactory();
  },
  mounted() {},
};
</script>
<style>
#gridContainer {
  height: 700px;
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
</style>
