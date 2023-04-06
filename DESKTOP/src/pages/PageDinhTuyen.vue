<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Định tuyến danh mục sản phẩm / chi tiết CBG -
          {{ factory1 == null ? null : factory1.label }}
        </div>
      </div>
    </div>
    <div>
      <div class="text-orange row">
        <div class="col-2">
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
        <div style="margin-left: 30px; margin-top: 7px" class="col-9">
          <q-btn
            v-if="isEdit && (isInsert || isUpdate || isDelete) && !isSend"
            color="orange"
            label="Gửi phê duyệt"
            @click="onSendMail"
          />
          <q-btn
            v-if="isEdit && (isInsert || isUpdate || isDelete) && isSend"
            color="positive"
            label="Đã gửi phê duyệt"
          />

          <q-btn
            v-if="!isEdit && (isInsert || isUpdate || isDelete) && item"
            color="orange"
            label="Sửa định tuyến"
            @click="onEditRouting"
          />
          <q-btn
            v-if="isEdit && (isInsert || isUpdate || isDelete)"
            style="margin-left: 10px"
            color="red"
            label="Hủy"
            @click="onReject"
          />
           <q-btn
           v-if="listItemPending.length > 0"
            style="margin-left: 10px"
            color="orange"
            label="Danh sách định tuyến chờ duyệt"
            @click="onPending"
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

            <DxColumn
              :width="90"
              alignment="center"
              data-field="id"
              caption="ID"
            />
            <DxColumn :width="150" data-field="code" caption="Mã số" />
            <DxColumn data-field="name" caption="Tên" />
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
            :show-row-lines="true"
          >
            <DxColumn
              :width="120"
              :allowEditing="false"
              data-field="code"
              caption="Mã tổ"
              cssClass="maudinhtuyen2"
            />
            <DxColumn
              data-field="stepId"
              caption="Tên tổ"
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
        <hr style="width: 50%" />
        <br />
        <q-card v-if="isEdit" padding>
          <div
            class="bg-blue-grey-2 text-orange"
            style="padding: 10px; font-weight: bold; font-size: 18px"
          >
            Thông tin định tuyến chờ duyệt của SP/CT :
            <span class="text-positive">
              {{ item.name }} ({{
                [item.width, item.height, item.length].join("*")
              }})
            </span>
          </div>

          <DxDataGrid
            id="routings"
            :show-borders="true"
            :data-source="routingTemps"
            @row-inserted="confirmAddStep"
            @row-updated="confirmSaveStep"
            @row-removed="confirmRemoveStep"
            @init-new-row="onInitNewRow"
          >
            <DxEditing
              :refresh-mode="refreshMode"
              :allow-adding="isInsert && !isSend"
              :allow-updating="isUpdate && !isSend"
              :allow-deleting="isDelete && !isSend"
              mode="cell"
            />
            <DxColumn
              data-field="stepId"
              caption="Định tuyến mới"
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
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Bạn có muốn gửi phê duyệt định tuyến đã sửa ?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Hủy" @click="onReject" color="red" v-close-popup />
          <q-btn
            label="Có"
            @click="onSendMail"
            color="positive"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isPending">
      <q-card>
        <q-card-section class="row items-center">
          <DxDataGrid
            :data-source="listItemPending"
            :word-wrap-enabled="true"
            :show-borders="true"
            :show-row-lines="true"
            :hover-state-enabled="true"
            key-expr="ID"
          >
            <DxFilterRow :visible="true" />
            <DxHeaderFilter :visible="true" />

            <DxColumn
              :width="90"
              alignment="center"
              data-field="ID"
              caption="ID"
            />
            <DxColumn :width="150" data-field="CODE" caption="Mã số" />
            <DxColumn data-field="NAME" caption="Tên" />
          </DxDataGrid>
        </q-card-section>
      </q-card>
    </q-dialog>
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
    const nmcbgs = [
      { id: 100000, name: "Nhà máy CBG Thuận Hưng", mang: "CBG" },
      { id: 100002, name: "Nhà máy Quang Minh", mang: "CBG" },
      { id: 100004, name: "Nhà máy CBG Yên Sơn 1", mang: "CBG" },
      { id: 100005, name: "Nhà máy CBG Yên Sơn TB", mang: "CBG" },
    ];
    return {
      data: null,
      listPermission: [],
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      data1: null,
      isSend: false,
      nmcbgs,
      factories1: [],
      nmcbg: nmcbgs[0],
      departments: [],
      item: null,
      item1: null,
      item3: null,    
      listItemPending: [],
      isPending: false,
      itemChange: [],
      card: false,
      confirm: false,
      selectedRowKeys: [],
      isEdit: false,
      refreshMode: "full",
      routingTemps: [],
      refreshModes: ["full", "reshape", "repaint"],
      ordersData: null,
      // factory: null,
      factory1: null,
      // factory: {
      //   label: "Nhà máy Thuận Hưng",
      //   value: "100000",
      //   factoryId: 100000,
      //   code: "TH",
      // },
      factory: null,
      goodsType: {
        label: "Vanity",
        value: "vanity",
        code: "vanity",
      },
    };
  },
  computed: {
    ...mapGetters("base", ["mySources", "userInfo", "dsCongDoans"]),
    ...mapGetters("ordersm", ["departments"]),
    ...mapGetters("prod", ["routings", "factories", "goodsTypes"]),
    ...mapGetters("item", ["listItems", "itemSelect"]),
  },
  methods: {
    ...mapActions("item", ["getItemsByFactoryId"]),
    ...mapActions("base", ["getAllCongDoans"]),
    ...mapActions("prod", [
      "getRoutingsByItemId",
      "getRoutingTempByItemId",
      "getItemRoutingPending",
      "addRouting",
      "addRoutingTemp",
      "acceptRoutingChange",
      "updateRoutingTemp",
      "addRoutingToRoutingTemp",
      "deleteRoutingTemp",
      "deleteRoutingTempByItemId",
      "getItemInRoutingTemp",
      "saveRouting",
      "removeRouting",
      "updateSendApprove",
      "getPermissionInScreen",
    ]),
    ...mapActions("messages", ["sendNotificationMail"]),
    onInitNewRow(e) {
      e.data.order = this.routingTemps.length + 1;
    },
    async loadDepartment() {
      const { data } = await this.$store.dispatch("base/GET_DEPARTMENTS_FULL", {
        factoryId: this.$store.state.base.userInfo.departmentId,
      });
      this.departments = data;
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
        accountId: this.userInfo.id,
      };
      await this.addRoutingToRoutingTemp(payload);
      this.loadRoutingTemp();
      this.isEdit = true;
    },
    async onSelectionChanged({ selectedRowsData }) {
      console.log("this.isEdit",this.isEdit);
      console.log("this.isSend",this.isSend);
      if(this.isEdit && !this.isSend){
        this.confirm = true;
      }else{
        this.item = selectedRowsData[0];
      let factoryId;
      if (this.factory1 !== null) {
        factoryId = this.factory1.factoryId.factoryId;
      } else {
        factoryId = this.factory.factoryId.factoryId;
      }
      this.$router.replace({
        path: this.$route.fullPath,
        query: {
          itemId: selectedRowsData[0].id,
          factoryId,
        },
      });
      this.loadRouting();
      this.loadRoutingTemp();
      this.checkEdit();
      }
    },
    async onSelectionChanged1({ selectedRowsData }) {
      this.item1 = selectedRowsData[0];
      this.card = true;
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
      this.loadItemPending();
    },
    async onSendMail() {
      if (this.factory1) {
        const payload = {
          accountId: this.userInfo.id,
          factoryId: this.factory1.factoryId,
        };
        await this.updateSendApprove(payload);
        this.sendMailPheDuyet("tuantt@woodsland.com.vn", 100400);
        this.loadRouting();
        this.loadRoutingTemp();
        this.checkEdit();
        console.log("item", this.item);
      } else {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng chọn nhà máy trước khi gửi mail ! </span>`,
          persistent: true,
        });
      }
    },
    async sendMailPheDuyet(mail, accountId) {
      let baseUrl = null;
      if (process.env.PROD) {
        baseUrl = `https://app.woodsland.com.vn:2002/#/prod-routing-approve?itemId=${this.item.id}&factoryId=${this.factory1.factoryId}`;
      } else {
        baseUrl = `http://localhost:5000/#/prod-routing-approve?itemId=${this.item.id}&factoryId=${this.factory1.factoryId}`;
      }
      let payloadMail = {
        baseUrl: baseUrl,
        email: mail,
        accountId: this.userInfo.id,
        toAccountId: accountId,
        subject: `Nhà máy  ${this.factory1.label} có định tuyến của sản phẩm ${this.item.name} được sửa`,
        title: "Nhấp vào đây để đi tới phê duyệt",
        dataBody: `Định tuyến của sản phẩm ${this.item.name} được sửa. Mời bạn vào phê duyệt`,
      };
      console.log("payload mail", payloadMail);
      await this.sendNotificationMail(payloadMail);
    },
    async insertRouting(e) {
      let factoryId;
      if (this.factory1 !== null) {
        factoryId = this.factory1.factoryId;
      } else {
        factoryId = this.factory.factoryId;
      }
      let payload = {
        itemId: this.item.id,
        stepId: e.stepId,
        order: e.order,
        factoryId,
      };
      await this.addRouting(payload);
    },
    async confirmAddStep(e) {
      let factoryId;
      if (e.data.stepId !=null) {
      if (this.factory1 !== null) {
        factoryId = this.factory1.factoryId;
      } else {
        factoryId = this.factory.factoryId;
      }
      let payload = {
        itemId: this.item.id,
        ...e.data,
        factoryId,
        createBy: this.userInfo.id,
      };
      delete payload.__KEY__;
      // await this.addRouting(payload);
      await this.addRoutingTemp(payload);
   
      }
         this.loadRouting();
      this.loadRoutingTemp();
      this.checkEdit();
    },
    async confirmSaveStep(e) {
      let factoryId;
      if (this.factory1 !== null) {
        factoryId = this.factory1.factoryId;
      } else {
        factoryId = this.factory.factoryId;
      }
      let payload = {
        itemId: this.item.id,
        ...e.data,
        factoryId,
        modifyBy: this.userInfo.id,
      };
      delete payload.__KEY__;
      //await this.saveRouting(payload);
      await this.updateRoutingTemp(payload);
      this.loadRouting();
      this.loadRoutingTemp();
    },
    async confirmRemoveStep(e) {
      // await this.removeRouting(e.data);
      console.log("e.data", e.data);
      await this.deleteRoutingTemp({ ID: e.data.ID });
      this.loadRouting();
      this.loadRoutingTemp();
    },
    async loadRouting() {
      const { itemId } = this.$route.query;
      let factoryId;
      if (this.factory1 !== null) {
        factoryId = this.factory1.factoryId;
      } else {
        factoryId = this.factory.factoryId;
      }
      if (itemId != null) await this.getRoutingsByItemId({ itemId, factoryId });
      //  console.log("routing", this.routings);
    },
    async onReject() {
      await this.deleteRoutingTempByItemId({ itemId: this.item.id });
      this.loadRouting();
      this.loadRoutingTemp();
      this.checkEdit();
      this.loadItems();
    },
    async loadRoutingTemp() {
      const { itemId } = this.$route.query;
      let factoryId;
      if (this.factory1 !== null) {
        factoryId = this.factory1.factoryId;
      } else {
        factoryId = this.factory.factoryId;
      }

      const data = await this.getRoutingTempByItemId({ itemId, factoryId });
      console.log("data", data);
      this.isSend = false;
      if (data.length > 0) {
        this.isSend = data[0].IS_SEND;
      }
      this.routingTemps = data.filter(d => d.STATUS != "delete");
    },
    async onPending(){
      this.isPending = true;
    },
    async loadItemPending(){
       const payload = {
        accountId : this.userInfo.id
      }
      const data = await this.getItemRoutingPending(payload);
      console.log("data",data);
      this.listItemPending = data;
    },
    async loadItems() {
      const factory = {
        label: "Nhà máy Thuận Hưng",
        value: "100000",
        factoryId: 100000,
        code: "TH",
      };
      await this.getItemsByFactoryId(factory);
    },
    async chonNhaMay(factory) {
      this.factory = factory;
      this.$router.replace({
        path: this.$route.fullPath,
        query: {
          factoryId: factory.factoryId,
        },
      });

      await this.loadRouting();
    },
  },
  async created() {
    this.loadItemPending();
    this.loadDepartment();
    const { itemId, factoryId } = this.$route.query;
    console.log("router dinh tuyen", this.$route.path);
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
    console.log(itemId, factoryId);
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
    await this.getAllCongDoans({ factoryId: this.factory1.id });
    this.data1 = this.dsCongDoans
      .filter((s) => s.type2 === "to" || s.type2 === "kho")
      .map((o) => ({
        name: o.name,
        id: o.id,
        description: `[${o.code}] - ${o.name}`,
        icon: "mail",
        factoryId: o.factoryId,
      }));

    if (itemId) {
      this.loadRouting();
      this.loadRoutingTemp();
    }
    console.log("this.factory", this.factory);
    await this.loadItems(factoryId); // state.item
    // this.factory = this.factories.find((Nhà máy) => Nhà máy.id == factoryId);
    await this.getAllCongDoans({ factoryId: value.factoryId });
    let congdoan = this.dsCongDoans
      .filter((s) => s.type2 === "to" || s.type2 === "kho")
      .map((o) => ({
        name: o.name,
        id: o.id,
        description: `[${o.code}] ${o.name}`,
        icon: "mail",
        factoryId: o.factoryId,
      }));
    this.data1 = congdoan;
  },
  async mounted() {
    this.data = this.mySources;
  },
};
</script>
<style>
</style>
