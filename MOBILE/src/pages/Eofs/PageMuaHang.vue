<template>
  <q-page>
    <order-header :order="order" />
    <order-lines-todo :orderLines="orderLines" />
    <q-checkbox
      v-if="order.Requests && !Object.keys(order.Requests).length"
      v-model="disable"
      label="Đồng ý"
    />
    <order-approved v-if="disable" :order="order" />

    <send-message :order="order" />

    <div
      v-if="order.Requests && !Object.keys(order.Requests).length"
      class="absolute-bottom-right text-center q-mb-lg"
    >
      <q-btn @click="addTask" round color="primary" size="24px" icon="add" />
    </div>
    <q-dialog v-model="showAddTask">
      <add-order-line :orderMeta="orderMeta" @close="showAddTask = false" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AddOrderLine from "components/eof/OrderLines/Modals/AddOrderLine.vue";
import OrderLinesTodo from "components/eof/OrderLines/OrderLinesTodo.vue";
import SendMessage from "components/eof/Shared/SendMessage.vue";
import OrderHeader from "components/eof/Shared/OrderHeader.vue";
import OrderApproved from "components/eof/Shared/OrderApproved.vue";
export default {
  data() {
    return {
      disable: false,
      showAddTask: false
    };
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("messages", ["messages"]),
    ...mapGetters("orderMetas", ["orderMeta"]),
    orderLines() {
      let x = [];
      if (this.orderMeta && this.orderMeta.metaValue)
        x = JSON.parse(this.orderMeta.metaValue);
      console.log(x);
      return x;
    },
  },
  methods: {
    ...mapActions("orders", [
      "getOneOrder",
      "addMessage",
      "getAllRequests",
      "sendToApproved",
    ]),
    ...mapActions("orderMetas", [
      "selectOrderMeta",
      "addorderMeta",
      "resetOrderLine",
    ]),
    addTask() {
      this.showAddTask = true;

      this.resetOrderLine({
        userId: this.userInfo.account,
        orderId: this.order.id,
        costcenterId: this.order.id,
        companyId: this.order.id,
      });
    },
  },
  created() {
    if (this.$route.query.id) {
      this.getOneOrder(this.$route.query.id).then((res) => {
        this.selectOrderMeta(res.data.data.OrderMeta[0]);
        if (res.data.data.Requests.length) this.disable = true;
      });
    } else {
      this.$router.push({
        path: "/tao-de-xuat",
      });
    }
    // this.getAllMessages();
  },
  mounted() {
    this.$root.$on("showAddOrderLine", () => {
      this.showAddTask = true;
      this.resetOrderLine({
        userId: this.userInfo.account,
        orderId: this.order.id,
        costcenterId: this.order.id,
        companyId: this.order.id,
        origin: "Trung quốc",
      });
    });
  },
  components: {
    AddOrderLine,
    SendMessage,
    OrderHeader,
    OrderApproved,
    OrderLinesTodo,
  },
};
</script>
