<template>
  <q-page class="q-pa-md bg-blue-grey-7">
    <app-bar class="text-white">Danh sách phôi chờ nhận theo phiếu chỉ định</app-bar>
    <div class="row q-mt-sm">
      <div class="col-12">
        <q-select
        dark
        label-color="amber"
          @input="chonCongDoan"
          v-model="myDepartment"
          :options="departments"
          label="Công đoạn"
        />
      </div>
    </div>
    <div class="row q-mt-sm justify-center">
      <div class="col-12 justify-center">
        <div class="border q-pa-sm">
          <span class="help">{{ resultString }}</span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-input dark label-color="amber" outlined v-model="searchQuery" type="text" label="Tìm kiếm" />
      </div>
    </div>
    <q-separator spaced />
    <div
      class="col-12 q-mt-sm"
      v-for="bom in dataReceiptFilter"
      v-bind:key="bom.itemId"
    >
      <q-card class="my-card bg-blue-grey-7" style="border: 2px solid white">
        <q-card-section>
          <div class="row">
            <div class="text-subtitle2 sub-receipt text-white">
              [{{ bom.bomCode }}] {{ bom.bomName }} ({{
                bom.bomHeight
              }}*{{ bom.bomWidth }}*{{ bom.bomLength }})
            </div>
          </div>
           <div class="text-subtitle2 sub-receipt">
              <span class="text-amber">Cấp cho:</span> <span class="text-white">{{ bom.spcap }}</span> 
            </div>
            <div class="text-subtitle2 sub-receipt">
              <span class="text-amber">LSX:</span> <span class="text-white">{{ bom.number }}</span> 
            </div>
          <q-input
          dark
            v-model.number="bom.QUANTITY"
            :readonly="true"
            type="number"
            label="Số lượng phôi"
          />
          <q-item-label><span class="text-amber">Người giao: </span>  <span class="text-white">{{ bom.LAST_NAME }}</span> </q-item-label>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            dense
            icon="cloud_download"
            @click="showConfirm(bom.bomHeight, bom.bomWidth, bom.bomLength, bom.QUANTITY,bom.id)"
            no-caps
            color="primary"
            label="Nhận"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6">Bạn đã chắc chắn !</span>
        </q-card-section>
        <q-card-section>
          Nhận số :
          <strong>{{ quantity }}</strong> về
          <span style="color: green">{{ myDepartment.label }}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng Ý"
            @click="receipt()"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import AppBar from "../../components/AppBar";
export default {
  components: {
    "app-bar": AppBar,
  },
  data() {
    return {
      myDepartment: null,
      departments: [],
      resultString: "",
      searchQuery: "",
      height:0,
      width:0,
       length:0,
      dataReceipt: [],
      quantity: 0,
      showConfirmDialog: false,
      nhanGo: [],
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    dataReceiptFilter() {
      if (this.searchQuery)
        return this.dataReceipt.filter((d) => {
          const matchString =
            d.bomName +
            " " +
            d.bomHeight +
            " " +
            d.bomWidth +
            " " +
            d.bomLength;
          return matchString
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        });
      return this.dataReceipt;
    },
  },
  created() {
    this.$store.getters["base/mySources"].forEach((element) => {
      
        this.departments.push({
          value: element.id,
          label: element.name,
           factoryId: element.factoryId,
        });
      
    });
    if (this.departments.length > 0) {
      this.myDepartment = this.departments[0];
    }
    if (this.myDepartment) {
      this.load();
    }
  },
  methods: {
    showConfirm(height, width, length, quantity,ID) {
      this.quantity = quantity;
      this.height = height; this.width = width; this.length = length;
      this.layXuatgoId(height, width, length, this.myDepartment.value,ID);
      this.showConfirmDialog = true;
    },
    async layXuatgoId(height, width, length, stepId,ID) {
      let payload = {
        stepId: stepId,
        height: height,
        width: width,
        length: length,
        ID: ID
      };
      const data = await this.$store.dispatch(
        "production/GET_GO_LUA_PHOI_ID",
        payload
      );
      this.nhanGo = data.data;
    },
    async receipt() {
      if  (this.myDepartment.value == 102487 || this.myDepartment.value == 102495)
      {   const payload = {
         length: this.length,
         height:this.height,
         width: this.width,
         stepId:this.myDepartment.value,
          accountId: this.userInfo.id,
        };
        const data = await this.$store.dispatch(
          "production/UPDATE_GO_LUA_PHOI_BAO",
          payload
        );
        if (data.meta.success) {
          this.load();
        } else {
          showNotifyError();
        }}
      else {
      for (let i = 0; i < this.nhanGo.length; i++) {
        const payload = {
          xuatGoId: this.nhanGo[i].id,
          accountId: this.userInfo.id,
        };
        const data = await this.$store.dispatch(
          "production/UPDATE_GO_LUA_PHOI",
          payload
        );
        if (data.meta.success) {
          this.load();
        } else {
          showNotifyError();
        }
      }
      }
    },
    chonCongDoan() {
      this.load();
    },
    async load() {
      if (this.myDepartment.value == 102487 || this.myDepartment.value == 102495)
      {  const data = await this.$store.dispatch(
        "production/GET_GO_LUA_PHOI_RECEIPT_BAO",
        {
          stepId: this.myDepartment.value,
        }
      );
      this.dataReceipt = data.data;}
      else {
      const data = await this.$store.dispatch(
        "production/GET_GO_LUA_PHOI_RECEIPT",
        {
          stepId: this.myDepartment.value,
        }
      );
      this.dataReceipt = data.data;
      }
    },
    
  },
};
</script>