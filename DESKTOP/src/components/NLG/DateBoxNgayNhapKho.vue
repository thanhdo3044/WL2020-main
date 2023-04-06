<template>
  <div class="dx-field">
    <div class="dx-field-label">Ngày nhập:</div>
    <div class="dx-field-value">
        <DxDateBox
        :value="ngaynhapkho"
        type="date"
        display-format="dd/MM/yyyy"
         @value-changed="onChange"
        />
    </div>
    </div>
</template>

<script>
import { DxDateBox } from 'devextreme-vue';
export default {
    components:{
        DxDateBox
    },
    props:{
        ngaynhapkho:{
            type:Date,
            default:new Date(),
        },
        onChange:{
            type:Function
        }
    }
}
</script>

<style>

</style>