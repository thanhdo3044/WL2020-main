<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo kế hoạch sấy phôi -
          <span class="text-amber-14">{{myFactoryInfor.name}}</span>
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
                  color="amber-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <DxDataGrid
              :data-source="dataSource"
              :columns="columns"
              :show-borders="true"
              :no-data-text="'Báo cáo mẻ sấy'"
            >
            <DxHeaderFilter :visible="true" />
              <DxExport
                :enabled="true"
                :allow-export-selected-data="false"
                :file-name="'Báo cáo sản xuất từ ngày '+tuNgay+' đến ngày '+denNgay"
              />
              <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400" />
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
    </div>
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
  DxHeaderFilter,
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
    DxHeaderFilter,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxDateBox,
    DxExport,
    DialogSelectDate,
  },
  data() {
    return {
      dataSource: [],
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
      columns: [
        {
          dataField: "Mã mẻ",
        },
        ,
        "Tên lò",
        "Chiều dày phôi",
        "Loại phôi",
        {
          dataField: "Tổng khối lượng",
        },
        "Người tạo",
        {
          dataField: "Ngày tạo",
         
        },
        {
          dataField: "Dự kiến",
          caption: "Dự kiến ra lò",
          dataType: "date",
          format: "dd/MM/yyyy",
        },
        "Thực tế",
        "Trạng thái",
      ],
      fromDate: null,
      toDate: null,
      showChooseDate: false,
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
          "prod/GET_REPORT_ME_SAY",
          payload
        );
        this.dataSource = data.data;
      }
    },
  },
};
</script>

<style>
</style>