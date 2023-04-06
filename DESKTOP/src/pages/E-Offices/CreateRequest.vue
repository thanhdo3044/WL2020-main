<template>
  <q-page >
    <q-card  class="q-pa-sm q-mb-sm q-ml-sm q-mt-sm">
      <!-- <q-card-section class="bg-primary text-orange text-h6">
        Danh sách phiếu
      </q-card-section> -->
      <DxTreeList
        id="tasks"
        :data-source="bieuMaus"
        :show-borders="true"
        :show-row-lines="true"
        :column-auto-width="true"
        :word-wrap-enabled="true"
        :expanded-row-keys="expandedRowKeys"
        :selected-row-keys="selectedRowKeys"
        key-expr="id"
        parent-id-expr="parentId"
      >
        <DxColumn data-field="name" style="color: orange" caption="Danh sách phiếu đề xuất" cell-template="cellTemplate"/>
       
        <template #cellTemplate="{ data : options }" >
          <a v-if="options.data.parentId"   @click="themDeXuat(options.data)">{{options.data.name}}</a>
          <a  v-else>{{options.data.name}}</a>
        </template>
        <DxSorting mode="multiple" />
      </DxTreeList>
    </q-card>
    <no-tasks v-if="orders.data && !orders.data.length"></no-tasks>
    <tasks-todo v-else :tasksTodo="orders.data" />
    <q-dialog v-model="showAddTask">
      <add-task @close="showAddTask = false" :order="order" />
    </q-dialog>
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="10"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="primary" />
    </q-page-scroller>
  </q-page>
</template>

<script>
import {
  DxTreeList,
  DxColumn,
  DxSelection,
  DxSorting
} from "devextreme-vue/tree-list";
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      showAddTask: false,
      order: {},
      title: "",
      proposalForms: [],
      ordersData: null,
      dataOrder: null,
      expandedRowKeys: [],
      selectedRowKeys: [],
      dSBieuMauSuDung: null,
      dataListOrder:null,
      dataListOrderOnRq:null
    };
  },
  computed: {
    ...mapGetters("orders", ["orders"]),
    ...mapGetters("base", ["userInfo"]),
    bieuMaus() {
      if (this.dSBieuMauSuDung)
        return this.dSBieuMauSuDung.map(bieuMau =>
          bieuMau.parentId ? bieuMau : { ...bieuMau, parentId: 0 }
        );
      return [];
    }
  },
  methods: {
    ...mapActions("orders", ["getAllOrders", "resetOrder"]),
    themDeXuat(proposalForm) {
      this.order = Object.assign(
        {},
        {
          accountId: this.userInfo.id,
          proposalFormId: proposalForm.id,
          departmentId: this.userInfo.departmentId,
          title: proposalForm.name,
          factoryId: this.userInfo.factoryId,
          slug: proposalForm.slug
        }
      );
      console.log(this.order);
      this.showAddTask = true;
    },
    goBack() {
      this.$router.go(-2);
    },
    async loadData() {
      this.dataOrder = await this.getAllOrders(this.userInfo.id);
      const { data } = await axios.get(
        "/api/v2/accountForm?accountId=" + this.userInfo.id
      );
      this.dSBieuMauSuDung = data.data;
      console.log("this.dSBieuMauSuDung");
      console.log(this.dSBieuMauSuDung);
      console.log('orderdsdsd',this.orders)
      this.dataListOrder= await this.orders.data.filter(e=>e.Requests.length == 0 ) // chua trong tien trinh xu ly
      this.dataListOrderOnRq= await this.orders.data.filter(e=>e.Requests.length > 0 ) //trong tien trinh xu ly 
      console.log('this.dataListOrder', this.dataListOrder)
      console.log('this.dataListOrderOnRq', this.dataListOrderOnRq)
      console.log('this.orrders', this.dataListOrderOnRq)
      //  this.dataListOrder= await this.orders.data.sort((a,b)=> a.Requests.star - b.Requests.star)
      // console.log('this.dataListOrder',this.dataListOrder)
      // let array =[];
      // for(let i = 0 ; i<this.orders.data.length;i++){
      //   for(let j = 0 ; j<this.orders.data[i].Requests.length;j++){
      //     array.push(this.orders.data[i].Requests.sort((a,b)=> b.star - a.star))
      //   } 
      // }
      // console.log('array',array)
    }
  },
  components: {
    "add-task": require("components/eof/Requests/Modals/AddTask.vue").default,
    "tasks-todo": require("components/eof/Requests/TasksTodo.vue").default,
    "no-tasks": require("components/eof/Requests/NoTasks.vue").default,
    DxColumn,
    DxTreeList,
    DxSelection,
    DxSorting
  },
  created() {
    this.loadData();
  },
  mounted() {
    this.$root.$on("showAddOrder", () => {
      this.showAddTask = true;
    });
    this.proposalForms = this.dSBieuMauSuDung;
  }
};
</script>
<style>
.dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-inserted):not(.dx-row-removed):not(.dx-edit-row)
  > td:not(.dx-focused) {
  background-color: #6f8aa5;
  color: #333;
}
.dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-inserted):not(.dx-row-removed):not(.dx-edit-row)
  > td:not(.dx-focused).dx-datagrid-group-space {
  border-right-color: #6f8aa5;
}
.dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-inserted):not(.dx-row-removed):not(.dx-edit-row)
  > .dx-datagrid-readonly
  .dx-texteditor
  .dx-texteditor-input {
  background-color: #6f8aa5;
  color: #333;
}
</style>
