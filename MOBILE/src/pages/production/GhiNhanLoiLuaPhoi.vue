<template>
  <q-page class="bg-blue-grey-7">
    <app-bar class="text-white">Ghi nhận lỗi công đoạn lựa phôi</app-bar>
    <hr width="50%" />
    <div class="row">
      <div class="col-12">
        <q-select
        dark
          style="margin: 5px"
          v-model="factory"
          outlined
          label-color="orange"
          :options="arrFactory"
          @input="onChangeFactory"
          label="Chọn nhà máy"
          dense
        />
      </div>
      <div class="col-12">
        <q-select
        dark
          style="margin: 5px"
          v-model="department"
          outlined
          label-color="orange"
          :options="departments"
          @input="onChangeDepartment"
          label="Chọn công đoạn"
          dense
        />
      </div>

      <div class="col-6">
        <q-input
        dark
          label="Năm"
          style="margin: 5px"
          v-model.number="year"
          outlined
          label-color="orange"
          @input="onChangeYear"
          type="number"
          dense
        />
      </div>
      <div class="col-6">
        <q-input
        dark
          label="Tuần"
          style="margin: 5px"
          v-model.number="week"
          outlined
          label-color="orange"
          @input="onChangeWeek"
          type="number"
          dense
        />
      </div>
      <div class="col-12" align="right">
        <q-checkbox
        dark
          v-model="isLSX"
          style="margin-right: 5px"
          label="Theo LSX"
        />
      </div>
      <div class="col-12" v-if="isLSX">
        <q-select
        dark
          style="margin: 5px"
          label-color="orange"
          outlined
          v-model="lsx"
          :options="arrLSX"
          @input="onChangeLSX"
          label="Chọn LSX"
          dense
        />
      </div>
      <div class="col-12" v-if="isLSX">
        <q-select
        dark
          v-model="quyCachTinh"
          style="margin: 5px"
          label-color="orange"
          outlined
          :options="arrQuyCachTinh"
          label="Quy cách tinh"
          dense
        />
      </div>
      <div class="col-12">
        <q-select
        dark
          v-model="quyCachTho"
          style="margin: 5px"
          label-color="orange"
          outlined
          use-input
          input-debounce="0"
          :options="arrQuyCachTho"
          @filter="filterFn"
          label="Quy cách"
          dense
        />
      </div>
      <div class="col-12">
        <q-input
        dark
          label="Số lượng"
          style="margin: 5px"
          v-model.number="quantity"
          outlined
          label-color="orange"
          type="number"
          dense
        />
      </div>
      <div class="col-12">
        <q-input
        dark
          label="Mô tả phôi lỗi"
          style="margin: 5px"
          v-model="description"
          outlined
          label-color="orange"
          type="textarea"
          dense
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12" align="center">
        <q-btn
          color="positive"
          style="margin-bottom: 10px"
          outlined
          label="ghi nhận"
          class="btn-font"
          @click="ghiNhan()"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { showNotifySuccess, showNotifyError } from "../../ultils";
