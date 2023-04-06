<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-10 top-title">
            Danh sách phiếu nhập kho
          </div>
          <div class="col-2" align="right">
            <q-btn
              v-if="showAddPhieu"
              color="green"
              label="Lưu lại"
              @click="showConfirm = true"
            />
            <q-btn
              v-else
              color="primary"
              label="Thêm phiếu"
              @click="showAddPhieu = true"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section v-show="showAddPhieu">
        <div class="widget-container">
          <DateBoxNgayNhapKho
            :ngaynhapkho="ngaynhapkho"
            :onChange="eventChangeNgayNhapKho"
          />
          <div class="dx-field">
            <div class="dx-field-label">Mã phiếu</div>
            <div class="dx-field-value">
              <DxTextBox :value="maphieu" @value-changed="chonmaphieu" />
            </div>
          </div>
          <!-- <SelectBoxKho :dsKho="dskho" :onChange="eventChonKho"/> -->
          <SelectBoxNCC
            :id="name"
            :dataSource="dsNcc"
            :title="'Chọn nha NCC:'"
            :onChange="eventChonNcc"
          />
          <SelectBoxXeNang
            :dataSource="xuongxenang"
            :title="'Xuống xe nâng :'"
            :onChange="eventChonXenang"
            :defaultValue="xuongxenang[0].id"
          />
          <div class="dx-field">
            <div class="dx-field-label">Biển số xe</div>
            <div class="dx-field-value">
              <DxTextBox :value="bsx" @value-changed="handleValueChange" />
            </div>
          </div>
        </div>
        <div class="dx-field">
            <div class="dx-field-label">Mã lô gỗ</div>
            <div class="dx-field-value">
              <DxTextBox :value="wood_label" @value-changed="woodValueChange" />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12">
            <DxDataGrid
              :data-source="dataSource"
              :show-borders="true"
              :no-data-text="'Không có dữ liệu !'"
              :show-column-lines="true"
              :show-row-lines="true"
              :allow-column-resizing="true"
              @row-updated="update"
            >
               <DxEditing 
        :allow-updating="true"
       />
              <DxExport
                :enabled="true"
                :allow-export-selected-data="false"
                :file-name="'Báo cáo sản xuất từ ngày '"
              />
              <DxHeaderFilter :visible="true" />
              <DxGroupPanel
                :visible="true"
                :empty-panel-text="
                  'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'
                "
              />
              <DxGrouping :auto-expand-all="true" />
              <DxSearchPanel
                :visible="true"
                :placeholder="'Tìm kiếm'"
                :width="400"
              />
              <DxColumn data-field="sophieu" caption="Số phiếu"  width="150" />
                <DxColumn data-field="createDate" caption="ngày nhập" 
                 alignment="center"
                  width="150"
                  data-type="date"
                  format="dd/MM/yyyy"/>
                 <DxColumn data-field="BIENSOXE" caption="Biển số xe" width="150" />
               <DxColumn data-field="MALOGONHAP" caption="Mã lô gỗ" width="150" />
              <DxColumn data-field="name" caption="Tên Nhà cung cấp" width="350"  />
             
            
              <!-- <DxColumn
                data-field="xuongxenang"
                caption=""
                cell-template="xenang-template"
              /> -->
              <DxColumn caption="..." cell-template="edit-template" width="150" />
              <template #edit-template="cell">
                <div>
                  <span
                   
                    @click="goAdd(cell.data.data.sophieu)"
                    class="fake-link"
                    >Sửa chi tiết</span
                  >

                  <!-- <span
                    v-else
                    @click="view(cell.data.data.sophieu)"
                    class="fake-link"
                    >Xem</span
                  > -->
                  <!-- <q-btn flat v-if="cell.data.data.TINHTIEN.toString().trim()==='N'" color="primary" label="Nhập kho" @click="goAdd(cell.data.data.GUID)" />
                    <q-btn flat color="info" out icon="remove_red_eye"  label="Xem" @click="view(cell.data.data.GUID)" /> -->
                </div>
              </template>
              <template #xenang-template="cell">
                <div v-if="cell.data.value.toString().trim() === 'Y'">
                  Xe nâng
                </div>
                <div v-else>Xuống bằng tay</div>
              </template>
            </DxDataGrid>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="showConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="row top-title">
            Bạn đã chắc chắn !
          </div>
        </q-card-section>
        <q-card-section> </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="save"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import SelectBoxNCC from "../../../components/NLG/SelectBoxNcc";
