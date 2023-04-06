<template>
  <q-page class="q-pa-md">
      <div class="row">
          <div class="col-12 col-sm-6 q-pa-md" >
              <q-card class="my-card">
                  <q-card-section>
                      <div class="top-title">
                          Nhập kế hoạch gỗ từng kho
                      </div>
                  </q-card-section>
                  <q-separator spaced    />
                  <q-card-section>
                      <div class="form">
                          <div class="row">
                              <div class="col-12">
                                  <SelectThang :dataSource="thangs" :onChange="chonThang" :title="'Chọn Tháng'" :defaultValue="nhap_month"/>
                                  <SelectThang :dataSource="nams" :onChange="chonNam" :title="'Chọn Năm'" :defaultValue="nhap_year"/>
                              </div>
                          </div>
                        <div class="dx-fieldset">
                            <SelectBox :searchColumn="'name4'" :displayColumn="'name4'" :dataSource="nhomquicachs" :onChange="chonNhomQuiCach"
                             :title="'Chọn nhóm quy cách'" :defaultValue="nhomqc" />
                             <SelectBox :searchColumn="'name3'" :displayColumn="'name3'" :dataSource="nhomkhos" :onChange="chonNhomkho"
                             :title="'Chọn Kho'" :valueExp="'makho'" />
                            
                            <div class="dx-field">
                                <div class="dx-field-label">Số lượng kế hoạch</div>
                                <div class="dx-field-value">
                                    <DxNumberBox
                                        :value="slkh"
                                        :show-spin-buttons="true"
                                        :show-clear-button="true"
                                        @value-changed="changeslkh"
                                    />
                                </div>
                            </div>
                              <div class="dx-field">
                                <div class="dx-field-label">FIX</div>
                                <div class="dx-field-value">
                                    <DxNumberBox
                                        :value="fix"
                                        :show-spin-buttons="true"
                                        :show-clear-button="true"
                                        @value-changed="changesfix"
                                    />
                                </div>
                            </div>
                             <div class="row" >
                                <div class="col-12" align="right">
                                    <q-btn color="primary" label="Nhập kế hoạch" @click="addPlan" />
                                </div>
                            </div>
                        </div>
                      </div>
                  </q-card-section>
              </q-card>
          </div>
         
      </div>
      <div class="row q-mt-md">
          <q-card class="my-card">
              <q-card-section>
                 <div class="top-title">
                     Lịch sử nhập
                 </div>
              </q-card-section>
              <q-card-section>
                  <div class="row">
                      <div class="col-6 q-pa-md">
                        <SelectThang :dataSource="thangs" :onChange="chonThangHistory" :title="'Chọn Tháng'" :defaultValue="history_thang"/>
                      </div>
                      <div class="col-6  q-pa-md">
                          <SelectThang :dataSource="nams" :onChange="chonNamHistory" :title="'Chọn Năm'" :defaultValue="history_nam"/>
                      </div>
                  </div>
              </q-card-section>
              <q-card-section>
                  <DxDataGrid
                :data-source="historys"
                :show-borders="true"
                :show-column-lines="true"
                :allow-column-resizing="true"
                 @row-removed="del"
                  @row-updated="update"
            >
            <DxEditing 
        :allow-updating="true"
        :allow-deleting="true" mode="popup" />
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Lịch sử nhập kế hoạch'"
            />
            
            <DxSearchPanel
                :visible="true"
                :width="340"
                placeholder="Tìm kiếm"
            />
            <DxHeaderFilter :visible="true"/>
            <DxFilterRow :visible="false"/>

            <DxGroupPanel :visible="true"/>
            <DxGrouping :auto-expand-all="true"/>
         
             <DxColumn
                data-field="MAKHO"
                caption="Kho"
                :group-index="0"
            
            >
        
            </DxColumn>
            <DxColumn
                data-field="NAME"
                caption="Nhóm Qui Cách"
            >
                
            </DxColumn>
            <DxColumn
                data-field="PLANQTY"
                caption="Khối lượng"
            />
            <DxColumn
                data-field="FIX"
                caption="FIX khối lượng kho"
                :width="80"
            />
             <DxSummary>
                <DxGroupItem
                :show-in-group-footer="false"
                :align-by-column="true"
                column="PLANQTY"
                summary-type="sum"
                value-format="#,##0.####"
                display-format="{0} m³"
                />
            
              <DxTotalItem
                column="PLANQTY"
                summary-type="sum"
                value-format="###0.####"
                display-format="{0}"
              />
            </DxSummary>
            </DxDataGrid>
              </q-card-section>
          </q-card>
      </div>
  </q-page>
</template>

