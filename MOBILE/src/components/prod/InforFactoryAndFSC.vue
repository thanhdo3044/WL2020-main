<template>
  <div>
      <div class="row">
            <div class="col-6">
                <p class="prodTextNormal">Nhà máy :</p>
            </div>
            <div class="col-6">
                <p class="prodTextOption">{{this.$store.getters['base/myFactoryInfor'].name}}</p>
            </div>
        </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>