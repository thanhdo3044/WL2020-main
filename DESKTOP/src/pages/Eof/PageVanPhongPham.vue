<template>
  <q-page>
    <order-header :order="order" />
    <q-card class="my-card">
      <q-card-section>
        <div v-if="order.status == 'Không được duyệt'">
          <div class="row">
          <div class="col">
            <q-input
              label="Họ và tên:"
              v-model="userInfo.lastName"
              readonly
            ></q-input>
          </div>
          <div class="col">
            <q-input
              label="Chức vụ:"
              v-model="userInfo.position"
              readonly
            ></q-input>
          </div>
          <div class="col">
            <q-input
              label="Phòng ban:"
              v-model="departmentDis"
              readonly
            ></q-input>
          </div>
        </div>
        <DxDataGrid
          id="gridContainer"
          :data-source="metaValuesFilter"
          :allow-column-reordering="true"
          :show-borders="true"
          key-expr="id"
          @init-new-row="initNewRow"
          @row-inserted="rowInserted"
          @row-updated="rowUpdated"
          @row-removed="rowRemoved"
        >
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

          <DxColumn data-field="STT" caption="STT" />
          <DxColumn data-field="tenThietBiVP" caption="Tên thiết bị VPP" />
          <DxColumn data-field="donViTinh" caption="ĐVT" />
          <DxColumn data-field="soLuongDeXuat" caption="Số lượng đề xuất" />
          <DxColumn data-field="soLuongCap" caption="Số lượng cấp" />
          <DxColumn caption="Ghi chú" data-field="description" />
        </DxDataGrid>
        <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Sửa" />
        </div>
        <div v-else>
          <div class="row">
          <div class="col">
            <q-input
              label="Họ và tên:"
              v-model="userInfo.lastName"
              readonly
            ></q-input>
          </div>
          <div class="col">
            <q-input
              label="Chức vụ:"
              v-model="userInfo.position"
              readonly
            ></q-input>
          </div>
          <div class="col">
            <q-input
              label="Phòng ban:"
              v-model="departmentDis"
              readonly
            ></q-input>
          </div>
        </div>
        <DxDataGrid
          id="gridContainer"
          :data-source="metaValuesFilter"
          :allow-column-reordering="true"
          :show-borders="true"
          key-expr="id"
          @init-new-row="initNewRow"
          @row-inserted="rowInserted"
          @row-updated="rowUpdated"
          @row-removed="rowRemoved"
        >
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

          <DxColumn data-field="STT" caption="STT" />
          <DxColumn data-field="tenThietBiVP" caption="Tên thiết bị VPP" />
          <DxColumn data-field="donViTinh" caption="ĐVT" />
          <DxColumn data-field="soLuongDeXuat" caption="Số lượng đề xuất" />
          <DxColumn data-field="soLuongCap" caption="Số lượng cấp" />
          <DxColumn caption="Ghi chú" data-field="description" />
        </DxDataGrid>
        </div>
        
      </q-card-section>
    </q-card>
    <q-card>
      <!-- <q-card-section>
        <q-checkbox
          v-if="order.Requests && !Object.keys(order.Requests).length || order.Requests == undefined"
          v-model="disable"
          label="Đồng ý"
        />
      </q-card-section> -->
    </q-card>
    <order-approved  :order="order" :metaValue="metaValues[0]" />
    <send-message :order="order" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from 'axios';
import { DxDataGrid, DxColumn, DxEditing } from "devextreme-vue/data-grid";
import SendMessage from "components/eof/Shared/SendMessage.vue";
import OrderHeader from "components/eof/Shared/OrderHeader.vue";
import OrderApproved from "components/eof/Shared/OrderApproved.vue";
export default {
  data() {
    return {
      disable: false,
      departmentDis:null,
      metaValues: [
        
      ],
      metaValue: {
        kinhGui:
          "Ban TGĐ - Trưởng phòng/phó phòng ban :  -	GĐSX/Phó GĐSX/Phụ trách nhà máy :",
        noiDungTT: "",
        soTien: 0,
        vietBangChu: "",
        kemTheo: "",
        STT: "12",
        locationWork: "",
        position: "",
        position2: "",
        number: "",
        timeRecruit: "",
        description: "",
        fullName: "",
        fullName2: "",
        maNV: "",
        department: "",
        department2: "",
        stepDepartment: "",
        lyDo: "",
        dateStart: "",
        dateEnd: "",
        selection1: null,
        selection2: null,
        selection3: null,
        selection4: null,
        selection: null,
        thoiGianMangThai: "",
        xinRaCong: ""
      }
    };
  },
  components: {
    SendMessage,
    OrderHeader,
    OrderApproved,
    DxDataGrid,
    DxColumn,
    DxEditing
  },
  methods: {
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      "addorderMeta",
      "taoOrderMeta",
      "deleteOrderMeta",
      "updateOrderMeta"
    ]),
     ...mapActions("requests", ["deleteRequest","resetOrder"]),
    initNewRow({ data }) {
      Object.assign(data, {
        STT: this.order.OrderMeta.length,
        tenThietBiVP: "Tên",
        donViTinh: "C",
        soLuongDeXuat: "1",
        soLuongCap: 1,
        description: "Ghi chú"
      });
    },
    async rowInserted({ data }) {
      const  fullName = this.userInfo.lastName;
      const  phoneNumber = this.userInfo.PHONE;
      const  position = this.userInfo.position;
      const  departmentData = await this.getDepartmentById(this.userInfo.department);
      const department = departmentData.name;
      await this.taoOrderMeta({
        ...data,
        orderId: this.order.id,
        metaValue: JSON.stringify([{ selection: this.selection }]),
        selection: this.selection,
        fullName,
        phoneNumber,
        position,
        department
      });
      await this.loadData(this.$route.query.id);
      console.log("OK");
    },
    async updatedOrderMeta(){
        await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
          await this.deleteRequest(this.order.id);
          location.reload();  
    },
    async rowUpdated({ data }) {
      const  fullName = this.userInfo.lastName;
      const  phoneNumber = this.userInfo.PHONE;
      const  position = this.userInfo.position;
      await this.updateOrderMeta(data,fullName,phoneNumber,position);
      await this.loadData(this.$route.query.id);
      console.log("OK");
    },
    async rowRemoved({ data }) {
      await this.deleteOrderMeta(data.id);
      await this.loadData(this.$route.query.id);
      console.log("OK");
    },
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
      this.metaValues = data.data.data.OrderMeta;
      console.log(data);
    }
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("ordersm", ["getDepartmentById"]),
    ...mapGetters("base", ["userInfo", "myFactoryInfor"]),
    metaValuesFilter() {
      return this.metaValues.filter(o => o.STT).sort((a, b) => a.STT - b.STT);
    }
  },
  async created() {
    if (this.$route.query.id) {
      this.loadData(this.$route.query.id);
    }
    const dataDer = await this.getDepartmentById(this.userInfo.department)
    console.log('adsada',dataDer);
    
    this.departmentDis = dataDer.name
    console.log('departmentDis',this.departmentDis)

  }
};
</script>
