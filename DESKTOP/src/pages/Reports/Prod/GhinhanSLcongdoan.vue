<template>
  <q-page class="q-pa-sm">
    <q-banner class="text-primary row">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div class="text-h6 q-mt-lg">
        <b> GHI NHẬN SẢN LƯỢNG THEO NGÀY KHỐI CBG </b>
      </div>
    </q-banner>
    <q-card-section>
      <!-- <div class="col-12 col-md-2 col-sm-4 q-pa-sm">
                    <q-input @input="loadGrid" v-model.number="week" type="number" label="Tuần" />
                </div>
                <div class="col-12 col-md-2 col-sm-4 q-pa-sm">
                    <q-input @input="loadGrid" v-model.number="year" type="number" label="Năm" />
          </div>-->
      <!-- <div class="col-2" align="right">
            <q-btn flat color="orange" icon="search" @click="showFilterDialog = true" />
          </div> -->

      <q-separator inset />

      <div class="row print-hide">
        <q-input
          class="col-1 q-ml-sm"
          @input="loadGrid"
          outlined
          label-color="orange"
          v-model.number="year"
          type="number"
          label="Năm"
        />
        <q-input
          class="col-1 q-ml-sm"
          @input="loadGrid"
          outlined
          label-color="orange"
          v-model.number="week"
          type="number"
          label="Tuần"
        />
        <q-select
          class="col-2 q-ml-sm"
          @input="onChange"
          outlined
          label-color="orange"
          v-model="idDepartment"
          :options="options"
          label="Chọn nhà máy"
        />
        <q-select
          class="col-2 q-ml-sm"
          outlined
          v-model="stepId"
          :options="data"
          label="Chọn công đoạn"
          label-color="orange"
          @input="loadGrid"
        />
        <q-select
          label-color="orange"
          class="col-2 q-mb-sm q-ml-sm"
          outlined
          v-model="number"
          :options="listNumber"
          @input="loadLSX"
          label="Lệnh sản xuất"
          :readonly="gop"
        />

        <q-input
          class="col-1.5 q-ml-sm"
          label-color="orange"
          outlined
          label="Chọn ngày ghi nhận"
          v-model="from"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon
              v-if="from"
              @click="from = ''"
              name="close"
              class="cursor-pointer"
            />
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="from">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <div class="col-1 q-ml-sm">
          <q-btn
            style="height: 55px"
            color="positive"
            label="Ghi nhận"
            @click="confirmphieu = true"
          />
        </div>
      </div>

      <DxDataGrid
        :word-wrap-enabled="true"
        :data-source="dataSourceGrid"
        :show-row-lines="true"
        :show-column-lines="true"
        :show-borders="true"
        @row-updating="rowUpdating"
        :no-data-text="'Không có dữ liệu !'"
      >
        <DxEditing :allow-updating="true" mode="cell" />
        <DxExport
          :enabled="true"
          :allow-export-selected-data="true"
          :file-name="title"
        />
        <DxSorting mode="none" />
        <DxScrolling mode="infinite" />
        
        <DxColumn
          data-field="itemName"
          :width="550"
          caption="Tên"
          cssClass="ColumnsAutomaticSL"
          :fixed="true"
          :visible="true"
        />
        <DxColumn
          data-field="ID_CHA"
          caption="Sản phẩm"
          :group-index="1"
          :width="280"
        />
        <DxColumn
          caption="Quy Cách"
          :width="90"
          alignment="center"
          cssClass="ColumnsAutomaticSL"
          :fixed="true"
          :visible="true"
        >
          <DxColumn
            data-field="itemLength"
            caption="Dài"
            data-type="number"
            format="fixedpoint"
            cssClass="ColumnsAutomaticSL"
            alignment="left"
            :width="60"
          />
          <DxColumn
            data-field="itemWidth"
            caption="Rộng"
            data-type="number"
            format="fixedpoint"
            cssClass="ColumnsAutomaticSL"
            alignment="left"
            :width="70"
          />
          <DxColumn
            data-field="itemHeight"
            caption="Dày"
            data-type="number"
            format="fixedpoint"
            cssClass="ColumnsAutomaticSL"
            alignment="left"
            :width="60"
          />
        </DxColumn>
        <!-- <DxColumn data-field="ton" :width="60" caption="Tồn tại tổ" /> -->
        <DxColumn
          data-field="keHoach"
          caption="Số lượng theo LSX"
          data-type="number"
          :width="150"
          cssClass="ColumnsAutomaticSL"
          format="fixedpoint"
          alignment="center"
        />
        <DxColumn
          data-field="dathuchien"
          caption="Số lượng đã thực hiện"
          data-type="number"
          :width="150"
          cssClass="ColumnsAutomaticSL"
          format="fixedpoint"
          alignment="center"
          :calculate-cell-value="SLTHUCHIEN"
        />
        <DxColumn
          data-field="conThucHien"
          caption="Số lượng còn phải làm"
          data-type="number"
          :width="150"
          cssClass="ColumnsAutomaticSL"
          format="fixedpoint"
          alignment="center"
        />

        <DxColumn
          data-field="congdoan"
          caption="Công đoạn ghi nhận"
          format="fixedpoint"
          alignment="center"
          cssClass="ColumnsAutomaticSL"
          width="200"
        />
        <DxColumn
          data-field="GHINHAN"
          caption="Số lượng ghi nhận"
          cssClass="ColumnsAutomaticSL"
          alignment="center"
          width="120"
        />
        <DxColumn
          data-field="noinhan"
          caption="Công đoạn tiếp theo"
          format="fixedpoint"
          alignment="center"
          cssClass="ColumnsAutomaticSL"
          width="200"
        />

        <DxColumnFixing :enabled="true" />
      </DxDataGrid>
      <q-dialog v-model="confirmphieu" persistent>
        <q-card style="min-width: 400px">
          <q-card-section class="row items-center">
            <div class="row">
              <div class="col-12 top-title">Xác nhận ghi nhận sản lượng</div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Hủy" color="primary" v-close-popup />
            <q-btn
              flat
              label="Đồng ý"
              @click="capnhat"
              color="primary"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card-section>
  </q-page>
