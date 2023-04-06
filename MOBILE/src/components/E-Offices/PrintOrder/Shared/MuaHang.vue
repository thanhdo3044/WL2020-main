<template>
  <q-card-section>
      <div class="q-gutter-sm text-primary text-h6">
        Chọn loại mẫu đề nghị :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
        <q-radio  dense v-model="metaValue.selection" val="Đề xuất mua hàng" label="Đề xuất mua hàng" color="teal"/>
    </div>
    <div v-if="metaValue.selection == 'Đề xuất mua hàng'">
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
        v-model="nameDepartmentName.NAME"
        label="Phòng ban/bộ phận : "
        :readonly="disable"/>
        <q-input
        filled
        class="q-mt-sm"
        outlined
        v-model="userInfo.PHONE"
        label="SĐT : "
        :readonly="disable"/>
    <div v-if="this.status == 'Đãđượcduyệt' 
               && disable">
      <DxDataGrid
      id="gridContainer"
      :data-source="order.OrderMeta"
      :allow-column-reordering="true"
      :show-borders="true"
      :show-row-lines="true"
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
      <DxColumn caption="Mã VT" data-field="maVT"/>
      <DxColumn caption="Tên vật tư" data-field="tenVT"/>
      <DxColumn
        caption="ĐVT"
        data-field="donViTinh"
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
    <div v-else-if=" this.status == 'Khôngđượcduyệt' || !disable">
      <DxDataGrid
      id="gridContainer"
      :data-source="order.OrderMeta"
      :allow-column-reordering="true"
      :show-borders="true"
      :show-row-lines="true"
      @row-inserted="RowInserted"
      @row-updated="RowUpdated"
      @row-removed="RowDelted"
    >
    <DxPaging :enabled="true"/>
      <DxEditing
        :allow-updating="true"
        :allow-deleting="true"
        :allow-adding="true"
        mode="row"
      />
        
      <DxColumn
        data-field="STT"
        caption="STT"
      />
      <DxColumn caption="Mã VT" data-field="maVT"/>
      <DxColumn caption="Tên vật tư" data-field="tenVT"/>
      <DxColumn
        caption="ĐVT"
        data-field="donViTinh"
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

    <div v-else>
      <DxDataGrid
      id="gridContainer"
      :data-source="order.OrderMeta"
      :allow-column-reordering="true"
      :show-borders="true"
      :show-row-lines="true"
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
      <DxColumn caption="Mã VT" data-field="maVT"/>
      <DxColumn caption="Tên vật tư" data-field="tenVT"/>
      <DxColumn
        caption="ĐVT"
        data-field="donViTinh"
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
    <div
      class="q-mt-sm"
      outlined
    >Vậy kính mong Ban TGĐ xem xét, phê duyệt.</div>
   
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
  async created(){
                this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(this.order.OrderMeta[0].department);

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
    ...mapActions("base",["GET_DEPARTMENTSBYID"]),
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta","deleteOrderMeta","updateOrderMeta"]),
    RowInserted(e){
      console.log('STT',e.data.STT)
      console.log('STT',e.data.id)
        let STT = e.data.STT
        let maVT = e.data.maVT
        let tenVT = e.data.tenVT
        let yeuCauKyThuat = e.data.yeuCauKyThuat
        let mucDichSuDung = e.data.mucDichSuDung
        let donViTinh = e.data.donViTinh
        let fullName = this.userInfo.lastName
        let number = e.data.number
        let phoneNumber = this.userInfo.PHONE
        let selection = this.metaValue.selection
        this.addorderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          maVT,selection,STT,tenVT,fullName,yeuCauKyThuat,
          mucDichSuDung,number,donViTinh,phoneNumber
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
        let maVT = e.data.maVT
        let tenVT = e.data.tenVT
        let yeuCauKyThuat = e.data.yeuCauKyThuat
        let mucDichSuDung = e.data.mucDichSuDung
        let fullName = this.userInfo.lastName
        let number = e.data.number
        let phoneNumber = this.userInfo.PHONE
        let donViTinh = e.data.donViTinh
        let selection = this.metaValue.selection
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          maVT,selection,STT,tenVT,fullName,yeuCauKyThuat,
          mucDichSuDung,number,donViTinh,phoneNumber
        });
    }
  }
};
</script>
