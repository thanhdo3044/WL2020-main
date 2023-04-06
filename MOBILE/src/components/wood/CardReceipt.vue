<template>
  <div class="col-12 col-sm-4 q-ma-sm">
    <q-card class="my-card ">
      <q-card-section >
        <div class="text-h6">{{receipt.YEAR}}.{{receipt.NUMBER_OF_MONTH}}/{{receipt.MONTH}}{{receipt.WAREHOUSE_CODE}}</div>
        <div class="text-subtitle2 woodText">{{receipt.VENDOR_NAME}}</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <div class="row">
          <div class="col-6">
            <p class="prodTextNormal">Ngày nhập kho : </p>
          </div>
          <div class="col-6">
            <p class="prodTextNormal">{{receipt.CREATE_AT}}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <p class="prodTextNormal">Mã kho : </p>
          </div>
          <div class="col-6">
            <p class="prodTextNormal">{{receipt.WAREHOUSE_CODE}}</p>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="around">
        <q-btn v-if="receipt.ALLOW_PAY&&!isQC" outline @click="viewDetail(receipt,isQC)" style="color: blue;"   class="woodText"> {{'Xem chi tiết'}}</q-btn>
        <q-btn v-if="!receipt.ALLOW_PAY&&!isQC" outline @click="viewDetail(receipt,isQC)" style="color: blue;"   class="woodText"> {{'Xem chi tiết'}}</q-btn>
        <q-btn v-if="receipt.ALLOW_PAY&&isQC" outline @click="viewDetail(receipt,isQC)" style="color: blue;"   class="woodText"> {{'Xem chi tiết'}}</q-btn>
        <q-btn v-if="receipt.ALLOW_INSPECTION&&isQC" outline @click="goInspection(receipt)" style="color: goldenrod;"  class="woodText">Nghiệm thu</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import {feature} from '../../configs/constants'
export default {
    props: {
        receipt:{
            type:Object
        },
        isQC:{
          type:Boolean,
          default: false
        },
        isWH :{
          type: Boolean,
          default: false
        }
    },
    methods:{
      viewDetail(receipt,qc){
        this.$store.dispatch('wood/SELECT_RECEIPT',receipt)
        console.log(qc)
        if (qc) {
          this.$router.push({ name: 'wood-inspection', params: { id:  receipt.ID} })
        }else {
          this.$router.push({ name: 'wood-detail', params: { id:  receipt.ID} }) 
        }
      },
      goInspection(receipt){
          // this.$router.push('/wood-inspection/'+)wood-inspection
          this.$store.dispatch('wood/SELECT_RECEIPT',receipt)
        this.$router.push({ name: 'wood-inspection', params: { id:  receipt.ID} })
      },
    }
}
</script>

<style>

</style>