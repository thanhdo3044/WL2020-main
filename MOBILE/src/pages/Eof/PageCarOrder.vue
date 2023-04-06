<template>
  <q-page>
    <card-header>Đặt xe đi công tác</card-header>
    <q-stepper v-model="step" ref="stepper" color="primary" animated>
      <q-step
        class="q-mb-lg"
        :name="1"
        title="Khai báo số người"
        icon="settings"
        :done="step > 1"
      >
        <list-account :accounts="accounts" :disable="disable"></list-account>
      </q-step>

      <q-step
        :name="2"
        title="Chọn xe và ngày giờ"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
        <div>Chọn ngày giờ</div>
        <q-input filled v-model="dateApp">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="dateApp"
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
                  v-model="dateApp"
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
      </q-step>

      <q-step :name="3" title="Hành trình" icon="assignment" :done="step > 3">
        <div>
          <q-input
            filled
            v-model="from"
            label="Đi từ *"
            hint="Điểm xuất phát"
            lazy-rules
            :rules="[
              val => (val && val.length > 0) || 'Hãy nhập điểm xuất phát'
            ]"
            :disable="disable"
          />
          <q-input
            filled
            v-model="to"
            label="Đến *"
            hint="Điểm đến"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Hãy nhập điểm đến']"
            :disable="disable"
          />
          <q-space />
          <q-toggle
            v-model="accept"
            label="Tôi đồng ý với các quy định đặt lịch xe"
            :disable="disable"
          />
        </div>
      </q-step>

      <q-step :name="4" title="Gửi phê duyệt" icon="add_comment">
        <order-approved :order="order" />
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            v-if="step < 4"
            @click="nextStep"
            color="primary"
            :label="step === 4 ? 'Gửi phê duyệt' : 'Tiếp'"
            :disable="stepable"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            label="Quay lại"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
    <send-message :order="order" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SendMessage from "components/eof/Shared/SendMessage.vue";
import OrderApproved from "components/eof/Shared/OrderApproved.vue";
import ListAccount from "components/eof/Shared/ListAccount.vue";
import CardHeader from "components/eof/Shared/CardHeader.vue";
export default {
  data() {
    return {
      step: 1,
      stepable: false,
      accept: false,
      disable: false,
      accounts: [],
      car: 6,
      dateApp: "",
      from: "",
      to: "",
      description: ""
    };
  },
  computed: {
    ...mapGetters("orders", ["order", "getCarById", "getCarsOption"]),
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("messages", ["messages"]),
    ...mapGetters("orderMetas", ["orderMeta"])
  },
  methods: {
    ...mapActions("orders", [
      "getOneOrder",
      "addMessage",
      "getAllRequests",
      "sendToApproved"
    ]),
    ...mapActions("orderMetas", [
      "selectOrderMeta",
      "addorderMeta",
      "resetOrderLine"
    ]),
    nextStep() {
      this.$refs.stepper.next();
    }
  },
  components: {
    CardHeader,
    OrderApproved,
    SendMessage,
    ListAccount
  }
};
</script>
