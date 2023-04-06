<template>
  <q-page class="q-pa-md">
   
      <q-card-section>
        <q-btn  class="row print-hide" color="red" icon="close" @click="reject" />
        <!-- <div class="row">
          <div class="col-8 top-title">Biên bản tính tiền</div>
            <div class="col-4" align="right">
              
            <q-btn color="primary" icon="print" flat @click="print" />
          </div> 
        </div> -->
      </q-card-section>
      <q-separator inset />
   
        <!-- <DxTreeList
    id="tasks"
    :data-source="dupplicate"
    :show-borders="true"
    :column-auto-width="true"
    :word-wrap-enabled="true"
    :expanded-row-keys="expandedRowKeys"
    :selected-row-keys="selectedRowKeys"
    key-expr="ID"
    parent-id-expr="PARENT_ID"
  >
    <DxSearchPanel
      :visible="false"
      :width="250"
    />
    <DxHeaderFilter :visible="false"/>
    <DxColumnChooser :enabled="false"/>

    <DxColumn
      :width="150"
      data-field="PHANLOAI"
      caption="Phân loại"
      cell-template="typeTemplate"
    />
    <DxColumn
        caption="Qui Cách"
        alignment="center"
    >
        <DxColumn
        caption="D"
        data-field="DAY"
        format="fixedPoint"
        alignment="center"
        width="40"
        />
        <DxColumn
        caption="R"
        data-field="RONG"
        format="fixedPoint"
        alignment="center"
        width="40"
        />
        <DxColumn
        caption="Dài"
        data-field="DAI"
        format="fixedPoint"
        alignment="center"
        width="60"
        />
    </DxColumn>
    <DxColumn
      data-field="TONGSOTHANH"
      caption="Số thanh giao"
      width="60"
    >
    </DxColumn>
    <DxColumn
      data-field="SL_MAU"
      caption="Số thanh mẫu"
      format="fixedpoint"
      alignment="center"
      width="60"
    >
    </DxColumn>
    <DxColumn
      data-field="GOOD_QTY"
      caption="Đạt YC Hạ cấp"
      format="fixedpoint"
      alignment="center"
      width="80"
    >
    </DxColumn>
    <DxColumn
      data-field="TYLE"
      caption="Tỷ lệ"
      alignment="center"
      format="#0.## %"
      width="70"
    >
    </DxColumn>
    <DxColumn
      data-field="KLQC"
      caption="Khối lượng theo QC m³"
      format="#0.####"
      alignment="center"
      width="60"
    >
    </DxColumn>
     <DxColumn
      data-field="KLKHO"
      caption="Khối lượng theo Kho m³"
      format="#0.####"
      alignment="center"
      width="60"
    />
     <DxColumn
      data-field="NOTE"
      caption="Ghi chú"
      min-width="60"
    >
    </DxColumn>
    <DxColumn
      data-field="GIA_CTY"
      caption="Đơn giá Công ty"
      format="fixedpoint"
      alignment="center"
      min-width="80"
    />
    <DxColumn
      data-field="GIA_LOAI"
      caption="Đơn giá ơhân loại"
      format="fixedpoint"
      alignment="center"
      min-width="80"
    />
    <DxColumn
      data-field="THANHTIEN"
      caption="Thành tiền"
      format="fixedpoint"
      alignment="center"
      min-width="90"
      :calculate-cell-value="calculateThanhTien"
    />
    <DxColumn
      data-field="dongiatb"
      caption="Đơn giá TB"
      format="fixedpoint"
      alignment="center"
      min-width="90"
    />
    <template #typeTemplate="options">
     <b v-if="options.data.data.PARENT_ID===null">{{options.data.data.PHANLOAI}}</b>
     <span v-else>{{options.data.data.PHANLOAI}}</span>
    </template>
        </DxTreeList>-->

        <div class="row"></div>
        <div class="row">
          <div class="col-12">
            <div class="page-header">
              <table
                cellspacing="0"
                style="width:100%;font-family: 'Times New Roman'"
                border="1"
                data-cke-table-faked-selection-table
              >
                <tbody>
                  <tr>
                    <td
                      colspan="10"
                      rowspan="2"
                      style="height:15.0pt; vertical-align:top; white-space:nowrap; width:507pt"
                    >
                      <span
                        tabindex="-1"
                        contenteditable="false"
                        data-cke-widget-wrapper="1"
                        data-cke-filter="off"
                        class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption"
                        data-cke-display-name="ảnh"
                        data-cke-widget-id="5"
                        role="region"
                        aria-label="Graphic1 ảnh widget"
                      >
                        <img
                        v-if="phieunhapkho.makho.trim()=='TH'"
                          src="https://app.woodsland.com.vn:2002/img/logo.06aa324e.png"
                          alt="Graphic1"
                          width="100"
                          height="80"
                          data-cke-widget-upcasted="1"
                          data-cke-widget-keep-attr="0"
                          data-widget="image"
                          class="cke_widget_element"
                        />
                      </span>
                      <span style="margin-left:30%">QUY TRÌNH KIỂM TRA TIẾP NHẬN</span>
                    </td>
                    <td
                      colspan="2"
                      style="height:15.0pt; vertical-align:middle; white-space:nowrap; width:110pt"
                    >
                      <em>BM-QC-01</em>
                    </td>
                    <td
                      style="height:15.0pt; vertical-align:middle; white-space:nowrap; width:108pt"
                    >
                      <em>&nbsp;</em>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colspan="3"
                      style="height:15.0pt; vertical-align:middle; white-space:nowrap"
                    >
                      <em>Ngày ban hành: 15.2.2008</em>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colspan="10"
                      rowspan="2"
                      style="height:15.0pt; text-align:center; vertical-align:middle; white-space:nowrap"
                    >
                      <strong>BIÊN BẢN TÍNH TIỀN NHẬP GỖ</strong>
                    </td>
                    <td
                      colspan="2"
                      style="height:15.0pt; vertical-align:middle; white-space:nowrap"
                    >
                      <em>
                        Lần
                        ban hành: 03
                      </em>
                    </td>
                    <td style="height:15.0pt; vertical-align:middle; white-space:nowrap">
                      <em>&nbsp;</em>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="height:15.0pt; text-align:center; vertical-align:middle; white-space:nowrap"
                    >
                      <br />
                    </td>
                    <td
                      style="height:15.0pt; text-align:center; vertical-align:middle; white-space:nowrap"
                    >
                      <br />
                    </td>
                    <td style="height:15.0pt; vertical-align:middle; white-space:nowrap">
                      <em>&nbsp;</em>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colspan="3"
                      style="height:18.0pt; text-align:center; vertical-align:bottom; white-space:nowrap"
                    >
                      <strong>Nhân viên kiểm tra</strong>
                    </td>
                    <td
                      colspan="2"
                      style="height:18.0pt; text-align:center; vertical-align:bottom; white-space:nowrap"
                    >
                      <strong>Chức vụ</strong>
                    </td>
                    <td
                      colspan="2"
                      style="height:18.0pt; text-align:center; vertical-align:bottom; white-space:nowrap"
                    >
                      <strong>Thời gian lập biên bản</strong>
                    </td>
                    <td
                      colspan="5"
                      style="height:18.0pt; text-align:center; vertical-align:bottom; white-space:nowrap"
                    >
                      <strong>Đại diện nhà cung cấp</strong>
                    </td>
                    <td
                      style="height:18.0pt; text-align:center; vertical-align:bottom; white-space:nowrap"
                    >
                      <strong>Số phiếu</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="height:18.0pt; vertical-align:bottom; white-space:nowrap">1</td>
                    <td
                      colspan="2"
                      style="height:18.0pt; text-align:left; vertical-align:bottom; white-space:nowrap"
                    >
                    {{phieunhapkho.QC_NAME}}
                    </td>
                    <td
                      colspan="2"
                      style="height:18.0pt; text-align:center; vertical-align:bottom; white-space:nowrap"
                    >NV QC</td>
                    <td
                      colspan="2"
                      style="height:18.0pt; text-align:center; vertical-align:bottom; white-space:nowrap"
                    >{{formatDate(ngaygio)}}</td>
                    <td style="height:18.0pt; vertical-align:bottom; white-space:nowrap">Họ tên</td>
                    <td
                      colspan="4"
                      style="height:18.0pt; text-align:center; vertical-align:bottom; white-space:nowrap"
                    >{{phieunhapkho.name}}</td>
                    <td
                      style="height:18.0pt; text-align:center; vertical-align:bottom; white-space:nowrap"
                    >
                      <strong>{{phieunhapkho.sophieu}}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="height:18.0pt; vertical-align:bottom; white-space:nowrap">2</td>
                    <td
                      colspan="2"
                      style="height:18.0pt; text-align:left; vertical-align:bottom; white-space:nowrap"
                    >
                    {{phieunhapkho.NGUOI_TAO}}
                    </td>
                    <td
                      colspan="2"
                      style="height:18.0pt; text-align:center; vertical-align:bottom; white-space:nowrap"
                    >Thủ kho</td>
                    <td
                      colspan="2"
                      style="height:18.0pt; text-align:center; vertical-align:bottom; white-space:nowrap"
                    >{{formatDate(phieunhapkho.ngaynhapht)}}</td>
                    <td style="height:18.0pt; vertical-align:bottom; white-space:nowrap">Địa chỉ</td>
                    <td
                      colspan="4"
                      style="height:18.0pt; text-align:center; vertical-align:bottom; white-space:nowrap"
                    >{{phieunhapkho.NCC_ADDRESS}}</td>
                    <td
                      style="height:18.0pt; text-align:center; vertical-align:bottom; white-space:nowrap"
                    >Hiệu lực SD: 06/12/2014</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br />

            <!-- start table thứ 3 -->
            <div v-html="table"></div>
            <!-- end tablet thứ 3 -->
            <div
              class="row"
              id="tabletotal"
              style="font-family: 'Time New Roman';float:right;margin-top:-72px;margin-right: 102px;"
            ></div>
            <div class="row" style="float: right" id="divavg"></div>
            <!-- end table total -->
            <div class="row" style="margin-top:9%;font-size: 1.3em;font-family: 'Time New Roman';">
              <div class="col-2"></div>
              <div class="col-3">
                Kế Toán
                <br />
                <br />
                <br />
              </div>
              <div class="col-3">
                Phòng Nguyên Liệu Gỗ
                <br />
                <br />
                <br />
                <br />Hà Đăng Chỉnh
                <br />
                <br />
              </div>
              <div class="col-3">
                Người lập biên bản
                <br />
                <br />
                <br />
                <br />
                <span id="nguoilapbb">{{ userInfo.lastName}}</span>
                <br />
              </div>
            </div>
          </div>
        </div>
    
    <!-- <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="primary" />
    </q-page-scroller> -->
  </q-page>
