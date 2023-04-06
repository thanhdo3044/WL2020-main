<template>
  <q-item
    @click="updateTask"
    :class="!task.completed ? 'bg-orange-1' : 'bg-green-1'"
    clickable
    v-ripple
    v-if="result < 30 && task.status != 'Không'"
  >
    <q-item-section side top>
      <!-- <q-checkbox v-model="task.completed" class="no-pointer-events" /> -->
    </q-item-section>

    <q-item-section>
      <q-item-label style="font-size:16px" :class="{ 'text-strikethrough': task.completed }">{{
        task.title
      }}</q-item-label>
      <q-item-label class="row q-mt-sm" caption>
        <small style="font-size:14px">{{ task.LAST_NAME }} - {{ task.ACCOUNT }} </small>
         <small class="q-ml-sm"><b v-if="task.priorityLevel ==  true" style="padding:2px ; border-radius:5px" class="bg-red text-white">Ưu tiên</b>  </small>
      </q-item-label>
    </q-item-section>

    <q-item-section v-if="task.createdAt" side>
      <div class="row">
        <div class="column justify-center">
          <q-icon name="event" size="18px" class="q-mr-xs" />
        </div>
        <div class="column">
          <q-item-label class="row justify-end" caption>{{
            task.createdAt | ngay
          }}</q-item-label>
          <q-item-label class="row justify-end" caption>
            <small>{{ task.orderableType }}</small>
          </q-item-label>
          <q-item-label v-if="result > 1 && task.slug == 'xac-nhan-cong'" class="row justify-end" caption>
            <q-badge color="red" label="Quá hạn" />
          </q-item-label>
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapActions } from "vuex";
import moment from "moment";
export default {
  props: ["task"],
  methods: {
    ...mapActions("base", ["getOneAccount"]),
    updateTask() {
      this.$router.push({
        name: "request",
        query: { id: this.task.id }
      });
    },
    getAccountName(accountId) {
      console.log(accountId);
      let x = this.getOneAccount(accountId);
      return x.lastName;
    }
  },
  created(){
    let now = moment();
    let createdAt = moment(this.task.createdAt);
    this.result = now.diff(createdAt, 'days');
    console.log("result ", this.result);
    console.log("task",  this.task);
  },
  data(){
    return{
      result: null
    }
  }
};
</script>

<style></style>
