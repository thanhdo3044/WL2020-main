<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-3.5 text-blue text-bold" style="font-size: 18px">
          Khai báo thông tin cấu thành sản phẩm khối CBG
        </div>
        <div class="col-8" style="margin-top: 15px; padding-left: 70px">
          <q-btn
            v-if="showEditBom && (isInsert || isUpdate || isDelete) && !isSend"
            color="orange"
            label="Gửi phê duyệt"
            @click="onSendMail"
          />
          <q-btn
            v-if="showEditBom && (isInsert || isUpdate || isDelete) && isSend"
            color="positive"
            label="Đã gửi phê duyệt"
          />
          <q-btn
            v-if="!showEditBom && (isInsert || isUpdate || isDelete) && item"
            @click="onEditBom"
            color="orange"
            label="Sửa thông tin cấu thành"
          />
          <q-btn
            v-if="showEditBom && (isInsert || isUpdate || isDelete)"
            @click="onReject"
            style="margin-left: 10px"
            color="red"
            label="Hủy"
          />
          <q-btn
          v-if="listItemPending.length > 0"
            style="margin-left: 10px"
            color="orange"
            label="Danh sách cấu thành chờ duyệt"
            @click="onPending"
          />
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
          <div class="text-caption text-grey">Chọn thông tin cấu thành</div>
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
          <DxPaging :page-size="17" />
          <DxHeaderFilter :visible="true" />
          <DxColumn
            :width="90"
            data-field="id"
            alignment="center"
            caption="ID"
          />
          <DxColumn :width="150" data-field="code" caption="Mã số" />
          <DxColumn data-field="name" caption="Tên" />
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
        </DxDataGrid>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            color="primary"
            label="Đồng ý"
            @click="addDinhMuc"
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
            <DxColumn
              :width="90"
              data-field="id"
              alignment="center"
              caption="ID"
            />
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
          >
            <DxExport
              :enabled="true"
              :file-name="title"
              :allow-export-selected-data="false"
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
                <span>
                  <b>
                    {{
                      cell.data.value.substring(
                        0,
                        cell.data.value.indexOf(")") + 1
                      )
                    }}
                  </b>
                </span>
                <span class="text-blue">{{
                  cell.data.value.substring(
                    cell.data.value.indexOf("["),
                    cell.data.value.indexOf("]") + 1
                  )
                }}</span>
                <span style="font-weight: bold">{{
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
          <hr style="width: 50%" />
          <br />
          <DxTreeList
            v-if="showEditBom"
            id="boms"
            :data-source="bomTemps"
            :show-borders="true"
            :allow-column-resizing="true"
            :column-auto-width="true"
            :word-wrap-enabled="true"
            :auto-expand-all="true"
            key-expr="ID"
            parent-id-expr="parentId"
            @row-updated="confirmSaveBomTemp"
            @row-removed="confirmRemoveBomTemp"
            @selection-changed="onSelectionChanged1"
            @cell-dbl-click="onCellDblClick"
          >
            <DxEditing
              :allow-updating="isUpdate && !isSend"
              :allow-deleting="isDelete && !isSend"
              mode="cell"
            />

            <DxSelection mode="single" />
            <DxColumn
              data-field="name"
              caption="Thông tin cấu thành mới chờ duyệt"
              cssClass="maudinhMuc1"
              :calculate-cell-value="calculateNameAndCode"
              cell-template="cellTemplate"
              :allowEditing="false"
            />
            <template #cellTemplate="cell">
              <div>
                <span>
                  <b>
                    {{
                      cell.data.value.substring(
                        0,
                        cell.data.value.indexOf(")") + 1
                      )
                    }}
                  </b>
                </span>
                <span class="text-blue">{{
                  cell.data.value.substring(
                    cell.data.value.indexOf("["),
                    cell.data.value.indexOf("]") + 1
                  )
                }}</span>
                <span style="font-weight: bold">{{
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
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Bạn có muốn gửi phê duyệt cấu thành đã sửa ?</span
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
  DxExport,
  DxHeaderFilter,
  DxFilterRow,
  DxSearchPanel,
  DxEditing,
  DxPaging,
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
    DxPaging,
  },
  data() {
    return {
      item: null,
      item1: null,
      listPermission: [],
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      boms: [],
      listItemPending: [],
      isPending: false,
      bomTemps: [],
      isSend: false,
      showEditBom: false,
      card: false,
      confirm: false,
      selectedRowKeys: [],
      r0SelectedRowKeys: [],
      factories: [],
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
      "insertBomTemp",
      "addBomTemp",
      "updateBomTemp",
      "removeBomTemp",
      "deleteBomTemp",
      "sendBomTempApprove",
      "getBomTempByItemId",
      "getBomItemRemove",
      "getItemBomPending",
      "checkSendBomTempByItemId",
      "themDinhMuc",
      "xoaDinhMuc",
      "capNhatDinhMuc",
      "getParentItemsInBom",
      "getParentItemsInBomTemp",
      "getPermissionInScreen",
    ]),
    async onEditBom() {
      if (this.item != null) {
        const payloadParent = {
          itemId: this.item.id,
        };
        const payload = {
          itemId: this.item.id,
          accountId: this.userInfo.id,
        };
        await this.insertBomTemp(payload);
        const parent2 = await this.getParentItemsInBomTemp(payloadParent);
        if (parent2.length > 0) {
          this.loadBomTemp();
        } else {
          this.showEditBom = true;
        }
      } else {
        this.$q.dialog({
          title: "Lỗi",
          message: "Vui lòng chọn sản phẩm để sửa thông tin cấu thành !",
        });
      }
    },
    
    calculateNameAndCode(rowData) {
      rowData.nameAndCode = `(${rowData.MATERIALS_ID})-[${rowData.code}] ${rowData.name}`;
      return rowData.nameAndCode;
    },
    async onCellDblClick(e) {
      if (this.isInsert && !this.isSend) {
        console.log("e.data.length", e.data);
        this.item1 = e.data;
        if (e.data) {
          this.card = true;
          this.r0SelectedRowKeys = [];
        } else this.card = false;
      }
    },
    async onSelectionChanged({ selectedRowsData }) {
      if (this.showEditBom && !this.isSend) {
        this.confirm = true;
      } else {
        this.item = selectedRowsData[0];
        this.loadBom();
        this.loadBomTemp();
        this.$router.replace({
          path: this.$route.fullPath,
          query: {
            itemId: selectedRowsData[0].id,
          },
        });
      }
    },
    async loadBom() {
      let payload = {
        itemId: this.item.id,
      };
      this.boms = await this.getBomByItemId(payload);
    },
    async loadBomTemp() {
      let payload = {
        itemId: this.item.id,
      };
      this.bomTemps = await this.getBomTempByItemId(payload);
      const items = await this.getBomItemRemove(payload);
      
      const data = await this.checkSendBomTempByItemId(payload);
      this.isSend = false;
      if (data.length > 0) {
        this.isSend = data[0].IS_SEND;
      }
      if (this.bomTemps.length > 1) {
        this.showEditBom = true;
      } else {
        this.showEditBom = false;
      }
      this.bomTemps = items;

      this.loadItemPending();
    },
    async onSelectionChanged1({ selectedRowsData }) {
      if (this.isInsert && !this.isSend) {
        this.item1 = selectedRowsData[0];
        if (selectedRowsData.length) {
          this.card = true;
          this.r0SelectedRowKeys = [];
        } else this.card = false;
      }
    },
    async addDinhMuc() {
      const payload = {
        itemId: this.item1.MATERIALS_ID,
        materials: this.r0SelectedRowKeys,
        accountId: this.userInfo.id,
      };
      await this.addBomTemp(payload);
      this.loadBomTemp();
      this.loadBom();
    },
    async confirmSaveBomTemp(e) {
      console.log("e", e);
      await this.updateBomTemp({
        id: e.key,
        rate: e.data.RATE,
      });
      this.loadBomTemp();
      this.loadBom();
    },
    async confirmRemoveBomTemp(e) {
      await this.removeBomTemp({ id: e.key });
      this.loadBomTemp();
      this.loadBom();
    },
    async onPending(){
      
      this.isPending = true;
    },
    async loadItemPending(){
      const payload = {
        accountId : this.userInfo.id
      }
      const data = await this.getItemBomPending(payload);
      this.listItemPending = data;
    },
    async loadPermission() {
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
    async onReject() {
      if (this.item != null) {
        const payload = {
          itemId: this.item.id,
        };
        await this.deleteBomTemp(payload);
        const data = await this.getBomTempByItemId(payload);
        console.log("data bomTemp", data);
        this.bomTemps = data;
        this.showEditBom = true;
      } else {
        this.$q.dialog({
          title: "Lỗi",
          message: "Vui lòng chọn sản phẩm để sửa thông tin cấu thành !",
        });
      }
      this.showEditBom = false;
    },
    async onSendMail() {
      const payload = {
        accountId: this.userInfo.id,
      };
      await this.sendBomTempApprove(payload);
      this.loadBom();
      this.loadBomTemp();
      this.sendMailPheDuyet("tuantt@woodsland.com.vn", 100400);
    },
    async sendMailPheDuyet(mail, accountId) {
      let baseUrl = null;
      if (process.env.PROD) {
        baseUrl = `https://app.woodsland.com.vn:2002/#/Prod-Item-Rating-Approve?itemId=${this.item.id}`;
      } else {
        baseUrl = `http://localhost:5000/#/Prod-Item-Rating-Approve?itemId=${this.item.id}`;
      }
      let payloadMail = {
        baseUrl: baseUrl,
        email: mail,
        accountId: this.userInfo.id,
        toAccountId: accountId,
        subject: `Có thông tin cấu thành của sản phẩm ${this.item.name} được sửa`,
        title: "Nhấp vào đây để đi tới phê duyệt",
        dataBody: `Thông tin cấu thành của sản phẩm ${this.item.name} được sửa. Mời bạn vào phê duyệt`,
      };
      console.log("payload mail", payloadMail);
      await this.sendNotificationMail(payloadMail);
    },
  },
  created() {
    this.loadItemPending();
    this.loadPermission();
    this.getItemsByFactoryId({ factoryId: 100000 });
    if (this.$route.query.itemId)
      this.boms = this.loadBom(this.$route.query.itemId, this.factory.id);
  },
};
</script>

<style>

</style>