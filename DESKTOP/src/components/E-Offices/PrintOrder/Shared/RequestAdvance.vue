<template>
<div>
     <p>
    Kính gửi
    :
    <strong>{{ metaValue[0].kinhGui }}</strong>
  </p>
  <p>
    Họ và tên người đề nghị tạm ứng :
    <strong>{{ order.Account.lastName }}</strong>
  </p>
  <p>
    Bộ phận (hoặc địa chỉ) :
    <em>{{ order.Department.name }}</em>
  </p>
  <p>Nội dung thanh toán : {{ metaValue[0].noiDungTT }}</p>
  <p>
    Số tiền : {{ metaValue[0].soTien }} (Viết bằng chữ)
    {{ metaValue[0].vietBangChu }}
  </p>
  <p class="q-mt-sm">
    Cam kết thời hạn thanh toán tạm ứng :
    <b>Theo Quy chế tài chính của Công ty</b>
  </p>
</div>
</template>
<script>
export default {
  props: ["order", "metaValue"]
};
</script>
<style scoped>

</style>