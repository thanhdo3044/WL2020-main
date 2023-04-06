<template>
  <q-page class="q-pa-md">
          <q-card-section>
        <div class="row">
          <div class="col-10 top-title">
            Phê duyệt hệ số cấp gỗ
          </div>
          <q-btn
            color="primary"
            icon="assignment_return"
            :disable="!showEdit"
            label="Phê duyệt"
            @click="confirmTrave = true"
          />
        
        </div>
       
      </q-card-section>
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
              </q-card-section> -->
              <q-card-section>
                  <DxDataGrid
                :data-source="historys"
                :show-borders="true"
                :show-column-lines="true"
                :allow-column-resizing="true"
                 @row-removed="del"
                  @row-updated="update"
                   key-expr="ID"
          :selection="{ mode: 'multiple' }"
          @selection-changed="onSelectionChanged"
            >
            <DxEditing 
        :allow-updating="false"
        :allow-deleting="false" mode="popup" />
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'hệ số cấp gỗ'"
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
                data-field="tensp"
                caption="Sẩn phảm/Chi tiết"
            />
       
            <DxColumn
                data-field="NAME"
                caption="Nhóm Qui Cách"
            >
                
            </DxColumn>
            <DxColumn
                data-field="HESO"
                caption="Hệ số"
            />
              <DxColumn
                data-field="APPLY_DATE"
                caption="Ngày áp dụng"
            />
             <DxColumn
                data-field="trangthai"
                caption="Trạng thái"
            >
             <!-- <DxLookup
                    :data-source="trangthai"
                    display-expr="name"
                   value-expr="code"
                    
                    /> -->
             </DxColumn>
             <!-- <DxSummary>
                <DxGroupItem
                :show-in-group-footer="false"
                :align-by-column="true"
                column="HESO"
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
            </DxSummary> -->
            </DxDataGrid>
              </q-card-section>
          </q-card>
      </div>
       <q-dialog v-model="confirmTrave" persistent>
      <q-card style="min-width:400px">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title">
              Xác nhận phê duyệt hệ số cấp gỗ
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="pheduyet"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
            mydsncc:[],
            chuyen_thang:null,
            chuyen_nam:null,
            dsNCC:[],
              confirmTrave: false,
            nhomquicachs:[],
            nhomkhos:[],
            ncc:null,
            dupplicateNcc:[],
            nhomqc:null,
            nhomkho:null,
            slkh:0,
            showEdit: false,
             dataTrave: [],
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
             trangthai:[
                {code:null,name:'chưa duyệt'},
                 {code:!null,name:'đã duyệt'}
            ],
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
        Promise.all([this.loadGroupQuiCach(),this.loadHistory(),this.loadItem()])
      // console.log(this.$store.state.base.userInfo.account)
     
    },
    methods:{
    
        async addPlan(){
            if (this.nhomqc) {
                const payload = {
                  
                  groupCode:this.nhomqc,
                  
                  //  month:this.nhap_month,
                  //  year:this.nhap_year,
                   ITEM_ID:this.item.value,
                    HESO:this.slkh,
                    createBy:this.$store.state.base.userInfo.account
                    
                }
                const data = await this.$store.dispatch('nlg/ADD_HE_SO',payload)
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
            this.loadHistory();
        },
        async loadHistory(){
        
            
           const data = await this.$store.dispatch('nlg/GET_HE_SO_CAP_GO')
          
            this.historys = data.data
               
           
        },
           async pheduyet() {
             
                const payload = {
     
        dataDelai: this.dataTrave,
      
       
       
      };
                   const data = await this.$store.dispatch("nlg/PHE_DUYET", payload);
      if (data.meta.success) {
        showNotifySuccess();
       this.loadHistory();
     
      } else {
        showNotifyError();
      }
    },
           onSelectionChanged({ selectedRowsData }) {
      this.idSelect = selectedRowsData[0].ID;
      this.showEdit = true;
      this.dataTrave = selectedRowsData;
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
    //     async loadkho(){
    //        const duppp = []
    //          const data = await this.$store.dispatch("production/ACTION_FETCH_ITEMS", {
    //     factoryId: 100000,
    //   });
    //         data.forEach(e=>{
    //             this.nhomkhos.push({
    //                 value: e.name3 = e.name,
                
    //             })
    //         })
        
          
             
           
    //     },
         async loadItem() {
      const data = await this.$store.dispatch("production/ACTION_FETCH_ITEMS", {
        factoryId: 100000,
      });
      data.forEach((d) => {
        const itemNameConvert = `[${d.code}] ${d.name} (${d.height}*${d.width}*${d.length})`;
        this.items.push({
          label: itemNameConvert,
          value: d.id,
          unit: d.unit,
        });
      });
      this.itemDupplicate = this.items;
    },
       searchItem(val, update) {
      let itemDupplicate = [];
      if (val === "") {
        update(() => {
          this.items = this.itemDupplicate;
        });
        return;
      }
        update(() => {
        const needle = val.toLowerCase();
        this.items = this.itemDupplicate.filter((v) => {
          const quicach = v.label.toString().toLowerCase();
          if (quicach.indexOf(needle) > -1) {
            return v;
          }
        });
      });
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