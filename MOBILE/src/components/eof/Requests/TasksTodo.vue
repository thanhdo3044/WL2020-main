<template>
  <div>
    <list-header bgcolor="bg-orange-4">Phiếu yêu cầu</list-header>
    
    <q-list separator bordered>
      <task
        @update="updateTask"
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
  methods:{
    async updateTask(){
      this.$emit('update-order')
    }
  },
  components: {
    task: require("components/eof/Requests/Task.vue").default,
    "list-header": require("components/eof/Shared/ListHeader.vue").default
  }
};
</script>
