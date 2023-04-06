<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div v-if="factory" class="col-6 top-title text-orange">
            Báo cáo khối lượng ra lò - {{ factory.label }}
          </div>
           <div v-else class="col-6 top-title text-orange">
            Báo cáo khối lượng ra lò -
          </div>
          <div
            class="col-6 top-title text-orange cursor-pointer"
            align="right"
            @click="showChooseDate = true"
          >
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
          </div>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <div class="row">
          <div class="col-2">
            <q-select
              outlined
              v-model="factory"
              :options="options"
              label="Chọn nhà máy"
              @input="onChange"
            />
          </div>
           <div class="col-2">
             <q-btn
              class="col-2 q-ml-sm"
              color="primary"
              v-if="type == 'chua-nhan'"
              label="Nhận pallet"
              @click="nhanpallet"
            />
          </div>
          <div class="col-3">
            <q-radio
            @input="onChangeType"
            class="text-orange"
            v-model="type"
            val="da-nhan"
            label="Đã nhận"
          />
          <q-radio
            @input="onChangeType"
            class="text-positive"
            style="margin-right: 30px"
            v-model="type"
            val="chua-nhan"
            label="Chưa nhận"
          />
          </div>
            
        </div>
          <div class="col-2" align = "right">
             <q-checkbox
              @input="loadkho"
              color="primary"
               v-model="selection"
              label="Tìm theo ngày kho nhận"
            
            />
          </div>
        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
              :data-source="dataSource"
              :columns="columns"
              :show-borders="true"
              :no-data-text="'Không có dữ liệu !'"
                 @row-updated="rowUpdated"
          @row-updating="rowUpdating"
                :selection="{ mode: 'multiple' }"
          @selection-changed="onSelectionChanged1"
            >
              <DxEditing :allow-updating="update" mode="cell" />
             <DxColumnChooser :enabled="true" />
             <DxGroupPanel
            :visible="true"
            :empty-panel-text="
              'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'
            "
          />
             <DxGrouping :auto-expand-all="true" />
              <DxHeaderFilter :visible="true" />

              <DxColumn data-field="Lò" caption="Lò" :group-index="0">
              </DxColumn>
               <DxColumn data-field="CODE" caption="Pallet"  />
              <DxColumn data-field="Quy cách" />
             
              <DxColumn data-field="length" caption="Dài" />
              <DxColumn data-field="width" caption="Rộng" />
              <DxColumn data-field="height" caption="Dày" />
              <DxColumn data-field="Chi tiết/cụm" />
              <DxColumn
                data-field="Tổng khối lượng"
                caption="Tổng khối lượng(m³)"
                format="###0.##"
              />
              <DxColumn
                dataField="Số lượng"
                caption="Số lượng(t)"
                dataType="number"
                format="fixedpoint"
              />
              <DxColumn
                dataField="exportDate"
                caption="Ngày ra lò"
                dataType="date"
                format="dd/MM/yyyy"
              />
              <DxColumn
                dataField="Trạng thái"
                caption="Trạng thái"
                format="fixedpoint"
              />
                  <DxColumn
                dataField="MODIFY_DATE"
                caption="Ngày kho nhận"
                dataType="date"
                format="dd/MM/yyyy"
              />
                <DxColumn
              
                caption="Xác nhận"
               cell-template="del-cell"
              />
                 <template #del-cell="cell">
                <span
                  v-if="cell.data.data.MODIFY_BY == null"
                  class="fake-link"
                  @click="onSelectionChanged(cell)"
                  >Nhận về</span>
                     <span
                  v-else
                  
                  >Đã nhận</span
                >
              </template>
              <DxSummary>
                <DxTotalItem
                  column="Mã mẻ"
                  summary-type="count"
                  value-format="fixedpoint"
                  display-format="Tổng cộng : "
                />
                <DxTotalItem
                  column="Tổng khối lượng"
                  summary-type="sum"
                  value-format="###0.##"
                  display-format="{0}"
                />
                <DxGroupItem
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  column="Tổng khối lượng"
                  summary-type="sum"
                  value-format="###0.##"
                  display-format="{0}"
                />
                 <DxGroupItem
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  column="Số lượng"
                  summary-type="sum"
                  value-format="###0.##"
                  display-format="{0}"
                />
              </DxSummary>
              <DxExport
                :enabled="true"
                :allow-export-selected-data="false"
                :file-name="
                  'Báo cáo phôi theo mẻ sấy từ ngày ' +
                  tuNgay +
                  ' đến ngày ' +
                  denNgay
                "
              />
              <DxSearchPanel
                :visible="true"
                :placeholder="'Tìm kiếm'"
                :width="400"
              />
            </DxDataGrid>
          </div>
        </div>
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
  DxSummary,
  DxEditing,
  DxGroupItem,
  DxHeaderFilter,
  DxTotalItem,
  DxPager,
  DxPaging,
  DxColumnChooser,
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
import { mapGetters,mapActions } from "vuex";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxEditing,
    DxPaging,
    DxSummary,
    DxColumnChooser,
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
      dataSourceFilter: [],
      showChooseDate: false,
      selection:false,
      update:false,
      type: "chua-nhan",
      factory: null,
        datanhan: [],
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
    ...mapGetters("base", ["myFactoryInfor","userInfo"]),
  },
  created() {
    this.toDate = new Date();
    this.fromDate = getFisrtDayOfMonth(new Date());
    if (this.userInfo.id == 102089)  this.update = true
    this.load();
  },
  methods: {
      ...mapActions("prod", ["getBCNhanSauSay","updateBCNhanSauSayngay", "updateBCNhanSauSay","updateBCNhanSauSaytheolo"]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      if (this.selection)
      await this.loadkho();
      else
      await this.load();
    },
      async rowUpdating(e) {
      const { newData, oldData } = e;
         let payload = {
        MODIFY_DATE: newData.MODIFY_DATE,
        packageId: oldData.CODE,
      };
      let result1 = await this.updateBCNhanSauSayngay(payload);
      },
    async onChange(value) {
      this.load();
    },
    onChangeType(){
      if(this.type == "da-nhan"){
        this.dataSource = this.dataSourceFilter.filter(d => d.MODIFY_BY != null);
      }else{
        this.dataSource = this.dataSourceFilter.filter(d => d.MODIFY_BY == null);
      }
      console.log("this.dataSource", this.dataSource);
    },
      async onSelectionChanged(e) {
      let payload = {
        accountId: this.userInfo.id,
        packageId: e.data.data.CODE,
      };
      let result = await this.updateBCNhanSauSay(payload);
      this.load();
    },
       onSelectionChanged1({ selectedRowsData }) {
      this.idSelect = selectedRowsData[0].ID;
    
      this.datanhan = selectedRowsData;
    },
    async nhanpallet(){
       const payload = {
        createBy: this.userInfo.id,
        datanhan: this.datanhan,
      };
      let data = await this.updateBCNhanSauSaytheolo(payload);
       this.load();
    },
      async loadkho() {
        if (this.selection) {
      const myFactoryId = this.factory.factoryId;
      if (myFactoryId) {
        let payload = {
          fromDate: formatDateISO(this.fromDate),
          toDate: formatDateISO(this.toDate),
          factoryId: myFactoryId,
        };
        const data = await this.$store.dispatch(
          "prod/GET_REPORT_MATERIAL_OF_MESAY3_KHO",
          payload
        );
        this.dataSource = data.data;
        
      }
        } else {
            const myFactoryId = this.factory.factoryId;
      if (myFactoryId) {
        let payload = {
          fromDate: formatDateISO(this.fromDate),
          toDate: formatDateISO(this.toDate),
          factoryId: myFactoryId,
        };
        const data = await this.$store.dispatch(
          "prod/GET_REPORT_MATERIAL_OF_MESAY3",
          payload
        );
        this.dataSource = data.data;
      }
        }
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
          "prod/GET_REPORT_MATERIAL_OF_MESAY3",
          payload
        );
        this.dataSourceFilter = data.data;
        this.onChangeType();
      }
    },
  },
};
</script>

<style>
</style>