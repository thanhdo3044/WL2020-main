<template>
  <q-page class="q-pa-md">
      <div class="row justify-center q-ma-sm">
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section>
              <div class="prodTextTitle">
                Scan 2 mã barcode 
              </div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section>
              <q-input @focus="focus1" clearable ref="self1" @keydown.enter.prevent="handle1" color="teal" outlined v-model="barcode1" label="Mã barcode 1">
                <!-- <template v-slot:append>
                <q-avatar>
                    <img src="https://cdn1.iconfinder.com/data/icons/business-shop-finance-symbols-set-3/91/Business_-_Shop_-_Finance_137-512.png">
                </q-avatar>
                </template> -->
            </q-input>
            <br>
            <q-input clearable ref="self2" @keydown.enter.prevent="handle2" :readonly="disableBarcode2"  color="teal" outlined v-model="barcode2" label="Mã barcode 2">
                <!-- <template v-slot:append>
                <q-avatar>
                    <img src="https://cdn1.iconfinder.com/data/icons/business-shop-finance-symbols-set-3/91/Business_-_Shop_-_Finance_137-512.png">
                </q-avatar>
                </template> -->
            </q-input>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div v-show="showResult" class="row justify-center q-ma-sm">
          <div class="col-12 col-md-6">
              <q-card>
                  <q-card-section>
                    <div class="prodTextTitle">
                      Thông tin đóng gói
                    </div>
                  </q-card-section>
                  <q-separator></q-separator>
                  <q-card-section>
                    <div class="row">
                      <div class="col-6">
                        Tên thị trường :
                      </div>
                      <div class="col-6">
                        {{this.ikeaInfo.marketName}}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6">
                        Mã Thị trường :
                      </div>
                      <div class="col-6">
                         {{this.ikeaInfo.market}}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6">
                        Số tuần : 
                      </div>
                      <div class="col-6">
                         {{this.ikeaInfo.week}}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6">Số lượng :</div>
                      <div class="col-6">
                         {{this.ikeaInfo.quantity}}
                      </div>
                    </div>
                  </q-card-section>
              </q-card>
          </div>
      </div>
      <div class="row justify-center q-ma-sm">
        <div class="col-12 col-md-6">
          <q-card class="bg-secondary text-white">
            <q-card-section>
              <div class="prodTextTitle">
                Hủy Mã Ikea
              </div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section>
              <q-input ref="self3" @keydown.enter.prevent="handle3"   color="red" outlined v-model="barcode3" label="Mã barcode 2"></q-input>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div v-show="showLoading" class="row justify-center q-ma-md">
          <div class="col-12 col-md-6 justify-center" style="min-height:200px;text-align:center" >
            <q-spinner-ios
              color="primary"
              size="4em"
            />
          </div>
      </div>
  </q-page>
</template>

<script>
var audio = new Audio('/statics/mp3/alarm2.mp3');
var ting = new Audio('/statics/mp3/ting.mp3');
export default {
    data(){
        return {
            showResult:false,
            barcode1:'',
            barcode2:'',
            barcode3:'',
            showLoading:false,
            ikeaInfo:{},
            disableBarcode2:true,
        }
    },
    mounted(){
      this.$refs.self1.select();
    },
    methods:{
      focus1(){
        // an ban phim
        // this.$refs.self1.blur()
      },
      async handle1(evt){
        this.showLoading = true
        if (this.barcode1.substring(0,3)==='240') {
          const payload = {
            token : this.$store.state.production.userInfo.token,
            ikeaCode:this.barcode1.trim()
          }
          let data = await this.$store.dispatch('production/ACTION_GET_IKEA_SEARCH',payload)
          
          if (data.meta.success===true) {
            this.ikeaInfo = data.data
            this.showResult = true
            this.showLoading=false
            this.disableBarcode2 =false
            this.$refs.self2.select();
            ting.play()
          }else{
            this.$q.notify({
              message:data.meta.messages.message,
              color:'red',
              position:'center'
            })
          }
        }else {
          this.$q.notify({
            message:'Mã barcode 1 không chính xác !',
            color:'red',
            position:'center'
          })
        }
        this.showLoading=false
      },
      async handle2(evt){
        if (this.barcode2.trim().substring(0,3)==='003') {
          const payload ={
            token:this.$store.state.production.userInfo.token,
            sourceId:this.$store.getters["base/mySources"][0].id,
            destinationId:this.$store.getters["base/mySources"][0].id,
            itemId:this.ikeaInfo.itemId,
            quantity:this.ikeaInfo.quantity,
            ikeaCode:this.barcode1.trim(),
            ikeaGuid:this.barcode2.trim()
          }
         let data = await this.$store.dispatch('production/ACTION_CREATE_PALLET',payload)
            if (data.meta.success===true) {
              ting.play()
              this.$q.notify({
                  message:'Scan thành công !',
                  color:'green',
                  position:'center'
              })
              this.barcode1=''
              this.barcode2=''
              this.showResult=false
              this.disableBarcode2 = true
              this.$refs.self1.select();
              
            }else {
              audio.play();
              this.$q.notify({
                message:data.meta.messages.message,
                color:'red',
                position:'center'
              })
            }
        }else { 
          // mã ikea không chính xác
          this.$q.notify({
            message:'Mã barcode 2 không chính xác !',
            color:'red',
            position:'center'
          })
        }
      },
      async handle3(){
        if (this.barcode3.trim().substring(0,3)==='003') {
          const payload = {
            ikeaCode: this.barcode3.trim(),
            token:this.$store.state.production.userInfo.token,
          }
          let data = await this.$store.dispatch('production/ACTION_CANCEL_IKEA',payload)
          if (data.meta.success===true) {
              this.$q.notify({
                  message:'Hủy mã ikea thành công !',
                  color:'green',
                  position:'center'
              })
              ting.play()
              this.barcode3=''
            }else {
              this.$q.notify({
                message:data.meta.messages.message,
                color:'red',
                position:'center'
              })
            }
        }else {
          this.$q.notify({
            message:'Mã Ikea không chính xác !',
            color:'red',
            position:'center'
          })
        }
      }
    }
}
</script>

<style>

</style>