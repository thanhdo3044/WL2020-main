<template>
  <q-page class="q-pa-md q-gutter-sm">
    <q-banner class="bg-blue-grey text-orange">
      <div class="text-h6 orange">
        <span color="orange">Báo cáo cấp phôi theo lệnh sản xuất - {{myFactoryInfor.name}}</span>
      </div>
    </q-banner>
    <div>
      <div class="row">
        <div class="col-12 col-md-2 q-pa-sm">
          <q-select
            outlined
            dense
            v-model="model"
            :options="getAllCongDoan"
            label="Công đoạn"
            label-color="orange"
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-md-2 q-pa-sm">
          <q-input dense color="grey-3" label-color="orange" outlined v-model="week" label="Tuần">
            >
            <template v-slot:append>
              <q-icon name="next_week" color="orange" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-2 q-pa-sm">
          <q-input dense color="grey-3" label-color="orange" outlined v-model="soLenh" label="Số lệnh">
            <template v-slot:append>
              <q-icon name="work" color="orange" />
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <DxDataGrid
      id="gridPo"
      :show-borders="true"
      :data-source="posFiltered"
      :repaint-changes-only="true"
      :column-auto-width="true"
    >
      <DxColumnChooser :enabled="true" />
      <DxHeaderFilter :visible="true" />
      <DxGroupPanel
        :visible="true"
        :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
      />
      <DxScrolling mode="infinite" />
      <DxExport :enabled="true" file-name="Tao phoi" />
      <DxSearchPanel :visible="true" :width="440" placeholder="Tìm sản phẩm" />
      <DxColumn
        data-field="number"
        caption="Lệnh sản xuất"
        :group-index="0"
        :sort-index="0"
        sort-order="desc"
      />
      <!-- <DxColumn
        data-field="Department.name"
        caption="Công đoạn"
        :group-index="1"
        :sort-index="1"
        sort-order="desc"
      />-->
      <DxColumn data-field="number" caption="PO" />
      <DxColumn data-field="Item.name" caption="SP/Chi tiết" />
      <DxColumn caption="Qui Cách" alignment="center">
        <DxColumn data-field="Item.height" caption="Dày" />
        <DxColumn data-field="Item.width" caption="Rộng" />
        <DxColumn data-field="Item.length" caption="Dài" />
      </DxColumn>
      <DxColumn
        data-field="keHoach"
        caption="KHĐG"
        data-type="number"
        format="fixedpoint"
        alignment="center"
      />
      <DxColumn data-field="ngay" caption="Ngày" />
      <!-- <DxColumn
        data-field="ton"
        caption="Tồn"
        data-type="number"
        format="fixedpoint"
        alignment="center"
      /> -->
      <DxColumn data-field="quantity" format="#,##0" caption="Cần SX" />
      <DxColumn data-field="Item.volumn" format="#,##0.00" caption="Khối lượng" />
      <DxColumn data-field="Item.heSo" caption="Hệ số" />
      <DxColumn data-field="soPhoiCanCap" width="120" format="#,##0.00" caption="Số phôi cần cấp" />
      <DxColumn data-field="daCap" caption="Trạng thái" />
      <DxSummary>
        <DxGroupItem
          column="soPhoiCanCap"
          summary-type="sum"
          value-format="#,##0.0000"
          display-format="Tổng khối lượng: {0}"
        />
      </DxSummary>
    </DxDataGrid>
  </q-page>
</template>

<script>
import CustomStore from "devextreme/data/custom_store";
import DxButton from "devextreme-vue/button";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
  DxSearchPanel,
  DxHeaderFilter,
  DxScrolling,
  DxExport,
  DxFilterRow,
  DxSummary,
  DxGroupItem,
  DxColumnChooser,
  DxGroupPanel,
} from "devextreme-vue/data-grid";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      week: "",
      soLenh: "",
      model: null,
      refreshMode: "full",
      refreshModes: ["full", "reshape", "repaint"],
    };
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor"]),
    ...mapGetters("po", ["pos", "getAllCongDoan"]),
    posFiltered() {
      let posFilter = this.pos.filter((po) => !(po.Item === null));
      if (this.week.length)
        posFilter = posFilter.filter((po) => po.week == this.week);
      if (this.soLenh.length)
        posFilter = posFilter.filter((po) => po.number.includes(this.soLenh));
      if (this.model)
        posFilter = posFilter.filter((po) => po.stepId == this.model);
      return posFilter.map((po) =>
        Object.assign(po, {
          daCap: po.capPhoi ? "Đã duyệt" : po.taoPhoi ? "Chờ duyệt" : "",
          poN: `PO${po.code}`,
          soPhoiCanCap: po.Item.heSo * po.quantity * po.Item.volumn,
          ngay: moment(po.ngayDongGoi)
            .subtract(Math.ceil(po.thoiGianBatDau + po.thoiGianCho), "days")
            .format("L"),
        })
      );
    },
  },
  methods: {
    ...mapActions("po", ["getAllPos", "taoPhoi"]),
  },
  created() {
    const payload = {
      factoryId: this.myFactoryInfor.id,
    };
    this.getAllPos(payload);
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxLookup,
    DxSearchPanel,
    DxHeaderFilter,
    DxScrolling,
    DxExport,
    DxFilterRow,
    DxSummary,
    DxGroupItem,
    DxColumnChooser,
    DxGroupPanel,
  },
};
</script>
