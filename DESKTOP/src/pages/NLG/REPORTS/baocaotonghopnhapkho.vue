<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          <q-card-section>
            <div class="row">
              <div class="col-12 col-sm-6 top-title">
                Danh sách nhập kho
              </div>
            </div>
            <div class="row">
                 
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
            <div class="row q-mb-sm">
             
              <div class="col-4"></div>
             
            </div>
            <DxDataGrid
                :data-source="dataSource"
                :show-borders="true"
                :no-data-text="'Không có dữ liệu !'"
                :show-column-lines="true"
                :allow-column-resizing="true"
                @row-updated="update"
                
               
            >
             <DxGroupPanel
            :visible="true"
            :empty-panel-text="
              'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'
            "
          />
             <DxEditing 
        :allow-updating="true"
         mode="popup" />
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Danh sách nhập kho'"
            />
            <DxHeaderFilter :visible="true"/>
            <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/>
              <DxFilterRow :visible="true" />
              <DxColumn
                caption="STT"
                data-field="id"
                format="fixedPoint"
                alignment="center"
                width="50"
                cell-template="cellTemplate"
              />
               <DxColumn
                data-field="SOPHIEUNHAP"
                caption="Số Phiếu"
                alignment="center"
                width="120"
            />
            <DxColumn
                data-field="CREATED_AT"
                caption="Ngày nhập kho"
                alignment="center"
                width="160"
                data-type="date"
                format="dd/MM/yyyy"
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
                width="100"
              />
              <DxColumn
                caption="Dài"
                data-field="CAO"
                format="fixedPoint"
                alignment="center"
                width="80"
              />
            </DxColumn>
             <DxColumn
                data-field="SOBO"
                caption="Số bó"
                alignment="center"
                width="80"
            />
            <DxColumn
                data-field="SOTHANH_BO"
                caption="Số thanh/bó"
                alignment="center"
                width="70"
            />
            
             <DxColumn
               data-field="TONGTHANH"
                caption="Tổng số thanh"
                width= "80"
            />
             <DxColumn
                data-field="KHOILUONG"
                caption="Khối lượng(m³)"
                format="##0.##"
                alignment="center"
                width="120"
            />
             <DxColumn
               data-field="BIENSOXE"
                caption="Biển kiểm soát"
                width= "120"
            />
           
             <DxColumn
                data-field="MANCC"
                caption="NCC"
                width="200"
            />
               <DxColumn
                data-field="OVER_PLAN"
                caption="Vượt kế hoạch"
                width="60"
            />
               <DxColumn
                data-field="khacKho"
                caption="khác kho"
                width="60"
            />
             <DxColumn
                data-field="vuotkho"
                caption="vượt kho"
                width="60"
            />
             <DxColumn
                data-field="PALLET"
                caption="Xếp Pallet"
                width="80"
            />
              <DxColumn
                data-field="HOTROKHAC"
                caption="Hỗ trợ"
                width="80"
            />
               <DxColumn
                data-field="NOTE"
                caption="Ghi chú"
                width="80"
            />
            <DxSummary>
              <DxGroupItem
                column="KHOILUONG"
                summary-type="sum"
                value-format="###0.####"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                display-format="{0}"
              />
             <DxTotalItem
                column="id"
                summary-type="count"
                value-format="fixedpoint"
                display-format="Tổng cộng : "
                show-in-column="CREATED_AT"
              />
              <DxTotalItem
                column="KHOILUONG"
                summary-type="sum"
                value-format="###0.##"
                display-format="{0}"
              />
            </DxSummary>
            <template #cellTemplate="cell">
              <p>{{cell.data.rowIndex+1}}</p>
            </template>
            <template #cellTemplateOverPlan="cell">
              <span style="font-weight:700;color:red" v-if="cell.data.value===1">Ngoài kế hoạch</span>
              <span v-else></span>
            </template>
            </DxDataGrid>
          </q-card-section>
      </q-card>
     <DialogSelectDate :selectDate="chooseDate" :showChooseDate="showChooseDate" :cancelChooseDate="cancelChooseDate" />
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxEditing,
  DxPaging,
  DxSearchPanel,DxFilterRow,
  DxExport,DxHeaderFilter,DxSummary,DxGroupItem,DxTotalItem
} from 'devextreme-vue/data-grid';
import DateBox from '../../../components/commons/DateBox'
import { formatDateISO,getFisrtDayOfMonth,formatDateVN } from '../../../ultils'
import DialogSelectDate from '../../../components/commons/DialogSelectFromDateToDate'
import { QSpinnerIos } from 'quasar';
import { showLoadingIos, closeLoading, showNotifySuccess, showNotifyError } from '../../../ultils';
import SelectBoxKho from '../../../components/NLG/SelectBoxKho'
import SelectBox from '../../../components/commons/SelectBoxInt'
export default {
  components:{
     DxDataGrid,
  DxColumn,
  DateBox,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxEditing,
  DxPaging,
  DxSearchPanel,DxFilterRow,
  DxExport,DxHeaderFilter,DxSummary,DxGroupItem,DxTotalItem,
  SelectBoxKho
  },
  data(){
    return {
      dataSource:[],
      dupplicateNcc:[],
      showEdit:false,
      makho:null,
      dskhos:[],
      dataTrave:[],
      fromDate:new Date(),
      toDate:new Date(),
      confirmTrave:false
    }
  },
  created(){
    this.toDate = new Date()
    this.fromDate = getFisrtDayOfMonth(new Date())
   this.loadDelai()
  },
  methods:{
   
    
    async loadDelai(){
     // showLoadingIos()
      const payload = {
                fromDate: formatDateISO(this.fromDate),
                toDate: formatDateISO(this.toDate)
               // cohd:this.loai.value
            }
      const data = await this.$store.dispatch('nlg/GET_BAO_CAO_NHAP_KHO',payload)
      this.dataSource = data.data
      //closeLoading()
    },
    
    chonFromDate(e){
            this.fromDate = e.value
             console.log(formatDateISO(this.fromDate))
            this.loadDelai()
        },
        chonToDate(e){
            this.toDate = e.value
          //  console.log(formatDateISO(this.toDate))
            this.loadDelai()
        },
        async update(e){
            
            const data = await this.$store.dispatch('nlg/EDIT_NHAP_KHO',e.data)
            // console.log(e)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
    //   eventChonKho(e){
    //     this.makho = e.value
    //     console.log(this.makho)
    //    this.loadDelai()
    //   }
  }
}
</script>

<style>

</style>