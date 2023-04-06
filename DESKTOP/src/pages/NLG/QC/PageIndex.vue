<template>
  <q-page>
    <q-banner class="bg-primary text-orange">
      <div class="row">
        <div class="col-6  text-h6 orange">
          <span color="orange">Danh sách phiếu nhập kho</span>
        </div>
        <div
          class="col-6 top-title cursor-pointer text-orange"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày {{ moment(fromDate).format("L") }} đến
          {{ moment(toDate).format("L") }}
        </div>
      </div>
    </q-banner>
    <q-card>
      <q-card-section>
        <div class="row">
          <div class="col-2">
            <q-select
              color="grey-3"
              outlined
              label-color="orange"
              v-model="kho"
              :options="getAllKhos"
              label="Chọn kho"
              :readonly="true"
              dense
            >
              <template v-slot:append>
                <q-icon name="event" color="orange" />
              </template>
            </q-select>
          </div>
          <div class="col-9"></div>
        </div>
      </q-card-section>
      <q-card-section v-if="phieuNhapKhos.length">
        <DxDataGrid
          :data-source="phieuNhapKhos"
          :show-borders="true"
          :no-data-text="'Không có dữ liệu !'"
          :show-column-lines="true"
          :allow-column-resizing="true"
        >
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Báo cáo sản xuất từ ngày '"
          />
          <DxHeaderFilter :visible="true" />
          <DxGroupPanel
            :visible="true"
            :empty-panel-text="
              'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'
            "
          />
          <DxGrouping :auto-expand-all="true" />
          <DxSearchPanel
            :visible="true"
            :placeholder="'Tìm kiếm'"
            :width="400"
          />
          <DxColumn data-field="SOPHIEU" caption="Số phiếu" />
          <DxColumn data-field="ACTUALDATE" caption="Ngày" data-type="date" />
          <DxColumn :width="100" data-field="MANCC" caption="Mã NCC" />
          <DxColumn :width="230" data-field="NAME" caption="Tên Nhà cung cấp" />
          <DxColumn :width="100" data-field="MAKHO" caption="Mã Kho" />
          <DxColumn data-field="BIENSOXE" caption="Biển số xe" />
          <!-- <DxColumn data-field="CREATED_BY" caption="MNV" /> -->
          <DxColumn
            data-field="CREATED_AT"
            caption="Ngày tạo"
            cell-template="created-at-template"
          />
          <DxColumn caption="..." cell-template="edit-template" />
          <template #created-at-template="{data}">
            {{ moment(data.value.slice(0, 10)).fromNow() }}
          </template>
          <template #edit-template="{data}">
            <div>
              <span
                v-if="data.data.ALLOWHACAP.toString().trim() === 'Y'"
                @click="view(data.data.SOPHIEU)"
                class="fake-link"
                >Nghiệm thu</span
              >
              <span v-else @click="go(data.data.SOPHIEU)" class="fake-link"
                >Xem</span
              >
            </div>
          </template>
        </DxDataGrid>
      </q-card-section>
    </q-card>
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
  DxGrouping,
  DxGroupPanel,
  DxSearchPanel,
  DxExport,
  DxHeaderFilter
} from "devextreme-vue/data-grid";
import { mapGetters, mapActions } from "vuex";
import DialogSelectDate from "components/commons/DialogSelectFromDateToDate";
import moment from "moment";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxSearchPanel,
    DxExport,
    DxHeaderFilter,
    DialogSelectDate
  },
  data() {
    return {
      showChooseDate: false,
      dataSource: [],
      showAddPhieu: false,
      kho: null,
      dskho: [],
      today: "2020/04/03",
      dsNcc: [],
      ncc: null,
      guid: "",
      fromDate: moment().startOf("month"),
      toDate: moment(),
      dupplicateNcc: [],
      ngaynhapkho: new Date(),
      xuongxenang: [
        { id: "N", name: "Xưởng xuống tay" },
        { id: "Y", name: "Xuống xe nâng" }
      ],
      bsx: "",
      showConfirm: false,
      f_ngaynhapkho: "",
      f_kho: "ALL",
      f_ncc: null,
      f_xuongxenang: null,
      f_bsx: ""
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("nlg", ["getKhoByAccount", "getAllKhos", "phieuNhapKhos"])
  },
  created() {
    this.kho = this.getKhoByAccount(this.userInfo);
    this.loadData();
  },
  methods: {
    ...mapActions("nlg", ["getPhieuNhapKhos"]),
    go(guid) {
      this.$router.push("/nlg-bb-nghiem-thu/" + guid.replace("/", "-"));
    },
    view(guid) {
      this.$router.push({
        path: "nlg-nghiem-thu1",
        query: { plan: guid.replace("/", "-") }
      });
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async loadData() {
      await this.getPhieuNhapKhos({
        fromDate: moment(this.fromDate)
          .format()
          .slice(0, 10),
        toDate: moment(this.toDate)
          .add(1, "days")
          .format()
          .slice(0, 10),
        kho: this.kho
      });
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadData();
    }
  }
};
</script>
