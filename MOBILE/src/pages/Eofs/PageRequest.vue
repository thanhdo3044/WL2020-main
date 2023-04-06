<template>
  <q-page>
    <order-header :order="order" />
    <q-card>
      <order-lines-todo
        v-if="order.ProposalForm.slug === 'de-nghi-thuong'"
        :orderLines="getMetaValue()"
      />
      <thanh-toan
        v-else-if="order.ProposalForm.slug === 'thanh-toan'"
        :disable="true"
        :metaValue="getMetaValue()[0]"
      ></thanh-toan>
      <cars-order
        :oneOrder="getOneRequest()"
        v-else-if="order.ProposalForm.slug === 'dang-ky-xe'"
      />
      <DeNghiLuong
        class="q-ma-sm"
        :metaValue="getMetaValue()[0]"
        :disable="true"
        v-else-if="order.ProposalForm.slug === 'de-nghi-luong'"
      />
      <MuaHang
        class="q-ma-sm"
        :order="order"
        :nextId2="nextId2"
        :nextId3="nextId3"
        :nextId="nextId"
        :metaValue="getMetaValue()"
        :disable="true"
        v-else-if="order.ProposalForm.slug === 'mua-hang'"
      />
      <VatTu
        class="q-ma-sm"
        :disable="true"
        v-else-if="order.ProposalForm.slug === 'vat-tu'"
      />
      <TuyenNhanVien
        class="q-ma-sm"
        :metaValue="getMetaValue()[0]"
        :disable="true"
        v-else-if="order.ProposalForm.slug === 'tuyen-nhan-vien'"
      />
      <ChuyenNhanVien
        class="q-ma-sm"
        :metaValue="getMetaValue()[0]"
        :disable="true"
        v-else-if="order.ProposalForm.slug === 'chuyen-nhan-vien'"
      />
      <XinNghiViec
        class="q-ma-sm"
        :metaValue="getMetaValue()[0]"
        :disable="true"
        v-else-if="order.ProposalForm.slug === 'xin-nghi-viec'"
      />
      <XinRaCong
        class="q-ma-sm"
        :metaValue="getMetaValue()[0]"
        :disable="true"
        v-else-if="order.ProposalForm.slug === 'xin-ra-cong'"
      />
      <DiCongTac
        class="q-ma-sm"
        :metaValue="getMetaValue()[0]"
        :disable="true"
        v-else-if="order.ProposalForm.slug === 'di-cong-tac'"
      />
      <CapBaoHoLaoDong
        class="q-ma-sm"
        :metaValue="getMetaValue()[0]"
        :disable="true"
        v-else-if="order.ProposalForm.slug === 'cap-bao-ho-lao-dong'"
      />
      <XacNhanCong
        class="q-ma-sm"
        :metaValue="getMetaValue()[0]"
        :disable="true"
        v-else-if="order.ProposalForm.slug === 'xac-nhan-cong'"
      />
      <van-phong-pham
        class="q-ma-sm"
        :metaValue="getMetaValue()[0]"
        :disable="true"
        v-else-if="order.ProposalForm.slug === 'van-phong-pham'"
      />
      <ban-giao
        class="q-ma-sm"
        :metaValue="getMetaValue()[0]"
        :disable="true"
        v-else-if="order.ProposalForm.slug === 'bien-ban-ban-giao'"
      />
      <SuaChua
        class="q-ma-sm"
        :metaValue="getMetaValue()[0]"
        :disable="true"
        v-else-if="order.ProposalForm.slug === 'sua-chua'"
      />
    </q-card>
    <send-message v-if="request.showMessages" :order="order" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import OrderHeader from "components/eofs/Shared/OrderHeader.vue";
