<template>
  <q-page>
    <div class="row justify-center">
      <div class="page-title">
        <div class="col-auto text-primary">Danh sách lịch họp</div>
      </div>
    </div>
    <div class="row">
      <q-date
        class="col-12"
        v-model="date"
        :events="events"
        @click="selectDateBooking"
      />
    </div>
    <div class="q-px-lg q-pb-md">
      <q-timeline color="secondary">
        <q-timeline-entry heading> Lịch họp ngày {{ date }} </q-timeline-entry>
        <div v-for="(value, index) in listMeeting" :key="index">
          <q-timeline-entry
            v-bind:title="value.TITLE"
            v-bind:subtitle="` ${value.START_TIME.substring(
              11,
              16
            )}h - ${value.END_TIME.substring(11, 16)}h`"
          >
          <span class="text-bold">Người chủ trì: {{ value.LAST_NAME }}</span>
            <div>{{ value.CONTENT }}</div>
          </q-timeline-entry>
        </div>
      </q-timeline>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      events: [],
      date: null,
      listMeeting: []
    };
  },
  created() {
    this.loadDateBooking();
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
      ...mapActions("meeting", [
      "getAllDateBooking",
      "getAllBookingInDay",

    ]),
    async loadDateBooking() {
      this.events = [];
      const data = await this.getAllDateBooking({ accountId: this.userInfo.id });
      console.log("data", data);
      if (data.length > 0) {
        data.forEach((el) => {
          this.events.push(moment(el.DATE_SELECT).format("YYYY/MM/DD"));
        });
      }
      console.log("event", this.events);
    },
    async selectDateBooking() {
      this.listMeeting = [];
      const payload = {
        date: moment(this.date).format("YYYY-MM-DD"),
        accountId: this.userInfo.id
      };
      const data = await this.getAllBookingInDay(payload);
      if (data.length > 0) {
        this.listMeeting = data;
      }
    },
  },
};
</script>

<style>
</style>