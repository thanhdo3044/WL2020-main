<template>
  <q-page class="q-pa-md">
    <div v-if="this.$store.state.production.loadItemsDone===true">
      <app-bar>Tạo pallet</app-bar>
    <div class="row justify-center">
      <div class="col-12 col-md-6 q-ma-md">
        <info-factoryfsc/>
        <div class="row">
            <div class="col-12">
                <q-select clearable  style="font-family:'Time New Roman';font-size:16px;text-align:center" v-model="woodType" behavior="dialog" :options="woodTypes" label="Loại gỗ" />
            </div>
        </div>
        <div v-if="!requireSelectLSX" class="row">
            <div class="col-12">
                <q-input @blur="blurMaLoGo" outlined style="font-family:'Time New Roman';font-size:16px;text-align:center" v-model="parcel" label="Mã lô gỗ" />
            </div>
        </div>
        <div v-else class="row">
            <div class="col-12">
              <!-- <q-input @blur="blurLenhSx" outlined style="font-family:'Time New Roman';font-size:16px;text-align:center" v-model="lenhsx" label="Lệnh sản xuất" /> -->
               <q-select clearable  style="font-family:'Time New Roman';font-size:16px;text-align:center" v-model="prodOrder" behavior="dialog" :options="prodOrders" label="Lệnh sản xuất" />
            </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-select style="font-family:'Time New Roman';font-size:16px;text-align:center" v-model="sourceSelect" behavior="dialog" :options="sources" :add="changeSource" label="Bộ phận tạo pallet :" />
          </div>
        </div>
        <div v-show="showSelectDestination" class="row">
          <div class="col-12">
            <q-select style="font-family:'Time New Roman';font-size:16px" v-model="destinationSelect" behavior="dialog" :options="destinations" label="Nơi xuất đến :" />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-select style="font-family:'Time New Roman';font-size:16px" v-model="palletTypeSelect" behavior="dialog" :options="palletTypes" label="Loại pallet :" />
          </div>
        </div>
        <!-- row qui cacsh tho -->
        <div class="row" v-if="this.$store.state.production.materialSelected===null&&requireMaterialSelect===true">
          <div class="col-12">
            <q-select @input="selectMaterialById" use-input input-debounce="0" @filter="searchMaterial" style="font-family:'Time New Roman';font-size:16px" v-model="materialSelected" behavior="dialog" :options="materials" label="Qui cách thô :" />
          </div>
        </div>
        <!-- end row qui casch tho -->
        <!-- row qui cach tinh -->
        <div class="row" v-if="this.$store.state.production.itemChoosed===null">
          <div class="col-12" v-show="showSelectItem">
            <q-select @input="selectItemById" use-input input-debounce="0" @filter="searchItem" style="font-family:'Time New Roman';font-size:16px" v-model="item" behavior="dialog" :options="items" label="Qui cách tinh :" />
          </div>
        </div>
        <!-- end row qui cach tinh -->
        <!-- card qui cach tho da chon -->
        <div class="row justify-center q-mt-md " v-if="this.$store.state.production.materialSelected!==null&& this.$store.state.production.materialSelected.id!==undefined">
          <div  class="col-12">
            <card-item-in-from :typeMaterial="true"  :cardClass="'bg-secondary text-white'"  :removeItem="removeMaterial" :item="this.$store.state.production.materialSelected"></card-item-in-from>
          </div>
        </div>
        <!-- card qui cach tinh da chon -->
        <div class="row justify-center q-mt-md ">
          <div v-if="this.$store.state.production.itemChoosed!==null&& this.$store.state.production.itemChoosed!==undefined&& this.$store.state.production.itemChoosed.id!==undefined" class="col-12">

            <card-item-in-from  :removeItem="removeItem" :item="this.$store.state.production.itemChoosed"></card-item-in-from>
            
          </div>
        </div>
        <!-- button tao pallet -->
        <div v-if="validate"  class="row justify-center">
          <div class="col-8 justify-center">
            <q-btn @click="showConfirm=true" color="primary full-width q-mt-md" glossy label="Tạo pallet" />
          </div>
        </div>
      </div>
      
    </div>
    </div>
    <div class="row justify-center" >
      <div class="col-6 justify-center">
        <q-inner-loading :showing="!this.$store.state.production.loadItemsDone" 
        :groupItemTypes="this.$store.state.production.groupItems" :groupItemTypeSelected="this.$store.state.production.groupItems[0]">
          <q-spinner-gears size="150px" color="primary" />
        </q-inner-loading>
      </div>
    </div>
    <dialog-success :show="showSuccess" :palletCode="palletCode" :closeDialog="closeDialog"  />
    <dialog-add-supplies :show="showDialogAddSupplie" :toAddSupplies="toAddSupplies" :close="closeConfirmAddSupplie" />
    <q-dialog v-model="showConfirm" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="prodTextTitle">Bạn đã chắc chắn ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn @click="createPallet" flat label="Đồng ý" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { feature } from "../../configs/constants"

