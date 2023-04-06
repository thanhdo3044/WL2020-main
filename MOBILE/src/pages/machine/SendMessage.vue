<template>
<q-page>
    <q-input v-model="message" label="Tin nhắn" />
    <q-btn @click="sendMessage" color="primary" label="Gửi" />
</q-page>
    
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
        message: null,
    };
  },
  methods: {
      ...mapActions("requests", [
      "getTokenFCM",
    ]),
    async sendMessage() {
      let payload = {
        notification: {
          title: "Thank for sub",
          body: "firebase cloud",
          icon: "https://cdn.quasar.dev/img/boy-avatar.png",
        },
      };
      let payload10 = {
            accountId: 101651,
          };
          let dataTokenFCM = await this.getTokenFCM(payload10);
          console.log("dataTokenFCM", dataTokenFCM);
          await dataTokenFCM.data.data.forEach(async (element) => {
            if (element.tokenFCM != "undefined") {
              let dataSendFCM = await this.$sendFcm( 
                `Có phiếu gửi tới`,
                "Thông tin: "+this.message,
                `test`,
                payload,
                element.tokenFCM
              );
            }
          });
    },
  },
};
</script>

<style>
</style>