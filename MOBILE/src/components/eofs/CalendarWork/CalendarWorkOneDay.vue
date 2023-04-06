<template>
<div class = "q-pl-sm q-pr-sm" style="max-width: 100%; width: 100%;">
    <q-select
        class="q-ml-lg q-mt-lg q-mr-lg"
        filled
        @input="chonAccount"
        v-model="myAccount"
        use-input
        input-debounce="0"
        label="Chọn người hiển thị"
        :options="optionsAccount"
        @filter="filterFn"
        behavior="menu"
      >
        <template v-slot:prepend>
          <q-icon name="people" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    <div class="row justify-center items-center" style="height: 50px;">
        <q-btn flat dense label="Prev" color="primary" @click="calendarPrev" />
        <q-separator vertical />
        <q-btn flat dense label="Next" color="primary" @click="calendarNext" />
    </div>
    <q-calendar v-model="selectedDate" animated
        transition-prev="slide-right"
        transition-next="slide-left" ref="calendar" view="day" locale="vi" class="calendar-container" style="border:1px solid #ccc;height: 100%;" @input="onModelChanged" @click:date2="onClickDate2" @click:day:header2="onClickDayHeader2" @click:interval2="onClickInterval2" @click:time2="onClickTime2" @click:interval:header2="onClickIntervalHeader2">
        <template #day-header="{ timestamp }">
            <div class="row justify-center">
                <template v-for="(event, index) in eventsMap[timestamp.date]">
                    <q-badge v-if="!event.time" :key="index" style="width: 100%; cursor: pointer;" :class="badgeClasses(event, 'header')" :style="badgeStyles(event, 'header')">
                        <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs"></q-icon><span class="ellipsis">{{ event.title }}</span>
                    </q-badge>
                    <q-badge v-else :key="index" class="q-ma-xs" :class="badgeClasses(event, 'header')" :style="badgeStyles(event, 'header')" style="width: 10px; max-width: 10px; height: 10px; max-height: 10px" />
                </template>
            </div>
        </template>

        <template #day-body="{ timestamp, timeStartPos, timeDurationHeight }">
            <template v-for="(event, index) in getEvents(timestamp.date)">
                <q-badge v-if="event.time" :key="index" class="my-event justify-center ellipsis" :class="badgeClasses(event, 'body')" :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)">
                    <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs"></q-icon>
                        <div style="width:100%;height:100%; font-size:auto" class="ellipsis" >
                            <!-- </br>
                            Tiêu đề : {{ event.title }}
                            </br>-->
                             Thời gian bắt đầu : {{event.date}} / {{event.time}} 
                        </div>
                </q-badge>
            </template>
        </template>
    </q-calendar>
    <DialogAddCalendarWork v-on:childToParent2="onChildClick2" v-on:childToParent="onChildClick" :dialog="dialogAdd" :selectedDate="selectedDate" v-if="dialogAdd" ></DialogAddCalendarWork>
    <DialogEditCalendarWork v-on:childToParent="onChildClick" 
    :dialog="dialogEdit"
    :endDate="endDate"
    :title="title"
    :id="id"
    :sumPeople="sumPeople"
    :description="description"
    :location="location"
    :numberPhone="numberPhone"
    :startDate="startDate" 
    v-if="dialogEdit"></DialogEditCalendarWork>
    <q-dialog style="z-index :99999" v-model="dialogSel" >
        <q-card >
            <q-list bordered>
                <q-banner inline-actions rounded class="bg-orange text-white text-center">
                    Danh sách chi tiết lịch đăng kí thời gian 
                    </br> {{this.selectedDate}}
                </q-banner>
                <q-item v-for="dataActives in dataActive.data" :key="dataActives.id">
                    <q-card class="">
                        <div class="q-pa-sm">
                            <b>Mã</b> : {{dataActives.id}}
                        </div>
                        <div class="q-pa-sm">
                            <b>Tiêu đề</b> : {{dataActives.title}}
                        </div>
                        <div class="q-pa-sm">
                            <b>Tên người đăng kí</b> : {{dataActives.ACCOUNT}}
                        </div>
                        <div class="q-pa-sm">
                            <b>Địa điểm</b> : {{dataActives.location}}
                        </div>
                        <div class="q-pa-sm">
                            <b>Thời gian bắt đầu</b> : 
                            {{dataActives.startDate.slice(0,10)}}
                            / {{dataActives.startDate.slice(11,16)}}
                        </div>
                        <div class="q-pa-sm">
                            <b>Thời gian kết thúc</b> : 
                            {{dataActives.endDate.slice(0,10)}}
                            / {{dataActives.endDate.slice(11,16)}}
                        </div>
                        <div class="q-pa-sm">
                            <b>Số điện thoại liên lạc</b> : 
                            {{dataActives.numberPhone}}
                        </div>
                        <div class="q-pa-sm">
                            <b>Chú thích</b> : 
                            {{dataActives.description}}
                        </div>
                        <div class="q-pa-sm">
                            <b>Số lượng người</b> : 
                            {{dataActives.sumPeople}}
                        </div>
                        <div class="q-pa-sm">
                            <b>Trạng thái</b> : 
                            {{dataActives.permission == 0 ? "Riêng tư" : "Công khai"}}
                        </div>
                        <div class="float-right">
                            <q-icon class="bg-primary q-ma-sm q-pa-sm" style="font-size: 1.5em;border-radius:50%"  name="delete" flat label="Thoát" @click="delCalendarDetail(dataActives.id)" color="white"  v-close-popup />
                            <q-icon class="bg-primary q-pa-sm" style="font-size: 1.5em;border-radius:50%" name="edit" flat label="Xóa" 
                            @click="editCalendarDetail(dataActives.sumPeople,dataActives.description,dataActives.startDate,dataActives.endDate,dataActives.id,dataActives.title,dataActives.numberPhone,dataActives.location)" 
                            color="white" 
                            v-close-popup  />
                        </div>
                    </q-card>
                </q-item>
            <!-- <q-btn class="float-right"  flat label="Thoát" @click="dialogDetail = false" color="primary" v-close-popup /> -->
            </q-list>
        </q-card>
    </q-dialog>
    <q-dialog v-model="dialog2" >
        <q-card>
            <q-card-section class="row items-center">
                <span class="q-ml-sm text-primary text-h6" style="" icon="event">Ấn thêm lịch làm việc hoặc xem chi tiết lịch làm việc.</span>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Xem chi tiết" @click="dialogSel = true" color="primary" v-close-popup />
                <div v-if="!myAccount">
                    <q-btn flat label="Thêm" @click="dialogAdd = true" color="primary" v-close-popup />
                </div>
                <div v-else-if="myAccount">
                    <div v-if="myAccount.value == this.userInfo.id">
                          <q-btn flat label="Thêm" @click="dialogAdd = true" color="primary" v-close-popup />
                    </div>
                </div>
                
            </q-card-actions>
        </q-card>
    </q-dialog>
