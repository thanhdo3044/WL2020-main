<template>
  <q-dialog v-model="show" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Nhập thông tin COC cho pallet ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn @click="close" flat label="Không" color="primary"  />
          <q-btn @click="toAddSupplies" flat label="Nhập thêm" color="primary"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
export default {
    props:{
        show:{
            type:Boolean,
            default:false
        },
        toAddSupplies:{
            type:Function,
        },
        close:{
          type:Function
        }
    }
}
</script>

<style>

</style>