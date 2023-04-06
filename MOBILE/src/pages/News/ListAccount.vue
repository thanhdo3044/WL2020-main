<template>
  <q-page>
    <div class="row">
      <q-btn
      class="col-2 bg-orange text-white shadow-5"
      size="12px"
      v-go-back.single
      icon="arrow_back"
      push
      label=""
    />
    <div class="col-8 title1">
      CÔNG TY CỔ PHẦN WOODSLAND
    </div>
    </div>
    <hr width="50%">
    <div class="row q-pa-md">
      <div
        v-for="(department, index) in departments"
        :key="index"
        class="col-12"
        @click="onSelect(department.ID)"
      >
        <div class="item row" :style="'background-color:'+color[index%3]">
          <div class="col-12 department-name">{{ department.NAME }}</div>
          <div class="col-12">
            
            <div class="last-name">{{ department.POSITION }}: {{ department.LAST_NAME }}</div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      departments: [],
      departmentFilter: [],
      listAccount: [],
      color: [
         "#26a69a", "#ffc107", "#00bcd4"
      ]
    };
  },
  created() {
    this.loadDepartment();
  },
  methods: {
    ...mapActions("base", ["getDepartmentKhoi", "getAccountByDepartmentId"]),
    async loadDepartment() {
      const data = await this.getDepartmentKhoi();
      this.departments = data;
      console.log("data", data);
    },
    onSelect(id){
      if(id == 102298 || id == 102627){
        this.$router.push({
        name: "list-account3",
        params: { departmentId: id }
      });
      }else{
        this.$router.push({
        name: "list-account2",
        params: { departmentId: id }
      });
      }
        
    }
  },
};
</script>

<style>
.title1{
  color: #21ba45;
  text-align: center;
  font-weight: bold;
  font-size: 15px;
}
.item {
  background-repeat: no-repeat;
  background-size: cover;
  margin: 7px;
  padding: 10px;
  border-radius: 20px;
  color: white;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 5px;
}
.department-name {
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  padding-bottom: 10px;
}
.last-name{
  text-align: center;
}
</style>