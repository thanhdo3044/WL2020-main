<template>
  <q-page padding>
    <q-banner class="bg-primary text-orange">
      <div class="row">
        <div class="col-6  text-h6 orange">
          <span color="orange">Báo cáo sản lượng tính lương Vanity</span>
        </div>
        <div
          class="col-6 top-title cursor-pointer text-orange"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày {{ moment(fromDate).format("L") }} đến
          {{ moment(toDate).format("L") }}
        </div>
      </div>
      <div>
        <div v-if="showVolumnColumn">
          <q-toggle
            v-model="showVolumnColumn"
            class="text-orange"
            label="Ẩn cột Số lượng"
          />
        </div>
        <div v-else>
          <q-toggle
            v-model="showVolumnColumn"
            class="text-orange"
            label="Hiển thị cột Số lượng"
          />
        </div>
      </div>
    </q-banner>
    <q-card>
      <q-card-section>
        <div class="row">
          <div
            class="col-2 col-md-3"
            v-for="congDoan in congDoans(chonFactoryId)"
            :key="congDoan.id"
          >
            <q-checkbox
              dense
              v-model="chonCongDoans"
              :val="congDoan.id"
              :label="congDoan.name"
              color="teal"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <DxDataGrid
          id="gridContainer"
          :customize-columns="customizeColumns"
          :data-source="dataSourceFilter"
          :show-borders="true"
        >
          <DxColumnChooser :enabled="true" />
          <DxHeaderFilter :visible="true" />
          <DxGroupPanel
            :visible="true"
            :empty-panel-text="
              'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'
            "
          />
          <DxLoadPanel :enabled="false" />
          <DxScrolling mode="infinite" />
          <DxSorting mode="none" />
          <DxColumn data-field="marketId" :visible="false" />
          <DxColumn data-field="stepId" :visible="false" />
          <DxColumn
            data-field="tenCongDoan"
            caption="Công đoạn"
            :group-index="0"
            sort-order="desc"
            :sort-index="0"
          />
          <DxColumn data-field="tenCT" caption="Sản phẩm/Chi tiết" />

          <DxColumn caption="Khối lượng hoàn thành" alignment="center">
            <DxColumn
              data-field="xuat"
              caption="Số lượng"
              format="fixedpoint"
              :visible="showVolumnColumn"
            />
            <DxColumn
              data-field="xuatM3"
              caption="M3"
              data-type="number"
              format="#,##0.00"
            />
          </DxColumn>
          <DxColumn data-field="donGia" caption="Đơn giá" format="fixedpoint" />
          <DxColumn
            data-field="thanhTien"
            caption="Thành tiền"
            format="fixedpoint"
          />
          <DxSummary>
            <DxGroupItem
              column="xuatM3"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'Tổng: {0}'"
              :value-format="'decimal'"
            />
            <DxGroupItem
              column="xuat"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'Tổng: {0}'"
              :value-format="'decimal'"
            />
          </DxSummary>
        </DxDataGrid>
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
import {
  DxDataGrid,
  DxScrolling,
  DxSorting,
  DxColumn,
  DxLoadPanel,
  DxGroupPanel,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupItem,
  DxSummary
} from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import DialogSelectDate from "components/commons/DialogSelectFromDateToDate";
export default {
  data() {
    return {
      showChooseDate: false,
      dataSource: [],
      fromDate: moment().subtract(30, "days"),
      toDate: moment(),
      showVolumnColumn: true,
      chonCongDoans: [],
      chonFactoryId: null
    };
  },
  components: {
    DxDataGrid,
    DxScrolling,
    DxSorting,
    DxColumn,
    DxLoadPanel,
    DxGroupPanel,
    DxColumnChooser,
    DxHeaderFilter,
    DialogSelectDate,
    DxGroupItem,
    DxSummary
  },
  methods: {
    ...mapActions("prod", ["getGiaoNhan2"]),
    customizeColumns(columns) {
      columns[0].width = 70;
    },
    async loadData() {
      this.dataSource = await this.getGiaoNhan2({
        fromDate: moment(this.fromDate)
          .format()
          .slice(0, 10),
        toDate: moment(this.toDate)
          .add(1, "days")
          .format()
          .slice(0, 10)
      });
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },

    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadData();
    }
  },
  computed: {
    ...mapGetters("base", ["congDoans", "myFactoryInfor"]),
    dataSourceFilter() {
      return this.dataSource.filter(i => this.chonCongDoans.includes(i.stepId));
    }
  },
  created() {
    this.chonFactoryId =
      parseInt(this.$route.query.factoryId) || this.myFactoryInfor.id;
    this.loadData();
  }
};
</script>
