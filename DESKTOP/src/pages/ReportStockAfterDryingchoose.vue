<template>
  <q-page>
    <q-banner class="text-primary">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div class="text-h6 q-mt-lg">
        Báo cáo nhập xuất tồn kho gỗ sau sấy: đã lựa - chưa lựa
        {{ factory1 ? factory1.label : "" }}
      </div>
    </q-banner>
    <q-card>
       <div class="text-orange row widget-container">
      <!--  <div class="col-3 q-pa-sm">
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
        </div>-->
        <div class="col-3 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="lua"
            :options="luadat"
            label="Chọn "
            @input="loadData"
            dense
          />
        </div> 
      <div
        class="col-6 top-title cursor-pointer text-orange"
        align="right"
        @click="showChooseDate = true"
      >
        Từ ngày {{ tuNgay }} đến {{ denNgay }}
      </div>
       </div> 
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
              :width="80"
            />
            <DxColumn
              caption="Rộng"
              data-field="RONG"
              alignment="center"
              :width="100"
              :allowEditing="false"
            />
            <DxColumn
              caption="Dài"
              data-field="DAI"
              alignment="center"
              :width="80"
              :allowEditing="false"
            />
          </DxColumn>
<DxColumn caption="Tồn đầu kỳ chưa lựa" alignment="center"  :visible="chualua">
   <DxColumn
            caption="T"
            data-field="chualuaDK"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            :width="80"
            format="###,##0"
          />
          <DxColumn
            caption="M3"
            data-field="chualuaDKK"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            :width="80"
            format="#,##0.###0"
             :calculate-cell-value="calculatedauky"
          />
          </DxColumn>
    <DxColumn caption="Tồn đầu kỳ đã lựa đạt" alignment="center"  :visible="dalua">
   <DxColumn
            caption="T"
            data-field="daluaDK"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            :width="80"
            format="###,##0"
          />
          <DxColumn
            caption="M3"
            data-field="daluaDKK"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            :width="80"
            format="#,##0.###0"
             :calculate-cell-value="calculatedaukyK"
          />
          </DxColumn>
          <DxColumn caption="Tồn đầu kỳ Hàng chờ xử lý" alignment="center"  :visible="dalua">
   <DxColumn
            caption="T"
            data-field="daluakodatDK"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            :width="80"
            format="###,##0"
          />
          <DxColumn
            caption="M3"
            data-field="daluakodatDKK"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            :width="80"
            format="#,##0.###0"
             :calculate-cell-value="calculatedaukyKD"
          />
          </DxColumn>
          <DxColumn caption="Nhập" alignment="center">
           
           <DxColumn caption="Nhập gỗ TH chưa lựa" alignment="center"  :visible="chualua">
               <DxColumn
              data-field="nhapchulua"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="100"
              format="###,##0.####"
            />
            <DxColumn
              data-field="nhapchuluaK"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="80"
              format="###0.####"
                :calculate-cell-value="calculatedaukynhapchulua"
            />
             </DxColumn>
              <!-- <DxColumn caption="Nhập ẩm sấy lại" alignment="center">
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
            </DxColumn> -->
            <DxColumn caption="Nhập đã lựa đạt" alignment="center"  :visible="dalua">
                <DxColumn
              data-field="nhapdalua_dat"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="80"
              format="###,##0"
            />
            <DxColumn
              data-field="nhapdalua_datK"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="80"
              format="#,##0.###0"
              :calculate-cell-value="calculatedaukynhapdalua_dat"
            />
            </DxColumn>
              <DxColumn caption="Nhập hàng chờ xử lý" alignment="center"  :visible="dalua">
                <DxColumn
              data-field="nhapdalua_kodat"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="80"
              format="###,##0"
            />
            <DxColumn
              data-field="nhapdalua_kodatK"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              :width="80"
              format="#,##0.###0"
              :calculate-cell-value="calculatedaukynhapdalua_kodat"
            />
            </DxColumn>
          </DxColumn>
          <DxColumn caption="Xuất" alignment="center">
            <DxColumn caption="Xuất chưa lựa" alignment="center"  :visible="chualua">
            <DxColumn
              data-field="xuatchualua"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :width="80"
              :visible="true"
              value-format="###,##0"
            />
            <DxColumn
              data-field="xuatchualuaK"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="80"
              value-format="###0.####"
              :calculate-cell-value="calculatedaukyxuatchulua"
            />
            </DxColumn>
            <DxColumn caption="Xuất đã lựa đạt" alignment="center"  :visible="dalua">
            <DxColumn
              data-field="xuadalua_dat"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="80"
              format="###,##0"
            />
              <DxColumn
              data-field="xuadalua_datK"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="80"
              format="#,##0.###0"
                :calculate-cell-value="calculatedaukyxuatdalua_dat"
            />
             </DxColumn>
             <DxColumn caption="Xuất Hàng chờ xử lý" alignment="center"  :visible="dalua">
               <DxColumn
              data-field="xuatdalua_kodat"
              caption="T"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :width="80"
              :visible="true"
              format="###,##0"
            />
            <DxColumn
              data-field="xuatdalua_kodatK"
              caption="M3"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :width="80"
              :visible="true"
              format="#,##0.###0"
                :calculate-cell-value="calculatedaukyxuatdalua_kodat"
            />
             </DxColumn>
            
        
              
           </DxColumn>
           <DxColumn caption="Tồn cuối kỳ chưa lựa" alignment="center" :visible="chualua">
              <DxColumn
            caption="T"
            data-field="chualuaCK"
            data-type="number"
            alignment="center"
             :visible="true"
            :width="80"
            :allowEditing="true"
            format="###,##0"
          />
          <DxColumn
            caption="M3"
            data-field="chualuaCKK"
            data-type="number"
            alignment="center"
             :calculate-cell-value="calculateTongThanh"
            :width="80"
            format="#,##0.###0"
             
          />
          </DxColumn>
                  <DxColumn caption="Tồn cuối kỳ đã lựa" alignment="center"  :visible="dalua">
              <DxColumn
            caption="T"
            data-field="daluaCK"
            data-type="number"
            alignment="center"
            :width="80"
            :allowEditing="true"
            format="###,##0"
          />
          <DxColumn
            caption="M3"
            data-field="daluaCKK"
            data-type="number"
            alignment="center"
             :calculate-cell-value="calculateTongThanhK"
            :width="80"
            format="#,##0.###0"
             
          />
          </DxColumn>
                  <DxColumn caption="Tồn cuối kỳ hàng chờ xử lý" alignment="center"  :visible="dalua">
              <DxColumn
            caption="T"
            data-field="daluakodatCK"
            data-type="number"
            alignment="center"
            :width="80"
            :allowEditing="true"
            format="###,##0"
          />
          <DxColumn
            caption="M3"
            data-field="daluakodatCKK"
            data-type="number"
            alignment="center"
             :calculate-cell-value="calculateTongThanhKK"
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
              column="daluaDKK"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="chualuaDKK"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="nhapchuluaK"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="nhapdalua_datK"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="xuatchualuaK"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="xuatdalua_kodatK"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="xuadalua_datK"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="nhapdalua_kodatK"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
             <DxTotalItem
              column="daluakodatDKK"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="chualuaCKK"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="daluakodatCKK"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="daluaCKK"
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
      dalua:true,
      lua: null,
      chualua:false,
      stepId: null, // string,
        luadat:[
         {
          label: "Đã lựa",
          id:"dalua",
        },
            {
          label: "chưa lựa",
          id:"chualua",
        },
          {
          label: "tổng hợp",
          id:"tonghop",
        },
       
      ],
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
    ...mapActions("prod", ["stockAfterDryingchoose"]),
    ...mapActions("base", ["getAllCongDoans"]),
    async loadData() {
      
      if (this.lua.id == 'dalua') {
        this.dalua = true
        this.chualua = false
      } 
       if (this.lua.id == 'chualua') {
        this.dalua = false
        this.chualua = true
      }
      if (this.lua.id == 'tonghop') {
        this.dalua = true
        this.chualua = true
      }
      let payload = {
        startDate: moment(this.fromDate).format().slice(0, 10),
        endDate: moment(this.toDate).format().slice(0, 10),
      };
      console.log(payload)
      let dataSource = await this.stockAfterDryingchoose(payload);
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
       if (e.DAI >0 && e.RONG>0 && e.DAY >0 && (e.DAY != 55 || e.RONG != 55)) e.chualuaCKK = roundNumber(((e.chualuaCK * e.DAY*e.DAI*e.RONG)/1000000000),4);
             else if (e.DAY == 55 && e.RONG == 55) e.chualuaCKK = roundNumber(((e.chualuaCK * e.DAY*e.DAI*e.RONG)*3.14/4000000000),4)
       else e.chualuaCKK = e.chualuaCK
    
       return e.chualuaCKK  ;
  },
           calculateTongThanhK(e) {
       if (e.DAI >0 && (e.DAY != 55 || e.RONG != 55)) e.daluaCKK = roundNumber(((e.daluaCK * e.DAY*e.DAI*e.RONG)/1000000000),4);
       else if (e.DAY == 55 && e.RONG == 55) e.daluaCKK = roundNumber(((e.daluaCK * e.DAY*e.DAI*e.RONG)*3.14/4000000000),4)
       else e.daluaCKK = e.daluaCK
    
       return e.daluaCKK  ;
  },
        calculateTongThanhKK(e) {
       if (e.DAI >0 && e.RONG>0 && e.DAY >0 && (e.DAY != 55 || e.RONG != 55)) e.daluakodatCKK = roundNumber(((e.daluakodatCK * e.DAY*e.DAI*e.RONG)/1000000000),4);
              else if (e.DAY == 55 && e.RONG == 55) e.daluakodatCKK = roundNumber(((e.daluakodatCK * e.DAY*e.DAI*e.RONG)*3.14/4000000000),4)
       else e.daluakodatCKK = e.daluakodatCK
    
       return e.daluakodatCKK  ;
  },
     
             calculatedauky(e) {
       if (e.DAI >0 && e.RONG>0 && e.DAY >0 && (e.DAY != 55 || e.RONG != 55)) e.chualuaDKK = roundNumber(((e.chualuaDK * e.DAY*e.DAI*e.RONG)/1000000000),4);
               else if (e.DAY == 55 && e.RONG == 55) e.chualuaDKK = roundNumber(((e.chualuaDK * e.DAY*e.DAI*e.RONG)*3.14/4000000000),4)
       else e.chualuaDKK = e.chualuaDK
    
       return e.chualuaDKK  ;
  },
             calculatedaukyK(e) {
       if (e.DAI >0 && e.RONG>0 && e.DAY >0 && (e.DAY != 55 || e.RONG != 55)) e.daluaDKK = roundNumber(((e.daluaDK * e.DAY*e.DAI*e.RONG)/1000000000),4);
       else if (e.DAY == 55 && e.RONG == 55) e.daluaDKK = roundNumber(((e.daluaDK * e.DAY*e.DAI*e.RONG)*3.14/4000000000),4)
       else e.daluaDKK = e.daluaDK
    
       return e.daluaDKK  ;
  },
             calculatedaukyKD(e) {
       if (e.DAI >0 && e.RONG>0 && e.DAY >0 && (e.DAY != 55 || e.RONG != 55)) e.daluakodatDKK = roundNumber(((e.daluakodatDK * e.DAY*e.DAI*e.RONG)/1000000000),4);
       else if (e.DAY == 55 && e.RONG == 55) e.daluakodatDKK = roundNumber(((e.daluakodatDK * e.DAY*e.DAI*e.RONG)*3.14/4000000000),4)
       else e.daluakodatDKK = e.daluakodatDK
    
       return e.daluakodatDKK  ;
  },
              calculatedaukynhapchulua(e) {
       if (e.DAI >0 && e.RONG>0 && e.DAY >0 && (e.DAY != 55 || e.RONG != 55)) e.nhapchuluaK = roundNumber(((e.nhapchulua * e.DAY*e.DAI*e.RONG)/1000000000),4);
            else if (e.DAY == 55 && e.RONG == 55) e.nhapchuluaK = roundNumber(((e.nhapchulua * e.DAY*e.DAI*e.RONG)*3.14/4000000000),4)
       else e.nhapchuluaK = e.nhapchulua
    
       return e.nhapchuluaK  ;
  },
              calculatedaukynhapdalua_dat(e) {
       if (e.DAI >0 && e.RONG>0 && e.DAY >0 && (e.DAY != 55 || e.RONG != 55)) e.nhapdalua_datK = roundNumber(((e.nhapdalua_dat * e.DAY*e.DAI*e.RONG)/1000000000),4);
      else if (e.DAY == 55 && e.RONG == 55) e.nhapdalua_datK = roundNumber(((e.nhapdalua_datK * e.DAY*e.DAI*e.RONG)*3.14/4000000000),4)
       else e.nhapdalua_datK = e.nhapdalua_dat
    
       return e.nhapdalua_datK  ;
  },
            calculatedaukynhapdalua_kodat(e) {
       if (e.DAI >0 && e.RONG>0 && e.DAY >0 && (e.DAY != 55 || e.RONG != 55)) e.nhapdalua_kodatK = roundNumber(((e.nhapdalua_kodat * e.DAY*e.DAI*e.RONG)/1000000000),4);
      else if (e.DAY == 55 && e.RONG == 55) e.nhapdalua_kodatK = roundNumber(((e.nhapdalua_kodat * e.DAY*e.DAI*e.RONG)*3.14/4000000000),4)
       else e.nhapdalua_kodatK = e.nhapdalua_kodat
    
       return e.nhapdalua_kodatK  ;
  },
             calculatedaukyxuatchulua(e) {
       if (e.DAI >0 && e.RONG>0 && e.DAY >0 && (e.DAY != 55 || e.RONG != 55)) e.xuatchualuaK = roundNumber(((e.xuatchualua * e.DAY*e.DAI*e.RONG)/1000000000),4);
   else if (e.DAY == 55 && e.RONG == 55) e.xuatchualuaK = roundNumber(((e.xuatchualua * e.DAY*e.DAI*e.RONG)*3.14/4000000000),4)
       else e.xuatchualuaK = e.xuatchualua
    
       return e.xuatchualuaK  ;
  },
           calculatedaukyxuatdalua_dat(e) {
       if (e.DAI >0 && e.RONG>0 && e.DAY >0 && (e.DAY != 55 || e.RONG != 55)) e.xuadalua_datK = roundNumber(((e.xuadalua_dat * e.DAY*e.DAI*e.RONG)/1000000000),4);
   else if (e.DAY == 55 && e.RONG == 55) e.xuadalua_datK = roundNumber(((e.xuadalua_dat * e.DAY*e.DAI*e.RONG)*3.14/4000000000),4)
       else e.xuadalua_datK = e.xuadalua_dat
    
       return e.xuadalua_datK  ;
  },
           calculatedaukyxuatdalua_kodat(e) {
       if (e.DAI >0 && e.RONG>0 && e.DAY >0 && (e.DAY != 55 || e.RONG != 55)) e.xuatdalua_kodatK = roundNumber(((e.xuatdalua_kodat * e.DAY*e.DAI*e.RONG)/1000000000),4);
  else if (e.DAY == 55 && e.RONG == 55) e.xuatdalua_kodatK = roundNumber(((e.xuatdalua_kodat * e.DAY*e.DAI*e.RONG)*3.14/4000000000),4)
       else e.xuatdalua_kodatK = e.xuatdalua_kodat
    
       return e.xuatdalua_kodatK  ;
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
