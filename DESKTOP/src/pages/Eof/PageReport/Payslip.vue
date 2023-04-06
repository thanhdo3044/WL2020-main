 <template>
  <q-page>
    <q-banner class="bg-primary text-orange">
      <div class="text-h6 orange">
        <span color="orange">Thêm dữ liệu lỗi chấm công</span>
      </div>
    </q-banner>
    <div>
      <!-- <div class="q-pa-md" style="max-width: 300px">
        <div class="q-gutter-md">
          <q-select
            outlined
            v-model="factory"
            :options="options"
            :disabled="!disabled"
            @input="onSelectionChanged"
            label="Chọn phòng ban"
          />
        </div>
      </div> -->
      <div class="row q-ma-sm q-pa-sm">
        <div class="col-md-12">
          <div class="large-12 medium-12 small-12 cell">
            <label>
              <b>Vui lòng ấn chọn file cần tải lên :</b>
              <input
                class="q-ml-sm"
                type="file"
                id="file"
                ref="file"
                @change="onChange"
              />
            </label>
          </div>
        </div>
      </div>
      <div id="q-app">
        <div class="q-pa-md">
          <q-table
            class="my-sticky-header-column-table"
            title="Danh sách lỗi chấm công"
            :data="data[0]"
            :separator="separator"
            :columns="columns"
          >
            <template v-slot:top-right>
              <q-btn
                color="primary"
                icon-right="archive"
                label="Xuất dữ liệu "
                no-caps
                @click="exportTable"
              />
            </template>
          </q-table>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <q-btn
            v-show="!disable"
            class="float-right q-ma-md"
            color="primary"
            text-color="white"
            label="Thêm"
            @click="validate"
          />
        </div>
      </div>
    </div>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6"
            >Phát hiện dữ liệu phiếu lương trùng lặp !!</span
          >
          <span class="q-ml-sm text-h6">Bạn muốn tiếp tục ghi đè ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            color="primary"
            @click="onClick"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- <order-files></order-files> -->
  </q-page>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
// import crypto  from'crypto-js';
import { v4 as uuidv4 } from "uuid";
import SendMessage from "components/eof/Shared/SendMessage.vue";
import OrderHeader from "components/eof/Shared/OrderHeader.vue";
import OrderApproved from "components/eof/Shared/OrderApproved.vue";
import { Notify, Loading, QSpinnerIos } from "quasar";
import XLSX from "xlsx";
import moment from "moment";
import { exportFile } from "quasar";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

