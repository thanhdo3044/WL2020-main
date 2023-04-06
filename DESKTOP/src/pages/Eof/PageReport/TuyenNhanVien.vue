<template>
  <q-page>
    <q-page-sticky expand position="top">
      <q-toolbar class="bg-primary text-orange q-pa-sm">
        <q-toolbar-title>Báo cáo chi tiết phiếu tuyển nhân viên</q-toolbar-title>
      </q-toolbar>
    </q-page-sticky>
    <div class="q-mt-xl row">
      <div class="col-2 q-pa-lg text-bold text-right">
        Tìm kiếm dữ liệu
      </div>
      <div class="q-pa-md col" style="max-width: 300px">
        <q-input filled v-model="dateStart" label="Thời gian từ : ">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  mask="YYYY-MM-DD"
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
        <q-input filled v-model="dateEnd" label="Thời gian đến : ">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date @input="searchData" mask="YYYY-MM-DD" v-model="dateEnd">
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
    <DxDataGrid class="q-ma-sm" :data-source="data.filter(e=>e.slug == 'tuyen-nhan-vien')" :show-borders="false">
      <DxFilterRow :visible="true" />
        <DxFilterPanel :visible="true" />
        <DxHeaderFilter :visible="true" />
      <DxColumn :width="70" sort-order="asc" data-field="number" caption="#" />
      <DxColumn data-field="title" caption="Phiếu đề xuất" />
      <DxColumn
        data-field="Account.lastName"
        sort-order="asc"
        caption="NV Đề xuất"
      />
      <DxColumn :width="150" data-field="Department.name" caption="Phòng ban" />
      <DxColumn
        :width="200"
        data-field="status"
        caption="Trạng thái phê duyệt"
      />
      <DxColumn
        v-if="this.userInfo.department == 102320"
        :width="150"
        data-field="activeSeen"
        caption="Xác nhận P VT"
        cell-template="cellTemplateActiveSeen"
      ></DxColumn>
      <DxColumn
        v-if="this.userInfo.department == 102319"
        :width="150"
        data-field="activeSeen"
        caption="Xác nhận P NS"
        cell-template="cellTemplateActiveSeen"
      />
      <DxColumn
        data-field="createdAt"
        cell-template="cellTemplateCreatedAt"
        caption="Ngày tạo"
      />
      <DxColumn
        :width="100"
        :allow-sorting="false"
        data-field="id"
        cell-template="cellTemplate"
        caption="Xem"
      />
      <!-- <DxColumn
        :width="150"
        :allow-sorting="false"
        data-field="id"
        cell-template="cellTemplateSuccess"
        caption="Xác nhận hoàn thành"
      /> -->
      <template #cellTemplate="{ data }">
        <a @click="activeSeen(data.value)" :href="'/#/print?id=' + data.value"
          >Xem</a
        >
      </template>
      <template #cellTemplateCreatedAt="{ data }">
        <a>{{ moment(data.value).format("l") }}</a>
      </template>
      <template #cellTemplateActiveSeen="{ data }">
        <a>{{ data.value == 1 ? "Đã xem" : "Chưa xem" }}</a>
      </template>
      <template #cellTemplateSuccess="{ data }">
        <a @click="activeSuccess(data.value)">
          Xác nhận
        </a>
      </template>
      <DxSorting mode="multiple" />
    </DxDataGrid>
  </q-page>
</template>

<script>
import { DxColumn, DxDataGrid, DxSorting,DxHeaderFilter,
  DxFilterRow,
  DxFilterPanel, } from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
export default {
  components: {
    DxColumn,
    DxDataGrid,
    DxSorting,
    DxHeaderFilter,
  DxFilterRow,
  DxFilterPanel,
  },
  methods: {
    ...mapActions("orders", [
      "getAllOrders",
      "getAllOrder",
      "activeSeenOrder",
      "activeSuccessOrder",
      "searchOrder"
    ]),
    async searchData() {
      localStorage.setItem("dateStart", this.dateStart);
      localStorage.setItem("dateEnd", this.dateEnd);
      let payload = {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd
      };
      let data = await this.searchOrder(payload);
      if (this.userInfo.department == 102320) {
        // vật tư
        this.data = await data.data.filter(
          e =>
            e.status == "Đã được duyệt" &&
            e.ProposalForm.parentId == 1024 &&
            e.activeSuccess == 0
        );
      } else if (this.userInfo.department == 102319) {
        // nhân sự
        this.data = await data.data.filter(
          e =>
            e.status == "Đã được duyệt" &&
            e.ProposalForm.parentId == 18 &&
            e.activeSuccess == 0
        );
      } else this.data = data.data.filter(e => e.activeSuccess == 0);
      console.log("dataSearch", this.data);
    },
    async activeSeen(id) {
      let payload = {
        id: id,
        activeSeen: 1
      };
      await this.activeSeenOrder(payload);
      await this.loadData();
    },
    async activeSuccess(id) {
      console.log("id");
      let payload = {
        id: id,
        activeSuccess: 1,
        nameSuccess: this.userInfo.account + " " + this.userInfo.lastName
      };
      await this.activeSuccessOrder(payload);
      await this.loadData();
    },
    async loadData() {
      this.dateStart = localStorage.getItem("dateStart");
      this.dateEnd = localStorage.getItem("dateEnd");
      let payload = {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd
      };
      let data = await this.searchOrder(payload);
      if (this.userInfo.department == 102320) {
        // vật tư
        this.data = await data.data.filter(
          e =>
            e.status == "Đã được duyệt" &&
            e.ProposalForm.parentId == 1024 &&
            e.activeSuccess == 0
        );
      } else if (this.userInfo.department == 102319) {
        // nhân sự
        this.data = await data.data.filter(
          e =>
            e.status == "Đã được duyệt" &&
            e.ProposalForm.parentId == 18 &&
            e.activeSuccess == 0
        );
      } else this.data = data.data.filter(e => e.activeSuccess == 0);
      console.log("dataSearch", this.data);
    }
  },
  computed: {
    ...mapGetters("orders", ["orders"]),
    ...mapGetters("base", ["userInfo"])
  },
  data() {
    return {
      data: null,
      dateStart: null,
      dateEnd: null
    };
  },
  async created() {
    let getData = await this.getAllOrder();
    await this.loadData();
  }
};
</script>
