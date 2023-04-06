<template>
  <q-page>
    
 
        <div  class="row" style="background-color: #daf8e1">
      <div v-if="selectionlsx == 'P'" class="col-6 text-blue text-bold" style="font-size: 18px">
        Phê duyệt LSX khối CBG - <span class="text-amber-14">{{ factory.label }}</span>
      </div>
      <div v-if="selectionlsx == 'P'" class="col-6 text-blue text-bold">
         <q-radio
              v-model="selectionlsx"
              val="T" 
              label="Tạo LSX"
              color="amber-6"
            />
             <q-radio
              v-model="selectionlsx"
              val="P" 
              label="Phê duyệt LSX"
              color="amber-6"
            />
        </div>
    </div>
    <div  v-if="selectionlsx == 'P'" style="padding: 0px" class="text-orange row widget-container">
      <div class="col-12 col-md-2 q-pa-sm">
        <q-select
          color="grey-3"
          label-color="orange"
          filled
          @input="loadData"
          v-model="factory"
          :options="factories1"
          label="Chọn nhà máy"
          dense
        />
      </div>
      <!-- <div class="col-12 col-md-2 q-pa-sm">
          <q-input
            filled
             @input="searchPO"
            label-color="orange"
            v-model.number="week"
            type="number"
            label="Tuần"
               dense
          />
   </div> -->
      <div class="col-12 col-md-2 q-pa-sm">
        <q-input
          filled
          label-color="orange"
          @input="loadData"
          v-model.number="year"
          type="number"
          label="Năm"
          dense
        />
      </div>
      <!-- <div class="col-12 col-md-2 q-pa-sm">
        <q-select
          color="grey-3"
          label-color="orange"
          filled
          @input="searchPO"
          v-model="goodsType"
          :options="goodsTypes"
          label="Chọn dòng sản phẩm"
          dense
        />
      </div> -->

      <div class="col-1 q-pa-sm q-gutter-sm" align="right">
        <q-btn
          v-show="xoa"
          style="font-size: 13px; padding: 3px 0px 3px 0px"
          color="positive"
          label="Phê duyệt"
          @click="guiPheDuyet"
        />
        <q-btn
          v-show="xacnhan"
          style="font-size: 13px; padding: 3px 0px 3px 0px"
          color="positive"
          label="Xác nhận"
          @click="guiPheDuyetSX"
        />
      </div>
      <div class="col-2 q-pa-sm q-gutter-sm" align="left">
        <q-btn
          v-show="xoa"
          style="font-size: 13px; padding: 3px 0px 3px 0px"
          color="red"
          label="Xóa"
          @click="xoaLenhSanXuat"
        />
        <q-btn
          v-show="tuChoi"
          style="font-size: 13px; padding: 3px 0px 3px 0px"
          color="amber"
          label="Từ chối"
          @click="tuChoiLenhSanXuat"
        />
      </div>
    </div>
    <q-card v-if="selectionlsx == 'P'">
      <div v-if="soLenhSX.length > 0">
        <q-card-section v-show="pheduyetkh">
          <div>
            <b class="text-red">Danh sách các LSX chờ PKH xác nhận :</b>
          </div>
          <div class="row">
            <div class="col-3" v-for="(lsx, key) in soLenhSX" :key="key">
              <q-radio
                @input="xachnhanduyetKH()"
                v-model="selection"
                :val="lsx"
                :label="lsx"
                color="teal"
                class="text-weight-bold"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />
      </div>
      <!-- <q-card-section v-else v-show="pheduyetkh">
        <q-banner class="bg-grey-3">
          <template v-slot:avatar>
            <q-icon name="search_off" color="primary" />
          </template>
          Không có lệnh sản xuất cần phê duyệt.
          <template v-slot:action>
            <q-btn
              :to="{ name: 'taoKeHoach' }"
              color="green-10"
              label="Tạo lệnh sản xuất"
            />
          </template>
        </q-banner>
      </q-card-section> -->
      <q-card-section v-if="KHsolenhSX.length > 0">
        <div><b class="text-red">Danh sách các LSX chờ GĐSX xác nhận :</b></div>
        <div class="row">
          <div class="col-3" v-for="(lsx, key) in KHsolenhSX" :key="key">
            <q-radio
              v-show="pheduyetsx"
              @input="xachnhanduyet()"
              v-model="selection"
              :val="lsx"
              :label="lsx"
              color="teal"
              class="text-weight-bold"
            />
            <q-checkbox
              v-show="!pheduyetsx"
              :val="lsx"
              :label="lsx"
              disable
              color="teal"
              class="text-weight-bold"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section v-else>
        <q-banner class="bg-grey-3">
          <template v-slot:avatar>
            <q-icon name="search_off" color="primary" />
          </template>
          Không có lệnh sản xuất cần xác nhận.
        </q-banner>
      </q-card-section>
      <q-card-section>
        <div>
          <b class="text-positive">Danh sách các LSX hiện tại trên chuyền :</b>
        </div>
         <div><b class="text-amber-6"> Lệnh TP </b> </div>
        <div class="row">
        
         
          <div
            class="col-3"
            v-for="(lsx, key) in soLenhSanXuatCons(goodsType)"
            :key="key"
          >
            <q-radio
              @input="xemlsx()"
              :val="lsx.number"
              :label="lsx.number"
              v-model="selection"
              color="teal"
              class="text-weight-bold"
            />
            <!-- hiển thị % tỷ lệ đạt kế hoạch -->
            <!-- <q-badge align="top">{{ lsx.avgTiLeTH }}%</q-badge> -->
          </div>
        </div>
         <div><b class="text-amber-6"> Lệnh BTP </b></div>
        <div class="row">
        
         
          <div
            class="col-3"
            v-for="(lsx, key) in LSXcon"
            :key="key"
          >
            <q-radio
              @input="xemlsx()"
              :val="lsx.number"
              :label="lsx.number"
              v-model="selection"
              color="teal"
              class="text-weight-bold"
            />
            <!-- hiển thị % tỷ lệ đạt kế hoạch -->
            <!-- <q-badge align="top">{{ lsx.avgTiLeTH }}%</q-badge> -->
          </div>
        </div>
          <div><b class="text-amber-6"> Lệnh CLAIM </b></div>
        <div class="row">
        
         
          <div
            class="col-3"
            v-for="(lsx, key) in LSXconCLAIM"
            :key="key"
          >
            <q-radio
              @input="xemlsx()"
              :val="lsx.number"
              :label="lsx.number"
              v-model="selection"
              color="teal"
              class="text-weight-bold"
            />
            <!-- hiển thị % tỷ lệ đạt kế hoạch -->
            <!-- <q-badge align="top">{{ lsx.avgTiLeTH }}%</q-badge> -->
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <DxDataGrid
          id="gridContainer"
          :data-source="getPheDuyets(selection)"
          key-expr="id"
          :word-wrap-enabled="true"
          :hover-state-enabled="true"
          :row-alternation-enabled="true"
          :selection="{ mode: 'single' }"
          @row-updated="rowUpdated"
          @row-updating="rowUpdating"
        >
          <DxColumnChooser :enabled="true" />
          <DxHeaderFilter :visible="true" />
          <DxGroupPanel
            :visible="true"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
          <DxScrolling mode="infinite" />
          <DxGrouping :auto-expand-all="true" />
          <DxEditing :allow-updating="false" mode="cell" />

          <DxColumn
            data-field="itemId"
            caption="ID"
            :allowEditing="false"
            :width="90"
            alignment="center"
          />
          <DxColumn
            data-field="itemName"
            caption="Tên sản phẩm/Cụm/Chi tiết"
            :allowEditing="false"
            width="350"
          />
          <DxColumn
            data-field="thitruong"
            caption="Tên thành phẩm"
            width="350"
            :allowEditing="false"
          />

          <DxColumn
            data-field="stepName"
            caption="Tên tổ"
            :group-index="1"
            :sort-index="1"
            sort-order="desc"
            :allowEditing="false"
          />
          <DxColumn caption="Qui Cách" alignment="center" :allowEditing="false">
            <DxColumn
              caption="Dầy"
              data-field="itemHeight"
              alignment="center"
              width="120"
              :allowEditing="false"
            />
            <DxColumn
              caption="Rộng"
              data-field="itemWidth"
              alignment="center"
              width="120"
              :allowEditing="false"
            />
            <DxColumn
              caption="Dài"
              data-field="itemLength"
              alignment="center"
              width="120"
              :allowEditing="false"
            />
          </DxColumn>
          <DxColumn
            data-field="number"
            caption="Lệnh sản xuất"
            width="150"
            :allowEditing="false"
          />
          <DxColumn
            data-field="keHoach"
            caption="Số lượng theo LSX"
            data-type="number"
            width="150"
            alignment="center"
            :allowEditing="true"
             format="#,##0.##"
          />
          <DxColumn
            data-field="hanMucTon"
            caption="Ton"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
            :visible="false"
          />
          <!-- <DxColumn
            data-field="canThucHien"
            caption="Số lượng cần thực hiện"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="false"
          />
          <DxColumn
            data-field="soLuongUuTien"
            caption="Tồn"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
            :visible="true"
            format="#,##0"
          />
          <DxColumn
            data-field="ys1a"
            caption="YS1A"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
          />
          <DxColumn
            data-field="ys1b"
            caption="YS1B"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
          />
          <DxColumn
            data-field="tb"
            caption="TB"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
          /> -->
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'In KHSX'"
          />
          <DxSearchPanel
            :visible="true"
            :placeholder="'Tìm kiếm'"
            :width="400"
          />
        </DxDataGrid>
        <div class="q-pa-md doc-container" style="margin-top: 30px">
          <div class="row justify-end">
            <div class="col-4 text-center">
              <p v-if="gioKH != ''" style="margin: 0px">
                {{ gioKH }} giờ {{ phutKH }} phút, Ngày {{ ngayKH }} tháng
                {{ thangKH }} năm {{ namKH }}
              </p>
              <b>Phòng KH</b><br />

              <img
                v-if="KHduyet"
                v-bind:src="'/statics/' + KHduyet + '.png'"
                alt="Không có chữ kí số"
                width="180"
                height="auto"
              />
              <br /><br />
              {{ nguoiduyetKH }}
            </div>
            <div class="col-4 text-center">
              {{ gioGDSX }} giờ {{ phutGDSX }} phút, Ngày {{ ngayGDSX }} tháng
              {{ thangGDSX }} năm {{ namGDSX }} <br />
              <b>GĐSX</b><br />

              <img
                v-if="SXduyet"
                v-bind:src="'/statics/' + SXduyet + '.png'"
                alt="Không có chữ kí số"
                width="180"
                height="auto"
              /><br /><br /><br />{{ nguoiduyetSX }}<br /><br />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
     <div  class="row" style="background-color: #daf8e1">
      <div v-if="selectionlsx == 'T'" class="col-6 text-blue text-bold" style="font-size: 18px">
        Tạo LSX khối CBG -
        <span class="text-amber-14">{{ factory.label }}</span>
      </div>
       <div v-if="selectionlsx == 'T'" class="col-6 text-blue text-bold">
         <q-radio
              v-model="selectionlsx"
              val="T" 
              label="Tạo LSX"
              color="amber-6"
            />
             <q-radio
              v-model="selectionlsx"
              val="P" 
              label="Phê duyệt LSX"
              color="amber-6"
            />
        </div>
    </div>
    <div v-if="selectionlsx == 'T'">
      <div class="text-orange row widget-container">
        <div class="col-12 col-md-2 q-pa-sm">
          <q-select color="grey-3" label-color="orange" filled v-model="factory" :options="factories1"
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

        <div v-if="selectionlsx == 'T'" class="col-12 col-md-1 q-pa-sm">
          <q-btn v-if="soLenh" color="positive" label="Tạo LSX" @click="xacNhan" />
        </div>
        <div class="col-12 col-md-2 q-pa-sm">
          <div class="q-gutter-sm text-green-10 text-bold">
            <q-checkbox v-show="true" v-model="selectiontao" label="TẠO LSX BTP" />
          </div>
        </div>
      </div>
    </div>
  
    <div v-if="selectionlsx == 'T'" class="row q-pa-md" style="padding: 0px 16px;">
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
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import {
  showLoadingIos,
  closeLoading,
  getWeekNumber,
  showNotifyValidate,
} from "../ultils";
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxExport,
  DxEditing,
  DxFilterRow,
  DxRequiredRule,
  DxColumnChooser,
  DxHeaderFilter,
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
    DxFilterRow,
    DxRequiredRule,
    DxEditing,
    DxColumnChooser,
    DxHeaderFilter,
    DxGroupPanel,
    DxScrolling,
    DxGrouping,
  },
  data() {
    return {
      ngayDongGoi: moment().format().slice(0, 10),
      dsLSXs: [],
      factories1: null,
      selection: [],
      xoa: false,
      selectionlsx:'T',
      tuChoi: false,
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      isApprove: false,
      isReject: false,
      showStatus: false,
        edit: true,
        week:0,
        selectiontao:false,
      pheduyetsx: true,
      pheduyetkh: true,
         soLenh: "",
      gioGDSX: "",
      phutGDSX: "",
      ngayGDSX: "",
      thangGDSX: "",
      namGDSX: "",
      gioKH: "",
      phutKH: "",
      ngayKH: "",
      thangKH: "",
      hienThiXacNhan: false,
      namKH: "",
       markets: [],
       markets1: [],
      nguoiduyetKH: null,
      nguoiduyetSX: null,
      KHduyet: null,
      SXduyet: null,
      xacnhan: false,
      chuaHoanThanhs: [],
      selection1: [],
      factory: {
        label: "NM Thuận Hưng",
        factoryId: 100000,
        value: "100000",
        code: "TH",
      },
      goodsType: {
        label: "TP",
        value: "TP",
        code: "TP",
      },
      dataFilter: null,
      soLenhSXCon: [],
      LSXcon:[],
      LSXCLAIM:[],
      KHsolenhSX: [],
      soLenhSX: [],
    };
  },
     mounted() {
   

    this.loadMarket();
  },
  computed: {
    ...mapGetters("lenhSanXuats", [
      "lenhSanXuats",
      "keHoachSanXuats",
      "getPheDuyets",
      "soLenhs",
      "soLenhSanXuatCons",
      "soLenhSanXuats",
    ]),
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("prod", ["factories", "goodsTypes"]),
  },
  methods: {
    ...mapActions("lenhSanXuats", [
      "getAllLenhSanXuats",
       "getAllSoLenhSanXuats",
      "getAllSoLenhSanXuatCons",
       "getAllSoLenhSanXuatConsBTP",
       "getAllSoLenhSanXuatConsCLAIM",
      "getLenhSanXuatCapPhois",
      "getsoLenhSanXuatCapPhois",
      "updatePo",
    ]),
    ...mapActions("prod", ["getPermissionInScreen"]),
    ...mapActions("po", [
      "getAllPoApproved",
      "sendApproved",
      "sendApproved2",
      "DELETE_PO",
      "TUCHOI_PO",
    ]),
    ...mapActions("messages", ["sendNotificationMail"]),
    async rowUpdated() {
      console.log("OK");
    },
    async loadPermission() {
      console.log("path", this.$route.path);
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.getPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((el) => {
        if (el.CODE == "approve") {
          this.isApprove = true;
        }
        if (el.CODE == "reject") {
          this.isReject = true;
        }
        if (el.CODE == "insert") {
          this.isInsert = true;
        }
        if (el.CODE == "update") {
          this.isUpdate = true;
        }
        if (el.CODE == "delete") {
          this.isDelete = true;
        }
      });
      console.log("listPermission", this.listPermission);
    },
     closeEvent() {
      this.hienThiXacNhan = false;
    },
      async loadMarket() {
      const data = await this.$store.dispatch(
        "prod/GET_PROD_MARKET",
        this.factory
      );
      this.markets = data.data;

      // this.markets.forEach(m => (m.quantity = 100));
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
     onSelectionChanged({ selectedRowsData }) {
      this.marketSelect = selectedRowsData[0];
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
            email: "huyenhtt@woodsland.vn",
            accountId: this.userInfo.id,
            toAccountId: 101594,
            subject: `Có lệnh sản xuất  ${this.soLenh} được tạo`,
            title: "Nhấp vào đây để đi tới phê duyệt",
            dataBody: `Lệnh sản xuất ${this.soLenh} được tạo. Mời bạn vào phê duyệt`,
          };

          await this.sendNotificationMail(payloadMail);
        } else {
          let payloadMail = {
            baseUrl: baseUrl,
            email: "chinhhd@woodsland.com.vn",
            accountId: this.userInfo.id,
            toAccountId: 101674,
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
      if (this.selectiontao) {
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
     
    //  loadtuan() {
    //   if (this.week < this.tuanht) this.week = this.tuanht
    // },
    //     loadnam() {
    //   if (this.year < this.namht) this.year = this.namht
    // },
    async xachnhanduyet() {
      this.KHduyet = this.getPheDuyets(this.selection)[0].KH_approvedByAccount;
      this.SXduyet = this.getPheDuyets(this.selection)[0].approvedByAccount;
      this.nguoiduyetSX = this.getPheDuyets(this.selection)[0].SXduyet;
      this.nguoiduyetKH = this.getPheDuyets(this.selection)[0].KHduyet;
      this.thangGDSX = "";
      this.ngayGDSX = "";
      this.gioGDSX = "";
      this.phutGDSX = "";
      this.namGDSX = "";
      this.thangKH = "";
      this.ngayKH = "";
      this.gioKH = "";
      this.phutKH = "";
      this.namKH = "";

      this.xoa = false;

      if (this.isUpdate){
        this.xacnhan = true;
        this.tuChoi = true;
      }
    },
    async xachnhanduyetKH() {
      if (this.isApprove) this.xoa = true;
      this.tuChoi = false;
      this.xacnhan = false;
      this.KHduyet = "";
      this.SXduyet = "";
      this.nguoiduyetSX = "";
      this.nguoiduyetKH = "";
      //let month = new Date(this.getPheDuyets(this.selection)[0].approvedAt)
      this.thangGDSX = "";
      this.ngayGDSX = "";
      this.gioGDSX = "";
      this.phutGDSX = "";
      this.namGDSX = "";
      this.thangKH = "";
      this.ngayKH = "";
      this.gioKH = "";
      this.phutKH = "";
      this.namKH = "";
    },
    async xemlsx() {
      console.log("KH:", this.getPheDuyets(this.selection));
      this.KHduyet = this.getPheDuyets(this.selection)[0].KH_approvedByAccount;
      this.SXduyet = this.getPheDuyets(this.selection)[0].approvedByAccount;
      this.nguoiduyetSX = this.getPheDuyets(this.selection)[0].SXduyet;
      this.nguoiduyetKH = this.getPheDuyets(this.selection)[0].KHduyet;
      let month = new Date(this.getPheDuyets(this.selection)[0].approvedAt);
      let monthKH = new Date(
        this.getPheDuyets(this.selection)[0].KH_approvedAt
      );
      this.thangGDSX = month.getMonth() + 1;
      this.gioGDSX = month.getUTCHours();
      this.phutGDSX = month.getUTCMinutes();
      if (this.gioKH + 7 >= 24) {
        this.ngayGDSX = month.getDate();
      } else {
        this.ngayGDSX = month.getDate();
      }

      this.namGDSX = month.getFullYear();
      this.thangKH = monthKH.getMonth() + 1;
      this.gioKH = monthKH.getUTCHours();
      this.phutKH = monthKH.getUTCMinutes();
      if (this.gioKH + 7 >= 24) {
        this.ngayKH = monthKH.getDate() - 1;
      } else {
        this.ngayKH = monthKH.getDate();
      }
      this.namKH = monthKH.getFullYear();
      this.xoa = false;
      this.tuChoi = false;
      this.xacnhan = false;
    },
    async loadData(stepId) {
      this.selection = [];
      let fa = this.factory;
      await this.getAllSoLenhSanXuatCons(fa);
     this.LSXcon =  await this.getAllSoLenhSanXuatConsBTP(fa);
      this.LSXconCLAIM =  await this.getAllSoLenhSanXuatConsCLAIM(fa);
      await this.getLenhSanXuatCapPhois(fa);
      // this.chuaHoanThanhs = this.soLenhSanXuatCons.map((s) => s.number);
      this.loadlSX();
     
    },
    async loadsolenh(stepId) {
      this.selection1 = await this.getsoLenhSanXuatCapPhois(stepId);

      console.log("so lenh", this.selection1.length);
    },
    async loadlSX() {
      const payload = {
        week: this.week,
        year: this.year,
        factoryId: this.factory.factoryId,
      };

      const data = await this.$store.dispatch(
        "prod/GET_LSX_CHUA_DUYET",
        payload
      );
      this.soLenhSX = [];
      this.KHsolenhSX = [];
      data.data.forEach((element) => {
        if (
          element.approvedByAccount == null &&
          element.KH_approvedByAccount == null &&
          element.endPO == 0
        )
          this.soLenhSX.push(element.number);
      });
      data.data.forEach((element1) => {
        if (
          element1.approvedByAccount == null &&
          element1.KH_approvedByAccount &&
          element1.endPO == 0
        )
          this.KHsolenhSX.push(element1.number);
      });
    },
    async searchPO() {
      console.log("searchPO");
      if (this.factory.code == "TH") this.fa = 100000;
      if (this.factory.code == "YS1A") this.fa = 100003;
      if (this.factory.code == "YS1B") this.fa = 100004;
      if (this.factory.code == "TB") this.fa = 100005;
      if (this.factory.code == "QM") this.fa = 102427;
      this.soLenhSXCon = [];
      this.loadlSX();

      // await this.soLenhSanXuatCons.filter((e) => {

      //     if (e.number.slice(-6, -3) == "BTP") {
      //       console.log("e", e);
      //       this.soLenhSXCon.push({
      //         number: e.number,
      //         avgTiLeTH: e.avgTiLeTH,
      //       });
      //     }

      // });
      // console.log("soLenhSXCon", this.getLenhSanXuatCapPhois(stepId));

      // await this.soLenhs.filter((e) => {

      //       this.soLenhSX.push({
      //         number: e,
      //       });

      // });
    },
    async rowUpdating(e) {
      const { newData, oldData } = e;
      const { ys1a, ys1b, tb, soLuongUuTien, factor, keHoach } = newData;
      const soLuongUuTienC = oldData.soLuongUuTien;
      const ys1aC = oldData.ys1a;
      const ys1bC = oldData.ys1b;
      const tbC = oldData.tb;
      if (ys1a !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} nhập về: ${ys1a}`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, ys1aC },
            });
            console.log(ketqua);
            const { factoryId } = this.factory;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.factory;
            this.loadData({ factoryId });
          });
      if (ys1b !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} nhập về: ${ys1b}`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, ys1bC },
            });
            console.log(ketqua);
            const { factoryId } = this.factory;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.factory;
            this.loadData({ factoryId });
          });
      if (tb !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} nhập về: ${tb}`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, tbC },
            });
            console.log(ketqua);
            const { factoryId } = this.factory;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.factory;
            this.loadData({ factoryId });
          });
      if (soLuongUuTien !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} nhập về: ${soLuongUuTien}`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, soLuongUuTienC },
            });
            console.log(ketqua);
            const { factoryId } = this.factory;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.factory;
            this.loadData({ factoryId });
          });
      if (keHoach !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} kế hoạch: ${keHoach}`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: newData,
            });
            console.log(ketqua);
            const { factoryId } = this.factory;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.factory;
            this.loadData({ factoryId });
          });
      if (factor !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} hệ số phôi: ${factor}`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: newData,
            });
            console.log(ketqua);
            const { factoryId } = this.factory;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.factory;
            this.loadData({ factoryId });
          });
    },
    
    xoaLenhSanXuat() {
      console.log("chao");
      this.$q
        .dialog({
          title: "Xóa kế hoạch sản xuất",
          message: `<em>Bạn có muốn xóa LSX:</em><br /> <strong class="text-red">${this.selection}</strong>`,
          cancel: true,
           ok: {
            color: "positive"
          },
          cancel: {
            color: "negative",
          },
          persistent: true,
          html: true,
        })
        .onOk(async () => {
          await this.DELETE_PO({
            factoryId: this.factory.factoryId,
            number: this.selection,
          });

          // return;
          setTimeout(async () => {
            await this.loadData({ factoryId: this.factory.factoryId });
          }, 500);
          // await this.loadsolenh({ factoryId: this.factory.factoryId });
        });
    },
    tuChoiLenhSanXuat() {
      this.$q
        .dialog({
          title: "Từ chối kế hoạch sản xuất",
          message: `<em>Bạn có muốn từ chối LSX:</em><br /> <strong class="text-red">${this.selection}</strong>`,
          cancel: true,
          persistent: true,
          html: true,
        })
        .onOk(async () => {
          await this.TUCHOI_PO({
            factoryId: this.factory.factoryId,
            number: this.selection,
          });
          this.xacnhan = false;
          this.tuChoi = false;
          setTimeout(async () => {
            await this.loadData({ factoryId: this.factory.factoryId });
          }, 500);
        });
    },
    guiPheDuyet() {
      this.$q
        .dialog({
          title: "Phê duyệt lệnh sản xuất",
          message: `<em>Bạn có muốn phê duyệt lệnh sản xuất:</em><br /> <strong class="text-positive">${this.selection}</strong>`,
          ok: {
            color: "positive"
          },
          cancel: {
            color: "negative",
          },
          persistent: true,
          html: true,
        })
        .onOk(() => {
          console.log("lenh:", this.selection);
          this.sendApproved({
            accountId: this.userInfo.id,
            poIds: this.selection,
          });
          if (this.factory.code == "TH") {
            this.sendMailPheDuyet("duyhungwl@gmail.com", 100374);
          } else if (this.factory.code == "YS1") {
            this.sendMailPheDuyet("khanhlq@woodsland.com.vn", 101863);
          } else {
            this.sendMailPheDuyet("ducdai.gbb@gmail.com", 101931);
          }
          this.sendMailPheDuyet("hientv@woodsland.com.vn", 101733);
          this.loadData({ factoryId: this.factory.factoryId });
        });
    },
    // }
    async sendMailPheDuyet(mail, accountId) {
      let baseUrl = null;
      if (process.env.PROD) {
        baseUrl = `https://app.woodsland.com.vn:2002/#/Prod-Approved-Plan-By-Factory`;
      } else {
        baseUrl = `http://localhost:5000/#/Prod-Approved-Plan-By-Factory`;
      }
      let payloadMail = {
        baseUrl: baseUrl,
        email: mail,
        accountId: this.userInfo.id,
        toAccountId: accountId,
        subject: `Có lệnh sản xuất  ${this.selection} được tạo`,
        title: "Nhấp vào đây để đi tới phê duyệt",
        dataBody: `Lệnh sản xuất ${this.selection} được tạo. Mời bạn vào phê duyệt`,
      };
      await this.sendNotificationMail(payloadMail);
    },
    async sendMailPheDuyetToVT(mail, accountId) {
      let baseUrl = null;
      if (process.env.PROD) {
        baseUrl = `https://app.woodsland.com.vn:2002/#/view-lsx-cbg/${this.selection}`;
      } else {
        baseUrl = `http://localhost:5000/#/view-lsx-cbg/${this.selection}`;
      }
      let payloadMail = {
        baseUrl: baseUrl,
        email: mail,
        accountId: this.userInfo.id,
        toAccountId: accountId,
        subject: `Có lệnh sản xuất mới: ${this.selection} vừa được duyệt`,
        title: "Mời bạn vào đây để xem chi tiết và cấp vật tư, phụ kiện",
        dataBody: ``,
      };
      await this.sendNotificationMail(payloadMail);
    },
    guiPheDuyetSX() {
      this.$q
        .dialog({
          title: "Xác nhận lệnh sản xuất",
          message: `<em>Bạn có muốn xác nhận lệnh sản xuất vào xưởng:</em><br /> <strong class="text-primary">${this.selection}</strong>`,
          cancel: true,
          persistent: true,
          html: true,
        })
        .onOk(() => {
          console.log("lenh:", this.selection);
          this.sendApproved2({
            accountId: this.userInfo.id,
            poIds: this.selection,
          });
          this.sendMailPheDuyetToVT("toanvv@woodsland.com.vn", 101720);
          this.sendMailPheDuyetToVT("diuht@woodsland.com.vn", 101723);
          this.sendMailPheDuyetToVT("vantt@woodsland.com.vn", 101708);
          this.sendMailPheDuyetToVT("ndlinh@woodsland.vn", 101719);
          this.sendMailPheDuyetToVT("pur03@woodsland.com.vn", 101757);
          this.sendMailPheDuyetToVT("huyenntt@woodsland.vn", 107090);
          this.sendMailPheDuyetToVT("tuantt@woodsland.com.vn", 101651);
          this.sendMailPheDuyetToVT("vannt@woodsland.vn", 108430);
          this.sendMailPheDuyetToVT("thaontt.wl@gmail.com", 101734);
          this.sendMailPheDuyetToVT("hoant@woodsland.vn", 108677);
          this.sendMailPheDuyetToVT("xuannt@woodsland.com.vn", 108777);
          if (this.factory.code == "TB") {
            this.sendMailPheDuyetToVT("ducdai.gbb@gmail.com", 101931);
            this.sendMailPheDuyetToVT("nguyenvanchungtq2016@gmail.com", 101932);
            this.sendMailPheDuyetToVT("nguyenvanhungtq1979@gmail.com", 101944);
            this.sendMailPheDuyetToVT("ngocntb.woodsland@gmail.com", 101783);
            //this.sendMailPheDuyetToVT("thaontt.wl@gmail.com", 101734);
            this.sendMailPheDuyetToVT("huongpt@woodsland.vn", 103460);
            this.sendMailPheDuyetToVT("maiph@woodsland.vn", 101966);
            this.sendMailPheDuyetToVT("hientv@woodsland.com.vn", 101733);
            this.sendMailPheDuyetToVT("thudat.vn@gmail.com", 105353);
            this.sendMailPheDuyetToVT("tavanphuong1996@gmail.com", 101750);
            this.sendMailPheDuyetToVT("ngandt@woodsland.com.vn", 101771);
            this.sendMailPheDuyetToVT("thanhlientq@gmail.com", 102047);
            this.sendMailPheDuyetToVT("huongnguyendtkt@gmail.com", 101736);
            this.sendMailPheDuyetToVT("thuyhtm@woodsland.vn", 107887);
         
          }
          if (this.factory.code == "TH") {
            this.sendMailPheDuyetToVT("duyhungwl@gmail.com", 100374);
            this.sendMailPheDuyetToVT("letrungkien.huong@gmail.com", 100291);
            this.sendMailPheDuyetToVT("hquanvp@gmail.com", 100355);
            this.sendMailPheDuyetToVT("halewl.90@gmail.com", 101633);
            this.sendMailPheDuyetToVT("kiemspwl@gmail.com", 101587);
            this.sendMailPheDuyetToVT("dungwl13@gmail.com", 100304);
            this.sendMailPheDuyetToVT("tavanphuong1996@gmail.com", 101750);
            this.sendMailPheDuyetToVT("ngocntb.woodsland@gmail.com", 101783);
            this.sendMailPheDuyetToVT("hienttt@woodsland.com.vn", 101672);
            this.sendMailPheDuyetToVT("quocduy1708@gmail.com", 101662);
            this.sendMailPheDuyetToVT("hientv@woodsland.com.vn", 101733);
            this.sendMailPheDuyetToVT("truongthihongwl@gmail.com", 101597);
            //this.sendMailPheDuyetToVT("thaontt.wl@gmail.com", 101734);
            this.sendMailPheDuyetToVT("huongnguyendtkt@gmail.com", 101736);
            this.sendMailPheDuyetToVT("thanhpt.woodsland@gmail.com", 102050);
            this.sendMailPheDuyetToVT("thutrang986@gmail.com", 101641);
            this.sendMailPheDuyetToVT("thuyhtm@woodsland.vn", 107887);
            this.sendMailPheDuyetToVT("phungquyen1307@gmail.com", 102556);
            
          }
          if(this.factory.code == "YS1"){
            this.sendMailPheDuyetToVT("nguyenhanly09@gmail.com", 101866);
             this.sendMailPheDuyetToVT("thuyhtm@woodsland.vn", 107887);
              this.sendMailPheDuyetToVT("vietnq@woodsland.vn", 108431);
              this.sendMailPheDuyetToVT("lathikimhoan.hus.bg@gmail.com", 101975);
           this.sendMailPheDuyetToVT("nguyenminhtq01071983@gmail.com", 101881);   
           this.sendMailPheDuyetToVT("Dung.wltq@gmail.com", 101907);   
          }
          // if(this.factory.code == "QM"){
          //   this.sendMailPheDuyetToVT("duyhungwl@gmail.com", 100374);
          //   this.sendMailPheDuyetToVT("tavanphuong1996@gmail.com", 101750);
          //   this.sendMailPheDuyetToVT("thuongnguyenngoc83@gmail.com", 101795);
          //   this.sendMailPheDuyetToVT("vanluong1178@gmail.com", 101814);
          //   this.sendMailPheDuyetToVT("Chientn@woodsland.com.vn", 101821);
          //   this.sendMailPheDuyetToVT("thinq.woodsland@gmail.com", 101684);
          //   this.sendMailPheDuyetToVT("Toanvv@woodsland.com", 101720);
          //   this.sendMailPheDuyetToVT("Phothisaotk@gmail.com", 101800);
          //   this.sendMailPheDuyetToVT("bachhoangdo@gmail.com", 102011	);
          //   this.sendMailPheDuyetToVT("bichphuongwl@gmail.com", 101750);
          //   this.sendMailPheDuyetToVT("Ngoduythanhtp@gmail.com", 102007);
          //   this.sendMailPheDuyetToVT("mailn@woodsland.com.vn", 101682);
          //   this.sendMailPheDuyetToVT("gt.vuthihue88@gmail.com", 101851	);
          //   this.sendMailPheDuyetToVT("guitarist.duykhanh@gmail.com", 102016);
          //   this.sendMailPheDuyetToVT("Linhtt.woodsland@gmail.com", 101784);
          //   this.sendMailPheDuyetToVT("thuyhtm@woodsland.vn", 107887);
          // }
          this.loadData({ factoryId: this.factory.factoryId });
        });
    },
    // }
  },
  async created() {
    this.loadPermission();
    const today = new Date();
    this.week = getWeekNumber(today);
    const currentYear = today.getFullYear();
    this.year = currentYear;
    this.factories1 = this.userInfo.role.types[0].value
      .filter((s) => s.type2 === "nhaMay" && s.parentId === 102299)
      .map((o) => ({
        label: o.name,
        code: o.code,
        factoryId: o.factory,
        value: o.factory,
      }));

    this.factory = this.factories1[0];

    const { factoryId } = this.factory;

    await this.loadData({ factoryId });
    await this.loadsolenh({ factoryId });
    this.loadlSX();
    this.searchPO();
    console.log("this.factory", this.factory);
    console.log("this.goodsType.label", this.goodsType.label);
    console.log("soLenhSX", this.soLenhSX);
    //console.log("this.solenh", this.soLenhSanXuatCons(goodsType));
    // this.soLenhSanXuatCons.filter( (e) => {
    //    console.log("e", e);
    //     if (e.number.slice(-6, -3) == "TH") {
        
    //        this.soLenhSXCon.push({
    //         number: e.number,
    //         avgTiLeTH: e.avgTiLeTH,
    //       });
    //     }
    // });
    //   } else if (this.goodsType.label === "Vanity") {
    //     if (e.number.slice(0, 2) == "PO") {
    //       await this.soLenhSXCon.push({
    //         number: e.number,
    //         avgTiLeTH: e.avgTiLeTH,
    //       });
    //     }
    //   }
    // });

    // this.soLenhs.filter(async (e) => {
    //   if (this.goodsType.label === "Indoor") {
    //     if (e.slice(0, 2) == "TH") {
    //       console.log("e", e);
    //       await this.soLenhSX.push({
    //         number: e,
    //       });
    //     }
    //   } else if (this.goodsType.label === "Vanity") {

    //     if (e.slice(0, 2) == "PO") {
    //       console.log("e", e);
    //       await this.soLenhSX.push({
    //         number: e,
    //       });
    //     }
    //   }
    // });
  },
  // mounted() {
  //   if (this.userInfo.id === 100400) {
  //     this.factory = this.factories[0];
  //     this.factories1 = this.factories;
  //   } else if (this.userInfo.id === 101967) {
  //     this.factories1 = this.factories.find((nm) => nm.factoryId === 100005);
  //     this.factory = this.factories1;
  //   }

  // },
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
<style>
#gridContainer {
  height: 700px;
}
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  font-weight: 500;
  background-color: white;
  width: 280;
}
</style>