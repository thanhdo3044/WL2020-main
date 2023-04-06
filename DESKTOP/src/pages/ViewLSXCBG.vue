<template>
  <q-page>
    <q-banner class="text-primary">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div style="margin-top: 34px" class="text-h6">Xem LSX khối CBG - {{ factory.label }}</div>
    </q-banner>
    <q-card-section>
      <DxDataGrid
        id="gridContainer"
        :data-source="getPheDuyets(number)"
        key-expr="id"
        :word-wrap-enabled="true"
        :hover-state-enabled="true"
        :row-alternation-enabled="true"
      >
        <DxColumnChooser :enabled="true" />
        <DxHeaderFilter :visible="true" />
        <DxGroupPanel
          :visible="true"
          :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
        />
        <DxScrolling mode="infinite" />
        <DxGrouping :auto-expand-all="true" />
          <DxColumn
          data-field="root"
          caption="Mã SP"
          width="90"
          :allowEditing="false"
        />
        <DxColumn
          data-field="itemId"
          caption="ID"
          :allowEditing="false"
          :width="90"
          alignment="center"
        />
        <DxColumn
          data-field="itemName"
          caption="Tên sản phẩm/Cụm/Chi tiết"
          :allowEditing="false"
          width="300"
        />
        <DxColumn
          data-field="thitruong"
          caption="Tên thành phẩm"
          width="350"
          :allowEditing="false"
        />

        <DxColumn
          data-field="stepName"
          caption="Tên tổ"
          :group-index="1"
          :sort-index="1"
          sort-order="desc"
          :allowEditing="false"
        />
        <DxColumn caption="Qui Cách" alignment="center" :allowEditing="false">
          <DxColumn
            caption="Dầy"
            data-field="itemHeight"
            alignment="center"
            width="90"
            :allowEditing="false"
          />
          <DxColumn
            caption="Rộng"
            data-field="itemWidth"
            alignment="center"
            width="90"
            :allowEditing="false"
          />
          <DxColumn
            caption="Dài"
            data-field="itemLength"
            alignment="center"
            width="90"
            :allowEditing="false"
          />
        </DxColumn>
        <DxColumn
          data-field="number"
          caption="Lệnh sản xuất"
          width="120"
          :allowEditing="false"
        />
        <DxColumn
          data-field="keHoach"
          caption="Số lượng theo LSX"
          data-type="number"
          width="120"
          alignment="center"
          :allowEditing="true"
        />
        <DxColumn
          data-field="hanMucTon"
          caption="Ton"
          data-type="number"
          width="120"
          alignment="center"
          :allowEditing="true"
          :visible="false"
        />
        <DxColumn
          data-field="canThucHien"
          caption="Số lượng cần thực hiện"
          data-type="number"
          width="120"
          alignment="center"
          :allowEditing="false"
        />
        <DxColumn
          data-field="soLuongUuTien"
          caption="Tồn"
          data-type="number"
          width="120"
          alignment="center"
          :allowEditing="true"
          :visible="true"
          format="#,##0"
        />
        <DxColumn
          data-field="ys1a"
          caption="YS1A"
          data-type="number"
          width="120"
          alignment="center"
          :allowEditing="true"
        />
        <DxColumn
          data-field="ys1b"
          caption="YS1B"
          data-type="number"
          width="120"
          alignment="center"
          :allowEditing="true"
        />
        <DxColumn
          data-field="tb"
          caption="TB"
          data-type="number"
          width="120"
          alignment="center"
          :allowEditing="true"
        />
        <DxExport
          :enabled="true"
          :allow-export-selected-data="false"
          :file-name="'In KHSX'"
        />
        <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400" />
      </DxDataGrid>
    </q-card-section>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxExport,
  DxEditing,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupPanel,
  DxScrolling,
  DxGrouping,
} from "devextreme-vue/data-grid";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSearchPanel,
    DxExport,
    DxEditing,
    DxColumnChooser,
    DxHeaderFilter,
    DxGroupPanel,
    DxScrolling,
    DxGrouping,
  },
  data() {
    return {
      dataSoure: [],
      number: null,
      factory: {
          label: "Nhà máy Thuận Hưng",
          factoryId: 100000,
          value: "100000",
          code: "TH",
        }
    };
  },
  created() {
    const number = this.$route.params.number;
    this.number = number;
    console.log("number", number);
    this.load(number);
  },
  computed: {
    ...mapGetters("lenhSanXuats", ["getPheDuyets"]),
  },
  methods: {
    ...mapActions("lenhSanXuats", ["getLenhSanXuatCapPhois"]),
    async load(number) {
      let fa = null;
      if (number.substring(0, 2) == "TH") {
        fa = {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          value: "100000",
          code: "TH",
        };
      }
      if (number.substring(0, 3) == "YS1") {
        fa = {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 100004,
          value: "100004",
          code: "YS1",
        };
      }
      if (number.substring(0, 2) == "TB") {
        fa = {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 100005,
          value: "100005",
          code: "TB",
        };
      }
      if (number.substring(0, 2) == "QM") {
        fa = {
          label: "Nhà máy CBG Quang Minh",
          factoryId: 102427,
          value: "102427",
          code: "QM",
        };
      }
      console.log("fa", fa);
      this.factory = fa;
      await this.getLenhSanXuatCapPhois(fa);
    },
  },
};
</script>

<style>
#gridContainer{
    height: 700px;
}
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  font-weight: 500;
  background-color: white;
  width: 280;
}
</style>