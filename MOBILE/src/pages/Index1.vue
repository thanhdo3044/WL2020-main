<template>
  <q-page class="q-mb-xl flex flex-center">
    <div align="center">
      <img alt="Quasar logo" src="statics/logo.png" />
      <p>
        <font size="3"><b>Woodsland 20</b></font>
      </p>
      <q-dialog v-model="registration" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6" style="font-family: cursive;">Để nhằm bảo mật và xác thực tài khoản 2 lớp . Vui lòng nhập đầy đủ thông tin Email và SĐT bên dưới . </br> Trân trọng cảm ơn  !</div>
          <q-input outlined v-model="email" label="Email" />
          <br />
          <q-input outlined v-model="phoneNumber" label="SĐT" />
          <br />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn  label="OK" @click="confirm" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>

      <!-- <p><font size="5"><b><big> W</big></b>oodsland</font>
       <font size="5"><b><big> M</big></b>anagement</font>
        <font size="5"><b><big> S</big></b>ystem</font></p>
      -->
      <!-- <div class="">
        <div id="notifi" @click="activeNotification" style="width:100px">
          <font-awesome-icon id="icon-notifi" :icon="icon" size="xl" />
          <span class="q-ml-sm">Thông báo</span>
        </div>
      </div> -->
    </div>
  </q-page>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import firebase from "firebase/app";
import { Notify, Loading, QSpinnerRadio } from "quasar";
import "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyBs1-42BzURQw1RvlRkGWRY1mWA44VpJQw",
  authDomain: "testapi-281700.firebaseapp.com",
  databaseURL: "https://testapi-281700-default-rtdb.firebaseio.com",
  projectId: "testapi-281700",
  storageBucket: "testapi-281700.appspot.com",
  messagingSenderId: "707108675052",
  appId: "1:707108675052:web:ef1c4d0f9fb864436d74c9",
  measurementId: "G-H71R89VTDP"
};
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText
} from "@fortawesome/vue-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
export default {
  computed: {
    ...mapGetters("base", ["userInfo"])
  },
  methods: {
    ...mapActions("requests", ["sendTokenFCM"]),
    ...mapActions("base", ["GET_DEPARTMENTSBYID", "getAccountByID","updUser"]),
    async activeNotification() {
      console.log("activeNotifi");
      let tokenFCM = localStorage.getItem("tokenFBB2");
      console.log(tokenFCM);

      await this.initFirebase();
      let tokenFCM2 = localStorage.getItem("tokenFBB2");
      console.log("userInfo", this.userInfo);
      console.log("tokenFBB2", tokenFCM2);
      let payload = {
        accountId: this.userInfo.id,
        tokenFCM: tokenFCM2
      };
      await this.sendTokenFCM(payload);
    },
    async confirm(){
      let payload={
        id: this.userInfo.id,
        email: this.email,
        phoneNumber : this.phoneNumber
      }
      if(this.email == null || this.phoneNumber == null || this.phoneNumber == 'null' || this.email == 'null'){
        this.$q.notify({
              message: "Vui lòng nhập đầy đủ thông tin !",
              color: "primary",
              position:'center',
              timeout:500
        });
      }else{
        await this.updUser(payload);
        this.$q.notify({
              message: "Cập nhật thông tin thành công !",
              color: "primary",
              position:'center',
              timeout:500
        });
        this.registration = false;
      }
    },
    initFirebase() {
      firebase.initializeApp(firebaseConfig);
      const messaging = firebase.messaging();
      messaging.usePublicVapidKey(
        "BKU_tfU4ieEycw997StXzS1qZ7_SYIa8xZf9Mry91P7hhnjCPbRZ1kQUBW56Z-LTYJyXHa4OKe8mLOotJJWNWZ0"
      );
      navigator.serviceWorker
        .register("/statics/firebase-messaging-sw.js")
        .then(registration => {
          messaging.useServiceWorker(registration);
          messaging.requestPermission().then(() => {
            messaging
              .getToken()
              .then(currentToken => {
                if (currentToken) {
                  console.log("TKFB: " + currentToken);
                  localStorage.setItem("tokenFBB2", currentToken);
                  // subscribeTokenToTopic(currentToken, "all011");
                }
              })
              .catch(err => {
                console.log("loi get token fb:" + err);
              });
          });
          // messaging.onMessage((payload) => {
          //   console.log(payload)
          //   this.$q.notify({
          //     message: payload.notification.title,
          //     color:'green',
          //     position:'bottom',
          //     actions: [
          //       { label: 'Xem', handler: () => {
          //         this.$router.push('/production-dashboard?code='+payload.data.palletCode)
          //       } }
          //     ]
          //   })
          // })
        });
    }
  },
  components: {
    FontAwesomeIcon,
    FontAwesomeLayers,
    FontAwesomeLayersText
  },
  data() {
    return {
      icon: faBell,
      registration:false,
      dataProfile:null,
      email:null,
      phoneNumber:null
    };
  },
  async created() {
    // createdby : HTHIEU(2021-02-22)
    // check email và SĐT đã được đki hay chưa
    this.dataProfile = await this.getAccountByID(this.userInfo.id);
    console.log('this.dataProfile',this.dataProfile)
    this.email= this.dataProfile.EMAIL;
    this.phoneNumber= this.dataProfile.PHONE;
    if(this.dataProfile.EMAIL == null || this.dataProfile.PHONE == null || this.dataProfile.PHONE == 'null' || this.dataProfile.EMAIL == 'null'){ // nếu rỗng 1 trong 2 sẽ bắt đăng kí
      this.registration = true 
    }
     console.log("userInfo", this.userInfo);
    // let tokenFCM = localStorage.getItem("tokenFBB");
    // console.log("userInfo", this.userInfo);
    // console.log("tokenFCM", tokenFCM);
    // let payload = {
    //   accountId: this.userInfo.id,
    //   tokenFCM: tokenFCM
    // };
    // await this.sendTokenFCM(payload);
  }
};
</script>
<style lang="stylus" scoped>
#notifi{
  padding :4px;
  border-radius :5px;
  color:white;
  margin-top:20px;
  box-shadow : 3px 5px 5px #ccc;
  background-color: rgba(0,0,0,0.4)
}
#icon-notifi {
    -webkit-animation:spin 3s linear infinite;
    -moz-animation:spin 3s linear infinite;
    animation:spin 3s linear infinite;
}
@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
#notifi:hover{
  -webkit-user-select: none;
    user-select: none;
  cursor: pointer;
  color: orange;
  box-shadow : 3px 5px 5px #ccc;
  background-color: rgba(0,0,0,0.6);
  transition-duration :2s;
}
#notifi:active{
  -webkit-user-select: none;
    user-select: none;
  cursor: pointer;
  color: orange;
  box-shadow : 3px 5px 5px #ccc;
  background-color: rgba(0,0,0,0.6);
}
</style>
