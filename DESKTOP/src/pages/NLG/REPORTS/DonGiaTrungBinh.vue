<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          <q-card-section>
              <div class="row">
                  <div class="col-12 col-sm-6 top-title">
                      Đơn giá trung bình
                  </div>
                  <div class="col-12 col-sm-6 top-title cursor-pointer" align="right"  @click="showChooseDate=true">
              
                   Từ {{tuNgay}} đến {{denNgay}}
                </div>
              </div>
          </q-card-section>
          <q-separator spaced    />
          <q-card-section>
               <DxDataGrid
                :data-source="dataSource"
                :columns="columns"
                :show-borders="true"
                :show-column-lines="true"
                :allow-column-resizing="true"
                
            >
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Đơn giá trung bình tư ngày '+tuNgay+' đến '+denNgay"
            />
            <DxSearchPanel
                :visible="true"
                :width="340"
                placeholder="Tìm kiếm"
            />
            <DxHeaderFilter :visible="true"/>
            </DxDataGrid>
          </q-card-section>
      </q-card>
      <DialogSelectDate :selectDate="chooseDate" :showChooseDate="showChooseDate" :cancelChooseDate="cancelChooseDate" />
  </q-page>
</template>

<script>
import {DxDataGrid,DxGrouping,DxGroupPanel,DxSummary,DxGroupItem,
DxExport,DxHeaderFilter,DxScrolling,DxFilterRow,DxSearchPanel} from 'devextreme-vue/data-grid';
import { formatDateISO,getFisrtDayOfMonth,formatDateVN } from '../../../ultils'
import DialogSelectDate from '../../../components/commons/DialogSelectFromDateToDate'
import { QSpinnerIos } from 'quasar';
export default {
    components:{
        DxDataGrid,
        DxGrouping,DxGroupPanel,DxSummary,DxGroupItem,
        DxExport,
        DxHeaderFilter,DxScrolling,
        DxFilterRow,DxSearchPanel,
        DialogSelectDate
    },
    data(){
        return {
            showChooseDate:false,
            dataSource:[],
            columns:[
                 {
                    dataField:'nhom',
                    caption:'Nhóm quy cách',
                    
                    
                },
                {
                    dataField:'MANVL',
                    caption:'Mã nguyên vật liệu'
                },
                {
                    dataField:'DONGIATB',
                    caption:'Đơn giá Trung bình',
                    format:'fixedpoint',
                    dataType:'number'
                }
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
            this.$q.loading.show({
                spinner:QSpinnerIos,
                spinnerColor: 'primary',
                spinnerSize: 140,
                message: 'Đang tải dữ liệu vui lòng chờ.....',
                messageColor: 'black',
                backgroundColor: 'primary'
            })
            const payload = {
                fromDate: formatDateISO(this.fromDate),
                toDate: formatDateISO(this.toDate),
            }
            const data = await this.$store.dispatch('nlg/GET_REPORT_DON_GIA_TB',payload)
            this.dataSource = data.data
            this.$q.loading.hide()
        },
        cancelChooseDate(){
            this.showChooseDate = false
        },
        async chooseDate(f,t){
            this.fromDate = f
            this.toDate = t
            this.showChooseDate = false
            this.load()
            
        },
    }
}
</script>

<style>

</style>