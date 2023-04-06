<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          <q-card-section>
             <div class="row">
                 <div class="col-12 top-title">
                     Thống kê kho nhận
                 </div>
             </div>
          </q-card-section>
          <q-card-section>
              <div class="row">
                  <div class="col-6 q-pa-md">
                      <SelectKho :onChange="chonKho" :showClear="true" :dsKho="dskho" />
                  </div>
                  <div class="col-3 q-pa-md">
                      <DateBox :onChange="chonFromDate" :value="fromDate" :title="'Từ ngày'"/>
                  </div>
                  <div class="col-3 q-pa-md">
                      <DateBox :onChange="chonToDate" :value="toDate" :title="'Đến ngày'"/>
                  </div>
              </div>
          </q-card-section>
          <q-separator spaced    />
          <q-card-section>
              <DxDataGrid
                :data-source="dataSource"
                :show-borders="true"
                :no-data-text="'Không có dữ liệu !'"
                :show-column-lines="true"
                :allow-column-resizing="true"
            >
            <DxHeaderFilter :visible="true"/>
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Thống kê kho nhận'"
            />
            <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/>
          <DxColumn
                caption="Mã kho"
                data-field="MAKHO"
                width="100"
               
              />
            <DxColumn
                caption="Mã Qui Cách"
                data-field="CODE"
                width="100"
               
              />
               
            <DxColumn
                caption="Qui Cách"
                alignment="center"
            >
              <DxColumn
                caption="Dầy"
                data-field="DAY"
                format="fixedPoint"
                alignment="center"
                width="80"
              />
              <DxColumn
                caption="Rộng"
                data-field="RONG"
                format="fixedPoint"
                alignment="center"
                width="80"
              />
              <DxColumn
                caption="Dài"
                data-field="DAI"
                format="fixedPoint"
                alignment="center"
                width="80"
              />
            </DxColumn>
             <DxColumn
                data-field="TONSOTHANH"
                caption="Tổng số thanh"
                alignment="center"
                format="fixedpoint"
                width="150"
            />
            <DxColumn
                data-field="KL"
                caption="Khối lượng(m³)"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
             
            <DxSummary>
             <DxTotalItem
                column="ID"
                summary-type="count"
                value-format="fixedpoint"
                display-format="Tổng cộng : "
                show-in-column="QUICACH"
              />
              <DxTotalItem
                column="TONSOTHANH"
                summary-type="sum"
                value-format="fixedpoint"
              
              />
              <DxTotalItem
                column="KL"
                summary-type="sum"
                value-format="###0.####"
              
              />
            </DxSummary>
            </DxDataGrid>
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
  DxExport,DxHeaderFilter,DxSummary,DxGroupItem,DxTotalItem
} from 'devextreme-vue/data-grid';
import SelectKho from '../../../components/NLG/SelectBoxKho'
import DateBox from '../../../components/commons/DateBox'
import { formatDateISO } from '../../../ultils'
export default {
    components:{
        SelectKho,
        DateBox,
        DxDataGrid,
        DxColumn,
        DxGrouping,
        DxGroupPanel,
        DxPager,
        DxPaging,
        DxSearchPanel,
        DxExport,DxHeaderFilter,
        DxSummary,DxGroupItem,DxTotalItem
    },
    data(){
        return {
            dskho:[],
            kho:null,
            dupplicateNcc:[],
            fromDate:new Date(),
            toDate:new Date(),
            dataSource:[],
        }
    },
    created(){
        this.loadkho()
        this.load()
    },
    methods:{
         async loadkho(){
           const duppp = []
           const data = await this.$store.dispatch('nlg/GET_DS_KHO')
            data.data.forEach(e=>{
                duppp.push({
                    text: e.name = e.tenkho,
                   value: e.makho
                })
            })
           this.dupplicateNcc = duppp
          
              this.dskho= data.data
           
        },
        chonKho(e){
            this.kho = e.value
            this.load()
        },
        chonFromDate(e){
            this.fromDate = e.value
            this.load()
        },
        chonToDate(e){
            this.toDate = e.value
            this.load()
        },
        async load(){
            const payload = {
                from:formatDateISO(this.fromDate),
                to:formatDateISO(this.toDate),
                kho:this.kho ? this.kho : 'all'
            }
            const data = await this.$store.dispatch('nlg/GET_REPORT_THONG_KE_KHO_NHAN',payload)
            this.dataSource = data.data
        }
    }
}
</script>

<style>

</style>