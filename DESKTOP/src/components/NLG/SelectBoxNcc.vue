<template>
  <div class="dx-field">
    <div class="dx-field-label">{{title}}</div>
    <div class="dx-field-value">
      <DxSelectBox
        :search-enabled="true"
        :data-source="dataSource"
        :search-mode="'contains'"
        :search-expr="'name'"
        :search-timeout="200"
        :min-search-length="0"
        :show-data-before-search="false"
        display-expr="name"
        @value-changed="onChange"
        value-expr="code"
        :show-clear-button="showClear"
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
    dataSource: {
      type: Array
    },
    onChange: {
      type: Function
    },
    title:{
        type:String,
        default:'Title'
    },
    showClear:{
      type:Boolean,
      default:false
    },
  }
};
</script>

<style>
</style>