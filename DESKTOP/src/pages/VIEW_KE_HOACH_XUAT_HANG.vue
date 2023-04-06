<template>
  <q-page>
    <q-card>
      <div class="row print-hide" style="background-color: #daf8e1">
        <div class="col-10 text-blue text-bold" style="font-size: 18px">
          Xuất hàng theo kế hoạch
        </div>
        <div class="col-1" align="right">
          <input type='button' class="bnt" value="Xem phiếu xuất kho"
            onclick="document.location.href='/#/phieu-xuat-kho';" />
        </div>
        <div class="col-1 cursor-pointer text-blue text-bold" style="font-size: 18px" align="right"
          @click="showChooseDate = true">
          Ngày <span class="text-amber-14">{{ ngayTao }}</span>
        </div>
      </div>
      <table id="employee_data" class="table" style="width: 100%; border-collapse: collapse" border="1">
        <tr>
          <th style=" color: #071ff1; background-color: #daf8e1">
            Số Consigment
          </th>
          <th style=" color: #071ff1; background-color: #daf8e1">
            Kho IKEA
          </th>
          <th style=" color: #071ff1; background-color: #daf8e1">
            Địa điểm đóng hàng
          </th>
          <th style=" color: #071ff1; background-color: #daf8e1">
            Mã hàng
          </th>
          <th style="color: #071ff1; background-color: #daf8e1">
            Tên hàng
          </th>
          <th style="color: #071ff1; background-color: #daf8e1">
            Số lượng xuất
          </th>
          <th style="color: #071ff1; background-color: #daf8e1;width: 90px;">
            Xuất hàng
          </th>
        </tr>
        <tr v-for="(data, ID) in data" :key="ID">
          <td v-if="data.first" :rowspan="data.rowspan" style="font-weight: 800; padding-left: 10px">
            {{ data.consigment }}
          </td>
          <td v-if="data.first" :rowspan="data.rowspan" style="font-weight: 800; padding-left: 10px">
            {{ data.kho_IKEA }}
          </td>
          <td style="font-weight: 800; padding-left: 10px; ">
            {{ data.diadiem }}
          </td>
          <td style="font-weight: 800; padding-left: 10px; ">
            {{ data.mahang }}
          </td>
          <td style="font-weight: 800; padding-left: 10px; ">
            {{ data.tenhang }}
          </td>
          <td style="font-weight: 800; padding-left: 10px;">
            {{ data.sl }}
          </td>
          <td v-if="data.first && data.status == 'Chưa xuất'" :rowspan="data.rowspan"
            style="font-weight: 800; padding-left: 10px; ">
            <q-btn color="primary" label="Xuất" @click="showCF(data.consigment)" />
          </td>
        </tr>
      </table>
    </q-card>
    <q-dialog v-model="isShowCF" persistent>
      <q-card style="min-width: 20%">
        <q-card-section class="row items-center">
          Bạn muốn xuất consigment số : "
          <label style="font-weight: bold;"> {{ soConsigment }}</label>
          "
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="OK" @click="xuatConsigment" color="positive" />
          <q-btn label="Hủy" color="orange" @click="isShowCF = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showChooseDate" class="q-pa-md">
      <div>
        <div>
          <q-date v-model="toDate" title="Chọn ngày" simple today-btn mask="MM-DD-YYYY" />
        </div>
        <div class="q-pa-md q-gutter-sm" align="right" style="background-color: #fff;">
          <q-btn color="primary" label="Đồng ý" @click="changeDate" />
          <q-btn color="red" label="Hủy" @click="showChooseDate = false" />
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
import {
} from "devextreme-vue/data-grid";
import DialogSelectDate from "../components/commons/DialogSelectFromDateToDate";
import moment from "moment";
import {
  formatDateVN,
  getFisrtDayOfMonth
} from "../ultils";
export default {
  components: {
    DialogSelectDate
  },
  data() {
    return {
      table: null,
      consigments: [],
      consigment: null,
      isShowCF: false,
      data: [],
      soConsigment: '',
      toDate: null,
      showChooseDate: false,
      ngayTao: null
    };
  },
  created() {
    this.toDate = this.formatDate(new Date());
    this.loadData();
  },
  methods: {
    ...mapActions("prod", ["GET_KYGUI", "getConsigments", "updateConsigments"]),
    async loadData() {
      const data = await this.GET_KYGUI(this.toDate)
      this.ngayTao = moment(this.toDate).format("DD-MM-YYYY")
      console.log('this.toDate', this.toDate)
      const consigments = await this.getConsigments(this.toDate)
      this.data = data.data
      console.log('tthis.data', this.data)
      // this.data = this.data.filter(f => f.ngaytao == this.toDate)
      this.consigments = consigments.data;
      this.data.forEach(element => {
        if (element.ID == element.IDMAX) {
          element.first = true
        } else {
          element.first = false
        }
      });
    },
    formatDate(value) {
      return moment(value).format("YYYY-MM-DD 00:00:00.000")
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadData()
    },
    cancelChooseDate() {
      this.showChooseDate = false;
      this.loadData()
    },
    changeDate() {
      this.toDate = this.formatDate(this.toDate)
      this.loadData();
      this.showChooseDate = false
    },
    showCF(e) {
      this.soConsigment = e
      this.isShowCF = true
    },
    async xuatConsigment() {
      let payload = []
      payload.push({
        consigment: this.soConsigment,
        nguoixuat: this.userInfo.id
      })
      const data = await this.updateConsigments(payload)
      if (data.meta.success) {
        this.isShowCF = false;
        this.loadData();
        this.$q.notify({
          message: "Xuất thành công",
          color: "positive"
        })
      } else {
        this.$q.notify({
          message: "Thất bại",
          color: "negative"
        })
      }
    }
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    tuNgay() {
      return formatDateVN(this.toDate);
    },
  },
};

</script>
<style>
table,
td,
th {
  border: 1px solid black;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.center {
  text-align: center;
}

.right {
  text-align: right;
}

.colorHeader {
  background-color: #daf8e1;
  color: black;
  padding: 10px 5px 10px 5px;
}

.colorMonth {
  padding: 3px;
  font-size: 16px;
}

.colorTotal {
  padding: 3px;
  font-size: 16px;
  font-weight: bold;
}

.bnt {
  background-color: #4CAF50;
  /* Green */
  border: none;
  color: white;
  padding: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 2px;
}
</style>