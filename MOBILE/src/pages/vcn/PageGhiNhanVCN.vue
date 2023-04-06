<template>
  <q-page padding class="bg-blue-grey-7">
    <app-bar class="text-white">Lịch sử ghi nhận</app-bar>

    <q-select
    dark
    label-color="amber"
      filled
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
    <div class="row justify-center q-mt-md">
      <div class="col-12" v-for="item in sanLuongs(text)" :key="item.id">
        <q-card  class="my-card bg-blue-grey-7" style="border:2px solid white">
          <q-card-section>
            <div class="text-h6"><q-badge color="orange">{{item.number}}</q-badge></div>
            <div class="text-h6 text-white">
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
              <q-item-label caption class="text-white"
                  >Ngày giao: {{ item.updatedAt }}</q-item-label
                >
            </div>
            <div v-else class="text-subtitle2">
              <q-badge color="secondary"> Chờ nhận </q-badge>
            </div>
            
          </q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label><span class="text-amber">Số lượng: </span> <span class="text-white">{{ item.quantity }}</span> </q-item-label>
                <q-item-label
                  ><span class="text-amber">Người giao:</span> 
                  <span class="text-white">{{ getAccountById(item.accountId) | FullName }}</span> </q-item-label
                >
                <q-item-label caption
                  ><span class="text-amber">Ngày giao:</span> <span class="text-white">{{ item.createdAt }}</span> </q-item-label
                >
                <!-- <q-item-label caption
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
    ...mapGetters("vcn", ["sanLuongs"]),
    ...mapGetters("base", ["myDepartments", "userInfo"]),
    ...mapGetters("orders", ["getAccountById"]),
  },
  methods: {
    ...mapActions("vcn", ["getAllGhiNhansVCN"]),
    async loadData(stepId) {
      // this.date = "";
      if (stepId && this.from && this.to) {
        this.$q.loading.show({
          message:
            'Hệ thống đang lọc dữ liệu.<br/><span class="text-primary">Xin vui lòng chờ...</span>',
        });
        // console.log(
        //   {
        //     stepId,
        //     from: moment(`${this.from } 06:00:00`).format("YYYY-MM-DD hh:mm:ss"),
        //     to: moment(`${this.to} 06:59:00`).format("YYYY-MM-DD hh:mm:ss"),
        //   },
        // );
        await this.getAllGhiNhansVCN({
          stepId,
          from: moment(`${this.from } 06:00:00`).format("YYYY-MM-DD hh:mm:ss"),
          to: moment(`${this.to} 06:59:00`)
            .add(1, "day")
            .format("YYYY-MM-DD hh:mm:ss"),
        });
        // this.numbers = [...this.lenhSanXuats];
        this.$q.loading.hide();
        console.log("sanLuongs", this.sanLuongs(null));
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
    let listDepartment = this.myDepartments.filter((d) =>
        102451
        ,102498
        ,102531
        ,102744
				,102745,102817,102818);
    listDepartment.forEach(el => {
      this.departments.push({
        label: `[${el.code}] ${el.name}`,
        value: el.id
      })
    });
    console.log("departments", this.departments);
    this.from = moment().format("YYYY/MM/DD");
    this.to = moment().format("YYYY/MM/DD");
    this.date = moment(new Date()).format("YYYY/MM/DD");
    this.model = moment(new Date()).format("YYYY/MM/DD");

  },
};
</script>
