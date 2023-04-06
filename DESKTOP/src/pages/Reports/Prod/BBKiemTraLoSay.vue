<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row print-hide" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Biên bản kiểm tra lò sấy
        </div>

         <div
          class="col-6 cursor-pointer text-blue text-bold"
          style="font-size: 18px"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
          <span class="text-amber-14">{{ denNgay }}</span>
        </div>
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
      <div class="row" style="padding: 5px 0 5px 0; background-color: #daf8e1">
          <div class="col-12">
            <div class="row">
               <span class="text-blue" style="margin-right: 30px">Chọn ngày tạo biên bản:</span> 
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in createDates"
                :key="index"
              >
                <q-radio
                  dense
                  @input="onChangeCreateDate"
                  v-model="createDate"
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

      <!-- <q-card-section>
        <div class="row">
          <div class="col-2">
            <q-select
              outlined
              v-model="factory"
              :options="options"
              label="Chọn nhà máy"
              @input="onChange"
            />
          </div>
          <div class="col-2">
            <q-select
              outlined
              v-model="kiln"
              :options="dataKiln"
              label="Chọn lò sấy"
              @input="onChangeKiln"
            />
          </div>
          <div class="col-2">
            <q-select
              outlined
              v-model="createDate"
              :options="createDates"
              label="Chọn ngày tạo biên bản"
              @input="onChangeCreateDate"
            />
          </div>
        </div>
      </q-card-section> -->
      <q-card-section>
        <table
          class="table-custom"
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
              <td style="font-size: 18px" colspan="3" class="text-center">
                Quy trình sấy gỗ
              </td>
              <td width="240px" rowspan="5">
                Mã số: QT-14/BM-02 <br />
                Ngày BH: 19/08/2020 <br />
                Lần BH: 04
              </td>
            </tr>
            <tr>
              <th style="font-size: 16px" colspan="3" class="text-center">
                BIÊN BẢN KIỂM TRA LÒ SẤY
              </th>
            </tr>
          </thead>
        </table>
        <div class="row">
          <div class="col-6">Lò số : {{ loSo }}</div>
          <div class="col-6">Ngày kiểm: {{ ngayKiem }}</div>
        </div>
        <DxDataGrid
          :allow-column-reordering="true"
          :data-source="dataSource"
          :show-row-lines="true"
          :show-column-lines="true"
          :show-borders="true"
          :word-wrap-enabled="true"
          :no-data-text="'Không có dữ liệu !'"
        >
          <DxColumn
            data-field="id"
            caption="TT"
            :width="50"
            alignment="center"
          />
          <DxColumn data-field="checkName" caption="DANH MỤC KIỂM TRA" />
          <DxColumn data-field="require" caption="YÊU CẦU" :width="480" />
          <DxColumn
            data-field="tinhTrang"
            caption="TÌNH TRẠNG"
            cell-template="cellTemplate"
          />
          <template #cellTemplate="cell">
            <span v-html="cell.data.value"></span>
          </template>
          <DxColumn data-field="status" caption="ĐÁNH GIÁ" />
          <DxColumn caption="GHI CHÚ" />
        </DxDataGrid>
        <div style="background-color: white">
          <div class="row">
            <div class="col-6 text-center"></div>
            <div class="col-6 text-center"><b>Người tạo phiếu</b></div>
          </div>
          <div class="row">
            <div class="col-6"></div>
            <div
              v-if="createId"
              class="col-6 text-center"
              style="height: 100px"
            >
              <img
                alt="Không có chữ kí số"
                width="auto"
                height="50"
                v-bind:src="'/statics/' + createId + '.png'"
              />
            </div>
          </div>
          <div class="row">
          <div class="col-6">
          </div>
          <div v-if="createId" class="col-6 text-center">
            {{ createName }}
          </div>
        </div>
        </div>
      </q-card-section>
      </div>
    </q-card>
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
  </q-page>
</template>

<script>
import moment from "moment";
import { DxDataGrid, DxColumn } from "devextreme-vue/data-grid";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DialogSelectDate,
  },
  data() {
    return {
      dataSource: [],
      createId: null,
      createName: null,
      loSo: null,
      ngayKiem: null,
      fromDate: null,
      toDate: null,
      showChooseDate: false,
      kiln: null,
      dataKiln: null,
      createDate: null,
      createDates: [],
      factory: null,
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1A",
          factoryId: 100003,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 100005,
        },
      ],
    };
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
  },
  methods: {
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadDateInKiln();
      this.createDate = null;
    },
    async onChange() {
      this.loadKiln();
      this.reset();
    },
    reset(){
      this.dataSource = [];
      this.ngayKiem = null;
      this.createId = null;
      this.createName = null;
    },
    onChangeKiln() {
      this.loSo = this.kiln.name;
      this.reset();
      this.loadDateInKiln();
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
          label: element.NAME,
          name: element.NAME,
        });
      });
    },
    async loadDateInKiln() {
      const payload = {
        from: moment(this.fromDate).format("YYYY-MM-DD 00:00"),
        to: moment(this.toDate).format("YYYY-MM-DD 23:59"),
        kilnId: this.kiln.value,
      };
      const data = await this.$store.dispatch(
        "prod/GET_DATE_BY_KILN_ID",
        payload
      );
      this.createDates = [];
      data.data.forEach((element) => {
        this.createDates.push({
          value: element.ID,
          label: element.createdDate,
        });
      });
    },
    onChangeCreateDate() {
      this.loadBBKiemTraLoSay();
    },
    async loadBBKiemTraLoSay() {
      const kilnBatchId = this.createDate.value;
      const data = await this.$store.dispatch(
        "prod/GET_BB_KIEM_TRA_LO_SAY",
        kilnBatchId
      );
      this.dataSource = [];
      console.log("data", data.data);
      this.ngayKiem = moment(data.data[0].CREATE_DATE).format("DD/MM/YYYY");
      this.createId = data.data[0].ID;
      this.createName = data.data[0].LAST_NAME;
      let result = JSON.parse(data.data[0].DATA);
      let result2 = JSON.parse(result.data);
      this.dataSource = result2;
      console.log("dataSource", this.dataSource);
    },
  },
};
</script>

<style>
</style>