<template>
  <q-page class="q-pa-md">
      <div class="row justify-center">
          <div class="col-12">
              <q-card>
                  <q-card-section>
                      <h5>Danh sách yêu cầu phê duyệt bảng giá</h5>
                  </q-card-section>
                  <q-card-section>
                      <table-request :dataSource="dataRequest" :showApproval="true"/>
                  </q-card-section>
              </q-card>
          </div>
          
      </div>
  </q-page>
</template>

<script>
import TableRequest from '../../components/wood/TableRequest'
export default {
    components: {
        'table-request': TableRequest
    },
    data () {
        return {
            dataRequest  : []
        }
    },
    created() {
        Promise.all([this.loadRequest()])
    },
    methods: {
        loadRequest() {
            return new Promise(async(resolve,reject)=>{
                let data = await this.$store.dispatch('wood/GET_MY_REQUEST')
                this.dataRequest = data.data
                resolve(true)
            })
        }
    }
}
</script>

<style>

</style>