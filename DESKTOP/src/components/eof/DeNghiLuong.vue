<template>
  <q-card-section>
      <div class="q-gutter-sm text-primary text-h6">
        Chọn loại mẫu đề nghị :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
    </div>
    <div class="q-gutter-sm q-mt-sm" >
        <div v-if="order.OrderMeta[0].selection == null">
        <q-radio  dense v-model="metaValue.selection" val="Tăng lương" label="Tăng lương" color="teal"/>
        <q-radio  dense v-model="metaValue.selection" val="Tăng thưởng" label="Tăng thưởng" color="red"/>
        </div>
        <div v-else>
          <span v-if="order.OrderMeta[0].selection == 'Tăng lương'">
              <q-radio  dense v-model="metaValue.selection" val="Tăng lương"  color="red"/>
          </span>
          <span v-else>
              <q-radio  dense v-model="metaValue.selection" val="Tăng thưởng"  color="red"/>
          </span>
          <span class="q-ml-sm" style="font-size:20px">{{metaValue.selection}}</span>
        </div>
    </div>
    <div v-if="metaValue.selection == 'Tăng lương'">
        <div v-if="order.status =='Không được duyệt'">
            <q-input
        class="q-mt-sm"
        outlined
        v-model="metaValue.kinhGui"
        label="Kính gửi : "
        :readonly="!disable"
        />
        <div class="flex">
          <q-input
          class="q-mt-sm q-pr-sm"
          style="width: 50% !important"
          outlined
          v-model="userInfo.lastName"
          label="Tên tôi là : "
          :readonly="!disable"
          />
          <q-input
          style="width: 50% !important"
          class="q-mt-sm"
          outlined
          v-model="userInfo.account"
          label="Mã nhân viên : "
          :readonly="!disable"
          />
        </div>
        <div class="flex">
          <q-input
          style="width: 50% !important"
          class="q-mt-sm q-pr-sm"
          outlined
          v-model="userInfo.position"
          label="Chức vụ : "
          :readonly="!disable"
          />
         <q-input
          style="width: 50% !important"
          class="q-mt-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="!disable"/>
        </div>
        
    <div
      class="q-mt-sm"
      outlined
    >Sau khi xem xét năng lực và ý thức làm việc, tôi xin đề xuất BTGĐ tăng bậc lương hiện tại cho các CBCNV sau : 
    </div>

      <DxDataGrid
      id="gridContainer"
      :data-source="order.OrderMeta"
      :allow-column-reordering="true"
      :show-borders="true"
      :show-row-lines="true"
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
      <DxColumn caption="Mã NV" data-field="maVT"/>
      <DxColumn caption="Họ và tên" data-field="fullName2"/>
      <DxColumn
        caption="Chức vụ"
        data-field="position2"
      />
      <DxColumn
        data-field="luongHienTai"
        caption="Bậc lương hiện tại"
        data-type="number"
      >
      </DxColumn>
      <DxColumn
        caption="Bấc lương đề xuất"
        data-field="luongDeXuat"
        data-type="number"
      />
      <DxColumn
        caption="Thời gian tăng lương gần nhất"
        data-field="thoiGianTangLuongGanNhat"
        data-type="date"
      />
    </DxDataGrid>
            <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Sửa" />

        </div>
        <div v-else>
             <q-input
        class="q-mt-sm"
        outlined
        v-model="metaValue.kinhGui"
        label="Kính gửi : "
        :readonly="disable"
        />
        <div class="flex">
          <q-input
          class="q-mt-sm q-pr-sm"
          style="width: 50% !important"
          outlined
          v-model="userInfo.lastName"
          label="Tên tôi là : "
          :readonly="disable"
          />
          <q-input
          style="width: 50% !important"
          class="q-mt-sm"
          outlined
          v-model="userInfo.account"
          label="Mã nhân viên : "
          :readonly="disable"
          />
        </div>
        <div class="flex">
          <q-input
          style="width: 50% !important"
          class="q-mt-sm q-pr-sm"
          outlined
          v-model="userInfo.position"
          label="Chức vụ : "
          :readonly="disable"
          />
         <q-input
          style="width: 50% !important"
          class="q-mt-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="disable"/>
        </div>
        
    <div
      class="q-mt-sm"
      outlined
    >Sau khi xem xét năng lực và ý thức làm việc, tôi xin đề xuất BTGĐ tăng bậc lương hiện tại cho các CBCNV sau : 
    </div>

      <DxDataGrid
      id="gridContainer"
      :data-source="order.OrderMeta"
      :allow-column-reordering="true"
      :show-borders="true"
      :show-row-lines="true"
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
      <DxColumn caption="Mã NV" data-field="maVT"/>
      <DxColumn caption="Họ và tên" data-field="fullName2"/>
      <DxColumn
        caption="Chức vụ"
        data-field="position2"
      />
      <DxColumn
        data-field="luongHienTai"
        caption="Bậc lương hiện tại"
        data-type="number"
      >
      </DxColumn>
      <DxColumn
        caption="Bấc lương đề xuất"
        data-field="luongDeXuat"
        data-type="number"
      />
      <DxColumn
        caption="Thời gian tăng lương gần nhất"
        data-field="thoiGianTangLuongGanNhat"
        data-type="date"
      />
    </DxDataGrid>
        </div>
    </div>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DxButton from 'devextreme-vue/button';
