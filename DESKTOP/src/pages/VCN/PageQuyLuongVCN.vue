<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo quỹ lương khối VCN
        </div>
        <div class="col-6 text-blue text-bold" align="right">
          <span style="font-size: 18px">Tháng: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="loadData"
            v-model="month"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 40px;
            "
          />
          <span style="margin-right: 15px">-</span>
          <span style="font-size: 18px">Năm: </span>
          <input
            class="text-amber-14"
            type="number"
            @input="loadData"
            v-model="year"
            style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 60px;
            "
          />
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
            >
              <DxExport
                :enabled="true"
                file-name="Đơn giá nhân công(CBG)"
                :allow-export-selected-data="false"
              />
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
                data-field="STEP_NAME"
                caption="Công đoạn"
                :group-index="0"
                width="150"
              />
              <DxColumn data-field="ITEM_NAME" caption="Tên" :allowEditing="false" />
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
              <DxColumn data-field="CHUNG_LOAI" caption="Chủng loại" width="150" />
              <DxColumn
            caption="Khối lượng hoàn thành"
            alignment="center"
          >
            <DxColumn
              v-for="(week, index) in listWeek"
              :key="index"
              :data-field="'week' + week"
              :caption="'Tuần ' + week"
              format="#,##0.####"
              :width="100"
              alignment="center"
            >
            </DxColumn>
          </DxColumn>
          <DxColumn
            :width="120"
            data-field="TOTAL"
            caption="Tổng ghi nhận (M³)"
            format="#,##0.####"
            alignment="center"
          />
              <DxColumn
                data-field="DON_GIA"
                caption="Đơn giá"
                format="fixedpoint"
                :width="150"
                :allowEditing="false"
              />
               <DxColumn
            :width="150"
            data-field="THANH_TIEN"
            caption="Quỹ lương"
            alignment="right"
            format="#,##0"
          />
          <DxSummary>
             <DxGroupItem
              column="TOTAL"             
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
              <DxGroupItem
               v-for="(week, index) in listWeek"
              :key="index"
              :column="'week' + week"             
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0.####'"
            />
            <DxGroupItem
              column="THANH_TIEN"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'#,##0'"
            />
          </DxSummary>
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
import moment from "moment";
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
      listWeek: [],
      month: moment().month() + 1,
      year: moment().year(),
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
    async loadData(){
      if(this.chonCongDoans.length > 0){
        let date = new Date(this.year, this.month - 1, 1);
      let start = moment(date).startOf("month").format("YYYY-MM-DD 00:00");
      let end = moment(date).endOf("month").format("YYYY-MM-DD 23:59");
      let weekStart = moment(start).week();
      let weekStartend = moment(end).week();
      if (this.month == 1) weekStart = 1;
      let strWeek = "";
      this.listWeek = [];
      for (let i = weekStart; i <= weekStartend; i++) {
        strWeek += `[week${i}],`;
        this.listWeek.push(i);
      }
      strWeek = strWeek.substring(0, strWeek.length - 1);
      const payload = {
        fromDate: start,
        toDate: end,
        strWeek: strWeek,
        departments: this.chonCongDoans,
      };
      let data = await this.$store.dispatch("vcn/getKlQuyLuongVCN", payload);
      console.log("data", data);
      this.dataSource = data;
      }else{
        this.dataSource = [];
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
      this.loadData();
    },
  },
};
</script>

<style>
#gridContainer{
    height: 550px;
}
</style>