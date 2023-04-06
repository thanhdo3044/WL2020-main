<template>
  <q-page class="q-pa-sm bg-blue-grey-7">
    <app-bar>Nhập thông tin COC hàng ngày</app-bar>
    <div class="row justify-center q-ma-sm">
      <div class="col-12 col-md-6">
        <q-input dark label="Ngày" filled v-model="currentDate">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="currentDate" @input="() => $refs.qDateProxy.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div class="row justify-center q-ma-sm">
      <div class="col-12 col-md-6">
        <q-select
        dark
          use-input
          input-debounce="0"
          @filter="searchItem"
          style="font-family:'Time New Roman';font-size:16px"
          v-model="item"
          behavior="dialog"
          :options="items"
          label="Sản phẩm :"
        />
      </div>
    </div>
    <div class="row justify-center q-ma-sm">
      <div class="col-12 col-md-6">
        <q-input dark outlined v-model="order" label="Lệnh sản xuất" />
      </div>
    </div>
    <div class="row justify-center q-ma-sm">
      <div class="col-12 col-md-6">
        <q-input dark outlined v-model="weekNum" label="Dấu tuần" />
      </div>
    </div>
    <div class="row justify-center q-ma-sm">
      <div class="col-12 col-md-6">
        <q-input dark outlined v-model="qty" label="Số lượng" />
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-12 col-sm-6">
        <q-separator></q-separator>
      </div>
    </div>
    <div class="row justify-end woodText q-ma-sm">
      <div class="col-3">
        <a href="#" @click="confirm=true">Thêm vật liệu</a>
      </div>
    </div>
    <div class="row justify-center q-ma-sm">
      <div class="col-12 col-md-6">
        <table style="width:100%">
          <tr>
            <th>STT</th>
            <th>Vật liệu</th>
            <th>Nhà cung cấp</th>
            <th>Số lô</th>
            <th>....</th>
          </tr>
          <tr v-for="(data,index)  in info" v-bind:key="index">
            <td style="text-align:center">{{index+1}}</td>
            <td>{{data.name}}</td>
            <td>{{data.vendor}}</td>
            <td>{{data.parcel}}</td>
            <td>
              <a @click="removeInfo(index)" href="#">Xóa</a>
            </td>
          </tr>
          <tr v-show="info.length===0">
            <td colspan="5" style="text-align:center" class="woodText">Không có dữ liệu !</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="row justify-center q-mt-md">
      <div class="col-12 col-md-6">
        <q-btn class="full-width" @click="confirmSave =true" glossy color="primary" label="Lưu lại"></q-btn>
      </div>
    </div>
    <q-dialog dark v-model="confirm" persistent>
      <q-card class="bg-blue-grey-7" style="min-width:100%">
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-white">Điền thông tin.</span>
        </q-card-section>
        <q-card-section>
          <div class="row justify-center">
            <div class="col-12">
              <q-select
              dark
                style="font-family:'Time New Roman';font-size:16px"
                v-model="supplie"
                behavior="dialog"
                :options="supplies"
                label="Chọn vật tư :"
                use-input
                input-debounce="0"
                @filter="searchSupplies"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-select
              dark
                style="font-family:'Time New Roman';font-size:16px"
                v-model="provider"
                behavior="dialog"
                :options="providers"
                label="Nhà cung cấp :"
                use-input
                input-debounce="0"
                @filter="searchProvider"
              />
            </div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-12">
              <q-input dark @blur="saveLocalPracel" outlined v-model="parcelText" label="Số lô :" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn  label="Hủy" color="orange" v-close-popup />
          <q-btn @click="saveInfo"  label="Đồng ý" color="positive" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmSave" persistent>
      <q-card style="min-width:100%;max-width:500px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Bạn đã chắc chắn !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn @click="saveServe" flat label="Đồng ý" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmLeave" persistent>
      <q-card style="min-width:100%;max-width:500px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Dữ liệu chưa được lưu lại !</span>
        </q-card-section>
        <q-card-section class="woodText">Bạn vẫn mướn thoát ?</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn @click="saveServe" flat label="Đồng ý" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import AppBar from "../../components/AppBar";
