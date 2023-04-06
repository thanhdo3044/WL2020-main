<template>
  <q-card-section>
    <div class="q-gutter-sm text-primary text-h6">
        Chọn loại mẫu xác nhận công :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
    </div>

    <div class="q-gutter-sm q-mt-sm" >
        <div v-if="order.OrderMeta[0].selection == null">
        <q-radio  dense v-model="metaValue.selection" val="Làm thêm giờ" label="Làm thêm giờ" color="teal"/>
        <q-radio  dense v-model="metaValue.selection" val="Lỗi chấm công" label="Lỗi chấm công" color="red"/>
        </div>
        <div v-else>
          <span v-if="order.OrderMeta[0].selection == 'Làm thêm giờ'">
              <q-radio  dense v-model="metaValue.selection" val="Làm thêm giờ"  color="red"/>
          </span>
          <span v-else>
              <q-radio  dense v-model="metaValue.selection" val="Lỗi chấm công"  color="red"/>
          </span>
          <span class="q-ml-sm" style="font-size:20px">{{metaValue.selection}}</span>
        </div>
    </div>


      <div v-if="metaValue.selection == 'Làm thêm giờ'">
        <div v-if="order.status == 'Không được duyệt'">
          <div  v-for="(task,key) in order.OrderMeta.filter(e => e.maNV)"
            :key="key"
            >
            <q-card class="q-mb-sm q-mt-sm">
            <q-card-section>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.maNV"
                  label="Mã nhân viên :"
                  :readonly="!disable" >
                </q-input>
                <q-input class="q-mt-sm col "
                  outlined
                  v-model="task.fullName2"
                  label="Họ và tên : "
                  :readonly="!disable" >
                </q-input>
              </div>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.date"
                  label="Ngày tháng :"
                  :readonly="!disable" >
                </q-input>
                <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.work"
                  label="Công việc : "
                  :readonly="!disable" >
                </q-input>
              </div>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursIn"
                  label="Thời gian từ :"
                  :readonly="!disable" >
                </q-input>
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursOut"
                  label="Thời gian đến : "
                  :readonly="!disable" >
                </q-input>
                <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.total"
                  label="Tổng số giờ : "
                  :readonly="!disable" >
                </q-input>
              </div>
              <q-btn class="q-mt-sm" v-on:click="RowUpdated(task)" color="primary" text-color="white" label="Sửa" />
              <q-btn class="q-mt-sm q-ml-sm" v-on:click="RowDelted(task)" color="orange" text-color="white" label="Xóa" />

            </q-card-section>
            </q-card>
          </div>
        <q-btn class="q-mt-sm q-mr-sm" v-show="disable" v-on:click="initNewRow(task)" color="primary" text-color="white" label="Thêm" />
        <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Hoàn thành" />

        </div>
        <div v-else>
          <q-btn class="q-mt-sm" v-show="!disable" v-on:click="initNewRow(task)" color="primary" text-color="white" label="Thêm" />
          <div  v-for="(task,key) in order.OrderMeta.filter(e => e.maNV)"
            :key="key"
            >
            <q-card class="q-mb-sm q-mt-sm">
            <q-card-section>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.maNV"
                  label="Mã nhân viên :"
                  :readonly="disable" >
                </q-input>
                <q-input class="q-mt-sm col "
                  outlined
                  v-model="task.fullName2"
                  label="Họ và tên : "
                  :readonly="disable" >
                </q-input>
              </div>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.date"
                  label="Ngày tháng :"
                  :readonly="disable" >
                </q-input>
                <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.work"
                  label="Công việc : "
                  :readonly="disable" >
                </q-input>
              </div>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursIn"
                  label="Thời gian từ :"
                  :readonly="disable" >
                </q-input>
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursOut"
                  label="Thời gian đến : "
                  :readonly="disable" >
                </q-input>
                <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.total"
                  label="Tổng số giờ : "
                  :readonly="disable" >
                </q-input>
              </div>
            </q-card-section>
            </q-card>
          </div>
        </div>
      
      </div>
    <div v-if="metaValue.selection == 'Lỗi chấm công'">
     <div v-if="order.status =='Không được duyệt'">
       <q-input
      class="q-mt-sm"
      outlined
      v-model="metaValue.kinhGui"
      label="Kính gửi : "
      :readonly="!disable"
    />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="userInfo.lastName"
      label="Tên tôi là : "
      :readonly="!disable"
    />
    <q-input
          class="q-mt-sm"
          outlined
          v-model="userInfo.account"
          label="Mã nhân viên : "
          :readonly="!disable"
          />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="userInfo.position"
      label="Chức danh : "
      :readonly="!disable"
    />
        <q-input
          class="q-mt-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="!disable"/>
      <div
        class="q-mt-sm"
        outlined
      > Sau đây tôi xin đề nghị với Ban Lãnh đạo một việc như sau:
      </div>
      <div
        class="q-mt-sm"
        outlined
      >         Vậy Tổ/ bộ phận làm đơn đề nghị xác nhận ngày công đi làm thực tế của CNV như sau :
      </div>
     <q-btn class="q-mt-sm" v-show="!disable" v-on:click="initNewRow(task)" color="primary" text-color="white" label="Thêm" />
          <div  v-for="(task,key) in order.OrderMeta.filter(e => e.maNV)"
            :key="key"
            >
            <q-card class="q-mb-sm q-mt-sm">
            <q-card-section>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.maNV"
                  label="Mã nhân viên :"
                  :readonly="!disable" >
                </q-input>
                <q-input class="q-mt-sm col "
                  outlined
                  v-model="task.fullName2"
                  label="Họ và tên : "
                  :readonly="!disable" >
                </q-input>
              </div>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.date"
                  label="Ngày tháng :"
                  :readonly="!disable" >
                </q-input>
                <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.work"
                  label="Công việc : "
                  :readonly="!disable" >
                </q-input>
              </div>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursIn"
                  label="Thời gian từ :"
                  :readonly="!disable" >
                </q-input>
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursOut"
                  label="Thời gian đến : "
                  :readonly="!disable" >
                </q-input>
                <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.total"
                  label="Tổng số giờ : "
                  :readonly="!disable" >
                </q-input>
              </div>
              <q-btn class="q-mt-sm" v-on:click="RowUpdated(task)" color="primary" text-color="white" label="Sửa" />
              <q-btn class="q-mt-sm q-ml-sm" v-on:click="RowDelted(task)" color="orange" text-color="white" label="Xóa" />

            </q-card-section>
            </q-card>
          </div>

      <div
        class="q-mt-sm"
        outlined
      >         Vậy kính mong Ban Lãnh đạo xem xét, giải quyết.
      </div>
        <q-btn class="q-mt-sm q-mr-sm" v-show="disable" v-on:click="initNewRow(task)" color="primary" text-color="white" label="Thêm" />
        <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Hoàn thành" />

     </div>
     <div v-else>
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
      v-model="userInfo.lastName"
      label="Tên tôi là : "
      :readonly="disable"
    />
    <q-input
          class="q-mt-sm"
          outlined
          v-model="userInfo.account"
          label="Mã nhân viên : "
          :readonly="disable"
          />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="userInfo.position"
      label="Chức danh : "
      :readonly="disable"
    />
        <q-input
          class="q-mt-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="disable"/>
      <div
        class="q-mt-sm"
        outlined
      > Sau đây tôi xin đề nghị với Ban Lãnh đạo một việc :
      </div>
      <div
        class="q-mt-sm"
        outlined
      >  Tổ/ bộ phận làm đơn đề nghị xác nhận ngày công đi làm thực tế của CBNV như sau :
      </div>
      <q-btn class="q-mt-sm" v-show="!disable" v-on:click="initNewRow(task)" color="primary" text-color="white" label="Thêm" />
          <div  v-for="(task,key) in order.OrderMeta.filter(e => e.maNV)"
            :key="key"
            >
            <q-card class="q-mb-sm q-mt-sm">
            <q-card-section>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.maNV"
                  label="Mã nhân viên :"
                  :readonly="disable" >
                </q-input>
                <q-input class="q-mt-sm col "
                  outlined
                  v-model="task.fullName2"
                  label="Họ và tên : "
                  :readonly="disable" >
                </q-input>
              </div>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.date"
                  label="Ngày tháng :"
                  :readonly="disable" >
                </q-input>
                <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.work"
                  label="Công việc : "
                  :readonly="disable" >
                </q-input>
              </div>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursIn"
                  label="Thời gian từ :"
                  :readonly="disable" >
                </q-input>
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursOut"
                  label="Thời gian đến : "
                  :readonly="disable" >
                </q-input>
                <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.total"
                  label="Tổng số giờ : "
                  :readonly="disable" >
                </q-input>
              </div>

            </q-card-section>
            </q-card>
          </div>
      <div
        class="q-mt-sm"
        outlined
      >         Vậy kính mong Ban Lãnh đạo xem xét, giải quyết.
      </div>
     </div>
      
    </div>
    <q-dialog v-model="active" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-black" style="width: auto">
        <q-card-section>
          <div class="text-h6 bg-primary q-pa-sm text-orange shadow-5" style="border-radius:5px">Thêm dữ liệu</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="flex q-mb-sm">
            <q-select
            filled
            class="q-mt-sm q-pr-sm q-pl-sm"
            v-model="accountName"
            @input="changed"
            use-input
            input-debounce="0"
            label="Mã nhân viên"
            :options="options"
            @filter="filterFn"
            style="width: 50% !important"
            behavior="dialog"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select> 
            <q-input
              style="width:50% !important"
              class="q-mt-sm q-pl-sm "
              outlined
              v-model="this.order.OrderMeta[0].fullName"
              label="Họ và tên : "
              :readonly="!disable"
            />
          </div>
        <q-input
             
              class="q-mt-sm q-pl-sm"
              outlined
              v-model="order.OrderMeta[0].work"
              label="Công việc: "
              :readonly="false"
        />
        <div class="col q-pl-sm">
          <div class="text-h8">Ngày tháng :</div>
          <q-input filled v-model="order.OrderMeta[0].date" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="order.OrderMeta[0].date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col q-pl-sm">
          <div class="text-h8">Giờ vào :</div>
          <q-input filled v-model="order.OrderMeta[0].hoursIn" mask="time" :rules="['time']">
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="order.OrderMeta[0].hoursIn">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col q-pl-sm">
          <div class="text-h8">Giờ ra :</div>
          <q-input filled v-model="order.OrderMeta[0].hoursOut" mask="time" :rules="['time']">
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="order.OrderMeta[0].hoursOut">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-input
              style="width:50% !important"
              class="q-mt-sm q-pl-sm q-pr-sm"
              outlined
              v-model="totaHours"
              label="Tổng số giờ : "
              :readonly="true"
            />
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup @click="RowInserted"/>
           <q-btn flat label="Back" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DxButton from 'devextreme-vue/button';
