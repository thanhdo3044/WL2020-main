<template>
  <q-page class="q-pa-md">
     <div class="row">
         <div class="col-12 col-md-3 q-pa-sm">
             <DxTreeView
        id="simple-treeview"
        :ref="refer"
        :items="departments"
        :search-enabled="true"
        @item-click="selectDepartment"
        display-expr="name"
        :auto-expand-all="true"
        selection-mode="single"
        :selected-row-keys.sync="selectedRowKeys"
    />
     </div>
     <div class="col-12 col-md-9 q-pa-sm" v-if="objectNotEmpty(dataSelect)">
          <q-card class="my-card">
          <q-card-section>
              <div class="row">
                  <div class="col-12 top-title">
                      Khai báo thông số OSCP  {{dataSelect.name || ''}}
                  </div>
              </div>
          </q-card-section>
          <q-separator spaced    />
          <q-card-section>
              <div class="row">
                  <div class="col-12">
                      <SelectBox :defaultValue="item" :refer="'selectBoxSP'"  :onChange="chonSP" :dataSource="items" :title="'Chọn chi tiết/Sản phẩm '"/>
                  </div>
              </div>
          </q-card-section>
          <div class="row q-pl-md">
              <div class="col-8">
                  <h6>Danh mục các thông số OSCP tổ/nhóm {{dataSelect.name || ''}}</h6>
              </div>
              <div class="col-4 q-pa-md" align="right" v-show="item">
                  <q-btn flat class="q-mt-lg" color="primary"  label="Thêm danh mục" @click="showFormAdd = true" />
              </div>
          </div>
          <q-separator spaced   class="q-mt-sm" />
          <q-card-section class=" q-mt-sm" v-show="showFormAdd">
              <FormAddOSCP :changeName="changeName" :saveDanhMuc="saveDanhMuc" :chonCN="chonCN" 
              :chonTg1="chonTg1" :soLaoDong="soLaoDong"
              :chonCongSuatMay="chonCongSuatMay" 
              :chonTonKho="chonTonKho" :chonTg3="chonTg3" 
              :tgian2="tgian2" :dienNang="dienNang" />
          </q-card-section>
          <!-- show list oscp -->
          <q-card-section v-show="showDetail">
              <div class="row q-mt-sm" v-if="dataOSCP.length>0">
                  <div class="col-12">
                      <OSCPTable v-for="os in dataOSCP" v-bind:key="os.id" :oscp="os" :edit="eventEdit" :del="eventDel" />
                  </div>
              </div>
              <div class="row q-mt-sm" v-else>
                  <div class="col-12" align="center">
                      <h5>Không có dữ liệu !</h5>
                  </div>
              </div>
          </q-card-section>
          <!-- end show list -->
      </q-card>
     </div>
     <div class="col-12 col-md-9" align="center" v-else>
         <h3>Hãy chọn 1 công đoạn !</h3>
     </div>
     </div>
     <q-dialog v-model="showEdit" persistent>
         <q-card style="min-width:70%">
             <q-card-section class="row items-center">
                <div class="row">
                    <div class="col-12 top-title">
                        Cập nhật danh mục OSCP
                    </div>
                </div>
             </q-card-section>
             <q-separator spaced    />
             <q-card-section>
                 <div class="row q-pa-md">
                     <div class="col-12">
                         <q-input v-model="edit_name" type="text" label="Tên danh mục (tên máy)" />
                     </div>
                     <div class="col-12">
                         <q-input v-model.number="edit_soCongNhan" type="number" label="Số công nhân (người)" />
                     </div>
                     <div class="col-12">
                         <q-input v-model.number="edit_thoiGianHoanThanhChiTiet" type="number" label="Thời gian hoàn thành chi tiết (CĐ) (s)" />
                     </div>
                     <div class="col-12">
                         <q-input v-model.number="edit_soCongLaoDongTrenChuKy" type="number" label="Số công lao động/chu kỳ (công)" />
                     </div>
                     <div class="col-12">
                         <q-input v-model.number="edit_tongThoiGianChuKy" type="number" label="Tổng thời gian chu kỳ (s)" />
                     </div>
                     <div class="col-12">
                         <q-input v-model.number="edit_congSuatMay" type="number" label="Công suất máy (kW)" />
                     </div>
                     <div class="col-12">
                         <q-input v-model.number="edit_dienNangTrenChuKy" type="number" label="Điện năng/chu kỳ (kWh)" />
                     </div>
                     <div class="col-12">
                         <q-input v-model.number="edit_tonKhoCongDoan" type="number" label="Tồn kho công đoạn (pcs)" />
                     </div>
                     <div class="col-12">
                         <q-input v-model.number="edit_thoiGianVanChuyen" type="number" label="Thời gian vận chuyển & lưu công đoạn (s)" />
                     </div>
                 </div>
             </q-card-section>
             <q-card-actions align="right">
                 <q-btn flat label="Hủy" color="red" v-close-popup />
                 <q-btn flat label="Đồng ý" @click="saveOscp" color="primary" v-close-popup />
             </q-card-actions>
         </q-card>
     </q-dialog>
     <q-dialog v-model="showDel" persistent>
         <q-card>
             <q-card-section class="row items-center">
                <div class="col-12 top-title">
                    Xác nhận xóa danh mục OSCP
                </div>
             </q-card-section>
             <q-separator spaced    />
             <q-card-section>
                <OSCPTable :showAction="false" :oscp="oscp_del" />
             </q-card-section>
             <q-card-actions align="right">
                 <q-btn flat label="Hủy" color="primary" v-close-popup />
                 <q-btn flat label="Đồng ý" @click="delOscp" color="primary" v-close-popup />
             </q-card-actions>
         </q-card>
     </q-dialog>
  </q-page>
