<template>
  <q-page class="q-pa-sm bg-blue-grey-7">
    <app-bar class="text-white">Lịch sử chuyển phôi lỗi</app-bar>
    <div class="row justify-center q-ma-sm">
      <div class="col-12 col-sm-6">
        <q-markup-table separator="cell" class="bg-blue-grey-7 text-white" >
      <thead>
        <tr>
          <th class="text-left">STT</th>
          <th class="text-right">Qui cách</th>
          <th class="text-right">Số lượng</th>
          <th class="text-right">Chuyển bởi</th>
          <th class="text-right">Ngày chuyển</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in data" v-bind:key="item.id">
          <td class="text-left">{{index+1}}</td>
          <td v-if="item" class="text-right">{{item.HEIGHT +'x'+item.WIDTH+'x'+item.LENGTH}}</td>
          <td v-else class="text-right">???</td>
          <td v-if="item" class="text-right">{{item.QUANTITY}}</td>
          <td v-else class="text-right" >???</td>
          <td class="text-right">{{item.LAST_NAME}}</td>
          <td class="text-right">{{item.CREATE_DATE}}</td>
        </tr>
      </tbody>
    </q-markup-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import AppBar from "../../components/AppBar";
export default {
  components: {
    "app-bar": AppBar
  },
  data() {
    return {
      step: "",
      stepId: 0,
      data:[]
    };
  },
  async created(){
    this.stepId=this.$route.params.stepid.toString().split('-')[0]
    console.log('ID:',this.$route.params.stepid.toString().split('-')[0])
    if (this.$route.params.stepid) {
      this.$q.loading.show()
      
      let payload = {
        // qcStepId:this.$route.params.stepid.toString().split('-')[2],
        // stepId:this.stepId,
        // itemId:this.$route.params.stepid.toString().split('-')[1]
        ID:this.$route.params.stepid
      }
      let data = await this.$store.dispatch('production/GET_LICH_SU_GHI_LOI',payload)
      this.$q.loading.hide()
      this.data = data.data

      
    }else {
      this.$q.notify({
        message:'Hãy chọn công đoạn !'
      })
    }
  }
};
</script>

<style>
</style>