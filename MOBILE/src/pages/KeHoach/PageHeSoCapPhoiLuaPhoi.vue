<template>
  <q-page padding>
    <q-banner class="bg-primary text-orange">
      <div class="text-h6 orange">
        Sửa kế hoạch
      </div>
    </q-banner>
    <q-card>
      <q-card-section>
        <DxDataGrid
          :data-source="keHoachSanXuats"
          key-expr="id"
          @row-updated="rowUpdated"
          @row-updating="rowUpdating"
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
          <DxEditing :allow-updating="true" mode="cell" />

          <DxColumn
            data-field="itemName"
            caption="SP/Chi tiết"
            :allowEditing="false"
          />
          <DxColumn
            data-field="market"
            caption="Mã thị trường"
            width="100"
            :allowEditing="false"
          />

          <DxColumn
            data-field="stepName"
            caption="Công đoạn"
            :group-index="1"
            :sort-index="1"
            sort-order="desc"
            :allowEditing="false"
          />
          <DxColumn caption="Qui Cách" alignment="center" :allowEditing="false">
            <DxColumn
              caption="Dầy"
              data-field="itemHeight"
              alignment="center"
              width="60"
              :allowEditing="false"
            />
            <DxColumn
              caption="Rộng"
              data-field="itemWidth"
              alignment="center"
              width="60"
              :allowEditing="false"
            />
            <DxColumn
              caption="Dài"
              data-field="itemLength"
              alignment="center"
              width="60"
              :allowEditing="false"
            />
          </DxColumn>
          <DxColumn
            data-field="number"
            caption="Lệnh sản xuất"
            width="120"
            :allowEditing="false"
          />
          <DxColumn
            data-field="keHoach"
            caption="KHĐG"
            data-type="number"
            width="100"
            alignment="center"
            :allowEditing="false"
          />
          <DxColumn
            data-field="soLuongUuTien"
            caption="Nhập về"
            data-type="number"
            width="100"
            alignment="center"
            :allowEditing="false"
          />
          <DxColumn
            data-field="hanMucTon"
            caption="Giảm trừ"
            data-type="number"
            width="100"
            alignment="center"
            :allowEditing="false"
          />
          <DxColumn
            data-field="ngayDongGoi"
            caption="Ngày"
            width="100"
            alignment="center"
            data-type="date"
            :allowEditing="false"
          />
          <DxColumn
            data-field="factor"
            caption="Hệ số phôi"
            data-type="number"
            width="100"
            alignment="center"
            :allowEditing="true"
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
    <!-- <div class="row">
      <div class="col-3 q-pa-md">
        <q-card padding>
          <q-card-section>
            <div class="text-h6">
              Công đoạn lựa phôi
            </div>
          </q-card-section>
        </q-card>
        <q-card padding>
          <q-card-section>
            <div class="text-h6">
              Lệnh sản xuất
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col q-pa-md"></div>
    </div> -->
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxExport,
  DxEditing,
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
    DxEditing,
    DxColumnChooser,
    DxHeaderFilter,
    DxGroupPanel,
    DxScrolling,
    DxGrouping
  },
  computed: {
    ...mapGetters("lenhSanXuats", ["lenhSanXuats", "keHoachSanXuats"]),
    ...mapGetters("base", ["myFactoryInfor"])
  },
  methods: {
    ...mapActions("lenhSanXuats", [
      "getAllLenhSanXuats",
      "getLenhSanXuatCapPhois",
      "updatePo"
    ]),
    async rowUpdated() {
      console.log("OK");
    },
    async loadData(stepId) {
      this.getLenhSanXuatCapPhois(stepId);
    },
    async rowUpdating(e) {
      const { newData, oldData } = e;
      const { soLuongUuTien, factor } = newData;
      const soLuongUuTienC = oldData.soLuongUuTien;
      if (soLuongUuTien !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} nhập về: ${soLuongUuTien}`,
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, soLuongUuTienC }
            });
            console.log(ketqua);
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          });
      if (factor !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} hệ số phôi: ${factor}`,
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: newData
            });
            console.log(ketqua);
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          });
    }
  },
  created() {
    const { factoryId } = this.myFactoryInfor;
    this.loadData({ factoryId });
  }
};
</script>
