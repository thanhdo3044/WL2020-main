<template>
  <q-page class="q-pa-sm">
      <q-card class="my-card">
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title">
                    {{title}}
                </div>
                 <!-- <div class="col-12 col-md-2 col-sm-4 q-pa-sm">
                    <q-input @input="loadGrid" v-model.number="week" type="number" label="Tuần" />
                </div>
                <div class="col-12 col-md-2 col-sm-4 q-pa-sm">
                    <q-input @input="loadGrid" v-model.number="year" type="number" label="Năm" />
                </div> -->
               <div class="col-2" align="right">
                   <q-btn flat color="primary"  icon="search" @click="showFilterDialog = true" />
               </div>
              </div>
          </q-card-section>
          <q-separator  inset  />
          <q-card-section>
      
      <div class="row q-mt-md">
          <div class="col-12">
            <DxPivotGrid
            v-show="showPivort"
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
            @cell-prepared="onCellPrepared"
            >
            <DxFieldChooser
                :enabled="true"
                :height="400"
            />
            <DxExport
                :enabled="true"
                :allow-export-selected-data="true"
                :file-name="title"
            />
            </DxPivotGrid>
              <DxDataGrid
              id="gridContainer"
                :data-source="dataSourceGrid"
                :show-row-lines="true"
                :show-column-lines="true"
                :show-borders="true"
                :column-auto-width="true"
                :no-data-text="'Không có dữ liệu !'"
                >
                <DxExport
                    :enabled="true"
                    :allow-export-selected-data="true"
                    :file-name="title"
                />
                <DxGroupPanel :visible="true"/>
                <DxScrolling mode="infinite"/>
                 <DxSorting mode="none"/>
                  <DxFilterPanel :visible="true"/>
                 <DxFilterRow :visible="true"/>
                 <DxHeaderFilter :visible="true"/>
                 <DxSearchPanel
                :visible="true"
                :width="240"
                placeholder="Tìm kiếm..."
              />
              <DxColumn
                    data-field="number"
                    caption="Số LSX"
                    :group-index="0"
                />
              <DxColumn
                    data-field="departmentName"
                    caption="Tổ"
                    :group-index="1"
                />
                <DxColumn
                    data-field="itemName"
                    caption="SP/Chi tiết"
                    :fixed="true"
                />
                <DxColumn
                    data-field="parentName"
                    caption="Sản phẩm"
                    :group-index="2"
                    :fixed="true"
                />
               <DxColumn
                caption="Số lượng"
                alignment="center"
                
               >
                    <DxColumn
                    data-field="Thứ 2"
                    caption="Thứ 2"
                    data-type="number"
                    format="fixedpoint"
                    width="100"
                    alignment="center"
                />
                <DxColumn
                    data-field="Thứ 3"
                    caption="Thứ 3"
                    data-type="number"
                    format="fixedpoint"
                    width="100"
                    alignment="center"
                />
                <DxColumn
                    data-field="Thứ 4"
                    caption="Thứ 4"
                    data-type="number"
                    format="fixedpoint"
                    width="100"
                    alignment="center"
                />
                <DxColumn
                    data-field="Thứ 5"
                    caption="Thứ 5"
                    data-type="number"
                    format="fixedpoint"
                    width="100"
                    alignment="center"
                />
                <DxColumn
                    data-field="Thứ 6"
                    caption="Thứ 6"
                    data-type="number"
                    format="fixedpoint"
                    width="100"
                    alignment="center"
                />
                 <DxColumn
                    data-field="Thứ 7"
                    caption="Thứ 7"
                    data-type="number"
                    format="fixedpoint"
                    width="100"
                    alignment="center"
                />

               </DxColumn>
               <DxColumn
                    data-field="volumn"
                    caption="m3"
                    data-type="number"
                    format="0.######"
                    width="100"
                    alignment="center"
                />
                <DxColumn
                caption="Khối lượng"
                alignment="center"
                :visible="showVolumnColumn"
               >
                    <DxColumn
                    data-field="thu2m"
                    caption="Thứ 2"
                    data-type="number"
                    format="#,##0.##"
                    width="100"
                    alignment="center"
                />
                <DxColumn
                    data-field="thu3m"
                    caption="Thứ 3"
                    data-type="number"
                    format="#,##0.##"
                    width="100"
                    alignment="center"
                />
                <DxColumn
                    data-field="thu4m"
                    caption="Thứ 4"
                    data-type="number"
                    format="#,##0.##"
                    width="100"
                    alignment="center"
                />
                <DxColumn
                    data-field="thu5m"
                    caption="Thứ 5"
                    data-type="number"
                    format="#,##0.##"
                    width="100"
                    alignment="center"
                />
                <DxColumn
                    data-field="thu6m"
                    caption="Thứ 6"
                    data-type="number"
                    format="#,##0.##"
                    width="100"
                    alignment="center"
                />
                 <DxColumn
                    data-field="thu7m"
                    caption="Thứ 7"
                    data-type="number"
                    format="#,##0.##"
                    width="100"
                    alignment="center"
                />

               </DxColumn>
                
                <DxColumnFixing :enabled="true" />
            </DxDataGrid>
          </div>
      </div>
          </q-card-section>
      </q-card>
      <q-dialog v-model="showFilterDialog" persistent>
          <q-card style="min-width:300px">
              <q-card-section class="row items-center">
                 <div class="col-12">
                     <h6>Tùy chỉnh tìm kiếm</h6>
                 </div>
              </q-card-section>
              <q-card-section>
                  <div class="row">
                      <div class="col-12">
                          <q-input v-model.number="week" type="number" label="Tuần" />
                      </div>
                      <div class="col-12">
                          <q-input v-model.number="year" type="number" label="Năm" />
                      </div>
                      <div class="col-12">
                          <q-toggle
                            v-model="showVolumnColumn"
                            label="Hiển thị cột khối lượng"
                        />
                      </div>
                  </div>
              </q-card-section>
              <q-card-actions align="right">
                  <q-btn flat label="Hủy" color="primary" v-close-popup />
                  <q-btn flat label="Đồng Ý" @click="loadGrid" color="primary" v-close-popup />
              </q-card-actions>
          </q-card>
      </q-dialog>
  </q-page>
