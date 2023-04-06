<template>
  <q-card-section>
    <div class="q-gutter-sm text-primary text-h6">
        Chọn loại mẫu biên bản bàn giao :
    </div>
     <div class="q-gutter-sm q-mt-sm" >
        <div v-if="order.OrderMeta[0].selection == null">
        <q-radio  dense v-model="order.OrderMeta[0].selection" val="Biên bản bàn giao" label="Biên bản bàn giao" color="teal"/>
        </div>
        <div v-else>
            <span v-if="order.OrderMeta[0].selection == 'Biên bản bàn giao'">
              <q-radio  dense v-model="order.OrderMeta[0].selection" val="Biên bản bàn giao"  color="red"/>
          </span>
          <span class="q-ml-sm" style="font-size:20px">{{order.OrderMeta[0].selection}}</span>
        </div>
    </div>
    <div v-if="order.OrderMeta[0].selection == 'Biên bản bàn giao'">
      <div v-if="order.status=='Không được duyệt'">
        <div class="text-h6">Chọn người nhận bàn giao:</div>
        <div class="q-pa-md">
          <div class="q-gutter-md row">
            <q-select
              filled
              use-input
              :readonly="!disable"
              @input="changed"
              @filter="filterFn"
              input-debounce="0"
              :options="options"
              v-model="metaValue.accountName"
              hint=""
              style="width: 250px; padding-bottom: 32px"
              label="Người nhận bàn giao"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
        <div
        class="q-mt-sm"
        >Nội dung bàn giao :</div>
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
      <DxColumn caption="Nội dung" data-field="mucDichSuDung"/>
      <DxColumn caption="Số lượng" data-field="number" data-type="number"/>
      <DxColumn
        caption="Ghi chú"
        data-field="description"
      />
    </DxDataGrid>
    <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Sửa" />

      </div>
      <div v-else>
        <div class="text-h6">Chọn người nhận bàn giao:</div>
        <div class="q-pa-md">
          <div class="q-gutter-md row">
            <q-select
              filled
              use-input
              :readonly="disable"
              @input="changed"
              @filter="filterFn"
              input-debounce="0"
              :options="options"
              v-model="metaValue.accountName"
              hint=""
              style="width: 250px; padding-bottom: 32px"
              label="Người nhận bàn giao"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
        <div
        class="q-mt-sm"
        >Nội dung bàn giao :</div>
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
      <DxColumn caption="Nội dung" data-field="mucDichSuDung"/>
      <DxColumn caption="Số lượng" data-field="number" data-type="number"/>
      <DxColumn
        caption="Ghi chú"
        data-field="description"
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
       this.account = await this.accounts.map(a => ({
        label: a.lastName,
        value: a.id,
        description: a.position
      }));
  },
  data(){
      return{
            events:[],
            nameDepartment: {},
            status:"",
            phoneNumber:"",
            nameDepartment:null,
            events:[],
            options:null,
            account:null
      }
  },
  computed:{
    ...mapGetters("orders", ["order"]),
    ...mapGetters("ordersm", ["accounts"]),
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
      console.log(e)
        let STT = e.data.STT
        let fullName = this.userInfo.lastName
        let number = e.data.number
        let description = e.data.description
        let phoneNumber = this.userInfo.PHONE
        let selection = this.order.OrderMeta[0].selection
        let mucDichSuDung = e.data.mucDichSuDung
        let fullName2 = this.metaValue.accountName.label
        let maNV = this.metaValue.accountName.value.toString() // id nhân viên ng bàn giao
        await this.addorderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([]),
          selection,STT,fullName,
          number,description,phoneNumber,mucDichSuDung,fullName2,
          maNV
        });
                await this.loadData(this.$route.query.id);

    },
    async RowDelted(e){
      console.log(e)
      await this.deleteOrderMeta(e.data.id);
    },
    async RowUpdated(e){
      console.log(e)
        let STT = e.data.STT
        let fullName = this.userInfo.lastName
        let number = e.data.number
        let description = e.data.description
        let phoneNumber = this.userInfo.PHONE
        let selection = this.order.OrderMeta[0].selection
        let mucDichSuDung = e.data.mucDichSuDung
        let fullName2 = this.metaValue.accountName.label
        let maNV = this.metaValue.accountName.value.toString() // id nhân viên ng bàn giao
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([]),
          selection,STT,fullName,
          number,description,phoneNumber,mucDichSuDung,fullName2,
          maNV
        });
                await this.loadData(this.$route.query.id);

         
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = this.account
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.account.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    async updatedOrderMeta(){
       let fullName2 = this.metaValue.accountName.label
        let maNV = this.metaValue.accountName.value.toString()
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([]),
          fullName2,
          maNV
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
