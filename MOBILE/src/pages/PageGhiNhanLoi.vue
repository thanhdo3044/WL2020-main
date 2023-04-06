<template>
  <q-page padding class="bg-blue-grey-7">
     <app-bar class="text-white">Lịch sử ghi nhận lỗi</app-bar>
    <q-select
      filled
      dark
      label-color="amber"
      v-model="step"
      label="Chọn công đoạn"
      :options="departments"
      @input="getListGhiNhan"
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
    <q-input dark label-color="amber" outlined v-model="searchQuery" type="text" label="Tìm kiếm">
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
    <q-input dark label-color="amber" filled dense label="Từ ngày" v-model="from">
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
            <q-date v-model="from" @input="getListGhiNhan">
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
    <q-input dark label-color="amber" filled dense label="Đến ngày" v-model="to">
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
            <q-date v-model="to" @input="getListGhiNhan">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <div class="row justify-center">
      <div
        v-for="item in dataReceiptFilter"
        :key="item.ID"
        class="col-12 col-sm-6 q-mt-sm"
      >
        <q-card class="my-card"  style="border:2px solid white">
          <q-card-section class="bg-orange-12">
            <!-- <div>
              {{item}}
            </div> -->
            <div class="text-h6 text-white">
              {{ item.ITEM_NAME }}
              {{ [item.HEIGHT, item.WIDTH, item.LENGTH].join("*") }}
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
            <q-item class="bg-blue-grey-7">
              <q-item-section>
                <q-item-label
                  ><span class="text-amber">Số lượng: </span> <span class="text-white"><b>{{ item.QUANTITY }}</b></span> </q-item-label
                >
                <q-item-label
                  ><span class="text-amber">Người giao: </span> 
                  <span class="text-white">{{ getAccountById(item.accountId) | FullName }}</span> 
                </q-item-label>
                <q-item-label  
                  ><span class="text-amber">Ngày giao: </span> <span class="text-white">{{ item.createdAt | ngay }}</span> </q-item-label>
                     <q-item-label  
                  ><span class="text-amber">Thời gian giao: </span> <span class="text-white">{{ item.gio}}:{{ item.phutgiao}}:{{ item.giaygiao}}</span> </q-item-label>
                   <q-item-label  
                  ><span class="text-amber">Ghi chú: </span> <span class="text-white">{{ item.DESCRIPTION}}</span> </q-item-label>
                 
              </q-item-section>
              
              <!-- <q-item-section>
                <q-btn color="orange" class="full-right" label="hủy" @click="showDeleteConfirm(item)"></q-btn>
              </q-item-section> -->
            </q-item>
          </q-list>
        </q-card>
        <q-separator />
      </div>
    </div>
    <q-dialog v-model="showConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Xác nhận</div>
          <div class="text-subtitle2">Bạn chắc chắn muốn hủy ghi nhận lỗi:</div>
          <div class="text-subtitle2" style="color:red">{{ itemName }}</div>
          <div class="text-subtitle2" style="color:red">Số lượng: {{ quantity }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            @click="deleteGhiNhan"
            label="OK"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AppBar from "components/AppBar";
import moment from "moment";
export default {
  components: {
    "app-bar": AppBar,
  },
  data() {
    return {
      step: null,
      text: "",
      searchQuery: "",
      itemName: "",
      quantity: 0,
      to: null,
      from: null,
      showConfirm: false,
      date: moment().format("YYYY-MM-DD"),
      dataHistoryPackage: [],
      departments: []
    };
  },
  computed: {
    ...mapGetters("base", ["myDepartments", "userInfo"]),
    ...mapGetters("orders", ["getAccountById"]),
    dataReceiptFilter() {
      if (this.searchQuery)
        return this.dataHistoryPackage.filter((d) => {
          const matchString =
            d.ITEM_NAME + " " + d.HEIGHT + "*" + d.WIDTH + "*" + d.LENGTH;
          return matchString
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        });
      return this.dataHistoryPackage;
    },
  },
  created(){
        this.from = moment().format("YYYY-MM-DD")
    this.to =  moment().format("YYYY-MM-DD")
    let listDepartment = this.myDepartments.filter(d => d.parentId != 102498 && d.parentId != 102451 && d.parentId != 102531 && d.parentId != 102533);
    listDepartment.forEach(el => {
      this.departments.push({
        label: el.name,
        value: el.id
      })
    });
  },
  methods: {
    ...mapActions("production", ["getAllGhiNhanLoi"]),
    async getListGhiNhan() {
      if (this.step != null && this.from != null && this.to != null) {
        let dateInput = moment(this.date).format("YYYY-MM-DD");
        let payload = {
          stepId: this.step,
          from: moment(`${this.from } `).format("YYYY-MM-DD 00:00:00"),
          to: moment(`${this.to} `).format("YYYY-MM-DD 23:59:59"),
        };
        let data = await this.getAllGhiNhanLoi(payload);
        this.dataHistoryPackage = data;
      }
    },
    showDeleteConfirm(item){
      this.itemName = item.ITEM_NAME + [item.HEIGHT, item.WIDTH, item.LENGTH].join("*");
      this.quantity = item.QUANTITY;
      this.showConfirm = true;
    },
    async deleteGhiNhan(){

    }
  },
};
</script>