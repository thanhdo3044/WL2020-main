<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="top-title col-8">Quản lý hệ số quy đổi cắt rong</div>
        </div>
      </q-card-section>
      <q-card-section>
        <DxDataGrid
          id="gridContainer"
          :data-source="dataSource"
          :allow-column-reordering="true"
          :show-borders="true"
          :show-row-lines="true"
              :show-column-lines="true"
          key-expr="ID"
          @row-inserted="inserted"
          @row-updated="updated"
          @row-removed="removed"
        >
          <DxPaging :enabled="true" />
          <DxEditing
            :allow-updating="isUpdate"
            :allow-deleting="isDelete"
            :allow-adding="isInsert"
            mode="row"
          />

          <DxColumn
            :width="420"
            data-field="ITEM_TRUOC_RONG"
            caption="Sản phẩm trước rong"
          >
            <DxLookup
              :data-source="items"
              display-expr="name"
              value-expr="id"
            />
          </DxColumn>
          <DxColumn data-field="HE_SO" :width="80" caption="Hệ số" />
          <DxColumn
            :width="420"
            data-field="ITEM_SAU_RONG"
            caption="Sản phẩm sau rong"
          >
            <DxLookup
              :data-source="items"
              display-expr="name"
              value-expr="id"
            />
          </DxColumn>
        </DxDataGrid>
      </q-card-section>
    </q-card>
  </q-page>
</template>
GET_ITEMS_VCN
<script>
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
} from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import { showNotifySuccess, showNotifyError } from "../../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxLookup,
  },
  data() {
    return {
      dataSource: [],
      items: [],
      isInsert: false,
      isUpdate: false,
      isDelete: false,
    };
  },
  created() {
    this.loadPermission();
    this.loadItem();
    this.loadData();
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("vcn", [
      "GET_ITEMS_VCN",
      "insertHeSoQuyDoi",
      "updateHeSoQuyDoi",
      "deleteHeSoQuyDoi",
      "getHeSoQuyDoi",
    ]),
    ...mapActions("prod", ["getPermissionInScreen"]),
    async loadPermission() {
      console.log("path", this.$route.path);
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.getPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((el) => {
        if (el.CODE == "insert") {
          this.isInsert = true;
        }
        if (el.CODE == "update") {
          this.isUpdate = true;
        }
        if (el.CODE == "delete") {
          this.isDelete = true;
        }
      });
      console.log("listPermission", this.listPermission);
    },
    async loadItem() {
      let data = await this.GET_ITEMS_VCN();
      this.items = [];
      data.forEach((item) => {
        this.items.push({
          name: `[${item.code}] ${item.name} (${item.height}x${item.width}x${item.length})`,
          id: item.id,
        });
      });
      console.log("data", this.items);
    },
    async loadData() {
      const data = await this.getHeSoQuyDoi();
      this.dataSource = data;
    },
    async inserted(e) {
      console.log("e", e);
      const payload = {
        itemTruocRong: e.data.ITEM_TRUOC_RONG,
        heSo: e.data.HE_SO,
        itemSauRong: e.data.ITEM_SAU_RONG,
        accountId: this.userInfo.id,
      };
      const data = await this.insertHeSoQuyDoi(payload);
      console.log("data insert", data);
      if (data.meta.success) {
        showNotifySuccess();
        this.loadData();
      }else{
        showNotifyError();
      }
    },
    async updated(e) {
      const payload = {
        id: e.data.ID,
        itemTruocRong: e.data.ITEM_TRUOC_RONG,
        heSo: e.data.HE_SO,
        itemSauRong: e.data.ITEM_SAU_RONG,
        accountId: this.userInfo.id,
      };
      const data = await this.updateHeSoQuyDoi(payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.loadData();
      }else{
        showNotifyError();
      }
    },
    async removed(e) {
      const payload = {
        id: e.data.ID,
      };
      const data = await this.deleteHeSoQuyDoi(payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.loadData();
      }else{
        showNotifyError();
      }
    },
  },
};
</script>

<style>
</style>