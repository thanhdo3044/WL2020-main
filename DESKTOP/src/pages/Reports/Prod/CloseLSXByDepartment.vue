<template>
  <q-page class="q-pa-sm">
    <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Đóng/Mở LSX từng công đoạn
        </div>

      </div>
    <!-- <q-card-section class="bg-primary print-hide">
      <div class="row">
        <div class="col-6 top-title text-orange">
          Đóng/Mở LSX từng công đoạn
        </div>
      </div>
    </q-card-section> -->
    <q-card-section>
      <div class="row">
        <div class="col-12 col-md-1 q-pa-sm">
          <q-input
            filled
            label-color="orange"
            v-model.number="year"
            type="number"
            label="Năm"
            dense
           
          />
        </div>
        <div class="col-12 col-md-1 q-pa-sm">
          <q-input
            filled
            label-color="orange"
            @input="changeWeek"
            v-model.number="week"
            type="number"
            label="Tuần"
            dense
          />
        </div>
        <div class="col-12 col-md-2 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            @input="changeFactory"
            v-model="factory"
            :options="options"
            label="Chọn nhà máy"
            dense
          />
        </div>
        
        
        <div class="col-12 col-md-2 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            @input="changeNumber"
            v-model="number"
            :options="numbers"
            label="Chọn Lệnh sản xuất"
            dense
          />
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="row" style="margin-top: 30px">
            <div class="col-6 bs" style="background-color:#daf8e1" align="center">
              <p class="cssCongDoanOpen">Công đoạn đang mở</p>
            </div>
            <div class="col-6 bs" style="background-color:#daf8e1" align="center">
              <p class="cssCongDoanClose">Công đoạn đang đóng</p>
            </div>
          </div>
          <div class="row">
            <div class="col-6 bs">
              <q-option-group
                :options="departmentOpens"
                type="checkbox"
                v-model="departmentClose"
              />
            </div>
            <div class="col-6 bs">
              <q-option-group
                :options="departmentCloses"
                type="checkbox"
                v-model="departmentOpen"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <q-btn
                v-if="departmentClose.length != 0"
                color="orange"
                @click="showClose"
                label="Đóng LSX"
              />
            </div>
            <div class="col-6">
              <q-btn
                v-if="departmentOpen.length != 0"
                class="col-6"
                color="positive"
                @click="showOpen"
                label="Mở LSX"
              />
            </div>
          </div>
        </div>
        <div class="col-6">
          <div style="margin-left:10px">
            <span style="font-size:20px;font-weight:bold;color:orange">Lịch sử đóng/mở LSX</span>
          <DxDataGrid :data-source="poLogs" :show-borders="true">
            <DxColumn cssClass="dongLenh" data-field="NUMBER" caption="Lệnh sản xuất" />
            <DxColumn cssClass="dongLenh" data-field="DEPARTMENT_NAME" caption="Công đoạn" />
            <DxColumn cssClass="dongLenh" data-field="STATUS" width="80" caption="Trạng thái" />
            <DxColumn cssClass="dongLenh" data-field="LAST_NAME" caption="Người thay đổi" />
            <DxColumn
            cssClass="dongLenh"
            width="150"
              data-field="CREATED_AT"
              caption="Giờ thay đổi"
              format="dd/MM/yyyy HH:mm:ssz"
              dataType="date"
            />
          </DxDataGrid>
          </div>
          
        </div>
      </div>
    </q-card-section>
    <q-dialog v-model="isClose">
      <q-card style="min-width: 600px">
        <q-card-section class="row items-center">
          <div class="top-title">
            Bạn có thực sự muốn đóng LSX ở công đoạn này ?
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Đồng ý"
            @click="closeDepartment"
            color="positive"
            v-close-popup
          />
          <q-btn label="từ chối" color="orange" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isOpen">
      <q-card style="min-width: 600px">
        <q-card-section class="row items-center">
          <div class="top-title">
            Bạn có thực sự muốn mở LSX ở công đoạn này ?
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Đồng ý"
            @click="openDepartment"
            color="positive"
            v-close-popup
          />
          <q-btn label="từ chối" color="orange" v-close-popup />
          
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import { showNotifySuccess, showNotifyError } from "../../../ultils";
import { DxDataGrid, DxColumn } from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
  },
  data() {
    return {
      factory: null,
      week: null,
      year: null,
      number: null,
      numbers: [],
      poLogs: [],
      departmentCloses: [],
      departmentOpens: [],
      departmentClose: [],
      departmentOpen: [],
      isClose: false,
      isOpen: false,
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 100004,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 100005,
          code: "TB",
        },
      ],
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  created() {
    this.week = moment().week();
    this.year = moment().year();
  },
  methods: {
    ...mapActions("po", [
      "getNumberInLSX",
      "getDepartmentInLSX",
      "closeStepInLSX",
      "openStepInLSX",
      "getPoLogByNumber",
    ]),
    loadData() {},
    changeFactory() {
      this.loadNumber();
    },
    async loadNumber() {
      const payload = {
        factoryId: this.factory.factoryId,
        week: this.week,
        year: this.year,
      };
      const data = await this.getNumberInLSX(payload);
      this.numbers = [];
      data.data.forEach((el) => {
        this.numbers.push({
          label: el.number,
          value: el.number,
        });
      });
    },
    async loadPoLog(){
      const payload = {
        number: this.number.value,
      };
      const data2 = await this.getPoLogByNumber(payload);
      this.poLogs = data2.data;
    },
    async changeNumber() {
      const payload = {
        number: this.number.value,
      };
      const data = await this.getDepartmentInLSX(payload);
      this.loadPoLog();
      this.departmentCloses = [];
      this.departmentOpens = [];
      data.data.forEach((el) => {
        if (el.endPO === 1) {
          this.departmentCloses.push({
            label: el.NAME,
            value: el.ID,
          });
        } else {
          this.departmentOpens.push({
            label: el.NAME,
            value: el.ID,
          });
        }
      });
    },
    showClose() {
      console.log("pass");
      this.isClose = true;
    },
    showOpen() {
      this.isOpen = true;
    },
    async closeDepartment() {
      if (this.departmentClose.length > 0) {
        const payload = {
          number: this.number.value,
          stepIds: this.departmentClose,
          accountId: this.userInfo.id,
        };
        const data = await this.closeStepInLSX(payload);
        if (data.meta.success) {
          this.departmentClose = [];
          this.changeNumber();
          this.loadPoLog();
          showNotifySuccess("Tạo thành công !");
        } else {
          showNotifyError();
        }
      }
    },
    async openDepartment() {
      if (this.departmentOpen.length > 0) {
        const payload = {
          number: this.number.value,
          stepIds: this.departmentOpen,
          accountId: this.userInfo.id,
        };
        const data = await this.openStepInLSX(payload);
        if (data.meta.success) {
          this.changeNumber();
          this.loadPoLog();
          this.departmentOpen = [];
          showNotifySuccess("Tạo thành công !");
        } else {
          showNotifyError();
        }
      }
    },
    changeWeek() {
      this.loadNumber();
    },
  },
};
</script>

<style>

.cssCongDoanOpen {
  font-size: 24px;
  font-weight: bold;
  color: #21ba45;
  margin: 0px;
}
.cssCongDoanClose {
  font-size: 24px;
  font-weight: bold;
  color: red;
  margin: 0px;
}

.bs {
  border: 1px solid black;
}
</style>