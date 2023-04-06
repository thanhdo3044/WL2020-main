<template>
  <q-page class="q-pa-md bg-blue-grey-7">
    <div>
      <app-bar>Xử lý hàng lỗi</app-bar>
      <div class="row q-mt-md">
        <div class="col-12">
          <q-card class="bg-blue-grey-7" style="border:2px solid white">
            <q-card-section>
              <div class="prodTextTitle text-white">Thông tin Qui cách lỗi</div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section style="font-family: 'Time'; font-size: 16px">
              <p style="color: orange">
                Qui cách : {{ infoInventory.quicach }}
              </p>
              <p><span class="text-amber">Số lượng lỗi: </span>  <span class="text-white">{{ infoInventory.remain }}</span> </p>
              <p><span class="text-amber">Nhận từ công đoạn: </span> <span class="text-white">{{ infoInventory.from }}</span> </p>
              <p><span class="text-amber">Lệnh sản xuất: </span>  <span class="text-white">{{ infoInventory.number }}</span> </p>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row justify-center q-mt-md">
        <div class="col-12 q-ma-sm">
          <q-select
          dark
          label-color="amber"
            style="
              font-family: 'Time New Roman';
              font-size: 16px;
              text-align: center;
            "
            v-model="defect"
            behavior="dialog"
            :options="defects"
            @input="selectDef"
            label="Chọn loại lỗi :"
          />
        </div>
      </div>
      <div class="row justify-center q-mt-md" v-if="defect !== null">
        <div class="col-12">
          <q-input outlined v-model.number="qtyDefect" label="Số lượng lỗi :" />
          <q-select
            style="
              font-family: 'Time New Roman';
              font-size: 16px;
              text-align: center;
            "
            v-model="solution"
            behavior="dialog"
            :options="solutions"
            @input="onSelect"
            label="Chọn giải pháp :"
          />
          <q-select
            style="
              font-family: 'Time New Roman';
              font-size: 16px;
              text-align: center;
            "
            v-model="destination"
            behavior="dialog"
            :options="destinations"
            @input="onSelectDestination"
            label="Chọn công đoạn xuất :"
          />
          <q-select
            v-if="listItemChild.length > 0"
            style="
              font-family: 'Time New Roman';
              font-size: 16px;
              text-align: center;
            "
            v-model="itemChild"
            behavior="dialog"
            :options="listItemChild"
            @input="onSelectItemChild"
            label="Chọn sản phẩm sau rong trừ kế hoạch :"
          />
          <br />
          <p>Ghi chú :</p>
          <q-input v-model="note" filled type="textarea" />
          <q-btn
            @click="save"
            color="primary"
            class="full-width q-mt-md"
            label="Lưu lại"
          />
        </div>
      </div>
      <q-dialog v-model="showConfirm" persistent>
        <q-card style="min-width: 300px">
          <q-card-section class="row items-center">
            <span class="q-ml-sm prodTextTitle">Bạn có chắc chắn không!</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Hủy" color="primary" v-close-popup />
            <q-btn flat label="Đồng Ý" color="primary" @click="submit" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <q-inner-loading :showing="showLoading">
      <q-spinner-gears size="150px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import AppBar from "../../components/AppBar";
