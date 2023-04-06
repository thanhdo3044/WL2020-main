<template>
  <q-page class="q-pa-md">
    <div class="row top-title">
      <div class="col-12">Danh sách các phôi chờ nhận</div>
    </div>
    <div class="row q-mt-sm">
      <div class="col-12">
        <q-select
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
        <q-input outlined v-model="searchQuery" type="text" label="Tìm kiếm" />
      </div>
    </div>
    <q-separator spaced />
      <div
        class="col-12 q-mt-sm"
        v-for="item in dataReceiptFilter"
        v-bind:key="item.id"
      >
        <q-card class="my-card">
          <q-card-section>
            <div class="row">
              <div class="text-subtitle2 sub-receipt">
                [{{ item.itemCode }}] {{ item.itemName }} ({{
                  item.itemHeight
                }}*{{ item.itemWidth }}*{{ item.itemLength }})
              </div>
            </div>
            <q-input
              v-model.number="item.quantity"
                :readonly="true"
              type="number"
             
              label="Số lượng phôi"
            />
              <q-item-label
                      >Người giao:
                      {{
                        getAccountById(item.CREATE_BY) | FullName
                      }}</q-item-label
                    >
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              dense
              icon="cloud_download"
              @click="
                layPackageIds(myDepartment.value, item.itemId, item.quantity)
              "
              no-caps
              color="primary"
              label="Nhận"
            ></q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6">Bạn đã chắc chắn !</span>
        </q-card-section>
        <q-card-section>
          Nhận số :
          <strong>{{ soLuongNhan2 }}</strong> về
          <span style="color:green">{{ myDepartment.label }}</span>
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
import { showNotifyError } from "../../../utils/utils";
export default {
  data() {
    return {
      myDepartment: null,
      departments: [],
      dataReceipt: [],
      sanluongnhan: [],
      showConfirmDialog: false,
      currentNo: {},
      searchQuery: "",
      dupplicateData: [],
      resultString: "",
      soLuongNhan2: 0,
    };
  },
  computed: {
     ...mapGetters("orders", ["getAccountById"]),
    dataReceiptFilter() {
      if (this.searchQuery)
        return this.dataReceipt.filter(d => {
          const matchString = d.itemName + " ";
          d.itemHeight + " " + d.itemWidth + " " + d.itemLength;
          return matchString
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        });
      return this.dataReceipt;
    }
  },
  created() {
    this.$store.getters["base/mySources"].forEach(element => {
      this.departments.push({
        value: element.id,
        label: element.name
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
    }
  },
  methods: {
    async capPhoiPoCode(code, quantity) {
      console.log("code");
      console.log(code);
      await this.receipt(code, quantity);
      this.load();
    },
    async layPackageIds(stepId, itemId, quantity) {
      const payload = {
        stepId,
        itemId
      };
      const data = await this.$store.dispatch(
        "production/GET_LOT_WAIT_RECEIPT_PHUONG",
        payload
      );
      this.sanluongnhan = data.data;
      this.soLuongNhan2 = quantity;
      console.log(data);
      this.showConfirmDialog = true;
    },
    async receipt(code = "", quantity = 0) {
      if (code) {
        await this.$store.dispatch("po/themTonKeHoach3", { code, quantity });
        return;
      }
      console.log("kjskdfjksjfjsdkfjkd")
      for (let i = 0; i < this.sanluongnhan.length; i++) {
        const payload = {
          packageId: this.sanluongnhan[i].id,
          numberInventory: this.myDepartment.value,
          nhanTon: this.dataReceipt[0].nhanTon,
          itemId: this.sanluongnhan[i].itemId
        };
        const data = await this.$store.dispatch(
          "production/POST_NHAN_LOT_NO",
          payload
        );
        console.log(this.sanluongnhan[i].quantiy);
        console.log(this.sanluongnhan[i].x);
        console.log(this.soLuongNhan2);

        if (this.soLuongNhan2 - this.sanluongnhan[i].quantiy < 0) {
          console.log("chao mưng den với sua san luong");
          const payload1 = {
            ID: this.sanluongnhan[i].x,
            QUANTITY: this.soLuongNhan2
          };
          const data1 = await this.$store.dispatch(
            "production/PUT_SAN_LUONG_ID",
            payload1
          );
          this.soLuongNhan2 = 0;
        } else {
          this.soLuongNhan2 = this.soLuongNhan2 - this.sanluongnhan[i].quantiy;
        }

        if (data.meta.success) {
          this.load();
        } else {
          showNotifyError();
        }
      }
    },
    chonCongDoan() {
      this.load();
    },
    async load() {
      const data = await this.$store.dispatch(
        "production/GET_LOT_WAIT_RECEIPT",
        {
          stepId: this.myDepartment.value
        }
      );
      this.dataReceipt = data.data;
    },
    chon(item) {
      this.currentNo = item;
      this.showConfirmDialog = true;
    }
  }
};
</script>

<style scoped>
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
</style>
