<template>
  <q-dialog v-model="show">
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Close icon</div>
          <q-space />
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>
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
    },
    data:{
        
    }
}
</script>

<style>

</style>