<template>
  <q-page>
    <q-banner class="text-primary">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div class="row">
        <div class="col-6 text-h6 q-mt-lg">
          Khai báo thông tin cấu thành sản phẩm khối CBG 
        </div>
        <div class="col-6" align="right">
        </div>
      </div>
    </q-banner>

    <div>
      <div class="text-orange row widget-container">
        <div class="col-12 col-md-2 q-pa-sm">
          <q-select
            color="grey-3"
            filled
            label-color="orange"
            @input="changeFactory"
            v-model="factory"
            :options="factories"
            label="Chọn nhà máy"
            dense
          >
          </q-select>
        </div>
      </div>
    </div>

    <q-dialog v-model="card">
      <q-card
        v-if="item1"
        class="my-card"
        style="max-width: 1500px; width: 1000px"
      >

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1 text-blue" style="font-weight: bold">
            {{ item1.name }} ({{
              [item1.height, item1.width, item1.length].join("*")
            }})
          </div>
          <div class="text-caption text-grey">
            Chọn thông tin cấu thành
          </div>
        </q-card-section>

        <DxDataGrid
          :data-source="listItems"
          :allow-column-resizing="true"
          :selection="{ mode: 'multiple' }"
          :show-borders="true"
          :hover-state-enabled="true"
          key-expr="id"
          :selected-row-keys.sync="r0SelectedRowKeys"
        >
          <DxFilterRow :visible="true" />
          <DxPaging :page-size="17"/>
          <DxHeaderFilter :visible="true" />
          <DxColumn :width="150" data-field="code" caption="Mã số" />
          <DxColumn data-field="name" caption="Tên" />
          <DxColumn caption="Qui Cách" alignment="center">
            <DxColumn
              caption="Dầy"
              data-field="height"
              format="fixedPoint"
              alignment="center"
              width="80"
            />
            <DxColumn
              caption="Rộng"
              data-field="width"
              format="fixedPoint"
              alignment="center"
              width="80"
            />
            <DxColumn
              caption="Dài"
              data-field="length"
              format="fixedPoint"
              alignment="center"
              width="80"
            />
          </DxColumn>
        </DxDataGrid>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            color="primary"
            label="Đồng ý"
            @click="luuDinhMuc"
          />
          <q-btn v-close-popup label="Hủy" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row">
      <div class="col-12 q-pt-sm col-md-4">
        <q-card>
          <DxDataGrid
            :data-source="listItems"
            :allow-column-resizing="true"
            :selection="{ mode: 'single' }"
            :show-borders="true"
            :show-row-lines="true"
            :hover-state-enabled="true"
            ref="dgItems"
            key-expr="id"
            @selection-changed="onSelectionChanged"
          >
            <DxFilterRow :visible="true" />
            <DxHeaderFilter :visible="true" />
            <DxColumn :width="150" data-field="code" caption="Mã số" />
            <DxColumn data-field="name" caption="Tên" />
          </DxDataGrid>
        </q-card>
      </div>
      <div class="col-12 q-pl-sm q-pt-sm col-md-8" padding>
        <q-card>
          <DxTreeList
            id="boms"
            :data-source="boms"
            :show-borders="true"
            :column-auto-width="true"
            :allow-column-resizing="true"
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
            <DxSelection mode="single" />
            <DxColumn
              data-field="nameAndCode"
              caption="Thông tin cấu thành hiện tại"
              :allowEditing="false"
              :calculate-cell-value="calculateNameAndCode"
              cell-template="cellTemplate"
              cssClass="maudinhMuc2"
            />
            <template #cellTemplate="cell">
              <div>
                <span class="text-blue">{{
                  cell.data.value.substring(0, cell.data.value.indexOf("]") + 1)
                }}</span>
                <span style="font-weight:bold">{{
                  cell.data.value.substring(
                    cell.data.value.indexOf("]") + 1,
                    cell.data.value.length
                  )
                }}</span>
              </div>
            </template>
            <DxColumn
              caption="Qui Cách"
              alignment="center"
              :allowEditing="false"
              cssClass="maudinhMuc2"
            >
              <DxColumn
                caption="Dầy"
                data-field="height"
                format="fixedPoint"
                cssClass="maudinhMuc2"
                alignment="center"
                width="60"
                :allowEditing="false"
              />
              <DxColumn
                caption="Rộng"
                data-field="width"
                format="fixedPoint"
                cssClass="maudinhMuc2"
                alignment="center"
                width="60"
                :allowEditing="false"
              />
              <DxColumn
                caption="Dài"
                data-field="length"
                cssClass="maudinhMuc2"
                format="fixedPoint"
                alignment="center"
                width="60"
                :allowEditing="false"
              />
            </DxColumn>
            <DxColumn
              data-field="RATE"
              caption="Hệ số"
              width="100"
              alignment="center"
              cssClass="maudinhMuc2"
            />
          </DxTreeList>
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
  DxHeaderFilter,
  DxFilterRow,
  DxSearchPanel,
  DxEditing,
  DxPaging
} from "devextreme-vue/data-grid";
import { DxTreeList, DxSelection } from "devextreme-vue/tree-list";
export default {
  // name: 'PageName',
  components: {
    DxDataGrid,
    DxColumn,
    DxHeaderFilter,
    DxFilterRow,
    DxSearchPanel,
    DxTreeList,
    DxSelection,
    DxEditing,
    DxPaging
  },
  data() {
    return {
      item: null,
      item1: null,
      item3: null,
      listPermission: [],
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      boms: [],
      bomTemps: [],
      showEditBom: false,
      card: false,
      selectedRowKeys: [],
      r0SelectedRowKeys: [],
      factories: [
        {
          label: "Nhà máy CGB Thuận Hưng",
          id: 100000,
        },
        {
          label: "Nhà máy CGB Yên Sơn 1A",
          id: 100200,
        },
        {
          label: "Nhà máy CGB Yên Sơn 1B",
          id: 100300,
        },
        {
          label: "Nhà máy CGB Thái Bình",
          id: 100500,
        },
      ],
      factory: null,
    };
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "userInfo"]),
    ...mapGetters("item", ["listItems", "itemSelect"]),
  },
  methods: {
    ...mapActions("item", ["getItemsByFactoryId"]),
    ...mapActions("messages", ["sendNotificationMail"]),
    ...mapActions("prod", [
      "getBomByItemId",
      "themDinhMuc",
      "xoaDinhMuc",
      "capNhatDinhMuc",
      "getParentItemsInBom",
      "getPermissionInScreen",
    ]),
    calculateNameAndCode(rowData) {
      rowData.nameAndCode = `[${rowData.code}] ${rowData.name}`;
      return rowData.nameAndCode;
    },
    async onCellDblClick(e) {
      console.log(e);
      this.item1 = e.data;
      if (e.data.length) {
        this.card = true;
        this.r0SelectedRowKeys = [];
      } else this.card = false;
    },
    async onSelectionChanged({ selectedRowsData }) {
      this.item = selectedRowsData[0];
      this.loadBoms();
      // this.loadBomTemp();
      this.$router.replace({
        path: this.$route.fullPath,
        query: {
          itemId: selectedRowsData[0].id,
        },
      });
    },
    async loadBoms() {
      let payload = {
        factoryId: this.factory.id,
        itemId: this.item.id,
      };
      this.boms = await this.getBomByItemId(payload);
    },
    async onSelectionChanged1({ selectedRowsData }) {
      if (this.isInsert) {
        console.log(selectedRowsData);

        this.item1 = selectedRowsData[0];
        if (selectedRowsData.length) {
          this.card = true;
          this.r0SelectedRowKeys = [];
        } else this.card = false;
      }
    },
    async luuDinhMuc() {
      await this.themDinhMuc({
        itemId: this.item1.MATERIALS_ID,
        materials: this.r0SelectedRowKeys,
        factoryId: this.factory.id,
      });
      // this.loadBomTemp();
      this.loadBoms();
    },
    async confirmSaveBom(e) {
      console.log("confirmSaveBom", e);
      await this.capNhatDinhMuc({
        id: e.key,
        rate: e.data.RATE,
        factoryId: this.factory.id,
      });
      // this.loadBomTemp();
      this.loadBoms();
    },
    async confirmRemoveBom(e) {
      await this.xoaDinhMuc({ id: e.key, factoryId: this.factory.id });
      // this.loadBomTemp();
      this.loadBoms();
    },
    async loadBom(itemId) {
      this.boms = await this.getBomByItemId({
        itemId: this.item.id,
        factoryId: this.factory.id,
      });
    },
    async changeFactory() {
      let payload = {
        factoryId: this.factory ? this.factory.id : 0,
        itemId: this.item.id,
      };
      this.boms = await this.getBomByItemId(payload);
    },
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
  },
  created() {
    this.loadPermission();
    this.factories = [];
    console.log(this.userInfo);
    if (this.userInfo.id == 101966) {
      this.factories.push(
        {
          label: "Nhà máy CBG Yên Sơn 1",
          id: 100004,
        }
      );
    } else if (this.userInfo.id == 101967) {
      this.factories.push({
        label: "Nhà máy CBG Thái Bình",
        id: 100005,
      });
    } else if (this.userInfo.id == 100305) {
      this.factories.push({
        label: "Nhà máy CBG Thuận Hưng",
        id: 100000,
      });
    } else {
      this.factories.push(
        {
          label: "Nhà máy CBG Thuận Hưng",
          id: 100000,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          id: 100004,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          id: 100005,
        }
      );
    }
    this.getItemsByFactoryId({ factoryId: 100000 });
    if (this.$route.query.itemId)
      this.boms = this.loadBom(this.$route.query.itemId, this.factory.id);
  },
};
</script>

<style>
.dx-header-row .maudinhMuc2 {
  color: white;
  vertical-align: middle !important;
  font-weight: 500;
  font-size: 14px !important;
}
.dx-header-row .maudinhMuc1 {
  color: orange;
  font-weight: 500;
  font-size: 32px;
}
</style>