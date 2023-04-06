<template>
  <q-page class="q-pa-sm bg-blue-grey-7">
    <div class="row justify-center">
      <div class="page-title">
        <div class="col-auto text-white">Khai báo lịch bảo dưỡng máy</div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
        label-color="amber"
          filled
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
        label-color="amber"
          filled
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
      dark
        label-color="amber"
        fill-mask
        mask="####-##-## ##:##"
        class="col-12 q-pa-sm"
        filled
        label="Thời gian bắt đầu bảo dưỡng"
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
    <div class="row">
        <q-select dark
        label-color="amber" filled class="col-12 q-pa-sm" v-model="description" :options="descriptions" label="Lý do bảo dưỡng" />
    </div>
    <div class="row">
      <q-input
      dark
        label-color="amber"
        fill-mask
        mask="####-##-## ##:##"
        class="col-12 q-pa-sm"
        filled
        label="Thời gian dự kiến hoàn thành"
        v-model="intendTime"
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date mask="YYYY-MM-DD HH:mm" v-model="intendTime">
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
              <q-time v-model="intendTime" mask="YYYY-MM-DD HH:mm" format24h>
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
          label="Khai báo"
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
      intendTime: null,
      description: null,
      descriptions: [
          {
              label: "Thay thế",
              value: "Thay Thế"
          },
          {
              label: "Sửa chữa",
              value: "Sửa chữa"
          },
          {
              label: "Bảo trì bảo dưỡng",
              value: "Bảo trì bảo dưỡng"
          }
      ],
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
    this.intendTime = moment().format("YYYY-MM-DD HH:mm");
    this.chonNhaMay();
  },
  methods: {
    ...mapActions("machine", ["getMachineByFactoryId", "insertManagedMachineMaintenance"]),
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
        machineId: this.tenMay.value,
        type: "maintenance",
        starTime: this.startTime,
        createdBy: this.userInfo.id,
        factoryId: this.factory.factoryId,
        description: this.description.value,
        intendTime: this.intendTime,
      };
      let data = await this.insertManagedMachineMaintenance(payload);
      if(data.meta.success){
        showNotifySuccess();
        this.machineName = null;
        this.tenMay = null;
      }else{
        showNotifyError();
      }
      console.log("payload", payload);
    },
  },
};
</script>