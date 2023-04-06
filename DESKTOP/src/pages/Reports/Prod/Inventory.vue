<template>
   <q-page class="q-ma-sm">
        <q-card class="my-card">
        <q-card-section>
            <div class="row">
                <div class="col-8 top-title">
                    Tồn từng công đoạn
                </div>
                <div class="col-4">
                    <q-select v-model="unit" @input="changeUnit" :options="units" label="Xem theo"  />
                </div>
            </div>
        </q-card-section>
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
            :file-name="'Báo cáo tồn các công đoạn'"
            />
            <DxSearchPanel
                :visible="true"
                :width="340"
                placeholder="Tìm kiếm"
            />
            <DxHeaderFilter :visible="true"/>
            <DxFilterRow :visible="false"/>

            <DxGroupPanel :visible="true"/>
            <DxGrouping :auto-expand-all="false"/>
            <DxSummary v-if="unit==='Số lượng(t)'">
                <DxGroupItem
                    column="Tồn"
                    :show-in-group-footer="false"
                    :align-by-column="true"
                    summary-type="sum"
                    :display-format="'{0}'"
                    :value-format="'fixedpoint'"
                />
                <DxGroupItem
                    column="Xuất"
                    summary-type="sum"
                    :show-in-group-footer="false"
                    :align-by-column="true"
                    :display-format="'{0}'"
                    :value-format="'fixedpoint'"
                />
                <DxGroupItem
                    column="Nhập"
                    summary-type="sum"
                    :show-in-group-footer="false"
                    :align-by-column="true"
                    :display-format="'{0}'"
                    :value-format="'fixedpoint'"
                />
            </DxSummary>
            <DxSummary v-else>
                <DxGroupItem
                    column="Tồn m3"
                    :show-in-group-footer="false"
                    :align-by-column="true"
                    summary-type="sum"
                    :display-format="'{0}'"
                    :value-format="'######.####'"
                />
                <DxGroupItem
                    column="Xuất m3"
                    summary-type="sum"
                    :show-in-group-footer="false"
                    :align-by-column="true"
                    :display-format="'{0}'"
                    :value-format="'######.####'"
                />
                <DxGroupItem
                    column="Nhập m3"
                    summary-type="sum"
                    :show-in-group-footer="false"
                    :align-by-column="true"
                    :display-format="'{0}'"
                    :value-format="'######.####'"
                />
            </DxSummary>
            </DxDataGrid>
        </q-card-section>
    </q-card>
   </q-page>
</template>

<script>
import {DxDataGrid,DxGrouping,DxGroupPanel,DxSummary,DxGroupItem,
DxExport,DxHeaderFilter,DxScrolling,DxFilterRow,DxSearchPanel} from 'devextreme-vue/data-grid';
export default {
    components:{
        DxDataGrid,
        DxGrouping,DxGroupPanel,DxSummary,DxGroupItem,
        DxExport,
        DxHeaderFilter,DxScrolling,
        DxFilterRow,DxSearchPanel
    },
    data(){
        return {
            units:['Số lượng(t)','Khối lượng (m³)'],
            unit:'Số lượng(t)',
            departments:[],
            format:'fixepoint',
            dataSource:[

            ],
            columns:[
                {
                    dataField:'Nhà máy',
                    caption:'Nhà máy',
                    groupIndex:0
                },
                {
                    dataField:'Kho/Xưởng',
                    caption:'Kho/Xưởng',
                    groupIndex:1,
                    sortOrder:"desc"
                },
                {
                    dataField:'Tổ',
                    caption:'Tổ',
                    groupIndex:2
                },
                {
                    dataField:'Nhóm',
                    caption:'Nhóm',
                    groupIndex:3
                },
                {
                    dataField:'Sản phẩm',
                    caption:'Sản phẩm'
                },
                {
                    dataField:'Tồn đầu kỳ',
                    format:'fixedPoint',
                    dataType:'number'
                },
                {
                    dataField:'Nhập',
                    format:'fixedPoint',
                    dataType:'number'
                },
                {
                    dataField:'Xuất',
                    format:'fixedPoint',
                    dataType:'number'
                },
                {
                    dataField:'Tồn',
                    format:'fixedPoint',
                    dataType:'number'
                }
            ],
            department: null
        }
    },
    created(){
        // this.loadDepartment()
        const myFactoryId = this.$route.query.factoryId
        this.loadGrid(myFactoryId)
    },
    beforeRouteUpdate(to, from, next){
        const newQuery = to.query.factoryId
        const currentFactoryId = this.$route.query.factoryId
        if (newQuery!==currentFactoryId) {
            this.loadGrid(newQuery).then(()=>{
                next()
            })
        }
        next()
    },
    methods:{
        changeUnit(val){
            if (val==='Khối lượng (m³)') {
                this.columns = [
                    {
                        dataField:'Kho/Xưởng',
                        caption:'Kho/Xưởng',
                        groupIndex:0
                    },
                    {
                        dataField:'Tổ',
                        caption:'Tổ',
                        groupIndex:1
                    },
                    {
                        dataField:'Nhóm',
                        caption:'Nhóm',
                        groupIndex:2
                    },
                    {
                        dataField:'Sản phẩm',
                        caption:'Sản phẩm'
                    },
                    {
                        dataField:'Tồn đầu kỳ m3',
                        format:'####0.####',
                        dataType:'number'
                    },
                    {
                        dataField:'Nhập m3',
                        format:'####0.####',
                        dataType:'number'
                    },
                    {
                        dataField:'Xuất m3',
                        format:'####.####',
                        dataType:'number'
                    },
                    {
                        dataField:'Tồn m3',
                        format:'####0.####',
                        dataType:'number'
                    }
                ]
            }else{
                this.columns =[
                {
                    dataField:'Kho/Xưởng',
                    caption:'Kho/Xưởng',
                    groupIndex:0
                },
                {
                    dataField:'Tổ',
                    caption:'Tổ',
                    groupIndex:1
                },
                {
                    dataField:'Chi tiết/cụm',
                    caption:'Sản phẩm'
                },
                {
                    dataField:'Tồn đầu kỳ',
                    format:'fixedPoint',
                    dataType:'number'
                },
                {
                    dataField:'Nhập',
                    format:'fixedPoint',
                    dataType:'number'
                },
                {
                    dataField:'Xuất',
                    format:'fixedPoint',
                    dataType:'number'
                },
                {
                    dataField:'Tồn',
                    format:'fixedPoint',
                    dataType:'number'
                }
            ]
            }
        },
        async loadGrid(myFactoryId){
            if (myFactoryId) {
                const payload = {
                    factoryId:myFactoryId
                }
                const data = await this.$store.dispatch('prod/GET_REPORT_INVENTORY',payload)
                this.dataSource = data.data
            }
        }
    }
}
</script>

<style>

</style>