<template>
  <q-card-section>
    <div class="q-gutter-sm text-primary text-h6">
      Chọn loại mẫu biên bản bàn giao :
    </div>
    <div class="q-gutter-sm q-mt-sm">
      <q-radio
        dense
        v-model="metaValue.selection"
        val="Biên bản bàn giao"
        label="Biên bản bàn giao"
        color="teal"
      />
    </div>
    <div v-if="metaValue.selection == 'Biên bản bàn giao'">
      <div class="q-mt-sm">Nội dung bàn giao :</div>
      <DxDataGrid
        id="gridContainer"
        :data-source="order.OrderMeta"
        :allow-column-reordering="true"
        :show-borders="true"
        :show-row-lines="true"
        :word-wrap-enabled="true"
        @row-inserted="RowInserted"
        @row-updated="RowUpdated"
        @row-removed="RowDelted"
      >
        <DxPaging :enabled="true" />
        <DxEditing
          :allow-updating="true"
          :allow-deleting="true"
          :allow-adding="true"
          mode="row"
        />
        <DxColumn data-field="STT" caption="STT" />
        <DxColumn caption="Nội dung" data-field="mucDichSuDung" />
        <DxColumn caption="Số lượng" data-field="number" data-type="number" />
        <DxColumn caption="Ghi chú" data-field="description" />
      </DxDataGrid>
    </div>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DxButton from "devextreme-vue/button";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup
} from "devextreme-vue/data-grid";

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxLookup
  },
  props: ["metaValue", "disable", "order"],
  created() {},
  data() {
    return {
      events: [],
      nameDepartment: {},
      status: "",
      phoneNumber: "",
      nameDepartment: null,
      events: []
    };
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    // ...mapActions("base",["GET_DEPARTMENTSBYID"]),
    ...mapGetters("base", ["userInfo", "dsCongDoans"])
  },
  methods: {
    ...mapActions("base", ["GET_DEPARTMENTSBYID"]),
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      "addorderMeta",
      "deleteOrderMeta",
      "updateOrderMeta"
    ]),
    RowInserted(e) {
      console.log(e);
      let STT = e.data.STT;
      // let maVT = e.data.maVT
      // let tenVT = e.data.tenVT
      // let yeuCauKyThuat = e.data.yeuCauKyThuat
      // let mucDichSuDung = e.data.mucDichSuDung
      // let donViTinh = e.data.donViTinh
      let fullName = this.userInfo.lastName;
      let number = e.data.number;
      let phoneNumber = this.userInfo.PHONE;
      let selection = this.metaValue.selection;
      // let department = this.nameDepartmentName.NAME.toString()
      this.addorderMeta({
        ...this.order.OrderMeta[0],
        metaValue: JSON.stringify([]),
        selection,
        STT,
        fullName,
        number,
        phoneNumber
      });
    },
    RowDelted(e) {
      console.log(e);
      this.deleteOrderMeta(e.data.id);
    },
    RowUpdated(e) {
      console.log(e);
      let STT = e.data.STT;
      // let maVT = e.data.maVT
      // let tenVT = e.data.tenVT
      // let yeuCauKyThuat = e.data.yeuCauKyThuat
      // let mucDichSuDung = e.data.mucDichSuDung
      let fullName = this.userInfo.lastName;
      let number = e.data.number;
      let phoneNumber = this.userInfo.PHONE;
      let donViTinh = e.data.donViTinh;
      let selection = this.metaValue.selection;
      // let department = this.nameDepartmentName.NAME.toString()
      this.updateOrderMeta({
        ...this.order.OrderMeta[0],
        metaValue: JSON.stringify([]),
        selection,
        STT,
        fullName,
        number,
        donViTinh,
        phoneNumber
      });
    }
  }
};
</script>
