<template>
  <q-page padding>
    <q-banner class="bg-primary text-orange">
      <div class="text-h6 orange">
        <span color="orange">Định mức - {{ factory ? factory.label : ''  }}</span>
      </div>
    </q-banner>
    <q-dialog v-model="card">
      <q-card
        v-if="item1"
        class="my-card"
        style="max-width: 1500px; width: 1000px"
      >
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">Định mức</div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            {{ item1.name }} ({{
              [item1.height, item1.width, item1.length].join("*")
            }})
          </div>
          <div class="text-caption text-grey">
            Chọn nguyên vật liệu cho sản phẩm.
          </div>
        </q-card-section>

        <q-card-section>
          <DxDataGrid
            :data-source="listItems"
            :allow-column-resizing="true"
            :selection="{ mode: 'multiple' }"
            :show-borders="true"
            :show-row-lines="true"
              :show-column-lines="true"
            :hover-state-enabled="true"
            key-expr="id"
            :selected-row-keys.sync="r0SelectedRowKeys"
          >
            <DxSearchPanel
              :visible="true"
              :width="240"
              placeholder="Search..."
            />
            <DxColumn :width="100" data-field="code" caption="Mã" />
            <DxColumn data-field="name" caption="Tên" />
            <DxColumn caption="Quy Cách" alignment="center">
              <DxColumn
                caption="Dầy"
                data-field="height"
                format="fixedPoint"
                alignment="center"
                width="60"
              />
              <DxColumn
                caption="Rộng"
                data-field="width"
                format="fixedPoint"
                alignment="center"
                width="60"
              />
              <DxColumn
                caption="Dài"
                data-field="length"
                format="fixedPoint"
                alignment="center"
                width="60"
              />
            </DxColumn>
          </DxDataGrid>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Hủy" />
          <q-btn
            v-close-popup
            flat
            color="primary"
            label="Đồng ý"
            @click="luuDinhMuc"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row">
      <div class="col-12 q-pt-sm col-md-4">
        <q-card>
          <q-card-section>
            <DxDataGrid
              :data-source="listItems"
              :allow-column-resizing="true"
              :show-row-lines="true"
              :show-column-lines="true"
              :selection="{ mode: 'single' }"
              :show-borders="true"
              :hover-state-enabled="true"
              ref="dgItems"
              key-expr="id"
              @selection-changed="onSelectionChanged"
            >
              <DxSearchPanel
                :visible="true"
                :width="240"
                placeholder="Tìm kiếm..."
              />
              <DxColumn :width="100" data-field="code" caption="Mã" />
              <DxColumn data-field="name" caption="Tên" />
            </DxDataGrid>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 q-pl-sm q-pt-sm col-md-8" padding>
        <q-card>
          <q-card-section class="row">
            <DxTreeList
              id="boms"
              :data-source="boms"
              :show-borders="true"
              :allow-column-resizing="true"
              :show-row-lines="true"
              :show-column-lines="true"
              :column-auto-width="true"
              :word-wrap-enabled="true"
              :auto-expand-all="true"
              key-expr="ID"
              parent-id-expr="parentId"
              @row-updated="confirmSaveBom"
              @row-removed="confirmRemoveBom"
              @selection-changed="onSelectionChanged1"
              @cell-dbl-click="onCellDblClick"
            >
              <DxEditing
                :allow-updating="isUpdate"
                :allow-deleting="isDelete"
                mode="cell"
              />
              <DxSearchPanel :visible="true" placeholder="Tìm kiếm..." />
              <DxSelection mode="single" />
              <DxColumn data-field="name" caption="Tên" :allowEditing="false" />
              <DxColumn
                caption="Quy Cách"
                alignment="center"
                :allowEditing="false"
              >
                <DxColumn
                  caption="Dầy"
                  data-field="height"
                  format="fixedPoint"
                  alignment="center"
                  width="60"
                  :allowEditing="false"
                />
                <DxColumn
                  caption="Rộng"
                  data-field="width"
                  format="fixedPoint"
                  alignment="center"
                  width="60"
                  :allowEditing="false"
                />
                <DxColumn
                  caption="Dài"
                  data-field="length"
                  format="fixedPoint"
                  alignment="center"
                  width="60"
                  :allowEditing="false"
                />
              </DxColumn>
              <DxColumn data-field="RATE" caption="Hệ số" width="100" />
              <DxColumn data-field="unit" caption="Đơn vị" width="100" />
              <DxColumn data-field="groupId" caption="Nhóm" width="100">
                <DxLookup
                  :data-source="groups"
                  display-expr="name"
                  value-expr="id"
                />
              </DxColumn>
            </DxTreeList>
          </q-card-section>
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
  DxSearchPanel,
  DxEditing,
  DxLookup,
} from "devextreme-vue/data-grid";
import { DxTreeList, DxSelection } from "devextreme-vue/tree-list";
export default {
  // name: 'PageName',
  components: {
    DxDataGrid,
    DxColumn,
    DxSearchPanel,
    DxTreeList,
    DxSelection,
    DxEditing,
    DxLookup,
  },
  data() {
    return {
      item: null,
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      item1: null,
      item3: null,
      boms: [],
      card: false,
      selectedRowKeys: [],
      r0SelectedRowKeys: [],
      listItems: null,
      groups: [],
    };
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "userInfo"]),
  },
  methods: {
    ...mapActions("vcn", [
      "GET_ITEMS_VCN",
      "getFactory",
      "getItemsByFactoryId",
      "getBomByItemId",
      "createBom",
      "deleteBom",
      "updateBom",
      "getGroups",
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
    async onCellDblClick(e) {
      if(this.isInsert){
        this.item1 = e.data;
      if (e.data && !e.data.RATE) {
        this.card = true;
        this.r0SelectedRowKeys = [];
      } else this.card = false;
      }else{
        this.$q.dialog({
        html: true,
        title: 'Thông báo',
        message: 'Bạn chưa được cấp quyền thêm định mức !'
      })
      }
    },
    async onSelectionChanged({ selectedRowsData }) {
      this.item1 = selectedRowsData[0];
      const payload = {
        itemId: selectedRowsData[0].id,
      };
      this.boms = await this.getBomByItemId(payload);
    },
    async onSelectionChanged1({ selectedRowsData }) {
      if(this.isInsert){
        this.item1 = selectedRowsData[0];
      if (selectedRowsData.length && !selectedRowsData[0].RATE) {
        this.card = true;
        this.r0SelectedRowKeys = [];
      } else this.card = false;
      }else{
        this.$q.dialog({
        html: true,
        title: 'Thông báo',
        message: 'Bạn chưa được cấp quyền thêm định mức !'
      })
      }
    },
    async luuDinhMuc(e) {
      console.log(e);
      const payload = {
        itemId: this.item1.materialsId,
        materials: this.r0SelectedRowKeys,
        createdBy: this.userInfo.id,
      };

      await this.createBom(payload);

      await this.loadBom(this.item1.materialsId);
    },
    async confirmSaveBom(e) {
      console.log({
        ...e,
        id: e.data.ID,
        rate: e.data.RATE,
        groupId: e.data.groupId,
      });
      await this.updateBom({
        id: e.data.ID,
        rate: e.data.RATE,
        groupId: e.data.groupId,
      });
      await this.loadBom(e.data.itemId);

      //   await this.capNhatDinhMuc({
      //     id: e.key,
      //     rate: e.data.RATE,
      //     factoryId: this.factory.id
      //   });
      //   this.boms = await this.getBomByItemId({
      //     itemId: this.item.id,
      //     factoryId: this.factory.id
      //   });
    },
    async confirmRemoveBom(e) {
      console.log(e.data);
      await this.deleteBom({ id: e.data.ID});
      await this.loadBom(e.data.itemId);
      //   this.boms = await this.getBomByItemId({
      //     itemId: this.item.id,
      //     factoryId: this.factory.id
      //   });
    },
    async loadBom(itemId) {
      //   this.boms = await this.getBomByItemId({
      //     itemId: this.item.id,
      //     factoryId: this.factory.id
      //   });
      const payload = {
        itemId,
      };
      this.boms = await this.getBomByItemId(payload);
    },
    async changeFactory() {
      this.boms = []
      //   let payload = {
      //     factoryId: this.factory ? this.factory.id : 0,
      //     itemId: this.item.id
      //   };
      //   this.boms = await this.getBomByItemId(payload);
      // this.listItems = await this.getItemsByFactoryId(this.factory);
    },
  },
  async created() {
    this.loadPermission();
    const groups = await this.getGroups();
    console.log(groups);
    await groups.map((e) => {
      e.label = e.name;
      e.value = e.name;
    });
    this.groups = groups;
    this.listItems = await this.getItemsByFactoryId(this.factory);
    const factory = await this.getFactory();
    factory.map((e) => (e.label = e.name));
    this.factories = factory;
    console.log(this.factories);
  },
};
</script>
