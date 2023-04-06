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
           <div>


       <DxDataGrid
      id="gridContainer"
      :data-source="order.OrderMeta"
      :allow-column-reordering="true"
      :show-borders="true"
      key-expr="id"
     
     @row-inserted="RowInserted"
       @row-updated="RowUpdated"
      @row-removed="RowDelted"
    >
    <DxPaging :enabled="true"/>
      <DxEditing
        :allow-updating="false"
        :allow-deleting="false"
        :allow-adding="false"
        mode="row"
      />
        
      <DxColumn
        data-field="STT"
        caption="STT"
      />
      <DxColumn caption="Tên bảo hộ lao động" data-field="Tenbaoho"/>
      <DxColumn caption="Quy cách" data-field="quyCach"/>
      <DxColumn
        caption="ĐVT"
        data-field="donViTinh"
      />
      <DxColumn
        data-field="soLuongDeXuat"
        caption="Số lượng đề xuất"
      >
      </DxColumn>
      <DxColumn
        data-field="soLuongCap"
        caption="Số lượng cấp"
      >
      </DxColumn>
      <DxColumn
        data-field="description"
        caption="Ghi chú"
      >
      </DxColumn>
      
    </DxDataGrid>
    </div>
       <div
      class="q-mt-sm"
      outlined
    >Vậy kính mong Ban TGĐ xem xét, phê duyệt.</div>
   
    </div>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
