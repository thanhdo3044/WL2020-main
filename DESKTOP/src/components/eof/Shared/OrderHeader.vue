<template>
  <div>
    <q-btn v-go-back.single icon="arrow_back" flat dense label="Quay lại" />
    <q-card class="my-card">
      <q-card-section class="bg-secondary text-white">
        <div class="text-h6">{{ order.title }} {{ order.number }}/2020/TH</div>
        <div class="text-subtitle2">
          <!-- NV đề xuất: {{ order.Account.account }} - {{ order.Account.lastName }} -->
        </div>
        <div class="text-subtitle2">
          <!-- Bộ phận làm việc: {{ order.Department.code }} -
          {{ order.Department.name }} -->
        </div>
        <div class="text-subtitle2">Ngày: {{ order.createdAt.slice(0,10) | ngay }}</div>
        <div class="text-subtitle2">
          <q-badge :color="order.completed ? 'blue' : 'green'">{{
            order.status
          }}</q-badge>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  props: ["order"]
};
</script>
