<template>
  <q-card>
    <modal-header>Thêm mẫu phê duyệt</modal-header>

    <form @submit.prevent="submitForm">
      <q-card-section>
        <modal-task-name
          :title.sync="proposalFormToSubmit.title"
          ref="modalTaskName"
        />
        <!-- <q-select
          filled
          v-model="proposalFormToSubmit.companyId"
          :options="companies"
          label="Standard"
          emit-value
        />-->
        <!-- <q-select
          filled
          v-model="proposalFormToSubmit.companyId"
          :options="companies"
          label="Standard"
          emit-value
        />-->
        <!-- <q-badge color="secondary" multi-line>Model: "{{ selectCostcenter }}"</q-badge> -->

        <q-select
          filled
          v-model="selectCostcenter"
          :options="costcentersOption"
          label="Standard"
        />
        <!-- <q-checkbox v-model="proposalFormToSubmit.isDisable" label="Không nhận trực tiếp" /> -->
      </q-card-section>

      <modal-buttons></modal-buttons>
    </form>
  </q-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["proposalForm"],
  data() {
    return {
      proposalFormToSubmit: {},
      selectCostcenter: null,
      companies: [
        {
          label: "Thuận Hưng",
          value: "TH",
          description: "Nhà máy Thuận Hưng",
          icon: "mail"
        },
        {
          label: "Yên Sơn",
          value: "YS",
          description: "Nhà máy Yên Sơn",
          icon: "mail"
        },
        {
          label: "Thái Bình",
          value: "TB",
          description: "Nhà máy Thái Bình",
          icon: "mail"
        }
      ]
    };
  },
  computed: {
    ...mapGetters("costcenters", ["costcentersOption", "costcenter"])
  },
  methods: {
    ...mapActions("proposalForms", ["addProposalForm"]),
    ...mapActions("costcenters", ["getAllCostcenters"]),
    submitForm() {
      this.$refs.modalTaskName.$refs.title.validate();
      if (!this.$refs.modalTaskName.$refs.title.hasError) {
        this.submitTask();
      }
    },
    submitTask() {
      this.addProposalForm({
        ...this.proposalFormToSubmit,
        companyId: selectCostcenter.companyId
      });
      this.$emit("close");
    }
  },
  components: {
    "modal-header": require("components/ProposalForms/Modals/Shared/ModalHeader.vue")
      .default,
    "modal-task-name": require("components/ProposalForms/Modals/Shared/ModalTaskName.vue")
      .default,
    "modal-task-user-id": require("components/ProposalForms/Modals/Shared/ModalTaskUserId.vue")
      .default,
    "modal-task-position": require("components/ProposalForms/Modals/Shared/ModalTaskPosition.vue")
      .default,
    "modal-due-date": require("components/ProposalForms/Modals/Shared/ModalDueDate.vue")
      .default,
    "modal-due-time": require("components/ProposalForms/Modals/Shared/ModalDueTime.vue")
      .default,
    "modal-buttons": require("components/ProposalForms/Modals/Shared/ModalButtons.vue")
      .default
  },
  created() {
    this.getAllCostcenters();
  },
  mounted() {
    this.proposalFormToSubmit = Object.assign({}, this.proposalForm);
  }
};
</script>
