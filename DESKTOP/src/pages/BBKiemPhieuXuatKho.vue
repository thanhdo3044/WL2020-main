<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary print-hide">
      <div class="row">
        <div class="col-6 top-title text-orange">
          Biên bản giao nhận gỗ tươi nội bộ
        </div>
        <div
          class="col-6 top-title text-orange cursor-pointer"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày {{ tuNgay }} đến {{ denNgay }}
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row print-hide">
        <div class="col-3 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="department"
            :options="departments"
            label="Chọn Công đoạn"
            @input="onChange"
            dense
          />
        </div>
        <div class="col-3 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="soPhieu"
            :options="soPhieus"
            label="Chọn số phiếu"
            @input="onChangeSoPhieu"
            dense
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <table border="1" style="width: 100%; border-collapse: collapse">
        <thead class="w-100">
          <tr>
            <th rowspan="2" style="width: 100px">
              <img src="~assets/logo.png" style="width: auto; height: 90px" />
            </th>
            <th style="font-size: 16px">SỔ TAY COC</th>
            <td rowspan="2" style="width: 200px">
              BM-COC-52 <br />
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
        <div class="col-4">Acacia (Keo tai tượng)</div>
        <div class="col-4">Số phiếu: {{ phieu }}</div>
        <div class="col-4">BKS: {{ bks }}</div>
      </div>
      <div class="row">
        <div class="col-4">Kho xuất: {{noixuat}}</div>
      </div>
      <div class="row">
        <div class="col-4">Trạng thái môi trường: FSC 100%</div>
        <div class="col-4">Kho nhận: {{noinhan}}</div>
      </div>
      <DxDataGrid
        :data-source="dataSource"
        :show-borders="true"
        :word-wrap-enabled="true"
        :show-row-lines="true"
        :show-column-lines="true"
        :no-data-text="'Không có dữ liệu'"
      >

        <DxPaging :enabled="false" />
        <DxColumn data-field="ID" caption="Mã" :visible="false" />
        <DxColumn
          data-field="NAME"
          caption="Tên chi tiết"
          :width="300"
        />
        <DxColumn caption="Quy cách" alignment="center">
          <DxColumn
            data-field="LENGTH"
            caption="Dài"
            alignment="center"
            :width="70"
          />
          <DxColumn
            data-field="WIDTH"
            caption="Rộng"
            alignment="center"
            :width="70"
          />
          <DxColumn
            data-field="HEIGHT"
            caption="Dày"
            alignment="center"
            :width="70"
          />
        </DxColumn>

        <!-- <DxColumn
          data-field="SL_TH"
          caption="Số lượng PL"
          :width="70"
          alignment="center"
        /> -->
        <DxColumn
          data-field="UNIT_NAME"
          caption="Đơn vị tính"
          alignment="center"
          :width="70"
        />
        <DxColumn
          data-field="SL_TH"
          caption="Tổng số thanh"
          :width="120"
          alignment="center"
        />
        <DxColumn
          data-field="KLC_TH"
          caption="Khối lượng"
          format="#,##0.00##"
          :width="120"
        />
        <!-- <DxColumn
          data-field="GOODS_TYPE"
          caption="Trạng thái"
          :width="70"
          alignment="center"
        /> -->
    
        <DxColumn
          data-field="GHICHU"
          caption="Ghi chú"
       
        />
        <DxSummary>
          <DxTotalItem column="NAME" :display-format="'Tổng'" />
          <DxTotalItem
            column="SL_PL"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'decimal'"
          />
          <DxTotalItem
            column="QUANTITY"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'decimal'"
          />
          <DxTotalItem
            column="KLC_TH"
            summary-type="sum"
            data-type="number"
            :show-in-group-footer="false"
            :align-by-column="true"
            :display-format="'{0}'"
            :value-format="'#,##0.00##'"
          />
        </DxSummary>
      </DxDataGrid>
      <div class="row text-center">
        <div class="col-8"></div>
        <div class="col-4">
          Tuyên Quang, ngày {{ day }} tháng {{ month }} năm {{ year }}
        </div>
      </div>
    
      <div class="row text-center">
        
      
        <div class="col-4">Lái xe chuyển</div>
        <div class="col-4">Thủ kho giao</div>
          <div class="col-4">Thủ kho nhận</div>
     
      </div>
      <div class="row text-center" style="margin-top: 100px">
        <div class="col-4"></div>
        <div class="col-4">{{$store.state.base.userInfo.lastName}}</div>
      <div class="col-4"></div>
      </div>
    </q-card-section>
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
  </q-page>
