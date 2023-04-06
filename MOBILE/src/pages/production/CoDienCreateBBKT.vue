<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-12">
        <p class="text-bold text-blue text-center">BIÊN BẢN KIỂM TRA LÒ SẤY</p>
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-12 col-sm-6">
        <q-separator></q-separator>
        <br />
      </div>
    </div>
    <div class="row justify-center">
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3 q-ma-xs"
        v-for="(item, index) in data"
        v-bind:key="item.id"
      >
      <p class="text-bold text-orange" v-if="item.id == 1">{{ item.group }}</p>
      <p class="text-bold text-orange" v-if="item.id == 3 && totalCheck >= 2">{{ item.group }}</p>
        <q-card v-if="item.id == 1 || item.id == 2 || totalCheck >= 2">
          <q-card-section>
            <strong style="font-family: 'Time New Roman'">
              {{ index + 1 }} .{{ item.checkName }}</strong
            >
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <div class="row">
              <div class="col-8">
                <p class="prodTextNormal">
                  {{ item.require }}
                </p>
                <p v-if="item.tinhTrang">
                  Tình trạng: <br />
                <span v-html="item.tinhTrang"></span>
                </p>
              </div>
              <div class="col-4">
                <q-checkbox
                  @input="changeStatus"
                  v-model="item.status"
                  label="ĐẠT"
                />
                <q-btn
                  v-if="
                    item.id == 7 ||
                    item.id == 8 ||
                    item.id == 11 ||
                    item.id == 12
                  "
                  color="primary"
                  label="Tình trạng"
                  @click="showTinhTrang(item)"
                />
              </div>
            </div>
            <div class="row"></div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row justify-center q-mt-sm">
      <div class="col-12 col-sm-6">
        <p style="font-family: 'Time New Roman'; font-style: italic">
          Ghi chú : Lò sấy chỉ được phép hoạt động khi đáp ứng tất cả các yêu
          cầu trên đây.
        </p>
        <q-separator></q-separator>
        <div class="prodTextTitle q-mt-sm">
          <strong>Kết luận : </strong>
          <strong v-if="resultCode === 'NG'" style="color: red">{{
            resultMessage
          }}</strong>
          <strong v-else style="color: green">{{ resultMessage }}</strong>
        </div>
      </div>
      <div class="col-12 text-center">
          <q-btn
          v-if="resultCode == 'OK'"
          color="primary"
          @click="pushBB"
          glossy
          label="Hoàn thành"
        />
      </div>
    </div>
    <q-dialog v-model="isEMC">
      <q-card>
        <q-card-section class="row items-center">
          <div class="top-title">
            <q-input
              v-model="numberEMC"
              filled
              label="Số lần :"
              style="max-width: 200px"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="setNumberEMC"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isCamBienNhietDo">
      <q-card>
        <q-card-section class="row items-center">
          <div class="top-title">
            <q-input
              v-model.number="camBienLo"
              type="number"
              filled
              label="Cảm biến lò :"
              style="max-width: 200px"
            />
            <q-input
              v-model.number="doThucTe"
              type="number"
              filled
              label="Đo thực tế :"
              style="max-width: 200px"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="setCamBienNhietDo"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isChieuDaiThucTe">
      <q-card>
        <q-card-section class="row items-center">
          <div class="top-title">
            <q-input v-model="template1" label="Mẫu 1:" />
            <q-input v-model="template2" label="Mẫu 2:" />
            <q-input v-model="template3" label="Mẫu 3:" />
            <q-input v-model="template4" label="Mẫu 4:" />
            <q-input v-model="template5" label="Mẫu 5:" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="setChieuDaiThucTe"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isDongCoQuatGio">
      <q-card>
        <q-card-section class="row items-center">
          <div class="top-title">
            <q-input v-model="quat1" label="Quạt 1:" />
            <q-input v-model="quat2" label="Quạt 2:" />
            <q-input v-model="quat3" label="Quạt 3:" />
            <q-input v-model="quat4" label="Quạt 4:" />
            <q-input v-model="quat5" label="Quạt 5:" />
            <q-input v-model="quat6" label="Quạt 6:" />
            <q-input v-model="quat7" label="Quạt 7:" />
            <q-input v-model="quat8" label="Quạt 8:" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="setDongCoQuatGio"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { QSpinnerFacebook } from "quasar";
