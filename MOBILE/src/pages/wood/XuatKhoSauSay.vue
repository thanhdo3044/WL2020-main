<template>
  <q-page class="q-pa-md">
    <div v-if="this.$store.state.production.loadItemsDone===true">
      <app-bar>Xuất Kho Sau Sấy</app-bar>
    <div class="row justify-center">
      <div class="col-12 col-md-6 q-ma-md">
        <!-- <info-factoryfsc/>
        <div class="row">
            <div class="col-12">
                <q-select clearable  style="font-family:'Time New Roman';font-size:16px;text-align:center" v-model="woodType" behavior="dialog" :options="woodTypes" label="Loại gỗ" />
            </div>
        </div> -->
        
        <div class="row">
            <div class="col-12">
               <q-select clearable  style="font-family:'Time New Roman';font-size:16px;text-align:center" @input="changeProdOrder" v-model="prodOrder" behavior="dialog" :options="prodOrders" label="Lệnh sản xuất" />
            </div>
        </div>
        <!-- <div class="row">
            <div class="col-12">
               <q-select clearable  style="font-family:'Time New Roman';font-size:16px;text-align:center"  v-model="receipt" behavior="dialog" :options="receipts" label="Số phiếu" />
            </div>
        </div> -->
         <div class="row">
          <div class="col-12">
            <q-select style="font-family:'Time New Roman';font-size:16px;text-align:center" v-model="sourceSelect" behavior="dialog" :options="sources" :add="changeSource" label="Kho :" />
          </div>
        </div>
        
       
        <div v-show="showSelectDestination" class="row">
          <div class="col-12">
            <q-select style="font-family:'Time New Roman';font-size:16px" v-model="destinationSelect" behavior="dialog" :options="destinations" label="Nơi xuất đến :" />
          </div>
        </div>
        <!-- <div class="row">
          <div class="col-12">
            <q-select style="font-family:'Time New Roman';font-size:16px" v-model="palletTypeSelect" behavior="dialog" :options="palletTypes" label="Loại ván :" />
          </div>
        </div> -->
      
        <!-- row qui cach tinh -->
        <!-- <div class="row" v-if="this.$store.state.production.itemChoosed===null">
          <div class="col-12" v-show="showSelectItem">
            <q-select @input="selectItemById" use-input input-debounce="0" @filter="searchItem" style="font-family:'Time New Roman';font-size:16px" v-model="item" behavior="dialog" :options="items" label="Sản phẩm :" />
          </div>
        </div> -->
        <!-- end row qui cach tinh -->
       
        <!-- card qui cach tinh da chon -->
        <div class="row justify-center q-mt-md ">
          <div v-if="this.$store.state.production.itemChoosed!==null&& this.$store.state.production.itemChoosed!==undefined&& this.$store.state.production.itemChoosed.id!==undefined" class="col-12">

            <card-item-in-from  :removeItem="removeItem" :item="this.$store.state.production.itemChoosed"></card-item-in-from>
            
          </div>
        </div>
        <div class="row q-mt-md gt-md">
          <div class="col-12">
             <DxDataGrid
              :data-source="itemsSelected"
              :show-borders="true"
              key-expr="id"
              @editorPreparing="onEditorPreparing"
              @init-new-row="initNewRow"
              @row-inserted="insertedRow"
              @row-inserting="insertingRow"
              
            >
           
              <DxEditing
                :allow-deleting="true"
                :allow-updating="true"
                :use-icons="true"
                mode="popup"
              >
              <DxPopup
              :show-title="true"
              :width="700"
              :height="425"
              title="Nhập số lượng"
            >
              <DxPosition
                my="center"
                at="center"
                of="window"
              />
              </DxPopup>
              </DxEditing>
              <DxColumn
                data-field="name"
                caption="Tên sản phẩm"
                 width="355"
              >
              <!-- <DxRequiredRule/>
                <DxLookup
                  :data-source="items"
                  display-expr="label"
                  value-expr="value"
                /> -->
              </DxColumn>
              <DxColumn
                data-field="height"
                caption="Dầy"
                width="55"
              />
              <DxColumn
                data-field="width"
                caption="Rộng"
                width="55"
              />
              <DxColumn
                data-field="length"
                caption="Dài"
                width="60"
              />
              <DxColumn
                data-field="quantity"
                caption="Số lượng"
                data-type="number"
                format="fixedPoint"
              >
              <DxRequiredRule/>
              </DxColumn>
            </DxDataGrid>
          </div>
        </div>
        <div class="row justify-center lt-md q-mt-md">
          <div class="col-12 q-ma-sm" v-for="(item,index) in itemsSelected" v-bind:key="item.id">
            <q-card class="my-card">
              <q-card-section>
               <div class="row">
                  <div class="col-10">
                    <div class="text-h6">({{index+1}}) - {{item.name}}</div>
                  </div>
                  <div class="col-1" align="right">
                    <q-btn color="red" round icon="close" @click="removeMaterial(index)" />
                  </div>
               </div>
              </q-card-section>
              <q-card-section>
                <q-input v-model.number="item.quantity" outlined type="number" label="Số lượng xuất" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- button tao pallet -->
        <div v-if="validate"  class="row justify-center">
          <div class="col-8 justify-center">
            <q-btn @click="showConfirm=true" color="primary full-width q-mt-md" glossy label="Xuất kho" />
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
import {isObjectEmpty} from '../../utils/utils'
const typeString = 'planks'
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
    },
    data(){
      return {
        text:'',
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
        receipts:[],
        receipt:null,
        itemsInReceipt:[]
      }
    },
    computed:{
      wathValidate(){
        return `${this.sourceSelect}|${this.destinationSelect}`
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
      }
    },
    created(){
       const myFactoryId = this.$store.getters['base/myFactoryInfor'].id
      let loadReceipt = new Promise(async(resolve,reject)=>{
        
        let dataReceipt = await this.$store.dispatch('wood/GET_RECEIPTS',1)
        dataReceipt.data.forEach(rc => {
          let prO = {
            label:rc.NUMBER_OF_MONTH+'/'+rc.MONTH+'.'+rc.YEAR,
            value:rc.ID
          }
          this.receipts.push(prO)
        });
        resolve(true)
      })
      let loadItems = new Promise(async(resolve,reject)=>{
        let dataItem = await this.$store.dispatch('production/ACTION_FETCH_ITEMS_BY_TYPE',100008)        
        dataItem.forEach(it=>{
          this.items.push({
            value:it.id,
            label: it.name
          })
        })
        resolve(true)
      })
      // const loadMaterialInProdOrder = new Promise(async (resolve,reject)=>{
      //   let dataMaterial = await this.$store.dispatch('wood/LOAD_MATERIAL_IN_PROD',this.pro)
      // })
     
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
      Promise.all([loadItems,loadReceipt,loadProductionOrders]).then(values=>{
        this.$store.dispatch('production/ACTION_LOAD_DONE_CREATE_PALLET')
        const personSources = this.$store.getters['base/mySources']
        const personDestinations = this.$store.getters['base/myDestinations']
        personSources.forEach(source => {
         if (source.type2==='stock') {
             const s = {
            label: source.name,
            value:source.id
          }
          this.sources.push(s)
         }
          
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
        let dataMaterial = await this.$store.dispatch('wood/LOAD_MATERIAL_IN_PROD',val.value)        
        this.itemsSelected = dataMaterial.data.materials
      },
      initNewRow(){

      },
      insertedRow(){

      },
      onEditorPreparing(e){
        if (e.dataField === 'id' || e.dataField === 'name' || e.dataField === 'height'||e.dataField === 'length'||e.dataField === 'width') {
          e.editorOptions.disabled = true
        }
      },
      insertingRow(){

      },
      blurMaLoGo(){
        localStorage.setItem('malogo',this.parcel)
      },
      changeSource(value){
        console.log(value)
      },
      toAddSupplies(){
        // this.$store.dispatch('production/ACTION_GET_DETAIL_PALLET',params)
        // this.$router.push({ name: 'addcoc', params: { code:  this.palletCode} })
        // this.$router.push('/')
      },
      closeDialog(){
        console.log('close dialog')
        this.$router.push('/')
      },
      chooseItem(){
        this.$router.push('/production-items')
      },
      removeItem(){
          this.$store.dispatch('production/ACTION_REMOVE_ITEM')
          this.item=null
      },
      removeMaterial(index){
       this.itemsSelected.splice(0,index)
      },
      selectItemById(){
        this.$store.dispatch('production/ACTION_CHOOSE_ITEM',this.item)
      },
      selectMaterialById(){
        this.$store.dispatch('production/ACTION_SELECT_ONE_MATERIAL',this.materialSelected)
      },
      createPallet(){
        let validateQty = false
        let itemIdString ='',itemQtyString=''
        if (this.itemsSelected.length>0) {
         for (let i = 0; i < this.itemsSelected.length; i++) {
           const element = this.itemsSelected[i];
           if (element.quantity&&element.quantity>0) {
              validateQty = true 
              itemIdString+=element.id+','
              itemQtyString +=element.quantity+','
           }
         }
        }
        if (this.receipt) {
          this.validate =true
        }
        if (validateQty) {
          const sourceId = this.sourceSelect.value
          const destinationId = this.destinationSelect.value
          const itemId = itemIdString.slice(0,-1)
          const itemQty = itemQtyString.slice(0,-1)
          let data = {
            sourceId: sourceId,
            destinationId:destinationId,
            itemId:itemId,
            quantity:itemQty,
            productionOrdersId: this.prodOrder.value,
          }
          let eventLog = {
            eventName:'Tạo Pallet',
            timeStamp: new Date().toISOString(),
            status:0,
            palletCode:'????????',
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
              this.$q.notify({
                message:'Tạo pallet thành công !',
                color:'green',
              })
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