import AppBar from "../../components/AppBar";
import moment from "moment";
export default {
  components: {
    "app-bar": AppBar,
  },
  data() {
    return {
      year: 0,
      week: 0,
      fa:null,
      factory: null,
      isLSX: true,
      arrFactory: [],
      departments: [],
      department: null,
      quyCachTinh: null,
      arrQuyCachTinh: [],
      listItem: [],
      quyCachTho: null,
      arrQuyCachTho: [],
      quantity: [],
      description: null,
      lsx: null,
      arrLSX: [],
      soLan: null,
      filter: null,
      arrSoLan: [],
      isPass: false,
      gdsxName: null,
      gdsxDate: null,
      thukhoName: null,
      thukhoDate: null,
      vattuName: null,
      vattuDate: null,
      createName: null,
      createDate: null,
      rows: [],
    };
  },
  created() {
    this.departments = this.myDepartments.filter(
      (d) =>
        d.parentId != 102498 &&
        d.parentId != 102451 &&
        d.parentId != 102531 &&
        d.parentId != 102533
    );
    this.departments.map((el) => {
      el.label = `[${el.code}] - ${el.name}`;
    });
    this.department = this.departments[0];
    const date = moment();
    this.year = date.year();
    this.week = date.week();
    const factory = this.userInfo.role.types[0].value.filter(
      (u) => u.type2 == "nhaMay" && u.parentId == 102299
    );
    factory.forEach((element) => {
      this.arrFactory.push({
        label: element.name,
        value: element.factory,
      });
    });
    console.log("position", this.userInfo.position);
    this.factory = this.arrFactory[0];
    this.loadGoNguyenLieu();
    this.loadLSX();
  },
  computed: {
    ...mapGetters("base", ["myDepartments", "userInfo"]),
  },
  methods: {
    ...mapActions("production", [
      "getLSXLuaPhoi",
      "getQuyCachTinh",
      "getQuyCachTinh2",
      "getGoNguyenLieu",
      "ghiNhanLoiLuaPhoi",
    ]),
    onChangeDepartment() {
      if(this.department.id == 102460 || this.department.id == 102488 || this.department.id == 102778){
        this.loadQuyCachTinh();
      }else{
        this.loadGoNguyenLieu();
      }
      this.loadLSX();
    },
    async onChangeFactory() {
      this.loadLSX();
    },
    onChangeYear() {
      this.loadLSX();
    },
    onChangeWeek() {
      this.loadLSX();
    },
    async loadGoNguyenLieu() {
      const data = await this.getGoNguyenLieu();
      this.arrQuyCachTho = [];
      data.forEach((el) => {
        let itemName = `${el.NAME} = (${el.HEIGHT}*${el.WIDTH}*${el.LENGTH})`;
        this.arrQuyCachTho.push({
          label: itemName,
          name: itemName,
          value: el.ID,
        });
      });
      this.listItem = this.arrQuyCachTho;
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.arrQuyCachTho = this.listItem;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.arrQuyCachTho = this.listItem.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async loadLSX() {
      const payload = {
        factoryId: this.factory.value,
        year: this.year,
        week: this.week,
        departmentId: this.department.id,
      };
      const data = await this.getLSXLuaPhoi(payload);
      console.log("data", data);
      this.arrLSX = data;
    },
    async onChangeLSX() {
      const payload = {
        number: this.lsx.value,
        departmentId: this.department.id,
      };
      const data = await this.getQuyCachTinh(payload);
      this.arrQuyCachTinh = [];
      data.forEach((element) => {
        let itemName = `${element.NAME} - (${element.HEIGHT}*${element.WIDTH}*${element.LENGTH})`;
        this.arrQuyCachTinh.push({
          label: itemName,
          value: element.code,
        });
      });
      console.log("arrQuyCachTinh", this.arrQuyCachTinh);
    },
    async loadQuyCachTinh(){
      const data = await this.getQuyCachTinh2();
      this.arrQuyCachTho = [];
      data.forEach((element) => {
        let itemName = `${element.NAME} - (${element.HEIGHT}*${element.WIDTH}*${element.LENGTH})`;
        this.arrQuyCachTho.push({
          label: itemName,
          name: itemName,
          value: element.ID,
        });
      });
      console.log("arrQuyCachTinh", this.arrQuyCachTho);
      this.listItem = this.arrQuyCachTho;
    },
    async ghiNhan() {
      if (this.department.factoryId == 100000) this.fa = 100000
      if (this.department.factoryId == 102339) this.fa = 100003
      if (this.department.factoryId == 102340) this.fa = 100004
      if (this.department.factoryId == 102366) this.fa = 100005
      if (
        this.quyCachTho != null &&
        this.quantity != null
      ) {
        let payload = null;
        if (this.isLSX) {
          payload = {
            sourceId: this.department.id,
            destinationId: 100081,
            description: this.description,
            typeId: 100004,
            accountId: this.userInfo.id,
            po: this.quyCachTinh.value,
            factoryId: this.fa,
            itemId: this.quyCachTho.value,
            quantity: this.quantity,
          };
        } else {
          payload = {
            sourceId: this.department.id,
            destinationId: 100081,
            description: this.description,
            typeId: 100004,
            accountId: this.userInfo.id,
            po: this.userInfo.departmentId,
            factoryId: this.fa,
            itemId: this.quyCachTho.value,
            quantity: this.quantity,
          };
        }

        const data = await this.ghiNhanLoiLuaPhoi(payload);
        console.log("data", data);
        if (data.meta.success) {
          showNotifySuccess();
          this.lsx = null;
          this.quyCachTinh = null;
          this.quyCachTho = null;
          this.quantity = null;
          this.description = null;
        } else {
          showNotifyError();
        }
      } else {
        this.$q.dialog({
          title: "Lỗi",
          message: "Vui lòng nhập đầy đủ thông tin trước khi ghi nhận!",
        });
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
  background-color: #78909c !important;
  color: orange;
  font-family: "Times New Roman", Times, serif;
}
.q-table__top {
  padding: 0px;
}
.btn-font {
  margin: 5px;
  font-family: "Times New Roman", Times, serif;
  font-weight: bold;
}
</style>