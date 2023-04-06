<template>

  <q-page class="q-pa-md">
  
<div class="row print-hide" >
          <q-input
            class="col-2 q-ml-sm"
            @input="loadGrid"
            outlined
            v-model.number="year"
            type="number"
            label="Năm"
          />
          <q-input
            class="col-2 q-ml-sm"
            @input="loadGrid"
            outlined
            v-model.number="week"
            type="number"
            label="Tuần"
          />
          <q-select
            class="col-2 q-ml-sm"
            @input="loadGrid"
            outlined
            v-model="idDepartment"
            :options="options"
            label="Chọn nhà máy"
          />
          <q-select class="col-2 q-mb-sm q-ml-sm" @input="loadHistory" outlined v-model="number" :options="listNumber" label="Lệnh sản xuất" />
          &emsp; 
           &emsp; 
            &emsp; 
          <q-btn v-if="$store.state.base.userInfo.id == 101674 || $store.state.base.userInfo.id  == 100400"
            color="primary"
            icon="assignment_return"
           :disable="!showEdit"
            label="Phê duyệt"
            @click="confirmTrave = true"
          />
          &emsp; 
           &emsp; 
            &emsp; 
             &emsp; 
              &emsp; 
           <q-btn v-if="$store.state.base.userInfo.id == 101674 || $store.state.base.userInfo.id  == 100400 || $store.state.base.userInfo.id  == 101750 || $store.state.base.userInfo.id == 101976"
            color="red"
            icon="assignment_return"
           :disable="!showEdit"
            label="Từ chối"
            @click="confirmphieu = true"
          />
              <q-btn 
            color="red"
            icon="assignment_return"
            :disable="!showEdit1"
            label="Phiếu chỉ định bổ sung"
            @click="duyetbs"
          />
           <q-select v-if="solan" class="col-2 q-mb-sm q-ml-sm" @input="duyetbs" outlined v-model="lan" :options="listlan" label="Lần bổ sung" />
</div>

