<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="page-title">
        <div class="col-auto">Xuất phôi thô kho gỗ sau sấy</div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
          v-model="congdoan"
          @input="chonCongdoan"
          :options="congdoans"
          label="Tổ"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
          clearable
          @input="chonItem"
          use-input
          input-debounce="0"
          @filter="searchItem"
          style="font-family: 'Time New Roman'; font-size: 16px"
          v-model="item"
          behavior="dialog"
          :options="items"
          label="Sản phẩm/Chi tiết"
        />
      </div>
    </div>
    <!-- <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
          clearable
          style="font-family:'Time New Roman';font-size:16px"
          v-model="market"
          :options="markets"
          label="Màu"
        />
      </div>
    </div> -->
    <q-dialog v-model="confirm" full-width>
      <q-card>
        <q-card-section class="row items-center">
          <label> Tùy chọn</label>

          <div class="q-pa-md col-12">
            <div class="q-gutter-md">
              <q-select
                @filter="filterFn1"
                use-input
                outlined
                v-model="product"
                :options="products"
                @input="onCheck"
                label="Sản phẩm"
                input-debounce="0"
              />

              <q-select
              input-debounce="0"
                use-input
                @filter="filterFn"
                outlined
                v-model="itemPro"
                :options="itemPros"
                label="Chi tiết"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Hủy"
            @input="cancel"
            color="primary"
            v-close-popup
          />
          <q-btn flat label="Hoàn thành" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="row" v-if="congdoan !== null && item !== null">
      <div class="col-12 q-pa-sm">
        <q-select
          filled
          @input="showConfirmDialog"
          style="font-family: 'Time New Roman'; font-size: 16px"
          v-model="nguonPhoi"
          :options="nguonPhois"
          label="Nguồn phôi"
        />
      </div>
      <div v-if="nguonPhoi">
        <div class="q-gutter-sm" v-if="nguonPhoi.code ? nguonPhoi.code : false">
          <q-radio
            class="col-6 q-pa-sm"
            v-model="luaPhoi"
            val="0"
            label="Chưa lựa"
            @input="showConfirmDialog"
          />
          <q-radio
            class="col-6 q-pa-sm"
            v-model="luaPhoi"
            val="1"
            label="Đã lựa"
            @input="showConfirmDialog"
          />
        </div>
      </div>
    </div>

    <!-- <q-datetime v-model="model" type="date" />
      <div class="q-pa-md row" >
        <q-input filled v-model="date" mask="date" :rules="['date']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date range v-model="model" mask="YYYYDDMM">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div> -->
    <!-- <q-date v-model="model" range  mask="YYYYDDMM" /> -->
    <div class="row" v-if="card">
      <q-input filled v-model="from" label="Từ ngày" class="col-6 q-pa-sm">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="from" mask="YYYY-MM-DD" @input="factoryOnChange">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input filled v-model="to" label="Đến ngày" class="col-6 q-pa-sm">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="to" mask="YYYY-MM-DD" @input="factoryOnChange">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-select
        class="col-12 q-pa-sm"
        filled
        v-model="factory"
        :options="options"
        label="LSX nhà máy"
        @input="factoryOnChange"
      />

      <div class="q-pa-md col-12 q-pa-sm" v-if="factory">
        <span>Danh sách LSX </span>

        <q-option-group
          class="col-6 q-pa-sm"
          :options="items1"
          @input="radioChecked"
          type="radio"
          v-model="group"
        />
      </div>
      <q-select
        class="col-12 q-pa-sm"
        filled
        v-model="department"
        :options="departments"
        label="Công đoạn"
      />
      <div class="col-6 q-pa-sm">
        <q-input v-model="quantity" type="text" label="Số lượng" />
      </div>
      <div class="col-6 q-pa-sm">
        <q-input readonly v-model="unit" type="text" label="Đơn vị " />
      </div>
    </div>
    <div class="col-6 q-pa-sm" v-if="card">
      <q-input readonly v-model="tonkho" type="text" label="tồn kho" />
    </div>

    <div class="row">
      <div class="col-12">
        <q-btn
          color="primary"
          class="full-width"
          label="Xuất tồn"
          @click="onClick"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { showNotifySuccess } from "../../../utils/utils";
