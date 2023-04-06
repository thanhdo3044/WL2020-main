<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary">
      <div class="row">
        <div class="col-6 top-title text-orange">Giá bán sản phẩm</div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-2">
          <q-select
            v-model="code"
            :options="codes"
            filled
            use-input
            input-debounce="0"
            @filter="filterFn"
            @input="onChangeCode"
            label="Chọn mã thị trường"
          />
        </div>
      </div>
      <div>
        <DxDataGrid
          :data-source="dataSource"
          :show-borders="true"
          @init-new-row="InitNewRow"
          @row-inserted="insert"
          @row-updated="updated"
          @row-removed="removed"
        >
          <DxEditing
            :allow-updating="true"
            :allow-adding="true"
            :allow-deleting="true"
            mode="cell"
          />
          <DxPaging :enabled="false" />
          <DxColumn data-field="ITEM_ID" caption="ID" width="100" />
          <DxColumn data-field="CODE" caption="Mã số"  width="200"/>
          <DxColumn data-field="NAME" caption="Tên" width="400" />
          <DxColumn
            data-field="FROM_DATE"
            data-type="date"
            format="dd/MM/yyyy"
            caption="Từ ngày"
            width="200"
          />
          <DxColumn
            data-field="TO_DATE"
            data-type="date"
            format="dd/MM/yyyy"
            caption="Đến ngày"
            width="200"
          />
          <DxColumn data-field="PRICE" caption="Đơn giá" width="100" />
          <DxColumn data-field="CCY" caption="Đơn vị tiền tệ" width="100" />
        </DxDataGrid>
      </div>
    </q-card-section>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxEditing,
  DxLookup,
} from "devextreme-vue/data-grid";
import { mapGetters, mapActions } from "vuex";
import { showNotifySuccess, showNotifyError } from "../ultils";
import moment from "moment";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxEditing,
    DxLookup,
  },
  data() {
    return {
      codes: [],
      codesFilter: [],
      code: null,
      dataSource: [],
    };
  },
  created() {
    this.loadCode();
  },
  methods: {
    ...mapActions("po", [
      "getCodeInMarket",
      "getMainPrices",
      "insertMainPrices",
      "updateMainPrices",
      "deleteMainPrices",
    ]),
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.codes = this.codesFilter;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.codes = this.codesFilter.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async loadCode() {
      const data = await this.getCodeInMarket();
      console.log("data", data);
      this.codes = data.data;
      this.codesFilter = this.codes;
    },
    async onChangeCode() {
      this.loadMainPrice();
    },
    async loadMainPrice() {
      const payload = {
        code: this.code ? this.code.value : 0,
      };
      const data = await this.getMainPrices(payload);
      this.dataSource = data.data;
    },
    InitNewRow(e) {
      if (this.code) {
        e.data.CODE = this.code.value;
        e.data.ITEM_ID = this.code.PRODUCT_ID;
        e.data.NAME = this.code.NAME;
        e.data.CCY = "USD";
      } else {
        this.$q
          .dialog({
            title: "Cảnh báo",
            message: "Vui lòng chọn mã thị trường !",
          })
          .onOk(() => {
            this.loadMainPrice();
          });
      }
    },
    async insert(e) {
      console.log("e", e);
      if(e.data.FROM_DATE != null && e.data.PRICE != null){
        const payload = {
        code: e.data.CODE,
        fromDate: moment(e.data.FROM_DATE).format("YYYY-MM-DD"),
        price: e.data.PRICE,
        ccy: e.data.CCY,
      };
      const data = await this.insertMainPrices(payload);
      console.log("data", data);
      if (data.meta.success) {
        showNotifySuccess();
        this.loadMainPrice();
      } else {
        showNotifyError();
      }
      }else{
        this.$q
        .dialog({
            title: "Cảnh báo",
            message: "Vui lòng nhập đầy đủ thông tin !",
          })
          .onOk(() => {
            this.loadMainPrice();
          });
      }
      
    },
    async updated(e) {
      const payload = {
        id: e.data.ID,
        code: e.data.CODE,
        fromDate: moment(e.data.FROM_DATE).format("YYYY-MM-DD"),
        toDate: moment(e.data.TO_DATE).format("YYYY-MM-DD"),
        price: e.data.PRICE,
        ccy: e.data.CCY,
      };
      const data = await this.updateMainPrices(payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.loadMainPrice();
      } else {
        showNotifyError();
      }
    },
    async removed(e) {
      const payload = {
        id: e.data.ID,
      };
      const data = await this.deleteMainPrices(payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.loadMainPrice();
      } else {
        showNotifyError();
      }
    },
  },
};
</script>

<style>
</style>