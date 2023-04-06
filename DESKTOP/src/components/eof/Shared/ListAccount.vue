<template>
  <div>
    <div>
      <p>
        Danh sách thành viên : <b>{{ listAccounts.data.length }}</b> người
      </p>
      <p>
        Tối đa số lượng : <b>{{ getCarById(car).seats }}</b> người
      </p>
      <ol>
        <li
          v-for="(item, index) in listAccounts.data"
          class="q-ma-sm"
          style="font-weight:bold"
        >
          Tên : {{ item.Account.lastName }} - Mã NV : {{ item.Account.id }} -
          Chức vụ :
          {{
            item.Account.position == null ? "chưa có" : item.Account.position
          }}
        </li>
      </ol>
    </div>
    <!-- <div>listAccounts :{{ listAccounts.data }}</div> -->
    <q-dialog
      v-model="prompt"
      persistent
      v-if="getCarById(car).seats > listAccounts.data.length"
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Chọn người (Nhân viên)</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select
            filled
            v-model="userInfo.lastName"
            :options="userInfo.id"
            emit-value
            map-options
            :disable="disable"
          />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Hủy" v-close-popup />
          <q-btn
            flat
            label="Thêm người"
            v-close-popup
            @click="addAccount(userInfo.id)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="prompt" v-else>
      <q-card>
        <q-card-section>
          Đã đủ số người đăng kí !
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="prompts" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Chọn người (Nhân viên)</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select
            filled
            v-model="userInfo.lastName"
            :options="userInfo.id"
            emit-value
            map-options
            :disable="disable"
          />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Hủy" v-close-popup />
          <q-btn
            flat
            label="Xóa người"
            v-close-popup
            @click="delAccount(userInfo.id)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="absolute-bottom text-right">
      <q-btn
        dense
        @click="prompt = true"
        round
        color="primary"
        size="18px"
        icon="add"
      />
    </div>
    <div style="margin-right:60px;" class="absolute-bottom q-mr-sm text-right">
      <q-btn
        dense
        @click="prompts = true"
        round
        color="primary"
        size="18px"
        icon="delete"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      prompts: false,
      car: {},
      listAccounts: null,
      prompt: false,
      accountId: null
    };
  },
  props: ["accounts", "disable", "car"],
  computed: {
    ...mapActions("orders", [
      "getOneOrder",
      "addMessage",
      "getAllRequests",
      "sendToApproved"
    ]),
    ...mapGetters("ordersm", [
      "getAccountsOption",
      "getCarsOption",
      "getCarById"
    ]),
    ...mapGetters("base", ["userInfo"])
  },
  created() {
    let orderMetaId = this.$route.query.id;
    axios({
      method: "GET",
      url: `/api/v1/userRegistration?orderMetaId=` + orderMetaId
    })
      .then(res => {
        if (res) {
          this.listAccounts = res.data;
        }
      })
      .catch(err => {
        if (err) {
          this.$q.notify({
            type: "positive"
          });
        }
      });
  },
  methods: {
    promptToDelete(account) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Really delete?",
          ok: {
            push: true
          },
          cancel: {
            color: "negative"
          },
          persistent: true
        })
        .onOk(() => {
          let index = this.accounts.findIndex(a => a === account);
          this.accounts.splice(index, 1);
        });
    },
    async addAccount(accountId) {
      let orderMetaId = this.$route.query.id;
      await axios({
        method: "POST",
        url: "/api/v1/userRegistration",
        data: {
          accountId: `${accountId}`,
          orderMetaId: this.$route.query.id
        }
      })
        .then(res => {
          if (res) {
            this.$q.notify({
              message: "Thêm thành công",
              color: "purple",
              icon: "announcement"
            });
          }
        })
        .catch(err => {
          if (err) {
            this.$q.notify({
              message: "Thêm thất bại do user đã tồn tại",
              color: "purple",
              icon: "announcement"
            });
          }
        });
      await axios({
        method: "get",
        url: `/api/v1/userRegistration?orderMetaId=` + orderMetaId
      })
        .then(res => {
          if (res) {
            return (this.listAccounts = res.data);
          }
        })
        .catch(err => {
          if (err) {
            this.$q.notify({
              message: "Lỗi lấy dữ liệu",
              color: "purple",
              icon: "announcement"
            });
          }
        });
    },
    async delAccount(accountId) {
      let orderMetaId = this.$route.query.id;
      await axios({
        method: "delete",
        url: "/api/v1/userRegistration",
        data: {
          accountId: `${accountId}`,
          orderMetaId: this.$route.query.id
        }
      })
        .then(res => {
          if (res) {
            this.$q.notify({
              message: "Xóa thành công",
              color: "purple",
              icon: "announcement"
            });
          }
        })
        .catch(err => {
          if (err) {
            this.$q.notify({
              message: "Xóa thất bại do k tồn tại",
              color: "purple",
              icon: "announcement"
            });
          }
        });
      await axios({
        method: "get",
        url: `/api/v1/userRegistration?orderMetaId=` + orderMetaId
      })
        .then(res => {
          if (res) {
            return (this.listAccounts = res.data);
          }
        })
        .catch(err => {
          if (err) {
            this.$q.notify({
              message: "Lỗi lấy dữ liệu",
              color: "purple",
              icon: "announcement"
            });
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
