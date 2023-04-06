<template>
  <q-card>
    <modal-header>Tạo đề xuất 
      </br>{{order.title}}
    </modal-header>

    <form @submit.prevent="submitForm">
      <q-card-section>
        <modal-task-name :name.sync="order.title" ref="modalTaskName" />
      </q-card-section>

      <modal-buttons></modal-buttons>
    </form>
  </q-card>
</template>

<script>
import { mapActions ,mapGetters } from "vuex";

export default {
  props: ["order"],
  data() {
    return {
      taskToSubmit: {
        name: "",
        dueDate: "",
        dueTime: "",
        completed: false
      }
    };
  },
  computed:{
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("orders", ["addOrder","getAllOrders"]),
    submitForm() {
      this.$refs.modalTaskName.$refs.name.validate();
      if (!this.$refs.modalTaskName.$refs.name.hasError) {
        this.submitTask();
      }
    },
    async submitTask() {
      console.log('this.order',this.order);
      let data = await this.addOrder(this.order);
      let slug = this.order.slug;
      console.log('slug',slug)
      console.log('data',data.data.id);
       this.$router.push({
        name : slug,
        query: {  
                  id: data.data.id,
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
