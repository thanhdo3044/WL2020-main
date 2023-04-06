<template>
  <div>
    <q-item :class="!completed ? 'bg-orange-1' : 'bg-green-1'" clickable v-ripple>
      <q-item-section>
        <q-item-label class="text-subtitle2">
          [{{ task.Item.code }}] - {{ task.Item.name }} ({{ task.Item.height }}*{{
          task.Item.width
          }}*{{ task.length }})
        </q-item-label>
        <q-item-label caption lines="2">LSX: {{ task.number }} - {{ task.root }}</q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-item-label
          caption
        >{{completed ? moment(task.taoPhoi).fromNow() : moment(task.ngayDongGoi).subtract(Math.ceil(task.thoiGianBatDau+ + task.thoiGianCho), 'days').format("L") }}</q-item-label>
        <q-badge color="teal" :label="
             task.quantity
          " />
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["task", "id", "completed"],
  data() {
    return {
      showEditTask: false
    };
  },
  methods: {
    ...mapActions("tasks", ["updateTask", "deleteTask"])
  }
};
</script>

<style></style>
