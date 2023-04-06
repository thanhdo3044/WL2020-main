<template>
  <q-page padding class="bg-blue-grey-7">
    <app-bar class="text-white">sản lượng giao đi</app-bar>
    <q-select
      filled
      dark
      label-color="amber"
      v-model="step"
      label="Chọn công đoạn"
      :options="congDoans"
      emit-value
      map-options
      behavior="menu"
      dense
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input
    dark
    label-color="amber"
      v-if="step"
      color="teal"
      filled
      v-model="text"
      label="Tên chi tiết"
      dense
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon
          v-if="text"
          @click="text = null"
          name="close"
          class="cursor-pointer"
        />
      </template>
    </q-input>
    <q-input
    dark
    label-color="amber"
      filled
      dense
      label="Từ ngày"
      v-model="from"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon
          v-if="from"
          @click="from = ''"
          name="close"
          class="cursor-pointer"
        />
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date v-model="from" @input="loadData(step)">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
            
              <!-- <div class="q-pb-sm">Model: {{ model }}</div> -->
              <!-- <q-date v-model="model" range  @input="loadData(step)"/> -->
          </q-popup-proxy>
          
        </q-icon>
      </template>
    </q-input>
        <q-input
        dark
    label-color="amber"
      filled
      dense
      label="Đến ngày"
      v-model="to"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon
          v-if="to"
          @click="to = ''"
          name="close"
          class="cursor-pointer"
        />
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date v-model="to" @input="loadData(step)">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
            
          </q-popup-proxy>
          
        </q-icon>
      </template>
    </q-input>


    <!-- <q-checkbox
      v-for="(number, index) in lenhSanXuats"
      :key="index"
      dense
      v-model="numbers"
      :val="number"
      :label="number"
      color="teal"
    /> -->
    <!-- &&(!date || moment(date.slice(0, 10)).isSame(item.createdAt, 'day')) -->
    <div class="row justify-center">
      <div v-for="item in sanLuongs1" :key="item.id">
        <q-card  class="my-card bg-blue-grey-7" style="border:2px solid white">
          <q-card-section>
            <div  class="thicker text-white">
                
              {{ item.name }}
              
              {{
                [item.HEIGHT,item.WIDTH,item.LENGTH].join("*")
              }}
              
            </div>
            <!-- <div v-if="item.accountId2" class="text-subtitle2">
              <q-badge color="primary"
                >Nhận bởi:
                {{ getAccountById(item.accountId2) | FullName }}
              </q-badge>
            </div>
            <div v-else class="text-subtitle2">
              <q-badge color="secondary"> Chờ nhận </q-badge>
            </div> -->
          </q-card-section>
          <q-list>
            <q-item class="text-orange">
              <q-item-section>
                <q-item-label ><span class="text-amber">Tổng Số lượng ghi nhận: </span> 
                <span class="text-white">{{ item.QUANTITY }}</span> </q-item-label>
                <!-- <q-item-label
                  >Người giao:
                  {{ getAccountById(item.accountId) | FullName }}</q-item-label
                >
                <q-item-label caption
                  >Ngày giao: {{ item.createdAt | ngay }}</q-item-label
                >
                <q-item-label caption
                  >Lệnh sản xuất: {{ item.number }}</q-item-label
                > -->
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
        <q-separator />
      </div>
    </div>
  </q-page>
</template>
<style type="font/css">
    .thicker {
       font-weight: 500;
       font-size: 19px;
         
    }
</style>
<script>
import { mapGetters, mapActions } from "vuex";
import AppBar from "../../components/AppBar";
import moment from "moment";
export default {
  // name: 'PageName',
  data() {
    return {
      step: null,
      numbers: [],
      text: null,
      count: 0,
      sl:[],
      date: null,
      to:null,
      from: null,
      sanLuongs1: null,
       model: null,
    };
  },
  components: {
    "app-bar": AppBar,
  },
  computed: {
    ...mapGetters("production", ["sanLuongs", "lenhSanXuats"]),
    ...mapGetters("base", ["congDoans", "userInfo"]),
    ...mapGetters("orders", ["getAccountById"]),
  },
  methods: {
    ...mapActions("vcn", ["getAllGhiNhanssanluongVCN"]),
    async loadData(stepId) {
      // this.date = "";
      if (stepId && this.from && this.to) {
        this.$q.loading.show({
          message:
            'Hệ thống đang lọc dữ liệu.<br/><span class="text-primary">Xin vui lòng chờ...</span>',
        });
        console.log(
          {
            stepId,
            from: moment(`${this.from }`).format("YYYY-MM-DD hh:mm:ss"),
            to: moment(`${this.to}`).format("YYYY-MM-DD hh:mm:ss"),
          },
        );
   this.sanLuongs1 =   await this.getAllGhiNhanssanluongVCN({
          stepId,
          from: moment(this.from).format("YYYYMMDD"),
          to: moment(this.to)
           
            .format("YYYYMMDD"),
        });
        console.log('sL:',this.sanLuongs)
        this.$q.loading.hide();
      }
    },
  },
  watch: {
    step(newValue) {
      if (newValue) this.loadData(newValue);
    },
    // date(newValue) {
    //   if (newValue && step) this.loadData(this.step);
    // },
  },
  created() {
    this.date = moment(new Date()).format("YYYY/MM/DD");
    this.model = moment(new Date()).format("YYYY/MM/DD");

  },
};
</script>
