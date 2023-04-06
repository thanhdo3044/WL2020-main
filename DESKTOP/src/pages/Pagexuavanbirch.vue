<template>
  <q-page class="q-pa-sm">
    <div class="row">
          <q-input
            class="col-2 q-ml-sm"
            @input="loadGrid"
            outlined
            v-model.number="year"
            type="number"
            label="Năm"
          />
          <q-input
            class="col-2 q-ml-sm"
            @input="loadGrid"
            outlined
            v-model.number="week"
            type="number"
            label="Tuần"
          />
          <q-select
            class="col-2 q-ml-sm"
            @input="loadGrid"
            outlined
            v-model="idDepartment"
            :options="options"
            label="Chọn nhà máy"
          />
          <q-select class="col-2 q-mb-sm q-ml-sm" @input="loadBirch" outlined v-model="number" :options="listNumber" label="Lệnh sản xuất" />
      </div>
        <q-card class="my-card">
        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
              :data-source="dataSource"
              :word-wrap-enabled="true"
              :no-data-text="'Không có dữ liệu !'"
              :show-borders="true"
              @row-updated="updated"
            >
              <DxFilterRow :visible="true" />
                 <DxHeaderFilter :visible="true" />
            <DxEditing :allow-updating="true" mode="row" />
              <DxColumn data-field="NAME" width="380" :allowEditing="false" caption="Tên chi tiết" />
              <DxColumn caption="Cấp cho lệnh sản xuất">
                <DxColumn data-field="keHoach" :allowEditing="false" caption="Số lượng kế hoạch" />
                <DxColumn data-field="FACTOR" :allowEditing="false" :calculate-cell-value="calculateHeSo" caption="Hệ số tiêu hao" />
                <DxColumn data-field="QUANTITY" caption="Số lượng ván (Tấm)" />
                <DxColumn data-field="QUANTITY_THUC_TE" :allowEditing="false"  caption="Số lượng ván đã cấp (Tấm)" />
                <DxColumn data-field="VAN" caption="Tên ván">
                  <DxLookup
                    :data-source="vans"
                    display-expr="NAME"
                    value-expr="ID"
                  />
                </DxColumn>
              </DxColumn>
              <DxColumn caption="Ghi chú" />
            </DxDataGrid>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { showNotifySuccess, showNotifyError } from "../utils/utils";
import { roundNumber, getWeekNumber } from "../ultils";
import { mapGetters, mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxHeaderFilter,
  DxFilterPanel,
  DxFilterRow,
  DxLookup,
  DxEditing,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxHeaderFilter,
    DxFilterRow,
    DxLookup,
    DxFilterPanel,
    DxEditing,
  },
  data() {
    return {
      idDepartment: null,
      van: null,
      vans: [],
      dataSource: [],
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
      listNumber: [],
      number: "",
      year: null,
      week: null,
      nhap_month: null,
      chuyen_thang: null,
      history_thang: null,
      nhap_year: null,
      chuyen_nam: null,
      history_nam: null,
    };
  },
  computed: {
    ...mapGetters("lenhSanXuats", ["soLenhSanXuats"]),
    ...mapGetters("base", ["userInfo"]),
  },
  async created() {
    const today = new Date();
    const currentMonth = today.getMonth();
    this.nhap_month = currentMonth + 1;
    this.chuyen_thang = this.nhap_month;
    this.history_thang = currentMonth + 1;
    const currentYear = today.getFullYear();
    this.year = currentYear;
    this.week = getWeekNumber(today);
    this.nhap_year = currentYear;
    this.chuyen_nam = currentYear;
    this.history_nam = currentYear;
    await this.getVan();
  },
  methods: {
    ...mapActions("item", ["getItemsVan"]),
    ...mapActions("lenhSanXuats", [
      "getTinhHeSoLSX",
      "insertBirch",
      "InsertItemInPackageByBirch",
    ]),
    async loadBirch() {
      let data = await this.getTinhHeSoLSX(this.number);
      this.dataSource = data.data;
      console.log("data :", this.dataSource);
    },
    async getVan() {
      let data = await this.getItemsVan();
      this.vans = data.data;
      console.log("van", this.vans);
    },
    calculateHeSo(rowData) {
      if (rowData.QUANTITY_THUC_TE != 0 && rowData.QUANTITY == 0) {
        rowData.HE_SO = roundNumber(
          rowData.QUANTITY_THUC_TE / rowData.keHoach,
          2
        );
      } else {
        rowData.HE_SO = roundNumber(rowData.QUANTITY / rowData.keHoach, 2);
      }

      return rowData.HE_SO;
    },
    async updated(e) {
      let payload = {
        birch: e.data,
        number: this.number,
        factoryId: this.idDepartment.factoryId,
        accountId: this.userInfo.id,
      };

      let result = await this.insertBirch(payload);
      console.log("data update: ", result.data[0].ID);
      let payload2 = {
        packageId: result.data[0].ID,
        itemId: e.data.ID,
        quantity: e.data.keHoach,
        factoryId: this.idDepartment.factoryId,
      };
      let result2 = await this.InsertItemInPackageByBirch(payload2);
      if (result2.meta.success) {
        showNotifySuccess();
        await this.loadBirch();
      } else {
        showNotifyError();
      }
    },
    async loadGrid() {
      const payload = {
        week: this.week,
        year: this.year,
        factoryId: this.idDepartment.factoryId,
      };
      const data = await this.$store.dispatch("prod/GET_HE_SO_LSX", payload);
      this.listNumber = [];
      data.data.forEach((element) => {
        this.listNumber.push(element.number);
      });
    },
  },
};
</script>