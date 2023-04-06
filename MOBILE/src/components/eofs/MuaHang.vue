<template>
  <q-card-section>
    <div>
      <div class="row">
        <q-input
          class="q-mt-sm q-mr-sm col"
          outlined
          v-model="getAccountById(order.accountId).lastName"
          label="Tên tôi là : "
          :readonly="disable"
        />
        <q-input
          class="q-mt-sm col"
          outlined
          v-model="getAccountById(order.accountId).position"
          label="Chức danh : "
          :readonly="disable"
        />
      </div>
      <div class="row">
        <q-input
          class="q-mt-sm q-mr-sm col"
          outlined
          v-model="getDepartmentById(order.departmentId).name"
          label="Phòng ban/bộ phận : "
          :readonly="disable"
        />
        <q-input
          filled
          class="q-mt-sm col"
          outlined
          v-model="getAccountById(order.accountId).PHONE"
          label="SĐT : "
          :readonly="disable"
        />
      </div>
      <div class="row">
        <q-input
          filled
           type="textarea"
          class="q-mt-sm col"
          outlined
          v-model="order.intendedUse"
          label="Mục đích sử dụng : "
          :readonly="!disable"
        />
      </div>
      <div class="q-mt-sm">
        <q-table
          @row-click="click"
          class="my-sticky-header-table"
          title="Nội dung đề xuất"
          :data="
            order.OrderMeta.filter(e => e.STT).sort((a, b) => a.STT - b.STT)
          "
          :columns="columns"
          row-key="name"
          :separator="separator"
          style="height:auto"
        >
          <template v-slot:body="props">
            <q-tr @request="click(props)" :props="props">
              <q-td width="30" key="STT" :props="props">{{
                props.row.STT
              }}</q-td>
              <q-td key="maVT" :props="props">{{ props.row.maVT }}</q-td>
              <q-td key="tenVT" :props="props">{{ props.row.tenVT }}</q-td>
              <q-td key="yeuCauKyThuat" :props="props"
                >{{ props.row.yeuCauKyThuat }}
                <q-popup-edit v-model="props.row.yeuCauKyThuat">
                  <q-input
                    @change="click(props)"
                    v-model="props.row.yeuCauKyThuat"
                    dense
                    autofocus
                    counter
                  />
                </q-popup-edit>
              </q-td>
              <q-td key="xuatXu" :props="props">{{
                props.row.xuatXu
              }}</q-td>
              <q-td key="donViTinh" :props="props">{{
                props.row.donViTinh
              }}</q-td>
              <q-td key="number" :props="props">{{ props.row.number }}</q-td>

              
              <q-td key="boPhanSuDung" :props="props">{{
                props.row.stepDepartment
              }}</q-td>
              <q-td key="mucDichSuDung" :props="props">{{
                props.row.mucDichSuDung
              }}</q-td>
              
              <q-td key="statusRequests" :props="props">
                <!-- <q-radio class="q-mr-sm" dense @input="activeReq(props)" v-model="statusRequestsXemXet" val="0" label="Xx" />
                <q-radio class="q-mr-sm" dense @input="activeReq(props)" v-model="statusRequestsOk" val="1" label="Pd" />
                <q-radio class="q-mr-sm" dense @input="activeReq(props)" v-model="statusRequestsCancel" val="2" label="H" /> -->
                <q-select
                  filled
                  @input="activeReq(props)"
                  v-model="props.row.statusRequests"
                  :options="optionStatusReq"
                  label="Trạng thái phê duyệt"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <!-- <q-btn
          style="z-index:99"
          v-show="!disable"
          class="q-mt-sm q-mb-sm float-right"
          v-on:click="initNewRow"
          color="primary"
          text-color="white"
          label="Thêm"
        /> -->
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
                  v-model="task.yeuCauKyThuat"
                  label="Yêu cầu kỹ thuật : "
                />
                <q-input
                  class="q-mt-sm q-pl-sm q-pr-sm col"
                  outlined
                  v-model="task.xuatXu"
                  label="Yêu cầu kỹ thuật : "
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
                  v-model="task.mucDichSuDung"
                  label="Mục đích sử dụng : "
                />
              </div>
            </q-card-section>
            <!-- <q-card-actions align="right">
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
            </q-card-actions> -->
          </q-card>
        </q-dialog>
      </div>
    </div>
    <footerCard
      :order="order"
      :nextId2="nextId2"
      :nextId3="nextId3"
      :nextId="nextId"
    ></footerCard>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import footerCard from "components/eofs/Shared/footerCard";

import axios from "axios";
import { Notify, Loading, QSpinnerIos } from "quasar";

