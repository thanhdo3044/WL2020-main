<template>
  <div>
    <!-- <list-header bgcolor="bg-orange-4">Kế hoạch sản xuất</list-header> -->

    <q-list separator bordered>
      <task
        v-for="(task, key) in dataPlan"
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
  props: ["dataPlan"],
  components: {
    task: require("components/Tasks/Task.vue").default,
    "list-header": require("components/Shared/ListHeader.vue").default
  }
};
</script>
