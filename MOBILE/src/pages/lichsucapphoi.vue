<template>
  <q-page padding>
    <list-header bgcolor="bg-green-4">Lịch sử cấp phôi</list-header>

    <q-select
      filled
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
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input
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
      v-if="step"
      filled
      v-model="date"
      mask="date"
      :rules="['date']"
      dense
      label="Ngày ghi nhận"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon
          v-if="date"
          @click="date = ''"
          name="close"
          class="cursor-pointer"
        />
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date v-model="date">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <q-checkbox
      v-for="(number, index) in lenhSanXuats"
      :key="index"
      dense
      v-model="numbers"
      :val="number"
      :label="number"
      color="teal"
    />

    <div class="row justify-center q-mt-md">
      <div v-for="item in capphoi" :key="item">
        <!-- <q-card
          v-if="
            numbers.includes(item.number) &&
              (!date || moment(date.slice(0, 10)).isSame(item.createdAt, 'day'))
          "
          class="my-card"
        > -->
          <q-card-section>
            <div class="text-h6">
              {{ item.ITEM_NAME}}
              <!-- {{
                [item.Item.height, item.Item.width, item.Item.length].join("*")
              }} -->
            </div>
            <div class="text-subtitle2">
                Nguồn phôi -
                <span style="color:green">{{ item.nguonPhoi }}</span>
              </div>
            <!-- <div v-if="item.accountId2" class="text-subtitle2">
              <q-badge color="primary">Nhận bởi:
              {{ getAccountById(item.accountId2) | FullName }}
              </q-badge>
            </div> -->
            <!-- <div v-else class="text-subtitle2">
              <q-badge color="secondary">
                Chờ nhận
              </q-badge>
            </div> -->
          </q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>Số lượng đã cấp: {{ Math.abs(item.STOC_QTY) }}</q-item-label>
                <br />
              <span class="san-luong text-primary"
                >Cấp bởi :
                 {{ getAccountById(item.CREATE_BY ) | FullName }}</span
              >
              <br />
               <span class="san-luong text-primary"
                >Ngày nhập : {{ item.createdAt | ngay }}</span
              >
              <br />
                
                <q-item-label 
                  > <strong> Lệnh sản xuất: {{ item.number }} </strong></q-item-label
                >
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

<script>
import { mapGetters, mapActions } from "vuex";
import ListHeader from "components/Shared/ListHeader.vue";
import { congDoans } from '../store/base/getters';
export default {
  // name: 'PageName',
  data() {
    return {
      step: null,
      numbers: [],
      capphoi:"",
      text: null,
      date: ""
    };
  },
  components: {
    ListHeader
  },
  computed: {
    ...mapGetters("production", ["sanLuongs", "lenhSanXuats"]),
    ...mapGetters("base", ["congDoans", "userInfo"]),
    ...mapGetters("orders", ["getAccountById"])
  },
  methods: {
    ...mapActions("production", ["getAlllichsucapphoi"]),
    async loadData(stepId) {
      this.date = "";
      this.$q.loading.show({
        message:
          'Hệ thống đang lọc dữ liệu.<br/><span class="text-primary">Xin vui lòng chờ...</span>'
      });
      this.capphoi = await this.getAlllichsucapphoi({ stepId});
     // this.numbers = [...this.lenhSanXuats];
      this.$q.loading.hide();
      console.log('lich su cap phoi:',await this.getAlllichsucapphoi({ stepId: this.step }))
      console.log(this.capphoi[0].ITEM_NAME)
    }
  },
  watch: {
    step(newValue) {
      if (newValue) this.loadData(newValue);
    }
  }
};
</script>