import InfoFactoryAndFSC from '../../components/prod/InforFactoryAndFSC'
import CardItemPalllet from '../../components/prod/CardItemInPallet'
import AppBar from '../../components/AppBar'
import InforSupplies from '../../components/prod/InforSupplies'
import CardItemInForm from '../../components/prod/CardItemInForm'
import { types } from "../../configs/constants"
import DialogCreatePalletSuccess from "../../components/prod/DiaLogCreatePalletSuccess";
import DialogAddSupplies from "../../components/prod/DialogAddSupplies";
import baseURL from '../../configs/base'
import {isObjectEmpty} from '../../utils/utils'
const typeString = 'wood-processing'
export default {
    components:{
        'app-bar':AppBar,
        'info-factoryfsc': InfoFactoryAndFSC,
        'card-itempallet':CardItemPalllet,
        'info-supplies':InforSupplies,
        'card-item-in-from':CardItemInForm,
        "dialog-success":DialogCreatePalletSuccess,
        'dialog-add-supplies':DialogAddSupplies
    },
  
    beforeDestroy(){
      console.log('create pallet page destroy')
      this.$store.dispatch('production/ACTION_LOAD_DONE_CREATE_PALLET_INIT')
      this.item=null
      this.removeItem()
    },
    beforeMount(){
      this.removeItem()
      this.removeMaterial()
    },

    data(){
      return {
        items:[],
        parcel:'',
        dialog:false,
        item:null,
        loadDone:0,
        showLoadling:true,
        sources:[],
        sourceSelect:null,
        destinations:[],
        destinationSelect:null,
        palletTypes:[],
        palletTypeSelect:null,
        materials:[],
        materialSelected:null,
        requireMaterialSelect:false,
        validate:false,
        showSuccess:false,
        palletCode:'',
        showDialogAddSupplie:false,
        showSelectItem:false,
        showSelectDestination:false,
        showConfirm:false,
        prodOrder:null,
        prodOrders:[],
        woodType:null,
        woodTypes:[],
        lenhsx:'',
        requireSelectLSX:true
      }
    },
    computed:{
    ...mapGetters("base", ["myDepartments","userInfo"]),

      wathValidate(){
        return `${this.sourceSelect}|${this.destinationSelect}|${this.palletTypeSelect}|${this.item}|${this.materialSelected}|${this.prodOrder}`
      }
    },
    watch:{
      wathValidate(newVal,oldVal){
        const [sSelect, dSelect,tSelect,iSelect,mSelect,mProdOrder] = newVal.split('|');
        if (sSelect!=='null'&&dSelect!=='null'&&tSelect!=='null'&&iSelect!=='null') {
          if (this.requireMaterialSelect) {
            if (mSelect!=='null') {
              this.validate=true
            }else {
              this.validate=false
            }
          } else {
            if (mProdOrder!=='null') {
              this.validate=true
            }
          }
        }else {
          this.validate=false
        }
      },
      sourceSelect(val){
        if (val) {
          const sourcesInfo = this.$store.getters['base/mySources']
          const sr = sourcesInfo.find((s)=>{ return s.id===val.value})
          this.$store.dispatch('production/ACTION_SELECT_SOURCE',sr)
          this.showSelectItem = true
        }
      },
      item(val){
        if (val) {
          const payloadGetDes = {
            itemId:val.value,
            token:this.$store.state.production.userInfo.token
          }
          this.$store.dispatch('production/ACTION_GET_DESTINATION_BY_ITEM',payloadGetDes).then(resp=>{
            this.destinations=[]
            if (resp.data.length>0) {
              const desIndex = resp.data.findIndex((d)=>{ return d.id===this.sourceSelect.value})
              
              if (desIndex<resp.data.length-1) {
                const defaultDes = {
                  label:resp.data[desIndex+1].name,
                  value:resp.data[desIndex+1].id
                }
                this.destinations.push(defaultDes)
                this.destinationSelect=defaultDes //set côgn đoạn xuất mặc định
              }
              //kiểm tra nếu có tài khoản có gắn công đoạn xuất hàng
              // thì gộp cmn luôn vào
            }else {
              this.$q.notify({
                  message:'Sản phẩm này không có định tuyến !'
              })
            }
            if (this.$store.getters["base/myDestinations"].length>0) {
              this.$store.getters["base/myDestinations"].forEach(element => {
                if (this.destinations.findIndex(d=>{return d.value===element.id})===-1) {
                  const de ={
                    label:element.name,
                    value:element.id
                  }
                  this.destinations.push(de)
                }
              });
            }
            this.showSelectDestination = true
          })
        }
      }
    },
    
    mounted(){
      const myFactoryId = 100000
      console.log('userInfo',this.userInfo)
      let malogo = localStorage.getItem('malogo')
      if (malogo) {
        this.parcel = malogo
      }
      const typeScreen = this.$route.query.type
      if (typeScreen) {
        if (typeScreen==='lp') {
          this.requireMaterialSelect = true
          this.requireSelectLSX =false
        }
        if (typeScreen==='sc') {
          this.requireMaterialSelect = true
        }
      }else {
        this.$q.notify({
          message:'Dữ liệu không chính xác !'
        })
        this.$router.push('/production-dashboard')
      }

      let loadWoodTypes = new Promise((resolve,reject)=>{
        this.$store.dispatch('production/ACTION_LOAD_WOOD_TYPES',typeString).then(res=>{
          res.data.forEach(wt=>{
            const wtypes ={
              label:wt.name,
              value:wt.id
            }
            this.woodTypes.push(wtypes)
          })
          if (this.woodTypes.length>0) {
            this.woodType = this.woodTypes[0]
          }
          resolve(true)
        })
        
        
      })

      // lay thong tin material
      let loadMaterial = new Promise((resolve,reject)=>{      
        this.$store.dispatch('production/ACTION_FETCH_WOOD_ITEMS',myFactoryId).then(res=>{
            this.$store.state.production.woods.forEach(ws=>{
              const w = {
                label:ws.height+' '+ws.width+' '+ws.length+ ' -> '+ws.name,
                value:ws.id
              }
              this.materials.push(w)
            })
            resolve(true)
          }).catch(err=>{
            console.log('Load Material Error :'+err)
            reject(false)
          })
        
      })
      //promise lấy loại pallet
      let loadPalletTypes = new  Promise((resolve,reject)=>{
        // let myTypeOfPackageTypeId = this.$store.getters["base/myDepartmentInfor"].packageTypeGroupId ||  this.$store.getters["base/myXuongInfor"].packageTypeGroupId || this.$store.getters["base/myFactoryInfor"].packageTypeGroupId
     
          let myTypeOfPackageTypeId = 100002
        this.$store.dispatch('production/ACTION_GET_PACKAGE_TYPE',this.$store.state.production.userInfo.token).then((data)=>{
          this.$store.state.production.packageTypes.forEach((plTYpe)=>{
            if (plTYpe.typeId===myTypeOfPackageTypeId) {
              const p = {
                label:plTYpe.name,
                value:plTYpe.id
              }
              this.palletTypes.push(p)
            }
          })
          resolve(true)
        }).catch(err=>{
          reject(false)
        })
      })

      //lấy các lệnh sản xuất ra để chọn

      //  2019-11-20 
      // bỏ chọn thông tin lệnh sản xuất
      // chuyển sang text nên không cần lấy dữ liệu nữa
      // tránh lỗi khôgn cần thiết
      let loadProductionOrders = new Promise(async(resolve,reject)=>{
        const payload ={
          factoryId: myFactoryId
        }
        let dataProdOrder = await this.$store.dispatch('production/ACTION_LOAD_PROD_ORDERS',payload)
        dataProdOrder.data.forEach(prodOrder => {
          let prO = {
            label:prodOrder.name,
            value:prodOrder.id
          }
          this.prodOrders.push(prO)
        });
        resolve(true)
      })

      // lấy thông tin nơi xuất và nơi đến
      let loadSourceDes = new Promise((resolve,reject)=>{
        const personSources = this.$store.getters['base/mySources']
        // const personDestinations = this.$store.state.production.userInfo.role.types.find((type)=>{return type.id===types.DESTINATIONS}).value
        personSources.forEach(source => {
          const s = {
            label: source.name,
            value:source.id
          }
          this.sources.push(s)
        });
        if (this.sources.length>0) {
          this.sourceSelect = this.sources[0]
        }
        // personDestinations.forEach((des)=>{
        //   const d ={
        //     label:des.name,
        //     value:des.id
        //   }
        //   this.destinations.push(d)
        // })
        resolve(true)
      })

      let loadItems = new Promise((resolve,reject)=>{
         if(this.$store.state.production.items.length>0){
            resolve(true) 
         }else {
           const payload ={
             factoryId:myFactoryId
           }
           this.$store.dispatch('production/ACTION_FETCH_ITEMS',payload).then((e)=>{
              resolve(true)
            }).catch(err=>{
              console.log(' Load Item Fail !',err)
              reject(false)
            })
         }
      })
      
      Promise.all([loadMaterial,loadWoodTypes,loadPalletTypes,loadItems,loadSourceDes,loadProductionOrders]).then(values=>{
          console.log(values)
        this.$store.dispatch('production/ACTION_LOAD_DONE_CREATE_PALLET')
        if (this.sources.length>0 && this.destinations.length>0) {
          this.sourceSelect = this.sources[0].name
          this.destinationSelect = this.destinations[0].name
        }
        this.$store.dispatch('production/MERGE_ITEMS_WITH_WOODS')
      }).catch(err=>{
        console.log(err)
      })
    },
    methods:{
      blurMaLoGo(){
        localStorage.setItem('malogo',this.parcel)
      },
      changeSource(value){
        console.log(value)
      },
      toAddSupplies(){
        // this.$store.dispatch('production/ACTION_GET_DETAIL_PALLET',params)
        this.$router.push({ name: 'addcoc', params: { code:  this.palletCode} })
      },
      closeDialog(){
        //update ngày 12/11/2019 
        // không phải hỏi nữa, mà mặc định chuyển đến nhập thông tin keo hóa chất
        const params = {
          token:this.$store.state.production.userInfo.token,
          palletCode:this.palletCode
        }
        this.$router.push({ name: 'addcoc', params: { code:  this.palletCode} })
        // this.showSuccess = false;
        // this.showDialogAddSupplie =true
      },
      chooseItem(){
        this.$router.push('/production-items')
      },
      removeItem(){
          this.$store.dispatch('production/ACTION_REMOVE_ITEM')
          this.item=null
      },
      removeMaterial(){
        this.$store.dispatch('production/ACTION_REMOVE_MATERIAL_SELECTED')
        this.materialSelected=null
      },
      selectItemById(){
        this.$store.dispatch('production/ACTION_CHOOSE_ITEM',this.item)
      },
      selectMaterialById(){
        this.$store.dispatch('production/ACTION_SELECT_ONE_MATERIAL',this.materialSelected)
      },
      createPallet(){
        let validateQty = false
        if (this.requireMaterialSelect) {
          if (this.$store.state.production.materialSelected.qty>0 && this.$store.state.production.itemChoosed.qty>0) {
            validateQty =true
          }
        } else {
          if (this.$store.state.production.itemChoosed.qty>0) {
            validateQty =true
          }
        }
        console.log('nha may:',this.userInfo)
        console.log('token:',this.$store.getters["base/myFactoryInfor"])
        if (validateQty) {
          const token =this.$store.state.production.userInfo.token
          const sourceId = this.sourceSelect.value
          const destinationId = 100081
          const itemId = this.$store.state.production.itemChoosed.id
          const itemQty = this.$store.state.production.itemChoosed.qty
          let materialId,materialQty
          let data={}
          let body2 ={}
          let body = {
            token:token,
            sourceId: sourceId,
            destinationId:destinationId,
            itemId:itemId,
            quantity:itemQty,
            productionOrdersId: this.prodOrder ? this.prodOrder.value : null,
            woodTypeId:this.woodType.value,
            factoryId:this.userInfo.factoryId
          }
          if (this.requireMaterialSelect) {
            materialId = this.$store.state.production.materialSelected.id
            materialQty = this.$store.state.production.materialSelected.qty
            body2 ={
              materialsId:materialId,
              materialsQuantity:materialQty,
              parcel:this.parcel,
            }
          }
          data = {...body,...body2}
          let eventLog = {
            eventName:'Tạo Pallet',
            timeStamp: new Date().toISOString(),
            status:0,
            palletCode:'????????',
            palletType:this.palletTypeSelect.label
          }
          this.$store.dispatch('production/ACTION_CREATE_PALLET',data).then(res=>{
            if(res.meta.success===true){
              this.$store.dispatch('production/ACTION_REMOVE_ALL_WOOD')
              this.palletCode = res.data[0].code
              this.showSuccess = true
              this.removeItem()
              this.removeMaterial()
              const topic = this.destinationSelect.value.toString()+'-RECIVED-PALLET'
              const titleMessage = 'Đã nhận được pallet số '+this.palletCode
              const bodyMessgae = 'Nhận được pallet từ công đoạn '+this.sourceSelect.label+' chuyển đến công đoạn '+this.destinationSelect.label
              const path ='/#/production-dashboard?code='+this.palletCode
              this.$sendFcm(titleMessage,bodyMessgae,path,topic,{}).then(res=>{
                console.log('send fcm success',res)
              }).catch(err=>{
                console.log('send Error: '+err)
              })
              this.$q.notify({
                message:'Tạo pallet thành công !',
                color:'green',
                position:'top-right'
              })
              eventLog.status=1
              eventLog.palletCode = res.data[0].code
            }else {
              eventLog.status=0
              this.$q.notify({
                message:res.meta.messages.message,
                color:'red',
                position:'center'
              })
            }
            this.$eventLog(eventLog)
          })
        }else {
          this.$q.notify({
            message:'Thiếu thông tin, vui lòng kiểm tra lại',
            color:'red',
            position:'center'
          })
        }
      },
      closeConfirmAddSupplie(){
        this.showDialogAddSupplie = false
      },
      searchItem (val, update) {
        let itemDupplicate=[]
        this.$store.state.production.items.forEach(it=>{
          const i = {
            label:it.name+' -> '+it.height+' '+it.width+' '+it.length,
            value:it.id
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
      searchMaterial(val, update){
        let itemDupplicate=[]
        this.$store.state.production.woods.forEach(it=>{
          const i = {
            label:it.name+' -> '+it.height+' '+it.width+' '+it.length,
            value:it.id
          }
          itemDupplicate.push(i)
        })
        if (val === '') {
          update(() => {
            this.materials = itemDupplicate
          })
          return
        }

        update(() => {
          const needle = val.toLowerCase()
          this.materials = itemDupplicate.filter(v => {
            const quicach =v.label
            if (quicach.toString().indexOf(needle) > -1) {
              return v
            }
          })
        })
      },
    }
}
</script>

<style>

</style>