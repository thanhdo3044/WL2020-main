<template>
  <q-card-section>
    <div class="q-gutter-sm text-primary text-h6">
         Chọn loại mẫu đề nghị :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
          <span class="q-ml-sm" style="font-size:20px">{{metaValue.selection}}</span>
    </div>
    <div >
          <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].department"
        label="Bộ phận /phòng ban : "
        :readonly="disable"
        />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].tenVT"
        label="Đề xuất xin sửa chữa thiết bị : "
        :readonly="disable"
        />
          <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].maVT"
        label="Mã số : "
        :readonly="disable"
        />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].description"
        label="Tình trạng hư hỏng: "
        :readonly="disable"
        />
    </div>
   <footerCard :order="order" :nextId="nextId"></footerCard>
  </q-card-section>
</template>

<script>
import { mapGetters ,mapActions} from "vuex";
import footerCard from 'components/eofs/Shared/footerCard'
import DxButton from 'devextreme-vue/button';
import axios from 'axios';
import { DxDataGrid, DxColumn, DxEditing, DxPaging, DxLookup } from 'devextreme-vue/data-grid';
export default {
    components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxLookup,
    footerCard
  },
  props: ["metaValue", "disable","order"],
  data(){
      return{
        events:[],
            nameDepartment: {},
            status:"",
            phoneNumber:"",
            nameDepartmentName:null,
            nextId:null
      }
  },
  async created(){
    
    this.status = this.$route.query.status;
    console.log("status", this.status);
    console.log("dsCongDoans", this.dsCongDoans);
    console.log("userInfo", this.userInfo);
    this.order.Requests.sort(this.compareValues('star','asc'))
    let idDis= null;
    for(let i = 0 ; i<this.order.Requests.length ; i++){
      if(this.order.Requests[i].id == this.$route.query.id){
        console.log(this.order.Requests[i])
        idDis = this.order.Requests[i].star
         console.log('idDis',idDis)
      }
    }
    this.nextId = this.order.Requests.find(
      e=> e.star > idDis
    )
    console.log('data',this.nextId)
  },
  methods:{
    compareValues(key,order='asc'){
      return function(a, b) {
        if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // nếu không tồn tại
          return 0;
        }

        const varA = (typeof a[key] === 'string') ?
          a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string') ?
          b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return (
          (order == 'desc') ? (comparison * -1) : comparison
        );
      };
    },
        ...mapActions("requests", ["deleteRequest","resetOrder"]),
        ...mapActions("base",["GET_DEPARTMENTSBYID","GET_DEPARTMENTSALL","GET_ACCOUNTS"]),
        ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta","deleteOrderMeta","updateOrderMeta"]),

    chonCongDoan(){
     console.log('myDepartment',this.myDepartment.value)
    },
  },
  computed: {
    
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["myFactoryInfor","userInfo","dsCongDoans"])
  },
};
</script>
