<template>
  <q-card-section style="font-size: 16px">
    <div class="q-gutter-sm q-mt-sm"></div>
    <div
      @click="activeUp"
      v-for="(task, key) in order.OrderMeta.filter((e) => e.maNV)"
      :key="key"
    >
      {{ task.selection }} :
      <div v-if="task.selection == 'Làm thêm giờ'">
        <q-dialog
          v-model="active"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
          <q-card class="bg-white text-black" style="width: 100%">
            <q-card-section>
              <div
                class="text-h6 bg-primary text-center text-white q-pa-sm shadow-5"
                style="border-radius: 5px"
              >
                Sửa dữ liệu
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                class="q-mt-sm"
                outlined
                v-if="order.proposalFormId != 1042"
                v-model="task.work"
                label="Công việc: "
                :readonly="true"
              />
              <q-select
                class="q-mt-sm q-pb-sm"
                outlined
                v-if="order.proposalFormId == 1042"
                :options="optionError"
                v-model="task.work"
                label="Nội dung xác nhận : "
                :readonly="true"
              >
              </q-select>
              <div class="col q-mt-sm">
                <div class="text-h8"></div>
                <q-input
                  :readonly="true"
                  label="Ngày xác nhận :"
                  filled
                  v-model="task.date"
                  fill-mask
                  mask="##-##-####"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                        disable="true"
                      >
                        <q-date readonly mask="DD-MM-YYYY" v-model="task.date">
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
                </q-input>
              </div>
              <div class="col q-mt-sm">
                <div class="text-h8"></div>
                <q-input
                  label="Giờ vào :"
                  filled
                  v-model="task.hoursIn"
                  mask="time"
                  :rules="['time']"
                >
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time
                          v-model="task.hoursIn"
                          @input="totaHours"
                          format24h
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
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
              </div>
              <div class="col">
                <div class="text-h8"></div>
                <q-input
                  label="Giờ ra :"
                  filled
                  v-model="task.hoursOut"
                  mask="time"
                  :rules="['time']"
                >
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time
                          v-model="task.hoursOut"
                          format24h
                          @input="totaHours"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
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
              </div>
              <!-- <q-input
              style=""
              class=""
              outlined
              v-if="order.proposalFormId == 1042"
              v-model="tasks.licensePlates"
              label="Biển số xe : "
              :readonly="false"
            /> -->
              <q-input
                class=""
                outlined
                v-if="order.proposalFormId != 1042"
                v-model="task.total"
                label="Tổng số giờ : "
                :readonly="true"
              />
            </q-card-section>
            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn
                color="primary"
                push
                class="bg-primary text-white"
                text="white"
                label="Lưu"
                no-caps
                v-close-popup
                @click="RowUpdated"
              />
              <q-btn
                push
                color="red"
                class="bg-red text-white"
                label="Quay lại"
                no-caps
                v-close-popup
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-card class="q-mb-sm q-mt-sm">
          <q-card-section>
            <div>
              Mã nhân viên : <b>{{ task.maNV }}</b>
            </div>
            <div class="text-subtitle1">
              Họ và tên : <b>{{ task.fullName }}</b>
            </div>
            <div>Chức danh : {{ proAccount[0].position }}</div>
            <div>Phòng ban/bộ phận: {{ nameDepartmentName.NAME }}</div>
            <div>
              Ngày đăng kí :
              {{ task.date }}
            </div>
            <div>Công việc : {{ task.work }}</div>
            <div>Thời gian từ : {{ task.hoursIn }}</div>
            <div>Thời gian đến : {{ task.hoursOut }}</div>
            <div>Tổng số giờ : {{ task.total }}</div>
            <div>
              Tình trạng phê duyệt : <b>{{ task.statusRequests }}</b>
            </div>
            <q-radio
              class="q-mr-sm"
              dense
              @input="activeReq(task)"
              v-model="task.statusRequests"
              val="Xem xét"
              label="Xem xét"
            />
            <q-radio
              class="q-mr-sm"
              dense
              @input="activeReq(task)"
              v-model="task.statusRequests"
              val="Đồng ý"
              label="Đồng ý"
            />
            <q-radio
              class="q-mr-sm"
              dense
              @input="activeReq(task)"
              v-model="task.statusRequests"
              val="Giải trình bổ sung"
              label="Giải trình bổ sung"
            />
            <q-radio
              class="q-mr-sm"
              dense
              @input="activeReq(task)"
              v-model="task.statusRequests"
              val="Hủy"
              label="Hủy"
            />
          </q-card-section>
        </q-card>
      </div>
      <div v-if="task.selection == 'Xác nhận công'">
        <q-card class="q-mb-sm q-mt-sm">
          <q-card-section>
            <div>
              Mã nhân viên : <b>{{ task.maNV }}</b>
            </div>
            <div class="text-subtitle1">
              Họ và tên : <b>{{ task.fullName }}</b>
            </div>
            <div>Chức danh : {{ proAccount[0].position }}</div>
            <div>Phòng ban/bộ phận: {{ nameDepartmentName.NAME }}</div>
            <div>Ngày lỗi công : {{ task.date }}</div>
            <div>
              Công việc : <b>{{ task.work }}</b>
            </div>
            <div>Thời gian vào : {{ task.hoursIn }}</div>
            <div>Thời gian ra : {{ task.hoursOut }}</div>
            <div>Biển số xe : {{ task.total }}</div>
            <div>
              Tình trạng phê duyệt : <b>{{ task.statusRequests }}</b>
            </div>
            <q-radio
              class="q-mr-sm"
              dense
              @input="activeReq(task)"
              v-model="task.statusRequests"
              val="Xem xét"
              label="Xem xét"
            />
            <q-radio
              class="q-mr-sm"
              dense
              @input="activeReq(task)"
              v-model="task.statusRequests"
              val="Đồng ý"
              label="Đồng ý"
            />
            <q-radio
              class="q-mr-sm"
              dense
              @input="activeReq(task)"
              v-model="task.statusRequests"
              val="Giải trình bổ sung"
              label="Giải trình bổ sung"
            />
            <q-radio
              class="q-mr-sm"
              dense
              @input="activeReq(task)"
              v-model="task.statusRequests"
              val="Hủy"
              label="Hủy"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <footerCard
      :order="order"
      :nextId2="nextId2"
      :nextId3="nextId3"
      :nextId="nextId"
      :active1="active1"
    ></footerCard>
  </q-card-section>
