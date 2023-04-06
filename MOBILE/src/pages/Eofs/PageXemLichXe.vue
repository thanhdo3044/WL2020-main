<template>
  <q-page>
    <order-header :order="order" />
    <cars-order :order="order"></cars-order>
    <order-approved v-if="disable" :order="order" />
    <send-message :order="order" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import OrderHeader from "components/eof/Shared/OrderHeader.vue";
import SendMessage from "components/eof/Shared/SendMessage.vue";
import OrderApproved from "components/eof/Shared/OrderApproved.vue";
import CarsOrder from "components/eof/DatXeCongTac/CarsOrder.vue";
export default {
  data() {
    return {
      disable: false,
      metaValue: {
        kinhGui: "Ban TGĐ",
        noiDungTT: "",
        soTien: 0,
        vietBangChu: "",
        kemTheo: ""
      }
    };
  },
  methods: {
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta"])
  },
  computed: {
    ...mapGetters("orders", [
      "order",
      "getAccountById",
      "getCarById",
      "getCarsOption",
      "getAccountsOption"
    ]),
    ...mapGetters("base", ["userInfo", "myFactoryInfor"])
  },
  components: {
    SendMessage,
    OrderHeader,
    OrderApproved,
    CarsOrder
  },
  created() {
    if (this.$route.query.id) {
      this.getOneOrder(this.$route.query.id).then(res => {
        if (res.data.data.Requests.length) this.disable = true;
        this.metaValue = Object.assign(
          this.metaValue,
          JSON.parse(res.data.data.OrderMeta[0].metaValue)[0]
        );
      });
    } else {
      this.$router.push({
        path: "/tao-de-xuat"
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
