<template>
  <q-card class="my-card q-mt-md">
    <q-card-section>
      <div @click="goDetail(pallet.code)" class="text-h6">{{pallet.code}}</div>
      <div v-if="pallet.verifyDate" class="text-subtitle2" style="font-family:'Time'">Nhận ngày : {{pallet.verifyDate}}</div>
      <div v-if="pallet.createDate" class="text-subtitle2" style="font-family:'Time'">Ngày chuyển : {{pallet.createDate}}</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div
        class="text-subtitle2" 
      >
      <p >{{pallet.item[0].height || '' }} {{pallet.item[0].width || '' }} {{pallet.item[0].length || '' }}</p>
      Số lượng :  {{pallet.inventory || pallet.item[0].quantity}}  <span v-if="pallet.item[0].unit">({{pallet.item[0].unit.name}}) </span> 
      </div>
      <div class="text-subtitle2" style="font-family:'Time'">Nhập từ : {{pallet.fromName}}</div>
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <slot name="action">
        
      </slot>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  props: {
    pallet: {
      type:Object
    }
  },
  methods:{
    goDetail(code){
      this.$router.push('/production-dashboard?code='+code)
    }
  }
};
</script>

<style>
</style>