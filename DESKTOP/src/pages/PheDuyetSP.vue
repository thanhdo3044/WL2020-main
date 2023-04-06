<template>
  <div>
    <div class="row" style="background-color: #daf8e1;">
      <div class="col-6 text-blue text-bold" style="font-size: 18px;">
        Phê duyệt khai báo danh mục khối CBG
      </div>
    </div>
    <div class="row">
      <!-- <div class="col-2">
        <q-btn v-show="showCSM" style="margin-right:30px" color="positive" label="Danh mục sản phẩm" @click="showDialogCSM" />
      </div> -->
      <div v-show="showCSM" class="col-2">
        <q-btn style="margin-right:30px" color="positive" label="Công suất" @click="showDialogCSM" />
      </div>
    </div>
    <div v-if="!isShowCSM" class="row">
      <div class="col-4" style="padding-right: 5px">
        <q-card style="min-width: 70%">
          <q-table title="Danh mục đang chờ duyệt" :data="data" :columns="columns" row-key="MASP" :filter="filter"
            no-data-label="Không có dữ liệu !" :pagination.sync="page">
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th auto-width />
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td auto-width>
                  <q-btn size="sm" color="blue-5" round dense @click="onShowTree(props)"
                    :icon="props.expand ? 'remove' : 'add'" />
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
              <q-tr v-show="props.expand" :props="props">
                <q-td colspan="100%">
                  <div class="text-left">
                    <q-tree :nodes="treeData" default-expand-all :selected.sync="selectedSP"
                      @update:selected="routingSP" node-key="idsp" selected-color="warning">
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
                <div class="col-8">
                  <q-btn v-show="isShowCF" color="positive" label="Hoàn thành phê duyệt" @click="xacnhanCauTrucSP" />
                </div>
                <div class="col-2" align="right" style="padding-right:5px">
                  <q-btn v-show="isShowCF" style="background-color: #0B61A5;color: white;" icon="check"
                    @click="pheDuyetCauThanh" />
                </div>
                <div class="col-1" align="left">
                  <q-btn v-show="isShowCF" color="negative" icon="cancel" @click="tuChoiCauThanh" />
                </div>
                <div class="col-1" align="left">
                </div>
              </div>
            </template>
          </q-table>
          <div v-show="isShowCF">
            <hr />
            <div v-show="isShowTBTH">
              <label style="font-weight: bold;">Định tuyến nhà máy CBG Thuận Hưng :</label>
              <DxDataGrid :data-source="dinhTuyenThuanHung" key-expr="id" :show-borders="true"
                :word-wrap-enabled="true">
                <DxEditing :allow-updating="true" mode="row" />
                <!-- <DxColumn data-field="code" caption="Mã định tuyến" alignment="left" /> -->
                <DxColumn data-field="name" caption="Tên định tuyến" alignment="left" :allow-editing="false" />
                <DxColumn data-field="thutu" caption="Thứ tự" alignment="left" :allow-editing="false" />
                <!-- <DxColumn data-field="soluongm" caption="Số lượng M" alignment="left" />
                <DxColumn data-field="soluongm3" caption="Số lượng M3" alignment="left" />
                <DxColumn data-field="mongam" caption="Mộng âm" alignment="left" />
                <DxColumn data-field="mongduong" caption="Mộng dương" alignment="left" />
                <DxColumn data-field="khoan" caption="Khoan" alignment="left" /> -->
              </DxDataGrid>
              <hr />
            </div>
            <div v-show="isShowTBYS">
              <label style="font-weight: bold;">Định tuyến nhà máy CBG Yên Sơn 1 :</label>
              <DxDataGrid :data-source="dinhTuyenYenSon" key-expr="id" :show-borders="true" :word-wrap-enabled="true">
                <DxEditing :allow-updating="true" mode="row" />
                <!-- <DxColumn data-field="code" caption="Mã định tuyến" alignment="left" /> -->
                <DxColumn data-field="name" caption="Tên định tuyến" alignment="left" />
                <DxColumn data-field="thutu" caption="Thứ tự" alignment="left" />
                <!-- <DxColumn data-field="soluongm" caption="Số lượng M" alignment="left" />
                <DxColumn data-field="soluongm3" caption="Số lượng M3" alignment="left" />
                <DxColumn data-field="mongam" caption="Mộng âm" alignment="left" />
                <DxColumn data-field="mongduong" caption="Mộng dương" alignment="left" />
                <DxColumn data-field="khoan" caption="Khoan" alignment="left" /> -->
              </DxDataGrid>
              <hr />
            </div>
            <div v-show="isShowTBTB">
              <label style="font-weight: bold;">Định tuyến nhà máy CBG Thái Bình :</label>
              <DxDataGrid :data-source="dinhTuyenThaiBinh" key-expr="id" :show-borders="true" :word-wrap-enabled="true">
                <DxEditing :allow-updating="true" mode="row" />
                <!-- <DxColumn data-field="code" caption="Mã định tuyến" alignment="left" /> -->
                <DxColumn data-field="name" caption="Tên định tuyến" alignment="left" />
                <DxColumn data-field="thutu" caption="Thứ tự" alignment="left" />
                <!-- <DxColumn data-field="soluongm" caption="Số lượng M" alignment="left" />
                <DxColumn data-field="soluongm3" caption="Số lượng M3" alignment="left" />
                <DxColumn data-field="mongam" caption="Mộng âm" alignment="left" />
                <DxColumn data-field="mongduong" caption="Mộng dương" alignment="left" />
                <DxColumn data-field="khoan" caption="Khoan" alignment="left" /> -->
              </DxDataGrid>
            </div>
          </div>
        </q-card>
      </div>
      <div v-show="isShowCF" class="col-8" style="padding-left: 5px">
        <q-card style="min-width: 70%;height: 810px">
          <div v-show="isShowCBDTTH">
            <p style="font-style: italic; color: #2196f3;font-weight: bold; padding-left: 16px">
              Định tuyến nhà máy Thuận Hưng :
            </p>
            <table style="border: 1px solid black;width: 100%">
              <tr style="border-right: 1px solid black;border-bottom: 1px solid black; background-color: #daf8e1;">
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Lựa Phôi</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Sơ chế</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Kho sau sơ chế</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Tinh chế</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Kho bán thành phẩm</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Hoàn thiện</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Đóng gói</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Kho Thành Phẩm</th>
              </tr>
              <tr>
                <td style="border-right: 1px solid black;vertical-align: top;;width: 250px;">
                  <div v-for="luaphoi in departmemntLuaPhoiThuanHung" :key="luaphoi.index">
                    <q-checkbox v-model="cbdinhtuyenTH" :val="luaphoi" :label="luaphoi.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTH" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="soche in departmemntSoCheThuanHung" :key="soche.index">
                    <q-checkbox v-model="cbdinhtuyenTH" :val="soche" :label="soche.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTH" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="khosoche in departmemntKhoSoCheThuanHung" :key="khosoche.index">
                    <q-checkbox v-model="cbdinhtuyenTH" :val="khosoche" :label="khosoche.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTH" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="tinhche in departmemntTinhCheThuanHung" :key="tinhche.index">
                    <q-checkbox v-model="cbdinhtuyenTH" :val="tinhche" :label="tinhche.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTH" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="khotinhche in departmemntKhoTinhCheThuanHung" :key="khotinhche.index">
                    <q-checkbox v-model="cbdinhtuyenTH" :val="khotinhche" :label="khotinhche.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTH" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="toson in departmemntToSonThuanHung" :key="toson.index">
                    <q-checkbox v-model="cbdinhtuyenTH" :val="toson" :label="toson.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTH" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="donggoi in departmemntDongGoiThuanHung" :key="donggoi.index">
                    <q-checkbox v-model="cbdinhtuyenTH" :val="donggoi" :label="donggoi.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTH" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="khothanhpham in departmemntKhoThanhPhamThuanHung" :key="khothanhpham.index">
                    <q-checkbox v-model="cbdinhtuyenTH" :val="khothanhpham" :label="khothanhpham.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTH" />
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div v-show="isShowCBDTYS">

            <p style="font-style: italic; color: #2196f3;font-weight: bold; padding-left: 16px">
              Định tuyến nhà máy Yên Sơn :
            </p>
            <table style="border: 1px solid black;width: 100%">
              <tr style="border-right: 1px solid black;border-bottom: 1px solid black ;background-color: #daf8e1;">
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Lựa Phôi</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Sơ chế</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Kho sau sơ chế</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Tinh chế</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Kho bán thành phẩm</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Hoàn thiện</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Đóng gói</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Kho Thành Phẩm</th>
              </tr>
              <tr>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="luaphoi in departmemntLuaPhoiYenSon" :key="luaphoi.index">
                    <q-checkbox v-model="cbdinhtuyenYS" :val="luaphoi" :label="luaphoi.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTYS" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="soche in departmemntSoCheYenSon" :key="soche.index">
                    <q-checkbox v-model="cbdinhtuyenYS" :val="soche" :label="soche.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTYS" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="khosoche in departmemntKhoSoCheYenSon" :key="khosoche.index">
                    <q-checkbox v-model="cbdinhtuyenYS" :val="khosoche" :label="khosoche.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTYS" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="tinhche in departmemntTinhCheYenSon" :key="tinhche.index">
                    <q-checkbox v-model="cbdinhtuyenYS" :val="tinhche" :label="tinhche.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTYS" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="khotinhche in departmemntKhoTinhCheYenSon" :key="khotinhche.index">
                    <q-checkbox v-model="cbdinhtuyenYS" :val="khotinhche" :label="khotinhche.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTYS" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="toson in departmemntToSonYenSon" :key="toson.index">
                    <q-checkbox v-model="cbdinhtuyenYS" :val="toson" :label="toson.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTYS" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="donggoi in departmemntDongGoiYenSon" :key="donggoi.index">
                    <q-checkbox v-model="cbdinhtuyenYS" :val="donggoi" :label="donggoi.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTYS" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="khothanhpham in departmemntKhoThanhPhamYenSon" :key="khothanhpham.index">
                    <q-checkbox v-model="cbdinhtuyenYS" :val="khothanhpham" :label="khothanhpham.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTYS" />
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div v-show="isShowCBDTTB">
            <p style="font-style: italic; color: #2196f3;font-weight: bold; padding-left: 16px">
              Định tuyến nhà máy Thái Bình :
            </p>
            <table style="border: 1px solid black;width: 100%">
              <tr style="border-right: 1px solid black;border-bottom: 1px solid black;background-color: #daf8e1;">
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Lựa Phôi</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Sơ chế</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Kho sau sơ chế</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Tinh chế</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Kho bán thành phẩm</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Hoàn thiện</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Đóng gói</th>
                <th style="border-right: 1px solid black;border-bottom: 1px solid black">Kho Thành Phẩm</th>
              </tr>
              <tr>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="luaphoi in departmemntLuaPhoiThaiBinh" :key="luaphoi.index">
                    <q-checkbox v-model="cbdinhtuyenTB" :val="luaphoi" :label="luaphoi.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTB" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="soche in departmemntSoCheThaiBinh" :key="soche.index">
                    <q-checkbox v-model="cbdinhtuyenTB" :val="soche" :label="soche.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTB" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="khosoche in departmemntKhoSoCheThaiBinh" :key="khosoche.index">
                    <q-checkbox v-model="cbdinhtuyenTB" :val="khosoche" :label="khosoche.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTB" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="tinhche in departmemntTinhCheThaiBinh" :key="tinhche.index">
                    <q-checkbox v-model="cbdinhtuyenTB" :val="tinhche" :label="tinhche.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTB" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="khotinhche in departmemntKhoTinhCheThaiBinh" :key="khotinhche.index">
                    <q-checkbox v-model="cbdinhtuyenTB" :val="khotinhche" :label="khotinhche.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTB" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="toson in departmemntToSonThaiBinh" :key="toson.index">
                    <q-checkbox v-model="cbdinhtuyenTB" :val="toson" :label="toson.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTB" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="donggoi in departmemntDongGoiThaiBinh" :key="donggoi.index">
                    <q-checkbox v-model="cbdinhtuyenTB" :val="donggoi" :label="donggoi.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTB" />
                  </div>
                </td>
                <td style="border-right: 1px solid black;vertical-align: top;width: 250px;">
                  <div v-for="khothanhpham in departmemntKhoThanhPhamThaiBinh" :key="khothanhpham.index">
                    <q-checkbox v-model="cbdinhtuyenTB" :val="khothanhpham" :label="khothanhpham.NAME" color="amber-6"
                      @input="inputTableDinhTuyenCTTB" />
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div align="center" v-show="isShowHTPD">
            <q-btn color="warning" label="Hiển thị tất cả nhà máy" @click="showAllTable" />
          </div>
        </q-card>
        <!-- <div class="q-pa-md q-gutter-sm" align="right" v-show="isShowHTPD">
          <q-btn color="positive" label="Hoàn thành phê duyệt" @click="xacnhanCauTrucSP" />
        </div> -->
      </div>
    </div>
    <div v-else>
      <q-card style="min-width: 100%;padding: 10px;">
        <div class="row">
          <div v-show="showCBGTH" class="col-4" style="padding-right: 20px;">
            <label style="font-weight: bold;font-size: 18px;">Nhà máy CBG Thuận Hưng :</label>
            <DxDataGrid :data-source="congsuatmayTH" :show-borders="true" :show-row-lines="true"
              data-row-template="dataRowTemplate" :word-wrap-enabled="true" @row-removed="deleteCSM">
              <DxPaging :page-size="100" />
              <DxGrouping :auto-expand-all="autoExpandAll" />
              <DxEditing :allow-updating="true" :allow-deleting="true" mode="row" />
              <DxColumn data-field="NAME" caption="Tên tổ" alignment="left" :allow-editing="false" />
              <DxColumn data-field="CONGSUAT" caption="Công suất cũ" alignment="left" :width="100" :allow-editing="true"
                data-type="number" />
              <DxColumn data-field="CONGSUAT_APPROVED" caption="Công suất mới chờ duyệt" alignment="left" :width="100"
                :allow-editing="true" data-type="number" />
              <DxColumn :group-index="0" data-field="Nhóm" group-cell-template="groupCellTemplate" />
              <template #groupCellTemplate="{ data }">
                <div style="font-weight: bold;color:black;">
                  {{ data.value }}
                </div>
              </template>

            </DxDataGrid>
          </div>
          <div v-show="showCBGYS" class="col-4" style="padding-right: 20px;">
            <label style="font-weight: bold;font-size: 18px">Nhà máy CBG Yên Sơn :</label>
            <DxDataGrid :data-source="congsuatmayYS" :show-borders="true" :show-row-lines="true"
              :word-wrap-enabled="true">
              <DxPaging :page-size="100" />
              <DxGrouping :auto-expand-all="autoExpandAll" />
              <DxEditing :allow-updating="true" mode="row" />
              <DxColumn data-field="NAME" caption="Tên tổ" alignment="left" :allow-editing="false" />
              <DxColumn data-field="CONGSUAT" caption="Công suất cũ" alignment="left" :width="100" :allow-editing="true"
                data-type="number" />
              <DxColumn data-field="CONGSUAT_APPROVED" caption="Công suất mới chờ duyệt" alignment="left" :width="100"
                :allow-editing="true" data-type="number" />
              <DxColumn :group-index="0" data-field="Nhóm" group-cell-template="groupCellTemplate" />
              <template #groupCellTemplate="{ data }">
                <div style="font-weight: bold;color:black">
                  {{ data.value }}
                </div>
              </template>
            </DxDataGrid>
          </div>
          <div v-show="showCBGTB" class="col-4">
            <label style="font-weight: bold;font-size: 18px">Nhà máy CBG Thái Bình :</label>
            <DxDataGrid :data-source="congsuatmayTB" :show-borders="true" :show-row-lines="true"
              :word-wrap-enabled="true">
              <DxPaging :page-size="100" />
              <DxGrouping :auto-expand-all="autoExpandAll" />
              <DxEditing :allow-updating="true" mode="row" />
              <DxColumn data-field="NAME" caption="Tên tổ" alignment="left" :allow-editing="false" />
              <DxColumn data-field="CONGSUAT" caption="Công suất cũ" alignment="left" :width="100" :allow-editing="true"
                data-type="number" />
              <DxColumn data-field="CONGSUAT_APPROVED" caption="Công suất mới chờ duyệt" alignment="left" :width="100"
                :allow-editing="true" data-type="number" />
              <DxColumn :group-index="0" data-field="Nhóm" group-cell-template="groupCellTemplate" />
              <template #groupCellTemplate="{ data }">
                <div style="font-weight: bold;color:black">
                  {{ data.value }}
                </div>
              </template>
            </DxDataGrid>
          </div>
        </div>
        <div class="q-pa-md q-gutter-sm" align="right">
          <!-- <DxCheckBox id="autoExpand" v-model="autoExpandAll" text="Hiển thị tất cả tổ" /> -->
          <q-btn color="positive" label="Duyệt" @click="duyetCSM" />
          <q-btn color="red" label="đóng" @click="isShowCSM = !isShowCSM" />
        </div>
      </q-card>
    </div>
    <q-dialog v-model="isShowHuyCauThanh">
      <q-card style="padding: 10px 10px 0 10px;">
        <div>
          Xác nhận từ chối sẽ xóa tất cả định tuyến của :
          <label style="font-weight: bold;">
            {{ selectedSPName.length == 0 ? '' : selectedSPName[0].NAME }} </label>
          , bạn chắc chắn từ chối ?
        </div>
        <div class="q-pa-md q-gutter-sm" align="right">
          <q-btn color="positive" label="xác nhận" @click="delSPTEMP" />
          <q-btn color="red" label="đóng" @click="hideDialogHuyCauThanh" />
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isShowDuyetCauThanh">
      <q-card style="padding: 10px 10px 0 10px;">
        <div>
          Xác nhận phê duyệt sẽ lưu tất cả định tuyến của :
          <label style="font-weight: bold;">{{ selectedSPName.length == 0 ? '' : selectedSPName[0].NAME }}</label>
          , bạn chắc chắn phê duyệt ?
        </div>
        <div class="q-pa-md q-gutter-sm" align="right">
          <q-btn color="positive" label="xác nhận" @click="duyetSPTEMP" />
          <q-btn color="red" label="đóng" @click="hideDialogDuyetCauThanh" />
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isXacNhanCauThanh">
      <q-card style="padding: 10px 10px 0 10px;">
        <div>
          Xác nhận cấu thành
          <label style="font-weight: bold;">{{ selectedSPName.length == 0 ? '' : selectedSPName[0].NAME }}</label>
        </div>
        <div class="q-pa-md q-gutter-sm" align="right">
          <q-btn color="primary" label="xác nhận" @click="xacnhan" />
          <q-btn color="red" label="đóng" @click="hideXacNhanCauThanh" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script >
