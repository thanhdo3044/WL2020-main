<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="top-title col-8">Chỉnh sửa lệnh sản xuất</div>
        </div>
        <div class="row">
          <div class="col-2">
            <q-select
              use-input
              @filter="filterFn"
              @input="onChange"
              v-model="number"
              :options="options"
              label="Chọn lệnh sản xuất"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <DxDataGrid
          id="gridContainer"
          :data-source="dataSource"
          :allow-column-reordering="true"
          :show-borders="true"
          :show-row-lines="true"
              :show-column-lines="true"
          key-expr="id"
          @row-updated="updated"
        >
          <DxPaging :enabled="true" />
          <DxEditing
            :allow-updating="isUpdate"
            mode="row"
          />
          <DxColumn data-field="stepId" caption="Công đoạn">
            <DxLookup
              :data-source="departments"
              value-expr="id"
              display-expr="label"
            />
          </DxColumn>
          <DxColumn data-field="itemId" caption="sản phẩm">
            <DxLookup
              :data-source="items"
              value-expr="value"
              display-expr="label"
            />
          </DxColumn>
          <DxColumn data-field="order" caption="thứ tự" />
          <DxColumn data-field="quantity" caption="Số lượng" />
          <DxColumn data-field="daThucHien" caption="Đã thực hiện" />
          <DxColumn data-field="keHoach" caption="Kế hoạch" />
          <DxColumn data-field="endPO" caption="Đóng/Mở" />
          <DxColumn data-field="loiCongDon" caption="Lỗi ghi nhận" />
          <DxColumn data-field="loiLoai" caption="Lỗi xử lý" />
        </DxDataGrid>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
} from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import { showNotifySuccess, showNotifyError } from "../../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxLookup,
  },
  data() {
    return {
      dataSource: [],
      options: [],
      departments: [],
      items: [],
      numberFilter: [],
      number: null,
      isInsert: false,
      isUpdate: false,
      isDelete: false,
    };
  },
    computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  created() {
    this.loadPermission();
    this.loadNumber();
    this.loadItems();
    this.loadDepartment();
  },
  methods: {
    ...mapActions("vcn", ["GET_NUMBER_PO", "getLSXByNumber", "GET_ITEMS_VCN", "updatePOByNumber"]),
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
    async loadNumber() {
      const data = await this.GET_NUMBER_PO();
      console.log("data", data);
      this.options = data;
      this.numberFilter = data;
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
    },
    async loadItems() {
      const data = await this.GET_ITEMS_VCN();
      this.items = [];
      data.forEach((el) => {
        this.items.push({
          label: el.name,
          value: el.id,
        });
      });
    },
    onChange() {
      this.loadData();
    },
    async loadData() {
      const payload = {
        number: this.number.value,
      };
      const data = await this.getLSXByNumber(payload);
      this.dataSource = data;
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.options = this.numberFilter;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.options = this.numberFilter.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async updated(e) {
        console.log("e",e);
        const payload = e.data;
        const data = await this.updatePOByNumber(payload);
        if(data.data.meta.success){
            showNotifySuccess();
            this.loadData();
        }
    },
  },
};
</script>

<style>
</style>