<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <!-- <q-icon
          class="ihome q-ml-sm "
          :name="iconfasUserCircle"
          style="font-size:24px"
        >
        </q-icon> -->
        <q-btn round flat>
          <q-icon
            class="ihome"
            :name="iconfasUserCircle"
            style="font-size: 24px"
          >
          </q-icon>
          <q-menu>
            <q-list id="bg-transparence" style="min-width: 100px">
              <q-item clickable to="/profile" v-close-popup>
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>Thông tin tài khoản</q-item-section>
              </q-item>
              <q-item clickable to="/logout" v-close-popup>
                <q-item-section avatar>
                  <q-icon name="power_settings_new" />
                </q-item-section>
                <q-item-section>Đăng xuất</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-toolbar-title @click="tai_lai_trang" class="text-center"> WOODSLAND 20 </q-toolbar-title>
        <q-btn round flat type="button" to="/notification" icon="notifications">
        </q-btn>
      </q-toolbar>
    </q-header>
    <!-- <q-footer bordered class="bg-white text-primary">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          @click="to('/news')"
          name="info"
          :icon="iconfasNewspaper"
          label="Thông tin"
        />
        <q-tab
          name="home"
          @click="to('/menu')"
          :icon="iconfasBars"
          label="Trang chủ"
        />
        <q-tab
          @click="to('/view-form-register')"
          name="register"
          :icon="iconRing"
          label="Khai báo"
        >
        </q-tab>
      </q-tabs>
    </q-footer> -->
    <q-page-container>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <router-view />
      </transition>
      <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 300px">
          <q-card-section class="row items-center">
            <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn ? </span>
          </q-card-section>
          <q-card-section>
            <p class="prodTextNormal">
              - Sau khi đăng xuất sẽ xóa lịch sử thao tác
            </p>
            <p class="prodTextNormal">
              - Hủy đăng ký nhận thông báo từ hệ thống !
            </p>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn key="text" flat label="Hủy" color="primary" v-close-popup />
            <q-btn
              key="text1"
              flat
              label="Đồng Ý"
              color="primary"
              @click="logout"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { formatDateISO } from "../ultils";
import { fasHome } from "@quasar/extras/fontawesome-v5";
import { fasInfo } from "@quasar/extras/fontawesome-v5";
import { fasTasks } from "@quasar/extras/fontawesome-v5";
import { fasPeopleArrows } from "@quasar/extras/fontawesome-v5";
import { fasUserCircle } from "@quasar/extras/fontawesome-v5";
import { fasWarehouse } from "@quasar/extras/fontawesome-v5";
import { fasMobileAlt } from "@quasar/extras/fontawesome-v5";

import Notification from "./../pages/base/Notification.vue";
import Menu from "./../pages/base/Menu.vue";
import News from "./../pages/base/News.vue";
export default {
  name: "MyLayout",
  components: {
    Notification,
    Menu,
    News,
  },
  data() {
    return {
      page: 4,
      leftDrawerOpen: false,
      showDialog: false,
      myModules: [],
      tintuc: [],
      toDate: null,
      isFuniture: false,
      department: "",
      isWoodsProd: true,
      isWood: false,
      myMenu: [],
      tab: "home",
      modelProfile: true,
      iconfasHome: fasHome,
      iconfasNewspaper: fasInfo,
      iconRing: fasTasks,
      iconfasPeopleArrows: fasPeopleArrows,
      iconfasBars: fasWarehouse,
      iconfasUserCircle: fasUserCircle,
      iconfasPhone: fasMobileAlt,
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo", "myFactoryInfor"]),
  },
  methods: {
    ...mapActions("base", ["GET_DEPARTMENTSBYID"]),
    ...mapActions("base", ["getItemsSanXuat", "getMarketsByFactory"]),
    ...mapActions("orders", [
      "getAllAccountForms",
      "getAllCars",
      "getAllAccounts",
      "getAllDepartments",
      "getAllProposalForms",
    ]),
    ...mapActions("requests", ["sendTokenFCM"]),
    to(PATH) {
      this.$router.push(`${PATH}`);
    },
    handleChangeLength(data) {
      let id = data.ID;
      this.tintuc = this.tintuc.filter((t) => t.ID != id);
      console.log("emit thanh cong", this.tintuc);
    },
    handleChangePage() {
      console.log("handleChangePage");
      this.page = 4;
    },
    backMenu() {
      if (this.$router.name != "menu") {
        this.$router.push("/menu");
      }
    },
    async update() {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/service-worker.js", { scope: "./" })
          .then(function (registration) {
            registration.update();
          });
      }
      window.location.reload(true);
    },
    async tai_lai_trang() {
      this.$router.push("/menu");
      // navigator.serviceWorker
      //   .register("/service-worker.js")
      //   .then(function (registration) {
      //     registration.update();
      //   });
      // window.location.reload(true);
      //           self.addEventListener('activate', event => {
      //   // delete any caches that aren't in expectedCaches
      //   // which will get rid of static-v1
      //   event.waitUntil(
      //     caches.keys().then(keys => Promise.all(
      //       keys.map(key => {
      //         if (!expectedCaches.includes(key)) {
      //           return caches.delete(key);
      //         }
      //       })
      //     )).then(() => {
      //       console.log('V2 now ready to handle fetches!');
      //     })
      //   );
      // });
      
      
    },
    // async NEWS() {
    //   this.tintuc = [];
    //   const payload = {
    //     fromDate: "20210801",
    //     toDate: formatDateISO(this.toDate),
    //     accountId: this.$store.state.base.userInfo.id,
    //   };
    //   const data = await this.$store.dispatch(
    //     "production/VIEW_TIN_TUC",
    //     payload
    //   );
    //   this.tintuc = data.data;
    // },
    async logout() {
      await this.update();
      let mySources = await this.$store.getters["base/mySources"];
      let tokenFB = await localStorage.getItem("tokenFBB");
      await mySources.forEach((s) => {
        this.$unSubcrsTopic(tokenFB, s.id + "-RECIVED-PALLET");
      });
      await localStorage.removeItem("eventlog");
      this.$store.dispatch("base/ACTION_LOGOUT");
    },
  },
  async created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.myMenu = this.$store.getters["base/myMenu"];
    const { id } = this.userInfo.id;
    //this.getAllAccountForms(id);
    //this.getAllCars();
    this.getAllAccounts();
    this.getAllDepartments();

    this.getAllProposalForms();
    this.department = await this.GET_DEPARTMENTSBYID(this.userInfo.department);
    console.log("activeNotifi");
    let tokenFCM = localStorage.getItem("tokenFBB2");
    if (tokenFCM) {
      console.log(tokenFCM);
      let payload = {
        accountId: this.userInfo.id,
        tokenFCM: tokenFCM,
      };
      this.sendTokenFCM(payload);
    }
  },
};
</script>
<style lang="css" scoped>
.ihome:hover {
  cursor: pointer;
}
#bg-transparence {
  background: rgba(242, 242, 242, 0.59) !important;
}
</style>
