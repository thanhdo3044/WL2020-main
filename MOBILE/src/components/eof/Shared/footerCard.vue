<template>
  <div>
    <!-- Hiển thị hủy - duyệt -(duyệt toàn bộ - cho các cấp dưới BanTGD) -->
    <div
      v-if="
        (request.status == 'Chưa ký' ||
          request.status == 'Không' ||
          request.status == 'Ủy quyền') &&
          request.position != 'Phòng vật tư' &&
          request.position != 'Phòng bảo vệ'
      "
      class="q-ma-sm"
    >
      <q-btn
        @click="promptToDelete(request)"
        color="red"
        icon="clear"
        label="Hủy"
        class="q-mr-sm"
        v-if="
          (request.accountIdAuthorised != null &&
            request.isAuthority == true &&
            request.accountId != userInfo.id) ||
            (request.accountIdAuthorised == null &&
              request.isAuthority == false &&
              request.accountId == userInfo.id) ||
            request.accountId2 != null
        "
      />
      <q-btn
        @click="completedToRequest(request)"
        color="primary"
        icon="done"
        label="Duyệt"
        v-if="
          (request.accountIdAuthorised != null &&
            request.isAuthority == true &&
            request.accountId != userInfo.id) ||
            (request.accountIdAuthorised == null &&
              request.isAuthority == false &&
              request.accountId == userInfo.id) ||
            request.accountId2 != null
        "
      />
      <q-btn
        @click="completedToRequestSuccess(request)"
        class="q-mt-sm row"
        color="orange"
        icon="done"
        label="Duyệt toàn bộ"
        v-if="
          (request.accountIdAuthorised != null &&
            request.isAuthority == true &&
            request.accountId != userInfo.id) ||
            (request.position != 'Ban TGĐ' &&
              request.accountIdAuthorised == null &&
              request.isAuthority == false &&
              request.accountId == userInfo.id) ||
            request.accountId2 != null
        "
      />
    </div>
    <!-- Action cho Ban TGĐ  -->
    <div v-else class="q-ma-sm">
      <div v-if="nameDepartmentName.NAME == 'Ban TGD'">
        <q-btn
          @click="promptToDelete(request)"
          color="red"
          icon="clear"
          label="Hủy khẩn cấp"
        />
      </div>
    </div>
    <!-- Hiển thị thông tin được ủy quyền và ủy quyền  -->
    <q-card-section style="margin-left:-8px" v-if="statusAuthority == true">
      <div class="text-subtitle2 q-mt-sm">
        Được ủy quyền từ : {{ request.timeStartAuthority }}
      </div>
      <div class="text-subtitle2 q-mt-sm">
        Thời gian hết hạn : {{ request.timeEndAuthority.replace("tuần", " ") }}
      </div>
      <q-btn class="text-h6 bg-blue  text-white shadow-10">Được ủy quyền</q-btn>
    </q-card-section>
    <q-card-section>
      <div v-if="request.accountIdAuthorised == userInfo.id">
        <b
          >Được ủy quyền bởi : {{ dataAccount.ACCOUNT }} -
          {{ dataAccount.LAST_NAME }} - {{ dataAccount.POSITION }} - từ :
          {{ request.timeStartAuthorised }} ->
          {{ request.timeEndAuthorised }}</b
        >
      </div>
      <div
        v-if="
          request.accountIdAuthorised != userInfo.id &&
            request.isAuthority == true
        "
      >
        <b
          >Đã ủy quyền cho : {{ dataAccountAuthorised.ACCOUNT }} -
          {{ dataAccountAuthorised.LAST_NAME }} -
          {{ dataAccountAuthorised.POSITION }} -
          {{ accountAuthorisedDpm.NAME }} từ
          {{ request.timeStartAuthorised }} ->
          {{ request.timeEndAuthorised }}</b
        >
      </div>
    </q-card-section>
    <!-- Hiển thị quá thời hạn kí exprice -->
    <div v-if="request.status == 'Quá hạn'" class="q-ma-sm">
      <q-dialog persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar
              icon="signal_wifi_off"
              color="primary"
              text-color="white"
            />
            <span class="q-ml-sm">Quá hạn kí.</span>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <!-- Hiển thị trạng thái các cấp phê duyệt và thời gian phê duyệt gửi lên  -->
    <div
      v-if="
        request.position != 'Phòng vật tư' && request.position != 'Phòng bảo vệ'
      "
    >
      <q-card-section>
        <div class="text-h6">Được gửi lúc :</div>
        <div class="text-subtitle2">{{ request.createdAt | luc }}</div>
      </q-card-section>
      <q-card-section
        v-if="request.status == 'Đã ký' && request.successOrder == 1"
      >
        <q-btn class="text-h6 bg-primary  text-white shadow-10"
          >Đã xác nhận duyệt toàn bộ</q-btn
        >
        <!-- <div class="text-subtitle2">{{ request.updatedAt | luc }}</div> -->
      </q-card-section>
      <q-card-section v-else-if="request.status == 'Đã ký'">
        <q-btn class="text-h6 bg-primary  text-white shadow-10">Đã duyệt</q-btn>
        <!-- <div class="text-subtitle2">{{ request.updatedAt | luc }}</div> -->
      </q-card-section>

      <q-card-section v-else-if="request.status == 'Chưa ký'">
        <q-btn class="text-h6 bg-orange text-black shadow-10"
          >Chưa phê duyệt</q-btn
        >
        <!-- <div class="text-subtitle2">{{ request.updatedAt | luc }}</div> -->
      </q-card-section>
      <q-card-section v-else-if="request.status == 'Ủy quyền'">
        <q-btn class="text-h6 bg-orange text-black shadow-10"
          >Đã ủy quyền</q-btn
        >
        <!-- <div class="text-subtitle2">{{ request.updatedAt | luc }}</div> -->
      </q-card-section>
      <q-card-section v-if="request.status == 'Không'">
        <q-btn class="text-h6 bg-red  text-white shadow-10">Đã hủy</q-btn>
        <!-- <div class="text-subtitle2">{{ request.updatedAt | luc }}</div> -->
      </q-card-section>
      <q-card-section v-else-if="request.status == 'Quá hạn'">
        <div class="text-h6" style="color:red">Quá hạn phê duyệt</div>
        <!-- <div class="text-subtitle2">{{ request.updatedAt | luc }}</div> -->
      </q-card-section>
    </div>
    <div v-else-if="request.position == 'Phòng vật tư'">
      <div v-if="request.status == 'Không' || request.status == 'Chưa ký'">
        <!-- <div class="q-mb-sm">Ngày giờ dự kiến hoàn thành :</div>
        <q-input class="q-mb-sm" filled v-model="timeVTAccept">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date mask="DD-MM-YYYY" v-model="timeVTAccept">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input> -->
        <q-btn
          @click="completedToRequest(request)"
          color="primary"
          icon="done"
          label="Xác nhận"
        />
      </div>
      <div v-else>
        <!-- <div class="q-mb-sm">Ngày giờ dự kiến hoàn thành :</div>
        <q-input :readonly="true" class="q-mb-sm" filled v-model="timeVTAccept">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  :readonly="true"
                  mask="DD-MM-YYYY"
                  v-model="timeVTAccept"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input> -->
        <q-card-section v-if="request.status == 'Đã ký'">
          <q-btn class="text-h6 bg-primary  text-white shadow-10"
            >Đã xác nhận</q-btn
          >
          <!-- <div class="text-subtitle2">{{ request.updatedAt | luc }}</div> -->
        </q-card-section>
      </div>
    </div>
    <!-- Hiển thị nếu là phòng bảo vệ -->
    <!-- <div
      v-else-if="userInfo.account == 'BVTH' && request.slug = 'xac-nhan-cong'"
    >
      <div v-if="request.status == 'Không' || request.status == 'Chưa ký'">
        <q-btn
          @click="completedToRequest(request)"
          color="primary"
          icon="done"
          label="Xác nhận thời gian ra cổng"
        />
      </div>
      <div class="q-mt-sm">
        <q-card-section
          v-if="request.status == 'Đã ký' && request.timeVTAccept != null"
        >
          <div class="text-h6 bg-primary q-pl-sm text-white shadow-10">
            Đã xác nhận thời gian ra cổng lúc : {{ request.timeVTAccept }}
          </div>
        </q-card-section>
      </div>
    </div> -->
    <div
      v-else-if="userInfo.account == 'BVTH' && request.slug != 'xac-nhan-cong' && userInfo.account == 'BVYS' && userInfo.account == 'BVTB' && userInfo.account == 'BVNH' && userInfo.account == 'BVQM'"
    >
      <div v-if="request.status == 'Không' || request.status == 'Chưa ký'">
        <q-btn
          @click="completedToRequest(request)"
          color="primary"
          icon="done"
          label="Xác nhận thời gian ra cổng"
        />
      </div>
      <div
        v-else-if="
          request.status == 'Đã ký' &&
            request.timeVTAccept != null &&
            request.timeVTAcceptEnd == 'NULL'
        "
      >
        <q-btn
          @click="completedToRequest(request)"
          color="primary"
          icon="done"
          label="Xác nhận thời gian vào"
        />
      </div>
      <div class="q-mt-sm">
        <q-card-section
          v-if="request.status == 'Đã ký' && request.timeVTAccept != null"
        >
          <div class="text-h6 bg-primary q-pl-sm text-white shadow-10">
            Đã xác nhận thời gian ra cổng lúc : {{ request.timeVTAccept }}
          </div>
        </q-card-section>
        <q-card-section
          v-if="request.status == 'Đã ký' && request.timeVTAcceptEnd != 'NULL'"
        >
          <div class="text-h6 q-pl-sm bg-primary  text-white shadow-10">
            Đã xác nhận thời gian vào cổng lúc : {{ request.timeVTAcceptEnd }}
          </div>
          <!-- <div class="text-subtitle2">{{ request.updatedAt | luc }}</div> -->
        </q-card-section>
      </div>
    </div>
    <div
      v-else-if="userInfo.account == 'BVTH' && request.slug != 'xac-nhan-cong' && userInfo.account == 'BVYS' && userInfo.account == 'BVTB' && userInfo.account == 'BVNH' && userInfo.account == 'BVQM'"
    >
      <div v-if="request.status == 'Không' || request.status == 'Chưa ký'">
        <q-btn
          @click="completedToRequest(request)"
          color="primary"
          icon="done"
          label="Xác nhận thời gian ra cổng"
        />
      </div>
      <div class="q-mt-sm">
        <q-card-section
          v-if="request.status == 'Đã ký' && request.timeVTAccept != null"
        >
          <div class="text-h6 bg-primary q-pl-sm text-white shadow-10">
            Đã xác nhận thời gian ra cổng lúc : {{ request.timeVTAccept }}
          </div>
        </q-card-section>
      </div>
    </div>
  </div>
