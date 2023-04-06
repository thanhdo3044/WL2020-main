<template>
  <q-page class="q-pa-md">
      <div class="row justify-center">
          <div class="col-12 col-sm-6">
              <q-card>
                  <q-card-section>
                      <div class="prodTextTitle">
                          Tạo phiếu nhập kho
                      </div>
                  </q-card-section>
                  <q-separator></q-separator>
                  <q-card-section>
                      <q-form
                        @submit="onSubmit"
                        @reset="onReset"
                        class="q-gutter-md"
                        >
                        <!-- <q-input
                            outlined 
                            v-model="sophieu"
                            label="Số phiếu"
                            hint="2019.10/10"
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Hãy nhập đúng định dạng']"
                        /> -->
                        <q-input
                            outlined 
                            v-model="orderGood"
                            label="Lệnh xuất hàng"
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Hãy nhập đúng định dạng']"
                        />
                        <q-select @input="selectProject" outlined v-model="project" :options="projects" label="Dự án" />
                         <!-- <q-input
                            outlined 
                            v-model="address"
                            label="Địa chỉ"
                            :readonly="true"
                        /> -->
                        <q-input
                            outlined 
                            v-model="numberPalte"
                            label="Biển số xe/ số container"
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Hãy nhập đúng định dạng']"
                        />


                        <div>
                            <q-btn label="Tạo phiếu" type="submit" color="primary"/>
                            <q-btn label="Nhập lại" type="reset" color="primary" flat class="q-ml-sm" />
                        </div>
                        </q-form>
                  </q-card-section>
              </q-card>
          </div>
      </div>
      <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn ? !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" color="primary" @click="create" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { QSpinnerGears } from 'quasar'
export default {
  data(){
    return {
      sophieu:'',
      project:null,
      projects:[],
      numberPalte:'',
      orderGood:'',
      address:'',
      showDialog:false
    }
  },
  created(){
    this.initData()
  },
  methods:{
    selectProject(val){
      this.address = val.address
    },
    async initData(){
      let data = await this.$store.dispatch('funiture/ACTION_LOAD_PROJECTS')
      if (data.meta.success===true) {
        data.data.forEach(pr => {
          const pro = {
            label:pr.name,
            value:pr.id,
            address: pr.customer.address
          }
          this.projects.push(pro)
        });
      }
      
    },
    onSubmit(){
      if (this.project) {
        this.showDialog = true
      }else {
        this.$q.notify({
          message:'Thiếu thông tin !',
          color:'red'
        })
      }
    },
    onReset(){

    },
    async create(){
      this.showDialog= false
      this.$q.loading.show({
        spinner: QSpinnerGears,
      })
      const payload ={
        projectId: this.project.value,
        address: this.address,
        orderedGoods:this.orderGood,
        numberPalte:this.numberPalte,
        goodsIssueNumber:this.sophieu
      }
      let data = await this.$store.dispatch('funiture/ACTION_CREATE_GOOD_ISSUE',payload)
      if (data.meta.success===true) {
        this.$q.notify({
          message:'Tạo phiếu thành công !',
          color:'green'
        })
        this.$q.loading.hide()
        const newId =data.data.id 
        this.$router.push('/funiture-packing?id='+newId)
      }else {
        this.$q.notify({
          message:data.meta.messages.message,
          color:'red'
        })
        this.$q.loading.hide()
      }
    }
  }
}
</script>

<style>

</style>