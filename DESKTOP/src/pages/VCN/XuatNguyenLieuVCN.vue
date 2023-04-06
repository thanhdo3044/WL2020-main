<template>
  <div>
    <div class="q-pa-md" id="app-container">
      <div>
        <b class="text-primary">Danh sách các LSX hiện tại trên chuyền :</b>
      </div>
      <div class="row">
        <div class="col-3" v-for="(lsx, key) in chuaHoanThanhs" :key="key">
          <q-radio
            @input="selected"
            v-model="selection"
            :val="lsx.number"
            :label="lsx.number"
            color="teal"
            class="text-weight-bold"
          />
        </div>
      </div>
      <q-banner inline-actions class="bg-primary text-white q-mb-xs">
        <div class="text-subtitle1">Kế hoạch cấp nguyên vật liệu</div>
      </q-banner>
      <DxDataGrid
        :data-source="resources"
        :show-borders="true"
        v-if="selection"
      >
        <!-- ... -->

        <DxColumn data-field="ten" :allowEditing="false" caption="Tên NL, VL">
        </DxColumn>
        <DxColumn data-field="qc" :allowEditing="false" caption="Quy cách (mm)">
        </DxColumn>
        <DxColumn ... data-field="dvt" :allowEditing="false" caption="ĐVT">
        </DxColumn>
        <DxColumn ... data-field="sl" :allowEditing="false" caption="Số lượng">
        </DxColumn>
        <!-- ... -->
        <DxColumn ... data-field="m3" :allowEditing="false" caption="M3 phôi">
        </DxColumn>
        <DxColumn ... data-field="tong" :allowEditing="false" caption="Tổng">
        </DxColumn>
        <DxColumn ... data-field="export" caption="Số lượng xuất thực tế" format="0.##">
        </DxColumn>
        <DxColumn ... data-field="sumExport" caption="Khối lượng xuất thực tế"> </DxColumn>
        <DxEditing
          mode="cell"
          :allow-updating="true"
          :allow-adding="false"
          :allow-deleting="false"
        />
      </DxDataGrid>
    </div>

    <div class="q-pa-md">
      <q-banner inline-actions class="bg-primary text-white">
        <div class="text-subtitle1">Xuất nguyên vật liệu</div>
      </q-banner>
      <DxDataGrid
        v-if="selection"
        :data-source="exportMaterials"
        :show-borders="true"
        @row-updated="inserted"
        @row-inserted="inserted"
      >
        <DxColumn ... data-field="code" caption="Mã NL,VL" :width="150">
          <DxLookup
            :data-source="listItems"
            value-expr="id"
            display-expr="name"
          />
        </DxColumn>
        <DxColumn data-field="name" caption="Tên NL, VL"> </DxColumn>
        <DxColumn data-field="qc" caption="Quy cách (mm)"> </DxColumn>
        <DxColumn ... data-field="dvt" :width="150" caption="ĐVT"> </DxColumn>
        <DxColumn ... data-field="quantity" caption="Số lượng"> </DxColumn>
        <!-- <DxColumn ... data-field="m3" :allowEditing="false" caption="M3 phôi">
        </DxColumn> -->
        <!-- <DxColumn
          ...
          data-field="haoHut"
          :allowEditing="false"
          caption="Hao Hụt"
        >
        </DxColumn>
        <DxColumn ... data-field="sumExport" caption="Xuất thực tế"> </DxColumn> -->
        <DxEditing
          mode="cell"
          :allow-updating="true"
          :allow-adding="true"
          :allow-deleting="true"
        />
      </DxDataGrid>
    </div>
    <div v-if="selection" class="q-pa-md q-gutter-sm text-right">
      <q-btn :disabled="!exportMaterials.length" color="red" label="Primary" />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxRequiredRule,
  DxEditing,
  DxFormat,
  DxLookup,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxLookup,
    DxColumn,
    DxRequiredRule,
    DxEditing,
    DxFormat,
  },
  data() {
    return {
      listItems: null,
      PO: null,
      chuaHoanThanhs: [],
      selection: null,
      exportMaterials: [],
      strucres: null,
      resources: null,
      sumHeight: 0,
      strucres: null,
    };
  },
  methods: {
    ...mapActions("vcn", ["GET_PO_BY_NUMBER_VCN", "GET_ITEMS_VCN"]),
    ...mapActions("vcn", ["getsoLenhSanXuatCapPhoisVCN"]),
    selected(value) {
      this.loadData(value);
      this.exportMaterials = [];
    },
    async loadData(number) {
      const data = await this.GET_PO_BY_NUMBER_VCN({ number });
      this.PO = data.data;
      this.resources = JSON.parse(data.data[0].resources).filter(
        (e) => e.dvt == "Tấm"
      );
      this.strucres = JSON.parse(data.data[0].strucre);
      console.log(this.strucres);
    },
    async inserted(value) {
      if (value.data.code) {
        console.log(value);
        console.log(this.listItems);
        let item = this.listItems.find((e) => e.id == value.data.code);
        value.data.name = item.label;
        value.data.qc = `${item.height}x${item.width}x${item.length}`;
        value.data.dvt = item.Unit.name;
        value.data.itemId = value.data.code;
      }
    },
  },
  async mounted() {
    const data1 = await this.getsoLenhSanXuatCapPhoisVCN({ factoryId: 102496 });
    const data2 = await this.GET_ITEMS_VCN();

    data2.map((e) => {
      e.label = e.name;
      e.name = e.code;
    });
    this.listItems = data2.filter((e) => e.code);

    this.chuaHoanThanhs = data1;

    // console.log(this.resources)
  },
};
</script>

<style>
</style>