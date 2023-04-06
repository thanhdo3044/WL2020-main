<template>
  <q-page class="q-pa-sm bg-blue-grey-7">
    <app-bar>Chi tiết mẻ sấy {{ this.$store.state.production.batchSelected.code }} -
      {{ this.$store.state.production.batchSelected.kilnName }}</app-bar>
    <div class="row justify-center q-mt-sm">
      <div class="col-12 col-sm-6">
        <q-card class="bg-blue-grey-7" style="border: 2px solid white">
          <q-card-section>
            <div class="row">
              <div class="col-10 prodTextTitle text-white">Biên bản kiểm tra lò sấy</div>
              <div class="col-2" align="right">
                <q-icon v-show="showButtonCreateBBCoDien" @click="goAddbbCheck" name="add_circle"
                  style="color: green; font-size: 2rem"></q-icon>
              </div>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <q-markup-table dark class="bg-blue-grey-7" separator="cell">
              <thead>
                <tr>
                  <th class="text-center">Số Biên bản</th>
                  <th class="text-right">Ngày kiểm tra</th>
                  <th class="text-right">Kết luận</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in bbCoDien" v-bind:key="item.id">
                  <td class="text-center">
                    <q-badge @click="goViewBBCODIEN(item)" color="blue">
                      {{ item.id }}
                    </q-badge>
                  </td>
                  <td class="text-right">{{ item.createDate }}</td>
                  <td class="text-right">{{ item.data.resultCode }}</td>
                  <!-- <td class="text-right"></td> -->
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row justify-center">
      <div v-if="showInBatch" class="col-12 col-sm-6">
        <q-card class="q-pa-md bg-blue-grey-7" style="border:2px solid white">
          <div class="row">
            <div class="col-12">
              <p class="prodTextTitle text-white">Vào lò</p>
            </div>
          </div>
          <div class="row">
            <div class="col-8 q-pa-xs">
              <!-- <q-input outlined v-model.number="palletCode" label="Số pallet" /> -->
              <q-select dark use-input filled @filter="filterFn" outlined v-model="palletCode" :options="options"
                label="Mã Pallet" behavior="menu" />
            </div>
            <div v-if="showButtonInBatch" class="col-4 q-pa-xs">
              <q-btn class="full-width" @click="validateInBatch" style="height: 100%" label="Vào lò" stack glossy
                color="blue" />
            </div>
            <div v-else class="col-4 q-pa-sm justify-center">
              <q-spinner-ios color="primary" size="4em" />
            </div>
          </div>
        </q-card>
      </div>
    </div>
    <div v-if="this.$store.state.production.batchSelected.status === 'process'" class="row justify-center q-mt-sm">
      <div class="col-12 col-sm-6">
        <q-card class="bg-blue-grey-7" style="border:2px solid white">
          <q-card-section>
            <div class="row">
              <div class="col-10">
                <p class="prodTextTitle text-white">Danh sách biên bản kiểm tra độ ẩm</p>
              </div>
              <div class="col-2" align="right">
                <q-icon v-show="showConfirmBatch" @click="goAddbbmc" name="add_circle"
                  style="color: orange; font-size: 2rem"></q-icon>
              </div>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <q-markup-table dark class="bg-blue-grey-7" separator="cell">
              <thead>
                <th class="text-left">STT</th>
                <th class="text-left">Tỷ lệ</th>
                <th class="text-left">Ngày tạo</th>
                <th class="text-left">Tạo bởi</th>
              </thead>
              <tbody>
                <tr v-for="(item, index) in dataMC" v-bind:key="item.id">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <q-badge v-if="item.data.result.type === 'ralo'" @click="goViewBBMC(item)" color="green">
                      {{
                          parseFloat(item.data.alloc.rate.thap) +
                          parseFloat(item.data.alloc.rate.dich)
                      }}
                      %
                    </q-badge>
                    <q-badge v-else @click="goViewBBMC(item)" color="red">
                      {{
                          parseFloat(item.data.alloc.rate.thap) +
                          parseFloat(item.data.alloc.rate.dich)
                      }}
                      %
                    </q-badge>
                  </td>
                  <td>{{ item.createDate }}</td>
                  <td>{{ item.createName }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-if="this.$store.state.production.batchSelected.status === 'process'" class="row justify-center q-mt-sm">
      <div class="col-12 col-sm-6">
        <q-card class="bg-blue-grey-7" style="border:2px solid white">
          <q-card-section>
            <div class="row">
              <div class="col-10">
                <div class="prodTextTitle text-white">
                  Biên bản khảo sát tỷ lệ khuyết tật
                </div>
              </div>
              <div v-show="showButtonCreateBBKT" class="col-2" align="right">
                <q-icon @click="goAddbbkt" name="add_circle" style="color: orange; font-size: 2rem"></q-icon>
              </div>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <q-markup-table dark class="bg-blue-grey-7" separator="cell">
              <thead>
                <th class="text-left">STT</th>
                <th class="text-left">TL mo, Tóp</th>
                <th class="text-left">TL cong</th>
                <th class="text-left">Tổng SL kiểm tra</th>
                <th class="text-left">Ngày tạo</th>
              </thead>
              <tbody>
                <tr v-for="(item, index) in dataKT" v-bind:key="item.id">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <q-badge @click="goViewBBKT(item)" color="red">
                      {{ item.data.moRate || 0 }} %
                    </q-badge>
                  </td>
                  <td>
                    <q-badge @click="goViewBBKT(item)" color="red">
                      {{ item.data.congRate || 0 }} %
                    </q-badge>
                  </td>
                  <td>{{ item.data.totalKT || 0 }}</td>
                  <td>{{ item.createDate }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-12 col-sm-6" style="margin-top: 10px">
        <q-card style="font-family: 'Time New Roman'; border: 2px solid white" class="bg-blue-grey-7">
          <q-card-section>
            <div class="row">
              <div class="col-6 text-amber">Mục đích sấy :</div>
              <div class="col-6 text-white">
                {{
                    this.$store.state.production.batchSelected.type ||
                    "Không xác định"
                }}
              </div>
            </div>
            <div class="row">
              <div class="col-6 text-amber">Chiều dầy sấy :</div>
              <div class="col-6 text-white">
                {{ this.$store.state.production.batchSelected.height }}
              </div>
            </div>
            <div class="row">
              <div class="col-6 text-amber">Chiều dài sấy :</div>
              <div class="col-6 text-white">
                {{ this.$store.state.production.batchSelected.length }}
              </div>
            </div>
            <div class="row">
              <div class="col-6 text-amber">Ngày ra lò dự kiến :</div>
              <div class="col-6 text-white">
                {{ this.$store.state.production.batchSelected.timeout }}
              </div>
            </div>
            <div class="row">
              <div class="col-6 text-amber">Tổng số pallet :</div>
              <div class="col-6 text-white">
                {{ qtyPallet }}
              </div>
            </div>
            <div class="row">
              <div class="col-6 text-amber">Tổng khối lượng :</div>
              <div class="col-6 text-white">
                {{ totalM3 || 0 }}
                (m³)
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row justify-center q-ma-sm">
      <div v-if="
        showOutBatch &&
        this.$store.state.production.batchSelected.verify === 1 && checkType === 1
      " class="col-12 col-sm-6">
        <q-card class="q-pa-md bg-blue-grey-7">
          <div class="row">
            <div class="col-12">
              <p class="prodTextTitle text-white">Ra lò</p>
            </div>
          </div>
          <div class="row">
            <div class="col-12 q-pa-xs">
              <p class="prodTextNormal text-white">Mẻ sấy đã đạt tiêu chuẩn ra lò</p>
              <q-btn @click="showConfirmOut = true" align="center" class="full-width q-mt-md" color="primary"
                label="Xác nhận ra lò" />
            </div>
          </div>
        </q-card>
      </div>
      <div v-if="
        showOutBatch && checkType === 0
      " class="col-12 col-sm-6">
        <q-card class="q-pa-md bg-blue-grey-7">
          <div class="row">
            <div class="col-12">
              <p class="prodTextTitle text-white">Ra lò</p>
            </div>
          </div>
          <div class="row">
            <div class="col-12 q-pa-xs">
              <p class="prodTextNormal text-white">Mẻ sấy đã đạt tiêu chuẩn ra lò</p>
              <q-btn @click="showConfirmOut = true" align="center" class="full-width q-mt-md" color="primary"
                label="Xác nhận ra lò" />
            </div>
          </div>
        </q-card>
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-12 col-sm-6" style="margin-top: 10px">
        <q-card class="bg-blue-grey-7" style="border: 2px solid white">
          <q-card-section>
            <div class="row">
              <div class="col-4 prodTextTitle text-white">Các kích thước</div>
              <div class="col-4">
                <q-btn color="primary" label="Xem" @click="showDetail = true" />
              </div>
               <div class="col-4">
                <q-btn v-if="$route.query.type == 'ls' && showStartCard == false  &&
        this.$store.state.production.batchSelected.verify != 1  " color="primary" label="Sửa" @click="sua" />
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-scroll-area horizontal style="height: 180px; width: 100%" class="bg-grey-1">
              <div class="row no-wrap">
                <q-card class="bg-secondary text-white" v-for="item in items" :key="item.plCode" style="
                    font-family: 'Time New Roman';
                    min-width: 145px;
                    margin-right: 10px;
                  ">
                  <q-card-section v-if="showInBatch">
                    <q-btn dense color="red" label="X" style="
                        font-family: 'Time New Roman';
                        margin-top: -30px;
                        margin-left: -17px;
                        height: 25px;
                      " @click="onshowshowConfirmDel(item.plCode)" />
                    <br />
                    <strong>KT:
                      {{
                          item.height + "x" + item.width + "x" + item.length
                      }}</strong>
                  </q-card-section>
                  <q-card-section v-else>
                    <strong>KT:
                      {{
                          item.height + "x" + item.width + "x" + item.length
                      }}</strong>
                  </q-card-section>

                  <q-separator></q-separator>
                  <q-card-section>
                    <p>Pallet :{{ item.plCode }}</p>
                    <p>
                      SL :
                      {{ parseFloat(parseFloat(item.quantity).toFixed(2)) }} (t)
                    </p>
                    <p v-if="item.length == 1270">
                      KL :
                      {{
                          parseFloat(
                            (
                              (item.quantity *
                                Math.pow(10, -9) *
                                item.height *
                                item.width *
                                item.length *
                                3.14) /
                              4
                            ).toFixed(4)
                          ) || parseFloat(parseFloat(item.quantity).toFixed(2))
                      }}
                      (m³)
                    </p>
                    <p v-else>
                      KL :
                      {{
                          parseFloat(
                            (
                              item.quantity *
                              Math.pow(10, -9) *
                              item.height *
                              item.width *
                              item.length
                            ).toFixed(4)
                          ) || parseFloat(parseFloat(item.quantity).toFixed(2))
                      }}
                      (m³)
                    </p>
                  </q-card-section>
                </q-card>
              </div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-show="showStartCard" class="row justify-center q-mt-sm">
      <div class="col-12 col-sm-6">
        <q-card>
          <q-card-section class="prodTextNormal">
            <p>- Chú ý :</p>
            <p style="font-style: italic">
              + Thời gian sấy sẽ bắt đầu được tính khi nhấn BẮT ĐẦU SẤY
            </p>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-actions>
            <q-btn @click="showConfirmStart = true" color="primary full-width q-mt-md" glossy label="Bắt đầu sấy" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="showConfirmInBatch" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn ? !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" color="primary" @click="inbatch" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showConfirmDel" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn muốn xóa Pallet ? !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" color="primary" @click="deletePallet" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showConfirmOut" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn ? !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" color="primary" @click="confirmOutBatch" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showConfirmStart" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn ? !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" color="primary" v-close-popup @click="confirmStartBatch" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog @show="evtShowConfirmDialog" v-model="showDialogConfirmBatch" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn ? !</span>
        </q-card-section>

        <q-card-actions align="right">
          <transition-group appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <q-btn key="text" flat label="Hủy" color="primary" v-close-popup />
            <q-btn key="text1" flat label="Đồng Ý" color="primary" @click="ConfirmQuality" />
          </transition-group>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- <q-dialog
      v-model="showDetail"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
    <q-card class="bg-white" style="width:100%">
       <q-table
        class="col-12"
        :data="items"
        separator="cell"
        :columns="columns"
        row-key="name"
        :pagination="pagination"
      />
    </q-card>
      <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
    </q-dialog> -->
    <q-dialog v-model="showDetail" maximized persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-table class="my-sticky-virtscroll-table" style="width:100%" :data="items" separator="cell"
            :columns="columns" virtual-scroll :rows-per-page-options="[0]" :virtual-scroll-sticky-size-start="48"
            row-key="plCode" :pagination="pagination" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="showLoading">
      <q-spinner-ios color="primary" size="80px" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { QSpinnerRadio } from "quasar";
import AppBar from "../../components/AppBar";
import { types, feature } from "../../configs/constants";
import { showNotifyValidate, showNotifyError } from "../../utils/utils";
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from "@fortawesome/vue-fontawesome";
export default {
  components: {
    "app-bar": AppBar,
  },
  computed: {
    ...mapGetters("base", ["myDepartments", "userInfo"]),
  },
  data() {
    return {
      stock: null,
      palletCodeDel: null,
      showButtonInBatch: true,
      showConfirmDel: false,
      palletCode: null,
      items: [],
      showDetail: false,
      isQCVerify: false,
      options: [],
      options1: [],
      showInBatch: false,
      showConfirmBatch: false,
      showOutBatch: false,
      humidity: " 80%",
      showConfirm: false,
      showConfirmOut: false,
      showDialogConfirmBatch: false,
      showLoading: true,
      showConfirmInBatch: false,
      showButtonComfirmBatch: true,
      checkType: null,
      qtyPallet: 0,
      totalM3: 0,
      dataMC: [],
      dataKT: [],
      pagination: {
        rowsPerPage: 0,
      },
      columns: [
        {
          name: "Pallet",
          label: "Pallet",
          field: "plCodshowStartCarde",
        },
        { name: "Dày", label: "Dày", field: "height" },
        { name: "Rộng", label: "Rộng", field: "width" },
        { name: "Dài", label: "Dài", field: "length" },
        { name: "SL", label: "SL", field: "quantity" },
        { name: "KL", label: "KL", field: "volumn" },
      ],
      showButtonCreateBBKT: false,
      showButtonCreateBBCoDien: false,
      bbCoDien: [],
      showConfirmStart: false,
      showStartCard: false,
    };
  },
  async created() {
    this.loadPermission();
    this.checkTypeKiln();
    this.load();
    // await this.loadBBMC()
    // await this.loadBBKT()
    // await this.loadBBCoDien()
    console.log('>>>>>>>', this.$store.state.production.batchSelected);
    Promise.all([
      this.initData(),
      this.loadBBMC(),
      this.loadBBKT(),
      this.loadBBCoDien(),
    ]).then((res) => {
      const typeScreen = this.$route.query.type;
      if (typeScreen) {
        switch (typeScreen) {
          case "vl":
            this.showInBatch = true;
            break;
          case "ls":
            if (
              this.$store.state.production.batchSelected.status === "created"
            ) {
              if (this.bbCoDien.length > 0) {
                if (
                  this.bbCoDien[this.bbCoDien.length - 1].data.resultCode ===
                  "OK"
                ) {
                  this.showStartCard = true;
                }
              }
            }
            if (
              this.$store.state.production.batchSelected.status === "process"
            ) {
              this.showOutBatch = true;
            }
            break;
          case "dg":
            this.showButtonCreateBBKT = true;
            if (this.$store.state.production.batchSelected.verify !== 1) {
              this.showConfirmBatch = true;
            }
            break;
          case "cd":
            if (this.bbCoDien.length == 0) this.showButtonCreateBBCoDien = true;
            break;
          default:
            break;
        }
      } else {
        showNotifyError("PATH PARAMETER ERROR !");
      }
      this.showLoading = false;
    });
  },
  methods: {
    ...mapActions("production", [
      "postPermissionInScreen"
    ]),
    checkTypeKiln() {
      if (this.$store.state.production.batchSelected.type === 'SẤY LẠI OUTDOOR' || this.$store.state.production.batchSelected.type === 'SẤY LẠI INDOOR') {
        this.checkType = 0;
      } else {
        this.checkType = 1;
      }
    },
    async loadPermission() {

      const payloadPermission = {
        path: "/production-batchs?type=vl",
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.postPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((el) => {
        if (el.CODE == "QCVerify") {
          this.isQCVerify = true;
        }
        if (el.CODE == "TKVerify") {
          this.isTKVerify = true;
        }
        if (el.CODE == "VTVerify") {
          this.isVTVerify = true;
        }
      });

    },
    async load() {
      let payload = {
        fromDate: 0,
        toDate: 0,
        factoryId: this.userInfo.factoryId,
      };
      let palletCode = await this.$store.dispatch(
        "production/getListPallet",
        payload
      );
      this.options = palletCode.sort();
      // this.options1 = palletCode
      //   .filter((pl) => pl.VERIFY_BY === null)
      //   .map((t) => (t.label = t.code))
      //   .sort();
      const palletCodeValue = palletCode.filter((pl) => pl.VERIFY_BY === null);
      let arr = [];
      palletCodeValue.forEach((e) => {
        arr.push({
          value: e.code,
          label:
            e.code +
            " (" +
            e.ViewItemInPallets[0].height +
            "x" +
            e.ViewItemInPallets[0].width +
            "x" +
            e.ViewItemInPallets[0].length +
            ") " +
            e.ViewItemInPallets[0].quantity +
            "T - " + e.TYPE_NAME,
        });
      });
      this.options1 = arr.sort();
    },
    async onshowshowConfirmDel(item) {
      this.palletCodeDel = item;
      this.showConfirmDel = true;
    },
    async deletePallet() {
      this.$store
        .dispatch("production/reInBath", { code: this.palletCodeDel })
        .then(() => {
          this.showConfirmDel = false;
          this.items = this.items.filter(
            (item) => item.plCode != this.palletCodeDel
          );
          this.options1.push(this.palletCodeDel);
          this.load();
          this.initData();
          this.$q.notify({
            message: "Đã Xóa !",
            color: "green",
            position: "center",
          });
        })
        .catch((e) => {
          this.showConfirmDel = false;
          this.$q.notify({
            message: "Lỗi",
            color: "red",
            position: "center",
          });
        });
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.options = this.options1;
        });
        return;
      }
      update(() => {
        const needle = val;
        this.options = this.options1.filter(
          (v) => v.value.indexOf(needle) > -1
        );
      });
    },
    async validateInBatch() {
      console.log('SX:', this.isQCVerify)
      if (this.items.length > 0 && (this.$store.state.production.batchSelected.type == 'INDOOR'
        || this.$store.state.production.batchSelected.type == 'OUTDOOR') && this.isQCVerify == false) {
        let payload = {
          palletCode: this.palletCode.value
        };
        this.palletCode1 = await this.$store.dispatch(
          "production/getListPalletcode",
          payload
        );

        if (this.palletCode1[0].HEIGHT <= this.items[0].height - (4 - this.items[this.items.length - 1].height + this.items[0].height) ||
          this.palletCode1[0].HEIGHT >= this.items[this.items.length - 1].height + (4 - this.items[this.items.length - 1].height + this.items[0].height)) {
          this.$q.dialog({
            title: "Lỗi",
            html: true,
            message: `<span class="text-red">Vượt quá chiều dày chênh lệnh 3mm!</span>`
          });
        } else {
          let pallet = this.items.filter(i => i.plCode == this.palletCode.value);
          if (pallet.length > 0) {
            this.$q.dialog({
              title: "Lỗi",
              message: "Pallet đã vào lò!"
            });
          } else {
            if (this.palletCode.value.toString().length >= 8) {
              this.showButtonInBatch = false;
              this.showConfirmInBatch = true;
            } else {
              this.$q.notify({
                message: "Số pallet không chính xác !",
                color: "red",
              });
            }
          }
        }
      } else {
        let pallet = this.items.filter(i => i.plCode == this.palletCode.value);
        if (pallet.length > 0) {
          this.$q.dialog({
            title: "Lỗi",
            message: "Pallet đã vào lò!"
          });
        } else {
          if (this.palletCode.value.toString().length >= 8) {
            this.showButtonInBatch = false;
            this.showConfirmInBatch = true;
          } else {
            this.$q.notify({
              message: "Số pallet không chính xác !",
              color: "red",
            });
          }
        }
      }
    },
    inbatch() {
      this.showConfirmInBatch = false;
      let totalEventLog = JSON.parse(localStorage.getItem("eventLog"));
      if (!totalEventLog) {
        totalEventLog = [];
      }
      let eventLog = {
        eventName:
          "Vào lò ,mẻ sấy " + this.$store.state.production.batchSelected.code,
        timeStamp: new Date(),
        status: 1,
        palletCode: this.palletCode.value.toString().trim(),
      };
      if (this.userInfo.factoryId == 100000) this.destinationId = 102484;
      if (this.userInfo.factoryId == 100003) this.destinationId = 102493;
      if (this.userInfo.factoryId == 100005) this.destinationId = 102494;
      if (this.$store.getters["base/myDestinations"].length > 0)
        this.destinationId = this.$store.getters["base/myDestinations"][0].id;
      const payload = {
        data: {
          sourceId: this.$store.getters["base/mySources"][0].id,
          destinationId: this.destinationId,
          accountId: this.userInfo.id,
          kilnBatchId: this.$store.state.production.batchSelected.id,
        },
        palletCode: this.palletCode.value.toString().trim(),
      };
      this.$store
        .dispatch("production/ACTION_IN_BATCH", payload)
        .then((res) => {

          if (res.meta.success === true) {
            this.load();
            this.initData();
            this.options = this.options.filter(
              (op) => op != this.palletCode.value
            );
            this.options1 = this.options1.filter(
              (op) => op != this.palletCode.value
            );
            this.$q.notify({
              message: "Đã vào lò !",
              color: "green",
              position: "center",
            });
            this.qtyPallet = this.items.length;
            this.palletCode = null;
            this.$eventLog(eventLog);
          } else {
            this.$q.notify({
              message: res.meta.messages.messages,
              color: "red",
            });
          }

          this.showButtonInBatch = true;
        })
        .catch((er) => {
          this.$q.notify({
            message:
              er.data.meta.messages.message ||
              er.data.meta.messages.originalError.info.message,
            color: "red",
          });
          this.showButtonInBatch = true;
        });

      // this.showButtonInBatch = true
    },
    goAddbbmc() {
      this.$router.push({
        name: "addbbmc",
        params: { kinlbatchid: this.$store.state.production.batchSelected.id },
      });
    },
    async initData() {
      let pallets = this.$store.state.production.batchSelected.ballets;
      this.stock = pallets;
      let allQuyCach = await this.$store.dispatch(
        "production/getItemInKilnBatch",
        this.$store.state.production.batchSelected.id
      );
      this.items = allQuyCach.data;
      this.qtyPallet = this.items.length;
      let total = 0;
      this.items.forEach((i) => {
        if (i.length === 1270) {
          total += parseFloat(
            (i.quantity *
              Math.pow(10, -9) *
              i.height *
              i.width *
              i.length *
              3.14) /
            4
          );
        } else if (i.length != 0) {
          total += parseFloat(
            i.quantity * Math.pow(10, -9) * i.height * i.width * i.length
          );
        } else {
          total += parseFloat(i.quantity * i.volumn);
        }

      });
      this.totalM3 = total.toFixed(4);
    },
    confirmBatch() { },
    async loadBBMC() {
      let dataMC = await this.$store.dispatch(
        "production/ACTION_LOAD_BB_MC_BY_BATCHID",
        this.$store.state.production.batchSelected.id
      );
      this.dataMC = dataMC.data;
    },
    async loadBBKT() {
      let dataKT = await this.$store.dispatch(
        "production/ACTION_LOAD_BB_KT_BY_BATCHID",
        this.$store.state.production.batchSelected.id
      );
      this.dataKT = dataKT.data;
    },
    async loadBBCoDien() {
      let bbCoDien = await this.$store.dispatch(
        "production/ACTION_LOAD_BB_CO_DIEN_BY_BATCHID",
        this.$store.state.production.batchSelected.id
      );
      this.bbCoDien = bbCoDien.data;
    },
    evtShowConfirmDialog() {
      this.showLoading = false;
      this.showButtonComfirmBatch = false;
    },
    confirmOutBatch() {
      this.showConfirmOut = false;
      const payload = {
        data: {
          token: this.$store.state.production.userInfo.token,
        },
        batchId: this.$store.state.production.batchSelected.id,
      };
      if (this.checkType === 0) {
        this.$store
          .dispatch("production/ACTION_OUT_BATCH_SAYLAI", payload)
          .then((res) => {
            if (res.meta.success === true) {
              this.$q.notify({
                message: "Đã ra lò !",
                color: "green",
                position: "center",
              });
              let factoryId = 100001;
              const topic = factoryId + "-LOSAY";
              const titleMessage =
                "Mẻ sấy số " +
                this.$store.state.production.batchSelected.code +
                " đã ra lò ";
              const bodyMessgae = "";
              const path = "/";
              this.$sendFcm(titleMessage, bodyMessgae, path, topic, {})
                .then((res) => {
                })
                .catch((err) => {
                });
              this.$router.go(-1);
            } else {
              this.$q.notify({
                message: res.meta.messages.messages,
                color: "red",
              });
            }
          })
          .catch((er) => {
            this.$q.notify({
              message:
                er.data.meta.messages.message ||
                er.data.meta.messages.originalError.info.message,
              color: "red",
            });
          });
      } else {
        this.$store
          .dispatch("production/ACTION_OUT_BATCH", payload)
          .then((res) => {
            if (res.meta.success === true) {
              this.$q.notify({
                message: "Đã ra lò !",
                color: "green",
                position: "center",
              });
              let factoryId = 100001;
              const topic = factoryId + "-LOSAY";
              const titleMessage =
                "Mẻ sấy số " +
                this.$store.state.production.batchSelected.code +
                " đã ra lò ";
              const bodyMessgae = "";
              const path = "/";
              this.$sendFcm(titleMessage, bodyMessgae, path, topic, {})
                .then((res) => {
                })
                .catch((err) => {
                });
              this.$router.go(-1);
            } else {
              this.$q.notify({
                message: res.meta.messages.messages,
                color: "red",
              });
            }
          })
          .catch((er) => {
            this.$q.notify({
              message:
                er.data.meta.messages.message ||
                er.data.meta.messages.originalError.info.message,
              color: "red",
            });
          });
      }
    },
    ConfirmQuality() {
      this.showDialogConfirmBatch = false;
      const payload = {
        batchId: this.$store.state.production.batchSelected.id,
        data: {
          token: this.$store.state.production.userInfo.token,
          humidity: this.humidity,
          state: "ok",
        },
      };
      this.$store
        .dispatch("production/ACTION_QC_CONFIRM_BATCH", payload)
        .then((res) => {
          if (res.meta.success === true) {
            this.$q.notify({
              message: "Xác nhận thành công !",
              position: "center",
              color: "green",
            });
            this.$router.go(-1);
            this.showButtonComfirmBatch = true;
          } else {
            this.$q.notify({
              message: res.meta.messages.message,
              color: "red",
            });
            this.showButtonComfirmBatch = true;
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: err,
            color: "red",
          });
          this.showButtonComfirmBatch = true;
        });
    },
    goViewBBMC(bb) {
      // this.$q.notify({
      //     message:'Đang phát triển !'
      // })
      this.$store.dispatch("production/ACTION_SELECT_BBMC", bb);
      this.$router.push("/production-view-bbmc");
    },
    goViewBBKT(bb) {
      // this.$q.notify({
      //     message:'Đang phát triển !'
      // })
      this.$store.dispatch("production/ACTION_SELECT_BBKT", bb);
      this.$router.push("/production-view-bbkt");
    },
    goAddbbkt() {
      this.$router.push({
        name: "addbbkt",
        params: { kinlbatchid: this.$store.state.production.batchSelected.id },
      });
    },
    goAddbbCheck() {
      this.$router.push({
        name: "addbbcheck",
        params: { kinlbatchid: this.$store.state.production.batchSelected.id },
      });
    },
    goViewBBCODIEN(bb) {
      this.$store.dispatch("production/ACTION_SELECT_BBCODIEN", bb);
      this.$router.push("/production-view-bbcodien");
    },
     async sua() {
      let payload = {
        kilnBatchId: this.$store.state.production.batchSelected.id,
        data: {
          status: "created",
        },
      };
      // this.$q.loading.show({
      //   spinner: QSpinnerRadio,
      //   spinnerColor: "blue",
      // });
      let data = await this.$store.dispatch(
        "production/ACTION_KILN_BATCH_UPDATE_STATUS",
        payload
      );
        if (data.meta.success) {
         this.$router.push("/production-batchs?type=vl");
        }
     },
    async confirmStartBatch() {
      let payload = {
        kilnBatchId: this.$store.state.production.batchSelected.id,
        data: {
          status: "process",
        },
      };
      this.$q.loading.show({
        spinner: QSpinnerRadio,
        spinnerColor: "blue",
      });
      let data = await this.$store.dispatch(
        "production/ACTION_KILN_BATCH_UPDATE_STATUS",
        payload
      );
      this.$q.loading.hide();
      if (data.meta.success) {
        this.$q.notify({
          message: "Mẻ sấy đã được bắt đầu !",
          color: "green",
        });
        let factoryId = this.$store.getters["base/myFactoryInfor"].id;
        const topic = factoryId + "-LOSAY";
        const titleMessage =
          "Mẻ sấy số " +
          this.$store.state.production.batchSelected.code +
          " đã bắt đầu sấy ";
        const bodyMessgae = "";
        const path = "/";
        this.$sendFcm(titleMessage, bodyMessgae, path, topic, {})
          .then((res) => {
          })
          .catch((err) => {
          });
        this.$router.go(-1);
      } else {
        this.$q.notify({
          message: data.meta.messages,
        });
      }
    },
  },
};
</script>

<style>
.q-virtual-scroll__content {
  background-color: #546e7a;
}
</style>
<style lang="sass">
.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: 610px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>