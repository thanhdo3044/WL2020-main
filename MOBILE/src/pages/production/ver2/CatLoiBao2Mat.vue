<template>
  <q-page class="q-pa-md bg-blue-grey-7">
    <app-bar class="text-white">Ghi nhận số lượng hạ cấp</app-bar>
    <!-- <div class="row justify-center">
      <div class="page-title">
        <div class="col-auto text-white" style="font-size: 20px;font-weight:bold">
          Ghi nhận số lượng hạ cấp
        </div>
        <hr width="50%" />
      </div>
    </div> -->
    <div class="row">
      <div class="col-6 q-pa-sm">
      <q-btn
      v-show="showListPackage"
      align="around"
      @click="showDialogErr"
      class="width = 80 q-mb-sm bg-green text-white"
      label="Phôi  nhận về"
      
    />
      </div>
     <div class="col-6 q-pa-sm">
        <q-btn
          v-show="xuatphoi"
          align="around"
          @click="showphoixuat"
          class="width = 80 q-mb-sm bg-orange text-white"
          style="font-family: 'Time New Roman'; font-size: 14px"
          label="Phôi đã xuất"
        />
      </div>
         </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          v-model="congdoan"
          @input="chonCongdoan"
          :options="congdoans"
          label-color="amber"
          style="font-family: 'Time New Roman'; font-size: 14px;font-style: italic;"
          label="Công đoạn làm việc"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          v-model="nhapXuat"
          @input="chonCongdoan"
          :options="nhapXuats"
          readonly
          label-color="amber"
          style="font-family: 'Time New Roman'; font-size: 14px;font-style: italic;"
          label="Loại phôi xử lý"
        />
      </div>
    </div>
  
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          clearable
          @input="chonItem"
          use-input
          input-debounce="0"
          label-color="amber"
          style="font-family: 'Time New Roman'; font-size: 14px;font-style: italic;"
          v-model="item"
          :options="items"
          @filter="searchItem"
          :label="qctruoc"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-input
        dark
          v-model="quantity"
          label-color="amber"
          style="font-family: 'Time New Roman'; font-size: 14px;font-style: italic;"
          :label="sltruoc"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          clearable
          use-input
          input-debounce="0"
          @filter="searchItem2"
          @input="chonItem2"
          label-color="amber"
          style="font-family: 'Time New Roman'; font-size: 14px;font-style: italic;"
          v-model="item2"
          :options="items2"
          :label="qcsau"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-input
        dark
          v-model="quantity2"
          @input="checksl"
          label-color="amber"
          style="font-family: 'Time New Roman'; font-size: 14px;font-style: italic;"
          :label="slsau"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          v-model="congDoanNhan"
          :options="congDoanNhans"
          @input="nhanphoihacap"
          label-color="amber"
          style="font-family: 'Time New Roman'; font-size: 14px;font-style: italic;"
          label="Công đoạn nhận"
        />
      </div>
    </div>
     <q-btn
      v-if="item"
      align="around"
      @click="them"
      style="font-size: 10px"
      class="width = 60 q-mb-sm bg-primary text-white"
      label="Xác nhận và thêm QC sau lựa"
    />

    <div
      v-if="qccatve.length > 0"
      class="row"
      style="border: 1px solid black; padding: 5px"
    >
      <div v-for="(cat, index) in qccatve" :key="index" class="col-12">
        <div class="row">
          <div v-if="index == 0" class="col-6 header">Quy cách hạ cấp</div>
          <div v-if="index == 0" class="col-4 header">Số lượng</div>
          <div v-if="index == 0" class="col-2 header">Xóa</div>
          <div class="col-6 columnTable">
            {{ cat.height }}x{{ cat.width }}x{{ cat.length }}
          </div>
          <div class="col-4 columnTable">{{ cat.soluong }}</div>
          <div class="col-2 columnTable">
            <q-btn @click="deleteQCSauLua(cat)" color="red" label="X" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-input
        dark
          v-model="quantityKL"
          label-color="red"
          style="font-family: 'Time New Roman'; font-size: 14px"
          label="khối lượng site hạ cấp"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          v-model="congDoanNhanHC"
          :options="congDoanNhanHCs"
          label-color="red"
          style="font-family: 'Time New Roman'; font-size: 14px"
          label="Công đoạn nhận phôi VGT"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12" align="center">
        <q-btn color="primary" label="Ghi nhận" @click="onClick" />
      </div>
    </div>
    <q-dialog v-model="dialogErr">
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Danh sách lỗi công đoạn chờ nhận <br /></div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list separator>
            <q-item
              class="q-mt-sm bg-cyan-1 shadow-8 text-black"
              v-for="(item, index) in listPackage"
              :key="index"
            >
              <q-item-section>
                <div>
                  Chi tiết/cụm : <b>{{ item.Chi_tiet_cum }}</b>
                </div>
                <div>
                  Số lượng : <b>{{ item.So_luong }}</b>
                </div>
                <div>
                  Loại lỗi : <b>{{ item.Loai_loi }}</b>
                </div>
                <div>
                  Biện pháp xử lý : <b>{{ item.BP_xu_ly }}</b>
                </div>
                <div>
                  Người tạo : <b>{{ item.Nguoi_tao }}</b>
                </div>
                <div>
                  Ngày tạo : <b>{{ moment(item.Ngay_tao).format("l") }}</b>
                </div>
                <br />
              </q-item-section>
              <q-item-section side>
                <q-icon
                  style="padding: 8px; border-radius: 50%; font-size: 20px"
                  @click="confirmloi(item)"
                  class="bg-red shadow-6"
                  push
                  round
                  dense
                  :name="iconfasCheckCircle"
                  color="white"
                  label="ghi nhận"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
     <q-dialog v-model="dialogErr1">
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Danh sách phôi đã giao <br /></div>
        </q-card-section>
        <q-input filled dense label="Từ ngày" v-model="from">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon
              v-if="from"
              @click="from = ''"
              name="close"
              class="cursor-pointer"
            />
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="from" @input="showphoixuat()">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>

                <!-- <div class="q-pb-sm">Model: {{ model }}</div> -->
                <!-- <q-date v-model="model" range  @input="loadData(step)"/> -->
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input filled dense label="Đến ngày" v-model="to">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon
              v-if="to"
              @click="to = ''"
              name="close"
              class="cursor-pointer"
            />
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="to" @input="showphoixuat()">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-card-section class="q-pt-none">
          <q-list separator>
            <q-item
              class="q-mt-sm bg-cyan-1 shadow-8 text-black"
              v-for="(item, index) in luadat"
              :key="index"
            >
              <q-item-section>
              
                  <div class="text-subtitle2 sub-receipt">
                    {{ item.NAME }} ({{ item.HEIGHT }}*{{ item.WIDTH }}*{{
                      item.LENGTH
                    }})
            

                  <q-input
                    v-model.number="item.QUANTITY"
                    :readonly="true"
                    type="number"
                    label="Số lượng phôi"
                  />
                </div>

                <div>
                  Người giao :
                  <b>{{ getAccountById(item.CREATE_BY) | FullName }}</b>
                </div>
                <q-item-label style="color: purple; font-weight: bold">
                  Ngày giao :{{
                    item.CREATE_DATE.substring(0, 16).replace("T", " ")
                  }}
                </q-item-label>
                <hr />

                <div>
                  Người nhận :
                  <b>{{ getAccountById(item.VERIFY_BY) | FullName }}</b>
                </div>
                <q-item-label style="color: purple; font-weight: bold">
                  Ngày nhận :
                  <b v-if="item.VERIFY_DATE">
                    {{ moment(item.VERIFY_DATE).format("l") }}
                  </b>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="loi" transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal-6 text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Xác nhận</div>
        </q-card-section>

        <q-card-section
          class="q-pt-none"
          style="color: orange; font-size: 20px; font-weight: bold"
        >
          Bạn đã chắc chắn nhận số lượng: <b> {{ slnew }} </b>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            flat
            label="Xác nhận"
            @click="activeSuccessloi"
            v-close-popup
          />
          <q-btn flat label="Thoát" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { showNotifySuccess } from "../../../utils/utils";
