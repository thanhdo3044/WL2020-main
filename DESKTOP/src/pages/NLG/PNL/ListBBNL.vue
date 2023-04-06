<template>
    <q-page class="q-pa-sm">
        <q-card class="my-card">
            <q-card-section>
                <div class="row">
                    <div class="col-10 top-title">
                        Danh sách biên bản tính tiền
                    </div>
                </div>
            </q-card-section>
            <q-separator  inset   />
            <q-card-section>
               <div class="row">
                   <div class="col-12">
                       <DxDataGrid
                :data-source="dataSource"
                :show-borders="true"
                :no-data-text="'Không có dữ liệu !'"
                :show-column-lines="true"
                :allow-column-resizing="true"
                
            >
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Biên bản tính tiền '"
            />
            <DxHeaderFilter :visible="true"/>
            <DxGroupPanel :visible="false" :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'" />
            <DxGrouping :auto-expand-all="true" />
            <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/>
            <DxColumn
                data-field="sophieu"
                caption="Số phiếu"
            />
             <DxColumn
                data-field="mancc"
                caption="Mã NCC"
            />
            <DxColumn
                data-field="name"
                caption="Tên Nhà cung cấp"
            />
            <DxColumn
                data-field="makho"
                caption="Mã Kho"
            />
             <DxColumn
                data-field="ngaynhapht"
                caption="Ngày nhập(ht)"
                data-type="date"
                format="dd/MM/yyyy"
            />
             <!-- <DxColumn
                data-field="ngaynhaptt"
                caption="Ngày nhập(tt)"
                data-type="date"
                format="dd/MM/yyyy"
            /> -->
            <DxColumn
                caption="..."
                cell-template="edit-template"
              
            />
             <template #edit-template="cell">
                <div>
                    
                    <span  v-if="cell.data.data.tinhtien.toString().trim()==='Y' " @click="goAdd(cell.data.data.sophieu)" class="fake-link">Tính tiền</span>
                    <span v-if="cell.data.data.tinhtien.toString().trim()==='N'"  @click="view(cell.data.data.sophieu)"  class="fake-link">Xem</span>
                   
                </div>
            </template>
            </DxDataGrid>
                   </div>
               </div>
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
  DxExport,DxHeaderFilter,DxSummary,DxGroupItem
} from 'devextreme-vue/data-grid';
import { formatDateISO, showNotifyError, showNotifySuccess } from '../../../ultils'
export default {
    components:{
        DxDataGrid,
        DxColumn,
        DxGrouping,
        DxGroupPanel,
        DxPager,
        DxPaging,
        DxSearchPanel,
        DxExport,
        DxHeaderFilter,
        DxSummary,DxGroupItem,
       
    },
    
    data(){
        return {
            dataSource:[],
        }
    },
    created(){
        Promise.all([this.load()])
    },
    methods:{
        async load(){
            const data = await this.$store.dispatch('nlg/GET_DS_PHIEU_NHAP_LAI',{kho:'ALL'})
            this.dataSource = data.data
        },
        view(guid){
           let routeData = this.$router.resolve('/nlg-bb-tinh-tien-viewNL/'+guid.replace('/','-'))
           window.open(routeData.href, '_blank');
        },
        goAdd(guid){
            //console.log(data);
            //const sophieu = data.sophieu.replace('/','-')
          let routeData =  this.$router.resolve('/nlg-bb-tinh-tien-NL/'+guid.replace('/','-'))
          window.open(routeData.href, '_blank');
        },
    }
}
</script>

<style>

</style>