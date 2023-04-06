<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title">
                     Danh sách chủ rừng
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
                mode="popup"
            />
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Danh sách chủ rừng'"
            />
            <DxHeaderFilter :visible="true"/>
            <DxGroupPanel :visible="true" :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'" />
            <DxGrouping :auto-expand-all="true" />
            <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/>
           
           
            <DxColumn
                data-field="name"
                caption="Tên chủ rừng"
                
            >
            <DxRequiredRule/>
            </DxColumn>
            <DxColumn
                data-field="Xa"
                caption="Xã"
            >
            <DxRequiredRule/>
            </DxColumn>
             <!-- <DxColumn
                data-field="COC"
                caption="FSC"
            >
            <DxRequiredRule/>
            </DxColumn> -->
            <DxColumn
                data-field="Tinh"
                caption="Tỉnh/Huyện"
               
            >
            </DxColumn>
              <DxColumn
                data-field="SOCHUNGCHI"
                caption="Số chứng chỉ"
           
            >
            </DxColumn>
             <!-- <DxColumn
                data-field="staff"
                caption="Nhân Viên"
            >
            <DxRequiredRule/>
                 <DxLookup
                    :data-source="staff"
                    display-expr="name"
                   value-expr="code"
                    
                    />
            </DxColumn>
        
            <DxColumn
                data-field="COHD"
                caption="Xuất HĐ"
                cell-template="cellTemplate"
            >
            <DxRequiredRule/>
                 <DxLookup
                    :data-source="hoadon"
                    display-expr="name"
                    value-expr="code"
                    />
            </DxColumn>
            <DxColumn
                data-field="COC"
                caption="FSC"
                 cell-template="FSC-cellTemplate"
            >
            <DxRequiredRule/>
                 <DxLookup
                    :data-source="coc"
                    display-expr="name"
                    value-expr="code"
                    />
            </DxColumn> -->
            
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
            dskho:[],
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
        // Promise.all([this.load(),this.loadGroup(),this.loadKho()])
    },
    methods:{
        async loadKho(){
            this.dskho= this.$store.getters['base/myKhoCBG']
        },
        async load(){
            const data = await this.$store.dispatch('nlg/GET_DS_CHU_RUNG')
            this.dinhmucs = data.data
        },
        async loadStaff(){
            const data = await this.$store.dispatch('nlg/GET_GROUP_QUI_CACH')
            this.groups = data.data
        },
        async add(e){
            const data = await this.$store.dispatch('nlg/ADD_CHU_RUNG',e.data)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
           async del(e){
              console.log('qui cach:',e.data.id)
            const data = await this.$store.dispatch('nlg/DEL_CHU_RUNG',e.data)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
        async update(e){
            const data = await this.$store.dispatch('nlg/UPDATE_CHU_RUNG',e)
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