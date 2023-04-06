<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title">
                     Danh sách nhà cung cấp
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
            >
            <DxEditing
                :allow-updating="true"
                :allow-adding="true"
                mode="popup"
            />
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Danh sách nhà cung cấp '"
            />
            <DxHeaderFilter :visible="true"/>
            <DxGroupPanel :visible="true" :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'" />
            <DxGrouping :auto-expand-all="true" />
            <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/>
             <DxColumn
                data-field="code"
                caption="Mã NCC"
                
            >
            <DxRequiredRule/>
            </DxColumn>
            <DxColumn
                data-field="name"
                caption="Tên NCC"
                
            >
            <DxRequiredRule/>
            </DxColumn>
            <DxColumn
                data-field="address"
                caption="Địa chỉ"
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
                data-field="MX"
                caption="Mã xưởng xẻ"
               :width="120"
            >
            
            </DxColumn>
             <DxColumn
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
           <!-- <DxColumn
                data-field="vung"
                caption="Vùng(Giá)"
            >
            <DxRequiredRule/>
                 <DxLookup
                    :data-source="vung"
                    display-expr="name"
                    value-expr="code"
                    />
            </DxColumn> -->
            <!-- <DxColumn
                data-field="vung2"
                caption="Vùng(Vận chuyển)"
            >
            <DxRequiredRule/>
                 <DxLookup
                    :data-source="vung2"
                    display-expr="name"
                    value-expr="code"
                    />
            </DxColumn> -->
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
            </DxColumn>
            <template #cellTemplate="cell">
               <div v-if="cell.data.value.toString().trim()==='Y'">Có hóa đơn</div>
               <div v-else>Không có hóa đơn</div>
            </template>
             <template #FSC-cellTemplate="cell">
               <div v-if="cell.data.value.toString().trim()==='Y'">FSC 100%</div>
               <div v-else>NOT FSC</div>
            </template>
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
            const data = await this.$store.dispatch('nlg/GET_DS_NHA_CUNG_CAP')
            this.dinhmucs = data.data
        },
        async loadStaff(){
            const data = await this.$store.dispatch('nlg/GET_GROUP_QUI_CACH')
            this.groups = data.data
        },
        async add(e){
            const data = await this.$store.dispatch('nlg/ADD_NHA_CUNG_CAP',e.data)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
        async update(e){
            const data = await this.$store.dispatch('nlg/UPDATE_NHA_CUNG_CAP',e)
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