<template>
  <q-page padding>
    <q-banner class="bg-primary text-orange">
      <div class="row">
        <div class="col-6  text-h6 orange">
          <span color="orange">Báo cáo chi tiết Tồn Thành Phẩm Vanity</span>
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
        <!-- <div v-else>
          <q-toggle
            v-model="showVolumnColumn"
            class="text-orange"
            label="Hiển thị cột Số lượng"
          />
        </div> -->
      </div>
    </q-banner>
    <q-card>
      <q-card-section>
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
            :empty-panel-text="
              'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'
            "
          />
             <DxExport
                :enabled="true"
                :allow-export-selected-data="true"
                file-name="Tồn vanity"
              />
          <DxLoadPanel :enabled="false" />
          <DxScrolling mode="infinite" />
          <DxSorting mode="none" />
          <DxColumn data-field="itemId" :visible="false" />
          <DxColumn data-field="stepId" :visible="false" />
          <DxColumn
            data-field="CODE"
            caption="Mã TP"
          
            sort-order="desc"
           
          />
          <DxColumn data-field="sanpham" caption="Sản phẩm/Chi tiết" sort-order="asc" />
          <!-- <DxColumn caption="Qui Cách" alignment="center">
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
          </DxColumn> -->
          <!-- <DxColumn caption="Tồn đầu kỳ" alignment="center"> -->
            <!-- <DxColumn
              data-field="tonDauKy"
              caption="Số lượng"
              format="fixedpoint"
              :visible="showVolumnColumn"
            /> -->
            <DxColumn
              data-field="tondauky"
              caption="Tồn đầu kỳ"
              data-type="number"
              format="#,##0"
              alignment="center"
            />
              <DxColumn
              data-field="nhap"
              caption="Nhập trong kỳ"
              data-type="number"
              format="#,##0"
               alignment="center"
            /> 
          <!-- </DxColumn> -->
            <!-- <DxColumn
              data-field="nhap"
              caption="Số lượng"
              format="fixedpoint"
              :visible="showVolumnColumn"
            /> <DxColumn caption="Nhập" alignment="center">
         
           
          </DxColumn> -->
          <!-- <DxColumn caption="Xuất" alignment="center"> -->
            <!-- <DxColumn
              data-field="xuat"
              caption="Số lượng"
              format="fixedpoint"
              :visible="showVolumnColumn"
            /> -->
            <DxColumn
              data-field="xuat"
              caption="Số lượng xuất"
              data-type="number"
              format="#,##0"
              alignment="center"
            />
          <!-- </DxColumn> -->
      
          <!-- <DxColumn caption="Tồn cuối kỳ" alignment="center"> -->
            <!-- <DxColumn
              data-field="tonCuoiKy"
              caption="Số lượng"
              format="fixedpoint"
              :visible="showVolumnColumn"
            /> -->
            <DxColumn
              data-field="toncuoiky"
              caption="Tồn còn lại"
              data-type="number"
              format="#,##0"
               alignment="center"
            />
          <!-- </DxColumn> -->
          <DxSummary>
            <DxTotalItem
              column="xuat"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'Tổng: {0}'"
              :value-format="'decimal'"
            />
             <DxTotalItem
              column="tondauky"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'Tổng: {0}'"
              :value-format="'decimal'"
            />
        
            <DxTotalItem
              column="nhap"
              summary-type="sum"
              data-type="number"
              :show-in-group-footer="false"
              :align-by-column="true"
              :display-format="'Tổng: {0}'"
              :value-format="'decimal'"
            />
            <DxTotalItem
              column="toncuoiky"
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
  DxExport,
  DxGroupPanel,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupItem,
  DxTotalItem,
  DxSummary
} from "devextreme-vue/data-grid";
import { mapActions } from "vuex";
import moment from "moment";
import DialogSelectDate from "components/commons/DialogSelectFromDateToDate";
export default {
  // name: 'PageName',
  data() {
    return {
      showChooseDate: false,
      dataSource: [],
      fromDate: moment(),
      toDate: moment(),
      showVolumnColumn: false
    };
  },
  components: {
    DxDataGrid,
    DxScrolling,
    DxSorting,
    DxColumn,
    DxExport,
    DxLoadPanel,
    DxGroupPanel,
    DxColumnChooser,
    DxHeaderFilter,
    DialogSelectDate,
    DxGroupItem,
    DxTotalItem,
    DxSummary
  },
  methods: {
    ...mapActions("prod", ["getTonVanity"]),
    customizeColumns(columns) {
      columns[0].width = 70;
    },
    async loadData() {
      this.dataSource = await this.getTonVanity({
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
  created() {
    this.loadData();
  }
};
</script>
