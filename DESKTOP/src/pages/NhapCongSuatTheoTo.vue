<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Nhập công suất theo tổ -
          <span class="text-amber-14">{{ factory ? factory.label : "" }}</span>
        </div>
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
                  @input="loadDepartment"
                  v-model="factory"
                  :val="congDoan"
                  :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  color="amber-6"
                />
              </div>
            </div>
          </div>
          <div class="col-4" align="right">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <DxDataGrid
            :data-source="dataSource"
            :show-borders="true"
            :show-row-lines="true"
            :word-wrap-enabled="true"
            :no-data-text="'Vui lòng chọn công đoạn'"
            :show-column-lines="true"
            :allow-column-resizing="true"
            @cell-prepared="onCellPrepared"
            @row-updating="rowUpdating"
          >
          <DxEditing :allow-updating="isUpdate" mode="batch" />
          <DxScrolling mode="infinite" />
            
            <DxColumn
          data-field="GROUP_NAME"
          caption=""
          :group-index="0"
          group-cell-template="groupCellTemplate"
          :sort-index="0"
          sort-order="asc"
        />
        <template #groupCellTemplate="{ data }">
          <div style="font-weight: bold">{{ data.value.substring(2) }}</div>
        </template>
            <DxColumn
              data-field="NAME"
              caption="Tên"
              width="300"
              :allowEditing="false"
            />
            <DxColumn
              data-field="CONG_SUAT_TUAN"
              width="100"
              format="#,##0.00"
              caption="Định mức (M³/Tuần)"
            />
            <DxColumn
              data-field="GHI_CHU"
              caption="Ghi chú"
              width="400"
            />
          </DxDataGrid>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { DxDataGrid, DxColumn,DxEditing,DxScrolling } from "devextreme-vue/data-grid";
import { mapGetters, mapActions } from "vuex";
import { showNotifySuccess, showNotifyError } from "../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxScrolling
  },
  data() {
    return {
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
        // {
        //   label: "Nhà máy CBG Quang Minh",
        //   id: 102427,
        //   code: "QM",
        // },
      ],
      factory: null,
      dataSource: [],
      isUpdate: false,
      listPermission: [],
    };
  },
  created(){
    this.loadPermission();
  },
  computed: {
    ...mapGetters("base", ["userInfo"])
  },
  methods:{
    ...mapActions("prod", [
      "getDepartmentCongSuat",
      "updateCongSuatTuan",
      "getPermissionInScreen"
    ]),
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
    async loadPermission() {
      console.log("router dinh tuyen", this.$route.path);
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.getPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((el) => {
        if (el.CODE == "update") {
          this.isUpdate = true;
        }
      });
    },
    async loadDepartment(){
      this.load();
    },
    async load(){
      const payload = {
        factoryId: this.factory.id
      }
      const data = await this.getDepartmentCongSuat(payload);
      this.dataSource = data;
    },
    async rowUpdating(e){
      console.log("e", e)
      const payload = {
        departmentId: e.key.ID,
        congSuatTuan: e.newData.CONG_SUAT_TUAN ? e.newData.CONG_SUAT_TUAN : e.oldData.CONG_SUAT_TUAN,
        ghiChu: e.newData.GHI_CHU ? e.newData.GHI_CHU : e.oldData.GHI_CHU,
      }
      const data = await this.updateCongSuatTuan(payload);
      if(data.meta.success){
        showNotifySuccess();
      }else{
        showNotifyError();
      }
    }
  }
};
</script>

<style>
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  font-weight: 500;
  background-color: white;
  width: 280;
}
.dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  border-bottom: 1px solid #ddd;
  font-size: 13px;
  font-weight: bold;
}
.dx-datagrid-summary-item {
  color: black;
  font-weight: 500;
}
.dx-datagrid .dx-row > td {
  font-size: 16px;
}
</style>