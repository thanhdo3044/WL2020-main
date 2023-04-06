<template>
  <div class="row q-mb-sm">
    <q-input
      outlined
      :value="title"
      @input="$emit('update:title', $event)"
      :rules="[val => !!val || 'Field is required']"
      autofocus
      ref="title"
      label="Tên mẫu"
      class="col"
    >
      <template v-slot:append>
        <q-icon
          v-if="title"
          @click="$emit('update:title', '')"
          title="close"
          class="cursor-pointer"
        />
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  props: ["title"]
};
</script>
