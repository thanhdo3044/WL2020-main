<template>
  <q-card-section>
    <q-input
        class="q-mt-sm "
        outlined
        v-model="order.OrderMeta[0].fullName2"
        label="Họ tên(người bàn giao) : "
        :readonly="true"
        />  
    <DxDataGrid
      id="jskjdkfjkld"
      :data-source="metaValuesFilter"
      :allow-column-reordering="true"
      :show-borders="true"
      :show-row-lines="true"
      :word-wrap-enabled="true"
    >
      <DxColumn data-field="STT" />
      <DxColumn data-field="mucDichSuDung" caption="Nội dung" />
      <DxColumn caption="Số lượng" data-field="number" data-type="number" />
      <DxColumn caption="Ghi chú" data-field="description" />
    </DxDataGrid>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { DxDataGrid, DxColumn } from "devextreme-vue/data-grid";
export default {
  components: {  DxDataGrid, DxColumn },
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
  data(){
    return{
       nextId:null,
       events:[],
            nameDepartment: {},
            status:"",
            phoneNumber:"",
            nameDepartmentName:null,
    }
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    metaValuesFilter() {
      console.log(this.order);
      if (this.order && this.order.OrderMeta)
        return this.order.OrderMeta.filter(o => o.STT).sort(
          (a, b) => a.STT - b.STT
        );
      return [];
    }
  },
  methods: {
        ...mapActions("base",["GET_DEPARTMENTSBYID"]),
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta","deleteOrderMeta","updateOrderMeta"]),

    ...mapActions("orders", ["getOneOrder"]),
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
