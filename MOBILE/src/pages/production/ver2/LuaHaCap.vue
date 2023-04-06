<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="page-title">
        <div class="col-auto">Ghi nhận lựa hạ cấp tổ sấy</div>
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
          :options="items"
          label="Qui cách cắt hạ cấp"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-input v-model="quantity" label="Số lượng thanh cắt hạ cấp" />
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
          style="font-family: 'Time New Roman'; font-size: 16px"
          v-model="item2"
          :options="items2"
          label="Qui cách hạ cấp"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-input v-model="quantity2" label="Số lượng thanh hạ cấp" />
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <q-btn
          color="primary"
          class="full-width"
          label="Ghi nhận"
          @click="onClick"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { showNotifySuccess } from "../../../utils/utils";
export default {
  components: {},
  data() {
    return {
      items: [],
      items2: [],
      item: null,
      item2: null,
      itemDupplicate: [],
      quantity: null,
      quantity2: null,
    };
  },
  created() {
    this.loadItem();
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("production", [
      "getItemInBom",
      "insertLuaHaCap",
    ]),
    async loadItem() {
      const data2 = await this.getItemInBom();
      data2.forEach((d) => {
        const itemNameConvert = `[${d.CODE}] ${d.NAME} (${d.DAI}*${d.RONG}*${d.DAY})`;
        this.items.push({
          label: itemNameConvert,
          value: d.CODE,
          name: d.NAME,
          height: d.DAI,
          width: d.RONG,
          length: d.DAY
        });
      });
      this.itemDupplicate = this.items;
    },
    async chonItem() {
        this.items2 = [];
      this.items.forEach(el => {
          if(el.length <= this.item.length && el.width <= this.item.width && el.height <= this.item.height){
              const itemNameConvert = `[${el.value}] ${el.name} (${el.height}*${el.width}*${el.length})`;
              this.items2.push({
                  label: itemNameConvert,
                  value: el.value
              })
          }
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
    async onClick() {
      let payload = {
        code1: this.item.value,
        quantity1: this.quantity,
        code2: this.item2.value,
        quantity2: this.quantity2,
        accountId: this.userInfo.id
      }
      let data = await this.insertLuaHaCap(payload);
      if (data == "OK") {
        showNotifySuccess();
        this.quantity = 0;
        this.quantity2 = 0;
        this.item2 = null;
        this.item = null;
      } else {
        showNotifySuccess();
      }
    },
  },
};
</script>

<style>
</style>