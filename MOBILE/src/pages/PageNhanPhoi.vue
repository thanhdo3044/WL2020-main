<template>
  <q-page padding class="bg-blue-grey-7">
    <app-bar class="text-white">Lịch sử nhận phôi</app-bar>
    <q-select
      filled
      dark
      label-color="amber"
      v-model="step"
      @input="getListGhiNhan"
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
    <q-input dark label-color="amber" outlined v-model="searchQuery" type="text" label="Tìm kiếm" >
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
    <q-input dark label-color="amber" filled label="Từ ngày" v-model="fromDate" mask="date" :rules="['date']">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
            <q-date v-model="fromDate">
              <div class="row items-center justify-end">
                <q-btn @click="getListGhiNhan" v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input dark label-color="amber" filled label="Đến ngày" v-model="toDate" mask="date" :rules="['date']">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
            <q-date v-model="toDate">
              <div class="row items-center justify-end">
                <q-btn v-close-popup @click="getListGhiNhan" label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <!-- <q-input
      v-if="step"
      filled
      v-model="date"
      mask="date"
      :rules="['date']"
      dense
      label="Ngày nhận"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon
          v-if="date"
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
                <q-btn @click="getListGhiNhan" v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input> -->
    <div class="row justify-center">
      <div
        v-for="item in dataReceiptFilter"
        :key="item.ID"
        class="col-12 col-sm-6 q-mt-sm"
      >
        <q-card class="my-card bg-blue-grey-7" style="border:2px solid white">
          <q-card-section>
            <!-- <div>
              {{item}}
            </div> -->
            <div class="text-h6 text-white">
              {{ item.ITEM_NAME }}
              {{
                [item.HEIGHT, item.WIDTH, item.LENGTH].join("*")
              }}
            </div>
            
         
              <q-item-section>
                <q-item-label
                  ><span class="text-amber">Số lượng:</span>  <span class="text-white"><b>{{ item.QUANTITY }}</b></span> </q-item-label
                >
                <div  class="text-subtitle2">
               <q-badge color="green-4">
                  Người giao:
                  {{ item.CREATED_NAME }}
                 </q-badge>
                <q-item-label caption
                  ><span class="text-amber">Ngày giao: </span> <span class="text-white">{{ item.ngaygiao }}</span> </q-item-label
                >
                 <q-item-label caption
                  ><span class="text-amber">Giờ giao: </span> <span class="text-white">{{item.giogiao}}:{{item.phutgiao}}:{{item.giaygiao}}</span> </q-item-label
                >
                 </div>
              </q-item-section>
          <hr width="60%" align="center" >
          
             <div  class="text-subtitle2">
            <q-badge color="green-4">
              Người nhận:
              {{ item.VERIFY_NAME }}
            </q-badge>
             <q-item-label caption
                  ><span class="text-amber">Ngày nhận: </span> <span class="text-white">{{ item.VERIFY_DATE }}</span> </q-item-label>
             <q-item-label caption
                  ><span class="text-amber">Giờ nhận: </span> <span class="text-white">{{item.gionhan}}:{{item.phutnhan}}:{{item.giaynhan}}</span> </q-item-label>
             </div>
          </q-card-section>
         
       
        </q-card>
        <q-separator />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AppBar from "components/AppBar";
import moment from "moment";
export default {
    components:{
        "app-bar": AppBar,
    },
    data(){
        return{
            step: null,
            text: "",
             searchQuery: "",
            fromDate: moment().format('YYYY-MM-DD'),
            toDate: moment().format('YYYY-MM-DD'),
            dataHistoryPackage: [],
            departments: []
        }
    },
    computed: {
    ...mapGetters("base", ["myDepartments", "userInfo"]),
       dataReceiptFilter() {
      if (this.searchQuery)
        return this.dataHistoryPackage.filter(d => {
          const matchString = d.ITEM_NAME + " " +
          d.HEIGHT + "*" + d.WIDTH + "*" + d.LENGTH;
          return matchString
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        });
      return this.dataHistoryPackage;
    }
  
  },
  created(){
    let listDepartment = this.myDepartments.filter(d => d.parentId != 102498 && d.parentId != 102451 && d.parentId != 102531 && d.parentId != 102533);
    console.log("listDepartment", listDepartment);
    listDepartment.forEach(el => {
      this.departments.push({
        label: `[${el.code}] - ${el.name}`,
        value: el.id
      })
    });
  },
  methods:{
      ...mapActions("production", [
      "getHistoryPackage2",
    ]),
      async getListGhiNhan(){
          if(this.step != null){
              let payload = {
                  stepId: this.step,
                  fromDate: moment(this.fromDate).format("YYYY-MM-DD"),
                  toDate: moment(this.toDate).format("YYYY-MM-DD"),
                  verifyBy: this.userInfo.id
              }
              let data = await this.getHistoryPackage2(payload);
              this.dataHistoryPackage = data;
          }
      }
  }
}
</script>