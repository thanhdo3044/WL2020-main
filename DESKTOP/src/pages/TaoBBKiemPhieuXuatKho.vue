<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary print-hide">
      <div class="row">
        <div class="col-6 top-title text-orange">Tạo biên bản xuất nhập tồn kho</div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row print-hide">
        <div class="col-3 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="department"
            :options="departments"
            label="Chọn Công đoạn"
            @input="onChange"
            dense
          />
        </div>
        <div class="col-3 q-pa-sm">
          <q-input filled v-model="date" mask="date" dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date">
                    <div class="row items-center justify-end">
                      <q-btn
                        @click="changeDate"
                        v-close-popup
                        label="Close"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-3 q-pa-sm">
          <q-input filled v-model="soPhieu" label="Số phiếu" dense />
        </div>
        <div class="col-3 q-pa-sm">
          <q-input filled v-model="bks" label="Biển kiếm soát" dense />
        </div>
        <div class="col-3 q-pa-sm">
          <q-btn
            class="col-2"
            color="primary"
            icon="save_alt"
            label="Tạo phiếu"
            @click="onSelectionUpdate"
          />
        </div>
      </div>
      <DxDataGrid
        :data-source="dataSource"
        :show-borders="true"
        :word-wrap-enabled="true"
        :show-row-lines="true"
        :show-column-lines="true"
        :selected-row-keys="selectedItemKeys"
        @selection-changed="selectionChanged"
        :no-data-text="'Không có dữ liệu'"
      >
        <DxSelection mode="multiple" />
        <DxEditing :allow-updating="true" mode="cell" />
        <DxPaging :enabled="false" />
        <DxColumn data-field="ID" caption="Mã" :visible="false" />
        <DxColumn
          data-field="NAME"
          caption="Tên chi tiết"
          :width="380"
          :allowEditing="false"
        />
        <DxColumn caption="Quy cách" alignment="center">
          <DxColumn
            data-field="LENGTH"
            caption="Dài"
            alignment="center"
            :width="90"
            :allowEditing="false"
          />
          <DxColumn
            data-field="WIDTH"
            caption="Rộng"
            alignment="center"
            :width="90"
            :allowEditing="false"
          />
          <DxColumn
            data-field="HEIGHT"
            caption="Dày"
            alignment="center"
            :width="90"
            :allowEditing="false"
          />
        </DxColumn>

        <DxColumn
          data-field="SL_PL"
          caption="Số lượng PL"
          :allowEditing="true"
        />
        <DxColumn
          data-field="UNIT_NAME"
          caption="Đơn vị tính"
          alignment="center"
          :allowEditing="false"
        />
        <DxColumn
          data-field="QUANTITY"
          caption="Tổng số thanh"
          :allowEditing="false"
        />
        <DxColumn
          data-field="KL"
          caption="Khối lượng"
          format="#,##0.00##"
          :allowEditing="false"
        />
        <DxColumn
          data-field="GOODS_TYPE"
          caption="Trạng thái"
          :allowEditing="false"
        />
          <DxColumn
          data-field="createdAt"
          caption="ngày tháng"
          :allowEditing="false"
        />
            <DxColumn
          data-field="congdoannhan"
          caption="Nơi nhận"
          :allowEditing="false"
        />
        <DxColumn
          data-field="description"
          caption="Ghi chú"
          :allowEditing="true"
        />
      </DxDataGrid>
    </q-card-section>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import {
  DxDataGrid,
  DxColumn,
  DxSummary,
  DxTotalItem,
  DxGroupPanel,
  DxPaging,
  DxSelection,
  DxEditing,
} from "devextreme-vue/data-grid";
import { showNotifyError, showNotifySuccess } from "src/utils/utils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSummary,
    DxTotalItem,
    DxGroupPanel,
    DxPaging,
    DxSelection,
    DxEditing,
  },
  data() {
    return {
      dataSource: [],
      department: null,
      departments: [],
      date: moment(new Date()).format("YYYY-MM-DD"),
      day: 0,
      month: 0,
      year: 1990,
      soPhieu: null,
      bks: null,
      osIds: [],
      selectedItemKeys: [],
      selectionChanged: (data) => {
        const osId = data.selectedRowsData.map((row) => `${row.ID}`);
        const quantity = data.selectedRowsData.map((row) => `${row.SL_PL}`);
        const description = data.selectedRowsData.map((row) => `${row.description}`)
        this.osIds = { osId, quantity, description };
      },
    };
  },
  created() {
    this.loadDepartment();
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("prod", [
      "getDepartmentByKho",
      "getKiemPhieuXuatKho",
      "updateBBKiemPhieuXuatKho",
    ]),
    async loadDepartment() {
      this.departments = [];
      let data = await this.getDepartmentByKho();
      data.data.forEach((el) => {
        this.departments.push({
          label: el.NAME,
          value: el.ID,
        });
      });
    },
    async load() {
      this.osIds = [];
      this.soPhieu = null;
      this.bks = null;
      this.dataSource = [];
      let payload = {
        date: this.date,
        stepId: this.department.value,
      };
      console.log("payload", payload);
      let data = await this.getKiemPhieuXuatKho(payload);
      this.dataSource = data.data;
    },
    onChange() {
      this.load();
    },
    changeDate() {
      let check = moment(this.date, "YYYY/MM/DD");
      this.day = check.format("D");
      this.month = check.format("M");
      this.year = check.format("YYYY");
      this.load();
    },
    onSelectionUpdate() {
      let status = false;
      console.log("osIds", this.osIds);
      if (this.soPhieu != null && this.bks != null) {
        for (let i = 0; i < this.osIds.osId.length; i++) {
          let payload = {
            id: this.osIds.osId[i],
            sl_pl: this.osIds.quantity[i],
            description: this.osIds.description[i] || "",
            soPhieu: this.soPhieu,
            bks: this.bks,
          };
          let data = this.updateBBKiemPhieuXuatKho(payload);
        }
        showNotifySuccess();
        this.$router.push("/bien-ban-kiem-phieu-xuat-kho/");
      }
    },
  },
};
</script>
