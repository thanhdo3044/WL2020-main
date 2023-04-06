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
          {{ task.title }} {{ task.number }}/2020/TH
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
      <q-item-section v-if="!task.Requests.length" side>
        <div class="row">
          <q-btn
            @click.stop="promptToDelete(task.id)"
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
      showEditTask: false
    };
  },
  created() {
    console.log("aa", this.task);
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
    ...mapActions("orders", ["deleteOrder"]),
    promptToDelete(id) {
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
          this.deleteOrder(id);
        });
    },
    goDetail(name) {
      this.$router.push({
        name,
        query: { id: this.task.id }
      });
    }
  }
};
</script>
