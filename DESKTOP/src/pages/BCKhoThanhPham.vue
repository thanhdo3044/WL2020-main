<template>
  <q-page>
    <q-banner class="bg-primary text-orange">
      <div class="row">
        <div class="col-6 text-h6 orange">
          <span color="orange">Báo cáo xuất nhập tồn Kho thành phẩm</span>
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
          :show-borders="true"
          :allow-column-resizing="true"
          :hover-state-enabled="true"
        >
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
            data-field="market_code1"
            caption="Mã sản phẩm"
            :allow-exporting="true"
          />
          <DxColumn
            data-field="NAME"
            caption="Tên sản phẩm"
            :allow-exporting="true"
            width="350px"
          />

          <DxColumn
            caption="Đvt"
            data-type="number"
            data-field="unit"
            :allow-exporting="true"
          />
          <DxColumn
            data-field="Total"
            caption="Tồn đầu kỳ"
            data-type="number"
            :allow-exporting="true"
          />
          <DxColumn
            data-field="nhap"
            caption="Nhập trong kỳ"
            data-type="number"
            alignment="center"
            :allow-exporting="true"
          >
            <DxColumn
              data-field="nhapTH"
              caption="Thuận Hưng"
              data-type="number"
              :allow-exporting="true"
            />
            <DxColumn
              data-field="nhapYS"
              caption="Yên Sơn"
              data-type="number"
              :allow-exporting="true"
            />
            <DxColumn
              data-field="nhapTB"
              caption="Thái Bình"
              data-type="number"
              :allow-exporting="true"
            />
            <DxColumn
              data-field="nhapKhac"
              caption="Khác"
              data-type="number"
              :allow-exporting="true"
            />
          </DxColumn>
          <DxColumn
            caption="Xuất trong kỳ"
            alignment="center"
            :allow-exporting="true"
            data-type="number"
          >
            <DxColumn
              caption="IKEA"
              alignment="center"
              data-field="cont"
              :allow-exporting="true"
              data-type="number"
            />
            <DxColumn
              caption="YS ghép container"
              alignment="center"
              :allow-exporting="true"
              data-type="number"
              data-field="YS"
            />
            <DxColumn
              caption="YS lưu kho"
              alignment="center"
              :allow-exporting="true"
              data-type="number"
              data-field="Kho"
            />
            <DxColumn
              caption="Khác"
              alignment="center"
              :allow-exporting="true"
              data-type="number"
              data-field="xuatKhac"
            />
          </DxColumn>
          <DxColumn
            data-field="TotalSUM"
            caption="Tồn cuối"
            data-type="number"
            :allow-exporting="true"
          />
          <!-- <DxColumn
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
          /> -->

          <DxSummary>
            <DxTotalItem
              column="market_code1"
              value-format="fixedpoint"
              display-format="Tổng cộng : "
            />
            <DxTotalItem
              column="Total"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxTotalItem
              column="nhapTH"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxTotalItem
              column="nhapYS"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxTotalItem
              column="nhapTB"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxTotalItem
              column="nhapKhac"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxTotalItem
              column="cont"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxTotalItem
              column="YS"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxTotalItem
              column="xuatKhac"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxTotalItem
              column="TotalSUM"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxTotalItem
              column="palletf"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxTotalItem
              column="pallet1"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxTotalItem
              column="Kho"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxTotalItem
              column="pallet2"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxGroupItem
              column="cont"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
          </DxSummary>
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Báo cáo xuất nhập tồn Vanity'"
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
      toDate: null,
    };
  },
  components: {
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
    ...mapActions("production", ["PRODUCT_STORAGE"]),
    ...mapActions("item", ["getItemVanity"]),

    async loadData() {
      let payload = {
        fromDate: formatDateISO(this.fromDate),
        toDate: formatDateISO(moment(this.toDate).add(1, "days")),
      };
      let dataSource = await this.PRODUCT_STORAGE(payload);
      console.log("ss", dataSource);
      dataSource.data.forEach((e) => {
        console.log(e.market_code);
        if (e.market_code1.indexOf("N00411426YS") > -1) {
          console.log(2);

          e.NAME = "STACKHOLMEN stool, out 48x35x43 lbrwn stnd AP";
        }
        if (e.market_code1.indexOf("40390672") > -1) {
          console.log(2);

          e.NAME = "SOMMAR Flower box 75x25";
        }
        if (e.market_code1.indexOf("61225836") > -1) {
          console.log(2);

          e.NAME = "Mặt bàn MP";
        }
        if (Array.isArray(e.market_code)) {
          e.market_code = e.market_code[0]
            ? e.market_code[0]
            : e.market_code[1];
        }
        e.unit = "Pcs";
        e.palletf = e.palletf[0] + e.palletf[1];
        e.pallet1 = e.pallet1[0] + e.pallet1[1];
        e.pallet2 = e.pallet2[0] + e.pallet2[1];
        e.cont = Math.abs(e.cont);
        e.YS = Math.abs(e.YS);
        e.Kho = Math.abs(e.Kho);
        e.xuatKhac = Math.abs(e.xuatKhac);
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
  },

  computed: {
    ...mapGetters("base", ["congDoans", "opCongDoans", "myFactoryInfor"]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  async created() {
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
