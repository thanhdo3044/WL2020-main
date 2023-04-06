<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary print-hide">
      <div class="row">
        <div class="col-6 top-title text-orange">
          Cập nhập đơn giá tính lương
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <q-btn
          class="col-2 q-mb-sm"
          color="primary"
          icon="assignment_return"
          label="Cập nhật đơn giá"
          @click="capnhat"
        />
        <q-input
          class="col-2 q-mb-sm q-ml-sm"
          outlined
          @input="loadNumber"
          v-model="selectDate"
          fill-mask
          mask="####-##-##"
          label="Ngày áp dụng"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="selectDate"
                  mask="YYYY-MM-DD"
                  @input="loadNumber"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </q-card-section>
    <q-card-section>
      <DxDataGrid
        :data-source="dataSource"
        :show-borders="true"
        :selected-row-keys="selectedItemKeys"
        @selection-changed="selectionChanged"
      >
        <DxSelection mode="multiple" />
        <DxColumn data-field="PARENT_NAME" caption="Chi tiết cha" />
        <DxColumn data-field="ITEM_NAME" caption="Chi tiết con" />
        <DxColumn data-field="GIA_MOI" caption="Đơn giá mới" />
        <DxColumn data-field="GIA_CU" caption="Đơn giá cũ" />
        <DxColumn data-field="CREATE_NAME" caption="Người tạo" />
        <DxColumn data-field="DEPARTMENT_NAME" caption="Công đoạn" />
      </DxDataGrid>
    </q-card-section>
  </q-page>
</template>

<script>
import { DxDataGrid, DxColumn, DxSelection } from "devextreme-vue/data-grid";
import { showNotifySuccess, showNotifyError } from "../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSelection,
  },
  data() {
    return {
      selectDate: new Date(),
      dataSource: [],
      dataTemp: [],
      selectedItemKeys: [],
      selectionChanged: (data) => {
        const giaTinhLuongIds = data.selectedRowsData.map((row) => `${row.ID}`);
        this.dataTemp = { giaTinhLuongIds };
        console.log("dataTemp: ", this.dataTemp);
      },
    };
  },
  created() {
    this.load();
  },
  methods: {
    async load() {
      const data = await this.$store.dispatch("prod/getDonGiaTinhLuong");
      this.dataSource = data.data;
    },
    loadNumber(){
      console.log("date", this.selectDate);
    },
    async capnhat() {
      const payload = {
        giaTinhLuongIds: this.dataTemp,
        accountId: this.$store.state.base.userInfo.id,
        selectDate: this.selectDate + " 06:00"
      };
      let result = await this.$store.dispatch(
        "prod/UpdateDonGiaTinhLuong",
        payload
      );
      if(result.meta.success){
        showNotifySuccess();
        this.load();
      }else{
        showNotifyError();
      }
    },
  },
};
</script>