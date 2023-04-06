<template>
  <q-page class="q-pa-sm">
    <app-bar>Lịch sử chuyển phôi lỗi</app-bar>
    <div class="row justify-center q-ma-sm">
      <div class="col-12 col-sm-6">
        <q-markup-table separator="cell">
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
        <td class="text-right">{{index+1}}</td>
          <td class="text-right">{{item.height +'x'+item.width+'x'+item.length}}</td>
          <td class="text-right">{{item.quantity}}({{ item.unit ? item.unit.toString().toLowerCase() : 't'}})</td>
          <td class="text-right">{{item.createName}}</td>
          <td class="text-right">{{item.createDate}}</td>
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
    if (this.stepId) {
      this.$q.loading.show()
      
      let payload = {
        qcStepId:this.$route.params.stepid.toString().split('-')[2],
        stepId:this.stepId,
        itemId:this.$route.params.stepid.toString().split('-')[1]
      }
      let data = await this.$store.dispatch('vcn/ACTION_GET_QC_HISTORY_BY_STEPID_VCN',payload)
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