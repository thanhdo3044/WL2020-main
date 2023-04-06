<template>
  <q-card class="my-card">
    <no-order-lines v-if="!orderLines && !orderLines.length" />
    <q-markup-table v-else>
      <thead>
        <tr>
          <th class="text-left">TT</th>
          <th class="text-right">Tên mặt hàng</th>
          <th class="text-right">Xuất xứ</th>
          <th class="text-right">ĐVT</th>
          <th class="text-right">SL</th>
          <th class="text-right">Yêu cầu kỹ thuật</th>
          <th class="text-right">Thời gian cung cấp</th>
          <th class="text-right">Lý do yêu cầu</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(orderLine, index) in orderLines" :key="orderLine.id">
          <td class="text-left">{{ index + 1 }}</td>
          <td class="text-right">{{ orderLine.name }}</td>
          <td class="text-right">{{ orderLine.origin }}</td>
          <td class="text-right">{{ orderLine.unitId.trim() }}</td>
          <td class="text-right">{{ orderLine.quantity }}</td>
          <td class="text-right">{{ orderLine.title }}</td>
          <td class="text-right">{{ orderLine.finishedAt | ngay }}</td>
          <td class="text-right">{{ orderLine.note }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>
</template>

<script>
import NoOrderLines from "components/eofs/OrderLines/NoOrderLines.vue";
export default {
  props: ["orderLines"],
  components: {
    NoOrderLines
  }
};
</script>