export default {
  components: {
    "app-bar": AppBar,
  },
  data() {
    return {
      showLoading: true,
      solutions: [],
      solution: null,
      destination: null,
      destinations: [],
      defects: [],
      defect: null,
      note: "",
      qtyDefect: "",
      showConfirm: false,
      infoInventory: {},
      op: null,
      listItemChild: [],
      chuyenDoi: false,
      heSo: 1,
      itemChild: null,
    };
  },
  computed: {
    ...mapGetters("base", ["congDoans", "userInfo"]),
  },
  async created() {
    this.initData();
  },
  methods: {
    ...mapActions("vcn", [
      "loadAllDepartmentVCN",
      "getItemChildInLSXVCN",
      "getHeSoQuyDoiBySP",
    ]),
    async onSelect(value) {
      const data = await this.loadAllDepartmentVCN();
      console.log("data", data);
      this.destinations = [];
      data.forEach((el) => {
        this.destinations.push({
          label: `[${el.CODE}] ${el.NAME}`,
          value: el.ID,
        });
      });
      return;
    },
    async onSelectDestination() {
      if (
        this.$store.state.vcn.inventoryQCSelected.from == 102761 ||
        this.$store.state.vcn.inventoryQCSelected.from == 102749
      ) {
        const payload = {
          itemId: this.$store.state.vcn.inventoryQCSelected.item.itemIdVCN,
          number: this.$store.state.vcn.inventoryQCSelected.number,
        };
        const data = await this.getItemChildInLSXVCN(payload);
        if (data.length > 0) {
          this.chuyenDoi = true;
          this.listItemChild = [];
          data.forEach((el) => {
            this.listItemChild.push({
              label: el.name + ` ${el.height}x${el.width}x${el.length}`,
              value: el.id,
            });
          });
          this.itemChild = this.listItemChild[0];
          this.loadHeSo(
            this.$store.state.vcn.inventoryQCSelected.item.itemIdVCN,
            this.itemChild.value
          );
        }
        console.log("data", data);
      }
    },
    onSelectItemChild() {
      this.loadHeSo(
        this.$store.state.vcn.inventoryQCSelected.item.itemIdVCN,
        this.itemChild.value
      );
    },
    async loadHeSo(item1, item2) {
      const payload = {
        spTruocRong: item1,
        spSauRong: item2,
      };
      const heSo = await this.getHeSoQuyDoiBySP(payload);
      this.heSo = heSo[0].HE_SO;
      console.log("heSo", heSo);
    },
    initData() {
      const token = "";
      Promise.all([
        this.$store.dispatch("vcn/ACTION_GET_SOLUTION_QC", token),
        this.$store.dispatch("vcn/ACTION_GET_PACKAGE_TYPE", token),
      ])
        .then((res) => {
          // this.solutions = res.data
          this.showLoading = false;

          this.$store.state.vcn.defects.forEach((def) => {
            const d = {
              label: def.name,
              value: def.id,
            };
            this.defects.push(d);
          });

          this.$store.state.vcn.solutions.forEach((so) => {
            const s = {
              label: so.name,
              value: so.id,
            };
            this.solutions.push(s);
          });
          this.$store.getters["base/myDestinations"].forEach((des) => {
            const d = {
              label: des.name,
              value: des.id,
            };

            this.destinations.push(d);
          });
          this.infoInventory = {
            quicach:
              this.$store.state.vcn.inventoryQCSelected.item.height +
              " " +
              this.$store.state.vcn.inventoryQCSelected.item.width +
              " " +
              this.$store.state.vcn.inventoryQCSelected.item.length,
            remain: this.$store.state.vcn.inventoryQCSelected.remain,
            from: this.$store.state.vcn.inventoryQCSelected.from.name,
            number: this.$store.state.vcn.inventoryQCSelected.number,
            PO: this.$store.state.vcn.inventoryQCSelected.PO,
          };
        })
        .catch((err) => console.log(err));

      //  this.solutions = res.data
      // this.showLoading = false
    },
    selectDef(def) {},
    save() {
      if (
        this.destination !== null &&
        this.defect !== null &&
        this.solution !== null &&
        this.qtyDefect.toString().length > 0 &&
        parseFloat(this.qtyDefect) <= parseFloat(this.infoInventory.remain)
      ) {
        this.showConfirm = true;
      } else {
        this.$q.notify({
          message: "Thiếu thông tin , vui lòng kiểm tra lại !",
          color: "red",
        });
      }
    },
    async submit() {
      this.showConfirm = false;
      this.showLoading = true;
      const payload = {
        sourceId: this.$store.state.vcn.inventoryQCSelected.id,
        destinationId: this.destination.value,
        itemId: this.$store.state.vcn.inventoryQCSelected.item.itemIdVCN,
        quantity: this.qtyDefect,
        typeId: this.defect.value,
        remediesId: this.solution.value,
        description: this.note,
        itemFromId: this.$store.state.vcn.inventoryQCSelected.fromId,
        PO: this.$store.state.vcn.inventoryQCSelected.PO,
        number: this.$store.state.vcn.inventoryQCSelected.number,
        factoryId: this.userInfo.factoryId,
        createBy: this.userInfo.id,
        heSo: this.heSo,
        itemChild: this.itemChild ? this.itemChild.value : 0,
      };

      let res = await this.$store.dispatch(
        "vcn/ACTION_CREATE_PACKAGE_ERR_VCN",
        payload
      );

      //console.log('item:',this.$store.state.vcn.inventoryQCSelected)

      if (res.meta.success === true) {
        this.infoInventory.remain = this.infoInventory.remain - this.qtyDefect;
        this.qtyDefect = "";
        this.solution = null;
        this.description = "";
        this.destination = null;
        this.$q.notify({
          message: "Thực hiện thành công !",
          color: "green",
        });
        this.defect = null;
        if (this.infoInventory.remain === 0) {
          this.$q.notify({
            message: "Số lượng lỗi đã hết  !",
            color: "orange",
          });
          this.$router.go(-1);
        }
      } else {
        this.$q.notify({
          message: "Có lỗi xảy ra!",
          color: "red",
          position: "center",
        });
      }
      this.showLoading = false;
    },
  },
};
</script>

<style>
</style>