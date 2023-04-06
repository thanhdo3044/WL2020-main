<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-6 top-title text-orange">
            Báo cáo khối lượng ra lò - {{ this.factory.label }}
          </div>
          <div
            class="col-6 top-title text-orange cursor-pointer"
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
          <div class="col-2">
            <q-select
              outlined
              v-model="factory"
              :options="options"
              label="Chọn nhà máy"
              @input="onChange"
            />
          </div>
          <q-checkbox
            v-for="(value, index) in types"
            :key="index"
            @input="onChangeType"
            dense
            v-model="type"
            :val="value.value"
            :label="value.label"
            color="teal"
          />
        </div>
        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
              id="gridContainer"
              :data-source="dataSource"
              :show-borders="true"
              :show-row-lines="true"
              :hover-state-enabled="true"
              :row-alternation-enabled="true"
              :show-column-lines="true"
              :allow-column-resizing="true"
              :no-data-text="'Không có dữ liệu !'"
            >
              <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              />
              <DxScrolling mode="virtual" />
              <DxGrouping :auto-expand-all="true" />
              <DxHeaderFilter :visible="true" />

              <DxColumn data-field="Lò" caption="Lò" :group-index="0">
              </DxColumn>
              <DxColumn data-field="Quy cách" />
              <DxColumn data-field="length" caption="Dài" />
              <DxColumn data-field="width" caption="Rộng" />
              <DxColumn data-field="height" caption="Dày" />
              <DxColumn data-field="Chi tiết/cụm" />
              <DxColumn
                data-field="Tổng khối lượng"
                caption="Tổng khối lượng(m³)"
                format="###0.##"
              />
              <DxColumn
                dataField="Số lượng"
                caption="Số lượng(t)"
                dataType="number"
                format="fixedpoint"
              />
              <DxColumn
                dataField="CREATE_DATE"
                caption="Ngày vào lò"
                dataType="date"
                format="dd/MM/yyyy"
              />
              <DxColumn
                dataField="EXPORT_DATE"
                caption="Ngày ra lò"
                dataType="date"
                format="dd/MM/yyyy"
              />
              <DxColumn
                dataField="du_kien_ra_lo"
                caption="Ngày dự kiến ra lò"
                dataType="date"
                format="dd/MM/yyyy"
              />
              <DxColumn
                dataField="Trạng thái"
                caption="Trạng thái"
                format="fixedpoint"
              />

              <DxSummary>
                <DxTotalItem
                  column="Mã mẻ"
                  summary-type="count"
                  value-format="fixedpoint"
                  display-format="Tổng cộng : "
                />
                <DxTotalItem
                  column="Tổng khối lượng"
                  summary-type="sum"
                  value-format="###0.##"
                  display-format="{0}"
                />
                <DxGroupItem
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  column="Tổng khối lượng"
                  summary-type="sum"
                  value-format="###0.##"
                  display-format="{0}"
                />
              </DxSummary>
              <DxExport
                :enabled="true"
                :allow-export-selected-data="false"
                :file-name="
                  'Báo cáo phôi theo mẻ sấy từ ngày ' +
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
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxSummary,
  DxGroupItem,
  DxScrolling,
  DxHeaderFilter,
  DxTotalItem,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxExport,
} from "devextreme-vue/data-grid";
import { DxDateBox } from "devextreme-vue";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import { mapGetters } from "vuex";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxScrolling,
    DxPager,
    DxPaging,
    DxSummary,
    DxGroupItem,
    DxTotalItem,
    DxHeaderFilter,
    DxSearchPanel,
    DxDateBox,
    DxExport,
    DialogSelectDate,
  },
  data() {
    return {
      dataSource: [],
      dataSource2: [],
      showChooseDate: false,
      factory: {
        label: "Nhà máy CBG Thuận Hưng",
        factoryId: 100000,
      },
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1A",
          factoryId: 100003,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 100005,
        },
      ],
      type: ["finish"],
      types: [
        {
          label: "Hoàn thành",
          value: "finish",
        },
        {
          label: "Đang sấy",
          value: "process",
        },
      ],
      fromDate: null,
      toDate: null,
    };
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
    ...mapGetters("base", ["myFactoryInfor"]),
  },
  created() {
    this.toDate = new Date();
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load();
  },
  methods: {
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.load();
    },
    async onChange(value) {
      this.load();
    },
    onChangeType() {
      if (this.type.length == 1) {
        this.dataSource = this.dataSource2.filter(
          (d) => d.STATUS == this.type[0]
        );
      } else if (this.type.length == 0) {
        this.dataSource = [];
      } else {
        this.dataSource = this.dataSource2;
      }
    },
    async load() {
      const myFactoryId = this.factory.factoryId;
      if (myFactoryId) {
        let payload = {
          fromDate: formatDateISO(this.fromDate),
          toDate: formatDateISO(this.toDate),
          factoryId: myFactoryId,
        };
        const data = await this.$store.dispatch(
          "prod/GET_REPORT_MATERIAL_OF_MESAY2",
          payload
        );
        this.dataSource2 = data.data;
        if (this.type.length == 1) {
          this.dataSource = this.dataSource2.filter(
            (d) => d.STATUS == this.type[0]
          );
        } else if (this.type.length == 0) {
          this.dataSource = [];
        } else {
          this.dataSource = this.dataSource2;
        }
      }
    },
  },
};
</script>

<style>
#gridContainer {
  height: 700px;
}
</style>