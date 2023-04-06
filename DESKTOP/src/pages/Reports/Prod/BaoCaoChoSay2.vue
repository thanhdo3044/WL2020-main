<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo xếp chờ sấy -
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
        <div class="row">
          <div class="col-12">
            <DxDataGrid id="baoCaoChoSay" :show-borders="true" :column-auto-width="true" :data-source="dataSource">
              <DxColumnChooser :enabled="isExcel" />
              <DxHeaderFilter :visible="true" />
              <DxGroupPanel
                :visible="isExcel"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              />
              <DxGrouping :auto-expand-all="true" />

              <DxExport
                :enabled="isExcel"
                :allow-export-selected-data="false"
                :file-name="
                  'Dữ liệu sản xuất chi tiết từ ngày ' +
                  tuNgay +
                  ' đến ngày ' +
                  denNgay
                "
              />
              <DxScrolling mode="virtual" />
              <DxSearchPanel
                :visible="isExcel"
                :placeholder="'Tìm kiếm'"
                :width="400"
              />
              <DxColumn data-field="WEEK"   :visible="false" sort-order="desc" caption="Tuần" />
               <DxColumn data-field="CREATE_DATE"  caption="Ngay xếp"  :width="180"/>
              <DxColumn data-field="CODE" caption="Mã pallet" />
              <DxColumn data-field="ITEM_ID" caption="Mã quy cách" />
              <DxColumn data-field="NAME" caption="Tên quy cách" />
              <DxColumn data-field="LENGTH" caption="Dài" />
              <DxColumn data-field="WIDTH" caption="Rộng" />
              <DxColumn data-field="HEIGHT" caption="Dầy" />
              <DxColumn data-field="QUANTITY" caption="Số lượng" />
              <DxColumn
                data-field="KL"
                caption="Khối lượng"
                format="0.####"
              />
                 <DxColumn data-field="TYPE_NAME" caption="Mục đích sấy" />
               <DxColumn data-field="trangThai" caption="Trạng thái" />
          
              <DxSummary>
                <DxTotalItem
                  column="CODE"
                  :display-format="'Tổng cộng:'"
                />
                  <DxGroupItem
                  column="KL"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  valueFormat="##0.####"
                />
                <DxTotalItem
                  column="KL"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="false"
                  :display-format="'{0}'"
                  valueFormat="##0.####"
                />
              </DxSummary>
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
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxExport,
  DxSummary,
  DxGroupItem,
  DxHeaderFilter,
  DxScrolling,
  DxColumnChooser,
  DxMasterDetail,
  DxTotalItem,
} from "devextreme-vue/data-grid";
import { mapGetters } from "vuex";
import moment from "moment";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxScrolling,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxExport,
    DialogSelectDate,
    DxSummary,
    DxGroupItem,
    DxHeaderFilter,
    DxColumnChooser,
    DxMasterDetail,
    DxTotalItem,
  },
  data() {
    return {
      showChooseDate: false,
      dataSource: [],
      dataPallet:[],
      factory: null,
      isExcel: false,
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
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
  },
  methods: {
    xemB(e) {
      console.log(e);
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
    async onChange(value) {
      this.load();
    },
    async load() {
      const myFactoryId = this.factory.factoryId;
      if (myFactoryId) {
        let payload = {
          fromDate: moment(this.fromDate).format().slice(0, 10),
          toDate: moment(this.toDate).add(1, "days").format().slice(0, 10),
          factoryId: myFactoryId,
        };
        const data = await this.$store.dispatch(
          "prod/GET_REPORT_CHO_SAY",
          payload
        );
        this.dataSource = data.data;
        console.log("datasource",this.dataSource);
      }
    },
  },
};
</script>

<style>
#baoCaoChoSay{
  height: 700px;
}
</style>
