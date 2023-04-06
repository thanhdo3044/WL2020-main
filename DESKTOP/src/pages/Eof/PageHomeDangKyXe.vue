<template>
  <q-page>
    <q-btn color="primary" @click="goBack" flat icon="keyboard_arrow_left" label="Trở lại" />
    <!-- <div class="row">
      <div class="col-10 q-pa-sm">
        <q-input outlined v-model="searchQuery" type="text" label="Tìm kiếm" />
      </div>
      <div class="col-2 q-pa-sm" align="right">
        <q-btn color="primary" glossy class="full-height" @click="search" icon="search" />
      </div>
    </div> -->
    <!-- <q-search
  v-model="orders.data"
  :debounce="600"
  placeholder="Hotels"
  icon="local_hotel"
  float-label="What is your hotel?"
/> -->
    <no-tasks v-if="orders.data && !orders.data.length"></no-tasks>
    <tasks-todo v-else :request="request" :tasksTodo="orders.data" />
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
import axios from "axios";
export default {
  data() {
    return {
      request: {},
      searchQuery: "",
      showAddTask: false,
      order: {},
      dataReceipt: [],
      dupplicateData: [],
      resultString: "",
      title: "",
      proposalForms: []
    };
  },
  computed: {
    ...mapGetters("orders", ["orders", "dSBieuMauSuDung"]),
    ...mapGetters("base", ["userInfo"])
  },
  methods: {
    search() {
      if (this.searchQuery.length > 0) {
        this.dataReceipt = this.dupplicateData.filter(d => {
          const matchString =
            // d.itemCode.toString() +
            // " " +
            // d.itemName.toString() +
            // " " +
            // d.itemHeight +
            // " " +
            // d.itemWidth +
            // " " +
            // d.itemLength +
            // " " +
            // d.code +
            d.number.toString();
          return matchString
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        });
      } else {
        this.dataReceipt = this.dupplicateData;
      }
      this.resultString =
        "Tìm thấy " +
        this.dataReceipt.length.toString() +
        ' kết quả cho từ khóa "' +
        this.searchQuery +
        '"';
    },
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
      this.$router.go(-1);
    }
  },
  components: {
    "add-task": require("components/eof/Requests/Modals/AddTask.vue").default,
    "tasks-todo": require("components/eof/Requests/TasksTodo.vue").default,
    "no-tasks": require("components/eof/Requests/NoTasks.vue").default
  },
  async created() {
    await axios
      .get("http://localhost:2003/api/v3/cars/reportListStatusCar")
      .then(res => (this.request = res.data))
      .catch(err => console.log("err", err));
   await this.getAllOrders(this.userInfo.id);
  },
  mounted() {
    this.$root.$on("showAddOrder", () => {
      this.showAddTask = true;
    });
    this.proposalForms = this.dSBieuMauSuDung;
  }
};
</script>
