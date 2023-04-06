<template>
  <q-page class="q-pa-md q-gutter-sm">
    <q-banner class="bg-primary text-orange">
      <div class="text-h6 orange">
        <span color="orange">Định mức nguyên vật liệu</span>
      </div>
    </q-banner>
    <DxDataGrid
      id="grid"
      :show-borders="true"
      :data-source="itemsData"
      :repaint-changes-only="true"
    >
      <DxPaging :enabled="true" />
      <DxEditing
        :refresh-mode="refreshMode"
        :allow-adding="true"
        :allow-updating="true"
        :allow-deleting="true"
        mode="popup"
      />
      <DxFilterRow :visible="true" />
      <DxHeaderFilter :visible="true" />
      <DxSearchPanel :visible="true" :width="440" placeholder="Tìm sản phẩm" />
      <DxColumn data-field="itemId" caption="Sản phẩm">
        <DxLookup :data-source="itemSelect" value-expr="id" display-expr="name" />
      </DxColumn>
      <DxColumn data-field="materialsId" caption="Chi tiết">
        <DxLookup :data-source="itemSelect" value-expr="id" display-expr="name" />
      </DxColumn>
      <DxColumn data-field="rate" caption="Hệ số" width="100" />
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
  DxFilterRow,
} from "devextreme-vue/data-grid";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      itemsData: new CustomStore({
        key: "id",
        load: async () => {
          await this.getItemsByFactoryId({ factoryId: this.myFactoryInfor.id | this.$route.query.factoryId });
          await this.getAllBom({ factoryId: this.myFactoryInfor.id | this.$route.query.factoryId });
          return this.boms;
        },
        insert: async (values) =>
          await this.$store.dispatch(
            "base/CREATE_BOM",
            Object.assign(values, { factoryId: this.myFactoryInfor.id | this.$route.query.factoryId })
          ),
        remove: async (key) =>
          await this.$store.dispatch("prod/REMOVE_BOM_BY_ITEM_ID", key),

        update: (key, values) =>
          this.updateBom({
            key: key,
            values,
            // : JSON.stringify(values)
          }),
      }),
      refreshMode: "full",
      refreshModes: ["full", "reshape", "repaint"],
      itemsConvert: [],
    };
  },
  computed: {
    ...mapGetters("item", ["itemSelect"]),
    ...mapGetters("po", ["boms"]),
    ...mapGetters("base", ["myFactoryInfor"]),
  },
  // created() {
  //   this.loadItems();
  // },
  methods: {
    ...mapActions("item", ["getItemsByFactoryId"]),
    ...mapActions("base", ["getAllItemsByFactoryId"]),
    ...mapActions("po", ["getAllBom", "updateBom"]),

    async loadItems() {
      const myFactoryId = this.myFactoryInfor.id | this.$route.query.factoryId;
      if (myFactoryId) {
        let data = await this.getAllItemsByFactoryId({
          factoryId: myFactoryId,
        });
        data.data.forEach((element) => {
          this.itemsConvert.push({
            id: element.id,
            name:
              "[" +
              element.code +
              "] " +
              element.name +
              " (" +
              element.height +
              "*" +
              element.width +
              "*" +
              element.length +
              ")",
          });
        });
      }
    },
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
    DxFilterRow,
  },
};
</script>
