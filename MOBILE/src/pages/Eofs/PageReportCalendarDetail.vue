<template>
  <div class="q-pa-md">
    <q-btn
      color="primary"
      @click="goBack"
      flat
      icon="keyboard_arrow_left"
      label="Trở lại"
    />

    <div>Từ ngày</div>
    <q-input filled v-model="dateApp">
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="dateApp" mask="YYYY-MM-DD HH:mm">
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
            <q-time v-model="dateApp" mask="YYYY-MM-DD HH:mm" format24h>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <div>Đến ngày</div>
    <q-input filled v-model="dateEnd">
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
    <q-btn
      align="left"
      class="btn-fixed-width q-ma-sm"
      color="primary"
      icon="search"
      @click="searchData"
      label="Tìm kiếm"
    />
    <no-tasks v-if="orders.data && !orders.data.length"></no-tasks>
    <tasks-todo v-else :request="request" :tasksTodo="dataListTodo" />
  </div>
  <!-- <div class="q-pa-md"> -->
  <!-- <q-table title="Treats" :data="data" :columns="columns" row-key="name" /> -->
  <!-- </div> -->
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Quasar, QTable, QTh, QTr, QTd } from "quasar";
import axios from "axios";
export default {
  async created() {
    // this.loadData();
    // let dataS =  await this.orders.data.forEach(e =>{
    //     if (e.status == 'Đã được duyệt' ){
    //       return e;
    //     }
    //   });
    await this.getAllOrders(this.userInfo.id);
  },
  mounted() {
    this.$root.$on("showAddOrder", () => {
      this.showAddTask = true;
    });
    this.proposalForms = this.dSBieuMauSuDung;
  },
  computed: {
    ...mapGetters("orders", ["orders", "dSBieuMauSuDung"]),
    ...mapGetters("base", ["userInfo"])
  },
  data() {
    return {
      dataListTodo: [],
      month: "",
      filter: "",
      dateApp: "",
      dateEnd: "",
      dataTable: null
    };
  },
  methods: {
    ...mapActions("orders", ["getAllOrders", "resetOrder"]),
    async loadData() {
      this.orders.data.forEach(e => {
        if (e.status == "Đã được duyệt" && e.ProposalForm.slug == "dang-ky-xe") {
          this.dataListTodo.push(e);
        }
      });
      console.log("adsadad", this.orders.data);
    },
    async searchData() {
      
      this.dataListTodo = [];
      console.log("abc",this.orders.data);
      for(let i = 0 ; i < this.orders.data.length ; i++){
        if (
          this.orders.data[i].status == "Đã được duyệt" && this.orders.data[i].ProposalForm.slug == "dang-ky-xe" &&
         this.dateApp.slice(0, 4) >=  this.orders.data[i].OrderMeta[0].dateStart.slice(0, 4)  &&
         this.dateEnd.slice(0, 4) >=  this.orders.data[i].OrderMeta[0].dateStart.slice(0, 4)   
         &&
          this.dateApp.slice(5, 7)  >= this.orders.data[i].OrderMeta[0].dateStart.slice(5, 7) &&
            this.dateEnd.slice(5, 7) >=  this.orders.data[i].OrderMeta[0].dateStart.slice(5, 7)   
             &&
           this.orders.data[i].OrderMeta[0].dateStart.slice(8, 10) >=   this.dateApp.slice(8, 10)  &&
           this.dateEnd.slice(8, 10)  >= this.orders.data[i].OrderMeta[0].dateStart.slice(8, 10)    
        ) {
          this.dataListTodo.push(this.orders.data[i]);
          console.log('this.dataListTodo',this.dataListTodo);
        }
      }
      console.log('ádasda',this.dataListTodo)
      if(this.dataListTodo.length == 0){
        this.$q.notify({
              message: "Không có lịch xe cần tìm",
              color: "purple",
              icon: "announcement"
            });
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  components: {
    QTable,
    QTh,
    QTr,
    QTd,
    "add-task": require("components/eofs/Requests/Modals/AddTask.vue").default,
    "tasks-todo": require("components/eofs/Requests/TasksTodo.vue").default,
    "no-tasks": require("components/eofs/Requests/NoTasks.vue").default
  }
};
</script>

<style>
</style>
