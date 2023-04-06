<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-6 top-title text-blue">
            Quản lý danh mục phân quyền
          </div>
        </div>
        <div class="row">
          <DxDataGrid
            id="departments"
            :data-source="dataSource"
            :column-auto-width="true"
            :show-row-lines="true"
            :show-borders="true"
            key-expr="ID"
            parent-id-expr="parentId"
            @row-inserted="insert"
            @row-updated="updated"
            @row-removed="removed"
          >
            <DxScrolling mode="infinite" />
            <DxEditing
              :allow-updating="true"
              :allow-deleting="true"
              :allow-adding="true"
              mode="popup"
            />

            <DxColumn data-field="CODE" caption="Mã" width="300">
              <DxValidationRule type="required" />
            </DxColumn>
            <DxColumn data-field="NAME" caption="Tên" width="300">
              <DxValidationRule type="required" />
            </DxColumn>
          </DxDataGrid>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxEditing,
  DxColumn,
  DxValidationRule,
  DxLookup,
  DxPaging,
  DxFilterRow,
  DxSearchPanel,
  DxButton,
  DxScrolling
} from "devextreme-vue/data-grid";
import { showNotifySuccess, showNotifyError } from "../../../ultils";
import { mapGetters, mapActions } from "vuex";
export default {
    components: {
    DxDataGrid,
    DxEditing,
    DxColumn,
    DxValidationRule,
    DxLookup,
    DxPaging,
    DxFilterRow,
    DxSearchPanel,
    DxScrolling,
    DxButton,
  },
    data(){
        return{
            dataSource: [],
        }
    },
    created(){
        this.load();
    },
    methods:{
        ...mapActions("prod", [
      "getAccountPermission",
      "insertAccountPermission",
      "updateAccountPermission",
      "deleteAccountPermission",
    ]),
        async insert(e){
            const payload = {
                code: e.data.CODE,
                name: e.data.NAME
            }
            const data = await this.insertAccountPermission(payload);
            if(data.meta.success){
                showNotifySuccess();
                this.load();
            }else{
                showNotifyError();
            }
        },
         async updated(e){
            const payload = {
                code: e.data.CODE,
                name: e.data.NAME,
                id: e.data.ID
            }
            const data = await this.updateAccountPermission(payload);
            if(data.meta.success){
                showNotifySuccess();
                this.load();
            }else{
                showNotifyError();
            }
        },
        async removed(e){
            const payload = {
                id: e.data.ID
            }
            const data = await this.deleteAccountPermission(payload);
            if(data.meta.success){
                showNotifySuccess();
                this.load();
            }else{
                showNotifyError();
            }
        },
        async load(){
            const data = await this.getAccountPermission();
            this.dataSource = data.data;
        }
    }
};
</script>

<style>
</style>