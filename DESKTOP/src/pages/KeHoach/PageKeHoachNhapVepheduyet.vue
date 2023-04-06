<template>
  <q-page>
    <q-banner class="text-primary row print-hide">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div class="text-h6 q-mt-lg">
        <b> Đóng mở SP/CT từng công đoạn theo LSX </b>
      </div>
    </q-banner>
    <q-card>
      <div class="text-orange row widget-container">
        <div class="col-12 col-md-2 q-pa-sm">
          <q-select
            class="row print-hide"
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
          <q-input
            class="row print-hide"
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
          />
        </div>
      </div>
      <q-card-section>
        <div>
          <b class="text-positive">Danh sách các LSX :</b>
        </div>
        <div class="row">
          <div class="col-3" v-for="(lsx, key) in dataTotal" :key="key">
            <q-radio
              @input="xemlsx()"
              :val="lsx.number"
              :label="lsx.number"
              v-model="selection"
              color="teal"
              class="text-weight-bold"
            />
            <!-- hiển thị % tỷ lệ đạt kế hoạch -->
            <!-- <q-badge align="top">{{ lsx.avgTiLeTH }}%</q-badge> -->
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <DxDataGrid
          id="gridContainer"
          :data-source="getPheDuyets(selection)"
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
          <DxEditing :allow-updating="xoa" mode="cell" />
          <DxColumn
            data-field="itemId"
            caption="Mã ID"
            width="70"
            :allowEditing="false"
          />
          <DxColumn
            data-field="itemName"
            caption="Tên sản phẩm/Cụm/Chi tiết"
            :allowEditing="false"
            cssclass="dx-group-row"
            width="360"
          />
          <DxColumn
            data-field="maket"
            caption="Thị trường / Màu sắc"
            width="100"
            :allowEditing="false"
          />

          <DxColumn
            data-field="stepName"
            caption="Tên tổ"
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
            width="120"
            :allowEditing="false"
          />
          <DxColumn
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
          />
          <DxColumn
            data-field="keHoach"
            caption="Số Lượng theo LSX"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
            format="#,##0.##"
          />
   <DxColumn
            data-field="th"
            caption="Ton"
            data-type="number"
            width="90"
            alignment="center"
            :allowEditing="true"
            format="#,##0"
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
          /> -->
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
          </DxColumn>
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
    ...mapGetters("lenhSanXuats", [
      "lenhSanXuats",
      "keHoachSanXuats",
      "getPheDuyets",
    ]),
    ...mapGetters("base", ["myFactoryInfor", "userInfo","dsCongDoans"]),
    ...mapGetters("prod", ["factories"]),
  },
  methods: {
    ...mapActions("prod", ["updatesuaPO", "getPermissionInScreen"]),
     ...mapActions(("base"),["getAllCongDoans"]),
    ...mapActions("lenhSanXuats", [
      "getAllLenhSanXuats",
      "getLenhSanXuatCapPhoispheduyet",

      "updatePo",
    ]),
    async rowUpdated() {
      console.log("OK");
    },
       async loadPermission() {
      console.log("path", this.$route.path);
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.getPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((element) => {
        if (element.CODE == "approve") {
          this.isApprove = true;
        }
        if (element.CODE == "reject") {
          this.isReject = true;
        }
        if (element.CODE == "insert") {
          this.isInsert = true;
        }
        if (element.CODE =="update") {
          this.isUpdate = true;
        }
        if (element.CODE == "delete") {
          this.isDelete = true;
        }
      });
     if(this.isUpdate) {
      this.xoa = true;
    }
      
    },
    //tìm kiếm theo tuần
    async searchWeek() {
      await this.functionSearch();
    },
    //function tìm kiếm chung ;
    async functionSearch() {
      const payload = {
        week: this.week,
        year: this.year,
        factoryId: this.factory.value,
      };

      // let dataPivort = [];
      const data = await this.$store.dispatch("prod/GET_HE_SO_LSX", payload);
      this.dataTotal = data.data;
      if (this.dataTotal) {
        let payload = {
          factoryId: this.factory.value,
          week: this.week,
          year: this.year,
        };
        await this.getLenhSanXuatCapPhoispheduyet(payload);
        //this.dataTotal = await this.keHoachSanXuats;
      }
    },
    //tìm kiếm theo tên nhà máy
    async searchFactory() {
   
      await this.functionSearch();
      this.fa = this.factory.value
      if (this.factory.value == 100000) this.fa = 100000
      if (this.factory.value == 100003) this.fa = 102339
     if (this.factory.value == 100004) this.fa = 102340
    if (this.factory.value == 100005) this.fa = 102366
         await this.getAllCongDoans({ factoryId:this.fa})
      let congdoan = this.dsCongDoans
        .filter(
          (s) =>
            s.type2 === 'to' ||  s.type2 === 'kho'
        )
        .map((o) => ({
          name: o.name,
          id: o.id,
          description: `[${o.code}] ${o.name}`,
          icon: "mail",
          factoryId:o.factoryId
        }));
   
      
      this.stepId = null;
      this.data2 = congdoan;
      console.log('du lieu cd:',this.data2)
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
            let result = await this.updatesuaPO(payload);
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
            let result = await this.updatesuaPO(payload);
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
            let result = await this.updatesuaPO(payload);
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
            let result = await this.updatesuaPO(payload);
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
            let result = await this.updatesuaPO(payload);
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
            let result = await this.updatesuaPO(payload);

            console.log(ketqua);
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
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
  },
  data() {
    return {
      week: null,
      ngayDongGoi: null,
      dataTotal: null,
      selection: [],
      data2:[],
      listPermission:[],
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      isApprove: false,
      isReject: false,
      factories1: null,
      xoa: false,
      goodsType: {
        label: "Indoor",
        value: "indoor",
        code: "indoor",
      },
      DONG: [
        { id: 1, name: "Đóng LSX" },
        { id: 0, name: "Mở LSX" },
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
    this.loadPermission()
    const today = new Date();

    const currentYear = today.getFullYear();
    this.year = currentYear;
  
 
    if (this.userInfo.id === 101966) {
      this.factories1 = this.factories.find((nm) => nm.factoryId === 100005);
      this.factory = this.factories1;
    }  else {
      this.factory = this.factories[0];
      this.factories1 = this.factories;
    }
    const { factoryId } = this.myFactoryInfor;

    this.ngayDongGoi = moment().format().slice(0, 10);
    this.week = this.ngayDongGoi ? moment(this.ngayDongGoi).format("w") : "";
    await this.loadData({ factoryId });
    
    await this.getAllCongDoans({ factoryId:100000})
      let congdoan2 = this.dsCongDoans
        .filter(
          (s) =>
            s.type2 === 'to'
        )
        .map((o) => ({
          name: o.name,
          id: o.id,
         
        }));
   
      
    
      this.data2 = congdoan2;
      console.log('du lieu SP:',this.data2)
   
  },
};
</script>
<style>
#gridContainer {
  height: 800px;
}
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  font-weight: 500;
  background-color: white;
  width: 280;
}
</style>
