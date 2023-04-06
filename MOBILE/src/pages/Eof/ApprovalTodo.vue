<template>
  <div>
    <q-page class="bg-blue-grey-7">
      <div class="row" style="">
        <div class="row col-12 col-sm-12">
          <div class="col-6 col-sm-6 q-pl-sm q-pr-sm">
            <div>
              <div
                class="wrapper flex flex-center"
                @click="activeRequestsPending"
                id="hover-card-left"
              >
                <div class="ring">
                  <div class="row">
                    <div class="col-12" align="center">
                      <q-btn
                        dense
                        class="bg-primary"
                        style="font-size: 20px; position: relative"
                        color="primary"
                        :icon="iconFasGlobe"
                        round
                      >
                      </q-btn>
                    </div>
                  </div>
                  <div style="font-size: 12px;margin-top:10px" class="text-center text-white">
                    Danh sách phiếu <br />
                    chờ phê duyệt
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6 col-sm-6 q-pl-sm q-pr-sm">
            <div>
              
              <div
                class="wrapper flex flex-center"
                @click="activeHistory"
                id="hover-card-left"
              >
                <div class="ring">
                  <div class="row">
                    <div class="col-12" align="center">
                      <q-btn
                        dense
                        class="bg-primary"
                        style="font-size: 20px; position: relative"
                        color="primary"
                        round
                        :icon="iconFasGlobe"
                      >
                      </q-btn>
                    </div>
                  </div>
                  <div style="font-size: 12px;margin-top:10px" class="text-center text-white">
                    Danh sách phiếu <br />
                    đã phê duyệt
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <q-dialog
        v-model="dataRequestPending"
        transition-show="scale"
        transition-hide="scale"
        class="bg-primary-2"
        style="top: 25% !important; bottom: 25% !important"
      >
        <q-card>
          <q-card-section>
            <div
              class="bg-primary q-pa-lg text-bold text-white text-center"
              style="border-radius: 10px; font-size: 16px"
            >
              Danh sách phiếu chờ duyệt
            </div>
            <div>
              <approvals-todo :requestsTodo="requestPending" />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <!-- <approvals-todo :requestsTodo="requestPending" /> -->
      <q-dialog
        v-model="history"
        transition-show="scale"
        transition-hide="scale"
        class="bg-primary-2"
        style="top: 25% !important; bottom: 25% !important"
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
            <div>
              <approvals-todo :requestsTodo="requestSuccess" />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { fasGlobe } from "@quasar/extras/fontawesome-v5";
import moment from "moment";
export default {
  methods: {
    ...mapActions("requests", [
      "getAllRequests",
      "searchSuccessReq",
      "getAllRequestsToday",
    ]),
    async activeHistory() {
      console.log("dasdasd");
      this.history = true;

      await this.searchData();
    },
    async activeRequestsPending() {
      let data = await this.getAllRequests(this.userInfo.id);
      console.log("activeRequestsPending", data);
      this.requestPending = [];
      // nếu là phòng bảo vệ
      if (
        this.userInfo.id === 101704 ||
        this.userInfo.id === 101954 ||
        this.userInfo.id === 101955 ||
        this.userInfo.id === 101818 ||
        this.userInfo.id === 101825 
      ) {
        await data.data.forEach((e) => {
          // request khi chưa hoàn thành, không phải ủy quyền, ngày tạo lớn hơn hoặc bằng ngày hôm đó
          if (
            e.completed == false &&
            !e.isAuthority &&
            e.createdAt >= moment().format("YYYY-MM-DD 00:00")
          ) {
            this.requestPending.push({
              ...e,
            });
          }
        });
        this.dataRequestPending = true;
      } else {
        await data.data.forEach((e) => {
          // request chưa hoàn thành, trạng thái khác đã ký và không ủy quyền
          // hoặc request tài khoản người ủy quyền bằng người đăng nhập và trạng thái là chưa ký
          if (
            (e.completed == false && e.status != "Đã ký" && !e.isAuthority) ||
            (e.accountIdAuthorised == this.userInfo.id && e.status != "Đã ký")
          ) {
            this.requestPending.push({
              ...e,
            });
          }
        });
        console.log("this.requestPending", this.requestPending);
        this.dataRequestPending = true;
      }
    },
    async loadData(data) {
      await data.forEach((element) => {
        if (element.completed == false) {
          this.requestPending.push(element);
        }
      });
    },
    async searchData() {
      let payload = {
        accountId: this.userInfo.id,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
      };
      let data = await this.searchSuccessReq(payload);
      this.requestSuccess = [];
      await data.data.data.forEach((element) => {
        if (element.status == "Đã ký") this.requestSuccess.push(element);
      });
    },
  },
  data() {
    return {
      history: false,
      requestSuccess: [],
      requestPending: [],
      dateStart: null,
      dateEnd: null,
      iconFasGlobe: fasGlobe,
      dataRequestPending: false,
    };
  },
  computed: {
    ...mapGetters("requests", ["requestsTodo"]),
    ...mapGetters("base", ["userInfo"]),
  },
  components: {
    "approvals-todo": require("components/eofs/Approvals/ApprovalsTodo.vue")
      .default,
    "no-approvals": require("components/eofs/Approvals/NoApprovals.vue")
      .default,
  },
  async mounted() {
    this.$root.$on("activeRequests", () => {
      this.activeRequestsPending();
    });
  },
  async created() {
    this.dateEnd = moment().format("YYYY-MM-DD");
    this.dateStart = moment().subtract(2, 'days').format("YYYY-MM-DD");
    // window.location.reload();
    await this.activeRequestsPending();
  },
};
</script>
