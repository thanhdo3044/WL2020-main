<template>
  <q-card-section>
    <div class="q-gutter-sm text-primary text-h6">
         Loại mẫu xin nghỉ :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
        <q-radio  dense v-model="metaValue.selection" val="Nghỉ phép" label="Nghỉ phép" color="teal"/>
        <q-radio  dense v-model="metaValue.selection" val="Nghỉ ốm" label="Nghỉ ốm" color="red"/>
        <q-radio  dense v-model="metaValue.selection" val="Nghỉ việc riêng có hưởng lương" label="Nghỉ việc riêng có hưởng lương" color="blue" />
        <q-radio  dense v-model="metaValue.selection" val="Xin nghỉ việc(kết thúc hợp đồng lao động)" label="Xin nghỉ việc(kết thúc hợp đồng lao động)" color="yellow"/>
        <q-radio  dense v-model="metaValue.selection" val="Xin nghỉ không lương" label="Xin nghỉ không lương" color="black"/>
        <q-radio  dense v-model="metaValue.selection" val="Xin nghỉ Thai sản" label="Xin nghỉ Thai sản" color="pink"/>
    </div>
    <div v-if="metaValue.selection == 'Xin nghỉ việc(kết thúc hợp đồng lao động)'">
        <div  class="flex">
          <q-input
          class="q-mt-sm q-pr-sm"
          style="width: 50% !important"
          outlined
          v-model="order.OrderMeta[0].fullName"
          label="Tên tôi là : "
          :readonly="disable"
        />
        <q-input
        style="width: 50% !important"
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].maNV"
        label="Mã nhân viên : "
        :readonly="disable"
        />
        </div>
        <div class="row">
          <q-input
        class="q-mt-sm q-mr-sm col"
        outlined
        v-model="order.OrderMeta[0].position"
        label="Chức vụ : "
        :readonly="disable"
        />
        <q-input
          class="q-mt-sm  col"
          outlined
          v-model="order.OrderMeta[0].department"
          label="Phòng ban/bộ phận : "
          :readonly="disable"/>
        </div>
        
         <div class="col">
          <div class="">Thời gian từ :</div>
          <div class="">
                       <q-input :readonly="disable" class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
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
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
      </div>
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].description"
        label="Lý do : "
        :readonly="disable"
        />
         <footerCard :order="order" :nextId="nextId" :active1="activesa"></footerCard>
    </div>
    <div v-if="metaValue.selection == 'Nghỉ phép' || metaValue.selection == 'Nghỉ ốm' || metaValue.selection == 'Nghỉ việc riêng có hưởng lương' &&   metaValue.selection != null">
          <q-input
        
          class="q-mt-sm "
          outlined
          v-model="order.OrderMeta[0].fullName"
          label="Tên tôi là : "
          :readonly="disable"
        />
        <q-input
     
        class="q-mt-sm " 
        outlined
        v-model="order.OrderMeta[0].position"
        label="Chức vụ : "
        :readonly="disable"
        />
        <q-input
  
          class="q-mt-sm "
          outlined
          v-model="order.OrderMeta[0].department"
          label="Phòng ban/bộ phận : "
          :readonly="disable"/>
        <div class="col">
          <div class="">Thời gian từ :</div>
          <div class="">
                       <q-input :readonly="disable" class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
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
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
      </div>
        <div class="col q-pl-sm">
        <div class="text-h8">Thời gian đến :</div>
        <div class="">
                    <q-input class="q-mb-sm" filled v-model="order.OrderMeta[0].dateEnd">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateEnd">
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
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateEnd" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                  </div>
      </div>
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].description"
        label="Lý do : "
        :readonly="disable"
        />
        <div class="q-mt-sm">
          <div style="color:blue" >Danh sách người được ủy quyền:</div>
        <q-chip
          removable
          v-for="(value, index) in listUserSelected"
          :key="index"
          color="orange"
          text-color="black"
        >
          {{ value.name }}
        </q-chip>
      </div>
        <footerCard :order="order" :nextId="nextId" :active1="activesa"></footerCard>
        
    </div>
    <div v-if="metaValue.selection == 'Xin nghỉ Thai sản' && metaValue.selection != null">
      <div class="row">
        <q-input
          class="q-mt-sm col"
          outlined
          v-model="order.OrderMeta[0].fullName"
          label="Tên tôi là : "
          :readonly="disable"
        />
        <q-input
        class="q-mt-sm col"
        outlined
        v-model="order.OrderMeta[0].maNV"
        label="Mã nhân viên : "
        :readonly="disable"
        />
      </div>
      <div class="row">
        <q-input
        class="q-mt-sm col"
        outlined
        v-model="order.OrderMeta[0].position"
        label="Chức vụ : "
        :readonly="disable"
        />
        <q-input
          class="q-mt-sm col"
          outlined
          v-model="order.OrderMeta[0].department"
          label="Phòng ban/bộ phận : "
          :readonly="disable"/>
      </div>
        
        
    <q-input
      class="q-mt-sm"
      outlined
      v-model="metaValue.thoiGianMangThai"
      label="Hiện tôi đang mang thai ở tháng thứ :"
      :readonly="disable"
    />
    <div class="col">
          <div class="">Thời gian từ :</div>
          <div class="">
                       <q-input :readonly="disable" class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
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
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
      </div>
     <footerCard :order="order" :nextId="nextId" :active1="activesa"></footerCard>
    </div>
    <div v-if="metaValue.selection == 'Xin nghỉ không lương' && metaValue.selection != null">
        <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].fullName"
      label="Tên tôi là : "
      :readonly="disable"
    />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].maNV"
        label="Mã nhân viên : "
        :readonly="disable"
        />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].position"
        label="Chức vụ : "
        :readonly="disable"
        />
        <q-input
          class="q-mt-sm"
          outlined
          v-model="order.OrderMeta[0].department"
          label="Phòng ban/bộ phận : "
          :readonly="disable"/>
            <div class="col">
          <div class="">Thời gian từ :</div>
          <div class="">
                       <q-input :readonly="disable" class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
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
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
      </div>
        <div class="col q-pl-sm">
        <div class="text-h8">Thời gian đến :</div>
        <div class="">
                    <q-input class="q-mb-sm" filled v-model="order.OrderMeta[0].dateEnd">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateEnd">
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
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateEnd" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                  </div>
      </div>

    <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].description"
      label="Lý do : "
      :readonly="disable"
    />
     <footerCard :order="order" :nextId2="nextId2" :nextId3="nextId3" :nextId="nextId" :active1="activesa"></footerCard>
    </div>
  </q-card-section>
