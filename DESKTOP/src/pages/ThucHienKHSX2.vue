<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo LSX đang thực hiện -
          <span class="text-amber-14">{{
            idDepartment ? idDepartment.label : ""
          }}</span>
        </div>
        <div class="col-6 text-blue text-bold" align="right">
          <!-- <span style="font-size: 18px">Từ tuần: </span>
          <input
            class="text-amber-14"
            type="number"
            v-model="fromWeek"
            @input="onChangeFromWeek"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 50px;
            "
          />
          <span
            class="text-blue text-bold"
            style="font-size: 18px; padding-right: 10px"
            >-</span
          >
          <span style="font-size: 18px">Đến tuần: </span>
          <input
            class="text-amber-14"
            type="number"
            v-model="toWeek"
            @input="onChangeToWeek"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 50px;
            "
          /> -->
          <!-- <span
            class="text-blue text-bold"
            style="font-size: 18px; padding-right: 10px"
            >-</span
          >
          <span style="font-size: 18px">Năm: </span>
          <input
            class="text-amber-14"
            type="number"
            v-model="year"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 70px;
            "
          /> -->
        </div>
      </div>
    </div>

    <q-card>
      <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
        <div class="col-8">
          <div class="row">
            <div
              class="col-2 col-md-2"
              v-for="(congDoan, index) in options"
              :key="index"
            >
              <q-radio
                dense
                @input="loadDepartment"
                v-model="idDepartment"
                :val="congDoan"
                :label="congDoan.label"
                style="border-radius: 5px"
                class="text-weight-bold"
                color="orange"
              />
            </div>
          </div>
        </div>
        <div class="col-4" align="right">
          <q-checkbox
            v-model="isExcel"
            @input="xuattieude"
            color="amber-6"
            class="text-weight-bold"
            label="Xuất Excel"
            dense
          />
        </div>
      </div>
      <div>
        <div class="row" style="font-size: 12px; vertical-align: top"  v-if="idDepartment">
          <div class="col-12">
            <table style="border: 1px solid black; width: 100%">
              <tr>
                <td scope="col" style="border-right: 1px solid black">
                  <div class="row">
                    <q-checkbox

                      @input="selectAll()"
                      class="col-2 text-bold text-orange"
                      v-model="allNumber"
                      label="Chọn tất"
                      color="orange"
                    />
                  </div>
                </td>
                <div class="row">
                    <q-checkbox
                    v-for="(num, index) in LSXTP5"

                    :key="index"
                    class="col-1"
                    v-model="selection"
                    :val="num"
                    :label="num"
                    style="font-weight: bold"
                    color="amber-6"
                  />
                  <q-checkbox
                    v-for="(num, index) in LSXTP"

                    :key="index"
                    class="col-1"
                    v-model="selection"
                    :val="num"
                    :label="num"
                    style="font-weight: bold;color:orange"
                    color="amber-6"
                  />
                </div>
                 <!-- <div class="row"> &nbsp </div> -->
                <div class="row">
                  <q-checkbox
                    v-for="(num, index) in LSXBTP5"
                    :key="index"
                    class="col-1"
                    v-model="selection"
                    :val="num"
                    :label="num"
                    style="font-weight: bold"
                    color="amber-6"
                  />
                    <q-checkbox
                    v-for="(num, index) in LSXBTP"
                    :key="index"
                    class="col-1"
                    v-model="selection"
                    :val="num"
                    :label="num"
                    style="font-weight: bold;color:orange"
                    color="amber-6"
                  />
                </div>
              </tr>
            </table>
          </div>
        </div>
        <div class="col-12">
          <DxDataGrid
            id="gridContainer"
            :data-source="dataSourcefilter"
            :show-borders="true"
            :show-row-lines="true"
            :word-wrap-enabled="true"
            :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
            :show-column-lines="true"
            :allow-column-resizing="true"
          >
            <!-- <DxColumnChooser :enabled="true" />-->
            <DxGroupPanel
              :visible="isExcel"
              :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
            />
            <DxFilterRow :visible="true" />
            <!-- <DxFilterPanel :visible="true" /> -->
            <DxHeaderFilter :visible="true" />
            <DxScrolling mode="virtual" />
            <DxSorting mode="none" />
            <DxGrouping :auto-expand-all="true" />
            <DxColumn data-field="itemId" caption="ID" :width="80" />
            <DxColumn data-field="itemName" caption="Tên" :width="500" />

            <!-- <DxColumn data-field="week" caption="Tuần" :group-index="0" /> -->
            <DxColumn
              data-field="number"
              caption="Lệnh sản xuất"
              :group-index="1"
            />
            <DxColumn
              data-field="departmentName"
              caption="Công đoạn"
              :group-index="2"
              sort-order="asc"
            />
            <DxColumn
              data-field="sanpham"
              caption="sản phẩm"
              :group-index="3"
              sort-order="asc"
            />

            <DxColumn caption="Qui cách" alignment="center">
              <DxColumn
                caption="Dày"
                data-field="HEIGHT"
                format="fixedPoint"
                alignment="center"
                width="90"
              />
              <DxColumn
                caption="Rộng"
                data-field="WIDTH"
                format="fixedPoint"
                alignment="center"
                width="90"
              />
              <DxColumn
                caption="Dài"
                data-field="LENGTH"
                format="fixedPoint"
                alignment="center"
                width="90"
              />
            </DxColumn>
            <DxColumn
              data-field="keHoach"
              caption="Số lượng cần thực hiện"
              data-type="number"
              :width="120"
              alignment="center"
              format="#,##0.##"
            />
            <DxColumn
              data-field="soLuongDat"
              caption="Số lượng đã thực hiện"
              data-type="number"
              width="120"
              alignment="center"
              format="#,##0.##"
            />
            <DxColumn
              data-field="m3Dat"
              caption="M³ đã thực hiện"
              data-type="number"
              format="#,##0.##"
              width="120"
              alignment="center"
            />
            <DxColumn
              data-field="soLuongConTH"
              caption="Số lượng còn phải thực hiện"
              data-type="number"
              width="120"
              alignment="center"
              format="#,##0.##"
              css-class="mauTHKHSX2"
              :calculate-cell-value="calculateConTH"
            />
            <DxColumn
              data-field="m3ConTH"
              caption="M³ còn phải thực hiện"
              data-type="number"
              width="120"
              alignment="center"
              format="#,##0.##"
              css-class="mauTHKHSX2"
              :calculate-cell-value="calculateM3ConTH"
            />
            <DxColumn
              data-field="tiLeDatKH"
              caption="Tỉ lệ thực hiện"
              :customize-text="tiLe"
              width="120"
              alignment="center"
            />
            <DxExport
              :enabled="isExcel"
              :allow-export-selected-data="false"
              :file-name="tieude"
            />
            <DxSearchPanel
              :visible="isExcel"
              :placeholder="'Tìm kiếm'"
              :width="400"
            />
          </DxDataGrid>
        </div>
      </div>
    </q-card>
    <q-btn fab glossy icon="keyboard_arrow_up" color="primary" />
  </q-page>
