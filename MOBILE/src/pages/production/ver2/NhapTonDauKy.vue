<template>
  <q-page class="q-pa-md bg-blue-grey-7">
    <app-bar class="text-white">Nhập tồn đầu kỳ</app-bar>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          v-model="congdoan"
          label-color="amber"
          @input="chonCongdoan"
          :options="departments"
          label="Tổ"
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
          label-color="amber"
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
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          clearable
          label-color="amber"
          style="font-family: 'Time New Roman'; font-size: 16px"
          v-model="market"
          :options="markets"
          label="Loại QC"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-6 q-pa-sm">
        <q-input dark label-color="amber" v-model="quantity" type="text" label="Số lượng" />
      </div>
      <div class="col-6 q-pa-sm">
        <q-input dark label-color="amber" readonly v-model="unit" type="text" label="Đơn vị " />
      </div>
    </div>

    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          clearable
          label-color="amber"
          style="font-family: 'Time New Roman'; font-size: 16px"
          v-model="nguonPhoi"
          :options="nguonPhois"
          @input="nguonPhoiChange"
          label="Nguồn phôi"
        />
      </div>
      <div class="q-gutter-sm" v-if="ys &&enableLuaPhoi">
        <q-radio
        dark
          class="col-6 q-pa-sm"
          v-model="luaPhoi"
          val="0"
          label="Chưa lựa"
        />
        <q-radio
        dark
          class="col-6 q-pa-sm"
          v-model="luaPhoi"
          val="1"
          label="Đã lựa"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-input label-color="amber" dark v-model="description" type="text" label="Ghi chú" />
      </div>
    </div>
    <div class="row">
      <div class="col-12" align="center">
        <q-btn
           color="primary"
          label="Xác nhận"
          @click="onClick"
        />
        
      </div>
    </div>
  </q-page>
</template>

<script>
import { showNotifySuccess } from "../../../utils/utils";
import AppBar from "../../../components/AppBar";
import { mapGetters } from "vuex";
export default {
  //20q1070
  components: {
    "app-bar": AppBar,
  },
  data() {
    return {
      congdoan: null,
      departments: [],
      item: null,
      items: [],
      unit: "",
      quantity: "",
      description: "",
      itemDupplicate: [],
      market: null,
      luaPhoi:null,
      ys:true,
      enableLuaPhoi: false,
      markets: [
        { label: "LOẠI A", value: "A" },
        { label: "LOẠI B", value: "B" },
       { label: "Chờ xử lý", value: "CXL" },
        { label: "Hàng khuyến mại", value: "KM" },
      ],
      nguonPhoi: null,
      nguonPhois: [
        { label: "Tại tổ", value: "Tại tổ" },
        { label: "Yên Sơn 1a", value: "Yên Sơn 1a" },
        { label: "Yên Sơn 1b", value: "Yên Sơn 1b" },
        { label: "Thái Bình", value: "Thái Bình" },
         { label: "NM Quang Minh", value: "NM Quang Minh" },
          { label: "NM Nam Hồng", value: "NM Nam Hong" },
                {label: "Mua ngoài",value: "Mua ngoài"}

      ],
      nguonPhois1: [
        { label: "Tại tổ", value: "Tại tổ" },
        { label: "Yên Sơn 1a", value: "Yên Sơn 1a",code:1 },
        { label: "Yên Sơn 1b", value: "Yên Sơn 1b" ,code:1},
        { label: "Thái Bình", value: "Thái Bình" ,code:1},
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
    ...mapGetters("base", ["userInfo", "myDepartments"]),
  },
  created() {
    let listDepartment = this.myDepartments.filter(d => d.parentId != 102498 && d.parentId != 102451 && d.parentId != 102531 && d.parentId != 102533);
    listDepartment.forEach(el => {
      this.departments.push({
        label: el.name,
        value: el.id
      })
    });
    if (this.userInfo.id === 102050) this.nguonPhois = [...this.nguonPhois1];
    console.log(this.userInfo);
    
    this.getMarket();
  },
  methods: {
    // ...mapActions("base",["userInfo"]),
    async loadItem() {
      this.items = []
      if ([102487,102493,102780,102791,102792,102794,102795,102495,102494,102806,102807,102805,102460,102789].includes(this.congdoan.value) == true ){
          const data = await this.$store.dispatch("production/ACTION_FETCH_ITEMS", {
        factoryId: 100000,
        department:this.congdoan.value,
      });
      data.forEach((d) => {
       const itemNameConvert = `[id:${d.id}][${d.code}] ${d.name} (${d.height}*${d.width}*${d.length})`;
        this.items.push({
          label: itemNameConvert,
          value: d.id,
          unit: d.unit,
        });
     });
      } else {
      const data = await this.$store.dispatch("production/ITEMS_NHAP_TON", {
        factoryId: 100000,
        department:this.congdoan.value,
      });
      data.forEach((d) => {
        const itemNameConvert = `[id:${d.ID}][${d.CODE}] ${d.NAME} (${d.HEIGHT}*${d.WIDTH}*${d.LENGTH})`;
        this.items.push({
          label: itemNameConvert,
          value: d.ID,
          unit: d.unit,
        });
      });
      }
      this.itemDupplicate = this.items;
    },
    async getMarket() {
      // const data = await this.$store.dispatch('production/GET_MARKET')
      // data.data.forEach(element => {
      //   this.allMarket.push(
      //      {label:element.name, value:element.code,prodId:element.productId}
      //   )
      // });
    },
    async nguonPhoiChange(){
      if(this.nguonPhoi.code){
        this.enableLuaPhoi = true;
      }else{
        this.enableLuaPhoi = false
      }
    },
    async chonItem(val) {
      this.market = null;
      this.nguonPhoi = null;
      if (this.item) {
        this.unit = "(" + this.item.unit + ")";
      }
    },
    async onClick() {
      const payload = {
        departmentId: this.congdoan.value,
        itemId: this.item.value,
        quantity: this.quantity,
        marketCode: this.market ? this.market.value : null,
        nguonPhoi: this.nguonPhoi ? this.nguonPhoi.value : null,
        selection: this.luaPhoi ? this.luaPhoi :null,
        description: this.description
      };
      const data = await this.$store.dispatch(
        "production/NHAP_TON_DAU_KY",
        payload
      );
      if (data.meta.success) {
        showNotifySuccess();
        this.quantity = "";
      }
      this.luaPhoi = null
    },
    chonCongdoan() {
      
      this.loadItem();
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