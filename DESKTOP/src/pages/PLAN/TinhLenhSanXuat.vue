<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-10 top-title">
            Tính kế hoạch sản xuất
          </div>
          <div v-if="dataSource.length > 0" class="col-2" align="right">
            <q-btn
              flat
              color="primary"
              label="Tạo kế hoạch"
              @click="createPlan"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row widget-container q-pa-md">
          <div class="col-12 col-md-6 q-pa-sm">
            <SelectBox
              :defaultValue="congdoan"
              :dataSource="dscongdoan"
              :onChange="chonCongDoan"
              :title="'Công đoạn'"
            />
          </div>
          <div class="col-12 col-md-6 q-pa-sm">
            <SelectBox
              :defaultValue="item"
              :dataSource="items"
              :onChange="chonSP"
              :title="'Sản phẩm :'"
            />
          </div>
          <div class="col-12 col-md-6 q-pa-sm">
            <DateBox
              :value="ngay"
              :onChange="chonNgay"
              :title="'Ngày đóng gói'"
            />
          </div>
          <div class="col-12 col-md-6 q-pa-sm">
            <NumberBox
              :defaultValue="soluong"
              :onChange="chonSL"
              :title="'Số lượng'"
            />
          </div>
          <div class="col-12 q-mt-sm" align="right">
            <q-btn
              color="primary"
              icon="check"
              label="Kiểm tra"
              @click="load"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section class="q-mt-md" v-if="loadDone">
        <!-- <TreeListPlan :goEdit="goEdit" :dataSource="dataSource" :expandedRowKeys="expandedRowKeys" /> -->
        <DxTreeList
          id="employees"
          :ref="treeListRefKey"
          :data-source="dataSource"
          :expanded-row-keys="expandedRowKeys"
          :show-row-lines="true"
          :show-column-lines="true"
          :show-borders="true"
          :column-auto-width="true"
          :root-value="'PO1'"
          key-expr="code"
          parent-id-expr="parent"
        >
          <DxHeaderFilter :visible="true" />
          <DxColumnChooser :enabled="true" />
          <DxFilterRow :visible="true" />
          <DxColumn data-field="code" caption="Mã kế hoạch" :fixed="true" />
          <DxColumn data-field="itemName" caption="SP/Chi tiết" />
          <DxColumn data-field="stepName" caption="Công đoạn" />
          <DxColumn data-field="shift" caption="Ca làm việc" />
          <DxColumn
            data-field="quantity"
            caption="Số lượng"
            data-type="number"
            format="fixedpoint"
          />
          <DxColumn
            data-field="oscp"
            caption="OSCP"
            cell-template="oscp-template"
          />
          <!-- <DxColumn
                    data-field="ton"
                    caption="Tồn"
                    data-type="number"
                    format="fixedpoint"
                /> -->
          <DxColumn
            data-field="soLuongCanSanXuat"
            caption="Cần SX"
            data-type="number"
            format="fixedpoint"
          />
          <DxColumn
            data-field="time"
            caption="Ngày hoàn thành"
            data-type="date"
            format="dd/MM/yyyy"
          />
          <template #oscp-template="options">
            <span
              @click="goEdit(options.data.data)"
              class="fake-link"
              v-if="parserInt(options.data.data.counts) <= 1"
              >{{ options.data.data.oscp }}</span
            >
            <span @click="goEdit(options.data.data)" class="fake-link" v-else
              >Vượt OSCP</span
            >
          </template>
        </DxTreeList>
      </q-card-section>
    </q-card>
    <q-dialog v-model="showEdit" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="col-12 top-title">
            Cập nhật OSCP cho công đoạn
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12" v-if="dataSelect">
              <p>{{ dataSelect.stepName || "" }}</p>
              <p>{{ dataSelect.itemName || "" }}</p>
            </div>
            <div class="col-12">
              <q-input
                v-model.number="slOSCP"
                type="number"
                label="Số lượng  "
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            v-if="timeData"
            @click="updateChiSoOSCP"
            label="Lưu lại"
            color="primary"
            v-close-popup
          />
          <q-btn
            flat
            v-else
            @click="addChiSoOSCP"
            label="Lưu lại"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import NumberBox from "../../components/commons/NumberBox";
