<template>
  <q-page class="q-pa-md">
    <no-approval-steps
      v-if="approvalSteps && approvalSteps.data && !approvalSteps.data.length"
    ></no-approval-steps>
    <approval-steps-todo v-else :approvalSteps="approvalSteps" />
    <div class="absolute-bottom text-center q-mb-lg">
      <q-btn
        @click="showAddApprovalStep = true"
        round
        color="primary"
        size="24px"
        icon="add"
      />
    </div>
    <q-dialog v-model="showAddApprovalStep">
      <add-approval-step
        @close="showAddApprovalStep = false"
        :approvalStep="approvalStep"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "PageApprovalStep",
  data() {
    return {
      showAddApprovalStep: false
    };
  },
  computed: {
    ...mapGetters("approvalSteps", ["approvalSteps", "approvalStep"])
  },
  methods: {
    ...mapActions("approvalSteps", [
      "getAllapprovalSteps",
      "resetApprovalStep",
      "addApprovalStep",
      "deleteApprovalStep",
      "selectApprovalStep"
    ])
  },
  created() {
    this.getAllapprovalSteps();
  },
  components: {
    "add-approval-step": require("components/ApprovalSteps/Modals/AddApprovalStep.vue")
      .default,
    "approval-steps-todo": require("components/ApprovalSteps/ApprovalStepsTodo.vue")
      .default,
    "no-approval-steps": require("components/ApprovalSteps/NoApprovalSteps.vue")
      .default
  }
};
</script>
