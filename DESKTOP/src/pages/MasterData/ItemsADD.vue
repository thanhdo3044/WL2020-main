<template>
  <q-page class="q-pa-md">
    <!-- <div class="div" v-if="isBeforeAprove"> -->
    <div class="div">
      <div>
        <div class="row" style="background-color: #daf8e1">
          <div class="col-6 text-blue text-bold" style="font-size: 18px">
            Danh mục tên Sản phẩm/Cụm/Chi tiết cần trưởng nhóm duyệt
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <DxDataGrid id="gridContainer" :word-wrap-enabled="true" :data-source="items" :allow-column-reordering="true"
            :columns-auto-width="true" :show-borders="true" :show-column-lines="true" :show-row-lines="true"
            :allow-column-resizing="true" key-expr="ID">
            <DxPaging :enabled="true" />
            <DxExport :enabled="true" :allow-export-selected-data="false" />
            <DxFilterRow :visible="true" />
            <DxHeaderFilter :visible="true" />
            <DxColumn data-field="LAST_NAME" caption="Người tạo" :width="150" />
            <DxColumn data-field="CODE" caption="Mã sản phẩm" :width="120">
              <DxRequiredRule />
            </DxColumn>
            <DxColumn data-field="NAME" caption="Tên">
              <DxRequiredRule />
            </DxColumn>
            <DxColumn :width="80" data-field="UNIT_ID" caption="Đơn vị">
              <DxLookup :data-source="units" display-expr="name" value-expr="id" />
              <DxRequiredRule />
            </DxColumn>
            <DxColumn data-field="HEIGHT" :width="120" caption="Dầy">
              <DxRequiredRule />
            </DxColumn>
            <DxColumn data-field="WIDTH" :width="120" caption="Rộng">
              <DxRequiredRule />
            </DxColumn>
            <DxColumn data-field="LENGTH" :width="120" caption="Dài">
              <DxRequiredRule />
            </DxColumn>
            <DxColumn data-field="VOLUMN" :width="110" caption="Khối lượng/m³">
              <DxRequiredRule />
            </DxColumn>
            <DxColumn data-field="GOODS_TYPE" :width="130" caption="Dòng Sản Phẩm">
              <DxRequiredRule />
            </DxColumn>
            <DxColumn data-field="GHICHU" :width="130" caption="Ghi chú" />
            <DxColumn :width="200" data-field="TYPE_ID" caption="Loại sản phẩm">
              <DxLookup :data-source="itemTypes" display-expr="name" value-expr="id" />
              <DxRequiredRule />
            </DxColumn>
            <DxColumn caption="Phê duyệt" width="200" cell-template="del-cell" />
            <template #del-cell="cell">
              <div class="row">
                <q-btn class="col-6" color="positive" style="margin-right:10px" label="Trưởng nhóm duyệt"
                  @click="pheduyet(cell)" />
                <q-btn class="col-5" color="red" label="Hủy" @click="tuchoiTruongNhom(cell)" />
              </div>
            </template>
          </DxDataGrid>
        </div>
      </div>
    </div>
    <!-- <div v-else>
      <div>
        <div class="row" style="background-color: #daf8e1">
          <div class="col-6 text-blue text-bold" style="font-size: 18px">
            Danh mục tên Sản phẩm/Cụm/Chi tiết đã duyệt qua bởi nhóm trưởng
          </div>
        </div>
      </div>
      <DxDataGrid id="gridContainer" :word-wrap-enabled="true" :data-source="itemsGD" :allow-column-reordering="true"
        :columns-auto-width="true" :show-borders="true" :show-column-lines="true" :show-row-lines="true"
        :allow-column-resizing="true" key-expr="ID">
        <DxPaging :enabled="true" />
        <DxExport :enabled="true" :allow-export-selected-data="false" />
        <DxFilterRow :visible="true" />
        <DxHeaderFilter :visible="true" />
        <DxColumn data-field="LAST_NAME" caption="Người tạo" :width="150" />
        <DxColumn data-field="CODE" caption="Mã sản phẩm" :width="120">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="NAME" caption="Tên">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn :width="80" data-field="UNIT_ID" caption="Đơn vị">
          <DxLookup :data-source="units" display-expr="name" value-expr="id" />
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="HEIGHT" :width="120" caption="Dầy">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="WIDTH" :width="120" caption="Rộng">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="LENGTH" :width="120" caption="Dài">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="VOLUMN" :width="110" caption="Khối lượng/m³">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="GOODS_TYPE" :width="130" caption="Dòng Sản Phẩm">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="GHICHU" :width="130" caption="Ghi chú" />
        <DxColumn :width="200" data-field="TYPE_ID" caption="Loại sản phẩm">
          <DxLookup :data-source="itemTypes" display-expr="name" value-expr="id" />
          <DxRequiredRule />
        </DxColumn>
        <DxColumn caption="Phê duyệt" width="200" cell-template="del-cell" />
        <template #del-cell="cell">
          <div class="row">
            <q-btn class="col-6" color="positive" style="margin-right:10px" label="TPKH duyệt"
              @click="pheduyet(cell)" />
            <q-btn class="col-5" color="red" label="Hủy" @click="tuchoiTPKH(cell)" />
          </div>
        </template>
      </DxDataGrid>
    </div> -->
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
  DxRequiredRule,
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
    DxRequiredRule,
  },
  data() {
    return {
      events: [],
      ad: false,
      dataSource: [],
      states: [],
      showChooseItem: false,
      units: [],
      items: [],
      itemTypes: [],
      itemsGD: [],
      dongsanpham: [
        {
          label: "Outdoor   ",
          id: "Outdoor   ",
        },
        {
          label: "HOME DEPOT",
          id: "HOME DEPOT",
        },
        {
          label: "Indoor    ",
          id: "Indoor    ",
        },
        {
          label: "Ván ghép thanh",
          id: "Ván ghép thanh",
        },
        {
          label: "KXC Nội Địa",
          id: "KXC Nội Địa",
        },
        {
          label: "Block Board",
          id: "Block Board",
        },
        {
          label: "Walmart",
          id: "Walmart",
        },
        {
          label: "Khác",
          id: "Khác",
        },
      ],
      grafts: [
        {
          label: "Khác",
          value: null,
        },
        {
          label: "Kín",
          value: "K",
        },
        {
          label: "Hở",
          value: "H",
        },
        {
          label: "không ghép",
          value: "KGH",
        },
      ],
      codeNL: "",

      iCode: "",
      iName: "",
      GHICHU: "",
      emailnhan: null,
      emailToTruong: [ "vietnq@woodsland.vn"],
      iUnit: null,
      iUnits: [],
      iHeight: "",
      iWidth: "",
      iLength: "",
      iVolumn: "",
      nguoitaoID: null,
      iGOODS_TYPE: "",
      iGraft: "",
      iType: null,
      iTypes: [],
      ikeas: [],
      isEdit: false,
      currentItemSelectId: null,
      isInsert: false,
      isEdit: false, isDelete: false, isBeforeAprove: false,
    };
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "userInfo"]),
  },
  created() {
    if (this.userInfo.id === 100400 || this.userInfo.id === 102089) {
      this.ad = true;
    }
    this.loadPermission();
    this.load();
  },
  methods: {
    ...mapActions("prod", ["getPermissionInScreen"]),
    ...mapActions("messages", ["sendNotificationMail"]),
    async loadPermission() {
      console.log("router dinh tuyen", this.$route.path);
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.$store.state.base.userInfo.id,
      };
      let listPermission = await this.getPermissionInScreen(payloadPermission);
      listPermission.data.forEach((el) => {
        console.log('EEEEEEEE', el)
        if (el.CODE == "insert") {
          this.isInsert = true;
        }
        if (el.CODE == "delete") {
          this.isDelete = true;
        }
        if (el.CODE == "beforeApprove") {
          this.isBeforeAprove = true;
        }
      });
    },
    addItem() {
      this.isEdit = false;
      this.iCode = "";
      this.iName = "";
      this.iHeight = "";
      this.iWidth = "";
      this.iLength = "";
      this.iVolumn = "";
      this.iGOODS_TYPE = "";
      this.GHICHU = "";
      // this.iGraft =  {
      //     label: "Khác",
      //     value: "KHAC"
      //   };
      this.showChooseItem = true;
    },
    async pheduyet(e) {
      this.$q
        .dialog({
          html: true,
          title: `<span style="color:orange">Xác nhận</span>`,
          message: `<span style="color:orange">Bạn có chắc chắn muốn duyệt không?</span>`,
          color: "positive",
          ok: `Đồng ý`,
          cancel: `Hủy`,
        })
        .onOk(() => {
          this.onPheDuyet(e);
        });
    },

    async onPheDuyet(e) {
      this.currentItemSelectId = e.data.data.ID;
      this.iCode = e.data.data.CODE;
      this.iName = e.data.data.NAME;
      this.iHeight = e.data.data.HEIGHT;
      this.iWidth = e.data.data.WIDTH;
      this.iLength = e.data.data.LENGTH;
      this.iVolumn = e.data.data.VOLUMN;
      this.iGOODS_TYPE = e.data.data.GOODS_TYPE;
      this.GHICHU = e.data.data.GHICHU;
      this.iType = this.iTypes.find((t) => {
        return t.value === e.data.data.TYPE_ID;
      });
      this.nguoitaoID = e.data.data.CREATE_BY;
      this.emailnhan = this.users.find((k) => {
        return k.ID === e.data.data.CREATE_BY;
      });
      this.iUnit = this.iUnits.find((u) => {
        return u.value === e.data.data.UNIT_ID;
      });
      const payload = {
        ID: e.data.data.ID,
        approvedByAccountGD: this.$store.state.base.userInfo.id,
      };
      const data = await this.$store.dispatch("prod/UPDATE_ITEMS_ADD", payload);
      if (data.meta.success) {
        showNotifySuccess("phê duyệt thành công!");
        const payload = {
          code: this.iCode,
          name: this.iName,
          length: this.iLength,
          width: this.iWidth,
          height: this.iHeight,
          typeId: this.iType.value,
          unitId: this.iUnit.value,
          factoryId: 100000,
          volumn: this.iVolumn,
          GOODS_TYPE: this.iGOODS_TYPE,
          GHICHU: this.GHICHU,
        };
        const data2 = await this.$store.dispatch("base/ADD_ITEM", payload)
        if (data2.meta.success) {
          this.codeNL = this.iHeight + "" + this.iWidth + "" + this.iLength;
          console.log("code:", this.iType.value);
          if (this.iType.value == 100001) {
            const payload = {
              code: this.codeNL,
              name: this.iName,
              day: this.iHeight,
              rong: this.iWidth,
              dai: this.iLength,
              volumn: this.iVolumn,
              nhom: 100136,
              dataPrice: this.codeNL,
              uid: this.nguoitaoID,
            };
            const data = await this.$store.dispatch(
              "nlg/ADD_QUI_CACH_OPTIONS",
              payload
            );
          }
        }
        this.$store.dispatch("prod/DELETE_ITEM_ADD_DONE");
        this.loadItems();
        this.sendMailPheDuyetTPKH(this.emailToTruong, this.nguoitaoID);
      } else {
        showNotifyError();
      }
    },
    // async pheduyetBefore(e) {
    //   this.$q
    //     .dialog({
    //       html: true,
    //       title: `<span style="color:orange">Xác nhận</span>`,
    //       message: `<span style="color:orange">Bạn có chắc chắn muốn duyệt không?</span>`,
    //       color: "positive",
    //       ok: `Đồng ý`,
    //       cancel: `Hủy`,
    //     })
    //     .onOk(() => {
    //       this.onPheDuyetBefore(e);
    //     });
    // },
    // async onPheDuyetBefore(e) {
    //   this.currentItemSelectId = e.data.data.ID;
    //   this.iCode = e.data.data.CODE;
    //   this.iName = e.data.data.NAME;
    //   this.iHeight = e.data.data.HEIGHT;
    //   this.iWidth = e.data.data.WIDTH;
    //   this.iLength = e.data.data.LENGTH;
    //   this.iVolumn = e.data.data.VOLUMN;
    //   this.iGOODS_TYPE = e.data.data.GOODS_TYPE;
    //   this.GHICHU = e.data.data.GHICHU;
    //   this.iType = this.iTypes.find((t) => {
    //     return t.value === e.data.data.TYPE_ID;
    //   });
    //   this.nguoitaoID = e.data.data.CREATE_BY;
    //   //lấy mail
    //   this.emailnhan = this.users.find((k) => {
    //     return k.ID === e.data.data.CREATE_BY;
    //   });
    //   this.iUnit = this.iUnits.find((u) => {
    //     return u.value === e.data.data.UNIT_ID;
    //   });
    //   const payload = {
    //     ID: e.data.data.ID,
    //     approvedByAccount: this.$store.state.base.userInfo.id,
    //   };
    //   console.log('Payload ', payload)
    //   const data = await this.$store.dispatch("prod/UPDATE_ITEMS_ADD_BEFORE", payload);
    //   if (data.meta.success) {
    //     showNotifySuccess("phê duyệt thành công!");
    //     const payload = {
    //       code: this.iCode,
    //       name: this.iName,
    //       length: this.iLength,
    //       width: this.iWidth,
    //       height: this.iHeight,
    //       typeId: this.iType.value,
    //       unitId: this.iUnit.value,
    //       factoryId: 100000,
    //       volumn: this.iVolumn,
    //       GOODS_TYPE: this.iGOODS_TYPE,
    //       GHICHU: this.GHICHU,
    //     };
    //     this.sendMailPheDuyet(this.emailTPKH, this.nguoitaoID);
    //     // const data2 = await this.$store.dispatch("base/ADD_ITEM", payload);
    //     this.loadItems();
    //   } else {
    //     showNotifyError();
    //   }
    // },
    async loadUser() {
      const data = await this.$store.dispatch("base/getUser");
      this.users = data.data;
    },
    async sendMailPheDuyet(mail, accountId) {
      let baseUrl = null;
      if (process.env.PROD) {
        baseUrl = `https://app.woodsland.com.vn:2002/#/master-data-item-add`;
      } else {
        baseUrl = `http://localhost:5000/#/master-data-item-add`;
      }
      let payloadMail = {
        baseUrl: baseUrl,
        email: mail,
        accountId: this.userInfo.id,
        toAccountId: accountId,
        subject: `Có chi tiết thêm mới cần được phê duyệt`,
        title: "Nhấp vào đây để đi tới phê duyệt",
        dataBody: `Chi tiết mới được tạo bởi ${this.userInfo.lastName} cần được phê duyệt.`,
      };
      await this.sendNotificationMail(payloadMail);
    },
    //gửi lại mail cho tổ trưởng
    async sendMailPheDuyetTPKH(mail, accountId) {
      let baseUrl = null;
      if (process.env.PROD) {
        baseUrl = `https://app.woodsland.com.vn:2002/#/master-data-item-add`;
      } else {
        baseUrl = `http://localhost:5000/#/master-data-item-add`;
      }
      let payloadMail = {
        baseUrl: baseUrl,
        email: mail,
        accountId: this.userInfo.id,
        toAccountId: accountId,
        subject: `Chi tiết thêm mới đã được phê duyệt`,
        title: "Chi tiết thêm mới đã được phê duyệt",
        dataBody: `Chi tiết mới được duyệt bởi ${this.userInfo.lastName}`,
      };
      await this.sendNotificationMail(payloadMail);
    },
    //Gửi lai mail cho user
    async sendMailHuyPheDuyet(mail, accountId) {
      let baseUrl = null;
      if (process.env.PROD) {
        baseUrl = `https://app.woodsland.com.vn:2002/#/master-data-item-add`;
      } else {
        baseUrl = `http://localhost:5000/#/master-data-item-add`;
      }
      let payloadMail = {
        baseUrl: baseUrl,
        email: mail,
        accountId: this.userInfo.id,
        toAccountId: accountId,
        subject: `Chi tiết thêm mới bị từ chối phê duyệt`,
        title: "Chi tiết thêm mới đã bị từ chối phê duyệt",
        dataBody: `Chi tiết mới bị từ chối phê duyệt bởi ${this.userInfo.lastName}`,
      };
      await this.sendNotificationMail(payloadMail);
    },
    //TPKD gửi lại mail cho tổ trưởng
    async sendMailTuChoiTPKD(mail, accountId) {
      let baseUrl = null;
      if (process.env.PROD) {
        baseUrl = `https://app.woodsland.com.vn:2002/#/master-data-item-add`;
      } else {
        baseUrl = `http://localhost:5000/#/master-data-item-add`;
      }
      let payloadMail = {
        baseUrl: baseUrl,
        email: mail,
        accountId: this.userInfo.id,
        toAccountId: accountId,
        subject: `Chi tiết thêm mới bị từ chối phê duyệt`,
        title: "Chi tiết thêm mới đã bị từ chối phê duyệt",
        dataBody: `Chi tiết mới bị từ chối phê duyệt bởi ${this.userInfo.lastName}`,
      };
      await this.sendNotificationMail(payloadMail);
    },
    tuchoiTruongNhom(e) {
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
          this.onTuChoi(e);
          // this.sendMailHuyPheDuyet(this.emailToTruong, this.nguoitaoID);
        });
    },
    async onTuChoi(e) {
      const payload = {
        ID: e.data.data.ID,
      };
      const data = await this.$store.dispatch("prod/DEL_ITEMS_ADD", payload);
      if (data.meta.success) {
        showNotifySuccess("từ chối thành công!");
        this.loadItems();
      } else {
        showNotifyError();
      }
    },
    // TPKH từ chối SP
    tuchoiTPKH(e) {
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
          this.onTuChoiGD(e);
          this.sendMailTuChoiTPKD(this.emailToTruong, this.nguoitaoID);
        });
    },
    async onTuChoiGD(e) {
      const payload = {
        ID: e.data.data.ID,
      };
      const data = await this.$store.dispatch("prod/DEL_ITEMS_ADD", payload);
      if (data.meta.success) {
        showNotifySuccess("từ chối thành công!");
        this.loadItemsGD();
      } else {
        showNotifyError();
      }
    },
    cancel() {
      this.showChooseItem = false;
    },

    removing() {
      this.showChooseItem = false;
    },

    load() {
      Promise.all([
        this.loadUnit(),
        this.loadItems(),
        this.loadUser(),
        this.loadItemTypes(),
        this.loadItemsGD(),
      ]);
    },
    async loadUnit() {
      let data = await this.$store.dispatch("base/GET_UNITS", 1);
      this.units = data.data;
      this.units.forEach((element) => {
        this.iUnits.push({
          label: element.name,
          value: element.id,
        });
      });
    },
    async loadItems() {
      const myFactoryId = 100000;
      const myItemType = this.$route.query.type;
      const payload = {
        factoryId: myFactoryId,
        typeId: myItemType,
      };
      if (myFactoryId) {
        let data = await this.$store.dispatch("prod/GET_ITEMS_ADD", payload);
        this.items = data.data;
      }
    },
    async loadItemsGD() {
      const myFactoryId = 100000;
      const myItemType = this.$route.query.type;
      const payload = {
        factoryId: myFactoryId,
        typeId: myItemType,
      };
      if (myFactoryId) {
        let data = await this.$store.dispatch("prod/GET_ITEMS_ADD_GD", payload);
        this.itemsGD = data.data;
      }
      console.log('iTemsGD ', this.itemsGD)
    },
    async loadItemTypes() {
      const myItemType = this.$route.query.type;
      const payload = {
        typeId: myItemType,
      };
      let data = await this.$store.dispatch("base/GET_ITEM_TYPES", payload);
      this.itemTypes = data.data;
      this.itemTypes.forEach((element) => {
        this.iTypes.push({
          label: element.name,
          value: element.id,
        });
      });
    },

    logEvent(eventName) { },
    closeItemChoose() {
      this.showChooseItem = false;
    },
    clearEvents() {
      this.events = [];
    },
  },
};
</script>

<style>
</style>