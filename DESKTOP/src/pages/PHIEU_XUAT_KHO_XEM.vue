<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <div class="q-pa-md">
    <q-table
      class="my-sticky-dynamic"
      flat bordered
      title="Xem các phiếu ra cổng đã được tạo"
      :data="dataTable"
      :columns="columns"
      :loading="loading"
      row-key="index"
      virtual-scroll
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :pagination="pagination"
      :rows-per-page-options="[0]"
      @virtual-scroll="onScroll"
    />
  </div>
  <div class="row">
        <div class="col-10"></div>
        <div class="col-2">
          <div class="remover"><q-btn  color="primary" @click="$router.push({ path: `/phieu-xuat-kho` })" >Quay trở lại</q-btn></div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      // nameData: [],
      dataTable: [],
      columns: [
        { name: 'soPhieu', align: 'left', label: 'Số phiếu', field: 'soPhieu', sortable: true, required: true, },
        { name: 'diChiCT', align: 'center', label: 'Địa chỉ công ty', field: 'diChiCT', sortable: true },
        { name: 'maHopDong', align: 'center', label: 'Mã hợp đồng', field: 'maHopDong', sortable: true },
        { name: 'tenKH', align: 'center', label: 'Tên khách hàng', field: 'tenKH', sortable: true },
        { name: 'diaChiVC', align: 'center', label: 'Địa chỉ vật chuyển', field: 'diaChiVC', sortable: true, },
      ],
      
    };
  },
  created() {
    this.load()
  },
  methods: {
    
    async load(){
      // cho ten nguoi nhan
      const dataGatePasss = await this.$store.dispatch("production/GET_GATE_PASS");
      console.log("hien thi phong ban ",dataGatePasss);
      dataGatePasss.forEach(x=>{
        this.dataTable.push({
          soPhieu:x.BALLOT_NUMBER,
          diChiCT:x.LOCATION_COMPANY,
          maHopDong:x.CONTRACT_NUMBER,
          tenKH:x.CUSTOMER_OR_CUSTOMER,
          diaChiVC:x.LOCATION_COMPANY,
        })
      })
      
    }
  },
  computed: {
  },
}


</script>

<style>
.remover{
  display: flex;
  justify-content: end;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>