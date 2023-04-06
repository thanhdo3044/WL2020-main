<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-6 top-title text-orange">
            Báo cáo Nhập Xuất Tồn từng công đoạn sản xuất -
            {{ myFactoryInfor.name }}
          </div>
          <div
            class="col-6 top-title cursor-pointer text-orange"
            align="right"
            @click="showChooseDate = true"
          >
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
          </div>
          <div v-if="showVolumnColumn">
            <q-toggle
              v-model="showVolumnColumn"
              class="text-orange"
              label="Ẩn thị cột Số lượng"
            />
          </div>
          <div v-else>
            <q-toggle
              v-model="showVolumnColumn"
              class="text-orange"
              label="Hiển thị cột Số lượng"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
              :data-source="packages"
              :show-borders="true"
              :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
              :show-column-lines="true"
              :allow-column-resizing="true"
            >
              <DxColumnChooser :enabled="true" />
              <DxHeaderFilter :visible="true" />
              <DxGroupPanel
                :visible="true"
                :empty-panel-text="
                  'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'
                "
              />
              <DxGrouping :auto-expand-all="true" />
              <DxColumn
                data-field="name"
                caption="Công đoạn"
                :group-index="0"
                :sort-index="0"
                sort-order="desc"
              />
              <DxColumn data-field="tenSP" caption="Tên Sản Phẩm" />
              <!-- <DxColumn data-field="name" caption="Công đoạn" /> -->
              <DxColumn caption="Tồn đầu kỳ" alignment="center">
                <DxColumn
                  data-field="tonDauKy"
                  caption="Số lượng"
                  :visible="showVolumnColumn"
                />
                <DxColumn
                  data-field="khoiLuongTonDauKy"
                  caption="M3"
                  data-type="number"
                  format="#,##0.00"
                />
              </DxColumn>
              <DxColumn caption="Nhập" alignment="center">
                <DxColumn
                  data-field="QUANTITY"
                  caption="Số lượng"
                  data-type="number"
                  format="fixedpoint"
                  :visible="showVolumnColumn"
                />
                <DxColumn
                  data-field="khoiLuongNhan"
                  caption="M3"
                  data-type="number"
                  format="#,##0.00"
                />
              </DxColumn>
              <DxColumn caption="Xuất" alignment="center">
                <DxColumn
                  data-field="soLuongXuat"
                  caption="Số lượng"
                  :visible="showVolumnColumn"
                />
                <DxColumn
                  data-field="khoiLuongXuat"
                  caption="M3"
                  data-type="number"
                  format="#,##0.00"
                />
              </DxColumn>

              <DxColumn caption="Tồn cuối kỳ" alignment="center">
                <DxColumn
                  data-field="tonCuoiKy"
                  caption="Số lượng"
                  :visible="showVolumnColumn"
                />
                <DxColumn
                  data-field="khoiLuongTonCuoiKy"
                  caption="M3"
                  data-type="number"
                  format="#,##0.00"
                />
              </DxColumn>
              <DxSummary>
                <DxGroupItem
                  column="QUANTITY"
                  summary-type="sum"
                  data-type="number"
                  :show-in-group-footer="false"
                  :align-by-column="true"
                  :display-format="'{0}'"
                  :value-format="'fixedpoint'"
                />
              </DxSummary>
              <DxExport
                :enabled="true"
                :allow-export-selected-data="false"
                :file-name="
                  'Dữ liệu sản xuất chi tiết từ ngày ' +
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
            </DxDataGrid>
          </div>
        </div>
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
  DxSummary,
  DxGroupItem,
  DxHeaderFilter,
  DxColumnChooser,
} from "devextreme-vue/data-grid";
import DialogSelectDate from "../../../components/commons/DialogSelectFromDateToDate";
import { formatDateVN } from "../../../ultils";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      showChooseDate: false,
      fromDate: moment().subtract(7, "days"),
      toDate: moment(),
      showVolumnColumn: false
    };
  },
  computed: {
    ...mapGetters("itemInPackages", ["packages"]),
    ...mapGetters("base", ["myFactoryInfor"]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    }
  },
  created() {
    this.load();
  },
  methods: {
    ...mapActions("itemInPackages", ["getAllPackage"]),

    async load() {
      let payload = {
        fromDate: moment(this.fromDate)
          .format()
          .slice(0, 10),
        toDate: moment(this.toDate)
          .add(1, "days")
          .format()
          .slice(0, 10),
        factoryId: this.myFactoryInfor.id
      };
      this.getAllPackage(payload);
    },

    cancelChooseDate() {
      this.showChooseDate = false;
    },

    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.load();
    }
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxSearchPanel,
    DxExport,
    DialogSelectDate,
    DxSummary,
    DxGroupItem,
    DxHeaderFilter,
    DxColumnChooser
  }
};
</script>

<style></style>
