<template>
  <q-card>
    <modal-header>Sửa đề xuất</modal-header>

    <form @submit.prevent="submitForm">
      <q-card-section>
        <modal-task-name :name.sync="taskToSubmit.name" ref="modalTaskName" />
      </q-card-section>

      <modal-buttons></modal-buttons>
    </form>
  </q-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["task", "id"],
  data() {
    return {
      taskToSubmit: {}
    };
  },
  methods: {
    ...mapActions("orders", ["addOrder"]),
    submitForm() {
      this.$refs.modalTaskName.$refs.name.validate();
      if (!this.$refs.modalTaskName.$refs.name.hasError) {
        this.submitTask();
      }
    },
    submitTask() {
      this.addOrder(this.taskToSubmit);
      this.$emit("close");
    },
    clearDueDate() {
      this.taskToSubmit.dueDate = "";
      this.taskToSubmit.dueTime = "";
    }
  },
  components: {
    "modal-header": require("components/Requests/Modals/Shared/ModalHeader.vue")
      .default,
    "modal-task-name": require("components/Requests/Modals/Shared/ModalTaskName.vue")
      .default,
    "modal-due-date": require("components/Requests/Modals/Shared/ModalDueDate.vue")
      .default,
    "modal-due-time": require("components/Requests/Modals/Shared/ModalDueTime.vue")
      .default,
    "modal-buttons": require("components/Requests/Modals/Shared/ModalButtons.vue")
      .default
  },
  mounted() {
    this.taskToSubmit = Object.assign({}, this.task);
  }
};
</script>
