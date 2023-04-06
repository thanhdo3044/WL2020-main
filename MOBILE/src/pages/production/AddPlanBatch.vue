<template>
  <q-page class="q-pa-md">
      <app-bar>Tạo kế hoạch sấy</app-bar>
      <div class="row q-mt-md">
          <div class="col-12">
              <q-stepper
      v-model="step"
      vertical
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Chọn lò sấy"
        icon="settings"
        :done="step > 1"
      >
        <div class="col-12">
            <q-select style="font-family:'Time New Roman';font-size:16px;text-align:center"
             v-model="kiln"
             :options="kilns"  label="Chọn lò  :" />
        </div>

        <q-stepper-navigation>
          <q-btn @click="step = 2" color="primary" label="Tiếp tục" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Chọn mục đích sấy"
        caption="Indoor/Outdoor"
        icon="create_new_folder"
        :done="step > 2"
      >
         <q-select @input="selectType" outlined v-model="type" :options="types" label="mục đích sấy" />

        <q-stepper-navigation>
          <q-btn @click="step = 3" color="primary" label="Tiếp tục" />
          <q-btn flat @click="step = 1" color="primary" label="Trở lại" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="3"
        title="Chọn chiều dầy"
        icon="assignment"
        :done="step > 3"
      >
      <q-select @input="selectHeight" outlined v-model="height" :options="heights" label="Chiều dầy" />
        <q-stepper-navigation>
          <q-btn @click="step = 4" color="primary" label="Tiếp tục" />
          <q-btn flat @click="step = 1" color="primary" label="Trở lại" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="4"
        title="Chiều dài sấy"
        icon="add_comment"
      >
        <q-input outlined v-model="length" label="Chiều dài sấy" />

        <q-stepper-navigation>
          <q-btn @click="submit" color="primary" label="Hoàn thành" />
          <q-btn flat @click="step = 2" color="primary" label="Trở lại" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
          </div>
      </div>
      <q-inner-loading :showing="showLoading">
        <q-spinner-gears size="150px" color="primary" />
      </q-inner-loading>
       <q-dialog v-model="showConfirm" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          
          <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn  !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" color="primary" @click="createBatch" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AppBar from '../../components/AppBar'
export default {
    components:{
        'app-bar':AppBar
    },
      computed: {
    ...mapGetters("base", ["myDepartments","userInfo"]),
      },
  
    data(){
        return {
            showLoading: true,
            showConfirm:false,
            step: 1,
            kilns: [],
            kiln:null,
            types:[],
            type:null,
            heights:[],
            height:null,
            rangeId:null,
            currentRanges:[],
            target:null,
            length:'0',
            stepNextId:null
        }
    },
    created(){
        this.initData()
        console.log('factory:',this.userInfo)
    },
    methods:{
        initData(){
            const token ='?'
            const payload ={
              token:token,
              factoryId:this.userInfo.factoryId
            }
         Promise.all([
             this.$store.dispatch('production/ACTION_GET_KILNS',payload),
             this.$store.dispatch('production/ACTION_GET_RANGES_BATCH')
         ]).then(r=>{
             let kilnsAvailible = this.$store.state.production.kilns.filter(k=>{
                return k.batch===null
             })
             kilnsAvailible.forEach(k=>{
                 const kil = {
                     label:k.name,
                     value:k.id
                 }
                 this.kilns.push(kil)
             })
             //dinh bien say
             let ranges = this.$store.state.production.batchRanges
             ranges.forEach(r=>{
                 if (this.types.indexOf(r.type)===-1) {
                     this.types.push(r.type)
                 }
             })

             this.showLoading = false
         })
        },
        selectKiln(index){
            this.kilns[index].isActive = true
            console.log(this.kilns)
        },
        selectType(val){
            let heightAvailible = this.$store.state.production.batchRanges.filter(t=>{
                return t.type===val
            })
            this.currentRanges = heightAvailible
            heightAvailible.forEach(db=>{
                if (this.heights.indexOf(db.height)===-1) {
                    this.heights.push(db.height)
                }
            })
            this.height=null
        },
        selectHeight(val){
            let rangSelect = this.currentRanges.find(r=>{
                return r.height ===val
            })
            this.rangeId =rangSelect.id
            this.target = rangSelect.timeOutTarget
            this.stepNextId = rangSelect.stepNextId
            console.log(this.rangeId)
        },
        submit(){
            if (this.kiln!==null&&this.type!==null&&this.height!==null&&this.length.length>0) {
                console.log('validate')
                this.showConfirm = true
            }else {
                this.$q.notify({
                    message:'Nhập thiếu thông tin !',
                    color:'red'
                })
            }
        },
        createBatch(){
            this.showConfirm = false
            this.showLoading = true
            const payload ={
                kilnId:this.kiln.value,
                data:{
                    token:this.$store.state.production.userInfo.token,
                    target:this.target,
                    length:this.length,
                    height:this.height,
                    stepNextId:this.stepNextId,
                    type:this.type
                }
            }
            this.$store.dispatch('production/ACTION_CREATE_BATCH',payload).then(res=>{
                this.showLoading = false
                this.$router.go(-1)
            })
        }
    }
}
</script>

