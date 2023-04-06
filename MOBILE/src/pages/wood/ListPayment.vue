<template>
  <q-page class="q-pa-sm">
    <div class="row justify-center">
      <div class="prodTextTitle">Danh sách biên bản tính tiền</div>
    </div>
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
    >
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
  </q-page>
</template>

<script>
import {DxColumn,DxDataGrid} from 'devextreme-vue/data-grid';
export default { 
  components: {
     DxDataGrid,
      DxColumn
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
      let data = await this.$store.dispatch('wood/GET_LIST_PAYMENT')
      console.log(data.data)
      this.dataSource = data.data
      
    },
    joinNumOfReceipt(data){
      return data.YEAR+'.'+data.NUMBER_OF_MONTH+'/'+data.MONTH+data.SL_CODE
    },
    
  }
};
</script>

<style scoped>
table, th, td ,tr{
  border: 1px solid black !important;
  border-collapse: collapse;
}
</style>