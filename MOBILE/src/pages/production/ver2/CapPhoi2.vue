<template>
  <q-page class="q-pa-md">
      <div class="row justify-center">
          <div class="col-12 q-pa-sm">
              <q-select v-model="congdoan" @input="chonCongdoan" :options="congdoans" label="Tổ"  />
          </div>
          <div class="col-6 q-pa-sm">
              <q-input v-model.number="week" @input="loadNumberAndLoadData" type="number" label="Tuần" />
          </div>
          <div class="col-6 q-pa-sm">
              <q-input v-model.number="year"  @input="loadNumberAndLoadData" type="number" label="Tuần" />
          </div>
          <div class="col-12 q-pa-sm">
              <q-select v-model="lsx" @input="chonLenhSX" :options="dataNumbers" label="Số Lệnh :"  />
          </div>
           <div class="col-12 border q-mt-sm">
              <q-option-group
                v-model="status"
                :options="options"
                color="primary"
                @input="changeStatus"
                inline
                />
          </div>
          <div class="col-10 q-pa-sm">
              <q-input outlined clearable v-model="searchQuery" type="text" label="Tìm kiếm"/>
          </div>
          <div class="col-2 q-pa-sm" align="right">
              <q-btn color="primary" glossy class="full-height" @click="fliterOptions" icon="search"/>
          </div>
      </div>
      <div class="row justify-center q-mt-md" v-if="dataPlan.length>0">
          <div class="col-12 col-md-5 q-pa-sm q-ma-sm" v-for="(item,index) in dataPlan" v-bind:key="index">
              <q-card class="my-card">
                  <q-card-section>
                      <div class="san-luong-title">[{{item.itemCode}}] - {{item.itemName}} ({{item.itemHeight}}*{{item.itemWidth}}*{{item.itemLength}})</div>
                      <div class="text-subtitle2"> LSX : {{item.number}} <span style="color:green">{{item.root}}</span> </div>
                  </q-card-section>
                  <q-card-section>
                      <span class="san-luong ">Kế hoạch tuần  : {{format(round(item.target+item.ton,0))}}</span>
                      <br>
                       <span class="san-luong ">Tồn tại tổ  : {{format(round(item.tonDauKy,0))}}</span>
                      <br>
                      <span class="san-luong-require">Còn phải thực hiện  : {{format(round(item.target,0))}}</span>
                      <br>
                      <span class="san-luong">Thực hiện hôm nay  : {{item.quantityByDay || 0}}</span>
                      <br>
                      <span class="san-luong">Thực hiện trong tuần : {{format(round(item.totalQuantity,0))}}</span>
                      <br>
                      <span class="san-luong">Tỷ lệ đạt kế hoạch : {{round(item.totalQuantity/(item.target+item.ton)*100,2)}} %</span>
                  </q-card-section>
                  <q-card-actions vertical align="right">
                      <q-btn @click="goDetail(item.code)" icon-right="keyboard_arrow_right" flat  color="primary" label="Cấp phôi" />
                  </q-card-actions>
              </q-card>
          </div>
      </div>
      <div class="row q-mt-md" v-else>
          <div class="col-12">
              <div class="page-title">
                  Không có dữ liệu !
              </div>
          </div>
      </div>
      <q-dialog v-model="showDialog" persistent>
          <q-card>
              <q-card-section class="row items-center">
                  <div class="col-12">
                      Nhập số lượng phôi cấp cho kế hoạch {{currentPO}}
                  </div>
              </q-card-section>
              <q-card-section>
                  <q-select v-model="des" :options="dess" clearable label="Nguồn gốc Phôi"  />
              </q-card-section>
              <q-card-section>
                 <q-input v-model.number="soluong" type="number"  />
              </q-card-section>
              <q-card-actions align="right">
                  <q-btn flat label="Hủy" color="primary" v-close-popup />
                  <q-btn flat label="Đồng Ý" @click="capPhoi" color="primary" v-close-popup />
              </q-card-actions>
          </q-card>
      </q-dialog>
    <q-page-scroller position="bottom-left" :scroll-offset="150" :offset="[18, 18]">
        <q-btn fab icon="keyboard_arrow_up" glossy color="primary" />
    </q-page-scroller>
  </q-page>
</template>

