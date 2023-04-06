<template>
    <div>
        <div class="row">
            <div class="col-4 q-ma-sm">
                <q-select v-model="year" :options="years" label="Năm" filled />
            </div>
            <div class="col-4 q-ma-sm">
               <q-select v-model="month" :options="months" label="Tháng" filled />
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <DxPivotGrid
                id="pivotgrid"
                ref="grid"
                :data-source="dataSource"
                :allow-sorting-by-summary="true"
                :allow-filtering="true"
                :show-borders="true"
                :show-column-grand-totals="false"
                :show-row-grand-totals="true"
                :show-row-totals="false"
                :show-column-totals="false"
                :allow-expand-all="true"
                show-totals-prior="rows"
                row-header-layout="tree"
                >
                    <DxHeaderFilter
                    :allow-search="true"
                    :show-relevant-values="true"
                    :width="300"
                    :height="400"
                />
                <DxFieldPanel
                        :visible="true"
                    />
                <DxFieldChooser
                    :enabled="true"
                    :height="400"
                />
        </DxPivotGrid>
            </div>
        </div>
    </div>
</template>

<script>
import {
  DxPivotGrid,
  DxFieldChooser,DxHeaderFilter,DxFieldPanel
} from 'devextreme-vue/pivot-grid';
export default {
    components:{
        DxPivotGrid,
        DxFieldChooser,
        DxHeaderFilter,
        DxFieldPanel
    },
    data(){
        return {
            dataSource:{},
            years:[
                {value:2020, label:'2020'},
                {value:2021, label:'2021'},
                {value:2022, label:'2022'},
                {value:2023, label:'2023'},
                {value:2024, label:'2024'},
                {value:2025, label:'2025'},
            ],
            year:null,
            month:null,
            months:[
                {value:1,label:'Tháng 1'},
                {value:2,label:'Tháng 2'},
                {value:3,label:'Tháng 3'},
                {value:4,label:'Tháng 4'},
                {value:5,label:'Tháng 5'},
                {value:6,label:'Tháng 6'},
                {value:7,label:'Tháng 7'},
                {value:8,label:'Tháng 8'},
                {value:9,label:'Tháng 9'},
                {value:10,label:'Tháng 10'},
                {value:11,label:'Tháng 11'},
                {value:12,label:'Tháng 12'},
            ],
            rawData:[]
        }
    },
    created(){
        const currentYear = new Date().getFullYear()
        const yearIndex = this.years.findIndex(y=>{return y.value === currentYear})
        this.year = this.years[yearIndex]

        const currentMonth = new Date().getMonth()
        const monthIndex = this.months.findIndex(m=>{return m.value === parseInt(currentMonth+1)})
        this.month = this.months[monthIndex]
        
        this.load(this.month.value,this.year.value)
    },
    methods :{
        async load(month,year){
            let paylaod = {
                year:year,
                month: month
            }
            let data = await this.$store.dispatch('report/PROD_RESULT_BY_PROD_ORDER',paylaod)
            this.dataSource = {
                fields: [{
                caption: 'Lệnh SX',
                width: 120,
                dataField: 'LSX',
                area: 'row',
                sortBySummaryField: 'Total',
                expanded: true
                },{
                caption: 'Sản phẩm',
                width: 120,
                dataField: 'Sản phẩm',
                area: 'row',
                sortBySummaryField: 'Total',
                }, {
                dataField: 'Nhóm',
                dataType: 'Nhóm',
                area: 'column',
                },{
                caption: 'Số lượng(tấm)',
                dataField: 'Số lượng',
                dataType: 'number',
                summaryType: 'sum',
                format: '0.00#',
                area: 'data'
                },{
                dataField: 'Nhà máy',
                area: 'filter',
            },],
                store: data.data
            }
        }
    }
}
</script>

<style>

</style>