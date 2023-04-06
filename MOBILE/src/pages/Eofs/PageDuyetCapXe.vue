<template>
  <q-page>
    <list-header bgcolor="bg-orange-4">Yêu cầu cần phê duyệt</list-header>
    <q-list separator bordered>
      <q-item clickable v-ripple>
        <q-item-section side top>
          <q-checkbox v-model="val" class="no-pointer-events"></q-checkbox>
        </q-item-section>

        <q-item-section>
          <q-item-label>Đặt xe đi công tác</q-item-label>
          <q-item-label class="row" caption>
            <small>bởi: {{ getAccountById(100281) | FullName }}</small>
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <div class="row">
            <div class="column justify-center">
              <q-icon name="event" size="18px" class="q-mr-xs" />
            </div>
            <div class="column">
              <q-item-label class="row justify-end" caption>{{
                moment().format("L")
              }}</q-item-label>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import ListHeader from "components/eof/Shared/ListHeader.vue";
export default {
  data() {
    return {
      carApproval: [],
      val: true
    };
  },
  computed: {
    ...mapGetters("orders", ["getAccountById"])
  },
  components: {
    ListHeader
  }
};
</script>

<style lang="scss" scoped></style>