import { mapGetters, mapActions } from "vuex";
import DxCheckBox from 'devextreme-vue/check-box';
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
  DxExport,
  DxSearchPanel,
  DxHeaderFilter,
  DxFilterRow,
  DxRequiredRule,
  DxGrouping,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxCheckBox,
    DxGrouping,
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxExport,
    DxLookup,
    DxSearchPanel,
    DxHeaderFilter,
    DxFilterRow,
    DxRequiredRule,
  },
  data() {
    return {
      columns: [
        { name: 'mã sản phẩm', align: 'center', label: 'Mã sản phẩm', field: 'MASP' },
        { name: 'tên sản phẩm', align: 'center', label: 'Tên sản phẩm', field: 'NAME' },
        { name: 'người tạo', align: 'center', label: 'Người tạo', field: 'CREATE_BY_NAME' },
      ],
      data: [],
      allSP: [],
      selectedSP: [],
      selectedSPName: [],
      treeData: [],
      filter: '',

      allRoutingTemp: [],
      isShowHuyCauThanh: false,
      prop: [],
      isShowDuyetCauThanh: false,
      isXacNhanCauThanh: false,
      isShowCF: false,

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
      departmemntKhoTinhCheYenSon: [],
      departmemntTinhCheYenSon: [],
      departmemntToSonYenSon: [],
      departmemntDongGoiYenSon: [],
      departmemntKhoThanhPhamYenSon: [],

      departmemntLuaPhoiThaiBinh: [],
      departmemntSoCheThaiBinh: [],
      departmemntKhoSoCheThaiBinh: [],
      departmemntKhoTinhCheThaiBinh: [],
      departmemntTinhCheThaiBinh: [],
      departmemntToSonThaiBinh: [],
      departmemntDongGoiThaiBinh: [],
      departmemntKhoThanhPhamThaiBinh: [],
      dinhTuyenThuanHungAll: [],

      cbdinhtuyenTH: [],
      cbdinhtuyenYS: [],
      cbdinhtuyenTB: [],

      dinhTuyenThuanHung: [],
      dinhTuyenYenSon: [],
      dinhTuyenThaiBinh: [],

      allRoutingTemp: [],

      isShowCBDTTH: false,
      isShowCBDTYS: false,
      isShowCBDTTB: false,
      isShowTBTH: false,
      isShowTBYS: false,
      isShowTBTB: false,

      isShowHTPD: true,
      dataAllSP: [],
      page: {
        rowsPerPage: 0
        // rowsNumber: xx if getting data from a server
      },

      isShowCSM: false,
      autoExpandAll: true,
      congsuatmayTH: [],
      congsuatmayYS: [],
      congsuatmayTB: [],
      showCSM: false,

      showCBGTH: true,
      showCBGYS: true,
      showCBGTB: true,

    };
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "userInfo"]),
  },
  created() {
    this.loadData();
    this.loadDataDepartment();
  },
  methods: {
    ...mapActions("messages", ["sendNotificationMail"]),
    ...mapActions("prod",
      [
        "getPermissionInScreen",
        "getAllSanPhamduyet",
        "getAllRoutingTemp",
        "tuchoiSanPham",
        "delRoutingTemp",
        "duyetSanPham",
        "getAllDepartmetHaveCode",
        "insertDinhTuyenTemplate",
        "rejectSanPham",
        "approveSanPham",
        "pheDuyetCSM"
      ]
    ),
    async loadData() {
      const data = await this.getAllSanPhamduyet()
      this.dataAllSP = data.data
      this.allSP = data.data.filter(f => f.TRANGTHAI == "chopheduyet" || f.TRANGTHAI == "tuchoi" || f.TRANGTHAI == "pheduyet" || f.TYPE_EDIT != '')
      this.allSP.forEach(e => {
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
      this.data = this.allSP.filter(f => f.TYPE == "sanPham")
      this.allRoutingTemp = await this.getAllRoutingTemp();
      this.routingSP()
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
      this.congsuatmayTH = this.congsuatmayTH.filter(f => f.CONGSUAT != f.CONGSUAT_APPROVED)
      this.congsuatmayYS = this.congsuatmayYS.filter(f => f.CONGSUAT != f.CONGSUAT_APPROVED)
      this.congsuatmayTB = this.congsuatmayTB.filter(f => f.CONGSUAT != f.CONGSUAT_APPROVED)

      if (this.congsuatmayTH.length == 0 && this.congsuatmayYS.length == 0 && this.congsuatmayTB.length == 0) {
        this.showCSM = false
        this.isShowCSM = false
      } else {
        this.showCSM = true
      }
      if (this.congsuatmayTH.length == 0) {
        this.showCBGTH = false
      }
      if (this.congsuatmayYS.length == 0) {
        this.showCBGYS = false
      }
      if (this.congsuatmayTB.length == 0) {
        this.showCBGTB = false
      }
    },
    getCumChiTietSua(masp) {
      let data = []
      let cumchitiet = []
      cumchitiet = this.allSP.filter(f => f.TYPE == 'cumChiTiet' && f.MASP == masp)
      if (cumchitiet.length == 0) {
        return data
      } else {
        cumchitiet.forEach(e => {
          data.push({
            label: e.MASP + ':' + e.NAME + ' (' + e.HESO + ') ' + e.TrangThaiHienThi,
            children: this.getChiTiet(e.MACUMCHITIET, masp),
            idsp: e.ID,
            value: e,
            trangthai: e.TRANGTHAI,
            bold: 2
          })
        });
      }
      return data
    },
    async onShowTree(prop) {
      this.isShowHTPD = true
      this.prop = prop
      prop.expand = !prop.expand;
      this.treeData = []
      this.treeData.push({
        label: prop.row.MASP + ':' + prop.row.NAME + prop.row.TrangThaiHienThi,
        children: this.getCumChiTiet(prop.row.MASP),
        idsp: prop.row.ID,
        value: prop,
        trangthai: prop.row.TRANGTHAI,
        TrangThaiHienThi: prop.row.TrangThaiHienThi,
        bold: 1
      })
      console.log('this.treeData ')
      console.log(this.treeData)
      //set filter để 1 lần chỉ chọn đc 1 sp duy nhất
      if (prop.expand == true) {
        this.filter = prop.row.MASP
      } else {
        this.isShowCF = false
        this.filter = ''
      }
    },

    getCumChiTiet(masp) {
      let data = []
      let cumchitiet = []
      let chitietkhongcum = []
      cumchitiet = this.allSP.filter(f => f.TYPE == 'cumChiTiet' && f.MASP == masp)
      chitietkhongcum = this.allSP.filter(f => f.TYPE == 'chiTiet' && f.MASP == masp && f.MACUMCHITIET == '')
      if (cumchitiet.length == 0) {
        return data
      } else {
        cumchitiet.forEach(e => {
          data.push({
            label: e.MASP + ':' + e.NAME + ' (' + e.HESO + ') ' + e.TrangThaiHienThi,
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
            label: e.MASP + ':' + e.NAME + ' (' + e.HESO + ') ' + e.TrangThaiHienThi,
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
      chitiet = this.allSP.filter(f => f.TYPE == 'chiTiet' && f.MASP == masp && f.MACUMCHITIET == macumchitiet)
      if (chitiet.length == 0) {
        return data
      } else {
        chitiet.forEach(e => {
          data.push({
            label: e.MASP + ':' + e.NAME + ' (' + e.HESO + ') ' + e.TrangThaiHienThi,
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

    async routingSP() {
      this.allRoutingTemp = await this.getAllRoutingTemp()

      //get data to table Định tuyến nhà máy CBG Thuận Hưng :
      let arrTempCTTH = []
      if (this.allRoutingTemp != null) {
        arrTempCTTH = this.allRoutingTemp.data.filter(f => f.factoryId == 100000 && f.ITEM_ID == this.selectedSP)
        arrTempCTTH.sort((a, b) => a.ORDER - b.ORDER);
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
        arrTempCTYS = this.allRoutingTemp.data.filter(f => f.factoryId == 102340 && f.ITEM_ID == this.selectedSP)
        arrTempCTYS.sort((a, b) => a.ORDER - b.ORDER);
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
        arrTempCTTB = this.allRoutingTemp.data.filter(f => f.factoryId == 102366 && f.ITEM_ID == this.selectedSP)
        arrTempCTTB.sort((a, b) => a.ORDER - b.ORDER);
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
      //set is Show cb and table
      if (this.cbdinhtuyenTH.length != 0) {
        this.isShowCBDTTH = true;
      } else {
        this.isShowCBDTTH = false;
      }
      if (this.cbdinhtuyenYS.length != 0) {
        this.isShowCBDTYS = true;
      } else {
        this.isShowCBDTYS = false;
      }
      if (this.cbdinhtuyenTB.length != 0) {
        this.isShowCBDTTB = true;
      } else {
        this.isShowCBDTTB = false;
      }
      if (this.dinhTuyenThuanHung.length != 0) {
        this.isShowTBTH = true;
      } else {
        this.isShowTBTH = false;
      }
      if (this.dinhTuyenYenSon.length != 0) {
        this.isShowTBYS = true;
      } else {
        this.isShowTBYS = false;
      }
      if (this.dinhTuyenThaiBinh.length != 0) {
        this.isShowTBTB = true;
      } else {
        this.isShowTBTB = false;
      }
      //set name sản phẩm được chọn
      this.selectedSPName = this.allSP.filter(f => f.ID == this.selectedSP)
      //show confirm button
      if (this.selectedSP != null) {
        if (this.selectedSP.length != 0) {
          this.isShowCF = true
        }
      } else {
        this.isShowCF = false
      }
    },
    async pheDuyetDinhTuyen() {

    },
    tuChoiCauThanh() {
      this.isShowHuyCauThanh = true;
    },
    hideDialogHuyCauThanh() {
      this.isShowHuyCauThanh = false;
    },
    async tuChoi(spSelected) {
      let payload = []
      payload.push({
        id: this.selectedSP
      })
      const data = await this.tuchoiSanPham(payload)
      if (data.meta.success) {
        this.$q.notify({
          color: 'positive',
          message: 'Thành công !!!'
        })
        await this.addDinhTuyenTam()
        await this.loadData()
        this.treeData = []
        if (spSelected[0].TYPE == "sanPham") {
          this.treeData.push({
            label: this.prop.row.MASP + ':' + this.prop.row.NAME + '(Từ chối)',
            children: this.getCumChiTiet(this.prop.row.MASP),
            idsp: this.prop.row.ID,
            value: this.prop,
            trangthai: 'tuchoi',
            TrangThaiHienThi: '(Từ chối)',
            bold: 1
          })
        } else {
          this.treeData.push({
            label: this.prop.row.MASP + ':' + this.prop.row.NAME + this.prop.row.TrangThaiHienThi,
            children: this.getCumChiTiet(this.prop.row.MASP),
            idsp: this.prop.row.ID,
            value: this.prop,
            trangthai: this.prop.row.TRANGTHAI,
            TrangThaiHienThi: '',
            bold: 1
          })
        }
        this.isShowHuyCauThanh = false
      }
    },
    async pheDuyet(spSelected) {
      let payload = []
      payload.push({
        id: this.selectedSP
      })
      const data = await this.duyetSanPham(payload)
      if (data.meta.success) {
        this.$q.notify({
          color: 'positive',
          message: 'Thành công !!!'
        })
        await this.addDinhTuyenTam()
        await this.loadData()
        this.treeData = []
        if (spSelected[0].TYPE == "sanPham") {
          this.treeData.push({
            label: this.prop.row.MASP + ':' + this.prop.row.NAME + '(Đồng ý)',
            children: this.getCumChiTiet(this.prop.row.MASP),
            idsp: this.prop.row.ID,
            value: this.prop,
            trangthai: 'pheduyet',
            TrangThaiHienThi: '(Đồng ý)',
            bold: 1
          })
        } else {
          this.treeData.push({
            label: this.prop.row.MASP + ':' + this.prop.row.NAME + this.prop.row.TrangThaiHienThi,
            children: this.getCumChiTiet(this.prop.row.MASP),
            idsp: this.prop.row.ID,
            value: this.prop,
            trangthai: this.prop.row.TRANGTHAI,
            TrangThaiHienThi: '',
            bold: 1
          })
        }
        console.log('this.treeData')
        console.log(this.treeData)

        this.isShowDuyetCauThanh = false
      }
    },
    async delSPTEMP() {
      if (this.selectedSP.length != 0) {
        let spSelected = this.allSP.filter(f => f.ID == this.selectedSP)
        if (spSelected[0].TYPE == "sanPham") {
          let CheckSP = 0;
          this.allSP.forEach(e => {
            if (e.MASP == spSelected[0].MASP && e.TRANGTHAI == "chopheduyet") {
              CheckSP++;
            }
          });
          if (CheckSP > 1) {
            this.$q.notify({
              color: "negative",
              message: "Vui lòng phê duyệt hết cụm/chi tiết của sản phẩm !!!"
            })
          } else {
            this.tuChoi(spSelected)
          }
        } else if (spSelected[0].TYPE == "cumChiTiet") {
          let CheckCum = 0;
          this.allSP.forEach(e => {
            if (e.MASP == spSelected[0].MASP && e.MACUMCHITIET == spSelected[0].MACUMCHITIET && e.TRANGTHAI == "chopheduyet" && e.TYPE != 'sanPham') {
              CheckCum++;
            }
          });
          if (CheckCum > 1) {
            this.$q.notify({
              color: "negative",
              message: "Vui lòng phê duyệt hết chi tiết của cụm chi tiết !!!"
            })
          } else {
            this.tuChoi(spSelected)
          }
        } else {
          this.tuChoi(spSelected)
        }
      } else {
        this.$q.notify({
          color: 'negative',
          message: 'Vui lòng chọn sảm phẩm/cụm chi tiết/chi tiết từ chối !!!'
        })
      }
    },
    async duyetSPTEMP() {
      if (this.selectedSP.length != 0) {
        let spSelected = this.allSP.filter(f => f.ID == this.selectedSP)
        if (spSelected[0].TYPE == "sanPham") {
          let CheckSP = 0;
          this.allSP.forEach(e => {
            if (e.MASP == spSelected[0].MASP && e.TRANGTHAI == "chopheduyet") {
              CheckSP++;
            }
          });
          if (CheckSP > 1) {
            this.$q.notify({
              color: "negative",
              message: "Vui lòng phê duyệt hết cụm/chi tiết của sản phẩm !!!"
            })
          } else {
            this.pheDuyet(spSelected)
          }
        } else if (spSelected[0].TYPE == "cumChiTiet") {
          // let CheckCum = 0;
          // this.allSP.forEach(e => {
          //   if (e.MASP == spSelected[0].MASP && e.MACUMCHITIET == spSelected[0].MACUMCHITIET && e.TRANGTHAI == "chopheduyet" && e.TYPE != 'sanPham') {
          //     CheckCum++;
          //   }
          // });
          // if (CheckCum > 1) {
          //   this.$q.notify({
          //     color: "negative",
          //     message: "Vui lòng phê duyệt hết chi tiết của cụm chi tiết !!!"
          //   })
          // } else {
            this.pheDuyet(spSelected)
         // }
        } else {
          this.pheDuyet(spSelected)
        }
      } else {
        this.$q.notify({
          color: 'negative',
          message: 'Vui lòng chọn sảm phẩm/cụm chi tiết/chi tiết phê duyệt !!!'
        })
      }
    },
    hideDialogDuyetCauThanh() {
      this.isShowDuyetCauThanh = false
    },
    pheDuyetCauThanh() {
      this.isShowDuyetCauThanh = true
    },
    xacnhanCauThanh() {
      this.isXacNhanCauThanh = true;
    },
    hideXacNhanCauThanh() {
      this.isXacNhanCauThanh = false
    },
    showAllTable() {
      //set is Show cb and table
      this.isShowCBDTTH = true;
      this.isShowCBDTYS = true;
      this.isShowCBDTTB = true;
      this.isShowTBTH = true;
      this.isShowTBYS = true;
      this.isShowTBTB = true;
    },
    async xacnhan() {

    },
    inputTableDinhTuyenCTTH(e) {
      e.sort((a, b) => a.GORDER - b.GORDER);
      this.dinhTuyenThuanHung = []
      for (let i = 0; i < e.length; i++) {
        this.dinhTuyenThuanHung.push({
          idsp: this.selectedSP,
          id: e[i].ID,
          name: e[i].NAME,
          code: e[i].CODE,
          thutu: i + 1
        })
      }
    },
    inputTableDinhTuyenCTYS(e) {
      e.sort((a, b) => a.GORDER - b.GORDER);
      this.dinhTuyenYenSon = []
      for (let i = 0; i < e.length; i++) {
        this.dinhTuyenYenSon.push({
          idsp: this.selectedSP,
          id: e[i].ID,
          name: e[i].NAME,
          code: e[i].CODE,
          thutu: i + 1
        })
      }
    },
    inputTableDinhTuyenCTTB(e) {
      this.dinhTuyenThaiBinh = []
      for (let i = 0; i < e.length; i++) {
        this.dinhTuyenThaiBinh.push({
          idsp: this.selectedSP,
          id: e[i].ID,
          name: e[i].NAME,
          code: e[i].CODE,
          thutu: i + 1
        })
      }
    },
    async addDinhTuyenTam() {
      //insert định tuyến tạm Thuận Hưng cho cụm chi tiết
      let payloadTH = []

      this.dinhTuyenThuanHung.forEach(e => {
        payloadTH.push({
          idsp: this.selectedSP,
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
        await this.insertDinhTuyenTemplate(payloadTH)
      } else {
        payloadTH.push({
          idsp: this.selectedSP,
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
      //insert định tuyến tạm Yên Sơn cho chi tiết
      let payloadYS = []
      this.dinhTuyenYenSon.forEach(e => {
        payloadYS.push({
          idsp: this.selectedSP,
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
        await this.insertDinhTuyenTemplate(payloadYS)
      }
      else {
        payloadYS.push({
          idsp: this.selectedSP,
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
      this.dinhTuyenThaiBinh.forEach(e => {
        payloadTB.push({
          idsp: this.selectedSP,
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
        await this.insertDinhTuyenTemplate(payloadTB)
      } else {
        payloadTB.push({
          idsp: this.selectedSP,
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
    },
    async xacnhanCauTrucSP() {
      const approveSP = this.allSP.filter(f => f.MASP == this.prop.row.MASP && (f.TRANGTHAI == "pheduyet" || f.TRANGTHAI == "approve"))
      const rejectSP = this.allSP.filter(f => f.MASP == this.prop.row.MASP && f.TRANGTHAI == "tuchoi")
      const count = (this.allSP.filter(f => f.MASP == this.prop.row.MASP)).length
      let approveRouting = []
      let rejectRouting = []
      approveSP.forEach(e => {
        this.allRoutingTemp.data.forEach(el => {
          if (e.ID == el.ITEM_ID) {
            approveRouting.push({
              routingTempID: el.ID
            }
            )
          }
        });
      });
      rejectSP.forEach(e => {
        this.allRoutingTemp.data.forEach(el => {
          if (e.ID == el.ITEM_ID) {
            rejectRouting.push({
              routingTempID: el.ID
            }
            )
          }
        });
      });
      if (count > (approveSP.length + rejectSP.length)) {
        this.$q.notify({
          color: 'negative',
          message: 'Phê duyệt hết các chi tiết trước khi gửi hoàn thành phê duyệt !!!'
        })
      } else {
        if (rejectSP.length != 0) {
          rejectSP.forEach(e => {
            this.rejectSanPham(e.ID)
          });
        } else {
          this.$q.notify({
            color: 'positive',
            message: 'Approve sản phẩm'
          })
        }
        //chưa update vào bảng chính routing (hỏi lại ý kiến sau)
        if (approveSP.length != 0) {
          let payloadApproveSP = []
          approveSP.forEach(e => {
            payloadApproveSP.push(e)
          });
          let dataar = await this.approveSanPham(payloadApproveSP)
          if (dataar.meta.success) {
            this.$q.notify({
              color: 'positive',
              message: 'approve thành công'
            })
            this.sendMailPheDuyet('nhanadam95@gmail.com', 100400)
          }
        } else {
          this.sendMailHuyPheDuyet('nhanadam95@gmail.com', 100400)
          this.$q.notify({
            color: 'positive',
            message: 'Reject sản phẩm'
          })
        }
        this.isShowCF = false;
        this.filter = '';
        this.loadData();
        this.loadDataDepartment();
        this.isShowHTPD = !this.isShowHTPD
        this.isShowCBDTTH = false
        this.isShowCBDTYS = false
        this.isShowCBDTTB = false
        this.isShowTBTH = false
        this.isShowTBYS = false
        this.isShowTBTB = false
        window.location.reload()
      }
    },
    async sendMailPheDuyet(mail, accountId) {
      let baseUrl = null;
      if (process.env.PROD) {
        baseUrl = `https://app.woodsland.com.vn:2002/#/khai-bao-sp`;
      } else {
        baseUrl = `http://localhost:5000/#/khai-bao-sp`;
      }
      let payloadMail = {
        baseUrl: baseUrl,
        email: mail,
        accountId: this.userInfo.id,
        toAccountId: accountId,
        subject: `Sản phẩm đã hoàn thành phê duyệt`,
        title: "Nhấp vào đây để tạo sản phẩm mới",
        dataBody: `Sản phẩm được phê duyệt bởi ${this.userInfo.lastName}. Mời bạn vào xem chi tiết`,
      };
      await this.sendNotificationMail(payloadMail);
    },
    async sendMailHuyPheDuyet(mail, accountId) {
      let baseUrl = null;
      if (process.env.PROD) {
        baseUrl = `https://app.woodsland.com.vn:2002/#/khai-bao-sp`;
      } else {
        baseUrl = `http://localhost:5000/#/khai-bao-sp`;
      }
      let payloadMail = {
        baseUrl: baseUrl,
        email: mail,
        accountId: this.userInfo.id,
        toAccountId: accountId,
        subject: `Sản phẩm đã từ chối phê duyệt phê duyệt`,
        title: "Nhấp vào đây để tạo sản phẩm mới",
        dataBody: `Sản phẩm bị từ chối phê duyệt bởi ${this.userInfo.lastName}. Mời bạn vào xem chi tiết`,
      };
      await this.sendNotificationMail(payloadMail);
    },
    async saveDinhTuyen(row) {
    },
    showDialogCSM() {
      this.isShowCSM = !this.isShowCSM
    },
    async duyetCSM() {
      let payload = []
      this.congsuatmayTH.forEach(e => {
        payload.push({
          NAME: e.NAME,
          code: e.code,
          ID: e.ID,
          CONGSUAT: e.CONGSUAT,
          CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
          TRANGTHAI: 'guipheduyet'
        })
      });
      this.congsuatmayYS.forEach(e => {
        payload.push({
          NAME: e.NAME,
          code: e.code,
          ID: e.ID,
          CONGSUAT: e.CONGSUAT,
          CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
          TRANGTHAI: 'guipheduyet'
        })
      });
      this.congsuatmayTB.forEach(e => {
        payload.push({
          NAME: e.NAME,
          code: e.code,
          ID: e.ID,
          CONGSUAT: e.CONGSUAT,
          CONGSUAT_APPROVED: e.CONGSUAT_APPROVED,
          TRANGTHAI: 'guipheduyet'
        })
      });
      payload.forEach(element => {
        if (element.CONGSUAT == null || element.CONGSUAT == '') {
          element.CONGSUAT = 0
        }
      });
      const data = await this.pheDuyetCSM(payload)
      if (data.meta.success) {
        this.$q.notify({
          color: 'positive',
          message: 'Phê duyệt thành công !!!'
        })
        this.isDialogCSM = false
        this.isShowCSM = !this.isShowCSM
        this.loadDataDepartment()
      } else {
        this.$q.notify({
          color: 'negative',
          message: 'Phê duyệt thất bại !!!'
        })
      }
    },
    async deleteCSM(e) {
      console.log('e')
      console.log(e)

      let payload = []
      payload.push({
        ID: e.data.ID,
        CONGSUAT_APPROVED: e.data.CONGSUAT
      })
      const data = await this.pheDuyetCSM(payload)
      if (data.meta.success) {
        this.$q.notify({
          color: 'positive',
          message: 'Thành công !!!'
        })
        this.loadDataDepartment();
      } else {
        this.$q.notify({
          color: 'negative',
          message: 'Thất bại !!!'
        })
      }
    }
  }
};
</script >

<style>
.dx-datagrid-headers .dx-datagrid-table .dx-row>td {
  border-bottom: 1px solid #ddd;
  font-size: 13px;
  font-weight: bold;
}

.q-table__bottom {
  min-height: 50px;
  padding: 0px;
  font-size: 12px;
}
</style>