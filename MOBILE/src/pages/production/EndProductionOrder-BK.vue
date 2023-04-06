<template>
  <q-page class="q-pa-md q-gutter-sm">
    <q-banner class="bg-primary text-white">
      <div class="text-h5">Kết thúc lệnh sản xuất</div>
    </q-banner>

    <q-card class="my-card">
      <q-separator spaced />
      <q-card-section>
        <div class="row widget-container q-pa-sm">
          <div class="col-12 col-md-3 q-pa-sm">
            <q-select
              disable
              color="grey-3"
              label-color="orange"
              filled
              v-model="factory"
              :options="factories"
              label="Chọn nhà máy"
            />
          </div>
          <!-- <div class="col-12 col-md-3 q-pa-sm">
            <q-input
              color="grey-3"
              label-color="orange"
              outlined
              v-model="ngayDongGoi"
              mask="date"
              :rules="['date']"
              label="Ngày đóng gói"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="ngayDongGoi"
                      @input="() => $refs.qDateProxy.hide()"
                      mask="YYYY-MM-DD"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>-->
          <div class="col-12 col-md-3 q-pa-sm">
            <q-input
              color="grey-3"
              label-color="orange"
              outlined
              v-model="week"
              :value="ngayDongGoi ? moment(ngayDongGoi).format('w') : ''"
              label="Tuần"
              @keyup="load(week)"
            >
              <template v-slot:append>
                <q-icon name="next_week" color="orange" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-pa-sm">
            <div class="col-12 q-pa-sm">
              <q-select
                style="width:100%"
                v-model="numberPO"
                :options="optionNumber"
                label="Lệnh sản xuất"
              />
            </div>
          </div>
        </div>
      </q-card-section>
      <div class="row widget-container q-pa-lg">
        <div class="col-12 col-md-3 q-pa-sm text-weight-medium">
          <q-btn
            @click="confirm(week)"
            class="q-mr-sm q-mb-sm q-pa-sm text-primary shadow-10 text-weight-medium borders-radius-inherit text-h8"
            text-color="purple"
            glossy
            unelevated
            label="Kết thúc"
            icon-right="send"
            no-caps
          ></q-btn>
          <q-btn
            @click="unConfirm(week)"
            class="q-mr-sm q-mb-sm q-pa-sm text-primary shadow-10 text-weight-medium borders-radius-inherit text-h8"
            text-color="purple"
            glossy
            unelevated
            label="Mở lại"
            icon-right="send"
            no-caps
          ></q-btn>
        </div>
      </div>
      <q-card-section v-show="showProgress">
        <div class="row">
          <div class="col-12">
            <q-linear-progress size="25px" :value="progress1" color="darkcyan">
              <div class="absolute-full flex flex-center">
                <q-badge color="white" text-color="black" :label="progressLabel1" />
              </div>
            </q-linear-progress>
          </div>
        </div>
      </q-card-section>
      <q-card-section></q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
  DxRequiredRule,
  DxScrolling,
  DxSearchPanel,
} from "devextreme-vue/data-grid";
import { DxTreeList, DxSelection } from "devextreme-vue/tree-list";
import { DxTextBox } from "devextreme-vue";
import {
  getWeekNumber,
  formatNumber,
  roundNumber,
  showLoadingIos,
  closeLoading,
  showNotifyValidate,
  showNotifySuccess,
  showNotifyError,
} from "../../utils/utils";
import { QSpinnerGears } from "quasar";
// import SelectBox from "../../components/commons/SelectBoxInt";
// import NumberBox from "../../components/commons/NumberBox";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxLookup,
    DxRequiredRule,
    DxScrolling,
    DxSearchPanel,
    // NumberBox,
    // SelectBox,
    DxTextBox,
    DxSelection,
    DxTreeList,
  },
  data() {
    return {
      week: moment().format("w"),
      //   ngayDongGoi: moment().format().slice(0, 10),
      edit: true,
      markets: [],
      markets1: [],
      dataSource: [],
      numberPO: "",
      dscongdoan: [
        { id: 100057, name: "Đóng gói X2(Thuận Hưng)", type: "th" },
        { id: 100069, name: "Đóng gói X3(Thuận Hưng)", type: "th" },
      ],
      optionNumber: [],
      congdoan: 100069,
      //   week: 0,
      year: null,
      allDataPlan: [],
      marketSelect: { name: "" },
      payloadCreatePlan: [],
      showDetail: false,
      type: "th",
      progress1: 0.0,
      showProgress: false,
      showStatus: false,
      showCreateButton: true,
      countDown: 5,
      countFail: 0,
      soLenh: "",
      //   numberPO: {},
      hienThiXacNhan: false,
      hienThiCongDoan: false,
      deptExpandedRowKeys: [],
      deptOks: [],
      thucHienTiep: true,
      deptSelectedRowKeys: [],
      departments: [],
      factory: { label: "NM Thuận Hưng", value: "100000", code: "TH" },
      factories: [
        {
          label: "NM Thuận Hưng",
          value: "100000",
          code: "TH",
        },
        {
          label: "NM Quang Minh 1",
          value: "100002",
          code: "QM1",
        },
      ],
    };
  },
  created() {
    const today = new Date();
    this.week = getWeekNumber(today);
    const currentYear = today.getFullYear();
    this.year = currentYear;
    const type = this.$route.query.type;
    if (type) {
      this.dscongdoan = this.dscongdoan.filter((d) => {
        return d.type === type;
      });
    }
    this.load(this.week);
  },

  computed: {
    ...mapGetters("base", ["myFactoryInfor"]),
    grid: function () {
      return this.$refs.grid.instance;
    },
    progressLabel1() {
      return (this.progress1 * 100).toFixed(2) + "%";
    },
    myPos() {
      console.log(this.markets);
    },
    // week() {
    //   console.log("filler");
    //   this.week = 38;
    //   if (!this.week) return this.numberPO.length;
    //   if (this.numberPO.length)
    //     return this.numberPO.filter((e) => e.week.includes(this.week));
    //   return this.numberPO.filter((e) => e.week == this.week);
    // },
  },
  methods: {
    async confirm(week) {
      const payload = {
        number: this.numberPO || Math.floor(Math.random() * 10000000),
        week: week,
      };
      const data = await this.$store.dispatch(
        "production/CONFIRM_END_PO",
        payload
      );
      if (data.data[0].result == 1) {
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
    async unConfirm(week) {
      const payload = {
        number: this.numberPO || Math.floor(Math.random() * 10000000),
        week: week,
      };
      const data = await this.$store.dispatch(
        "production/UNCOMFIRM_END_PO",
        payload
      );

      if (data.data[0].result == 1) {
        showNotifySuccess();
      } else {
        this.$q.notify({
          message: "Chọn sai LSX hoặc tuần",
          caption: "change again",
          color: "secondary",
        });
      }
    },
    async load(val) {
      this.optionNumber = [];
      const payload = {
        week: val,
        factoryId: this.myFactoryInfor.factoryId,
      };
      const data = await this.$store.dispatch("production/GET_PO", payload);
      this.numberPO = data.data;
      await this.numberPO.forEach((e) => {
        this.optionNumber.push(e.number);
      });
      if (this.optionNumber.length > 0) {
        this.numberPO = this.optionNumber[0];
      }
    },
    chonWeek(e) {
      console.log("e.chonWeek", e.value);
      this.week = e.value;
    },
    chonNumber(val) {
      console.log("e.chonNumber", e.value);
      this.load();
    },
    chonCongDoan(e) {
      this.congdoan = e.value;
    },
    chonYear(e) {
      console.log("e.value", e.value);
      this.year = e.value;
    },
    chonSoLenh(e) {
      this.soLenh = e.value;
    },
    onSelectionChanged({ selectedRowsData }) {
      console.log(selectedRowsData);
      this.marketSelect = selectedRowsData[0];
    },
  },
};
</script>

<style scoped>
.gridContainer {
  height: 500;
}
</style>
