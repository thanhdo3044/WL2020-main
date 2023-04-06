<template>
  <q-page class="q-pa-md bg-blue-grey-7">
      <app-bar> Danh sách mẻ sấy </app-bar>
      <div class="row q-mt-md justify-center">
        <div class="col-12 q-pa-sm">
        <q-input dark label-color="amber" outlined v-model="searchQuery" type="text" label="Tìm kiếm" />
      </div>
        <div class="col-12 col-md-3 q-ma-sm" v-for="batch in dataReceiptFilter" :key="batch.id">
          <card-batch style="margin-top:10px" :batch="batch">
            <div slot="action">
              <!-- <q-btn outline style="color: goldenrod;" label="Vào lò" v-show="showButtonInKiln" />
              <q-btn outline style="color: goldenrod;" label="Ra lò" v-show="showButtonOutKiln" /> -->
              <q-btn @click="view(batch)" outline style="color: orange;" label="Xem chi tiết"  />
            </div>
          </card-batch>
        </div>
      </div>
      <q-page-sticky v-if="showButtonCreate" position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" @click="addPlan" color="primary" />
          </q-page-sticky>
      <q-inner-loading :showing="showLoading">
        <q-spinner-gears size="150px" color="primary" />
      </q-inner-loading>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AppBar from '../../components/AppBar'
import CardBatch from '../../components/prod/CardBatch'
import { types,feature } from "../../configs/constants"
export default {
  components:{
    'app-bar':AppBar,
    'card-batch':CardBatch
  },
    computed: {
    ...mapGetters("base", ["myDepartments","userInfo"]),
     dataReceiptFilter() {
      if (this.searchQuery)
        return this.batchs.filter(d => {
          const matchString = d.kilnName ;
          return matchString
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        });
      return this.batchs;
    }
      },
  data() {
    return {
      data:'',
      batchs:[],
       searchQuery: "",
      showLoading: true,
      showButtonCreate:false,
      typeScreen:''
    }
  },
  created() {
    this.initData()
    
    let factoryId = this.userInfo.factoryId
    //this.$subcriberTopic(factoryId+'-LOSAY')
  },
  methods:{
    initData(){
      const typeScreen = this.$route.query.type
       let queryGetBatch = ''
       this.typeScreen = typeScreen
      switch (typeScreen) {
        case 'ls': // xưởng sản xuất
          queryGetBatch = ''
          break;
        case 'kh':
          this.showButtonCreate = true
          break;
        case 'vl' : case 'cd':// xe nâng va cơ điện
          queryGetBatch = '?status=created'
          break;
        case 'dg':// QC đánh giá mẻ sấy
          queryGetBatch = '?status=process'
          break;
        default:
          break;
      }
      let payload = {
        queryGetBatch:queryGetBatch,
        factoryId:this.userInfo.factoryId ==100004? 100003:this.userInfo.factoryId
      }
      this.$store.dispatch('production/ACTION_GET_BATCH',payload).then(res=>{
       this.batchs = this.$store.state.production.batchs
      console.log('lò sấy:',this.batchs)
        this.showLoading = false
      })
    },
    view(batch){
      this.$store.dispatch('production/ACTION_SELECT_BATCH',batch)
      let nextPathDetail = '/production-detail-batch?type='+this.typeScreen
      this.$router.push(nextPathDetail)
    },
    addPlan(){
      this.$router.push('/production-add-plan-batch')
    }
  }
}
</script>

<style>

</style>