<script>
import {getWeekNumber, formatNumber, roundNumber, showLoadingIos, closeLoading, showNotifyValidate, showNotifySuccess, showNotifyError } 
from '../../../utils/utils'
export default {
    data(){
        return {
            dataPlan:[],
            congdoan:null,
            congdoans:[],
            week:null,
            year:null,
            dautuan:'',
            todayThu:'',
            status:null,
            options:[
                {label: 'Tất cả',value: 'all'},
                {label: 'Hoàn thành',value: 'completed'},
                {label: 'Chưa hoàn thành',value: 'pending'},
                
            ],
            dupplicate:[],
            searchQuery:'',
            dataNumbers:[],
            lsx:null,
            currentPO:'',
            soluong:'',
            des:null,
            dess:[],
            showDialog:false
        }
    },
    created(){
        
        this.$store.getters['base/mySources'].forEach(element => {
            this.congdoans.push({
                value:element.id,
                label:element.name
            })
        });
        const currentStepId = this.$route.query.stepId
        const currentYearRouter = this.$route.query.year
        const currentWeekRouter = this.$route.query.week
        const currentSearch = this.$route.query.search_query
        const statusOption = this.$route.query.status
        if (currentSearch) {
            this.searchQuery = currentSearch
        }
        this.status = 'pending'
        if (currentStepId&&currentYearRouter&&currentWeekRouter) {
            this.year = currentYearRouter
            this.week = currentWeekRouter
            const cIndex =  this.congdoans.findIndex(c=>{return c.value===parseInt(currentStepId)})
            if (cIndex>-1) {
                this.congdoan = this.congdoans[cIndex]
            }
        }else{
            const today = new Date()
            const currentYear = today.getFullYear()
            this.year = currentYear
            //this.load()
            this.week = getWeekNumber(today)
            this.dautuan = this.year.toString().substring(2,4)+''+this.week
            // this.todayThu = this.getThuHienTai(today)
            if (this.congdoans.length>0) {
                this.congdoan= this.congdoans[0]
            }
        }
        if (this.congdoan&&this.week&&this.year) {
            this.loadNumberAndLoadData()
        }
        this.$store.getters['base/mySources'].forEach(element => {
            this.dess.push({
                value:element.id,
                label:element.name
            })
        });
    },
    watch:{
        status(val){
            // this.$router.replace({path:this.$route.fullPath,})
            //this.filterStatus(val)
        }
    },
    methods:{
      async capPhoi(){
            // console.log(this.currentPO.toString().substring(0,2))
            if (parseFloat(this.soluong)>0) {
                const payload = {
                    code:this.currentPO,
                    quantity:this.soluong,
                    source:this.des ? this.des.value : this.des
                }
                const data = await this.$store.dispatch('production/CAP_PHOI',payload)
                if (data.meta.success) {
                    showNotifySuccess()
                    this.load()
                }else{
                    showNotifyError()
                }
            }else{
                showNotifyValidate()
            }
        },
        chonCongdoan(val){
            this.load()
        },
        goDetail(po){
            this.currentPO = po
            this.showDialog = true
            // this.$router.push({name:'confirm-po',params:{code:po}})
        },
        async loadNumber(){
            this.lsx = null
            this.dataNumbers=[]
            const payload = {
                year: this.year,
                week: this.week
            }
            const data = await this.$store.dispatch('production/GET_NUMBER_PO',payload)
            data.data.forEach(element => {
                this.dataNumbers.push({
                    label: 'LSX '+ element.number,
                    value:element.number
                })
            });
            if (this.dataNumbers.length>0) {
                this.lsx= this.dataNumbers[0]
            }
        },
        chonLenhSX(val){
            this.load()
            // this.fliterOptions()
        },
        loadNumberAndLoadData(){
            this.loadNumber().then(val=>{
                Promise.all([this.load()]).then(v=>{
                    this.fliterOptions()
                })
            })
        },
        fliterOptions(){
            let dataFilter  = this.dupplicate
            let querStringReplace = {
                path:this.$route.fullPath,
                query: {
                    week:this.week,
                    year:this.year,
                    stepId:this.congdoan.value
                }
            }
            //path:this.$route.fullPath,query:{stepId:this.congdoan.value,year:this.year,week:this.week,search_query:this.searchQuery}
            console.log(this.status)
            if (this.status!==null) {
                querStringReplace.query.status = this.status
                switch (this.status) {
                    case 'all':
                        dataFilter = dataFilter
                        break;
                    case 'completed':
                        dataFilter = dataFilter.filter(d=>{return d.status==='Hoàn thành'})
                        break;
                    default:
                        dataFilter = dataFilter.filter(d=>{return d.status==='Đang sản xuất'})
                        break;
                }
            }
            if (this.searchQuery) {
                // this.
                querStringReplace.query.search_query =  this.searchQuery
                dataFilter = dataFilter.filter(d=>{
                    const matchString = d.itemCode.toString().toLowerCase()+' '+d.itemName.toString().toLowerCase()+' '+d.itemHeight+' '+d.itemWidth+' '+d.itemLength +' '+d.code
                    d.match = matchString
                    const matchs = d.match.includes(this.searchQuery.toString().toLowerCase())
                    return matchs
                })
            }
            this.$router.replace(querStringReplace)
            this.dataPlan = dataFilter
        },
        filterStatus(val){
            this.fliterOptions()
            // switch (val) {
            //     case 'all':
            //         this.dataPlan = this.dupplicate
            //         break;
            //     case 'completed':
            //         this.dataPlan = this.dupplicate.filter(d=>{return d.status==='Hoàn thành'})
            //         break;
            //     default:
            //         this.dataPlan = this.dupplicate.filter(d=>{return d.status==='Đang sản xuất'})
            //         break;
            // }
        },
        chonCongdoan(val){
            this.loadNumberAndLoadData()
        },
        format(num){
            return formatNumber(num)
        },
        round(num,digits){
            return roundNumber(num,digits)
        },
        changeStatus(val){
            this.fliterOptions()
        },
        async load(){
            if (this.lsx) {
                showLoadingIos()
                const payload ={
                    stepId:this.congdoan.value,
                    year:this.year,
                    week:this.week,
                    number:this.lsx.value
                }
                this.$router.replace({path:this.$route.fullPath,query:{stepId:this.congdoan.value,year:this.year,week:this.week,status:this.status}})
                const data = await this.$store.dispatch('production/GET_LIST_SAN_LUONG',payload)
                this.dataPlan = data.data
                this.dataPlan.forEach(element => {
                    if (element.totalQuantity === null) {
                        element.totalQuantity =0
                    }
                    if (element.quantityByDay ===null) {
                        element.quantityByDay = 0
                    }
                });
                this.dupplicate = this.dataPlan
                closeLoading()
            }
        }
    }
}
</script>

<style>
.san-luong {
    font-size: 24px;
    font-family: 'Times New Roman', Times, serif;
}
.san-luong-title {
    color:chocolate ;
    font-size: 24px;
    font-weight: 800;
    font-family: 'Times New Roman', Times, serif;
}
.san-luong-require {
    color:green ;
    font-size: 24px;
    font-weight: 800;
    font-family: 'Times New Roman', Times, serif;
}
.san-luong-title:hover {
    color: blue;
    cursor: pointer;
}
</style>