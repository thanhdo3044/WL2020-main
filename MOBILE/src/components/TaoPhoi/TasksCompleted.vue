<template>
  <div class="q-mt-lg">
    <list-header bgcolor="bg-green-4">Chờ duyệt</list-header>
    <q-list separator bordered>
      <task
        v-for="(task, key) in tasksCompleted"
        :key="key"
        :task="task"
        :id="key"
        :completed="true"
      ></task>
    </q-list>
    <div class="q-gutter-md">
      <q-btn color="teal" class="full-width" @click="huyCapPhoi">
        <q-icon left size="3em" name="done_all" />
        <div>Hủy yêu cầu</div>
      </q-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: ["tasksCompleted"],
  methods: {
    ...mapActions("po", ["huyPhoi"]),
    huyCapPhoi() {
      let poIds = this.tasksCompleted.map(po => po.id);
      this.huyPhoi(poIds);
    }
  },
  components: {
    task: require("components/TaoPhoi/Task.vue").default,
    "list-header": require("components/Shared/ListHeader.vue").default
  }
};
</script>
