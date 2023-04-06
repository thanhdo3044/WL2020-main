<template>
  <q-card-section>
      
    <div>
          <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].kinhGui"
        label="Kính gửi : "
        :readonly="disable"
        />
        <div class="flex">
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
    <div
      class="q-mt-sm"
      outlined
    >Sau khi xem xét năng lực và ý thức làm việc, tôi xin đề xuất BTGĐ tăng bậc lương hiện tại cho các CBCNV sau : 
    </div>
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
      <DxColumn caption="Mã NV" data-field="maNV"/>
      <DxColumn caption="Họ và tên" data-field="fullName2"/>
      <DxColumn
        caption="Chức vụ"
        data-field="position2"
      />
      <DxColumn
        data-field="luongHienTai"
        caption="Bậc lương hiện tại"
      >
      </DxColumn>
      <DxColumn
        caption="Bấc lương đề xuất"
        data-field="luongDeXuat"
      />
      <DxColumn
        caption="Thời gian tăng lương gần nhất"
        data-field="thoiGianTangLuongGanNhat"
      />
    </DxDataGrid>
    </div>
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
            status:""
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
        let maNV = e.data.maNV
        let luongHienTai = e.data.luongHienTai
        let luongDeXuat = e.data.luongDeXuat
        let thoiGianTangLuongGanNhat = e.data.thoiGianTangLuongGanNhat
        let fullName = this.userInfo.lastName
        let fullName2 = e.data.fullName2
        let position2 = e.data.position2
        let position = this.userInfo.position
        let selection = this.metaValue.selection
        this.addorderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          maNV,selection,STT,luongHienTai,fullName,luongDeXuat,
          thoiGianTangLuongGanNhat,position,fullName2,position2
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
        let maNV = e.data.maNV
        let luongHienTai = e.data.luongHienTai
        let luongDeXuat = e.data.luongDeXuat
        let thoiGianTangLuongGanNhat = e.data.thoiGianTangLuongGanNhat
        let fullName = this.userInfo.lastName
        let fullName2 = e.data.fullName2
        let position2 = e.data.position2
        let position = this.userInfo.position
        let selection = this.metaValue.selection
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          maNV,selection,STT,luongHienTai,fullName,luongDeXuat,
          thoiGianTangLuongGanNhat,position,fullName2,position2
        });
    }
  }
};
</script>
