<template>
  <q-page>
    <!-- <q-banner class="text-primary">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div class="text-h6 q-mt-lg">Tạo LSX khối CBG - {{ factory.label }}</div>
    </q-banner> -->
    <div class="row" style="background-color: #daf8e1">
      <div class="col-6 text-blue text-bold" style="font-size: 18px">
        Tạo LSX khối CBG -
        <span class="text-amber-14">{{ factory.label }}</span>
      </div>
    </div>
    <div>
      <div class="text-orange row widget-container">
        <div class="col-12 col-md-2 q-pa-sm">
          <q-select color="grey-3" label-color="orange" filled @input="LSXVGT" v-model="factory" :options="factories1"
            label="Chọn nhà máy" dense />
        </div>
        <div class="col-12 col-md-1 q-pa-sm">
          <q-input filled @input="loadtuan" label-color="orange" v-model.number="week" type="number" label="Tuần"
            dense />
        </div>
        <div class="col-12 col-md-1 q-pa-sm">
          <q-select color="orange" label-color="orange" filled v-model="goodsType" :options="goodsTypes"
            label="Loại sản phẩm" dense />
        </div>
        <div class="col-12 col-md-1 q-pa-sm">
          <q-input filled @input="loadnam" label-color="orange" v-model.number="year" type="number" label="Năm" dense />
        </div>
        <div class="col-12 col-md-2 q-pa-sm">
          <q-input color="grey-3" label-color="orange" outlined :readonly="true" v-model="soLenh" label="Số lệnh" dense>
            <template v-slot:append>
              <q-icon name="work" color="orange" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-1 q-pa-sm">
          <q-btn v-if="soLenh" color="positive" label="Tạo LSX" @click="xacNhan" />
        </div>
        <div class="col-12 col-md-2 q-pa-sm">
          <div class="q-gutter-sm text-green-10 text-bold">
            <q-checkbox v-show="true" v-model="selection" label="TẠO LSX BTP" />
          </div>
        </div>
      </div>
    </div>
    <!-- <q-radio
              v-show="hienthi"
              v-model="selection"
              val="VGT" 
              label="Tạo LSX đến VGT"
              color="teal"
            />
            <br>
                <q-btn
         v-show="hienthi"
            color="green-10"
            label="RESET"
            @click="reset"
          /> -->
    <div class="row q-pa-md" style="padding: 0px 16px;">
      <div class="col">
        <div>
          <DxDataGrid ref="grid" id="gridContainer" :data-source="markets" :selection="{ mode: 'single' }"
            :allow-column-reordering="true" :show-borders="true" key-expr="id" :hover-state-enabled="true"
            @selection-changed="onSelectionChanged" :show-column-lines="true" :show-row-lines="true"
            :row-alternation-enabled="true">
            <DxScrolling mode="infinite" />
            <DxEditing :allow-updating="edit" mode="cell" />
            <DxFilterRow :visible="true" />

            <DxColumn data-field="productId" :allowEditing="false" caption="ID" alignment="center" width="90" />
            <DxColumn data-field="code" :allowEditing="false" caption="Mã thị trường" width="200" />
            <DxColumn data-field="name" :allowEditing="false" caption="Tên sản phẩm" width="500" />
            <DxColumn data-field="quantity" caption="Số lượng" data-type="number" format="#,##0.####" width="100">
              <DxRequiredRule />
            </DxColumn>
            <DxColumn :visible="showStatus" data-field="status" :allowEditing="false" caption="Trạng thái" />
          </DxDataGrid>
        </div>
      </div>
      <!-- <div class="col">
        <q-card bordered class="q-ma-lg">
          <q-card-section>
            <div class="text-h6">Tỷ lệ hoàn thành các LSX</div>
          </q-card-section>
          <q-card-section>
            <q-list
              bordered
              separator
              v-if="getKeHoachDongGois(marketSelect.code).length > 0"
            >
              <q-item
                v-for="task in getKeHoachDongGois(marketSelect.code)"
                :key="task.code"
                clickable
                v-ripple
              >
                <q-item-section>
                  <q-item-label
                    >{{ task.marketName || task.itemName }}
                  </q-item-label>
                  <q-item-label caption
                    >LSX: <strong>{{ task.number }}</strong></q-item-label
                  >
                  <q-item-label caption
                    >Tổng: <q-badge color="teal" :label="task.keHoach"
                  /></q-item-label>
                  <q-item-label caption
                    >Đạt: <q-badge color="teal" :label="task.soLuongDat"
                  /></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption> Còn thực hiện </q-item-label>
                  <div class="text-orange">
                    <q-badge color="teal" :label="task.conThucHien" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div> -->
    </div>
    <q-dialog v-model="hienThiXacNhan">
      <q-card class="full-height" style="min-width: 80%">
        <q-card-section class="row items-center q-pb-none">
          <span class="q-ml-sm top-title">Chi tiết số lượng LSX</span>
          <q-space />
          <q-btn icon="close" flat round dense @click="closeEvent" />
        </q-card-section>
        <q-card-section>
          <DxDataGrid :data-source="markets1" :show-borders="true" :hover-state-enabled="true"
            :allow-column-resizing="true" :column-resizing-mode="'widget'" :column-min-width="50"
            :column-auto-width="true" key-expr="id">
            <DxColumn :width="100" data-field="st" caption="STT" />
            <DxColumn data-field="name" caption="Tên sản phẩm" />
            <DxColumn data-field="quantity" caption="Số lượng" data-type="number" format="#,##0.####" width="100">
            </DxColumn>
          </DxDataGrid>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" v-close-popup />
          <q-btn flat label="Tạo LSX" @click="createPlan" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxFilterRow,
  DxRequiredRule,
  DxScrolling,
  DxSearchPanel,
} from "devextreme-vue/data-grid";
import {
  showLoadingIos,
  closeLoading,
  showNotifySuccess,
  getWeekNumber,
  showNotifyValidate,
} from "../ultils";

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxFilterRow,
    DxRequiredRule,
    DxScrolling,
    DxSearchPanel,
  },
  data() {
    return {
      ngayDongGoi: moment().format().slice(0, 10),
      edit: true,
      hienthi: true,
      selection: false,
      markets: [],
      markets1: [],
      dataSource: [],
      dscongdoan: [
        { id: 100057, name: "Đóng gói X2(Thuận Hưng)", type: "th" },
        { id: 100069, name: "Đóng gói X3(Thuận Hưng)", type: "th" },
      ],
      congdoan: 100069,
      factories1: null,
      week: 0,
      year: null,
      allDataPlan: [],
      marketSelect: { name: "" },
      payloadCreatePlan: [],
      showDetail: false,
      type: "th",
      nhamay: [],
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
      factory: null,
      thutu: 1,
      goodsType: {
        label: "TP",
        value: "TP",
        code: "TP",
      },
      goodsTypes: [
        {
          label: "TP",
          value: "TP",
          code: "TP",
        },
        {
          label: "BTP",
          value: "BTP",
          code: "BTP",
        },
         {
          label: "CLAIM",
          value: "CLAIM",
          code: "CLAIM",
        },
      ],
    };
  },
  created() {
    const today = new Date();
    this.week = getWeekNumber(today);
    this.tuanht = getWeekNumber(today);

    const currentYear = today.getFullYear();
    this.year = currentYear;
    this.namht = currentYear;
    this.factories1 = this.userInfo.role.types[0].value.filter((s) => s.type2 === "nhaMay" && s.parentId === 102299)
      .map((o) => ({
        label: o.name,
        code: o.code,
        factoryId: o.id,
        value: o.factory,
      }));
    this.factory = this.factories1[0]

    const type = this.$route.query.type;
    if (type) {
      this.dscongdoan = this.dscongdoan.filter((d) => {
        return d.type === type;
      });
    }
    const { factoryId } = this.factory;
    this.loadData({ factoryId });
  },
  mounted() {
   

    this.loadMarket();
  },
  computed: {
    ...mapGetters("lenhSanXuats", ["soLenhSanXuats", "getKeHoachDongGois"]),
    ...mapGetters("prod", ["factories"]),
    ...mapGetters("base", ["userInfo"]),
    grid: function () {
      return this.$refs.grid.instance;
    },
    progressLabel1() {
      return (this.progress1 * 100).toFixed(2) + "%";
    },
  },
  methods: {
    ...mapActions("lenhSanXuats", [
      "getBaoCaoThucHienDongGois",
      "getAllSoLenhSanXuats",
    ]),
    ...mapActions("messages", ["sendNotificationMail"]),
    async loadData(stepId) {
      this.getBaoCaoThucHienDongGois(stepId);
    },
    async xacNhan() {
      this.hienThiXacNhan = true;
      this.deptOks = [];

      this.markets1 = await this.markets
        .filter((m) => m?.quantity)
        .map((m, st) => ({ ...m, st: st + 1 }));
      let productIds = await this.markets1.map((m) => m.productId);
      console.log(productIds);
      let data = await this.$store.dispatch("prod/GET_PLAN_STEPS", productIds);
      this.departments = data.data;
    },
    // async reset() {
    //   this.selection = null
    // },
    async LSXVGT() {
      if (this.factory.code == "TH") this.hienthi = true;
      else this.hienthi = false;
    },
    veManHinh() {
      console.log("Về màn hình");
      this.$router.push("/ke-hoach-nhap-ve");
    },
    closeEvent() {
      this.hienThiXacNhan = false;
    },
    loadtuan() {
      if (this.week < this.tuanht) this.week = this.tuanht
    },
    loadnam() {
      if (this.year < this.namht) this.year = this.namht
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
      this.markets.forEach((element) => {
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
        console.log("marketWithQuantity", marketWithQuantity);
        for (let i = 0; i < marketWithQuantity.length; i++) {
          const element = marketWithQuantity[i];
          const payload = {
            itemId: element.productId,
            quantity: element.quantity,
            year: this.year,
            week: this.week,
            market: element.code,
            number: this.soLenh || Math.floor(Math.random() * 10000000),
            ngayDongGoi: moment(this.ngayDongGoi).format().slice(0, 10),
            departments: this.deptSelectedRowKeys,
            factoryId: this.factory.value,
            createBy: this.userInfo.id,
            //  mau:element.color,
          };
          const result = await this.addPlan(payload);
          const randomTime = 1000;
          await this.waitTime(randomTime);
          const mIndexFail = this.markets.findIndex((m) => {
            return m.id === element.id;
          });
          if (result.meta.success) {
            // if (this.selection) {
            //   const payload = {
            //     number: this.soLenh,
            //     goodsType: this.goodsType.label,
            //   };
            //   await this.$store.dispatch(
            //     "lenhSanXuats/getLenhSanXuatupdate",
            //     payload
            //   );
            // }
            this.markets[mIndexFail].status = "Thành công !";
          } else {
            const message = result?.meta?.messages?.message;
            this.markets[mIndexFail].status = message;
          }
          this.progress1 <= 1
            ? (this.progress1 += stepValue)
            : (this.progress1 = 1);
        }

        let baseUrl = null;
        if (process.env.PROD) {
          baseUrl = `https://app.woodsland.com.vn:2002/#/Prod-Approved-Plan-By-Factory`;
        } else {
          baseUrl = `http://localhost:5000/#/Prod-Approved-Plan-By-Factory`;
        }

        if (this.factory.code == "TH") {
          let payloadMail = {
            baseUrl: baseUrl,
            email: "mailn@woodsland.com.vn",
            accountId: this.userInfo.id,
            toAccountId: 101682,
            subject: `Có lệnh sản xuất  ${this.soLenh} được tạo`,
            title: "Nhấp vào đây để đi tới phê duyệt",
            dataBody: `Lệnh sản xuất ${this.soLenh} được tạo. Mời bạn vào phê duyệt`,
          };
          
          await this.sendNotificationMail(payloadMail);
        } else {
          let payloadMail = {
            baseUrl: baseUrl,
            email: "vietnq@woodsland.vn",
            accountId: this.userInfo.id,
            toAccountId: 108431,
            subject: `Có lệnh sản xuất  ${this.soLenh} được tạo`,
            title: "Nhấp vào đây để đi tới phê duyệt",
            dataBody: `Lệnh sản xuất ${this.soLenh} được tạo. Mời bạn vào phê duyệt`,
          };

          await this.sendNotificationMail(payloadMail);
        }
        this.showStatus = true;
      } else {
        showNotifyValidate();
      }
      if (this.selection) {
        const payload = {
          number: this.soLenh,
          goodsType: this.goodsType.label,
        };
        await this.$store.dispatch(
          "lenhSanXuats/getLenhSanXuatupdate",
          payload
        );
      }
      const payloaddinhtuyen = {
        lsx: this.soLenh,
        factoryId: this.factory.value,
      };
      await this.$store.dispatch(
        "lenhSanXuats/getLenhSanXuatdinhtuyen",
        payloaddinhtuyen
      );
    },
    waitTime(second) {
      return new Promise((resolve) => setTimeout(resolve, second));
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
          market: e.data.code,
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
    },
  },
  watch: {
    deptSelectedRowKeys(newValue) {
      if (newValue.length > 0) this.thucHienTiep = false;
      else this.thucHienTiep = true;
    },
    soLenh(newValue) {
      newValue = newValue.trim();

      if (newValue && this.soLenhSanXuats.includes(newValue)) {
        this.thutu = this.thutu + 1;
        if (this.thutu < 10) this.thutus = `0${this.thutu}`;
        else this.thutus = this.thutu;
        if (this.week < 10) this.weeks = `0${this.week}`;
        else this.weeks = this.week;
        this.soLenh = `${this.factory.code}${this.year.toString().slice(2, 4)}${this.weeks
          }${this.goodsType.label}-${this.thutus}`;
      }
    },
    week() {
      this.thutu = 1;
      if (this.thutu < 10) this.thutus = `0${this.thutu}`;
      else this.thutus = this.thutu;
      if (this.week < 10) this.weeks = `0${this.week}`;
      else this.weeks = this.week;
      this.soLenh = `${this.factory.code}${this.year.toString().slice(2, 4)}${this.weeks
        }${this.goodsType.label}-${this.thutus}`;
    },
    goodsType() {
      this.thutu = 1;
      if (this.thutu < 10) this.thutus = `0${this.thutu}`;
      else this.thutus = this.thutu;
      if (this.week < 10) this.weeks = `0${this.week}`;
      else this.weeks = this.week;
      this.soLenh = `${this.factory.code}${this.year.toString().slice(2, 4)}${this.weeks
        }${this.goodsType.label}-${this.thutus}`;
    },
    factory(val) {
      this.thutu = 1;
      if (this.thutu < 10) this.thutus = `0${this.thutu}`;
      else this.thutus = this.thutu;
      if (this.week < 10) this.weeks = `0${this.week}`;
      else this.weeks = this.week;
      this.soLenh = `${val.code}${this.year.toString().slice(2, 4)}${this.weeks
        }${this.goodsType.label}-${this.thutus}`;
    },
    // ngayDongGoi(val) {
    //   this.soLenh = `${this.factory.code}${moment(val).format("YY")}-${moment(
    //     val
    //   ).format("w")}`;
    // },
  },
};
</script>
