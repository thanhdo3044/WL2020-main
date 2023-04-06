<template>
  <q-page class="q-pa-sm bg-blue-grey-7">
    <q-btn
      v-show="showListPackage"
      align="around"
      @click="showDialogErr"
      class="btn-fixed-width q-mb-sm bg-red text-white"
      label="Danh sách phôi lỗi chờ xử lý"
      icon="send"
    />
    <q-btn
      v-show="showListPackageRough"
      align="around"
      @click="onShowDialogRough"
      class="btn-fixed-width q-mb-sm bg-green text-white"
      label="Danh sách phôi chờ nhận"
      icon="send"
    />
    <q-dialog v-model="dialogErr">
      <q-card>
        <q-card-section class="bg-primary text-white">
          <!-- <div class="text-h6">Danh sách lỗi công đoạn chờ nhận </br> {{ congdoan.name}}</div> -->
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list separator>
            <q-item
              class="q-mt-sm bg-cyan-1 shadow-8 text-black"
              v-for="(item, index) in listPackage"
              :key="index"
            >
              <q-item-section>
                <div>
                  LSX : <q-badge>{{ item.number }}</q-badge>
                </div>
                <div>
                  Chi tiết/cụm : <b>{{ item.Chi_tiet_cum }}</b>
                </div>
                <div>
                  Số lượng : <b>{{ item.So_luong }}</b>
                </div>
                <div>
                  Loại lỗi : <b>{{ item.Loai_loi }}</b>
                </div>
                <div>
                  Biện pháp xử lý : <b>{{ item.BP_xu_ly }}</b>
                </div>
                <div>
                  Người tạo : <b>{{ item.Nguoi_tao }}</b>
                </div>
                <div>
                  Ngày tạo : <b>{{ moment(item.Ngay_tao).format("l") }}</b>
                </div>
                <br />
              </q-item-section>
              <q-item-section side>
                <q-icon
                  style="padding: 8px; border-radius: 50%; font-size: 20px"
                  @click="confirmLoi(item)"
                  class="bg-red shadow-6"
                  push
                  round
                  dense
                  :name="iconfasCheckCircle"
                  color="white"
                  label="ghi nhận"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
    <br />
    <div class="row">
      <div class="col-1">
        <q-icon
          color="white"
          name="keyboard_arrow_left"
          size="36px"
          @click="goBack"
        ></q-icon>
      </div>
      <div class="col-10">
        <q-input
          label-color="amber"
          class="q-mb-sm"
          outlined
          v-model="searchQuery"
          label="Tìm kiếm"
          dense
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- <old-tasks></old-tasks> -->
    <!-- <no-tasks v-if="!pos(null).length"></no-tasks> -->

    <q-list
      separator
      bordered
      v-if="congdoan.id == 102613 || congdoan.id == 102625"
    >
      <q-item
        v-for="(task, key) in pos(searchQuery)"
        :key="key"
        @click="showConfirmDialogStrucre(task)"
        clickable
        v-ripple
      >
        <q-item-section>
          <q-item-label class="text-subtitle2">
            {{ task.itemName }} ({{ task.itemHeight }}*{{ task.itemWidth }}*{{
              task.itemLength
            }}
            )
          </q-item-label>
          <q-item-label caption lines="2">
            <q-badge :color="'teal'">
              {{ task.root }}
            </q-badge>
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-badge :color="'teal'" :label="task.conThucHien" />
          <q-btn
            class="bg-green text-white q-mt-sm text-caption"
            style="width: 100px"
            label="Ghi nhận"
            @click.stop="showConfirmDialog(task)"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <q-list separator bordered v-else>
      <q-item
        v-for="(task, key) in pos(searchQuery)"
        :key="key"
        @click="showConfirmDialog(task)"
        clickable
        v-ripple
      >
        <q-item-section>
          <q-item-label class="text-subtitle2 text-white">
            {{ task.itemName }} ({{ task.itemHeight }}*{{ task.itemWidth }}*{{
              task.itemLength
            }}
            )
          </q-item-label>
          <q-item-label caption lines="2">
            <q-badge :color="'teal'">
              {{ task.root }}
            </q-badge>
            <q-badge> công đoạn số : {{ task.order }} </q-badge>
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-badge :color="'teal'" :label="task.conThucHien" />
        </q-item-section>
      </q-item>
    </q-list>
    <div class="inline rounded-borders cursor-pointer" style="max-width: 300px">
      <div
        class="
          fit
          flex flex-center
          text-center
          non-selectable
          q-pa-md
          text-white
        "
      >
        <span class="text-amber">Công đoạn:</span> ([{{ congdoan.code }}] -
        {{ congdoan.name }})
      </div>

      <q-menu touch-position>
        <q-list style="min-width: 100px">
          <q-item
            clickable
            v-close-popup
            v-for="item in departments"
            :key="item.id"
          >
            <q-item-section @click="chonCongdoan(item)">
              [{{ item.code }}] - {{ item.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>

    <q-dialog v-model="structDialog" :maximized="false">
      <q-card class="my-card">
        <div class="q-pa-md">
          <q-table
            title="Kết cấu ván"
            :data="data"
            separator="cell"
            :columns="columns"
            row-key="name"
            :pagination="pagination"
          />
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="card" :maximized="false">
      <q-card v-if="po" class="my-card">
        <q-card-section>
          <q-btn
            flat
            icon="keyboard_arrow_left"
            label="Trở lại"
            v-close-popup
          />
          <div
            style="text-align: center; font-size: 14px; font-weight: bold"
            class="bg-blue text-white"
          >
            {{ po.root }}
          </div>
          <q-input
            v-model="po.itemName"
            :readonly="true"
            type="text"
            label="Sản phẩm/Chi tiết"
          />
          <div class="row">
            <div class="col-4" align="center">
              <q-input
                v-model="po.itemHeight"
                :readonly="true"
                type="text"
                label="Dầy"
              />
            </div>
            <div class="col-4" align="center">
              <q-input
                v-model="po.itemWidth"
                :readonly="true"
                type="text"
                label="Rộng"
              />
            </div>
            <div class="col-4" align="center">
              <q-input
                v-model="po.itemLength"
                :readonly="true"
                type="text"
                label="Dài"
              />
            </div>
          </div>
          <div
            header
            style="padding-top: 10px; font-size: 12px; font-weight: bold"
            class="text-primary"
          >
            Số lượng phôi đã nhận và phôi tồn tại tổ:
            <div class="bg-green-2 row" v-if="po.previousName">
              <q-separator />
              <q-item class="col-12" style="padding-left: 0px">
                <q-item-section>
                  <q-item-label caption lines="3" class="text-blue"
                    >{{ po.previousName }} {{ po.previousHeight }} *
                    {{ po.previousWidth }} * {{ po.previousLength }}:
                    <q-badge :label="po.previousQuantity"
                  /></q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <q-separator />
          </div>

          <!-- <q-input
            v-model.number="maxCoTheGhiNhan"
            :readonly="true"
            type="number"
            label-color="primary"
            label="Phôi có thể xuất"
          /> -->
          <hr />
          <div style="padding-left: 0px; padding-top: 0px">
            <q-item-section style="padding-top: 0px">
              <q-item-label
                caption
                lines="2"
                class="text-positive"
                style="font-size: 12px; padding-top: 0px; font-weight: bold"
              >
                Phôi có thể xuất:
                <q-badge class="bg-positive" :label="maxCoTheGhiNhan"
              /></q-item-label>
            </q-item-section>
          </div>
          <hr />
          <div>
            <div style="padding-left: 0px; padding-top: 0px">
              <q-item-section style="padding-top: 0px">
                <q-item-label
                  caption
                  lines="2"
                  class="text-amber"
                  style="font-size: 12px; padding-top: 0px; font-weight: bold"
                >
                  Số lượng còn phải sản xuất:
                  <q-badge class="bg-amber" :label="po.conThucHien"
                /></q-item-label>
              </q-item-section>
            </div>
            <hr />
          </div>
          <q-input
            v-model.number="confirmQty"
            filled
            stack-label
            label-color="primary"
            type="number"
            style="font-style: oblique"
            label="Nhập số lượng ghi nhận"
          />
          <hr v-if="lengthR > 0" />
          <q-item
            dense
            style="
              padding-left: 0px;
              border: 1px solid grey;
              margin-bottom: 2px;
            "
            v-for="(item, index) in listRoughR"
            :key="index"
          >
            <q-item-section v-if="item.VERIFY_BY" style="">
              <q-item-label
                caption
                lines="2"
                class="text-red"
                style="font-size: 14px; font-weight: bold"
              >
                Phôi trả lại:
                <q-badge class="bg-red" :label="item.QUANTITY" />
              </q-item-label>
              <q-item-label
                caption
                lines="2"
                class="text-orange"
                style="font-size: 14px; font-weight: bold"
              >
                Lý do: <br />
                <q-badge class="bg-red" :label="item.status"
              /></q-item-label>
            </q-item-section>
            <q-item-section v-else>
              <q-item-label
                caption
                lines="2"
                class="text-orange"
                style="font-size: 12px; font-weight: bold"
              >
                Số lượng đã giao chờ xác nhận:
                <q-badge class="bg-orange" :label="item.QUANTITY"
              /></q-item-label>
              <q-item-label
                caption
                lines="2"
                class="text-white"
                style="font-size: 12px; font-weight: bold"
              >
                Thời gian giao:{{ item.ngay }} {{ item.gio }}:{{ item.phut }}:{{
                  item.giay
                }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>
                <q-btn
                  style="font-size: 10px"
                  dense
                  color="red"
                  label="Xóa"
                  @click="onshowshowConfirmDel(item.ID)"
              /></q-item-label>
            </q-item-section>
          </q-item>
          <hr />
          <div style="padding-left: 0px; padding-top: 0px">
            <q-item-section style="padding-top: 0px; background-color:#c8e6c9">
              <q-item-label
                caption
                lines="2"
                class="text-primary"
                style="font-size: 12px; padding-top: 0px; font-weight: bold"
              >
               Đã thực hiện:
                <q-badge class="bg-primary" :label="po.daThucHien"
              /></q-item-label>
            </q-item-section>
          </div>
          <hr />
          <q-item-label
            caption
            lines="4"
            class="text-primary"
            style="font-size: 11px; padding-top: 0px; font-weight: bold"
          >
            Công đoạn SX tiếp theo:
            <div>
              <q-badge class="bg-primary text-white" :label="po.stepNextName" />
            </div>
          </q-item-label>
          <hr />

          <div style="padding-left: 0px; padding-top: 0px">
            <q-item-section class="text-teal" style="padding-top: 0px">
              <q-item-label
                caption
                lines="2"
                class="text-red"
                style="font-size: 12px; padding-top: 0px; font-weight: bold"
              >
                Lỗi báo từ công đoạn:
                <q-badge class="bg-red" :label="po.loiCongDon"
              /></q-item-label>
            </q-item-section>
          </div>
          <div style="padding-left: 0px; padding-top: 0px">
            <q-item-section class="text-teal" style="padding-top: 0px">
              <q-item-label
                caption
                lines="2"
                class="text-red"
                style="font-size: 12px; padding-top: 0px; font-weight: bold"
              >
                Lỗi chuyển về:
                <q-badge class="bg-red" :label="po.loiChuyenVe"
              /></q-item-label>
            </q-item-section>
          </div>
          <div style="padding-left: 0px; padding-top: 0px">
            <q-item-section class="text-teal" style="padding-top: 0px">
              <q-item-label
                caption
                lines="2"
                class="text-red"
                style="font-size: 12px; padding-top: 0px; font-weight: bold"
              >
                Lỗi loại:
                <q-badge class="bg-red" :label="po.loiLoai"
              /></q-item-label>
            </q-item-section>
          </div>
          <q-input
            color="red"
            v-model.number="defectQty"
            :readonly="false"
            stack-label
            type="number"
            label-color="red"
            style="font-style: oblique"
            label="Khai báo số lượng lỗi"
          />
          <q-select
            class="col-12 q-pa-sm"
            filled
            v-model="factory"
            label-color="red"
            :options="options"
            label="chọn lỗi của NM khác"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click.stop="factory = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            color="primary"
            label="Ghi nhận"
            @click="secondDialog = true"
          />
          <q-btn label="Đóng" color="orange" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showDialogRough">
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            Danh sách phôi chờ nhận <br />
            {{ congdoan.name }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list separator>
            <q-item
              class="q-mt-sm bg-cyan-1 shadow-8 text-black"
              v-for="(item, index) in listRough"
              :key="index"
            >
              <q-item-section>
                <q-item-label>
                  <div>
                    LSX : <q-badge>{{ item.number }}</q-badge>
                  </div>
                  <div>
                    Tên : <b>{{ item.NAME }}</b>
                  </div>
                  <div>
                    Công đoạn giao : <b>{{ item.SOURCE_ID_NAME }}</b>
                  </div>
                  <div>
                    Quy cách :
                    <b>{{
                      item.LENGTH + "x" + item.WIDTH + "x" + item.HEIGHT
                    }}</b>
                  </div>
                  <div>
                    Số lượng : <b>{{ item.QUANTITY }}</b>
                  </div>
                  <div>
                    <q-badge color="green-4"
                      >Người tạo : {{ item.LAST_NAME }}
                    </q-badge>
                  </div>
                  <div style="color: purple; font-weight: bold">
                    Ngày tạo : <b>{{ item.ngay }}</b>
                  </div>
                  <div style="color: purple; font-weight: bold">
                    Thời gian tạo:
                    <b
                      >{{ item.giogiao }}:{{ item.phutgiao }}:{{
                        item.giaygiao
                      }}</b
                    >
                  </div>
                </q-item-label>
                <q-item-label>
                  <q-btn
                    v-show="nhanve[index]"
                    @click="confirm(item)"
                    class="bg-positive"
                    no-caps
                    label="Xác nhận"
                  />
                </q-item-label>
                <q-item-label>
                  <hr width="60%" align="center" />
                  <div>
                    <q-radio
                      @input="nhanvesl(index)"
                      v-model="selectionTT[index]"
                      val="Số lượng chưa chuẩn"
                      label="Số lượng chưa chuẩn"
                      color="red"
                      style="color: orange; font-weight: bold; font-size: 14px"
                    />
                  </div>
                  <div>
                    <q-radio
                      @input="nhanvesl(index)"
                      v-model="selectionTT[index]"
                      val="Chất lượng không đạt"
                      label="Chất lượng không đạt"
                      color="red"
                      style="color: orange; font-weight: bold; font-size: 14px"
                    />
                  </div>
                  <div>
                    <q-radio
                      @input="nhanvesl(index)"
                      v-model="selectionTT[index]"
                      val="Lý do khác"
                      label="Lý do khác"
                      color="red"
                      style="color: orange; font-weight: bold; font-size: 14px"
                    />
                  </div>
                  <div class="row">
                    <div class="col-6" align="center">
                      <q-btn
                        v-show="!nhanve[index]"
                        @click="capnhat(item, index)"
                        class="bg-orange text-white"
                        no-caps
                      >
                        Cập nhật <br />
                        trạng thái
                      </q-btn>
                    </div>
                    <div class="col-6" align="right">
                      <q-btn
                        style="font-size: 21px"
                        v-show="!nhanve[index]"
                        @click="huy(index)"
                        class="bg-positive text-white"
                        no-caps
                      >
                        Hủy
                      </q-btn>
                    </div>
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showConfirmDialogRough" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6">Bạn đã chắc chắn !</span>
        </q-card-section>
        <q-card-section>
          Nhận số :
          <strong>{{ soLuongNhan2 }}</strong> về
          <span style="color: green">{{ congdoan.name }}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng Ý"
            @click="receipt"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="activePackage"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Thông báo</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Bạn đã chắc chắn muốn xác nhận !
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Xác nhận" @click="activeSuccess" v-close-popup />
          <q-btn flat label="Thoát" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="secondDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Xác nhận</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p v-if="confirmQty">
            Ghi nhận sản lượng:
            <q-badge color="secondary">{{ confirmQty }}</q-badge>
          </p>
          <p v-if="description">
            Dấu tuần: <q-badge color="secondary">{{ description }}</q-badge>
          </p>
          <span v-if="defectQty" style="color: red">Lỗi : {{ defectQty }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="add"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <DialogSuccess
      :closeDialog2="closeDialog2"
      :palletCode="packageString"
      :show="showSuccess"
      :closeDialog="closeSuccessDialog"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { showNotifySuccess, showNotifyError } from "../../utils/utils";
import DialogSuccess from "../../components/prod/DiaLogCreatePalletSuccess";
import { fasCheck } from "@quasar/extras/fontawesome-v5";
export default {
  data() {
    return {
      selection: null,
      source_Id: null,
      maxCoTheGhiNhan: 0,
      selectionTT: [],
      nhanve: [],
      lengthR: 0,
      departments: [],
      tongton: 0,
      secondDialog: false,
      congdoan: null,
      showListPackage: false,
      description: "",
      searchQuery: "",
      ghinhan: 0,
      tongphoi: [],
      tongphoi1: 0,
      arr: "",
      card: false,
      task: null,
      standard: 0,
      showSuccess: false,
      packageId: "",
      confirmQty: null,
      confirmData: "", // số lượng cần sản xuất
      target: "",
      defectQty: "",
      receiptQty: "",
      historys: [],
      lenhsanxuat: "",
      hesodm: "",
      maxQtyConfirm: 0,
      packageString: "",
      iconfasCheckCircle: fasCheck,
      totalDeliver: 0,
      factory: null,
      nguonPhoi: null,
      structDialog: false,
      pagination: {
        rowsPerPage: 10,
        // rowsNumber: xx if getting data from a server
      },
      options: [],
      columns: [
        {
          name: "num",
          label: "Số lớp",
          field: (row) => row.num,
        },
        {
          name: "style",
          label: "Cách xếp",
          field: (row) => row.style,
        },
        {
          name: "height",
          label: "Độ dày",
          field: (row) => row.height,
        },
        {
          name: "codeWoodType",
          label: "Mã loại gỗ",
          field: (row) => row.codeWoodType,
        },
        {
          name: "woodType",
          label: "Loại gỗ",
          field: (row) => row.woodType,
        },
      ],
      nguonPhois: [
        { label: "Yên Sơn 1a", value: "Yên Sơn 1a" },
        { label: "Yên Sơn 1b", value: "Yên Sơn 1b" },
        { label: "Thái Bình", value: "Thái Bình" },
      ],
      po: {},
      POtemp: null,
      dialogErr: false,
      listPackage: null,
      activePackage: false,
      dataPackage: null,
      listRough: null,
      showListPackageRough: false,
      showDialogRough: false,
      showConfirmDialogRough: false,
      soLuongNhan2: null,
      itemSauDong: null,
    };
  },
  async created() {
    let factories1 = await this.getFactory();
    factories1.map((factory) => {
      factory.label = factory.name;
      factory.factoryId = factory.id;
    });
    this.options = factories1;
    this.departments = this.myDepartments.filter(
      (m) =>
        m.parentId == 102744 ||
        m.parentId == 102745 ||
        m.parentId == 102498 ||
        m.parentId == 102531 ||
        m.parentId == 102817 ||
        m.parentId == 102818
    );
    console.log("departments", this.departments);
    this.congdoan =
      this.departments.find((d) => d.id == this.$route.query.stepId) ||
      this.departments[0];
    console.log(this.congdoan);
    this.load(this.congdoan.id);
    this.loadListPackage();
  },
  methods: {
    ...mapActions("vcn", [
      "getAllKeHoachSanXuatConLaisVCN",
      "getCodeBylsx",
      "getPoByCodeVCN",
      "getSLCoTheNhan",
      "getSLChoNhan",
      "getListPackageVCN",
      "getActivePackageVCN",
      "getNextStepVCN",
      "getItemSauDong",
      "getSlCoTheXuat",
      "getFactory",
      "getStepChuyenDoiVCN",
      "getActivePackage_temp_update_VCN",
      "listPackageRough_temp_status_vcn",
      "listPackageRough_temp_vcn",
      "listPackageRough_temp_del_vcn",
      "addPackageVCN",
      "getHeSoQuyDoiBySP",
      "updateNhanPhoiLoiVCN",
    ]),
    goBack() {
      this.$router.go(-1);
    },
    async nhanvesl(i) {
      console.log("sl:", i);
      this.nhanve[i] = false;
    },
    async capnhat(data, i) {
      console.log("data", data);
      let payload1 = {
        id: data.ID,
        verifyBy: this.userInfo.id,
        status: this.selectionTT[i],
      };
      let data2 = await this.getActivePackage_temp_update_VCN(payload1);
      this.selectionTT[i] = null;
      // this.nhanve[i] = true
      await this.loadListPackage();
    },
    async huy(k) {
      //  console.log('sl:',this.nhanve[i])
      this.selectionTT[k] = null;
      //  this.nhanve[k] = true
      await this.loadListPackage();
    },
    async onshowshowConfirmDel(ID) {
      let payload = {
        id: ID,
      };
      let data = await this.listPackageRough_temp_del_vcn(payload);

      console.log("POtemp", this.POtemp);
      if (this.POtemp) {
        let payload = {
          po: this.POtemp,
        };
        this.listRoughR = await this.listPackageRough_temp_status_vcn(payload);
        showNotifySuccess();
      }
      await this.loadListPackage();
    },
    async layPackageIds(packageId, quantity) {
      this.packageId = packageId;
      this.soLuongNhan2 = quantity;
      console.log("layPackageIds");
      this.showConfirmDialogRough = true;
    },
    showConfirmDialogStrucre(po) {
      let data = JSON.parse(po.strucre);
      this.structDialog = true;
      this.data = data;
      console.log("đ", data);
    },
    async loadListPackage() {
      let i = 0;
      let payload = {
        factoryId: this.congdoan.factoryId,
        DESTINATION_ID: this.congdoan.id,
      };
      this.listPackage = await this.getListPackageVCN(payload);
      this.listRough = await this.listPackageRough_temp_vcn(payload);
      console.log("this.listRough", this.listRough);
      if (this.listPackage.length > 0) this.showListPackage = true;
      else this.showListPackage = false;
      if (this.listRough.length > 0) {
        this.showListPackageRough = true;
        for (i = 0; i < this.listRough.length; i++) this.nhanve[i] = true;
        this.selectionTT[i] = null;
      } else {
        this.showListPackageRough = false;
        this.showDialogRough = false;
      }
    },
    async receipt() {
      const payload = {
        packageId: this.packageId,
      };
      const data = await this.$store.dispatch(
        "vcn/POST_NHAN_LOT_NO_VCN",
        payload
      );
      if (data.meta.success) {
        this.loadListPackage();
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
    async onShowDialogRough() {
      this.showDialogRough = true;
      console.log("data", this.listPackage);
    },
    async confirmLoi(data) {
      const payload = {
        id: data.ID,
        accountId: this.userInfo.id,
      };
      const data1 = await this.updateNhanPhoiLoiVCN(payload);
      this.loadListPackage();
      this.load(this.congdoan.id);
    },
    async confirm(data) {
      console.log(data);

      this.dataPackage = data;
      this.slnew = this.dataPackage.QUANTITY;
      this.activePackage = true;
    },
    async activeSuccess() {
      this.showDialogRough = false;
      console.log("dataPackage", this.dataPackage);
      const payload = {
        sourceId: this.dataPackage.SOURCE_ID,
        destinationId: this.dataPackage.DESTINATION_ID,
        itemId: this.dataPackage.ITEM_ID,
        quantity: this.dataPackage.QUANTITY,
        heSo: this.dataPackage.HE_SO,
        typeId: 100026, //100026,//100004
        ID: this.dataPackage.ID,
        po: this.dataPackage.PO,
      };
      console.log("payload : ", payload);
      const data = await this.addPackageVCN(payload);

      if (data.meta.success) {
        showNotifySuccess();
        this.load(this.congdoan.id);
        this.loadListPackage();
      }

      await this.loadListPackage();
      this.dataPackage = null;
      if (this.listRough.length > 0) {
        this.showDialogRough = true;
      }
    },
    async showDialogErr() {
      console.log("listPackage");
      await this.loadListPackage();
      if (this.listPackage.length > 0) this.dialogErr = true;

      console.log("data", this.listPackage);
    },
    async closeDialog2() {
      this.showSuccess = false;
      this.card = false;
      this.defectQty = "";
      this.confirmQty = 0;
      this.description = "";
    },
    closeSuccessDialog() {
      this.showSuccess = false;
      this.confirmQty = 0;
      setTimeout(() => {
        this.$router.push("/tracking-lot-no?code=" + this.packageId);
      }, 1000);
    },
    async chonCongdoan(item) {
      this.congdoan = item;
      this.searchQuery = "";
      this.load(item.id);
      this.loadListPackage();
      // this.loadsanpham(item.id);

      this.$router.replace({
        path: this.$route.fullPath,
        query: {
          stepId: item.id,
        },
      });
    },
    async load(stepId) {
      await this.getAllKeHoachSanXuatConLaisVCN({ stepId: stepId });
    },
    async unique(arr) {
      let newArr = [];
      for (let i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    async showConfirmDialog(task) {
      this.$q.loading.show({
        message:
          'Hệ thống đang kiểm tra phôi có thể xuất.<br/><span class="text-primary">Xin vui lòng chờ...</span>',
      });
      const { order, root: number } = task;
      console.log("po", this.po);
      console.log(order, number);
      console.log("stak", task);
      const step = await this.getNextStepVCN({
        order: order + 1,
        number,
        itemId: task.itemId,
      });
      this.POtemp = task.poCode;
      let payload1 = {
        po: task.poCode,
      };
      this.listRoughR = await this.listPackageRough_temp_status_vcn(payload1);
      task.stepNextName = step ? step.Department.name : "";
      task.stepNextId = step ? step.Department.id : "";
      this.po = task;
      console.log("po", this.po);
      this.card = true;
      this.$q.loading.hide();
      if (order == 1) {
        let quantityChoNhan = await this.getSLChoNhan({ code: task.poCode });
        console.log("quantityChoNhan", quantityChoNhan);
        console.log("this.po.conThucHien", this.po.conThucHien);
        this.maxCoTheGhiNhan =
          this.po.conThucHien -
          (this.po.loiCongDon ? this.po.loiCongDon : 0) +
          (this.po.loiChuyenVe ? this.po.loiChuyenVe : 0) -
          (quantityChoNhan[0].quantity ? quantityChoNhan[0].quantity : 0);
      } else {
        console.log("this.po", this.po);
        const payload3 = {
          spTruocRong: this.po.previousItem ? this.po.previousItem : 0,
          spSauRong: this.po.itemId,
        };
        const heSo = await this.getHeSoQuyDoiBySP(payload3);
        const payload2 = {
          number: number,
          code: task.poCode,
          stepId: parseInt(task.stepId),
          heSo: heSo.length > 0 ? heSo[0].HE_SO : 1,
        };
        const data = await this.getSLCoTheNhan(payload2);
        let quantity = data[0].quantity;
        if (quantity > 0) {
          this.maxCoTheGhiNhan = quantity;
        } else {
          this.maxCoTheGhiNhan = 0;
        }
      }

      return;
    },
    async add() {
      if (this.confirmQty > 0 || this.defectQty > 0) {
        if (this.confirmQty + this.defectQty > this.maxCoTheGhiNhan) {
          this.$q.dialog({
            title: "Lỗi",
            message: "Nhập quá phôi có thể xuất!",
          });
        } else {
          // if (this.nguonPhoi) {
          if (parseFloat(this.confirmQty) >= 0) {
            this.xuaton = this.confirmQty;
          }
          if (
            this.confirmQty > this.po.conThucHien ||
            (this.confirmQty <= 0 && this.defectQty <= 0)
          ) {
            this.$q.dialog({
              title: "Lỗi",
              message: "Nhập quá kế hoạch!",
            });
          } else {
            const payload = {
              SOURCE_ID: this.po.stepId,
              DESTINATION_ID: this.po.stepNextId ? this.po.stepNextId : 0,
              itemId: this.po.itemId,
              TYPE_ID: 100026,
              CREATE_BY: this.userInfo.id,
              quantity: this.xuaton,
              daThucHien:
                parseFloat(this.xuaton) + parseFloat(this.po.daThucHien),
              PO: this.po.poCode,
              order: this.po.order,
              factoryId: this.congdoan.parentId,
              number: this.po.root,
            };
            if (this.factory) {
              payload.nguonPhoi = this.factory.factoryId;
            } else {
              payload.nguonPhoi = this.po.stepId;
            }
            if (this.defectQty > 0) {
              payload.loiCongDon = this.po.loiCongDon;
              payload.defectQty = this.defectQty ? this.defectQty : 0;
              const data2 = await this.$store.dispatch(
                "vcn/createPackageLoiVCN",
                payload
              );
              if (data2) {
                this.card = false;
                this.itemSauRong = null;
                this.defectQty = 0;
              } else {
                this.$q.notify({
                  message: "Có lỗi xảy ra !",
                  color: "red",
                });
              }
            }
            if (this.confirmQty > 0) {
              payload.heSo = this.po.heSo;
              const data2 = await this.$store.dispatch(
                "vcn/createPackageTempVCN",
                payload
              );
              if (data2.meta.success) {
                showNotifySuccess();
                this.card = false;
                this.itemSauRong = null;
                this.xuaton = this.confirmQty = 0;
                this.defectQty = 0;
              } else {
                this.$q.notify({
                  message: "Có lỗi xảy ra !",
                  color: "red",
                });
              }
            }
          }
          showNotifySuccess();
          this.card = false;
          this.itemSauRong = null;
          this.xuaton = this.confirmQty = 0;
          this.defectQty = 0;
          this.xuaton = this.confirmQty = 0;
          this.load(this.congdoan.id);
          return;
        }
      } else {
        this.$q.dialog({
          html: true,
          message: `<span class="text-orange">Bạn chưa nhập số lượng lỗi hoặc số lượng ghi nhận!</span>`,
        });
      }
    },
  },
  components: {
    DialogSuccess,
    "no-tasks": require("components/Tasks/NoTasks.vue").default,
    // "old-tasks": require("components/Tasks/OldTasks.vue").default
  },
  computed: {
    ...mapGetters("base", ["myDepartments", "userInfo"]),
    ...mapGetters("vcn", ["pos"]),
  },
  watch: {
    defectQty(newValue) {
      if (newValue && !Number.isInteger(newValue)) {
        this.$q.dialog({
          title: "Lỗi",
          message: "Bạn cần nhập số nguyên!",
        });
      }
    },
    confirmQty(newValue) {
      if (newValue && !Number.isInteger(newValue)) {
        this.$q.dialog({
          title: "Lỗi",
          message: "Bạn cần nhập số nguyên!",
        });
      }
    },
  },
};
</script>
