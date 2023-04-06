<template>
  <q-page>
    <q-btn color="primary" @click="goBack" flat icon="keyboard_arrow_left" label="Trở lại" />
    <no-tasks v-if="orders.data && !orders.data.length"></no-tasks>
    <tasks-todo v-else :tasksTodo="orders.data" />
    <q-fab
      fabRight: true
      vertical-actions-align="right"
      color="primary"
      glossy
      icon="keyboard_arrow_up"
      direction="up"
      class="absolute-bottom-right"
    >
      <q-fab-action v-for="proposalForm in dSBieuMauSuDung" :key="proposalForm.id"
        label-position="left"
        color="primary"
        @click="themDeXuat(proposalForm)"
        icon="alarm"
        :label="proposalForm.name"
      />
    </q-fab>
    <q-dialog v-model="showAddTask">
      <add-task @close="showAddTask = false" :order="order" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      showAddTask: false,
      order: {},
      title: "",
      proposalForms: []
    };
  },
  computed: {
    ...mapGetters("orders", ["orders", "dSBieuMauSuDung"]),
    ...mapGetters("base", ["userInfo"])
  },
  methods: {
    ...mapActions("orders", ["getAllOrders", "resetOrder"]),
    themDeXuat(proposalForm) {
      this.order = Object.assign(
        {},
        {
          accountId: this.userInfo.id,
          proposalFormId: proposalForm.id,
          departmentId: this.userInfo.departmentId,
          title: proposalForm.name,
          factoryId: this.userInfo.factoryId
        }
      );
      console.log(this.order);
      this.showAddTask = true;
    },
    goBack() {
      this.$router.go(-2);
    }
  },
  components: {
    "add-task": require("components/eofs/Requests/Modals/AddTask.vue").default,
    "tasks-todo": require("components/eofs/Requests/TasksTodo.vue").default,
    "no-tasks": require("components/eofs/Requests/NoTasks.vue").default
  },
  created() {
    this.getAllOrders(this.userInfo.id);
  },
  mounted() {
    this.$root.$on("showAddOrder", () => {
      this.showAddTask = true;
    });
    this.proposalForms = this.dSBieuMauSuDung;
  }
};
</script>
