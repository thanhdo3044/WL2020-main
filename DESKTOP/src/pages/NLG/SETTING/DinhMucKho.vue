<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title">
                     Định mức nhập kho
                  </div>
              </div>
          </q-card-section>
          <q-separator spaced />
          <q-card-section>
               <DxDataGrid
                :data-source="dinhmucs"
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
            :file-name="'Báo cáo sản xuất từ ngày '"
            />
            <DxHeaderFilter :visible="true"/>
            <DxGroupPanel :visible="true" :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'" />
            <DxGrouping :auto-expand-all="true" />
            <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/>
             <DxColumn
                data-field="groupQuiCachId"
                caption="Nhóm Qui Cách"
            >
            <DxRequiredRule/>
                 <DxLookup
                    :data-source="groups"
                    display-expr="code"
                    value-expr="id"
                    />
            </DxColumn>
            <DxColumn
                data-field="code"
                caption="Kho"
            >
                <DxRequiredRule/>
                 <DxLookup
                    :data-source="dskho"
                    display-expr="code"
                    value-expr="id"
                    />
            </DxColumn>
             <DxColumn
                data-field="khoiLuong"
                caption="Khối lượng(m³)"
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
            dskho:[],
            dupplicateNcc:[]
        }
    },
    created(){
        this.load()
        this.loadGroup()
    },
    methods:{
        async loadKho(){
                const duppp = []
           const data = await this.$store.dispatch('nlg/GET_DS_KHO')
            data.data.forEach(e=>{
                duppp.push({
                    text: e.name = e.tenkho,
                   value: e.makho
                })
            })
            this.dupplicateNcc = duppp
             this.dskho= data.data
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
            console.log(e.data)
            const data = await this.$store.dispatch('nlg/ADD_DINH_MUC_KHO',e.data)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
        async update(e){
            const data = await this.$store.dispatch('nlg/UPDATE_DINH_MUC_KHO',e)
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