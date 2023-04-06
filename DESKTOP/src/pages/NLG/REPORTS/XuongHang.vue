<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          <q-card-section>
             <div class="row">
                 <div class="col-10 top-title">
                     BẢNG TỔNG HỢP KHỐI LƯỢNG GỖ NHẬP KHO 
                 </div>
                 <div class="col-2 print-hide" align="right">
                     <q-btn color="primary" icon="print"  @click="print" />
                </div>  
             </div>
          </q-card-section>
          <q-card-section class="print-hide">
              <div class="row">
                     <div class="col-3 q-pa-md">
                      <DateBox :onChange="chonFromDate" :value="fromDate" :title="'Từ ngày'"/>
                  </div>
                  <div class="col-3 q-pa-md">
                      <DateBox :onChange="chonToDate" :value="toDate" :title="'Đến ngày'"/>
                  </div>
                  <div class="col-6 q-pa-md">
                      <SelectKho :onChange="chonKho" :showClear="true" :dsKho="dskho" />
                  </div>
                  <!-- <div class="col-3 q-pa-md">
                      <SelectNum :dataSource="thangs" :onChange="chonThang" :title="'Chọn Tháng'" :defaultValue="thang"/>
                  </div>
                  <div class="col-3 q-pa-md">
                      <SelectNum :dataSource="nams" :onChange="chonNam" :title="'Chọn năm'" :defaultValue="nam"/>
                  </div> -->
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
                :show-page-size-selector="false"
            >
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Tổng hợp xuống hàng '"
            />
             <DxHeaderFilter :visible="true"/>
            <DxPaging :page-size="1000"/>
            <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/>
             <DxColumn
                caption="STT"
                data-field="ID"
                format="fixedPoint"
                alignment="center"
                width="50"
                cell-template="cellTemplate"
              />
                <DxColumn
                data-field="XUONGXENANG"
                caption=""
                cell-template="xenang-template"
                :group-index="0"
            />   
            <DxColumn
                data-field="BIENSOXE"
                caption="Biển số xe"
               width="150"
            />   
            <DxColumn
                data-field="CREATED_AT"
                caption="Ngày nhập"
                data-type="date"
                format="dd/MM/yyyy"
                 width="150"
              />
               <DxColumn
                data-field="SOPHIEU"
                caption="Số phiếu"
                alignment="center"
                 width="150"
                
            />
            <DxColumn
                data-field="MAKHO"
                caption="Kho"
                alignment="center"
                 width="80"
            />
            <DxColumn
                data-field="KLKHO"
                caption="Khối lượng(m³)"
                alignment="center"
                format="#,##0.####"
                width="150"
            />
            <DxColumn
                data-field="NAME"
                caption="Tên nhà cung cấp"
                alignment="center"
            />
            <DxColumn
                data-field="ADDRESS"
                caption="Địa chỉ"
            />
             
            <DxSummary>
                <DxGroupItem
                :show-in-group-footer="false"
                :align-by-column="true"
                column="KLKHO"
                summary-type="sum"
                value-format="#,##0.####"
                display-format="{0} m³"
                />
            
              <DxTotalItem
                column="KLKHO"
                summary-type="sum"
                value-format="###0.####"
                display-format="{0}"
              />
            </DxSummary>
             <template #cellTemplate="cell">
              <p>{{cell.data.rowIndex+1}}</p>
            </template>
            <template #xenang-template="cell">
               <div v-if="cell.data.value.toString().trim()==='Y'">Xe nâng</div>
               <div v-else>Xuống bằng tay</div>
            </template>
            </DxDataGrid>
          </q-card-section>
          <q-separator  inset   />
          <q-card-section>
              <div class="row" style="font-size:20px">
                  <div class="col-12 col-sm-3">
                      P.TCHC
                  </div>
                  <div class="col-12 col-sm-3">
                      P.Nguyên Liệu
                  </div>
                  <div class="col-12 col-sm-3">
                      Xưởng Sản Xuất
                  </div>
                  <div class="col-12 col-sm-3">
                      Thủ kho
                  </div>
              </div>
              <div class="row" style="min-height:120px">

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
  DxExport,DxHeaderFilter,DxSummary,DxGroupItem,DxTotalItem
} from 'devextreme-vue/data-grid';
import SelectKho from '../../../components/NLG/SelectBoxKho'
import DateBox from '../../../components/commons/DateBox'
import { formatDateISO,thangs,nams } from '../../../ultils'
import SelectNum from '../../../components/commons/SelectBoxInt'
import {QSpinnerIos} from 'quasar'
export default {
    components:{
        SelectKho,
        DateBox,
        SelectNum,
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
            fromDate:new Date(),
            toDate:new Date(),
            dataSource:[],
            thangs:thangs,
            nams:nams,
            thang:null,
            nam:null
        }
    },
    created(){
      //  this.dskho = this.$store.getters['base/myKhoCBG']
      this.loadkho()
      this.toDate = new Date()
    this.fromDate = getFisrtDayOfMonth(new Date())
        const today = new Date()
        const currentMonth = today.getMonth()
        this.thang = currentMonth+1
       const currentYear = today.getFullYear()
        this.nam = currentYear
        
    },
    methods:{
        print(){
            window.print()
        },
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
        chonThang(e){
            this.thang = e.value
            this.load()
        },
        chonNam(e){
            this.nam = e.value
            this.load()
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
            // this.dataSource = []
            //  this.$q.loading.show({
            //     spinner:QSpinnerIos,
            //     spinnerColor: 'primary',
            //     spinnerSize: 140,
            //     message: 'Đang tải dữ liệu vui lòng chờ.....',
            //     messageColor: 'black',
            //     backgroundColor: 'purple'
            // })
         
            const payload = {
                 fromDate: formatDateISO(this.fromDate),
                toDate: formatDateISO(this.toDate),
                // year:this.nam,
                // month:this.thang,
                kho:this.kho ? this.kho : 'all'
            }
            const data = await this.$store.dispatch('nlg/GET_REPORT_XUONG_HANG',payload)
            this.dataSource = data.data
            // data.data.forEach(element => {
            //     this.dataSource.push({
            //         MAKHO:element.MAKHO,
            //         NAME:element.NAME,
            //         SOPHIEU:element.SOPHIEU,
            //         ADDRESS:element.ADDRESS,
            //         KLKHO:element.KLKHO,
            //        // XUONGXENANG: element.XUONGXENANG ==='N' ? 'Xưởng xuống tay' : 'Xuống xe nâng',
            //         CREATED_AT:element.CREATED_AT
            //     })
            // });
          // this.$q.loading.hide()
        }
    }
}
</script>

<style>

</style>