<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="top-title col-8">Danh mục Sản phẩm</div> 
        </div>
        <q-btn
              color="positive"
              v-show="isInsert"
              label="Thêm sản phẩm"
              @click="addItem"
            />
      </q-card-section>
      <q-card-section>
        <div class="row">
          
            <DxDataGrid
              id="gridContainer"
              :data-source="items"
              :allow-column-reordering="true"
              :columns-auto-width="true"
              :show-borders="true"
              :show-column-lines="true"
              :show-row-lines="true"
              :allow-column-resizing="true"
              key-expr="id"
            >
              <DxPaging :enabled="true" />
              <!-- <DxEditing v-if="ad"
                        :allow-updating="true"
                        :allow-adding="true"
                         mode="popup"
              /> -->
              <DxFilterRow :visible="true" />
              <DxHeaderFilter :visible="true" />

              <DxColumn data-field="code" caption="Mã" :width="100">
                <DxRequiredRule />
              </DxColumn>
              <DxColumn data-field="name" caption="Tên sản phẩm">
                <DxRequiredRule />
              </DxColumn>
              <DxColumn :width="80" data-field="Unit.id" caption="Đơn vị">
                <DxLookup
                  :data-source="units"
                  display-expr="name"
                  value-expr="id"
                />
                <DxRequiredRule />
              </DxColumn>
              <DxColumn data-field="height" :width="120" caption="Dầy">
                <DxRequiredRule />
              </DxColumn>
              <DxColumn data-field="width" :width="120" caption="Rộng">
                <DxRequiredRule />
              </DxColumn>
              <DxColumn data-field="length" :width="120" caption="Dài">
                <DxRequiredRule />
              </DxColumn>
              <DxColumn
                data-field="volumn"
                :width="110"
                caption="Khối lượng/m³"
              >
                <DxRequiredRule />
              </DxColumn>
              <DxColumn
                data-field="woodsType"
                :width="100"
                caption="Dòng Sản Phẩm"
              >
                <DxLookup
                  :data-source="dongsanpham"
                  display-expr="label"
                  value-expr="id"
                />
                <DxRequiredRule />
              </DxColumn>
              <DxColumn
                data-field="recipeGroup"
                :width="100"
                caption="Nhóm định mức"
              />
              <DxColumn
                :width="125"
                data-field="ItemType.id"
                caption="Loại sản phẩm"
              >
                <DxLookup
                  :data-source="itemTypes"
                  display-expr="name"
                  value-expr="id"
                />
                <DxRequiredRule />
              </DxColumn>
              <DxColumn
                v-if="isUpdate"
                caption="..."
                width="50"
                cell-template="del-cell"
              />
              <template v-if="isUpdate" #del-cell="cell">
                <span class="fake-link" @click="onSelectionChanged(cell)"
                  >Sửa</span
                >
              </template>
            </DxDataGrid>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="showChooseItem" persistent>
      <q-card style="min-width: 70%">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title">
              Nhập thông tin sản phẩm/Cụm/Chi tiết...
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <p style="font-style: italic; color: violet">
                - Nếu khối lượng tính theo công thức (D*R*D*10^-9) thì bỏ qua
                thông tin "Khối lượng/sp"
              </p>
              <p style="font-style: italic; color: violet">
                - Nếu sản phẩm là các "Thành phẩm" thì hãy nhập thêm thông tin
                mã Ikea và mã thị trường
              </p>
            </div>
          </div>
          <div class="row justify-around">
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iCode" type="text" label="Mã sản phẩm" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iName" type="text" label="Tên sản phẩm" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input
                v-model="iHeight"
                type="text"
                label="Kích thước chiều DẦY"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input
                v-model="iWidth"
                type="text"
                label="Kích thước chiều RỘNG"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input
                v-model="iLength"
                type="text"
                label="Kích thước chiều DÀI"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                v-model="iType"
                :options="iTypes"
                label="Loại sản phẩm"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select v-model="iUnit" :options="iUnits" label="Đơn vị" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iVolumn" type="text" label="Khối lượng/sp" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                v-model="iGOODS_TYPE"
                :options="dongsanpham"
                label="Dòng sản phẩm"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                v-model="irecipeGroup"
                :options="recipeGroup"
                label="Nhóm định mức"
              />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="red" @click="cancel" />
          <q-btn flat label="Lưu lại" @click="createItem" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
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
    DxLookup,
    DxSearchPanel,
    DxHeaderFilter,
    DxFilterRow,
    DxRequiredRule,
  },
  data() {
    return {
      events: [],
      dataSource: [],
      states: [],
      showChooseItem: false,
      units: [],
      items: [],
      itemTypes: [],
      irecipeGroup:null,

      dongsanpham: [
        {
          label: "Plywood",
          id: "Plywood",
        },
        {
          label: "LVL",
          id: "lvl",
        },
      ],
      recipeGroup: [
        {
          label: "1",
          id: "1",
        },
        {
          label: "2",
          id: "2",
        },
        {
          label: "3",
          id: "3",
        },
        {
          label: "4",
          id: "4",
        },
        {
          label: "5",
          id: "5",
        },
        {
          label: "6",
          id: "6",
        },
      ],

      iCode: "",
      iName: "",
      iUnit: null,
      iUnits: [],
      iHeight: "",
      iWidth: "",
      iLength: "",
      iVolumn: "",
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      iGOODS_TYPE: "",
      iType: null,
      iTypes: [],
      ikeas: [],
      isEdit: false,
      currentItemSelectId: null,
    };
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "userInfo"]),
  },
  created() {
    console.log(this.userInfo);
    this.loadPermission();
    // if (this.userInfo.id === 100400 || this.userInfo.id === 101967 || this.userInfo.id ===101966 || this.userInfo.id === ) {
    //   this.ad = true;
    // }   
    this.load();
  },
  methods: {
    ...mapActions("prod", ["getPermissionInScreen"]),
    ...mapActions("vcn", ["GET_ITEMS_VCN"]),
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
    addItem() {
      this.isEdit = false;
      this.iCode = "";
      this.iName = "";
      this.iHeight = "";
      this.iWidth = "";
      this.iLength = "";
      this.iVolumn = "";
      this.iGOODS_TYPE = {
        label: "Khác",
        id: "Khác",
      };
      this.showChooseItem = true;
    },
    cancel() {
      this.showChooseItem = false;
    },
    async delIkea(e) {
      const currentIndexIkea = this.ikeas.findIndex((d) => {
        return d.id === e.key;
      });
      if (e.key) {
        const data = await this.$store.dispatch("base/DEL_IKEA", e.key);
        if (data.meta.success) {
          showNotifySuccess("Xóa thành công !");

          this.ikeas.splice(currentIndexIkea, 1);
        } else {
          showNotifyError();
        }
      }
    },
    removing() {
      this.showChooseItem = false;
    },
    async updatedIkea(e) {
      const payload = {
        productId: this.currentItemSelectId,
        data: {
          code: e.data.code,
          name: e.data.name,
        },
      };
      const data = await this.$store.dispatch("base/UPDATE_IKEA", payload);
      if (data.meta.success) {
        showNotifySuccess("Cập nhật thành công !");
      } else {
        showNotifyError();
      }
    },
    async insertIkea(e) {
      // console.log(e.data)
      const payload = {
        productId: this.currentItemSelectId,
        code: e.data.code,
        name: e.data.name,
        factoryId: 100000,
        // factoryName: this.myFactoryInfor.name,
      };
      const data = await this.$store.dispatch("base/CREATE_IKEA", payload);
      if (data.meta.success) {
        showNotifySuccess("Cập nhật thành công !");
      } else {
        showNotifyError();
      }
    },
    async onSelectionChanged(e) {
      console.log("e", e);
      this.currentItemSelectId = e.data.data.id;
      this.iCode = e.data.data.code;
      this.iName = e.data.data.name;
      this.iHeight = e.data.data.height;
      this.iWidth = e.data.data.width;
      this.iLength = e.data.data.length;
      this.iVolumn = e.data.data.volumn;
      this.iGOODS_TYPE = e.data.data.woodsType;
      this.irecipeGroup = e.data.data.recipeGroup;
      this.iType = this.iTypes.find((t) => {
        return t.value === e.data.data.ItemType.id;
      });
      this.iUnit = this.iUnits.find((u) => {
        return u.value === e.data.data.Unit.id;
      });
      this.isEdit = true;
      await this.loadIkea(e.data.data.id);
      this.showChooseItem = true;
    },
    async addIkea(productId) {
      // if (this.ikeas.length>0) {
      //   this.ikeas.forEach(async (element) => {
      //   })
      // }
    },
    async loadIkea(itemId) {
      if (itemId) {
        this.ikeas = [];
        const data = await this.$store.dispatch(
          "base/GET_IKEA_BY_ITEM",
          itemId
        );
        this.ikeas = data.data;
      }
    },
    load() {
      Promise.all([this.loadUnit(), this.loadItems(), this.loadItemTypes()]);
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
      const data = await this.GET_ITEMS_VCN();
      this.items = data;
      console.log(data);
    },
    async loadItemTypes() {
      const myItemType = this.$route.query.type;
      const payload = {
        typeId: myItemType,
      };
      let data = await this.$store.dispatch("vcn/GET_ITEM_TYPE_VCN", payload);
      this.itemTypes = data;
      console.log("itemType", data);
      this.itemTypes.forEach((element) => {
        this.iTypes.push({
          label: element.name,
          value: element.id,
        });
      });
    },
    async createItem() {
      let pVolumn = 0;
      if (this.iHeight && this.iWidth && this.iLength) {
        pVolumn = this.iHeight * this.iLength * this.iWidth * Math.pow(10, -9);
      }
      if(pVolumn == 0){
        pVolumn = null;
      }
      if (this.iCode && this.iName && this.iType && this.iUnit) {
        if (this.isEdit) {
          const payload = {
            id: this.currentItemSelectId,
            data: {
              code: this.iCode,
              name: this.iName,
              length: this.iLength,
              width: this.iWidth,
              height: this.iHeight,
              typeId: this.iType.value,
              unitId: this.iUnit.value,
              factoryId: 102498,
              modifiedBy: this.userInfo.id,
              volumn: this.iVolumn || pVolumn,
              woodsType: this.iGOODS_TYPE != null ? this.iGOODS_TYPE.id : null,
              recipeGroup:  this.irecipeGroup != null ? this.irecipeGroup.id : null,
              updatedAt: moment().format("YYYY-MM-DD hh:mm:ss"),
              active: 1,
            },
          };
          const data = await this.$store.dispatch(
            "vcn/UPDATE_ITEM_VCN",
            payload
          );
          if (data) {
            showNotifySuccess("Cập nhật thành công !");
            this.showChooseItem = false;
            this.loadItems();
          } else {
            showNotifyError();
          }
        } else {
          const payload = {
            code: this.iCode,
            name: this.iName,
            length: this.iLength,
            width: this.iWidth,
            height: this.iHeight,
            typeId: this.iType.value,
            unitId: this.iUnit.value,
            factoryId: 102496,
            volumn: this.iVolumn || pVolumn,
            woodsType: this.iGOODS_TYPE.id,
            active: 1,
            createdBy: this.userInfo.id,
          };
          const data = await this.$store.dispatch("vcn/ADD_ITEM_VCN", payload);
          if (data) {
            showNotifySuccess();
            this.showChooseItem = false;
          } else {
            showNotifyError();
          }
        }
      } else {
        showNotifyValidate();
      }
    },
    logEvent(eventName) {},
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