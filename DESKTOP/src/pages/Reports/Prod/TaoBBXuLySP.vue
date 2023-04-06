<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Biên bản xử lý sản phẩm không phù hợp
          <span class="text-amber-14">{{ factory ? factory.label : "" }}</span>
        </div>

        <div
          class="col-6 cursor-pointer text-blue text-bold"
          style="font-size: 18px"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
          <span class="text-amber-14">{{ denNgay }}</span>
        </div>
      </div>
    </div>
    <q-card>
      <div style="padding: 5px">
        <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
          <div class="col-6">
            <div class="row">
              <div
                class="col-3 col-md-3"
                v-for="(congDoan, index) in options"
                :key="index"
              >
                <q-radio
                  dense
                  @input="onChange"
                  v-model="factory"
                  :val="congDoan"
                  :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  color="amber-6"
                />
              </div>
            </div>
          </div>
          <q-btn
            class="col-1"
            style="height:39px; margin-right:50px"
            color="positive"
            label="Tạo phiếu"
            @click="onSelectionCreate"
          />
         <div class="col-1">
            <q-input
              color="grey-3"
              readonly
              label-color="orange"
              outlined
              v-model="code"
              label="Mã biên bản"
              dense
            >
            </q-input>
          </div>
          
        </div>
        <DxDataGrid
          :data-source="dataSource"
          id="gridContainer"
          :show-borders="true"
          :word-wrap-enabled="true"
          :show-row-lines="true"
          :show-column-lines="true"
          :selected-row-keys="selectedItemKeys"
          @selection-changed="selectionChanged"
          @row-removed="del"
          :no-data-text="'Không có dữ liệu'"
        >
          <DxEditing :allow-deleting="true" mode="popup" />
          <DxSelection mode="multiple" />
          <DxScrolling mode="infinite" />
          <DxFilterRow :visible="true" />
          <DxColumn data-field="ID" caption="Mã" :visible="false" />
          <DxColumn data-field="ITEM_NAME" caption="Tên sản phẩm" />
          <DxColumn data-field="TYPE_NAME" caption="Loại lỗi" width="150" />
          <DxColumn data-field="number" caption="Lệnh sản xuất" width="150" />
          <DxColumn
            data-field="UNIT_NAME"
            caption="ĐVT"
            width="100"
            alignment="center"
          />
          <DxColumn
            data-field="QUANTITY"
            caption="Số lượng"
            data-type="number"
            format="#,##0.######"
            width="100"
          />
          <DxColumn data-field="DESCRIPTION" caption="Diễn giải" />
          <DxColumn data-field="REMEDIES_NAME" caption="Cách xử lý" />
          <DxColumn data-field="LAST_NAME" caption="Xử lý" width="150px" />
        </DxDataGrid>
      </div>
    </q-card>

    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
  </q-page>
</template>

<script>
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import moment from "moment";
import {
  formatDateISO,
  formatDateVN,
  getFisrtDayOfMonth,
  showNotifySuccess,
  showNotifyError,
} from "../../../ultils";
import { mapGetters, mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxSelection,
  DxFilterRow,
  DxScrolling,
  DxFilterPanel,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSelection,
    DxEditing,
    DxFilterRow,
    DxScrolling,
    DxFilterPanel,
    DialogSelectDate,
  },
  data() {
    return {
      fromDate: null,
      toDate: null,
      code: "",
      showChooseDate: false,
      dataSource: [],
      factory: null,
      packageIds: [],
      selectedItemKeys: [],
      selectionChanged: (data) => {
        const packageId = data.selectedRowsData.map((row) => `${row.ID}`);
        this.packageIds = { packageId };
      },
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 100004,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 100005,
          code: "TB",
        },
      ],
    };
  },
  created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load(this.factory.factoryId);
    this.onChange();
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("prod", [
      "getBBSanPhamLoi",
      "updateListBCXuLyLoi",
      "getCodeInItemError",
      "insertQCItemError",
    ]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      // console.log(this.factory.factoryId)
      this.load(this.factory.factoryId);
    },
    async onChange() {
      // format TH-QC-000001
      let data = await this.getCodeInItemError(this.factory.factoryId);
      console.log(data.data);
      if (data.data.length === 0) {
        this.code = this.factory.code + "-QC-000001";
        console.log("code: ", this.code);
      } else {
        let number = data.data[0].CODE;
        let length = number.length;
        number = number.substring(length - 6, number.length);
        console.log("number", number);
        number = parseInt(number);
        number = number + 1;
        let value = "";
        if (number < 10) {
          value = "00000" + number.toString();
        } else if (number < 100) {
          value = "0000" + number.toString();
        } else if (number < 1000) {
          value = "000" + number.toString();
        } else if (number < 10000) {
          value = "00" + number.toString();
        } else if (number < 100000) {
          value = "0" + number.toString();
        } else {
          value = number.toString();
        }
        this.code = this.factory.code + "-QC-" + value;
      }
      await this.load(this.factory.factoryId);
    },
    async load(myFactoryId) {
      this.dataSource = [];
      if (myFactoryId && this.fromDate != null) {
        let payload = {
          fromDate: formatDateISO(this.fromDate),
          toDate: formatDateISO(this.toDate),
          factoryId: myFactoryId,
        };
        console.log("payload", payload);
        const data = await this.getBBSanPhamLoi(payload);
        if (this.userInfo.id == 100400 || this.userInfo.id == 102089) {
          this.dataSource = data.data;
        } else {
          this.dataSource = data.data.filter(
            (d) => d.LAST_NAME == this.userInfo.lastName
          );
        }
      }
    },
    async del(e) {
      const payload = {
        ID: e.data.ID,
      };
      const data = await this.$store.dispatch("prod/XOA_BB_QC", payload);
      if (data.meta.success) {
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
    async onSelectionCreate() {
      if (this.factory.factoryId == 100000) {
        this.accountIdqc = 101690
        this.accountIdsx = 100374
      }
       if (this.factory.factoryId == 100004) {
        this.accountIdqc = 101881
        this.accountIdsx = 101863
      }
       if (this.factory.factoryId == 100005) {
        this.accountIdqc = 102079
        this.accountIdsx = 101931
      }
      let payload = {
        code: this.code,
        packageIds: this.packageIds,
        accountId: this.userInfo.id,
        factoryId: this.factory.factoryId,
        accountIdqc:this.accountIdqc,
        accountIdsx:this.accountIdsx,
      };
      console.log("payload", payload);
      let result = await this.insertQCItemError(payload);
      if (result.meta.success) {
        this.onChange();
        this.load(this.factory.factoryId);
        showNotifySuccess("Duyệt thành công !");
        this.$router.push("/bien-ban-xu-ly-sp/");
      } else {
        showNotifyError();
      }
    },
  },
};
</script>

<style>
#gridContainer {
  height: 700px;
}
</style>