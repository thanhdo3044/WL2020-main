<template>
  <q-card-section>
         <div v-if="order.status == 'Không được duyệt'">
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
          <div class="text-h8">Thời gian từ :</div>
          <div class="">
                      <q-input :readonly="disable" class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
      </div>
        <div class="col q-pl-sm">
        <div class="text-h8">Thời gian đến :</div>
        <div class="">
                    <q-input class="q-mb-sm" filled v-model="order.OrderMeta[0].dateEnd">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateEnd">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateEnd" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
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
        <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Sửa" />
         </div>
         <div v-else>
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
                <div class="col">
          <div class="text-h8">Thời gian từ :</div>
          <div class="">
                      <q-input :readonly="disable" class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
      </div>
        <div class="col">
        <div class="text-h8">Thời gian đến :</div>
        <div class="">
                    <q-input class="q-mb-sm" filled v-model="order.OrderMeta[0].dateEnd">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateEnd">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateEnd" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
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
          metaValue: JSON.stringify([this.metaValue]),
          fullName,selection,position,maNV,dateEnd,fullName2,position2,STT,
          dateStart,description,department,locationWork,department2
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
          metaValue: JSON.stringify([this.metaValue]),
          fullName,selection,position,maNV,dateEnd,fullName2,position2,STT,
          dateStart,description,department,locationWork,department2
        });
        await this.loadData(this.$route.query.id);
    },
    async updatedOrderMeta() {
       
        console.log('this.metaValue.account2.id',this.metaValue.accountName)
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
          metaValue: JSON.stringify([this.metaValue]),
          fullName,selection,position,maNV,dateEnd,
          dateStart,description,department,locationWork
        }) 
          await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
          await this.deleteRequest(this.order.id);
          location.reload();  
    }
  },
  watch:{
    async disable(newValue){
      if(newValue){
        
        console.log('this.metaValue.account2.id',this.metaValue.accountName)
        let fullName = this.userInfo.lastName
        let position = this.userInfo.position
        let maNV = this.userInfo.account
        let dateStart = this.order.OrderMeta[0].dateStart == null ? " " :this.order.OrderMeta[0].dateStart
        let dateEnd = this.order.OrderMeta[0].dateEnd == null ? " " :this.order.OrderMeta[0].dateEnd
        let description = this.order.OrderMeta[0].description == null ? " " : this.order.OrderMeta[0].description
        let department = this.nameDepartmentName.NAME == null ? " " : this.nameDepartmentName.NAME
        let locationWork = this.order.OrderMeta[0].locationWork == null ? " " :  this.order.OrderMeta[0].locationWork
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,position,maNV,dateEnd,
          dateStart,description,department,locationWork
        });
        await this.loadData(this.$route.query.id);
          
        }
      }
    },
  computed: {
    
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["myFactoryInfor","userInfo","dsCongDoans"])
  },
  
};

</script>
