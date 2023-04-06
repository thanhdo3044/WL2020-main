<template>
  <div>
    <q-btn
      color="positive"
      icon="add_circle_outline"
      label="Thêm mới"
      @click="addDepartment"
    />
    <DxTreeList
      id="departments"
      :data-source="getSources"
      :column-auto-width="true"
      :show-row-lines="true"
      :show-borders="true"
      :expanded-row-keys="expandedRowKeys"
      key-expr="id"
      parent-id-expr="parentId"
      @editor-preparing="onEditorPreparing"
      @init-new-row="onInitNewRow"
    >
      <DxPaging :enabled="true" :page-size="40" />
      <DxFilterRow :visible="true" />

      <DxSearchPanel :visible="true" :width="200" placeholder="Tìm phòng ban" />
      <DxColumn
        :width="120"
        data-field="parentId"
        caption="Bộ phận/Phòng ban"
        :visible="false"
      >
        <DxLookup
          :data-source="departments"
          display-expr="label"
          value-expr="value"
        />
      </DxColumn>

      <DxColumn data-field="name" caption="Tên phòng ban"> </DxColumn>
      <DxColumn data-field="code" :width="120" caption="Mã phòng ban">
      </DxColumn>
      <DxColumn
        :width="180"
        data-field="accountId"
        caption="Trưởng bộ phận"
        :visible="true"
      >
        <DxLookup
          :data-source="strUsers"
          display-expr="label"
          value-expr="value"
        />
        <DxValidationRule type="required" />
      </DxColumn>
      <DxColumn
        :width="180"
        data-field="accountId1"
        caption="Phó phòng 1"
        :visible="true"
      >
        <DxLookup
          :data-source="strUsers"
          display-expr="label"
          value-expr="value"
        />
      </DxColumn>
      <DxColumn
        :width="180"
        data-field="accountId2"
        caption="Phó phòng 2"
        :visible="true"
      >
        <DxLookup
          :data-source="strUsers"
          display-expr="label"
          value-expr="value"
        />
      </DxColumn>
      <DxColumn :width="120" data-field="type2" caption="Loại" :visible="true">
        <DxLookup
          :data-source="type2s"
          display-expr="label"
          value-expr="value"
        />
      </DxColumn>
      <DxColumn
        :width="200"
        data-field="factoryId"
        caption="Nhà máy"
        :visible="true"
      >
        <DxLookup
          :data-source="factories"
          display-expr="label"
          value-expr="value"
        />
      </DxColumn>
      <DxColumn
        :width="200"
        data-field="GROUP_ID"
        caption="Nhóm"
        :visible="true"
      >
        <DxLookup
          :data-source="groups"
          display-expr="label"
          value-expr="value"
        />
      </DxColumn>
      <DxColumn
        caption="Chỉnh sửa"
        width="100"
        alignment="center"
        cell-template="update-cell"
      />
      <template #update-cell="cell">
        <span class="fake-link" @click="onSelectionChanged(cell)">Sửa</span>
      </template>
      <DxColumn
        caption="Xóa"
        width="100"
        alignment="center"
        cell-template="del-cell"
      />
      <template #del-cell="cell">
        <span class="fake-link" @click="onSelectionDelete(cell)">Xóa</span>
      </template>
    </DxTreeList>
    <q-dialog v-model="showChooseDepartment" persistent>
      <q-card style="min-width: 70%">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title text-primary">
              Nhập thông tin phòng ban
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-around">
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iCode" label="Mã phòng ban" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iName" label="Tên phòng ban" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                use-input
                v-model="iParentId"
                :options="departmentSelect"
                @filter="filterFnParentId"
                label="Bộ phận/Phòng ban"
              />
            </div>
            
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                v-model="iAccount"
                use-input
                label="Trưởng bộ phận"
                :options="users"
                @filter="filterFn"
              >
              </q-select>
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                v-model="iAccount1"
                use-input
                label="Phó phòng 1"
                :options="users"
                @filter="filterFn"
              >
              </q-select>
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                v-model="iAccount2"
                use-input
                label="Phó phòng 2"
                :options="users"
                @filter="filterFn"
              >
              </q-select>
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                use-input
                v-model="iType"
                :options="type2s"
                label="loại"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                use-input
                v-model="iFactory"
                :options="factories"
                label="Nhà máy"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                use-input
                v-model="iGroupId"
                :options="groups"
                label="Nhóm"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="OK" @click="createDepartment" color="positive" />
          <q-btn
            label="Hủy"
            color="orange"
            @click="showChooseDepartment = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
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
  DxButton,
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
    DxButton,
  },

  data() {
    return {
      departments: [],
      departmentSelect: [],
      strDepartmentSelect: [],
      users: [],
      strUsers: [],
      groups: [],
      id: null,
      isEdit: false,
      iParentId: null,
      iCode: null,
      iName: null,
      iAccount: null,
      iAccount1: null,
      iAccount2: null,
      iType: null,
      iFactory: null,
      iGroupId: null,
      showChooseDepartment: false,
      expandedRowKeys: [1],
      type2s: [
        { label: "HTQT", value: "hdqt" },
        { label: "Công ty", value: "congTy" },
        { label: "Khối", value: "khoi" },
        { label: "Nhà máy", value: "nhaMay" },
        { label: "Phòng ban", value: "phongBan" },
        { label: "Nhóm", value: "nhom" },
        { label: "Xưởng", value: "xuong" },
        { label: "Tổ", value: "to" },
        { label: "Kho", value: "kho" },
        { label: "Cơ điện", value: "coDien" },
        { label: "Đóng", value: "close" },
      ],
      factories: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          value: 100000,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1A",
          value: 102339,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1B",
          value: 102340,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          value: 102366,
        },
        {
          label: "Nhà máy CBG Quang Minh",
          value: 102427,
        },
        {
          label: "Nhà máy YS2",
          value: 102451,
        },
        {
          label: "Nhà máy Viforex",
          value: 102533,
        },
        {
          label: "Nhà máy YS3",
          value: 102631,
        },
      ],
    };
  },
  created() {
    this.loadUsers();
    this.loadGroup();
    console.log(this.$store.state.base.userInfo.departmentId);
  },
  mounted() {
    this.loadDepartment();
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor"]),
    getSources() {
      if (this.departments && this.departments.length)
        return this.departments.map((d) => ({
          ...d,
          parentId: d.parentId ? d.parentId : 0,
        }));
      console.log(this.departments);
      return [];
    },
  },
  methods: {
    addDepartment() {
      this.isEdit = false;
      this.iParentId = null;
      this.iName = null;
      this.iAccount = null;
      this.iAccount1 = null;
      this.iAccount2 = null;
      this.iType = null;
      this.iFactory = null;
      this.iCode = null;
      this.iGroupId = null;
      this.showChooseDepartment = true;
    },
    onSelectionChanged(e) {
      console.log("e", e.data.data);
      this.id = e.data.data.id;
      this.iParentId = this.departmentSelect.find(
        (u) => u.value == e.data.data.parentId
      );
      this.iCode = e.data.data.code;
      this.iName = e.data.data.name;
      this.iAccount = this.users.find((u) => u.value == e.data.data.accountId);
      this.iAccount1 = this.users.find(
        (u) => u.value == e.data.data.accountId1
      );
      this.iAccount2 = this.users.find(
        (u) => u.value == e.data.data.accountId2
      );
      this.iType = this.type2s.find((u) => u.value == e.data.data.type2);
      this.iGroupId = this.groups.find((u) => u.value == e.data.data.GROUP_ID);
      this.iFactory = this.factories.find(
        (u) => u.value == e.data.data.factoryId
      );

      this.isEdit = true;
      this.showChooseDepartment = true;
    },
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
    createDepartment() {
      if (this.isEdit) {
        this.updated();
      } else {
        this.insert();
      }
    },
    async insert() {
      let payload = {
        accountId: this.iAccount ? this.iAccount.value : null,
        accountId1: this.iAccount1 ? this.iAccount1.value : null,
        accountId2: this.iAccount2 ? this.iAccount2.value : null,
        name: this.iName,
        code: this.iCode,
        parentId: this.iParentId ? this.iParentId.value : null,
        type2: this.iType ? this.iType.value : null,
        factoryId: this.iFactory ? this.iFactory.value : null,
        GROUP_ID: this.iGroupId ? this.iGroupId.value : null,
      };
      const data = await this.$store.dispatch(
        "base/CREATE_DEPARTMENT",
        payload
      );
      if (data.meta.success) {
        this.insertphong(data.data.id);
        await this.loadDepartment();
        this.showChooseDepartment = false;
        showNotifySuccess("Tạo thành công !");
      } else {
        showNotifyError();
      }
    },
    async insertphong(k) {
      let payload = {
        roleId: 100400,
        roleTypeId: 100001,
        value: k,
      };
      data = await this.$store.dispatch("base/ADD_ROLE_VALUE", payload);
      if (data.meta.success) {
        this.$q.notify({
          message: "Thành công !",
          color: "green",
        });
      }
    },
    async updated() {
      const payload = {
        id: this.id,
        data: {
          accountId: this.iAccount ? this.iAccount.value : null,
          accountId1: this.iAccount1 ? this.iAccount1.value : null,
          accountId2: this.iAccount2 ? this.iAccount2.value : null,
          name: this.iName,
          code: this.iCode,
          parentId: this.iParentId ? this.iParentId.value : null,
          type2: this.iType ? this.iType.value : null,
          factoryId: this.iFactory ? this.iFactory.value : null,
          GROUP_ID: this.iGroupId ? this.iGroupId.value : null,
        },
      };
      const data = await this.$store.dispatch(
        "base/UPDATE_DEPARTMENT",
        payload
      );
      if (data.meta.success) {
        await this.loadDepartment();
        this.showChooseDepartment = false;
        showNotifySuccess("Cập nhật thành công !");
      } else {
        showNotifyError();
      }
    },
    async onSelectionDelete(e) {
      this.$q
        .dialog({
          title: "Xóa phòng ban",
          message: `<em>Bạn có chắc muốn xóa phòng ban:</em><br /> <strong class="text-primary">${e.data.data.name}</strong>`,
          cancel: true,
          persistent: true,
          html: true,
        })
        .onOk(() => {
          this.removeDepartment(e.data.data.id);
        });
    },
    async removeDepartment(id){
      await this.$store.dispatch("base/DELETE_DEPARTMENT", id);
      await this.loadDepartment();
    },
    filterFn(val, update, abort) {
      if (val === "") {
        update(() => {
          this.users = this.strUsers;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.users = this.strUsers.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterFnParentId(val, update) {
      if (val === "") {
        update(() => {
          this.departmentSelect = this.strDepartmentSelect;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.departmentSelect = this.strDepartmentSelect.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async loadDepartment() {
      this.departments = [];
      this.departmentSelect = [];
      this.strDepartmentSelect = [];
      const { data } = await this.$store.dispatch("NOTIFY/GET_DEPARTMENTS", {
        factoryId: this.$store.state.base.userInfo.departmentId,
      });
      this.departments = data;
      console.log("data", data);
      data.forEach((el) => {
        this.departmentSelect.push({
          label: el.name,
          value: el.id,
        });
      });
      this.strDepartmentSelect = this.departmentSelect;
    },
    async loadUsers() {
      this.users = [];
      const data = await this.$store.dispatch("base/GET_ACCOUNTS");
      data.data.forEach((el) => {
        this.users.push({
          label: el.lastName,
          value: el.id,
        });
      });
      this.strUsers = this.users;
    },
    async loadGroup(){
      this.groups = [];
      const data = await this.$store.dispatch("production/GET_NHOM_TIEU_THU_DIEN");
      this.groups = data;
    }
  },
};
</script>

<style></style>
