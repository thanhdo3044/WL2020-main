<template>
  <div>
    <!-- {{approvalStep}} -->
    <q-item clickable v-ripple>
      <q-item-section>
        <q-item-label class="text-subtitle2">{{
          approvalStep.position
        }}</q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-item-label caption>{{ approvalStep.name }}</q-item-label>
        <q-badge color="teal" :label="approvalStep.userId" />
      </q-item-section>

      <q-item-section side>
        <div class="row">
          <q-btn
            @click.stop="showEditTask = true"
            flat
            round
            dense
            color="primary"
            icon="edit"
          />
          <q-btn
            @click.stop="promptToDelete(approvalStep.id)"
            flat
            round
            dense
            color="red"
            icon="delete"
          />
        </div>
      </q-item-section>

      <q-dialog v-model="showEditTask">
        <edit-task @close="showEditTask = false" :approvalStep="approvalStep" />
      </q-dialog>
    </q-item>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["approvalStep"],
  data() {
    return {
      showEditTask: false
    };
  },
  methods: {
    ...mapActions("approvalSteps", [
      "deleteApprovalStep",
      "selectApprovalStep"
    ]),
    promptToDelete(id) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Really delete?",
          ok: {
            push: true
          },
          cancel: {
            color: "negative"
          },
          persistent: true
        })
        .onOk(() => {
          this.deleteApprovalStep(id);
        });
    }
  },
  components: {
    "edit-task": require("components/ApprovalSteps/Modals/EditApprovalStep.vue")
      .default
  }
};
</script>

<style></style>
