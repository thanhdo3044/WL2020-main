<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title">
                      Nhập kế hoạch đơn hàng
                  </div>
              </div>
          </q-card-section>
          <q-card-section>
              <div class="row">
                  <div class="col-12">
                      <SelectBox :dataSource="items" :title="'Chọn sản phẩm :'"  :onChange="chonSP"/>
                      <div class="dx-field">
                        <div class="dx-field-label">Nhập số lượng</div>
                        <div class="dx-field-value">
                         <DxNumberBox
                            :value="0"
                            :show-spin-buttons="true"
                            :show-clear-button="true"
                            @value-changed="chonSL"
                        />
                        </div>
                    </div>
                        <DateBox :value="ngaydonggoi" :title="'Ngày đóng gói'" :displayFormat="'dd/MM/yyyy'"  :onChange="chonNgay"    />
                  </div>
              </div>
              <div class="row justify-end q-mt-md">
                  <div class="col-4" align="right">
                      <q-btn color="primary" icon="check" label="Lưu lại" @click="add" />
                  </div>
              </div>
          </q-card-section>
          <q-separator  inset   />
          <q-card-section class="q-mt-md">
              <div class="row q-pa-md">
                  <div class="col-12">
                      <DxDataGrid
                        :data-source="dataSource"
                        :show-borders="true"
                        :no-data-text="'Không có dữ liệu !'"
                        :show-column-lines="true"
                    >
                     <DxColumn
                        data-field="itemId"
                        caption="Sản phẩm"
                    >
                    <DxLookup
                        :data-source="items"
                        display-expr="name"
                        value-expr="id"
                        />
                    </DxColumn>
                    <DxColumn
                        data-field="quantity"
                        caption="Số lượng"
                        data-type="number"
                        format="fixedpoint"
                        width="150"
                    />
                    <DxColumn
                        data-field="onBoardDate"
                        caption="Ngày đóng gói"
                        data-tytpe="date"
                        format="dd/MM/yyyy"
                        width="200"
                    />
                    </DxDataGrid>
                  </div>
              </div>
          </q-card-section>
      </q-card>
  </q-page>
</template>

<script>
import {DxDataGrid, DxColumn, DxEditing, DxLookup} from 'devextreme-vue/data-grid';
import { DxNumberBox } from 'devextreme-vue/number-box';
import SelectBox from '../../components/commons/SelectBoxInt'
import DateBox from '../../components/commons/DateBox'
import { formatDateISO, showNotifyValidate, showNotifySuccess, showNotifyError } from '../../ultils';
export default {
    components:{
        SelectBox,
        DxNumberBox,
        DateBox,
        DxDataGrid,
         DxColumn, DxEditing, DxLookup
    },
    data () {
        return {
            items:[],
            item:null,
            quantity:0,
            ngaydonggoi:new Date(),
            dataSource:[],
            columns:['Ngày đóng gói', 'Sản phẩm', 'Số lượng']
        }
    },
    created(){
        Promise.all([this.load(),this.loadItem()])
    },
    methods:{
        async add(){
            if (this.quantity>0&&this.ngaydonggoi&&this.item) {
                const payload = {
                    itemId:this.item,
                    quantity:this.quantity,
                    onBoardDate:formatDateISO(this.ngaydonggoi)
                }
                const data = await this.$store.dispatch('prod/ADD_KE_HOACH_DON_HANG',payload)
                if (data.meta.success) {
                    showNotifySuccess()
                    this.load()
                    this.quantity = 0
                }else{
                    showNotifyError()
                }
            }else {
                showNotifyValidate()
            }
            
        },
        chonSP(e){
            this.item = e.value
        },
        chonSL(e){
            this.quantity = e.value
        },
        chonNgay(e){
            this.ngaydonggoi = e.value
        },
        async load(){
            const data = await this.$store.dispatch('prod/GET_KE_HOACH_DON_HANG')
            this.dataSource = data.data
        },
        async loadItem(){
            const data = await this.$store.dispatch('base/GET_ITEMS',{
                typeId:100003,
                factoryId:this.$store.getters['base/myFactoryInfor'].id
            })
            this.items = data.data
        }
    }
}
</script>

<style>

</style>