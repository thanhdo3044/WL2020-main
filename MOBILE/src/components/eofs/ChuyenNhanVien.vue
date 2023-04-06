<template>
  <q-card-section>
     <div class="q-gutter-sm text-primary text-h6">
         Mẫu điều chuyển nhân viên :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
        <div v-if="order.OrderMeta[0].selection == null">
          <q-radio  dense v-model="metaValue.selection" val="Điều chuyển cá nhân" label="Điều chuyển cá nhân" color="teal"/>
          <q-radio  dense v-model="metaValue.selection" val="Điều chuyển tập thể" label="Điều chuyển tập thể" color="red"/>
        </div>
        <div v-else>
          <span v-if="order.OrderMeta[0].selection == 'Điều chuyển tập thể'">
              <q-radio  dense v-model="metaValue.selection" val="Điều chuyển tập thể"  color="red"/>
          </span>
          <span v-else>
              <q-radio  dense v-model="metaValue.selection" val="Điều chuyển cá nhân"  color="red"/>
          </span>
          <span class="q-ml-sm" style="font-size:20px">{{metaValue.selection}}</span>
        </div>
    </div>
    <div v-if="metaValue.selection == 'Điều chuyển tập thể' && metaValue.selection != null">
      <div>
        
      </div>
      <q-input
      class="q-mt-sm"
      outlined
      v-model="metaValue.kinhGui"
      label="Kính gửi : "
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].fullName"
      label="Tên tôi là : "
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].position"
      label="Chức danh : "
      :readonly="disable"
    />
        <q-input
          class="q-mt-sm"
          outlined
          v-model="order.OrderMeta[0].department"
          label="Phòng ban/bộ phận : "
          :readonly="disable"/>
     
    <div
      class="q-mt-sm"
      outlined
    >Căn cứ vào tình hình thực tế công việc và nguyện vọng của người lao động,
    </br>Nay tôi làm đơn này, kính xin Ban Tổng giám đốc cho tôi được điều chuyển các cá nhân có tên sau sang vị trí công tác mới, gồm: 
      
    </div>
        <div  v-for="(task,key) in order.OrderMeta.filter(e => e.STT).sort((a,b)=> a.STT -b.STT)"
          :key="key"
          >
          <q-card class="q-mb-sm q-mt-sm">
          <q-card-section>
            <div >STT : <b>{{task.STT}}</b></div>
            <div >Mã nhân viên : <b>{{task.maNV}}</b></div>
            <div class="text-subtitle1">Họ và tên : <b>{{task.fullName2}}</b></div>
            <div>Vị trí hiện tại : {{task.department2}}</div>
            <div>Vị trí đề xuất điều chuyển sang : {{task.stepDepartment}}</div>
          </q-card-section>
          </q-card>
        </div>
   <div
      class="q-mt-sm"
      outlined
    >
        Vậy, kính mong Ban Tổng Giám đốc xem xét, điều chuyển các nhân sự trên./.
        </br>Trân trọng cảm ơn !    
    </div>
    <footerCard :order="order" :nextId="nextId"></footerCard>
    </div>
    <div v-if="metaValue.selection == 'Điều chuyển cá nhân' && metaValue.selection != null">
     
    <q-input
      class="q-mt-sm"
      outlined
      v-model="metaValue.kinhGui"
      label="Kính gửi : "
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].fullName"
      label="Tên tôi là : "
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].position"
      label="Chức danh : "
      :readonly="disable"
    />
    <q-input
          class="q-mt-sm"
          outlined
          v-model="order.OrderMeta[0].department"
          label="Phòng ban/bộ phận : "
          :readonly="disable"/>
    <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].stepDepartment"
      label="Điều chuyển sang bộ phận : "
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="metaValue.lyDo"
      label="Lí do : "
      :readonly="disable"
    />
    <div
      class="q-mt-sm"
      outlined
    >
        Vậy, kính mong Tổng Giám đốc, Cán bộ quản lý trực tiếp và Trưởng phòng Nhân sự xem xét cho tôi được điều chuyển sang vị trí công tác mới.
        </br>Trân trọng cảm ơn !    
    </div>
      
      <footerCard :order="order" :nextId="nextId"></footerCard>
    </div>
    
  </q-card-section>
</template>

<script>
import footerCard from 'components/eofs/Shared/footerCard'
import { mapGetters ,mapActions} from "vuex";
import DxButton from 'devextreme-vue/button';
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
        myDepartment:null,
        stepDepartment:null,
        departments: [],
            events:[],
            options:null,
            nameDepartmentName:null,
            nameStepDepartmentName:null,
            nextId:null
      }
  },
  async created(){
    console.log('options',this.departments)
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
        ...mapActions("base",["GET_DEPARTMENTSBYID"]),
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
