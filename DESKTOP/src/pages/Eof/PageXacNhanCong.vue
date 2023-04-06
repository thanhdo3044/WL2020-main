<template>
  <q-page>
    <order-header :order="order" />
    <q-card class="my-card">
      <XacNhanCong  :metaValue="metaValue" :disable="disable"></XacNhanCong>
    </q-card>
    <!-- <order-files></order-files> -->
    <q-card>
      <q-card-section>
       <q-checkbox
          v-if="order.Requests == undefined"
          v-model="disable"
          label="Đồng ý"
        />
        <q-checkbox
         v-else-if="order.Requests && !Object.keys(order.Requests).length"
          v-model="disable"
          label="Đồng ý"
        />
      </q-card-section>
    </q-card>
    <order-approved :metaValue="metaValue" v-if="disable" :order="order" />
    <q-btn class="q-ma-sm"  color="primary" label="Message" @click="active" />
    <send-message  v-show="activeMess" :order="order" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SendMessage from "components/eof/Shared/SendMessage.vue";
import OrderHeader from "components/eof/Shared/OrderHeader.vue";
import OrderApproved from "components/eof/Shared/OrderApproved.vue";
import XacNhanCong from "components/eof/XacNhanCong.vue";
export default {
  data() {
    return {
      disable: false,
      activeMess:false,
      metaValue: {
        kinhGui: "Ban TGĐ - Phòng NS",
        noiDungTT: "",
        soTien: 0,
        vietBangChu: "",
        kemTheo: "",
        STT:"",
        locationWork:"",
        position:"",
        number:"",
        timeRecruit:"",
        description:"",
        fullName:"",
        maNV:"",
        department:"",
        stepDepartment:"",
        lyDo:"",
        date:"",
        work:"",
        total:"",
        dateStart:"",
        dateEnd:"",
        hoursIn:"",
        hoursOut:"",
        totalHours:"",
        selection1:null,
        selection2:null,
        selection3:null,
        selection4:null,
        selection:null,
      }
    };
  },
  components: {
    SendMessage,
    OrderHeader,
    OrderApproved,
    XacNhanCong
  },
  methods: {
    active(){
      if(!this.activeMess) this.activeMess =!this.activeMess
      else this.activeMess =!this.activeMess
    },
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta"])
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo", "myFactoryInfor"])
  },
  created() {
    if (this.$route.query.id) {
      this.getOneOrder(this.$route.query.id).then(res => {
        if (res.data.data.Requests.length) this.disable = true;
        this.metaValue = Object.assign(
          this.metaValue,
          JSON.parse(res.data.data.OrderMeta[0].metaValue)[0]
        );
      });
    } else {
      this.$router.push({
        path: "/tao-de-xuat"
      });
    }
  },
  // watch: {
  //   disable(newValue) {
  //     if (newValue) {
  //       this.addorderMeta({
  //         ...this.order.OrderMeta[0],
  //         metaValue: JSON.stringify([this.metaValue])
  //       });
  //     }
  //   }
  // }
};
</script>
