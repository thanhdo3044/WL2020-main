<template>
 <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo khối lượng sấy chi tiết từng lò sấy
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
                  color="amber-6"
                />
              </div>
            </div>
          </div>
        </div>
      <q-card-section>
        
        <div class="row" v-if="idDepartment">
          <div class="col-2 col-md-2">
            <q-checkbox
              v-if="idDepartment.id == 100000"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #f6b024; font-weight: bold"
              v-model="allDepartmentTH"
              label="Chọn tất cả công đoạn"
            />
            <q-checkbox
              v-if="idDepartment.id == 100003"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #f6b024; font-weight: bold"
              v-model="allDepartmentYS"
              label="Chọn tất cả công đoạn"
            />
            <q-checkbox
              v-if="idDepartment.id == 100004"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #f6b024; font-weight: bold"
              v-model="allDepartmentYS1B"
              label="Chọn tất cả công đoạn"
            />
            <q-checkbox
              v-if="idDepartment.id == 100005"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #f6b024; font-weight: bold"
              v-model="allDepartmentTB"
              label="Chọn tất cả công đoạn"
            />
          </div>
          <div>
            <p v-if="idDepartment" style="color: #21ba45; font-weight: bold">
              Chọn mục đích sấy:
            </p>
          </div>
          &emsp;
          <div>
            <q-checkbox
              v-if="idDepartment"
              @input="mucdich"
              val="ID"
              dense
              color="teal"
              style="color: orange; font-weight: bold"
              v-model="md"
              label="Indoor"
            />
          </div>
          &emsp;
          <div>
            <q-checkbox
              v-if="idDepartment"
              @input="mucdich"
              val="OD"
              dense
              color="teal"
              style="color: orange; font-weight: bold"
              v-model="md"
              label="Outdoor"
            />
          </div>
          &emsp;
          <div>
            <q-checkbox
              v-if="idDepartment"
              @input="mucdich"
              val="SL"
              dense
              color="teal"
              style="color: orange; font-weight: bold"
              v-model="md"
              label="Sấy lại"
            />
          </div>
        </div>
        <hr v-if="idDepartment" />
        <!-- <div class="row">
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
        </div> -->
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
                congDoan.FACTORY_ID == 100000
              "
              dense
              v-model="chonCongDoansTH"
              :val="congDoan.ID"
              :label="congDoan.NAME"
              color="teal"
            />
            <q-checkbox
              v-if="
                congDoan.value != 102484 &&
                congDoan.id != 102490 &&
                congDoan.FACTORY_ID == 100003
              "
              dense
              v-model="chonCongDoansYS"
              :val="congDoan.ID"
              :label="congDoan.NAME"
              color="teal"
            />
            <q-checkbox
              v-if="
                congDoan.value != 102484 &&
                congDoan.id != 102490 &&
                congDoan.FACTORY_ID == 100004
              "
              dense
              v-model="chonCongDoansYS1B"
              :val="congDoan.ID"
              :label="congDoan.NAME"
              color="teal"
            />
            <q-checkbox
              v-if="
                congDoan.value != 102484 &&
                congDoan.id != 102490 &&
                congDoan.FACTORY_ID == 100005
              "
              dense
              v-model="chonCongDoansTB"
              :val="congDoan.ID"
              :label="congDoan.NAME"
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
          :word-wrap-enabled="true"
          :data-source="dataSourceFilter"
          :show-borders="true"
          :show-row-lines="true"
          :show-column-lines="true"
        >
          <DxSelection mode="multiple" />
          <DxColumnChooser :enabled="true" />
          <DxHeaderFilter :visible="true" />

          <DxLoadPanel :enabled="false" />
          <DxScrolling mode="virtual" />
          <DxSorting mode="none" />
          <DxColumn
            data-field="tongcong"
            caption="Tổng"
            :group-index="0"
            sort-order="desc"
            css-class="rowBCKLLS"
          />
          <DxColumn
            data-field="Lò"
            caption="Lo sấy"
            :group-index="1"
            sort-order="desc"
            :sort-index="0"
            css-class="rowBCKLLS"
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
            css-class="rowBCKLLS"
          />
          <DxColumn
            data-field="Chi tiết/cụm"
            :width="420"
            caption="Tên"
            css-class="rowBCKLLS"
          />
          <DxColumn caption="Quy Cách" alignment="center" css-class="rowBCKLLS">
            <DxColumn
              caption="Dày"
              data-field="height"
              alignment="center"
              :width="120"
              css-class="rowBCKLLS"
            />
            <DxColumn
              caption="Rộng"
              data-field="width"
              alignment="center"
              :width="120"
              css-class="rowBCKLLS"
            />
            <DxColumn
              caption="Dài"
              data-field="length"
              alignment="center"
              :width="120"
              css-class="rowBCKLLS"
            />
          </DxColumn>
          <DxColumn
            :width="120"
            data-field="Tổng khối lượng"
            caption="Tổng (M³)"
            format="#,##0.####"
            alignment="center"
            css-class="rowBCKLLS"
          />
          <!-- <DxColumn
            :width="120"
            data-field="dongia"
            caption="Đơn giá nhân công"
            format="#,##0.####"
            alignment="center"
            css-class="rowBCKLLS"
          />
          <DxColumn
            :width="150"
            data-field="thanhtien"
            caption="Quỹ lương"
            format="#,##0"
            css-class="rowBCKLLS"
          /> -->
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
            <!-- <DxGroupItem
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
            /> -->
          </DxSummary>
        </DxDataGrid>
      </q-card-section>
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
      year: moment().year(),
      month:  moment().month() + 1 ,
      listWeek: [],
      chonlosay: [],
      allDepartmentTH: false,
      allDepartmentYS: false,
      allDepartmentYS1B: false,
      allDepartmentTB: false,
      chonCongDoansTH: [],
      chonCongDoansYS: [],
      chonCongDoansYS1B: [],
      chonCongDoansTB: [],
      dulieu: [],
      chonFactoryId: null,
      departments: [],
      idDepartment: null,
      md: [],
      options: [
        {
          id: 100000,
          label: "Nhà máy CBG Thuận Hưng",
        },
        {
          id: 100004,
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
    ...mapActions("prod", ["getlosayByFactoryId", "getSLlosay"]),

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
      console.log("this.idDepartment", this.idDepartment);
      if (this.allDepartmentYS) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 100003) this.chonCongDoansYS.push(el.ID);
        });
      } else this.chonCongDoansYS = [];
      if (this.allDepartmentYS1B) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 100004)
            this.chonCongDoansYS1B.push(el.ID);
        });
      } else this.chonCongDoansYS1B = [];
      if (this.allDepartmentTB) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 100005) this.chonCongDoansTB.push(el.ID);
        });
      } else this.chonCongDoansTB = [];
      if (this.allDepartmentTH) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 100000) this.chonCongDoansTH.push(el.ID);
        });
      } else {
        this.chonCongDoansTH = [];
      }
      console.log("this.chonCongDoansYS", this.departments);
    },
    async mucdich() {},
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
      this.dataSource = await this.getSLlosay({
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
      if (this.idDepartment) {
        if (this.idDepartment.id == 100000)
          return this.dataSource.filter((i) =>
            this.chonCongDoansTH.includes(i.ID) ||
          (this.md.includes(i.MD) && i.FACTORY_ID == this.idDepartment.id)
          );
        if (this.idDepartment.id == 100003)
          return this.dataSource.filter((i) =>
            this.chonCongDoansYS.includes(i.ID) ||
          (this.md.includes(i.MD) && i.FACTORY_ID == this.idDepartment.id)
          );
        if (this.idDepartment.id == 100004)
          return this.dataSource.filter((i) =>
            this.chonCongDoansYS1B.includes(i.ID) ||
          (this.md.includes(i.MD) && i.FACTORY_ID == this.idDepartment.id)
          );
        if (this.idDepartment.id == 100005)
          return this.dataSource.filter((i) =>
            this.chonCongDoansTB.includes(i.ID) ||
          (this.md.includes(i.MD) && i.FACTORY_ID == this.idDepartment.id)
          );
      }

      // return this.dataSource.filter(
      //   (i) =>
      //     this.chonlosay.includes(i.ID) ||
      //     (this.md.includes(i.MD) && i.FACTORY_ID == this.idDepartment.id)
      // );
    },
  },
};
</script>

<style>
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  font-weight: 900;
}
.dx-datagrid-headers .rowBCKLLS {
  color: orange;
}

.active{
  color: #f6b024;
}
</style>