</template>

<script>
import { Notify, Loading, QSpinnerIos } from "quasar";
import moment from "moment";
import { uid } from "quasar";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["order", "nextId", "nextId2", "nextId3"],
  computed: {
    ...mapGetters("requests", ["request"]),
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("orders", ["getAccountById"])
  },
  methods: {
    ...mapActions("base", ["GET_DEPARTMENTSBYID", "getAccountByID"]),
    ...mapActions("requests", [
      "getOneRequest",
      "addRequest",
      "completedRequest",
      "completedRequest2",
      "cancelRequest",
      "activeRequestsMeta",
      "completedTimeVT",
      "deleteReqAuthority",
      "isAuthority",
      "confirmSuccessOrder",
      "deleteRequestById",
      "getTokenFCM",
      "sendNotificationMail"
    ]),
    ...mapActions("orders", ["getOneOrder", "sendToApproved"]),
    async loadData() {
      //   let data = await this.getOneRequest(this.query.id);
      //   console.log("dataorrder", data);
    },
    // ủy quyền
    async changeAuthority() {
      console.log("changeAuthority");
      console.log(
        "changeAuthority",
        moment()
          .add(2, "days")
          .calendar()
      );
      console.log("authority", this.authority);
      this.reqAuthority = [];
      this.reqAuthority.push({
        ...this.request,
        id: uid(),
        accountId: this.authority.value,
        position: "Người được ủy quyền" + " " + this.request.position,
        timeEndAuthority: this.timeEndAuthority,
        timeStartAuthority: this.timeStartAuthority,
        idReqAuthority: this.request.id,
        status: "Chưa ký",
        isAuthority: false
      });
      let payload = {
        id: this.request.id,
        isAuthority: 1
      };
      let deleteReqAuthority = await this.deleteReqAuthority(this.request.id);
      let isAuthority = await this.isAuthority(payload);
      let changeAuthority = await this.sendToApproved(this.reqAuthority);
      await this.loadData();
      console.log("reqAuthority", deleteReqAuthority);
      console.log("isAuthority", isAuthority);
      console.log("reqAuthority", this.reqAuthority);
      console.log("changeAuthority", changeAuthority);
    },
    // hủy phê duyệt
    promptToDelete(request) {
      this.$q
        .dialog({
          title: "Xác nhận",
          message: "Bạn thực sự muốn Hủy?",
          ok: {
            push: true
          },
          cancel: {
            color: "negative"
          },
          persistent: true
        })
        .onOk(async () => {
          let idOrderMeta = [];
          // let dataOrderMeta = await this.order.OrderMeta.filter(e => {
          //   idOrderMeta.push({
          //     id: e.id
          //   });
          // });
          console.log("idOrderMeta", idOrderMeta);
          idOrderMeta.forEach(async e => {
            let payload = {
              id: e.id,
              statusRequests: "Hủy"
            };
            let data = await this.activeRequestsMeta(payload);
            console.log(data);
          });
          await this.cancelRequest(request);
          this.$router.go(-1);
          let dataSuccess = "Đã hủy duyệt đề xuất";
          await this.sendMessagesSuccess(
            dataSuccess,
            this.request.fromAccountId,
            this.request.position
          );
        });
    },

    //fun base gửi tin nhắn khi các cấp active phê duyệt :  createdBy : HTHIEU(2021-01-26)
    async sendMessagesSuccess(nameActive, nameSuccess, dataSuccess) {
      console.log("requests", this.request);
      let payload = {
        notification: {
          title: "Thank for sub",
          body: "firebase cloud",
          icon: "https://cdn.quasar.dev/img/boy-avatar.png"
        }
      };
      let payloadGetToken = {
        accountId: this.request.fromAccountId
      };
      let dataFCMSuccess = await this.getTokenFCM(payloadGetToken);
      console.log("dataFCMSuccess", dataFCMSuccess.data.data);
      await dataFCMSuccess.data.data.forEach(async e => {
        if (e.tokenFCM != "undefined") {
          let dataSendFCM = await this.$sendMessageActiveReq(
            nameActive,
            `${this.request.title} đã được ${this.userInfo.position} - ${this.userInfo.lastName} phê duyệt `,
            `${this.request.slug}`,
            `${this.request.orderId}`,
            payload,
            e.tokenFCM
          );
          let payloadFCM = {
            // lưu thông tin gửi thông báo FCM
            email: "null",
            accountId: this.userInfo.id,
            toAccountId: this.getAccountById(e.accountId).id,
            tokenFCM: e.tokenFCM,
            messageId: dataSendFCM.data.results[0].message_id,
            dataBody: `${this.request.title} đã được ${this.userInfo.position} - ${this.userInfo.lastName} phê duyệt `
          };
          await this.sendNotificationMail(payloadFCM); //lưu thông tin FCM
        }
        let baseUrl = null;
        let dataProfile = await this.getAccountByID(this.request.fromAccountId);
        console.log("dataProfile", dataProfile);
        if (dataProfile.notificationMail) {
          // check nếu người nhận phiếu bật thông báo qua mail
          if (process.env.PROD) {
            baseUrl = `https://app.woodsland.com.vn:1001/#/${this.request.slug}?id=${this.request.orderId}`;
          } else {
            baseUrl = `http://localhost:8080/#/${this.request.slug}?id=${this.request.orderId}`;
          }
          let payloadMail = {
            baseUrl: baseUrl,
            email: dataProfile.EMAIL,
            accountId: this.userInfo.id,
            toAccountId: this.request.fromAccountId,
            subject: `Có đề xuất đã được  ${this.userInfo.lastName} phê duyệt`,
            title: "Nhấp vào đây để đi tới xét duyệt",
            dataBody: `${this.request.title} đã được ${this.userInfo.position} - ${this.userInfo.lastName} phê duyệt `
          };
          await this.sendNotificationMail(payloadMail); //gửi thông báo mail
        }
      });

      // gửi thông báo đề xuất cho cấp tiếp theo
      let payloadGetTokenStep = {
        accountId:
          this.nextId.accountId == undefined ? "" : this.nextId.accountId
      };
      let dataFCMStep = await this.getTokenFCM(payloadGetTokenStep);
      console.log("dataFCMStep", dataFCMStep.data.data);
      let departmentName = await this.GET_DEPARTMENTSBYID(
        this.request.departmentId
      );
      await dataFCMStep.data.data.forEach(async element => {
        this.$sendFcm(
          `Có phiếu gửi tới`,
          `${this.request.title} - người gửi : ${
            this.getAccountById(this.request.fromAccountId).lastName
          } - mã NV : ${
            this.getAccountById(this.request.fromAccountId).account
          } - phòng ban : ${departmentName.NAME}`,
          this.request.orderId,
          payload,
          element.tokenFCM
        );
      });
    },

    completedToRequest(request) {
      this.$q
        .dialog({
          title: "Xác nhận",
          message: "Bạn thực sự muốn Duyệt?",
          ok: {
            push: true
          },
          cancel: {
            color: "negative"
          },
          persistent: true
        })
        .onOk(async () => {
          // active nếu là phó phòng
          if (
            this.request.accountId2 != null &&
            this.request.accountId2 == this.userInfo.id
          ) {
            console.log("ok", this.nextId);
            let nextId = null;
            if (this.nextId === undefined) {
              nextId = "";
            } else if (this.nextId == null) {
              nextId = "";
            } else nextId = this.nextId.id;
            let payload = {
              request: request,
              nextId: nextId
            };
            this.completedRequest2(payload);
            this.$router.go(-1);

            let dataSuccess = "Phó phòng đã duyệt ";
            await this.sendMessagesSuccess(
              dataSuccess,
              this.request.fromAccountId,
              this.request.position
            );
          }

          //active req thông thường lên các cấp : user không phải là phó phòng
          if (
            this.request.position != "Phòng vật tư" &&
            this.request.position != "Phòng bảo vệ" &&
            this.request.accountId2Active == null &&
            this.request.accountId2 != this.userInfo.id
          ) {
            console.log("ok", this.nextId);
            let nextId = null;
            if (this.nextId === undefined) {
              nextId = "";
            } else if (this.nextId == null) {
              nextId = "";
            } else nextId = this.nextId.id;
            let payload = {
              request: request,
              nextId: nextId
            };
            this.completedRequest(payload);
            this.$router.go(-1);

            // let payloadNotifi = {
            //   notification: {
            //     title: "Thank for sub",
            //     body: "firebase cloud",
            //     icon: "https://cdn.quasar.dev/img/boy-avatar.png"
            //   }
            // };
            // let dataTokenFCM;
            let dataSuccess = "Có phiếu được duyệt";
            // Khi duyệt  bắn notification thành công cho người gửi -  createdby : HTHIEU(2021-01-26)
            await this.sendMessagesSuccess(
              dataSuccess,
              this.request.fromAccountId,
              this.request.position
            );
          } else if (this.request.position == "Phòng bảo vệ") {
            // Nếu req đc active là phòng bảo vệ
            if (
              this.request.status == "Đã ký" &&
              this.request.timeVTAccept != null
            ) {
              let payload = {
                statusAccept: "Đã ký",
                id: request.id,
                timeVTAcceptEnd:
                  moment().format("l") + " " + moment().format("LT"),
                timeVTAccept: this.request.timeVTAccept
              };
              this.completedTimeVT(payload);
              this.$router.go(-1);
              let dataSuccess = "Bảo vệ đã duyệt giờ vào";
              await this.sendMessagesSuccess(
                dataSuccess,
                this.request.fromAccountId,
                this.request.position
              );
            } else if (
              this.request.status == "Chưa ký" &&
              this.request.timeVTAccept == null
            ) {
              let payload = {
                statusAccept: "Đã ký",
                id: request.id,
                timeVTAccept:
                  moment().format("l") + " " + moment().format("LT"),
                timeVTAcceptEnd: "NULL"
              };

              this.completedTimeVT(payload);
              this.$router.go(-1);
              let dataSuccess = "Bảo vệ đã duyệt giờ ra";
              await this.sendMessagesSuccess(
                dataSuccess,
                this.request.fromAccountId,
                this.request.position
              );
            }
          } else if (this.request.position == "Phòng vật tư") {
            // Nếu req đc active là phòng vật tư
            let payload = {
              statusAccept: "Đã ký",
              id: request.id,
              timeVTAccept: this.timeVTAccept,
              position: this.request.position
            };
            this.completedTimeVT(payload);
            this.$router.go(-1);
            let dataSuccess = "Phòng vật tư đã xác nhận";
            await this.sendMessagesSuccess(
              dataSuccess,
              this.request.fromAccountId,
              this.request.position
            );
          }
        });
    },
    //Phê duyệt toàn bộ các cấp tiếp theo
    async completedToRequestSuccess(request) {
      this.$q
        .dialog({
          title: "Xác nhận",
          message: `<b>Bạn thực sự muốn hoàn thành tiến trình duyệt phiếu?</b>`,
          ok: {
            push: true
          },
          cancel: {
            color: "negative"
          },
          persistent: true,
          html: true
        })
        .onOk(async () => {
          if (
            this.request.position != "Phòng vật tư" &&
            this.request.position != "Phòng bảo vệ"
          ) {
            //
            console.log("nextId3", this.nextId3);
            let nextId = null;
            if (this.nextId3[0] == undefined) {
              nextId = "";
            } else if (this.nextId3[0] == null) {
              nextId = "";
            } else nextId = this.nextId3[0].id;
            let payload = {
              request: request,
              nextId: nextId
            };
            await this.completedRequest(payload);
            let payloadSuccessOrder = {
              id: request.id,
              successOrder: 1
            };
            await this.confirmSuccessOrder(payloadSuccessOrder);
            // xóa req các cấp tiếp theo
            this.nextId2.forEach(async e => await this.deleteRequestById(e.id));
            this.$router.go(-1);
            //Gửi meesages thông báo
            let dataSuccess = "Trưởng phòng xác nhận phê duyệt toàn bộ";
            await this.sendMessagesSuccess(
              dataSuccess,
              this.request.fromAccountId,
              this.request.position
            );
          }
        });
    },
    getMetaValue() {
      const { OrderMeta } = this.order;
      return JSON.parse(OrderMeta[0].metaValue);
    } // hàm sắp xếp động
  },
  data() {
    return {
      nameDepartmentName: null,
      timeVTAccept: null,
      authority: {
        label: null,
        value: null
      }, // người được ủy quyền
      listAuthority: [], // Danh sách người được ủy quyền
      reqAuthority: [],
      statusAuthority: false,
      timeEndAuthority: null,
      timeStartAuthority: null,
      dataAccountAuthorised: null,
      accountAuthorisedDpm: null,
      dataAccount: null
    };
  },
  mounted() {
    if (this.request.position == "Người được ủy quyền Trưởng bộ phận") {
      this.statusAuthority = true;
    } else if (this.request.position == "Người được ủy quyền Ban TGĐ") {
      this.statusAuthority = true;
    }
    this.timeVTAccept = this.request.timeVTAccept;
    console.log("this.dataTest", this.request.status);
    console.log(
      "moment().format('l');",
      moment().format("l") + " " + moment().format("LT")
    );
    if (this.request.status == "Quá hạn") {
      Notify.create({
        type: "negative",
        message: "Đã quá hạn phê duyệt!"
      });
    } else if (
      this.request.status == "Đã ký" &&
      this.request.successOrder == 1
    ) {
      Notify.create({
        type: "positive",
        message: "Đã xác nhận duyệt toàn bộ!"
      });
    } else if (this.request.status == "Đã ký") {
      Notify.create({
        type: "positive",
        message: "Đã phê duyệt!"
      });
    } else if (this.request.status == "Chưa ký") {
      Notify.create({
        type: "warning",
        message: "Chưa phê duyệt!"
      });
    } else if (this.request.status == "Không") {
      Notify.create({
        type: "negative",
        message: "Đã hủy phê duyệt!"
      });
    }
  },
  async created() {
    // await this.sendMessagesSuccess(1, 2, 3);
    this.dataAccountAuthorised = await this.getAccountByID(
      this.request.accountIdAuthorised
    );
    this.dataAccount = await this.getAccountByID(this.request.accountId);
    console.log("listAuthority", this.listAuthority);
    console.log("requests", this.request);
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(
      this.userInfo.departmentId
    );
    //phòng ban ng đc ủy quyền
    this.accountAuthorisedDpm = await this.GET_DEPARTMENTSBYID(
      this.dataAccountAuthorised == undefined
        ? 0
        : this.dataAccountAuthorised.departmentId
    );
    console.log("nameDepartmentName", this.nameDepartmentName);
    console.log("nextId", this.nextId.id);
  }
};
</script>

<style></style>