import moment from "moment";
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
            nameDepartment:null,
            nameDepartmentName:null
      }
  },computed:{
    ...mapGetters("orders", ["order"]),
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
        let kinhGui = this.metaValue.kinhGui
        let maNV = this.userInfo.account // mã nhân viên đè xuất
        let luongHienTai = e.data.luongHienTai.toString()
        let luongDeXuat = e.data.luongDeXuat.toString()
        let thoiGianTangLuongGanNhat = e.data.thoiGianTangLuongGanNhat
        let fullName = this.userInfo.lastName
        let fullName2 = e.data.fullName2
        let position2 = e.data.position2
        let position = this.userInfo.position
        let selection = this.metaValue.selection
        let department = this.nameDepartmentName.NAME
        let maVT = e.data.maVT // mã nhân viên
        
        await this.addorderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          maVT,kinhGui,maNV,selection,STT,luongHienTai,fullName,luongDeXuat,
          department,thoiGianTangLuongGanNhat,position,fullName2,position2
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
      console.log('thoiGianTangLuongGanNhat',moment(e.data.thoiGianTangLuongGanNhat).format('L'))
        let formatTime = moment(e.data.thoiGianTangLuongGanNhat).format('L');
        let STT = e.data.STT.toString()
        let kinhGui = this.metaValue.kinhGui
        let maNV = this.userInfo.account // mã nhân viên đè xuất
        let luongHienTai = e.data.luongHienTai.toString()
        let luongDeXuat = e.data.luongDeXuat.toString()
        let thoiGianTangLuongGanNhat = e.data.thoiGianTangLuongGanNhat
        let fullName = this.userInfo.lastName
        let fullName2 = e.data.fullName2
        let position2 = e.data.position2
        let position = this.userInfo.position
        let selection = this.metaValue.selection
        let department = this.nameDepartmentName.NAME
        let maVT = e.data.maVT // mã nhân viên
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          maVT,kinhGui,maNV,selection,STT,luongHienTai,fullName,luongDeXuat,
          department,thoiGianTangLuongGanNhat,position,fullName2,position2
        });
        await this.loadData(this.$route.query.id);
    },
    initNewRow({ data }) {
      console.log('vao initNewRow')
      Object.assign(data, {
        STT: this.order.OrderMeta.length + 1,
      });
    },
    async updatedOrderMeta() {
        let kinhGui = this.metaValue.kinhGui
        let maNV = this.userInfo.account // mã nhân viên đè xuất
        let fullName = this.userInfo.lastName
        let position = this.userInfo.position
        let selection = this.metaValue.selection
        let department = this.nameDepartmentName.NAME
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
         kinhGui,maNV,fullName,
         position,selection,department
        });
          await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
          await this.deleteRequest(this.order.id);
          location.reload();  
    }
  }
};
</script>
