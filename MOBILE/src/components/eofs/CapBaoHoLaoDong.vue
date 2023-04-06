<template>
  <q-card-section>
     <!-- <div class="q-gutter-sm text-primary text-h6">
        Chọn loại mẫu đề nghị :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
        <q-radio  dense v-model="metaValue.selection" val="Đề xuất cấp bảo hộ lao động" label="Đề xuất cấp bảo hộ lao động" color="teal"/>
    </div>
    <div v-if="metaValue.selection == 'Đề xuất cấp bảo hộ lao động'"> -->
      <div>
       <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].department"
        label="Bộ phận/phòng ban : "
        :readonly="disable"
        />
        <div class="text-subtitle1">Danh sách đề xuất :</div>
        <div  v-for="(task,key) in order.OrderMeta.filter(e => e.STT).sort((a,b)=> a.STT -b.STT)"
          :key="key"
          >
          <q-card class="q-mb-sm q-mt-sm">
          <q-card-section>
            <div >STT : <b>{{task.STT}}</b></div>
            <div >Tên bảo hộ lao động : <b>{{task.Tenbaoho}}</b></div>
            <div class="text-subtitle1">Đơn vị tính : <b>{{task.donViTinh}}</b></div>
            <div>Số lượng đề xuất : {{task.soLuongDeXuat}}</div>
            <div>Số lượng cấp : {{task.soLuongCap}}</div>
            <div>Ghi chú : {{task.description}}</div>
          </q-card-section>
          </q-card>
        </div>
    </div>
       <div
      class="q-mt-sm"
      outlined
    >Vậy kính mong Ban TGĐ xem xét, phê duyệt.</div>
   
    </div>
    <footerCard :order="order" :nextId="nextId"></footerCard>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import footerCard from 'components/eofs/Shared/footerCard';
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
  async created(){
       this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(this.userInfo.department);
  //console.log('this.nameDepartmentName',this.nameDepartmentName.NAME)
    this.status = this.$route.query.status;
   
    
    if (this.$route.query.id) {
      this.getOneOrder(this.$route.query.id).then(res => {
        if (res.data.data.Requests.length) this.disable = true;
        this.metaValue = Object.assign(
          this.metaValue,
          JSON.parse(res.data.data.OrderMeta[0].metaValue)[0]
        );
      });
    } else {
      this.$router.push({
        path: "/tao-de-xuat"
      });
    }
         this.status = this.$route.query.status;
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
            nameDepartment:null,
             nextId:null
      }
  },computed:{
    ...mapGetters("orders", ["order"]),
    // ...mapActions("base",["GET_DEPARTMENTSBYID"]),
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
    RowInserted(e){
      console.log('STT',e.data.STT)
      console.log('STT',e.data.id)
        let STT = e.data.STT
        let quyCach = e.data.quyCach
       // let dvt = e.data.dvt
        let soLuongDeXuat = e.data.soLuongDeXuat
        let soLuongCap = e.data.soLuongCap
        let donViTinh = e.data.donViTinh
        let fullName = this.userInfo.lastName
        let Tenbaoho = e.data.Tenbaoho
        let phoneNumber = this.userInfo.PHONE
         let selection = this.metaValue.selection
        let description = e.data.description
        let department = this.nameDepartmentName.NAME.toString()
        this.addorderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          quyCach,soLuongDeXuat,selection,STT,soLuongCap,fullName,description,
          donViTinh,phoneNumber,department,Tenbaoho 
        });
    },
    RowDelted(e){
      console.log('STT',e.data.STT)
      console.log('STT',e.data.id)
      this.deleteOrderMeta(e.data.id);
    },
    RowUpdated(e){
      console.log('STT',e.data.STT)
      console.log('STT',e.data.id)
         let STT = e.data.STT
        let quyCach = e.data.quyCach
       // let dvt = e.data.dvt
        let soLuongDeXuat = e.data.soLuongDeXuat
        let soLuongCap = e.data.soLuongCap
        let donViTinh = e.data.donViTinh
        let fullName = this.userInfo.lastName
       let Tenbaoho = e.data.Tenbaoho
        let phoneNumber = this.userInfo.PHONE
        let description = e.data.description
         let selection = this.metaValue.selection
        let department = this.nameDepartmentName.NAME.toString()
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          quyCach,soLuongDeXuat,selection,STT,soLuongCap,fullName,description,
          donViTinh,phoneNumber,department,Tenbaoho 
        });
    }
  }
};
</script>
