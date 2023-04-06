<template>
  <div>
    <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].kinhGui"
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
      v-model="order.OrderMeta[0].maNV"
      label="Mã nhân viên : "
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].position"
      label="Chức vụ : "
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].department"
      label="Phòng ban/bộ phận : "
      :readonly="disable"
    />
    <div class="q-mt-sm" outlined>
      Sau khi xem xét năng lực và ý thức làm việc, tôi xin đề xuất BTGĐ tăng bậc
      lương hiện tại cho các CBCNV sau :
    </div>
        <div  v-for="(task,key) in order.OrderMeta.filter(e => e.STT)"
          :key="key"
          >
          <q-card class="q-mb-sm q-mt-sm">
          <q-card-section>
            <div >STT : <b>{{task.STT}}</b></div>
            <div >Mã nhân viên : <b>{{task.maNV}}</b></div>
            <div class="text-subtitle1">Họ và tên : <b>{{task.fullName2}}</b></div>
            <div>Chức vụ : {{task.position2}}</div>
            <div>Bậc lương hiện tại : {{task.luongHienTai}}</div>
            <div>Bậc lương đề xuất : {{task.luongDeXuat}}</div>
            <div>Thời gian tăng lương gần nhất : {{task.thoiGianTangLuongGanNhat}}</div>
          </q-card-section>
          </q-card>
        </div>
        <footerCard :order="order" :nextId="nextId"></footerCard>

  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import footerCard from 'components/eofs/Shared/footerCard'
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
  props: ["metaValue", "disable","oneOrder"],
  async created(){
    // this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(this.order.OrderMeta[0].department);
    this.status = this.$route.query.status;
    console.log('status',this.status)
    console.log('dsCongDoans',this.dsCongDoans)
    console.log('userInfo',this.userInfo)
    // this.nameDepartment = this.dsCongDoans.find(e => e.id ==  this.userInfo.departmentId)
    // console.log('a',this.nameDepartment)
    // if (this.$route.query.id) {
    //   this.getOneOrder(this.$route.query.id).then(res => {
    //     if (res.data.data.Requests.length) this.disable = true;
    //     this.metaValue = Object.assign(
    //       this.metaValue,
    //       JSON.parse(res.data.data.OrderMeta[0].metaValue)[0]
    //     );
    //   });
    // } else {
    //   this.$router.push({
    //     path: "/tao-de-xuat"
    //   });
    // }
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
  data(){
      return{            
            events:[],
            nameDepartment: {},
            status:"",
            phoneNumber:"",
            nameDepartmentName:null,
            nextId:null
      }
  },computed:{
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo","dsCongDoans"]),
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
  }
};
</script>
