<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          
          <q-card-section>
              
              <div class="row">
                  <div class="col-10 top-title">
                      Bảng giá
                  </div>
                  <div class="col-2" align="right">
                    <q-btn color="primary"  label="Cập nhật" :to="'/nlg-update-price'" />
                  </div>
              </div>
          </q-card-section>
          <q-separator spaced    />
          <q-card-section>
              <DxDataGrid
    id="grid-container"
    :show-borders="true"
    :data-source="dataSource"
    key-expr="ma"
  >
   <DxFilterRow
        :visible="true"
      />
      <DxHeaderFilter
        :visible="true"
      />
      <DxSearchPanel
        :visible="true"
        :width="340"
        placeholder="Tìm kiếm mã nguyên vật liệu"
      />
    <DxColumn
      :width="170"
      data-field="ma"
      caption="Mã Sản phẩm"
    />
    <DxColumn
      data-field="ten"
      caption="Tên NVL"
    />
    <DxColumn
      data-field="tenChiTiet"
      caption="Tên Chi tiết"
    />
    <DxColumn
      :width="70"
      data-field="day"
      caption="Dầy"
    />
     <DxColumn
      :width="70"
      data-field="rong"
      caption="RỘNG"
    />
     <DxColumn
      :width="70"
      data-field="cao"
      caption="DÀI"
    />
    <DxMasterDetail
      :enabled="true"
      template="masterDetailTemplate"
      :auto-expand-all="true"
    />
    <template #masterDetailTemplate="options">
      <DetailBangGia
        :templateData="options.data"
      />
    </template>
  </DxDataGrid>
          </q-card-section>
      </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxMasterDetail,
  DxFilterRow,
  DxHeaderFilter,
  DxSearchPanel
} from 'devextreme-vue/data-grid';
import DetailBangGia from '../../../components/NLG/DetailBangGia'
export default {
    components:{
        DxDataGrid,
        DxColumn,
        DxMasterDetail,
        DetailBangGia,
         DxFilterRow,
  DxHeaderFilter,
  DxSearchPanel
    },
    data() {
        return {
            dataSource: [],
            banggia:[]
        };
    },
    created(){
        Promise.all([this.loadNLG()])
    },
    methods:{
        async loadNLG(){
            const data = await this.$store.dispatch('nlg/GET_NLG')
            this.dataSource = data.data
        },
    }
}
</script>

<style>

</style>