<template>
  <q-page class="q-pa-sm bg-blue-grey-7">
    <app-bar class="text-white">PHIẾU CÂN HÀNG XUẤT</app-bar>
    <div class="row">
      <div class="q-mb-sm col-6">
        <q-input
        dark
          style="margin: 0 5px 0 5px"
          @input="changeWeek"
          filled
          v-model="week"
          label="Tuần"
          label-color="orange"
        />
      </div>
      <div class="q-mb-sm col-6">
        <q-select
        dark
          filled
          style="margin: 0 5px 0 5px"
          v-model="code"
          label="Chọn mã phiếu"
          @input="onChangeCode"
          :options="codes"
          label-color="orange"
        />
      </div>
      <div class="col-12">
        <q-card class="my-card bg-blue-grey-7" style="border:2px solid white" v-for="(epMun, index) in epMuns" :key="index">
          <q-card-section>
            <div
              class="text-subtitle2 text-orange"
              style="border: 1px solid orange; margin-bottom:3px"
            >
              <q-badge class="bg-secondary"> Ngày cân tổng :</q-badge>

              <span class="text-white">
                {{
                  epMun.NGAY_CAN_TONG.substring(0, 16).replace("T", " ")
                }}</span
              >
            </div>
            <div
              class="text-subtitle2 text-orange"
              style="border: 1px solid orange; margin-bottom:3px"
            >
              <q-badge class="bg-secondary">Ngày cân bì :</q-badge>
              <span class="text-white">
                {{ epMun.NGAY_CAN_BI.substring(0, 16).replace("T", " ") }}</span
              >
            </div>
            <div
              class="text-subtitle2 text-orange"
              style="border: 1px solid orange; margin-bottom:3px"
            >
              <q-badge class="bg-secondary">Bên mua:</q-badge> <span class="text-white">{{ epMun.BEN_MUA }}</span>
            </div>
            <div
              class="text-subtitle2 text-orange"
              style="border: 1px solid orange; margin-bottom:3px"
            >
              <q-badge class="bg-secondary">Bên bán:</q-badge> <span class="text-white">{{ epMun.BEN_BAN }}</span>
            </div>
            <div
              class="text-subtitle2 text-orange"
              style="border: 1px solid orange; margin-bottom:3px"
            >
              <q-badge class="bg-secondary">Biển số xe:</q-badge>
              <span class="text-white">{{ epMun.BIEN_SO_XE }}</span>
            </div>
            <div
              class="text-subtitle2 text-orange"
              style="border: 1px solid orange; margin-bottom:3px"
            >
              <q-badge class="bg-secondary">Hàng hóa:</q-badge> <span class="text-white">{{ epMun.HANG_HOA }}</span>
            </div>
            <div
              class="text-subtitle2 text-orange"
              style="border: 1px solid orange; margin-bottom:3px"
            >
              <q-badge class="bg-secondary">TRỌNG LƯỢNG TỔNG:</q-badge>
              <span class="text-white">{{
                epMun.TOTAL_VOLUMN.toLocaleString("en-US")
              }}</span>
            </div>
            <div
              class="text-subtitle2 text-orange"
              style="border: 1px solid orange; margin-bottom:3px"
            >
              <q-badge class="bg-secondary">TRỌNG LƯỢNG BÌ:</q-badge>
              <span class="text-white">{{
                epMun.BI_VOLUMN.toLocaleString("en-US")
              }}</span>
            </div>
            <div
              class="text-subtitle2 text-orange"
              style="border: 1px solid orange; margin-bottom:3px"
            >
              <q-badge class="bg-secondary">TRỌNG LƯỢNG HÀNG:</q-badge>
              <span class="text-white">{{
                epMun.VOLUMN.toLocaleString("en-US")
              }}</span>
            </div>
            <div
              class="text-subtitle2 text-orange"
              style="border: 1px solid orange; margin-bottom:3px"
            >
              <q-badge class="bg-orange">Người cân:</q-badge> <span class="text-white">{{ epMun.LAST_NAME }}</span>
            </div>
            <div v-if="epMun.VERIFY_NAME" class="text-subtitle2" style="border: 1px solid orange; margin-bottom:3px">
              <q-badge class="bg-orange">Thủ kho xác nhận:</q-badge>
              <span class="text-white">{{ epMun.VERIFY_NAME }}</span>
            </div>
          </q-card-section>
          <div class="col-12">
            <q-btn
              v-if="!epMun.VERIFY_NAME"
              style="float:left"
              @click="onAccept"
              color="positive"
              label="THỦ KHO XÁC NHẬN"
            />
            <q-btn
              v-if="!epMun.VERIFY_NAME"
              style="float:right"
              @click="onReject"
              color="orange"
              label="TỪ CHỐI"
            />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import AppBar from "../../components/AppBar";
export default {
  components: {
    "app-bar": AppBar,
  },
  data() {
    return {
      week: moment().week(),
      code: null,
      codes: [],
      epMuns: [],
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  created() {
    this.changeWeek();
  },
  methods: {
    ...mapActions("production", [
      "getCodeInWeekEpMun",
      "getEpMunDetail",
      "updateEpMunThuKho",
      "deleteEmMunThuKho"
    ]),
    async changeWeek() {
      const payload = {
        week: this.week,
      };
      const data = await this.getCodeInWeekEpMun(payload);
      this.codes = data;
    },
    async onChangeCode() {
      const payload = {
        code: this.code.CODE,
        number: this.code.NUMBER,
      };
      const data = await this.getEpMunDetail(payload);
      this.epMuns = data;
    },
    async onAccept() {
      const payload = {
        id: this.epMuns[0].ID,
        accountId: this.userInfo.id,
      };
      const data = await this.updateEpMunThuKho(payload);
      this.onChangeCode();
    },
    async onReject(){
      const payload = {
        id : this.epMuns[0].ID
      }
      const data = await this.deleteEmMunThuKho(payload);
      this.onChangeCode();
    }
  },
};
</script>

<style>
</style>