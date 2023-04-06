<template>
  <q-card-section>
    <q-input
      class="q-mt-sm"
      outlined
      v-model="metaValue.kinhGui"
      label="Kính gửi:"
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      v-model="metaValue.noiDungTT"
      label="Nội dung thanh toán:"
      outlined
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      v-model="metaValue.soTien"
      label="Số tiền:"
      outlined
      :readonly="disable"
    />
    <p class="q-mt-md">{{ metaValue.soTien | bangChu }}</p>
    <q-input
      class="q-mt-sm"
      v-model="metaValue.kemTheo"
      label="Kèm theo:"
      outlined
      :readonly="disable"
    />
    <p>chứng từ gốc</p>
  </q-card-section>
</template>

<script>
export default {
  props: ["metaValue", "disable"]
};
</script>
