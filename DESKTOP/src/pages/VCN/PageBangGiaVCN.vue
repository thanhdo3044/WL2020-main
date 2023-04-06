<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Bảng đơn giá nhân công trực tiếp -
          <span class="text-amber-14">{{ factory ? factory.label : "" }}</span>
        </div>
      </div>
    </div>
    <q-card>
      <div style="padding: 5px">
        <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
          <div class="col-12">
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in options"
                :key="index"
              >
                <q-radio
                  dense
                  @input="onChange"
                  v-model="factory"
                  :val="congDoan"
                  :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  v-bind:class="{ isActive: true }"
                  color="amber-6"
                />
              </div>
            </div>
            <hr />
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in xuongs"
                :key="index"
              >
                <q-radio
                  dense
                  @input="chonXuong"
                  v-model="xuong"
                  :val="congDoan"
                  :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  v-bind:class="{ isActive: true }"
                  color="amber-6"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-md-3">
                <q-checkbox
                  v-if="xuong"
                  @input="selectAll()"
                  dense
                  color="teal"
                  style="color: #21ba45; font-weight: bold"
                  v-model="allDepartment"
                  label="Chọn tất cả công đoạn"
                />
              </div>
            </div>
            <hr v-if="xuong" />
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="congDoan in departments"
                :key="congDoan.id"
              >
                <q-checkbox
                  dense
                  v-model="chonCongDoans"
                  :val="congDoan.value"
                  :label="congDoan.label"
                  @input="chonDepartment"
                  color="teal"
                />
              </div>
            </div>
            <hr v-if="xuong" />
          </div>
        </div>
        <div class="row">
            <div class="col-12" align="right">
                <q-btn
              style="height: 43px"
              color="positive"
              label="Cập nhật đơn giá nhân công mới"
              @click="capnhat"
            />
            </div>
          <div class="col-12">
            <DxDataGrid
              id="gridContainer"
              :data-source="dataSource"
              :show-borders="true"
              :word-wrap-enabled="true"
              :show-row-lines="true"
              :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
              :show-column-lines="true"
              :allow-column-resizing="true"
              @row-updating="rowUpdating"
            >
              <DxExport
                :enabled="true"
                file-name="Đơn giá nhân công(CBG)"
                :allow-export-selected-data="false"
              />
              <DxEditing :allow-updating="true" mode="cell" />
              <DxColumnChooser :enabled="true" />
              <DxHeaderFilter :visible="true" />
              <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              />
              <DxLoadPanel :enabled="false" />
              <DxScrolling mode="virtual" />
              <DxSorting mode="none" />
              <DxColumn
                data-field="CONGDOAN"
                caption="Công đoạn"
                :group-index="0"
                width="150"
              />
              <DxColumn data-field="code" caption="Mã" width="150" :allowEditing="false" />
              <DxColumn data-field="name" caption="Tên" :allowEditing="false" />
              <DxColumn caption="Quy cách" alignment="center">
                <DxColumn
                  data-field="height"
                  caption="Dày"
                  :width="80"
                  :allowEditing="false"
                />
                <DxColumn
                  data-field="width"
                  caption="Rộng"
                  :width="80"
                  :allowEditing="false"
                />
                <DxColumn
                  data-field="length"
                  caption="Dài"
                  :width="80"
                  :allowEditing="false"
                />
              </DxColumn>
              <DxColumn data-field="TYPE" caption="Chủng loại" width="150" />
              <DxColumn
                data-field="DON_GIA"
                caption="Đơn giá nhân công trực tiếp (VNĐ)"
                format="fixedpoint"
                :width="150"
                :allowEditing="false"
              />
              <DxColumn
                data-field="CREATED_AT"
                caption="Ngày áp dụng"
                alignment="center"
                format="dd/MM/yyyy"
                dataType="date"
                :width="150"
                :allowEditing="false"
              />

              <DxColumn
                data-field="donGiaNew"
                caption="Cập nhật đơn giá nhân công trực tiếp (VNĐ)"
                format="fixedpoint"
                :width="150"
              />
            </DxDataGrid>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxScrolling,
  DxSorting,
  DxEditing,
  DxExport,
  DxButton,
  DxColumn,
  DxLoadPanel,
  DxGroupPanel,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupItem,
  DxSummary,
} from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import { showNotifySuccess, showNotifyError } from "../../ultils";
export default {
  components: {
    DxDataGrid,
    DxScrolling,
    DxSorting,
    DxColumn,
    DxEditing,
    DxExport,
    DxButton,
    DxLoadPanel,
    DxGroupPanel,
    DxColumnChooser,
    DxHeaderFilter,
    DxGroupItem,
    DxSummary,
  },
  data() {
    return {
      dataSource: [],
      factory: null,
      options: [],
      xuong: null,
      xuongs: [],
      departments: [],
      allDepartment: false,
      chonCongDoans: [],
    };
  },
  created() {
    this.loadFactory();
  },
  methods: {
    async loadFactory() {
      let factories1 = await this.$store.dispatch("vcn/getFactory");
      factories1.map((factory) => {
        factory.label = factory.name;
        factory.factoryId = factory.id;
      });
      this.options = factories1;
    },
    async selectAll() {
      if (this.allDepartment) {
        this.chonCongDoans = [];
        this.departments.forEach((el) => {
          this.chonCongDoans.push(el.value);
        });
      } else {
        this.chonCongDoans = [];
      }
      this.chonDepartment();
    },
    async rowUpdating(e) {
      const regex = /^[0-9.]+$/;
      const { newData, oldData } = e;
     if (!regex.test(newData.donGiaNew)) {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng nhập số ! </span>`,
          persistent: true,
        });
        newData.donGiaNew = null;
      }
    },
    async capnhat() {
      let nhapgia = [];
      this.dataSource.forEach((d) => {
        if (d.donGiaNew > 0) nhapgia.push(d);
      });
      this.dulieu = nhapgia;
      console.log("dữ liệu:", this.dulieu[0].donGia);

      const payload = {
        factoryId: this.xuong.id,
        createBy: this.$store.state.base.userInfo.id,
        dataDelai: this.dulieu,
      };
      const data = await this.$store.dispatch("vcn/nhapdongiaVCN", payload);

      if (data.success) {
        showNotifySuccess();
        this.chonDepartment();
      } else {
        showNotifyError();
      }
    },

    async onChange() {
      const payload = {
        factoryId: this.factory.id,
      };
      const data = await this.$store.dispatch(
        "vcn/getXuongByFactoryId",
        payload
      );
      data.map((e) => (e.label = e.name));
      this.xuongs = data;
      this.factoryName = this.factory.label;
    },
    async chonXuong() {
      console.log("xuong", this.xuong);
      const payload = {
        xuongId: this.xuong.id,
      };
      const data = await this.$store.dispatch(
        "vcn/getCongDoanByXuongId",
        payload
      );
      this.departments = data;
    },
    async chonDepartment() {
      if (this.chonCongDoans.length == 0) {
        this.dataSource = [];
      } else {
        const payload = {
          departments: this.chonCongDoans,
        };
        const data = await this.$store.dispatch("vcn/getBangGiaVCN", payload);
        this.dataSource = data;
      }
    },
  },
};
</script>

<style>
#gridContainer{
    height: 550px;
}
</style>