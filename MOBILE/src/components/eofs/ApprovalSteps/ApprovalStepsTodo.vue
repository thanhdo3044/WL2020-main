<template>
  <div>
    <list-header bgcolor="bg-orange-4">Cấu hình bước phê duyệt</list-header>

    <q-list separator bordered>
      <approval-step
        v-for="approvalStep in approvalSteps.data"
        :key="approvalStep.id"
        :approvalStep="approvalStep"
      />
    </q-list>
  </div>
</template>

<script>
export default {
  props: ["approvalSteps"],
  components: {
    "approval-step": require("components/ApprovalSteps/ApprovalStep.vue")
      .default,
    "list-header": require("components/Shared/ListHeader.vue").default
  }
};
</script>
