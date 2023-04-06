<template>
  <q-card-section>
    <div class="body">
      <div class="row">
        <q-input
          class="q-mt-sm col"
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
        <q-input
          class="q-mt-sm col"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="disable"
        />
        <q-input
          class="q-mt-sm col"
          outlined
          v-model="proAccount[0].PHONE"
          label="SĐT : "
          :readonly="disable"
        />
      </div>
        <q-input
          class="q-mt-sm "
          outlined
          v-model="order.intendedUse"
          label="Mục đích sử dụng : "
          :readonly="disable"
        />
        <div class="q-mt-sm">
          <DxDataGrid
            id="gridContainer"
            :data-source="
              order.OrderMeta.filter(e => e.STT).sort((a, b) => a.STT - b.STT)
            "
            :allow-column-reordering="true"
            :show-borders="true"
            :show-row-lines="true"
            :word-wrap-enabled="true"
          >
            <DxPaging :enabled="true" />
            <DxExport :enabled="true" />
            <DxColumn data-field="STT" caption="STT" width = "45" />
            <DxColumn caption="Mã VT" data-field="maVT" />
            <DxColumn caption="Tên vật tư" data-field="tenVT" />
            <DxColumn caption="Yêu cầu kỹ thuật" data-field="yeuCauKyThuat" />
            <DxColumn caption="Xuất xứ" data-field="xuatXu" />
            <DxColumn caption="ĐVT" data-field="donViTinh" />
            <DxColumn data-field="number" caption="Số lượng"> </DxColumn>
            <DxColumn caption="Bộ phận sử dụng" data-field="stepDepartment" />
            <DxColumn caption="Mục đích sử dụng" data-field="mucDichSuDung" />
            <template #cellTemplate="cell">
              <div v-if="cell.data.data.maVT">{{ cell.data.rowIndex + 1 }}</div>
            </template>
          </DxDataGrid>
        </div>
        
      </div>
    </div>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// import { Workbook } from "exceljs";
// import saveAs from "file-saver";
// import { exportDataGrid } from "devextreme/excel_exporter";
import moment from "moment";
import DxButton from "devextreme-vue/button";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
  DxExport
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxLookup,
    DxExport
  },
  props: ["metaValue", "disable"],
  async created() {

    

    console.log("account", await this.getAllAccounts());
    let accountALL = await this.getAllAccounts();
    this.proAccount = accountALL.filter(e => e.id == this.order.accountId);
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(
      this.order.departmentId
    );
    console.log("acocountpro", this.proAccount);
    console.log("nameDepartmentName", this.nameDepartmentName);
    this.status = this.$route.query.status;
    console.log("status", this.status);
    console.log("dsCongDoans", this.dsCongDoans);
    console.log("userInfo", this.userInfo);
    this.nameDepartment = this.dsCongDoans.find(
      e => e.id == this.userInfo.departmentId
    );
    console.log("a", this.nameDepartment);
    // if (this.$route.query.id) {
    //   this.getOneOrder(this.$route.query.id).then(res => {
    //     if (res.data.data.Requests.length) this.disable = true;
    //     this.metaValue = Object.assign(
    //       this.metaValue,
    //       JSON.parse(res.data.data.OrderMeta[0].metaValue)[0]
    //     );
    //   });
    // } else {
    //   this.$router.push({
    //     path: "/tao-de-xuat"
    //   });
    // }
  },
  data() {
    return {
      events: [],
      nameDepartment: {},
      status: "",
      phoneNumber: "",
      proAccount: null,
      nameDepartmentName: null
    };
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo", "dsCongDoans"])
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
      "addorderMeta",
      "deleteOrderMeta",
      "updateOrderMeta"
    ]),
    // exportGrid(e) {
    //   let LastName = this.proAccount[0].lastName;
    //   let position = this.proAccount[0].position;
    //   let phone = this.proAccount[0].PHONE == undefined ? ' ' :this.proAccount[0].PHONE ;
    //   const workbook = new Workbook();
    //   const worksheet = workbook.addWorksheet("Phiếu 1");
    //   exportDataGrid({
    //     worksheet: worksheet,
    //     component: e.component
    //   }).then(function() {
    //     workbook.xlsx.writeBuffer().then(function(buffer) {
    //       saveAs(
    //         new Blob([buffer], { type: "application/octet-stream" }),
    //         "Phiếu mua hàng Ngày " +
    //           moment().format("L") +
    //           "_" +
    //           LastName +
    //           "_" +
    //           position +
    //           "_" +
    //           phone +
    //           ".xlsx"
    //       );
    //     });
    //   });
    //   e.cancel = true;
    // }
  }
};
</script>
<style scoped>
.body {
  font-family: "Times New Roman", Times, serif !important;
}
</style>
