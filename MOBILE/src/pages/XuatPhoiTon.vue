<template>
  <q-page padding>
    <list-header bgcolor="bg-green-4">Cấp phôi</list-header>
    <q-select
      filled
      v-model="model"
      use-input
      input-debounce="0"
      label="Chọn lệnh sản xuất"
      :options="options"
      @filter="filterFn"
      behavior="menu"
      dense
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-select
      filled
      v-if="model"
      v-model="step"
      label="Chọn công đoạn"
      :options="congDoans"
      emit-value
      map-options
      behavior="menu"
      dense
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input
      v-if="step"
      color="teal"
      filled
      v-model="text"
      label="Tên chi tiết"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <q-checkbox
      v-model="chonNguonPhoi"
      val="Tại tổ"
      label="Tại tổ"
      color="teal"
    />
    <q-checkbox
      v-model="chonNguonPhoi"
      val="Yên Sơn 1"
      label="Yên Sơn 1"
      color="orange"
    />
    <q-checkbox
      v-model="chonNguonPhoi"
      val="Thái Bình"
      label="Thái Bình"
      color="cyan"
    />

    <div class="row justify-center q-mt-md">
      <div
        v-for="(item, index) in getTonDauKysByDepartmentId(step, text)"
        v-bind:key="index"
      >
        <div
          v-if="
            chonNguonPhoi.includes(item.nguonPhoi) &&
              getPoByItemId(item.ITEM_ID).length
          "
          class="col-12 col-md-5 q-pa-sm q-ma-sm"
        >
          <q-card class="my-card">
            <q-card-section>
              <div class="san-luong-title text-primary">
                {{ item.ITEM_NAME }}
              </div>
              <div class="text-subtitle2">
                Nguồn phôi -
                <span style="color:green">{{ item.nguonPhoi }}</span>
              </div>
            </q-card-section>
            <q-card-section>
              <span class="san-luong text-primary"
                >Tổng số lượng tồn: {{ item.STOC_QTY - item.daXuat }}</span
              >
              <br />
              <span class="san-luong text-primary"
                >Đã xuất : {{ item.daXuat }}</span
              >
              <br />
              <span class="san-luong text-primary"
                >Nhập bởi :
                {{ getAccountById(item.CREATE_BY) | FullName }}</span
              >
              <br />
              <span class="san-luong text-primary"
                >Ngày nhập : {{ item.createdAt | ngay }}</span
              >
              <br />
            </q-card-section>
            <q-card-actions vertical align="right">
              <q-btn
                @click="showManHinhXuatPhoi(item)"
                icon-right="keyboard_arrow_right"
                flat
                color="primary"
                label="Cấp phôi"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
    <q-dialog v-model="card">
      <q-card v-if="chonPhoiTon" class="my-card">
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              Cấp phôi
            </div>
          </div>
        </q-card-section>
        <q-card-section v-if="task" class="q-pt-none">
          <div class="text-subtitle1">
            [{{ task.Item.code }}] - {{ task.Item.name }} ({{
              task.itemHeight
            }}*{{ task.Item.width }}*{{ task.Item.length }})
          </div>
          <q-badge color="secondary">
            Số lượng cấp: {{ standard }} (0 đến {{ getMaxCapPhoi }})
          </q-badge>

          <q-input outlined v-model="standard" label="Số lượng cấp" />
          <q-slider v-model="standard" :min="0" :max="getMaxCapPhoi" />
        </q-card-section>
        <q-card-section>
          <div class="text-caption text-grey">
            Khối lượng theo kế hoạch:
            <q-badge color="secondary">
              {{ getMaxKeHoach }}
            </q-badge>
          </div>
          <div class="text-caption text-grey">
            Tổng khối lượng có thể cấp:
            <q-badge color="secondary">
              {{ getMaxCapPhoi }}
            </q-badge>
          </div>
          <q-list v-if="chonPhoiTon">
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>{{ chonPhoiTon.nguonPhoi }}</q-item-label>
                <q-item-label caption
                  >Còn tồn:
                  {{ chonPhoiTon.STOC_QTY - chonPhoiTon.daXuat }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="Hủy" />
          <q-btn
            v-close-popup
            color="primary"
            @click="xacNhapTruKeHoach"
            label="Đồng ý"
            :disable="!standard"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ListHeader from "components/Shared/ListHeader.vue";
export default {
  // name: 'PageName',
  data() {
    return {
      model: null,
      options: [],
      steps: [],
      step: null,
      chonNguonPhoi: ["Tại tổ", "Yên Sơn 1", "Thái Bình"],
      text: "",
      card: false,
      chonPhoiTon: null,
      standard: 0,
      task: null
    };
  },
  components: {
    ListHeader
  },
  computed: {
    ...mapGetters("production", ["getTonDauKysByDepartmentId"]),
    ...mapGetters("base", ["congDoans", "userInfo"]),
    ...mapGetters("po", [
      "numbers",
      "getStepsByNumber",
      "pos",
      "getPoByItemId"
    ]),
    ...mapGetters("orders", ["getAccountById"]),
    getMaxCapPhoi() {
      return this.chonPhoiTon.STOC_QTY - this.chonPhoiTon.daXuat;
    },
    getMaxKeHoach() {
      console.log(
        this.task.keHoach,
        this.task.hanMucTon,
        this.task.loiCongDon,
        this.task.VItemInPackages.reduce((n, c) => {
          return c.quantity + n;
        }, 0)
      );
      return (
        this.task.keHoach +
        this.task.hanMucTon +
        this.task.loiCongDon -
        this.task.VItemInPackages.reduce((n, c) => {
          return c.quantity + n;
        }, 0)
      );
      // return this.task.soLuongUuTien +
      //   this.task.ys1a +
      //   this.task.ys1b +
      //   this.task.ys4 +
      //   this.task.th -
      //   this.task.ton
      //   ? this.task.soLuongUuTien +
      //       this.task.ys1a +
      //       this.task.ys1b +
      //       this.task.ys4 +
      //       this.task.th -
      //       this.task.ton
      //   : this.task.loiCongDon;
    }
  },
  methods: {
    ...mapActions("production", ["getAllTonDauKys"]),
    ...mapActions("po", [
      "getAllLsx",
      "getPosByNumberAndStep",
      "getAllNguonPhoi",
      "resetPos",
      "themTonKeHoach2"
    ]),
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.options = this.numbers;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.options = this.numbers.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async showManHinhXuatPhoi(phoiTon) {
      this.task = this.getPoByItemId(phoiTon.ITEM_ID)[0];
      this.chonPhoiTon = phoiTon;
      this.standard =
        this.getMaxKeHoach < this.chonPhoiTon.STOC_QTY - this.chonPhoiTon.daXuat
          ? this.getMaxKeHoach
          : this.chonPhoiTon.STOC_QTY - this.chonPhoiTon.daXuat;
      this.card = true;
    },
    async xacNhapTruKeHoach() {
      if (this.standard > this.chonPhoiTon.STOC_QTY - this.chonPhoiTon.daXuat) {
        this.$q.dialog({
          title: "Lỗi",
          message: "Không thể cấp vượt quá số lượng phôi tồn!"
        });
        return;
      }

      if (this.standard > this.getMaxKeHoach) {
        this.$q.dialog({
          title: "Lỗi",
          message: "Cấp phôi vượt quá còn phải sản xuất!"
        });

        return;
      }
      if (!this.standard) return;
      await this.themTonKeHoach2({
        code: this.task.code,
        quantity: this.standard,
        createdBy: this.userInfo.id,
        openingStockId: this.chonPhoiTon.ID
      });
      await this.loadData();
      this.$q.notify({
        message: "Cấp phôi thành công.",
        color: "primary"
      });
    },
    async loadData() {
      await this.getPosByNumberAndStep({
        stepId: this.step,
        number: this.model
      });
      await this.getAllLsx();
      await this.getAllTonDauKys();
    },
    sanLuong(packages) {
      return packages.reduce((n, c) => {
        return c.quantity + n;
      }, 0);
    }
  },
  created() {
    this.loadData();
  },
  mounted() {
    this.options = this.numbers;
  },
  watch: {
    model() {
      this.step = null;
    },
    step(newValue) {
      console.log(newValue);
      if (newValue)
        this.getPosByNumberAndStep({ stepId: newValue, number: this.model });
    },
    standard(newValue) {
      if (newValue > this.chonPhoiTon.STOC_QTY - this.chonPhoiTon.daXuat) {
        this.$q.dialog({
          title: "Lỗi",
          message: "Không thể cấp vượt quá số lượng phôi tồn!"
        });
      }
      // if (newValue > this.getMaxKeHoach) {
      //   this.$q.dialog({
      //     title: "Lỗi",
      //     message: "Cấp phôi vượt quá kế hoạch!"
      //   });
      // }
    }
  }
};
</script>
