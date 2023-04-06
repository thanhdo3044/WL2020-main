import { register } from "register-service-worker";
import { Notify, Loading, QSpinnerRadio } from "quasar";
import { Dialog } from 'quasar';
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
    // The registrationOptions object will be passed as the second argument
    // to ServiceWorkerContainer.register()
    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

    registrationOptions: { scope: "./" },

    ready() {
        if (process.env.DEV) {
            console.log("App is being served from cache by a service worker.");
        }
    },

    registered( /* registration */ ) {
        if (process.env.DEV) {
            console.log("Service worker has been registered.");
        }
    },

    cached( /* registration */ ) {
        if (process.env.DEV) {
            console.log("Content has been cached for offline use.");
        }
    },

    updatefound( /* registration */ ) {
        // this.$q.dialog({
        //     title: '',
        //     icon: '',
        //     message: `<b ><b style="color:red;font-size:26px">Thông báo ! </b></br>Có cập nhật mới vui lòng thoát ứng dụng hoặc trình duyệt để cập nhật!</b>`,
        //     color: 'negative',
        //     cancel: false,
        //     html: true,
        //     persistent: true, // we want the user to not be able to close it
        //     ok: false,
        //     default: 'cancel' // <<<<
        // })

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/service-worker.js", { scope: "./" })
                .then(async function(registration) {
                    registration.update();
                });
        };
        let permissionUpd = false;
        //let permissionUpd = true;
        if (permissionUpd == true) {
            Dialog.create({
                title: '',
                icon: '',
                message: `<b ><b style="color:red;font-size:26px">Thông báo ! </b></br>Vui lòng thoát ứng dựng hoặc trình duyệt rồi vào lại để sử dụng Phiên Bản Mới !</b>`,
                color: 'negative',
                cancel: false,
                html: true,
                persistent: true, // we want the user to not be able to close it
                ok: false,
                default: 'cancel' // <<
            })
        }

    },

    updated( /* registration */ ) {
        // let BASE_URL = "";
        // if (process.env.PROD) {
        //     BASE_URL = "https://app.woodsland.com.vn:2002/";
        // } else {
        //     BASE_URL = "http://localhost:2003/";
        // }
        // let permissionUpd = null;
        // await axios({
        //     method: "GET",
        //     url: `${BASE_URL}api/v2/account?accountId=101651`,
        // }).then(res => {

        //     console.log('res', res)
        // }).catch(err => {
        //     console.log('err', err)
        // });


    },

    offline() {
        console.log("offline");
        Loading.show({
            spinner: QSpinnerRadio,
            message: "Kiểm tra kết nối internet !"
                // other props
        });
    },

    error(err) {
        if (process.env.DEV) {
            console.error("Error during service worker registration:", err);
        }
    }
});