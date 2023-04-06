<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary print-hide">
      <div class="row">
        <div class="col-6 top-title text-orange">In mẫu khai báo</div>
        <div
            class="col-6 top-title cursor-pointer text-orange"
            align="right"
            @click="showChooseDate = true"
          >
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
          </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row print-hide">
        <q-select
          class="col-6"
          color="grey-3"
          label-color="orange"
          filled
          v-model="form"
          :options="forms"
          label="Chọn biểu mẫu"
          @input="onChangeForm"
          dense
        />
        <q-select
          class="col-2"
          color="grey-3"
          label-color="orange"
          filled
          v-model="user"
          :options="users"
          label="Chọn người xem"
          @input="onChangeUser"
          dense
        />
        <div v-if="accountName != null" class="col-4">
          Người được chọn : {{ accountName }}
        </div>
      </div>
      <div v-show="showData" class="container">
        <div class="header">
          <p style="font-size: 24px; font-weight: bold">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </p>
          <p style="font-size: 20px">Độc lập - Tự do - Hạnh phúc</p>
          <p align="right">
            Hà Nội, ngày {{ ngay }} tháng {{ thang }} năm {{ nam }}
          </p>
          <h4>
            {{ title }}
          </h4>
        </div>

        <div class="body">
          <div v-if="location == 'top'" class="description">
            <span v-html="description"></span>
          </div>
          <div class="information row">
            <div
              v-for="(value, index) in listOptions"
              :key="index"
              class="col-6"
            >
              {{ value.TITLE }}: {{ value.ANSWER }}
            </div>
          </div>
          <div v-if="location == 'bottom'" class="description">
            <span v-html="description"></span>
          </div>
          <div class="signature row" align="center">
            <div class="col-6">ĐẠI DIỆN NGƯỜI SỬ DỤNG LAO ĐỘNG</div>
            <div class="col-6">NGƯỜI CAM KẾT</div>
          </div>
        </div>
      </div>
    </q-card-section>
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../../ultils";
import DialogSelectDate from "../../components/commons/DialogSelectFromDateToDate";
export default {
  components:{
    DialogSelectDate,
  },
  data() {
    return {
      form: null,
      forms: [],
      user: null,
      users: [],
      listOptions: [],
      showData: false,
      description: null,
      location: null,
      title: null,
      ngay: null,
      thang: null,
      nam: null,
      accountName: null,
      fromDate: null,
      toDate: null,
      showChooseDate: false,
    };
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.loadFormRegister();
  },
  methods: {
    ...mapActions("formRegister", [
      "getFormRegister",
      "getUserFormRegisterByFormId",
      "getUserAnswerByForm",
      "getFormRegisterById",
    ]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.loadFormRegister();
    },
    chonFromDate(e) {
      this.fromDate = e.value;
      this.loadFormRegister();
    },
    chonToDate(e) {
      this.toDate = e.value;
      this.loadFormRegister();
    },
    onChangeForm() {
      this.loadUserFormRegister();
      this.showData = false;
      this.user = null;
    },
    async loadFormRegister() {
      let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
      };
      const data = await this.getFormRegister(payload);
      this.forms = [];
      data.forEach((el) => {
        this.forms.push({
          label: el.TITLE,
          value: el.ID,
        });
      });
      console.log("data", data);
    },
    async loadUserFormRegister() {
      if (this.form != null) {
        const payload = {
          formId: this.form.value,
        };
        const data = await this.getUserFormRegisterByFormId(payload);
        this.users = [];
        data.forEach((el) => {
          this.users.push({
            label: el.ACCOUNT,
            value: el.userFormId,
            accountId: el.ID,
            account: el.LAST_NAME
          });
        });
        console.log("data user", data);
      }
    },

    async onChangeUser() {
      const payload = {
        userFormId: this.user.value,
      };
      this.accountName = this.user.account;
      const payload2 = {
        formId: this.form.value,
      };
      const data = await this.getUserAnswerByForm(payload);
      const data2 = await this.getFormRegisterById(payload2);
      this.title = data2[0].TITLE;
      this.description = data2[0].DESCRIPTION;
      this.location = data2[0].LOCATION;
      console.log("data2", data2[0].CREATED_DATE);
      const date = new Date(data2[0].CREATED_DATE);
      this.ngay = date.getDate();
      this.thang = date.getMonth() + 1;
      this.nam = date.getFullYear();
      this.listOptions = [];
      this.listOptions = data;
      this.showData = true;
    },
  },
};
</script>

<style>
.header {
  text-align: center;
}
.title {
  text-align: center;
  font-weight: bold;
  font-size: 18;
}
.body {
  font-size: 20px;
}
</style>