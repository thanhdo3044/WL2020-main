<template>
  <q-page class="bg-white">
    <div class="row q-pl-sm q-pt-sm q-pb-sm q-pr-sm">
      <div
        @click="to(ph.PATH)"
        v-for="(ph, index) in myMenu"
        :key="index"
        class="col-3 col-sm-2 q-mt-sm q-pa-sm"
        id="badge-master"
      >
        <div class="flex flex-center">
          <div
            class="bg-white flex flex-center"
            style="border-radius: 12px; width: 60px; height: 60px"
            avatar
          >
            <q-btn
              dense
              style="font-size: 20px; position: relative"
              color="primary"
              round
              :icon="ph.icon"
            >
            </q-btn>
          </div>
        </div>
        <div style="text-align: center; font-size: 12px; margin-top: 8px">
          {{ ph.NAME }}
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { fasFileSignature } from "@quasar/extras/fontawesome-v5";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      myMenu: [
        {
          NAME: "Quy chế Tổ chức và Hoạt động sản xuất Kinh doanh",
          PATH: "https://app.woodsland.com.vn:2002/statics/quy-che-to-chuc.pdf",
          icon: fasFileSignature,
        },
        {
          NAME: "Quy chế Lương",
          PATH: "https://app.woodsland.com.vn:2002/statics/quy-che-luong.pdf",
          icon: fasFileSignature,
        },
        {
          NAME: "Quy chế tài chính",
          PATH: "https://app.woodsland.com.vn:2002/statics/quy-che-tai-chinh.pdf",
          icon: fasFileSignature,
        },
      ],
    };
  },
  created() {
    this.loadMenuThongTin();
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("base", ["getMenuThongTin"]),
    async loadMenuThongTin() {},
    to(PATH) {
      window.location.assign(`${PATH}`);
    },
  },
};
</script>
