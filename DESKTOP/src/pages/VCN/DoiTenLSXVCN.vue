<template>
  <q-page class="q-pa-md q-gutter-sm">
    <q-banner class="bg-primary text-orange">
      <div class="text-h6 orange">
        <span color="orange">Thay đổi tên lệnh sản xuất</span>
      </div>
    </q-banner>
    <q-card class="my-card">
      <q-separator spaced />
      <q-card-section>
        <div class="text-orange row widget-container">
          <q-select
            class="col-12 col-md-2 q-pa-sm"
            dense
            filled
            @input="changeFactory"
            v-model="factory"
            :options="options"
            label="Chọn nhà máy"
          />
          <div class="col-12 col-md-2 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="xuong"
            :options="xuongs"
            label="Chọn Xưởng"
            @input="chonXuong"
            dense
          />
        </div>
        </div>
        <div class="row">
          <DxDataGrid
            id="gridContainer"
            :data-source="dataSource"
            @row-updated="onUpdate"
            :show-row-lines="true"
            :show-borders="true"
          >
            <DxEditing :allow-updating="isUpdate" mode="cell" />
            <DxColumn data-field="lsxOld" caption="Lệnh sản xuất cũ" :allowEditing="false" />
            <DxColumn data-field="lsxNew" caption="Lệnh sản xuất mới" />
          </DxDataGrid>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { DxDataGrid, DxColumn, DxEditing } from "devextreme-vue/data-grid";
import { showNotifySuccess, showNotifyError } from "../../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
  },
  data() {
    return {
      options: [],
      factory: null,
      xuong: null,
      xuongs: [],
      dataSource: [],
      isInsert: false,
      isUpdate: false,
      isDelete: false,
    };
  },
   computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  async created() {
    this.loadPermission();
    this.loadFactory();
    this.load();
  },
  methods: {
    ...mapActions("vcn", ["getFactory", "getNumberInPOByFactoryId", "updateNumberInPO", "getXuongByFactoryId"]),
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
    async loadFactory() {
      const factory = await this.getFactory();
      factory.map((e) => (e.label = e.name));
      this.options = factory;
      this.factory = factory[0];
    },
    async changeFactory() {
      const payload = {
        factoryId: this.factory.id
      }
      const data = await this.getXuongByFactoryId(payload);
      data.map(e => (e.label = e.name));
      this.xuongs = data;
      
    },
    async chonXuong() {
      this.load();
    },
    async load(){
        const payload = {
            factoryId: this.xuong.id
        }
        const data = await this.getNumberInPOByFactoryId(payload);
        console.log("data", data);
        this.dataSource = data;
    },
    async onUpdate(e){
        console.log("e", e);
        const payload = {
            lsxOld: e.data.lsxOld.trim(),
            lsxNew: e.data.lsxNew.trim()
        }
        const data = await this.updateNumberInPO(payload);
        if(data.meta.success){
            showNotifySuccess();
            this.load();
        }else{
            showNotifyError();
        }
    }
  },
};
</script>

<style>
</style>