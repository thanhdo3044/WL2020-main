<template>

  <q-page class="q-pa-md">
    <q-banner class="text-primary">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div class="text-h6 q-mt-lg">Tạo phiếu chỉ định cấp gỗ - {{ idDepartment.label }}</div>
    </q-banner>
<div class="row">
          <q-select
            class="col-2 q-ml-sm"
            @input="loadGrid"
            outlined
            label-color="orange"
            v-model="idDepartment"
            :options="options"
            label="Chọn nhà máy"
          />
          <q-input
            class="col-2 q-ml-sm"
            @input="loadGrid"
            outlined
            label-color="orange"
            v-model.number="year"
            type="number"
            label="Năm"
          />
          <q-input
            class="col-2 q-ml-sm"
            @input="loadGrid"
            outlined
            label-color="orange"
            v-model.number="week"
            type="number"
            label="Tuần"
          />
          
          <q-select label-color="orange" class="col-2 q-mb-sm q-ml-sm" @input="loadHistory" outlined v-model="number" :options="listNumber" label="Lệnh sản xuất" />
</div>
          <q-card-section>
        <!-- <div class="row">
          <div class="col-10 top-title">
            Phê duyệt hệ số cấp gỗ
          </div> -->
          <q-btn
            color="primary"
            icon="assignment_return"
            :disable="!showEdit"
            label="Tạo phiếu chỉ định"
            @click="confirmTrave = true"
          />
            &emsp; 
           &emsp; 
            &emsp; 
          <q-btn
            color="primary"
            icon="assignment_return"
            :disable="!showEdit"
            label="Bổ sung phiếu chỉ định"
            @click="bosung"
          />
        <!-- </div> -->
       
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
                  :word-wrap-enabled="true"
                :data-source="historys"
                :show-borders="true"
                :show-column-lines="true"
                 :show-row-lines="true"
                :allow-column-resizing="true"
             
                   
          :selection="{ mode: 'multiple' }"
          @selection-changed="onSelectionChanged"
            >
            <DxEditing 
        :allow-updating="true"
        :allow-deleting="false" mode="cell" />
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
 <DxScrolling mode="infinite" />
            <DxGroupPanel :visible="true"/>
            <DxGrouping :auto-expand-all="true"/>
         
           
        <DxColumn
                data-field="paren"
                caption="Sẩn phảm"
                :group-index="0"
            />
          <DxColumn
                data-field="tensp"
                caption="Chi tiết"
                  width="350"
                 
            />
            <DxColumn
                data-field="NAME"
                caption="Nhóm Qui Cách"
                  width="180"
            >
                
            </DxColumn>
             <DxColumn
                data-field="PHOI"
                caption="Phôi thô/Phôi 4M"
                  width="120"
                   alignment="center"
            >
              <DxLookup
                    :data-source="phoi"
                    display-expr="name"
                   value-expr="code"
                    
                    />    
            </DxColumn>
             <DxColumn
                data-field="keHoach"
                caption="Nhu cầu m3"
                 alignment="center"
                format="#,##0.####"
                  width="150"
                    :visible="false"
                :calculate-cell-value="calculateM3"
            />
             <DxColumn
                data-field="keHoachT"
                caption="Nhu cầu cần"
                 alignment="center"
                format="#,##0.####"
                  width="150"
            />
              <DxColumn
                data-field="DVT"
                caption="Đơn vị tính"
                 alignment="center"
                
                  width="150"
                  :calculate-cell-value="calculateDVT"
            />
             <DxColumn
                data-field="HESO"
                caption="Hệ số"
                 alignment="center"
                  width="100"
                 
            />
             <DxColumn
                data-field="klc"
                caption="KL cấp"
                 alignment="center"
                format="#,##0.####"
                  width="120"
                :calculate-cell-value="calculateTongThanh"
            />
              <DxColumn
                caption="Tồn lựa phôi"
                alignment="center"
            >
              <DxColumn
                caption="TH"
                data-field="TONTH"
                format="#,##0.####"
                alignment="center"
                width="80"
              />
              <DxColumn
                caption="TB"
                data-field="TB"
              format="#,##0.####"
                alignment="center"
                width="80"
              >
               <DxColumn
                caption="Lựa"
                data-field="TONTTB"
              format="#,##0.####"
                alignment="center"
                width="80"
              />
               <DxColumn
                caption="ĐẠT"
                data-field="TONLTTB"
              format="#,##0.####"
                alignment="center"
                width="80"
              />
               </DxColumn>
              <DxColumn
                caption="YS"
                data-field="YS"
               format="#,##0.####"
                alignment="center"
                width="80"
              >
               <DxColumn
                caption="Lựa"
                data-field="TONTYS"
              format="#,##0.####"
                alignment="center"
                width="80"
              />
               <DxColumn
                caption="ĐẠT"
                data-field="TONLTYS"
              format="#,##0.####"
                alignment="center"
                width="80"
              />
              </DxColumn>
             </DxColumn>
             <DxColumn
                data-field="GHICHU"
                caption="Ghi chú"
            />

              <DxColumn
                data-field="BX"
                caption="Bổ sung phiếu lần"
            />
              <DxColumn
                data-field="MALOGO"
                caption="Mã lô gỗ"
            />
             <!-- <DxColumn
                data-field="trangthai"
                caption="Trạng thái"
            > -->
             <!-- <DxLookup
                    :data-source="trangthai"
                    display-expr="name"
                   value-expr="code"
                    
                    /> -->
             <!-- </DxColumn> -->
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
              Xác nhận tạo phiếu chỉ định
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
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
  roundNumber,
  getWeekNumber,
  showLoadingIos,
  closeLoading,
} from "../../../ultils";
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
            listNumber:[],
             options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102299,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102299,
          code: "TB",
        },
      ],
            mydsncc:[],
            chuyen_thang:null,
            chuyen_nam:null,
            dsNCC:[],
              confirmTrave: false,
            nhomquicachs:[],
            nhomkhos:[],
            ncc:null,
            week:"",
                year: null,
            dupplicateNcc:[],
            nhomqc:null,
            nhomkho:null,
            slkh:0,
            number:"",
            showEdit: false,
             dataTrave: [],
            fix:null,
            nhap_year:null,
            nhap_month:null,
            thangs:thangs,
            nams:nams,
             idDepartment:  {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
            history_thang:null,
            history_nam:null,
            historys:[],
            congdoans:[],
            items:[],
                 phoi:[
                {code:'phoitho',name:'Phôi thô'},
                  {code:'phoi2M',name:'Phôi 2M'},
                 {code:'phoi4M',name:'Phôi 4M'},
                   {code:'CXL',name:'Phôi CXL'}
            ],
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
          this.year = currentYear;
              this.week = getWeekNumber(today);
        this.nhap_year = currentYear
        this.chuyen_nam = currentYear
        this.history_nam = currentYear
        Promise.all([this.loadGroupQuiCach(),this.loadItem()])
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
          console.log('LSX:',this.number)
        
             const payload = {
     
        number: this.number,
         factoryId: this.fa,
        
       
      };
           const data = await this.$store.dispatch('nlg/GET_HE_SO_CAP_GO_THANH',payload)
          
            this.historys = data.data
               
           
        },
           async pheduyet() {
              const payload = {
     
        number: this.number,
        
       
      };
           const data1 = await this.$store.dispatch('nlg/GET_PHIEU_CHI_DINH',payload)
           console.log('',data1.data)
             if (data1.data.length >0) {
   this.$q.dialog({
          html: true,
          title: "Tạo phiếu chỉ định",
          message:"bạn đã tạo phiếu chỉ định cho LSX: " + this.number + " rồi"
            
        });
      
             } 
      else  {
                const payload = {
      number: this.number,
      week: this.week,
          year: this.year,
        factoryId: this.fa,
      createBy:this.$store.state.base.userInfo.id,
        dataDelai: this.dataTrave,
      
       
       
      };
                   const data = await this.$store.dispatch("nlg/PHE_DUYET", payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.$router.push("/nlg-phieu-chi-dinh/");
     
      } else {
        showNotifyError();
      }
             }
    },
     async bosung() {
             
                const payload = {
      number: this.number,
      week: this.week,
          year: this.year,
        factoryId: this.fa,
      createBy:this.$store.state.base.userInfo.id,
        dataDelai: this.dataTrave,
      
       
       
      };
                   const data = await this.$store.dispatch("nlg/PHE_DUYET", payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.$router.push("/nlg-phieu-chi-dinh/");
     
      } else {
        showNotifyError();
      }
             
    },
           onSelectionChanged({ selectedRowsData }) {
      this.idSelect = selectedRowsData[0].ID;
      this.showEdit = true;
      this.dataTrave = selectedRowsData;
      console.log('nhóm:',this.dataTrave)
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
        async loadGrid() {
          this.listNumber = []
      if (this.idDepartment.code == "TH") this.fa = 100000;
      if (this.idDepartment.code == "YS1A") this.fa = 100003;
      if (this.idDepartment.code == "YS1B") this.fa = 100004;
      if (this.idDepartment.code == "TB") this.fa = 100005;
      const payload = {
        week: this.week ,
        year: this.year,
        factoryId: this.fa,
   
      };
     
   
      // let dataPivort = [];
      const data = await this.$store.dispatch("prod/GET_HE_SO_LSX", payload);
         data.data.forEach((element) => {
       
            this.listNumber.push(element.number);
         });
       
           
        },
            calculateTongThanh(rowData) {
             
      rowData.klc =  rowData.keHoachT*rowData.HESO;
        rowData.keHoach =  rowData.keHoachT*rowData.VOLUMN;
       return rowData.klc ;
  },
  //          calculateM3(rowData) {
             
  //     rowData.keHoach =  rowData.keHoachT*rowData.VOLUMN;
    
  //      return rowData.keHoach ;
  // },
  calculateDVT(rowData) {
             
      rowData.DVT = 'T'
    
       return rowData.DVT ;
  },
  // calculateHESO(rowData) {
             
  //     rowData.HESO = 1
    
  //      return rowData.HESO ;
  // },
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
/* .dx-group-cell{
  border: 1px solid !important;
}
tr,
th,
td {
  border-bottom: 1px solid black;
}

.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
    color: rgb(0 0 0 / 87%);
    background-color: #f7f7f7;
}
.dx-datagrid-rowsview .dx-row.dx-group-row:first-child {
    color: black;
    border-bottom: 1px solid !important;
} */
/* .mau {
     border: 1px solid !important;
     background-color: white;
  color: black;
} */
</style>
