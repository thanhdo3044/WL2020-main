<template>
  <q-page class="q-pa-sm">
    <div class="row justify-center">
      <div class="col-12 col-sm-6">
        <div class="prodTextTitle">
          Thêm phiếu nhập kho
        </div>
      </div>
    </div>
    <div class="row justify-center q-ma-sm">
      <div class="col-12 col-sm-6">
        <q-select clearable  style="font-family:'Time New Roman';font-size:16px;text-align:center" v-model="warehouse" behavior="dialog" :options="warehouses" label="Kho nhập" />
      </div>
    </div>
    <div class="row justify-center q-ma-sm">
      <div class="col-12 col-sm-6">
        <p class="woodText">Ngày xuống hàng :</p>
        <q-date v-model="date" mask="YYYY-MM-DD" color="purple" />
      </div>
    </div>
    <div class="row justify-center q-ma-sm">
      <div class="col-12 col-sm-6">
        <q-select clearable  style="font-family:'Time New Roman';font-size:16px;text-align:center" v-model="vendor" behavior="dialog" :options="vendors" label="Nhà cung cấp" />
      </div>
    </div>
    <div class="row justify-center q-ma-sm">
      <div class="col-12 col-sm-6">
        <q-input outlined v-model="cardLicense" label="Biển số xe" />
      </div>
    </div>
    <div class="row justify-center q-ma-md">
      <div class="col-12 col-sm-6">
        <q-btn @click="confirm = true" class="full-width" color="primary" glossy label="Lưu lại" />
      </div>
    </div>
    <q-dialog  v-model="confirm" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Xác nhận !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn @click="save" flat label="Đồng ý" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
    data() {
        return {
            date: new Date().toISOString(),//
            vendor:null,
            vendors:[],
            cardLicense:'',
            confirm:false,
            warehouses:[],
            warehouse:null
        }
    },
    methods: {
      async save(){
        if (this.date&&this.vendor&&this.warehouse) {
          let payload = {
            receiptDate:this.date,
            carLicensePlate:this.cardLicense,
            vendorId:this.vendor.value,
            warehouseId:this.warehouse.value,
            moduleCode:'vcn'
          }
          let data = await this.$store.dispatch('wood/CREATE_WH_RECEIPT',payload)
          if (data.meta.success===true) {
            this.$q.notify({
              message: 'Tạo biên bản thành công !',
              color:'green'
            })
            this.$router.push({name:'wood-detail',params:{id: data.data[0].NEW_RECEIPT_ID}})
          }else {
            this.$q.notify({
              message: data.meta.messages.message,
              color:'red'
            })
          }
        }else {
          this.$q.notify({
            message:'Vui lòng nhập đầy đủ thông tin !',
            color:'red'
          })
        }
      },
      async initData(){
        const payload = {
          module:'vcn',
          
        }
        let data = await this.$store.dispatch('wood/GET_VENDORS','vcn')
        data.data.forEach(element => {
          let sx = {
            value : element.id,
            label: element.name
          }
          this.vendors.push(sx)
        });

        this.$store.getters['base/mySources'].forEach(element => {
          let s = {
            value : element.id,
            label: element.name
          }
          this.warehouses.push(s)
        });
        if (this.warehouses.length>0) {
          this.warehouse = this.warehouses[0]
        }
      }
    },
    created(){
      this.initData()
    }
}
</script>

<style>

</style>