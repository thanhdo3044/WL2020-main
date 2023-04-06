<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-12 col-sm-4 q-pa-md">
        <q-card class="my-card">
          <q-card-section>
            <q-btn
              color="primary"
              label="Nhập kế hoạch tuần"
              @click="
                (showAddKHT = true), (showAddCKH = false), (showAddKH = false)
              "
            />
            <!-- <span @click="view()" class="fake-link" style="color: red">
                         Bấm vào nhập kế hoạch tuần
                       </span> -->
          </q-card-section>

          <q-card-section v-show="showAddKHT">
            <div class="form">
              <div class="row">
                <div class="col-12">
                  <q-input
                    color="grey-3"
                    label-color="orange"
                    outlined
                    v-model="ngaynhapkho"
                    mask="date"
                    :rules="['date']"
                    label="Ngày trong tuần"
                    dense
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="ngaynhapkho"
                            @input="() => $refs.qDateProxy.hide()"
                            mask="YYYY-MM-DD"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-input
                    color="grey-3"
                    label-color="orange"
                    outlined
                    disable
                    :value="ngaynhapkho ? moment(ngaynhapkho).format('w') : ''"
                    label="Tuần"
                    dense
                  >
                    <template v-slot:append>
                      <q-icon name="next_week" color="orange" />
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="dx-fieldset">
                <SelectBox
                  :searchColumn="'name4'"
                  :displayColumn="'name4'"
                  :dataSource="nhomquicachs"
                  :onChange="chonNhomQuiCachtuan"
                  :title="'Chọn nhóm quy cách'"
                  :defaultValue="nhomqc"
                />
                <SelectNcc
                  :searchColumn="'name2'"
                  :displayColumn="'name2'"
                  :dataSource="dsNCC"
                  :onChange="chonNcctuan"
                  :title="'Chọn nha NCC:'"
                />

                <div class="dx-field">
                  <div class="dx-field-label">Số lượng kế hoạch</div>
                  <div class="dx-field-value">
                    <DxNumberBox
                      :value="slkhtuan"
                      :show-spin-buttons="true"
                      :show-clear-button="true"
                      @value-changed="changeslkhtuan"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-12" align="right">
                    <q-btn
                      color="primary"
                      label="Nhập kế hoạch tuần"
                      @click="addPlan1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4 q-pa-md">
        <q-card class="my-card">
          <q-card-section>
            <q-btn
              color="primary"
              label=" Nhập kế hoạch nhập gỗ theo tháng"
              @click="
                (showAddKH = true), (showAddCKH = false), (showAddKHT = false)
              "
            />
            <!-- <div class="top-title">
                          Nhập kế hoạch nhập gỗ theo tháng
                      </div> -->
          </q-card-section>
          <!-- <q-separator spaced    /> -->
          <q-card-section v-show="showAddKH">
            <div class="form">
              <div class="row">
                <div class="col-12">
                  <SelectThang
                    :dataSource="thangs"
                    :onChange="chonThang"
                    :title="'Chọn Tháng'"
                    :defaultValue="nhap_month"
                  />
                  <SelectThang
                    :dataSource="nams"
                    :onChange="chonNam"
                    :title="'Chọn Năm'"
                    :defaultValue="nhap_year"
                  />
                </div>
              </div>
              <div class="dx-fieldset">
                <SelectBox
                  :searchColumn="'name4'"
                  :displayColumn="'name4'"
                  :dataSource="nhomquicachs"
                  :onChange="chonNhomQuiCach"
                  :title="'Chọn nhóm quy cách'"
                  :defaultValue="nhomqc"
                />
                <SelectBox :searchColumn="'name3'" :displayColumn="'name3'" :dataSource="nhomkhos" :onChange="chonNhomkho"
                             :title="'Chọn nhà Kho'" :valueExp="'makho'" />
                <SelectNcc
                  :searchColumn="'name2'"
                  :displayColumn="'name2'"
                  :dataSource="dsNCC2"
                  :onChange="chonNcc"
                  :title="'Chọn nha NCC:'"
                />
                <div class="dx-field">
                  <div class="dx-field-label">Số lượng kế hoạch</div>
                  <div class="dx-field-value">
                    <DxNumberBox
                      :value="slkh"
                      :show-spin-buttons="true"
                      :show-clear-button="true"
                      @value-changed="changeslkh"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-12" align="right">
                    <q-btn
                      color="primary"
                      label="Nhập kế hoạch tháng"
                      @click="addPlan"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div v-show="chuyenKH" class="col-12 col-sm-4 q-pa-md">
        <q-card class="my-card">
          <q-card-section>
            <q-btn
              color="primary"
              label=" Chuyển kế hoạch"
              @click="
                (showAddCKH = true), (showAddKH = false), (showAddKHT = false)
              "
            />
            <!-- <div class="top-title">Chuyển kế hoạch</div> -->
          </q-card-section>
          <q-card-section v-show="showAddCKH">
            <div class="row">
              <div class="col-12 q-pa-sm">
                <DateBoxNgayNhapKho
                  :ngaynhapkho="ngaynhapkho"
                  :onChange="eventChangeNgayNhapKho"
                />
              </div>
              <div class="col-12 q-pa-sm">
                <SelectThang
                  :dataSource="thangs"
                  :onChange="chonThangChuyen"
                  :title="'Chọn Tháng'"
                  :defaultValue="chuyen_thang"
                />
              </div>
              <div class="col-12 q-pa-sm">
                <SelectThang
                  :dataSource="nams"
                  :onChange="chonNamChuyen"
                  :title="'Chọn Năm'"
                  :defaultValue="chuyen_nam"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <SelectNhomQuiCach
                  :searchColumn="'name4'"
                  :displayColumn="'name4'"
                  :dataSource="nhomquicachs"
                  :onChange="chonNhomQuiCachChuyen"
                  :title="'Chọn Quy cách'"
                />
                <SelectNcc
                  :dataSource="dsNCC2"
                  :onChange="chonNCCChuyen"
                  :title="'Chọn nhà cung cấp chuyển'"
                />
                <SelectNcc
                  :dataSource="dsNCC2"
                  :onChange="chonNCCNhan"
                  :title="'Chọn nhà cung cấp nhận'"
                />
                <div class="dx-field">
                  <div class="dx-field-label">Số lượng kế hoạch chuyển</div>
                  <div class="dx-field-value">
                    <DxNumberBox
                      :value="chuyen_slkh"
                      :show-spin-buttons="true"
                      :show-clear-button="true"
                      @value-changed="chuyen_changeslkh"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-12" align="right">
                <q-btn
                  color="primary"
                  label="chuyển kế hoạch"
             
                  @click="changePlan"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-mt-md">
      <q-card class="my-card">
        <q-card-section>
          <div class="top-title">Lịch sử nhập Kế hoạch tháng</div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-6 q-pa-md">
              <SelectThang
                :dataSource="thangs"
                :onChange="chonThangHistory"
                :title="'Chọn Tháng'"
                :defaultValue="history_thang"
              />
            </div>
            <div class="col-6 q-pa-md">
              <SelectThang
                :dataSource="nams"
                :onChange="chonNamHistory"
                :title="'Chọn Năm'"
                :defaultValue="history_nam"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <DxDataGrid
            :data-source="historys"
            :show-borders="true"
            :show-column-lines="true"
            :allow-column-resizing="true"
          >
            <DxExport
              :enabled="true"
              :allow-export-selected-data="false"
              :file-name="'Lịch sử nhập kế hoạch tháng'"
            />

            <DxSearchPanel
              :visible="true"
              :width="340"
              placeholder="Tìm kiếm"
            />
            <DxHeaderFilter :visible="true" />
            <DxFilterRow :visible="false" />

            <DxGroupPanel :visible="true" />
            <DxGrouping :auto-expand-all="true" />
            <DxColumn
              data-field="NAME"
              caption="Tên nhà cung cấp"
              :group-index="0"
            >
            </DxColumn>
            <DxColumn data-field="NHOM" caption="Nhóm Qui Cách"> </DxColumn>
            <DxColumn data-field="PLANQTY" caption="Khối lượng" />
            <DxSummary>
              <DxGroupItem
                :show-in-group-footer="false"
                :align-by-column="true"
                column="PLANQTY"
                summary-type="sum"
                value-format="#,##0.####"
                display-format="{0} m³"
              />

              <DxTotalItem
                column="PLANQTY"
                summary-type="sum"
                value-format="###0.####"
                display-format="{0}"
              />
            </DxSummary>
          </DxDataGrid>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import { DxNumberBox } from "devextreme-vue/number-box";
