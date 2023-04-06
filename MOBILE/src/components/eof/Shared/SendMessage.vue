<template>
  <div class="q-pt-md q-mb-sm">
    <div
      :class="{ invisible: !showMessages }"
      class="q-pa-md q-mt-lg column col"
    >
      <div style="">
        <q-chat-message
          v-for="(message, key) in order.Messages.filter(e => e.to_accountId == userInfo.id || e.to_accountId == null || e.accountId == userInfo.id )"
          :key="key"
          :name="'<b>'+getAccountById(message.accountId).account  + ' - ' + getAccountById(message.accountId).lastName + ' - ' + getAccountById(message.accountId).position  + '</b>'"
          :text="[message.text]"
          :sent="message.accountId == userInfo.id ? true : false"
          :bg-color="message.accountId == userInfo.id ? 'light-green-4' : 'light-green-2'"
          :stamp="message.createdAt | luc"
        >
        </q-chat-message>
      </div>
    </div>
    <div elevated>
      <div class="q-ml-sm q-mr-sm row">
        
        <q-form @submit="sendMessage" class="row col-12 ">
          
          <q-input
            v-model="newMessage"
            ref="newMessage"
            bg-color="white-2"
            color="primary"
            class="text-primary col-12 "
            outlined
            label="Message"
            dense
          >    
          <q-btn  class=" q-mr-sm"
                dense
                color="primary"
                round
                flat
                @click="changeSendAccount"
                :icon="icon"
              >
          </q-btn>
            <q-btn
              round
              dense
              flat
              @click="sendMessage"
              color="primary"
              icon="send"
            />
          </q-input>
        </q-form>
      </div>
    </div>
    <q-dialog v-model="registration" >
        <q-card>
          <q-card-section>
            <div class="text-h6" style="font-family: cursive;">Chọn người nhận tin nhắn</div>
            <q-select route class="col-2  q-mt-sm" @input="changeAccount" outlined v-model="accountSend" :options="listAccountOfOrder" label="Chọn người nhận" />
          </q-card-section> 
        </q-card>
      </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { fasPeopleArrows } from "@quasar/extras/fontawesome-v5";
import { fasUserFriends } from "@quasar/extras/fontawesome-v5";
export default {
  data() {
    return {
      showAddTask: false,
      newMessage: "",
      showMessages: true,
      listAccountOfOrder:[{
        label:"Tất cả", 
        id:null
      }],
      icon:fasUserFriends,
      registration:false,
      accountSend:{
        label:"Tất cả", 
        id:null
      }
    };
  },
  computed: {
    ...mapGetters("orders", ["order","getAccountById"]),
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("messages", ["messages"])
  },
  async created() {
    await this.getOneOrder(this.$route.query.id)
    await this.order.Requests.forEach(async e=> await this.listAccountOfOrder.push({
        label:e.position + " - " + this.getAccountById(e.accountId).lastName,
        id:e.accountId
      }) 
    )
    console.log('order',this.order.Requests)
  },
  methods: {
    ...mapActions("orders", [
      "getOneOrder",
      "resetOrderLine",
      "addMessage",
      "sendToApproved",
      "getAllRequests",
      "resetRequests"
    ]),
    sendMessage() {
      console.log("send");
      this.addMessage({
        id: "",
        accountId: this.userInfo.id,
        orderId: this.order.id,
        text: this.newMessage,
        to_accountId: this.accountSend.id
      });
      this.clearMessage();
    },
    clearMessage() {
      this.newMessage = "";
      this.$refs.newMessage.focus();
    },
    scrollToBottom() {
      let pageOrder = this.$refs.pageOrder.$el;
      setTimeout(() => {
        window.scrollTo(0, pageOrder.scrollHeight);
      }, 20);
    },
    async changeSendAccount(){
        this.registration = true;
    },
    async changeAccount(){
        if(this.accountSend.id == null){
          this.icon =  fasUserFriends
        }else{
          this.icon = fasPeopleArrows
        }

    },
     async sendMessagesSuccess(nameActive, nameSuccess, dataSuccess) {
      console.log("requests", this.request);
      //Gửi thông báo email cho các cấp nhận tin nhắn
      let baseUrl2 = null;
      let dataProfile2 = await this.getAccountByID(nextId);
      let departmentName2 = await this.GET_DEPARTMENTSBYID(
        this.request.departmentId
      );
      console.log("dataProfile", dataProfile2);
      let dataProfile3 = null;
            if (dataProfile2 === undefined) {
              dataProfile3 = 0;
            } else if (dataProfile2 == null) {
              dataProfile3 = 0;
            } else dataProfile3 = 1;
      if (dataProfile3 == 1) {
        // check nếu người nhận phiếu bật thông báo qua mail
        if (process.env.PROD) {
          baseUrl2 = `https://app.woodsland.com.vn:1001/#/yeu-cau-duyet?id=${this.nextId.id}`;
        } else {
          baseUrl2 = `http://localhost:8080/#/yeu-cau-duyet?id=${this.nextId.id}`;
        }
        let payloadMail = {
          baseUrl: baseUrl2,
          email: dataProfile2.EMAIL,
          accountId: this.request.accountId,
          toAccountId: this.nextId.accountId,
          subject: `Có đề xuất cần phê duyệt`,
          title: "Nhấp vào đây để đi tới xét duyệt",
          dataBody: `Có phiếu gửi tới - ${this.nextId.title} - người gửi : ${
            this.getAccountById(this.request.fromAccountId).lastName
          } - mã NV : ${
            this.getAccountById(this.request.fromAccountId).account
          } - phòng ban : ${departmentName2.NAME} `
        };
        await this.sendNotificationMail(payloadMail); //gửi thông báo mail
      }
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
        
      });

      let baseUrl = null;
        let dataProfile = await this.getAccountByID(this.request.fromAccountId);
        console.log("dataProfile", dataProfile);
        if (dataProfile.notificationMail) {
          // check nếu người nhận phiếu bật thông báo qua mail
          if (process.env.PROD) {
            baseUrl = `https://app.woodsland.com.vn:1001/#/${
              this.request.slug == "mua-hang"
                ? "de-xuat-mua-hang"
                : this.request.slug
            }?id=${this.request.orderId}`;
          } else {
            baseUrl = `http://localhost:8080/#/${
              this.request.slug == "mua-hang"
                ? "de-xuat-mua-hang"
                : this.request.slug
            }?id=${this.request.orderId}`;
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
      
    },
  }
};
</script>
