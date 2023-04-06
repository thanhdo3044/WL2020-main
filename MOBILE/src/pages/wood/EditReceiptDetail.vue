<template>
  <q-page class="q-pa-sm">
      <app-bar>Chỉnh sửa dữ liệu </app-bar>
      <div class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <q-select
                outlined
                v-model="wtype"
                :options="woodsType"
                label="Phận loại"
            />
          </div>
      </div>
      <div class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <q-select
                outlined
                v-model="wtype2"
                :options="wtype2s"
                label="Loại gỗ"
            />
          </div>
      </div>
      <div class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <q-select
                outlined
                v-model="dtype"
                :options="dtypes"
                label="Tình trạng gỗ"
            />
          </div>
      </div>
      <div class="row justify-center q-mt-md">
          <div class="col-12 col-sm-6">
              <q-select
                outlined
                v-model="item"
                :options="items"
                label="Chọn qui cách"
            />
          </div>
      </div>
      <div class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <q-input outlined type="number" v-model.number="packageQuantity" label="Số bó" />
          </div>
      </div>
      <div class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <q-input outlined type="number" v-model.number="pcsPerPackage" label="Số tờ/bó" />
          </div>
      </div>
      <div class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <q-input outlined v-model="note" label="Ghi chú" />
          </div>
      </div>
      <div class="row justify-center q-mt-sm">
          <div class="col-12 col-sm-6">
              <q-btn @click="confirm=true" class="full-width" color="primary" glossy label="Lưu lại" />
          </div>
      </div>
      <q-dialog v-model="confirm" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Bạn đã chắc chắn ?.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" @click="submit" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import AppBar from '../../components/AppBar'
export default {
    components:{
        'app-bar':AppBar
    },
    data (){
        return {
            items:[],
            item:null,
            packageQuantity:'',
            pcsPerPackage:'',
            woodsType:[],
            wtype:null,
            note:'',
            wtype2s:[],
            wtype2:null,
            confirm:false,
            dtypes:[],
            dtype:null
        }
    },
    created(){
        this.initData()
    },
    methods: {
        async initData(){
            return Promise.all([this.loadWoodTypes(),this.loadInputType(),this.loadItems(),this.loadDType()]).then(val=>{
                this.loadCurrentData()
            })
            
        },
        loadCurrentData(){
            let id = this.$route.params.id
            return new Promise(async (resolve,reject)=>{
                let data = await this.$store.dispatch('wood/GET_DETAIL_DLT',id)
                if (data.data.length>0) {
                    const currentData = data.data[0]
                    // lấy thông tin phân loại đang chọn
                    let currentITypeIndex = this.woodsType.findIndex(w=>{return w.value ===currentData.INPUT_TYPE_ID})                    
                    this.wtype=this.woodsType[currentITypeIndex]
                    //lấy thông tin loại gỗ đang chọn
                    let currentWtypeIndex = this.wtype2s.findIndex(w=>{return w.value === currentData.WOOD_TYPE_ID})
                    this.wtype2 = this.wtype2s[currentWtypeIndex]
                    //lấy thông tin tình trạng gỗ nhập
                    let currentDTypeIndex = this.dtypes.findIndex(d=>{return d.value === currentData.DTYPE})
                    this.dtype = this.dtypes[currentDTypeIndex]
                    //lấy thông tin qui cách
                    let currentItemIndex =  this.items.findIndex(i=>{return i.value = currentData.ITEM_ID})
                    this.item = this.items[currentItemIndex]
                    
                    this.packageQuantity = currentData.PACKAGE_QUANTITY
                    this.pcsPerPackage = currentData.PCS_PER_PACKAGE
                    this.note = currentData.NOTE
                }
                resolve(true)
            })
        },
        loadWoodTypes (){
            return new Promise(async (resolve,reject)=>{
                let data = await this.$store.dispatch('wood/GET_WOOD_TYPE')
                if (data.data.length>0) {
                    data.data.forEach(element => {
                        let wt = {
                            value: element.ID,
                            label: element.NAME
                        }
                        this.wtype2s.push(wt)
                    });
                }
                resolve(true)
            })
        },
        loadDType() {
            return new Promise(async(resolve,reject)=>{
                let dataDType = await this.$store.dispatch('wood/GET_DTYPE','vcn')
                dataDType.data.forEach(element => {
                    let dt = {
                        label: element.NAME,
                        value:element.CODE
                    }
                    this.dtypes.push(dt)
                });
                if (this.dtypes.length>0) {
                    this.dtype=this.dtypes[0]
                }
                resolve(true)
            })
        },
        loadInputType(){
            return new Promise(async(resolve,reject)=>{
                let payload = {
                    moduleCode:'vcn',
                    type:undefined
                }
                let dataInputType = await this.$store.dispatch('wood/GET_INPUT_TYPE',payload)
                dataInputType.data.forEach(element => {
                    let sc = {
                        label:element.NAME,
                        value: element.ID
                    }
                    this.woodsType.push(sc)
                })
                if (this.woodsType.length>0) {
                    this.wtype = this.woodsType
                }
                resolve(true)
            })
        },
        loadItems(){
            return new Promise( async (resolve,reject)=>{
                const typeItemId =100010
                const payload = {
                    typeId:typeItemId
                }
                let dataItems = await this.$store.dispatch('wood/GET_ITEM_BY_TYPE',payload)
                if (dataItems.data.length>0) {
                    dataItems.data.forEach(element => {
                        let it = {
                            value:element.id,
                            label: element.height+'*'+element.width+'*'+element.length+' ('+element.name+')'
                        }
                        this.items.push(it)
                    });
                }
                resolve(dataItems)
            })
        },
        async submit(){
            if (this.validate) {
                let id = this.$route.params.id
                let payload ={
                    data:{
                        itemId: this.item.value,
                        pcsPackage:this.pcsPerPackage,
                        packageQuantity:this.packageQuantity,
                        inputTypeId:this.wtype.value,
                        note:this.note,
                        wType:this.wtype2.value,
                        dType: this.dtype.value,
                        iType:this.wtype.value  
                    },
                    id:id
                }
                let data = await this.$store.dispatch('wood/UPDATE_DETAIL_RECEIPT',payload)
                if (data.data[0].RESULT) {
                    this.$q.notify({
                        message:'Thành công !',
                        color:'green'
                    })
                    this.$router.go(-1)
                }else{
                    this.$q.notify({
                        message:data.data[0].MESSAGE,
                        color:'red'
                    })
                }
            }
        },
        validate(){
            if (this.item&&this.woodsType&&this.wtype2&&this.pcsPerPackage&&this.packageQuantity) {
                return true
            }
            return false
        }
    }
}
</script>

<style>

</style>