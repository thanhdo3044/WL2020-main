<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title">
                     Danh sách Qui cách
                  </div>
                  <!-- <div class="col-2" align="right">
                      <q-btn color="primary"  label="Thêm Qui Cách" @click="showAdd = true" />
                  </div> -->
              </div>
          </q-card-section>
          <q-separator spaced />

            <q-card-section v-show="showAdd">
                <q-card>
                    <q-card-section class="row items-center">
                        <div class="col-12 top-title">Thêm qui cách mới</div>
                    </q-card-section>
                    <q-separator spaced    />
                    <q-card-section>
                        <div class="row q-pa-sm">
                            <div class="col-12 col-sm-4 q-pa-sm">
                                <q-input v-model="code" type="text" label="Mã Qui cách "  />
                            </div>
                            <div class="col-12 col-sm-4 q-pa-sm">
                                <q-input v-model="name" type="text" label="Tên Qui cách" />
                            </div>
                            <div class="col-12 col-sm-4 q-pa-sm">
                                <q-input v-model="haigia" type="text" label="Qui cách 2 giá(điền H)" />
                            </div>
                            <div class="col-12 col-sm-4 q-pa-sm">
                                <q-input v-model="day" type="text" label="Dày" />
                            </div>
                            <div class="col-12 col-sm-4 q-pa-sm">
                                <q-input v-model="rong" type="text" label="Rộng" />
                            </div>
                            <div class="col-12 col-sm-4 q-pa-sm">
                                <q-input v-model="dai" type="text" label="Dài" />
                            </div>
                            <div class="col-12 q-pa-sm">
                                <q-select class="full-width" filled v-model="nhomqc" :options="nhoms" @filter="filterFn" label="Nhóm qui cách"  use-input />
                            </div>
                        </div>
                    </q-card-section>
                    <q-separator spaced    />
                    <q-card-section v-if="haigia">
                        <DxDataGrid
                            id="gridContainer"
                            :data-source="dataSource"
                            :allow-column-reordering="true"
                            :show-borders="true"
                            key-expr="ID"
                            >
                            <DxEditing
                                :allow-updating="true"
                                :allow-deleting="true"
                                :allow-adding="true"
                                mode="row"
                            />
                            <DxColumn data-field="masp" caption="Mã Giá sản phẩm"/>
                            <DxColumn data-field="cost" caption="Giá" data-type="number" format="fixedpoint"/>
                            </DxDataGrid>
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn flat label="Hủy" color="primary" v-close-popup />
                        <q-btn flat label="Đồng ý" @click="addQuiCach" color="primary" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-card-section>

          <q-card-section>
               <DxDataGrid
                :data-source="quicachs"
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
                :allow-adding="false"
                :allow-deleting="true"
                mode="row"
            />
            <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Danh sách qui cách'"
            />
            <DxHeaderFilter :visible="true"/>
            <DxGroupPanel :visible="false" :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'" />
            <DxGrouping :auto-expand-all="true" />
            <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/>
             <DxColumn
                data-field="GROUP_QC"
                caption="Phân nhóm QC"
                 width="200"
            />
            <DxColumn
                data-field="code"
                caption="Mã qui cách"
                  width="120"
            />
             <DxColumn
                data-field="name"
                caption="Tên qui cách"
            />
            <DxColumn
                caption="Qui Cách"
                alignment="center"
            >
              <DxColumn
                caption="Dầy"
                data-field="day"
                format="##0.##"
                alignment="center"
                width="80"
              />
              <DxColumn
                caption="Rộng"
                data-field="rong"
               format="##0.##"
                alignment="center"
                width="80"
              />
              <DxColumn
                caption="Dài"
                data-field="dai"
               format="##0.##"
                alignment="center"
                width="80"
              />
            </DxColumn>
            <DxColumn
                data-field="nhom"
                caption="Nhom qui cach"
            >
                 <DxLookup
                    :data-source="groups"
                    display-expr="name"
                    value-expr="id"
                    />
            </DxColumn>
             <DxColumn
                caption="sử dụng"
                data-field="useFLAG"
                
                alignment="center"
                width="180"
                 cell-template="sudung-cellTemplate"
              >
               <DxLookup
                    :data-source="sudung"
                    display-expr="name"
                    value-expr="code"
                    />
                    </DxColumn>
                      <DxColumn
                caption="Vượt NCC"
                data-field="VUOTNCC"
              
                alignment="center"
                width="80"
              />
              <template #sudung-cellTemplate="cell">
               <div v-if="cell.data.value.toString().trim()==='Y'">Đang sử dụng</div>
               <div v-else>Không sử dụng</div>
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
  DxExport,DxHeaderFilter,DxSummary,DxGroupItem,DxTotalItem,DxLookup
} from 'devextreme-vue/data-grid';
import { showNotifySuccess, showNotifyError, showNotifyValidate } from '../../../ultils';
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
        DxExport,DxHeaderFilter,DxSummary,DxGroupItem,DxTotalItem
    },
    data(){
        return {
            quicachs:[],
            groups:[],
            showAdd:false,
            code:'',
            name:'',
            day:'',
            rong:'',
            dai:'',
            nhomqc:null,
            nhoms:[],
              sudung:[
                {code:'Y',name:'đang sử dụng'},
                {code:'N',name:'không sử dụng'}
            ],
            dataSource:[]
        }
    },
    created(){
        Promise.all([this.load(),this.loadGroup()])
    },
    methods:{
        async addQuiCach(){
            this.tontai = 0
            this.quicachs.forEach(element => {
                if (element.day == this.day && element.rong == this.rong && element.dai == this.dai)
                this.tontai = 1
            });
            if (this.tontai == 1)
            {
                this.$q.dialog({
            html: true,
            message: `<span class="text-red"> Quy cách đã tồn tại </span>`,
          });
            } else {
            if (this.day&&this.rong&&this.dai
            &&this.nhomqc&&this.code&&this.name
            ) {
                const volumn = parseFloat(this.day)*parseFloat(this.rong)*parseFloat(this.dai)*Math.pow(10,-9)
                const payload = {
                    code:this.code,
                    name:this.name,
                    day:this.day,
                    rong:this.rong,
                    dai:this.dai,
                    volumn:volumn,
                    nhom:this.nhomqc.value,
                    dacbiet:this.haigia,
                    dataPrice:this.dataSource.length >0?this.dataSource:this.code,
                    uid:this.$store.state.base.userInfo.account
                }
                const data = await this.$store.dispatch('nlg/ADD_QUI_CACH_OPTIONS',payload)
                if (data.meta.success) {
                    showNotifySuccess()
                    this.showAdd = false
                    this.load()
                } else {
                    showNotifyError()
                }
            }else{
                showNotifyValidate()
            }
            }
        },
        async load(){
            const data = await this.$store.dispatch('nlg/GET_QUI_CACH_H')
            this.quicachs = data.data
        },
        async loadGroup(){
            const data = await this.$store.dispatch('nlg/GET_GROUP_QUI_CACH')
            this.groups = data.data
            data.data.forEach(element => {
                this.nhoms.push({
                    label:element.name,
                    value:element.id
                })
            });
        },
          async filterFn(val, update) {

      if (val === "") {
        update(() => {
            this.groups.forEach(element => {
                this.nhoms.push({
                    label:element.name,
                    value:element.id
                })
            });
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.nhoms = this.nhoms.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
        async add(e){
            const data = await this.$store.dispatch('nlg/ADD_QUI_CACH',e.data)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
          async del(e){
              console.log('qui cach:',e.data.id)
            const data = await this.$store.dispatch('nlg/DEL_QUI_CACH',e.data)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
        async update(e){
            
            const data = await this.$store.dispatch('nlg/UPDATE_QUI_CACH',e.data)
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