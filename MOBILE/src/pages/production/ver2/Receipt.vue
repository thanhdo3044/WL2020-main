<template>
  <q-page class="q-pa-md bg-blue-grey-7">
    <app-bar>Danh sách các phôi chờ nhận</app-bar>
    <div>
      <q-checkbox
        @input="load()"
        v-show="hienthi"
        v-model="selection"
        label="Nhận phôi nhà máy khác"
        class="text-orange"
      />
    </div>
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
        <q-input
        dark
        label-color="amber"
          outlined
          v-model="searchQuery"
          @input="timkiem"
          type="text"
          label="Tìm kiếm"
        />
      </div>
    </div>
    <q-separator spaced />
    <div
      class="col-12 q-mt-sm"
      v-for="(item, index) in dataReceiptFilter"
      v-bind:key="item.ID"
    >
      <q-card
        v-if="
          (myDepartment.value == 102487 || myDepartment.value == 102495) &&
          selection == false
        "
        class="my-card bg-blue-grey-7" style="border: 2px solid white"
      >
        <q-card-section>
          <div class="row" v-for="item1 in item.SL" v-bind:key="item1.BAO_ID">
            <div class="text-subtitle2 sub-receipt text-white">
              {{ item1.NAME }} ({{ item1.HEIGHT }}*{{ item1.WIDTH }}*{{
                item1.LENGTH
              }})
            </div>

            <q-input dark
              v-model.number="item1.QUANTITY"
              :readonly="true"
              type="number"
              label="Số lượng phôi"
            />
          </div>
          <q-badge color="green-4"
            >Người giao:
            {{ getAccountById(item.createdby) | FullName }}</q-badge
          >
          <q-item-label style="color: purple; font-weight: bold"
            ><span class="text-amber">Ngày giao:</span> <span class="text-white">{{ item.createdAt.substring(0, 16).replace("T", " ") }}</span> 
          </q-item-label>
        </q-card-section>
        <q-card-section align="right">
          <q-btn
            v-show="nhanve[index]"
            dense
            icon="cloud_download"
            @click="nhanluadat(item.ID)"
            no-caps
            color="primary"
            label="Nhận"
          ></q-btn>
        </q-card-section>
        <q-card-actions align="right">
          <div class="row">
            <q-radio
              @input="nhanvesl(index)"
              class="col-12"
              v-model="selectionTT[index]"
              val="Số lượng chưa chuẩn"
              label="Số lượng chưa chuẩn"
              color="red"
              style="color: orange; font-weight: bold; font-size: 14px"
            />

            <q-radio
              class="col-12"
              @input="nhanvesl(index)"
              v-model="selectionTT[index]"
              val="Chất lượng không đạt"
              label="Chất lượng không đạt"
              color="red"
              style="color: orange; font-weight: bold; font-size: 14px"
            />

            <q-radio
              class="col-12"
              @input="nhanvesl(index)"
              v-model="selectionTT[index]"
              val="Lý do khác"
              label="Lý do khác"
              color="red"
              style="color: orange; font-weight: bold; font-size: 14px"
            />
          </div>
        </q-card-actions>
        <q-card-section>
          <div class="row">
            <q-btn
              v-show="!nhanve[index]"
              @click="updateStatus(item, index)"
              class="col-6 bg-orange text-white"
              no-caps
            >
              Cập nhật <br />
              trạng thái
            </q-btn>
            <q-btn
              style="font-size: 21px"
              v-show="!nhanve[index]"
              @click="huy(index)"
              class="col-6 bg-positive text-white"
              no-caps
            >
              Hủy
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
      <q-card v-else class="my-card bg-blue-grey-7" style="border: 2px solid white">
        <q-card-section>
          <div class="row">
            <div class="text-subtitle2 sub-receipt text-white">
              [{{ item.itemCode }}] {{ item.itemName }} ({{
                item.itemHeight
              }}*{{ item.itemWidth }}*{{ item.itemLength }})
            </div>
          </div>
          <q-input dark
            v-model.number="item.quantity"
            :readonly="true"
            type="number"
            label="Số lượng phôi"
          />
          <q-item-label
            ><span class="text-amber">Người giao:</span> 
            <span class="text-white">{{ getAccountById(item.CREATE_BY) | FullName }}</span> </q-item-label
          >
          <q-item-label
            ><span class="text-amber">Ngày giao:</span> 
            <span class="text-white"> {{
              item.CREATE_DATE.substring(0, 16).replace("T", " ")
            }}</span></q-item-label
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            dense
            @click="xoaPhoi(item)"
            no-caps
            color="orange"
            label="Từ chối"
          ></q-btn>
          <q-btn
            dense
            icon="cloud_download"
            @click="
              layPackageIds(
                item.bang,
                myDepartment.value,
                item.itemId,
                item.CREATE_BY,
                item.quantity,
                item.ID
              )
            "
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
          <strong>{{ soLuongNhan2 }}</strong> về
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
import { mapActions, mapGetters } from "vuex";
import { showNotifyError, showNotifySuccess } from "../../../utils/utils";
import AppBar from "../../../components/AppBar";
export default {
  components: {
    "app-bar": AppBar
  },
  data() {
    return {
      myDepartment: null,
      departments: [],
      dataReceipt: [],
      slluadat: [],
      luadat: [],
      hienthi: false,
      selection: false,
      dataReceiptFilter: [],
      sanluongnhan: [],
      showConfirmDialog: false,
      currentNo: {},
      searchQuery: "",
      dupplicateData: [],
      resultString: "",
      selectionTT: [],
      nhanve: [],
      soLuongNhan2: 0,
    };
  },
  computed: {
    ...mapGetters("orders", ["getAccountById"]),
    ...mapGetters("base", ["myDepartments", "userInfo"]),
    // dataReceiptFilter() {

    //   // if (this.searchQuery)
    //   //   return this.dataReceipt.filter((d) => {
    //   //     const matchString =
    //   //       d.itemName +
    //   //       " " +
    //   //       d.itemHeight +
    //   //       " " +
    //   //       d.itemWidth +
    //   //       " " +
    //   //       d.itemLength;
    //   //     return matchString
    //   //       .toLowerCase()
    //   //       .includes(this.searchQuery.toLowerCase());
    //   //   });
    //      if(this.myDepartment.value == 102487 || this.myDepartment.value == 102495 ) {
    //         return this.luadat;
    //      } else {
    //   return this.dataReceipt;
    //      }

    // },
  },
  created() {
    console.log("this.myDepartments", this.myDepartments);
    let listDepartment = this.myDepartments.filter(
      (d) =>
        d.parentId != 102498 &&
        d.parentId != 102451 &&
        d.parentId != 102531 &&
        d.parentId != 102533
    );
    listDepartment.forEach((el) => {
      this.departments.push({
        label: `[${el.code}] ` + el.name,
        value: el.id,
      });
    });
    // this.todayThu = this.getThuHienTai(today)
    if (this.departments.length > 0) {
      this.myDepartment = this.departments[0];
    }
    if (this.myDepartment) {
      this.load();
    }
  },
  watch: {
    myDepartment() {
      this.searchQuery = "";
    },
  },
  methods: {
    ...mapActions("production", ["getActivePackage_update2"]),
    close() {
      this.option = null;
    },
    async updateStatus(data, i) {
      console.log("data", data);
      if (data.bang == 1) {
        let payload1 = {
          id: data.ID,
          verifyBy: this.userInfo.id,
          status: this.selectionTT[i],
        };
        await this.getActivePackage_update2(payload1);
        this.selectionTT[i] = null;
        this.load();
      } else {
        const payload = {
          id: data.ID,
          status: this.selectionTT[i],
        };
        await this.$store.dispatch(
          "production/UPDATE_STATUS_XUAT_GO_BAO",
          payload
        );
        this.selectionTT[i] = null;
        this.load();
      }
    },
    async timkiem() {
      if (this.searchQuery) {
        if (
          this.myDepartment.value == 102487 ||
          this.myDepartment.value == 102495
        ) {
          this.dataReceiptFilter = this.luadat.filter((d) => {
            const matchString = d.SL[0].NAME;
            return matchString
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase());
          });
        } else
          this.dataReceiptFilter = this.dataReceipt.filter((d) => {
            const matchString =
              d.itemName +
              " " +
              d.itemHeight +
              " " +
              d.itemWidth +
              " " +
              d.itemLength;
            return matchString
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase());
          });
      }
    },
    async nhanvesl(i) {
      console.log("sl:", i);
      this.nhanve[i] = false;
    },
    async huy(k) {
      //  console.log('sl:',this.nhanve[i])
      this.selectionTT[k] = null;
      //  this.nhanve[k] = true
      await this.load();
    },
    async capPhoiPoCode(code, quantity) {
      console.log("code");
      console.log(code);
      await this.receipt(code, quantity);
      this.load();
    },
    async xoaPhoi(dataxoa){
    // if (dataxoa.bang == 1){
    //   const payload = {
    //     packageId: dataxoa.ID
    //   }
    //   const data = await this.$store.dispatch(
    //     "production/DELETE_PHOI_IN_PACKAGE",
    //     payload
    //   );
    //   if(data.meta.success){
    //     showNotifySuccess();
    //     this.load();
    //   }
    // }
     
      const payload = {
        packageId: dataxoa.ID,
        bang:dataxoa.bang,
      }
      const data = await this.$store.dispatch(
        "production/DELETE_PHOI_IN_PACKAGE",
        payload
      );
      if(data.meta.success){
        showNotifySuccess();
        this.load();
      }
    
    },
    async nhanluadat(ID) {
      const payload = {
        CREATE_BY: this.userInfo.id,
        ID,
      };
      const data2 = await this.$store.dispatch(
        "production/GET_NHAN_GO_BAO_CAT",
        payload
      );
      if (data2.meta.success) {
        this.load();
      } else {
        showNotifyError();
      }
    },
    async layPackageIds(bang, stepId, itemId, CREATE_BY, quantity, ID) {
      console.log("hello:", bang);
      if (bang == 1) {
        const payload = {
          ID,
          CREATE_BY,
        };
        const data = await this.$store.dispatch(
          "production/GET_LOT_WAIT_RECEIPT_PHUONG",
          payload
        );
        this.sanluongnhan = data.data;

        this.soLuongNhan2 = quantity;

        this.showConfirmDialog = true;
      } else { if (bang == 2) {
        const payload = {
          CREATE_BY,
          ID,
        };
        const data2 = await this.$store.dispatch(
          "production/GET_NHAN_GO_BAO_CAT",
          payload
        );
        if (data2.meta.success) {
          this.load();
        } else {
          showNotifyError();
        }
      } else {
         const payload = {
          CREATE_BY,
          ID,
        };
        const data2 = await this.$store.dispatch(
          "production/GET_NHAN_GO_TH",
          payload
        );
        if (data2.meta.success) {
          this.load();
        } else {
          showNotifyError();
        }
      }
      }
    },
    async receipt(code = "", quantity = 0) {
      for (let i = 0; i < this.sanluongnhan.length; i++) {
        const payload = {
          packageId: this.sanluongnhan[i].id,
          numberInventory: this.myDepartment.value,
          nhanTon: this.dataReceipt[0].nhanTon,
          itemId: this.sanluongnhan[i].itemId,
        };
        const data = await this.$store.dispatch(
          "production/POST_NHAN_LOT_NO",
          payload
        );

        if (data.meta.success) {
          this.load();
        } else {
          showNotifyError();
        }
      }
    },
    chonCongDoan() {
      this.load();
      if (
        this.myDepartment.value == 102487 ||
        this.myDepartment.value == 102495
      ) {
        this.hienthi = true;
      }
      else this.hienthi = false
    },
    async load() {
      this.dataReceiptFilter = [];
      this.luadat = [];
      const data2 = await this.$store.dispatch("production/GET_LUA_DAT", {
        stepId: this.myDepartment.value,
      });
      this.slluadat = data2.data;
      if (
        (this.myDepartment.value == 102487 ||
          this.myDepartment.value == 102495) &&
        this.selection == false
      ) {
        const data = await this.$store.dispatch(
          "production/GET_LOT_WAIT_LUA_DAT",
          {
            stepId: this.myDepartment.value,
          }
        );
        this.dataReceipt = data.data;
        this.dataReceipt.forEach((d) => {
          this.lua = [];
          this.lua = this.slluadat.filter((el) => el.BAO_ID == d.ID);
          this.luadat.push({
            ID: d.ID,
            SOURCE_ID: d.SOURCE_ID,
            DESTINATION_ID: d.DESTINATION_ID,
            createdAt: d.createdAt,
            createdby: d.createdby,
            SL: this.lua,
          });
        });
        this.dataReceiptFilter = this.luadat;
        // console.log('lua dat',this.luadat)
      } else {
        const data = await this.$store.dispatch(
          "production/GET_LOT_WAIT_RECEIPT",
          {
            stepId: this.myDepartment.value,
          }
        );
        this.dataReceipt = data.data;
        this.dataReceiptFilter = this.dataReceipt;
      }
      let i = 0;
      if (this.dataReceipt.length > 0) {
        for (i = 0; i < this.dataReceipt.length; i++) this.nhanve[i] = true;
        this.selectionTT[i] = null;
      }
      if (this.luadat.length > 0) {
        for (i = 0; i < this.luadat.length; i++) this.nhanve[i] = true;
        this.selectionTT[i] = null;
      }
    },
    chon(item) {
      this.currentNo = item;
      this.showConfirmDialog = true;
    },
  },
};
</script>

<style>
.top-title {
  font-family: "Time";
  font-size: 28px;
  font-weight: 800;
}
.receipt-item {
  font-family: "Times New Roman", Times, serif;
  font-size: 18px;
  font-weight: 200;
  color: cornflowerblue;
}
.receipt-no {
  color: mediumblue;
}
.receipt-time {
  font-family: "Times New Roman", Times, serif;
  font-size: 14px;
  font-style: italic;
}
.border {
  border: 2px dotted;
  border-color: brown;
  font-family: "Time New Roman";
}
.help {
  font-family: "Times New Roman", Times, serif;
  font-size: 14px;
  font-style: italic;
  color: red;
}
.q-virtual-scroll__content{
  background-color: #546e7a;
}
</style>
