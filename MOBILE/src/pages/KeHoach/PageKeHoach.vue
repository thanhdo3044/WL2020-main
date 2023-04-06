<template>
  <q-page padding>
    <q-banner class="bg-primary text-orange">
      <div class="text-h6 orange">
        <span color="orange">Kế hoạch sản xuất</span>
      </div>
    </q-banner>
    <div class="row">
      <div class="col-3">
        <q-card>
          <q-card-section>
            <div class="text-h6">Lệnh sản xuất</div>
          </q-card-section>
          <q-card-section>
            <DxDataGrid
              :data-source="lenhSanXuats"
              :selection="{ mode: 'single' }"
              :show-borders="true"
              :hover-state-enabled="true"
              key-expr="id"
              @selection-changed="onSelectionChanged"
            >
              <DxColumn data-field="number" caption="Lệnh sản xuất" />
            </DxDataGrid>
          </q-card-section>
        </q-card>
      </div>
      <div class="col">
        <div v-if="showEmployeeInfo" id="employee-info">
          <q-card>
            <q-card-section>
              <div class="text-h6">Lệnh sản xuất</div>
            </q-card-section>
            <q-card-section>
              <DxDataGrid
                :data-source="keHoachSanXuats"
                :selection="{ mode: 'single' }"
                :show-borders="true"
                :hover-state-enabled="true"
                key-expr="id"
              >
                <DxColumnChooser :enabled="true" />
                <DxHeaderFilter :visible="true" />
                <DxGroupPanel
                  :visible="true"
                  :empty-panel-text="
                    'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'
                  "
                />
                <DxScrolling mode="infinite" />
                <DxGrouping :auto-expand-all="true" />
                <DxColumn
                  data-field="number"
                  caption="Lệnh sản xuất"
                  width="120"
                />
                <!-- <DxColumn data-field="itemId" caption="ID" width="80" />
                <DxColumn data-field="itemCode" caption="CODE" width="110" /> -->
                <DxColumn data-field="itemName" caption="SP/Chi tiết" />
                <DxColumn
                  data-field="market"
                  caption="Mã thị trường"
                  width="100"
                />

                <DxColumn
                  data-field="stepName"
                  caption="Công đoạn"
                  :group-index="1"
                  :sort-index="1"
                  sort-order="desc"
                />
                <DxColumn caption="Qui Cách" alignment="center">
                  <DxColumn
                    caption="Dầy"
                    data-field="itemHeight"
                    alignment="center"
                    width="60"
                  />
                  <DxColumn
                    caption="Rộng"
                    data-field="itemWidth"
                    alignment="center"
                    width="60"
                  />
                  <DxColumn
                    caption="Dài"
                    data-field="itemLength"
                    alignment="center"
                    width="60"
                  />
                </DxColumn>
                <DxColumn
                  data-field="keHoach"
                  caption="KHĐG"
                  data-type="number"
                  width="100"
                  alignment="center"
                />
                <DxColumn
                  data-field="ngayDongGoi"
                  caption="Ngày"
                  width="100"
                  alignment="center"
                  data-type="date"
                />
                <DxExport
                  :enabled="true"
                  :allow-export-selected-data="false"
                  :file-name="'In KHSX'"
                />
                <DxSearchPanel
                  :visible="true"
                  :placeholder="'Tìm kiếm'"
                  :width="400"
                />
              </DxDataGrid>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxExport,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupPanel,
  DxScrolling,
  DxGrouping
} from "devextreme-vue/data-grid";
export default {
  // name: 'PageName',
  components: {
    DxDataGrid,
    DxColumn,
    DxSearchPanel,
    DxExport,
    DxColumnChooser,
    DxHeaderFilter,
    DxGroupPanel,
    DxScrolling,
    DxGrouping
  },
  data() {
    return {
      showEmployeeInfo: false,
      selectedRowLenhSanXuat: ""
    };
  },
  computed: {
    ...mapGetters("lenhSanXuats", ["lenhSanXuats", "keHoachSanXuats"])
  },
  methods: {
    ...mapActions("lenhSanXuats", [
      "getAllLenhSanXuats",
      "getLenhSanXuatChiTiets"
    ]),
    async loadKeHoachChiTiet(poNumber) {
      this.getLenhSanXuatChiTiets({
        number: poNumber
      });
    },
    onSelectionChanged({ selectedRowsData }) {
      console.log(selectedRowsData[0]);
      const data = selectedRowsData[0];

      this.showEmployeeInfo = !!data;
      this.selectedRowLenhSanXuat = data;
      this.loadKeHoachChiTiet(data.number);
      // this.selectedRowPicture = data && data.Picture;
    }
  },
  created() {
    this.getAllLenhSanXuats();
  }
};
</script>
