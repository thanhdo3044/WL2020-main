<template>
  <q-page>
    <q-banner class="text-primary">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div class="text-h6 q-mt-lg">
        Báo cáo NXT kho gỗ sau sấy - Nhà máy CBG Thuận Hưng
        {{ factory1 ? factory1.label : "" }}
      </div>
    </q-banner>
    <q-card>
      <!-- <div class="text-orange row widget-container">
        <div class="col-3 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="factory1"
            :options="options"
            label="Chọn Nhà Máy"
            @input="onChange"
            dense
          />
        </div>
        <div class="col-3 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="stepId"
            :options="data"
            label="Chọn công đoạn"
            @input="loadData"
            dense
          />
        </div> -->
      <div
        class="col-6 top-title cursor-pointer text-orange"
        align="right"
        @click="showChooseDate = true"
      >
        Từ ngày {{ tuNgay }} đến {{ denNgay }}
      </div>
      <!-- </div> -->
      <q-card-section>
        <DxDataGrid
              id="gridContainer"
                :word-wrap-enabled="true"
          :data-source="dataSource"
          key-expr="NAME"
          :hover-state-enabled="true"
          :row-alternation-enabled="true"
          :selection="{ mode: 'single' }"
          :allow-column-resizing="true"
        >
       
              <DxSorting mode="none" />
          <DxColumnChooser :enabled="true" />
          <DxHeaderFilter :visible="true" />
          <DxGroupPanel
            :visible="true"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
          <DxScrolling mode="infinite" />
          <DxGrouping :auto-expand-all="true" />
          <!-- <DxEditing :allow-updating="true" mode="cell" /> -->

          <DxColumn
            data-field="NAME"
            caption="SP/Chi tiết"
           
            :width="250"
            :fixed="true"
            :allowEditing="false"
          />
          <DxColumn caption="Qui Cách" alignment="center" :allowEditing="false" :fixed="true">
            <DxColumn
              caption="Dầy"
              data-field="DAY"
              alignment="center"
              :allowEditing="false"
              :width="60"
            />
            <DxColumn
              caption="Rộng"
              data-field="RONG"
              alignment="center"
              :width="60"
              :allowEditing="false"
            />
            <DxColumn
              caption="Dài"
              data-field="DAI"
              alignment="center"
              :width="60"
              :allowEditing="false"
            />
          </DxColumn>
