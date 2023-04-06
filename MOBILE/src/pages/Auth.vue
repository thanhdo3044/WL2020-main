<template>
  <q-layout>
    <q-page-container>
      <q-page padding class="bg-blue-grey-7">
        <div class="fit row wrap justify-center items-start content-start">
          <div id="wrap" class="col-12 col-md-6 col-lg-4 mt-md">
            <q-img
              src="statics/logo.png"
              spinner-color="white"
              style="
                height: 140px;
                max-width: 150px;
                margin-left: auto;
                margin-right: auto;
                display: block;
              "
            />
            <br />
            <div align="center">
              <div class="home">Woodsland 20</div>
              <div style="padding-top:20px; color:#f6b024">Mobile Application</div>
            </div>

            <br />
            <q-input
            dark
            label-color="amber"
              filled
              v-model="username"
              label="Tên đăng nhập"
            />
            <br />
            <q-input
            dark
            label-color="amber"
              filled
              v-model="password"
              type="password"
              label="Mật khẩu"
            />
            <div
              @click="dialogForgetPassword"
              style="font-weight: bold;color:#f6b024;"
              class="q-mt-sm q-mb-sm forgetPassword"
            >
              Quên mật khẩu ?
            </div>
            <div style="width=100%" align="center">
               <q-btn
              color="blue"
              glossy
              @click="doLogin"
              class="q-mt-mb-xs"
              label="Đăng nhập"
              style="margin-bottom: 10px"
            />
            </div>
           
          </div>
        </div>
        <!-- <div
          class="fixed-bottom"
          align="right"
          style="
            margin-right: 3%;
            font-family: monospace;
            font-style: italic;
            font-size: small;
          "
        >
          Phiên bản : {{ this.$store.state.base.appVerion }}
        </div> -->
      </q-page>
    </q-page-container>
    <q-dialog v-model="dialogForget">
      <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        caption="Tìm Mật khẩu"
        header-class="text-bold"
        animated
      >
        <q-step
          :name="1"
          title="Nhập thông tin cần tìm"
          icon="settings"
          :done="step > 1"
        >
          <q-input v-model="username" label="Mã nhân viên (viết hoa)">
          </q-input>
          <!-- v-on:keyup="checkEmail" -->
          <q-input v-model="email" label="Email"> </q-input>
        </q-step>

        <q-step
          :name="2"
          title="Nhập mã OTP"
          caption=""
          icon="create_new_folder"
          :done="step > 2"
        >
          <q-input v-model="OTPMail" label="Mã OTP"> </q-input>
       
          <q-btn
            size="sm"
            class="q-mt-sm text-primary"
            v-on:click="sendOTP()"
            style="font-size:12px;"
            color="positive"
            :label="step === 4 ? 'Hoàn thành' : ''"
          >
           Gửi mã OTP
          </q-btn>
     
          <div
            size="sm"
            color="orange q-mt-sm"
            style="padding-top:12px;"
            :label="step === 3 ? 'Hoàn thành' : 'Gửi mã OTP'"
          >
            Hiệu lực còn : {{ minutes }} : {{ seconds }}
          </div>
        </q-step>

        <!-- <q-step
        :name="3"
        title="Ad template"
        icon="assignment"
        disable
      >
        This step won't show up because it is disabled.
      </q-step> -->

        <q-step :name="3" title="Tạo mật khẩu mới" icon="add_comment">
          <q-input
            v-model="newPass"
            label="Mật khẩu mới"
            :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <br />
          <q-input
            v-model="newPass2"
            label="Nhập lại mật khẩu mới"
            :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              @click="nextStep"
              color="primary"
              :label="step === 3 ? 'Hoàn thành' : 'Tiếp tục'"
            />
            <q-btn
              v-if="step > 1"
              flat
              color="primary"
              @click="$refs.stepper.previous()"
              label="Quay lại"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-dialog>
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm prodTextTitle">Cập nhật mật khẩu mới ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" color="primary" @click="nextStep" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="showLoading">
      <q-spinner-gears size="150px" color="primary" />
    </q-inner-loading>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Notify, Loading, QSpinnerIos } from "quasar";
