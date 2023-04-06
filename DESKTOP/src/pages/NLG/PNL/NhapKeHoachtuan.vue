<template>
  <q-page class="q-pa-md">
      <div class="row">
          <div class="col-12 col-sm-6 q-pa-md" >
              <q-card class="my-card">
                  <q-card-section>
                      <div class="top-title">
                          Nhập kế hoạch tuần
                      </div>
                  </q-card-section>
                  <q-separator spaced    />
                  <q-card-section>
                      <div class="form">
                          <div class="row">
                              <div class="col-12">
                                 
        <q-input
            color="grey-3"
            label-color="orange"
            outlined
            v-model="ngaynhapkho"
            mask="date"
            :rules="['date']"
            label="Ngày trong tuần"
            dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="ngaynhapkho"
                    @input="() => $refs.qDateProxy.hide()"
                    mask="YYYY-MM-DD"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
             <q-input
            color="grey-3"
            label-color="orange"
            outlined
            disable
            :value="ngaynhapkho ? moment(ngaynhapkho).format('w') : ''"
            label="Tuần"
            dense
          >
            <template v-slot:append>
              <q-icon name="next_week" color="orange" />
            </template>
          </q-input>
                              </div>
                          </div>
                        <div class="dx-fieldset">
                            <SelectBox :searchColumn="'name4'" :displayColumn="'name4'" :dataSource="nhomquicachs" :onChange="chonNhomQuiCach"
                             :title="'Chọn nhóm quy cách'" :defaultValue="nhomqc" />
                             <SelectNcc :searchColumn="'name2'" :displayColumn="'name2'" :dataSource="dsNCC" :onChange="chonNcc" :title="'Chọn nha NCC:'" />
                            
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
              <!-- <q-card-section>
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
            >
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
              </q-card-section> -->
          </q-card>
      </div>
  </q-page>
</template>

<script>
import moment from "moment";
import { DxNumberBox } from 'devextreme-vue/number-box';
import SelectBox from '../../../components/commons/SelectBoxInt'
import SelectNcc from '../../../components/NLG/SelectBoxNcc'
import SelectNhomQuiCach from '../../../components/commons/SelectBoxInt'
import SelectThang from '../../../components/commons/SelectBoxInt'
import SelectNam from '../../../components/commons/SelectBoxInt'
import DateBoxNgayNhapKho from "../../../components/NLG/DateBoxNgayNhapKho";
import { formatDateISO,showNotifySuccess, showNotifyError, showNotifyValidate,thangs,nams } from '../../../ultils';
import {DxDataGrid,DxGrouping,DxGroupPanel,DxSummary,DxGroupItem,
DxExport,DxHeaderFilter,DxColumn,DxScrolling,DxFilterRow,DxSearchPanel,DxLookup} from 'devextreme-vue/data-grid';
export default {
    components:{
        SelectNcc,
        SelectBox,
        SelectNhomQuiCach,
        DxNumberBox,
        SelectThang,
        SelectNam,
        DateBoxNgayNhapKho,
        DxDataGrid,DxGrouping,DxGroupPanel,
        DxSummary,DxGroupItem,
        DxExport,DxHeaderFilter,DxScrolling,
        DxFilterRow,DxSearchPanel,
        DxLookup,DxColumn
    },
    data(){
        return {
            ngaynhapkho: moment()
      .format()
      .slice(0, 10),
            chuyen_slkh:0,
            chuyen_nhomqc:null,
            chuyen_ncc:null,
            nhan_ncc:null,
            khconlai:0,
            id:0,
            mydsncc:[],
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
           
    this.week = today ? moment(today).format('w') : '';
        this.chuyen_thang = this.nhap_month
        this.history_thang = currentMonth+1
        const currentYear = today.getFullYear()
        this.nhap_year = currentYear
        this.chuyen_nam = currentYear
        this.history_nam = currentYear
        Promise.all([this.loadNhaCungCap(),this.loadGroupQuiCach(),this.loadkho()])
      // console.log(this.$store.state.base.userInfo.account)
     
    },
    methods:{
    
        async addPlan(){
            console.log('nhập tuàn:',this.nhomqc)
            if (this.nhomqc) {
                const payload = {
                  mancc:this.ncc,
                  groupCode:this.nhomqc,
                 // kho: this.chonkho.trim(),
                  //  month:this.nhap_month,
                  //  year:this.nhap_year,
                    quantity:this.slkh,
                   createDate: formatDateISO(this.ngaynhapkho),
                    createBy:this.$store.state.base.userInfo.account
                    
                }
                const data = await this.$store.dispatch('nlg/ADD_KE_HOACH_TUAN',payload)
                if (data.meta.success) {
                    
                   // await this.loadHistory()
                    showNotifySuccess()
                    this.slkh = 0
                }else{
                    showNotifyError()
                }
            }else{
                showNotifyValidate()
            }
        },
    //      eventChangeNgayNhapKho(e) {
    //   console.log(e);
    //   this.f_ngaynhapkho = e.value;
    //  this.week = this.f_ngaynhapkho ? moment(this.f_ngaynhapkho).format("w") : "";
    // },
        // async loadHistory(){
        
            
        //    const data = await this.$store.dispatch('nlg/GET_DINH_MUC_KHO')
          
        //     this.historys = data.data
               
           
        // },
        async loadNhaCungCap(){
           const data = await this.$store.dispatch('nlg/GET_DS_NHA_CUNG_CAP')
                let converrtData = []
                data.data.forEach(element => {
                   
                   element.name2 =  element.name
                    converrtData.push(element)
                })
                this.dsNCC = converrtData
            
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
        chonNam(e){
            this.nhap_year = e.value
        },
        chonThang(e){
            this.nhap_month =e.value
        },
       chonNcc(e){
            
            this.ncc = e.value
        },
       
        // chonNamHistory(e){
        //     this.history_nam = e.value
        //     this.loadHistory()
        // },
        // chonThangHistory(e){
        //     this.history_thang = e.value
        //     this.loadHistory()
        // },
       
      
       
       
    },
    
}
</script>

<style>

</style>