</template>
<style >
.ColumnsAutomaticSL {
  color: black;
  background-color: white;
  font-weight: 500;
  font-size: 32px;
}
.dx-command-expand {
  background: white;
  font-weight: 900;
  width: 280;
  font-family: Arial, Helvetica, sans-serif;
}
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  background-color: #f7f7f7;
  font-weight: 900;
  width: 280;
}

</style>
<script>
import {
  DxChart,
  DxAdaptiveLayout,
  DxCommonSeriesSettings,
  DxSize,
  DxTooltip,
} from "devextreme-vue/chart";
import { DxDateBox } from "devextreme-vue";
import { showNotifySuccess, showNotifyError } from "../../../ultils";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
  DxRequiredRule,
  DxScrolling,
  DxSearchPanel,
  DxSelection,
  DxColumnFixing,
  DxSorting,
  DxGroupPanel,
  DxFilterRow,
  DxFilterPanel,
  DxHeaderFilter,
  DxGroupItem,
  DxSummary,
} from "devextreme-vue/data-grid";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
  getWeekNumber,
  showLoadingIos,
  closeLoading,
} from "../../../ultils";
import {
  DxPivotGrid,
  DxFieldChooser,
  DxExport,
} from "devextreme-vue/pivot-grid";
export default {
  components: {
    DxHeaderFilter,
    DxChart,
    DxAdaptiveLayout,
    DxCommonSeriesSettings,
    DxSize,
    DxFilterPanel,
    DxTooltip,
    DxPivotGrid,
    DxFieldChooser,
    DxExport,
    DxFilterRow,
    DxSorting,
    DxGroupPanel,
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxLookup,
    DxRequiredRule,
    DxScrolling,
    DxSearchPanel,
    DxSelection,
    DxColumnFixing,
    DxGroupItem,
    DxSummary,
  },
  computed: {
    pivortGrid: function () {
      return this.$refs.grid.instance;
    },
    ...mapGetters("base", [
      "opCongDoans",
      "myFactoryInfor",
      "userInfo",
      "dsCongDoans",
    ]),
  },
  data() {
    return {
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102340,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102366,
          code: "TB",
        },
        {
          label: "Nhà máy Quang Minh",
          factoryId: 102427,
          code: "QM",
        },
      ],
      confirmphieu: false,
      selection: false,
      number: "",
      from: null,
      listNumber: [],
      data1: [],
      idDepartment: null,
      showChooseMonth: false,
      dataSource: null,
      year: null,
      gop: false,
      fa: 100000,
      month: null,
      stepId: null,
      week: "",
      departments: [],
      department: null,
      title: "Sản lượng cần thực hiện trong tuần",
      countData: 0,
      fa: 0,
      dataSourceGrid: [],
      showPivort: false,
      showFilterDialog: false,
      showVolumnColumn: true,
    };
  },
  created() {
    this.from = moment().format("YYYY-MM-DD");
    const today = new Date();
    const currentMonth = today.getMonth();
    this.month = currentMonth;
    const currentYear = today.getFullYear();
    this.year = currentYear;
    //this.load()
    this.week = getWeekNumber(today);
    // this.loadDepartments()
    this.loadGrid();
  },
  methods: {
    ...mapActions("base", ["getAllDepartment", "getAllCongDoans"]),
    calculateTyLe(rowData) {
      if (parseFloat(rowData.tongSanLuong) > 0 && parseFloat(rowData.po) > 0) {
        const tyle = rowData.tongSanLuong / rowData.po;
        return tyle;
      }
    },
    SLTHUCHIEN(rowData) {
      rowData.dathuchien = rowData.keHoach - rowData.conThucHien;
      return rowData.dathuchien;
    },
    async onChange(value) {
        this.stepId = null;
        this.number = null;
        this.dataSourceGrid = []
      await this.getAllCongDoans({ factoryId: value.factoryId });

      let congdoan = this.dsCongDoans
        .filter((s) => s.type2 === "to")
        .map((o) => ({
          label: o.name,
          value: o.id,
          description: `[${o.code}] ${o.name}`,
          icon: "mail",
          factoryId: o.factoryId,
        }));
      // this.stepId = null;
      this.data = congdoan;
     if (this.idDepartment.code == "QM") this.fa = 102427;
      if (this.idDepartment.code == "TH") this.fa = 100000;
      if (this.idDepartment.code == "YS1A") this.fa = 100003;
      if (this.idDepartment.code == "YS1B") this.fa = 100004;
      if (this.idDepartment.code == "TB") this.fa = 100005;
      this.listNumber = [];
      const payload = {
        week: this.week,
        year: this.year,
        factoryId: this.fa,
      };

      const data2 = await this.$store.dispatch("prod/GET_HE_SO_LSX", payload);
      data2.data.forEach((element) => {
        this.listNumber.push(element.number);
      });
    },
    async filterFn(val, update) {
      console.log("this.data", this.data);
      if (val === "") {
        update(() => {
          this.data1 = this.data;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.data1 = this.data.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    exportToExcel() {
      // this.pivortGrid.exportToExcel()
    },
    print() {
      window.print();
    },
    async capnhat() {
      let ghinhanSL = [];
      this.dataSourceGrid.forEach((d) => {
        if (d.GHINHAN > 0) {
          ghinhanSL.push(d);
        }
      });
      this.dulieu = ghinhanSL;
      console.log("ghi nhan:", this.dulieu);

      for (let i = 0; i < this.dulieu.length; i++) {
        const payload = {
          sourceId: this.dulieu[i].stepId,
          destinationId: this.dulieu[i].next_id,
          itemFromId: this.dulieu[i].stepId,
          itemId: this.dulieu[i].itemId,
          quantity: this.dulieu[i].GHINHAN,
          tonconlai: 0,
          ACCOUNT_ID: this.userInfo.id,
          typeId: 100026, //100026,//100004
          description: "",
          ID: null,
          po: this.dulieu[i].code,
          createdat: moment(`${this.from} 07:00:00`).format(
            "YYYY-MM-DD hh:mm:ss"
          ),
        };
        const data = await this.$store.dispatch(
          "prod/POST_GHI_NHAN_SL",
          payload
        );
        if (data.meta.success) {
          showNotifySuccess();
        } else {
          showNotifyError();
        }
      }
      this.loadLSX();
    },
    async rowUpdating(e) {
      const regex = /^[0-9.]+$/;
      const { newData, oldData } = e;
      if (!regex.test(newData.GHINHAN)) {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng nhập số ! </span>`,
          persistent: true,
        });
        newData.GHINHAN = null;
      }
      if (newData.GHINHAN > oldData.conThucHien) {
        this.$q.dialog({
          title: "Xác nhận",
          message: `Bạn nhập quá số lượng ghi nhận`,
          cancel: true,
          persistent: true,
        });
        e.newData.GHINHAN = null;
      }
    },
    async loadDepartments() {
      const myFactoryId = this.myFactoryInfor.id;
      const payload = {
        factoryId: myFactoryId,
      };
      if (myFactoryId) {
        const data = await this.$store.dispatch(
          "base/GET_DEPARTMENTS",
          payload
        );

        // this.departments = data.data
        data.data.forEach((element) => {
          if (element.type === "Tổ") {
            this.departments.push({
              value: element.id,
              label: element.name,
            });
          }
        });
        if (this.departments.length > 0) {
          this.department = this.departments[0];
        }
      }
    },
    async selectMonthYear(m, y) {
      this.month = m;
      this.year = y;
      this.$q.loading.show();
      await this.load();
      this.showChooseMonth = false;
      this.$q.loading.hide();
    },

    async loadLSX() {
      if (this.stepId) {
        const payload = {
          week: this.week + 1,
          year: this.year,
          factoryId: this.fa,
          departmentId: this.stepId ? this.stepId.value : 0,
          number: this.number,
        };
        const data = await this.$store.dispatch("prod/GHI_NHAN_SL", payload);
        this.dataSourceGrid = data.data;
      } else {
        this.number = "";
        this.$q.dialog({
          html: true,

          message: "Bạn phải chọn công đoạn cần nhập dữ liệu",
        });
      }
    },
    async loadGrid() {
      this.number = "";
      if (this.idDepartment.code == "TH") this.fa = 102427;
      if (this.idDepartment.code == "TH") this.fa = 100000;
      if (this.idDepartment.code == "YS1A") this.fa = 100003;
      if (this.idDepartment.code == "YS1B") this.fa = 100004;
      if (this.idDepartment.code == "TB") this.fa = 100005;
      this.listNumber = [];
      if (this.fa) {
        let payload = {
          week: this.week,
          year: this.year,
          factoryId: this.fa,
        };

        let data2 = await this.$store.dispatch("prod/GET_HE_SO_LSX", payload);
        data2.data.forEach((element) => {
          this.listNumber.push(element.number);
        });
      }

      closeLoading();
    },
  },
};
</script>

<style scoped>
#gridContainer {
  height: 600px;
}
</style>