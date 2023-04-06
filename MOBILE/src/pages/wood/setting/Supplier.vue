<template>
  <q-page class="q-pa-md">
      <div class="row">
          <div class="col-12">
              <card-ribbon :name="'Danh sách nhà cung cấp'">
                  <template v-slot:content>
                      <DxDataGrid
            :data-source="dataSource"
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
                    width="100" />
                <DxColumn
                data-field="code"
                caption="Mã nhà cung cấp"
                width="200"
              >
              <DxRequiredRule/>
              </DxColumn>
              <DxColumn
                data-field="name"
                caption="Tên nhà cung cấp"
              >
              <DxRequiredRule/>
              </DxColumn>
              <DxColumn
                data-field="address"
                caption="Địa chỉ"
              >
              
              <DxRequiredRule/>
              </DxColumn>
              <DxColumn
                data-field="regionId"
                caption="Bảng giá"
            >
                <DxLookup
                :data-source="regions"
                display-expr="NAME"
                value-expr="ID"
                />
            </DxColumn>
            </DxDataGrid>
                  </template>
              </card-ribbon>
          </div>
      </div>
  </q-page>
</template>

<script>
import { DxDataGrid, DxColumn, DxEditing, DxLookup,DxRequiredRule,DxGroupItem,
 DxSummary,DxTotalItem } from 'devextreme-vue/data-grid';
import CardRibbon from '../../../components/wood/CardRibbon'
export default {
    components: {
        DxDataGrid,
        DxColumn,
        DxEditing,
        DxLookup,
        DxRequiredRule,
        DxSummary,DxTotalItem,
        DxGroupItem,
        'card-ribbon':CardRibbon
    },
    data () {
        return {
            dataSource: [],
            regions:[]
        };
    },
    created(){
        Promise.all([this.initData(),this.loadRegion()])
    },
    methods: {
        async updated(e){
            let payload = {
                id:e.data.id,
                data: {
                    name:e.data.name,
                    active:1,
                    address:e.data.address,
                    regionId:e.data.regionId
                }
            }
            let data  = await this.$store.dispatch('wood/UPDATE_VENDOR',payload)
            if (data.meta.success===true) {
                this.$q.notify({
                    message:'Thành công !',
                    color:'green'
                })
            }else {
                this.$q.notify({
                    message:data.meta.message ,
                    color:'red'
                })
            }
        },
        async insert(e){
            let payload = {
                code:e.data.code,
                name:e.data.name,
                active:1,
                address:e.data.address,
                moduleId:this.$store.state.base.moduleSelected.id
            }
            let data  = await this.$store.dispatch('wood/POST_VENDOR',payload)
            if (data.meta.success===true) {
                this.$q.notify({
                    message:'Thành công !',
                    color:'green'
                })
            }else {
                this.$q.notify({
                    message:data.meta.message ,
                    color:'red'
                })
            }
        },
        async initData(){
            let dataSupplier = await this.$store.dispatch('wood/GET_VENDORS',this.$store.state.base.moduleSelected.id)
            this.dataSource = dataSupplier.data
        },
        onEditorPreparing(e) {
            if (e.dataField === 'id') {
                e.editorOptions.disabled = true
            }
        },
        async loadRegion(){
            let dataRegion = await this.$store.dispatch('wood/GET_REGION',this.$store.state.base.moduleSelected.id)
            this.regions = dataRegion.data
        }
    }
}
</script>

<style>

</style>