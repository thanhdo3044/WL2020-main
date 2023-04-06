<template>
   <DxTreeList
      id="employees"
      :data-source="dataSource"
      :expanded-row-keys="expandedRowKeys"
      :show-row-lines="true"
      :show-borders="true"
      :column-auto-width="true"
      :root-value="rootValue"
      :key-expr="keyExp"
      :parent-id-expr="parentKey"
    >
     <DxSearchPanel
        :visible="true"
      />
      
     <DxHeaderFilter :visible="true"/>
      <DxColumnChooser :enabled="true"/>
     <DxFilterRow
        :visible="true"
      />
      <DxColumn
        data-field="code"
        caption="Mã kế hoạch"
         :fixed="true"
      />
      <DxColumn
        data-field="stepName"
        caption="Công đoạn"
      />
       <DxColumn
        data-field="itemName"
        caption="SP/Chi tiết"
       
      />
       <DxColumn
        data-field="target"
        caption="KH"
        data-type="number"
        format="fixedpoint"
      />
      <DxColumn
        data-field="quantity"
        caption="Đạt"
        data-type="number"
        format="fixedpoint"
      />
       <DxColumn
        data-field="error"
        caption="Lỗi"
        data-type="number"
        format="fixedpoint"
      />
       <DxColumn
        data-field="rate"
        caption="Tỷ lệ"
        data-type="number"
        format="percent"
      />
      <template #oscp-template="options">
          <span @click="goEdit(options.data.data)" class="fake-link" v-if="options.data.data.counts<=1">{{options.data.data.oscp}}</span>
          <span @click="goEdit(options.data.data)" class="fake-link" v-else>Vượt OSCP</span>
    </template>
    </DxTreeList>
</template>

<script>
import {
  DxTreeList,
  DxColumn,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  DxLookup,
  DxFilterRow,
} from 'devextreme-vue/tree-list';
export default {
    components:{
         DxTreeList,
        DxColumn,
        DxColumnChooser,
        DxHeaderFilter,
        DxSearchPanel,
        DxSelection,
        DxLookup,
        DxFilterRow,
    },
    props:{
        dataSource:{
            type:Array,
            default:()=>{}
        },
        expandedRowKeys:{
            type:Array,
            default:()=>{}
        },
        goEdit:{
            type:Function
        },
        rootValue:{
          type:String,
          default:"-1"
        },
        parentKey:{
          type:String
        },
        keyExp:{
          type:String
        }
    },
    methods:{
        // goEdit(departmentId,itemId){
        //     this.$router.push('/plan-edit-oscp?departmentId='+departmentId+'&itemId='+itemId)
        // }
    }
}
</script>

<style>

</style>