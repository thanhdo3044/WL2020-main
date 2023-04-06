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
    <div class="col-8 title">
      {{ departmentName }}
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
            <div v-if="department.POSITION2 != NULL" class="last-name">{{ department.POSITION2 }}: {{ department.LAST_NAME2 }}</div>
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
      listAccount: [],
      departmentId: null,
      departmentName: null,
      color: [
         "#26a69a", "#ffc107", "#00bcd4"
      ]
    };
  },
  created() {
    this.departmentId = this.$route.params.departmentId;
    this.loadDepartmentName();
    console.log("departmentName", this.departmentName)
    this.loadDepartment();
  },
  methods: {
    ...mapActions("base", ["getDepartmentByParentId", "getAccountByDepartmentId", "getDepartmentById"]),
    async loadDepartment() {
      const payload = {
          parentId: this.departmentId
      }
      const data = await this.getDepartmentByParentId(payload);
      this.departments = data;
      console.log("data", data);
    },
    async loadDepartmentName(){
        const department = await this.getDepartmentById(this.departmentId);
        this.departmentName = department[0].NAME;
    },
    onSelect(id){
        this.$router.push({
        name: "list-account3",
        params: { departmentId: id }
      });
    }
  },
};
</script>

<style>
.title{
  color: #21ba45;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
}
.item {
  background-repeat: no-repeat;
  background-size: cover;
  margin: 7px;
  padding: 20px;
  border-radius: 20px;
  color: white;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 5px;
}
.department-name {
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
}
</style>