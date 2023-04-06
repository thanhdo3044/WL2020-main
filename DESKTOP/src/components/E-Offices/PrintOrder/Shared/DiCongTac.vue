<template>
  <q-card-section>
      <div class="q-gutter-sm text-primary text-h6">
        Chọn loại mẫu đề nghị :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
      <div v-if="order.OrderMeta[0].selection == null">
        <q-radio  dense v-model="metaValue.selection" val="Đi công tác ngắn hạn" label="Đi công tác ngắn hạn" color="teal"/>
        <q-radio  dense v-model="metaValue.selection" val="Đi công tác dài hạn" label="Đi công tác dài hạn" color="red"/>
        </div>
        <div v-else>
          <span v-if="order.OrderMeta[0].selection == 'Đi công tác ngắn hạn'">
              <q-radio  dense v-model="order.OrderMeta[0].selection" val="Đi công tác ngắn hạn"  color="red"/>
          </span>
          <span v-else-if="order.OrderMeta[0].selection == 'Đi công tác dài hạn'">
              <q-radio  dense v-model="order.OrderMeta[0].selection" val="Đi công tác dài hạn"  color="red"/>
          </span>
          <span class="q-ml-sm" style="font-size:20px">{{order.OrderMeta[0].selection}}</span>
        </div>
    </div>
    <div v-if="order.OrderMeta[0].selection == 'Đi công tác ngắn hạn'">
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
      v-model="order.OrderMeta[0].fullName"
      label="Tên tôi là : "
      :readonly="disable"
    />
        <q-input
        style="width: 50% !important"
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].maNV"
        label="Mã nhân viên : "
        :readonly="disable"
        />
        </div>
        <div class="flex">
            <q-input
            style="width: 50% !important"
            class="q-mt-sm q-pr-sm"
            outlined
            v-model="order.OrderMeta[0].position"
            label="Chức vụ : "
            :readonly="disable"
            />
            <q-input
            style="width: 50% !important"
            class="q-mt-sm"
            outlined
            v-model="order.OrderMeta[0].department"
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
                <div class="text-h8">  Thời gian từ ngày :</div>
                <div class="">
                  <DxDateBox
                    class="opa_1"
                    :value="order.OrderMeta[0].dateStart"
                    type="datetime"
                  />
                </div>
            </div>
            <div class="col">
              <div class="text-h8">Thời gian đến :</div>
              <div class="">
                <DxDateBox
                  class="opa_1"
                  :value="order.OrderMeta[0].dateEnd"
                  type="datetime"
                />
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
    >
    <DxPaging :enabled="true"/>
      <DxEditing
        :allow-updating="false"
        :allow-deleting="false"
        :allow-adding="false"
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
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DxDateBox from 'devextreme-vue/date-box';
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
    DxDateBox,
  },
  props: ["metaValue", "disable","oneOrder"],
  async created(){
    // this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(this.order.OrderMeta[0].department);
    this.status = this.$route.query.status;
    console.log('status',this.status)
    console.log('dsCongDoans',this.dsCongDoans)
    console.log('userInfo',this.userInfo)
    // this.nameDepartment = this.dsCongDoans.find(e => e.id ==  this.userInfo.departmentId)
    // console.log('a',this.nameDepartment)
    // if (this.$route.query.id) {
    //   this.getOneOrder(this.$route.query.id).then(res => {
    //     if (res.data.data.Requests.length) this.disable = true;
    //     this.metaValue = Object.assign(
    //       this.metaValue,
    //       JSON.parse(res.data.data.OrderMeta[0].metaValue)[0]
    //     );
    //   });
    // } else {
    //   this.$router.push({
    //     path: "/tao-de-xuat"
    //   });
    // }
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
            events:[],
            nameDepartment: {},
            status:"",
            phoneNumber:"",
            nameDepartmentName:null,
            nextId:null
      }
  },computed:{
    ...mapGetters("orders", ["order"]),
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
  }
};
</script>
