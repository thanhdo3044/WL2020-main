<template>
  <q-page>
    <q-banner class="bg-primary text-orange">
      <div class="text-h6 orange">
        <span color="orange">Import phiếu thưởng cuối năm</span>
      </div>
    </q-banner>
    <div>
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
            title="Danh sách nhân viên"
            :data="data[0]"
            :columns="columns"
          ></q-table>
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
            >Phát hiện dữ liệu trùng lặp !!</span
          >
          <span class="q-ml-sm text-h6">Bạn muốn tiếp tục ghi đè không?</span>
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
  </q-page>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
import SendMessage from "components/eof/Shared/SendMessage.vue";
import OrderHeader from "components/eof/Shared/OrderHeader.vue";
import OrderApproved from "components/eof/Shared/OrderApproved.vue";
import { Notify, Loading, QSpinnerIos } from "quasar";
import XLSX from "xlsx";
import moment from "moment";
export default {
  data() {
    return {

      treeConfig: { nodeWidth: 400, nodeHeight: 80, levelHeight: 200 },
      columns: [
        {
          name: "mnv",
          required: true,
          label: "Mã nhân viên",
          align: "left",
          field: (row) => row.mnv,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "hoTen",
          align: "center",
          label: "Tên nhân viên",
          field: "hoTen",
          sortable: true,
        },

        { name: "chucVu", label: "Chức vụ", field: "chucVu" },
        { name: "boPhan", label: "Bộ phận", field: "boPhan" },
        { name: "tongThuNhap", label: "Tổng thu nhập", field: "tongThuNhap" },
        { name: "tongCong", label: "Tổng công", field: "tongCong" },
        { name: "tyLe", label: "Tỷ lệ", field: "tyLe" },
        { name: "heSoT13", label: "Hệ số tháng 13", field: "heSoT13" },
        { name: "thanhTienT13", label: "Thành tiền tháng 13", field: "thanhTienT13" },
        { name: "heSothamnien", label: "Hệ số thâm niên", field: "heSothamnien" },
        { name: "thanhTienTNCT", label: "Thành tiền thâm niên", field: "thanhTienTNCT" },
        { name: "tongTTTinhTra", label: "Tổng tính trả", field: "tongTTTinhTra" },
        { name: "thueTNCN", label: "Thuế TNCN", field: "thueTNCN" },
        { name: "tongTTThucTra", label: "Tổng thực trả", field: "tongTTThucTra" },
        { name: "nam", label: "Năm", field: "nam" },
        { name: "number", label: "Phiếu", field: "number" },
        { name: "heSoKQKD", label: "Hệ số kinh doanh", field: "heSoKQKD" },
        { name: "thanhTienKQKD", label: "Thành tiên kinh doanh", field: "thanhTienKQKD" },
        { name: "heSoTPXS", label: "Hê số phòng xuất sắc", field: "heSoTPXS" },
        { name: "thanhTienTPXS", label: "Thành tiền phòng xuất sắc", field: "thanhTienTPXS" },
        { name: "heSoTCNXS", label: "Hệ số cá nhân xuất sắc", field: "heSoTCNXS" },
        { name: "thanhTienTCNXS", label: "Thành tiên cá nhân xuất sắc", field: "thanhTienTCNXS" },
        { name: "heSoTTBS", label: "Hệ số bổ sung", field: "heSoTTBS" },
        { name: "thanhTienTTBS", label: "Thành tiền bổ sung", field: "thanhTienTTBS" },
        { name: "heSoKPI", label: "Hệ số KPI", field: "heSoKPI" },
        { name: "chiSoKPI", label: "Chỉ số KPI", field: "chiSoKPI" },
      

      ],
      data: [],
      disable: false,
      factory: null,
      options: null,
      confirm: false,
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
    };
  },
  components: {
    SendMessage,
    OrderHeader,
    OrderApproved,
    // TreeChart,
    // VueTree,
  },
  methods: {
    ...mapActions("ordersm", ["importPaySlipT13", "getByConditionT13"]),
    async onSelectionChanged(e) {
      this.departmentId = e.id;
      console.log("e", e.id);
    },
    async validate() {
      console.log("resultData", this.resultData[0].nam);
      try {
        const data = await this.getByConditionT13({
          year: this.resultData[0].nam,
        });
        console.log("da", data.data.result.data);
        if (data.data.result.data.length > 0) {
          this.confirm = true;
        } else {
          this.onClick();
        }
      } catch (error) {
        console.log("error", error);
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
          let IMPORT_TON_DAU_KY = this.importPaySlipT13;
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

          let dataSlice = chunk_inefficient(resultData, 100);
          dataSlice.forEach(async (item) => await IMPORT_TON_DAU_KY(item));
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
    async onClick1(node) {
      console.log(node);
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
          await results.forEach((e) => {
            if (e.mnv) {
              this.resultData.push({
                mnv: e.mnv ? e.mnv : null,
                hoTen: e.hoTen ? e.hoTen : null,
                chucVu: e.chucVu ? e.chucVu : null,
                boPhan: e.boPhan ? e.boPhan : null,
                tongThuNhap: e.tongThuNhap ? e.tongThuNhap : '-',
                tongCong: e.tongCong ? e.tongCong : '-',
                tyLe: e.tyLe ? e.tyLe : '-',
                heSoT13: e.heSoT13 ? e.heSoT13 : '-',
                thanhTienT13: e.thanhTienT13 ? e.thanhTienT13 : '-',
                heSothamnien: e.heSothamnien ? e.heSothamnien : '-',
                thanhTienTNCT: e.thanhTienTNCT ? e.thanhTienTNCT : '-',
                heSoKQKD: e.heSoKQKD ? e.heSoKQKD : '-',
                thanhTienKQKD: e.thanhTienKQKD ? e.thanhTienKQKD : '-',
                heSoTPXS: e.heSoTPXS ? e.heSoTPXS : '-',
                thanhTienTPXS: e.thanhTienTPXS ? e.thanhTienTPXS : '-',
                heSoTCNXS: e.heSoTCNXS ? e.heSoTCNXS : '-',
                thanhTienTCNXS: e.thanhTienTCNXS ? e.thanhTienTCNXS : '-',
                heSoTTBS: e.heSoTTBS ? e.heSoTTBS : '-',
                thanhTienTTBS: e.thanhTienTTBS ? e.thanhTienTTBS : '-',
                tongTTTinhTra: e.tongTTTinhTra ? e.tongTTTinhTra : '-',
                thueTNCN: e.thueTNCN ? e.thueTNCN : '-',
                tongTTThucTra: e.tongTTThucTra ? e.tongTTThucTra : '-',
                heSoKPI: e.heSoKPI ? e.heSoKPI : '-',
                chiSoKPI: e.chiSoKPI ? e.chiSoKPI : '-',
                nam: e.nam ? e.nam : null,
                number: e.number ? e.number : null,
                accountId: this.userInfo.id
              });
            }
          });
          console.log("results", this.resultData);

          // this.state.tickets = results;
          this.file = "";
        };
        reader.readAsArrayBuffer(f);
      }
      console.log("state", this.resultData);
      this.data.push(this.resultData);
      console.log("dât", this.data[0]);
    },
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo", "myFactoryInfor", "dsCongDoans"]),
  },
  created() {
    let status = this.$route.query.status;
  },
  mounted() {
    console.log("status", this.dsCongDoans);
    this.dsCongDoans.forEach((element) => {
      element.label = element.name;
    });
    console.log("status", this.dsCongDoans[0]);

    this.factory = this.dsCongDoans[0];
    this.departmentId = this.factory.id;
    this.options = this.dsCongDoans;
    console.log("id", this.departmentId);
  },
};
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rich-media-node {
  width: 300px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  color: white;
  background-color: #f7c616;
  border-radius: 4px;
}
.spanA:hover {
  color: blue;
  padding: 4px 0;
  font-weight: bold;
}
</style>