</template>

<script>
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import footerCard from "components/eofs/Shared/footerCard";
import DxButton from "devextreme-vue/button";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
  DxFilterRow,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxLookup,
    DxFilterRow,
    footerCard,
  },
  props: ["metaValue", "disable"],
  async created() {
    this.status = this.$route.query.status;
    let accountALL = await this.getAllAccounts();
    this.proAccount = accountALL.filter((e) => e.id == this.order.accountId);
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(
      this.order.departmentId
    );

    // console.log("nameDepartmentName", this.nameDepartmentName);
    this.order.Requests.sort(this.compareValues("star", "asc"));

    let idDis = null;
    for (let i = 0; i < this.order.Requests.length; i++) {
      if (this.order.Requests[i].id == this.$route.query.id) {
        // console.log(this.order.Requests[i]);
        idDis = this.order.Requests[i].star;
        // console.log("idDis", idDis);
      }
    }
    const orderFiler = this.order.OrderMeta.filter((e) => e.maNV);

    if (
      this.order.slug == "xac-nhan-cong" &&
      !moment(
        moment(orderFiler[0].date, "DD-MM-YYYY").format("YYYY-MM-DD")
      ).isSameOrAfter(moment().format("YYYY-MM-DD"))
    )
      this.active1 = true;
    else {
      this.active1 = false;
    }

    this.nextId = this.order.Requests.find((e) => e.star > idDis);
    // console.log("data", this.nextId);
    this.nextId2 = this.order.Requests.filter(
      (e) => e.star > this.request.star && e.position != "Phòng vật tư"
    );
    this.nextId3 = this.order.Requests.filter(
      (e) =>
        e.star > this.request.star &&
        (e.position == "Phòng vật tư" || e.position == "Phòng bảo vệ")
    );

    //     console.log(
    //   this.order.slug == "xac-nhan-cong",
    //   this.order.OrderMeta,    );
    //     const orderFiler = this.order.OrderMeta.filter((e) => e.maNV);
    // console.log(
    //   moment(orderFiler[0].date, "DD-MM-YYYY").format("YYYY-MM-DD"),
    //   "dsada",
    //   moment(
    //     moment(orderFiler[0].date, "DD-MM-YYYY").format("YYYY-MM-DD")
    //   ).isSameOrAfter(moment().format("YYYY-MM-DD"))
    // );
    // if (
    //   this.order.slug == "xac-nhan-cong" &&
    //   !moment(
    //     moment(orderFiler[0].date, "DD-MM-YYYY").format("YYYY-MM-DD")
    //   ).isSameOrAfter(moment().format("YYYY-MM-DD"))
    // )
    //   this.active1 = true;
    // else {
    //   this.active1 = false;
    // }
    // console.log("this.nextId", this.nextId);
    // console.log("this.nextId2", this.nextId2);
    // console.log("this.nextId3", this.nextId3);
  },
  mounted() {},
  data() {
    return {
      myDepartment: null,
      stepDepartment: null,
      departments: [],
      events: [],
      options: null,
      nameDepartmentName: null,
      account: [],
      active: false,
      active1: false,
      proAccount: null,
      statusRequests: null,
      nextId2: null,
      nextId3: null,
      totalHours: 0,
    };
  },
  computed: {
    ...mapGetters("orders", ["order"]),
  },
  watch: {
    // async statusRequests(newValue){
    //     if(newValue){
    //       console.log('newValue',newValue)
    //     }else{
    //       console.log('newValue',newValue)
    //     }
    // }
  },
  methods: {
    async RowUpdated() {
      const { hoursIn } = this.order.OrderMeta.filter((e) => e.maNV)[0];
      const { hoursOut } = this.order.OrderMeta.filter((e) => e.maNV)[0];
      const { total } = this.order.OrderMeta.filter((e) => e.maNV)[0];
      const { id } = this.order.OrderMeta.filter((e) => e.maNV)[0];
      const payload = {
        hoursIn,
        hoursOut,
        total,
        id,
      };
      await this.updateOrderMetaOT(payload);
      // console.log("this", payload);

      // let fullName = this.task.lastName;
      // let position = this.proAccount[0].position;
      // let department = this.nameDepartmentName.NAME;
      // let phoneNumber = this.userInfo.PHONE;
      // let selection = "Làm thêm giờ";
      // let work = this.task.work;
      // let hoursIn = this.task.timeIn;
      // let hoursOut = this.task.timeOut;
      // let total = this.totalHoursUpd;
      // let maNV = this.task.maNV;
      // let date = this.task.date;
      // let id = this.task.id;
      // console.log(          fullName,
      //   phoneNumber,
      //   selection,
      //   work,
      //   hoursIn,
      //   hoursOut,
      //   date,
      //   maNV,
      //   id,
      //   position,
      //   department,
      //   total)
      return;
      await this.updateOrderMeta({
        ...this.order.OrderMeta[0],
        metaValue: JSON.stringify([this.metaValue]),
        fullName,
        phoneNumber,
        selection,
        work,
        hoursIn,
        hoursOut,
        date,
        maNV,
        id,
        position,
        department,
        total,
      });
      await this.loadData(this.$route.query.id);
      await this.loadData(this.$route.query.id);
    },

    async activeReq(task) {
      // console.log("task Ac", typeof task.statusRequests);

      let payload = {
        id: task.id,
        statusRequests: task.statusRequests,
      };
      let data = await this.activeRequestsMeta(payload);
      // console.log(data);
    },
    activeUp() {
      // console.log(this.order.status != "Đã được duyệt");
      if (this.order.status != "Đã được duyệt") this.active = true;
    },
    totaHours() {
      this.order.OrderMeta.filter((e) => e.maNV)[0].total = moment
        .utc(
          moment(
            this.order.OrderMeta.filter((e) => e.maNV)[0].hoursOut,
            " HH:mm"
          ).diff(
            moment(
              this.order.OrderMeta.filter((e) => e.maNV)[0].hoursIn,
              "HH:mm"
            )
          )
        )
        .format("HH:mm");
    },
    compareValues(key, order = "asc") {
      return function (a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // nếu không tồn tại
          return 0;
        }

        const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
        const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order == "desc" ? comparison * -1 : comparison;
      };
    },
    ...mapActions("requests", ["activeRequestsMeta"]),
    ...mapActions("base", ["GET_DEPARTMENTSBYID"]),
    ...mapActions("orders", [
      "getOneOrder",
      "getAllRequests",
      "getAllAccounts",
    ]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      "addorderMeta",
      "deleteOrderMeta",
      "updateOrderMetaOT",
    ]),
  },
};
</script>
