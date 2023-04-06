<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row print-hide" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Biên bản xác nhận nhận phôi của <b>Nhà máy CBG Thuận Hưng </b> từ
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

    <q-card class="my-card">
      <q-separator inset />
      <q-card-section>
        <div class="q-pa-md">
          <div class="row">
            <q-select
              class="col-2 q-ml-sm"
              outlined
              dense
              v-model="factory"
              :options="options"
              @input="onChange"
              label="Phôi nhận từ nhà máy"
            />
            <q-btn
              class="col-2 q-ml-sm"
              style="height:39px; margin-right:50px"
              dense
              color="primary"
              v-show="khoxn"
              :disable="!showEdit"
              label="Thủ kho xác nhận"
              @click="pheduyet"
            />
            <q-btn
              class="col-2 q-ml-sm"
              style="height:39px; margin-right:50px"
              color="orange"
              dense
              v-show="SXxn"
              :disable="!showSX"
              label="SX xác nhận"
              @click="sxxacnhan"
            />
             <q-btn
              class="col-2 q-ml-sm"
              style="height:39px; margin-right:50px"
              color="grey"
              v-show="bengiaoxn"
              :disable="!bengiao"
              label="Bên giao xác nhận lại"
              @click="bengiaoxacnhan"
            />
            <q-btn
            v-if="isInsert"
            class="col-1 q-ml-sm"
            style="height:39px; margin-right:50px"
            color="positive"
            label="Tạo phiếu"
            @click="onSelectionCreate"
          />
          <div class="col-1 q-ml-sm">
            <q-input
            v-if="isInsert"
              color="grey-3"
              readonly
              label-color="orange"
              outlined
              v-model="code"
              label="Mã biên bản"
              dense
            >
            </q-input>
          </div>
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
              :data-source="sanLuongs1"
              :show-borders="true"
              :show-row-lines="true"
              :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
              :show-column-lines="true"
              :allow-column-resizing="true"
              :selection="{ mode: 'multiple' }"
              @selection-changed="onSelectionChanged"
            >
              <DxEditing :allow-updating="true" mode="cell" />
              <DxColumnChooser :enabled="true" />
              <DxHeaderFilter :visible="true" />
              <!-- <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              /> -->
              <DxGrouping :auto-expand-all="true" />
              <!-- <DxColumn data-field="ID" caption="#" /> -->
                <DxColumn
                data-field="TONG"
                caption="Tổng"
                :group-index="0"
                width="200"
              />
              <DxColumn
                data-field="congdoangiao"
                caption="Công đoạn giao"
                width="120"
              />

              <DxColumn data-field="NAME" caption="Chi tiết" width="380" />
              <DxColumn caption="Qui Cách" alignment="center">
                <DxColumn
                  caption="Dầy"
                  data-field="HEIGHT"
                  format="fixedPoint"
                  alignment="center"
                  width="60"
                />
                <DxColumn
                  caption="Rộng"
                  data-field="WIDTH"
                  format="fixedPoint"
                  alignment="center"
                  width="60"
                />
                <DxColumn
                  caption="Dài"
                  data-field="LENGTH"
                  format="fixedPoint"
                  alignment="center"
                  width="60"
                />
              </DxColumn>
              <DxColumn
                data-field="QUANTITY"
                caption="Số lượng giao"
                data-type="number"
                format="#,##0.####"
                width="100"
                 alignment="left"
              />
              <DxColumn
                data-field="CREATE_DATE"
                caption="Ngày giao"
                width="180"
                alignment="left"
                 format="dd/MM/yyyy HH:mm:ssz"
              
              />
               <DxColumn
                data-field="CREATE_BY"
                caption="Bên giao xác nhận"
                width="140"
                 alignment="left"
                cell-template="cellTemplategiao"
              />
              <DxColumn
                data-field="QUANTITYNHAN"
                caption="Số lượng nhận thực tế"
                data-type="number"
                format="#,##0.####"
                width="120"
                 alignment="left"
              />
               <DxColumn
                data-field="VERIFY_DATE"
                caption="Ngày kho nhận"
                width="160"
                format="dd/MM/yyyy HH:mm:ssz"
            
              />
                 <DxColumn
                data-field="GHICHU"
                caption="Ghi chú"
                  width="120"
              />
                 
              <DxColumn
                caption="Công đoạn nhận"
                data-field="noiden"
                alignment="center"
                width="250"
                :visible="!khoxn"
              >
                <DxLookup
                  :data-source="dongsanpham"
                  display-expr="NAME"
                  value-expr="ID"
                />
              </DxColumn>
               <DxColumn caption="Bên nhận" alignment="center">
              <DxColumn
                data-field="VERIFY_BY"
                caption="Thủ kho xác nhận"
                width="160"
                cell-template="cellTemplate"
              />
              <DxColumn
                data-field="SX_VERIFY_BY"
                caption="SX xác nhận"
                width="160"
                cell-template="cellTemplateSX"
              />
               </DxColumn>
               <DxColumn
                alignment="center"
                caption="Từ chối"
                width="100"
                cell-template="delete-cell"
              />
              <template #delete-cell="cell">
        <span v-if="!cell.data.data.VERIFY_BY && khoxn" class="fake-link" @click="onDelete(cell)">Từ chối</span>
      </template>
      <DxColumn
                data-field="CODE"
                caption="Mã phiếu"
                  width="120"
              />
              <DxSummary>
               <DxGroupItem
                  column="QUANTITY"
                  summary-type="sum"
                  data-type="number"
                :show-in-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'fixedpoint'"
                />
                 <DxGroupItem
                  column="QUANTITYNHAN"
                  summary-type="sum"
                  data-type="number"
                :show-in-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'fixedpoint'"
                />
              </DxSummary>
              <!-- <DxSummary>
                <DxGroupItem
                  column="tongKL"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'fixedpoint'"
                />
              </DxSummary> -->
              <template #cellTemplate="cell">
                <div v-if="cell.data.value == null">Chưa nhận</div>
                <div v-else>Kho đã xác nhận</div>
              </template>
              <template #cellTemplateSX="cell">
                <div v-if="cell.data.value == null">Chưa nhận</div>
                <div v-else>đã nhận</div>
              </template>
              <template #cellTemplategiao="cell">
                <div v-if="cell.data.data.QUANTITYNHAN !=null && cell.data.data.QUANTITY-cell.data.data.QUANTITYNHAN !=0">Chưa xác nhận</div>
                <div v-else>Đã xác nhận</div>
              </template>
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
import { mapGetters, mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxEditing,
  DxLookup,
  DxPaging,
  DxTotalItem,
  DxSearchPanel,
  DxExport,
  DxSummary,
  DxGroupItem,
  DxHeaderFilter,
  DxColumnChooser,
} from "devextreme-vue/data-grid";
import DialogSelectDate from "../components/commons/DialogSelectFromDateToDate";
import { showNotifySuccess, showNotifyError } from "../ultils";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../ultils";
import moment from "moment";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxTotalItem,
    DxLookup,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxExport,
    DialogSelectDate,
    DxSummary,
    DxGroupItem,
    DxHeaderFilter,
    DxColumnChooser,
  },
  data() {
    return {
      factory: null,
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      datanhan: [],
      code: null,
      options: [
        {
          label: "Nhà máy CBG Yên Sơn 1",
          location: "Yên Sơn - Tuyên Quang",
          code: "YS1",
          id: 100004,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          location: "Thái Bình",
          code: "TB",
          id: 100005,
        },
         {
          label: "Nhà máy YS2",
          location: "Yên sơn 2",
          code: "YS2",
          id: 102451,
        },
        {
          label: "Mua ngoài",
          location: "Mua ngoài",
          code: "MN",
          id: 999999,
        },
      ],
      dongsanpham: [],
      showChooseDate: false,
      bengiaoxn:true,
      sanLuongs: [],
      sanLuongssx:[],
      sanLuongs1:[],
      sanLuongst:[],
      xacnhankho:true,
      khoxn: true,
      SXxn: true,
      bengiao:false,
      showEdit: false,
      showSX: false,
      dataSource: [],
      fromDate: null,
      toDate: null,
      listSelect: [],
      verifyDate: null,
    };
  },
  computed: {
    ...mapGetters("base", [
      "opCongDoans",
      "myFactoryInfor",
      "userInfo",
      "dsCongDoans",
    ]),
    ...mapGetters("prod", ["factories"]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  created() {
    this.loadPermission();
    if (
      this.$store.state.base.userInfo.id == 101662 
    ) {
      this.khoxn = true;
      this.SXxn = false;
      this.bengiaoxn = false
      this.sanLuongs1 = this.sanLuongst
    } else {
      this.khoxn = false;
      this.SXxn = true;
      this.bengiaoxn = true
      this.sanLuongs1 = this.sanLuongssx
    }
    if(this.$store.state.base.userInfo.id == 102089 || this.$store.state.base.userInfo.id == 100400 || this.isUpdate)
    {
       this.khoxn = false;
      this.SXxn = true;
      this.bengiaoxn = true
           this.sanLuongs1 = this.sanLuongst
    }
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.loadDepartmentTH();
  },
  methods: {
    ...mapActions("base", ["getAllCongDoans"]),
    ...mapActions("sanxuat", ["getAllnhanNM","getAllnhanmuangoai"]),
    ...mapActions("prod", [
      "getCodeInPhieuNhanPhoi",
      "insertPhieuNhanPhoi",
      "getPermissionInScreen"
    ]),
    async loadPermission() {
      console.log("router dinh tuyen", this.$route.path);
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.getPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((el) => {
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
    async onDelete(e) {
      const payload = {
        packageId: e.data.data.ID,
      };
      let data = await this.$store.dispatch(
        "prod/DELETE_REPORT_RESULT_DETAIL",
        payload
      );
      
      if (data.meta.success) {
        const payload2 = {
          packageId: e.data.data.ID,
          itemInPackageId: data.data[0].ID,
        };
        let data2 = await this.$store.dispatch(
          "prod/DELETE_REPORT_RESULT_DETAIL2",
          payload2
        );
        console.log("data2", data2);
        if (data2.meta.success) {
          showNotifySuccess();
        } else {
          showNotifyError();
        }
      }
        this.load(this.factory.id);
    },
    async loadDepartmentTH(){
      this.dongsanpham = [];
      const data = await this.$store.dispatch("nlg/GET_DEPARTMENT_TH");
      this.dongsanpham = data.data;
      console.log("departmentTH", data);
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.load(this.factory.id);
    },
    onSelectionChanged({ selectedRowsData }) {
      this.idSelect = selectedRowsData[0].ID;
      console.log("selectedRowsData[0]", selectedRowsData[0])
      this.verifyDate = moment(selectedRowsData[0].VERIFY_DATE).format("DD/MM/YYYY");
      this.showSX = true;
      this.showEdit = true;
      this.bengiao = true;
      this.datanhan = selectedRowsData;
      this.listSelect = [];
      if (selectedRowsData.length > 0) {
        selectedRowsData.forEach((el) => {
          this.listSelect.push({ id: el.ID });
        });
      }
    },
    async pheduyet() {
      const payload = {
        createBy: this.$store.state.base.userInfo.id,
        datanhan: this.datanhan,
      };
      const data = await this.$store.dispatch("nlg/XAC_NHAN_KHO_BTP", payload);
      if (data.meta.success) {
        await this.load(this.factory.id);
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
    async bengiaoxacnhan(){

          const payload = {
        createBy: this.$store.state.base.userInfo.id,
        datanhan: this.datanhan,
      };
      const data = await this.$store.dispatch("nlg/XAC_NHAN_BG", payload);
       if (data.meta.success) {
        await this.load(this.factory.id);
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    
    },
    async sxxacnhan() {
      this.xacnhankho = true
      this.datanhan.forEach(e =>{
        if(e.VERIFY_BY == null)
        this.xacnhankho = false
      })
      console.log('kh xac nhan:',this.xacnhankho)
      if (this.xacnhankho == false) {
             this.$q.dialog({
          html: true,
          title: "Sản xuất nhận",
          message:
            "Có chi tiết kho chưa nhận đề nghị liên hệ kho BTP"    
             })
      } else {
        if (this.factory.id === 999999){
          const payload = {
        createBy: this.$store.state.base.userInfo.id,
        datanhan: this.datanhan,
      };
      const data = await this.$store.dispatch("nlg/XAC_NHAN_SX_MUA_NGOAI", payload);
      if (data.meta.success) {
        await this.load(this.factory.id);
        showNotifySuccess();
      } else {
        showNotifyError();
      }
        } else {
      const payload = {
        createBy: this.$store.state.base.userInfo.id,
        datanhan: this.datanhan,
      };
      const data = await this.$store.dispatch("nlg/XAC_NHAN_SX", payload);
      if (data.meta.success) {
        await this.load(this.factory.id);
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    }
    }
    },
    async onSelectionCreate(){
      const payload = {
        location: this.factory.location,
        code: this.code,
        ngayNhap: this.verifyDate,
        packageIds: this.listSelect,
        factoryId: this.factory.id,
        accountId: this.userInfo.id
      };
      const data = await this.insertPhieuNhanPhoi(payload);
      if(data.meta.success){
        showNotifySuccess();
        await this.onChange(this.factory);
      }else{
        showNotifyError();
      }
    },
    async onChange(value) {
      await this.load(value.id);
      let data = await this.getCodeInPhieuNhanPhoi();
      if(data.data.length == 0){
        this.code = `TH-${moment().month()+1}-000001`;
      }else{
        let number = data.data[0].CODE;
        let length = number.length;
        number = number.substring(length - 6, number.length);
        console.log("number", number);
        number = parseInt(number);
        number = number + 1;
        let value = "";
        if (number < 10) {
          value = "00000" + number.toString();
        } else if (number < 100) {
          value = "0000" + number.toString();
        } else if (number < 1000) {
          value = "000" + number.toString();
        } else if (number < 10000) {
          value = "00" + number.toString();
        } else if (number < 100000) {
          value = "0" + number.toString();
        } else {
          value = number.toString();
        }
        this.code = `TH-${moment().month()+1}-${value}`;
      }
    },
    async load(departmentId) {
      this.sanLuongst = [];
      this.sanLuongssx=[];
      let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).add(1, "day").format("YYYY-MM-DD 00:00:00"),
        departmentId,
      };
      if(departmentId === 999999){
        this.sanLuongs = await this.getAllnhanmuangoai(payload);
        this.sanLuongs.forEach(e => {
           this.sanLuongst.push(e)
        if (e.noiden == 102778) this.sanLuongssx.push(e)
      //  else this.sanLuongst.push(e)
      })
      if(this.$store.state.base.userInfo.id == 102089 || this.$store.state.base.userInfo.id == 100400
        || this.$store.state.base.userInfo.id == 101662 || this.isUpdate)
      this.sanLuongs1 = this.sanLuongst
     else     this.sanLuongs1 = this.sanLuongssx
      }
else {
      this.sanLuongs = await this.getAllnhanNM(payload);

      this.sanLuongs.forEach(e => {
           this.sanLuongst.push(e)
        if (e.noiden == null) this.sanLuongssx.push(e)
      //  else this.sanLuongst.push(e)
      })
        if(this.$store.state.base.userInfo.id == 102089 || this.$store.state.base.userInfo.id == 100400
        || this.$store.state.base.userInfo.id == 101662 || this.isUpdate)
      this.sanLuongs1 = this.sanLuongst
     else     this.sanLuongs1 = this.sanLuongssx
    }
    },
  
  },
};
</script>

<style>
</style>