export default {
  components: {
    footerCard
  },
  props: ["metaValue", "disable", "nextId2", "nextId3", "nextId"],
  async created() {
    // this.order.Requests.sort(this.compareValues("star", "asc"));
    // let idDis = null;
    // for (let i = 0; i < this.order.Requests.length; i++) {
    //   if (this.order.Requests[i].id == this.$route.query.id) {
    //     console.log(this.order.Requests[i]);
    //     idDis = this.order.Requests[i].star;
    //     console.log("idDis", idDis);
    //   }
    // }
    // this.nextId = this.order.Requests.find(e => e.star > idDis);
    // console.log("data", this.nextId);
    // this.nextId2 = this.order.Requests.filter(
    //   e => e.star > this.request.star && e.position != "Phòng vật tư"
    // );
    // this.nextId3 = this.order.Requests.filter(
    //   e =>
    //     e.star > this.request.star &&
    //     (e.position == "Phòng vật tư" || e.position == "Phòng bảo vệ")
    // );
    // console.log("this.nextId", this.nextId);
    // console.log("this.nextId2", this.nextId2);
    // console.log("this.nextId3", this.nextId3);
  },
  data() {
    return {
      optionStatusReq: [
        {
          label: "Đồng ý",
          value: 1
        },
        {
          label: "Xem xét",
          value: 0
        },
        {
          label: "Hủy",
          value: 2
        },
        {
          label: "Giải trình bổ sung",
          value: 3
        }
      ],
      nextId2: null,
      nextId3: null,
      statusRequestsXemXet: null,
      statusRequestsOk: null,
      statusRequestsCancel: null,
      modelActionReq: {},
      myDepartment: null,
      stepDepartment: null,
      departments: [],
      events: [],
      options: null,
      nameDepartmentName: null,
      account: [],
      active: false,
      proAccount: {
        lastName: "",
        position: "",
        PHONE: ""
      },
      statusRequests: null,
      separator: "cell",
      selected: [],
      nameDepartment: {},
      status: "",
      phoneNumber: "",
      dataAddRow: [],
      activeFormAdd: false,
      activeFormEdit: false,
      task: {
        maVT: null,
        tenVT: null,
        yeuCauKyThuat: null,
        xuatXu: null,
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
          field: row => row.STT,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "maVT",
          required: true,
          label: "Mã vật tư",
          align: "left",
          field: row => row.maVT,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "tenVT",
          required: true,
          label: "Tên vật tư",
          align: "left",
          field: row => row.tenVT,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "yeuCauKyThuat",
          required: true,
          label: "Yêu cầu kỹ thuật",
          align: "left",
          field: row => row.yeuCauKyThuat,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "xuatXu",
          required: true,
          label: "Xuất xứ",
          align: "left",
          field: row => row.xuatXu,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "donViTinh",
          required: true,
          label: "Đơn vị",
          align: "left",
          field: row => row.donViTinh,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "number",
          required: true,
          label: "Số lượng",
          align: "left",
          field: row => row.number,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "boPhanSuDung",
          required: true,
          label: "Bộ phận sử dụng",
          align: "left",
          field: row => row.stepDepartment,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "mucDichSuDung",
          required: true,
          label: "Mục đích sử dụng",
          align: "left",
          field: row => row.mucDichSuDung,
          format: val => `${val}`,
          sortable: true
        },

        {
          name: "statusRequests",
          required: true,
          label: "Trạng thái phê duyệt",
          align: "left",
          text: "red",
          field: row => row.statusRequests,
          format: val => `${val}`,
          sortable: true
        }
      ],
      data: []
    };
  },
  computed: {
    ...mapGetters("requests", ["request"]),
    ...mapGetters("orders", ["getAccountById", "getDepartmentById", "order"]),
    ...mapGetters("base", ["userInfo", "dsCongDoans"])
  },
  watch: {},
  methods: {
    ...mapActions("base", ["GET_DEPARTMENTSBYID", "getAccountByID"]),
    ...mapActions("orders", [
      "getOneOrder",
      "getAllRequests",
      "getAllAccounts"
    ]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      "addMulRow",
      "addorderMeta",
      "deleteOrderMeta",
      "updateOrderMeta"
    ]),
    ...mapActions("requests", [
      "deleteRequest",
      "resetOrder",
      "activeRequestsMeta"
    ]),
    async activeReq({ row }) {
      console.log("data", row);
      console.log("this.props.row.statusRequests", row.statusRequests);

      let payload = {
        id: row.id,
        statusRequests: row.statusRequests.label
      };
      let data = await this.activeRequestsMeta(payload);
      console.log(data);
    },

    compareValues(key, order = "asc") {
      return function(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // nếu không tồn tại
          return 0;
        }

        const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
        const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order == "desc" ? comparison * -1 : comparison;
      };
    },
    async click({ row }) {
      console.log("requestProp", row);
      console.log("requests", this.request);

      //phần quyền chỉnh sửa - xóa yêu cầu kỹ thuật : created by HTH (2020/12/10)
      if (
        this.request.position == "Trưởng phòng IT" &&
        (this.order.status == "Chưa ký" || this.order.status == "Không")
      ) {
        let yeuCauKyThuat = row.yeuCauKyThuat;
        let id = row.id;
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          yeuCauKyThuat,
          id
        });
        // await this.loadData(this.order.id);
      } else if (
        this.request.position == "Trưởng phòng IT" &&
        this.request.status == "Đã ký"
      ) {
        Notify.create({
          message: "Chỉnh sửa thất bại do Đã  phê duyệt !",
          color: "orange"
        });
        // await this.loadData(this.order.id);
      } else {
        Notify.create({
          message: "Chỉnh sửa thất bại do không được cấp quyền !",
          color: "blue"
        });
        // await this.loadData(this.order.id);
      }
      //end ------------- (2020/12/10)
    }
  }
};
</script>
<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

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
