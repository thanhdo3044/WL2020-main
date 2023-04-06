<template>
  <q-card-section>
    <div v-if="order.status == 'Không được duyệt'">
      <div class="flex">
        <q-input
          class="q-mt-sm q-pr-sm"
          style="width: 50% !important"
          outlined
          v-model="userInfo.lastName"
          label="Tên tôi là : "
          :readonly="!disable"
        />
        <q-input
          style="width: 50% !important"
          class="q-mt-sm"
          outlined
          v-model="userInfo.account"
          label="Mã nhân viên : "
          :readonly="!disable"
        />
      </div>
      <div class="flex">
        <q-input
          style="width: 50% !important"
          class="q-mt-sm q-pr-sm"
          outlined
          v-model="userInfo.position"
          label="Chức vụ : "
          :readonly="!disable"
        />
        <q-input
          style="width: 50% !important"
          class="q-mt-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="!disable"
        />
      </div>
      <q-select
        standout="bg-teal text-white"
        class="q-mt-sm"
        :readonly="!disable"
        v-model="order.OrderMeta[0].description"
        :options="options2"
        @input="activeDescription"
        label="Lý do"
        hint="Vui lòng chọn lý do !"
      />

      <div class="row q-mt-sm">
        <div class="col-12 col-sm-6 ">
          <div class="text-h8">Thời gian ra :</div>
          <div class="">
            <q-input
              :readonly="disable"
              class="q-mb-sm"
              filled
              fill-mask
              v-model="order.OrderMeta[0].dateStart"
              mask="##-##-#### ##:##"
              hint="Kiểu ngày giờ: ngày-tháng-năm giờ:phút"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      :readonly="disable"
                      mask="DD-MM-YYYY HH:mm"
                      v-model="order.OrderMeta[0].dateStart"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          @click="checkDateEnd"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      :readonly="disable"
                      v-model="order.OrderMeta[0].dateStart"
                      mask="DD-MM-YYYY HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          @click="checkDateEnd"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <div class="col-12 col-sm-6">
          <div class="text-h8">Thời gian vào :</div>
          <div class="">
            <q-input
              class="q-mb-sm"
              filled
              v-model="order.OrderMeta[0].dateEnd"
              mask="##-##-#### ##:##"
              fill-mask
              hint="Kiểu dữ liệu : ngày-tháng-năm giờ:phút"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      :readonly="disable"
                      mask="DD-MM-YYYY HH:mm"
                      v-model="order.OrderMeta[0].dateEnd"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          @click="checkDateEnd"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      :readonly="disable"
                      v-model="order.OrderMeta[0].dateEnd"
                      mask="DD-MM-YYYY HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          @click="checkDateEnd"
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </div>
      <q-btn
        class="q-mt-sm"
        v-on:click="updatedOrderMeta"
        color="primary"
        text-color="white"
        label="Sửa"
      />
    </div>
    <div v-else>
      <div class="flex">
        <q-input
          class="q-mt-sm q-pr-sm"
          style="width: 50% !important"
          outlined
          v-model="userInfo.lastName"
          label="Tên tôi là : "
          :readonly="disable"
        />
        <q-input
          style="width: 50% !important"
          class="q-mt-sm"
          outlined
          v-model="userInfo.account"
          label="Mã nhân viên : "
          :readonly="disable"
        />
      </div>
      <div class="flex">
        <q-input
          style="width: 50% !important"
          class="q-mt-sm q-pr-sm"
          outlined
          v-model="userInfo.position"
          label="Chức vụ : "
          :readonly="disable"
        />
        <q-input
          style="width: 50% !important"
          class="q-mt-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="disable"
        />
      </div>
      <q-select
        standout="bg-teal text-white"
        v-if="order.proposalFormId != 1043"
        class="q-mt-sm"
        :readonly="disable"
        v-model="order.OrderMeta[0].description"
        :options="options2"
        label="Lý do"
        hint="Vui lòng chọn lý do !"
      />
        <q-input
          class="q-mt-sm"
          v-if="order.proposalFormId == 1043"
          outlined
          v-model="order.OrderMeta[0].locationWork"
          label="Khách từ đâu đến : "
          :readonly="disable"
        />
        <q-input
          class="q-mt-sm"
          v-if="order.proposalFormId == 1043"
          outlined
          type="number"
          v-model="order.OrderMeta[0].total"
          label="Số lượng người : "
          :readonly="disable"
        />
       
        <q-select  outlined :readonly="disable" label="Nhà máy thăm quan : "  class="q-mt-sm" v-if="order.proposalFormId == 1043" v-model="factory" :options="factories"  />
        <q-input
          class="q-mt-sm"
          v-if="order.proposalFormId == 1043"
          outlined
          v-model="order.OrderMeta[0].work"
          label="Vị trí thăm quan : "
          :readonly="disable"
        />
        <q-input
          class="q-mt-sm"
          type="textarea"
          v-if="order.proposalFormId == 1043"
          outlined
          v-model="order.OrderMeta[0].description"
          label="Thông tin thêm : "
          :readonly="disable"
        />
      <div class="row q-mt-sm" v-if="order.proposalFormId != 1043">
        <div class="col-12 col-sm-6 ">
          <div class="text-h8">Thời gian ra :</div>
          <div class="">
            <q-input
              :readonly="disable"
              class="q-mb-sm"
              filled
              fill-mask
              v-model="order.OrderMeta[0].dateStart"
              mask="##-##-#### ##:##"
              :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021 07:30)'
              "
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      :readonly="disable"
                      mask="DD-MM-YYYY HH:mm"
                      v-model="order.OrderMeta[0].dateStart"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          @click="checkDateEnd"
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      :readonly="disable"
                      v-model="order.OrderMeta[0].dateStart"
                      mask="DD-MM-YYYY HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          @click="checkDateEnd"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <div class="col-12 col-sm-6">
          <div class="text-h8">Thời gian vào :</div>
          <div class="">
            <q-input
              class="q-mb-sm"
              filled
              v-model="order.OrderMeta[0].dateEnd"
              mask="##-##-#### ##:##"
              fill-mask
              :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021 16:30)'
              "
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      :readonly="disable"
                      mask="DD-MM-YYYY HH:mm"
                      v-model="order.OrderMeta[0].dateEnd"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          @click="checkDateEnd"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      :readonly="disable"
                      v-model="order.OrderMeta[0].dateEnd"
                      mask="DD-MM-YYYY HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          @click="checkDateEnd"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </div>
      <div class="row q-mt-sm" v-if="order.proposalFormId == 1043">
        <div class="col-12 col-sm-6 ">
          <div class="text-h8"></div>
          <div class="">
            <q-input
              :readonly="disable"
              class="q-mb-sm"
              filled
              label="Thời gian từ :"
              fill-mask
              v-model="order.OrderMeta[0].dateStart"
              mask="##-##-#### ##:##"
              :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021 07:30)'
              "
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      :readonly="disable"
                      mask="DD-MM-YYYY HH:mm"
                      v-model="order.OrderMeta[0].dateStart"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          @click="checkDateEnd"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      :readonly="disable"
                      v-model="order.OrderMeta[0].dateStart"
                      mask="DD-MM-YYYY HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          @click="checkDateEnd"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <div class="col-12 col-sm-6">
          <div class="text-h8"></div>
          <div class="">
            <q-input
              class="q-mb-sm"
              filled
              label="Thời gian đến :"
              v-model="order.OrderMeta[0].dateEnd"
              mask="##-##-#### ##:##"
              fill-mask
              :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021 16:30)'
              "
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      :readonly="disable"
                      mask="DD-MM-YYYY HH:mm"
                      v-model="order.OrderMeta[0].dateEnd"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          @click="checkDateEnd"
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      :readonly="disable"
                      v-model="order.OrderMeta[0].dateEnd"
                      mask="DD-MM-YYYY HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          @click="checkDateEnd"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </div>
    </div>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import moment from "moment";
