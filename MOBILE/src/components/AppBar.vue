<template>
  <div class="row text-white">
    <div class="col-1">
      <q-icon name="keyboard_arrow_left" size="36px" @click="goBack"></q-icon>
    </div>
    <div class="col-11">
      <div class="text-h5" style="text-align:center;font-family: 'Time'">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>