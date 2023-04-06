<template>
  <q-card-section>
    <div v-if="order.status=='Không được duyệt'">
      <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].kinhGui"
      label="Phòng Ban/Đơn vị Có nhu cầu:"
      :readonly="!disable"
    />
    <div
      class="q-mt-sm"
      outlined
    >Nội dung : </div>

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
        data-type="number"
      />
      <DxColumn caption="Vị trí" data-field="position"/>
      <DxColumn data-type="number" caption="Số lượng" data-field="number"/>
      <DxColumn
        caption="Địa điểm làm việc"
        data-field="locationWork"
      />
      <DxColumn
        data-field="timeRecruit"
        caption="Thời gian cần tuyển dụng"
        data-type="date"
      >
      </DxColumn>
    </DxDataGrid>
    <q-input
      class="q-mt-sm"
      v-model="order.OrderMeta[0].description"
      label="Các yêu cầu đối với từng vị trí(Gửi kèm mô tả công việc - nếu có):"
      outlined
      :readonly="!disable"
    />
            <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Sửa" />

    </div>
    <div v-else>
      <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].kinhGui"
      label="Phòng Ban/Đơn vị Có nhu cầu:"
      :readonly="disable"
    />
    <div
      class="q-mt-sm"
      outlined
    >Nội dung : </div>
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
        data-type="number"
      />
      <DxColumn caption="Vị trí" data-field="position"/>
      <DxColumn data-type="number" caption="Số lượng" data-field="number"/>
      <DxColumn
        caption="Địa điểm làm việc"
        data-field="locationWork"
      />
      <DxColumn
        data-field="timeRecruit"
        caption="Thời gian cần tuyển dụng"
         data-type="date"
      >
      </DxColumn>
    </DxDataGrid>
    <q-input
      class="q-mt-sm"
      v-model="order.OrderMeta[0].description"
      label="Các yêu cầu đối với từng vị trí(Gửi kèm mô tả công việc - nếu có):"
      outlined
      :readonly="disable"
    />
  </div>
    
  
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from 'moment';
import axios from 'axios';
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
      let formatTime = moment(e.data.timeRecruit).format('L');
        let STT = e.data.STT.toString()
        let position = e.data.position
        let fullName = this.userInfo.lastName
        let number = e.data.number.toString()
        let phoneNumber = this.userInfo.PHONE
        let selection = this.metaValue.selection
        let locationWork = e.data.locationWork
        let timeRecruit = formatTime
        let description = this.order.OrderMeta[0].description
        let kinhGui = this.order.OrderMeta[0].kinhGui
        await this.addorderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          STT,position,fullName,number,phoneNumber,selection,
          locationWork,timeRecruit,description,kinhGui
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
        let formatTime = moment(e.data.timeRecruit).format('L');
        let STT = e.data.STT.toString()
        let position = e.data.position
        let fullName = this.userInfo.lastName
        let number = e.data.number.toString()
        let phoneNumber = this.userInfo.PHONE
        let selection = this.metaValue.selection
        let locationWork = e.data.locationWork
        let timeRecruit = formatTime
        let description = this.order.OrderMeta[0].description
        let kinhGui = this.order.OrderMeta[0].kinhGui
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          STT,position,fullName,number,phoneNumber,selection,
          locationWork,timeRecruit,description,kinhGui
        });
        await this.loadData(this.$route.query.id);
    },
    async updatedOrderMeta(){
        let fullName = this.userInfo.lastName
        let phoneNumber = this.userInfo.PHONE
        let selection = this.metaValue.selection
        let description = this.order.OrderMeta[0].description
        let kinhGui = this.order.OrderMeta[0].kinhGui
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
         fullName,phoneNumber,selection,description,kinhGui
        });
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
