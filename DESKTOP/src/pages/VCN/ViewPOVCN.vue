<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card" v-if="PO && PO[0].type == 'LVL'">
      <q-card-section>
        <div>
          <table class="table-custom" border="1" width="100%">
            <thead class="w-100">
              <tr>
                <td class="text-center" width="120" rowspan="2">
                  WOODSLAND TUYÊN QUANG - NM YÊN SƠN 3
                </td>
                <td class="text-center">QUY TRÌNH KHỞI ĐỘNG SẢN PHẨM</td>
                <td
                  width="150px"
                  style="word-break: break-word"
                  rowspan="2"
                  class="text-center text-weight-bolder"
                >
                  {{ PO[0].number }}
                </td>
              </tr>
              <tr>
                <th>
                  <strong>
                    LỆNH SẢN XUẤT <br />
                    KIÊM PHIẾU XUẤT KHO NGUYÊN LIỆU - VẬT TƯ
                  </strong>
                </th>
              </tr>
                    <tr>
        <th colspan="2" style="text-align:left;" ></th>
                <td colspan="1" style="text-align:left;" >
                  Ngày viết: {{ moment(PO[0].createdAt, "YYYY-MM-DD").format("L") }} 
                 
                </td>
              </tr>
            </thead>
          </table>
          <b>I - Thông tin chung</b>
          <table class="table-custom text-center" border="1" width="100%">
            <thead>
              <!-- <tr>
                <td colspan="2" rowspan="2">Sản phẩm</td>
                <th colspan="6" rowspan="2">
                  <span>KT trước rong:</span>
                  {{ PO[0].ItemVCN.name }} : {{ PO[0].ItemVCN.length }} x
                  {{ PO[0].ItemVCN.width }} x {{ PO[0].ItemVCN.height }} (
                  {{ PO[0].quantity }} Tấm )
                  <div v-for="(item, index) in itemSauRong" :key="index">
                    <span>KT sau rong:</span>
                    {{ item.ItemVCN.name }} : {{ item.ItemVCN.length }} x
                    {{ item.ItemVCN.width }} x {{ item.ItemVCN.height }} (
                    {{ item.quantity }} Thanh )
                    <br />
                  </div>
                </th>
              </tr>
              <tr>
                <th colspan="2">Ngày viết LSX:</th>
                <th colspan="5">
                  {{ moment(PO[0].createdAt, "YYYY-MM-DD").format("L") }}
                </th>
              </tr> -->
              <tr>
                <th rowspan="2">Ván thành phẩm</th>
                <th rowspan="2">Dung sai</th>
                <th colspan="5">Kết cấu ván lõi</th>
                <th rowspan="2">Tổng độ dày (mm)</th>
                <th colspan="2">Quy trình SX</th>
                <th colspan="4">SL SX</th>
                <th rowspan="2">Ngày hoàn thành</th>
              </tr>
              <tr>
                <td >Số lớp</td>
                <td>Cách xếp</td>
                <td>Độ dày (mm)</td>
                <td colspan="2">Loại gỗ</td>
                <td colspan="2">Công đoạn</td>
                <td>Tấm</td>
                <td>m3</td>
                <td>Thanh</td>
                <td>m3</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td :rowspan="strucres.length + 1">{{ PO[0].size }} mm</td>
                <th :rowspan="strucres.length + 1">
                  +{{ PO[0].plus }}mm/ -{{ PO[0].sub }}mm
                </th>
                <td></td>
                <td></td>
                <td></td>
                <td colspan="2"></td>
                <th></th>
                <td
                  :rowspan="strucres.length + 1"
                  colspan="2"
                  class="text-left"
                  style="padding-left: 5px"
                >
                  <span
                    class="text-primary"
                    style="padding: 5px 0; font-weight: bold; font-size: 16px"
                    >Sản phẩm trước rong</span
                  >
                  <div style="padding-bottom: 50px">
                    <div v-for="(step, index) in PO" v-bind:key="index">
                      <div v-if="step.ItemVCN.id == PO[0].ItemVCN.id">
                        <b>{{ step.order }}</b
                        >.
                        <span class="text-bold">{{
                          step.Department.name
                        }}</span>
                        <br />
                        {{ step.ItemVCN.name }} {{ step.ItemVCN.length }} x
                        {{ step.ItemVCN.width }} x {{ step.ItemVCN.height }}
                      </div>
                    </div>
                  </div>
                  <span
                    class="text-primary"
                    style="padding: 5px 0; font-weight: bold; font-size: 16px"
                    >Sản phẩm sau rong</span
                  >
                  <div v-for="(step, index) in stepSauRong" :key="index">
                    <b>{{ step.order }} {{ step.Department.name }}</b>
                    <div v-for="(item, index) in PO" v-bind:key="index">
                      <div
                        v-if="
                          item.ItemVCN.id != PO[0].ItemVCN.id &&
                          step.Department.id == item.Department.id
                        "
                      >
                        -
                        {{ item.ItemVCN.name }} {{ item.ItemVCN.length }} x
                        {{ item.ItemVCN.width }} x {{ item.ItemVCN.height }}
                      </div>
                    </div>
                  </div>
                </td>
                <th :rowspan="strucres.length + 1">
                  {{ PO[0].quantity.toLocaleString("en-US") }}
                </th>
                <td :rowspan="strucres.length + 1">
                  {{ (PO[0].quantity * PO[0].ItemVCN.volumn).toLocaleString(
                      "en-US"
                    ) }}
                </td>
                <th :rowspan="strucres.length + 1">
                   {{ sumQuantitySauRong }}
                </th>
                <td :rowspan="strucres.length + 1">
                  {{ sumVolumnSauDong.toLocaleString() }}
                </td>
                <td :rowspan="strucres.length + 1">
                  {{ moment(PO[0].ngayDongGoi, "YYYY-MM-DD").format("L") }}
                </td>
              </tr>
              <tr v-for="struc in strucres" v-bind:key="struc.__KEY__">
                <td >{{ struc.num }}</td>
                <td>{{ struc.style }}</td>
                <td>{{ struc.height }}</td>
                <td colspan="2">{{ struc.woodType }}</td>
                <th>{{ struc.height }}</th>
              </tr>
              <tr>
                <th colspan="7">Tổng cộng</th>
                <th>{{ sumHeight.toFixed(2) }}</th>
                <th colspan="2"></th>
                <th>{{ PO[0].quantity.toLocaleString("en-US") }}</th>
                <th>
                  {{ (PO[0].quantity * PO[0].ItemVCN.volumn).toLocaleString(
                      "en-US"
                    ) }}
                </th>
                <th>{{ sumQuantitySauRong }}</th>
                <th>
                  {{ sumVolumnSauDong.toLocaleString("en-US") }}
                </th>
                <th></th>
              </tr>
            </tbody>
          </table>
          <b>II - Yêu cầu kỹ thuật:</b>
          <!-- <div class="row">
            <div class="col-2">
              1. Kết cấu ván
            </div>
            <div class="col-4">
              {{JSON.parse(PO[0].yeuCauKyThuat).ketCau}}
            </div>
          </div>
          <div class="row">
            <div class="col-2">
              2. Độ ẩm ván/keo dán
            </div>
            <div class="col-4">
              Độ ẩm &lt; {{JSON.parse(PO[0].yeuCauKyThuat).doAm}}
            </div>
          </div> -->
          <!-- <div class="row">
            <div class="col-2">
              3. Bề mặt ván
            </div>
            <div class="col-4">
              {{JSON.parse(PO[0].yeuCauKyThuat).beMat}}
            </div>
          </div> -->
          <div class="row">
            <div class="col-2">
              1. Theo hồ sơ sản phẩm:
            </div>
            <div class="col-4">
              {{JSON.parse(PO[0].yeuCauKyThuat).baCanh}}
            </div>
          </div>
          <div class="row">
            <div class="col-2">2. Chú ý:</div>
            <div class="col-4">
           {{ PO[0].yeuCauKyThuat.chuy }} 
            </div>
          </div>
          <b>III - Nguyên liệu - vật tư:</b>
          <table class="table-custom text-center" border="1" width="100%">
            <thead>
              <tr>
                <th>Nhóm</th>
                <th>Tên NL, VT</th>
                <th>Quy cách (mm)</th>
                <th>ĐVT</th>
                <th>SL</th>
                <th>M3 phôi</th>
                <th>Tổng</th>
                <th>Hoa hụt</th>
              </tr>
            </thead>
            <tr v-for="e in resources" v-bind:key="e.ten">
              <td>{{ e.nhom }}</td>
              <td>{{ e.ten }}</td>
              <td>{{ e.qc }}</td>
              <td>{{ e.dvt }}</td>
              <td>{{ parseFloat(e.sl).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</td>
              <td
                :style="
                  e.m3
                    ? toString(e.m3).indexOf('CHÚ') > -1
                      ? 'background-color:yellow; font-weight:bold'
                      : ''
                    : ''
                "
              >
                {{ e.m3 }}
              </td>

              <td>{{ e.tong }}</td>
              <td>{{ e.haoHut }}</td>
            </tr>
          </table>
          <table class="text-center" width="100%">
            <tr>
              <td style="padding-top: 20px" class="text-weight-bold">
                Người viết lệnh
              </td>
              <td style="padding-top: 20px" class="text-weight-bold">GĐSX</td>
              <td style="padding-top: 20px" class="text-weight-bold">
                Phòng kinh doanh
              </td>
            </tr>
            <tr>
              <td class="text-center">
                <span
                  style="display: inline-block; width: 300px; height: 120px"
                >
                  <img
                    alt="Không có chữ kí số"
                    width="300"
                    height="115"
                    :src="`/statics/${PO[0].createdBy}.png`" /></span
                ><br />
                {{ PO[0].acc1.lastName }}
              </td>
              <td class="text-center" v-if="PO[0].approvedByAccount">
                <span
                  style="display: inline-block; width: 300px; height: 120px"
                >
                  <img
                    alt="Không có chữ kí số"
                    width="200"
                    height="115"
                    :src="`/statics/${PO[0].approvedByAccount}.png`" /></span
                ><br />
                {{ PO[0].acc3.lastName }}
              </td>
              <td class="text-center" v-if="PO[0].approvedPKDBy">
                <span
                  style="display: inline-block; width: 300px; height: 120px"
                >
                  <img
                    alt="Không có chữ kí số"
                    width="200"
                    height="115"
                    :src="`/statics/${PO[0].approvedPKDBy}.png`"
                  /> </span
                ><br />

                {{ PO[0].acc2.lastName }}
              </td>
              <!-- <td style="padding-top: 100px">Nguyễn Hữu Thuấn</td>
              <td style="padding-top: 100px">Vi Tiến Hưng</td> -->
            </tr>
          </table>
        </div>
      </q-card-section>
    </q-card>
    <q-card class="my-card" v-else>
      <q-card-section>
        <div>
          <table class="table-custom" border="1" width="100%">
            <thead class="w-100">
              <tr>
                <td class="text-center" width="120" rowspan="2">
                  WOODSLAND TUYÊN QUANG - NM YÊN SƠN 3
                </td>
                <td class="text-center">QUY TRÌNH KHỞI ĐỘNG SẢN PHẨM</td>
                <td
                  width="150px"
                  style="word-break: break-word"
                  rowspan="2"
                  class="text-center text-weight-bolder"
                >
                  {{ PO[0].number }}
                </td>
              </tr>
              <tr>
                <th>
                  <strong>
                    LỆNH SẢN XUẤT <br />
                    KIÊM PHIẾU XUẤT KHO NGUYÊN LIỆU - VẬT TƯ
                  </strong>
                </th>
              </tr>
                   <tr>
        <th colspan="2" style="text-align:left;" ></th>
                <td colspan="1" style="text-align:left;" >
                  Ngày viết: {{ moment(PO[0].createdAt, "YYYY-MM-DD").format("L") }} 
                 
                </td>
              </tr>
            </thead>
          </table>
          <b>I - Thông tin chung</b>
          <table class="table-custom text-center" border="1" width="100%">
            <thead>
              <!-- <tr>
                <td colspan="2" rowspan="2">Sản phẩm</td>
                <th colspan="6" rowspan="2">
                  {{ PO[0].ItemVCN.name }}
                </th>
              </tr>
              <tr>
                <th colspan="2">Ngày viết LSX:</th>
                <th colspan="3">
                  {{ moment(PO[0].createdAt, "YYYY-MM-DD").format("L") }}
                </th>
              </tr> -->
              <tr>
                <th rowspan="2">Ván thành phẩm</th>
                <th rowspan="2">Dung sai</th>
                <th colspan="5">Kết cấu ván lõi</th>
                <th rowspan="2">Tổng độ dày (mm)</th>
                <th colspan="2">Quy trình SX</th>
                <th colspan="2">SL SX</th>
                <th rowspan="2">Ngày hoàn thành</th>
              </tr>
              <tr>
                <td >Số lớp</td>
                <td>Cách xếp</td>
                <td>Độ dày (mm)</td>
                <td colspan="2">Loại gỗ</td>
                <td colspan="2">Công đoạn</td>
                <td>Tấm</td>
                <td>m3</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td :rowspan="strucres.length + 1">{{ PO[0].size }} mm</td>
                <th :rowspan="strucres.length + 1">
                  +{{ PO[0].plus }}mm/ -{{ PO[0].sub }}mm
                </th>
                <td colspan="2"></td>
                <td></td>
                <td></td>
                <td></td>
                <th></th>
                <td
                  :rowspan="strucres.length + 1"
                  colspan="2"
                  class="text-left q-pl-xl"
                >
                  <p v-for="step in PO" v-bind:key="step.Department.id">
                    <b>{{ step.order }}</b
                    >. {{ step.Department.name }}
                  </p>
                </td>
                <th :rowspan="strucres.length + 1">
                  {{ PO[0].quantity.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
                </th>
                <td :rowspan="strucres.length + 1">
                  {{ (PO[0].quantity * PO[0].ItemVCN.volumn).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
                </td>
                <td :rowspan="strucres.length + 1">
                  {{ moment(PO[0].ngayDongGoi, "YYYY-MM-DD").format("L") }}
                </td>
              </tr>
              <tr v-for="struc in strucres" v-bind:key="struc.__KEY__">
                <td >{{ struc.num }}</td>
                <td>{{ struc.style }}</td>
                <td>{{ struc.height }}</td>
                <td colspan="2">{{ struc.woodType }}</td>
                <th>{{ struc.height }}</th>
              </tr>
              <tr>
                <th colspan="7">Tổng cộng</th>
                <th>{{ sumHeight.toFixed(2) }}</th>
                <th colspan="2"></th>
                <th>{{ PO[0].quantity.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</th>
                <th>
                  {{ (PO[0].quantity * PO[0].ItemVCN.volumn).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
                </th>
                <th></th>
              </tr>
            </tbody>
          </table>
          <b>II - Yêu cầu kỹ thuật:</b>
          <!-- <div class="row">
            <div class="col-2">
              1. Kết cấu ván
            </div>
            <div class="col-4">
              {{JSON.parse(PO[0].yeuCauKyThuat).ketCau}}
            </div>
          </div>
          <div class="row">
            <div class="col-2">
              2. Độ ẩm ván/keo dán
            </div>
            <div class="col-4">
              {{JSON.parse(PO[0].yeuCauKyThuat).doAm}}
            </div>
          </div>
          <div class="row">
            <div class="col-2">
              3. Bề mặt ván
            </div>
            <div class="col-4">
              {{JSON.parse(PO[0].yeuCauKyThuat).beMat}}
            </div>
          </div> -->
          <div class="row">
            <div class="col-2">
              1.Theo hồ sơ sản phẩm:
            </div>
            <div class="col-4">
              {{JSON.parse(PO[0].yeuCauKyThuat).baCanh}}
            </div>
          </div>
            <div class="row">
            <div class="col-2">2. Chú ý:</div>
            <div class="col-4">
           {{ PO[0].yeuCauKyThuat.chuy }} 
            </div>
          </div>
          <b>III - Nguyên liệu - vật tư:</b>
          <table class="table-custom text-center" border="1" width="100%">
            <thead>
              <tr>
                <th>Nhóm</th>
                <th>Tên NL, VT</th>
                <th>Quy cách (mm)</th>
                <th>ĐVT</th>
                <th>SL</th>
                <th>M3 phôi</th>
                <th>Tổng</th>
                <th>Hoa hụt</th>
              </tr>
            </thead>
            <tr v-for="e in resources" v-bind:key="e.ten">
              <td>{{ e.nhom }}</td>
              <td>{{ e.ten }}</td>
              <td>{{ e.qc }}</td>
              <td>{{ e.dvt }}</td>
              <td>{{ parseFloat(e.sl).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</td>
              <td
                :style="
                  e.m3
                    ? toString(e.m3).indexOf('CHÚ') > -1
                      ? 'background-color:yellow; font-weight:bold'
                      : 'word-wrap: break-word;white-space: -moz-pre-wrap; /* Firefox 1.0-2.0 */white-space: pre-wrap;'
                    : ''
                "
              >
                {{ e.m3 }}
              </td>
              <td>{{ e.tong }}</td>
              <td>{{ e.haoHut }}</td>
            </tr>
          </table>
          <table class="text-center" width="100%">
            <tr>
              <td style="padding-top: 20px" class="text-weight-bold">
                Người viết lệnh
              </td>
              <td style="padding-top: 20px" class="text-weight-bold">
                GĐSX
              </td>
              <td style="padding-top: 20px" class="text-weight-bold">Phòng kinh doanh</td>
            </tr>
            <tr>
              <td class="text-center">
                <span
                  style="display: inline-block; width: 300px; height: 120px"
                >
                  <img
                    alt="Không có chữ kí số"
                    width="300"
                    height="115"
                    :src="`/statics/${PO[0].createdBy}.png`"
                  /> </span
                ><br />
                {{ PO[0].acc1.lastName }}
              </td>        
              <td class="text-center" v-if="PO[0].approvedByAccount">
                <span
                  style="display: inline-block; width: 300px; height: 120px"
                >
                  <img
                    alt="Không có chữ kí số"
                    width="300"
                    height="115"
                    :src="`/statics/${PO[0].approvedByAccount}.png`" /></span
                ><br />
                {{ PO[0].acc3.lastName }}
              </td>
              <td class="text-center" v-if="PO[0].approvedPKDBy">
                <span
                  style="display: inline-block; width: 300px; height: 120px"
                >
                  <img
                    alt="Không có chữ kí số"
                    width="300"
                    height="115"
                    :src="`/statics/${PO[0].approvedPKDBy}.png`"
                  /> </span
                ><br />

                {{ PO[0].acc2.lastName }}
              </td>
              <!-- <td style="padding-top: 100px">Nguyễn Hữu Thuấn</td>
              <td style="padding-top: 100px">Vi Tiến Hưng</td> -->
            </tr>
          </table>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>



<script>
// import { DxColumn } from "devextreme-vue/data-grid";
// import { DxTreeList } from "devextreme-vue/tree-list";
import moment from "moment";
import { mapActions } from "vuex";
export default {
  // components: {
  //   DxColumn,
  //   DxTreeList,
  // },
  data() {
    return {
      PO: null,
      strucres: null,
      resources: null,
      sumHeight: 0,
      itemSauRong: [],
      sumQuantitySauRong: 0,
      sumVolumnSauDong: 0,
      stepSauRong: 0,
    };
  },
  methods: {
    ...mapActions("vcn", ["GET_PO_BY_NUMBER_VCN"]),
  },
  async mounted() {
    const number = this.$route.params.number;
    const data = await this.GET_PO_BY_NUMBER_VCN({ number });
    console.log(data);
    this.PO = data.data;
    this.sumQuantitySauRong = 0;
      this.sumVolumnSauDong = 0;
      let listDepartment = this.PO.filter(
        (p) => p.ItemVCN.id != this.PO[0].ItemVCN.id
      );
      console.log("listDepartment", listDepartment);
      this.stepSauRong = [];
      listDepartment.forEach((el) => {
        if (
          this.stepSauRong.filter((e) => e.Department.id == el.Department.id).length == 0
        ) {
          this.stepSauRong.push(el);
        }
      });
      console.log("stepSauRong", this.stepSauRong);
      this.itemSauRong = data.data.filter((d) => d.order == 2 && d.ItemVCN.id != data.data[0].ItemVCN.id);
      console.log("itemSauRong", this.itemSauRong);
      this.itemSauRong.forEach((el) => {
        this.sumQuantitySauRong += el.quantity;
        this.sumVolumnSauDong += el.quantity * el.ItemVCN.volumn;
      });
    this.strucres = JSON.parse(data.data[0].strucre);
    this.resources = JSON.parse(data.data[0].resources);
    // console.log(this.resources)

    this.strucres.forEach(
      (e) =>
        // console.log(parseFloat(e.height))
        (this.sumHeight = parseFloat(this.sumHeight) + parseFloat(e.height))
    );
  },
};
</script>

<style>
table {
  border-collapse: collapse;
  table-layout: fixed;
}
thead {
  width: 100%;
}
</style>