<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          <q-card-section>
              <div class="row">
                  <div class="col-12 col-sm-6 top-title">
                      Báo cáo nhà cung cấp theo loại
                  </div>
                  <div class="col-12 col-sm-6 top-title cursor-pointer" align="right"  @click="showChooseDate=true">
              
                   Từ {{tuNgay}} đến {{denNgay}}
                </div>
              </div>
          </q-card-section>
          <q-separator spaced    />
          <q-card-section>
              <div class="row">
                  <div class="col-12 col-sm-4">
                      <q-select @input="load" v-model="loai" :options="loais" label="Loại NCC" outline />
                  </div>
                   <div class="col-3 q-pa-md">
                      <DateBox :onChange="chonFromDate" :value="fromDate" :title="'Từ ngày'"/>
                  </div>
                  <div class="col-3 q-pa-md">
                      <DateBox :onChange="chonToDate" :value="toDate" :title="'Đến ngày'"/>
                  </div>
              </div>
              <div class="row q-mt-md">
                  <div class="col-12">
                      <DxPivotGrid
            id="pivotgrid"
            ref="grid"
            :data-source="dataSource"
            :allow-sorting-by-summary="false"
            :allow-filtering="true"
            :show-borders="true"
            :show-column-grand-totals="true"
            :show-row-grand-totals="false"
            :show-column-totals="false"
            :row-header-layout="'tree'"
            >
              <DxExport
            :enabled="true"
            :allow-export-selected-data="true"
            :file-name="'Chi tiết báo cáo nhà cung cấp theo loại'"
            />
            <DxFieldChooser
                :enabled="true"
                :height="400"
            />
            </DxPivotGrid>
                  </div>
              </div>
          </q-card-section>
      </q-card>
      <DialogSelectDate :selectDate="chooseDate" :showChooseDate="showChooseDate" :cancelChooseDate="cancelChooseDate" />
  </q-page>
</template>

<script>
import {
  DxPivotGrid,
  DxFieldChooser,DxExport
} from 'devextreme-vue/pivot-grid';
import DateBox from '../../../components/commons/DateBox'
import { formatDateISO,getFisrtDayOfMonth,formatDateVN } from '../../../ultils'
import DialogSelectDate from '../../../components/commons/DialogSelectFromDateToDate'
import { QSpinnerIos } from 'quasar';
export default {
    components:{
        DateBox,
       DxPivotGrid,
        DxFieldChooser,
        DialogSelectDate,DxExport
    },
    data(){
        return {
            showChooseDate:false,
            dataSource:null,
            columns:[
                {
                    dataField:'CODE',
                    caption:'Mã nguyên vật liệu'
                },
                {
                    dataField:'DONGIATB',
                    caption:'Đơn giá Trung bình',
                    format:'fixedpoint',
                    dataType:'number'
                }
            ],
           fromDate:new Date(),
            toDate:new Date(),
            loai:null,
            loais:[
                {label:'Loại 1', value:'Y'},
                {label:'Loại 2', value:'N'}
            ]
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
        // this.toDate = new Date()
        // this.fromDate = getFisrtDayOfMonth(new Date())
        this.loai = this.loais[0]
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
                cohd:this.loai.value
            }
            const data = await this.$store.dispatch('nlg/GET_REPORT_NCC_LOAI',payload)
            this.dataSource = {
                export:{
                    enable:true,
                    fileName:'Khối lượng nhà cung cấp từ ngày'
                },
                    fields: [
                        {
                        caption: 'Tên Nhà Cung cấp',
                        dataField: 'NAME',
                        area: 'row',
                        expanded: true,
                        width:'180',
                        },
                        {
                        caption: 'Số phiếu',
                        dataField: 'SOPHIEU',
                        area: 'row',
                        width:'180',
                        expanded: true,
                        },
                        {
                            dataField:'CREATED_AT',
                            area:'column',
                            dataType:'date'
                        },
                         {
                        dataField: 'KLKHO',
                        caption:'KLKHO',
                        dataType: 'number',
                        format:'###0.####',
                        area: 'data',
                        summaryType: 'sum'
                        }
                        ],
                        store: data.data
                }
            this.$q.loading.hide()
        },
         chonFromDate(e){
            this.fromDate = e.value
            this.load()
        },
        chonToDate(e){
            this.toDate = e.value
            this.load()
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