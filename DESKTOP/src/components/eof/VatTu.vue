<template>
  <q-card-section>
      <div class="q-gutter-sm text-primary text-h6">
        Chọn loại mẫu đề nghị :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
        <q-radio  dense v-model="metaValue.selection" val="Đề xuất cấp vật tư" label="Đề xuất cấp vật tư" color="teal"/>
    </div>
    <div v-if="metaValue.selection == 'Đề xuất cấp vật tư'">
      <div v-if="order.status =='Không được duyệt'">
          <div class="flex q-mb-sm">
         <q-input
          style="width:33.33% !important"
          class="q-mt-sm q-pr-sm"
          outlined
          v-model="userInfo.lastName"
          label="Tên tôi là : "
          :readonly="!disable"
        />
          <q-input
          style="width:33.33% !important"
          class="q-mt-sm q-pr-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="!disable"/>
        <q-input
        style="width:33.33% !important"
        filled
        class="q-mt-sm"
        outlined
        v-model="userInfo.PHONE"
        label="SĐT : "
        :readonly="!disable"/>
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
    <DxFilterRow :visible="true" />
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
        
      <DxColumn
      data-type="number"
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
      data-type="number"
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
            <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Sửa" />
      </div>
      <div v-else>
          <div class="flex q-mb-sm">
         <q-input
          style="width:33.33% !important"
          class="q-mt-sm q-pr-sm"
          outlined
          v-model="userInfo.lastName"
          label="Tên tôi là : "
          :readonly="disable"
        />
          <q-input
          style="width:33.33% !important"
          class="q-mt-sm q-pr-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="disable"/>
        <q-input
        style="width:33.33% !important"
        filled
        class="q-mt-sm"
        outlined
        v-model="userInfo.PHONE"
        label="SĐT : "
        :readonly="disable"/>
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
    <DxFilterRow :visible="true" />
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
        
      <DxColumn
      data-type="number"
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
      data-type="number"
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
      
    </div>
   
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DxButton from 'devextreme-vue/button';
import axios from 'axios';
import { DxDataGrid, DxColumn, DxEditing, DxPaging, DxLookup,DxFilterRow } from 'devextreme-vue/data-grid';
export default {
    components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxLookup,
    DxFilterRow
  },
  props: ["metaValue", "disable","order"],
  async created(){
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(this.userInfo.department);
    console.log('this.nameDepartmentName',this.nameDepartmentName.NAME)
    this.status = this.$route.query.status;
    console.log('status',this.status)
    console.log('dsCongDoans',this.dsCongDoans)
    console.log('userInfo',this.userInfo)
    
    
  },
  data(){
      return{            
            events:[],
            nameDepartment: {},
            status:"",
            phoneNumber:"",
            nameDepartmentName:null
      }
  },computed:{
    ...mapGetters("orders", ["order"]),
    // ...mapActions("base",["GET_DEPARTMENTSBYID"]),
    ...mapGetters("base", ["userInfo","dsCongDoans"]),
  },
  methods:{
    ...mapActions("base",["GET_DEPARTMENTSBYID"]),
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta","deleteOrderMeta","updateOrderMeta"]),
      ...mapActions("requests", ["deleteRequest","resetOrder"]),
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
    async RowInserted(e){
      console.log('STT',e.data.STT)
      console.log('STT',e.data.id)
        let STT = e.data.STT.toString()
        let maVT = e.data.maVT
        let tenVT = e.data.tenVT
        let yeuCauKyThuat = e.data.yeuCauKyThuat
        let mucDichSuDung = e.data.mucDichSuDung
        let donViTinh = e.data.donViTinh
        let fullName = this.userInfo.lastName
        let number = e.data.number.toString()
        let phoneNumber = this.userInfo.PHONE
        let selection = this.metaValue.selection
        let department = this.nameDepartmentName.NAME.toString()
        await this.addorderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          maVT,selection,STT,tenVT,fullName,yeuCauKyThuat,
          mucDichSuDung,number,donViTinh,phoneNumber,department
        });
        await this.loadData(this.$route.query.id);
    },
    async RowDelted(e){
      console.log('STT',e.data.STT)
      console.log('STT',e.data.id)
      await this.deleteOrderMeta(e.data.id);
    },
    async RowUpdated(e){
      console.log('STT',e.data.STT)
      console.log('STT',e.data.id)
        let STT = e.data.STT.toString()
        let maVT = e.data.maVT
        let tenVT = e.data.tenVT
        let yeuCauKyThuat = e.data.yeuCauKyThuat
        let mucDichSuDung = e.data.mucDichSuDung
        let fullName = this.userInfo.lastName
        let number = e.data.number.toString()
        let phoneNumber = this.userInfo.PHONE
        let donViTinh = e.data.donViTinh
        let selection = this.metaValue.selection
        let department = this.nameDepartmentName.NAME.toString()
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          maVT,selection,STT,tenVT,fullName,yeuCauKyThuat,
          mucDichSuDung,number,donViTinh,phoneNumber,department
        });
        await this.loadData(this.$route.query.id);
    },
    async updatedOrderMeta(){
        let fullName = this.userInfo.lastName
        let phoneNumber = this.userInfo.PHONE
        let selection = this.metaValue.selection
        let department = this.nameDepartmentName.NAME.toString()
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,phoneNumber,selection,department
        });
        await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
          await this.deleteRequest(this.order.id);
          location.reload();  
    },
    initNewRow({ data }) {
      console.log('vao initNewRow')
      Object.assign(data, {
        STT: this.order.OrderMeta.length + 1,
        donViTinh: "C",
        number: 1,
        mucDichSuDung: "Ghi chú",
        yeuCauSuDung: "Ghi chú",
        maVT: "Ghi chú",
        tenVT: "Ghi chú"
      });
    }
  }
};
</script>
