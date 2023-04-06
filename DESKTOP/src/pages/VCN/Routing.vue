<template>
  <q-page>
    <q-banner class="text-primary">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div class="text-h6 q-mt-lg">
        Định tuyến - {{ factory == null ? "" : factory.label }}
      </div>
    </q-banner>
    <div>
      <div class="text-orange row widget-container">
        <div class="col-12 col-md-2 q-pa-sm">
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
    </div>
    <div class="row">
      <div class="col-7">
        <q-card padding>
          <q-card-section>
            <DxDataGrid
              :data-source="listItems"
              :selection="{ mode: 'single' }"
              :show-borders="true"
              :show-row-lines="true"
              :show-column-lines="true"
              :hover-state-enabled="true"
              key-expr="id"
              @selection-changed="onSelectionChanged"
            >
              <DxSearchPanel :visible="true" placeholder="Search..." />
              <DxColumn :width="120" data-field="code" caption="Mã" />
              <DxColumn data-field="name" caption="Tên" />
              <DxColumn data-field="length" :width="90" caption="Dài" />
              <DxColumn data-field="width" :width="90" caption="Rộng" />
              <DxColumn data-field="height" :width="90" caption="Dày" />
            </DxDataGrid>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-5">
        <q-card v-if="item" padding>
          <div class="bg-blue-grey-2 text-primary" style="padding: 10px; font-weight:bold; font-size:18px">
            Thông tin định tuyến hiện tại của SP : 
            <span class="text-blue">
              {{ item.name }} ({{
                [item.width, item.height, item.length].join("*")
              }})
              </span> 
          </div>
          <!-- <q-card-section>
            <q-banner inline-actions rounded class="bg-blue-grey-2 text-primary">
              <div class="text-h6">
                {{ item.name }} ({{
                  [item.width, item.height, item.length].join("*")
                }})
              </div>
            </q-banner>
          </q-card-section> -->
          <q-card-section>
            <DxDataGrid
              id="routings"
              :show-borders="true"
              :show-row-lines="true"
              :show-column-lines="true"
              :data-source="routings"
              @row-inserted="confirmAddStep"
              @row-updated="confirmSaveStep"
              @row-removed="confirmRemoveStep"
              @init-new-row="onInitNewRow"
            >
              <DxEditing
                :refresh-mode="refreshMode"
                :allow-adding="isInsert"
                :allow-updating="isUpdate"
                :allow-deleting="isDelete"
                mode="cell"
              />
              <DxColumn data-field="stepId" caption="Công đoạn">
                <DxLookup
                  :data-source="departments"
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
            Chưa chọn sản phẩm cần định tuyến.
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
import { mySources } from "src/store/base/getters";

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSearchPanel,
    DxLookup,
    DxEditing
  },
  data() {
    return {
      listItems: null,
      factory: [],
      factories: [],
      xuong: null,
      xuongs: [],
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      item: null,
      routings: [],
      departments: [],
      refreshMode: "full"
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"])
  },
  methods: {
    ...mapActions("vcn", [
      "GET_ITEMS_VCN",
      "getFactory",
      "getRoutingByItemId",
      "getDepartmentByFactotyId",
      "getXuongByFactoryId",
      "createRoutings",
      "updateRoutings",
      "removeRoutings",
      "getItemsByFactoryId"
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
    onInitNewRow(e) {
      e.data.order = this.routings.length + 1;
      e.data.itemId = this.item.id;
      e.data.factoryId = this.xuong.id;
    },
    async onchange() {
      let code;
      if (this.factory !== null) {
        code = this.factory.code;
      } else {
        code = this.factory.code;
      }
      let data = this.data;

      if (code == "YS1A" || code == "YS1B") {
        code = "YS1";
      }

      let dataFile = [];
      for (const dt of data) {
        if (
          [
            "Nhà máy CBG Thuận Hưng",
            "Nhà máy CBG Yên Sơn 1",
            "Nhà máy CBG Thái Bình",
            "Nhà máy CBG Quang Minh"
          ].includes(dt.name) ||
          dt.name.indexOf(`(${code}`) > -1
        ) {
          dataFile.push(dt);
        }
      }
      this.data1 = dataFile;
      console.log("he so:", this.mySources.name);
    },
    async onSelectionChanged({ selectedRowsData }) {
      this.item = selectedRowsData[0];
      const payload = {
        itemId: this.item.id,
        factoryId: this.xuong.id
      };
      const data = await this.getRoutingByItemId(payload);

      this.routings = data.sort((a, b) => {
        return a.order - b.order;
      });
    },

    async confirmAddStep(e) {
      e.data.createdBy = this.userInfo.id;

      const data = await this.createRoutings(e.data);
      this.routings.sort((a, b) => {
        return a.order - b.order;
      });
      console.log("e", data);
    },
    async confirmSaveStep(e) {
      const data = await this.updateRoutings(e.data);
      this.routings.sort((a, b) => {
        return a.order - b.order;
      });
      console.log(data);
    },
    async confirmRemoveStep(e) {
      await this.removeRoutings(e.data);
      // this.loadRouting();
    },
    // async loadRouting() {
    //   const payload = { itemId: this.item.id, factoryId: this.factory.id };
    //   console.log(payload);
    //   // await this.getRoutingsByItemId({ itemId, factoryId });
    // },
    async chonNhaMay() {
      const payload = {
        factoryId: this.factory.id
      }
      const data = await this.getXuongByFactoryId(payload);
      data.map(e => (e.label = e.name));
      this.xuongs = data;

    },

    async chonXuong() {
      this.routings = []
      const data = await this.getDepartmentByFactotyId({
        factoryId: this.xuong.id
      });
      this.departments = data;

    }
  },
  async created() {
    // const listItems = await this.GET_ITEMS_VCN(); // state.item
    this.loadPermission();
    this.listItems = await this.getItemsByFactoryId(this.factory);
    const factory = await this.getFactory();
    factory.map(e => (e.label = e.name));
    this.factories = factory;
  },
  async mounted() {
    this.data = this.mySources;
  }
};
</script>