</template>

<script>
import DxDateBox from "devextreme-vue/date-box";
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import footerCard from "components/eofs/Shared/footerCard";
import DxButton from "devextreme-vue/button";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxLookup,
    DxDateBox,
    footerCard,
  },
  props: ["metaValue", "disable"],
  data() {
    return {
      active1: false,
      nextId2: null,
      nextId3: null,
      myDepartment: null,
      stepDepartment: null,
      departments: [],
      events: [],
      options: null,
      nameDepartmentName: null,
      account: [],
      active: false,
      nextId: null,
      listUserSelected: [],
    };
  },
  async created() {
    console.log("order -1", this.order);
    // this.loadDepartment()
    let request = await this.getOneRequest(this.$route.query.id);
    console.log("request xin nghi viec :", request.uyQuyen);
    if (request.uyQuyen != null) {
      this.listUserSelected = JSON.parse(request.uyQuyen);
    }
    this.order.Requests.sort(this.compareValues("star", "asc"));
    let idDis = null;
    console.log("this.order 2:", this.order);
    for (let i = 0; i < this.order.Requests.length; i++) {
      if (this.order.Requests[i].id == this.$route.query.id) {
        console.log("order.request", this.order.Requests[i]);

        idDis = this.order.Requests[i].star;
        console.log("idDis", idDis);
      }
    }
    this.nextId = this.order.Requests.find((e) => e.star > idDis);
    console.log("data", this.nextId);
    this.nextId2 = this.order.Requests.filter(
      (e) => e.star > this.request.star && e.position != "Phòng vật tư"
    );
    this.nextId3 = this.order.Requests.filter(
      (e) =>
        e.star > this.request.star &&
        (e.position == "Phòng vật tư" || e.position == "Phòng bảo vệ")
    );
    console.log("this.nextId", this.nextId);
    console.log("this.nextId2", this.nextId2);
    console.log("this.nextId3", this.nextId3);
  },
  methods: {
    ...mapActions("requests", ["getOneRequest"]),
    compareValues(key, order = "asc") {
      return function (a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // nếu không tồn tại
          return 0;
        }

        const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
        const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order == "desc" ? comparison * -1 : comparison;
      };
    },
    async changed() {
      console.log("changed");
      console.log(
        "this.order.OrderMeta[0].position2 ",
        this.order.OrderMeta[0].position2
      );
      console.log("this.metaValue.account2.id", this.metaValue.accountName);
      this.order.OrderMeta[0].position2 = this.metaValue.accountName.position;
      let department222 = await this.GET_DEPARTMENTSBYID(
        this.metaValue.accountName.departmentId
      );
      console.log("department2", department222);
      this.order.OrderMeta[0].department2 = department222.NAME;
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.options = this.account;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.options = this.account.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    ...mapActions("base", [
      "GET_DEPARTMENTSBYID",
      "GET_DEPARTMENTSALL",
      "GET_ACCOUNTS",
    ]),
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      "addorderMeta",
      "deleteOrderMeta",
      "updateOrderMeta",
    ]),

    chonCongDoan() {
      console.log("myDepartment", this.myDepartment.value);
    },
    async loadDepartment() {
      const data = await this.$store.dispatch("base/GET_DEPARTMENTS", {
        factoryId: this.myFactoryInfor.id,
      });
      console.log("data", data.data);
      await data.data.forEach((e) => {
        this.departments.push({
          id: e.id,
          value: e.name,
        });
      });
      console.log("this.departments", this.departments);
    },
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["myFactoryInfor", "userInfo", "dsCongDoans"]),
    activesa() {
      let dateEnd = moment(this.order.OrderMeta[0].dateEnd.substring(0, 10), 'DD-MM-YYYY');
      let month = dateEnd.month();
      let year = dateEnd.year();
      let date = new Date(year, month +1, 3);
      let dateNow = new Date();
      if( dateNow > date){
        return this.active1 = true;
      }
      return this.active1 = false;
    },
  },
};
</script>
