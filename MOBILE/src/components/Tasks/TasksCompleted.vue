<template>
  <div class="q-mt-lg">
    <q-list separator bordered>
      <task
        v-for="(task, key) in tasksCompleted"
        :key="key"
        :task="task"
        :id="key"
        :completed="true"
      ></task>
    </q-list>
  </div>
</template>

<script>
export default {
  props: ["tasksCompleted"],
  components: {
    task: require("components/Tasks/Task.vue").default
  }
};
</script>
