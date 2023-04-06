<template>
  <q-page padding>
    <q-banner class="bg-primary text-orange">
      <div class="row">
        <div class="col-6 text-h6 orange">
          <span color="orange"> Báo cáo quỹ lương khối CBG</span>
        </div>
      </div>
    </q-banner>
    <q-card>
      <q-card-section>
        <div class="row">
          <q-select
            class="col-12 col-md-2 q-pa-sm"
            label-color="orange"
            dense
            filled
            @input="loadDepartment"
            v-model="idDepartment"
            :options="options"
            label="Chọn nhà máy"
          />
          <q-select
            class="col-12 col-md-2 q-pa-sm"
            filled
            dense
            v-model.number="month"
            :options="thangs"
            @input="changeDate"
            type="number"
            label-color="orange"
            label="Tháng"
          />
          <q-input
            label="Năm"
            class="col-12 col-md-2 q-pa-sm"
            label-color="orange"
            v-model.number="year"
            @input="changeDate"
            type="number"
            filled
            dense
          />
        </div>
        <div class="row">
          <div class="col-2 col-md-3">
            <q-checkbox
              v-if="idDepartment"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #21ba45; font-weight: bold"
              v-model="allDepartment"
              label="Chọn tất cả công đoạn"
            />
          </div>
        </div>
        <hr v-if="idDepartment" />
        <div class="row">
          <div
            class="col-2 col-md-2"
            v-for="(congDoan, index) in departments"
            :key="index"
          >
            <q-checkbox
              v-if="congDoan.id != 102484 && congDoan.id != 102490"
              dense
              v-model="chonCongDoans"
              :val="congDoan.id"
              :label="congDoan.name"
              color="teal"
            />
          </div>
        </div>
        <hr v-if="idDepartment" />
      </q-card-section>
      <q-card-section>
        <DxDataGrid
          id="gridContainer"
          :customize-columns="customizeColumns"
          :data-source="dataSourceFilter"
          :word-wrap-enabled="true"
          :show-borders="true"
          :show-row-lines="true"
          :show-column-lines="true"
        >
          <DxExport :enabled="true" file-name="Báo cáo quỹ lương khối CBG" />
          <DxSelection mode="multiple" />
          <DxColumnChooser :enabled="true" />
          <DxHeaderFilter :visible="true" />
          <DxGroupPanel
            :visible="true"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
          <DxLoadPanel :enabled="false" />
          <DxScrolling mode="virtual" />
          <DxSorting mode="none" />
          <DxColumn
            data-field="tong"
            caption="Tổng"
            :group-index="0"
            sort-order="desc"
          />
          <DxColumn
            data-field="departmentId"
            caption="Công đoạn"
            :group-index="0"
            sort-order="desc"
            :sort-index="0"
          >
            <DxLookup
              :data-source="departments"
              display-expr="name"
              value-expr="id"
            />
          </DxColumn>
          <DxColumn
            data-field="paren"
            caption="Sản phẩm"
            :group-index="1"
          />
          <DxColumn
            data-field="CODE"
            :width="80"
            caption="Mã số"
            alignment="center"
          />
          <DxColumn
            data-field="NAME"
            :width="300"
            caption="Tên"
          />
            <DxColumn
            caption="Quy cách"
            format="fixedpoint"
            :width="450"
            alignment="center"
          >
            <DxColumn
              data-field="HEIGHT"
              caption="Dày"
              :width="80"
              
            />
            <DxColumn
              data-field="WIDTH"
              caption="Rộng"
              :width="80"
            />
            <DxColumn
              data-field="LENGTH"
              caption="Dài"
              :width="80"
            />
          </DxColumn>
           <DxColumn
            data-field="chungloai"
            caption="Chủng loại"
            format="fixedpoint"
            :width="120"
            alignment="center"
          />
          <DxColumn
            caption="Khối lượng hoàn thành"
            alignment="center"
          >
            <DxColumn
              v-for="(week, index) in listWeek"
              :key="index"
              :data-field="'week' + week"
              :caption="'Tuần ' + week"
              format="#,##0.####"
              :width="100"
              alignment="center"
            >
            </DxColumn>
          </DxColumn>
          <DxColumn
            :width="120"
            data-field="total"
            caption="Tổng ghi nhận (M³)"
            format="#,##0.####"
            alignment="center"
          />
           <DxColumn
            :width="80"
            data-field="loi"
            caption="Lỗi"
            format="#,##0.####"
            alignment="center"
          />
           <DxColumn
            :width="120"
            data-field="tongcong"
            caption="Tổng đạt được (M³)"
            format="#,##0.####"
            alignment="center"
          />
          <DxColumn
            :width="100"
            data-field="dongia"
            caption="Đơn giá nhân công"
            alignment="center"
            format="#,##0.####"
          />
          <DxColumn
            :width="150"
            data-field="thanhtien"
            caption="Quỹ lương"
            alignment="right"
            format="#,##0"
          />
          <DxSummary>
             <DxGroupItem
              column="total"             
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
              <DxGroupItem
               v-for="(week, index) in listWeek"
              :key="index"
              :column="'week' + week"             
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
               <DxGroupItem
              column="tongcong"             
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
            <DxGroupItem
              column="thanhtien"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0'"
            />
          </DxSummary>
        </DxDataGrid>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxScrolling,
  DxSorting,
  DxEditing,
  DxButton,
  DxColumn,
  DxExport,
  DxLoadPanel,
  DxLookup,
  DxGroupPanel,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupItem,
  DxSummary,
} from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      dataSource: [],
      showVolumnColumn: true,
      year: moment().year(),
      month: { label: moment().month() + 1, id: moment().month() + 1 },
      listWeek: [],
      chonCongDoans: [],
      allDepartment: false,
      dulieu: [],
      chonFactoryId: null,
      departments: [],
      idDepartment: null,
      thangs: [
        { label: 1, id: 1 },
        { label: 2, id: 2 },
        { label: 3, id: 3 },
        { label: 4, id: 4 },
        { label: 5, id: 5 },
        { label: 6, id: 6 },
        { label: 7, id: 7 },
        { label: 8, id: 8 },
        { label: 9, id: 9 },
        { label: 10, id: 10 },
        { label: 11, id: 11 },
        { label: 12, id: 12 },
      ],
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
    };
  },
  components: {
    DxDataGrid,
    DxScrolling,
    DxSorting,
    DxColumn,
    DxLookup,
    DxExport,
    DxEditing,
    DxButton,
    DxLoadPanel,
    DxGroupPanel,
    DxColumnChooser,
    DxHeaderFilter,
    DxGroupItem,
    DxSummary,
  },
  created() {
    this.loadData();
  },
  methods: {
    ...mapActions("prod", [
      "getDepartmentByFactoryId",
      "getKlQuyLuong",
      "getKlQuyLuongLuaPhoiOD",
    ]),

    customizeColumns(columns) {
      columns[0].width = 70;
    },
    calculateTong(rowData) {
      rowData.tong = rowData.week + rowData.NHAP - rowData.XUAT;
      return rowData.tong;
    },
    changeDate() {
      this.loadData();
    },
    async loadDepartment() {
      this.allDepartment = false;
      this.selectAll();
      let data = await this.getDepartmentByFactoryId({
        factoryId: this.idDepartment.id,
      });
      data = data.data.filter((d) => d.type == "Tổ");
      this.departments = data;
    },
    async selectAll() {
      if (this.allDepartment) {
        this.chonCongDoans = [];
        this.departments.forEach((el) => {
          this.chonCongDoans.push(el.id);
        });
      } else {
        this.chonCongDoans = [];
      }
    },
    async loadData() {
      let date = new Date(this.year, this.month.id - 1, 1);
      let start = moment(date).startOf("month").format("YYYY-MM-DD 00:00");
      let end = moment(date).endOf("month").format("YYYY-MM-DD 23:59");
      let weekStart = moment(start).week();
      let weekStartend = moment(end).week();
      if (this.month.id == 1) weekStart = 1;
      let strWeek = "";
      this.listWeek = [];
      for (let i = weekStart; i <= weekStartend; i++) {
        strWeek += `[week${i}],`;
        this.listWeek.push(i);
      }
      strWeek = strWeek.substring(0, strWeek.length - 1);
      const payload = {
        fromDate: start,
        toDate: end,
        strWeek: strWeek,
      };
      let data1 = await this.getKlQuyLuong(payload);
      let data2 = await this.getKlQuyLuongLuaPhoiOD(payload);
      this.dataSource = [...data1, ...data2];
    },
  },
  computed: {
    ...mapGetters("base", ["congDoans", "myFactoryInfor"]),
    dataSourceFilter() {
      return this.dataSource.filter((i) =>
        this.chonCongDoans.includes(i.departmentId)
      );
    },
  },
};
</script>

<style>

#gridContainer {
  height: 800px;
}
</style>