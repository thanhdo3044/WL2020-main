<template>
 
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
            
                  <DxDataGrid
                :data-source="historys"
                :show-borders="true"
                :show-column-lines="true"
                :allow-column-resizing="true"
               @row-inserted="add"
                @row-updated="update"
            >
              <DxEditing
                :allow-updating="true"
               :allow-adding="false"
                mode="row"
            />
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
            <DxFilterRow :visible="true"/>

            <DxGroupPanel :visible="true"/>
            <DxGrouping :auto-expand-all="true"/>
             <DxColumn
                data-field="NAME"
                caption="Tên nhà cung cấp"
               :group-index="0"
            
            >
               
            </DxColumn>
            <DxColumn
                data-field="NHOM"
                caption="Nhóm Qui Cách"
            >
                
            </DxColumn>
            <DxColumn
                data-field="PLANQTY"
                caption="Khối lượng"
            />
             <DxColumn
                data-field="KHO"
                caption="Kho nhập"
          >
             <DxLookup
                    :data-source="nhomkhos"
                    display-expr="makho"
                    value-expr="makho"
                    />
               </DxColumn>
                  <DxColumn
                data-field="VUOTNCC"
                caption="Vượt KL"
            />
            <!-- <DxSummary >
                <DxGroupItem
                    column="quantity"
                    :show-in-group-footer="false"
                    :align-by-column="true"
                    summary-type="sum"
                    :display-format="'{0}'"
                    :value-format="'#,##0.####'"
                />
            </DxSummary> -->
            </DxDataGrid>
           
          </q-card>
      

</template>

