<template>
  <q-banner class="bg-grey-3">
    <template v-slot:avatar>
      <q-icon name="check" color="primary" />
    </template>
    Không có đề xuất cần phê duyệt!
    <!-- <template v-slot:action>
      <q-btn
        @click="$root.$emit('showAddTask')"
        flat
        color="primary"
        label="Add Task"
      />
    </template>-->
  </q-banner>
</template>

<script>
export default {};
</script>
