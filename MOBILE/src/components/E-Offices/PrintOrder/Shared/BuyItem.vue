<template>
  <q-card-section >
    <div class="body">
      <!-- <div>{{order.OrderMeta[0]}}</div> -->
      <div class="flex">
        <q-input
        style="width:33.33̀% !important"
        outlined
        v-model="order.OrderMeta[0].fullName"
        label="Tên tôi là : "
        :readonly="disable"
        />
        <q-input
        style="width:33.33̀% !important"
        outlined
        v-model="order.OrderMeta[0].department"
        label="Phòng ban/bộ phận : "
        :readonly="disable"/>
        <q-input
        style="width:33.33̀% !important"
        filled
        outlined
        v-model="order.OrderMeta[0].phoneNumber"
        label="SĐT : "
        :readonly="disable"/>
      </div>
    <div class="q-mt-sm">
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
        width="50"
      />
      <DxColumn caption="Mã VT" data-field="maVT"/>
      <DxColumn caption="Tên vật tư" data-field="tenVT"
      />
      <DxColumn
        caption="ĐVT"
        data-field="donViTinh"
        width="70"
      />
      <DxColumn
        data-field="number"
        caption="Số lượng"
      >
      </DxColumn>
      <DxColumn
        caption="Yêu cầu kỹ thuật"
        data-field="yeuCauKyThuat"
      />
      <DxColumn
        caption="Mục đích sử dụng"
        data-field="mucDichSuDung"

      />
    </DxDataGrid>
    </div>
    <!-- <div
      class="q-mt-sm"
      outlined
    >Vậy kính mong Ban TGĐ xem xét, phê duyệt.</div> -->
   
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
  props: ["metaValue", "disable"],
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
  }
};
</script>
<style scoped>
.body{
  font-family: 'Times New Roman', Times, serif !important;
}

</style>
