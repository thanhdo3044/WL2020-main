<template>
  <div class="q-pa-md q-gutter-sm">
    <div class="row" style="background-color: #daf8e1">
      <div class="col-3.5 text-blue text-bold" style="font-size: 18px">
        Khai báo thông tin cấu thành & định tuyến sản phẩm khối CBG
      </div>
    </div>
    <div class="row">
      <div class="col-6" style="padding-right: 5px">
        <q-card style="min-width: 70%">
          <div>
            <q-table :title="'Màn hình cấu thành sản phẩm: ' + productName" :data="data" :columns="columns"
              row-key="name" :filter="filter" :pagination="initialPagination">
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th auto-width />
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:top-right>
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Tìm kiếm">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td auto-width>
                    <q-btn size="sm" color="indigo" round dense @click="onShowTree(props)"
                      :icon="props.expand ? 'remove' : 'add'" />
                  </q-td>
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.value }}
                  </q-td>
                </q-tr>
                <q-tr v-show="props.expand" :props="props">
                  <q-td colspan="100%">
                    <q-tree :nodes="treeBomByID" node-key="label" @update:selected="selectedCauThanh"
                      :selected="selected" selected-color="warning" :expanded.sync="expandedKeys" default-expand-all>
                      <template v-slot:default-header="prop">
                        <div class="row items-center" v-if="prop.node.parent">
                          <div class="text-weight-bold">{{ prop.node.label }}</div>
                        </div>
                        <div class="row items-center" v-else>
                          <div>{{ prop.node.label }}</div>
                        </div>
                      </template>
                    </q-tree>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card>
        <div align="right" v-if="idSPPicked==null">
          <!-- <q-btn color="positive" glossy label="Thêm mới cấu thành" @click="showAddCauThanh = true" /> -->
        </div>
        <div align="right" v-else>
          <q-btn color="warning" glossy label="Sửa cấu thành" @click="SuaCauThanh" />
        </div>
      </div>
      <div class="col-6" style="padding-left: 5px">
        <q-card style="min-width: 70%;padding: 20px;">
          <q-table title="Định tuyến :" :data="dataDinhTuyen" :columns="columnsDinhTuyen" row-key="name"
            no-data-label="Chưa có định tuyến">
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
        <div align="right">
          <q-btn color="positive" glossy label="Sửa định tuyến" @click="SuaDinhTuyen" />
        </div>
      </div>
    </div>
    <!-- thêm cấu thành mới -->
    <q-dialog v-model="showAddCauThanh">
      <q-card style="min-width: 80%">
        <div class="row">
          <div class="col-6" style="padding-right;: 5px">
            <q-card>
              <div class="q-pa-md">
                <q-table title="Sản phẩm : " :data="dataSPCauThanhMoi" :columns="columnsSPCauThanhMoi" row-key="id"
                  selection="single" :selected.sync="selectedSPCauThanhMoi" :filter="filterSPCauThanhMoi"
                  :pagination="SPCauThanhPagination">
                  <template v-slot:top-right>
                    <q-input borderless dense debounce="300" v-model="filterSPCauThanhMoi" placeholder="Search">
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </template>
                </q-table>
              </div>
            </q-card>
          </div>
          <div class="col-6" style="padding-left: 5px">
            <q-card>
              <div class="q-pa-md">
                <q-table title="Chọn cấu thành sản phẩm : " :data="dataSPCauThanhMoi" :columns="columnsSPCauThanhMoi"
                  row-key="id" selection="multiple" :selected.sync="selectedCauThanhMoi" :filter="filterCauThanhMoi"
                  :pagination="SPCauThanhPagination">
                  <template v-slot:top-right>
                    <q-input borderless dense debounce="300" v-model="filterCauThanhMoi" placeholder="Search">
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </template>
                </q-table>
              </div>
            </q-card>
          </div>
        </div>
        <div class="q-pa-md q-gutter-sm" align="right">
          <q-btn color="positive" glossy label="Thêm hệ số" @click="ThemHeSo" />
          <q-btn color="deep-orange" glossy label="Hủy" @click="HuyHeSoCauThanhMoi" />
        </div>
      </q-card>
    </q-dialog>
    <!-- thêm hệ số cấu thành mới -->
    <q-dialog v-model="showHeSoCauThanh">
      <q-card style="min-width: 80%">
        <q-card>
          <div class="q-pa-md">
            <q-table title="Hệ số cấu thành sản phẩm : " :data="dataHeSoCauThanh" :columns="columnsHeSoCauThanh">
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="idsp">{{ props.row.idsp }}</q-td>
                  <q-td key="namesp">{{ props.row.namesp }}</q-td>
                  <q-td key="idct">{{ props.row.idct }}</q-td>
                  <q-td key="namect">{{ props.row.namect }}</q-td>
                  <q-td key="hesocauthanh">{{ props.row.hesocauthanh }}
                    <q-popup-edit v-model="props.row.hesocauthanh" title="Điền hệ số cấu thành : " buttons persistent
                      v-slot="scope">
                      <q-input type="number" v-model="scope.value" dense autofocus hint="hệ số"></q-input>
                    </q-popup-edit>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card>
        <div class="q-pa-md q-gutter-sm" align="right">
          <q-btn color="positive" glossy label="Thêm hệ số" @click="insertCauThanh" />
          <q-btn color="deep-orange" glossy label="Hủy" @click="HuyThemHeSoCauThanhMoi" />
        </div>
      </q-card>
    </q-dialog>
    <!-- sửa cấu thành sp -->
    <q-dialog v-model="showSuaCauThanh">
      <q-card style="min-width: 80%">
        <div class="row">
          <div class="col-12" style="padding-right;: 5px">
            <q-card>
              <div class="q-pa-md">
                <label>Cấu thành hiện tại</label>
                <q-tree :nodes="treeBomByID" node-key="label" :expanded.sync="expandedKeys"
                  :selected.sync="selectedCauThanhEdit" @update:selected="selectedEditCauThanh"
                  selected-color="warning">
                  <template v-slot:default-header="prop">
                    <div class="row items-center" v-if="prop.node.parent">
                      <div class="text-weight-bold">{{ prop.node.label }}</div>
                    </div>
                    <div class="row items-center" v-else>
                      <div>{{ prop.node.label }}</div>
                    </div>
                  </template>
                </q-tree>
              </div>
            </q-card>
          </div>
        </div>
        <div class="q-pa-md q-gutter-sm" align="right">
          <!-- <q-btn color="positive" glossy label="Sửa" @click="ThemHeSoCauThanhMoi" /> -->
          <q-btn color="primary" glossy label="Thêm" @click="Them" />
          <q-btn color="amber" glossy label="Sửa" @click="Sua" />
          <q-btn color="deep-orange" glossy label="xóa" @click="Xoa" />
          <q-btn outline style="color: goldenrod;" label="Hủy" @click="HuyCauThanhMoi" />
        </div>
      </q-card>
    </q-dialog>
    <!-- sửa định tuyến -->
    <q-dialog v-model="showSuaDinhTuyen">
      <q-card>
        <div class="row">
          <div class="col-12" style="padding-right;: 5px">
            <q-card>
              <div class="q-pa-md">
                <label>Định tuyến hiện tại</label>
                <q-tree :nodes="treeRouByID" default-expand-all node-key="label" selected-color="warning"
                  :selected.sync="selectedRouTree" />
              </div>
            </q-card>
          </div>
        </div>
        <div class="q-pa-md q-gutter-sm" align="right">
          <!-- <q-btn color="positive" glossy label="Thứ tự định tuyến" @click="ThemThuTuDinhTuyen" />
          <q-btn color="deep-orange" glossy label="Hủy" @click="HuySuaDinhTuyen" /> -->
          <q-btn color="primary" glossy label="Thêm" @click="themRou" />
          <q-btn color="amber" glossy label="Sửa" @click="suaRou" />
          <q-btn color="deep-orange" glossy label="xóa" @click="xoaRou" />
          <q-btn outline style="color: goldenrod;" label="Hủy" @click="HuySuaDinhTuyen" />
        </div>
      </q-card>
    </q-dialog>
    <!-- thêm thứ tự định tuyến -->
    <q-dialog v-model="showThuTuDinhTuyen">
      <q-card style="min-width: 80%">
        <q-card>
          <div class="q-pa-md">
            <q-table title="Thứ tự định tuyến : " :data="dataThuTuDinhTuyen" :columns="columnsThuTuDinhTuyen">
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="id">{{ props.row.id }}</q-td>
                  <q-td key="name">{{ props.row.name }}</q-td>
                  <q-td key="maso">{{ props.row.maso }}</q-td>
                  <q-td key="thutudinhtuyen">{{ props.row.thutudinhtuyen }}
                    <q-popup-edit v-model="props.row.thutudinhtuyen" title="Điền thứ tự định tuyến : " buttons
                      persistent v-slot="scope">
                      <q-input type="number" v-model="scope.value" dense autofocus hint="hệ số"></q-input>
                    </q-popup-edit>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card>
        <div class="q-pa-md q-gutter-sm" align="right">
          <q-btn color="positive" glossy label="Thêm định tuyến" @click="insertDinhTuyen" />
          <q-btn color="deep-orange" glossy label="Hủy" @click="HuyShowThuTuDinhTuyen" />
        </div>
      </q-card>
    </q-dialog>
    <!-- thêm -->
    <q-dialog v-model="showThem">
      <q-card style="min-width: 80%">
        <q-card>
          <div class="q-pa-md">
            <q-table :title="'Thêm cấu thành sản phẩm: ' + selectedProductName" :data="dataThemCauThanh"
              :columns="columnsThemCauThanh" :filter="filterThemCauThanh" selection="multiple"
              :selected.sync="selectedThemCauThanh">
              <template v-slot:top-right>
                <q-input borderless dense debounce="300" v-model="filterThemCauThanh" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>
            </q-table>
          </div>
        </q-card>
        <div class="q-pa-md q-gutter-sm" align="right">
          <q-btn color="positive" glossy label="Thêm hệ số" @click="gThemHeSoCauThanhMoi" />
          <q-btn color="deep-orange" glossy label="Hủy" @click="ghideThemHSCT" />
        </div>
      </q-card>
    </q-dialog>
    <!-- nhập hệ số cấu thành -->
    <q-dialog v-model="showThemHeSoCauThanh">
      <q-card style="min-width: 80%">
        <q-card>
          <div class="q-pa-md">
            <q-table :title="'Thêm hệ số sản phẩm: ' + selectedProductName" :data="dataThemHeSoCauThanh"
              :columns="columnsThemHeSoCauThanh">
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="id">{{ props.row.id }}</q-td>
                  <q-td key="name">{{ props.row.name }}</q-td>
                  <q-td key="maso">{{ props.row.maso }}</q-td>
                  <q-td key="hesocauthanh">{{ props.row.hesocauthanh }}
                    <q-popup-edit v-model="props.row.hesocauthanh" title="Hệ số cấu thành : " buttons persistent
                      v-slot="scope">
                      <q-input type="number" v-model="scope.value" dense autofocus hint="hệ số"></q-input>
                    </q-popup-edit>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card>
        <div class="q-pa-md q-gutter-sm" align="right">
          <q-btn color="positive" glossy label="Gửi phê duyệt cấu thành" @click="gThemCauThanhMoi" />
          <q-btn color="deep-orange" glossy label="Hủy" @click="hideThem" />
        </div>
      </q-card>
    </q-dialog>
    <!-- Sửa hệ số cấu thành -->
    <q-dialog v-model="showSua">
      <q-card style="min-width: 80%">
        <q-card>
          <div class="q-pa-md">
            <q-table :title="'Hệ số cấu thành sản phẩm: ' + selectedProductName" :data="dataSuaHeSoCauThanh"
              :columns="columnsSuaHeSoCauThanh">
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="id">{{ props.row.id }}</q-td>
                  <q-td key="name">{{ props.row.name }}</q-td>
                  <q-td key="hesocauthanh">{{ props.row.hesocauthanh }}
                    <q-popup-edit v-model="props.row.hesocauthanh" title="Hệ số cấu thành : " buttons persistent
                      v-slot="scope">
                      <q-input type="number" v-model="scope.value" dense autofocus hint="hệ số"></q-input>
                    </q-popup-edit>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card>
        <div class="q-pa-md q-gutter-sm" align="right">
          <q-btn color="positive" glossy label="Sửa hệ số cấu thành" @click="gSuaHeSoCauThanh" />
          <q-btn color="deep-orange" glossy label="Hủy" @click="hideSua" />
        </div>
      </q-card>
    </q-dialog>
    <!-- Xóa -->
    <q-dialog v-model="showXoa">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Bạn chắc chắn muốn xóa cấu thành : <label
              style="text-transform: uppercase;font-weight: bold;">{{selectedProductName}}</label>.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup @click="hideXoa" />
          <q-btn flat label="Xóa" color="primary" @click="xoaHeSo" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Thêm định tuyến dialog -->
    <q-dialog v-model="showThemDinhTuyen">
      <q-card style="min-width: 80%">
        <q-card>
          <q-table :title="'Thêm định tuyến: ' + idSPDinhTuyenStr" :data="dataThemDinhTuyen"
            :columns="columnsThemDinhTuyen" :filter="filterThemDinhTuyen" selection="multiple"
            :selected.sync="selectedThemDinhTuyen" row-key="id">
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="filterThemDinhTuyen" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </q-card>
        <div class="q-pa-md q-gutter-sm" align="right">
          <q-btn color="positive" glossy label="Thêm thứ tự" @click="ThemThuTuDinhTuyen" />
          <q-btn color="deep-orange" glossy label="Hủy" @click="hideThemDinhTuyen" />
        </div>
      </q-card>
    </q-dialog>
    <!-- nhập thứ tự định tuyến -->
    <q-dialog v-model="gshowThuTuDinhTuyen">
      <q-card style="min-width: 80%">
        <q-card>
          <div class="q-pa-md">
            <q-table :title="'Thứ tự định tuyến ' + idSPDinhTuyenStr" :data="dataThemThuTuDinhTuyen"
              :columns="columnsThemThuTuDinhTuyen">
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="id">{{ props.row.id }}</q-td>
                  <q-td key="maso">{{ props.row.maso }}</q-td>
                  <q-td key="name">{{ props.row.name }}</q-td>
                  <q-td key="thutu">{{ props.row.thutu }}
                    <q-popup-edit v-model="props.row.thutu" title="Thứ tự định tuyến : " buttons persistent
                      v-slot="scope">
                      <q-input type="number" v-model="scope.value" dense autofocus hint="Thứ tự"></q-input>
                    </q-popup-edit>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card>
        <div class="q-pa-md q-gutter-sm" align="right">
          <q-btn color="positive" glossy label="Thêm định tuyến" @click="gThemDinhTuyenMoi" />
          <q-btn color="deep-orange" glossy label="Hủy" @click="hideThuTuDinhTuyen" />
        </div>
      </q-card>
    </q-dialog>
    <!-- Sửa thứ tự định tuyến -->
    <q-dialog v-model="showSuaRou">
      <q-card style="min-width: 80%">
        <q-card>
          <div class="q-pa-md">
            <q-table :title="'thứ tự định tuyến: ' + idSPDinhTuyenStr" :data="dataSuaThuTuDinhTuyen"
              :columns="columnsThuTuDinhTuyen">
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="id">{{ props.row.id }}</q-td>
                  <q-td key="name">{{ props.row.name }}</q-td>
                  <q-td key="order">{{ props.row.order }}
                    <q-popup-edit v-model="props.row.order" title="Hệ số cấu thành : " buttons persistent
                      v-slot="scope">
                      <q-input type="number" v-model="scope.value" dense autofocus hint="Thứ tự"></q-input>
                    </q-popup-edit>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card>
        <div class="q-pa-md q-gutter-sm" align="right">
          <q-btn color="positive" glossy label="Sửa thứ tự định tuyến" @click="gSuaThuTuDinhTuyen" />
          <q-btn color="deep-orange" glossy label="Hủy" @click="hideSuaRou" />
        </div>
      </q-card>
    </q-dialog>
    <!-- Xóa định tuyến-->
    <q-dialog v-model="showXoaRou">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Bạn chắc chắn muốn xóa định tuyến : <label
              style="text-transform: uppercase;font-weight: bold;">{{selectedRouTree}}</label>.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup @click="hideXoaRou" />
          <q-btn flat label="Xóa" color="primary" @click="xoaCFRou" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {

  data() {
    return {
      columns: [
        { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
        { name: 'maso', align: 'left', label: 'Mã số', field: 'maso', sortable: true },
        { name: 'name', align: 'left', label: 'Tên', field: 'name', sortable: true },
      ],
      columnsDinhTuyen: [
        { name: 'Mã số', align: 'left', label: 'Mã số', field: 'CODE', sortable: true },
        { name: 'Tên', align: 'left', label: 'Tên', field: 'NAME', sortable: true },
        { name: 'Thứ tự', align: 'left', label: 'Thứ tự', field: 'ORDER', sortable: true },
      ],
      columnsSPCauThanhMoi: [
        { name: 'Mã số', align: 'left', label: 'Mã số', field: 'maso', sortable: true },
        { name: 'Tên', align: 'left', label: 'Tên', field: 'name', sortable: true },
        { name: 'ID', align: 'left', label: 'ID', field: 'id', sortable: true },
      ],
      columnsHeSoCauThanh: [
        { name: 'ID sản phẩm', align: 'left', label: 'ID sản phẩm', field: 'idsp' },
        { name: 'Tên sản phẩm', align: 'left', label: 'Tên sản phẩm', field: 'namesp' },
        { name: 'ID cấu thành', align: 'left', label: 'ID cấu thành', field: 'idct' },
        { name: 'Tên sản phẩm cấu thành', align: 'left', label: 'Tên sản phẩm cấu thành', field: 'namect' },
        { name: 'Hệ số cấu thành', align: 'left', label: 'Hệ số cấu thành', field: 'hesocauthanh' },

      ],
      columnsSuaCauThanh: [
        { name: 'ID sản phẩm', align: 'left', label: 'ID sản phẩm', field: 'idsp' },
        { name: 'Tên sản phẩm', align: 'left', label: 'Tên sản phẩm', field: 'namesp' },
        { name: 'ID cấu thành', align: 'left', label: 'ID cấu thành', field: 'idct' },
        { name: 'Tên sản phẩm cấu thành', align: 'left', label: 'Tên sản phẩm cấu thành', field: 'namect' },
        { name: 'Hệ số cấu thành', align: 'left', label: 'Hệ số cấu thành', field: 'hesocauthanh' },

      ],
      columnsAllDinhTuyen: [
        { name: 'ID định tuyến', align: 'left', label: 'ID định tuyến', field: 'id' },
        { name: 'Tên định tuyến', align: 'left', label: 'Tên định tuyến', field: 'name' },
        { name: 'Mã số', align: 'left', label: 'Mã số', field: 'maso' },
      ],
      columnsThuTuDinhTuyen: [
        { name: 'ID định tuyến', align: 'left', label: 'ID định tuyến', field: 'id' },
        { name: 'Tên định tuyến', align: 'left', label: 'Tên định tuyến', field: 'name' },
        { name: 'Mã số', align: 'left', label: 'Mã số', field: 'maso' },
        { name: 'Thứ tự định tuyến', align: 'left', label: 'Thứ tự định tuyến', field: 'thutudinhtuyen' },
      ],
      columnsThemCauThanh: [
        { name: 'ID cấu thành', align: 'left', label: 'ID cấu thành', field: 'id' },
        { name: 'Tên cấu thành', align: 'left', label: 'Tên cấu thành', field: 'name' },
        { name: 'Mã số', align: 'left', label: 'Mã số', field: 'maso' },
      ],
      columnsThemHeSoCauThanh: [
        { name: 'ID cấu thành', align: 'left', label: 'ID cấu thành', field: 'id' },
        { name: 'Tên cấu thành', align: 'left', label: 'Tên cấu thành', field: 'name' },
        { name: 'Mã số', align: 'left', label: 'Mã số', field: 'maso' },
        { name: 'Hệ số', align: 'left', label: 'Hệ số', field: 'hesocauthanh' },
      ],
      columnsSuaHeSoCauThanh: [
        { name: 'ID cấu thành', align: 'left', label: 'ID cấu thành', field: 'id' },
        { name: 'Tên cấu thành', align: 'left', label: 'Tên cấu thành', field: 'name' },
        { name: 'Hệ số', align: 'left', label: 'Hệ số', field: 'hesocauthanh' },
      ],
      columnsThemDinhTuyen: [
        { name: 'ID', align: 'left', label: 'ID', field: 'id' },
        { name: 'Mã số', align: 'left', label: 'Mã số', field: 'maso' },
        { name: 'Tên định tuyến', align: 'left', label: 'Tên định tuyến', field: 'name' },
      ],
      columnsThemThuTuDinhTuyen: [
        { name: 'ID', align: 'left', label: 'ID', field: 'id' },
        { name: 'Mã số', align: 'left', label: 'Mã số', field: 'maso' },
        { name: 'Tên định tuyến', align: 'left', label: 'Tên định tuyến', field: 'name' },
        { name: 'Thứ tự định tuyến', align: 'left', label: 'Thứ tự định tuyến', field: 'thutu' },
      ],
      columnsThuTuDinhTuyen: [
        { name: 'ID', align: 'left', label: 'ID', field: 'id' },
        { name: 'Tên định tuyến', align: 'left', label: 'Tên định tuyến', field: 'name' },
        { name: 'Thứ tự định tuyến', align: 'left', label: 'Thứ tự định tuyến', field: 'order' },
      ],
      dataDinhTuyen: [],
      data: [],
      treeBomByID: [],
      allBom: [],
      filter: '',
      filterSPCauThanhMoi: '',
      filterCauThanhMoi: '',
      productName: '',
      selected: [],
      count: 0,
      expandedKeys: [],
      initialPagination: {
        sortBy: 'desc',
        descending: false,
        page: 2,
        rowsPerPage: 14
      },
      SPCauThanhPagination: {
        sortBy: 'desc',
        descending: false,
        page: 2,
        rowsPerPage: 10
      },
      HeSoCauThanhPagination: {
        rowsPerPage: 10
      },
      AllDinhTuyenPagination: {
        rowsPerPage: 10
      },
      showAddCauThanh: false,
      dataSPCauThanhMoi: [],
      selectedSPCauThanhMoi: [],
      selectedCauThanhMoi: [],
      showHeSoCauThanh: false,
      dataHeSoCauThanh: [],
      idSPPicked: null,
      showSuaCauThanh: false,
      dataSuaCauThanh: [],
      selectedItemID: null,
      showSuaDinhTuyen: false,
      treeRouByID: [],
      dataAllDinhTuyen: [],
      filterAllDinhTuyen: '',
      selectedAllDinhTuyen: [],
      showThuTuDinhTuyen: false,
      dataThuTuDinhTuyen: [],
      selectedSPBOM: [],
      showThem: false,
      dataThemCauThanh: [],
      arrCauThanh: [],
      idBomParent: [],
      idBomChild: [],
      selectedCauThanhEdit: [],
      selectedProductName: '',
      filterThemCauThanh: '',
      selectedThemCauThanh: [],
      showThemHeSoCauThanh: false,
      dataThemHeSoCauThanh: [],
      showSua: false,
      dataSuaHeSoCauThanh: [],
      showXoa: false,
      selectedRouTree: [],
      idSPDinhTuyenStr: '',
      showThemDinhTuyen: false,
      dataThemDinhTuyen: [],
      selectedThemDinhTuyen: [],
      filterThemDinhTuyen: '',
      dataThemThuTuDinhTuyen: [],
      showThuTuDinhTuyen: false,
      gshowThuTuDinhTuyen: false,
      showSuaRou: false,
      dataSuaThuTuDinhTuyen: [],
      showXoaRou: false
    }
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("prod",
      [
        "g_tree_GetBom",
        "g_tree_GetItemInBom",
        "getRoutingByItemID",
        "getAllItem",
        "insertBom",
        "getDepartment",
        "insertRou",
        "g_insertBomTemp",
        "updateHeSoCauThanh",
        "gdeleteBom",
        "g_insertRou",
        "updateThuTuDinhTuyen",
        "gdeleteRou"
      ]),
    async loadData() {
      const data = await this.g_tree_GetItemInBom();
      this.data = []
      data.data.forEach(e => {
        this.data.push(
          {
            id: e.ID,
            name: e.NAME,
            maso: e.CODE,
            heso: '',
            expand: false,
          },
        )
      });
      const dataAllbom = await this.g_tree_GetBom();
      this.allBom = dataAllbom.data;
      const dataAllItems = await this.getAllItem();
      dataAllItems.forEach(e => {
        this.dataSPCauThanhMoi.push(
          {
            id: e.ID,
            name: e.NAME,
            maso: e.CODE,
          },
        )
      });
      const dataDinhTuyen = await this.getDepartment()
      dataDinhTuyen.forEach(e => {
        this.dataAllDinhTuyen.push(
          {
            id: e.ID,
            name: e.NAME,
            maso: e.CODE,
          },
        )
      });
    },
    getChil(itemID) {
      let child = this.allBom.filter(bom => itemID == bom.ITEM_ID)
      let data = []
      if (child.length == 1) {
        data.push({
          label: child[0].MATERIALS_ID + ':' + child[0].ID + ': ' + child[0].MATERIALS_NAME + ' (' + child[0].RATE + ')',
        })
      } else {
        child.forEach(e => {
          data.push({
            label: e.MATERIALS_ID + ':' + e.ID + ': ' + e.MATERIALS_NAME + ' (' + e.RATE + ')',
            children: this.getChil(e.MATERIALS_ID),
            materialID: e.MATERIALS_ID
          })
        });
      }
      data.forEach(e => {
        this.expandedKeys.push(e.label)
      });
      return data
    },
    async onShowTree(prop) {
      this.indexOfTable = prop.rowIndex;
      this.showTree = !this.showTree
      this.expandedKeys = [];
      this.productName = prop.row.name
      if (prop.expand == false) {
        this.filter = prop.row.id.toString()
        this.idSPPicked = prop.row.id
      } else {
        this.filter = '';
        this.productName = '';
        this.idSPPicked = null
        this.dataDinhTuyen = []
      }
      prop.expand = !prop.expand;
      this.treeBomByID = [];
      this.treeBomByID.push({
        label: prop.row.id + ':' + prop.row.name,
        children: this.getChil(prop.row.id),
        itemID: prop.row.id,
        parent: true
      });
      this.treeBomByID.forEach(e => {
        this.expandedKeys.push(e.label)
      });
    },
    async selectedCauThanh(e) {
      this.selected = e;
      let itemID = e.slice(0, e.indexOf(":"))
      let itemName = e.slice(e.indexOf(":"))
      this.selectedItemID = itemID
      const payload = {
        itemID: itemID
      };
      const data = await this.getRoutingByItemID(payload);
      this.dataDinhTuyen = data
      this.treeRouByID = []
      let child = []
      this.dataDinhTuyen.forEach(el => {
        child.push({
          label: el.rID + ': ' + el.NAME + ' (' + el.ORDER + ')',
          id: el.rID,
          stepID:el.STEP_ID,
          order: el.ORDER,
          name: el.NAME
        })
      });
      this.treeRouByID.push({
        label: e,
        children: child,
      })
    },

    ThemHeSoCauThanhMoi() {
      this.showHeSoCauThanh = true;
      this.dataHeSoCauThanh = [];
      if (this.idSPPicked == null) {
        this.idSPPicked = this.selectedSPCauThanhMoi[0].id
        this.productName = this.selectedSPCauThanhMoi[0].name
      }

      this.selectedCauThanhMoi.forEach(e => {
        this.dataHeSoCauThanh.push({
          idsp: this.idSPPicked,
          namesp: this.productName,
          idct: e.id,
          namect: e.name,
          hesocauthanh: ''
        })
      });
      this.idSPPicked = null;
    },
    async insertCauThanh() {

      let payload = [];
      this.dataHeSoCauThanh.forEach(e => {
        payload.push({
          idSanPham: this.selectedItemID,
          idCauThanh: e.idct,
          heso: e.hesocauthanh,
          createBy: this.userInfo.id
        })
      });
      let checkHeSo = payload.filter(e => e.heso <= 0 || e.heso == null);
      if (checkHeSo.length == 0) {
        const data = await this.insertBom(payload);
        if (data.meta.success) {
          this.showAddCauThanh = false
          this.showHeSoCauThanh = false
          this.showSuaCauThanh = false
          this.loadData()
          // this.listBom = await this.getBom();
          this.selectedSPCauThanhMoi = []
          this.selectedCauThanhMoi = []
          this.$q.notify({
            message: 'Gửi phê duyệt thành công',
            type: 'positive',
          })
        } else {
          this.$q.notify({
            message: 'Không thành công',
            type: 'negative',
          })
        }
      }
      else
        this.$q.notify({
          message: 'Hệ số lớn hơn 0',
          icon: 'announcement'
        })
    },
    HuyHeSoCauThanhMoi() {
      this.selectedSPCauThanhMoi = []
      this.selectedCauThanhMoi = []
      this.showAddCauThanh = false
    },
    SuaCauThanh() {
      this.showSuaCauThanh = true
    },
    updateCauThanh() {
      console.log("sua cau thanh")
    },
    HuyCauThanhMoi() {
      this.selectedCauThanhMoi = []
      this.selectedCauThanhEdit = []
      this.showSuaCauThanh = false
    },
    HuyThemHeSoCauThanhMoi() {
      this.showHeSoCauThanh = false
      // this.idSPPicked = 1
    },
    async SuaDinhTuyen() {
      this.showSuaDinhTuyen = true
      this.idSPDinhTuyenStr = this.treeRouByID[0].label
      this.dataThemDinhTuyen = []
      const data = await this.getDepartment()
      data.forEach(e => {
        this.dataThemDinhTuyen.push({
          id: e.ID,
          maso: e.CODE,
          name: e.NAME,
          thutu: null
        })
      });
    },
    HuySuaDinhTuyen() {
      this.showSuaDinhTuyen = false
      this.selectedAllDinhTuyen = []
    },
    ThemThuTuDinhTuyen() {
      this.gshowThuTuDinhTuyen = true
      this.dataThemThuTuDinhTuyen = []
      const data = this.selectedThemDinhTuyen
      data.forEach(e => {
        this.dataThemThuTuDinhTuyen.push({
          id: e.id,
          maso: e.maso,
          name: e.name,
          // thutu: e.thutu
        })
      });
      console.log(' this.selectedThemDinhTuyen')
      console.log(data)


      // this.dataThemThuTuDinhTuyen = this.
    },
    HuyShowThuTuDinhTuyen() {
      this.showThuTuDinhTuyen = false
    },
    async insertDinhTuyen() {
      let payload = []
      this.dataThuTuDinhTuyen.forEach(e => {
        payload.push({
          itemID: this.selectedItemID,
          stepID: e.id,
          order: e.thutudinhtuyen,
          createBy: this.userInfo.id
        })
      });
      let checkHeSo = payload.filter(e => e.order <= 0);
      if (checkHeSo.length == 0) {
        const data = await this.insertRou(payload);
        if (data.meta.success) {
          this.showThuTuDinhTuyen = false
          this.showSuaDinhTuyen = false
          const payload = {
            itemID: this.selectedItemID
          };
          const data = await this.getRoutingByItemID(payload);
          this.dataDinhTuyen = data
          this.$q.notify({
            message: 'Gửi phê duyệt thành công',
            type: 'positive',
          })
        } else {
          this.$q.notify({
            message: 'Không thành công',
            type: 'negative',
          })
        }
      }
      else {
        this.$q.notify({
          message: 'Nhập hệ số lớn hơn 0 !',
          type: 'warning',
        })
      }
    },
    updateBomselected(e) {
      // console.log(e)
    },
    async Them() {
      this.showThem = true
      this.dataThemCauThanh = []
      const data = await this.getAllItem()
      data.forEach(e => {
        this.dataThemCauThanh.push({
          id: e.ID,
          name: e.NAME,
          maso: e.CODE,
          hesocauthanh: '',
        })
      });
    },
    getIDFromString(str) {
      let int = str.slice(0, e.indexOf(":"))
      return
    },
    hideThemHSCT() {
      this.showThem = false
    },
    selectedEditCauThanh(e) {
      this.selectedProductName = e
    },
    ThemHeSo() {
      this.showThemHeSoCauThanh = true
      this.dataThemHeSoCauThanh = []
      this.selectedThemCauThanh.forEach(e => {
        this.dataThemHeSoCauThanh.push({
          id: e.ID,
          name: e.NAME,
          maso: e.CODE,
        })
      });
    },
    gThemHeSoCauThanhMoi() {
      this.showThemHeSoCauThanh = true
      this.dataThemHeSoCauThanh = []
      this.selectedThemCauThanh.forEach(e => {
        this.dataThemHeSoCauThanh.push({
          id: e.id,
          name: e.name,
          maso: e.maso,
          hesocauthanh: null,
        })
      });

    },
    ghideThemHSCT() {
      this.showThem = false
      this.selectedThemCauThanh = []
    },
    hideThem() {
      this.showThemHeSoCauThanh = false
    },
    async gThemCauThanhMoi() {
      let parentID = parseInt(this.selectedProductName.slice(0, this.selectedProductName.indexOf(":")))
      let payload = [];
      this.dataThemHeSoCauThanh.forEach(e => {
        payload.push({
          idSanPham: parentID,
          idCauThanh: e.id,
          heso: e.hesocauthanh,
          createBy: this.userInfo.id
        })
      });
      let treeBomParent = parseInt(this.treeBomByID[0].label.slice(0, this.treeBomByID[0].label.indexOf(":")))
      let treeBomParentLable = this.treeBomByID[0].label
      let checkHeSo = payload.filter(e => e.heso <= 0 || e.heso == null);
      if (checkHeSo.length == 0) {
        const data = await this.g_insertBomTemp(payload);
        if (data.meta.success) {
          this.selectedThemCauThanh = []
          this.showThemHeSoCauThanh = false
          this.showThem = false
          const dataAllbom = await this.g_tree_GetBom();
          this.allBom = dataAllbom.data;
          this.treeBomByID = [];
          this.treeBomByID.push({
            label: treeBomParentLable,
            children: this.getChil(treeBomParent),
            parent: true
          });
          this.treeBomByID.forEach(e => {
            this.expandedKeys.push(e.label)
          });
          // this.listBom = await this.getBom();
          this.selectedSPCauThanhMoi = []
          this.selectedCauThanhMoi = []
          this.$q.notify({
            message: 'Gửi phê duyệt thành công',
            type: 'positive',
          })
        } else {
          this.$q.notify({
            message: 'Không thành công',
            type: 'negative',
          })
        }
      }
      else
        this.$q.notify({
          message: 'Hệ số lớn hơn 0',
          icon: 'announcement'
        })
    },
    async Sua() {
      this.showSua = true
      this.dataSuaHeSoCauThanh = []
      let itemID = parseInt(this.selectedProductName.slice(0, this.selectedProductName.indexOf(":")))
      const data = await this.g_tree_GetBom()
      const bomById = data.data.filter(e => e.ITEM_ID == itemID)
      console.log("bomById")
      console.log(bomById)
      bomById.forEach(e => {
        this.dataSuaHeSoCauThanh.push({
          id: e.ID,
          itemID: e.ITEM_ID,
          materialID: e.MATERIALS_ID,
          name: e.MATERIALS_NAME,
          hesocauthanh: e.RATE
        })
      });
    },
    hideSua() {
      this.showSua = false
    },
    async gSuaHeSoCauThanh() {
      let treeBomParentLable = this.treeBomByID[0].label
      let treeBomParent = parseInt(this.treeBomByID[0].label.slice(0, this.treeBomByID[0].label.indexOf(":")))

      let payload = []
      console.log('this.dataSuaHeSoCauThanh')

      console.log(this.dataSuaHeSoCauThanh)
      this.dataSuaHeSoCauThanh.forEach(e => {
        payload.push({
          idSanPham: e.itemID,
          idCauThanh: e.materialID,
          heso: e.hesocauthanh,
          createBy: this.userInfo.id
        })
      });
      const data = await this.g_insertBomTemp(payload);
      if (data.meta.success) {
        this.showSua = false;
        const dataAllbom = await this.g_tree_GetBom();
        this.allBom = dataAllbom.data;
        this.treeBomByID = [];
        this.treeBomByID.push({
          label: treeBomParentLable,
          children: this.getChil(treeBomParent),
          parent: true
        });
        this.treeBomByID.forEach(e => {
          this.expandedKeys.push(e.label)
        });
        this.$q.notify({
          message: 'Gửi phê duyệt thành công',
          type: 'positive',
        })
      } else {
        this.$q.notify({
          message: 'Không thành công',
          type: 'negative',
        })
      }
    },
    Xoa() {
      this.showXoa = true
    },
    hideXoa() {
      this.showXoa = false
    },
    async xoaHeSo() {
      let treeBomParentLable = this.treeBomByID[0].label
      let treeBomParent = parseInt(this.treeBomByID[0].label.slice(0, this.treeBomByID[0].label.indexOf(":")))
      let idbom = parseInt(this.selectedProductName.slice((this.selectedProductName.indexOf(":") + 1), (this.selectedProductName.indexOf(": ") + 1)))
      let allBom = await this.g_tree_GetBom()
      let bomSelectedDel = allBom.data.filter(f => f.ID == idbom);
      let bomAfterDel = allBom.data.filter(f => f.ITEM_ID == bomSelectedDel[0].ITEM_ID && f.MATERIALS_ID != bomSelectedDel[0].MATERIALS_ID)
      let payload = []
      bomAfterDel.forEach(e => {
        payload.push({
          idSanPham: bomSelectedDel[0].ITEM_ID,
          idCauThanh: e.MATERIALS_ID,
          heso: e.RATE,
          createBy: this.userInfo.id
        })
      });
      const data = await this.g_insertBomTemp(payload)
      if (data.meta.success) {
        this.showXoa = false;

        const dataAllbom = await this.g_tree_GetBom();
        this.allBom = dataAllbom.data;
        this.treeBomByID = [];
        this.treeBomByID.push({
          label: treeBomParentLable,
          children: this.getChil(treeBomParent),
          parent: true
        });
        this.treeBomByID.forEach(e => {
          this.expandedKeys.push(e.label)
        });
        this.$q.notify({
          message: 'Gửi phê duyệt thành công',
          type: 'positive',
        })
      } else {
        this.$q.notify({
          message: 'Không thành công',
          type: 'negative',
        })
      }
    },
    themRou() {
      console.log("thêm routing")
      this.showThemDinhTuyen = true
    },
    hideThemDinhTuyen() {
      this.showThemDinhTuyen = false
    },
    hideThuTuDinhTuyen() {
      this.selectedThemDinhTuyen = []
      this.gshowThuTuDinhTuyen = false
    },

    async gThemDinhTuyenMoi() {
      let idsp = parseInt(this.idSPDinhTuyenStr.slice(0, this.idSPDinhTuyenStr.indexOf(":")))

      let payload = [];
      this.dataThemThuTuDinhTuyen.forEach(e => {
        payload.push({
          idsp: idsp,
          idDinhTuyen: e.id,
          thutu: e.thutu,
          createBy: this.userInfo.id
        })
      });

      this.treeRouByID[0].children.forEach(e => {
        payload.push({
          idsp: idsp,
          idDinhTuyen: e.stepID,
          thutu: e.order,
          createBy: this.userInfo.id
        })
      });

      let checkThuTu = payload.filter(e => e.thutu <= 0 || e.thutu == null);
      if (checkThuTu.length == 0) {
        const data = await this.g_insertRou(payload);
        if (data.meta.success) {
          this.gshowThuTuDinhTuyen = false
          this.showThemDinhTuyen = false
          const payload = {
            itemID: this.selectedItemID
          };
          const data = await this.getRoutingByItemID(payload);
          this.dataDinhTuyen = data
          this.treeRouByID = []
          let child = []
          this.dataDinhTuyen.forEach(el => {
            child.push({
              label: el.rID + ': ' + el.NAME + ' (' + el.ORDER + ')',
              id: el.rID,
              order: el.ORDER,
              name: el.NAME
            })
          });
          this.treeRouByID.push({
            label: this.idSPDinhTuyenStr,
            children: child
          })
          this.$q.notify({
            message: 'Gửi phê duyệt thành công',
            type: 'positive',
          })
        } else {
          this.$q.notify({
            message: 'Không thành công',
            type: 'negative',
          })
        }
      }
      else
        this.$q.notify({
          message: 'Thứ tự hơn 0',
          icon: 'announcement'
        })
    },
    xoaRou() {
      this.showXoaRou = true
    },
    suaRou() {
      this.showSuaRou = true

      this.dataSuaThuTuDinhTuyen = []
      console.log('this.treeRouByID')
      console.log(this.treeRouByID[0])
      this.treeRouByID[0].children.forEach(e => {
        this.dataSuaThuTuDinhTuyen.push({
          id: e.id,
          stepID: e.stepID,
          name: e.name,
          order: e.order
        })
      });
    },
    //here
    async gSuaThuTuDinhTuyen() {
      let payload = []


      this.dataSuaThuTuDinhTuyen.forEach(e => {
        payload.push({
          id: e.id,
          thutu: e.order,
          createBy: this.userInfo.id
        })
      });
      let checkThuTu = payload.filter(e => e.order <= 0 || e.order == null);
      if (checkThuTu.length == 0) {
        const data = await this.g_insertRou(payload)
        if (data.meta.success) {
          this.showSuaRou = false
          const payload = {
            itemID: this.selectedItemID
          };
          const data = await this.getRoutingByItemID(payload);
          this.dataDinhTuyen = data
          this.treeRouByID = []
          let child = []
          this.dataDinhTuyen.forEach(el => {
            child.push({
              label: el.rID + ': ' + el.NAME + ' (' + el.ORDER + ')',
              id: el.rID,
              order: el.ORDER,
              name: el.NAME
            })
          });
          this.treeRouByID.push({
            label: this.idSPDinhTuyenStr,
            children: child
          })
          this.$q.notify({
            message: 'Gửi phê duyệt thành công',
            type: 'positive',
          })
        } else {
          this.$q.notify({
            message: 'Không thành công',
            type: 'negative',
          })
        }
      }
      else
        this.$q.notify({
          message: 'Thứ tự hơn 0',
          icon: 'announcement'
        })
    },
    hideSuaRou() {
      this.showSuaRou = false
    },
    hideXoaRou() {
      this.showXoaRou = false
    },
    async xoaCFRou() {
      let idrou = parseInt(this.selectedRouTree.slice(0, (this.selectedRouTree.indexOf(":"))))

      let payload = []
      payload.push({
        idrou: idrou
      })
      const data = await this.gdeleteRou(payload)
      if (data.meta.success) {
        this.showXoaRou = false;
        const payload = {
          itemID: this.selectedItemID
        };
        console.log("payload.itemID")
        console.log(payload.itemID)
        const data = await this.getRoutingByItemID(payload);
        this.dataDinhTuyen = data
        this.treeRouByID = []
        let child = []
        this.dataDinhTuyen.forEach(el => {
          child.push({
            label: el.rID + ': ' + el.NAME + ' (' + el.ORDER + ')',
            id: el.rID,
            order: el.ORDER,
            name: el.NAME
          })
        });
        this.treeRouByID.push({
          label: this.idSPDinhTuyenStr,
          children: child
        })
        this.$q.notify({
          message: 'Gửi phê duyệt thành công',
          type: 'positive',
        })
      } else {
        this.$q.notify({
          message: 'Không thành công',
          type: 'negative',
        })
      }
    }

  },
  async created() {
    this.loadData();
  },
}
</script>
