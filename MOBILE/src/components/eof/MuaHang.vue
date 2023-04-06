<template>
  <q-card-section>
    <div v-if="order.status == 'Không được duyệt'">
      <div class="row q-mb-sm">
        <q-input
          class="q-mt-sm q-pr-sm col"
          outlined
          label-color="orange"
          v-model="userInfo.lastName"
          label="Tên tôi là : "
          readonly
        />
        <q-input
          class="q-mt-sm col"
          label-color="orange"
          outlined
          v-model="userInfo.position"
          label="Chức danh : "
          readonly
        />
        <q-input
          class="q-mt-sm q-pr-sm col"
          label-color="orange"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          readonly
        />
        <q-input
          filled
          class="q-mt-sm col"
          label-color="orange"
          outlined
          v-model="userInfo.PHONE"
          label="SĐT : "
          readonly
        />
      </div>
      <div class="row">
        <q-input
          filled
          class="q-mt-sm col"
          outlined
          label-color="orange"
          style="font-weight:bold"
          v-model="order.intendedUse"
          label="Nhập thông tin mục đích sử dụng : "
          :readonly="disable"
        />
      </div>
      <div class="row">
        <q-select
          class="col-12"
          filled
          use-input
          @filter="filterFn"
          label-color="orange"
          v-model="department"
          :options="departments"
          @input="changeDepartment"
          label="Danh sách phòng ban, nhà máy"
          :readonly="disable"
        />
      </div>
      <div class="">
        <q-table
          @row-click="click"
          class="my-sticky-header-column-table"
          title="Treats"
          :data="data"
          :columns="columns"
          row-key="name"
        />
      </div>
      <div class="row q-mt-sm">
        <div class="col-md-12">
          <div class="large-12 medium-12 small-12 cell">
            <label>
              <p class="text-orange">Vui lòng ấn chọn file cần tải lên :</p>
              <input
                class="q-ml-sm"
                type="file"
                id="file"
                ref="file"
                v-on:change="handleDrop"
              />
            </label>
          </div>
        </div>
      </div>
      <div v-if="state" class="row q-mt-sm">
        <div>
          <table
            class="
              table table-striped table-hover table-condensed table-responsive
            "
          >
            <thead>
              <tr>
                <th
                  style="border: 1px solid #ccc"
                  class="q-pa-sm"
                  v-for="(item, index) in state.headers"
                  :key="index"
                >
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                style="border: 1px solid #ccc"
                v-for="(item, index) in state.tickets"
                :key="index"
              >
                <td
                  class="q-pa-sm"
                  style="border: 1px solid #ccc"
                  v-for="(key, index) in item"
                  :key="index"
                >
                  <label>{{ key }}</label>
                  <p>{{ item.key }}</p>
                </td>
              </tr>
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
      <q-btn
        class="q-mt-sm"
        v-on:click="updatedOrderMeta"
        color="primary"
        text-color="white"
        label="Sửa"
      />
    </div>
    <div v-else>
      <div id="app">
        <div class="container-responsive"></div>
      </div>
      <div class="row"></div>
      <div class="row q-mb-sm">
        <q-input
          class="q-mt-sm q-pr-sm col"
          outlined
          v-model="userInfo.lastName"
          label-color="orange"
          label="Tên tôi là : "
          readonly
        />
        <q-input
          class="q-mt-sm q-pr-sm col"
          outlined
          label-color="orange"
          v-model="userInfo.position"
          label="Chức danh : "
          readonly
        />
        <q-input
          class="q-mt-sm q-pr-sm col"
          outlined
          label-color="orange"
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          readonly
        />
        <q-input
          filled
          class="q-mt-sm col"
          outlined
          label-color="orange"
          v-model="userInfo.PHONE"
          label="SĐT : "
          readonly
        />
      </div>
      <div class="row">
        <q-input
          filled
          class="col q-mb-sm"
          style="font-weight:bold"
          outlined
          label-color="orange"
          v-model="order.intendedUse"
          label="Nhập thông tin mục đích sử dụng : "
          :readonly="disable"
        />
      </div>
      <!-- <div class="row">
        <q-checkbox v-model="showDepartment" style="color:orange;font-weight:bold" label="Chọn phòng ban, nhà máy (Vật tư mua cho nhà máy / phòng ban nào)" />
      </div> -->
      <div v-show="showDepartment" class="row">
        <q-select
          class="col-12"
          filled
          use-input
          @filter="filterFn"
          label-color="orange"
          v-model="department"
          :options="departments"
          @input="changeDepartment"
          label="Danh sách phòng ban, nhà máy"
          :readonly="disable"
        />
      </div>
      <div class="">
        <q-table
          @row-click="click"
          class="my-sticky-header-table"
          title="Nội dung đề xuất"
          :data="data"
          :columns="columns"
          row-key="name"
          :wrap-cells="true"
          :separator="separator"
          :pagination="pagination"
          :rows-per-page-options="[0]"
        >
          <template v-slot:top-right>
            <q-btn
              color="orange"
              icon-right="archive"
              label="Xuất Excel"
              no-caps
              @click="exportTable"
            />
          </template>
        </q-table>
      </div>
      <div class="row q-mt-sm">
        <div class="col-md-12">
          <div class="large-12 medium-12 small-12 cell">
            <label :disabled="disable">
              <b class="text-orange">Vui lòng ấn chọn file cần tải lên :</b>
              <input
                :disabled="disable"
                class="q-ml-sm"
                type="file"
                id="file"
                ref="file"
                v-on:change="handleDrop"
              />
            </label>
          </div>
        </div>
      </div>
      <!-- binding data file excel -->
      <div class="row" style="padding: 10px">
        <div v-if="state.tickets.length != 0">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã vật tư</th>
                <th>Tên vật tư</th>
                <th>Yêu cầu kỹ thuật</th>
                <th>Xuất xứ</th>
                <th>Số lượng</th>
                <th>Đơn vị</th>
                <th>Mục đích sử dụng</th>
                <th>Bộ phận sử dụng</th>
              </tr>
            </thead>
            <tbody>
              <tr
                style="border: 1px solid #ccc"
                v-for="(item, index) in state.tickets"
                :key="index"
              >
                <td>{{ item.STT }}</td>
                <td>{{ item.MaVT }}</td>
                <td>{{ item.TenVT }}</td>
                <td>{{ item.YeuCauKyThuat }}</td>
                <td>{{ item.xuatXu }}</td>
                <td>{{ item.SoLuong }}</td>
                <td>{{ item.DVT }}</td>
                <td>{{ item.mucDichSuDung }}</td>
                <td>{{ item.boPhanSuDung }}</td>
              </tr>
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
        <div class="col-12" align="right" style="padding-top: 10px">
          <q-btn
            style="z-index: 99"
            v-show="!disable"
            v-on:click="initNewRow"
            color="positive"
            text-color="white"
            no-caps
            label="Thêm nội dung đề xuất"
          />
        </div>
      </div>
    </div>
    <q-dialog
      persistent
      v-model="activeFormAdd"
      transition-show="rotate"
      transition-hide="rotate"
      full-width
    >
      <q-card>
        <q-card-section class="bg-primary text-white text-h5">
          Thêm dữ liệu
        </q-card-section>
        <q-card-section
          class="q-pt-none"
          v-for="(task, key) in dataAddRow"
          v-bind:key="key"
        >
          <div class="row q-pb-sm">
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-1 col-12"
              outlined
              :readonly="true"
              style="font-style: italic"
              label-color="orange"
              stack-label
              v-model="task.STT"
              label="STT : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-2 col-12"
              style="font-style: italic"
              label-color="orange"
              stack-label
              outlined
              @input="selectMaVT(task)"
              v-model="task.maVT"
              label="Mã vật tư : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-3 col-12"
              style="font-style: italic"
              label-color="orange"
              stack-label
              outlined
              v-model="task.tenVT"
              label="Tên vật tư : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-3 col-12"
              style="font-style: italic"
              label-color="orange"
              stack-label
              outlined
              v-model="task.yeuCauKyThuat"
              label="Yêu cầu kỹ thuật : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-3 col-12"
              style="font-style: italic"
              label-color="orange"
              stack-label
              outlined
              v-model="task.xuatXu"
              label="Xuất xứ : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-1 col-12"
              style="font-style: italic"
              label-color="orange"
              stack-label
              outlined
              v-model="task.donViTinh"
              label="Đơn vị tính : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-2 col-12"
              style="font-style: italic"
              label-color="orange"
              stack-label
              outlined
              v-model="task.number"
              type="number"
              placeholder="Vui lòng nhập số"
              label="Số lượng : "
            />

            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-3 col-12"
              style="font-style: italic"
              label-color="orange"
              stack-label
              outlined
              v-model="task.stepDepartment"
              label="Bộ phận sử dụng : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-6 col-12"
              style="font-style: italic;font-weight:bold"
              label-color="orange"
              stack-label
              outlined
              v-model="task.mucDichSuDung"
              label="Nhập thông tin mục đích sử dụng : "
            />
          </div>
          <hr width="50%" />
        </q-card-section>
        <q-card-actions align="right">
          <!-- <q-btn
            flat
            class="bg-red text-white"
            @click="cancel"
            label="Thoát"
            color="primary"
            v-close-popup
          /> -->
          <q-btn
            flat
            class="bg-primary text-white"
            @click="acceptAdd"
            label="Đồng ý"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="activeFormEdit"
      transition-show="rotate"
      transition-hide="rotate"
      full-width
    >
      <q-card>
        <q-card-section class="bg-primary text-white text-h5">
          Sửa dữ liệu
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="row">
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-1 col-12"
              outlined
              :readonly="true"
              style="font-style: italic"
              label-color="orange"
              stack-label
              v-model="task.STT"
              label="STT : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-2 col-12"
              style="font-style: italic"
              label-color="orange"
              stack-label
              outlined
              @input="selectMaVT(task)"
              v-model="task.maVT"
              label="Mã vật tư : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-3 col-12"
              style="font-style: italic"
              label-color="orange"
              stack-label
              outlined
              v-model="task.tenVT"
              label="Tên vật tư : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-3 col-12"
              style="font-style: italic"
              label-color="orange"
              stack-label
              outlined
              v-model="task.yeuCauKyThuat"
              label="Yêu cầu kỹ thuật : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-3 col-12"
              style="font-style: italic"
              label-color="orange"
              stack-label
              outlined
              v-model="task.xuatXu"
              label="Xuất xứ : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-1 col-12"
              style="font-style: italic"
              label-color="orange"
              stack-label
              outlined
              v-model="task.donViTinh"
              label="Đơn vị tính : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-2 col-12"
              style="font-style: italic"
              label-color="orange"
              stack-label
              outlined
              v-model="task.number"
              type="number"
              placeholder="Vui lòng nhập số"
              label="Số lượng : "
            />

            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-3 col-12"
              style="font-style: italic"
              label-color="orange"
              stack-label
              outlined
              v-model="task.stepDepartment"
              label="Bộ phận sử dụng : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-sm-6 col-12"
              style="font-style: italic;font-weight:bold"
              label-color="orange"
              stack-label
              outlined
              v-model="task.mucDichSuDung"
              label="Nhập thông tin mục đích sử dụng : "
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            class="bg-red text-white"
            @click="deleted"
            label="Xóa"
            color="primary"
            v-close-popup
          />
          <q-btn
            flat
            id="activeFormEdit"
            class="bg-primary text-white"
            @click="acceptEdit"
            label="Sửa"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card-section>
