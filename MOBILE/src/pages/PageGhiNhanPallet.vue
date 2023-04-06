<template>
  <q-page padding class="bg-blue-grey-7">
    <list-header bgcolor="bg-green-4">Lịch sử xếp Pallet</list-header>

    <q-select
    dark
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
      v-if="step"
      color="teal"
      filled
      v-model="searchQuery"
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
    <!-- &&(!date || moment(date.slice(0, 10)).isSame(item.createdAt, 'day')) -->
    <div class="row justify-center q-mt-md">
      <div v-for="item in dataReceiptFilter" :key="item.id">
        <q-card  class="my-card">
          <q-card-section>
            <div class="text-h6">
              Quy cách:
              {{
                [item.HEIGHT, item.WIDTH, item.LENGTH].join("*")
              }}
            </div>
            <!-- <div v-if="item.accountId2" class="text-subtitle2">
              <q-badge color="primary"
                >Nhận bởi:
                {{ getAccountById(item.accountId2) | FullName }}
              </q-badge>
            </div> -->
            <div  class="text-subtitle2">
              <q-badge color="secondary"> Pallet: {{ item.pallet }} </q-badge>
            </div>
          </q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>Số lượng: {{ item.QUANTITY }}</q-item-label>
                <q-item-label
                  >Người tạo:
                  {{ getAccountById(item.accountId) | FullName }}</q-item-label
                >
                <q-item-label caption
                  >Ngày tạo: {{ item.createdAt | ngay }}</q-item-label
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
import ListHeader from "components/Shared/ListHeader.vue";
import moment from "moment";
export default {
  // name: 'PageName',
  data() {
    return {
      step: null,
      numbers: [],
      text: null,
      searchQuery:"",
      count: 0,
      date: null,
      to:null,
      from: null,
      dataHistoryPackage:[],
      sanLuongs1: null,
       model: null,
       departments: []
    };
  },
  components: {
    ListHeader,
  },
  computed: {
    ...mapGetters("production", ["sanLuongs", "lenhSanXuats"]),
    ...mapGetters("base", ["myDepartments", "userInfo"]),
    ...mapGetters("orders", ["getAccountById"]),
      dataReceiptFilter() {
      if (this.searchQuery)
        return this.dataHistoryPackage.filter((d) => {
          const matchString = d.pallet + " " +
            d.ITEM_NAME + " " + d.HEIGHT + "*" + d.WIDTH + "*" + d.LENGTH;
          return matchString
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        });
      return this.dataHistoryPackage;
    },
  },
  methods: {
    ...mapActions("production", ["getAllGhiNhans", "getAllGhiNhanpallet"]),
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
      let data =  await this.getAllGhiNhanpallet({
          stepId,
          from: moment(`${this.from } 06:00:00`).format("YYYY-MM-DD hh:mm:ss"),
          to: moment(`${this.to} 06:59:00`)
            .add(1, "day")
            .format("YYYY-MM-DD hh:mm:ss"),
        });
          this.dataHistoryPackage = data;
      //  console.log('sL:',this.sanLuongs)
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
    this.from = moment().format('YYYY/MM/DD');
    this.to = moment().format('YYYY/MM/DD');
    let listDepartment = this.myDepartments.filter(d => d.parentId != 102498 && d.parentId != 102451 && d.parentId != 102531 && d.parentId != 102533);
    listDepartment.forEach(el => {
      this.departments.push({
        label: el.name,
        value: el.id
      })
    });
    this.date = moment(new Date()).format("YYYY/MM/DD");
    this.model = moment(new Date()).format("YYYY/MM/DD");

  },
};
</script>
