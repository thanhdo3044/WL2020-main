<template>
<div>
    <q-card style="height:50%" class="q-ma-sm">
      <div class=" q-ma-sm">
         <DxChart
          id="chart"
          :data-source="dataAllDashboard.data.filter(a => a.order != null).sort((a,b) => a.total-b.total)"
          title="Chi tiết số lượng phiếu được sử dụng trên hệ thống Eoffice"
          @pointClick="onPointClick"
        >
          <DxCommonSeriesSettings
            argument-field="order"
            type="line"
          >
            <DxLabel :visible="true">
              <DxFormat
                :precision="0"
                type="fixedPoint"
              />
            </DxLabel>
          </DxCommonSeriesSettings>
          <DxSeries
            value-field="total"
            name="Tổng số lượng"
            
          />
          <DxLegend
            vertical-alignment="bottom"
            horizontal-alignment="center"
          />
          <DxExport :enabled="true"/>
        </DxChart>  
    </div>
    </q-card>
    <q-card style="height:50%" class="q-ma-sm">
      <div class=" row">
        <div class="col-12 col-sm-6 q-pr-sm" >
          <div class="row">
            <q-select 
              filled
              v-model="modelDepartment"
              use-input
              input-debounce="0"
              label="Phòng ban"
              @input-value="searchDataDepartment"
              :options="optionDepartment"
              @filter="filterFn"
              style="width: 250px;"
              behavior="menu"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select 
                class="q-ml-sm "
                filled
                v-model="dayDepartment"
                label="Thời gian"
                @input="searchDataDepartment"
                :options="optionDay"
                style="width: 250px;"
                behavior="menu"
              >
            </q-select>
          </div>
          <q-card >
              <DxPieChart
            id="pie"
            :data-source="dataAllDepartment.data"
            palette="Bright"
            :title=" modelDepartment == null ? 'Tỉ lệ phiếu được phê duyệt của  ' + departmentName.NAME : 'Tỉ lệ phiếu được phê duyệt của  ' + modelDepartment.label"
            @pointClick="onPointClick"
          >
            <DxSeries
              argument-field="order"
              value-field="total"
            >
              <DxLabel
                :visible="true"
                :customize-text="formatLabel"
                position="columns"
              >
                <DxConnector
                  :visible="true"
                  :width="0.5"
                />
                <DxFont :size="16"/>
              </DxLabel>
            </DxSeries>
            <DxLegend
              :column-count="4"
              orientation="horizontal"
              item-text-position="right"
              horizontal-alignment="center"
              vertical-alignment="bottom"
            />
            <DxExport :enabled="true"/>
          </DxPieChart>
            
        </q-card>
        </div>
        <div class="col-12 col-sm-6 ">
          <q-card class="col-12 col-sm-6">
            <q-select 
              filled
              v-model="dayNotification"
              use-input
              input-debounce="0"
              label="Thời gian"
              :options="optionDay"
               @input="searchDataNotification"
              style="width: 250px;"
              behavior="menu"
            >
            
          </q-select>
          <DxPieChart
          
            id="pie"
            :data-source="dataAllNotification.data"
            palette="Bright"
            title="Tỉ lệ thông báo được gửi qua Mail - App Eoffice"
            @pointClick="onPointClick"
          >
            <DxSeries
              argument-field="option"
              value-field="total"
            >
              <DxLabel
                :visible="true"
                :customize-text="formatLabel"
                position="columns"
              >
                <DxConnector
                  :visible="true"
                  :width="0.5"
                />
                <DxFont :size="16"/>
              </DxLabel>
            </DxSeries>
            <DxLegend
              :column-count="4"
              orientation="horizontal"
              item-text-position="right"
              horizontal-alignment="center"
              vertical-alignment="bottom"
            />
            <DxExport :enabled="true"/>
          </DxPieChart>
        </q-card>
        </div>
        
        
    </div>
    </q-card>
</div>
   
</template>

<script>
import DxPieChart, {
  DxConnector,
  DxSmallValuesGrouping,
  DxFont
} from 'devextreme-vue/pie-chart';

import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxLabel,
  DxFormat,
  DxLegend,
  DxExport
} from 'devextreme-vue/chart';
import {mapGetters, mapActions} from 'vuex';
import moment from 'moment'
export default {
    components: {
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxLabel,
    DxFormat,
    DxLegend,
    DxExport,
     DxPieChart,
    DxConnector,
    DxFont,
    DxSmallValuesGrouping,
  },
    data(){
        return {
            modelDepartment:null,
            dayNotification:null,
            dayDepartment:null,
            optionDay:[
              {
                label: 'Tất cả',
                day:670
              },
              {
                label: 'Hôm nay',
                day:1
              },
              {
                label: '1 Tuần',
                day:7
              },
              {
                label: '1 Tháng',
                day:31
              },
              {
                label: '3 Tháng',
                day:93
              },
              {
                label: '1 Năm',
                day:365
              }
            ],
            departmentName:null,
            optionDepartment:[],
            dataAllDashboard:null,
            dataAllNotification:null,
            dataAllDepartment:null
        }
    },
    computed: {
        ...mapGetters("base",["userInfo"])
    },
    methods:{
        onPointClick({ target }) {
            target.select();
            console.log('hihi',target)
        },
        formatLabel(pointInfo) {
          return `${pointInfo.valueText} (${pointInfo.percentText})`;
        },
        ...mapActions("reportDashboard",["getAllDataDashboard"]),
        ...mapActions("base",["GET_DEPARTMENTSALL","GET_DEPARTMENTSBYID"]),
        async searchDataNotification(){
          let payload ={
            option : 2,
            departmentId:102291,
            day : this.dayNotification.day
          }
          this.dataAllNotification = await this.getAllDataDashboard(payload);
        },
        async searchDataDepartment(){
          let payload ={
            option : 1,
            departmentId:this.modelDepartment == null ? this.userInfo.departmentId : this.modelDepartment.id,
            day : this.dayDepartment.day
          }
          this.dataAllDepartment = await this.getAllDataDashboard(payload);
        },
        async filterFn (val, update) {
          this.optionDepartment=[];
          this.modelDepartment=null;
          let data = await this.GET_DEPARTMENTSALL();
          console.log('data',data);
          data.forEach(e =>{
            this.optionDepartment.push({
              label:e.NAME,
              id:e.ID
            })
          })
          if (val === '') {
            update(() => {
              this.optionDepartment = this.optionDepartment
            })
            return
          }

          update(() => {
            const needle = val.toLowerCase()
            this.optionDepartment = this.optionDepartment.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
          })
        }
    },
    async created(){
        let payload ={
          option : 0,
          departmentId:102291,
          day : 365
        }
        this.dataAllDashboard = await this.getAllDataDashboard(payload);
        let payload1 ={
          option : 2,
          departmentId:102291,
          day : 365
        }
        this.dataAllNotification = await this.getAllDataDashboard(payload1);
        let payload3 ={
          option : 1,
          departmentId: this.modelDepartment == null ? this.userInfo.departmentId : this.modelDepartment.id,
          day : 365
        }
        this.dataAllDepartment = await this.getAllDataDashboard(payload3);

        let data = await this.GET_DEPARTMENTSALL();
        console.log('data',this.userInfo);
        data.forEach(e =>{
          this.optionDepartment.push({
            label:e.NAME,
            id:e.ID
          })
        })
        this.departmentName = await this.GET_DEPARTMENTSBYID(this.userInfo.departmentId)
    },
    watch: {

    }

}
</script>

<style>
.no-wrap{

}
</style>