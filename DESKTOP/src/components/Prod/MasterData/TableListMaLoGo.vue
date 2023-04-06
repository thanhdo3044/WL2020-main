<template>
  <DxDataGrid
                    id="gridContainer"
                    :data-source="malogos"
                    :allow-column-reordering="true"
                    :columns-auto-width="true"
                    :show-borders="true"
                    @row-inserted="insert"
                    key-expr="code"
                    >
                    <DxPaging :enabled="true" :page-size="40"/>
                    <DxEditing
                        :allow-adding="true"
                        mode="row"
                    />
                    <DxFilterRow
                        :visible="true"
                    />
                    <DxColumn
                        data-field="code"
                        caption="Mã Lô gỗ"
                    >
                    <DxRequiredRule/>
                    </DxColumn>
                    </DxDataGrid>
</template>

<script>
import { DxDataGrid, DxColumn, DxEditing, DxPaging,DxRequiredRule, DxLookup ,DxSearchPanel,DxHeaderFilter,DxFilterRow} 
from 'devextreme-vue/data-grid';
export default {
     components:{
        DxDataGrid,
        DxColumn,
        DxEditing,
        DxPaging,
        DxLookup,
        DxSearchPanel,DxHeaderFilter,
        DxFilterRow,
        DxRequiredRule
    },
    props:{
        malogos:{
            type:Array
        },
        insert:{
            type:Function
        },
        
    },
    methods:{
        onEditorPreparing(e){
            if ( e.dataField === 'id') {
                e.editorOptions.disabled = true
            }
        }
    }
}
</script>

<style>

</style>