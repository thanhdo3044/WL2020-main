<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
         Báo cáo phôi theo mẻ sấy -
          <span class="text-amber-14">{{factory ? factory.label : ''}}</span>
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

         <!-- <div class="row">
          <div class="col-2">
            
            <q-select
              outlined
              v-model="factory"
              :options="options"
              label="Chọn nhà máy"
              @input="onChange"
            />
          </div>
        </div> -->
        <div class="row">
          <div class="col-12">
            <DxDataGrid
              :data-source="dataSource"
              :columns="columns"
              :show-borders="true"
              @cell-prepared="onCellPrepared"
              @content-ready="onContentReady"
              :no-data-text="'Không có dữ liệu !'"
            >
              <DxGroupPanel
            :visible="isExcel"
            :empty-panel-text="
              'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'
            "
          />
             <DxGrouping :auto-expand-all="false" />
             <DxHeaderFilter :visible="true" />
             
             <DxColumn
                data-field="tong"
                caption="Tổng"
                 :group-index="0"
            
            />
             <DxColumn
                data-field="Lò"
                caption="Lò"
                 :group-index="1"
            
            >
            </DxColumn>
             <DxColumn
                data-field="CODE"
                  caption="pallet"
                       />
               <DxColumn
                data-field="Mã mẻ"
                       />
             <DxColumn
                data-field="Quy cách"
              />
                <DxColumn
                data-field="Chi tiết/cụm"
              />
              <DxColumn
                data-field="Tổng khối lượng"
                caption= "Tổng khối lượng(m³)"
                  format="###0.####"
              />
               <DxColumn
                dataField= "Số lượng"
          caption= "Số lượng(t)"
         dataType= "number"
           format= "fixedpoint"
              />
                             <DxColumn
                dataField= "Trạng thái"
          caption= "Trạng thái"
           format= "fixedpoint"
              />

             <DxSummary>
             <DxGroupItem
             :show-in-group-footer="false"
                :align-by-column="true"
              column="Tổng khối lượng"
              summary-type="sum"
              value-format="###0.####"
             display-format="{0}"
            />
              </DxSummary>
              <DxExport
                :enabled="isExcel"
                :allow-export-selected-data="false"
                :file-name="'Báo cáo phôi theo mẻ sấy từ ngày '+tuNgay+' đến ngày '+denNgay"
              />
              <DxSearchPanel :visible="isExcel" :placeholder="'Tìm kiếm'" :width="400" />
            </DxDataGrid>
          </div>
        </div>
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
   DxSummary,
   DxGroupItem,
   DxHeaderFilter,
    DxTotalItem,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxExport,
} from "devextreme-vue/data-grid";
import { DxDateBox } from "devextreme-vue";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import { mapGetters } from "vuex";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
     DxSummary,
     DxGroupItem,
      DxTotalItem,
       DxHeaderFilter,
    DxSearchPanel,
    DxDateBox,
    DxExport,
    DialogSelectDate,
  },
  data() {
    return {
      dataSource: [],
      showChooseDate: false,
      isExcel: false,
      open: 1,
        factory:null,
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
      // columns: [
      //   {
      //     dataField: "Mã mẻ",
          
      //   },
      //   ,
      //     {
      //     dataField: "Lò",
      //     groupindex:0,
      //   },
        
        
      //   "Quy cách",
      //   {
      //     dataField: "Chi tiết/cụm",
      //   },
      //   {
      //     dataField: "Tổng khối lượng",
      //     caption: "Tổng khối lượng(m³)",
      //   },
      //   {
      //     dataField: "Số lượng",
      //     caption: "Số lượng(t)",
      //     dataType: "number",
      //     format: "fixedpoint",
      //   },
      // ],
      fromDate: null,
      toDate: null,
    };
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
    ...mapGetters("base", ["myFactoryInfor"]),
  },
  created() {
    this.toDate = new Date();
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load();
  },
  methods: {
    onCellPrepared(e) {
      if (e.rowType === "group") {
        if (e.row.groupIndex == 0) {
          e.cellElement.style.backgroundColor = "#bbdefb";
        }
      }
    },
    onContentReady(e) {
      if (this.open == 1) {
          e.component.expandAll(0);
          this.open = 0;
      }
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.load();
    },
     async onChange(value) {
      this.load();
    },
    async load() {
      const myFactoryId = this.factory.factoryId;
      if (myFactoryId) {
        let payload = {
          fromDate: formatDateISO(this.fromDate),
          toDate: formatDateISO(this.toDate),
          factoryId: myFactoryId,
        };
        const data = await this.$store.dispatch(
          "prod/GET_REPORT_MATERIAL_OF_MESAY",
          payload
        );
        this.dataSource = data.data;
      }
    },
  },
};
</script>

<style>
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