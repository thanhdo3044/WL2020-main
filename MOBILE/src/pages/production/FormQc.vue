<template>
  <q-page class="q-pa-md bg-blue-grey-7">
    <div>
      <app-bar class="text-white">Xử lý hàng lỗi</app-bar>
      <div class="row q-mt-md">
        <div class="col-12">
          <q-card class="bg-blue-grey-7" style="border: 2px solid white">
            <q-card-section>
              <div class="prodTextTitle text-white">Thông tin Qui cách lỗi</div>
            </q-card-section>
            <hr style="color:white">
            <q-card-section style="font-family: 'Time'; font-size: 16px">
              <p>
                <span style="color:#f6b024">Tên: </span> <span class="text-white">{{ infoInventory.name }}</span> 
              </p>
              <p>
                <span style="color:#f6b024">Qui cách: </span> <span class="text-white">{{ infoInventory.quicach }}</span> 
              </p>
              <p><span style="color:#f6b024">Số lượng lỗi: </span> <span class="text-red">{{ infoInventory.remain }}</span> </p>
               <p><span style="color:#f6b024">LSX: </span> <span class="text-positive text-bold">{{ infoInventory.LSX }}</span> </p>
               <p><span style="color:#f6b024">Nhận từ công đoạn: </span> <span class="text-white">{{ infoInventory.from }}</span> </p>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row justify-center q-mt-md">
        <div class="col-12 q-ma-sm">
          <q-select
          dark
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
          <q-input dark outlined v-model.number="qtyDefect" label="Số lượng lỗi :" />
           <q-checkbox
              @input="onSelect"
              dark
              v-model="selection"
              class="text-white"
              label="Sửa được về chính chi tiết báo lỗi"
            />
          <q-select
          dark
            style="
              font-family: 'Time New Roman';
              font-size: 16px;
              text-align: center;
            "
             
                use-input
            v-model="solution"
            behavior="dialog"
            :options="solutions"
            @filter="filterFn"
            @input="onSelect"
            label="Chọn giải pháp :"
         
          />
          <q-select v-if="isHaCap"
          dark
            style="
              font-family: 'Time New Roman';
              font-size: 16px;
              text-align: center;
            "
                use-input
            v-model="haCap"
            behavior="dialog"
            :options="haCaps"
            @filter="filterHaCap"
            @input="onSelectHaCap"
            label="Hạ cấp về :"
         
          />
          <q-select dark
          v-show="loai"
            style="
              font-family: 'Time New Roman';
              font-size: 16px;
              text-align: center;
            "
                use-input
            v-model="destination"
            behavior="dialog"
            :options="destinations"
              @filter="filterFn1"
               @input="onSelectdestination"
            label="Chọn công đoạn xuất :"
          />
          <br />
          <p class="text-white">Ghi chú :</p>
          <q-input dark v-model="note" filled type="textarea" />
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
      selection: false,
      arrSolutions: [],
      solution: null,
      destination: null,
      destinations: [],
      defects: [],
      defect: null,
      note: "",
      qtyDefect: "",
      haCap: "",
      loai:true,
      haCaps: [],
      arrHaCaps: [],
      isHaCap: false,
      showConfirm: false,
      infoInventory: {},
      op: null,
    };
  },
  computed: {
    ...mapGetters("base", ["congDoans", "userInfo"]),
  },
  async created() {
    this.initData();
    this.op = await this.$store.dispatch("base/getAllCongDoans");
    console.log("all", this.op);
    if(this.userInfo.factoryId == 100000) this.fa = 100000
       if(this.userInfo.factoryId == 100004) this.fa = 102340
          if(this.userInfo.factoryId == 100005) this.fa = 102366
        
  },
  methods: {
    async onSelect(value) {
      console.log("value", value);
      console.log("this.userInfo.factoryId", this.userInfo.factoryId);
      console.log("this.op", this.op);
      if (value.value === 100082) this.loai = false
      else this.loai = true
      if (value.value === 100005) {
        let destinations = this.op.filter((o) => o.factoryId === 102339 && (o.TYPE2 === 'to' || o.TYPE2 === 'kho'));
        destinations.map((element) => {
          element.label = element.NAME;
          element.value = element.ID;
        });
        this.destinations = destinations;
      } else if (value.value === 100022) {
        let destinations = this.op.filter((o) => o.factoryId === 102340 && (o.TYPE2 === 'to' || o.TYPE2 === 'kho'));
        destinations.map((element) => {
          element.label = element.NAME;
          element.value = element.ID;
        });
        this.destinations = destinations;
      } else if (value.value === 100006 || this.userInfo.factoryId == 100005) {
        let destinations = this.op.filter((o) => o.factoryId === 102366 && (o.TYPE2 === 'to' || o.TYPE2 === 'kho'));
        destinations.map((element) => {
          element.label = element.NAME;
          element.value = element.ID;
        });
        this.destinations = destinations;
      }else if (value.value === 100083) {
        let destinations = this.op.filter((o) => o.factoryId === 102366 && (o.TYPE2 === 'to' || o.TYPE2 === 'kho') || o.ID == 102366 );
        destinations.map((element) => {
          element.label = element.NAME;
          element.value = element.ID;
        });
        this.destinations = destinations;
      }
       else {
        let destinations = this.op.filter((o) => o.factoryId === this.fa && (o.TYPE2 === 'to' || o.TYPE2 === 'kho'));
        destinations.map((element) => {
          element.label = element.NAME;
          element.value = element.ID;
        });
        
        this.destinations = destinations;
      }
      if ( this.userInfo.id == 101894 || this.userInfo.id == 101889|| this.userInfo.id == 101893 ) {
        let destinations = this.op.filter((o) => (o.factoryId === 102339 || o.factoryId === 102340 || o.factoryId === 102366) && (o.TYPE2 === 'to' || o.TYPE2 === 'kho'));
        destinations.map((element) => {
          element.label = `[${element.CODE}] ${element.NAME}` ;
          element.value = element.ID;
        });
        this.destinations = destinations;
      }
      if (this.selection == true){
        this.destinations = []
        let payload = {
          itemId: this.$store.state.production.inventoryQCSelected.item.id,
          factoryId:this.$store.state.production.inventoryQCSelected.factoryId,
        }
         let data = await this.$store.dispatch("production/getcongdoannhanloi",payload);
            data.forEach( el => {
     
          this.destinations.push({
            value: el.ID,
            label: el.NAME,
          });
        })
      }
      this.aardestinations =  this.destinations
      if(value.value == 100055){
        this.isHaCap = true;
        let data = await this.$store.dispatch("production/getItems");
        console.log("data", data);
        data.forEach( el => {
          const itemNameConvert = `[${el.CODE}] ${el.NAME} (${el.LENGTH}*${el.WIDTH}*${el.HEIGHT})`;
          this.haCaps.push({
            value: el.ID,
            label: itemNameConvert,
          });
        })
        this.arrHaCaps = this.haCaps;
      }
    },
    initData() {
      const token = "";
      Promise.all([
        this.$store.dispatch("production/ACTION_GET_SOLUTION_QC", token),
        this.$store.dispatch("production/ACTION_GET_PACKAGE_TYPE", token),
      ])
        .then((res) => {
          // this.solutions = res.data
          this.showLoading = false;
          this.$store.state.production.defects.forEach((def) => {
            const d = {
              label: def.name,
              value: def.id,
            };
            this.defects.push(d);
          });
          this.$store.state.production.solutions.forEach((so) => {
            const s = {
              label: so.name,
              value: so.id,
            };
            this.solutions.push(s);
            this.arrSolutions = this.solutions;
          });
          this.$store.getters["base/myDestinations"].forEach((des) => {
            const d = {
              label: des.name,
              value: des.id,
            };

            this.destinations.push(d);
          });
          console.log("this.$store.state.production.inventoryQCSelected", this.$store.state.production.inventoryQCSelected);
          this.infoInventory = {
            name: this.$store.state.production.inventoryQCSelected.item.name,
            quicach:
              this.$store.state.production.inventoryQCSelected.item.height +
              " " +
              this.$store.state.production.inventoryQCSelected.item.width +
              " " +
              this.$store.state.production.inventoryQCSelected.item.length,
            remain: this.$store.state.production.inventoryQCSelected.remain,
            from: this.$store.state.production.inventoryQCSelected.from.name,
            LSX: this.$store.state.production.inventoryQCSelected.LSX,
             ID_QC: this.$store.state.production.inventoryQCSelected.ID_QC,
          };
        })
        .catch((err) => {
          this.$q.notify({
            message: err,
            color: "red",
          });
        });

      //  this.solutions = res.data
      //     this.showLoading = false
    },
     async filterFn(val, update) {

      if (val === "") {
        update(() => {
            this.solutions = this.arrSolutions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.solutions = this.arrSolutions.filter(
          (v) => {
          const quicach = v.label.toString().toLowerCase();
          if (quicach.indexOf(needle) > -1) {
            return v;
          }
        });
 
      });
    },
      async filterFn1(val, update) {

      if (val === "") {
        update(() => {
            this.destinations = this.aardestinations;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.destinations = this.aardestinations.filter(
          (v) => {
          const quicach = v.label.toString().toLowerCase();
          if (quicach.indexOf(needle) > -1) {
            return v;
          }
        });
 
      });
    },
    filterHaCap(val, update) {
      if (val === "") {
        update(() => {
          this.haCaps = this.arrHaCaps;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.haCaps = this.arrHaCaps.filter((v) => {
          const quicach = v.label.toString().toLowerCase();
          if (quicach.indexOf(needle) > -1) {
            return v;
          }
        });
      });
    },
    selectDef(def) {},
    save() {
      if (this.loai == false) this.destination = {
        value :10,
        label:"hàng loại"
      }
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
        sourceId: this.$store.state.production.inventoryQCSelected.id,
        destinationId: this.destination.value,
        itemId: this.$store.state.production.inventoryQCSelected.item.id,
        quantity: this.qtyDefect,
        materialsId: this.$store.state.production.inventoryQCSelected.item.id,
        materialsQuantity: this.qtyDefect,
        typeId: this.defect.value,
        remediesId: this.solution.value,
        description: this.note,
        itemFromId: this.$store.state.production.inventoryQCSelected.fromId,
       factoryId : this.$store.state.production.inventoryQCSelected.factoryId,
       itemHC : this.haCap.value,
        ID_QC : this.$store.state.production.inventoryQCSelected.ID_QC,
         po : this.$store.state.production.inventoryQCSelected.PO,
         sua:this.selection,
      };
      //console.log('item:',this.$store.state.production.inventoryQCSelected)

      let res = await this.$store.dispatch(
        "production/ACTION_CREATE_PACKAGE",
        payload
      );

      const packageId = res.data[0].id;
      if (res.meta.success === true) {
        if (
          payload.remediesId === 100022 ||
          payload.remediesId === 100005 ||
          payload.remediesId === 100006 ||
          payload.destinationId === 100070
        ) {
          this.infoInventory.remain =
            this.infoInventory.remain - this.qtyDefect;
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
          payload.packageId = packageId;
          payload.factoryId = this.$store.state.production.inventoryQCSelected.factoryId;
          payload.destinationId === 101265
            ? (payload.destinationId = 100280)
            : payload.destinationId;
          let qc = await this.$store.dispatch("production/handleQc", payload);
          if (qc.success === true) {
            this.infoInventory.remain =
              this.infoInventory.remain - this.qtyDefect;
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
              message: "Có lỗi xảy ra khi trừ sản lượng",
              color: "red",
              position: "center",
            });
          }
        }
      } else {
        this.$q.notify({
          message: res.meta.messages.message,
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