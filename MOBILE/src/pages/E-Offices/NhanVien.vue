<template>
  <q-page class="q-pa-md q-ma-sm">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-12 top-title">Phân quyền E-office</div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row justify-around">
          <div class="col-12 col-sm-4 q-pa-sm">
            <TableUser :onSelectionChanged="onSelectionChangedTableUser" />
          </div>
          <q-separator vertical />

          <div class="col-12 col-sm-6 q-ml-sm" v-if="showRole">
            <q-card class="my-card">
              <q-card-section class="bg-primary text-white">
                <div class="text-h6">
                  {{ user.lastName }} - {{ user.account }}
                </div>
                <div class="text-subtitle2">{{ user.position }}</div>
              </q-card-section>
              <q-card-section>
                {{ department }}
              </q-card-section>
              <q-card-section>
                <DxTreeList
                  id="proposalForms"
                  ref="treeList"
                  :data-source="proposalForms"
                  :show-row-lines="true"
                  :show-borders="true"
                  :column-auto-width="true"
                  :expanded-row-keys="expandedRowKeys"
                  :selected-row-keys.sync="selectedRowKeys"
                  key-expr="id"
                  @editor-preparing="onEditorPreparing"
                  @init-new-row="onInitNewRow"
                >
                  <DxSelection mode="single" />
                  <DxEditing
                    :allow-updating="true"
                    :allow-deleting="true"
                    :allow-adding="true"
                    :popup="popupOptions"
                    mode="popup"
                  />
                  <DxSelection :recursive="recursive" mode="multiple" />
                  <DxColumn data-field="title" caption="Tiêu đề">
                    <DxValidationRule type="required" />
                  </DxColumn>
                  <DxColumn
                    :visible="true"
                    data-field="costcenterId"
                    caption="Bộ phận"
                  >
                    <DxLookup
                      :data-source="departments"
                      value-expr="id"
                      display-expr="name"
                    />
                    <DxValidationRule type="required" />
                  </DxColumn>
                  <DxColumn data-field="status" caption="Trạng thái" />
                  <DxColumn
                    :width="120"
                    data-field="updatedAt"
                    data-type="date"
                    caption="Ngày cập nhật"
                  />
                  <DxColumn type="buttons">
                    <DxButton name="edit" />
                    <DxButton name="delete" />
                  </DxColumn>
                </DxTreeList>
              </q-card-section>
            </q-card>
          </div>
          <div v-else class="col-12 col-sm-6 q-ml-sm content-center">
            <h4>Vui lòng chọn Tài khoản để phân quyền</h4>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import TableUser from "../../components/Adminsitrator/TableUser";
import {
  DxTreeList,
  DxEditing,
  DxColumn,
  DxValidationRule,
  DxLookup,
  DxSelection,
  DxButton
} from "devextreme-vue/tree-list";
export default {
  data() {
    return {
      showRole: true,
      departments: [],
      department: {},
      user: {},
      popupOptions: {
        title: "Biểu mẫu đề xuất",
        showTitle: true,
        width: 700
      },
      proposalForms: [
        {
          id: "0ff0c991-6f94-4430-b519-01418ad5d7c8",
          number: 1,
          userId: "12T0193                             ",
          approvalableId: "c4ced5f1-06bb-49ed-bbf0-cfd3732bb696",
          approvalableType: "mua-hang",
          costcenterId: "063e6fd2-add3-464d-bf09-627289f7de68",
          companyId: "c4ced5f1-06bb-49ed-bbf0-cfd3732bb696",
          title: "Phiếu đề xuất mua hàng",
          status: "Đang sử dụng",
          showMessages: true,
          isDisable: false,
          createdAt: "2020-08-22T00:44:37.173Z",
          updatedAt: "2020-08-22T00:44:37.173Z"
        },
        {
          id: "df64977e-6dd5-4b49-8420-1703e0297942",
          number: 2,
          userId: "12T0193                             ",
          approvalableId: "c4ced5f1-06bb-49ed-bbf0-cfd3732bb696",
          approvalableType: "thanh-toan",
          costcenterId: "063e6fd2-add3-464d-bf09-627289f7de68",
          companyId: "c4ced5f1-06bb-49ed-bbf0-cfd3732bb696",
          title: "Phiếu đề nghị thanh toán",
          status: "Đang sử dụng",
          showMessages: true,
          isDisable: false,
          createdAt: "2020-08-22T00:44:37.173Z",
          updatedAt: "2020-08-22T00:44:37.173Z"
        }
      ],
      expandedRowKeys: [],
      selectedRowKeys: [],
      recursive: false
    };
  },
  components: {
    DxTreeList,
    DxEditing,
    DxColumn,
    DxValidationRule,
    DxLookup,
    DxButton,
    DxSelection,
    TableUser
  },
  methods: {
    async onSelectionChangedTableUser(e) {
      const data = e.selectedRowsData[0];
      this.user = data;
    },
    onEditorPreparing(e) {
      if (e.dataField === "Head_ID" && e.row.data.ID === 1) {
        e.editorOptions.disabled = true;
        e.editorOptions.value = null;
      }
    },
    onInitNewRow(e) {
      e.data.Head_ID = 1;
    },
    async loadDepartment() {
      const data = await this.$store.dispatch("base/GET_DEPARTMENTS", {
        factoryId: 100000
      });
      this.departments = data.data;
    }
  },
  created() {
    Promise.all([this.loadDepartment()]);
  },
  watch: {
    selectedRowKeys(newValue, oldValue) {
      console.log(newValue);
    },
    expandedRowKeys(newValue, oldValue) {
      console.log(newValue);
    }
  }
};
</script>
