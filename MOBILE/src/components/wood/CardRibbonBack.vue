<template>
  <q-ribbon
        position="left"
        color="rgba(0,0,0,.58)"
        background-color="primary"
        leaf-color="#a0a0a0"
        leaf-position="bottom"
        decoration="point-out"
        style="margin-left: -28px;position:relative"
        glow
        class="back"
    >
        <q-toolbar-title
        class="example-title"
        @click="back"
        >
       Trở lại
        </q-toolbar-title>
    </q-ribbon>
</template>

<script>
export default {
    methods:{
        back(){
            this.$router.go(-1)
        }
    }
}
</script>

<style>
.back:hover {
    cursor: pointer;
}
.example-title{
    color: aliceblue
}
</style>