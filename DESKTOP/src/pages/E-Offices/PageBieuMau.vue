<template>
  <q-page class="q-pa-md q-ma-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row ">
          <div class="col-12 top-title text-orange">Quản lý biểu mẫu</div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <BieuMausTodo :proposalForms="proposalForms.data" />
      </q-card-section>
    </q-card>
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="primary" />
    </q-page-scroller>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import BieuMausTodo from "../../components/E-Offices/BieuMausTodo";

export default {
  data() {
    return {
      proposalFormsTodo: []
    };
  },
  computed: {
    ...mapGetters("proposalForm", ["proposalForms"])
  },
  methods: {
    ...mapActions("proposalForm", ["getAllProposalForms"])
  },
  created() {
    this.getAllProposalForms();
  },
  mounted() {
    this.proposalFormsTodo = this.proposalForms.data;
  },
  components: {
    BieuMausTodo
  }
};
</script>
