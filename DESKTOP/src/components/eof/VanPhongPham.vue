<template>
  <q-card>
    <q-card-section>
      <div class="q-gutter-sm text-primary text-h6">
        Chọn loại mẫu cấp VPP :
      </div>
      <div class="q-gutter-sm q-mt-sm">
        <q-radio
          dense
          v-model="metaValue.selection"
          val="Biên bản cấp VPP"
          label="Biên bản cấp VPP"
          color="teal"
        />
      </div>
      <q-input
        class="q-mt-sm"
        outlined
        v-model="userInfo.lastName"
        label="Họ và tên : "
        :readonly="disable"
      />
      <q-input
        class="q-mt-sm"
        outlined
        v-model="userInfo.position"
        label="Chức vụ : "
        :readonly="disable"
      />
      <q-input
        class="q-mt-sm"
        outlined
        v-model="metaValue.department"
        label="Phòng ban : "
        :readonly="disable"
      />
      <DxDataGrid
        id="gridContainer"
        :data-source="order.OrderMeta"
        :allow-column-reordering="true"
        :show-borders="true"
        :show-row-lines="true"
        @editing-start="logEvent('EditingStart')"
        @init-new-row="logEvent('InitNewRow')"
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
        <DxColumn caption="Tên thiết bị văn phòng" data-field="tenThietBiVP" />
        <DxColumn caption="Đơn vị tính" data-field="donViTinh" />
        <DxColumn caption="Số lượng đề xuất" data-field="number" />
        <DxColumn caption="Số lượng đề xuất" data-field="soLuongDeXuat" />
        <DxColumn caption="Số lượng cấp" data-field="soLuongCap" />
        <DxColumn caption="Ghi chú" data-field="description" />
      </DxDataGrid>
    </q-card-section>
  </q-card>
</template>

<script>
import DxButton from "devextreme-vue/button";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup
} from "devextreme-vue/data-grid";
import { mapGetters, mapActions } from "vuex";
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
  created() {
    console.log("metaValue", this.metaValue);
    console.log("order", this.order);
    if (this.$route.query.id) {
      this.getOneOrder(this.$route.query.id).then(res => {
        if (res.data.data.Requests.length) this.disable = true;
        this.metaValue = Object.assign(
          this.metaValue,
          JSON.parse(res.data.data.OrderMeta[0].metaValue)[0]
        );
      });
    } else {
      this.$router.push({
        path: "/tao-de-xuat"
      });
    }
  },
  data() {
    return {
      events: []
    };
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo"])
  },
  methods: {
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      "addorderMeta",
      "deleteOrderMeta",
      "updateOrderMeta"
    ]),
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
      console.log(data);
    },
    async RowInserted(e) {
      console.log("STT", e.data.STT);
      console.log("STT", e.data.id);
      let STT = e.data.STT;
      let tenThietBiVP = e.data.tenThietBiVP;
      let donViTinh = e.data.donViTinh;
      let number = e.data.number;
      let soLuongDeXuat = e.data.soLuongDeXuat;
      let soLuongCap = e.data.soLuongCap;
      let description = e.data.description;
      let fullName = this.userInfo.lastName;
      let position = this.metaValue.department;
      let selection = this.metaValue.selection;
      await this.addorderMeta({
        ...this.order.OrderMeta[0],
        metaValue: JSON.stringify([this.metaValue]),
        fullName,
        selection,
        STT,
        tenThietBiVP,
        donViTinh,
        number,
        soLuongDeXuat,
        soLuongCap,
        description,
        position
      });
      await this.loadData(this.$route.query.id);
    },
   async RowDelted(e) {
      console.log("STT", e.data.STT);
      console.log("STT", e.data.id);
      await this.deleteOrderMeta(e.data.id);
    },
    async RowUpdated(e) {
      console.log("STT", e.data.STT);
      console.log("STT", e.data.id);
      let STT = e.data.STT;
      let tenThietBiVP = e.data.tenThietBiVP;
      let donViTinh = e.data.donViTinh;
      let number = e.data.number;
      let soLuongDeXuat = e.data.soLuongDeXuat;
      let soLuongCap = e.data.soLuongCap;
      let description = e.data.description;
       let department = e.data.description;
      let fullName = this.userInfo.lastName;
      let position = this.userInfo.position;
      let selection = this.metaValue.selection;
      await this.updateOrderMeta({
        ...this.order.OrderMeta[0],
        metaValue: JSON.stringify([this.metaValue]),
        fullName,
        position,
        selection,
        STT,
        tenThietBiVP,
        donViTinh,
        number,
        soLuongDeXuat,
        soLuongCap,
        description
      });
      await this.loadData(this.$route.query.id);
    }
  }
};
</script>
