<template>
  <q-page>
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo Nhập Xuất Tồn từng công đoạn sản xuất -
          {{ factory1 ? factory1.label : "" }}
        </div>
        <div
          class="col-6 cursor-pointer text-blue text-bold"
          style="font-size: 18px"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
          <span class="text-amber-14">{{ denNgay }}</span>
        </div>
      </div>
    </div>
    <q-card style="padding: 5px">
      <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
        <div class="col-8">
          <div class="row">
            <div
              class="col-2 col-md-2"
              v-for="(congDoan, index) in options"
              :key="index"
            >
              <q-radio
                dense
                @input="onChange"
                v-model="factory1"
                :val="congDoan"
                :label="congDoan.label"
                style="border-radius: 5px; font-size: 13px"
                class="text-weight-bold"
                v-bind:class="{ isActive: true }"
                color="amber-6"
              />
            </div>
          </div>
        </div>
        <div class="col-4" align="right">
          <q-checkbox
            v-model="isShow"
            color="amber-6"
            style="margin-right:30px"
            class="text-weight-bold text-blue"
            label="Mở rộng"
            dense
          />
          <q-checkbox
            v-model="isExcel"
            color="amber-6"
            class="text-weight-bold"
            label="Xuất Excel"
            dense
          />
        </div>
      </div>

      <!-- <div class="row">
        <div class="col-2 col-md-3">
          <q-checkbox
            v-if="factory1.factoryId == 100000"
            @input="selectAll()"
            dense
            color="teal"
            style="color: #f6b024; font-weight: bold"
            v-model="allDepartmentTH"
            label="Chọn tất cả công đoạn"
          />
          <q-checkbox
            v-if="factory1.factoryId == 102427"
            @input="selectAll()"
            dense
            color="teal"
            style="color: #f6b024; font-weight: bold"
            v-model="allDepartmentYS"
            label="Chọn tất cả công đoạn"
          />
          <q-checkbox
            v-if="factory1.factoryId == 102340"
            @input="selectAll()"
            dense
            color="teal"
            style="color: #f6b024; font-weight: bold"
            v-model="allDepartmentYS1B"
            label="Chọn tất cả công đoạn"
          />
          <q-checkbox
            v-if="factory1.factoryId == 102366"
            @input="selectAll()"
            dense
            color="teal"
            style="color: #f6b024; font-weight: bold"
            v-model="allDepartmentTB"
            label="Chọn tất cả công đoạn"
          />
        </div>
      </div>
      <hr v-if="factory1" />
      <div class="row">
        <div
          class="col-2 col-md-2"
          v-for="(congDoan, index) in departments"
          :key="index"
        >
          <q-checkbox
            v-if="
              congDoan.value != 102484 &&
              congDoan.id != 102490 &&
              congDoan.factoryId == 100000
            "
            dense
            v-model="chonCongDoansTH"
            :val="congDoan.value"
            :label="congDoan.label"
            color="teal"
          />
          <q-checkbox
            v-if="
              congDoan.value != 102484 &&
              congDoan.id != 102490 &&
              congDoan.factoryId == 102427
            "
            dense
            v-model="chonCongDoansYS"
            :val="congDoan.value"
            :label="congDoan.label"
            color="teal"
          />
          <q-checkbox
            v-if="
              congDoan.value != 102484 &&
              congDoan.id != 102490 &&
              congDoan.factoryId == 102340
            "
            dense
            v-model="chonCongDoansYS1B"
            :val="congDoan.value"
            :label="congDoan.label"
            color="teal"
          />
          <q-checkbox
            v-if="
              congDoan.value != 102484 &&
              congDoan.id != 102490 &&
              congDoan.factoryId == 102366
            "
            dense
            v-model="chonCongDoansTB"
            :val="congDoan.value"
            :label="congDoan.label"
            color="teal"
          />
        </div>
      </div> -->
   
      <div v-if="factory1" class="col-12">
        <DxDataGrid
          id="gridContainer"
          :data-source="dataSourceFilter"
          :word-wrap-enabled="true"
          :hover-state-enabled="true"
          :row-alternation-enabled="true"
          :selection="{ mode: 'single' }"
          :show-column-lines="true"
          :allow-column-resizing="true"
          @cell-prepared="onCellPrepared"
          @content-ready="onContentReady"
        >
          <!-- <DxColumnChooser :enabled="true" /> -->
          <DxHeaderFilter :visible="true" />
          <DxGroupPanel
            :visible="isExcel"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
          <DxScrolling mode="virtual" />
          <DxSorting mode="none" />
          <DxGrouping :auto-expand-all="true" />
          <!-- <DxEditing :allow-updating="true" mode="cell" /> -->
          <!-- <DxColumn
            data-field="stepId"
            caption="Công đoạn"
            :group-index="0"
            sort-order="desc"
            :sort-index="0"
          >
            <DxLookup
              :data-source="departments"
              display-expr="label"
              value-expr="value"
            />
          </DxColumn> -->
          <DxColumn
            data-field="itemId"
            caption="ID"
            width="80"
            :fixed="true"
            :allowEditing="false"
          />
          <DxColumn
            data-field="chitiet"
            caption="SP/Chi tiết"
            cssClass="ColorSP"
            width="250"
            :fixed="true"
            :allowEditing="false"
          />
          <DxColumn
            data-field="tong"
            caption="Tổng"
            :group-index="0"
            :allowEditing="false"
          />
          <DxColumn
            data-field="market"
            caption="Sản phẩm"
            :group-index="1"
            :sort-index="1"
            sort-order="desc"
            :allowEditing="false"
          />
          <DxColumn
            caption="Qui Cách"
            alignment="center"
            :allowEditing="false"
            :fixed="true"
          >
            <DxColumn
              caption="Dầy"
              data-field="height"
              alignment="center"
              width="80"
              :fixed="true"
              :allowEditing="false"
            />
            <DxColumn
              caption="Rộng"
              data-field="width"
              alignment="center"
              width="80"
              :fixed="true"
              :allowEditing="false"
            />
            <DxColumn
              caption="Dài"
              data-field="length"
              alignment="center"
              width="80"
              :fixed="true"
              :allowEditing="false"
            />
          </DxColumn>
          <DxColumn
            caption="Hệ số"
            data-field="heso"
            alignment="center"
            width="80"
            :fixed="true"
            :allowEditing="false"
           
          />
          <DxColumn
            caption="Khối lượng"
            data-field="VOLUMN"
            alignment="center"
            width="90"
            :fixed="true"
            :allowEditing="false"
            format="#,##0.###0"
          />
          <!-- <DxColumn
            caption="SƠ CHẾ"
            alignment="center"
            :allowEditing="false"
            cssClass="ColorSC1"
          >
            <DxColumn
              data-field="tondkM_SC"
              caption="Tồn đầu kỳ (M³)"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              cssClass="ColorSC tonDauKy"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="nhapTHM_SC"
              caption="Nhập TH"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorSC"
              width="100"
              format="#,##0.##"
            />
            <DxColumn
              data-field="nhapYSM_SC"
              caption="Nhập YS1"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorSC"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="nhapTBM_SC"
              caption="Nhập TB"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorSC"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="nhapkhacM_SC"
              caption="Nhập khác"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorSC"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="xuatM_SC"
              caption="Xuất"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              cssClass="ColorSC"
              width="80"
              :visible="true"
              format="#,##0.##"
            />

            <DxColumn
              data-field="loiM_SC"
              caption="Lỗi"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorSC"
              width="80"
              format="#,##0.##"
            />
            <DxColumn
              data-field="tonckM_SC"
              caption="Tồn cuối kỳ (M³)"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              cssClass="ColorSC tonDauKy"
              width="100"
              format="#,##0.##"
            />
          </DxColumn> -->
          <DxColumn
            caption="TINH CHẾ"
            alignment="center"
            :allowEditing="false"
            cssClass="ColorTC1"
          >
            <!-- <DxColumn
              data-field="tondkM_TC"
              caption="Tồn đầu kỳ (M³)"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              cssClass="ColorTC tonDauKy"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="nhapTHM_TC"
              caption="Nhập TH"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorTC"
              width="100"
              format="#,##0.##"
            />
            <DxColumn
              data-field="nhapYSM_TC"
              caption="Nhập YS1"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorTC"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="nhapTBM_TC"
              caption="Nhập TB"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorTC"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="nhapkhacM_TC"
              caption="Nhập khác"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorTC"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="xuatM_TC"
              caption="Xuất"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              cssClass="ColorTC"
              width="80"
              :visible="true"
              format="#,##0.##"
            />

            <DxColumn
              data-field="loiM_TC"
              caption="Lỗi"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorTC"
              width="80"
              format="#,##0.##"
            /> -->
            <DxColumn
              data-field="tonckM_TC"
              caption="Tồn cuối kỳ (M³)"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              cssClass="ColorTC tonDauKy"
              width="100"
              format="#,##0.##"
            />
              <DxColumn
              data-field="tonckM_TCM"
              caption="Tồn cuối kỳ (SL)"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              cssClass="ColorTC tonDauKy"
              width="100"
              format="#,##0.##"
               :calculate-cell-value="calculateTongM3_TC"
            />
                 <DxColumn
              data-field="dongbo_TC"
              caption="% Đồng bộ từng chi tiết"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="120"
              format="#,##0%"
            
              :calculate-cell-value="calculateTongDB_TC"
            />
               <DxColumn
            data-field="tldongbo_TC"
            caption="Tỷ lệ % đồng bộ từng SP"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            :visible="true"
            :width="120"
            format="#,##0.##"
            
          />
          </DxColumn>
          <!-- <DxColumn
            caption="HOÀN THIỆN MỘC"
            alignment="center"
            :allowEditing="false"
          >
            <DxColumn
              data-field="tondkM_HTM"
              caption="tồn đầu kỳ"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              width="100"
              format="#,##0.###0"
            />

            <DxColumn
              data-field="nhapTHM_HTM"
              caption="nhập TH"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              width="100"
              format="#,##0.###0"
            />
            <DxColumn
              data-field="nhapYSM_HTM"
              caption="Nhập YS"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              width="100"
              format="#,##0.###0"
            />

            <DxColumn
              data-field="nhapTBM_HTM"
              caption="Nhập TB"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              width="100"
              format="#,##0.###0"
            />

            <DxColumn
              data-field="nhapkhacM_HTM"
              caption="Nhập khác"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              width="100"
              format="#,##0.###0"
            />

            <DxColumn
              data-field="xuatM_HTM"
              caption="Xuất"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              width="80"
              :visible="true"
              format="#,##0.###0"
            />

            <DxColumn
              data-field="loiM_HTM"
              caption="Lỗi"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              width="80"
              format="#,##0.###0"
            />
            <DxColumn
              data-field="tonckM_HTM"
              caption="Tồn cuối kỳ"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              width="100"
              format="#,##0.###0"
            />
          </DxColumn> -->
          <!-- <DxColumn
            caption="HOÀN THIỆN - LAU DẦU"
            alignment="center"
            :allowEditing="false"
          >
            <DxColumn
              data-field="tondkM_HTD"
              caption="tồn đầu kỳ"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              width="100"
              format="#,##0.###0"
            />

            <DxColumn
              data-field="nhapTHM_HTD"
              caption="nhập TH"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              width="100"
              format="#,##0.###0"
            />
            <DxColumn
              data-field="nhapYSM_HTD"
              caption="Nhập YS"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              width="100"
              format="#,##0.###0"
            />

            <DxColumn
              data-field="nhapTBM_HTD"
              caption="Nhập TB"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              width="100"
              format="#,##0.###0"
            />

            <DxColumn
              data-field="nhapkhacM_HTD"
              caption="Nhập khác"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              width="100"
              format="#,##0.###0"
            />

            <DxColumn
              data-field="xuatM_HTD"
              caption="Xuất"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              width="80"
              :visible="true"
              format="#,##0.###0"
            />

            <DxColumn
              data-field="loiM_HTD"
              caption="Lỗi"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              width="80"
              format="#,##0.###0"
            />
            <DxColumn
              data-field="tonckM_HTD"
              caption="Tồn cuối kỳ"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              width="100"
              format="#,##0.###0"
            />
          </DxColumn> -->
          <DxColumn
            caption="HOÀN THIỆN"
            alignment="center"
            :allowEditing="false"
            cssClass="ColorHT1"
          >
            <!-- <DxColumn
              data-field="tondkM_S"
              caption="Tồn đầu kỳ (M³)"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              cssClass="ColorHT tonDauKy"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="nhapTHM_S"
              caption="Nhập TH"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorHT"
              width="100"
              format="#,##0.##"
            />
            <DxColumn
              data-field="nhapYSM_S"
              caption="Nhập YS1"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorHT"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="nhapTBM_S"
              caption="Nhập TB"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorHT"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="nhapkhacM_S"
              caption="Nhập khác"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorHT"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="xuatM_S"
              caption="Xuất"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              cssClass="ColorHT"
              width="80"
              :visible="true"
              format="#,##0.##"
            />

            <DxColumn
              data-field="loiM_S"
              caption="Lỗi"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorHT"
              width="80"
              format="#,##0.##"
            /> -->
            <DxColumn
              data-field="tonckM_S"
              caption="Tồn cuối kỳ (M³)"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              cssClass="ColorHT tonDauKy"
              width="100"
              format="#,##0.##"
            /> <DxColumn
              data-field="tonckM_SM"
              caption="Tồn cuối kỳ (SL)"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              cssClass="ColorHT tonDauKy"
              width="100"
              format="#,##0"
               :calculate-cell-value="calculateTongM3_S"
            />
                 <DxColumn
              data-field="dongbo_S"
              caption="% Đồng bộ từng chi tiết"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="120"
              format="#,##0%"
            
              :calculate-cell-value="calculateTongDB_S"
            />
               <DxColumn
            data-field="tldongbo_S"
            caption="Tỷ lệ % đồng bộ từng SP"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            :visible="true"
            :width="120"
            format="#,##0.###0"
            
          />
          </DxColumn>
          <DxColumn
            caption="ĐÓNG GÓI"
            alignment="center"
            :allowEditing="false"
            cssClass="ColorDG1"
          >
            <!-- <DxColumn
              data-field="tondkM_DG"
              caption="Tồn đầu kỳ (M³)"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              cssClass="ColorDG tonDauKy"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="nhapTHM_DG"
              caption="Nhập TH"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorDG"
              width="100"
              format="#,##0.##"
            />
            <DxColumn
              data-field="nhapYSM_DG"
              caption="Nhập YS1"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorDG"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="nhapTBM_DG"
              caption="Nhập TB"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorDG"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="nhapkhacM_DG"
              caption="Nhập khác"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorDG"
              width="100"
              format="#,##0.##"
            />

            <DxColumn
              data-field="xuatM_DG"
              caption="Xuất"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              cssClass="ColorDG"
              width="80"
              :visible="true"
              format="#,##0.##"
            />

            <DxColumn
              data-field="loiM_DG"
              caption="Lỗi"
              data-type="number"
              alignment="center"
              :allowEditing="false"
              cssClass="ColorDG"
              width="80"
              format="#,##0.##"
            /> -->
            <DxColumn
              data-field="tonckM_DG"
              caption="Tồn cuối kỳ (M³)"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              cssClass="ColorDG tonDauKy"
              width="100"
              format="#,##0.##"
            />
             <DxColumn
              data-field="tonckM_DGM"
              caption="Tồn cuối kỳ (SL)"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              cssClass="ColorDG tonDauKy"
              width="100"
              format="#,##0.##"
               :calculate-cell-value="calculateTongM3_DG"
            />
                 <DxColumn
              data-field="dongbo_DG"
              caption="% Đồng bộ từng chi tiết"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              :visible="true"
              :width="120"
              format="#,##0%"
            
              :calculate-cell-value="calculateTongDB_DG"
            />
               <DxColumn
            data-field="tldongbo_DG"
            caption="Tỷ lệ % đồng bộ từng SP"
            data-type="number"
            alignment="center"
            :allowEditing="true"
            :visible="true"
            :width="120"
            format="#,##0.###0"
            
          />
          </DxColumn>
          <DxSummary :calculate-custom-summary="calculateAreaSummary">
                 <DxGroupItem
             name="AreaSummary_TC"
              :show-in-group-footer="false"
              :align-by-column="true"
              show-in-column="tonckM_TCM"
              summary-type="custom"
              value-format="#,##0"
              display-format="{0}"
            />
              <DxGroupItem
             name="AreaSummaryM_TC"
              :show-in-group-footer="false"
              :align-by-column="true"
              show-in-column="dongbo_TC"
              summary-type="custom"
              value-format="#,##0.##"
              display-format="{0}"
            />
              <DxGroupItem
              name="AreaSummarytldongbo_TC"
              show-in-column="tldongbo_TC"
              :show-in-group-footer="false"
              :align-by-column="true"
              summary-type="custom"
              value-format="###0%"
              display-format="{0}"
            />
             <DxGroupItem
             name="AreaSummary_S"
              :show-in-group-footer="false"
              :align-by-column="true"
              show-in-column="tonckM_SM"
              summary-type="custom"
              value-format="#,##0"
              display-format="{0}"
            />
              <DxGroupItem
             name="AreaSummaryM_S"
              :show-in-group-footer="false"
              :align-by-column="true"
              show-in-column="dongbo_S"
              summary-type="custom"
              value-format="#,##0.##"
              display-format="{0}"
            />
              <DxGroupItem
              name="AreaSummarytldongbo_S"
              show-in-column="tldongbo_S"
              :show-in-group-footer="false"
              :align-by-column="true"
              summary-type="custom"
              value-format="###0%"
              display-format="{0}"
            />
             <DxGroupItem
             name="AreaSummary_DG"
              :show-in-group-footer="false"
              :align-by-column="true"
              show-in-column="tonckM_DGM"
              summary-type="custom"
              value-format="#,##0"
              display-format="{0}"
            />
              <DxGroupItem
             name="AreaSummaryM_DG"
              :show-in-group-footer="false"
              :align-by-column="true"
              show-in-column="dongbo_DG"
              summary-type="custom"
              value-format="#,##0.##"
              display-format="{0}"
            />
              <DxGroupItem
              name="AreaSummarytldongbo_DG"
              show-in-column="tldongbo_DG"
              :show-in-group-footer="false"
              :align-by-column="true"
              summary-type="custom"
              value-format="###0%"
              display-format="{0}"
            />
            <DxGroupItem
                name="khoiluongSP"
              show-in-column="VOLUMN"
              summary-type="custom"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="###0.##"
              display-format="{0}"
            />
            <!-- <DxGroupItem
              column="tondkM_SC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="nhapTHM_SC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="nhapYSM_SC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="nhapTBM_SC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="nhapkhacM_SC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="xuatM_SC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="loiM_SC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="tonckM_SC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="tondkM_TC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            /> -->
            <!-- <DxGroupItem
              column="nhapTHM_TC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="nhapYSM_TC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="nhapTBM_TC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="nhapkhacM_TC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="xuatM_TC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="loiM_TC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            /> -->
            <DxGroupItem
              column="tonckM_TC"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <!-- <DxGroupItem
              column="tondkM_HTM"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            />
              <DxGroupItem
              column="nhapTHM_HTM"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            />
               <DxGroupItem
              column="nhapYSM_HTM"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            />
               <DxGroupItem
              column="nhapTBM_HTM"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            />
              <DxGroupItem
              column="nhapkhacM_HTM"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            />
              <DxGroupItem
              column="xuatM_HTM"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            />
              <DxGroupItem
              column="loiM_HTM"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            />
              <DxGroupItem
              column="tonckM_HTM"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            />
               <DxGroupItem
              column="tondkM_HTD"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            />
              <DxGroupItem
              column="nhapTHM_HTD"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            />
               <DxGroupItem
              column="nhapYSM_HTD"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            />
               <DxGroupItem
              column="nhapTBM_HTD"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            />
              <DxGroupItem
              column="nhapkhacM_HTD"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            />
              <DxGroupItem
              column="xuatM_HTD"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            />
              <DxGroupItem
              column="loiM_HTD"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            />
              <DxGroupItem
              column="tonckM_HTD"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.####"
              display-format="{0}"
            /> -->
            <!-- <DxGroupItem
              column="tondkM_S"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="nhapTHM_S"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="nhapYSM_S"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="nhapTBM_S"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="nhapkhacM_S"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="xuatM_S"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="loiM_S"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            /> -->
            <DxGroupItem
              column="tonckM_S"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <!-- <DxGroupItem
              column="tondkM_DG"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="nhapTHM_DG"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="nhapYSM_DG"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="nhapTBM_DG"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="nhapkhacM_DG"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="xuatM_DG"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <DxGroupItem
              column="loiM_DG"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            /> -->
            <DxGroupItem
              column="tonckM_DG"
              summary-type="sum"
              :show-in-group-footer="false"
              :align-by-column="true"
              value-format="#,##0.##"
              display-format="{0}"
            />
            <!-- <DxTotalItem
              column="name"
              summary-type="count"
                 :show-in-group-footer="false"
              :align-by-column="true"
              value-format="fixedpoint"
              display-format="Tổng cộng : "
            />
            <DxTotalItem
              column="nhapTHM_SC"
              summary-type="sum"
                 :show-in-group-footer="false"
              :align-by-column="true"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="nhapYSM_SC"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="xuatM_SC"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="nhapTBM_SC"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="tonckM_SC"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="tondkM_SC"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="nhapkhacM_SC"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="loiM_SC"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            /> -->
          </DxSummary>
          <DxExport
            :enabled="isExcel"
            :allow-export-selected-data="false"
            :file-name="'In Tồn Phôi'"
          />
          <DxSearchPanel
            :visible="isExcel"
            :placeholder="'Tìm kiếm'"
            :width="400"
            align="center"
          />
        </DxDataGrid>
      </div>
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
import moment from "moment";
import { formatDateVN,roundNumber } from "../ultils";
import DialogSelectDate from "components/commons/DialogSelectFromDateToDate";
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxExport,
  DxLookup,
  DxGroupItem,
  DxColumnChooser,
  DxHeaderFilter,
  DxSummary,
  DxTotalItem,
  DxGroupPanel,
  DxScrolling,
  DxSorting,
  DxGrouping,
} from "devextreme-vue/data-grid";
export default {
  // name: 'PageName',
  components: {
    DxDataGrid,
    DxColumn,
    DxSearchPanel,
    DxExport,
    DxLookup,
    DxGroupItem,
    DxColumnChooser,
    DxHeaderFilter,
    DxSummary,
    DxTotalItem,
    DxGroupPanel,
    DxScrolling,
    DxSorting,
    DxGrouping,
    DialogSelectDate,
  },
  data() {
    return {
      showChooseDate: false,
      fromDate: moment().startOf("month"),
      toDate: moment(),
      isExcel: false,
      isShow: false,
      showVolumnColumn: false,
      factory1: false,
      allDepartment: false,
      allDepartmentTH: false,
      allDepartmentYS: false,
      allDepartmentYS1B: false,
      allDepartmentTB: false,
      data2: [],
      tocongdoan: [],
      departments: [],
      chonCongDoans: [],
      chonCongDoansTH: [],
      chonCongDoansYS: [],
      chonCongDoansYS1B: [],
      chonCongDoansTB: [],
      stepId: null, // string,
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102340,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102366,
          code: "TB",
        },
        // {
        //   label: "Nhà máy CBG Quang Minh",
        //   factoryId: 102427,
        //   code: "QM",
        // },
      ],
    };
  },
  computed: {
    ...mapGetters("base", [
      "opCongDoans",
      "myFactoryInfor",
      "userInfo",
      "dsCongDoans",
    ]),
    ...mapGetters("keHoach", ["tonPhois"]),
    dataSourceFilter() {
     
      return this.tonPhois;
    },

    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  methods: {
    ...mapActions("keHoach", ["getTonsByStepId"]),
    ...mapActions("base", ["getAllCongDoans"]),
    async loadData() {
      let payload = {
        startDate: moment(this.fromDate).format("YYYY-MM-DD 05:00:00"),
        endDate: moment(this.toDate)
          .add(1, "day")
          .format("YYYY-MM-DD 05:59:59"),
        factoryId: this.factory1.factoryId,
        stepId: 100000,
      };
      await this.getTonsByStepId(payload);
    },
    onCellPrepared(e) {
      if (e.rowType === "group") {
        if (e.row.groupIndex == 0) {
          e.cellElement.style.backgroundColor = "#64b5f6";
        }
        if (e.row.groupIndex == 1) {
          e.cellElement.style.backgroundColor = "#bbdefb";
        }
      }
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },
 calculateTongM3_TC(e) {
  e.tonckM_TCM = roundNumber(e.tonckM_TC/(e.VOLUMN*e.heso),0)
    return  e.tonckM_TCM;
 },
     calculateTongDB_TC(h) {
      let mindg = 10000000;
      let data = null;
      data = this.dataSourceFilter.filter((d) => d.market == h.market);
      // console.log('dong bo:',data[0].TONGCONG)
      
      for (let i = 0; i < data.length; i++) {
        if (data[i].tonckM_TC>0) {
        if (mindg > data[i].tonckM_TC/(data[i].VOLUMN*data[i].heso)) mindg = roundNumber(data[i].tonckM_TC/(data[i].VOLUMN*data[i].heso),0);
        }
      }
      if (mindg == 10000000) return 0;
      else return (h.tonckM_TC /h.VOLUMN)/ (mindg*h.heso);
    },
     calculateTongM3_S(e) {
  e.tonckM_SM = roundNumber(e.tonckM_S/(e.VOLUMN*e.heso),0)
    return  e.tonckM_SM;
 },
     calculateTongDB_S(h) {
      let mindg = 10000000;
      let data = null;
      data = this.dataSourceFilter.filter((d) => d.market == h.market);
      // console.log('dong bo:',data[0].TONGCONG)
      
      for (let i = 0; i < data.length; i++) {
        if (data[i].tonckM_S>0) {
        if (mindg > data[i].tonckM_S/(data[i].VOLUMN*data[i].heso)) mindg = roundNumber(data[i].tonckM_S/(data[i].VOLUMN*data[i].heso),0);
        }
      }
      if (mindg == 10000000) return 0;
      else return (h.tonckM_S /h.VOLUMN)/ (mindg*h.heso);
    },
     calculateTongM3_DG(e) {
  e.tonckM_DGM = roundNumber(e.tonckM_DG/(e.VOLUMN*e.heso),0)
    return  e.tonckM_DGM;
 },
     calculateTongDB_DG(h) {
      let mindg = 10000000;
      let data = null;
      data = this.dataSourceFilter.filter((d) => d.market == h.market);
      // console.log('dong bo:',data[0].TONGCONG)
      
      for (let i = 0; i < data.length; i++) {
        if (data[i].tonckM_DG>0) {
        if (mindg > data[i].tonckM_DG/(data[i].VOLUMN*data[i].heso)) mindg = roundNumber(data[i].tonckM_DG/(data[i].VOLUMN*data[i].heso),0);
        }
      }
      if (mindg == 10000000) return 0;
      else return (h.tonckM_DG /h.VOLUMN)/ (mindg*h.heso);
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadData();
    },
    async selectAll() {
      if (this.allDepartmentYS) {
        this.departments.forEach((el) => {
          if (this.factory1.factoryId == 102427)
            this.chonCongDoansYS.push(el.value);
        });
      } else this.chonCongDoansYS = [];
      if (this.allDepartmentYS1B) {
        this.departments.forEach((el) => {
          if (this.factory1.factoryId == 102340)
            this.chonCongDoansYS1B.push(el.value);
        });
      } else this.chonCongDoansYS1B = [];
      if (this.allDepartmentTB) {
        this.departments.forEach((el) => {
          if (this.factory1.factoryId == 102366)
            this.chonCongDoansTB.push(el.value);
        });
      } else this.chonCongDoansTB = [];
      if (this.allDepartmentTH) {
        this.departments.forEach((el) => {
          if (this.factory1.factoryId == 100000)
            this.chonCongDoansTH.push(el.value);
        });
      } else {
        this.chonCongDoansTH = [];
      }
    },
        calculateAreaSummary(options) {
      if (options.name === "AreaSummary_TC") {
        if (options.summaryProcess === "start") {
       this.tongkl_TC = 0;
        this.tongTT_TC = 0;
          this.tongSX_TC = 10000000;
        }
        if (options.summaryProcess === "calculate") {
         
          if (options.value.tonckM_TCM>0) {
               this.tongTT_TC += options.value.VOLUMN*options.value.heso;
          if (this.tongSX_TC > options.value.tonckM_TCM)
            this.tongSX_TC = options.value.tonckM_TCM;
          }
          if (this.tongSX_TC != 10000000)
          this.tongkl_TC = this.tongSX_TC*this.tongTT_TC
          if (this.tongSX_TC == 10000000 )
           options.totalValue = 0
          else
          options.totalValue = this.tongSX_TC
          
        }
      }
           if (options.name === "AreaSummaryM_TC") {
        if (options.summaryProcess === "start") {
     
        }
        if (options.summaryProcess === "calculate") {
       
          options.totalValue = this.tongkl_TC
          
        }
      }
         if (options.name === "AreaSummarytldongbo_TC") {
        if (options.summaryProcess === "start") {
            this.tongm3_TC = 0;
        }
        if (options.summaryProcess === "calculate") {
       this.tongm3_TC += options.value.tonckM_TC
       if (this.tongm3_TC!=0)
          options.totalValue = this.tongkl_TC/this.tongm3_TC
          
        }
      }
      //HT
       if (options.name === "AreaSummary_S") {
        if (options.summaryProcess === "start") {
       this.tongkl_S = 0;
        this.tongTT_S = 0;
          this.tongSX_S = 10000000;
        }
        if (options.summaryProcess === "calculate") {
         
          if (options.value.tonckM_SM>0) {
               this.tongTT_S += options.value.VOLUMN*options.value.heso;
          if (this.tongSX_S > options.value.tonckM_SM)
            this.tongSX_S = options.value.tonckM_SM;
          }
          if (this.tongSX_S != 10000000)
          this.tongkl_S = this.tongSX_S*this.tongTT_S
          if (this.tongSX_S == 10000000 )
           options.totalValue = 0
          else
          options.totalValue = this.tongSX_S
          
        }
      }
           if (options.name === "AreaSummaryM_S") {
        if (options.summaryProcess === "start") {
     
        }
        if (options.summaryProcess === "calculate") {
       
          options.totalValue = this.tongkl_S
          
        }
      }
         if (options.name === "AreaSummarytldongbo_S") {
        if (options.summaryProcess === "start") {
            this.tongm3_S = 0;
        }
        if (options.summaryProcess === "calculate") {
       this.tongm3_S += options.value.tonckM_S
       if (this.tongm3_S!=0)
          options.totalValue = this.tongkl_S/this.tongm3_S
          
        }
      }
      //DG
       if (options.name === "AreaSummary_DG") {
        if (options.summaryProcess === "start") {
       this.tongkl_DG = 0;
        this.tongTT_DG = 0;
          this.tongSX_DG = 10000000;
        }
        if (options.summaryProcess === "calculate") {
         
          if (options.value.tonckM_DGM>0) {
               this.tongTT_DG += options.value.VOLUMN*options.value.heso;
          if (this.tongSX_DG > options.value.tonckM_DGM)
            this.tongSX_DG = options.value.tonckM_DGM;
          }
          if (this.tongSX_DG != 10000000)
          this.tongkl_DG = this.tongSX_DG*this.tongTT_DG
          if (this.tongSX_DG == 10000000 )
           options.totalValue = 0
          else
          options.totalValue = this.tongSX_DG
          
        }
      }
         if (options.name === "khoiluongSP") {
        if (options.summaryProcess === "start") {
     this.khoiluongsp = 0
        }
        if (options.summaryProcess === "calculate") {
          if (options.value.tonckM_S != null) {
               this.khoiluongsp += options.value.VOLUMN
          }
          options.totalValue = this.khoiluongsp
          
        }
      }
           if (options.name === "AreaSummaryM_DG") {
        if (options.summaryProcess === "start") {
     
        }
        if (options.summaryProcess === "calculate") {
       
          options.totalValue = this.tongkl_DG
          
        }
      }
         if (options.name === "AreaSummarytldongbo_DG") {
        if (options.summaryProcess === "start") {
            this.tongm3_DG = 0;
        }
        if (options.summaryProcess === "calculate") {
       this.tongm3_DG += options.value.tonckM_DG
       if (this.tongm3_DG!=0)
          options.totalValue = this.tongkl_DG/this.tongm3_DG
          
        }
      }
        },
    async onChange(value) {
      //  this.allDepartment = false;
      this.loadData();
      //   await this.getAllCongDoans({ factoryId: value.factoryId });
      // let congdoan = this.dsCongDoans
      //   .filter(
      //     (s) =>
      //       (s.id != 100264 &&
      //         s.id != 100274 &&
      //         s.id != 102347 &&
      //         s.id != 102370 &&
      //         s.id != 102789 &&
      //         s.id != 102809 &&
      //         s.type2 === "to" &&
      //         s.type == "Tổ") ||
      //       s.id == 102460 ||
      //       s.id == 102488
      //   )
      //   .map((o) => ({
      //     label: o.name,
      //     value: o.id,
      //     description: `[${o.code}] ${o.name}`,
      //     icon: "mail",
      //     factoryId: o.factoryId,
      //   }));

      // this.stepId = null;
      // this.data2 = congdoan;

      // this.departments = this.data2.filter((d) =>
      //   this.checkDepartment(d.value)
      // );

      // this.loadData();
    },
    checkDepartment(id) {
      let data = null;
      data = this.tonPhois.find((s) => s.stepId == id);
      if (data) {
        return true;
      } else {
        return false;
      }
    },
  },
  async created() {
    this.tonPhois = [];
    //  await this.getAllCongDoans({ factoryId:100000})
  },
  mounted() {},
};
</script>
<style>
#gridContainer {
  height: 900px;
}
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: rgb(0 0 0 / 87%);
  background-color: #f7f7f7;
  font-weight: 900;
}
.dx-datagrid-headers .ColorSC1 {
  color: black;
  background-color: #673ab7;
  font-weight: 500;
  font-size: 32px;
}
.dx-datagrid-headers .ColorTC1 {
  color: black;
  background-color: #cddc39;
  font-weight: 500;
  font-size: 32px;
}
.dx-datagrid-headers .ColorHT1 {
  color: black;
  background-color: #ffc107;
  font-weight: 500;
  font-size: 32px;
}
.dx-datagrid-headers .ColorDG1 {
  color: black;
  background-color: #4caf50;
  font-weight: 500;
  font-size: 32px;
}
.dx-datagrid-headers .tonDauKy {
  color: red;
}
.ColorSP {
  color: black;

  font-weight: 500;
  font-size: 32px;
}
.title {
  font-size: 18px;
  color: #1976d2;
  font-weight: 500;
}
.active {
  color: #f6b024;
}
.dx-scrollable-scroll{
  background-color: orange;
}
.dx-scrollable-scroll-content{
  background-color: orange;
}
</style>
