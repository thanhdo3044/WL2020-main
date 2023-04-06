<template>
  <q-page class="bg-blue-grey-7">
    <q-btn
      class="q-ml-sm q-mt-sm bg-orange text-white shadow-5"
      size="12px"
      id="back"
      v-go-back.single
      icon="arrow_back"
      push
      label="Quay lại"
    />
    <!-- <q-card class="q-pa-sm q-ma-sm shadow-10">
      <q-tree
        :nodes="customize"
        node-key="label"
        selected-color="primary"
        default-expand-all
      >
        <template v-slot:default-header="prop">
          <div class="row items-center">
            <q-icon
              :name="prop.node.icon || 'share'"
              color="orange"
              size="28px"
              class="q-mr-sm"
            />
            <div class="text-weight-bold text-primary">
              {{ prop.node.label }}
            </div>
          </div>
        </template>
        <template v-slot:header-generic="prop">
          <div class="row items-center">
            <q-icon
              :name="prop.node.icon || 'star '"
              color="orange"
              size="28px"
              class="q-mr-sm"
            />
            <div
              @click="themDeXuat(prop)"
              class="text-weight-bold text-primary"
              
            >
              {{ prop.node.label }}
            </div>
          </div>
        </template>

        <template v-slot:body-story="prop">
          <span class="text-weight-thin">The story is:</span>
          {{ prop.node.story }}
        </template>

        <template v-slot:body-toggle="prop">
          <p class="text-caption">{{ prop.node.caption }}</p>
          <q-toggle
            v-model="prop.node.enabled"
            label="I agree to the terms and conditions"
          />
        </template>
      </q-tree>
    </q-card> -->
    <q-card class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg bg-blue-grey-7" style="border:2px solid white">
      <div class="col-12 q-ml-sm q-mt-sm text-bold text-h6 text-positive">
        Nhân sự
      </div>
      <div
        v-for="ph in bieuMaus
          .filter(
            (e) =>
              e.id == 1043 ||
              e.id == 1032 ||
              e.id == 1036 ||
              e.id == 1033 ||
              e.id == 1034 ||
              e.id == 1035 ||
              e.id == 1045 ||
              e.id == 1046 ||
              e.id == 16 ||
              e.id == 14 ||
              e.id == 12 ||
              e.id == 1042
          )
          .sort((a, b) => a.name.length - b.name.length)"
        :key="ph.id"
        class="col-3 col-sm-2 q-mt-sm q-pa-sm"
        id="badge-master"
      >
        <!-- <q-badge id="badge" color="red"
              >+</q-badge> -->

        <div class="flex flex-center">
          <div
            class="bg-white flex flex-center"
            style="border-radius: 12px; width: 60px; height: 60px"
            avatar
          >
            <q-btn
              dense
              style="font-size: 20px; position: relative"
              color="primary"
              round
              :icon="changeIconNS(ph)"
              v-on:click="themDeXuat(ph)"
            >
            </q-btn>
            <!-- <div style="font-size:24px;position:absolute; left:50px">
                a
              </div> -->
          </div>
        </div>
        <div style="text-align: center; font-size: 12px; margin-top: 8px; color:white">
          {{ ph.name }}
        </div>
      </div>
    </q-card>
    <q-card class="row q-mt-sm q-ml-sm q-mr-sm q-mb-lg bg-blue-grey-7" style="border: 2px solid white">
      <div class="col-12 q-ml-sm q-mt-sm text-bold text-h6 text-positive">
        Vật tư
      </div>
      <div
        @click="to(ph.PATH)"
        v-for="ph in bieuMaus
          .filter((e) => e.id == 1028 || e.id == 1029)
          .sort((a, b) => a.name.length - b.name.length)"
        :key="ph.id"
        class="col-3 col-sm-2 q-mt-sm q-pa-sm"
        id="badge-master"
      >
        <!-- <q-badge id="badge" color="red"
              >+</q-badge> -->

        <div class="flex flex-center">
          <div
            class="bg-white flex flex-center"
            style="border-radius: 12px; width: 60px; height: 60px"
            avatar
          >
            <q-btn
              dense
              style="font-size: 20px; position: relative"
              color="primary"
              round
              :icon="changeIconNS(ph)"
              v-on:click="themDeXuat(ph)"
            >
            </q-btn>
            <!-- <div style="font-size:24px;position:absolute; left:50px">
                a
              </div> -->
          </div>
        </div>
        <div style="text-align: center; font-size: 12px; margin-top: 8px; color: white">
          {{ ph.name }}
        </div>
      </div>
    </q-card>
    <q-btn
      @click="activeHistory"
      push
      id="active"
      class="bg-primary q-ml-sm text-white q-mb-sm shadow-5"
      label="Lịch sử hoàn thành phê duyệt"
    >
    </q-btn>
    <div class="q-ml-sm text-bold">Trong tiến trình xử lý :</div>
    <div>
      <no-tasks
        class="q-mr-sm q-ml-sm"
        v-if="orders.data && !orders.data.length"
      ></no-tasks>
      <tasks-todo
        class="q-mr-sm"
        v-else
        @update-order="updateOrder"
        :tasksTodo="dataListOrderOnRq"
      />
    </div>

    <q-dialog
      v-model="history"
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <q-card>
        <q-card-section>
          <div class="bg-orange-2" style="border-radius: 10px">
            <div
              class="bg-primary q-pa-lg text-bold text-white text-center"
              style="border-radius: 10px; font-size: 16px"
            >
              Tìm kiếm dữ liệu
            </div>
            <div class="">
              <q-input filled v-model="dateStart" label="Thời gian từ :">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        mask="YYYY-MM-DD"
                        @input="searchData"
                        v-model="dateStart"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="">
              <q-input filled v-model="dateEnd" label="Thời gian đến :">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        @input="searchData"
                        mask="YYYY-MM-DD"
                        v-model="dateEnd"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <tasks-todo :tasksTodo="successOrder" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showAddTask">
      <add-task
        @close="showAddTask = false"
        :order="order"
        :dataErrorTime="dataErrorTime"
      />
    </q-dialog>
    <q-page-scroller
      position="bottom-left"
      :scroll-offset="50"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="primary" />
    </q-page-scroller>
    <!-- <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="primary" />
    </q-page-sticky> -->
  </q-page>
