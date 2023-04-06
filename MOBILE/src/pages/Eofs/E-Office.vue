<template>
  <div class="q-mt-lg">
    <list-header bgcolor="bg-orange-4">E-Office</list-header>
    <q-list separator bordered>
      <q-item
        @click="goDetail('tao-de-xuat')"
        class="bg-orange-1"
        clickable
        v-ripple
      >
        <q-item-section class="text-center">
          <q-item-label class="text-h5">Phê duyệt online</q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        @click="goDetail('page-xe-cong-tac')"
        class="bg-orange-1"
        clickable
        v-ripple
      >
        <q-item-section class="text-center">
          <q-item-label class="text-h5">Đặt xe đi công tác</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="bg-orange-1" @click="goDetail('lich-lam-viec')" clickable v-ripple>
        <q-item-section class="text-center">
          <q-item-label class="text-h5">Lịch làm việc</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="bg-orange-1" clickable v-ripple>
        <q-item-section class="text-center">
          <q-item-label class="text-h5">Đặt lịch phòng họp</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script>
export default {
  components: {
    "list-header": require("components/Shared/ListHeader.vue").default
  },
  methods: {
    goDetail(path) {
      this.$router.push({
        path
      });
    }
  }
};
</script>