import DxDateBox from 'devextreme-vue/date-box';
import axios from 'axios';
import moment from 'moment'
import { DxDataGrid, DxColumn, DxEditing, DxPaging, DxLookup,DxFilterRow } from 'devextreme-vue/data-grid';
export default {
    components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxLookup,
    DxFilterRow,
    DxDateBox
  },
  props: ["metaValue", "disable","order"],
  async created(){
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(this.userInfo.department);
    console.log('this.nameDepartmentName',this.nameDepartmentName.NAME)
    this.status = this.$route.query.status;
    console.log('status',this.status)
    console.log('dsCongDoans',this.dsCongDoans)
    console.log('userInfo',this.userInfo)
    
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
    };
    let account2 = await this.GET_ACCOUNTS();
    console.log('account2',account2)
    await account2.data.forEach(element => {
      this.account.push({
        value: element.id,
        accountCode: element.account,
        label: element.account,
        name: element.lastName,
        position: element.position,
        departmentId : element.departmentId
      });
    });
         console.log('account',this.account)
  },
  data(){
      return{            
            events:[],
            nameDepartment: {},
            status:"",
            phoneNumber:"",
            nameDepartmentName:null,
            active:false,
            options:null,
            account:[],
            accountName:"",
            totalHours:0,
      }
  },computed:{
    ...mapGetters("orders", ["order"]),
    // ...mapActions("base",["GET_DEPARTMENTSBYID"]),
    ...mapGetters("base", ["userInfo","dsCongDoans"]),
    totaHours(){
      
      this.totalHours = moment.utc(moment(this.order.OrderMeta[0].hoursOut," HH:mm")
      .diff(moment(this.order.OrderMeta[0].hoursIn,"HH:mm"))).format("HH:mm")
      console.log(this.order.OrderMeta[0].hoursIn)
      console.log(this.order.OrderMeta[0].hoursOut)
      console.log('totalHours',this.totalHours)
      return this.totalHours
    },
  },
  methods:{
    ...mapActions("base",["GET_DEPARTMENTSBYID","GET_DEPARTMENTSALL","GET_ACCOUNTS"]),
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta","deleteOrderMeta","updateOrderMeta"]),
    ...mapActions("requests", ["deleteRequest","resetOrder"]),
    
    async changed(){
     
         console.log('changed')
        this.order.OrderMeta[0].fullName = this.accountName.name
        this.order.OrderMeta[0].position2 = this.accountName.position
        let department222 = await this.GET_DEPARTMENTSBYID(this.accountName.departmentId);
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
      this.order.OrderMeta = data.data.data.OrderMeta;
      console.log(data);
    },
     initNewRow(){
      console.log('init')
      this.active = true;
    },
    async RowInserted(){
      this.active = false;
      if(this.metaValue.selection =='Làm thêm giờ'){
        let fullName = this.userInfo.lastName
        let position = this.userInfo.position
        let department = this.nameDepartmentName.NAME
        let fullName2 = this.accountName.name
        let phoneNumber = this.userInfo.PHONE
        let selection = this.metaValue.selection
        let work = this.order.OrderMeta[0].work
        let maNV = this.accountName.accountCode
        let hoursIn = this.order.OrderMeta[0].hoursIn
        let hoursOut = this.order.OrderMeta[0].hoursOut
        let total =this.totalHours
        let date = this.order.OrderMeta[0].date
        await this.addorderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
         fullName,fullName2,phoneNumber,selection,work,
         hoursIn,hoursOut,date,maNV,total,department,
         position
        });
        await this.loadData(this.$route.query.id);
      }else{
        let fullName = this.userInfo.lastName
        let position = this.userInfo.position
        let fullName2 = this.accountName.name
        let phoneNumber = this.userInfo.PHONE
        let department = this.nameDepartmentName.NAME
        let selection = this.metaValue.selection
        let work = this.order.OrderMeta[0].work
        let maNV = this.accountName.accountCode
        let hoursIn = this.order.OrderMeta[0].hoursIn
        let hoursOut = this.order.OrderMeta[0].hoursOut
        let total =this.totalHours
        let date = this.order.OrderMeta[0].date
        await this.addorderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
         fullName,fullName2,phoneNumber,
          selection,hoursIn,hoursOut,total,date,maNV,position,department
        });
        await this.loadData(this.$route.query.id);
      }
        
    },
    async RowDelted(e){
      console.log('STT',e.id)
      await this.deleteOrderMeta(e.id);
      await this.loadData(this.$route.query.id);
    },
    async RowUpdated(e){
      console.log('STT',e.id)
      if(this.metaValue.selection =='Làm thêm giờ'){
        let fullName = this.userInfo.lastName
        let position = this.userInfo.position
        let fullName2 = e.fullName2
        let department = this.nameDepartmentName.NAME
        let phoneNumber = this.userInfo.PHONE
        let selection = this.metaValue.selection
        let work = e.work
        let hoursIn = e.hoursIn
        let hoursOut = e.hoursOut
        let total = e.total
        let maNV = e.maNV
        let date = e.date
        let id = e.id
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
         fullName,fullName2,phoneNumber,selection,work,
         hoursIn,hoursOut,date,maNV,id,position,department
        });
        await this.loadData(this.$route.query.id);
      }else{
        let fullName = this.userInfo.lastName
        let fullName2 = e.fullName2
        let phoneNumber = this.userInfo.PHONE
        let position = this.userInfo.position
        let department = this.nameDepartmentName.NAME 
        let selection = this.metaValue.selection
        let hoursIn = e.hoursIn
        let hoursOut = e.hoursOut
        let total = e.total
        let date = e.date
        let maNV = e.maNV
        let id = e.id
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
         fullName,fullName2,phoneNumber,position,department,
          selection,hoursIn,hoursOut,total,date,maNV,id
        });
        await this.loadData(this.$route.query.id);
      }
    },
    async updatedOrderMeta() {
      if(this.metaValue.selection =='Làm thêm giờ'){
        let fullName = this.userInfo.lastName
        let position = this.userInfo.position
        let phoneNumber = this.userInfo.PHONE
        let department = this.nameDepartmentName.NAME
        let selection = this.metaValue.selection
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
         fullName,phoneNumber,selection,position,department
        });
        await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
          await this.deleteRequest(this.order.id);
          location.reload();  
      }else{
        let fullName = this.userInfo.lastName
        let phoneNumber = this.userInfo.PHONE
        let position = this.userInfo.position
        let department = this.nameDepartmentName.NAME 
        let selection = this.metaValue.selection
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
         fullName,phoneNumber,position,department,
          selection
        });
        await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
          await this.deleteRequest(this.order.id);
          location.reload();  
      }
    },
    //  initNewRow({ data }) {
    //   console.log('vao initNewRow')
    //   Object.assign(data, {
    //     STT: this.order.OrderMeta.length + 1,
       
    //   });
    // },
  }
};
</script>
<style scoped>
.dx-overlay-wrapper.dx-dropdowneditor-overlay.dx-popup-wrapper.dx-datebox-wrapper.dx-datebox-wrapper-time.dx-datebox-wrapper-list
{
  z-index:99999 !important;
}
</style>
