<template>
  <q-page class="q-pa-md bg-blue-grey-7">
    <app-bar>Tạo pallet xếp sấy</app-bar>
    <div
      v-if="this.$store.state.production.loadXepSayDone"
      class="row justify-center"
    >
      <div class="col-12 col-md-6 q-ma-md">
        <info-factoryfsc />
        <div class="col-12">
          <q-select
          dark
          label-color="amber"
            clearable
            style="
              font-family: 'Time New Roman';
              font-size: 16px;
              text-align: center;
            "
            v-model="woodType"
            behavior="dialog"
            :options="woodTypes"
            label="Loại gỗ"
          />
        </div>
        <div class="row">
          <div class="col-12">
            <q-input
            dark
            label-color="amber"
              outlined
              @input="saveLoWoods"
              v-model="woodsLotNo"
              label="Mã lô gỗ "
            />
          </div>
        </div>
        <div class="row q-mt-sx">
          <div class="col-12">
            <q-select
            dark
            label-color="amber"
              style="font-family: 'Time New Roman'; font-size: 16px"
              v-model="palletTypeSelect"
              behavior="dialog"
              :options="palletTypes"
              @input="changeType"
              label="Mục đích sấy :"
            />
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col-8">
            <q-select
            dark
            label-color="amber"
              clearable
              use-input
              @input="selectItemChoosed"
              input-debounce="0"
              @filter="searchMaterial"
              style="font-family: 'Time New Roman'; font-size: 16px"
              v-model="materialSelected"
              behavior="dialog"
              :options="materials"
              label="Qui cách thô :"
            />
          </div>
          <div class="col-4">
            <q-btn
              @click="choose"
              color="primary"
              class="prodButtonText"
              style="width: 90%; height: 100%; margin-left: 10px"
              label="Chọn"
            />
          </div>
        </div>

        <!-- <div class="row q-mt-md">
          <div class="col-6"></div>
            <div class="col-auto">
              <q-btn @click="navigationWoods" class="prodButtonText" outline style="color: goldenrod;" label="Chọn qui cách" />
             
            </div>
        </div> -->
        <div class="row justify-center q-mt-md">
          <div
            v-if="this.$store.state.production.woodsSelected.length > 0"
            class="col-12"
          >
            <div
              v-for="item in this.$store.state.production.woodsSelected"
              v-bind:key="item.id"
            >
              <card-item-in-from
                class="q-ma-xs"
                :removeItem="removeItem"
                :item="item"
              ></card-item-in-from>
            </div>
          </div>
          <!-- <div v-else class="col-8">
            <q-btn @click="chooseItem" class="glossy prodButtonText" rounded color="primary" label="Chọn qui cách tinh" />
          </div> -->
        </div>
        <div class="row justify-center q-mt-md">
          <div class="col-8 justify-center">
            <q-btn
              @click="createPallet"
              color="primary full-width q-mt-md"
              glossy
              label="Tạo pallet"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="row justify-center">
      <div class="col-6 justify-center">
        <q-inner-loading
          :showing="!this.$store.state.production.loadXepSayDone"
        >
          <q-spinner-gears size="150px" color="primary" />
        </q-inner-loading>
      </div>
    </div>
    <q-dialog
      v-model="showSuccess"
      persistent
      transition-show="slide-down"
      transition-hide="slide-down"
    >
      <q-card style="width: 350px">
        <q-card-section style="text-align: center">
          <div class="prodPalletCodeSuccess">{{ palletCode }}</div>
        </q-card-section>

        <q-card-actions align="center" style="font-size: 10px" class="bg-white">
          <q-btn flat class="text-primary" label="Hoàn thành" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { types, modules, feature } from "../../configs/constants";
