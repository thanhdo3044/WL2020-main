<template>
  <q-page>
    <q-banner class="text-primary">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div class="text-h6 q-mt-lg">Tạo LSX khối VCN</div>
    </q-banner>

    <div class="row text-orange q-gutter-sm" style="margin: 0px">
      <q-select
        class="col-2"
        color="grey-3"
        label-color="orange"
        outlined
        label="Chọn nhà máy"
        @input="onChangeFactory"
        v-model="factoryId"
        :options="factories"
      />
      <q-select
        class="col-2"
        color="grey-3"
        label-color="orange"
        outlined
        v-model="xuong"
        :options="xuongs"
        label="Chọn Xưởng"
        @input="chonXuong"
      />
      <q-input
        class="col-2"
        color="grey-3"
        label-color="orange"
        outlined
        v-model="ngayDongGoi"
        mask="date"
        :rules="['date']"
        label="Ngày đóng gói"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="ngayDongGoi"
                @input="() => $refs.qDateProxy.hide()"
                mask="YYYY/MM/DD"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input
        class="col-2"
        color="grey-3"
        label-color="orange"
        outlined
        disable
        :value="ngayDongGoi ? moment(ngayDongGoi).format('w') : ''"
        label="Tuần"
      >
        <template v-slot:append>
          <q-icon name="next_week" color="orange" />
        </template>
      </q-input>

      <q-select
        color="grey-3"
        class="col-2"
        label-color="orange"
        outlined
        label="Chọn dòng sản phẩm"
        v-model="lineProduct"
        :options="lineProducts"
        @input="onSelectProduct"
      />
      <q-btn
        class="col-1"
        style="height: 50px; margin-left: 40px"
        :disabled="!PO.length"
        color="positive"
        label="Tạo LSX"
        @click="createPO"
      />
    </div>
    <div class="row text-orange q-gutter-sm" style="margin: -15px 0px 10px 0px">
      <q-input
        color="grey-3"
        class="col-2"
        label-color="orange"
        outlined
        v-model="soLenh"
        @input="checkDupplicate"
        label="Số lệnh"
      >
        <template v-slot:append>
          <q-icon name="work" color="orange" />
        </template>
      </q-input>

      <!-- <q-select
        style="width: 300px"
        color="grey-3"
        label-color="orange"
        outlined
        label="Chọn khách hàng"
        v-model="customer"
        :options="customers"
        dense
      /> -->
       <q-input
        color="grey-3"
        label-color="orange"
        outlined
        v-model="po1"
        label="PO"
        class="col-2"
      />
      <q-input
        color="grey-3"
        label-color="orange"
        outlined
        v-model="size"
        label="Kích thước ván thành phẩm"
        class="col-1"
      >
        <template v-slot:append>
          <q-icon name="crop_free" color="orange" />
        </template>
      </q-input>
      <q-input
        color="grey-3"
        label-color="orange"
        outlined
        class="col-1"
        v-model="sub"
        label="Dung sai âm"
      >
        <template v-slot:append>
          <q-icon name="remove_circle" color="orange" />
        </template>
      </q-input>
      <q-input
        color="grey-3"
        label-color="orange"
        class="col-1"
        outlined
        v-model="plus"
        label="Dung sai dương"
      >
        <template v-slot:append>
          <q-icon name="add_circle" color="orange" />
        </template>
      </q-input>
    
        <q-select
        color="grey-3"
        class="col-1"
        label-color="orange"
        outlined
        label="Loại sản phẩm"
        v-model="goodsType"
        :options="goodsTypes"
     
      />
        <q-input v-if="goodsType.code == 'BTP'"
        color="grey-3"
        label-color="orange"
        outlined
        v-model="dm"
        label="Hạn mức"
        class="col-1"
      />
       <q-input v-else
        color="grey-3"
        label-color="orange"
        outlined
        v-model="hm"
        label="Số lượng chưa viết lệnh"
        class="col-2"
      />
         <q-input v-if="goodsType.code == 'TP'"
        color="grey-3"
        label-color="orange"
        outlined
        v-model="tamung"
        label="tạm ứng"
        class="col-2"
      />
      <q-checkbox v-show="true" v-model="selectionBTP" label="TẠO LSX BTP" />
      <!-- <q-select
        v-if="listReject.length > 0"
        color="grey-3"
        class="col-2"
        label-color="orange"
        outlined
        label="Lệnh bị từ chối"
        @input="onSelectReject"
        v-model="reject"
        :options="listReject"
      /> -->
    </div>

    <div class="row">
      <div class="col-6">
        <q-card padding>
          <q-card-section>
            <span
              v-if="lineProduct && lineProduct.id == 'LVL'"
              class="text-subtitle1 text-weight-bold"
              >Sản phẩm trước rong</span
            >
            <span v-else class="text-subtitle1 text-weight-bold"
              >Danh mục sản phẩm</span
            >
            <DxDataGrid
              class="q-mt-sm"
              :data-source="listItems"
              :selection="{ mode: 'single' }"
              :show-borders="true"
              :hover-state-enabled="true"
              key-expr="id"
              @selection-changed="onSelectionChanged"
              @row-inserted="confirmAddStep"
              @row-updated="confirmSaveQuantity"
              @row-removed="confirmRemoveStep"
              @init-new-row="onInitNewRow"
              :show-row-lines="true"
              :show-column-lines="true"
              :allow-column-resizing="true"
              :column-resizing-mode="'widget'"
            >
              <DxPaging
                :page-size="
                  lineProduct ? (lineProduct.id == 'LVL' ? 10 : 30) : 26
                "
              />
              <DxEditing
                refresh-mode="full"
                :allow-updating="true"
                mode="cell"
              />
              <DxSearchPanel :visible="true" placeholder="Search..." />
              <DxColumn
                data-field="code"
                caption="Mã"
                :allow-sorting="false"
                :allowEditing="false"
                :width="100"
              />
              <DxColumn
                data-field="name"
                caption="Tên"
                :allowEditing="false"
                :allow-sorting="false"
                :width="320"
              />
              <DxColumn
                data-field="length"
                caption="Dài"
                :allowEditing="false"
                :allow-sorting="false"
                alignment="center"
                :width="80"
              />
              <DxColumn
                data-field="width"
                caption="Rộng"
                :allowEditing="false"
                :allow-sorting="false"
                alignment="center"
                :width="80"
              />
              <DxColumn
                data-field="height"
                caption="Dày"
                :allowEditing="false"
                :allow-sorting="false"
                alignment="center"
                :width="80"
              />
              <DxColumn
                width="120"
                data-field="quantity"
                caption="Số lượng"
                :allow-sorting="false"
                data-type="number"
              />
            </DxDataGrid>
          </q-card-section>
          <q-card-section v-if="lineProduct && lineProduct.id == 'LVL'">
            <span class="text-subtitle1 text-weight-bold"
              >Sản phẩm sau rong</span
            >

            <DxDataGrid
              :data-source="listItems2"
              :selection="{ mode: 'single' }"
              :show-borders="true"
              :hover-state-enabled="true"
              @row-updated="spSauDongupdated"
              :word-wrap-enabled="true"
              :show-row-lines="true"
              :show-column-lines="true"
              key-expr="id"
            >
              <DxPaging
                :page-size="
                  lineProduct ? (lineProduct.id == 'LVL' ? 10 : 30) : 30
                "
              />
              <DxEditing
                refresh-mode="full"
                :allow-updating="true"
                mode="cell"
              />
              <DxSearchPanel :visible="true" placeholder="Search..." />
              <DxColumn
                :width="100"
                data-field="code"
                caption="Mã"
                :allow-sorting="false"
                :allowEditing="false"
              />
              <DxColumn
                :width="320"
                data-field="name"
                caption="Tên"
                :allowEditing="false"
                :allow-sorting="false"
              />
              <DxColumn
                data-field="length"
                caption="Dài"
                :allowEditing="false"
                :allow-sorting="false"
                alignment="center"
                :width="80"
              />
              <DxColumn
                data-field="width"
                caption="Rộng"
                :allowEditing="false"
                :allow-sorting="false"
                alignment="center"
                :width="80"
              />
              <DxColumn
                data-field="height"
                caption="Dày"
                :allowEditing="false"
                :allow-sorting="false"
                alignment="center"
                :width="80"
              />
              <DxColumn
                width="120"
                data-field="quantity"
                caption="Số lượng trước rong"
                :allow-sorting="false"
                data-type="number"
              />
            </DxDataGrid>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6">
        <q-card padding style="min-height: 510px">
          <q-card-section>
            <q-banner
              inline-actions
              rounded
              class="bg-blue-grey-2 text-primary"
            >
              <div class="text-h6">
                Quy trình SX
                <span class="text-blue">{{ `${item ? item.name : ""}` }}</span>
              </div>
            </q-banner>
          </q-card-section>
          <q-card-section>
            <DxDataGrid
              class="bg-orange text-white"
              id="routings"
              :data-source="routings"
              :show-borders="true"
              @row-inserted="confirmAddStep"
              @row-updated="confirmSaveStep"
              @row-removed="confirmRemoveStep"
              @init-new-row="onInitNewRow"
              :allow-column-resizing="true"
              :column-resizing-mode="'widget'"
            >
              <DxEditing
                refresh-mode="full"
                :allow-adding="item ? !!item.quantity : false"
                :allow-updating="item ? !!item.quantity : false"
                :allow-deleting="item ? !!item.quantity : false"
                mode="cell"
              />
              <DxColumn data-field="stepId" caption="Công đoạn" :width="200">
                <DxLookup
                  :data-source="data1"
                  value-expr="id"
                  display-expr="name"
                />
              </DxColumn>
              <DxColumn data-field="order" caption="Thứ tự" />
              <DxColumn
                data-field="code"
                caption="Mã SP"
                :allowEditing="false"
              />

              <DxColumn
                data-field="quantity"
                caption="Số lượng"
                :allowEditing="false"
              />
              <DxColumn
                v-if="lineProduct && lineProduct.value == 'LVL'"
                data-field="dong"
                caption="Sau rong"
              >
                <DxLookup
                  :data-source="dongValue"
                  value-expr="id"
                  display-expr="name"
                />
              </DxColumn>
            </DxDataGrid>
          </q-card-section>
        </q-card>
        <q-card padding class="q-pt-xl" style="min-height: 504px">
          <q-select
            class="col-2"
            color="grey-3"
            label-color="orange"
            outlined
            label="Chọn mẫu kết cấu"
            @input="onChangeStruct"
            v-model="struct"
            :options="structs"
          />
          <q-card-section>
            <q-banner
              inline-actions
              rounded
              class="bg-blue-grey-2 text-primary"
            >
              <div class="text-h6">Kết cấu ván lõi</div>
            </q-banner>
          </q-card-section>
          <q-card-section>
            <label>
              <b>Vui lòng ấn chọn file cần tải lên :</b>
              <input
                class="q-ml-sm"
                type="file"
                id="file"
                ref="file"
                @change="onChange"
              />
            </label>
            <DxDataGrid
              id="struc"
              :data-source="strucs"
              :show-borders="true"
              @row-inserted="confirmAddStepStruc"
              @row-updated="confirmSaveStepStruc"
              @row-removed="confirmRemoveStepStruc"
              @init-new-row="onInitNewRowStruc"
              :allow-column-resizing="true"
              :column-resizing-mode="'widget'"
            >
              <DxEditing
                refresh-mode="full"
                :allow-adding="item ? !!item.quantity : false"
                :allow-updating="item ? !!item.quantity : false"
                :allow-deleting="item ? !!item.quantity : false"
                mode="cell"
              />
              <DxColumn :width="50" caption="Số lớp" data-field="num" />
              <DxColumn :width="100" caption="Cách xếp" data-field="style">
                <DxLookup
                  :data-source="styles"
                  value-expr="id"
                  display-expr="name"
                />
              </DxColumn>
              <DxColumn :width="100" data-field="height" caption="Độ dày" />

              <DxColumn
                data-field="codeWoodType"
                caption="Mã loại gỗ"
                :width="200"
              >
                <DxLookup
                  :data-source="woodTypes"
                  value-expr="id"
                  display-expr="name"
                />
              </DxColumn>
              <DxColumn data-field="woodType" caption="Loại gỗ" />
            </DxDataGrid>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row">
      <span class="q-mt-sm q-ml-md text-subtitle1 text-weight-bold"
        >Yêu cầu kỹ thuật:</span
      >
      <div class="form col-md-6 col-sm-12">
        <div class="dx-fieldset">
          <!-- <div class="dx-field">
            <div class="dx-field-label text-weight-bold">Kết cấu ván</div>
            <div class="dx-field-value">
              <DxTextBox :show-clear-button="true" v-model="ketCau" />
            </div>
          </div> -->
          <!-- <div class="dx-field">
            <div class="dx-field-label text-weight-bold">
              Độ ẩm ván/ kéo dán
            </div>
            <div class="dx-field-value">
              <DxTextBox :show-clear-button="true" v-model="doAm" />
            </div>
          </div> -->
          <!-- <div class="dx-field">
            <div class="dx-field-label text-weight-bold">Theo hồ sơ sản phẩm</div>
            <div class="dx-field-value">
              <DxTextBox :show-clear-button="true" v-model="beMat" />
            </div>
          </div> -->
          <div class="dx-field">
            <div class="dx-field-label text-weight-bold">Theo hồ sơ sản phảm</div>
            <div class="dx-field-value">
              <DxTextBox :show-clear-button="true" v-model="baCanh" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <span class="q-mt-sm q-ml-md text-subtitle1 text-weight-bold text-red"
        >Chú ý sản xuất: &nbsp; &nbsp;</span
      >
      <div class="form col-md-6 col-sm-12">
        <div class="dx-fieldset">
          <div class="dx-field">
            <div class="dx-field-label text-weight-bold">Chú ý:</div>
            <div class="dx-field-value">
              <DxTextBox :show-clear-button="true" v-model="note1" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <q-card padding class="q-pt-xl">
        <q-card-section>
          <q-banner inline-actions rounded class="bg-orange text-white">
            <div class="text-h6">
              {{ `Nguyên vật liệu - Vật tư` }}
            </div>
          </q-banner>
        </q-card-section>
        <q-card-section>
          <DxDataGrid
            id="routings"
            :data-source="resultData"
            :show-borders="true"
            :allow-column-resizing="true"
            :column-resizing-mode="'widget'"
          >
            <DxEditing
              refresh-mode="full"
              :allow-adding="false"
              :allow-updating="true"
              :allow-deleting="false"
              mode="cell"
            />
            <DxColumn :width="120" data-field="nhom" caption="Nhóm"> </DxColumn>
            <DxColumn data-field="ten" caption="Tên NL, VT" />
            <DxColumn
              data-field="qc"
              caption="Quy cách (mm)"
              :allowEditing="false"
            />

            <DxColumn data-field="dvt" caption="ĐVT" :allowEditing="false" />
            <DxColumn
              align="left"
              data-field="sl"
              caption="Số lượng"
              :allowEditing="true"
            />
            <DxColumn data-field="m3" caption="M3 phôi" :allowEditing="true" />
            <DxColumn data-field="tong" caption="Tổng" :allowEditing="true" />
            <DxColumn
              data-field="haoHut"
              caption="Hao hụt"
              :allowEditing="true"
            />
          </DxDataGrid>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import XLSX from "xlsx";

