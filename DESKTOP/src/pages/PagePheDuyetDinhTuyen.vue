<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Định tuyến sản phẩm CBG -
          {{ factory1 == null ? null : factory1.label }}
        </div>
      </div>
    </div>
    <div>
      <div class="text-orange row">
        <div class="col-12 col-md-2">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="factory1"
            :options="factories1"
            label="Chọn nhà máy"
            @input="chonNhaMay"
            @popup-hide="onchange"
            dense
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <q-card padding>
          <DxDataGrid
            :data-source="listItems"
            :word-wrap-enabled="true"
            :selection="{ mode: 'single' }"
            :show-borders="true"
            :show-row-lines="true"
            :hover-state-enabled="true"
            key-expr="id"
            @selection-changed="onSelectionChanged"
          >
            <DxFilterRow :visible="true" />
            <DxHeaderFilter :visible="true" />

            <DxColumn :width="200" data-field="code" caption="Mã số" />
            <DxColumn data-field="name" caption="Tên" />
            <DxColumn :width="300" data-field="LAST_NAME" caption="Người sửa" />
          </DxDataGrid>
        </q-card>
      </div>
      <div class="col-6">
        <q-card v-if="item" padding>
           <div
            class="bg-blue-grey-2 text-primary"
            style="padding: 10px; font-weight: bold; font-size: 18px"
          >
            Thông tin định tuyến hiện tại của SP/CT :
            <span class="text-blue">
              {{ item.name }} ({{
                [item.width, item.height, item.length].join("*")
              }})
            </span>
          </div>

          <DxDataGrid
            id="routings"
            :show-borders="true"
            :data-source="routings"
          >
            <DxColumn
              data-field="stepId"
              caption="Định tuyến hiện tại"
              cssClass="maudinhtuyen1"
            >
              <DxLookup
                :data-source="data1"
                value-expr="id"
                display-expr="description"
              />
            </DxColumn>
            <DxColumn
              :width="120"
              data-field="order"
              caption="Thứ tự"
              alignment="center"
              cssClass="maudinhtuyen1"
            />
          </DxDataGrid>
        </q-card>
        <div v-else style="padding: 10px" class="text-h8 bg-orange text-white">
          Chưa chọn sản phẩm cần định tuyến.
        </div>
        
        <br />
        <hr width="50%" />
        <br />
        <q-card v-if="item && isEdit" padding>
          <div>
            <div v-if="isEdit && isApprove">
              <q-btn
                color="positive"
                label="Phê duyệt"
                @click="onAccept"
                style="margin: 10px 30px"
              />
              <q-btn
                v-if="isEdit"
                color="orange"
                label="Từ chối"
                @click="onReject"
              />
            </div>
          </div>
          <div
            class="bg-blue-grey-2 text-primary"
            style="padding: 10px; font-weight: bold; font-size: 18px"
          >
            Thông tin định tuyến mới chờ duyệt của SP/CT :
            <span class="text-blue">
              {{ item.name }} ({{
                [item.width, item.height, item.length].join("*")
              }})
            </span>
          </div>

          <DxDataGrid
            id="routings"
            :show-borders="true"
            :data-source="routingTemps"
            @init-new-row="onInitNewRow"
          >
            <DxColumn
              data-field="stepId"
              caption="Định tuyến mới đang chờ duyệt"
              cssClass="maudinhtuyen2"
            >
              <DxLookup
                :data-source="data1"
                value-expr="id"
                display-expr="description"
              />
            </DxColumn>
            <DxColumn
              :width="120"
              data-field="order"
              caption="Thứ tự"
              alignment="center"
              cssClass="maudinhtuyen2"
            />
          </DxDataGrid>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxFilterRow,
  DxHeaderFilter,
  DxSearchPanel,
  DxLookup,
  DxEditing,
} from "devextreme-vue/data-grid";
import { mySources } from "src/store/base/getters";

