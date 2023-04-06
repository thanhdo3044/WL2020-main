<template>
  <q-card-section>
          <q-input

        class="q-ma-sm col"
        outlined
        v-model="order.OrderMeta[0].fullName"
        label="Họ và tên : "
        :readonly="true"
      />
      <q-input
        class="q-ma-sm col"
        outlined
        v-model="order.OrderMeta[0].position"
        label="Chức vụ : "
        :readonly="true"
      />
      <q-input
        class="q-ma-sm col"
        outlined
        v-model="order.OrderMeta[0].department"
        label="Phòng ban : "
        :readonly="true"
      />
      <div>Danh sách đề xuất :</div>
    <div  v-for="(task,key) in order.OrderMeta.filter(e => e.STT).sort((a,b)=> a.STT -b.STT)"
          :key="key"
          >
          <q-card class="q-mb-sm q-mt-sm">
          <q-card-section>
            <div >STT : <b>{{task.STT}}</b></div>
            <div >Tên thiết bị VPP : <b>{{task.tenThietBiVP}}</b></div>
            <div class="text-subtitle1">Đơn vị tính : <b>{{task.donViTinh}}</b></div>
            <div>Số lượng đề xuất : {{task.soLuongDeXuat}}</div>
            <div>Ghi chú : {{task.description}}</div>
          </q-card-section>
          </q-card>
        </div>
    <footer-card :order="order" :nextId="nextId" />
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import footerCard from "./Shared/footerCard.vue";
import { DxDataGrid, DxColumn } from "devextreme-vue/data-grid";
export default {
  components: { footerCard, DxDataGrid, DxColumn },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo","dsCongDoans"]),
    metaValuesFilter() {
      console.log(this.order);
      if (this.order && this.order.OrderMeta)
        return this.order.OrderMeta.filter(o => o.STT).sort(
          (a, b) => a.STT - b.STT
        );
      return [];
    }
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
  },
  created(){
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
  methods: {
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
    async loadData(id) {
      let data = null;
      try {
        data = await this.getOneOrder(id);
      } catch (error) {
        console.log(error);
      }

      if (!data)
        this.$router.push({
          path: "/phe-duyet"
        });
      this.metaValues = data.data.data.OrderMeta;
      console.log(data);
    }
  }
};
</script>
