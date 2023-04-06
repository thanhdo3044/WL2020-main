<template>
  <div>
    <div class="row">
      <div class="col-md-12 col-xs-12">
        <div class="row">
          <q-btn
            class="col-5 q-ml-sm q-mb-sm q-mt-sm bg-orange text-white shadow-5"
            size="12px"
            v-go-back.single
            icon="arrow_back"
            push
            label="Quay lại"
          />
          <div class="col-1"></div>
          <input class="col-5" v-model="year" v-on:change="changeYear" type="text" style="text-align:center;height:30px;margin-top:10px;background-color:#31ccec;border:none;color:white">
        </div>
        <q-item
          v-for="item in paySlips"
          :key="item.ID"
          class="bg-blue-grey-4 q-ma-sm phieuluong"
          exact
        >
          <q-item-section avatar>
            <q-icon name="paid" class="icon" />
          </q-item-section>
          <q-item-section
            class="text-blue-8 text-subtitle2"
            @click.prevent="click(item.ID, `${item.thang} /  ${item.nam}`)"
          >
            Phiếu lương tháng {{ item.thang + "/" + item.nam }} <br />
            {{ item.ten + " - " + item.mnv }}
          </q-item-section>
        </q-item>
      </div>
    </div>
    <div class="row">
      <div>
        <q-dialog v-model="confirm" maximized persistent>
          <q-card>
            <!-- <q-card-section class="row items-center"> -->
              <div class="phieuLuongTitle">
                Phiếu lương chi tiết tháng {{ time }}
              </div>
              <div class="col-md-12 col-xs-12">
                <div class="">
                  <!-- <q-table
                    :data="data"
                    :columns="columns"
                    class="bg-blue-grey-2"
                    row-key="name"
                    inline
                    :separator="separator"
                    :pagination.sync="pagination"
                  >
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                          class="bg-primary text-white"
                        >
                          {{ col.label }}
                        </q-th>
                      </q-tr>
                    </template>

                    <template v-slot:body-cell="props">
                      <q-td
                        :props="props"
                        :class="
                          (props.row.khoan == 'Tổng TN thực trả' &&
                            'bg-blue-10 text-subtitle2 text-white') ||
                          (props.row.khoan == 'Tổng TN tính trả' &&
                            'bg-light-blue-12 text-subtitle2 text-black') ||
                          ((props.row.khoan == 'Tiền BHXH 10.5%' ||
                            props.row.khoan == 'Trừ thuế TNCN' ||
                            props.row.khoan == 'Trừ khác' ||
                            props.row.khoan == 'CĐ hiện vật theo nhà bếp' ||
                            props.row.khoan == 'Tạm ứng lương') &&
                            'bg-orange-2 text-subtitle2 text-black') ||
                          (props.row.khoan == 'Tổng trừ' &&
                            'bg-orange-7 text-subtitle2 text-black')
                        "
                      >
                        {{ props.value ? props.value : '-' }}
                      </q-td>
                    </template>
                  </q-table> -->
                  <hr />
                  <table style="width: 100%">
                    <tr style="background-color: #64b5f6">
                      <th>Tổng TN tính trả</th>
                      <th class="text-center">{{ data.tongTN }}</th>
                    </tr>
                    <tr style="background-color: #ffe0b2">
                      <th>Tiền BHXH 10.5%</th>
                      <th class="text-center">{{ data.bhxh }}</th>
                    </tr>
                    <tr style="background-color: #ffe0b2">
                      <th>Thuế TNCN</th>
                      <th class="text-center">{{ data.thueTNCN }}</th>
                    </tr>
                    <tr style="background-color: #ffe0b2">
                      <th>Trừ khác</th>
                      <th class="text-center">{{ data.truKhac }}</th>
                    </tr>
                    <tr style="background-color: #ffe0b2">
                      <th>Tiền ăn</th>
                      <th class="text-center">{{ data.tienAn }}</th>
                    </tr>
                    <tr style="background-color: #ffe0b2">
                      <th>Tạm ứng</th>
                      <th class="text-center">{{ data.ungLuong }}</th>
                    </tr>
                    <tr style="background-color: #fb8c00">
                      <th>Tổng trừ</th>
                      <th class="text-center">{{ data.tongTru }}</th>
                    </tr>
                    <tr style="background-color: blue; color: white">
                      <th>Tổng TN thực trả</th>
                      <th class="text-center">{{ data.thucTra }}</th>
                    </tr>
                  </table>
                  <br />
                  <table style="width: 100%">
                    <tr style="background-color: grey; color: orange">
                      <th class="text-center">CÁC KHOẢN</th>
                      <th class="text-center">NGÀY CÔNG</th>
                      <th class="text-center">SỐ TIỀN</th>
                    </tr>
                    <tr>
                      <td>Công chính</td>
                      <td class="text-center">{{ data.congChinh }}</td>
                      <td class="text-center">{{ data.tienCongChinh }}</td>
                    </tr>
                    <tr>
                      <td>Làm thêm NT 1.5</td>
                      <td class="text-center">{{ data.lt15 }}</td>
                      <td class="text-center" rowspan="3">
                        {{ data.tienLamThem }}
                      </td>
                    </tr>
                    <tr>
                      <td>Làm thêm NN 2.0</td>
                      <td class="text-center">{{ data.lt20 }}</td>
                    </tr>
                    <tr>
                      <td>Làm thêm NL 3.0</td>
                      <td class="text-center">{{ data.le }}</td>
                    </tr>
                    <tr>
                      <td>Ca đêm NT</td>
                      <td class="text-center">{{ data.ot1 }}</td>
                      <td class="text-center" rowspan="3">
                        {{ data.tiencaDem }}
                      </td>
                    </tr>
                    <tr>
                      <td>Ca đêm NN</td>
                      <td class="text-center">{{ data.ot2 }}</td>
                    </tr>
                    <tr>
                      <td>Ca đêm NL</td>
                      <td class="text-center">{{ data.ot3 }}</td>
                    </tr>
                    <tr>
                      <td>Tổng công</td>
                      <td class="text-center">{{ data.tcLam }}</td>
                      <td class="text-center">-</td>
                    </tr>
                    <tr>
                      <td>Tổng điểm</td>
                      <td class="text-center">{{ data.tongDiem }}</td>
                      <td class="text-center">-</td>
                    </tr>
                    <tr>
                      <td>Thưởng HTCV (KPI)</td>
                      <td class="text-center">-</td>
                      <td class="text-center">{{ data.HTCV }}</td>
                    </tr>
                    <tr>
                      <td>Thưởng ABC</td>
                      <td class="text-center">-</td>
                      <td class="text-center">{{ data.tienThuongABC }}</td>
                    </tr>
                    <tr>
                      <td>Phép năm</td>
                      <td class="text-center">{{ data.nghiLe }}</td>
                      <td class="text-center">-</td>
                    </tr>
                    <tr>
                      <td>Hệ số cống hiến</td>
                      <td class="text-center">-</td>
                      <td class="text-center">-</td>
                    </tr>
                    <tr>
                      <td>Thưởng năng suất/cống hiến</td>
                      <td class="text-center">-</td>
                      <td class="text-center">{{ data.thamNienNangSuat }}</td>
                    </tr>
                    <tr>
                      <td>PCTN/PCCC/SCC/ATV</td>
                      <td class="text-center">{{ data.pc }}</td>
                      <td class="text-center">-</td>
                    </tr>
                    <tr>
                      <td>Hỗ trợ đi lại, nhà ở</td>
                      <td class="text-center">-</td>
                      <td class="text-center">{{ data.diLai }}</td>
                    </tr>
                    <tr>
                      <td>Điện thoại</td>
                      <td class="text-center">-</td>
                      <td class="text-center">{{ data.dienThoai }}</td>
                    </tr>
                    <tr>
                      <td>Thưởng HTCV2/Khoán CTP</td>
                      <td class="text-center">-</td>
                      <td class="text-center">{{ data.HTCV2 }}</td>
                    </tr>
                    <tr>
                      <td>HT khác/thưởng kiêm nhiệm</td>
                      <td class="text-center">-</td>
                      <td class="text-center">{{ data.hoTroKhac }}</td>
                    </tr>
                    <tr>
                      <td>Thưởng chuyên cần</td>
                      <td class="text-center">-</td>
                      <td class="text-center">{{ data.chuyenCan }}</td>
                    </tr>
                    <tr>
                      <td>Nghỉ lễ hưởng 100%</td>
                      <td class="text-center">-</td>
                      <td class="text-center">{{ data.luongLe }}</td>
                    </tr>
                    <tr>
                      <td>Bồi dưỡng hiện vật</td>
                      <td class="text-center">-</td>
                      <td class="text-center">{{ data.boiDuong }}</td>
                    </tr>
                    <tr>
                      <td>Tính trả BHXH 21.5%</td>
                      <td class="text-center">-</td>
                      <td class="text-center">{{ data.bh }}</td>
                    </tr>
                    <tr>
                      <td>Khoản tính bổ sung</td>
                      <td class="text-center">-</td>
                      <td class="text-center">{{ data.boSung }}</td>
                    </tr>
                    <tr>
                      <td>Ghi chú</td>
                      <td class="text-center">-</td>
                      <td class="text-center">{{ data.ghiChu }}</td>
                    </tr>
                    <tr>
                      <td>Phép tồn</td>
                      <td class="text-center">{{ data.phepTon }}</td>
                      <td class="text-center">-</td>
                    </tr>
                  </table>
                </div>
              </div>
            <!-- </q-card-section> -->

            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      data: {
        mnv: "",
        ten: "",
        chucVu: "",
        boPhan: "",
        congChinh: "",
        tienCongChinh: "",
        lt15: "",
        lt20: "",
        le: "",
        ot1: "",
        ot2: "",
        ot3: "",
        tienLamThem: "",
        nt: "",
        nn: "",
        nl: "",
        tiencaDem: "",
        xepABC: "",
        tienThuongABC: "",
        chiSoKPI: "",
        HTCV: "",
        phep: "",
        luongPhep: "",
        tongDiem: "",
        tcLam: "",
        thamNien: "",
        hoTroKhac: "",
        pc: "",
        dienThoai: "",
        HTCV2: "",
        diLai: "",
        kinhDoanh: "",
        congHien: "",
        nangSuat: "",
        thamNienNangSuat: "",
        ctp: "",
        kiemNhiem: "",
        chuyenCan: "",
        nghiLe: "",
        phepTon: "",
        luongLe: "",
        boiDuong: "",
        bh: "",
        boSung: "",
        NgungViec: "",
        khoiLuong: "",
        tongTN: "",
        bhxh: "",
        thueTNCN: "",
        truKhac: "",
        tienAn: "",
        ungLuong: "",
        tongTru: "",
        thucTra: "",
        ghiChu: "",
        updatedAt: "",
        createdAt: "",
        thang: "",
        nam: "",
        accountId: "",
        khoi: "",
      },
      paySlips: null,
      year: null,
      time: null,
      confirm: false,
      separator: "cell",
      tien: 0,
      pagination: {
        rowsPerPage: 50, // current rows per page being displayed
      },
      columns: [
        {
          name: "calories",
          align: "center",
          label: "Các Khoản",
          field: "khoan",
          align: "left",
          sortable: true,
          style:
            "width: auto; word-wrap: break-word;white-space: normal; border: 0.5px solid grey",
        },
        {
          name: "fat",
          label: "Quy đổi  ",
          field: "tien",
          sortable: true,
          style: "border: 0.5px solid grey",
        },
      ],
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("orders", ["getPaySplitByAccount", "getPaySplitById"]),
    async click(id, time) {
      this.time = time;

      const data1 = await this.getPaySplitById({
        id,
      });
      // data1.data.shift();
      // data1.data.shift();
      // data1.data.shift();
      // data1.data.shift();
      // data1.data.shift();

      // this.data = data1.data.filter((e) => e.khoan != "khoi");
      this.data = data1.data;
      console.log("data", this.data);

      this.confirm = true;
      // const luong = data1.data.filter((e) => e.khoan == "Tổng TN thực trả");
      // this.tien = luong[0].tien;
      // console.log("data1", this.tien);
    },
    async changeYear(){
      console.log("year : ", this.year);
      const mnv = this.userInfo.account;
      const data = await this.getPaySplitByAccount({ mnv, year: this.year });
      this.paySlips = data.data;
    console.log("vl", this.paySlips);

    }
  },
  async created() {
    this.year = parseInt(moment().year());
    this.changeYear();    
  },
  watch:{

  }
  // :to="'/phieu-luong/' + item.ID"
};
</script>

<style scoped>
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
th {
  text-align: left;
}

.text-center {
  text-align: center;
}

.phieuluong {
  border: 1px solid white;
  border-radius: 10px !important;
  height: 70px;
}
.icon {
  color: white;
  font-size: 3rem;
}

.phieuLuongTitle {
  width: 100%;
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  color: #1976d2;
  font-family: "Times New Roman", Times, serif;
  font-size: 15px;
}
</style>>
