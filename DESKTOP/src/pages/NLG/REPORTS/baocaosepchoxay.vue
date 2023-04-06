<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          <q-card-section>
             <div class="row">
                 <div class="col-12 top-title">
                     BÁO CÁO XẾP SẤY
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
                :allow-column-reordering="true"
                :show-borders="true"
                :no-data-text="'Không có dữ liệu !'"
                :show-column-lines="true"
                :show-row-lines="true"
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
                caption="Tên"
                data-field="NAME"
                width="150"
                :fixed="true"
               
              />
            <!-- <DxColumn
                caption="Mã Qui Cách"
                data-field="CODE"
                width="100"
               
              /> -->
               
            <DxColumn
                caption="Qui Cách"
                alignment="center"
            >
              <DxColumn
                caption="Dầy"
                data-field="DAY"
                format="fixedPoint"
                alignment="center"
                width="50"
              />
              <DxColumn
                caption="Rộng"
                data-field="RONG"
                format="fixedPoint"
                alignment="center"
                width="50"
              />
              <DxColumn
                caption="Dài"
                data-field="CAO"
                format="fixedPoint"
                alignment="center"
                width="50"
              />
            </DxColumn>
              <DxColumn
                caption="Khối lượng nhập kho"
                alignment="center"
            >
             <DxColumn
                data-field="TH"
                caption="TH"
                alignment="center"
                format="#,##0.####"
                width="80"
            />
            <DxColumn
                data-field="YS1"
                caption="YS1"
                alignment="center"
                format="#,##0.####"
                width="80"
            />
             <DxColumn
                data-field="TB"
                caption="TB"
                alignment="center"
                format="#,##0.####"
                width="80"
            />
             </DxColumn>
                <DxColumn
                caption="Khối lượng Xếp sấy TH"
                alignment="center"
            >
             <DxColumn
                data-field="xepsay"
                caption=" xếp sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
            <DxColumn
                data-field="chosay"
                caption="chờ sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
             <DxColumn
                data-field="DAVAOLO"
                caption="đã vào lò"
                alignment="center"
                allow-reordering="true"
                format="#,##0.####"
                width="100"
            />
               <DxColumn
                data-field="tronglo"
                caption="đang trong lò"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
               <DxColumn
                data-field="ralo"
                caption="đã ra lò"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
             </DxColumn>
              </DxColumn>
                <DxColumn
                caption="Khối lượng tồn xưởng lựa TH"
                alignment="center"
            >
             <DxColumn
                data-field="chualua"
                caption="Chưa lựa"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
            <DxColumn
                data-field="dalua"
                caption="Đã lựa"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
             <DxColumn
                data-field="TONGKL"
                caption="Tổng KL"
                alignment="center"
                allow-reordering="true"
                format="#,##0.####"
                width="100"
            />
              
             </DxColumn>
                <DxColumn
                caption="Khối lượng Xếp sấy YS1"
                alignment="center"
            >
             <DxColumn
                data-field="xepsayYS1"
                caption="xếp sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
            <DxColumn
                data-field="chosayYS1"
                caption="chờ sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
             <DxColumn
                data-field="DAVAOLOYS1"
                caption="đã vào lò"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
               <DxColumn
                data-field="trongloYS1"
                caption="đang trong lò"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
               <DxColumn
                data-field="raloYS1"
                caption="đã ra lò"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
             </DxColumn>
               <DxColumn
                caption="Khối lượng Xếp sấy TB"
                alignment="center"
            >
             <DxColumn
                data-field="xepsayTB"
                caption="xếp sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
            <DxColumn
                data-field="chosayTB"
                caption="chờ sấy"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
             <DxColumn
                data-field="DAVAOLOTB"
                caption="đã vào lò"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
               <DxColumn
                data-field="trongloTB"
                caption="đang trong lò"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
               <DxColumn
                data-field="raloTB"
                caption="đã ra lò"
                alignment="center"
                format="#,##0.####"
                width="100"
            />
             </DxColumn>
            <!-- <DxSummary>
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
            </DxSummary> -->
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
          //  dskho:[],
           // kho:null,
           // dupplicateNcc:[],
            fromDate:new Date(),
            toDate:new Date(),
            dataSource:[],
        }
    },
    created(){
        //this.loadkho()
        this.load()
    },
    methods:{
        //  async loadkho(){
        //    const duppp = []
        //    const data = await this.$store.dispatch('nlg/GET_DS_KHO')
        //     data.data.forEach(e=>{
        //         duppp.push({
        //             text: e.name = e.tenkho,
        //            value: e.makho
        //         })
        //     })
        //    this.dupplicateNcc = duppp
          
        //       this.dskho= data.data
           
        // },
        // chonKho(e){
        //     this.kho = e.value
        //     this.load()
        // },
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
                to:formatDateISO(this.toDate)
              
            }
            const data = await this.$store.dispatch('nlg/GET_REPORT_THONG_KE_KHO_NHAN1',payload)
            this.dataSource = data.data
        }
    }
}
</script>

<style>

</style>