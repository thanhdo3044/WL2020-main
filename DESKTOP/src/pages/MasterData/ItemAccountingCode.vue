<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="top-title col-8">Danh mục Sản phẩm</div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12">
            <DxDataGrid
              id="gridContainer"
              :data-source="items"
              :allow-column-reordering="true"
              :columns-auto-width="true"
              :show-borders="true"
              :show-column-lines="true"
              :allow-column-resizing="true"
              key-expr="id"
                @row-updated="updated"
            >
              <DxPaging :enabled="true" />
              <DxEditing :allow-updating="true" mode="row" />
              <DxExport :enabled="true" :allow-export-selected-data="false" />
              <DxFilterRow :visible="true" />
              <DxHeaderFilter :visible="true" />
              <DxSearchPanel
                :visible="true"
                :width="440"
                placeholder="Tìm sản phẩm"
              />

              <DxColumn
                data-field="code"
                caption="Mã"
                :allowEditing="false"
                :width="100"
              >
              </DxColumn>
              <DxColumn
                data-field="name"
                :allowEditing="false"
                caption="Tên sản phẩm"
              >
              </DxColumn>
              <DxColumn
                :width="80"
                data-field="unitId"
                :allowEditing="false"
                caption="Đơn vị"
              >
                <DxLookup
                  :data-source="units"
                  display-expr="name"
                  value-expr="id"
                />
              </DxColumn>
              <DxColumn
                data-field="height"
                :allowEditing="false"
                :width="120"
                caption="Dầy"
              >
              </DxColumn>
              <DxColumn
                data-field="width"
                :allowEditing="false"
                :width="120"
                caption="Rộng"
              >
              </DxColumn>
              <DxColumn
                data-field="length"
                :allowEditing="false"
                :width="120"
                caption="Dài"
              >
              </DxColumn>
              <DxColumn
                data-field="volumn"
                :width="110"
                caption="Khối lượng/m³"
                :allowEditing="false"
              >
              </DxColumn>
              <DxColumn
                data-field="accountingCode"
                :width="100"
                caption="Mã kế toán"
              />
              <DxColumn
                :width="125"
                data-field="typeId"
                caption="Loại sản phẩm"
                :allowEditing="false"
              >
                <DxLookup
                  :data-source="itemTypes"
                  display-expr="name"
                  value-expr="id"
                />
              </DxColumn>
            </DxDataGrid>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
  DxExport,
  DxSearchPanel,
  DxHeaderFilter,
  DxFilterRow,
} from "devextreme-vue/data-grid";
import {
  showNotifySuccess,
  showNotifyError,
  showNotifyValidate,
} from "../../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxExport,
    DxLookup,
    DxSearchPanel,
    DxHeaderFilter,
    DxFilterRow,
  },
  data() {
    return {
      units: [],
      items: [],
      itemTypes: [],
    };
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "userInfo"]),
  },
  created() {
    console.log(this.userInfo);
    this.load();
  },
  methods: {
    load() {
      Promise.all([this.loadUnit(), this.loadItems(), this.loadItemTypes()]);
    },
    async loadUnit() {
      let data = await this.$store.dispatch("base/GET_UNITS", 1);
      this.units = data.data;
    },
    async loadItems() {
      const myFactoryId = this.$route.query.factoryId;
      const myItemType = this.$route.query.type;
      const payload = {
        factoryId: myFactoryId,
        typeId: myItemType,
      };
      if (myFactoryId) {
        let data = await this.$store.dispatch("base/GET_ITEMS", payload);
        console.log('sp:',data.data)
        data = data.data.filter((word) => word.typeId == 100003);
        this.items = data;
      }
    },
    async loadItemTypes() {
      const myItemType = this.$route.query.type;
      const payload = {
        typeId: myItemType,
      };
      let data = await this.$store.dispatch("base/GET_ITEM_TYPES", payload);
      this.itemTypes = data.data;
    },
    async updated(e){
      if (e.data) {
        console.log(e.data);
        const payload = {
            id: e.data.id,
            data: {
              accountingCode: e.data.accountingCode
            },
          };
        console.log("payload", payload);
        const data = await this.$store.dispatch("base/UPDATE_ITEM", payload);
        if (data.meta.success) {
          showNotifySuccess("Cập nhật thành công !");
        } else {
          showNotifyError();
        }
      }
    this.load();
  },
  },
  
};
</script>

<style>
</style>