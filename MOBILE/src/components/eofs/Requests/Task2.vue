<template>
  <div>
    <q-item
      @click="goDetail(task.ProposalForm.slug)"
      :class="!task.completed ? 'bg-orange-1' : 'bg-green-1'"
      clickable
      v-ripple
    >
      <q-item-section side top>
        <q-checkbox v-model="task.completed" class="no-pointer-events" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle2">
          {{ task.title }} {{ task.number }}/2021/TH
        </q-item-label>

        <q-item-label caption lines="2"
          >[{{ task.Account.account }}]
          {{ task.Account.lastName }}</q-item-label
        >
        <q-item-label caption lines="2">{{
          task.Department.name
        }}</q-item-label>

        <q-item-label caption lines="2"
          >Bắt đầu : {{ task.OrderMeta[0].fromLocation }} /
          {{ CutStringDate(task.OrderMeta[0].dateStart) }}
          {{ CutStringTime(task.OrderMeta[0].dateStart) }}
        </q-item-label>
        <q-item-label caption lines="2"
          >Kết thúc : {{ task.OrderMeta[0].toLocation }} /
          {{ CutStringDate(task.OrderMeta[0].dateEnd) }}
          {{ CutStringTime(task.OrderMeta[0].dateEnd) }}</q-item-label
        >
        <q-item-label caption lines="2"
          ><q-badge color="teal" :label="task.status" />
        </q-item-label>
      </q-item-section>
      <q-item-section side top>
        <q-item-label caption>{{
          moment(task.createdAt).format("L")
        }}</q-item-label>
      </q-item-section>
      <!-- v-if="!task.Requests.length" -->
      <q-item-section 
      side>
        <div class="row">
          <q-btn
            @click.stop="promptToDelete(task)"
            flat
            round
            dense
            color="red"
            icon="delete"
          />
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["task", "id", "completed", "request"],
  data() {
    return {
      showEditTask: false,
      status: this.task.status.replace(/\s/g, '')
    };
  },
  created() {
    console.log("aa", this.task);
    console.log("status",  this.task.status.replace(/\s/g, ''));
    this.CutStringDate(this.task.OrderMeta[0].dateStart.toString());
  },
  methods: {
    CutStringDate(val) {
      let resultDsp = " ";
      if (val != null) return (resultDsp = val.slice(0, 10));
      else return resultDsp;
    },
    CutStringTime(val) {
      let resultDsp = " ";
      if (val != null) return (resultDsp = val.slice(11, 19));
      else return resultDsp;
    },
    ...mapActions("orderMetas", ["deleteOrderMetaDetail"]),
    ...mapActions("orders", ["deleteOrder"]),
    ...mapActions("requests", ["deleteRequest"]),
    promptToDelete(id) {
      console.log('id',id)
      this.$q
        .dialog({
          title: "Xác nhận",
          message: "Bạn thực sự muốn xóa?",
          ok: {
            push: true
          },
          cancel: {
            color: "negative"
          },
          persistent: true
        })
        .onOk(() => {
          console.log('id.Requests.length',id.Requests.length)
          if(id.Requests.length > 0){
            this.deleteOrder(id.id);
          console.log('xóa order - ordermeta - xóa request');
          this.deleteOrderMetaDetail(id.id);
          for(let i = 0;i < id.Requests.length;i++){
          this.deleteRequest(id.Requests[i].orderId);
          };
          }else{
          this.deleteOrder(id.id);
          console.log('xóa order - ordermeta');
          this.deleteOrderMetaDetail(id.id);
          }
          

        });
    },
    goDetail(name) {
      console.log('this.task',this.task.id)
      this.$router.push({
        name,
        query: { id: this.task.id}
      });
    }
  }
};
</script>