</template>

<script>
import DialogSelectDate from "../components/commons/DialogSelectFromDateToDate";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import {
  DxDataGrid,
  DxColumn,
  DxSummary,
  DxTotalItem,
  DxGroupPanel,
  DxPaging,
} from "devextreme-vue/data-grid";
import {
  formatDateISO,
  formatDateVN,
  getFisrtDayOfMonth,
  showNotifySuccess,
  showNotifyError,
} from "../ultils";
export default {
  components: {
    DialogSelectDate,
    DxDataGrid,
    DxColumn,
    DxSummary,
    DxTotalItem,
    DxGroupPanel,
    DxPaging,
  },
  data() {
    return {
      dataSource: [],
      department: null,
      departments: [],
      quanLyName: "Nguyễn Văn Nam",
      date: moment(new Date()).format("YYYY-MM-DD"),
      day: 0,
      month: 0,
      noinhan:'',
      noixuat:'',
      year: 1990,
      fromDate: null,
      toDate: null,
      phieu: null,
      soPhieu: null,
      soPhieus: [],
      bks: null,
      osIds: [],
      showChooseDate: false,
      selectedItemKeys: [],
      selectionChanged: (data) => {
        const osId = data.selectedRowsData.map((row) => `${row.ID}`);
        const quantity = data.selectedRowsData.map((row) => `${row.SL_PL}`);
        this.osIds = { osId, quantity };
      },
    };
  },
  created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate());
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.loadDepartment();
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  methods: {
    ...mapActions("prod", [
      "getDepartmentByKho",
      "getKiemPhieuXuatKho",
      "updateBBKiemPhieuXuatKho",
      "getSoPhieuXuatNhapTonKho",
      "getXuatNhapTonKhoBySoPhieu"
    ]),
     cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
    },
    async loadDepartment() {
      this.departments = [];
      let data = await this.getDepartmentByKho();
      data.data.forEach((el) => {
        if (el.ID == 102806 || el.ID == 102807 || el.ID == 102805 )
        this.departments.push({
          label: el.NAME,
          value: el.ID,
          name: el.NAME
        });
      });
    },
    async loadSoPhieu() {
      if (this.department != null && this.fromDate != null) {
        let payload = {
          fromDate: formatDateISO(this.fromDate),
          toDate: formatDateISO(this.toDate),
          stepId: this.department.value,
        };
        this.soPhieus = [];
        this.soPhieu = "";
        let data = await this.getSoPhieuXuatNhapTonKho(payload);
        data.data.forEach((el) => {
          this.soPhieus.push({
            label: el.SO_PHIEU + " | " + formatDateVN(el.DATE),
            value: el.SO_PHIEU,
            date: el.DATE
          
          });
        });
        
      }
    },
    onChange() {
      // if(this.department.name.includes('YS1A')){
      //   this.quanLyName = "Nguyễn Văn Nam";
      // }else{
      //   this.quanLyName = "Phan Đức Đại"
      // }
      this.noinhan = ''
      this.noixuat = ''
      this.loadSoPhieu();
    },
    async onChangeSoPhieu(){
          this.phieu = this.soPhieu.value;
        let check = moment(this.soPhieu.date, "YYYY/MM/DD");
      this.day = check.format("D");
      this.month = check.format("M");
      this.year = check.format("YYYY");
      let payload = {
        soPhieu:this.soPhieu.value,
        department:this.department.value,
        month:this.month,
      }
        let data = await this.getXuatNhapTonKhoBySoPhieu(payload);
        this.dataSource = data.data;
        this.bks = this.dataSource[0].BKS;
        if (this.department.value == 102807){ this.noixuat = 'NM CBG Yên Sơn 1'
        this.noinhan = 'NM CBG Thái Bình';
        }
         if (this.department.value == 102806){ this.noixuat = 'NM CBG Thái Bình'
        this.noinhan = 'NM CBG Yên Sơn 1';
        }
  
    },
    changeDate() {
      this.loadSoPhieu();
    },
    onSelectionUpdate() {
      let status = false;
      console.log("osIds", this.osIds);
      if (this.soPhieu != null && this.bks != null) {
        for (let i = 0; i < this.osIds.osId.length; i++) {
          let payload = {
            id: this.osIds.osId[i],
            sl_pl: this.osIds.quantity[i],
            soPhieu: this.soPhieu,
            bks: this.bks,
          };
          let data = this.updateBBKiemPhieuXuatKho(payload);
        }
        showNotifySuccess();
        this.load();
      }
    },
  },
};
</script>
