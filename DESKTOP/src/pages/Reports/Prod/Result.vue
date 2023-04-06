<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          <q-card-section>
              <div class="row">
                    <div class="col-12 top-title">
                        Kết quả sản xuất
                    </div>         
                </div>
          </q-card-section>
          <q-card-section>
              <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="mails" label="Theo ngày" />
          <q-tab name="alarms" label="Theo Tháng" />
          <q-tab name="movies" label="Theo Lệnh sản xuất" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="mails">
            <div class="text-h6 row">
                <div class="col-8">
                    Dữ liệu thông kê sản xuất theo ngày
                </div>
                <div class="col-4">
                   <div class="fake-link" @click="showChooseDate = true">{{dateReport}}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <DxPivotGrid
                        id="pivotgrid"
                        ref="grid"
                        :data-source="dataSourceReportByDate"
                        :allow-sorting-by-summary="true"
                        :allow-filtering="true"
                        :show-borders="true"
                        :show-column-grand-totals="false"
                        :show-row-grand-totals="false"
                        :show-row-totals="false"
                        :show-column-totals="false"
                        >
                         <DxHeaderFilter
                            :allow-search="true"
                            :show-relevant-values="true"
                            :width="300"
                            :height="400"
                        />
                        <DxFieldChooser
                            :enabled="true"
                            :height="400"
                        />
                    </DxPivotGrid>
                </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <div class="text-h6">Alarms</div>
            
          </q-tab-panel>

          <q-tab-panel name="movies">
            <div class="text-h6">Thống kê sản lượng theo lệnh sản xuất</div>
            <ReportByProdOrder />
          </q-tab-panel>
        </q-tab-panels>
          </q-card-section>
      </q-card>
      <q-dialog v-model="showChooseDate" persistent>
          <q-card>
             <q-card-section>
                 <h5>Chọn ngày</h5>
                 <q-date
                        v-model="dateReport"
                        minimal
                    />
             </q-card-section>
             <q-card-actions  align="right">
                 <q-btn flat label="Đồng ý" @click="showChooseDate=false" />
             </q-card-actions>
          </q-card>
      </q-dialog>
  </q-page>
</template>

<script>
import {rawKQSX}  from '../../../ultils/fake'
import { date } from 'quasar'
import {
  DxPivotGrid,
  DxFieldChooser,DxHeaderFilter
} from 'devextreme-vue/pivot-grid';
  import ReportByProdOrder from '../../../components/Prod/Result/ProdOrder'
export default {
    components:{
        DxPivotGrid,
        DxFieldChooser,
        DxHeaderFilter,
        ReportByProdOrder
    },
    data(){
        return {
            tab:'mails',
            rawKQSX,
            dateReport: '2019/02/01',
            showChooseDate: false,
            dataSourceReportByDate:{
                fields: [{
                caption: 'Sản phẩm',
                width: 120,
                dataField: 'Chi tiết/cụm',
                area: 'row',
                sortBySummaryField: 'Total',
                }, {
                dataField: 'Tổ',
                dataType: 'Tổ',
                area: 'column',
                }, {
                caption: 'Số lượng',
                dataField: 'Số lượng',
                dataType: 'number',
                summaryType: 'sum',
                format: '0.00#',
                area: 'data'
                }],
                store: rawKQSX
            }
        }
    },
    created(){
        let timeStamp = Date.now()
        let formattedString = date.formatDate(timeStamp, 'YYYY/MM/DD')
        this.dateReport = formattedString
    }
}
</script>

<style>

</style>