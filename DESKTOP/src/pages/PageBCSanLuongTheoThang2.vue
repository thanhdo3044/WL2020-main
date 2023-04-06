<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-5 text-blue text-bold" style="font-size: 18px">
          Báo cáo sản lượng - {{ ngaythang }} -
          <span class="text-amber-14">{{
              idDepartment ? idDepartment.label : ""
          }}</span>
        </div>
        <div class="col-4" align="right">
          <q-radio style="font-weight: bold; padding-right: 40px" @input="loadData" color="amber-6" v-model="typeBC"
            val="ngay" label="Ngày" />
          <q-radio style="font-weight: bold; padding-right: 40px" @input="loadData" color="amber-6" v-model="typeBC"
            val="tuan" label="Tuần" />
          <q-radio style="font-weight: bold; padding-right: 40px" color="amber-6" @input="loadData" v-model="typeBC"
            val="nam" label="Tháng" />
          <q-radio v-if="idDepartment && typeBC !== 'ngay'" color="amber-6" style="font-weight: bold" @input="loadData" v-model="type"
            val="sl" label="SL" />
          <q-radio v-if="idDepartment && typeBC !== 'ngay'" color="amber-6" style="font-weight: bold" @input="loadData" v-model="type"
            val="m3" label="M³" />
        </div>
        <div v-if="typeBC !== 'ngay'" class="col-3 text-blue text-bold" align="right">
          <span style="font-size: 18px">Năm: </span>
          <input class="text-amber-14" type="number" @input="changeDate" v-model="year" style="
              border: none;
              background-color: #daf8e1;
              font-size: 18px;
              width: 60px;
            " />
        </div>
         <div v-if="typeBC == 'ngay'" class="col-3 cursor-pointer text-blue text-bold" style="font-size: 18px" align="right"
          @click="showChooseDate = true">
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
          <span class="text-amber-14">{{ denNgay }}</span>
        </div>
      </div>
    </div>
    <q-card>
      <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
        <div class="col-8">
          <div class="row">
            <div class="col-2 col-md-2" v-for="(congDoan, index) in options" :key="index">
              <q-radio dense @input="loadDepartment" v-model="idDepartment" :val="congDoan" :label="congDoan.label"
                style="border-radius: 5px; font-size: 13px" class="text-weight-bold" color="amber-6" />
            </div>
          </div>
        </div>

        <div class="col-4" align="right">
          <q-checkbox v-model="isShow" color="amber-6" style="margin-right:30px" class="text-weight-bold text-blue"
            label="Mở rộng" dense />
          <q-checkbox v-model="isExcel" @input="xuattieude" color="amber-6" class="text-weight-bold text-blue"
            label="Xuất Excel" dense />
        </div>
      </div>
      <div class="row" v-if="departments.length != 0 || idDepartment.id == 102299"
        style="font-size: 12px; vertical-align: top">
        <div class="col-12">
          <table style="border: 1px solid black; width: 100%">
            <tr>
              <td scope="col" style="border-right: 1px solid black">
                <div>
                  <q-checkbox v-if="idDepartment.id == 100000" @input="selectAll()" dense color="amber-6"
                    class="text-blue" style="font-weight: bold" v-model="allDepartmentTH" label="Chọn tất" />
                  <q-checkbox v-if="idDepartment.id == 102340" @input="selectAll()" dense color="amber-6"
                    class="text-blue" style="font-weight: bold" v-model="allDepartmentYS1" label="Chọn tất" />
                  <q-checkbox v-if="idDepartment.id == 102366" @input="selectAll()" dense color="amber-6"
                    class="text-blue" style="font-weight: bold" v-model="allDepartmentTB" label="Chọn tất" />
                  <q-checkbox v-if="idDepartment.id == 102427" @input="selectAll()" dense color="amber-6"
                    class="text-blue" style="font-weight: bold" v-model="allDepartmentQM" label="Chọn tất" />
                  <q-checkbox v-if="idDepartment.id == 102299" @input="selectAll()" dense color="amber-6"
                    class="text-blue" style="font-weight: bold" v-model="allDepartmentCBG" label="Chọn tất" />
                </div>
              </td>
              <td scope="col" style="vertical-align: top" v-for="(value, index) in listGroupDepartment" :key="index">
                <div v-if="checkCountSayPhoi.length > 1">
                  <q-checkbox v-if="value.ORDER == 1" dense @input="chonTatCa(1)" v-model="chonTatcaSayPhoi"
                    :val="value" style="font-weight: bold;color: orange;" label="Chọn tất" />
                </div>
                <div v-if="checkcountLuaPhoi.length > 1">
                  <q-checkbox v-if="value.ORDER == 2" dense @input="chonTatCa(2)" v-model="chonTatcaLuaPhoi"
                    :val="value" style="font-weight: bold;color: orange;" label="Chọn tất" color="warning" />
                </div>
                <div v-if="checkcountSoChe.length > 1">
                  <q-checkbox v-if="value.ORDER == 3" dense @input="chonTatCa(3)" v-model="chonTatcaSoChe" :val="value"
                    style="font-weight: bold;color: orange;" label="Chọn tất" color="amber-6" />
                </div>
                <div v-if="checkcountTinhChe.length > 1">
                  <q-checkbox v-if="value.ORDER == 4" dense @input="chonTatCa(4)" v-model="chonTatcaTinhChe"
                    :val="value" style="font-weight: bold;color: orange;" label="Chọn tất" color="amber-6" />
                </div>
                <div v-if="checkcountHTM.length > 1">
                  <q-checkbox v-if="value.ORDER == 5" dense @input="chonTatCa(5)" v-model="chonTatcaHTM" :val="value"
                    style="font-weight: bold;color: orange;" label="Chọn tất" color="amber-6" />
                </div>
                <div v-if="checkcountHT.length > 1">
                  <q-checkbox v-if="value.ORDER == 6" dense @input="chonTatCa(6)" v-model="chonTatcaHoanThien"
                    :val="value" style="font-weight: bold;color: orange;" label="Chọn tất" color="amber-6" />
                </div>
                <div v-if="checkcountDongGoi.length > 1">
                  <q-checkbox v-if="value.ORDER == 7" dense @input="chonTatCa(7)" v-model="chonTatcaDongGoi"
                    :val="value" style="font-weight: bold;color: orange;" label="Chọn tất" color="amber-6" />
                </div>
                <div>
                  <q-checkbox v-if="idDepartment.id == 102299" @input="loadData" dense v-model="chonCongDoansCBG"
                    :val="value.NAME" style="font-weight: bold" :label="value.NAME" color="amber-6" />
                </div>
                <div v-for="(congDoan, index1) in departments.filter(
                  (d) => d.groupOrder == value.ORDER
                )" :key="index1">
                  <q-checkbox v-if="
                    congDoan.value != 102484 &&
                    congDoan.id != 102490 &&
                    congDoan.factoryId == 100000
                  " @input="loadData" dense v-model="chonCongDoansTH" :val="congDoan.ID" style="font-weight: bold"
                    :label="congDoan.departmentName" color="amber-6" />
                  <q-checkbox v-if="
                    congDoan.value != 102484 &&
                    congDoan.id != 102490 &&
                    congDoan.factoryId == 102340
                  " @input="loadData" dense v-model="chonCongDoansYS1" :val="congDoan.ID" style="font-weight: bold"
                    :label="congDoan.departmentName" color="amber-6" />
                  <q-checkbox v-if="
                    congDoan.value != 102484 &&
                    congDoan.id != 102490 &&
                    congDoan.factoryId == 102366
                  " @input="loadData" dense v-model="chonCongDoansTB" :val="congDoan.ID" style="font-weight: bold"
                    :label="congDoan.departmentName" color="amber-6" />
                  <q-checkbox v-if="
                    congDoan.value != 102484 &&
                    congDoan.id != 102490 &&
                    congDoan.factoryId == 102427
                  " @input="loadData" dense v-model="chonCongDoansQM" :val="congDoan.ID" style="font-weight: bold"
                    :label="congDoan.departmentName" color="amber-6" />
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </q-card>
     <div v-if="typeBC == 'ngay'" class="row">
          <div class="col-12" v-if="dataChart.length != 0 && !isSayPhoi">
            <DxChart id="chart" :data-source="dataChart" title="Biểu đồ sản lượng theo ngày">
               <DxSize :height="420" :width="2000"/>
              <DxCommonSeriesSettings argument-field="ngay" type="bar" hover-mode="allArgumentPoints"
                selection-mode="allArgumentPoints">
              </DxCommonSeriesSettings>

              <DxValueAxis position="left">
                <DxTitle text="M³" />
                <!-- <DxConstantLine
                  :width="2"
                  :value="lowAverage"
                  color="#8c8cff"
                  dash-style="dash"
                >
                  <DxLabel text="Công suất" />
                </DxConstantLine> -->
              </DxValueAxis>
              <DxSeries v-if="dataChart[0].congSuatNgay" name="Công suất" value-field="congSuatNgay" type="spline"
                color="#cfd8dc">
                <!-- <DxLabel :visible="true" background-color="white">
                  <DxFont color="#607d8b" />
                </DxLabel> -->
              </DxSeries>

              <!-- <DxSeries value-field="sayPhoi" name="Sấy phôi" color="#9C27B0" /> -->
              <DxSeries v-if="dataChart.filter(d => d.luaPhoi > 0).length > 0" value-field="luaPhoi" name="Lựa phôi"
                color="#ea7ccc">
              </DxSeries>
              <DxSeries v-if="dataChart.filter(d => d.soChe > 0).length > 0"  value-field="soChe" name="Sơ chế"
                color="#673ab7">
              </DxSeries>
              <DxSeries v-if="dataChart.filter(d => d.tinhChe > 0).length > 0" value-field="tinhChe" name="Tinh chế"
                color="#cddc39">
              </DxSeries>
              <!-- <DxSeries value-field="hoanThienMoc"
                name="Hoàn thiện mộc" color="#42a5f5">
              </DxSeries> -->
              <DxSeries  value-field="hoanThien"
                name="Hoàn thiện" color="#ffc107">
              </DxSeries>
              <DxSeries  value-field="dongGoi" name="Đóng gói"
                color="#4caf50">
              </DxSeries>
              <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
              <DxTooltip :enabled="true" :customize-tooltip="customizeTooltip" />
            </DxChart>
          </div>
          <div class="col-7" style="margin-top: 20px" align="center">
            <span class="title" @click="showDialogDetail"> <u>Xem chi tiết thông tin sản lượng ở đây</u></span>
          </div>
          <div class="col-5"></div>
          <div class="col-7">
            <DxDataGrid id="gridContainer" :data-source="dataSource" :show-borders="true" :show-row-lines="true"
              :hover-state-enabled="true" :row-alternation-enabled="true" :no-data-text="'Vui lòng chọn công đoạn'"
              :show-column-lines="true" :allow-column-resizing="true" @cell-prepared="onCellPrepared"
              @content-ready="onContentReady">
              <DxScrolling mode="virtual" />
              <DxSorting mode="none" />
              <DxGroupPanel :visible="isExcel" :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'" />
              <DxHeaderFilter :visible="true" />
              <DxSorting mode="single" />
              <DxGrouping :auto-expand-all="isShow" />
              <!-- <DxColumn data-field="ID" caption="#" /> -->
              <DxColumn data-field="groupName" caption="" :group-index="0" group-cell-template="groupCellTemplate"
                :sort-index="0" sort-order="asc" />
              <template #groupCellTemplate="{ data }">
                <div style="font-weight: bold">
                  {{ data.value.substring(2) }}
                </div>
              </template>
              <DxColumn data-field="departmentName2" caption="" :group-index="1"
                group-cell-template="groupCellTemplate2" />
              <template #groupCellTemplate2="{ data }">
                <div>{{ data.value }}</div>
              </template>
              <DxColumn data-field="sanPham" caption="Chọn sản phẩm" :group-index="2" />
              <DxColumn data-field="ACCOUNTING_CODE" caption="Mã KT" width="120"/>
              <DxColumn data-field="itemName" caption="Tên" />
              <DxColumn caption="Dầy" data-field="height" format="fixedPoint" alignment="center" width="90" />
              <DxColumn caption="Rộng" data-field="width" format="fixedPoint" alignment="center" width="90" />
              <DxColumn caption="Dài" data-field="length" format="fixedPoint" alignment="center" width="90" />
              <DxColumn data-field="QUANTITY" caption="Số lượng" data-type="number" format="#,##0.##" width="120" />
              <DxColumn data-field="KL" caption="M³" data-type="number" format="#,##0.00" width="120"
                :calculate-cell-value="calculateKL_KL" />
              <DxSummary>
                <!-- <DxTotalItem
                  column="QUANTITY"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'#,##0.####'"
                />-->
                <DxGroupItem column="KL" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.##'" />
              </DxSummary>
              <DxExport :enabled="isExcel" :allow-export-selected-data="false" :file-name="
                'Dữ liệu sản xuất chi tiết từ ngày ' +
                tuNgay +
                ' đến ngày ' +
                denNgay
              " />
            </DxDataGrid>
          </div>
     </div>
    <div v-if="typeBC !== 'ngay'" class="col-12">
      <DxChart v-if="socongdoan.length == 1 && group && dataChart.length > 0" id="chart" :data-source="dataChart"
        :title="'Biểu đồ sản lượng theo ' + ngaythang">
          <DxSize v-if="typeBC == 'tuan'" :height="420" :width="2000"/>
           <DxSize v-if="typeBC == 'nam'" :height="420" :width="2000"/>
        <DxValueAxis>
          <DxTitle text="M³" />
          <!-- <DxVisualRange :start-value="40" /> -->
        </DxValueAxis>
        <DxCommonSeriesSettings v-if="typeBC == 'tuan'" argument-field="tuan" type="bar" hover-mode="allArgumentPoints"
          selection-mode="allArgumentPoints">
        </DxCommonSeriesSettings>
        <DxCommonSeriesSettings v-else argument-field="thang" type="bar" hover-mode="allArgumentPoints"
          selection-mode="allArgumentPoints">
        </DxCommonSeriesSettings>
        <DxSeries v-if="group.groupOrder == 2" value-field="yearOld" :name="'Năm ' + (year - 1)" color="#ea7ccc42" />
        <DxSeries v-if="group.groupOrder == 2" value-field="yearNew" :name="'Năm ' + year" color="#ea7ccc" />

        <DxSeries v-if="group.groupOrder == 3" value-field="yearOld" :name="'Năm ' + (year - 1)" color="#d1c4e9" />
        <DxSeries v-if="group.groupOrder == 3" value-field="yearNew" :name="'Năm ' + year" color="#673ab7" />

        <DxSeries v-if="group.groupOrder == 4" value-field="yearOld" :name="'Năm ' + (year - 1)" color="#f0f4c3" />
        <DxSeries v-if="group.groupOrder == 4" value-field="yearNew" :name="'Năm ' + year" color="#cddc39" />

        <DxSeries v-if="group.groupOrder == 5" value-field="yearOld" :name="'Năm ' + (year - 1)" color="#bbdefb" />
        <DxSeries v-if="group.groupOrder == 5" value-field="yearNew" :name="'Năm ' + year" color="#42a5f5" />

        <DxSeries v-if="group.groupOrder == 6" value-field="yearOld" :name="'Năm ' + (year - 1)" color="#ffecb3" />
        <DxSeries v-if="group.groupOrder == 6" value-field="yearNew" :name="'Năm ' + year" color="#ffc107" />

        <DxSeries v-if="group.groupOrder == 7" value-field="yearOld" :name="'Năm ' + (year - 1)" color="#c5e1a5" />
        <DxSeries v-if="group.groupOrder == 7" value-field="yearNew" :name="'Năm ' + year" color="#4caf50" />
        <DxTooltip :enabled="true" :customize-tooltip="customizeTooltip" />
        <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
        <DxExport :enabled="true" />
      </DxChart>

       <DxChart v-if="socongdoan.length > 1 && dataChart.length > 0 && !isSayPhoi" id="chart" :data-source="dataChart"
        :title="'Biểu đồ sản lượng theo ' + ngaythang">
      
        <DxCommonSeriesSettings argument-field="donvi" type="bar" hover-mode="allArgumentPoints"
          selection-mode="allArgumentPoints">
        </DxCommonSeriesSettings>
      
        <DxSeries value-field="luaPhoi" name="Lựa phôi" color="#ea7ccc" />
        <DxSeries value-field="soChe" name="Sơ chế" color="#673ab7" />
        <DxSeries value-field="tinhChe" name="Tinh chế" color="#cddc39" />
        <!-- <DxSeries value-field="hoanThienMoc" name="Hoàn thiện mộc" color="#42a5f5" /> -->
        <DxSeries value-field="hoanThien" name="Hoàn thiện" color="#ffc107" />
        <DxSeries value-field="dongGoi" name="Đóng gói" color="#4caf50" />
        <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
        <DxTooltip :enabled="true" :customize-tooltip="customizeTooltip" />
      </DxChart> 
    </div>
    <div v-if="typeBC !== 'ngay'" class="col-12" style="margin-top: 20px" align="center">
      <span class="title" @click="showDialogDetail"> <u>Xem chi tiết thông tin sản lượng ở đây</u></span>
    </div>
    <div v-if="typeBC !== 'ngay'" class="col-12">
      <DxDataGrid id="BCSanLuongTheoThang2" :data-source="dataSource" :show-borders="true" :show-row-lines="true"
        :hover-state-enabled="true" :row-alternation-enabled="true" :no-data-text="'Vui lòng chọn công đoạn'"
        :show-column-lines="true" :allow-column-resizing="true" @cell-prepared="onCellPrepared"
        @row-prepared="onRowPrepared" @content-ready="onContentReady">
        <DxScrolling mode="virtual" />
        <DxGroupPanel :visible="isExcel" :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'" />
        <DxSorting mode="none" />
        <DxHeaderFilter :visible="true" />
        <DxSorting mode="single" />
        <DxGrouping :auto-expand-all="isShow" />
        <DxColumn data-field="groupName" caption="" :group-index="0" group-cell-template="groupCellTemplate"
          :sort-index="0" sort-order="asc" />
        <template #groupCellTemplate="{ data }">
          <div style="font-weight: bold">{{ data.value.substring(2) }}</div>
        </template>
        <DxColumn data-field="departmentName2" caption="" :group-index="1" group-cell-template="groupCellTemplate2" />
        <template #groupCellTemplate2="{ data }">
          <div>{{ data.value }}</div>
        </template>
        <DxColumn data-field="sanPham" caption="Chọn sản phẩm" :group-index="2" />
        <DxColumn data-field="itemName" caption="Tên" width="350" :fixed="true" />
        <DxColumn caption="Dầy" data-field="HEIGHT" format="fixedPoint" alignment="center" width="90" :fixed="true" />
        <DxColumn caption="Rộng" data-field="WIDTH" format="fixedPoint" alignment="center" width="90" :fixed="true" />
        <DxColumn caption="Dài" data-field="LENGTH" format="fixedPoint" alignment="center" width="90" :fixed="true" />
        <DxColumn caption="Chủng loại" data-field="typeName" format="fixedPoint" alignment="center" width="180"
          :fixed="true" />
        <DxColumn v-if="typeBC == 'tuan'" caption="Tổng" data-field="total" width="120" format="#,##0.##"
          :fixed="true" />
        <DxColumn v-if="typeBC == 'nam'" caption="Tổng" data-field="total" width="120"
          :calculate-cell-value="calculateTong" format="#,##0.00" :fixed="true" />

        <DxColumn v-if="typeBC == 'tuan'" v-for="(value, index) in listWeek" :key="'m' + index"
          :caption="'Tuần ' + value" :data-field="'week' + value" width="120" alignment="center" format="#,##0.00" />
        <DxColumn v-if="typeBC == 'nam'" v-for="(value, index) in thangs" :key="'y' + index + 20"
          :caption="'Tháng ' + value.id" :data-field="'thang' + value.id" width="120" alignment="center"
          format="#,##0.00" />

        <DxSummary>
          <DxGroupItem v-if="typeBC == 'tuan' && type == 'm3'" v-for="(value, index) in listWeek"
            :key="'w' + index + 10" :column="'week' + value" summary-type="sum" data-type="number"
            :show-in-group-footer="false" :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
          <DxGroupItem v-if="typeBC == 'nam' && type == 'm3'" v-for="(value, index) in thangs" :key="'y' + index + 40"
            :column="'thang' + value.id" summary-type="sum" data-type="number" :show-in-group-footer="false"
            :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
          <DxGroupItem v-if="type == 'm3'" column="total" summary-type="sum" data-type="number"
            :show-in-group-footer="false" :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
        </DxSummary>
        <DxExport :enabled="isExcel" :allow-export-selected-data="false" :file-name="tieude" />
      </DxDataGrid>
    </div>
    <q-dialog v-model="dialog" persistent :maximized="maximizedToggle" transition-show="slide-up"
      transition-hide="slide-down">
      <q-card class="bg-white text-black">
        <q-bar>
          <q-space />

          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">Thông tin sản lượng chi tiết</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <DxDataGrid id="BCSanLuongTheoThang3" :data-source="dataSource" :show-borders="true" :show-row-lines="true"
            :hover-state-enabled="true" :row-alternation-enabled="true" :no-data-text="'Vui lòng chọn công đoạn'"
            :show-column-lines="true" :allow-column-resizing="true" @cell-prepared="onCellPrepared"
            @row-prepared="onRowPrepared" @content-ready="onContentReady"  @exporting="onExporting">
            <DxScrolling mode="virtual" />
            <DxGroupPanel :visible="true" :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'" />
            <DxSorting mode="none" />
            <DxHeaderFilter :visible="true" />
            <DxSorting mode="single" />
            <DxGrouping :auto-expand-all="true" />
            <DxColumn data-field="groupName" caption="" :group-index="0" group-cell-template="groupCellTemplate"
              :sort-index="0" sort-order="asc" />
            <template #groupCellTemplate="{ data }">
              <div style="font-weight: bold">{{ data.value.substring(2) }}</div>
            </template>
            <DxColumn data-field="departmentName2" caption="" :group-index="1"
              group-cell-template="groupCellTemplate2" />
            <template #groupCellTemplate2="{ data }">
              <div>{{ data.value }}</div>
            </template>
            <DxColumn data-field="sanPham" caption="Chọn sản phẩm" :group-index="2" />
             <DxColumn data-field="sanPham" caption="sản phẩm" width="350" :fixed="true" />
            <DxColumn data-field="itemName" caption="Tên" width="350" :fixed="true" />
            <DxColumn caption="Dầy" data-field="HEIGHT" data-type="number" format="fixedPoint" alignment="center" width="90"
              :fixed="true" />
            <DxColumn caption="Rộng" data-field="WIDTH" data-type="number" format="fixedPoint" alignment="center" width="90"
              :fixed="true" />
            <DxColumn caption="Dài" data-field="LENGTH" data-type="number" format="fixedPoint" alignment="center" width="90"
              :fixed="true" />
            <DxColumn v-if="typeBC == 'tuan'" caption="Tổng" data-field="total"  width="120"
              :calculate-cell-value="calculateTongWeek" format="#,##0.##" :fixed="true" />
            <DxColumn v-if="typeBC == 'nam'" caption="Tổng" data-field="total" width="120"
              :calculate-cell-value="calculateTong" format="#,##0.00" :fixed="true" />

            <DxColumn v-if="typeBC == 'tuan'" v-for="(value, index) in listWeek" :key="'m' + index"
              :caption="'Tuần ' + value" :data-field="'week' + value"  data-type="number" width="120" alignment="center"
              format="#,##0.00" />
            <DxColumn v-if="typeBC == 'nam'" v-for="(value, index) in thangs" :key="'y' + index + 20"
              :caption="'Tháng ' + value.id" :data-field="'thang' + value.id"  data-type="number" width="120" alignment="center"
              format="#,##0.00" />

            <DxSummary>
              <DxGroupItem v-if="typeBC == 'tuan' && type == 'm3'" v-for="(value, index) in listWeek"
                :key="'w' + index + 10" :column="'week' + value" summary-type="sum" data-type="number"
                :show-in-group-footer="false" :align-by-column="true" :display-format="'{0}'"
                :value-format="'#,##0.00'" />
              <DxGroupItem v-if="typeBC == 'nam' && type == 'm3'" v-for="(value, index) in thangs"
                :key="'y' + index + 40" :column="'thang' + value.id" summary-type="sum" data-type="number"
                :show-in-group-footer="false" :align-by-column="true" :display-format="'{0}'"
                :value-format="'#,##0.00'" />
              <DxGroupItem v-if="type == 'm3'" column="total" summary-type="sum" data-type="number"
                :show-in-group-footer="false" :align-by-column="true" :display-format="'{0}'"
                :value-format="'#,##0.00'" />
            </DxSummary>
            <DxExport :enabled="true" :allow-export-selected-data="false" :file-name="tieude" />
          </DxDataGrid>
        </q-card-section>
      </q-card>
    </q-dialog>
       <DialogSelectDate :selectDate="chooseDate" :showChooseDate="showChooseDate" :cancelChooseDate="cancelChooseDate" />
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxScrolling,
  DxSorting,
  DxExport,
  DxSummary,
  DxGroupItem,
  DxTotalItem,
  DxHeaderFilter,
  DxColumnChooser,
} from "devextreme-vue/data-grid";
import DialogSelectDate from "../components/commons/DialogSelectFromDateToDate";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN,roundNumber } from "../ultils";
import {
  DxChart,
  DxSeries,
  DxSize,
  DxCommonSeriesSettings,
  DxLabel,
  DxFormat,
  DxLegend,
  DxValueAxis,
  DxTitle,
  DxConstantLine,
  DxFont,
  DxVisualRange,
  DxTooltip
} from "devextreme-vue/chart";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from "devextreme/exporter/exceljs/excelExporter";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxScrolling,
    DxSorting,
    DxPager,
    DialogSelectDate,
    DxPaging,
    DxSearchPanel,
    DxExport,
    DxSummary,
    DxGroupItem,
    DxTotalItem,
    DxHeaderFilter,
    DxColumnChooser,
    DxChart,
    DxSize,
    DxSeries,
    DxCommonSeriesSettings,
    DxLabel,
    DxFormat,
    DxLegend,
    DxValueAxis,
    DxTitle,
    DxConstantLine,
    DxFont,
    DxVisualRange,
    DxTooltip
  },
  data() {
    return {
      dataSource: [],
      dataChart: [],
      congSuat: null,
      isShow: false,
      showChooseDate:false,
      isSayPhoi: true,
      showVolumnColumn: true,
      fromDate: null,
      toDate: null,
      week: moment().week(),
      year: moment().year(),
      month: moment().month() + 1,
      weeks: [
        {
          label: "Thứ 2",
          value: "thu2",
        },
        {
          label: "Thứ 3",
          value: "thu3",
        },
        {
          label: "Thứ 4",
          value: "thu4",
        },
        {
          label: "Thứ 5",
          value: "thu5",
        },
        {
          label: "Thứ 6",
          value: "thu6",
        },
        {
          label: "Thứ 7",
          value: "thu7",
        },
        {
          label: "CN",
          value: "thu1",
        },
      ],
      thangs: [
        { label: 1, id: 1 },
        { label: 2, id: 2 },
        { label: 3, id: 3 },
        { label: 4, id: 4 },
        { label: 5, id: 5 },
        { label: 6, id: 6 },
        { label: 7, id: 7 },
        { label: 8, id: 8 },
        { label: 9, id: 9 },
        { label: 10, id: 10 },
        { label: 11, id: 11 },
        { label: 12, id: 12 },
      ],
      listWeek: [],
      chonCongDoans: [],
      socongdoan:[],
      dulieu: [],
      type: "m3",
      ngaythang: null,
      typeBC: "tuan",
      group: null,
      chonFactoryId: null,
      allDepartmentTH: false,
      allDepartmentYS1: false,
      allDepartmentTB: false,
      allDepartmentQM: false,
      allDepartmentCBG: false,
      chonCongDoansTH: [],
      chonCongDoansYS1: [],
      chonCongDoansTB: [],
      chonCongDoansQM: [],
      chonCongDoansCBG: [],
      listGroupDepartment: [],
      arrDepartment: [],
      arrGroupDepartment: [],
      departments: [],
      departments2: [],
      open: 0,
      isExcel: false,
      tieude: null,
      chonTatcaDongGoi: false,
      chonTatcaHoanThien: false,
      chonTatcaHTM: false,
      chonTatcaTinhChe: false,
      chonTatcaSoChe: false,
      chonTatcaLuaPhoi: false,
      chonTatcaSayPhoi: false,
      checkCountSayPhoi: [],
      checkcountLuaPhoi: [],
      checkcountSoChe: [],
      checkcountTinhChe: [],
        chonngay:false,
      checkcountHTM: [],
      checkcountHT: [],
      checkcountDongGoi: [],
      idDepartment: {
        label: "Nhà máy CBG Thuận Hưng",
        id: 100000,
        code: "TH",
      },
    
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          id: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          id: 102340,
          code: "YS1",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          id: 102366,
          code: "TB",
        },
        // {
        //   label: "Nhà máy CBG Quang Minh",
        //   id: 102427,
        //   code: "QM",
        // },
        {
          label: "Khối Chế biến gỗ",
          id: 102299,
          code: "CBG",
        },
      ],
      dialog: false,
      maximizedToggle: true
    };
  },
  created() {
    if (this.typeBC == "nam") this.ngaythang = "tháng";
    if (this.typeBC == "tuan") this.ngaythang = "tuần";
    if (this.typeBC == "ngay") this.ngaythang = "ngày";
      this.toDate = new Date();
    this.fromDate = new Date();
    this.toDate.setDate(this.toDate.getDate());
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.loadData();
    this.loadListGroupDepartment();
  },
  methods: {
    ...mapActions("prod", [
      "getDepartmentByFactoryId",
      "getSLTheoTuanSL",
      "getSLTheoTuanM3",
      "getSLTheoThangSL2",
      "getSLTheoThangM32",
      "getSLTheoNamSL",
      "getChartSLTheoNam",
       "getSLTheoDay",
      "getChartSLTheoDay",
      "getChartSLTheoTuanSS",
      "getChartSLTheoThangSS",
      "getSocongdoan",
      "getSLTheoNamM3",
      "getDepartmentByFactoryId",
      "getGroupDepartment",
      "getListGroupDepartment",
      "getCongSuatInDepartment",
      "getChartSLTheoWeek",
    ]),
      onExporting(e) {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Employees');

      exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: false,
  
        customizeCell: ({ gridCell, excelCell }) => {
        console.log('dl:',excelCell)
       if (gridCell.rowType === 'group') {
            excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BEDFE6' } };
          //   excelCell.alignment = { horizontal: 'center' };
          }
          if (gridCell.rowType === 'totalFooter' ) {
            excelCell.font.italic = true;
          }
            if (gridCell.column.dataType === 'number' && (excelCell.value>= 0 || excelCell.value<0 )) {
              // console.log('dl:',gridCell.column)
              excelCell.value = roundNumber(excelCell.value,2);
                  excelCell.alignment = { horizontal: 'center' };
             }
            if (gridCell.column.dataField === 'total' && (excelCell.value>= 0 || excelCell.value<0 )) {
              excelCell.value = roundNumber(excelCell.value,2);
                  excelCell.alignment = { horizontal: 'right' };
             }
        },
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'phoiton.xlsx');
        });
      });
      e.cancel = true;
    },
    customizeTooltip({ valueText }) {
      return {
        text: `${parseFloat(valueText).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      };
    },
    showDialogDetail() {
      this.dialog = true;
    },
     cancelChooseDate() {
      this.showChooseDate = false;
    },
     calculateKL_KL(rowData) {
      if (rowData.QUANTITY == 0) {
        return rowData.VOLUMN;
      }
      return rowData.VOLUMN * rowData.QUANTITY;
    },
    calculateTong(rowData) {
      rowData.total =
        rowData.thang1 +
        rowData.thang2 +
        rowData.thang3 +
        rowData.thang4 +
        rowData.thang5 +
        rowData.thang6 +
        rowData.thang7 +
        rowData.thang8 +
        rowData.thang9 +
        rowData.thang10 +
        rowData.thang11 +
        rowData.thang12;
      return rowData.total;
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
    onRowPrepared(e) {
      // var alignByColumn,
      //   groupSummary,
      //   colspan = 0;

      // if (e.rowType === "group") {
      //   groupSummary = e.component.option("summary.groupItems");
      //   console.log("groupSummary",groupSummary)
      //   console.log("eeeeeeeeee",e)

      //   // groupSummary.forEach((el) => {
      //   //   alignByColumn = el.alignByColumn;
      //   //   return !alignByColumn;
      //   // });
      //   // if (alignByColumn) {
      //   //   e.columns.forEach((el) => {
      //   //     if (el.fixed && el.fixedPosition !== "right") {
      //   //       colspan++;
      //   //     }
      //   //   });
      //   // }
      // }
    },
    onContentReady(e) {
      if (this.open == 1) {
        if (this.idDepartment) {
          if (this.idDepartment.id == 102299) {
            e.component.expandAll(0);
            this.open = 0;
          } else {
            e.component.expandAll(0);
            e.component.expandAll(1);
            this.open = 0;
          }
        }
      }
    },
    xuattieude() {
      if (this.idDepartment)
        this.tieude =
          "Báo Cáo sản lượng - " +
          this.ngaythang +
          " - " +
          this.idDepartment.label;
    },
    async loadListGroupDepartment() {
      const data = await this.getListGroupDepartment();
      this.listGroupDepartment = data;
      console.log("listGroupDepartment", data)
    },
    async changeDate() {
      await this.loadData();
      await this.loadDepartment();
    },
    async chooseDate(f, t) {
      this.chonngay = true
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.loadData();
      await this.loadDepartment();
    },
    async loadDepartment() {
      let data = await this.getGroupDepartment();
      if (this.idDepartment.id == 102299) {
        this.departments2 = data;
      }
      data = data.filter((d) => d.factoryId == this.idDepartment.id);
      this.allDepartment = false;
      this.chonCongDoans = [];
      this.departments = data;
      this.loadData();
    },

    async selectAll() {
      this.open = 1;
      if (this.allDepartmentCBG) {
        this.listGroupDepartment.forEach((el) => {
          if (this.idDepartment.id == 102299)
            this.chonCongDoansCBG.push(el.NAME);
        });
      } else this.chonCongDoansCBG = [];
      if (this.allDepartmentYS1) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 102340) this.chonCongDoansYS1.push(el.ID);
        });
      } else this.chonCongDoansYS1 = [];
      if (this.allDepartmentTB) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 102366) this.chonCongDoansTB.push(el.ID);
        });
      } else this.chonCongDoansTB = [];
      if (this.allDepartmentQM) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 102427) this.chonCongDoansQM.push(el.ID);
        });
      } else this.chonCongDoansQM = [];
      if (this.allDepartmentTH) {
        this.departments.forEach((el) => {
          if (this.idDepartment.id == 100000) this.chonCongDoansTH.push(el.ID);
        });
      } else {
        this.chonCongDoansTH = [];
      }
      this.loadData();
    },
    async loadData() {
      this.open = 1;
      let listGroupDepartment = [];
      this.checkCountSayPhoi = [];
      this.checkcountLuaPhoi = [];
      this.checkcountSoChe = [];
      this.checkcountTinhChe = [];
      this.checkcountHTM = [];
      this.checkcountHT = [];
      this.checkcountDongGoi = [];
      listGroupDepartment = this.departments;
      for (let i = 0; i < listGroupDepartment.length; i++) {
        if (listGroupDepartment[i].groupOrder == 1) {
          this.checkCountSayPhoi.push(listGroupDepartment[i]);
        }
        if (listGroupDepartment[i].groupOrder == 2) {
          this.checkcountLuaPhoi.push(listGroupDepartment[i]);
        }
        if (listGroupDepartment[i].groupOrder == 3) {
          this.checkcountSoChe.push(listGroupDepartment[i]);
        }
        if (listGroupDepartment[i].groupOrder == 4) {
          this.checkcountTinhChe.push(listGroupDepartment[i]);
        }
        if (listGroupDepartment[i].groupOrder == 5) {
          this.checkcountHTM.push(listGroupDepartment[i]);
        }
        if (listGroupDepartment[i].groupOrder == 6) {
          this.checkcountHT.push(listGroupDepartment[i]);
        }
        if (listGroupDepartment[i].groupOrder == 7) {
          this.checkcountDongGoi.push(listGroupDepartment[i]);
        }
      }
      if (this.idDepartment) {
        if (this.idDepartment.id == 100000) {
          this.arrDepartment = this.chonCongDoansTH;
        }
        if (this.idDepartment.id == 102340) {
          this.arrDepartment = this.chonCongDoansYS1;
        }
        if (this.idDepartment.id == 102366) {
          this.arrDepartment = this.chonCongDoansTB;
        }
        if (this.idDepartment.id == 102427) {
          this.arrDepartment = this.chonCongDoansQM;
        }
        if (this.idDepartment.id == 102299) {
          this.arrDepartment = this.chonCongDoansCBG;
        }

        let countSayPhoi = 0;
        let countLuaPhoi = 0;
        let countSoChe = 0;
        let countTinhChe = 0;
        let countHTM = 0;
        let countHT = 0;
        let countDongGoi = 0;
        this.checkCountSayPhoi.forEach(e => {
          this.arrDepartment.forEach(el => {
            if (e.ID == el) {
              countSayPhoi++;
            }
          });
        });
        this.checkcountLuaPhoi.forEach(e => {
          this.arrDepartment.forEach(el => {
            if (e.ID == el) {
              countLuaPhoi++;
            }
          });
        });
        this.checkcountSoChe.forEach(e => {
          this.arrDepartment.forEach(el => {
            if (e.ID == el) {
              countSoChe++;
            }
          });
        });
        this.checkcountTinhChe.forEach(e => {
          this.arrDepartment.forEach(el => {
            if (e.ID == el) {
              countTinhChe++;
            }
          });
        });
        this.checkcountHTM.forEach(e => {
          this.arrDepartment.forEach(el => {
            if (e.ID == el) {
              countHTM++;
            }
          });
        });
        this.checkcountHT.forEach(e => {
          this.arrDepartment.forEach(el => {
            if (e.ID == el) {
              countHT++;
            }
          });
        });
        this.checkcountDongGoi.forEach(e => {
          this.arrDepartment.forEach(el => {
            if (e.ID == el) {
              countDongGoi++;
            }
          });
        });
        if (countLuaPhoi == this.checkcountLuaPhoi.length || countLuaPhoi > this.checkcountLuaPhoi.length) {
          this.chonTatcaLuaPhoi = true
        } else {
          this.chonTatcaLuaPhoi = false

        }
        if (countSoChe == this.checkcountSoChe.length || countSoChe > this.checkcountSoChe.length) {
          this.chonTatcaSoChe = true
        } else {
          this.chonTatcaSoChe = false

        }

        if (countTinhChe == this.checkcountTinhChe.length || countTinhChe > this.checkcountTinhChe.length) {
          this.chonTatcaTinhChe = true
        } else {
          this.chonTatcaTinhChe = false
        }

        if (countLuaPhoi == this.checkcountLuaPhoi.length || countLuaPhoi > this.checkcountLuaPhoi.length) {
          this.chonTatcaLuaPhoi = true
        } else {
          this.chonTatcaLuaPhoi = false

        }
        if (countHTM == this.checkcountHTM.length || countHTM > this.checkcountHTM.length) {
          this.chonTatcaHTM = true
        } else {
          this.chonTatcaHTM = false

        }
        if (countHT == this.checkcountHT.length || countHT > this.checkcountHT.length) {
          this.chonTatcaHoanThien = true
        } else {
          this.chonTatcaHoanThien = false
        }

        if (countDongGoi == this.checkcountDongGoi.length || countDongGoi > this.checkcountDongGoi.length) {
          this.chonTatcaDongGoi = true
        } else {
          this.chonTatcaDongGoi = false
        }
//
        if (this.arrDepartment.length == 0) {
          this.dataSource = [];
          this.dataChart = [];
        } else {
          if (this.typeBC == "nam") {
            this.ngaythang = "tháng";
            this.loadDataYear();
          }
          if (this.typeBC == "tuan") {
            this.ngaythang = "tuần";
            this.loadDataWeek();
          }
             if (this.typeBC == "ngay") {
            this.ngaythang = "ngày";
            this.loadDatangay();
          }
        }

      }
    },
    async loadDatangay() {
     if (this.idDepartment.id != 102299) {
        this.socongdoan = await this.getSocongdoan({
         
          arrDepartment: this.arrDepartment,
        });
     } else this.socongdoan = [{
      order:1,
      nam:3,
     },{
      order:2,nam:4,
     }]
        if (this.chonngay == false ) {
        if (this.socongdoan.length == 1)
        {   this.toDate = new Date();
    this.fromDate = new Date();
              this.toDate.setDate(this.toDate.getDate());
    this.fromDate.setDate(this.fromDate.getDate() - 60);
        } else {  this.toDate = new Date();
    this.fromDate = new Date();
              this.toDate.setDate(this.toDate.getDate());
    this.fromDate.setDate(this.fromDate.getDate() - 30);
        }
        }
        let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
        departmentId: this.idDepartment.id,
        arrDepartment: this.arrDepartment,
      };
      let data = [];
      let data3 = [];
      if (this.arrDepartment.length == 0) {
        data = [];
        data3 = [];
      } else {
        data = await this.getSLTheoDay(payload);
        data3 = await this.getChartSLTheoDay(payload);
      }
      if (this.arrDepartment.length == 1 && (this.arrDepartment[0] == 100013 || this.arrDepartment[0] == 102342 || this.arrDepartment[0] == 102368 || this.arrDepartment[0] == "Sấy phôi")) {
        this.isSayPhoi = true;
      } else {
        this.isSayPhoi = false;
      }
      if (data3) {
        this.dataChart = data3;
      }
      this.dataSource = data;
      for (let i = 0; i < this.dataSource.length; i++) {
        if (this.dataSource[i].VOLUMN == 1) {
          this.dataSource[i].VOLUMN = this.dataSource[i].QUANTITY;
          this.dataSource[i].QUANTITY = 0;
        }
      }
    },   
    
    async loadDataYear() {
      if (this.type == "sl") {
        this.dataSource = await this.getSLTheoNamSL({
          year: this.year,
          departmentId: this.idDepartment.id,
          arrDepartment: this.arrDepartment,
        });
      } else {
        this.dataSource = await this.getSLTheoNamM3({
          year: this.year,
          departmentId: this.idDepartment.id,
          arrDepartment: this.arrDepartment,
        });
      }
      // if (this.idDepartment.id == 102299) {
      //   this.dataSource = this.dataSource.filter((i) =>
      //     this.arrDepartment.includes(i.groupDepartment)
      //   );
      // }
      if (this.idDepartment.id != 102299) {
    this.socongdoan = await this.getSocongdoan({
         
          arrDepartment: this.arrDepartment,
        });
      } else this.socongdoan = [{
      order:1,
      nam:3,
     },{
      order:2,nam:4,
     }]
      if (this.socongdoan.length == 1) {

        this.group = this.departments.find(
          (d) => d.ID == this.arrDepartment[0]
        );

        if (this.idDepartment.id == 102299) {
          this.group = this.departments2.find((d) => d.groupName == this.arrDepartment[0]);

        }
        this.dataChart = await this.getChartSLTheoThangSS({
          year: this.year,
          departmentId: this.idDepartment.id,
          stepId: this.arrDepartment,
        });

        if (this.idDepartment.id != 102299) {
          this.loadCongSuat();
        }
      } else {
        let dateNow = moment().add(1, "months");
        let dateNew = dateNow.format("YYYY-MM-01");
        let dateOld = dateNow.subtract(12, "months").format("YYYY-MM-DD");
        this.dataChart = await this.getChartSLTheoNam({
          dateNew: dateNew,
          dateOld: dateOld,
           year: this.year,
          departmentId: this.idDepartment.id,
          arrDepartment: this.arrDepartment,
        });
 
      }
      if (this.arrDepartment.length == 1 && (this.arrDepartment[0] == 100013 || this.arrDepartment[0] == 102342 || this.arrDepartment[0] == 102368 || this.arrDepartment[0] == "Sấy phôi")) {
        this.isSayPhoi = true;
      } else {
        this.isSayPhoi = false;
      }
    },
    async loadDataWeek() {
      let weekStart = 1;
      let weekStartend = 52;
      let strWeek = "";
      this.listWeek = [];
      if (this.month == 1) weekStart = 1;
      for (let i = weekStart; i <= weekStartend; i++) {
        strWeek += `[week${i}],`;
        this.listWeek.push(i);
      }
      strWeek = strWeek.substring(0, strWeek.length - 1);
      if (this.idDepartment.id != 102299) {
 this.socongdoan = await this.getSocongdoan({
         
          arrDepartment: this.arrDepartment,
        });
      }  else this.socongdoan = [{
      order:1,
      nam:3,
     },{
      order:2,nam:4,
     }]
      if (this.type == "sl") {
        this.dataSource = await this.getSLTheoTuanSL({
          year: this.year,
          strWeek: strWeek,
          arrDepartment: this.arrDepartment,
          departmentId: this.idDepartment.id,
        });
      } else {
        this.dataSource = await this.getSLTheoTuanM3({
          year: this.year,
          strWeek: strWeek,
          arrDepartment: this.arrDepartment,
          departmentId: this.idDepartment.id,
        });
      }
      // if (this.idDepartment.id == 102299) {
      //   this.dataSource = this.dataSource.filter((i) =>
      //     this.arrDepartment.includes(i.groupDepartment)
      //   );
      // }
      console.log("this.arrDepartment[0]", this.arrDepartment);
      console.log("this.group", this.group);
      if (this.socongdoan.length == 1) {
        this.group = this.departments.find(
          (d) => d.ID == this.arrDepartment[0]
        );
        if (this.idDepartment.id == 102299) {
          this.group = this.departments2.find((d) => d.groupName == this.arrDepartment[0]);
        }
        console.log("this.group", this.group);
        console.log("this.departments", this.departments);
        this.dataChart = await this.getChartSLTheoTuanSS({
          year: this.year,
          departmentId: this.idDepartment.id,
          stepId: this.arrDepartment,
        });
        console.log("this.arrDepartment[0]", this.arrDepartment);
        if (this.idDepartment.id != 102299) {
          this.loadCongSuat();
        }
      } else {
        this.dataChart = await this.getChartSLTheoWeek({
          year: this.year,
          arrDepartment: this.arrDepartment,
          departmentId: this.idDepartment.id,
        });
      }
      if (this.arrDepartment.length == 1 && (this.arrDepartment[0] == 100013 || this.arrDepartment[0] == 102342 || this.arrDepartment[0] == 102368 || this.arrDepartment[0] == "Sấy phôi")) {
        this.isSayPhoi = true;
      } else {
        this.isSayPhoi = false;
      }
    },
    async loadCongSuat() {
      const payload = {
        departmentId: this.arrDepartment[0],
      };
      const data = await this.getCongSuatInDepartment(payload);
      console.log("data", data);
      if (this.typeBC == "nam") {
        this.congSuat = data[0].CONG_SUAT_TUAN * 4;
      } else {
        this.congSuat = data[0].CONG_SUAT_TUAN;
      }
      if (data[0].CONG_SUAT_TUAN == null) {
        this.congSuat = 0;
      }
      console.log("this.congSuat", this.congSuat);
    },
    async chonTatCa(number) {
      if (number == 1) {
        if (this.chonTatcaSayPhoi) {
          if (this.idDepartment.id == 100000) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 100000 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                  if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTH.push(el.ID); });
          }
          if (this.idDepartment.id == 102340) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102340 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                  if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansYS1.push(el.ID); });
          }
          if (this.idDepartment.id == 102366) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102366 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                  if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTB.push(el.ID); });
          }
          if (this.idDepartment.id == 102427) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102427 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                  if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansQM.push(el.ID); });
          }
          if (this.idDepartment.id == 102299) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102299 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                  if (el.ID == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansCBG.push(el.ID); });
          }
        }
        else {
          this.departments.forEach((el) => {
            if (this.idDepartment.id == 100000 && number == el.groupOrder) { this.chonCongDoansTH.shift(el.ID) }
            if (this.idDepartment.id == 102340 && number == el.groupOrder) { this.chonCongDoansYS1.shift(el.ID) }
            if (this.idDepartment.id == 102366 && number == el.groupOrder) { this.chonCongDoansTB.shift(el.ID) }
            if (this.idDepartment.id == 102427 && number == el.groupOrder) { this.chonCongDoansQM.shift(el.ID) }
            if (this.idDepartment.id == 102299 && number == el.groupOrder) { this.chonCongDoansCBG.shift(el.NAME) }
          });
        }
      }
      else if (number == 2) {
        if (this.chonTatcaLuaPhoi) {
          if (this.idDepartment.id == 100000) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 100000 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                  if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTH.push(el.ID); });
          }
          if (this.idDepartment.id == 102340) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102340 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                  if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansYS1.push(el.ID); });
          }
          if (this.idDepartment.id == 102366) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102366 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                  if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTB.push(el.ID); });
          }
          if (this.idDepartment.id == 102427) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102427 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                  if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansQM.push(el.ID); });
          }
          if (this.idDepartment.id == 102299) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102299 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                  if (el.ID == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansCBG.push(el.ID); });
          }
        } else {
          this.departments.forEach((el) => {
            if (this.idDepartment.id == 100000 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102340 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102366 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102427 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102299 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                if (el.NAME == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
              }
            }
          });
        }
      }
      else if (number == 3) {
        if (this.chonTatcaSoChe) {
          if (this.idDepartment.id == 100000) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 100000 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                  if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTH.push(el.ID); });
          }
          if (this.idDepartment.id == 102340) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102340 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                  if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansYS1.push(el.ID); });
          }
          if (this.idDepartment.id == 102366) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102366 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                  if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTB.push(el.ID); });
          }
          if (this.idDepartment.id == 102427) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102427 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                  if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansQM.push(el.ID); });
          }
          if (this.idDepartment.id == 102299) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102299 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                  if (el.ID == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansCBG.push(el.ID); });
          }
        }
        else {
          this.departments.forEach((el) => {
            if (this.idDepartment.id == 100000 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102340 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102366 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102427 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102299 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                if (el.NAME == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
              }
            }
          });
        }
      }
      else if (number == 4) {
        if (this.chonTatcaTinhChe) {
          if (this.idDepartment.id == 100000) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 100000 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                  if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTH.push(el.ID); });
          }
          if (this.idDepartment.id == 102340) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102340 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                  if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansYS1.push(el.ID); });
          }
          if (this.idDepartment.id == 102366) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102366 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                  if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTB.push(el.ID); });
          }
          if (this.idDepartment.id == 102427) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102427 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                  if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansQM.push(el.ID); });
          }
          if (this.idDepartment.id == 102299) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102299 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                  if (el.ID == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansCBG.push(el.ID); });
          }
        }
        else {
          this.departments.forEach((el) => {
            if (this.idDepartment.id == 100000 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102340 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102366 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102427 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102299 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                if (el.NAME == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
              }
            }
          });
        }
      }
      else if (number == 5) {
        if (this.chonTatcaHTM) {
          if (this.idDepartment.id == 100000) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 100000 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                  if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTH.push(el.ID); });
          }
          if (this.idDepartment.id == 102340) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102340 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                  if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansYS1.push(el.ID); });
          }
          if (this.idDepartment.id == 102366) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102366 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                  if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTB.push(el.ID); });
          }
          if (this.idDepartment.id == 102427) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102427 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                  if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansQM.push(el.ID); });
          }
          if (this.idDepartment.id == 102299) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102299 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                  if (el.ID == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansCBG.push(el.ID); });
          }
        }
        else {
          this.departments.forEach((el) => {
            if (this.idDepartment.id == 100000 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102340 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102366 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102427 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102299 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                if (el.NAME == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
              }
            }
          });
        }
      }
      else if (number == 6) {
        if (this.chonTatcaHoanThien) {
          if (this.idDepartment.id == 100000) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 100000 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                  if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTH.push(el.ID); });
          }
          if (this.idDepartment.id == 102340) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102340 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                  if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansYS1.push(el.ID); });
          }
          if (this.idDepartment.id == 102366) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102366 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                  if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTB.push(el.ID); });
          }
          if (this.idDepartment.id == 102427) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102427 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                  if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansQM.push(el.ID); });
          }
          if (this.idDepartment.id == 102299) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102299 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                  if (el.ID == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansCBG.push(el.ID); });
          }
        }
        else {
          this.departments.forEach((el) => {
            if (this.idDepartment.id == 100000 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102340 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102366 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102427 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102299 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                if (el.NAME == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
              }
            }
          });
        }
      }
      else if (number == 7) {
        if (this.chonTatcaDongGoi) {
          if (this.idDepartment.id == 100000) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 100000 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                  if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTH.push(el.ID); });
          }
          if (this.idDepartment.id == 102340) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102340 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                  if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansYS1.push(el.ID); });
          }
          if (this.idDepartment.id == 102366) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102366 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                  if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansTB.push(el.ID); });
          }
          if (this.idDepartment.id == 102427) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102427 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                  if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansQM.push(el.ID); });
          }
          if (this.idDepartment.id == 102299) {
            this.departments.forEach((el) => {
              if (this.idDepartment.id == 102299 && number == el.groupOrder) {
                for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                  if (el.ID == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
                }
              }
            });
            this.departments.forEach((el) => { if (number == el.groupOrder) this.chonCongDoansCBG.push(el.ID); });
          }
        }
        else {
          this.departments.forEach((el) => {
            if (this.idDepartment.id == 100000 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTH.length; i++) {
                if (el.ID == this.chonCongDoansTH[i]) this.chonCongDoansTH.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102340 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansYS1.length; i++) {
                if (el.ID == this.chonCongDoansYS1[i]) this.chonCongDoansYS1.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102366 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansTB.length; i++) {
                if (el.ID == this.chonCongDoansTB[i]) this.chonCongDoansTB.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102427 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansQM.length; i++) {
                if (el.ID == this.chonCongDoansQM[i]) this.chonCongDoansQM.splice(i, 1);
              }
            }
            if (this.idDepartment.id == 102299 && number == el.groupOrder) {
              for (let i = 0; i < this.chonCongDoansCBG.length; i++) {
                if (el.NAME == this.chonCongDoansCBG[i]) this.chonCongDoansCBG.splice(i, 1);
              }
            }
          });
        }
      }
      this.loadData();
    },
  },
    computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
};
</script>
<style>
#BCSanLuongTheoThang2 {
  height: 290px;
}

#BCSanLuongTheoThang3 {
  height: 700px;
}

.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  font-weight: 500;
  background-color: white;
  width: 280;
}

.dx-datagrid-headers .dx-datagrid-table .dx-row>td {
  border-bottom: 1px solid #ddd;
  font-size: 13px;
  font-weight: bold;
}

.dx-datagrid-summary-item {
  color: black;
  font-weight: 500;
}

.dx-datagrid .dx-row>td {
  font-size: 16px;
}

.title {
  font-size: 18px;
  color: #1976d2;
  font-weight: 500;
}

.dx-group-panel-item:nth-child(1) {
  visibility: hidden;
}

.dx-group-panel-item:nth-child(2) {
  visibility: hidden;
}

.dx-group-panel-item:nth-child(3) {
  margin-left: -130px;
  color: #ffc107;
  font-weight: bold;
  background-color: white;
}

.dx-scrollable-scroll {
  background-color: orange;
}

.dx-scrollable-scroll-content {
  background-color: orange;
}
</style>