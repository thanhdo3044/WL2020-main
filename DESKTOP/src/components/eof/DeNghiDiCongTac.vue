<template>
  <q-card-section>
      <div class="q-gutter-sm text-primary text-h6">
        Chọn loại mẫu đề nghị :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
        <q-radio  dense v-model="metaValue.selection" val="Đi công tác ngắn hạn" label="Đi công tác ngắn hạn" color="teal"/>
        <q-radio  dense v-model="metaValue.selection" val="Đi công tác dài hạn" label="Đi công tác dài hạn" color="red"/>
    </div>
    <div v-if="metaValue.selection == 'Đi công tác ngắn hạn'">
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
        v-model="order.OrderMeta[0].description"
        label="Lý do đi công tác : "
        :readonly="!disable"
        />
       <div class="row q-mt-sm" >
            <div class="col">
                <div class="text-h8">  Thời gian từ ngày :</div>
                <div class="">
                  <DxDateBox
                    class="opa_1"
                    :value="order.OrderMeta[0].dateStart"
                    type="datetime"
                  />
                </div>
            </div>
            <div class="col q-pl-sm">
              <div class="text-h8">Thời gian đến :</div>
              <div class="">
                <DxDateBox
                  class="opa_1"
                  :value="order.OrderMeta[0].dateEnd"
                  type="datetime"
                />
              </div>
            </div>
          </div>
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].locationWork"
        label="Nơi đi công tác : "
        :readonly="!disable"
        />
        <div
          class="q-mt-sm"
          outlined
        >Danh sách cán bộ đi công tác:
        </div>
        <DxDataGrid
          id="gridContainer"
          :data-source="order.OrderMeta"
          :allow-column-reordering="true"
          :show-borders="true"
          :show-row-lines="true"
          :word-wrap-enabled="true"
          @init-new-row="initNewRow"
          @row-inserted="RowInserted"
          @row-updated="RowUpdated"
          @row-removed="RowDelted"
        >
        <DxPaging :enabled="true"/>
        <DxEditing
              :allow-updating="
                  !order.Requests.length || order.status == 'Không được duyệt'
                "
                :allow-deleting="
                  !order.Requests.length || order.status == 'Không được duyệt'
                "
                :allow-adding="
                  !order.Requests.length || order.status == 'Không được duyệt'
                "
                mode="row"
            />
          <DxFilterRow :visible="true" />
          <DxColumn
            data-field="STT"
            caption="STT"
            data-type="number"
          />
          <DxColumn caption="Họ và tên" data-field="fullName2"/>
          <DxColumn
            caption="Bộ phận"
            data-field="department2"
          />
        
        </DxDataGrid>
        <div
          class="q-mt-sm"
          outlined
        >Vậy kính mong Ban TGĐ xem xét, phê duyệt.
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
        v-model="order.OrderMeta[0].description"
        label="Lý do đi công tác : "
        :readonly="disable"
        />
       <div class="row q-mt-sm" >
            <div class="col">
                <div class="text-h8"> Thời gian từ ngày :</div>
                <div class="">
                  <DxDateBox
                    class="opa_1"
                    :value="order.OrderMeta[0].dateStart"
                    type="datetime"
                  />
                </div>
            </div>
            <div class="col q-pl-sm">
              <div class="text-h8">Thời gian đến :</div>
              <div class="">
                <DxDateBox
                  class="opa_1"
                  :value="order.OrderMeta[0].dateEnd"
                  type="datetime"
                />
              </div>
            </div>
          </div>
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].locationWork"
        label="Nơi đi công tác : "
        :readonly="disable"
        />
        <div
      class="q-mt-sm"
      outlined
    >Danh sách cán bộ đi công tác:</div>
    <DxDataGrid
      id="gridContainer"
      :data-source="order.OrderMeta"
      :allow-column-reordering="true"
      :show-borders="true"
      :show-row-lines="true"
      :word-wrap-enabled="true"
       @init-new-row="initNewRow"
      @row-inserted="RowInserted"
      @row-updated="RowUpdated"
      @row-removed="RowDelted"
    >
    <DxPaging :enabled="true"/>
     <DxEditing
          :allow-updating="
              !order.Requests.length || order.status == 'Không được duyệt'
            "
            :allow-deleting="
              !order.Requests.length || order.status == 'Không được duyệt'
            "
            :allow-adding="
              !order.Requests.length || order.status == 'Không được duyệt'
            "
            mode="row"
        />
      <DxFilterRow :visible="true" />
      <DxColumn
        data-field="STT"
        caption="STT"
        data-type="number"
      />
      <DxColumn caption="Họ và tên" data-field="fullName2"/>
      <DxColumn
        caption="Bộ phận"
        data-field="department2"
      />
     
    </DxDataGrid>
    <div
      class="q-mt-sm"
      outlined
    >Vậy kính mong Ban TGĐ xem xét, phê duyệt.</div>
         </div>
         
    </div>
   
  </q-card-section>
