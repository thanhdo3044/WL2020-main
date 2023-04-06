<template>
  <q-page class="q-pa-md q-gutter-sm">
    <q-banner class="bg-primary text-orange">
      <div class="text-h6">Tạo kế hoạch đóng gói</div>

      <template v-slot:action>
        <q-btn flat color="white" label="In kế hoạch" to="/in-khsx" />
        <q-btn
          v-if="showCreateButton"
          flat
          color="white"
          label="Tạo kế hoạch"
          @click="xacNhan"
        />
        <span v-else>Vui lòng chờ {{ countDown }}s</span>
      </template>
    </q-banner>

    <q-card class="my-card">
      <q-separator spaced />
      <q-card-section>
        <div class="row widget-container q-pa-md">
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
          <div class="col-12 col-md-3 q-pa-sm">
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
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="ngayDongGoi"
                      @input="() => $refs.qDateProxy.hide()"
                      mask="YYYY-MM-DD"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-pa-sm">
            <q-input
              color="grey-3"
              label-color="orange"
              outlined
              disable
              :value="ngayDongGoi ? moment(ngayDongGoi).format('w') : ''"
              label="Tuần"
            >
              <template v-slot:append>
                <q-icon name="next_week" color="orange" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-pa-sm">
            <q-input
              color="grey-3"
              label-color="orange"
              outlined
              v-model="soLenh"
              label="Số lệnh"
            >
              <template v-slot:append>
                <q-icon name="work" color="orange" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
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
      <q-card-section>
        <div class="row">
          <div class="col-12 q-pa-md">
            <div class="row">
              <div class="col-8 text-h5 q-pa-sm">Danh mục sản phẩm</div>
            </div>
            <DxDataGrid
              ref="grid"
              id="gridContainer"
              :data-source="markets"
              :allow-column-reordering="true"
              :show-borders="true"
              key-expr="name"
              @row-updated="logEvent"
              @editorPreparing="onEditorPreparing"
              :hover-state-enabled="true"
              @selection-changed="onSelectionChanged"
              :show-column-lines="true"
              :row-alternation-enabled="true"
            >
              <DxScrolling mode="infinite" />
              <DxEditing :allow-updating="edit" mode="cell" />
              <DxSearchPanel
                :visible="true"
                :width="240"
                placeholder="Tìm kiếm..."
              />
              <DxColumn data-field="name" caption="Tên sản phẩm" />
              <DxColumn
                data-field="quantity"
                caption="KHSX"
                data-type="number"
                format="fixedpoint"
                width="100"
              >
                <DxRequiredRule />
              </DxColumn>
              <DxColumn
                :visible="showStatus"
                data-field="status"
                caption="Trạng thái"
              />
            </DxDataGrid>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab glossy icon="keyboard_arrow_up" color="primary" />
    </q-page-scroller>
    <q-dialog v-model="hienThiXacNhan">
      <q-card class="full-height" style="min-width:80%">
        <q-card-section class="row items-center q-pb-none">
          <span class="q-ml-sm top-title">Tạo kế hoạch sản xuất</span>
          <q-space />
          <q-btn icon="close" flat round dense @click="closeEvent" />
        </q-card-section>
        <q-card-section>
          <DxDataGrid
            :data-source="markets1"
            :show-borders="true"
            :hover-state-enabled="true"
            :allow-column-resizing="true"
            :column-resizing-mode="'widget'"
            :column-min-width="50"
            :column-auto-width="true"
            key-expr="id"
          >
            <DxColumn :width="100" data-field="st" caption="STT" />
            <DxColumn data-field="name" caption="Tên sản phẩm" />
            <DxColumn
              data-field="quantity"
              caption="Số lượng"
              data-type="number"
              format="fixedpoint"
              width="100"
            ></DxColumn>
          </DxDataGrid>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" v-close-popup />
          <q-btn
            flat
            label="Tạo kế hoạch"
            @click="createPlan"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showStatus">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Hoàn thành</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          >Nhấn Ok để thêm kế hoạch nhập về và hệ số phôi.</q-card-section
        >

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" @click="veManHinh" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="hienThiCongDoan">
      <q-card class="full-height" style="min-width:80%">
        <q-card-section class="row items-center q-pb-none">
          <span class="q-ml-sm top-title"
            >Chọn công đoạn thực hiện kế hoạch</span
          >
          <q-space />
          <q-btn icon="close" flat round dense @click="closeEvent" />
        </q-card-section>

        <q-card-section>
          <DxTreeList
            id="selectedDepartments"
            ref="treeList"
            :data-source="departments"
            :show-row-lines="true"
            :show-borders="true"
            :column-auto-width="true"
            :expanded-row-keys="deptExpandedRowKeys"
            :selected-row-keys.sync="deptSelectedRowKeys"
            key-expr="id"
          >
            <DxSelection :recursive="false" mode="multiple" />
            <DxColumn data-field="name" caption="Công đoạn" />
          </DxTreeList>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            :disable="thucHienTiep"
            flat
            label="Đồng ý"
            @click="createPlan"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
  DxSearchPanel
} from "devextreme-vue/data-grid";
import { DxTreeList, DxSelection } from "devextreme-vue/tree-list";
import { DxTextBox } from "devextreme-vue";
import {
  showLoadingIos,
  closeLoading,
  getWeekNumber,
  showNotifyValidate,
  showNotifySuccess,
  randomTo
} from "../../ultils";
import SelectBox from "../../components/commons/SelectBoxInt";
import NumberBox from "../../components/commons/NumberBox";
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
    NumberBox,
    SelectBox,
    DxTextBox,
    DxSelection,
    DxTreeList
  },
  data() {
    return {
      ngayDongGoi: moment()
        .format()
        .slice(0, 10),
      edit: true,
      markets: [],
      markets1: [],
      dataSource: [],
      dscongdoan: [
        { id: 100057, name: "Đóng gói X2(Thuận Hưng)", type: "th" },
        { id: 100069, name: "Đóng gói X3(Thuận Hưng)", type: "th" }
      ],
      congdoan: 100069,
      week: 0,
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
          code: "TH"
        },
        {
          label: "NM Quang Minh 1",
          value: "100002",
          code: "QM1"
        }
      ]
    };
  },
  created() {
    const today = new Date();
    this.week = getWeekNumber(today);
    const currentYear = today.getFullYear();
    this.year = currentYear;
    const type = this.$route.query.type;
    if (type) {
      this.dscongdoan = this.dscongdoan.filter(d => {
        return d.type === type;
      });
    }
    // this.loadMarket();
  },
  mounted() {
    this.factory = {
      label: this.myFactoryInfor.name,
      value: this.myFactoryInfor.id,
      code: this.myFactoryInfor.code
    };
    this.loadMarket();
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor"]),
    grid: function() {
      return this.$refs.grid.instance;
    },
    progressLabel1() {
      return (this.progress1 * 100).toFixed(2) + "%";
    },
    myPos() {
      console.log(this.markets);
    }
  },
  methods: {
    async xacNhan() {
      this.hienThiXacNhan = true;
      this.deptOks = [];

      this.markets1 = await this.markets
        .filter(m => m?.quantity)
        .map((m, st) => ({ ...m, st: st+1 }));
      let productIds = await this.markets1.map(m => m.productId);
      console.log(productIds);
      let data = await this.$store.dispatch("prod/GET_PLAN_STEPS", productIds);
      this.departments = data.data;
    },
    veManHinh() {
      console.log("Về màn hình");
      this.$router.push("/ke-hoach-nhap-ve");
    },
    closeEvent() {
      this.hienThiXacNhan = false;
    },
    async loadPlan(payload) {
      this.dataSource = [];
      showLoadingIos();
      const data = await this.$store.dispatch("prod/CALCULATOR_PLAN", payload);
      this.dataSource = data.data;
      closeLoading();
    },
    async createPlan() {
      let marketWithQuantity = [];
      this.markets.forEach(element => {
        if (element?.quantity) {
          const more = { week: this.week, year: this.year };
          marketWithQuantity.push({ ...element, ...more });
        }
      });

      if (marketWithQuantity.length > 0) {
        this.$store.dispatch("prod/SAVE_STATE_MARKET", marketWithQuantity);
        this.progress1 = 0.0;
        const totalRecordSendRequest = marketWithQuantity.length;
        const stepValue = (1 / (totalRecordSendRequest / 100)) * 0.01;
        this.showProgress = true;
        // marketWithQuantity.forEach(async (element) => {

        // })
        for (let i = 0; i < marketWithQuantity.length; i++) {
          const element = marketWithQuantity[i];
          const payload = {
            itemId: element.productId,
            quantity: element.quantity,
            year: moment(this.ngayDongGoi).format("YYYY"),
            week: moment(this.ngayDongGoi).format("w"),
            market: element.code,
            number: this.soLenh || Math.floor(Math.random() * 10000000),
            ngayDongGoi: moment(this.ngayDongGoi)
              .format()
              .slice(0, 10),
            departments: this.deptSelectedRowKeys,
            factoryId: this.myFactoryInfor.id
          };
          const result = await this.addPlan(payload);
          const randomTime = 1000;
          await this.waitTime(randomTime);
          const mIndexFail = this.markets.findIndex(m => {
            return m.id === element.id;
          });
          if (result.meta.success) {
            this.markets[mIndexFail].status = "Thành công !";
          } else {
            const message = result?.meta?.messages?.message;
            this.markets[mIndexFail].status = message;
          }
          this.progress1 <= 1
            ? (this.progress1 += stepValue)
            : (this.progress1 = 1);
        }
        // showNotifySuccess()
        this.showStatus = true;
        // this.$router.push('/kh-view-plan-cal')
      } else {
        showNotifyValidate();
      }
    },
    waitTime(second) {
      return new Promise(resolve => setTimeout(resolve, second));
    },
    waitShowBtn() {
      setInterval(() => {
        this.countDown -= 1;
      }, 1000);
      this.showCreateButton = true;
      this.countDown = 5;
    },
    async addPlan(payload) {
      const data = await this.$store.dispatch("prod/ADD_KH", payload);
      // // console.log(data)
      // if (data?.data?.meta?.success) {
      //   return true
      // }
      return data;
    },
    chonWeek(e) {
      this.week = e.value;
    },
    chonCongDoan(e) {
      this.congdoan = e.value;
    },
    chonYear(e) {
      this.year = e.value;
    },
    chonSoLenh(e) {
      this.soLenh = e.value;
    },
    onSelectionChanged({ selectedRowsData }) {
      console.log(selectedRowsData);
      this.marketSelect = selectedRowsData[0];
    },
    logEvent(e) {
      this.marketSelect = e.data;
      if (e.data.quantity) {
        const payload = {
          departmentId: this.congdoan,
          itemId: e.data.productId,
          quantity: e.data.quantity,
          week: this.week,
          year: this.year,
          market: e.data.code
        };
      }
    },
    async loadMarket() {
      const data = await this.$store.dispatch(
        "prod/GET_PROD_MARKET",
        this.factory
      );
      this.markets = data.data;
      // this.markets.forEach(m => (m.quantity = 100));
    },
    onEditorPreparing(e) {
      if (
        e.dataField === "name" ||
        e.dataField === "ton" ||
        e.dataField === "action"
      ) {
        e.editorOptions.disabled = true;
      }
    }
  },
  watch: {
    deptSelectedRowKeys(newValue, oldValue) {
      if (newValue.length > 0) this.thucHienTiep = false;
      else this.thucHienTiep = true;
    }
  }
};
</script>

<style scoped>
.gridContainer {
  height: 500;
}
</style>
