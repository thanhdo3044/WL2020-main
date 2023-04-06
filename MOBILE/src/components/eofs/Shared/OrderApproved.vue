<template>
  <div>
    <q-card class="my-card" v-if="!requests.length">
      <q-card-actions class="q-mt-lg">
        <q-btn @click="promptToApproved" color="teal" dense>
          <q-icon left size="3em" name="send" />
          <div>Gửi phê duyệt
          </div>
        </q-btn>
      </q-card-actions>
    </q-card>
    <div v-else class="q-pa-md print">
      <q-markup-table separator="none" flat bordered>
        <thead>
          <tr>
            <th class="text-center">Người đề xuất</th>
            <th
              v-for="request in requests"
              class="text-center"
              :key="request.id"
            >
              {{ request.position }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">{{ order.Account.account }}</td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
            >
              {{ request.status }}
            </td>
          </tr>
          <tr>
            <td class="text-center q-ma-lg">{{ order.Account.lastName }}</td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
            >
              {{ getAccountById(request.accountId) | lastName }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { uid } from "quasar";
export default {
  props: ["order"],
  data() {
    return {
      requests: []
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo", "myFactoryInfor", "dSNhanVien"]),
    ...mapGetters("orders", ["getAccountById"])
  },
  methods: {
    ...mapActions("orders", ["sendToApproved"]),

    async taoDSKy() {
      //Nếu trình ký thì tạo danh sách trình ký
      if (!this.requests.length) {
        let newRequests = [];
        let newRequest = {
          id: uid(),
          parentId: null,
          accountId: this.order.Department.accountId,
          fromAccountId: this.order.accountId,
          orderId: this.order.id,
          departmentId: this.order.Department.id,
          factoryId: this.order.Department.factoryId,
          title: [
            this.order.ProposalForm.name,
            this.order.number + "/2021/TH"
          ].join(" "),
          status: "Chưa ký",
          name: "test",
          position: "Trưởng bộ phận",
          showMessages: true,
          isDisable: false,
          completed: false
        };
        
        //Chữ ký cấp trưởng bộ phận
        if (newRequest.accountId) await newRequests.push(newRequest);

        if (this.myFactoryInfor.accountId) {
          newRequest = await {
            ...newRequest,
            parentId: newRequest.id,
            id: uid(),
            accountId: this.myFactoryInfor.accountId,
            position: "Nhà máy",
            isDisable: true
          };

          //Chữ ký cấp nhà máy
          await newRequests.push(newRequest);
        };
        if (this.order.Department.id)
        {
          
        }
        newRequest = await {
          ...newRequest,
          parentId: newRequest.id,
          id: uid(),
          accountId: 100281,
          position: "Ban TGĐ"
        };
        //Chữ ký Ban lãnh đạo
        await newRequests.push(newRequest);

        this.requests = newRequests;
      }
    },
    promptToApproved() {
      this.$q
        .dialog({
          title: "Xác nhận",
          message: "Bạn muốn gửi phê duyệt?",
          ok: {
            push: true
          },
          cancel: {
            color: "green"
          },
          persistent: true
        })
        .onOk(async () => {
          await this.taoDSKy();
          this.sendToApproved(this.requests);
        });
    },
    async loadDSKy() {
      let requests = await [...this.order.Requests];
      this.requests = requests;
    }
  },
  mounted() {
    this.loadDSKy();
  }
};
</script>
