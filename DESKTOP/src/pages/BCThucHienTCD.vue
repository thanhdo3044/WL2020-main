<template>
  <q-page>
    <q-banner class="bg-primary text-orange">
      <div class="row">
        <div class="col-6 text-h6 orange">
          <span color="orange"
            >Tình hình thực hiện tủ Vanity và khung gương - Tổ :
            {{ stepId ? stepId.label : "" }}</span
          >
        </div>
      </div>
    </q-banner>
    <div class="row">
      <div class="col-3 q-pa-sm">
        <q-select
          color="grey-3"
          label-color="orange"
          outlined
          v-model="factory1"
          :options="options"
          label="Chọn Nhà Máy"
          @input="onChange"
          dense
        />
      </div>
      <div class="col-3 q-pa-sm">
        <q-select
          color="grey-3"
          label-color="orange"
          outlined
          v-model="stepId"
          :options="data"
          label="Chọn công đoạn"
          @input="loadData"
          dense
        />
      </div>
    </div>
       <div class="row">
      <div class="col-3 q-pa-sm">
        <q-input
          outlined
          v-model="year"
          @input="onchange"
          label="Năm"
        />
      </div>
      <div class="col-3 q-pa-sm">
        <q-input
         outlined
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
          <DxLoadPanel :enabled="true" />
          <DxGroupPanel
            :visible="true"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
          <DxLoadPanel :enabled="false" />
          <DxScrolling mode="virtual" />
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
            data-field="codePo"
            caption="PO"
            :group-index="0"
            sort-order="desc"
            :sort-index="0"
            :allow-exporting="true"
          />
          <DxColumn
            data-field="nameItem"
            width="300px"
            caption="Tên sản phẩm"
            :allow-exporting="true"
          />
          <DxColumn
            data-field=""
            caption="Ct/sp"
            width="50px"
            :allow-exporting="true"
          />
          <DxColumn
            caption="Kích thước tủ"
            alignment="center"
            :allow-exporting="true"
          >
            <DxColumn
              data-field="length"
              caption="Dài"
              data-type="number"
              format="###0.0"
              :allow-exporting="true"
            />
            <DxColumn
              data-field="width"
              caption="Rộng"
              data-type="number"
              format="###0.0"
              :allow-exporting="true"
            />
            <DxColumn
              data-field="height"
              caption="Dày"
              data-type="number"
              format="###0.0"
              :allow-exporting="true"
            />
          </DxColumn>
          <DxColumn data-field="" caption="m3/ct" width="50px" />

          <DxColumn
            caption="Số lượng lũy kế Lệnh sản xuất"
            alignment="center"
            :allow-exporting="true"
          >
            <DxColumn
              data-field="KHSX"
              caption="KHSX"
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

          <DxColumn caption="Tình hiền thực hiện tuần" alignment="center">
            <DxColumn
              data-field="thu2"
              caption="T2"
              data-type="number"
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

          <!-- <DxSummary>
            <DxGroupItem
              column="KHSX"
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
          </DxSummary> -->
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Tình hình thực hiện tủ Vanity và khung gương'"
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
      data: null,

      stepId: null,
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
    ...mapActions("prod", ["getPerformTableByStep","getPerformTableByStepPaint"]),
    ...mapActions("base", ["getAllDepartment"]),

    customizeColumns(columns) {
      columns[0].width = 70;
    },
    async loadData() {
      //   let payload ={
      //     year:this.year,
      //     week:this.week
      //   }
      //   let dataSource = await this.getPerformTable(payload);
      //   dataSource.map((i) => {
      //     i.name = i.name.split(" ")[1];
      //   });
      //   dataSource.map((i) =>{
      //     i.thuchien = i.thu2 + i.thu3 + i.thu4 + i.thu5 + i.thu6 + i.thu7;
      //     i.conlai = i.quantity - i.thuchien,
      //     i.dat = parseFloat(i.thuchien/i.quantity).toFixed(2)
      //     for(let key in i){
      //       if(i[key]===null){
      //         i[key] =0
      //       }
      //     }
      //   })
      //   this.dataSource = dataSource;
      // console.log(this.stepId.NAME.indexOf("Sơn"));

      if (this.year && this.week && this.stepId) {
                this.dataSource = null

        let payload = {
          year: this.year,
          week: this.week,
          stepId: this.stepId.ID,
        };
        if (this.stepId.NAME.indexOf("Sơn") > -1) {
          let dataSource = await this.getPerformTableByStepPaint(payload);
          dataSource.map((data) => {
            data.CODE = data.mau;
            data.KHSX = data.quantity
            data.codePo = data.number
            data.thuchien =
              data.thu2 +
              data.thu3 +
              data.thu4 +
              data.thu5 +
              data.thu6 +
              data.thu7 +
              data.thu8;
            data.conlai = data.KHSX - data.thuchien;
            data.dat = parseFloat(data.thuchien / data.KHSX).toFixed(2);
            for (let key in data) {
              if (data[key] === null) {
                data[key] = 0;
              }
            }
          });
          this.dataSource = dataSource;

          console.log(dataSource);
        } else {
          let dataSource = await this.getPerformTableByStep(payload);
          dataSource.map((data) => {
            data.CODE = data.codeItem.split(".")[0];
            data.thuchien =
              data.thu2 +
              data.thu3 +
              data.thu4 +
              data.thu5 +
              data.thu6 +
              data.thu7 +
              data.thu8;
            data.conlai = data.KHSX - data.thuchien;
            data.dat = parseFloat(data.thuchien / data.KHSX).toFixed(2);
            for (let key in data) {
              if (data[key] === null) {
                data[key] = 0;
              }
            }
          });
          this.dataSource = dataSource;
        }

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
    // async onChange(value) {
    //   console.log("this", this.dsCongDoans, value.factoryId);
    //   console.log("th", this.opCongDoans(value.factoryId));
    //   console.log("th", this.stepId);

    //   this.stepId = null;
    //   if (value.factoryId == 100000) {
    //     this.data = this.opCongDoans(value.factoryId);
    //   } else {
    //     this.data = this.opCongDoans(value.factoryId).filter(
    //       (step) => step.label.indexOf(`(${value.code})`) > -1
    //     );
    //   }
    async onChange(value) {
      this.stepId = null;

      let getAllCongDoans = await this.getAllDepartment();
      let data = [];
      getAllCongDoans.forEach((element) => {
        if (element.NAME.indexOf(`(${value.code})`) > -1) {
          element.label = element.NAME;
          data.push(element);
        }
      });

      this.data = data;
      console.log(data);
    },
    //     congdoan.filter((s) => s.type2 === "department" || s.type2 === "stock")
    //     .map((o) => ({
    //       label: o.name,
    //       value: o.id,
    //       description: `[${o.code}] ${o.name}`,
    //       icon: "mail",
    //       factoryId: o.factoryId,
    //     }));
    //   let data = [];
    //   console.log("cong doan", congdoan);
    //   console.log("this.dsCongDoans", this.dsCongDoans);
    //   if (value.factoryId === 102299) {
    //     congdoan.forEach((element) => {
    //       if (element.label.indexOf(`(${value.code})`) > -1) data.push(element);
    //     });
    //   } else {
    //     data = congdoan.filter(
    //       (f) => f.factoryId == value.factoryId && f.label.indexOf(`(TH)`) > -1
    //     );
    //   }
    //   this.stepId = null;
    //   this.data = data;
    //   console.log(data);
  },
  computed: {
    ...mapGetters("base", [
      "departments",
      "congDoans",
      "opCongDoans",
      "dsCongDoans",
      "myFactoryInfor",
    ]),
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
