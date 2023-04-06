<template>
  <q-page>
    <order-header :order="order" />
    <q-card class="my-card">
      <RequestAdvance :metaValue="metaValue" :order="order" :disable="disable"></RequestAdvance>
    </q-card>
    <!-- <order-files></order-files> -->
    <q-card>
      <q-card-section>
        <q-checkbox
          v-if="order.Requests && !Object.keys(order.Requests).length"
          v-model="disable"
          label="Đồng ý"
        />
      </q-card-section>
    </q-card>
    <order-approved v-if="disable" :order="order" />

    <send-message :order="order" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SendMessage from "components/eof/Shared/SendMessage.vue";
import OrderHeader from "components/eof/Shared/OrderHeader.vue";
import OrderApproved from "components/eof/Shared/OrderApproved.vue";
import ThanhToan from "components/eof/ThanhToan.vue";
import RequestAdvance from "components/eof/RequestAdvance.vue";
export default {
  data() {
    return {
      disable: false,
      metaValue: {
        kinhGui: "Ban TGĐ",
        noiDungTT: "",
        soTien: 0,
        vietBangChu: "",
        kemTheo: "",
        address:"",
        fullName: ""
      }
    };
  },
  components: {
    SendMessage,
    OrderHeader,
    OrderApproved,
    ThanhToan,
    RequestAdvance
  },
  methods: {
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta"])
  },
  computed: {
    ...mapGetters("orders", ["order", "orders"]),
    ...mapGetters("base", ["userInfo", "myFactoryInfor"])
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
  },
  watch: {
    disable(newValue) {
      if (newValue) {
        this.addorderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue])
        });
      }
    }
  }
};
</script>
