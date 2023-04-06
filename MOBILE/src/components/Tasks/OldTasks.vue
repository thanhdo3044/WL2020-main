<template>
  <q-banner dense  rounded class="bg-orange text-white">
    Bạn cần màn hình dễ dàng báo cáo số liệu sản xuất. Ghi nhận một bước theo lệnh/gộp lệnh, theo dõi tồn phôi, lịch sử giao đi.
    <template v-slot:action>
      <q-btn :to="'ghi-nhan'" flat label="Dùng thử" />
      <q-btn :to="'ghi-nhan'" flat label="Đóng" />
    </template>
  </q-banner>
</template>

<script>
export default {};
</script>
