<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row print-hide" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Biên bản vào lò
        </div>
      </div>
    <q-card>
      <div style="padding: 5px">

      <div class="row bg-grey-1 print-hide" style="padding: 5px 0 5px 0">
          <div class="col-8">
            <div class="row">
              <div
                class="col-2 col-md-2"
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
                  :class="congDoan == factory ? 'text-amber-6' : 'text-black'"
                  class="text-weight-bold"
                  color="amber-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row bg-grey-1 print-hide" style="padding: 5px 0 5px 0">
          <div class="col-12">
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in dataKiln"
                :key="index"
              >
                <q-radio
                  dense
                  @input="onChangeKiln"
                  v-model="kiln"
                  :val="congDoan"
                  :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  color="amber-6"
                />
              </div>
            </div>
          </div>
        </div>

      <!-- <div class="row print-hide">
        <div class="col-2">
          <q-select
            outlined
            v-model="factory"
            label-color="orange"
            :options="options"
            label="Chọn nhà máy"
            @input="onChange"
          />
        </div>
        <div class="col-2">
          <q-select
            outlined
            v-model="kiln"
            label-color="orange"
            :options="dataKiln"
            label="Chọn lò sấy"
            @input="onChangeKiln"
          />
        </div>
      </div> -->

        <div class="row">
              <div class="col-12" align="right">
                <q-btn
            class="col-1 text-orange"
            style="height: 20px; font-size: 10px"
            color="white"
            outlined
            label="Excel"
            @click="xuat"
          />
              </div>
            </div>

      <div class="row">
        <div class="col-12">
          <div id="table-bb-lo-say">
            <table
              id="table-custom"
              style="border-collapse: collapse"
              border="1"
              width="100%"
            >
             <thead class="w-100">
                <tr>
                  <td width="150px" rowspan="2">
                    <img
                      style="margin: 0px"
                      src="https://app.woodsland.com.vn:2002/img/logo.06aa324e.png"
                      alt="Graphic1"
                      width="100"
                      height="80"
                      data-cke-widget-upcasted="1"
                      data-cke-widget-keep-attr="0"
                      data-widget="image"
                      class="cke_widget_element p-2"
                    />
                  </td>
                  <td style="font-size: 18px" colspan="6" class="text-center">
                    SỔ TAY COC
                  </td>
                  <td width="240px" rowspan="5">
                    <pre>
                      BM-COC-09
                      Ngày BH: 05/09/2013
                      Lần BH: 02
                      </pre
                    >
                  </td>
                </tr>
                <tr>
                  <th style="font-size: 14px" colspan="6" class="text-center">
                    DANH MỤC THEO DÕI GỖ SẤY TRONG LÒ
                  </th>
                </tr>
                <tr>
                  <th style= "font-size: 15px" class="text-left" colspan = "1">Ngày vào lò</th>
                  <th style= "font-size: 15px" class="text-left" colspan = "2">{{ ngay }}</th>
                  <th style= "font-size: 15px" class="text-left" colspan = "2">Địa điểm sấy gỗ</th>
                  <th style= "font-size: 15px" class="text-left" colspan = "2">{{ nhaMay }}</th>
                </tr>
                <tr>
                  <th style= "font-size: 15px" class="text-left" colspan = "1">Lò số</th>
                  <th style= "font-size: 15px" class="text-left" colspan = "2">{{ kilnName }}</th>
                  <th style= "font-size: 15px" class="text-left" colspan = "2">loại gỗ sấy</th>
                 <th style= "font-size: 15px" class="text-left" colspan = "2">Acacia</th>
                </tr>
                <tr>
                  <th style= "font-size: 15px" class="text-left" colspan = "1">Tổng số PL</th>
                  <th style= "font-size: 15px" class="text-left" colspan = "2">{{ countPallet }}</th>
                  <th style= "font-size: 15px" class="text-left" colspan = "1">TTMT</th>
                  <th style= "font-size: 15px" class="text-left" colspan = "1">FSC 100%</th>
                  <th style= "font-size: 15px" class="text-left" colspan = "1">Khối lượng</th>
                  <th style= "font-size: 15px" class="text-left" colspan = "1">{{Khoiluong ? Khoiluong.toLocaleString("en-US",
                 {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  }) : 0}} m3 </th>
                </tr>
              </thead>

              <tr style="font-weight: 800; padding-left: 10px;height: 45px;">
                 <th style="width: 7%;" class="header-table text-blue" >Mã lô gỗ nhập</th>
                 <th style="width: 7%;" class="header-table text-blue">Mã Pallet</th>
                 <th style="width: 7%;" class="header-table text-blue">Dài</th>
                 <th style="width: 7%;" class="header-table text-blue">Rộng</th>
                 <th style="width: 7%;" class="header-table text-blue">Dày</th>
                 <th style="width: 33%;" class="header-table text-blue" colspan = "2">Số Lượng</th>
                 <th style="width: 33%;" class="header-table text-blue">Khối Lượng</th>
                 </tr>

        <tr v-for="struc in dataSource" v-bind:key="struc.ID" style="width: 100%">
          <td style="font-weight: 800; padding-left: 10px;height: 45px;">
            {{ struc.PARCEL }}
          </td>
          <td style="font-weight: 800; padding-left: 10px;height: 45px;">
            {{ struc.CODE }}
          </td>
           <td style="font-weight: 800; padding-left: 10px;height: 45px;">
            {{ struc.LENGTH }}
          </td>
           <td style="font-weight: 800; padding-left: 10px;height: 45px;">
            {{ struc.WIDTH }}
          </td>
           <td style="font-weight: 800; padding-left: 10px;height: 45px;">
            {{ struc.HEIGHT }}
          </td>
           <td style="font-weight: 800; padding-left: 10px;height: 45px;" colspan = "2">
            {{ struc.QUANTITY }}
          </td>
           <td style="font-weight: 800; padding-left: 10px;height: 45px;">
            {{ struc.khoiLuong ? struc.khoiLuong.toLocaleString("en-US",
                 {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  }) : 0 }}
          </td>


        </tr>

            </table>
          </div>
        </div>
        <!-- <div class="col-12">
          <DxDataGrid
            :allow-column-reordering="true"
            :data-source="dataSource"
            :show-row-lines="true"
            :show-column-lines="true"
            :show-borders="true"
            :word-wrap-enabled="true"
            :no-data-text="'Không có dữ liệu !'"
          >
            <DxPaging :page-size="countPallet*2"/>
            <DxColumn
              data-field="PARCEL"
              caption="Mã lô gỗ nhập"

              :width="150"
            />
            <DxColumn
              data-field="CODE"
              caption="Mã pallet"
              :width="150"
            />
            <DxColumn
              data-field="LENGTH"
              :width="70"
              alignment="center"
              caption="Dài"
            />
            <DxColumn
              data-field="WIDTH"
              :width="70"
              alignment="center"
              caption="Rộng"
            />
            <DxColumn
              data-field="HEIGHT"
              :width="70"
              alignment="center"
              caption="Dày"
            />

            <DxColumn
              data-field="QUANTITY"
              format="#,##0.##"
              caption="Số lượng"
            />
            <DxColumn
              data-field="khoiLuong"
              format="#0.####"
              caption="Khối lượng"
            />
            <DxSummary>
              <DxGroupItem
                column="khoiLuong"
                summary-type="sum"
                data-type="number"
                :show-in-group-footer="false"
                :align-by-column="true"
                :display-format="'{0}'"
                :value-format="'#,##0.####'"
              />
              <DxGroupItem
                column="QUANTITY"
                summary-type="sum"
                data-type="number"
                :show-in-group-footer="false"
                :align-by-column="true"
                :display-format="'{0}'"
                :value-format="'#,##0.##'"
              />
              <DxTotalItem
                column="QUANTITY"
                summary-type="sum"
                :value-format="'#,##0.##'"
                :display-format="'{0}'"
              />
              <DxTotalItem
                column="khoiLuong"
                summary-type="sum"
                :value-format="'#,##0.####'"
                :display-format="'{0}'"
              />
              <DxTotalItem column="CODE" :display-format="'Tổng:'" />
            </DxSummary>
          </DxDataGrid>
        </div> -->
      </div>
      </div>
    </q-card>
    </div>
  </q-page>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxSummary,
  DxGroupItem,
  DxTotalItem,
  DxPaging,
  DxPager,
} from "devextreme-vue/data-grid";
import XLSX from "xlsx";
import { getFisrtDayOfMonth, formatDateVN } from "../../../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSummary,
    DxGroupItem,
    DxPaging,
    DxTotalItem,
    DxPager,
  },
  data() {
    return {
      nhaMay: "",
      kilnName: "",
      ngay:null,
      dataSource: [],
      kiln: null,
      dataKiln: [],
      Khoiluong:0,
      countPallet: 0,
      factory: null,
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          nhaMay: "Thuận Hưng",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1A",
          factoryId: 100003,
          nhaMay: "Yên Sơn 1A",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 100005,
          nhaMay: "Thái Bình",
        },
      ],
    };
  },
  created() {},
  methods: {
    all(){
      return this.dataSource.length;
    },
    async onChange() {
      this.nhaMay = this.factory.nhaMay;
      this.loadKiln();
    },
    onChangeKiln() {
      this.kilnName = this.kiln.name;
      this.dataSource = [];
      this.load();
    },
    async loadKiln() {
      const data = await this.$store.dispatch(
        "prod/GET_KILN_BY_FACTORYID",
        this.factory.factoryId
      );
      this.dataKiln = [];
      data.data.forEach((element) => {
        this.dataKiln.push({
          value: element.ID,
          label: element.NAME + ' - '+element.TYPE,
          name: element.NAME,
        });
      });
    },
    async load() {
      this.Khoiluong = 0
      const data = await this.$store.dispatch(
        "prod/GET_BIEN_BAN_LO_SAY",
        this.kiln.value
      );
      this.dataSource = data.data;
      console.log("data : ", this.dataSource);
      this.countPallet = this.dataSource.length;
     this.dataSource.forEach(el => this.Khoiluong += el.khoiLuong)
      this.ngay = this.dataSource[0].CREATE_DATE
    },
     async html_table_to_excel(type) {
      var data = document.getElementById("table-custom");

      var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });

      XLSX.write(file, { bookType: type, bookSST: true, type: "base64" });

      XLSX.writeFile(
        file,
        `BCVL_${this.factory.label}.` + type
      );
    },
    xuat() {
      this.html_table_to_excel("xlsx");
    },
  },
};
</script>

<style>
/* #table-bb-lo-say.table,
#table-bb-lo-say.tr,
#table-bb-lo-say.td,
#table-bb-lo-say.th {
  border: 3px solid black;
} */
.mau {
    border: 1px solid !important;
  color: black;
  background-color: white;
  font-weight: 500;
  font-size: 32px;
}
.header-table{
  background-color: #daf8e1;
}
</style>
