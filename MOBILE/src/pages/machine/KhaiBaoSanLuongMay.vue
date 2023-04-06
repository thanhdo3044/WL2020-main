<template>
  <q-page class="q-pa-sm bg-blue-grey-7">
    <div class="row justify-center">
      <div class="page-title">
        <div class="col-auto text-white">Khai báo sản lượng máy</div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
        label-color="amber"
          filled
          :disable="checkEnd"
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
          :disable="checkEnd"
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
      <div class="col-12 q-pa-sm">
        <q-select
        dark
        label-color="amber"
          filled
          :disable="checkEnd"
          v-model="quyCach"
          use-input
          input-debounce="0"
          label="Chọn sản phẩm/chi tiết/ quy cách"
          @input="chonQuyCach"
          :options="quyCachs"
          @filter="filterQuyCach"
        />
      </div>
    </div>
    <q-separator spaced />
    <div v-if="checkStart" class="row">
      <div class="col-1"></div>
      <div class="col-10" align-v="center">
        <q-btn
          color="primary"
          class="full-width"
          label="Bắt đầu"
          @click="onStart"
        />
      </div>
    </div>
    <q-separator spaced />
    <div v-if="checkEnd" class="row">
      <div class="col-1"></div>
      <div class="col-10">
        <q-btn
          color="warning"
          class="full-width"
          label="Kết thúc"
          @click="onEnd"
        />
      </div>
    </div>
    <q-dialog v-model="confirm" persistent>
      <q-card class="bg-blue-grey-7">
        <q-card-section class="row items-center">
          <q-list separator>
            <q-item>
              <q-item-section>
                <q-item-label>Giờ bắt đầu</q-item-label>
                <q-input
                dark
                  :readonly="true"
                  color="lime-11"
                  bg-color="primary"
                  filled
                  v-model="startTime"
                >
                </q-input>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Giờ kết thúc</q-item-label>
                <q-input
                dark
                  @input="setTotalTime"
                  fill-mask
                  mask="####-##-## ##:##"
                  class="q-mb-sm"
                  filled
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
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time
                        dark
                          v-model="endTime"
                          mask="YYYY-MM-DD HH:mm"
                          format24h
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              @click="setTotalTime"
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>Tổng số giờ</q-item-section>
              <q-item-section> {{ totalTime }} </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>Số lượng thực tế</q-item-section>
              <q-item-section>
                <q-input v-model="actualOutput" label="Số lượng" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            @click="submitQuantityReport"
            label="OK"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6" style="color: red">Cảnh báo</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Bạn phải chọn đầy đủ <b>tên máy</b> và <b>sản phẩm</b> để có thể bắt
          đầu
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="checkStartTime">
      <div style="background-color: white">
        <div class="row">
          <div
            style="color: blue; font-weight: bold; font-size: 23px"
            class="col-4"
          >
            Ngày:
          </div>
          <div style="font-size: 23px" class="col-8">
            {{ (dateStart = moment().format("DD/MM/YYYY")) }}
          </div>
          <div
            style="color: blue; font-weight: bold; font-size: 23px"
            class="col-4"
          >
            Giờ:
          </div>
          <div style="font-size: 23px" class="col-8">{{ timeStart }}</div>
        </div>
        <div class="row items-center justify-end">
          <q-btn
            v-close-popup
            @click="machineStart"
            label="Xác nhận"
            color="primary"
            flat
          />
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import { showNotifyError, showNotifySuccess } from "../../utils/utils";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      id: 0,
      accountId: 0,
      startTime: new Date(),
      dateStart: new Date(),
      timeStart: new Date(),
      endTime: new Date(),
      actualOutput: 0,
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
      totalTime: null,
      confirm: false,
      alert: false,
      checkStartTime: false,
      checkStart: true,
      checkEnd: false,
      tenMay: null,
      machineName: "",
      mays: [],
      arrMays: [],
      quyCach: null,
      quyCachs: [],
      arrQuyCachs: [],
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  async created() {
    this.chonNhaMay();
    let item = await this.getItemByMachine();
    item.forEach((s) => {
      this.quyCachs.push({
        value: s.ID,
        label: s.NAME,
        name: s.NAME,
        volumn: s.VOLUMN,
        length: s.LENGTH,
      });
      return;
    });
    this.arrQuyCachs = this.quyCachs;
  },
  methods: {
    ...mapActions("machine", [
      "getMachineByFactoryId",
      "getItemByMachine",
      "insertQuatityReport",
      "getQuantityReportByEndTime",
      "updateQuantityReport",
      "getMachineIsWorkingByMachineId",
      "getQuantityReportByAccountId",
      "getStandardPower",
    ]),
    ...mapActions("base", ["getAccountByID"]),
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
          outputTheory: s.outputTheory,
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
    filterQuyCach(val, update) {
      if (val === "") {
        update(() => {
          this.quyCachs = this.arrQuyCachs;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.quyCachs = this.arrQuyCachs.filter(function (str) {
          return str.name.toLowerCase().includes(needle);
        });
      });
    },
    async chonMay() {
      let data = await this.getMachineIsWorkingByMachineId(this.tenMay.value);
      console.log("length: " + data.length);
      if (data.length != 0) {
        data.forEach((s) => {
          this.accountId = s.accountId;
        });
        let name = await this.getAccountByID(this.accountId);
        if (this.accountId != this.userInfo.id) {
          this.$q
            .dialog({
              title: "Cảnh báo",
              message: `Máy hiện tại đang được sử dụng bởi "${name.LAST_NAME}". Vui lòng chọn máy khác hoặc yêu cầu "${name.LAST_NAME}" dừng làm việc`,
              color: "negative",
              ok: `OK`,
            })
            .onOk(() => (this.checkStart = true), (this.checkEnd = true));
        } else {
          let reportByAccount = await this.getQuantityReportByAccountId(
            this.userInfo.id
          );
          if (reportByAccount.length != 0) {
            console.log("reportByAcccount", reportByAccount);
            this.quyCach = this.quyCachs.find(
              (el) => (el = parseInt(reportByAccount.CODE))
            );
            this.startTime = reportByAccount.datetimeIn;
            this.id = reportByAccount.id;
            this.checkStart = false;
            this.checkEnd = true;
          }
        }
      } else {
        this.machineName = this.tenMay.name;
        this.checkStart = true;
        this.checkEnd = false;
      }
    },
    chonQuyCach() {
      console.log(this.quyCach);
    },
    async machineStart() {
      if (this.tenMay.outputTheory != null) {
        let payload = {
          accountId: this.userInfo.id,
          machineId: this.tenMay.value,
          startTime: this.startTime,
          CODE: this.quyCach.value,
          STANDARD_POWER: this.tenMay.outputTheory,
          factoryId: this.factory.factoryId,
        };
        let result = await this.insertQuatityReport(payload);
        console.log(result);
        this.checkStart = false;
        this.checkEnd = true;
      } else {
        let payload = {
          machineId: this.tenMay.value,
          itemId: this.quyCach.value,
        };
        let data = await this.getStandardPower(payload);
        if (data.length != 0) {
          let payload = {
            accountId: this.userInfo.id,
            machineId: this.tenMay.value,
            startTime: this.startTime,
            CODE: this.quyCach.value,
            STANDARD_POWER: data[0].OPTIMAL_CAPACITY,
            factoryId: this.factory.factoryId,
          };
          let result = await this.insertQuatityReport(payload);
          console.log(result);
          this.checkStart = false;
          this.checkEnd = true;
        } else {
          this.$q.dialog({
            html: true,
            title: "Cảnh báo",
            message: "Máy chưa được khai báo công suất tiêu chuẩn",
          });
        }
      }
    },

    async onStart() {
      if (this.tenMay == null || this.quyCach == null) {
        this.alert = true;
      } else {
        this.startTime = moment().format("YYYY-MM-DD HH:mm");
        this.dateStart = moment().format("YYYY-MM-DD");
        this.timeStart = moment().format("HH:mm");
        this.checkStartTime = true;
      }
    },
    async onEnd() {
      this.endTime = moment().format("YYYY-MM-DD HH:mm");
      var a = moment(this.startTime, "YYYY-MM-DD HH:mm");
      var b = moment(this.endTime, "YYYY-MM-DD HH:mm");
      this.totalTime = Math.round((b.diff(a, "minutes") / 60) * 100) / 100;
      let result = await this.getQuantityReportByEndTime();
      result.forEach((s) => {
        this.startTime = s.datetimeIn
          .substring(0, s.datetimeIn.length - 5)
          .replace("T", " ");
        this.id = s.id;
        return;
      });
      this.confirm = true;
    },
    setTotalTime() {
      console.log(this.startTime);
      console.log(this.endTime);
      var a = moment(this.startTime, "YYYY-MM-DD HH:mm");
      var b = moment(this.endTime, "YYYY-MM-DD HH:mm");
      this.totalTime = Math.round((b.diff(a, "minutes") / 60) * 100) / 100;
    },
    async submitQuantityReport() {
      if (this.actualOutput > 0) {
        let payload = {
          id: this.id,
          datetimeOut: this.endTime,
          actualOutput: this.actualOutput,
          volumn: this.quyCach.volumn,
          length: this.quyCach.length,
        };
        let result = await this.updateQuantityReport(payload);
        if (result == "OK") {
          showNotifySuccess();
        } else {
          showNotifyError();
        }
        this.tenMay = null;
        this.quyCach = null;
        this.machineName = "";
        this.checkStart = true;
        this.checkEnd = false;
      } else {
        this.$q.dialog({
          html: true,
          title: "Nhập sản lương",
          message: "Bạn chưa nhập sản lượng máy ",
        });
      }
      console.log(result);
    },
  },
};
</script>