</template>

<script>
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";
import { QSpinnerFacebook } from "quasar";
import { Notify, Loading, QSpinnerIos } from "quasar";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxSearchPanel,
  DxExport,
  DxHeaderFilter,
  DxColumnChooser,
  DxScrolling,
  DxSorting,
  DxFilterRow,
  DxFilterPanel,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxSearchPanel,
    DxExport,
    DxHeaderFilter,
    DxColumnChooser,
    DxScrolling,
    DxSorting,
    DxFilterRow,
    DxFilterRow,
    DxFilterPanel,
  },
  data() {
    return {
      fromDate: "",
      toDate: "",
      fa: 0,
      LSXcon: [],
      LSXBTP:[],
      LSXBTP5:[],
      LSXTP:[],
      LSXTP5:[],
      selection: [],
      allNumber: false,
      fa1: null,
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
      ],
      dataSource: [],
      tieude: null,
      isExcel: false,
      chonCongDoans: [],
      departments: [],
      allDepartmentTH: false,
      allDepartmentYS1: false,
      allDepartmentTB: false,
      allDepartmentQM: false,
      chonCongDoansTH: [],
      chonCongDoansYS1: [],
      chonCongDoansTB: [],
      chonCongDoansQM: [],
      idDepartment: null,
      seachDepartment: null,
      listDeparment: [],
      listNumber: [],
      week: null,
      year: null,
      number: null,
      fromWeek: null,
      toWeek: null,
    };
  },
  methods: {
    ...mapActions("po", [
      "getAllThucHienKHSX",
      "getDepartment",
      "getNumberByPO",
      "getSXByDepartment",
    ]),
    ...mapActions("lenhSanXuats", [
      "getLenhSanXuatCapPhois",
      "getAllSoLenhSanXuatCons",
      "getAllSoLenhSanXuatConsBTP",
    ]),
    ...mapActions("prod", [
      "getDepartmentByFactoryId",
      "getSLTheoThangSL",
      "getSLTheoThangM3",
      "getGroupDepartment",
      "getListGroupDepartment",
    ]),
    xuattieude() {
      if (this.idDepartment)
        this.tieude = "Báo vao sản lượng theo LSX - " + this.idDepartment.label;
    },
    async loadListGroupDepartment() {
      const data = await this.getListGroupDepartment();
      this.listGroupDepartment = data;
    },
    async selectAll() {
      this.open = 1;
      if (this.allNumber) {
        this.LSXcon.forEach((el) => {
          this.selection.push(el.number);
        });
        this.soLenhSanXuatCons().forEach((el) => {
          this.selection.push(el.number);
        });
      } else this.selection = [];
      // if (this.allDepartmentTB) {
      //   this.departments.forEach((el) => {
      //     if (this.idDepartment.id == 102366)
      //       this.chonCongDoansTB.push(el.departmentName);
      //   });
      // } else this.chonCongDoansTB = [];
      // if (this.allDepartmentQM) {
      //   this.departments.forEach((el) => {
      //     if (this.idDepartment.id == 102427)
      //       this.chonCongDoansQM.push(el.departmentName);
      //   });
      // } else this.chonCongDoansQM = [];
      // if (this.allDepartmentTH) {
      //   this.departments.forEach((el) => {
      //     if (this.idDepartment.id == 100000)
      //       this.chonCongDoansTH.push(el.departmentName);
      //   });
      // } else {
      //   this.chonCongDoansTH = [];
      // }
      // console.log("this.chonCongDoansTH", this.chonCongDoansTB);
    },

    tiLe({ valueText }) {
      // if (valueText) return "";
      return `${(valueText * 100).toFixed(1)} %`;
    },
    async loadDepartment() {
      this.allNumber = false;
      // let data = await this.getGroupDepartment();
      // data = data.filter((d) => d.factoryId == this.idDepartment.id && d.groupName != 'Sấy phôi');
      if (this.idDepartment.id == 100000) this.fa1 = 100000;
      if (this.idDepartment.id == 102340) this.fa1 = 100004;
      if (this.idDepartment.id == 102366) this.fa1 = 100005;
      await this.getAllSoLenhSanXuatCons({ factoryId: this.fa1 });
      this.LSXcon = await this.getAllSoLenhSanXuatConsBTP({
        factoryId: this.fa1,
      });
      this.LSXBTP = [];
      this.LSXBTP5 = [];
       this.LSXTP = [];
      this.LSXTP5 = []
     this.soLenhSanXuatCons().forEach((el) => {
         if (this.toWeek - el.week >=6)
          this.LSXTP.push(el.number);
          else this.LSXTP5.push(el.number);
        });
       this.LSXcon.forEach((el) => {
        console.log('hieu:',el.week)
        if (this.toWeek - el.week >=6) {
          this.LSXBTP.push(el.number);
        } else this.LSXBTP5.push(el.number);
        });
      this.allDepartment = false;
      this.chonCongDoans = [];
      //  this.departments = data;
      //console.log("this.departments", this.departments);
      this.loadNumber();
    },
    // onChangeFromWeek() {
    //   this.loadNumber();
    // },
    // onChangeToWeek() {
    //   this.loadNumber();
    // },
    calculateConTH(rowData) {
      rowData.soLuongConTH = rowData.keHoach - rowData.soLuongDat;
      return rowData.soLuongConTH;
    },
    calculateM3ConTH(rowData) {
      rowData.m3ConTH = rowData.keHoach * rowData.VOLUMN - rowData.m3Dat;
      return rowData.m3ConTH;
    },
    async loadNumber() {
      if (this.fa != null && this.fromWeek != null && this.toWeek != null) {
        let payload = {
          fromWeek: this.fromWeek,
          toWeek: this.toWeek,
          year: this.year,
          factoryId: this.fa1,
          idDepartment: this.idDepartment.id,
        };
        await this.getAllThucHienKHSX(payload);
        //   await this.getLenhSanXuatCapPhois({factoryId: this.fa1});
      }
    },

    dateFormat({ valueText }) {
      if (valueText) return "";
      return moment().subtract(valueText, "days").format("L");
    },
  },

  computed: {
    ...mapGetters("base", ["myFactoryInfor"]),
    ...mapGetters("po", ["pos"]),
    ...mapGetters("lenhSanXuats", ["getPheDuyets", "soLenhSanXuatCons"]),
    dataSourcefilter() {
      if (this.idDepartment) {
        console.log("this.idDepartment", this.idDepartment);
        console.log("this.chonCongDoansYS1", this.chonCongDoansYS1);
        if (this.idDepartment.id == 100000)
          return this.pos.filter((i) => this.selection.includes(i.number));
        if (this.idDepartment.id == 102340)
          return this.pos.filter((i) => this.selection.includes(i.number));
        if (this.idDepartment.id == 102366)
          return this.pos.filter((i) => this.selection.includes(i.number));
        if (this.idDepartment.id == 102427)
          return this.pos.filter((i) => this.selection.includes(i.number));
      }
    },
  },
  async created() {
       const today = new Date();
    this.toWeek = moment().week();
    this.fromWeek = this.toWeek - 3;
    this.year = moment().year();
    this.loadListGroupDepartment();
  },
};
</script>

<style>
#gridContainer {
  height: 700px;
}
.mauTHKHSX2 {
  color: orange;
  font-weight: bold;
}
.dx-datagrid-rowsview .dx-group-row.dx-row > td {
  font-weight: bold;
  color: black;
}
.active {
  color: #f6b024;
}
</style>
