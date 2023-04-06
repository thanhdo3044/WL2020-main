<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-banner class="bg-blue-grey text-orange">
      <div class="row">
        <div class="col-6 top-title text-orange">
            Báo cáo nhập tồn đầu kỳ chi tiết -
            {{ factory ? factory.label : "" }}
          </div>
          <div
            class="col-6 top-title text-orange"
            align="right"
            @click="showChooseDate = true"
          >
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
          </div>   
      </div>
    </q-banner>
      <q-card-section>
       <div class="text-positive row bg-blue-grey-2" style="padding: 15px 0 15px 0;">
          <div
            class="col-2 col-md-2"
            v-for="(congDoan, index) in options"
            :key="index"
          >
            <q-radio
              dense
              @input="loadDepartment"
              v-model="factory"
              :val="congDoan"
              :label="congDoan.label"
              style="border-radius: 5px;"
              class="text-weight-bold"
              :class="{active : factory == congDoan}"
              color="orange"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <!-- <q-select class="col-6 q-mb-sm" @input="load" outlined v-model="idDepartment" :options="options" label="Chọn nhà máy" /> -->
        <!-- <div class="row">
          <div class="col-2 col-md-2">
            <q-checkbox
              v-if="factory"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #21ba45; font-weight: bold; padding-top: 10px"
              v-model="allDepartment"
              label="Chọn tất cả công đoạn"
            />
          </div>
        </div> -->
        <div class="row" v-if="factory">
          <div class="col-2 col-md-2">
            <q-checkbox
              v-if="factory.id == 100000"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #f6b024; font-weight: bold"
              v-model="allDepartmentTH"
              label="Chọn tất cả công đoạn"
            />
            <q-checkbox
              v-if="factory.id == 102427"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #f6b024; font-weight: bold"
              v-model="allDepartmentYS"
              label="Chọn tất cả công đoạn"
            />
            <q-checkbox
              v-if="factory.id == 102340"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #f6b024; font-weight: bold"
              v-model="allDepartmentYS1B"
              label="Chọn tất cả công đoạn"
            />
            <q-checkbox
              v-if="factory.id == 102366"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #f6b024; font-weight: bold"
              v-model="allDepartmentTB"
              label="Chọn tất cả công đoạn"
            />
          </div>
        </div>
        <hr v-if="factory" />
        <div class="row">
          <div
            class="col-2 col-md-2"
            v-for="(congDoan, index) in departments"
            :key="index"
          >
            <q-checkbox
              v-if="
                congDoan.value != 102484 &&
                congDoan.id != 102490 &&
                congDoan.factoryId == 100000
              "
              dense
              v-model="chonCongDoansTH"
              :val="congDoan.name"
              :label="congDoan.name"
              color="teal"
            />
            <q-checkbox
              v-if="
                congDoan.value != 102484 &&
                congDoan.id != 102490 &&
                congDoan.factoryId == 102427
              "
              dense
              v-model="chonCongDoansYS"
              :val="congDoan.name"
              :label="congDoan.name"
              color="teal"
            />
            <q-checkbox
              v-if="
                congDoan.value != 102484 &&
                congDoan.id != 102490 &&
                congDoan.factoryId == 102340
              "
              dense
              v-model="chonCongDoansYS1B"
              :val="congDoan.name"
              :label="congDoan.name"
              color="teal"
            />
            <q-checkbox
              v-if="
                congDoan.value != 102484 &&
                congDoan.id != 102490 &&
                congDoan.factoryId == 102366
              "
              dense
              v-model="chonCongDoansTB"
              :val="congDoan.name"
              :label="congDoan.name"
              color="teal"
            />
          </div>
        </div>

        <!-- <div class="row">
          <div
            class="col-2 col-md-2"
            v-for="congDoan in departments"
            :key="congDoan.id"
          >
            <q-checkbox
              v-if="congDoan.id != 102484 && congDoan.id != 102490"
              dense
              v-model="chonCongDoans"
              :val="congDoan.name"
              :label="congDoan.name"
              color="teal"
            />
          </div>
        </div> -->
        <hr v-if="factory" />
        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
              :data-source="dataSourcefilter"
              :columns="columns"
              :show-borders="true"
              :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
              :show-column-lines="true"
              :allow-column-resizing="true"
              @row-updated="confirmSaveStock"
              @row-removed="del"
            >
              <DxEditing
                :refresh-mode="refreshMode"
                :allow-adding="false"
                :allow-updating="isUpdate"
                :allow-deleting="isDelete"
                mode="row"
              />
              <DxColumnChooser :enabled="true" />
              <DxHeaderFilter :visible="true" />
              <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              />
              <DxGrouping :auto-expand-all="true" />
              <DxSummary>
                <DxGroupItem
                  column="Số lượng"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'fixedpoint'"
                />
              </DxSummary>
              <DxExport
                :enabled="true"
                :allow-export-selected-data="false"
                :file-name="
                  'Dữ liệu sản xuất chi tiết từ ngày ' +
                  tuNgay +
                  ' đến ngày ' +
                  denNgay
                "
              />
              <DxSearchPanel
                :visible="true"
                :placeholder="'Tìm kiếm'"
                :width="400"
              />
            </DxDataGrid>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
  </q-page>
