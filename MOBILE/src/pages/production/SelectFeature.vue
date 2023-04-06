<template>
  <q-page class="q-pa-md">
    <app-bar>Chọn chức năng</app-bar>
    <div class="row justify-center">
      <div
        class="col-5 col-md-4 col-lg-3 q-ma-xs"
        v-for="item in this.$store.state.production.userInfo.role.types.find((type)=>{return type.id===this.typeOf.FEATURES}).value"
        v-bind:key="item.id"
      >
        <q-card
          @click="selectFeature(item)"
          class="my-card text-white"
          style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
        >
        <div class="prodTextTitle" style="text-align: center;vertical-align: middle;line-height: 120px">{{item.name}}</div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { types,modules,feature } from "../../configs/constants"
import AppBar from '../../components/AppBar'
export default {
  components:{
    'app-bar':AppBar
  },
  data() {
    return {
      typeOf: types
    }
  },
  methods: {
    selectFeature(_feature) {
      const featureId =_feature.id
      this.$store.dispatch('production/ACTION_SELECT_FEATURE',_feature)
      switch (featureId) {
        case feature.CONFIRM_PALLET: case feature.XNT : case feature.KHO_LP: case feature.RECIVE_PALLET:
          this.$router.push('/production-select-source')
          break;
        case feature.CREATE_PALLET: case feature.CREATE_PALLET_LP:
          this.$router.push('/production-create-pallet')
          break;
        case feature.XEP_SAY:
          this.$router.push('/production-xep-say')
          break;
        case feature.QC:
          this.$router.push('/production-qc-inspection')
          break;
        case feature.CREATE_PLAN_BATCH:
          this.$router.push('/production-add-plan-batch')
          break;
        case feature.RECIVE_PALLET:
          this.$router.push('/production-wait-recived')
          break;
        case feature.XUAT_PALLET:
          this.$router.push('/production-stockout-pallet')
          break;
        case feature.VAO_LO:  case feature.CONFIRM_BATCH:  case feature.LOSAY:
          this.$router.push('/production-batchs')
          break;
          ///production-add-plan-batch
        default:
          this.$q.notify({
            color:'cyan',
            message:'Chức năng đang được phát triển !',
          })
          break;
      }
    },
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.my-card{
  height: 120px;
}
</style>