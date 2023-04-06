<template>
  <q-page>
    <order-header :order="order" />
    <q-card class="my-card">
      <XinNghiViec  :metaValue="metaValue" :disable="disable"></XinNghiViec>
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
    <order-approved v-if="disable" :metaValue="metaValue" :order="order"/>

    <send-message :order="order" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SendMessage from "components/eof/Shared/SendMessage.vue";
import OrderHeader from "components/eof/Shared/OrderHeader.vue";
import OrderApproved from "components/eof/Shared/OrderApproved.vue";
import XinNghiViec from "components/eof/XinNghiViec.vue";
export default {
  data() {
    return {
      disable: false,
      metaValue: {
        kinhGui: "Ban TGĐ - Trưởng phòng/phó phòng ban :  -	GĐSX/Phó GĐSX/Phụ trách nhà máy :",
        noiDungTT: "",
        soTien: 0,
        vietBangChu: "",
        kemTheo: "",
        STT:"12",
        locationWork:"",
        position:"",
        position2:"",
        number:"",
        timeRecruit:"",
        description:"",
        fullName:"",
        fullName2:"",
        maNV:"",
        department:"",
        department2:"",
        stepDepartment:"",
        lyDo:"",
        dateStart:"",
        dateEnd:"",
        selection1:null,
        selection2:null,
        selection3:null,
        selection4:null,
        selection:null,
        thoiGianMangThai:"",
        accountName:""
      }
    };
  },
  components: {
    SendMessage,
    OrderHeader,
    OrderApproved,
    XinNghiViec
  },
  methods: {
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
