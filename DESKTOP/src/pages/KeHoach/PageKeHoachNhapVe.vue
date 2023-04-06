<template>
  <q-page>
    <!-- <q-banner class="text-primary">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div class="text-h6 q-mt-lg">
        Điều chỉnh kế hoạch ghép giữa các nhà máy
      </div>
    </q-banner> -->
    <div class="row" style="background-color: #daf8e1">
      <div class="col-6 text-blue text-bold" style="font-size: 18px">
        Điều chỉnh số liệu LSX trước khi phê duyệt
      </div>
    </div>
    <q-card>
      <div class="text-orange row widget-container">
        <div class="col-12 col-md-2 q-pa-sm">
          <q-select color="grey-3" label-color="orange" filled v-model="factory" @input="searchFactory"
            :options="factories" label="Chọn nhà máy" dense />
        </div>

        <div class="col-12 col-md-2 q-pa-sm">
          <q-input color="grey-3" label-color="orange" outlined @blur="searchWeek" v-model="week"
            :value="ngayDongGoi ? moment(ngayDongGoi).format('w') : ''" label="Tuần" dense>
            <template v-slot:append>
              <q-icon name="next_week" color="orange" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-2 q-pa-sm">
          <q-input filled label-color="orange" @blur="searchFactory" v-model.number="year" type="number" label="Năm"
            dense />
        </div>
         <div v-show="xoa" class="col-12 col-md-2 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            @input="changeNumber"
            v-model="number"
            :options="numbers"
            label="Chọn Lệnh sản xuất"
            dense
          />
        </div>
          <div v-show="xoa" class="col-12 col-md-2 q-pa-sm">
           <q-btn
            color="primary"
          
            :disable="!showEdit"
            label="Chuyển định tuyến"
            @click="isOpen = true"
          />
        </div>
        <div class="col-12 col-md-2 q-pa-sm">
          <q-btn v-if="isDelete" color="red" @click="deletePo" label="Xóa" />
        </div>
          <div v-show="xoa" class="col- 12 col-md-2 q-pa-sm">
            <q-select
            color="grey-3"
            label-color="orange"
            filled
            @input="changeFactorychuyen"
            v-model="factorychuyen"
            :options="factories"
            label="Chọn nhà máy chuyển"
            dense
          />
       </div>
      </div>
     
       <div v-show="xoa" class="row">
        <div class="col-5">
          <div class="row" style="margin-top: 30px">
            <div class="col-5 bs bg-brown-2" align="center">
              <p class="cssCongDoanOpen">Công đoạn cần chuyển</p>
            </div>
            <div class="col-5 bs bg-brown-2" align="center">
              <p class="cssCongDoanClose">Công đoạn chuyển</p>
            </div>
          </div>
          <div class="row">
            <div class="col-5 bs">
              <q-option-group
              @input="chuyencongdoan"
                :options="departmentOpens"
                type="radio"
                v-model="departmentClose"
              />
            </div>
            <div class="col-5 bs">
              <q-option-group
                :options="departmentCloses"
                type="radio"
                v-model="departmentOpen"
              />
            </div>
          </div>
        </div>
          <div v-show="xoa" class="col-6">
          <div style="margin-left:0px">
            <span style="font-size:20px;font-weight:bold;color:red">Sản phẩm cần chuyển</span>
          <DxDataGrid :data-source="poLogs" :show-borders="true"
            :word-wrap-enabled="true"
             :selection="{ mode: 'multiple' }"
          @selection-changed="onSelectionChanged">
            <DxEditing 
        :allow-updating="true"
        mode="cell" />
         <DxColumn cssClass="dongLenh" data-field="thanhpham" caption="Thành phẩm" :allowEditing="false"/>
            <DxColumn cssClass="dongLenh" data-field="NAME" caption="Tên chi tiết" :allowEditing="false"/>
            <DxColumn cssClass="dongLenh" data-field="congdoan" width="180" caption="Công đoạn" :allowEditing="false"/>
            <DxColumn cssClass="dongLenh" data-field="keHoach" width="100" caption="kế hoạch"  :allowEditing="false"/>
            <DxColumn cssClass="dongLenh" data-field="QUANTITY" width="100" caption="Số lượng đã làm" :allowEditing="false"/>
            <DxColumn cssClass="dongLenh" data-field="conlai" width="120" caption="Số lượng chuyển" :allowEditing="true"/>
      
          
          </DxDataGrid>
          </div>
          </div>
       </div>
     
      <q-card-section>
        <DxDataGrid id="gridContainer" :data-source="dataTotal" key-expr="id" :word-wrap-enabled="true"
          :hover-state-enabled="true" :row-alternation-enabled="true" :selection="{ mode: 'single' }"
          @row-updated="rowUpdated" @row-updating="rowUpdating" :selected-row-keys="selectedItemKeys"
          @selection-changed="selectionChanged">
          <DxColumnChooser :enabled="true" />
          <DxSelection mode="multiple" />
          <DxHeaderFilter :visible="true" />
          <DxGroupPanel :visible="true" :empty-panel-text="
            'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'
          " />
          <DxScrolling mode="infinite" />
          <DxSorting mode="none" />
          <DxGrouping :auto-expand-all="true" />
          <DxEditing :allow-updating="true" mode="cell" />

          <DxColumn data-field="id" caption="Mã" :allowEditing="false" :visible="false" />
          <DxColumn data-field="itemName" caption="Tên sản phẩm/Cụm/Chi tiết" width="350" :allowEditing="false" />
          <DxColumn data-field="market" caption="Mã tạo LSX" width="200" :allowEditing="false" />

          <DxColumn data-field="stepName" caption="Công đoạn" :group-index="1" :sort-index="1" sort-order="desc"
            :allowEditing="true" />
          <DxColumn caption="Qui Cách" alignment="center" :allowEditing="false">
            <DxColumn caption="Dầy" data-field="itemHeight" alignment="center" width="100" :allowEditing="false" />
            <DxColumn caption="Rộng" data-field="itemWidth" alignment="center" width="100" :allowEditing="false" />
            <DxColumn caption="Dài" data-field="itemLength" alignment="center" width="100" :allowEditing="false" />
          </DxColumn>
          <DxColumn data-field="number" caption="Lệnh sản xuất" width="150" :allowEditing="false" />
          <DxColumn data-field="keHoach" caption="Số lượng theo LSX" data-type="number" width="150" alignment="center"
            :allowEditing="true" format="#,##0.##" />
                <DxColumn
            data-field="th"
            caption="Ton"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
            :visible="true"
            format="#,##0.##"
          />
            
       <DxColumn
            data-field="canThucHien"
            caption="Số lượng cần thực hiện"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="false"
            format="#,##0.##"
          />
          <DxColumn data-field="Reason" caption="Lý do sửa LSX" width="150" alignment="center" :allowEditing="true" />
     
   <!--      <DxColumn
            data-field="soLuongUuTien"
            caption="Tồn"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
            :visible="true"
            format="#,##0.####"
          />
              <DxColumn
            data-field="th"
            caption="QM"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
            format="#,##0.####"
          />
          <DxColumn
            data-field="ys1a"
            caption="YS1A"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
            format="#,##0.####"
          />
          <DxColumn
            data-field="ys1b"
            caption="YS1B"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
            format="#,##0.####"
          />
          <DxColumn
            data-field="tb"
            caption="TB"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
            format="#,##0.####"
          />
            <DxColumn
            data-field="namhong"
            caption="Nam Hồng"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
            format="#,##0.####"
          /> -->
          <DxExport :enabled="true" :allow-export-selected-data="false" :file-name="'In KHSX'" />
          <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400" />
        </DxDataGrid>
      </q-card-section>
    </q-card>
       <q-dialog v-model="isOpen">
      <q-card style="min-width: 600px">
        <q-card-section class="row items-center">
          <div class="top-title">
            Bạn có thực sự muốn chuyển định tuyến ?
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Đồng ý"
            @click="openDepartment"
            color="positive"
            v-close-popup
          />
          <q-btn label="từ chối" color="orange" v-close-popup />
          
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import {
  showLoadingIos,
  closeLoading,
  showNotifySuccess,
  getWeekNumber,
  showNotifyValidate,
} from "../../ultils";
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxExport,
  DxSorting,
  DxEditing,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupPanel,
  DxScrolling,
  DxSelection,
  DxGrouping
} from "devextreme-vue/data-grid";
export default {
  // name: 'PageName',
  components: {
    DxDataGrid,
    DxColumn,
    DxSearchPanel,
    DxExport,
    DxEditing,
    DxSorting,
    DxColumnChooser,
    DxHeaderFilter,
    DxGroupPanel,
    DxScrolling,
    DxSelection,
    DxGrouping
  },
  computed: {
    ...mapGetters("lenhSanXuats", ["lenhSanXuats", "keHoachSanXuats"]),
    ...mapGetters("base", ["userInfo","myFactoryInfor","dsCongDoans"])
  },
  methods: {
    ...mapActions("lenhSanXuats", [
      "getAllLenhSanXuats",
      "getLenhSanXuatCapPhois",
      "getLenhSanXuatchuaduyet",
      "updatePo",
      "deletePoById"
    ]),
      ...mapActions("prod", ["getPermissionInScreen"]),
     ...mapActions("base", ["getAllDepartment", "getAllCongDoans"]),
      ...mapActions("po", [
      "getNumberstepId",
      "getNumberInLSX",
      "getDepartmentInLSX",
      "closeStepInLSX",
      "openStepInLSX",
      "updatedinhtuyen",
      "getPoLogByNumber",
    ]),
    async rowUpdated() {
      console.log("OK");
    },
    //tìm kiếm theo tuần
    async searchWeek() {
    // if (this.week < this.tuanht) this.week = this.tuanht
      await this.functionSearch();
    },
    //function tìm kiếm chung ;
    async functionSearch() {
      console.log("factory", this.factory);
      let payload = {
        factoryId: this.factory.value,
        year: this.year,
        week: this.week,
      };
      await this.getLenhSanXuatchuaduyet(payload);
     // await this.getLenhSanXuatCapPhoispheduyet(payload);
      this.loadNumber();
      if (this.factory.value == 100000) {
        this.dataTotal = await this.keHoachSanXuats.filter(e => {
          return (
            e.number.slice(0, 2) == "TH" && e.week.toString() == this.week && e.year.toString() == this.year
          );
        });

      } else if (this.factory.value == 100005) {

        this.dataTotal = await this.keHoachSanXuats.filter((e) => {
          return (
            e.number.slice(0, 2) == "TB" && e.week.toString() == this.week && e.year.toString() == this.year
          );
        });

      }
      else if (this.factory.value == 102427) {

        this.dataTotal = await this.keHoachSanXuats.filter(e => {
          return (
            e.number.slice(0, 2) == "QM" && e.week.toString() == this.week && e.year.toString() == this.year
          );
        });

      } else if (this.factory.value == 100004) {

        this.dataTotal = await this.keHoachSanXuats.filter(e => {
          return (
            e.number.slice(0, 3) == "YS1" && e.week.toString() == this.week && e.year.toString() == this.year
          );
        });
      }
      console.log("this.keHoachSanXuats", this.keHoachSanXuats);

    },
     async  chuyencongdoan() {
       
       let payload = {
           stepId:this.departmentClose,
           number:this.number.value
       }
        const data = await this.getNumberstepId(payload);
        this.poLogs = data.data
    },
              onSelectionChanged({ selectedRowsData }) {
     // this.idSelect = selectedRowsData[0].ID;
      this.showEdit = true;
      this.datachuyen = selectedRowsData;
   
    },
     async changeNumber() {
     this.departmentClose = [];
        this.departmentOpens = [];
        this.poLogs = [];
      const payload = {
        number: this.number.value,
      };
      const data = await this.getDepartmentInLSX(payload);
    //  this.loadPoLog();
      //this.departmentCloses = [];
     // this.departmentOpens = [];
      data.data.forEach((el) => {
   
          this.departmentOpens.push({
            label: el.NAME,
            value: el.ID,
          });
        
      });
    },
    async loadNumber() {
      const payload = {
        factoryId: this.factory.value,
        week: this.week,
        year: this.year,
      };
      const data = await this.getNumberInLSX(payload);
      this.numbers = [];
      data.data.forEach((el) => {
        this.numbers.push({
          label: el.number,
          value: el.number,
        });
      });
    },
        async openDepartment() {
    if (this.departmentOpen && this.datachuyen) {
        const payload = {
          number: this.number.value,
          stepIds: this.departmentClose,
          nextstepId: this.departmentOpen,
          accountId: this.userInfo.id,
          datachuyen:this.datachuyen,
       
        };
        const data = await this.updatedinhtuyen(payload);
          console.log('data:',data)
        if (data) {
          this.changeNumber();
         // this.changeLSX()
         // this.loadPoLog();
          this.departmentClose = [];
          this.departmentOpen = [];
          this.poLogs = [];
          this.datachuyen = [];
          showNotifySuccess("Chuyển thành công !");
        } else {
          showNotifyError();
        }
    } else {
         showNotifyValidate();
        }
    },
      async loadPermission() {
    
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.getPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((el) => {
      
        if (el.CODE == "update") {
          this.xoa = true;
        }
      
      });
    
    },
     async changeFactorychuyen(value) {
   
      await this.getAllCongDoans({ factoryId: value.code1 });
        let congdoan =    this.dsCongDoans
        .filter(
          (s) =>
            (s.type2 === "to")
        )
        .map((o) => ({
          label: o.name,
          value: o.id,
          code:o.code,
          description: `[${o.code}] ${o.name}`,
          icon: "mail",
          factoryId:o.factoryId
        }));
             let data = [];
               data = congdoan.filter(f=>f.factoryId == value.code1  )
     // }
      this.stepId = null;
      this.departmentCloses = data;
      console.log('cong doan:',this.departmentCloses)
        },
    async searchFactory() {
      if (this.year < this.namht) this.year = this.namht
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
    async rowUpdating(e) {
      const { newData, oldData } = e;
      const { namhong, th, ys1a, ys1b, tb, soLuongUuTien, factor, keHoach, Reason} = newData;
      const soLuongUuTienC = oldData.soLuongUuTien;
      const namhongC = oldData.namhong;
      const thC = oldData.th;
      const ys1aC = oldData.ys1a;
      const ys1bC = oldData.ys1b;
      const tbC = oldData.tb;
      if (namhong !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} nhập về: ${namhong}`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, namhongC },
            });
            console.log(ketqua);
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          });
      if (th !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} nhập về: ${th}`,
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, thC }
            });
            console.log(ketqua);
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          });
      if (ys1a !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} nhập về: ${ys1a}`,
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, ys1aC }
            });
            console.log(ketqua);
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          });
      if (ys1b !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} nhập về: ${ys1b}`,
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, ys1bC }
            });
            console.log(ketqua);
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          });
      if (tb !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} nhập về: ${tb}`,
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, tbC }
            });
            console.log(ketqua);
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          });
      if (soLuongUuTien !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} nhập về: ${soLuongUuTien}`,
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, soLuongUuTienC }
            });
            // console.log(ketqua);
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          });
      if (keHoach !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} kế hoạch: ${keHoach}`,
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: newData
            });
            console.log(ketqua);
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          });
          //Lý do sửa
      if (Reason !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} Lý do sửa: ${Reason}`,
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            const Reason = await this.updatePo({
              code: oldData.code,
              data: newData
            });
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          });
      if (factor !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} hệ số phôi: ${factor}`,
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: newData
            });
            console.log(ketqua);
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          });
    },
    async deletePo() {
      if (this.poIds.poId.length > 0) {
        this.poIds.poId.forEach(el => {
          this.deletePoById({ id: el })
        });
        this.loadData();
      }
    }
  },
  data() {
    return {
      week: null,
      year: null,
      ngayDongGoi: null,
      dataTotal: null,
      goodsType: {
        label: "Indoor",
        value: "indoor",
        code: "indoor"
      },
        showEdit:false,
       factorychuyen: null,
       isOpen:false,
      numbers:[],
       departmentCloses: [],
      departmentOpens: [],
      departmentClose: [],
      departmentOpen: [],
      xoa:false,
      goodsTypes: [
        {
          label: "Vanity",
          value: "vanity",
          code: "vanity"
        },
        {
          label: "Indoor",
          value: "indoor",
          code: "indoor"
        }
      ],
      factory: { label: "Nhà máy CBG Thuận Hưng", value: 100000, code: "TH" },
      factories: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          value: 100000,
          code: "TH",
             code1: 100000,
        },

        // {
        //   label: "Nhà máy CBG Yên Sơn 1",
        //   value: 100003,
        //   code: "YS1A"
        // },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          value: 100004,
          code: "YS1",
            code1: 102340,
        },
        // {
        //   label: "Nhà máy CBG Quang Minh",
        //   value: 102427,
        //   code: "QM"
        // },
        {
          label: "Nhà máy CBG Thái Bình",
          value: 100005,
          code: "TB",
            code1: 102366,
        }
      ],
      selectedItemKeys: [],
      selectionChanged: (data) => {
        const poId = data.selectedRowsData.map((row) => `${row.id}`);
        this.poIds = { poId };
        console.log("poId", poId);
        if (this.poIds.poId.length > 0) {
          this.isDelete = true;
        } else {
          this.isDelete = false;
        }
      },
      poIds: [],
      isDelete: false
    };
  },
  async created() {
    this.loadPermission();
    const today = new Date();
    this.tuanht = getWeekNumber(today);
    const { factoryId } = this.myFactoryInfor;
    const currentYear = today.getFullYear();
    this.year = currentYear;
    this.namht = currentYear;
    this.ngayDongGoi = moment()
      .format()
      .slice(0, 10);
    this.week = this.ngayDongGoi ? moment(this.ngayDongGoi).format("w") : "";
    await this.loadData({ factoryId });
    // this.dataTotal = this.keHoachSanXuats;
  }
};
</script>
<style scoped>
#gridContainer {
  height: 600px;
}
.cssCongDoanOpen {
  font-size: 24px;
  font-weight: bold;
  color: #21ba45;
  margin: 0px;
}
.cssCongDoanClose {
  font-size: 24px;
  font-weight: bold;
  color: #f57c00;
  margin: 0px;
}
</style>
