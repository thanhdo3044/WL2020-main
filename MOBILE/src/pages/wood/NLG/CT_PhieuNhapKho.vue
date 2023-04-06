<template>
  <q-page class="q-pa-md">
      <div class="row">
          <h6>BIÊN BẢN NGHIỆM THU GỖ XẺ TƯƠI</h6>
      </div>
      <div class="row">
          <div class="col-8">
              <p>Đơn vị giao hàng :  Công ty TNHH Hà Kim Phương</p>
              <p>Địa chỉ : Đoan Hùng, Phú Thọ</p>
              <p>Kho nhập : TH</p>
              <p>Trạng thái MT: FSC100%         Nhóm SP: W5</p>
          </div>
          <div class="col-4">
              <p>Số phiếu : 2020.35/3TH</p>
              <p>Biển số xe: 19C06609</p>
              <p>Ngày Nhập : 12/3/2020</p>
              <p>Mã lô gỗ nhập : </p>
          </div>
      </div>
      <q-separator     />
      <div class="row">
          <DxDataGrid
                id="grid"
                :data-source="countries"
                :column-auto-width="true"
                :allow-column-reordering="true"
                :show-borders="true"
                :no-data-text="'Không có dữ liệu !'"
            >
                <DxColumn data-field="STT"/>
                <DxColumn caption="Qui cách(mm)" alignment="center" >
                <DxColumn
                    caption="Dầy"
                    data-field="HEIGHT"
                />
                <DxColumn
                    caption="Rộng"
                    data-field="WIDTH"
                />
                <DxColumn
                    caption="Dài"
                    data-field="LENGTH"
                />
                </DxColumn>
                <DxColumn data-field="SOBO" alignment="center"/>
                <DxColumn data-field="SOTHANHBO" alignment="center"/>
                <DxColumn data-field="TONGTHANH" alignment="center"/>
                <DxColumn data-field="KHOILUONG" alignment="center"/>
                <DxColumn data-field="GHICHU" alignment="center"/>
                
            </DxDataGrid>
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="primary" @click="goAdd" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import DxDataGrid, { DxColumn } from 'devextreme-vue/data-grid';
export default {
    components: {
        DxDataGrid,
        DxColumn
    },
    data() {
        return {
        countries: [],
        gdpFormat: {
            type: 'percent',
            precision: 1
        }
        };
    },
    methods:{
        goAdd(){
            this.$router.push('/wood-add-wh-receipts-dlt')
        }
    }
}
</script>

<style>

</style>