import { getWeekNumber } from "../../utils/utils";
import { QSpinnerIos } from "quasar";
export default {
  components: {
    "app-bar": AppBar
  },
  data() {
    return {
      currentDate: new Date().toISOString().slice(0, 10),
      items: [],
      item: null,
      order: "",
      weekNum: "",
      qty: "",
      supplies: [],
      supplie: null,
      confirm: false,
      providers: [],
      provider: null,
      parcelText: "",
      info: [],
      confirmSave: false,
      confirmLeave: false
    };
  },
  created() {
    this.initData();
    this.weekNum = getWeekNumber(new Date());
  },
  beforeDestroy() {
    if (this.info.length > 0) {
      this.confirmLeave = true;
    }
  },
  methods: {
    removeInfo(index) {
      this.info.splice(index, 1);
    },
    async saveServe() {
      if (
        this.item &&
        this.currentDate &&
        this.weekNum &&
        this.qty &&
        this.info.length > 0
      ) {
        let payload = {
          date: this.currentDate,
          itemName: this.item.label,
          itemId: this.item.value,
          order: this.order,
          quantity: this.qty,
          info: this.info,
          factoryId: this.$store.getters["base/myFactoryInfor"].id
        };
        let data = await this.$store.dispatch(
          "production/CREATE_COC_DONG_GOI",
          payload
        );
        if (data.meta.success === true) {
          this.$q.notify({
            message: "Lưu thành công !",
            color: "green"
          });
          this.$router.go(-1);
        } else {
          this.$q.notify({
            message: data.meta.messages.message || "Đã xảy ra lỗi !",
            color: "red"
          });
        }
      } else {
        this.$q.notify({
          message: "Vui lòng điền đầy đủ thông tin !",
          color: "red"
        });
      }
    },
    saveInfo() {
      if (this.parcelText && this.provider && this.supplie) {
        let payload = {
          name: this.supplie.label,
          vendor: this.provider.label,
          parcel: this.parcelText
        };
        this.info.push(payload);
        this.supplie = null;
        this.provider = null;
      } else {
        this.$q.notify({
          message: "Vui lòng nhập đầy đủ thông tin !",
          color: "red"
        });
      }
    },
    saveLocalPracel() {},
    initData() {
      this.$q.loading.show({
        spinner: QSpinnerIos
      });
      return Promise.all([
        this.$store.dispatch("production/ACTION_GET_SUPPLIES", "undefined"),
        this.$store.dispatch("production/ACTION_GET_PROVIDERS", "undefined"),
        this.$store.dispatch("production/ACTION_GET_PARCELS", "undefined"),
        this.$store.dispatch("production/GET_PRODUCTS", "xx")
      ]).then(val => {
        this.$q.loading.hide();
      });
    },
    searchProvider(val, update) {
      let itemDupplicate = [];
      this.$store.state.production.providers.forEach(it => {
        const i = {
          label: it.name,
          value: it.id
        };
        itemDupplicate.push(i);
      });
      if (val === "") {
        update(() => {
          this.providers = itemDupplicate;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.providers = itemDupplicate.filter(v => {
          const quicach = v.label;
          if (quicach.toString().indexOf(needle) > -1) {
            return v;
          }
        });
      });
    },
    searchSupplies(val, update) {
      let itemDupplicate = [];
      this.$store.state.production.supplies.forEach(it => {
        const i = {
          label: it.name || "??",
          value: it.id
        };
        itemDupplicate.push(i);
      });
      if (val === "") {
        update(() => {
          this.supplies = itemDupplicate;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.supplies = itemDupplicate.filter(v => {
          const quicach = v.label.toLowerCase();
          if (quicach.toString().indexOf(needle) > -1) {
            return v;
          }
        });
      });
    },
    searchItem(val, update) {
      let itemDupplicate = [];
      this.$store.state.production.products.forEach(it => {
        const i = {
          label:
            it.name + " -> " + it.height + " " + it.width + " " + it.length,
          value: it.id
        };
        itemDupplicate.push(i);
      });

      if (val === "") {
        update(() => {
          this.items = itemDupplicate;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.items = itemDupplicate.filter(v => {
          const quicach = v.label.toString().toLowerCase();
          if (quicach.toString().indexOf(needle) > -1) {
            return v;
          }
        });
      });
    }
  }
};
</script>
<style scoped>
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>