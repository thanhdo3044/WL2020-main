<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-blue-grey">
        <div class="row">
          <div class="col-6 top-title text-orange">
            Nhận sản lượng về Thuận Hưng - {{ factory ? factory.label : ''  }}
          </div>
          <div
            class="col-6 top-title text-orange cursor-pointer"
            align="right"
            @click="showChooseDate = true"
          >
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
          </div>
        </div>
      </q-card-section>
      <q-separator inset />
      <div style="padding: 5px">
        <div class="text-positive row bg-blue-grey-2" style="padding: 15px 0 15px 0;">
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
              style="border-radius: 5px;"
              class="text-weight-bold"
              :class="{active : factory == congDoan}"
              color="orange"
            />
          </div>
        </div>
        <div class="row" v-if="factory">
          <div class="col-2 col-md-2">
            <q-checkbox
              v-if="factory.factoryId == 100000"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #f6b024; font-weight: bold"
              v-model="allDepartmentTH"
              label="Chọn tất cả công đoạn"
            />
            <q-checkbox
              v-if="factory.factoryId == 102339"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #f6b024; font-weight: bold"
              v-model="allDepartmentYS"
              label="Chọn tất cả công đoạn"
            />
            <q-checkbox
              v-if="factory.factoryId == 102340"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #f6b024; font-weight: bold"
              v-model="allDepartmentYS1B"
              label="Chọn tất cả công đoạn"
            />
            <q-checkbox
              v-if="factory.factoryId == 102366"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #f6b024; font-weight: bold"
              v-model="allDepartmentTB"
              label="Chọn tất cả công đoạn"
            />
          </div>
        </div>
        <hr v-if="factory" />
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
                congDoan.factoryId == 100000
              "
              dense
              v-model="chonCongDoansTH"
              :val="congDoan.name"
              :label="congDoan.name"
              color="teal"
            />
            <q-checkbox
              v-if="
                congDoan.value != 102484 &&
                congDoan.id != 102490 &&
                congDoan.factoryId == 102339
              "
              dense
              v-model="chonCongDoansYS"
              :val="congDoan.name"
              :label="congDoan.name"
              color="teal"
            />
            <q-checkbox
              v-if="
                congDoan.value != 102484 &&
                congDoan.id != 102490 &&
                congDoan.factoryId == 102340
              "
              dense
              v-model="chonCongDoansYS1B"
              :val="congDoan.name"
              :label="congDoan.name"
              color="teal"
            />
            <q-checkbox
              v-if="
                congDoan.value != 102484 &&
                congDoan.id != 102490 &&
                congDoan.factoryId == 102366
              "
              dense
              v-model="chonCongDoansTB"
              :val="congDoan.name"
              :label="congDoan.name"
              color="teal"
            />
          </div>
        </div>
        <hr v-if="factory" />
        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
            id="gridContainer"
              :data-source="dataSource"
              :show-borders="true"
              key-expr="NAME"
              :show-row-lines="true"
              :word-wrap-enabled="true"
            >
            <!-- <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              /> -->
              <DxExport
        :enabled="true"
        :allow-export-selected-data="true"
      />
              <DxPaging :enabled="false"/>
              <DxScrolling column-rendering-mode="virtual"/>
              <DxHeaderFilter :visible="true" />
              <DxFilterRow :visible="true" />
              <DxColumn data-field="NAME" caption="Tên chi tiết" width="350" />
              <DxColumn caption="Quy cách" alignment="center">
                <DxColumn
                  data-field="HEIGHT"
                  caption="Dày"
                  alignment="center"
                />
                <DxColumn
                  data-field="WIDTH"
                  caption="Rộng"
                  alignment="center"
                />
                <DxColumn
                  data-field="LENGTH"
                  caption="Dài"
                  alignment="center"
                />
              </DxColumn>
              <DxColumn
              
                caption="YÊN SƠN 1"
                alignment="center"
                :visible="ys1a"
              >
              <DxColumn
                data-field="YS1A"
                caption="SL"
                alignment="center"
                :visible="ys1a"
              />
                 <DxColumn
                data-field="KLYS"
                caption="KL"
                alignment="center"
                format="#,##0.####"
                :visible="ys1a"
                :calculate-cell-value="khoiluongYS"
              />
              </DxColumn>
              <DxColumn
                caption="THÁI BÌNH"
                alignment="center"
               
              >
               <DxColumn
                data-field="TB"
                caption="SL"
                alignment="center"
                :visible="tb"
              />
                 <DxColumn
                data-field="KLTB"
                caption="KL"
                alignment="center"
                   format="#,##0.####"
               :visible="tb"
                :calculate-cell-value="khoiluong"
              />
              </DxColumn>
              <DxColumn
                caption="MUA NGOÀI"
                alignment="center"
               
              >
               <DxColumn
                data-field="MN"
                caption="SL"
                alignment="center"
                
              />
                 <DxColumn
                data-field="KLMN"
                caption="KL"
                alignment="center"
                   format="#,##0.####"
           
                :calculate-cell-value="khoiluongMN"
              />
              </DxColumn>
              <DxColumn
          
                caption="Tổng cộng"
                alignment="center"
            
              >
              <DxColumn
                data-field="tong"
                caption="SL"
                alignment="center"
                :calculate-cell-value="calculateTong"
              />
              <DxColumn
                data-field="KLT"
                caption="KL"
               format="#,##0.####"
                alignment="center"
                :calculate-cell-value="calculateKLTong"
              />
              </DxColumn>
              <DxColumn
                data-field="DEPARTMENT_NAME"
                caption="Công đoạn nhận"
                :group-index="0"
              />
              <DxSummary>
                <DxGroupItem
                :show-in-group-footer="false"
                :align-by-column="true"
                column="KLT"
                summary-type="sum"
                value-format="#,##0.####"
                display-format="{0} m³"
                />
               <DxGroupItem
                :show-in-group-footer="false"
                :align-by-column="true"
                column="KLYS"
                summary-type="sum"
                value-format="#,##0.####"
                display-format="{0} m³"
                />
                  <DxGroupItem
                :show-in-group-footer="false"
                :align-by-column="true"
                column="KLTB"
                summary-type="sum"
                value-format="#,##0.####"
                display-format="{0} m³"
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
import { mapGetters, mapActions } from "vuex";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import { getFisrtDayOfMonth, formatDateVN } from "../../../ultils";
import {
  DxDataGrid,
  DxFilterRow,
  DxHeaderFilter,
  DxSummary,
  DxColumn,
  DxGroupItem,
  DxGroupPanel,
  DxPaging,
  DxScrolling,
  DxExport
} from "devextreme-vue/data-grid";
import moment from "moment";
export default {
  components: {
    DialogSelectDate,
    DxFilterRow,
    DxSummary,
    DxGroupItem,
    DxHeaderFilter,
    DxDataGrid,
    DxColumn,
    DxGroupPanel,
    DxPaging,
    DxScrolling,
    DxExport
  },
  data() {
    return {
      factory: null,
      options: [
        {
          factoryId: 100000,
          label: "Nhà máy CBG Thuận Hưng",
        },
        {
          factoryId: 102340,
          label: "Nhà máy CBG Yên Sơn 1",
        },
        {
          factoryId: 102366,
          label: "Nhà máy CBG Thái Bình",
        },
      ],
      
       dataSource1: [],
      chonCongDoans: [],
      departments: [],
      allDepartmentTH: false,
      allDepartmentYS: false,
      allDepartmentYS1B: false,
      allDepartmentTB: false,
      chonCongDoansTH: [],
      chonCongDoansYS: [],
      chonCongDoansYS1B: [],
      chonCongDoansTB: [],
      ys1a:true,
      ys1b:true,
      tb:true,
       NM:100000,
      showChooseDate: false,
      fromDate: null,
      toDate: null,
     
     
    };
  },
 
  async created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load();
  },
  methods: {
    ...mapActions("production", ["GET_SAN_LUONG_TH"]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
     ...mapActions("prod", [
      "getDepartmentByFactoryId",
      "getSLTheoThangSL",
      "getSLTheoThangM3",
    ]),
    async selectAll() {
      if (this.allDepartmentYS) {
        this.departments.forEach((el) => {
          if (this.factory.factoryId == 102339) this.chonCongDoansYS.push(el.name);
        });
      } else this.chonCongDoansYS = [];
      if (this.allDepartmentYS1B) {
        this.departments.forEach((el) => {
          if (this.factory.factoryId == 102340) this.chonCongDoansYS1B.push(el.name);
        });
      } else this.chonCongDoansYS1B = [];
      if (this.allDepartmentTB) {
        this.departments.forEach((el) => {
          if (this.factory.factoryId == 102366) this.chonCongDoansTB.push(el.name);
        });
      } else this.chonCongDoansTB = [];
      if (this.allDepartmentTH) {
        this.departments.forEach((el) => {
          if (this.factory.factoryId == 100000) this.chonCongDoansTH.push(el.name);
        });
      } else {
        this.chonCongDoansTH = [];
      }
    },
    khoiluong(row) {
          row.KLTB = row.TB*row.VOLUMN
          return row.KLTB;
    },
      khoiluongYS(row) {
          row.KLYS = row.YS1A*row.VOLUMN
          return row.KLYS;
    },
    khoiluongMN(row) {
          row.KLMN = row.MN*row.VOLUMN
          return row.KLMN;
    },
       async loadDepartment() {
      let data = await this.getDepartmentByFactoryId({
        factoryId: this.factory.factoryId,
      });
      console.log("data", data);
      data = data.data.filter((d) => d.type == "Tổ" || d.id == 102488);
      // this.departments = data;
      this.departments = data.filter(d => this.checkDepartment(d.name));
      console.log("this.departments",this.departments);
      console.log("this.dataSource1 ",this.dataSource1);
      this.allDepartment = false;
      this.chonCongDoans = [];
      // await this.load(value.id);
      
    },
    checkDepartment(name){
      let data = null;
      data = this.dataSource1.find(s => s.DEPARTMENT_NAME == name);
      if(data){
        return true;
      }else{
        return false;
      }
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.load();
    },
    calculateTong(rowData) {
     if (this.NM == 100000)
      rowData.tong = rowData.YS1A + rowData.YS1B + rowData.TB + rowData.QM + rowData.MN;
if (this.NM == 102339)
      rowData.tong =  rowData.YS1B + rowData.TB + rowData.MN;
   if (this.NM == 102340)
      rowData.tong = rowData.YS1A + rowData.TB + rowData.MN;   
      if (this.NM == 102366)
      rowData.tong = rowData.YS1A + rowData.YS1B + rowData.MN;
      return rowData.tong;
    },
       calculateKLTong(rowData) {
     if (this.NM == 100000)
      rowData.KLT = (rowData.YS1A + rowData.YS1B + rowData.TB + rowData.MN)*rowData.VOLUMN;
if (this.NM == 102339)
      rowData.KLT =  (rowData.YS1B + rowData.TB + rowData.MN)*rowData.VOLUMN;
   if (this.NM == 102340)
      rowData.KLT = (rowData.YS1A + rowData.TB + rowData.MN)*rowData.VOLUMN;   
      if (this.NM == 102366)
      rowData.KLT = (rowData.YS1A + rowData.YS1B + rowData.MN)*rowData.VOLUMN;
      return rowData.KLT;
    },
    async onChange(value) {
      this.NM = null
      console.log('nha may:',value)
      if (value.factoryId == 100000)  { this.NM = 100000
       this.ys1a = true, this.ys1b = true,this.tb = true
      }
       if (value.factoryId == 100003) { 
         this.NM = 102339
         this.ys1a = false, this.ys1b = true,this.tb = true
       }
        if (value.factoryId == 100004) { this.NM = 102340
         this.ys1a = true, this.ys1b = false,this.tb = true
       }
         if (value.factoryId == 100005) { this.NM = 102366
          this.ys1a = true, this.ys1b = true,this.tb = false
       }
      this.load();
    },
    async load() {
      let payload = {
        fromDate: moment(this.fromDate).format().slice(0, 10),
        toDate: moment(this.toDate).format().slice(0, 10),
        NM:this.NM,
      };
      let data = await this.GET_SAN_LUONG_TH(payload);
      this.dataSource1 = data.data;
      this.loadDepartment();
      
    },
  },
   computed: {
     ...mapGetters("base", ["congDoans", "myFactoryInfor"]),
    ...mapGetters("prod", ["factories"]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
    dataSource() {
      if (this.factory) {
        if (this.factory.factoryId == 100000)
          return this.dataSource1.filter((i) =>
            this.chonCongDoansTH.includes(i.DEPARTMENT_NAME)
          );
        if (this.factory.factoryId == 102339)
          return this.dataSource1.filter((i) =>
            this.chonCongDoansYS.includes(i.DEPARTMENT_NAME)
          );
        if (this.factory.factoryId == 102340)
          return this.dataSource1.filter((i) =>
            this.chonCongDoansYS1B.includes(i.DEPARTMENT_NAME)
          );
        if (this.factory.factoryId == 102366)
          return this.dataSource1.filter((i) =>
            this.chonCongDoansTB.includes(i.DEPARTMENT_NAME)
          );
      }
    }
  },
};
</script>

<style>
#gridContainer {
    max-height: 800px;
}
.dx-datagrid-rowsview .dx-group-row.dx-row > td {
    font-weight: bold;
    color: black;
}
.active{
  color: #f6b024;
}
</style>