<template>
  <div class="q-mt-lg">
    <div class="q-gutter-md">
      <q-select
        outlined
        v-model="model"
        :options="getAllCongDoan"
        label="Công đoạn"
        label-color="orange"
        emit-value
        map-options
      />
      <q-input color="grey-3" label-color="orange" outlined v-model="week" label="Tuần">
        >
        <template v-slot:append>
          <q-icon name="next_week" color="orange" />
        </template>
      </q-input>
      <q-input color="grey-3" label-color="orange" outlined v-model="soLenh" label="Số lệnh">
        <template v-slot:append>
          <q-icon name="work" color="orange" />
        </template>
      </q-input>
      <q-btn color="teal" class="full-right" @click="pheDuyetPhoi">
        <q-icon left size="3em" name="done_all" />
        <div>Phê duyệt</div>
      </q-btn>
      <q-separator spaced inset vertical dark />
    </div>

    <list-header bgcolor="bg-orange-4">Danh sách chờ duyệt</list-header>

    <q-list separator bordered>
      <task
        v-for="(task, key) in taskFiltered"
        :key="key"
        :task="task"
        :id="key"
        :completed="false"
      ></task>
    </q-list>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      week: "",
      soLenh: "",
      model: null
    };
  },
  methods: {
    ...mapActions("po", ["duyetPhoi"]),
    pheDuyetPhoi() {
      let poIds = this.taskFiltered.map(po => po.id);
      this.duyetPhoi(poIds);
    }
  },
  computed: {
    ...mapGetters("po", ["pos", "getAllCongDoan", "getAllPos"]),
    taskFiltered() {
      let posFilter = this.tasksTodo.filter(po => true);
      if (this.week.length)
        posFilter = posFilter.filter(po => po.week == this.week);
      if (this.soLenh.length)
        posFilter = posFilter.filter(po => po.number.includes(this.soLenh));
      if (this.model)
        posFilter = posFilter.filter(po => po.stepId == this.model);
      return posFilter;
    }
  },
  props: ["tasksTodo"],
  components: {
    task: require("components/TaoPhoi/Task.vue").default,
    "list-header": require("components/Shared/ListHeader.vue").default
  }
};
</script>