</div>
</template>

<script>
import DialogAddCalendarWork from 'components/eofs/CalendarWork/DialogAddCalendarWork.vue'
import DialogEditCalendarWork from 'components/eofs/CalendarWork/DialogEditCalendarWork.vue'
import{mapGetters} from 'vuex';
import axios from 'axios';
import QCalendar from '@quasar/quasar-ui-qcalendar' // ui is aliased from '@quasar/quasar-ui-qcalendar';
import { userInfo } from 'os';
const CURRENT_DAY = new Date()

function getCurrentDay(day) {
    const newDay = new Date(CURRENT_DAY)
    newDay.setDate(day)
    const tm = QCalendar.parseDate(newDay)
    return tm.date
}

const reRGBA = /^\s*rgb(a)?\s*\((\s*(\d+)\s*,\s*?){2}(\d+)\s*,?\s*([01]?\.?\d*?)?\s*\)\s*$/

function textToRgb(color) {
    if (typeof color !== 'string') {
        throw new TypeError('Expected a string')
    }
    const m = reRGBA.exec(color)
    if (m) {
        const rgb = {
            r: Math.min(255, parseInt(m[2], 10)),
            g: Math.min(255, parseInt(m[3], 10)),
            b: Math.min(255, parseInt(m[4], 10))
        }
        if (m[1]) {
            rgb.a = Math.min(1, parseFloat(m[5]))
        }
        return rgb
    }
    return hexToRgb(color)
}

function hexToRgb(hex) {
    if (typeof hex !== 'string') {
        throw new TypeError('Expected a string')
    }

    hex = hex.replace(/^#/, '')

    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    } else if (hex.length === 4) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
    }

    const num = parseInt(hex, 16)

    return hex.length > 6 ?
        {
            r: num >> 24 & 255,
            g: num >> 16 & 255,
            b: num >> 8 & 255,
            a: Math.round((num & 255) / 2.55)
        } :
        {
            r: num >> 16,
            g: num >> 8 & 255,
            b: num & 255
        }
}

