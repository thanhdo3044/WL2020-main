<template>
  <q-page>
    <q-banner class="bg-blue-grey text-orange">
      <div class="row">
        <div class="col-6 text-h6 orange">
          <div style="padding-top: 10px" color="orange">
            Báo cáo tồn công đoạn - Nhà máy CBG Thuận Hưng
            {{ factory1 ? factory1.label : "" }}
          </div>
        </div>
        <div
          class="col-6 text-h6 cursor-pointer text-orange"
          style="padding-top: 10px"
          align="right"
          @click="showChooseDate = true"
        >
          Chọn thời gian xem số tồn: {{ denNgay }}
        </div>
      </div>
    </q-banner>
    <q-card>
      <!-- <div class="text-orange row widget-container">
        <div class="col-3 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="factory1"
            :options="options"
            label="Chọn Nhà Máy"
            @input="onChange"
            dense
          />
        </div>
        <div class="col-3 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="stepId"
            :options="data"
            label="Chọn công đoạn"
            @input="loadData"
            dense
          />
        </div> -->

      <!-- </div> -->
      <q-card-section>
        <DxDataGrid
          id="gridContainer"
          :word-wrap-enabled="true"
          :data-source="dataSource"
          key-expr="NAME"
          :show-row-lines="true"
          :show-column-lines="true"
          :hover-state-enabled="true"
          :row-alternation-enabled="true"
          :selection="{ mode: 'single' }"
          :allow-column-resizing="true"
        >
          <DxSorting mode="none" />
          <DxColumnChooser :enabled="true" />
          <DxHeaderFilter :visible="true" />
          <DxGroupPanel
            :visible="true"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
          <DxScrolling mode="infinite" />
          <DxGrouping :auto-expand-all="true" />
          <!-- <DxEditing :allow-updating="true" mode="cell" /> -->
          <DxColumn
            data-field="sp"
            caption="Sản phẩm"
            :group-index="0"
            :width="250"
            :fixed="true"
            :allowEditing="false"
          />
          <DxColumn
            data-field="NAME"
            caption="SP/Chi tiết"
            :width="250"
            :fixed="true"
            :allowEditing="false"
            cssClass="ColumnsAutomatic1"
          />
          <DxColumn
            caption="Khối lượng"
            data-field="VOLUMN"
            alignment="center"
            :allowEditing="false"
            :width="120"
            :fixed="true"
            cssClass="ColumnsAutomatic1"
          />
          <DxColumn
            caption="Hệ số"
            data-field="heso"
            alignment="center"
            :allowEditing="false"
            :width="80"
            :fixed="true"
            cssClass="ColumnsAutomatic1"
          />
          <DxColumn
            caption="Qui Cách"
            alignment="center"
            :allowEditing="false"
            :fixed="true"
            cssClass="ColumnsAutomatic1"
          >
            <DxColumn
              caption="Dầy"
              data-field="DAY"
              alignment="center"
              :allowEditing="false"
              :width="60"
              cssClass="ColumnsAutomatic1"
            />
            <DxColumn
              caption="Rộng"
              data-field="RONG"
              alignment="center"
              :width="60"
              :allowEditing="false"
              cssClass="ColumnsAutomatic1"
            />
            <DxColumn
              caption="Dài"
              data-field="DAI"
              alignment="center"
              :width="60"
              :allowEditing="false"
              cssClass="ColumnsAutomatic1"
            />
          </DxColumn>
          <DxColumn
            caption="TỒN CÔNG ĐOẠN"
            alignment="center"
            cssClass="ColumnsAutomatic1"
          >
            <DxColumn
              caption="4.Tinh chế 1 - X1 (TH)"
              alignment="center"
              cssClass="ColumnsAutomatic1"
            >
              <DxColumn
                data-field="TTC1X1"
                caption="T"
                data-type="number"
                alignment="center"
                :allowEditing="false"
                :width="100"
                format="###,##0.####"
                cssClass="ColumnsAutomatic1"
              />
              <DxColumn
                data-field="TTC1X1M3"
                caption="M3"
                data-type="number"
                alignment="center"
                :allowEditing="false"
                :width="80"
                format="###0.####"
                cssClass="ColumnsAutomatic1"
              />
            </DxColumn>
            <DxColumn
              caption="4.Tinh chế 2 - X1 (TH)"
              alignment="center"
              cssClass="ColumnsAutomatic1"
            >
              <DxColumn
                data-field="TTC2X1"
                caption="T"
                data-type="number"
                alignment="center"
                :allowEditing="false"
                :width="80"
                format="#,##0.###0"
                cssClass="ColumnsAutomatic1"
              />
              <DxColumn
                data-field="TTC2X1M3"
                caption="M3"
                data-type="number"
                alignment="center"
                :allowEditing="false"
                :width="80"
                format="#,##0.###0"
                cssClass="ColumnsAutomatic1"
              />
            </DxColumn>
            <DxColumn
              caption="4.Tinh chế 1 - X3 (TH)"
              alignment="center"
              cssClass="ColumnsAutomatic1"
            >
              <DxColumn
                data-field="TTC1X3"
                caption="T"
                data-type="number"
                alignment="center"
                :allowEditing="false"
                :width="80"
                format="###,##0"
                cssClass="ColumnsAutomatic1"
              />
              <DxColumn
                data-field="TTC1X3M3"
                caption="M3"
                data-type="number"
                alignment="center"
                :allowEditing="false"
                :width="80"
                format="#,##0.###0"
                cssClass="ColumnsAutomatic1"
              />
            </DxColumn>
            <DxColumn
              caption="4.Tinh chế 2 - X3 (TH)"
              alignment="center"
              cssClass="ColumnsAutomatic1"
            >
              <DxColumn
                data-field="TTC2X3"
                caption="T"
                data-type="number"
                alignment="center"
                :allowEditing="false"
                :width="80"
                format="###,##0"
                cssClass="ColumnsAutomatic1"
              />
              <DxColumn
                data-field="TTC2X3M3"
                caption="M3"
                data-type="number"
                alignment="center"
                :allowEditing="false"
                :width="80"
                format="#,##0.###0"
                cssClass="ColumnsAutomatic1"
              />
            </DxColumn>
            <DxColumn
              caption="5.HTM1 - X1 (TH)"
              alignment="center"
              cssClass="ColumnsAutomatic1"
            >
              <DxColumn
                data-field="THTM1X1"
                caption="T"
                data-type="number"
                alignment="center"
                :allowEditing="false"
                :width="80"
                format="###,##0"
                cssClass="ColumnsAutomatic1"
              />
              <DxColumn
                data-field="THTM1X1M3"
                caption="M3"
                data-type="number"
                alignment="center"
                :allowEditing="false"
                :width="80"
                format="#,##0.###0"
                cssClass="ColumnsAutomatic1"
              />
            </DxColumn>
            <DxColumn
              caption="5.HTM2- X1 (TH)"
              alignment="center"
              cssClass="ColumnsAutomatic1"
            >
              <DxColumn
                data-field="THTM2X1"
                caption="T"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :width="80"
                :visible="true"
                format="###,##0"
                cssClass="ColumnsAutomatic1"
              />
              <DxColumn
                data-field="THTM2X1M3"
                caption="M3"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :width="80"
                :visible="true"
                format="#,##0.###0"
                cssClass="ColumnsAutomatic1"
              />
            </DxColumn>
            <DxColumn
              caption="5.HTM - X3 (TH)"
              alignment="center"
              cssClass="ColumnsAutomatic1"
            >
              <DxColumn
                data-field="THTMX3"
                caption="T"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :width="80"
                :visible="true"
                format="###,##0"
                cssClass="ColumnsAutomatic1"
              />
              <DxColumn
                data-field="THTMX3M3"
                caption="M3"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :width="80"
                :visible="true"
                format="#,##0.###0"
                cssClass="ColumnsAutomatic1"
              />
            </DxColumn>
            <DxColumn
              caption="6.HTD - X3 (TH)"
              alignment="center"
              cssClass="ColumnsAutomatic1"
            >
              <DxColumn
                data-field="THTMDX3"
                caption="T"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :width="80"
                :visible="true"
                format="###,##0"
                cssClass="ColumnsAutomatic1"
              />
              <DxColumn
                data-field="THTMDX3M3"
                caption="M3"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :visible="true"
                :width="80"
                format="#,##0.###0"
                cssClass="ColumnsAutomatic1"
              />
            </DxColumn>
            <DxColumn
              caption="7.Sơn 1 - X2 (TH)"
              alignment="center"
              cssClass="ColumnsAutomatic1"
            >
              <DxColumn
                data-field="TSON1X2"
                caption="T"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :visible="true"
                :width="80"
                format="#,##0.###0"
                cssClass="ColumnsAutomatic1"
              />
              <DxColumn
                data-field="TSON1X2M3"
                caption="M3"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :visible="true"
                :width="80"
                format="#,##0.###0"
                cssClass="ColumnsAutomatic1"
              />
            </DxColumn>
            <DxColumn
              caption="7.Sơn 2 - X2 (TH)"
              alignment="center"
              cssClass="ColumnsAutomatic1"
            >
              <DxColumn
                data-field="TSON2X2"
                caption="T"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :visible="true"
                :width="80"
                format="###,##0"
                cssClass="ColumnsAutomatic1"
              />
              <DxColumn
                data-field="TSON2X2M3"
                caption="M3"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :visible="true"
                :width="80"
                format="#,##0.###0"
                cssClass="ColumnsAutomatic1"
              />
            </DxColumn>
            <DxColumn
              caption="7.Sơn - X3 (TH)"
              alignment="center"
              cssClass="ColumnsAutomatic1"
            >
              <DxColumn
                data-field="TSONX3"
                caption="T"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :visible="true"
                :width="80"
                format="###,##0"
                cssClass="ColumnsAutomatic1"
              />
              <DxColumn
                data-field="TSONX3M3"
                caption="M3"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :visible="true"
                :width="80"
                format="#,##0.###0"
                cssClass="ColumnsAutomatic1"
              />
            </DxColumn>
            <DxColumn
              caption="8.Đóng gói 1 - X2 (TH)"
              alignment="center"
              cssClass="ColumnsAutomatic1"
            >
              <DxColumn
                data-field="TDG1X2"
                caption="T"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :visible="true"
                :width="80"
                format="###,##0"
                cssClass="ColumnsAutomatic1"
              />
              <DxColumn
                data-field="TDG1X2M3"
                caption="M3"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :visible="true"
                :width="80"
                format="#,##0.###0"
                cssClass="ColumnsAutomatic1"
              />
            </DxColumn>
            <DxColumn
              caption="8.Đóng gói 2 - X2 (TH)"
              alignment="center"
              cssClass="ColumnsAutomatic1"
            >
              <DxColumn
                data-field="TDG2X2"
                caption="T"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :visible="true"
                :width="80"
                format="###,##0"
                cssClass="ColumnsAutomatic1"
              />
              <DxColumn
                data-field="TDG2X2M3"
                caption="M3"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :visible="true"
                :width="80"
                format="#,##0.###0"
                cssClass="ColumnsAutomatic1"
              />
            </DxColumn>
            <DxColumn
              caption="8.Đóng gói - X3 (TH)"
              alignment="center"
              cssClass="ColumnsAutomatic1"
            >
              <DxColumn
                data-field="TDGX3"
                caption="T"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :visible="true"
                :width="80"
                format="###,##0"
                cssClass="ColumnsAutomatic1"
              />
              <DxColumn
                data-field="TDGX3M3"
                caption="M3"
                data-type="number"
                alignment="center"
                :allowEditing="true"
                :visible="true"
                :width="80"
                format="#,##0.###0"
                cssClass="ColumnsAutomatic1"
              />
            </DxColumn>
          </DxColumn>
          <DxColumn
            caption="Đồng bộ từ Tinh chế - Đóng gói"
            alignment="center"
            cssClass="ColumnsAutomatic1"
          >
            <DxColumn
              data-field="TonCuoiT"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="80"
              format="###,##0"
              cssClass="ColumnsAutomatic1"
              :calculate-cell-value="calculateTongThanh"
            />
            <DxColumn
              data-field="TonCuoi"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="80"
              format="#,##0.###0"
              cssClass="ColumnsAutomatic1"
            />
            <DxColumn
              data-field="dongbo"
              caption="% đồng bộ từng chi tiết"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="120"
              format="#,##0%"
              cssClass="ColumnsAutomatic1"
              :calculate-cell-value="calculateTongDB"
            />
          </DxColumn>
          <DxColumn
            data-field="kldongbo"
            caption="Tổng tồn (M3)"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            :visible="true"
            :width="120"
            format="#,##0.###0"
            cssClass="ColumnsAutomatic1"
            :calculate-cell-value="calculateTongM3"
          />
          <DxColumn
            data-field="tldongbo"
            caption="Tỷ lệ % đồng bộ từng SP"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            :visible="true"
            :width="120"
            format="#,##0.###0"
            cssClass="ColumnsAutomatic1"
          />

          <DxSummary :calculate-custom-summary="calculateAreaSummary">
            <DxTotalItem
              column="NAME"
              summary-type="count"
              value-format="fixedpoint"
              display-format="Tổng cộng : "
            />
            <DxTotalItem
              column="Tondk"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />

            <DxGroupItem
              column="TonCuoiT"
              :show-in-group-footer="false"
              :align-by-column="true"
              show-in-column="TonCuoiT"
              summary-type="min"
              value-format="#,##0"
              display-format="{0}"
            />
            <DxGroupItem
              column="kldongbo"
              :show-in-group-footer="false"
              :align-by-column="true"
              show-in-column="kldongbo"
              summary-type="sum"
              value-format="#,##0.####"
              display-format="{0}"
            />
            <DxGroupItem
              name="AreaSummarytldongbo"
              show-in-column="tldongbo"
              :show-in-group-footer="false"
              :align-by-column="true"
              summary-type="custom"
              value-format="###0%"
              display-format="{0}"
            />
            <DxGroupItem
              name="AreaSummary"
              show-in-column="TonCuoi"
              :show-in-group-footer="false"
              :align-by-column="true"
              summary-type="custom"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              name="tong"
              show-in-column="TonCuoi"
              :show-in-group-footer="false"
              :align-by-column="true"
              summary-type="custom"
              value-format="###0.####"
              display-format="{0}"
            />

            <DxTotalItem
              column="kldongbo"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="TDG2X2M3"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="TDGX3M3"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="TDG1X2M3"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="TSONX3M3"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="TSON2X2M3"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="TSON1X2M3"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="THTMDX3M3"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="THTMX3M3"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="THTM2X1M3"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="THTM1X1M3"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="TTC2X3M3"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="TTC1X3M3"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="TTC2X1M3"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="TTC1X1M3"
              summary-type="sum"
              value-format="###0.####"
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
      </q-card-section>
    </q-card>
    <q-dialog v-model="showChooseDate" persistent>
      <q-card class="my-card" style="min-width: 10%">
        <q-card-section>
          <div class="col-6">
            <q-date v-model="toDate" today-btn title="Đến ngày" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat color="red" label="Hủy" @click="cancelChooseDate" />
          <q-btn
            flat
            label="Đồng ý"
            @click="chooseDate(fromDate, toDate)"
            color="primary"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    /> -->
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import { formatDateVN, roundNumber } from "../ultils";
import DialogSelectDate from "components/commons/DialogSelectFromDateToDate";
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxExport,
  DxGroupItem,
  DxColumnChooser,
  DxHeaderFilter,
  DxSummary,
  DxSorting,
  DxTotalItem,
  DxGroupPanel,
  DxScrolling,
  DxGrouping,
} from "devextreme-vue/data-grid";
export default {
  // name: 'PageName',

  components: {
    DxDataGrid,
    DxColumn,
    DxSearchPanel,
    DxExport,
    DxSorting,
    DxGroupItem,
    DxColumnChooser,
    DxHeaderFilter,
    DxSummary,
    DxTotalItem,
    DxGroupPanel,
    DxScrolling,
    DxGrouping,
    DialogSelectDate,
  },
  data() {
    return {
      showChooseDate: false,
      fromDate: moment().startOf("month"),
      toDate: moment(),
      showVolumnColumn: false,
      factory1: null,
      dataSource: null,
      stepId: null, // string,
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102299,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102299,
          code: "TB",
        },
      ],
    };
  },
  computed: {
    ...mapGetters("base", [
      "opCongDoans",
      "myFactoryInfor",
      "userInfo",
      "dsCongDoans",
    ]),
    ...mapGetters("keHoach", ["tonPhois"]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  methods: {
    ...mapActions("prod", ["stockdepartment"]),
    ...mapActions("base", ["getAllCongDoans"]),
    async loadData() {
      let payload = {
        startDate: moment(this.fromDate).format().slice(0, 10),
        endDate: moment(this.toDate).format().slice(0, 10),
      };
      console.log(payload);
      let dataSource = await this.stockdepartment(payload);
      // dataSource.data.map(e =>{
      //   e.x1t = Math.abs(e.x1t);
      //   e.x1a = Math.abs(e.x1a);
      //   e.x3 = Math.abs(e.x3);``````
      //   e.amX = Math.abs(e.amX);
      //   e.tq = Math.abs(e.tq);
      // })
      this.dataSource = dataSource.data;
    },
    calculateAreaSummary(options) {
      if (options.name === "AreaSummary") {
        if (options.summaryProcess === "start") {
          this.tong = 0;
          this.tongTT = 0;
          this.tongSX = 10000000;
        }
        if (options.summaryProcess === "calculate") {
          this.tongTT += options.value.VOLUMN;
          if (this.tongSX > options.value.TonCuoiT)
            this.tongSX = options.value.TonCuoiT;
          options.totalValue = roundNumber(this.tongSX, 0) * this.tongTT;
          this.tong += roundNumber(this.tongSX, 0) * this.tongTT;
        }
      }
      if (options.name === "AreaSummarytldongbo") {
        if (options.summaryProcess === "start") {
          this.tongTT1 = 0;
          this.tongm3db = 100000;
          this.tongm3 = 0;
        }
        if (options.summaryProcess === "calculate") {
          this.tongTT1 += options.value.VOLUMN;
          this.tongm3 += options.value.kldongbo;
          if (this.tongm3db > options.value.TonCuoiT)
            this.tongm3db = options.value.TonCuoiT;
          options.totalValue =
            (roundNumber(this.tongm3db, 0) * this.tongTT1) / this.tongm3;
        }
      }
      if (options.name === "tong") {
        if (options.summaryProcess === "calculate") {
          options.totalValue = this.tong;
        }
      }
    },
    calculateTongThanh(e) {
      e.TonCuoiT =
        (e.TTC1X1 +
          e.TTC2X1 +
          e.TTC1X3 +
          e.TTC2X3 +
          e.THTM1X1 +
          e.THTM2X1 +
          e.THTMX3 +
          e.THTMDX3 +
          e.TSON1X2 +
          e.TSON2X2 +
          e.TSONX3 +
          e.TDG1X2 +
          e.TDG2X2 +
          e.TDGX3) /
        e.heso;

      return e.TonCuoiT;
    },
    calculateTongM3(e) {
      e.kldongbo =
        ((e.TTC1X1 +
          e.TTC2X1 +
          e.TTC1X3 +
          e.TTC2X3 +
          e.THTM1X1 +
          e.THTM2X1 +
          e.THTMX3 +
          e.THTMDX3 +
          e.TSON1X2 +
          e.TSON2X2 +
          e.TSONX3 +
          e.TDG1X2 +
          e.TDG2X2 +
          e.TDGX3) *
          e.VOLUMN) /
        e.heso;

      return e.kldongbo;
    },
    calculateTongDB(h) {
      let mindg = 0;
      let data = null;
      data = this.dataSource.filter((d) => d.sp == h.sp);
      // console.log('dong bo:',data[0].TONGCONG)
      mindg = data[0].TONGCONG;
      for (let i = 1; i < data.length; i++) {
        if (mindg > data[i].TONGCONG) mindg = data[i].TONGCONG;
      }
      if (mindg == 0) return 0;
      else return h.TONGCONG / mindg;
    },
    calculateTongDBKL(h) {
      let mindg = 0;
      let data = null;
      data = this.dataSource.filter((d) => d.sp == h.sp);
      // console.log('dong bo:',data[0].TONGCONG)
      mindg = data[0].TONGCONG;
      for (let i = 1; i < data.length; i++) {
        if (mindg > data[i].TONGCONG) mindg = data[i].TONGCONG;
      }
      return (h.TONGCONG - mindg) * h.VOLUMN;
    },
    calculatedauky(e) {
      if (e.DAI > 0)
        e.Tondk = roundNumber(
          (e.TondkT * e.DAY * e.DAI * e.RONG) / 1000000000,
          4
        );
      else e.Tondk = e.TondkT;

      return e.Tondk;
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
  },
  async created() {
    await this.loadData();
  },
  mounted() {},
};
</script>
<style >
#gridContainer {
  height: 800px;
}

/* .ColumnsAutomatic1 {
       border: 1px solid !important;
         color: black;
        background-color: white;
       font-weight: 500;
    } */
.dx-command-expand {
  background: white;
  font-weight: 900;
  width: 280;
  font-family: Arial, Helvetica, sans-serif;
}
/* .dx-header-row .ColumnsAutomatic1 {
  border: 1px solid !important;
  color: black;
 background-color: burlywood;
 font-weight: 900 ;
} */
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  background-color: #f7f7f7;
  font-weight: 900;
  width: 280;
}
</style>
