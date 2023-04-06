<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-blue-grey">
        <div class="row">
          <div class="col-6 top-title text-orange">
            Báo cáo trạng thái nhận phôi- {{ factory ? factory.label : "" }}
          </div>

          <div
            class="col-6 top-title cursor-pointer text-orange"
            align="right"
            @click="showChooseDate = true"
          >
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
          </div>
        </div>
      </q-card-section>
      <q-separator inset />
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
              v-if="factory.id == 102339"
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
                congDoan.factoryId == 102339
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
        <hr v-if="factory" />

        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
              :data-source="dataSourcefilter"
              :show-borders="true"
              :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
              :show-column-lines="true"
              :allow-column-resizing="true"
            >
              <DxColumnChooser :enabled="true" />
              <DxHeaderFilter :visible="true" />
              <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              />
              <DxGrouping :auto-expand-all="true" />
              <!-- <DxColumn data-field="ID" caption="#" /> -->
               <DxColumn
                data-field="departmentName"
                caption="Công đoạn giao"
              />
            <!-- <DxColumn
                data-field="sanPham"
                caption="Sản phẩm"
                :group-index="1"
              />  -->
              <DxColumn data-field="itemName" caption="Chi tiết" width="380" />
              <DxColumn caption="Qui Cách" alignment="center">
                <DxColumn
                  caption="Dầy"
                  data-field="height"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  caption="Rộng"
                  data-field="width"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  caption="Dài"
                  data-field="length"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
              </DxColumn>
              <DxColumn
                data-field="QUANTITY"
                caption="Số lượng"
                data-type="number"
                format="#,##0.00"
                width="160"
              />
              <DxColumn
                data-field="createDate"
                caption="ngày giao"
                width="260"
              />
               <DxColumn
                data-field="number"
                caption="LSX"
                width="100"
              />
              <DxColumn
                data-field="congdoannhan"
                caption="Công đoạn nhận"
                width="180"
              />
              <DxColumn
                data-field="VERIFY_BY"
                caption="xác nhận"
                width="160"
                cell-template="cellTemplate"
              />
              <DxSummary>
                <DxGroupItem
                  column="QUANTITY"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'fixedpoint'"
                />
              </DxSummary>
              <!-- <DxSummary>
                <DxGroupItem
                  column="tongKL"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'fixedpoint'"
                />
              </DxSummary> -->
              <template #cellTemplate="cell">
                <div v-if="cell.data.value == null">Chưa nhận</div>
                <div v-else>đã nhận</div>
              </template>
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
import { mapGetters, mapActions } from "vuex";
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
} from "devextreme-vue/data-grid";
import DialogSelectDate from "../components/commons/DialogSelectFromDateToDate";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../ultils";
import moment from "moment";
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
  },
  data() {
    return {
      dataSource: [],
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
      showChooseDate: false,
      fromDate: null,
      toDate: null,
      factory: null,
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          id: 100000,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          id: 102340,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          id: 102366,
        },
        {
          label: "Nhà máy CBG Quang Minh",
          id: 102427,
        },
      ],
    };
  },

  created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
  },
  methods: {
    ...mapActions("sanxuat", ["getAllSanLuongchonhan"]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },

    ...mapActions("prod", [
      "getDepartmentByFactoryId",
      "getSLTheoThangSL",
      "getSLTheoThangM3",
    ]),
    async selectAll() {
      if (this.allDepartmentYS) {
        this.departments.forEach((el) => {
          if (this.factory.id == 102339) this.chonCongDoansYS.push(el.name);
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
      console.log("this.chonCongDoansTH", this.chonCongDoansTH);
    },

    async loadDepartment(value) {
      let data = await this.getDepartmentByFactoryId({
        factoryId: this.factory.id,
      });
      data = data.data.filter((d) => d.type == "Tổ" ||  d.type2 == 'kho');
      // this.departments = data;
      console.log("mota", this.departments);
      this.allDepartment = false;
      this.chonCongDoans = [];
      await this.load(value.id);
      this.departments = data.filter((d) => this.checkDepartment(d.name));
    },

    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.load(this.factory.id);
      await this.loadDepartment(this.factory);
      console.log("mota", this.chooseDate);
    },
    checkDepartment(name) {
      let data = null;
      data = this.sanLuongs.find((s) => s.departmentName == name);
      if (data) {
        return true;
      } else {
        return false;
      }
    },
    async load(departmentId) {
      let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 07:00:00"),
        toDate: moment(this.toDate).add(1, "day").format("YYYY-MM-DD 06:59:59"),
        departmentId,
      };

      const data = await this.getAllSanLuongchonhan(payload);
      //  data.data.map((el) =>
      //   el.VERIFY_BY ? (el.VERIFY_BY = "Đã nhận") : (el.VERIFY_BY = "Chưa nhận")
      // );
    },
  },
  computed: {
    ...mapGetters("sanxuat", ["sanLuongs"]),
    ...mapGetters("base", ["congDoans", "myFactoryInfor"]),
    ...mapGetters("prod", ["factories"]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
    dataSourcefilter() {
      console.log("this.sanLuongs", this.sanLuongs);
      if (this.factory) {
        if (this.factory.id == 100000)
          return this.sanLuongs.filter((i) =>
            this.chonCongDoansTH.includes(i.departmentName)
          );
        if (this.factory.id == 102339)
          return this.sanLuongs.filter((i) =>
            this.chonCongDoansYS.includes(i.departmentName)
          );
        if (this.factory.id == 102340)
          return this.sanLuongs.filter((i) =>
            this.chonCongDoansYS1B.includes(i.departmentName)
          );
        if (this.factory.id == 102366)
          return this.sanLuongs.filter((i) =>
            this.chonCongDoansTB.includes(i.departmentName)
          );
      }
    },
  },
};
</script>

<style>
.active{
  color: #f6b024;
}
</style>