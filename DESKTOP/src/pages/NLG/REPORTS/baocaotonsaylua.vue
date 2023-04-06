<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          BÁO CÁO TỒN SẤY LỰA
        </div>

        <div
           class="col-6 cursor-pointer text-blue text-bold"
          style="font-size: 18px"
          align="right"
          @click="showChooseDate = true"
        >
          Chọn ngày <span class="text-amber-14">{{ tuNgay }}</span>
        </div>
      </div>
    </div>

    <q-card class="my-card">
      <q-card-section>
        <DxDataGrid
          id="gridContainer"
          :word-wrap-enabled="true"
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
          <!-- <DxColumn
                caption="Tên nhóm"
                data-field="nhom"
               
                :fixed="true"
                :group-index="0"
              /> -->
          <DxColumn caption="Tổng" data-field="tongNgang" :group-index="0" />
          <DxColumn caption="Tên" data-field="NAME" width="250" :fixed="true" />

          <DxColumn caption="Qui Cách" alignment="center" :fixed="true">
            <DxColumn
              caption="Dầy"
              data-field="DAY"
              format="fixedPoint"
              alignment="center"
              width="80"
              :fixed="true"
            />
            <DxColumn
              caption="Rộng"
              data-field="RONG"
              format="fixedPoint"
              alignment="center"
              width="80"
              :fixed="true"
            />
            <DxColumn
              caption="Dài"
              data-field="DAI"
              format="fixedPoint"
              alignment="center"
              width="80"
              :fixed="true"
            />
          </DxColumn>
          <DxColumn caption="Nhà máy TH" alignment="center">
            <DxColumn
              data-field="TH"
              caption="Số lượng Tồn ngoài bãi TH"
              alignment="left"
              format="#,##0.####"
              width="80"
            />
            <DxColumn caption="Số lượng xếp sấy TH" alignment="center">
              <DxColumn
                data-field="chosay"
                caption="Chờ sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
              />

              <DxColumn
                data-field="tronglo"
                caption="Trong Lò"
                alignment="left"
                allow-reordering="true"
                format="#,##0.####"
                width="100"
              />
            </DxColumn>
          </DxColumn>
          <DxColumn caption="Nhà máy YS" alignment="center">
            <DxColumn
              data-field="YS"
              caption="Số lượng Tồn ngoài bãi YS"
              alignment="left"
              format="#,##0.####"
              width="80"
            />
            <DxColumn caption="Số lượng xếp sấy YS" alignment="center">
              <DxColumn
                data-field="chosayYS"
                caption="Chờ sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
              />

              <DxColumn
                data-field="trongloYS"
                caption="Trong Lò"
                alignment="left"
                allow-reordering="true"
                format="#,##0.####"
                width="100"
              />
            </DxColumn>
          </DxColumn>
          <DxColumn caption="Nhà máy TB" alignment="center">
            <DxColumn
              data-field="TB"
              caption="Số lượng Tồn ngoài bãi TB"
              alignment="left"
              format="#,##0.####"
              width="100"
            />
            <DxColumn caption="Số lượng xếp sấy TB" alignment="center">
              <DxColumn
                data-field="chosayTB"
                caption="Chờ sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
              />

              <DxColumn
                data-field="trongloTB"
                caption="Trong Lò"
                alignment="left"
                allow-reordering="true"
                format="#,##0.####"
                width="100"
              />
            </DxColumn>
          </DxColumn>
          <DxColumn caption="Nhà máy TH" alignment="center">
            <DxColumn
              data-field="CLTH"
              caption="Kho sau sấy"
              alignment="left"
              format="#,##0.####"
              width="80"
            />
            <DxColumn
              data-field="LTH"
              caption="Kho lựa đạt"
              alignment="center"
              format="#,##0.####"
              width="80"
            />
          </DxColumn>
          <DxColumn caption="Nhà máy YS1" alignment="center">
            <DxColumn
              data-field="CLYS"
              caption="Kho sau sấy"
              alignment="left"
              format="#,##0.####"
              width="80"
            />
            <DxColumn
              data-field="LYS"
              caption="Kho lựa đạt"
              alignment="center"
              format="#,##0.####"
              width="80"
            />
          </DxColumn>
          <DxColumn caption="Nhà máy TB" alignment="center">
            <DxColumn
              data-field="CLTB"
              caption="Kho sau sấy"
              alignment="left"
              format="#,##0.####"
              width="80"
            />
            <DxColumn
              data-field="LTB"
              caption="Kho lựa đạt"
              alignment="center"
              format="#,##0.####"
              width="80"
            />
          </DxColumn>
          <DxColumn
            :width="100"
            data-field="tong"
            caption="Tổng"
            format="#,##0.####"
            :calculate-cell-value="calculateTong"
          />
          <!-- 
             
           
             <DxColumn
                data-field="TONGKL"
                caption="Tổng KL"
                alignment="center"
                allow-reordering="true"
                format="#,##0.####"
                width="100"
                 :calculate-cell-value="calculateKL_THL"
            />
              
             </DxColumn> -->
          <!-- <DxColumn
                data-field="TONGPHOITH"
                caption="Tổng Phôi TH"
                alignment="left"
                allow-reordering="true"
                format="#,##0.####"
                width="100"
                 :calculate-cell-value="calculateKL_THTP"
            /> -->
          <!-- <DxColumn
                caption="Khối lượng Xếp sấy YS1"
                alignment="center"
            >
              <DxColumn
                data-field="tonkhoYS1"
                caption="KL Tồn"
                alignment="left"
                format="#,##0.####"
                width="100"
            />
            
            <DxColumn
                data-field="chosayYS1"
                caption="Chờ Sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
             
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
               <DxColumn
                caption="Khối lượng Xếp sấy TB"
                alignment="center"
            >
              <DxColumn
                data-field="tonkhoYS4"
                caption="KL Tồn"
                alignment="left"
                format="#,##0.####"
                width="100"
            />
            
            <DxColumn
                data-field="chosayYS4"
                caption="Chờ Sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
            
               <DxColumn
                data-field="trongloYS4"
                caption="Trong Lò"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
             <DxColumn
                data-field="tongYS4"
                caption="Tổng cộng"
                alignment="left"
                format="#,##0.####"
                width="100"
                 :calculate-cell-value="calculateKL_YS4"
            />
              
             </DxColumn>
                <DxColumn
                caption="Khối lượng tồn xưởng lựa TB"
                alignment="center"
            >
             <DxColumn
                data-field="chualuaYS4"
                caption="Chưa lựa"
                alignment="left"
                format="#,##0.####"
                width="100"
            />
            <DxColumn
                data-field="daluaYS4"
                caption="Đã lựa"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
             <DxColumn
                data-field="TONGKLYS4"
                caption="Tổng KL"
                alignment="center"
                allow-reordering="true"
                format="#,##0.####"
                width="100"
            />
              
             </DxColumn>
               <DxColumn
                data-field="TONGPHOIYS4"
                caption="Tổng Phôi TB"
                alignment="left"
                allow-reordering="true"
                format="#,##0.####"
                width="100"
                :calculate-cell-value="calculateKL_YS4TP"
            /> -->
          <DxSummary>
            <DxGroupItem
              column="TH"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.##"
            />
            <DxGroupItem
              column="chosay"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.##"
            />
            <DxGroupItem
              column="tronglo"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="YS"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.##"
            />
            <DxGroupItem
              column="chosayYS"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.##"
            />
            <DxGroupItem
              column="trongloYS"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.##"
            />
            <DxGroupItem
              column="TB"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.##"
            />
            <DxGroupItem
              column="chosayTB"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.##"
            />
            <DxGroupItem
              column="trongloTB"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.##"
            />
            <DxGroupItem
              column="CLTH"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.##"
            />
            <DxGroupItem
              column="LTH"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.##"
            />
            <DxGroupItem
              column="CLYS"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.##"
            />
            <DxGroupItem
              column="LYS"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.##"
            />
            <DxGroupItem
              column="CLTB"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.##"
            />
            <DxGroupItem
              column="LTB"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.##"
            />
            <DxGroupItem
              column="tong"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              value-format="#,##0.##"
            />

          </DxSummary>
        </DxDataGrid>
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
import { formatDateISO, formatDateVN } from "../../../ultils";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDate";
import moment from "moment";
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
    DialogSelectDate
  },
  data() {
    return {
      factory: null,
      makho: null,
      ngaynhap: null,
      showChooseDate: false,
      DEPARTMENT_ID: null,
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1A",
          factoryId: 100003,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 100005,
        },
      ],
      fromDate: moment().format("YYYY-MM-DD"),
      toDate: moment().format("YYYY-MM-DD"),
      dataSource: [],
    };
  },
  created() {
    //this.loadkho()
    this.fromDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate());
    this.load();
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
  },
  methods: {
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.showChooseDate = false;
      this.load();
    },
    calculateTong(rowData) {
      rowData.tong =
        rowData.TH +
        rowData.chosay +
        rowData.tronglo +
        rowData.YS +
        rowData.chosayYS +
        rowData.trongloYS +
        rowData.TB +
        rowData.chosayTB +
        rowData.trongloTB +
        rowData.CLTH +
        rowData.LTH +
        rowData.CLYS +
        rowData.LYS +
        rowData.CLTB +
        rowData.LTB;
      return rowData.tong;
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

    async onChange(value) {
      this.load();
    },
    chonToDate(e) {
      console.log("date", this.toDate);
      this.load();
    },
    //      calculateKL_TH(rowData) {
    //   return rowData.chosay - rowData.tronglo ;
    // },
    //   calculateKL_THL(rowData) {
    //   return rowData.chualuaT + rowData.daluaT ;
    // },
    //    calculateKL_THTP(rowData) {
    //   return rowData.chualuaT + rowData.daluaT + rowData.TH + rowData.chosay ;
    // },
    //  calculateKL_YS1(rowData) {
    //   return rowData.chosayYS1 + rowData.trongloYS1 ;
    // },
    //   calculateKL_YS4(rowData) {
    //   return rowData.chosayYS4 + rowData.trongloYS4 ;
    // },
    //   calculateKL_YS1TP(rowData) {
    //   return rowData.chualuaYS1 + rowData.daluaYS1 + rowData.YS1 + rowData.chosayYS1 + rowData.trongloYS1;
    // },
    //   calculateKL_YS4TP(rowData) {
    //   return rowData.chualuaYS4 + rowData.daluaYS4 + rowData.TB + rowData.chosayYS4 + rowData.trongloYS4;
    // },
    async load() {
      // if (this.factory.factoryId == 100000) {
      //   this.makho = 'TH'
      //   this.ngaynhap = '20210401'
      //   this.DEPARTMENT_ID = 102485

      // }
      //  if (this.factory.factoryId == 100003) {
      //   this.makho = 'YS1'
      //   this.ngaynhap = '20210701'
      //    this.DEPARTMENT_ID = 102337
      // }
      const payload = {
        makho: this.makho,
        ngaynhap: this.ngaynhap,
        factoryId: 100000,
        DEPARTMENT_ID: this.DEPARTMENT_ID,
        from: formatDateISO(this.fromDate),
        to: formatDateISO(this.fromDate),
      };
      const data = await this.$store.dispatch(
        "nlg/GET_REPORT_TON_LUA",
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