<template>
  <q-card-section>
    <div class="flex">
      <q-input
        class="q-mt-sm q-pr-sm"
        style="width: 50% !important"
        outlined
        v-model="order.OrderMeta[0].fullName"
        label="Tên tôi là : "
        :readonly="disable"
      />
      <q-input
        style="width: 50% !important"
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].maNV"
        label="Mã nhân viên : "
        :readonly="disable"
      />
    </div>
    <div class="flex">
      <q-input
        style="width: 50% !important"
        class="q-mt-sm q-pr-sm"
        outlined
        v-model="order.OrderMeta[0].position"
        label="Chức vụ : "
        :readonly="disable"
      />
      <q-input
        style="width: 50% !important"
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].department"
        label="Phòng ban/bộ phận : "
        :readonly="disable"
      />
    </div>
    <q-input
      class="q-mt-sm"
      v-if="order.proposalFormId != 1043"
      outlined
      v-model="order.OrderMeta[0].description"
      label="Lý do: "
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      v-if="order.proposalFormId == 1043"
      outlined
      v-model="order.OrderMeta[0].locationWork"
      label="Khách từ đâu đến : "
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      v-if="order.proposalFormId == 1043"
      outlined
      type="number"
      v-model="order.OrderMeta[0].total"
      label="Số lượng người : "
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      v-if="order.proposalFormId == 1043"
      outlined
      v-model="order.OrderMeta[0].work"
      label="Vị trí thăm quan : "
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      type="textarea"
      v-if="order.proposalFormId == 1043"
      outlined
      v-model="order.OrderMeta[0].description"
      label="Thông tin thêm : "
      :readonly="disable"
    />
    <div class="row q-mt-sm" v-if="order.proposalFormId == 1043">
      <div class="col-12 col-sm-6">
        <div class="text-h8"></div>
        <div class="">
          <q-input
            :readonly="disable"
            class="q-mb-sm"
            filled
            label="Thời gian từ :"
            fill-mask
            v-model="order.OrderMeta[0].dateStart"
            mask="##-##-#### ##:##"
            :hint="'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021 07:30)'"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    :readonly="disable"
                    mask="DD-MM-YYYY HH:mm"
                    v-model="order.OrderMeta[0].dateStart"
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
                    :readonly="disable"
                    v-model="order.OrderMeta[0].dateStart"
                    mask="DD-MM-YYYY HH:mm"
                    format24h
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <div class="text-h8"></div>
        <div class="">
          <q-input
            class="q-mb-sm"
            filled
            label="Thời gian đến :"
            v-model="order.OrderMeta[0].dateEnd"
            mask="##-##-#### ##:##"
            fill-mask
            :hint="'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021 16:30)'"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    :readonly="disable"
                    mask="DD-MM-YYYY HH:mm"
                    v-model="order.OrderMeta[0].dateEnd"
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
                    :readonly="disable"
                    v-model="order.OrderMeta[0].dateEnd"
                    mask="DD-MM-YYYY HH:mm"
                    format24h
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <div class="col" v-if="order.proposalFormId != 1043">
      <div class="text-h8">Thời gian ra :</div>
      <div class="">
        <q-input
          :readonly="!disable"
          class="q-mb-sm"
          filled
          v-model="order.OrderMeta[0].dateStart"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  :readonly="!disable"
                  mask="DD-MM-YYYY HH:mm"
                  v-model="order.OrderMeta[0].dateStart"
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
                  :readonly="!disable"
                  v-model="order.OrderMeta[0].dateStart"
                  mask="DD-MM-YYYY HH:mm"
                  format24h
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div class="col" v-if="order.proposalFormId != 1043">
      <div class="text-h8">Thời gian vào :</div>
      <div class="">
        <q-input
          :readonly="!disable"
          class="q-mb-sm"
          filled
          v-model="order.OrderMeta[0].dateEnd"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  :readonly="disable"
                  mask="DD-MM-YYYY HH:mm"
                  v-model="order.OrderMeta[0].dateEnd"
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
                  :readonly="disable"
                  v-model="order.OrderMeta[0].dateEnd"
                  mask="DD-MM-YYYY HH:mm"
                  format24h
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <footerCard
      :order="order"
      :nextId2="nextId2"
      :nextId3="nextId3"
      :nextId="nextId"
      :active1="activesa"
    ></footerCard>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import DxDateBox from "devextreme-vue/date-box";
import footerCard from "components/eofs/Shared/footerCard";
import DxButton from "devextreme-vue/button";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxLookup,
    DxDateBox,
    footerCard,
  },
  props: ["metaValue", "disable"],
  data() {
    return {
      active1: false,
      myDepartment: null,
      stepDepartment: null,
      departments: [],
      nextId2: null,
      nextId3: null,
      events: [],
      options: null,
      nameDepartmentName: null,
      account: [],
      active: false,
    };
  },
  async created() {
    // console.log("options", this.departments);
    this.order.Requests.sort(this.compareValues("star", "asc"));
    let idDis = null;
    for (let i = 0; i < this.order.Requests.length; i++) {
      if (this.order.Requests[i].id == this.$route.query.id) {
        // console.log(this.order.Requests[i]);
        idDis = this.order.Requests[i].star;
        // console.log("idDis", idDis);
      }
    }

    this.nextId = this.order.Requests.find((e) => e.star > idDis);
    // console.log("data", this.nextId);
    this.nextId2 = this.order.Requests.filter(
      (e) => e.star > this.request.star && e.position != "Phòng vật tư"
    );
    this.nextId3 = this.order.Requests.filter(
      (e) =>
        e.star > this.request.star &&
        (e.position == "Phòng vật tư" || e.position == "Phòng bảo vệ")
    );

    // console.log("this.nextId", this.nextId);
    // console.log("this.nextId2", this.nextId2);
    // console.log("this.nextId3", this.nextId3);
  },
  methods: {
    compareValues(key, order = "asc") {
      return function (a, b) {
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
    },
    async changed() {
      // console.log("changed");
      // console.log(
      //   "this.order.OrderMeta[0].position2 ",
      //   this.order.OrderMeta[0].position2
      // );
      // console.log("this.metaValue.account2.id", this.metaValue.accountName);
      this.order.OrderMeta[0].position2 = this.metaValue.accountName.position;
      let department222 = await this.GET_DEPARTMENTSBYID(
        this.metaValue.accountName.departmentId
      );
      // console.log("department2", department222);
      this.order.OrderMeta[0].department2 = department222.NAME;
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.options = this.account;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.options = this.account.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    ...mapActions("base", [
      "GET_DEPARTMENTSBYID",
      "GET_DEPARTMENTSALL",
      "GET_ACCOUNTS",
    ]),
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      "addorderMeta",
      "deleteOrderMeta",
      "updateOrderMeta",
    ]),

    chonCongDoan() {
      // console.log("myDepartment", this.myDepartment.value);
    },
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["myFactoryInfor", "userInfo", "dsCongDoans"]),
    activesa(){
    if (
      moment(
        moment(this.order.OrderMeta[0].dateStart, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        )
      ).isBefore(moment().format("YYYY-MM-DD"), "month") &&
      moment(
        moment(this.order.OrderMeta[0].dateStart, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        )
      ).isSameOrBefore(moment().format("YYYY-MM-DD"), "year")
    ) return this.active1 =true
    }
  },
};
</script>
