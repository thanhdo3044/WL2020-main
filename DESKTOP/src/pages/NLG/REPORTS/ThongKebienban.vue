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
                  <!-- <div class="col-6 q-pa-md">
                      <SelectKho :onChange="chonKho" :showClear="true" :dsKho="dskho" />
                  </div> -->
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
              <DxGroupPanel
            :visible="true"
            :empty-panel-text="
              'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'
            "
          />
            <DxHeaderFilter :visible="true"/>
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Thống kê biên bản'"
            />
            <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/>
             <DxColumn
                caption="Nhà cung cấp"
                data-field="TENNCC"
                width="150"
               :group-index="0"
              />
             <DxColumn
                caption="Mã lô gỗ"
                data-field="MALOGONHAP"
                width="250"
               
              />
        <DxColumn data-field="CREATED_AT" caption="ngày nhập" 
                 alignment="center"
                  width="150"
                  data-type="date"
                  format="dd/MM/yyyy"/>
            <DxColumn
                caption="Số phiếu"
                data-field="SOPHIEU"
                width="250"
               
              />
              
           
            <DxColumn
                data-field="KLKHO"
                caption="Khối lượng(m³)"
                alignment="center"
                format="#,##0.####"
                width="150"
            />
               <DxColumn
                data-field="DONGIATB"
                caption="Đơn giá"
                alignment="center"
                format="#,###,##0"
                width="150"
            />
            <DxColumn
                data-field="TONGTIEN"
                caption="Thành tiền"
                alignment="center"
               format="#,###,##0"
                width="150"
            />
             
            <DxSummary>
                     <DxGroupItem
                column="KLKHO"
                summary-type="sum"
                    value-format="###0.####"
                        :show-in-group-footer="false"
                  :align-by-column="true"
               display-format="{0}"
              />
              <DxGroupItem
                column="TONGTIEN"
                summary-type="sum"
                value-format="###,###,##0.####"
                    :show-in-group-footer="false"
                  :align-by-column="true"
               display-format="{0}"
              />
             <DxTotalItem
                column="MALOGONHAP"
                summary-type="count"
                value-format="fixedpoint"
                display-format="Tổng cộng : "
                show-in-column="QUICACH"
              />
              <DxTotalItem
                column="KLKHO"
                summary-type="sum"
                    value-format="###0.####"
               display-format="{0}"
              />
              <DxTotalItem
                column="TONGTIEN"
                summary-type="sum"
                value-format="###,###,##0.####"
               display-format="{0}"
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
            const data = await this.$store.dispatch('nlg/GET_REPORT_THONG_KE_BIEN_BAN',payload)
            this.dataSource = data.data
        }
    }
}
</script>

<style>

</style>