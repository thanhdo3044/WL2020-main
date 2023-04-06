<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo Nhập Xuất Tồn từng công đoạn sản xuất -
          <span class="text-amber-14">{{
            factory1 ? factory1.label : ""
          }}</span>
        </div>

        <div
          class="col-6 cursor-pointer text-blue text-bold"
          style="font-size: 18px"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
          <span class="text-amber-14">{{ denNgay }}</span>
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
                @input="onChange"
                v-model="factory1"
                :val="congDoan"
                :label="congDoan.label"
                style="border-radius: 5px; font-size: 13px"
                class="text-weight-bold"
                color="amber-6"
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

      <div
        v-if="factory1"
        class="row"
        style="font-size: 12px; vertical-align: top"
      >
        <div class="col-12">
          <table style="border: 1px solid black; width: 100%">
            <tr>
              <td scope="col" style="border-right: 1px solid black">
                <div>
                  <q-checkbox
                    v-if="factory1.factoryId == 100000"
                    @input="selectAll()"
                    dense
                    color="amber-6"
                    class="text-blue"
                    style="font-weight: bold"
                    v-model="allDepartmentTH"
                    label="Chọn tất"
                  />
                  <q-checkbox
                    v-if="factory1.factoryId == 102340"
                    @input="selectAll()"
                    dense
                    color="amber-6"
                    class="text-blue"
                    style="font-weight: bold"
                    v-model="allDepartmentYS1"
                    label="Chọn tất"
                  />
                  <q-checkbox
                    v-if="factory1.factoryId == 102366"
                    @input="selectAll()"
                    dense
                    color="amber-6"
                    class="text-blue"
                    style="font-weight: bold"
                    v-model="allDepartmentTB"
                    label="Chọn tất"
                  />
                  <q-checkbox
                    v-if="factory1.factoryId == 102427"
                    @input="selectAll()"
                    dense
                    color="amber-6"
                    class="text-blue"
                    style="font-weight: bold"
                    v-model="allDepartmentQM"
                    label="Chọn tất"
                  />
                  <q-checkbox
                    v-if="factory1.factoryId == 102299"
                    @input="selectAll()"
                    dense
                    color="amber-6"
                    class="text-blue"
                    style="font-weight: bold"
                    v-model="allDepartmentCBG"
                    label="Chọn tất"
                  />
                </div>
              </td>
              <td
                scope="col"
                style="vertical-align: top"
                v-for="(value, index) in listGroupDepartment"
                :key="index"
              >
                <div>
                  <q-checkbox
                    v-if="factory1.factoryId == 102299"
                    @input="loadData"
                    dense
                    v-model="chonCongDoansCBG"
                    :val="value.NAME"
                    style="font-weight: bold"
                    :label="value.NAME"
                    color="amber-6"
                  />
                </div>
                <div
                  v-for="(congDoan, index1) in departments.filter(
                    (d) => d.groupOrder == value.ORDER
                  )"
                  :key="index1"
                >
                  <q-checkbox
                    v-if="
                      congDoan.value != 102484 &&
                      congDoan.id != 102490 &&
                      congDoan.factoryId == 100000
                    "
                    @input="loadData"
                    dense
                    v-model="chonCongDoansTH"
                    :val="congDoan.ID"
                    style="font-weight: bold"
                    :label="congDoan.departmentName"
                    color="amber-6"
                  />
                  <q-checkbox
                    v-if="
                      congDoan.value != 102484 &&
                      congDoan.id != 102490 &&
                      congDoan.factoryId == 102340
                    "
                    @input="loadData"
                    dense
                    v-model="chonCongDoansYS1"
                    :val="congDoan.ID"
                    style="font-weight: bold"
                    :label="congDoan.departmentName"
                    color="amber-6"
                  />
                  <q-checkbox
                    v-if="
                      congDoan.value != 102484 &&
                      congDoan.id != 102490 &&
                      congDoan.factoryId == 102366
                    "
                    @input="loadData"
                    dense
                    v-model="chonCongDoansTB"
                    :val="congDoan.ID"
                    style="font-weight: bold"
                    :label="congDoan.departmentName"
                    color="amber-6"
                  />
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <DxDataGrid
        id="gridContainer"
        :data-source="dataSource"
        key-expr="itemId"
        :hover-state-enabled="true"
        :no-data-text="'Vui lòng chọn công đoạn'"
        :row-alternation-enabled="true"
        :selection="{ mode: 'single' }"
        @cell-prepared="onCellPrepared"
        @content-ready="onContentReady"
      >
        <!-- <DxColumnChooser :enabled="isExcel" /> -->
        <DxHeaderFilter :visible="true" />
        <DxGroupPanel
            :visible="isExcel"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
        <DxScrolling mode="virtual" />
        <DxSorting mode="none" />
        <DxGrouping :auto-expand-all="false" />
        <!-- <DxEditing :allow-updating="true" mode="cell" /> -->
        <DxColumn
          data-field="groupName"
          caption=""
          :group-index="0"
          group-cell-template="groupCellTemplate"
          :allow-grouping="false"
          :sort-index="0"
          sort-order="asc"
        />
        <template #groupCellTemplate="{ data }">
          <div style="font-weight: bold">{{ data.value.substring(2) }}</div>
        </template>
        <DxColumn
          data-field="congdoan"
          caption=""
          :group-index="1"
          :allow-grouping="false"
          sort-order="desc"
          :sort-index="1"
          group-cell-template="groupCellTemplate2"
        />
        <template #groupCellTemplate2="{ data }">
          <div>{{ data.value }}</div>
        </template>
        <DxColumn
          data-field="itemId"
          caption="ID"
          alignment="center"
          width="80"
          :allowEditing="false"
        />
        <DxColumn
          data-field="chitiet"
          caption="Tên"
          alignment="center"
          width="450"
          :allowEditing="false"
        />
        <DxColumn
          data-field="market"
          caption="Chọn sản phẩm"
          :group-index="2"
          :sort-index="2"
          sort-order="desc"
          :allowEditing="false"
        />
        <DxColumn caption="Qui Cách" alignment="center" :allowEditing="false">
          <DxColumn
            caption="Dầy"
            data-field="height"
            alignment="center"
            :allowEditing="false"
            width="90"
          />
          <DxColumn
            caption="Rộng"
            data-field="width"
            alignment="center"
            width="90"
            :allowEditing="false"
          />
          <DxColumn
            caption="Dài"
            width="90"
            data-field="length"
            alignment="center"
            :allowEditing="false"
          />
        </DxColumn>

        <DxColumn caption="Tồn đầu kỳ" alignment="center">
          <DxColumn
            data-field="tondk"
            caption="Số lượng"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            format="#,##0.##"
          />
          <DxColumn
            data-field="tonDauKyM"
            caption="M³"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            format="#,##0.##"
          />
        </DxColumn>
        <DxColumn caption="Nhập" alignment="center">
          <DxColumn
            data-field="nhap"
            caption="Số lượng"
            data-type="number"
            alignment="center"
            :allowEditing="false"
            format="#,##0.##"
          />
          <DxColumn
            data-field="nhapM"
            caption="M³"
            data-type="number"
            alignment="center"
            :allowEditing="false"
            format="#,##0.##"
          />
        </DxColumn>
        <DxColumn caption="Xuất" alignment="center">
          <DxColumn
            data-field="xuat"
            caption="Số lượng"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            :visible="true"
            format="#,##0.##"
          />
          <DxColumn
            data-field="xuatM"
            caption="M³"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            :visible="true"
            format="#,##0.##"
          />
        </DxColumn>
        <DxColumn caption="Tồn cuối kỳ" alignment="center">
          <DxColumn
            data-field="tonCuoiKy"
            caption="Số lượng"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            format="#,##0.##"
            cell-template="tonCuoiKy-cellTemplate"
          />

          <DxColumn
            data-field="tonCuoiKyM"
            caption="M³"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            format="#,##0.##"
            cell-template="tonCuoiKyM3-cellTemplate"
          />
        </DxColumn>
        <template #tonCuoiKy-cellTemplate="{ data }">
          <span style="font-weight: 800; color: red" v-if="data.value < 0">{{
            data.value
          }}</span>
          <span v-else> {{ data.value }} </span>
        </template>
        <template #tonCuoiKyM3-cellTemplate="{ data }">
          <span style="font-weight: 800; color: red" v-if="data.value < 0">{{
            data.value
          }}</span>
          <span v-else> {{ data.value }} </span>
        </template>
        <DxSummary>
          <DxGroupItem
            column="nhap"
            :align-by-column="true"
            summary-type="sum"
            value-format="#,##0.##"
            display-format="{0}"
          />
          <DxGroupItem
            column="nhapM"
            summary-type="sum"
            :align-by-column="true"
            value-format="#,##0.##"
            display-format="{0}"
          />
          <DxGroupItem
            column="xuatM"
            summary-type="sum"
            :align-by-column="true"
            value-format="#,##0.##"
            display-format="{0}"
          />
          <DxGroupItem
            column="tonCuoiKy"
            summary-type="sum"
            :align-by-column="true"
            value-format="#,##0.##"
            display-format="{0}"
          />
          <DxGroupItem
            column="tonCuoiKyM"
            summary-type="sum"
            :align-by-column="true"
            value-format="#,##0.##"
            display-format="{0}"
          />
          <DxGroupItem
            column="tonDauKyM"
            summary-type="sum"
            :align-by-column="true"
            value-format="#,##0.##"
            display-format="{0}"
          />
          <DxGroupItem
            column="tondk"
            summary-type="sum"
            :align-by-column="true"
            value-format="#,##0.##"
            display-format="{0}"
          />
          <DxGroupItem
            column="xuat"
            summary-type="sum"
            :align-by-column="true"
            value-format="#,##0.##"
            display-format="{0}"
          />
        </DxSummary>
        <DxExport
          :enabled="isExcel"
          :allow-export-selected-data="false"
          :file-name="tieude"
        />
        <!-- <DxSearchPanel
            :visible="isExcel"
            :placeholder="'Tìm kiếm'"
            :width="400"
            align="center"
          /> -->
      </DxDataGrid>
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
import moment from "moment";
import { formatDateVN } from "../ultils";
import DialogSelectDate from "components/commons/DialogSelectFromDateToDate";
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxExport,
  DxLookup,
  DxColumnChooser,
  DxHeaderFilter,
  DxSummary,
  DxGroupItem,
  DxGroupPanel,
  DxScrolling,
  DxSorting,
  DxGrouping,
} from "devextreme-vue/data-grid";
export default {
  // name: 'PageName',
  components: {
    DxDataGrid,
    DxColumn,
    DxSearchPanel,
    DxExport,
    DxLookup,
    DxColumnChooser,
    DxHeaderFilter,
    DxSummary,
    DxGroupItem,
    DxGroupPanel,
    DxScrolling,
    DxSorting,
    DxGrouping,
    DialogSelectDate,
  },
  data() {
    return {
      showChooseDate: false,
      fromDate: moment().startOf("month"),
      toDate: moment(),
      dataSource: [],
      showVolumnColumn: false,
      factory1: false,
      allDepartment: false,
      allDepartmentTH: false,
      allDepartmentYS1: false,
      allDepartmentTB: false,
      allDepartmentQM: false,
      allDepartmentCBG: false,
      listGroupDepartment: [],
      isExcel: false,
      open: 1,
      tieude: null,
      data2: [],
      tocongdoan: [],
      departments: [],
      chonCongDoans: [],
      chonCongDoansTH: [],
      chonCongDoansYS1: [],
      chonCongDoansTB: [],
      chonCongDoansCBG: [],
      arrDepartment: [],
      stepId: null, // string,
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
        // {
        //   label: "Nhà máy CBG Quang Minh",
        //   factoryId: 102427,
        //   code: "QM",
        // },
        {
          label: "Khối Chế biến gỗ",
          factoryId: 102299,
          code: "CBG",
        },
      ],
    };
  },
  computed: {
    ...mapGetters("base", [
      "opCongDoans",
      "myFactoryInfor",
      "userInfo",
      "dsCongDoans",
    ]),
    ...mapGetters("keHoach", ["tonPhois"]),
    dataSourceFilter() {
      if (this.factory1.factoryId == 100000)
        return this.tonPhois.filter((i) =>
          this.chonCongDoansTH.includes(i.stepId)
        );
      if (this.factory1.factoryId == 102340)
        return this.tonPhois.filter((i) =>
          this.chonCongDoansYS1.includes(i.stepId)
        );
      if (this.factory1.factoryId == 102366)
        return this.tonPhois.filter((i) =>
          this.chonCongDoansTB.includes(i.stepId)
        );
      if (this.factory1.factoryId == 102299)
        return this.tonPhois.filter((i) =>
          this.chonCongDoansCBG.includes(i.groupDepartment)
        );
    },

    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  methods: {
    ...mapActions("keHoach", ["getTonsByStepId2"]),
    ...mapActions("base", ["getAllCongDoans"]),
    ...mapActions("prod", ["getListGroupDepartment", "getGroupDepartment"]),
    onContentReady(e) {
      if (this.open == 1) {
        if (this.factory1.factoryId == 102299) {
          e.component.expandAll(0);
          this.open = 0;
        } else {
          e.component.expandAll(0);
          e.component.expandAll(1);
          this.open = 0;
        }
      }
    },
    onCellPrepared(e) {
      console.log("e", e);
      if (e.rowType === "group") {
        if (e.row.groupIndex == 0) {
          e.cellElement.style.backgroundColor = "#64b5f6";
        }
        if (e.row.groupIndex == 1) {
          e.cellElement.style.backgroundColor = "#bbdefb";
        }
        if (parseFloat(e.cellElement.innerText) < 0) {
          e.cellElement.querySelector(".dx-datagrid-summary-item").style.color =
            "red";
        }
      }
    },
    xuattieude() {
      if (this.factory1)
        this.tieude =
          "Báo Cáo nhập xuất tồn từng công đoạn sản xuất - " +
          this.factory1.label;
    },
    async loadListGroupDepartment() {
      const data = await this.getListGroupDepartment();
      console.log("getListGroupDepartment", data);
      this.listGroupDepartment = data;
    },
    async loadData() {
      this.open = 1;
      if (this.factory1.factoryId == 100000) {
        this.arrDepartment = this.chonCongDoansTH;
      }
      if (this.factory1.factoryId == 102340) {
        this.arrDepartment = this.chonCongDoansYS1;
      }
      if (this.factory1.factoryId == 102366) {
        this.arrDepartment = this.chonCongDoansTB;
      }
      if (this.factory1.factoryId == 102299) {
        this.arrDepartment = this.chonCongDoansCBG;
      }
      console.log("this.arrDepartment",this.arrDepartment);
      let payload = {
        startDate: moment(this.fromDate).format("YYYY-MM-DD 07:00:00"),
        endDate: moment(this.toDate)
          .add(1, "day")
          .format("YYYY-MM-DD 06:59:59"),
        arrDepartment: this.arrDepartment,
        departmentId: this.factory1.factoryId
      };
      if (this.arrDepartment.length > 0) {
        const data = await this.getTonsByStepId2(payload);
        this.dataSource = data;
        if(this.factory1.factoryId == 102299){
          this.dataSource = data.filter((i) => 
            this.arrDepartment.includes(i.groupDepartment)
          )
        }
      } else {
        this.dataSource = [];
      }
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },

    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadData();
    },
    async selectAll() {
      this.open = 1;
      if (this.allDepartmentCBG) {
        this.listGroupDepartment.forEach((el) => {
          if (this.factory1.factoryId == 102299)
            this.chonCongDoansCBG.push(el.NAME);
        });
      } else this.chonCongDoansCBG = [];
      if (this.allDepartmentYS1) {
        this.departments.forEach((el) => {
          if (this.factory1.factoryId == 102340)
            this.chonCongDoansYS1.push(el.ID);
        });
      } else this.chonCongDoansYS1 = [];
      if (this.allDepartmentTB) {
        this.departments.forEach((el) => {
          if (this.factory1.factoryId == 102366)
            this.chonCongDoansTB.push(el.ID);
        });
      } else this.chonCongDoansTB = [];
      if (this.allDepartmentTH) {
        this.departments.forEach((el) => {
          if (this.factory1.factoryId == 100000)
            this.chonCongDoansTH.push(el.ID);
        });
      } else {
        this.chonCongDoansTH = [];
      }
      this.loadData();
    },
    async onChange() {
      this.open = 1;
      let data = await this.getGroupDepartment();
      data = data.filter((d) => d.factoryId == this.factory1.factoryId);
      this.departments = data;
      this.allDepartment = false;
      this.chonCongDoans = [];
      this.stepId = null;
      this.loadData();
    },
  },
  async created() {
    this.loadListGroupDepartment();
  },
  mounted() {},
};
</script>
<style>
#gridContainer {
  height: 700px;
}
/* .dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: rgb(0 0 0 / 87%);
  background-color: #f7f7f7;
  font-weight: 900;
} */

.active {
  color: #f6b024;
}
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  font-weight: 500;
  background-color: white;
  width: 280;
}
.dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  border-bottom: 1px solid #ddd;
  font-size: 13px;
  font-weight: bold;
}
.dx-datagrid-summary-item {
  color: black;
  font-weight: 500;
}
.dx-datagrid .dx-row > td {
  font-size: 16px;
}
.dx-group-panel-item:nth-child(1) {
    visibility: hidden;
}
.dx-group-panel-item:nth-child(2) {
    visibility: hidden;
}
.dx-group-panel-item:nth-child(3) {
    margin-left:-130px;
    color: #ffc107;
    font-weight: bold;
    background-color: white;
}
</style>
