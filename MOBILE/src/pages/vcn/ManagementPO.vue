<template>
  <q-page class="q-pa-md q-gutter-sm bg-blue-grey-7">
    <q-banner class="bg-primary text-white">
      <div class="text-h5">Kết thúc lệnh sản xuất</div>
    </q-banner>

    <q-card class="my-card bg-blue-grey-7" style="border:2px solid white">
      <q-separator spaced />
      <q-card-section>
        <div class="row widget-container q-pa-sm">
          <div class="col-12 col-md-3 q-pa-sm">
            <q-select
            dark
              v-if="count === true"
              color="grey-3"
              label-color="orange"
              filled
              v-model="factory"
              :options="factories"
              @input="change"
              label="Chọn nhà máy"
            />

            <q-select
              v-else
              disable
              dark
              color="grey-3"
              label-color="orange"
              filled
              v-model="factory"
              :options="factories"
              @input="change"
              label="Chọn nhà máy"
            />
            
          </div>
          <div class="col-12 col-md-3 q-pa-sm">
            <q-select
            dark
              color="grey-3"
              label-color="orange"
              filled
              v-model="xuong"
              :options="xuongs"
              @input="chonXuong"
              label="Chọn xưởng"
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
            dark
              color="grey-3"
              label-color="orange"
              outlined
              v-model="year"
              type="number"
              label="Năm"
              @input="load(week, year)"
            >
              <template v-slot:append>
                <q-icon name="next_week" color="orange" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3 q-pa-sm">
            <q-input
            dark
              color="grey-3"
              label-color="orange"
              outlined
              v-model="week"
              label="Tuần"
              type="number"
              @input="load(week, year)"
            >
              <template v-slot:append>
                <q-icon name="next_week" color="orange" />
              </template>
            </q-input>
          </div>

          <!-- <div class="col-12 col-md-3 q-pa-sm">
            <div class="col-12 q-pa-sm">
              <q-select
                style="width: 100%"
                v-model="numberPO"
                :options="optionNumber"
                label="Lệnh sản xuất"
              />
            </div>
          </div> -->
        </div>
        <template>
          <div class="q-pa-md">
            <q-table dark
            class="bg-blue-grey-7"
              :title="'Tuần ' + week + ' Năm ' + year"
              :data="data1"
              :columns="columns"
              row-key="name"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="number" :props="props">
                    {{ props.row.number }}
                  </q-td>
                  <q-td key="status" :props="props">
                    {{ props.row.endPO ? "Đã đóng" : "Đang chạy" }}
                  </q-td>
                  <q-td auto-width v-if="props.row.endPO">
                    <q-btn
                      color="green"
                      label="Mở lại"
                      size="md"
                      no-caps
                      style="margin-right: 16px; width: 64px"
                      @click="onShowDialog('showDialogOpenPO', props.row)"
                    ></q-btn>
                    <!-- @click="unConfirm(props.row)" -->

                    <q-btn
                      color="red"
                      label="Xóa"
                      size="md"
                      no-caps
                      @click="onShowDialog('showDialogDelPO', props.row)"
                    ></q-btn>
                  </q-td>
                  <q-td auto-width v-else>
                    <q-btn
                      color="blue"
                      label="Kết thúc"
                      size="md"
                      no-caps
                      style="margin-right: 16px; width: 64px"
                      @click="onShowDialog('showDialogEndPO', props.row)"
                    ></q-btn>
                    <!-- @click="confirm(props.row)" -->

                    <q-btn
                      color="red"
                      label="Xóa"
                      size="md"
                      no-caps
                      @click="onShowDialog('showDialogDelPO', props.row)"
                    ></q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </template>
      </q-card-section>

      <q-dialog v-model="showDialogOpenPO" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm"
              >Mở lại lệnh sản xuất
              <p style="font-weight: 800">
                {{ data == null ? "" : data.number }}
              </p></span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Hủy" color="primary" v-close-popup></q-btn>
            <q-btn
              flat
              label="Đồng ý"
              color="primary"
              @click="unConfirm(data)"
              v-close-popup
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showDialogEndPO" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm"
              >Kết thúc lệnh sản xuất
              <p style="font-weight: 800">
                {{ data == null ? "" : data.number }}
              </p></span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Hủy" color="primary" v-close-popup></q-btn>
            <q-btn
              flat
              label="Đồng ý"
              color="primary"
              @click="confirm(data)"
              v-close-popup
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showDialogDelPO" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm"
              >Xóa lệnh sản xuất
              <p style="font-weight: 800">
                {{ data == null ? "" : data.number }}
              </p></span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Hủy" color="primary" v-close-popup></q-btn>
            <q-btn
              flat
              label="Đồng ý"
              color="primary"
              @click="deletePO(data)"
              v-close-popup
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- <div class="row widget-container q-pa-lg">
        <div class="col-12 col-md-3 q-pa-sm text-weight-medium">
          <q-btn
            @click="confirm(week, year)"
            class="q-mr-sm q-mb-sm q-pa-sm text-primary shadow-10 text-weight-medium borders-radius-inherit text-h8"
            text-color="purple"
            glossy
            unelevated
            label="Kết thúc"
            icon-right="send"
            no-caps
          ></q-btn>
          <q-btn
            @click="unConfirm(week, year)"
            class="q-mr-sm q-mb-sm q-pa-sm text-primary shadow-10 text-weight-medium borders-radius-inherit text-h8"
            text-color="purple"
            glossy
            unelevated
            label="Mở lại"
            icon-right="send"
            no-caps
          ></q-btn>
        </div>
      </div> -->
      <!-- <div class="btn-del">
        <q-btn
          @click="unConfirm(week)"
          class="q-mr-sm q-mb-sm q-pa-sm text-primary shadow-10 text-weight-medium borders-radius-inherit text-h8"
          text-color="purple"
          glossy
          unelevated
          label="Xóa"
          icon-right="send"
          no-caps
        ></q-btn>
      </div> -->
      <q-card-section v-show="showProgress">
        <div class="row">
          <div class="col-12">
            <q-linear-progress size="25px" :value="progress1" color="darkcyan">
              <div class="absolute-full flex flex-center">
                <q-badge
                  color="white"
                  text-color="black"
                  :label="progressLabel1"
                />
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
      columns: [
        {
          name: "number",
          required: true,
          label: "Lệnh sản xuất",
          align: "left",
          headerStyle: "font-size:1rem",
          field: (row) => row.number,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "status",
          align: "center",
          label: "Trạng thái",
          headerStyle: "font-size:1rem",
          sortable: false,
        },
        {
          name: "delete",
          align: "center",
          label: "Action",
          headerStyle: "font-size:1rem",
          sortable: false,
        },
      ],
      data1: [],
      data: null,
      xuong: null,
      xuongs: [],
      showDialogOpenPO: false,
      showDialogEndPO: false,
      showDialogDelPO: false,

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
      count: true,
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
      factory: null,
      factory1: null,
      factories: [],
    };
  },
  created() {
    this.loadFactory();
    const today = new Date();
    this.week = getWeekNumber(today);
    const currentYear = today.getFullYear();
    this.year = currentYear;
    this.load(this.week, this.year);
  },

  computed: {
    ...mapGetters("base", ["myFactoryInfor", "userInfo"]),
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
    async loadFactory(){
      this.factories = [];
      const data = await this.$store.dispatch(
        "vcn/getFactory"
      );
      data.forEach(el => {
        this.factories.push({
          label: el.name,
          factoryId: el.id,
          code: el.code
        })
      });
      this.factory = this.factories[0];
    },
    async change(value) {
      console.log("factory", this.factory);
      const payload = {
        factoryId: this.factory.factoryId
      }
      const data = await this.$store.dispatch(
        "vcn/getXuongByFactoryId", payload
      );
      data.map(e => (e.label = e.name));
      this.xuongs = data;
    },
    async chonXuong() {
      this.factory = value;
      await this.load(this.week, this.year);
    },
    async onShowDialog(dialog, payload) {
      this.data = payload;
      this[dialog] = true;
    },
    async openPO(row) {
      console.log(row);
    },
    async confirm(payload) {
      const data = await this.$store.dispatch(
        "vcn/CONFIRM_END_PO",
        payload
      );
      if (data) {
        this.load(this.week, this.year);
        showNotifySuccess();
      } else {
        showNotifyError();
      }
      
    },
    async unConfirm(payload) {
      const data = await this.$store.dispatch(
        "vcn/UNCOMFIRM_END_PO",
        payload
      );

      if (data) {
        this.load(this.week, this.year);
        showNotifySuccess();
      } else {
        this.$q.notify({
          message: "Có lỗi xảy ra",
          caption: "",
          color: "red",
        });
      }
      
    },
    async deletePO(payload) {
      const data = await this.$store.dispatch("vcn/DELETE_PO", payload);
      if (data) {
        showNotifySuccess();
      } else {
        this.$q.notify({
          message: "Có lỗi xảy ra",
          caption: "",
          color: "red",
        });
      }
      this.load(this.week, this.year);
    },

    async load(week, year) {
      this.optionNumber = [];
      const payload = {
        week,
        year,
        factoryId: this.xuong.id,
      };
      const data = await this.$store.dispatch("vcn/getPOByFactory", payload);
      this.numberPO = data.data;
      this.data1 = [...data.data];
      console.log("11", data);
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
.btn-del {
  margin-left: 33.33%;
}
</style>
