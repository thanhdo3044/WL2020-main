<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-3 text-blue text-bold" style="font-size: 18px">
          Báo cáo sản lượng theo ngày -
          <span class="text-amber-14">{{ factoryName }}</span>
        </div>
        <div class="col-4" align="right">
          <q-radio style="font-weight: bold; padding-right: 40px" @input="chonXuong" color="amber-6" v-model="typeBC"
            val="ngay" label="Ngày" />
          <q-radio style="font-weight: bold; padding-right: 40px" @input="chonXuong" color="amber-6" v-model="typeBC"
            val="tuan" label="Tuần" />
          <q-radio style="font-weight: bold; padding-right: 40px" @input="chonXuong" color="amber-6" v-model="typeBC"
            val="nam" label="Tháng" />
        </div>
        <div class="col-2">
          <q-radio v-if="typeBC == 'tuan'" style="font-weight: bold; padding-right: 40px" @input="chonXuong"
            color="amber-6" v-model="TuanM3" val="SL" label="SL" />
          <q-radio v-if="typeBC == 'tuan'" style="font-weight: bold; padding-right: 40px" @input="chonXuong"
            color="amber-6" v-model="TuanM3" val="M3" label="M³" />
          <q-radio v-if="typeBC == 'nam'" style="font-weight: bold; padding-right: 40px" @input="chonXuong"
            color="amber-6" v-model="ThangM3" val="SL" label="SL" />
          <q-radio v-if="typeBC == 'nam'" style="font-weight: bold; padding-right: 40px" @input="chonXuong"
            color="amber-6" v-model="ThangM3" val="M3" label="M³" />
        </div>
        <div v-if="typeBC !== 'ngay'" class="col-3 text-blue text-bold" align="right">
          <span style="font-size: 18px">Năm: </span>
          <input class="text-amber-14" type="number" @input="changeDate" v-model="year"
            style="border: none;background-color: #daf8e1;font-size: 18px;width: 60px;" />
        </div>
        <div v-if="typeBC == 'ngay'" class="col-3 cursor-pointer text-blue text-bold" style="font-size: 18px"
          align="right" @click="showChooseDate = true">
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
          <span class="text-amber-14">{{ denNgay }}</span>
        </div>
      </div>
    </div>
    <q-card class="my-card">
      <!-- radio check nha may + xuong -->
      <div style="padding: 5px">
        <!-- chọn nhà máy -->
        <div class="row" style="padding-bottom: 15px;">
          <div class="col-1">
            <label style="font-weight: bold;display: block;">Chọn nhà máy : </label>
          </div>
          <div class="col-7">
            <div class="row" style="padding-bottom: 15px;">
              <div class="col-2 col-md-2" v-for="(congDoan, index) in options" :key="index">
                <q-radio dense @input="onChange" v-model="factory" :val="congDoan" :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px" class="text-weight-bold" v-bind:class="{ isActive: true }"
                  color="amber-6" />
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
        <!-- chọn xưởng -->
        <div class="row" style="padding-bottom: 15px;">
          <div class="col-1">
            <label style="font-weight: bold;display: block;">Chọn xưởng : </label>
          </div>
          <div class="col-10">
            <div class="row">
              <div class="col-2 col-md-2" v-for="(congDoan, index) in xuongs" :key="index">
                <q-radio dense @input="chonXuong" v-model="xuong" :val="congDoan" :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px" class="text-weight-bold" v-bind:class="{ isActive: true }"
                  color="amber-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- checkbox routing -->
      <!-- <div v-show="this.showDepartment"> -->
      <div v-if="this.xuong == null">
      </div>
      <div v-else>
        <div v-show="this.showDepartment == 1">
          <table style="border: 1px solid black;width: 100%">

            <th v-for="departmentys2 in departmentYS2" :key="departmentys2.index">
              <q-checkbox v-model="cbDepartmentYS2" :val="departmentys2" style="font-weight: bold"
                :label="departmentys2.NAME" color="amber-6" @input="selectedDepartment" />
            </th>
          </table>
        </div>
        <div v-show="this.showDepartment == 2">
          <table style="border: 1px solid black;width: 100%">

            <th v-for="departmentViforex in departmentViforex" :key="departmentViforex.index">
              <q-checkbox v-model="cbdepartmentViforex" :val="departmentViforex" style="font-weight: bold"
                :label="departmentViforex.NAME" color="amber-6" @input="selectedDepartment" />
            </th>
          </table>
        </div>
        <div v-show="this.showDepartment == 3">
          <table style="border: 1px solid black;width: 100%">
            <th v-for="departmentYS3 in departmentYS3" :key="departmentYS3.index">
              <q-checkbox v-model="cbdepartmentYS3" :val="departmentYS3" style="font-weight: bold"
                :label="departmentYS3.NAME" color="amber-6" @input="selectedDepartment" />
            </th>
          </table>
        </div>
        <div v-show="this.showDepartment == 4">
          <table style="border: 1px solid black;width: 100%">
            <th v-for="departmentChiemHoa in departmentChiemHoa" :key="departmentChiemHoa.index">
              <q-checkbox v-model="cbdepartmentChiemHoa" :val="departmentChiemHoa" style="font-weight: bold"
                :label="departmentChiemHoa.NAME" color="amber-6" @input="selectedDepartment" />
            </th>
          </table>
        </div>
        <div v-show="this.showDepartment == 5">
          <table style="border: 1px solid black;width: 100%">
            <th scope="col" style="border-right: 1px solid black">
              <q-checkbox v-model="allViforexLVL" style="font-weight: bold" label="Chọn tất" color="amber-6" dense
                class="text-blue" @input="selectAllViforexLVL" />
            </th>
            <th v-for="departmentViforexLVL in departmentViforexLVL" :key="departmentViforexLVL.index">
              <q-checkbox v-model="cbdepartmentViforexLVL" :val="departmentViforexLVL" style="font-weight: bold"
                :label="departmentViforexLVL.NAME" color="amber-6" @input="selectedDepartment" />
            </th>
          </table>
        </div>
        <div v-show="this.showDepartment == 6">
          <table style="border: 1px solid black;width: 100%">
            <th scope="col" style="border-right: 1px solid black">
              <q-checkbox v-model="allViforexPlywood" style="font-weight: bold" label="Chọn tất" color="amber-6" dense
                class="text-blue" @input="selectAllViforexPlywood" />
            </th>
            <th v-for="departmentViforexPlywood in departmentViforexPlywood" :key="departmentViforexPlywood.index">
              <q-checkbox v-model="cbdepartmentViforexPlywood" :val="departmentViforexPlywood" style="font-weight: bold"
                :label="departmentViforexPlywood.NAME" color="amber-6" @input="selectedDepartment" />
            </th>
          </table>
        </div>
        <div v-show="this.showDepartment == 7">
          <table style="border: 1px solid black;width: 100%">
            <th scope="col" style="border-right: 1px solid black">
              <q-checkbox v-model="allYS3Plywood" style="font-weight: bold" label="Chọn tất" color="amber-6" dense
                class="text-blue" @input="selectAllYS3Plywood" />
            </th>
            <th v-for="departmentYS3Plywood in departmentYS3Plywood" :key="departmentYS3Plywood.index">
              <q-checkbox v-model="cbdepartmentYS3Plywood" :val="departmentYS3Plywood" style="font-weight: bold"
                :label="departmentYS3Plywood.NAME" color="amber-6" @input="selectedDepartment" />
            </th>
          </table>
        </div>
        <div v-show="this.showDepartment == 8">
          <table style="border: 1px solid black;width: 100%">
            <th scope="col" style="border-right: 1px solid black">
              <q-checkbox v-model="allYS3LVL" style="font-weight: bold" label="Chọn tất" color="amber-6" dense
                class="text-blue" @input="selectAllYS3LVL" />
            </th>
            <th v-for="departmentYS3LVL in departmentYS3LVL" :key="departmentYS3LVL.index">
              <q-checkbox v-model="cbdepartmentYS3LVL" :val="departmentYS3LVL" style="font-weight: bold"
                :label="departmentYS3LVL.NAME" color="amber-6" @input="selectedDepartment" />
            </th>
          </table>
        </div>
        <div v-show="this.showDepartment == 9">
          <table style="border: 1px solid black;width: 100%">
            <th scope="col" style="border-right: 1px solid black">
              <q-checkbox v-model="allChiemHoaLVL" style="font-weight: bold" label="Chọn tất" color="amber-6" dense
                class="text-blue" @input="selectAllChiemHoaLVL" />
            </th>
            <th v-for="departmentChiemHoaLVL in departmentChiemHoaLVL" :key="departmentChiemHoaLVL.index">
              <q-checkbox v-model="cbdepartmentChiemHoaLVL" :val="departmentChiemHoaLVL" style="font-weight: bold"
                :label="departmentChiemHoaLVL.NAME" color="amber-6" @input="selectedDepartment" />
            </th>
          </table>
        </div>
        <div v-show="this.showDepartment == 10">
          <table style="border: 1px solid black;width: 100%">
            <th scope="col" style="border-right: 1px solid black">
              <q-checkbox v-model="allChiemHoaPlywood" style="font-weight: bold" label="Chọn tất" color="amber-6" dense
                class="text-blue" @input="selectAllChiemHoaPlywood" />
            </th>
            <th v-for="departmentChiemHoaPlywood in departmentChiemHoaPlywood" :key="departmentChiemHoaPlywood.index">
              <q-checkbox v-model="cbdepartmentChiemHoaPlywood" :val="departmentChiemHoaPlywood"
                style="font-weight: bold" :label="departmentChiemHoaPlywood.NAME" color="amber-6"
                @input="selectedDepartment" />
            </th>
          </table>
        </div>
      </div>
      <!-- </div> -->
      <!-- biểu đồ ngày -->
      <div v-if="typeBC == 'ngay'">
        <q-card v-if="dataChartNgay.length != 0">
          <DxChart id="chart" :data-source="dataChartNgay" title="Biểu đồ sản lượng theo ngày">
            <DxCommonSeriesSettings argument-field="ngay" type="bar" hover-mode="allArgumentPoints"
              selection-mode="allArgumentPoints">
            </DxCommonSeriesSettings>
            <DxLoadingIndicator :enabled="true" />
            <DxValueAxis position="left">
              <DxTitle text="M³" />
            </DxValueAxis>
            <DxSeries v-if="dataChartNgay.filter(d => d.taovan > 0).length > 0" value-field="taovan" name="Tạo ván"
              color="#ea7ccc">
            </DxSeries>
            <DxSeries v-if="dataChartNgay.filter(d => d.lenlop > 0).length > 0" value-field="lenlop" name="Lên lớp"
              color="#cfd8dc">
            </DxSeries>
            <DxSeries v-if="dataChartNgay.filter(d => d.locvan > 0).length > 0" value-field="locvan" name="Lọc ván"
              color="#673ab7">
            </DxSeries>
            <DxSeries v-if="dataChartNgay.filter(d => d.khovancot > 0).length > 0" value-field="khovancot"
              name="Kho ván cốt" color="#cddc39">
            </DxSeries>
            <DxSeries v-if="dataChartNgay.filter(d => d.danmat > 0).length > 0" value-field="danmat" name="Dán mặt"
              color="#ffc107">
            </DxSeries>
            <DxSeries v-if="dataChartNgay.filter(d => d.hoanthien > 0).length > 0" value-field="hoanthien"
              name="Hoàn thiện" color="#4caf50">
            </DxSeries>
            <DxSeries v-if="dataChartNgay.filter(d => d.khotp > 0).length > 0" value-field="khotp"
              name="Kho thành phẩm">
            </DxSeries>
            <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
            <DxTooltip :enabled="true" :customize-tooltip="customizeTooltip" />
          </DxChart>
          <!-- -------------------------------------------------ngay------------------------------------------------------>
          <div class="row">
            <div class="col-8">
              <DxDataGrid :data-source="dataSourceNgay" :word-wrap-enabled="true" :no-data-text="'Không có dữ liệu !'"
                :show-borders="true" :show-row-lines="true" :show-column-lines="true" @cell-prepared="onCellPrepared">
                <DxHeaderFilter :visible="true" :allow-column-resizing="true" />
                <DxGrouping :auto-expand-all="isShow" />
                <DxExport :enabled="isExcel" :allow-export-selected-data="false" :file-name="
                  'Dữ liệu sản xuất chi tiết từ ngày ' +
                  tuNgay +
                  ' đến ngày ' +
                  denNgay
                " />
                <DxColumn caption="Công đoạn" data-field="NAME" :width="150" :group-index="0" />
                <DxColumn caption="Chi tiết" data-field="ITEM_NAME" :width="280" />
                <DxColumn caption="Dài" data-field="length" :width="90" alignment="center" />
                <DxColumn caption="Rộng" data-field="width" :width="90" alignment="center" />
                <DxColumn caption="Dày" data-field="height" :width="90" alignment="center" />
                <DxColumn caption="Tổng (SL)" data-field="QUANTITY" data-type="number" format="#,##0.00" :width="120"
                  alignment="center" />
                <DxColumn caption="Tổng (M³)" data-field="volumnM3" data-type="number" format="#,##0.00" :width="120"
                  alignment="center" />
                <DxSummary>
                  <DxGroupItem column="QUANTITY" summary-type="sum" data-type="number" :show-in-group-footer="false"
                    :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0'" />
                  <DxGroupItem column="volumnM3" summary-type="sum" data-type="number" :show-in-group-footer="false"
                    :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.0000'" />
                </DxSummary>
              </DxDataGrid>
            </div>
            <div class="col-4"></div>
          </div>
        </q-card>
        <q-card v-else>
          <div style="margin-top: 20px" align="center">
            <span class="title"> <u>Không có dữ liệu</u></span>
          </div>
        </q-card>
      </div>
      <!-- ------------------------------------------------ tuan ------------------------------------------------------->
      <div v-else-if="typeBC == 'tuan'">
        <q-card>

          <DxChart id="chart" :data-source="dataChartTuan" title="Biểu đồ sản lượng theo tuần">
            <DxCommonSeriesSettings argument-field="WEEK" type="bar" hover-mode="allArgumentPoints"
              selection-mode="allArgumentPoints">
            </DxCommonSeriesSettings>
            <DxLoadingIndicator :enabled="true" />
            <DxValueAxis position="left">
              <DxTitle text="M3" />
            </DxValueAxis>
            <DxSeries v-if="dataChartTuan.filter(d => d.taovan > 0).length > 0" value-field="taovan" name="Tạo ván"
              color="#ea7ccc">
            </DxSeries>
            <DxSeries v-if="dataChartTuan.filter(d => d.lenlop > 0).length > 0" value-field="lenlop" name="Lên lớp"
              color="#cfd8dc">
            </DxSeries>
            <DxSeries v-if="dataChartTuan.filter(d => d.locvan > 0).length > 0" value-field="locvan" name="Lọc ván"
              color="#673ab7">
            </DxSeries>
            <DxSeries v-if="dataChartTuan.filter(d => d.khovancot > 0).length > 0" value-field="khovancot"
              name="Kho ván cốt" color="#cddc39">
            </DxSeries>
            <DxSeries v-if="dataChartTuan.filter(d => d.danmat > 0).length > 0" value-field="danmat" name="Dán mặt"
              color="#ffc107">
            </DxSeries>
            <DxSeries v-if="dataChartTuan.filter(d => d.hoanthien > 0).length > 0" value-field="hoanthien"
              name="Hoàn thiện" color="#4caf50">
            </DxSeries>
            <DxSeries v-if="dataChartTuan.filter(d => d.khotp > 0).length > 0" value-field="khotp"
              name="Kho thành phẩm">
            </DxSeries>
            <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
            <DxTooltip :enabled="true" :customize-tooltip="customizeTooltip" />
          </DxChart>
          <!-- -----------------------------------------------------bảng tuần-------------------------------------------------->
          <div class="row">
            <div class="col-12" style="margin-top: 20px" align="center">
              <span class="title" @click="showDialogDetail"> <u>Xem chi tiết thông tin sản lượng ở đây</u></span>
            </div>
          </div>
          <q-card-section class="q-pt-none">
            <DxDataGrid :data-source="dataSourceTuan" :word-wrap-enabled="true" :no-data-text="'Không có dữ liệu !'"
              :show-borders="true" :show-row-lines="true" :show-column-lines="true" @cell-prepared="onCellPrepared">
              <DxHeaderFilter :visible="true" :allow-column-resizing="true" />
              <DxGrouping :auto-expand-all="isShow" />
              <DxScrolling mode="virtual" />
              <DxExport :enabled="isExcel" :allow-export-selected-data="false" :file-name="
                'Dữ liệu sản xuất chi tiết từ ngày ' +
                tuNgay +
                ' đến ngày ' +
                denNgay
              " />
              <DxColumn caption="Công đoạn" data-field="NAME" :width="150" :group-index="0" />
              <DxColumn caption="Chi tiết" data-field="ITEM_NAME" :width="280" :fixed="true" />
              <DxColumn caption="Dài" data-field="length" :width="90" alignment="center" :fixed="true" />
              <DxColumn caption="Rộng" data-field="width" :width="90" alignment="center" :fixed="true" />
              <DxColumn caption="Dày" data-field="height" :width="90" alignment="center" :fixed="true" />
              <!-- <DxColumn caption="ĐVT" data-field="UNIT_NAME" :width="90" alignment="center" :fixed="true" /> -->
              <DxColumn v-if="TuanM3 == 'SL'" caption="SL" data-field="total" data-type="number" format="#,##0.00"
                :width="120" alignment="center" :fixed="true" />
              <DxColumn v-if="TuanM3 == 'M3'" caption="M³" data-field="total" data-type="number" format="#,##0.00"
                :width="120" alignment="center" :fixed="true" />
              <DxColumn caption="Tuần 1" data-field="w1" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 2" data-field="w2" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 3" data-field="w3" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 4" data-field="w4" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 5" data-field="w5" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 6" data-field="w6" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 7" data-field="w7" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 8" data-field="w8" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 9" data-field="w9" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 10" data-field="w10" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 11" data-field="w11" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 12" data-field="w12" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 13" data-field="w13" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 14" data-field="w14" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 15" data-field="w15" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 16" data-field="w16" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 17" data-field="w17" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 18" data-field="w18" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 19" data-field="w19" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 20" data-field="w20" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 21" data-field="w21" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 22" data-field="w22" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 23" data-field="w23" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 24" data-field="w24" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 25" data-field="w25" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 26" data-field="w26" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 27" data-field="w27" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 28" data-field="w28" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 29" data-field="w29" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 30" data-field="w30" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 31" data-field="w31" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 32" data-field="w32" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 33" data-field="w33" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 34" data-field="w34" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 35" data-field="w35" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 36" data-field="w36" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 37" data-field="w37" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 38" data-field="w38" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 39" data-field="w39" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 40" data-field="w40" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 41" data-field="w41" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 42" data-field="w42" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 43" data-field="w43" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 44" data-field="w44" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 45" data-field="w45" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 46" data-field="w46" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 47" data-field="w47" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 48" data-field="w48" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 49" data-field="w49" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 50" data-field="w50" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 51" data-field="w51" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 52" data-field="w52" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 53" data-field="w53" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxSummary>
                <DxGroupItem column="total" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0'" />
                <DxGroupItem v-for="(value, index) in listWeek" :key="index" :column="'w' + value" summary-type="sum"
                  data-type="number" :show-in-group-footer="false" :align-by-column="true" :display-format="'{0}'"
                  :value-format="'#,##0.00'" />
                <!-- <DxGroupItem column="total" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.0000'" /> -->
              </DxSummary>
            </DxDataGrid>
          </q-card-section>
        </q-card>
      </div>
      <!-- ------------------------------------------------ Thang ------------------------------------------------------->
      <div v-else>
        <q-card v-if="dataChartThang.length != 0">
          <DxChart id="chart" :data-source="dataChartThang" title="Biểu đồ sản lượng theo tháng">
            <DxCommonSeriesSettings argument-field="MONTH" type="bar" hover-mode="allArgumentPoints"
              selection-mode="allArgumentPoints">
            </DxCommonSeriesSettings>
            <DxLoadingIndicator :enabled="true" />
            <DxValueAxis position="left">
              <DxTitle text="M3" />
            </DxValueAxis>
            <DxSeries v-if="dataChartThang.filter(d => d.taovan > 0).length > 0" value-field="taovan" name="Tạo ván"
              color="#ea7ccc">
            </DxSeries>
            <DxSeries v-if="dataChartThang.filter(d => d.lenlop > 0).length > 0" value-field="lenlop" name="Lên lớp"
              color="#cfd8dc">
            </DxSeries>
            <DxSeries v-if="dataChartThang.filter(d => d.locvan > 0).length > 0" value-field="locvan" name="Lọc ván"
              color="#673ab7">
            </DxSeries>
            <DxSeries v-if="dataChartThang.filter(d => d.khovancot > 0).length > 0" value-field="khovancot"
              name="Kho ván cốt" color="#cddc39">
            </DxSeries>
            <DxSeries v-if="dataChartThang.filter(d => d.danmat > 0).length > 0" value-field="danmat" name="Dán mặt"
              color="#ffc107">
            </DxSeries>
            <DxSeries v-if="dataChartThang.filter(d => d.hoanthien > 0).length > 0" value-field="hoanthien"
              name="Hoàn thiện" color="#4caf50">
            </DxSeries>
            <DxSeries v-if="dataChartThang.filter(d => d.khotp > 0).length > 0" value-field="khotp"
              name="Kho thành phẩm">
            </DxSeries>
            <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
            <DxTooltip :enabled="true" :customize-tooltip="customizeTooltip" />
          </DxChart>
          <!-- ------------------------------------------------------------------------------------------------------->
          <div class="row">
            <div class="col-12" style="margin-top: 20px" align="center">
              <span class="title" @click="showDialogDetail"> <u>Xem chi tiết thông tin sản lượng ở đây</u></span>
            </div>
          </div>
          <q-card-section class="q-pt-none">
            <DxDataGrid :data-source="dataSourceThang" :word-wrap-enabled="true" :no-data-text="'Không có dữ liệu !'"
              :show-borders="true" :show-row-lines="true" :show-column-lines="true" @cell-prepared="onCellPrepared">
              <DxHeaderFilter :visible="true" :allow-column-resizing="true" />
              <DxGrouping :auto-expand-all="isShow" />
              <DxScrolling mode="virtual" />
              <DxExport :enabled="isExcel" :allow-export-selected-data="false" :file-name="
                'Dữ liệu sản xuất chi tiết từ ngày ' +
                tuNgay +
                ' đến ngày ' +
                denNgay
              " />
              <DxColumn caption="Công đoạn" data-field="NAME" :width="150" :group-index="0" />
              <DxColumn caption="Chi tiết" data-field="ITEM_NAME" :width="280" :fixed="true" />
              <DxColumn caption="Dài" data-field="length" :width="90" alignment="center" :fixed="true" />
              <DxColumn caption="Rộng" data-field="width" :width="90" alignment="center" :fixed="true" />
              <DxColumn caption="Dày" data-field="height" :width="90" alignment="center" :fixed="true" />
              <DxColumn caption="ĐVT" data-field="UNIT_NAME" :width="90" alignment="center" :fixed="true" />
              <DxColumn v-if="ThangM3 == 'SL'" caption="Tổng (SL)" data-field="total" data-type="number"
                format="#,##0.00" :width="120" alignment="center" :fixed="true" />
              <DxColumn v-if="ThangM3 == 'M3'" caption="Tổng (M³)" data-field="total" data-type="number"
                format="#,##0.00" :width="120" alignment="center" :fixed="true" />
              <DxColumn caption="Tháng 1" data-field="January" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 2" data-field="February" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 3" data-field="March" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 4" data-field="April" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 5" data-field="May" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 6" data-field="June" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 7" data-field="July" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 8" data-field="August" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 9" data-field="September" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 10" data-field="October" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 11" data-field="November" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 12" data-field="December" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxSummary>
                <DxGroupItem column="total" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="January" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="February" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="March" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="April" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="May" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="June" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="July" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="August" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="September" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="October" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="November" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="December" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
              </DxSummary>
            </DxDataGrid>
          </q-card-section>
        </q-card>
        <q-card v-else>
          <div style="margin-top: 20px" align="center">
            <span class="title"> <u>Không có dữ liệu</u></span>
          </div>
        </q-card>
      </div>
    </q-card>
    <DxLoadPanel :visible="loadingVisible" :show-indicator="true" :show-pane="true" :shading="true" :on-shown="onShown"
      shading-color="rgba(0,0,0,0.4)" />
    <DialogSelectDate :selectDate="chooseDate" :showChooseDate="showChooseDate" :cancelChooseDate="cancelChooseDate" />
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
        <div style="width:100%" v-if="this.typeBC == 'tuan'">
          <q-card-section class="q-pt-none">
            <DxDataGrid :data-source="dataSourceTuan" :word-wrap-enabled="true" :no-data-text="'Không có dữ liệu !'"
              :show-borders="true" :show-row-lines="true" :show-column-lines="true" @cell-prepared="onCellPrepared">
              <DxHeaderFilter :visible="true" :allow-column-resizing="true" />
              <DxGrouping auto-expand-all=true />
              <DxScrolling mode="virtual" />
              <DxExport enabled=true :allow-export-selected-data="false" :file-name="
                'Dữ liệu sản xuất chi tiết từ ngày ' +
                tuNgay +
                ' đến ngày ' +
                denNgay
              " />
              <DxColumn caption="Công đoạn" data-field="NAME" :width="150" :group-index="0" />
              <DxColumn caption="Chi tiết" data-field="ITEM_NAME" :width="280" :fixed="true" />
              <DxColumn caption="Dài" data-field="length" :width="90" alignment="center" :fixed="true" />
              <DxColumn caption="Rộng" data-field="width" :width="90" alignment="center" :fixed="true" />
              <DxColumn caption="Dày" data-field="height" :width="90" alignment="center" :fixed="true" />
              <!-- <DxColumn caption="ĐVT" data-field="UNIT_NAME" :width="90" alignment="center" :fixed="true" /> -->
              <DxColumn v-if="TuanM3 == 'SL'" caption="SL" data-field="total" data-type="number" format="#,##0.00"
                :width="120" alignment="center" :fixed="true" />
              <DxColumn v-if="TuanM3 == 'M3'" caption="M³" data-field="total" data-type="number" format="#,##0.00"
                :width="120" alignment="center" :fixed="true" />
              <DxColumn caption="Tuần 1" data-field="w1" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 2" data-field="w2" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 3" data-field="w3" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 4" data-field="w4" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 5" data-field="w5" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 6" data-field="w6" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 7" data-field="w7" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 8" data-field="w8" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 9" data-field="w9" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 10" data-field="w10" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 11" data-field="w11" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 12" data-field="w12" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 13" data-field="w13" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 14" data-field="w14" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 15" data-field="w15" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 16" data-field="w16" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 17" data-field="w17" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 18" data-field="w18" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 19" data-field="w19" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 20" data-field="w20" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 21" data-field="w21" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 22" data-field="w22" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 23" data-field="w23" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 24" data-field="w24" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 25" data-field="w25" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 26" data-field="w26" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 27" data-field="w27" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 28" data-field="w28" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 29" data-field="w29" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 30" data-field="w30" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 31" data-field="w31" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 32" data-field="w32" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 33" data-field="w33" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 34" data-field="w34" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 35" data-field="w35" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 36" data-field="w36" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 37" data-field="w37" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 38" data-field="w38" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 39" data-field="w39" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 40" data-field="w40" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 41" data-field="w41" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 42" data-field="w42" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 43" data-field="w43" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 44" data-field="w44" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 45" data-field="w45" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 46" data-field="w46" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 47" data-field="w47" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 48" data-field="w48" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 49" data-field="w49" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 50" data-field="w50" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 51" data-field="w51" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 52" data-field="w52" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tuần 53" data-field="w53" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxSummary>
                <DxGroupItem column="total" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0'" />
                <DxGroupItem v-for="(value, index) in listWeek" :key="index" :column="'w' + value" summary-type="sum"
                  data-type="number" :show-in-group-footer="false" :align-by-column="true" :display-format="'{0}'"
                  :value-format="'#,##0.00'" />
                <!-- <DxGroupItem column="total" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.0000'" /> -->
              </DxSummary>
            </DxDataGrid>
          </q-card-section>
        </div>
        <div v-else-if="this.typeBC == 'nam'">
          <q-card-section class="q-pt-none">
            <DxDataGrid :data-source="dataSourceThang" :word-wrap-enabled="true" :no-data-text="'Không có dữ liệu !'"
              :show-borders="true" :show-row-lines="true" :show-column-lines="true" @cell-prepared="onCellPrepared">
              <DxHeaderFilter :visible="true" :allow-column-resizing="true" />
              <DxGrouping auto-expand-all=true />
              <DxScrolling mode="virtual" />
              <DxExport enabled=true :allow-export-selected-data="false" :file-name="
                'Dữ liệu sản xuất chi tiết từ ngày ' +
                tuNgay +
                ' đến ngày ' +
                denNgay
              " />
              <DxColumn caption="Công đoạn" data-field="NAME" :width="150" :group-index="0" />
              <DxColumn caption="Chi tiết" data-field="ITEM_NAME" :width="280" :fixed="true" />
              <DxColumn caption="Dài" data-field="length" :width="90" alignment="center" :fixed="true" />
              <DxColumn caption="Rộng" data-field="width" :width="90" alignment="center" :fixed="true" />
              <DxColumn caption="Dày" data-field="height" :width="90" alignment="center" :fixed="true" />
              <DxColumn caption="ĐVT" data-field="UNIT_NAME" :width="90" alignment="center" :fixed="true" />
              <DxColumn v-if="ThangM3 == 'SL'" caption="Tổng (SL)" data-field="total" data-type="number"
                format="#,##0.00" :width="120" alignment="center" :fixed="true" />
              <DxColumn v-if="ThangM3 == 'M3'" caption="Tổng (M³)" data-field="total" data-type="number"
                format="#,##0.00" :width="120" alignment="center" :fixed="true" />
              <DxColumn caption="Tháng 1" data-field="January" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 2" data-field="February" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 3" data-field="March" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 4" data-field="April" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 5" data-field="May" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 6" data-field="June" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 7" data-field="July" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 8" data-field="August" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 9" data-field="September" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 10" data-field="October" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 11" data-field="November" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxColumn caption="Tháng 12" data-field="December" data-type="number" format="#,##0.00" alignment="center"
                width="120" />
              <DxSummary>
                <DxGroupItem column="total" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="January" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="February" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="March" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="April" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="May" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="June" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="July" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="August" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="September" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="October" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="November" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
                <DxGroupItem column="December" summary-type="sum" data-type="number" :show-in-group-footer="false"
                  :align-by-column="true" :display-format="'{0}'" :value-format="'#,##0.00'" />
              </DxSummary>
            </DxDataGrid>
          </q-card-section>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxExport,
  DxLookup,
  DxSummary,
  DxGroupItem,
  DxFilterRow,
  DxScrolling,
  DxHeaderFilter,
  DxColumnChooser,
  DxGrouping,
  DxGroupPanel,
  DxSorting,
} from "devextreme-vue/data-grid";
import DxChart, {
  DxArgumentAxis,
  DxTitle,
  DxSubtitle,
  DxCommonSeriesSettings,
  DxAggregation,
  DxSeriesTemplate,
  DxTooltip,
  DxLegend,
  DxValueAxis,
  DxFormat,
  DxLabel,
  DxSeries,
  DxConstantLine,
  DxSize,
  DxLoadingIndicator
} from 'devextreme-vue/chart';
import { DxLoadPanel } from 'devextreme-vue/load-panel';
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../../ultils";
import DialogSelectDate from "./../../../components/commons/DialogSelectFromDateToDate";
import moment from "moment";
import { mapActions } from "vuex";
import { type } from "os";
export default {
  components: {
    DxLoadPanel,
    DxDataGrid,
    DxColumn,
    DxExport,
    DialogSelectDate,
    DxLookup,
    DxSummary,
    DxScrolling,
    DxGroupItem,
    DxFilterRow,
    DxHeaderFilter,
    DxColumnChooser,
    DxGrouping,
    DxGroupPanel,
    DxChart,
    DxArgumentAxis,
    DxTitle,
    DxSubtitle,
    DxCommonSeriesSettings,
    DxAggregation,
    DxSeriesTemplate,
    DxTooltip,
    DxLegend,
    DxValueAxis,
    DxFormat,
    DxLabel,
    DxSeries,
    DxConstantLine,
    DxSize,
    DxSorting,
    DxLoadingIndicator,
  },
  data() {
    return {
      factoryName: null,
      showChooseDate: false,
      fromDate: null,
      toDate: null,
      options: [],
      factory: null,
      xuongs: [],
      xuong: null,
      showDepartment: null,
      isExcel: false,
      isShowBieuDo: false,
      isShow: false,
      typeBC: "ngay",
      group: null,
      ngaythang: '',
      listWeek: [],
      year: moment().year(),
      departmemnt: [],
      departmentYS2: [],
      departmentViforexLVL: [],
      departmentViforexPlywood: [],
      departmentYS3LVL: [],
      departmentYS3Plywood: [],
      departmentChiemHoaLVL: [],
      departmentChiemHoaPlywood: [],
      departmentViforex: [],
      departmentYS3: [],
      departmentChiemHoa: [],

      cbDepartmentYS2: [],
      cbdepartmentViforex: [],
      cbdepartmentYS3: [],
      cbdepartmentChiemHoa: [],
      cbdepartmentViforexLVL: [],
      cbdepartmentViforexPlywood: [],
      cbdepartmentYS3LVL: [],
      cbdepartmentYS3Plywood: [],
      cbdepartmentChiemHoaLVL: [],
      cbdepartmentChiemHoaPlywood: [],

      dataSourceNgay: [],
      cstdataSourceNgay: [],
      cstdataSourceTuan: [],
      cstdataSourceThang: [],
      dataChartNgay: [],
      dataSourceTuan: [],
      dataSourceThang: [],
      dataChartTuan: [],
      dataChartThang: [],
      cstdataChartNgay: [],
      cstdataChartTuan: [],
      cstdataChartThang: [],
      cbselected: [],

      allViforexLVL: false,
      allViforexPlywood: false,
      allYS3Plywood: false,
      allYS3LVL: false,
      allChiemHoaLVL: false,
      allChiemHoaPlywood: false,

      loadingVisible: false,

      TuanM3: 'SL',
      ThangM3: 'SL',
      dialog: false,
      maximizedToggle: true,
    };
  },

  created() {
    this.loadDataDepartment();
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.loadDate();
    this.loadFactory();
    this.loadListWeek();
  },
  methods: {
    ...mapActions("vcn", ["getFactory", "getBCStepByDayTable", "getBCStepByMonthOfYearM3", "getBCStepByWeekOfYearM3", "getBCStepByWeek", "getBCStepByWeekOfYear", "getBCStepByMonthOfYear", "getBCVCN_Ngay", "getBCVCN_Tuan", "getBCVCN_Thang", "getXuongByFactoryId", "getAllDepartmetVCN"]),
    async loadFactory() {
      const factory = await this.getFactory();
      factory.map((e) => (e.label = e.name));
      this.options = factory;
      this.factory = factory[0];
      this.factoryName = factory[0].label;
    },
    loadListWeek() {
      let weekStart = 1;
      let weekStartend = 52;
      let strWeek = "";
      this.listWeek = [];
      if (this.month == 1) weekStart = 1;
      for (let i = weekStart; i <= weekStartend; i++) {
        strWeek += `[week${i}],`;
        this.listWeek.push(i);
      }
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.chonXuong();
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async loadDate() {
      let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
      };
    },
    async changeDate() {
      this.fromDate = this.year + '/01/01'
      this.toDate = this.year + '/12/31'
      await this.chonXuong();
    },
    onShown() {
      setTimeout(() => {
        this.loadingVisible = false;
      }, 200000);
    },
    // onHidden() {
    //   this.employeeInfo = employee;
    // },
    async onChange() {
      this.xuong = null
      const payload = {
        factoryId: this.factory.id
      }
      const data = await this.getXuongByFactoryId(payload);
      data.map(e => (e.label = e.name));
      this.xuongs = data;
      this.factoryName = this.factory.label;
      if (this.factory.id == 102451) {
        this.showDepartment = 1
      } else if (this.factory.id == 102533) {
        this.showDepartment = 2
      }
      else if (this.factory.id == 102631) {
        this.showDepartment = 3
      }
      else if (this.factory.id == 102643) {
        this.showDepartment = 4
      }
      this.dataChartNgay = [];
      this.dataSourceNgay = [];
      this.dataChartTuan = [];
      this.dataSourceTuan = [];
      this.dataChartThang = [];
      this.dataSourceThang = [];
    },
    async chonXuong() {
      this.factoryName = this.factory.label;
      if (this.typeBC != 'ngay') {
        this.fromDate = this.year + '/01/01'
        this.toDate = this.year + '/12/31'
      }
      if (this.xuong.id == 102744) {
        this.showDepartment = 5;
        this.selectedDepartment(this.cbdepartmentViforexLVL)
      } else if (this.xuong.id == 102745) {
        this.showDepartment = 6
        this.selectedDepartment(this.cbdepartmentViforexPlywood)
      } else if (this.xuong.id == 102498) {
        this.showDepartment = 7
        this.selectedDepartment(this.cbdepartmentYS3Plywood)
      } else if (this.xuong.id == 102531) {
        this.showDepartment = 8
        this.selectedDepartment(this.cbdepartmentYS3LVL)
      } else if (this.xuong.id == 102817) {
        this.showDepartment = 9
        this.selectedDepartment(this.cbdepartmentChiemHoaLVL)
      } else if (this.xuong.id == 102818) {
        this.showDepartment = 10
        this.selectedDepartment(this.cbdepartmentChiemHoaPlywood)
      }
    },
    async loadDataDepartment() {
      let data = await this.getAllDepartmetVCN()
      this.departmemnt = data.data
      //get department YS2
      this.departmentYS2 = this.departmemnt.filter(f => f.factoryId == 102451)
      //get department Viforex
      this.departmentViforex = this.departmemnt.filter(f => f.factoryId == 102533)
      this.departmentViforexLVL = this.departmemnt.filter(f => f.factoryId == 102533 && f.PARENT_ID == 102744 && f.ID != 102781)
      this.departmentViforexPlywood = this.departmemnt.filter(f => f.factoryId == 102533 && f.PARENT_ID == 102745 && f.ID != 102781)
      //get department YS3
      this.departmentYS3 = this.departmemnt.filter(f => f.factoryId == 102631)
      this.departmentYS3LVL = this.departmemnt.filter(f => f.factoryId == 102631 && f.PARENT_ID == 102531 && f.ID != 102528)
      this.departmentYS3Plywood = this.departmemnt.filter(f => f.factoryId == 102631 && f.PARENT_ID == 102498 && f.ID != 102528)
      //get department Chiem Hoa
      this.departmentChiemHoa = this.departmemnt.filter(f => f.factoryId == 102643)
      this.departmentChiemHoaLVL = this.departmemnt.filter(f => f.factoryId == 102643 && f.PARENT_ID == 102818)
      this.departmentChiemHoaPlywood = this.departmemnt.filter(f => f.factoryId == 102643 && f.PARENT_ID == 102817)
    },
    async selectedDepartment(selectedDepartment) {
      this.dataChartNgay = []
      this.dataSourceNgay = []
      this.dataChartTuan = []
      this.dataSourceTuan = []
      this.dataChartThang = []
      this.dataSourceThang = []
      this.loadingVisible = true;
      let payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
        factoryId: this.xuong.id,
      };
      if (this.typeBC == 'ngay') {
        this.cstdataChartNgay = await this.getBCVCN_Ngay(payload)
        this.cstdataChartNgay.forEach(e => {
          selectedDepartment.forEach(element => {
            if (element.NAME == e.NAME) {
              if (e.NAME == '1. Tạo Ván' || e.NAME == '2. Tạo Ván' || e.NAME == '3. Tạo Ván' || e.NAME == '4. Tạo Ván' || e.NAME == '5. Tạo Ván' || e.NAME == '6. Tạo Ván' || e.NAME == '7. Tạo Ván') {
                this.dataChartNgay.push({
                  ngay: e.CREATED_AT,
                  taovan: Math.round(e.volumnM3 * 100.0) / 100.0
                })
              } else if (e.NAME == '1. Lên lớp' || e.NAME == '2. Lên lớp' || e.NAME == '3. Lên lớp' || e.NAME == '4. Lên lớp' || e.NAME == '5. Lên lớp' || e.NAME == '6. Lên lớp' || e.NAME == '7. Lên lớp') {
                this.dataChartNgay.push({
                  ngay: e.CREATED_AT,
                  lenlop: Math.round(e.volumnM3 * 100.0) / 100.0
                })
              } else if (e.NAME == '1. Lọc ván' || e.NAME == '2. Lọc ván' || e.NAME == '3. Lọc ván' || e.NAME == '4. Lọc ván' || e.NAME == '5. Lọc ván' || e.NAME == '6. Lọc ván' || e.NAME == '7. Lọc ván') {
                this.dataChartNgay.push({
                  ngay: e.CREATED_AT,
                  locvan: Math.round(e.volumnM3 * 100.0) / 100.0
                })
              } else if (e.NAME == '1. Kho Ván cốt' || e.NAME == '2. Kho Ván cốt' || e.NAME == '3. Kho Ván cốt' || e.NAME == '4. Kho Ván cốt' || e.NAME == '5. Kho Ván cốt' || e.NAME == '6. Kho Ván cốt' || e.NAME == '7. Kho Ván cốt') {
                this.dataChartNgay.push({
                  ngay: e.CREATED_AT,
                  khovancot: Math.round(e.volumnM3 * 100.0) / 100.0
                })
              } else if (e.NAME == '1. Dán mặt' || e.NAME == '2. Dán mặt' || e.NAME == '3. Dán mặt' || e.NAME == '4. Dán mặt' || e.NAME == '5. Dán mặt' || e.NAME == '6. Dán mặt' || e.NAME == '7. Dán mặt') {
                this.dataChartNgay.push({
                  ngay: e.CREATED_AT,
                  danmat: Math.round(e.volumnM3 * 100.0) / 100.0
                })
              } else if (e.NAME == '1. Hoàn thiện' || e.NAME == '2. Hoàn thiện' || e.NAME == '3. Hoàn thiện' || e.NAME == '4. Hoàn thiện' || e.NAME == '5. Hoàn thiện' || e.NAME == '6. Hoàn thiện' || e.NAME == '7. Hoàn thiện') {
                this.dataChartNgay.push({
                  ngay: e.CREATED_AT,
                  hoanthien: Math.round(e.volumnM3 * 100.0) / 100.0
                })
              } else if (e.NAME == '1. Kho TP' || e.NAME == '2. Kho TP' || e.NAME == '3. Kho TP' || e.NAME == '4. Kho TP' || e.NAME == '5. Kho TP' || e.NAME == '6. Kho TP' || e.NAME == '7. Kho TP') {
                this.dataChartNgay.push({
                  ngay: e.CREATED_AT,
                  khotp: Math.round(e.volumnM3 * 100.0) / 100.0
                })
              }
            }
          });
        });
        this.cstdataSourceNgay = await this.getBCStepByDayTable(payload);
        this.dataSourceNgay = []
        this.cstdataSourceNgay.forEach(element => {
          selectedDepartment.forEach(e => {
            if (element.NAME == e.NAME) {
              this.dataSourceNgay.push(element)
            }
          });
        });
      } else if (this.typeBC == 'tuan') {

        if (this.TuanM3 == 'SL') {
          this.cstdataSourceTuan = await this.getBCStepByWeekOfYear(payload);
        } else {
          this.cstdataSourceTuan = await this.getBCStepByWeekOfYearM3(payload);
        }
        this.cstdataChartTuan = await this.getBCVCN_Tuan(payload)
        const w1 = this.cstdataChartTuan.find(f => f.WEEK == "01")
        const w2 = this.cstdataChartTuan.find(f => f.WEEK == "02")
        const w3 = this.cstdataChartTuan.find(f => f.WEEK == "03")
        const w4 = this.cstdataChartTuan.find(f => f.WEEK == "04")
        const w5 = this.cstdataChartTuan.find(f => f.WEEK == "05")
        const w6 = this.cstdataChartTuan.find(f => f.WEEK == "06")
        const w7 = this.cstdataChartTuan.find(f => f.WEEK == "07")
        const w8 = this.cstdataChartTuan.find(f => f.WEEK == "08")
        const w9 = this.cstdataChartTuan.find(f => f.WEEK == "09")
        const w10 = this.cstdataChartTuan.find(f => f.WEEK == "10")
        const w11 = this.cstdataChartTuan.find(f => f.WEEK == "11")
        const w12 = this.cstdataChartTuan.find(f => f.WEEK == "12")
        const w13 = this.cstdataChartTuan.find(f => f.WEEK == "13")
        const w14 = this.cstdataChartTuan.find(f => f.WEEK == "14")
        const w15 = this.cstdataChartTuan.find(f => f.WEEK == "15")
        const w16 = this.cstdataChartTuan.find(f => f.WEEK == "16")
        const w17 = this.cstdataChartTuan.find(f => f.WEEK == "17")
        const w18 = this.cstdataChartTuan.find(f => f.WEEK == "18")
        const w19 = this.cstdataChartTuan.find(f => f.WEEK == "19")
        const w20 = this.cstdataChartTuan.find(f => f.WEEK == "20")
        const w21 = this.cstdataChartTuan.find(f => f.WEEK == "21")
        const w22 = this.cstdataChartTuan.find(f => f.WEEK == "22")
        const w23 = this.cstdataChartTuan.find(f => f.WEEK == "23")
        const w24 = this.cstdataChartTuan.find(f => f.WEEK == "24")
        const w25 = this.cstdataChartTuan.find(f => f.WEEK == "25")
        const w26 = this.cstdataChartTuan.find(f => f.WEEK == "26")
        const w27 = this.cstdataChartTuan.find(f => f.WEEK == "27")
        const w28 = this.cstdataChartTuan.find(f => f.WEEK == "28")
        const w29 = this.cstdataChartTuan.find(f => f.WEEK == "29")
        const w30 = this.cstdataChartTuan.find(f => f.WEEK == "30")
        const w31 = this.cstdataChartTuan.find(f => f.WEEK == "31")
        const w32 = this.cstdataChartTuan.find(f => f.WEEK == "32")
        const w33 = this.cstdataChartTuan.find(f => f.WEEK == "33")
        const w34 = this.cstdataChartTuan.find(f => f.WEEK == "34")
        const w35 = this.cstdataChartTuan.find(f => f.WEEK == "35")
        const w36 = this.cstdataChartTuan.find(f => f.WEEK == "36")
        const w37 = this.cstdataChartTuan.find(f => f.WEEK == "37")
        const w38 = this.cstdataChartTuan.find(f => f.WEEK == "38")
        const w39 = this.cstdataChartTuan.find(f => f.WEEK == "39")
        const w40 = this.cstdataChartTuan.find(f => f.WEEK == "40")
        const w41 = this.cstdataChartTuan.find(f => f.WEEK == "41")
        const w42 = this.cstdataChartTuan.find(f => f.WEEK == "42")
        const w43 = this.cstdataChartTuan.find(f => f.WEEK == "43")
        const w44 = this.cstdataChartTuan.find(f => f.WEEK == "44")
        const w45 = this.cstdataChartTuan.find(f => f.WEEK == "45")
        const w46 = this.cstdataChartTuan.find(f => f.WEEK == "46")
        const w47 = this.cstdataChartTuan.find(f => f.WEEK == "47")
        const w48 = this.cstdataChartTuan.find(f => f.WEEK == "48")
        const w49 = this.cstdataChartTuan.find(f => f.WEEK == "49")
        const w50 = this.cstdataChartTuan.find(f => f.WEEK == "50")
        const w51 = this.cstdataChartTuan.find(f => f.WEEK == "51")
        const w52 = this.cstdataChartTuan.find(f => f.WEEK == "52")
        const w53 = this.cstdataChartTuan.find(f => f.WEEK == "53")
        if (typeof w1 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '01',

          })
        }
        if (typeof w2 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '02'
          })
        }
        if (typeof w3 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '03'
          })
        }
        if (typeof w4 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '04'
          })
        }
        if (typeof w5 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '05'
          })
        }
        if (typeof w6 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '06'
          })
        }
        if (typeof w7 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '07'
          })
        }
        if (typeof w8 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '08'
          })
        }
        if (typeof w9 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '09'
          })
        }
        if (typeof w10 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '10'
          })
        }
        if (typeof w11 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '11'
          })
        }
        if (typeof w12 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '12'
          })
        }
        if (typeof w13 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '13'
          })
        }
        if (typeof w14 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '14'
          })
        }
        if (typeof w15 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '15'
          })
        }
        if (typeof w16 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '16'
          })
        }
        if (typeof w17 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '17'
          })
        }
        if (typeof w18 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '18'
          })
        }
        if (typeof w19 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '19'
          })
        }
        if (typeof w20 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '20'
          })
        }
        if (typeof w21 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '21'
          })
        }
        if (typeof w22 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '22'
          })
        }
        if (typeof w23 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '23'
          })
        }
        if (typeof w24 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '24'
          })
        }
        if (typeof w25 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '25'
          })
        }
        if (typeof w26 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '26'
          })
        }
        if (typeof w27 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '27'
          })
        }
        if (typeof w28 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '28'
          })
        }
        if (typeof w29 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '29'
          })
        }
        if (typeof w30 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '30'
          })
        }
        if (typeof w31 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '31'
          })
        }
        if (typeof w32 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '32'
          })
        }
        if (typeof w33 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '33'
          })
        }
        if (typeof w34 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '34'
          })
        }
        if (typeof w35 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '35'
          })
        }
        if (typeof w36 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '36'
          })
        }
        if (typeof w37 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '37'
          })
        }
        if (typeof w38 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '38'
          })
        }
        if (typeof w39 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '39'
          })
        }
        if (typeof w40 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '40'
          })
        }
        if (typeof w41 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '41'
          })
        }
        if (typeof w42 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '42'
          })
        }
        if (typeof w43 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '43'
          })
        }
        if (typeof w44 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '44'
          })
        }
        if (typeof w45 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '45'
          })
        }
        if (typeof w46 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '46'
          })
        }
        if (typeof w47 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '47'
          })
        }
        if (typeof w48 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '48'
          })
        }
        if (typeof w49 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '49'
          })
        }
        if (typeof w50 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '50'
          })
        }
        if (typeof w51 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '51'
          })
        }
        if (typeof w52 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '52'
          })
        }
        if (typeof w53 === 'undefined') {
          this.dataChartTuan.push({
            WEEK: '53'
          })
        }
        this.cstdataChartTuan.forEach(e => {
          selectedDepartment.forEach(element => {
            if (element.NAME == e.NAME) {
              if (e.NAME == '1. Tạo Ván' || e.NAME == '2. Tạo Ván' || e.NAME == '3. Tạo Ván' || e.NAME == '4. Tạo Ván' || e.NAME == '5. Tạo Ván' || e.NAME == '6. Tạo Ván' || e.NAME == '7. Tạo Ván') {
                this.dataChartTuan.push({
                  WEEK: e.WEEK,
                  taovan: Math.round(e.SUMM3 * 100.0) / 100.0
                })
              } else if (e.NAME == '1. Lên lớp' || e.NAME == '2. Lên lớp' || e.NAME == '3. Lên lớp' || e.NAME == '4. Lên lớp' || e.NAME == '5. Lên lớp' || e.NAME == '6. Lên lớp' || e.NAME == '7. Lên lớp') {
                this.dataChartNgay.push({
                  WEEK: e.WEEK,
                  lenlop: Math.round(e.SUMM3 * 100.0) / 100.0
                })
              } else if (e.NAME == '1. Lọc ván' || e.NAME == '2. Lọc ván' || e.NAME == '3. Lọc ván' || e.NAME == '4. Lọc ván' || e.NAME == '5. Lọc ván' || e.NAME == '6. Lọc ván' || e.NAME == '7. Lọc ván') {
                this.dataChartTuan.push({
                  WEEK: e.WEEK,
                  locvan: Math.round(e.SUMM3 * 100.0) / 100.0
                })
              } else if (e.NAME == '1. Kho Ván cốt' || e.NAME == '2. Kho Ván cốt' || e.NAME == '3. Kho Ván cốt' || e.NAME == '4. Kho Ván cốt' || e.NAME == '5. Kho Ván cốt' || e.NAME == '6. Kho Ván cốt' || e.NAME == '7. Kho Ván cốt') {
                this.dataChartTuan.push({
                  WEEK: e.WEEK,
                  khovancot: Math.round(e.SUMM3 * 100.0) / 100.0
                })
              } else if (e.NAME == '1. Dán mặt' || e.NAME == '2. Dán mặt' || e.NAME == '3. Dán mặt' || e.NAME == '4. Dán mặt' || e.NAME == '5. Dán mặt' || e.NAME == '6. Dán mặt' || e.NAME == '7. Dán mặt') {
                this.dataChartTuan.push({
                  WEEK: e.WEEK,
                  danmat: Math.round(e.SUMM3 * 100.0) / 100.0
                })
              } else if (e.NAME == '1. Hoàn thiện' || e.NAME == '2. Hoàn thiện' || e.NAME == '3. Hoàn thiện' || e.NAME == '4. Hoàn thiện' || e.NAME == '5. Hoàn thiện' || e.NAME == '6. Hoàn thiện' || e.NAME == '7. Hoàn thiện') {
                this.dataChartTuan.push({
                  WEEK: e.WEEK,
                  hoanthien: Math.round(e.SUMM3 * 100.0) / 100.0
                })
              } else if (e.NAME == '1. Kho TP' || e.NAME == '2. Kho TP' || e.NAME == '3. Kho TP' || e.NAME == '4. Kho TP' || e.NAME == '5. Kho TP' || e.NAME == '6. Kho TP' || e.NAME == '7. Kho TP') {
                this.dataChartTuan.push({
                  WEEK: e.WEEK,
                  khotp: Math.round(e.SUMM3 * 100.0) / 100.0
                })
              }
            }
          });
        });
        this.dataChartTuan.sort((a, b) => a.WEEK.slice(0, 2) - b.WEEK.slice(0, 2));
        this.dataSourceTuan = []
        this.cstdataSourceTuan.forEach(element => {
          selectedDepartment.forEach(e => {
            if (element.NAME == e.NAME) {
              this.dataSourceTuan.push(element)
            }
          });
        });
        this.dataSourceTuan.forEach(e => {
          e.total = e.w1 + e.w2 + e.w3 + e.w4 + e.w5 + e.w6 + e.w7 +
            e.w8 + e.w9 + e.w10 + e.w11 + e.w12 + e.w13 + e.w14 +
            e.w15 + e.w16 + e.w17 + e.w18 + e.w19 + e.w20 + e.w21 +
            e.w22 + e.w23 + e.w24 + e.w25 + e.w26 + e.w27 + e.w28 +
            e.w29 + e.w30 + e.w31 + e.w32 + e.w33 + e.w34 + e.w35 +
            e.w36 + e.w37 + e.w38 + e.w39 + e.w40 + e.w41 + e.w42 +
            e.w43 + e.w44 + e.w45 + e.w46 + e.w47 + e.w48 + e.w49 +
            e.w50 + e.w51 + e.w52 + e.w53
        });
      } else if (this.typeBC == 'nam') {

        if (this.ThangM3 == 'SL') {
          this.cstdataSourceThang = await this.getBCStepByMonthOfYear(payload);
        } else {
          this.cstdataSourceThang = await this.getBCStepByMonthOfYearM3(payload);
        }
        this.cstdataChartThang = await this.getBCVCN_Thang(payload)
        console.log("cstdataChartThang", this.cstdataChartThang)
        this.cstdataChartThang.forEach(e => {
          selectedDepartment.forEach(element => {
            if (element.NAME == e.NAME) {
              if (e.NAME == '1. Tạo Ván' || e.NAME == '2. Tạo Ván' || e.NAME == '3. Tạo Ván' || e.NAME == '4. Tạo Ván' || e.NAME == '5. Tạo Ván' || e.NAME == '6. Tạo Ván' || e.NAME == '7. Tạo Ván') {
                this.dataChartThang.push({
                  MONTH: e.MONTH,
                  taovan: Math.round(e.SUMM3 * 100.0) / 100.0,
                })
              } else if (e.NAME == '1. Lên lớp' || e.NAME == '2. Lên lớp' || e.NAME == '3. Lên lớp' || e.NAME == '4. Lên lớp' || e.NAME == '5. Lên lớp' || e.NAME == '6. Lên lớp' || e.NAME == '7. Lên lớp') {
                this.dataChartThang.push({
                  MONTH: e.MONTH,
                  lenlop: Math.round(e.SUMM3 * 100.0) / 100.0,
                })
              } else if (e.NAME == '1. Lọc ván' || e.NAME == '2. Lọc ván' || e.NAME == '3. Lọc ván' || e.NAME == '4. Lọc ván' || e.NAME == '5. Lọc ván' || e.NAME == '6. Lọc ván' || e.NAME == '7. Lọc ván') {
                this.dataChartThang.push({
                  MONTH: e.MONTH,
                  locvan: Math.round(e.SUMM3 * 100.0) / 100.0,
                })
              } else if (e.NAME == '1. Kho Ván cốt' || e.NAME == '2. Kho Ván cốt' || e.NAME == '3. Kho Ván cốt' || e.NAME == '4. Kho Ván cốt' || e.NAME == '5. Kho Ván cốt' || e.NAME == '6. Kho Ván cốt' || e.NAME == '7. Kho Ván cốt') {
                this.dataChartThang.push({
                  MONTH: e.MONTH,
                  khovancot: Math.round(e.SUMM3 * 100.0) / 100.0,
                })
              } else if (e.NAME == '1. Dán mặt' || e.NAME == '2. Dán mặt' || e.NAME == '3. Dán mặt' || e.NAME == '4. Dán mặt' || e.NAME == '5. Dán mặt' || e.NAME == '6. Dán mặt' || e.NAME == '7. Dán mặt') {
                this.dataChartThang.push({
                  MONTH: e.MONTH,
                  danmat: Math.round(e.SUMM3 * 100.0) / 100.0,
                })
              } else if (e.NAME == '1. Hoàn thiện' || e.NAME == '2. Hoàn thiện' || e.NAME == '3. Hoàn thiện' || e.NAME == '4. Hoàn thiện' || e.NAME == '5. Hoàn thiện' || e.NAME == '6. Hoàn thiện' || e.NAME == '7. Hoàn thiện') {
                this.dataChartThang.push({
                  MONTH: e.MONTH,
                  hoanthien: Math.round(e.SUMM3 * 100.0) / 100.0,
                })
              } else if (e.NAME == '1. Kho TP' || e.NAME == '2. Kho TP' || e.NAME == '3. Kho TP' || e.NAME == '4. Kho TP' || e.NAME == '5. Kho TP' || e.NAME == '6. Kho TP' || e.NAME == '7. Kho TP') {
                this.dataChartThang.push({
                  MONTH: e.MONTH,
                  khotp: Math.round(e.SUMM3 * 100.0) / 100.0,
                })
              }
            }
          });
        });
        const t1 = this.cstdataChartThang.find(f => f.MONTH == "Tháng 01")
        const t2 = this.cstdataChartThang.find(f => f.WEEK == "Tháng 02")
        const t3 = this.cstdataChartThang.find(f => f.WEEK == "Tháng 03")
        const t4 = this.cstdataChartThang.find(f => f.WEEK == "Tháng 04")
        const t5 = this.cstdataChartThang.find(f => f.WEEK == "Tháng 05")
        const t6 = this.cstdataChartThang.find(f => f.WEEK == "Tháng 06")
        const t7 = this.cstdataChartThang.find(f => f.WEEK == "Tháng 07")
        const t8 = this.cstdataChartThang.find(f => f.WEEK == "Tháng 08")
        const t9 = this.cstdataChartThang.find(f => f.WEEK == "Tháng 09")
        const t10 = this.cstdataChartThang.find(f => f.WEEK == "Tháng 10")
        const t11 = this.cstdataChartThang.find(f => f.WEEK == "Tháng 11")
        const t12 = this.cstdataChartThang.find(f => f.WEEK == "Tháng 12")
        if (typeof t1 === 'undefined') {
          this.dataChartThang.push({
            MONTH: 'Tháng 01'
          })
        }
        if (typeof t2 === 'undefined') {
          this.dataChartThang.push({
            MONTH: 'Tháng 02'
          })
        }
        if (typeof t3 === 'undefined') {
          this.dataChartThang.push({
            MONTH: 'Tháng 03'
          })
        }
        if (typeof t4 === 'undefined') {
          this.dataChartThang.push({
            MONTH: 'Tháng 04'
          })
        }
        if (typeof t5 === 'undefined') {
          this.dataChartThang.push({
            MONTH: 'Tháng 05'
          })
        }
        if (typeof t6 === 'undefined') {
          this.dataChartThang.push({
            MONTH: 'Tháng 06'
          })
        }
        if (typeof t7 === 'undefined') {
          this.dataChartThang.push({
            MONTH: 'Tháng 07'
          })
        }
        if (typeof t8 === 'undefined') {
          this.dataChartThang.push({
            MONTH: 'Tháng 08'
          })
        }
        if (typeof t9 === 'undefined') {
          this.dataChartThang.push({
            MONTH: 'Tháng 09'
          })
        }
        if (typeof t10 === 'undefined') {
          this.dataChartThang.push({
            MONTH: 'Tháng 10'
          })
        }
        if (typeof t11 === 'undefined') {
          this.dataChartThang.push({
            MONTH: 'Tháng 11'
          })
        }
        if (typeof t12 === 'undefined') {
          this.dataChartThang.push({
            MONTH: 'Tháng 12'
          })
        }
        this.dataChartThang.sort((a, b) => a.MONTH.slice(5, 8) - b.MONTH.slice(5, 8));
        this.dataSourceThang = []
        this.cstdataSourceThang.forEach(element => {
          selectedDepartment.forEach(e => {
            if (element.NAME == e.NAME) {
              this.dataSourceThang.push(element)
            }
          });
        });
        this.dataSourceThang.forEach(e => {
          e.total = e.January + e.February + e.March + e.April + e.May + e.June + e.July +
            e.August + e.September + e.October + e.November + e.December
        });
        console.log('this.dataSourceThang', this.dataSourceThang)
        console.log('this.cstdataSourceThang', this.cstdataSourceThang.filter(f => f.January != 0))
      }
      if (this.cbdepartmentViforexLVL.length != this.departmentViforexLVL.length) {
        this.allViforexLVL = false
      } else {
        this.allViforexLVL = true
      }
      if (this.cbdepartmentViforexPlywood.length != this.departmentViforexPlywood.length) {
        this.allViforexPlywood = false
      } else {
        this.allViforexPlywood = true
      }
      if (this.cbdepartmentYS3Plywood.length != this.departmentYS3Plywood.length) {
        this.allYS3Plywood = false
      } else {
        this.allYS3Plywood = true
      }
      if (this.cbdepartmentYS3LVL.length != this.departmentYS3LVL.length) {
        this.allYS3LVL = false
      } else {
        this.allYS3LVL = true
      }
      if (this.cbdepartmentChiemHoaLVL.length != this.departmentChiemHoaLVL.length) {
        this.allChiemHoaLVL = false
      } else {
        this.allChiemHoaLVL = true
      }
      if (this.cbdepartmentChiemHoaPlywood.length != this.departmentChiemHoaPlywood.length) {
        this.allChiemHoaPlywood = false
      } else {
        this.allChiemHoaPlywood = true
      }
      if (this.dataSourceNgay.length != 0) {
        this.isShowBieuDo = true
      } else {
        this.isShowBieuDo = false
      }
      this.loadingVisible = false;
    },
    async selectAllViforexLVL() {
      if (this.allViforexLVL == true) {
        this.cbdepartmentViforexLVL = this.departmentViforexLVL;
        this.chonXuong()
      } else {
        this.cbdepartmentViforexLVL = []
        this.chonXuong()
      }
    },
    async selectAllViforexPlywood() {
      if (this.allViforexPlywood == true) {
        this.cbdepartmentViforexPlywood = this.departmentViforexPlywood
        this.chonXuong()
      } else {
        this.cbdepartmentViforexPlywood = []
        this.chonXuong()
      }
    },
    async selectAllYS3Plywood() {
      if (this.allYS3Plywood == true) {
        this.cbdepartmentYS3Plywood = this.departmentYS3Plywood
        this.chonXuong()
      } else {
        this.cbdepartmentYS3Plywood = []
        this.chonXuong()
      }
    },
    async selectAllYS3LVL() {
      if (this.allYS3LVL == true) {
        this.cbdepartmentYS3LVL = this.departmentYS3LVL
        this.chonXuong()
      } else {
        this.cbdepartmentYS3LVL = []
        this.chonXuong()
      }
    },
    async selectAllChiemHoaLVL() {
      if (this.allChiemHoaLVL == true) {
        this.cbdepartmentChiemHoaLVL = this.departmentChiemHoaLVL
        this.chonXuong()
      } else {
        this.cbdepartmentChiemHoaLVL = []
        this.chonXuong()
      }
    },
    selectAllChiemHoaPlywood() {
      if (this.allChiemHoaPlywood == true) {
        this.cbdepartmentChiemHoaPlywood = this.departmentChiemHoaPlywood
        this.chonXuong()
      } else {
        this.cbdepartmentChiemHoaPlywood = []
        this.chonXuong()
      }
    },
    customizeTooltip(pointInfo) {
      return {
        text: `${parseFloat(pointInfo.originalValue)}`,
      };
    },

    formatDate(value) {
      return moment(value).format("DD/MM")
    },
    xuattieude() {
      if (this.idDepartment)
        this.tieude =
          "Báo Cáo sản lượng - " +
          this.ngaythang +
          " - " +
          this.idDepartment.label;
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
    calculateKL_KL(rowData) {
      if (rowData.QUANTITY == 0) {
        return rowData.VOLUMN;
      }
      return rowData.VOLUMN * rowData.QUANTITY;
    },
    showDialogDetail() {
      this.dialog = true;
    }
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
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  font-weight: 500;
  background-color: white;
  width: 280;
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

.dx-datagrid-headers .dx-datagrid-table .dx-row>td {
  border-bottom: 1px solid #ddd;
  font-size: 13px;
  font-weight: bold;
}

.title {
  font-size: 18px;
  color: #1976d2;
  font-weight: 500;
}
</style>