</template>

<script>
import {
  DxChart,
  DxAdaptiveLayout,
  DxCommonSeriesSettings,
  DxSize,
  DxTooltip,
  
} from 'devextreme-vue/chart';
import { DxDateBox } from 'devextreme-vue';
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
  DxRequiredRule,
  DxScrolling,
  DxSearchPanel,
  DxSelection,
  DxColumnFixing ,
  DxSorting,
  DxGroupPanel,
  DxFilterRow,
  DxFilterPanel,
  DxHeaderFilter
} from "devextreme-vue/data-grid";
import { formatDateISO,getFisrtDayOfMonth,formatDateVN, getWeekNumber, showLoadingIos, closeLoading } from '../../../ultils'
import {
  DxPivotGrid,
  DxFieldChooser,
  DxExport
} from 'devextreme-vue/pivot-grid';
export default {
    components:{
        DxHeaderFilter,
         DxChart,
  DxAdaptiveLayout,
  DxCommonSeriesSettings,
  DxSize,
  DxFilterPanel,
  DxTooltip,
  DxPivotGrid,
  DxFieldChooser,
  DxExport,
  DxFilterRow,
  DxSorting,
  DxGroupPanel,
   DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
  DxRequiredRule,
  DxScrolling,
  DxSearchPanel,
  DxSelection,
  DxColumnFixing 
    },
    computed:{
        pivortGrid:function(){
            return this.$refs.grid.instance;
        }
    },
    data(){
        return {
            showChooseMonth:false,
            dataSource:null,
            year:null,
            month:null,
            week:'',
            departments:[],
            department:null,
            title:'Báo cáo sản lượng tuần',
            countData:0,
            dataSourceGrid:[],
            showPivort:false,
            showFilterDialog:false,
            showVolumnColumn:true
        }
    },
    created(){
        const today = new Date()
        const currentMonth = today.getMonth()
        this.month = currentMonth
        const currentYear = today.getFullYear()
        this.year = currentYear
        //this.load()
        this.week = getWeekNumber(today)
        // this.loadDepartments()
        this.loadGrid()
    },
    methods:{
        calculateTyLe(rowData){
            if (parseFloat(rowData.tongSanLuong)>0&&parseFloat(rowData.po)>0) {
                const tyle = rowData.tongSanLuong/rowData.po
                return tyle
            }
        },
        exportToExcel(){
            // this.pivortGrid.exportToExcel()
        },
        async loadDepartments(){
            const myFactoryId = this.$route.query.factoryId
            const payload ={
                factoryId:myFactoryId
            }
            if (myFactoryId) {
                const data = await this.$store.dispatch('base/GET_DEPARTMENTS',payload)
                
                // this.departments = data.data
                data.data.forEach(element => {
                    if (element.type==='Tổ') {
                        this.departments.push({
                            value:element.id,
                            label:element.name
                        })
                    }
                })
                if (this.departments.length>0) {
                    this.department=this.departments[0]
                }
            }
        },
        async selectMonthYear(m,y){
            this.month = m
            this.year = y
            this.$q.loading.show()
            await this.load()
            this.showChooseMonth = false
            this.$q.loading.hide()
        },
        onCellPrepared: function(e) { 
            
            if (e.cell.type==='GT'&&e.cell.text==='Grand Total') {
                // e.cell.text='Tổng'
                // return 'Tổng'
                // e.cellElement.find("span").text('Tổng')
                // e.cellElement.text('Tổng')
                // e.cell.text="Tổng"
                // e.cellElement=`<td style="border-right:0px;border-bottom-width:0px" class="dx-row-total dx-grandtotal"><span>Tổng</span></td>`
                // e.cell.isLast = false
                // console.log(e)
                e.cellElement.innerText='Tổng'
            } 
            // console.log(e.cell)
            // if (e.area == "data" && e.cell.rowType == "GT" && e.cell.columnPath.length) {  
            //     var quarter = e.cell.columnPath.length > 1 ?  
            //                 "+Q"+e.cell.columnPath[1].toString() : "";  
            //     e.cellElement.find("span")  
            //     .text("Drilldown:"+e.cell.columnPath[0].toString() + quarter);  
            // }  
        },
        async loadGrid(){
            const myFactoryId = this.$route.query.factoryId
            const payload = {
                week: this.week,
                year: this.year,
                factoryId: myFactoryId
            }
            this.title = `Báo cáo sản lượng tuần ${this.week} - ${this.year}`
            showLoadingIos()
            let dataPivort = []
            const data = await this.$store.dispatch('prod/GET_REPORT_WEEK',payload)
            let dataConvert  = []
            data.data.forEach(element => {
                if (element['Thứ 2'] > 0) {
                    element.thu2m = Number.isNaN(element['Thứ 2']*element.volumn) ? 0 : element['Thứ 2']*element.volumn
                }else {
                    element['Thứ 2'] = null
                }
                if (element['Thứ 3'] > 0) {
                    element.thu3m = Number.isNaN(element['Thứ 3']*element.volumn) ? 0 : element['Thứ 3']*element.volumn
                }else {
                    element['Thứ 3'] = null
                }
                if (element['Thứ 4']>0) {
                    element.thu4m = Number.isNaN(element['Thứ 4']*element.volumn) ? 0 : element['Thứ 4']*element.volumn
                }else {
                    element['Thứ 4'] = null
                }
                if (element['Thứ 5']>0) {
                    element.thu5m = Number.isNaN(element['Thứ 5']*element.volumn) ? 0 : parseFloat(element['Thứ 5'])*parseFloat(element.volumn)
                }else {
                    element['Thứ 5'] = null
                }
                if (element['Thứ 6']>0) {
                    element.thu6m = Number.isNaN(element['Thứ 6']*element.volumn) ? 0 : element['Thứ 6']*element.volumn
                }else {
                    element['Thứ 6'] = null
                }
                if (element['Thứ 7']>0) {
                    element.thu7m = Number.isNaN(element['Thứ 7']*element.volumn) ? 0 : element['Thứ 7']*element.volumn
                }else {
                    element['Thứ 7'] = null
                }
                if (element['po']<=0) {
                    element.po=null
                }
                if (element.tongSanLuong<=0) {
                    element.tongSanLuong = null
                }
                if (element.tyleDatKH<=0) {
                    element.tyleDatKH=null
                }
                dataConvert.push(element)
                
            })
            this.dataSourceGrid = dataConvert
            closeLoading()
        }
    }
}
</script>

<style scoped>
#gridContainer {
    height: 600px;
}
</style>