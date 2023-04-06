<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-12 top-title">BÁO CÁO TỒN SẤY LỰA</div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <!-- <div class="col-6 q-pa-md">
                      <SelectKho :onChange="chonKho" :showClear="true" :dsKho="dskho" />
                  </div> -->
          <div class="col-3 q-pa-md">
            <DateBox
              :onChange="chonFromDate"
              :value="fromDate"
              :title="'Từ ngày'"
            />
          </div>
          <div class="col-3 q-pa-md">
            <DateBox
              :onChange="chonToDate"
              :value="toDate"
              :title="'Đến ngày'"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <DxDataGrid
          id="gridContainer"
          :data-source="dataSource"
          :allow-column-reordering="true"
          :show-borders="true"
          :no-data-text="'Không có dữ liệu !'"
          :show-column-lines="true"
          :show-row-lines="true"
          :allow-column-resizing="true"
        >
          <DxHeaderFilter :visible="true" />
          <DxScrolling mode="infinite" />
          <DxSorting mode="none" />
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Báo cáo tồn xấy lựa'"
          />
          <DxSearchPanel
            :visible="true"
            :placeholder="'Tìm kiếm'"
            :width="400"
          />
          <DxColumn
            caption="Tên nhóm"
            data-field="nhom"
            :fixed="true"
            :group-index="0"
          />
          <DxColumn caption="Tên" data-field="NAME" width="150" :fixed="true" />
          <!-- <DxColumn
                caption="Mã Qui Cách"
                data-field="CODE"
                width="100"
               
              /> -->

          <DxColumn caption="Quy Cách" alignment="center" :fixed="true">
            <DxColumn
              caption="Dầy"
              data-field="DAY"
              format="fixedPoint"
              alignment="center"
              width="50"
              :fixed="true"
            />
            <DxColumn
              caption="Rộng"
              data-field="RONG"
              format="fixedPoint"
              alignment="center"
              width="50"
              :fixed="true"
            />
            <DxColumn
              caption="Dài"
              data-field="CAO"
              format="fixedPoint"
              alignment="center"
              width="50"
              :fixed="true"
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
          <DxColumn caption="Khối lượng xếp sấy TH" alignment="center">
            <DxColumn
              data-field="TH"
              caption="KL Tồn"
              alignment="left"
              format="#,##0.####"
              width="100"
            />
            <!-- <DxColumn
                data-field="xepsay"
                caption=" xếp sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
            /> -->
            <DxColumn
              data-field="chosay"
              caption="chờ sấy"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
            <!-- <DxColumn
                data-field="DAVAOLO"
                caption="đã vào lò"
                alignment="center"
                allow-reordering="true"
                format="#,##0.####"
                width="100"
            /> -->
            <DxColumn
              data-field="tronglo"
              caption="Trong Lò"
              alignment="left"
              allow-reordering="true"
              format="#,##0.####"
              width="100"
            />
            <DxColumn
              data-field="tongTH"
              caption="Tổng cộng"
              alignment="left"
              format="#,##0.####"
              width="100"
              :calculate-cell-value="calculateKL_TH"
            />
          </DxColumn>
          <!-- </DxColumn> -->
          <DxColumn caption="Khối lượng tồn xưởng lựa TH" alignment="center">
            <DxColumn
              data-field="chualua"
              caption="Chưa lựa"
              alignment="left"
              format="#,##0.####"
              width="100"
            />
            <DxColumn
              data-field="dalua"
              caption="Đã lựa"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
            <DxColumn
              data-field="TONGKL"
              caption="Tổng KL"
              alignment="center"
              allow-reordering="true"
              format="#,##0.####"
              width="100"
              :calculate-cell-value="calculateKL_THL"
            />
          </DxColumn>
          <DxColumn
            data-field="TONGPHOITH"
            caption="Tổng Phôi TH"
            alignment="left"
            allow-reordering="true"
            format="#,##0.####"
            width="100"
            :calculate-cell-value="calculateKL_THTP"
          />
          <DxColumn caption="Khối lượng Xếp sấy YS1" alignment="center">
            <DxColumn
              data-field="tonkhoYS1"
              caption="KL Tồn"
              alignment="left"
              format="#,##0.####"
              width="100"
            />
            <!-- <DxColumn
                data-field="xepsayYS1"
                caption="xếp sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
            /> -->
            <DxColumn
              data-field="chosayYS1"
              caption="Chờ Sấy"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
            <!-- <DxColumn
                data-field="DAVAOLOYS1"
                caption="đã vào lò"
                alignment="center"
                format="#,##0.####"
                width="100"
            /> -->
            <DxColumn
              data-field="trongloYS1"
              caption="Trong Lò"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
            <DxColumn
              data-field="tongYS1"
              caption="Tổng cộng"
              alignment="left"
              format="#,##0.####"
              width="100"
              :calculate-cell-value="calculateKL_YS1"
            />
            <!-- <DxColumn
                data-field="raloYS1"
                caption="đã ra lò"
                alignment="center"
                format="#,##0.####"
                width="100"
            /> -->
          </DxColumn>
          <DxColumn caption="Khối lượng tồn xưởng lựa YS1" alignment="center">
            <DxColumn
              data-field="chualuaYS1"
              caption="Chưa lựa"
              alignment="left"
              format="#,##0.####"
              width="100"
            />
            <DxColumn
              data-field="daluaYS1"
              caption="Đã lựa"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
            <DxColumn
              data-field="TONGKLYS1"
              caption="Tổng KL"
              alignment="center"
              allow-reordering="true"
              format="#,##0.####"
              width="100"
            />
          </DxColumn>
          <DxColumn
            data-field="TONGPHOIYS1"
            caption="Tổng Phôi YS1"
            alignment="left"
            allow-reordering="true"
            format="#,##0.####"
            width="100"
            :calculate-cell-value="calculateKL_YS1TP"
          />
          <DxColumn caption="Khối lượng Xếp sấy TB" alignment="center">
            <DxColumn
              data-field="tonkhoTB"
              caption="KL Tồn"
              alignment="left"
              format="#,##0.####"
              width="100"
            />
           
            <DxColumn
              data-field="chosayTB"
              caption="Chờ Sấy"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
         
            <DxColumn
              data-field="trongloTB"
              caption="Trong Lò"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
            <DxColumn
              data-field="tongTB"
              caption="Tổng cộng"
              alignment="left"
              format="#,##0.####"
              width="100"
              :calculate-cell-value="calculateKL_YS4"
            />
          
          </DxColumn>
          <DxColumn caption="Khối lượng tồn xưởng lựa TB" alignment="center">
            <DxColumn
              data-field="chualuaTB"
              caption="Chưa lựa"
              alignment="left"
              format="#,##0.####"
              width="100"
            />
            <DxColumn
              data-field="daluaTB"
              caption="Đã lựa"
              alignment="center"
              format="#,##0.####"
              width="100"
            />
            <DxColumn
              data-field="TONGKLTB"
              caption="Tổng KL"
              alignment="center"
              allow-reordering="true"
              format="#,##0.####"
              width="100"
            />
          </DxColumn>
          <DxColumn
            data-field="TONGPHOITB"
            caption="Tổng Phôi TB"
            alignment="left"
            allow-reordering="true"
            format="#,##0.####"
            width="100"
            :calculate-cell-value="calculateKL_TBTP"
          />
          <DxSummary>
            <DxGroupItem
              column="TH"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxTotalItem
              column="TH"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxTotalItem
              column="chosay"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="chosay"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="tronglo"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="tronglo"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxTotalItem
              column="tongTH"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="tongTH"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxGroupItem
              column="YS1"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxTotalItem
              column="YS1"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="chosayYS1"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxTotalItem
              column="chosayYS1"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="trongloYS1"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="trongloYS1"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="TB"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxTotalItem
              column="TB"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxTotalItem
              column="trongloYS4"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxTotalItem
              column="chosayYS4"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="chosayYS4"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="###0.####"
            />
            <DxGroupItem
              column="trongloS4"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="###0.####"
              display-format="{0}"
            />
            <!-- <DxTotalItem
                column="KL"
                summary-type="sum"
                value-format="###0.####"
              
              /> -->
          </DxSummary>
        </DxDataGrid>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {
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
  DxHeaderFilter,
  DxSummary,
  DxGroupItem,
  DxTotalItem,
} from "devextreme-vue/data-grid";
import SelectKho from "../../../components/NLG/SelectBoxKho";
import DateBox from "../../../components/commons/DateBox";
import { formatDateISO } from "../../../ultils";
export default {
  components: {
    SelectKho,
    DateBox,
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
    DxHeaderFilter,
    DxSummary,
    DxGroupItem,
    DxTotalItem,
  },
  data() {
    return {
      //  dskho:[],
      // kho:null,
      // dupplicateNcc:[],
      fromDate: new Date(),
      toDate: new Date(),
      dataSource: [],
    };
  },
  created() {
    //this.loadkho()
    this.load();
  },
  methods: {
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
    chonFromDate(e) {
      this.fromDate = e.value;
      this.load();
    },
    chonToDate(e) {
      this.toDate = e.value;
      this.load();
    },
    
    calculateKL_TH(rowData) {
      return rowData.chosay + rowData.tronglo;
    },
    calculateKL_THL(rowData) {
      return rowData.chualua + rowData.dalua;
    },
    calculateKL_THTP(rowData) {
      return (
        rowData.chualua +
        rowData.dalua +
        rowData.TH +
        rowData.chosay +
        rowData.tronglo
      );
    },
    calculateKL_YS1(rowData) {
      return rowData.chosayYS1 + rowData.trongloYS1;
    },
    calculateKL_TB(rowData) {
      return rowData.chosayTB + rowData.trongloTB;
    },
    calculateKL_YS1TP(rowData) {
      return (
        rowData.chualuaYS1 +
        rowData.daluaYS1 +
        rowData.YS1 +
        rowData.chosayYS1 +
        rowData.trongloYS1
      );
    },
    calculateKL_TBTP(rowData) {
      return (
        rowData.chualuaYS4 +
        rowData.daluaYS4 +
        rowData.TB +
        rowData.chosayYS4 +
        rowData.trongloYS4
      );
    },
    async load() {
      const payload = {
        from: formatDateISO(this.fromDate),
        to: formatDateISO(this.toDate),
      };
      const data = await this.$store.dispatch(
        "nlg/GET_REPORT_THONG_KE_KHO_NHAN1",
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
</style>