</template>

<script>
import OSCPTable from '../../components/Prod/OSCPTbale'
import FormAddOSCP from '../../components/Prod/FormAddOscp'
import NumberBox from '../../components/commons/NumberBox'
import SelectBox from '../../components/commons/SelectBoxInt'
import DxTreeView from 'devextreme-vue/tree-view';
import {isObjectEmpty, showNotifyError,list_to_tree, showLoadingIos, closeLoading, roundNumber, showNotifyValidate, showNotifySuccess } from '../../ultils'
export default {
    components:{
        DxTreeView,
        SelectBox,
        NumberBox,
        FormAddOSCP,
        OSCPTable
    },
    data () {
    return {
        edit_name:'',
        showEdit:false,
        showDel:false,
        departments:[],
        items:[],
        dataSelect:{},
        item:null,
        name:'Rong',
        soluongcongnhan:0,
        tgian1:0,
        factoryId:null,
        dataOSCP:[],
        showFormAdd:false,
        soLaoDong:0,
        tgian2:0,
        congSuatMay:0,
        dienNang:0,
        tonKho:0,
        tgian3:0,
        edit_soCongNhan:0,
        edit_thoiGianHoanThanhChiTiet:0,
        edit_soCongLaoDongTrenChuKy:0,
        edit_tongThoiGianChuKy:0,
        edit_congSuatMay:0,
        edit_dienNangTrenChuKy:0,
        edit_tonKhoCongDoan:0,
        edit_thoiGianVanChuyen:0,
        oscp_del:{},
        edit_id:null,
        showDetail:false,
        selectedRowKeys:[],
        refer:'treelist'
    }
  },
  created(){
    let myDepartments = this.$store.getters['base/mySources']
    // console.log(list_to_tree(myDepartments))
    this.departments = list_to_tree(myDepartments)
    
  },
  mounted(){
    const queryDepartmentId = this.$route.query.d
    const queryItemId = this.$route.query.i
    if (queryDepartmentId) {
        this.selectedRowKeys = []
        this.selectedRowKeys.push(parseInt(queryDepartmentId))
        const dept = this.$store.getters['base/mySources'].find(d=>{ return d.id===parseInt(queryDepartmentId)})
        this.dataSelect = dept
    }
    if (queryItemId) {
        this.item = parseInt(queryItemId)
    }
    if (queryItemId&&queryDepartmentId) {
        this.loadItem()
        this.loadOSCPbyDepartmentAndItem(queryDepartmentId,queryItemId)
        // const tree = this.$refs[this.refer].instance
    //   console.log(this.selectRow(queryDepartmentId))
    // tree.refresh()
    // this.$refs[this.refer].instance.selectRows([queryDepartmentId],true)
        // setTimeout(() => {
        //     // this.selectRow(parseInt(queryDepartmentId))
        //     this.refreshTreeList()
        // }, 2000);
    }
    
  },
  computed: {
        treeList: function() {
            return this.$refs.treelist.instance;
        }
    },
  methods:{
    selectRow(key){
        this.treeList.selectRows([key],true).then(()=>{

        }).catch(er=>{
            console.log(er)
        })
    },
    refreshTreeList() {
        this.treeList.refresh()
            .then(function() {
                // ...
                console.log('refresh')
            })
            .catch(function(error) {
                
                console.log(err)
            });
    },
    objectNotEmpty(obj){
        return !isObjectEmpty(obj)
    },
    async delOscp(){
        const data = await this.$store.dispatch('prod/DEL_OSCP',this.oscp_del.id)
        if (data.meta.success) {
            showNotifySuccess()
            this.loadOSCPbyDepartmentAndItem(this.dataSelect.id,this.dataSelect.itemId)
        }else{
            showNotifyError()
        }
    },
    eventEdit(e){
        this.edit_name = e.tenMay
        this.edit_soCongNhan = e.soCongNhan
        this.edit_thoiGianHoanThanhChiTiet = e.thoiGianHoanThanhChiTiet
        this.edit_soCongLaoDongTrenChuKy = e.soCongLaoDongTrenChuKy
        this.edit_tongThoiGianChuKy =e.tongThoiGianChuKy
        this.edit_congSuatMay = e.congSuatMay
        this.edit_dienNangTrenChuKy = e.dienNangTrenChuKy
        this.edit_tonKhoCongDoan = e.tonKhoCongDoan
        this.edit_thoiGianVanChuyen = e.thoiGianVanChuyen
        this.edit_id = e.id
        this.showEdit = true
    },
    eventDel(e){
        this.oscp_del = e
        this.showDel = true
    },
    changeName(e){
        this.name =e
    },
    chonSoLaoDong(e){
        //this.soLaoDong =e.value
    },
    chonTonKho(e){
        this.tonKho =e.value
        this.tgian2 = this.tinhTgian2()
        this.soLaoDong = this.tinhSoLaoDong()
        this.dienNang = this.tinhDienNang()
    },
    chonCongSuatMay(e){
        this.congSuatMay = e.value
        this.dienNang = this.tinhDienNang()
    },
    chonCN(e){
        this.soluongcongnhan = e.value
        this.soLaoDong = this.tinhSoLaoDong()
    },
    chonTg1(e){
        this.tgian1 =e.value
        this.tgian2 = this.tinhTgian2()
        this.soLaoDong = this.tinhSoLaoDong()
        this.dienNang = this.tinhDienNang()
    },
    chonTg3(e){
        this.tgian3 =e.value
    },
    async saveDanhMuc(){
        if (this.validateAddDanhMucOscp()) {
            const payload = {
                departmentId:this.dataSelect.id,
                itemId:this.item,
                tenMay:this.name,
                soCongNhan:this.soluongcongnhan,
                thoiGianHoanThanhChiTiet:this.tgian1,
                soCongLaoDongTrenChuKy:this.soLaoDong,
                tongThoiGianChuKy:this.tgian2,
                congSuatMay:this.congSuatMay,
                dienNangTrenChuKy:this.dienNang,
                tonKhoCongDoan:this.tonKho,
                thoiGianVanChuyen:this.tgian3
            }
            const data = await this.$store.dispatch('prod/ADD_OSCP',payload)
            if (data.meta.success) {
                showNotifySuccess()
                this.loadOSCPbyDepartmentAndItem()
                this.showFormAdd = false
            }else{
                showNotifyError()
            }
        }else{
            showNotifyValidate()
        }
    },
    async saveOscp(){
        if (this.edit_name.length>0&&this.edit_soCongNhan>0&&this.edit_thoiGianHoanThanhChiTiet>0
        &&this.edit_soCongLaoDongTrenChuKy>0&&this.edit_tongThoiGianChuKy>0
        &&this.edit_congSuatMay>0&&this.edit_dienNangTrenChuKy>0
        &&this.edit_tonKhoCongDoan>0) {
            const payload = {
                id:this.edit_id,
                tenMay:this.edit_name,
                soCongNhan:this.edit_soCongNhan,
                thoiGianHoanThanhChiTiet:this.edit_thoiGianHoanThanhChiTiet,
                soCongLaoDongTrenChuKy:this.edit_soCongLaoDongTrenChuKy,
                tongThoiGianChuKy:this.edit_tongThoiGianChuKy,
                congSuatMay:this.edit_congSuatMay,
                dienNangTrenChuKy:this.edit_dienNangTrenChuKy,
                tonKhoCongDoan:this.edit_tonKhoCongDoan,
                thoiGianVanChuyen:this.edit_thoiGianVanChuyen
            }
            const data = await this.$store.dispatch('prod/UPDATE_OSCP',payload)
            if (data.meta.success) {
                showNotifySuccess()
                this.loadOSCPbyDepartmentAndItem()
                this.showFormAdd = false
            }else{
                showNotifyError()
            }
        }else{
            showNotifyValidate()
        }
    },
    chonSP(e){
        this.item=e.value
        if (e.value) {
            this.loadOSCPbyDepartmentAndItem(this.dataSelect.id,e.value)
            // this.$router.push('/plan-o-s-c-p',{query:{d:this.dataSelect.id,i:e.value}}).catch(err => {
            //     console.log(err)
            // })
        }
    },
    selectDepartment(e){
        this.item = null
        this.dataSelect = e.itemData
        this.factoryId = e.itemData.factoryId
        this.loadItem()
        this.showDetail = false
    },
    async loadItem(){
        showLoadingIos()
        const data = await this.$store.dispatch('base/GET_ITEMS',{factoryId:this.factoryId || 100001,typeId:100003})
        this.items = data.data
        closeLoading()
    },
    async loadOSCPbyDepartmentAndItem(departmentId,itemId){
        this.showDetail = false
        showLoadingIos()
        const payload={
            departmentId:departmentId,
            itemId:itemId
        }
        const data = await this.$store.dispatch('prod/GET_OSCP',payload)
        this.dataOSCP = data.data
        this.showDetail = true
        // this.
        closeLoading()
    },
    tinhTgian2(){
        return this.tgian1*this.tonKho
    },
    tinhSoLaoDong(){
        const tg=  (this.tgian1*this.tonKho*this.soluongcongnhan)/(480*60)
        
        return roundNumber(tg,1)
    },
    tinhDienNang(){
        return roundNumber(this.tgian2/3600*this.congSuatMay,1)
    },
    validateAddDanhMucOscp(){
        if (this.name.trim().length>0&&this.tgian1>0&&this.congSuatMay>0&&this.soluongcongnhan>0&&this.tonKho>0&&this.tgian3>0) {
            return true
        }
        return false
    }
  }
}
</script>

<style>

</style>