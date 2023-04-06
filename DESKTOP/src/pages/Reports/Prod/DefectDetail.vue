<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo thống kê lỗi các công đoạn -
          <span class="text-amber-14">{{ factory ? factory.label : "" }}</span>
        </div>

        <div
          class="col-6 cursor-pointer text-blue text-bold"
          style="font-size: 18px"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
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
                v-for="(congDoan, index) in factories"
                :key="index"
              >
                <q-radio
                  dense
                  @input="changeFactory"
                  v-model="factory"
                  :val="congDoan"
                  :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  v-bind:class="{ isActive: true }"
                  color="amber-6"
                />
              </div>
            </div>
          </div>
          <div class="col-4" align="right">
          </div>
        </div>
      </div>
      </q-card>
      <div class="row">
        <div class="col-12">
          <DxDataGrid
          id="defectDetail2"
            :data-source="dataSource"
            :show-borders="true"
            :no-data-text="'Không có dữ liệu !'"
            @row-removed="rowRemoved"
          >
            <DxEditing :allow-deleting="isDelete" mode="row" />
            <DxHeaderFilter :visible="true" />
            <DxScrolling mode="virtual" />
            <DxExport
              :enabled="true"
              :allow-export-selected-data="false"
              :file-name="
                'Báo cáo hàng đến kho QC xử lý từ ngày ' +
                tuNgay +
                ' đến ngày ' +
                denNgay
              "
            />
            <DxSearchPanel
              :visible="true"
              :placeholder="'Tìm kiếm'"
              :width="400"
            />
            <DxColumn data-field="Tuần" caption="Tuần" :width="100" />
            <DxColumn data-field="noibaoloi" caption="Nơi báo lỗi" :width="150" />
            <DxColumn data-field="congdoan" caption="Nguồn lỗi" :width="150" />
            <DxColumn data-field="Chi tiết/cụm" caption="Chi tiết/cụm" />
            <DxColumn caption="Quy cách" alignment="center">
              <DxColumn
                data-field="LENGTH"
                caption="Dài"
                :width="90"
                alignment="center"
              />
              <DxColumn
                data-field="WIDTH"
                caption="Rộng"
                :width="90"
                alignment="center"
              />
              <DxColumn
                data-field="HEIGHT"
                caption="Dày"
                :width="90"
                alignment="center"
              />
            </DxColumn>

            <DxColumn data-field="QUANTITY" caption="Số lượng" :width="100" />
            <DxColumn data-field="Người tạo" caption="Người tạo" :width="150" />
            <DxColumn
              data-field="Ngày tạo"
              caption="Ngày tạo"
              data-type="date"
              format="dd/MM/yyyy"
              :width="120"
            />
            <DxColumn
              data-field="Người nhận"
              caption="Người nhận"
              :width="150"
            />
            <DxColumn
              data-field="Ngày nhận"
              caption="Ngày nhận"
              data-type="date"
              format="dd/MM/yyyy"
              :width="120"
            />
            <DxSummary>
              <DxTotalItem
                column="Tuần"
                summary-type="count"
                value-format="fixedpoint"
                display-format="Tổng cộng : "
                show-in-column="Chi tiết/cụm"
              />

              <DxTotalItem
                column="Số lượng"
                summary-type="sum"
                value-format="###0.0###"
                display-format="{0}"
              />
            </DxSummary>
          </DxDataGrid>
        </div>
      </div>
    </div>
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxExport,
  DxHeaderFilter,
  DxSummary,
  DxGroupItem,
  DxTotalItem,
  DxScrolling
} from "devextreme-vue/data-grid";
import { DxDateBox } from "devextreme-vue";
import { mapGetters, mapActions } from "vuex";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
  showNotifySuccess,
  showNotifyError,
} from "../../../ultils";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxEditing,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxDateBox,
    DxExport,
    DxHeaderFilter,
    DialogSelectDate,
    DxSummary,
    DxGroupItem,
    DxTotalItem,
    DxScrolling
  },
  data() {
    return {
      dataSource: [],
      myFactoryId: null,
      fromDate: null,
      toDate: null,
      showChooseDate: false,
      factories: [
        {
          label: "NM CGB Thuận Hưng",
          id: 100000,
        },
        {
          label: "NM CGB Yên Sơn 1",
          id: 102340,
        },
        {
          label: "NM CGB Thái Bình",
          id: 102366,
        },
      ],
      factory: null,
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      isApprove: false,
      isReject: false,
    };
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
    ...mapGetters("base", ["myFactoryInfor", "userInfo"]),
  },
  created() {
    this.loadPermission();
    this.toDate = new Date();
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load();
  },
  methods: {
    ...mapActions("production", ["deletePackageloi"]),
    ...mapActions("prod", ["getPermissionInScreen"]),
    async loadPermission() {
      console.log("path", this.$route.path);
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.getPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((el) => {
        if (el.CODE == "approve") {
          this.isApprove = true;
        }
        if (el.CODE == "reject") {
          this.isReject = true;
        }
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
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.load();
    },
    async rowRemoved(e) {
      console.log("ID:", e);
      const payload = {
        packageId: e.data.ID,
      };
      let data = await this.$store.dispatch(
        "prod/DELETE_REPORT_RESULT_DETAIL",
        payload
      );
      if (data.meta.success) {
        const payload2 = {
          packageId: e.data.ID,
          itemInPackageId: data.data[0].ID,
        };
        let data2 = await this.$store.dispatch(
          "prod/DELETE_REPORT_RESULT_DETAIL2",
          payload2
        );
        if (data2.meta.success) {
          // const payload = {
          //   sourceId: e.data.SOURCE_ID,
          //   destinationId: 100081,
          //   itemFromId: 100081,
          //   itemId: e.data.ITEM_ID,
          //   quantity: -e.data.QUANTITY,
          //   ID: e.data.ID,
          //   typeId: 100004, //100026,//100004

          //   po: e.data.PO,
          // };
          // const data = await this.deletePackageloi(payload);
          showNotifySuccess("Xóa Thành công");
        } else {
          showNotifyError();
        }
      }
      this.load(this.factory.factoryId);
    },
    async load() {
      if (this.factory.id == 100000) this.myFactoryId = 100000;
      if (this.factory.id == 102339) this.myFactoryId = 100003;
      if (this.factory.id == 102340) this.myFactoryId = 100004;
      if (this.factory.id == 102366) this.myFactoryId = 100005;
      if (this.myFactoryId) {
        let payload = {
          fromDate: formatDateISO(this.fromDate),
          toDate: formatDateISO(this.toDate),
          factoryId: this.myFactoryId,
          departmentId: this.factory ? this.factory.id : 0,
        };
        const data = await this.$store.dispatch(
          "prod/GET_REPORT_DEFECT_DETAIL",
          payload
        );
        this.dataSource = data.data;
      }
    },
    async changeFactory() {
      await this.load();
    },
  },
};
</script>

<style>
#defectDetail2{
    height: 700px;
}
</style>