<template>
  <div>
    <q-btn
      class="q-ml-sm q-mb-sm q-mt-sm bg-orange text-white shadow-5"
      size="12px"
      v-go-back.single
      icon="arrow_back"
      push
      label="Quay lại"
    />
    <q-card class="my-card">
      <q-card-section class="bg-blue-grey text-white">
        <div class="text-h6">
          {{ order.title }} {{ order.number }}/{{ year }}
        </div>
        <div class="text-subtitle2">
          <!-- NV đề xuất: {{ order.Account.account }} - {{ order.Account.lastName }} -->
        </div>
        <div class="text-subtitle2">
          <!-- Bộ phận làm việc: {{ order.Department.code }} -
          {{ order.Department.name }} -->
        </div>
        <q-badge color="primary"
          >Ngày, giờ tạo đề xuất: {{ formatDateVN(order.createdAt) }}</q-badge
        >
        <div class="text-subtitle2">
          <q-badge :color="order.completed ? 'blue' : 'green'">{{
            order.status
          }}</q-badge>
        </div>
        <q-stepper
          v-model="step"
          ref="stepper"
          color="primary"
          header-class="text-bold"
          animated
        >
          <q-step
            v-for="(item, key) in order.Requests"
            :name="item.id"
            :key="key"
            :title="getAccountById(item.accountId).lastName"
            icon="settings"
            :caption="
              item.status == 'Đã ký'
                ? `Đã duyệt ${
                    item.successRequest == null
                      ? ''
                      : ': ' + item.successRequest
                  }`
                : 'Chưa duyệt'
            "
            :done="item.status == 'Đã ký'"
          >
          </q-step>

          <!-- <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
      </q-step>

      <q-step
        :name="3"
        title="Ad template"
        icon="assignment"
        disable
      >
      </q-step>
 -->
          <!-- <q-step
        :name="4"
        title="Create an ad"
        icon="add_comment"
      >
        Try out different ad text to see what brings in the most customers, and learn how to
        enhance your ads using features like ad extensions. If you run into any problems with
        your ads, find out how to tell if they're running and how to resolve approval issues.
      </q-step> -->

          <!-- <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Finish' : 'Continue'" />
          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </template> -->
        </q-stepper>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment, { localeData } from "moment";
import { date } from "quasar";
export default {
  props: ["order"],
  data() {
    return {
      data: null,
      year: null,
      step: null,
      ngay: null,
    };
  },
  computed: {
    ...mapGetters("orders", ["getAccountById", "accounts"]),
  },
  methods: {
    ...mapActions("base", [
      "GET_DEPARTMENTSBYID",
      "GET_DEPARTMENTSALL",
      "getAccountByID",
    ]),
    formatDateVN(dateString) {
      // const hour = dateString.getHours();
      // console.log("hour", hour);
      let convertDate = new Date(dateString);
      console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<",convertDate.getHours()<12)
      if(convertDate.getHours() < 12){
      return date.formatDate(dateString, "YYYY-MM-DD HH:mm:ss") + ' AM';
      } else {
      return date.formatDate(dateString, "YYYY-MM-DD HH:mm:ss PM") + ' PM';
      }
    },
  },
  created() {
    console.log("order", this.order.Requests);
    this.data = this.order.Requests;
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.order);
    this.year = moment().year();
  },
};
</script>
