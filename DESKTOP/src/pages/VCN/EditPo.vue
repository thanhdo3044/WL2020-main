<template>
  <q-page>
    <q-banner class="text-primary">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div class="text-h6 q-mt-lg">Tạo kế hoạch Ván công nghiệp</div>
    </q-banner>

    <div class="row text-orange q-gutter-sm" style="margin:0px">
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
      />
      <div class="col-1"></div>
      <q-btn
        class="col-1"
        color="green-10"
        label="Lưu LSX"
        @click="updatePO"
      />
      <q-btn
        class="col-1"
        color="orange"
        label="Xóa LSX"
        @click="deletePO"
      />
    </div>
    <div class="row text-orange q-gutter-sm" style="margin:-15px 0px 10px 0px">
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
        v-model="size"
        label="Kích thước ván thành phẩm"
        class="col-2"
      >
        <template v-slot:append>
          <q-icon name="crop_free" color="orange" />
        </template>
      </q-input>
      <q-input
        color="grey-3"
        label-color="orange"
        outlined
        class="col-2"
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
        class="col-2"
        outlined
        v-model="plus"
        label="Dung sai dương"
      >
        <template v-slot:append>
          <q-icon name="add_circle" color="orange" />
        </template>
      </q-input>
    </div>
    <div class="row">
      <div class="col-6">
        <q-card padding>
          <q-card-section>
            <span
              v-if="lineProduct && lineProduct.id == 'LVL'"
              class="text-subtitle1 text-weight-bold"
              >Sản phẩm trước dong</span
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
              />
              <DxColumn
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
              />
              <DxColumn
                data-field="width"
                caption="Rộng"
                :allowEditing="false"
                :allow-sorting="false"
              />
              <DxColumn
                data-field="height"
                caption="Dày"
                :allowEditing="false"
                :allow-sorting="false"
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
              >Sản phẩm sau dong</span
            >

            <DxDataGrid
              :data-source="listItems2"
              :selection="{ mode: 'single' }"
              :show-borders="true"
              :hover-state-enabled="true"
              key-expr="id"
              @row-updated="confirmSaveQuantitySauDong"
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
                :width="300"
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
              />
              <DxColumn
                data-field="width"
                caption="Rộng"
                :allowEditing="false"
                :allow-sorting="false"
              />
              <DxColumn
                data-field="height"
                caption="Dày"
                :allowEditing="false"
                :allow-sorting="false"
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
        </q-card>
      </div>
      <div class="col-6">
        <q-card padding style="min-height: 510px">
          <q-card-section>
            <q-banner inline-actions rounded class="bg-blue-grey text-white">
              <div class="text-h6">
                Quy trình SX:  <span class="text-orange">{{ `${item ? item.name : ""}` }}</span> 
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
                data-field="quantity"
                caption="Số lượng"
                :allowEditing="false"
              />
              <DxColumn
                v-if="lineProduct && lineProduct.value == 'LVL'"
                data-field="dong"
                caption="Sau dong"
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
          <q-card-section>
            <q-banner inline-actions rounded class="bg-blue-grey text-white">
              <div class="text-h6">Kết cấu vãn lõi</div>
            </q-banner>
          </q-card-section>
          <q-card-section>
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
          <div class="dx-field">
            <div class="dx-field-label text-weight-bold">Kết cấu ván</div>
            <div class="dx-field-value">
              <DxTextBox :show-clear-button="true" v-model="ketCau" />
            </div>
          </div>
          <div class="dx-field">
            <div class="dx-field-label text-weight-bold">
              Độ ẩm ván/ kéo dán
            </div>
            <div class="dx-field-value">
              <DxTextBox :show-clear-button="true" v-model="doAm" />
            </div>
          </div>
          <div class="dx-field">
            <div class="dx-field-label text-weight-bold">Bề mặt ván</div>
            <div class="dx-field-value">
              <DxTextBox :show-clear-button="true" v-model="beMat" />
            </div>
          </div>
          <div class="dx-field">
            <div class="dx-field-label text-weight-bold">Bả cạnh ván</div>
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
              <DxTextBox :show-clear-button="true" v-model="note" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <q-card padding class="q-pt-xl">
        <q-card-section>
          <q-banner inline-actions rounded class="bg-primary text-white">
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
            <DxColumn data-field="m3" caption="M3 phôi" :allowEditing="false" />
            <DxColumn data-field="tong" caption="Tổng" :allowEditing="false" />
            <DxColumn
              data-field="haoHut"
              caption="Hao hụt"
              :allowEditing="false"
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
import { showNotifySuccess, showNotifyError } from "../../ultils";
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
      ketCau:
        "Không được hở mạch, không chồng mỳ; keo dán bám dính, không tách lớp",
      doAm: "14%; Keo E1 7% ",
      beMat:
        "Không lộ cốt, không dính rác, hạn chế các vết khoang đen;Bề mặt phẳng, Không lồi lõm, gợn sóng, sống trâu;Không lộ đường bả",
      baCanh: "Bả mịn bằng bột màu đồng màu với bề mặt ván",
      woodTypes: null,
      soLuongSauDong: null,
      spSauDong: null,
      ngayDongGoi: moment().format("YYYY/MM/DD").slice(0, 10),
      technicalReq: [
        {
          name: "Kết cấu ván",
          detail:
            "Không được hở mạch, không chồng mỳ; kéo dán bám dính, không tách lớp",
        },
        {
          name: "Độ ẩm ván/ kéo dán",
          detail: "Độ ẩm <14%; Keo E1 10%",
        },
        {
          name: "Bề mặt ván",
          detail:
            "Không lộ cốt, không dính rác, hạn chế các vết khoang đen.Bề mặt phẳng, Không lồi lõm, gợn sóng, sống trâu. Không lộ đường bả",
        },
        {
          name: "Bả cạnh ván",
          detail: "Bả mịn bằng bột màu đồng màu với bề mặt ván",
        },
      ],
      item: null,
      soLenh: "VCN-",
      department: null,
      size: null,
      sub: null,
      allNumber: null,
      plus: null,
      refreshMode: "full",
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
      strucsFil: null,
      resultData: null,
      data1: null,
      boms: null,
      data: [],
      soTam: 0,
      listItems: null,
      routings: [],
      customer: null,
      factories: null,
      factoryId: null,
      note: "",
      customers: [
        { id: "WANEK", label: "WANEK", value: "WANEK" },
        { id: "FEA", label: "FEA", value: "FEA" },
      ],
      lineProducts: [
        { id: "LVL", label: "LVL", value: "LVL" },
        { id: "Birch", label: "Birch", value: "Birch" },
      ],
      lineProduct: null,
      quantity: null,
      PO: [],
      strucs: [],
      strucres: [],
      spSauDong2: null,
      spSauDong3: null,
      slSauDong2: null,
      slSauDong3: null,
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

    ...mapActions("base", ["getAllDepartment"]),
    ...mapActions("vcn", [
      "CREATE_PO_VCN",
      "GET_ITEMS_VCN",
      "GET_CUSTOMER_VCN",
      "getAllSoLenhSanXuats",
      "getRoutingByItemId",
      "getBomPo",
      "getFactory",
      "GET_PO_BY_NUMBER_VCN",
      "UPDATE_PO",
    ]),

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
      let routing = await this.getRoutingByItemId({
        itemId: selectedRowsData[0].id,
        factoryId: this.factoryId.id,
      });
      if (selectedRowsData != 0) {
        this.soTam = selectedRowsData[0].quantity;
      }
      let data = await this.getBomPo({
        itemId: selectedRowsData[0].id,
        factoryId: this.factoryId.id,
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
      this.item = selectedRowsData[0];
      this.routings = routing;
      if (this.strucres.length) {
        this.strucs = [];
        this.strucres = [];
      }
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

      this.strucres.push(e.data);
      this.calculator();
    },
    calculator() {
      let counts = {};
      let nvl = [];
      for (var i = 0; i < this.strucs.length; i++) {
        var num = this.strucs[i].codeWoodType;
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }
      for (let key in counts) {
        let soLop = counts[key];
        let struc = this.listItems2.find((e) => e.code == key);
        let sl = 0;
        if (struc.recipeGroup === 1 && this.lineProduct.label === "Birch") {
          sl = this.soTam * 4 * soLop;
        }
        if (struc.recipeGroup === 1 && this.lineProduct.label === "LVL") {
          sl =
            (this.soTam *
              soLop *
              (this.item.length ? this.item.length : 0 + 50)) /
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
      this.resultData = [...nvl, ...this.strucsFil];
    },
    async confirmSaveStep(e) {},
    async confirmSaveStepStruc(e) {
      let woodType = this.woodTypes.find((el) => e.data.codeWoodType == el.id);
      e.data.woodType = woodType.label;
      this.calculator();
    },
    async confirmSaveQuantity(e) {
      this.quantity = this.soTam = e.data.quantity;
      
      this.routings.map((el) => (el.quantity = e.data.quantity));
      this.resultData.map((el) => {
        if (el.Group !== "NVL") {
          el.sl = (el.rate * this.soTam).toFixed(4);
        }
      });
      this.calculator();
    },
    async confirmSaveQuantitySauDong(e) {
      if(e.data.id == this.spSauDong){
      this.soLuongSauDong = e.data.quantity;
      } 
      if (e.data.id == this.spSauDong2){
        this.slSauDong2 = e.data.quantity
      }
      if(e.data.id == this.spSauDong3){
        this.slSauDong3 = e.data.quantity
      }
    },
    async confirmRemoveStep(e) {
      this.PO = this.PO.filter((el) => el.__KEY__ != e.data.__KEY__);
    },
    async confirmRemoveStepStruc(e) {
      this.strucs = this.strucs.filter((el) => el.__KEY__ != e.data.__KEY__);
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
      this.data1 = this.department.filter(
        (e) => e.parentId == this.factoryId.id
      );
    },
    async deletePO() {
      let payload = {
        number: this.soLenh.trim(),
        endPO: 0
      }
      const data = await this.$store.dispatch("vcn/DELETE_PO", payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.$router.push(`/create-PO-VCN`);
      } else {
        this.$q.notify({
          message: "Có lỗi xảy ra",
          caption: "",
          color: "red",
        });
      }
    },
    async updatePO() {
      console.log('this.resultData :>> ', this.resultData);
      if (this.sub != null && this.size && this.plus != null && this.soLenh) {
        const payload = {
          number: this.soLenh.trim(),
          week: moment(this.ngayDongGoi).format("w"),
          year: moment(this.ngayDongGoi).format("y"),
          soLuongSauDong: this.soLuongSauDong ? this.soLuongSauDong : undefined,
          slSauDong2: this.slSauDong2 ? this.slSauDong2 : undefined,
          slSauDong3: this.slSauDong3 ? this.slSauDong3 : undefined,
          ngayDongGoi: moment(this.ngayDongGoi).add(1, "days"),
          factoryId: this.factoryId.id,
          keHoach: this.quantity,
          quantity: this.quantity,
          size: this.size,
          sub: this.sub,
          plus: this.plus,
          customer: "",
          endPO: 0,
          numbers: this.$route.params.number,
          resources : JSON.stringify(this.resultData),
          strucre: JSON.stringify(this.strucs),
          yeuCauKyThuat: JSON.stringify({
            ketCau: this.ketCau,
            doAm: this.doAm,
            beMat: this.beMat,
            baCanh: this.baCanh,
          }),
        };
        const data = await this.UPDATE_PO(payload);
        if (data.success) {
          this.$q.notify({
            message: "Tạo kế hoạch thành công !",
            color: "green",
          });
          this.$router.push(`/View-PO-VCN/${this.soLenh}`);
        }
      } else {
        this.$q.notify({
          message: "Vui lòng nhập đầy đủ thông tin của kế hoạch sản xuât !",
          color: "red",
        });
      }
    },
  },
  async created() {
    const [customer, data2, data, allNumber, po] = await Promise.all([
      this.GET_CUSTOMER_VCN(),
      this.GET_ITEMS_VCN(),
      this.getAllDepartment(),
      this.getAllSoLenhSanXuats(),
      this.GET_PO_BY_NUMBER_VCN({ number: this.$route.params.number }),
    ]);
    this.data1 = data;
    const factory = await this.getFactory();
    factory.map((e) => (e.label = e.name));
    this.factories = factory;
    customer.map((e) => {
      e.label = e.NAME;
      e.value = e.ID;
    });
    this.customers = customer;
    this.listItems = JSON.parse(
      JSON.stringify(data2.filter((e) => e.typeId === 100008))
    );
    const items2 = JSON.parse(
      JSON.stringify(data2.filter((e) => e.typeId != 100008))
    );
    let listSauRong = [];
    listSauRong = po.data.filter( d => d.heSo != 1 && d.order == 1);
    this.listItems2 = [];
    console.log("this.listItems2", listSauRong);
    if (po.data[0].type === "LVL") {
      listSauRong.forEach(el => {
        let item = items2.find(i => i.id == el.ItemVCN.id);
        if(item){
        item.quantity = el.quantity;
        this.listItems2.push(item);
        }
        console.log("item", item);
      });
    }
    if(po.data[0].spSauDong2 != null){
      this.listItems2.push(po.data[0].ItemDong2);
      this.listItems2[1].quantity = po.data[0].slSauDong2;
      this.slSauDong2 = po.data[0].slSauDong2;
      this.spSauDong2 = po.data[0].spSauDong2;
    }
    if(po.data[0].spSauDong3 != null){
      this.listItems2.push(po.data[0].ItemDong3);
      this.listItems2[this.listItems2.length-1].quantity = po.data[0].slSauDong3;
      this.slSauDong3 = po.data[0].slSauDong3;
      this.spSauDong3 = po.data[0].spSauDong3; 
    }
    this.woodTypes = [...data2.filter((e) => e.height <= 2)];
    this.woodTypes.map((e) => {
      e.id = e.code;
      e.label = e.name;
      e.name = e.code;
    });
    await this.getItemsByFactoryId({ factoryId: 126900 });
    this.allNumber = allNumber;
    data.map((e) => {
      (e.name = e.NAME), (e.id = e.ID);
    });
    this.factoryId = this.factories.find((nm) => nm.id == po.data[0].factoryId);
    this.ngayDongGoi = moment(po.data[0].ngayDongGoi).format("YYYY/MM/DD");
    this.lineProduct = this.lineProducts.find(
      (e) => e.label == po.data[0].type
    );
    this.soLenh = await po.data[0].number;
    this.customer = this.customers.find((e) => e.value == po.data[0].customer);
    this.size = po.data[0].size;
    this.sub = po.data[0].sub;
    this.plus = po.data[0].plus;
    this.listItems = this.listItems.filter((e) => e.id == po.data[0].itemId);
    this.item = this.listItems[0];
    this.listItems[0].quantity = po.data[0].quantity;
    this.strucs = JSON.parse(po.data[0].strucre);
    this.resultData = JSON.parse(po.data[0].resources);
    this.strucsFil = this.resultData.filter((e) => e.nhom != "NVL");
    this.routings = po.data;
    this.soTam = this.routings[0].quantity;
    const { ketCau, doAm, beMat, baCanh } = JSON.parse(
      po.data[0].yeuCauKyThuat
    );
    this.ketCau = ketCau;
    this.doAm = doAm;
    this.beMat = beMat;
    this.baCanh = baCanh;
    this.quantity = po.data[0].quantity;
  },
  async mounted() {},
};
</script>
