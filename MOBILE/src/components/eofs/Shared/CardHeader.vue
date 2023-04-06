<template>
  <q-card>
    <q-card-section :class="bgcolor">
      <div class="text-h6">
        <slot></slot>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: ["bgcolor"]
};
</script>
