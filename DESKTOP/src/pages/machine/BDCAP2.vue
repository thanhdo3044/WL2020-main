<template>
  <q-page class="q-pa-sm">
    <div class="row" style="background-color: #daf8e1">
      <div class="col-6 text-blue text-bold" style="font-size: 18px">
        Báo cáo bảo dưỡng máy cấp 2
      </div>
      <!-- <div class="col-5 text-blue text-bold" align="right">
        <span style="font-size: 18px">Năm: </span>
        <input
          class="text-amber-14"
          type="number"
          @input="load"
          v-model="year"
          style="
            border: none;
            background-color: #daf8e1;
            font-size: 18px;
            width: 60px;
          "
        />
      </div> -->
        <div class="col-6 text-blue text-bold" align="right">
        <span style="font-size: 18px">Năm: </span>
        <input
          class="text-amber-14"
          type="number"
          @input="load"
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
    <q-card>
      <div class="q-pa-md" style="max-width: 1300px">
        <div class="col-8">
          <div class="row">
            <div
              class="col-2 col-md-2"
              v-for="(congDoan, index) in options"
              :key="index"
            >
              <q-radio
                dense
                @input="load"
                v-model="idDepartment"
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
      <DxDataGrid
      id="BCCAP2"
        :data-source="dataSource"
        :word-wrap-enabled="true"
        :no-data-text="'Không có dữ liệu !'"
        :show-column-lines="true"
        :show-row-lines="true"
        :show-borders="true"
      >
        <DxExport :enabled="true" :allow-export-selected-data="true" />
          <DxGroupPanel
            :visible="true"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
            <DxScrolling mode="infinite" />
              <DxSearchPanel
            :visible="true"
            :placeholder="'Tìm kiếm'"
            :width="400"
          />
        <DxColumn
          data-field="mamayten"
          caption=""
          :width="150"
          group-index="0"
          group-cell-template="groupmamay"
        />
          <template #groupmamay="{ data }">
                <div style="font-weight: bold;font-size:16px;color:#2196F3">
                  {{ data.value.substring(0) }}
                </div>
              </template>
        <DxColumn
          data-field="MUC_KIEM_TRA"
          caption="Mục kiểm tra"
          :width="280"
          cssClass="kiemtramay"
        />
           
      <DxColumn
          :caption="'Năm' + ' ' + year"
         alignment="center"
        >
          <DxColumn
            v-for="(value, index) in listngay"
            :key="'m' + index"
            :caption="'W'+value"
            :data-field="'N' + value"
            width="60"
            alignment="center"
            format="#,##0"
            cell-template="edit-template"
          />
      </DxColumn>
        <template #edit-template="cell" >
          <div>
            <span v-if="cell.data.value > 0" style="color: orange" >
              <q-checkbox
                color="positive"
                style="color: #f6b024;"
                v-model="tich"
                align = "left"
                disable
            /></span>
            <span v-if="cell.data.value < 0">  <q-icon name="warning" color="warning" size="2rem" /></span>
          </div>
        </template>

        <DxSummary>
          <DxTotalItem column="NAME" :display-format="'Tổng'" />
          <DxTotalItem
            column="VOLUMN"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'decimal'"
          />
        </DxSummary>
      </DxDataGrid>
      <b style="font-size:18px;color:orange"> Danh mục cần sửa chữa </b>
  <DxDataGrid
        :data-source="dataSourcekodat"
        :word-wrap-enabled="true"
        :no-data-text="'Không có dữ liệu !'"
        :show-column-lines="true"
        :show-row-lines="true"
        :show-borders="true"
      >

        <DxColumn
          data-field="MACHINE_ID"
          caption="Mã máy"
          :width="150"
           cssClass="mauloi"
        />
        <DxColumn
          data-field="MUC_KIEM_TRA"
          caption="Mục kiểm tra"
          :width="380"
         cssClass="mauloi"
        />
    
      <DxColumn
          data-field="WEEK"
          caption="Tuần kiểm tra"
          :width="120"
           cssClass="mauloi"
        />
        <DxColumn
          data-field="NGUYENNHAN"
          caption="Nguyên nhân"
          :width="240"
           cssClass="mauloi"
        />
         <DxColumn
          data-field="CACHKHACPHUC"
          caption="Cách khắc phục"
          :width="240"
           cssClass="mauloi"
        />
         <DxColumn
          data-field="THOIGIAN"
          caption="Thời gian dự kiến hoàn thành"
          :width="240"
           cssClass="mauloi"
        />
          <DxColumn
          data-field="GHICHU"
          caption="Ghi chú"
          :width="120"
           cssClass="mauloi"
        />
        <DxSummary>
          <DxTotalItem column="NAME" :display-format="'Tổng'" />
          <DxTotalItem
            column="VOLUMN"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'decimal'"
          />
        </DxSummary>
      </DxDataGrid>
        <div class="q-pa-md doc-container" style="margin-top: 30px">
          <div class="row justify-end">
            <div v-if="dataSourcedat.length>0" class="col-4 text-center">
              <p  style="margin: 0px">
              Ngày {{ dataSourcedat[0].ngay }} tháng
                {{dataSourcedat[0].thang}} năm {{ dataSourcedat[0].nam }}
              </p>
              <b>Phòng cơ điện</b><br />

              <img
                v-if="dataSourcedat[0].CREATE_BY"
                v-bind:src="'/statics/' + dataSourcedat[0].CREATE_BY + '.png'"
                alt="Không có chữ kí số"
                width="180"
                height="auto"
              />
              <br /><br />
              {{ dataSourcedat[0].codien }}
            </div>
            <div v-if="dataSourcedat.length>0" class="col-4 text-center">
             Ngày {{ dataSourcedat[0].ngaysx }} tháng
              {{ dataSourcedat[0].thangsx }} năm {{ dataSourcedat[0].namsx }} <br />
              <b>Sản Xuất</b><br />

              <img
                v-if="dataSourcedat[0].SX_VERIFY_BY"
                v-bind:src="'/statics/' + dataSourcedat[0].SX_VERIFY_BY + '.png'"
                alt="Không có chữ kí số"
                width="180"
                height="auto"
              /><br /><br /><br />{{ dataSourcedat[0].sx }}<br /><br />
            </div>
          </div>
        </div>
      <DialogSelectDate
        :selectDate="chooseDate"
        :showChooseDate="showChooseDate"
        :cancelChooseDate="cancelChooseDate"
      />
    </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxExport,
  DxLookup,
  DxScrolling,
  DxGroupPanel,
  DxHeaderFilter,
  DxSearchPanel,
  DxSummary,
  DxTotalItem,
} from "devextreme-vue/data-grid";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../../ultils";
import DialogSelectDate from "../../components/commons/DialogSelectFromDateToDate";
import moment from "moment";
export default {
  name: "bao-cao-san-luong-may",
  components: {
    DxDataGrid,
    DxColumn,
    DxExport,
    DialogSelectDate,
    DxLookup,
    DxScrolling,
    DxGroupPanel,
    DxSearchPanel,
    DxHeaderFilter,
    DxSummary,
    DxTotalItem,
  },
  data() {
    return {
      dataSource: [],
      dataSourcedat:[],
      fromDate: null,
      toDate: null,
      listngay: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,32,33,34,35,36,37,38,39,40,
        41,42,43,44,45,46,47,48,49,50,51,52
      ],
      showChooseDate: false,
      factory: {
        label: "Nhà máy CBG Thuận Hưng",
        id: 100000,
      },
      month: moment().month() + 1,
      idDepartment: null,
      tich: true,
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          id: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          id: 102340,
          code: "YS1",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          id: 102366,
          code: "TB",
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
    const currentYear = this.toDate.getFullYear();
    this.year = currentYear;
    this.load();
  },
  methods: {
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.load();
    },
    chonFromDate(e) {
      this.fromDate = e.value;
      this.load();
    },
    chonToDate(e) {
      this.toDate = e.value;
      this.load();
    },
    onChange() {
      this.load();
    },
    async load() {
      let payload = {
        month: this.month,
        year:this.year,
        factoryId: this.idDepartment.id,
      };
      const data = await this.$store.dispatch(
        "machine/GET_REPORT_BAO_DUONG_CAP_2",
        payload
      );
        const data2 = await this.$store.dispatch(
        "machine/GET_REPORT_BAO_DUONG_CAP_2_LOI",
        payload
      );
        const data1 = await this.$store.dispatch(
        "machine/GET_REPORT_BAO_DUONG_CAP_2_DAT",
        payload
      );
      this.dataSource = data.data;
      this.dataSourcekodat =  data2.data
      this.dataSourcedat =  data1.data
    
    },
  },
};
</script>

<style>
#BCCAP2 {
  height: 500px;
}
.dx-datagrid-headers .dx-datagrid-table .dx-row>td {
  border-bottom: 1px solid #ddd;
  font-size: 13px;
  font-weight: bold;
}
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  font-weight: bold;
  background-color: white;
   font-size: 18px;
  width: 280;
}
.dx-datagrid-headers .mauloi {
  background-color: #FFC107;
}
 .dx-datagrid-table .dx-row>td.kiemtramay{
       font-size: 16px;
         color: black;
    }
     .dx-datagrid-table .dx-row>td.dx-group-cell{
       font-size: 16px;
         color: black;
    }
.dx-scrollable-scroll {
  background-color: orange;
}
.dx-scrollable-scroll-content {
  background-color: orange;
}
</style>