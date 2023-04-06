<template>
  <div>
    <q-banner class="bg-primary text-orange">
      <div class="text-h6">Thống kê chi tiết phiếu xin nghỉ việc</div>
    </q-banner>
    <div class="q-ma-lg">
      <DxDataGrid
        :allow-column-reordering="true"
        :data-source="
          customers.data.filter(
            e => e.slug == 'di-cong-tac' && e.status == 'Đã được duyệt'
          )
        "
        :show-borders="true"
        :hover-state-enabled="true"
        :show-row-lines="true"
      >
        <DxExport :enabled="true" :allow-export-selected-data="true" />
        <DxFilterRow :visible="true" />
        <DxFilterPanel :visible="true" />
        <DxHeaderFilter :visible="true" />
        <DxColumn data-field="Department.name" caption="Phòng ban" />
        <DxColumn data-field="Account.lastName" caption="Họ và Tên" />
        <DxColumn data-field="OrderMeta[0].description" caption="Lý do" />
        <DxColumn data-field="OrderMeta[0].dateStart" caption="Thời gian từ" />
        <DxColumn data-field="OrderMeta[0].dateEnd" caption="Thời gian đến" />
        <DxColumn
          data-field="OrderMeta[0].locationWork"
          caption="Nơi công tác"
        />
        <DxColumn data-field="status" caption="Trạng thái" />
        <DxColumn
          :group-index="0"
          caption="Mã nhân viên"
          data-field="Account.account"
          value="Account.account"
        />

        <DxGroupPanel :visible="true" />
        <DxGrouping :auto-expand-all="autoExpandAll" />
        <DxPaging :page-size="1000" />
        <DxSearchPanel :visible="true" />
      </DxDataGrid>

      <div class="options">
        <div class="caption">Tùy chọn</div>
        <div class="option">
          <DxCheckBox
            v-model:value="autoExpandAll"
            text="Ẩn hiện chi tiết dữ liệu"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DxCheckBox from "devextreme-vue/check-box";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxSearchPanel,
  DxPaging,
  DxHeaderFilter,
  DxFilterRow,
  DxFilterPanel,
  DxExport
} from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
export default {
  components: {
    DxCheckBox,
    DxColumn,
    DxGroupPanel,
    DxGrouping,
    DxPaging,
    DxSearchPanel,
    DxDataGrid,
    DxHeaderFilter,
    DxFilterRow,
    DxFilterPanel,
    DxExport
  },
  data() {
    return {
      autoExpandAll: true,
      customers: null
    };
  },
  methods: {
    ...mapActions("orders", ["getAllOrders", "getAllOrder", "activeSeenOrder"])
  },
  async created() {
    this.customers = await this.getAllOrder();
    console.log(this.customers.data);
  }
};
</script>
<style scoped>
.options {
  padding: 20px;
  margin-top: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}
</style>
