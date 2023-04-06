<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row print-hide" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Tạo phiếu khiếu nại sản phẩm lỗi:
          <span class="text-amber-14">{{ factory ? factory.label : "" }}</span>
        </div>
        <!-- 
        <div
          class="col-6 cursor-pointer text-blue text-bold"
          style="font-size: 18px"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
          <span class="text-amber-14">{{ denNgay }}</span>
        </div> -->
      </div>
    </div>

    <q-card>
      <div style="padding: 5px">
        <div class="row bg-grey-1 print-hide" style="padding: 5px 0 5px 0">
          <div class="col-12">
            <div class="row">
              <!-- <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in options"
                :key="index"
              > -->
              <q-select
                class="col-3 q-ml-sm"
                @input="onChange"
                outlined
                label-color="orange"
                v-model="idDepartment"
                :options="options"
                label="Chọn nhà máy báo lỗi"
              />
              <q-select
                class="col-3 q-ml-sm"
                outlined
                label-color="orange"
                v-model="idDepartmentnhan"
                :options="options"
                label="Chọn nhà máy phải làm bù"
              />

              &emsp; &emsp; &emsp;
              <q-input
                color="grey-3"
                readonly
                label-color="orange"
                outlined
                v-model="code"
                label="Mã phiếu"
              
              >
              </q-input>

              &emsp; &emsp; &emsp;
              <q-btn
                class="col-2"
                style="height: 39px; margin-right: 50px"
                color="positive"
                label="Tạo phiếu"
                @click="onSelectionCreate"
              />
            </div>
          </div>
        </div>
        <div class="col-2" align="left">
          <q-btn
            v-show="true"
            style="margin-right: 30px"
            color="positive"
            label="Chọn SP lỗi"
            @click="addItem"
          />
        </div>
      </div>
      <q-dialog v-model="showChooseItem" persistent>
        <q-card style="min-width: 70%">
          <q-card-section class="row items-center">
            <span style="font-size: 20px; color: #21ab45; padding-left: 16px"
              >Nhập thông tin sản phẩm lỗi
            </span>
          </q-card-section>
          <q-card-section style="padding-top: 0px">
            <div class="row justify-around">
                <div class="col-12 col-md-5 q-mt-sm">
                <q-select
                  use-input
                  v-model="stepId"
                  :options="data3"
                  @input="loadItems"
                  label="Công đoạn báo lỗi"
                 @filter="filterFn1"
                />
              </div>
              <div class="col-12 col-md-5 q-mt-sm">
                <q-select
                  use-input
                  v-model="itemId"
                  :options="data2"
                  label="Sản phẩm"
                  @filter="filterFn"
                />
              </div>
               <div class="col-12 col-md-5 q-mt-sm">
                <q-input v-model="QUANTITY" type="text" label="Số lượng" />
              </div>
              <div class="col-12 col-md-5 q-mt-sm">
                <q-input v-model="type_name" type="text" label="Loại lỗi" />
              </div>
             
              <div class="col-12 col-md-5 q-mt-sm">
                <q-input v-model="DESCRIPTION" type="text" label="Diễn giải" />
              </div>
             
              
                 <div class="col-12 col-md-5 q-mt-sm"></div>
            </div>
          </q-card-section>
          <q-separator />

          <q-card-actions align="right">
            <q-btn label="Lưu" @click="createItem" color="positive" />
            <q-btn label="Hủy" color="orange" @click="cancel" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <DxDataGrid
        :data-source="dataSource"
        :show-borders="true"
        :word-wrap-enabled="true"
        :show-row-lines="true"
        :show-column-lines="true"
        :no-data-text="'Không có dữ liệu'"
      >
        <DxEditing :allow-updating="true" :allow-deleting="true" mode="pop" />
        <DxSelection mode="multiple" />
        <DxFilterPanel :visible="true" />
        <DxColumn
          data-field="ITEM_ID"
          caption="Tên sản phẩm"
          :allowEditing="true"
          width="540"
          alignment="center"
        >
          <DxLookup
            :data-source="data2"
            display-expr="label"
            value-expr="value"
          />
        </DxColumn>

        <DxColumn
          data-field="QUANTITY"
          caption="Số lượng"
          data-type="number"
          format="#,##0.######"
          width="100"

        />
        <DxColumn data-field="TYPE_NAME" caption="Loại lỗi" width="200" alignment="center"/>

        <DxColumn data-field="DESCRIPTION" caption="Diễn giải" width="200" alignment="center"/>
            <DxColumn
          data-field="STEP_ID"
          caption="Công đoạn báo lỗi"
          :allowEditing="true"
          width="540"
          alignment="center"
        >
          <DxLookup
            :data-source="data3"
            display-expr="label"
            value-expr="value"
          />
        </DxColumn>
      </DxDataGrid>
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
  DxExport,
  DxEditing,
  DxLookup,
  DxColumn,
  DxFilterRow,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxFilterRow,
    DxEditing,
    DxLookup,
    DxExport,
    DxColumn,
    DialogSelectDate,
  },
  data() {
    return {
      gio: "00",
      phut: "00",
      day: "00",
      month: "00",
      year: "201",
      codeBB: "",
      create_name: "",
      type: "chua-duyet",
      created_by: 0,
      fromDate: null,
      toDate: null,
      itemId: null,
      stepId:null,
      type_name: null,
      liststepId:[],
      data2: [],
      data3:[],
      data4:[],
      code: "",
      idDepartment: {
        label: "Nhà máy CBG Thuận Hưng",
        factoryId: 100000,
        code: "TH",
      },
      idDepartmentnhan: {
        label: "Nhà máy CBG Thuận Hưng",
        factoryId: 100000,
        code: "TH",
      },
      codes: [],
      code: "",
      QUANTITY: null,
      DESCRIPTION: null,
      REMEDIES_NAME: null,
      showChooseDate: false,
      dataSource: [],
      showChooseItem: false,
      factory: {
        label: "Nhà máy CBG Thuận Hưng",
        factoryId: 100000,
        code: "TH",
        gdsx: 100374,
        qc: 101690,
      },
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
          gdsx: 100374,
          qc: 101690,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102340,
          code: "YS1",
          gdsx: 101863,
          qc: 101881,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102366,
          code: "TB",
          gdsx: 101931,
          qc: 102079,
        },
      ],
    };
  },
  created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.loadstepId()
    //this.loadItems();
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
    ...mapActions("prod", ["insertBBKN", "getListCodeInBBkhieunai","getGroupDepartment"]),
    async onChange() {
      // format TH-QC-000001
      let data = await this.getListCodeInBBkhieunai(
        this.idDepartment.factoryId
      );
    this.loadstepId()
      if (data.data.length === 0) {
        this.code = this.idDepartment.code + "-KN-000001";
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
        this.code = this.idDepartment.code + "-KN-" + value;
      }
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.data2 = this.listItem;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.data2 = this.listItem.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
     filterFn1(val, update) {
      if (val === "") {
        update(() => {
          this.data3 = this.liststepId;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.data3 = this.liststepId.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async createItem() {
      this.dataSource.push({
        ITEM_ID: this.itemId.value,
        TYPE_NAME: this.type_name,
        QUANTITY: this.QUANTITY,
        DESCRIPTION: this.DESCRIPTION,
        STEP_ID:this.stepId.value,
      });
      this.showChooseItem = false;
    },
    cancel() {
      this.showChooseItem = false;
    },
    addItem() {
      this.itemId = null;
      this.DESCRIPTION = null;
      this.QUANTITY = null;
      this.type_name = null;
      this.showChooseItem = true;
      this.stepId = null;
    },
    async onSelectionCreate() {
      let payload = {
        code: this.code,
        packageIds: this.dataSource,
        accountId: this.userInfo.id,
        factoryId: this.idDepartment.factoryId,
        factoryIdnhan: this.idDepartmentnhan.factoryId,
      };

      let result = await this.insertBBKN(payload);
      if (result.meta.success) {
        this.onChange();
        this.dataSource = [];
        showNotifySuccess("Tạo thành công !");
        // this.$router.push("/bien-ban-xu-ly-sp/");
      } else {
        showNotifyError();
      }
    },
 async   loadstepId(){
 let data1 = await this.getGroupDepartment();
      data1 = data1.filter((d) => d.factoryId == this.idDepartment.factoryId);
      data1.forEach(e =>{
        this.data4.push({
            value: e.ID,
            label: e.departmentName,
        })
      })
        this.liststepId = this.data4;
    },
    async loadItems() {
      this.data2 = [];
      const payload = {
        stepId: this.stepId.value,
      
      };

      let data = await this.$store.dispatch("prod/GET_ITEMSS", payload);
      data.data.forEach((e) => {
     
          let itemName = `${e.ID} - ${e.NAME} - (${e.HEIGHT}*${e.WIDTH}*${e.LENGTH})`;
          this.data2.push({
            value: e.ID,
            label: itemName,
          });
        
      });
      this.listItem = this.data2;
    },
  },
};
</script>