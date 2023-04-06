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
    "approvals-todo": require("components/eofs/Approvals/ApprovalsTodo.vue")
      .default,
    "no-approvals": require("components/eofs/Approvals/NoApprovals.vue").default
  },
  async created() {
    let data2 = await this.getAllRequests(this.userInfo.id);
    console.log('data',data)

  }
};
</script>
