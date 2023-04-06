<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo sản lượng theo lệnh sản xuất - 
          <span class="text-amber-14">{{factoryName}}</span>
        </div>
        <div class="col-6 text-blue text-bold" align="right">
          <span style="font-size: 18px">Từ tuần: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="onChangeFromWeek"
            v-model="fromWeek"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 40px;
            "
          />
          <span style="margin-right:15px">-</span>
          <span style="font-size: 18px">Đến tuần: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="onChangeToWeek"
            v-model="toWeek"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 40px;
            "
          />
          <span style="margin-right:15px">-</span>
          <span style="font-size: 18px">Năm: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="changeDate"
            v-model="year"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 60px;
            "
          />
        </div>
      </div>
    </div>

    <q-card>
      <div style="padding: 5px">
        <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
          <div class="col-12">
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in options"
                :key="index"
              >
                <q-radio
                  dense
                  @input="changeFactory"
                  v-model="factory"
                  :val="congDoan"
                  :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  v-bind:class="{ isActive: true }"
                  color="amber-6"
                />
              </div>
            </div>
          <hr>
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in xuongs"
                :key="index"
              >
                <q-radio
                  dense
                  @input="chonXuong"
                  v-model="xuong"
                  :val="congDoan"
                  :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  v-bind:class="{ isActive: true }"
                  color="amber-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <DxDataGrid
          id="gridContainer"
            :data-source="dataSource"
            :show-borders="true"
            :word-wrap-enabled="true"
            :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
            :show-column-lines="true"
            :allow-column-resizing="true"
          >
            <!-- <DxColumnChooser :enabled="true" />-->
            <DxGroupPanel
              :visible="true"
              :empty-panel-text="
                'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'
              "
            /> 
            <DxFilterRow :visible="true" />
            <!-- <DxFilterPanel :visible="true" /> -->
            <DxHeaderFilter :visible="true" />
            <DxScrolling mode="infinite" />
             <DxSorting mode="none" />
            <DxGrouping :auto-expand-all="true" />
            <DxColumn data-field="ITEM_NAME" width="400" caption="Danh mục sản phẩm" />
            <DxColumn
              data-field="week"
              caption="Tuần"
              :group-index="0"
            />
            <DxColumn
              data-field="number"
              caption="Lệnh sản xuất"
              :group-index="1"
            />
            <DxColumn
              data-field="DEPARTMENT_NAME"
              caption="Công đoạn"
              :group-index="2"
            
            />
            <DxColumn caption="Quy Cách" alignment="center">
              <DxColumn
                caption="Dầy"
                data-field="height"
                format="fixedPoint"
                alignment="center"
                width="90"
                  
              />
              <DxColumn
                caption="Rộng"
                data-field="width"
                format="fixedPoint"
                alignment="center"
                width="90"
              />
              <DxColumn
                caption="Dài"
                data-field="length"
                format="fixedPoint"
                alignment="center"
                width="90"
              />
            </DxColumn>
            <DxColumn
              data-field="keHoach"
              caption="Số lượng cần thực hiện"
              data-type="number"
              :width="120"
              alignment="center"
            />
            <DxColumn
              data-field="daThucHien"
              caption="Số lượng đã thực hiện"
              data-type="number"
              width="120"
              alignment="center"
            />
            <DxColumn
              data-field="conThucHien"
              caption="Số lượng còn thực hiện"
              data-type="number"
              width="120"
              alignment="center"
              :calculate-cell-value="calculateConThucHien"
            />
            <DxColumn
              data-field="loiCongDon"
              caption="Lỗi tại công đoạn"
              data-type="number"
              width="120"
              alignment="center"
            />
            <DxColumn
              data-field="loiLoai"
              caption="Lỗi Loại khỏi chuyền"
              data-type="number"
              width="120"
              alignment="center"
            />
            <DxColumn
              data-field="TY_LE"
              caption="Tỉ lệ đạt KH"
              :customize-text="tiLe"
              width="120"
              alignment="center"
            />
            <DxExport
              :enabled="true"
              :allow-export-selected-data="false"
              :file-name="'Thực hiện KHSX'"
            />
            <!-- <DxSearchPanel
              :visible="true"
              :placeholder="'Tìm kiếm'"
              :width="400"
            /> -->
          </DxDataGrid>
        </div>
      </div>
    </q-card>
      <q-btn fab glossy icon="keyboard_arrow_up" color="primary" />
  </q-page>
</template>

<script>
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";
import { Notify, Loading, QSpinnerIos } from "quasar";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxSearchPanel,
  DxExport,
  DxHeaderFilter,
  DxColumnChooser,
  DxScrolling,
  DxSorting,
  DxFilterRow,
  DxFilterPanel,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxSearchPanel,
    DxExport,
    DxHeaderFilter,
    DxColumnChooser,
    DxScrolling,
    DxSorting,
    DxFilterRow,
    DxFilterRow,
    DxFilterPanel,
  },
  data() {
    return {
      fromDate: "",
      toDate: "",
      fa: 0,
      options: [],
      xuong: null,
      xuongs: [],
      factory: null,
      factoryName: null,
      seachDepartment: null,
      listDeparment: [],
      listNumber: [],
      week: null,
      year: null,
      number: null,
      fromWeek: null,
      toWeek: null,
      dataSource: []
    };
  },
  methods: {
    ...mapActions("vcn", ["getFactory", "getBCThucHienVCN", "getXuongByFactoryId"]),

    tiLe({ valueText }) {
      // if (valueText) return "";
      return `${(valueText * 100).toFixed(1)} %`;
    },
    calculateConThucHien(rowData){
      rowData.conThucHien = rowData.keHoach - rowData.daThucHien - rowData.loiLoai;
      return rowData.conThucHien;
    },
    async loadFactory() {
      const factory = await this.getFactory();
      factory.map((e) => (e.label = e.name));
      this.options = factory;
      this.factory = factory[0];
      this.factoryName = factory[0].label;
    },
    async changeFactory() {
      const payload = {
        factoryId: this.factory.id
      }
      const data = await this.getXuongByFactoryId(payload);
      data.map(e => (e.label = e.name));
      this.xuongs = data;
      this.factoryName = this.factory.label;
    },
    async chonXuong() {
      this.factoryName = this.factory.label;
      this.loadNumber();
    },
    onChangeFromWeek() {
      this.loadNumber();
    },
    onChangeToWeek() {
      this.loadNumber();
    },
    async loadNumber() {
      this.number = null;
      this.seachDepartment = null;
      this.listNumber = [];
      if (this.fa != null && this.fromWeek != null && this.toWeek != null) {
        let payload = {
          fromWeek: this.fromWeek,
          toWeek: this.toWeek,
          year: this.year,
          factoryId: this.xuong.id,
        };
        Loading.show({
          spinner: QSpinnerIos,
          spinnerSize: "100px",
        });
        let data = await this.getBCThucHienVCN(payload);
        this.dataSource = data;
        console.log("dataSource", this.dataSource);
        Loading.hide();
      }
    },
  },
  async created() {
    console.log("pos", this.pos);
    this.loadFactory();
    this.toWeek = moment().week();
    this.fromWeek = this.toWeek - 1;
    this.year = moment().year();
  },
};
</script>

<style scoped>
#gridContainer {
  height: 700px;
}
</style>
