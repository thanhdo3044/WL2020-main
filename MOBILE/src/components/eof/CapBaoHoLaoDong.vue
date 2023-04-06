<template>
  <q-card-section>
     <div class="q-gutter-sm text-primary text-h6">
        Chọn loại mẫu đề nghị :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
        <div v-if="order.OrderMeta[0].selection == null">
        <q-radio  dense v-model="metaValue.selection" val="Đề xuất cấp bảo hộ lao động" label="Đề xuất cấp bảo hộ lao động" color="teal"/>
        </div>
        <div v-else>
            <span v-if="order.OrderMeta[0].selection == 'Đề xuất cấp bảo hộ lao động'">
              <q-radio  dense v-model="metaValue.selection" val="Đề xuất cấp bảo hộ lao động"  color="red"/>
          </span>
          <span class="q-ml-sm" style="font-size:20px">{{metaValue.selection}}</span>
        </div>
    </div>
    <div v-if="metaValue.selection == 'Đề xuất cấp bảo hộ lao động'">
      <div v-if="order.status =='Không được duyệt'">
          <q-input
        class="q-mt-sm"
        outlined
        v-model="nameDepartmentName.NAME"
        label="Bộ phận/phòng ban : "
        :readonly="disable"
        />
        <DxDataGrid
      id="gridContainer"
      :data-source="order.OrderMeta"
      :allow-column-reordering="true"
      :show-borders="true"
      key-expr="id"
     @init-new-row="initNewRow"
     @row-inserted="RowInserted"
       @row-updated="RowUpdated"
      @row-removed="RowDelted"
    >
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
        data-field="STT"
        caption="STT"
      />
      <DxColumn caption="Tên bảo hộ lao động" data-field="Tenbaoho"/>
      <DxColumn caption="Quy cách" data-field="quyCach"/>
      <DxColumn
        caption="ĐVT"
        data-field="donViTinh"
      />
      <DxColumn
        data-field="soLuongDeXuat"
        caption="Số lượng đề xuất"
        data-type="number"
      >
      </DxColumn>
      <DxColumn
        data-field="soLuongCap"
        caption="Số lượng cấp"
        data-type="number"
      >
      </DxColumn>
      <DxColumn
        data-field="description"
        caption="Ghi chú"
      >
      </DxColumn>
      
    </DxDataGrid>
                <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Sửa" />

      </div>
      <div v-else>
          <q-input
        class="q-mt-sm"
        outlined
        v-model="nameDepartmentName.NAME"
        label="Bộ phận/phòng ban : "
        :readonly="disable"
        />
        <DxDataGrid
      id="gridContainer"
      :data-source="order.OrderMeta"
      :allow-column-reordering="true"
      :show-borders="true"
      key-expr="id"
     @init-new-row="initNewRow"
     @row-inserted="RowInserted"
       @row-updated="RowUpdated"
      @row-removed="RowDelted"
    >
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
        data-field="STT"
        caption="STT"
      />
      <DxColumn caption="Tên bảo hộ lao động" data-field="Tenbaoho"/>
      <DxColumn caption="Quy cách" data-field="quyCach"/>
      <DxColumn
        caption="ĐVT"
        data-field="donViTinh"
      />
      <DxColumn
        data-field="soLuongDeXuat"
        caption="Số lượng đề xuất"
        data-type="number"
      >
      </DxColumn>
      <DxColumn
        data-field="soLuongCap"
        caption="Số lượng cấp"
        data-type="number"
      >
      </DxColumn>
      <DxColumn
        data-field="description"
        caption="Ghi chú"
      >
      </DxColumn>
      
    </DxDataGrid>
      </div>
        
    </div>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DxButton from 'devextreme-vue/button';
import axios from 'axios';
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
       this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(this.userInfo.department);
  console.log(this.metaValue.selection)
    this.status = this.$route.query.status;
   
    
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
            phoneNumber:"",
            nameDepartment:null
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
       console.log(this.metaValue.selection)
        let STT = e.data.STT
        let quyCach = e.data.quyCach
       // let dvt = e.data.dvt
        let soLuongDeXuat = e.data.soLuongDeXuat
        let soLuongCap = e.data.soLuongCap
        let donViTinh = e.data.donViTinh
        let fullName = this.userInfo.lastName
        let Tenbaoho = e.data.Tenbaoho
        let phoneNumber = this.userInfo.PHONE
         let selection = this.metaValue.selection
        let description = e.data.description
        let department = this.nameDepartmentName.NAME.toString()
        await this.addorderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          quyCach,soLuongDeXuat,selection,STT,soLuongCap,fullName,description,
          donViTinh,phoneNumber,department,Tenbaoho 
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
         let STT = e.data.STT
        let quyCach = e.data.quyCach
       // let dvt = e.data.dvt
        let soLuongDeXuat = e.data.soLuongDeXuat
        let soLuongCap = e.data.soLuongCap
        let donViTinh = e.data.donViTinh
        let fullName = this.userInfo.lastName
       let Tenbaoho = e.data.Tenbaoho
        let phoneNumber = this.userInfo.PHONE
        let description = e.data.description
         let selection = this.metaValue.selection
        let department = this.nameDepartmentName.NAME.toString()
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          quyCach,soLuongDeXuat,selection,STT,soLuongCap,fullName,description,
          donViTinh,phoneNumber,department,Tenbaoho 
        });
        await this.loadData(this.$route.query.id);
    },
    async updatedOrderMeta(){
        await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
          await this.deleteRequest(this.order.id);
          location.reload();  
    },
    initNewRow({ data }) {
      console.log('vao initNewRow')
      Object.assign(data, {
        STT: this.order.OrderMeta.length + 1,
      });
    }
  }
};
</script>
