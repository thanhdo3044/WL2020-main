<template>
  <q-page padding>
    <q-banner class="bg-primary text-orange">
      <div class="text-h6 orange">
        <span color="orange">Phê duyệt lệnh sản xuất</span>
        <q-btn
          class="float-right"
          color="red"
          label="Xóa"
          @click="xoaLenhSanXuat"
        />
        <q-btn
          class="float-right"
          color="orange"
          label="Phê duyệt"
          @click="guiPheDuyet"
        />
      </div>
    </q-banner>
    <q-card>
      <q-card-section>
        <DxDataGrid
          :data-source="approvedPos(chonLenhSX)"
          :show-borders="true"
          key-expr="id"
          :selected-row-keys.sync="selectedRowKeys"
        >
          <DxColumnChooser :enabled="true" />
          <DxHeaderFilter :visible="true" />
          <DxGroupPanel
            :visible="true"
            :empty-panel-text="
              'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'
            "
          />
          <DxScrolling mode="infinite" />
          <DxGrouping :auto-expand-all="true" />
          <DxColumn data-field="Item.name" caption="SP/Chi tiết" />
          <DxColumn data-field="market" caption="Mã tạo LSX" :width="160" />
          <DxColumn data-field="number" caption="Lệnh sản xuất" :width="160" />
          <DxColumn
            data-field="Department.name"
            caption="Công đoạn"
            :group-index="1"
            :sort-index="1"
            sort-order="desc"
          />
          <!-- <DxColumn :width="90" data-field="id" caption="ID" /> -->
          <DxColumn caption="Qui Cách" alignment="center">
            <DxColumn
              caption="Dầy"
              data-field="Item.height"
              alignment="center"
              width="90"
            />
            <DxColumn
              caption="Rộng"
              data-field="Item.width"
              alignment="center"
              width="90"
            />
            <DxColumn
              caption="Dài"
              data-field="Item.length"
              alignment="center"
              width="90"
            />
          </DxColumn>
          <DxColumn
            data-field="keHoach"
            caption="KHĐG"
            data-type="number"
            width="100"
            alignment="center"
          />
          <DxColumn
            data-field="soLuongUuTien"
            caption="KHNV"
            data-type="number"
            width="100"
            alignment="center"
          />
          <DxColumn
            data-field="ngayDongGoi"
            caption="Ngày"
            width="100"
            alignment="center"
            :customize-text="dateFormat"
          />
          <!-- <DxColumn
            data-field="conTon.quantity"
            caption="Tồn"
            data-type="number"
            width="100"
            alignment="center"
          /> -->
          <DxColumn
            data-field="quantity"
            caption="Cần SX"
            data-type="number"
            width="100"
            alignment="center"
          />
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'In KHSX'"
          />
          <DxSearchPanel
            :visible="true"
            :placeholder="'Tìm kiếm'"
            :width="400"
          />
          <DxSelection
            :select-all-mode="allMode"
            :show-check-boxes-mode="checkBoxesMode"
            mode="multiple"
          />
        </DxDataGrid>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import {
  DxDataGrid,
  DxColumn,
  DxSelection,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupPanel,
  DxScrolling,
  DxGrouping,
  DxSearchPanel,
  DxExport
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSelection,
    DxColumnChooser,
    DxHeaderFilter,
    DxGroupPanel,
    DxScrolling,
    DxGrouping,
    DxSearchPanel,
    DxExport
  },
  data() {
    return {
      allMode: "allPages",
      checkBoxesMode: "always",
      selectedRowKeys: [],
      chonLenhSX: []
    };
  },
  computed: {
    ...mapGetters("po", ["approvedPos"]),
    ...mapGetters("base", ["userInfo", "myFactoryInfor"])
  },
  methods: {
    ...mapActions("po", ["getAllPoApproved", "sendApproved", "deletePos"]),
    dateFormat({ valueText }) {
      return moment(valueText).format("L");
    },
    guiPheDuyet() {
      this.sendApproved({
        accountId: this.userInfo.id,
        poIds: this.selectedRowKeys
      });
      this.$router.go();
    },
    xoaLenhSanXuat() {
      this.$q
        .dialog({
          title: "Xóa kế hoạch sản xuất",
          message: "Bạn có muốn xóa kế hoạch sản xuất đã chọn?",
          cancel: true,
          persistent: true
        })
        .onOk(() => { 
          this.deletePos({
            accountId: this.userInfo.id,
            poIds: this.selectedRowKeys
          });
          this.$router.go();
        });
    }
  },
  created() {
    this.getAllPoApproved({ factoryId: this.myFactoryInfor.id });
  }
};
</script>
