<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary print-hide">
      <div class="row">
        <div class="col-12 top-title text-orange">
          In lệnh Bào và Lựa
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row print-hide">
        <div class="col-3 q-pa-sm">
          <q-input filled v-model="date" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date">
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        @click="showXuatGoTheoNgay"
                        label="Close"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-3 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="number"
            :options="numbers"
            label="Chọn mã phiếu"
            @input="onchangeNumber"
          />
        </div>
      </div>
      <table border="1" style="width: 100%; border-collapse: collapse">
        <thead class="w-100">
          <tr>
            <th rowspan="2" style="width: 100px">
              <img src="~assets/logo.png" style="width: auto; height: 100px" />
            </th>
            <th style="font-size: 16px">SỔ TAY COC</th>
            <td rowspan="2" style="width: 200px">
              MB-COC-32 <br />
              Ngày ban hành: 29/9/2016 <br />
              Lần ban hành: 01
            </td>
          </tr>
          <tr>
            <th style="font-size: 18px">KẾ HOẠCH GỖ BÀO 2M</th>
          </tr>
        </thead>
      </table>

      <DxDataGrid
        :data-source="dataSource"
        :show-borders="true"
        :word-wrap-enabled="true"
        :show-row-lines="true"
        :show-column-lines="true"
        @row-removed="del"
      
        :no-data-text="'Không có dữ liệu'"
      >
       <DxEditing 
        
        :allow-deleting="true" mode="popup" />
        <DxExport :enabled="true" :allow-export-selected-data="true" />
        <DxScrolling mode="infinite" />
        <DxColumn data-field="NAME" caption="Tên chi tiết" width="300" />
        <DxColumn caption="Kích thước" alignment="center">
          <DxColumn
            caption="Dầy"
            data-field="DAY"
            format="fixedPoint"
            alignment="center"
            width="70"
          />
          <DxColumn
            caption="Rộng"
            data-field="RONG"
            format="fixedPoint"
            alignment="center"
            width="70"
          />
          <DxColumn
            caption="Dài"
            data-field="DAI"
            format="fixedPoint"
            alignment="center"
            width="70"
          />
        </DxColumn>
        <DxColumn
          data-field="unit"
          caption="ĐVT"
          data-type="number"
          width="50"
        />

        <DxColumn
          data-field="SL_TH"
          caption="Số lượng"
          data-type="number"
          format="#,##0"
          width="100"
        />
        <DxColumn
          data-field="KLC_TH"
          caption="Khối lượng"
          data-type="number"
          format="#,##0.####"
          width="100"
          :calculate-cell-value="calculatekl"
        />
        <DxSummary>
          <DxTotalItem
            column="NAME"
            value-format="fixedpoint"
            display-format="Tổng cộng : "
          />
          <DxTotalItem
            column="KLC_TH"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'decimal'"
          />
        </DxSummary>
      </DxDataGrid>
      <div class="row">
        <div class="col-6"></div>
        <div class="col-6 text-center">
          Tuyên Quang,Ngày {{ day }} tháng {{ month }} năm {{ year }}
        </div>
      </div>
      <div class="row">
        <div class="col-6 text-center">Xưởng SX</div>
        <div class="col-6 text-center">Thủ kho</div>
      </div>
    </q-card-section>
  </q-page>
</template>

<script>
import moment from "moment";
import { mapActions } from "vuex";
import { formatDateVN, roundNumber } from "../../../ultils";
import {
  DxDataGrid,
  DxColumn,
  DxScrolling,
  DxEditing,
  DxSummary,
  DxTotalItem,
  DxExport,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSummary,
    DxEditing,
    DxScrolling,
    DxTotalItem,
    DxExport,
  },
  data() {
    return {
      date: new Date(),
      dataSource: [],
      week: 0,
      destination: "",
      sophieu: "",
      number: null,
      numbers: [],
      day: 0,
      month: 0,
      year: 199,
    };
  },
  methods: {
    ...mapActions("nlg", [
      "GET_LX_XUAT_GO_THEO_NGAY_2M",
      "VIEW_XUAT_GO_THEO_NGAY_2M",
    ]),
    async showXuatGoTheoNgay() {
      let check = moment(this.date, "YYYY/MM/DD");
      this.day = check.format("D");
      this.month = check.format("M");
      this.year = check.format("YYYY");
      this.dataSource = [];
      this.number = null;
      this.week = 0;
      this.destination = "";
      const payload = {
        fromDate: this.date + " 00:00",
        toDate: this.date + " 23:59",
      };
      let data = await this.GET_LX_XUAT_GO_THEO_NGAY_2M(payload);
      this.numbers = [];
      data.data.forEach((e) => {
        this.numbers.push({
          label: e.number + "|",
          number: e.number,
        });
      });
    },
     async del(e) {
              console.log('ID:',e.data.ID)
      const payload = {
        id: e.data.ID

        
      };
      const data3 = await this.$store.dispatch("nlg/XOA_CHI_TIET_PB2M", payload);
      if (data.meta.success) {
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
    calculatekl(e) {
      if (e.DAI > 0)
        e.KLC_TH = roundNumber(
          (e.SL_TH * e.DAY * e.DAI * e.RONG) / 1000000000,
          4
        );
      else e.KLC_TH = e.SL_TH;
      return e.KLC_TH;
    },
    async onchangeNumber() {
      this.xuong = "";
      const payload = {
        fromDate: this.date + " 00:00",
        toDate: this.date + " 23:59",
        number: this.number.number,
      };
      let data = await this.VIEW_XUAT_GO_THEO_NGAY_2M(payload);
      this.week = data.data[0].week;

      //   this.destination = data.data[0].DESTINATION_NAME;
      //   if (data.data[0].DESTINATION_NAME == '1.Lựa phôi - X3 (TH)')
      //   this.xuong = 'X3'
      //  if (data.data[0].DESTINATION_NAME == '1.Lựa phôi - X1 (TH)')
      //   this.xuong = 'X1'
      //   if (data.data[0].DESTINATION_NAME == 'NM CBG Yên Sơn 1A' || data.data[0].DESTINATION_NAME == 'NM CBG Thái Bình')
      //   this.xuong = 'YS'
      //   if (data.data[0].DESTINATION_NAME == 'NM CBG Quang Minh')
      //   this.xuong = 'QM'
      this.sophieu = data.data[0].number + this.date;
      this.dataSource = data.data;
    },
  },
};
</script>