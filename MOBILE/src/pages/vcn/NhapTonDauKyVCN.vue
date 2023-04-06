<template>
  <q-page>
    <div class="row justify-center">
      <div class="page-title">
        <div class="col-auto">Nhập tồn đầu kỳ</div>
      </div>
    </div>
    <div class="row">
        <div class="col-12 q-pa-sm">
             <q-select outlined v-model="department" :options="departments" label="Chọn công đoạn" @input="changeDepartment" />
        </div>
        <div class="col-12 q-pa-sm">
             <q-select outlined v-model="item" :options="items"  @filter="filterFn" use-input label="Chọn sản phẩm" @input="changeItem"  />
        </div>
        <div class="col-6 q-pa-sm">
             <q-input outlined v-model="quantity" label="Số lượng" />
        </div>
        <div class="col-6 q-pa-sm">
             <q-input outlined v-model="unitName" label="ĐVT" readonly />
        </div>
        <div class="col-12 q-pa-sm">
             <q-input type="textarea" outlined v-model="description" label="Ghi chú" />
        </div>
        <div class="col-12 q-pa-sm" align="center">
              <q-btn color="primary" label="Xác nhận" @click="nhapTon" />
        </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { showNotifySuccess, showNotifyError } from "../../utils/utils";
export default {
    data(){
        return{
            departments: [],
            department: null,
            items: [],
            item: null,
            itemFilter: [],
            quantity: null,
            unitName: null,
            description: null,
        }
    },
    computed: {
    ...mapGetters("base", ["myDepartments", "userInfo"]),
  },
  created(){
    this.loadDepartment();
    this.loadItem();
  },
  methods:{
    ...mapActions("vcn", [
      "GET_ITEMS_VCN",
      "NHAP_TON_DAU_KY_VCN"
    ]),
    loadDepartment(){
        let departmentFilter = this.myDepartments.filter(
      (m) =>
        m.parentId == 102744 ||
        m.parentId == 102745 ||
        m.parentId == 102498 ||
        m.parentId == 102531 ||
        m.parentId == 102817 ||
        m.parentId == 102818
    );
    console.log("departmentFilter", departmentFilter);
    departmentFilter.forEach(el => {
        this.departments.push({
            label: `[${el.code}] ${el.name}`,
            value: el.id
        });
    });
    },
    changeDepartment(){
        this.loadItem();
    },
    async loadItem(){
        const data = await this.GET_ITEMS_VCN();
        console.log("data", data);
        data.forEach(el => {
            this.items.push({
                label: `[${el.code}] ${el.name} (${el.height}*${el.width}*${el.length})`,
                value: el.id,
                unitName: el.Unit.name,
            })
        });
        this.itemFilter = this.items;
    },
    changeItem(){
        this.unitName = this.item.unitName
    },
    async nhapTon(){
        const payload = {
            departmentId: this.department.value,
            itemId: this.item.value,
            quantity: this.quantity,
            description: this.description,
            accountId: this.userInfo.id
        }
        const data = await this.NHAP_TON_DAU_KY_VCN(payload);
        if(data.meta.success){
            showNotifySuccess();
            this.item = null;
            this.quantity = null;
            this.unitName = null;
            this.description = null;
        }else{
            showNotifyError();
        }
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.items = this.itemFilter
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.items = this.itemFilter.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
  }
}
</script>

<style>

</style>