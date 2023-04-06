<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary print-hide">
      <div class="row">
        <div class="col-6 top-title text-orange">
          Chuyển kế hoạch lệnh sản xuất
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-12 col-md-2 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            @input="changeFactory"
            v-model="factory"
            :options="options"
            label="Chọn nhà máy"
            dense
          />
        </div>
        <div class="col-12 col-md-2 q-pa-sm">
          <q-input
            filled
            label-color="orange"
            @input="changeWeek"
            v-model.number="week"
            type="number"
            label="Tuần"
            dense
          />
        </div>
        <div class="col-12 col-md-2 q-pa-sm">
          <q-input
            filled
            label-color="orange"
            v-model.number="year"
            type="number"
            label="Năm"
            @input="changeWeek"
            dense
            
          />
        </div>
        <div class="col-12 col-md-2 q-pa-sm">
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
        <div class="col-12 col-md-2 q-pa-sm">
           <q-btn
            color="primary"
          
            :disable="!showEdit"
            label="Chuyển định tuyến"
            @click="isOpen = true"
          />
        </div>
          <div class="col-12 col-md-2 q-pa-sm">
           <q-btn
            color="primary"
          
            v-show="dinhtuyen"
            label="Update lại định tuyến LSX"
            @click="updatedinhtuyenlsx"
          />
        </div>
         <div class="col- 12 col-md-2 q-pa-sm">
            <q-select
            color="grey-3"
            label-color="orange"
            filled
            @input="changeFactorychuyen"
            v-model="factorychuyen"
            :options="options"
            label="Chọn nhà máy chuyển"
            dense
          />
      </div>
      </div>
     
      <div class="row">
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
          <!-- <div class="row">
            <div class="col-6">
              <q-btn
                v-if="departmentClose.length != 0"
                color="orange"
                @click="showClose"
                label="Đóng LSX"
              />
            </div>
            <div class="col-6">
              <q-btn
                v-if="departmentOpen.length != 0"
                class="col-6"
                color="positive"
                @click="showOpen"
                label="Mở LSX"
              />
            </div>
          </div> -->
        </div>
        
        <div class="col-6">
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
        <div>
          
        <DxDataGrid
          id="gridContainer"
          :data-source="getPheDuyets(number.value)"
          key-expr="id"
          :word-wrap-enabled="true"
          :hover-state-enabled="true"
          :row-alternation-enabled="true"
          :selection="{ mode: 'single' }"
         
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
          <DxEditing :allow-updating="xoa" mode="cell" />
          <DxColumn
            data-field="itemId"
            caption="Mã ID"
            width="70"
            :allowEditing="false"
          />
          <DxColumn
            data-field="itemName"
            caption="Tên sản phẩm/Chi tiết"
            :allowEditing="false"
            cssclass="dx-group-row"
            width="360"
          />
          <!-- <DxColumn
            data-field="market"
            caption="Mã tạo LSX"
            width="100"
            :allowEditing="false"
          /> -->

          <DxColumn
            data-field="stepName"
            caption="Công đoạn"
            :group-index="1"
            :sort-index="1"
            sort-order="desc"
            :allowEditing="false"
          />
          <DxColumn caption="Qui Cách" alignment="center" :allowEditing="false">
            <DxColumn
              caption="Dầy"
              data-field="itemHeight"
              alignment="center"
              width="60"
              :allowEditing="false"
            />
            <DxColumn
              caption="Rộng"
              data-field="itemWidth"
              alignment="center"
              width="60"
              :allowEditing="false"
            />
            <DxColumn
              caption="Dài"
              data-field="itemLength"
              alignment="center"
              width="60"
              :allowEditing="false"
            />
          </DxColumn>
          <DxColumn
            data-field="number"
            caption="Lệnh sản xuất"
            width="180"
            :allowEditing="false"
          />
          <!-- <DxColumn
            data-field="approvedAt"
            caption="Ngày phê duyệt"
            width="180"
            format="dd/MM/yyyy HH:mm:ss"
            dataType="date"
            :allowEditing="false"
          />
          <DxColumn
            data-field="LAST_NAME"
            caption="Người phê duyệt"
            width="180"
            :allowEditing="false"
          /> -->
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
            data-field="canThucHien"
            caption="Số lượng cần thực hiện"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="false"
            format="#,##0.####"
          />
          <!-- <DxColumn
            data-field="soLuongUuTien"
            caption="Tồn"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
            :visible="true"
            format="#,##0"
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
           <DxColumn
            data-field="Next_stepId"
            caption="Công đoạn nhận cuối cùng của chi tiết"
          
            width="180"
            alignment="center"
            :allowEditing="true"
            format="#,##0"
          
          >
             <DxLookup :data-source="data2" display-expr="name" value-expr="id" /> 
          </DxColumn> 
          <DxColumn
            data-field="endPO"
            caption="Đóng/mở"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
            format="#,##0"
            cellTemplate="changeColor"
          >
            <DxLookup :data-source="DONG" display-expr="name" value-expr="id" />
          </DxColumn> -->
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'In KHSX'"
          />

          <template #changeColor="cell">
            <div>
              <div
                class="text"
                style="
                  border-radius: 5px;
                  width: 100%;
                  height: 100%;
                  color: blue;
                  padding: 5px;
                "
              >
                <b v-if="cell.data.data.endPO == 0" style="text-color: orange"
                  >Mở LSX</b
                >
              </div>
              <div
                class="text"
                style="
                  border-radius: 5px;
                  width: 100%;
                  height: 100%;
                  color: orange;
                  padding: 5px;
                "
              >
                <b v-if="cell.data.data.endPO == 1" style="text-color: orange"
                  >Đóng LSX</b
                >
              </div>
            </div>
          </template>
        </DxDataGrid>
      
        </div>
        </div>
      </div>
    </q-card-section>
   
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
import moment from "moment";

