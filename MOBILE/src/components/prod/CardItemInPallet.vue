<template>
  <div class="row prod-card-item">
        <q-separator/>
        <div class="col-12">
            <p class="prodTextTitle"><slot name="nameOfItem">Tên chi tiết</slot></p>
        </div>
        <div class="col-12">
            <div class="row prodTextTitle"><div class="col-6">Qui cách : </div> <div class="col-6"><slot name="qcOfItem">0</slot></div></div>
        </div>
        <div class="col-12">
            <div class="prodTextTitle row"><div class="col-6">Số lượng : </div> <div class="col-6"><slot name="qtyOfItem">0</slot></div></div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>
.prod-card-item {
    border-radius: 35px; 
    background: #009900; 
    padding: 30px; 
    text-align: center;
}

</style>