//import { showLoadingIos, closeLoading,generateUUID, formatDateISO } from '../../../utils/utils'
import { mapGetters, mapActions } from "vuex";
export default {
  //20q1070
  data() {
    return {
      product: null,
      products: null,
            products1: null,

      itemPro: null,
      itemPros: null,
            itemPros1: null,

      congdoan: null,
      congdoans: [],
      item: null,
      items: [],
      data1: null,
      num: [],
      po: [],
      card: false,
      code: [],
      tonkho: 0,
      thuchien: 0,
      luaPhoi: null,
      ys: false,
      from: "2021-03-01",
      unit: "",
      to: "2021-03-24",
      quantity: "",
      shape: ["line", "linea"],
      items1: [1, 2, 3],
      itemDupplicate: [],
      market: null,
      model: null,
      group: null,
      markets: [
        { label: "Màu Cafe", value: "CAFE" },
        { label: "Màu Xám", value: "XAM" },
        { label: "Màu Đen", value: "DEN" },
        { label: "Màu Trắng", value: "TRANG" },
      ],
      confirm: false,
      showConfirm: false,
      nguonPhoi: null,
      factory: null,
      department: null,
      departments: null,
      options: [
        {
          label: "NM CBG Thuận Hưng",
          id: 100000,
          code: "TH",
        },
        {
          label: "NM CBG Yên Sơn 1A",
          id: 100003,
          code: "YS1A",
        },
        {
          label: "NM CBG Yên Sơn 1B",
          id: 100004,
          code: "YS1B",
        },
        {
          label: "NM CBG Thái Bình",
          id: 100005,
          code: "TB",
        },
      ],
      nguonPhois: [
        { label: "Tại tổ", value: "Tại tổ" },
        { label: "Yên Sơn 1a", value: "Yên Sơn 1a" },
        { label: "Yên Sơn 1b", value: "Yên Sơn 1b" },
        { label: "Thái Bình", value: "Thái Bình" },
      ],
      nguonPhois1: [
        { label: "Tại tổ", value: "Tại tổ" },
        { label: "Yên Sơn 1a", value: "Yên Sơn 1a", code: 1 },
        { label: "Yên Sơn 1b", value: "Yên Sơn 1b", code: 1 },
        { label: "Thái Bình", value: "Thái Bình", code: 1 },
        { label: "Lò số : 01 (TH)", value: "Lò số : 01 (TH)" },
        { label: "Lò số : 02 (TH)", value: "Lò số : 02 (TH)" },
        { label: "Lò số : 03 (TH)", value: "Lò số : 03 (TH)" },
        { label: "Lò số : 04 (TH)", value: "Lò số : 04 (TH)" },
        { label: "Lò số : 05 (TH)", value: "Lò số : 05 (TH)" },
        { label: "Lò số : 06 (TH)", value: "Lò số : 06 (TH)" },
        { label: "Lò số : 07 (TH)", value: "Lò số : 07 (TH)" },
        { label: "Lò số : 08 (TH)", value: "Lò số : 08 (TH)" },
        { label: "Lò số : 09 (TH)", value: "Lò số : 09 (TH)" },
        { label: "Lò số : 10 (TH)", value: "Lò số : 10 (TH)" },
        { label: "Lò số : 11 (TH)", value: "Lò số : 11 (TH)" },
        { label: "Lò số : 12 (TH)", value: "Lò số : 12 (TH)" },
        { label: "Lò số : 13 (TH)", value: "Lò số : 13 (TH)" },
        { label: "Lò số : 14 (TH)", value: "Lò số : 14 (TH)" },
        { label: "Lò số : 15 (TH)", value: "Lò số : 15 (TH)" },
        { label: "Lò số : 16 (TH)", value: "Lò số : 16 (TH)" },
        { label: "Lò số : 17 (TH)", value: "Lò số : 17 (TH)" },
        { label: "Lò số : 18 (TH)", value: "Lò số : 18 (TH)" },
        { label: "Lò số : 19 (TH)", value: "Lò số : 19 (TH)" },
        { label: "Lò số : 20 (TH)", value: "Lò số : 20 (TH)" },
      ],
      allMarket: [],
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  async created() {
    let department = await this.getAllCongDoans();
    department.forEach((s) => {
      if (s.ID === 102484) {
        this.congdoans.push({
          value: s.ID,
          label: s.NAME,
        });
        return;
      }
    });
    let data = await this.getPO({
      factoryId: 100000,
      from: this.from,
      to: this.to,
    });
    if (this.userInfo.id === 102050) this.nguonPhois = [...this.nguonPhois1];

    this.items1 = data;
    this.loadItem();
    this.getMarket();
  },

  methods: {
    ...mapActions("po", [
      "getAllLsx",
      "getPosByNumberAndStep",
      "getAllNguonPhoi",
      "resetPos",
      "themTonKeHoach2",
      "getPO",
    ]),
    ...mapActions("production", [
      "getAllKeHoachSanXuatConLais",
      "getPoByCode",
      "addPackage",
      "getDinhMucs",
      "getTyLeTHs",
      "getlenhsx",
    ]),
    ...mapActions("base", ["getAllCongDoans"]),
    async factoryOnChange() {
      if (this.factory === 100000) {
        console.log(this.date, this.model);
        let data = await this.getPO({
          factoryId: this.factory.id,
          from: this.from,
          to: this.to,
        });
        this.items1 = data;
        let department = await this.getAllCongDoans();
        department.forEach((s) => {
          s.label = s.NAME;
          s.id = s.ID;
        });
        this.departments = department.filter(
          (s) => s.id === 100264 || s.id === 100274
        );
        console.log(data);
      } else {
        let data = await this.getPO({
          factoryId: this.factory.id,
          from: this.from,
          to: this.to,
        });
        this.items1 = data;
        let department = await this.getAllCongDoans();
        department.forEach((s) => {
          s.label = s.NAME;
          s.id = s.ID;
        });
        this.departments = department.filter(
          (s) => s.id === 100264 || s.id === 100274
        );
        let departments1 = [
          {
            label: "NM CBG Yên Sơn 1A",
            id: 100003,
            code: "YS1A",
          },
          {
            label: "NM CBG Yên Sơn 1B",
            id: 100004,
            code: "YS1B",
          },
          {
            label: "NM CBG Thái Bình",
            id: 100005,
            code: "TB",
          },
        ];
        this.departments.push(...departments1);
      }
    },
    async radioChecked(value) {
      this.confirm = true;
      this.product = null;
      this.products = null;

      this.itemPro = null;
      this.itemPros = null;

      const data1 = await this.$store.dispatch(
        "production/ACTION_FETCH_ITEMS_STOCK",
        {
          group: this.group,
        }
      );
      this.data1 = data1.data;

      let arr = [];
      data1.data.forEach((el) =>
        arr.push({
          id: el.root,
          label: el.root + "--" + el.sp,
        })
      );
      const uniqueAddresses = Array.from(new Set(arr.map((a) => a.id))).map(
        (id) => {
          return arr.find((a) => a.id === id);
        }
      );
      this.products = uniqueAddresses;
            this.products1 = uniqueAddresses;

      console.log(uniqueAddresses);
    },
    async onCheck() {
      this.itemPro = null;
      let item = this.data1;
      item = item.filter((el) => el.root === this.product.id);
      item.map((el) => (el.label = el.ct));
      this.itemPros = item;
            this.itemPros1 = item;

    },
    async cancel() {
      this.product = null;
      this.itemPro = null;
    },
    async showConfirmDialog() {
      this.card = false;
      if (this.nguonPhoi.code) {
        if (this.luaPhoi !== null) {
          this.card = false;
          this.thuchien = 0;
          if (this.congdoan.value && this.item.value && this.nguonPhoi) {
            const payload = {
              departmentId: this.congdoan.value,
              itemId: this.item.value,
              nguonPhoi: this.nguonPhoi ? this.nguonPhoi.value : null,
              luaPhoi: this.luaPhoi ? this.luaPhoi : null,
            };
            const data = await this.$store.dispatch(
              "production/KL_TON_DAU_KY",
              payload
            );
            console.log("ton kho:", data.data);
            if (data.data.length > 0 && data.data[0].tonkho > 0) {
              this.tonkho = data.data[0].tonkho;
              this.card = true;
              this.$q.loading.hide();
            } else {
              this.$q.dialog({
                title: "Lỗi",
                message: "không có khối lượng tồn kho!",
              });
            }
          } else
            this.$q.dialog({
              title: "Lỗi",
              message: "Nhập đầy đủ thông tin!",
            });
        }
      } else {
        this.card = false;
        this.thuchien = 0;
        if (this.congdoan.value && this.item.value && this.nguonPhoi) {
          const payload = {
            departmentId: this.congdoan.value,
            itemId: this.item.value,
            nguonPhoi: this.nguonPhoi ? this.nguonPhoi.value : null,
            luaPhoi: this.luaPhoi ? this.luaPhoi : null,
          };
          const data = await this.$store.dispatch(
            "production/KL_TON_DAU_KY",
            payload
          );
          console.log("ton kho:", data.data);
          if (data.data.length > 0 && data.data[0].tonkho > 0) {
            this.tonkho = data.data[0].tonkho;
            this.card = true;
            this.$q.loading.hide();
          } else {
            this.$q.dialog({
              title: "Lỗi",
              message: "không có khối lượng tồn kho!",
            });
          }
        } else
          this.$q.dialog({
            title: "Lỗi",
            message: "Nhập đầy đủ thông tin!",
          });
      }
    },

    async loadItem() {
      const data = await this.$store.dispatch("production/ACTION_FETCH_ITEMS", {
        factoryId: 100000,
      });
      data.forEach((d) => {
        const itemNameConvert = `[${d.code}] ${d.name} (${d.height}*${d.width}*${d.length})`;
        this.items.push({
          label: itemNameConvert,
          value: d.id,
          unit: d.unit,
        });
      });
      this.itemDupplicate = this.items;
    },
    async getMarket() {},

    async chonItem(val) {
      this.card = false;
      this.market = null;
      this.nguonPhoi = null;
      if (this.item) {
        this.unit = "(" + this.item.unit.name + ")";
      }
    },
    async onClick() {
      if (parseFloat(this.quantity) > 0) {
        this.xuaton = this.quantity;
      }
      if (this.tonkho == 0) {
        this.card = false;
      } else if (this.quantity > this.tonkho) {
        this.$q.dialog({
          title: "Lỗi",
          message: "Nhập quá khối lượng tồn kho!",
        });
      } else if (this.quantity < 0) {
        this.$q.dialog({
          title: "Lỗi",
          message: "Vui lòng nhập đúng thông tin!",
        });
      } else if (!this.group || !this.department || this.xuaton <= 0) {
        this.$q.dialog({
          title: "Lỗi",
          message: "Vui lòng điền đầy đủ thông tin",
        });
      } else {
        // for (let i = 0; i < this.num.length; i++) {
        //   let code1 = this.num[i].code;
        //   this.po = await this.getPoByCode({ code1 });
        //   console.log("con thực hiện:", this.po.conThucHien);
        //   if (this.xuaton > 0 && this.po.conThucHien > 0) {
        if (this.xuaton) {
          const payload = {
            departmentId: this.congdoan.value,
            stepNextId: this.department.id,
            itemId: this.item.value,
            TYPE_ID: 100026,
            createBy: this.userInfo.id,
            factoryId: this.factory.id,
            quantity: this.xuaton,
            PO: this.group,
          };
          console.log(payload);
          const data2 = await this.$store.dispatch(
            "production/INSERT_PACKAGE",
            payload
          );

          if (data2.meta.success) {
            console.log("ID:", data2.data[0].ID);
            this.updateITEMPACKAGE(data2.data[0].ID, this.xuaton);
          }
        }
        //       showNotifySuccess();

        //       this.xuaton = 0;
        //     } else {
        //       const payload = {
        //         departmentId: this.congdoan.value,
        //         stepNextId: this.po.stepNextId,
        //         itemId: this.item.value,
        //         TYPE_ID: 100026,
        //         createBy: this.userInfo.id,
        //         factoryId: 100000,
        //         quantity: this.po.conThucHien,
        //         PO: this.num[i].code,
        //       };
        //       const data2 = await this.$store.dispatch(
        //         "production/INSERT_PACKAGE",
        //         payload
        //       );

        //       if (data2.meta.success) {
        //         console.log("ID:", data2.data[0].ID);
        //         this.updateITEMPACKAGE(data2.data[0].ID, this.po.conThucHien);
        //       }
        //       showNotifySuccess();

        //       this.xuaton = this.xuaton - this.po.conThucHien;
        //     }
        //   }
        // }
        const payload = {
          departmentId: this.congdoan.value,
          itemId: this.item.value,
          quantity: -this.quantity,
          marketCode: this.market ? this.market.value : null,
          nguonPhoi: this.nguonPhoi ? this.nguonPhoi.value : null,
          poNumber: this.group,
          destinationId: this.department.id,
          selection: this.luaPhoi ? this.luaPhoi : null,
          product_id: this.product ? this.product.id : null,
          detailed_id: this.itemPro ? this.itemPro.ID : null,
        };
        console.log("oa", payload);
        const data = await this.$store.dispatch(
          "production/NHAP_TON_DAU_KY",
          payload
        );
        if (data.meta.success) {
          this.$q.notify({
            message: "Thành công",
            color: "green",
          });
        } else {
          this.$q.notify({
            title: "Lỗi",
            message: "Nhập quá khối lượng tồn kho!",
          });
        }
      }

      this.quantity = "";
      this.showConfirmDialog();
      if (this.tonkho <= 0) this.card = false;
    },

    async updateITEMPACKAGE(PACKAGE_ID, xuatton) {
      const payload = {
        PACKAGE_ID,
        itemId: this.item.value,

        quantity: xuatton,
      };
      const data = await this.$store.dispatch(
        "production/INSERT_ITEM_IN_PACKAGE",
        payload
      );
    },
    chonCongdoan(v) {
      this.nguonPhoi = null;
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.itemPros = this.itemPros1
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.itemPros = this.itemPros1.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
        filterFn1 (val, update) {
      if (val === '') {
        update(() => {
          this.products = this.products1
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.products = this.products1.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
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
  },
};
</script>

<style>
</style>