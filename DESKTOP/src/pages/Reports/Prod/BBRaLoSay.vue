<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row print-hide" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Biên bản lịch sử vào lò
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
      <div class="row print-hide" style="padding: 5px 0 5px 0; background-color: #daf8e1">
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
                  <th style="font-size: 14px" colspan="3" class="text-center">
                    DANH MỤC THEO DÕI GỖ SẤY TRONG LÒ
                  </th>
                </tr>
                <tr>
                  <td>Ngày vào lò</td>
                  <td>{{ ngayKiem }}</td>
                  <td>Địa điểm sấy gỗ</td>
                  <th>{{ nhaMay }}</th>
                </tr>
                <tr>
                  <td>Lò số</td>
                  <td>{{ kilnName }}</td>
                  <td>loại gỗ sấy</td>
                  <td>Acacia</td>
                </tr>
                <tr>
                  <td>Tổng số PL</td>
                  <td>{{ countPallet }}</td>
                  <td>TTMT</td>
                  <td>FSC 100%</td>
                </tr>
              </thead>
            </table>
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
            css-class="mauBBRLS"
            :width="150"
          />
          <DxColumn
            data-field="CODE"
            caption="Mã pallet"
            css-class="mauBBRLS"
            :width="150"
          />
          <DxColumn
            data-field="LENGTH"
            :width="70"
            alignment="center"
            caption="Dài"
            css-class="mauBBRLS"
          />
          <DxColumn
            data-field="WIDTH"
            :width="70"
            alignment="center"
            caption="Rộng"
            css-class="mauBBRLS"
          />
          <DxColumn
            data-field="HEIGHT"
            :width="70"
            alignment="center"
            caption="Dày"
            css-class="mauBBRLS"
          />

          <DxColumn
            data-field="QUANTITY"
            format="#,##0.##"
            caption="Số lượng"
            css-class="mauBBRLS"
          />
          <DxColumn
            data-field="khoiLuong"
            format="#0.####"
            caption="Khối lượng"
            css-class="mauBBRLS"
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
            <div class="col-6"></div>
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
import {
  DxDataGrid,
  DxColumn,
  DxSummary,
  DxGroupItem,
  DxTotalItem,
  DxPaging
} from "devextreme-vue/data-grid";
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
    DxSummary,
    DxGroupItem,
    DxTotalItem,
    DxPaging
  },
  data() {
    return {
      dataSource: [],
      createId: null,
      createName: null,
      ngayKiem: null,
      nhaMay: null,
      kilnName: null,
      countPallet: null,
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
        this.nhaMay = this.factory.label;
        this.reset();
      this.loadKiln();
    },
    onChangeKiln() {
      this.kilnName = this.kiln.name;
      this.reset();
      this.loadDateInKiln();
    },
    reset(){
      this.dataSource = [];
      this.createId = null;
      this.createName = null;
      this.countPallet = 0;
    },
    async loadKiln() {
      const data = await this.$store.dispatch(
        "prod/GET_KILN_BY_FACTORYID_HISTORY",
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
      if (this.kiln != null) {
        const payload = {
          from: moment(this.fromDate).format("YYYY-MM-DD 00:00"),
          to: moment(this.toDate).format("YYYY-MM-DD 23:59"),
          kilnId: this.kiln.value,
        };
        const data = await this.$store.dispatch(
          "prod/GET_DATE_IN_KILN",
          payload
        );
        this.createDates = [];
        data.data.forEach((element) => {
          this.createDates.push({
            value: element.CREATE_DATE,
            label: element.CREATE_DATE,
          });
        });
      }
    },
    onChangeCreateDate() {
        this.ngayKiem = moment(this.createDate.value).format("DD/MM/YYYY");
      this.loadBBKiemTraLoSay();
    },
    async loadBBKiemTraLoSay() {
      const payload = {
        kilnId: this.kiln.value,
        from: moment(this.createDate.value).format("YYYY-MM-DD 00:00"),
        to: moment(this.createDate.value).format("YYYY-MM-DD 23:59"),
      };
      const data = await this.$store.dispatch("prod/GET_BB_RA_LO_SAY", payload);
      this.dataSource = data.data;
      this.createId = data.data[0].CREATE_BY;
      this.createName = data.data[0].LAST_NAME;
        this.countPallet = this.dataSource.length;
    },
  },
};
</script>

<style>
.mauBBRLS {
    border: 1px solid !important;
  color: black;
  background-color: white;
  font-weight: 500;
  font-size: 32px;
}
</style>