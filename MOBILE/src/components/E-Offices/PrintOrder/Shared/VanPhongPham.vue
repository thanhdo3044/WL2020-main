<template>
  <q-card-section>
      <div class="row">
          <q-input

        class="q-ma-sm col"
        outlined
        v-model="order.OrderMeta[0].fullName"
        label="Họ và tên : "
        :readonly="disable"
      />
      <q-input
        class="q-ma-sm col"
        outlined
        v-model="order.OrderMeta[0].position"
        label="Chức vụ : "
        :readonly="disable"
      />
      <q-input
        class="q-ma-sm col"
        outlined
        v-model="order.OrderMeta[0].department"
        label="Phòng ban : "
        :readonly="disable"
      />
      </div>
      
    <DxDataGrid
      id="jskjdkfjkld"
      :data-source="metaValuesFilter"
      :allow-column-reordering="true"
      :show-borders="true"
      :show-row-lines="true"
      :word-wrap-enabled="true"
    >
      <DxColumn data-field="STT" caption="STT" />
      <DxColumn data-field="tenThietBiVP" caption="Tên thiết bị VPP" />
      <DxColumn data-field="donViTinh" caption="ĐVT" />
      <DxColumn data-field="soLuongDeXuat" caption="Số lượng đề xuất" />
      <DxColumn data-field="soLuongCap" caption="Số lượng cấp" />
      <DxColumn caption="Ghi chú" data-field="description" />
    </DxDataGrid>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { DxDataGrid, DxColumn } from "devextreme-vue/data-grid";
export default {
  components: {  DxDataGrid, DxColumn },
  computed: {
    ...mapGetters("orders", ["order"]),
    metaValuesFilter() {
      console.log(this.order);
      if (this.order && this.order.OrderMeta)
        return this.order.OrderMeta.filter(o => o.STT).sort(
          (a, b) => a.STT - b.STT
        );
      return [];
    }
  },
  methods: {
    ...mapActions("orders", ["getOneOrder"]),
    async loadData(id) {
      let data = null;
      try {
        data = await this.getOneOrder(id);
      } catch (error) {
        console.log(error);
      }

      if (!data)
        this.$router.push({
          path: "/phe-duyet"
        });
      this.metaValues = data.data.data.OrderMeta;
      console.log(data);
    }
  }
};
</script>
