<template>
  <q-page class="q-pa-sm bg-blue-grey-7">
    <div class="row justify-center">
      <div class="page-title">
        <div class="col-auto text-white">Kiếm tra máy gặp sự cố</div>
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
          v-on:click="showForm(machine.ID)"
        >
          <q-card-section>
            <div class="text-h6">{{ machine.NAME }}</div>
            <div class="text-subtitle2">Người tạo: {{ machine.LAST_NAME }}</div>
            <div class="text-subtitle2">
              Ngày tạo:
              {{ machine.CREATED_AT.substring(0, machine.CREATED_AT.length-5).replace('T', ' ') }}
            </div>
            <div class="text-subtitle2">
              Thời gian lỗi:
              {{ machine.START_TIME.substring(0, machine.CREATED_AT.length-5).replace('T', ' ') }}
            </div>
            <div class="text-subtitle2">Cơ điện: chưa xác nhận</div>
          </q-card-section>
        </q-card>
        <q-card v-else class="my-card bg-secondary text-white" v-on:click="showFormDetail(machine)">
          <q-card-section>
            <div class="text-h6">{{ machine.NAME }}</div>
            <div class="text-subtitle2">Người tạo: {{ machine.LAST_NAME }}</div>
            <div class="text-subtitle2">
              Ngày tạo:
              {{ machine.CREATED_AT.substring(0, machine.CREATED_AT.length-5).replace('T', ' ') }}
            </div>
            <div class="text-subtitle2">
              Thời gian lỗi:
              {{ machine.START_TIME.substring(0, machine.CREATED_AT.length-5).replace('T', ' ') }}
            </div>
            <div class="text-subtitle2">Cơ điện: Đã xác nhận</div>
            <div class="text-subtitle2">(Xem chi tiết)</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="checkMachine">
      <div style="background-color: white">
        <div class="row">
          <q-input
            class="col-12 q-pa-sm"
            v-model="description"
            filled
            type="textarea"
            label="Nguyên nhân"
          />
        </div>
        <div class="row">
          <q-input
            class="col-12 q-pa-sm"
            v-model="planMaintain"
            filled
            type="textarea"
            label="Giải pháp"
          />
        </div>
        <div class="row">
          <q-input
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
                  <q-time
                    v-model="intendTime"
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
            @click="updateManagedMachine"
            label="Cơ điện xác nhận"
            color="primary"
          />
        </div>
      </div>
    </q-dialog>
    <q-dialog v-model="showDetail">
      <div style="background-color: #e1f5fe">
        <div class="row">
          <q-input
            class="col-12 q-pa-sm"
            v-model="description"
            filled
            type="textarea"
            label="Nguyên nhân"
            readonly
          />
        </div>
        <div class="row">
          <q-input
            class="col-12 q-pa-sm"
            v-model="planMaintain"
            filled
            type="textarea"
            label="Giải pháp"
            readonly
          />
        </div>
        <div class="row">
          <q-input
            fill-mask
            mask="####-##-## ##:##"
            class="col-12 q-pa-sm"
            filled
            label="Thời gian dự kiến hoàn thành"
            v-model="intendTime"
            readonly
          />
        </div>
        <div class="row items-center justify-end">
          <q-btn
            v-close-popup
            label="Đóng"
            color="primary"
            flat
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
      intendTime: moment().format("YYYY-MM-DD HH:mm"),
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
      "updateManagedMachineTrouble",
    ]),
    async chonNhaMay() {
      let data = await this.getManagedMachines(this.factory.factoryId);
      data = data.filter(m => m.TYPE == "trouble");
      console.log("list machine:", data);
      this.listMachine = data;
    },
    showForm(id) {
      this.machineId = id;
      this.description = "";
      this.planMaintain = "";
      this.intendTime = moment().format("YYYY-MM-DD HH:mm");
      this.checkMachine = true;
    },
    showFormDetail(machine){
      this.machineId = machine.ID;
      this.description = machine.DESCRIPTION;
      this.planMaintain = machine.PLAN_MAINTAIN;
      this.intendTime = machine.INTEND_TIME.substring(0, machine.CREATED_AT.length-5).replace('T', ' ');
      this.showDetail = true;
    },
    async updateManagedMachine() {
      let payload = {
        description: this.description,
        planMaintain: this.planMaintain,
        intendTime: this.intendTime,
        accountId: this.userInfo.id,
        machineId: this.machineId,
      };
      let data = await this.updateManagedMachineTrouble(payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.chonNhaMay();
      } else {
        showNotifyError();
      }
    },
  },
};
</script>