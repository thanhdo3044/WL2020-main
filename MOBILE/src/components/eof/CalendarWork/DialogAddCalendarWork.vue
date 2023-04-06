<template>
    <div class="q-pl-sm q-pr-sm" style="max-width: 800px; width: 100%;">
        <q-dialog v-model="dialog" persistent>
        <q-card style="min-width: 350px">
          <q-card-section class="q-qa-sm">
            <div class="q-mt-sm text-bold">Từ ngày :</div>
              <q-input 
              :rules="[ val => val && val.length > 0 || 'Hãy chọn thời gian bắt đầu !']"
              filled v-model="selectedDate">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="selectedDate" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="selectedDate" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <div class="q-mt-sm text-bold">Đến ngày :</div>
              <q-input
              :rules="[ val => val && val.length > 0 || 'Hãy chọn thời gian kết thúc !']"
              filled v-model="dateEnd">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="dateEnd" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="dateEnd" mask="YYYY-MM-DD HH:mm:ss" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
          </q-card-section>
            
          <q-card-section class="q-pt-none">
            <!-- <div class="text-bold " style="font-size:16px">Chọn người :</div>
            <q-select
              filled
              v-model="userInfo.lastName"
              :options="userInfo.id"
              emit-value
              map-options
            /> -->
          </q-card-section>
              <q-card-section class="q-ql-none" >
                <q-select  class="" filled v-model="model" :options="options" label="Hiển thị chế độ" />

                <div class="text-bold" style="font-size:16px">Tiêu đề:</div>
                  <q-input 
                  type="string"
                  :rules="[ val => val && val.length > 0 || 'Nhập đầy đủ thông tin']"
                  req filled v-model="title" label="Tiêu đề" />
                <div class="text-bold" style="font-size:16px">Tối đa SL người:</div>
                  <q-input 
                  type="number"
                  :rules="[ val => val && val.length > 0 || 'Nhập đầy đủ thông tin']"
                  req filled v-model="sumPeople" label="Số người" />
          
                <div class="text-bold" style="font-size:16px">Chú thích :</div>
                  <q-input 
                  :rules="[ val => val && val.length > 0 || 'Nhập đầy đủ thông tin']"
                  filled v-model="description" label="Chú thích" />
                <div class="text-bold q-mt-sm" style="font-size:16px">Địa điểm :</div>
                  <q-input
                  :rules="[ val => val && val.length > 0 || 'Nhập đầy đủ thông tin']"
                  color="orange" standout bottom-slots v-model="location" label="Địa chỉ làm việc"  clearable>
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                  </q-input>
                  <div class="text-bold" style="font-size:16px">SĐT liên lạc:</div>
                  <q-input 
                  type="nnumber"
                  :rules="[ val => val && val.length ==  10 || 'Độ dài tối đa 10 số']"
                  req filled v-model="numberPhone" label="SĐT liên lạc" />
          </q-card-section>
          
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Hủy" @click="emitToParent()" v-close-popup />
            <q-btn
              flat
              label="Thêm Lịch làm việc"
              v-close-popup
              @click="addAccount()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
  </div>    

</template>
<script>
import { mapGetters, mapAction } from "vuex";

import axios from 'axios';
import QCalendar from '@quasar/quasar-ui-qcalendar' // ui is aliased from '@quasar/quasar-ui-qcalendar';
export default{
    async created(){
    // await this.loadData();
    console.log('this.events',this.events)
    },
    props:[
        "selectedDate","dialog"
    ],
    data () {
        return {
            model:"",
            options:['Công khai','Riêng tư'],
            sumPeople:null,
            summary:"",
            description:"",
            location:"",
            dateStart:"",
            dateEnd:"",
            prompt: true,
            title:"",
            numberPhone:"",
            calendarWork:[],
            colorRandom:"",
            events: [
        
            ]
        }
    },
    methods: {
     getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      console.log('color',color)
      this.colorRandom= color;
    },
    async loadData(){
      await axios
      .get("http://localhost:1010/api/v1/calendarWork?id=" + this.userInfo.id)
      .then(response => this.calendarWork = response.data);
        this.events = this.calendarWork.data;
    },
    addAccount(){
      this.getRandomColor(8);
      console.log("color",this.colorRandom)
       axios({
         method: "POST",
          url: "http://localhost:1010/api/v1/calendarWork",
          data: {
          permission: this.model == 'Công khai' ? 1 : 0,
          numberPhone:this.numberPhone,
          title:this.title,
          sumPeople:parseInt(this.sumPeople),
          description:this.description,
          location: this.location,
          accountId : this.userInfo.id,
          position: `${this.userInfo.position}`,
          startDate: this.selectedDate,
          endDate: this.dateEnd,
          icon:"today",
          bgcolor:this.colorRandom,
          slug:"/calendarWork-Detail"
        }
       })
      .then(res => {
        if(res){
          this.$q.notify({
              message: "Thêm thành công",
              color: "purple",
              icon: "announcement"
            });
                this.selectedDate="";
                this.numberPhone="";
                this.title="";
                this.sumPeople=null;
                this.summary = "";
                this.description ="";
                this.location ="";
                this.dateStart="";
                this.dateEnd="";
          this.emitToParent2();
        }
      }).catch(err=>{
        console.log('err',err)
        if(err){
          this.$q.notify({
              message: "Yêu cầu nhập đầy đủ thông tin",
              color: "purple",
              icon: "announcement"
            });
        }
      });
    console.log("this.calendarWork.data", this.calendarWork);
    },
    emitToParent (event) {
      this.dialog =false;
      this.$emit('childToParent', this.dialog)
    },
    async emitToParent2 (event) {
      await this.loadData();
      this.$emit('childToParent2', this.events)
    },
    getName (event) {
      this.dialog = false;
      this.$emit('getName', this.dialog)
    }
  },
   computed: {
    // convert the events into a map of lists keyed by date
    ...mapGetters("base",["userInfo"]),
    eventsMap () {
      const map = {}
      this.events.forEach((event) => (map[event.date] = map[event.date] || []).push(event))
      return map
    }
  },
}
</script>
<style lang="sass" scoped>

</style>