function luminosity(color) {
    if (typeof color !== 'string' && (!color || color.r === undefined)) {
        throw new TypeError('Expected a string or a {r, g, b} object as color')
    }

    const
        rgb = typeof color === 'string' ? textToRgb(color) : color,
        r = rgb.r / 255,
        g = rgb.g / 255,
        b = rgb.b / 255,
        R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4),
        G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4),
        B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)
    return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export default {
    props:["events","optionsAccount"],
    async created() {
        await this.loadData();
        sessionStorage.setItem('myAccount', this.userInfo.id);
        // this.myAccount = sessionStorage.getItem('myAccount');
        console.log('this.events', this.events)
        this.$store.getters["orders/accounts"].forEach(el =>{
            this.dataAccount.push({
                label:el.lastName,
                value:el.id
            })
        })
    },
    data() {
        return {
            dialogEdit:false,
            btnAdd:false,
            dialogSel:false,
            dialog2: false,
            dialog: false,
            dialogAdd: false,
            model: "",
            options: ['1 DAY', '3 DAY', 'WEEK', 'MONTH'],
            sumPeople: null,
            summary: "",
            description: "",
            location: "",
            dateStart: "",
            dateEnd: "",
            prompt: false,
            title: "",
            numberPhone: "",
            selectedDate: '',
            calendarWork: [],
            colorRandom: "",
            events1: [],
            dataActive:{},
            dataClick:null,
            id : null,
            dataAccount:[],
            myAccount:null,
            optionsAccount:[],
        }
    },
    components:{
        DialogEditCalendarWork,
        DialogAddCalendarWork
    },
    // mounted(){
    //     console.log("optionsAccount",this.optionsAccount)
    //     this.loadData()
    // },
    methods: {
    async chonAccount(val){
        console.log('chon account',val)
       await this.loadDataSearch(val);
    },
    async loadDataSearch(val){
        console.log('abc')
        if(val.value != this.userInfo.id){
            await axios.get("/api/v1/calendarWorkSearch?id="+ val.value)
                  .then(res => this.calendarWork = res.data)
                  this.events = this.calendarWork.data
        }else{
            console.log('abc2')
            await this.loadData();
        }
    },
    async loadData(){
      await axios
      .get("/api/v1/calendarWork?id=" + this.userInfo.id)
      .then(response => this.calendarWork = response.data);
    this.events = this.calendarWork.data
    },
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
    onChildClick (value) {
      this.dialogAdd = value
      this.dialogEdit = value
    },
    onChildClick2 (value) {
      this.events = value
    },
    onModelChanged (date) {
      this.dialog2=false;
      this.events.unshift(`Model changed: ${date}`)
    },
    async onClickDate2 (data) {
      this.selectedDate = JSON.stringify(data.scope.timestamp.year) 
        + "-" +JSON.stringify(data.scope.timestamp.month)
        +"-"+JSON.stringify(data.scope.timestamp.day) + " " +JSON.stringify(data.scope.timestamp.hour) + ":"+ JSON.stringify(data.scope.timestamp.minute)
        console.log('this.selectedDate',new Date(this.selectedDate))
        this.dialog2 =true;
        this.events.unshift(`click:time2: ${JSON.stringify(data)}`)
        if(this.myAccount != null){
            await axios({
            method:'POST',
            url:"/api/v1/calendarWorkSearch",
            data:{
                startDate: this.selectedDate,
                id : this.myAccount.value
            }
            }).then(res=>{
                if(res){
                    this.dataActive = res.data;
                    //  this.loadData();

                    console.log('this.dataActive',this.dataActive)
                }
            })
        }else{
            await axios({
            method:'POST',
            url:"/api/v1/calendarWorkSearch",
            data:{
                startDate: this.selectedDate,
                id : this.userInfo.id
            }
            }).then(res=>{
                if(res){
                    this.dataActive = res.data;
                    //  this.loadData();

                    console.log('this.dataActive',this.dataActive)
                }
            })
        }
    },
    async loadData(){
      await axios
      .get("/api/v1/calendarWork?id=" + this.userInfo.id)
      .then(response => this.calendarWork = response.data);
    this.events = this.calendarWork.data
    },
    async onClickDayHeader2 (data) {
      this.selectedDate = JSON.stringify(data.scope.timestamp.year) 
        + "-" +JSON.stringify(data.scope.timestamp.month)
        +"-"+JSON.stringify(data.scope.timestamp.day) + " " +JSON.stringify(data.scope.timestamp.hour) + ":"+ JSON.stringify(data.scope.timestamp.minute)
        console.log('this.selectedDate',new Date(this.selectedDate))
        this.dialog2 =true;
        this.events.unshift(`click:time2: ${JSON.stringify(data)}`)
        if(this.myAccount != null){
            await axios({
            method:'POST',
            url:"/api/v1/calendarWorkSearch",
            data:{
                startDate: this.selectedDate,
                id : this.myAccount.value
            }
            }).then(res=>{
                if(res){
                    this.dataActive = res.data;
                    //  this.loadData();

                    console.log('this.dataActive',this.dataActive)
                }
            })
        }else{
            await axios({
            method:'POST',
            url:"/api/v1/calendarWorkSearch",
            data:{
                startDate: this.selectedDate,
                id : this.userInfo.id
            }
            }).then(res=>{
                if(res){
                    this.dataActive = res.data;
                    //  this.loadData();

                    console.log('this.dataActive',this.dataActive)
                }
            })
        }
    },
    async onClickInterval2 (data) {
      this.selectedDate = JSON.stringify(data.scope.timestamp.year) 
        + "-" +JSON.stringify(data.scope.timestamp.month)
        +"-"+JSON.stringify(data.scope.timestamp.day) + " " +JSON.stringify(data.scope.timestamp.hour) + ":"+ JSON.stringify(data.scope.timestamp.minute)
        console.log('this.selectedDate',new Date(this.selectedDate))
        this.dialog2 =true;
        this.events.unshift(`click:time2: ${JSON.stringify(data)}`)
        if(this.myAccount != null){
            await axios({
            method:'POST',
            url:"/api/v1/calendarWorkSearch",
            data:{
                startDate: this.selectedDate,
                id : this.myAccount.value
            }
            }).then(res=>{
                if(res){
                    this.dataActive = res.data;
                    //  this.loadData();

                    console.log('this.dataActive',this.dataActive)
                }
            })
        }else{
            await axios({
            method:'POST',
            url:"/api/v1/calendarWorkSearch",
            data:{
                startDate: this.selectedDate,
                id : this.userInfo.id
            }
            }).then(res=>{
                if(res){
                    this.dataActive = res.data;
                    //  this.loadData();

                    console.log('this.dataActive',this.dataActive)
                }
            })
        }
    },
    async onClickTime2 (data) {
        this.dataClick = data;
        this.selectedDate = JSON.stringify(data.scope.timestamp.year) 
        + "-" +JSON.stringify(data.scope.timestamp.month)
        +"-"+JSON.stringify(data.scope.timestamp.day) + " " +JSON.stringify(data.scope.timestamp.hour) + ":"+ JSON.stringify(data.scope.timestamp.minute)
        console.log('this.selectedDate',new Date(this.selectedDate))
        this.dialog2 =true;
        this.events.unshift(`click:time2: ${JSON.stringify(data)}`)
        if(this.myAccount != null){
            await axios({
            method:'POST',
            url:"/api/v1/calendarWorkSearch",
            data:{
                startDate: this.selectedDate,
                id : this.myAccount.value
            }
            }).then(res=>{
                if(res){
                    this.dataActive = res.data;
                    //  this.loadData();

                    console.log('this.dataActive',this.dataActive)
                }
            })
        }else{
            await axios({
            method:'POST',
            url:"/api/v1/calendarWorkSearch",
            data:{
                startDate: this.selectedDate,
                id : this.userInfo.id
            }
            }).then(res=>{
                if(res){
                    this.dataActive = res.data;
                    //  this.loadData();

                    console.log('this.dataActive',this.dataActive)
                }
            })
        }
        
    },
    async onClickIntervalHeader2 (data) {
      this.selectedDate = JSON.stringify(data.scope.timestamp.year) 
        + "-" +JSON.stringify(data.scope.timestamp.month)
        +"-"+JSON.stringify(data.scope.timestamp.day) + " " +JSON.stringify(data.scope.timestamp.hour) + ":"+ JSON.stringify(data.scope.timestamp.minute)
        console.log('this.selectedDate',new Date(this.selectedDate))
        this.dialog2 =true;
        this.events.unshift(`click:time2: ${JSON.stringify(data)}`)
        if(this.myAccount != null){
            await axios({
            method:'POST',
            url:"/api/v1/calendarWorkSearch",
            data:{
                startDate: this.selectedDate,
                id : this.myAccount.value
            }
            }).then(res=>{
                if(res){
                    this.dataActive = res.data;
                    //  this.loadData();

                    console.log('this.dataActive',this.dataActive)
                }
            })
        }else{
            await axios({
            method:'POST',
            url:"/api/v1/calendarWorkSearch",
            data:{
                startDate: this.selectedDate,
                id : this.userInfo.id
            }
            }).then(res=>{
                if(res){
                    this.dataActive = res.data;
                    //  this.loadData();

                    console.log('this.dataActive',this.dataActive)
                }
            })
        }
    },
    async delCalendarDetail(id){
        await axios
                .delete("/api/v1/calendarWork/" + id)
                .then(res => {
                    if(res){
                       this.$q.notify({
                        message: "Xóa thành công",
                        color: "purple",
                        icon: "announcement"
                        }); 
                    };
                    this.onClickTime2(this.dataClick);
                    this.loadData();
                    
                }).catch(err=>{
                    if(err){
                       this.$q.notify({
                        message: "Xóa thất bại",
                        color: "purple",
                        icon: "announcement"
                        }); 
                    }
                })
    },
    async editCalendarDetail(sumPeople,description,startDate,endDate,id,title,numberPhone,location){
        this.title = title;
        this.numberPhone = numberPhone;
        this.location=location;
        this.startDate = startDate.slice(0,10) + " " + startDate.slice(11,16);
        this.endDate = endDate.slice(0,10) + " " + endDate.slice(11,16);
        this.description = description;
        this.sumPeople = sumPeople;
        this.dialogEdit = true;
        this.id = id;
    },
        calendarNext() {
            this.$refs.calendar.next()
        },
        calendarPrev() {
            this.$refs.calendar.prev()
        },
        // async loadData() {
        //     await axios
        //         .get("/api/v1/calendarWork")
        //         .then(response => this.calendarWork = response.data);
        //     console.log("this.calendarWork.data", this.calendarWork.data);
        //     this.events = this.calendarWork.data
        // },
        isCssColor(color) {
            return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
        },

        badgeClasses(event, type) {
            const cssColor = this.isCssColor(event.bgcolor)
            const isHeader = type === 'header'
            return {
                [`text-white bg-${event.bgcolor}`]: !cssColor,
                'full-width': !isHeader && (!event.side || event.side === 'full'),
                'left-side': !isHeader && event.side === 'left',
                'right-side': !isHeader && event.side === 'right'
            }
        },

        badgeStyles(event, type, timeStartPos, timeDurationHeight) {
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

        getEvents(dt) {
            const currentDate = QCalendar.parsed(dt)
            const events = []
            console.log('data', this.events.date);
            for (let i = 0; i < this.events.length; ++i) {
                console.log('data', this.events[i].date);
                let added = false
                const event = this.events[i]
                if (event.date === dt) {
                    if (event.time) {
                        if (events.length > 0) {
                            // check for overlapping times
                            const startTime = QCalendar.parsed(event.date + ' ' + event.time)
                            const endTime = QCalendar.addToDate(startTime, {
                                minute: event.duration
                            })
                            for (let j = 0; j < events.length; ++j) {
                                if (events[j].time) {
                                    const startTime2 = QCalendar.parsed(events[j].date + ' ' + events[j].time)
                                    const endTime2 = QCalendar.addToDate(startTime2, {
                                        minute: events[j].duration
                                    })
                                    if (QCalendar.isBetweenDates(startTime, startTime2, endTime2) || QCalendar.isBetweenDates(endTime, startTime2, endTime2)) {
                                        events[j].side = 'left'
                                        event.side = 'right'
                                        events.push(event)
                                        added = true
                                        break
                                    }
                                }
                            }
                        }
                    }
                    if (!added) {
                        event.side = undefined
                        events.push(event)
                    }
                } else if (event.days) {
                    // check for overlapping dates
                    const startDate = QCalendar.parsed(event.date)
                    const endDate = QCalendar.addToDate(startDate, {
                        day: event.days
                    })
                    if (QCalendar.isBetweenDates(currentDate, startDate, endDate)) {
                        events.push(event)
                        added = true
                    }
                }
            }
            return events
        }
    },
    computed: {
            ...mapGetters("base",["userInfo"]),
    ...mapGetters("orders",["accounts"]),

        // convert the events into a map of lists keyed by date
        eventsMap() {
            const map = {}
            this.events.forEach((event) => (map[event.date] = map[event.date] || []).push(event))
            return map
        },
        
    },
}
</script>

<style lang="sass" scoped>
.calendar-container 
    position: relative 

    .my-event 
        width: 100% 
        position: absolute 
        font-size: 12px 

        .full-width 
            left: 0 
            width: 100% 
        .left-side 
            left: 0 
            width: 49.75% 
        .right-side 
            left: 50.25% 
            width: 49.75%
</style>
