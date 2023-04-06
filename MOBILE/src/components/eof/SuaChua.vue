<template>
  <q-card-section>
    <div class="q-gutter-sm text-primary text-h6">
         Chọn loại mẫu đề nghị :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
        <div v-if="order.OrderMeta[0].selection == null">
        <q-radio  dense v-model="metaValue.selection" val="Đề xuất xin sửa chữa thiết bị" label="Đề xuất xin sửa chữa thiết bị" color="teal"/>
        </div>
        <div v-else>
            <span v-if="order.OrderMeta[0].selection == 'Đề xuất xin sửa chữa thiết bị'">
              <q-radio  dense v-model="metaValue.selection" val="Đề xuất xin sửa chữa thiết bị"  color="red"/>
          </span>
          <span class="q-ml-sm" style="font-size:20px">{{metaValue.selection}}</span>
        </div>
    </div>
    <div v-if="metaValue.selection == 'Đề xuất xin sửa chữa thiết bị'">
      <div v-if="order.status == 'Không được duyệt'">
          <q-input
        class="q-mt-sm"
        outlined
        v-model="nameDepartmentName.NAME"
        label="Bộ phận /phòng ban : "
        :readonly="!disable"
        />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].tenVT"
        label="Đề xuất xin sửa chữa thiết bị : "
        :readonly="!disable"
        />
          <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].maVT"
        label="Mã số : "
        :readonly="!disable"
        />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].description"
        label="Tình trạng hư hỏng: "
        :readonly="!disable"
        />
         <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta"  color="primary" text-color="white" label="Sửa" />
      </div>
      <div v-else>
          <q-input
        class="q-mt-sm"
        outlined
        v-model="nameDepartmentName.NAME"
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
    </div>
    
  </q-card-section>
</template>

<script>
import { mapGetters ,mapActions} from "vuex";
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
    DxLookup
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
            account:[],
            active:true
      }
  },
  async created(){
    if(this.$route.query.status == 'Khôngđượcduyệt'){
      this.active = true;
      this.disable = false;
      console.log('456')
    }
    if(this.active){
        this.disable = false;
        console.log('789')
    }
    let data = await this.GET_DEPARTMENTSALL();
    console.log('dataa',data)
    let account2 = await this.GET_ACCOUNTS();
    console.log('account2',account2)
    await account2.data.forEach(element => {
      this.account.push({
        value: element.id,
        label: element.lastName,
        position: element.position,
        departmentId : element.departmentId
      });
    });
     console.log('account',this.account)
    // this.loadDepartment()
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(this.userInfo.department);
    await data.forEach(element => {
      this.departments.push({
        value: element.ID,
        label: element.NAME
      });
    });
    console.log('options',this.departments)
    
  },
  methods:{
        ...mapActions("requests", ["deleteRequest","resetOrder"]),
   async changed(){
     
         console.log('changed')
      console.log('this.order.OrderMeta[0].position2 ',this.order.OrderMeta[0].position2 )
      console.log('this.metaValue.account2.id',this.metaValue.accountName)
        this.order.OrderMeta[0].position2 = this.metaValue.accountName.position
        let department222 = await this.GET_DEPARTMENTSBYID(this.metaValue.accountName.departmentId);
        console.log('department2',department222)
        this.order.OrderMeta[0].department2 = department222.NAME
        },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = this.account
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.account.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
        ...mapActions("base",["GET_DEPARTMENTSBYID","GET_DEPARTMENTSALL","GET_ACCOUNTS"]),
        ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta","deleteOrderMeta","updateOrderMeta"]),

    chonCongDoan(){
     console.log('myDepartment',this.myDepartment.value)
    },
    async loadDepartment() {
      const data = await this.$store.dispatch("base/GET_DEPARTMENTS", {
        factoryId: this.myFactoryInfor.id
      });
      console.log('data',data.data)
      await data.data.forEach(e =>{
         this.departments.push({
           id: e.id,
           value: e.name
         })
      });
      console.log('this.departments',this.departments)
    },
    async updatedOrderMeta() {
       
         console.log('this.metaValue.account2.id',this.metaValue.accountName)
        //  let kinhGui = this.order.OrderMeta[0].kinhGui
        let fullName = this.userInfo.lastName
        let selection = this.metaValue.selection
        let position = this.userInfo.position
       let maNV = this.userInfo.account
       let maVT = this.order.OrderMeta[0].maVT == null ? " " :this.order.OrderMeta[0].maVT
        let tenVT = this.order.OrderMeta[0].tenVT == null ? " " :this.order.OrderMeta[0].tenVT
        let lyDo = this.order.OrderMeta[0].description == null ? " " : this.order.OrderMeta[0].description
        let department = this.nameDepartmentName.NAME == null ? " " : this.nameDepartmentName.NAME
      //  let xinRaCong = this.order.OrderMeta[0].xinRaCong == null ? " " :  this.order.OrderMeta[0].xinRaCong
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,selection,position,maNV,maVT,
          tenVT,lyDo,department
        })
       await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
          await this.deleteRequest(this.order.id);
          location.reload();
    }
  },
  computed: {
    
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["myFactoryInfor","userInfo","dsCongDoans"])
  },
   watch: {
    disable(newValue) {
      if (newValue) {
          console.log('this.metaValue.account2.id',this.metaValue.accountName)
      //  let kinhGui = this.order.OrderMeta[0].kinhGui
        let fullName = this.userInfo.lastName
        let selection = this.metaValue.selection
        let position = this.userInfo.position
        let maNV = this.userInfo.account
      let maVT = this.order.OrderMeta[0].maVT == null ? " " :this.order.OrderMeta[0].maVT
        let tenVT = this.order.OrderMeta[0].tenVT == null ? " " :this.order.OrderMeta[0].tenVT
        let lyDo = this.order.OrderMeta[0].description == null ? " " : this.order.OrderMeta[0].description
        let department = this.nameDepartmentName.NAME == null ? " " : this.nameDepartmentName.NAME
       // let xinRaCong = this.order.OrderMeta[0].xinRaCong == null ? " " :  this.order.OrderMeta[0].xinRaCong
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,selection,position,maNV,maVT,
          tenVT,lyDo,department
        })
      }
    }
  }
};
</script>
