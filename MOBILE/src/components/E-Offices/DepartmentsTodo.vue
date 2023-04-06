<template>
  <DxTreeList
    id="departments"
    :data-source="departments"
    :column-auto-width="true"
    :show-row-lines="true"
    :show-borders="true"
    :expanded-row-keys="expandedRowKeys"
    key-expr="id"
    parent-id-expr="parentId"
    @editor-preparing="onEditorPreparing"
    @init-new-row="onInitNewRow"
    @row-inserted="insert"
    @row-updated="updated"
    @row-removed="removed"
  >
    <DxEditing
      :allow-updating="true"
      :allow-deleting="true"
      :allow-adding="true"
      :popup="popupOptions"
      mode="popup"
    />
    <DxPaging :enabled="true" :page-size="40" />
    <DxFilterRow :visible="true" />

    <DxSearchPanel :visible="true" :width="100" placeholder="Tìm phòng ban" />
    <!-- <DxColumn
      :width="120"
      data-field="factoryId"
      caption="Nhà máy"
      :visible="false"
      :allowEditing="false"
    >
      <DxLookup
        :data-source="departments"
        display-expr="name"
        value-expr="id"
      /> -->
    <!-- </DxColumn> -->
    <DxColumn
      :width="120"
      data-field="parentId"
      caption="Bộ phận/Phòng ban"
      :visible="false"
    >
      <DxLookup
        :data-source="departments"
        display-expr="name"
        value-expr="id"
      />
    </DxColumn>
    <DxColumn data-field="name" caption="Tên phòng ban">
     <DxValidationRule type="required" />
      <!-- <DxLookup
        :data-source="departments"
        display-expr="name"
        value-expr="id"
      /> -->
    </DxColumn>
    <DxColumn
      :width="120"
      data-field="accountId"
      caption="Trưởng bộ phận"
      :visible="true"
    >
      <DxLookup :data-source="users" display-expr="lastName" value-expr="id" />
      <DxValidationRule type="required" />
    </DxColumn>
    <DxColumn
      :width="120"
      data-field="accountId1"
      caption="Phó phòng 1"
      :visible="true"
    >
      <DxLookup :data-source="users" display-expr="lastName" value-expr="id" />
    </DxColumn>
    <DxColumn
      :width="120"
      data-field="accountId2"
      caption="Phó phòng 2"
      :visible="true"
    >
      <DxLookup :data-source="users" display-expr="lastName" value-expr="id" />
    </DxColumn>
    <DxColumn type="buttons">
      <DxButton name="edit" />
      <DxButton name="delete" />
    </DxColumn>
  </DxTreeList>
</template>

<script>
import {
  DxTreeList,
  DxEditing,
  DxColumn,
  DxValidationRule,
  DxLookup,
  DxPaging,
  DxFilterRow,
  DxSearchPanel,
  DxButton
} from "devextreme-vue/tree-list";
import { showNotifySuccess, showNotifyError } from "../../ultils";
import { mapGetters } from "vuex";
export default {
  components: {
    DxTreeList,
    DxEditing,
    DxColumn,
    DxValidationRule,
    DxLookup,
    DxPaging,
    DxFilterRow,
    DxSearchPanel,
    DxButton
  },

  data() {
    return {
      departments: [],
      users: [],
      expandedRowKeys: [1],
      dataProfile: null,
      popupOptions: {
        title: "Employee Info",
        showTitle: true,
        width: 700
      }
    };
  },
  created() {
    this.loadUsers();
    console.log(this.$store.state.base.userInfo.departmentId)
  },
  mounted() {
    this.loadDepartment();
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor"])
  },
  methods: {
    onEditorPreparing(e) {
      if (e.dataField === "Head_ID" && e.row.data.ID === 1) {
        e.editorOptions.disabled = true;
        e.editorOptions.value = null;
      }
    },
    onInitNewRow(e) {
      e.data.factoryId = this.myFactoryInfor.id;
      this.loadUsers();
    },
    async insert(e) {
      let payload = {
        accountId: e.data.accountId,
        accountId1: e.data.accountId1,
        accountId2: e.data.accountId2,
        code: e.data.code,
        name: e.data.name,
        factoryId: this.myFactoryInfor.id,
        parentId: e.data.parentId,
        type: e.data.type,
        type2: e.data.type2
      };
      const data = await this.$store.dispatch(
        "base/CREATE_DEPARTMENT",
        payload
      );
      if (data.meta.success) {
        await this.loadDepartment();
        showNotifySuccess("Tạo thành công !");
      } else {
        showNotifyError();
      }
    },
    async updated(e) {
      if (e.data) {
        const payload = {
          id: e.data.id,
          data: {
            accountId: e.data.accountId,
            accountId1: e.data.accountId1,
            accountId2: e.data.accountId2,
            code: e.data.code,
            name: e.data.name,
           // parentId: e.data.parentId,
            type: e.data.type,
            type2: e.data.type2
          }
        };
        const data = await this.$store.dispatch(
          "base/UPDATE_DEPARTMENT",
          payload
        );
        if (data.meta.success) {
          showNotifySuccess("Cập nhật thành công !");
        } else {
          showNotifyError();
        }
      }
    },
    async removed({ key }) {
      let data = await this.$store.dispatch("base/DELETE_DEPARTMENT", key);
      console.log(data.data);
    },
    async loadDepartment() {
      const data = await this.$store.dispatch("base/GET_DEPARTMENTS", {
        factoryId: this.$store.state.base.userInfo.departmentId
      });
      this.departments = data.data;
    },
    async loadUsers() {
      const data = await this.$store.dispatch("base/GET_ACCOUNTS");
      this.users = data.data;
    }
  }
};
</script>

<style></style>