export default {
  props: ["metaValue", "disable", "order"],
  data() {
    return {
      myDepartment: null,
      stepDepartment: null,
      departments: [],
      events: [],
      options: null,
      nameDepartmentName: null,
      account: [],
      active: false,
      options2: ["Công việc", "Lý do cá nhân"],
      factory:null,
      factories:[{
        label:"NM CBG Thuận Hưng",
        value:"1"
      },{
        label:"NM CBG YS1A-YS1B-YS2",
        value:"2"
      },{
        label:"NM CBG TB",
        value:"3"
      },{
        label:"NM CBG NH",
        value:"4"
      },{
        label:"NM CBG QM",
        value:"5"
      }]
    };
  },
  async mounted() {
    this.factory = null;
    if(this.order.OrderMeta[0].department2 == "1"){
      this.factory = "NM CBG Thuận Hưng"
    }else if(this.order.OrderMeta[0].department2 == "2"){
      this.factory = "NM CBG YS1A-YS1B-YS2"
    }else if(this.order.OrderMeta[0].department2 == "3"){
      this.factory = "NM CBG TB"
    }else if(this.order.OrderMeta[0].department2 == "4"){
      this.factory = "NM CBG NH"
    }else if(this.order.OrderMeta[0].department2 == "5"){
      this.factory = "NM CBG QM"
    }
  },
  async created() {
    let data = await this.GET_DEPARTMENTSALL();
    console.log("dataa", data);
   
    // this.loadDepartment()
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(
      this.userInfo.department
    );
    await data.forEach(element => {
      this.departments.push({
        value: element.ID,
        label: element.NAME
      });
    });
    console.log("options", this.departments);
    console.log(
      "this.order.OrderMeta[0].dateEnd ",
      this.order
    );
    if(this.order.OrderMeta[0].description == null) {
    await this.setTime();
    }
    
  },
  methods: {
    checkDateEnd(){
      if(this.order.OrderMeta[0].dateEnd < this.order.OrderMeta[0].dateStart){
        this.$q.dialog({
          title: "Lỗi",
          message: "thời gian vào phải lớn hơn thời gian ra!"
        });
      }
    },
    setTime(){
      this.order.OrderMeta[0].dateEnd = moment().format('DD-MM-YYYY hh:mm')
      this.order.OrderMeta[0].dateStart = moment().format('DD-MM-YYYY hh:mm');
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
    
    ...mapActions("base", [
      "GET_DEPARTMENTSBYID",
      "GET_DEPARTMENTSALL",
      "GET_ACCOUNTS"
    ]),
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      "addorderMeta",
      "deleteOrderMeta",
      "updateOrderMeta"
    ]),
    ...mapActions("requests", ["deleteRequest", "resetOrder"]),
    chonCongDoan() {
      console.log("myDepartment", this.myDepartment.value);
    },
    async loadDepartment() {
      const data = await this.$store.dispatch("base/GET_DEPARTMENTS", {
        factoryId: this.myFactoryInfor.id
      });
      console.log("data", data.data);
      await data.data.forEach(e => {
        this.departments.push({
          id: e.id,
          value: e.name
        });
      });
      console.log("this.departments", this.departments);
    },
    async updatedOrderMeta() {
      if (this.order.OrderMeta[0].description == null) {
        this.$q.notify({
          message: "Vui lòng chọn lý do ra cổng !",
          color: "red"
        });
      } else {
        console.log("this.metaValue.account2.id", this.metaValue.accountName);
        let kinhGui = this.order.OrderMeta[0].kinhGui;
        let fullName = this.userInfo.lastName;
        let selection = this.metaValue.selection;
        let position = this.userInfo.position;
        let maNV = this.userInfo.account;
        let locationWork =
          this.order.OrderMeta[0].locationWork == null
            ? " "
            : this.order.OrderMeta[0].locationWork;
        let total =
          this.order.OrderMeta[0].total == null
            ? " "
            : this.order.OrderMeta[0].total;
        let work =
          this.order.OrderMeta[0].work == null
            ? " "
            : this.order.OrderMeta[0].work;
        let dateStart =
          this.order.OrderMeta[0].dateStart == null
            ? " "
            : this.order.OrderMeta[0].dateStart;
        let dateEnd =
          this.order.OrderMeta[0].dateEnd == null
            ? " "
            : this.order.OrderMeta[0].dateEnd;
        let description =
          this.order.OrderMeta[0].description == null
            ? " "
            : this.order.OrderMeta[0].description;
        let department =
          this.nameDepartmentName.NAME == null
            ? " "
            : this.nameDepartmentName.NAME;
        let xinRaCong =
          this.order.OrderMeta[0].xinRaCong == null
            ? " "
            : this.order.OrderMeta[0].xinRaCong;
            let department2 =
            this.factory == null
              ? " "
              : this.factory.value;
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,
          selection,
          position,
          maNV,
          dateEnd,
          dateStart,
          description,
          department,
          xinRaCong,
          kinhGui,
          work,
          total,
          locationWork,
          department2
        });
        await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
        await this.deleteRequest(this.order.id);
        location.reload();
      }
    },
    activeDescription() {}
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["myFactoryInfor", "userInfo", "dsCongDoans"])
  },
  watch: {
    disable(newValue) {
      if(this.order.proposalFormId == 1043 ){
        this.$emit("emit-Descripton", this.factory.value);
      }

      if (newValue) {
        if (this.order.OrderMeta[0].description == null && this.order.proposalFormId != 1043 ) {
          this.$q.notify({
            message: "Thêm thất bại :  Vui lòng chọn lý do ra cổng !",
            color: "red"
          });
        } else {
          console.log("this.metaValue.account2.id", this.metaValue.accountName);
          let kinhGui = this.order.OrderMeta[0].kinhGui;
          let fullName = this.userInfo.lastName;
          let selection = this.metaValue.selection;
          let position = this.userInfo.position;
          let maNV = this.userInfo.account;
          let locationWork =
          this.order.OrderMeta[0].locationWork == null
            ? " "
            : this.order.OrderMeta[0].locationWork;
          let total =
          this.order.OrderMeta[0].total == null
            ? " "
            : this.order.OrderMeta[0].total;
          let work =
          this.order.OrderMeta[0].work == null
            ? " "
            : this.order.OrderMeta[0].work;
          let dateStart =
            this.order.OrderMeta[0].dateStart == null
              ? " "
              : this.order.OrderMeta[0].dateStart;
          let dateEnd =
            this.order.OrderMeta[0].dateEnd == null
              ? " "
              : this.order.OrderMeta[0].dateEnd;
          let description =
            this.order.OrderMeta[0].description == null
              ? " "
              : this.order.OrderMeta[0].description;
          let department =
            this.nameDepartmentName.NAME == null
              ? " "
              : this.nameDepartmentName.NAME;
          let xinRaCong =
            this.order.OrderMeta[0].xinRaCong == null
              ? " "
              : this.order.OrderMeta[0].xinRaCong;
          let department2 =
            this.factory == null
              ? " "
              : this.factory.value;
          this.updateOrderMeta({
            ...this.order.OrderMeta[0],
            metaValue: JSON.stringify([this.metaValue]),
            fullName,
            selection,
            position,
            maNV,
            dateEnd,
            dateStart,
            description,
            department,
            xinRaCong,
            kinhGui,
            work,
            total,
            locationWork,
            department2
          });
        }
      }
    }
  }
};
</script>
