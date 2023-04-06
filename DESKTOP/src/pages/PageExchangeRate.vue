<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary">
      <div class="row">
        <div class="col-6 top-title text-orange">Tỷ giá tiền tệ</div>
      </div>
    </q-card-section>
    <q-card-section>
      <DxDataGrid
        :data-source="dataSource"
        :show-borders="true"
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
        <DxColumn data-field="NAM" caption="Năm" width="100" />
        <DxColumn data-field="THANG" caption="Tháng" width="100" />
        <DxColumn data-field="CCY_BEFORE" caption="Ngoại tệ" width="150">
          <DxLookup
            :data-source="ccyBefores"
            display-expr="label"
            value-expr="value"
          />
        </DxColumn>
        <DxColumn data-field="EXCHANGE_RATE" caption="Tỷ giá VNĐ" width="150" />
      </DxDataGrid>
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
      dataSource: [],
      ccyBefores: [
        {
          label: "1 USD",
          value: "USD",
        },
        {
          label: "1 EURO",
          value: "EURO",
        },
      ],
      ccyAfters: [
        {
          label: "VND",
          value: "VND",
        },
      ],
    };
  },
  created() {
    this.load();
  },
  methods: {
    ...mapActions("po", [
      "getExchangeRate",
      "insertExchangeRate",
      "updateExchangeRate",
      "deleteExchangeRate",
    ]),
    async load() {
      const data = await this.getExchangeRate();
      this.dataSource = data.data;
    },
    async insert(e) {
      if (
        e.data.THANG != null &&
        e.data.NAM != null &&
        e.data.CCY_BEFORE != null &&
        e.data.EXCHANGE_RATE != null
      ) {
        console.log("e", e);
        const payload = {
          thang: e.data.THANG,
          nam: e.data.NAM,
          ccyBefore: e.data.CCY_BEFORE,
          exchangeRate: e.data.EXCHANGE_RATE,
        };
        const data = await this.insertExchangeRate(payload);
        console.log("data", data);
        if (data.meta.success) {
          showNotifySuccess();
          this.load();
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
            this.load();
          });
      }
    },
    async updated(e) {
      const payload = {
        id: e.data.ID,
        thang: e.data.THANG,
        nam: e.data.NAM,
        ccyBefore: e.data.CCY_BEFORE,
        exchangeRate: e.data.EXCHANGE_RATE,
      };
      const data = await this.updateExchangeRate(payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.load();
      } else {
        showNotifyError();
      }
    },
    async removed(e) {
      const payload = {
        id: e.data.ID,
      };
      const data = await this.deleteExchangeRate(payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.load();
      } else {
        showNotifyError();
      }
    },
  },
};
</script>

<style>
</style>