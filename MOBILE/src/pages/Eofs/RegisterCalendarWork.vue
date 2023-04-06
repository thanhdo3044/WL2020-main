<template>
  <div>
    <q-btn
      color="primary"
      style=""
      @click="goBack()"
      flat
      icon="keyboard_arrow_left"
      label="Trở lại sdsd"
    />
    <q-select class="q-ml-lg q-mr-lg" filled v-model="model" :options="options" label="Tùy chọn hiển thị" >
      <template v-slot:prepend>
          <q-icon name="event" />
        </template>
    </q-select>
    <CalendarWorkMonth :events="events" v-if="model == 'MONTH'"></CalendarWorkMonth>
    <CalendarWorkOneDay :events="events" v-if="model =='1 DAY'"></CalendarWorkOneDay>
    <CalendarWorkThreeDay :events="events" v-if="model =='3 DAY'"></CalendarWorkThreeDay>
    <CalendarWorkWeek :events="events" v-if="model == 'WEEK'"></CalendarWorkWeek>
  </div>
</template>
<script>
// normally you would not import "all" of QCalendar, but is needed for this example to work with UMD (codepen)
import QCalendar from '@quasar/quasar-ui-qcalendar' // ui is aliased from '@quasar/quasar-ui-qcalendar'
import { mapGetters, mapAction } from "vuex";
import axios from 'axios';
import CalendarWorkOneDay from 'components/eof/CalendarWork/CalendarWorkOneDay.vue'
import CalendarWorkThreeDay from 'components/eof/CalendarWork/CalendarWorkThreeDay.vue'
import CalendarWorkWeek from 'components/eof/CalendarWork/CalendarWorkWeek.vue'
import CalendarWorkMonth from 'components/eof/CalendarWork/CalendarWorkMonth.vue'
export default {
  components:{
    CalendarWorkWeek,
    CalendarWorkOneDay,
    CalendarWorkThreeDay,
    CalendarWorkMonth
  },
  async created(){
   await this.loadData();
   console.log(this.userInfo.id)
    this.getRandomColor(8);
    this.$store.getters["orders/accounts"].forEach(el =>{
      this.dataAccount.push({
        label:el.lastName,
        value:el.id
      })
    })
  },
  data () {
    return {
      model:"",
      options:['1 DAY','3 DAY','WEEK','MONTH'],
      optionsAccount:[],
      sumPeople:null,
      summary:"",
      description:"",
      location:"",
      dateStart:"",
      dateEnd:"",
      prompt: false,
      calendarWork: {},
      title:"",
      numberPhone:"",
      selectedDate: '',
      calendarWork:[],
      colorRandom:"",
      events:[

      ],
      dataAccount:[],
      myAccount:null,
    }
  },
  computed:{
    ...mapGetters("base",["userInfo"]),
    ...mapGetters("orders",["accounts"])
  },
  methods: {
    filterFn (val, update) {
      this.myAccount =null;
      if (val === '') {
        update(() => {
          this.optionsAccount = this.dataAccount
        })
        return
      }

      update(() => {
        const needle = val

        console.log('needle',needle)
        this.optionsAccount = this.dataAccount.filter(v => v.label == needle)
      })
    },
    randomNameGenerator (num){
    let res = '';
    for(let i = 0; i < num; i++){
        const random = Math.floor(Math.random() * 27);
        res += String.fromCharCode(97 + random);
    };
    console.log("name color",res)
    return res;
    },
    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        console.log('color',color)
        this.colorRandom= color;
    },
    // async chonAccount(val){
    //   console.log('chon account',val)
    //   this.loadDataSearch(val);
    // },
    // async loadDataSearch(val){
    //   await axios.get("http://localhost:1010/api/v1/calendarWorkSearch?id="+ val.value)
    //               .then(res => this.calendarWork = res.data)
    //               this.events = this.calendarWork.data
    // },
    // async loadData(){
    //   await axios
    //   .get("http://localhost:1010/api/v1/calendarWork?id=" + this.userInfo.id)
    //   .then(response => this.calendarWork = response.data);
    // this.events = this.calendarWork.data
    // },
    goBack() {
      this.$router.go(-1);
    },
     onPrevM () {
      this.$refs.calendarMonth.prev()
    },
    onNextM () {
      this.$refs.calendarMonth.next()
    },
    onPrevD () {
      this.$refs.calendar.prev()
    },
    onNextD () {
      this.$refs.calendar.next()
    },
    onPrev3D () {
      this.$refs.calendar3D.prev()
    },
    onNext3D () {
      this.$refs.calendar3D.next()
    },
    onPrevW () {
      this.$refs.calendarWEEK.prev()
    },
    onNextW () {
      this.$refs.calendarWEEK.next()
    },
    isCssColor (color) {
      return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
    },
    badgeClasses (event, type) {
      const cssColor = this.isCssColor(event.bgcolor)
      const isHeader = type === 'header'
      return {
        [`text-white bg-${event.bgcolor}`]: !cssColor,
        'full-width': !isHeader && (!event.side || event.side === 'full'),
        'left-side': !isHeader && event.side === 'left',
        'right-side': !isHeader && event.side === 'right'
      }
    },

    badgeStyles (event, type, timeStartPos, timeDurationHeight) {
      const s = {}
      if (this.isCssColor(event.bgcolor)) {
        s['background-color'] = event.bgcolor
        s.color = luminosity(event.bgcolor) > 0.5 ? 'black' : 'white'
      }
      if (timeStartPos) {
        s.top = timeStartPos(event.time) + 'px'
      }
      if (timeDurationHeight) {
        s.height = timeDurationHeight(event.duration) + 'px'
      }
      s['align-items'] = 'flex-start'
      return s
    },
    

    getEvents (dt) {
      const currentDate = QCalendar.parseTimestamp(dt)
      const events = []
      for (let i = 0; i < this.events.length; ++i) {
        let added = false
        if (this.events[i].date === dt) {
          if (this.events[i].time) {
            if (events.length > 0) {
              // check for overlapping times
              const startTime = QCalendar.parseTimestamp(this.events[i].date + ' ' + this.events[i].time)
              const endTime = QCalendar.addToDate(startTime, { minute: this.events[i].duration })
              for (let j = 0; j < events.length; ++j) {
                if (events[j].time) {
                  const startTime2 = QCalendar.parseTimestamp(events[j].date + ' ' + events[j].time)
                  const endTime2 = QCalendar.addToDate(startTime2, { minute: events[j].duration })
                  if (QCalendar.isBetweenDates(startTime, startTime2, endTime2) || QCalendar.isBetweenDates(endTime, startTime2, endTime2)) {
                    events[j].side = 'left'
                    this.events[i].side = 'right'
                    events.push(this.events[i])
                    added = true
                    break
                  }
                }
              }
            }
          }
          if (!added) {
            this.events[i].side = undefined
            events.push(this.events[i])
          }
        }
        else if (this.events[i].days) {
          // check for overlapping dates
          const startDate = QCalendar.parseTimestamp(this.events[i].date)
          const endDate = QCalendar.addToDate(startDate, { day: this.events[i].days })
          if (QCalendar.isBetweenDates(currentDate, startDate, endDate)) {
            events.push(this.events[i])
            added = true
          }
        }
      }
      return events
    },
    
  },
}
</script>

<style src="@quasar/quasar-ui-qcalendar/dist/index.css" scoped>
.text-bold{
  font-weight:bold;
}
</style>