</template>

<script>
import BoxSoPhieu from "../../../components/NLG/BoxSoPhieuInfo";
import {
  DxTreeList,
  DxColumn,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  DxLookup
} from "devextreme-vue/tree-list";
import { roundNumber, formatNumber,formatDateVN, showNotifySuccess, showNotifyError } from "../../../ultils";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  components: {
    DxTreeList,
    DxColumn,
    DxColumnChooser,
    DxHeaderFilter,
    DxSearchPanel,
    DxSelection,
    DxLookup,
    BoxSoPhieu
  },
   computed: {
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("nlg", ["getKhoByAccount", "getAllKhos", "phieuNhapKhos", "getDaiDienKho"])
  },
  data() {
    return {
      dataSource: [],
      dupplicate: [],
      tinhtien:{},
      dupplicate1: [],
      phieunhapkho: {},
      guid: "",
      ngaygio:null,
      sophieu: "",
      expandedRowKeys: [],
      selectedRowKeys: [],
      dataConvert: [],
      table:'',
      thue10:0,
      hotrokhac:0,
      tongtienchuathue:0,
      tongthanhtoan:0,
      klkho:0,
      klqc:0,
      dongiatb:0,
      tylechinhpham:0
    };
  },
  created() {
    this.loadPhieu().then(() => {
      this.loadDetail();
    });
  },
  methods: {
    // async save(){
    //   const payload = {
    //     sophieuId:this.phieunhapkho.sophieu,
    //     sophieuCode: this.phieunhapkho.sophieu,
    //     xuatHD: this.phieunhapkho.COHD,
    //     hotrokhac:this.hotrokhac,
    //     hotrovanchuyen:0,
    //     tongthanhtoan:this.tongthanhtoan,
    //     tongtienchuathue:this.tongtienchuathue,
    //     klkho:this.klkho,
    //     klqc:this.klqc,
    //     dongiatb:this.dongiatb,
    //     tylechinhpham:this.tylechinhpham,
    //     coc:this.phieunhapkho.COC,
    //     uid:this.$store.state.base.userInfo.id,
    //     data:this.dupplicate
    //   }
    //   const data = await this.$store.dispatch('nlg/COMPLETED_BB',payload)
    //   console.log(data)
    //   if (data.meta.success) {
    //     showNotifySuccess()
    //     setTimeout(() => {
    //       this.$router.go(-1)
    //     }, 500);
    //   }else{
    //     showNotifyError()
    //   }
    // },
    async reject(){
      console.log(this.phieunhapkho.sophieu)
      const payload = {
        id:this.phieunhapkho.id,
        sophieu:this.phieunhapkho.sophieu,
         hacap:'N',
        tinhtien:'Y',
        ALLOWMODIFY:'N',
        delFlag:'N'
      }
      const data = await this.$store.dispatch('nlg/UPDATE_PHIEU_NHAP_KHO',payload)
      if (data.meta.success) {
        showNotifySuccess()
         this.$router.push('/nlg-bb')
      }else{
        showNotifyError()
      }
    },
     print(){
        window.print()
    },
    formatDate(d){
      return formatDateVN(d)
    },
    async loadPhieu() {
      const guid = this.$route.params.guid.replace('-','/');
     // console.log(sophieu)
      if (guid) {
        this.guid = guid;
        const data = await this.$store.dispatch("nlg/GET_DS_PHIEU_NHAP_KHO1", {
          guid: guid
        });
        this.phieunhapkho = data.data[0];
      }
    },
    async loadDetail() {
      this.table=``
      let eltotal =``
      let eldata=``
      let xuathoadon=``
      let note = ``
      let tongtientb = 0
      let tongKL_Not_Loai = 0
      let tongTheTichKho = 0
      let tongCongThanhTien = 0
      let thetichQCCP = 0
      let thetichQC = 0
      let hc_gapdoi = 0
      let tylechinhpham = 0
      let hotrokhac = 0
      let hc_gapdoi1 = 0
      let tongTheTichQCCP = 0
      let tongTheTichQC = 0 // Tổng thể tích quy cách gỗ nhập được thanh toán							
      const data = await this.$store.dispatch(
        "nlg/GET_BB_TINHTIEN_EDIT1",
        this.phieunhapkho.sophieu.replace("/", "-")
      );
      this.dataSource = data.data;
      const cp = this.dataSource
     
 const data1 = await this.$store.dispatch(
        "nlg/GET_BB_TINHTIEN_EDIT",
        this.phieunhapkho.sophieu.replace("/", "-")
      );
      this.dupplicate = data1.data;
      const cp2 = this.dupplicate
      const data2 = await this.$store.dispatch(
        "nlg/GET_BB_TINHTIEN_EDIT2",
        this.phieunhapkho.sophieu.replace("/", "-")
      );
      this.dupplicate1 = data2.data;
      const bg = this.dupplicate1
    //console.log(cp2.length)
     for (let n=0; n < cp.length; n++){
       const tyle = cp[n] ;
          tongTheTichKho += roundNumber(tyle.KLKHO,2);
          thetichQCCP += roundNumber((tyle.KLKHO*tyle.QTY/tyle.SL_MAU),2);
          tylechinhpham = roundNumber(thetichQCCP/tongTheTichKho * 100,2);

        }
     
      for(let i = 0; i < cp.length; i++){
        const element = cp[i];
        let tongthanhtien = roundNumber(element.DONGIA_LOAI*roundNumber((element.KLKHO*element.QTY/element.SL_MAU),4),0);
        //let giactycp = element.COST
      //  if (parseInt(tylechinhpham) < 55){
      //  let giactycp = element.COST - ((55 -parseInt(tylechinhpham))* 50000) ;
      //  }
       // tongTheTichKho += roundNumber(element.KLKHO,4);
      //      if (this.phieunhapkho.COC.trim() === 'Y'){
      //  hotrokhac = 250000*tongTheTichKho; }
      //  else hotrokhac = 0;
        tongTheTichQC += roundNumber((element.KLKHO*element.QTY/element.SL_MAU),2);
        tongTheTichQCCP += roundNumber((element.KLKHO*element.QTY/element.SL_MAU),2);
         //console.log(tongTheTichKho)
        for (let k = 0; k < cp2.length; k++) {
         // let tongthanhtien = element.DONGIA_LOAI*roundNumber((element.QTY/element.SL_MAU * 100),2);
          const element1 = cp2[k];
          
          if (element.id == element1.ID_DT ){
            if (element1.GAPDOI.trim() === 'Y')
            hc_gapdoi1 = 2;
            else hc_gapdoi1 = 1;
         

            if (element1.DEL_FLAG.trim() === 'N'){
let  thetichQC1 = roundNumber((element1.KLKHO*element1.SOTHANH/element.SL_MAU)*hc_gapdoi1,2);
            tongthanhtien += roundNumber(element1.DONGIA_LOAI*thetichQC1 ,0);

            tongTheTichQCCP += roundNumber((element1.KLKHO*element1.SOTHANH/element.SL_MAU),4)*hc_gapdoi1;
            if (element1.TYPENAME.trim() !== 'Hàng Loại' ){
               
            tongTheTichQC += roundNumber((element1.KLKHO*element1.SOTHANH/element.SL_MAU),4)*hc_gapdoi1;
            }
          }
          }

        }
        tongCongThanhTien += tongthanhtien;
        tongtientb += roundNumber(tongthanhtien/(element.KLKHO),0)
          // const payload = {
                       
          //                id:element.id,
                      
          //               DONGIA_TB:roundNumber(tongthanhtien/(element.KLKHO),0)
                                             
          //           }
                    
          //           const data = await this.$store.dispatch('nlg/EDIT_NHAP_KHO',payload)
       // thetichQCCP += roundNumber((element.KLKHO*element.QTY/element.SL_MAU),4)
       eldata+=`
            <tr >
              <td rowspan="" style="border-block-end-color: blue;" id="sttid">${i+1}</td>
              <td><span  id="phanloai">Chính phẩm</span></td>
              <td >${element.DAY}</td>
              <td >${element.RONG}</td>
              <td >${element.CAO}</td>
              <td >${formatNumber(element.TONGSOTHANH)}</td>
              <td >${element.SL_MAU}</td>
              <td >${element.QTY}</td>
              <td >${roundNumber((element.QTY/element.SL_MAU * 100),1)} %</td>
              <td style="text-align:center;">${roundNumber((element.KLKHO*element.QTY/element.SL_MAU),2) }</td>
              <td style="text-align:center;">${roundNumber(element.KLKHO,2)}</td>
              <td ></td>
              <td style="text-align:right;">${formatNumber(element.COST)}</td>
              <td style="text-align:right;">${formatNumber(element.DONGIA_LOAI)}</td>
              <td style="text-align:right;">${formatNumber(roundNumber(element.DONGIA_LOAI*roundNumber((element.KLKHO*element.QTY/element.SL_MAU),2),0))}</span></td>
              <td style="text-align:right;">${formatNumber(roundNumber(tongthanhtien/(element.KLKHO),0))}</td>
               <td></td>
          </tr>
          `
       for (let j = 0; j< cp2.length; j++) {
         const element2 = cp2[j];
         //console.log(element2.hangloai);
         let gia_theo_loai = 0;
         let curr_cost = 0;
         if (element.id == element2.ID_DT)
         {
           if (element2.DEL_FLAG.trim() === "N")
           
           {
           
             if (element2.GAPDOI.trim() === 'Y'){
              hc_gapdoi = 2; 
               note = 'gấp đôi';
              }
             else { 
               hc_gapdoi = 1; 
                 note = '';
             }
            
              let Tyle = roundNumber((element2.SOTHANH/element.SL_MAU),4)
             thetichQC = roundNumber(element2.KLKHO*Tyle*hc_gapdoi,2);
           
             
          
           eldata+=`
            <tr >
              <td rowspan="" style="" id="sttid"></td>
              <td><span id="phanloai">${element2.TYPENAME}</span></td>
              <td >${element2.DAY}</td>
              <td >${element2.RONG}</td>
              <td >${element2.CAO}</td>
              <td ></td>
              <td ></td>
              <td >${element2.SOTHANH}</td>
              <td >${roundNumber((Tyle * 100),1)} %</td>
              <td style="text-align:center;">${thetichQC}</td>
              <td style="text-align:center;"></td>
              <td >${note}</td>
              <td style="text-align:right;">${formatNumber(element2.COST)}</td>
              <td style="text-align:right;">${formatNumber(element2.DONGIA_LOAI)}</td>
              <td style="text-align:right;">${formatNumber(roundNumber(element2.DONGIA_LOAI*thetichQC,0))}</span></td>
              <td></td>
              <td>${element2.NOTE?element2.NOTE:''}</td>
          </tr>
          `
         }
         }
       }
     
      }
      
         const data4 = await this.$store.dispatch(
        "nlg/GET_BB_TINHTIEN_VIEW",
        this.phieunhapkho.sophieu.replace("/", "-")
      );
      this.tinhtien = data4.data.tinhtien[0];
         this.ngaygio = moment(this.tinhtien.CREATED_AT).subtract(5,'hour').format("YYYY-MM-DD 06:00:00")
        if (this.tinhtien.XUATHOADON.trim() =='Y')
             {
            xuathoadon = `
                  <td colspan="14" style="text-align:right;color:red">Đơn giá xuất hóa đơn :</td>
                  <td colspan="3" style="text-align:center;color:red" >${formatNumber(roundNumber((this.tinhtien.TONGTIENCHUATHUE/this.tinhtien.KLKHO),0))}</td>
                    `
             }
          else{
            xuathoadon = `
            
          `
          }

            console.log(this.tinhtien.XUATHOADON)
         
      
        eltotal=`<tr>
                  <td colspan="9" style="text-align:right;"><strong>Tổng thể tích các quy cách gỗ được nhập :</strong></td> 
                  <td style="text-align:center;"><span id="tongthetichnhap">${roundNumber(this.tinhtien.KLQC,2)}</span></td>   
                  <td  style="background-color:cadetblue;"><strong id="tongthetichkho">${roundNumber(this.tinhtien.KLKHO,2)}</strong></td> 
                  <td colspan="3" style="background-color:cadetblue;"><strong>Tổng cộng :</strong></td> 
                  <td style="text-align:right"><span style="color:red" id="tongcong">${formatNumber(roundNumber(this.tinhtien.TONGTIENCHUATHUE - this.tinhtien.HOTROKHAC - this.tinhtien.HOTROPALLET,0))}</span></td> 
                  <td style="text-align:right"><span style="color:red" id="dongiatb">${formatNumber(roundNumber(this.tinhtien.DONGIATB,0))}</span></td> 
                      <td style="text-align:right"><span ></span></td> 
              </tr>
              <tr>
                  <td colspan="9" style="text-align:right;"><strong>Tổng thể tích các quy cách gỗ bị loại được thanh toán :</strong></td> 
                  <td style="text-align:center;">${roundNumber(tongTheTichQCCP - tongTheTichQC,2)}</td>
                   <td colspan="4" style="text-align:right;color:red">Hỗ trợ khác :</td>
                  <td colspan="4" style="text-align:center;color:red" >${formatNumber(roundNumber(this.tinhtien.HOTROKHAC,0))}</td>
                 
              </tr>
              <tr>
                  <td colspan="9" style="text-align:right;"><strong>Tổng thể tích quy cách gỗ nhập được thanh toán :</strong></td> 
                  <td style="text-align:center;">${roundNumber(tongTheTichQCCP,4)}</td>
                 <td colspan="4" style="text-align:right;color:red">Hỗ trợ Pallet :</td>
                  <td colspan="3" style="text-align:center;color:red" >${formatNumber(roundNumber(this.tinhtien.HOTROPALLET,0))}</td>
              </tr>
              
              <tr>
                  <td colspan="9" style="text-align:right;"><strong>Tỷ lệ chính phẩm của lô hàng :</strong></td> 
                  <td style="text-align:center;">${roundNumber(this.tinhtien.TYLECHINHPHAM,2)}%</td>
                       <td colspan="4" style="text-align:right;color:red">Tổng tiền chưa thuế :</td>
                  <td colspan="3" style="text-align:center;color:red" >${formatNumber(this.tinhtien.TONGTIENCHUATHUE)}</td>
              </tr>
                <tr>
                  <td colspan="10" style="text-align:right;"><strong></strong></td> 
                          <td colspan="4" style="text-align:right;color:red">Thuế 10% :</td>
                  <td colspan="3" style="text-align:center;color:red" >${formatNumber(this.tinhtien.TONGTHANHTOAN - this.tinhtien.TONGTIENCHUATHUE)}</td>
              </tr>
              <tr>
                  <td colspan="10" style="text-align:right;"><strong></strong></td> 
                  <td colspan="4" style="text-align:right;color:red">Tổng thanh toán :</td>
                  <td colspan="3" style="text-align:center;color:red" >${formatNumber(roundNumber(this.tinhtien.TONGTHANHTOAN ,0))}</td>
              </tr>
             ${xuathoadon}
             `
          
          this.table = `<table border="1" cellspacing="0" style="width:100%;font-family: 'Times New Roman'">
              <tbody id="tabledata">
                <tr>
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:23pt"
                  >
                    <strong>
                      S
                      <br />T
                      <br />T
                    </strong>
                  </td>
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:nowrap; width:122pt"
                  >
                    <strong>Phân loại</strong>
                  </td>
                  <td
                    colspan="3"
                    rowspan="2"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:nowrap;"
                  >
                    <strong>Quy cách (mm)</strong>
                  </td>
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:64pt"
                  >
                    <strong>Số thanh, K lượng giao</strong>
                  </td>
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:64pt"
                  >
                    <strong>Số thanh, K lượng mẫu</strong>
                  </td>
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:55pt"
                  >
                    <strong>Đạt YC, Hạ cấp, Loại</strong>
                  </td>
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:55pt"
                  >
                    <strong>Tỷ lệ (%)</strong>
                  </td>
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:55pt"
                  >
                    <strong>Thể tích theo QC (m3)</strong>
                  </td>
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:55pt"
                  >
                    <strong>Thể tích theo kho (m3)</strong>
                  </td>
                  <!-- <td rowspan="3" style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:55pt"><strong>K lượng chênh lệch</strong></td> -->
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:nowrap; width:68pt"
                  >
                    <strong>Ghi chú</strong>
                  </td>
                  <!-- <td rowspan="3" style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:59pt"><strong>Phân loại<br>&nbsp;L1;L2</strong></td> -->
                  <!-- <td rowspan="3" style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:44pt"><strong>Mã<br>sản phẩm</strong></td> -->
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:72pt"
                  >
                    <strong>
                      Đơn giá
                      <br /> phê duyệt (VNĐ)
                    </strong>
                  </td>
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:79pt"
                  >
                    <strong>
                      Đơn giá
                      <br />tính tiền (VNĐ)
                      
                    </strong>
                  </td>
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:nowrap; width:68pt"
                  >
                    <strong>
                      Thành
                      <br />tiền (VNĐ)
                    </strong>
                  </td>
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:78pt"
                  >
                    <strong>
                      Đơn giá
                      <br />TB (VNĐ)
                    </strong>
                  </td>
                      <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:60pt"
                  >
                    <strong>
                     Loại lỗi 
                    </strong>
                  </td>
                </tr>
                <tr></tr>
                <tr>
                  <td
                    style="height:15.0pt;width:10pt; text-align:center; vertical-align:middle; white-space:nowrap"
                  >
                    <strong>Dày</strong>
                  </td>
                  <td
                    style="height:15.0pt;width:10pt; text-align:center; vertical-align:middle; white-space:nowrap"
                  >
                    <strong>Rộng</strong>
                  </td>
                  <td
                    style="height:15.0pt;width:10pt; text-align:center; vertical-align:middle; white-space:nowrap"
                  >
                    <strong>Dài</strong>
                  </td>
                </tr>
               ${eldata}
                ${eltotal}
              </tbody>
            </table>`
    },
   
  }
};
</script>

<style>
</style>