<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row print-hide" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Biên bản kiểm tra độ ẩm sấy gỗ
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
                Quy trình kiểm soát quá trình đặc biệt
              </td>
              <td width="240px" rowspan="5">
                Mã số: QT-03/HD-06/BM-01 <br />
                Ngày BH: 22/06/2020 <br />
                Lần BH: 04
              </td>
            </tr>
            <tr>
              <th style="font-size: 16px" colspan="3" class="text-center">
                BIỂU MẪU KIỂM TRA ĐỘ ẨM GỖ SẤY
              </th>
            </tr>
          </thead>
        </table>
        <div class="row">
          <div class="col-6">Ngày kiểm tra: {{ ngayKiem }}</div>
          <div class="col-6">Địa điểm: {{ loSo }}</div>
        </div>
        <div class="row">
          <div class="col-6">Đơn vị quản lý: {{ factoryName }}</div>
          <div class="col-6">Mẻ sấy số : {{ linkId }}</div>
        </div>
        <div class="row">
          <div class="col-6">Tổng số lượng mẫu : {{ sum }}</div>
          <div class="col-6">Loại sản phẩm: {{ type }}</div>
        </div>
        <div class="row">
          <div class="col-3" style="padding:10px">
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
                caption="STT"
                :width="50"
                alignment="center"
              />
              <DxColumn
                data-field="doAm"
                alignment="center"
                caption="Độ ẩm(MC)%"
              />
            </DxDataGrid>
          </div>
          <div class="col-3" style="padding:10px">
            <DxDataGrid
              :allow-column-reordering="true"
              :data-source="dataSource2"
              :show-row-lines="true"
              :show-column-lines="true"
              :show-borders="true"
              :word-wrap-enabled="true"
              :no-data-text="'Không có dữ liệu !'"
            >
              <DxColumn
                data-field="id"
                caption="STT"
                :width="50"
                alignment="center"
              />
              <DxColumn
                data-field="doAm"
                alignment="center"
                caption="Độ ẩm(MC)%"
              />
            </DxDataGrid>
          </div>
          <div class="col-3" style="padding:10px">
            <DxDataGrid
              :allow-column-reordering="true"
              :data-source="dataSource3"
              :show-row-lines="true"
              :show-column-lines="true"
              :show-borders="true"
              :word-wrap-enabled="true"
              :no-data-text="'Không có dữ liệu !'"
            >
              <DxColumn
                data-field="id"
                caption="STT"
                :width="50"
                alignment="center"
              />
              <DxColumn
                data-field="doAm"
                alignment="center"
                caption="Độ ẩm(MC)%"
              />
            </DxDataGrid>
          </div>
          <div class="col-3" style="padding:10px">
            <DxDataGrid
              :allow-column-reordering="true"
              :data-source="dataSource4"
              :show-row-lines="true"
              :show-column-lines="true"
              :show-borders="true"
              :word-wrap-enabled="true"
              :no-data-text="'Không có dữ liệu !'"
            >
              <DxColumn
                data-field="id"
                caption="STT"
                :width="50"
                alignment="center"
              />
              <DxColumn
                data-field="doAm"
                alignment="center"
                caption="Độ ẩm(MC)%"
              />
            </DxDataGrid>
          </div>
        </div>
        <div v-if="type != null" class="row">
          <div class="col-12" style="font-weight: bold; font-size: 16px">
            Phân bố độ ẩm:
          </div>
          <div class="col-12">
            <table style="width: 50%">
              <tr>
                <th>Độ ẩm(MC%)</th>
                <th>SL Mẫu</th>
                <th>Tỷ lệ</th>
              </tr>
              <tr>
                <td style="text-align: center">
                  Thấp (nhỏ hơn {{ cacmoc[0] }})
                </td>
                <td style="text-align: center">{{ thap }}</td>
                <td v-if="mc.length == 0" style="text-align: center">-</td>
                <td v-else style="text-align: center">
                  {{ ((thap / mc.length) * 100).toFixed(2) }} %
                </td>
              </tr>
              <tr class="bg-amber-2">
                <td style="text-align: center">
                  <strong>Đích ({{ cacmoc[0] }}-{{ cacmoc[1] - 1 }})</strong>
                </td>
                <td style="text-align: center">{{ dich }}</td>
                <td v-if="mc.length == 0" style="text-align: center">-</td>
                <td v-else style="text-align: center">
                  {{ ((dich / mc.length) * 100).toFixed(2) }} %
                </td>
              </tr>
              <tr style="background-color: yellow">
                <td style="text-align: center">
                  Cao({{ cacmoc[1] }}-{{ cacmoc[2] - 1 }})
                </td>
                <td style="text-align: center">{{ cao }}</td>
                <td v-if="mc.length == 0" style="text-align: center">-</td>
                <td v-else style="text-align: center">
                  {{ ((cao / mc.length) * 100).toFixed(2) }} %
                </td>
              </tr>
              <tr style="background-color: red">
                <td style="text-align: center">
                  Rất cao({{ cacmoc[2] }} trở lên)
                </td>
                <td style="text-align: center">{{ ratcao }}</td>
                <td v-if="mc.length == 0" style="text-align: center">-</td>
                <td v-else style="text-align: center">
                  {{ ((ratcao / mc.length) * 100).toFixed(2) }} %
                </td>
              </tr>
            </table>
          </div>
          <div class="col-12">
            <p v-if="type === 'INDOOR'" class="text-orange">{{ ghiChuInDoor }}</p>
            <p v-if="type === 'OUTDOOR'" class="text-orange">{{ ghiChuOutDoor }}</p>
            <p v-if="type === 'SẤY UỐN'" class="text-orange">{{ ghiChuUon }}</p>
          </div>

          <div class="col-12">Kết luận:</div>
          <div class="col-12">
            <div class="row">
              <div class="col-2">
                <q-checkbox left-label v-model="raLo" disable label="Ra lò" />
                <q-checkbox
                  left-label
                  v-model="sayTiep"
                  disable
                  label="Sấy tiếp"
                />
              </div>
              <div class="col-10">
                <q-input
                  readonly
                  v-model="cachKhac"
                  style="width: 200px"
                  label="Cách khác"
                />
              </div>
            </div>
          </div>
        </div>

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
      dataSource2: [],
      dataSource3: [],
      dataSource4: [],
      ghiChuInDoor:"Ghi chú: INDOOR: MC<10% chiếm tỉ lệ ≥85%, OUTDOOR: MC<14% chiếm tỉ lệ ≥85% thì cho ra lò.",
      ghiChuOutDoor:"Ghi chú: INDOOR: MC<10% chiếm tỉ lệ ≥85%, OUTDOOR: MC<14% chiếm tỉ lệ ≥85% thì cho ra lò.",
      ghiChuUon:"Ghi chú: Uốn: MC<25% chiếm tỉ lệ ≥90% thì cho ra lò.",
      createId: null,
      cacmoc: [],
      mc: [],
      thap: 0,
      dich: 0,
      cao: 0,
      ratcao: 0,
      createName: null,
      raLo: false,
      sayTiep: false,
      cachKhac: null,
      loSo: null,
      ngayKiem: null,
      factoryName: null,
      linkId: null,
      sum: null,
      type: null,
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
      this.dataSource2 = [];
      this.dataSource3 = [];
      this.dataSource4 = [];
      this.ngayKiem = null;
      this.factoryName = null;
      this.createId = null;
      this.createName = null;
      this.linkId = null;
      this.sum = null;
      this.mc = [];
      this.thap = 0;
      this.dich = 0;
      this.cao = 0;
      this.ratcao = 0;
      this.cachKhac = null;
      this.type = null;
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
        "prod/GET_DATE_BY_KILN_ID_DO_AM",
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
        "prod/GET_BB_KIEM_TRA_DO_AM",
        kilnBatchId
      );
      this.dataSource = [];
      this.dataSource2 = [];
      this.dataSource3 = [];
      this.dataSource4 = [];
      this.ngayKiem = moment(data.data[0].CREATE_DATE).format("DD/MM/YYYY");
      this.factoryName = this.factory.label;
      this.createId = data.data[0].ID;
      this.createName = data.data[0].LAST_NAME;
      let result2 = JSON.parse(data.data[0].DATA);
      console.log("result", result2);
      this.linkId = result2.linkId;
      this.sum = result2.mc.length;
      this.mc = result2.mc;
      this.thap = result2.alloc.quantity.thap;
      this.dich = result2.alloc.quantity.dich;
      this.cao = result2.alloc.quantity.cao;
      this.ratcao = result2.alloc.quantity.ratcao;
      this.cachKhac = result2.result.note;
      if (result2.result.type === "ralo") {
        this.raLo = true;
      }
      if (result2.result.type === "saytiep") {
        this.sayTiep = true;
      }
      this.type = data.data[0].TYPE;
      if (this.type === 'INDOOR') {
        this.cacmoc = [7, 10, 15];
      }
      
      if(this.type === 'OUTDOOR'){
        this.cacmoc = [8, 14, 17];
      }
      if(this.type === 'SẤY UỐN'){
        this.cacmoc = [15, 25, 30];
      }
      
      for (let i = 0; i < result2.mc.length; i++) {
        if (i < 14) {
          this.dataSource.push({
            id: i + 1,
            doAm: result2.mc[i],
          });
        } else if (i < 28) {
          this.dataSource2.push({
            id: i + 1,
            doAm: result2.mc[i],
          });
        } else if(i < 42) {
          this.dataSource3.push({
            id: i + 1,
            doAm: result2.mc[i],
          });
        } else{
            this.dataSource4.push({
            id: i + 1,
            doAm: result2.mc[i],
          });
        }
      }
      console.log("dataSource", this.dataSource);
    },
  },
};
</script>

<style>
</style>