<template>
  <DxDataGrid
    id="gridContainer"
    :data-source="materials"
    :allow-column-reordering="true"
    :columns-auto-width="true"
    :show-borders="true"
    @editorPreparing="onEditorPreparing"
    key-expr="id"
    :no-data-text="'Không có dữ liệu !'"
    @row-removed="deleteItem"
    >
    <!-- <DxEditing
        :allow-updating="true"
        :allow-adding="true"
        mode="popup"
    /> -->
    <DxPaging :enabled="true" :page-size="40"/>
    <DxEditing
        :allow-deleting="true"
        mode="popup"
    />
    <DxColumn data-field="itemId" :visible="false" />
    <DxColumn
        data-field="code"
        caption="Mã Nguyên Vật liệu"
    >
    <DxRequiredRule/>
    </DxColumn>
    <DxColumn data-field="name" caption="Tên NVL">
        <DxRequiredRule/>
    </DxColumn>
     <DxColumn data-field="quantity" caption="Số lượng(tấm)">
    </DxColumn>
    </DxDataGrid>
</template>

<script>
import { DxDataGrid, DxColumn, DxEditing, DxPaging,DxRequiredRule, DxLookup ,DxSearchPanel,DxHeaderFilter,DxFilterRow} 
from 'devextreme-vue/data-grid';
export default {
    components:{
        DxDataGrid, DxColumn, DxEditing, DxPaging,DxRequiredRule, DxLookup ,DxSearchPanel,DxHeaderFilter,DxFilterRow
    },
    props:{
        materials:{
            type: Array
        },
        deleteItem:{
            type: Function
        }
    },
    methods:{
        onEditorPreparing(e){
             if ( e.dataField === 'id'|| e.dataField === 'roleId') {
                e.editorOptions.disabled = true
            }
        },
    }
}
</script>

<style>

</style>