<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary">
      <div class="row">
        <div class="col-6 top-title text-orange">
          Biên bản xử lý sản phẩm không phù hợp
        </div>
        <div
          class="col-6 top-title text-orange cursor-pointer"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày {{ tuNgay }} đến {{ denNgay }}
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="q-gutter-md row print-hide">
        <q-select
          class="col-2"
          color="grey-3"
          label-color="orange"
          filled
          v-model="factory"
          :options="options"
          label="Chọn Nhà Máy"
          @input="onChange"
          dense
        />
        <div class="col-2">
          <q-input
            color="grey-3"
            readonly
            label-color="orange"
            outlined
            v-model="code"
            label="Mã biên bản"
            dense
          >
            <template v-slot:append>
              <q-icon name="work" color="orange" />
            </template>
          </q-input>
        </div>
        <q-btn
          class="col-2"
          color="primary"
          icon="save_alt"
          label="Tạo phiếu"
          @click="onSelectionCreate"
        />
      </div>
    </q-card-section>
    <q-card-section>
      <DxDataGrid
        :data-source="dataSource"
        :show-borders="true"
        :word-wrap-enabled="true"
        :show-row-lines="true"
        :show-column-lines="true"
        :selected-row-keys="selectedItemKeys"
        @selection-changed="selectionChanged"
        @row-removed="del"
        :no-data-text="'Không có dữ liệu'"
      >
        <DxEditing 
        
        :allow-deleting="true" mode="popup" />
        <DxSelection mode="multiple" />
        <DxFilterPanel :visible="true" />
        <DxFilterRow :visible="true" />
        <DxColumn data-field="ID" caption="Mã" :visible="false" />
        <DxColumn data-field="ITEM_NAME" caption="Tên sản phẩm" />
        <DxColumn data-field="TYPE_NAME" caption="Loại lỗi" width="150" />
        <DxColumn
          data-field="QUANTITY"
          caption="Số lỗi"
          data-type="number"
          format="#,##0.####"
          width="100"
        />
        <DxColumn data-field="DESCRIPTION" caption="Diễn giải" />
        <DxColumn data-field="REMEDIES_NAME" caption="Cách xử lý" />
        <DxColumn data-field="LAST_NAME" caption="Xử lý" width="150px" />
      </DxDataGrid>
      <div class="row">
        <div class="col-6 text-center"><b>Giám đốc sản xuất</b></div>
        <div class="col-6 text-center"><b>Trưởng phòng QC</b></div>
      </div>
    </q-card-section>
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
  showNotifyError
} from "../../../ultils";
import { mapGetters, mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxSelection,
  DxFilterRow,
  DxFilterPanel,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSelection,
    DxEditing,
    DxFilterRow,
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
        const packageId = data.selectedRowsData.map(row => `${row.ID}`);
        this.packageIds = {packageId};
      },
      options: [],
    };
  },
  created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.loadFactory();
    this.load(this.factory.factoryId);
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
      "updateListBCXuLyLoi",
      "getCodeInItemError",
      "insertQCItemError"
    ]),
    ...mapActions("vcn", [
      "getBBSanPhamLoiVCN",
    ]),
    async loadFactory() {
      let factories1 = await this.$store.dispatch("vcn/getFactory");
      factories1.map((factory) => {
        factory.label = factory.name;
        factory.factoryId = factory.id;
      });
      this.options = factories1;
    },
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
        if(number < 10){
          value = "00000"+ number.toString();
        }else if(number < 100){
          value = "0000"+ number.toString();
        }else if(number < 1000){
          value = "000" + number .toString();
        }else if(number < 10000){
          value = "00"+ number.toString();
        }else if(number < 100000){
          value = "0" + number.toString();
        }else{
          value = number.toString();
        }
        this.code = this.factory.code + "-QC-"+ value;
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
        const data = await this.getBBSanPhamLoiVCN(payload);
        this.dataSource = data.data;
      }
    },
          async del(e) {
             
      const payload = {
        ID: e.data.ID

        
      };
      const data = await this.$store.dispatch("prod/XOA_BB_QC", payload);
      if (data.meta.success) {
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
    async onSelectionCreate() {
      let payload = {
        code: this.code,
        packageIds: this.packageIds,
        accountId: this.userInfo.id,
        factoryId: this.factory.factoryId
      }
      console.log("payload", payload);
      let result = await this.insertQCItemError(payload);
      if (result.meta.success) {
        this.onChange();
        this.load(this.factory.factoryId);
        showNotifySuccess("Duyệt thành công !");
        this.$router.push("/bien-ban-xu-ly-sp/")
      } else {
        showNotifyError();
      }
    },
  },
};
</script>