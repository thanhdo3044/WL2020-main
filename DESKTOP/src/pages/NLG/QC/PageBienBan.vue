<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-10 top-title">
            BẢNG KÊ VÀ SỐ LIỆU NGHIỆM THU GỖ XẺ
          </div>
          <div class="col-2 print-hide" align="right">
            <q-btn color="primary" label="Hoàn thành" @click="completed" />
          </div>
        </div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <BoxSoPhieu :phieunhapkho="phieunhapkho" />
      </q-card-section>
      <q-card-section v-if="dataSourceF && dataSourceF.length">
        <DxTreeList
          id="dataSource"
          :data-source="dataSourceF"
          :show-borders="true"
          :column-auto-width="true"
          :word-wrap-enabled="true"
          :auto-expand-all="true"
          :expanded-row-keys="expandedRowKeys"
          :selected-row-keys="selectedRowKeys"
          key-expr="id"
          parent-id-expr="ID_DT"
        >
          <DxSearchPanel :visible="false" :width="250" />
          <DxHeaderFilter :visible="false" />
          <DxColumnChooser :enabled="false" />

          <DxColumn
            :width="180"
            data-field="TYPE"
            caption="Loại"
            cell-template="typeTemplate"
          />
          <DxColumn caption="Qui Cách" alignment="center">
            <DxColumn
              caption="Dầy"
              data-field="DAY"
              format="fixedPoint"
              alignment="center"
              width="60"
            />
            <DxColumn
              caption="Rộng"
              data-field="RONG"
              format="fixedPoint"
              alignment="center"
              width="60"
            />
            <DxColumn
              caption="Dài"
              data-field="CAO"
              format="fixedPoint"
              alignment="center"
              width="60"
            />
          </DxColumn>
          <DxColumn data-field="SOBO" caption="SỐ BÓ" width="80"> </DxColumn>
          <DxColumn data-field="SOTHANH_BO" caption="số thanh bó" width="80">
          </DxColumn>
          <DxColumn
            data-field="sothanh"
            caption="Số thanh giao"
            format="fixedpoint"
            alignment="center"
            width="80"
          >
          </DxColumn>
          <DxColumn data-field="GAPDOI" caption="gấp đôi" width="80">
          </DxColumn>
          <DxColumn
            data-field="SLMAU"
            caption="SL Mẫu"
            format="fixedpoint"
            alignment="center"
            width="80"
          >
          </DxColumn>
          <DxColumn
            data-field="QTY"
            caption="SL ĐẠT"
            alignment="center"
            width="80"
          >
          </DxColumn>
          <DxColumn
            data-field="TYLE"
            caption="Tỷ lệ"
            alignment="center"
            format="#0.## %"
          >
          </DxColumn>
          <DxColumn
            data-field="KHOILUONG"
            caption="Khối lượng"
            format="#0.#### m³"
            alignment="center"
          >
          </DxColumn>
          <template #typeTemplate="options">
            <span
              class="fake-link"
              v-if="options.data.data.ID_DT == 0"
              @click="go(options.data.data.id)"
              >{{ options.data.data.TYPE }}</span
            >
            <span v-else>{{ options.data.data.TYPE }}</span>
          </template>
        </DxTreeList>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import BoxSoPhieu from "../../../components/NLG/BoxSoPhieuInfo";
import {
  DxTreeList,
  DxColumn,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel
} from "devextreme-vue/tree-list";
import { showNotifySuccess, showNotifyError } from "../../../ultils";
export default {
  components: {
    BoxSoPhieu,
    DxTreeList,
    DxColumn,
    DxColumnChooser,
    DxHeaderFilter,
    DxSearchPanel
  },
  data() {
    return {
      phieunhapkho: {},
      dataSource: [],
      f_kho: null,
      expandedRowKeys: [1, 2],
      selectedRowKeys: []
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    dataSourceF() {
      return this.dataSource.map(d => (d.ID_DT ? d : { ...d, ID_DT: 0 }));
    }
  },
  created() {
    this.load().then(() => {
      this.loadCP();
    });
  },
  methods: {
    async completed() {
      const payload = {
        delFlag: "N",
        tinhtien: "Y",
        hacap: "N",
        ALLOWMODIFY: "N",
        QC_STAFF: this.userInfo.account,
        id: this.phieunhapkho.id
      };
      const data = await this.$store.dispatch(
        "nlg/UPDATE_PHIEU_NHAP_KHO3",
        payload
      );
      if (data.meta.success) {
        showNotifySuccess();
        this.$router.push("/nlg-nghiem-thu");
      } else {
        showNotifyError();
      }
    },
    go(guid) {
      console.log(guid);
      this.$router.push({ name: "add-nghiem-thu", params: { id: guid } });
    },
    async load() {
      const guid = this.$route.params.id.replace("-", "/");
      if (guid) {
        this.guid = guid;
        const data = await this.$store.dispatch("nlg/GET_DS_PHIEU_NHAP_KHO3", {
          guid: guid.replace("-", "/")
        });
        this.phieunhapkho = data.data[0];
      }
    },
    async loadCP() {
      const guid = this.$route.params.id.replace("-", "/");
      if (guid) {
        this.guid = guid;
        const data = await this.$store.dispatch(
          "nlg/GET_BB_NGHIEM_THU",
          guid.replace("-", "/")
        );
        this.dataSource = data.data;
      }
    },
    print() {
      window.print();
    }
  }
};
</script>

<style></style>