import SelectBox from "../../components/commons/SelectBoxInt";
import DateBox from "../../components/commons/DateBox";
import TreeListPlan from "../../components/Prod/TreeListPlan";
import {
  showLoadingIos,
  closeLoading,
  formatDateISO,
  showNotifySuccess,
  showNotifyError,
  showNotifyValidate
} from "../../ultils";
import {
  DxTreeList,
  DxColumn,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  DxLookup,
  DxFilterRow
} from "devextreme-vue/tree-list";
export default {
  components: {
    DateBox,
    SelectBox,
    NumberBox,
    TreeListPlan,
    DxTreeList,
    DxColumn,
    DxColumnChooser,
    DxHeaderFilter,
    DxSearchPanel,
    DxSelection,
    DxLookup,
    DxFilterRow
  },
  data() {
    return {
      dscongdoan: [{ id: 100055, name: "Đóng gói (Thuận Hưng)" }],
      items: [
        { id: 109711, name: "ÄPPLARÖ bar stool w backrst, out brown stained" }
      ],
      ngay: new Date(),
      soluong: 1000,
      item: 111774,
      congdoan: 100055,
      dataSource: [],
      expandedRowKeys: [],
      loadDone: false,
      timeData: null,
      dataSelect: null,
      slOSCP: 0,
      idOSCP: null,
      showEdit: false,
      treeListRefKey: "grid"
    };
  },
  computed: {
    dataGrid: function() {
      console.log(this.$refs[this.treeListRefKey]);
      return this.$refs[this.treeListRefKey].instance;
    }
  },
  created() {
    this.loadItem();
  },
  methods: {
    refreshDataGrid() {
      this.dataGrid
        .refresh()
        .then(function() {
          console.log("load");
        })
        .catch(function(error) {
          showNotifyError(error);
        });
    },
    async createPlan() {
      const payload = {
        productionOrder: this.dataSource
      };
      const data = await this.$store.dispatch("prod/CREATE_PLAN", payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.dataSource = [];
      } else {
        showNotifyError();
      }
    },
    goEdit(options) {
      this.loadTime(options.step, options.itemId);
      this.dataSelect = options;

      // this.$router.push('/plan-o-s-c-p?d='+options.step+'&i='+options.itemId)
    },
    async loadTime(departmentId, itemId) {
      const payload = {
        departmentId: departmentId,
        itemId: itemId
      };
      const data = await this.$store.dispatch("prod/GET_PROD_TIME", payload);

      if (data.data.length > 0) {
        this.timeData = data.data[0];
        this.slOSCP = data.data[0].quantity;
        this.idOSCP = data.data[0].id;
      } else {
        this.timeData = null;
        this.slOSCP = 0;
        this.idOSCP = null;
      }
      this.showEdit = true;
    },
    chonSP(e) {
      this.item = e.value;
    },
    chonCongDoan(e) {
      this.congdoan = e.value;
    },
    chonNgay(e) {
      this.ngay = e.value;
    },
    chonSL(e) {
      this.soluong = e.value;
    },
    async loadItem() {
      showLoadingIos();
      const data = await this.$store.dispatch("base/GET_ITEMS", {
        factoryId: 100000,
        typeId: 100003
      });
      this.items = data.data;
      closeLoading();
    },
    async addChiSoOSCP() {
      const payload = {
        departmentId: this.dataSelect.step,
        itemId: this.dataSelect.itemId,
        quantity: this.slOSCP,
        time: 1
      };
      const data = await this.$store.dispatch("prod/ADD_CHI_SO_OSCP", payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.load();
      } else {
        showNotifyError();
      }
    },
    async updateChiSoOSCP() {
      const payload = {
        quantity: this.slOSCP,
        id: this.timeData.id
      };
      const data = await this.$store.dispatch(
        "prod/UPDATE_CHI_SO_OSCP",
        payload
      );
      if (data.meta.success) {
        showNotifySuccess();
        this.load();
      } else {
        showNotifyError();
      }
    },
    async load() {
      if (this.congdoan && this.item && this.soluong > 0) {
        this.loadDone = false;
        showLoadingIos();
        const payload = {
          departmentId: this.congdoan,
          itemId: this.item,
          quantity: this.soluong,
          date: formatDateISO(this.ngay)
        };
        const data = await this.$store.dispatch(
          "prod/CALCULATOR_PLAN",
          payload
        );
        this.dataSource = data.data;
        data.data.forEach(element => {
          this.expandedRowKeys.push(element.code);
        });
        setTimeout(() => {
          this.loadDone = true;
          // this.refreshDataGrid()
          closeLoading();
        }, 1000);
      } else {
        showNotifyValidate();
      }
    }
  }
};
</script>

<style></style>
