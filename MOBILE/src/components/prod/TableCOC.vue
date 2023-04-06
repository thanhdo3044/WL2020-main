<template>
<div class=" row">
  <div class="col-12">
      <q-card class="bg-blue-grey-7" style="border:2px solid white">
        <q-card-section>
          <div class="prodTextTitle text-white">Thông tin COC</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <table style="width:100%;border: 1px solid black;border-collapse: collapse;color:white">
                <tr>
                  <th style="border: 1px solid black;border-collapse: collapse;">Loại gỗ </th>
                  <th style="border: 1px solid black;border-collapse: collapse;">Mã lô gỗ</th>
                  <th style="border: 1px solid black;border-collapse: collapse;">Lệnh sản xuất</th>
                </tr>
                <tr>
                  <td style="text-align:center;border: 1px solid black;border-collapse: collapse;">{{this.$store.state.production.palletSelected.woodTypeName}}</td>
                  <td style="text-align:center;border: 1px solid black;border-collapse: collapse;">{{this.$store.state.production.palletSelected.parcel}}</td>
                  <td style="text-align:center;border: 1px solid black;border-collapse: collapse;">{{this.$store.state.production.palletSelected.productionOrdersCode}}</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="row q-mt-md">
            <div class="col-12">
              <q-table
                dense
                class="bg-blue-grey-7"
                dark
                :data="data"
                :columns="columns"
                row-key="name"
                :pagination.sync="pagination"
                separator="cell"
                :hide-bottom="true"
                no-results-label="Không tìm thấy ...."
                no-data-label="Không có dữ liệu !"
              >
                <template v-slot:top="props">
                  <div class="col-10">
                    <div class="prodTextTitle">Thông tin hóa chất</div>
                  </div>
                  <div class="col-2">
                    <q-icon @click="showDialog=true" name="add_circle" style="color:orange;font-size: 32px;" />
                  </div>
                </template> 
              </q-table>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  
  <dialog-form
      style="min-width:300px"
      :show="showDialog"
      :submit="submitForm"
      :cancelForm="cancelForm"
    />
    </div>
</template>

<script>
import DialogAddSuppForm from "./DialogFormAddSupplies";
export default {
  components:{
    "dialog-form": DialogAddSuppForm
  },
  data() {
    return {
      pagination: {
        descending: false,
        // page: 2,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      },
      columns: [
        { name: "name", label: "Tên vật tư", field: "name" },
        { name: "parcelCode", label: "Số lô", field: "parcelCode" },
        { name: "ncc", label: "Nhà cung cấp", field: "ncc" },
        { name: "source", label: "Công đoạn", field: "step" },
        { name: "createBy", label: "Thêm bởi", field: "createBy" }
      ],
      data: [
        
      ],
      showDialog: false,
    };
  },
  created(){
    this.$root.$on("add-supplies-success", () => {
      this.showDialog = false;
      this.intData()
      console.log('+++++++++++++++++++++++++++++++++++++')
    });
    this.$root.$on("reload", () => {
      console.log('************************************')
      this.showDialog = false;
      this.intData()

    });
    this.intData()
  },
  methods:{
    intData(){
      this.data=[]
      if (!this.$isObjectEmpty(this.$store.state.production.palletSelected.supplies)) {
        if (this.$store.state.production.palletSelected.supplies.length>0) {
          this.$store.state.production.palletSelected.supplies.forEach(sp=>{
            const spl = {name:sp.name,
            parcelCode:sp.parcel,
            ncc:sp.vendor.name,
            step:sp.step.name,
            createBy:sp.createBy.lastName}
            this.data.push(spl)
          })
        }
      }
    },
    submitForm(res) {
      this.showDialog = false;
    },
    cancelForm() {
      this.showDialog = false;
    },
    getPaginationLabel(firstRowIndex, endRowIndex, totalRowsNumber){
      return firstRowIndex+' - '+endRowIndex+' trên tổng số '+totalRowsNumber
    }
  }
};
</script>
<style lang="css" scoped>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>