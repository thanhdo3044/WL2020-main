<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo QC xử lý hàng lỗi -
          <span class="text-amber-14">{{ factory ? factory.label : "" }}</span>
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
        <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
          <div class="col-8">
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in factories"
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
          </div>
          <div class="col-4" align="right"></div>
        </div>
           <q-dialog v-model="chonlenh" persistent>
         <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6 text-blue">Chọn lệnh</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
            <q-select
    
          style="margin: 5px"
          label-color="orange"
      
          v-model="lsx"
          :options="number"
     
          label="Chọn LSX"
       
        />
         <q-select
    
          style="margin: 5px"
          label-color="orange"
      
          v-model="congdoan1"
          :options="options"
     
          label="Công đoạn nhận"
       
        />
            </q-card-section>
                <q-card-actions align="right" class="text-primary">
              <q-btn color="positive" @click="xacnhan" label="Xác nhận" />
              <q-btn color="orange" label="Hủy" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <div class="row">
          <div class="col-12">
            <DxDataGrid
              :data-source="dataSource"
              :columns="columns"
              :show-borders="true"
              :no-data-text="'Không có dữ liệu !'"
            >
              <DxHeaderFilter :visible="true" />
              <DxExport
                :enabled="true"
                :allow-export-selected-data="false"
                :file-name="
                  'Báo cáo hàng đến kho QC xử lý từ ngày ' +
                  tuNgay +
                  ' đến ngày ' +
                  denNgay
                "
              />
              <DxSearchPanel
                :visible="true"
                :placeholder="'Tìm kiếm'"
                :width="400"
              />
              <DxColumn
                data-field="tong"
                caption="Tổng"
                group-index="0"
              />
              <DxColumn
                data-field="Tuần"
                caption="Tuần"
                :width="100"
                alignment="center"
              />
              <DxColumn
                data-field="Nguồn lỗi"
                caption="Nguồn lỗi"
                :width="150"
              />
              <DxColumn data-field="Kho đến" caption="Kho đến" :width="150" />
              <DxColumn data-field="Loại lỗi" caption="Loại lỗi" :width="150" />
              <DxColumn
                data-field="Biện pháp xử lý"
                caption="Biện pháp xử lý"
                :width="300"
              />
              <DxColumn data-field="Chi tiết/cụm" caption="Chi tiết/cụm" :width="150"/>
              <DxColumn caption="Quy cách" alignment="center">
                <DxColumn
                  data-field="LENGTH"
                  caption="Dài"
                  :width="90"
                  alignment="center"
                />
                <DxColumn
                  data-field="WIDTH"
                  caption="Rộng"
                  :width="90"
                  alignment="center"
                />
                <DxColumn
                  data-field="HEIGHT"
                  caption="Dày"
                  :width="90"
                  alignment="center"
                />
              </DxColumn>
              <DxColumn data-field="soluong" caption="Số lượng" :width="100" />
              <DxColumn data-field="volumn" caption="M3" format="#,##0.####" :width="100" />
              <DxColumn
                data-field="Người tạo"
                caption="Người tạo"
                :width="150"
              />
              <DxColumn
                data-field="Ngày tạo"
                caption="Ngày tạo"
                data-type="date"
                format="dd/MM/yyyy"
                :width="100"
              />
              <DxColumn data-field="CODE" caption="Mã biên bản" :width="120" />
                <DxColumn data-field="number" caption="LSX" :width="120" />
              <DxColumn data-field="verify" caption="Trạng thái" :width="120" />
          <DxColumn data-field="Người nhận" caption="Người nhận"  :width="120" />
              <DxColumn caption="Báo lỗi trả LP" cell-template="edit-template" :width="150" />
                  <template #edit-template="cell">
                <div>
                  <span
                    v-if="cell.data.data.ID === 102859 || cell.data.data.ID === 102860"
                    @click="goAdd(cell.data.data)"
                    class="fake-link"
                    >Báo lỗi</span
                  >
                </div>
                  </template>
              <DxSummary>
                <DxGroupItem
                  column="soluong"
                  summary-type="sum"
                  value-format="#,##0.####"
                  display-format="{0}"

                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                />
                <DxGroupItem
                  column="volumn"
                  summary-type="sum"
                  value-format="#,##0.####"
                  display-format="{0}"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                />
              </DxSummary>
            </DxDataGrid>
          </div>
        </div>
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
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxExport,
  DxHeaderFilter,
  DxSummary,
  DxGroupItem,
  DxTotalItem,
} from "devextreme-vue/data-grid";
import { DxDateBox } from "devextreme-vue";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxDateBox,
    DxExport,
    DxHeaderFilter,
    DialogSelectDate,
    DxSummary,
    DxGroupItem,
    DxTotalItem,
  },
  data() {
    return {
      dataSource: [],
      lsx:"",
      columns: [
        "Tuần",
        "Kho đến",
        "Loại lỗi",
        "Biện pháp xử lý",
        "Chi tiết/cụm",
        {
          dataField: "Số lượng",
          format: "fixedpoint",
        },
        "Người tạo",
        { dataField: "Ngày tạo", dataType: "date", format: "dd/MM/yyyy" },
      ],
      number:[],
      chonlenh:false,
      fromDate: null,
      toDate: null,
      nhamay:null,
      showChooseDate: false,
       options: [
        {
          label: "2.Tổ Lựa phôi X5 (YS)",
          ID: 102347,
       
        },
        {
          label: "2.Tổ Lựa phôi X3 mới (YS)",
          ID: 102789,
         
        },
        {
          label: "2.Tổ Lựa phôi X3 (YS)",
          ID: 102855,
      
        },
        {
          label: "2. Tổ Lựa phôi (TB)",
          ID: 102809,
       
        },
        {
          label: "2.Tổ Lựa phôi ghép (TB)",
          ID: 102370,
         
        },
        // {
        //   label: "2.Tổ Lựa phôi X3",
        //   ID: 102855,
      
        // },
      ],
      factories: [
        {
          label: "NM CGB Thuận Hưng",
          id: 100000,
          factoryId: 100000,
        },
        {
          label: "NM CGB Yên Sơn 1",
          id: 102340,
          factoryId: 100004,
        },
        {
          label: "NM CGB Thái Bình",
          id: 102366,
          factoryId: 100005,
        },
      ],
      factory: null,
      congdoan1:null,
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
    this.fromDate = getFisrtDayOfMonth(new Date());
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
  async   goAdd(e) {
    let payload = {
      ITEM_ID:e.ITEM_ID,
      factoryId:e.hqc
    }
     const data = await this.$store.dispatch(
          "prod/CHON_LENH",
          payload
        );
    this.number = []
       data.data.forEach((element) => {
        this.number.push(element.number);
      });
        
      this.chitiet = e.ITEM_ID
      this.soluong = e.soluong
      this.nguonloi = e.nguonloi
       this.nhamay = e.hqc
        this.chonlenh = true
      this.PACKAGE_ID = e.PACKAGE_ID
    },
    async xacnhan() {
        let payload1 = {
      ID:this.PACKAGE_ID,
      condoan:this.congdoan1.ID
    }
     const data1 = await this.$store.dispatch(
          "prod/CHON_CD_NHAN_LOI",
          payload1
        );
        if (data1.meta.success) {
   let   payload = {
          FROM_ID:this.nguonloi,
          ITEM_ID:this.chitiet,
          QUANTITY:this.soluong,
          factoryId: this.nhamay,
          number:this.lsx,
          typeId:100004
   }
    const data2 = await this.$store.dispatch(
          "prod/TRU_LOI",
          payload
        );
        }
              this.chonlenh = false
                await this.load();
    },
    async load() {
      const myFactoryId = this.$route.query.factoryId;
      if (myFactoryId) {
        let payload = {
          fromDate: formatDateISO(this.fromDate),
          toDate: formatDateISO(this.toDate),
          factoryId: myFactoryId,
          departmentId: this.factory ? this.factory.id : 0,
          factoryId2: this.factory.factoryId,
        };
        const data = await this.$store.dispatch(
          "prod/GET_REPORT_QC_SOLUTION",
          payload
        );
        this.dataSource = data.data;
      }
    },
    async changeFactory() {
      await this.load();
    },
  },
};
</script>

<style>
</style>