<template>
  <q-page class="q-pa-sm bg-white">
    <div class="row justify-center">
      <div class="page-title">
        <div
          class="col-auto text-positive"
          style="font-size: 16px; font-weight: bold"
        >
          DANH SÁCH BIỂU MẪU KHAI BÁO
        </div>
      </div>
      <div
        class="col-12 top-title cursor-pointer text-bold"
        style="color: #009688; font-size: 10px"
        align="center"
        @click="showChooseDate = true"
      >
        <span class="text-primary">Từ ngày </span>
        <span class="text-orange">{{ tuNgay }} </span>
        <span>&ensp; - &ensp;</span>
        <span class="text-primary">Đến ngày </span>
        <span class="text-orange">{{ denNgay }}</span>
      </div>
    </div>
    <hr style="width: 50%" />
    <div class="row">
      <div
        v-for="(value, index) in listFormRegister"
        :key="index"
        class="col-lg-4 col-sm-6 col-xs-12"
      >
        <q-card v-if="value.STATUS == NULL" class="my-card">
          <q-card-section class="card-section">
            <div style="font-size: 14px">
              {{ value.TITLE }}
            </div>
            <div class="text-subtitle2">
              Ngày tạo:
              {{ value.CREATED_DATE.replace("T", " ").substring(0, 16) }}
            </div>
            <div class="text-subtitle2">Trạng thái: <q-badge color="red">Chưa khai báo</q-badge></div>
          </q-card-section>
          <q-separator />

          <q-card-actions align="center">
            <q-btn @click="showDetail(value.ID, index)" color="positive"
              >Khai báo</q-btn
            >
          </q-card-actions>
        </q-card>
        <q-card v-else class="my-card">
          <q-card-section class="card-section-2">
            <div style="font-size: 14px">
              {{ value.TITLE }}
            </div>
            <div class="text-subtitle2">
              Ngày tạo:
              {{ value.CREATED_DATE.replace("T", " ").substring(0, 16) }}
            </div>
            <div class="text-subtitle2">Trạng thái: <q-badge color="positive">Đã khai báo</q-badge> </div>
          </q-card-section>
          <q-separator />

          <q-card-actions align="center">
            <q-btn @click="viewDetail(value.ID)" color="blue">Xem</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <q-dialog
      persistent
      v-model="show"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white">
        <q-card-section>
          <div class="text-h6" align="center">{{ title }}</div>
          <span v-if="location == 'top'" v-html="description"></span>
          <div
            v-for="(value, index) in listFormQuesion"
            :key="index"
            class="row"
          >
            <q-input
              v-if="value.TYPE == 'text' && !value.REQUIRED"
              class="col-12"
              v-model="value.text"
              :label="value.TITLE"
            />
            <q-input
              v-if="value.TYPE == 'text' && value.REQUIRED"
              class="col-12"
              v-model="value.text"
              :label="value.TITLE"
              :rules="[(val) => !!val || 'Vui lòng điền đầy đủ thông tin']"
            />
            <q-input
              class="col-12"
              v-if="value.TYPE == 'date'"
              :label="value.TITLE"
              filled
              v-model="value.text"
              mask="date"
              :rules="['date']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="value.text">
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
            <div v-if="value.TYPE == 'radio'" class="col-12">
              <div>{{ value.TITLE }}</div>
              <q-radio
                v-for="(option, index2) in value.options"
                :key="index2"
                v-model="value.text"
                :val="option.OPTION"
                :label="option.OPTION"
              />
            </div>
            <div v-if="value.TYPE == 'checkbox'" class="col-12">
              <div>{{ value.TITLE }}</div>
              <q-checkbox
                v-for="(option, index2) in value.options"
                :key="index2"
                v-model="value.text"
                :val="option.OPTION"
                :label="option.OPTION"
              />
            </div>
          </div>
          <span v-if="location == 'bottom'" v-html="description"></span>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Khai báo" @click="onSubmit" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      persistent
      v-model="showData"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white form">
        <div class="header">
          <p style="font-size: 14px; font-weight: bold">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </p>
          <p style="font-size: 13px">Độc lập - Tự do - Hạnh phúc</p>
          <p style="font-size: 12px" align="right">
            Hà Nội, ngày {{ ngay }} tháng {{ thang }} năm {{ nam }}
          </p>
          <p>
            {{ title }}
          </p>
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
              <span style="font-weight: bold">{{ value.TITLE }}</span
              >: {{ value.ANSWER }}
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
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Đóng" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showChooseDate" persistent>
      <q-card class="my-card" style="min-width: 80%">
        <q-card-section>
          <div class="top-title">Chọn khoảng ngày</div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <div class="row justify-between">
            <div>
              <q-date v-model="fromDate" title="Từ ngày" />
            </div>
            <div>
              <q-date v-model="toDate" today-btn title="Đến ngày" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat color="red" label="Hủy" @click="cancelChooseDate" />
          <q-btn
            flat
            label="Đồng ý"
            @click="selectDate(fromDate, toDate)"
            color="primary"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