</template>

<script>
import { fasNewspaper } from "@quasar/extras/fontawesome-v5";
import { fasShoppingBag } from "@quasar/extras/fontawesome-v5";
import { fasToriiGate } from "@quasar/extras/fontawesome-v5";
import { fasCalendarCheck } from "@quasar/extras/fontawesome-v5";
import { fasUserAltSlash } from "@quasar/extras/fontawesome-v5";
import { fasPlaneDeparture } from "@quasar/extras/fontawesome-v5";
import { fasShoppingCart } from "@quasar/extras/fontawesome-v5";
import { fasShoppingBasket } from "@quasar/extras/fontawesome-v5";
import { fasCreditCard } from "@quasar/extras/fontawesome-v5";
import { fasMoneyCheckAlt } from "@quasar/extras/fontawesome-v5";
import { fasMoneyBillAlt } from "@quasar/extras/fontawesome-v5";
import { fasMoneyBill } from "@quasar/extras/fontawesome-v5";
import { fasMoneyBillWaveAlt } from "@quasar/extras/fontawesome-v5";
import { fasMoneyBillWave } from "@quasar/extras/fontawesome-v5";
import { fasCalendarPlus } from "@quasar/extras/fontawesome-v5";
import { fasExchangeAlt } from "@quasar/extras/fontawesome-v5";
import { fasDollarSign } from "@quasar/extras/fontawesome-v5";

