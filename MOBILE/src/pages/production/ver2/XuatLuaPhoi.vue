<template>
  <q-page class="q-pa-md bg-blue-grey-7">
    <app-bar class="text-white">Ghi nhận sản lượng lựa đạt</app-bar>
    <div class="row">
        <div class="text-white col-12" align="center" style="font-style: italic">
            (Đối với các chi tiết không ghép)
          </div>
    </div>
    <!-- <div class="row justify-center">
      <div class="page-title">
        <div
          class="col-auto text-white"
          style="font-size: 18px"
          align="center"
        >
          <div style="font-weight: bold">GHI NHẬN SẢN LƯỢNG LỰA ĐẠT</div>
          <div class="text-white" style="font-style: italic">
            (Đối với các chi tiết không ghép)
          </div>
        </div>
        
      </div>
    </div> -->
    <hr width="50%" />
    <div class="row">
      <div class="col-6 q-pa-sm">
        <q-btn
          v-show="showListPackage"
          align="around"
          @click="showDialogErr"
          class="width = 80 q-mb-sm bg-green text-white"
          style="font-family: 'Time New Roman'; font-size: 14px"
          label="Phôi nhận về"
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
    <!-- <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
          v-model="nhapXuat"
          :options="nhapXuats"
          @input="chonloaighinhan"
          label-color="orange"
          style="font-family: 'Time New Roman'; font-size: 14px"
          label="Loại phôi ghi nhận"
        />
      </div>
    </div> -->
      <q-checkbox
              v-model="selectionlualai"
              dark
               color="positive"
              style="color:white;font-weight:bold"
              label="Lựa lại"
            />
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          v-model="congdoan"
          @input="chonCongdoan"
          :options="congdoans"
          label-color="amber"
          style="font-family: 'Time New Roman'; font-size: 14px"
          label="Nhóm ghi nhận sản lượng lựa đạt"
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
          @filter="searchItem"
          label-color="amber"
          style="font-family: 'Time New Roman'; font-size: 14px"
          v-model="item"
          :options="items"
          label="Qui cách trước khi lựa"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-8 q-pa-sm">
        <q-input
        dark
          v-model.number="quantity"
          type="number"
          @input="checkton"
          label-color="amber"
          style="font-family: 'Time New Roman'; font-size: 14px"
          label="Số lượng thanh trước khi lựa"
        />
      </div>
      <div class="col-4 q-pa-sm">
        <!-- <q-input
          readonly
          v-model="tonkho"
          type="text"
          color = "red"
          label-color="orange"
          style="font-family: 'Time New Roman'; font-size: 14px;"
          label="Số tồn chưa"
        /> -->
        <div class="row">
          <div
            class="col-12 text-orange"
            style="
              font-family: 'Time New Roman';
              font-size: 14px;
              padding-top: 18px;
            "
          >
            Số tồn chưa lựa
          </div>
          <q-badge v-if="tonkho" color="red"> {{ tonkho }} </q-badge>
        </div>
      </div>
    </div>

    <div v-if="item" class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          clearable
          @input="saulua"
          use-input
          input-debounce="0"
          @filter="searchItem2"
          label-color="amber"
          style="font-family: 'Time New Roman'; font-size: 14px"
          v-model="item2"
          :options="items2"
          label="Qui cách sau khi lựa"
        />
      </div>
    </div>
    <div v-if="item && quantity" class="row">
      <div class="col-12 q-pa-sm">
        <q-input
        dark
          v-model.number="quantity2"
          @input="checksl"
          label-color="amber"
          type="number"
          style="font-family: 'Time New Roman'; font-size: 14px"
          label="Số lượng thanh sau khi lựa"
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
          <div v-if="index == 0" class="col-6 header">Quy cách sau lựa</div>
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
        <q-select
        dark
          v-model="congDoanNhan"
          :options="congDoanNhans"
          label-color="light-blue"
          style="font-family: 'Time New Roman'; font-size: 14px"
          label="Công đoạn nhận"
        />
      </div>
    </div>
    <div class="row" v-if="site">
      <div class="col-12 q-pa-sm">
        <q-input
        dark
          v-model="quantityKL"
          label-color="red"
          style="font-family: 'Time New Roman'; font-size: 14px"
          label="Nhập khối lượng SITE"
        />
      </div>
    </div>
    <div class="row" v-if="site">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          v-model="congDoanNhanHC"
          :options="congDoanNhanHCs"
          label-color="red"
          style="font-family: 'Time New Roman'; font-size: 14px"
          label="Công đoạn nhận phôi SITE"
        />
      </div>
    </div>

    <div v-if="card">
      <div
        v-for="(phoi, index) in phoiTraLai"
        :key="index"
        class="row"
        style="border: 1px solid black; padding: 5px"
      >
        <div class="col-10">
          <div class="row">
            <div class="col-12">
              Phôi trả lại: <q-badge>{{ phoi.quantity }}</q-badge>
            </div>
            <div class="col-12">
              Lý Do: <q-badge>{{ phoi.STATUS }}</q-badge>
            </div>
          </div>
        </div>
        <div class="col-2">
          <q-btn
            style="font-size: 10px"
            dense
            color="red"
            @click="removePhoi(phoi.ID)"
            label="Xóa"
          />
        </div>
      </div>
    </div>
    <div class="row" v-if="card">
      <div class="col-12" align="center">
        <q-btn color="primary" label="Ghi nhận" @click="onGhiNhan" />
      </div>
    </div>
    <q-dialog v-model="dialogErr">
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Danh sách phôi nhận về <br /></div>
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
                  Chi tiết/cụm : <b>{{ item.NAME }}</b>
                </div>
                <div>
                  Qui cách :
                  <b>{{ item.DAY }}x{{ item.RONG }}x{{ item.DAI }}</b>
                </div>
                <div>
                  Số lượng : <b>{{ item.QUANTITY }}</b>
                </div>

                <div>
                  Người tạo : <b>{{ item.LAST_NAME }}</b>
                </div>
                <div>
                  Ngày tạo : <b>{{ moment(item.Ngay_tao).format("l") }}</b>
                </div>
                <br />
              </q-item-section>
              <q-item-section side>
                <q-btn
                  @click="confirmloi(item)"
                  color="positive"
                  label="nhận"
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
                <div
                  class="row"
                  v-for="item1 in item.SL"
                  v-bind:key="item1.BAO_ID"
                >
                  <div class="text-subtitle2 sub-receipt">
                    {{ item1.NAME }} ({{ item1.HEIGHT }}*{{ item1.WIDTH }}*{{
                      item1.LENGTH
                    }})
                  </div>

                  <q-input
                    v-model.number="item1.QUANTITY"
                    :readonly="true"
                    type="number"
                    label="Số lượng phôi"
                  />
                </div>

                <div>
                  Người giao :
                  <b>{{ getAccountById(item.createdby) | FullName }}</b>
                </div>
                <q-item-label style="color: purple; font-weight: bold">
                  Ngày giao :{{
                    item.createdAt.substring(0, 16).replace("T", " ")
                  }}
                </q-item-label>
                <hr />

                <div>
                  Người nhận :
                  <b>{{ getAccountById(item.approvedByAccount) | FullName }}</b>
                </div>
                <q-item-label style="color: purple; font-weight: bold">
                  Ngày nhận :
                  <b v-if="item.approvedAt">
                    {{ moment(item.approvedAt).format("l") }}
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
      xuatphoi: false,
      selectionlualai:false,
      congDoanNhan: null,
      congDoanNhans: [],
      congDoanNhanHC: [],
      congDoanNhanHCs: [],
      quantityKL: null,
      items: [],
      qccatve: [],
      fa: null,
      site: false,
      items2: [],
      item: null,
      item2: null,
      iconfasCheckCircle: fasCheck,
      itemDupplicate: [],
      xuatlistluadat: [],
      luadat: [],
      lua: [],
      quantity: null,
      quantity2: null,
      dialogErr: false,
      dialogErr1: false,
      showListPackage: false,
      priceCode: null,
      unit: null,
      loi: false,
      to: null,
      from: null,
      tonkho: null,
      thuchien: null,
      nhapXuat: {
        label: "Bào",
        value: "xuatluaphoi",
      },
      card: false,
      phoiTraLai: [],
      nhapXuats: [
        {
          label: "Bào",
          value: "xuatluaphoi",
        },
        {
          label: "Cắt",
          value: "cat",
        },
      ],
    };
  },
  created() {
    this.from = moment().format("YYYY-MM-DD");
    this.to = moment().format("YYYY-MM-DD");
    this.$store.getters["base/mySources"].forEach((s) => {
      this.congdoans.push({
        id: s.id,
        label: s.name,
        factoryId: s.factoryId,
      });
    });
    this.loadItem();
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("orders", ["getAccountById"]),
  },
  methods: {
    ...mapActions("production", [
      "getItemGoTho",
      "getTonGoTho",
      "getKeHoachGoTho",
      "getTraLaiGoTho",
      "getListPackageluadat",
      "getListPackagexuatluadat",
      "getActivePackageluadat",
      "insertXuatGoCatHaCap",
      "deleteGoThoTraLai",
      "insertXuatGoBao",
    ]),
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
    async saulua() {
      this.congDoanNhanHCs = [];
      if (this.item.value == this.item2.value) {
        this.site = false;
      } else {
        this.site = true;
        if (this.congdoan.factoryId == 102340) {
          this.congDoanNhanHC = {
            label: "3.Tổ sơ chế X3",
            id: 102353,
          };
          this.congDoanNhanHCs = [
            {
              label: "3.Tổ sơ chế X3",
              id: 102353,
            },
            {
              label: "3.Tổ VGT Nội địa",
              id: 102804,
            },
          ];
        }
        if (this.congdoan.factoryId == 102366) {
          this.congDoanNhanHC = {
            label: "3.Tổ Sơ Chế (TB)",
            id: 102380,
          };
        }
      }
    },
    async confirmloi(data) {
      this.dataPackageloi = data;
      this.slnew = this.dataPackageloi.QUANTITY;
      this.loi = true;
    },
    async activeSuccessloi() {
      let payload = {
        id: this.dataPackageloi.ID,
        verifyBy: this.userInfo.id,
      };
      let data = await this.getActivePackageluadat(payload);

      this.loadListPackage();
    },
    async loadListPackage() {
      this.showListPackage = false;
      let payload = {
        factoryId: this.congdoan.factoryId,
        DESTINATION_ID: this.congdoan.id,
      };
      this.listPackage = await this.getListPackageluadat(payload);

      if (this.listPackage.length > 0) this.showListPackage = true;
      else this.showListPackage = false;
    },
    async showDialogErr() {
      console.log("listPackage");
      await this.loadListPackage();
      if (this.listPackage.length > 0) this.dialogErr = true;
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
        "production/GET_XUAT_LUA_DAT",
        payload
      );
      this.slluadat = data2.data;
      this.xuatlistluadat = await this.getListPackagexuatluadat(payload);
      this.xuatlistluadat.forEach((d) => {
        this.lua = [];
        this.lua = this.slluadat.filter((el) => el.BAO_ID == d.ID);
        this.luadat.push({
          ID: d.ID,
          SOURCE_ID: d.SOURCE_ID,
          DESTINATION_ID: d.DESTINATION_ID,
          createdAt: d.createdAt,
          createdby: d.createdby,
          approvedAt: d.approvedAt,
          approvedByAccount: d.approvedByAccount,
          SL: this.lua,
        });
      });
      
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
          this.loadMaPrice(this.item2.height, this.item2.width);
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
    chonloaighinhan() {
      if (this.congdoan.factoryId == 102339)
        this.congDoanNhan = {
          label: "Kho Lựa đạt (YS1A)",
          id: 102487,
        };
      if (this.congdoan.factoryId == 102366)
        this.congDoanNhan = {
          label: "Kho lựa đạt (TB)",
          id: 102495,
        };
      this.item = null;
      this.item2 = null;
    },
    async removePhoi(id) {
      await this.deleteGoThoTraLai({ id: id });
      this.chonItem();
    },
    async checkton() {
      if (this.quantity > this.tonkho) {
        this.$q.dialog({
          title: "Lỗi",
          message: "Bạn nhập quá khối lượng tồn chưa lựa!",
        });
        this.quantity = null;
      }
    },
    async checksl() {
      if (
        this.quantity2 * this.item2.volumn >
        this.quantity * this.item.volumn
      ) {
        this.$q.dialog({
          title: "Lỗi",
          message: "Bạn nhập quá khối lượng trước khi lựa!",
        });
        this.quantity2 = null;
      }
    },
    async chonCongdoan() {
      this.xuatphoi = true;
      const data = await this.getItemGoTho(this.congdoan.id);
      data.forEach((d) => {
        const itemNameConvert = `[${d.code}] ${d.name} (${d.height}*${d.width}*${d.length})`;
        this.items.push({
          label: itemNameConvert,
          value: d.id,
          unit: d.unit,
          height: d.height,
          width: d.width,
          length: d.length,
          volumn: d.volumn,
        });
      });
      this.itemDupplicate = this.items;
      this.showListPackage = false;
      this.loadListPackage();
      if (
        this.congdoan.factoryId == 102339 ||
        this.congdoan.factoryId == 102340
      )
        this.congDoanNhan = {
          label: "Kho lựa đạt (YS1A)",
          id: 102487,
        };
      if (this.congdoan.factoryId == 102366)
        this.congDoanNhan = {
          label: "Kho lựa đạt (TB)",
          id: 102495,
        };
      // if (this.congdoan.factoryId == 100003 && this.nhapXuat.value == "loi")
      //   this.congDoanNhan = {
      //     label: "Nhóm cắt (YS1A)",
      //     id: 102640,
      //   };
      // if (this.congdoan.factoryId == 100005 && this.nhapXuat.value == "loi")
      //   this.congDoanNhan = {
      //     label: "Nhóm cắt (TB)",
      //     id: 102642,
      //   };
    },
    loadMaPrice(day, rong) {
      if (day > 21) {
        this.priceCode = "BAO>21";
      } else {
        if (rong >= 55) {
          this.priceCode = "BAO<=21&>=55";
        } else {
          this.priceCode = "BAO<=21&<55mm";
        }
      }
    },
    async chonItem() {
      this.qccatve = [];
      this.loadMaPrice(this.item.height, this.item.width);
      if (this.congdoan != null && this.item != null) {
        this.unit = this.item.unit;
        let payload = {
          length: this.item.length,
          width: this.item.width,
          height: this.item.height,
          stepId: this.congdoan.id,
        };
        let ton = await this.getTonGoTho(payload);
        console.log("ton", ton);
        if (ton.length == 0) {
          this.$q.dialog({
            title: "Lỗi",
            message: "không có khối lượng tồn kho!",
          });
        } else {
          this.tonkho = ton[0].quantity;
          this.card = true;
          let kehoach = await this.getKeHoachGoTho(payload);
          this.phoiTraLai = await this.getTraLaiGoTho(payload);
          if (kehoach.length == 0) {
            this.thuchien = 0;
          } else {
            this.thuchien = kehoach[0].quantity;
          }
        }
      } else {
        this.card = false;
      }
      if (this.nhapXuat.value == "xuatluaphoi") this.item2 = this.item;
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
      let itemDupplicate = [];
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
    onGhiNhan() {
      this.$q
        .dialog({
          title: "Xác nhận",
          message: "Bạn chắc muốn ghi nhận?",
          cancel: {
            color: "negative",
          },
          ok: {
            push: true,
          },

          persistent: true,
        })
        .onOk(() => {
          this.onClick();
        });
    },
    async onClick() {
      if (this.congdoan.factoryId == 102339) this.fa = 100003;
      if (this.congdoan.factoryId == 102340) this.fa = 100004;
      if (this.congdoan.factoryId == 102366) this.fa = 100005;
      if (this.congdoan.factoryId == 100000) this.fa = 100000;
      if (this.quantity > this.tonkho) {
        this.$q.dialog({
          title: "Lỗi",
          message: "Không thể xuất vượt quá số lượng phôi tồn!",
        });
        return;
      } else {
        let payload = {
          itemId: this.item.value,
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
          volumnHC: this.quantityKL ? this.quantityKL : 0,
          quantityHC: this.quantity2,
          DESTINATION_ID_HC: this.congDoanNhanHC
            ? this.congDoanNhanHC.id
            : null,
          priceCode: this.priceCode,
          lualai:this.selectionlualai,
        };
        let data = await this.insertXuatGoCatHaCap(payload);

        if (data.recordset.length > 0) {
          if (this.qccatve.length == 0) {
            this.loadMaPrice(this.item2.height, this.item2.width)
            this.qccatve.push({
              quycach: this.item2.value,
              soluong: this.quantity2,
              height: this.item2.height,
              width: this.item2.width,
              length: this.item2.length,
              PRICE_CODE:this.priceCode,
            });
          }
          if (this.qccatve.length > 0) {
            const payload = {
              BAO_ID: data.recordset[0].ID,
              dulieu: this.qccatve,
            };
            const data2 = await this.$store.dispatch(
              "production/INSERT_QC_LUA_DAT",
              payload
            );
          }
          // if (data2.meta.success) {
          //   this.updateITEMPACKAGE(
          //     data2.data[0].ID,
          //     this.quantity,
          //     this.item.value
          //   );
          // }
          showNotifySuccess();
          this.item = null;
          this.item2 = null;
          this.quantity = null;
          this.quantity2 = null;
          this.tonkho = null;
          this.selectionlualai = false;
          this.chonItem();
        } else {
          showNotifySuccess();
        }
      }
    },
  },
};
</script>

<style>
.header {
  text-align: center;
  font-weight: bold;
  background-color: #21ba45;
  border: 1px solid black;
  color: white;
}
.columnTable {
  border: 1px solid black;
  padding: 0 5px 0 5px;
}
.q-virtual-scroll__content{
  background-color: #546e7a;
}
</style>