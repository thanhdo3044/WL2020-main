<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-6 top-title text-orange">Nhận  lỗi QC chuyển</div>

          <div
            class="col-6 top-title cursor-pointer text-orange"
            align="right"
            @click="showChooseDate = true"
          >
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
          </div>
        </div>
      </q-card-section>

      <q-separator inset />
      <q-card-section>
         <div class="row">
        <q-select
          class="col-2"
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
      </q-card-section>
      <q-card-section>
        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
             id="gridContainer"
              :data-source="dataSource"
              :show-borders="true"
              :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
              :show-column-lines="true"
              :allow-column-resizing="true"
              key-expr="ID"
            
            >
              <DxColumnChooser :enabled="true" />
               <DxScrolling mode="infinite" />
                 <DxSorting mode="none" />
              <DxHeaderFilter :visible="true" />
              <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              />
            
              <DxGrouping :auto-expand-all="true" />
              <!-- <DxColumn data-field="ID" caption="#" /> -->
              <DxColumn
                data-field="ITEM_FROM_NAME"
                caption="Nguồn lỗi"
                width="200"
              />
              <DxColumn
                data-field="DEPARTMENT_NAME"
                caption="Công đoạn chuyển về"
                width="250"
              />
              <DxColumn data-field="ITEM_NAME" caption="Chi tiết" width="350" />
              <!-- <DxColumn data-field="TYPE_NAME" caption="Loại lỗi" width="150" />
              <DxColumn
                data-field="REMEDIES_NAME"
                caption="Cách xử lý"
                width="200"
              /> -->
              <DxColumn caption="Qui Cách" alignment="center">
                <DxColumn
                  caption="Dầy"
                  data-field="height"
                  format="fixedPoint"
                  alignment="center"
                  width="60"
                />
                <DxColumn
                  caption="Rộng"
                  data-field="width"
                  format="fixedPoint"
                  alignment="center"
                  width="60"
                />
                <DxColumn
                  caption="Dài"
                  data-field="length"
                  format="fixedPoint"
                  alignment="center"
                  width="60"
                />
              </DxColumn>
              <DxColumn
                data-field="QUANTITY"
                caption="Số lượng"
                data-type="number"
                  alignment="center"
                format="##0,####"
                width="60"
              />
              <DxColumn
                data-field="KL"
                caption="Khối lượng"
                data-type="number"
                  alignment="center"
                format="#,##0.####"
                width="80"
              />
                 <!-- <DxColumn
                data-field="nguoitao"
                caption="Xử lý"
                width="150"
              /> -->
              <DxColumn
                data-field="createDate"
                alignment="center"
                caption="ngày giao"
                data-type="date"
                format="dd/MM/yyyy"
                width="120"
              />
               <DxColumn
                data-field="nguoinhan"
                caption="Nhận"
                width="150"
              />
              <!-- <DxColumn
                data-field="DESCRIPTION"
                caption="Ghi chú"
                width="230"
              /> -->
              <DxSummary>
                <DxGroupItem
                  column="KL"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.0000'"
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
              <!-- <DxPager :visible="false" :allowed-page-sizes="all" /> -->
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
  DxSorting,
  DxScrolling,
  DxPaging,
  DxSelection,
  DxSearchPanel,
  DxExport,
  DxSummary,
  DxGroupItem,
  DxHeaderFilter,
  DxColumnChooser,
} from "devextreme-vue/data-grid";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import {
  formatDateISO,
  showNotifySuccess,
  showNotifyError,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import moment from "moment";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxScrolling,
    DxGroupPanel,
    DxPager,
    DxSorting,
    DxPaging,
    DxSelection,
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
      showChooseDate: false,
      dataSource: [],
      department: null,
      departments:[],
      fromDate: null,
      toDate: null,
      dataTemp:[],
      selectedItemKeys: [],
      selectionChanged: (data) => {
        const packageIds = data.selectedRowsData.map(row => `${row.ID}`);
        this.dataTemp = {packageIds};
        console.log("dataTemp: ",this.dataTemp);
      },
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.loadDepartment();
    this.load();
  },
  methods: {
    ...mapActions("prod", ["getBCXuLyLoi", "updateListBCXuLyLoi","getDepartmentByKho"]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
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
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.load();
    },
    async onChange(value) {
      // console.log(value.id);

      await this.load();
    },
    async load() {
      let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD"),
        toDate: moment(this.toDate).add(1, "day").format("YYYY-MM-DD"),
        department:this.department.value
      };

      const data = await this.getBCXuLyLoi(payload);
      this.dataSource = data.data;
    },
    async updateList(){
        let payload = {
            packageIds: this.dataTemp.packageIds,
            accountId: this.userInfo.id
        }
        console.log("payload: ", payload);
      let data = await this.updateListBCXuLyLoi(payload);
      if (data.meta.success){
      showNotifySuccess()
        this.load();
      } else { showNotifyError() }
    }
  },
};
</script>

<style>
#gridContainer {
  height: 800px;
 
}
</style>