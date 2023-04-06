<template>
  <q-page padding>
    <q-banner class="bg-blue-grey text-orange">
      <div class="row">
        <div class="col-6 text-h6 orange">
          <div color="orange" style="padding-top:10px">Báo cáo sản lượng theo năm</div>
        </div>
        <div class="col-5"></div>
      <div class="col-1 bg-blue-grey-2" >
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
      </div>
      
    </q-banner>
    <q-card>
      <q-card-section>
        
        <div class="text-positive row bg-blue-grey-2" style="padding: 15px 0 15px 0;">
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
              style="border-radius: 5px;"
              class="text-weight-bold"
              :class="{active : idDepartment == congDoan}"
              color="orange"
            />
          </div>
        </div>
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
              v-if="idDepartment.id == 102427"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #f6b024; font-weight: bold"
              v-model="allDepartmentQM"
              label="Chọn tất cả công đoạn"
            />
            <q-checkbox
              v-if="idDepartment.id == 102340"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #f6b024; font-weight: bold"
              v-model="allDepartmentYS1B"
              label="Chọn tất cả công đoạn"
            />
            <q-checkbox
              v-if="idDepartment.id == 102366"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #f6b024; font-weight: bold"
              v-model="allDepartmentTB"
              label="Chọn tất cả công đoạn"
            />
          </div>
          <div class="col-6">
            <q-radio
              v-if="idDepartment"
              style="color: #21ba45; font-weight: bold"
              @input="loadData"
              v-model="type"
              val="sl"
              label="SL"
            />
            <q-radio
              v-if="idDepartment"
              style="color: #21ba45; font-weight: bold"
              @input="loadData"
              v-model="type"
              val="m3"
              label="M³"
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
              v-if="
                congDoan.value != 102484 &&
                congDoan.id != 102490 &&
                congDoan.factoryId == 100000
              "
              dense
              v-model="chonCongDoansTH"
              @input="loadData"
              :val="congDoan.id"
              :label="congDoan.name"
              color="teal"
            />
            <q-checkbox
              v-if="
                congDoan.value != 102484 &&
                congDoan.id != 102490 &&
                congDoan.factoryId == 102427
              "
              dense
              v-model="chonCongDoansQM"
              @input="loadData"
              :val="congDoan.id"
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
              @input="loadData"
              :val="congDoan.id"
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
              @input="loadData"
              :val="congDoan.id"
              :label="congDoan.name"
              color="teal"
            />
          </div>
        </div>
        <hr v-if="idDepartment" />
      </q-card-section>
      <q-card-section>
        <div class="col col-md-6 text-right"></div>
        <div class="col-12" align="right">
          <q-btn
            class="col-1 q-ml-sm text-orange"
            style="height: 20px; font-size: 10px"
            color="teal"
            outlined
            label="Xuất Excel"
            @click="xuat"
          />
          <div style="margin-top: 5px" v-html="table"></div>
        </div>
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
import XLSX from "xlsx";
export default {
  data() {
    return {
      dataSource: [],
      showVolumnColumn: true,
      year: moment().year(),
      chonCongDoans: [],
      table: "",
      dulieu: [],
      type: "sl",
      chonFactoryId: null,
      allDepartmentTH: false,
      allDepartmentQM: false,
      allDepartmentYS1B: false,
      allDepartmentTB: false,
      chonCongDoansTH: [],
      chonCongDoansQM: [],
      chonCongDoansYS1B: [],
      chonCongDoansTB: [],
      departments: [],
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
        //   {
        //   label: "Nhà máy CBG Quang Minh",
        //   id: 102427,
        //    code: "QM",
        // },
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
    DxExport,
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
      "getSLTheoNamSL",
      "getSLTheoNamM3",
    ]),
    async html_table_to_excel(type) {
      var data = document.getElementById("employee_data");

      var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });

      XLSX.write(file, { bookType: type, bookSST: true, type: "base64" });

      XLSX.writeFile(
        file,
        `BCSL_${this.idDepartment.label}_${this.year}.` + type
      );
    },
    xuat() {
      this.html_table_to_excel("xlsx");
    },
    drawTable() {
      let data = [];
      if (this.idDepartment) {
        if (this.idDepartment.id == 100000)
          data = this.dataSource.filter((i) =>
            this.chonCongDoansTH.includes(i.departmentId)
          );
        if (this.idDepartment.id == 102427)
          data = this.dataSource.filter((i) =>
            this.chonCongDoansQM.includes(i.departmentId)
          );
        if (this.idDepartment.id == 102340)
          data = this.dataSource.filter((i) =>
            this.chonCongDoansYS1B.includes(i.departmentId)
          );
        if (this.idDepartment.id == 102366)
          data = this.dataSource.filter((i) =>
            this.chonCongDoansTB.includes(i.departmentId)
          );
      }
      this.table = `
        <table id="employee_data">
          <tr>
            <th class="colorHeader" style="width:1px"></th>
            <th class="colorHeader" style="width:1px"></th>
            <th class="colorHeader">Tên</th>
            <th class="colorHeader">Tháng 1</th>
            <th class="colorHeader">Tháng 2</th>
            <th class="colorHeader">Tháng 3</th>
            <th class="colorHeader">Tháng 4</th>
            <th class="colorHeader">Tháng 5</th>
            <th class="colorHeader">Tháng 6</th>
            <th class="colorHeader">Tháng 7</th>
            <th class="colorHeader">Tháng 8</th>
            <th class="colorHeader">Tháng 9</th>
            <th class="colorHeader">Tháng 10</th>
            <th class="colorHeader">Tháng 11</th>
            <th class="colorHeader">Tháng 12</th>
            <th class="colorHeader">Tổng SL</th>
          </tr>
      `;
      let listDepartment = this.uniqueDepartment(data);
      for (let d = 0; d < listDepartment.length; d++) {
        let department = listDepartment[d];
        let arrDepartment = data.filter(
          (d) => d.groupName == department.groupName
        );
        let arrParen = this.uniqueParen(arrDepartment);
        let listTo = this.uniqueTo(arrDepartment);
        let lengthDepartment =
          arrDepartment.length + arrParen.length + 2 + listTo.length;
        let totalDepartment = this.tinhTong(arrDepartment);
        this.table += `
      <tr>
        <td class="colorTotal" style="border-right:0px; vertical-align: text-top;border-right:0px" rowspan="${lengthDepartment}"></td>
        <td colspan="15" style="border-left:0px" class="right colorTotal"><span style="margin-right:10px;
        " class="text-green-10">${
          department.groupName
        }:</span> <span class="text-green-10"> ${totalDepartment.toLocaleString(
          "en-US"
        )}</span></td>
      `;
        for (let t = 0; t < listTo.length; t++) {
          let to = listTo[t];
          let arrTo = arrDepartment.filter(
            (d) => d.departmentId == to.departmentId
          );
          let arrParenTo = this.uniqueParen(arrTo);
          let lengthTo =
            data.filter((d) => d.departmentId == to.departmentId).length +
            arrParenTo.length;
          let totalTo = this.tinhTong(arrTo);
          this.table += `
          <tr>
          <td class="colorTotal" style="border-right:0px; vertical-align: text-top;" rowspan="${
            lengthTo + 1
          }"> </td> 
          <td colspan="14" style="border-left:0px;" class="right colorTotal text-green-10"><span style="margin-right:10px">${
            to.departmentName
          }:</span> <span class="text-green-10"> ${totalTo.toLocaleString(
            "en-US"
          )}</span></td>
          </tr>
          
        `;

          for (let p = 0; p < arrParenTo.length; p++) {
            let paren = arrParenTo[p];
            this.table += `
            <tr>
          <td class="colorMonth">${paren.paren}</td>
          <td class="colorMonth" colspan="13"></td>
          </tr>
          `;
            let arrItem = arrTo.filter((d) => d.paren == paren.paren);
            let i = 1;
            arrItem.forEach((el) => {
              this.table += `
            <tr>
            <td class="colorItem">${i}. <i>${el.NAME}</i></td>
            <td>${el.thang1 ? el.thang1.toLocaleString("en-US") : 0}</td>
            <td>${el.thang2 ? el.thang2.toLocaleString("en-US") : 0}</td>
            <td>${el.thang3 ? el.thang3.toLocaleString("en-US") : 0}</td>
            <td>${el.thang4 ? el.thang4.toLocaleString("en-US") : 0}</td>
            <td>${el.thang5 ? el.thang5.toLocaleString("en-US") : 0}</td>
            <td>${el.thang6 ? el.thang6.toLocaleString("en-US") : 0}</td>
            <td>${el.thang7 ? el.thang7.toLocaleString("en-US") : 0}</td>
            <td>${el.thang8 ? el.thang8.toLocaleString("en-US") : 0}</td>
            <td>${el.thang9 ? el.thang9.toLocaleString("en-US") : 0}</td>
            <td>${el.thang10 ? el.thang10.toLocaleString("en-US") : 0}</td>
            <td>${el.thang11 ? el.thang11.toLocaleString("en-US") : 0}</td>
            <td>${el.thang12 ? el.thang12.toLocaleString("en-US") : 0}</td>
            <td class="colorTotal">
            ${(
              el.thang1 +
              el.thang2 +
              el.thang3 +
              el.thang4 +
              el.thang5 +
              el.thang6 +
              el.thang7 +
              el.thang8 +
              el.thang9 +
              el.thang10 +
              el.thang11 +
              el.thang12
            ).toLocaleString("en-US")}
            </td>
            </tr>
            `;
              i = i + 1;
            });
          }
        }
      }
      this.table += `</table>`;
    },
    tinhTong(arr) {
      let total = 0;
      if (arr.length > 0) {
        arr.forEach((element) => {
          total +=
            element.thang1 +
            element.thang2 +
            element.thang3 +
            element.thang4 +
            element.thang5 +
            element.thang6 +
            element.thang7 +
            element.thang8 +
            element.thang9 +
            element.thang10 +
            element.thang11 +
            element.thang12;
        });
      }
      return total;
    },
    uniqueDepartment(arr) {
      var newArr = [];
      for (var i = 0; i < arr.length; i++) {
        let check = false;
        for (let j = 0; j < newArr.length; j++) {
          if (arr[i].groupName == newArr[j].groupName) {
            check = true;
          }
        }
        if (!check) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    uniqueParen(arr) {
      var newArr = [];
      for (var i = 0; i < arr.length; i++) {
        let check = false;
        for (let j = 0; j < newArr.length; j++) {
          if (
            arr[i].paren == newArr[j].paren &&
            arr[i].departmentId == newArr[j].departmentId
          ) {
            check = true;
          }
        }
        if (!check) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    uniqueTo(arr) {
      var newArr = [];
      for (var i = 0; i < arr.length; i++) {
        let check = false;
        for (let j = 0; j < newArr.length; j++) {
          if (arr[i].departmentId == newArr[j].departmentId) {
            check = true;
          }
        }
        if (!check) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    async changeDate() {
      await this.loadData();
      await this.loadDepartment();
    },
    async loadDepartment() {
      let data = await this.getDepartmentByFactoryId({
        factoryId: this.idDepartment.id,
      });
      data = data.data.filter((d) => d.type == "Tổ");
      this.departments = data.filter((d) => this.checkDepartment(d.id));
      this.chonCongDoans = [];
      this.allDepartment = false;
      this.drawTable();
    },
    checkDepartment(id) {
      let data = null;
      data = this.dataSource.find((s) => s.departmentId == id);
      if (data) {
        return true;
      } else {
        return false;
      }
    },
    async selectAll() {
      if (this.allDepartmentQM) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 102427) this.chonCongDoansQM.push(el.id);
        });
      } else this.chonCongDoansQM = [];
      if (this.allDepartmentYS1B) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 102340)
            this.chonCongDoansYS1B.push(el.id);
        });
      } else this.chonCongDoansYS1B = [];
      if (this.allDepartmentTB) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 102366) this.chonCongDoansTB.push(el.id);
        });
      } else this.chonCongDoansTB = [];
      if (this.allDepartmentTH) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 100000) this.chonCongDoansTH.push(el.id);
        });
      } else {
        this.chonCongDoansTH = [];
      }
      this.drawTable();
    },
    async loadData() {
      if (this.type == "sl") {
        this.dataSource = await this.getSLTheoNamSL({
          year: this.year,
        });
        this.drawTable();
      } else {
        this.dataSource = await this.getSLTheoNamM3({
          year: this.year,
        });
        this.loadDepartment();
        this.drawTable();
      }
    },
  },
};
</script>

<style>
table,
td,
th {
  border: 1px solid black;
  font-family: "Times New Roman", Times, serif;
}

table {
  width: 100%;
  border-collapse: collapse;
}
.center {
  text-align: center;
}
.right {
  text-align: right;
}
.colorHeader {
  background-color: #cfd8dc;
  color: black;
  padding: 10px 5px 10px 5px;
}
.colorMonth {
  background-color: #b7dee8;
  padding: 3px;
  font-size: 16px;
  font-weight: bold;
}
.colorItem {
  font-size: 15px;
}
.colorTotal {
  background-color: #e8eaf6;
  padding: 3px;
  font-size: 16px;
  font-weight: bold;
}
.active{
  color: #f6b024;
}
</style>