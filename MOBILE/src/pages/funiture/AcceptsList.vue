<template>
  <q-page class="q-pa-md">
      <transition-group
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
        <div key="key1" class="row justify-center">
            <div class="col-12 col-sm-6">
                <div class="prodTextTitle">Danh sách biên bản nghiệm thu</div>
            </div>
        </div>
        <div key="key2" class="row justify-center">
            <div class="col-12 col-sm-6 q-ma-sm" v-for="accept in accepts" :key="accept.id">
                <q-card>
                    <q-card-section>
                        <p class="prodTextTitle">
                            Số biên bản : {{accept.id}}
                        </p>
                        <p class="prodTextNormal" style="color:orange">Chủ đầu tư : {{accept.customer.name}} - {{accept.customer.address}}</p>
                        <p class="prodTextNormal">Hạng mục : {{accept.categories}} </p>
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn @click="selectAccept(accept)" color="primary" label="Xem chi tiết" />
                    </q-card-actions>
                </q-card>
            </div>
        </div>
      </transition-group>
    <q-page-sticky position="bottom-left" :offset="[18, 18]">
    <q-btn @click="show=true" fab icon="add" color="secondary" />
    </q-page-sticky>
      <q-inner-loading :showing="visible">
        <q-spinner-gears size="150px" color="primary" />
      </q-inner-loading>
      <q-dialog v-model="show">
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6" style="font-family: 'Time';font-weight:700">Form tạo biên bản nghiệm thu lắp đặt</div>
          <q-space />
        </q-card-section>

        <q-card-section>
          <div class="row ">
            <div class="col-12">
                <q-select  style="font-family:'Time New Roman';font-size:16px" 
                v-model="project" behavior="dialog" :options="projects" label="Chọn dự án :" />
            </div>
        </div>
        <div class="row q-mt-sm">
            <div class="col-12">
                <q-input outlined v-model="categories" label="Hạng mục :" />
            </div>
        </div>
        <div class="row q-mt-sm">
            <div class="col-12" align="right">
                <q-btn @click="create" label="Tạo biên bản" color="secondary" />
            </div>
        </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
    data () {
        return {
            accepts:[],
            visible:true,
            show:false,
            project:null,
            projects:[],
            categories:'',
        }
    },
    created(){
        Promise.all([this.initData(),this.loadProject()]).then(res=>{
            this.visible = false
        }).catch(err=>{
            console.log('promise all errror :'+err)
        })
    },
    methods:{
        async initData(){
            let data = await this.$store.dispatch('funiture/ACTION_GET_ACCEPTS')
            if (data.meta.success===true) {
                this.accepts = data.data
            }else {
                this.$q.notify({
                    message:data.meta.messages.message,
                    color:'red'
                })
            }
        },
        async loadProject(){
             let data = await this.$store.dispatch('funiture/ACTION_LOAD_PROJECTS')
             if (data.meta.success===true) {
                 data.data.forEach(element => {
                     const p = {
                         label:element.name+' -> '+ element.customer.name || '',
                         value:element.id
                     }
                     this.projects.push(p)
                 });
            }else {
                this.$q.notify({
                    message:data.meta.messages.message,
                    color:'red'
                })
            }
        },
        async create(){
            if (this.project&&this.categories.length>0) {
                const payload ={
                    projectId: this.project.value,
                    categories : this.categories
                }
                this.show = false
                this.visible = true
                let data = await this.$store.dispatch('funiture/ACTION_CREATE_ACCEPT')
                if (data.meta.success===true) {
                    await this.initData()
                    this.$q.notify({
                        message:'Tạo biên bản thành công !',
                        color:'green'
                    })
                    let newAccept = this.accepts.find((a)=>{ return a.id===data.data.id})
                    console.log(newAccept)
                    this.selectAccept(newAccept)
                    this.visible = false
                }else {
                    this.$q.notify({
                        message:data.meta.messages.message,
                        color:'red'
                    })
                }
            }else {
                this.$q.notify({
                    message:'Vui lòng nhập đủ thông tin !',
                    color:'red'
                })
            }
        },
        selectAccept(accept){
            this.$store.dispatch('funiture/ACTION_SELECT_ACCEPT',accept)
            this.$router.push({name:'detail-accept',params:{id:accept.id}})
        }
        
    }
}
</script>

<style>

</style>