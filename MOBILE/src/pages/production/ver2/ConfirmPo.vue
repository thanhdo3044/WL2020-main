<template>
  <q-page class="q-pa-md">
      <div class="row">
        <div class="col-12" align="center">
            <q-input v-model="po.code" :readonly="true" type="text" label="Mã kế hoạch" />
        </div>
        <div class="col-12" align="center">
            <q-input v-model="po.itemName" :readonly="true" type="text" label="Sản phẩm/Chi tiết" />
        </div>
        <div class="col-4" align="center">
            <q-input v-model="po.itemHeight" :readonly="true" type="text" label="Dầy" />
        </div>
        <div class="col-4" align="center">
            <q-input v-model="po.itemWidth" :readonly="true" type="text" label="Rộng" />
        </div>
        <div class="col-4" align="center">
            <q-input v-model="po.itemLength" :readonly="true" type="text" label="Dài" />
        </div>
        <div class="col-12" align="center">
            <q-input v-model="po.plan" :readonly="true" type="text" label="Kế hoạch" />
        </div>
        <div class="col-12" align="center">
            <div class="border">
                <q-expansion-item
                expand-separator
                label="Số lượng phôi đã nhận"
                :caption="po.recived"
            >
                <q-card>
                <q-card-section>
                   <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">Chi tiết</th>
          <th class="text-right">Tổng số lượng nhận</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-left">Chi tiết A</td>
          <td class="text-right">92</td>
        </tr>
        <tr>
          <td class="text-left">Chi tiết B</td>
          <td class="text-right">187</td>
        </tr>
         <tr>
          <td class="text-left">Chi tiết C</td>
          <td class="text-right">369</td>
        </tr>
      </tbody>
    </q-markup-table>
                </q-card-section>
                </q-card>
            </q-expansion-item>
            </div>
        </div>
        <div class="col-12" align="center">
            <q-input v-model="po.comfirmed" :readonly="true" type="text" label="Đã sản xuất" />
        </div>
        <div class="col-12" align="center">
            <q-input v-model="po.defectQty" :readonly="true" type="text" label="Lỗi" />
        </div>
        <div class="col-12" align="center">
            <q-input v-model="po.nextStepName" :readonly="true" type="text" label="Công đoạn nhận" />
        </div>
        <div class="col-12" align="center">
            <q-input v-model="po.startDate" :readonly="true" type="text" label="Ngày bắt đầu kế hoạch" />
        </div>
        <div class="col-12" align="center">
            <q-input v-model="po.endDate" :readonly="true" type="text" label="Ngày kết thúc" />
        </div>
        <div class="col-12" align="center">
            <q-input v-model.number="po.confirmQty" :readonly="false" type="text" label="Số lượng ghi nhận" />
        </div>
        <div class="col-12 q-mt-md q-pa-md" align="center">
            <q-btn color="primary" class="full-width" glossy style="font-family:'Time';font-weight:800" no-caps label="Ghi nhận" @click="onClick" />
        </div>
      </div>
  </q-page>
</template>

<script>
export default {
    data(){
        return {
            po:{
                code:'PO00001',
                itemName:'SKOGSTA stool 45 acacia',
                itemLength:200,
                itemWidth:12,
                itemHeight:24,
                plan:100,
                recieptQuantity:0,
                comfirmed:80,
                transfer:75,
                defectQty:3,
                startDate:'01/04/2020 08:00:00',
                endDate:'03/04/2020 12:00:00',
                status:'progress',
                confirmQty:'',
                recived:'92',
                nextStepName:'Tổ Đóng gói X3'
            }
        }
    },
    methods:{
        onClick(){

        }
    }
}
</script>

<style scoped>
.border {
    border: 2px dotted;
    border-color: brown;
    font-family: 'Time New Roman';
}
.text-caption{
    font-size: 1.75rem !important;
}
</style>