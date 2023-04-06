<template>
  <div class="q-mt-sm">
    <q-btn
      color="primary"
      @click="goBack"
      flat
      icon="keyboard_arrow_left"
      label="Trở lại"
    />
    <list-header bgcolor="bg-orange-4">E-Office</list-header>
    <q-list separator bordered>
      <q-item
        @click="goDetail('home-page-dang-ky-xe')"
        class="bg-orange-1"
        clickable
        v-ripple
      >
        <q-item-section class="text-center">
          <q-item-label class="text-h5">Đăng ký mới</q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        @click="goDetail('bao-cao-dat-xe')"
        class="bg-orange-1"
        clickable
        v-ripple
      >
        <q-item-section class="text-center">
          <q-item-label class="text-h5">Xem lịch trình có sẵn</q-item-label>
        </q-item-section>
      </q-item>
      <q-item 
        @click="goDetail('bao-cao-dat-xe')"
        class="bg-orange-1" clickable v-ripple>
        <q-item-section class="text-center">
          <q-item-label class="text-h5">Đăng kí lịch làm việc</q-item-label>
        </q-item-section>
      </q-item>
      <!-- <q-item class="bg-orange-1" clickable v-ripple>
        <q-item-section class="text-center">
          <q-item-label class="text-h5">Đặt lịch phòng họp</q-item-label>
        </q-item-section>
      </q-item> -->
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
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
