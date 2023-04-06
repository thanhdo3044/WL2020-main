<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section >
        <div class="row">
          <div class="col-6 top-title ">
            Báo cáo nhập xuất chi tiết theo lệnh -
            {{ factory ? factory.label : "" }}
          </div>
           <div
            class="col-6 top-title cursor-pointer text-orange"
            align="right"
            @click="showChooseDate = true"
          >
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
          </div>
           </div>
            <div class="text-orange row widget-container">
    <div class="col-3 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="factory"
            :options="options"
            label="Chọn Nhà Máy"
            @input="loadDepartment"
            dense
          />
        </div>
         
       </div>
                
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <!-- <q-select class="col-6 q-mb-sm" @input="load" outlined v-model="idDepartment" :options="options" label="Chọn nhà máy" /> -->
         <div class="row">
          <div class="col-2 col-md-2">
            <q-checkbox
              v-if="factory"
              @input="selectAll()"
              dense
              color="teal"
              style="color: #21ba45; font-weight: bold; padding-top: 10px"
              v-model="allDepartment"
              label="Chọn tất cả công đoạn"
            />
          </div>

        </div>
        <hr v-if="factory" />
        <div class="row">
          <div
            class="col-2 col-md-2"
            v-for="congDoan in departments"
            :key="congDoan.id"
          >
            <q-checkbox
              v-if="congDoan.id != 102484 && congDoan.id != 102490"
              dense
              v-model="chonCongDoans"
              :val="congDoan.name"
              :label="congDoan.name"
              color="teal"
            />
          </div>
        </div>
        <hr v-if="factory" />
        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
              :data-source="dataSourcefilter"
              :columns="columns"
              :show-borders="true"
              :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
              :show-column-lines="true"
              :allow-column-resizing="true"
              @row-updated="confirmSaveStock"
               @row-removed="del"
              
            >
              <DxEditing
                :refresh-mode="refreshMode"
                :allow-adding="false"
                :allow-updating="isUpdate"
                :allow-deleting="isDelete"
                mode="row"
              />
              <DxColumnChooser :enabled="true" />
              <DxHeaderFilter :visible="true" />
               <DxScrolling mode="infinite" />
              <DxSorting mode="none" />
              <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              />
              <DxGrouping :auto-expand-all="true" />
              
                <DxColumn
              data-field="congdoan"
              caption="Công đoạn"
              :group-index="0"
              
            />
          
               <DxColumn data-field="NAME" caption="Chi tiết"  :group-index="2"/>
               <DxColumn data-field="NAME" caption="Tên"   width="350"/>
              <DxColumn caption="Qui Cách" alignment="center">
                <DxColumn
                  caption="Dầy"
                  data-field="HEIGHT"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  caption="Rộng"
                  data-field="WIDTH"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
                <DxColumn
                  caption="Dài"
                  data-field="LENGTH"
                  format="fixedPoint"
                  alignment="center"
                  width="90"
                />
              </DxColumn>
              <DxColumn
                data-field="nhap"
                caption="Nhập về"
                data-type="number"
                format="#,##0.00"
                width="100"
              />
                <DxColumn
                data-field="xuat"
                caption="Xuất"
                data-type="number"
                format="#,##0.00"
                width="100"
              />
                  <DxColumn
                data-field="number"
                caption="LSX"
             width="160"
              />  
              
              <DxSummary>
                <DxGroupItem
                  column="nhap"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.00'"
                />
                   <DxGroupItem
                  column="xuat"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.00'"
                />
              </DxSummary>
              <DxExport
                :enabled="true"
                :allow-export-selected-data="false"
                :file-name="
                  'Dữ liệu sản xuất chi tiết từ ngày ' +
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
            </DxDataGrid>
          </div>
        </div>
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
import { QSpinnerFacebook } from "quasar";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxSorting,
  DxScrolling,
  DxPaging,
  DxSearchPanel,
  DxExport,
  DxSummary,
  DxGroupItem,
  DxHeaderFilter,
  DxColumnChooser,
  DxEditing,
} from "devextreme-vue/data-grid";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxSorting,
    DxScrolling,
    DxPaging,
    DxSearchPanel,
    DxExport,
    DialogSelectDate,
    DxSummary,
    DxGroupItem,
    DxHeaderFilter,
    DxColumnChooser,
    DxEditing,
  },
  data() {
    return {
      showChooseDate: false,
      factory:{
         id: 100000,
          label: "Nhà máy CBG Thuận Hưng",
      },
         factory1: null,         
      options: [
        {
          id: 100000,
          label: "Nhà máy CBG Thuận Hưng",
        },
        {
          id: 102340,
          label: "Nhà máy CBG Yên Sơn 1",
        },
        {
          id: 102366,
          label: "Nhà máy CBG Thái Bình",
        },
      ],
      idDepartment: null,
      chonCongDoans: [],
      departments: [],
      allDepartment: false,
      dataSource: [],
      refreshMode: "full",

    //   columns: [
    //     // {
    //     //   dataField: "Năm",
    //     //    width:'80',
    //     // },
    //     ,
    //     //  {
    //     //   dataField: "Tuần", 
    //     //    width:'100',
    //     // },
        
    //     // {
    //     //   dataField: "Thứ",
          
    //     //    width:'80',
    //     // },
    //     {
    //       dataField: "ITEM_ID",
    //        caption: "ITEM_ID",
    //        width:'80',
    //     },
    //     {
    //       dataField: "Nhóm",
    //       visible: false,
    //     },
    //      {
    //       dataField: "Chi tiết/cụm", 
    //        width:'350',
    //     },
    //     ,
    //       {
    //       dataField: "LENGTH",
    //       caption: "DÀI",
    //        width:'80',
    //     },
        
    //        {
    //       dataField: "WIDTH",
    //       caption: "Rộng",
    //        width:'80',
    //     },
    //       {
    //       dataField: "HEIGHT",
    //       caption: "DÀY",
    //        width:'80',
    //     },
    //     {
    //       dataField: "unit",
    //       caption: "Đơn vị",
    //        width:'80',
    //     },
    //     {
    //       dataField: "Nơi xuất",
    //       visible: false,
    //     },
    //     {
    //       dataField: "Đạt",
    //       visible: false,
    //       dataType: "number",
    //       format: "##0.##",
    //     },
    //     {
    //       dataField: "Không đạt",
    //       visible: false,
    //       dataType: "number",
    //       format: "fixedpoint",
    //     },
    //     {
    //       dataField: "Số lượng",
    //       dataType: "number",
    //       format: "#,##0.##",
    //        width:'100',
    //     },
    //       {
    //       dataField: "LOAIQC",
    //       caption: "Loại QC",
    //        width:'130',
    //     },
    //      {
    //       dataField: "Nguồn Phôi", 
    //        width:'160',
    //     },
    //      {
    //       dataField:  "Người nhập", 
    //        width:'160',
    //     },
        
       
    //     {
    //       dataField: "Ngày giờ nhập",
    //       format: "dd/MM/yyyy HH:mm:ssZ",
    //       dataType: "date",
    //       width:'200',
    //     },
    //   ],
      fromDate: null,
      toDate: null,
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      isApprove: false,
      isReject: false,
    };
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
    ...mapGetters("prod", ["factories"]),
    ...mapGetters("base", ["congDoans","myFactoryInfor", "userInfo"]),
       dataSourcefilter() {
    
      return this.dataSource.filter((i) =>
        this.chonCongDoans.includes(i.congdoan)
      );
    }
  },
  created() {
    this.loadPermission();
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());

    this.loadDepartment()
    this.load();
  },
  methods: {
    ...mapActions("production", ["UPDATE_STOCK","DEL_STOCK"]),
    ...mapActions("prod", [
      
      "getPermissionInScreen",
       "getDepartmentByFactoryId",
      "getSLTheoThangSL",
      "getSLTheoThangM3",
    ]),

     async selectAll() {
      if (this.allDepartment) {
        this.chonCongDoans = [];
        
        this.departments.forEach((el) => {
          this.chonCongDoans.push(el.name);
        });
        
      } else {
        this.chonCongDoans = [];
      }
    },
    
       async loadDepartment() {
      let data = await this.getDepartmentByFactoryId({
        factoryId: this.factory.id,
      });
      // this.departments = data.data;
      this.departments = data.data.filter(d => d.type == 'Tổ');
      
      this.allDepartment = false;
      this.chonCongDoans = [];
      // await this.load(value.id);
      
    },
    checkDepartment(name){
      let data = null;
      data = this.dataSource.find(s => s.tonhom == name);
      if(data){
        return true;
      }else{
        return false;
      }
    },

    async loadPermission() {
      console.log("path", this.$route.path);
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.getPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((el) => {
        if (el.CODE == "approve") {
          this.isApprove = true;
        }
        if (el.CODE == "reject") {
          this.isReject = true;
        }
        if (el.CODE == "insert") {
          this.isInsert = true;
        }
        if (el.CODE == "update") {
          this.isUpdate = true;
        }
        if (el.CODE == "delete") {
          this.isDelete = true;
        }
      });
      console.log("listPermission", this.listPermission);
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async confirmSaveStock(e) {
      let a = "Số lượng";
      let b = "Ngày giờ nhập"
      let quantity = e.data[a];
      let ngay = e.data[b];
      const payload = { quantity,ngay,ID: e.data.ID };
      console.log(payload);
      const data = await this.UPDATE_STOCK(payload);
      if (data) {
        this.$q.dialog({
          title: "Thành công ",
          message: "Sửa thành công !",
        });
        this.load()
      } else {
        this.$q.dialog({
          title: "Lỗi",
          message: "Có lỗi xảy ra !",
        });
      }
    },
     async del(e){
    
  const payload = {  ID: e.data.ID };
    const data = await this.DEL_STOCK(payload);
     },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.load();
    },
      async onChange(value) { this.factory = value.id 
      this.load();
      console.log('nha máy:',this.factory)},
    async load() {
      // const myFactoryId = this.myFactoryInfor.id;
      // if (myFactoryId) {
      //   let payload = {
      //     fromDate: formatDateISO(this.fromDate),
      //     toDate: formatDateISO(this.toDate),
      //     factoryId: myFactoryId,
      //   };
      //   const data = await this.$store.dispatch(
      //     "prod/GET_REPORT_TON_DETAIL",
      //     payload
      //   );
      //   this.dataSource = data.data;
      // }
     
      let payload = {
        fromDate: formatDateISO(this.fromDate),
        toDate: formatDateISO(this.toDate),
        departmentId:this.factory.id
      };
      this.$q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: "yellow",
        spinnerSize: 140,
        backgroundColor: "purple",
        message: "Đang tải dữ liệu - Vui lòng chờ trong giây lát !",
        messageColor: "black",
      });
      let data = await this.$store.dispatch(
        "prod/GET_REPORT_NHAP_XUAT_CT",
        payload
      );
      data.data.map(e => {
        if(e.DEPARTMENT_ID == 102484)
          e.unit = 'M3'
      })
      this.dataSource = data.data;
      this.loadDepartment();
      console.log("data soure", this.dataSource)
      this.$q.loading.hide();
    },
  },
};
</script>

<style>
</style>