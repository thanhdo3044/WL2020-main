<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title">
                     Nhóm qui cách
                  </div>
              </div>
          </q-card-section>
          <q-separator spaced />
          <q-card-section>
               <DxDataGrid
                :data-source="groups"
                :show-borders="true"
                :no-data-text="'Không có dữ liệu !'"
                :show-column-lines="true"
                :allow-column-resizing="true"
                @row-inserted="add"
               @row-updated="update"
              
            >
            <DxEditing
                :allow-updating="true"
                :allow-adding="true"
                
                mode="popup"
            />
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Danh sách Nhóm Qui Cách '"
            />
            <DxHeaderFilter :visible="true"/>
            <DxGroupPanel :visible="true" :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'" />
            <DxGrouping :auto-expand-all="true" />
            <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/>
             
             <DxColumn
                data-field="id"
                caption="MÃ"
            />
            <DxColumn
                data-field="name"
                caption="Tên nhóm Qui cách"
            />
            <DxColumn
                data-field="chankhackho"
                caption="Chặn nhập khác kho"
            />
            <DxColumn
                data-field="tylechinhpham"
                caption="tỷ lệ chính phẩm"
            />
            </DxDataGrid>
          </q-card-section>
      </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxEditing,
  DxRequiredRule,
  DxExport,DxHeaderFilter,DxSummary,DxGroupItem,DxTotalItem,DxLookup
} from 'devextreme-vue/data-grid';
import { showNotifySuccess, showNotifyError } from '../../../ultils';
export default {
    components:{
         DxDataGrid,
        DxColumn,
        DxGrouping,
        DxGroupPanel,
        DxPager,
        DxPaging,
        DxSearchPanel,
        DxLookup,
        DxEditing,
        DxRequiredRule,
        DxExport,DxHeaderFilter,DxSummary,DxGroupItem,DxTotalItem
    },
    data(){
        return {
            dinhmucs:[],
            groups:[],
            dskho:[]
        }
    },
    created(){
        this.loadGroup()
        //Promise.all([this.load(),this.loadGroup(),this.loadKho()])
    },
    methods:{
        async loadKho(){
            this.dskho= this.$store.getters['base/myKhoCBG']
        },
        async load(){
            const data = await this.$store.dispatch('nlg/GET_DINH_MUC_KHO')
            this.dinhmucs = data.data
        },
        async loadGroup(){
            const data = await this.$store.dispatch('nlg/GET_GROUP_QUI_CACH')
            this.groups = data.data
        },
        async add(e){
            const data = await this.$store.dispatch('nlg/ADD_GROUP_QUI_CACH',e.data)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
        async update(e){
            const data = await this.$store.dispatch('nlg/UPDATE_GROUP_QUI_CACH',e)
            // console.log(e)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
    }
}
</script>

<style>

</style>