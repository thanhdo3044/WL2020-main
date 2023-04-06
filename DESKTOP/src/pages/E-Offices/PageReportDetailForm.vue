<template>
  <q-page>
      <q-card class="text-h5 q-ma-sm q-pa-sm bg-primary text-yellow shadow-8">
          Báo cáo chi tiết phiếu đề xuất
      </q-card>
      <q-card class="q-pa-sm q-ma-sm shadow-6">
          <div class="q-ma-sm text-h6">
              Mời bạn chọn Phiếu cần xuất :
          </div>
        <q-select
        filled
        class="q-mt-sm q-pr-sm q-ma-sm"
        v-model="model"
        @input="changed"
        use-input
        input-debounce="0"
        label="Danh sách phiếu"
        :options="options"
        @filter="filterFn"
        style="width: 33.33% !important"
        behavior="dialog"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select> 
      </q-card>
      <q-card class="q-ma-sm shadow-6">
        <!-- {{dataSearchForm}} -->
    <DxDataGrid
      id="gridContainer"
      :data-source="dataSearchForm"
      :allow-column-reordering="true"
      :show-borders="true"
      :show-row-lines="true"
      :word-wrap-enabled="true"
    >
    <DxFilterRow :visible="true" />
    <DxSearchPanel :visible="true" />
    <DxPaging :enabled="true"/>
      <DxColumn
        data-field="selection"
        caption="Tên phiếu"
      />
      <DxColumn
        data-field="createdAt"
        caption="createdAt"
        data-type="datetime"
      />
      <DxColumn
        data-field="fromAccountId"
        caption="Người gửi"
        alignment="center"
      />
      <DxColumn
        data-field="accountId"
        caption="Người nhận"
        alignment="center"
      />
      <DxColumn
        data-field="locationWork"
        caption="locationWork"
        alignment="center"
      />
      <DxColumn
        data-field="total"
        caption="Tổng"
        alignment="center"
      />
      
    </DxDataGrid>

      </q-card>
  </q-page>
</template>

<script>
import {mapGetters,mapActions}from 'vuex';
import DxButton from 'devextreme-vue/button';
import { DxDataGrid, DxColumn, DxEditing, DxPaging, DxLookup,DxFilterRow,DxSearchPanel } from 'devextreme-vue/data-grid';

import axios from 'axios';
export default {
    data(){
        return{
            options:null,
            formRequests:[],
            model:null,
            dataSearchForm:null
        }
    },
    computed:{
       
    },
    components:{
        DxDataGrid,
        DxColumn,
        DxEditing,
        DxPaging,
        DxLookup,
        DxButton,
        DxFilterRow,
        DxSearchPanel
    },
    methods:{
        async loadData(){
         let {data} = await axios.get("/api/v2/formRequests")
         await data.data.forEach(e=>{
             this.formRequests.push({
                 label:e.name,
                 value:e.id,
                 slug:e.slug
             })
         });
         console.log(this.formRequests)

        },
        async changed(){
         console.log('changed')
         console.log('model',this.model.slug)
         let data = await axios.get(`/api/v2/order-metas-search?slug=${this.model.slug}`);
         this.dataSearchForm = data.data.data; 
        },
        filterFn (val, update) {
        if (val === '') {
            update(() => {
            this.options = this.formRequests
            })
            return
        }

        update(() => {
            const needle = val.toLowerCase()
            this.options = this.formRequests.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        })
        },
    },
    created(){
        this.loadData();
    }
}
</script>

<style>

</style>