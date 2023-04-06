<template>
  <div>
    <q-banner class="bg-primary text-orange q-ma-sm">
      <div class="text-h6">Thống kê chi tiết phiếu xác nhận công</div>
    </q-banner>
    <div class="q-mt-xl row">
        <div class="col-2 q-pa-lg text-bold text-right">Tìm kiếm dữ liệu</div>
        <div class="q-pa-md col" style="max-width: 300px">
          <q-input
            filled
            v-model="dateStart"
            fill-mask
            mask="####-##-## ##:##"
            label="Thời gian từ"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    mask="YYYY-MM-DD HH:mm"
                    @input="searchData"
                    v-model="dateStart"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="q-pa-md col" style="max-width: 300px">
          <q-input
            filled
            v-model="dateEnd"
            fill-mask
            mask="####-##-## ##:##"
            label="Thời gian đến"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    @input="searchData"
                    mask="YYYY-MM-DD HH:mm"
                    v-model="dateEnd"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
    <div class="q-ma-sm">
      <DxDataGrid
        :allow-column-reordering="true"
        :data-source="customers"
        :show-borders="true"
        :hover-state-enabled="true"
        :show-row-lines="true"
      >
        <DxExport :enabled="true" :allow-export-selected-data="true" :file-name="title" />
        <DxFilterRow :visible="true" />
        <DxFilterPanel :visible="true" />
        <DxHeaderFilter :visible="true" />
        <DxColumn data-field="Account.account" caption="Mã nhân viên" />
        <DxColumn data-field="Account.lastName" caption="Họ và Tên" />
        <DxColumn data-field="work" caption="Nội dung xác nhận" /> 
        <DxColumn data-field="date" caption="Ngày lỗi công" /> 
        <DxColumn data-field="hoursIn" caption="Thời gian vào" />
        <DxColumn data-field="hoursOut" caption="Thời gian ra" />
        <DxColumn data-field="total" caption="Biển số xe" />
        <!-- <DxColumn data-field="timeOutActive" caption="BV xác nhận giờ ra" /> -->
        <!-- <DxColumn data-field="statusRequests" caption="Trạng thái" /> -->
        <DxColumn data-field="status" caption="Trạng thái" />
        <DxColumn data-field="createdAt" cell-template="cellTemplateCreatedAt" :allow-exporting="true" caption="Ngày tạo phiếu" />
        <DxColumn
          :group-index="0"
          caption="Phòng ban"
          data-field="Department.name"
          value="Department.name"
        />
        <DxGroupPanel :visible="true" />
        <DxGrouping :auto-expand-all="autoExpandAll" />
        <DxPaging :page-size="1000" />
        <DxSearchPanel :visible="true" />
        <template #cellTemplateCreatedAt="{ data }">
        <a>{{ moment(data.value).format("l") }}</a>
      </template>
      </DxDataGrid>

      <div class="options">
        <div class="caption">Tùy chọn</div>
        <div class="option">
          <DxCheckBox
            v-model:value="autoExpandAll"
            text="Ẩn hiện chi tiết dữ liệu"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DxCheckBox from "devextreme-vue/check-box";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxSearchPanel,
  DxPaging,
  DxHeaderFilter,
  DxFilterRow,
  DxFilterPanel,
  DxExport
} from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";

const statuses = [
  "Not Started",
  "Need Assistance",
  "In Progress",
  "Deferred",
  "Completed"
];

export default {
  components: {
    DxCheckBox,
    DxColumn,
    DxGroupPanel,
    DxGrouping,
    DxPaging,
    DxSearchPanel,
    DxDataGrid,
    DxHeaderFilter,
    DxFilterRow,
    DxFilterPanel,
    DxExport
  },
  computed: {
    ...mapGetters("orders", ["orders"]),
    ...mapGetters("base", ["userInfo"])
  },
  data() {
    return {
      expandedRowKeys: [1, 2],
      selectedRowKeys: [1, 29, 42],
      dataSource: null,
      dataBiding: [],
      customers: [],
      autoExpandAll: true,
      dateStart: moment().startOf("month").format("YYYY-MM-DD HH:mm"),
      dateEnd: moment().format("YYYY-MM-DD HH:mm"),
      title:""
    };
  },
  async created() {
    this.title ="Phiếu xác nhận công ngày " + moment().format('DD-MM-YYYY')
    this.customers =[];
    this.dateStart = localStorage.getItem("dateStart");
      this.dateEnd = localStorage.getItem("dateEnd");

      let payload = {
        dateStart: moment(this.dateStart).format("YYYY-MM-DD 00:00"),
        dateEnd: moment(this.dateEnd).format("YYYY-MM-DD 23:59"),
        idDepartment:this.userInfo.department,
        activeSuccess:4
      };
      let { data } = await this.searchOrder(payload);
    // let { data } = await this.getAllOrder();
    
    console.log(data);
    //lọc dữ liệu làm thêm giờ
    data.forEach(async element => {
      
        this.dataBiding.push({
          lastName: element.Account.lastName,
          id: element.id,
          account: element.Account.account
        });
            await element.OrderMeta.forEach(e => {
              if (e.maNV != null) {
                this.customers.push({
                  ...e,
                  ...element,
                  timeInActive: data.timeVTAcceptEnd,
                  timeOutActive: data.timeVTAccept
                });
              }
            });
      
    });
    console.log("dataBiding", this.customers);
  },
  methods: {
    ...mapActions("orders", ["getAllOrders", "getAllOrder", "activeSeenOrder","searchOrder"]),
    async searchData() {
      this.customers =[];
      let payload = {
        dateStart: moment(this.dateStart).format("YYYY-MM-DD 00:00"),
        dateEnd: moment(this.dateEnd).format("YYYY-MM-DD 23:59"),
        idDepartment:this.userInfo.department,
        activeSuccess:4
      };
      let {data} = await this.searchOrder(payload);
      this.title ="Phiếu xác nhận công ngày " + moment().format('DD-MM-YYYY')
      console.log('this.dataFilter ',this.dataFilter )
      //lọc dữ liệu xác nhận công
    data.forEach(async element => {
      
        this.dataBiding.push({
          lastName: element.Account.lastName,
          id: element.id,
          account: element.Account.account
        });
            await element.OrderMeta.forEach(e => {
              if (e.maNV != null) {
                this.customers.push({
                  ...e,
                  ...element,
                  timeInActive: data.timeVTAcceptEnd,
                  timeOutActive: data.timeVTAccept
                });
              }
            });
      
    });
      console.log("dataSearch", this.customers);
    },

    customizeTaskCompletionText(cellInfo) {
      return `${cellInfo.valueText}%`;
    }
  }
};
</script>
<style>
#tasks {
  max-height: 540px;
}
#tasks .dx-treelist-rowsview td {
  vertical-align: middle;
}
</style>
