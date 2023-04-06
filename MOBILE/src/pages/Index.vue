<template>
  <q-page class="column justify-center q-pa-md">
    <div class="row justify-center">
       <div class="col-12 col-sm-6" v-for="item in allModule" v-bind:key="item">
         <card-button :text="item.name" ></card-button>
       </div>
     </div>
  </q-page>
</template>

<script>
import CardButton from '../components/wood/CardButton'
import { types,modules,screens } from "../configs/constants";
import { isObjectEmpty } from '../utils/utils'
export default {
  name: "PageIndex",
  components:{
    'card-button':CardButton
  },
  data (){
    return {
      allModule:[]
    }
  },
  created(){
    const screenDefault = this.$store.getters['base/myHomeScreen']
    let screen
     if (screenDefault.length>0) {
         screen= screens.find((s)=>{return s.ID === screenDefault[0].id})
      }else {
        screen= screens[0]
      }
      this.$router.push(screen.SCREEN_PATCH)

  },
  mounted() {
    // console.log(this.$store.state.production.userInfo.role.types.find((type)=>{
    //   return type.id===100004
    // }))
    
  },
  methods: {
    goFeature(moduleId) {
      this.$router.push("/production-select-feature")
      // switch (moduleId) {
      //   case modules.PRODUCTION: // phân hệ sản xuất
      //     this.$router.push("/production-dashboard");
      //     break;
      //   case modules.FUNITURE: // phân hệ sản xuất
      //     this.$router.push("/funiture-dashboard");
      //     break;
      //   default:
      //     this.$router.push("/production-dashboard");
      //     break;
      // }
    }
  }
};
</script>
