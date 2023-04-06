<template>
  <q-page class="q-pa-md bg-blue-grey-7">
    <app-bar class="text-white">Xử lý sản phẩm lỗi</app-bar>
    <q-select
            outlined
            dark 
            label-color="amber"
            @clear="clear"
            style="
              font-family: 'Time New Roman';
              font-size: 16px;
              text-align: center;
            "
            v-model="proces"
            @input="searchByProcess"
            behavior="dialog"
            bg-color="bg-blue-grey-7"
            :options="process"
            label="Chọn công đoạn :"
          />
            <q-input
            label-color="amber"
            outlined
            dark 
            v-model="quicachSearch"
            @input="search"
            label="Tìm theo qui cách"
          />
    <div class="row q-mt-md justify-center" v-if="showSearchModel1 == true">
      <div
        class="col-12 col-sm-6 col-md-3 col-lg-3 q-ma-sm "
        v-for="(item, index) in inventorys"
        :key="index"
      >
        <q-card class="bg-blue-grey-7" style="border: 2px solid white">
          <q-card-section >
            <div class="prodTextTitle text-white">
              <p><span class="prodTextTitle" style="color:#f6b024">Tên :</span> <span class="prodTextTitle text-white">{{ item.item.name }}</span></p>
              <p> <span style="color:#f6b024">Qui cách :</span> 
              {{
                item.item.height +
                "*" +
                item.item.width +
                "*" +
                item.item.length
              }} </p>

              <p style="color: amber">
                <span style="color:#f6b024">Số lượng còn phải xử lý:</span> {{ item.remain
                }}{{ item.item.unit.name }}
              </p>
              
            </div>
            <!-- <p><span class="prodTextTitle" style="color:#f6b024">Từ :</span><span class="prodTextTitle text-white">{{ item.from.name }}</span></p> -->
            <p><span class="prodTextTitle" style="color:#f6b024">LSX :</span><span class="prodTextTitle text-white">{{ item.LSX }}</span></p>
            <p><span class="prodTextTitle" style="color:#f6b024">Mã báo lỗi :</span><span class="prodTextTitle text-red">{{ item.ID_QC }}</span></p> 
          </q-card-section>
          <q-separator></q-separator>
          <q-card-actions align="around">
            <q-btn
              @click="goHistory(item.fromId, item.ID_QC)"
              class="glossy"
              rounded
              color="primary"
              label="Lịch sử lỗi"
            />
            <q-btn
              @click="goHandle(item)"
              class="glossy"
              rounded
              color="orange"
              label="Xử lý"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <!-- <q-dialog
      v-model="showSearchModel"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="prodTextTitle">Chọn công đoạn báo lỗi</div>
        </q-card-section>

        <q-card-section>
          <q-select
            clearable
            @clear="clear"
            style="
              font-family: 'Time New Roman';
              font-size: 16px;
              text-align: center;
            "
            v-model="proces"
            @input="searchByProcess"
            behavior="dialog"
            :options="process"
            label="Chọn công đoạn :"
          />
          <br />
          <q-input
            v-show="proces === null"
            outlined
            v-model="quicachSearch"
            @input="search"
            label="Tìm theo qui cách"
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" @click="closeSearch" />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    <!-- <q-page-sticky position="bottom-left" :offset="[18, 18]">
      <q-btn fab @click="showSearch" icon="search" color="secondary" />
    </q-page-sticky> -->
    <q-inner-loading :showing="showLoad">
      <q-spinner-gears size="150px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AppBar from "../../components/AppBar";
export default {
  components: {
    "app-bar": AppBar,
  },
  computed: {
    ...mapGetters("base", ["myDepartments", "userInfo"]),
  },
  data() {
    return {
      showLoad: true,
      inventorys: [],
      showSearchModel: true,
      showSearchModel1: false,
      quicachSearch: "",
      process: [],
      proces: null,
      departmentId: null,
      searchResultNumber: 0,
    };
  },
  created() {
    const { departmentId } = this.$route.query;
    console.log("departmentId", departmentId);
    this.departmentId = departmentId;
    this.initData();
    // const factoryId = this.$store.getters['base/myFactoryInfor'].id
    let tokenFB = localStorage.getItem("tokenFBB");
    // if (tokenFB) {
    //   this.$subcriberTopic(factoryId+'-QC')
    // }
  },
  methods: {
    goHistory(stepId, itemId) {
      let payload = itemId;
      // let payload = stepId.toString()+'-'+itemId.item.itemId.toString()+'-'+itemId.id
      this.$router.push({
        name: "qchistorybystep",
        params: { stepid: payload },
      });
    },
    initData() {
      //    const factoryId = this.userInfo.factoryId
      const payload = {
        token: this.$store.state.production.userInfo.token,
        stepId: this.userInfo.factoryId,
      };
      
      this.$store
        .dispatch("production/ACTION_GET_INVENTORY_QC", payload)
        .then((res) => {
          this.inventorys = res.data.filter(d => d.from.id == this.departmentId);
          console.log("thu nghiem", this.inventorys);
          this.showLoad = false;
          res.data.forEach((element) => {
            if (
              this.process.findIndex((p) => {
                return p.value === element.from.id;
              }) === -1
            ) {
              const pr = {
                label: element.from.name,
                value: element.from.id,
              };
              this.process.push(pr);
            }
          });
          if (this.departmentId) {
            this.proces = this.process.find(
              (p) => p.value == this.departmentId
            );
            this.closeSearch();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    goHandle(inv) {
      this.$store.dispatch("production/ACTION_SELECT_INVENTORY_QC", inv);
      this.$router.push("/production-handle-qc");
    },
    clear(val) {
      console.log(val);
      this.proces = null;
    },
    showSearch() {
      this.showSearchModel = true;
    },
    // showSearch1(){
    //   this.showSearchModel1 = true
    // },
    searchByProcess(proSelect) {
      console.log("kiem tra", proSelect);
      if (proSelect !== null) {
        let pss = this.$store.state.production.inventoryQCs.filter((obj) => {
          return obj.from.id === proSelect.value;
        });
        this.inventorys = pss;
        this.searchResultNumber = pss.length;
        
      } else {
        this.inventorys = this.$store.state.production.inventoryQCs;
        this.searchResultNumber = this.inventorys.length;
      }
      this.$router.replace({
          path: this.$route.fullPath,
          query: {
            departmentId: proSelect.value,
          },
        });
        this.closeSearch();
    },
    closeSearch() {
      this.showSearchModel = false;
      this.showSearchModel1 = true;
      this.$q.notify({
        message: "Tìm thấy " + this.searchResultNumber + " kết quả ",
        color: "cyan",
      });
    },
    search() {
      let pss = this.$store.state.production.inventoryQCs.filter((obj) => {
        const itemHeight = obj.item.height || "";
        const itemWidth = obj.item.width || "";
        const itemLength = obj.item.length || "";
        let quicach =
          itemHeight.toString() + itemWidth.toString() + itemLength.toString();
        if (quicach.toString().search(this.quicachSearch) !== -1) {
          return obj;
        }
      });
      if (pss.length > 0) {
        this.inventorys = pss;
        this.searchResultNumber = pss.length;
      } else {
        this.inventorys = this.$store.state.production.inventoryQCs;
        this.searchResultNumber = this.inventorys.length;
      }
    },
  },
};
</script>

<style>
.q-virtual-scroll__content{
  background-color: #546e7a;
}
</style>