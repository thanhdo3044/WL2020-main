<template>
  <q-card-section>
    <div class="q-gutter-sm text-primary text-h6">
        Chọn loại mẫu xin ra cổng :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
        <div v-if="order.OrderMeta[0].selection == null">
        <q-radio  dense v-model="metaValue.selection" val="Xin ra cổng" label="Xin ra cổng" color="teal"/>
        </div>
        <div v-else>
            <span v-if="order.OrderMeta[0].selection == 'Xin ra cổng'">
              <q-radio  dense v-model="metaValue.selection" val="Xin ra cổng"  color="red"/>
          </span>
          <span class="q-ml-sm" style="font-size:20px">{{metaValue.selection}}</span>
        </div>
    </div>
    <div v-if="metaValue.selection == 'Xin ra cổng'">
      <div v-if="order.status == 'Không được duyệt'">
          <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].kinhGui"
        label="Kính gửi : "
        :readonly="!disable"
        />
        <div  class="flex">
          <q-input
      class="q-mt-sm q-pr-sm"
      style="width: 50% !important"
      outlined
      v-model="userInfo.lastName"
      label="Tên tôi là : "
      :readonly="!disable"
    />
        <q-input
        style="width: 50% !important"
        class="q-mt-sm"
        outlined
        v-model="userInfo.account"
        label="Mã nhân viên : "
        :readonly="!disable"
        />
        </div>
        <div class="flex">
            <q-input
            style="width: 50% !important"
            class="q-mt-sm q-pr-sm"
            outlined
            v-model="userInfo.position"
            label="Chức vụ : "
            :readonly="!disable"
            />
            <q-input
            style="width: 50% !important"
            class="q-mt-sm"
            outlined
            v-model="nameDepartmentName.NAME"
            label="Phòng ban/bộ phận : "
            :readonly="!disable"/>
        </div>
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].xinRaCong"
        label="Xin ra cổng : "
        :readonly="!disable"
        />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].description"
        label="Lý do : "
        :readonly="!disable"
        />
        
         <div class="row q-mt-sm" >
            <div class="col">
                <div class="text-h8">  Thời gian ra :</div>
                <div class="">
                  <DxDateBox
                    class="opa_1"
                    :value="order.OrderMeta[0].dateStart"
                    type="datetime"
                  />
                </div>
            </div>
            <div class="col q-pl-sm">
              <div class="text-h8">Thời gian vào :</div>
              <div class="">
                <DxDateBox
                  class="opa_1"
                  :value="order.OrderMeta[0].dateEnd"
                  type="datetime"
                />
              </div>
            </div>
        </div>
        <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Sửa" />
      </div>
      <div v-else>
          <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].kinhGui"
        label="Kính gửi : "
        :readonly="disable"
        />
        <div  class="flex">
          <q-input
      class="q-mt-sm q-pr-sm"
      style="width: 50% !important"
      outlined
      v-model="userInfo.lastName"
      label="Tên tôi là : "
      :readonly="disable"
    />
        <q-input
        style="width: 50% !important"
        class="q-mt-sm"
        outlined
        v-model="userInfo.account"
        label="Mã nhân viên : "
        :readonly="disable"
        />
        </div>
        <div class="flex">
            <q-input
            style="width: 50% !important"
            class="q-mt-sm q-pr-sm"
            outlined
            v-model="userInfo.position"
            label="Chức vụ : "
            :readonly="disable"
            />
            <q-input
            style="width: 50% !important"
            class="q-mt-sm"
            outlined
            v-model="nameDepartmentName.NAME"
            label="Phòng ban/bộ phận : "
            :readonly="disable"/>
        </div>
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].xinRaCong"
        label="Xin ra cổng : "
        :readonly="disable"
        />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].description"
        label="Lý do : "
        :readonly="disable"
        />
        
       <div class="row q-mt-sm" >
            <div class="col">
                <div class="text-h8">  Thời gian ra :</div>
                <div class="">
                  <DxDateBox
                    class="opa_1"
                    :value="order.OrderMeta[0].dateStart"
                    type="datetime"
                  />
                </div>
            </div>
            <div class="col q-pl-sm">
              <div class="text-h8">Thời gian vào :</div>
              <div class="">
                <DxDateBox
                  class="opa_1"
                  :value="order.OrderMeta[0].dateEnd"
                  type="datetime"
                />
              </div>
            </div>
        </div>
      </div>
      
    </div>
    
  </q-card-section>
</template>

<script>
import { mapGetters ,mapActions} from "vuex";
import DxDateBox from 'devextreme-vue/date-box';
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
    DxDateBox,
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
            active:false
      }
  },
  async created(){
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
    ...mapActions("requests", ["deleteRequest","resetOrder"]),
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
          let kinhGui = this.order.OrderMeta[0].kinhGui
        let fullName = this.userInfo.lastName
        let selection = this.metaValue.selection
        let position = this.userInfo.position
        let maNV = this.userInfo.account
        let dateStart = this.order.OrderMeta[0].dateStart == null ? " " :this.order.OrderMeta[0].dateStart
        let dateEnd = this.order.OrderMeta[0].dateEnd == null ? " " :this.order.OrderMeta[0].dateEnd
        let description = this.order.OrderMeta[0].description == null ? " " : this.order.OrderMeta[0].description
        let department = this.nameDepartmentName.NAME == null ? " " : this.nameDepartmentName.NAME
        let xinRaCong = this.order.OrderMeta[0].xinRaCong == null ? " " :  this.order.OrderMeta[0].xinRaCong
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,selection,position,maNV,dateEnd,
          dateStart,description,department,xinRaCong,kinhGui
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
        let kinhGui = this.order.OrderMeta[0].kinhGui
        let fullName = this.userInfo.lastName
        let selection = this.metaValue.selection
        let position = this.userInfo.position
        let maNV = this.userInfo.account
        let dateStart = this.order.OrderMeta[0].dateStart == null ? " " :this.order.OrderMeta[0].dateStart
        let dateEnd = this.order.OrderMeta[0].dateEnd == null ? " " :this.order.OrderMeta[0].dateEnd
        let description = this.order.OrderMeta[0].description == null ? " " : this.order.OrderMeta[0].description
        let department = this.nameDepartmentName.NAME == null ? " " : this.nameDepartmentName.NAME
        let xinRaCong = this.order.OrderMeta[0].xinRaCong == null ? " " :  this.order.OrderMeta[0].xinRaCong
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,selection,position,maNV,dateEnd,
          dateStart,description,department,xinRaCong,kinhGui
        })
      }
    }
  }
};
</script>