<script>
import { DxNumberBox } from 'devextreme-vue/number-box';
import SelectBox from '../../../components/commons/SelectBoxInt'
import SelectNcc from '../../../components/NLG/SelectBoxNcc'
import SelectNhomQuiCach from '../../../components/commons/SelectBoxInt'
import SelectThang from '../../../components/commons/SelectBoxInt'
import SelectNam from '../../../components/commons/SelectBoxInt'
import { showNotifySuccess, showNotifyError, showNotifyValidate,thangs,nams } from '../../../ultils';
import {DxDataGrid,DxGrouping,DxGroupPanel,DxSummary,DxGroupItem,DxEditing,
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
            nhomquicachs:[],
            nhomkhos:[],
            ncc:null,
            dupplicateNcc:[],
            nhomqc:null,
            nhomkho:null,
            slkh:0,
            khoiluongnhom:0,
            kltungkho:0,
            klkho:0,
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
        Promise.all([this.loadNhaCungCap(),this.loadGroupQuiCach(),this.loadHistory(),this.loadkho()])
       console.log('chao kho:',this.nhomkhos)
     
    },
    methods:{
        async changePlan(){
             for(let i = 0; i < this.historys.length; i++){
                if(this.chuyen_ncc == this.historys[i].mancc && this.chuyen_nhomqc == this.historys[i].GROUP_CODE){
                    this.klkho +=this.historys[i].PLANQTY 
                    this.chonkhochuyen = this.historys[i].KHO
                    //this.khconlai = this.historys[i].PLANQTY - this.chuyen_slkh;
                   // this.id = this.historys[i].ID
                    //this.chonkhochuyen  = this.historys[i].KHO
                   // console.log(this.chonkhochuyen)
                }
                         this.khconlai  = this.klkho - this.chuyen_slkh
            }
            if (this.khconlai >=0){
            if (this.chuyen_slkh>0&&this.chuyen_ncc&&this.chuyen_nhomqc&&this.nhan_ncc) {
                 console.log(this.chonkhochuyen)
                const payload = {
                     kho: this.chonkhochuyen,
                   // mancc_old:this.chuyen_ncc,
                    mancc:this.nhan_ncc,
                    groupCode:this.chuyen_nhomqc,
                    quantity:this.chuyen_slkh,
                    createBy:this.$store.state.base.userInfo.account,
                    delFlag:'N'
                }
                const data = await this.$store.dispatch('nlg/ADD_PLAN',payload)
                if (data.meta.success) {
                    this.updatePlan()
                    await this.loadHistory()
                    showNotifySuccess()
                    this.chuyen_slkh = 0
                }else{
                    showNotifyError()
                }
            }else{
                showNotifyValidate()
            }
            } else{
              this.$q.dialog({
        html: true,
        title: 'Nhập kế hoạch',
        message: 'Bạn đã nhập quá khối lượng kế hoạch chuyển: '
      })
            }
        },
         async updatePlan(){
           // if (this.chuyen_slkh>0&&this.chuyen_ncc&&this.chuyen_nhomqc&&this.nhan_ncc) {
              
        //     console.log(this.historys[0].mancc)
        //     console.log(this.historys[0].ID)
        //    console.log(this.historys[0].GROUP_CODE[1])
            // console.log(this.historys[0].PLANQTY)
            // console.log(this.chuyen_nhomqc)
               const payload = {
                    kho: this.chonkhochuyen,
                   mancc:this.chuyen_ncc,
                   groupCode:this.chuyen_nhomqc,
                    quantity: -this.chuyen_slkh,
                  createBy:this.$store.state.base.userInfo.account,
                    delFlag:'N'
                }
                const data = await this.$store.dispatch('nlg/ADD_PLAN',payload)
                if (data.meta.success) {
                    await this.loadHistory()
                    showNotifySuccess()
                    this.chuyen_slkh = 0
                }else{
                    showNotifyError()
                }
            
        },
        async addPlan(){
             const data2 = await this.$store.dispatch("nlg/GET_TONG_DINH_MUC_KHOQC", {
        
        nhom: this.nhomqc
      });
      this.kltungkho = data2.data[0].KLTUNGKHO
       const data1 = await this.$store.dispatch("nlg/GET_NCC_THANG3", {
          nhom:this.nhomqc
        });
        this.khoiluongnhom = data1.data[0].KLNHOM
        console.log(this.kltungkho)
        console.log(this.khoiluongnhom )
           if (this.khoiluongnhom + this.slkh > this.kltungkho ) {
               this.$q
            .dialog({
              html: true,
              title: "Nhập kế hoạch",
              message:
                "Bạn đã nhập quá KH tổng: " 
            })

           }else {
            if (this.nhap_year&&this.nhap_month&&this.slkh>0&&this.ncc&&this.nhomqc) {
                const payload = {
                  mancc:this.ncc,
                  groupCode:this.nhomqc,
                  kho: this.chonkho,
                  //  month:this.nhap_month,
                  //  year:this.nhap_year,
                    quantity:this.slkh,
                    createBy:this.$store.state.base.userInfo.account,
                    delFlag:'N'
                }
                const data = await this.$store.dispatch('nlg/ADD_PLAN',payload)
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
           }
        },
         async update(e){
            console.log(e.data)
        const    payload = {
            ID:e.data.ID,
            mancc: e.data.mancc,
            quantity: e.data.PLANQTY,
            kho: e.data.KHO,
            VUOTNCC: e.data.VUOTNCC
            }
            const data = await this.$store.dispatch('nlg/UPDATE_PLAN',payload)
            // console.log(e)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
        async loadHistory(){
        
            
           const data = await this.$store.dispatch('nlg/GET_PLAN_BY_USER', {
       thang: this.history_thang
      });
          
            this.historys = data.data
               
           
        },
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
                    label:e.makho,
                   value: e.id
                })
            })
           this.dupplicateNcc = duppp
          
              this.nhomkhos = data.data
            console.log(this.nhomkhos)
        },
        chonNcc(e){
            
            this.ncc = e.value
        },
        chonNhomQuiCach(e){
            this.nhomqc = e.value
        },
        chonNhomkho(e){
            
            this.chonkho = e.value
        },
        chonNam(e){
            this.nhap_year = e.value
        },
        chonThang(e){
            this.nhap_month =e.value
        },
        chonNamChuyen(e){
            this.chuyen_nam = e.value
        },
        chonThangChuyen(e){
            this.chuyen_thang =e.value
        },
        chonNamHistory(e){
            this.history_nam = e.value
            this.loadHistory()
        },
        chonThangHistory(e){
            this.history_thang = e.value
             console.log('tháng:',this.history_thang)
            this.loadHistory()
        },
        changeslkh(e){
            this.slkh = e.value
        },
        chonNhomQuiCachChuyen(e){
            this.chuyen_nhomqc = e.value
        },
        chonNCCChuyen(e){
            this.chuyen_ncc= e.value
        },
        chonNCCNhan(e){
            this.nhan_ncc= e.value
        },
        chuyen_changeslkh(e){
            this.chuyen_slkh = e.value
        }
    },
    
}
</script>

<style>

</style>