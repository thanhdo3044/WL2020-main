<template>
  <q-page padding class="body">
    <header-page style="margin-top:-10px" :order="order"></header-page>
    <content-page :order="order" :metaValue="metaValue"></content-page>
    <!-- <order-approved v-if="disable" :order="order" /> -->
    <footer-page :order="order" :metaValue="metaValue"></footer-page>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import HeaderPage from "components/E-Offices/PrintOrder/HeaderPage.vue";
import ContentPage from "components/E-Offices/PrintOrder/ContentPage.vue";
import FooterPage from "components/E-Offices/PrintOrder/Footer.vue";
import OrderApproved from "components/eofs/Shared/OrderApproved.vue";

export default {
  name: "PrintOrder",
  data(){
    return{
      disable:true
    }
  },
  computed: {
    ...mapGetters("orders", ["order", "metaValue"])
  },
  methods: {
    ...mapActions("orders", ["getOneOrder"])
  },
  created() {
    if (this.$route.query.id) this.getOneOrder(this.$route.query.id);
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
