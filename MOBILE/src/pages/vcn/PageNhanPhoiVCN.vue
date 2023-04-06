<template>
  <q-page padding class="bg-blue-grey-7">
    <app-bar class="text-white">Lịch sử nhận phôi</app-bar>

    <q-select
    dark
    label-color="amber"
      filled
      v-model="step"
      label="Chọn công đoạn"
      :options="departments"
      emit-value
      map-options
      behavior="menu"
      dense
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input
    dark
    label-color="amber"
      v-if="step"
      color="teal"
      filled
      v-model="text"
      label="Tên chi tiết"
      dense
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon
          v-if="text"
          @click="text = null"
          name="close"
          class="cursor-pointer"
        />
      </template>
    </q-input>
    <q-input
    dark
    label-color="amber"
      v-if="step"
      filled
      v-model="date"
      mask="date"
      :rules="['date']"
      dense
      label="Ngày nhận"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon
          v-if="date"
          @click="date = ''"
          name="close"
          class="cursor-pointer"
        />
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date v-model="date">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <!-- <q-checkbox
      v-for="(number, index) in lenhSanXuats"
      :key="index"
      dense
      v-model="numbers"
      :val="number"
      :label="number"
      color="teal"
      class="q-ml-sm q-mt-sm"
    />
    <q-checkbox
      v-show="showErrPackage"
      dense
      v-model="selectionPackage"
      :val="selectionPackage"
      label="Phôi lỗi"
      color="teal"
      class="q-ml-sm q-mt-sm text-red"
    /> -->
    <div class="row justify-center">
      <!-- v-if="
            numbers.includes(item.number) &&
              (!date || moment(date.slice(0, 10)).isSame(item.updatedAt, 'day'))
          " -->
      <div
        v-for="item in dataHistoryPackage"
        :key="item.id"
        class="col-12 col-sm-6 q-mt-sm"
      >
        <q-card class="my-card bg-blue-grey-7" style="border:2px solid white">
          <q-card-section class="bg-red">
            <!-- <div>
              {{item}}
            </div> -->
            <div class="text-h6 text-white">
              {{ item.Chi_tiet_cum }}
            </div>
            <div class="text-subtitle2 text-white">
              Nhận bởi:
              {{ getAccountById(item.VERIFY_BY).account }} -
              {{ item.Nguoi_nhan }}
            </div>
          </q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label
                  >Số lượng: <b>{{ item.So_luong }}</b></q-item-label
                >
                <q-item-label
                  >Người giao:
                  <!-- {{getAccountById(item.CREATE_BY).account}} - {{item.Nguoi_tao}} -->
                  {{ item.To }}
                </q-item-label>
                <q-item-label caption
                  >Ngày giao : {{ item.Ngay_tao | ngay }}</q-item-label
                >
                <!-- <q-item-label caption
                  >Lệnh sản xuất: {{ item.number }}</q-item-label
                > -->
                <!-- <q-item-label caption>No: {{ item.packageId }}</q-item-label> -->
              </q-item-section>
            </q-item>
          </q-list>
          <q-card-actions>
            <q-btn flat round icon="event" />
            <q-btn flat> Ngày nhận: {{ item.VERIFY_DATE | ngay }} </q-btn>
            <!-- <q-btn flat color="primary">
              Đã nhận
            </q-btn> -->
          </q-card-actions>
        </q-card>
        <q-separator />
      </div>
    </div>
    <div class="row justify-center">
      <!-- v-if="
            numbers.includes(item.number) &&
              (!date || moment(date.slice(0, 10)).isSame(item.updatedAt, 'day'))
          " -->
    </div>
    <div class="row justify-center q-mt-md">
      <div
        v-for="item in sanLuongs(text)"
        :key="item.id"
        class="col-12 col-sm-6 q-mt-sm"
      >
        <q-card
          v-if="
            numbers.includes(item.number) &&
            (!date || moment(date.slice(0, 10)).isSame(item.updatedAt, 'day'))
          "
          class="my-card"
        >
          <q-card-section >
            <div class="text-h6">
              {{ item.Item.name }}
              {{
                [item.Item.height, item.Item.width, item.Item.length].join("*")
              }}
            </div>
            <div class="text-subtitle2">
              <q-badge color="green-4">
              Nhận bởi:
              {{ getAccountById(item.accountId2) | FullName }}
              </q-badge>
            </div>
          </q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label style="color:blue;font-weight:bold"
                  >Số lượng: <b>{{ item.quantity }}</b></q-item-label
                >
                <q-item-label
                  ><q-badge color="green-4">Người giao:
                  {{ getAccountById(item.accountId) | FullName }}</q-badge></q-item-label
                >
                <q-item-label caption
                  >Ngày giao: {{ item.createdAt }}</q-item-label
                >
                <q-item-label caption
                  >Lệnh sản xuất: {{ item.number }}</q-item-label
                >
                <q-item-label caption>No: {{ item.packageId }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-card-actions>
            <q-btn flat round icon="event" />
            <q-btn flat> Ngày nhận: {{ item.updatedAt }} </q-btn>
            <!-- <q-btn flat color="primary">
              Đã nhận
            </q-btn> -->
          </q-card-actions>
        </q-card>
        <q-separator />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AppBar from "../../components/AppBar";
import moment from "moment";
export default {
  // name: 'PageName',
  data() {
    return {
      step: null,
      numbers: [],
      text: null,
      date: moment().format("YYYY/MM/DD"),
      selectionPackage: true,
      showErrPackage: false,
      departments: [],
      dataHistoryPackage: [],
      id: null,
    };
  },
  components: {
     "app-bar": AppBar,
  },
  computed: {
    ...mapGetters("vcn", ["sanLuongs", "lenhSanXuats"]),
    ...mapGetters("base", ["myDepartments", "userInfo"]),
    ...mapGetters("orders", ["getAccountById"]),
  },
  methods: {
    ...mapActions("vcn", [
      "getAllSanLuongsVCN",
      "getHistoryPackageVCN",
    ]),
    async loadData(stepId) {
      this.id = stepId;
      console.log("stepId", stepId);
      this.$q.loading.show({
        message:
          'Hệ thống đang lọc dữ liệu.<br/><span class="text-primary">Xin vui lòng chờ...</span>',
      });
      await this.getAllSanLuongsVCN({ stepId });
      let payload = {
        verifyBy: this.userInfo.id,
        DESTINATION_ID: stepId,
      };
      this.dataHistoryPackage = await this.getHistoryPackageVCN(payload);
      if (this.dataHistoryPackage.length > 0) this.showErrPackage = true;
      else this.showErrPackage = false;
      this.numbers = [...this.lenhSanXuats];
      this.$q.loading.hide();
    },
    async loadDataPackage(stepId) {
      this.id = stepId;
      let payload = {
        verifyBy: this.userInfo.id,
        DESTINATION_ID: stepId,
      };
      this.dataHistoryPackage = await this.getHistoryPackageVCN(payload);
      if (this.dataHistoryPackage.length > 0) this.showErrPackage = true;
      else this.showErrPackage = false;
      console.log("this.dataHistoryPackage", this.sanLuongs(null));
    },
  },
  created() {
    let listDepartment = this.myDepartments.filter((d) =>
        102451
        ,102498
        ,102531
        ,102744
				,102745);
    listDepartment.forEach(el => {
      this.departments.push({
        label: `[${el.code}] ${el.name}`,
        value: el.id
      })
    });
  },
  watch: {
    step(newValue) {
      if (newValue) {
        this.loadData(newValue);
        this.loadDataPackage(newValue);
      }
    },
    async selectionPackage(newValue) {
      if (newValue) {
        await this.loadDataPackage(this.id);
      } else {
        this.dataHistoryPackage = null;
      }
    },
    async date(newValue) {
      if (newValue) {
        this.dataHistoryPackage = [];
        await this.loadDataPackage(this.id);
        this.dataHistoryPackage = this.dataHistoryPackage.filter((e) => {
          if (e.VERIFY_DATE.replaceAll("-", "/").slice(0, 10) == this.date) {
            console.log("e", e); // update định dạng 2021/02/25 rồi so sánh
            return e;
          } else this.dataHistoryPackage = [];
        });
      }
      if (this.date == "") {
        await this.loadDataPackage(this.id);
      }
    },
  },
};
</script>
