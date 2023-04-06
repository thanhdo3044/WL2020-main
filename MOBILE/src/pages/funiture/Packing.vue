<template>
  <q-page class="q-pa-md">
      <div class="row">
          <div class="col-12">
              <div class="prodTextTitle">
                  Danh sách phiếu xuất kho
              </div>
          </div>
          <div class="col-12">
              <q-input color="teal" outlined v-model="query" label="Tìm kiếm số phiếu">
                <template v-slot:append>
                <q-icon name="search" />
                </template>
            </q-input>
          </div>
      </div>
      <div class="row q-mt-sm justify-center">
          <div style="margin: 8px 8px 8px 0px;" class="col-12 col-sm-3" v-for="goodIssue in goodIssues" :key="goodIssue.id">
              <q-card class="bg-secondary" v-if="goodIssue.completed===1">
                  <q-card-section>
                      <div class="prodTextTitle">
                        Số phiếu :{{goodIssue.goodsIssueNumber}}
                      </div>
                  </q-card-section>
                  <q-separator></q-separator>
                  <q-card-section>
                    <div class="row">
                      <div class="col-6">Tên khách hàng :</div>
                      <div class="col-6">????</div>
                    </div>
                    <div class="row">
                      <div class="col-6">Lệnh xuất hàng :</div>
                      <div class="col-6">{{goodIssue.orderedGoods}}</div>
                    </div>
                    <div class="row">
                      <div class="col-6">Ngày giao hàng :</div>
                      <div class="col-6">{{goodIssue.deliverDate.toString().slice(0,10)}}</div>
                    </div>
                  </q-card-section>
                  <q-card-section align="right">
                    <q-btn @click="goDetail(goodIssue)" color="primary" glossy label="Xem chi tiết" />
                  </q-card-section>
              </q-card>
              <q-card v-else>
                  <q-card-section>
                      <div class="prodTextTitle">
                        Số phiếu :{{goodIssue.goodsIssueNumber}}
                      </div>
                  </q-card-section>
                  <q-separator></q-separator>
                  <q-card-section>
                    <div class="row">
                      <div class="col-6">Tên khách hàng :</div>
                      <div class="col-6">????</div>
                    </div>
                    <div class="row">
                      <div class="col-6">Lệnh xuất hàng :</div>
                      <div class="col-6">{{goodIssue.orderedGoods}}</div>
                    </div>
                    <div class="row">
                      <div class="col-6">Ngày giao hàng :</div>
                      <div class="col-6">{{goodIssue.deliverDate.toString().slice(0,10)}}</div>
                    </div>
                  </q-card-section>
                  <q-card-section align="right">
                    <q-btn @click="goDetail(goodIssue)" color="primary" glossy label="Xem chi tiết" />
                  </q-card-section>
              </q-card>
          </div>
          
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn @click="goCreate" fab icon="add" color="accent" />
          </q-page-sticky>
          <q-inner-loading :showing="showLoading">
        <q-spinner-gears size="150px" color="primary" />
      </q-inner-loading>
  </q-page>
</template>

<script>
export default {
    data(){
        return {
            query:'',
            goodIssues:[],
            showLoading:true
        }
    },
    created(){
      this.initData()
    },
    methods:{
        async initData(){
            let data = await this.$store.dispatch('funiture/ACTION_GET_GOOD_ISSUES')
            if (data.meta.success===true) {
              this.goodIssues = data.data
              const idQuery = this.$route.query.id
              
              const newGoodIssue = data.data.find((p)=>{ return p.id===parseInt(idQuery)})
              if (newGoodIssue) {
                this.goDetail(newGoodIssue)
              }
            }else {
              this.$q.notify({
                message:data.meta.messages.message,
                color:'red'
              })
            }
            this.showLoading = false
        },
        goCreate(){
            this.$router.push('/funiture-create-good-issue')
        },
        goDetail(goodIssue){
          this.$store.dispatch('funiture/ACTION_SELECT_GOOD_ISSUE',goodIssue)
          this.$router.push({name:'detail-good-issue',params:{id:goodIssue.id}})
        }
    }
}
</script>

<style>

</style>