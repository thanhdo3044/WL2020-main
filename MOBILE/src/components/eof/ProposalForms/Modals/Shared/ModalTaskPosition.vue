<template>
  <div class="row q-mb-sm">
    <q-input
      outlined
      :value="position"
      @input="$emit('update:position', $event)"
      :rules="[val => !!val || 'Field is required']"
      ref="position"
      label="Chức vụ"
      class="col"
    >
      <template v-slot:append>
        <q-icon
          v-if="position"
          @click="$emit('update:position', '')"
          position="close"
          class="cursor-pointer"
        />
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  props: ["position"]
};
</script>
