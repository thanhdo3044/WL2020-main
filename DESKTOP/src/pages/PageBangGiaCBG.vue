<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-9 text-blue text-bold" style="font-size: 18px">
          Bảng đơn giá nhân công trực tiếp
        </div>
               <div class="col-3" lign="right" style="font-size: 16px;">
   <DateBox :value="date" :onChange="chonNgay"  :displayFormat="'dd/MM/yyyy'" :title="'Ngày áp dụng:'"
  :width="10" />
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
          <div class="col-2">
            <button type="button" style="border: none" class="bg-positive text-white" @click="capnhat">Cập nhật đơn giá nhân công mới</button>
          </div>
          <div class="col-2" align="right">
            <q-checkbox
              v-model="isExcel"
              color="amber-6"
              class="text-weight-bold"
              label="Xuất Excel"
              dense
            />
          </div>
        </div>
        <div
          v-if="idDepartment"
          class="row"
          style="font-size: 12px; vertical-align: top"
        >
          <div class="col-12">
            <table style="border: 1px solid black; width: 100%">
              <tr>
                <td scope="col" style="border-right: 1px solid black">
                  <div>
                    <q-checkbox
                      v-if="idDepartment.id == 100000"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentTH"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="idDepartment.id == 102340"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentYS1"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="idDepartment.id == 102366"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentTB"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="idDepartment.id == 102427"
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="allDepartmentQM"
                      label="Chọn tất"
                    />
                    <q-checkbox
                      v-if="idDepartment.id == 102299"
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
                      v-if="loadDepartment.id == 102299"
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
        <DxDataGrid
          id="gridContainer"
          :customize-columns="customizeColumns"
          :data-source="dataSourceFilter"
          :word-wrap-enabled="true"
          :show-column-lines="true"
          :show-row-lines="true"
          :show-borders="true"
          @cell-prepared="onCellPrepared"
          @row-updating="rowUpdating"
        >
          <DxExport
            :enabled="isExcel"
            file-name="Đơn giá nhân công(CBG)"
            :allow-export-selected-data="false"
          />
          <DxEditing :allow-updating="true" mode="cell" />
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
          <DxColumn data-field="marketId" :visible="false" />
          <DxColumn data-field="stepId" :visible="false" />
          <DxColumn
            data-field="tenCongDoan"
            caption="Công đoạn"
            :group-index="0"
            sort-order="desc"
            :sort-index="0"
          />
          <DxColumn
            data-field="stepId"
            caption="ID công đoạn"
            :width="120"
            :visible="capnhatdongia"
          />
          <DxColumn
            data-field="paren_id"
            caption="ID Sản phẩm"
            :width="120"
            :visible="capnhatdongia"
          />

          <DxColumn
            data-field="paren"
            caption="Sản phẩm"
            :width="230"
            :group-index="1"
            sort-order="desc"
          />
          <DxColumn
            data-field="CODE"
            caption="Mã số"
            :width="150"
            :allowEditing="false"
          />
          <DxColumn
            data-field="chitiet"
            caption="Tên"
            alignment="center"
            format="fixedpoint"
            :width="450"
            :allowEditing="false"
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
              :allowEditing="false"
            />
            <DxColumn
              data-field="WIDTH"
              caption="Rộng"
              :width="80"
              :allowEditing="false"
            />
            <DxColumn
              data-field="LENGTH"
              caption="Dài"
              :width="80"
              :allowEditing="false"
            />
          </DxColumn>
          <DxColumn
            data-field="TYPE"
            caption="Chủng loại"
            format="fixedpoint"
            :width="200"
            alignment="center"
            :allowEditing="false"
          />

          <DxColumn
            data-field="gia"
            caption="Đơn giá nhân công trực tiếp (VNĐ)"
            format="fixedpoint"
            :width="150"
            :allowEditing="false"
          />
          <DxColumn
            data-field="createdAt"
            caption="Ngày áp dụng"
            alignment="center"
            format="dd/MM/yyyy"
            dataType="date"
            :width="150"
            :allowEditing="false"
          />

          <DxColumn
            data-field="donGia"
            caption="Cập nhật đơn giá nhân công trực tiếp (VNĐ)"
            format="fixedpoint"
            :width="150"
            :visible="capnhatdongia"
          />
        </DxDataGrid>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxScrolling,
  DxSorting,
  DxEditing,
  DxExport,
  DxButton,
  DxColumn,
  DxLoadPanel,
  DxGroupPanel,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupItem,
  DxSummary,
} from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import {
  showNotifySuccess,
  showNotifyError,
  showNotifyValidate,
  formatDateISO,
  thangs,
  nams,
} from "../ultils";
import moment from "moment";
import DateBox from '../components/commons/DateBox'
import DialogSelectDate from "components/commons/DialogSelectFromDateToDate";
export default {
  data() {
    return {
      showChooseDate: false,
      dataSource: [],
      allDepartment: false,
      allDepartmentTH: false,
      allDepartmentYS1: false,
      allDepartmentTB: false,
      allDepartmentQM: false,
      allDepartmentCBG: false,
      isExcel: false,
      capnhatdongia: false,
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      isApprove: false,
      isReject: false,
      idDepartment: null,
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          id: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          id: 102340,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          id: 102366,
          code: "TB",
        },
      ],
      fromDate: moment().subtract(30, "days"),
      toDate: moment(),
      showVolumnColumn: true,
      departments: [],
      chonCongDoans: [],
      chonCongDoansTH: [],
      chonCongDoansYS1: [],
      chonCongDoansTB: [],
      chonCongDoansCBG: [],
      listGroupDepartment: [],
      dulieu: [],
      date:'',
      chonFactoryId: null,
    };
  },
  components: {
    DxDataGrid,
    DxScrolling,
    DxSorting,
    DxColumn,
    DateBox,
    DxEditing,
    DxExport,
    DxButton,
    DxLoadPanel,
    DxGroupPanel,
    DxColumnChooser,
    DxHeaderFilter,
    DialogSelectDate,
    DxGroupItem,
    DxSummary,
  },
  methods: {
    ...mapActions("prod", [
      "getGiaoNhan",
      "getDepartmentByFactoryId",
      "getPermissionInScreen",
      "getDepartmentByFactoryId",
      "getGroupDepartment",
      "getListGroupDepartment",
    ]),
     chonNgay(e){
        this.date= e.value
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
    customizeColumns(columns) {
      columns[0].width = 70;
    },
    async selectAll() {
      this.open = 1;
      if (this.allDepartmentCBG) {
        this.listGroupDepartment.forEach((el) => {
          if (this.idDepartment.id == 102299) this.chonCongDoansCBG.push(el.NAME);
        });
      } else this.chonCongDoansCBG = [];
      if (this.allDepartmentYS1) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 102340) this.chonCongDoansYS1.push(el.ID);
        });
      } else this.chonCongDoansYS1 = [];
      if (this.allDepartmentTB) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 102366) this.chonCongDoansTB.push(el.ID);
        });
      } else this.chonCongDoansTB = [];
      if (this.allDepartmentQM) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 102427) this.chonCongDoansQM.push(el.ID);
        });
      } else this.chonCongDoansQM = [];
      if (this.allDepartmentTH) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 100000) this.chonCongDoansTH.push(el.ID);
        });
      } else {
        this.chonCongDoansTH = [];
      }
    },
    async capnhat() {
      let nhapgia = [];
      this.dataSourceFilter.forEach((d) => {
        if (d.donGia > 0) nhapgia.push(d);
      });
      this.dulieu = nhapgia;
      console.log("dữ liệu:", this.dulieu[0].donGia);
if (this.date) {
      const payload = {
        factoryId: this.idDepartment.id,
        createBy: this.$store.state.base.userInfo.id,
        dataDelai: this.dulieu,
        ngayapdung:formatDateISO(this.date),
      };
      const data = await this.$store.dispatch("prod/nhapdongia", payload);

      if (data.meta.success) {
        showNotifySuccess();
        // this.$router.push("/bang-xuat-go/");
        this.loadData();
        this.dataSourceFilter;
      } else {
        showNotifyError();
      }
} else   
this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">chọn ngày áp dụng cho giá! </span>`,
          persistent: true,
        });
    },
    async rowUpdating(e) {
      const regex = /^[0-9.]+$/;
      const { newData, oldData } = e;
      if (!regex.test(newData.donGia)) {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng nhập số ! </span>`,
          persistent: true,
        });
        newData.donGia = null;
      }
    },
    async loadDepartment() {
      let data = await this.getGroupDepartment();
      data = data.filter((d) => d.factoryId == this.idDepartment.id);
      this.allDepartment = false;
      this.chonCongDoans = [];
      this.departments = data;
      this.loadData();
    },
    async loadData() {
      let factoryIdgia = this.idDepartment.id
      if (this.idDepartment.id == 102340) factoryIdgia = 100004
       if (this.idDepartment.id == 102366) factoryIdgia = 100005
      this.dataSource = await this.getGiaoNhan({
        fromDate: moment(this.fromDate).format().slice(0, 10),
        toDate: moment(this.toDate).add(1, "days").format().slice(0, 10),
        factoryId:factoryIdgia,
      });
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
      if (this.isUpdate) this.capnhatdongia = true;
    },

    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadData();
    },
  },
  computed: {
    ...mapGetters("base", ["congDoans", "myFactoryInfor", "userInfo"]),
    dataSourceFilter() {
        console.log("chonCongDoansYS1", this.chonCongDoansYS1);
        console.log("dataSource", this.dataSource.filter((i) =>
          this.chonCongDoansYS1.includes(i.stepId)));
      if(this.idDepartment){
        if (this.idDepartment.id == 100000)
        return this.dataSource.filter((i) =>
          this.chonCongDoansTH.includes(i.stepId)
        );
      if (this.idDepartment.id == 102340)
        return this.dataSource.filter((i) =>
          this.chonCongDoansYS1.includes(i.stepId)
        );
      if (this.idDepartment.id == 102366)
        return this.dataSource.filter((i) =>
          this.chonCongDoansTB.includes(i.stepId)
        );
      if (this.idDepartment.id == 102299)
        return this.dataSource.filter((i) =>
          this.chonCongDoansCBG.includes(i.groupDepartment)
        );
      }
        

    },
  },
  created() {
    this.chonFactoryId = 100000;
    this.loadPermission();
    this.loadListGroupDepartment();
   // this.loadData();

  },
};
</script>

<style>
#gridContainer {
  height: 800px;
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
</style>
