<template>
  <q-page class="bg-blue-grey-7">
    <app-bar class="text-white">Thủ kho xác nhận cấp sơn theo định mức</app-bar>
    <!-- <div class="row justify-center">
      <div class="col-12" align="center">
        <span class="text-white text-center text-bold"
          >THỦ KHO XÁC NHẬN CẤP SƠN THEO ĐỊNH MỨC</span
        >
        <hr width="50%" />
      </div>
    </div> -->
    <hr width="50%" />
    <div class="row">
      <div class="col-8">
        <q-select
        dark
          style="margin: 5px"
          v-model="factory"
          outlined
          label-color="orange"
          :options="arrFactory"
          @input="onChangeFactory"
          label="Chọn nhà máy"
          dense
        />
      </div>

      <div class="col-4">
        <q-input
        dark
          label="Năm"
          style="margin: 5px"
          v-model.number="year"
          outlined
          label-color="orange"
          @input="onChangeYear"
          type="number"
          dense
        />
      </div>
      <div class="col-8">
        <q-select
        dark
          style="margin: 5px"
          label-color="orange"
          outlined
          v-model="lsx"
          :options="arrLSX"
          @input="onChangeLSX"
          label="Chọn LSX"
          dense
        />
         </div>
      <div class="col-4">
        <q-input
        dark
          label="Tuần"
          style="margin: 5px"
          v-model.number="week"
          outlined
          label-color="orange"
          @input="onChangeWeek"
          type="number"
          dense
        />
      </div>
      
     
      <div class="col-12">
        <q-select
        dark
          v-model="soLan"
          style="margin: 5px"
          label-color="orange"
          outlined
          :options="arrSoLan"
          @input="onChangeSoLan"
          label="Chọn lần số"
          dense
        />
      </div>
    </div>
    <div class="row">
      <q-btn
        class="col-12  text-center text-bold "
      style="margin-bottom:5px; font-style: oblique; font-size:12px;background-color: #daf8e1"
      outlined
        label="Danh mục vật tư sơn cấp theo định mức"
      />
      <q-card v-for="(row, index) in rows" :key="index" style="margin-bottom:10px" class="my-card">
      <q-card-section v-if="index%2 == 0" class="row bg-green-1">
        <div class="col-8 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  <span class="title">Mã VT:</span>
                  <span class="text-primary">{{row.MA_VT}}</span>
                </q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.MA_VT" label-color="orange" label="Mã VT" readonly /> -->
        </div>
        <div class="col-4 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  <span class="title">ĐVT:</span>
                   <span class="text-primary">{{row.dvt}}</span>
                  
                </q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dvt" label="ĐVT" label-color="orange" readonly /> -->
        </div>
        <div class="col-12 p-5">
          <q-item-label
            caption
            lines="4"
            class="text-orange border-bt"
            style="font-size: 11px; padding-top: 0px; font-weight: bold"
          >
            <span class="title">Tên VT:</span>
            <div>
              <div class="text-primary" style="padding:2px;margin:2px">{{ row.ten_vt }}</div> 
            </div>
          </q-item-label>
           <!-- <q-input dense type="textarea" :input-style="{resize: 'none', maxHeight: '50px'}"  label-color="orange" v-model="row.ten_vt" label="Tên VT" readonly /> -->
        </div>
        
        <div class="col-6 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  <span class="title"> SL theo định mức:</span> <br>
                  <q-badge class="bg-blue" :label="row.SLSX"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.SLSX" label="SL theo định mức" label-color="orange" readonly /> -->
        </div>
        
        <div class="col-3 p-5">
          <q-item-section class="text-positive border-bt">
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                 <span class="title">SL đã cấp:</span> <br>
                  <q-badge class="bg-blue text-orange" :label="row.SLDC"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dacap" label="SL đã cấp" label-color="orange" readonly /> -->
        </div>
        <div class="col-3 p-5">
          <q-item-section class="text-positive border-bt">
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  <span class="title">SL còn lại:</span> <br>
                  <q-badge class="bg-positive text-white" :label="(row.SLSX - row.SLDC).toLocaleString(
                      'en-US'
                    )"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dacap" label="SL đã cấp" label-color="orange" readonly /> -->
        </div>
        <div class="col-12">
          <q-input
            v-model.number="row.SLYC"
            filled
            stack-label
            class="bg-blue-grey-11"
            label-color="primary"
            type="number"
            style="font-style: oblique"
            label="SL y/c cấp"
            readonly
            dense
          />
        </div>
        <div class="col-12" style="padding-top:5px">
          <q-input
          v-if="isPass == '1'"
            v-model="row.DESCRIPTION"
            filled
            stack-label
            class="bg-blue-grey-11"
            label-color="primary"
            style="font-style: oblique"
            readonly
            label="Lý do"
            dense
          />
        </div>
      </q-card-section>
      <q-card-section v-else class="row bg-blue-grey-1">
        <div class="col-8 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  <span class="title">Mã VT:</span> 
                  <span class="text-primary">{{row.MA_VT}}</span>
                </q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.MA_VT" label-color="orange" label="Mã VT" readonly /> -->
        </div>
        <div class="col-4 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  <span class="title">ĐVT:</span>
                   <span class="text-primary">{{row.dvt}}</span>
                  
                </q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dvt" label="ĐVT" label-color="orange" readonly /> -->
        </div>
        <div class="col-12 p-5">
          <q-item-label
            caption
            lines="4"
            class="text-orange border-bt"
            style="font-size: 11px; padding-top: 0px; font-weight: bold"
          >
            <span class="title">Tên VT:</span>
            <div>
              <div class="text-primary" style="padding:2px;margin:2px">{{ row.ten_vt }}</div> 
            </div>
          </q-item-label>
           <!-- <q-input dense type="textarea" :input-style="{resize: 'none', maxHeight: '50px'}"  label-color="orange" v-model="row.ten_vt" label="Tên VT" readonly /> -->
        </div>
        
        <div class="col-6 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  <span class="title">SL theo định mức:</span> <br>
                  <q-badge class="bg-blue" :label="row.SLSX"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.SLSX" label="SL theo định mức" label-color="orange" readonly /> -->
        </div>
        
        <div class="col-3 p-5">
          <q-item-section class="text-positive border-bt">
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  <span class="title">SL đã cấp:</span> <br>
                  <q-badge class="bg-blue text-orange" :label="row.SLDC"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dacap" label="SL đã cấp" label-color="orange" readonly /> -->
        </div>
        <div class="col-3 p-5">
          <q-item-section class="text-positive border-bt">
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  <span class="title">SL còn lại:</span> <br>
                  <q-badge class="bg-positive text-white" :label="(row.SLSX - row.SLDC).toLocaleString(
                      'en-US'
                    )"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dacap" label="SL đã cấp" label-color="orange" readonly /> -->
        </div>
        <div class="col-12">
          <q-input
            v-model.number="row.SLYC"
            filled
            stack-label
            class="bg-blue-grey-11"
            label-color="primary"
            type="number"
            style="font-style: oblique"
            label="SL y/c cấp"
            readonly
            dense
          />
        </div>
        <div class="col-12" style="padding-top:5px">
          <q-input
          v-if="isPass == '1'"
            v-model="row.DESCRIPTION"
            filled
            stack-label
            class="bg-blue-grey-11"
            label-color="primary"
            style="font-style: oblique"
            label="Lý do"
            readonly
            dense
          />
        </div>
      </q-card-section>
    </q-card>
    </div>
    <div v-if="soLan" class="row">
      <q-card class="my-card text-orange col-12 bg-blue-grey-11">
        <q-card-section>
          <div class="text-subtitle2 text-blue">Người yêu cầu : <q-badge class="bg-blue-grey-6">{{ createName }}</q-badge></div>
          <div class="text-subtitle2 text-blue">
            Ngày yêu cầu : 
            <q-badge class="bg-blue-grey-6">{{ createDate.substring(0, 16).replace("T", " ") }}</q-badge>
          </div>
          <div v-if="gdsxName">
          <div class="text-subtitle2 text-blue">GĐSX xác nhận: <q-badge class="bg-blue-grey-6">{{ gdsxName }}</q-badge></div>
          <div class="text-subtitle2 text-blue">
            Ngày xác nhận:
            <q-badge class="bg-blue-grey-6">{{ gdsxDate.substring(0, 16).replace("T", " ") }}</q-badge>
          </div>
        </div>
        <div v-if="vattuName">
          <div class="text-subtitle2 text-blue">Vật tư xác nhận: <q-badge class="bg-blue-grey-6">{{ vattuName }}</q-badge></div>
          <div class="text-subtitle2">
            <span class="text-blue">Ngày xác nhận:</span> 
            <q-badge class="bg-blue-grey-6">{{ vattuDate.substring(0, 16).replace("T", " ") }}</q-badge>
          </div>
        </div>
        <div v-if="thukhoName">
          <div class="text-subtitle2 text-blue">Thủ kho xác nhận: <q-badge class="bg-blue-grey-6">{{ thukhoName }}</q-badge></div>
          <div class="text-subtitle2">
            <span class="text-blue">Ngày xác nhận:</span> 
            <q-badge class="bg-blue-grey-6">{{ thukhoDate.substring(0, 16).replace("T", " ") }}</q-badge>
          </div>
        </div>
        </q-card-section>

        
        <q-separator dark inset />

        <q-card-section v-if="!isPass">
          <div class="row">
            <div class="col-12" align="center">
              <q-btn
                v-if="!thukhoName && isTKVerify"
                color="orange"
                @click="onVerify"
                label="Thủ kho xác nhận"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section v-else>
          <div class="row">
            <div class="col-12" align="center">
              <q-btn
                v-if="!gdsxName && isSXVerify"
                color="orange"
                @click="onVerifyGDSX"
                label="GĐSX xác nhận"
              />
            </div>
            <div class="col-12" align="center">
              <q-btn
                v-if="!vattuName && isVTVerify"
                color="orange"
                @click="onVerifyVT"
                label="Vật tư xác nhận"
              />
            </div>
          </div>

          <div v-if="gdsxName && vattuName && !thukhoName && isTKVerify" class="row">
            <div class="col-12" align="center">
              <q-btn
                color="orange"
                @click="onVerify"
                label="Thủ kho xác nhận"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { showNotifySuccess, showNotifyError } from "../../ultils";
