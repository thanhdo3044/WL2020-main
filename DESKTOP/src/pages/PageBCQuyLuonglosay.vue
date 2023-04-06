<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo quỹ lương công đoạn sấy phôi
        </div>
        <div class="col-6 text-blue text-bold" align="right">
          <span style="font-size: 18px">Tháng: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="changeDate"
            v-model="month"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 40px;
            "
          />
          <span style="margin-right: 15px">-</span>
          <span style="font-size: 18px">Năm: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="changeDate"
            v-model="year"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 60px;
            "
          />
        </div>
      </div>
    <q-card>
       <div style="padding: 5px">
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
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  v-bind:class="{ isActive: true }"
                  color="amber-6"
                />
              </div>
            </div>
          </div>
          <div class="col-4" align="right">
            <q-checkbox
              v-model="isExcel"
              color="amber-6"
              class="text-weight-bold"
              label="Xuất Excel"
              dense
            />
          </div>
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
              label="Chọn tất cả lò sấy"
            />
          </div>
        </div>
        <hr v-if="idDepartment" />
        <div class="row">
          <div
            class="col-2 col-md-2"
            v-for="(losay, index) in departments"
            :key="index"
          >
            <q-checkbox
              dense
              v-model="chonlosay"
              :val="losay.ID"
              :label="losay.NAME"
              color="teal"
            />
          </div>
        </div>
        <hr v-if="idDepartment" />
        <DxDataGrid
          id="gridContainer"
          :customize-columns="customizeColumns"
          :word-wrap-enabled="true"
          :data-source="dataSourceFilter"
          :show-borders="true"
          :show-row-lines="true"
          :show-column-lines="true"
        >
        <DxExport :enabled="isExcel" file-name="Báo cáo quỹ lương lò sấy" />
          <DxSelection mode="multiple" />
          <DxColumnChooser :enabled="isExcel" />
          <DxHeaderFilter :visible="isExcel" />
          <DxGroupPanel
            :visible="isExcel"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
          <DxLoadPanel :enabled="false" />
          <DxScrolling mode="virtual" />
          <DxSorting mode="none" />
          <DxColumn
            data-field="tongcong"
            caption="Tổng"
            :group-index="0"
            sort-order="desc"
          />
          <DxColumn
            data-field="Lò"
            caption="Lo sấy"
            :group-index="1"
            sort-order="desc"
            :sort-index="0"
          >
            <!-- <DxLookup
              :data-source="departments"
              display-expr="NAME"
              value-expr="ID"
            /> -->
          </DxColumn>
       
          <DxColumn
            data-field="CODE"
            :width="120"
            caption="Mã số"
          /> 
          <DxColumn
            data-field="Chi tiết/cụm"
            :width="420"
            caption="Tên"
          />
          <DxColumn caption="Quy Cách" alignment="center">
            <DxColumn
              caption="Dày"
              data-field="height"
              alignment="center"
              :width="120"
            />
            <DxColumn
              caption="Rộng"
              data-field="width"
              alignment="center"
              :width="120"
            />
            <DxColumn
              caption="Dài"
              data-field="length"
              alignment="center"
              :width="120"
            />
          </DxColumn>
          <DxColumn
            :width="120"
            data-field="Tổng khối lượng"
            caption="Tổng (M³)"
            format="#,##0.####"
            alignment="center"
          />
          <DxColumn
            :width="120"
            data-field="dongia"
            caption="Đơn giá nhân công"
            format="#,##0.####"
            alignment="center"
          />
          <DxColumn
            :width="150"
            data-field="thanhtien"
            caption="Quỹ lương"
            format="#,##0"
          />
          <DxSummary>
            <DxGroupItem
              column="Tổng khối lượng"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
            <DxGroupItem
              column="dongia"
              summary-type="avg"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0'"
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
      </div>
    </q-card>
    </div>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxScrolling,
  DxSorting,
  DxEditing,
  DxButton,
  DxExport,
  DxColumn,
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
      isExcel: false,
      year: moment().year(),
      month:  moment().month() + 1 ,
      listWeek: [],
      chonlosay: [],
      allDepartment: false,
      dulieu: [],
      chonFactoryId: null,
      departments: [],
      idDepartment: null,
      options: [
        {
          id: 100000,
          label: "Nhà máy CBG Thuận Hưng",
        },
        {
          id: 100003,
          label: "Nhà máy CBG Yên Sơn 1",
        },
        {
          id: 100005,
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
    ...mapActions("prod", ["getlosayByFactoryId", "getKllosay"]),

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
      let data = await this.getlosayByFactoryId({
        factoryId: this.idDepartment.id,
      });

      this.departments = data.data;
      console.log("lo say", this.departments);
    },
    async selectAll() {
      if (this.allDepartment) {
        this.chonlosay = [];
        this.departments.forEach((el) => {
          this.chonlosay.push(el.ID);
        });
      } else {
        this.chonlosay = [];
      }
    },
    async loadData() {
      let date = new Date(this.year, this.month - 1, 1);
      let start = moment(date).startOf("month").format("YYYY-MM-DD 00:00");
      let end = moment(date).endOf("month").format("YYYY-MM-DD 23:59");
      let weekStart = moment(start).week();
      let strWeek = "";
      this.listWeek = [];
      for (let i = weekStart; i < weekStart + 5; i++) {
        strWeek += `[week${i}],`;
        this.listWeek.push(i);
      }
      strWeek = strWeek.substring(0, strWeek.length - 1);
      this.dataSource = await this.getKllosay({
        fromDate: start,
        toDate: end,
        strWeek: strWeek,
      });
      console.log("lo say:", this.dataSource);
    },
  },
  computed: {
    ...mapGetters("base", ["congDoans", "myFactoryInfor"]),
    dataSourceFilter() {
      return this.dataSource.filter((i) => this.chonlosay.includes(i.ID));
    },
  },
};
</script>

<style>

</style>