export default {
  data() {
    return {
      confirm: false,
      columns: [
        {
          name: "mvn",
          required: true,
          label: "Mã nhân viên",
          align: "left",
          field: (row) => row.mnv,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "LAST_NAME",
          align: "center",
          label: "Tên nhân viên",
          field: "ten",
          sortable: true,
        },
        {
          name: "ACCOUNT11",
          label: "Chức vụ",
          sortable: true,
          field: "chucVu",
        },
        { name: "STATUS12", label: "Bộ phận", field: "boPhan" },
        { name: "TIME13", label: "Công chính", field: "congChinh" },
        { name: "STATUS24", label: "Tiền công chính", field: "tienCongChinh" },
        { name: "TIME251", label: "LT 1.5", field: "lt15" },
        { name: "ACCOUNT6", label: "LT 2.0", sortable: true, field: "lt20" },
        { name: "STATUS291", label: "Làm thêm ca đêm NT", field: "ot1" },
        { name: "TIME212", label: "Làm thêm ca đêm NN", field: "ot2" },
        {
          name: "ACCOUNT23",
          label: "Làm thêm ca đêm NL",
          sortable: true,
          field: "ot3",
        },
        { name: "STATUS17", label: "Lễ", field: "le" },
        { name: "TIME18", label: "Tiền làm thêm", field: "tienLamThem" },
        { name: "STATUS29", label: "NT (0.3)", field: "nt" },
        { name: "TIME21", label: "NN (0.7)", field: "nn" },
        { name: "ACCOUNT2", label: "NL (0.9)", sortable: true, field: "nl" },
        { name: "STATUS13", label: "Tiền ca đêm", field: "tiencaDem" },
        { name: "TIME14", label: "Xếp ABC", field: "xepABC" },
        { name: "STATUS25", label: "Tiền thưởng ABC", field: "tienThuongABC" },
        { name: "TIME26", label: "Chỉ số KPI", field: "chiSoKPI" },
        {
          name: "ACCOUNT7",
          label: "Tiền thưởng HTCV",
          sortable: true,
          field: "HTCV",
        },
        // { name: "STATUS18", label: "Chỉ số KPI", field: "status1" },
        // { name: "TIME19", label: "Tiền thưởng HTCV", field: "timeIn" },
        { name: "STATUS21", label: "Phép", field: "phep" },
        { name: "TIME22", label: "Thành tiền lương phép", field: "luongPhep" },
        {
          name: "ACCOUNT3",
          label: "Tổng điểm",
          sortable: true,
          field: "tongDiem",
        },
        { name: "STATUS14", label: "TC làm", field: "tcLam" },
        { name: "TIME15", label: "Hệ số thâm viên", field: "thamNien" },
        { name: "STATUS26", label: "Hỗ trợ khác", field: "hoTroKhac" },
        { name: "TIME27", label: "PC TN/ATV/SCC/PCCC", field: "pc" },
        {
          name: "ACCOUNT8",
          label: "Điện thoại",
          sortable: true,
          field: "dienThoai",
        },
        { name: "STATUS19", label: "Thưởng HTCV 2", field: "HTCV2" },
        { name: "TIME11", label: "Hỗ trợ(Đi lại & Nhà ở)", field: "diLai" },
        { name: "STATUS112", label: "HỖ TRỢ BỔ SUNG", field: "htBoSung" },
        { name: "STATUS111", label: "TIỀN ĐÈN ĐỎ", field: "tienDenDo" },
        { name: "STATUS22", label: "Thưởng kinh doanh", field: "kinhDoanh" },
        { name: "STATUS2ư2", label: "Thưởng cống hiến", field: "congHien" },

        { name: "TIME23", label: "Thưởng năng suất", field: "nangSuat" },
        {
          name: "ACCOUNT4",
          label: "Khoán công tác phí",
          sortable: true,
          field: "ctp",
        },
        { name: "STATUS15", label: "Thưởng kiêm nhiệm", field: "kiemNhiem" },
        { name: "TIME16", label: "Thưởng chuyên cần", field: "chuyenCan" },
        { name: "STATUS2d7", label: "Số ngày nghỉ Lễ", field: "nghiLe" },
        { name: "STATUS2dd7", label: "Số phép còn tồn", field: "phepTon" },

        { name: "STATUS27", label: "Tiền lương lễ", field: "luongLe" },
        {
          name: "TIME28",
          label: "Chế độ bồi dưỡng bằng hiện vật theo ngày công",
          field: "boiDuong",
        },
        {
          name: "ACCOUNT9",
          label: "Tính trả 21.5% BH",
          sortable: true,
          field: "bh",
        },
        { name: "STATUS11", label: "Khoản tính bổ sung", field: "boSung" },
        //  { name: "STATUS111", label: "Lương ngừng việc", field: "NgungViec" },
        { name: "STATUS110", label: "Ghi chú", field: "khoi" },

        { name: "TIME12", label: "Thưởng bổ sung", field: "khoiLuong" },
        { name: "STATUS23", label: "Tổng TN tính trả", field: "tongTN" },
        { name: "TIME25", label: "Tiền BHXH 10.5%", field: "bhxh" },
        {
          name: "ACCOUNT41",
          label: "Trừ thuế TNCN",
          sortable: true,
          field: "thueTNCN",
        },
        { name: "STATUS16", label: "Trừ khác", field: "truKhac" },
        { name: "TIME17", label: "Tiền ăn", field: "tienAn" },
        { name: "STATUS28", label: "Tạm ứng lương", field: "ungLuong" },
        { name: "TIME29", label: "Tổng trừ", field: "tongTru" },
        {
          name: "ACCOUNT1",
          label: "Tổng thực trả",
          sortable: true,
          field: "thucTra",
        },
        { name: "STATUS10", label: "Ghi chú", field: "ghiChu" },
        { name: "STATUS110", label: "Ghi chú", field: "khoi" },
      ],
      data: [],
      disable: false,
      factory: null,
      options: null,
      departmentId: null,
      count: 0,
      disabled: true,
      file: "",
      uploadPercentage: 0,
      disabledToggle: false,
      computerEquipment2: null,
      priorityLevel2: null,
      separator: "cell",
      selected: false,
      events: [],
      nameDepartment: {},
      status: "",
      phoneNumber: "",
      nameDepartmentName: null,
      dataAddRow: [],
      activeFormAdd: false,
      activeFormEdit: false,
      intendedUse: "",
      metaValue: {
        kinhGui:
          "Ban TGĐ - Trưởng phòng/phó phòng ban :  -	GĐSX/Phó GĐSX/Phụ trách nhà máy :",
        noiDungTT: "",
        soTien: 0,
        vietBangChu: "",
        kemTheo: "",
        STT: "12",
        locationWork: "",
        position: "",
        position2: "",
        number: "",
        timeRecruit: "",
        description: "",
        fullName: "",
        fullName2: "",
        maNV: "",
        department: "",
        department2: "",
        stepDepartment: "",
        lyDo: "",
        dateStart: "",
        dateEnd: "",
        selection1: null,
        selection2: null,
        selection3: null,
        selection4: null,
        selection: null,
        thoiGianMangThai: "",
        xinRaCong: "",
        luongHienTai: "",
        luongDeXuat: "",
        thoiGianTangLuongGanNhat: "",
        phoneNumber: "",
      },
      dataAccountAll: [],
      dataSendEmail: [],
    };
  },
  components: {
    SendMessage,
    OrderHeader,
    OrderApproved,
  },
  methods: {
    ...mapActions("ordersm", ["getAllAccounts", "getAllDepartments"]),
    ...mapActions("orders", [
      "getOneOrder",
      "getAllRequests",
      "addOrder",
      "importPaySlip",
      "getByCondition",
    ]),
    ...mapActions("production", ["IMPORT_TON_DAU_KY"]),
    ...mapActions("document", ["importDocument", "getDocument"]),
    ...mapActions("messages", ["sendErrorTimeMail", "sendPaySplitMail"]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      "addorderMeta",
      "addMulRowAccount",
    ]),
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.data.map((row) =>
            this.columns
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");
      console.log("content", content);
      const status = exportFile(`file_loi_cham_cong.csv`, content, "text/csv");
      console.log("statuss", status);
      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      } else {
        this.$q.notify({
          message: "Đã tải file xuống thành công...",
          color: "primary",
          icon: "warning",
        });
      }
    },
    async onSelectionChanged(e) {
      this.departmentId = e.id;
      console.log("e", e.id);
    },
    async unique(arr) {
      this.dataSendEmail = await Array.from(new Set(arr)); //
    },
    async validate() {
      try {
        const data = await this.getByCondition({
          year: this.resultData[0].nam,
          month: this.resultData[0].thang,
          khoi: this.resultData[0].khoi,
        });
        console.log("da", data.data.data);
        if (data.data.data.length > 0) {
          this.confirm = true;
        } else {
          this.onClick();
        }
      } catch (error) {
        this.$q.notify({
          message: "Có lỗi xảy ra",
          color: "red",
        });
      }
    },
    async onClick() {
      if (this.selected) {
        if (this.resultData.length > 0) {
          let result = [];
          let IMPORT_TON_DAU_KY = this.IMPORT_TON_DAU_KY;
          let resultData = this.resultData;
          function chunk_inefficient(arr, chunkSize) {
            var array = arr;
            return [].concat.apply(
              [],
              array.map(function (elem, i) {
                return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
              })
            );
          }
          // const data = await this.importPaySlip(resultData)
          // console.log(data)
          // return
          // await this.importDocument(this.resultData)
          resultData = chunk_inefficient(resultData, 50);
          let dataSendMail = [];
          resultData.forEach(async (e) => {
            e.forEach((element) => dataSendMail.push(element.email));

            console.log(e);
            console.log(dataSendMail);
            const data = await this.importPaySlip(e);
            console.log("đâ", data);
            if (data)
              Notify.create({
                message: "Thành công",
                color: "green",
              });
            else
              Notify.create({
                message: "Có lỗi xảy ra, vui lòng kiểm tra lại dữ liệu",
                color: "red",
              });
          });
          await this.unique(dataSendMail);
          console.log("dataSendEmail", this.dataSendEmail);
          let url = "";
          if (process.env.DEV) {
            url = "http://localhost:8080/#/phieu-luong-all";
          } else {
            url = "https://app.woodsland.com.vn:1001/#/phieu-luong-all";
          }
          this.sendPaySplitMail({
            userName: this.userInfo.id,
            email: this.dataSendEmail,
            // time: `${this.thang}/${this.nam}`,
            url: url,
          });
          // console.log("slice", resultData.chunk_inefficient(100), resultData);
          // let dataSlice = chunk_inefficient(resultData, 100);
          // dataSlice.forEach(async (item) => {
          //   const data = await this.importDocument(item);
          //   if (data) {
          //     Notify.create({
          //       message: "Thành công",
          //       color: "green",
          //     });
          //   }
          // });

          // resultData.forEach(async function(item,index) {
          //   if(count<100){
          //     result.push(item)
          //     count++;
          //     console.log('if',count,index)
          //   }if(count>=100){
          //     await addMulRowAccount(result);
          //     result=[];
          //     count = 0;
          //     console.log('else',result,count,index,resultData.length-1);
          //   }
          //           console.log(count)

          // })
          this.$refs.file.value = null;
          this.data.pop();
          if (result) {
            this.resultData = [];
          } else {
            Notify.create({
              message:
                "Xảy ra lỗi khi insert dữ liệu kiểm tra lại dữ liệu file!",
              color: "red",
            });
          }
        }
      } else {
        Notify.create({
          message: "Vui lòng chọn file cần import",
          color: "red",
        });
      }
    },
    get_header_row(sheet) {
      var headers = [],
        range = XLSX.utils.decode_range(sheet["!ref"]);
      var C,
        R = range.s.r; /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        var cell =
          sheet[
            XLSX.utils.encode_cell({ c: C, r: R })
          ]; /* find the cell in the first row */
        var hdr = "UNKNOWN " + C; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
      return headers;
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
    workbook_to_json(workbook) {
      var result = {};
      workbook.SheetNames.forEach(function (sheetName) {
        var roa = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheetName].w
        );
        if (roa.length > 0) {
          result[sheetName] = roa;
        }
      });
      return result;
    },
    async onChange(e) {
      this.selected = true;
      let departmentId = this.departmentId;
      console.log("a");
      e.stopPropagation();
      e.preventDefault();

      console.log("DROPPED");
      console.log("file", e);
      var files, i, f;
      this.file = this.$refs.file.files[0];

      console.log("files", files);
      console.log("this.files", this.file);
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
          console.log("dassss", workbook);

          results = XLSX.utils.sheet_to_json(worksheet, { raw: false });
          console.log("dassss", results);
          results.shift();
          results.shift();

          console.log("dassss", results);

          await results.forEach(async (e) => {
            this.resultData.push({
              mnv: e.mnv ? e.mnv.trim() : null,
              ten: e.ten ? e.ten : null,
              chucVu: e.chucVu ? e.chucVu : null,
              boPhan: e.boPhan ? e.boPhan : null,
              congChinh: e.congChinh ? e.congChinh : null,
              tienCongChinh: e.tienCongChinh ? e.tienCongChinh : null,
              lt15: e.lt15 ? e.lt15 : null,
              lt20: e.lt20 ? e.lt20 : null,
              le: e.le ? e.le : null,
              tienLamThem: e.tienLamThem ? e.tienLamThem : null,
              nt: e.nt ? e.nt : null,
              nn: e.nn ? e.nn : null,
              nl: e.nl ? e.nl : null,
              tiencaDem: e.tiencaDem ? e.tiencaDem : null,
              xepABC: e.xepABC ? e.xepABC : null,
              tienThuongABC: e.tienThuongABC ? e.tienThuongABC : null,
              chiSoKPI: e.chiSoKPI ? e.chiSoKPI : null,
              HTCV: e.HTCV ? e.HTCV : null,
              phep: e.phep ? e.phep : null,
              luongPhep: e.luongPhep ? e.luongPhep : null,
              tongDiem: e.tongDiem ? e.tongDiem : null,
              tcLam: e.tcLam ? e.tcLam : null,
              thamNien: e.thamNien ? e.thamNien : null,
              hoTroKhac: e.hoTroKhac ? e.hoTroKhac : null,
              pc: e.pc ? e.pc : null,
              dienThoai: e.dienThoai ? e.dienThoai : null,
              HTCV2: e.HTCV2 ? e.HTCV2 : null,
              diLai: e.diLai ? e.diLai : null,
              htBoSung: e.htBoSung ? e.htBoSung : null,
              tienDenDo: e.tienDenDo ? e.tienDenDo : null,
              kinhDoanh: e.kinhDoanh ? e.kinhDoanh : null,
              nangSuat: e.nangSuat ? e.nangSuat : null,
              thamNienNangSuat: e.nangSuat ? e.nangSuat : null,
              ctp: e.ctp ? e.ctp : null,
              kiemNhiem: e.kiemNhiem ? e.kiemNhiem : null,
              chuyenCan: e.chuyenCan ? e.chuyenCan : null,
              nghiLe: e.nghiLe ? e.nghiLe : null,
              luongLe: e.luongLe ? e.luongLe : null,
              boiDuong: e.boiDuong ? e.boiDuong : null,
              bh: e.bh ? e.bh : null,
              boSung: e.boSung ? e.boSung : null,
              //NgungViec: e.NgungViec ? e.NgungViec : null,
              khoiLuong: e.khoiLuong ? e.khoiLuong : null,
              tongTN: e.tongTN ? e.tongTN : null,
              bhxh: e.bhxh ? e.bhxh : null,
              thueTNCN: e.thueTNCN ? e.thueTNCN : null,
              truKhac: e.truKhac ? e.truKhac : null,
              tienAn: e.tienAn ? e.tienAn : null,
              ungLuong: e.ungLuong ? e.ungLuong : null,
              tongTru: e.tongTru ? e.tongTru : null,
              thucTra: e.thucTra ? e.thucTra : null,
              ghiChu: e.ghiChu ? e.ghiChu : null,
              khoi: e.khoi ? e.khoi.trim() : null,
              thang: e.thang ? e.thang : null,
              nam: e.nam ? e.nam : null,
              thuongBoSung: e.thuongBoSung ? e.thuongBoSung : null,
              congHien: e.congHien ? e.congHien : null,

              ot1: e.ot1 ? e.ot1 : null,
              ot2: e.ot2 ? e.ot2 : null,
              ot3: e.ot3 ? e.ot3 : null,
              phepTon: e.phepTon ? e.phepTon : null,

              //   status1: e.STATUS1 == null ? "" : e.STATUS1,
              //   status2: e.STATUS2 == null ? "" : e.STATUS2,
              //   last_name: e.LAST_NAME == null ? "" : e.LAST_NAME,
              //   date: moment(e.DATE, "DD-MM-YYYY").format("DD-MM-YYYY"),
              //   timeIn: e.TIME1,
              //   timeOut: e.TIME2,
              accountId: (await this.getAccount(1, e)) | "",
              // proposalFormId: 1042,
              departmentId: (await this.getAccount(2, e)) | "",
              //   title: "Phiếu xác nhận công",
              //   factoryId: 100000,
              //   slug: "xac-nhan-cong",
              email: (await this.getAccount(4, e)) | "",
            });
          });
          console.log("results", this.resultData);

          // this.state.tickets = results;
          this.file = "";
        };
        reader.readAsArrayBuffer(f);
      }
      this.data.push(this.resultData);
    },
    async getAccount(option, data) {
      console.log("data", data);
      if (option == 1) {
        let data2 = await this.dataAccountAll.data.find(
          (element) => element.account == data.mnv.trim().toUpperCase()
        );
        console.log("data2", data2);
        return data2 ? data2.id : 0;
      } else if (option == 2) {
        let data2 = await this.dataAccountAll.data.find(
          (element) => element.account == data.mnv.trim().toUpperCase()
        );
        return data2 ? data2.departmentId : 0;
      } else if (option == 3) {
        let data2 = await this.dataAccountAll.data.find(
          (element) => element.account == data.mnv.trim().toUpperCase()
        );
        return data2 ? data2.lastName : "";
      } else if (option == 4) {
        let data2 = await this.dataAccountAll.data.find(
          (element) => element.account == data.mnv.trim().toUpperCase()
        );
        return data2 ? data2.email : "";
      }
    },
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo", "myFactoryInfor", "dsCongDoans"]),
  },
  async created() {
    this.dataAccountAll = await this.getAllAccounts();
    console.log("lalaa", this.dataAccountAll.data);
    this.metaValue.fullName = this.userInfo.lastName;
    this.metaValue.position = this.userInfo.position;
    this.metaValue.phoneNumber = this.userInfo.PHONE;
    this.metaValue.maNV = this.userInfo.id;
    let status = this.$route.query.status;
    // var bytes = crypto.AES.decrypt('U2FsdGVkX186+VAiO9ByyKhr+a1C3ElInVpjKqPWePY=', "ma bi mat");

    // Chuyển sang chuỗi gốc
    // var message_decode = bytes.toString(crypto.enc.Utf8);

    // if (this.$route.query.id) {
    //   this.getOneOrder(this.$route.query.id).then(res => {
    //     if (res.data.data.Requests.length) this.disable = true;
    //     this.metaValue = Object.assign(
    //       this.metaValue,
    //       JSON.parse(res.data.data.OrderMeta[0].metaValue)[0]
    //     );
    //   });
    // }
    // else {
    //   this.$router.push({
    //     path: "/tao-de-xuat"
    //   });
    // }
  },
  mounted() {
    console.log("status", this.dsCongDoans);
    this.dsCongDoans.forEach((element) => {
      element.label = element.name;
    });
    console.log("status", moment("2021-12-31").format("DD-MM-YYYY"));

    this.factory = this.dsCongDoans[0];
    this.departmentId = this.factory.id;
    this.options = this.dsCongDoans;
    console.log("id", this.departmentId);
  },

  // watch: {
  //   disable(newValue) {
  //     if (newValue) {
  //       this.addorderMeta({
  //         ...this.order.OrderMeta[0],
  //         metaValue: JSON.stringify([this.metaValue])
  //       });
  //     }
  //   }
  // }
};
</script>


