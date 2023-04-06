<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title" >
                      Danh sách yêu cầu phê duyệt bảng giá
                  </div>
              </div>
          </q-card-section>
          <q-separator spaced    />
          <q-card-section>
              <div class="row">
                  <div class="col-12 q-pa-sm">
                      <DxDataGrid
                            :data-source="dataSource"
                            :show-borders="true"
                            :no-data-text="'Không có dữ liệu !'"
                            :show-column-lines="true"
                            :allow-column-resizing="true"
                        >
                          <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/>
              <DxHeaderFilter :visible="true"/>
                        <DxColumn
                            data-field="no"
                            visible = true
                            caption="Mã yêu cầu"
                            cell-template="cellTemplateGUID"
                        />
                        <DxColumn
                            data-field="masp"
                            caption="Mã sản phẩm"
                        />
                         <DxColumn
                            data-field="createAt"
                            caption="Ngày yêu cầu"
                            data-type="date"
                            format="dd/MM/yyyy"
                        />
                        <DxColumn
                            data-field="reason"
                            caption="Lý do"
                        />
                         <DxColumn
                            data-field="createBy"
                            caption="Người tạo"
                        />
                        <DxColumn
                            data-field="approval"
                            caption="Phê duyệt"
                            cell-template="cellTemplate"
                        />
                        <template #cellTemplateGUID="cell">
                            <div>
                           <span  @click="view(cell.data.data.no)" class="fake-link">{{cell.data.data.masp}}</span>
                           
                            </div>
                        </template>
                         <template #cellTemplate="cell">
                            <div>
                                <q-badge color="blue" v-if="cell.data.data.approval.trim()==='Y'">
                                    Đã duyệt
                                </q-badge>
                                <span  v-if="cell.data.data.approval.trim()==='P'" @click="view(cell.data.data.no)" class="fake-link">Chờ phê duyệt</span>
                                <q-badge color="red" v-if="cell.data.data.approval.trim()==='N'">
                                    Từ chối
                                </q-badge>
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
  DxFilterRow,
  DxPaging,
  DxSearchPanel,
  DxEditing,
  DxRequiredRule,
  DxExport,DxHeaderFilter,DxSummary,DxGroupItem,DxTotalItem,DxLookup
} from 'devextreme-vue/data-grid';

export default {
    components:{
        DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxFilterRow,
    DxSearchPanel,
    DxEditing,
    DxRequiredRule,
    DxExport,DxHeaderFilter,DxSummary,DxGroupItem,DxTotalItem,DxLookup
    },
    data(){
        return {
            dataSource:[]
        }
    },
    created(){
        this.load()
    },
    methods:{
        async load(){
            const data = await this.$store.dispatch('nlg/GET_REQ_COST')
            this.dataSource =data.data
        },
        view(reqNo){
            if (this.$store.state.base.userInfo.id == 101674 ||this.$store.state.base.userInfo.id == 101659 ||this.$store.state.base.userInfo.id == 102089)
            this.$router.push('/nlg-phe-duyet-bang-gia/'+reqNo)
        }
    }
}
</script>

<style>

</style>