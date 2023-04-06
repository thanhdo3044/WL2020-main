<template>
  <q-page>
    <no-proposal-forms
      v-if="proposalForms && proposalForms.data && !proposalForms.data.length"
    ></no-proposal-forms>
    <proposal-forms-todo v-else :proposalForms="proposalForms" />
    <div class="absolute-bottom text-center q-mb-lg">
      <q-btn
        @click="showAddProposalForm = true"
        round
        color="primary"
        size="24px"
        icon="add"
      />
    </div>
    <q-dialog v-model="showAddProposalForm">
      <add-proposal-form
        @close="showAddProposalForm = false"
        :proposalForm="proposalForm"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "PageProposalForm",
  data() {
    return {
      showAddProposalForm: false
    };
  },
  computed: {
    ...mapGetters("proposalForms", ["proposalForms", "proposalForm"]),
    ...mapGetters("base", ["userInfo"])
  },
  methods: {
    ...mapActions("proposalForms", [
      "getAllProposalForms",
      "resetProposalForm",
      "addProposalForm",
      "selectProposalForm",
      "selectProposalForm"
    ])
  },
  created() {
    this.getAllProposalForms();
    this.resetProposalForm({
      userId: this.userInfo.account
    });
  },
  components: {
    "add-proposal-form": require("components/ProposalForms/Modals/AddProposalForm.vue")
      .default,
    "proposal-forms-todo": require("components/ProposalForms/ProposalFormsTodo.vue")
      .default,
    "no-proposal-forms": require("components/ProposalForms/NoProposalForms.vue")
      .default
  }
};
</script>
