<template>
  <q-page class="bg-blue-grey-7">
    <app-bar class="text-white">KHAI TỒN SƠN</app-bar>
    <hr width="50%" />
    <div class="row">
      <div class="col-12">
        <q-select
        dark
          style="margin: 5px"
          @input="loadHistory"
          outlined
          v-model="idDepartment"
          label-color="orange"
          :options="options"
          label="Chọn nhà máy"
        />
      </div>
      <div class="col-6">
        <q-input
        dark
          @input="loadGrid"
          style="margin: 5px"
          label-color="orange"
          outlined
          :readonly="true"
          v-model.number="year"
          type="number"
          label="Năm"
        />
      </div>
      <div class="col-6">
        <q-input
        dark
          style="margin: 5px"
          label-color="orange"
          @input="loadGrid"
          outlined
          :readonly="true"
          v-model.number="week"
          type="number"
          label="Tuần"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12" align="center">
        <q-btn
          color="positive"
          style="margin-bottom: 10px"
          outlined
          label="cập nhập số tồn"
          class="btn-font"
          @click="nhaptonson()"
        />
      </div>

      <q-table
      dark
        class="col-12 bg-blue-grey-7"
        :data="rows"
        separator="cell"
        :columns="columns"
        row-key="name"
        :filter="filter"
        wrap-cells
        :pagination="pagination"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="ma_vt" :props="props">{{ props.row.ma_vt }}</q-td>
            <q-td
              key="ten_vt"
              :props="props"
              :style="{ width: '30px', whiteSpace: 'pre-wrap' }"
              >{{ props.row.ten_vt }}
            </q-td>
            <!-- <q-td key="dvt" :props="props">{{ props.row.dvt }}</q-td> -->

            <q-td key="TON" :props="props">
              {{ props.row.TON }}
              <q-popup-edit
                v-model="props.row.TON"
                buttons
                label-set="Xác nhận"
                label-cancel="Hủy"
              >
                <q-input type="number" v-model="props.row.TON" autofocus />
              </q-popup-edit>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { ref } from "vue";
import {
  showNotifySuccess,
  showNotifyError,
  showNotifyValidate,
  thangs,
  nams,
} from "../../ultils";
import { getWeekNumber } from "../../ultils";
import AppBar from "../../components/AppBar";
export default {
  components: {
    "app-bar": AppBar,
  },
  data() {
    return {
      week: "",
      year: null,
      number: "",
      filter: "",
      idDepartment: null,
      listNumber: [],
      rows: [],
      pagination: {
        rowsPerPage: 50, // current rows per page being displayed
      },
      columns: [
        {
          name: "ma_vt",
          label: "Mã VT",
          headerStyle: "width: 50px",
          align: "left",
          field: (row) => row.ma_vt,
        },
        {
          name: "ten_vt",
          label: "Tên VT",
          headerStyle: "width: 50px",
          align: "left",
          field: (row) => row.ten_vt,
        },
        // {
        //   name: "dvt",
        //   label: "ĐVT",
        //   headerStyle: 'align:"left"; width: 50px',
        //   field: (row) => row.dvt,
        // },

        {
          name: "TON",
          label: "Tồn",
          field: (row) => row.TON,
          headerStyle: "width: 20px ",

          align: "center",
        },
      ],

      // options: [
      //   {
      //     label: "NM CBG Thuận Hưng",
      //     factoryId: 100000,
      //     code: "TH",
      //   },
      //   {
      //     label: "NM CBG Yên Sơn 1A",
      //     factoryId: 100003,
      //     code: "YS1A",
      //   },
      //   {
      //     label: "NM CBG Yên Sơn 1B",
      //     factoryId: 100004,
      //     code: "YS1B",
      //   },
      //   {
      //     label: "NM CBG Thái Bình",
      //     factoryId: 100005,
      //     code: "TB",
      //   },
      // ],
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  created() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    this.year = currentYear;
    this.week = getWeekNumber(today);
    this.options = this.userInfo.role.types[0].value
      .filter((s) => s.type2 === "nhaMay" && s.parentId === 102299)
      .map((o) => ({
        label: o.name,
        code: o.code,
        factoryId: o.factory,
        value: o.factory,
      }));
    this.idDepartment = this.options[0];
    this.loadHistory();
  },
  methods: {
    async loadHistory() {
      const payload = {
        number: this.number,
      };
      const data = await this.$store.dispatch(
        "production/GET_MA_VAT_TU",
        payload
      );
      this.rows = data;
      // console.log('du lieu',this.rows)
    },
    async nhaptonson() {
      let capvt = [];
      this.rows.forEach((d) => {
        if (d.TON > 0) capvt.push(d);
      });
      this.dulieu = capvt;
      const payload = {
        factoryId: this.idDepartment.factoryId,
        createBy: this.$store.state.base.userInfo.id,
        dataDelai: this.dulieu,
      };
      const data = await this.$store.dispatch(
        "production/NHAP_TON_SON",
        payload
      );
      if (data.meta.success) {
        showNotifySuccess();
        this.loadHistory();
      } else {
        showNotifyError();
      }
    },
  },
};
</script>

<style>
.q-table--dense .q-table th {
  font-size: 8px;
}
.q-table--cell-separator thead th {
  background-color: #daf8e1 ;
  color: black;
  font-weight: bold;
  font-family: "Times New Roman", Times, serif;
}

.q-table__top {
  padding: 0px;
}

.btn-font {
  font-family: "Times New Roman", Times, serif;
}
</style>