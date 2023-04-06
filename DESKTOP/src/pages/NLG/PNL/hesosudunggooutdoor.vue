<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
         Báo cáo hệ số sử dụng gỗ Outdoor từ Sơ chế - Đóng gói -
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
         
             <!-- <DxColumn
                data-field="paren"
                caption="Sẩn phảm"
                :group-index="0"
            /> -->
        
       
            <DxColumn
                data-field="paren"
                caption="tên sản phẩm"
                    width="300"
            >
                
            </DxColumn>
               <DxColumn
                data-field="VOLUMN"
                caption="KL tinh/sp (m3)"
                format="#,##0.####"
                alignment="center"
               width="160"
            />
             <DxColumn
                caption="Khối lượng đầu vào"
                alignment="center"
              >
            <DxColumn
                data-field="heso"
                caption="Hệ số LP"
                alignment="center"
                format="#,##0.####"
                width="160"
            />
             <DxColumn
                data-field="hesoSC"
                caption="Hệ số SC"
                format="#,##0.####"
                alignment="center"
                width="160"
                 :calculate-cell-value="calculatehesoSC"
            />
             <DxColumn
                data-field="hesoC"
                caption="Hệ số chung"
                format="#,##0.####"
                alignment="center"
                width="160"
                   :calculate-cell-value="calculatehesoC"
            />
               <DxColumn
                data-field="sausay"
                caption="Khối lượng LĐ"
                format="#,##0.####"
                alignment="center"
               width="160"
              
            />
              <DxColumn
                data-field="KLC_LD"
                caption="Khối lượng phôi sau sấy"
                format="#,##0.####"
                alignment="center"
               width="160"
                :calculate-cell-value="calculateLD"
            />
            <!-- </DxColumn> -->
            </DxColumn>
               <DxColumn
                caption="Khối lượng đầu ra"
               
                alignment="center"
              
              >
           
              <DxColumn
                data-field="soche"
                caption="Khối lượng sau SC/VGT"
                format="#,##0.####"
                width="160"
                alignment="center"
            />
              <DxColumn
                data-field="donggoi"
                caption="Khối lượng đóng gói"
                format="#,##0.####"
                width="160"
                alignment="center"
            />
           
             </DxColumn>
              <DxColumn
                caption="Tồn trên truyền"
               
                alignment="center"
               >
                <DxColumn
                data-field="TONDAUKY"
                caption="Tồn đầu kỳ (m3)"
                format="#,##0.####"
                width="160"
                alignment="center"
            />
             <DxColumn
                data-field="TONCUOIKY"
                caption="Tồn cuối kỳ TC-HT"
                format="#,##0.####"
                width="160"
                alignment="center"
            />
               </DxColumn>
             <DxColumn
                data-field="hesosudung"
                caption="Hệ số sử dụng"
                alignment="center"
                width="160"
                format="#,##0.####"
                :calculate-cell-value="calculateHSSD"
            />
            
              
              <DxSummary :calculate-custom-summary="calculateAreaSummary"
            >
                  
             <DxTotalItem
              
                column="soche"
                summary-type="sum"
                value-format="###0.####"
                display-format="{0}"
               
              />
              <DxTotalItem
              
                column="donggoi"
                summary-type="sum"
                value-format="###0.####"
                display-format="{0}"
               
              />
              <DxTotalItem
               name="AreaSummary"
                show-in-column="hesoC"
                summary-type="custom"
                value-format="###0.####"
                display-format="{0}"
               
              />
               <DxTotalItem
               name="hesosudung"
                show-in-column="hesosudung"
                summary-type="custom"
                value-format="###0.####"
                display-format="{0}"
               
              />
              <DxTotalItem
               name="hesochung"
                show-in-column="hesoSC"
                summary-type="custom"
                value-format="###0.####"
                display-format="{0}"
               
              />
                <DxTotalItem
              
                column="KLC_LD"
                summary-type="sum"
                value-format="###0.####"
                display-format="{0}"
              />
              <DxTotalItem
              
                column="heso"
                summary-type="avg"
                value-format="###0.####"
                display-format="{0}"
              />
                <DxTotalItem
            
                column="TONDAUKY"
                summary-type="sum"
                value-format="#,##0.####"
                display-format="{0}"
                />
            
              <DxTotalItem
              
                column="TONCUOIKY"
                summary-type="sum"
                value-format="###0.####"
                display-format="{0}"
              />
                <DxTotalItem
              
                column="sausay"
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
formatDateISO,roundNumber, showNotifyError, showNotifyValidate,thangs,nams } from '../../../ultils';
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
            fa: 100004,
            soche:102355,
            tc:[102530,102356,102357],
            dg:102363,
            fasc: 100003,
            congdoantc:[102530,102356,102357,102359,102360,102361,102362,102363],
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
          label: "NM CBG Yên Sơn 1B",
          factoryId: 102299,
          code: "YS1B",
        },
             options: [
        {
          label: "NM CBG Yên Sơn 1B",
          factoryId: 102299,
          code: "YS1B",
        },
        {
          label: "NM CBG Thái Bình",
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
            kho2m:102487,
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
        Promise.all([this.loadHistory(),this.loadItem()])
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
          calculateLD(rowData) {
             
      rowData.KLC_LD = roundNumber((rowData.sausay*rowData.heso),4);
    
       return rowData.KLC_LD ;
  },
      calculatehesoSC(rowData) {
             if (rowData.soche == 0) rowData.hesoSC = '-'
             else
      rowData.hesoSC = roundNumber((rowData.sausay/ rowData.soche),4);
    
       return rowData.hesoSC ;
  },
   calculatehesoC(rowData) {
            if(rowData.soche == 0) rowData.hesoC = '-'
            else
      rowData.hesoC = roundNumber((rowData.sausay*rowData.heso/ rowData.soche),4);
    
       return rowData.hesoC ;
  },
      calculateHSSD(rowData) {
         if (rowData.sausay == 0)  rowData.hesosudung=0
         else
      rowData.hesosudung = roundNumber((rowData.sausay*rowData.heso/ (rowData.donggoi+rowData.TONDAUKY-rowData.TONCUOIKY)),4);
    
       return rowData.hesosudung ;
  },
       calculateAreaSummary(options) {
       
            if (options.name === "AreaSummary") {
                if (options.summaryProcess === "start") {
                  
                    this.tongTT = 0
                    this.tongSX = 0
                }
         if (options.summaryProcess === "calculate") {
                    this.tongTT += options.value.sausay*options.value.heso
                    this.tongSX +=  options.value.soche
                        options.totalValue = this.tongTT/this.tongSX
                    }
            }
              if (options.name === "hesosudung") {
                if (options.summaryProcess === "start") {
                  
                    this.tongTT1 = 0
                    this.tongSX1 = 0
                    this.tongSX2 = 0
                    this.tongSX3=0
                }
         if (options.summaryProcess === "calculate") {
                    this.tongTT1 += options.value.sausay*options.value.heso
                    this.tongSX1 +=  options.value.donggoi
                    this.tongSX2 +=  options.value.TONDAUKY
                    this.tongSX3 +=  options.value.TONCUOIKY
                        options.totalValue = this.tongTT1/(this.tongSX1+this.tongSX2- this.tongSX3)
                    }
            }
              if (options.name === "hesochung") {
                if (options.summaryProcess === "start") {
                  
                    this.tongTT2 = 0
                    this.tongSX4 = 0
                    
                }
         if (options.summaryProcess === "calculate") {
                    this.tongTT2 += options.value.sausay
                    this.tongSX4 +=  options.value.soche
     
                        options.totalValue = this.tongTT2/this.tongSX4
                    }
            }
        },

           async loadCode() {
         
          
             if (this.idDepartment.code == "YS1B") { this.fa = 100004; this.fasc = 100003
             this.congdoantc = [102530,102356,102357,102359,102360,102361,102362,102363]
             this.soche = 102355,this.dg = 102363,this.tc = [102530,102356,102357] 
             this.kho2m = 102487 }
              if (this.idDepartment.code == "TB") { this.fa = 100005; this.fasc = 100005 
               this.congdoantc = [102380,102381,102377,102389,102390,102382] 
              this.soche = 102380,this.dg = 102390,this.tc = [102382]
              this.kho2m = 102495 }
                 this.loadHistory();
    },

        async loadHistory(){
         let payload = {
        fromDate: formatDateISO(this.fromDate),
        toDate: formatDateISO(this.toDate),
        factoryId:this.fa,
        factoryIdsc:this.fasc,
        soche:this.soche,
        dg:this.dg,
        tc:this.tc,
        congdoan:this.congdoantc,
        kho2m:this.kho2m,
      };
            
           const data = await this.$store.dispatch('nlg/NLG_HE_SO_SU_DUNG_OUTDOOR',payload)
          
            this.historys = data.data
           
           
        },
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
       
      
       
     
      
       
       
    },
    
}
</script>

<style>

</style>