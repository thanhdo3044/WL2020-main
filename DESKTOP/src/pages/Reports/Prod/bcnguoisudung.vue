<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-12 top-title text-orange">
            Thông tin chi tiết phân quyền sử dụng các chức năng trên phần mềm
            Woodsland 20
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-6" style="margin-top: 6px">
            <div class="q-gutter-sm">
              <q-radio @input="changeMode()" v-model="mode" val="desktop" style="color: #21ba45; font-weight: bold"
                label="Chức năng trên nền tảng Desktop" />
              <q-radio @input="changeMode()" v-model="mode" val="mobile" style="color: #21ba45; font-weight: bold"
                label="Chức năng trên nền tảng Mobile" />
            </div>
            <DxTreeList v-if="mode == 'desktop'" id="departments" :data-source="dataSource" :column-auto-width="true"
              :show-row-lines="true" :show-borders="true" :expanded-row-keys="expandedRowKeys" key-expr="ID"
              parent-id-expr="PARENT_ID" @selection-changed="onSelectionChanged1">
              <DxPaging :enabled="true" :page-size="40" />
              <DxSelection mode="single" />
              <DxFilterRow :visible="true" />
              <DxColumn :width="120" data-field="PARENT_ID" caption="Menu cha" :visible="false">
              </DxColumn>
              <DxColumn data-field="NAME" caption="Tên chức năng">
                <DxValidationRule type="required" />
              </DxColumn>
            </DxTreeList>

            <DxDataGrid v-else id="departments" :data-source="dataSource" :column-auto-width="true"
              :show-row-lines="true" :show-borders="true" :expanded-row-keys="expandedRowKeys" key-expr="ID"
              @selection-changed="onSelectionChanged1">
              <DxPaging :enabled="true" :page-size="40" />
              <DxSelection mode="single" />
              <DxGrouping :auto-expand-all="true" />
              <DxFilterRow :visible="true" />
              <DxColumn data-field="species" caption="Nhóm" group-index="0">
                <DxLookup :data-source="group" display-expr="name" value-expr="id" />
              </DxColumn>
              <DxColumn data-field="NAME" caption="Tên chức năng">
                <DxValidationRule type="required" />
              </DxColumn>
            </DxDataGrid>
          </div>
          <div class="col-6">
            <DxDataGrid :data-source="listUser" :show-borders="true" @row-removed="removed">
              <DxExport :enabled="true" :allow-export-selected-data="false" :file-name="'Danh sách nhân viên '" />
              <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm MNV hoặc họ tên'" :width="400" />
              <DxEditing :allow-deleting="isDelete" mode="row" />
              <DxColumn data-field="ACCOUNT" caption="Mã nhân viên" />
              <DxColumn data-field="LAST_NAME" caption="Họ tên" />
              <DxColumn data-field="MAPHONGBAN" caption="Mã phòng ban" />
              <DxColumn data-field="DEPARTMENT_NAME" caption="Phòng ban" />
              <DxColumn data-field="POSITION" caption="Chức vụ" />
              <DxColumn data-field="roleMenu" caption="Chi tiết phân quyền" />
            </DxDataGrid>
          </div>
        </div>

      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { showNotifySuccess, showNotifyError } from "../../../ultils";
import {
  DxTreeList,
  DxValidationRule,
  DxLookup,
  DxPaging,
  DxFilterRow,
  DxSelection,
  DxButton,
} from "devextreme-vue/tree-list";
import { DxDataGrid, DxSearchPanel, DxEditing, DxGrouping, DxColumn, DxExport } from "devextreme-vue/data-grid";
export default {
  components: {
    DxTreeList,
    DxDataGrid,
    DxEditing,
    DxColumn,
    DxValidationRule,
    DxLookup,
    DxPaging,
    DxGrouping,
    DxFilterRow,
    DxSelection,
    DxButton,
    DxSearchPanel,
    DxExport
  },
  data() {
    return {
      dataSource: [],
      listUser: [],
      group: [
        {
          name: "CHẾ BIẾN GỖ",
          id: "1         ",
        },
        {
          name: "e-OFFICE",
          id: "2         ",
        },
        {
          name: "VÁN CÔNG NGHIỆP",
          id: "3         ",
        },
        {
          name: "QUẢN LÝ SẤY GỖ",
          id: "4         ",
        },
        {
          name: "QUẢN LÝ MÁY",
          id: "5         ",
        },
        {
          name: "THÔNG TIN",
          id: "6         ",
        },
      ],
      expandedRowKeys: [1],
      menuIdSelect: null,
      showChooseDate: false,
      mode: "desktop",
      listPermission: [],
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      isApprove: false,
      isReject: false,
    };
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "userInfo"]),
  },
  created() {
    this.loadMenuDesktop();
    this.loadPermission();
  },
  methods: {
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
        if (el.CODE == "approve") {
          this.isApprove = true;
        }
        if (el.CODE == "reject") {
          this.isReject = true;
        }
      });
      console.log("listPermission", this.listPermission);
    },
    async loadMenuDesktop() {
      const payload = {
        type: "desktop",
        accountId: this.userInfo.id,
      };
      const data = await this.$store.dispatch(
        "base/GET_MENU_PHAN_QUYEN",
        payload
      );
      this.dataSource = [];
      this.dataSource = data.data;
      console.log(this.dataSource);
    },
    async loadMenuMoble() {
      const payload = {
        type: "mobile",
        accountId: this.userInfo.id,
      };
      const data = await this.$store.dispatch(
        "base/GET_MENU_PHAN_QUYEN",
        payload
      );
      this.dataSource = [];
      this.dataSource = data.data;
      console.log(this.dataSource);
    },
    async onSelectionChanged1({ selectedRowsData }) {
      this.menuIdSelect = selectedRowsData[0].ID;
      let payload = null;
      if (this.mode === "desktop") {
        payload = {
          menuId: selectedRowsData[0].ID,
          type: 100006,
        };
      } else {
        payload = {
          menuId: selectedRowsData[0].ID,
          type: 100009,
        };
      }
      const data = await this.$store.dispatch("base/GET_USER_IN_MENU", payload);
      this.listUser = data.data;
      console.log("this.listUser", this.listUser)
    },
    changeMode() {
      if (this.mode === "desktop") {
        this.loadMenuDesktop();
      } else {
        this.loadMenuMoble();
      }
    },
    async removed(e) {
  
      const payload = {
        accountId: e.data.ID,
        menuId: this.menuIdSelect,
        // roleId:this.
      };
      if (this.mode === "desktop") {
      
        const data = await this.$store.dispatch("base/DELETE_ROLE_VALUE_DESKTOP", payload);
                  if (data.meta.success) {
        showNotifySuccess("Cập nhật thành công !");
      } else {
        showNotifyError();
      }
      } else {
        const data = await this.$store.dispatch("base/DELETE_ROLE_VALUE_MOBILE", payload);
       if (data.meta.success) {
        showNotifySuccess("Cập nhật thành công !");
      } else {
        showNotifyError();
      }
      }
    },
  },
};
</script>

<style>
.dx-datagrid-headers .cell-bcnguoidung {
  font-size: 18px !important;
  color: orange;
  padding: 5px;
}

.dx-header-row {
  padding: 5px;
}
</style>