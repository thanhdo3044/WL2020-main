<template>
  <q-page class="q-pa-md">
      <div class="row justify-center">
          <div class="prodTextTitle">
              Chọn 1 dự án
          </div>
      </div>
      <div class="row justify-center q-mt-sm">
        <div class="col-12 col-sm-6 q-ma-sm" v-for="project in projects" :key="project.id">
          <q-card>
            <q-card-section>
              <div class="prodTextTitle">
                  <p>{{project.name}}</p>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row">
                <div class="col-6">
                  Mã dự án :
                </div>
                <div class="col-6">
                  {{project.code}}
                </div>
              </div>
              <div class="row" v-if="project.customer.id">
                <div class="col-6">
                  Khách hàng : 
                </div>
                <div class="col-6">
                  {{project.customer.name}}
                </div>
              </div>
            </q-card-section>
            <q-card-section align="right">
              <q-btn @click="selectProject(project)" color="primary" glossy label="Chọn" />
            </q-card-section>
          </q-card>
        </div>
      </div>
      <q-inner-loading :showing="showLoading">
        <q-spinner-gears size="150px" color="primary" />
      </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  data(){
    return {
      showLoading:true,
      projects:[],
      items:[]
    }
  },
  created(){
    this.initData()
  },
  methods:{
    async initData(){
      const data = await this.$store.dispatch('funiture/ACTION_LOAD_PROJECTS')
      this.showLoading = false
      if (data.meta.success===true) {
        this.projects = data.data
      }else {
        this.$q.notify({
          message:data.meta.messages.message,
          color:'red'
        })
      }
    },
    selectProject(project){
      this.$store.dispatch('funiture/ACTION_SELECT_PROJECT',project)
      this.$router.go(-1)
    }
  }
}
</script>

<style>

</style>