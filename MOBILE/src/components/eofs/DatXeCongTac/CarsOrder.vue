<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Danh sách đăng ký</div>
      <div class="q-mb-sm" v-if="order.OrderMeta[0].dateStart">
        <q-badge> Ngày đi công tác: {{ order.OrderMeta[0].dateStart.slice(0,10) }} </q-badge>
      </div>
      <div class="text-subtitle2">
        Từ <b>{{ order.OrderMeta[0].dateStart.slice(0,10) }}</b> </br></b>  Đến: <b>{{ order.OrderMeta[0].dateEnd.slice(0,10)}}</b>
      </div>
    </q-card-section>
    <q-card-section>
      <list-account :accounts="accounts" :disable="disable"></list-account>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  method: {
    ...mapActions("orders", ["getOneOrder"])
  },
  computed: {
    ...mapActions("requests", [
      "getOneRequest",
      "addRequest",
      "completedRequest",
      "cancelRequest"
    ]),

    ...mapActions("orderMetas", [
      "selectOrderMeta",
      "getOneOrderMeta",
      "resetOrderLine"
    ]),
    ...mapGetters("orders", ["order"]),
    ...mapGetters("orderMetas", ["orderMetas"])
  },
  async created() {
    // await this.getAllOrderMetas;
    // this.getOneOrderMeta(oneOrder.id);
    // console.log("this.orderMetas", this.orderMetas.data.metaValue);
  },
  async created() {
    // if (this.$route.query.id) {
    //   this.dataTest = await this.getOneRequest(this.$route.query.id).then(
    //     request => {
    //       this.getOneOrder(request.orderId);
    //     }
    //   );
    //   console.log("this.dataTest", this.dataTest);
    // }
  },
  data() {
    return {
      dataTest: "",
      date: new Date().toISOString().slice(0, 10),
      accounts: [100275, 100278, 100298, 100310],
      disable: false
    };
  }
};
</script>
