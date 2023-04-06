<template>
  <q-page padding class="body">
    <header-page style="margin-top:-10px" :order="order"></header-page>
    <content-page :order="order" :metaValue="metaValue"></content-page>
    <!-- <order-approved v-if="disable" :order="order" /> -->
    <q-markup-table v-if="isShow" class="q-pt-md col-12" separator="none" flat bordered>
    <div class="row">
      <div class="col-4" align="center">Người đề xuất</div>
      <div class="col-4" align="center">{{ position1 }}</div>
      <div class="col-4" v-if="position2" align="center">{{ position2 }}</div>
    </div>
    <div class="row">
      <div class="col-4" align="center">
        <img
              alt="Không có chữ kí số"
              width="auto"
              height="50"
              v-bind:src="'/statics/' + order.Account.ID + '.png'"
            />
      </div>
      <div class="col-4" align="center">
        <img
              alt="Không có chữ kí số"
              width="auto"
              height="50"
              v-bind:src="'/statics/' + account1.ID + '.png'"
            />
      </div>
      <div class="col-4" v-if="account2" align="center">
        <img
              alt="Không có chữ kí số"
              width="auto"
              height="50"
              v-bind:src="'/statics/' + account2.ID + '.png'"
            />
      </div>
    </div>
    <div class="row">
      <div class="col-4" align="center">{{order.Account.lastName}}</div>
      <div class="col-4" align="center">{{ account1.LAST_NAME }}</div>
      <div class="col-4" v-if="account2" align="center">{{ account2.LAST_NAME }}</div>
    </div>
  </q-markup-table>

    <!-- <footer-page :order="order" :metaValue="metaValue"></footer-page> -->
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import HeaderPage from "components/E-Offices/PrintOrder/HeaderPage.vue";
import ContentPage from "components/E-Offices/PrintOrder/ContentPage.vue";
import FooterPage from "components/E-Offices/PrintOrder/Footer.vue";
import OrderApproved from "components/eof/Shared/OrderApproved.vue";

export default {
  name: "PrintOrder",
  data(){
    return{
      disable:true,
      phoneNumber: "",
      isShow:false,
      account1: null,
      account2: null,
      position1: null,
      position2: null,
    }
  },
  computed: {
    ...mapGetters("orders", ["order", "metaValue"])
  },
  methods: {
    ...mapActions("orders", ["getOneOrder", "activeSeenOrder"]),
    ...mapActions("base", ["getAccountByID"]),
    async loadAccountApprove() {
      console.log("this.order",this.order);
      let payload = {
        id: this.$route.query.id,
        activeSeen: 1
      };
      await this.activeSeenOrder(payload);
      if (this.order) {
        let request1 = this.order.Requests[0];
        this.account1 = await this.getAccountByID(
          request1.accountIdAuthorised
            ? request1.accountIdAuthorised
            : request1.accountId
        );
        if (request1.isAuthority) {
          this.position1 = request1.position + " được ủy quyền ký";
        } else {
          this.position1 = request1.position;
        }
        console.log("account1", this.account1);
        console.log("this.position1", this.position1);
        if (this.order.Requests.length == 2) {
          let request2 = this.order.Requests[1];
          this.account2 = await this.getAccountByID(
            request2.accountIdAuthorised
              ? request2.accountIdAuthorised
              : request2.accountId
          );
          if (request2.isAuthority) {
            this.position2 = request2.position + " được ủy quyền ký";
          } else {
            this.position2 = request2.position;
          }
        }
      }
      this.isShow = true;
    },
  },
  created() {
    if (this.$route.query.id) this.getOneOrder(this.$route.query.id);
    this.loadAccountApprove();
  },
  components: {
    FooterPage,
    HeaderPage,
    ContentPage,
    OrderApproved
  }
};
</script>

<style scoped>
.print {
  border-style: none;
}
.body{
  font-family: 'Times New Roman', Times, serif !important;
}
</style>
