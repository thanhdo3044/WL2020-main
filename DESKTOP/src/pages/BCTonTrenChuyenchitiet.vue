<template>
  <q-page class="q-pa-sm">

      <div class="row" style="background-color: #daf8e1">
         <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo Nhập Xuất Tồn từng công đoạn sản xuất -
          {{ factory1 ? factory1.label : "" }}
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
  
    <q-card >
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
            @input="onChange"
            v-model="factory1"
            :val="congDoan"
            :label="congDoan.label"
            style="border-radius: 5px;"
              class="text-weight-bold"
              :class="{active : factory1 == congDoan}"
            color="amber-6"
          />
        </div>
      </div>
       </div>
       <div class="col-4" align="right">
            <!-- <q-checkbox
            v-model="isShow"
            color="amber-6"
            style="margin-right:30px"
            class="text-weight-bold text-blue"
            label="Mở rộng"
            dense
          /> -->
            <q-checkbox
              v-model="isExcel"
              color="amber-6"
              class="text-weight-bold text-blue"
              label="Xuất Excel"
              dense
            />
          </div>
        
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
          <div class="row">
            <div class="col-12">
        <DxDataGrid
          id="gridContainer"
          :data-source="dataSourceFilter"
          key-expr="itemId"
          :hover-state-enabled="true"
          :row-alternation-enabled="true"
          :selection="{ mode: 'single' }"
           @exporting="onExporting"
        >
          <DxColumnChooser :enabled="isExcel" />
          <DxHeaderFilter :visible="true" />
          <DxGroupPanel
            :visible="isExcel"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
          <DxScrolling mode="infinite" />
          <DxSorting mode="none" />
          <DxGrouping :auto-expand-all="true" />
          <!-- <DxEditing :allow-updating="true" mode="cell" /> -->
          <DxColumn
            data-field="stepId"
            caption="Công đoạn"
            :group-index="0"
            sort-order="desc"
            :sort-index="0"
          >
            <DxLookup
              :data-source="departments"
              display-expr="departmentName"
              value-expr="ID"
            />
          </DxColumn>
           <DxColumn
            data-field="itemId"
            caption="ID"
            width="80"
            :allowEditing="false"
          />
          <DxColumn
            data-field="chitiet"
            caption="SP/Chi tiết"
            width="250"
            :allowEditing="false"
          />
          <DxColumn
            data-field="market"
            caption="Sản phẩm"
            :group-index="1"
            :sort-index="1"
            sort-order="desc"
            :allowEditing="false"
          />
          <DxColumn caption="Qui Cách" alignment="center" :allowEditing="false">
            <DxColumn
              caption="Dầy"
              data-field="height"
              alignment="center"
                width="60"
              :allowEditing="false"
            />
            <DxColumn
              caption="Rộng"
              data-field="width"
              alignment="center"
              width="60"
              :allowEditing="false"
            />
            <DxColumn
              caption="Dài"
              data-field="length"
              alignment="center"
                width="60"
              :allowEditing="false"
            />
          </DxColumn>
      
          <DxColumn caption="Tồn đầu kỳ" alignment="center">
            <DxColumn
              data-field="tondk"
              caption="SL"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              format="#,##0.##"
            />
            <DxColumn
              data-field="tondkM"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              format="#,##0.##"
            />
          </DxColumn>
          <DxColumn caption="Nhập TH" alignment="center">
            <DxColumn
              data-field="nhapTH"
              caption="SL"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              format="#,##0.##"
            />
              <DxColumn
              data-field="nhapTHM"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              format="#,##0.##"
            />
          </DxColumn>
           <DxColumn caption="Nhập YS" alignment="center">
            <DxColumn
              data-field="nhapYS"
              caption="SL"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              format="#,##0.##"
            />
             <DxColumn
              data-field="nhapYSM"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              format="#,##0.##"
            />
           </DxColumn>
            <DxColumn caption="Nhập TB" alignment="center">
             <DxColumn
              data-field="nhapTB"
              caption="SL"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              format="#,##0.##"
            />
              <DxColumn
              data-field="nhapTBM"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              format="#,##0.##"
            />
            </DxColumn>
              <DxColumn caption="Nhập khác" alignment="center">
              <DxColumn
              data-field="nhapkhac"
              caption="SL"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              format="#,##0.##"
            />
             <DxColumn
              data-field="nhapkhacM"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              format="#,##0.##"
            />
          
          </DxColumn>
         
          <DxColumn caption="Xuất" alignment="center">
            <DxColumn
              data-field="xuat"
              caption="SL"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              format="#,##0.##"
            />
            <DxColumn
              data-field="xuatM"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              format="#,##0.##"
            />
          </DxColumn>
           <DxColumn caption="Lỗi" alignment="center">
            <DxColumn
              data-field="loi"
              caption="SL"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              format="#,##0.##"
            />
            <DxColumn
              data-field="loiM"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              format="#,##0.##"
            />
          </DxColumn>
          <!-- <DxColumn caption="Nhập KL tại tổ" alignment="center">
            <DxColumn
              data-field="nhapton"
              caption="Số lượng"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              format="#,##0"
            />
            <DxColumn
              data-field="nhaptonM"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              format="#,##0.###0"
            />
          </DxColumn> -->
          <DxColumn caption="Tồn cuối kỳ" alignment="center">
            <DxColumn
              data-field="tonck"
              caption="SL"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              format="#,##0.##"
             
            />

            <DxColumn
              data-field="tonckM"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              format="#,##0.##"
            
            />
          </DxColumn>
          <!-- <template #tonCuoiKy-cellTemplate="{ data }">
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
          </template> -->
          <DxSummary>
            <DxTotalItem
              column="name"
              summary-type="count"
              value-format="fixedpoint"
              display-format="Tổng cộng : "
            />
            <DxTotalItem
              column="nhapTHM"
              summary-type="sum"
              value-format="###0.##"
              display-format="{0}"
            />
            <DxTotalItem
              column="nhapYSM"
              summary-type="sum"
              value-format="###0.##"
              display-format="{0}"
            />
            <DxTotalItem
              column="xuatM"
              summary-type="sum"
              value-format="###0.##"
              display-format="{0}"
            />
            <DxTotalItem
              column="nhapTBM"
              summary-type="sum"
              value-format="###0.##"
              display-format="{0}"
            />
            <DxTotalItem
              column="tonckM"
              summary-type="sum"
              value-format="###0.##"
              display-format="{0}"
            />
            <DxTotalItem
              column="tondkM"
              summary-type="sum"
              value-format="###0.##"
              display-format="{0}"
            />
            <DxTotalItem
              column="nhapkhacM"
              summary-type="sum"
              value-format="###0.##"
              display-format="{0}"
            />
            <DxTotalItem
              column="loiM"
              summary-type="sum"
              value-format="###0.##"
              display-format="{0}"
            />
          </DxSummary>
          <DxExport
            :enabled="isExcel"
            :allow-export-selected-data="false"
          
          />
          <DxSearchPanel
            :visible="isExcel"
            :placeholder="'Tìm kiếm'"
            :width="400"
            align="center"
          />
        </DxDataGrid>
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
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from "devextreme/exporter/exceljs/excelExporter";
import { formatDateVN,roundNumber } from "../ultils";
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
  DxTotalItem,
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
    DxTotalItem,
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
      showVolumnColumn: false,
      factory1: false,
      allDepartment: false,
      allDepartmentTH: false,
      allDepartmentQM: false,
      allDepartmentYS1: false,
      allDepartmentTB: false,
      isExcel:false,
      data2: [],
      tocongdoan: [],
      departments: [],
      chonCongDoans: [],
      chonCongDoansTH: [],
      chonCongDoansYS: [],
      chonCongDoansYS1: [],
      chonCongDoansTB: [],
      chonCongDoansQM:[],
      stepId: null, // string,
      listGroupDepartment: [],
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
        //    code: "QM",
        // },
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
      if (this.factory1.factoryId == 102427)
        return this.tonPhois.filter((i) =>
          this.chonCongDoansQM.includes(i.stepId)
        );
      if (this.factory1.factoryId == 102340)
        return this.tonPhois.filter((i) =>
          this.chonCongDoansYS1.includes(i.stepId)
        );
      if (this.factory1.factoryId == 102366)
        return this.tonPhois.filter((i) =>
          this.chonCongDoansTB.includes(i.stepId)
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
    ...mapActions("keHoach", ["getTonsByStepIdchitiet"]),
    ...mapActions("base", ["getAllCongDoans"]),
    ...mapActions("prod", [
      "getPermissionInScreen",
      "getDepartmentByFactoryId",
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
        
       if (gridCell.rowType === 'group') {
            excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BEDFE6' } };
            excelCell.alignment = { horizontal: 'center' };
          }
          if (gridCell.rowType === 'totalFooter' && excelCell.value) {
            excelCell.font.italic = true;
          }
            if (gridCell.column.dataType === 'number' && (excelCell.value>= 0 || excelCell.value<0 )) {
               // console.log('dl:',gridCell.column)

              excelCell.value = roundNumber(excelCell.value,2);

           

           
            
             }
          
        },
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'nhapxuatton.xlsx');
        });
      });
      e.cancel = true;
    },
    async loadData() {
      let payload = {
        startDate: moment(this.fromDate).format("YYYY-MM-DD 05:00:00"),
        endDate: moment(this.toDate)
          .add(1, "day")
          .format("YYYY-MM-DD 05:59:59"),
        factoryId: this.userInfo.factoryId,
        stepId: 100000,
      };
      await this.getTonsByStepIdchitiet(payload);
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
      if (this.allDepartmentQM) {
        this.departments.forEach((el) => {
          if (this.factory1.factoryId == 102427)
            this.chonCongDoansQM.push(el.ID);
        });
      } else this.chonCongDoansYS = [];
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
    },
     async loadListGroupDepartment() {
      const data = await this.getListGroupDepartment();
      this.listGroupDepartment = data;
    },
    async onChange(value) {
      this.allDepartment = false;

     let data = await this.getGroupDepartment();
       data = data.filter((d) => d.factoryId == this.factory1.factoryId);
       console.log('cong doan:',data)
      // let congdoan = this.dsCongDoans
      //   .filter(
      //     (s) =>
      //       (s.id != 100264 &&
      //         s.id != 100274 &&
      //         s.id != 102347 &&
      //         s.id != 102370 &&
      //         s.id != 102789 &&
      //         s.id != 102809 &&
      //         s.type2 === "to" &&
      //         s.type == "Tổ") ||
      //       s.id == 102460 ||
      //       s.id == 102488 
      //   )
      //   .map((o) => ({
      //     label: o.name,
      //     value: o.id,
      //     description: `[${o.code}] ${o.name}`,
      //     icon: "mail",
      //     factoryId: o.factoryId,
      //   }));

      this.stepId = null;
     // this.data2 = congdoan;

      this.departments = data

      // this.loadData();
    },
    checkDepartment(id) {
      let data = null;
      data = this.tonPhois.find((s) => s.stepId == id);
      if (data) {
        return true;
      } else {
        return false;
      }
    },
  },
  async created() {
    this.loadData();
     this.loadListGroupDepartment();
    //  await this.getAllCongDoans({ factoryId:100000})
  },
  mounted() {},
};
</script>
<style>
#gridContainer {
  height: 700px;
}
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: rgb(0 0 0 / 87%);
  background-color: #f7f7f7;
  font-weight: 900;
}

.active{
  color: #f6b024;
}
</style>