import AppBar from "../../components/AppBar";
import CardItemInForm from "../../components/prod/CardItemInForm";
import InfoFactoryAndFSC from "../../components/prod/InforFactoryAndFSC";
import moment from "moment";
import { congDoans } from "../../store/base/getters";
export default {
  components: {
    "app-bar": AppBar,
    "info-factoryfsc": InfoFactoryAndFSC,
    "card-item-in-from": CardItemInForm,
  },
  computed: {
    ...mapGetters("base", ["myDepartments", "userInfo"]),
  },
  data() {
    return {
      items: [],
      item: null,
      palletTypes: [],
      palletTypeSelect: null,
      woodsLotNo: "",
      showSuccess: false,
      palletCode: "",
      materials: [],
      materialSelected: null,
      woodType: null,
      woodTypes: [],
      tonGoTuois: [],
    };
  },
  beforeDestroy() {
    this.$store.dispatch("production/ACTION_LOAD_XEP_SAY_DONE", false);
  },
  created() {
    if (this.palletTypeSelect) {
      if (this.palletTypeSelect.value == 100014) {
        this.loadTonSayLai();
      } else {
        this.loadTon();
      }
    }
  },
  mounted() {
    const malogo = JSON.parse(localStorage.getItem("malogo"));
    if (malogo !== null && malogo !== undefined && malogo !== "") {
      this.woodsLotNo = malogo;
    }
    console.log("this.palletTypeSelect", this.palletTypeSelect);
    if (this.palletTypeSelect) {
      if (this.palletTypeSelect.value == 100014) {
        this.loadTonSayLai();
      } else {
        this.loadTon();
      }
    } else {
      this.loadTon();
    }
    let loadPalletTypes = new Promise((resolve, reject) => {
      if (this.$store.state.production.typePalletInOutdoors.length > 0) {
        this.$store.state.production.typePalletInOutdoors.forEach((plTYpe) => {
          const p = {
            label: plTYpe.name,
            value: plTYpe.id,
          };
          this.palletTypes.push(p);
        });
        resolve(true);
      } else {
        this.$store
          .dispatch("production/ACTION_GET_PACKAGE_TYPE")
          .then((data) => {
            this.$store.state.production.typePalletInOutdoors.forEach(
              (plTYpe) => {
                const p = {
                  label: plTYpe.name,
                  value: plTYpe.id,
                };
                this.palletTypes.push(p);
              }
            );
            resolve(true);
          })
          .catch((err) => {
            reject(false);
          });
      }
    });
    let loadWoodTypes = new Promise((resolve, reject) => {
      this.$store
        .dispatch("production/ACTION_LOAD_WOOD_TYPES", "wood-processing")
        .then((res) => {
          res.data.forEach((wt) => {
            const wtypes = {
              label: wt.name,
              value: wt.id,
            };
            this.woodTypes.push(wtypes);
          });
          if (this.woodTypes.length > 0) {
            this.woodType = this.woodTypes[0];
          }
          resolve(true);
        });
    });
    let loadItems = new Promise((resolve, reject) => {
      const myFactoryId = 100000;
      const payload = {
        factoryId: myFactoryId,
      };
      this.$store
        .dispatch("production/ACTION_FETCH_ITEMS", payload)
        .then((e) => {
          resolve(true);
        })
        .catch((err) => {
          console.log(" Load Item Fail !", err);
          reject(false);
        });
    });
    Promise.all([loadPalletTypes, loadItems, loadWoodTypes])
      .then((value) => {
        console.log(value);
        this.$store.dispatch("production/ACTION_LOAD_XEP_SAY_DONE", true);
      })
      .catch((err) => {
        console.log(err);
        this.$q.notify({
          message: "Đã xảy ra lỗi !",
          position: "center",
        });
      });
  },
  methods: {
    changeType(val) {
      this.$store.dispatch("production/ACTION_SELECT_TYPE_IN_OUT", val);
      localStorage.setItem("typexs", JSON.stringify(val));
      if (this.palletTypeSelect.value == 100014 || this.palletTypeSelect.value == 100048
      || this.palletTypeSelect.value == 100049) {
        this.loadTonSayLai();
      } else {
        this.loadTon();
      }
    },
    selectItemChoosed(val) {},
    choose() {
      //nếu đã chọn qui cách này rồi thì không cho chọn tiếp
      if (
        this.$store.state.production.woodsSelected.findIndex((f) => {
          return f.id === this.materialSelected.value;
        }) === -1
      ) {
        let itemSelect = this.$store.state.production.items.find((i) => {
          return i.id === this.materialSelected.value;
        });
        let ton = this.tonGoTuois.find(
          (t) =>
            t.DAI == itemSelect.length &&
            t.RONG == itemSelect.width &&
            t.DAY == itemSelect.height
        );
        if (ton) {
          itemSelect.ton = ton.TONKKHOYS;
        } else {
          itemSelect.ton = 0;
        }
        console.log("itemSelect", itemSelect);
        console.log("ton", ton);
        this.$store
          .dispatch("production/ACTION_CHOOSE_WOODS", itemSelect)
          .then(() => {
            // this.$router.go(-1)
            this.materialSelected = null;
          });
      } else {
        this.$q.notify({
          message: "Qui cách này đã chọn trước đó rồi ",
          color: "red",
        });
      }
    },
    // async loadMaLoGo(dai, rong, day){
    //   const payload = {
    //     dai: dai,
    //     rong: rong,
    //     day: day
    //   }
    //   const data = await this.$store.dispatch('production/getMaLoGoByCC',payload);
    //   this.listMaLoGo = data.data;
    //   console.log("data",data);
    // },
    async loadTon() {
      let makho = null;
      let stepId = null;
      if (this.userInfo.factoryId == 100000) {
        makho = "TH";
        stepId = 102805;
      }
      if (this.userInfo.factoryId == 100003) {
        makho = "YS1";
        stepId = 102807;
      }
      if (this.userInfo.factoryId == 100005) {
        makho = "TB";
        stepId = 102806;
      }
      let payload = {
        toDate: moment().format("YYYY-MM-DD"),
        stepId: stepId,
        makho: makho,
        factoryId: this.userInfo.factoryId,
        ngay: "2023-02-01 00:00",
      };
      if (this.userInfo.factoryId == 100000) {
        payload.ngay = "2023-02-02 00:00";
      }
      const data = await this.$store.dispatch(
        "production/getTonGoTuoi",
        payload
      );
      this.tonGoTuois = data.data;
      console.log("data", this.tonGoTuois);
    },
    async loadTonSayLai() {
      const payload = {
        factoryId: this.userInfo.factoryId,
      };
      const data = await this.$store.dispatch(
        "production/getTonSayLai",
        payload
      );
      this.tonGoTuois = data.data;
    },
    saveLoWoods(val) {
      localStorage.setItem("malogo", JSON.stringify(val));
    },
    navigationWoods() {
      this.$router.push("/production-woods-items");
    },

    searchMaterial(val, update) {
      let itemDupplicate = [];
      console.log("this.$store.state.production.items", this.$store.state.production.items);
      if(this.palletTypeSelect.value == 100014){
        this.$store.state.production.items.forEach((it) => {
          const i = {
            label:
              it.height + " " + it.width + " " + it.length + " - " + it.name,
            value: it.id,
          };
          itemDupplicate.push(i);
      });
      }else{
        this.$store.state.production.items.forEach((it) => {
        if (it.typeId === 100002 || it.typeId === 100001) {
          const i = {
            label:
              it.height + " " + it.width + " " + it.length + " - " + it.name,
            value: it.id,
          };
          itemDupplicate.push(i);
        }
      });
      }
      console.log("itemDupplicate", itemDupplicate);
      if (val === "") {
        update(() => {
          this.materials = itemDupplicate;
          console.log("this.materials", this.materials);
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.materials = itemDupplicate.filter((v) => {
          const quicach = v.label;
          if (quicach.toString().indexOf(needle) > -1) {
            return v;
          }
        });
      });
    },
    createPallet() {
      console.log(
        "this.$store.state.production.woodsSelected.length",
        this.$store.state.production.woodsSelected
      );
      let wood = this.$store.state.production.woodsSelected;
      console.log("wood", wood);
      console.log("wood.ton - wood.qty", wood[0].ton - wood[0].qty);
      console.log("wood.ton", wood[0].ton);
      console.log("wood.qty", wood[0].qty);
      console.log("this.userInfo.factoryId", this.userInfo.factoryId);
      if (wood[0].ton - wood[0].qty < 0 && this.userInfo.factoryId == 100000) {
        this.$q.dialog({
          message: "Bạn nhập quá số lượng tồn !!!",
          color: "red",
        });
      } 
      else {
        if (
          this.$store.state.production.woodsSelected.length > 0 &&
          this.palletTypeSelect.value > 0
        ) {
          let itemIdArray = [];
          let qtyItemArray = [];
          let validateQty = true;
          for (
            let i = 0;
            i < this.$store.state.production.woodsSelected.length;
            i++
          ) {
            const w = this.$store.state.production.woodsSelected[i];
            if (w.qty === undefined) {
              validateQty = false;
              break;
            }
            if (parseFloat(w.qty) <= 0 || w.qty.toString().trim() === "") {
              validateQty = false;
              break;
            } else {
              itemIdArray.push(w.id);
              qtyItemArray.push(w.qty);
            }
          }
          if (validateQty) {
            this.destinationId = 102345;
            if (this.$store.state.base.userInfo.factoryId == 100000)
              this.destinationId = 100075;
            if (this.$store.state.base.userInfo.factoryId == 100005)
              this.destinationId = 102834;
            if (this.$store.state.base.userInfo.factoryId == 100003)
              this.destinationId = 102831;
            console.log("tao id:", this.destinationId);
            let body = {
              factoryId: this.userInfo.factoryId,
              sourceId: this.$store.getters["base/mySources"][0].id,
              destinationId: this.destinationId,
              itemId: itemIdArray.toString().replace("[").replace("]"),
              quantity: qtyItemArray.toString().replace("[").replace("]"),
              typeId: this.palletTypeSelect.value,
              parcel: this.woodsLotNo,
              woodTypeId: this.woodType ? this.woodType.value : null,
            };
            this.$store
              .dispatch("production/ACTION_CREATE_PALLET", body)
              .then((res) => {
                if (res.meta.success === true) {
                  if (this.palletTypeSelect.value == 100014) {
                    this.loadTonSayLai();
                  } else {
                    this.loadTon();
                  }
                  this.$store.dispatch("production/ACTION_REMOVE_ALL_WOOD");
                  this.palletCode = res.data[0].code;
                  this.showSuccess = true;
                  const titleMessage =
                    "Đã nhận được pallet số " + res.data[0].code;
                  const bodyMessage =
                    "Từ công đoạn  " +
                    this.$store.getters["base/mySources"][0].name;
                  const path =
                    "/#/production-dashboard?code=" + res.data[0].code;
                  const topic =
                    this.destinationId.toString() + "-RECIVED-PALLET";
                  this.$sendFcm(titleMessage, bodyMessage, path, topic, {
                    palletCode: this.palletCode,
                  }).then((resp) => {
                    console.log(resp);
                  });
                  this.$sendFcm();
                  this.$q.notify({
                    message: "Tạo pallet thành công !",
                    color: "green",
                  });
                  let eventLog = {
                    eventName: "Tạo Pallet Xếp Sấy",
                    timeStamp: new Date().toISOString(),
                    status: 1,
                    palletCode: this.palletCode,
                    palletType: this.palletTypeSelect.label,
                  };
                  this.$eventLog(eventLog);
                }
                //07T012
              });
          } else {
            this.$q.notify({
              message: "Dữ liệu không chính xác !",
              color: "red",
            });
          }
        } else {
          this.$q.notify({
            message: "Dữ liệu không chính xác !",
            color: "red",
          });
        }
      }
      console.log("this.palletTypeSelect.value", this.palletTypeSelect.value);
    },
    removeItem(wood) {
      this.$store.dispatch("production/ACTION_REMOVE_WOOD", wood);
    },
    closeSuccessDialog() {
      this.showSuccess = false;
    },
    closeDialog() {
      this.showSuccess = false;
    },
  },
};
</script>

<style>
</style>