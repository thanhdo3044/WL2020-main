<template>
  <q-page class="q-pa-sm">
    <div class="row" style="background-color: #daf8e1">
      <div class="col-6 text-blue text-bold" style="font-size: 18px">
        Phê duyệt thay đổi số tồn tại tổ -
        {{ factory1 ? factory1.label : "" }}
      </div>
      <div
        class="col-6 cursor-pointer text-blue text-bold"
        style="font-size: 18px"
        align="right"
        @click="showChooseDate = true"
      >Chọn ngày: 
        <span class="text-amber-14">{{ denNgay }}</span>
      </div>
    </div>

    <q-card>
      <div style="padding: 5px">
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
                  style="border-radius: 5px"
                  class="text-weight-bold"
                  :class="{ active: factory1 == congDoan }"
                  color="amber-6"
                />
              </div>
              <div class="col-2" align="right">
                <q-btn
                  class="col-1 q-ml-sm"
                  color="positive"
                  outlined
                  label="Phê duyệt"
                  @click="confirmphieu = true"
                />
              </div>
              <div class="col-2" align="right">
                <q-btn
                  class="col-1 q-ml-sm"
                  color="orange"
                  outlined
                  label="Từ chối"
                  @click="confirmphieuxoa = true"
                />
              </div>
            </div>
          </div>
          <!-- <div class="col-4" align="right">
            <q-checkbox
              v-model="isExcel"
              color="amber-6"
              class="text-weight-bold text-blue"
              label="Xuất Excel"
              dense
            />
          </div> -->
        </div>
      </div>
      <div
        v-if="factory1"
        class="row"
        style="font-size: 12px; vertical-align: top"
      >
        <div class="col-12">
          <table style="border: 1px solid black; width: 100%">
            <tr>
              <td scope="col" style="border-right: 1px solid black">
                <div>
                  <q-checkbox
                    v-if="factory1.factoryId == 100000"
                    @input="selectAll()"
                    dense
                    color="amber-6"
                    class="text-blue"
                    style="font-weight: bold"
                    v-model="allDepartmentTH"
                    label="Chọn tất"
                  />
                  <q-checkbox
                    v-if="factory1.factoryId == 102340"
                    @input="selectAll()"
                    dense
                    color="amber-6"
                    class="text-blue"
                    style="font-weight: bold"
                    v-model="allDepartmentYS1"
                    label="Chọn tất"
                  />
                  <q-checkbox
                    v-if="factory1.factoryId == 102366"
                    @input="selectAll()"
                    dense
                    color="amber-6"
                    class="text-blue"
                    style="font-weight: bold"
                    v-model="allDepartmentTB"
                    label="Chọn tất"
                  />
                  <q-checkbox
                    v-if="factory1.factoryId == 102427"
                    @input="selectAll()"
                    dense
                    color="amber-6"
                    class="text-blue"
                    style="font-weight: bold"
                    v-model="allDepartmentQM"
                    label="Chọn tất"
                  />
                  <q-checkbox
                    v-if="factory1.factoryId == 102299"
                    @input="selectAll()"
                    dense
                    color="amber-6"
                    class="text-blue"
                    style="font-weight: bold"
                    v-model="allDepartmentCBG"
                    label="Chọn tất"
                  />
                </div>
              </td>
              <td
                scope="col"
                style="vertical-align: top"
                v-for="(value, index) in listGroupDepartment"
                :key="index"
              >
                <div>
                  <q-checkbox
                    v-if="factory1.factoryId == 102299"
                    dense
                    v-model="chonCongDoansCBG"
                    :val="value.NAME"
                    style="font-weight: bold"
                    :label="value.NAME"
                    color="amber-6"
                  />
                </div>
                <div
                  v-for="(congDoan, index1) in departments.filter(
                    (d) => d.groupOrder == value.ORDER
                  )"
                  :key="index1"
                >
                  <q-checkbox
                    v-if="
                      congDoan.value != 102484 &&
                      congDoan.id != 102490 &&
                      congDoan.factoryId == 100000
                    "
                    dense
                    v-model="chonCongDoansTH"
                    :val="congDoan.ID"
                    style="font-weight: bold"
                    :label="congDoan.departmentName"
                    color="amber-6"
                  />
                  <q-checkbox
                    v-if="
                      congDoan.value != 102484 &&
                      congDoan.id != 102490 &&
                      congDoan.factoryId == 102340
                    "
                    dense
                    v-model="chonCongDoansYS1"
                    :val="congDoan.ID"
                    style="font-weight: bold"
                    :label="congDoan.departmentName"
                    color="amber-6"
                  />
                  <q-checkbox
                    v-if="
                      congDoan.value != 102484 &&
                      congDoan.id != 102490 &&
                      congDoan.factoryId == 102366
                    "
                    dense
                    v-model="chonCongDoansTB"
                    :val="congDoan.ID"
                    style="font-weight: bold"
                    :label="congDoan.departmentName"
                    color="amber-6"
                  />
                  <q-checkbox
                    v-if="
                      congDoan.value != 102484 &&
                      congDoan.id != 102490 &&
                      congDoan.factoryId == 102427
                    "
                    dense
                    v-model="chonCongDoansQM"
                    :val="congDoan.ID"
                    style="font-weight: bold"
                    :label="congDoan.departmentName"
                    color="amber-6"
                  />
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div
          class="col-2 col-md-2"
          v-for="(congDoan, index) in departments"
          :key="index"
        ></div>
      </div>
      <div class="row">
        <div class="col-12">
          <DxDataGrid
            id="gridContainer"
            :data-source="dataSourceFilter"
            key-expr="itemId"
            :hover-state-enabled="true"
            :word-wrap-enabled="true"
            :row-alternation-enabled="true"
            :selection="{ mode: 'single' }"
          >
            <DxColumnChooser :enabled="isExcel" />
            <DxHeaderFilter :visible="true" />
            <DxGroupPanel
              :visible="isExcel"
              :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
            />
            <DxScrolling mode="infinite" />
            <DxSorting mode="none" />
            <DxGrouping :auto-expand-all="true" />
            <DxColumn
              data-field="stepId"
              caption="Công đoạn"
              :group-index="0"
              sort-order="desc"
              :sort-index="0"
            >
              <DxLookup
                :data-source="departments"
                display-expr="departmentName"
                value-expr="ID"
              />
            </DxColumn>
            <DxColumn
              data-field="itemId"
              caption="ID"
              width="80"
              :allowEditing="false"
            />
            <DxColumn
              data-field="chitiet"
              caption="SP/Chi tiết"
              width="400"
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
            >
              <DxColumn
                caption="Dày"
                data-field="height"
                alignment="center"
                width="100"
                :allowEditing="false"
              />
              <DxColumn
                caption="Rộng"
                data-field="width"
                alignment="center"
                width="100"
                :allowEditing="false"
              />
              <DxColumn
                caption="Dài"
                data-field="length"
                alignment="center"
                width="100"
                :allowEditing="false"
              />
            </DxColumn>
     
            <DxColumn
              data-field="TonThucTe"
              caption="Số lượng sẽ được điều chỉnh"
              data-type="number"
              alignment="center"
              :allowEditing="true"
              format="#,##0.##"
              width="120"
            />
          
           
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
      </div>
      <q-dialog v-model="confirmphieu" persistent>
        <q-card style="min-width: 400px">
          <q-card-section class="row items-center">
            <div class="row">
              <div class="col-12 top-title ">
                Xác nhận cập nhập dữ liệu
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
                 <q-btn
              label="Đồng ý"
              @click="capnhatton"
              color="positive"
              v-close-popup
            />
            <q-btn label="Hủy" color="orange" v-close-popup />
       
          </q-card-actions>
        </q-card>
      </q-dialog>
        <q-dialog v-model="confirmphieuxoa" persistent>
        <q-card style="min-width: 400px">
          <q-card-section class="row items-center">
            <div class="row">
              <div class="col-12 top-title text-orange">
                Xác nhận từ chối phê duyệt
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
             <q-btn
              label="Đồng ý"
              @click="xoaton"
              color="positive"
              v-close-popup
            />
            <q-btn label="Hủy" color="orange" v-close-popup />
           
          </q-card-actions>
        </q-card>
      </q-dialog>
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
import { showNotifySuccess, showNotifyError } from "../ultils";
import { formatDateVN } from "../ultils";
import DialogSelectDate from "components/commons/DialogSelectFromDateToDate";
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxExport,
  DxLookup,
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
      showVolumnColumn: false,
      factory1: false,
      confirmphieu: false,
      confirmphieuxoa:false,
      allDepartment: false,
      allDepartmentTH: false,
      allDepartmentQM: false,
      allDepartmentYS1: false,
      allDepartmentTB: false,
      isExcel: false,
      data2: [],
      tocongdoan: [],
      departments: [],
      congdoanton: [],
      chonCongDoans: [],
      chonCongDoansTH: [],
      chonCongDoansYS: [],
      chonCongDoansYS1: [],
      chonCongDoansTB: [],
      chonCongDoansQM: [],
      stepId: null, // string,
      listGroupDepartment: [],
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
      if (this.factory1.factoryId == 100000)
        return this.tonPhois.filter((i) =>
          this.chonCongDoansTH.includes(i.stepId)
        );
      if (this.factory1.factoryId == 102427)
        return this.tonPhois.filter((i) =>
          this.chonCongDoansQM.includes(i.stepId)
        );
      if (this.factory1.factoryId == 102340)
        return this.tonPhois.filter((i) =>
          this.chonCongDoansYS1.includes(i.stepId)
        );
      if (this.factory1.factoryId == 102366)
        return this.tonPhois.filter((i) =>
          this.chonCongDoansTB.includes(i.stepId)
        );
    },

    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  methods: {
    ...mapActions("keHoach", ["getTonsGhiNhan"]),
    ...mapActions("base", ["getAllCongDoans"]),
    ...mapActions("prod", [
      "getPermissionInScreen",
      "getDepartmentByFactoryId",
      "insertlaitoncongdoan",
      "xoanhaptoncongdoan",
      "getGroupDepartment",
      "getListGroupDepartment",
    ]),
    async loadData() {
      let payload = {
        startDate: moment(this.fromDate).format("YYYY-MM-DD 05:00:00"),
        endDate: moment(this.toDate)
          .add(1, "day")
          .format("YYYY-MM-DD 05:59:59"),
        factoryId: this.userInfo.factoryId,
        stepId: 100000,
      };
      const data = await this.getTonsGhiNhan(payload);
      this.tonPhois.forEach((d) => {
        if (d.TonThucTe) this.congdoanton.push(d.stepId);
      });
      // console.log("aaaaaaaaaa",this.getTonsGhiNhan(payload))
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async capnhatton() {
      this.nhapton = [];
      this.dataSourceFilter.forEach((d) => {
        if (d.TonThucTe) {
          this.nhapton.push({
            stepId: d.stepId,
            itemId: d.itemId,
            chenhlechSL: d.TonThucTe,
            market_code:d.market_code?d.market_code:null,
          });
        }
      });
      const data_ton = await this.insertlaitoncongdoan({
        createdBy: this.userInfo.id,
        dataDelai: this.nhapton,
        endDate: moment(this.toDate).format("YYYY-MM-DD 05:59:59"),
      });
      if (data_ton.meta.success) {
        showNotifySuccess();
        this.loadData();
      } else {
        showNotifyError();
      }
    
    },
        async xoaton() {
      this.nhapton = [];
      this.dataSourceFilter.forEach((d) => {
        if (d.TonThucTe) {
          this.nhapton.push({
            stepId: d.stepId,
            itemId: d.itemId,
            chenhlechSL: d.TonThucTe,
          });
        }
      });
      const data_ton = await this.xoanhaptoncongdoan({
        createdBy: this.userInfo.id,
        dataDelai: this.nhapton,
        
      });
      if (data_ton.meta.success) {
        showNotifySuccess();
        this.loadData();
      } else {
        showNotifyError();
      }
    
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadData();
    },
    async selectAll() {
      if (this.allDepartmentQM) {
        this.departments.forEach((el) => {
          if (this.factory1.factoryId == 102427)
            this.chonCongDoansQM.push(el.ID);
        });
      } else this.chonCongDoansYS = [];
      if (this.allDepartmentYS1) {
        this.departments.forEach((el) => {
          if (this.factory1.factoryId == 102340)
            this.chonCongDoansYS1.push(el.ID);
        });
      } else this.chonCongDoansYS1 = [];
      if (this.allDepartmentTB) {
        this.departments.forEach((el) => {
          if (this.factory1.factoryId == 102366)
            this.chonCongDoansTB.push(el.ID);
        });
      } else this.chonCongDoansTB = [];
      if (this.allDepartmentTH) {
        this.departments.forEach((el) => {
          if (this.factory1.factoryId == 100000)
            this.chonCongDoansTH.push(el.ID);
        });
      } else {
        this.chonCongDoansTH = [];
      }
    },
    async loadListGroupDepartment() {
      const data = await this.getListGroupDepartment();
      this.listGroupDepartment = data;
    },
    async onChange(value) {
      this.allDepartment = false;

      let data = await this.getGroupDepartment();
      data = data.filter(
        (d) =>
          d.factoryId == this.factory1.factoryId &&
          this.congdoanton.includes(d.ID)
      );
      console.log("cong doan:", this.congdoanton);
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

      this.stepId = null;
      // this.data2 = congdoan;

      this.departments = data;

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
    this.loadData();
    this.loadListGroupDepartment();
    //  await this.getAllCongDoans({ factoryId:100000})
  },
  mounted() {},
};
</script>
<style>
#gridContainer {
  height: 700px;
}

.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: rgb(0 0 0 / 87%);
  background-color: #f7f7f7;
  font-weight: 900;
}

.active {
  color: #f6b024;
}
</style>