</template>

<script>
import { QSpinnerFacebook } from "quasar";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxExport,
  DxSummary,
  DxGroupItem,
  DxHeaderFilter,
  DxColumnChooser,
  DxEditing,
} from "devextreme-vue/data-grid";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxExport,
    DialogSelectDate,
    DxSummary,
    DxGroupItem,
    DxHeaderFilter,
    DxColumnChooser,
    DxEditing,
  },
  data() {
    return {
      showChooseDate: false,
      factory: {
        id: 100000,
        label: "Nhà máy CBG Thuận Hưng",
      },
      factory1: null,
      options: [
        {
          id: 100000,
          label: "Nhà máy CBG Thuận Hưng",
        },
        {
          id: 102340,
          label: "Nhà máy CBG Yên Sơn 1",
        },
        {
          id: 102366,
          label: "Nhà máy CBG Thái Bình",
        },
        // {
        //   id: 102427,
        //   label: "Nhà máy CBG Quang Minh",
        // },
      ],
      idDepartment: null,
      chonCongDoans: [],
      departments: [],
      allDepartmentTH: false,
      allDepartmentYS: false,
      allDepartmentYS1B: false,
      allDepartmentTB: false,
      chonCongDoansTH: [],
      chonCongDoansYS: [],
      chonCongDoansYS1B: [],
      chonCongDoansTB: [],
      dataSource: [],
      refreshMode: "full",

      columns: [
        ,
        // {
        //   dataField: "Năm",
        //    width:'80',
        // },
        {
          dataField: "Tuần",
          width: "100",
        },

        {
          dataField: "Thứ",

          width: "80",
        },
        {
          dataField: "ITEM_ID",
          caption: "ITEM_ID",
          width: "80",
        },
        {
          dataField: "Nhóm",
          visible: false,
        },
        {
          dataField: "Chi tiết/cụm",
          width: "350",
        },
        ,
        {
          dataField: "LENGTH",
          caption: "DÀI",
          width: "80",
        },

        {
          dataField: "WIDTH",
          caption: "Rộng",
          width: "80",
        },
        {
          dataField: "HEIGHT",
          caption: "DÀY",
          width: "80",
        },
        {
          dataField: "unit",
          caption: "Đơn vị",
          width: "80",
        },
        {
          dataField: "Nơi xuất",
          visible: false,
        },
        {
          dataField: "Đạt",
          visible: false,
          dataType: "number",
          format: "##0.##",
        },
        {
          dataField: "Không đạt",
          visible: false,
          dataType: "number",
          format: "fixedpoint",
        },
        {
          dataField: "Số lượng",
          dataType: "number",
          format: "#,##0.##",
          width: "100",
        },
        {
          dataField: "LOAIQC",
          caption: "Loại QC",
          width: "130",
        },
        {
          dataField: "Nguồn Phôi",
          width: "160",
        },
        {
          dataField: "Người nhập",
          width: "160",
        },

        {
          dataField: "Ngày giờ nhập",
          format: "dd/MM/yyyy HH:mm:ssZ",
          dataType: "date",
          width: "200",
        },
      ],
      fromDate: null,
      toDate: null,
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      isApprove: false,
      isReject: false,
    };
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
    ...mapGetters("prod", ["factories"]),
    ...mapGetters("base", ["congDoans", "myFactoryInfor", "userInfo"]),
    dataSourcefilter() {
      if (this.factory) {
        if (this.factory.id == 100000)
          return this.dataSource.filter((i) =>
            this.chonCongDoansTH.includes(i.tonhom)
          );
        if (this.factory.id == 102427)
          return this.dataSource.filter((i) =>
            this.chonCongDoansYS.includes(i.tonhom)
          );
        if (this.factory.id == 102340)
          return this.dataSource.filter((i) =>
            this.chonCongDoansYS1B.includes(i.tonhom)
          );
        if (this.factory.id == 102366)
          return this.dataSource.filter((i) =>
            this.chonCongDoansTB.includes(i.tonhom)
          );
      }
    },
  },
  created() {
    this.loadPermission();
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load();
    this.loadDepartment();
  },
  methods: {
    ...mapActions("production", ["UPDATE_STOCK", "DEL_STOCK"]),
    ...mapActions("prod", [
      "getPermissionInScreen",
      "getDepartmentByFactoryId",
      "getSLTheoThangSL",
      "getSLTheoThangM3",
    ]),

    async selectAll() {
      console.log("this.factory", this.factory);
      if (this.allDepartmentYS) {
        this.departments.forEach((el) => {
          if (this.factory.id == 102427) this.chonCongDoansYS.push(el.name);
        });
      } else this.chonCongDoansYS = [];
      if (this.allDepartmentYS1B) {
        this.departments.forEach((el) => {
          if (this.factory.id == 102340) this.chonCongDoansYS1B.push(el.name);
        });
      } else this.chonCongDoansYS1B = [];
      if (this.allDepartmentTB) {
        this.departments.forEach((el) => {
          if (this.factory.id == 102366) this.chonCongDoansTB.push(el.name);
        });
      } else this.chonCongDoansTB = [];
      if (this.allDepartmentTH) {
        this.departments.forEach((el) => {
          if (this.factory.id == 100000) this.chonCongDoansTH.push(el.name);
        });
      } else {
        this.chonCongDoansTH = [];
      }

      // if (this.allDepartment) {
      //   this.chonCongDoans = [];

      //   this.departments.forEach((el) => {
      //     this.chonCongDoans.push(el.name);
      //   });
      // } else {
      //   this.chonCongDoans = [];
      // }
    },

    async loadDepartment() {
      await this.load();
      let data = await this.getDepartmentByFactoryId({
        factoryId: this.factory.id,
      });
      // this.departments = data.data;
      this.departments = data.data.filter((d) => this.checkDepartment(d.name));
      console.log(this.departments);
      console.log(this.dataSource);
      this.allDepartment = false;
      this.chonCongDoans = [];
    },
    checkDepartment(name) {
      let data = null;
      data = this.dataSource.find((s) => s.tonhom == name);
      if (data) {
        return true;
      } else {
        return false;
      }
    },

    async loadPermission() {
      console.log("path", this.$route.path);
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.getPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((el) => {
        if (el.CODE == "approve") {
          this.isApprove = true;
        }
        if (el.CODE == "reject") {
          this.isReject = true;
        }
        if (el.CODE == "insert") {
          this.isInsert = true;
        }
        if (el.CODE == "update") {
          this.isUpdate = true;
        }
        if (el.CODE == "delete") {
          this.isDelete = true;
        }
      });
      console.log("listPermission", this.listPermission);
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async confirmSaveStock(e) {
      let a = "Số lượng";
      let b = "Ngày giờ nhập";
      let quantity = e.data[a];
      let ngay = e.data[b];
      const payload = { quantity, ngay, ID: e.data.ID };
      console.log(payload);
      const data = await this.UPDATE_STOCK(payload);
      if (data) {
        this.$q.dialog({
          title: "Thành công ",
          message: "Sửa thành công !",
        });
        this.load();
      } else {
        this.$q.dialog({
          title: "Lỗi",
          message: "Có lỗi xảy ra !",
        });
      }
    },
    async del(e) {
      const payload = { ID: e.data.ID };
      const data = await this.DEL_STOCK(payload);
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadDepartment();
      this.load();
    },
    async onChange(value) {
      this.factory = value.id;
      this.load();
      console.log("nha máy:", this.factory);
    },
    async load() {
      // const myFactoryId = this.myFactoryInfor.id;
      // if (myFactoryId) {
      //   let payload = {
      //     fromDate: formatDateISO(this.fromDate),
      //     toDate: formatDateISO(this.toDate),
      //     factoryId: myFactoryId,
      //   };
      //   const data = await this.$store.dispatch(
      //     "prod/GET_REPORT_TON_DETAIL",
      //     payload
      //   );
      //   this.dataSource = data.data;
      // }

      let payload = {
        fromDate: formatDateISO(this.fromDate),
        toDate: formatDateISO(this.toDate),
        departmentId: this.factory.id,
      };
      this.$q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: "yellow",
        spinnerSize: 140,
        backgroundColor: "purple",
        message: "Đang tải dữ liệu - Vui lòng chờ trong giây lát !",
        messageColor: "black",
      });
      let data = await this.$store.dispatch(
        "prod/GET_REPORT_TON_DETAIL",
        payload
      );
      data.data.map((e) => {
        if (e.DEPARTMENT_ID == 102484) e.unit = "M3";
      });
      this.dataSource = data.data;
      console.log("data soure", this.dataSource);
      this.$q.loading.hide();
    },
  },
};
</script>

<style>
.active{
  color: #f6b024;
}
</style>