<script>
import { DxNumberBox } from 'devextreme-vue/number-box';
import SelectBox from '../../../components/commons/SelectBoxInt'
import SelectNcc from '../../../components/NLG/SelectBoxNcc'
import SelectNhomQuiCach from '../../../components/commons/SelectBoxInt'
import SelectThang from '../../../components/commons/SelectBoxInt'
import SelectNam from '../../../components/commons/SelectBoxInt'
import { showNotifySuccess, showNotifyError, showNotifyValidate,thangs,nams } from '../../../ultils';
import {DxDataGrid,DxGrouping,DxGroupPanel,DxSummary,DxGroupItem, DxEditing,
DxExport,DxHeaderFilter,DxColumn,DxScrolling,DxFilterRow,DxSearchPanel,DxLookup} from 'devextreme-vue/data-grid';
export default {
    components:{
        SelectNcc,
        SelectBox,
        SelectNhomQuiCach,
        DxNumberBox,
        SelectThang,
        SelectNam,
         DxEditing,
        DxDataGrid,DxGrouping,DxGroupPanel,
        DxSummary,DxGroupItem,
        DxExport,DxHeaderFilter,DxScrolling,
        DxFilterRow,DxSearchPanel,
        DxLookup,DxColumn
    },
    data(){
        return {
            chuyen_slkh:0,
            chuyen_nhomqc:null,
            chuyen_ncc:null,
            nhan_ncc:null,
            khconlai:0,
            id:0,
            mydhistory_thangsncc:[],
            chuyen_thang:null,
            chuyen_nam:null,
            dsNCC:[],
            nhomquicachs:[],
            nhomkhos:[],
            ncc:null,
            dupplicateNcc:[],
            nhomqc:null,
            nhomkho:null,
            slkh:0,
            fix:null,
            nhap_year:null,
            nhap_month:null,
            thangs:thangs,
            nams:nams,
            history_thang:null,
            history_nam:null,
            historys:[],
            congdoans:[],
            items:[],
            congdoan:null,
            item:null,
            sl:0,
            chonkhochuyen:null,
            dataSource: [],
            showLeave:false,
            answer:false
            
        }
    },
    created(){
        const today = new Date()
        const currentMonth = today.getMonth()
        this.nhap_month = currentMonth+1
        this.chuyen_thang = this.nhap_month
        this.history_thang = currentMonth+1
        const currentYear = today.getFullYear()
        this.nhap_year = currentYear
        this.chuyen_nam = currentYear
        this.history_nam = currentYear
        Promise.all([this.loadGroupQuiCach(),this.loadHistory(),this.loadkho()])
      // console.log(this.$store.state.base.userInfo.account)
     
    },
    methods:{
    
        async addPlan(){
            if (this.nhomqc) {
                const payload = {
                  
                  groupCode:this.nhomqc,
                  kho: this.chonkho.trim(),
                  //  month:this.nhap_month,
                  //  year:this.nhap_year,
                  FIX: this.fix,
                    quantity:this.slkh,
                    createBy:this.$store.state.base.userInfo.account
                    
                }
                const data = await this.$store.dispatch('nlg/ADD_DINH_MUC_KHO',payload)
                if (data.meta.success) {
                    
                    await this.loadHistory()
                    showNotifySuccess()
                    this.slkh = 0
                }else{
                    showNotifyError()
                }
            }else{
                showNotifyValidate()
            }
        },
        async loadHistory(){
        let payload = {
            thang:this.history_thang,
            nam:this.history_nam
        }
            
           const data = await this.$store.dispatch('nlg/GET_DINH_MUC_KHO',payload)
          
            this.historys = data.data
               
           
        },
        // async loadNhaCungCap(){
        //    const data = await this.$store.dispatch('nlg/GET_DS_NHA_CUNG_CAP')
        //         let converrtData = []
        //         data.data.forEach(element => {
                   
        //            element.name2 =  element.name
        //             converrtData.push(element)
        //         })
        //         this.dsNCC = converrtData
            
        // },
          async del(e) {
              console.log('ID:',e.data.ID)
      const payload = {
        id: e.data.ID

        
      };
      const data3 = await this.$store.dispatch("nlg/PUT_DINH_MUC_KHO", payload);
      if (data.meta.success) {
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
      async update(e){
            console.log(e.data)
        const    payload = {
            ID:e.data.ID,
            
            quantity: e.data.PLANQTY,
          
            FIX:e.data.FIX
            }
            const data = await this.$store.dispatch('nlg/UPDATE_KHO',payload)
            // console.log(e)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
        async loadGroupQuiCach(){
           const duppp = []
           const data = await this.$store.dispatch('nlg/GET_GROUP_QUI_CACH')
            data.data.forEach(e=>{
                duppp.push({
                   // text: e.name,
                    value: e.name4 = e.name
                })
            })
           this.dupplicateNcc = duppp
          
              this.nhomquicachs = data.data
          
        },
        async loadkho(){
           const duppp = []
           const data = await this.$store.dispatch('nlg/GET_DS_KHO')
            data.data.forEach(e=>{
                duppp.push({
                    text: e.name3 = e.tenkho,
                   value: e.makho
                })
            })
           this.dupplicateNcc = duppp
          
              this.nhomkhos = data.data
           
        },
       
        chonNhomQuiCach(e){
            this.nhomqc = e.value
        },
        chonNhomkho(e){
            
            this.chonkho = e.value
        },
        changeslkh(e){
            this.slkh = e.value
        },
        changesfix(e){
            this.fix = e.value
        },
        chonNam(e){
            this.nhap_year = e.value
        },
        chonThang(e){
            this.nhap_month =e.value
        },
      
       
        chonNamHistory(e){
            this.history_nam = e.value
            this.loadHistory()
        },
        chonThangHistory(e){
            this.history_thang = e.value
            this.loadHistory()
        },
       
      
       
       
    },
    
}
</script>

<style>

</style>