<template>

  <q-page class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-8 top-title">Biên bản tính tiền</div>
          <div class="col-4" align="right">
            <q-btn color="red" icon="close" label="Từ chối" @click="reject" />
            <q-btn class="q-ml-sm" color="primary" icon="check" label="Hoàn thành" @click="save" />
          </div>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
      

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
                          src="http://123.27.2.58:5231/dist/img/logo.jpg"
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
                    >{{formatDate(phieunhapkho.ngaynhapht)}}</td>
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
             <div class="col-4" align="right">
            <q-btn color="red" icon="close" label="Từ chối" @click="reject" />
            <q-btn class="q-ml-sm" color="primary" icon="check" label="Hoàn thành" @click="save" />
          </div>
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
      </q-card-section>
    </q-card>
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
import { mapGetters } from "vuex";
import { roundNumber, formatNumber,formatDateVN, showNotifySuccess, showNotifyError } from "../../../ultils";
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
      dupplicate1: [],
      dupplicate6:[],
      phieunhapkho: {},
      guid: "",
      sophieu: "",
      expandedRowKeys: [],
      selectedRowKeys: [],
      dataConvert: [],
      table:'',
      thue10:0,
      hotrokhac:0,
      hotropallet:0,
      xuathd:1,
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
    async save(){
     // console.log(this.hotrokhac)
      const payload = {
      sophieuId:this.phieunhapkho.sophieu,
        sophieuCode: this.phieunhapkho.sophieu,
        xuatHD: this.phieunhapkho.COHD,
        hotrokhac:this.hotrokhac,
        hotropallet: this.hotropallet,
        hotrovanchuyen:0,
        tongthanhtoan:this.tongthanhtoan,
        tongtienchuathue:this.tongtienchuathue,
        klkho:this.klkho,
        klqc:this.klqc,
        dongiatb:this.dongiatb,
        tylechinhpham:this.tylechinhpham,
        coc:this.phieunhapkho.COC,
       uid:this.$store.state.base.userInfo.account,
        //data:this.dupplicate
      }
      const data = await this.$store.dispatch('nlg/COMPLETED_BB',payload)
    
      if (data.data) {
        //showNotifySuccess()
       
          this.$router.push('/nlg-bb-tinh-tien-view/'+this.phieunhapkho.sophieu.replace('/','-'))
        
      }else{
        showNotifyError()
      }
    },
    async reject(){
      const payload = {
        id:this.phieunhapkho.id,
        hacap:'Y',
        tinhtien:'N',
        ALLOWMODIFY :'Y',
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
    formatDate(d){
      return formatDateVN(d)
    },
    async loadPhieu() {
      
      const guid = this.$route.params.guid.replace('-','/');
     
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
      let tongthetichkhackho = 0
      let tongKL_Not_Loai = 0
      let tongTheTichKho = 0
      let tongklxeppallet = 0
      let tongklkoxeppallet = 0
      let tongCongThanhTien = 0
      let thetichQCCP = 0
      let thetichQC = 0
      let hc_gapdoi = 0
      let classBG = ''
      let tienkhackho = 0
      let tylechinhpham = 0
     // let hotrokhac = 0
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
      if (this.phieunhapkho.COHD.trim() == 'Y') 
      this.xuathd = 1.1
      //console.log(this.xuathd)
    //console.log(cp2.length)
     for (let n=0; n < cp.length; n++){
       const tyle = cp[n] ;
       console.log('kho:',tyle)
        console.log('mã kho:',this.phieunhapkho.makho)
       if(tyle.khacKho == 1){
          tongthetichkhackho += roundNumber(tyle.KLKHO,2)
       }
       if (tyle.PALLET == 1) {
         tongklxeppallet += roundNumber(tyle.KLKHO,2)
       } else  tongklkoxeppallet += roundNumber(tyle.KLKHO,2)
          tongTheTichKho += roundNumber(tyle.KLKHO,2);
          thetichQCCP += roundNumber((tyle.KLKHO*tyle.QTY/tyle.SL_MAU),2);
          tylechinhpham = roundNumber(thetichQCCP/tongTheTichKho * 100,2);

        }
     if (tongthetichkhackho/tongTheTichKho <= 0.2)
              tienkhackho = 100000
              else tienkhackho = 100000
      for(let i = 0; i < cp.length; i++){
        const element = cp[i];
     let tylecphc = 0
        if (element.CAO >=1000 && element.DAY>23 && element.DAY<35) {
              tylecphc =  roundNumber(element.QTY/element.SL_MAU * 100,2)
              console.log('CP',tylecphc)
             for (let k = 0; k < cp2.length; k++) {
      
          const element5 = cp2[k];
          if (element.id == element5.ID_DT) {
          if (element5.DAY == element.DAY && element5.RONG == element.RONG && element5.CAO+200>=element.CAO
          && element5.TYPENAME.trim() !== 'Chính Phẩm B' && element5.TYPENAME.trim() !=='Hàng Loại C' && element5.TYPENAME.trim()!== 'Hàng Loại')
     
          tylecphc = tylecphc + roundNumber(element5.SOTHANH/element.SL_MAU*100,2)
        
             }
          
        }
            console.log('ngoai ke hoach',tylecphc)
        }
        //let tongthanhtien = roundNumber(giactycp*roundNumber((element.KLKHO*element.QTY/element.SL_MAU),4),0);
        let giactycp = 0
// const data6 = await this.$store.dispatch(
//         "nlg/GET_BB_TINHTIEN_EDIT2",
//         element.MANVL
//       );
//       this.dupplicate6 = data6.data;
//       const bg2 = this.dupplicate6
let tylehangcp = roundNumber(element.QTY/element.SL_MAU * 100,1)
if (element.CAO >=1000 && element.DAY>=24 && element.DAY<35){
 if (parseInt(tylecphc) < 70 && element.tylecp == false ){
       giactycp = element.COST - ((70 -parseInt(tylecphc))* 50000) ;
       } else giactycp = element.COST;
} else{
       if (parseInt(tylehangcp) < 55 && element.tylecp == false ){
       giactycp = element.COST - ((55 -parseInt(tylehangcp))* 50000) ;
       } else giactycp = element.COST;
}
       if (element.khacKho == true && (tongthetichkhackho/tongTheTichKho) <= 0.2 ){
          giactycp = giactycp - 100000;
         
        }
        if (element.khacKho == true && (tongthetichkhackho/tongTheTichKho) > 0.2 ){
          giactycp = giactycp - 100000;
          
        }
       // console.log(element.codenhom)
      if (this.phieunhapkho.mancc.trim() == 'TH' && element.codenhom.trim() == '100115' )
      {
        giactycp = giactycp - 50000;
      }
       if (parseInt(element.QTY/element.SL_MAU * 100)>=55 && (element.codenhom.trim() == '100025' || element.codenhom.trim() == '100061'))
       {
         giactycp = giactycp + 200000;
       }
       if (parseInt(element.QTY/element.SL_MAU * 100)>=55 && element.codenhom.trim() == '100075')
       {
         giactycp = giactycp + 300000;
       }
       if (element.OVER_PLAN == 1){
         giactycp = giactycp - 300000;
       }
       if (element.OVER_PLAN == 2){
         giactycp = giactycp - 0.1*element.COST;
       }
        if (element.OVER_PLAN == 3){
         giactycp = giactycp - 190000;
       }
         if (element.OVER_PLAN == 4){
         giactycp = giactycp - 0.05*element.COST;
       }
      //    if (element.vuotkho == 1){
      //    giactycp = giactycp - 100000;
      //  }
        if (element.vuotkho == 2){
         giactycp = giactycp - 150000;
       }
       if(this.phieunhapkho.makho.trim()=='TH' && element.khacKho == true){
         giactycp = giactycp - 150000;
       }
        if ((this.phieunhapkho.mancc.trim() == 'TH' || element.MANVL == '35921060' ) &&  tylehangcp <=52 && element.tylecp == false){
      giactycp = giactycp + 150000;
       
    } else
      if ((this.phieunhapkho.mancc.trim() == 'TH' || element.MANVL == '35921060') &&  tylehangcp <=55 && element.tylecp == false){
      giactycp = giactycp + (55 - parseInt(tylehangcp))*50000;
       
    }
     if(this.phieunhapkho.VUNG.trim()=='TN' && element.MANVL == '1451330'){
         giactycp = giactycp + 200000 ;
       }
        if(this.phieunhapkho.VUNG.trim()=='TN' && (element.MANVL == '1451480'|| element.MANVL == '1451165'|| element.MANVL == '1451660')){
         giactycp = giactycp + 200000 ;
       }
       
  //     if (element.codenhom.trim() == '100095' && this.phieunhapkho.makho.trim() == 'TH' )
  //      {
  //        giactycp = giactycp + 100000;
  //      }
  //  if (element.codenhom.trim() == '100095' && this.phieunhapkho.makho.trim() != 'TH' )
  //      {
  //        giactycp = giactycp - 50000;
  //      }
  //    if (element.codenhom.trim() == '3475791' && this.phieunhapkho.makho.trim() == 'TH' )
  //      {
  //        giactycp = giactycp + 100000;
  //      }
  //  if (element.codenhom.trim() == '3475791' && this.phieunhapkho.makho.trim() != 'TH' )
  //      {
  //        giactycp = giactycp - 50000;
  //      }   
       let tongthanhtien = roundNumber((giactycp*roundNumber((element.KLKHO*element.QTY/element.SL_MAU),2)),0);
       
       // tongTheTichKho += roundNumber(element.KLKHO,4);
           if (this.phieunhapkho.COC.trim() === 'Y' && (this.phieunhapkho.mancc.trim() == 'TH')){
       this.hotrokhac = 230000*tongTheTichKho; }
       else  if (this.phieunhapkho.COC.trim() === 'Y' && this.phieunhapkho.mancc.trim() != 'TH'){
       this.hotrokhac = 270000*tongTheTichKho; }
       else this.hotrokhac = 0;
       this.hotropallet = 0*tongklxeppallet - 100000*tongklkoxeppallet
        tongTheTichQC += roundNumber((element.KLKHO*element.QTY/element.SL_MAU),2);
        tongTheTichQCCP += roundNumber((element.KLKHO*element.QTY/element.SL_MAU),2);
         //console.log(tongTheTichKho)
         
        for (let k = 0; k < cp2.length; k++) {
        //  let tongthanhtien = element.DONGIA_LOAI*roundNumber((element.QTY/element.SL_MAU * 100),2);
          const element1 = cp2[k];
          let gia_theo_loai1 = 0;
         let curr_cost1 = 0;
            let Tylehacap = roundNumber((element1.SOTHANH/element.SL_MAU),4)
            let Tylehacap1 = roundNumber(Tylehacap*100,2)
          if (element.id == element1.ID_DT ){
            if (element1.GAPDOI.trim() === 'Y')
            hc_gapdoi1 = 2;
            else hc_gapdoi1 = 1;
         
            
            if (element1.DEL_FLAG.trim() === 'N'){
            //     let Tyle = roundNumber((element1.SOTHANH/element.SL_MAU),4)
            //  thetichQC = roundNumber(element1.KLKHO*Tyle*hc_gapdoi1,4);
                 for (let m = 0; m < bg.length; m++ ){
             const gia1 = bg[m];
             if (gia1.MASP == element1.MANVL){
               
                switch (element1.TYPENAME.trim()) {
            case 'Hàng Loại B':
              gia_theo_loai1 = 2000000
              curr_cost1=2000000
            break;
            case 'Hàng Loại C':
              gia_theo_loai1 = 1220000
              curr_cost1=1220000
            break;
            case 'Hàng Loại':
              gia_theo_loai1 = 420000
              curr_cost1=420000
            break;
            case 'Chính Phẩm B':
              if (element.CAO >=1000 && element.DAY>=24 && element.DAY<35){
 if (parseInt(tylecphc) < 70 && element.tylecp == false ){
       if (element1.khacKho == true){
                  curr_cost1 = element1.COST - (70 - parseInt(tylecphc))*50000 - tienkhackho;
                  gia_theo_loai1 = curr_cost1;
                }else {
                 curr_cost1 = element1.COST - (70 - parseInt(tylecphc))*50000;
                 gia_theo_loai1 = curr_cost1;
                }
       } else {
                if (element1.khacKho == true ){
                  curr_cost1 = element1.COST - tienkhackho;
                   gia_theo_loai1 = curr_cost1;
                }else {
                curr_cost1 = element1.COST;
                gia_theo_loai1 = curr_cost1;
                }
              }
} else {
              if (tylehangcp < 55 && element.tylecp == false){
                if (element1.khacKho == true){
                  curr_cost1 = element1.COST - (55 - parseInt(tylehangcp))*50000 - tienkhackho;
                  gia_theo_loai1 = curr_cost1;
                }else {
                 curr_cost1 = element1.COST - (55 - parseInt(tylehangcp))*50000;
                 gia_theo_loai1 = curr_cost1;
                }
              } 
              else{
                if (element1.khacKho == true ){
                  curr_cost1 = element1.COST - tienkhackho;
                   gia_theo_loai1 = curr_cost1;
                }else {
                curr_cost1 = element1.COST;
                gia_theo_loai1 = curr_cost1;
                }
              }
}
            if (this.phieunhapkho.mancc.trim() == 'TH' && element.codenhom.trim() == '100115' )
      {
        curr_cost1 = curr_cost1 - 50000;
        gia_theo_loai1 = curr_cost1;
      }
        if(element1.OVER_PLAN == 1)
    {
      curr_cost1 = curr_cost1 - 300000;
        gia_theo_loai1 = curr_cost1;
    }
     if(element1.OVER_PLAN == 2)
    {
      curr_cost1 = curr_cost1 - 0.1*element1.COST;
        gia_theo_loai1 = curr_cost1;
    }
         if(element1.OVER_PLAN == 3)
    {
      curr_cost1 = curr_cost1 - 190000;
        gia_theo_loai1 = curr_cost1;
    }
      if(element1.OVER_PLAN == 4)
    {
      curr_cost1 = curr_cost1 - 0.05*element1.COST;
        gia_theo_loai1 = curr_cost1;
    }
    //    if(element1.vuotkho == 1)
    // {
    //   curr_cost1 = curr_cost1 - 100000;
    //     gia_theo_loai1 = curr_cost1;
    // }
     if(element1.vuotkho == 2)
    {
      curr_cost1 = curr_cost1 - 150000;
        gia_theo_loai1 = curr_cost1;
    }
    if (this.phieunhapkho.makho.trim() == 'TH' && element1.khacKho == true){
      curr_cost1 = curr_cost1 - 150000;
        gia_theo_loai1 = curr_cost1;
    }
       if ((this.phieunhapkho.mancc.trim() == 'TH' || element.MANVL == '35921060' ) &&  tylehangcp <=52 && element.tylecp == false){
      curr_cost1 = curr_cost1 + 150000;
        gia_theo_loai1 = curr_cost1;
    } else
      if ((this.phieunhapkho.mancc.trim() == 'TH' || element.MANVL == '35921060' ) &&  tylehangcp <=55 && element.tylecp == false){
      curr_cost1 = curr_cost1 + (55 - parseInt(tylehangcp))*50000;
        gia_theo_loai1 = curr_cost1;
    }
     if (element.codenhom.trim() == '100024' ){
       if (this.phieunhapkho.VUNG.trim() == 'TN' && element1.MANVL == '1451330'){
      curr_cost1 = curr_cost1 + 200000;
        gia_theo_loai1 = curr_cost1;
    }
        if (this.phieunhapkho.VUNG.trim() == 'TN' && (element1.MANVL == '1451480' ||element1.MANVL == '1451660'||element1.MANVL == '1451165') ){
      curr_cost1 = curr_cost1 + 200000;
        gia_theo_loai1 = curr_cost1;
    }
     }
  //  if (this.phieunhapkho.makho.trim() == 'TH' && element.codenhom.trim() == '100095'){
  //    if(element1.codenhom.trim() == '100095'){
  //     curr_cost1 = curr_cost1 + 100000;
  //       gia_theo_loai1 = curr_cost1;
  //   }
  //  }
  //       if (this.phieunhapkho.makho.trim() != 'TH' && element.codenhom.trim() == '100095'){
  //           if(element1.codenhom.trim() == '100095'){
  //     curr_cost1 = curr_cost1 - 50000;
  //       gia_theo_loai1 = curr_cost1;
  //           }
  //   }
  //    if (this.phieunhapkho.makho.trim() == 'TH' && element.codenhom.trim() == '3475791'){
  //    if(element1.codenhom.trim() == '3475791'){
  //     curr_cost1 = curr_cost1 + 100000;
  //       gia_theo_loai1 = curr_cost1;
  //   }
  //  }
  //       if (this.phieunhapkho.makho.trim() != 'TH' && element.codenhom.trim() == '3475791'){
  //           if(element1.codenhom.trim() == '3475791'){
  //     curr_cost1 = curr_cost1 - 50000;
  //       gia_theo_loai1 = curr_cost1;
  //           }
  //   }
            break;
            default:
               if (element.CAO >=1000 && element.DAY>=24 && element.DAY<35){
 if (parseInt(tylecphc) < 70 && element.tylecp == false ){
 if (element1.khacKho == true){
                  curr_cost1 = element1.COST - (70 - parseInt(tylecphc))*50000 - tienkhackho;
                  gia_theo_loai1 = curr_cost1 - 70000;
                }else {
                 curr_cost1 = element1.COST - (70 - parseInt(tylecphc))*50000;
                 gia_theo_loai1 = curr_cost1 - 70000;
                }
               
 }   else {
                if (element1.khacKho == true){
                  curr_cost1 = element1.COST - tienkhackho;
                   gia_theo_loai1 = curr_cost1 - 70000;
                }else {
                curr_cost1 = element1.COST;
                gia_theo_loai1 = curr_cost1 - 70000;
                }
              }
               }
  else {
              if (tylehangcp < 55 && element.tylecp == false){
                if (element1.khacKho == true){
                  curr_cost1 = element1.COST - (55 - parseInt(tylehangcp))*50000 - tienkhackho;
                  gia_theo_loai1 = curr_cost1 - 70000;
                }else {
                 curr_cost1 = element1.COST - (55 - parseInt(tylehangcp))*50000;
                 gia_theo_loai1 = curr_cost1 - 70000;
                }
              } 
              else{
                if (element1.khacKho == true){
                  curr_cost1 = element1.COST - tienkhackho;
                   gia_theo_loai1 = curr_cost1 - 70000;
                }else {
                curr_cost1 = element1.COST;
                gia_theo_loai1 = curr_cost1 - 70000;
                }
              }
 }
             if (this.phieunhapkho.mancc.trim() == 'TH' && element.codenhom.trim() == '100115' )
      {
        curr_cost1 = curr_cost1 - 50000;
        gia_theo_loai1 = curr_cost1 - 70000;
      }
    if(element1.OVER_PLAN == 1)
    {
      curr_cost1 = curr_cost1 - 300000;
        gia_theo_loai1 = curr_cost1 - 70000;
    }
     if(element1.OVER_PLAN == 2)
    {
      curr_cost1 = curr_cost1 - 0.1*element1.COST;
        gia_theo_loai1 = curr_cost1 - 70000;
    }
     if(element1.OVER_PLAN == 3)
    {
      curr_cost1 = curr_cost1 - 190000;
        gia_theo_loai1 = curr_cost1 - 70000;
    }
      if(element1.OVER_PLAN == 4)
    {
      curr_cost1 = curr_cost1 - 0.05*element1.COST;
        gia_theo_loai1 = curr_cost1 - 70000;
    }
    // if(element1.vuotkho == 1)
    // {
    //   curr_cost1 = curr_cost1 - 100000;
    //     gia_theo_loai1 = curr_cost1 - 70000;
    // }
      if(element1.vuotkho == 2)
    {
      curr_cost1 = curr_cost1 - 150000;
        gia_theo_loai1 = curr_cost1 - 70000;
    }
     if (this.phieunhapkho.makho.trim() == 'TH' && element1.khacKho == true){
      curr_cost1 = curr_cost1 - 150000;
        gia_theo_loai1 = curr_cost1 - 70000;
    }
      if ((this.phieunhapkho.mancc.trim() == 'TH' || element.MANVL == '35921060') &&  tylehangcp <=52 && element.tylecp == false){
      curr_cost1 = curr_cost1 + 150000;
        gia_theo_loai1 = curr_cost1- 70000;
    } else
      if ((this.phieunhapkho.mancc.trim() == 'TH' || element.MANVL == '35921060') &&  tylehangcp <=55 && element.tylecp == false){
      curr_cost1 = curr_cost1 + (55 - parseInt(tylehangcp))*50000;
        gia_theo_loai1 = curr_cost1 - 70000;
    }
    if (element.codenhom.trim() == '100024' ){
    if (this.phieunhapkho.VUNG.trim() == 'TN' && element1.MANVL == '1451330'){
      curr_cost1 = curr_cost1 + 200000;
        gia_theo_loai1 = curr_cost1 - 70000;
    }
     if (this.phieunhapkho.VUNG.trim() == 'TN' && (element1.MANVL == '1451480' || element1.MANVL == '1451660'|| element1.MANVL == '1451165')){
      curr_cost1 = curr_cost1 + 200000;
        gia_theo_loai1 = curr_cost1 - 70000;
    }
    }
    //  if (this.phieunhapkho.makho.trim() == 'TH' && element.codenhom.trim() == '100095'){
    //      if(element1.codenhom.trim() == '100095'){
    //   curr_cost1 = curr_cost1 + 100000;
    //     gia_theo_loai1 = curr_cost1 - 70000;
    //      }
    // }
    //   if (this.phieunhapkho.makho.trim() != 'TH' && element.codenhom.trim() == '100095'){
    //       if(element1.codenhom.trim() == '100095'){
    //   curr_cost1 = curr_cost1 - 50000;
    //     gia_theo_loai1 = curr_cost1 - 70000;
    //       }
    // }
    // if (this.phieunhapkho.makho.trim() == 'TH' && element.codenhom.trim() == '3475791'){
    //      if(element1.codenhom.trim() == '3475791'){
    //   curr_cost1 = curr_cost1 + 100000;
    //     gia_theo_loai1 = curr_cost1 - 70000;
    //      }
    // }
    //   if (this.phieunhapkho.makho.trim() != 'TH' && element.codenhom.trim() == '3475791'){
    //       if(element1.codenhom.trim() == '3475791'){
    //   curr_cost1 = curr_cost1 - 50000;
    //     gia_theo_loai1 = curr_cost1 - 70000;
    //       }
    // }
              break;
          }
            
              // console.log(curr_cost  );
             }
             
           }
           
           //console.log(tongthanhtien)
            tongthanhtien += roundNumber(gia_theo_loai1*roundNumber((element1.KLKHO*element1.SOTHANH/element.SL_MAU*hc_gapdoi1),2) ,0);
           
            tongTheTichQCCP += roundNumber((element1.KLKHO*element1.SOTHANH/element.SL_MAU),2)*hc_gapdoi1;
            if (element1.TYPENAME.trim() !== 'Hàng Loại' ){
               
            tongTheTichQC += roundNumber((element1.KLKHO*element1.SOTHANH/element.SL_MAU),2)*hc_gapdoi1;
            }
          }
          }

        }
        // tongCongThanhTien += tongthanhtien;
        //console.log(tongthanhtien);
        
         const payload = {
                       
                         id:element.id,
                        DONGIA_CTY:giactycp,
                        DONGIA_LOAI:giactycp,
                        DONGIA_TB:roundNumber(tongthanhtien/(roundNumber(element.KLKHO,2)),0)
                                             
                    }
                    
                    const data = await this.$store.dispatch('nlg/EDIT_NHAP_KHO',payload)
       thetichQCCP += roundNumber((element.KLKHO*element.QTY/element.SL_MAU),2)
       classBG = ''
       if (element.khacKho == true)
       {
          classBG = 'background-color: greenyellow;' 
       } 
       if (element.OVER_PLAN == 1){
         classBG = 'background-color: cyan;' ;
       }
         if (element.OVER_PLAN == 2){
         classBG = 'background-color: yellow;' ;
       }
      //   if (element.vuotkho == 1)
      //  {
      //     classBG = 'background-color: plum;' 
      //  } 
       eldata+=`
            <tr style="${classBG}" >
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
              <td style="text-align:center;">${element.MANVL}</td>
              <td style="text-align:right;">${formatNumber(element.COST)}</td>
              <td style="text-align:right;">${formatNumber(giactycp)}</td>
              <td style="text-align:right;">${formatNumber(roundNumber(giactycp*roundNumber((element.KLKHO*element.QTY/element.SL_MAU),2),0))}</span></td>
              <td style="text-align:right;">${formatNumber(roundNumber(tongthanhtien/(roundNumber(element.KLKHO,2)),0))}</td>
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
              let Tylehc1 = roundNumber(Tyle*100,2)
             thetichQC = roundNumber((element2.KLKHO*element2.SOTHANH/element.SL_MAU),4)*hc_gapdoi;
           for (let m = 0; m < bg.length; m++ ){
             const gia = bg[m];
             if (gia.MASP == element2.MANVL){
               
                switch (element2.TYPENAME.trim()) {
            case 'Hàng Loại B':
              gia_theo_loai = 2000000
              curr_cost=2000000
            break;
            case 'Hàng Loại C':
              gia_theo_loai = 1220000
              curr_cost=1220000
            break;
            case 'Hàng Loại':
              gia_theo_loai = 420000
              curr_cost=420000
            break;
            case 'Chính Phẩm B':
               if (element.CAO >=1000 && element.DAY>=24 && element.DAY<35){
 if (parseInt(tylecphc) < 70 && element.tylecp == false ){
 if (element2.khacKho == true){
                  curr_cost = element2.COST - (70 - parseInt(tylecphc))*50000 - tienkhackho;
                  gia_theo_loai = curr_cost - 70000;
                }else {
                 curr_cost = element2.COST - (70 - parseInt(tylecphc))*50000;
                 gia_theo_loai = curr_cost - 70000;
                }
               
 }   else {
                if (element2.khacKho == true){
                  curr_cost = element2.COST - tienkhackho;
                   gia_theo_loai = curr_cost - 70000;
                }else {
                curr_cost = element2.COST;
                gia_theo_loai = curr_cost - 70000;
                }
              }
               }
  else {
             if (tylehangcp < 55 && element.tylecp == false){
                if (element2.khacKho == true){
                  curr_cost = element2.COST - (55 - parseInt(tylehangcp))*50000 - tienkhackho;
                  gia_theo_loai = curr_cost;
                }else {
                 curr_cost = element2.COST - (55 - parseInt(tylehangcp))*50000;
                 gia_theo_loai = curr_cost;
                }
              } 
              else{
                if (element2.khacKho == true){
                  curr_cost = element2.COST - tienkhackho;
                   gia_theo_loai = curr_cost;
                }else {
                curr_cost = element2.COST;
                gia_theo_loai = curr_cost;
                }
              }
  }
              if (this.phieunhapkho.mancc.trim() == 'TH' && element.codenhom.trim() == '100115' )
      {
        curr_cost = curr_cost - 50000;
        gia_theo_loai = curr_cost;
      }
      if (element.OVER_PLAN ==1)
      {
        curr_cost = curr_cost - 300000;
        gia_theo_loai = curr_cost;
      }
       if (element.OVER_PLAN ==2)
      {
        curr_cost = curr_cost - 0.1*element2.COST;
        gia_theo_loai = curr_cost;
      }
        if (element.OVER_PLAN ==3)
      {
        curr_cost = curr_cost - 190000;
        gia_theo_loai = curr_cost;
      }
        if (element.OVER_PLAN ==4)
      {
        curr_cost = curr_cost - 0.05*element2.COST;
        gia_theo_loai = curr_cost;
      }
      // if (element.vuotkho ==1)
      // {
      //   curr_cost = curr_cost - 100000;
      //   gia_theo_loai = curr_cost;
      // }
       if (element.vuotkho ==2)
      {
        curr_cost = curr_cost - 150000;
        gia_theo_loai = curr_cost;
      }
       if (this.phieunhapkho.makho.trim() == 'TH' && element2.khacKho == true){
      curr_cost = curr_cost - 150000;
        gia_theo_loai = curr_cost;
    }
     if ((this.phieunhapkho.mancc.trim() == 'TH' || element.MANVL == '35921060') &&  tylehangcp <=52 && element.tylecp == false){
      curr_cost = curr_cost + 150000;
        gia_theo_loai = curr_cost;
    } else
      if ((this.phieunhapkho.mancc.trim() == 'TH' || element.MANVL == '35921060') &&  tylehangcp <=55 && element.tylecp == false){
      curr_cost = curr_cost + (55 - parseInt(tylehangcp))*50000;
        gia_theo_loai = curr_cost;
    }
     if (element.codenhom.trim() == '100024' ){
       if (this.phieunhapkho.VUNG.trim() == 'TN' && element2.MANVL == '1451330'){
      curr_cost = curr_cost + 200000;
        gia_theo_loai = curr_cost;
    }
       if (this.phieunhapkho.VUNG.trim() == 'TN' && (element2.MANVL == '1451480' || element2.MANVL == '1451660'|| element2.MANVL == '1451165')){
      curr_cost = curr_cost + 200000;
        gia_theo_loai = curr_cost;
    }
     }
    //   if (this.phieunhapkho.makho.trim() == 'TH' && element.codenhom.trim() == '100095'){
    //       if(element2.codenhom.trim() == '100095'){
    //   curr_cost = curr_cost + 100000;
    //     gia_theo_loai = curr_cost;
    //       }
    // }
    //   if (this.phieunhapkho.makho.trim() != 'TH' && element.codenhom.trim() == '100095'){
    //       if(element2.codenhom.trim() == '100095'){
    //   curr_cost = curr_cost - 50000;
    //     gia_theo_loai = curr_cost;
    //       }
    // }
    //     if (this.phieunhapkho.makho.trim() == 'TH' && element.codenhom.trim() == '3475791'){
    //       if(element2.codenhom.trim() == '3475791'){
    //   curr_cost = curr_cost + 100000;
    //     gia_theo_loai = curr_cost;
    //       }
    // }
    //   if (this.phieunhapkho.makho.trim() != 'TH' && element.codenhom.trim() == '3475791'){
    //       if(element2.codenhom.trim() == '3475791'){
    //   curr_cost = curr_cost - 50000;
    //     gia_theo_loai = curr_cost;
    //       }
    // }
            break;
            default:
              
               if (element.CAO >=1000 && element.DAY>=24 && element.DAY<35){
 if (parseInt(tylecphc) < 70 && element.tylecp == false ){
 
 if (element2.khacKho == true){
                  curr_cost = element2.COST - (70 - parseInt(tylecphc))*50000 - tienkhackho;
                  gia_theo_loai = curr_cost - 70000;
                }else {
                 curr_cost = element2.COST - (70 - parseInt(tylecphc))*50000;
                 gia_theo_loai = curr_cost - 70000;
                }
               
 }   else {  
                if (element2.khacKho == true){
                  curr_cost = element2.COST - tienkhackho;
                   gia_theo_loai = curr_cost - 70000;
                }else {
                curr_cost = element2.COST;
                gia_theo_loai = curr_cost - 70000;
                }
       
              }
               }
  else {
              if (tylehangcp < 55 && element.tylecp == false){
                if (element2.khacKho == true){
                  curr_cost = element2.COST - (55 - parseInt(tylehangcp))*50000 - tienkhackho;
                  gia_theo_loai = curr_cost - 70000;
                }else {
                 curr_cost = element2.COST - (55 - parseInt(tylehangcp))*50000;
                 gia_theo_loai = curr_cost - 70000;
                }

              } 
              else{
                if (element2.khacKho == true){
                  curr_cost = element2.COST - tienkhackho;
                   gia_theo_loai = curr_cost - 70000;
                }else {
                curr_cost = element2.COST;
                gia_theo_loai = curr_cost - 70000;
                }
              }
  }
              if (this.phieunhapkho.mancc.trim() == 'TH' && element.codenhom.trim() == '100115' )
      {
        curr_cost = curr_cost - 50000;
        gia_theo_loai = curr_cost - 70000;
      }
       if(element2.OVER_PLAN == 1)
    {
      curr_cost = curr_cost - 300000;
        gia_theo_loai = curr_cost - 70000;
    }
      if(element2.OVER_PLAN == 2)
    {
      curr_cost = curr_cost - 0.1*element2.COST;
        gia_theo_loai = curr_cost - 70000;
    }
      if(element2.OVER_PLAN == 3)
    {
      curr_cost = curr_cost - 190000;
        gia_theo_loai = curr_cost - 70000;
    }
         if(element2.OVER_PLAN == 4)
    {
      curr_cost = curr_cost - 0.05*element2.COST;
        gia_theo_loai = curr_cost - 70000;
    }
    //  if(element2.vuotkho == 1)
    // {
    //   curr_cost = curr_cost - 100000;
    //     gia_theo_loai = curr_cost - 70000;
    // }
    if(element2.vuotkho == 2)
    {
      curr_cost = curr_cost - 150000;
        gia_theo_loai = curr_cost - 70000;
    }
     if (this.phieunhapkho.makho.trim() == 'TH' && element2.khacKho == true){
      curr_cost = curr_cost - 150000;
        gia_theo_loai = curr_cost - 70000;
    }
     if ((this.phieunhapkho.mancc.trim() == 'TH' || element.MANVL == '35921060') &&  tylehangcp <=52 && element.tylecp == false){
      curr_cost = curr_cost + 150000;
        gia_theo_loai = curr_cost - 70000;
    } else
      if ((this.phieunhapkho.mancc.trim() == 'TH'  || element.MANVL == '35921060')  &&  tylehangcp <=55 && element.tylecp == false){
      curr_cost = curr_cost + (55 - parseInt(tylehangcp))*50000;
        gia_theo_loai = curr_cost - 70000;
    }
     if (element.codenhom.trim() == '100024' ){
      if (this.phieunhapkho.VUNG.trim() == 'TN' && element2.MANVL == '1451330'){
      curr_cost = curr_cost + 200000;
        gia_theo_loai = curr_cost - 70000;
    }
      if (this.phieunhapkho.VUNG.trim() == 'TN' && (element2.MANVL == '1451480' || element2.MANVL == '1451660' || element2.MANVL == '1451165')){
      curr_cost = curr_cost + 200000;
        gia_theo_loai = curr_cost - 70000;
    }
     }
    //    if (this.phieunhapkho.makho.trim() == 'TH' && element.codenhom.trim() == '100095'){
    //        if(element2.codenhom.trim() == '100095'){
    //   curr_cost = curr_cost + 100000;
    //     gia_theo_loai = curr_cost - 70000;
    //        }
    // }
    //   if (this.phieunhapkho.makho.trim() != 'TH' && element.codenhom.trim() == '100095'){
    //       if(element2.codenhom.trim() == '100095'){
    //   curr_cost = curr_cost - 50000;
    //     gia_theo_loai = curr_cost - 70000;
    //       }
    // }
    // if (this.phieunhapkho.makho.trim() == 'TH' && element.codenhom.trim() == '3475791'){
    //        if(element2.codenhom.trim() == '3475791'){
    //   curr_cost = curr_cost + 100000;
    //     gia_theo_loai = curr_cost - 70000;
    //        }
    // }
    //   if (this.phieunhapkho.makho.trim() != 'TH' && element.codenhom.trim() == '3475791'){
    //       if(element2.codenhom.trim() == '3475791'){
    //   curr_cost = curr_cost - 50000;
    //     gia_theo_loai = curr_cost - 70000;
    //       }
    // }
              break;
          }
            
              // console.log(curr_cost  );
             }
             
           }
          
            let  thetichQC1 = roundNumber(element2.KLKHO*roundNumber(element2.SOTHANH/element.SL_MAU,4),4)*hc_gapdoi;
            
           
          // tongthanhtien += roundNumber(gia_theo_loai*thetichQC ,0);
            
            const payload = {
                       
                         id:element2.ID,
                        DONGIA_CTY:curr_cost,
                        DONGIA_LOAI:gia_theo_loai
                                             
                    }
                   
          const data = await this.$store.dispatch('nlg/UPDATE_HA_CAP',payload)
           eldata+=`
            <tr style="background-color: lightgray" >
              <td rowspan="" style="" id="sttid"></td>
              <td><span id="phanloai">${element2.TYPENAME}</span></td>
              <td >${element2.DAY}</td>
              <td >${element2.RONG}</td>
              <td >${element2.CAO}</td>
              <td ></td>
              <td ></td>
              <td >${element2.SOTHANH}</td>
              <td >${roundNumber((Tyle * 100),1)} %</td>
              <td style="text-align:center;">${thetichQC.toFixed(2)}</td>
              <td style="text-align:center;"></td>
              <td >${note}</td>
              <td style="text-align:center;">${element2.MANVL}</td>
              <td style="text-align:right;">${formatNumber(element2.COST)}</td>
              <td style="text-align:right;">${formatNumber(gia_theo_loai)}</td>
              <td style="text-align:right;">${formatNumber(roundNumber(gia_theo_loai*thetichQC.toFixed(2),0))}</span></td>
              <td></td>
              <td>${element2.NOTE?element2.NOTE:''}</td>
          </tr>
          `
         }
         }
       }
     tongCongThanhTien += tongthanhtien;
        tongtientb += roundNumber(tongthanhtien/(roundNumber(element.KLKHO,2)),0)
      }
     this.tongtienchuathue = roundNumber((tongCongThanhTien + this.hotrokhac+this.hotropallet),0);
        this.tongthanhtoan = roundNumber(((tongCongThanhTien + this.hotrokhac+this.hotropallet)*this.xuathd),0);
       // console.log(this.tongthanhtoan)
        this.klkho = roundNumber(tongTheTichKho,2);
        this.klqc = roundNumber(tongTheTichQC,2);
        this.dongiatb = roundNumber((tongCongThanhTien/roundNumber(tongTheTichKho,2)),0)
        this.tylechinhpham = tylechinhpham;
         if (this.phieunhapkho.COHD.trim() == 'Y') 
             {
            xuathoadon = `
             <td colspan="15" style="text-align:right;color:red">Đơn giá xuất hóa đơn :</td>
            <td colspan="3" style="text-align:center;color:red" >${formatNumber(roundNumber((tongCongThanhTien + this.hotrokhac+this.hotropallet)/tongTheTichKho,0))}</td>
          `
             }
          else{
            xuathoadon = `
            
          `
          }
        eltotal=`<tr>
                  <td colspan="9" style="text-align:right;"><strong>Tổng thể tích các quy cách gỗ được nhập :</strong></td> 
                  <td style="text-align:center;"><span id="tongthetichnhap">${roundNumber(tongTheTichQC,2)}</span></td>   
                  <td  style="background-color:cadetblue;"><strong id="tongthetichkho">${roundNumber(tongTheTichKho,2)}</strong></td> 
                  <td colspan="4" style="background-color:cadetblue;"><strong>Tổng cộng :</strong></td> 
                  <td style="text-align:right"><span style="color:red" id="tongcong">${formatNumber(roundNumber(tongCongThanhTien,0))}</span></td> 
                  <td style="text-align:right"><span style="color:red" id="dongiatb">${formatNumber(roundNumber(this.dongiatb,0))}</span></td> 
                  <td></td>
              </tr>
              <tr>
                  <td colspan="9" style="text-align:right;"><strong>Tổng thể tích các quy cách gỗ bị loại được thanh toán :</strong></td> 
                  <td style="text-align:center;">${roundNumber(tongTheTichQCCP - tongTheTichQC,4)}</td>
                  <td colspan="5" style="text-align:right;color:red">Hỗ trợ khác :</td>
                  <td colspan="4" style="text-align:center;color:red" >${formatNumber(roundNumber(this.hotrokhac,0))}</td>
                  
              </tr>
              <tr>
                  <td colspan="9" style="text-align:right;"><strong>Tổng thể tích quy cách gỗ nhập được thanh toán :</strong></td> 
                  <td style="text-align:center;">${roundNumber(tongTheTichQCCP,4)}</td>
                  <td colspan="5" style="text-align:right;color:red">Hỗ trợ Pallet :</td>
                  <td colspan="4" style="text-align:center;color:red" >${formatNumber(roundNumber(this.hotropallet,0))}</td>
              </tr>
              
              <tr>
                  <td colspan="9" style="text-align:right;"><strong>Tỷ lệ chính phẩm của lô hàng :</strong></td> 
                  <td style="text-align:center;">${tylechinhpham}%</td>
                      <td colspan="5" style="text-align:right;color:red">Tổng tiền chưa thuế :</td>
                  <td colspan="4" style="text-align:center;color:red" >${formatNumber(this.tongtienchuathue)}</td>
               
              </tr>
               <tr>
                  <td colspan="10" style="text-align:right;"><strong></strong></td> 
                  <td colspan="5" style="text-align:right;color:red">Thuế 10% :</td>
                  <td colspan="4" style="text-align:center;color:red" >${formatNumber(roundNumber((tongCongThanhTien + this.hotrokhac+this.hotropallet)*(this.xuathd - 1),0))}</td>
              </tr>
              <tr>
                  <td colspan="10" style="text-align:right;"><strong></strong></td> 
                  <td colspan="5" style="text-align:right;color:red">Tổng thanh toán :</td>
                  <td colspan="4" style="text-align:center;color:red" >${formatNumber(roundNumber((tongCongThanhTien + this.hotrokhac+this.hotropallet)*this.xuathd,0))}</td>
              </tr>
              <br />
              <br />
              <br />
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
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:nowrap; width:68pt"
                  >
                    <strong>MÃ NVL</strong>
                  </td>
                  <!-- <td rowspan="3" style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:59pt"><strong>Phân loại<br>&nbsp;L1;L2</strong></td> -->
                  <!-- <td rowspan="3" style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:44pt"><strong>Mã<br>sản phẩm</strong></td> -->
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:72pt"
                  >
                    <strong>
                      Đơn giá
                      <br />phê duyệt (VNĐ)
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