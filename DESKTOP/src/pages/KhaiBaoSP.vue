<template>
  <div>
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Khai báo danh mục khối CBG
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6 ">
        <q-btn style="margin-right:30px" color="positive" label="Thêm mới" @click="showDialog" />
        <q-btn style="margin-right:30px" color="info" label="Chỉnh Sửa" @click="showDialogSua" />
        <q-btn style="margin-right:30px" color="positive" label="Công suất" @click="showDialogCSM" />
           <q-btn style="margin-right:30px" color="info" label="Khai báo màu" @click="showDialogMau" />
        <q-btn v-show="isSanPhamChoDuuyet" style="margin-right:30px" color="warning" label="Danh mục chờ duyệt"
          @click="showSPChoDuyet" />
        <q-btn v-show="!isSanPhamChoDuuyet" style="margin-right:30px" color="warning" label="Tất cả sản phẩm"
          @click="showSPChoDuyet" />
      </div>
      <div class="col-6 " align="right" style="display: inline-block;">
        <q-checkbox v-model="isExcel" color="amber-6" class="text-weight-bold" label="Xuất Excel" dense />
      </div>
    </div>
    <div class="row" v-if="isSanPhamChoDuuyet">
      <div class="col-12">
        <DxDataGrid id="gridContainer" :word-wrap-enabled="true" :data-source="items" :allow-column-reordering="true"
          :columns-auto-width="true" :show-borders="true" :show-column-lines="true" :show-row-lines="true"
          :allow-column-resizing="true" key-expr="itemid" @exporting="onExporting" :selection="{ mode: 'single' }"
          @selection-changed="onSelectionChanged" :row-alternation-enabled="true">
          <DxPaging :enabled="true" />
          <DxExport :enabled="isExcel" :allow-export-selected-data="false" />
          <DxFilterRow :visible="true" />
          <DxColumn data-field="masp" :width="150" caption="Mã sản phẩm" alignment="center" cell-template="cell-view" />
          <template #cell-view="cell">
            <div>
              <span @click="showDialogView(cell.data.data)" class="fake-link">{{
                  cell.data.data.masp
              }}</span>
            </div>
          </template>
          <DxColumn data-field="macumchitiet" :width="150" caption="Mã cụm" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxColumn data-field="machitiet" :width="150" caption="Mã chi tiết" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxColumn data-field="ten" caption="Tên" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxColumn data-field="day" :width="80" caption="Dầy" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxColumn data-field="rong" :width="80" caption="Rộng" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxColumn data-field="dai" :width="80" caption="Dài" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxRequiredRule />
          <DxColumn data-field="dongsanpham" :width="110" caption="Dòng sản phẩm" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxColumn data-field="chungloai_name" :width="110" caption="Chủng loại" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxColumn data-field="donvi_name" :width="80" caption="Đơn vị" alignment="center">
            <DxRequiredRule />
          </DxColumn>
        </DxDataGrid>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col-12">
        <DxDataGrid id="gridContainer" :word-wrap-enabled="true" :data-source="spChoDuyet"
          :allow-column-reordering="true" :columns-auto-width="true" :show-borders="true" :show-column-lines="true"
          :show-row-lines="true" :allow-column-resizing="true" key-expr="itemid" @exporting="onExporting"
          :selection="{ mode: 'single' }" @selection-changed="onSelectionChanged" :row-alternation-enabled="true">
          <DxPaging :enabled="true" />
          <DxFilterRow :visible="true" />
          <DxColumn data-field="masp" :width="150" caption="Mã sản phẩm" alignment="center" />
          <DxColumn data-field="macumchitiet" :width="150" caption="Mã cụm" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxColumn data-field="machitiet" :width="150" caption="Mã chi tiết" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxColumn data-field="ten" caption="Tên" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxColumn data-field="day" :width="80" caption="Dầy" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxColumn data-field="rong" :width="80" caption="Rộng" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxColumn data-field="dai" :width="80" caption="Dài" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxRequiredRule />
          <!-- <DxColumn data-field="soluong" :width="110" caption="Số lượng" alignment="center">
            <DxRequiredRule />
          </DxColumn> -->
          <DxColumn data-field="dongsanpham" :width="110" caption="Dòng sản phẩm" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxColumn data-field="chungloai_name" :width="200" caption="Chủng loại" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxColumn data-field="donvi_name" :width="80" caption="Đơn vị" alignment="center">
            <DxRequiredRule />
          </DxColumn>
          <DxColumn :width="160" caption="Ghi chú" />
          <DxColumn :width="160" caption="Trạng thái" />
        </DxDataGrid>
      </div>
    </div>
        <q-dialog v-model="isShowDialog">
      <q-card style="min-width: 100%">
        <q-card-section class="row items-center">
          <span style="font-size: 20px; color: #21ab45; padding-left: 16px">Khai báo thông tin
          </span>
        </q-card-section>
        <q-card-section style="padding-top: 0px">
          <div class="col-12">
            <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
              Thông tin sản phẩm :
            </p>
          </div>
          <div class="row justify-around">
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="masp" type="text" label="Mã sản phẩm" label-color="amber-6" text :readonly="sua" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="tensp" type="text" label="Tên sản phẩm" label-color="amber-6" :readonly="sua" />
            </div>
            <!-- <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="soluong" type="text" label="Số lượng" label-color="amber-6" :readonly="sua" />
            </div> -->
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="tengoi" type="text" label="Tên gọi nội bộ" label-color="amber-6" :readonly="sua" />
            </div>

            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="khachhang" label="Khách hàng" :readonly="sua" label-color="amber-6" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="spdongsanpham" label="Dòng sản phẩm" label-color="amber-6" :readonly="sua" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">

            </div>
          </div>
          <div class="q-pa-md q-gutter-sm" align="right" v-show="spIsDone">
            <q-btn color="positive" glossy label="Thêm sản phẩm" @click="themsanpham" />
          </div>
          <div class="row">
            <div class="col-12">
              <DxDataGrid id="gridContainer" :data-source="sanpham" :show-borders="true" key-expr="id"
                :row-alternation-enabled="true" :word-wrap-enabled="true">
                <DxColumn data-field="masosp" caption="Mã sản phẩm" cell-template="edit-masp" />
                <template #edit-masp="cell">
                  <div>
                    <span @click="onShowSelectedSanPham(cell.data.data)" class="fake-link">{{
                        cell.data.data.masosp
                    }}</span>
                  </div>
                </template>
                <DxColumn data-field="name" caption="Tên sản phẩm" cell-template="edit-tensp" />
                <template #edit-tensp="cell">
                  <div>
                    <span @click="onShowSelectedSanPham(cell.data.data)" class="fake-link">{{
                        cell.data.data.name
                    }}</span>
                  </div>
                </template>
                <DxColumn data-field="tennoibo" caption="Tên nội bộ" />
                <DxColumn data-field="dongsanpham" caption="Dòng sản phẩm" />
                <DxColumn data-field="khachhang" caption="Khách hàng" />
              </DxDataGrid>
            </div>
          </div>
          <hr />
          <div class="col-12">
            <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
              Danh mục chi tiết:
              <label style="font-style: italic; color:violet ; padding-left: 16px">
                (Nếu số lượng tính theo công thức (D*R*D*10^-9) thì bỏ qua thông
                tin "Số lượng", hệ thống sẽ tự tính)
              </label>
            </p>
          </div>
          <div class="row justify-around">
            <!-- <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="ctmasanpham" type="text" label="Mã sản phẩm" label-color="amber-6" readonly />
            </div> -->
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="cttensanpham" type="text" label="Tên sản phẩm" label-color="amber-6" readonly />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="ctmachitiet" type="text" label="Mã chi tiết" label-color="amber-6" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="cttenchitiet" type="text" label="Tên chi tiết" label-color="amber-6" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="ctdai" type="number" label="Dài" label-color="amber-6" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="ctrong" type="number" label="Rộng" label-color="amber-6" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="ctday" type="number" label="Dầy" label-color="amber-6" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="ctheso" type="number" label="Hệ số" label-color="amber-6" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="ctsoluong" type="number" label="Khối lượng tinh" label-color="amber-6" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="ctdongsanpham" label="Dòng sản phẩm" label-color="amber-6" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select v-model="ctchungloai" :options="chungloais" label="Chủng loại" label-color="amber-6" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select v-model="ctdonvi" :options="donvis" label="Đơn vị" label-color="amber-6" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
            </div>
          </div>
          <div class="q-pa-md q-gutter-sm" align="right">
            <q-btn v-show="!view" color="positive" glossy label="Thêm chi tiết" @click="themchitiet" />
          </div>
          <div class="row">
            <div class="col-12">
              <DxDataGrid id="gridContainer" :data-source="chitiet" :show-borders="true" key-expr="id"
                :row-alternation-enabled="true" :word-wrap-enabled="true">
                <DxColumn cell-template="cell-cb" :width="60" />
                <template #cell-cb="cell">
                  <div v-if="cell.data.data.masocumchitiet == ''">
                    <q-checkbox v-model="cbChiTiet" :val="cell.data.data" @input="onSelectionCheckBox(cell.data.data)"
                      color="amber-6" />
                  </div>
                  <div v-else>
                    <q-checkbox v-model="checked" :val="cell.data.data" @input="onSelectionCheckBox(cell.data.data)"
                      disable color="amber-6" />
                  </div>
                </template>
                <DxColumn data-field="masosp" caption="Mã sản phẩm" cell-template="cell-masosp" />
                <DxColumn data-field="name" caption="Tên chi tiết" cell-template="cell-name" />
                <template #cell-name="cell">
                  <div>
                    <span @click="onShowSelectedChiTiet(cell.data.data)" class="fake-link">{{
                        cell.data.data.name
                    }}</span>
                  </div>
                </template>
                <template #cell-masosp="cell">
                  <div>
                    <span @click="onShowSelectedChiTiet(cell.data.data)" class="fake-link">{{
                        cell.data.data.masosp
                    }}</span>
                  </div>
                </template>
                <DxColumn data-field="masochitiet" caption="Mã chi tiết" cell-template="cell-masochitiet" />
                <template #cell-masochitiet="cell">
                  <div>
                    <span @click="onShowSelectedChiTiet(cell.data.data)" class="fake-link">{{
                        cell.data.data.masochitiet
                    }}</span>
                  </div>
                </template>
                <DxColumn data-field="masocumchitiet" caption="Mã cụm chi tiết" />
                <DxColumn data-field="dai" caption="Dài" />
                <DxColumn data-field="rong" caption="Rộng" />
                <DxColumn data-field="day" caption="Dầy" />
                <DxColumn data-field="heso" caption="Hệ số" />
                <DxColumn data-field="soluong" caption="Khối lượng tinh" />
                <DxColumn data-field="dongsanpham" caption="Dòng sản phẩm" />
                <DxColumn data-field="chungloai" caption="Chủng loại">
                  <DxLookup :data-source="chungloais" display-expr="label" value-expr="value" />
                </DxColumn>
                <DxColumn data-field="donvi" caption="Đơn vị">
                  <DxLookup :data-source="donvis" display-expr="label" value-expr="value" />
                </DxColumn>
                <DxColumn cell-template="cell-del" />
                <template #cell-del="cell">
                  <div>
                    <span @click="remove(cell.data.data)" class="fake-link">delete</span>
                  </div>
                </template>
              </DxDataGrid>
            </div>
          </div>
          <hr />
          <div class="col-12">
            <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
              Cụm chi tiết :
            </p>
          </div>
          <div class="row justify-around">
            <!-- <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="cmasanpham" type="text" label-color="amber-6" label="Mã sản phẩm" readonly />
            </div> -->
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="ctensanpham" type="text" label-color="amber-6" label="Tên sản phẩm" readonly />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="cmacumchitiet" type="text" label-color="amber-6" label="Mã cụm chi tiết" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="ctencumchitiet" type="text" label-color="amber-6" label="Tên cụm chi tiết" />
            </div>
            <!-- <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="cdai" type="number" label-color="amber-6" label="Dài" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="crong" type="number" label-color="amber-6" label="Rộng" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="cday" type="number" label-color="amber-6" label="Dầy" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="cheso" type="number" label-color="amber-6" label="Hệ số" />
            </div>

            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="cdongsanpham" label-color="amber-6" label="Dòng sản phẩm" :readonly="sua" />
            </div> -->

            <div class="col-12 col-md-5 q-mt-sm">
              <q-select v-model="cchungloai" :options="chungloais" label-color="amber-6" label="Chủng loại" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select v-model="cdonvi" :options="donvis" label-color="amber-6" label="Đơn vị" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
            </div>
          </div>
          <div class="q-pa-md q-gutter-sm" align="right">
            <q-btn v-show="!view" color="positive" glossy label="Thêm cụm chi tiết" @click="themcumchitiet" />
          </div>
          <div class="row">
            <div class="col-12">
              <DxDataGrid id="gridContainer" :data-source="cumchitiet" :show-borders="true" key-expr="id"
                :row-alternation-enabled="true" :word-wrap-enabled="true">
                <DxColumn data-field="masosp" caption="Mã sản phẩm" cell-template="edit-masp" />
                <template #edit-masp="cell">
                  <div>
                    <span @click="onShowSelectedCumChiTiet(cell.data.data)" class="fake-link">{{
                        cell.data.data.masosp
                    }}</span>
                  </div>
                </template>
                <DxColumn data-field="name" caption="Tên cụm chi tiết" cell-template="edit-tensp" />
                <template #edit-tensp="cell">
                  <div>
                    <span @click="onShowSelectedCumChiTiet(cell.data.data)" class="fake-link">{{
                        cell.data.data.name
                    }}</span>
                  </div>
                </template>
                <DxColumn data-field="masocumchitiet" caption="Mã cụm chi tiết" />
                <DxColumn data-field="dai" caption="Dài" />
                <DxColumn data-field="rong" caption="Rộng" />
                <DxColumn data-field="day" caption="Dầy" />
                <DxColumn data-field="heso" caption="Hệ số" />
                <DxColumn data-field="dongsanpham" caption="Dòng sản phẩm" />
                <DxColumn data-field="soluong" caption="Số lượng" />
                <DxColumn data-field="chungloai" caption="Chủng loại">
                  <DxLookup :data-source="chungloais" display-expr="label" value-expr="value" />
                </DxColumn>
                <DxColumn data-field="donvi" caption="Đơn vị">
                  <DxLookup :data-source="donvis" display-expr="label" value-expr="value" />
                </DxColumn>
                <DxColumn cell-template="del" />
                <template #del="cell">
                  <div>
                    <span @click="remove(cell.data.data)" class="fake-link">delete</span>
                  </div>
                </template>
              </DxDataGrid>
            </div>
          </div>
          <hr />

        </q-card-section>
        <div class="q-pa-md q-gutter-sm" align="right">
          <q-btn v-show="!view" color="positive" glossy label="Gửi phê duyệt" @click="xacnhan" />
          <q-btn color="deep-orange" glossy label="Đóng" @click="hideDialog" />
        </div>
      </q-card>
    </q-dialog >
    <q-dialog v-model ="hinhcay" >
          <div class="col-4" style="padding-right: 5px" >
                <q-table title="Cấu thành sản phẩm" :data="data3" :columns="columns" row-key="MASP" :filter="filter"
            no-data-label="Không có dữ liệu !" :pagination.sync="page" width= "80%">
            <template  v-slot:header="props">
              <q-tr v-show="false" :props="props">
                <q-th  />
                <q-th  v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props" >
                <q-td v-show="false" >
                  <q-btn size="sm" color="blue-5" round dense 
                    :icon="props.expand ? 'remove' : 'add'" />
                </q-td>
                <q-td v-show="false"  v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
              <q-tr v-show="true" :props="props">
                <q-td colspan="100%">
                  <div class="text-left">
                    <q-tree :nodes="treeData" default-expand-all 
                      node-key="idsp" selected-color="warning">
                      <template v-slot:default-header="prop">
                        <div class="row items-center" v-if="prop.node.bold == 1">
                          <div v-if="prop.node.TrangThaiHienThi == ''">
                            <div style="font-weight: 600">{{ prop.node.label }}</div>
                          </div>
                          <div v-if="prop.node.TrangThaiHienThi == '(Từ chối)'">
                            <div style="font-weight: 600;color: red;">{{ prop.node.label }}</div>
                          </div>
                          <div v-if="prop.node.TrangThaiHienThi == '(Đồng ý)'">
                            <div style="font-weight: 600;color:#2196f3 ;">{{ prop.node.label }}</div>
                          </div>
                          <div v-if="prop.node.TrangThaiHienThi == '(Thêm mới)'">
                            <div style="font-weight: 600;color:green ;">{{ prop.node.label }}</div>
                          </div>
                          <div v-if="prop.node.TrangThaiHienThi == '(xóa)'">
                            <div style="font-weight: 600;color:orange ;">{{ prop.node.label }}</div>
                          </div>
                        </div>
                        <div class="row items-center" v-else-if="prop.node.bold == 2">
                          <div v-if="prop.node.TrangThaiHienThi == ''">
                            <div style="font-weight: 500">{{ prop.node.label }}</div>
                          </div>
                          <div v-if="prop.node.TrangThaiHienThi == '(Từ chối)'">
                            <div style="font-weight: 500;color: red;">{{ prop.node.label }}</div>
                          </div>
                          <div v-if="prop.node.TrangThaiHienThi == '(Đồng ý)'">
                            <div style="font-weight: 500;color:#2196f3 ;">{{ prop.node.label }}</div>
                          </div>
                          <div v-if="prop.node.TrangThaiHienThi == '(Thêm mới)'">
                            <div style="font-weight: 500;color:green ;">{{ prop.node.label }}</div>
                          </div>
                          <div v-if="prop.node.TrangThaiHienThi == '(xóa)'">
                            <div style="font-weight: 500;color:orange ;">{{ prop.node.label }}</div>
                          </div>
                        </div>
                        <div class="row items-center" v-else>
                          <div v-if="prop.node.TrangThaiHienThi == ''">
                            <div>{{ prop.node.label }}</div>
                          </div>
                          <div v-if="prop.node.TrangThaiHienThi == '(Từ chối)'">
                            <div style="color: red;">{{ prop.node.label }}</div>
                          </div>
                          <div v-if="prop.node.TrangThaiHienThi == '(Đồng ý)'">
                            <div style="color:#2196f3 ;">{{ prop.node.label }}</div>
                          </div>
                          <div v-if="prop.node.TrangThaiHienThi == '(Thêm mới)'">
                            <div style="color:green ;">{{ prop.node.label }}</div>
                          </div>
                          <div v-if="prop.node.TrangThaiHienThi == '(xóa)'">
                            <div style="color:orange ;">{{ prop.node.label }}</div>
                          </div>
                        </div>
                      </template>
                    </q-tree>
                  </div>
                </q-td>
              </q-tr>
            </template>
            <template v-slot:top-right>
              <q-input v-show="false" borderless dense debounce="300" v-model="filter" placeholder="Tìm kiếm">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:bottom style="padding:0px">
              <div class="row" style="width:100%">
               
                
                <div class="col-1" align="left">
                </div>
              </div>
            </template>
          </q-table>
          </div>
    </q-dialog>
    <q-dialog v-model="isShowDialogMau">
      <q-card style="min-width: 100%">
        <q-card-section class="row items-center">
          <span style="font-size: 20px; color: #21ab45; padding-left: 16px">Khai báo màu SP
          </span>
        </q-card-section>
        <q-card-section style="padding-top: 0px">
         
          <div class="row">
            <div class="col-12">
              <DxDataGrid id="gridContainer" :data-source="sanpham" :show-borders="true" key-expr="id"
                :row-alternation-enabled="true" :word-wrap-enabled="true">
                <DxColumn data-field="masosp" caption="Mã sản phẩm"  />
              
                <DxColumn data-field="name" caption="Tên sản phẩm"  />
              
                <DxColumn data-field="tennoibo" caption="Tên nội bộ" />
                <DxColumn data-field="dongsanpham" caption="Dòng sản phẩm" />
                <DxColumn data-field="khachhang" caption="Khách hàng" />
              </DxDataGrid>
            </div>
          </div>
          <hr />
            <div class="col-12" >
              <q-radio 
            style="font-weight: bold; padding-right: 40px"
            @input="loadMau"
            color="amber-6"
            v-model="typeBC"
            val="motmau"
            label="Một màu"
              />
               <q-radio 
            style="font-weight: bold; padding-right: 40px"
            @input="loadMau"
            color="amber-6"
            v-model="typeBC"
            val="nhieumau"
            label="Nhiều màu"
              />
               </div>
          <hr />
           <div class="row" v-show="chonnhieumau">
            <div class="col-2" 
             v-for="(value, index) in mamausp"
               :key="index"
               >
               <q-checkbox
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="mauthitruong"
                     :val="value.MA_MAU"
                      :label="value.COLOR"
                    />
            </div>
                        <!-- <div class="col-2" >
                     <q-checkbox
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="mauthitruong"
                     val='red'
                      label="đỏ"
                    />
                        </div>
                            <div class="col-2" >
                     <q-checkbox
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="mauthitruong"
                     val='black'
                      label="đen"
                    />
                        </div>
                            <div class="col-2" >
                     <q-checkbox
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="mauthitruong"
                     val='white'
                      label="trắng"
                    />
                        </div> -->
           </div>
          <div class="col-12" v-show="chonmau">
            <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
              Danh mục chi tiết:
             
            </p>
          </div>
     
          <div class="row" v-show="chonmau">
            <div class="col-12">
              <DxDataGrid id="gridContainer" :data-source="chitiet" :show-borders="true" key-expr="id"
                :row-alternation-enabled="true" :word-wrap-enabled="true">
                <DxColumn cell-template="cell-cb" :width="60" />
                <template #cell-cb="cell">
                  <div v-if="cell.data.data.color == null">
                    <q-checkbox v-model="cbChiTiet" :val="cell.data.data" @input="onSelectionCheckBox(cell.data.data)"
                      color="amber-6" />
                  </div>
                  <div v-else>
                    <q-checkbox v-model="checked" :val="cell.data.data" @input="onSelectionCheckBox(cell.data.data)"
                      disable color="amber-6" />
                  </div>
                </template>
                <DxColumn data-field="masosp" caption="Mã sản phẩm"  />
                <DxColumn data-field="name" caption="Tên chi tiết"  />
             
             
                <DxColumn data-field="masochitiet" caption="Mã chi tiết" />
              
                <DxColumn data-field="masocumchitiet" caption="Mã cụm chi tiết" />
                <DxColumn data-field="dai" caption="Dài" />
                <DxColumn data-field="rong" caption="Rộng" />
                <DxColumn data-field="day" caption="Dầy" />
                <DxColumn data-field="heso" caption="Hệ số" />
                <DxColumn data-field="soluong" caption="Khối lượng tinh" />
                <DxColumn data-field="dongsanpham" caption="Dòng sản phẩm" />
                  <DxColumn data-field="color" caption="Màu" />
                <DxColumn data-field="chungloai" caption="Chủng loại">
                  <DxLookup :data-source="chungloais" display-expr="label" value-expr="value" />
                </DxColumn>
                <DxColumn data-field="donvi" caption="Đơn vị">
                  <DxLookup :data-source="donvis" display-expr="label" value-expr="value" />
                </DxColumn>
               
                
              </DxDataGrid>
            </div>
          </div>
          <hr />
         <div class="row" v-show="chonmau">
            <div class="col-2" 
               v-for="(value, index) in mamausp"
               :key="index"
               >
               <q-checkbox
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="mauchitiet"
                     :val="value.MA_MAU"
                      :label="value.COLOR"
                    />
            </div>
                        <!-- <div class="col-2" >
                     <q-checkbox
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="mauchitiet"
                     val='red'
                      label="đỏ"
                    />
                        </div>
                            <div class="col-2" >
                     <q-checkbox
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="mauchitiet"
                     val='black'
                      label="đen"
                    />
                        </div>
                            <div class="col-2" >
                     <q-checkbox
                      @input="selectAll()"
                      dense
                      color="amber-6"
                      class="text-blue"
                      style="font-weight: bold"
                      v-model="mauchitiet"
                     val='white'
                      label="trắng"
                    />
                        </div> -->
           </div>

        </q-card-section>
        <div class="q-pa-md q-gutter-sm" align="right">
          <q-btn v-show="!view" color="positive" glossy label="Lưu" @click="phanmau" />
          <q-btn color="deep-orange" glossy label="Đóng" @click="hideDialog" />
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogSelectedCumChiTiet">
      <q-card style="min-width: 100%; min-height: 700px;padding: 20px;">
        <div class="col-12">
          <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
            Cụm chi tiết :
          </p>
        </div>
        <div class="row justify-around">
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedCumMasanpham" type="text" label-color="amber-6" label="Mã sản phẩm" readonly />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedCumMaCumChiTiet" type="text" label-color="amber-6" label="Mã cụm chi tiết"
              readonly />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedTenCumChiTiet" type="text" label-color="amber-6" label="Tên cụm chi tiết" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedDaiCumChiTiet" type="number" label-color="amber-6" label="Dài" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedRongCumChiTiet" type="number" label-color="amber-6" label="Rộng" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedDayCumChiTiet" type="number" label-color="amber-6" label="Dầy" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedHeSoCumChiTiet" type="number" label-color="amber-6" label="Hệ số" />
          </div>

          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedDongSanPhamCumChiTiet" label-color="amber-6" label="Dòng sản phẩm" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-select v-model="selectedChungLoaiCumChiTiet[0]" :options="chungloais" label-color="amber-6"
              label="Chủng loại" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-select v-model="selectedDonViCumChiTiet[0]" :options="donvis" label-color="amber-6" label="Đơn vị" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-select v-model="selectedSoLuongCumChiTiet" label-color="amber-6" label="Số lượng" readonly />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
          </div>
        </div>

        <hr />
        <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
          Chọn định tuyến nhà máy Thuận Hưng:
        </p>
        <table>
          <tr style="border-right: 1px solid black;border-bottom: 1px solid black; background-color: #daf8e1;">
            <th>Lựa Phôi</th>
            <th>Sơ chế</th>
            <th>Kho sau sơ chế</th>
            <th>Tinh chế</th>
            <th>Kho bán thành phẩm
            </th>
            <th>Hoàn thiện</th>
            <th>Đóng gói</th>
            <th>Kho Thành Phẩm</th>
          </tr>
          <!-- <tr v-if="factory == 100000"> -->
          <tr>
            <td>
              <div v-for="luaphoi in departmemntLuaPhoiThuanHung" :key="luaphoi.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="luaphoi" style="font-weight: bold" :label="luaphoi.NAME"
                  color="amber-6" @input="inputTableDinhTuyenTH" />
              </div>
            </td>
            <td>
              <div v-for="soche in departmemntSoCheThuanHung" :key="soche.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="soche" style="font-weight: bold" :label="soche.NAME"
                  color="amber-6" @input="inputTableDinhTuyenTH" />
              </div>
            </td>
            <td>
              <div v-for="khosoche in departmemntKhoSoCheThuanHung" :key="khosoche.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="khosoche" style="font-weight: bold" :label="khosoche.NAME"
                  color="amber-6" @input="inputTableDinhTuyenTH" />
              </div>
            </td>
            <td>
              <div v-for="tinhche in departmemntTinhCheThuanHung" :key="tinhche.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="tinhche" style="font-weight: bold" :label="tinhche.NAME"
                  color="amber-6" @input="inputTableDinhTuyenTHTC" />
              </div>
            </td>
            <td>
              <div v-for="khotinhche in departmemntKhoTinhCheThuanHung" :key="khotinhche.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="khotinhche" style="font-weight: bold" :label="khotinhche.NAME"
                  color="amber-6" @input="inputTableDinhTuyenTH" />
              </div>
            </td>
            <td>
              <div v-for="toson in departmemntToSonThuanHung" :key="toson.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="toson" style="font-weight: bold" :label="toson.NAME"
                  color="amber-6" @input="inputTableDinhTuyenTH" />
              </div>
            </td>
            <td>
              <div v-for="donggoi in departmemntDongGoiThuanHung" :key="donggoi.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="donggoi" style="font-weight: bold" :label="donggoi.NAME"
                  color="amber-6" @input="inputTableDinhTuyenTH" />
              </div>
            </td>
            <td>
              <div v-for="khothanhpham in departmemntKhoThanhPhamThuanHung" :key="khothanhpham.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="khothanhpham" style="font-weight: bold"
                  :label="khothanhpham.NAME" color="amber-6" @input="inputTableDinhTuyenTH" />
              </div>
            </td>
          </tr>
        </table>
        <!-- <tr v-else-if="factory == 102340"> -->
        <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
          Chọn định tuyến nhà máy Yên Sơn:
        </p>
        <table>
          <tr style="border-right: 1px solid black;border-bottom: 1px solid black; background-color: #daf8e1;">
            <th>Lựa Phôi</th>
            <th>Sơ chế</th>
            <th> Kho sau sơ chế </th>
            <th>Tinh chế</th>
            <th>Kho bán thành phẩm
            </th>
            <th>Hoàn thiện</th>
            <th>Đóng gói</th>
            <th>Kho Thành Phẩm</th>
          </tr>
          <tr>
            <td>
              <div v-for="luaphoi in departmemntLuaPhoiYenSon" :key="luaphoi.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="luaphoi" style="font-weight: bold" :label="luaphoi.NAME"
                  color="amber-6" @input="inputTableDinhTuyenYS" />
              </div>
            </td>
            <td>
              <div v-for="soche in departmemntSoCheYenSon" :key="soche.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="soche" style="font-weight: bold" :label="soche.NAME"
                  color="amber-6" @input="inputTableDinhTuyenYS" />
              </div>
            </td>
            <td>
              <div v-for="khosoche in departmemntKhoSoCheYenSon" :key="khosoche.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="khosoche" style="font-weight: bold" :label="khosoche.NAME"
                  color="amber-6" @input="inputTableDinhTuyenYS" />
              </div>
            </td>
            <td>
              <div v-for="tinhche in departmemntTinhCheYenSon" :key="tinhche.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="tinhche" style="font-weight: bold" :label="tinhche.NAME"
                  color="amber-6" @input="inputTableDinhTuyenYSTC" />
              </div>
            </td>
            <td>
              <div v-for="khotinhche in departmemntKhoTinhCheYenSon" :key="khotinhche.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="khotinhche" style="font-weight: bold" :label="khotinhche.NAME"
                  color="amber-6" @input="inputTableDinhTuyenYS" />
              </div>
            </td>
            <td>
              <div v-for="toson in departmemntToSonYenSon" :key="toson.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="toson" style="font-weight: bold" :label="toson.NAME"
                  color="amber-6" @input="inputTableDinhTuyenYS" />
              </div>
            </td>
            <td>
              <div v-for="donggoi in departmemntDongGoiYenSon" :key="donggoi.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="donggoi" style="font-weight: bold" :label="donggoi.NAME"
                  color="amber-6" @input="inputTableDinhTuyenYS" />
              </div>
            </td>
            <td>
              <div v-for="khothanhpham in departmemntKhoThanhPhamYenSon" :key="khothanhpham.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="khothanhpham" style="font-weight: bold"
                  :label="khothanhpham.NAME" color="amber-6" @input="inputTableDinhTuyenYS" />
              </div>
            </td>
          </tr>
        </table>
        <!-- <tr v-else-if="factory == 102366"> -->
        <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
          Chọn định tuyến nhà máy Thái Bình:
        </p>
        <table style="border: 1px solid black">
          <tr style="border-right: 1px solid black;border-bottom: 1px solid black; background-color: #daf8e1;">
            <th>Lựa Phôi</th>
            <th>Sơ chế</th>
            <th>Kho sau sơ chế</th>
            <th>Tinh chế</th>
            <th>Kho bán thành phẩm
            </th>
            <th>Hoàn thiện</th>
            <th>Đóng gói</th>
            <th>Kho Thành Phẩm</th>
          </tr>
          <tr>
            <td>
              <div v-for="luaphoi in departmemntLuaPhoiThaiBinh" :key="luaphoi.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="luaphoi" style="font-weight: bold" :label="luaphoi.NAME"
                  color="amber-6" @input="inputTableDinhTuyenTB" />
              </div>
            </td>
            <td>
              <div v-for="soche in departmemntSoCheThaiBinh" :key="soche.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="soche" style="font-weight: bold" :label="soche.NAME"
                  color="amber-6" @input="inputTableDinhTuyenTB" />
              </div>
            </td>
            <td>
              <div v-for="khosoche in departmemntKhoSoCheThaiBinh" :key="khosoche.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="khosoche" style="font-weight: bold" :label="khosoche.NAME"
                  color="amber-6" @input="inputTableDinhTuyenTB" />
              </div>
            </td>
            <td>
              <div v-for="tinhche in departmemntTinhCheThaiBinh" :key="tinhche.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="tinhche" style="font-weight: bold" :label="tinhche.NAME"
                  color="amber-6" @input="inputTableDinhTuyenTBTC" />
              </div>
            </td>
            <td>
              <div v-for="khotinhche in departmemntKhoTinhCheThaiBinh" :key="khotinhche.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="khotinhche" style="font-weight: bold" :label="khotinhche.NAME"
                  color="amber-6" @input="inputTableDinhTuyenTB" />
              </div>
            </td>
            <td>
              <div v-for="toson in departmemntToSonThaiBinh" :key="toson.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="toson" style="font-weight: bold" :label="toson.NAME"
                  color="amber-6" @input="inputTableDinhTuyenTB" />
              </div>
            </td>
            <td>
              <div v-for="donggoi in departmemntDongGoiThaiBinh" :key="donggoi.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="donggoi" style="font-weight: bold" :label="donggoi.NAME"
                  color="amber-6" @input="inputTableDinhTuyenTB" />
              </div>
            </td>
            <td>
              <div v-for="khothanhpham in departmemntKhoThanhPhamThaiBinh" :key="khothanhpham.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="khothanhpham" style="font-weight: bold"
                  :label="khothanhpham.NAME" color="amber-6" @input="inputTableDinhTuyenTB" />
              </div>
            </td>
          </tr>
        </table>
        <hr />
        <label style="font-weight: bold;">Định tuyến nhà máy CBG Thuận Hưng :</label>
        <DxDataGrid :data-source="dinhTuyenThuanHung" :show-borders="true" :row-alternation-enabled="true">
          <DxEditing :allow-updating="true" mode="row" />
          <DxColumn data-field="namecumchitiet" caption="Tên cụm" alignment="left" :allow-editing="false" />
          <DxColumn data-field="code" caption="Mã định tuyến" alignment="left" :allow-editing="false" />
          <DxColumn data-field="name" caption="Tên định tuyến" alignment="left" :allow-editing="false" />
          <DxColumn data-field="thutu" caption="Thứ tự" alignment="left" :allow-editing="false" />
        </DxDataGrid>
        <hr />
        <label style="font-weight: bold;">Định tuyến nhà máy CBG Yên Sơn 1 :</label>
        <DxDataGrid :data-source="dinhTuyenYenSon" :show-borders="true" :row-alternation-enabled="true">
          <DxEditing :allow-updating="true" mode="row" />
          <DxColumn data-field="namecumchitiet" caption="Tên cụm" alignment="left" :allow-editing="false" />
          <DxColumn data-field="code" caption="Mã" alignment="left" :allow-editing="false" />
          <DxColumn data-field="name" caption="Tên định tuyến" alignment="left" :allow-editing="false" />
          <DxColumn data-field="thutu" caption="Thứ tự" alignment="left" :allow-editing="false" />
        </DxDataGrid>
        <hr />
        <label style="font-weight: bold;">Định tuyến nhà máy CBG Thái Bình :</label>
        <DxDataGrid :data-source="dinhTuyenThaiBinh" :show-borders="true" :row-alternation-enabled="true">
          <DxEditing :allow-updating="true" mode="row" />
          <DxColumn data-field="namecumchitiet" caption="Tên cụm" alignment="left" :allow-editing="false" />
          <DxColumn data-field="code" caption="Mã" alignment="left" :allow-editing="false" />
          <DxColumn data-field="name" caption="Tên định tuyến" alignment="left" :allow-editing="false" />
          <DxColumn data-field="thutu" caption="Thứ tự" alignment="left" :allow-editing="false" />
        </DxDataGrid>
        <hr />
        <div align="right">
          <q-btn style="margin-right:30px" color="positive" label="Thêm mới" @click="addDinhTuyenTamCumChiTiet" />
          <q-btn style="margin-right:30px" color="negative" label="Đóng" @click="hideDialogCumChiTiet" />
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogSelectedSanPham">
      <q-card style="min-width: 100%; min-height: 700px;padding: 20px;">
        <div class="col-12">
          <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
            Cụm chi tiết :
          </p>
        </div>
        <div class="row justify-around">
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedMASP" type="text" label="Mã sản phẩm" readonly />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedTenSP" type="text" label="Tên sản phẩm" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedTenNoiBoSP" type="text" label="Tên nội bộ" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedDongSanPhamSP" type="text" label="Dòng sản phẩm" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedKhachHangSP" type="text" label="Khách hàng" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
          </div>
        </div>

        <hr />
        <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
          Chọn định tuyến nhà máy Thuận Hưng:
        </p>
        <table>
          <tr style="border-right: 1px solid black;border-bottom: 1px solid black; background-color: #daf8e1;">
            <th>Lựa Phôi</th>
            <th>Sơ chế</th>
            <th>Kho sau sơ chế</th>
            <th>Tinh chế</th>
            <th>Kho bán thành phẩm </th>
            <th>Hoàn thiện</th>
            <th>Đóng gói</th>
            <th>Kho Thành Phẩm</th>
          </tr>
          <!-- <tr v-if="factory == 100000"> -->
          <tr>
            <td>
              <div v-for="luaphoi in departmemntLuaPhoiThuanHung" :key="luaphoi.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="luaphoi" :label="luaphoi.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTH" />
              </div>
            </td>
            <td>
              <div v-for="soche in departmemntSoCheThuanHung" :key="soche.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="soche" :label="soche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTH" />
              </div>
            </td>
            <td>
              <div v-for="khosoche in departmemntKhoSoCheThuanHung" :key="khosoche.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="khosoche" :label="khosoche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTH" />
              </div>
            </td>
            <td>
              <div v-for="tinhche in departmemntTinhCheThuanHung" :key="tinhche.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="tinhche" :label="tinhche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTHTC" />
              </div>
            </td>
            <td>
              <div v-for="tinhche in departmemntKhoTinhCheThuanHung" :key="tinhche.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="tinhche" :label="tinhche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTH" />
              </div>
            </td>
            <td>
              <div v-for="toson in departmemntToSonThuanHung" :key="toson.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="toson" :label="toson.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTH" />
              </div>
            </td>
            <td>
              <div v-for="donggoi in departmemntDongGoiThuanHung" :key="donggoi.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="donggoi" :label="donggoi.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTH" />
              </div>
            </td>
            <td>
              <div v-for="khothanhpham in departmemntKhoThanhPhamThuanHung" :key="khothanhpham.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="khothanhpham" :label="khothanhpham.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTH" />
              </div>
            </td>
          </tr>
        </table>
        <!-- <tr v-else-if="factory == 102340"> -->
        <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
          Chọn định tuyến nhà máy Yên Sơn:
        </p>
        <table style="border: 1px solid black">
          <tr style="border-right: 1px solid black;border-bottom: 1px solid black; background-color: #daf8e1;">
            <th>Lựa Phôi</th>
            <th>Sơ chế</th>
            <th>Kho sau sơ chế</th>
            <th>Tinh chế</th>
            <th>Kho bán thành phẩm
            </th>
            <th>Hoàn thiện</th>
            <th>Đóng gói</th>
            <th>Kho Thành Phẩm</th>
          </tr>
          <tr>
            <td>
              <div v-for="luaphoi in departmemntLuaPhoiYenSon" :key="luaphoi.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="luaphoi" :label="luaphoi.NAME" color="amber-6"
                  @input="inputTableDinhTuyenYS" />
              </div>
            </td>
            <td>
              <div v-for="soche in departmemntSoCheYenSon" :key="soche.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="soche" :label="soche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenYS" />
              </div>
            </td>
            <td>
              <div v-for="khosoche in departmemntKhoSoCheYenSon" :key="khosoche.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="khosoche" :label="khosoche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenYS" />
              </div>
            </td>
            <td>
              <div v-for="tinhche in departmemntTinhCheYenSon" :key="tinhche.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="tinhche" :label="tinhche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenYSTC" />
              </div>
            </td>
            <td>
              <div v-for="khotinhche in departmemntKhoTinhCheYenSon" :key="khotinhche.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="khotinhche" :label="khotinhche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenYS" />
              </div>
            </td>
            <td>
              <div v-for="toson in departmemntToSonYenSon" :key="toson.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="toson" :label="toson.NAME" color="amber-6"
                  @input="inputTableDinhTuyenYS" />
              </div>
            </td>
            <td>
              <div v-for="donggoi in departmemntDongGoiYenSon" :key="donggoi.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="donggoi" :label="donggoi.NAME" color="amber-6"
                  @input="inputTableDinhTuyenYS" />
              </div>
            </td>
            <td>
              <div v-for="khothanhpham in departmemntKhoThanhPhamYenSon" :key="khothanhpham.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="khothanhpham" :label="khothanhpham.NAME" color="amber-6"
                  @input="inputTableDinhTuyenYS" />
              </div>
            </td>
          </tr>
        </table>
        <!-- <tr v-else-if="factory == 102366"> -->
        <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
          Chọn định tuyến nhà máy Thái Bình:
        </p>
        <table style="border: 1px solid black">
          <tr style="border-right: 1px solid black;border-bottom: 1px solid black; background-color: #daf8e1;">
            <th>Lựa Phôi</th>
            <th>Sơ chế</th>
            <th>Kho sau sơ chế</th>
            <th>Tinh chế</th>
            <th>Kho bán thành phẩm
            </th>
            <th>Hoàn thiện</th>
            <th>Đóng gói</th>
            <th>Kho Thành Phẩm</th>
          </tr>
          <tr>
            <td>
              <div v-for="luaphoi in departmemntLuaPhoiThaiBinh" :key="luaphoi.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="luaphoi" :label="luaphoi.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTB" />
              </div>
            </td>
            <td>
              <div v-for="soche in departmemntSoCheThaiBinh" :key="soche.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="soche" :label="soche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTB" />
              </div>
            </td>
            <td>
              <div v-for="khosoche in departmemntKhoSoCheThaiBinh" :key="khosoche.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="khosoche" :label="khosoche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTB" />
              </div>
            </td>
            <td>
              <div v-for="tinhche in departmemntTinhCheThaiBinh" :key="tinhche.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="tinhche" :label="tinhche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTBTC" />
              </div>
            </td>
            <td>
              <div v-for="khotinhche in departmemntKhoTinhCheThaiBinh" :key="khotinhche.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="khotinhche" :label="khotinhche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTB" />
              </div>
            </td>
            <td>
              <div v-for="toson in departmemntToSonThaiBinh" :key="toson.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="toson" :label="toson.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTB" />
              </div>
            </td>
            <td>
              <div v-for="donggoi in departmemntDongGoiThaiBinh" :key="donggoi.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="donggoi" :label="donggoi.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTB" />
              </div>
            </td>
            <td>
              <div v-for="khothanhpham in departmemntKhoThanhPhamThaiBinh" :key="khothanhpham.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="khothanhpham" :label="khothanhpham.NAME" color="amber-6"
                  @input="inputTableDinhTuyenTB" />
              </div>
            </td>
          </tr>
        </table>
        <hr />
        <label style="font-weight: bold;">Định tuyến nhà máy CBG Thuận Hưng :</label>
        <DxDataGrid :data-source="dinhTuyenThuanHung" :show-borders="true" :row-alternation-enabled="true">
          <DxEditing :allow-updating="true" mode="row" />
          <DxColumn data-field="code" caption="Mã định tuyến" alignment="left" :allow-editing="false" />
          <DxColumn data-field="name" caption="Tên định tuyến" alignment="left" :allow-editing="false" />
          <DxColumn data-field="thutu" caption="Thứ tự" alignment="left" :allow-editing="false" />
        </DxDataGrid>
        <hr />
        <label style="font-weight: bold;">Định tuyến nhà máy CBG Yên Sơn 1 :</label>
        <DxDataGrid :data-source="dinhTuyenYenSon" :show-borders="true" :row-alternation-enabled="true">
          <DxEditing :allow-updating="true" mode="row" />
          <DxColumn data-field="code" caption="Mã" alignment="left" :allow-editing="false" />
          <DxColumn data-field="name" caption="Tên định tuyến" alignment="left" :allow-editing="false" />
          <DxColumn data-field="thutu" caption="Thứ tự" alignment="left" :allow-editing="false" />
        </DxDataGrid>
        <hr />
        <label style="font-weight: bold;">Định tuyến nhà máy CBG Thái Bình :</label>
        <DxDataGrid :data-source="dinhTuyenThaiBinh" :show-borders="true" :row-alternation-enabled="true">
          <DxEditing :allow-updating="true" mode="row" />
          <DxColumn data-field="code" caption="Mã" alignment="left" :allow-editing="false" />
          <DxColumn data-field="name" caption="Tên định tuyến" alignment="left" :allow-editing="false" />
          <DxColumn data-field="thutu" caption="Thứ tự" alignment="left" :allow-editing="false" />
        </DxDataGrid>
        <hr />
        <div align="right">
          <q-btn style="margin-right:30px" color="positive" label="Thêm mới" @click="addDinhTuyenTam" />
          <q-btn style="margin-right:30px" color="negative" label="Đóng" @click="hideDialogSanPham" />
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogSelectedChiTiet">
      <q-card style="min-width: 100%; min-height: 700px;padding: 20px;">
        <div class="col-12">
          <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
            Chi tiết :
          </p>
        </div>
        <div class="row justify-around">
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedChiTietMasanpham" type="text" label="Mã sản phẩm" label-color="amber-6"
              readonly />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedMaChiTiet" type="text" label="Mã chi tiết" label-color="amber-6" readonly />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedMaCumChiTiet" type="text" label="Mã cụm chi tiết" readonly />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedTenChiTiet" type="text" label="Tên chi tiết" label-color="amber-6" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedDaiChiTiet" type="number" label="Dài" label-color="amber-6" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedRongChiTiet" type="number" label="Rộng" label-color="amber-6" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedDayChiTiet" type="number" label="Dầy" label-color="amber-6" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedHeSoChiTiet" type="number" label="Hệ số" label-color="amber-6" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedSoLuongChiTiet" type="number" label="Khối lượng tinh" label-color="amber-6" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-input v-model="selectedDongSanPhamChiTiet" label="Dòng sản phẩm" label-color="amber-6" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-select v-model="selectedChungLoaiChiTiet[0]" :options="chungloais" label="Chủng loại"
              label-color="amber-6" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
            <q-select v-model="selectedDonViChiTiet[0]" :options="donvis" label="Đơn vị" label-color="amber-6" />
          </div>
          <div class="col-12 col-md-5 q-mt-sm">
          </div>
        </div>
        <hr />
        <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
          Chọn định tuyến nhà máy Thuận Hưng:
        </p>
        <table style="border: 1px solid black">
          <tr style="border-right: 1px solid black;border-bottom: 1px solid black; background-color: #daf8e1;">
            <th>Lựa Phôi</th>
            <th>Sơ chế</th>
            <th>Kho sơ chế</th>
            <th>Tinh chế</th>
            <th>Kho bán thành phẩm</th>
            <th>Hoàn thiện</th>
            <th>Đóng gói</th>
            <th>Kho Thành Phẩm</th>
          </tr>
          <tr>
            <td>
              <div v-for="luaphoi in departmemntLuaPhoiThuanHung" :key="luaphoi.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="luaphoi" :label="luaphoi.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTH" />
              </div>
            </td>
            <td>
              <div v-for="soche in departmemntSoCheThuanHung" :key="soche.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="soche" :label="soche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTH" />
              </div>
            </td>
            <td>
              <div v-for="khosoche in departmemntKhoSoCheThuanHung" :key="khosoche.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="khosoche" :label="khosoche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTH" />
              </div>
            </td>
            <td>
              <div v-for="tinhche in departmemntTinhCheThuanHung" :key="tinhche.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="tinhche" :label="tinhche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTHTC" />
              </div>
            </td>
            <td>
              <div v-for="khotinhche in departmemntKhoTinhCheThuanHung" :key="khotinhche.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="khotinhche" :label="khotinhche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTH" />
              </div>
            </td>
            <td>
              <div v-for="toson in departmemntToSonThuanHung" :key="toson.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="toson" :label="toson.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTH" />
              </div>
            </td>
            <td>
              <div v-for="donggoi in departmemntDongGoiThuanHung" :key="donggoi.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="donggoi" :label="donggoi.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTH" />
              </div>
            </td>
            <td>
              <div v-for="khothanhpham in departmemntKhoThanhPhamThuanHung" :key="khothanhpham.index">
                <q-checkbox v-model="cbdinhtuyenTH" :val="khothanhpham" :label="khothanhpham.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTH" />
              </div>
            </td>
          </tr>
        </table>
        <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
          Chọn định tuyến nhà máy Yên Sơn:
        </p>
        <table>
          <tr style="border-right: 1px solid black;border-bottom: 1px solid black; background-color: #daf8e1;">
            <th>Lựa Phôi</th>
            <th>Sơ chế</th>
            <th>Kho sau sơ chế</th>
            <th>Tinh chế</th>
            <th>Kho bán thành phẩm
            </th>
            <th>Hoàn thiện</th>
            <th>Đóng gói</th>
            <th>Kho Thành Phẩm</th>
          </tr>
          <tr>
            <td>
              <div v-for="luaphoi in departmemntLuaPhoiYenSon" :key="luaphoi.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="luaphoi" :label="luaphoi.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTYS" />
              </div>
            </td>
            <td>
              <div v-for="soche in departmemntSoCheYenSon" :key="soche.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="soche" :label="soche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTYS" />
              </div>
            </td>
            <td>
              <div v-for="khosoche in departmemntKhoSoCheYenSon" :key="khosoche.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="khosoche" :label="khosoche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTYS" />
              </div>
            </td>
            <td>
              <div v-for="tinhche in departmemntTinhCheYenSon" :key="tinhche.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="tinhche" :label="tinhche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTYSTC" />
              </div>
            </td>
            <td>
              <div v-for="khotinhche in departmemntKhoTinhCheYenSon" :key="khotinhche.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="khotinhche" :label="khotinhche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTYS" />
              </div>
            </td>
            <td>
              <div v-for="toson in departmemntToSonYenSon" :key="toson.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="toson" :label="toson.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTYS" />
              </div>
            </td>
            <td>
              <div v-for="donggoi in departmemntDongGoiYenSon" :key="donggoi.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="donggoi" :label="donggoi.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTYS" />
              </div>
            </td>
            <td>
              <div v-for="khothanhpham in departmemntKhoThanhPhamYenSon" :key="khothanhpham.index">
                <q-checkbox v-model="cbdinhtuyenYS" :val="khothanhpham" :label="khothanhpham.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTYS" />
              </div>
            </td>
          </tr>
        </table>
        <p style="font-style: italic; color: blue;font-weight: bold; padding-left: 16px">
          Chọn định tuyến nhà máy Thái Bình:
        </p>
        <table>
          <tr style="border-right: 1px solid black;border-bottom: 1px solid black; background-color: #daf8e1;">
            <th>Lựa Phôi</th>
            <th>Sơ chế</th>
            <th>Kho sơ chế</th>
            <th>Tinh chế</th>
            <th>Kho bán thành phẩm</th>
            <th>Hoàn thiện</th>
            <th>Đóng gói</th>
            <th>Kho Thành Phẩm</th>
          </tr>
          <tr>
            <td>
              <div v-for="luaphoi in departmemntLuaPhoiThaiBinh" :key="luaphoi.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="luaphoi" :label="luaphoi.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTB" />
              </div>
            </td>
            <td>
              <div v-for="soche in departmemntSoCheThaiBinh" :key="soche.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="soche" :label="soche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTB" />
              </div>
            </td>
            <td>
              <div v-for="khosoche in departmemntKhoSoCheThaiBinh" :key="khosoche.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="khosoche" :label="khosoche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTB" />
              </div>
            </td>
            <td>
              <div v-for="tinhche in departmemntTinhCheThaiBinh" :key="tinhche.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="tinhche" :label="tinhche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTBTC" />
              </div>
            </td>
            <td>
              <div v-for="khotinhche in departmemntKhoTinhCheThaiBinh" :key="khotinhche.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="khotinhche" :label="khotinhche.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTB" />
              </div>
            </td>
            <td>
              <div v-for="toson in departmemntToSonThaiBinh" :key="toson.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="toson" :label="toson.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTB" />
              </div>
            </td>
            <td>
              <div v-for="donggoi in departmemntDongGoiThaiBinh" :key="donggoi.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="donggoi" :label="donggoi.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTB" />
              </div>
            </td>
            <td>
              <div v-for="khothanhpham in departmemntKhoThanhPhamThaiBinh" :key="khothanhpham.index">
                <q-checkbox v-model="cbdinhtuyenTB" :val="khothanhpham" :label="khothanhpham.NAME" color="amber-6"
                  @input="inputTableDinhTuyenCTTB" />
              </div>
            </td>
          </tr>
        </table>
        <hr />
        <label style="font-weight: bold;">Định tuyến nhà máy CBG Thuận Hưng :</label>
        <DxDataGrid :data-source="ctdinhTuyenThuanHung" :show-borders="true" :row-alternation-enabled="true">
          <DxEditing :allow-updating="true" mode="row" />
          <DxColumn data-field="namechitiet" caption="Tên chi tiết" alignment="left" :allow-editing="false" />
          <DxColumn data-field="code" caption="Mã định tuyến" alignment="left" :allow-editing="false" />
          <DxColumn data-field="name" caption="Tên định tuyến" alignment="left" :allow-editing="false" />
          <DxColumn data-field="thutu" caption="Thứ tự" alignment="left" :allow-editing="false" />
        </DxDataGrid>
        <hr />
        <label style="font-weight: bold;">Định tuyến nhà máy CBG Yên Sơn 1 :</label>
        <DxDataGrid :data-source="ctdinhTuyenYenSon" :show-borders="true" :row-alternation-enabled="true">
          <DxEditing :allow-updating="true" mode="row" />
          <DxColumn data-field="namechitiet" caption="Tên chi tiết" alignment="left" :allow-editing="false" />
          <DxColumn data-field="code" caption="Mã" alignment="left" :allow-editing="false" />
          <DxColumn data-field="name" caption="Tên định tuyến" alignment="left" :allow-editing="false" />
          <DxColumn data-field="thutu" caption="Thứ tự" alignment="left" />
        </DxDataGrid>
        <hr />
        <label style="font-weight: bold;">Định tuyến nhà máy CBG Thái Bình :</label>
        <DxDataGrid :data-source="ctdinhTuyenThaiBinh" :show-borders="true" :row-alternation-enabled="true">
          <DxEditing :allow-updating="true" mode="row" />
          <DxColumn data-field="namechitiet" caption="Tên chi tiết" alignment="left" :allow-editing="false" />
          <DxColumn data-field="code" caption="Mã" alignment="left" :allow-editing="false" />
          <DxColumn data-field="name" caption="Tên định tuyến" alignment="left" :allow-editing="false" />
          <DxColumn data-field="thutu" caption="Thứ tự" alignment="left" />
        </DxDataGrid>
        <hr />
        <div align="right">
          <q-btn style="margin-right:30px" color="positive" label="Thêm mới" @click="addDinhTuyenTamCT" />
          <q-btn style="margin-right:30px" color="negative" label="Đóng" @click="hideDialogChiTiet" />
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isXacNhanDel">
      <q-card style="padding: 10px 10px 0 10px;">
        <div>
          bạn chắc chắn muốn xóa
          <label style="font-weight: bold;">{{ nameXoa }}</label>
        </div>
        <div class="q-pa-md q-gutter-sm" align="right">
          <q-btn color="primary" label="xác nhận" @click="xoa" />
          <q-btn color="deep-orange" label="đóng" @click="hideXacNhanDel" />
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isDialogCSM">
      <q-card style="min-width: 100%;padding: 10px;">
        <div class="row">
          <div class="col-4" style="padding-right: 20px;">
            <label style="font-weight: bold;font-size: 18px;">Nhà máy CBG Thuận Hưng :</label>
            <DxDataGrid :data-source="congsuatmayTH" :show-borders="true" :show-row-lines="true">
              <DxPaging :page-size="100" />
              <DxGrouping :auto-expand-all="autoExpandAll" />
              <DxEditing :allow-updating="true" mode="row" />
              <DxColumn data-field="NAME" caption="Tên tổ" alignment="left" :allow-editing="false" />
              <DxColumn data-field="CONGSUAT" caption="Công suất" alignment="left" :width="100" :allow-editing="true"
                data-type="number" />
              <DxColumn :group-index="0" data-field="Nhóm" group-cell-template="groupCellTemplate" />
              <template #groupCellTemplate="{ data }">
                <div style="font-weight: bold;color:black;">
                  {{ data.value }}
                </div>
              </template>
            </DxDataGrid>
          </div>
          <div class="col-4" style="padding-right: 20px;">
            <label style="font-weight: bold;font-size: 18px">Nhà máy CBG Yên Sơn :</label>
            <DxDataGrid :data-source="congsuatmayYS" :show-borders="true" :show-row-lines="true">
              <DxPaging :page-size="100" />
              <DxGrouping :auto-expand-all="autoExpandAll" />
              <DxEditing :allow-updating="true" mode="row" />
              <DxColumn data-field="NAME" caption="Tên tổ" alignment="left" :allow-editing="false" />
              <DxColumn data-field="CONGSUAT" caption="Công suất" alignment="left" :width="100" :allow-editing="true"
                data-type="number" />
              <DxColumn :group-index="0" data-field="Nhóm" group-cell-template="groupCellTemplate" />
              <template #groupCellTemplate="{ data }">
                <div style="font-weight: bold;color:black">
                  {{ data.value }}
                </div>
              </template>
            </DxDataGrid>
          </div>
          <div class="col-4">
            <label style="font-weight: bold;font-size: 18px">Nhà máy CBG Thái Bình :</label>
            <DxDataGrid :data-source="congsuatmayTB" :show-borders="true" :show-row-lines="true">
              <DxPaging :page-size="100" />
              <DxGrouping :auto-expand-all="autoExpandAll" />
              <DxEditing :allow-updating="true" mode="row" />
              <DxColumn data-field="NAME" caption="Tên tổ" alignment="left" :allow-editing="false" />
              <DxColumn data-field="CONGSUAT" caption="Công suất" alignment="left" :width="100" :allow-editing="true"
                data-type="number" />
              <DxColumn :group-index="0" data-field="Nhóm" group-cell-template="groupCellTemplate" />
              <template #groupCellTemplate="{ data }">
                <div style="font-weight: bold;color:black">
                  {{ data.value }}
                </div>
              </template>
            </DxDataGrid>
          </div>
        </div>
        <hr />
        <div class="row" align="right">
          <div class="col-2" style="text-align: left;">
            <DxCheckBox id="autoExpand" v-model="autoExpandAll" text="Hiển thị tất cả tổ" />
          </div>
          <div class="col-10">
            <q-btn color="positive" label="gửi phê duyệt" @click="pheDuyetCSM" style="margin-right: 5px;" />
            <q-btn color="red" label="đóng" @click="hideDialogCSM" />
          </div>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isShowMongAmDuongTH">
      <q-card style="min-width: 30%;padding: 10px;">
        <label style="font-weight: bold;">Chọn các bước gia công cần tính công suất ở tổ tinh chế:</label>
        <div class="row">
          <div class="col-4">
            <q-checkbox v-model="cbMongAmDuong" val="mongam" label="Mộng âm" />
          </div>
          <div class="col-4">
            <q-checkbox v-model="cbMongAmDuong" val="mongduong" label="Mộng dương" />
          </div>
          <div class="col-4 ">
            <q-checkbox v-model="cbMongAmDuong" val="khoan" label="Khoan" />
          </div>
        </div>
        <div class="row">
          <div class="col-12 q-pa-md q-gutter-sm" align="right">
            <q-btn color="primary" label="Xác nhận" @click="xacnhanAmDuongTH" />
            <q-btn color="red" label="Đóng" @click="isShowMongAmDuongTH = false" />
          </div>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isShowMongAmDuongYS">
      <q-card style="min-width: 30%;padding: 10px;">
        <label style="font-weight: bold;">Chọn các bước gia công cần tính công suất ở tổ tinh chế:</label>
        <div class="row">
          <div class="col-4">
            <q-checkbox v-model="cbMongAmDuong" val="mongam" label="Mộng âm" />
          </div>
          <div class="col-4">
            <q-checkbox v-model="cbMongAmDuong" val="mongduong" label="Mộng dương" />
          </div>
          <div class="col-4 ">
            <q-checkbox v-model="cbMongAmDuong" val="khoan" label="Khoan" />
          </div>
        </div>
        <div class="row">
          <div class="col-12 q-pa-md q-gutter-sm" align="right">
            <q-btn color="primary" label="Xác nhận" @click="xacnhanAmDuongYS" />
            <q-btn color="red" label="Đóng" @click="isShowMongAmDuongYS = false" />
          </div>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isShowMongAmDuongTB">
      <q-card style="min-width: 30%;padding: 10px;">
        <label style="font-weight: bold;">Chọn các bước gia công cần tính công suất ở tổ tinh chế:</label>
        <div class="row">
          <div class="col-4">
            <q-checkbox v-model="cbMongAmDuong" val="mongam" label="Mộng âm" />
          </div>
          <div class="col-4">
            <q-checkbox v-model="cbMongAmDuong" val="mongduong" label="Mộng dương" />
          </div>
          <div class="col-4 ">
            <q-checkbox v-model="cbMongAmDuong" val="khoan" label="Khoan" />
          </div>
        </div>
        <div class="row">
          <div class="col-12 q-pa-md q-gutter-sm" align="right">
            <q-btn color="primary" label="Xác nhận" @click="xacnhanAmDuongTB" />
            <q-btn color="red" label="Đóng" @click="isShowMongAmDuongTB = false" />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  DxDataGrid, DxColumn, DxEditing, DxPaging, DxLookup, DxSelection, DxExport,
  DxSearchPanel,
  DxHeaderFilter,
  DxFilterRow,
  DxRequiredRule,
  DxGrouping,
  DxGroupPanel,
} from 'devextreme-vue/data-grid';
import DxCheckBox from 'devextreme-vue/check-box';
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    DxCheckBox,
    DxGrouping,
    DxGroupPanel,
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxLookup,
    DxSelection,
    DxExport,
    DxSearchPanel,
    DxHeaderFilter,
    DxFilterRow,
    DxRequiredRule,
  },
  data() {
    return {
      //   columns: [
      //   { name: 'mã sản phẩm', align: 'center', label: 'Mã sản phẩm', field: 'MASP' },
      //   { name: 'tên sản phẩm', align: 'center', label: 'Tên sản phẩm', field: 'NAME' },
      //   { name: 'người tạo', align: 'center', label: 'Người tạo', field: 'CREATE_BY_NAME' },
      // ],
      items: [],
      isShowDialogMau:false,
      columnsItem: [
        { name: 'masp', align: 'center', label: 'Mã số', field: 'masp' },
        { name: 'ten', align: 'center', label: 'Tên', field: 'ten' },
        { name: 'macumchitiet', align: 'center', label: 'Mã cụm chi tiết', field: 'macumchitiet' },
        { name: 'machitiet', align: 'center', label: 'Mã chi tiết', field: 'machitiet' },
        { name: 'dai', align: 'center', label: 'Dài', field: 'dai' },
        { name: 'rong', align: 'center', label: 'Rộng', field: 'rong' },
        { name: 'day', align: 'center', label: 'Dầy', field: 'day' },
        { name: 'soluong', align: 'center', label: 'Số lượng', field: 'soluong' },
        { name: 'dongsanpham', align: 'center', label: 'Dòng sản phẩm', field: 'dongsanpham' },
        { name: 'chungloai', align: 'center', label: 'Chủng loại', field: 'chungloai_name' },
        { name: 'donvi', align: 'center', label: 'Đơn vị', field: 'donvi_name' },
      ],
      columnsspChoDuyet: [
        { name: 'masp', align: 'center', label: 'Mã số', field: 'masp' },
        { name: 'ten', align: 'center', label: 'Tên', field: 'ten' },
        { name: 'macumchitiet', align: 'center', label: 'Mã cụm chi tiết', field: 'macumchitiet' },
        { name: 'machitiet', align: 'center', label: 'Mã chi tiết', field: 'machitiet' },
        { name: 'dai', align: 'center', label: 'Dài', field: 'dai' },
        { name: 'rong', align: 'center', label: 'Rộng', field: 'rong' },
        { name: 'day', align: 'center', label: 'Dầy', field: 'day' },
        { name: 'soluong', align: 'center', label: 'Số lượng', field: 'soluong' },
        { name: 'dongsanpham', align: 'center', label: 'Dòng sản phẩm', field: 'dongsanpham' },
        { name: 'chungloai', align: 'center', label: 'Chủng loại', field: 'chungloai_name' },
        { name: 'donvi', align: 'center', label: 'Đơn vị', field: 'donvi_name' },
      ],

      selectedItem: [],
      itemsPaging: {
        rowsPerPage: 13
      },
      typeBC:'',
      chonmau:false,
      treeData:[],
         page: {
        rowsPerPage: 0
        // rowsNumber: xx if getting data from a server
      },
      chonnhieumau:false,
      mauthitruong:[],
      mauchitiet:[],
      spIsDone: true,
      isShowDialog: false,
      chitiet: [],
      masp: null,
      tensp: null,
      soluong: null,
      tengoi: null,
      anhsanpham: null,
      khachhang: null,
      spdongsanpham: null,
      cumchitiet: [],
      donvis: [],
      chungloais: [],
      selectedItemKeys: null,
      cttensanpham : null,
      ctensanpham : null,
      cttenchitiet: null,
      ctmasanpham: null,
      ctmachitiet: null,
      ctmacumchitiet: null,
      cttenoibo: null,
      ctdai: null,
      ctrong: null,
      ctday: null,
      ctsoluong: null,
      ctdongsanpham: null,
      ctchungloai: null,
      ctdonvi: null,
      ctheso: null,
      ctencumchitiet: null,
      cmasanpham: null,
      cmacumchitiet: null,
      ctenoibo: null,
      cdai: 0,
      crong: 0,
      cday: 0,
      csoluong: null,
      cdongsanpham: null,
      cchungloai: {
        label: "Cụm chi tiết",
        value: 100002
      },
      cdonvi: null,
      cheso: null,
      accept: false,
      hinhcay:false,
      sua: false,
      isDialogSelectedCumChiTiet: false,
      selectedTenSP: null,
      selectedMASP: null,

      selectedTenCumChiTiet: null,
      selectedCumMasanpham: null,
      selectedCumMaCumChiTiet: null,
      factoryID: null,
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          id: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          id: 102340,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          id: 102366,
          code: "TB",
        },
      ],
      departmemnt: [],
      departmemntLuaPhoi: [],
      departmemntSoChe: [],
      departmemntTinhChe: [],
      departmemntToSon: [],
      departmemntDongGoi: [],
      departmemntKhoThanhPham: [],
      cbLuaPhoi: [],
      cbSoChe: [],
      cbTinhChe: [],
      cbToSon: [],
      cbDongGoi: [],
      cbKhoThanhPham: [],
      dinhTuyenThuanHung: [],
      dinhTuyenLuaPhoi: [],
      dinhTuyenSoChe: [],
      dinhTuyenTinhChe: [],
      dinhTuyenHoanThien: [],
      dinhTuyenDongGoi: [],
      dinhTuyenKhoThanhPham: [],
      cbdinhtuyen: [],
      dinhTuyenYenSon: [],
      dinhTuyenThaiBinh: [],
      cbdinhtuyenTH: [],
      cbdinhtuyenYS: [],
      cbdinhtuyenTB: [],

      departmentThuanHung: [],
      departmentYenSon: [],
      departmentThaiBinh: [],

      departmemntLuaPhoiThuanHung: [],
      departmemntSoCheThuanHung: [],
      departmemntKhoSoCheThuanHung: [],
      departmemntKhoTinhCheThuanHung: [],
      departmemntTinhCheThuanHung: [],
      departmemntToSonThuanHung: [],
      departmemntDongGoiThuanHung: [],
      departmemntKhoThanhPhamThuanHung: [],

      departmemntLuaPhoiYenSon: [],
      departmemntSoCheYenSon: [],
      departmemntKhoSoCheYenSon: [],
      departmemntTinhCheYenSon: [],
      departmemntKhoTinhCheYenSon: [],
      departmemntToSonYenSon: [],
      departmemntDongGoiYenSon: [],
      departmemntKhoThanhPhamYenSon: [],

      departmemntLuaPhoiThaiBinh: [],
      departmemntSoCheThaiBinh: [],
      departmemntKhoSoCheThaiBinh: [],
      departmemntTinhCheThaiBinh: [],
      departmemntKhoTinhCheThaiBinh: [],
      departmemntToSonThaiBinh: [],
      departmemntDongGoiThaiBinh: [],
      departmemntKhoThanhPhamThaiBinh: [],
      dinhTuyenThuanHungAll: [],
      factory: 0,
      TH: [],
      YS: [],
      TB: [],

      isDialogSelectedChiTiet: false,
      selectedTenChiTiet: null,
      selectedChiTietMasanpham: null,
      selectedMaChiTiet: null,
      selectedMaCumChiTiet: null,
      ctdinhTuyenThuanHung: [],
      ctdinhTuyenYenSon: [],
      ctdinhTuyenThaiBinh: [],
      THCT: [],
      YSCT: [],
      TBCT: [],
      cbChiTietTrongCum: [],
      allSanPham: [],
      allSP1:[],
      dataAllSP:[],
      allRoutingTemp: [],
      sanpham: [],
      isSanPhamChoDuuyet: true,
      spChoDuyet: [],
      selectedspChoDuyet: [],

      isXacNhanDel: false,
      nameXoa: '',
      filterItem: '',
         filter: '',
      isDialogSelectedSanPham: false,
      idxoa: null,
      isChinhSua: false,

      isExcel: false,
      view: false,

      selectedTenNoiBoSP: '',
      selectedDongSanPhamSP: '',
      selectedKhachHangSP: '',
      selectedDaiCumChiTiet: '',
      selectedRongCumChiTiet: '',
      selectedDayCumChiTiet: '',
      selectedHeSoCumChiTiet: '',
      selectedDongSanPhamCumChiTiet: '',
      selectedChungLoaiCumChiTiet: [{
        label: '',
        value: 0,
      }],
      selectedDonViCumChiTiet: [{
        label: '',
        value: 0,
      }],
      selectedSoLuongCumChiTiet: '',
      selectedDaiChiTiet: '',
      selectedRongChiTiet: '',
      selectedDayChiTiet: '',
      selectedHeSoChiTiet: '',
      selectedSoLuongChiTiet: '',
      selectedDongSanPhamChiTiet: '',
      selectedChungLoaiChiTiet: [{
        label: '',
        value: 0,
      }],
      selectedDonViChiTiet: [{
        label: '',
        value: 0,
      }],
      cbChiTiet: [],
      checked: null,

      isDialogCSM: false,
      congsuatmayTH: [],
      congsuatmayYS: [],
      congsuatmayTB: [],
      autoExpandAll: false,

      isShowMongAmDuongTH: false,
      isShowMongAmDuongYS: false,
      isShowMongAmDuongTB: false,
      cbMongAmDuong: [],
    }
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("messages", ["sendNotificationMail"]),
    ...mapActions("prod",
      [
        "getAllItem",
        "insertSanPham",
        "insertCum",
        "insertChiTiet",
        "getAllDepartmetHaveCode",
        "getAllSanPham",
        "getAllSanPhamduyet",
        "getMamau",
        "updateChiTiet",
        "laymausanpham",
        "updateChiTietmau",
        "insertspmau",
        "insertDinhTuyenTemplate",
        "getAllRoutingTemp",
        "updateTrangThaiSanPham",
        "insertSuaSanPham",
        "delSP",
        "updataTypeEdit",
        "updateTrangThaiEDIT",
        "updateSoLuongCum",
        "updateEditSanPham",
        "updateCumOfChiTiet",
        "updateCongSuatMay"
      ]),

    async loadSanPham() {
      const data = await this.getAllSanPham();
      this.allSanPham = data.data
      const data1 = await this.getAllSanPhamduyet()
      this.dataAllSP = data.data
      this.allSP1 = data1.data.filter(f => f.TRANGTHAI == "approve")
      this.allSP1.forEach(e => {
        if (e.TRANGTHAI == 'chopheduyet') {
          e.TrangThaiHienThi = ''
        } else if (e.TRANGTHAI == 'tuchoi') {
          e.TrangThaiHienThi = '(Từ chối)'
        } else if (e.TRANGTHAI == 'pheduyet') {
          e.TrangThaiHienThi = '(Đồng ý)'
        }
        else if (e.TRANGTHAI == 'approve') {
          if (e.TYPE_EDIT == '') {
            e.TrangThaiHienThi = '(Đồng ý)'
          } else if (e.TYPE_EDIT == 'edit-delete') {
            e.TrangThaiHienThi = '(xóa)'
          } else if (e.TYPE_EDIT == 'edit-insert') {
            e.TrangThaiHienThi = '(Thêm mới)'
          }
        } else if (e.TRANGTHAI == 'chuaduyet') {
          if (e.TYPE_EDIT == 'edit') {
            e.TrangThaiHienThi = ''
          } else if (e.TYPE_EDIT == 'edit-insert') {
            e.TrangThaiHienThi = '(Thêm mới)'
          } else if (e.TYPE_EDIT == 'edit-delete') {
            e.TrangThaiHienThi = '(xóa)'
          }
        } else {
          e.TrangThaiHienThi = ''
        }
      });
        this.data2 = this.allSP1.filter(f => f.TYPE == "sanPham")
      let dataSPCreatedByUser = [];
      let dataChiTietByUser = [];
      let dataCumChiTietByUser = [];

      //xử lý thêm mới sản phẩm
      dataSPCreatedByUser = this.allSanPham.filter(f => f.CREATE_BY == this.userInfo.id && f.TYPE == 'sanPham' && f.TRANGTHAI == 'chuaduyet' && (f.TYPE_EDIT == null || f.TYPE_EDIT == ''))

      if (dataSPCreatedByUser.length != 0) {
        //set input sản phẩm
        this.masp = dataSPCreatedByUser[0].MASP;
        this.tensp = dataSPCreatedByUser[0].NAME;
        this.tengoi = dataSPCreatedByUser[0].TENNOIBO;
        this.anhsanpham = dataSPCreatedByUser[0].ANHSANPHAM;
        this.khachhang = dataSPCreatedByUser[0].KHACHHANG;
        this.spdongsanpham = dataSPCreatedByUser[0].DONGSANPHAM;
        this.ctdongsanpham = this.spdongsanpham
        this.cdongsanpham = this.spdongsanpham
        this.ctmasanpham = this.masp;
        this.ctensanpham = dataSPCreatedByUser[0].NAME;
        this.cttensanpham = dataSPCreatedByUser[0].NAME;
        this.cmasanpham = this.masp;
        this.spIsDone = false;
        this.sua = true

        //set input sản phẩm
        this.sanpham = []
        this.sanpham.push({
          id: dataSPCreatedByUser[0].ID,
          name: dataSPCreatedByUser[0].NAME,
          masosp: dataSPCreatedByUser[0].MASP,
          tennoibo: dataSPCreatedByUser[0].TENNOIBO,
          anhsp: dataSPCreatedByUser[0].ANHSANPHAM,
          dongsanpham: dataSPCreatedByUser[0].DONGSANPHAM,
          khachhang: dataSPCreatedByUser[0].KHACHHANG,

        })
        //set input chi tiết
        dataChiTietByUser = data.data.filter(f => f.CREATE_BY == this.userInfo.id && f.TYPE == 'chiTiet' && f.MASP == this.masp && f.TRANGTHAI == 'chuaduyet' && (f.TYPE_EDIT == null || f.TYPE_EDIT == ''))
        this.chitiet = []
        dataChiTietByUser.forEach(e => {
          this.chitiet.push({
            id: e.ID,
            name: e.NAME,
            masosp: e.MASP,
            masochitiet: e.MACHITIET,
            masocumchitiet: e.MACUMCHITIET,
            dai: e.DAI,
            rong: e.RONG,
            day: e.DAY,
            heso: e.HESO,
            soluong: e.SOLUONG,
            dongsanpham: e.DONGSANPHAM,
            chungloai: e.CHUNGLOAI,
            donvi: e.DONVI,
            color:e.COLOR,
            delete: 'delete'
          })
        });

        // set input cụm chi tiết
        dataCumChiTietByUser = data.data.filter(f => f.CREATE_BY == this.userInfo.id && f.TYPE == 'cumChiTiet' && f.MASP == this.masp && (f.TYPE_EDIT == null || f.TYPE_EDIT == ''))

        this.cumchitiet = []
        dataCumChiTietByUser.forEach(e => {
          this.cumchitiet.push({
            id: e.ID,
            masosp: e.MASP,
            name: e.NAME,
            masocumchitiet: e.MACUMCHITIET,
            dai: e.DAI,
            rong: e.RONG,
            day: e.DAY,
            heso: e.HESO,
            soluong: e.SOLUONG,
            dongsanpham: e.DONGSANPHAM,
            chungloai: e.CHUNGLOAI,
            donvi: e.DONVI,
          })
        });
      }
    },
    async loadRoungtingTemp() {
      this.allRoutingTemp = await this.getAllRoutingTemp()
    },
      //  async selectAll() {
      //   console.log('mau thi truong:',this.mauthitruong)
      //  },
    async loadItems() {
      let data = await this.getAllSanPham()
      data = data.data.filter(f => f.TRANGTHAI == 'approve' && f.TYPE == 'sanPham')
      this.items = []
      data.forEach(e => {
        this.items.push({
          itemid: e.ID,
          masp: e.MASP,
          ten: e.NAME,
          machitiet: e.MACHITIET,
          macumchitiet: e.MACUMCHITIET,
          dai: e.DAI,
          rong: e.RONG,
          day: e.DAY,
          soluong: e.SOLUONG,
          dongsanpham: e.DONGSANPHAM,
          chungloai: e.CHUNGLOAI,
          chungloai_name: e.CHUNGLOAI_NAME,
          donvi: e.DONVI,
          donvi_name: e.DONVI_NAME
        })
      });
    },
    async loadSPChoPheDuyet() {
      const data = await this.getAllSanPham();
      this.allSanPham = data.data
      let dataspChoDuyet = this.allSanPham.filter(f => f.CREATE_BY == this.userInfo.id && f.TRANGTHAI == 'chopheduyet' || (f.TRANGTHAI == 'approve' && f.TYPE_EDIT != ''))
      this.spChoDuyet = []
      dataspChoDuyet.forEach(e => {
        this.spChoDuyet.push({
          itemid: e.ID,
          masp: e.MASP,
          ten: e.NAME,
          machitiet: e.MACHITIET,
          macumchitiet: e.MACUMCHITIET,
          dai: e.DAI,
          rong: e.RONG,
          day: e.DAY,
          soluong: e.SOLUONG,
          dongsanpham: e.DONGSANPHAM,
          chungloai: e.CHUNGLOAI,
          chungloai_name: e.CHUNGLOAI_NAME,
          donvi: e.DONVI,
          donvi_name: e.DONVI_NAME
        })
      });
    },
    showDialog() {
      this.loadSanPham();
      this.isShowDialog = true
    },
    hideDialog() {
      this.isChinhSua = false
      this.isShowDialog = false
      this.isShowDialogMau = false
      this.view = false
      if (this.view) {
        window.location.reload()
      }
    },
    async loadUnit() {
      let data = await this.$store.dispatch("base/GET_UNITS", 1);
      data.data.forEach(e => {
        this.donvis.push({
          label: e.name,
          value: e.id
        })
      });
    },
    async loadItemTypes() {
      const myItemType = this.$route.query.type;
      const payload = {
        typeId: myItemType,
      };
      let data = await this.$store.dispatch("item/getItemtypes", payload);
      data.data.forEach((element) => {
        this.chungloais.push({
          label: element.name,
          value: element.id,
        });
      });
    },

    async themchitiet() {
      if (
        this.cttenchitiet != null && this.ctmasanpham != null && this.ctmachitiet != null &&
        this.ctdai != null && this.ctrong != null && this.ctday != null
        && this.ctheso != null
      ) {
        if (this.ctsoluong == null || this.ctsoluong == '') {
          this.ctsoluong = this.ctdai * this.ctrong * this.ctday * 0.000000001
        }
        let payload = []
        payload.push({
          name: this.cttenchitiet,
          masosp: this.ctmasanpham,
          masocumchitiet: '',
          masochitiet: this.ctmachitiet,
          dai: this.ctdai,
          rong: this.ctrong,
          day: this.ctday,
          soluong: this.ctsoluong,
          dongsanphamham: this.ctdongsanpham,
          chungloai: this.ctchungloai.value,
          donvi: this.ctdonvi.value,
          heso: this.ctheso,
          create_by: this.userInfo.id,
          trangthai: 'chuaduyet',
          type: 'chiTiet',
          type_edit: ''
        })
        if (this.isChinhSua) {
          payload[0].type_edit = 'edit-insert'
        }
        let checkTrungMaCT = null
        checkTrungMaCT = this.allSanPham.find(f => f.MACHITIET == this.ctmachitiet)
        if (checkTrungMaCT == null) {
          const data = await this.insertChiTiet(payload);
          if (data.meta.success) {
            this.$q.notify({
              color: 'positive',
              message: 'Thêm chi tiết thành công cho sản phẩm ' + this.tensp + ' !'
            })
          }
          if (this.isChinhSua) {
            this.loadEditSP();
          } else {
            this.loadSanPham();
          }
          this.cttenchitiet = '';
          this.ctmachitiet = '';
          this.ctdai = '';
          this.ctrong = '';
          this.ctday = '';
          this.ctsoluong = null;
          this.ctdongsanpham = '';
          this.ctchungloai = '';
          this.ctdonvi = '';
          this.ctheso = '';
        } else {
          this.$q.notify({
            color: 'negative',
            message: 'Mã chi tiết đã tồn tại !!!'
          })
        }
      } else {
        this.$q.notify({
          color: 'negative',
          message: 'Điền các đầy đủ thông tin cần thiết'
        })
      }
    },
 async   phanmau() {
  if (this.typeBC == 'nhieumau') {
   if (this.cbChiTiet.length != 0) {
          let payloadupdate = []
          this.cbChiTiet.forEach(e => {
            payloadupdate.push({
              color: this.mauchitiet[0],
              id: e.id
            })
          });
               const updatemau = await this.updateChiTietmau(payloadupdate)
                if (updatemau.meta.success) {
              this.cbChiTiet = []
              this.$q.notify({
                color: 'positive',
                message: 'Thêm màu chi tiết thành công cho sản phẩm ' + this.tensp + ' !'
              })
            }
            this.mauchitiet = [];
               const datamau = await this.getAllSanPham();
               let dataChiTietBymau = datamau.data.filter(f =>  f.TYPE == 'chiTiet' && f.MASP == this.masp )
                    this.chitiet = []
        dataChiTietBymau.forEach(e => {
          this.chitiet.push({
            id: e.ID,
            name: e.NAME,
            masosp: e.MASP,
            masochitiet: e.MACHITIET,
            masocumchitiet: e.MACUMCHITIET,
            dai: e.DAI,
            rong: e.RONG,
            day: e.DAY,
            heso: e.HESO,
            soluong: e.SOLUONG,
            dongsanpham: e.DONGSANPHAM,
            chungloai: e.CHUNGLOAI,
            donvi: e.DONVI,
            color:e.COLOR,
            delete: 'delete'
          })
        });
   }
  }
  else {
        let mauspload = []
        
         this.mauthitruong.forEach(e => {
            mauspload.push({
              color: e,
              masp: this.masp
            })
          });
           const insertmau = await this.insertspmau(mauspload)
           if (insertmau.meta.success){
             this.$q.notify({
                color: 'positive',
                message: 'Thêm màu thành công cho sản phẩm ' + this.tensp + ' !'
              })
           }
  }
 },
    async themcumchitiet() {
      if (
        this.cdonvi != null && this.cdonvi != '' && this.cchungloai != null && this.cchungloai != ''
        && this.cmasanpham != null && this.cmasanpham != '' && this.cmacumchitiet != null && this.cmacumchitiet != ''
        && this.cmacumchitiet != '' && this.cmacumchitiet != null
      ) {
        let payload = []

        payload.push({
          name: this.ctencumchitiet,
          masosp: this.cmasanpham,
          masocumchitiet: this.cmacumchitiet,
          dai: this.cdai,
          rong: this.crong,
          day: this.cday,
          dongsanphamham: this.cdongsanpham,
          chungloai: this.cchungloai.value,
          donvi: this.cdonvi.value,
          heso: this.cheso,
          create_by: this.userInfo.id,
          trangthai: 'chuaduyet',
          type: 'cumChiTiet',
          type_edit: ''
        })
        if (this.isChinhSua) {
          payload[0].type_edit = 'edit-insert'
        }
        if (this.cbChiTiet.length != 0) {
          let payloadupdate = []
          this.cbChiTiet.forEach(e => {
            payloadupdate.push({
              macumchitiet: this.cmacumchitiet,
              id: e.id
            })
          });
          //insert cum
          let checkTrungMaCum = null
          checkTrungMaCum = this.allSanPham.find(f => f.MACUMCHITIET == this.cmacumchitiet)
          if (checkTrungMaCum == null) {
            const data = await this.insertCum(payload)
            if (data.meta.success) {
              this.cbChiTiet = []
              this.$q.notify({
                color: 'positive',
                message: 'Thêm cụm chi tiết thành công cho sản phẩm ' + this.tensp + ' !'
              })
            }
            //update mã cụm chi tiết cho chi tiết được chọn
            const update = await this.updateChiTiet(payloadupdate)
            this.allSanPham = []
            let allsp = await this.getAllSanPham()
            allsp = allsp.data
            let allChitietTrongCum = allsp.filter(f => f.MACUMCHITIET == this.cmacumchitiet && f.TYPE == "chiTiet")
            let SOLUONG = 0
            allChitietTrongCum.forEach(e => {
              SOLUONG = SOLUONG + e.SOLUONG
            });
            let payloadUpdateSoLuongCum = []
            payloadUpdateSoLuongCum.push({
              macum: this.cmacumchitiet,
              soluong: SOLUONG
            })
            const updatesoluongcum = await this.updateSoLuongCum(payloadUpdateSoLuongCum)
            if (this.isChinhSua) {
              this.loadEditSP();
            } else {
              this.loadSanPham();
            }
            //xét giá trị các input = ''
            this.ctencumchitiet = null;
            this.cmacumchitiet = "";
            this.cdai = 0;
            this.crong = 0;
            this.cday = 0;
            this.csoluong = "";
            // this.cdongsanpham = null;
            this.cchungloai = {
              label: "Cụm chi tiết",
              value: 100002
            };
            this.cdonvi = "";
            this.cheso = "";
          } else {
            this.$q.notify({
              color: 'negative',
              message: 'Mã cụm đã tồn tại !!!'
            })
          }
        } else {
          this.$q.notify({
            color: 'negative',
            message: 'Thêm chi tiết cho cụm ' + this.ctencumchitiet + ' !'
          })
        }
      } else {
        this.$q.notify({
          color: 'negative',
          message: 'Điền đầy đủ thông tin cần thiết'
        })
      }
    },
    async xacnhan() {
      // let arrChiTietKhongCum = []
      // this.chitiet.forEach(e => {
      //   if (e.masocumchitiet == null || e.masocumchitiet == '') {
      //     arrChiTietKhongCum.push({
      //       name: e.name
      //     })
      //   }
      // });
      // if (arrChiTietKhongCum.length != 0) {
      //   this.$q.notify({
      //     message: 'Thêm cụm cho chi tiết ' + arrChiTietKhongCum[0].name + '!!!',
      //     color: 'negative',
      //   })
      // } else {
      let payload = [];
      const allrouting = await this.getAllRoutingTemp();
      let checkSPKhongRouting = []
      this.sanpham.forEach(e => {
        payload.push({
          idsp: e.id,
          type_edit: '',
          name: e.name
        })
      });
      this.chitiet.forEach(e => {
        payload.push({
          idsp: e.id,
          type_edit: '',
          name: e.name
        })
      });
      this.cumchitiet.forEach(e => {
        payload.push({
          idsp: e.id,
          type_edit: '',
          name: e.name
        })
      });
      payload.forEach(e => {
        let checkRouting = []
        checkRouting = allrouting.data.filter(f => f.ITEM_ID == e.idsp)
        if (checkRouting.length == 0) {
          checkSPKhongRouting.push(e)
          return checkSPKhongRouting
        }
      });
      if (checkSPKhongRouting.length != 0) {
        this.$q.notify({
          message: 'Chọn định tuyến cho ' + checkSPKhongRouting[0].name + '!!!',
          color: 'negative',
        })
      } else {
        //update trạng thái
        if (this.masp != null) {
          let data = {}
          if (this.isChinhSua) {
            let playloadX = []
            payload.forEach(e => {
              this.allSanPham.forEach(el => {
                if (e.idsp == el.ID && el.TYPE_EDIT == '') {
                  playloadX.push({
                    idsp: e.idsp,
                    type_edit: 'edit'
                  })
                }
              });
            });
            payload = playloadX;

            data = await this.updateTrangThaiEDIT(payload);
          } else {
            data = await this.updateTrangThaiSanPham(payload);
          }
          if (data.meta.success) {
            console.log("SEND")
            this.sendMailPheDuyet('nhanadam95@gmail.com', 100400)
            this.isShowDialog = false;
            this.masp = null;
            this.tensp = null;
            this.soluong = null;
            this.tengoi = null;
            this.anhsanpham = null;
            this.khachhang = null;
            this.dongsanpham = null;

            this.cttenchitiet = null;
            this.ctmasanpham = null;
            this.ctmachitiet = null;
            this.ctmacumchitiet = null;
            this.cttenoibo = null;
            this.ctdai = null;
            this.ctrong = null;
            this.ctday = null;
            this.ctsoluong = null;
            this.ctdongsanpham = null;
            this.ctchungloai = null;
            this.ctdonvi = null;
            this.ctheso = null;
            this.ctencumchitiet = null;
            this.cmasanpham = null;
            this.cmacumchitiet = null;
            this.ctenoibo = null;
            this.cdai = 0;
            this.crong = 0;
            this.cday = 0;
            this.csoluong = null;
            this.cdongsanpham = null;
            this.cchungloai = {
              label: "Cụm chi tiết",
              value: 100002
            };
            this.cdonvi = null;

            this.sanpham = []
            this.chitiet = []
            this.cumchitiet = []

            this.sua = false
            this.spIsDone = true
            this.$q.notify({
              color: 'positive',
              message: 'Gửi phê duyệt thành công !!!'
            })
          }
          window.location.reload()
        }
        else {
          this.$q.notify({
            color: 'negative',
            message: 'Điền đẩy đủ thông tin gửi phê duyệt !!!'
          })
        }
      }
    },
    async sendMailPheDuyet(mail, accountId) {
      let baseUrl = null;
      if (process.env.PROD) {
        baseUrl = `https://app.woodsland.com.vn:2002/#/phe-duyet-sp`;
      } else {
        baseUrl = `http://localhost:5000/#/phe-duyet-sp`;
      }
      let payloadMail = {
        baseUrl: baseUrl,
        email: mail,
        accountId: this.userInfo.id,
        toAccountId: accountId,
        subject: `Có sản phẩm mới được tạo`,
        title: "Nhấp vào đây để đi tới phê duyệt",
        dataBody: `Sản phẩm được tạo bởi ${this.userInfo.lastName}. Mời bạn vào phê duyệt`,
      };
      await this.sendNotificationMail(payloadMail);
    },
    async themsanpham() {
      let checkTrungMaSP = []
      checkTrungMaSP = this.allSanPham.filter(f => f.MASP == this.masp)
      if (checkTrungMaSP.length == 0) {

        this.spIsDone = false
        this.sua = true
        this.ctmasanpham = this.masp
        this.cmasanpham = this.masp
        let payload = []
        if (this.masp != null) {
          payload.push({
            masanpham: this.masp,
            tensp: this.tensp,
            anhsanpham: this.anhsanpham,
            khachhang: this.khachhang,
            dongsanpham: this.spdongsanpham,
            tennoibo: this.tengoi,
            create_by: this.userInfo.id,
            trangthai: 'chuaduyet',
            type: 'sanPham',
            type_edit: ''
          })
          const data = await this.insertSanPham(payload)
          if (data.meta.success) {
            this.$q.notify({
              message: 'Thêm sản phẩm thành công',
              color: 'positive',
            })
          } else {
            this.$q.notify({
              message: 'Thêm sản không thành công !!!',
              color: 'negative',
            })
          }
        } else {
          this.$q.notify({
            message: 'Mã sản phẩm không được bỏ trống !!!',
            color: 'negative',
          })
        }
        if (this.isChinhSua) {
          this.loadEditSP();
        } else {
          this.loadSanPham();
        }
      } else {
        this.$q.notify({
          message: 'Mã sản phẩm đã tồn tại !!!',
          color: 'negative',
        })
      }
    },
    async onShowSelectedSanPham(e) {
      this.allRoutingTemp = await this.getAllRoutingTemp()
      this.idSanPham = e.id

      this.selectedMASP = e.masosp
      this.selectedTenSP = e.name
      this.selectedTenNoiBoSP = e.tennoibo
      this.selectedDongSanPhamSP = e.dongsanpham
      this.selectedKhachHangSP = e.khachhang
      this.isDialogSelectedSanPham = true

      //get data to table Định tuyến nhà máy CBG Thuận Hưng :
      let arrTempCTTH = []
      if (this.allRoutingTemp != null) {
        arrTempCTTH = this.allRoutingTemp.data.filter(f => f.factoryId == 100000 && f.ITEM_ID == this.idSanPham)
      }

      this.dinhTuyenThuanHung = []
      if (arrTempCTTH.length != 0) {
        arrTempCTTH.forEach(e => {
          this.dinhTuyenThuanHung.push({
            code: e.STEP_CODE,
            name: e.STEP_NAME,
            thutu: e.ORDER,
            id: e.STEP_ID,
            soluongm: e.SoLuongM,
            soluongm3: e.SoLuongM3,
            mongam: e.MongAm,
            mongduong: e.MongDuong,
            khoan: e.Khoan,
          })
        });
      }
      //get data to table Chọn định tuyến nhà máy Yên Sơn :
      let arrTempCTYS = []
      if (this.allRoutingTemp != null) {
        arrTempCTYS = this.allRoutingTemp.data.filter(f => f.factoryId == 102340 && f.ITEM_ID == this.idSanPham)
      }
      this.dinhTuyenYenSon = []
      if (arrTempCTYS.length != 0) {
        arrTempCTYS.forEach(e => {
          this.dinhTuyenYenSon.push({
            code: e.STEP_CODE,
            name: e.STEP_NAME,
            thutu: e.ORDER,
            id: e.STEP_ID,
            soluongm: e.SoLuongM,
            soluongm3: e.SoLuongM3,
            mongam: e.MongAm,
            mongduong: e.MongDuong,
            khoan: e.Khoan,
          })
        });
      }

      //get data to table Chọn định tuyến nhà máy Thái Bình :
      let arrTempCTTB = []
      if (this.allRoutingTemp != null) {
        arrTempCTTB = this.allRoutingTemp.data.filter(f => f.factoryId == 102366 && f.ITEM_ID == this.idSanPham)
      }

      this.dinhTuyenThaiBinh = []
      if (arrTempCTYS.length != 0) {
        arrTempCTTB.forEach(e => {
          this.dinhTuyenThaiBinh.push({
            code: e.STEP_CODE,
            name: e.STEP_NAME,
            thutu: e.ORDER,
            id: e.STEP_ID,
            soluongm: e.SoLuongM,
            soluongm3: e.SoLuongM3,
            mongam: e.MongAm,
            mongduong: e.MongDuong,
            khoan: e.Khoan,
          })
        });
      }

      //push cb TH
      this.cbdinhtuyenTH = []
      this.dinhTuyenThuanHung.forEach(e => {
        this.departmemntLuaPhoiThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntSoCheThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntKhoSoCheThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntTinhCheThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntKhoTinhCheThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntToSonThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntDongGoiThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntKhoThanhPhamThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
      });

      //push cb yên sơn
      this.cbdinhtuyenYS = []
      this.dinhTuyenYenSon.forEach(e => {
        this.departmemntLuaPhoiYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntSoCheYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntKhoSoCheYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntTinhCheYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntKhoTinhCheYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntToSonYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntDongGoiYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntKhoThanhPhamYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
      });
      //push cb thái bình
      this.cbdinhtuyenTB = []
      this.dinhTuyenThaiBinh.forEach(e => {
        this.departmemntLuaPhoiThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntSoCheThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntKhoSoCheThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntTinhCheThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntKhoTinhCheThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntToSonThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntDongGoiThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntKhoThanhPhamThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
      });
    },
    async onShowSelectedCumChiTiet(e) {
      this.allRoutingTemp = await this.getAllRoutingTemp()
      this.idSanPham = e.id
      this.isDialogSelectedCumChiTiet = true
      this.selectedCumMasanpham = e.masosp;
      this.selectedCumMaCumChiTiet = e.masocumchitiet;
      this.selectedTenCumChiTiet = e.name;
      this.selectedDaiCumChiTiet = e.dai;
      this.selectedRongCumChiTiet = e.rong;
      this.selectedDayCumChiTiet = e.day;
      this.selectedHeSoCumChiTiet = e.heso;
      this.selectedDongSanPhamCumChiTiet = e.dongsanpham;
      this.selectedChungLoaiCumChiTiet = this.chungloais.filter(f => f.value == e.chungloai);
      this.selectedDonViCumChiTiet = this.donvis.filter(f => f.value == e.donvi);
      this.selectedSoLuongCumChiTiet = e.soluong;

      //get data to table Định tuyến nhà máy CBG Thuận Hưng :
      let arrTempCTTH = []
      if (this.allRoutingTemp != null) {
        arrTempCTTH = this.allRoutingTemp.data.filter(f => f.factoryId == 100000 && f.ITEM_ID == this.idSanPham)
      }

      this.dinhTuyenThuanHung = []
      if (arrTempCTTH.length != 0) {
        arrTempCTTH.forEach(e => {
          this.dinhTuyenThuanHung.push({
            namecumchitiet: this.selectedTenCumChiTiet,
            code: e.STEP_CODE,
            name: e.STEP_NAME,
            thutu: e.ORDER,
            id: e.STEP_ID,
            soluongm: e.SoLuongM,
            soluongm3: e.SoLuongM3,
            mongam: e.MongAm,
            mongduong: e.MongDuong,
            khoan: e.Khoan,
          })
        });
      }

      //get data to table Chọn định tuyến nhà máy Yên Sơn :
      let arrTempCTYS = []
      if (this.allRoutingTemp != null) {
        arrTempCTYS = this.allRoutingTemp.data.filter(f => f.factoryId == 102340 && f.ITEM_ID == this.idSanPham)
      }
      this.dinhTuyenYenSon = []
      if (arrTempCTYS.length != 0) {
        arrTempCTYS.forEach(e => {
          this.dinhTuyenYenSon.push({
            namecumchitiet: this.selectedTenCumChiTiet,
            code: e.STEP_CODE,
            name: e.STEP_NAME,
            thutu: e.ORDER,
            id: e.STEP_ID,
            soluongm: e.SoLuongM,
            soluongm3: e.SoLuongM3,
            mongam: e.MongAm,
            mongduong: e.MongDuong,
            khoan: e.Khoan,
          })
        });
      }

      //get data to table Chọn định tuyến nhà máy Thái Bình :
      let arrTempCTTB = []
      if (this.allRoutingTemp != null) {
        arrTempCTTB = this.allRoutingTemp.data.filter(f => f.factoryId == 102366 && f.ITEM_ID == this.idSanPham)
      }

      this.dinhTuyenThaiBinh = []
      if (arrTempCTYS.length != 0) {
        arrTempCTTB.forEach(e => {
          this.dinhTuyenThaiBinh.push({
            namecumchitiet: this.selectedTenCumChiTiet,
            code: e.STEP_CODE,
            name: e.STEP_NAME,
            thutu: e.ORDER,
            id: e.STEP_ID,
            soluongm: e.SoLuongM,
            soluongm3: e.SoLuongM3,
            mongam: e.MongAm,
            mongduong: e.MongDuong,
            khoan: e.Khoan,
          })
        });
      }

      //push cb TH
      this.cbdinhtuyenTH = []
      this.dinhTuyenThuanHung.forEach(e => {
        this.departmemntLuaPhoiThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntSoCheThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntKhoSoCheThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntTinhCheThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntKhoTinhCheThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntToSonThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntDongGoiThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntKhoThanhPhamThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
      });

      //push cb yên sơn
      this.cbdinhtuyenYS = []
      this.dinhTuyenYenSon.forEach(e => {
        this.departmemntLuaPhoiYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntSoCheYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntKhoSoCheYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntTinhCheYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntKhoTinhCheYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntToSonYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntDongGoiYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntKhoThanhPhamYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
      });
      //push cb thái bình
      this.cbdinhtuyenTB = []
      this.dinhTuyenThaiBinh.forEach(e => {
        this.departmemntLuaPhoiThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntSoCheThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntKhoSoCheThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntTinhCheThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntKhoTinhCheThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntToSonThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntDongGoiThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntKhoThanhPhamThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
      });
    },
    filterDepartmet(e) {
      this.factory = e.id
    },
    async loadDataDepartment() {
      let data = await this.getAllDepartmetHaveCode()
      this.departmemnt = data.data
      this.departmentThuanHung = this.departmemnt.filter(f => f.factoryId == 100000)
      this.departmentYenSon = this.departmemnt.filter(f => f.factoryId == 102340)
      this.departmentThaiBinh = this.departmemnt.filter(f => f.factoryId == 102366)

      this.departmemntLuaPhoiThuanHung = this.departmentThuanHung.filter(f => f.code == 'luaPhoi')
      this.departmemntSoCheThuanHung = this.departmentThuanHung.filter(f => f.code == 'soChe')
      this.departmemntKhoSoCheThuanHung = this.departmentThuanHung.filter(f => f.code == 'khoSoChe')
      this.departmemntTinhCheThuanHung = this.departmentThuanHung.filter(f => f.code == 'tinhChe')
      this.departmemntKhoTinhCheThuanHung = this.departmentThuanHung.filter(f => f.code == 'khoTinhChe')
      this.departmemntToSonThuanHung = this.departmentThuanHung.filter(f => f.code == 'hoanThien')
      this.departmemntDongGoiThuanHung = this.departmentThuanHung.filter(f => f.code == 'dongGoi')
      this.departmemntKhoThanhPhamThuanHung = this.departmentThuanHung.filter(f => f.code == 'khoThanhPham')

      this.departmemntLuaPhoiYenSon = this.departmentYenSon.filter(f => f.code == 'luaPhoi')
      this.departmemntSoCheYenSon = this.departmentYenSon.filter(f => f.code == 'soChe')
      this.departmemntKhoSoCheYenSon = this.departmentYenSon.filter(f => f.code == 'khoSoChe')
      this.departmemntTinhCheYenSon = this.departmentYenSon.filter(f => f.code == 'tinhChe')
      this.departmemntKhoTinhCheYenSon = this.departmentYenSon.filter(f => f.code == 'khoTinhChe')
      this.departmemntToSonYenSon = this.departmentYenSon.filter(f => f.code == 'hoanThien')
      this.departmemntDongGoiYenSon = this.departmentYenSon.filter(f => f.code == 'dongGoi')
      this.departmemntKhoThanhPhamYenSon = this.departmentYenSon.filter(f => f.code == 'khoThanhPham')

      this.departmemntLuaPhoiThaiBinh = this.departmentThaiBinh.filter(f => f.code == 'luaPhoi')
      this.departmemntSoCheThaiBinh = this.departmentThaiBinh.filter(f => f.code == 'soChe')
      this.departmemntKhoSoCheThaiBinh = this.departmentThaiBinh.filter(f => f.code == 'khoSoChe')
      this.departmemntTinhCheThaiBinh = this.departmentThaiBinh.filter(f => f.code == 'tinhChe')
      this.departmemntKhoTinhCheThaiBinh = this.departmentThaiBinh.filter(f => f.code == 'khoTinhChe')
      this.departmemntToSonThaiBinh = this.departmentThaiBinh.filter(f => f.code == 'hoanThien')
      this.departmemntDongGoiThaiBinh = this.departmentThaiBinh.filter(f => f.code == 'dongGoi')
      this.departmemntKhoThanhPhamThaiBinh = this.departmentThaiBinh.filter(f => f.code == 'khoThanhPham')

      this.congsuatmayTH = []
      this.departmentThuanHung.sort((a, b) => a.GORDER - b.GORDER);
      this.departmentThuanHung.forEach(e => {
        if (e.code == "sayPhoi") {
          this.congsuatmayTH.push({
            NAME: e.NAME,
            Nhóm: '1. Sấy phôi',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "khoThanhPham") {
          this.congsuatmayTH.push({
            NAME: e.NAME,
            Nhóm: '7.Kho Thành Phẩm',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "luaPhoi") {
          this.congsuatmayTH.push({
            NAME: e.NAME,
            Nhóm: '2.Lựa phôi',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "soChe") {
          this.congsuatmayTH.push({
            NAME: e.NAME,
            Nhóm: '3.Sơ chế',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "tinhChe") {
          this.congsuatmayTH.push({
            NAME: e.NAME,
            Nhóm: '4.Tinh chế',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "hoanThien") {
          this.congsuatmayTH.push({
            NAME: e.NAME,
            Nhóm: '5.Hoàn thiện',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "dongGoi") {
          this.congsuatmayTH.push({
            NAME: e.NAME,
            Nhóm: '6.Đóng gói',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        }
      });
      //công suất YS
      this.congsuatmayYS = []
      this.departmentYenSon.sort((a, b) => a.GORDER - b.GORDER);
      this.departmentYenSon.forEach(e => {
        if (e.code == "sayPhoi") {
          this.congsuatmayYS.push({
            NAME: e.NAME,
            Nhóm: '1. Sấy phôi',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "khoThanhPham") {
          this.congsuatmayYS.push({
            NAME: e.NAME,
            Nhóm: '7.Kho Thành Phẩm',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "luaPhoi") {
          this.congsuatmayYS.push({
            NAME: e.NAME,
            Nhóm: '2.Lựa phôi',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "soChe") {
          this.congsuatmayYS.push({
            NAME: e.NAME,
            Nhóm: '3.Sơ chế',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "tinhChe") {
          this.congsuatmayYS.push({
            NAME: e.NAME,
            Nhóm: '4.Tinh chế',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "hoanThien") {
          this.congsuatmayYS.push({
            NAME: e.NAME,
            Nhóm: '5.Hoàn thiện',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "dongGoi") {
          this.congsuatmayYS.push({
            NAME: e.NAME,
            Nhóm: '6.Đóng gói',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        }
      });
      //công suất TB
      this.congsuatmayTB = []
      this.departmentThaiBinh.sort((a, b) => a.GORDER - b.GORDER);
      this.departmentThaiBinh.forEach(e => {
        if (e.code == "sayPhoi") {
          this.congsuatmayTB.push({
            NAME: e.NAME,
            Nhóm: '1. Sấy phôi',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "khoThanhPham") {
          this.congsuatmayTB.push({
            NAME: e.NAME,
            Nhóm: '7.Kho Thành Phẩm',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "luaPhoi") {
          this.congsuatmayTB.push({
            NAME: e.NAME,
            Nhóm: '2.Lựa phôi',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "soChe") {
          this.congsuatmayTB.push({
            NAME: e.NAME,
            Nhóm: '3.Sơ chế',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "tinhChe") {
          this.congsuatmayTB.push({
            NAME: e.NAME,
            Nhóm: '4.Tinh chế',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "hoanThien") {
          this.congsuatmayTB.push({
            NAME: e.NAME,
            Nhóm: '5.Hoàn thiện',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        } else if (e.code == "dongGoi") {
          this.congsuatmayTB.push({
            NAME: e.NAME,
            Nhóm: '6.Đóng gói',
            code: e.code,
            ID: e.ID,
            CONGSUAT: e.CONGSUAT,
            CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
            ORDER: e.ORDER
          })
        }
      });
    },
    loadMau(){
    if( this.typeBC =='nhieumau') {
      this.chonmau = true;
      this.chonnhieumau = false
    } else { 
      
      this.chonmau = false;
     this.chonnhieumau = true}
    },
    inputTableDinhTuyenTH(e) {
      console.log("find tinh chế:", e)
      e.sort((a, b) => a.GORDER - b.GORDER);
      let DinhTuyenTamTH = this.dinhTuyenThuanHung
      this.dinhTuyenThuanHung = []
      for (let i = 0; i < e.length; i++) {
        this.dinhTuyenThuanHung.push({
          idsp: this.selectedCumMasanpham,
          idcumchitiet: this.selectedCumMaCumChiTiet,
          namecumchitiet: this.selectedTenCumChiTiet,
          id: e[i].ID,
          name: e[i].NAME,
          code: e[i].CODE,
          thutu: i + 1,
          soluongm: null,
          soluongm3: null,
          mongam: null,
          mongduong: null,
          khoan: null
        })
      }
    },
    inputTableDinhTuyenTHTC(e) {
      e.sort((a, b) => a.GORDER - b.GORDER);
      let DinhTuyenTamTH = this.dinhTuyenThuanHung
      this.dinhTuyenThuanHung = []
      for (let i = 0; i < e.length; i++) {
        this.dinhTuyenThuanHung.push({
          idsp: this.selectedCumMasanpham,
          idcumchitiet: this.selectedCumMaCumChiTiet,
          namecumchitiet: this.selectedTenCumChiTiet,
          id: e[i].ID,
          name: e[i].NAME,
          code: e[i].CODE,
          thutu: i + 1,
          soluongm: null,
          soluongm3: null,
          mongam: 0,
          mongduong: 0,
          khoan: 0,
          checktinhche: e[i].code
        })
      }
      this.isShowMongAmDuongTH = false;
    },
    xacnhanAmDuongTH() {
      this.dinhTuyenThuanHung.sort((a, b) => a.GORDER - b.GORDER);
      this.dinhTuyenThuanHung.forEach(e => {
        this.cbMongAmDuong.forEach(element => {
          if (e.checktinhche == "tinhChe") {
            if (element == "mongam") {
              e.mongam = 1
            } else if (element == "mongduong") {
              e.mongduong = 1
            } else if (element == "khoan") {
              e.khoan = 1
            } else { }
          }
        });
      });
      if (this.isDialogSelectedChiTiet == true) {
        this.ctdinhTuyenThuanHung.sort((a, b) => a.GORDER - b.GORDER);
        this.ctdinhTuyenThuanHung.forEach(e => {
          this.cbMongAmDuong.forEach(element => {
            if (e.checktinhche == "tinhChe") {
              if (element == "mongam") {
                e.mongam = 1
              } else if (element == "mongduong") {
                e.mongduong = 1
              } else if (element == "khoan") {
                e.khoan = 1
              } else { }
            }
          });
        });
      }
      this.$q.notify({
        message: 'Thành công',
        color: 'positive'
      })
      this.cbMongAmDuong = [];
      this.isShowMongAmDuongTH = false

    },
    inputTableDinhTuyenYS(e) {
      e.sort((a, b) => a.GORDER - b.GORDER);
      this.dinhTuyenYenSon = []
      for (let i = 0; i < e.length; i++) {
        this.dinhTuyenYenSon.push({
          idsp: this.selectedCumMasanpham,
          idcumchitiet: this.selectedCumMaCumChiTiet,
          namecumchitiet: this.selectedTenCumChiTiet,
          id: e[i].ID,
          name: e[i].NAME,
          code: e[i].CODE,
          thutu: i + 1,
          soluongm: null,
          soluongm3: null,
          mongam: null,
          mongduong: null,
          khoan: null
        })
      }
    },
    inputTableDinhTuyenYSTC(e) {
      e.sort((a, b) => a.GORDER - b.GORDER);
      this.dinhTuyenYenSon = []
      for (let i = 0; i < e.length; i++) {
        this.dinhTuyenYenSon.push({
          idsp: this.selectedCumMasanpham,
          idcumchitiet: this.selectedCumMaCumChiTiet,
          namecumchitiet: this.selectedTenCumChiTiet,
          id: e[i].ID,
          name: e[i].NAME,
          code: e[i].CODE,
          thutu: i + 1,
          soluongm: null,
          soluongm3: null,
          mongam: 0,
          mongduong: 0,
          khoan: 0,
          checktinhche: e[i].code,
        })
      }
      console.log('this.dinhTuyenYenSon', this.dinhTuyenYenSon)
      this.isShowMongAmDuongYS = false;
    },
    xacnhanAmDuongYS() {
      this.dinhTuyenYenSon.sort((a, b) => a.GORDER - b.GORDER);
      this.dinhTuyenYenSon.forEach(e => {
        this.cbMongAmDuong.forEach(element => {
          if (e.checktinhche == "tinhChe") {
            if (element == "mongam") {
              e.mongam = 1
            } else if (element == "mongduong") {
              e.mongduong = 1
            } else if (element == "khoan") {
              e.khoan = 1
            } else { }
          }
        });
      });
      if (this.isDialogSelectedChiTiet == true) {
        this.ctdinhTuyenYenSon.sort((a, b) => a.GORDER - b.GORDER);
        this.ctdinhTuyenYenSon.forEach(e => {
          this.cbMongAmDuong.forEach(element => {
            if (e.checktinhche == "tinhChe") {
              if (element == "mongam") {
                e.mongam = 1
              } else if (element == "mongduong") {
                e.mongduong = 1
              } else if (element == "khoan") {
                e.khoan = 1
              } else { }
            }
          });
        });
      }
      this.$q.notify({
        message: 'Thành công',
        color: 'positive'
      })
      this.cbMongAmDuong = [];
      this.isShowMongAmDuongYS = false;
    },
    xacnhanAmDuongTB() {
      this.dinhTuyenThaiBinh.sort((a, b) => a.GORDER - b.GORDER);
      this.dinhTuyenThaiBinh.forEach(e => {
        this.cbMongAmDuong.forEach(element => {
          if (e.checktinhche == "tinhChe") {
            if (element == "mongam") {
              e.mongam = 1
            } else if (element == "mongduong") {
              e.mongduong = 1
            } else if (element == "khoan") {
              e.khoan = 1
            } else { }
          }
        });
      });
      if (this.isDialogSelectedChiTiet == true) {
        this.ctdinhTuyenThaiBinh.sort((a, b) => a.GORDER - b.GORDER);
        this.ctdinhTuyenThaiBinh.forEach(e => {
          this.cbMongAmDuong.forEach(element => {
            if (e.checktinhche == "tinhChe") {
              if (element == "mongam") {
                e.mongam = 1
              } else if (element == "mongduong") {
                e.mongduong = 1
              } else if (element == "khoan") {
                e.khoan = 1
              } else { }
            }
          });
        });
      }
      this.$q.notify({
        message: 'Thành công',
        color: 'positive'
      })
      this.cbMongAmDuong = [];
      this.isShowMongAmDuongTB = false;
    },
    inputTableDinhTuyenTB(e) {
      console.log(e)
      e.sort((a, b) => a.GORDER - b.GORDER);
      this.dinhTuyenThaiBinh = []
      for (let i = 0; i < e.length; i++) {
        this.dinhTuyenThaiBinh.push({
          idsp: this.selectedCumMasanpham,
          idcumchitiet: this.selectedCumMaCumChiTiet,
          namecumchitiet: this.selectedTenCumChiTiet,
          id: e[i].ID,
          name: e[i].NAME,
          code: e[i].CODE,
          thutu: i + 1,
          soluongm: null,
          soluongm3: null,
          mongam: 0,
          mongduong: 0,
          khoan: 0,
          checktinhche: e[i].code,
        })
      }
    },
    inputTableDinhTuyenTBTC(e) {
      e.sort((a, b) => a.GORDER - b.GORDER);
      this.dinhTuyenThaiBinh = []
      for (let i = 0; i < e.length; i++) {
        this.dinhTuyenThaiBinh.push({
          idsp: this.selectedCumMasanpham,
          idcumchitiet: this.selectedCumMaCumChiTiet,
          namecumchitiet: this.selectedTenCumChiTiet,
          id: e[i].ID,
          name: e[i].NAME,
          code: e[i].CODE,
          thutu: i + 1,
          soluongm: null,
          soluongm3: null,
          mongam: 0,
          mongduong: 0,
          khoan: 0,
          checktinhche: e[i].code,
        })
      }
      this.isShowMongAmDuongTB = false;
    },
    inputTableDinhTuyenCTTH(e) {
      e.sort((a, b) => a.GORDER - b.GORDER);

      this.ctdinhTuyenThuanHung = []
      for (let i = 0; i < e.length; i++) {
        this.ctdinhTuyenThuanHung.push({
          idsp: this.selectedChiTietMasanpham,
          cumchitiet: this.selectedMaCumChiTiet,
          namechitiet: this.selectedTenChiTiet,
          machitiet: this.selectedMaChiTiet,
          id: e[i].ID,
          name: e[i].NAME,
          code: e[i].CODE,
          thutu: i + 1,
          soluongm: null,
          soluongm3: null,
          mongam: 0,
          mongduong: 0,
          khoan: 0,
          checktinhche: e[i].code,
        })
      }
    },
    inputTableDinhTuyenCTTHTC(e) {
      e.sort((a, b) => a.GORDER - b.GORDER);
      this.ctdinhTuyenThuanHung = []
      for (let i = 0; i < e.length; i++) {
        this.ctdinhTuyenThuanHung.push({
          idsp: this.selectedChiTietMasanpham,
          cumchitiet: this.selectedMaCumChiTiet,
          namechitiet: this.selectedTenChiTiet,
          machitiet: this.selectedMaChiTiet,
          id: e[i].ID,
          name: e[i].NAME,
          code: e[i].CODE,
          thutu: i + 1,
          soluongm: null,
          soluongm3: null,
          mongam: 0,
          mongduong: 0,
          khoan: 0,
          checktinhche: e[i].code,
        })
      }
      this.isShowMongAmDuongTH = false;
    },
    inputTableDinhTuyenCTYS(e) {
      e.sort((a, b) => a.GORDER - b.GORDER);
      this.ctdinhTuyenYenSon = []
      for (let i = 0; i < e.length; i++) {
        this.ctdinhTuyenYenSon.push({
          idsp: this.selectedCumMasanpham,
          cumchitiet: this.selectedMaCumChiTiet,
          namechitiet: this.selectedTenChiTiet,
          machitiet: this.selectedMaChiTiet,
          id: e[i].ID,
          name: e[i].NAME,
          code: e[i].CODE,
          thutu: i + 1,
          soluongm: null,
          soluongm3: null,
          mongam: 0,
          mongduong: 0,
          khoan: 0
        })
      }
    },
    inputTableDinhTuyenCTYSTC(e) {
      e.sort((a, b) => a.GORDER - b.GORDER);
      this.ctdinhTuyenYenSon = []
      for (let i = 0; i < e.length; i++) {
        this.ctdinhTuyenYenSon.push({
          idsp: this.selectedCumMasanpham,
          cumchitiet: this.selectedMaCumChiTiet,
          namechitiet: this.selectedTenChiTiet,
          machitiet: this.selectedMaChiTiet,
          id: e[i].ID,
          name: e[i].NAME,
          code: e[i].CODE,
          thutu: i + 1,
          soluongm: null,
          soluongm3: null,
          mongam: 0,
          mongduong: 0,
          khoan: 0,
          checktinhche: e[i].code,
        })
      }
      this.isShowMongAmDuongYS = false;
    },
    inputTableDinhTuyenCTTB(e) {
      this.ctdinhTuyenThaiBinh = []
      for (let i = 0; i < e.length; i++) {
        this.ctdinhTuyenThaiBinh.push({
          idsp: this.selectedCumMasanpham,
          cumchitiet: this.selectedMaCumChiTiet,
          namechitiet: this.selectedTenChiTiet,
          machitiet: this.selectedMaChiTiet,
          id: e[i].ID,
          name: e[i].NAME,
          code: e[i].CODE,
          thutu: i + 1,
          soluongm: null,
          soluongm3: null,
          mongam: 0,
          mongduong: 0,
          khoan: 0,
          checktinhche: e[i].code,
        })
      }
    },
    inputTableDinhTuyenCTTBTC(e) {
      this.ctdinhTuyenThaiBinh = []
      for (let i = 0; i < e.length; i++) {
        this.ctdinhTuyenThaiBinh.push({
          idsp: this.selectedCumMasanpham,
          cumchitiet: this.selectedMaCumChiTiet,
          namechitiet: this.selectedTenChiTiet,
          machitiet: this.selectedMaChiTiet,
          id: e[i].ID,
          name: e[i].NAME,
          code: e[i].CODE,
          thutu: i + 1,
          soluongm: null,
          soluongm3: null,
          mongam: 0,
          mongduong: 0,
          khoan: 0,
          checktinhche: e[i].code,
        })
      }
      this.isShowMongAmDuongTB = false;
    },
    async addDinhTuyenTam() {
      //update chỉnh sửa thông tin sản phẩm
      let payloadEdit = []
      payloadEdit.push({
        name: this.selectedTenSP,
        dai: 0,
        rong: 0,
        day: 0,
        soluong: 0,
        dongsanpham: this.selectedDongSanPhamSP,
        chungloai: 0,
        donvi: 0,
        khachhang: this.selectedKhachHangSP,
        tennoibo: this.selectedTenNoiBoSP,
        heso: 0,
        masp: this.selectedMASP,
        macumchitiet: '',
        machitiet: '',
      })
      const updateEditSP = await this.updateEditSanPham(payloadEdit)

      //insert định tuyến tạm Thuận Hưng cho cụm chi tiết
      let payloadTH = []
      let dataTH = []
      let dataYS = []
      let dataTB = []

      this.dinhTuyenThuanHung.forEach(e => {
        payloadTH.push({
          idsp: this.idSanPham,
          iddepartment: e.id,
          thutu: e.thutu,
          created_by: this.userInfo.id,
          factoryId: 100000,
          checknull: false,
          soluongm: e.soluongm,
          soluongm3: e.soluongm3,
          mongam: e.mongam,
          mongduong: e.mongduong,
          khoan: e.khoan
        })
      });

      if (payloadTH.length != 0) {
        dataTH = await this.insertDinhTuyenTemplate(payloadTH)
      } else {
        payloadTH.push({
          idsp: this.idSanPham,
          factoryId: 100000,
          checknull: true
        })
        dataTH = await this.insertDinhTuyenTemplate(payloadTH)
      }
      //insert định tuyến tạm Yên Sơn cho chi tiết
      let payloadYS = []
      this.dinhTuyenYenSon.forEach(e => {
        payloadYS.push({
          idsp: this.idSanPham,
          iddepartment: e.id,
          thutu: e.thutu,
          created_by: this.userInfo.id,
          factoryId: 102340,
          checknull: false,
          soluongm: e.soluongm,
          soluongm3: e.soluongm3,
          mongam: e.mongam,
          mongduong: e.mongduong,
          khoan: e.khoan
        })
      });
      if (payloadYS.length != 0) {
        dataYS = await this.insertDinhTuyenTemplate(payloadYS)
      }
      else {
        payloadYS.push({
          idsp: this.idSanPham,
          factoryId: 102340,
          checknull: true
        })
        dataYS = await this.insertDinhTuyenTemplate(payloadYS)
      }
      //insert định tuyến tạm Thái Bình cho chi tiết
      let payloadTB = []
      this.dinhTuyenThaiBinh.forEach(e => {
        payloadTB.push({
          idsp: this.idSanPham,
          iddepartment: e.id,
          thutu: e.thutu,
          created_by: this.userInfo.id,
          factoryId: 102366,
          checknull: false,
          soluongm: e.soluongm,
          soluongm3: e.soluongm3,
          mongam: e.mongam,
          mongduong: e.mongduong,
          khoan: e.khoan
        })
      });
      if (payloadTB.length != 0) {
        dataTB = await this.insertDinhTuyenTemplate(payloadTB)
      } else {
        payloadTB.push({
          idsp: this.idSanPham,
          factoryId: 102366,
          checknull: true
        })
        dataTB = await this.insertDinhTuyenTemplate(payloadTB)
      }
      if (this.isChinhSua) {
        this.loadEditSP();
      } else {
        this.loadSanPham();
      }
      this.isDialogSelectedSanPham = false
      this.$q.notify({
        color: 'positive',
        message: 'Thành công'
      })
    },
    async addDinhTuyenTamCumChiTiet() {
      //update chỉnh sửa thông tin sản phẩm

      let payloadEdit = []
      payloadEdit.push({
        name: this.selectedTenCumChiTiet,
        dai: this.selectedDaiCumChiTiet,
        rong: this.selectedRongCumChiTiet,
        day: this.selectedDayCumChiTiet,
        soluong: this.selectedSoLuongCumChiTiet,
        dongsanpham: this.selectedDongSanPhamCumChiTiet,
        chungloai: this.selectedChungLoaiCumChiTiet[0].value,
        donvi: this.selectedDonViCumChiTiet[0].value,
        khachhang: '',
        tennoibo: '',
        heso: this.selectedHeSoCumChiTiet,
        masp: this.selectedCumMasanpham,
        macumchitiet: this.selectedCumMaCumChiTiet,
        machitiet: '',
      })
      const updateEditSP = await this.updateEditSanPham(payloadEdit)

      //insert định tuyến tạm Thuận Hưng cho cụm chi tiết
      let payloadTH = []
      let dataTH = []
      let dataYS = []
      let dataTB = []

      this.dinhTuyenThuanHung.forEach(e => {
        payloadTH.push({
          idsp: this.idSanPham,
          iddepartment: e.id,
          thutu: e.thutu,
          created_by: this.userInfo.id,
          factoryId: 100000,
          checknull: false,
          soluongm: e.soluongm,
          soluongm3: e.soluongm3,
          mongam: e.mongam,
          mongduong: e.mongduong,
          khoan: e.khoan
        })
      });
      if (payloadTH.length != 0) {
        dataTH = await this.insertDinhTuyenTemplate(payloadTH)
      } else {
        payloadTH.push({
          idsp: this.idSanPham,
          factoryId: 100000,
          checknull: true,
          soluongm: null,
          soluongm3: null,
          mongam: null,
          mongduong: null,
          khoan: null
        })
        dataTH = await this.insertDinhTuyenTemplate(payloadTH)
      }
      //insert định tuyến tạm Yên Sơn cho chi tiết
      let payloadYS = []
      this.dinhTuyenYenSon.forEach(e => {
        payloadYS.push({
          idsp: this.idSanPham,
          iddepartment: e.id,
          thutu: e.thutu,
          created_by: this.userInfo.id,
          factoryId: 102340,
          checknull: false,
          soluongm: e.soluongm,
          soluongm3: e.soluongm3,
          mongam: e.mongam,
          mongduong: e.mongduong,
          khoan: e.khoan
        })
      });
      if (payloadYS.length != 0) {
        dataYS = await this.insertDinhTuyenTemplate(payloadYS)
      }
      else {
        payloadYS.push({
          idsp: this.idSanPham,
          factoryId: 102340,
          checknull: true,
          checknull: true,
          soluongm: null,
          soluongm3: null,
          mongam: null,
          mongduong: null,
          khoan: null
        })
        dataYS = await this.insertDinhTuyenTemplate(payloadYS)
      }
      //insert định tuyến tạm Thái Bình cho chi tiết
      let payloadTB = []
      this.dinhTuyenThaiBinh.forEach(e => {
        payloadTB.push({
          idsp: this.idSanPham,
          iddepartment: e.id,
          thutu: e.thutu,
          created_by: this.userInfo.id,
          factoryId: 102366,
          checknull: false,
          soluongm: e.soluongm,
          soluongm3: e.soluongm3,
          mongam: e.mongam,
          mongduong: e.mongduong,
          khoan: e.khoan
        })
      });
      if (payloadTB.length != 0) {
        dataTB = await this.insertDinhTuyenTemplate(payloadTB)
      } else {
        payloadTB.push({
          idsp: this.idSanPham,
          factoryId: 102366,
          checknull: true,
          checknull: true,
          soluongm: null,
          soluongm3: null,
          mongam: null,
          mongduong: null,
          khoan: null
        })
        dataTB = await this.insertDinhTuyenTemplate(payloadTB)
      }
      if (this.isChinhSua) {
        this.loadEditSP();
      } else {
        this.loadSanPham();
      }
      this.isDialogSelectedCumChiTiet = false
      this.$q.notify({
        color: 'positive',
        message: 'Thành công'
      })
    },
    async addDinhTuyenTamCT() {
      let payloadTH = []
      let dataTH = []
      let dataYS = []
      let dataTB = []

      //update chỉnh sửa thông tin sản phẩm
      let payloadEdit = []
      payloadEdit.push({
        name: this.selectedTenChiTiet,
        dai: this.selectedDaiChiTiet,
        rong: this.selectedRongChiTiet,
        day: this.selectedDayChiTiet,
        soluong: this.selectedSoLuongChiTiet,
        dongsanpham: this.selectedDongSanPhamChiTiet,
        chungloai: this.selectedChungLoaiChiTiet[0].value,
        donvi: this.selectedDonViChiTiet[0].value,
        khachhang: this.selectedKhachHangSP,
        tennoibo: this.selectedTenNoiBoSP,
        heso: this.selectedHeSoChiTiet,
        masp: this.selectedChiTietMasanpham,
        macumchitiet: this.selectedMaCumChiTiet,
        machitiet: this.selectedMaChiTiet,
      })
      const updateEditSP = await this.updateEditSanPham(payloadEdit)

      //insert định tuyến tạm Thuận Hưng cho chi tiết


      if (this.ctdinhTuyenThuanHung.length != 0) {
        this.ctdinhTuyenThuanHung.forEach(e => {
          payloadTH.push({
            idsp: this.idSanPham,
            iddepartment: e.id,
            thutu: e.thutu,
            created_by: this.userInfo.id,
            factoryId: 100000,
            checknull: false,
            soluongm: e.soluongm,
            soluongm3: e.soluongm3,
            mongam: e.mongam,
            mongduong: e.mongduong,
            khoan: e.khoan,
          })
          this.insertDinhTuyenTemplate(payloadTH)
        });
      } else {
        payloadTH.push({
          idsp: this.idSanPham,
          factoryId: 100000,
          checknull: true,
          soluongm: null,
          soluongm3: null,
          mongam: null,
          mongduong: null,
          khoan: null,
        })
        await this.insertDinhTuyenTemplate(payloadTH)
      }
      console.log('this.ctdinhTuyenYenSon')
      console.log(this.ctdinhTuyenYenSon)
      //insert định tuyến tạm Yên Sơn cho chi tiết
      let payloadYS = []
      if (this.ctdinhTuyenYenSon.length != 0) {
        this.ctdinhTuyenYenSon.forEach(e => {
          payloadYS.push({
            idsp: this.idSanPham,
            iddepartment: e.id,
            thutu: e.thutu,
            created_by: this.userInfo.id,
            factoryId: 102340,
            checknull: false,
            soluongm: e.soluongm,
            soluongm3: e.soluongm3,
            mongam: e.mongam,
            mongduong: e.mongduong,
            khoan: e.khoan
          })
          this.insertDinhTuyenTemplate(payloadYS)
        });
      } else {
        payloadYS.push({
          idsp: this.idSanPham,
          factoryId: 102340,
          checknull: true,
          soluongm: null,
          soluongm3: null,
          mongam: null,
          mongduong: null,
          khoan: null,
        })
        await this.insertDinhTuyenTemplate(payloadYS)
      }

      //insert định tuyến tạm Thái Bình cho chi tiết

      let payloadTB = []
      if (this.ctdinhTuyenThaiBinh.length != 0) {
        this.ctdinhTuyenThaiBinh.forEach(e => {
          payloadTB.push({
            idsp: this.idSanPham,
            iddepartment: e.id,
            thutu: e.thutu,
            created_by: this.userInfo.id,
            factoryId: 102366,
            checknull: false,
            soluongm: e.soluongm,
            soluongm3: e.soluongm3,
            mongam: e.mongam,
            mongduong: e.mongduong,
            khoan: e.khoan
          })
          this.insertDinhTuyenTemplate(payloadTB)
        });
      } else {
        payloadTB.push({
          idsp: this.idSanPham,
          factoryId: 102366,
          checknull: true,
          soluongm: null,
          soluongm3: null,
          mongam: null,
          mongduong: null,
          khoan: null,
        })
        await this.insertDinhTuyenTemplate(payloadTB)
      }
      if (this.isChinhSua) {
        this.loadEditSP();
      } else {
        this.loadSanPham();
      }
      this.isDialogSelectedChiTiet = false
      this.$q.notify({
        color: 'positive',
        message: 'Thành công'
      })
    },
    hideDialogChiTiet() {
      this.isDialogSelectedChiTiet = false

    },
    hideDialogCumChiTiet() {
      this.isDialogSelectedCumChiTiet = false
    },
    async onShowSelectedChiTiet(e) {
      this.allRoutingTemp = await this.getAllRoutingTemp()
      this.isDialogSelectedChiTiet = true
      this.idSanPham = e.id
      this.selectedTenChiTiet = e.name;
      this.selectedMaChiTiet = e.masochitiet;
      this.selectedChiTietMasanpham = e.masosp;
      this.selectedMaCumChiTiet = e.masocumchitiet;

      this.selectedDaiChiTiet = e.dai;
      this.selectedRongChiTiet = e.rong;
      this.selectedDayChiTiet = e.day;
      this.selectedHeSoChiTiet = e.heso;
      this.selectedSoLuongChiTiet = e.soluong;
      this.selectedDongSanPhamChiTiet = e.dongsanpham;
      this.selectedChungLoaiChiTiet = this.chungloais.filter(f => f.value == e.chungloai);
      this.selectedDonViChiTiet = this.donvis.filter(f => f.value == e.donvi);

      //get data to table Định tuyến nhà máy CBG Thuận Hưng :
      let arrTempCTTH = []
      if (this.allRoutingTemp != null) {
        arrTempCTTH = this.allRoutingTemp.data.filter(f => f.factoryId == 100000 && f.ITEM_ID == this.idSanPham)
      }

      this.ctdinhTuyenThuanHung = []
      if (arrTempCTTH.length != 0) {
        arrTempCTTH.forEach(e => {
          this.ctdinhTuyenThuanHung.push({
            namechitiet: this.selectedTenChiTiet,
            code: e.STEP_CODE,
            name: e.STEP_NAME,
            thutu: e.ORDER,
            id: e.STEP_ID,
            soluongm: e.SoLuongM,
            soluongm3: e.SoLuongM3,
            mongam: e.MongAm,
            mongduong: e.MongDuong,
            khoan: e.Khoan,
          })
        });
      }
      //get data to table Chọn định tuyến nhà máy Yên Sơn :
      let arrTempCTYS = []
      if (this.allRoutingTemp != null) {
        arrTempCTYS = this.allRoutingTemp.data.filter(f => f.factoryId == 102340 && f.ITEM_ID == this.idSanPham)
      }
      this.ctdinhTuyenYenSon = []
      if (arrTempCTYS.length != 0) {
        arrTempCTYS.forEach(e => {
          this.ctdinhTuyenYenSon.push({
            namechitiet: this.selectedTenChiTiet,
            code: e.STEP_CODE,
            name: e.STEP_NAME,
            thutu: e.ORDER,
            id: e.STEP_ID,
            soluongm: e.SoLuongM,
            soluongm3: e.SoLuongM3,
            mongam: e.MongAm,
            mongduong: e.MongDuong,
            khoan: e.Khoan,
          })
        });
      }

      //get data to table Chọn định tuyến nhà máy Thái Bình :
      let arrTempCTTB = []
      if (this.allRoutingTemp != null) {
        arrTempCTTB = this.allRoutingTemp.data.filter(f => f.factoryId == 102366 && f.ITEM_ID == this.idSanPham)
      }

      this.ctdinhTuyenThaiBinh = []
      if (arrTempCTYS.length != 0) {
        arrTempCTTB.forEach(e => {
          this.ctdinhTuyenThaiBinh.push({
            namechitiet: this.selectedTenChiTiet,
            code: e.STEP_CODE,
            name: e.STEP_NAME,
            thutu: e.ORDER,
            id: e.STEP_ID,
            soluongm: e.SoLuongM,
            soluongm3: e.SoLuongM3,
            mongam: e.MongAm,
            mongduong: e.MongDuong,
            khoan: e.Khoan,
          })
        });
      }

      //push cb TH
      this.cbdinhtuyenTH = []
      this.ctdinhTuyenThuanHung.forEach(e => {
        this.departmemntLuaPhoiThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntSoCheThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntKhoSoCheThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntTinhCheThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntKhoTinhCheThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntToSonThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntDongGoiThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
        this.departmemntKhoThanhPhamThuanHung.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTH.push(el)
          }
        });
      });
      //push cb yên sơn
      this.cbdinhtuyenYS = []
      this.ctdinhTuyenYenSon.forEach(e => {
        this.departmemntLuaPhoiYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntSoCheYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntKhoSoCheYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntTinhCheYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntKhoTinhCheYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntToSonYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntDongGoiYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
        this.departmemntKhoThanhPhamYenSon.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenYS.push(el)
          }
        });
      });
      //push cb thái bình
      this.cbdinhtuyenTB = []
      this.ctdinhTuyenThaiBinh.forEach(e => {
        this.departmemntLuaPhoiThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntSoCheThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntKhoSoCheThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntTinhCheThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntKhoTinhCheThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntToSonThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntDongGoiThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
        this.departmemntKhoThanhPhamThaiBinh.forEach(el => {
          if (e.code == el.CODE) {
            this.cbdinhtuyenTB.push(el)
          }
        });
      });
    },
    async onSelectionCheckBox(cell) {

    },

    inputTableChiTietTrongCum() {
      //
    },
    showSPChoDuyet() {
      this.isSanPhamChoDuuyet = !this.isSanPhamChoDuuyet
    },
    async loadEditSP() {
      const data = await this.getAllSanPham();
      this.allSanPham = data.data
      let dataSPCreatedByUser = [];
      let dataChiTietByUser = [];
      let dataCumChiTietByUser = [];

      //xử lý thêm mới sản phẩm
      dataSPCreatedByUser = this.allSanPham.filter(f => f.MASP == this.selectedItem[0].masp && f.TYPE == 'sanPham' && f.TYPE_EDIT == '')

      if (dataSPCreatedByUser.length != 0) {
        //set input sản phẩm
        this.masp = dataSPCreatedByUser[0].MASP;
        this.tensp = dataSPCreatedByUser[0].NAME;
        this.tengoi = dataSPCreatedByUser[0].TENNOIBO;
        this.anhsanpham = dataSPCreatedByUser[0].ANHSANPHAM;
        this.khachhang = dataSPCreatedByUser[0].KHACHHANG;
        this.spdongsanpham = dataSPCreatedByUser[0].DONGSANPHAM;
        this.cttensanpham = dataSPCreatedByUser[0].NAME;
        this.ctensanpham = dataSPCreatedByUser[0].NAME;
        this.ctmasanpham = this.masp;
        this.cmasanpham = this.masp;
        this.sua = true
        this.spIsDone = false

        //set input sản phẩm
        this.sanpham = []
        this.sanpham.push({
          id: dataSPCreatedByUser[0].ID,
          name: dataSPCreatedByUser[0].NAME,
          masosp: dataSPCreatedByUser[0].MASP,
          tennoibo: dataSPCreatedByUser[0].TENNOIBO,
          anhsp: dataSPCreatedByUser[0].ANHSANPHAM,
          khachhang: dataSPCreatedByUser[0].KHACHHANG,
          dongsanpham: dataSPCreatedByUser[0].DONGSANPHAM,
        })
        //set input chi tiết
        dataChiTietByUser = data.data.filter(f => f.TYPE == 'chiTiet' && f.MASP == this.masp && (f.TYPE_EDIT == '' || f.TYPE_EDIT == 'edit-insert'))
        this.chitiet = []
        dataChiTietByUser.forEach(e => {
          this.chitiet.push({
            id: e.ID,
            name: e.NAME,
            masosp: e.MASP,
            masochitiet: e.MACHITIET,
            masocumchitiet: e.MACUMCHITIET,
            dai: e.DAI,
            rong: e.RONG,
            day: e.DAY,
            heso: e.HESO,
            soluong: e.SOLUONG,
            dongsanpham: e.DONGSANPHAM,
            chungloai: e.CHUNGLOAI,
            donvi: e.DONVI,
            color:e.COLOR,
          })
        });

        // set input cụm chi tiết
        dataCumChiTietByUser = data.data.filter(f => f.TYPE == 'cumChiTiet' && f.MASP == this.masp && (f.TYPE_EDIT == '' || f.TYPE_EDIT == 'edit-insert'))

        this.cumchitiet = []
        dataCumChiTietByUser.forEach(e => {
          this.cumchitiet.push({
            id: e.ID,
            masosp: e.MASP,
            name: e.NAME,
            masocumchitiet: e.MACUMCHITIET,
            dai: e.DAI,
            rong: e.RONG,
            day: e.DAY,
            heso: e.HESO,
            soluong: e.SOLUONG,
            dongsanpham: e.DONGSANPHAM,
            chungloai: e.CHUNGLOAI,
            donvi: e.DONVI,
          })
        });
      }
    },
     getCumChiTiet(masp) {
      let data = []
      let cumchitiet = []
      let chitietkhongcum = []
      cumchitiet = this.allSP1.filter(f => f.TYPE == 'cumChiTiet' && f.MASP == masp)
      chitietkhongcum = this.allSP1.filter(f => f.TYPE == 'chiTiet' && f.MASP == masp && f.MACUMCHITIET == '')
      if (cumchitiet.length == 0) {
        return data
      } else {
        cumchitiet.forEach(e => {
          data.push({
            label: e.MASP + ':' + e.NAME + ' (' + e.HESO + ') ' ,
            children: this.getChiTiet(e.MACUMCHITIET, masp),
            idsp: e.ID,
            value: e,
            trangthai: e.TRANGTHAI,
            TrangThaiHienThi: e.TrangThaiHienThi,
            bold: 2
          })
        });
        chitietkhongcum.forEach(e => {
          data.push({
            label: e.MASP + ':' + e.NAME + ' (' + e.HESO + ') ' ,
            children: null,
            idsp: e.ID,
            value: e,
            trangthai: e.TRANGTHAI,
            TrangThaiHienThi: e.TrangThaiHienThi,
            bold: 2
          })
        });
      }
      return data
    },
     getChiTiet(macumchitiet, masp) {
      let data = []
      let chitiet = []
      chitiet = this.allSP1.filter(f => f.TYPE == 'chiTiet' && f.MASP == masp && f.MACUMCHITIET == macumchitiet)
      if (chitiet.length == 0) {
        return data
      } else {
        chitiet.forEach(e => {
          data.push({
            label: e.MASP + ':' + e.NAME + ' (' + e.HESO + ') ',
            idsp: e.ID,
            value: e,
            trangthai: e.TRANGTHAI,
            TrangThaiHienThi: e.TrangThaiHienThi,
            bold: 3
          })
        });
      }
      return data
    },
        async onShowTree(prop) {
      this.isShowHTPD = true
      this.prop = prop

      this.treeData = []
      this.treeData.push({
        label: prop.MASP + ':' + prop.NAME ,
        children: this.getCumChiTiet(prop.MASP),
        idsp: prop.ID,
        value: prop,
        trangthai: prop.TRANGTHAI,
        TrangThaiHienThi: prop.TrangThaiHienThi,
        bold: 1
      })
 console.log('cay:',this.treeData)
      //set filter để 1 lần chỉ chọn đc 1 sp duy nhất
      // if (prop.expand == true) {
      //   this.filter = prop.row.MASP
      // } else {
       
      //   this.filter = ''
      // }
    },
    showDialogSua() {

      if (this.selectedItem.length == 0) {
        this.$q.notify({
          color: 'info',
          message: 'Chọn sản phẩm cần chỉnh sửa !'
        })
      } else {
        this.isChinhSua = true
        this.loadEditSP();
        this.isShowDialog = true
      }
    },
     async   showDialogMau() {

      if (this.selectedItem.length == 0) {
        this.$q.notify({
          color: 'info',
          message: 'Chọn sản phẩm cần chọn màu !'
        })
      } else {
      //  this.isChinhSua = true
        this.loadEditSP();
        this.isShowDialogMau = true
      let  payloadlaymau = {
        masp:this.selectedItem[0].masp,
      }
      const datalaymausanpham = await this.laymausanpham(payloadlaymau)
     if(datalaymausanpham.data.length>0){
     this.mauthitruong = []
     
      datalaymausanpham.data.forEach(e=>{
        this.mauthitruong.push(e.COLOR
)
      })
      // console.log('mau thi truong:',this.mauthitruong)
      }
      }
    },
    showDialogView(cell) {
      this.selectedItem = []
      this.selectedItem[0] = cell
   console.log('ma SP:',cell.masp)
      // this.view = true;
      // this.isChinhSua = true
      // this.loadEditSP();
      // this.isShowDialog = true
      this.hinhcay = true
     this.data3 =  this.data2.filter(d => d.MASP == cell.masp)
     console.log ('du lieu:',this.data3[0])
     this.onShowTree(this.data3[0])
      
    },
    remove(e) {
      this.nameXoa = e.name
      this.idxoa = e.id
      this.isXacNhanDel = true
    },
    hideXacNhanDel() {
      this.isXacNhanDel = false
    },
    async xoa() {
      let payload = []
      let allsp = await this.getAllSanPham()
      let spxoa = []
      spxoa = allsp.data.filter(f => f.ID == this.idxoa)
      //update chi tiết xóa sẽ có cụm là ''
      if (spxoa[0].TYPE == "chiTiet") {

      } else {
        let editCumOfChiTiet = allsp.data.filter(f => f.MACUMCHITIET == spxoa[0].MACUMCHITIET && f.TYPE == "chiTiet")
        if (editCumOfChiTiet.length != 0) {
          const dataEditCumOfChiTiet = await this.updateCumOfChiTiet(editCumOfChiTiet)
        }
      }
      payload.push({
        idxoa: this.idxoa,
        type: 'edit-delete'
      })
      payload.forEach(e => {
        // this.chitiet = this.chitiet.filter(f => f.id != e.idxoa)
        this.cumchitiet = this.cumchitiet.filter(f => f.id != e.idxoa)
      });
      if (this.isChinhSua) {
        const dataedit = await this.updataTypeEdit(payload)
      } else {
        const data = await this.delSP(payload)
      }
      if (this.isChinhSua) {
        this.loadEditSP();
      } else {
        this.loadSanPham();
      }
      this.isXacNhanDel = false
    },
    hideDialogSanPham() {
      this.isDialogSelectedSanPham = false
    },
  
    onSelectionChanged({ selectedRowsData }) {
      this.selectedItem = []
      this.selectedItem.push(selectedRowsData[0]);
    },
    showDialogCSM() {
      this.isDialogCSM = true;
    },
    hideDialogCSM() {
      this.isDialogCSM = false;
      //git
    },
    async pheDuyetCSM() {
      let payload = []
      this.congsuatmayTH.forEach(e => {
        payload.push({
          NAME: e.NAME,
          code: e.code,
          ID: e.ID,
          CONGSUAT: e.CONGSUAT,
          TRANGTHAI: 'guipheduyet'
        })
      });
      this.congsuatmayYS.forEach(e => {
        payload.push({
          NAME: e.NAME,
          code: e.code,
          ID: e.ID,
          CONGSUAT: e.CONGSUAT,
          TRANGTHAI: 'guipheduyet'
        })
      });
      this.congsuatmayTB.forEach(e => {
        payload.push({
          NAME: e.NAME,
          code: e.code,
          ID: e.ID,
          CONGSUAT: e.CONGSUAT,
          TRANGTHAI: 'guipheduyet'
        })
      });
      payload.forEach(element => {
        if (element.CONGSUAT == null || element.CONGSUAT == '') {
          element.CONGSUAT = 0
        }
      });
      const data = await this.updateCongSuatMay(payload)
      if (data.meta.success) {
        this.$q.notify({
          color: 'positive',
          message: 'Gửi phê duyệt thành công !!!'
        })
        this.isDialogCSM = false
        this.loadDataDepartment()
      } else {
        this.$q.notify({
          color: 'negative',
          message: 'Gửi phê duyệt thất bại !!!'
        })
      }
    },
  },
   async loadData() {
      const data = await this.getAllSanPhamduyet()
      this.dataAllSP = data.data
      this.allSP1 = data.data.filter(f => f.TRANGTHAI == "approve")
      this.allSP1.forEach(e => {
        if (e.TRANGTHAI == 'chopheduyet') {
          e.TrangThaiHienThi = ''
        } else if (e.TRANGTHAI == 'tuchoi') {
          e.TrangThaiHienThi = '(Từ chối)'
        } else if (e.TRANGTHAI == 'pheduyet') {
          e.TrangThaiHienThi = '(Đồng ý)'
        }
        else if (e.TRANGTHAI == 'approve') {
          if (e.TYPE_EDIT == 'edit') {
            e.TrangThaiHienThi = '(Đồng ý)'
          } else if (e.TYPE_EDIT == 'edit-delete') {
            e.TrangThaiHienThi = '(xóa)'
          } else if (e.TYPE_EDIT == 'edit-insert') {
            e.TrangThaiHienThi = '(Thêm mới)'
          }
        } else if (e.TRANGTHAI == 'chuaduyet') {
          if (e.TYPE_EDIT == 'edit') {
            e.TrangThaiHienThi = ''
          } else if (e.TYPE_EDIT == 'edit-insert') {
            e.TrangThaiHienThi = '(Thêm mới)'
          } else if (e.TYPE_EDIT == 'edit-delete') {
            e.TrangThaiHienThi = '(xóa)'
          }
        } else {
          e.TrangThaiHienThi = ''
        }
      });
     this.data = this.allSP1.filter(f => f.TYPE == "sanPham")
    //  this.allRoutingTemp = await this.getAllRoutingTemp();
   //   this.routingSP()
    },
  async created() {
     
    this.loadSanPham();
    this.loadItems();
    this.loadUnit();
    this.loadItemTypes();
    this.loadDataDepartment();
    this.loadRoungtingTemp();
    this.loadSPChoPheDuyet();
 
   const mamau = await this.getMamau();  
   this.mamausp =  mamau.data
  },
}
</script>
<style scoped>
.checkboxes-mode {
  position: absolute;
  right: 20px;
  bottom: 20px;
}
/* .q-table {
  width: 80%;
  max-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
} */
table {
  border: 0px solid black;
  width: 100%;
}

td,
th {
  border: 0px solid black;
  text-align: left;
  padding: 5px;
  max-width: 600px;
  min-width: 600px;
}
</style>
