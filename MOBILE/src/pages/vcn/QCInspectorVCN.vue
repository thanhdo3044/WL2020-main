<template>
  <q-page class="q-pa-md bg-blue-grey-7">
    <app-bar>Xử lý sản phẩm lỗi</app-bar>
    <div class="row q-mt-md justify-center" v-if="showSearchModel1 == true">
      <div class="col-12 col-sm-6 col-md-3 col-lg-3 q-ma-sm" v-for="(item,index) in inventorys" :key="index">
        <q-card class="bg-blue-grey-7" style="border: 2px solid white">
          <q-card-section>
            <div class="prodTextTitle text-white" style="text-align:center">
              Qui cách : {{item.item.height+' '+item.item.width+' '+item.item.length}} 
              <p style="color:orange">Số lượng : {{item.remain}} {{item.item.unit}} <br>{{item.item.name}}</p>
            </div>
            <p class="prodTextTitle"><span class="text-amber">Từ: </span> <span class="text-white">{{item.from.name}}</span> </p>
            <p class="prodTextTitle"><span class="text-amber">Lệnh sản xuất: </span>  <span class="text-white">{{item.number}}</span> </p>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-actions align="around">
            <q-btn @click="goHistory(item.fromId,item)" class="glossy" rounded color="primary" label="Lịch sử lỗi" />
             <q-btn @click="goHandle(item)" class="glossy" rounded color="deep-orange" label="Xử lý" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="showSearchModel" transition-show="rotate" transition-hide="rotate">
      <q-card  style="min-width: 300px;border: 2px solid white" class="bg-blue-grey-7">
        <q-card-section>
          <div class="prodTextTitle text-white">Tìm kiếm</div>
        </q-card-section>

        <q-card-section>
          <q-select dark label-color="amber" clearable @clear="clear" style="font-family:'Time New Roman';font-size:16px;text-align:center" 
             v-model="proces" @input="searchByProcess" behavior="dialog" :options="process" label="Chọn công đoạn :" />
             <br>
          <q-input dark label-color="amber" v-show="proces===null" outlined v-model="quicachSearch" @input="search" label="Tìm theo qui cách" />
        </q-card-section>

        <q-card-actions align="right" class="text-teal">
          <q-btn flat class="text-white" label="OK" @click="closeSearch" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-sticky position="bottom-left" :offset="[18, 18]">
      <q-btn fab @click="showSearch" icon="search" color="secondary" />
    </q-page-sticky>
    <q-inner-loading :showing="showLoad">
        <q-spinner-gears size="150px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AppBar from '../../components/AppBar'
export default {
    components:{
        'app-bar':AppBar
    },
     computed: {
    ...mapGetters("base", ["myDepartments","userInfo"]),
      },
    data(){
      return {
        showLoad:true,
        inventorys:[],
        showSearchModel:false,
        showSearchModel1:false,
        quicachSearch:'',
        process:[],
        proces:null,
        searchResultNumber:0
      }
    },
    created(){
      this.initData()
     // const factoryId = this.$store.getters['base/myFactoryInfor'].id
      let tokenFB = localStorage.getItem('tokenFBB')
      // if (tokenFB) {
      //   this.$subcriberTopic(factoryId+'-QC')
      // }
    },
    methods:{
      goHistory(stepId,itemId){
        // this.push
        let payload = stepId.toString()+'-'+itemId.item.id.toString()+'-'+itemId.id
        this.$router.push({ name: 'qchistorybystepvcn', params: { stepid: payload} })
      },
      initData() {
     //    const factoryId = this.userInfo.factoryId
        const payload ={
          token : this.$store.state.production.userInfo.token,
         stepId:this.userInfo.factoryId
        }
        this.$store.dispatch('vcn/ACTION_GET_INVENTORY_QC_VCN',payload).then(res=>{
          this.inventorys = res.data
         console.log('thu nghiem',this.inventorys)
          this.showLoad = false
          res.data.forEach(element => {
            if (this.process.findIndex((p)=>{ return p.value===element.from.id})===-1) {
              const pr = {
                label:element.from.name,
                value:element.from.id
              }
              this.process.push(pr)
                 
            }
          });
        }).catch(err=>{
          console.log(err)
        })
      },
      goHandle(inv){
        this.$store.dispatch('vcn/ACTION_SELECT_INVENTORY_QC',inv)
        this.$router.push('/production-handle-qc-vcn')
       
      },
      clear(val){
        console.log(val)
        this.proces=null
      },
      showSearch(){
        this.showSearchModel = true
      },
      // showSearch1(){
      //   this.showSearchModel1 = true
      // },
      searchByProcess(proSelect){
        console.log('kiem tra',proSelect)
        if (proSelect!==null) {
          let pss = this.$store.state.vcn.inventoryQCs.filter((obj)=>{
               return obj.from.id===proSelect.value
            })
            this.inventorys = pss
            this.searchResultNumber = pss.length
        }else {
          this.inventorys = this.$store.state.vcn.inventoryQCs
          this.searchResultNumber = this.inventorys.length
        }
      },
      closeSearch(){
        this.showSearchModel = false
        this.showSearchModel1 = true
        this.$q.notify({
          message:'Tìm thấy '+this.searchResultNumber + ' kết quả ',
          color:'cyan'
        })
      },
      search() {
            let pss = this.$store.state.vcn.inventoryQCs.filter((obj)=>{
              
              const itemHeight = obj.item.height || ''
              const itemWidth = obj.item.width || ''
              const itemLength = obj.item.length || ''
              let quicach = itemHeight.toString()+itemWidth.toString()+itemLength.toString()
                if (quicach.toString().search(this.quicachSearch)!==-1) {
                    return obj;
                }
            })
            if (pss.length > 0) {
              this.inventorys = pss
              this.searchResultNumber = pss.length
            }else {
              this.inventorys = this.$store.state.vcn.inventoryQCs
              this.searchResultNumber = this.inventorys.length
            }
        },
    }
}
</script>

<style>

</style>