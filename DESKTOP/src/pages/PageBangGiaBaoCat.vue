<template>
  <q-page padding>
    <q-banner class="bg-primary text-orange">
      <div class="row">
        <div class="col-6 text-h6 orange">
          <span color="orange"
            >Bảng đơn giá nhân công trực tiếp tổ Lựa phôi OD</span
          >
        </div>
      </div>
      <div></div>
    </q-banner>
    <q-card>
      <q-card-section>
        <div class="row">
          <q-select
            class="col-12 col-md-2 q-pa-sm"
            label-color="orange"
            dense
            filled
            @input="loadDepartment"
            v-model="idDepartment"
            :options="options"
            label="Chọn nhà máy"
          />
        </div>

        <DxDataGrid
          :data-source="dataSource"
          :show-borders="true"
          :show-row-lines="true"
          :word-wrap-enabled="true"
          :show-column-lines="true"
        >
          <!-- <DxEditing :allow-updating="true" mode="popup" /> -->
          <DxColumn
            data-field="DEPARTMENT_NAME"
            caption="Công đoạn"
            :group-index="0"
            :allowEditing="false"
          />
          <DxColumn
            data-field="NAME"
            caption="Kích thước"
            :allowEditing="false"
            :width="300"
            css-class="rowBGCB"
          />
          <!-- <DxColumn
            data-field="PRICE"
            caption="Đơn giá (ĐVT:đ/m3)"
            :width="150"
            format="#,###"
           :visible="capnhatdongia"
           /> -->
          <DxColumn
            data-field="PRICEYS"
            caption="Đơn giá nhân công (ĐVT:đ/m3)"
            :width="150"
            format="#,###"
            css-class="rowBGCB"
            :visible="capnhatdongia"
          />
          <DxColumn
            data-field="START_DATE"
            caption="Ngày áp dụng"
            data-type="date"
            format="dd/MM/yyyy"
            css-class="rowBGCB"
            :width="150"
          />
          <DxColumn
            data-field="GHI_CHU"
            :allowEditing="false"
            caption="Ghi chú"
            css-class="rowBGCB"
            :width="750"
          />
        </DxDataGrid>
      </q-card-section>
      <q-card-section v-if="dataSource2.length > 0">
        <div class="row">
          <div class="col-3 text-orange">Bảng giá mới chờ duyệt</div>
        </div>
        <DxDataGrid
          :data-source="dataSource2"
          :show-borders="true"
          :selection="{ mode: 'multiple' }"
          @selection-changed="onSelectionChanged"
        >
          <DxColumn
            data-field="DEPARTMENT_NAME"
            caption="Công đoạn"
            :group-index="0"
            :allowEditing="false"
          />
          <DxColumn
            data-field="NAME"
            caption="Kích thước"
            :allowEditing="false"
            :width="300"
          />
          <!-- <DxColumn
            data-field="PRICE"
            caption="Đơn giá (ĐVT:đ/m3)"
            :width="150"
            format="#,###"
         
          /> -->
          <DxColumn
            data-field="PRICEYS"
            caption="Đơn giá (ĐVT:đ/m3)"
            :width="150"
            format="#,###"
          />
          <DxColumn
            data-field="START_DATE"
            caption="Ngày áp dụng"
            data-type="date"
            format="dd/MM/yyyy"
            :width="150"
          />
          <DxColumn
            data-field="GHI_CHU"
            :allowEditing="false"
            caption="Ghi chú"
          />
          <DxColumn
            data-field="LAST_NAME"
            :allowEditing="false"
            caption="Người tạo"
            :width="150"
          />
          <DxColumn
            data-field="CREATED_AT"
            :allowEditing="false"
            data-type="date"
            format="dd/MM/yyyy"
            :width="150"
            caption="Ngày tạo"
          />
          <DxColumn
            caption="Phê duyệt"
            width="100"
            alignment="center"
            cell-template="pheDuyet-cell"
          />
          <template #pheDuyet-cell="cell">
            <span class="fake-link" @click="onApprove(cell)">Phê duyệt</span>
          </template>
          <DxColumn
            caption="Từ chối"
            width="100"
            alignment="center"
            cell-template="tuChoi-cell"
          />
          <template #tuChoi-cell="cell">
            <span class="fake-link" @click="onReject(cell)">Từ chối</span>
          </template>
        </DxDataGrid>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { DxDataGrid, DxEditing, DxColumn } from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import { showNotifySuccess, showNotifyError } from "../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
  },
  data() {
    return {
      dataSource: [],
      dataSource2: [],
      capnhatdongia: true,
      idDepartment: {
        id: 100004,
        label: "Nhà máy CBG Yên Sơn 1",
      },
      options: [
        {
          id: 100004,
          label: "Nhà máy CBG Yên Sơn 1",
        },
        {
          id: 100005,
          label: "NM CBG Thái Bình",
        },
      ],
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      isApprove: false,
      isReject: false,
      listSelect: [],
    };
  },
  created() {
    this.loadData();
    this.loadData2();
    this.loadPermission();
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("prod", [
      "getBangGiaBaoCat",
      "getBangGiaBaoCatNotVerifyByMaSP",
      "getBangGiaBaoCatNotVerify",
      "insertBangGiaBaoCat",
      "approveBangGiaBaoCat",
      "rejectBangGiaBaoCat",
      "getPermissionInScreen",
    ]),
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
        if (el.CODE == "delete") {
          this.isDelete = true;
        }
        if (el.CODE == "approve") {
          this.isApprove = true;
        }
        if (el.CODE == "reject") {
          this.isReject = true;
        }
      });
      console.log("listPermission", this.listPermission);
    },
    //     calculateGIA(rowData) {
    //     if (this.idDepartment.id == 100003)
    //     rowData.PRICE =  rowData.PRICEYS

    //      return  rowData.PRICE ;
    // },
    async loadDepartment() {
      // if (this.idDepartment.id == 100000)  this.capnhatdongia = true
      // else this.capnhatdongia = false
      this.loadData();
    },
    async loadData() {
      const data = await this.getBangGiaBaoCat();
      this.dataSource = data.data;
    },
    async loadData2() {
      const data = await this.getBangGiaBaoCatNotVerify();
      this.dataSource2 = data.data;
    },

    async update(e) {
      const dataVerify = await this.getBangGiaBaoCatNotVerifyByMaSP({
        maSP: e.data.MASP,
      });
      if (dataVerify.data.length > 0) {
        this.$q
          .dialog({
            title: "Cảnh cáo",
            message: `Bạn không thể sửa chi tiết : ${e.data.NAME} vì nó đã được sửa bởi : ${dataVerify.data[0].LAST_NAME}!`,
            ok: {
              push: true,
            },
          })
          .onOk(() => {
            this.loadData();
            this.loadData2();
          });
      } else {
        const payload = {
          maSP: e.data.MASP,
          departmentName: e.data.DEPARTMENT_NAME,
          name: e.data.NAME,
          price: e.data.PRICE,
          ghiChu: e.data.GHI_CHU,
          startDate: e.data.START_DATE,
          accountId: this.userInfo.id,
        };
        const data = await this.insertBangGiaBaoCat(payload);
        if (data.meta.success) {
          showNotifySuccess();
          this.loadData();
          this.loadData2();
        } else {
          showNotifyError();
        }
      }
    },

    onSelectionChanged({ selectedRowsData }) {
      this.listSelect = [];
      if (selectedRowsData.length > 0) {
        selectedRowsData.forEach((el) => {
          this.listSelect.push({ id: el.ID });
        });
      }
    },
    async onApprove(row) {
      const payload = {
        id: row.data.data.ID,
        maSP: row.data.data.MASP,
        startDate: row.data.data.START_DATE,
        accountId: this.userInfo.id,
      };
      console.log("data", payload);
      const data = await this.approveBangGiaBaoCat(payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.loadData();
        this.loadData2();
      } else {
        showNotifyError();
      }
    },
    async onReject(row) {
      const payload = {
        id: row.data.data.ID,
      };
      console.log("data", payload);
      const data = await this.rejectBangGiaBaoCat(payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.loadData();
        this.loadData2();
      } else {
        showNotifyError();
      }
    },
  },
};
</script>

<style>
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  font-weight: 900;
}
.dx-datagrid-headers .rowBGCB {
  color: orange;
}
</style>