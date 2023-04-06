<template>
  <q-page class="q-pa-md">
      <div class="row justify-center">
          <div class="col-12 col-sm-6 col-md-3 q-ma-sm" v-for="topic in topics" :key="topic.id">
              <q-card>
                  <q-card-section>
                      <div class="prodTextTitle">{{topic.id}}</div>
                  </q-card-section>
              </q-card>
          </div>
      </div>
  </q-page>
</template>

<script>
export default {
    created(){
        let tokenfb = localStorage.getItem('tokenFBB')
        if (tokenfb) {
            this.$getSubcrs(tokenfb).then(res=>{
                var result = Object.keys(res.topics).map(function(key) {
                    return {id:key};
                });
                this.topics = result
                this.$store.dispatch('production/ACTION_GET_SUBCRIBERS',result)
            })
        }
    },
    data(){
        return{
            topics:[]
        }
    }
}
</script>

<style>

</style>