</template>

<script>
import { mapGetters ,mapActions} from "vuex";
import axios from 'axios';
import DxDateBox from 'devextreme-vue/date-box';
import DxButton from 'devextreme-vue/button';
import { DxDataGrid, DxColumn, DxEditing, DxPaging, DxLookup ,DxFilterRow} from 'devextreme-vue/data-grid';
export default {
    components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxLookup,
    DxDateBox,
    DxFilterRow
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
            active:false,
            status:""
      }
  },
  async created(){
     this.status = this.$route.query.status;
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
    initNewRow({ data }) {
      console.log('vao initNewRow')
      Object.assign(data, {
        STT: this.order.OrderMeta.length + 1,
       
      });
    },
   async changed(){
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
    async loadData(id) {
      let data = null;
      try {
        data = await this.getOneOrder(id);
      } catch (error) {
        console.log(error);
      }

      if (!data)
        this.$router.push({
          path: "/tao-de-xuat"
        });
      this.order = data.data.data;
      console.log(data);
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
     initNewRow({ data }) {
      console.log('vao initNewRow')
      Object.assign(data, {
        STT: this.order.OrderMeta.length + 1,
      });
    },
    async RowInserted(e) {
        console.log('this.metaValue.account2.id',this.metaValue.accountName)
        let kinhGui = this.order.OrderMeta[0].kinhGui
        let STT = e.data.STT.toString()
        let fullName = this.userInfo.lastName
        let fullName2 = e.data.fullName2
        let selection = this.metaValue.selection
        let position = this.userInfo.position
        let position2 = e.data.position2
        let maNV = this.userInfo.account
        let dateStart = this.order.OrderMeta[0].dateStart == null ? " " :this.order.OrderMeta[0].dateStart
        let dateEnd = this.order.OrderMeta[0].dateEnd == null ? " " :this.order.OrderMeta[0].dateEnd
        let description = this.order.OrderMeta[0].description == null ? " " : this.order.OrderMeta[0].description
        let department = this.nameDepartmentName.NAME == null ? " " : this.nameDepartmentName.NAME
        let department2 = e.data.department2 == null ? " " : e.data.department2
        let locationWork = this.order.OrderMeta[0].locationWork == null ? " " :  this.order.OrderMeta[0].locationWork
        await this.addorderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),kinhGui,
          fullName,selection,position,maNV,dateEnd,fullName2,position2,STT,
          dateStart,description,department,locationWork,kinhGui,department2
        });
        await this.loadData(this.$route.query.id);
        
    },
    async RowDelted(e){
      console.log('STT',e.data.STT)
      console.log('STT',e.data.id)
      await this.deleteOrderMeta(e.data.id);
    },
    async RowUpdated(e) {
        console.log('this.metaValue.account2.id',this.metaValue.accountName)
        let kinhGui = this.order.OrderMeta[0].kinhGui
        let STT = e.data.STT.toString()
        let fullName = this.userInfo.lastName
        let fullName2 = e.data.fullName2
        let selection = this.metaValue.selection
        let position = this.userInfo.position
        let position2 = e.data.position2
        let maNV = this.userInfo.account
                let department2 = e.data.department2 == null ? " " : e.data.department2

        let dateStart = this.order.OrderMeta[0].dateStart == null ? " " :this.order.OrderMeta[0].dateStart
        let dateEnd = this.order.OrderMeta[0].dateEnd == null ? " " :this.order.OrderMeta[0].dateEnd
        let description = this.order.OrderMeta[0].description == null ? " " : this.order.OrderMeta[0].description
        let department = this.nameDepartmentName.NAME == null ? " " : this.nameDepartmentName.NAME
        let locationWork = this.order.OrderMeta[0].locationWork == null ? " " :  this.order.OrderMeta[0].locationWork
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),kinhGui,
          fullName,selection,position,maNV,dateEnd,fullName2,position2,STT,
          dateStart,description,department,locationWork,kinhGui,department2
        });
        await this.loadData(this.$route.query.id);
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
        let locationWork = this.order.OrderMeta[0].locationWork == null ? " " :  this.order.OrderMeta[0].locationWork
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),kinhGui,
          fullName,selection,position,maNV,dateEnd,
          dateStart,description,department,locationWork,kinhGui
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
  
};

</script>