<DxColumn caption="Tồn đầu kỳ" alignment="center">
   <DxColumn
            caption="T"
            data-field="TondkT"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            :width="80"
            format="###,##0"
             :calculate-cell-value="calculatedaukyT"
          />
          <DxColumn
            caption="M3"
            data-field="Tondk"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            :width="80"
            format="#,##0.###0"
             :calculate-cell-value="calculatedauky"
          />
          </DxColumn>
          <DxColumn caption="Nhập" alignment="center">
           
           <DxColumn caption="Nhập gỗ TH" alignment="center">
               <DxColumn
              data-field="NhapGoRALOT"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="100"
              format="###,##0.####"
            />
            <DxColumn
              data-field="NhapGoRALO"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="80"
              format="###0.####"
            />
             </DxColumn>
              <DxColumn caption="Nhập ẩm sấy lại" alignment="center">
                <DxColumn
              data-field="nhapam"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="80"
              format="#,##0.###0"
            />
            <DxColumn
              data-field="nhapam"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="80"
              format="#,##0.###0"
            />
            </DxColumn>
            <DxColumn caption="Nhập TQ phôi thô" alignment="center">
                <DxColumn
              data-field="nhapTQT"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="80"
              format="###,##0"
            />
            <DxColumn
              data-field="nhapTQ"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="80"
              format="#,##0.###0"
            />
            </DxColumn>
              <DxColumn caption="Nhập TQ Phôi 2M" alignment="center">
                <DxColumn
              data-field="nhap2MTQT"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="80"
              format="###,##0"
            />
            <DxColumn
              data-field="nhap2MTQ"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="80"
              format="#,##0.###0"
            />
            </DxColumn>
               <DxColumn caption="Nhập khác" alignment="center">
                <DxColumn
              data-field="nhapkhacT"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="80"
              format="###,##0"
            />
            <DxColumn
              data-field="nhapkhac"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="80"
              format="#,##0.###0"
            />
            </DxColumn>
          </DxColumn>
          <DxColumn caption="Xuất" alignment="center">
          
          
             <DxColumn caption="Xuất X3 indoor" alignment="center">
               <DxColumn
              data-field="xuatTHX3T"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :width="80"
              :visible="true"
              format="###,##0"
            />
            <DxColumn
              data-field="xuatTHX3"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :width="80"
              :visible="true"
              format="#,##0.###0"
            />
             </DxColumn>
               <DxColumn caption="Xuất X1 indoor" alignment="center">
               <DxColumn
              data-field="xuatTHX1T"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :width="80"
              :visible="true"
              format="###,##0"
            />
            <DxColumn
              data-field="xuatTHX1"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :width="80"
              :visible="true"
              format="#,##0.###0"
            />
             </DxColumn>
               <DxColumn caption="Xuất khác" alignment="center">
            <DxColumn
              data-field="xuatkhacT"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :width="80"
              :visible="true"
              value-format="###,##0"
            />
            <DxColumn
              data-field="xuatkhacK"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="80"
              value-format="###0.####"
            />
            </DxColumn>
             <DxColumn caption="Xuất bù ẩm" alignment="center">
                <DxColumn
              data-field="xuatbuamT"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="80"
              format="#,##0.###0"
            />
            <DxColumn
              data-field="xuatbuamK"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="80"
              format="#,##0.###0"
            />
            </DxColumn>
            <DxColumn caption="Xuất Tuyên Quang" alignment="center">
                  <DxColumn
              data-field="xuatTQT"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="80"
              format="###,##0"
            />
            <DxColumn
              data-field="xuatTQ"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="80"
              format="#,##0.###0"
            />
          </DxColumn>
                <DxColumn caption="Xuất Quang Minh" alignment="center">
                  <DxColumn
              data-field="xuatQMT"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="80"
              format="###,##0"
            />
            <DxColumn
              data-field="xuatQM"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="80"
              format="#,##0.###0"
            />
                </DxColumn>
                <DxColumn caption="Xuất xếp sấy lựa" alignment="center">
                  <DxColumn
              data-field="xuatluaxepsayT"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="80"
              format="###,##0"
            />
            <DxColumn
              data-field="xuatluaxepsayK"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="80"
              format="#,##0.###0"
            />
          </DxColumn>
           </DxColumn>
           <DxColumn caption="Tồn cuối kỳ" alignment="center">
              <DxColumn
            caption="T"
            data-field="TonCuoiT"
            data-type="number"
            alignment="center"
            :width="80"
            :allowEditing="true"
            format="###,##0"
            :calculate-cell-value="calculateTongThanhT"
          />
          <DxColumn
            caption="M3"
            data-field="TonCuoi"
            data-type="number"
            alignment="center"
             :calculate-cell-value="calculateTongThanh"
            :width="80"
            format="#,##0.###0"
             
          />
          </DxColumn>
          <DxSummary>
            <DxTotalItem
              column="NAME"
              summary-type="count"
              value-format="fixedpoint"
              display-format="Tổng cộng : "
            />
                        <DxTotalItem
              column="Tondk"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="NhapGoRALO"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="nhapam"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="nhapTQ"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="nhap2MTQ"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
                        <DxTotalItem
              column="nhapkhac"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="xuatTHX1"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="x1a"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="xuatTHX3"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="xuatTQ"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
              <DxTotalItem
              column="xuatQM"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="xuatbuamK"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="TonCuoi"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
          </DxSummary>
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'In Tồn Phôi'"
          />
          <DxSearchPanel
            :visible="true"
            :placeholder="'Tìm kiếm'"
            :width="400"
          />
        </DxDataGrid>
      </q-card-section>
    </q-card>
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import { formatDateVN,roundNumber } from "../ultils";
import DialogSelectDate from "components/commons/DialogSelectFromDateToDate";
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxExport,
  DxColumnChooser,
  DxHeaderFilter,
  DxSummary,
  DxSorting,
  DxTotalItem,
  DxGroupPanel,
  DxScrolling,
  DxGrouping,
} from "devextreme-vue/data-grid";
export default {
  // name: 'PageName',
  components: {
    DxDataGrid,
    DxColumn,
    DxSearchPanel,
    DxExport,
    DxSorting,
    DxColumnChooser,
    DxHeaderFilter,
    DxSummary,
    DxTotalItem,
    DxGroupPanel,
    DxScrolling,
    DxGrouping,
    DialogSelectDate,
  },
  data() {
    return {
      showChooseDate: false,
      fromDate: moment().startOf("month"),
      toDate: moment(),
      showVolumnColumn: false,
      factory1: null,
      dataSource: null,

      stepId: null, // string,
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102299,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102299,
          code: "TB",
        },
      ],
    };
  },
  computed: {
    ...mapGetters("base", [
      "opCongDoans",
      "myFactoryInfor",
      "userInfo",
      "dsCongDoans",
    ]),
    ...mapGetters("keHoach", ["tonPhois"]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  methods: {
    ...mapActions("prod", ["stockAfterDrying"]),
    ...mapActions("base", ["getAllCongDoans"]),
    async loadData() {
      let payload = {
        startDate: moment(this.fromDate).format().slice(0, 10),
        endDate: moment(this.toDate).format().slice(0, 10),
      };
      console.log(payload)
      let dataSource = await this.stockAfterDrying(payload);
      // dataSource.data.map(e =>{
      //   e.x1t = Math.abs(e.x1t);
      //   e.x1a = Math.abs(e.x1a);
      //   e.x3 = Math.abs(e.x3);``````
      //   e.amX = Math.abs(e.amX);
      //   e.tq = Math.abs(e.tq);
      // })
      this.dataSource = dataSource.data
    },
            calculateTongThanh(e) {
       if (e.DAI >0 && e.RONG>0 && e.DAY>0 && (e.DAY != 55 || e.RONG != 55)) e.TonCuoi = roundNumber(((e.TonCuoiT * e.DAY*e.DAI*e.RONG)/1000000000),4);
          else if (e.DAY == 55 && e.RONG == 55) e.TonCuoi = roundNumber(((e.TonCuoiT * e.DAY*e.DAI*e.RONG)*3.14/4000000000),4)
       else e.TonCuoi = e.TonCuoiT
    if (e.TonCuoi >-0.00001)
       return Math.abs(e.TonCuoi)  ;
       else return e.TonCuoi;
  },
  calculateTongThanhT(e) {
   if (e.TonCuoiT >-0.00001)
       return Math.abs(e.TonCuoiT)  ;
       else return e.TonCuoiT;
  },
             calculatedauky(e) {
       if (e.DAI >0 && e.RONG>0 && e.DAY>0 && (e.DAY != 55 || e.RONG != 55)) e.Tondk = roundNumber(((e.TondkT * e.DAY*e.DAI*e.RONG)/1000000000),4);
        else if (e.DAY == 55 && e.RONG == 55) e.Tondk = roundNumber(((e.TondkT * e.DAY*e.DAI*e.RONG)*3.14/4000000000),4)
       else e.Tondk = e.TondkT
       if (e.Tondk >-0.00001)
       return Math.abs(e.Tondk)  ;
       else 
        return e.Tondk  ;
  },
  calculatedaukyT(e){
      if (e.TondkT >-0.00001)
        return Math.abs(e.TondkT);
        else return e.TondkT
  },
    cancelChooseDate() {
      this.showChooseDate = false;
    },

    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadData();
    },
  },
  async created() {
    await this.loadData();
  },
  mounted() {},
};
</script>
<style scoped>

#gridContainer {
  height: 650px;
 
}
</style>
