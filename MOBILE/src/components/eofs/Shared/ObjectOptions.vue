<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary" multi-line>Model: "{{ model }}"</q-badge>

      <q-select
        filled
        v-model="model.companyId"
        :options="options"
        :label="label"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: "Chọn"
    },
    options: {
      type: Array
    },
    model: {
      type: Object
    }
  }
};
</script>
