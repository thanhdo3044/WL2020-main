<template>
  <q-card-section>
    <q-input
      class="q-mt-sm"
      outlined
      v-model="this.order.OrderMeta[0].kinhGui"
      label="Phòng Ban/Đơn vị Có nhu cầu:"
      :readonly="disable"
    />
    <div
      class="q-mt-sm"
      outlined
    >Nội dung : </div>
    
    <div >
      <DxDataGrid
      id="gridContainer"
      :data-source="order.OrderMeta"
      :allow-column-reordering="true"
      :show-borders="true"
      :show-row-lines="true"
      :word-wrap-enabled="true"
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
      <DxColumn caption="Vị trí" data-field="position"/>
      <DxColumn caption="Số lượng" data-field="number"/>
      <DxColumn
        caption="Địa điểm làm việc"
        data-field="locationWork"
      />
      <DxColumn
        data-field="timeRecruit"
        caption="Thời gian cần tuyển dụng"
      >
      </DxColumn>
    </DxDataGrid>
    </div>
    

    <q-input
      class="q-mt-sm"
      v-model="order.OrderMeta[0].description"
      label="Các yêu cầu đối với từng vị trí(Gửi kèm mô tả công việc - nếu có):"
      outlined
      :readonly="disable"
    />
    <!-- <p class="q-mt-md">{{ metaValue.soTien | bangChu }}</p> -->
    <!-- <q-input
      class="q-mt-sm"
      v-model="metaValue.kemTheo"
      label="Kèm theo:"
      outlined
      :readonly="disable"
    />
    <p>chứng từ gốc</p> -->
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
    DxLookup
  },
  props: ["metaValue", "disable","order"],
  created(){
    this.status = this.$route.query.status;
    console.log('status',this.status)
    console.log('dsCongDoans',this.dsCongDoans)
    console.log('userInfo',this.userInfo)
    this.nameDepartment = this.dsCongDoans.find(e => e.id ==  this.userInfo.departmentId)
    console.log('a',this.nameDepartment)
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
  data(){
      return{            
            events:[],
            nameDepartment: {},
            status:"",
            phoneNumber:""
      }
  },computed:{
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo","dsCongDoans"]),
  },
  methods:{
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta","deleteOrderMeta","updateOrderMeta"]),
    RowInserted(e){
      console.log('STT',e.data.STT)
      console.log('STT',e.data.id)
        let STT = e.data.STT
        let position = e.data.position
        let fullName = this.userInfo.lastName
        let number = e.data.number
        let phoneNumber = this.userInfo.PHONE
        let selection = this.metaValue.selection
        let locationWork = e.data.locationWork
        let timeRecruit = e.data.timeRecruit
        let description = this.order.OrderMeta[0].description
        let kinhGui = this.order.OrderMeta[0].kinhGui
        this.addorderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          STT,position,fullName,number,phoneNumber,selection,
          locationWork,timeRecruit,description,kinhGui
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
        let position = e.data.position
        let fullName = this.userInfo.lastName
        let number = e.data.number
        let phoneNumber = this.userInfo.PHONE
        let selection = this.metaValue.selection
        let locationWork = e.data.locationWork
        let timeRecruit = e.data.timeRecruit
        let description = this.order.OrderMeta[0].description
        let kinhGui = this.order.OrderMeta[0].kinhGui
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          STT,position,fullName,number,phoneNumber,selection,
          locationWork,timeRecruit,description,kinhGui
        });
    }
  }
};
</script>