export default {
  data() {
    return {
      show: false,
      showData: false,
      userFormId: null,
      title: null,
      description: null,
      selection: [],
      location: null,
      listFormRegister: [],
      listFormQuesion: [],
      listOptions: [],
      showChooseDate: false,
      fromDate: null,
      toDate: null,
      ngay: null,
      thang: null,
      nam: null,
      isManager: false,
      departmentId: null,
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  created() {
    this.toDate = new Date();
    this.fromDate = new Date();
    this.toDate.setDate(this.toDate.getDate());
    this.fromDate.setDate(this.fromDate.getDate() - 90);
    this.loadFormRegister();
  },
  methods: {
    ...mapActions("formRegister", [
      "getTitleByAccount",
      "getFormQuestion",
      "insertUserFormRegister",
      "insertUserAnswer",
      "getFormRegisterById",
      "getUserAnswerByAccountId",
      "GET_DEPARTMENT_IS_MANAGER",
      "getFormRegisterManager"
    ]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    // kiểm tra người dùng có phải trưởng, phó phòng không ?
    async getDepartmentIsManager() {
      const payload = {
        accountId: this.userInfo.id,
      };
      const data = await this.GET_DEPARTMENT_IS_MANAGER(payload);
      if (data.length > 0) {
        this.isManager = true;
        this.departmentId = data[0].ID;
        this.loadFormRegisterManager();
      } else {
        this.isManager = false;
      }
      console.log("getAccountIsManager", data);
    },
    // lấy biểu mẩu của trưởng, phó phòng
    async loadFormRegisterManager(){
      const payload = {
        accountId: this.userInfo.id,
        fromDate: formatDateISO(this.fromDate),
        toDate: formatDateISO(this.toDate),
        departmentId: this.departmentId
      }
      const data = await this.getFormRegisterManager(payload);
      if(data.length > 0){
        data.forEach(el => {
          this.listFormRegister.push(el);
        });
      }
    },
    async selectDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;

      this.loadFormRegister();
    },
    // hiển thị chi tiết biểu mẫu cần khai báo
    showDetail(id, index) {
      this.title = this.listFormRegister[index].TITLE;
      this.description = this.listFormRegister[index].DESCRIPTION;
      this.location = this.listFormRegister[index].LOCATION;
      this.loadFormQuestion(id);
      this.show = true;
    },
    //hiện thị thông tin của biểu mẫu đã khai báo
    async viewDetail(id) {
      const payload = {
        formId: id,
        accountId: this.userInfo.id,
      };
      const payload2 = {
        formId: id,
      };
      const data = await this.getUserAnswerByAccountId(payload);
      const data2 = await this.getFormRegisterById(payload2);
      this.title = data2[0].TITLE;
      this.description = data2[0].DESCRIPTION;
      this.location = data2[0].LOCATION;
      const date = new Date(data2[0].CREATED_DATE);
      this.ngay = date.getDate();
      this.thang = date.getMonth() + 1;
      this.nam = date.getFullYear();
      this.listOptions = [];
      this.listOptions = data;
      this.showData = true;
    },
    //lấy danh sách tiêu đề biểu mẫu không yêu cầu trưởng, phó phòng
    async loadFormRegister() {
      const payload = {
        accountId: this.userInfo.id,
        fromDate: formatDateISO(this.fromDate),
        toDate: formatDateISO(this.toDate),
      };
      const data = await this.getTitleByAccount(payload);
      this.listFormRegister = data;
      this.getDepartmentIsManager()
    },
    // lấy danh sách câu hỏi trong biểu mẫu
    async loadFormQuestion(id) {
      const payload = {
        formId: id,
      };
      this.addUserFormRegister(id);
      const data = await this.getFormQuestion(payload);
      data.forEach((el) => {
        if (el.TYPE == "checkbox") {
          el.text = [];
        } else {
          el.text = null;
        }
      });
      this.listFormQuesion = data;
      console.log("data", data);
    },
    // thêm người khai báo biểu mẫu
    async addUserFormRegister(id) {
      const payload = {
        formId: id,
        accountId: this.userInfo.id,
      };
      const data = await this.insertUserFormRegister(payload);
      this.userFormId = data[0].ID;
    },
    // thêm câu trả lời biểu mẫu
    onSubmit() {
      this.listFormQuesion.forEach((el) => {
        if (el.TYPE == "checkbox") {
          el.text = JSON.stringify(el.text);
        }
        this.addUserAnswer(el.ID, el.text);
      });
      this.loadFormRegister();
    },
    
    async addUserAnswer(questionId, text) {
      const payload = {
        userFormId: this.userFormId,
        questionId: questionId,
        answer: text,
        accountId: this.userInfo.id,
      };
      await this.insertUserAnswer(payload);
    },
  },
};
</script>

<style>
.my-card {
  margin: 5px;
}
.card-section {
  background-color: #607d8b;
  color: #ffc107;
  font-family: serif;
}
.card-section-2 {
  background-color: #26a69a;
  color: #ffc107;
  font-family: serif;
}
.header {
  text-align: center;
}
.title {
  text-align: center;
  font-weight: bold;
  font-size: 16px;
}
.body {
  font-size: 16px;
  font-family: serif;
}
.form {
  font-family: serif;
}
.description {
  font-size: 12px;
}
.signature {
  font-size: 12px;
}
.information {
  font-size: 12px;
}
</style>