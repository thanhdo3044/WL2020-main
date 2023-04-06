<template>
   <div>
    <div class="master-detail-caption">Lịch sử thay đổi giá</div>
    <DxDataGrid
      :data-source="dataSource2"
      :show-borders="true"
      :column-auto-width="true"
    >
      <DxColumn data-field="maSP" caption="Mã Sản phẩm"/>
      <DxColumn
        data-field="applyDate"
        data-type="date"
        format="dd/MM/yyyy" 
         caption="Ngày áp dụng"     
      />
      <DxColumn
        data-field="ngayhethan"
        data-type="date"
        format="dd/MM/yyyy" 
         caption="Ngày hết hạn"     
      />
      <DxColumn
        data-field="cost"
        caption="Giá"
        data-type="number"
        format="fixedpoint"
      />
      <DxColumn data-field="useFLAG" caption="Sử dụng"  cell-template="cellTemplate"/>
      <!-- <DxColumn
        :calculate-cell-value="completedValue"
        data-type="boolean"
        caption="Completed"
      /> -->
      <template #cellTemplate="cell">
              <span style="font-weight:800;color:green" v-if="cell.data.value.toString().trim()==='Y'">Đang sử dụng</span>
              <span v-else style="font-weight:800;color:red">Không sử dụng</span>
            </template>
    </DxDataGrid>
  </div>
  
</template>

<script>
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';
export default {
    components:{
        DxDataGrid, DxColumn
    },
    props:{
        templateData: {
            type: Object,
            default: ()=>{}
        },
        dataSource2:{
            type:Array
        }
    },
    data(){
        return {
            // dataSource2: this.getHistory(this.templateData.key),
            historys:[]
        }
    },
    async created(){
        // this.loadDetail()
        console.log(this.templateData.key)
        this.loadDetail()
    },
    methods:{
         async loadDetail(){
            const data = await this.$store.dispatch('nlg/GET_BANG_GIA',this.templateData.key)
            this.dataSource2 = data.data
        },
        async getHistory(key) {
            let  data = []
            if (key!=='undefined') {
                data = await this.loadDetail(key)
            }
            // console.log(data)
            // const dataStore = new DataSource({
            //     store: new ArrayStore({
            //     data: data,
            //     key: 'id'
            //     }),
            //     filter: ['maSP', '=', key.toString().trim()]
            // })
            return data
        }
    }
}
</script>

<style>

</style>