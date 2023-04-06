<template>
  <q-page>
    <q-banner class="bg-primary text-orange">
      <div class="row">
        <div class="col-6 text-h6 orange">
          <span color="orange"
            >Tình hình thực hiện tủ Vanity và khung gương - Tổ đóng gói</span
          >
        </div>
      </div>
    </q-banner>
    <div class="q-pa-md">
      <div class="row"></div>
      <div class="q-gutter-md row">
        <div class="col-3 q-pa-sm">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="factory1"
            :options="options"
            label="Chọn Nhà Máy"
            @input="onchange"
            dense
          />
        </div>
        <q-input
          class="col-md-6"
          outlined
          style="max-width: 300px"
          v-model="year"
          @input="onchange"
          label="Năm"
        />
        <q-input
          class="col-md-6"
          outlined
          style="max-width: 300px"
          v-model="week"
          @input="onchange"
          label="Tuần"
        />
      </div>
    </div>
    <q-card class="row">
      <q-card-section class="col-12">
        <DxDataGrid
          id="gridContainer"
          :customize-columns="customizeColumns"
          :data-source="dataSource"
          :show-borders="true"
        >
          <DxColumnChooser :enabled="true" />
          <DxHeaderFilter :visible="true" />
          <DxGroupPanel
            :visible="true"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
          <DxLoadPanel :enabled="false" />
          <DxScrolling mode="infinite" />
          <DxSorting mode="none" />
          <DxColumn
            data-field="marketId"
            :visible="false"
            :allow-exporting="true"
          />
          <DxColumn
            data-field="stepId"
            :visible="false"
            :allow-exporting="true"
          />
          <DxColumn
            data-field="CODE"
            caption="Mã SP"
            :group-index="1"
            sort-order="desc"
            :sort-index="1"
            :allow-exporting="true"
          />
                    <DxColumn
            data-field="number"
            caption="Mã PO"
            :group-index="0"
            sort-order="desc"
            :sort-index="0"
            :allow-exporting="true"
          />
          <DxColumn data-field="name" width="300px" caption="Màu" :allow-exporting="true" />

          <DxColumn
            caption="Số lượng lũy kế Lệnh sản xuất"
            :allow-exporting="true"
            alignment="center"
          >
            <DxColumn
              data-field="quantity"
              caption="KHLSX"
              :visible="showVolumnColumn"
              :allow-exporting="true"
            />
            <DxColumn
              data-field="thuchien"
              caption="Thực hiện"
              data-type="number"
              :allow-exporting="true"
            />
            <DxColumn
              data-field="conlai"
              caption="Còn phải thực hiện"
              data-type="number"
              :allow-exporting="true"
            />
            <DxColumn
              data-field="dat"
              caption="% đạt"
              data-type="number"
              format="##0.0%"
              :allow-exporting="true"
            />
          </DxColumn>
          <DxColumn
            data-field="donGia"
            caption="Chờ đóng gói"
            format="fixedpoint"
            :allow-exporting="true"
          />
          <DxColumn
            caption="Số lượng lũy kế Lệnh sản xuất"
            :allow-exporting="true"
            alignment="center"
          >
            <DxColumn
              data-field="thu2"
              caption="T2"
              format="fixedpoint"
              :allow-exporting="true"
            />
            <DxColumn
              data-field="thu3"
              caption="T3"
              data-type="number"
              :allow-exporting="true"
            />
            <DxColumn
              data-field="thu4"
              caption="T4"
              data-type="number"
              :allow-exporting="true"
            />
            <DxColumn
              data-field="thu5"
              caption="T5"
              data-type="number"
              :allow-exporting="true"
            />
            <DxColumn
              data-field="thu6"
              caption="T6"
              data-type="number"
              :allow-exporting="true"
            />
            <DxColumn
              data-field="thu7"
              caption="T7"
              data-type="number"
              :allow-exporting="true"
            />
                        <DxColumn
              data-field="thu8"
              caption="CN"
              data-type="number"
              :allow-exporting="true"
            />
          </DxColumn>

          <DxSummary>
            <DxGroupItem
              column="quantity"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
            <DxGroupItem
              column="thuchien"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'{0}'"
              :value-format="'decimal'"
            />
          </DxSummary>
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Tình hình thực hiện tủ Vanity và khung gương - Tổ đóng gói'"
          />
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
  DxExport,
  DxDataGrid,
  DxScrolling,
  DxSorting,
  DxColumn,
  DxLoadPanel,
  DxGroupPanel,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupItem,
  DxSummary,
} from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import DialogSelectDate from "components/commons/DialogSelectFromDateToDate";
export default {
  data() {
    return {
      showChooseDate: false,
      dataSource: [],
      dataSourceDay: null,
      fromDate: moment().subtract(30, "days"),
      toDate: moment(),
      showVolumnColumn: true,
      chonCongDoans: [],
      chonFactoryId: null,
      year: null,
      week: null,
      factory1: null,

      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 100004,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 100005,
          code: "TB",
        },
      ],
    };
  },
  components: {
    DxExport,
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
    DxSummary,
  },
  methods: {
    ...mapActions("prod", ["getPerformTable"]),
    customizeColumns(columns) {
      columns[0].width = 70;
    },
    async loadData() {
      if (this.factory1 
      && this.week && this.year
      ) {
        this.dataSource = null
        let payload = {
          year: this.year,
          week: this.week,
          factoryId: this.factory1.factoryId,
        };
        let dataSource = await this.getPerformTable(payload);
        dataSource.map((i) => {
          i.name = i.name.split(" ")[1];
        });
        dataSource.map((i) => {
          i.thuchien = i.thu2 + i.thu3 + i.thu4 + i.thu5 + i.thu6 + i.thu7 + i.thu8;
          (i.conlai = i.quantity - i.thuchien),
            (i.dat = parseFloat(i.thuchien / i.quantity).toFixed(2));
          for (let key in i) {
            if (i[key] === null) {
              i[key] = 0;
            }
          }
        });
        this.dataSource = dataSource;

        console.log(dataSource);
      }
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },

    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadData();
    },
    async onchange() {
      this.loadData();
    },
  },
  computed: {
    ...mapGetters("base", ["congDoans", "myFactoryInfor"]),
    dataSourceFilter() {
      return this.dataSource.filter((i) =>
        this.chonCongDoans.includes(i.stepId)
      );
    },
  },
  created() {
    this.chonFactoryId =
      parseInt(this.$route.query.factoryId) || this.myFactoryInfor.id;
    this.loadData();
  },
};
</script>
