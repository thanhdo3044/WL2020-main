<template>
  <q-page class="q-pa-md q-ma-sm">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-12 top-title">Quản lý phòng ban</div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <h6>Danh sách phòng ban</h6>
        <TableDepartment />
      </q-card-section>
    </q-card>
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="primary" />
    </q-page-scroller>
  </q-page>
</template>

<script>
import TableDepartment from "../../components/E-Offices/DepartmentsTodo";

export default {
  components: {
    TableDepartment
  }
};
</script>

<style>
.add {
  color: green;
}
.remove {
  text-decoration: line-through;
  color: red;
}
</style>
