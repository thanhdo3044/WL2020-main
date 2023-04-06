<template>
  <q-dialog v-model="show" persistent transition-show="slide-down" transition-hide="slide-down">
      <q-card  style="width: 300px">
        <q-card-section style="text-align:center">
          <div class="prodPalletCodeSuccess">{{palletCode}}</div>
        </q-card-section>


        <q-card-actions align="center" style="font-size:10px" class="bg-white ">
          <q-btn color="primary" class="text-primary" label="Hoàn thành" @click="closeDialog2" />
          
          <q-btn  style="margin-top:10px" color="positive" class="text-positive" label="Tiếp tục nhập TT truy nguyên" @click="closeDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
export default {
    props:{
        palletCode:{
            type:String
        },
        show:{
            type:Boolean
        },
        
        closeDialog:{
            type: Function
        },
        closeDialog2:{
            type: Function,
            default:()=>{}
        }
    }
}
</script>

<style>

</style>