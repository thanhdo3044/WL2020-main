<template>
  <q-page>
    <order-header :order="order" />
    <q-card class="my-card">
      <ChuyenNhanVien :status="status" :order="order" :metaValue.selection="metaValue.selection" :metaValue="metaValue" :disable="disable"></ChuyenNhanVien>
    </q-card>
    <!-- <order-files></order-files> -->
    <q-card>
      <q-card-section>
        <q-checkbox
          v-if="order.Requests == undefined"
          v-model="disable"
          label="Đồng ý"
        />
        <q-checkbox
         v-else-if="order.Requests && !Object.keys(order.Requests).length"
          v-model="disable"
          label="Đồng ý"
        />
      </q-card-section>
    </q-card>
    <order-approved :metaValue="metaValue" v-if="disable" :order="order" />

    <send-message :order="order" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SendMessage from "components/eof/Shared/SendMessage.vue";
import OrderHeader from "components/eof/Shared/OrderHeader.vue";
import OrderApproved from "components/eof/Shared/OrderApproved.vue";
import ChuyenNhanVien from "components/eof/ChuyenNhanVien.vue";
import { DxDataGrid, DxColumn, DxEditing, DxPaging, DxLookup } from 'devextreme-vue/data-grid';

export default {
  data() {
    return {
      myDepartment:null,
        stepDepartment:null,
        departments: [],
            events:[],
            options:null,
            nameDepartmentName:null,
            active:false,
      disable: false,
      status:false,
      metaValue: {
        kinhGui: "Ban TGĐ - Trưởng phòng :  Trưởng phòng Nhân sự :",
        noiDungTT: "",
        soTien: 0,
        vietBangChu: "",
        kemTheo: "",
        STT:"12",
        locationWork:"",
        position:"",
        number:"",
        timeRecruit:"",
        description:"",
        fullName:"",
        maNV:"",
        department:"",
        stepDepartment:"",
        lyDo:"",
        selection1:null,
        selection2:null,
        selection3:null,
        selection4:null,
        selection:null,
      }
    };
  },
  components: {
    SendMessage,
    OrderHeader,
    OrderApproved,
    ChuyenNhanVien,
     DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxLookup
  },
  methods: {
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = this.departments
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.departments.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    ...mapActions("base",["GET_DEPARTMENTSBYID","GET_DEPARTMENTSALL"]),
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
     RowInserted(e){
        // console.log('myDepartment',this.myDepartment.value)
        console.log('STT',e.data.STT)
        console.log('STT',e.data.id)
        // let phongBan= this.myDepartment.label.toString() + " " + this.myDepartment.label.toString()
        let STT = e.data.STT.toString()
        let kinhGui = this.metaValue.kinhGui
        let maNV = e.data.maNV
        let fullName = this.userInfo.lastName
        let fullName2 = e.data.fullName2
        let department2 = e.data.department2 != null ? e.data.department2 : '';
        let selection = this.metaValue.selection
        let position = this.userInfo.position
        let department = this.nameDepartmentName.NAME != null ? this.nameDepartmentName.NAME : '';
        let stepDepartment = e.data.stepDepartment != null ? e.data.stepDepartment  : '';
        this.addorderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          STT,maNV,fullName,fullName2,kinhGui,
          department2,selection,department,stepDepartment,position
        })
    },
    RowDelted(e){
      console.log('STT',e.data.STT)
      console.log('STT',e.data.id)
      this.deleteOrderMeta(e.data.id);
    },
    RowUpdated(e){
        let STT = e.data.STT.toString()
        let kinhGui = this.metaValue.kinhGui
        let maNV = e.data.maNV
        let fullName = this.userInfo.lastName
        let fullName2 = e.data.fullName2
        let department2 = e.data.department2 != null ? e.data.department2 : '';
        let selection = this.metaValue.selection
        let position = this.userInfo.position
        let department = this.nameDepartmentName.NAME != null ? this.nameDepartmentName.NAME : '';
        let stepDepartment = e.data.stepDepartment != null ? e.data.stepDepartment  : '';
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          STT,maNV,fullName,fullName2,kinhGui,
          department2,selection,department,stepDepartment,position
        })
    },
    updatedOrderMeta() {
        this.active = false;
        this.disable = true;
        let fullName = this.userInfo.lastName
        let kinhGui = this.metaValue.kinhGui
        let lyDo = this.metaValue.lyDo
        let selection = this.metaValue.selection
        let position = this.userInfo.position
        let description = this.metaValue.lyDo == null ? " " :this.metaValue.lyDo
        let department = this.nameDepartmentName.NAME != null ? this.nameDepartmentName.NAME : '';
        let stepDepartment = this.metaValue.stepDepartment.label != null ? this.metaValue.stepDepartment.label : '';
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,position,description,
          selection,department,stepDepartment,position,kinhGui,lyDo
        })

    },
    initNewRow({ data }) {
      console.log('vao initNewRow')
      Object.assign(data, {
        STT: this.order.OrderMeta.length + 1,
      });
    }
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo", "myFactoryInfor"])
  },
  mounted(){
    if( this.order.status == 'Không được duyệt'){
      this.active = true;
      this.disable = false;
      console.log('Không được duyệt')
    }else if( this.order.status == 'Đã được duyệt'){
      this.active = false;
      this.disable = true;
      console.log('Đã được duyệt')
    }
  },
  async created() {
    
    let data = await this.GET_DEPARTMENTSALL();
    console.log('dataa',data)
    // this.loadDepartment()
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(this.userInfo.department);
    await data.forEach(element => {
      this.departments.push({
        value: element.ID,
        label: element.NAME
      });
    });
    
    console.log('options',this.departments)
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
  },
};
</script>
