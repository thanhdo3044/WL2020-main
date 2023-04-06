<template>
  <q-page class="q-pa-md">
    <div v-if="this.$store.state.production.loadItemsDone===true">
      <app-bar>Tạo Số Lô</app-bar>
    <div class="row justify-center">
      <div class="col-12 col-md-6 q-ma-md">
        <info-factoryfsc/>
        <!-- <div class="row">
            <div class="col-12">
                <q-select clearable  style="font-family:'Time New Roman';font-size:16px;text-align:center" v-model="woodType" behavior="dialog" :options="woodTypes" label="Loại gỗ" />
            </div>
        </div> -->
        
        <div class="row">
            <div class="col-12">
              <!-- <q-input @blur="blurLenhSx" outlined style="font-family:'Time New Roman';font-size:16px;text-align:center" v-model="lenhsx" label="Lệnh sản xuất" /> -->
               <q-select   style="font-family:'Time New Roman';font-size:16px;text-align:center" @input="changeProdOrder" v-model="prodOrder" behavior="dialog" :options="prodOrders" label="Lệnh sản xuất" />
            </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-select style="font-family:'Time New Roman';font-size:16px;text-align:center" v-model="sourceSelect" behavior="dialog" :options="sources" @input="changeSource" label="Bộ phận tạo số lô :" />
          </div>
        </div>
        <div v-show="showSelectDestination" class="row">
          <div class="col-12">
            <q-select style="font-family:'Time New Roman';font-size:16px" v-model="destinationSelect" behavior="dialog" :options="destinations" label="Nơi xuất đến :" />
          </div>
        </div>
        <div class="row" >
          <div class="col-12">
            <q-select style="font-family:'Time New Roman';font-size:16px" v-model="palletTypeSelect" behavior="dialog"
             :options="palletTypes" label="Hình thức :" />
          </div>
        </div>
        <div class="row justify-center" v-if="itemsSelected.length>0">
          <div class="col-12 q-ma-sm" >
            <q-card class="my-card">
              <q-card-section>
                <div class="text-h6">{{itemsSelected[0].name}}</div>
              </q-card-section>
              <q-card-section>
                <q-input v-model="this.current.quantity" type="text" label="Số lượng đã sản xuất " :disable="true" />
                <br>
                <q-input v-model="this.receiveQty" type="text" label="Số lượng vật liệu đã nhận " :disable="true" />
                <br>
                <q-input v-model.number="itemsSelected[0].quantity" outlined type="number" label="Số lượng ghi nhận" />
              </q-card-section>
            </q-card>
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
    <dialog-success :show="showSuccess" :palletCode="palletCode" :closeDialog="closeDialog"  />
    
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
import {isObjectEmpty, showNotifySuccess, showNotifyError} from '../../utils/utils'
import { DxDataGrid, DxColumn, DxEditing, DxLookup,DxRequiredRule, DxPopup,DxPosition,DxForm,DxItem } from 'devextreme-vue/data-grid';
export default {
    components:{
        'app-bar':AppBar,
        'info-factoryfsc': InfoFactoryAndFSC,
        'card-itempallet':CardItemPalllet,
        'info-supplies':InforSupplies,
        'card-item-in-from':CardItemInForm,
        "dialog-success":DialogCreatePalletSuccess,
        'dialog-add-supplies':DialogAddSupplies,
        DxDataGrid,
        DxColumn,
        DxEditing,
        DxLookup,
        DxRequiredRule,
        DxPopup,DxPosition,DxForm,DxItem
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
        showSelectDestination:true,
        showConfirm:false,
        prodOrder:null,
        prodOrders:[],
        woodType:null,
        woodTypes:[],
        lenhsx:'',
        requireSelectLSX:true,
        itemsSelected:[],
        current:{departmentId:0,quantity:0},
        currentsData:[],
        isHoanThien :false,
        maxQuantityAvalible:0,
        currentRoutings:[],
        receiveQty:0
      }
    },
    computed:{
      wathValidate(){
        return `${this.sourceSelect}|${this.destinationSelect}|${this.prodOrder}`
      }
    },
    watch:{
      wathValidate(newVal,oldVal){
        const [sSelect, dSelect,tSelect,iSelect,mProdOrder] = newVal.split('|');
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
      item(val){
        if (val) {
          
        }
      },
      // sourceSelect(val){
      //   if (this.currentsData.length>0) {
      //     if (this.currentsData.findIndex(d=>{return d.departmentId===val.value})!==-1) {
      //       this.current = this.currentsData.find(d=>{return d.departmentId===val.value})
      //     }
      //   }
      // }
    },
    created(){
      const myFactoryId = this.$store.getters['base/myFactoryInfor'].id
      const typeScreen = this.$route.query.type
      if (typeScreen) {
        typeScreen==='ht' ? this.isHoanThien =true : this.isHoanThien =false
      }
      let loadProductionOrders = new Promise(async(resolve,reject)=>{
        let dataProdOrder = await this.$store.dispatch('production/ACTION_LOAD_PROD_ORDERS_BY_FACTORY',myFactoryId)
        dataProdOrder.data.forEach(prodOrder => {
          let prO = {
            label:prodOrder.name,
            value:prodOrder.id
          }
          this.prodOrders.push(prO)
        });
        resolve(true)
      })
      let loadPalletTypes = new  Promise((resolve,reject)=>{
        let myTypeOfPackageTypeId
        if (!isObjectEmpty(this.$store.getters["base/myStepInfor"])) {
          myTypeOfPackageTypeId = this.$store.getters["base/myStepInfor"].packageTypeGroupId
        }
        if (!isObjectEmpty(this.$store.getters["base/myXuongInfor"])) {
          myTypeOfPackageTypeId = this.$store.getters["base/myXuongInfor"].packageTypeGroupId
        }
        if (!isObjectEmpty(this.$store.getters["base/myDepartmentInfor"])) {
          myTypeOfPackageTypeId = this.$store.getters["base/myDepartmentInfor"].packageTypeGroupId
        }
        if (!isObjectEmpty(this.$store.getters["base/myFactoryInfor"])) {
          myTypeOfPackageTypeId = this.$store.getters["base/myFactoryInfor"].packageTypeGroupId
        }
        this.$store.dispatch('production/ACTION_GET_PACKAGE_TYPE').then((data)=>{
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
        resolve(true)
      })
      let loadItems = new Promise(async(resolve,reject)=>{
        // let dataItem = await this.$store.dispatch('production/ACTION_FETCH_ITEMS_BY_TYPE',100008)        
        // dataItem.forEach(it=>{
        //   this.items.push({
        //     value:it.id,
        //     label: it.name
        //   })
        // })
        resolve(true)
      })
      
      Promise.all([loadItems,loadProductionOrders,loadPalletTypes]).then(values=>{
        this.$store.dispatch('production/ACTION_LOAD_DONE_CREATE_PALLET')
        const personSources = this.$store.getters['base/mySources']
        const personDestinations = this.$store.getters['base/myDestinations']
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
        personDestinations.forEach(d=>{
          this.destinations.push({
            value:d.id,
            label: d.name
          })
        })
        if (this.destinations.length>0) {
          this.destinationSelect=this.destinations[0]
        }else {
          this.$q.notify({
            message:'Tài khoản chưa được cấu hình !'
          })
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    methods:{
      async changeProdOrder(val){
         await this.loadProdInLSX(val.value)
      },
      async loadProdInLSX(prodOrderId){
        this.$q.loading.show({
          message:'Chờ 1 chút ...',
          messageColor:'white',
        })
        this.itemsSelected = []
        this.receiveQty = 0
        let dataMaterial = await this.$store.dispatch('wood/LOAD_MATERIAL_IN_PROD',prodOrderId) 
        this.currentsData = dataMaterial.data.current
        if (dataMaterial.data.products.length>0) {
          const planQty = dataMaterial.data.products[0].quantity
          let cItem = dataMaterial.data.products[0]
          let previousCurrent = []
          this.previousCurrent = dataMaterial.data.receive.find(r=>{return r.departmentId === this.sourceSelect.value})
          if (this.previousCurrent) {
              this.receiveQty = this.previousCurrent.quantity
          }
          if (this.currentsData.findIndex(d=>{return d.departmentId===this.sourceSelect.value})!==-1) {
            const currIndex = this.currentsData.findIndex(d=>{return d.departmentId===this.sourceSelect.value})
            this.current = this.currentsData[currIndex]
            cItem.quantity =0
          }else{
            this.current =[]
            this.$q.notify({
              message:'Lệnh sản xuất này chưa đc sản xuất !'
            })
          }
          this.itemsSelected.push(cItem)
        //kiểm tra định tuyến
          const routings = dataMaterial.data.routings
          let nextProcess
          if (routings.length>0) {
            this.currentRoutings= routings
            const currentProcessOrderIndex = routings.findIndex(r=>{return r.departmentId===this.sourceSelect.value})
            // console.log(currentProcessOrderIndex)
            if (currentProcessOrderIndex!==-1) {
              const currentProcessOrder = routings[currentProcessOrderIndex].order
              nextProcess = routings.find(r=>{return r.order === parseInt(currentProcessOrder+1)})
              console.log(nextProcess)
              //nếu công đoạn đang chọn đc xếp đầu tiền thỳ số lượng tối đa được nhập sẽ bằng số lượng ban đầu kế hoạch
              if (currentProcessOrder===1) {
                this.receiveQty = planQty
                console.log(planQty)
              }
              if (nextProcess) {
                this.destinationSelect={
                  value:nextProcess.departmentId,
                  label:nextProcess.name
                }  
              }else{
                this.$q.notify({
                  message:'LSX không có định tuyến cho công đoạn '+this.sourceSelect.label
                })
              }
              // if (this.receiveQty>planQty) {
              //     this.receiveQty=planQty
              // }
            }else {
              // this.$q.notify({
              //   message:''
              // })
            }
          }else{
            this.$q.notify({
              message:'Lệnh sản xuất này chưa được định tuyến !'
            })
          }

        }
        this.$q.loading.hide()
      },
      initNewRow(){

      },
      insertedRow(){

      },
      onEditorPreparing(e){
        if (e.dataField === 'itemId') {
          e.editorOptions.disabled = true
        }
      },
      insertingRow(){

      },
      blurMaLoGo(){
        // localStorage.setItem('malogo',this.parcel)
      },
      async changeSource(value){
        this.receiveQty = 0
        if (this.prodOrder) {
          await this.loadProdInLSX(this.prodOrder.value)
        }
      },
      toAddSupplies(){
        // this.$store.dispatch('production/ACTION_GET_DETAIL_PALLET',params)
        // this.$router.push({ name: 'addcoc', params: { code:  this.palletCode} })
        // this.$router.push('/')
      },
      closeDialog(){
        // this.$router.push('/')
        this.showSuccess =false
        this.prodOrder = null,
        this.itemsSelected = []
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
        let validateQty = true
        const sourceExistInRouting = this.currentRoutings.findIndex(r=>{return r.departmentId===this.sourceSelect.value})
        if (sourceExistInRouting>-1) {
          if (this.itemsSelected.length===1) {
            if (parseInt(this.itemsSelected[0].quantity+this.current.quantity) > parseInt(this.receiveQty)) {
              this.$q.notify({
                message:'Số lượng không chính xác !'
              })
              validateQty = false
            }
          }
          if (validateQty) {
            const sourceId = this.sourceSelect.value
            const destinationId = this.destinationSelect.value
            const itemId = this.itemsSelected[0].id
            const itemQty = this.itemsSelected[0].quantity
            let data = {
              sourceId: sourceId,
              destinationId:destinationId,
              itemId:itemId,
              quantity:itemQty,
              productionOrdersId: this.prodOrder.value,
            }
            let eventLog = {
              eventName:'Tạo So Lo',
              timeStamp: new Date().toISOString(),
              status:0,
              palletCode:'????????',
              palletType:this.prodOrder.label
            }
            this.$store.dispatch('production/ACTION_CREATE_PALLET',data).then(res=>{
              if(res.meta.success===true){
                // this.$store.dispatch('production/ACTION_REMOVE_ALL_WOOD')
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
                showNotifySuccess()
                eventLog.status=1
                eventLog.palletCode = res.data[0].code
              }else {
                eventLog.status=0
                this.$q.notify({
                  message:res.meta.messages.message,
                  color:'red',
                })
              }
              this.$eventLog(eventLog)
            })
          }else {
            this.$q.notify({
              message:'Thiếu thông tin, vui lòng kiểm tra lại',
              color:'red',
            })
          } 
        }else{
          showNotifyError('Lệnh sản xuất này không đi qua công đoạn '+this.sourceSelect.label)
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