import AppBar from "../../../components/AppBar";
import { fasCheck } from "@quasar/extras/fontawesome-v5";
import moment from "moment";
export default {
  components: {
    "app-bar": AppBar,
  },
  data() {
    return {
      congdoan: null,
      congdoans: [],
      congDoanNhan: null,
      congDoanNhanHC: null,
      congDoanNhans: [],
      congDoanNhanHCs: [],
      iconfasCheckCircle: fasCheck,
      dialogErr: false,
      loi: false,
      slnew: 0,
       from: null,
       to: null,
      xuatphoi:false,
      qctruoc:null,
      sltruoc:null,
      qcsau:null,
      slsau:null,
      fa: null,
      items: [],
     qccatve: [],
      listPackage: [],
      showListPackage: false,
      items2: [],
      item: null,
      luadat:[],
      item2: null,
      priceCode: null,
      itemDupplicate: [],
      quantity: null,
      quantity2: null,
      quantityKL: null,
      tonkho: null,
      dialogErr1:false,
      thuchien: null,
      nhapXuat: {
   label: "Cắt hạ cấp",
          value: "loi-cat-ha-cap",
      },
      card: false,
      nhapXuats: [
        {
          label: "Cắt hạ cấp",
          value: "loi-cat-ha-cap",
        },
         {
          label: "Bào hạ cấp",
          value: "loi-bao-ha-cap",
        },
      ],
    };
  },
  async created() {
     this.from = moment().format("YYYY-MM-DD");
    this.to = moment().format("YYYY-MM-DD");
    this.$store.getters["base/mySources"].forEach((s) => {
      this.congdoans.push({
        id: s.id,
        label: `[${s.code}] - ${s.name}`,
        factoryId: s.factoryId,
        CODE:s.code,
      });
    });
    if (this.nhapXuat.value =='loi-cat-ha-cap') {
      this.qctruoc = 'Quy cách trước khi cắt'
      this.sltruoc = 'Số lượng thanh trước khi cắt'
      this.qcsau = 'Quy cách sau khi cắt'
      this.slsau = 'Số lượng thanh sau khi cắt'
    } 
    else {
           this.qctruoc = 'Quy cách trước khi bào'
      this.sltruoc = 'Số lượng thanh trước khi bào'
      this.qcsau = 'Quy cách sau khi bào'
      this.slsau = 'Số lượng thanh sau khi bào'
    }
    await this.loadItem();
    this.aardestinations = await this.$store.dispatch("base/getAllCongDoans");
    // this.loadListPackage();
  },
  computed: {
    ...mapGetters("base", ["userInfo"], "congDoans"),
    ...mapGetters("orders", ["getAccountById"]),
  },
  methods: {
    ...mapActions("production", [
      "getItemLoi",
      "getItemGoTho",
      "getTonGoTho",
      "getListPackage",
      "getActivePackage",
      "getKeHoachGoTho",
      "insertXuatGoCatHaCap",
      "getDepartmentVGT",
    ]),
    // async loadDepartmentVGT() {
    //   this.congDoanNhans = [];
    //   const data = await this.getDepartmentVGT();
    //   data.forEach((el) => {
    //     this.congDoanNhans.push({
    //       label: el.NAME,
    //       value: el.ID,
    //     });
    //   });
    // },
    async loadItem() {
      const data2 = await this.$store.dispatch(
        "production/ACTION_FETCH_ITEMS",
        {
          factoryId: 100000,
        }
      );
      data2.forEach((d) => {
        const itemNameConvert = `[${d.code}] ${d.name} (${d.height}*${d.width}*${d.length})`;
        this.items2.push({
          label: itemNameConvert,
          value: d.id,
          unit: d.unit,
          height: d.height,
          width: d.width,
          length: d.length,
          volumn: d.volumn,
        });
      });
      this.itemDupplicate2 = this.items2;
    },
       async checksl() {
      if (
        this.quantity2 * this.item2.volumn >
        this.quantity * this.item.volumn
      ) {
        this.$q.dialog({
          title: "Lỗi",
          message: "Bạn nhập quá khối lượng trước khi hạ cấp!",
        });
        this.quantity2 = null;
      }
    },
        async showphoixuat() {
        this.luadat = []
      this.dialogErr1 = true;
    
      let payload = {
        factoryId: this.congdoan.factoryId,
        sourceId: this.congdoan.id,
        from: moment(`${this.from} 01:00:00`).format("YYYY-MM-DD hh:mm:ss"),
        to: moment(`${this.to} 01:00:00`).add(1, 'days').format("YYYY-MM-DD hh:mm:ss"),
      };
      const data2 = await this.$store.dispatch(
        "production/GET_XUAT_HA_CAP",
        payload
      );
      this.luadat = data2.data;
      // this.xuatlistluadat = await this.getListPackagexuatluadat(payload);
      // this.xuatlistluadat.forEach((d) => {
      //   this.lua = [];
      //   this.lua = this.slluadat.filter((el) => el.BAO_ID == d.ID);
      //   this.luadat.push({
      //     ID: d.ID,
      //     SOURCE_ID: d.SOURCE_ID,
      //     DESTINATION_ID: d.DESTINATION_ID,
      //     createdAt: d.createdAt,
      //     createdby: d.createdby,
      //     approvedAt: d.approvedAt,
      //     approvedByAccount: d.approvedByAccount,
      //     SL: this.lua,
      //   });
      // });
      
    },
      deleteQCSauLua(row) {
      this.qccatve = this.qccatve.filter((q) => q.quycach != row.quycach);
    },
     async them() {
      this.khoiluongthem = 0;
      if (this.quantity2) {
        if (this.qccatve.length > 0) {
          this.qccatve.forEach((d) => {
            this.khoiluongthem += d.soluong * d.volumn;
          });
        }
        if (this.khoiluongthem > this.item.volumn * this.quantity) {
          this.$q.dialog({
            title: "Lỗi",
            message:
              "Tổng khối lượng lựa đạt lớn hơn khối lượng trước khi lựa!",
          });
        } else {
        //  this.loadMaPrice(this.item2.height, this.item2.width);
          this.qccatve.push({
            quycach: this.item2.value,
            soluong: this.quantity2,
            height: this.item2.height,
            width: this.item2.width,
            length: this.item2.length,
            volumn: this.item2.volumn,
            PRICE_CODE:this.priceCode,
          });
          this.item2 = null;
          this.quantity2 = null;
        }
      } else {
        this.$q.dialog({
          title: "Lỗi",
          message: "Vui lòng nhập số lượng sau lựa!",
        });
      }
    },
    async confirmloi(data) {
      this.dataPackageloi = data;
      this.slnew = this.dataPackageloi.So_luong;
      this.loi = true;
    },
    async activeSuccessloi() {
      let payload = {
        id: this.dataPackageloi.ID,
        verifyBy: this.userInfo.id,
      };
      let data = await this.getActivePackage(payload);

      await this.loadListPackage();
    },
    async loadListPackage() {
      let payload = {
        factoryId: this.congdoan.factoryId,
        DESTINATION_ID: this.congdoan.id,
      };
      this.listPackage = await this.getListPackage(payload);

      if (this.listPackage.length > 0) this.showListPackage = true;
      else this.showListPackage = false;
    },
    async showDialogErr() {
      console.log("listPackage");
      await this.loadListPackage();
      if (this.listPackage.length > 0) this.dialogErr = true;
    },

    async chonCongdoan() {
      this.xuatphoi = true
      if (this.congdoan.CODE.indexOf("BHC")>-1) {
         this.nhapXuat = {
   label: "Bào hạ cấp",
          value: "loi-bao-ha-cap",
      }
      }
       if (this.congdoan.CODE.indexOf("CHC")>-1) {
         this.nhapXuat = {
   label: "Cắt hạ cấp",
          value: "loi-cat-ha-cap",
      }
      }
         if (this.nhapXuat.value =='loi-cat-ha-cap') {
      this.qctruoc = 'Quy cách trước khi cắt'
      this.sltruoc = 'Số lượng thanh trước khi cắt'
      this.qcsau = 'Quy cách sau khi cắt'
      this.slsau = 'Số lượng thanh sau khi cắt'
    } 
    else {
           this.qctruoc = 'Quy cách trước khi bào'
      this.sltruoc = 'Số lượng thanh trước khi bào'
      this.qcsau = 'Quy cách sau khi bào'
      this.slsau = 'Số lượng thanh sau khi bào'
    }
      this.showListPackage = false;
      let destinations = [];
      if (this.nhapXuat.value == "loi-cat-ha-cap") {
        this.loadListPackage();
        if (this.congdoan.factoryId == 102339) {
          destinations = this.aardestinations.filter(
            (o) =>
              (o.factoryId == this.congdoan.factoryId ||
                o.factoryId == 102340) &&
              o.TYPE2 == "to" && (o.CODE.indexOf("TC")>-1 || o.CODE.indexOf("SC")>-1)
          );
          destinations.map((element) => {
            element.label = element.NAME;
            element.id = element.ID;
            element.factoryId = element.factoryId;
          });
        } else {
          destinations = this.aardestinations.filter(
            (o) => o.factoryId == this.congdoan.factoryId && o.TYPE2 == "to" && (o.CODE.indexOf("TC")>-1 || o.CODE.indexOf("SC")>-1)
          );
          destinations.map((element) => {
            element.label = element.NAME;
            element.id = element.ID;
            element.factoryId = element.factoryId;
          });
        }
        this.congDoanNhans = destinations;

        this.congDoanNhan = {
          label: this.congDoanNhans[0].label,
          id: this.congDoanNhans[0].id,
        };
      }
       if (this.nhapXuat.value == "loi-bao-ha-cap") {
        this.loadListPackage();
        if (this.congdoan.factoryId == 102339) {
          destinations = this.aardestinations.filter(
            (o) =>
              (o.factoryId == this.congdoan.factoryId ||
                o.factoryId == 102340) &&
              o.TYPE2 == "to" && (o.CODE.indexOf("TC")>-1)
          );
          destinations.map((element) => {
            element.label = element.NAME;
            element.id = element.ID;
            element.factoryId = element.factoryId;
          });
        } else {
          destinations = this.aardestinations.filter(
            (o) => o.factoryId == this.congdoan.factoryId && o.TYPE2 == "to" && (o.CODE.indexOf("TC")>-1 || o.CODE.indexOf("SC")>-1)
          );
          destinations.map((element) => {
            element.label = element.NAME;
            element.id = element.ID;
            element.factoryId = element.factoryId;
          });
        }
        this.congDoanNhans = destinations;

        this.congDoanNhan = {
          label: this.congDoanNhans[0].label,
          id: this.congDoanNhans[0].id,
        };
      }

      // if (
      //   this.congdoan.factoryId == 102339 &&
      //   this.nhapXuat.value == "xuat-cat-ha-cap"
      // ) {
      //   this.congDoanNhans = [
      //     {
      //       label: "Kho lựa đạt (YS1A)",
      //       id: 102487,
      //     },
      //   ];
      //   this.congDoanNhan = {
      //     label: "Kho sau 2M (YS1A)",
      //     id: 102487,
      //   };
      //   this.congDoanNhanHC = {
      //     label: "VGT (YS1A)",
      //     id: 102353,
      //   };
      // }
      // if (
      //   this.congdoan.factoryId == 102366 &&
      //   this.nhapXuat.value == "xuat-cat-ha-cap"
      // ) {
      //   this.congDoanNhans = [
      //     {
      //       label: "Kho sau 2M (TB)",
      //       id: 102495,
      //     },
      //   ];
      //   this.congDoanNhan = {
      //     label: "Kho sau 2M (TB)",
      //     id: 102495,
      //   };
      //   this.congDoanNhanHC = {
      //     label: "VGT (TB)",
      //     id: 102374,
      //   };
      // }
      if (this.congdoan.factoryId == 102339) {
        this.congDoanNhanHC = {
          label: "3.Tổ VGT Nội địa",
          id: 102804,
        };
      }
      if (this.congdoan.factoryId == 102340) {
        this.congDoanNhanHC = {
          label: "3.Tổ sơ chế",
          id: 102355,
        };
         this.congDoanNhanHCs = [ {
            label: "3.Tổ VGT Nội địa",
          id: 102804,
        },
         {
            label: "3.Tổ sơ chế X5",
          id: 102355,
        },
          {
            label: "3.Tổ sơ chế X3",
          id: 102353,
        },
        ]
      }
         if (this.congdoan.factoryId == 102366) {
        this.congDoanNhanHC = {
          label: "2.Tổ Lựa phôi ghép",
          id: 102370,
        };
        this.congDoanNhanHCs = [ {
          label: "2.Tổ Lựa phôi ghép",
          id: 102370,
        },
         {
          label: "3.Tổ VGT Nội địa",
          id: 102374,
        },
        ]
      }
      this.items = [];
      const data = await this.getItemLoi(this.congdoan.id);
      data.forEach((d) => {
        const itemNameConvert = `[${d.HEIGHT}x${d.WIDTH}x${d.LENGTH}] ${d.NAME} (${d.HEIGHT}*${d.WIDTH}*${d.LENGTH})`;
        this.items.push({
          label: itemNameConvert,
          height: d.HEIGHT,
          width: d.WIDTH,
          length: d.LENGTH,
          volumn: d.VOLUMN,
          value:d.ID,
          quantity: d.QUANTITY,
        });
      });
      this.itemDupplicate = this.items;
    },
    async nhanphoihacap() {
      if (this.congdoan.factoryId == 102339) this.fa = 100003;
      if (this.congdoan.factoryId == 102340) this.fa = 100004;
      if (this.congdoan.factoryId == 102366) this.fa = 100005;
    },

    async chonItem() {
      this.quantity = this.item.quantity;
     // this.quantity2 = this.quantity;
      this.item2 = this.item;
      console.log('qc sau cat:',this.item2.value)
    },
    chonItem2() {
      this.loadMaPrice(this.item2.height, this.item2.width);
    },
    loadMaPrice(day, rong) {
      console.log("day", day);
      console.log("rong", rong);
      if (day > 21) {
        this.priceCode = "CAT>21";
      } else {
        if (rong >= 55) {
          this.priceCode = "CAT<=21&>=55";
        } else {
          this.priceCode = "CAT<=21&<55mm";
        }
      }
    },
    searchItem2(val, update) {
      if (val === "") {
        update(() => {
          this.items2 = this.itemDupplicate2;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.items2 = this.itemDupplicate2.filter((v) => {
          const quicach = v.label.toString().toLowerCase();
          if (quicach.indexOf(needle) > -1) {
            return v;
          }
        });
      });
    },
    searchItem(val, update) {
      if (val === "") {
        update(() => {
          this.items = this.itemDupplicate;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.items = this.itemDupplicate.filter((v) => {
          const quicach = v.label.toString().toLowerCase();
          if (quicach.indexOf(needle) > -1) {
            return v;
          }
        });
      });
    },
    async updateITEMPACKAGE(PACKAGE_ID, xuatton, itemId) {
      const payload = {
        PACKAGE_ID,
        itemId: itemId,

        quantity: xuatton,
      };
      const data = await this.$store.dispatch(
        "production/INSERT_ITEM_IN_PACKAGE",
        payload
      );
    },
    async onClick() {
      if (this.congdoan.factoryId == 102339) this.fa = 100003;
      if (this.congdoan.factoryId == 102340) this.fa = 100004;
      if (this.congdoan.factoryId == 102366) this.fa = 100005;
      if (this.congdoan.factoryId == 100000) this.fa = 100000;
      if (this.quantity != null) {
        let payload = {
          itemId: null,
          length: this.item.length,
          width: this.item.width,
          height: this.item.height,
          accountId: this.userInfo.id,
          factoryId: this.fa,
          volumn: this.item.volumn * parseInt(this.quantity),
          quantity: parseInt(this.quantity),
          xuatNhap: this.nhapXuat.value,
          destinationId: this.congDoanNhan.id,
          sourceId: this.congdoan.id,
          volumnHC:this.quantityKL ? this.quantityKL : null,
          quantityHC: null,
          DESTINATION_ID_HC: this.congDoanNhanHC
            ? this.congDoanNhanHC.id
            : null,
          priceCode: this.priceCode,
        };
        let data = await this.insertXuatGoCatHaCap(payload);
     
        if (data.recordset.length>0) {
          if (this.nhapXuat.value == "loi-cat-ha-cap" || this.nhapXuat.value == "loi-bao-ha-cap"  ) {
           if (this.qccatve.length == 0) {
          const payload = {
              departmentId: this.congdoan.id,
              stepNextId: this.congDoanNhan.id,
              itemId: this.item2.value,
              TYPE_ID: 100026,
              createBy: this.userInfo.id,
              factoryId: this.fa,
              quantity: this.quantity2,
              PO: "HC",
            };
            const data2 = await this.$store.dispatch(
              "production/INSERT_PACKAGE",
              payload
            );
            if (data2.meta.success) {
              this.updateITEMPACKAGE(
                data2.data[0].ID,
                this.quantity2,
                this.item2.value
              );
              // let payload = {
              //   fromId: this.congDoanNhan.id,
              //   itemFromId: this.item2.value,
              //   destinationId: this.congdoan.id,
              //   factoryId: this.fa,
              //   packageId: data2.data[0].ID,
              //   quantity: this.quantity2,
              // };
              // let qc = await this.$store.dispatch(
              //   "production/handleQc",
              //   payload
              // );
            }
           } else {
             console.log('data:',this.qccatve)
             this.qccatve.forEach(async d => {
               const payload = {
              departmentId: this.congdoan.id,
              stepNextId: this.congDoanNhan.id,
              itemId: d.quycach,
              TYPE_ID: 100026,
              createBy: this.userInfo.id,
              factoryId: this.fa,
              quantity: d.soluong,
              PO: "HC",
            };
            const data3 = await this.$store.dispatch(
              "production/INSERT_PACKAGE",
              payload
            );
          
            if (data3.meta.success) {
              this.updateITEMPACKAGE(
                data3.data[0].ID,
                d.soluong,
                d.quycach
              );
            }
            });
            this.qccatve = [];
            this.quantityKL = ''
           }
            showNotifySuccess();
          }
          // if (this.congDoanNhanHC) {
          //   const payload = {
          //     departmentId: this.congdoan.id,
          //     stepNextId: this.congDoanNhanHC.id,
          //     itemId: 127398,
          //     TYPE_ID: 100026,
          //     createBy: this.userInfo.id,
          //     factoryId: this.congdoan.factoryId,
          //     quantity: this.quantityKL,
          //     PO: "SITE-HC",
          //   };
          //   const data2 = await this.$store.dispatch(
          //     "production/INSERT_PACKAGE",
          //     payload
          //   );
          //   if (data2.meta.success) {
          //     this.updateITEMPACKAGE(data2.data[0].ID, this.quantityKL, 127398);
          //   }
          //   showNotifySuccess();
          // }
          showNotifySuccess();
          this.chonCongdoan();
          this.quantity = 0;
          this.quantity2 = 0;
          this.item2 = null;
          this.item = null;
        } else {
          showNotifySuccess();
        }
      }
      console.log("loi:", this.nhapXuat.value);
    },
  },
};
</script>

<style>
</style>