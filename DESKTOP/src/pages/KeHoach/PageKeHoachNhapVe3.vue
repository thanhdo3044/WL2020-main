<template>
  <q-page padding>
    <q-banner class="text-orange">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div style="margin-top: 34px;" class="text-h6">
        Phê duyệt lệnh sản xuất
      </div>
      <div v-if="selection.length > 0">
        <q-btn
          class="q-ml-lg float-right"
          color="red"
          label="Xóa"
          @click="xoaLenhSanXuat"
        />
        <q-btn
          class="float-right"
          color="green-10"
          label="Phê duyệt"
          @click="guiPheDuyet"
        />
      </div>
    </q-banner>
    <q-card>
      <q-card-section>
        <div class="row">
          <div class="col-3" v-for="(lsx, key) in soLenhs" :key="key">
            <q-checkbox
              v-model="selection"
              :val="lsx"
              :label="lsx"
              color="teal"
              class="text-weight-bold"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <DxDataGrid
          :data-source="getPheDuyets(selection)"
          key-expr="id"
          :hover-state-enabled="true"
          :row-alternation-enabled="true"
          :selection="{ mode: 'single' }"
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
            width="120"
            alignment="center"
            :allowEditing="true"
          />
          <DxColumn
            data-field="hanMucTon"
            caption="Ton"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
            :visible="false"
          />
          <DxColumn
            data-field="canThucHien"
            caption="TH"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="false"
          />
          <DxColumn
            data-field="soLuongUuTien"
            caption="KHNV"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
            :visible="false"
          />
          <DxColumn
            data-field="ys1a"
            caption="YS1A"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
          />
          <DxColumn
            data-field="ys1b"
            caption="YS1B"
            data-type="number"
            width="120"
            alignment="center"
            :allowEditing="true"
          />
          <DxColumn
            data-field="ys4"
            caption="YS4"
            data-type="number"
            width="120"
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
  data() {
    return {
      dsLSXs: [],
      selection: [],
      selection1: []
    };
  },
  computed: {
    ...mapGetters("lenhSanXuats", [
      "lenhSanXuats",
      "keHoachSanXuats",
      "getPheDuyets",
      "soLenhs"
    ]),
    ...mapGetters("base", ["userInfo", "myFactoryInfor"])
  },
  methods: {
    ...mapActions("lenhSanXuats", [
      "getAllLenhSanXuats",
      "getLenhSanXuatCapPhois",
      "getsoLenhSanXuatCapPhois",
      "updatePo"
    ]),
    ...mapActions("po", ["getAllPoApproved", "sendApproved", "deletePos"]),
    async rowUpdated() {
      console.log("OK");
    },
    async loadData(stepId) {
      await this.getLenhSanXuatCapPhois(stepId);
      // this.selection = [...this.soLenhs];
      console.log("so dong lenh", this.selection);
    },
    async loadsolenh(stepId) {
      this.selection1 = await this.getsoLenhSanXuatCapPhois(stepId);

      console.log("so lenh", this.selection1.length);
    },
    async rowUpdating(e) {
      const { newData, oldData } = e;
      const { ys1a, ys1b, ys4, soLuongUuTien, factor, keHoach } = newData;
      const soLuongUuTienC = oldData.soLuongUuTien;
      const ys1aC = oldData.ys1a;
      const ys1bC = oldData.ys1b;
      const ys4C = oldData.ys4;
      if (ys1a !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} nhập về: ${ys1a}`,
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, ys1aC }
            });
            console.log(ketqua);
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          });
      if (ys1b !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} nhập về: ${ys1b}`,
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, ys1bC }
            });
            console.log(ketqua);
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          });
      if (ys4 !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} nhập về: ${ys4}`,
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            const ketqua = await this.updatePo({
              code: oldData.code,
              data: { ...newData, ys4C }
            });
            console.log(ketqua);
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          })
          .onCancel(() => {
            const { factoryId } = this.myFactoryInfor;
            this.loadData({ factoryId });
          });
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
      if (keHoach !== undefined)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: `${oldData.itemName} kế hoạch: ${keHoach}`,
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
    },
    xoaLenhSanXuat() {
      this.$q
        .dialog({
          title: "Xóa kế hoạch sản xuất",
          message: `<em>Bạn có muốn xóa lệnh sản xuất:</em><br /> <strong class="text-red">${this.selection.join(
            "<br />"
          )}</strong>`,
          cancel: true,
          persistent: true,
          html: true
        })
        .onOk(async () => {
          await this.deletePos({
            accountId: this.userInfo.id,
            poIds: this.selection
          });
          this.$router.go();
        });
    },
    guiPheDuyet() {
      if (this.selection1.length + this.selection.length > 4) {
        this.$q.dialog({
          title: "Phê duyệt lệnh sản xuất",
          message: `<span class="text-red">Bạn đã phê duyệt vượt quá số lượng lệnh sản xuất cho phép</span>"
          </strong>`,
          
          persistent: true,
          html: true
        });
      } else {
        this.$q
          .dialog({
            title: "Phê duyệt lệnh sản xuất",
            message: `<em>Bạn có muốn phê duyệt lệnh sản xuất:</em><br /> <strong class="text-primary">${this.selection.join(
              "<br />"
            )}</strong>`,
            cancel: true,
            persistent: true,
            html: true
          })
          .onOk(() => {
            this.sendApproved({
              accountId: this.userInfo.id,
              poIds: this.selection
            });
            this.$router.go();
          });
      }
   }
  },
  created() {
    const { factoryId } = this.myFactoryInfor;
    this.loadData({ factoryId });
    this.loadsolenh({ factoryId });
  }
};
</script>
