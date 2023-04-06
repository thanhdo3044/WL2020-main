<template>
  <q-page class="q-pa-sm">
    <div class="row justify-center q-ma-sm">
      <!-- <div  class="col-12 col-md-6 gt-md">
        <q-btn color="primary" label="Thêm mới" />
      </div> -->
      <div class="col-8 col-md-6">
        <q-input outlined v-model="search" :dense="true">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="row justify-center">
        <card-receipt v-for="receipt in receipts" :isQC="isQC" :key="receipt.id" :receipt="receipt"></card-receipt>
    </div>
    <q-page-sticky v-if="showAdd"  position="bottom-right" :offset="[18, 18]">
      <q-btn @click="onClick" fab icon="add" color="accent" />
    </q-page-sticky>
    
  </q-page>
</template>

<script>
import {feature} from '../../configs/constants'
import CardReceipt from '../../components/wood/CardReceipt'
import { QSpinnerIos } from 'quasar'
export default {
  components: {
    'card-receipt':CardReceipt
  },
  data(){
    return {
      receipts:[],
      search:'',
      showAdd:false,
      isQC:false,
      isWH:false
    } 
  },
  created(){
    this.initData()
    const screenType = this.$route.query.type
    if (screenType==='wh') {
      this.isWH=true
      this.showAdd =true
    }
    if (screenType==='qc') {
      this.isQC=true
    }
  },
  methods:{
    onClick(){
      this.$router.push('/wood-add-receipt')
    },
    async initData(){
      this.$q.loading.show({
        spinnerColor:'primary',
        spinner:QSpinnerIos
      })
      // console.log(myWarehouseId)
      if (this.$store.getters['base/myWarehouses'].length>0) {
        const myWarehouseId = this.$store.getters['base/myWarehouses'][0].id   
        const payload = {
          moduleCode:'vcn',
          warehouseId:myWarehouseId
        }   
        let data = await this.$store.dispatch('wood/GET_RECEIPTS',payload)
        this.$q.loading.hide()
        if (data.data) {
          this.receipts = data.data
        }
      }else{
        this.$q.notify({
          message:"Bạn không có quyền truy cập !"
        })
      }
      
    }
  }
}
</script>

<style>

</style>