import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxLookup,
  DxEditing,
  DxPaging,
} from "devextreme-vue/data-grid";
import DxTextBox from "devextreme-vue/text-box";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSearchPanel,
    DxLookup,
    DxEditing,
    DxPaging,
    DxTextBox,
  },
  data() {
    return {
      ketCau: "Không được hở mạch, không chồng mỳ, không tách lớp",
      doAm: "14%; Keo E0 ",
      beMat: "HÀNG ĐẠT TIÊU CHUẨN SƠN UV",
      baCanh: "",
      woodTypes: null,
      ngayDongGoi: moment().format("YYYY/MM/DD").slice(0, 10),
      item: null,
      soLenh: "VCN-",
      department: null,
      xuong: null,
      xuongs: [],
      size: null,
      selectionBTP: false,
      dm:0,
      hm:0,
      sub: null,
      allNumber: null,
      plus: null,
      refreshMode: "full",
      goodsTypes:[{
         label: "TP",
        value: "TP",
        code: "TP",
      },
      {
         label: "BTP",
        value: "BTP",
        code: "BTP",
      }
      ],
       goodsType: {
        label: "TP",
        value: "TP",
        code: "TP",
      },
      styles: [
        {
          name: "Ngang",
          id: "Ngang",
        },
        {
          name: "Dọc",
          id: "Dọc",
        },
      ],
      dongValue: [
        {
          name: 0,
          id: 0,
        },
        {
          name: 1,
          id: 1,
        },
      ],
      results: null,
      resultData: null,
      data1: null,
      boms: null,
      data: [],
      reject: null,
      listReject: [],
      soTam: 0,
      listItems: null,
      routings: [],
      routingTruocDongs: [],
      customer: {
        id: "",
        label: "",
        value: "",
      },
      po1:null,
      factories: null,
      factoryId: null,
      note: "",
      note1:"",
      customers: [
        { id: "WANEK", label: "WANEK", value: "WANEK" },
        { id: "FEA", label: "FEA", value: "FEA" },
      ],
      lineProducts: [
        { id: "LVL", label: "LVL", value: "LVL" },
        { id: "Birch", label: "Birch", value: "Birch" },
      ],
      lineProduct: null,
      tamung:null,
      PO: [],
      strucs: [],
      strucres: [],
      struct: null,
      structs: [],
      listSauDong: [],
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  watch: {
    factoryId: function (newValue) {
      this.soLenh = "VCN-" + newValue.code + "-";
    },
  },
  methods: {
    ...mapActions("item", ["getItemsByFactoryId"]),
    ...mapActions("messages", ["sendNotificationMail"]),
    ...mapActions("base", ["getAllDepartment"]),
    ...mapActions("vcn", [
      "CREATE_PO_VCN",
      "GET_ITEMS_VCN",
      "GET_CUSTOMER_VCN",
      "getLenhSanXuatBiTuChoiVCN",
      "getAllSoLenhSanXuats",
      "getRoutingByItemId",
      "getRoutingByItemIdbom",
      "getBomPo",
      "getFactory",
      "getStruct",
      "getHeSoQuyDoiBySP",
      "getXuongByFactoryId",
    ]),
    onSelectProduct() {
      if (this.lineProduct.label == "LVL") {
        this.ketCau = "Không phồng rộp, không tách lớp";
        this.doAm = "14%; Keo E0";
        this.beMat = "HÀNG KHÔNG CHÀ BẢ";
      } else {
        this.ketCau = "Không được hở mạch, không chồng mỳ, không tách lớp";
        this.doAm = "14%; Keo E0";
        this.beMat = "HÀNG ĐẠT TIÊU CHUẨN SƠN UV";
      }
    },
    async onChange(e) {
      this.selected = true;
      console.log("a");
      e.stopPropagation();
      e.preventDefault();

      console.log("DROPPED");
      console.log("file", e);
      var files, i, f;
      this.file = this.$refs.file.files[0];

      console.log("files", files);
      console.log("this.files", this.file);
      for (i = 0, f = this.file; i < 1; ++i) {
        var reader = new FileReader(),
          name = f.name;
        let results = [];
        this.strucs = [];
        reader.onload = async (e) => {
          let data = e.target.result,
            fixedData = await this.fixdata(data),
            workbook = XLSX.read(btoa(fixedData), {
              type: "base64",
              cellDates: true,
              dateNF: "dd/mm/yyyy",
            }),
            firstSheetName = workbook.SheetNames[0],
            worksheet = workbook.Sheets[firstSheetName];

          // this.state.headers = this.get_header_row(worksheet);
          console.log("dassss", workbook);

          results = XLSX.utils.sheet_to_json(worksheet, { raw: false });
          console.log("dassss", results);
          await results.forEach((e) => {
            let wood = this.woodTypes.find((w) => w.code == e.codeWoodType);
            this.strucs.push({
              num: e.num,
              style: e.style,
              height: e.height,
              itemId: this.item.id,
              codeWoodType: e.codeWoodType,
              woodType: wood.label,
            });
          });
          this.file = "";
          this.strucres = this.strucs;
          this.calculator();
        };
        reader.readAsArrayBuffer(f);
      }
    },
    fixdata(data) {
      var o = "",
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    onChangeStruct() {
      let struct = JSON.parse(this.struct.value);
      console.log(struct);
      this.strucs = [];
      this.strucres = [];
      struct.forEach((el) => {
        this.strucres.push({
          codeWoodType: el.codeWoodType,
          height: el.height,
          itemId: this.item.id,
          num: el.num,
          style: el.style,
          woodType: el.woodType,
        });
        this.strucs.push({
          codeWoodType: el.codeWoodType,
          height: el.height,
          itemId: this.item.id,
          num: el.num,
          style: el.style,
          woodType: el.woodType,
        });
      });
      console.log("struc 1", this.strucres);
      this.calculator();
    },
    async onClick1(node) {},
    onInitNewRow(e) {
      e.data.order = this.routings.length + 1;
      e.data.itemId = this.item.id;
      e.data.code = this.item.code || this.item.id;
      e.data.quantity = this.item.quantity;
    },
    onInitNewRowStruc(e) {
      e.data.num = this.strucs.length + 1;
      e.data.itemId = this.item.id;
    },
    async onSelectionChanged({ selectedRowsData }) {
      let routing = await this.getRoutingByItemIdbom({
        itemId: selectedRowsData[0].id,
        factoryId: this.xuong.id,
        loaisp:this.goodsType.code,
        dongsp:this.lineProduct.label,
        selectionBTP:this.selectionBTP
      });
      console.log("routings1", routing);
      if (selectedRowsData != 0) {
        this.soTam = selectedRowsData[0].quantity;
      }

      let data = await this.getBomPo({
        itemId: selectedRowsData[0].id,
      });
      data.map((e) => {
        e.nhom = e.Group ? e.Group.name : "";
        e.ten = e.materials.name;
        e.qc = e.materials.code;
        e.dvt = e.materials.Unit.name;
        e.sl = (e.rate * this.soTam).toFixed(4);
        e.m3 = (
          (e.materials.height * e.materials.width * e.materials.length) /
          1000000000
        ).toFixed(4);
        e.m3 = e.m3 > 0 ? e.m3 : null;
      });
      this.resultData = data;
      this.boms = data;
      routing.map((e) => {
        delete e.id;
        delete e.createdBy;
        delete e.updatedAt;
        delete e.modifydBy;
        delete e.deletedAt;
        e.code = selectedRowsData[0].code;
        e.quantity = selectedRowsData[0].quantity;
      });
      this.PO = routing;
      console.log("routing", routing);
      this.item = selectedRowsData[0];
      this.routings = routing;
        console.log("routings", this.routings);
      if (this.strucres.length) {
        this.strucs = [];
        this.strucres = [];
      }
      console.log("onSelectionChanged item", this.item);
      console.log("onSelectionChanged quantity", this.item.quantity);
    },
    async onSelectionChanged1({ selectedRowsData }) {
      this.item1 = selectedRowsData[0];
      this.card = true;
    },
    async confirmAddStep(e) {
      // this.PO.push(e.data);
    },
    async confirmAddStepStruc(e) {
      let woodType = this.woodTypes.find((el) => e.data.codeWoodType == el.id);
      e.data.woodType = woodType ? woodType.label : "";
      console.log("woodtype :", woodType);
      this.strucres.push(e.data);
      this.calculator();
    },
    calculator() {
      console.log("so tam", this.strucres);
      let counts = {};
      let nvl = [];
      for (var i = 0; i < this.strucres.length; i++) {
        var num = this.strucres[i].codeWoodType;
     
        counts[num] = counts[num] ? counts[num] + 1 : 1;
         console.log("counts", counts);
      }
      
      for (let key in counts) {
        let soLop = counts[key];
        let struc = this.listItems2.find((e) => e.code == key);
        console.log("struc", struc);
        let sl = 0;
        if (struc.recipeGroup === 1 && this.lineProduct.label === "Birch") {
          sl = this.soTam * 4 * soLop;
        }
        if (struc.recipeGroup === 1 && this.lineProduct.label === "LVL") {
          sl =
            (this.soTam *
              soLop *
              ((this.item.length ? this.item.length : 0) + 50)) /
            1250;
        }
        if (struc.recipeGroup === 2 && this.lineProduct.label === "Birch") {
          sl = this.soTam * soLop;
        }
        if (struc.recipeGroup === 3 && this.lineProduct.label === "Birch") {
          sl = this.soTam * 2 * soLop;
        }
        if (struc.recipeGroup === 4 && this.lineProduct.label === "Birch") {
          sl = this.soTam * 1.01 * soLop;
        }

        console.log("sl", sl);
        console.log("solop", soLop);
        console.log("sotam", this.soTam);
        struc.nhom = "NVL";
        struc.ten = struc.name ? struc.name : "";
        struc.qc = `${struc.height ? struc.height : 0}x${
          struc.width ? struc.width : 0
        }x${struc.length ? struc.length : 0}`;
        struc.dvt = struc.Unit ? struc.Unit.name : "";
        struc.sl = parseInt(sl);
        struc.soLop = soLop;
        struc.m3 = (
          (struc.height * struc.width * struc.length) /
          1000000000
        ).toFixed(4);
        struc.m3 = struc.m3 > 0 ? struc.m3 : null;
        nvl.push(struc);
      }
      let tong = 0;
      console.log("nvl", nvl);
      nvl.forEach((e) => {
        if (e.recipeGroup && e.recipeGroup !== 4) {
          e.m3 = ((e.height * e.width * e.length * e.sl) / 1000000000).toFixed(
            2
          );
          tong += parseFloat(e.m3);
        } else {
          delete e.m3;
        }
      });
      nvl[0].tong = tong.toFixed(2);
      nvl[0].haoHut = (
        tong /
        ((this.item.length * this.item.width * this.item.height * this.soTam) /
          1000000000)
      ).toFixed(2);
      this.resultData = [...nvl, ...this.boms];
    },
    async confirmSaveStep(e) {},
    async confirmSaveStepStruc(e) {
      let woodType = this.woodTypes.find((el) => e.data.codeWoodType == el.id);
      e.data.woodType = woodType.label;
      this.calculator();
    },
    async confirmSaveQuantity(e) {
      console.log("e: ", e.data.id);
      let routing = await this.getRoutingByItemIdbom({
        itemId: e.data.id,
        factoryId: this.xuong.id,
        loaisp:this.goodsType.code,
        dongsp:this.lineProduct.label,
        selectionBTP:this.selectionBTP
      });
      if (e.data != 0) {
        this.soTam = e.data.quantity;
      }

      let data = await this.getBomPo({
        itemId: e.data.id,
        factoryId: this.xuong.id,
      });
      data.map((el) => {
        el.nhom = el.Group ? el.Group.name : "";
        el.ten = el.materials.name;
        el.qc = el.materials.code;
        el.dvt = el.materials.Unit.name;
        el.sl = (el.rate * this.soTam).toFixed(4);
        el.m3 = (
          (el.materials.height * el.materials.width * el.materials.length) /
          1000000000
        ).toFixed(4);
        el.m3 = el.m3 > 0 ? el.m3 : null;
      });
      this.resultData = data;
      this.boms = data;
      console.log(this.resources);
      routing.map((el) => {
        delete el.id;
        delete el.createdBy;
        delete el.updatedAt;
        delete el.modifydBy;
        delete el.deletedAt;
        el.code = e.data.code;
        el.quantity = e.data.quantity;
      });
      console.log("Selection", routing[routing.length - 1]);
      // if (
      //   routing[routing.length - 1].stepId == 102760 ||
      //   routing[routing.length - 1].stepId == 102757 ||
      //   routing[routing.length - 1].stepId == 102770 ||
      //   routing[routing.length - 1].stepId == 102767 ||
      //   routing[routing.length - 1].stepId == 102752 ||
      //   routing[routing.length - 1].stepId == 102821 ||
      //   routing[routing.length - 1].stepId == 102825 ||
      //   routing[routing.length - 1].stepId == 102763
      // ) {
      //   routing[routing.length - 1].quantity = 0;
      // }
       routing[routing.length - 1].quantity = 0;
      this.PO = routing;
      this.item = e.data;
      this.routings = routing;

      if (this.lineProduct.label === "LVL") {
        this.routingTruocDongs = routing;
        this.routingTruocDongs[this.routingTruocDongs.length - 1].quantity = 0;
      }
      // console.log("this.routingTruocDongs", this.routingTruocDongs[this.routingTruocDongs.length-1])
      console.log("item", this.item);
      if (this.strucres.length) {
        this.strucs = [];
        this.strucres = [];
      }
      console.log("confirmSaveQuantity item", this.item);
      console.log("confirmSaveQuantity quanityt", this.item.quantity);
    },
    async spSauDongupdated(e) {
      console.log("e", e);
      const payload = {
        spTruocRong: this.item.id,
        spSauRong: e.data.id,
      };
      const data = await this.getHeSoQuyDoiBySP(payload);
      if (data.length > 0) {
        if (e.data.quantity) {
          let routing = await this.getRoutingByItemIdbom({
            itemId: e.data.id,
            factoryId: this.xuong.id,
            loaisp:this.goodsType.code,
            dongsp:this.lineProduct.label,
            selectionBTP:this.selectionBTP
          });

          console.log("item", this.item);
          console.log("e", e);
          routing.map((el) => {
            delete el.id;
            delete el.createdBy;
            delete el.updatedAt;
            delete el.modifydBy;
            delete el.deletedAt;
            el.code = e.data.code;
            el.quantity = e.data.quantity * data[0].HE_SO;
          });
          let check = this.PO.filter((p) => p.itemId == e.data.id);
          // if (
          //   routing[routing.length - 1].stepId == 102760 ||
          //   routing[routing.length - 1].stepId == 102757 ||
          //   routing[routing.length - 1].stepId == 102770 ||
          //   routing[routing.length - 1].stepId == 102767 ||
          //   routing[routing.length - 1].stepId == 102752 ||
          //   routing[routing.length - 1].stepId == 102821 ||
          //   routing[routing.length - 1].stepId == 102825 ||
          //   routing[routing.length - 1].stepId == 102763
          // ) {
          //   routing[routing.length - 1].quantity = 0;
          // }
           routing[routing.length - 1].quantity = 0;
          if (check.length > 0) {
            this.routings = [...this.routingTruocDongs, ...routing];
            this.PO = [...this.routingTruocDongs, ...routing];
          } else {
            this.routings = [...this.PO, ...routing];
            this.PO = [...this.PO, ...routing];
          }

          console.log("po", this.PO);
        }
      } else {
        this.$q.dialog({
          title: "Lỗi",
          message:
            "Sản phẩm này chưa có hệ số. Vui lòng khai hệ số trước khi tạo !",
        });
      }
    },
    // async confirmSaveQuantitySauDong(e) {
    //   this.spSauDong = e.data.id;
    //   this.soLuongSauDong = e.data.quantity;
    // },
    async confirmRemoveStep(e) {
      this.PO = this.PO.filter((el) => el.__KEY__ != e.data.__KEY__);
    },
    async confirmRemoveStepStruc(e) {
      this.strucres = this.strucs.filter((el) => el.__KEY__ != e.data.__KEY__);
      console.log("strucs", this.strucs);
      this.calculator();
    },
    async loadRouting() {},
    async loadItems() {
      const factory = {
        label: "NM Thuận Hưng",
        value: "100000",
        factoryId: 100000,
        code: "TH",
      };
      await this.getItemsByFactoryId(factory);
    },
    async checkDupplicate() {
      let poDuplicate = this.allNumber.find(
        (e) => e.number.trim() == this.soLenh.trim()
      );
      if (poDuplicate) {
        this.$q
          .dialog({
            title: "Lỗi",
            message: "Lệnh sản xuất đã tồn tại",
          })
          .onOk(() => {
            this.soLenh += "-";
          });
      }
    },
    async onChangeFactory() {
      const payload = {
        factoryId: this.factoryId.id,
      };
      const data = await this.getXuongByFactoryId(payload);
      data.map((e) => (e.label = e.name));
      this.xuongs = data;
    },
    async chonXuong() {
      this.data1 = this.department.filter((e) => e.parentId == this.xuong.id);

      const struct = await this.getStruct({ factoryId: this.xuong.id });
      console.log("struct", struct);
      this.structs = [];
      struct.forEach((el) => {
        this.structs.push({
          value: el.strucre,
          label: el.number,
        });
      });
      this.loadReject();
    },
    async loadReject() {
      let data = await this.getLenhSanXuatBiTuChoiVCN({
        factoryId: this.xuong.id,
      });
      this.listReject = [];
      data.forEach((el) => {
        this.listReject.push({
          label: el.number + " | " + el.description,
          value: el.number,
        });
      });
    },
    onSelectReject() {
      this.$router.push(`/edit-po-vcn/${this.reject.value}`);
    },
    async createPO() {
      if (
        // true
        this.lineProduct &&
        this.PO &&
        this.sub &&
        this.size &&
        this.strucs &&
        this.plus &&
        this.resultData
      ) {
        console.log("PO: ", this.PO);
        this.resultData[parseInt(this.resultData.length / 2)].m3 =
          `${this.note}`.toUpperCase();
        this.PO = this.PO.filter((e) => e.stepId);
        this.PO.map((e) => {
          delete e.code;
          e.number = this.soLenh.trim();
          e.week = moment(this.ngayDongGoi).format("w");
          e.year = moment(this.ngayDongGoi).format("y");
          console.log("true");
          e.ngayDongGoi = moment(this.ngayDongGoi).add(1, "days");
          e.resources = JSON.stringify(this.resultData);
          e.factoryId = this.xuong.id;
          e.yeuCauKyThuat = JSON.stringify({
            ketCau: this.ketCau,
            doAm: this.doAm,
            beMat: this.beMat,
            baCanh: this.baCanh,
            chuy:this.note1
          });
          e.keHoach = e.quantity;
          e.strucre = JSON.stringify(
            this.strucres.filter((el) => el.itemId == e.itemId)
         
          );
            e.loaisp = this.goodsType.code;
            e.po = this.po1?this.po1.trim():null;
            e.dinhmuc = this.goodsType.code == 'BTP'?this.dm:this.hm
            e.tamung = this.tamung
          // }
          e.type = this.lineProduct.value;
          e.size = this.size;
          e.sub = this.sub;
          e.plus = this.plus;
          e.customer = this.customer.value;
          e.createdBy = this.userInfo.id;
          e.createdAt = moment().add(7,'hours');
        });
        console.log("strucres", this.strucres);
        console.log("this.PO", this.PO);
        for (const e of this.PO) {
          const data = await this.CREATE_PO_VCN(e);
          if (data.success) {
            this.$q.notify({
              message: "Tạo kế hoạch thành công !",
              color: "green",
            });
          }
          if (!data.success) {
            this.$q.notify({
              message: "Có lỗi xảy ra!",
              color: "red",
            });
          }
        }
        let baseUrl = null;
        if (process.env.PROD) {
          baseUrl = `https://app.woodsland.com.vn:2002/#/Approved-Plan-VCN`;
        } else {
          baseUrl = `http://localhost:5000/#/Approved-Plan-VCN`;
        }
        let payloadMail2 = {
          baseUrl: baseUrl,
          email: this.factoryId.email,
          accountId: this.userInfo.id,
          toAccountId: this.factoryId.accountId,
          subject: `Có lệnh sản xuất  ${this.soLenh} được tạo`,
          title: "Nhấp vào đây để đi tới phê duyệt",
          dataBody: `Lệnh sản xuất ${this.soLenh} được tạo. Mời bạn vào phê duyệt`,
        };
        await this.sendNotificationMail(payloadMail2);
        if(this.factoryId.accountId != this.xuong.accountId){
          let payloadMail3 = {
          baseUrl: baseUrl,
          email: this.xuong.email,
          accountId: this.userInfo.id,
          toAccountId: this.xuong.accountId,
          subject: `Có lệnh sản xuất  ${this.soLenh} được tạo`,
          title: "Nhấp vào đây để đi tới phê duyệt",
          dataBody: `Lệnh sản xuất ${this.soLenh} được tạo. Mời bạn vào phê duyệt`,
        };
        await this.sendNotificationMail(payloadMail3);
        }
        this.$router.push(`/View-PO-VCN/${this.soLenh}`);
      } else {
        this.$q.notify({
          message: "Vui lòng nhập đầy đủ thông tin của kế hoạch sản xuât !",
          color: "red",
        });
      }
    },
  },
  async created() {
    const customer = await this.GET_CUSTOMER_VCN();
    const factory = await this.getFactory();
 const today = new Date();
    factory.map((e) => (e.label = e.name));
    this.factories = factory;
    console.log("factories", this.factories);
    customer.map((e) => {
      e.label = e.NAME;
      e.value = e.ID;
    });

    this.customers = customer;
    const data2 = await this.GET_ITEMS_VCN();
    this.listItems = JSON.parse(JSON.stringify(data2));
    // this.listItems2 = JSON.parse(
    //   JSON.stringify(data2.filter((e) => e.typeId != 100008))
    // );
    this.listItems2 = JSON.parse(JSON.stringify(data2));
       // console.log("listItems2", this.listItems2);
    this.woodTypes = data2;
    this.woodTypes.map((e) => {
      e.id = e.code;
      e.label = e.name;
      e.name = e.code;
    });

    await this.getItemsByFactoryId({ factoryId: 126900 });
    this.allNumber = await this.getAllSoLenhSanXuats();

    this.department = await this.getAllDepartment();

    this.department.map((e) => {
      (e.name = e.NAME), (e.id = e.ID);
    });

    this.data1 = this.department.filter((e) => e.factoryId == 102498);
  },
  async mounted() {},
};
</script>
