<template>
  <q-page class="q-pa-sm bg-blue-grey-7">
    <app-bar class="text-white">PHIẾU CÂN HÀNG XUẤT</app-bar>
    <div class="row">
      <div class="col-12" align="center">
        <span class="text-white">Số: {{ code }}-{{ number }}</span>
      </div>
    </div>
    <!-- <div class="row justify-center">
      <div class="col-12" align="center">
        <span class="text-bold text-white text-center">PHIẾU CÂN HÀNG XUẤT</span>
        <br />
        <span class="text-white">Số: {{ code }}-{{ number }}</span>
      </div>
    </div> -->
    <div class="row">
      <q-input
      dark
        fill-mask
        label-color="orange"
        label="Ngày giờ cân tổng"
        mask="####-##-## ##:##"
        class="q-mb-sm col-12"
        filled
        v-model="ngayCanTong"
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date dark mask="YYYY-MM-DD HH:mm" v-model="ngayCanTong">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time dark v-model="ngayCanTong" mask="YYYY-MM-DD HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
      dark
        fill-mask
        label-color="orange"
        label="Ngày giờ cân bì"
        mask="####-##-## ##:##"
        class="q-mb-sm col-12"
        filled
        v-model="ngayCanBi"
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date dark mask="YYYY-MM-DD HH:mm" v-model="ngayCanBi">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time dark v-model="ngayCanBi" mask="YYYY-MM-DD HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-select
      dark
        filled
        class="q-mb-sm col-12"
        v-model="customer"
        label="Bên mua"
        stack-label
        :options="customers"
        label-color="orange"
      />
      <q-select
      dark
        filled
        class="q-mb-sm col-12"
        v-model="factory"
        stack-label
        label="Bên bán"
        :options="options"
        label-color="orange"
      />
      <div class="q-mb-sm col-6">
        <q-input
        dark
          style="margin: 5px"
          filled
          v-model="bsx"
          @input="upperCaseBSX"
          stack-label
          label-color="orange"
          label="Biển số xe"
        />
      </div>
      <div class="q-mb-sm col-6">
        <q-select
        dark
          filled
          style="margin: 5px"
          stack-label
          v-model="stock"
          label="Hàng hóa"
          :options="stocks"
          label-color="orange"
        />
      </div>
      <q-radio
        v-if="stock.value == 'mun-cua-ep-bang'"
        class="q-mb-sm col-6"
        v-model="nilon"
        val="0"
        label="Chưa đóng túi nilon"
      />
      <q-radio
        v-if="stock.value == 'mun-cua-ep-bang'"
        class="q-mb-sm col-6"
        v-model="nilon"
        val="1"
        label="Đóng túi nilon"
      />
      <div class="q-mb-sm col-6">
        <q-input
        dark
          style="margin: 0 5px 0 5px"
          @input="calculateVolume"
          filled
          v-model="m3Total"
          label="Trọng lượng tổng (Kg)"
          stack-label
          label-color="orange"
        />
      </div>
      <div class="q-mb-sm col-6">
        <q-input
        dark
          style="margin: 0 5px 0 5px"
          @input="calculateVolume"
          filled
          v-model="m3Bi"
          label="Trọng lượng bì (Kg)"
          stack-label
          label-color="orange"
        />
      </div>
      <div class="q-mb-sm col-6">
        <q-input
        dark
          style="margin: 0 5px 0 5px"
          filled
          v-model="m3"
          stack-label
          label="Trọng lượng hàng (Kg)"
          label-color="orange"
          readonly
        />
      </div>
      <div class="q-mb-sm col-6">
        <q-input
        dark
          style="margin: 0 5px 0 5px"
          filled
          v-model="giatien"
          stack-label
          label="Giá tiền"
          label-color="orange"
       
        />
      </div>
      <div class="q-mb-sm col-6">
      <q-checkbox
      dark
        @input="tiencanbixe"
        v-model="selectionCB"
        label="Cân bì xe"
        style="color:orange"
      />
      </div>
      <div class="q-mb-sm col-6">
      <q-input
      dark
        style="margin: 0 5px 0 5px"
        filled
        v-show="canbixe"
        v-model="giatiencb"
        stack-label
        label="Giá tiền cân bì"
        label-color="orange"
       
      />
      </div>
      <div class="col-12 q-mb-sm" align="center">
        <q-btn @click="onAccept" color="positive" label="NGƯỜI CÂN XÁC NHẬN" />
      </div>
    </div>
  </q-page>
