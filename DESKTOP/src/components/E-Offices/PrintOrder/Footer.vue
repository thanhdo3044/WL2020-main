<template>
  <q-markup-table class="q-pt-md col-12" separator="none" flat bordered>
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
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["order", "metaValue"],
  computed: {
    ...mapGetters("base", ["userInfo", "myFactoryInfor", "dSNhanVien"]),
    ...mapGetters("ordersm", ["getAccountById", "accounts"]),
  },
  data() {
    return {
      phoneNumber: "",
      account1: null,
      account2: null,
      position1: null,
      position2: null,
    };
  },
  created() {
    console.log("this.order test", this.order);
    this.loadAccountApprove();
  },
  methods: {
    ...mapActions("base", ["getAccountByID"]),
    async loadAccountApprove() {
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
    },
  },
};
</script>
