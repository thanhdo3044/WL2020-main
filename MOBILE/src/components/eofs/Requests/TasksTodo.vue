<template>
  <div class="q-ml-sm">
    <list-header bgcolor="bg-orange-4">Phiếu yêu cầu</list-header>
    
    <q-list separator bordered>
      <task
        v-for="(task, key) in tasksTodo"
        :key="key"
        :task="task"
        :request="request"
        :id="key"
        :completed="false"
      ></task>
    </q-list>
  </div>
</template>

<script>
export default {
  props: ["tasksTodo", "request"],
  created(){
    console.log("tasksTodo",this.tasksTodo)
  },
  components: {
    task: require("components/eofs/Requests/Task.vue").default,
    "list-header": require("components/eofs/Shared/ListHeader.vue").default
  }
};
</script>
