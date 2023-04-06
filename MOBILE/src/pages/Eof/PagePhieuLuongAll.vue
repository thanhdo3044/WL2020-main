<template>
  <div class="bg-blue-grey-7" style="min-height:600px">
    <div class="row">
      <div class="col-md-12 col-xs-12">
        <div class="row q-ma-sm">
          <div class="col-4">
          <q-icon color="white" name="keyboard_arrow_left" size="36px" @click="goBack"></q-icon>
          </div>
          <div class="col-5"></div>
          <input
            class="col-3 input-year "
            v-model="year"
            v-on:change="changeYear"
            type="text"
          />
        </div>
        <q-item
         v-for="(paySlip) in paySlipsT13s"
          :key="paySlip.id"
          class="bg-blue-grey-4 q-ma-sm phieuluong"
          exact
        >
          <q-item-section avatar>
            <q-icon name="paid" class="icon" />
          </q-item-section>
          <q-item-section
            class="text-blue-8 text-subtitle2"
            @click.prevent="clickT13(paySlip.id)"
          >
            Phiếu thưởng cuối năm {{ paySlip.nam }}  {{paySlipsT13s.length > 1 ? '- Phiếu'+paySlip.number : ''}} <br />
            {{ paySlip.hoTen + " - " + paySlip.mnv }}
          </q-item-section>
        </q-item>
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
      <div class="col-md-12 col-xs-12">
        <q-dialog v-model="confirm" maximized persistent>
          <q-card>
            <q-card-section class="row items-center">
              <div class="phieuLuongTitle">Phiếu lương chi tiết</div>
              <div class="phieuLuongTitle">tháng {{ time }}</div>
              <div class="col-12 col-md-12 col-xs-12">
                  <hr style="width: 50%" />
                  <q-table
                    :data="data"
                    :columns="columns"
                    class="bg-blue-grey-2"
                    row-key="name"
                    inline
                    :separator="separator"
                    :wrap-cells="true"
                    hide-bottom
                    :pagination.sync="pagination"
                  >
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                          class="bg-primary text-white"
                          style="text-align:center; font-weight:bold"
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
                            'bg-positive text-subtitle2 text-black') ||
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
                        :style="
                          props.row.khoan == 'Tổng TN thực trả' &&
                          'border-bottom: 15px solid #607d8b;'
                        "
                      >
                        {{ props.value ? props.value : "-" }}
                      </q-td>
                    </template>
                  </q-table>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-dialog v-model="confirmT13" maximized persistent>
          <q-card>
            <q-card-section v-if="paySlipsT13" class="row items-center">
              <div class="phieuLuongTitle">Chi tiết phiếu thưởng cuối năm</div>
              <div class="phieuLuongTitle"> {{ paySlipsT13.nam }}</div>
              <hr width="50%">
              <table>
                <tr>
                  <th class="headerTable">CÁC KHOẢN</th>
                  <th class="headerTable" style="width: 90px">TỶ LỆ THƯỞNG / SỐ NĂM LÀM VIỆC</th>
                  <th class="headerTable" style="width: 60px">SỐ TIỀN</th>
                </tr>
                
                <tr>
                  <th class="title-table" colspan="3">CĂN CỨ TÍNH THƯỞNG</th>
                </tr>
                <tr v-if="paySlipsT13.tongThuNhap != '-'">
                  <th class="text-left">Tổng thu nhập</th>
                  <td></td>
                  <td class="text-center">{{ paySlipsT13.tongThuNhap }}</td>
                </tr>
                <tr v-if="paySlipsT13.tongCong != '-'">
                  <th class="text-left">Số công + số ngày nghỉ phép {{ paySlipsT13.nam }} (Ngày)</th>
                  <td class="center">{{ paySlipsT13.tongCong }}</td>
                  <td></td>
                </tr>
                <tr v-if="paySlipsT13.tyLe != '-'">
                  <th class="text-left">Tỷ lệ</th>
                  <td class="center">{{ paySlipsT13.tyLe }}</td>
                  <td></td>
                </tr>
                <tr>
                  <th class="title-table" colspan="3">CÁC KHOẢN THƯỞNG</th>
                </tr>
                <tr v-if="paySlipsT13.heSoT13 != '-'">
                  <th class="text-left">Thưởng tháng lương T13</th>
                  <td class="center">{{ paySlipsT13.heSoT13 }}</td>
                  <td class="text-center">{{ paySlipsT13.thanhTienT13 }}</td>
                </tr>
                 <tr v-if="paySlipsT13.heSothamnien != '-'">
                  <th class="text-left">Thưởng thâm niên công tác</th>
                  <td class="text-center">{{ paySlipsT13.heSothamnien }}</td>
                  <td class="text-center">{{ paySlipsT13.thanhTienTNCT }}</td>
                </tr>  
                <tr v-if="paySlipsT13.heSoKQKD != '-'">
                  <th>Tiền thưởng kết quả KD</th>
                  <td class="center">{{ paySlipsT13.heSoKQKD }}</td>
                  <td>{{ paySlipsT13.thanhTienKQKD }}</td>
                </tr>               
                <tr v-if="paySlipsT13.heSoTPXS != '-'">
                  <th>
                    Thưởng tập thể/phòng xuất sắc
                  </th>
                  <td class="center">{{ paySlipsT13.heSoTPXS }}</td>
                  <td>{{ paySlipsT13.thanhTienTPXS}}</td>
                </tr>
                <tr v-if="paySlipsT13.heSoTCNXS != '-'">
                  <th>Tbg-infohưởng cá nhân xuất sắc</th>
                  <td class="center">{{ paySlipsT13.heSoTCNXS }}</td>
                  <td>{{ paySlipsT13.thanhTienTCNXS }}</td>
                </tr>
                <tr v-if="paySlipsT13.heSoTTBS != '-'">
                  <th>Thưởng bổ sung</th>
                  <td class="center">{{ paySlipsT13.heSoTTBS }}</td>
                  <td>{{ paySlipsT13.thanhTienTTBS }}</td>
                </tr>
                <tr v-if="paySlipsT13.heSoKPI != '-'">
                  <th>Thưởng KPI</th>
                  <td class="center">{{ paySlipsT13.heSoKPI }}</td>
                  <td>{{ paySlipsT13.chiSoKPI }}</td>
                </tr>
                <tr v-if="paySlipsT13.tongTTTinhTra != '-'">
                  <th class="bg-orange-4 text-left " style="font-weight:bold;font-size:13px">Tổng tiền thưởng tính trả</th>
                  <td class="bg-orange-4"></td>
                  <th class="bg-orange-4 text-center" style="font-weight:bold;font-size:13px">{{ paySlipsT13.tongTTTinhTra }}</th>
                </tr>
                <tr v-if="paySlipsT13.thueTNCN != '-'">
                  <th class="text-left">Tiền thuế TNCN</th>
                  <td ></td>
                  <th >{{ paySlipsT13.thueTNCN }}</th>
                </tr>
                <tr v-if="paySlipsT13.tongTTThucTra != '-'">
                  <th class="bg-orange-4 text-left" style="font-weight:bold;font-size:13px">Tổng tiền thưởng thực trả </th>
                  <td class="bg-orange-4"></td>
                  <th class="bg-orange-4 text-center" style="font-weight:bold;font-size:13px">{{ paySlipsT13.tongTTThucTra }}</th>
                </tr>       
              </table>
              <div class="row">
                <div class="col-12" align="center">
                  <hr width="50%">
                 <div style="font-size:12px"><b><i>"Cảm ơn Bạn đã có những đóng góp, cống hiến trong năm vừa qua"</i> </b></div>
                </div>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn label="OK" color="primary" v-close-popup />
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
      data: null,
      paySlips: null,
      paySlipsT13: null,
      paySlipsT13s: [],
      time: null,
      confirm: false,
      confirmT13: false,
      year: null,
      separator: "cell",
      tien: 0,
      pagination: {
        rowsPerPage: 50, // current rows per page being displayed
      },
      columns: [
        {
          name: "calories",
          align: "center",
          label: "CÁC KHOẢN",
          field: "khoan",
          align: "left",
          sortable: true,
          style:
            "width: auto; word-wrap: break-word;white-space: normal; border: 0.5px solid grey;",
        },
        {
          name: "fat",
          label: "QUY ĐỔI  ",
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
    ...mapActions("orders", [
      "getPaySplitByAccount",
      "getPaySplitById",
      "getPayslitT13ByAccount",
    ]),
    goBack() {
      this.$router.go(-1);
    },
    async click(id, time) {
      this.time = time;

      const data1 = await this.getPaySplitById({
        id,
      });
      // data1.data.shift();
      data1.data.shift();
      data1.data.shift();
      data1.data.shift();
      data1.data.shift();

      this.data = data1.data.filter((e) => e.khoan != "khoi");
      this.data = this.data.filter(
        (e) => e.tien.trim() != "-" || e.khoan == "Số phép còn tồn"
      );
      console.log(id);
      this.confirm = true;
      const luong = data1.data.filter((e) => e.khoan == "Tổng TN thực trả");
      this.tien = luong[0].tien;
      console.log("data1", this.tien);
    },
    clickT13(id) {
      this.paySlipsT13 = this.paySlipsT13s.find(p => p.id == id);
      this.confirmT13 = true;
    },
    async changeYear() {
      console.log("year : ", this.year);
      const mnv = this.userInfo.account;
      const data = await this.getPaySplitByAccount({ mnv, year: this.year });
      const data13 = await this.getPayslitT13ByAccount({
        mnv,
        year: this.year,
      });
      console.log("data13", data13.result.data);
      this.paySlipsT13s = data13.result.data;
      this.paySlips = data.data;
      console.log("vl", this.paySlips);
    },
  },
  async created() {
    const mnv = this.userInfo.account;
    this.year = moment().year();
    this.changeYear();
  },
  // :to="'/phieu-luong/' + item.ID"
};
</script>

<style scoped>
table,
td,
th {
  border: 1px solid #b0bec5;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 10px;
  padding: 7px;
}

table {
  width: 100%;
  border-collapse: collapse;
}
/* th {
  text-align: left;
}
td {
  text-align: right;
} */
.center{
  text-align: center;
}
.thanhTien {
  width: 80px;
}
.title-table{
  background-color: #C5E1A5;
  font-size: 10px;
}
.headerTable {
  background-color: #1976d2;
  text-align: center;
  font-size: 12px;
  color: white;
  padding: 5px;
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
  color: #21ba45;
  font-family: Roboto,-apple-system,Helvetica Neue,Helvetica,Arial,sans-serif;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  width: 100%;
}
.input-year {
  text-align: center;
  height: 34px;
  background-color: #21BA45;
  border: none;
  color: white;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%),
    0 3px 1px -2px rgb(0 0 0 / 12%);
}
</style>
