<template>
  <q-page>
    <q-banner class="bg-primary text-orange">
      <div class="row">
        <div class="col-6 text-h6 orange">
          <span color="orange"
            >Báo cáo xuất nhập tồn chi tiết Kho thành phẩm</span
          >
        </div>
        <div
          class="col-6 top-title cursor-pointer text-orange"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày {{ tuNgay }} đến {{ denNgay }}
        </div>
      </div>
    </q-banner>
    <!-- <div class="row">
      <div class="col-3 q-pa-sm">
        <q-select
          color="grey-3"
          label-color="orange"
          filled
          label="Chọn Nhà Máy"
          dense
        />
      </div>
      <div class="col-3 q-pa-sm">
        <q-select
          color="grey-3"
          label-color="orange"
          filled
          label="Chọn sản phẩm"
          dense
        />
      </div>
    </div> -->

    <q-card class="row">
      <q-card-section class="col-12">
        <DxDataGrid
          id="gridContainer"
          :data-source="dataSource"
          :allow-column-resizing="true"
          :show-borders="true"
          :hover-state-enabled="true"
          @row-updated="confirmSaveStock"
        >
          <DxEditing
            :refresh-mode="refreshMode"
            :allow-adding="false"
            :allow-updating="auth"
            :allow-deleting="false"
            mode="row"
          />
          <DxColumnChooser :enabled="true" />
          <DxHeaderFilter :visible="true" />
          <DxLoadPanel :enabled="true" />
          <DxGroupPanel
            :visible="true"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
          <DxLoadPanel :enabled="false" />
          <DxScrolling mode="virtual" />
          <DxSorting mode="none" />

          <DxColumn
            data-field="market_code"
            caption="Mã sản phẩm"
            :allow-exporting="true"
          />
          <DxColumn
            data-field="NAME"
            caption="Tên sản phẩm"
            :allow-exporting="true"
            width="310px"
          />
          <DxColumn
            data-field="DATE"
            caption="Ngày"
            data-type="date"
            :allow-exporting="true"
          />
          <DxColumn
            data-field="QUANTITY"
            caption="Số lượng"
            data-type="number"
            :allow-exporting="true"
          />
          <DxColumn
            data-field="nghiepVu"
            caption="Nghiệp vụ"
            :allow-exporting="true"
            alignment="center"
          />

          <DxColumn caption="Đvt" data-field="unit" :allow-exporting="true" />

          <DxColumn
            caption="Nguồn phôi"
            alignment="center"
            :allow-exporting="true"
            data-field="nguonPhoi"
          />
          <DxColumn
            data-field="palletf"
            caption="Pallet full"
            data-type="number"
            :allow-exporting="true"
          />
          <DxColumn
            data-field="pallet1"
            caption="Pallet top1"
            data-type="number"
            :allow-exporting="true"
          />
          <DxColumn
            data-field="pallet2"
            caption="Pallet top2"
            data-type="number"
            :allow-exporting="true"
          />
          <DxColumn
            caption="Ghi chú"
            alignment="center"
            data-field="description"
            :allow-exporting="true"
            width="300px"
          />
          <!-- 
          <DxSummary>
            <DxGroupItem
              column="QUANTITY"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxTotalItem
              column="QUANTITY"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            /> -->
          <!-- <DxGroupItem
              column="KHSX"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxGroupItem
              column="thuchien"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            /> -->
          <!-- </DxSummary> -->
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Báo cáo chi tiết xuất nhập tồn Kho thành phẩm'"
          />
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
  DxEditing,
  DxTotalItem,
  DxExport,
  DxDataGrid,
  DxScrolling,
  DxSorting,
  DxColumn,
  DxLoadPanel,
  DxGroupPanel,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupItem,
  DxSummary,
} from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import DialogSelectDate from "components/commons/DialogSelectFromDateToDate";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../ultils";
export default {
  data() {
    return {
      auth: false,
      showChooseDate: false,
      dataSource: [],
      dataSourceDay: null,
      fromDate: moment().subtract(30, "days"),
      toDate: moment(),
      showVolumnColumn: true,
      chonCongDoans: [],
      chonFactoryId: null,
      year: null,
      week: null,
      factory1: null,
      data: null,
      item: null,
      listItems: null,

      stepId: null,
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 100004,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 100005,
          code: "TB",
        },
      ],
      fromDate: null,
      refreshMode: "full",

      toDate: null,
    };
  },
  components: {
    DxEditing,
    DxTotalItem,
    DxExport,
    DxDataGrid,
    DxScrolling,
    DxSorting,
    DxColumn,
    DxLoadPanel,
    DxGroupPanel,
    DxColumnChooser,
    DxHeaderFilter,
    DialogSelectDate,
    DxGroupItem,
    DxSummary,
  },
  methods: {
    ...mapActions("production", [
      "PRODUCT_STORAGE_DETAIL",
      "UPDATE_STOCK_PRODUCT",
    ]),
    ...mapActions("item", ["getItemVanity"]),

    async loadData() {
      let payload = {
        fromDate: formatDateISO(this.fromDate),
        toDate: formatDateISO(moment(this.toDate).add(1, "days")),
      };
      let dataSource = await this.PRODUCT_STORAGE_DETAIL(payload);
      console.log("ss", dataSource);
      dataSource.data.forEach((e) => {
        if (e.market_code.indexOf("N00411426YS") > -1) {
          e.NAME = "STACKHOLMEN stool, out 48x35x43 lbrwn stnd AP";
        }
        if (e.market_code.indexOf("61225836") > -1) {
          e.NAME = "Mặt bàn MP";
        }
        if (e.market_code.indexOf("40390672") > -1) {
          e.NAME = "SOMMAR Flower box 75x25";
        }
        e.unit = "Pcs";
        e.nghiepVu = e.QUANTITY > 0 ? "N" : "X";
        e.QUANTITY = Math.abs(e.QUANTITY);
        e.palletf = Math.abs(e.pallet_full);
        e.pallet1 = Math.abs(e.pallet_top1);
        e.pallet2 = Math.abs(e.pallet_top2);
      });
      this.dataSource = dataSource.data;
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      console.log(formatDateISO(f), formatDateISO(t));
      this.loadData();
    },
    async confirmSaveStock(e) {
      console.log(e);
      const data = await this.UPDATE_STOCK_PRODUCT(e.data);
      if (data.success == true) {
        this.$q.dialog({
          title: "Thành công ",
          message: "Sửa thành công !",
        });
      } else {
        this.$q.dialog({
          title: "Lỗi",
          message: "Có lỗi xảy ra !",
        });
      }
    },
  },

  computed: {
    ...mapGetters("base", [
      "congDoans",
      "opCongDoans",
      "myFactoryInfor",
      "userInfo",
    ]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  async created() {
    console.log(this.userInfo);
    if (this.userInfo.id == 100400) this.auth = true;
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    // let listItems = await this.getItemVanity();
    // listItems.forEach((element) => {
    //   element.label = element.NAME;
    // });
    // this.listItems = listItems;
    // this.chonFactoryId =
    //   parseInt(this.$route.query.factoryId) || this.myFactoryInfor.id;
    this.loadData();
  },
};
</script>
