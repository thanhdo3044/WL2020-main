<template>
  <q-page class="q-pa-md">
      <div class="row">
          <h6>Nhập kho</h6>
      </div>
      <div class="row justify-center">
          <div class="col-12 col-sm-6">
             <div class="row">
                  <div class="col-12">
                      <q-select v-model="type" :options="types" label="Hình thức nhập"  />
                  </div>
             </div>
             <div class="row">
                 <div class="col-12">
                     <q-select v-model="item" use-input input-debounce="0" @filter="filterFn" :options="items" label="Qui cách"  />
                 </div>
             </div>
             <div class="row">
                 <div class="col-12">
                     <q-input v-model.number="packageQty" type="number" label="Số bó" />
                 </div>
             </div>
             <div class="row">
                 <div class="col-12">
                     <q-input v-model.number="pcsOfpackageQty" type="number" label="Số thanh/bó" />
                 </div>
             </div>
             
             <div class="row q-mt-sm">
                 <p>Ghi chú</p>
                 <div class="col-12">
                      <q-input
                        v-model="note"
                        filled
                        type="textarea"
                        />
                 </div>
             </div>
             <div class="row q-mt-md">
                 <div class="col-12">
                     <q-btn color="primary" class="full-width"  label="Lưu lại" @click="save" />
                 </div>
             </div>
          </div>
      </div>
  </q-page>
</template>

<script>
export default {
    data(){
        return {
            type:{label:'Bình thường',value:'NOR'},
            types:[
                {label:'Bình thường',value:'NOR'},
                {label:'Hạ cấp',value:'H'},
                {label:'Hạ về loại C',value:'C'},
                {label:'Hạ về hàng loại',value:'L'},
            ],
            items:[],
            item:null,
            packageQty:'',
            pcsOfpackageQty:'',
            note:'',
            itemDupplicate:[]
        }
    },
    created(){
        this.loadItem()
    },
    methods:{
        async save(){

        },
        async loadItem(){
            const payload = {
                typeId: 100001
            }
            const data = await this.$store.dispatch('base/GET_ITEM_BY_TYPE',payload)
            data.data.forEach(element => {
                this.items.push({
                    value:element.id,
                    label:element.name + `(${element.height}${element.width}${element.length})`
                })
            })
            this.itemDupplicate = this.items
        },
        filterFn (val, update, abort) {
            update(() => {
                const needle = val.toLowerCase()
                this.items = this.itemDupplicate.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
            })
        }
    }
}
</script>

<style>

</style>