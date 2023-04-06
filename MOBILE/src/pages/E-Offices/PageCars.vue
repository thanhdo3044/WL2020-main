<template>
  <q-page>
    <q-banner class="bg-primary text-orange">
      <div class="text-h6 orange">
        <span color="orange">Khai báo danh sách xe</span>
      </div>
    </q-banner>
    <q-card>
      <q-card-section>
        <DxDataGrid
          id="grid"
          :show-borders="true"
          :data-source="carsData"
          :repaint-changes-only="true"
        >
          <DxEditing
            :refresh-mode="refreshMode"
            :allow-adding="true"
            :allow-updating="true"
            :allow-deleting="true"
            mode="cell"
          />
          <DxColumn data-field="code" caption="Biển số xe" />
          <DxColumn data-field="seats" caption="Số chỗ" />
          <DxColumn data-field="name" caption="Mô tả" />
          <DxScrolling mode="virtual" />
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
  DxEditing,
  DxScrolling
} from "devextreme-vue/data-grid";

import CustomStore from "devextreme/data/custom_store";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxScrolling
  },
  data() {
    return {
      carsData: new CustomStore({
        key: "id",
        load: () => this.cars,
        insert: values => this.addCar(values),
        update: (key, values) => this.updateCar({ key, values }),
        remove: key => this.removeCar(key)
      }),
      refreshMode: "full",
      refreshModes: ["full", "reshape", "repaint"]
    };
  },
  methods: {
    ...mapActions("bases", ["addCar", "updateCar", "removeCar"])
  },
  computed: {
    ...mapGetters("bases", ["cars"])
  }
};
</script>
