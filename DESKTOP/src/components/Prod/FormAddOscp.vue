<template>
  <div class="row q-pa-sm">
    <div class="col-12">
      <q-card class="my-card widget-container">
        <q-card-section>
          <div class="row">
            <div class="col-8">
              <q-input v-model="name" @input="changeName" type="text" label="Tên máy" />
            </div>
            <div class="col-4 q-pa-md" align="right">
              <q-btn color="primary" icon="check" label="Lưu" @click="saveDanhMuc" />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-pa-sm">
            <div class="col-10">
              <NumberBox :title="'Số công nhân :'" :onChange="chonCN" />
            </div>
            <div class="col-2" align="right">(người)</div>
            <div class="col-10">
              <NumberBox :title="'Thời gian hoàn thành chi tiết :'" :onChange="chonTg1" />
            </div>
            <div class="col-2" align="right">(s)</div>
            <div class="col-10">
              <NumberBox :title="'Số lao động/chu kỳ :'" :defaultValue="soLaoDong" :disable="true" />
            </div>
            <div class="col-2" align="right">(công)</div>
            <div class="col-10">
              <NumberBox :title="'Tổng thời gian chu kỳ:'" :defaultValue="tgian2" :disable="true" />
            </div>
            <div class="col-2" align="right">(s)</div>
            <div class="col-10">
              <NumberBox :title="'Công suất máy :'" :onChange="chonCongSuatMay" />
            </div>
            <div class="col-2" align="right">(kW)</div>
            <div class="col-10">
              <NumberBox :title="'Điện năng/chu kỳ :'" :defaultValue="dienNang" :disable="true" />
            </div>
            <div class="col-2" align="right">(kWh)</div>
            <div class="col-10">
              <NumberBox :title="'tồn kho công đoạn :'" :onChange="chonTonKho" />
            </div>
            <div class="col-2" align="right">(pcs)</div>
             <div class="col-10">
              <NumberBox :title="'Thời gian vận chuyển & lưu công đoạn :'" :onChange="chonTg3" />
            </div>
            <div class="col-2" align="right">(s)</div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import NumberBox from '../commons/NumberBox'
export default {
    components:{
        NumberBox
    },
    data(){
        return {
            name:''
        }
    },
    props:{
        changeName:{
            type:Function
        },
        soLaoDong:{
            type:Number,
            default:0
        },
        dienNang:{
            type:Number,
            default:0
        },
        tgian2:{
            type:Number,
            default:0
        },
        saveDanhMuc:{
            type:Function
        },
        chonCN:{
            type:Function
        },
        chonTg1:{
            type:Function
        },
        chonSoLaoDong:{
            type:Function
        },
        chonTg2:{
            type:Function
        },
        chonCongSuatMay:{
            type:Function
        },
        chonDienNang:{
            type:Function
        },
        chonTonKho:{
            type:Function
        },
        chonTg3:{
            type:Function
        },
    }
};
</script>

<style>
</style>