import { bienban } from "../../configs/constants";
export default {
  data() {
    return {
      totalCheck: 0,
      data: [
        {
          checkName: "Vệ sinh lò sấy",
          require: "Sạch sẽ, không có các vật thể lạ trong lò",
          status: false,
          group: "I. KIỂM TRA VỆ SINH",
          tinhTrang: null,
          id: 1,
        },
        {
          checkName: "Không bị rò rỉ nước",
          require: "Giàn nhiệt kín không bị rò rỉ nước",
          status: false,
          group: "I. KIỂM TRA VỆ SINH",
          tinhTrang: null,
          id: 2,
        },
        {
          checkName: "Hệ thống gia nhiệt",
          require:
            "Van nhiệt đóng mở đúng theo tín hiệu điện Giàn nhiệt không bị rò rỉ nhiệt ra ngoài",
          status: false,
          group: "II. KIỂM TRA KỸ THUẬT",
          tinhTrang: null,
          id: 3,
        },
        {
          checkName: "Hệ thống điều tiết ẩm",
          require: "Ống phun ầm phải ở dạng sương, không được phun thành tia",
          status: false,
          group: "II. KIỂM TRA KỸ THUẬT",
          tinhTrang: null,
          id: 4,
        },
        {
          checkName: "Đầu đo đo độ ẩm gỗ",
          require: "Các đầu đo không bị đứt, còn đầu gài vào thanh gỗ mẫu",
          status: false,
          group: "II. KIỂM TRA KỸ THUẬT",
          tinhTrang: null,
          id: 5,
        },
        {
          checkName: "Cửa thoát ẩm",
          require: "Hoạt động đóng mở bằng tay/tự động dễ dàng, không bị kẹt",
          status: false,
          group: "II. KIỂM TRA KỸ THUẬT",
          tinhTrang: null,
          id: 6,
        },
        {
          checkName: "Giấy cảm biến đo EMC",
          require: "Tối đa 3 lượt sấy phải thay giấy mới",
          status: false,
          group: "II. KIỂM TRA KỸ THUẬT",
          tinhTrang: null,
          id: 7,
        },
        {
          checkName: "Cảm biến nhiệt độ trong lò sấy",
          require:
            "Không sai khác so với nhiệt độ trong lò quá 2⁰C (Dùng súng bắn nhiệt đo nhiệt độ thực tế trong lò)",
          status: false,
          group: "II. KIỂM TRA KỸ THUẬT",
          tinhTrang: null,
          id: 8,
        },
        {
          checkName: "Van hơi, Van nước hồi ",
          require: "Kín, không bị rò rỉ",
          status: false,
          group: "II. KIỂM TRA KỸ THUẬT",
          tinhTrang: null,
          id: 9,
        },
        {
          checkName: "Đinh, dây đo độ ẩm",
          require: "Hoạt động tốt",
          status: false,
          group: "II. KIỂM TRA KỸ THUẬT",
          tinhTrang: null,
          id: 10,
        },
        {
          checkName: "Chiều dày thực tế",
          require:
            "Kiểm tra 5 palet ngẫu nhiên,mỗi palet 5 thanh ngẫu nhiên trong lò,dung sai cho phép + 2(mm)",
          status: false,
          group: "II. KIỂM TRA KỸ THUẬT",
          tinhTrang: null,
          id: 11,
        },
        {
          checkName: "Động cơ quạt gió Tốc độ gió quạt",
          require:
            "Tốc độ gió quạt đạt tối thiểu 1m/s Các quạt quay cùng chiều và ngược chiều phải đồng đều ",
          status: false,
          group: "II. KIỂM TRA KỸ THUẬT",
          tinhTrang: null,
          id: 12,
        },
      ],
      resultMessage: "Mẻ sấy chưa đạt tiêu chuẩn để hoạt động",
      resultCode: "NG",
      kilnBatchId: null,
      isEMC: false,
      isCamBienNhietDo: false,
      isChieuDaiThucTe: false,
      isDongCoQuatGio: false,
      numberEMC: 0,
      itemSelect: null,
      camBienLo: 0,
      doThucTe: 0,
      template1: null,
      template2: null,
      template3: null,
      template4: null,
      template5: null,
      quat1: null,
      quat2: null,
      quat3: null,
      quat4: null,
      quat5: null,
      quat6: null,
      quat7: null,
      quat8: null,
    };
  },
  created() {
    this.kilnBatchId = this.$route.params.kinlbatchid;
    let dataLocal = localStorage.getItem('bbktls'+this.kilnBatchId)
    if (dataLocal) {
        let jsonDataLocal = JSON.parse(dataLocal)
        this.data = jsonDataLocal.data
        this.totalCheck = jsonDataLocal.totalCheck
        this.resultMessage=jsonDataLocal.resultMessage
        this.resultCode = jsonDataLocal.resultCode
    }
  },
  methods: {
    showTinhTrang(value) {
      this.itemSelect = value;
      if (value.checkName == "Giấy cảm biến đo EMC") {
        this.isEMC = true;
      }
      if (value.checkName == "Cảm biến nhiệt độ trong lò sấy") {
        this.isCamBienNhietDo = true;
      }
      if (value.checkName == "Chiều dày thực tế") {
        this.isChieuDaiThucTe = true;
      }
      if (value.checkName == "Động cơ quạt gió Tốc độ gió quạt") {
        this.isDongCoQuatGio = true;
      }
    },
    setNumberEMC() {
      const index = this.data.findIndex((d) => d.id == this.itemSelect.id);
      let soLan = "Số lần: " + this.numberEMC;
      this.data[index].tinhTrang = soLan;
      if (this.numberEMC <= 3) {
        this.data[index].status = true;
        this.totalCheck++;
      }else{
          if(this.data[index].status == true){
          this.totalCheck--;
          }
          this.data[index].status = false;
      }
    },
    setCamBienNhietDo() {
      const index = this.data.findIndex((d) => d.id == this.itemSelect.id);
      let camBienLo = "Cảm biến lò: " + this.camBienLo;
      let doThucTe = "Đo thực tế: " + this.doThucTe;
      this.data[index].tinhTrang = camBienLo + "<br> " + doThucTe;
      if (Math.abs(this.camBienLo - this.doThucTe) <= 2) {
        this.data[index].status = true;
        this.totalCheck++;
      }else{
          if(this.data[index].status == true){
          this.totalCheck--;
          }
          this.data[index].status = false;
          
      }
    },
    setChieuDaiThucTe() {
      const index = this.data.findIndex((d) => d.id == this.itemSelect.id);
      let template1 = "Mẫu 1: " + this.template1;
      let template2 = "Mẫu 2: " + this.template2;
      let template3 = "Mẫu 3: " + this.template3;
      let template4 = "Mẫu 4: " + this.template4;
      let template5 = "Mẫu 5: " + this.template5;
      this.data[index].tinhTrang =
        template1 +
        "<br> " +
        template2 +
        "<br> " +
        template3 +
        "<br> " +
        template4 +
        "<br> " +
        template5;
      this.data[index].status = true;
      this.totalCheck++;
    },
    setDongCoQuatGio() {
      const index = this.data.findIndex((d) => d.id == this.itemSelect.id);
      let quat1 = "Quạt 1: " + this.quat1 + " (m/s)<br>";
      let quat2 = "Quạt 2: " + this.quat2 + " (m/s)<br>";
      let quat3 = "Quạt 3: " + this.quat3 + " (m/s)<br>";
      let quat4 = "Quạt 4: " + this.quat4 + " (m/s)<br>";
      let quat5 = "Quạt 5: " + this.quat5 + " (m/s)<br>";
      let quat6 = "Quạt 6: " + this.quat6 + " (m/s)<br>";
      let quat7 = "Quạt 7: " + this.quat7 + " (m/s)<br>";
      let quat8 = "Quạt 8: " + this.quat8 + " (m/s)<br>";
      this.data[index].tinhTrang =
        quat1 +
        " " +
        quat2 +
        " " +
        quat3 +
        " " +
        quat4 +
        " " +
        quat5 +
        " " +
        quat6 +
        " " +
        quat7 +
        " " +
        quat8;
      if (
        this.quat1 >= 1 &&
        this.quat2 >= 1 &&
        this.quat3 >= 1 &&
        this.quat4 >= 1 &&
        this.quat5 >= 1 &&
        this.quat6 >= 1 &&
        this.quat7 >= 1 &&
        this.quat8 >= 1
      ) {
        this.data[index].status = true;
        this.totalCheck++;
      }else{
          if(this.data[index].status == true){
          this.totalCheck--;
          }
          this.data[index].status = false;
      }
    },
    async pushBB() {
      let payload = {
        type: bienban.BB_KIEM_TRA_LO_SAY,
        data: this.data,
        linkId: this.kilnBatchId,
        linkType: "kilnBatch",
        resultCode: this.resultCode,
        resultMessage: this.resultMessage,
        totalCheck: this.totalCheck,
      };
      if (navigator.onLine) {
        this.$q.loading.show({
          QSpinnerFacebook,
        });
        let data = await this.$store.dispatch(
          "production/ACTION_CREATE_BB_MC",
          payload
        );

        if (data.meta.success === true) {
          this.$q.notify({
            message: "Tạo biên bản thành công !",
            color: "green",
          });
          if (this.totalCheck >= 13) {
            let factoryId = this.$store.getters["base/myFactoryInfor"].id;
            const topic = factoryId + "-LOSAY";
            const titleMessage = "Đã có biên bản kiểm tra lò sấy";
            const bodyMessgae = this.resultMessage;
            const path = "/";
            this.$sendFcm(titleMessage, bodyMessgae, path, topic, {})
              .then((res) => {
                console.log("send fcm success", res);
              })
              .catch((err) => {
                console.log("send Error: " + err);
              });
          }
          this.$q.loading.hide();
          localStorage.setItem("bbktls" + this.kilnBatchId, "");
          this.$router.go(-1);
        } else {
          this.$q.notify({
            message: data.meta.messages.message,
            color: "red",
          });
        }
      } else {
        this.$q.notify({
          message: "Không có kết nối internet",
          color: "red",
        });
      }
    },
    changeStatus(val) {
      if (val) {
        this.totalCheck++;
      } else {
        this.totalCheck--;
      }
      this.saveDataToLocal();
    },
    saveDataToLocal() {
      let dataSave = {
        totalCheck: this.totalCheck,
        resultCode: this.resultCode,
        resultMessage: this.resultMessage,
        kinlbatchid: this.kilnBatchId,
        data: this.data,
      };
      localStorage.setItem(
        "bbktls" + this.kilnBatchId,
        JSON.stringify(dataSave)
      );
    },
  },
  watch: {
    totalCheck(val) {
      if (val >= 12) {
        this.$q.notify({
          message: "Mẻ sấy đã đạt tiêu chuẩn , hay nhấn hoàn thành ",
          color: "green",
          position: "center",
        });
        this.resultCode = "OK";
        this.resultMessage = "Mẻ sấy đã đạt tiêu chuẩn để hoạt động";
      } else {
        this.resultCode = "NG";
        this.resultMessage = "Mẻ sấy chưa đạt tiêu chuẩn để hoạt động";
      }
    },
  },
};
</script>

<style>
</style>