<template>
  <div>
    <q-list separator bordered>
      <q-item
        bordered
        clickable
        class="q-message"
        tag="a"
        :href="'/phe-duyet-online'"
      >
        <q-item-section class="text-center">
          <h5>Phê duyệt online</h5>
        </q-item-section>
      </q-item>
      <q-item bordered clickable v-ripple class="q-message">
        <q-item-section class="text-center">
          <h5>Đặt xe đi công tác</h5>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple class="q-message">
        <q-item-section class="text-center">
          <h5>Lịch làm việc</h5>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple class="q-message">
        <q-item-section class="text-center">
          <h5>Đặt lịch phòng họp</h5>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<style lang="stylus">
.page-chat {
  background: #e2dfd5;

  &:after {
    content: '';
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    opacity: 0.1;
    background-image: radial-gradient(circle at 100% 150%, silver 24%, white 25%, white 28%, silver 29%, silver 36%, white 36%, white 40%, transparent 40%, transparent), radial-gradient(circle at 0 150%, silver 24%, white 25%, white 28%, silver 29%, silver 36%, white 36%, white 40%, transparent 40%, transparent), radial-gradient(circle at 50% 100%, white 10%, silver 11%, silver 23%, white 24%, white 30%, silver 31%, silver 43%, white 44%, white 50%, silver 51%, silver 63%, white 64%, white 71%, transparent 71%, transparent), radial-gradient(circle at 100% 50%, white 5%, silver 6%, silver 15%, white 16%, white 20%, silver 21%, silver 30%, white 31%, white 35%, silver 36%, silver 45%, white 46%, white 49%, transparent 50%, transparent), radial-gradient(circle at 0 50%, white 5%, silver 6%, silver 15%, white 16%, white 20%, silver 21%, silver 30%, white 31%, white 35%, silver 36%, silver 45%, white 46%, white 49%, transparent 50%, transparent);
    background-size: 100px 50px;
  }
}

.q-banner {
  top: 50px;
  z-index: 2;
  opacity: 0.8;
}

.q-message {
  z-index: 1;
  color: white;
  background-color: #027BE3;
}
</style>
