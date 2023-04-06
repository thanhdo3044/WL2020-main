<template>
  <q-page class="q-pa-sm">
    <div class="row justify-center">
        <div class="col-12 col-md-6">
            <h6>Danh sách phiếu nhập kho</h6>
        </div>
    </div>
    <div class="row justify-around">
        <div class="col-12 col-md-5 q-mt-sm" v-for="item in 10" v-bind:key="item">
            <q-card class="my-card">
            <q-card-section>
               <h5>2020.01/03TH</h5>
            </q-card-section>
            <q-card-section>
                <p>NCC: dllakfjlk</p>
                <p>Ngày NHập : 20219-2312-2321</p>
            </q-card-section>
            <q-card-actions  align="around">
                <q-btn flat label="Nghiệm Thu" />
                <q-btn flat color="primary" label="Nhập kho" />
            </q-card-actions>
        </q-card>
        </div>
    </div>
  </q-page>
</template>

<script>
export default {
    data(){
        return {
            text:''
        }
    }
}
</script>

<style>

</style>