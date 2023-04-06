<template>
  <div>
    <q-item
      @click="goDetail(task.code)"
      :class="!completed ? 'bg-orange-1' : 'bg-green-1'"
      clickable
      v-ripple
    >
      <q-item-section>
        <q-item-label class="text-subtitle2">
          [{{ task.itemCode }}] - {{ task.itemName }} ({{ task.itemHeight }}*{{
            task.itemWidth
          }}*{{ task.itemLength }})
        </q-item-label>
        <q-item-label caption lines="2">
          <span
            class="q-badge flex inline items-center no-wrap q-badge--single-line bg-teal"
            >{{ task.number.toUpperCase()
            }}{{ task.market ? " * " + task.root : "" }}</span
          >
        </q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-item-label caption>{{
          moment(task.ngayDongGoi)
            .subtract(
              Math.ceil(task.thoiGianBatDau + +task.thoiGianCho),
              "days"
            )
            .format("L")
        }}</q-item-label>
        <!-- <q-badge
          color="teal"
          :label="
            completed ? task.totalQuantity : task.target - task.totalQuantity
          "
        /> -->
      </q-item-section>
      <!-- <q-item-section side top>
      <q-checkbox
        v-model="task.completed"
        class="no-pointer-events" />
    </q-item-section>

    <q-item-section>
      <q-item-label
      	:class="{ 'text-strikethrough' : task.completed }">
      	{{ task.name }}
      </q-item-label>
    </q-item-section>

    <q-item-section 
      v-if="task.dueDate"
      side>
    	<div class="row">
    		<div class="column justify-center">
		    	<q-icon 
		    		name="event"
		    		size="18px"
		    		class="q-mr-xs" />
    		</div>
	    	<div class="column">
          <q-item-label 
          	class="row justify-end"
          	caption>
          	{{ task.dueDate }}
          </q-item-label>
          <q-item-label
          	class="row justify-end"
          	caption>
          	<small>{{ task.dueTime }}</small>
          </q-item-label>
	    	</div>
    	</div>
    </q-item-section>

    <q-item-section side>
      <div class="row">
        <q-btn
          @click.stop="showEditTask = true"
          flat
          round
          dense
          color="primary"
          icon="edit" />
        <q-btn
          @click.stop="promptToDelete(id)"
          flat
          round
          dense
          color="red"
          icon="delete" />
      </div>
    </q-item-section>

    <q-dialog v-model="showEditTask">
      <edit-task 
        @close="showEditTask = false" 
        :task="task"
        :id="id" />
      </q-dialog>-->
    </q-item>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["task", "id", "completed"],
  data() {
    return {
      showEditTask: false
    };
  },
  methods: {
    ...mapActions("tasks", ["updateTask", "deleteTask"]),
    promptToDelete(id) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Really delete?",
          ok: {
            push: true
          },
          cancel: {
            color: "negative"
          },
          persistent: true
        })
        .onOk(() => {
          this.deleteTask(id);
        });
    },
    goDetail(po) {
      if (this.completed) return;
      this.$router.push({
        name: "confirm-po",
        params: { code: po + "_" + this.task.number }
      });
    }
  },
  components: {
    "edit-task": require("components/Tasks/Modals/EditTask.vue").default
  }
};
</script>

<style></style>
