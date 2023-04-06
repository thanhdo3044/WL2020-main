<template>
  <q-page class="bg-blue-grey-7">
    <app-bar class="text-white">Phiếu cấp sơn theo định mức</app-bar>
    <div class="row">
        <div class="col-8">
        <q-select
        dark
          style="margin: 5px"
          label-color="orange"
          @input="loadGrid"
          dense
          outlined
          v-model="idDepartment"
          :options="options"
          label="Chọn nhà máy"
        />
      </div>
      <div class="col-4">
        <q-input
        dark
          @input="loadGrid"
          style="margin: 5px"
          label-color="orange"
          outlined
          v-model.number="year"
          dense
          type="number"
          label="Năm"
        />
      </div>
         <div class="col-8">
        <q-select
        dark
          style="margin: 5px"
          label-color="orange"
          @input="loadHistory"
          dense
          outlined
          v-model="number"
          :options="listNumber"
          stack-label
          label="Chọn lệnh sản xuất"
        />
      </div>
      <div class="col-4">
        <q-input
        dark
          style="margin: 5px"
          label-color="orange"
          @input="loadGrid"
          outlined
          v-model.number="week"
          dense
          type="number"
          label="Tuần"
        />
      </div>
    </div>
    <div class="row">
      <q-radio v-if="listPassVT.length > 0" @input="onChangePass" class="col-6" v-model="isPass" val="0" label="Cấp trong định mức" />
      <q-radio v-if="listPassVT.length > 0" @input="onChangePass" class="col-6 text-red" v-model="isPass" val="1" label="Cấp vượt định mức" />
      <q-btn
      class="col-12  text-center text-bold "
      style="margin-bottom:5px; font-style: oblique; font-size:12px;background-color: #daf8e1"
      outlined
      label="Danh mục VT sơn theo định mức"
    />
    <div v-if="isPass == '0'">
    <q-card v-for="(row, index) in rows" :key="index" style="margin-bottom:10px" class="my-card">
      <q-card-section v-if="index%2 == 0" class="row bg-green-1">
        <div class="col-8 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  Mã VT:
                  <span class="text-primary">{{row.MA_VT}}</span>
                </q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.MA_VT" label-color="orange" label="Mã VT" readonly /> -->
        </div>
        <div class="col-4 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  ĐVT:
                   <span class="text-primary">{{row.dvt}}</span>
                  
                </q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dvt" label="ĐVT" label-color="orange" readonly /> -->
        </div>
        <div class="col-12 p-5">
          <q-item-label
            caption
            lines="4"
            class="text-orange border-bt"
            style="font-size: 11px; padding-top: 0px; font-weight: bold"
          >
            Tên VT:
            <div>
              <div class="text-primary" style="padding:2px;margin:2px">{{ row.ten_vt }}</div> 
            </div>
          </q-item-label>
           <!-- <q-input dense type="textarea" :input-style="{resize: 'none', maxHeight: '50px'}"  label-color="orange" v-model="row.ten_vt" label="Tên VT" readonly /> -->
        </div>
        
        <div class="col-6 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  SL theo định mức: <br>
                  <q-badge class="bg-blue" :label="row.SLSX"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.SLSX" label="SL theo định mức" label-color="orange" readonly /> -->
        </div>
        
        <div class="col-3 p-5">
          <q-item-section class="text-positive border-bt">
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  SL đã cấp: <br>
                  <q-badge class="bg-blue text-orange" :label="row.dacap"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dacap" label="SL đã cấp" label-color="orange" readonly /> -->
        </div>
        <div class="col-3 p-5">
          <q-item-section class="text-positive border-bt">
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  SL còn lại: <br>
                  <q-badge class="bg-positive text-white" :label="(row.SLSX - row.dacap).toLocaleString(
                      'en-US'
                    )"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dacap" label="SL đã cấp" label-color="orange" readonly /> -->
        </div>
        <div class="col-12">
          <q-input
            v-model.number="row.SLYC"
            filled
            stack-label
            class="bg-blue-grey-11"
            label-color="primary"
            type="number"
            style="font-style: oblique"
            label="SL y/c cấp"
            dense
          />
        </div>
        <div class="col-12" style="padding-top:5px">
          <q-input
          v-if="isPass == '1'"
            v-model="row.DESCRIPTION"
            filled
            stack-label
            class="bg-blue-grey-11"
            label-color="primary"
            style="font-style: oblique"
            label="Lý do"
            dense
          />
        </div>
      </q-card-section>
      <q-card-section v-else class="row bg-blue-grey-1">
        <div class="col-8 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  Mã VT:
                  <span class="text-primary">{{row.MA_VT}}</span>
                </q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.MA_VT" label-color="orange" label="Mã VT" readonly /> -->
        </div>
        <div class="col-4 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  ĐVT:
                   <span class="text-primary">{{row.dvt}}</span>
                  
                </q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dvt" label="ĐVT" label-color="orange" readonly /> -->
        </div>
        <div class="col-12 p-5">
          <q-item-label
            caption
            lines="4"
            class="text-orange border-bt"
            style="font-size: 11px; padding-top: 0px; font-weight: bold"
          >
            Tên VT:
            <div>
              <div class="text-primary" style="padding:2px;margin:2px">{{ row.ten_vt }}</div> 
            </div>
          </q-item-label>
           <!-- <q-input dense type="textarea" :input-style="{resize: 'none', maxHeight: '50px'}"  label-color="orange" v-model="row.ten_vt" label="Tên VT" readonly /> -->
        </div>
        
        <div class="col-6 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  SL theo định mức: <br>
                  <q-badge class="bg-blue" :label="row.SLSX"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.SLSX" label="SL theo định mức" label-color="orange" readonly /> -->
        </div>
        
        <div class="col-3 p-5">
          <q-item-section class="text-positive border-bt">
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  SL đã cấp: <br>
                  <q-badge class="bg-blue text-orange" :label="row.dacap"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dacap" label="SL đã cấp" label-color="orange" readonly /> -->
        </div>
        <div class="col-3 p-5">
          <q-item-section class="text-positive border-bt">
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  SL còn lại: <br>
                  <q-badge class="bg-positive text-white" :label="(row.SLSX - row.dacap).toLocaleString(
                      'en-US'
                    )"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dacap" label="SL đã cấp" label-color="orange" readonly /> -->
        </div>
        <div class="col-12">
          <q-input
            v-model.number="row.SLYC"
            filled
            stack-label
            class="bg-blue-grey-11"
            label-color="primary"
            type="number"
            style="font-style: oblique"
            label="SL y/c cấp"
            dense
          />
        </div>
        <div class="col-12" style="padding-top:5px">
          <q-input
          v-if="isPass == '1'"
            v-model="row.DESCRIPTION"
            filled
            stack-label
            class="bg-blue-grey-11"
            label-color="primary"
            style="font-style: oblique"
            label="Lý do"
            dense
          />
        </div>
      </q-card-section>
    </q-card>
    </div>
    <div v-else>
      <q-card v-for="(row, index) in rows" :key="index" style="margin-bottom:10px" class="my-card">
      <q-card-section v-if="index%2 == 0" class="row bg-green-1">
        <div class="col-8 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  Mã VT:
                  <span class="text-primary">{{row.MA_VT}}</span>
                </q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.MA_VT" label-color="orange" label="Mã VT" readonly /> -->
        </div>
        <div class="col-4 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  ĐVT:
                   <span class="text-primary">{{row.dvt}}</span>
                  
                </q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dvt" label="ĐVT" label-color="orange" readonly /> -->
        </div>
        <div class="col-12 p-5">
          <q-item-label
            caption
            lines="4"
            class="text-orange border-bt"
            style="font-size: 11px; padding-top: 0px; font-weight: bold"
          >
            Tên VT:
            <div>
              <div class="text-primary" style="padding:2px;margin:2px">{{ row.ten_vt }}</div> 
            </div>
          </q-item-label>
           <!-- <q-input dense type="textarea" :input-style="{resize: 'none', maxHeight: '50px'}"  label-color="orange" v-model="row.ten_vt" label="Tên VT" readonly /> -->
        </div>
        
        <div class="col-6 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  SL theo định mức: <br>
                  <q-badge class="bg-blue" :label="row.SLSX"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.SLSX" label="SL theo định mức" label-color="orange" readonly /> -->
        </div>
        
        <div class="col-3 p-5">
          <q-item-section class="text-positive border-bt">
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  SL đã cấp: <br>
                  <q-badge class="bg-blue text-orange" :label="row.dacap"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dacap" label="SL đã cấp" label-color="orange" readonly /> -->
        </div>
        <div class="col-3 p-5">
          <q-item-section class="text-positive border-bt">
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  SL cấp vượt: <br>
                  <q-badge class="bg-positive text-white" :label="( row.dacap - row.SLSX  ).toLocaleString(
                      'en-US'
                    )"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dacap" label="SL đã cấp" label-color="orange" readonly /> -->
        </div>
        <div class="col-12">
          <q-input
            v-model.number="row.SLYC"
            filled
            stack-label
            class="bg-blue-grey-11"
            label-color="primary"
            type="number"
            style="font-style: oblique"
            label="SL y/c cấp"
            dense
          />
        </div>
        <div class="col-12" style="padding-top:5px">
          <q-input
          v-if="isPass == '1'"
            v-model="row.DESCRIPTION"
            filled
            stack-label
            class="bg-blue-grey-11"
            label-color="primary"
            style="font-style: oblique"
            label="Lý do"
            dense
          />
        </div>
      </q-card-section>
      <q-card-section v-else class="row bg-blue-grey-1">
        <div class="col-8 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  Mã VT:
                  <span class="text-primary">{{row.MA_VT}}</span>
                </q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.MA_VT" label-color="orange" label="Mã VT" readonly /> -->
        </div>
        <div class="col-4 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  ĐVT:
                   <span class="text-primary">{{row.dvt}}</span>
                  
                </q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dvt" label="ĐVT" label-color="orange" readonly /> -->
        </div>
        <div class="col-12 p-5">
          <q-item-label
            caption
            lines="4"
            class="text-orange border-bt"
            style="font-size: 11px; padding-top: 0px; font-weight: bold"
          >
            Tên VT:
            <div>
              <div class="text-primary" style="padding:2px;margin:2px">{{ row.ten_vt }}</div> 
            </div>
          </q-item-label>
           <!-- <q-input dense type="textarea" :input-style="{resize: 'none', maxHeight: '50px'}"  label-color="orange" v-model="row.ten_vt" label="Tên VT" readonly /> -->
        </div>
        
        <div class="col-6 p-5">
          <q-item-section class="text-positive border-bt">
           
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  SL theo định mức: <br>
                  <q-badge class="bg-blue" :label="row.SLSX"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.SLSX" label="SL theo định mức" label-color="orange" readonly /> -->
        </div>
        
        <div class="col-3 p-5">
          <q-item-section class="text-positive border-bt">
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  SL đã cấp: <br>
                  <q-badge class="bg-blue text-orange" :label="row.dacap"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dacap" label="SL đã cấp" label-color="orange" readonly /> -->
        </div>
        <div class="col-3 p-5">
          <q-item-section class="text-positive border-bt">
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-orange"
                  style="font-size: 12px; font-weight: bold"
                >
                  SL cấp vượt: <br>
                  <q-badge class="bg-positive text-white" :label="(row.dacap - row.SLSX).toLocaleString(
                      'en-US'
                    )"
                /></q-item-label>
              </q-item-section>
           <!-- <q-input dense v-model="row.dacap" label="SL đã cấp" label-color="orange" readonly /> -->
        </div>
        <div class="col-12">
          <q-input
            v-model.number="row.SLYC"
            filled
            stack-label
            class="bg-blue-grey-11"
            label-color="primary"
            type="number"
            style="font-style: oblique"
            label="SL y/c cấp"
            dense
          />
        </div>
        <div class="col-12" style="padding-top:5px">
          <q-input
          v-if="isPass == '1'"
            v-model="row.DESCRIPTION"
            filled
            stack-label
            class="bg-blue-grey-11"
            label-color="primary"
            style="font-style: oblique"
            label="Lý do"
            dense
          />
        </div>
      </q-card-section>
    </q-card>
    </div>
      <div class="col-12" align="center">
        <q-btn
      class="bg-positive text-white"
      style="margin-bottom:5px"
      outlined
      label="Gửi yêu cầu"
      @click="xuatvattu()"
    />
      </div>
      
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { ref } from "vue";
import {
  showNotifySuccess,
  showNotifyError,
} from "../../ultils";
import { getWeekNumber } from "../../ultils";
import AppBar from "../../components/AppBar";
export default {
   components: {
    "app-bar": AppBar,
  },
  data() {
    return {
      week: "",
      year: null,
      number: "",
      idDepartment: null,
      listNumber: [],
      rows: [],
      listVT: [],
      listPassVT: [],
      isPass: "0",
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    dataReceiptFilter() {
      if (this.searchQuery)
        return this.dataReceipt.filter((d) => {
          const matchString =
            d.bomName +
            " " +
            d.bomHeight +
            " " +
            d.bomWidth +
            " " +
            d.bomLength;
          return matchString
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        });
      return this.dataReceipt;
    },
  },
  created() {
    const today = new Date();
    const currentYear = today.getFullYear();
    this.year = currentYear;
    this.week = getWeekNumber(today);
    this.options = this.userInfo.role.types[0].value
      .filter((s) => s.type2 === "nhaMay" && s.parentId === 102299)
      .map((o) => ({
        label: o.name,
        code: o.code,
        factoryId: o.factory,
        value: o.factory,
      }));
    this.idDepartment = this.options[0];
    this.loadGrid();
  },
  methods: {
    async loadGrid() {
      this.listNumber = [];

      const payload = {
        week: this.week,
        year: this.year,
        factoryId: this.idDepartment.factoryId,
      };

      const data = await this.$store.dispatch(
        "production/GET_HE_SO_LSX",
        payload
      );
      data.data.forEach((element) => {
        this.listNumber.push(element.number);
      });
    },
    onChangePass(){
      if(this.isPass == "1"){
        this.rows = this.listVT.filter(r => r.SLSX <= r.dacap);
      }else{
        this.rows = this.listVT.filter(r => r.SLSX > r.dacap);
      }
    },
    async kiemtra(e) {
      if (parseFloat(e.SLYC) + parseFloat(e.dacap) > parseFloat(e.SLSX) && this.isPass == "0") {
        e.SLYC = 0;
        return this.$q.dialog({
          title: "Lỗi",
          message: "Yêu cầu vượt quá kế hoạch sản xuất!",
        });
      }
    },
    async loadHistory() {
      console.log("LSX:", this.number);
      this.rows = [];
      this.showEdit1 = false;
      this.duyet = "";
      this.solan = "";
      this.lan = "";
      const payload = {
        number: this.number,
      };
      const data = await this.$store.dispatch(
        "production/XUAT_VAT_TU",
        payload
      );
      this.rows = data;
      this.listVT = data;
      this.listPassVT = this.listVT.filter(r => r.SLSX >= r.dacap);
      this.onChangePass();
      // console.log('du lieu',this.rows)
    },
    async xuatvattu() {
      let check = false;
      this.rows.forEach((d) => {
        if (parseFloat(d.SLYC) + parseFloat(d.dacap) > parseFloat(d.SLSX)){
          check = true;
        }
      });
      if(check && this.isPass == "0"){
        return this.$q.dialog({
          title: "Lỗi",
          message: "Yêu cầu vượt quá kế hoạch sản xuất!",
        });
      }else{
        let capvt = [];
      this.rows.forEach((d) => {
        if (d.SLYC > 0) capvt.push(d);
      });
      this.dulieu = capvt;
      const payload = {
        number: this.number,
        solan: this.dulieu[0].soLan + 1,
        week: this.week,
        year: this.year,
        factoryId: this.idDepartment.factoryId,
        isPass: this.isPass,
        createBy: this.$store.state.base.userInfo.id,
        dataDelai: this.dulieu,

      };
      const data = await this.$store.dispatch("production/XUAT_VT", payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.$router.push("/bien-ban-phieu-cap-vat-tu");
      } else {
        showNotifyError();
      }
      }
    },
    async receipt() {
      if (
        this.myDepartment.value == 102487 ||
        this.myDepartment.value == 102495
      ) {
        const payload = {
          length: this.length,
          height: this.height,
          width: this.width,
          stepId: this.myDepartment.value,
          accountId: this.userInfo.id,
        };
        const data = await this.$store.dispatch(
          "production/UPDATE_GO_LUA_PHOI_BAO",
          payload
        );
        if (data.meta.success) {
          this.load();
        } else {
          showNotifyError();
        }
      } else {
        for (let i = 0; i < this.nhanGo.length; i++) {
          const payload = {
            xuatGoId: this.nhanGo[i].id,
            accountId: this.userInfo.id,
          };
          const data = await this.$store.dispatch(
            "production/UPDATE_GO_LUA_PHOI",
            payload
          );
          if (data.meta.success) {
            this.load();
          } else {
            showNotifyError();
          }
        }
      }
    },
    chonCongDoan() {
      this.load();
    },
    async load() {
      this.listNumber = [];

      const payload = {
        week: this.week,
        year: this.year,
        factoryId: this.idDepartment.factoryId,
      };

      const data = await this.$store.dispatch(
        "production/GET_HE_SO_LSX",
        payload
      );
      data.data.forEach((element) => {
        this.listNumber.push(element.number);
      });
    },
  },
};
</script>

<style>
.q-table--dense .q-table th{
  font-size: 8px;
  
}
.q-table--cell-separator thead th{
  background-color: #78909c !important;
  color: orange;
  font-family: 'Times New Roman', Times, serif;
}
.border-bt{
  border-bottom: 1px dashed #bdbdbd;
}
.p-5{
  padding: 5px;
}
</style>