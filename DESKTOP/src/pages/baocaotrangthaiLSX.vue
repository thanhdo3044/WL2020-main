<template>
  <q-page >
    <q-banner class="text-primary row print-hide" >
      <template v-slot:avatar >
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div class="text-h6 q-mt-lg ">
        <b> TRẠNG THÁI LỆNH SẢN XUẤT </b>
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
            data-field="number"
            caption="Lệnh sản xuất"
            width="120"
            :allowEditing="false"
          />
           <DxColumn
            data-field="createdAt"
            caption="Ngày tạo"
            width="180"
            format= "dd/MM/yyyy"
            dataType= "date"
            :allowEditing="false"
          />
          <DxColumn
             data-field="KH_approvedAt"
            caption="Ngày KH duyệt"
            width="180"
            format= "dd/MM/yyyy "
            dataType= "date"
            :allowEditing="false"
          />
              <DxColumn
             data-field="sxduyet"
            caption="Ngày SX duyệt"
            width="180"
            format= "dd/MM/yyyy "
            dataType= "date"
            :allowEditing="false"
          />
       <DxColumn
                data-field="pcd"
                caption="Phiếu chỉ định"
                  width="160"
         cell-template="cellTemplate"
              
              />
           <DxColumn
             data-field="approvedAt"
            caption="Ngày duyệt phiếu CĐ"
            width="180"
            format= "dd/MM/yyyy "
            dataType= "date"
            :allowEditing="false"
          />
           <DxColumn
                data-field="khosausay"
                caption="Kho sau sấy"
                  width="160"
         cell-template="cellTemplatekho"
              
              />
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'In KHSX'"
          />
       
              <template #cellTemplate="cell">
               <div v-if="cell.data.value == null">Chưa tạo</div>
               <div v-else>đã tạo</div>
            </template>
              <template #cellTemplatekho="cell">
               <div v-if="cell.data.value == null">Chưa cấp gỗ</div>
               <div v-else>đã cấp gỗ</div>
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
      "trangthaiLSX",
     
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
      this.dataTotal = await this.trangthaiLSX(payload);   
       
        
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
      week: moment().format("w"),
      ngayDongGoi: null,
      dataTotal: null,
      factories1:null,
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
    const { factoryId } = 100000;

    this.ngayDongGoi = moment().format().slice(0, 10);
    this.week =  moment().format("w");
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