import { mapGetters, mapActions } from "vuex";
import { showNotifySuccess, showNotifyError,showNotifyValidate } from "../../../ultils";
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
  data() {
    return {
      factory: null,
      factorychuyen: null,
      week: null,
      year: null,
      datachuyen:[],
      number: {
        value:'',
        label:''
      },
      dinhtuyen:false,
      xoa:false,
      showEdit:false,
      numbers: [],
      poLogs: [],
      departmentCloses: [],
      departmentOpens: [],
      departmentClose: [],
      departmentOpen: [],
      isClose: false,
      isOpen: false,
      
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: 100000,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 100004,
          code: 102340,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 100005,
          code: 102366,
        },
         {
          label: "Nhà máy CBG Quang Minh",
          factoryId: 102427,
          code: 102427,
        },
      ],
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo", "opCongDoans","dsCongDoans"]),
      ...mapGetters("lenhSanXuats", [
      "lenhSanXuats",
      "keHoachSanXuats",
      "getPheDuyets",
    ]),
  },
  created() {
     this.loadPermission();
    this.week = moment().week();
    this.year = moment().year();
    if (this.userInfo.id == 102089) {
      this.dinhtuyen = true
    }
  },
  methods: {
    ...mapActions("po", [
      "getNumberstepId",
      "getNumberInLSX",
      "getDepartmentInLSX",
      "closeStepInLSX",
      "openStepInLSX",
      "updatedinhtuyen",
      "getPoLogByNumber",
    ]),
      ...mapActions("base", ["getAllDepartment", "getAllCongDoans"]),
     ...mapActions("prod", ["updatesuaPO", "getPermissionInScreen"]),
     ...mapActions("lenhSanXuats", [
      "getAllLenhSanXuats",
      "getLenhSanXuatCapPhoispheduyet",
       "getLenhSanXuatdinhtuyen",
      "updatePo",
    ]),
    loadData() {},
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
       async changeLSX() {
       let payload = {
          factoryId: this.factory.factoryId,
          week: this.week,
          year: this.year,
        };
        await this.getLenhSanXuatCapPhoispheduyet(payload);
       },
       async updatedinhtuyenlsx(){
     
         if(this.number.value) {
  const payloaddinhtuyen = {
          lsx: this.number.value,
          factoryId: this.factory.factoryId,
        };
      let data =  this.getLenhSanXuatdinhtuyen(payloaddinhtuyen)
      console.log('data',data)
        if (data) {
          showNotifySuccess("Update định tuyến LSX thành công!");
        } else {
          showNotifyError();
        }
         } else showNotifySuccess("chưa chọn LSX");
       },
        async changeFactorychuyen(value) {
   
      await this.getAllCongDoans({ factoryId: value.code });
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
               data = congdoan.filter(f=>f.factoryId == value.code  )
     // }
      this.stepId = null;
      this.departmentCloses = data;
      console.log('cong doan:',this.departmentCloses)
        },
   async changeFactory(value) {
       let payload = {
          factoryId: this.factory.factoryId,
          week: this.week,
          year: this.year,
        };
        await this.getLenhSanXuatCapPhoispheduyet(payload);
      this.loadNumber();
      // await this.getAllCongDoans({ factoryId: value.code });
      //  let congdoan =    this.dsCongDoans
      //   .filter(
      //     (s) =>
      //       (s.type2 === "to")
      //   )
      //   .map((o) => ({
      //     label: o.name,
      //     value: o.id,
      //     code:o.code,
      //     description: `[${o.code}] ${o.name}`,
      //     icon: "mail",
      //     factoryId:o.factoryId
      //   }));
      // let data = [];
    
      // if (value.factoryId === 100003) {
      //   congdoan.forEach((element) => {
      //     if (element.code.indexOf(`(${value.code})`) > -1) data.push(element);
      //   });
      // } else if (value.factoryId === 100004) {
      //   congdoan.forEach((element) => {
      //     if (element.code.indexOf(`(${value.code})`) > -1) data.push(element);
      //   });
      // } else if (value.factoryId === 100005) {
      //   congdoan.forEach((element) => {
      //     if (element.code.indexOf(`(${value.code})`) > -1) data.push(element);
      //   });
      // } else {
      //  data = congdoan.filter(f=>f.factoryId == value.code  )
     // }
      // this.stepId = null;
      // this.departmentCloses = data;
      // console.log('cong doan:',this.departmentCloses)
    },
     async rowUpdating(e) {
      const { newData, oldData } = e;
      const {
        Next_stepId,
        endPO,
        namhong,
        th,
        ys1a,
        ys1b,
        tb,
        soLuongUuTien,
        factor,
        keHoach,
      } = newData;
      const soLuongUuTienC = oldData.soLuongUuTien;
      const namhongC = oldData.namhong;
      const thC = oldData.th;
      const ys1aC = oldData.ys1a;
      const ys1bC = oldData.ys1b;
      const tbC = oldData.tb;
      const keHoachC = oldData.keHoach;
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
            let payload = {
              accountId: this.userInfo.id,
              code: oldData.code,
              number: oldData.number,
              namhong: namhong,
              updatekh: namhongC,
              ys1a: 0,
              ys1b: 0,
              tb: 0,
              th: 0,
              keHoach: 0,
            };
       //     let result = await this.updatesuaPO(payload);
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
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, thC },
            });
            let payload = {
              accountId: this.userInfo.id,
              code: oldData.code,
              number: oldData.number,
              namhong: 0,
              updatekh: thC,
              ys1a: 0,
              ys1b: 0,
              tb: 0,
              th: th,
              keHoach: 0,
            };
         //   let result = await this.updatesuaPO(payload);
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
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, ys1aC },
            });
            let payload = {
              accountId: this.userInfo.id,
              code: oldData.code,
              number: oldData.number,
              namhong: 0,
              updatekh: ys1aC,
              ys1a: ys1a,
              ys1b: 0,
              tb: 0,
              th: 0,
              keHoach: 0,
            };
        //    let result = await this.updatesuaPO(payload);
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
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, ys1bC },
            });
            let payload = {
              accountId: this.userInfo.id,
              code: oldData.code,
              number: oldData.number,
              namhong: 0,
              updatekh: ys1bC,
              ys1a: 0,
              ys1b: ys1b,
              tb: 0,
              th: 0,
              keHoach: 0,
            };
          //  let result = await this.updatesuaPO(payload);
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
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, tbC },
            });
            let payload = {
              accountId: this.userInfo.id,
              code: oldData.code,
              number: oldData.number,
              namhong: 0,
              updatekh: tbC,
              ys1a: 0,
              ys1b: 0,
              tb: tb,
              th: 0,
              keHoach: 0,
            };
         //   let result = await this.updatesuaPO(payload);
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
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, soLuongUuTienC },
            });
            console.log(ketqua);
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
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: newData,
            });
            let payload = {
              accountId: this.userInfo.id,
              code: oldData.code,
              number: oldData.number,
              namhong: 0,
              updatekh: keHoachC,
              ys1a: 0,
              ys1b: 0,
              tb: 0,
              th: 0,
              keHoach: keHoach,
            };
       //     let result =  this.updatesuaPO(payload);

         
          this.changeLSX();
          })
          .onCancel(() => {
         
            this.changeLSX();
          });
      if (endPO !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} LSX: 1- Đóng, 0 - Mở, bạn chọn: ${endPO}`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: newData,
            });
            console.log(ketqua);
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          });
           if (Next_stepId !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} chuyên công đoạn `,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: newData,
            });
            console.log(ketqua);
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
            persistent: true,
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: newData,
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
    async loadNumber() {
      const payload = {
        factoryId: this.factory.factoryId,
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
    // async loadPoLog(){
    //   const payload = {
    //     number: this.number.value,
    //   };
    //   const data2 = await this.getPoLogByNumber(payload);
    //   this.poLogs = data2.data;
    // },
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
          this.changeLSX()
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
 async   changeWeek() {
      
   this.number = {
     value:'',
     label:''
   }
 
          let payload = {
          factoryId: this.factory.factoryId,
          week: this.week,
          year: this.year,
        };
        await this.getLenhSanXuatCapPhoispheduyet(payload);
      this.loadNumber();
    },
  },
};
</script>

<style>

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

.bs {
  border: 1px solid black;
}
</style>