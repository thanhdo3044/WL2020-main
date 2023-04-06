<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
         Báo cáo hệ số sử dụng gỗ Indoor -
          <span class="text-amber-14">{{ idDepartment.label }}</span>
        </div>

        <div
          class="col-6 cursor-pointer text-blue text-bold"
          style="font-size: 18px"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
          <span class="text-amber-14">{{ denNgay }}</span>
        </div>
      </div>
    </div>
   
          <q-card>
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
                 <div class="row print-hide" >
         <q-select
            class="col-2 q-ml-sm"
            @input="loadCode"
            label-color="orange"
            outlined
            v-model="idDepartment"
            :options="options"
            label="Chọn nhà máy"
          />
          </div>
                     <div class="row q-mt-md">
                          <div class="col-12">
                  <DxDataGrid
                   :word-wrap-enabled="true"
                :data-source="historys"
                :show-borders="true"
                :show-column-lines="true"
                :allow-column-resizing="true"
                
                 
      @selection-changed="onSelectionChanged"
                 :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
                
            >
            <!-- <DxEditing 
        :allow-updating="false"
        :allow-deleting="false" mode="popup" /> -->
        <!-- <DxSelection mode="multiple"/> -->
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
            <DxHeaderFilter :visible="true"
            />
            <DxFilterRow :visible="false"/>

            <DxGroupPanel :visible="true"/>
            <DxGrouping :auto-expand-all="true"/>
         
             <DxColumn
                data-field="paren"
                caption="Sản phẩm"
                :group-index="0"
            />
        
       
            <DxColumn
                data-field="NAME"
                caption="Chi tiết"
                    width="300"
            >
                
            </DxColumn>
             <DxColumn
                caption="Xuất vào sản xuất"
                alignment="center"
              >
            <!-- <DxColumn
                data-field="heso"
                caption="Hệ số cấp"
                alignment="center"
                width="160"
            /> -->
             <!-- <DxColumn
                caption="Khối lượng (m3)"
                alignment="center"
              > -->
              <!-- <DxColumn
                data-field="keHoach"
                caption="Kế hoạch cấp"
                alignment="center"
                width="160"
            /> -->
              <DxColumn
                data-field="KLC_TH"
                caption="Thực tế cấp"
                format="#,##0.####"
                alignment="center"
               width="160"
            />
            <!-- </DxColumn> -->
            </DxColumn>
               <DxColumn
                caption="Sản phẩm đầu ra"
               
                alignment="center"
              
              >
            <DxColumn
                caption="Kích thước sau ghép thanh/4M(mm)"
                width="180"
                alignment="center"
              
              >
                <DxColumn
                  data-field="LENGTH"
                  caption="Dài"
                  data-type="number"
                  format="fixedpoint"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  data-field="WIDTH"
                  caption="Rộng"
                  data-type="number"
                 format="#,##0.##"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  data-field="HEIGHT"
                  caption="Dày"
                  data-type="number"
                  format="fixedpoint"
                  alignment="center"
                  width="90"
                />
              </DxColumn>
              <DxColumn
                data-field="QUANTITY"
                caption="Khối lượng sản xuất"
                format="#,##0.####"
                width="160"
                alignment="center"
            />

            <DxColumn
                data-field="hesosudung"
                caption="Hệ số sử dụng"
                alignment="center"
                width="160"
                format="#,##0.####"
            />
             </DxColumn>
            
              <DxSummary :calculate-custom-summary="calculateAreaSummary"
            >
                    <DxGroupItem
                :show-in-group-footer="false"
                :align-by-column="true"
                column="KLC_TH"
                summary-type="sum"
                value-format="#,##0.####"
                display-format="{0}"
                />
             <DxTotalItem
              
                column="KLC_TH"
                summary-type="sum"
                value-format="###0.####"
                display-format="{0}"
               
              />
              <DxTotalItem
               name="AreaSummary"
                show-in-column="hesosudung"
                summary-type="custom"
                value-format="###0.####"
                display-format="{0}"
               
              />
                <DxGroupItem
                :show-in-group-footer="false"
                :align-by-column="true"
                column="QUANTITY"
                summary-type="sum"
                value-format="#,##0.####"
                display-format="{0}"
                />
            
              <DxTotalItem
              
                column="QUANTITY"
                summary-type="sum"
                value-format="###0.####"
                display-format="{0}"
              />
            </DxSummary>
            </DxDataGrid>
             </div>
              </div>
              <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
          </q-card>
      
  </q-page>
