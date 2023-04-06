<template>
  <q-page class="q-pa-md bg-blue-grey-7">
    <div v-scroll="scrolled">
      <app-bar>Tìm kiếm thông tin pallet</app-bar>
      <div class="row justify-center">
        <div class="col-12 col-sm-6">
          <q-card class="q-pa-md bg-blue-grey-7">
            <div class="row">
              <div class="col-12">
                <p class="prodTextTitle text-white">Nhận pallet</p>
              </div>
            </div>
            <div class="row">
                <div class="col-8 q-pa-xs">
             <q-input  dark
              filled
            label-color="orange"
           @input="loadGrid"
            v-model.number="year"
            type="number"
            label="Năm"
             dense
          
          />
                </div>
            <div class="col-4 q-pa-xs">
                 <q-input    
                 dark       
            filled
            @input="loadGrid"
            label-color="orange"
            v-model.number="week"
            type="number"
            label="Tuần"
               dense
          />
            </div>
           </div>
            <div class="row">
              <div class="col-8 q-pa-xs">
                <q-select
                dark
                  ref="self1"
                  @clear="clearCode"
                  clearable
                   use-input
                     filled
                   @filter="searchItem"
                    outlined
                  v-model="palletCode"
                  :options="listNumber"
                  label="Số pallet"
                />
              </div>
              <div v-if="showButtonCheck" class="col-4 q-pa-xs">
                <q-btn
                  class="full-width"
                  @click="check"
                  style="height: 100%;"
                  label="Kiểm tra"
                  stack
                  glossy
                  color="blue"
                />
              </div>
              <div v-else class="col-4 q-pa-sm justify-center">
                <q-spinner-ios color="primary" size="4em" />
              </div>
            </div>
          </q-card>
        </div>
      </div>
      <!-- <div v-if="showFakeKeyboard" class="row justify-center q-mt-md">
        <div class="col-12 col-sm-6">
          <div class="row justify-center" style="text-align: center;">
            <div class="col-4 q-ms-sm" v-for="number in 12" :key="number">
              <div v-if="number<10" @click="inputCode(number)" class="fakeKeyboard">{{number}}</div>
              <div v-if="number===10" @click="inputCode(0)" class="fakeKeyboard">0</div>
              <div v-if="number===11" @click="inputCode('-')" class="fakeKeyboard">-</div>
              <div
                @click="backspace"
                style="background-color: #f5a278"
                v-if="number===12"
                class="fakeKeyboard"
              >
                <q-icon name="backspace" style="font-size: 32px;" />
              </div>
              <!-- <div
                v-if="number===12"
                style="background-color:red"
                @click="clearCode"
                class="fakeKeyboard"
              >Xóa</div> -->
            <!-- </div>
          </div>
        </div>
      </div>  -->
      <div v-if="showDetail">
        <div class="row justify-center">
          <div class="col-12 col-sm-6">
            <div
              v-if="showButtonConfirm&&toStep.package.find(pa=>{ return pa.destinationId===toStep.stepNextId}).verifyBy===''"
              class="row q-ma-sm"
            >
              <q-btn
                class="full-width"
                @click="showDialog=true"
                style="height: 100%;"
                label="Nhận pallet"
                stack
                glossy
                color="secondary"
              />
            </div>
            <div v-else>
              <div v-show="showPendingConfirm" style="text-align: center;" class="col-12 q-pa-sm">
                <q-spinner-ios color="primary" size="4em" />
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-9 prodTextTitle" style="color:orange">Thông tin pallet {{pallet.code}}</div>
              <div class="col-3" align="right">
                <!-- <q-avatar @click="shareViber" size="28px">
                <img src="/statics/viber.png" />
                </q-avatar>-->
                <a id="viber_share" class="text-white">Share Viber</a>
              </div>
            </div>
            <div class="row" v-if="pallet.item!==undefined&&pallet.item.length>1">
              <div class="col-12 col-md-6 q-mt-md" v-for="item in pallet.item" v-bind:key="item.id">
                <q-card class="my-card bg-blue-grey-7" style="min-width:100%">
                  <q-card-section>
                    <p class="prodTextTitle text-white">{{ item.name || '????' }}</p>
                    <p class="prodTextTitle text-white">(QC: {{item.height+' '+item.width+' '+item.length}})</p>
                    <div
                      class="text-subtitle2"
                    ><span class="text-amber">Số lượng: </span> <span class="text-white">{{item.quantity}} ({{item.unit.name||'Thanh'}})</span> </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
            <div v-else class="row justify-center">
              <div class="col-12">
                <q-card class="my-card q-mt-md bg-blue-grey-7" style="min-width:100%; border: 2px solid white">
                  <q-card-section>
                    <div
                      class="prodTextTitle text-white"
                    >{{ pallet.item[0].name || '????' }} (QC: {{pallet.item[0].height+' '+pallet.item[0].width+' '+pallet.item[0].length}})</div>
                    <div
                      class="text-subtitle2"
                    ><span class="text-amber">Số lượng: </span> <span class="text-white">{{pallet.inventory}} ({{pallet.item[0].unit.name||'Thanh'}})</span> </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 q-ma-sm">
            <table-coc />
          </div>
          <div class="col-12 col-sm-6 q-ma-sm">
            <q-card class="my-card q-pa-xs bg-blue-grey-7" style="border:2px solid white">
              <q-card-section>
                <div class="prodTextTitle text-white">Thông tin các công đoạn đã qua</div>
              </q-card-section>
              <div v-for="(step,index) in pallet.step" :key="step.id">
                <q-item >
                  <q-item-section avatar>
                    <div class="row">
                      <div class="col-12">
                        <q-chip dark class="bg-blue-grey-7" style="border:2px solid white">
                          <q-avatar color="blue">{{index+1}}</q-avatar>
                          
                          <div v-if="step.stepNextName == 'Kho gỗ sau sấy' || step.stepNextName == 'Kho gỗ sau sấy (YS1A)' || step.stepNextName == 'Kho gỗ sau sấy (TB)'" class="prodTextTitle">Đang sấy</div>
                          <div v-else class="prodTextTitle">Chờ sấy</div>
                        </q-chip>
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
                <q-card-section>
                  <div class="row">
                    <div class="col-6">
                      <div
                        class="prodTextTitle"
                        style="background-color:#52f783;padding:10px"
                      >SL đạt : {{step.pass}}</div>
                    </div>
                    <div class="col-6">
                      <div
                        class="prodTextTitle"
                        style="background-color:#faa652;padding:10px"
                      >SL lỗi : {{step.notPass}}</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12"><span class="text-amber">Ngày làm việc: </span> <span class="text-white">{{step.package[0]? step.package[0].createDate : '???'}}</span> </div>
                  </div>
                  <div class="row">
                    <div class="col-12"><span class="text-amber">Người làm: </span> <span class="text-white">{{step.package[0]?step.package[0].createName : '???'}}</span> </div>
                  </div>
                  <div class="row">
                    <div class="col-12"><span class="text-amber">Xuất đến: </span> <span class="text-white">{{step.stepNextName || '????'}}</span> </div>
                  </div>
                  <div v-if="step.package[0]">
                    <div v-show="step.package[0].verifyName" class="row">
                    <div class="col-12"><span class="text-amber">Nhận bởi: </span> <span class="text-white">{{step.package[0].verifyName || '????'}}</span> </div>
                  </div>
                  <div class="row">
                    <div class="col-12"><span class="text-amber">Ngày nhận: </span> <span class="text-white" >{{step.package[0].verifyDate || 'Chưa nhận'}}</span> </div>
                  </div>
                  </div>
                </q-card-section>
                <q-separator />
              </div>
            </q-card>
          </div>
        </div>
      </div>
      <event-log :events="events" :goDetail="goDetail"></event-log>
      <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width:300px">
          <q-card-section class="row items-center">
            <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn ? !</span>
          </q-card-section>
          <q-card-section
            style="font-family:'Time New Roman'"
          >Nhận pallet {{pallet.code}} về công đoạn {{toStep.stepNextName}}</q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Hủy" color="primary" v-close-popup />
            <q-btn flat label="Đồng Ý" color="primary" @click="recive" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import TableCOC from "../../components/prod/TableCOC";
