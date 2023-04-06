<template>
  <q-page>
    <!-- <q-page-sticky expand position="top">
      <q-toolbar class="bg-primary text-orange q-pa-sm">
        <q-toolbar-title>Danh sách đề xuất chờ phòng VT xác nhận</q-toolbar-title>
      </q-toolbar>
    </q-page-sticky>
    <div class="q-mt-xl row">
      <div class="col-2 q-pa-lg text-bold text-right">
        Tìm kiếm dữ liệu
      </div>
      <div class="q-pa-md col" style="max-width: 300px">
        <q-input filled v-model="dateStart">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  mask="YYYY-MM-DD"
                  @input="searchData"
                  v-model="dateStart"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="q-pa-md col" style="max-width: 300px">
        <q-input filled v-model="dateEnd">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date @input="searchData" mask="YYYY-MM-DD" v-model="dateEnd">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div> -->
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Danh sách đề xuất chờ phòng VT xác nhận
          <!-- <span class="text-amber-14">{{ factory ? factory.label : "" }}</span> -->
        </div>

        <div
          class="col-6 cursor-pointer text-blue text-bold"
          style="font-size: 18px"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
          <span class="text-amber-14">{{ denNgay }}</span>
        </div>
      </div>
    </div>
    <DxDataGrid class="q-ma-sm" :data-source="data.data" :show-borders="false">
      <DxColumn :width="70" sort-order="asc" data-field="number" caption="#" />
      <DxColumn data-field="title" caption="Phiếu đề xuất" :width="400" />
      <DxColumn
        data-field="Account.lastName"
        sort-order="asc"
        caption="Người đề xuất"
        :width="200"
      />
      <DxColumn :width="200" data-field="Department.name" caption="Phòng ban" />
      <DxColumn
        :width="200"
        data-field="status"
        caption="Trạng thái phê duyệt"
      />
      <DxColumn
        v-if="this.userInfo.department == 102320"
        :width="150"
        data-field="activeSeen"
        caption="Xác nhận P VT"
        cell-template="cellTemplateActiveSeen"
      ></DxColumn>
      <DxColumn
        v-if="this.userInfo.department == 102319"
        :width="150"
        data-field="activeSeen"
        caption="Xác nhận P NS"
        cell-template="cellTemplateActiveSeen"
      />
      <DxColumn
        data-field="createdAt"
        cell-template="cellTemplateCreatedAt"
        :width="200"
        caption="Ngày tạo"
      />
      <DxColumn
        :width="100"
        :allow-sorting="false"
        data-field="id"
        cell-template="cellTemplate"
        caption="Xem"
      />
      <DxColumn
        :width="150"
        :allow-sorting="false"
        data-field="id"
        cell-template="cellTemplateSuccess"
        caption="Xác nhận hoàn thành"
      />
      <template #cellTemplate="{ data }">
        <a @click="activeSeen(data.value)" :href="'/#/print?id=' + data.value"
          >Xem</a
        >
      </template>
      <template #cellTemplateCreatedAt="{ data }">
        <a>{{ moment(data.value).format("l") }}</a>
      </template>
      <template #cellTemplateActiveSeen="{ data }">
        <a>{{ data.value == 1 ? "Đã xem" : "Chưa xem" }}</a>
      </template>
      <template #cellTemplateSuccess="{ data }">
        <q-btn
          @click="activeSuccess(data.value)"
          color="positive"
          label="Xác nhận"
        />
      </template>
      <DxSorting mode="multiple" />
    </DxDataGrid>
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
  </q-page>
</template>

<script>
import { DxColumn, DxDataGrid, DxSorting } from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import DialogSelectDate from "../../components/commons/DialogSelectFromDateToDate.vue";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../../ultils";

export default {
  components: {
    DxColumn,
    DxDataGrid,
    DxSorting,
    DialogSelectDate,
  },
  methods: {
    ...mapActions("orders", [
      "getAllOrders",
      "getAllOrder",
      "activeSeenOrder",
      "activeSuccessOrder",
      "searchOrder",
    ]),
    async searchData() {
      let payload = {
        dateStart: moment(this.dateStart).format("YYYY-MM-DD 00:00:00"),
        dateEnd: moment(this.dateEnd).format("YYYY-MM-DD 23:59:59"),
        // dateStart: moment(this.dateStart).format("YYYY-MM-DD 00:00"),
        // dateEnd: moment(this.dateEnd).format("YYYY-MM-DD 23:59"),
        idDepartment: 102320,
        activeSuccess: 0,
      };
      this.data = await this.searchOrder(payload);
      console.log("dataSearch", this.data);
    },
    async activeSeen(id) {
      let payload = {
        id: id,
        activeSeen: 1,
      };
      await this.activeSeenOrder(payload);
      await this.loadData();
    },
    async activeSuccess(id) {
      console.log("id");
      let payload = {
        id: id,
        activeSuccess: 1,
        nameSuccess: this.userInfo.account + " " + this.userInfo.lastName,
      };
      await this.activeSuccessOrder(payload);
      await this.loadData();
    },
    async loadData() {
      let payload = {
        dateStart: moment(this.dateStart).format("YYYY-MM-DD 00:00"),
        dateEnd: moment(this.dateEnd).format("YYYY-MM-DD 23:59"),
        idDepartment: 102320,
        activeSuccess: 0,
      };
      this.data = await this.searchOrder(payload);
      console.log("dataSearch", this.data);
    },
    async chooseDate(f, t) {
      this.dateStart = f;
      this.dateEnd = t;
      this.showChooseDate = false;
      // await this.load();
      // await this.loadDepartment(this.factory);
      this.loadData();
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },
  },
  computed: {
    ...mapGetters("orders", ["orders"]),
    ...mapGetters("base", ["userInfo"]),
    tuNgay() {
      return formatDateVN(this.dateStart);
    },
    denNgay() {
      return formatDateVN(this.dateEnd);
    },
  },
  data() {
    return {
      data: null,
      dateStart: moment().startOf("month").format("YYYY-MM-DD HH:mm"),
      dateEnd: moment().format("YYYY-MM-DD HH:mm"),
      showChooseDate: false,
      dateStart: null,
      dateEnd: null,
    };
  },
  async created() {
    await this.loadData();
    this.dateEnd = new Date();
    this.dateStart = new Date();
    this.dateEnd.setDate(this.dateEnd.getDate());
    this.dateStart.setDate(this.dateStart.getDate() - 21);
  },
};
</script>
