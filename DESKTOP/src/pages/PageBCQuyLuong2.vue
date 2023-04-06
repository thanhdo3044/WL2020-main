<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-5 text-blue text-bold" style="font-size: 18px">
          Báo cáo quỹ lương khối CBG - <span class="text-amber-14">{{ factoryName }}</span>
        </div>
         <div class="col-4" align="right">
     
          <q-radio style="font-weight: bold; padding-right: 40px" @input="loadData" color="amber-6" v-model="typeBC"
            val="tuan" label="Tuần" />
          <q-radio style="font-weight: bold; padding-right: 40px" color="amber-6" @input="loadData" v-model="typeBC"
            val="thang" label="Tháng" />
        
        </div>
        <div class="col-3 text-blue text-bold" align="right">
          <span v-if="typeBC == 'tuan'" style="font-size: 18px">Tuần: </span>
          <input v-if="typeBC == 'tuan'"
            class="text-amber-14"
            type="number"
            @input="loadData"
            v-model="tuan"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 60px;
            "
          />
          <span v-if="typeBC == 'thang'" style="font-size: 18px">Tháng: </span>
          <input
          v-if="typeBC == 'thang'"
            class="text-amber-14"
            type="number"
            @input="loadData"
            v-model="month"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 60px;
            "
          />
          <span
            class="text-blue text-bold"
            style="font-size: 18px; padding-right: 30px"
            >-</span
          >
          <span style="font-size: 18px">Năm: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="loadData"
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
                style="border-radius: 5px; font-size: 13px"
                class="text-weight-bold"
                color="amber-6"
              />
            </div>
          </div>
        </div>

        <div class="col-4" align="right">
           <q-checkbox
            v-model="isShow"
            color="amber-6"
            style="margin-right:30px"
            class="text-weight-bold text-blue"
            label="Mở rộng"
            dense
          />
          <q-checkbox
            v-model="isExcel"
            color="amber-6"
            class="text-weight-bold text-blue"
            label="Xuất Excel"
            dense
          />
        </div>
      </div>
      <div
        class="row"
        v-if="idDepartment"
        style="font-size: 12px; vertical-align: top"
      >
        <div class="col-12">
          <table class="table" style="border: 1px solid black; width: 100%">
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
                    v-if="idDepartment.id == 102299 && value.ORDER != 5"
                    @input="open = 1"
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
                    @input="open = 1"
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
                    @input="open = 1"
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
                    @input="open = 1"
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
                    @input="open = 1"
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
      </div>
      <DxDataGrid
        id="gridContainer"
        :customize-columns="customizeColumns"
        :data-source="dataSourceFilter"
        :word-wrap-enabled="true"
        :show-borders="true"
        :show-row-lines="true"
        :no-data-text="'Vui lòng chọn công đoạn'"
        :show-column-lines="true"
        @cell-prepared="onCellPrepared"
        @content-ready="onContentReady"
        @exporting="onExporting"
      >
        <DxExport
          :enabled="isExcel"
          :file-name="'Báo cáo quỹ lương khối CBG - ' + factoryName"
        />
        <!-- <DxSelection mode="multiple" /> -->
        <DxGroupPanel
            :visible="isExcel"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />

        <DxLoadPanel :enabled="false" />
        <DxHeaderFilter :visible="true"/>
        <DxScrolling mode="virtual" />
        <DxGrouping :auto-expand-all="isShow" />
        <DxSorting mode="none" />
        <DxColumn
          data-field="groupName"
          caption=""
          :group-index="0"
          sort-order="desc"
          :sort-index="0"
          group-cell-template="groupCellTemplate"
        />
        <template #groupCellTemplate="{ data }">
          <div style="font-weight: bold">{{ data.value.substring(2) }}</div>
        </template>
        <DxColumn
          data-field="departmentName2"
          caption=""
          :group-index="1"
          sort-order="desc"
          :sort-index="0"
          group-cell-template="groupCellTemplate2"
        />
        <template #groupCellTemplate2="{ data }">
          <div>{{ data.value }}</div>
        </template>
        <DxColumn
          data-field="paren"
          caption="Chọn sản phẩm"
          :group-index="2"
        />
        <DxColumn
          data-field="CODE"
          :width="150"
          caption="Mã số"
          alignment="center"
        />
        <DxColumn
          data-field="NAME"
          :width="300"
          caption="Tên"
        />
        <DxColumn
          data-field="HEIGHT"
          caption="Dày"
          :width="60"
          alignment="center"
        />
        <DxColumn
          data-field="WIDTH"
          caption="Rộng"
          :width="60"
          alignment="center"
        />
        <DxColumn
          data-field="LENGTH"
          caption="Dài"
          :width="60"
          alignment="center"
        />
        <DxColumn
          data-field="chungloai"
          caption="Chủng loại"
          format="fixedpoint"
          :width="110"
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
              data-type="number"
              format="#,##0.####"
              :width="100"
              alignment="center"
            >
            </DxColumn>
          </DxColumn>
        <DxColumn
          :width="100"
          data-field="total"
          caption="Tổng (M³)"
          format="#,##0.##"
        />
        <DxColumn
            :width="80"
            data-field="loi"
            caption="Lỗi (M³)"
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
          format="#,##0.##"
        />
        <DxColumn
          :width="120"
          data-field="thanhtien"
          caption="Quỹ lương"
          format="###,###,##0"
          alignment="right"
      
        />
        <DxSummary>
          <DxGroupItem
            column="total"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.##'"
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
            column="loi"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.##'"
          />
          <DxGroupItem
            column="tongcong"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.##'"
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
  DxGrouping,
  DxLoadPanel,
  DxFilterPanel,
  DxLookup,
  DxGroupPanel,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupItem,
  DxSummary,
} from "devextreme-vue/data-grid";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN,roundNumber } from "../ultils";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from "devextreme/exporter/exceljs/excelExporter";
export default {
  data() {
    return {
      dataSource: [],
      showVolumnColumn: true,
      year: moment().year(),
      month: moment().month() + 1,
      tuan:moment().week(),
       typeBC: "thang",
      listWeek: [],
      isExcel: false,
      open: 0,
      isShow: false,
      chonCongDoans: [],
      allDepartment: false,
      allDepartmentTH: false,
      allDepartmentYS1: false,
      allDepartmentTB: false,
      allDepartmentQM: false,
      allDepartmentCBG: false,
      chonCongDoansTH: [],
      chonCongDoansYS1: [],
      chonCongDoansTB: [],
      chonCongDoansQM: [],
      chonCongDoansCBG: [],
      listGroupDepartment: [],
      dulieu: [],
      chonFactoryId: null,
      departments: [],
      factoryName: "",
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
        // {
        //   label: "Nhà máy CBG Quang Minh",
        //   id: 102427,
        // },
        {
          label: "Khối Chế biến gỗ",
          id: 102299,
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
    DxGrouping,
    DxEditing,
    DxButton,
    DxLoadPanel,
    DxFilterPanel,
    DxGroupPanel,
    DxColumnChooser,
    DxHeaderFilter,
    DxGroupItem,
    DxSummary,
  },
  created() {
   // this.loadData();
    this.loadListGroupDepartment();
  },
  methods: {
    ...mapActions("prod", [
      "getDepartmentByFactoryId",
      "getKlQuyLuong",
      "getKlQuyLuongLuaPhoiOD",
      "getKlQuyLuongLuaPhoiX5",
      "getKlQuyLuongSayPhoi",
      "getGroupDepartment",
      "getListGroupDepartment",
    ]),
          onExporting(e) {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Employees');

      exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: false,
  
        customizeCell: ({ gridCell, excelCell }) => {
        //  console.log('dl:',gridCell)
       if (gridCell.rowType === 'group') {
            excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BEDFE6' } };
          //   excelCell.alignment = { horizontal: 'center' };
          }
          if (gridCell.rowType === 'totalFooter' ) {
            excelCell.font.italic = true;
          }
            if (gridCell.column.dataType === 'number' && (excelCell.value>= 0 || excelCell.value<0 )) {
              // console.log('dl:',gridCell.column)
              excelCell.value = roundNumber(excelCell.value,2);
                  excelCell.alignment = { horizontal: 'center' };
             }
            if (gridCell.column.dataField === 'total' && (excelCell.value>= 0 || excelCell.value<0 )) {
              excelCell.value = roundNumber(excelCell.value,2);
                  excelCell.alignment = { horizontal: 'right' };
             }
              if (gridCell.column.dataField === 'thanhtien' && (excelCell.value>= 0 || excelCell.value<0 )) {
              excelCell.value = roundNumber(excelCell.value,0);
                  excelCell.alignment = { horizontal: 'right' };
             }
                if (gridCell.rowType === 'group' && gridCell.column.dataField === 'thanhtien'){
                 if (excelCell.value)
                 excelCell.value = parseInt(excelCell.value.replace(/,/g,''))
                }
        },
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'quyluong.xlsx');
        });
      });
      e.cancel = true;
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
    onContentReady(e) {
      if (this.open == 1) {
        if (this.idDepartment.id == 102299) {
          e.component.expandAll(0);
          this.open = 0;
        } else {
          e.component.expandAll(0);
          e.component.expandAll(1);
          this.open = 0;
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
    calculateTong(rowData) {
      rowData.tong = rowData.week + rowData.NHAP - rowData.XUAT;
      return rowData.tong;
    },
    changeDate() {
      this.loadData();
    },
    async loadDepartment() {
      this.factoryName = this.idDepartment.label;
      let data = await this.getGroupDepartment();
      data = data.filter((d) => d.factoryId == this.idDepartment.id);
      this.allDepartment = false;
      this.chonCongDoans = [];
      this.departments = data;
      this.loadData()
    },
    checkDepartment(ID) {
      let data = null;
      data = this.dataSource.find((s) => s.departmentId == ID);
      if (data) {
        return true;
      } else {
        return false;
      }
    },
    async selectAll() {
      this.open = 1;
      if (this.allDepartmentCBG) {
        this.listGroupDepartment.forEach((el) => {
          if (this.idDepartment.id == 102299)
            this.chonCongDoansCBG.push(el.NAME);
        });
      } else this.chonCongDoansCBG = [];
      if (this.allDepartmentYS1) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 102340)
            this.chonCongDoansYS1.push(el.ID);
        });
      } else this.chonCongDoansYS1 = [];
      if (this.allDepartmentTB) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 102366)
            this.chonCongDoansTB.push(el.ID);
        });
      } else this.chonCongDoansTB = [];
      if (this.allDepartmentQM) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 102427)
            this.chonCongDoansQM.push(el.ID);
        });
      } else this.chonCongDoansQM = [];
      if (this.allDepartmentTH) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 100000)
            this.chonCongDoansTH.push(el.ID);
        });
      } else {
        this.chonCongDoansTH = [];
      }
    },
    async loadData() {
      this.dataSource  = [];
    
      if (this.typeBC == 'thang') {
      let date = new Date(this.year, this.month - 1, 1);
      let start = moment(date).startOf("month").format("YYYY-MM-DD 00:00");
      let end = moment(date).endOf("month").format("YYYY-MM-DD 23:59");
      let weekStart = moment(start).week();
      let weekStartend = moment(end).week();
      if (this.month == 1) weekStart = 1;
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
        factoryId:this.idDepartment.id,
      };
      let data1 = await this.getKlQuyLuong(payload);
     let data2 = await this.getKlQuyLuongLuaPhoiX5(payload);
     let data3 = await this.getKlQuyLuongLuaPhoiOD(payload);
      let data4 = await this.getKlQuyLuongSayPhoi(payload);
      this.dataSource = [...data1,...data2,...data3,...data4];
      } else {
      let date = new Date(this.year, 0, 1);
      date.setDate(date.getDate()+7*this.tuan)
      let start = moment(date).startOf("week").format("YYYY-MM-DD 00:00");
      let end = moment(date).endOf("week").format("YYYY-MM-DD 23:59");
      let weekStart = moment(start).week();
      let weekStartend = moment(end).week();
      console.log('ngay dau:',start)
            console.log('ngay dau:',end)
      if (this.month == 1) weekStart = 1;
      let strWeek = "";
      this.listWeek = [];
      for (let i = weekStartend; i <= weekStartend; i++) {
        strWeek = `[week${i}],`;
        this.listWeek.push(i);
      }

      strWeek = strWeek.substring(0, strWeek.length - 1);
      
      const payload = {
        fromDate: start,
        toDate: end,
        strWeek: strWeek,
        factoryId:this.idDepartment.id,
      };
      let data1 = await this.getKlQuyLuong(payload);
     let data2 = await this.getKlQuyLuongLuaPhoiX5(payload);
     let data3 = await this.getKlQuyLuongLuaPhoiOD(payload);
      let data4 = await this.getKlQuyLuongSayPhoi(payload);
      this.dataSource = [...data1,...data2,...data3,...data4];
    }
    },
  },
  computed: {
    ...mapGetters("base", ["congDoans", "myFactoryInfor"]),
    // dataSourceFilter() {
    //   return this.dataSource.filter((i) =>
    //     this.chonCongDoans.includes(i.departmentId)
    //   );
    // },
    dataSourceFilter() {
      if (this.idDepartment) {
        if (this.idDepartment.id == 100000)
          return this.dataSource.filter((i) =>
            this.chonCongDoansTH.includes(i.departmentId)
          );
        if (this.idDepartment.id == 102340)
          return this.dataSource.filter((i) =>
            this.chonCongDoansYS1.includes(i.departmentId)
          );
        if (this.idDepartment.id == 102366)
          return this.dataSource.filter((i) =>
            this.chonCongDoansTB.includes(i.departmentId)
          );
        if (this.idDepartment.id == 102427)
          return this.dataSource.filter((i) =>
            this.chonCongDoansQM.includes(i.departmentId)
          );
        if (this.idDepartment.id == 102299)
          return this.dataSource.filter((i) =>
            this.chonCongDoansCBG.includes(i.groupDepartment)
          );
      }
    },
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
    margin-left:-100px;
    color: #ffc107;
    font-weight: bold;
    background-color: white;
}
</style>