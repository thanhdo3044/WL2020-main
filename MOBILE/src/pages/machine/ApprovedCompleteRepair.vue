<template>
  <q-page class="q-pa-sm bg-blue-grey-7">
    <div class="row justify-center">
      <div class="page-title">
        <div class="col-auto text-white">Xác nhận máy hoàn thành sửa chữa</div>
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
      <div
        class="col-12 col-md-3 q-pa-sm"
        v-for="machine in listMachine"
        :key="machine.ID"
      >
        <q-card
          v-if="machine.AUDITOR_BY == null"
          class="my-card bg-orange text-white"
        >
          <q-card-section>
            <div class="text-h6">{{ machine.NAME }}</div>
            <div class="text-subtitle2">Người tạo: {{ machine.LAST_NAME }}</div>
            <div class="text-subtitle2">
              Ngày tạo:
              {{ moment(machine.CREATED_AT).format("DD/MM/YYYY hh:mm") }}
            </div>
            <div class="text-subtitle2">
              Thời gian lỗi:
              {{ moment(machine.START_TIME).format("DD/MM/YYYY hh:mm") }}
            </div>
            <div class="text-subtitle2">Cơ điện: chưa xác nhận</div>
          </q-card-section>
        </q-card>
        <q-card
          v-else
          class="my-card bg-secondary text-white"
          v-on:click="showForm(machine.ID, machine.F_VERIFY_BY)"
        >
          <q-card-section>
            <div class="text-h6">{{ machine.NAME }}</div>
            <div class="text-subtitle2">Người tạo: {{ machine.LAST_NAME }}</div>
            <div class="text-subtitle2">
              Ngày tạo:
              {{ moment(machine.CREATED_AT).format("DD/MM/YYYY hh:mm") }}
            </div>
            <div class="text-subtitle2">
              Thời gian lỗi:
              {{ moment(machine.START_TIME).format("DD/MM/YYYY hh:mm") }}
            </div>
            <div class="text-subtitle2">
              Nguyên nhân:
              {{ machine.DESCRIPTION }}
            </div>
            <div class="text-subtitle2">
              Giải pháp:
              {{ machine.PLAN_MAINTAIN }}
            </div>
            <div class="text-subtitle2">
              Dự kiến hoàn thành:
              {{ moment(machine.INTEND_TIME).format("DD/MM/YYYY hh:mm") }}
            </div>
            <div class="text-subtitle2">Cơ điện: Đã xác nhận</div>
          </q-card-section>
          <q-card-actions vertical>
            <q-btn color="primary" v-if="userInfo.departmentId != 100227 && machine.F_VERIFY_BY == null" @click="approvedF(machine.ID, machine.START_TIME, machine.machineId)">Xưởng xác nhận</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="checkMachine">
      <div style="background-color: white">
        <div class="row">
          <q-input
            fill-mask
            mask="####-##-## ##:##"
            class="col-12 q-pa-sm"
            filled
            label="Thời gian nhận máy"
            v-model="endTime"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date mask="YYYY-MM-DD HH:mm" v-model="endTime">
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
                  <q-time
                    v-model="endTime"
                    mask="YYYY-MM-DD HH:mm"
                    format24h
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="row items-center justify-end q-pa-sm">
          <q-btn
            v-close-popup
            class="full-width "
            @click="inputEndTime"
            label="xác nhận"
            color="primary"
          />
        </div> 
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import { showNotifyError, showNotifySuccess } from "../../utils/utils";
export default {
  data() {
    return {
      machineId: 0,
      listMachine: [],
      checkMachine: false,
      showDetail: false,
      description: "",
      planMaintain: "",
      check: true,
      intendTime: moment().format("YYYY-MM-DD HH:mm"),
      endTime: moment().format("YYYY-MM-DD HH:mm"),
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
          label: "NM CBG Yên Sơn 1A",
          factoryId: 100003,
          code: "YS1A",
        },
        {
          label: "NM CBG Yên Sơn 1B",
          factoryId: 100004,
          code: "YS1B",
        },
        {
          label: "NM CBG Thái Bình",
          factoryId: 100005,
          code: "TB",
        },
      ],
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
    ...mapActions("machine", [
      "getManagedMachines",
      "updateManagedMachineTroubleF"
    ]),
    async chonNhaMay() {
      let data = await this.getManagedMachines(this.factory.factoryId);
      console.log("list machine:", data);
      this.listMachine = data;
    },
    showForm(id, F_VERIFY_BY) {
      if(this.userInfo.departmentId != 100227 && F_VERIFY_BY == null && this.check){
        this.machineId = id;
      this.endTime = moment().format("YYYY-MM-DD HH:mm");
      this.checkMachine = true;
      }
    },
    inputEndTime(){
      this.checkMachine = false;
    },
    async approvedF(id, startTime, machineId){
      this.check = false;
        var a = moment(startTime, "YYYY-MM-DD HH:mm");
        var b = moment(this.endTime, "YYYY-MM-DD HH:mm");
        let totalTime = Math.round((b.diff(a, "minutes") / 60) * 100) / 100;
        const payload = {
            accountId: this.userInfo.id,
            id: id,
            durationTime: totalTime,
            machineId: machineId
        };
        console.log("payload", payload);
        let data = await this.updateManagedMachineTroubleF(payload);
        if(data.meta.success){
            showNotifySuccess();
            this.chonNhaMay();
        }else{
            showNotifyError();
        }
    }
  },
};
</script>