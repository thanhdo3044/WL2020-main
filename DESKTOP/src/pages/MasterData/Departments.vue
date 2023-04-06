<template>
    <q-page class="q-pa-md">
        <q-card class="my-card">
            <q-card-section>
                <div class="row">
                    <div class="top-title col-8">Danh mục Công đoạn</div>
                </div>
            </q-card-section>
            <q-card-section>
               <div class="row">
                   <div class="col-4">
                       Nhà máy : 
                   </div>
                   <div class="col-4">
                      <DxSelectBox
                        v-model="factory"
                        :accept-custom-value="false"
                        :data-source="factoryDataSource"
                        display-expr="Name"
                        />
                   </div>
               </div>
               <div class="row">
                   <div class="col-12">
                       
                   </div>
               </div>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script>
import { DxSelectBox } from 'devextreme-vue/select-box';
import DataSource from 'devextreme/data/data_source';
export default {
    components:{
        DxSelectBox
    },
    data(){
        return {
            factory:null,
            factorys:[],
            factoryDataSource:null
        }
    },
    created(){
        const fac = {
            ID: this.$store.getters['base/myFactoryInfor'].id,
            Name : this.$store.getters['base/myFactoryInfor'].name
        }
        this.factorys.push(fac)
        this.factory =  this.factorys[0]
        this.factoryDataSource = new DataSource({
            store: {
                data: this.factorys,
                type: 'array',
                key: 'ID'
            }
        });
    }
}
</script>

<style>

</style>