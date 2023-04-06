<template>
  <q-card>
    <modal-header>Thêm bước phê duyệt</modal-header>

    <form @submit.prevent="submitForm">
      <q-card-section>
        <modal-task-name
          :name.sync="approvalStepToSubmit.name"
          ref="modalTaskName"
        />
        <q-input outlined v-model="approvalStepToSubmit.userId" label="Mã NV" />
        <q-input
          outlined
          v-model="approvalStepToSubmit.position"
          label="Chức vụ"
        />
        <q-checkbox
          v-model="approvalStepToSubmit.isDisable"
          label="Không nhận trực tiếp"
        />
        <q-checkbox
          v-model="approvalStepToSubmit.showMessages"
          label="Nhắn tin"
        />
      </q-card-section>

      <modal-buttons></modal-buttons>
    </form>
  </q-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["approvalStep"],
  data() {
    return {
      approvalStepToSubmit: {}
    };
  },
  methods: {
    ...mapActions("approvalSteps", ["addApprovalStep"]),
    submitForm() {
      this.$refs.modalTaskName.$refs.name.validate();
      if (!this.$refs.modalTaskName.$refs.name.hasError) {
        this.submitTask();
      }
    },
    submitTask() {
      this.addApprovalStep(this.approvalStepToSubmit);
      this.$emit("close");
    }
  },
  components: {
    "modal-header": require("components/ApprovalSteps/Modals/Shared/ModalHeader.vue")
      .default,
    "modal-task-name": require("components/ApprovalSteps/Modals/Shared/ModalTaskName.vue")
      .default,
    "modal-task-user-id": require("components/ApprovalSteps/Modals/Shared/ModalTaskUserId.vue")
      .default,
    "modal-task-position": require("components/ApprovalSteps/Modals/Shared/ModalTaskPosition.vue")
      .default,
    "modal-due-date": require("components/ApprovalSteps/Modals/Shared/ModalDueDate.vue")
      .default,
    "modal-due-time": require("components/ApprovalSteps/Modals/Shared/ModalDueTime.vue")
      .default,
    "modal-buttons": require("components/ApprovalSteps/Modals/Shared/ModalButtons.vue")
      .default
  },
  mounted() {
    this.approvalStepToSubmit = Object.assign({}, this.approvalStep);
  }
};
</script>
