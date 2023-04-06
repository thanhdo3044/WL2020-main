// import firebase from 'firebase/app'
// import 'firebase/messaging'
// import { Notify } from 'quasar'
// const config = {
//   apiKey:'AAAAz7VDLDs:APA91bGtE7CuQGTBhg2eecK-JIUcYXAD247Hng4KGpYGvLL0BOL66L58Qlv57M3vM8YUobcDulJhPwzbcjh6lcpEz-cjFB7L_AGWcWWN_LUMJwKc77sICsvqx6v_8huIKWJE3bAtH4up'
// }
const firebaseConfig = {
    apiKey: "AIzaSyAYStfS3IqTbUn1V5ZcRDuxh_I5T1U0waU",
    authDomain: "woodsland-4f406.firebaseapp.com",
    databaseURL: "https://woodsland-4f406.firebaseio.com",
    projectId: "woodsland-4f406",
    storageBucket: "woodsland-4f406.appspot.com",
    messagingSenderId: "936991405479",
    appId: "1:936991405479:web:474919bc5957eac8baf282",
    measurementId: "G-10FKSEJ8MK"
  };
// // Notify.setDefaults({
// //   position: 'bottom',
// //   timeout: 2500,
// //   textColor: 'white',
// //   actions: [{ icon: 'visibility', color: 'white' }]
// // })
// function subscribeTokenToTopic(token, topic) {
//   fetch('https://iid.googleapis.com/iid/v1/'+token+'/rel/topics/'+topic, {
//     method: 'POST',
//     headers: new Headers({
//       'Authorization': 'key='+config.apiKey
//     })
//   }).then(response => {
//     if (response.status < 200 || response.status >= 400) {
//       throw 'Error subscribing to topic: '+response.status + ' - ' + response.text();
//     }
//     console.log('Subscribed to "'+topic+'"');
//   }).catch(error => {
//     console.error(error);
//   })
// }
// firebase.initializeApp(firebaseConfig)
// export default ({ Vue }) => {
//   Vue.prototype.$fcm = firebase
//   Vue.prototype.$messaging = firebase.messaging()
//   Vue.prototype.$messaging.usePublicVapidKey('BNsq4lHk2bQlezPG2T7_n4NngLStyBs4FAaVonPUjpQRT78mFSkWBkjUe6HAwhkOKsLAE7gDzkZJZ1gNZZpVfec')
//   navigator.serviceWorker.register('/statics/firebase-messaging-sw.js')
//   .then((registration) => {
//     Vue.prototype.$messaging.useServiceWorker(registration)
    // Vue.prototype.$messaging.getToken().then((currentToken)=>{
    //   if (currentToken) {
    //     console.log('TKFB: '+currentToken)
    //     alert(currentToken)
    //     localStorage.setItem('tokenFBB',currentToken)
    //     subscribeTokenToTopic(currentToken,'all01');
    //   }
    // }).catch(err=>{
    //   alert('loi')
    // })
    // Vue.prototype.$messaging.onMessage((payload) => {
    //   console.log('Message received. ', payload);
    //   // Notify.create({
    //   //   message: payload.notification.title,
    //   //   color:'green'
    //   // })
    //   // ...
    // });
//   })
// //   .then(function (reg){
// //     reg.pushManager.getSubscription().then(function (subscription) {
// //     var Subscribe = JSON.parse(JSON.stringify(subscription));
// //     console.log('subscriber: '+subscription)
// //     // var Key = Subscribe.keys;
// //     // console.log(Key)
// //     })
// //   })
// //   .catch(err => {
// //     console.log('Err: '+err)
// //   })
// }