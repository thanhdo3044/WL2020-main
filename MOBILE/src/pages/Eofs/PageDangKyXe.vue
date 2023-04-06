<template>
  <div>
    <order-header :order="order" />
    <q-stepper v-model="step" ref="stepper" color="primary" animated>
      <q-step
        class="q-mb-lg"
        :name="1"
        title="Khai báo số người"
        icon="settings"
        :done="step > 1"
      >
        <list-account
          :accounts="accounts"
          :car="car"
          :disable="disable"
        ></list-account>
      </q-step>

      <q-step
        :name="2"
        title="Chọn xe và ngày giờ"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
        <div>Chọn ngày giờ đi</div>
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

        <div>Chọn ngày giờ kết thúc</div>
        <q-input filled v-model="dateEnd">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="dateEnd"
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
                  v-model="dateEnd"
                  mask="YYYY-MM-DD HH:mm:ss"
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

        <q-select
          filled
          v-model="car"
          :options="getCarsOption"
          label="Chọn xe"
          emit-value
          map-options
          :disable="disable"
          class="q-mt-sm"
        />
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
  </div>
</template>

<script>
import { axios } from "axios";
import { mapGetters, mapActions } from "vuex";
import OrderHeader from "components/eof/Shared/OrderHeader.vue";
import SendMessage from "components/eof/Shared/SendMessage.vue";
import OrderApproved from "components/eof/Shared/OrderApproved.vue";
import ListAccount from "components/eof/Shared/ListAccount.vue";
export default {
  data() {
    return {
      step: 1,
      stepable: false,
      accept: false,
      disable: false,
      accounts: [],
      car: {},
      carss: "",
      dateApp: "",
      dateEnd: "",
      from: "",
      to: "",
      description: ""
    };
  },
  methods: {
    ...mapActions("orders", [
      "getOneOrder",
      "addMessage",
      "getAllRequests",
      "sendToApproved",
      "getAllCars"
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
  computed: {
    ...mapGetters("orders", ["order", "getCarById", "getCarsOption", "cars"]),
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("messages", ["messages"]),
    ...mapGetters("orderMetas", ["orderMeta"])
  },
  created() {
    this.getAllCars();
    console.log("kjskdjfkjsdkf", this.cars);
    if (this.$route.query.id) {
      this.getOneOrder(this.$route.query.id).then(res => {
        this.selectOrderMeta(res.data.data.OrderMeta[0]);
        let data = JSON.parse(res.data.data.OrderMeta[0].metaValue);
        this.accounts = data.accounts;
        this.dateApp = data.dateApp;
        this.dateEnd = data.dateEnd;
        this.from = data.from;
        this.to = data.to;
        this.description = data.description;
        this.car = data.car;
        this.carss = data.car;
        if (res.data.data.Requests.length) this.disable = true;
      });
    } else {
      this.$router.push({
        path: "/tao-de-xuat"
      });
    }
  },
  watch: {
    async accept() {
      let metaValue = JSON.stringify({
        accounts: this.accounts,
        car: this.car,
        dateApp: this.dateApp,
        dateEnd: this.dateEnd,
        from: this.from,
        to: this.to,
        description: this.description
      });
      let dateStart = this.dateApp;
      let dateEnd = this.dateEnd;
      let carId = this.car.toString();
      let fromLocation = this.from;
      let toLocation = this.to;
      let payload = {
        metaValue
      };
      this.addorderMeta({
        ...this.orderMeta,
        metaValue,
        dateStart,
        dateEnd,
        carId,
        fromLocation,
        toLocation
      });
    }
  },
  components: {
    OrderHeader,
    OrderApproved,
    SendMessage,
    ListAccount
  }
};
</script>