import AppBar from "../../components/AppBar";
import moment from "moment";
export default {
  components: {
    "app-bar": AppBar,
  },
  data() {
    return {
      year: 0,
      week: 0,
      factory: null,
      arrFactory: [],
      lsx: null,
      isSXVerify: false,
      isTKVerify: false,
      isVTVerify: false,
      arrLSX: [],
      soLan: null,
      filter: null,
      arrSoLan: [],
      isPass: false,
      gdsxName: null,
      gdsxDate: null,
      thukhoName: null,
      thukhoDate: null,
      vattuName: null,
      vattuDate: null,
      createName: null,
      createDate: null,
      rows: [],
    };
  },
  created() {
    this.loadPermission();
    const date = moment();
    this.year = date.year();
    this.week = date.week();
    const factory = this.userInfo.role.types[0].value.filter(
      (u) => u.type2 == "nhaMay" && u.parentId == 102299
    );
    factory.forEach((element) => {
      this.arrFactory.push({
        label: element.name,
        value: element.factory,
      });
    });
    console.log("position", this.userInfo.position);
    this.factory = this.arrFactory[0];
    this.loadLSX();
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("production", [
      "getLSXVatTuByFactory",
      "getSoLanCapVTByLSX",
      "getPhieuCapVatTu",
      "updatePhieuYeuCauVT",
      "updatePhieuYeuCauVTVatTu",
      "updatePhieuYeuCauVTGDSX",
      "getPermissionInScreen"
    ]),
    async loadPermission() {
      console.log("path", this.$route.path);
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.getPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((el) => {
        if (el.CODE == "SXVerify") {
          this.isSXVerify = true;
        }
        if (el.CODE == "TKVerify") {
          this.isTKVerify = true;
        }
        if (el.CODE == "VTVerify") {
          this.isVTVerify = true;
        }
      });
      console.log("listPermission", this.listPermission);
    },
    async onChangeFactory() {
      this.loadLSX();
    },
    onChangeYear() {
      this.loadLSX();
    },
    onChangeWeek() {
      this.loadLSX();
    },
    async loadLSX() {
      const payload = {
        factoryId: this.factory.value,
        year: this.year,
        week: this.week,
      };
      const data = await this.getLSXVatTuByFactory(payload);
      this.arrLSX = data.data;
      this.lsx = null;
      this.soLan = null;
      this.rows = [];
      this.createName = null;
      this.verifyName = null;
    },
    async onChangeLSX() {
      const payload = {
        number: this.lsx.value,
      };
      const data = await this.getSoLanCapVTByLSX(payload);
      this.arrSoLan = data.data;
    },
    async onChangeSoLan() {
      this.loadData();
    },
    async loadData() {
      const payload = {
        soLan: this.soLan.value,
        number: this.lsx.value,
      };
      const data = await this.getPhieuCapVatTu(payload);
      this.rows = data.data;
      this.createName = this.rows[0].createName;
      this.createDate = this.rows[0].CREATED_DATE;
      this.gdsxName = this.rows[0].GDSX_NAME;
      this.gdsxDate = this.rows[0].GDSX_DATE;
      this.thukhoName = this.rows[0].TK_NAME;
      this.thukhoDate = this.rows[0].TK_DATE;
      this.vattuName = this.rows[0].VT_NAME;
      this.vattuDate = this.rows[0].VT_DATE;
      this.isPass = this.rows[0].isPass;
      console.log("isPass", this.isPass);
    },
    async onVerifyGDSX() {
      if (this.isSXVerify) {
        const payload = {
          soLan: this.soLan.value,
          number: this.lsx.value,
          accountId: this.userInfo.id,
        };
        const data = await this.updatePhieuYeuCauVTGDSX(payload);
        if (data.meta.success) {
          showNotifySuccess("Tạo thành công !");
          this.loadData();
        } else {
          showNotifyError();
        }
      } else {
        this.$q.dialog({
          title: "Lỗi",
          message: "Bạn không có quyền duyệt!",
        });
      }
    },
    async onVerifyVT(){
      if (this.isVTVerify) {
        const payload = {
          soLan: this.soLan.value,
          number: this.lsx.value,
          accountId: this.userInfo.id,
        };
        const data = await this.updatePhieuYeuCauVTVatTu(payload);
        if (data.meta.success) {
          showNotifySuccess("Tạo thành công !");
          this.loadData();
        } else {
          showNotifyError();
        }
      } else {
        this.$q.dialog({
          title: "Lỗi",
          message: "Bạn không có quyền duyệt!",
        });
      }
    },
    async onVerify() {
      const payload = {
        soLan: this.soLan.value,
        number: this.lsx.value,
        accountId: this.userInfo.id,
      };
      const data = await this.updatePhieuYeuCauVT(payload);
      if (data.meta.success) {
        showNotifySuccess("Tạo thành công !");
        this.loadData();
      } else {
        showNotifyError();
      }
      console.log("data", data);
    },
  },
};
</script>

<style>
.q-table--dense .q-table th {
  font-size: 8px;
}
.q-table--cell-separator thead th {
  background-color: #78909c !important;
  color: orange;
  font-family: "Times New Roman", Times, serif;
}
.q-table__top {
  padding: 0px;
}
.btn-font {
  margin: 5px;
  font-family: "Times New Roman", Times, serif;
  font-weight: bold;
}
.title{
  font-style: italic;
}
</style>