import {

  getWeekNumber

} from "../../ultils";
import AppBar from "../../components/AppBar";
import EventLog from "../../components/prod/CardEventHistory";
import { debounce } from "quasar";
export default {
  components: {
    "table-coc": TableCOC,
    "app-bar": AppBar,
    "event-log": EventLog
  },
  meta() {
    return {
      // this accesses the "title" property in your Vue "data";
      // whenever "title" prop changes, your meta will automatically update
      title: this.title
    };
  },
  data() {
    return {
      title: "Chi tiết pallet ",
      palletCode: "",
      showButtonCheck: true,
      pallet: {},
      itemDupplicate:[],
      listNumber:[],
      year:null,
      week:null,
      showDetail: false,
      showButtonConfirm: false,
      mySources: [],
      showDialog: false,
      toStep: {},
      showPendingConfirm: false,
      stepTarget: {},
      path: null,
      showFakeKeyboard: true,
      events: []
    };
  },
  created() {
      const today = new Date();
    this.week = getWeekNumber(today);
    const currentYear = today.getFullYear();
    this.year = currentYear;
    this.$root.$on("reload-event-log", () => {
      this.events = [];
    });
    this.loadGrid();
    this.initEventLog();
    const queryPalletCode = this.$route.query.code;
    const pathRedirect = this.$route.query.path;
    if (pathRedirect) {
      this.path = pathRedirect;
    }
    if (queryPalletCode && queryPalletCode.length === 8) {
      this.title += " số " + queryPalletCode;
      this.palletCode = queryPalletCode;
      const payload = {
        token: this.$store.state.base.userInfo.token,
        palletCode: queryPalletCode.trim()
      };
      this.loaData(payload);
    }
    this.mySources = this.$store.getters["base/mySources"];
  },
  methods: {
    scrolled: debounce(function(position) {
      // when this method is invoked then it means user
      // has scrolled the Page to 'position'
      //
      // 'position' is an Integer designating the current
      // scroll position in pixels.
    }, 200), // debounce for 200ms
    backspace() {
      if (this.palletCode.length > 0) {
        this.palletCode = this.palletCode.toString().slice(0, -1);
      }
    },
    initButtonShareViber() {
      let share_url = window.location.href;
      if (share_url.toString().slice(share_url.length - 2) === "rd") {
        share_url += "?code=" + this.palletCode;
      }
      var buttonID = "viber_share";
      var text = "Chi tiết pallet số " + this.palletCode + " :";
      document
        .getElementById(buttonID)
        .setAttribute(
          "href",
          "https://3p3x.adj.st/?adjust_t=u783g1_kw9yml&adjust_fallback=https%3A%2F%2Fwww.viber.com%2F%3Futm_source%3DPartner%26utm_medium%3DSharebutton%26utm_campaign%3DDefualt&adjust_campaign=Sharebutton&adjust_deeplink=" +
            encodeURIComponent(
              "viber://forward?text=" +
                encodeURIComponent(text + " " + share_url)
            )
        );
    },
    initEventLog() {
      let eventLocal = localStorage.getItem("eventlog");
      if (eventLocal) {
        let eventsLog = JSON.parse(eventLocal);
        this.events = eventsLog;
      }
    },
     searchItem(val, update) {
     
      if (val === "") {
        update(() => {
          this.listNumber = this.itemDupplicate;
        });
        return;
      }

      update(() => {
        const needle = val
        this.listNumber =  this.itemDupplicate.filter((v) => v.CODE.indexOf(needle) > -1);
      });
    },
    goDetail(code) {
      this.palletCode = code;
      this.scrolled(100);
      this.$q.notify({
        message: "Đang kiểm tra pallet " + code,
        position: "center",
        color: "cyan",
        timeout: 500
      });
      this.check();
    },
    clearCode() {
      this.$refs.self1.blur();
      this.showFakeKeyboard = true;
      this.palletCode = "";
    },
      async loadGrid() {
         this.listNumber = []
          const payload = {
        week: this.week ,
        year: this.year,
     factoryId:this.$store.state.base.userInfo.factoryId
   
      };
        const data = await this.$store.dispatch("production/GET_MA_PALLET", payload);
       this.itemDupplicate = data.data
        this.itemDupplicate.map((element) => {
          element.label = element.CODE;
          element.value = element.CODE;
        });
      //  data.data.forEach((element) => {
       
      //       this.itemDupplicate.push(element.CODE);
      //    });
         
      },
    async loaData(payload) {
      this.showFakeKeyboard = false;
      this.title += " số " + payload.palletCode;
      let dataPallet = await this.$store.dispatch(
        "production/ACTION_GET_DETAIL_PALLET",
        payload
      );
      if (dataPallet.meta.success === true) {
        this.$root.$emit("reload");
        this.pallet = dataPallet.data;
        this.showButtonCheck = true;
        this.showDetail = true;
        const palletToDestiantionId = dataPallet.data.step.slice(-1).pop();
        this.stepTarget = palletToDestiantionId;
        this.toStep = dataPallet.data.step.slice(-1).pop();
        if (
          this.$store.getters["base/mySources"].findIndex(
            s => s.id === palletToDestiantionId.stepNextId
          ) !== -1
        ) {
          this.showButtonConfirm = true;
          this.showFakeKeyboard = false;
        }
      
      } else {
        this.showButtonCheck = false;
        this.showFakeKeyboard = true;
      }
    },
    async recive() {
      this.showDialog = false;
      this.showButtonConfirm = false;
      this.showPendingConfirm = true;
      let packageAvailible = this.toStep.package.find(p => {
        return p.destinationId == this.stepTarget.stepNextId;
      });
      const payload = {
        token: this.$store.state.base.userInfo.token,
        packageId: packageAvailible.id
      };
      let res = await this.$store.dispatch(
        "production/ACTION_RECIVED_PALLET",
        payload
      );
      if (res.meta.success === true) {
        this.$q.notify({
          message: "Đã nhận pallet về công đoạn " + this.toStep.stepNextName,
          color: "green"
        });
        let eventLog = {
          eventName: "Nhận pallet",
          timeStamp: new Date().toISOString(),
          status: 1,
          palletCode: this.palletCode
        };
        this.$eventLog(eventLog);
        this.initEventLog();
        this.showPendingConfirm = false;
        if (this.path) {
          this.$router.push("/" + this.path);
        }
      } else {
        this.$q.notify({
          message: res.meta.messages.message,
          color: "red"
        });
        this.showButtonConfirm = true;
        this.showPendingConfirm = false;
      }
    },
    inputCode(numb) {
      if (this.palletCode === null) {
        this.palletCode = "";
      }
      this.palletCode += numb.toString();
    },
    check() {
      if (this.palletCode.value.toString().length >= 8) {
        this.showButtonCheck = false;
        const payload = {
          palletCode: this.palletCode.value
        };
        this.loaData(payload);
      } else {
        this.$q.notify({
          message: "Số pallet không chính xác !",
          color: "red"
        });
      }
    }
  }
};
</script>

<style>
</style>