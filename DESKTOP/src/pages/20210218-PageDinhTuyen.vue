<template>
  <q-page>
    <q-banner class=" text-primary">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div class="text-h6 q-mt-lg">Định tuyến - {{ factory.label }}</div>
    </q-banner>
    <div>
      <div class="text-orange row widget-container">
        <div class="col-12 col-md-6 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="factory"
            :options="factories"
            label="Chọn nhà máy"
            @input="chonNhaMay"
            dense
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-7">
        <q-card padding>
          <q-card-section>
            <DxDataGrid
              :data-source="listItems"
              :selection="{ mode: 'single' }"
              :show-borders="true"
              :hover-state-enabled="true"
              key-expr="id"
              @selection-changed="onSelectionChanged"
            >
              <DxSearchPanel :visible="true" placeholder="Search..." />
              <DxColumn :width="120" data-field="code" caption="Mã" />
              <DxColumn data-field="name" caption="Tên" />
            </DxDataGrid>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-5">
        <q-card v-if="item" padding>
          <q-card-section>
            <q-banner inline-actions rounded class="bg-primary text-white">
              <div class="text-h6">
                {{ item.name }} ({{
                  [item.width, item.height, item.length].join("*")
                }})
              </div>
            </q-banner>
          </q-card-section>
          <q-card-section>
            <DxDataGrid
              id="routings"
              :show-borders="true"
              :data-source="routings"
              @row-inserted="confirmAddStep"
              @row-updated="confirmSaveStep"
              @row-removed="confirmRemoveStep"
              @init-new-row="onInitNewRow"
            >
              <DxEditing
                :refresh-mode="refreshMode"
                :allow-adding="true"
                :allow-updating="true"
                :allow-deleting="true"
                mode="cell"
              />
              <DxColumn data-field="stepId" caption="Công đoạn">
                <DxLookup
                  :data-source="mySources"
                  value-expr="id"
                  display-expr="name"
                />
              </DxColumn>
              <DxColumn :width="120" data-field="order" caption="Thứ tự" />
            </DxDataGrid>
          </q-card-section>
        </q-card>
        <div v-else>
          <q-banner inline-actions rounded class="text-h2 bg-orange text-white">
            Chưa chọn sản phẩm cần định mức.
          </q-banner>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxLookup,
  DxEditing
} from "devextreme-vue/data-grid";

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSearchPanel,
    DxLookup,
    DxEditing
  },
  data() {
    const nmcbgs = [
      { id: 100000, name: "Nhà máy CBG Thuận Hưng", mang: "CBG" },
      { id: 100002, name: "Nhà máy Quang Minh", mang: "CBG" },
      { id: 100003, name: "Nhà máy CBG Yên Sơn 1A", mang: "CBG" },
      { id: 100004, name: "Nhà máy CBG Yên Sơn 1B", mang: "CBG" },
      { id: 100005, name: "Nhà máy CBG Yên Sơn YS4", mang: "CBG" }
    ];
    return {
      nmcbgs,
      nmcbg: nmcbgs[0],
      item: null,
      item1: null,
      item3: null,
      card: false,
      selectedRowKeys: [],
      refreshMode: "full",
      refreshModes: ["full", "reshape", "repaint"],
      ordersData: null,
      factory: {
        label: "Nhà máy Thuận Hưng",
        value: "100000",
        factoryId: 100000,
        code: "TH"
      },
      goodsType: {
        label: "Vanity",
        value: "vanity",
        code: "vanity"
      }
    };
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "mySources"]),
    ...mapGetters("ordersm", ["departments"]),
    ...mapGetters("prod", ["routings", "factories", "goodsTypes"]),
    ...mapGetters("item", ["listItems", "itemSelect"])
  },
  methods: {
    ...mapActions("item", ["getItemsByFactoryId"]),
    ...mapActions("base", ["getAllCongDoans"]),
    ...mapActions("prod", [
      "getRoutingsByItemId",
      "addRouting",
      "saveRouting",
      "removeRouting"
    ]),
    onInitNewRow(e) {
      e.data.order = this.routings.length + 1;
    },
    async onSelectionChanged({ selectedRowsData }) {
      this.item = selectedRowsData[0];
      const { factoryId } = this.factory;
      this.$router.replace({
        path: this.$route.fullPath,
        query: {
          itemId: selectedRowsData[0].id,
          factoryId
        }
      });
      this.loadRouting();
    },
    async onSelectionChanged1({ selectedRowsData }) {
      this.item1 = selectedRowsData[0];
      this.card = true;
    },
    async confirmAddStep(e) {
      const { factoryId } = this.$route.query;
      let payload = { itemId: this.item.id, ...e.data, factoryId };
      delete payload.__KEY__;
      await this.addRouting(payload);
      this.loadRouting();
    },
    async confirmSaveStep(e) {
      const { factoryId } = this.$route.query;
     // console.log('nhaf may:',factoryId)
      let payload = { itemId: this.item.id, ...e.data, factoryId };
      delete payload.__KEY__;
      await this.saveRouting(payload);
      this.loadRouting();
    },
    async confirmRemoveStep(e) {
      await this.removeRouting(e.data);
      this.loadRouting();
    },
    async loadRouting() {
      const { itemId } = this.$route.query;
      const { factoryId } = this.factory;
      
      await this.getRoutingsByItemId({ itemId, factoryId });
    },
    async loadItems() {
      await this.getItemsByFactoryId(this.factory);
    },
    async chonNhaMay(factory) {
      this.factory = factory;
      this.$router.replace({
        path: this.$route.fullPath,
        query: {
          factoryId: factory.factoryId
        }
      });
      await this.loadRouting();
    }
  },
  async created() {
    const { itemId, factoryId } = this.$route.query;
    if (itemId) {
      this.loadRouting();
    }
    await this.loadItems(factoryId);
    this.factory = this.factories.find(Nhà máy => Nhà máy.id == factoryId);
    this.item = this.listItems.find(i => i.id == itemId);
  }
};
</script>
