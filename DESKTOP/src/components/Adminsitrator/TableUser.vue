<template>
  <div>
    <q-btn
      color="positive"
      icon="add_circle_outline"
      label="Thêm mới"
      @click="addAccount"
    />
    <DxDataGrid
      id="gridContainer"
      :data-source="users"
      :allow-column-reordering="true"
      :columns-auto-width="true"
      :show-row-lines="true"
      :show-borders="true"
      :selection="{ mode: 'single' }"
      :hover-state-enabled="true"
      @selection-changed="onSelectionChanged"
      @editorPreparing="onEditorPreparing"
      @init-new-row="InitNewRow"
      @row-inserted="insert"
      @editing-start="EditingStart"
      @row-updated="updated"
      @row-removed="removed"
      key-expr="id"
    >
      <!-- <DxPaging :enabled="true" :page-size="40" /> -->
      <DxScrolling mode="virtual" />
      <!-- <DxEditing
      :allow-updating="phanquyen"
      :allow-deleting="phanquyen"
      :allow-adding="phanquyen"
      mode="popup"
    /> -->
      <DxFilterRow :visible="true" />
      <DxHeaderFilter
        :visible="true"
      />
      <DxSearchPanel
      :visible="true"
      placeholder="Tìm tài khoản"
      :text="text"
      :width="200"
    />
      <DxColumn data-field="account" caption="Mã nhân viên" :width="100">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="lastName" caption="Họ Tên" :width="200">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn
        data-field="departmentId"
        caption="Bộ phận phê duyệt"
        :width="200"
        :visible="true"
      >
        <DxLookup
          :data-source="departmentsFilter"
          display-expr="name"
          value-expr="id"
        />
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="positionName" caption="Chức vụ" :width="150">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="EMAIL" caption="Email" :width="150" :visible="false">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="PHONE" caption="Số điện thoại" :width="150" :visible="false">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn
        data-field="unActive"
        caption="Trạng thái hoạt động"
        cell-template="cellTemplateCreatedAt"
        :width="140"
        :visible="true"
      >
        <DxLookup :data-source="active" display-expr="label" value-expr="id" />
      </DxColumn>
      <template #cellTemplateCreatedAt="{ data }">
        <a>{{ data.value == true ? "Đang hoạt động" : "Ngừng hoạt động" }}</a>
      </template>
      <DxColumn
        caption="Chỉnh sửa"
        width="100"
        alignment="center"
        cell-template="update-cell"
        :visible="admin"
      />
      <template #update-cell="cell">
        <span class="fake-link" @click="onUpdate(cell)">Sửa</span>
      </template>
    </DxDataGrid>
    <q-dialog v-model="showChoose" persistent>
      <q-card style="min-width: 70%">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title text-primary">
              Nhập thông tin người dùng
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-around">
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iAccountId" label="Mã nhân viên" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iLastName" label="Họ tên" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                use-input
                v-model="iDepartment"
                :options="departments"
                @filter="filterFn"
                label="Bộ phận phê duyệt"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iEmail" label="Email" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iPhone" label="Số điện thoại" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                use-input
                v-model="iUnActive"
                :options="active"
                label="Trạng thái hoạt động"
              />
            </div>

            <div class="col-12 col-md-5 q-mt-sm"></div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="OK" @click="createAccount" color="positive" />
          <q-btn label="Hủy" color="orange" @click="showChoose = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxRequiredRule,
  DxLookup,
  DxSearchPanel,
  DxHeaderFilter,
  DxScrolling,
  DxFilterRow,
} from "devextreme-vue/data-grid";
import { showNotifySuccess, showNotifyError } from "../../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxLookup,
    DxSearchPanel,
    DxScrolling,
    DxHeaderFilter,
    DxFilterRow,
    DxRequiredRule,
  },
  props: {
    onSelectionChanged: {
      type: Function,
    },
  },
  data() {
    return {
      users: [],
      departments: [],
      phanquyen: false,
      departmentsFilter: [],
      text: null,
      roles: [],
      active: [
        {
          label: "Ngừng hoạt động",
          id: false,
        },
        {
          label: "Đang hoạt động",
          id: true,
        },
      ],
      showChoose: false,
      admin:false,
      id: null,
      iAccountId: null,
      iLastName: null,
      iDepartment: null,
      iEmail: null,
      iPhone: null,
      iUnActive: null,
      isEdit: false,
    };
  },
  async created() {
    if (
      this.$store.state.base.userInfo.id == 100400 ||
      this.$store.state.base.userInfo.id == 102089
    ) {
      this.admin = true;
      this.phanquyen = true;
    }
    await this.loadDepartment().then(async () => {
      await this.loadPosition().then(async () => {
        await this.loadUser();
        await this.loadRoles();
      });
    });
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor"]),
  },
  methods: {
    InitNewRow(e) {
      e.data.unActive = true;
    },
    addAccount() {
      this.iAccountId = null;
      this.iLastName = null;
      this.iDepartment = null;
      this.iUnActive = {
        label: "Đang hoạt động",
        id: true,
      };
      this.isEdit = false;
      this.showChoose = true;
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.departments = this.departmentsFilter;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.departments = this.departmentsFilter.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    createAccount() {
      if (this.isEdit) {
        this.updated();
      } else {
        this.insert();
      }
      this.showChooseDepartment = false;
    },
    onUpdate(e) {
      this.id = e.data.data.id;
      this.iAccountId = e.data.data.account;
      this.iLastName = e.data.data.lastName;
      this.iEmail = e.data.data.EMAIL;
      this.iPhone = e.data.data.PHONE;
      this.iDepartment = this.departmentsFilter.find(
        (d) => d.id == e.data.data.departmentId
      );
      this.iUnActive = this.active.find((d) => d.id == e.data.data.unActive);
      this.isEdit = true;
      this.showChoose = true;
    },
    async insert() {
      let payload = {
        account: this.iAccountId,
        lastName: this.iLastName,
        departmentId: this.iDepartment.id,
        unActive: this.iUnActive.id,
        password: "01",
      };
      const data = await this.$store.dispatch("base/CREATE_ACCOUNT", payload);
      if (data.meta.success) {
        this.text = data.data.account;
        this.insertRoleValue(data.data.id, 100001, data.data.departmentId);
        this.insertRoleValue(data.data.id, 100009, 101330);
        await this.loadUser();
        await this.loadRoles();
        showNotifySuccess("Tạo tài khoản thành công !");
        this.showChoose = false;
      } else {
        showNotifyError();
      }
      // await this.loadUser();
      // await this.loadRoles();
    },
    EditingStart(e) {
      this.departmentOld = e.data.departmentId;
    },
    async updated() {
      const payload = {
        id: this.id,
        data: {
          account: this.iAccountId,
          lastName: this.iLastName,
          departmentId: this.iDepartment.id,
          EMAIL: this.iEmail,
          PHONE: this.iPhone,
          unActive: this.iUnActive.id,
          timeUnActive: moment().format("DD-MM-YYYY hh:mm:ss"),
        },
      };
      const data = await this.$store.dispatch("base/UPDATE_ACCOUNT", payload);
      if (data.meta.success) {
        showNotifySuccess("Cập nhật thành công !");
        await this.loadUser();
        this.showChoose = false;
      } else {
        showNotifyError();
      }

      await this.loadUser();
      // await this.loadRoles();
    },
    onDelete(e) {
      this.$q
        .dialog({
          title: "Xác nhận",
          message: `<em>Bạn có chắc muốn xóa người dùng:</em><br /> <strong class="text-primary">${e.data.data.lastName}</strong>`,
          cancel: true,
          persistent: true,
          html: true,
        })
        .onOk(() => {
          this.removed(e.data.data.id);
        });
    },
    async removed(id) {
      const payload = {
        id: id,
      };
      let data = await this.$store.dispatch("base/DELETE_ACCOUNT", payload);
      await this.loadUser();
    },
    async insertRoleValue(roleId, roleTypeId, value) {
      let payload = {
        roleId: roleId,
        roleTypeId: roleTypeId,
        value: value,
      };
      const data = await this.$store.dispatch("base/ADD_ROLE_VALUE", payload);
    },
    async loadUser() {
      const data = await this.$store.dispatch("base/GET_ACCOUNTS");
      this.users = data.data;
      console.log("this.users", this.users);
    },
    async loadRoles() {
      // const data = await this.$store.dispatch('base/GET_ROLES')
      // this.roles = data.data
      return true;
    },
    async loadDepartment() {
      const data = await this.$store.dispatch("base/GET_DEPARTMENTS_FULL");
      data.data.forEach((el) => {
        this.departments.push({
          id: el.id,
          name: `[${el.code}] ${el.name}`,
          label: `[${el.code}] ${el.name}`,
        });
      });
      this.departmentsFilter = this.departments;
      console.log("data", data);
    },
    async loadPosition() {
      const data = await this.$store.dispatch("base/GET_POSITION");
      this.positions = data.data;
    },
    // async onSelectionChanged({ selectedRowsData }){
    //     const data = selectedRowsData[0];
    //     let dataRole = await this.$store.dispatch('base/GET_ROLE_INFO_BY_ID',data.roleId)
    //     // console.log(dataRole.data)
    //     this.$q.loading.show(

    //     )
    //     setTimeout(() => {
    //         this.$root.$emit('chon_role', dataRole.data)
    //         this.$q.loading.hide()
    //     }, 1500);

    // },
    onEditorPreparing(e) {
      if (e.dataField === "id" || e.dataField === "roleId") {
        e.editorOptions.disabled = true;
      }
    },
  },
};
</script>

<style>
#gridContainer {
  height: 700px;
}
</style>
