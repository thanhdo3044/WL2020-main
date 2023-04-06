<template>
  <div class="q-pt-md q-mb-sm">
    <div
      :class="{ invisible: !showMessages }"
      class="q-pa-md q-mt-lg column col"
    >
      <div style="">
        <q-chat-message
          v-for="(message, key) in order.Messages.filter(e => e.to_accountId == userInfo.id || e.to_accountId == null || e.accountId == userInfo.id)"
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
import moment from 'moment';
export default {
  props: ["order"],
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
    let orderDis = await this.getOneRequest(this.$route.query.id)
    console.log('orderDis',orderDis);
    await this.getOneOrder(orderDis.orderId)
    await this.order.Requests.forEach(async e=> {
        if(e.accountId != this.userInfo.id){
          await this.listAccountOfOrder.push({
            label:e.position + " - " + this.getAccountById(e.accountId).lastName,
            id:e.accountId
          }) 
        }
      }
    )
    this.listAccountOfOrder.push({
            label:this.getAccountById(this.order.accountId).position + " - " + this.getAccountById(this.order.accountId).lastName,
            id: this.order.accountId
          })
    console.log('order',this.order.Requests)
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
    ...mapActions("orders", [
      "getOneOrder",
      "resetOrderLine",
      "addMessage",
      "sendToApproved",
      "getAllRequests",
      "resetRequests","getAllAccounts"
    ]),
    async sendMessage() {
      console.log("send");
      await this.sendMessagesSuccess('hi','hi','hi')

      await this.addMessage({
        id: "",
        accountId: this.userInfo.id,
        orderId: this.order.id,
        text: this.newMessage,
        to_accountId: this.accountSend.id
      }).then(res=>{
        if(res)
        console.log('res',res)
        this.clearMessage();
      });

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
    //func base bắn thông báo qua FCM và Email createdby : HTHIEU(2021/03/22)
    async sendMessagesSuccess(nameActive, nameSuccess, dataSuccess) {
      if(this.accountSend.id == null){
        //Gửi thông báo email cho các cấp nhận tin nhắn
        let baseUrl2 = null;
        let profileAccountMail = [this.order.accountId]
        this.order.Requests.forEach(e=>{
          if(e.accountId != this.userInfo.id)
          profileAccountMail.push(e.accountId)
        })
        console.log('profileAccountMail',profileAccountMail)
        let payload = {
        notification: {
            title: "Thank for sub",
            body: "firebase cloud",
            icon: "https://cdn.quasar.dev/img/boy-avatar.png"
          }
        };
        await profileAccountMail.forEach(async e=> {
          let dataSerach = await this.getAccountByID(e)
          let payloadGetToken = {
            accountId: e
          };
          let dataFCMSuccess = await this.getTokenFCM(payloadGetToken);
          console.log("dataFCMSuccess", dataFCMSuccess.data.data);
          await dataFCMSuccess.data.data.forEach(async res => {
            if (res.tokenFCM != "undefined") {
                if(res.accountId == this.order.accountId){
                  let baseUrl2="";
                      // check môi trường nhận phiếu bật thông báo qua FCM
                      if (process.env.PROD) {
                          baseUrl2 = `https://app.woodsland.com.vn:1001/#/${this.order.slug == 'mua-hang' ? 'de-xuat-mua-hang' : this.order.slug }?id=${this.order.id}`;
                        } else {
                          baseUrl2 = `http://localhost:8080/#/${this.order.slug == 'mua-hang' ? 'de-xuat-mua-hang' : this.order.slug }?id=${this.order.id}`;
                        }
                  let dataSendFCM = await this.$sendMessageActiveReq(
                  `Có tin nhắn mới - ${this.order.title} ${this.order.number}/${moment().format('YYYY')}`,
                  `${this.userInfo.lastName} (${this.userInfo.position}) : ${this.newMessage}`,
                  `${this.order.slug == 'mua-hang' ? 'de-xuat-mua-hang' : this.order.slug }`,
                  `${this.order.id}`,
                  payload,
                  res.tokenFCM
                  );
                  let payloadFCM = {
                    // lưu thông tin gửi thông báo FCM
                    baseUrl: baseUrl2,
                    email: "null",
                    accountId: this.userInfo.id,
                    toAccountId: this.getAccountById(res.accountId).id,
                    tokenFCM: res.tokenFCM,
                    messageId: dataSendFCM.data.results[0].message_id,
                    dataBody:`${this.userInfo.lastName} (${this.userInfo.position}) : ${this.newMessage}`
                  };
                  await this.sendNotificationMail(payloadFCM); //lưu thông tin FCM
                }else if(res.accountId != this.order.accountId){
                  console.log('fcm2')
                      let request = await this.order.Requests.filter(element =>  element.accountId == res.accountId)
                      if(request[0].show == true){
                          let baseUrl2="";
                      // check môi trường nhận phiếu bật thông báo qua FCM
                      if (process.env.PROD) {
                          baseUrl2 = `https://app.woodsland.com.vn:1001/#/yeu-cau-duyet?id=${request[0].id}`;
                        } else {
                          baseUrl2 = `http://localhost:8080/#/yeu-cau-duyet?id=${request[0].id}`;
                        }
                      let dataSendFCM = await this.$sendMessageActiveReq(
                      `Có tin nhắn mới - ${this.order.title} ${this.order.number}/${moment().format('YYYY')}`,
                      `${this.userInfo.lastName} (${this.userInfo.position}) : ${this.newMessage}`,
                      `yeu-cau-duyet`,
                      `${this.order.id}`,
                      payload,
                      res.tokenFCM
                      );
                      let payloadFCM = {
                        // lưu thông tin gửi thông báo FCM
                        baseUrl: baseUrl2,
                        email: "null",
                        accountId: this.userInfo.id,
                        toAccountId: this.getAccountById(res.accountId).id,
                        tokenFCM: res.tokenFCM,
                        messageId: dataSendFCM.data.results[0].message_id,
                        dataBody: `${this.userInfo.lastName} (${this.userInfo.position}) : ${this.newMessage}`
                      };
                      await this.sendNotificationMail(payloadFCM); //lưu thông tin FCM
                      }
                      
                }
            }
          });
          if(dataSerach.notificationMail){
            // check nếu người nhận phiếu bật thông báo qua mail
            if(e == this.order.accountId){
            let slug = this.order.slug
            if(this.order.slug == "mua-hang")  slug="de-xuat-mua-hang"
            let baseUrl2="";
              // check môi trường nhận phiếu bật thông báo qua mail
              if (process.env.PROD) {
                  baseUrl2 = `https://app.woodsland.com.vn:1001/#/${slug}?id=${this.order.id}`;
                } else {
                  baseUrl2 = `http://localhost:8080/#/${slug}?id=${this.order.id}`;
                }
                let payloadMail = {
                  baseUrl: baseUrl2,
                  email: dataSerach.EMAIL,
                  accountId: this.userInfo.id,
                  toAccountId: e,
                  subject: `Có tin nhắn mới - ${this.order.title}`,
                   title: `${this.userInfo.lastName} (${this.userInfo.position}) : ${this.newMessage}`,
                      dataBody: ``
                };
                await this.sendNotificationMail(payloadMail); //gửi thông báo mail
            }else if(e == this.userInfo.id){
              console.log('người gửi k cần nhận tin nhắn')
            }else{
                  let request = await this.order.Requests.filter(element =>  element.accountId ==e)
                  if(request[0].show == true){
                    let baseUrl2="";
                    // check môi trường nhận phiếu bật thông báo qua mail
                    if (process.env.PROD) {
                      baseUrl2 = `https://app.woodsland.com.vn:1001/#/yeu-cau-duyet?id=${request[0].id}`;
                    } else {
                      baseUrl2 = `http://localhost:8080/#/yeu-cau-duyet?id=${request[0].id}`;
                    }
                    let payloadMail = {
                      baseUrl: baseUrl2,
                      email: dataSerach.EMAIL,
                      accountId: this.userInfo.id,
                      toAccountId: e,
                      subject: `Có tin nhắn mới - ${request[0].title}`,
                      title: `${this.userInfo.lastName} (${this.userInfo.position}) : ${this.newMessage}`,
                      dataBody: ``
                    };
                    this.sendNotificationMail(payloadMail); //gửi thông báo mail
                  }
            }
          }
        })
      }
      else{
        //Gửi thông báo email cho các cấp nhận tin nhắn
        let baseUrl2 = null;
        let profileAccountMail = [this.accountSend.id]
        console.log('profileAccountMail',profileAccountMail)
        let payload = {
        notification: {
            title: "Thank for sub",
            body: "firebase cloud",
            icon: "https://cdn.quasar.dev/img/boy-avatar.png"
          }
        };
        await profileAccountMail.forEach(async e=> {
          let dataSerach = await this.getAccountByID(e)
          let payloadGetToken = {
            accountId: e
          };
          let dataFCMSuccess = await this.getTokenFCM(payloadGetToken);
          console.log("dataFCMSuccess", dataFCMSuccess.data.data);
          await dataFCMSuccess.data.data.forEach(async res => {
            if (res.tokenFCM != "undefined") {
                if(res.accountId == this.order.accountId){
                  let baseUrl2="";
                      // check môi trường nhận phiếu bật thông báo qua FCM
                      if (process.env.PROD) {
                          baseUrl2 = `https://app.woodsland.com.vn:1001/#/${this.order.slug == 'mua-hang' ? 'de-xuat-mua-hang' : this.order.slug }?id=${this.order.id}`;
                        } else {
                          baseUrl2 = `http://localhost:8080/#/${this.order.slug == 'mua-hang' ? 'de-xuat-mua-hang' : this.order.slug }?id=${this.order.id}`;
                        }
                  let dataSendFCM = await this.$sendMessageActiveReq(
                  `Có tin nhắn mới - ${this.order.title} ${this.order.number}/${moment().format('YYYY')}`,
                  `${this.userInfo.lastName} (${this.userInfo.position}) : ${this.newMessage}`,
                  `${this.order.slug == 'mua-hang' ? 'de-xuat-mua-hang' : this.order.slug }`,
                  `${this.order.id}`,
                  payload,
                  res.tokenFCM
                  );
                  let payloadFCM = {
                    // lưu thông tin gửi thông báo FCM
                    baseUrl: baseUrl2,
                    email: "null",
                    accountId: this.userInfo.id,
                    toAccountId: this.getAccountById(res.accountId).id,
                    tokenFCM: res.tokenFCM,
                    messageId: dataSendFCM.data.results[0].message_id,
                    dataBody:`${this.userInfo.lastName} (${this.userInfo.position}) : ${this.newMessage}`
                  };
                  await this.sendNotificationMail(payloadFCM); //lưu thông tin FCM
                }else if(res.accountId != this.order.accountId){
                  console.log('fcm2')
                      let request = await this.order.Requests.filter(element =>  element.accountId == res.accountId)
                      if(request[0].show == true){
                          let baseUrl2="";
                      // check môi trường nhận phiếu bật thông báo qua FCM
                      if (process.env.PROD) {
                          baseUrl2 = `https://app.woodsland.com.vn:1001/#/yeu-cau-duyet?id=${request[0].id}`;
                        } else {
                          baseUrl2 = `http://localhost:8080/#/yeu-cau-duyet?id=${request[0].id}`;
                        }
                      let dataSendFCM = await this.$sendMessageActiveReq(
                      `Có tin nhắn mới - ${this.order.title} ${this.order.number}/${moment().format('YYYY')}`,
                      `${this.userInfo.lastName} (${this.userInfo.position}) : ${this.newMessage}`,
                      `yeu-cau-duyet`,
                      `${this.order.id}`,
                      payload,
                      res.tokenFCM
                      );
                      let payloadFCM = {
                        // lưu thông tin gửi thông báo FCM
                        baseUrl: baseUrl2,
                        email: "null",
                        accountId: this.userInfo.id,
                        toAccountId: this.getAccountById(res.accountId).id,
                        tokenFCM: res.tokenFCM,
                        messageId: dataSendFCM.data.results[0].message_id,
                        dataBody: `${this.userInfo.lastName} (${this.userInfo.position}) : ${this.newMessage}`
                      };
                      await this.sendNotificationMail(payloadFCM); //lưu thông tin FCM
                      }
                      
                }
            }
          });
          if(dataSerach.notificationMail){
            // check nếu người nhận phiếu bật thông báo qua mail
            if(e == this.order.accountId){
            let slug = this.order.slug
            if(this.order.slug == "mua-hang")  slug="de-xuat-mua-hang"
            let baseUrl2="";
              // check môi trường nhận phiếu bật thông báo qua mail
              if (process.env.PROD) {
                  baseUrl2 = `https://app.woodsland.com.vn:1001/#/${slug}?id=${this.order.id}`;
                } else {
                  baseUrl2 = `http://localhost:8080/#/${slug}?id=${this.order.id}`;
                }
                let payloadMail = {
                  baseUrl: baseUrl2,
                  email: dataSerach.EMAIL,
                  accountId: this.userInfo.id,
                  toAccountId: e,
                  subject: `Có tin nhắn mới - ${this.order.title}`,
                   title: `${this.userInfo.lastName} (${this.userInfo.position}) : ${this.newMessage}`,
                      dataBody: ``
                };
                await this.sendNotificationMail(payloadMail); //gửi thông báo mail
            }else if(e == this.userInfo.id){
              console.log('người gửi k cần nhận tin nhắn')
            }else{
                  let request = await this.order.Requests.filter(element =>  element.accountId ==e)
                  if(request[0].show == true){
                    let baseUrl2="";
                    // check môi trường nhận phiếu bật thông báo qua mail
                    if (process.env.PROD) {
                      baseUrl2 = `https://app.woodsland.com.vn:1001/#/yeu-cau-duyet?id=${request[0].id}`;
                    } else {
                      baseUrl2 = `http://localhost:8080/#/yeu-cau-duyet?id=${request[0].id}`;
                    }
                    let payloadMail = {
                      baseUrl: baseUrl2,
                      email: dataSerach.EMAIL,
                      accountId: this.userInfo.id,
                      toAccountId: e,
                      subject: `Có tin nhắn mới - ${request[0].title}`,
                      title: `${this.userInfo.lastName} (${this.userInfo.position}) : ${this.newMessage}`,
                      dataBody: ``
                    };
                    this.sendNotificationMail(payloadMail); //gửi thông báo mail
                  }
            }
          }
        })
      }
    },
  }
};
</script>
