<template>
  <div class="row q-mb-sm">
    <q-input
      outlined
      :value="userId"
      @input="$emit('update:userId', $event)"
      :rules="[val => !!val || 'Field is required']"
      ref="userId"
      label="Mã NV"
      class="col"
    >
      <template v-slot:append>
        <q-icon
          v-if="userId"
          @click="$emit('update:userId', '')"
          userId="close"
          class="cursor-pointer"
        />
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  props: ["userId"]
};
</script>