</template>

<script>
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
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import { Notify, Loading, QSpinnerIos } from "quasar";
import XLSX from "xlsx";
export default {
  props: ["metaValue", "disable", "order"],
  async created() {
    this.state = {
      tickets: [],
      headers: [],
    };
    console.log("userInfo", this.userInfo);
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(
      this.userInfo.department
    );
    this.metaValue.departmentParent = this.nameDepartmentName.PARENT_ID;
    console.log(
      "this.metaValue.departmentParent",
      this.metaValue.departmentParent
    );
    this.status = this.$route.query.status;
    this.loadData(this.$route.query.id);
    console.log("status", this.status);
    console.log("dsCongDoans", this.dsCongDoans);
    console.log("userInfo", this.userInfo);
    console.log("priorityLevel2", this.priorityLevel2);
    console.log("computerEquipment2", this.computerEquipment2);
    this.priorityLevel2 = this.order.priorityLevel;
    this.computerEquipment2 = this.order.computerEquipment;
    console.log("priorityLevel2", this.priorityLevel2);
    console.log("computerEquipment2", this.computerEquipment2);
  },
  data() {
    return {
      file: "",
      uploadPercentage: 0,
      state: null,
      disabledToggle: false,
      computerEquipment2: null,
      priorityLevel2: null,
      separator: "cell",
      pagination: {
        rowsPerPage: 0
      },
      selected: [],
      events: [],
      nameDepartment: {},
      showDepartment: false,
      department: null,
      departments: [],
      departmentTemp: [],
      status: "",
      phoneNumber: "",
      nameDepartmentName: null,
      dataAddRow: [],
      activeFormAdd: false,
      activeFormEdit: false,
      intendedUse: "",
      task: {
        maVT: null,
        tenVT: null,
        yeuCauKyThuat: null,
        mucDichSuDung: null,
        number: null,
        donViTinh: null,
        id: null,
        STT: null,
      },
      columns: [
        {
          name: "STT",
          required: true,
          label: "STT",
          align: "center",
          field: (row) => (row.STT == null ? "" : row.STT),
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "maVT",
          required: true,
          label: "Mã vật tư",
          align: "left",
          field: (row) => (row.maVT == null ? "" : row.maVT),
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "tenVT",
          required: true,
          label: "Tên vật tư",
          align: "left",
          field: (row) => (row.tenVT == null ? "" : row.tenVT),
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "Yêu cầu kỹ thuật",
          required: true,
          label: "Yêu cầu kỹ thuật",
          align: "left",
          field: (row) => (row.yeuCauKyThuat == null ? "" : row.yeuCauKyThuat),
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "Xuất xứ",
          required: true,
          label: "Xuất xứ",
          align: "left",
          field: (row) => (row.xuatXu == null ? "" : row.xuatXu),
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "Số lượng",
          required: true,
          label: "Số lượng",
          align: "left",
          field: (row) => (row.number == null ? "" : row.number),
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "Đơn vị",
          required: true,
          label: "Đơn vị",
          align: "left",
          field: (row) => (row.donViTinh == null ? "" : row.donViTinh),
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: "Mục đích sử dụng",
          required: true,
          label: "Mục đích sử dụng",
          align: "left",
          field: (row) => (row.mucDichSuDung == null ? "" : row.mucDichSuDung),
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "Bộ phận sử dụng",
          required: true,
          label: "Bộ phận sử dụng",
          align: "left",
          text: "red",
          field: (row) =>
            row.stepDepartment == null ? "" : row.stepDepartment,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "Trạng thái phê duyệt",
          required: true,
          label: "Trạng thái phê duyệt",
          align: "left",
          text: "red",
          field: (row) =>
            row.statusRequests == null ? "" : row.statusRequests,
          format: (val) => `${val}`,
          sortable: true,
        },
      ],
      data: [],
      resultData: [],
    };
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo", "dsCongDoans"]),
  },
  watch: {
    selected(newSelected, oldSelected) {
      console.log("selected", this.selected);
      console.log("oldValue", oldSelected);
      console.log("newValue", newSelected);
      // return this.selected.length === 0 ? '' : `${this.selected.length} bản ghi được chọn `
    },
  },
  methods: {
    ...mapActions("base", ["GET_DEPARTMENTSBYID"]),
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.departments = this.departmentTemp;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.departments = this.departmentTemp.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
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
      const status = exportFile(
        `${this.order.title} ${this.order.number}/2021.csv`,
        "\ufeff" + content,
        "text/csv"
      );
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
    ...mapActions("base", ["GET_DEPARTMENTSBYID"]),
    ...mapActions("orders", [
      "getOneOrder",
      "getAllRequests",
      "confirmPriorityLevel",
      "confirmComputerEquipment",
      "updOrder",
      "getMaVT",
    ]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      "addMulRow",
      "addorderMeta",
      "deleteOrderMeta",
      "updateOrderMeta",
    ]),
    ...mapActions("requests", [
      "deleteRequest",
      "resetOrder",
      "getDepartmentMuaHang",
    ]),
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      console.log("this.file", this.file);
    },
    submitFile() {
      /*
        Initialize the form data
      */
      let formData = new FormData();

      /*
        Add the form data we need to submit
      */
      formData.append("file", this.file);

      /*
        Make the request to the POST /single-file URL
      */
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
          workbook.Sheets[sheetName]
        );
        if (roa.length > 0) {
          result[sheetName] = roa;
        }
      });
      return result;
    },
    /** PARSING and DRAGDROP **/
    // excel createdby HTHIEU(2020-12-28)
    async handleDrop(e) {
      if (this.order.intendedUse != null) {
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
              workbook = XLSX.read(btoa(fixedData), { type: "base64" }),
              firstSheetName = workbook.SheetNames[0],
              worksheet = workbook.Sheets[firstSheetName];
            this.state.headers = this.get_header_row(worksheet);
            results = XLSX.utils.sheet_to_json(worksheet);
            console.log("results", results);
            await results.forEach((e) => {
              this.resultData.push({
                STT: e.STT,
                tenVT: e.TenVT == null ? "" : e.TenVT,
                maVT: e.MaVT == null ? "" : e.MaVT,
                number: e.SoLuong == null ? "" : e.SoLuong,
                donViTinh: e.DVT == null ? "" : e.DVT,
                yeuCauKyThuat: e.YeuCauKyThuat == null ? "" : e.YeuCauKyThuat,
                xuatXu: e.xuatXu == null ? "" : e.xuatXu,
                orderId: this.$route.query.id,
                fullName: this.userInfo.lastName,
                department: this.nameDepartmentName.NAME.toString(),
                phoneNumber:
                  this.userInfo.PHONE == null ? " " : this.userInfo.PHONE,
                position: this.userInfo.position,
                mucDichSuDung: e.mucDichSuDung == null ? "" : e.mucDichSuDung,
                stepDepartment: e.boPhanSuDung == null ? "" : e.boPhanSuDung,
              });
            });
            console.log("resultData", this.resultData);
            this.state.tickets = results;
            console.log("results", results);
            this.file = "";
          };
          reader.readAsArrayBuffer(f);
        }
        console.log("state", this.resultData);
      } else {
        Notify.create({
          message: "Vui lòng nhập thông tin mục đích sử dụng !",
          color: "red",
        });
        this.loadData(this.$route.query.id);
      }
    },
    // tìm kiếm thông tin theo mã vật tư
    // createdby : HTHIEU(2020/01/05)
    async selectMaVT(data) {
      console.log("serach", data);
      let payload = {
        ma_vt: data.maVT,
      };
      let data2 = await this.getMaVT(payload);
      console.log("this.dataAddRow", this.dataAddRow);
      this.dataAddRow.forEach((e) => {
        if (data.STT == e.STT) {
          e.tenVT = "";
          e.donViTinh = "";
          e.tenVT = data2.data.data[0].ten_vt;
          e.donViTinh = data2.data.data[0].dvt;
        }
      });
      console.log("data2", data2.data.data);
    },
    handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },
    //xét độ ưu tiên của phiếu
    async confimPriorityLevel(value, evt) {
      console.log(value);
      console.log(evt);
      let payload = {
        id: this.$route.query.id,
        priorityLevel: value ? 1 : 0,
      };
      if (this.order.Requests.length > 0) {
        this.disabledToggle = true;
        Notify.create({
          message: "Không được sửa vì đã gửi đi chờ xem xét !",
          color: "orange",
        });
      } else {
        let data = await this.confirmPriorityLevel(payload);
        await this.loadData(this.$route.query.id);
        console.log("dataconfimlevel", data);
      }
    },
    //thiết bị tin học
    async confimComputerEquipment(value, evt) {
      console.log(value);
      let payload = {
        id: this.$route.query.id,
        computerEquipment: value ? 1 : 0,
      };
      let data = await this.confirmComputerEquipment(payload);
      await this.loadData(this.$route.query.id);
    },
    //click thêm dòng và phân quyền sửa
    click(evt, row, index) {
      console.log("evt", evt);
      console.log("row", row);
      console.log("index", index);
      this.task.tenVT = row.tenVT;
      this.task.maVT = row.maVT;
      this.task.yeuCauKyThuat = row.yeuCauKyThuat;
      this.task.mucDichSuDung = row.mucDichSuDung;
      this.task.number = row.number;
      this.task.stepDepartment = row.stepDepartment;
      this.task.donViTinh = row.donViTinh;
      this.task.xuatXu = row.xuatXu;
      this.task.STT = row.STT;
      this.task.id = row.id;
      // phần quyền chỉnh sửa - xóa : created by HTH (2020/12/10)
      if (row.statusRequests == "Hủy") {
        this.activeFormEdit = true;
      } else if (
        this.order.Requests.length > 0 &&
        row.statusRequests == "Xem xét"
      ) {
        Notify.create({
          message: "Không được sửa vì đã gửi đi chờ xem xét !",
          color: "orange",
        });
      } else if (
        this.order.Requests.length == 0 &&
        row.statusRequests == "Xem xét"
      ) {
        this.activeFormEdit = true;
      } else {
        Notify.create({
          message: "Không được chỉnh sửa do đã được phê duyệt !",
          color: "blue",
        });
      }
      // end ------------- (2020/12/10)
    },
    // Xóa record createdby HTH(2020/12/10)
    async deleted() {
      await this.deleteOrderMeta(this.task.id);
      await this.loadData(this.$route.query.id);
    },
    // Chỉnh sửa record createdby HTH(2020/12/10)
    async acceptEdit() {
      let maVT = this.task.maVT;
      let tenVT = this.task.tenVT;
      let yeuCauKyThuat = this.task.yeuCauKyThuat;
      let fullName = this.userInfo.lastName;
      let number = this.task.number;
      let phoneNumber = this.userInfo.PHONE == null ? " " : this.userInfo.PHONE;
      let donViTinh = this.task.donViTinh;
      let mucDichSuDung = this.task.mucDichSuDung;
      let xuatXu = this.task.xuatXu;
      let stepDepartment = this.task.stepDepartment;
      let id = this.task.id;
      let STT = this.task.STT;
      let department = this.nameDepartmentName.NAME.toString();
      await this.updateOrderMeta({
        ...this.order.OrderMeta[0],
        metaValue: JSON.stringify([this.metaValue]),
        maVT,
        tenVT,
        fullName,
        yeuCauKyThuat,
        xuatXu,
        number,
        stepDepartment,
        mucDichSuDung,
        donViTinh,
        phoneNumber,
        department,
        STT,
        id,
      });
      let payload = {
        id: this.$route.query.id,
        intendedUse: this.order.intendedUse,
      };
      await this.updOrder(payload);
      await this.loadData(this.$route.query.id);
    },
    // Add Multi records createdby HTH(2020/12/10)
    async acceptAdd() {
      console.log("state", this.resultData);
      if (this.resultData.length > 0) {
        let result = await this.addMulRow(this.resultData);
        if (result) {
          this.state = {
            tickets: [],
            headers: [],
          };
          this.resultData = [];
        } else {
          Notify.create({
            message: "Xảy ra lỗi khi insert dữ liệu kiểm tra lại dữ liệu file!",
            color: "red",
          });
        }
      }
      console.log(
        "dataaAdd",
        this.dataAddRow.filter((e) => e.maVT)
      );
      if (this.order.intendedUse != null) {
        let dataAdd = await this.dataAddRow.filter(
          (e) =>
            e.tenVT != null ||
            e.number != null ||
            e.donViTinh != null ||
            e.yeuCauKyThuat != null
        );
        let result = await this.addMulRow(dataAdd);
        let payload = {
          id: this.$route.query.id,
          intendedUse: this.order.intendedUse,
        };
        await this.updOrder(payload);
        console.log("result", result);
        this.loadData(this.$route.query.id);
      } else {
        Notify.create({
          message: "Vui lòng nhập thông tin mục đích sử dụng !",
          color: "red",
        });
        this.loadData(this.$route.query.id);
      }
    },
    // Thoát khỏi form thêm dữ liệu
    async cancel() {
      console.log("dataaAdd", this.dataAddRow);
      this.dataAddRow = [];
    },
    //loadData hệ thống
    async loadData(id) {
      let data = null;
      try {
        data = await this.getOneOrder(id);
      } catch (error) {
        console.log(error);
      }

      if (!data)
        this.$router.push({
          path: "/tao-de-xuat",
        });
      this.order = data.data.data;
      this.data = await data.data.data.OrderMeta.filter((a) => a.STT).sort(
        (a, b) => a.STT - b.STT
      );
      console.log("data", this.data);
    },
    // xác nhận gửi requests từ đầu khi trạng thái hủy -- createdby HTH(2020/12/10)
    async updatedOrderMeta() {
      let fullName = this.userInfo.lastName;
      let phoneNumber = this.userInfo.PHONE == null ? " " : this.userInfo.PHONE;
      let selection = this.metaValue.selection;
      let department = this.nameDepartmentName.NAME.toString();
      this.updateOrderMeta({
        ...this.order.OrderMeta[0],
        metaValue: JSON.stringify([this.metaValue]),
        fullName,
        phoneNumber,
        selection,
        department,
      });
      await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
      await this.deleteRequest(this.order.id);
      location.reload();
    },
    // Tạo  mặc địh 5 bản ghi ảo để thêm ADD
    async initNewRow() {
      if (this.order.intendedUse != null) {
        console.log("abc");
        this.dataAddRow = [];
        for (let i = 0; i < 5; i++) {
          await this.dataAddRow.push({
            STT: ++this.order.OrderMeta.length - 1,
            fullName: this.userInfo.lastName,
            department: this.nameDepartmentName.NAME.toString(),
            phoneNumber:
              this.userInfo.PHONE == null ? " " : this.userInfo.PHONE,
            position: this.userInfo.position,
            tenVT: null,
            maVT: null,
            number: null,
            donViTinh: null,
            yeuCauKyThuat: null,
            xuatXu: null,
            stepDepartment: null,
            orderId: this.$route.query.id, // tạo thêm id của phiếu
          });
        }
        console.log("this.dataAddRow", this.dataAddRow);
        if (this.resultData.length > 0) {
          await this.acceptAdd();
          this.dataAddRow = [];
        } else {
          this.activeFormAdd = true;
        }
      } else {
        Notify.create({
          message:
            "Vui lòng nhập thông tin mục đích sử dụng và bộ phận mua hàng !",
          color: "red",
        });
        this.loadData(this.$route.query.id);
      }
    },
  },
};
</script>
<style lang="sass">
#drop
  border: 2px dashed #bbb
  -moz-border-radius: 5px
  -webkit-border-radius: 5px
  border-radius: 5px
  padding: 25px
  text-align: center
  font: 20pt bold, "Vollkorn"
  color: #bbb

.my-sticky-header-table
  /* height or max-height is important */

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
</style>
<style>
table,
td,
th {
  border: 1px solid;
}

table {
  width: 100%;
  border-collapse: collapse;
}
</style>