<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Báo cáo tồn công đoạn - 
          <span class="text-amber-14">{{ factory ? factory.label : "" }}</span>
        </div>
      </div>
    </div>

    <q-card>
 <div style="padding: 5px">
      <div class="row bg-grey-1" style="padding: 5px 0 5px 0">
          <div class="col-12">
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in options"
                :key="index"
              >
                <q-radio
                  dense
                  @input="onChange"
                  v-model="factory"
                  :val="congDoan"
                  :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  v-bind:class="{ isActive: true }"
                  color="amber-6"
                />
              </div>
            </div>
          <hr>
            <div class="row">
              <div
                class="col-2 col-md-2"
                v-for="(congDoan, index) in xuongs"
                :key="index"
              >
                <q-radio
                  dense
                  @input="chonXuong"
                  v-model="xuong"
                  :val="congDoan"
                  :label="congDoan.label"
                  style="border-radius: 5px; font-size: 13px"
                  class="text-weight-bold"
                  v-bind:class="{ isActive: true }"
                  color="amber-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <DxDataGrid
              id="gridContainer"
              :data-source="dataSource"
              :show-row-lines="true"
              :show-borders="true"
              :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
              :show-column-lines="true"
              :allow-column-resizing="true"
            >
              <DxColumn data-field="name" caption="Tên sản phẩm" width="300" />
              <DxColumn caption="Quy cách" alignment="center" >
                  <DxColumn data-field="height" caption="Dày" alignment="center" width="90" />
                  <DxColumn data-field="width" caption="Rộng" alignment="center" width="90" />
                  <DxColumn data-field="length" caption="Dài" alignment="center" width="90" />
              </DxColumn>
              <DxColumn v-if="factory.factoryId == 102498" caption="2. Lên lớp">
                   <DxColumn data-field="102755" caption="SL"  width="120" cell-template="data-cell" />
                   <DxColumn data-field="102755m3" caption="M3"  format="#,##0.####" width="120" cell-template="data-cell" />
              </DxColumn>
              <DxColumn v-if="factory.factoryId == 102498" caption="3. Lọc ván" width="120" >
                  <DxColumn data-field="102756" caption="SL"  width="120" cell-template="data-cell" />
                   <DxColumn data-field="102756m3" caption="M3"  format="#,##0.####" width="120" cell-template="data-cell" />
              </DxColumn>
              <DxColumn v-if="factory.factoryId == 102498" caption="4. Kho Ván cốt" width="120" >
                  <DxColumn data-field="102757" caption="SL" width="120" cell-template="data-cell" />
                   <DxColumn data-field="102757m3" caption="M3" format="#,##0.####" width="120" cell-template="data-cell" />
              </DxColumn>
              <DxColumn v-if="factory.factoryId == 102498"  caption="5. Dán mặt" width="120"  >
                  <DxColumn data-field="102758" caption="SL" width="120" cell-template="data-cell" />
                   <DxColumn data-field="102758m3" caption="M3" format="#,##0.####" width="120" cell-template="data-cell" />
              </DxColumn>
              <DxColumn v-if="factory.factoryId == 102498"  caption="6. Hoàn thiện" width="120"  >
                  <DxColumn data-field="102759" caption="SL" width="120" cell-template="data-cell" />
                   <DxColumn data-field="102759m3" caption="M3" format="#,##0.####" width="120" cell-template="data-cell" />
              </DxColumn>
              <DxColumn caption="2. Hoàn thiện"  width="120" >
                   <DxColumn v-if="factory.factoryId == 102531" data-field="102751" caption="M3" format="#,##0.####" width="120" cell-template="data-cell" />
              </DxColumn>
              <template #data-cell="{data}">
                <span v-if="data.value < 0 && data.value > -0.0000001" >0</span>
                <span v-else-if="data.value < 0" style="color:red" >{{data.value.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  })}}</span>
                <span v-else >{{data.value.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  })}}</span>
              </template>
            </DxDataGrid>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { DxDataGrid, DxColumn } from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
  },
  data() {
    return {
      dataSource: [],
      options: [],
      xuong: null,
      xuongs: [],
      factory: null,
    };
  },
  created() {
    this.loadFactory();
  },
  methods: {
    async loadFactory() {
      let factories1 = await this.$store.dispatch("vcn/getFactory");
      factories1.map((factory) => {
        factory.label = factory.name;
        factory.factoryId = factory.id;
      });
      this.options = factories1;
      this.factory = this.options[0];
    },
    async onChange() {
      const payload = {
        factoryId: this.factory.id
      }
      const data = await this.$store.dispatch("vcn/getXuongByFactoryId", payload);
      data.map(e => (e.label = e.name));
      this.xuongs = data;
      this.factoryName = this.factory.label;
    },
    async chonXuong() {
      this.load();
    },
    async load() {
      const payload = {
        factoryId: this.xuong.id,
      };
      const data = await this.$store.dispatch("vcn/getTonCongDoanVCN", payload);
      console.log("data", data);
      this.dataSource = data;
    },
  },
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