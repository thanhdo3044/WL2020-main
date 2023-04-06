<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title">
                     Danh sách Mã lô gỗ
                  </div>
              </div>
          </q-card-section>
          <q-separator spaced />
          <q-card-section>
               <DxDataGrid
                :data-source="dinhmucs"
                :show-borders="true"
                :no-data-text="'Không có dữ liệu !'"
                :show-column-lines="true"
                :allow-column-resizing="true"
                @row-inserted="add"
                @row-updated="update"
                  @row-removed="del"
            >
            <DxEditing
                :allow-updating="true"
                :allow-adding="true"
                :allow-deleting="true"
                mode="popp"
            />
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Danh sách mã lô gỗ'"
            />
            <DxHeaderFilter :visible="true"/>
            <DxGroupPanel :visible="true" :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'" />
            <DxGrouping :auto-expand-all="true" />
            <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/>
           
           
            <DxColumn
                data-field="name"
                caption="Tên chủ rừng"
                
            >
                <DxLookup
                    :data-source="dsrung"
                    display-expr="name"
                   value-expr="id"
                    
                    />
            </DxColumn>
              <DxColumn
                data-field="thang"
                caption="Tháng hồ sơ"
               
            >
            </DxColumn>
            <DxColumn
                data-field="Xuongxe"
                caption="Xưởng xẻ"
               
            >
            <DxLookup
                    :data-source="dsNcc"
                    display-expr="name"
                   value-expr="MX"
                    
                    />
            </DxColumn>
           
             <DxColumn
                data-field="logotron"
                caption="Lô gỗ tròn"
               
            >
            </DxColumn>
             <DxColumn
                data-field="logoxe"
                caption="Lô gỗ xẻ"
              
            >
            </DxColumn>
            <DxColumn
                data-field="KL_GOTRON"
                caption="Khối lượng gỗ tròn"
              
            >
            </DxColumn>
             <DxColumn
                data-field="COST"
                caption="Đơn giá"
              
            >
            </DxColumn>
        
            
            </DxDataGrid>
          </q-card-section>
      </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxEditing,
  DxRequiredRule,
  DxExport,DxHeaderFilter,DxSummary,DxGroupItem,DxTotalItem,DxLookup
} from 'devextreme-vue/data-grid';
import { showNotifySuccess, showNotifyError } from '../../../ultils';
export default {
    components:{
         DxDataGrid,
        DxColumn,
        DxGrouping,
        DxGroupPanel,
        DxPager,
        DxPaging,
        DxSearchPanel,
        DxLookup,
        DxEditing,
        DxRequiredRule,
        DxExport,DxHeaderFilter,DxSummary,DxGroupItem,DxTotalItem
    },
    data(){
        return {
            dinhmucs:[],
            groups:[],
            dsrung:[],
            dsNcc:[],
            mancc:'',
            // vung:[
            //     {code:'NOR',name:'Chung'},
            //     {code:'QT',name:'Quảng Trị'},
            // ],
            // vung2:[
            //     {code:'NOR',name:'Chung'},
            //     {code:'HT',name:'Hà Tĩnh'},
            //     {code:'NA',name:'Nghệ AN'},
            //     {code:'QB',name:'Quảng Bình'},
            //     {code:'QT',name:'Quảng Trị'},
            //     {code:'TN',name:'Thái Nguyên'},
            //     {code:'TH',name:'Thanh Hóa'}
            // ],
            hoadon:[
                {code:'Y',name:'Xuất hóa đơn'},
                {code:'N',name:'Không xuất hóa đơn'}
            ],
            coc:[
                {code:'Y',name:'FSC 100%'},
                {code:'N',name:'NOT FSC'}
            ],
            staff:[
                {code:'15T1399',name:'Bùi Văn Vinh'},
                 {code:'14T1005',name:'Đinh Công Định'}
            ]
        }
    },
    created(){
        this.load()
        this.loadNhaCungCap()
        this.loadchurung()
        // Promise.all([this.load(),this.loadGroup(),this.loadKho()])
    },
    methods:{
        async loadKho(){
            this.dskho= this.$store.getters['base/myKhoCBG']
        },
        async load(){
            const data = await this.$store.dispatch('nlg/GET_DS_MA_LO_GO')
            this.dinhmucs = data.data
        },
        async loadNhaCungCap() {
      //  const duppp = []
      const data = await this.$store.dispatch("nlg/GET_DS_NHA_CUNG_CAP");
      data.data.forEach(e=>{
          if (e.MX){
          this.dsNcc.push(e)
          }
      })
     
         },
//          calculatelogo(rowData) {
//            //  console.log ('vi tri:',rowData.Xuongxe.trim().slice(0,1))
//             if (rowData.Xuongxe) {
//                 if (rowData.Xuongxe.trim().slice(0,1) == 'S')
//       rowData.logoxe = rowData.logotron + " " + rowData.Xuongxe;
//       else rowData.logoxe = rowData.logotron
//             }
//        return rowData.logoxe ;
//   },
          async loadchurung() {
      //  const duppp = []
      const data = await this.$store.dispatch("nlg/GET_DS_CHU_RUNG");
     this.dsrung = data.data
     
         },
        async add(e){
            this.mancc = ''
            this.dsNcc.forEach(d=>{
                if (d.MX == e.data.Xuongxe)
                this.mancc = d.code
            })
        const    playload = {
            name:e.data.name,
            thang:e.data.thang,
            Xuongxe: e.data.Xuongxe,
            logotron:e.data.logotron,
            KL_GOTRON:e.data.KL_GOTRON,
            COST:e.data.COST,
            MANCC:this.mancc,
            logoxe: e.data.Xuongxe.trim().slice(0,1) == 'S'? e.data.logotron.trim().slice(0,3) + "100%" + e.data.logotron.trim().slice(6,12)+ " " + e.data.Xuongxe : e.data.logotron 

        }
            const data = await this.$store.dispatch('nlg/ADD_MA_LO_GO',playload)
            if (data.meta.success) {
                showNotifySuccess()
               this.load()
            }else{
                showNotifyError()
            }
        },
             async del(e){
              console.log('qui cach:',e.data.id)
            const data = await this.$store.dispatch('nlg/DEL_MA_LO_GO',e.data)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
        async update(e){
            const data = await this.$store.dispatch('nlg/UPDATE_MA_LO_GO',e)
            // console.log(e)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
    }
}
</script>

<style>

</style>