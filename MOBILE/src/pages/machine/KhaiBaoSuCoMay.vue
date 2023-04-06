<template>
  <q-page class="q-pa-sm bg-blue-grey-7">
    <div class="row justify-center">
      <div class="page-title">
        <div class="col-auto text-white">Khai báo máy gặp sự cố</div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          filled
          label-color="amber"
          v-model="factory"
          @input="chonNhaMay"
          label="Chọn nhà máy"
          :options="options"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          filled
          label-color="amber"
          v-model="tenMay"
          use-input
          input-debounce="0"
          label="Chọn mã máy"
          @input="chonMay"
          :options="mays"
          @filter="filterMachine"
        />
      </div>
    </div>
    <div class="row">
     <div class=" q-pa-sm" style="color: orange; font-weight: bold; display: block">Tên máy:</div>
      <div class=" q-pa-sm" style="color: white;font-weight: bold; display: block">{{ machineName }}</div>
    </div>
    <div class="row">
      <q-input
      label-color="amber"
      label="Chọn ngày"
      dark
        fill-mask
        mask="####-##-## ##:##"
        class="col-12 q-pa-sm"
        filled
        v-model="startTime"
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date mask="YYYY-MM-DD HH:mm" v-model="startTime">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <q-separator spaced />
    <div class="row">
      <div class="col-1"></div>
      <div class="col-10" align-v="center">
        <q-btn
          color="red"
          class="full-width"
          label="Gửi thông báo máy lỗi"
          @click="onSubmit"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import { showNotifyError, showNotifySuccess } from '../../utils/utils';
export default {
  data() {
    return {
      startTime: null,
      factory: {
        label: "NM CBG Thuận Hưng",
        factoryId: 100000,
      },
      options: [
        {
          label: "NM CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "NM CBG Yên Sơn 1",
          factoryId: 102340,
          code: "YS1",
        },
     
        {
          label: "NM CBG Thái Bình",
          factoryId: 102366,
          code: "TB",
        },
      ],

      tenMay: null,
      machineName: "",
      mays: [],
      arrMays: [],
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  async created() {
    this.startTime = moment().format("YYYY-MM-DD HH:mm");
    this.chonNhaMay();
  },
  methods: {
    ...mapActions("machine", ["getMachineByFactoryId", "insertManagedMachineTroble"]),
    ...mapActions("requests", [
      "getTokenFCM"
    ]),
    async chonNhaMay() {
      this.tenMay = null;
      this.mays = [];
        let payload = {
      
        starTime: moment(this.startTime).format("YYYY-MM-DD 00:00:01"),
        endTime: moment(this.startTime).format("YYYY-MM-DD 23:59:50"),
        factoryId: this.factory.factoryId,
    
      };
      let machine = await this.getMachineByFactoryId(payload);
      machine.forEach((s) => {
        this.mays.push({
          value: s.machineId,
          label: s.machineId,
          name: s.NAME,
        });
        return;
      });
      this.arrMays = this.mays;
    },
    filterMachine(val, update) {
      if (val === "") {
        update(() => {
          this.mays = this.arrMays;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.mays = this.arrMays.filter(function (str) {
          return str.value.toLowerCase().includes(needle);
        });
      });
    },
    async chonMay() {
      this.machineName = this.tenMay.name;
    },

    async onSubmit() {
      let payload = {
        notification: {
          title: "Thank for sub",
          body: "firebase cloud",
          icon: "https://cdn.quasar.dev/img/boy-avatar.png"
        }
      };
      let payload2 = {
        machineId: this.tenMay.value,
        type: "trouble",
        starTime: this.startTime,
        createdBy: this.userInfo.id,
        factoryId: this.factory.factoryId
      };
      let data = await this.insertManagedMachineTroble(payload2);
      if(data.meta.success){
        showNotifySuccess();
        let payloadGetToken = {
        accountId: 100400
      };
      let dataFCMSuccess = await this.getTokenFCM(payloadGetToken);
      await dataFCMSuccess.data.data.forEach(async e => {
        if (e.tokenFCM != "undefined") {
          let dataSendFCM = await this.$sendMessageActiveReq(
            `Thông báo máy hỏng`,
            `Vào ${this.startTime} máy ${this.machineName} gặp sự cố được ${this.userInfo.lastName}`,
            `mua-hang`,
            `1`,
            payload,
            e.tokenFCM
          );
        }
        
      });
        this.machineName = null;
        this.tenMay = null;
      }else{
        showNotifyError();
      }
      this.chonNhaMay();
      console.log("payload", payload);
    },
  },
};
</script>