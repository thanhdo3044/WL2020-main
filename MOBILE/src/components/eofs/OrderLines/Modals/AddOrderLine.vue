<template>
  <q-card>
    <modal-header>Thêm mặt hàng đề xuất</modal-header>

    <form @submit.prevent="submitForm">
      <q-card-section>
        <modal-task-name
          :name.sync="orderLineToSubmit.name"
          ref="modalTaskName"
        />
        <q-input outlined v-model="orderLineToSubmit.origin" label="Xuất xứ" />
        <q-input outlined v-model="orderLineToSubmit.unitId" label="ĐVT" />
        <q-input outlined v-model="orderLineToSubmit.quantity" label="SL" />
        <q-input
          outlined
          v-model="orderLineToSubmit.title"
          label="Yêu cầu kỹ thuật"
        />
        <modal-due-date
          :dueDate.sync="orderLineToSubmit.finishedAt"
          @clear="clearDueDate"
        />
      </q-card-section>

      <modal-buttons></modal-buttons>
    </form>
  </q-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { uid } from "quasar";
export default {
  data() {
    return {
      orderLineToSubmit: {
        id: uid(),
        name: "TEST",
        origin: "TQ",
        unitId: "C",
        quantity: 0,
        title: "Lý do mua",
        finishedAt: "2020-08-22"
      }
    };
  },
  props: ["orderLine"],
  computed: {
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("orders", ["order"]),
    ...mapGetters("orderMetas", ["orderMeta"]),
    orderLines() {
      let x = [];
      if (this.orderMeta && this.orderMeta.metaValue)
        x = JSON.parse(this.orderMeta.metaValue);
      console.log(x);
      return x;
    }
  },
  methods: {
    ...mapActions("orderMetas", ["addorderMeta"]),
    submitForm() {
      this.$refs.modalTaskName.$refs.name.validate();
      if (!this.$refs.modalTaskName.$refs.name.hasError) {
        this.submitTask();
      }
    },
    submitTask() {
      let metaValueToSubmit = [
        ...this.orderLines,
        {
          ...this.orderLineToSubmit,
          userId: this.userInfo.account,
          orderId: this.order.id,
          costcenterId: this.order.id,
          companyId: this.order.id
        }
      ];
      this.addorderMeta({
        ...this.orderMeta,
        metaValue: JSON.stringify(metaValueToSubmit)
      });

      this.$emit("close");
    },
    clearDueDate() {
      this.orderLineToSubmit.finishedAt = "";
    }
  },
  components: {
    "modal-header": require("components/eofs/Requests/Modals/Shared/ModalHeader.vue")
      .default,
    "modal-task-name": require("components/eofs/OrderLines/Modals/Shared/ModalTaskName.vue")
      .default,
    "modal-due-date": require("components/eofs/OrderLines/Modals/Shared/ModalDueDate.vue")
      .default,
    "modal-buttons": require("components/eofs/Requests/Modals/Shared/ModalButtons.vue")
      .default
  }
};
</script>
