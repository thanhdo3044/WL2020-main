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
      outlined
      v-model="metaValue.fullName"
      label="Tên tôi là:"
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="order.Department.name"
      label="Địa chỉ/bộ phận:"
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      v-model="metaValue.noiDungTT"
      label="Lý do tạm ứng:"
      outlined
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      v-model="metaValue.soTien"
      label="Đề nghị cho tạm ứng số tiền:"
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
    <p class="q-ma-sm">
      Cam kết thời hạn thanh toán tạm ứng :
      <b>Theo Quy chế tài chính của Công ty</b>
    </p>
  </q-card-section>
</template>

<script>
export default {
  props: ["metaValue", "disable", "order"]
};
</script>
