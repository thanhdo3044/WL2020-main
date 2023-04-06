<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title">
                      Cập nhật bảng giá
                  </div>
                  <div v-show="banggia.length>0" class="col-2" align="right">
                      <q-btn color="primary" icon="near_me" label="Gửi phê duyệt" @click="send" />
                  </div>
              </div>
          </q-card-section>
          <q-separator spaced    />
          <q-card-section>
              <div class="row">
                  <div class="col-6 q-pa-md">
                      <!-- form -->
                        <SelectBox :showClear="true" :searchColumn="'ma'" :valueExp="'ma'" :displayColumn="'ma'" :title="'Chọn mã sản phẩm :'" :dataSource="dmmasp" :onChange="chonMasp" />
                        <q-input v-model="currentPrice" :disable="true" type="text" label="Đơn giá hiện tại" />
                        <q-input ref="newPrice" v-model.number="newPrice" type="number" label="Đơn giá mới " />
                        <br>
                        <div align="right">
                            <q-btn color="primary"  label="Cập nhật" @click="add" />
                        </div>
                  </div>
                  <div class="col-6 q-pa-md">
                      <!-- table history -->
                      <DxDataGrid
                            :data-source="banggia"
                            :show-borders="true"
                        >
                    <DxColumn
                        data-field="maSP"
                        caption="Mã sản phẩm"
                    >
                    </DxColumn>
                     <DxColumn
                        data-field="oldPrice"
                        caption="Giá hiện tại"
                        format="fixedpoint"
                    >
                    </DxColumn>
                     <DxColumn
                        data-field="cost"
                        caption="Giá mới"
                        format="fixedpoint"
                    >
                    </DxColumn>
                        </DxDataGrid>
                  </div>
              </div>
          </q-card-section>
          <div> <b>Tạo mã cho qui cách 2 giá </b></div>
           <q-card-section>
                        <div class="row q-pa-sm">                          
                            <div class="col-12 col-sm-4 q-pa-sm">
                                <q-input v-model="day" type="text" label="Dày" />
                            </div>
                            <div class="col-12 col-sm-4 q-pa-sm">
                                <q-input v-model="rong" type="text" label="Rộng" />
                            </div>
                            <div class="col-12 col-sm-4 q-pa-sm">
                                <q-input v-model="dai" type="text" label="Dài" />
                            </div>
                           
                        </div>
                    </q-card-section>
          <q-card-section >
                        <DxDataGrid
                            id="gridContainer"
                            :data-source="dataSource"
                            :allow-column-reordering="true"
                            :show-borders="true"
                            key-expr="ID"
                            >
                            <DxEditing
                                :allow-updating="true"
                                :allow-deleting="true"
                                :allow-adding="true"
                                mode="row"
                            />
                            <DxColumn data-field="masp" caption="Mã Giá sản phẩm"/>
                            
                            </DxDataGrid>
                    </q-card-section>
                       <q-card-actions align="right">
                        <q-btn flat label="Hủy" color="primary" v-close-popup />
                        <q-btn flat label="Đồng ý" @click="addQuiCach" color="primary" v-close-popup />
                    </q-card-actions>
      </q-card>
  </q-page>
</template>

<script>
import SelectBox from '../../../components/commons/SelectBoxInt'
import { showLoadingIos, closeLoading,generateUUID, formatDateISO, showNotifySuccess } from '../../../ultils'
import { DxDataGrid, DxColumn, DxEditing, DxPaging, DxLookup } from 'devextreme-vue/data-grid';
export default {
    components:{
        SelectBox,
        DxDataGrid, DxColumn, DxEditing, DxPaging, DxLookup
    },
    data(){
        return {
            dataHistory:[],
            masp:null,
            day:null,
            rong:null,
            dai:null,
            code:"",
            dataSource:[],
            dmmasp:[],
            banggia:[],
            currentPrice:'',
            newPrice:'',
            
        }
    },
    created(){
        Promise.all([this.loadNLG()])
        
    },
    methods:{
        async send(){
          for(let i=0;i<this.banggia.length;i++)
          {
            const uuid = generateUUID()
            const payload = {
                no:uuid,
                createdBy:this.$store.state.base.userInfo.account,
                approval:'P',
                DEL_FLAG:'N',

            }
            const data = await this.$store.dispatch('nlg/ADD_REQ_COST',payload)
            if (data.meta.success) {
                
                     this.banggia[i].reqNo = uuid
                    const payloadPrice = this.banggia[i]
                    await this.$store.dispatch('nlg/ADD_BANG_GIA',payloadPrice)
                }
              
            
                }
                
                 showNotifySuccess()
                 this.$router.go(-1)
        },
        add(){
            if (this.masp&&this.newPrice) {
                const payload = {
                    maSP:this.masp,
                    cost:this.newPrice,
                    createdBy:this.$store.state.base.userInfo.account,
                    useFLAG:'P',
                    time:new Date(),
                    oldPrice:this.currentPrice,
                    createBy:this.$store.state.base.userInfo.account,
                    modifyDate:formatDateISO(new Date())
                }
                this.banggia.push(payload)
                this.masp = null
                this.newPrice = ''
                this.oldPrice = ''
                
            }
            
        },
          async addQuiCach(){
            
            if (this.day&&this.rong&&this.dai
           
            ) { this.code = this.day+''+this.rong+''+this.dai
                const volumn = parseFloat(this.day)*parseFloat(this.rong)*parseFloat(this.dai)*Math.pow(10,-9)
                const payload = {
                    code:this.code,
                  
                    day:this.day,
                    rong:this.rong,
                    dai:this.dai,
                 
                    
                    dataPrice:this.dataSource,
                    uid:this.$store.state.base.userInfo.account
                }
                const data = await this.$store.dispatch('nlg/ADD_QUI_CACH_GIA',payload)
                if (data.meta.success) {
                    showNotifySuccess()
                 this.day = null; this.rong = null; this.dai = null;
                 this.dataSource = []
                    this.loadNLG()
                } else {
                    showNotifyError()
                }
            }else{
                showNotifyValidate()
            }
            
        },
        async loadNLG(){
            const data = await this.$store.dispatch('nlg/GET_NLG')
            this.dmmasp = data.data
        },
        async loadDetail(masp){
            showLoadingIos()
            const data = await this.$store.dispatch('nlg/GET_BANG_GIA',masp)
            closeLoading()
            const priceData = data.data.find(r=>{return r.useFLAG.toString().trim()==='Y'})
            if (priceData) {
                this.currentPrice = priceData.cost
            }else{
                this.currentPrice='0'
            }
        },
        chonMasp(e){
            this.masp = e.value
            if (e.value) {
                this.loadDetail(e.value)
            }
            this.$refs.newPrice.focus()
        }
    }
}
</script>

<style>

</style>