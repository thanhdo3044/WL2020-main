<template>
  <q-page>
    <no-approvals
      v-if="requestsTodo.data && !requestsTodo.data.length"
    ></no-approvals>
    <approvals-todo v-else :requestsTodo="requestsTodo.data" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  methods: {
    ...mapActions("requests", ["getAllRequests"])
  },
  computed: {
    ...mapGetters("requests", ["requestsTodo"]),
    ...mapGetters("base", ["userInfo"])
  },
  components: {
    "approvals-todo": require("components/eof/Approvals/ApprovalsTodo.vue")
      .default,
    "no-approvals": require("components/eof/Approvals/NoApprovals.vue").default
  },
  created() {
    this.getAllRequests(this.userInfo.id);
  }
};
</script>
