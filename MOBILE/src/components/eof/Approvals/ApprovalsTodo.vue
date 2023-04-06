<template>
  <div>
    <list-header bgcolor="bg-orange-4">Yêu cầu cần phê duyệt</list-header>

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
    task: require("components/eof/Approvals/Approval.vue").default,
    "list-header": require("components/eof/Shared/ListHeader.vue").default
  }
};
</script>
