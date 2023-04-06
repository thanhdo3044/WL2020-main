<template>
  <q-card-section>
    <div>
      <div class="row">
        <q-input
          class="q-mt-sm q-mr-sm col"
          outlined
          v-model="proAccount[0].lastName"
          label="Tên tôi là : "
          :readonly="disable"
        />
        <q-input
          class="q-mt-sm col"
          outlined
          v-model="proAccount[0].position"
          label="Chức danh : "
          :readonly="disable"
        />
      </div>
      <div class="row">
        <q-input
          class="q-mt-sm q-mr-sm col"
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
          :readonly="!disable"
        />
      </div>
      <div class="q-mt-sm">
        <q-table
          @row-click="click"
          class="my-sticky-header-column-table bg-yellow-1"
          title="Nội dung đề xuất"
          :data="data"
          :columns="columns"
          row-key="name"
          :separator="separator"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="tenVT" :props="props">{{ props.row.tenVT }}</q-td>
              <q-td key="maVT" :props="props">{{ props.row.maVT }}</q-td>
              <q-td key="number" :props="props">{{ props.row.number }}</q-td>
              <q-td key="donViTinh" :props="props">{{
                props.row.donViTinh
              }}</q-td>
              <q-td key="yeuCauKyThuat" :props="props">{{
                props.row.yeuCauKyThuat
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
        <q-btn
          style="z-index:99"
          v-show="!disable"
          class="q-mt-sm q-mb-sm float-right"
          v-on:click="initNewRow"
          color="primary"
          text-color="white"
          label="Thêm"
        />
      </div>
    </div>
    <footerCard :order="order" :nextId="nextId"></footerCard>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DxButton from "devextreme-vue/button";
import footerCard from "components/eofs/Shared/footerCard";

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
    DxFilterRow,
    footerCard
  },
  props: ["metaValue", "disable", "order"],
  async created() {
    this.status = this.$route.query.status;
    this.loadData(this.order.id);
    let accountALL = await this.getAllAccounts();
    this.proAccount = accountALL.filter(e => e.id == this.order.accountId);
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(
      this.order.departmentId
    );
    console.log("acocountpro", this.proAccount);
    console.log("nameDepartmentName", this.nameDepartmentName);
    this.order.Requests.sort(this.compareValues("star", "asc"));
    let idDis = null;
    for (let i = 0; i < this.order.Requests.length; i++) {
      if (this.order.Requests[i].id == this.$route.query.id) {
        console.log(this.order.Requests[i]);
        idDis = this.order.Requests[i].star;
        console.log("idDis", idDis);
      }
    }
    this.nextId = this.order.Requests.find(e => e.star > idDis);
    console.log("data", this.nextId);
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
        }
      ],
      statusRequestsXemXet: null,
      statusRequestsOk: null,
      statusRequestsCancel: null,
      modelActionReq: {},
      myDepartment: null,
      stepDepartment: null,
      departments: [],
      events: [],
      options: null,
      account: [],
      active: false,
      proAccount: null,
      statusRequests: null,
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
        id: null
      },
      columns: [
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
          name: "maVT",
          required: true,
          label: "Mã vật tư",
          align: "left",
          field: row => row.maVT,
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
          name: "donViTinh",
          required: true,
          label: "Đơn vị",
          align: "left",
          field: row => row.donViTinh,
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
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo", "dsCongDoans"])
  },
  watch: {
    selected(newSelected, oldSelected) {
      console.log("selected", this.selected);
      console.log("oldValue", oldSelected);
      console.log("newValue", newSelected);
    }
  },
  methods: {
    ...mapActions("base", ["GET_DEPARTMENTSBYID"]),
    ...mapActions("orders", [
      "getOneOrder",
      "getAllRequests",
      "getAllAccounts"
    ]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      ,
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
        (a, b) => a.createdAt - b.createdAt
      );
      console.log("data", this.data);
    }
  }
};
</script>
<style lang="sass">
.my-sticky-header-column-table
  /* height or max-height is important */
  height: 310px

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
