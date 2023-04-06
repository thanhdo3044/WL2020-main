<template>
  <q-card-section>
    <div v-if="order.status == 'Không được duyệt'">
      <div class="row q-mb-sm">
        <q-input
          class="q-mt-sm q-pr-sm col"
          outlined
          v-model="userInfo.lastName"
          label="Tên tôi là : "
          :readonly="!disable"
        />
        <q-input
          class="q-mt-sm col"
          outlined
          v-model="userInfo.position"
          label="Chức danh : "
          :readonly="disable"
        />
        <q-input
          class="q-mt-sm q-pr-sm col"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="!disable"
        />
        <q-input
          filled
          class="q-mt-sm col"
          outlined
          v-model="userInfo.PHONE"
          label="SĐT : "
          :readonly="!disable"
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
      <q-btn
        class="q-mt-sm"
        v-on:click="updatedOrderMeta"
        color="primary"
        text-color="white"
        label="Sửa"
      />
    </div>
    <div v-else>
      <div class="row q-mb-sm">
        <q-input
          class="q-mt-sm q-pr-sm col"
          outlined
          v-model="userInfo.lastName"
          label="Tên tôi là : "
          :readonly="disable"
        />
        <q-input
          class="q-mt-sm q-pr-sm col"
          outlined
          v-model="userInfo.position"
          label="Chức danh : "
          :readonly="disable"
        />
        <q-input
          class="q-mt-sm q-pr-sm col"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="disable"
        />
        <q-input
          filled
          class="q-mt-sm col"
          outlined
          v-model="userInfo.PHONE"
          label="SĐT : "
          :readonly="true"
        />
      </div>

      <div class="">
        <q-table
          @row-click="click"
          class="my-sticky-header-column-table bg-yellow-1"
          title="Nội dung đề xuất"
          :data="data"
          :columns="columns"
          row-key="name"
          :separator="separator"
        >
        </q-table>
        <q-btn
          style="z-index:99"
          v-show="!disable"
          class="q-mt-lg q-mb-sm float-right"
          v-on:click="initNewRow"
          color="primary"
          text-color="white"
          label="Thêm"
        />
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
          <div class="row">
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col"
              outlined
              :readonly="true"
              v-model="task.STT"
              label="STT : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col"
              outlined
              v-model="task.maVT"
              label="Mã vật tư : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col"
              outlined
              v-model="task.tenVT"
              label="Tên vật tư : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col"
              outlined
              v-model="task.donViTinh"
              label="Đơn vị tính : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-2"
              outlined
              v-model="task.number"
              type="number"
              placeholder="Vui lòng nhập số"
              label="Số lượng : "
            />

            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col"
              outlined
              v-model="task.yeuCauKyThuat"
              label="Yêu cầu kỹ thuật : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col"
              outlined
              v-model="task.mucDichSuDung"
              label="Mục đích sử dụng : "
            />
          </div>
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
              class="q-mt-sm q-pl-sm q-pr-sm col"
              :readonly="true"
              outlined
              v-model="task.STT"
              label="STT : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col"
              outlined
              v-model="task.maVT"
              label="Mã vật tư : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col"
              outlined
              v-model="task.tenVT"
              label="Tên vật tư : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col"
              outlined
              v-model="task.donViTinh"
              label="Đơn vị tính : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col-2"
              outlined
              v-model="task.number"
              type="number"
              placeholder="Vui lòng nhập số"
              label="Số lượng : "
            />

            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col"
              outlined
              v-model="task.yeuCauKyThuat"
              label="Yêu cầu kỹ thuật : "
            />
            <q-input
              class="q-mt-sm q-pl-sm q-pr-sm col"
              outlined
              v-model="task.mucDichSuDung"
              label="Mục đích sử dụng : "
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
import { mapGetters, mapActions } from "vuex";
import DxButton from "devextreme-vue/button";
import axios from "axios";
import { Notify, Loading, QSpinnerIos } from "quasar";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
  DxFilterRow
} from "devextreme-vue/data-grid";

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxLookup,
    DxFilterRow
  },
  props: ["metaValue", "disable", "order"],
  async created() {
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(
      this.userInfo.department
    );
    console.log("this.nameDepartmentName", this.nameDepartmentName.NAME);
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
      disabledToggle: false,
      computerEquipment2: null,
      priorityLevel2: null,
      separator: "cell",
      selected: [],
      events: [],
      nameDepartment: {},
      status: "",
      phoneNumber: "",
      nameDepartmentName: null,
      dataAddRow: [],
      activeFormAdd: false,
      activeFormEdit: false,
      task: {
        maVT: null,
        tenVT: null,
        yeuCauKyThuat: null,
        mucDichSuDung: null,
        number: null,
        donViTinh: null,
        id: null,
        STT: null
      },
      columns: [
        {
          name: "STT",
          required: true,
          label: "STT",
          align: "left",
          field: row => (row.STT == null ? "" : row.STT),
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "maVT",
          required: true,
          label: "Mã vật tư",
          align: "left",
          field: row => (row.maVT == null ? "" : row.maVT),
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "tenVT",
          required: true,
          label: "Tên vật tư",
          align: "left",
          field: row => (row.tenVT == null ? "" : row.tenVT),
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "Số lượng",
          required: true,
          label: "Số lượng",
          align: "left",
          field: row => (row.number == null ? "" : row.number),
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "Đơn vị",
          required: true,
          label: "Đơn vị",
          align: "left",
          field: row => (row.donViTinh == null ? "" : row.donViTinh),
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "Yêu cầu kỹ thuật",
          required: true,
          label: "Yêu cầu kỹ thuật",
          align: "left",
          field: row => (row.yeuCauKyThuat == null ? "" : row.yeuCauKyThuat),
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "Mục đích sử dụng",
          required: true,
          label: "Mục đích sử dụng",
          align: "left",
          field: row => (row.mucDichSuDung == null ? "" : row.mucDichSuDung),
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "Trạng thái phê duyệt",
          required: true,
          label: "Trạng thái phê duyệt",
          align: "left",
          text: "red",
          field: row => (row.statusRequests == null ? "" : row.statusRequests),
          format: val => `${val}`,
          sortable: true
        }
      ],
      data: []
    };
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    // ...mapActions("base",["GET_DEPARTMENTSBYID"]),
    ...mapGetters("base", ["userInfo", "dsCongDoans"])
  },
  watch: {
    selected(newSelected, oldSelected) {
      console.log("selected", this.selected);
      console.log("oldValue", oldSelected);
      console.log("newValue", newSelected);
      // return this.selected.length === 0 ? '' : `${this.selected.length} bản ghi được chọn `
    }
  },
  methods: {
    ...mapActions("base", ["GET_DEPARTMENTSBYID"]),
    ...mapActions("orders", [
      "getOneOrder",
      "getAllRequests",
      "confirmPriorityLevel",
      "confirmComputerEquipment"
    ]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      ,
      "addMulRow",
      "addorderMeta",
      "deleteOrderMeta",
      "updateOrderMeta"
    ]),
    ...mapActions("requests", ["deleteRequest", "resetOrder"]),
    async confimPriorityLevel(value, evt) {
      console.log(value);
      console.log(evt);
      let payload = {
        id: this.$route.query.id,
        priorityLevel: value ? 1 : 0
      };
      if (this.order.Requests.length > 0) {
        this.disabledToggle = true;
        Notify.create({
          message: "Không được sửa vì đã gửi đi chờ xem xét !",
          color: "orange"
        });
      } else {
        let data = await this.confirmPriorityLevel(payload);
        await this.loadData(this.$route.query.id);
        console.log("dataconfimlevel", data);
      }
    },
    async confimComputerEquipment(value, evt) {
      console.log(value);
      let payload = {
        id: this.$route.query.id,
        computerEquipment: value ? 1 : 0
      };
      let data = await this.confirmComputerEquipment(payload);
      await this.loadData(this.$route.query.id);
    },
    click(evt, row, index) {
      console.log("evt", evt);
      console.log("row", row);
      console.log("index", index);
      this.task.tenVT = row.tenVT;
      this.task.maVT = row.maVT;
      this.task.yeuCauKyThuat = row.yeuCauKyThuat;
      this.task.mucDichSuDung = row.mucDichSuDung;
      this.task.number = row.number;
      this.task.donViTinh = row.donViTinh;
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
          color: "orange"
        });
      } else if (
        this.order.Requests.length == 0 &&
        row.statusRequests == "Xem xét"
      ) {
        this.activeFormEdit = true;
      } else {
        Notify.create({
          message: "Không được chỉnh sửa do đã được phê duyệt !",
          color: "blue"
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
      let mucDichSuDung = this.task.mucDichSuDung;
      let fullName = this.userInfo.lastName;
      let number = this.task.number;
      let phoneNumber = this.userInfo.PHONE;
      let donViTinh = this.task.donViTinh;
      let id = this.task.id;
      let department = this.nameDepartmentName.NAME.toString();
      await this.updateOrderMeta({
        ...this.order.OrderMeta[0],
        metaValue: JSON.stringify([this.metaValue]),
        maVT,
        tenVT,
        fullName,
        yeuCauKyThuat,
        mucDichSuDung,
        number,
        donViTinh,
        phoneNumber,
        department,
        id
      });
      await this.loadData(this.$route.query.id);
    },
    // Add Multi records createdby HTH(2020/12/10)
    async acceptAdd() {
      console.log(
        "dataaAdd",
        this.dataAddRow.filter(e => e.maVT)
      );
      let dataAdd = await this.dataAddRow.filter(e => e.maVT);
      let result = await this.addMulRow(dataAdd);
      console.log("result", result);
      this.loadData(this.$route.query.id);
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
          path: "/tao-de-xuat"
        });
      this.order = data.data.data;
      this.data = await data.data.data.OrderMeta.filter(a => a.maVT).sort(
        (a, b) => a.STT - b.STT
      );
      console.log("data", this.data);
    },
    // xác nhận gửi requests từ đầu khi trạng thái hủy -- createdby HTH(2020/12/10)
    async updatedOrderMeta() {
      let fullName = this.userInfo.lastName;
      let phoneNumber = this.userInfo.PHONE;
      let selection = this.metaValue.selection;
      let department = this.nameDepartmentName.NAME.toString();
      this.updateOrderMeta({
        ...this.order.OrderMeta[0],
        metaValue: JSON.stringify([this.metaValue]),
        fullName,
        phoneNumber,
        selection,
        department
      });
      await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
      await this.deleteRequest(this.order.id);
      location.reload();
    },
    // Tạo  mặc địh 5 bản ghi ảo để thêm ADD
    async initNewRow() {
      console.log("abc");
      this.dataAddRow = [];
      for (let i = 0; i < 5; i++) {
        await this.dataAddRow.push({
          STT: ++this.order.OrderMeta.length - 1,
          fullName:this.userInfo.lastName,
          department:this.nameDepartmentName.NAME.toString(),
          phoneNumber:this.userInfo.PHONE,
          position:this.userInfo.position,
          tenVT: null,
          maVT: null,
          number: null,
          donViTinh: null,
          yeuCauKyThuat: null,
          orderId: this.$route.query.id // tạo thêm id của phiếu
        });
      }
      console.log("this.dataAddRow", this.dataAddRow);
      this.activeFormAdd = true;
    }
  }
};
</script>
<style lang="sass">
.my-sticky-header-column-table
  /* height or max-height is important */
  height: auto

  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 100%

  td:first-child
    /* bg color is important for td; just specify one */
    background-color: #c1f4cd !important

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #fff

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child
    /* highest z-index */
    z-index: 3

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    position: sticky
    left: 0
</style>
