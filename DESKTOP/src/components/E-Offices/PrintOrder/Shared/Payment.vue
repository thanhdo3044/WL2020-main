<template>
  <div>
    <p>
      <strong>Kính gửi</strong>
      : {{ metaValue[0].kinhGui }}
    </p>
    <p>
      Họ và tên người đề nghị thanh toán :
      <strong>{{ order.Account.lastName }}</strong>
    </p>
    <p>
      Bộ phận (hoặc địa chỉ) :
      <em>{{ order.Department.name }}</em>
    </p>
    <p>Nội dung thanh toán : {{ metaValue[0].noiDungTT }}</p>
    <p>
      Số tiền : {{ metaValue[0].noiDungTT }} (Viết bằng chữ)
      {{ metaValue[0].vietBangChu }}
    </p>
    <p>(Kèm theo {{ metaValue[0].kemTheo }} chứng từ gốc)</p>
  </div>
</template>

<script>
export default {
  props: ["order", "metaValue"]
};
</script>

<style scoped>
</style>
