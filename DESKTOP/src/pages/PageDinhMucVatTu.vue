<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Khai báo thông tin định mức vật tư sơn khối CBG
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pt-sm col-md-4">
        <q-card>
          <DxDataGrid
            :data-source="listItem"
            :allow-column-resizing="true"
            :selection="{ mode: 'single' }"
            :show-borders="true"
            :show-row-lines="true"
            :hover-state-enabled="true"
            key-expr="CODE"
            @selection-changed="onSelectionChanged"
          >
            <DxFilterRow :visible="true" />
            <DxHeaderFilter :visible="true" />
            <DxColumn :width="150" data-field="CODE" caption="Mã SP" />
            <DxColumn data-field="NAME" caption="Tên" />
          </DxDataGrid>
        </q-card>
      </div>
      <div class="col-12 q-pl-sm q-pt-sm col-md-8" padding>
        <span v-if="item1">Khai báo định mức VT cho SP:</span>
        <span
          v-if="item1"
          class="text-subtitle1 text-blue"
          style="font-weight: bold"
        >
          {{ item1.CODE }} - {{ item1.NAME }}
        </span>
        <div class="row">
          <div class="col-6">
            <q-radio @input="changeType()" v-if="type== '0'" color="positive" class="text-positive" v-model="type" val="0" label="Vật tư nhập khẩu" />
            <q-radio @input="changeType()"  v-if="type== '1'" v-model="type" val="0" label="Vật tư nhập khẩu" />
            <q-radio @input="changeType()" v-if="type== '1'" color="positive" class="text-positive" v-model="type" val="1" label="Vật tư nội địa" />
            <q-radio @input="changeType()" v-if="type== '0'" v-model="type" val="1" label="Vật tư nội địa" />
          </div>
          <div class="col-6" align="center">
            <q-btn color="positive" @click="showAddVT" label="Thêm vật tư" />
          </div>
        </div>
        <span v-if="listDMVatTu.filter(l => l.kk_yn == false).length > 0 && type == 0" class="text-orange">Vật tư nhập khẩu</span>
        <q-card v-if="listDMVatTu.filter(l => l.kk_yn == false).length > 0 && type == 0">
          <DxDataGrid
            :show-borders="true"
            :data-source="listDMVatTu.filter(l => l.kk_yn == false)"
            :show-row-lines="true"
            @row-updated="confirmSaveDMVT"
            @row-removed="confirmRemoveDMVT"
          >
            <DxEditing
              :allow-updating="true"
              :allow-deleting="true"
              mode="cell"
            />
            <DxColumn
              :allowEditing="false"
              :width="120"
              data-field="MA_VT"
              caption="Mã vật tư"
              alignment="center"
            />
            <DxColumn
              data-field="ten_vt"
              caption="Tên vật tư"
              :allowEditing="false"
            />
            <DxColumn
              data-field="dvt"
              :width="90"
              caption="ĐVT"
              alignment="center"
              :allowEditing="false"
            />
            <DxColumn
              :width="120"
              data-field="DM_SP"
              caption="Định mức/SP"
              alignment="center"
            />
          </DxDataGrid>
        </q-card>
        <br>
        <hr width="50%">
        <span v-if="listDMVatTu.filter(l => l.kk_yn == true).length > 0 && type == 1" class="text-orange">Vật tư nội địa</span>
        <q-card v-if="listDMVatTu.filter(l => l.kk_yn == true).length > 0 && type == 1">
          <DxDataGrid
            :show-borders="true"
            :data-source="listDMVatTu.filter(l => l.kk_yn == true)"
            :show-row-lines="true"
            @row-updated="confirmSaveDMVT"
            @row-removed="confirmRemoveDMVT"
          >
            <DxEditing
              :allow-updating="true"
              :allow-deleting="true"
              mode="cell"
            />
            <DxColumn
              :allowEditing="false"
              :width="120"
              data-field="MA_VT"
              caption="Mã vật tư"
              alignment="center"
            />
            <DxColumn
              data-field="ten_vt"
              caption="Tên vật tư"
              :allowEditing="false"
            />
            <DxColumn
              data-field="dvt"
              :width="90"
              caption="ĐVT"
              alignment="center"
              :allowEditing="false"
            />
            <DxColumn
              :width="120"
              data-field="DM_SP"
              caption="Định mức/SP"
              alignment="center"
            />
          </DxDataGrid>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="card">
      <q-card
        v-if="item1"
        class="my-card"
        style="max-width: 1500px; width: 1000px"
      >
        <q-card-section class="q-pt-none">
          <div class="text-subtitle1 text-blue" style="font-weight: bold">
            {{ item1.CODE }} - {{ item1.NAME }}
          </div>
          <div class="text-caption text-grey">
            Chọn thông tin vật tư - phụ kiện
          </div>
        </q-card-section>

        <DxDataGrid
          :data-source="listVatTu"
          :allow-column-resizing="true"
          :selection="{ mode: 'multiple' }"
          :show-borders="true"
          :hover-state-enabled="true"
          :selected-row-keys.sync="r0SelectedRowKeys"
        >
          <DxFilterRow :visible="true" />
          <DxPaging :page-size="17" />
          <DxHeaderFilter :visible="true" />
          <DxColumn :width="150" data-field="ma_vt" caption="Mã vật tư" />
          <DxColumn data-field="ten_vt" caption="Tên vật tư" />
          <DxColumn data-field="dvt" :width="150" caption="ĐVT" />
        </DxDataGrid>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            color="primary"
            label="Đồng ý"
            @click="luuDinhMuc"
          />
          <q-btn v-close-popup label="Hủy" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxExport,
  DxHeaderFilter,
  DxFilterRow,
  DxSearchPanel,
  DxEditing,
  DxPaging,
  DxLookup,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxHeaderFilter,
    DxFilterRow,
    DxSearchPanel,
    DxExport,
    DxEditing,
    DxPaging,
    DxLookup,
  },
  data() {
    return {
      item1: null,
      card: false,
      listItem: [],
      r0SelectedRowKeys: [],
      listDMVatTu: [],
      ListVatTu: [],
      type: "0",
    };
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "userInfo"]),
  },
  created() {
    this.loadItemInMarket();
    this.loadVatTu();
  },
  methods: {
    ...mapActions("item", [
      "getItemInMarket",
      "getDinhMucByMarket",
      "getVatTuByType",
      "themDinhMucVatTu",
      "updateDinhMucVT",
      "deleteDinhMucVT",
    ]),
    luuDinhMuc() {},
    async loadItemInMarket() {
      this.listItem = await this.getItemInMarket();
      console.log("listItem", this.listItem);
    },
    async loadVatTu() {
      this.listVatTu = await this.getVatTuByType({ type: this.type });
      console.log("listVatTu", this.listVatTu);
    },
    async onSelectionChanged({ selectedRowsData }) {
      this.item1 = selectedRowsData[0];
      this.loadDMVatTu();
    },
    async loadDMVatTu() {
      const payload = {
        marketCode: this.item1.CODE,
      };
      this.listDMVatTu = await this.getDinhMucByMarket(payload);
    },
    async changeType() {
      this.loadVatTu();
    },
    async luuDinhMuc() {
      this.r0SelectedRowKeys.forEach((el) => {
        this.addDinhMucVT(el.ma_vt);
      });
    },
    async addDinhMucVT(ma_vt) {
      const payload = {
        marketCode: this.item1.CODE,
        maVT: ma_vt,
        accountId: this.userInfo.id,
      };
      await this.themDinhMucVatTu(payload);
      this.loadDMVatTu();
    },
    async confirmSaveDMVT(e) {
      const payload = {
        id: e.data.ID,
        dm_sp: e.data.DM_SP,
      };
      const data = await this.updateDinhMucVT(payload);
      this.loadDMVatTu();
    },
    async confirmRemoveDMVT(e) {
      await this.deleteDinhMucVT({ id: e.data.ID });
      this.loadDMVatTu();
    },
    showAddVT() {
      this.r0SelectedRowKeys = [];
      this.card = true;
    },
  },
};
</script>

<style>
</style>