<q-card class="my-card">
    
        <table id="tableHead" width="100%">
            <thead class="w-100">
              <tr >
                  <td style="border-right-style: none">
                      <img style="margin:0px"
                          src="https://app.woodsland.com.vn:2002/img/logo.06aa324e.png"
                          alt="Graphic1"
                          width="100"
                          height="80"
                          data-cke-widget-upcasted="1"
                          data-cke-widget-keep-attr="0"
                          data-widget="image"
                          class="cke_widget_element p-2"
                        />
                  </td>
                <td colspan="3" class="text-center" style="border-left-style: none">
                    
                    <span class="p-2">SỔ TAY COC</span></td>
                <td  class="text-right" rowspan="2" colspan="2">
                  <pre>
                  BM-COC-16
                  Ngày BH: 29/9/2016
                  Lần BH: 03
                </pre
                  >
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  <strong>
                    PHIẾU CHỈ ĐỊNH XUẤT NGUYÊN VẬT LIỆU - INDOOR
                  </strong>
                </th>
              </tr>
              <tr></tr>
              <tr class="text-center">
                <td>Tuần SX</td>
                <th>{{week}}</th>
                <td>KHÁCH HÀNG</td>
                <td>IKEA</td>
                <td class="text-left">Số LSX</td>
                <td>{{number}}</td>
              </tr>
              <tr>
                <td colspan="4" class="text-center">
                  Nhà máy: <strong>{{nhamay}}</strong> Loại gỗ: Acacia Magium
                  Trạng thái MT: FSC 100%
                </td>
                <td>Tổng KL (m3)</td>
                <td class="text-right">{{formatnumber(tongKL)}}</td>
              </tr>
              <tr>
                <th colspan="6">KHỐI LƯỢNG PHÔI XUẤT THỰC TẾ TRONG TUẦN</th>
              </tr>
            </thead>
          </table>
     
      </q-card>
  
          <!-- <q-card-section>
        <div class="row">
          <div class="col-10 top-title">
            Phê duyệt hệ số cấp gỗ
          </div>
          <q-btn
            color="primary"
            icon="assignment_return"
            :disable="!showEdit"
            label="Tạo phiếu chỉ định"
            @click="confirmTrave = true"
          />
        
        </div>
       
      </q-card-section> -->
      <div v-if="!checkAccount" class="row q-mt-md">
          <q-card class="my-card">
         
          
                  <DxDataGrid
                :data-source="historys"
                :show-borders="true"
                :show-column-lines="true"
                :allow-column-resizing="true"
                :show-row-lines="true"
              :word-wrap-enabled="true"
                 @row-removed="del"
                  @row-updated="update"
                 
         
          @selection-changed="onSelectionChanged"
            >
            <DxEditing 
        :allow-updating="false"
        :allow-deleting="xoa" mode="popup" />
          
            <DxFilterRow :visible="false"/>
 <DxScrolling mode="infinite" />
            <!-- <DxGroupPanel :visible="true"/>
            <DxGrouping :auto-expand-all="true"/> -->
         
           
        <DxColumn
                data-field="sp"
                caption="Sẩn phảm"
                :visible="false"
                sort-order="asc"
                 css-class="mauSPCDHSCG"
            />
          <DxColumn
                data-field="tensp"
                caption="Chi tiết"
                  width="350"
                  css-class="mauSPCDHSCG"
                  
            />
            <DxColumn
                data-field="tenqc"
                caption="Nhóm Qui Cách"
                  width="240"
                     css-class="mauSPCDHSCG"
            >
                
            </DxColumn>
              <DxColumn
                data-field="keHoach"
                caption="Nhu cầu cần"
                 alignment="center"
                format="#,##0.####"
                  width="100"
                     css-class="mauSPCDHSCG"
            />
            <DxColumn
                data-field="HESO"
                caption="Hệ số"
                 alignment="center"
                  width="100"
                   css-class="mauSPCDHSCG"
            />
           
                 <DxColumn
                data-field="capgo"
                caption="KL cấp"
                 alignment="center"
                format="#,##0.####"
                  width="100"
                   css-class="mauSPCDHSCG"
            />
             
             
             <DxColumn
                data-field="GHICHU"
                caption="Ghi chú"
                    alignment="center"
                    css-class="mauSPCDHSCG"
            />
               
             <DxColumn
                data-field="MALOGO"
                caption="Mã lô gỗ"
                    alignment="center"
                    css-class="mauSPCDHSCG"
            />

            
             <DxSummary>
                   <DxTotalItem
              column="tensp"
              summary-type="count"
              value-format="fixedpoint"
              display-format="Tổng cộng : "
             
            />
                 <DxTotalItem
                column="keHoach"
                summary-type="sum"
                value-format="###0.####"
                display-format="{0}"
              />        
              <DxTotalItem
                column="capgo"
                summary-type="sum"
                value-format="###0.####"
                display-format="{0}"
              />
            </DxSummary>
            </DxDataGrid>
            
    <div class="q-pa-md doc-container" style="margin-top:30px">
            <div class="row justify-end">
              <div class="col-4 text-center">
                <br>
                <b>Trưởng Phòng NLG</b><br> 
                    
                      
                        <img v-if="this.duyet"
                         v-bind:src="'/statics/101674.png'"
                          alt="Graphic1"
                          width="180"
                          height="auto"
                      
                        />
                       <br><br> Hà Đăng Chỉnh
              </div>
              <div class="col-4 text-center">
                  Ngày {{ngay}}  tháng  {{thang}}   năm 2021 <br> <b>Người lập phiếu</b><br><br><br><br><br> {{nguoitao}}
              </div>
            </div>
          </div>
          </q-card>
      </div>
      <div v-if="checkAccount" class="row q-mt-md">
          <q-card class="col-10 my-card">
                  <DxDataGrid
                :data-source="historys"
                :show-borders="true"
                :show-column-lines="true"
                :allow-column-resizing="true"
                :show-row-lines="true"
              :word-wrap-enabled="true"
                 @row-removed="del"
                  @row-updated="update"
                 
         
          @selection-changed="onSelectionChanged"
            >
            <DxEditing 
        :allow-updating="false"
        :allow-deleting="false" mode="popup" />
            
            <DxFilterRow :visible="false"/>
 <DxScrolling mode="infinite" />
          
        <DxColumn
                data-field="sp"
                caption="Sẩn phảm"
                :visible="false"
                sort-order="asc"
                 css-class="mauSPCDHSCG"
            />
          <DxColumn
                data-field="tensp"
                caption="Chi tiết"
                  width="350"
                  css-class="mauSPCDHSCG"
                  
            />
            <DxColumn
                data-field="tenqc"
                caption="Nhóm Qui Cách"
                  width="240"
                     css-class="mauSPCDHSCG"
            >
                
            </DxColumn>
              <DxColumn
                data-field="keHoach"
                caption="Nhu cầu cần"
                 alignment="center"
                format="#,##0.####"
                  width="100"
                     css-class="mauSPCDHSCG"
            />
            <DxColumn
                data-field="HESO"
                caption="Hệ số"
                 alignment="center"
                  width="100"
                   css-class="mauSPCDHSCG"
            />
           
                 <DxColumn
                data-field="capgo"
                caption="KL cấp"
                 alignment="center"
                format="#,##0.####"
                  width="100"
                   css-class="mauSPCDHSCG"
            />
              
             <DxColumn
                data-field="GHICHU"
                caption="Ghi chú"
                    alignment="center"
                    css-class="mauSPCDHSCG"
            />

             <DxSummary>
                   <DxTotalItem
              column="tensp"
              summary-type="count"
              value-format="fixedpoint"
              display-format="Tổng cộng : "
             
            />
                 <DxTotalItem
                column="keHoach"
                summary-type="sum"
                value-format="###0.####"
                display-format="{0}"
              />        
              <DxTotalItem
                column="capgo"
                summary-type="sum"
                value-format="###0.####"
                display-format="{0}"
              />
            </DxSummary>
            </DxDataGrid>
            
    <div class="q-pa-md doc-container" style="margin-top:30px">
            <div class="row justify-end">
              <div class="col-4 text-center">
                <br>
                <b>Trưởng Phòng NLG</b><br> 
                    
                      
                        <img v-if="this.duyet"
                         v-bind:src="'/statics/101674.png'"
                          alt="Graphic1"
                          width="180"
                          height="auto"
                      
                        />
                       <br><br> Hà Đăng Chỉnh
              </div>
              <div class="col-4 text-center">
                  Ngày {{ngay}}  tháng  {{thang}}   năm 2021 <br> <b>Người lập phiếu</b><br><br><br><br><br> {{nguoitao}}
              </div>
            </div>
          </div>
          </q-card>
          <div class="col-2 bg-white print-hide">
            <q-list bordered separator>
              <q-toolbar class="bg-warning text-white shadow-2">
                <q-toolbar-title>Phiếu chỉ định chưa duyệt</q-toolbar-title>
              </q-toolbar>
              <q-item clickable v-ripple>
                <q-item-section>Phiếu chỉ định</q-item-section>
                <q-item-section side>Bổ sung</q-item-section>
              </q-item>
              <q-item clickable v-ripple v-for="(value, index) of listNumberByApprovedAt" v-bind:key="index">
                <q-item-section >{{ value.number }}</q-item-section>
                <q-item-section side>{{ value.BX }}</q-item-section>
              </q-item>
            </q-list>
          </div>
      </div>
       <q-dialog v-model="confirmTrave" persistent>
      <q-card style="min-width:400px">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title">
              Xác nhận phê duyệt phiếu chỉ định
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
      <q-dialog v-model="confirmphieu" persistent>
      <q-card style="min-width:400px">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title">
              Xác nhận hủy phiếu chỉ định
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="xoa"
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
import {DxDataGrid,DxGrouping,DxTotalItem,DxGroupPanel,DxSummary,DxGroupItem, DxEditing,
DxExport,DxHeaderFilter,DxColumn,DxScrolling,DxFilterRow,DxSearchPanel,DxLookup} from 'devextreme-vue/data-grid';
export default {
    components:{
        SelectNcc,
        SelectBox,
        SelectNhomQuiCach,
        DxNumberBox,
        DxTotalItem,
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
            xoa:false,
            checkAccount: false,
            ngay:'',
            thang:'',
            listNumber:[],
            listlan:[],
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
                confirmphieu: false,
            nhomquicachs:[],
            nhomkhos:[],
            ncc:null,
            tongKL:0,
            week:"",
            nguoitao:'',
                year: null,
            dupplicateNcc:[],
            nhomqc:null,
            nhomkho:null,
            slkh:0,
            solan:'',
            lan:'',
            bosung:[],
            number:"",
            showEdit: true,
            showEdit1:false,
             dataTrave: [],
            fix:null,
            nhap_year:null,
            nhap_month:null,
            thangs:thangs,
            nams:nams,
             idDepartment:null,
             nhamay:null,
            history_thang:null,
            history_nam:null,
            historys:[],
            congdoans:[],
            items:[],
            duyet:``,
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
        if(this.$store.state.base.userInfo.id == 101674){
        this.getNumberByApproved();
        this.checkAccount = true;
      }
      if(this.$store.state.base.userInfo.id == 101976 || this.$store.state.base.userInfo.id == 101750 || this.$store.state.base.userInfo.id == 105353)
      this.xoa = true
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
           this.showEdit1 = false
           this.showEdit = true
           this.historys = []
           this.tongKL = 0
             this.solan = ''
              this.lan = ''
             this.listlan = []
          console.log('LSX:',this.number)
        this.duyet = ``
             const payload = {
     
        number: this.number,
        
       
      };
           const data = await this.$store.dispatch('nlg/GET_PHIEU_CHI_DINH',payload)
           this.bosung = data.data
          this.nguoitao = data.data[0].nguoitao
            if (this.bosung[0].BX != null){
                this.showEdit1 = true
            }
          data.data.forEach(d => {
            if (d.BX == null || d.BX == ''){
              this.historys.push(d)
            }
          })
           if (this.historys.length >0){
            if (this.historys[0].approvedByAccount != null) {
              this.duyet = `đã duyệt`
              this.showEdit = false
             // this.ngay = this.historys[0].approvedAt.getday()
                let month = new Date(this.historys[0].approvedAt)
                this.thang = month.getMonth() + 1
                this.ngay = month.getDate()
            
            }
               this.tongKL = 0
               for(let i=0;i<this.historys.length;i++){
                   this.tongKL =this.tongKL +this.historys[i].capgo
               }}
           console.log('tongKL:',this.tongKL)
        },
           async pheduyet() {
             
                const payload = {
      number: this.number,
     createBy:this.$store.state.base.userInfo.id,
      
       
       
      };
                   const data = await this.$store.dispatch("nlg/PHE_DUYET_PHIEU", payload);
      if (data.meta.success) {
        if(this.$store.state.base.userInfo.id == 101674){
        this.getNumberByApproved();
      }
        showNotifySuccess();
        if (this.historys[0].BX != null){
          this.historys = []
        this.duyetbs();
        }
        else {
          this.historys = []
       this.loadHistory();

        }
     
      } else {
        showNotifyError();
      }
    },
    async duyetbs() {
             this.historys = []
             this.duyet = ''
            
             this.showEdit = true
            
           const payload = {
     
        number: this.number,
        
       
      };
           const data = await this.$store.dispatch('nlg/GET_PHIEU_CHI_DINH_BS',payload)
              this.solan = data.data[0].BX
             data.data.filter((v,i,a)=> a.indexOf(v)===i)
             data.data.forEach(e => {
             
                 this.listlan.push(e.BX)
               
             })
             this.listlan = this.listlan.filter((v,i,a)=> a.indexOf(v)===i)
           if (this.lan == '') this.lan = this.listlan[0]
             data.data.forEach(d => {
               if (d.BX ==this.lan){
                 this.historys.push(d)
               }
             })
            if (this.historys[0].approvedByAccount != null) {
              this.duyet = `đã duyệt`
              this.showEdit = false
             // this.ngay = this.historys[0].approvedAt.getday()
                let month = new Date(this.historys[0].approvedAt)
                this.thang = month.getMonth() + 1
                this.ngay = month.getDate()
            
            }
               this.tongKL = 0
               for(let i=0;i<this.historys.length;i++){
                   this.tongKL =this.tongKL +this.historys[i].capgo
               }
      
    },
    async getNumberByApproved(){
        const dataNumberByApproved = await this.$store.dispatch('nlg/GET_NUMBER_CHUA_PHE_DUYET');
        this.listNumberByApprovedAt = dataNumberByApproved.data;
        },
      async xoa() {
             
                const payload = {
      number: this.number,
    
      
       
       
      };
                   const data = await this.$store.dispatch("nlg/XOA_PHE_DUYET_PHIEU", payload);
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
      console.log('nhóm:',this.dataTrave)
    },
    formatnumber(d){
     return roundNumber(d,4)
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
      const data3 = await this.$store.dispatch("nlg/XOA_CHI_TIET_PCD", payload);
      if (data.meta.success) {
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
        async loadGrid() {
          this.listNumber = []
          this.nhamay = this.idDepartment.label 
      if (this.idDepartment.code == "TH")  this.fa = 100000; 
      
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
   
      async update(e){
            console.log(e.data)
        const    payload = {
            ID:e.data.ID
            
          
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


<style  type="text/css">
#tableHead tr,
th,
td {
  border: 2px solid black;
}
table {
  border-collapse: collapse;
  table-layout: fixed;
}
thead {
  width: 100%;
}
.mauSPCDHSCG {
     border: 1px solid !important;
     background-color: white;
  color: black;
}
</style>