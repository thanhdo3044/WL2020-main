<template>
  <q-page class="q-pa-sm">
      <q-card class="my-card">
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title">
                    Báo cáo tổng hợp kế hoạch tuần
                </div>
                
                <!-- <div class="col-2" align="right">
                    <q-btn v-if="showFilter" flat color="primary" icon="search"  @click="load" />
                    <q-btn v-else flat color="primary" icon="filter_list"  @click="showFilter = true" />
                </div> -->
              </div>
              
                 <div class="row">
                   <div class="col-3 q-pa-sm"> 
             <q-select
           
            color="grey-3"
            label-color="orange"
            filled
            v-model="factory1"
            :options="options"
            label="Chọn Nhà Máy"
            @input="onChange"
            dense
          />
            </div>
             <div class="col-3 q-pa-sm">
                <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="stepId"
            :options="data1"
            label="Chọn công đoạn"
            @input="load"
            dense
          />
             </div>
                   <div class="col-3 q-pa-md">
                      <DateBox :onChange="chonFromDate" :value="fromDate" :title="'Từ ngày'"/>
                  </div>
                  <div class="col-3 q-pa-md">
                      <DateBox :onChange="chonToDate" :value="toDate" :title="'Đến ngày'"/>
                  </div>
              </div>
              <div class="row" v-show="showFilter">
                   <div class="col-12">
                       <div class="dx-fieldset">
                      <SelectNCC :showClear="true"  :dataSource ="dsNcc" :onChange="chonNcc" />
                      <!-- <SelectMonth  :defaultValue="month" :title="'Chọn tháng'" :dataSource="months" :onChange="chonMonth" />
                      <SelectYear  :defaultValue="year" :title="'Chọn năm'" :dataSource="years" :onChange="chonYear" /> -->
                      <SelectStaff :showClear="true" :displayColumn="'lastName'" :defaultValue="staff" :title="'Chọn nhân viên'" :dataSource="dsstaff" :onChange="chonStaff" />
                  </div>
                   </div>
              </div>
          </q-card-section>
          <q-separator  inset  />
          <q-card-section>
      
      <div class="row q-mt-md">
          <div class="col-12">
            <DxPivotGrid
            id="pivotgrid"
            ref="grid"
            :data-source="dataSource"
            :allow-sorting-by-summary="true"
            :allow-filtering="true"
              :show-column-totals="true"
            :show-row-totals="true"
            :show-borders="true"
            :show-column-grand-totals="true"
            :show-row-grand-totals="true"
          
             show-totals-prior="rows"
            :row-header-layout="'tree'"
            >
            <DxHeaderFilter :visible="true"/>
              <DxScrolling
      mode="virtual"
    />
            <DxFilterRow :visible="true" />
            <DxExport
            :enabled="true"
            :allow-export-selected-data="true"
            :file-name="'Chi tiết báo cáo kế hoạch'"
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
import { mapGetters,mapActions } from "vuex";
import { DxDateBox } from 'devextreme-vue';
import { formatDateISO,getFisrtDayOfMonth,formatDateVN } from '../../../ultils'
import DialogSelectMonthYear from '../../../components/commons/DialogSelectMonthYear'
import SelectNCC from '../../../components/NLG/SelectBoxNcc'
import SelectMonth from '../../../components/commons/SelectBoxInt'
import SelectYear from '../../../components/commons/SelectBoxInt'
import SelectStaff from '../../../components/commons/SelectBoxInt'
import {QSpinnerIos} from 'quasar'
export default {
    components:{
       DxPivotGrid,
       DateBox,
    DxFieldChooser,
    DxExport,
    DialogSelectMonthYear,
    SelectNCC,
    SelectMonth,
    SelectYear,
    SelectStaff
    },
    computed:{
           ...mapGetters("base", ["userInfo","dsCongDoans"]),
    },
    data(){
        return {
            showChooseDate:false,
            showFilter:false,
            showChooseMonth:false,
             dataSource:null,
             data1:[],
              stepId: null,
             options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102299,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102299,
          code: "TB",
        },
      ],
            years:[
                {name:'2019',id:2019},
                {name:'2020',id:2020},
                {name:'2021',id:2021},
                {name:'2022',id:2022},
                {name:'2023',id:2023},
            ],
            year:null,
            months:[
                {name:'Tháng 1',id:1},
                {name:'Tháng 2',id:2},
                {name:'Tháng 3',id:3},
                {name:'Tháng 4',id:4},
                {name:'Tháng 5',id:5},
                {name:'Tháng 6',id:6},
                {name:'Tháng 7',id:7},
                {name:'Tháng 8',id:8},
                {name:'Tháng 9',id:9},
                {name:'Tháng 10',id:10},
                {name:'Tháng 11',id:11},
                {name:'Tháng 12',id:12}
            ],
            fromDate:null,
            toDate:null,
            month:null,
            mancc:null,
            dsNcc:[],
            dsstaff:[],
            staff:null,
            manccId:null
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
        const today = new Date()
        const currentMonth = today.getMonth()
        const currentYear = today.getFullYear()
        this.month = currentMonth+1
        this.year = currentYear
        this.toDate = new Date()
        this.fromDate = getFisrtDayOfMonth(new Date())
        this.loadNhaCungCap()
        this.loadStaff()
      //  this.load()
    },
    methods:{
          ...mapActions("base", ["getAllDepartment"]),
        async selectMonthYear(m,y){
            this.month = m
            this.year = y
            this.$q.loading.show()
            await this.load()
            this.showChooseMonth = false
            this.$q.loading.hide()
        },
         async onChange(value) {

      let congdoan = await this.getAllDepartment()
    
      congdoan = congdoan.filter(
          (s) =>
            (s.TYPE2 === "department" || s.TYPE2 === "stock")
        )
        .map((o) => ({
          label: o.NAME,
          value: o.ID,
      
          factoryId:o.factoryId
        }));
      let data = [];
     
    
      if (value.factoryId === 102299) {
        congdoan.forEach((element) => {
          if (element.label.indexOf(`(${value.code})`) > -1) data.push(element);
        });
      } else {
        data = congdoan.filter(f=>f.factoryId == value.factoryId && f.label.indexOf(`(TH)`) > -1 )
      }
    //  this.stepId = null;
      this.data1 = data;
      
    
  },
        async load(){
          
            let payload = {
                fromDate: formatDateISO(this.fromDate),
                toDate: formatDateISO(this.toDate),
                  stepId: this.stepId.value,
                month: this.month,
                year: this.year,
                mancc:this.mancc,
                staff:this.staff
            }
            
          //  const data = await this.$store.dispatch('nlg/GET_REPORT_KE_HOACH',payload)
            const data = await this.$store.dispatch('nlg/GET_REPORT_KE_HOACH_TUAN',payload)
            this.dataSource = {
                 
                      fields: [
                  {
              caption: "ten nhóm",
              dataField: "tenCongDoan",
              area: "row",
              expanded: true,
            },
            {
              caption: "Ten Sản phẩm",
              dataField: "paren",
              area: "row",
              expanded: true,
            },
           
            {
              caption: "Chi tiết",
            
              dataField: "tenCT",
              area: "row",
             
            },
           
            {
               
              dataField: "WEEK",
              area: "column",
            },            
      
            {
               caption: "SL",
              dataField: "xuat",
             
             
              format:"###,##0.####",
               area: 'data',
              alignment: "center",
              summaryType: "sum",
           
            },
            {
              caption: "Lỗi",
              dataField: "loi",
              area: 'data',
              format:"###,##0.####",
              
              summaryType: "sum",
            },
            {
              caption: "SL thực tế",
              dataField: "SLDAT",
              area: 'data',
              format:"###,##0.####",
            
              summaryType: "sum",
            },
              {
              caption: "KL thực tế",
              dataField: "KLDAT",
              area: 'data',
              format:"###,##0.####",
              
              summaryType: "sum",
            },
        
          ],
          store: data.data,
        }
       
        },
        async loadNhaCungCap(){
            const data = await this.$store.dispatch('nlg/GET_DS_NHA_CUNG_CAP')
            this.dsNcc = data.data
        },
        async loadStaff(){
            // const data = await this.$store.dispatch('nlg/GET_DS_STAFF')
            this.dsstaff = [
                {
                id: "14T1005",
                lastName: "Đinh Công Định"
            },
            {
                id: "15T1399",
                lastName: "Bùi Văn Vinh"
            }
            ]
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
        chonNcc(e){
            this.mancc = e.value
          //  this.mancc = this.dsncc.find(n=>{return n.id===e.value}).code
            console.log(this.mancc)
        },
        chonMonth(e){
            this.month = e.value
        },
        chonYear(e){
            this.year = e.value
        },
        chonStaff(e){
            
             this.staff = e.value
          
        }
    }
}
</script>

<style>

</style>