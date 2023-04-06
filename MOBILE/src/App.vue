<template>
  <div id="q-app">
    <transition appear enter-active-class="animation fadeIn">
      <router-view v-if="this.$store.getters['base/isLogin'] === true" />
      <auth-page @active-Notifi="activeNotifi" v-else />
    </transition>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/messaging";
// import "devextreme/dist/css/dx.common.css";
// import "devextreme/dist/css/dx.softblue.css";
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
function subscribeTokenToTopic(token, topic) {
  fetch("https://iid.googleapis.com/iid/v1/" + token + "/rel/topics/" + topic, {
    method: "POST",
    headers: new Headers({
      Authorization:
        "key=AAAApKL2Hew:APA91bGwAtre5rIEyltz7uFXCd-FIo7_npjprm4PYxDIOm3FAD_Q-4xNBTVSGT54ZlICIsXUuLLKbDdVLGHt2ZCsfR7SXjGSyBvK7rvI8vtAe_UrBb2vSXUBigbWBeIu7LiqjzWy5_X2"
    })
  })
    .then(response => {
      if (response.status < 200 || response.status >= 400) {
        throw "Error subscribing to topic: " +
          response.status +
          " - " +
          response.text();
      }
      console.log('Subscribed to "' + topic + '"');
    })
    .catch(error => {
      console.error(error);
    });
}

const userInfoLocal = JSON.parse(localStorage.getItem("userInfo"));
import AuthPage from "./pages/Auth";
import { feature } from "./configs/constants";
export default {
  name: "App",
  components: {
    "auth-page": AuthPage
  },
  meta: {
    title: "WL20 ",
    titleTemplate: title => `${title} - Mobile App`
  },
  // beforeCreate(){
  //   if (userInfoLocal) {
  //     this.$store.dispatch('production/AUTO_LOGIN',userInfoLocal)
  //     this.$router.push('/module')
  //   }
  // },
  mounted() {},
  created() {
    this.initTheme();
    // this.initFirebase();
    this.subcrible();
    this.subcribleNamHong();
  },
  methods: {
   
    initTheme() {
      const myTheme = localStorage.getItem("theme");
      if (myTheme === "dark") {
        this.$q.dark.set(true);
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
                  localStorage.setItem("tokenFBB", currentToken);
                  subscribeTokenToTopic(currentToken, "all011");
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
    },
    subcrible() {
      if (this.$store.state.production.userInfo.token) {
        let mySources = this.$store.getters["production/mySources"];
        let tokenFB = localStorage.getItem("tokenFBB");
        if (tokenFB) {
          mySources.forEach(element => {
            subscribeTokenToTopic(tokenFB, element.id + "-RECIVED-PALLET");
          });
        }
      }
    },
    subcribleNamHong() {
      let tokenFB = localStorage.getItem("tokenFBB");
      let myFeature = this.$store.getters["production/myFeatures"];
      if (
        myFeature.findIndex(f => {
          return f.id === feature.QC_CONFIRM_GI;
        }) !== -1 ||
        myFeature.findIndex(f => {
          return f.id === feature.XUONG_CONFIRM_GI;
        }) !== -1 ||
        myFeature.findIndex(f => {
          return f.id === feature.CONFIRM_GI;
        }) !== -1
      ) {
        console.log("jkashkjds");
        subscribeTokenToTopic(tokenFB, "NAMHONG-CONFIRM-GI");
      }
    }
  }
};
</script>

<style>

</style>