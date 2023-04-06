<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
         Báo cáo xếp sấy khối CBG
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

    <q-card class="my-card">
      <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
          <div class="col-8">
          </div>
          <div class="col-4" align="right">
            <q-checkbox
              v-model="isExcel"
              color="amber-6"
              class="text-weight-bold"
              label="Excel"
              dense
            />
          </div>
        </div>
      <!-- <q-card-section>
             <div class="row">
                 <div class="col-12 top-title">
                      Báo cáo xếp chờ sấy khối CBG
                 </div>
             </div>
          </q-card-section>
          <q-card-section>
              <div class="row">
                  <div class="col-3 q-pa-md">
                      <DateBox :onChange="chonFromDate" :value="fromDate" :title="'Từ ngày'"/>
                  </div>
                  <div class="col-3 q-pa-md">
                      <DateBox :onChange="chonToDate" :value="toDate" :title="'Đến ngày'"/>
                  </div>
              </div>
          </q-card-section>
          <q-separator spaced    /> -->
      <div>
        <DxDataGrid
          id="gridContainer"
          :data-source="dataSource"
          :allow-column-reordering="true"
          :show-borders="true"
          :no-data-text="'Không có dữ liệu !'"
          :word-wrap-enabled="true"
          :show-column-lines="true"
          :show-row-lines="true"
          :allow-column-resizing="true"
          @cell-prepared="onCellPrepared"
        >
          <DxColumnChooser :enabled="isExcel" />
          <DxHeaderFilter :visible="true" />
          <DxExport
            :enabled="isExcel"
            :allow-export-selected-data="false"
            :file-name="'Thống kê xếp sấy'"
          />
          <DxScrolling mode="infinite" />
          <DxSorting mode="none" />
          <DxGroupPanel
            :visible="isExcel"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
          <DxGrouping :auto-expand-all="true" />
          <DxSearchPanel
            :visible="isExcel"
            :placeholder="'Tìm kiếm'"
            :width="400"
          />
          <DxSummary>
            <DxGroupItem
              column="xepsay"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="ralo"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="DAVAOLO"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="xepsayYS1"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="raloYS1"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="DAVAOLOYS1"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="xepsaytb"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="DAVAOLOTB"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="ralotb"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />

            <!-- <DxTotalItem
                column="KL"
                summary-type="sum"
                value-format="###0.####"
              
              /> -->
          </DxSummary>
          <!-- <DxColumn
                caption="Tên nhóm"
                data-field="nhom"
               
                :fixed="true"
                :group-index="0"
              /> -->

          <DxColumn caption="Tổng" data-field="tong" group-index="0" :fixed="true" />
          <DxColumn caption="Tên" data-field="NAME" width="600" :fixed="true" />
          <!-- <DxColumn
                caption="Mã Qui Cách"
                data-field="CODE"
                width="100"
               
              /> -->

          <DxColumn caption="Qui Cách" alignment="center">
            <DxColumn
              caption="Dầy"
              data-field="DAY"
              format="fixedPoint"
              alignment="center"
              width="50"
            />
            <DxColumn
              caption="Rộng"
              data-field="RONG"
              format="fixedPoint"
              alignment="center"
              width="50"
            />
            <DxColumn
              caption="Dài"
              data-field="DAI"
              format="fixedPoint"
              alignment="center"
              width="50"
            />
          </DxColumn>
          <!-- <DxColumn
                caption="Khối lượng nhập kho"
                alignment="center"
            >
             <DxColumn
                data-field="TH"
                caption="TH"
                alignment="center"
                format="#,##0.####"
                width="80"
            />
            <DxColumn
                data-field="YS1"
                caption="YS1"
                alignment="center"
                format="#,##0.####"
                width="80"
            />
             <DxColumn
                data-field="TB"
                caption="TB"
                alignment="center"
                format="#,##0.####"
                width="80"
            />
             </DxColumn> -->
          <DxColumn caption="Lò Sấy TH (M3)" alignment="center">
            <!-- <DxColumn
                data-field="tonkho"
                caption="KL Tồn Kho"
                alignment="center"
                format="#,##0.####"
                width="100"
            /> -->
            <DxColumn
              data-field="XepsayTH"
              caption=" Xếp Sấy"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
            <!-- <DxColumn
                data-field="chosay"
                caption="chờ sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
            /> -->
            <DxColumn
              data-field="trongloTH"
              caption="Vào Lò"
              alignment="center"
              allow-reordering="true"
              format="#,##0.####"
              width="100"
            />
            <!-- <DxColumn
                data-field="tronglo"
                caption="đang trong lò"
                alignment="center"
                format="#,##0.####"
                width="100"
            /> -->
            <DxColumn
              data-field="raloTH"
              caption="Đã Ra Lò"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
          </DxColumn>
          <!-- <DxColumn
                data-field="TONG"
                caption="Tổng Cộng"
                alignment="left"
                allow-reordering="true"
                format="#,##0.####"
                width="100"
                :calculate-cell-value="calculateKL_TH"
            /> -->
          <!-- </DxColumn> -->
          <!-- <DxColumn
                caption="Khối lượng tồn xưởng lựa TH"
                alignment="center"
            > -->
          <!-- <DxColumn
                data-field="chualua"
                caption="Chưa lựa"
                alignment="center"
                format="#,##0.####"
                width="100"
            /> -->
          <!-- <DxColumn
                data-field="dalua"
                caption="Đã lựa"
                alignment="center"
                format="#,##0.####"
                width="100"
            /> -->
          <!-- <DxColumn
                data-field="TONGKL"
                caption="Tổng KL"
                alignment="center"
                allow-reordering="true"
                format="#,##0.####"
                width="100"
            /> -->

          <!-- </DxColumn> -->
          <DxColumn caption="Lò Sấy YS1 (M3)" alignment="center">
            <DxColumn
              data-field="XepsayYS"
              caption="Xếp Sấy"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
            <!-- <DxColumn
                data-field="chosayYS1"
                caption="chờ sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
            /> -->
            <DxColumn
              data-field="trongloYS"
              caption="Vào Lò"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
            <!-- <DxColumn
                data-field="trongloYS1"
                caption="đang trong lò"
                alignment="center"
                format="#,##0.####"
                width="100"
            /> -->
            <DxColumn
              data-field="raloYS"
              caption="Đã Ra Lò"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
          </DxColumn>
          <!-- <DxColumn
                data-field="TONGYS1"
                caption="Tổng Cộng"
                alignment="left"
                allow-reordering="true"
                format="#,##0.####"
                width="100"
                :calculate-cell-value="calculateKL_YS1"
            /> -->
          <DxColumn caption="Lò Sấy TB (M3)" alignment="center">
            <DxColumn
              data-field="XepsayTB"
              caption="Xếp Sấy"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
            <!-- <DxColumn
                data-field="chosayTB"
                caption="chờ sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
            /> -->
            <DxColumn
              data-field="trongloTB"
              caption="Vào Lò"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
            <!-- <DxColumn
                data-field="trongloTB"
                caption="đang trong lò"
                alignment="center"
                format="#,##0.####"
                width="100"
            /> -->
            <DxColumn
              data-field="raloTB"
              caption="Đã Ra Lò"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
          </DxColumn>
          <!-- <DxColumn
                data-field="TONGTB"
                caption="Tổng Cộng"
                alignment="left"
                allow-reordering="true"
                format="#,##0.####"
                width="100"
                :calculate-cell-value="calculateKL_TB"
            /> -->
          <DxSummary>
            <DxGroupItem
              column="XepsayTH"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.####"
            />
            <DxGroupItem
              column="XepsayYS"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.####"
            />
            <DxGroupItem
              column="XepsayTB"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.####"
            />
            <DxGroupItem
              column="trongloTH"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.####"
            />
            <DxGroupItem
              column="trongloYS"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.####"
            />
            <DxGroupItem
              column="trongloTB"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.####"
            />
            <DxGroupItem
              column="raloTH"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.####"
            />
            <DxGroupItem
              column="raloYS"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.####"
            />
            <DxGroupItem
              column="raloTB"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.####"
            />
          </DxSummary>
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
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxSorting,
  DxScrolling,
  DxPager,
  DxPaging,
  DxColumnChooser,
  DxSearchPanel,
  DxFilterRow,
  DxExport,
  DxHeaderFilter,
  DxSummary,
  DxGroupItem,
  DxTotalItem,
} from "devextreme-vue/data-grid";
import SelectKho from "../../../components/NLG/SelectBoxKho";
import DateBox from "../../../components/commons/DateBox";
import { formatDateISO, formatDateVN } from "../../../ultils";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
export default {
  components: {
    SelectKho,
    DateBox,
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxSorting,
    DxScrolling,
    DxPager,
    DxColumnChooser,
    DxPaging,
    DxSearchPanel,
    DxFilterRow,
    DxExport,
    DxHeaderFilter,
    DxSummary,
    DxGroupItem,
    DxTotalItem,
    DialogSelectDate,
  },
  data() {
    return {
      //  dskho:[],
      // kho:null,
      // dupplicateNcc:[],
      fromDate: new Date(),
      toDate: new Date(),
      dataSource: [],
      showChooseDate: false,
      isExcel: false,
    };
  },
  created() {
    this.toDate = new Date();
    this.fromDate = new Date();
    this.toDate.setDate(this.toDate.getDate());
    this.fromDate.setDate(this.fromDate.getDate());
    this.load();
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
    onCellPrepared(e) {
      if (e.rowType === "group") {
        if (e.row.groupIndex == 0) {
          e.cellElement.style.backgroundColor = "#bbdefb";
        }
      }
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.load();
    },
    //  async loadkho(){
    //    const duppp = []
    //    const data = await this.$store.dispatch('nlg/GET_DS_KHO')
    //     data.data.forEach(e=>{
    //         duppp.push({
    //             text: e.name = e.tenkho,
    //            value: e.makho
    //         })
    //     })
    //    this.dupplicateNcc = duppp

    //       this.dskho= data.data

    // },
    // chonKho(e){
    //     this.kho = e.value
    //     this.load()
    // },
    calculateKL_TH(rowData) {
      return rowData.xepsay + rowData.DAVAOLO + rowData.ralo;
    },
    calculateKL_YS1(rowData) {
      return rowData.xepsayYS1 + rowData.DAVAOLOYS1 + rowData.raloYS1;
    },
    calculateKL_TB(rowData) {
      return rowData.xepsaytb + rowData.DAVAOLOTB + rowData.ralotb;
    },
    chonFromDate(e) {
      this.fromDate = e.value;
      this.load();
    },
    chonToDate(e) {
      this.toDate = e.value;
      this.load();
    },
    async load() {
      const payload = {
        from: formatDateISO(this.fromDate),
        to: formatDateISO(this.toDate),
      };
      const data = await this.$store.dispatch(
        "nlg/GET_REPORT_XEP_SAY_TRONG_LO",
        payload
      );
      this.dataSource = data.data;
    },
  },
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
</style>