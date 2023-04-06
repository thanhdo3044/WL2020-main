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
    <div class="col-8 title-account">
      {{ departmentName }}
    </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-input
          outlined
          v-model="searchQuery"
          @input="timkiem"
          type="text"
          label="Tìm kiếm"
          dense
        />
      </div>
    </div>
    <hr width="50%">
    <div class="row">
      <div
        v-for="(account, index) in dataAccountFilter"
        :key="index"
        class="col-12"
      >
        <div class="item-account row" :style="'background-color:'+color[0]">
          <div class="col-12 ">
            <div class="row">
              <div class="col-4"></div>
              <div class="col-4 department-name-account">{{ account.POSITION }}</div>
              <div class="col-4"></div>
            </div>
          </div>
          <div class="col-12">
            
            <div>Họ và tên: <span class="last-name">{{ account.LAST_NAME }}</span> </div>
            <div class="position">Email: {{ account.EMAIL }}</div>
            <div class="position">Số điện thoại: {{ account.PHONE }}</div>
            <div class="position">Số máy lẻ: {{ account.PHONE_EXT }}</div>
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
      accounts: [],
      departmentName: [],
      listAccount: [],
      departmentId: null,
      searchQuery: "",
      dataAccountFilter: [],
      color: [
        "#cfd8dc"
      ]
    };
  },
  created() {
    this.departmentId = this.$route.params.departmentId;
    this.loadDepartmentName();
    this.loadAccount();
  },
  methods: {
    ...mapActions("base", ["getDepartmentByParentId", "getAccountByDepartmentId", "getDepartmentById"]),
    async loadAccount() {
      const payload = {
          departmentId: this.departmentId
      }
      const data = await this.getAccountByDepartmentId(payload);
      this.accounts = data.data;
      this.dataAccountFilter = this.accounts;
      this.departmentName = this.accounts[0].NAME;
      console.log("data", data);
    },
    async loadDepartmentName(){
        const department = await this.getDepartmentById(this.departmentId);
        this.departmentName = department[0].NAME;
    },
    async timkiem() {
      if (this.searchQuery) {

          this.dataAccountFilter = this.accounts.filter((d) => {
            const matchString = d.LAST_NAME;
            return matchString
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase());
          });
      }
    },
  },
};
</script>

<style>

.title-account{
  color: #21ba45;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
}
.item-account {
  background-repeat: no-repeat;
  background-size: cover;
  font-family: 'Times New Roman', Times, serif;
  border-radius: 20px;
  margin: 5px;
  padding: 10px;
  color: black;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 5px;
}
.department-name-account {
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  color: white;
  background-color: #31ccec;
  font-size: 10px;
}
.last-name{
  font-weight: bold;
}
</style>