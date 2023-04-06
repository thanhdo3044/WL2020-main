<template>
<div>
    <q-btn color="primary" @click="goBack" flat icon="keyboard_arrow_left" label="Trở lại" />
   
    <q-card class="q-ma-lg">
        <q-card-section class="bg-amber-8 q-mt-lg">
            <div class="text-bold">Mã số : {{data.id}}
                - Tiêu đề : {{data.title}}</div>
        </q-card-section>
        <q-card-section  class="q-mt-lg shadow-10">
            <q-input disable filled v-model="data.Account.lastName" label="Tên người đăng kí :" />
            <q-input disable filled v-model="data.Account.position" label="Chức vụ/phòng ban :" />
            <q-input disable filled v-model="data.numberPhone" label="SĐT liên hệ :"/>
            <q-input disable filled v-model="data.location" label="Địa điểm làm việc :"/>
            <q-input disable filled v-model="dateTimeFormatStart" label="Thời gian bắt đầu :"/>
            <q-input disable filled v-model="timeTimeFormatEnd" label="Thời gian kết thúc :"/>
        </q-card-section>
        <q-card-section>
             <p>
        Danh sách thành viên đính kèm : <b>{{ listAccounts.data.length }}</b> người
      </p>
      <p>
        Tối đa số lượng : <b>{{ data.sumPeople}}</b> người
      </p>
      <ol>
        <li
          v-for="(item, index) in listAccounts.data"
          class="q-ma-sm"
          style="font-weight:bold"
        >
          Tên : {{ item.Account.lastName }} - Mã NV : {{ item.Account.id }} -
          Chức vụ :
          {{
            item.Account.position == null ? "chưa có" : item.Account.position
          }}
        </li>
      </ol>
        </q-card-section>
    </q-card>
    <q-dialog
      v-model="prompt"
      persistent
      v-if="data.sumPeople > listAccounts.data.length"
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Chọn người (Nhân viên)</div>
        </q-card-section>
        
        <q-card-section class="q-pt-none">
          <!-- <q-select
            filled
            v-model="this.accounts"
            :options="this.accounts"
            emit-value
            map-options
          /> -->
          <div class="q-gutter-md">
      <!-- <q-badge color="secondary" multi-line>
        Model: "{{ this.result }}"
      </q-badge> -->

      <q-select filled v-model="result" :options="this.accounts" label="Standard" />
    </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Hủy" v-close-popup />
          <q-btn
            flat
            label="Thêm người"
            v-close-popup
            @click="addAccount(userInfo.id)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="prompt" v-else>
      <q-card>
        <q-card-section>
          Đã đủ số người đăng kí !
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-btn style="position:sticky; bottom:5%; top:90%;left:85%;z-index:2"
        dense
        @click="prompt = true"
        round
        color="primary"
        size="18px"
        icon="add"
    />
    
</div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
import axios from 'axios';
export default {
  components: {
    QCalendar
  },
    async created() {
        await this.loadData();
        await this.CutStringDate();
        await this.CutStringTime();
        this.account = this.accounts;
        this.result = this.convertArrayToObject(this.accounts,"id")
        console.log(this.result)
       
    },
    computed: {
    ...mapActions("orders", [
      "getOneOrder",
      "addMessage",
      "getAllRequests",
      "sendToApproved"
    ]),
    ...mapGetters("orders", [
      "getAccountById",
      "getAccountsOption",
      "getCarsOption",
      "getCarById",
      "accounts"
    ]),
    ...mapGetters("base", ["userInfo","orders"])
  },
    data() {
        return {
          
            result:null,
            account:{},
            listAccounts: null,
            prompt:false,
            dateTimeFormatStart:"",
            timeTimeFormatEnd:"",
            data: {},
        }
    },
    methods: {
    CutStringDate() {
       console.log(this.data,'this.dateFormatStart')
          console.log('abc');
          this.dateFormatStart = this.data.startDate.slice(0, 10);
         
     
    },
    CutStringTime() {
     this.timeFormatStart = this.data.startDate.slice(11, 19)
      
    },  
    convertArrayToObject(array, key){
            const initialValue = {};
            return  this.accounts.reduce((obj, item) => {
                return {
                ...obj,
                [item[key]]: item,
                };
            }, initialValue);
    },
       async loadData() {
            let id = this.$route.query.id;
            console.log('id', id)
            await axios({
                method: "GET",
                url: "http://localhost:1010/api/v1/calendarWork/" + id,
            }).then(res => {
                this.data = res.data.data
                this.dateTimeFormatStart = this.data.startDate.slice(0, 10) + " " + this.data.startDate.slice(11, 19);
                this.timeTimeFormatEnd =  this.data.endDate.slice(0, 10) + " " + this.data.endDate.slice(11, 19);
                console.log('data', this.data)
            }).catch(err => {
                console.log('err', err)
            });

            let calendarWorkId = this.$route.query.id;
            await axios({
            method: "GET",
            url: `http://localhost:1010/api/v1/userRegistrationCalendarWork?calendarWorkId=` + calendarWorkId
            })
            .then(res => {
                if (res) {
                this.listAccounts = res.data;
                }
            })
            .catch(err => {
                if (err) {
                this.$q.notify({
                    type: "positive"
                });
                }
            });
        },
        goBack() {
            this.$router.go(-1);
        },
    }
}
</script>

<style scoped>
.text-bold {
    font-weight: bold !important;
}
</style>
