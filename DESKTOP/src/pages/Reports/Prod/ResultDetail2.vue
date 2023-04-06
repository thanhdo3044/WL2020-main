<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo thông tin chi tiết Giao/Nhận -
          <span class="text-amber-14">{{ factory ? factory.label : "" }}</span>
        </div>
        <div class="col-3" align="center">
          <q-radio v-model="type" @input="load" color="positive" style="color:#21ba45; margin-right:10px; font-weight:bold" val="daNhan" label="Đã nhận" />

          <q-radio v-model="type" @input="load" color="red" style="color:red; font-weight:bold" val="chuaNhan" label="Chưa nhận" />
        </div>
        <div
          class="col-3 cursor-pointer text-blue text-bold"
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
                  v-model="factory"
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
              @input="xuattieude"
              class="text-weight-bold"
              label="Xuất Excel"
              dense
            />
          </div>
        </div>
        <div
          v-if="factory"
          class="row"
          style="font-size: 12px; vertical-align: top"
        >
          <div class="col-12">
            <table style="border: 1px solid black; width: 100%">
              <tr>
                <td scope="col" style="border-right: 1px solid black">
                  <div>
                    <q-checkbox
                      v-if="factory.factoryId == 100000"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentTH"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="factory.factoryId == 102340"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentYS1"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="factory.factoryId == 102366"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentTB"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="factory.factoryId == 102427"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentQM"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="factory.factoryId == 102299"
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
                      v-if="factory.factoryId == 102299"
                      @input="load"
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
                      @input="load"
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
                      @input="load"
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
                      @input="load"
                      dense
                      v-model="chonCongDoansTB"
                      :val="congDoan.ID"
                      style="font-weight: bold"
                      :label="congDoan.departmentName"
                      color="amber-6"
                    />
                    <q-checkbox
                      v-if="
                        congDoan.value != 102484 &&
                        congDoan.id != 102490 &&
                        congDoan.factoryId == 102427
                      "
                      @input="load"
                      dense
                      v-model="chonCongDoansQM"
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
          <div
            class="col-2 col-md-2"
            v-for="(congDoan, index) in departments"
            :key="index"
          ></div>
        </div>
          <div class="row">
            <div class="col-12">
              <DxDataGrid
                id="gridContainer"
                :data-source="dataSourcefilter"
                :show-row-lines="true"
                :show-borders="true"
                :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
                :hover-state-enabled="true"
                :row-alternation-enabled="true"
                :show-column-lines="true"
                :allow-column-resizing="true"
                @row-removed="rowRemoved"
                @cell-prepared="onCellPrepared"
              >
                <DxEditing :allow-deleting="isDelete" mode="row" />
                <DxColumnChooser :enabled="isExcel" />
                <DxHeaderFilter :visible="isExcel" />
                <DxScrolling mode="virtual" />
                <DxGroupPanel
                  :visible="isExcel"
                  :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
                />
                <DxGrouping :auto-expand-all="true" />
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
                <DxColumn
                data-field="groupName"
                caption=""
                :group-index="0"
                group-cell-template="groupCellTemplate"
                :sort-index="0"
                sort-order="asc"
              />
              <template #groupCellTemplate="{ data }">
                <div style="font-weight: bold">
                  {{ data.value.substring(2) }}
                </div>
              </template>
              <DxColumn
                data-field="departmentName2"
                caption=""
                :group-index="1"
                group-cell-template="groupCellTemplate2"
              />
              <template #groupCellTemplate2="{ data }">
                <div>{{ data.value }}</div>
              </template>

              <DxColumn
                data-field="Thứ"
                caption="Thứ"
                alignment="center"
                width="80"
              />
              <DxColumn
                data-field="Chi tiết/cụm"
                caption="Tên"
                width="320"
              />
                <DxColumn
                data-field="Dầy"
                alignment="center"
                caption="Dầy"
                width="90"
              />
                <DxColumn
                data-field="Rộng"
                alignment="center"
                caption="Rộng"
                width="90"
              />
                <DxColumn
                data-field="Dài"
                alignment="center"
                caption="Dài"
                width="90"
              />
                <DxColumn
                data-field="unit"
                alignment="center"
                caption="ĐVT"
                width="90"
              />
                <DxColumn
                data-field="Số lượng"
                caption="Số lượng"
                width="120"
              />
                <DxColumn
                data-field="khoiluong"
                caption="M³"
                format="#,##0.##"
                width="90"
              />
                <DxColumn
                data-field="Người giao"
                caption="Người giao"
                width="180"
              />
                <DxColumn
                data-field="Ngày giờ giao"
                caption="Ngày giờ giao"
                width="180"
              />
                <DxColumn
                data-field="Người nhận"
                caption="Người nhận"
                width="180"
              />
                <DxColumn
                data-field="Ngày giờ nhận"
                caption="Ngày giờ nhận"
                format="dd/MM/yyyy"
                width="220"
              />
                <DxColumn
                data-field="number"
                caption="Lệnh SX"
                width="150"
              />

                <DxSummary>
                  <DxGroupItem
                    column="Số lượng"
                    summary-type="sum"
                    data-type="number"
                    :show-in-group-footer="false"
                    :align-by-column="true"
                    :display-format="'{0}'"
                    :value-format="'###,##0.##'"
                  />
                  <DxGroupItem
                    column="khoiluong"
                    summary-type="sum"
                    data-type="number"
                    :show-in-group-footer="false"
                    :align-by-column="true"
                    :display-format="'{0}'"
                    :value-format="'###,##0.##'"
                  />
                </DxSummary>
                
              </DxDataGrid>
            </div>
          </div>
      </div>
    </q-card>
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxScrolling,
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
  showNotifySuccess,
  showNotifyError,
} from "../../../ultils";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxScrolling,
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
      dataSource: [],
      chonCongDoans: [],
      departments: [],
      type: "daNhan",
      allDepartmentTH: false,
      allDepartmentYS1: false,
      allDepartmentTB: false,
      allDepartmentQM: false,
      chonCongDoansTH: [],
      chonCongDoansYS1: [],
      chonCongDoansTB: [],
      chonCongDoansQM: [],
      factory: null,
      isExcel: false,
      open: 0,
      tieude: "",
      listGroupDepartment: [],
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102340,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102366,
        },
        // {
        //   label: "Nhà máy CBG Quang Minh",
        //   factoryId: 102427,
        // },
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
    ...mapGetters("base", ["congDoans", "myFactoryInfor", "userInfo"]),
    dataSourcefilter() {
      if (this.factory) {
        if (this.factory.factoryId == 100000)
          return this.dataSource.filter((i) =>
            this.chonCongDoansTH.includes(i.DEPARTMENT_ID)
          );
        if (this.factory.factoryId == 102340)
          return this.dataSource.filter((i) =>
            this.chonCongDoansYS1.includes(i.DEPARTMENT_ID)
          );
        if (this.factory.factoryId == 102366)
          return this.dataSource.filter((i) =>
            this.chonCongDoansTB.includes(i.DEPARTMENT_ID)
          );
        if (this.factory.factoryId == 102427)
          return this.dataSource.filter((i) =>
            this.chonCongDoansQM.includes(i.DEPARTMENT_ID)
          );
      }
    },
  },
  created() {
    this.loadPermission();
    this.loadListGroupDepartment();
    this.toDate = new Date();
    this.fromDate = getFisrtDayOfMonth(new Date());
  },
  methods: {
    ...mapActions("prod", [
      "getPermissionInScreen",
      "getDepartmentByFactoryId",
      "getGroupDepartment",
      "getListGroupDepartment",
    ]),
    xuattieude() {
        this.open = 1;
      if (this.factory)
        this.tieude =
          "Dữ liệu sản xuất chi tiết từ ngày " +
                    this.tuNgay +
                    " đến ngày " +
                    this.denNgay
    },
    onCellPrepared(e) {
      if (e.rowType === "group") {
        if (e.row.groupIndex == 0) {
          e.cellElement.style.backgroundColor = "#64b5f6";
        }
        if (e.row.groupIndex == 1) {
          e.cellElement.style.backgroundColor = "#bbdefb";
        }
      }
    },
    async loadListGroupDepartment() {
      const data = await this.getListGroupDepartment();
      this.listGroupDepartment = data;
    },
    async selectAll() {
      this.open = 1;
      if (this.allDepartmentCBG) {
        this.listGroupDepartment.forEach((el) => {
          if (this.factory.factoryId == 102299) this.chonCongDoansCBG.push(el.NAME);
        });
      } else this.chonCongDoansCBG = [];
      if (this.allDepartmentYS1) {
        this.departments.forEach((el) => {
          if (this.factory.factoryId == 102340) this.chonCongDoansYS1.push(el.ID);
        });
      } else this.chonCongDoansYS1 = [];
      if (this.allDepartmentTB) {
        this.departments.forEach((el) => {
          if (this.factory.factoryId == 102366) this.chonCongDoansTB.push(el.ID);
        });
      } else this.chonCongDoansTB = [];
      if (this.allDepartmentQM) {
        this.departments.forEach((el) => {
          if (this.factory.factoryId == 102427) this.chonCongDoansQM.push(el.ID);
        });
      } else this.chonCongDoansQM = [];
      if (this.allDepartmentTH) {
        this.departments.forEach((el) => {
          if (this.factory.factoryId == 100000) this.chonCongDoansTH.push(el.ID);
        });
      } else {
        this.chonCongDoansTH = [];
      }
      this.load();
    },

    async loadDepartment() {
      let data = await this.getGroupDepartment();
      data = data.filter((d) => d.factoryId == this.factory.factoryId);
      console.log("data", data);
      this.allDepartment = false;
      this.chonCongDoans = [];
      this.departments = data;
      this.load();
    },
    checkDepartment(id) {
      let data = null;
      data = this.dataSource.find((s) => s.DEPARTMENT_ID == id);
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
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.load();
      this.loadDepartment(this.factory);
    },
    async rowRemoved(e) {
      const payload = {
        packageId: e.data.ID,
      };
      let data = await this.$store.dispatch(
        "prod/DELETE_REPORT_RESULT_DETAIL",
        payload
      );
      if (data.meta.success) {
        const payload2 = {
          packageId: e.data.ID,
          itemInPackageId: data.data[0].ID,
        };
        let data2 = await this.$store.dispatch(
          "prod/DELETE_REPORT_RESULT_DETAIL2",
          payload2
        );
        if (data2.meta.success) {
          showNotifySuccess("Xóa Thành công");
        } else {
          showNotifyError();
        }
      }
      this.load();
    },
    async load() {
      if (this.factory.factoryId) {
        let payload = {
          fromDate: formatDateISO(this.fromDate),
          toDate: formatDateISO(this.toDate),
          factoryId: this.factory.factoryId,
          type: this.type
        };
        const data = await this.$store.dispatch(
          "prod/GET_REPORT_RESULT_DETAIL_2",
          payload
        );
        this.dataSource = data.data;
        console.log("mota", this.dataSource);
      }
    },
  },
};
</script>

<style>
#gridContainer {
  max-height: 700px;
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
</style>