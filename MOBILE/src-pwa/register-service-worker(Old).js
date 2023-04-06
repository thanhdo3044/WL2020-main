import { register } from "register-service-worker";
import { Notify, Loading, QSpinnerRadio } from "quasar";
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

  registered(/* registration */) {
    if (process.env.DEV) {
      console.log("Service worker has been registered.");
    }
  },

  cached(/* registration */) {
    if (process.env.DEV) {
      console.log("Content has been cached for offline use.");
    }
  },

  updatefound(/* registration */) {
    Notify.create({
      message: "Đã có phiên bản mới !",
      color: "cyan"
    });
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js", { scope: "./" })
        .then(async function(registration) {
          registration.update();
        });
    }
  },

  updated(/* registration */) {
    Notify.create({
      message: "Đang dùng phiên bản cũ!",
      color: "cyan"
    });
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
