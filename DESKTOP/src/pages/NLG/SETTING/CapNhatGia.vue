<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title">
                      Cập nhật bảng giá
                  </div>
              </div>
          </q-card-section>
          <q-separator spaced    />
          <q-card-section>
              <DxDataGrid
                id="gridContainer"
                :data-source="dataSource"
                :allow-column-reordering="true"
                :show-borders="true"
                >

                <DxPaging :enabled="true"/>
                <DxEditing
                    :allow-updating="true"
                    :allow-deleting="true"
                    :allow-adding="true"
                    mode="row"
                />

               <DxColumn
                    :width="125"
                    data-field="maSP"
                    caption="Mã sản phẩm"
                >
                    <DxLookup
                    :data-source="states"
                    display-expr="Name"
                    value-expr="ID"
                    />
                </DxColumn>
                <DxColumn data-field="cost" 
                caption="Giá mới"
                data-type="number"
                format="fixedpoint" />
                <DxColumn data-field="LastName"/>
                <DxColumn
                    :width="130"
                    data-field="Position"
                />
                
                <DxColumn
                    :width="125"
                    data-field="BirthDate"
                    data-type="date"
                />
                </DxDataGrid>
          </q-card-section>
      </q-card>
  </q-page>
</template>

<script>
export default {
    data(){
        return {
            dataSource:[],
            nlgo:[]
        }
    },
    methods:{
        async loadNlgo(){
            
        }
    }
}
</script>

<style>

</style>