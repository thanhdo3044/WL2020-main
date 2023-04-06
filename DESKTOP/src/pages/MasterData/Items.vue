<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Danh mục tên Sản phẩm/Cụm/Chi tiết khối CBG
        </div>
      </div>
    </div>
    <q-card>
      <div class="row">
        <div class="col-3">
          <q-btn v-show="isInsert" style="margin-right:30px" color="positive" label="Thêm mới" @click="addItem" />
          <q-btn v-if="insertHSLP" style="margin-right:30px" color="positive" label="Thêm hệ số lựa phôi"
            @click="showNhapHeSo = true" />
          <q-btn v-if="listItemPending.length > 0" style="margin-left: 10px" color="orange"
            label="Danh sách sản phẩm chờ duyệt" @click="onPending" />
        </div>
        <div class="col-5"></div>
        <div class="col-4" align="right">
          <q-checkbox v-model="isExcel" color="amber-6" class="text-weight-bold" label="Xuất Excel" dense />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <DxDataGrid id="gridContainer" :word-wrap-enabled="true" :data-source="items" :allow-column-reordering="true"
            :columns-auto-width="true" :show-borders="true" :show-column-lines="true" :show-row-lines="true"
            :allow-column-resizing="true" key-expr="id" @exporting="onExporting">
            <DxPaging :enabled="true" />
            <!-- <DxEditing v-if="ad"
                        :allow-updating="true"
                        :allow-adding="true"
                         mode="popup"
              /> -->
            <DxExport :enabled="isExcel" :file-name="title" :allow-export-selected-data="false" />
            <DxFilterRow :visible="true" />
            <!-- <DxHeaderFilter :visible="true" /> -->
            <DxColumn data-field="id" caption="ID" :width="100" alignment="center" />
            <DxColumn data-field="code" caption="Mã số" :width="150" alignment="center">
              <DxRequiredRule />
            </DxColumn>
            <DxColumn data-field="name" caption="Tên" cell-template="del-cell">
              <DxRequiredRule />
            </DxColumn>
            <DxColumn caption="Qui cách" alignment="center">
              <DxColumn data-field="height" :width="80" caption="Dầy" alignment="center">
                <DxRequiredRule />
              </DxColumn>
              <DxColumn data-field="width" :width="80" caption="Rộng" alignment="center">
                <DxRequiredRule />
              </DxColumn>
              <DxColumn data-field="length" :width="80" caption="Dài" alignment="center">
                <DxRequiredRule />
              </DxColumn>
            </DxColumn>
            <DxColumn data-field="volumn" :width="110" caption="Số lượng" alignment="center">
              <DxRequiredRule />
            </DxColumn>
            <DxColumn data-field="GOODS_TYPE" :width="130" caption="Dòng Sản Phẩm" alignment="center">
              <!-- <DxLookup
                  :data-source="dongsanpham"
                  display-expr="label"
                  value-expr="id"
                /> -->
              <DxRequiredRule />
            </DxColumn>
            <!-- <DxColumn
                data-field="graft"
                :width="100"
                caption="Cách ghép"
              >
               <DxLookup
                  :data-source="grafts"
                  display-expr="label"
                  value-expr="value"
                />
              </DxColumn> -->

            <DxColumn :width="200" data-field="typeId" caption="Chủng loại" alignment="center">
              <DxLookup :data-source="itemTypes" display-expr="name" value-expr="id" />

              <DxRequiredRule />
            </DxColumn>
            <DxColumn :width="80" data-field="unitId" caption="Đơn vị" alignment="center">
              <DxLookup :data-source="units" display-expr="name" value-expr="id" />
              <DxRequiredRule />
            </DxColumn>

            <DxColumn data-field="GHICHU" :width="160" caption="Ghi chú" />
            <DxColumn data-field="STATUS" :width="160" caption="Trạng thái">
              <DxLookup :data-source="status" display-expr="label" value-expr="value" />
            </DxColumn>
            <!-- <DxColumn v-if="ad" caption="Chỉnh sửa" width="60" cell-template="del-cell1" /> -->
            <template #del-cell="cell">
              <span class="fake-link" @click="onSelectionChanged(cell)">{{
                  cell.data.data.name
              }}</span>
            </template>
          </DxDataGrid>
        </div>
      </div>
    </q-card>
    <q-dialog v-model="showChooseItem" persistent>
      <q-card style="min-width: 70%">
        <q-card-section class="row items-center">
          <span style="font-size: 20px; color: #21ab45; padding-left: 16px">Nhập thông tin
          </span>
        </q-card-section>
        <q-card-section style="padding-top: 0px">
          <div class="col-12">
            <p style="font-style: italic; color: violet; padding-left: 16px">
              (Nếu số lượng tính theo công thức (D*R*D*10^-9) thì bỏ qua thông
              tin "Số lượng", hệ thống sẽ tự tính)
            </p>
          </div>
          <div class="row justify-around">
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iCode" type="text" label="Mã số" :readonly="sua" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iName" type="text" label="Tên" :readonly="sua" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iHeight" type="text" label="Dầy" :readonly="sua" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iWidth" type="text" label="Rộng" :readonly="sua" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iLength" type="text" label="Dài" :readonly="sua" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select v-model="iType" :options="iTypes" label="Chủng loại" :readonly="sua" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select v-model="iUnit" :options="iUnits" label="Đơn vị" :readonly="sua" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iVolumn" type="text" label="Số lượng" :readonly="sua" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iGOODS_TYPE" label="Dòng sản phẩm" :readonly="sua" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="GHICHU" label="Ghi chú" :readonly="sua" />
            </div>
            <div v-if="isEdit" class="col-12 col-md-5 q-mt-sm">
              <q-select v-model="iSTATUS" :options="status" label="Trạng thái" :readonly="sua" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm"></div>
          </div>
        </q-card-section>
        <q-separator />
        <hr />
        <q-card-section v-show="malsx" style="padding: 0px" class="q-pa-sm">
          <span style="font-size: 16px; color: #21ab45; padding-left: 16px">Tạo mã thị trường
            <span style="color: red">(Chú ý: Khai đúng mã thị trường của sản phẩm)</span>
          </span>
          <p style="font-style: italic; color: violet; padding-left: 16px">
            (Mã thị trường dùng để phân biệt màu và mã thị trường cho từng sản
            phẩm) <br />
            (Khi tạo lệnh sản xuất, hệ thống sẽ dùng mã thị trường này để khai
            báo số lượng của sản phẩm cho mỗi LSX) <br />
            (Nếu sản phẩm có màu thì phải khai từng màu cụ thể)
          </p>

          <DxDataGrid id="gridIkea" :data-source="ikeas" :allow-column-reordering="true" :columns-auto-width="true"
            :show-borders="true" key-expr="id" @row-inserted="insertIkea" @row-updated="updatedIkea"
            :no-data-text="'Không có dữ liệu !'">
            <DxPaging :enabled="true" />
            <DxEditing :allow-updating="userInfo.id == 100400 || userInfo.id == 102089" :allow-adding="isInsert"
              mode="row" />

            <DxColumn data-field="code" caption="Mã thị trường" :width="100">
              <DxRequiredRule />
            </DxColumn>
            <DxColumn data-field="name" caption="Tên sản phẩm đóng gói">
              <DxRequiredRule />
            </DxColumn>
            <DxColumn v-if="userInfo.id == 100400 || userInfo.id == 102089" caption="Xóa" cell-template="del-cell" />
            <template #del-cell="cell">
              <span class="fake-link" @click="delIkea(cell.data)">Xóa</span>
            </template>
          </DxDataGrid>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-show="!sua" label="Gửi phê duyệt" @click="createItem" color="positive" />
          <q-btn label="Hủy" color="orange" @click="cancel" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isPending">
      <q-card>
        <q-card-section class="row items-center">
          <DxDataGrid :data-source="listItemPending" :word-wrap-enabled="true" :show-borders="true"
            :show-row-lines="true" :hover-state-enabled="true" key-expr="ID">
            <DxFilterRow :visible="true" />
            <DxHeaderFilter :visible="true" />

            <DxColumn :width="90" alignment="center" data-field="ID" caption="ID" />
            <DxColumn :width="150" data-field="CODE" caption="Mã số" />
            <DxColumn :width="100" data-field="NAME" caption="Tên" />
            <DxColumn :width="250" data-field="status" caption="Trạng Thái Phê Duyệt" />
            <!-- <div v-if="approvedByAccount == null">
              <DxColumn data-field="Chưa được trưởng nhóm duyệt" caption="Tình Trạng" />
            </div>
            <div v-else>
              <DxColumn data-field="Đã được trưởng nhóm duyệt" caption="Tình Trạng" />
            </div> -->
          </DxDataGrid>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showNhapHeSo" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6 text-blue">Nhập hệ số lựa phôi</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input label="Chọn năm" @input="loadHSLP" label-color="amber" v-model.number="year" type="number"
            outlined />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select outlined label-color="amber" @input="loadHSLP" v-model="thang" :options="thangs"
            label="Chọn tháng" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select outlined label-color="amber" @input="loadHSLP" v-model="idDepartment" :options="options"
            label="Chọn nhà máy" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input label="Hệ số lựa phôi" label-color="amber" v-model.number="heSo" type="number" outlined />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <DxDataGrid :data-source="dataHSLP" :word-wrap-enabled="true" :show-borders="true" :show-row-lines="true"
            :hover-state-enabled="true" key-expr="ID" @row-updated="fnupdateHSLP">
            <DxEditing :allow-updating="true" mode="row" />
            <DxColumn :width="150" data-field="MONTH" caption="Tháng" :allow-editing="false"/>
            <DxColumn :width="150" data-field="HE_SO" caption="Hệ số" />
          </DxDataGrid>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn color="positive" @click="addHeSoLuaPhoi" label="Thêm" />
          <q-btn color="orange" label="Hủy" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
  DxExport,
  DxSearchPanel,
  DxHeaderFilter,
  DxFilterRow,
  DxRequiredRule,
} from "devextreme-vue/data-grid";
import {
  showNotifySuccess,
  showNotifyError,
  showNotifyValidate,
} from "../../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxExport,
    DxLookup,
    DxSearchPanel,
    DxHeaderFilter,
    DxFilterRow,
    DxRequiredRule,
  },
  data() {
    return {
      events: [],
      ad: true,
      sua: true,
      malsx: false,
      title: "hello",
      isExcel: false,
      dataSource: [],
      showNhapHeSo: false,
      listItemPending: [],
      isPending: false,
      states: [],
      showChooseItem: false,
      units: [],
      emailToTruong: ["chinhhd@woodsland.com.vn", "vietnq@woodsland.vn"],
      status: [
        { label: "Đang sử dụng", value: true },
        { label: "Không sử dụng", value: false },
      ],
      items: [],
      itemTypes: [],

      dongsanpham: [
        {
          label: "Outdoor   ",
          id: "Outdoor   ",
        },
        {
          label: "HOME DEPOT",
          id: "HOME DEPOT",
        },
        {
          label: "Indoor    ",
          id: "Indoor    ",
        },
        {
          label: "Ván ghép thanh",
          id: "Ván ghép thanh",
        },
        {
          label: "KXC Nội Địa",
          id: "KXC Nội Địa",
        },
        {
          label: "Block Board",
          id: "Block Board",
        },
        {
          label: "Walmart",
          id: "Walmart",
        },
        {
          label: "Khác",
          id: "Khác",
        },
      ],
      grafts: [
        {
          label: "Khác",
          value: null,
        },
        {
          label: "Kín",
          value: "K",
        },
        {
          label: "Hở",
          value: "H",
        },
        {
          label: "không ghép",
          value: "KGH",
        },
      ],
      idDepartment: null,
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102340,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102366,
          code: "TB",
        },
      ],
      year: null,
      thang: null,
      thangs: [
        { label: 1, id: 1 },
        { label: 2, id: 2 },
        { label: 3, id: 3 },
        { label: 4, id: 4 },
        { label: 5, id: 5 },
        { label: 6, id: 6 },
        { label: 7, id: 7 },
        { label: 8, id: 8 },
        { label: 9, id: 9 },
        { label: 10, id: 10 },
        { label: 11, id: 11 },
        { label: 12, id: 12 },
      ],
      heSo: null,
      iCode: "",
      iName: "",
      iUnit: null,
      iUnits: [],
      iHeight: "",
      iWidth: "",
      iLength: "",
      iVolumn: "",
      iGOODS_TYPE: "",
      iSTATUS: [],
      GHICHU: "",
      iGraft: "",
      iType: null,
      iTypes: [],
      ikeas: [],
      isEdit: false,
      currentItemSelectId: null,
      listPermission: [],
      dataHSLP: [],
      isInsert: false,
      isUpdate: false,
      insertHSLP: false,
      isItemEdit: false,
      isDelete: false,
    };
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "userInfo"]),
  },
  created() {
    const today = new Date();
    const currentYear = today.getFullYear();
    this.year = currentYear;
    this.thang = { label: today.getMonth() + 1, id: today.getMonth() + 1 };

    this.title =
      "Danh mục sản phẩm/chi tiết CBG " + moment().format("DD-MM-YYYY");
    this.loadPermission();
    //  if (this.userInfo.id === 100400 || this.userInfo.id === 102089) {
    //    this.ad = true;
    //  }
    this.loadItemPending();
    this.load();
  },
  methods: {
    ...mapActions("messages", ["sendNotificationMail"]),
    ...mapActions("prod", ["getPermissionInScreen", "updateHSLP"]),
    async loadPermission() {
      console.log("path", this.$route.path);
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
        if (el.CODE == "itemEdit") {
          this.isItemEdit = true;
        }
        if (el.CODE == "insertHSLP") {
          this.insertHSLP = true;
        }
        if (el.CODE == "delete") {
          this.isDelete = true;
        }
      });
      console.log("listPermission", this.listPermission);
    },
    async loadHSLP() {
      const payload = {
        factoryId: this.idDepartment.factoryId,
        year: this.year,
      }
      const data = await this.$store.dispatch(
        "prod/GET_ALL_HE_SO_LUA_PHOI",
        payload
      );
      this.dataHSLP = data.data;
      console.log('this.dataHSLP', this.dataHSLP)
      this.dataHSLP.sort((a, b) => a.MONTH - b.MONTH);
    },
    async addHeSoLuaPhoi() {
      const payload = {
        factoryId: this.idDepartment.factoryId,
        month: this.thang.id,
        year: this.year,
      }
      const data = await this.$store.dispatch(
        "prod/GET_HE_SO_LUA_PHOI",
        payload
      );
      if (data.data.length > 0) {
        this.$q.dialog({
          html: true,
          title: "Lỗi",
          message: `<span class="text-red">Không thể sửa dữ liệu tháng nhỏ hơn tháng hiện tại !</span>`,
        });
      } else {
        if (this.idDepartment && this.heSo) {
          const payload = {
            factoryId: this.idDepartment.factoryId,
            month: this.thang.id,
            year: this.year,
            heSo: this.heSo,
            accountId: this.userInfo.id
          }
          const data = await this.$store.dispatch(
            "prod/INSERT_HE_SO_LUA_PHOI",
            payload
          );
          if (data.meta.success) {
            showNotifySuccess();
            this.heSo = null;
            this.loadHSLP();
          } else {
            showNotifyError();
          }
          console.log("payload", payload)
        } else {
          this.$q.dialog({
            title: "Lỗi",
            message: "Vui lòng nhập đầy đủ thông tin !",
          });
        }
      }


    },
    onExporting(e) {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("Employees");

      exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            "hello.xlsx"
          );
        });
      });
      e.cancel = true;
    },
    addItem() {
      this.sua = false;
      this.malsx = false;
      this.isEdit = false;
      this.iCode = "";
      this.iName = "";
      this.iHeight = "";
      this.iWidth = "";
      this.iLength = "";
      this.iVolumn = "";
      this.iGOODS_TYPE = "";
      this.GHICHU = "";
      this.iSTATUS = "";

      // this.iGraft =  {
      //     label: "Khác",
      //     value: "KHAC"
      //   };
      this.showChooseItem = true;
    },
    cancel() {
      this.showChooseItem = false;
    },
    async onPending() {
      this.isPending = true;
    },
    async loadItemPending() {
      const payload = {
        accountId: this.userInfo.id,
      };
      let data = await this.$store.dispatch(
        "prod/GET_ITEMS_ADD_BY_ACCOUNT",
        payload
      );
      console.log('In ra nè', this.listItemPending)
      data.data.forEach(e => {
        if (e.approvedByAccount != null) {
          e.status = "Trưởng nhóm đã duyệt"
        } else {
          e.status = "Trưởng nhóm chưa duyệt"
        };
      });
      this.listItemPending = data.data;
      console.log('In ra nè', this.listItemPending)
    },
    async delIkea(e) {
      const currentIndexIkea = this.ikeas.findIndex((d) => {
        return d.id === e.key;
      });
      if (e.key) {
        const data = await this.$store.dispatch("base/DEL_IKEA", e.key);
        if (data.meta.success) {
          showNotifySuccess("Xóa thành công !");

          this.ikeas.splice(currentIndexIkea, 1);
        } else {
          showNotifyError();
        }
      }
    },
    removing() {
      this.showChooseItem = false;
    },
    async updatedIkea(e) {
      console.log(e);
      const payload = {
        productId: e.data.id,
        data: {
          code: e.data.code,
          name: e.data.name,
        },
      };
      const data = await this.$store.dispatch("base/UPDATE_IKEA", payload);
      if (data.meta.success) {
        showNotifySuccess("Cập nhật thành công !");
      } else {
        showNotifyError();
      }
    },
    async insertIkea(e) {
      // console.log(e.data)
      const payload = {
        productId: this.currentItemSelectId,
        code: e.data.code,
        name: e.data.name,
        factoryId: 100000,
        // factoryName: this.myFactoryInfor.name,
      };
      const data = await this.$store.dispatch("base/CREATE_IKEA", payload);
      if (data.meta.success) {
        showNotifySuccess("Cập nhật thành công !");
      } else {
        showNotifyError();
      }
    },
    async onSelectionChanged(e) {
      if (this.isUpdate) {
        this.malsx = true;
        this.currentItemSelectId = e.data.data.id;
        this.iCode = e.data.data.code;
        this.iName = e.data.data.name;
        this.iHeight = e.data.data.height;
        this.iWidth = e.data.data.width;
        this.iLength = e.data.data.length;
        this.iVolumn = e.data.data.volumn;
        this.iGOODS_TYPE = e.data.data.GOODS_TYPE;
        this.GHICHU = e.data.data.GHICHU;
        this.iSTATUS = this.status.find((t) => {
          return t.value === e.data.data.STATUS;
        });
        // this.iGraft = e.data.data.graft;
        this.iType = this.iTypes.find((t) => {
          return t.value === e.data.data.typeId;
        });
        this.iUnit = this.iUnits.find((u) => {
          return u.value === e.data.data.unitId;
        });
        this.isEdit = true;
        if (this.isItemEdit) {
          this.sua = false;
        } else this.sua = true;
        await this.loadIkea(e.data.data.id);
        this.showChooseItem = true;
      }
    },
    async addIkea(productId) {
      // if (this.ikeas.length>0) {
      //   this.ikeas.forEach(async (element) => {
      //   })
      // }
    },
    async loadIkea(itemId) {
      if (itemId) {
        this.ikeas = [];
        const data = await this.$store.dispatch(
          "base/GET_IKEA_BY_ITEM",
          itemId
        );
        this.ikeas = data.data;
      }
    },
    load() {
      Promise.all([
        this.loadUnit(),
        this.loadItems(),
        this.loadItemTypes(),
        this.loadItemPending(),
      ]);
    },
    async loadUnit() {
      let data = await this.$store.dispatch("base/GET_UNITS", 1);
      this.units = data.data;
      this.units.forEach((element) => {
        this.iUnits.push({
          label: element.name,
          value: element.id,
        });
      });
    },
    async loadItems() {
      const myFactoryId = this.$route.query.factoryId;
      const myItemType = this.$route.query.type;
      const payload = {
        factoryId: myFactoryId,
        typeId: myItemType,
      };
      if (myFactoryId) {
        let data = await this.$store.dispatch("base/GET_ITEMS", payload);
        this.items = data.data;
      }
    },
    async loadItemTypes() {
      const myItemType = this.$route.query.type;
      const payload = {
        typeId: myItemType,
      };
      let data = await this.$store.dispatch("item/getItemtypes", payload);
      this.itemTypes = data.data;
      this.itemTypes.forEach((element) => {
        this.iTypes.push({
          label: element.name,
          value: element.id,
        });
      });
      console.log("kieu dl:", this.iTypes);
    },
    async createItem() {
      const myFactoryId = this.$route.query.factoryId;
      let pVolumn = 0;
      if (this.iHeight && this.iWidth && this.iLength) {
        pVolumn = this.iHeight * this.iLength * this.iWidth * Math.pow(10, -9);
      }
      if (this.iCode && this.iName && this.iType && this.iUnit) {
        if (this.isEdit) {
          const payload = {
            id: this.currentItemSelectId,
            data: {
              code: this.iCode,
              name: this.iName,
              length: this.iLength,
              width: this.iWidth,
              height: this.iHeight,
              typeId: this.iType.value,
              unitId: this.iUnit.value,
              factoryId: myFactoryId,
              volumn: this.iVolumn || pVolumn,
              GOODS_TYPE: this.iGOODS_TYPE,
              GHICHU: this.GHICHU,
              STATUS: this.iSTATUS.value,
            },
          };
          const data = await this.$store.dispatch("base/UPDATE_ITEM", payload);
          if (data.meta.success) {
            showNotifySuccess("Cập nhật thành công !");
            this.showChooseItem = false;
            this.loadItems();
          } else {
            showNotifyError();
          }
        } else {
          const payload = {
            code: this.iCode,
            name: this.iName,
            length: this.iLength,
            width: this.iWidth,
            height: this.iHeight,
            typeId: this.iType.value,
            unitId: this.iUnit.value,
            factoryId: myFactoryId,
            volumn: this.iVolumn || pVolumn,
            GOODS_TYPE: this.iGOODS_TYPE,
            GHICHU: this.GHICHU,
            CREATE_BY: this.$store.state.base.userInfo.id,
          };
          const data = await this.$store.dispatch("prod/ADD_ITEM_D", payload);
          console.log("du lieu", data);
          if (data.meta.success) {
            // await this.addIkea(data.data.id);
            this.sendMailPheDuyet(this.emailToTruong, 101651);
            showNotifySuccess();
            this.showChooseItem = false;
          } else {
            showNotifyError();
          }
        }
      } else {
        showNotifyValidate();
      }
      this.loadItemPending();
    },
    async sendMailPheDuyet(mail, accountId) {
      let baseUrl = null;
      if (process.env.PROD) {
        baseUrl = `https://app.woodsland.com.vn:2002/#/master-data-item-add`;
      } else {
        baseUrl = `http://localhost:5000/#/master-data-item-add`;
      }
      let payloadMail = {
        baseUrl: baseUrl,
        email: mail,
        accountId: this.userInfo.id,
        toAccountId: accountId,
        subject: `Có chi tiết ${this.iName} được thêm mới`,
        title: "Nhấp vào đây để đi tới phê duyệt",
        dataBody: `Chi tiết ${this.iName} đã được thêm mới từ ${this.userInfo.lastName}. Mời bạn vào phê duyệt`,
      };

      await this.sendNotificationMail(payloadMail);
    },
    logEvent(eventName) { },
    closeItemChoose() {
      this.showChooseItem = false;
    },
    clearEvents() {
      this.events = [];
    },
    async fnupdateHSLP(e) {
      console.log("eeeeee", e)
      let payload = e.data
      const data = await this.updateHSLP(payload)
      console.log("dataa", data)
      if (data.meta.success) {
        this.$q.notify({
          message: "cập nhập thành công ",
          color: "positive"
        })
      } else {
        this.$q.notify({
          message: "cập nhập không thành công ",
          color: "negative"
        })
      }
    }
  },
};
</script>

<style>

</style>