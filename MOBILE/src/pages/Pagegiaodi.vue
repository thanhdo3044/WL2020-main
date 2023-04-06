<template>
  <q-page padding class="bg-blue-grey-7">
    <app-bar class="text-white">Tổng sản lượng giao đi theo ngày</app-bar>
    <div class="row">
      <div class="col-12 text-white" align="center">
        <i>(Theo từng sản phẩm)</i>
      </div>
    </div>
    <q-select
      filled
      dark
      v-model="step"
      label="Chọn công đoạn"
      label-color="amber"
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
      label="Tìm kiếm"
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

    <q-item-label v-if="tongsl>0" class="text-orange" style="font-size:14px;font-weight:bold">Tổng (m³): <q-badge class="bg-teal" :label="tongsl" > </q-badge></q-item-label>
    <div class="row justify-center" >
      <div v-for="item in sanLuongs1" :key="item.id" style="margin-top:5px" class="col-12">
        <q-card  class="my-card bg-blue-grey-7" style="border:2px solid white">
          <q-card-section>
            
            <div  class="thicker">
             <span style="color:orange;font-size:14px">  Tên:  </span>
             <span class="text-positive" style="font-size:14px"> {{ item.name }}
              
              {{
                [item.HEIGHT,item.WIDTH,item.LENGTH].join("*")
              }}
             </span>
            </div>
            <div>
                 <span style="color:orange;font-size:14px"> Quy cách:  </span>
               <span class="text-positive" style="font-size:14px"> 
              
              {{
                [item.HEIGHT,item.WIDTH,item.LENGTH].join("x")
              }}
             </span>
            </div>
           
          </q-card-section>
          <q-list style="margin-top:0px">
            <q-item class="text-orange">
              <q-item-section >
                <q-item-label  class="thicker" style="font-size:14px">Số lượng: <span class="text-positive"> {{ item.QUANTITY }} </span></q-item-label>

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
import AppBar from "components/AppBar.vue";
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
      tongsl:0,
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
    ...mapActions("production", ["getAllGhiNhans", "getAllGhiNhanssanluong"]),
    async loadData(stepId) {
    this.tongsl = 0;
    this.sanLuongs1 = [];
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
   this.sanLuongs1 =   await this.getAllGhiNhanssanluong({
          stepId,
          from: moment(`${this.from } 01:00:01`).subtract(1,"day").format("YYYY-MM-DD hh:mm:ss"),
          to: moment(`${this.to} 12:59:59`)
           
            .format("YYYY-MM-DD hh:mm:ss"),
        });
           
       if (this.sanLuongs1.length>0) {
        this.sanLuongs1.forEach(element => {
          this.tongsl = this.tongsl+ element.TONGKL
        });
       }
         console.log('sL:',this.tongsl)
           console.log('sL:',this.sanLuongs1)
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
     this.from = moment().format("YYYY-MM-DD")
    this.to =  moment().format("YYYY-MM-DD")
    this.date = moment(new Date()).format("YYYY/MM/DD");
    this.model = moment(new Date()).format("YYYY/MM/DD");

  },
};
</script>
