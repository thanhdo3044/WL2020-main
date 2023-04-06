<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="top-title col-8">Danh mục Sản phẩm</div>
          <div class="col-4" align="right">
            <q-btn
              flat
              color="primary"
              icon="add_circle_outline"
              label="Thêm sản phẩm"
              @click="addItem"
            />
          </div>
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
            >
              <DxPaging :enabled="true" />
              <!-- <DxEditing
                        :allow-updating="true"
                        :allow-adding="true"
                         mode="popup"
              />-->
              <DxFilterRow :visible="true" />
              <DxHeaderFilter :visible="true" />
              <DxSearchPanel :visible="true" :width="440" placeholder="Tìm sản phẩm" />

              <DxColumn data-field="code" caption="Mã" :width="100">
                <DxRequiredRule />
              </DxColumn>
              <DxColumn data-field="name" caption="Tên sản phẩm">
                <DxRequiredRule />
              </DxColumn>
              <DxColumn :width="80" data-field="unit.id" caption="Đơn vị">
                <DxLookup :data-source="units" display-expr="name" value-expr="id" />
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
              <DxColumn data-field="volumn" :width="110" caption="Khối lượng/m³">
                <DxRequiredRule />
              </DxColumn>

              <DxColumn :width="125" data-field="type.id" caption="Loại sản phẩm">
                <DxLookup :data-source="itemTypes" display-expr="name" value-expr="id" />
                <DxRequiredRule />
              </DxColumn>
              <DxColumn caption="..." width="50" cell-template="del-cell" />
              <template #del-cell="cell">
                <span class="fake-link" @click="onSelectionChanged(cell)">Sửa</span>
              </template>
            </DxDataGrid>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="showChooseItem" persistent>
      <q-card style="min-width:70%">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title">Nhập thông tin sản phẩm/Cụm/Chi tiết...</div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <p
                style="    font-style: italic;color: violet;"
              >- Nếu khối lượng tính theo công thức (D*R*D*10^-9) thì bỏ qua thông tin "Khối lượng/sp"</p>
              <p
                style="    font-style: italic;color: violet;"
              >- Nếu sản phẩm là các "Thành phẩm" thì hãy nhập thêm thông tin mã Ikea và mã thị trường</p>
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
              <q-input v-model="iHeight" type="text" label="Kích thước chiều DẦY" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iWidth" type="text" label="Kích thước chiều RỘNG" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iLength" type="text" label="Kích thước chiều DÀI" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select v-model="iType" :options="iTypes" label="Loại sản phẩm" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select v-model="iUnit" :options="iUnits" label="Đơn vị" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iVolumn" type="text" label="Khối lượng/sp" />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-sm">
          <h6>Tạo mã thị trường cho sản phẩm để tạo KHSX </h6>
          <DxDataGrid
            id="gridIkea"
            :data-source="ikeas"
            :allow-column-reordering="true"
            :columns-auto-width="true"
            :show-borders="true"
            key-expr="id"
            @row-inserted="insertIkea"
            @row-updated="updatedIkea"
            :no-data-text="'Không có dữ liệu !'"
          >
            <DxPaging :enabled="true" />
            <DxEditing :allow-updating="true" :allow-adding="true" mode="row" />

            <DxColumn data-field="code" caption="Mã thị trường" :width="100">
              <DxRequiredRule />
            </DxColumn>
            <DxColumn data-field="name" caption="Tên sản phẩm ">
              <DxRequiredRule />
            </DxColumn>
            <DxColumn caption="..." cell-template="del-cell" />
            <template #del-cell="cell">
              <span class="fake-link" @click="delIkea(cell.data)">Xóa</span>
            </template>
          </DxDataGrid>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="red" @click="cancel" />
          <q-btn flat label="Lưu lại" @click="createItem" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      iCode: "",
      iName: "",
      iUnit: null,
      iUnits: [],
      iHeight: "",
      iWidth: "",
      iLength: "",
      iVolumn: "",
      iType: null,
      iTypes: [],
      ikeas: [],
      isEdit: false,
      currentItemSelectId: null,
    };
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor"]),
  },
  created() {
    this.load();
  },
  methods: {
    addItem() {
      this.isEdit = false;
      this.iCode = "";
      this.iName = "";
      this.iHeight = "";
      this.iWidth = "";
      this.iLength = "";
      this.iVolumn = "";
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
        factoryId: this.myFactoryInfor.id,
        factoryName: this.myFactoryInfor.name,
      };
      const data = await this.$store.dispatch("base/CREATE_IKEA", payload);
      if (data.meta.success) {
        showNotifySuccess("Cập nhật thành công !");
      } else {
        showNotifyError();
      }
    },
    async onSelectionChanged(e) {
      this.currentItemSelectId = e.data.data.id;
      this.iCode = e.data.data.code;
      this.iName = e.data.data.name;
      this.iHeight = e.data.data.height;
      this.iWidth = e.data.data.width;
      this.iLength = e.data.data.length;
      this.iVolumn = e.data.data.volumn;
      this.iType = this.iTypes.find((t) => {
        return t.value === e.data.data.type.id;
      });
      this.iUnit = this.iUnits.find((u) => {
        return u.value === e.data.data.unit.id;
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
      const myFactoryId = this.$route.query.factoryId;
      const myItemType = this.$route.query.type;
      const payload = {
        factoryId: myFactoryId,
        typeId: myItemType,
      };
      if (myFactoryId) {
        let data = await this.$store.dispatch("base/GET_ITEMS", payload);
        this.items = data.data;
      }
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
    async createItem() {
      const myFactoryId = this.$route.query.factoryId;
      let pVolumn = 0;
      if (this.iHeight && this.iWidth && this.iLength) {
        pVolumn = this.iHeight * this.iLength * this.iWidth * Math.pow(10, -9);
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
              factoryId: myFactoryId,
              volumn: this.iVolumn || pVolumn,
            },
          };
          const data = await this.$store.dispatch("base/UPDATE_ITEM", payload);
          if (data.meta.success) {
            showNotifySuccess("Cập nhật thành công !");
            this.showChooseItem = false;
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
            factoryId: myFactoryId,
            volumn: this.iVolumn || pVolumn,
          };
          const data = await this.$store.dispatch("base/ADD_ITEM", payload);
          if (data.meta.success) {
            await this.addIkea(data.data.id);
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