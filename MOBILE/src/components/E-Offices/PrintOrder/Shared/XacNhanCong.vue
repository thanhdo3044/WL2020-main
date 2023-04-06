<template>
  <q-card-section style="font-size:16px">
    <div class="q-gutter-sm q-mt-sm" >
    </div>
    <q-input
      class="q-mt-sm"
      outlined
      v-model="proAccount[0].lastName"
      label="Tên tôi là : "
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="proAccount[0].position"
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
      >          Tổ/ bộ phận làm đơn đề nghị xác nhận ngày công đi làm thực tế của CNV như sau :
      </div>
        <div  v-for="(task,key) in order.OrderMeta.filter(e => e.maNV)"
          :key="key"
          >{{task.selection }} :
          <div v-if="task.selection == 'Làm thêm giờ'">
            <q-card class="q-mb-sm q-mt-sm">
              <q-card-section>
                <div class="row">
                    <div class="col" >Mã nhân viên : <b>{{task.maNV}}</b></div>
                    <div class="text-subtitle1 col">Họ và tên : <b>{{task.fullName2}}</b></div>
                </div>
                <div class="row">
                    <div class="col">Ngày tháng : {{task.date}}</div>
                    <div class="col">Công việc : {{task.work}}</div>
                </div>
                <div class="row">
                    <div class="col">Thời gian từ : {{task.hoursIn}}</div>
                    <div class="col">Thời gian đến : {{task.hoursOut}}</div>
                    <div class="col">Tổng số giờ : {{task.total}}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div v-if="task.selection == 'Lỗi chấm công'">
            <q-card class="q-mb-sm q-mt-sm">
              <q-card-section>
                 <div class="row">
                    <div class="col" >Mã nhân viên : <b>{{task.maNV}}</b></div>
                    <div class="text-subtitle1 col">Họ và tên : <b>{{task.fullName2}}</b></div>
                </div>
                <div class="row">
                    <div class="col">Ngày tháng : {{task.date}}</div>
                    <div class="col">Công việc : {{task.work}}</div>
                </div>
                <div class="row">
                    <div class="col">Thời gian từ : {{task.hoursIn}}</div>
                    <div class="col">Thời gian đến : {{task.hoursOut}}</div>
                    <div class="col">Tổng số giờ : {{task.total}}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
      </div>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DxButton from 'devextreme-vue/button';
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
  },
  props: ["metaValue", "disable","order"],
  async created(){
    this.status = this.$route.query.status;
    console.log('account',await this.getAllAccounts())
    let accountALL = await this.getAllAccounts()
    this.proAccount = accountALL.filter(e => e.id == this.order.accountId);
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(this.order.departmentId);
    console.log('acocountpro',this.proAccount)
    console.log('nameDepartmentName',this.nameDepartmentName)

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
            myDepartment:null,
        stepDepartment:null,
        departments: [],
            events:[],
            options:null,
            nameDepartmentName:null,
            account:[],
            active:false,
            proAccount:null
            
      }
  },computed:{
    ...mapGetters("orders", ["order"]),
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
    ...mapActions("orders", ["getOneOrder", "getAllRequests","getAllAccounts"]),
    ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta","deleteOrderMeta","updateOrderMeta"]),
  }
};
</script>
