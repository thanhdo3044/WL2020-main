<template>
  <q-card style="border-radius:8px">
    <q-card-section  v-if="order.proposalFormId != 1042" class="bg-primary text-white" style="font-size:16px">
      {{order.title}}
    </q-card-section>
    <q-card  v-for="datas of dataErrorTime" :key="datas.id" v-if="order.proposalFormId == 1042" class=" text-black" style="font-size:16px">
      <q-list bordered   class="rounded-borders" style="max-width: 350px">
        <q-item-label header class="bg-primary text-white text-center">Danh sách lỗi chấm công</q-item-label>

        <q-item lines clickable @click="submitTask" v-ripple v-for="data in datas" :key="data.id">
          <q-item-section avatar top>
            <q-avatar icon="warning" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="2">{{data.account}} - {{data.last_name}}</q-item-label>
            <q-item-label caption></q-item-label>
            <q-item-label caption>{{data.date}} - {{data.time}}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <!-- <q-icon name="info" color="green" /> -->
            <q-item-label class="text-red text-bold" caption>Trạng thái : {{data.status}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
    <q-list>


    </q-list>
    <form v-if="order.proposalFormId != 1042"  @submit.prevent="submitForm">
      <q-card-section>
        <modal-task-name :name.sync="order.title" ref="modalTaskName" />
      </q-card-section>
      <modal-buttons style="margin-top:-40px"></modal-buttons>
    </form>
  </q-card>
</template>

<script>
import { mapActions ,mapGetters } from "vuex";

export default {
  props: ["order","dataErrorTime"],
  data() {
    return {
      taskToSubmit: {
        name: "",
        dueDate: "",
        dueTime: "",
        completed: false,
        employeeCode:"",
        dataErrorTime:[]
      }
    };
  },
  computed:{
    ...mapGetters("base", ["userInfo"]),
  },
  async created() {
      
  },
  methods: {
    ...mapActions("orders", ["addOrder","getAllOrders"]),
    ...mapActions("document", ["getDocument", "importDocument"]),
    submitForm() {
      this.$refs.modalTaskName.$refs.name.validate();
      if (!this.$refs.modalTaskName.$refs.name.hasError) {
        this.submitTask();
      }
    },
    async submitTask() {
      console.log('this.order',this.order);
      let data = await this.addOrder(this.order);
      console.log('data',data);
      let slug = this.order.slug;
      console.log('slug',slug)
      console.log('data',data.data.data.id);
       this.$router.push({
        name : slug,
        query: {  
                  id: data.data.data.id,
                  status: "Mới"
                }
      });
      this.getAllOrders(this.userInfo.id)
      this.$emit("close");
    }
  },
  components: {
    "modal-header": require("components/eof/Requests/Modals/Shared/ModalHeader.vue")
      .default,
    "modal-task-name": require("components/eof/Requests/Modals/Shared/ModalTaskName.vue")
      .default,
    "modal-buttons": require("components/eof/Requests/Modals/Shared/ModalButtons.vue")
      .default
  }
};
</script>
