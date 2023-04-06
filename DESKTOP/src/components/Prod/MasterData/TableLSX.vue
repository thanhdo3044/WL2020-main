<template>
  <DxDataGrid
                    id="gridContainer"
                    :data-source="lsxs"
                    :allow-column-reordering="true"
                    :columns-auto-width="true"
                    :show-borders="true"
                    :selection="{ mode: 'single' }"
                    :hover-state-enabled="true"
                    @selection-changed="onSelectionChanged"
                    @editorPreparing="onEditorPreparing"
                    @row-inserted="insert"
                    @row-updated="updated"
                    key-expr="id"
                    >
                    <DxPaging :enabled="true" :page-size="40"/>
                    <DxEditing
                        :allow-updating="true"
                        :allow-adding="true"
                        mode="popup"
                    />
                    <DxFilterRow
                        :visible="true"
                    />
                     
                    <DxSearchPanel
                        :visible="true"
                        :width="200"
                        placeholder="Tìm kiếm"
                    />
                    <DxColumn data-field="id" :visible="false" />
                    <DxColumn
                        data-field="code"
                        caption="Mã LSX"
                        :width="80"
                    >
                    <DxRequiredRule/>
                    </DxColumn>
                    <DxColumn data-field="name" caption="Tên LSX">
                        <DxRequiredRule/>
                    </DxColumn>
                    <DxColumn v-if="type==='vcn'" data-field="typeId" caption="Loại LSX">
                        <DxLookup
                        :data-source="lsxTypes"
                        display-expr="name"
                        value-expr="id"
                        />
                        <DxRequiredRule/>
                    </DxColumn>
                    <DxColumn v-if="type==='vcn'" data-field="routingName" caption="Định tuyến">
                        <DxLookup
                        :data-source="routing"
                        display-expr="name"
                        value-expr="name"
                        />
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
        type:{
            type:String,
            default:'cbg'
        },
        routing:{
            type:Array
        },
        lsxTypes:{
            type:Array
        },
        lsxs:{
            type:Array
        },
        onSelectionChanged:{
            type:Function
        },
        insert:{
            type:Function
        },
        updated:{
            type:Function
        }
        
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