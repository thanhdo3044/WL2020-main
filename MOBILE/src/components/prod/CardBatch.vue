<template>
  <q-card class="bg-secondary text-white" v-if="batch.verify>0">
      <q-card-section>
          <p  class="prodTextTitle"> Mẻ sấy số : {{batch.code}}</p>
          <p class="prodTextTitle" style="margin-top: -11px;">{{batch.kilnName}}</p>
          <p style="color:orange; margin-top: -11px; margin-bottom: -12px;font-family: 'Time New Roman';font-size: 12px;font-style: italic;">Trạng thái : {{batch.status==='process' ? 'Đang sấy và đã đánh giá mẻ sấy' : 'Đang vào lò'}}</p>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <p class="prodTextNormal">Chiều dầy sấy : {{batch.height}} </p>
        <p class="prodTextNormal">Chiều dài sấy : {{batch.length}} </p>
        <p class="prodTextNormal">Mục đích sấy : {{batch.type|| 'Không xác định'}} </p>
        <p class="prodTextNormal">Ngày dự kiến ra lò : {{batch.timeout}} </p>
        <p class="prodTextNormal">Tổng số pallet : {{batch.ballets.length}} </p>
        <p v-if="batch.ballets.length>0" class="prodTextNormal">Khối lượng mẻ : {{parseFloat(batch.totalM3).toFixed(2)}} (m³) </p>
      </q-card-section>
      <q-card-actions align="right">
        <slot name="action"></slot>
      </q-card-actions>
  </q-card>
  <q-card v-else class="bg-brown text-white">
      <q-card-section>
          <p  class="prodTextTitle"> Mẻ sấy số : {{batch.code}}</p>
         <p class="prodTextTitle" style="margin-top: -11px;">{{batch.kilnName}}</p>
          <p style="color:orange;margin-top: -11px;margin-bottom: -12px;font-family: 'Time New Roman';font-size: 12px;font-style: italic;">Trạng thái : {{batch.status==='process' ? 'Đang sấy và chưa đánh giá mẻ sấy' : 'Đang vào lò'}}</p>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <p class="prodTextNormal">Chiều dầy sấy : {{batch.height}} </p>
        <p class="prodTextNormal">Chiều dài sấy : {{batch.length}} </p>
        <p class="prodTextNormal">Mục đích sấy : {{batch.type|| 'Không xác định'}} </p>
        <p class="prodTextNormal">Ngày dự kiến ra lò : {{batch.timeout}} </p>
        <p class="prodTextNormal">Tổng số pallet : {{batch.ballets.length}} </p>
        <p v-if="batch.ballets.length>0" class="prodTextNormal">Khối lượng mẻ : {{parseFloat(batch.totalM3).toFixed(2)}} (m³) </p>
      </q-card-section>
      <q-card-actions align="right">
        <slot name="action"></slot>
      </q-card-actions>
  </q-card>
</template>

<script>
export default {
    props:{
        batch:{
            type:Object
        }
    },
}
</script>

<style>

</style>