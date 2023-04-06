<template>
    <q-page class="q-pa-sm">
        <q-card class="my-card">
            <q-card-section>
                <div class="row">
                    <div class="col-10 top-title">
                        Danh sách phiếu nhập kho
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
                :show-row-lines="true"
                :allow-column-resizing="true"
                
            >
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Báo cáo sản xuất từ ngày '"
            />
            <DxHeaderFilter :visible="true"/>
            <DxGroupPanel :visible="true" :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'" />
            <DxGrouping :auto-expand-all="true" />
            <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/>
            <DxColumn
                data-field="sophieu"
                caption="Số phiếu"
            />
              <DxColumn
                data-field="ngaynhapht"
                caption="Ngày nhập kho"
                 width="150"
                  data-type="date"
                  format="dd/MM/yyyy"
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
                data-field="tenkho"
                caption="Tên Kho"
            />
             <DxColumn
                data-field="BIENSOXE"
                caption="Biển số xe"
            />
            <!-- <DxColumn
                data-field="xuongxenang"
                caption="xe nâng"
                cell-template="xenang-template"
            /> -->
            <DxColumn
                caption="..."
                cell-template="edit-template"
            />
             <template #edit-template="cell">
                <div>
                    <span v-if="cell.data.data.ALLOWHACAP.toString().trim()==='Y'" @click="view(cell.data.data.sophieu)" class="fake-link">Nghiệm thu</span>
                    <span v-else @click="go(cell.data.data.sophieu)" class="fake-link">Xem</span>
                    <!-- <q-btn flat v-if="cell.data.data.TINHTIEN.toString().trim()==='N'" color="primary" label="Nhập kho" @click="goAdd(cell.data.data.GUID)" />
                    <q-btn flat color="info" out icon="remove_red_eye"  label="Xem" @click="view(cell.data.data.GUID)" /> -->
                </div>
            </template>
            <template #xenang-template="cell">
               <div v-if="cell.data.value.toString().trim()==='Y'">Xe nâng</div>
               <div v-else>Xuống bằng tay</div>
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
import { mapGetters, mapActions } from "vuex";
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
            showAddPhieu:false,
            kho:null,
            dskho:[],
            today:'2020/04/03',
            dsNcc:[],
            ncc:null,
            guid:'',
            departments: [],
            dupplicateNcc:[],
            ngaynhapkho:new Date(),
            xuongxenang:[
                {id:'N',name:'Xưởng xuống tay'},
                {id:'Y',name:'Xuống xe nâng'}
            ],
            bsx:'',
            showConfirm:false,
            f_ngaynhapkho:'',
            f_kho:null,
            f_ncc:null,
            f_xuongxenang:null,
            f_bsx:''
        }
    },
    computed:{
       
        ...mapGetters("base",["userInfo"])
    },
    created(){
          if (this.userInfo.factoryId == 100000) this.f_kho = 'TH'
    if (this.userInfo.factoryId == 100003 || this.userInfo.factoryId == 100004) this.f_kho = 'YS1'
    if (this.userInfo.factoryId == 100005) this.f_kho = 'TB'
     if (this.userInfo.id == 101670 || this.userInfo.id == 101675 || this.userInfo.id == 102089 || this.userInfo.id == 101668
     || this.userInfo.id == 101669 || this.userInfo.id == 101881 || this.userInfo.id == 101781)
      this.f_kho = 'Phòng NLG'
     
       this.loadDepartment().then(() => {
    this.load();
       })
    },
    methods:{
        async load(){
            //  if (this.userInfo.account == '17Q202')
            // this.f_kho = 'YS1'
         
            //  if (this.userInfo.account == '17Q002')
            // this.f_kho = 'TB'
            
            //  if (this.userInfo.account == '04T049')
            // this.f_kho = 'TH'
            
            // console.log(this.userInfo.account)
            const data = await this.$store.dispatch('nlg/GET_DS_PHIEU_NHAP_KHO',{kho:this.f_kho})
            this.dataSource = data.data
        },
          async loadDepartment() {
      const data = await this.$store.dispatch("base/GET_DEPARTMENTS", {
        factoryId: this.$store.state.base.userInfo.departmentId,
      });
      this.departments = data.data;
    //   this.f_kho = this.departments[0].name
    //   console.log('phòng ban:',this.f_kho)
      
    },
        go(guid){
            this.$router.push('/nlg-bb-nghiem-thu/'+guid.replace('/','-'))
            
        },
        view(guid){
            this.$router.push({path: 'nlg-nghiem-thu1',query:{plan: guid.replace('/','-')}})
            // this.$router.push({name:'add-nghiem-thu',params:{id:guid.replace('/','-')}})
        },
    }
}
</script>

<style>

</style>