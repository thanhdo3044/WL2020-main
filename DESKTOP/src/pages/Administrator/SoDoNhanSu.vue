<template>
  <div id="container">
    <DxDiagram
      v-if="employees.length > 0"
      id="diagram"
      custom-shape-template="CustomShapeTemplate"
      :read-only="true"
    >
      <DxCustomShape
        v-for="employee in employees"
        :type="'employee' + employee.ID"
        :base-type="'rectangle'"
        :default-width="2"
        :default-height="1"
        :allow-resize="true"
        :allow-edit-text="false"
        :key="employee.ID"
      />
      <template #CustomShapeTemplate="{ data }">
        <CustomShapeTemplate
          :employee="data.dataItem"
          :show-info="showInfo"
          :hide-info="hideInfo"
        />
      </template>
      <DxNodes
        :data-source="dataSource"
        :key-expr="'ID'"
        :type-expr="itemTypeExpr"
        :parent-key-expr="'PARENT_ID'"
      >
        <DxAutoLayout :type="'tree'" />
      </DxNodes>
    </DxDiagram>
    <q-dialog v-model="popupVisible">
      <q-card> 
        <DxDataGrid
              id="gridContainer"
              :data-source="listAccount"
              :show-borders="true"
              :show-row-lines="true"
              :word-wrap-enabled="true"
              :no-data-text="'Không có dữ liệu'"
              :show-column-lines="true"
              :allow-column-resizing="true"
            >
             <DxColumn
                data-field="ACCOUNT"
                caption="Mã NV"
                width="100"
              />
              <DxColumn
                data-field="LAST_NAME"
                caption="Họ và tên"
                width="200"
              />
              <DxColumn
                data-field="POSITION"
                caption="Chức vụ"
                width="200"
              />
        </DxDataGrid>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { DxDataGrid, DxColumn } from "devextreme-vue/data-grid";
import {
  DxDiagram,
  DxNodes,
  DxAutoLayout,
  DxCustomShape,
} from "devextreme-vue/diagram";
import ArrayStore from "devextreme/data/array_store";
import CustomShapeTemplate from "./CustomShapeTemplate.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    DxDiagram,
    DxNodes,
    DxAutoLayout,
    DxCustomShape,
    CustomShapeTemplate,
    DxDataGrid,
    DxColumn,
  },
  data() {
    return {
      employees: [],
      employeeSearch: [],
      dataSource: new ArrayStore({
        key: "ID",
        data: [],
      }),
      currentEmployee: {},
      popupVisible: false,
      listAccount: [],
    };
  },
  created() {
    this.load();
  },
  methods: {
    ...mapActions("hrm", ["getSoDoNhanSu", "getDepartmentChild", "getAccountByDepartmentId"]),
    async load() {
      const data = await this.getSoDoNhanSu();
      this.employees = data;
      this.employeeSearch = data;
      console.log("employees", this.employees);
      this.dataSource = new ArrayStore({
        key: "ID",
        data: data,
      });
      console.log("dataSource", this.dataSource);
    },
    itemTypeExpr(obj) {
      return `employee${obj.ID}`;
    },
    async showInfo(employee) {
      const payload = {
        departmentId: employee.ID,
      };
      const data = await this.getAccountByDepartmentId(payload);
      this.listAccount = data;
      this.popupVisible = true;
    },
    async hideInfo(employee) {
      console.log("employee", employee);
      const payload = {
        departmentId: employee.ID,
      };
      const data = await this.getDepartmentChild(payload);
      console.log("data", data);
      for (let i = 0; i < this.employeeSearch.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (this.employeeSearch[i].ID === data[j].id) {
            this.employeeSearch[i].show = 0;
          }
        }
      }
      console.log(
        "this.employeeSearch.filter(d => d.show == 1)",
        this.employeeSearch.filter((d) => d.show == 1)
      );
      this.employees = this.employeeSearch.filter((d) => d.show == 1);
      this.dataSource = new ArrayStore({
        key: "ID",
        data: this.employees,
      });
    },
  },
};
</script>
<style scoped>
#diagram {
  height: 900px;
}

.dx-popup-content p {
  margin: 0 0 10px;
}
</style>
