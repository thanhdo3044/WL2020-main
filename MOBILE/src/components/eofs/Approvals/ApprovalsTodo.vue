<template>
  <div>
    <!-- <list-header bgcolor="bg-orange-4">Danh sách phiếu chưa duy</list-header> -->

    <q-list separator bordered>
      <task
        v-for="(task, key) in requestsTodo"
        :key="key"
        :task="task"
        :id="key"
      :completed="false"
      ></task>
    </q-list>
  </div>
</template>

<script>
export default {
  props: ["requestsTodo"],
  components: {
    task: require("components/eofs/Approvals/Approval.vue").default,
    "list-header": require("components/eofs/Shared/ListHeader.vue").default
  }
};
</script>
