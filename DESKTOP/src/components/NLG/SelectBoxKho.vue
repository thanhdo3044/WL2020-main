<template>
  <div class="dx-field">
    <div class="dx-field-label">Chọn Kho</div>
    <div class="dx-field-value">
      <DxSelectBox
        :show-clear-button="showClear"
        :search-enabled="true"
        :data-source="dsKho"
        :search-mode="'contains'"
        :search-expr="'name'"
        :search-timeout="200"
        :min-search-length="0"
        value-expr="makho"
        :show-data-before-search="false"
        display-expr="name"
        @value-changed="onChange"
        placeholder="Nhấn để chọn"
      />
    </div>
  </div>
</template>

<script>
import { DxSelectBox } from "devextreme-vue/select-box";
export default {
    components:{
        DxSelectBox
    },
  props: {
    dsKho: {
      type: Array
    },
    onChange: {
      type: Function
    },
    showClear:{
      type:Boolean,
      default:false
    }
  }
};
</script>

<style>
</style>