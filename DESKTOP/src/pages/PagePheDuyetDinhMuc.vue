<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Khai báo thông tin cấu thành sản phẩm khối CBG 
        </div>
        <div class="col-6" align="right">
           <q-btn
            v-if="item != null"
            @click="onApprove"
            color="positive"
            label="Phê duyệt"
          />
          <q-btn
            v-if="item != null"
            @click="onReject"
            style="margin-left: 10px"
            color="orange"
            label="Từ chối"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pt-sm col-md-5">
        <q-card>
          <DxDataGrid
            :data-source="listItems"
            :allow-column-resizing="true"
            :selection="{ mode: 'single' }"
            :show-borders="true"
            :show-row-lines="true"
            :hover-state-enabled="true"
            :no-data-text="'Không có thông tin cấu thành chờ duyệt !'"
            ref="dgItems"
            key-expr="id"
            @selection-changed="onSelectionChanged"
          >
            <DxFilterRow :visible="true" />
            <DxHeaderFilter :visible="true" />
            <DxColumn :width="90" data-field="id" alignment="center" caption="ID" />
            <DxColumn :width="150" data-field="code" caption="Mã số" />
            <DxColumn data-field="name" caption="Tên" />
            <DxColumn data-field="LAST_NAME" :width="200" caption="Người tạo" />
          </DxDataGrid>
        </q-card>
      </div>
      <div v-if="item" class="col-12 q-pl-sm q-pt-sm col-md-7" padding>
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
          >
            <DxExport :enabled="true" :file-name="title" :allow-export-selected-data="false" />
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
                <span>
                  <b> {{cell.data.value.substring(0, cell.data.value.indexOf(")") + 1)}} </b>
                </span>
                <span class="text-blue">{{
                  cell.data.value.substring(cell.data.value.indexOf("["), cell.data.value.indexOf("]") + 1)
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
            <DxColumn
              data-field="RATE"
              caption="Hệ số"
              format="#,##0.######"
              width="100"
              alignment="center"
              cssClass="maudinhMuc2"
            />
          </DxTreeList>
          <br />
          <hr style="width:50%">
          <br>
          <DxTreeList
            id="boms"
            :data-source="bomTemps"
            :show-borders="true"
            :allow-column-resizing="true"
            :column-auto-width="true"
            :word-wrap-enabled="true"
            :auto-expand-all="true"
            key-expr="ID"
            parent-id-expr="parentId"
          >

            <DxSelection mode="single" />
            <DxColumn
              data-field="name"
              caption="Thông tin cấu thành mới chờ duyệt"
              cell-template="cellTemplateName"
              cssClass="maudinhMuc1"
              :allowEditing="false"
            />
             <template #cellTemplateName="cell">
              <div>
                <span v-if="boms.filter(b => b.name == cell.data.value).length > 0">
                   {{cell.data.value}} 
                </span>
                <span class="text-red" v-else>
                   {{cell.data.value}} 
                </span>
              </div>
            </template>
              <DxColumn
                caption="Dầy"
                data-field="height"
                format="fixedPoint"
                alignment="center"
                width="60"
                :allowEditing="false"
                cssClass="maudinhMuc1"
              />
              <DxColumn
                caption="Rộng"
                data-field="width"
                format="fixedPoint"
                alignment="center"
                width="60"
                :allowEditing="false"
                cssClass="maudinhMuc1"
              />
              <DxColumn
                caption="Dài"
                data-field="length"
                format="fixedPoint"
                alignment="center"
                width="60"
                :allowEditing="false"
                cssClass="maudinhMuc1"
              />
            <DxColumn
              data-field="RATE"
              caption="Hệ số"
              width="100"
              format="#,##0.######"
              cssClass="maudinhMuc1"
              alignment="center"
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
  DxExport,
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
    DxExport,
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
      listItems: [],
      isSend: false,
      showEditBom: false,
      card: false,
      selectedRowKeys: [],
      r0SelectedRowKeys: [],
      factories: [],
      factory: null,
    };
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "userInfo"]),
  },
  methods: {
    ...mapActions("item", ["getItemsByFactoryId"]),
    ...mapActions("messages", ["sendNotificationMail"]),
    ...mapActions("prod", [
      "getBomByItemId",
      "getItemsInBomTemp",
      "deleteBomTemp",
      "approveBomTemp",
      "getBomItemRemove",
      "deleteBom",
      "getBomTempByItemId",
    ]),
    async loadItem(){
      const data = await this.getItemsInBomTemp();
      this.listItems = data;
      console.log("data", data);
    },

    calculateNameAndCode(rowData) {
      rowData.nameAndCode = `(${rowData.MATERIALS_ID})-[${rowData.code}] ${rowData.name}`;
      return rowData.nameAndCode;
    },

    async onSelectionChanged({ selectedRowsData }) {
      this.item = selectedRowsData[0];
      this.loadBom();
      this.loadBomTemp();
      this.$router.replace({
        path: this.$route.fullPath,
        query: {
          itemId: selectedRowsData[0].id,
        },
      });
    },
    async loadBom() {
      let payload = {
       // factoryId: this.factory.id,
        itemId: this.item.id,
      };
      this.boms = await this.getBomByItemId(payload);
    },
    async loadBomTemp() {
      let payload = {
        itemId: this.item.id,
      };
      const items = await this.getBomItemRemove(payload);
      this.bomTemps = items;

    },
    async onApprove() {
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
      const payload = {
          itemId: this.item.id,
        };
        await this.deleteBom(payload);
        await this.approveBomTemp(payload);
        this.onTuChoi();
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
      const payload = {
          itemId: this.item.id,
        };
        await this.deleteBomTemp(payload);
        this.showEditBom = true;
        this.item = null;
        this.boms = [];
        this.bomTemps = [];
        this.loadItem();
      this.showEditBom = false;
    }
  },
  created() {
    this.loadItem();
  },
};
</script>

<style>

</style>