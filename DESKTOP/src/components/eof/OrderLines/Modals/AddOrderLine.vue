<template>
  <q-card>
    <modal-header>Thêm mặt hàng đề xuất</modal-header>

    <form @submit.prevent="submitForm">
      <q-card-section>
        <modal-task-name
          :name.sync="orderLineToSubmit.name"
          ref="modalTaskName"
        />
        <q-input outlined v-model="orderLineToSubmit.quyCach" label="Mã VT" />
        <q-input outlined v-model="orderLineToSubmit.unitId" label="ĐVT" />
        <q-input outlined v-model="orderLineToSubmit.quantity" label="SL" />
        <q-input outlined v-model="orderLineToSubmit.mucDichSuDung" label="Mục đích sử dụng" />
        <q-input
        label=" Ngày kết thúc phiếu : "
        filled 
        class="q-mt-sm"
        :readonly="disable"
        v-model="orderLineToSubmit.finishedAt">
            <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date
                    v-model="orderLineToSubmit.finishedAt"
                    mask="YYYY-MM-DD HH:mm"
                    :disable="disable"
                    >
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
                    <q-time
                    v-model="orderLineToSubmit.finishedAt"
                    mask="YYYY-MM-DD HH:mm"
                    format24h
                    :disable="disable"
                    >
                    <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                    </q-time>
                </q-popup-proxy>
                </q-icon>
            </template>
        </q-input>
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
        finishedAt: "",
        quyCach:"",
        mucDichSuDung:""
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
    "modal-header": require("components/eof/Requests/Modals/Shared/ModalHeader.vue")
      .default,
    "modal-task-name": require("components/eof/OrderLines/Modals/Shared/ModalTaskName.vue")
      .default,
    "modal-due-date": require("components/eof/OrderLines/Modals/Shared/ModalDueDate.vue")
      .default,
    "modal-buttons": require("components/eof/Requests/Modals/Shared/ModalButtons.vue")
      .default
  }
};
</script>
