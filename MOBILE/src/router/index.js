import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import store from "../store";
import { modules } from "../configs/constants";
import { date } from "quasar";

Vue.use(VueRouter);

const Router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,

  // Leave these as is and change from quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE
});
Router.beforeEach((to, from, next) => {
  // let token = Cookies.get('access_token')
  //requiresAuth : kiểm tra đăng nhập
  //requiresFuniture : có quyền truy cập phân hệ nội thất
  //requiresProduction: có quyền truy cập phân hệ chế biến gỗ
  let userInfoLocal = JSON.parse(localStorage.getItem("user_info"));
  let last_login = localStorage.getItem("last_login");
  let unit = "days";
  let timeStamp = Date.now();
  let diff = date.getDateDiff(timeStamp, last_login, unit);
  if (parseInt(diff) >= 30 ||parseInt(diff) < 0) {
    userInfoLocal = null;
  }

  if (userInfoLocal) {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      store.dispatch("base/AUTO_LOGIN", userInfoLocal);
      next();
    } else {
      //nêu chưa đăng nhập thì chuyển về đăng nhập
      store.dispatch("base/AUTO_LOGIN", userInfoLocal);
    }
  } else {
    store.dispatch("base/ACTION_LOGOUT");
    next();
  }
});
export default Router;
