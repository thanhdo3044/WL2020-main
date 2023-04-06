<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          
          <q-card-section>
              <div class="row">
                  <div class="col-9 top-title">
                      Theo dõi nhập ván bóc
                  </div>
                  <div class="col-3 top-title cursor-pointer" @click="showChooseMonth=true">
                      {{month.label}} - {{year.label}}
                  </div>
              </div>
          </q-card-section>
          <q-card-section>
              <!-- <div class="row">
                  <div class="col-3">
                  </div>
                  <div class="col-3 q-pa-md">
                      <q-select v-model="month" :options="months" label="Tháng"  />
                  </div>
                  <div class="col-3 q-pa-md">
                      <q-select v-model="year" :options="years" label="Năm"  />
                  </div>
                  <div class="col-3 self-center">
                      <q-btn color="primary" class="full-width" label="Xem báo cáo" @click="loadReport" />
                  </div>
              </div> -->
          </q-card-section>
          <q-card-section>
               <DxDataGrid
                :data-source="dataSource"
                :columns="columns"
                :show-borders="true"
            >
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Báo cáo tồn các công đoạn'"
            />
            <DxSearchPanel
                :visible="true"
                :width="340"
                placeholder="Tìm kiếm"
            />
            <DxHeaderFilter :visible="false"/>
            <DxFilterRow :visible="true"/>
            <DxScrolling mode="infinite"/>

            <DxGroupPanel :visible="false"/>
            <DxGrouping :auto-expand-all="true"/>
            <DxSummary>
                <DxGroupItem
                    column="Tồn"
                    summary-type="sum"
                    :display-format="'Tồn  {0} (t)'"
                    format="fixepoint"
                />
                <DxGroupItem
                    column="Tồn m3"
                    summary-type="sum"
                    :display-format="'Tồn  {0} (m³)'"
                    format="0.00#"
                />
            </DxSummary>
            </DxDataGrid>
          </q-card-section>
      </q-card>
      <DialogSelectMonthYear :showChooseMonth="showChooseMonth"   :selectMonthYear="selectMonthYear" />
  </q-page>
</template>

<script>
import {DxDataGrid,DxGrouping,DxGroupPanel,DxSummary,DxGroupItem,
DxExport,DxHeaderFilter,DxScrolling,DxFilterRow,DxSearchPanel} from 'devextreme-vue/data-grid';
import DialogSelectMonthYear from '../../../components/commons/DialogSelectMonthYear'
export default {
    components:{
        DxDataGrid,DxGrouping,DxGroupPanel,DxSummary,DxGroupItem,
DxExport,DxHeaderFilter,DxScrolling,DxFilterRow,DxSearchPanel,
DialogSelectMonthYear
    },
    data(){
        return {
            showChooseMonth:false,
            year:null,
            month:null,
            dataSource:[

            ],
            columns:[
                {
                    dataField:'Kho/Xưởng',
                    caption:'Kho/Xưởng',
                    groupIndex:0
                },
                {
                    dataField:'Tổ',
                    caption:'Tổ',
                    groupIndex:1
                },
                {
                    dataField:'Chi tiết/cụm',
                    caption:'Sản phẩm'
                },
                {
                    dataField:'Tồn đầu kỳ',
                    format:'fixedPoint',
                    dataType:'number'
                },
                {
                    dataField:'Nhập',
                    format:'fixedPoint',
                    dataType:'number'
                },
                {
                    dataField:'Xuất',
                    format:'fixedPoint',
                    dataType:'number'
                },
                {
                    dataField:'Tồn',
                    format:'fixedPoint',
                    dataType:'number'
                }
            ],
        }
    },
    created(){
        const today = new Date()
        const currentMonth = today.getMonth()
        this.month = {label:'Tháng '+parseInt(currentMonth+1),value:parseInt(currentMonth+1)}
        const currentYear = today.getFullYear()
        this.year = {label:`${currentYear}`,value:currentYear}
        this.loadReport()
    },
    methods:{
        selectMonthYear(m,y){
            this.showChooseMonth = false
            this.month = m
            this.year = y
            this.loadReport()
        },
        async loadReport(){
            const payload = {
                year:2020,
                month:3,
                warehouseId:100090
            }
            const data = await this.$store.dispatch('nlvan/GET_REPORT_THEO_DOI_NHAP_VAN',payload)
            
        }
    }
}
</script>

<style>

</style>