import OrderLinesTodo from "components/eofs/OrderLines/OrderLinesTodo.vue";
import ThanhToan from "components/eofs/ThanhToan.vue";
import DeNghiLuong from "components/eofs/DeNghiLuong.vue";
import MuaHang from "components/eofs/MuaHang.vue";
import VatTu from "components/eofs/VatTu.vue";
import TuyenNhanVien from "components/eofs/TuyenNhanVien.vue";
import ChuyenNhanVien from "components/eofs/ChuyenNhanVien.vue";
import XinNghiViec from "components/eofs/XinNghiViec.vue";
import XinRaCong from "components/eofs/XinRaCong.vue";
import DiCongTac from "components/eofs/DiCongTac.vue";
import XacNhanCong from "components/eofs/XacNhanCong.vue";
import SuaChua from "components/eofs/SuaChua.vue";
import CapBaoHoLaoDong from "components/eofs/CapBaoHoLaoDong.vue";
import VanPhongPham from "components/eofs/VanPhongPham.vue";
import CarsOrder from "components/eofs/DatXeCongTac/CarsOrder.vue";
import SendMessage from "components/eofs/Shared/SendMessage.vue";
import BanGiao from "components/eofs/BanGiao.vue";
export default {
  data() {
    return {
      nextId2: null,
      nextId3: null,
      nextId: null,
      dataTest: "",
      banTGD: null,
      options: [
        {
          label: "Vũ Hải Bằng",
          value: "100400",
          description: "Chủ tịch HĐQT"
        },
        {
          label: "Trần Thị Thu Hàn",
          value: "100400",
          description: "Tổng giám đốc"
        }
      ],
      idNext: null
    };
  },
  components: {
    OrderHeader,
    OrderLinesTodo,
    ThanhToan,
    SendMessage,
    CarsOrder,
    DeNghiLuong,
    MuaHang,
    VatTu,
    TuyenNhanVien,
    ChuyenNhanVien,
    XinNghiViec,
    CapBaoHoLaoDong,
    XinRaCong,
    DiCongTac,
    VanPhongPham,
    BanGiao,
    XacNhanCong,
    SuaChua
  },
  methods: {
    ...mapActions("requests", [
      "getOneRequest",
      "addRequest",
      "completedRequest",
      "cancelRequest"
    ]),
    ...mapActions("orders", ["getOneOrder"]),
    promptToDelete(request) {
      this.$q
        .dialog({
          title: "Xác nhận",
          message: "Bạn thực sự muốn Hủy?",
          ok: {
            push: true
          },
          cancel: {
            color: "negative"
          },
          persistent: true
        })
        .onOk(() => {
          this.cancelRequest(request);
          this.$router.go(-1);
        });
    },
    completedToRequest(request) {
      this.$q
        .dialog({
          title: "Xác nhận",
          message: "Bạn thực sự muốn Duyệt?",
          ok: {
            push: true
          },
          cancel: {
            color: "negative"
          },
          persistent: true
        })
        .onOk(() => {
          this.completedRequest(request);
          this.$router.go(-1);
        });
    },
    getMetaValue() {
      const { OrderMeta } = this.order;
      return JSON.parse(OrderMeta[0].metaValue);
    }, // hàm sắp xếp động
    compareValues(key, order = "asc") {
      return function(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // nếu không tồn tại
          return 0;
        }

        const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
        const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order == "desc" ? comparison * -1 : comparison;
      };
    }
  },
  computed: {
    ...mapGetters("requests", ["request"]),
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("orders", ["order"]),
    parentOrder() {
      return this.order.Requests.filter(
        r => r.parentId === this.request.id && r.position === "Ban TGĐ"
      );
    }
  },

  async created() {
    if (this.$route.query.id) {
      this.dataTest = await this.getOneRequest(this.$route.query.id);
      // .then(
      //   request => {
      //     this.getOneOrder(request.orderId);
      //   }
      // );
      await this.getOneOrder(this.dataTest.orderId);
      // console.log("this.dataTest", this.dataTest);
      // console.log("this.order", this.order);
    }
    console.log("Requests", this.order.Requests);
    this.order.Requests.sort(this.compareValues("star", "asc"));
    let idDis = null;
    for (let i = 0; i < this.order.Requests.length; i++) {
      if (this.order.Requests[i].id == this.$route.query.id) {
        // console.log(this.order.Requests[i]);
        idDis = this.order.Requests[i].star;
        // console.log("idDis", idDis);
      }
    }
    this.nextId = this.order.Requests.find(e => e.star > idDis);
    // console.log("data", this.nextId);
    this.nextId2 = this.order.Requests.filter(
      e => e.star > this.request.star && e.position != "Phòng vật tư"
    );
    this.nextId3 = this.order.Requests.filter(
      e =>
        e.star > this.request.star &&
        (e.position == "Phòng vật tư" || e.position == "Phòng bảo vệ")
    );
    // console.log("this.nextId", this.nextId);
    // console.log("this.nextId2", this.nextId2);
    // console.log("this.nextId3", this.nextId3);
  }
};
</script>
