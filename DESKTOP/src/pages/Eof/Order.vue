<template>
  <q-page ref="pageOrder">
    <q-banner>
      <q-btn to="/tao-de-xuat" label="Quay lại" />
    </q-banner>

    <order-lines-todo :order="order" />

    <div
      v-if="order.Requests && !order.Requests.length"
      class="absolute-bottom text-center q-mb-lg"
    >
      <q-btn @click="addTask" round color="primary" size="24px" icon="add" />
    </div>
    <div v-if="order.Requests.length" class="q-pa-md print">
      <q-markup-table separator="none" flat bordered>
        <thead>
          <tr>
            <th class="text-center">Người đề xuất</th>
            <th
              v-for="request in order.Requests"
              class="text-center"
              :key="request.id"
            >
              {{ request.position }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">{{ order.status }}</td>
            <td
              v-for="request in order.Requests"
              class="text-center"
              :key="request.id"
            >
              {{ request.status }}
            </td>
          </tr>
          <tr>
            <td class="text-center q-ma-lg">{{ order.signature }}</td>
            <td
              v-for="request in order.Requests"
              class="text-center"
              :key="request.id"
            >
              {{ request.name }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>

    <q-dialog v-model="showAddTask">
      <add-order-line @close="showAddTask = false" />
    </q-dialog>

    <div
      :class="{ invisible: !showMessages }"
      class="q-pa-md column col justify-end"
    >
      <q-chat-message
        v-for="(message, key) in order.Messages"
        :key="key"
        :name="message.userId"
        :text="[message.text]"
        :sent="message.userId.trim() == userInfo.account ? true : false"
        :bg-color="
          message.userId == userInfo.account ? 'white' : 'light-green-2'
        "
        :stamp="message.createdAt | luc"
      />
    </div>

    <q-footer elevated>
      <q-toolbar>
        <q-form @submit="sendMessage" class="full-width">
          <q-input
            v-model="newMessage"
            @blur="scrollToBottom"
            ref="newMessage"
            bg-color="white"
            outlined
            label="Message"
            dense
          >
            <template v-slot:after>
              <q-btn
                round
                dense
                flat
                @click="sendMessage"
                color="white"
                icon="send"
              />
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AddOrderLine from "components/OrderLines/Modals/AddOrderLine.vue";
import OrderLinesTodo from "components/OrderLines/OrderLinesTodo.vue";
export default {
  data() {
    return {
      showAddTask: false,
      newMessage: "",
      showMessages: true
    };
  },
  computed: {
    ...mapGetters("orders", ["order", "requests"]),
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("messages", ["messages"])
  },
  methods: {
    ...mapActions("orders", [
      "getOneOrder",
      "resetOrderLine",
      "addMessage",
      "sendToApproved"
    ]),
    addTask() {
      this.showAddTask = true;
      this.resetOrderLine({
        userId: this.userInfo.account,
        orderId: this.order.id,
        costcenterId: this.order.id,
        companyId: this.order.id
      });
    },
    sendMessage() {
      console.log("send");
      this.addMessage({
        id: "",
        userId: this.userInfo.account,
        orderableId: this.order.id,
        orderableType: "order",
        text: this.newMessage
      });
      this.clearMessage();
    },
    clearMessage() {
      this.newMessage = "";
      this.$refs.newMessage.focus();
    },
    scrollToBottom() {
      let pageOrder = this.$refs.pageOrder.$el;
      setTimeout(() => {
        window.scrollTo(0, pageOrder.scrollHeight);
      }, 20);
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getOneOrder(this.$route.query.id);
    } else {
      this.$router.push({
        path: "/tao-de-xuat"
      });
    }
    //loc
    // this.getAllMessages();
  },
  mounted() {
    this.$root.$on("showAddOrderLine", () => {
      this.showAddTask = true;
      this.resetOrderLine({
        userId: this.userInfo.account,
        orderId: this.order.id,
        costcenterId: this.order.id,
        companyId: this.order.id,
        origin: "Trung quốc"
      });
    });
  },
  components: {
    AddOrderLine,

    OrderLinesTodo
  },
  watch: {
    messages: function(val) {
      if (Object.keys(val).length) {
        this.scrollToBottom();
        setTimeout(() => {
          this.showMessages = true;
        }, 200);
      }
    }
  }
};
</script>

<style lang="stylus">
.page-chat {
  background: #e2dfd5;
}

.q-banner {
  top: 50px;
  z-index: -2;
  opacity: 0.8;
}

.q-message {
  z-index: -1;
}
</style>
