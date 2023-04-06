<template>
  <div class="q-pt-md">
    <div
      :class="{ invisible: !showMessages }"
      class="q-pa-md q-mt-lg column col justify-end"
    >
      <q-chat-message
        v-for="(message, key) in order.Messages"
        :key="key"
        :name="message.accountId | lastName"
        :text="[message.text]"
        :sent="message.accountId == userInfo.id ? true : false"
        :bg-color="message.accountId == userInfo.id ? 'white' : 'light-green-2'"
        :stamp="message.createdAt | luc"
      />
    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-form @submit="sendMessage" class="full-width">
          <q-input
            v-model="newMessage"
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      showAddTask: false,
      newMessage: "",
      showMessages: true
    };
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("messages", ["messages"])
  },
  methods: {
    ...mapActions("orders", [
      "getOneOrder",
      "resetOrderLine",
      "addMessage",
      "sendToApproved",
      "getAllRequests",
      "resetRequests"
    ]),
    sendMessage() {
      console.log("send");
      this.addMessage({
        id: "",
        accountId: this.userInfo.id,
        orderId: this.order.id,
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
  }
};
</script>
