<template>
  <div>
    <q-list separator bordered>
      <task
        v-for="(task, key) in dataPlan"
        :key="key"
        :task="task"
        :id="key"
        :searchQuery="searchQuery"
        :completed="false"
      ></task>
    </q-list>
  </div>
</template>

<script>
export default {
  props: ["dataPlan","searchQuery"],
  components: {
    task: require("components/Tasks/Task.vue").default
  }
};
</script>