import SelectBox from "../../../components/commons/SelectBoxInt";
import SelectNcc from "../../../components/NLG/SelectBoxNcc";
import SelectNhomQuiCach from "../../../components/commons/SelectBoxInt";
import SelectThang from "../../../components/commons/SelectBoxInt";
import SelectNam from "../../../components/commons/SelectBoxInt";
import DateBoxNgayNhapKho from "../../../components/NLG/DateBoxNgayNhapKho";
import {
  formatDateISO,
  showNotifySuccess,
  showNotifyError,
  showNotifyValidate,
  thangs,
  nams,
} from "../../../ultils";
import {
  DxDataGrid,
  DxGrouping,
  DxGroupPanel,
  DxSummary,
  DxGroupItem,
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
    SelectThang,
    SelectNam,
    DateBoxNgayNhapKho,
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
      ngaynhapkho: new Date(),
      chuyen_slkh: 0,
      chuyen_nhomqc: null,
      chuyen_ncc: null,
      nhan_ncc: null,
      chuyenKH: false,
      khconlai: 0,
      id: 0,
    
      mydsncc: [],
      chuyen_thang: null,
      chuyen_nam: null,
      dsNCC: [],
      dsNCC2: [],
      nhomquicachs: [],
      nhomkhos: [
        {id:100010,makho:"TB",name3:"Nhà máy CBG Thái Bình"},
        {id:100002,makho:"TH",name3:"Nhà máy Thuận Hưng"},
        {id:100005,makho:"YS1",name3:"Nhà máy CBG Yên Sơn 1"},
      ],
      ncc: null,
      dupplicateNcc: [],
      nhomqc: null,
      nhomkho: null,
      slkh: 0,

      f_ngaynhapkho: "",
      Tongklthuchien: 0,
      slkhtuan: 0,
      showAddKH: false,
      showAddCKH: false,
      showAddKHT: false,
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      isApprove: false,
      isReject: false,
      khoiluongnhom: 0,
      kltungkho: 0,
      klkho: 0,
      nhap_year: null,
      nhap_month: null,
      thangs: thangs,
      nams: nams,
      history_thang: null,
      history_nam: null,
      historys: [],
      tongkho: "",
      congdoans: [],
      items: [],
      congdoan: null,
      item: null,
      staff: null,
      staffc: null,
      sl: 0,
      chonkho: null,
      chonkhochuyen: null,
      dataSource: [],
      showLeave: false,

      answer: false,
    };
  },
    computed: {
    ...mapGetters("base", ["userInfo"]),
  
  },
  created() {
    // if (
    //   this.$store.state.base.userInfo.account == "18T0135" ||
    //   this.$store.state.base.userInfo.account == "ADMIN" ||
    //   this.$store.state.base.userInfo.account == "14T1005"
    // )
    // if (this.isInsert == true)
    //   this.chuyenKH = true;
    this.loadPermission();
    const today = new Date();
    const currentMonth = today.getMonth();
    this.nhap_month = currentMonth + 1;
    this.f_ngaynhapkho = this.ngaynhapkho;
    console.log("ngay nhap kho:", this.ngaynhapkho);
    this.week = today ? moment(today).format("w") : "";
    this.chuyen_thang = this.nhap_month;
    this.history_thang = currentMonth + 1;
    const currentYear = today.getFullYear();
    this.nhap_year = currentYear;
    this.chuyen_nam = currentYear;
    this.history_nam = currentYear;
    Promise.all([
      this.loadNhaCungCap(),
      this.loadGroupQuiCach(),
      this.loadHistory(),
      this.loadkho(),
      
    ]);

  },
  methods: {
    ...mapActions("prod", ["getPermissionInScreen"]),
    async changePlan() {
      this.klkho = 0;
      this.Tongklthuchien = 0;
      for (let i = 0; i < this.historys.length; i++) {
        if (
          this.chuyen_ncc == this.historys[i].mancc &&
          this.chuyen_nhomqc == this.historys[i].GROUP_CODE
        ) {
          this.klkho += this.historys[i].PLANQTY;
          this.chonkhochuyen = this.historys[i].KHO;
          //this.khconlai = this.historys[i].PLANQTY - this.chuyen_slkh;
          // this.id = this.historys[i].ID
          //this.chonkhochuyen  = this.historys[i].KHO
          // console.log(this.chonkhochuyen)
        }
      }
      const data1 = await this.$store.dispatch("nlg/GET_NHAP_THANG", {
        guid: this.chuyen_ncc,
        nhom: this.chuyen_nhomqc,
        thang: this.chuyen_thang,
        nam: this.chuyen_nam,
      });
      this.Tongklthuchien = data1.data[0].KLT;
      // console.log('khối lượng TH:',this.Tongklthuchien)
      // console.log('khối lượng kho:',this.klkho)
      // console.log('khối lượng kho chuyển:',this.chuyen_slkh)
      this.khconlai = this.klkho - this.chuyen_slkh - this.Tongklthuchien;

      if (this.khconlai >= 0) {
        if (
          this.chuyen_slkh >= 0 &&
          this.chuyen_ncc &&
          this.chuyen_nhomqc &&
          this.nhan_ncc &&
          this.chonkhochuyen
        ) {
          console.log(this.chonkhochuyen);
          const payload = {
            kho: this.chonkhochuyen,
            // mancc_old:this.chuyen_ncc,
            mancc: this.nhan_ncc,
            groupCode: this.chuyen_nhomqc,
            quantity: this.chuyen_slkh,
            createDate: formatDateISO(this.f_ngaynhapkho),
            createBy: this.staff,
            delFlag: "N",
          };
          const data = await this.$store.dispatch("nlg/ADD_PLAN", payload);
          if (data.meta.success) {
            this.updatePlan();
            await this.loadHistory();
            showNotifySuccess();
            this.chuyen_slkh = 0;
          } else {
            showNotifyError();
          }
        } else {
          showNotifyError(
            "Chưa nhập đủ thông tin hoặc nhóm QC không có trong KH"
          );
        }
      } else {
        this.$q.dialog({
          html: true,
          title: "Nhập kế hoạch",
          message: "Bạn đã nhập quá khối lượng kế hoạch chuyển: ",
        });
      }
    },
    async loadPermission() {
  
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.getPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((el) => {
        if (el.CODE == "approve") {
          this.isApprove = true;
        }
        if (el.CODE == "reject") {
          this.isReject = true;
        }
        if (el.CODE == "insert") {
          this.isInsert = true;
          this.chuyenKH = true;
        } 
        if (el.CODE == "update") {
          this.isUpdate = true;
        }
        if (el.CODE == "delete") {
          this.isDelete = true;
        }
      });
    },
    async updatePlan() {
      // if (this.chuyen_slkh>0&&this.chuyen_ncc&&this.chuyen_nhomqc&&this.nhan_ncc) {

      //     console.log(this.historys[0].mancc)
      //     console.log(this.historys[0].ID)
      //    console.log(this.historys[0].GROUP_CODE[1])
      // console.log(this.historys[0].PLANQTY)
      // console.log(this.chuyen_nhomqc)
      const payload = {
        kho: this.chonkhochuyen,
        mancc: this.chuyen_ncc,
        groupCode: this.chuyen_nhomqc,
        quantity: -this.chuyen_slkh,
        createDate: formatDateISO(this.f_ngaynhapkho),
        createBy: this.staffc,
        delFlag: "N",
      };
      const data = await this.$store.dispatch("nlg/ADD_PLAN", payload);
      if (data.meta.success) {
        await this.loadHistory();
        showNotifySuccess();
        this.chuyen_slkh = 0;
      } else {
        showNotifyError();
      }
    },
    //  view(guid){
    //   this.$router.push('/nlg-nhap-ke-hoach-tuan/')
    //    //window.open(routeData.href, '_blank');
    // },
    async addPlan1() {
      console.log("nhập tuàn:", this.nhomqctuan);
      if (this.nhomqctuan) {
        const payload = {
          mancc: this.ncctuan,
          groupCode: this.nhomqctuan,
          // kho: this.chonkho.trim(),
          //  month:this.nhap_month,
          //  year:this.nhap_year,
          quantity: this.slkhtuan,
          createDate: formatDateISO(this.ngaynhapkho),
          createBy: this.$store.state.base.userInfo.account,
        };
        const data = await this.$store.dispatch(
          "nlg/ADD_KE_HOACH_TUAN",
          payload
        );
        if (data.meta.success) {
          // await this.loadHistory()
          showNotifySuccess();
          this.slkhtuan = 0;
        } else {
          showNotifyError();
        }
      } else {
        showNotifyValidate();
      }
    },
    async addPlan() {
      const data2 = await this.$store.dispatch("nlg/GET_TONG_DINH_MUC_KHOQC", {
        nhom: this.nhomqc,
      });
      this.kltungkho = data2.data[0].KLTUNGKHO;
      const data1 = await this.$store.dispatch("nlg/GET_NCC_THANG3", {
        nhom: this.nhomqc,
      });
      this.khoiluongnhom = data1.data[0].KLNHOM;
      console.log(this.kltungkho);
      console.log(this.khoiluongnhom);
      if (this.khoiluongnhom + this.slkh > this.kltungkho) {
        this.$q.dialog({
          html: true,
          title: "Nhập kế hoạch",
          message: "Bạn đã nhập quá KH tổng: ",
        });
      } else {
        if (
          this.nhap_year &&
          this.nhap_month &&
          this.slkh >= 0 &&
          this.ncc &&
          this.nhomqc &&
          this.chonkho
        ) {
          const payload = {
            mancc: this.ncc,
            groupCode: this.nhomqc,
            kho: this.chonkho,
            //  month:this.nhap_month,
            //  year:this.nhap_year,
            quantity: this.slkh,
            createBy: this.staffc,
            delFlag: "N",
          };
          const data = await this.$store.dispatch("nlg/ADD_PLAN", payload);
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
      }
    },
    async loadHistory() {
      const data = await this.$store.dispatch("nlg/GET_PLAN_BY_USER", {
        thang: this.history_thang,
      });

      this.historys = data.data;
    },
    async loadNhaCungCap() {
      const data = await this.$store.dispatch("nlg/GET_DS_NHA_CUNG_CAP");
      console.log("NCC:", data.data);
      let converrtData = [];
      let converrtData1 = [];
      data.data.forEach((element) => {
        element.name2 = element.name;
        converrtData1.push(element);
        if (element.staff == this.$store.state.base.userInfo.account) {
          converrtData.push(element);
        }
      });
      this.dsNCC = converrtData;
      this.dsNCC2 = converrtData1;
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
    async loadkho() {
      const duppp = [];
      const data = await this.$store.dispatch("nlg/GET_DS_KHO");
      data.data.forEach((e) => {
        duppp.push({
          text: (e.name3 = e.tenkho),
          value: e.makho,
        });
      });
      this.dupplicateNcc = duppp;

     // this.nhomkhos = data.data;
    },
    async loadkhotong() {
      const data = await this.$store.dispatch("nlg/GET_TONG_DINH_MUC_KHOQC1", {
        nhom: this.nhomqc,
      });
      this.tongkho = data.data;
      console.log("kho tong:", this.tongkho);
      this.chonkho = null;
      this.khoth = 0;
      this.khoys1 = 0;
      this.khotb = 0;
      // for (let i = 0; i < this.tongkho.length; i++) {
      //   if (this.tongkho[i].MAKHO.trim() == "TH") this.khoth = 1;
      //   if (this.tongkho[i].MAKHO.trim() == "YS1") this.khoys1 = 1;
      //   if (this.tongkho[i].MAKHO.trim() == "TB") this.khotb = 1;
      // }
      // console.log("kho TH:", this.khoth);
      // if (this.khoth == 1) this.chonkho = "TH";
      // if (this.khoys1 == 1) this.chonkho = "YS1";
      // if (this.khotb == 1) this.chonkho = "TB";

      // if (this.khoth == 1 && this.khoys1 == 1) this.chonkho = "TH_YS1";
      // if (this.khoth == 1 && this.khotb == 1) this.chonkho = "TH_TB";
      // if (this.khoys1 == 1 && this.khotb == 1) this.chonkho = "TB_YS1";
      // if (this.khoth == 1 && this.khoys1 == 1 && this.khotb == 1)
      //   this.chonkho = "TH_TB_YS1";
     // console.log("kho tong:", this.chonkho);
    },
    chonNcc(e) {
      this.staffc = this.dsNCC2.find((q) => {
        return q.code === e.value;
      }).staff;
      this.ncc = e.value;
    },
    chonNhomQuiCach(e) {
      this.nhomqc = e.value;
      this.loadkhotong().then(() => {
        if (this.tongkho.length == 0) {
          this.$q.dialog({
            html: true,
            title: "Nhập kế hoạch",
            message: "Quy cách không có trong kế hoạch: ",
          });
        }
      });
    },
    chonNhomkho(e){

        this.chonkho = e.value
    },
    chonNhomQuiCachtuan(e) {
      this.nhomqctuan = e.value;
    },
    chonNcctuan(e) {
      this.ncctuan = e.value;
    },
    chonNam(e) {
      this.nhap_year = e.value;
    },
    chonThang(e) {
      this.nhap_month = e.value;
    },
    chonNamChuyen(e) {
      this.chuyen_nam = e.value;
    },
    chonThangChuyen(e) {
      this.chuyen_thang = e.value;
    },
    chonNamHistory(e) {
      this.history_nam = e.value;
      this.loadHistory();
    },
    chonThangHistory(e) {
      this.history_thang = e.value;

      this.loadHistory();
    },
    changeslkh(e) {
      this.slkh = e.value;
    },
    changeslkhtuan(e) {
      this.slkhtuan = e.value;
    },
    chonNhomQuiCachChuyen(e) {
      this.chuyen_nhomqc = e.value;
    },
    chonNCCChuyen(e) {
      this.staffc = this.dsNCC2.find((q) => {
        return q.code === e.value;
      }).staff;
      this.chuyen_ncc = e.value;
    },
    eventChangeNgayNhapKho(e) {
      console.log(e);
      this.f_ngaynhapkho = e.value;
      console.log("ngay nhap KH:", this.f_ngaynhapkho);
    },
    chonNCCNhan(e) {
      console.log("NCC:", e);
      this.staff = this.dsNCC2.find((q) => {
        return q.code === e.value;
      }).staff;
      this.nhan_ncc = e.value;
    },
    chuyen_changeslkh(e) {
      this.chuyen_slkh = e.value;
    },
  },
};
</script>

<style>
</style>