import SelectBoxKho from "../../../components/NLG/SelectBoxKho";
import DateBoxNgayNhapKho from "../../../components/NLG/DateBoxNgayNhapKho";
import SelectBoxXeNang from "../../../components/commons/SelectBox";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxEditing,
  DxPaging,
  DxSearchPanel,
  DxExport,
  DxHeaderFilter,
  DxSummary,
  DxGroupItem
} from "devextreme-vue/data-grid";
import { mapGetters, mapActions } from "vuex";
import { DxTextBox } from "devextreme-vue";
import {
  formatDateISO,
  showNotifyError,
  showNotifySuccess
} from "../../../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxEditing,
    DxExport,
    DxHeaderFilter,
    DxSummary,
    DxGroupItem,
    SelectBoxNCC,
    SelectBoxKho,
    DateBoxNgayNhapKho,
    SelectBoxXeNang,
    DxTextBox
  },
  data() {
    return {
      dataSource: [],
      taophieu: [],
      phieu: 0,
      departments: [],
      showAddPhieu: false,
      kho: null,
      dskho: [],
      today: "2020/04/03",
      dsNcc: [],
      ncc: null,
      maphieu: 0,
      bsx: "",
      today: new Date(),
      //XUONGXENANG:'',
      dupplicateNcc: [],
      ngaynhapkho: new Date(),
      xuongxenang: [
        { id: "N", name: "Xưởng xuống tay" },
        { id: "Y", name: "Xuống xe nâng" }
      ],
      BIENSOXE: "",
      showConfirm: false,
      f_ngaynhapkho: "",
      f_kho: null,
      f_ncc: null,
      f_xuongxenang: null,
      f_bsx: "",
       f_label:"",
      f_maphieu: ""
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"])
  },
  created() {
    //   this.dskho = this.$store.getters['base/myKhoCBG']
    this.f_ngaynhapkho = this.ngaynhapkho;
    this.f_xuongxenang = this.xuongxenang[0].id;
    this.loadDepartment().then(() => {
    this.load();
    
    // this.taophieu()
    this.loadNhaCungCap();
    this.loadkho();
    });
    //console.log(this.userInfo)
    //console.log('phòng ban:',this.departments[0].name)
  },
  methods: {
    async save() {
      let cYear = new Date().getFullYear();
      let cmonth = new Date().getMonth();
     
      // if (this.userInfo.account == "15Q060") this.f_kho = "YS1";
      // if (this.userInfo.account == "15Q028") this.f_kho = "TB";
      // if (this.userInfo.account == "12T0106") this.f_kho = "TH";

      if (this.f_ncc) {
        const payload = {
          BIENSOXE: this.f_bsx,
            MALOGONHAP: this.f_label,
          sophieu:
            cYear +
            "." +
            this.f_maphieu +
            "/" +
            (parseInt(cmonth) + 1) +
            this.f_kho,
          XUONGXENANG: this.f_xuongxenang,
          ALLOWTINHTIEN: "Y",
          ALLOWHACAP: "Y",
          NHOMSP: "W5",
          createBy: this.userInfo.account,
          createDate: formatDateISO(this.f_ngaynhapkho),
          makho: this.f_kho,
          MANCC: this.f_ncc
        };
        const data = await this.$store.dispatch("nlg/TAO_PHIEU", payload);

        const guid = data.data.sophieu;
        // showNotifySuccess('Tạo phiếu thành công số phiếu :'+phieunhap.NUM+'/'+phieunhap.MONTH)
        this.$router.push({
          path: "/nlg-phieu-nhap-kho",
          query: { guid: guid.replace("/", "-") }
        });
      } else {
        showNotifyError("Vui điền đầy đủ thông tin !");
      }
    },
        async update(e){
            console.log('ID:',e.data.id)
            const data = await this.$store.dispatch('nlg/UPDATE_PHIEU_NHAP_KHO2',e.data)
            // console.log(e)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
    async load() {
     console.log('kho:',this.f_kho)
      // if (this.userInfo.account == "15Q060") this.f_kho = "YS1";
      // if (this.userInfo.account == "15Q028") this.f_kho = "TB";
      // if (this.userInfo.account == "12T0106") this.f_kho = "TH";

      const data = await this.$store.dispatch("nlg/GET_DS_PHIEU_NHAP_KHO2", {
        kho: this.f_kho
      });
      this.dataSource = data.data;
      const data2 = await this.$store.dispatch("nlg/GET_DS_PHIEU_NHAP_KHO4", {
        kho: this.f_kho
      });
      if (!data2.data.length) this.maphieu = 1;
      else {
        for (let i = 0; i < data2.data.length; i++) {
          let vitri = data2.data[i].sophieu.trim().indexOf("/");
          this.phieu = parseInt(data2.data[i].sophieu.trim().slice(5, vitri));
          //    else
          //    this.phieu = data2.data[i].sophieu.trim().slice(5,8)

          if (this.phieu > this.maphieu) {
            this.maphieu = this.phieu;
          }
        }
        this.maphieu++;
      }
    },
     async loadDepartment() {
      const data = await this.$store.dispatch("base/GET_DEPARTMENTS", {
        factoryId: this.$store.state.base.userInfo.departmentId,
      });
      this.departments = data.data;
      this.f_kho = this.departments[0].name
      console.log('phòng ban:',this.f_kho)
      
    },
    // async taophieu(){
    //     const data = await this.$store.dispatch('nlg/GET_DS_PHIEU_NHAP_KHO2',{kho:'all'})
    //    this.dataSource = data.data

    //    this.maphieu = data.data[0].sophieu

    //     //this.maphieu = Math.max.apply(Math,this.phieu)
    //     // console.log(maphieu)
    // },
    async loadkho() {
      const duppp = [];
      const data = await this.$store.dispatch("nlg/GET_DS_KHO");
      data.data.forEach(e => {
        duppp.push({
          value: (e.name = e.tenkho)
        });
      });
      this.dupplicateNcc = duppp;
      this.dskho = data.data;
    },
    async loadNhaCungCap() {
      //  const duppp = []
      const data = await this.$store.dispatch("nlg/GET_DS_NHA_CUNG_CAP");
      //data.data.forEach(e=>{
      //     duppp.push({
      //         label:e.id,
      //         value:e.tenkho
      //     })
      // })
      // this.dupplicateNcc = duppp
      this.dsNcc = data.data;
      // this.dsNcc = data.data
    },
    view(guid) {
      this.$router.push({
        path: "/nlg-view-phieu-nhap-kho/",
        query: { guid: guid.replace("/", "-") }
      });
    },
    goAdd(guid) {
      this.$router.push({
        path: "/nlg-phieu-nhap-kho",
        query: { guid: guid.replace("/", "-") }
      });
    },
    eventChonNcc(e) {
      this.f_ncc = e.value;
    },
    // eventChonKho(e){
    //     this.f_kho=e.value
    // },
    eventChangeNgayNhapKho(e) {
      console.log(e);
      this.f_ngaynhapkho = e.value;
      console.log(formatDateISO(this.f_ngaynhapkho));
    },
    eventChonXenang(e) {
      this.f_xuongxenang = e.value;
    },
    chonmaphieu(e) {
      this.f_maphieu = e.value;
    },
    handleValueChange(e) {
      this.f_bsx = e.value;
    },
      woodValueChange(e) {
      this.f_label = e.value;
    }
  }
};
</script>

<style></style>