</template>

<script>
import { DxNumberBox } from 'devextreme-vue/number-box';
import DialogSelectDate from "components/commons/DialogSelectFromDateToDate";
import SelectBox from '../../../components/commons/SelectBoxInt'
import SelectNcc from '../../../components/NLG/SelectBoxNcc'
import SelectNhomQuiCach from '../../../components/commons/SelectBoxInt'
import SelectThang from '../../../components/commons/SelectBoxInt'
import SelectNam from '../../../components/commons/SelectBoxInt'
import { showNotifySuccess,formatDateVN,getFisrtDayOfMonth,
formatDateISO, showNotifyError, showNotifyValidate,thangs,nams } from '../../../ultils';
import {DxDataGrid,DxSelection,DxGrouping,DxGroupPanel,DxSummary,DxGroupItem,DxTotalItem, DxEditing,
DxExport,DxHeaderFilter,DxColumn,DxScrolling,DxFilterRow,DxSearchPanel,DxLookup} from 'devextreme-vue/data-grid';
export default {
    components:{
        SelectNcc,
        SelectBox,
        DialogSelectDate,
        DxTotalItem,
        SelectNhomQuiCach,
        DxSelection,
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
           fromDate: null,
           toDate: null,
            chuyen_slkh:0,
            chuyen_nhomqc:null,
            chuyen_ncc:null,
            nhan_ncc:null,
            khconlai:0,
            id:0,
            showChooseDate:false,
            fa: 100000,
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
              idDepartment: 
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
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
            tongTT:0,
            tongSX:0,
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
        this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
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
      computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
 
  },
    methods:{
       cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
     this.loadHistory()
    },
       calculateAreaSummary(options) {
       
            if (options.name === "AreaSummary") {
                if (options.summaryProcess === "start") {
                  
                    this.tongTT = 0
                    this.tongSX = 0
                }
         if (options.summaryProcess === "calculate") {
                    this.tongTT += options.value.KLC_TH
                    this.tongSX = this.tongSX + options.value.QUANTITY
                        options.totalValue = this.tongTT/this.tongSX
                    }
            }
        },
    //      onSelectionChanged(e) {
    //        this.tongTT = 0
    //        this.tongSX = 0
    //        console.log('hiệu:',e)
    //      e.selectedRowsData.forEach(element => {
                   
    //                this.tongTT = this.tongTT + element.KLC_TH  
    //                 this.tongSX = this.tongSX + element.QUANTITY
    //             })
    //             e.component.refresh(true);
    // },
        // async addPlan(){
        //     if (this.nhomqc) {
        //         const payload = {
                  
        //           groupCode:this.nhomqc,
                  
        //           //  month:this.nhap_month,
        //           //  year:this.nhap_year,
        //            ITEM_ID:this.item.value,
        //             HESO:this.slkh,
        //             createBy:this.$store.state.base.userInfo.account
                    
        //         }
        //         const data = await this.$store.dispatch('nlg/ADD_HE_SO',payload)
        //         if (data.meta.success) {
                    
        //             await this.loadHistory()
        //             showNotifySuccess()
        //             this.slkh = 0
        //         }else{
        //             showNotifyError()
        //         }
        //     }else{
        //         showNotifyValidate()
        //     }
        //     this.loadHistory();
        // },
           async loadCode() {
           if (this.idDepartment.code == "TH")  this.fa = 100000; 
            if (this.idDepartment.code == "YS1A")  this.fa = 100003; 
             if (this.idDepartment.code == "YS1B")  this.fa = 100004; 
              if (this.idDepartment.code == "TB")  this.fa = 100005; 
                 this.loadHistory();
    },

        async loadHistory(){
         let payload = {
        fromDate: formatDateISO(this.fromDate),
        toDate: formatDateISO(this.toDate),
        factoryId:this.fa,
      };
            
           const data = await this.$store.dispatch('nlg/NLG_HE_SO_SU_DUNG_THANG',payload)
          
            this.historys = data.data
            this.tongTT = 0
            this.tongSX = 0
                 data.data.forEach(element => {
                   
                   this.tongTT = this.tongTT + element.KLC_TH  
                    this.tongSX = this.tongSX + element.QUANTITY
                })
           
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
      const data3 = await this.$store.dispatch("nlg/DEL_HE_SO", payload);
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
            
            HESO: e.data.HESO,
          
         
            }
            const data = await this.$store.dispatch('nlg/UPDATE_HE_SO',payload)
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