<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary print-hide">
      <div class="row">
        <div class="col-12 top-title text-orange">
          Biên bản xuất gỗ theo ngày
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
            label="Chọn lệnh sản xuất + BP nhận"
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
            <th style="font-size: 18px">
              BIÊN BẢN GIAO NHẬN KIỂM PHIẾU XUẤT KHO
            </th>
          </tr>
        </thead>
      </table>
      <div class="row">
        <div class="col-6">Loại gỗ: Acacia (Keo)</div>
        <div class="col-6">Số phiếu:{{ sophieu }} </div>
      </div>
      <div class="row">
        <div class="col-6">Xuất tại kho: Say sấy - {{NM}}</div>
        <div class="col-6">Tuần : {{ week }}</div>
      </div>
      <div class="row">
        <div class="col-6">Lý do xuất: Theo PCĐ gỗ làm hàng indoor</div>
        <div class="col-6">BP nhận: {{ destination }}</div>
      </div>
      <DxDataGrid
        :data-source="dataSource"
        :show-borders="true"
        :word-wrap-enabled="true"
        :show-row-lines="true"
        :show-column-lines="true"
        :no-data-text="'Không có dữ liệu'"
      >
        <DxExport :enabled="true" :allow-export-selected-data="true" />
        <DxScrolling mode="infinite" />
        <DxColumn data-field="makt" caption="Mã kế toán" width="100" />
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
          data-field="luadat"
          caption="Lựa"
          data-type="number"
          alignment="center"
          width="80"
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
        />
           <DxColumn
          data-field="GHICHU"
          caption="Ghi chú"
         
          width="350"
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
        <div class="col-6 text-center">{{diadiem}}, Ngày {{ day }} tháng {{month}} năm {{ year }}</div>
      </div>
      <div class="row">
          <div class="col-6 text-center">
              Xưởng SX
          </div>
          <div class="col-6 text-center">
              Thủ kho
          </div>
      </div>
    </q-card-section>
  </q-page>
</template>

<script>
import moment from "moment";
import { mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxScrolling,
  DxSummary,
  DxTotalItem,
  DxExport,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSummary,
    DxScrolling,
    DxTotalItem,
    DxExport,
  },
  data() {
    return {
      date: new Date(),
      dataSource: [],
      week: 0,
      NM:"",
      diadiem:"",
      factoryId: null,
      destination: "",
      sophieu:"",
      number: null,
      numbers: [],
      day: 0,
      month: 0,
      year: 199,
    };
  },
  methods: {
    ...mapActions("nlg", [
      "GET_LSX_XUAT_GO_THEO_NGAY",
      "VIEW_XUAT_GO_THEO_NGAY",
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
      let data = await this.GET_LSX_XUAT_GO_THEO_NGAY(payload);
      this.numbers = [];
      data.data.forEach((e) => {
        this.numbers.push({
          label: e.number + "|" + e.DESTINATION_NAME,
          number: e.number,
          destinationId: e.ID,
          factoryId: e.factoryId
        });
      });
     
    },
    async onchangeNumber() {
      this.xuong = ''
      if (this.number.factoryId == 100000) { this.NM = 'NM Thuận Hưng'; this.diadiem = 'Hà Nội' }
          if (this.number.factoryId == 100003) { this.NM = 'NM Yên Sơn 1A'; this.diadiem = 'Tuyên Quang' }
           if (this.number.factoryId == 100004)  {this.NM = 'NM Yên Sơn 1B'; this.diadiem = 'Tuyên Quang' }
       if (this.number.factoryId == 100005) { this.NM = 'NM Thái Bình'; this.diadiem = 'Tuyên Quang' }
      const payload = {
        fromDate: this.date + " 00:00",
        toDate: this.date + " 23:59",
        number: this.number.number,
        destinationId: this.number.destinationId,
      };
      let data = await this.VIEW_XUAT_GO_THEO_NGAY(payload);
      this.week = data.data[0].week;
      
      this.destination = data.data[0].DESTINATION_NAME;
      if (data.data[0].DESTINATION_NAME == '1.Lựa phôi - X3 (TH)')
      this.xuong = 'X3'
     if (data.data[0].DESTINATION_NAME == '1.Lựa phôi - X1 (TH)')
      this.xuong = 'X1'
      if (data.data[0].DESTINATION_NAME == 'NM CBG Yên Sơn 1A' || data.data[0].DESTINATION_NAME == 'NM CBG Thái Bình')
      this.xuong = 'YS'
      if (data.data[0].DESTINATION_NAME == 'NM CBG Quang Minh')
      this.xuong = 'QM'
      this.sophieu = data.data[0].number + '-' + this.xuong + '-' + this.date
      this.dataSource = data.data;
    },
  },
};
</script>