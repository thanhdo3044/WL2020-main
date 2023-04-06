<template>
  <q-page class="q-md-pa">
      <div class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <div class="prodTextTitle" style="text-align:center;font-size:20px">
                  Tạo pallet
              </div>
          </div>
      </div>
      <div v-if="showProjectInfo" class="row justify-center q-pa-sm q-ma-sm">
          <div class="col-12 col-sm-6">
              <q-card>
                  <q-card-section>
                      <div class="row">
                        <div class="col-10">
                          <div class="prodTextTitle">
                              Thông tin dự án
                          </div>
                        </div>
                        <div class="col-2">
                          <q-btn @click="goSelectProject" flat   icon="refresh" />
                        </div>
                      </div>
                  </q-card-section>
                  <q-separator></q-separator>
                  <q-card-section class="prodTextNormal">
                    <div class="row">
                      <div class="col-6">Mã dự án : </div>
                      <div class="col-6">{{this.$store.state.funiture.projectSelected.code}}</div>
                    </div>
                    <div class="row">
                      <div class="col-6">Tên dự án :</div>
                      <div class="col-6">{{this.$store.state.funiture.projectSelected.name}}</div>
                    </div>
                    <div v-if="this.$store.state.funiture.projectSelected.customer.id" class="row">
                      <div class="col-6">Khách hàng :</div>
                      <div class="col-6">{{this.$store.state.funiture.projectSelected.customer.name}}</div>
                    </div>
                  </q-card-section>
              </q-card>
          </div>
      </div>
      <div v-else class="row q-mt-md justify-center">
        <div class="col-10 col-sm-6">
          <q-btn @click="goSelectProject" color="primary full-width" glossy label="Chọn dự án" />
        </div>
      </div>
      <div v-show="showProjectInfo">
        <div class="row justify-center q-ma-sm q-pa-sm" v-if="item===null">
          <div class="col-12">
            <q-select :disable="disableSelectItem" use-input input-debounce="0" @filter="searchItem" 
              style="font-family:'Time New Roman';font-size:16px" 
              v-model="item" behavior="dialog" :options="items" 
              label="Qui cách tinh :" />
          </div>
        </div>
      <div v-else class="row justify-center q-ma-sm q-pa-sm">
        <div class="col-12 col-sm-6">
          <q-card>
            <q-card-section>
              <p class="prodTextTitle">{{item.name}} </p>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section class="prodTextNormal">
              <div class="row">
                <div class="col-6"></div>
                <div class="col-6"></div>
              </div>
              <div class="row">
                <div class="col-6">Mã sản phẩm : </div>
                <div class="col-6">{{item.code}}</div>
              </div>
              <div class="row">
                <div class="col-4">Dầy :</div>
                <div class="col-4">Rộng : </div>
                <div class="col-4">Dài : </div>
              </div>
              <div class="row">
                <div class="col-4">{{item.height || '0'}}</div>
                <div class="col-4">{{item.width || '0'}} </div>
                <div class="col-4">{{item.length || '0'}}</div>
              </div>
              <div class="row">
                <div class="col-12">
                  <q-select  style="font-family:'Time New Roman';font-size:16px" v-model="source" behavior="dialog" :options="sources" label="Xuất từ công đoạn :" />
                </div>
              </div>
              <div v-show="showDes" class="row">
                <div class="col-12">
                  <q-select   style="font-family:'Time New Roman';font-size:16px" v-model="destination" behavior="dialog" :options="destinations" label="Xuất đến công đoạn :" />
                </div>
              </div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section>
              <div class="row justify-center">
                  
                  <div class="col-8 q-pa-md">
                      <q-input outlined v-model.number="qty"   label="Số lượng" />
                  </div>
              </div>
              
          </q-card-section>
          <q-card-actions>
            <q-btn @click="valid" class="glossy full-width"  color="secondary" label="Tạo palllet" />
          </q-card-actions>
          </q-card>
        </div>
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
    <dialog-success :show="showSuccess" :palletCode="palletCode" :closeDialog="closeDialog"  />
  </q-page>
</template>

