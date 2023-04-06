<template>
  <q-page>
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Nhập số công từng công đoạn
        </div>
      </div>
    </div>
    <q-card>
      <div class="row">
        <div class="col-6">
          <div class="row">
            <div
              style="margin-top: 15px"
              class="col-3 col-md-3"
              v-for="(congDoan, index) in options"
              :key="index"
            >
              <q-radio
                dense
                @input="changeFactory"
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
           <q-input
            v-show="capnhat"
          label="Định mức ngày công"
          class="col-2 col-md-1 q-pa-sm"
          label-color="orange"
          v-model="DM"
         
          type="number"
          filled
          dense
        />
        <q-input
          label="Tuần"
          class="col-1 col-md-1 q-pa-sm"
          label-color="orange"
          v-model.number="month"
          @input="changeDate"
          type="number"
          filled
          dense
        />
        <q-input
          label="Năm"
          class="col-1 col-md-1 q-pa-sm"
          label-color="orange"
          v-model.number="year"
          @input="changeDate"
          type="number"
          filled
          dense
        />

        <q-btn
          v-show="capnhat"
          class="col-1 q-ml-sm"
          style="height: 42px; margin-top: 8px; width: 120px"
          color="positive"
          outlined
          label="Cập nhật"
          @click="confirmphieu = true"
        />
        <q-btn
          v-show="(userInfo.id == 100400)"
          class="col-1 q-ml-sm"
          style="height: 42px; margin-top: 8px; width: 120px"
          color="negative"
          outlined
          label="Xóa"
          @click="removeTongCong"
        />
        <div
          style="margin-left: 40px"
          class="col-1 q-ml-sm large-12 medium-12 small-12 cell"
        >
          <label>
            <input
              v-show="capnhat"
              style="width: 150px"
              type="file"
              id="file"
              ref="file"
              @change="onChange"
              class="custom-file-input"
            />
          </label>
        </div>
      </div>
 
      <div id="updateTongCong" >
   <div   style="width: 70%" align = 'right'>
                <q-btn
                  class="col-1 q-ml-sm"
                  style="height: 20px; font-size: 10px"
                  color="amber"
                  outlined
                  label="Xuất Excel"
                  @click="xuat"
                />
   </div>    
        <table
        id="employee_data"
          class="table"
          style="width: 70%; border-collapse: collapse"
          border="1"
        >
          <tr>
            <th
              style="width: 70px; color: #071ff1; background-color: #daf8e1"
              rowspan="2"
            >
              Xưởng
            </th>
            <th
              style="width: 80px; color: #071ff1; background-color: #daf8e1"
              rowspan="2"
            >
              Tổ
            </th>
            <th
              style="width: 40px; color: #071ff1; background-color: #daf8e1"
              rowspan="2"
            >
              Công chính
            </th>

            <th style="color: #071ff1; background-color: #daf8e1" colspan="3">
              Số công làm thêm
            </th>
            <th style="color: #071ff1; background-color: #daf8e1" colspan="3">
              Số công làm ca 3
            </th>
            <th
              style="width: 40px; color: #071ff1; background-color: #daf8e1"
              rowspan="2"
            >
              Tổng công
            </th>
            <th
              style="width: 40px; color: #071ff1; background-color: #daf8e1"
              rowspan="2"
            >
              Tổng điểm
            </th>
              <th
              style="width: 40px; color: #071ff1; background-color: #daf8e1"
              rowspan="2"
            >
              Tỷ lệ số công làm thêm so với công chính
            </th>
          </tr>

          <tr>
            <th style="width: 40px; color: #071ff1; background-color: #daf8e1">
              <i>Ngày thường<br />(1.5)</i>
            </th>
            <th style="width: 40px; color: #071ff1; background-color: #daf8e1">
              <i>Ngày nghỉ<br />(2)</i>
            </th>
            <th style="width: 40px; color: #071ff1; background-color: #daf8e1">
              <i>Lễ/tết <br />(3)</i>
            </th>

            <th style="width: 40px; color: #071ff1; background-color: #daf8e1">
              <i>Ngày thường <br />(0.3)</i>
            </th>
            <th style="width: 40px; color: #071ff1; background-color: #daf8e1">
              <i>Ngày nghỉ<br />(0.7)</i>
            </th>
            <th style="width: 40px; color: #071ff1; background-color: #daf8e1">
              <i>Lễ/tết<br />(0.9)</i>
            </th>
          </tr>
          <tr>
            <td
              colspan="9"
              align="right"
              style="font-weight: 800; background: #bbdefb"
            >
              Tổng:
            </td>
            <td
              colspan="1"
              align="right"
              style="font-weight: 800; background: #bbdefb"
            >
              {{
                TONG_TONG_CONG.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })
              }}
            </td>
            <td
              colspan="1"
              align="right"
              style="font-weight: 800; background: #bbdefb"
            >
              {{
                TONG_TONG_DIEM.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })
              }}
            </td>
             <td
              colspan="1"
              align="right"
              style="font-weight: 800; background: #bbdefb"
            >
              {{
                tyle.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })
              }}%
            </td>
          </tr>
          <tr v-for="(struc, index) in dataSource" v-bind:key="struc.ID">
            <td
              v-for="xuong in xuongs"
              :key="xuong.i"
              v-if="xuong.i == index"
              :rowspan="xuong.len"
              style="font-weight: 800; padding-left: 10px; height: 40px"
              class="bg-blue-grey-1"
            >
              {{ struc.xuongName }}
            </td>
            <td
              style="font-weight: 800; padding-left: 10px; height: 40px"
              class="bg-blue-grey-1"
            >
              {{ struc.NAME }}
            </td>

            <td style="height: 40px;font-weight:bold">
              <div v-if="struc.HS1A > 0" align="center">
                {{
                  struc.HS1A.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                }}
              </div>

              <q-input
                dense
                borderless
                debounce="1000"
                v-else
                :readonly="insertcong"
                v-model="struc.HS1"
                @input="nhap1(struc)"
              ></q-input>
            </td>
            <td style="height: 40px;font-weight:bold" align="center">
              <div v-if="struc.HS15A > 0">
                {{
                  struc.HS15A.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
              <q-input
                dense
                borderless
                debounce="1000"
                v-else
                :readonly="insertcong"
                v-model="struc.HS15"
                @input="nhap15(struc)"
              ></q-input>
            </td>
            <td style="height: 40px;font-weight:bold" align="center">
              <div v-if="struc.HS2A > 0">
                {{
                  struc.HS2A.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
              <q-input
                dense
                borderless
                debounce="1000"
                v-else
                :readonly="insertcong"
                v-model="struc.HS2"
                @input="nhap2(struc)"
              ></q-input>
            </td>
            <td style="height: 40px;font-weight:bold" align="center">
              <div v-if="struc.HS3A > 0">
                {{
                  struc.HS3A.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
              <q-input
                dense
                borderless
                debounce="1000"
                v-else
                :readonly="insertcong"
                v-model="struc.HS3"
                @input="nhap3(struc)"
              ></q-input>
            </td>

            <td style="height: 40px;font-weight:bold" align="center">
              <div v-if="struc.NT03A > 0">
                {{
                  struc.NT03A.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
              <q-input
                dense
                borderless
                debounce="1000"
                v-else
                :readonly="insertcong"
                v-model="struc.NT03"
                @input="nhap03(struc)"
              ></q-input>
            </td>
            <td style="height: 40px;font-weight:bold" align="center">
              <div v-if="struc.NN07A > 0">
                {{
                  struc.NN07A.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
              <q-input
                dense
                borderless
                debounce="1000"
                v-else
                :readonly="insertcong"
                v-model="struc.NN07"
                @input="nhap07(struc)"
              ></q-input>
            </td>
            <td style="height: 40px;font-weight:bold" align="center">
              <!-- <q-input v-model="struc.NL09" dense /> -->
              <div v-if="struc.NL09A > 0">
                {{
                  struc.NL09A.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
              <q-input
                dense
                borderless
                debounce="1000"
                v-else
                :readonly="insertcong"
                v-model="struc.NL09"
                @input="nhap09(struc)"
              ></q-input>
            </td>
            <th style="text-align: left">
              <div align="right">
                {{
                  (struc.TONG_CONG =
                    struc.HS1 * 1 +
                    struc.HS15 * 1 +
                    struc.HS2 * 1 +
                    struc.HS3 * 1).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </th>
            <th style="text-align: left">
              <div align="right">
                {{
                  (struc.TONG_DIEM =
                    struc.HS1 * 1 +
                    struc.HS15 * 1.5 +
                    struc.HS2 * 2 +
                    struc.HS3 * 3 +
                    struc.NT03 * 0.3 +
                    struc.NN07 * 0.7 +
                    struc.NL09 * 0.9).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </th>
              <th style="text-align: left">
              <div align="right" v-if="struc.HS1 == null">
              0
              </div>
               <div align="right" v-else>
                {{
                  (struc.TY_LE =                 
                   100*(struc.HS15  +
                    struc.HS2  +
                    struc.HS3  +
                    struc.NT03  +
                    struc.NN07  +
                    struc.NL09)/struc.HS1 ).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                }}% 
              </div>
            </th>
          </tr>
        </table>
      </div>
    </q-card>
    <q-dialog v-model="confirmphieu" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title text-positive">
              Xác nhận cập nhập số công
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Hủy" color="orange" v-close-popup />
          <q-btn
            label="Đồng ý"
            @click="nhaptongcong"
            color="positive"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
  DxExport,
  DxLookup,
  DxGroupPanel,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupItem,
  DxSummary,
} from "devextreme-vue/data-grid";
import { showNotifySuccess, showNotifyError } from "../ultils";
import { mapActions, mapGetters } from "vuex";
import XLSX from "xlsx";
import moment from "moment";
export default {
  data() {
    return {
      dataSource: [],
      showVolumnColumn: true,
      year: moment().year(),
      month: moment().week(),
      listWeek: [],
      chonCongDoans: [],
      resultData: [],
      dulieu: [],
      confirmphieu: false,
      chonFactoryId: null,
      DM:0,
      idDepartment: null,
      capnhat: false,
      DM_NCLD: 0,
      insertcong: true,
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
      ],
    };
  },
  components: {
    DxDataGrid,
    DxScrolling,
    DxSorting,
    DxColumn,
    DxExport,
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
  
    this.loadPermission();
    this.idDepartment = this.options[0];
    if(this.idDepartment)
  if (this.idDepartment.id == 100000) 
   { this.DM = 260000 }
    else this.DM = 209000
    this.loadData();
  },
  methods: {
    ...mapActions("prod", [
      "getTongCongWithDepartment",
      "getTongCongByDepartment",
      "insertTongCong",
      "updateTongCong",
      "deleteTongCong",
      "getPermissionInScreen",
    ]),
     async html_table_to_excel(type) {
      var data = document.getElementById("employee_data");

      var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });

      XLSX.write(file, { bookType: type, bookSST: true, type: "base64" });

      XLSX.writeFile(
        file,
        `TONGCONG_${this.month}_${this.year}.` + type
      );
    },
    xuat() {
      this.html_table_to_excel("xlsx");
    },
    changeDate() {
      this.loadData();
    },
    changeFactory() {
       if (this.idDepartment.id == 100000) 
   { this.DM = 260000 }
    else this.DM = 209000
      this.loadData();
    },

    nhap1(e) {
      const regex = /^[0-9.]+$/;
      if (!regex.test(e.HS1)) {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng nhập số ! </span>`,
          persistent: true,
        });
        e.HS1 = "";
      }
    },

    nhap15(e) {
      const regex = /^[0-9.]+$/;
      if (!regex.test(e.HS15)) {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng nhập số ! </span>`,
          persistent: true,
        });
        e.HS15 = "";
      }
    },

    nhap2(e) {
      const regex = /^[0-9.]+$/;
      if (!regex.test(e.HS2)) {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng nhập số ! </span>`,
          persistent: true,
        });
        e.HS2 = "";
      }
    },

    nhap3(e) {
      const regex = /^[0-9.]+$/;
      if (!regex.test(e.HS3)) {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng nhập số ! </span>`,
          persistent: true,
        });
        e.HS3 = "";
      }
    },
    nhap03(e) {
      const regex = /^[0-9.]+$/;
      if (!regex.test(e.NT03)) {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng nhập số ! </span>`,
          persistent: true,
        });
        e.NT03 = "";
      }
    },
    nhap07(e) {
      const regex = /^[0-9.]+$/;
      if (!regex.test(e.NN07)) {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng nhập số ! </span>`,
          persistent: true,
        });
        e.NN07 = "";
      }
    },
    nhap09(e) {
      const regex = /^[0-9.]+$/;
      if (!regex.test(e.NL09)) {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng nhập số ! </span>`,
          persistent: true,
        });
        e.NL09 = "";
      }
    },
    fixdata(data) {
      var o = "",
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    async loadPermission() {
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
          this.capnhat = true;
          this.insertcong = false;
        }
        if (el.CODE == "update") {
          this.isUpdate = true;
        }
        if (el.CODE == "delete") {
          this.isDelete = true;
        }
      });
    },
    async onChange(e) {
      e.stopPropagation();
      e.preventDefault();

      var files, i, f;
      this.file = this.$refs.file.files[0];

      for (i = 0, f = this.file; i < 1; ++i) {
        var reader = new FileReader(),
          name = f.name;
        let results = [];
        this.resultData = [];
        reader.onload = async (e) => {
          let data = e.target.result,
            fixedData = await this.fixdata(data),
            workbook = XLSX.read(btoa(fixedData), {
              type: "base64",
              cellDates: true,
              dateNF: "dd/mm/yyyy",
            }),
            firstSheetName = workbook.SheetNames[0],
            worksheet = workbook.Sheets[firstSheetName];

          // this.state.headers = this.get_header_row(worksheet);

          results = XLSX.utils.sheet_to_json(worksheet, { raw: false });
          await results.forEach((e) => {
            let index = this.dataSource.findIndex(
              (d) => d.ID == parseInt(e.id)
            );
            if (
              this.dataSource[index].HS1 == null ||
              this.dataSource[index].HS2 == null ||
              this.dataSource[index].HS3 == null ||
              this.dataSource[index].HS15 == null ||
              this.dataSource[index].NL09 == null ||
              this.dataSource[index].NN07 == null ||
              this.dataSource[index].NT03 == null
            ) {
              this.dataSource[index].HS1 = e.hs1 ? e.hs1 : null;
              this.dataSource[index].HS2 = e.hs2 ? e.hs2 : null;
              this.dataSource[index].HS3 = e.hs3 ? e.hs3 : null;
              this.dataSource[index].HS15 = e.hs15 ? e.hs15 : null;
              this.dataSource[index].NL09 = e.nl09 ? e.nl09 : null;
              this.dataSource[index].NN07 = e.nn07 ? e.nn07 : null;
              this.dataSource[index].NT03 = e.nt03 ? e.nt03 : null;
            } else {
              this.$q.notify({
                message: "Đã tồn tại !",
                color: "red",
              });
            }
          });

          // this.state.tickets = results;
          this.file = "";
        };
        reader.readAsArrayBuffer(f);
      }
    },

    async loadData() {
      this.TONG_TONG_CONG = 0;
      this.TONG_TONG_DIEM = 0;
      this.congchinh = 0;
      this.tongtyle=0
      this.tyle = 0;
      this.dataSource = await this.getTongCongWithDepartment({
        factoryId: this.idDepartment.id,
        nam: this.year,
        thang: this.month,
      });
      this.xuongs = [];
      this.dataSource.forEach((el) => {
        if (this.xuongs.filter((d) => d.name == el.xuongName).length == 0) {
          let index = this.dataSource.findIndex(
            (f) => f.xuongName == el.xuongName
          );
          let length = this.dataSource.filter(
            (f) => f.xuongName == el.xuongName
          ).length;
          this.xuongs.push({ name: el.xuongName, i: index, len: length });
        }
      });
      this.dataSource.forEach((e) => {
        this.TONG_TONG_CONG += e.HS1 + e.HS15 + e.HS2 + e.HS3;
     this.tongtyle += e.HS15+e.HS2+e.HS3+e.NT03+e.NN07+e.NL09
     this.congchinh += e.HS1
        this.TONG_TONG_DIEM +=
          e.HS1 * 1 +
          e.HS15 * 1.5 +
          e.HS2 * 2 +
          e.HS3 * 3 +
          e.NT03 * 0.3 +
          e.NN07 * 0.7 +
          e.NL09 * 0.9;
      
      });
         if (this.congchinh)
           this.tyle = 100*this.tongtyle/this.congchinh 
    },
    async nhaptongcong() {
      let capvt = [];
      let Giatri = [];
      this.dataSource.forEach((d) => {
        if (d.TONG_DIEM > 0 && d.TONG_DIEM1 == null) {
          capvt.push(d);
        } else if (d.TONG_DIEM != d.TONG_DIEM1 && d.TONG_DIEM > d.TONG_DIEM1) {
          Giatri.push(d);
        }
      });

      this.dulieu = capvt;
      if (capvt.length != 0) {
        // if (this.idDepartment.id == 100000 || this.idDepartment.id == 102427)
        //   this.DM_NCLD = 242000;
        // else this.DM_NCLD = 194000;
        this.DM_NCLD = this.DM
        const data = await this.insertTongCong({
          factoryId: this.idDepartment.id,
          thang: this.month,
          nam: this.year,
          createdBy: this.userInfo.id,
          dataDelai: this.dulieu,
          DM_NCLD: this.DM_NCLD,
        });
        if (data.meta.success) {
          showNotifySuccess();
          this.loadData();
        } else {
          showNotifyError();
        }
      }

      this.dauvao = Giatri;
      if (Giatri.length != 0) {
        const data = await this.updateTongCong({
          factoryId: this.idDepartment.id,
          thang: this.month,
          nam: this.year,
          createdBy: this.userInfo.id,
          dataDelai: this.dauvao,
        });
        if (data.meta.success) {
          showNotifySuccess();
          this.loadData();
        } else {
          showNotifyError();
        }
      }
    },
    removeTongCong(){
      this.$q.dialog({
          html: true,
          title: 'Xác nhận',
          message: `Bạn có chắn chắn muốn xóa ?`,
          color: 'negative',
          ok: `Xác nhận`,
          cancel: true,
          default: 'Hủy'   // <<<<
        }).onOk(() =>
        {
          this.xoaTongCong();
        }
        )
    },
    async xoaTongCong() {
      const payload = {
        factoryId: this.idDepartment.id,
        thang: this.month,
        nam: this.year,
      };
      const data = await this.deleteTongCong(payload);
      if (data.meta.success) {
          showNotifySuccess();
          this.loadData();
        } else {
          showNotifyError();
        }
    },
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
};
</script>
<style lang="scss">
.custom-file-input::-webkit-file-upload-button {
  visibility: hidden;
}
.custom-file-input::before {
  content: "Import từ Excel";
  display: inline-block;
  background: linear-gradient(top, #f9f9f9, #e3e3e3);
  border: 1px solid #999;
  border-radius: 3px;
  padding: 7px 8px;
  -webkit-user-select: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 14pt;
  margin-top: 8px;
  background-color:#FFC107;
 color:white
}
.custom-file-input:hover::before {
  border-color: black;
}
.custom-file-input:active::before {
  background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
}
</style>
<style scoped>
table,
td,
th {
  border: 1px solid black;
  font-family: "Times New Roman", Times, serif;
}

table {
  width: 100%;
}
</style>
