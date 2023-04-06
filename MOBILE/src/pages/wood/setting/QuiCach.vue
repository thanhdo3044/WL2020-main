<template>
  <q-page class="q-pa-md">
      <div class="row">
          <div class="col-12">
              <card-ribbon :name="'Cài đặt qui cách'">
                   <template v-slot:content>
                        <DxDataGrid
              :data-source="items"
              :show-borders="true"
              key-expr="id"
              :word-wrap-enable="true"
              :allow-column-reordering="true"
              @editorPreparing="onEditorPreparing"
              @row-inserted="insert"
              @row-updated="updated"
            >
            <DxEditing
                :allow-updating="true"
                :allow-adding="true"
                mode="row"
              />
              <DxColumn
                data-field="id"
                caption="ID"
                width="50"
              />
                <DxColumn
                data-field="code"
                caption="Mã qui cách"
                width="200"
              >
              <DxRequiredRule/>
              </DxColumn>
              <DxColumn
                data-field="name"
                caption="Tên qui cách"
              >
              <DxRequiredRule/>
              </DxColumn>
              <DxColumn
                data-field="height"
                caption="Dầy"
                data-type="number"
                width="70"
              >
              
              <DxRequiredRule/>
              </DxColumn>
               <DxColumn
                data-field="width"
                caption="Rộng"
                 data-type="number"
                 width="70"
              >
              
              <DxRequiredRule/>
              </DxColumn>
              <DxColumn
                data-field="length"
                caption="Dài"
                 data-type="number"
                 width="60"
            >
                <!-- <DxLookup
                :data-source="regions"
                display-expr="Dài"
                value-expr="length"
                /> -->
            </DxColumn>
              <DxColumn
                data-field="volumn"
                caption="Khối lượng/đơn vị"
                 data-type="number"
                 width="100"
              >
              <DxRequiredRule/>
              </DxColumn>
              <DxColumn
                data-field="unit.id"
                caption="Đơn vị"
                 width="100"
              >
              <DxLookup
                :data-source="unit"
                display-expr="name"
                value-expr="id"
                />
              <DxRequiredRule/>
              </DxColumn>
            </DxDataGrid>
                    </template>
              </card-ribbon>
          </div>
      </div>
  </q-page>
</template>

<script>
import CardRibbon from '../../../components/wood/CardRibbon'
import { DxDataGrid, DxColumn, DxEditing, DxLookup,DxRequiredRule,DxGroupItem,
 DxSummary,DxTotalItem } from 'devextreme-vue/data-grid';
export default {
    components:{
        'card-ribbon':CardRibbon,
        DxDataGrid,
        DxColumn,
        DxEditing,
        DxLookup,
        DxRequiredRule,
        DxSummary,DxTotalItem,
        DxGroupItem
    },
    data () {
        return {
            items:[],
            unit:[
                {
                    id:100001,
                    name:'Tấm'
                }
            ]
        }
    },
    created(){
        this.loadData()
    },
    methods:{
        async loadData(){
            let data = await this.$store.dispatch('wood/GET_ITEM_BY_MODULE_ID',this.$store.state.base.moduleSelected.id)
            this.items =data.data
        },
        async insert(e){
            let payload = {
                code: e.data.code,
                name:e.data.name,
                length:e.data.length,
                width:e.data.width,
                height:e.data.height,
                unitId:e.data.unit.id,
                volumn:e.data.volumn,
                moduleId:this.$store.state.base.moduleSelected.id
            }
            let data = await this.$store.dispatch('base/CREATE_ITEM',payload)
            if (data.meta.success) {
                this.$q.notify({
                    message:'Thêm thành công !',
                    color:'green'
                })
            }else {
                this.$q.notify({
                    message:data.meta.messages.message,
                    color:'red'
                })
            }
        },
        async updated(e){
            let payload = {
                id:e.data.id,
                data: e.data
            }
            let data = await this.$store.dispatch('base/UPDATE_ITEM',payload)
            if (data.meta.success) {
                this.$q.notify({
                    message:'Cập nhật thành công !',
                    color:'green'
                })
            }else {
                this.$q.notify({
                    message:data.meta.messages.message,
                    color:'red'
                })
            }
        },
        onEditorPreparing(){

        }
    }
}
</script>

<style>

</style>