<script>
import DialogCreatePalletSuccess from "../../components/prod/DiaLogCreatePalletSuccess";
export default {
  components:{
    "dialog-success":DialogCreatePalletSuccess,
  },
    data(){
      return {
        showProjectInfo:false,
        showLoadItems:false,
        item:null,
        items:[],
        qty:'',
        disableSelectItem:false,
        sources:[],
        source:null,
        destinations:[],
        destination:null,
        showDialog:false,
        showSuccess:false,
        palletCode:'',
        showDes:true
      }
    },
    created(){
      if (this.$store.state.funiture.projectSelected.id!==undefined) {
        this.showProjectInfo = true
        this.loadItems(this.$store.state.funiture.projectSelected.id)
      }
    },
    watch:{
      source(val){
        if (val.value===100317) {
          //nếu chọn xuất từ đóng gói thì sẽ xuất đến chính nó luôn
          this.showDes  = false
          this.destination = val
        }else {
          this.showDes = true
        }
      }
    },
    methods:{
      valid(){
        if (this.source&&this.destination&&this.item&&parseFloat(this.qty)>0) {
          this.showDialog = true
        }else {
          this.$q.notify({
            message:'Thiếu thông tin !',
            color:'red'
          })
        }
      },
      goSelectProject(){
        this.$router.push('/funiture-select-project')
      },  
      async loadItems(projectId){
        this.showLoadItems = true
        const data = await this.$store.dispatch('funiture/ACTION_LOAD_ITEM_FROM_PROJECT',projectId)
        if (data.meta.success===true) {
          data.data.forEach(element => {
            const height = element.height || '0'
            const width = element.width || '0' 
            const length = element.length || '0'
            const it ={ 
              label:element.name+' -> Dầy :'+ height+ ' Rộng: '+ width+' Dài: '+length,
              value:element.id,
              name:element.name,
              code:element.code,
              width:element.width,
              height:element.height,
              length:element.length,
              itemId:element.itemId
              }
            this.items.push(it)
          });
          if (this.items.length===1) {
            this.item = this.items[0]
            this.disableSelectItem = true
          }

          //load select sources
          this.$store.getters["production/mySources"].forEach(s=>{
            const sor = { label:s.name,value:s.id}
            this.sources.push(sor)
          })
          // load destinations
          this.$store.getters["production/myDestinations"].forEach(d=>{
            const des = { label:d.name,value:d.id}
            this.destinations.push(des)
          })

          this.showLoadItems = false
        }else {
          this.$q.notify({
            message:data.meta.messages.message,
            color:'red'
          })
        }
      },
      searchItem(val, update){
        let itemDupplicate=[]
        this.$store.state.funiture.items.forEach(element=>{
          const i = {
            label:element.name+' -> Dầy :'+ element.height+ ' Rộng: '+ element.width+' Dài: '+element.length,
            value:element.id,
            name:element.name,
            code:element.code,
            width:element.width,
            height:element.height,
            length:element.length,
            itemId:element.itemId

          }
          itemDupplicate.push(i)
        })
        if (val === '') {
          update(() => {
            this.items = itemDupplicate
          })
          return
        }

        update(() => {
          const needle = val.toLowerCase()
          this.items = itemDupplicate.filter(v => {
            const quicach =v.label
            if (quicach.toString().indexOf(needle) > -1) {
              return v
            }
          })
        })
      },
      async create(){
        const payload = {
          sourceId:this.source.value,
          destinationId: this.destination.value,
          projectProductId:this.item.value,
          itemId: this.item.itemId,
          quantity:this.qty
        }
        this.showDialog = false
        let data = await this.$store.dispatch('production/ACTION_CREATE_PALLET',payload)
        if (data.meta.success===true) {
          console.log(data.data)
          this.palletCode = data.data[0].code
          this.showSuccess =true
          this.$q.notify({
            message:'Tạo pallet thành công !',
            color:'green'
          })
          const topic = this.destination.value.toString()+'-RECIVED-PALLET'
          const titleMessage = 'Đã nhận được pallet số '+this.palletCode
          const bodyMessgae = 'Nhận được pallet từ công đoạn '+this.source.label+' chuyển đến công đoạn '+this.destination.label
          const path ='/#/production-dashboard?code='+this.palletCode
          this.$sendFcm(titleMessage,bodyMessgae,path,topic,{}).then(res=>{
            console.log('send fcm success',res)
          }).catch(err=>{
            console.log('send Error: '+err)
          })
          this.destination=null
          this.qty = ''
        }else {
          this.$q.notify({
            message:data.meta.messages.message,
            color:'red'
          })
        }
      },
      closeDialog(){
        this.showSuccess = false
      }
    }
}
</script>

<style>

</style>