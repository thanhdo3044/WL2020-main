<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 20px">
          Khai báo dữ liệu máy
        </div>
        <div v-if="isInsert" class="col-6 q-gutter-sm" align="right">
          <q-btn color="positive" label="1 - Thêm máy" @click="addMachine" />
          <q-btn color="positive" label="2 - Khai báo công suất tiêu chuẩn máy" @click="addCongSuatMay" />
        </div>
      </div>
      <div>
        <q-card>
          <DxDataGrid :data-source="dataSource" :show-borders="true" :no-data-text="'Không có dữ liệu !'"
            :show-column-lines="true" :allow-column-resizing="true" :word-wrap-enabled="true">
            <DxExport :enabled="true" :allow-export-selected-data="false" :file-name="'Danh sách dữ liệu máy '" />
            <DxHeaderFilter :visible="true" />
            <DxGroupPanel :visible="true" :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'" />
            <DxGrouping :auto-expand-all="true" />
            <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400" />
            <DxColumn data-field="factoryId" :group-index="0" caption="Nhà máy" cssClass="mauvang">
              <DxLookup :data-source="options" display-expr="label" value-expr="factoryId" />
            </DxColumn>
            <DxColumn data-field="DEPARTMENT_NAME" caption="Bộ phận" />
            <DxColumn data-field="machineId" caption="Mã máy" />
            <DxColumn data-field="NAME" caption="Tên máy" />
            <DxColumn data-field="ITEM_NAME" caption="Tên sản phẩm / chi tiết" />
            <DxColumn data-field="outputTheory" caption="Công suất tiêu chuẩn chung (MD/H)" alignment="center">
            </DxColumn>
            <DxColumn data-field="OPTIMAL_CAPACITY" caption="Công suất tiêu chuẩn riêng (MD/H)" alignment="center">
            </DxColumn>
            <DxColumn data-field="IMPORTANT_FACTOR" caption="Hệ số quan trọng" alignment="center" :width="100" />
            <DxColumn data-field="numberWorker" caption="Nhân viên vận hành" alignment="center" />
            <DxColumn v-if="isUpdate" caption="Chỉnh sửa" alignment="center" cell-template="update-cell" :width="100" />
            <template v-if="isUpdate" #update-cell="cell">
              <span class="fake-link" @click="onSelectionChanged(cell)">Sửa</span>
            </template>
            <DxColumn v-if="isDelete" caption="Xóa" alignment="center" cell-template="del-cell" :width="100" />
            <template v-if="isDelete" #del-cell="cell">
              <span class="fake-link" @click="onSelectionChangedDel(cell)">Xóa</span>
            </template>
          </DxDataGrid>
        </q-card>
      </div>
      <q-dialog v-model="showChooseMachine" persistent>
        <q-card style="min-width: 70%">
          <q-card-section class="row items-center">
            <div class="row">
              <div class="col-12 top-title">Thông tin máy</div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row justify-around">
              <div class="col-12 col-md-5 q-mt-sm">
                <q-select @input="GetDepartmentByFactotyId" v-model="mFactory" :options="options" label="Nhà Máy"
                  :rules="[(val) => !!val || 'Field is required']" />
              </div>
              <div class="col-12 col-md-5 q-mt-sm">
                <q-select v-model="mDepartment" :options="departments" label="Bộ phận"
                  :rules="[(val) => !!val || 'Field is required']" />
              </div>
              <div class="col-12 col-md-5 q-mt-sm">
                <q-input v-model="mMachineId" type="text" :rules="[(val) => !!val || 'Field is required']"
                  label="Mã máy" />
              </div>
              <div class="col-12 col-md-5 q-mt-sm">
                <q-input v-model="mName" type="text" :rules="[(val) => !!val || 'Field is required']" label="Tên máy" />
              </div>
              <div class="col-12 col-md-5 q-mt-sm">
                <q-input v-model="mImportantFactor" type="number" :rules="[(val) => !!val || 'Field is required']"
                  label="Hệ số quan trọng" />
              </div>
              <div class="col-12 col-md-5 q-mt-sm">
                <q-input v-model="mNumberWorker" type="number" :rules="[(val) => !!val || 'Field is required']"
                  label="Nhân viên vận hành" />
              </div>
              <div class="col-12 col-md-5 q-mt-sm" v-if="isEdit && typeCongSuat == 'chung'">
                <q-input v-model="outputTheory" type="number" :rules="[(val) => !!val || 'Field is required']"
                  label="Công suất tiêu chuẩn chung (MD/H)" />
              </div>
              <div class="col-12 col-md-5 q-mt-sm" v-if="isEdit && typeCongSuat == 'rieng'">
                <q-select v-model="item" :options="items" label="Tên sản phẩm / chi tiết"
                  :rules="[(val) => !!val || 'Field is required']" />
              </div>
              <div class="col-12 col-md-5 q-mt-sm" v-if="isEdit && typeCongSuat == 'rieng'">
                <q-input v-model="optimalCapacity" type="number" :rules="[(val) => !!val || 'Field is required']"
                  label="Công suất tiêu chuẩn riêng" />
              </div>
              <div class="col-12 col-md-5 q-mt-sm" v-if="isEdit && typeCongSuat == 'rieng'">
              </div>
              <div class="col-12 col-md-5 q-mt-sm"></div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat label="Lưu" @click="add" color="primary" />
            <q-btn flat label="Hủy" color="red" @click="cancel" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="showKhaiBaoCongSuat" persistent>
        <q-card style="min-width: 70%">
          <q-card-section class="row items-center">
            <div class="row">
              <div class="col-12 top-title">Khai báo công suất tiêu chuẩn máy</div>
              <div class="col-12">
                <p style="font-style: italic; color: violet">
                  - Nếu khai công suất chung thì công suất này áp dụng cho tất cả
                  các sản phẩm / chi tiết sử dụng máy
                </p>
                <p style="font-style: italic; color: violet">
                  - Nếu khai công suất riêng thì công suất đó chỉ áp dụng cho từng
                  sản phẩm / chi tiết được khai
                </p>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="row justify-around">
            <div class="row" style="color: orange">
              <div class="col-12">
                <q-radio v-model="typeCongSuat" val="chung"
                  label="Khai công suất chung của máy không theo sản phẩm / chi tiết" />

              </div>
              <div class="col-12">
                <q-radio v-model="typeCongSuat" val="rieng" label="Khai công suất của từng sản phẩm / chi tiết" />
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row justify-around">
              <div class="col-12 col-md-5 q-mt-sm">
                <q-select v-model="factory" :options="options" @input="selectFactory" label="Tên nhà máy" />
              </div>
              <div class="col-12 col-md-5 q-mt-sm">
                <q-select v-model="machine" :options="machines" label="Tên máy" />
              </div>
              <div class="col-12 col-md-5 q-mt-sm" v-if="typeCongSuat == 'rieng'">
                <q-select v-model="item" :options="items" label="Tên sản phẩm / chi tiết" use-input input-debounce="0"
                  @filter="filterQuyCach" :rules="[(val) => !!val || 'Field is required']" />
              </div>
              <div class="col-12 col-md-5 q-mt-sm" v-if="typeCongSuat == 'rieng'">
                <q-input v-model="optimalCapacity" type="number" :rules="[(val) => !!val || 'Field is required']"
                  label="Công suất tiêu chuẩn riêng (MD/H)" />
              </div>
              <div class="col-12 col-md-5 q-mt-sm" v-if="typeCongSuat == 'chung'">
                <q-input v-model="mOutputTheory" type="number" :rules="[(val) => !!val || 'Field is required']"
                  label="Công suất tiêu chuẩn chung (MD/H)" />
              </div>
              <div class="col-12 col-md-5 q-mt-sm"></div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat label="Hủy" color="red" @click="cancel" />
            <q-btn flat label="Lưu lại" @click="addCSM" color="primary" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="isShowDel" persistent>
        <q-card>
          <div class="q-pa-md q-gutter-sm">
            Bạn muốn xóa máy :<span style="font-weight: bold;"> {{ nameMay }}</span>
          </div>
          <div class="q-pa-md q-gutter-sm" align="right">
            <q-btn label="Xóa" color="primary" @click="delMay(idMay)" />
            <q-btn label="Đóng" color="red" @click="isShowDel = false" />
          </div>
        </q-card>
      </q-dialog>
    </div>
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
  DxEditing,
  DxRequiredRule,
  DxNumericRule,
  DxExport,
  DxHeaderFilter,
  DxSummary,
  DxGroupItem,
  DxTotalItem,
  DxLookup,
} from "devextreme-vue/data-grid";
import { showNotifySuccess, showNotifyError } from "../../ultils";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxLookup,
    DxEditing,
    DxRequiredRule,
    DxNumericRule,
    DxExport,
    DxHeaderFilter,
    DxSummary,
    DxGroupItem,
    DxTotalItem,
  },
  data() {
    return {
      showChooseMachine: false,
      showKhaiBaoCongSuat: false,
      isEdit: false,
      mFactory: null,
      mDepartment: null,
      mId: 0,
      mMachineId: "",
      mName: "",
      mOutputTheory: 0,
      mMd_h: 0,
      mImportantFactor: 0,
      mNumberWorker: 0,
      machine: null,
      machines: [],
      item: null,
      itemOld: null,
      machineIdOld: null,
      items: [],
      arrQuyCachs: [],
      optimalCapacity: 0,
      typeCongSuat: "chung",
      factory: null,
      dataSource: [],
      departments: [],
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          factoryIdCD: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn",
          factoryId: 102340,
          factoryIdCD: 102340,
          code: "YS",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102366,
          factoryIdCD: 102366,
          code: "TB",
        },
      ],
      isShowDel: false,
      idMay: null,
      nameMay: '',
      isInsert: false,
      isUpdate: false,
      isDelete: false,
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  async created() {
    this.load();
    this.loadItem();
    this.loadPermission();
  },
  methods: {
    ...mapActions("machine", [
      "GET_MACHINE",
      "ADD_MACHINE",
      "DELETE_MACHINE",
      "UPDATE_MACHINE",
      "getDepartmentByFactotyId",
      "GET_HIEU_SUAT_MAY",
      "ADD_HIEU_SUAT_MAY",
      "UPDATE_HIEU_SUAT_MAY",
      "GET_MACHINE_BY_FACTORY_ID",
      "updateCongSuatChung",
      "GET_ITEMS"
    ]),
    ...mapActions("prod", [
      "getPermissionInScreen"
    ]),
    async loadPermission() {
      console.log("router dinh tuyen", this.$route.path);
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.getPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((el) => {
        if (el.CODE == "insert") {
          this.isInsert = true;
        }
        if (el.CODE == "update") {
          this.isUpdate = true;
        }
        if (el.CODE == "delete") {
          this.isDelete = true;
        }
      });
      console.log("listPermission", this.listPermission);
    },
    async load() {
      let data = await this.GET_MACHINE();
      this.dataSource = data;
    },
    async selectFactory() {
      this.machines = [];
      let data = await this.GET_MACHINE_BY_FACTORY_ID(this.factory.factoryId);
      data.forEach((el) => {
        this.machines.push({
          label: el.NAME,
          value: el.machineId,
          name: el.NAME,
        });
      });
    },
    addMachine() {
      this.mFactory = null;
      this.mDepartment = null;
      this.mMachineId = "";
      this.mName = "";
      this.mImportantFactor = 1;
      this.showChooseMachine = true;
      this.isEdit = false;
      this.departments = [];
    },
    addCongSuatMay() {
      this.factory = this.mFactory;
      this.machine = {
        label: this.mName,
        value: this.mMachineId
      }
      this.showKhaiBaoCongSuat = true;
    },
    async loadItem() {
      const data = await this.GET_ITEMS();
      console.log("item");
      this.items = [];
      this.item = null;
      data.forEach((el) => {
        this.items.push({
          label: el.NAME,
          value: el.ID,
          name: el.NAME,
        });
      });
      this.arrQuyCachs = this.items;
    },
    filterQuyCach(val, update) {
      if (val === "") {
        update(() => {
          this.items = this.arrQuyCachs;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.items = this.arrQuyCachs.filter(function (str) {
          return str.name.toLowerCase().includes(needle);
        });
      });
    },
    async cancel() {
      this.showChooseMachine = false;
      this.showKhaiBaoCongSuat = false;
    },

    async GetDepartmentByFactotyId() {
      console.log("da vao");
      this.departments = [];
      let data = [];
      data = await this.getDepartmentByFactotyId(this.mFactory.factoryIdCD);
      this.mDepartment = null;
      data.forEach((el) => {
        this.departments.push({
          value: el.ID,
          label: el.NAME,
        });
      });
    },

    async add() {
      var check = false;
      var machines = [];
      if (this.isEdit) {
        machines = this.dataSource.filter((item) => item.id !== this.mId);
      } else {
        machines = this.dataSource;
      }
      console.log("machines: ", machines);
      console.log("machineID", this.mId);
      machines.forEach((el) => {
        if (el.machineId == this.mMachineId) {
          check = true;
        }
      });
      if (check) {
        this.$q.dialog({
          title: "Lỗi",
          message: "Mã máy đã tồn tại",
        });
      } else {
        if (!this.isEdit) {
          let payload = {
            machineId: this.mMachineId,
            NAME: this.mName,
            departmentId: this.mDepartment.value,
            importantFactor: this.mImportantFactor,
            factoryId: this.mFactory.factoryId,
            accountId: this.userInfo.id,
            numberWorker: parseInt(this.mNumberWorker),
          };
          const data = await this.ADD_MACHINE(payload);
          this.showChooseMachine = false;
          console.log("data:", data);
          this.load();
          if (data.meta.success) {
            this.factory = this.mFactory;
            this.machine = {
              label: this.mName,
              value: this.mMachineId,
            };
            this.showKhaiBaoCongSuat = true;
            showNotifySuccess();
          } else {
            showNotifyError();
          }
        } else {
          if (this.typeCongSuat == "chung") {
            const payload = {
              id: this.mId,
              machineId: this.mMachineId,
              NAME: this.mName,
              departmentId: this.mDepartment.value,
              outputTheory: parseInt(this.outputTheory),
              importantFactor: this.mImportantFactor,
              factoryId: this.mFactory.factoryId,
              numberWorker: parseInt(this.mNumberWorker),
            };
            const data = await this.UPDATE_MACHINE(payload);
            this.showChooseMachine = false;
            this.load();
            if (data.meta.success) {
              showNotifySuccess();
            } else {
              showNotifyError();
            }
          } else {
            const payload = {
              id: this.mId,
              machineId: this.mMachineId,
              NAME: this.mName,
              departmentId: this.mDepartment.value,
              outputTheory: null,
              importantFactor: this.mImportantFactor,
              factoryId: this.mFactory.factoryId,
              itemId: this.item.value,
              itemIdOld: this.itemOld.value,
              machineIdOld: this.machineIdOld,
              optimalCapacity: this.optimalCapacity,
              numberWorker: parseInt(this.mNumberWorker),
            };
            const data = await this.UPDATE_HIEU_SUAT_MAY(payload);
            this.showChooseMachine = false;
            this.load();
            if (data.meta.success) {
              showNotifySuccess();
            } else {
              showNotifyError();
            }
          }
        }
      }
    },
    async addCSM() {
      if (this.typeCongSuat == "chung") {
        let payload = {
          machineId: this.machine.value,
          outputTheory: parseInt(this.mOutputTheory),
        };
        let data = await this.updateCongSuatChung(payload);
        this.load();
        this.showKhaiBaoCongSuat = false;
        if (data.meta.success) {
          showNotifySuccess();
        } else {
          showNotifyError();
        }
      } else {
        let payload = {
          machineId: this.machine.value,
          itemId: this.item.value,
          optimalCapacity: this.optimalCapacity,
          accountId: this.userInfo.id
        };
        const data = await this.ADD_HIEU_SUAT_MAY(payload);
        this.showKhaiBaoCongSuat = false;
        this.load();
        if (data.meta.success) {
          showNotifySuccess();
        } else {
          showNotifyError();
        }
      }
    },
    async onSelectionChanged(e) {
      console.log("data :", e.data.data);
      this.mId = e.data.data.id;
      this.mMachineId = e.data.data.machineId;
      this.mName = e.data.data.NAME;
      this.mImportantFactor = e.data.data.IMPORTANT_FACTOR;
      this.outputTheory = e.data.data.outputTheory;
      this.optimalCapacity = e.data.data.OPTIMAL_CAPACITY;
      this.mNumberWorker = e.data.data.numberWorker;
      this.itemOld = {
        label: e.data.data.ITEM_NAME,
        value: e.data.data.ITEM_ID,
      };
      this.machineIdOld = e.data.data.machineId;
      this.mFactory = this.options.find((t) => {
        return t.factoryId === e.data.data.factoryId;
      });
      this.item = {
        label: e.data.data.ITEM_NAME,
        value: e.data.data.ITEM_ID,
      };
      console.log("item", this.item);
      console.log("this.mFactory", this.mFactory);
      this.departments = [];
      const data = await this.getDepartmentByFactotyId(this.mFactory.factoryId);
      data.forEach((el) => {
        this.departments.push({
          value: el.ID,
          label: el.NAME,
          name: el.NAME,
        });
      });
      this.mDepartment = this.departments.find((u) => {
        return u.name === e.data.data.DEPARTMENT_NAME;
      });
      this.isEdit = true;
      this.showChooseMachine = true;
      if (this.outputTheory == null) {
        this.typeCongSuat = "rieng";
      } else {
        this.typeCongSuat = "chung";
      }
      console.log("chung rieng", this.typeCongSuat);
    },
    async onSelectionChangedDel(e) {
      this.isShowDel = true;
      this.idMay = e.data.data.id;
      this.nameMay = e.data.data.NAME
    },
    async delMay() {
      const data = await this.DELETE_MACHINE(this.idMay)
      if (data.meta.success) {
        this.$q.notify({
          message: 'Xóa thành công !!!',
          color: 'positive'
        })
        this.load();
        this.isShowDel = false
      } else {
        this.$q.notify({
          message: 'Xóa không thành công !!!',
          color: 'negative'
        })
      }
    }
  },
};
</script>

<style>
/* .mauvang  {

     border-style: inset;
      border-color:black;
        background-color: white;
        text-align: center;
    } */
</style>