import po from "../store/po";
export default {
  // name: 'PageName',
  props: ["activeNotifi"],
  data() {
    return {
      username: "",
      password: "",
      dialogForget: false,
      step: 1,
      email: "",
      username: "",
      OTPMail: null,
      checkAccountExist: false,
      time: 180000,
      timer: null,
      totalTime: 2 * 60,
      resetButton: false,
      newPass: "",
      newPass2: "",
      showLoading: false,
      showDialog: false,
      isPwd: true,
    };
  },

  methods: {
    ...mapActions("forgetPassword", [
      "checkProfileAccount",
      "sendMailOTP",
      "checkMailOTP",
    ]),
    async checkEmail() {
      let profileAccount = await this.checkProfileAccount({
        forgetPassword: 1,
        EMAIL: this.email,
        ACCOUNT: this.username,
      });
      if (profileAccount.data.length > 0) {
        this.checkAccountExist = true;
      } else {
        this.checkAccountExist = false;
        this.$q.notify({
          message: "Không tìm thấy Mã NV hoặc EMAIL , vui lòng kiểm tra lại!",
          color: "red",
          timeout: "500",
          position: "center",
        });
      }
    },
    async checkOTPMail() {
      let profileAccount = await this.checkProfileAccount({
        forgetPassword: 1,
        EMAIL: this.email,
        ACCOUNT: this.username,
      });
      if (profileAccount.data.length > 0) {
        this.checkAccountExist = true;
      } else {
        this.checkAccountExist = false;
        this.$q.notify({
          message: "Không tìm thấy Mã NV hoặc EMAIL , vui lòng kiểm tra lại!",
          color: "red",
          timeout: "500",
          position: "center",
        });
      }
    },
    async sendOTP() {
      this.OTPMail = null;
      this.resetTimer();
      this.$q.notify({
        message: "Đã gửi mã xác nhận OTP qua EMAIL của bạn!",
        color: "primary",
        timeout: "750",
        position: "center",
      });
      console.log("sendOTP");
      await this.sendMailOTP({
        email: this.email,
        userName: this.username,
        OTP: Math.floor(Math.random() * 999999),
        forgetPassword: 1,
      }).then((res) => {
        this.startTimer();
      });
    },
    async nextStep() {
      if (this.step == 1) {
        // this.$refs.stepper.next();
        if (this.email == "" || this.username == "") {
          this.$q.notify({
            message: "Vui lòng nhập đầy đủ thông tin Mã NV và Email!",
            color: "red",
            timeout: "500",
            position: "center",
          });
        } else {
          await this.checkEmail();
          if (!this.checkAccountExist) {
          } else {
            this.$refs.stepper.next();
          }
        }
      } else if (this.step == 2) {
        // this.$refs.stepper.next();
        if (this.totalTime == 0) {
          this.$q.notify({
            message: "Mã OTP hết hiệu lực sử dụng , ấn lại Gửi Mã OTP!",
            color: "red",
            timeout: "500",
            position: "center",
          });
        } else if (this.OTPMail == null) {
          this.$q.notify({
            message: "Vui lòng nhập mã OTP!",
            color: "red",
            timeout: "500",
            position: "center",
          });
        } else {
          let dataCheckMailOTP = await this.checkMailOTP({
            email: this.email,
            userName: this.username,
            OTP: this.OTPMail,
            forgetPassword: 1,
          });
          console.log("dataCheckMailOTP", dataCheckMailOTP);
          if (dataCheckMailOTP.length == 0) {
            this.$q.notify({
              message: "Mã OTP không đúng!",
              color: "red",
              timeout: "500",
              position: "center",
            });
          } else {
            this.$refs.stepper.next();
          }
        }
      } else if (this.step == 3) {
        this.showDialog = false;
        this.showLoading = true;
        if (this.newPass && this.newPass2) {
          if (this.newPass.trim() === this.newPass2.trim()) {
            const payload = {
              data: {
                forgetPassword: 1,
                username: this.username,
                oldPassword: this.curPass,
                newPassword: this.newPass,
              },
            };
            await this.$store
              .dispatch("production/ACTION_CHANGE_PASS", payload)
              .then((res) => {
                if (res.meta.success === true) {
                  this.$q.notify({
                    message: "Đổi mật khẩu thành công !",
                    color: "green",
                    position: "center",
                  });
                  this.dialogForget = false;
                  // setTimeout(() => {
                  //   this.$store.dispatch("production/ACTION_LOGOUT");
                  // }, 1500);
                } else {
                  this.$q.notify({
                    message: res.meta.messages.message,
                    color: "red",
                  });
                }
              })
              .catch((err) => {
                this.$q.notify({
                  message: err.data.meta.messages.message,
                  color: "red",
                });
              });
            this.showLoading = false;
            this.newPass = "";
            this.newPass2 = "";
          } else {
            this.$q.notify({
              message: "Mật khẩu mới không giống nhau !",
              color: "red",
              position: "center",
            });
            this.showLoading = false;
          }
        } else {
          this.$q.notify({
            message: "Vui lòng nhập đủ thông tin ",
            color: "red",
            position: "center",
          });
          this.showLoading = false;
        }
      }
    },
    dialogForgetPassword() {
      this.dialogForget = true;
    },
    pushHome() {
      this.$router.push("/module");
    },

    doLogin() {
      if (this.username != "" && this.password != "") {
        const user = {
          username: this.username,
          password: this.password,
        };
        // console.log(this.$router)
        this.$store.dispatch("base/LOGIN", user);
      } else {
        this.$q.notify({
          message: "Vui lòng nhập đầy đủ thông tin !",
          color: "red",
        });
      }
    },
    startTimer: function () {
      this.timer = setInterval(() => {
        if (this.totalTime != 0) this.countdown();
      }, 1000);
      this.resetButton = true;
    },
    stopTimer: function () {
      clearInterval(this.timer);
      this.timer = null;
      this.resetButton = true;
    },
    resetTimer: function () {
      clearInterval(this.timer);
      this.totalTime = 2 * 60;
      this.resetButton = false;
      this.timer = null;
    },
    padTime: function (time) {
      return (time < 10 ? "0" : "") + time;
    },
    countdown: function () {
      if (this.totalTime <= 0) {
        this.totalTime = 0;
      } else this.totalTime--;
    },
  },
  computed: {
    minutes: function () {
      return this.padTime(Math.floor(this.totalTime / 60));
    },
    seconds: function () {
      return this.padTime(this.totalTime - this.minutes * 60);
    },
  },
};
</script>
<style lang="stylus" scoped>
#wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 18px;
}

.forgetPassword:hover {
  cursor: pointer;
  text-decoration: underline blue solid;
}

.home {
  font-size: 25px;
  border: 5px solid #f6b024;
  border-radius: 50px;
  font-weight: bold;
  padding: 5px;
  color: white;
  display: inline
}
</style>
