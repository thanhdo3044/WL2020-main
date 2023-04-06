<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      
      <q-card-section>
        <div class="row">
        <div class="col-10">
          <div class="top-title">Danh sách biên bản tính tiền</div>
        </div>
        <div class="col-2" align="right">
          <q-icon name="refresh" size="30px" @click="refreshDataGrid" color="primary" />
        </div>
      </div>
      </q-card-section>
      <q-card-section>
       
    <div class="row justify">
      <div class="col-12">
        <!-- <DxDataGrid
          :data-source="dataSource"
          :columns="columns"
          :show-borders="true"
          :allowColumnReordering="true"
          :allowColumnResizing="true"
          :columnAutoWidth="true"
          :searchPanel="{visible: true,width:500,placeholder:'Tìm kiếm'}"
          :headerFilter="{visible: true}"
        /> -->
        <DxDataGrid
      id="gridContainer"
      :data-source="dataSource"
      :showBorders="true"
      :allowColumnReordering="true"
      :allowColumnResizing="true"
      :columnAutoWidth="true"
      :searchPanel="{visible: true,width:500,placeholder:'Tìm kiếm'}"
      :headerFilter="{visible: true}"
      :filter-row="{visible:true}"
      ref="grid"
    >
    <DxLoadPanel :enabled="true"/>
      <DxColumn
        :width="160"
        :allow-sorting="false"
        caption="Số phiếu"
        :calculate-cell-value="joinNumOfReceipt"
      />
      <DxColumn
        :width="150"
        data-field="RECEIPT_DATE"
        caption="Ngày nhập kho"
        data-type="date"
        format="dd/MM/yyyy"
      />
      <DxColumn data-field="VENDOR_NAME"
        caption="Nhà cung cấp"/>
      <DxColumn data-field="STOCK_LOCATION_NAME" caption="Kho nhập"/>
      <DxColumn
        data-field="ID"
        caption='Action'
        width="120"
        cell-template="cellTemplate"
      />
      <template #cellTemplate="{ data }">
        <router-link v-if="dataSource.find((d)=>{return d.ID===data.value}).LOCK===0" :to="{ name: 'view-payment', params: { id: data.value}}">Duyệt</router-link>
        <router-link v-else :to="{ name: 'view-payment-completed', params: { id: data.value}}">Xem</router-link>
      </template>
    </DxDataGrid>
      </div>
    </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {DxColumn,DxDataGrid,DxLoadPanel} from 'devextreme-vue/data-grid';
export default { 
  components: {
     DxDataGrid,
      DxColumn,
      DxLoadPanel
  },
  data() {
    return {
      paymentInfo: [],
      dataSource: [],
      
    };
  },
  created(){
    this.initData()
  },
  methods: {
    async initData() {
      let data = await this.$store.dispatch('nlvan/GET_LIST_PAYMENT')
      this.dataSource = data.data
      
    },
    joinNumOfReceipt(data){
      return data.YEAR+'.'+data.NUMBER_OF_MONTH+'/'+data.MONTH+data.SL_CODE
    },
   refreshDataGrid() {
      this.$refs.grid.instance.refresh();
      this.$q.notify({
        message:'Dữ liệu đã được tải lại !'
      })
    } 
  }
};
</script>

<style scoped>
table, th, td ,tr{
  border: 1px solid black !important;
  border-collapse: collapse;
}
</style>