export default {
  components: {
    DxDataGrid,
    DxHeaderFilter,
    DxColumn,
    DxFilterRow,
    DxSearchPanel,
    DxLookup,
    DxEditing,
  },
  data() {
    return {
      data: null,
      data1: null,
      factories1: [],
      item: null,
       isInsert: false,
      isUpdate: false,
      isDelete: false,
      isApprove: false,
      isReject: false,
      listItems: [],
      itemChange: [],
      card: false,
      isEdit: false,
      routingTemps: [],
      factory1: { id: 100000, label: "Nhà máy CBG Thuận Hưng" },
      factory: null,
    };
  },
  computed: {
    ...mapGetters("base", ["mySources", "userInfo", "dsCongDoans"]),
    ...mapGetters("ordersm", ["departments"]),
    ...mapGetters("prod", ["routings", "factories", "goodsTypes"]),
  },
  methods: {
      ...mapActions("prod", ["getPermissionInScreen"]),
    ...mapActions("item", ["getItemsByFactoryId"]),
    ...mapActions("base", ["getAllCongDoans"]),
    ...mapActions("prod", [
      "getRoutingsByItemId",
      "getListItemInRoutingTemp",
      "getRoutingTempByItemId",
      "addRouting",
      "addRoutingTemp",
      "acceptRoutingChange",
      "updateRoutingTemp",
      "addRoutingToRoutingTemp",
      "deleteRoutingTempByItemId",
      "getItemInRoutingTemp",
      "saveRouting",
      "removeRoutingTemp",
    ]),
    onInitNewRow(e) {
      e.data.order = this.routingTemps.length + 1;
    },
     async loadPermission() {
  
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.getPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((el) => {
        if (el.CODE == "approve") {
          this.isApprove = true;
        }
        if (el.CODE == "reject") {
          this.isReject = true;
        }
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
    },
    async onchange() {
      let code;
      await this.getAllCongDoans({ factoryId: this.factory1.id });
      let congdoan = this.dsCongDoans
        .filter((s) => s.type2 === "to" || s.type2 === "kho")
        .map((o) => ({
          name: o.name,
          id: o.id,
          description: `[${o.code}] - ${o.name}`,
          icon: "mail",
          factoryId: o.factoryId,
        }));
      this.data1 = congdoan;
      console.log("this.factory1.id", this.factory1.id);
      console.log("data1", this.data1);
      if (this.factory1.id === 102339) {
        await this.getAllCongDoans({ factoryId: 102340 });
        let congdoan1 = this.dsCongDoans
          .filter((s) => s.type2 === "to" || s.type2 === "kho")
          .map((o) => ({
            name: o.name,
            id: o.id,
            description: `[${o.code}] - ${o.name}`,
            icon: "mail",
            factoryId: o.factoryId,
          }));
        congdoan1.forEach((el) => {
          this.data1.push(el);
        });
      }
      if (this.factory1.id === 102340) {
        await this.getAllCongDoans({ factoryId: 102339 });
        let congdoan1 = this.dsCongDoans
          .filter((s) => s.type2 === "to" || s.type2 === "kho")
          .map((o) => ({
            name: o.name,
            id: o.id,
            description: `[${o.code}] - ${o.name}`,
            icon: "mail",
            factoryId: o.factoryId,
          }));
        congdoan1.forEach((el) => {
          this.data1.push(el);
        });
      }
      console.log("datafile", congdoan);
      if (this.item) {
        this.loadRouting();
        this.loadRoutingTemp();
        this.checkEdit();
      }
    },
    async onEditRouting() {
      let factoryId;
      if (this.factory1 !== null) {
        factoryId = this.factory1.factoryId;
      } else {
        factoryId = this.factory.factoryId;
      }
      const payload = {
        itemId: this.item.id,
        factoryId,
      };
      await this.addRoutingToRoutingTemp(payload);
      this.loadRoutingTemp();
      this.isEdit = true;
    },
    async onSelectionChanged({ selectedRowsData }) {
      this.item = selectedRowsData[0];
      this.loadRouting();
      this.loadRoutingTemp();
      this.checkEdit();
    },
    async checkEdit() {
      const payload = {
        itemId: this.item.id,
        factoryId: this.factory1.factoryId,
      };
      const data = await this.getItemInRoutingTemp(payload);
      this.itemChange = data;
      if (data.length > 0) {
        console.log("true");
        this.isEdit = true;
      } else {
        console.log("false");
        this.isEdit = false;
      }
    },
    async onReject() {
      this.$q
        .dialog({
          html: true,
          title: `<span style="color:orange">Xác nhận</span>`,
          message: `<span style="color:orange">Bạn có chắc chắn muốn từ chối không?</span>`,
          color: "positive",
          ok: `Đồng ý`,
          cancel: `Hủy`,
        })
        .onOk(() => {
          this.onTuChoi();
        });
    },
    async onTuChoi(){
      await this.deleteRoutingTempByItemId({ itemId: this.item.id });
      this.loadRouting();
      this.loadRoutingTemp();
      this.checkEdit();
      this.loadItems();
    },
    async onAccept() {
      this.$q
        .dialog({
          html: true,
          title: `<span style="color:orange">Xác nhận</span>`,
          message: `<span style="color:orange">Bạn có chắc chắn muốn phê duyệt không?</span>`,
          color: "positive",
          ok: `Đồng ý`,
          cancel: `Hủy`,
        })
        .onOk(() => {
          this.onPheDuyet();
        });
    },
    async onPheDuyet(){
      await this.acceptRoutingChange({ itemId: this.item.id, factoryId: this.factory1.factoryId });
      this.onTuChoi();
      this.loadRouting();
      this.loadRoutingTemp();
      this.loadItems();
    },
    async loadRouting() {
      let factoryId;
      if (this.factory1 !== null) {
        factoryId = this.factory1.factoryId;
      } else {
        factoryId = this.factory.factoryId;
      }

      await this.getRoutingsByItemId({ itemId: this.item.id, factoryId });
    },
    async loadRoutingTemp() {
      console.log("item", this.item.id);
      let factoryId;
      if (this.factory1 !== null) {
        factoryId = this.factory1.factoryId;
      } else {
        factoryId = this.factory.factoryId;
      }

      const data = await this.getRoutingTempByItemId({
        itemId: this.item.id,
        factoryId,
      });
      console.log("data", data);
      this.routingTemps = data.filter(d => d.STATUS != "delete");
    },
    async loadItems() {
      const payload = {
        factoryId: this.factory1.factoryId,
      };
      const data = await this.getListItemInRoutingTemp(payload);
      this.listItems = data;
    },
    async chonNhaMay() {
      this.loadItems();
    },
  },
  async created() {
    this.loadPermission();
    this.factories1 = this.userInfo.role.types[0].value
      .filter((s) => s.type2 === "nhaMay" && s.parentId === 102299)
      .map((o) => ({
        label: o.name,
        code: o.code,
        factoryId: o.factory,
        id: o.id,
        value: o.factory,
      }));
    this.factory1 = this.factories1[0];
    await this.loadItems();
    this.onchange()
  },
  async mounted() {
    this.data = this.mySources;
  },
};
</script>
<style >
</style>
