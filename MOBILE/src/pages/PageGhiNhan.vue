<template>
  <q-page padding class="bg-blue-grey-7">
    <app-bar class="text-white">Lịch sử ghi nhận</app-bar>

    <q-select
      filled
      dark
      label-color="amber"
      v-model="step"
      label="Chọn công đoạn"
      :options="departments"
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
      v-if="step"
      color="teal"
      dark
      label-color="amber"
      filled
      style="background-color:white"
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
      filled
      dense
      dark
      label-color="amber"
      label="Từ ngày"
      v-model="from"
    >
      <template v-slot:prepend>
        <q-icon  name="search" />
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
            <q-date dark v-model="from" @input="loadData(step)">
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
      filled
      dense
      dark
      label-color="amber"
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
            <q-date dark v-model="to" @input="loadData(step)">
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
    <!-- &&(!date || moment(date.slice(0, 10)).isSame(item.createdAt, 'day')) 1 -->
    <div class="row justify-center q-mt-md">
      <div v-for="item in sanLuongs(text)" :key="item.id" class="col-12 col-sm-6 q-mt-sm">
        <q-card  class="my-card">
          <q-card-section class="bg-blue-grey-7" style="border: 2px solid white">
            <!-- <div>
              {{item}}
            </div> -->
            <div class="text-h6 text-white">
              {{ item.Item.name }}
              {{
                [item.Item.height, item.Item.width, item.Item.length].join("*")
              }}
            </div>
            
         
              <q-item-section>
                <q-item-label style="color:white;font-weight:bold"
                  ><span class="text-orange">Số lượng : </span>  <b>{{ item.quantity }}</b></q-item-label
                >
                 <q-item-label v-if="step == 100282 ||step == 100270 || step == 100273 " style="color:blue;font-weight:bold"
                  > <b>{{ item.pallet }}: {{ item.SL_PALLET }}</b></q-item-label
                >
                <div  class="text-subtitle2">
               <q-badge color="green-4" class="text-black" style="font-weight:bold">
                  Người giao:
                  {{ getAccountById(item.accountId) | FullName }}
                 </q-badge>
                <q-item-label caption style="color:white;font-weight:bold"
                  ><span class="text-orange">Ngày giao :</span>   {{ item.createdAt | ngay }}</q-item-label
                >
                 <q-item-label caption style="color:white;font-weight:bold"
                  ><span class="text-orange">Giờ giao :</span> {{ item.gio }}:{{ item.phut }}:{{ item.giay}}</q-item-label
                >
                 </div>
              </q-item-section>
          <hr width="60%" align="center" >
          
             <div  class="text-subtitle2">
            <q-badge color="green-4" class="text-black" style="font-weight:bold" >
              Người nhận:
              {{ getAccountById(item.accountId2) | FullName }}
            </q-badge>
             <q-item-label caption style="color:white;font-weight:bold"
                  ><span class="text-orange">Ngày nhận :</span>  {{ item.updatedAt | ngay }}</q-item-label>
             <q-item-label caption style="color:white;font-weight:bold"
                  ><span class="text-orange" >Giờ nhận :</span> {{ item.gioNhan }}:{{ item.phutNhan }}:{{ item.giayNhan}}</q-item-label>
             </div>
          </q-card-section>
          <!-- <q-card-section>
            <div class="text-h6">
              {{ item.Item.name }}
              {{
                [item.Item.height, item.Item.width, item.Item.length].join("*")
              }}
            </div>
            <div v-if="item.accountId2" class="text-subtitle2">
              <q-badge color="primary"
                >Nhận bởi:
                {{ getAccountById(item.accountId2) | FullName }}
              </q-badge>
               <q-item-label caption style="color:blue"
                  >Ngày nhận: {{ item.updatedAt | ngay }}</q-item-label
                >
              
            </div>
            <div v-else class="text-subtitle2">
              <q-badge color="red"> Phôi đang chờ nhận </q-badge>
            </div>
          </q-card-section> -->
          <!-- <q-list>
            <q-item>
              <q-item-section>
                <q-item-label style="color:green;font-weight:bold">Số lượng: {{ item.quantity }}</q-item-label>
                <q-item-label
                  >Người giao:
                  {{ getAccountById(item.accountId) | FullName }}</q-item-label
                >
                <q-item-label caption style="color:purple;;font-weight:bold"
                  >Ngày giao: {{ item.createdAt | ngay }}</q-item-label
                >
              <q-item-label caption style="color:purple;;font-weight:bold"
                  >Giờ: {{ item.gio }}:{{ item.phut }}:{{ item.giay}}</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list> -->
        </q-card>
        <q-separator />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AppBar from "../components/AppBar";
import moment from "moment";
export default {
  // name: 'PageName',
  data() {
    return {
      step: null,
      numbers: [],
      text: null,
      count: 0,
      date: null,
      to:null,
      from: null,
      sanLuongs1: null,
       model: null,
       departments: []
    };
  },
  components: {
    "app-bar": AppBar,
  },
  computed: {
    ...mapGetters("production", ["sanLuongs", "lenhSanXuats"]),
    ...mapGetters("base", ["myDepartments", "userInfo"]),
    ...mapGetters("orders", ["getAccountById"]),
  },
  methods: {
    ...mapActions("production", ["getAllGhiNhans", "getAllGhiNhans1"]),
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
            from: moment(`${this.from } 06:00:00`).format("YYYY-MM-DD hh:mm:ss"),
            to: moment(`${this.to} 06:59:00`).format("YYYY-MM-DD hh:mm:ss"),
          },
        );
        await this.getAllGhiNhans1({
          stepId,
          from: moment(`${this.from } 06:00:00`).format("YYYY-MM-DD hh:mm:ss"),
          to: moment(`${this.to} 06:59:00`)
            .add(1, "day")
            .format("YYYY-MM-DD hh:mm:ss"),
        });
        console.log('sL:',this.sanLuongs)
        // this.numbers = [...this.lenhSanXuats];
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
    let listDepartment = this.myDepartments.filter(d => d.parentId != 102498  && d.parentId != 102531 && d.parentId != 102533);
    console.log("listDepartment", listDepartment);
    listDepartment.forEach(el => {
      this.departments.push({
        label: `[${el.code}] ${el.name}`,
        value: el.id
      })
    });
    this.date = moment(new Date()).format("YYYY/MM/DD");
    this.model = moment(new Date()).format("YYYY/MM/DD");

  },
};
</script>
