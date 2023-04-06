<template>
  <q-banner class="bg-grey-3">
    <template v-slot:avatar>
      <q-icon name="check" color="primary" />
    </template>
    Không có mặt hàng đề xuất!
    <template v-slot:action>
      <q-btn
        @click="$root.$emit('showAddOrderLine')"
        flat
        color="primary"
        label="Thêm mặt hàng"
      />
    </template>
  </q-banner>
</template>

<script>
export default {};
</script>
