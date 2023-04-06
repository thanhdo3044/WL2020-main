<template>
  <q-page class="q-pa-sm">
      <q-card class="my-card">
          <q-card-section>
              <div class="row">
                  <div class="col-4 top-title">
                      Báo cáo truy nguyên
                </div>
                 <div class="col-3">
             
            </div>
          <div class="col-3">
          </div>
          <div class="col-2" align="right">
              <q-btn color="primary" label="Xem báo cáo" @click="load" />
          </div>
              </div>
          </q-card-section>
          <q-separator  inset  />
          <q-card-section>
      
      <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
                :data-source="dataSource"
                :columns="columns"
                :show-borders="true"
                :no-data-text="'Không có dữ liệu !'"
            >
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Báo cáo truy nguyên'"
            />
            <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/>
            </DxDataGrid>
          </div>
      </div>
          </q-card-section>
      </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxExport
} from 'devextreme-vue/data-grid';
import { DxDateBox } from 'devextreme-vue';
import { formatDateISO,getFisrtDayOfMonth,formatDateVN } from '../../../ultils'
export default {
    components:{
        DxDataGrid,
        DxColumn,
        DxGrouping,
        DxGroupPanel,
        DxPager,
        DxPaging,
        DxSearchPanel,
        DxDateBox,
        DxExport
    },
    data(){
        return {
            dataSource:[],
            columns:[ 'Tuần','Mã tổ QC','Kho đến','Loại lỗi','Biện pháp xử lý','Chi tiết/cụm',
                {
                    dataField:'Số lượng',
                    format:'fixedpoint'
                },'Người tạo','Ngày Tạo'
            ],
            fromDate:null,
            toDate: null
        }
    },
    computed:{
        tuNgay(){
            return formatDateVN(this.fromDate)
        },
        denNgay(){
            return formatDateVN(this.toDate)
        }
    },
    created(){
        this.toDate = new Date()
        this.fromDate = getFisrtDayOfMonth(new Date())
        this.load()
    },
    methods:{
        async load(){
            const myFactoryId = this.$route.query.factoryId
            if (myFactoryId) {
                let payload = {
                    fromDate: formatDateISO(this.fromDate),
                    toDate: formatDateISO(this.toDate),
                    factoryId: myFactoryId
                }
                const data = await this.$store.dispatch('prod/GET_REPORT_QC_SOLUTION',payload)
                this.dataSource = data.data
            }
        }
    }
}
</script>

<style>

</style>