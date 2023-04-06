<template>
    <DxDataGrid
    :data-source="dataSource"
    :show-borders="true"
    :show-row-lines="true"
    :show-column-lines="false"
  >
     <DxColumn
        :width="110"
        data-field="ID"
      />
    <DxColumn
        data-field="CREATE_BY"
        caption="Tạo bởi"
      />
     <DxColumn
        data-field="CREATED_AT"
        data-type="date"
        caption="Ngày yêu cầu"
        format="dd/MM/yyyy"
      />
       <DxColumn
        data-field="APPROVAL_STATUS"
        caption="Trạng thái"
        :calculate-cell-value="cellStatus"
      />
      <DxColumn
        data-field="APPROVAL_DATE"
        data-type="date"
        caption="Ngày duyệt"
        format="dd/MM/yyyy"
      />
      <DxColumn
        data-field="APPROVAL_BY"
        caption="Duyệt bởi"
      />
      <DxColumn
        caption="Phê Duyệt"
        cell-template="approval-template"
        :visible="showApproval"
      />
      <template #approval-template={data}>
         <div class="row">
              <router-link :to="{ name: 'view-req-price', params: { id: data.data.ID }}">Xem</router-link>
         </div>
      </template>
  </DxDataGrid>
  
</template>

<script>
import {DxColumn,DxDataGrid} from 'devextreme-vue/data-grid';
export default {
    components:{
        DxDataGrid,
        DxColumn
    },
    props: {
        dataSource:{
            type: Array
        },
        showApproval:{
            type: Boolean,
            default:false
        }
    },
    data(){
        return {
            columns: ['ID', {
                dataField:'CREATE_BY',
                caption:'Tạo bởi',
            }, {
                dataField:'CREATED_AT',
                dataType:'date',
                caption:'Ngày yêu cầu',
                format:'dd/MM/yyyy'
            },{
                dataField:'APPROVAL_STATUS',
                caption:'Trạng thái',
                calculateCellValue: function(data) {
                    if (data.APPROVAL_STATUS ===0 ) {
                        return 'Chờ duyệt'
                    }else if(data.APPROVAL_STATUS===1) {
                        return 'Đã duyệt'
                    }else {
                        return 'Từ chối'
                    }
                }
            }, {
                dataField:'APPROVAL_BY',
                caption:'Duyệt bởi'
            },{
                dataField:'APPROVAL_DATE',
                caption:'Ngày Duyệt',
                format:'dd/MM/yyyy',
                dataType:'date'
            },{
                caption:'Phê Duyệt',
                dataField:'APPROVAL_STATUS',
                cellTemplate: function(container,options) {
                    container.appendChild(`<b>sjdha</b>`)
                }
            }]
        }
    },
    methods: {
        cellStatus(data) {
            if (data.APPROVAL_STATUS ===0 ) {
                return 'Chờ duyệt'
            }else if(data.APPROVAL_STATUS===1) {
                return 'Đã duyệt'
            }else {
                return 'Từ chối'
            }
        }
    }
}
</script>

<style>

</style>