</template>

<script>
import moment from "moment";
import AppBar from "../../components/AppBar";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    "app-bar": AppBar,
  },
  data() {
    return {
      ngayCanBi: moment().format("YYYY-MM-DD HH:mm"),
      ngayCanTong: moment().format("YYYY-MM-DD HH:mm"),
      customer: null,
      customers: [],
      code: null,
      number: null,
      bsx: null,
      m3Total: null,
      m3Bi: null,
      giatiencb:null,
      selectionCB: false,
      canbixe: false,
      giatien: null,
      m3: null,
      nilon: null,
      stock: {
        label: "Củi đầu mẩu",
        value: "cui-dau-mau",
      },
      stocks: [
        {
          label: "Củi đầu mẩu",
          value: "cui-dau-mau",
        },
        {
          label: "Mùn cưa ép bánh",
          value: "mun-cua-ep-bang",
        },
      ],
      factory: null,
      options: [
        {
          label: "NM CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "NM CBG Yên Sơn 1A",
          factoryId: 102339,
          code: "YS1A",
        },
        {
          label: "NM CBG Yên Sơn 1B",
          factoryId: 102340,
          code: "YS1B",
        },
        {
          label: "NM CBG Thái Bình",
          factoryId: 102366,
          code: "TB",
        },
      ],
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  created() {
    this.loadCustomer();
    this.loadCode();
  },
  methods: {
    ...mapActions("production", [
      "getAllCustomer",
      "getNumberEpMun",
      "insertEpMun",
    ]),
    async loadCustomer() {
      const data = await this.getAllCustomer();
      this.customers = data;
    },
    async loadCode() {
      this.code = `${moment().year()}${moment().weeks()}`;
      const payload = {
        code: this.code,
      };
      const data = await this.getNumberEpMun(payload);
      if (data.length == 0) {
        this.number = 1;
      } else {
        this.number = data[0].NUMBER + 1;
      }
    },
    upperCaseBSX() {
      this.bsx = this.bsx.toUpperCase();
    },
    calculateVolume() {
      if ((this.m3Total != null, this.m3Bi != null)) {
        this.m3 = parseFloat(this.m3Total) - parseFloat(this.m3Bi);
      }
    },
    tiencanbixe() {
      if (this.selectionCB) this.canbixe = true
      else this.canbixe = false
    },
    async onAccept() {
      if (
        this.customer &&
        this.factory &&
        this.m3Total &&
        this.m3Bi &&
        this.stock &&
        this.bsx &&
        this.giatien
      ) {
        const payload = {
          code: this.code,
          number: this.number,
          customerId: this.customer.value,
          factoryId: this.factory.factoryId,
          ngayCanTong: this.ngayCanTong,
          ngayCanBi: this.ngayCanBi,
          bienSoXe: this.bsx,
          hangHoa: this.stock.value,
          nilon: this.nilon,
          totalVolumn: this.m3Total,
          biVolumn: this.m3Bi,
          volumn: this.m3,
          createdBy: this.userInfo.id,
          giatien:this.giatien,
          giatiencb:this.giatiencb,
        };
        await this.insertEpMun(payload);
        this.$router.go();
      } else {
        this.$q.dialog({
          title: "Lỗi",
          message: "Xin vui lòng nhập đầy đủ thông tin trước khi tạo phiếu!",
        });
      }
    },
  },
};
</script>

<style>
</style>