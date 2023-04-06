<template>
  <q-page class="q-pa-md">
    <!-- <q-input class="col-2 q-mb-sm q-ml-sm" color="teal" outlined v-on:keyup="loadNumber" v-model="week" label="Tuần">
          <template v-slot:prepend>
            <q-icon name="event" />
          </template>
        </q-input> 
         <q-select class="col-2 q-mb-sm q-ml-sm" @input="getKHSX" outlined v-model="number" :options="listNumber" label="Lệnh sản xuất" /> -->

    <!-- <table
          class="tableprint"
          cellspacing="0"
          style="border-collapse:collapse; width:100%"
        >
          <tbody>
            <tr>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; height:21px; vertical-align:bottom; white-space:nowrap"
              >
               <b> SỔ TAY COC </b>
              </td>
              <td
                style="border-bottom:0px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; height:21px; vertical-align:bottom; white-space:nowrap"
              >
            
              </td>
            </tr>
            <tr>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
              >
               <b> PHIẾU CHỈ ĐỊNH XUẤT NGUYÊN LIỆU INDOOR</b>
              </td>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
              >
          
              </td>
            </tr>
            <tr>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:14px; vertical-align:bottom; white-space:nowrap"
              >
              
              </td>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:14px; vertical-align:bottom; white-space:nowrap"
              >
             
              </td>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
              >
             
              </td>
            </tr>
            <tr>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
              >
                <b>Trạng thái MT</b>: FSC100%&nbsp; &nbsp; &nbsp; &nbsp;
                &nbsp;Nhóm SP: W5
              </td>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
              >
                Mã lô gỗ nhập :&nbsp;
              </td>
            </tr>
             <tr>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
             <b>Loại gỗ: Acacia Mangium</b></td>
           <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
           </td>
        </tr>
          </tbody>
        </table>   -->
    <div class="row print-hide">
      <q-input
        class="col-2 q-ml-sm"
        @input="loadGrid"
        outlined
        v-model.number="year"
        type="number"
        label="Năm"
      />
      <q-input
        class="col-2 q-ml-sm"
        @input="loadGrid"
        outlined
        v-model.number="fromWeek"
        type="number"
        label="Từ tuần"
      />
      <q-input
        class="col-2 q-ml-sm"
        @input="loadGrid"
        outlined
        v-model.number="toWeek"
        type="number"
        label="Đến tuần"
      />
      <q-select
        class="col-2 q-ml-sm"
        @input="loadGrid"
        outlined
        v-model="idDepartment"
        :options="options"
        label="Chọn nhà máy"
      />

      <!-- <q-btn
            color="primary"
            icon="assignment_return"
           
            label="Xuất gỗ"
            @click="confirmphieu = true"
          /> -->
    </div>
    <div class="row">
      <q-checkbox
        v-if="listNumber.length > 0"
        @input="selectAll()"
        class="col-2 text-bold text-orange"
        v-model="allNumber"
        label="Chọn tất"
        color="orange"
      />
    </div>
    <div class="row">
      <q-checkbox
        @input="loadHistory"
        v-for="(num, index) in listNumber"
        :key="index"
        class="col-2"
        v-model="number"
        :val="num"
        :label="num"
        color="teal"
      />
    </div>
    <div class="top-title">
      <b> KHỐI LƯỢNG CẤP GỖ THỰC TẾ CHO XƯỞNG THEO LỆNH</b>
    </div>
    <q-card class="my-card">
      <!-- <table id="tableHead" width="100%">
            <thead class="w-100">
              <tr >
                  <td style="border-right-style: none">
                      <img style="margin:0px"
                          src="https://app.woodsland.com.vn:2002/img/logo.06aa324e.png"
                          alt="Graphic1"
                          width="100"
                          height="80"
                          data-cke-widget-upcasted="1"
                          data-cke-widget-keep-attr="0"
                          data-widget="image"
                          class="cke_widget_element p-2"
                        />
                  </td>
                <td colspan="3" class="text-center" style="border-left-style: none">
                    
                    <span class="p-2">SỔ TAY COC</span></td>
                <td  class="text-right" rowspan="2" colspan="2">
                  <pre>
                  BM-COC-16
                  Ngày BH: 29/9/2016
                  Lần BH: 03
                </pre
                  >
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  <strong>
                    PHIẾU CHỈ ĐỊNH XUẤT NGUYÊN VẬT LIỆU - INDOOR
                  </strong>
                </th>
              </tr>
              <tr></tr>
              <tr class="text-center">
                <td>Tuần SX</td>
                <th>{{week}}</th>
                <td>KHÁCH HÀNG</td>
                <td>IKEA</td>
                <td class="text-left">Số LSX</td>
                <td>{{number}}</td>
              </tr>
              <tr>
                <td colspan="4" class="text-center">
                  Nhà máy: <strong>Thuận Hưng</strong> Loại gỗ: Acacia Magium
                  Trạng thái MT: FSC 100%
                </td>
                <td>Tổng KL (m3)</td>
                <td class="text-right">{{formatnumber(tongKL)}}</td>
              </tr>
              <tr>
                <th colspan="6">KHỐI LƯỢNG PHÔI XUẤT THỰC TẾ TRONG TUẦN</th>
              </tr>
            </thead>
          </table> -->
    </q-card>

    <!-- <q-card-section>
        <div class="row">
          <div class="col-10 top-title">
            Phê duyệt hệ số cấp gỗ
          </div>
          <q-btn
            color="primary"
            icon="assignment_return"
            :disable="!showEdit"
            label="Tạo phiếu chỉ định"
            @click="confirmTrave = true"
          />
        
        </div>
       
      </q-card-section> -->
    <div class="row q-mt-md">
      <q-card class="my-card">
        <DxDataGrid
          :data-source="historys"
          :show-borders="true"
          :show-column-lines="true"
          :allow-column-reordering="true"
          :show-row-lines="true"
          :word-wrap-enabled="true"
          @row-updated="update"
          @row-removed="removed"
          @selection-changed="onSelectionChanged"
        >
          <DxEditing :allow-deleting="xoa1" :allow-updating="sua" mode="ppop" />
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Xuất gỗ'"
          />

          <!-- <DxSearchPanel
                :visible="true"
                :width="340"
                placeholder="Tìm kiếm"
            /> -->
          <DxHeaderFilter :visible="true" />
          <DxFilterRow :visible="false" />
          <DxScrolling mode="infinite" />

          <DxColumn
            data-field="tensp"
            caption="Chi tiết"
            width="350"
            css-class="mauBXG"
          />

          <DxColumn
            data-field="DAY"
            caption="Cao"
            width="80"
            css-class="mauBXG"
          />
          <DxColumn
            data-field="RONG"
            caption="Rộng"
            width="80"
            css-class="mauBXG"
          />
          <DxColumn
            data-field="DAI"
            caption="Dài"
            width="80"
            css-class="mauBXG"
          />
          />
          <DxColumn
            data-field="number"
            caption="Lệnh sản xuất"
            width="120"
            css-class="mauBXG"
          />

          <DxColumn
            data-field="HESO"
            caption="Hệ số"
            alignment="center"
            width="100"
            css-class="mauBXG"
          />

          <DxColumn
            data-field="capgo"
            caption="KL cấp"
            alignment="center"
            format="#,##0.####"
            width="100"
            css-class="mauBXG"
          />
          <DxColumn
            caption="SL cấp thực tế"
            data-field="SL_TH"
            format="#,##0.####"
            alignment="center"
            css-class="mauBXG"
          />
          <DxColumn
            caption="KL cấp thực tế"
            data-field="KLC_TH"
            format="#,##0.####"
            alignment="center"
            css-class="mauBXG"
          />
          <DxColumn
            caption="Thực hiện"
            data-field="TH"
            format="#,##0.## %"
            alignment="center"
            css-class="mauBXG"
            :calculate-cell-value="calculateDVT"
          />
          <DxColumn
            caption="Lựa đạt"
            data-field="luadat"
            alignment="center"
            css-class="mauBXG"
          >
            <DxLookup
              :data-source="dalua"
              display-expr="label"
              value-expr="id"
            />
          </DxColumn>
          <DxColumn
            caption="Công đoạn nhận"
            data-field="DESTINATION_ID"
            alignment="center"
            css-class="mauBXG"
          >
            <DxLookup
              :data-source="dongsanpham"
              display-expr="label"
              value-expr="id"
            />
          </DxColumn>

          <DxSummary>
            <DxTotalItem
              column="tensp"
              summary-type="count"
              value-format="fixedpoint"
              display-format="Tổng cộng : "
            />
            <DxTotalItem
              column="keHoach"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
            <DxTotalItem
              column="KLC_TH"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
          </DxSummary>
        </DxDataGrid>

        <q-dialog v-model="confirmphieu" persistent>
          <q-card style="min-width: 400px">
            <q-card-section class="row items-center">
              <div class="row">
                <div class="col-12 top-title">Xác nhận xuất gỗ</div>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Hủy" color="primary" v-close-popup />
              <q-btn
                flat
                label="Đồng ý"
                @click="xoa"
                color="primary"
                v-close-popup
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { DxNumberBox } from "devextreme-vue/number-box";
import SelectBox from "../../../components/commons/SelectBoxInt";
import SelectNcc from "../../../components/NLG/SelectBoxNcc";
import SelectNhomQuiCach from "../../../components/commons/SelectBoxInt";
import SelectThang from "../../../components/commons/SelectBoxInt";
import SelectNam from "../../../components/commons/SelectBoxInt";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
  roundNumber,
  getWeekNumber,
  showLoadingIos,
  closeLoading,
} from "../../../ultils";
import {
  showNotifySuccess,
  showNotifyError,
  showNotifyValidate,
  thangs,
  nams,
} from "../../../ultils";
import {
  DxDataGrid,
  DxGrouping,
  DxTotalItem,
  DxGroupPanel,
  DxSummary,
  DxGroupItem,
  DxEditing,
  DxExport,
  DxHeaderFilter,
  DxColumn,
  DxScrolling,
  DxFilterRow,
  DxSearchPanel,
  DxLookup,
} from "devextreme-vue/data-grid";
export default {
  components: {
    SelectNcc,
    SelectBox,
    SelectNhomQuiCach,
    DxNumberBox,
    DxTotalItem,
    SelectThang,
    SelectNam,
    DxEditing,
    DxDataGrid,
    DxGrouping,
    DxGroupPanel,
    DxSummary,
    DxGroupItem,
    DxExport,
    DxHeaderFilter,
    DxScrolling,
    DxFilterRow,
    DxSearchPanel,
    DxLookup,
    DxColumn,
  },
  data() {
    return {
      chuyen_slkh: 0,
      chuyen_nhomqc: null,
      chuyen_ncc: null,
      nhan_ncc: null,
      sua: false,
      xoa1: false,
      khconlai: 0,
      id: 0,
      listNumber: [],
      dalua: [
        {
          label: "Đã lựa",
          id: "daluadat",
        },
        {
          label: "Đã lựa không đạt",
          id: "daluakodat",
        },
        {
          label: "chưa lựa",
          id: "chualua",
        },
      ],
      dongsanpham: [
        {
          label: "1.Lựa phôi - X1 (TH)",
          id: 100264,
        },
        {
          label: "1.Lựa phôi - X3 (TH)",
          id: 100274,
        },
        {
          label: "2.Tổ Lựa phôi ghép (TB)",
          id: 102370,
        },
        {
          label: "2. Tổ Lựa phôi (TB)",
          id: 102809,
        },
        {
          label: "3.Tổ Sơ Chế (TB)",
          id: 102380,
        },
        {
          label: "3.Tổ sơ chế X5 (YS1)",
          id: 102355,
        },
        {
          label: "3.Tổ sơ chế X3 (YS1)",
          id: 102353,
        },
        {
          label: "2.Tổ Lựa phôi X3 mới (YS1)",
          id: 102789,
        },
        {
          label: "Tổ Runnen (YS1)",
          id: 102354,
        },
        {
          label: "2.Tổ lựa phôi X5 (YS1)",
          id: 102347,
        },
        {
          label: "4.Tổ tinh chế 3 (YS1)",
          id: 102530,
        },
      ],
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102299,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102299,
          code: "TB",
        },
      ],
      allNumber: false,
      mydsncc: [],
      chuyen_thang: null,
      chuyen_nam: null,
      dsNCC: [],
      dulieu: [],
      confirmTrave: false,
      confirmphieu: false,
      nhomquicachs: [],
      nhomkhos: [],
      ncc: null,
      tongKL: 0,
      fromWeek: "",
      toWeek: "",
      year: null,
      dupplicateNcc: [],
      nhomqc: null,
      nhomkho: null,
      slkh: 0,
      number: [],
      showEdit: false,
      dataTrave: [],
      fix: null,
      nhap_year: null,
      nhap_month: null,
      thangs: thangs,
      nams: nams,
      idDepartment: null,
      history_thang: null,
      history_nam: null,
      historys: [],
      congdoans: [],
      items: [],
      duyet: "",
      trangthai: [
        { code: null, name: "chưa duyệt" },
        { code: !null, name: "đã duyệt" },
      ],
      congdoan: null,
      item: null,
      sl: 0,
      chonkhochuyen: null,
      dataSource: [],
      showLeave: false,
      answer: false,
    };
  },
  created() {
    // if (
    //   this.$store.state.base.userInfo.id == 102050 ||
    //   this.$store.state.base.userInfo.id == 101676
    // )
    //   this.sua = true;
    // if (this.$store.state.base.userInfo.id == 102089) {
    //   this.xoa1 = true;
    // }
    const today = new Date();
    const currentMonth = today.getMonth();
    this.nhap_month = currentMonth + 1;
    this.chuyen_thang = this.nhap_month;
    this.history_thang = currentMonth + 1;
    const currentYear = today.getFullYear();
    this.year = currentYear;
    this.toWeek = getWeekNumber(today);
    this.fromWeek = getWeekNumber(today) - 3;
    this.nhap_year = currentYear;
    this.chuyen_nam = currentYear;
    this.history_nam = currentYear;
    Promise.all([this.loadGroupQuiCach(), this.loadItem()]);
    // console.log(this.$store.state.base.userInfo.account)
  },
  methods: {
    async addPlan() {
      if (this.nhomqc) {
        const payload = {
          groupCode: this.nhomqc,

          //  month:this.nhap_month,
          //  year:this.nhap_year,
          ITEM_ID: this.item.value,
          HESO: this.slkh,
          createBy: this.$store.state.base.userInfo.account,
        };
        const data = await this.$store.dispatch("nlg/ADD_HE_SO", payload);
        if (data.meta.success) {
          await this.loadHistory();
          showNotifySuccess();
          this.slkh = 0;
        } else {
          showNotifyError();
        }
      } else {
        showNotifyValidate();
      }
      this.loadHistory();
    },
    async removed(e) {
      console.log("remove", e);
      const payload = {
        id: e.data.id,
      };
      const data = await this.$store.dispatch(
        "nlg/DELETE_XUAT_GO_THE0_LSX",
        payload
      );
    },
    selectAll() {
      if (this.allNumber) {
        this.number = this.listNumber;
        this.loadHistory();
      } else {
        this.number = [];
        this.loadHistory();
      }
    },
    async loadHistory() {
      console.log("LSX:", this.number);
      if (!this.allNumber && this.number.length== 0) {
        this.historys = [];
      } else {
        const payload = {
          number: this.number,
        };
        const data = await this.$store.dispatch(
          "nlg/VIEW_XUAT_GO_THEP_LSX",
          payload
        );
        this.historys = data.data;
      }
    },
    calculateDVT(rowData) {
      if (rowData.DVT == "T         ")
        rowData.TH = rowData.SL_TH / rowData.capgo;
      else rowData.TH = rowData.KLC_TH / rowData.capgo;
      return rowData.TH;
    },
    async pheduyet() {
      const payload = {
        number: this.number,
        createBy: this.$store.state.base.userInfo.id,
      };
      const data = await this.$store.dispatch("nlg/PHE_DUYET_PHIEU", payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.loadHistory();
      } else {
        showNotifyError();
      }
    },
    async xoa() {
      let capgo = [];
      this.historys.forEach((d) => {
        if (d.TonTH > 0) capgo.push(d);
      });
      this.dulieu = capgo;
      console.log("dữ liệu:", this.dulieu);

      const payload = {
        number: this.number,
        week: this.week,
        year: this.year,
        factoryId: this.fa,
        createBy: this.$store.state.base.userInfo.id,
        dataDelai: this.dulieu,
      };
      const data = await this.$store.dispatch("nlg/XUAT_GOTH", payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.$router.push("/nlg-phieu-chi-dinh/");
      } else {
        showNotifyError();
      }
    },
    onSelectionChanged({ selectedRowsData }) {
      this.idSelect = selectedRowsData[0].ID;
      this.showEdit = true;
      this.dataTrave = selectedRowsData;
      console.log("nhóm:", this.dataTrave);
    },
    formatnumber(d) {
      return roundNumber(d, 4);
    },
    // async loadNhaCungCap(){
    //    const data = await this.$store.dispatch('nlg/GET_DS_NHA_CUNG_CAP')
    //         let converrtData = []
    //         data.data.forEach(element => {

    //            element.name2 =  element.name
    //             converrtData.push(element)
    //         })
    //         this.dsNCC = converrtData

    // },
    async del(e) {
      console.log("ID:", e.data.ID);
      const payload = {
        id: e.data.ID,
      };
      const data3 = await this.$store.dispatch("nlg/PUT_DINH_MUC_KHO", payload);
      if (data.meta.success) {
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
    async loadGrid() {
      this.listNumber = [];
      if (this.idDepartment.code == "TH") this.fa = 100000;
      if (this.idDepartment.code == "YS1A") this.fa = 100003;
      if (this.idDepartment.code == "YS1B") this.fa = 100004;
      if (this.idDepartment.code == "TB") this.fa = 100005;
      const payload = {
        toWeek: this.toWeek,
        fromWeek: this.fromWeek,
        year: this.year,
        factoryId: this.fa,
      };

      // let dataPivort = [];
      const data = await this.$store.dispatch("prod/GET_HE_SO_LSX_3", payload);
      data.data.forEach((element) => {
        this.listNumber.push(element.number);
      });
    },

    async update(e) {
      console.log(e.data);
      const payload = {
        ID: e.data.id,
        SL_TH: e.data.SL_TH,
        KLC_TH: roundNumber(
          (e.data.SL_TH * e.data.DAY * e.data.DAI * e.data.RONG) / 1000000000,
          4
        ),
        luadat: e.data.luadat,

        DESTINATION_ID: e.data.DESTINATION_ID,
      };
      const data = await this.$store.dispatch(
        "nlg/UPDATE__XUAT_GO_THEP_LSX",
        payload
      );
      // console.log(e)
      if (data.meta.success) {
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
    async loadGroupQuiCach() {
      const duppp = [];
      const data = await this.$store.dispatch("nlg/GET_GROUP_QUI_CACH");
      data.data.forEach((e) => {
        duppp.push({
          // text: e.name,
          value: (e.name4 = e.name),
        });
      });
      this.dupplicateNcc = duppp;

      this.nhomquicachs = data.data;
    },
    //     async loadkho(){
    //        const duppp = []
    //          const data = await this.$store.dispatch("production/ACTION_FETCH_ITEMS", {
    //     factoryId: 100000,
    //   });
    //         data.forEach(e=>{
    //             this.nhomkhos.push({
    //                 value: e.name3 = e.name,

    //             })
    //         })

    //     },
    async loadItem() {
      const data = await this.$store.dispatch("production/ACTION_FETCH_ITEMS", {
        factoryId: 100000,
      });
      data.forEach((d) => {
        const itemNameConvert = `[${d.code}] ${d.name} (${d.height}*${d.width}*${d.length})`;
        this.items.push({
          label: itemNameConvert,
          value: d.id,
          unit: d.unit,
        });
      });
      this.itemDupplicate = this.items;
    },
    searchItem(val, update) {
      let itemDupplicate = [];
      if (val === "") {
        update(() => {
          this.items = this.itemDupplicate;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.items = this.itemDupplicate.filter((v) => {
          const quicach = v.label.toString().toLowerCase();
          if (quicach.indexOf(needle) > -1) {
            return v;
          }
        });
      });
    },
    chonNhomQuiCach(e) {
      this.nhomqc = e.value;
    },
    chonNhomkho(e) {
      this.chonkho = e.value;
    },
    changeslkh(e) {
      this.slkh = e.value;
    },
    changesfix(e) {
      this.fix = e.value;
    },
    chonNam(e) {
      this.nhap_year = e.value;
    },
    chonThang(e) {
      this.nhap_month = e.value;
    },

    // chonNamHistory(e){
    //     this.history_nam = e.value
    //     this.loadHistory()
    // },
    // chonThangHistory(e){
    //     this.history_thang = e.value
    //     this.loadHistory()
    // },
  },
};
</script>


<style  type="text/css">
#tableHead tr,
th,
td {
  border: 2px solid black;
}
table {
  border-collapse: collapse;
  table-layout: fixed;
}
thead {
  width: 100%;
}
.mauBXG {
  border: 1px solid !important;
  border-top: 1px solid black !important;
  background-color: white;
  color: black;
}
.dx-command-expand {
  background: white;

  font-weight: 900;
  width: 280;
  font-family: Arial, Helvetica, sans-serif;
}
.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: black;
  background-color: #f7f7f7;

  font-weight: 900;
  width: 280;
}
</style>