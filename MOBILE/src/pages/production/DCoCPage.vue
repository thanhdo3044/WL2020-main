<template>
  <q-page class="q-pa-sm bg-blue-grey-7">
    <app-bar>Thông tin truy nguyên</app-bar>
    <div class="row justify-center q-ma-sm">
      <div class="col-12 col-md-6">
        <q-input dark label-color="amber" label="Ngày" filled v-model="currentDate">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="currentDate" @input="changeDate" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div v-show="loadDone" class="row justify-center">
      <div class="col-12 col-md-6">
        <q-timeline color="secondary">
      <q-timeline-entry heading>
       
      </q-timeline-entry>

      <q-timeline-entry v-for="item in data" v-bind:key="item._id"
        :title="item.itemName"
        
      >
      <div class="row">
       <div class="col-8">
          <p class="woodText">- Lệnh sản xuất : {{item.order || '?'}}</p>
        <p class="woodText">- Số lượng : {{item.quantity || '?'}}</p>
       </div>
       <div class="col-4">
         <q-btn color="primary" icon="edit" label="Sửa" @click="goEdit(item)" />
       </div>
      </div >
        <div class="row" v-show="item.info.length>0">
          <table style="width:90%">
          <tr>
            <th>STT</th>
            <th>Vật liệu</th>
            <th>Nhà cung cấp</th>
            <th>Số lô</th>
          </tr>
          <tr  v-for="(dataDLT,index2)  in item.info" v-bind:key="index2">
            <td style="text-align:center">{{index2+1}}</td>
            <td>{{dataDLT.name}}</td>
            <td>{{dataDLT.vendor}}</td>
            <td>{{dataDLT.parcel}}</td>
          </tr>
					<tr v-show="item.info.length===0">
						<td colspan="4" style="text-align:center" class="woodText text-white">Không có dữ liệu !</td>
					</tr>
        </table>
        <!-- {{item.info.length}} -->
        </div>
      </q-timeline-entry>
    </q-timeline>
      </div>
    </div>
    <div v-show="data.length===0" class="row justify-center">
      <div class="col-12 col-md-6">
        <p class="prodTextTitle text-white" style="text-align:center">
          Không có dữ liệu !
        </p>
      </div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click="goAdd" fab icon="add" color="accent" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import AppBar from "../../components/AppBar";
import { date } from 'quasar'
export default {
  components: {
    "app-bar": AppBar
  },
  data() {
    return {
      currentDate: new Date().toISOString().slice(0, 10),
      data:[],
      loadDone:false
    };
  },
  created(){
    this.initData()
    this.currentDate = date.formatDate(new Date(),'YYYY/MM/DD')
  },
  watch:{
    loadDone(val){
      if (!val) {
        this.$q.loading.show()
      }else {
        this.$q.loading.hide()
      }
    }
  },
  methods: {
    goEdit(item){
      this.$store.dispatch('production/SELECT_DCOC',item).then(val=>{
        this.$router.push('/production-edit-coc')
      })
      
    },
    changeDate(value,reason,detail){
      this.$refs.qDateProxy.hide()
      let vdate = detail.day <10 ? '0'+detail.day : detail.day
      let vmonth = detail.month < 10 ? '0'+detail.month : detail.day
      let dateFormat = detail.year+'-'+vmonth+'-'+vdate
      this.initData(dateFormat)
    },
    async initData(inputDate) {
      this.loadDone =false
      if (!inputDate) {
        inputDate=this.currentDate
      }
      let data = await this.$store.dispatch('production/GET_COC_BY_DATE',inputDate)
      this.data = data.data
      this.loadDone = true
    },
    goAdd() {
      this.$router.push("/production-add-coc");
    }
  }
};
</script>

<style scoped>
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}

</style>