import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import axios from "axios";
export default {
  data() {
    return {
      dateStart: moment().format("YYYY-MM-DD"),
      dateEnd: moment().format("YYYY-MM-DD"),
      iconNS: null,
      fasShoppingCart: fasShoppingCart,
      history: false,
      showAddTask: false,
      order: {},
      title: "",
      proposalForms: [],
      ordersData: null,
      dataOrder: null,
      selected: null,
      expandedRowKeys: [],
      selectedRowKeys: [],
      dSBieuMauSuDung: null,
      dataListOrder: null,
      dataListOrderOnRq: null,
      successOrder: null,
      customize: [
        {
          label: "Danh sách đề xuất",
          header: "root",
          children: [],
        },
      ],
      dataErrorTime: [],
      listParentNS: [], // phòng Nhân sự
      listParentOutGate: [], //parent Ra cổng
      listParentBuyItem: [], //parent mua hàng
      listParentVT: [], // phòng Vật tư
    };
  },
  computed: {
    ...mapGetters("orders", ["orders"]),
    ...mapGetters("base", ["userInfo"]),
    bieuMaus() {
      if (this.dSBieuMauSuDung)
        return this.dSBieuMauSuDung.map((bieuMau) =>
          bieuMau.parentId ? bieuMau : { ...bieuMau, parentId: 0 }
        );
      return [];
    },
  },
  methods: {
    ...mapActions("orders", ["getAllOrders", "resetOrder", "getOrderByStatus", "getOrderByStatusAndDate"]),
    ...mapActions("document", ["getDocument", "importDocument"]),
    async searchData() {
      const payload = {
        accountId: this.userInfo.id,
        status: "Đã được duyệt",
        from: this.dateStart,
        to: this.dateEnd
      }
      let data = await this.getOrderByStatusAndDate(payload);
      this.successOrder = data.data;
      console.log("data search", this.successOrder);
    },
    changeIconNS(data) {
      if (data.id == 12) {
        return (this.iconNS = fasCalendarPlus);
      } else if (
        data.id == 1032 ||
        data.id == 1033 ||
        data.id == 1034 ||
        data.id == 1035 ||
        data.id == 1045 ||
        data.id == 1046 ||
        data.id == 1036
      ) {
        return (this.iconNS = fasToriiGate);
      } else if (data.id == 1042) {
        return (this.iconNS = fasCalendarCheck);
      } else if (data.id == 16) {
        return (this.iconNS = fasUserAltSlash);
      } else if (data.id == 14) {
        return (this.iconNS = fasPlaneDeparture);
      } else if (data.id == 1026) {
        return (this.iconNS = fasShoppingCart);
      } else if (data.id == 1028) {
        return (this.iconNS = fasShoppingBasket);
      } else if (data.id == 1029) {
        return (this.iconNS = fasCreditCard);
      } else if (data.id == 1031) {
        return (this.iconNS = fasShoppingBag);
      } else if (data.id == 1037) {
        return (this.iconNS = fasMoneyCheckAlt);
      } else if (data.id == 1038) {
        return (this.iconNS = fasMoneyBillAlt);
      } else if (data.id == 1039) {
        return (this.iconNS = fasMoneyBill);
      } else if (data.id == 1040) {
        return (this.iconNS = fasMoneyBillWave);
      } else if (data.id == 1041) {
        return (this.iconNS = fasMoneyBillWaveAlt);
      } else if (data.id == 1043) {
        return (this.iconNS = fasExchangeAlt);
      } else if (data.id == 1044) {
        return (this.iconNS = fasDollarSign);
      }
    },
    activeHistory() {
      this.history = true;
    },
    selected2(target) {
      console.log("", target);
    },
    themDeXuat(proposalForm) {
      if (proposalForm.id == 1044) this.$router.push("/phieu-luong-all");
      console.log(proposalForm);
      this.order = Object.assign(
        {},
        {
          accountId: this.userInfo.id,
          proposalFormId: proposalForm.id,
          departmentId: this.userInfo.departmentId,
          title: proposalForm.name,
          factoryId: this.userInfo.factoryId,
          slug: proposalForm.slug,
          lyDo : proposalForm.id = 16 ? 'Lý do cá nhân' : null
        }
      );
      this.showAddTask = true;
      // if (
      //   proposalForm.node.id != 18 &&
      //   proposalForm.node.id != 1024 &&
      //   proposalForm.node.id  != 15
      //   &&proposalForm.node.id != 1028
      // ) {
      //   this.order = Object.assign(
      //     {},
      //     {
      //       accountId: this.userInfo.id,
      //       proposalFormId: proposalForm.node.id,
      //       departmentId: this.userInfo.departmentId,
      //       title: proposalForm.node.label,
      //       factoryId: this.userInfo.factoryId,
      //       slug: proposalForm.node.slug
      //     }
      //   );
      //   console.log(this.order);
      //   this.showAddTask = true;
      // } else {
      // }
    },
    goBack() {
      this.$router.go(-2);
    },
    async updateOrder() {
      await this.loadData();
    },
    async loadData() {
      const payload = {
        accountId: this.userInfo.id,
        status: "Mới"
      }
      this.dataOrder = await this.getOrderByStatus(payload);
      console.log("dataOrder", this.dataOrder);
      const { data } = await axios.get(
        "/api/v2/accountForm?accountId=" + this.userInfo.id
      );
      this.dSBieuMauSuDung = data.data;
      this.dataListOrderOnRq = await this.dataOrder.data.filter(
        (e) => e.status == "Mới"
      );
    },
  },
  components: {
    "add-task": require("components/eof/Requests/Modals/AddTask.vue").default,
    "tasks-todo": require("components/eof/Requests/TasksTodo.vue").default,
    "no-tasks": require("components/eof/Requests/NoTasks.vue").default,
  },
  async created() {
    await this.loadData();
    this.dataErrorTime = await this.getDocument({
      account: this.userInfo.account,
    });

    console.log(this.dataErrorTime);
    // let data3=  this.$subcriberTopic(123);
  },
  mounted() {
    this.$root.$on("showAddOrder", () => {
      this.showAddTask = true;
    });
    this.proposalForms = this.dSBieuMauSuDung;
  },
};
</script>
<style scoped>
.dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-inserted):not(.dx-row-removed):not(.dx-edit-row)
  > td:not(.dx-focused) {
  background-color: #6f8aa5;
  color: #333;
}
.dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-inserted):not(.dx-row-removed):not(.dx-edit-row)
  > td:not(.dx-focused).dx-datagrid-group-space {
  border-right-color: #6f8aa5;
}
.dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-inserted):not(.dx-row-removed):not(.dx-edit-row)
  > .dx-datagrid-readonly
  .dx-texteditor
  .dx-texteditor-input {
  background-color: #6f8aa5;
  color: #333;
}
#active:hover {
  background-color: red !important;
  -ms-transform: skewY(2.5deg); /* IE 9 */
  transform: skewY(2.5deg);
}
#back:hover {
  background-color: orangered !important;
  -ms-transform: skewY(2.5deg); /* IE 9 */
  transform: skewY(2.5deg);
}
</style>
