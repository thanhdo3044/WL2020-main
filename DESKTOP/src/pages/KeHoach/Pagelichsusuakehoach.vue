<template>
  <q-page >
    <q-banner class="text-primary row print-hide" >
      <template v-slot:avatar >
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div class="text-h6 q-mt-lg ">
        <b> LỊCH SỬ SỬA LỆNH SẢN XUẤT </b>
      </div>
    </q-banner>
    <q-card >
      <div class="text-orange row widget-container">
        <div class="col-12 col-md-2 q-pa-sm">
          <q-select class="row print-hide" 
            color="grey-3"
            label-color="orange"
            filled
            v-model="factory"
            @input="searchFactory"
            :options="factories1"
            label="Chọn nhà máy"
            dense
          />
        </div>
        
        <div class="col-12 col-md-2 q-pa-sm">
          <q-input class="row print-hide" 
            color="grey-3"
            label-color="orange"
            outlined
            @blur="searchWeek"
            v-model="week"
            :value="ngayDongGoi ? moment(ngayDongGoi).format('w') : ''"
            label="Tuần"
            dense
          >
            <template v-slot:append>
              <q-icon name="next_week" color="orange" />
            </template>
          </q-input>
        </div>
         <div class="col-12 col-md-2 q-pa-sm">
 <q-input  
              filled
            label-color="orange"
           
            v-model.number="year"
            type="number"
            label="Năm"
             dense
            :readonly="true"
          />
          </div>
      </div>
      <q-card-section>  
        <DxDataGrid
        id="gridContainer"
          :data-source="dataTotal"
          key-expr="id"
          :word-wrap-enabled="true"
          :hover-state-enabled="true"
          :row-alternation-enabled="true"
          :selection="{ mode: 'single' }"
          @row-updated="rowUpdated"
          @row-updating="rowUpdating"
          :show-column-lines="true"
          :show-row-lines="true"
          :show-borders="true"
        >
          <DxColumnChooser :enabled="true" />
          <DxHeaderFilter :visible="true" />
          <DxFilterRow :visible="true" />
          <DxGroupPanel
            :visible="true"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
          <DxScrolling mode="infinite" />
           <DxSorting mode="none" />
          <DxGrouping :auto-expand-all="true" />
          <DxEditing :allow-updating="false" mode="cell" />
   <DxColumn
            data-field="congdoan"
            caption="Công đoạn"
            :allowEditing="false"
            width="120"
          />
          <DxColumn
            data-field="sanpham"
            caption="Tên sản phẩm/Chi tiết"
            :allowEditing="false"
            cssclass="dx-group-row"
            width="360"
          />
         
          <DxColumn caption="Qui Cách" alignment="center" :allowEditing="false">
            <DxColumn
              caption="Dầy"
              data-field="HEIGHT"
              alignment="center"
              width="60"
              :allowEditing="false"
            />
            <DxColumn
              caption="Rộng"
              data-field="WIDTH"
              alignment="center"
              width="60"
              :allowEditing="false"
            />
            <DxColumn
              caption="Dài"
              data-field="LENGTH"
              alignment="center"
              width="60"
              :allowEditing="false"
            />
          </DxColumn>
          <DxColumn
            data-field="number"
            caption="Lệnh sản xuất"
            width="120"
            :allowEditing="false"
          />
           <DxColumn
            data-field="ngaysua"
            caption="Ngày sửa"
            width="180"
            format= "dd/MM/yyyy HH:mm:ssZ"
            dataType= "date"
            :allowEditing="false"
          />
          <DxColumn
            data-field="nguoisua"
            caption="Người sửa"
            width="180"
            :allowEditing="false"
          />
            <DxColumn caption="Chỉnh sửa" alignment="center" :allowEditing="false">
          <DxColumn
            data-field="keHoach"
            caption="Số Lượng theo LSX"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
            format="#,##0.####"
          />
      
      
        
           <DxColumn
            data-field="th"
            caption="QM"
            data-type="number"
            width="90"
            alignment="center"
            :allowEditing="true"
            format="#,##0"
          />
          <DxColumn
            data-field="ys1a"
            caption="YS1A"
            data-type="number"
            width="90"
            alignment="center"
            :allowEditing="true"
            format="#,##0"
          />
          <DxColumn
            data-field="ys1b"
            caption="YS1B"
            data-type="number"
            width="90"
            alignment="center"
            :allowEditing="true"
            format="#,##0"
          />
          <DxColumn
            data-field="tb"
            caption="TB"
            data-type="number"
            width="90"
            alignment="center"
            :allowEditing="true"
            format="#,##0"
          />
           <DxColumn
            data-field="namhong"
            caption="NH"
            data-type="number"
            width="90"
            alignment="center"
            :allowEditing="true"
            format="#,##0"
          />
            </DxColumn>
              <DxColumn
            data-field="updatekh"
            caption="Số lượng ban đầu"
            data-type="number"
            width="90"
            alignment="center"
            :allowEditing="true"
            format="#,##0"
          />
         
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'In KHSX'"
          />
       
           <template #changeColor="cell">
            <div 
           
              ><div class="text" style="border-radius:5px;width: 100% ; height:100% ; color:blue	 ; padding:5px">
                  <b v-if="cell.data.data.endPO==0" style="text-color:orange">Mở LSX</b>
                 
                </div> 
                <div class="text" style="border-radius:5px;width: 100% ; height:100% ; color:orange	 ; padding:5px">
                  
                  <b v-if="cell.data.data.endPO==1" style="text-color:orange">Đóng LSX</b>
                </div> 
            </div>
         
            </template>
        </DxDataGrid>
       
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxExport,
  DxLookup,
  DxFilterRow,
  DxSorting,
  DxEditing,
  DxColumnChooser,
  DxHeaderFilter,
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
    DxFilterRow,
    DxLookup,
    DxSorting,
    DxEditing,
    DxColumnChooser,
    DxHeaderFilter,
    DxGroupPanel,
    DxScrolling,
    DxGrouping,
  },
  computed: {
    ...mapGetters("lenhSanXuats", ["lenhSanXuats", "keHoachSanXuats"]),
    ...mapGetters("base", ["myFactoryInfor","userInfo"]),
    ...mapGetters("prod", ["factories"]),
  },
  methods: {
    ...mapActions("prod", ["updatesuaPO"]),
    ...mapActions("lenhSanXuats", [
      "getAllLenhSanXuats",
      "getLichsusuapo",
     
      "updatePo",
    ]),
    async rowUpdated() {
      console.log("OK");
    },
    //tìm kiếm theo tuần
    async searchWeek() {
      await this.functionSearch();
    },
    //function tìm kiếm chung ;
    async functionSearch() {
      console.log("factory", this.factory);
      let payload = {
        factoryId: this.factory.value,
        week: this.week,
        year: this.year
      };
      this.dataTotal = await this.getLichsusuapo(payload);   
       
        
    },
    //tìm kiếm theo tên nhà máy
    async searchFactory() {
      console.log("searchFactory");
      await this.functionSearch();
    },
  
    //tìm kiếm theo dòng sản phẩm
    async searchPO() {
      console.log("searchPO");
      await this.functionSearch();
    },
    //load data toàn hệ thống
    async loadData(stepId) {
      await this.functionSearch();
    },
   
  },
  data() {
    return {
      week: null,
      ngayDongGoi: null,
      dataTotal: null,
      factories1:null,
      xoa: false,
      goodsType: {
        label: "Indoor",
        value: "indoor",
        code: "indoor",
      },
       DONG:[
                {id:1,name:'Đóng LSX'},
                {id:0,name: 'Mở LSX'}
            ],
      goodsTypes: [
        {
          label: "Vanity",
          value: "vanity",
          code: "vanity",
        },
        {
          label: "Indoor",
          value: "indoor",
          code: "indoor",
        },
      ],
      factory: { label: "NM Thuận Hưng", value: 100000, code: "TH" },
    };
  },
  async created() {
       const today = new Date();
   
  const currentYear = today.getFullYear();
    this.year = currentYear;
    if (this.userInfo.id === 101967) {
      this.factories1 = this.factories.find((nm) => nm.factoryId === 100005);
      this.factory = this.factories1;
    } else if (this.userInfo.id === 101966) {
      this.factories1 = this.factories.filter(
        (nm) => nm.factoryId === 100003 || nm.factoryId === 100004
      );
      this.factory = this.factories1[0];
      console.log('d',this.factories1)
      console.log('f',this.factory)
    } else {this.factory = this.factories[0];
    this.factories1 = this.factories;}
    const { factoryId } = this.myFactoryInfor;

    this.ngayDongGoi = moment().format().slice(0, 10);
    this.week = this.ngayDongGoi ? moment(this.ngayDongGoi).format("w") : "";
    await this.loadData({ factoryId });
    // this.dataTotal = this.keHoachSanXuats;
  },
   
};
</script>
<style scoped>
#gridContainer {
  height: 800px;

}
</style>
