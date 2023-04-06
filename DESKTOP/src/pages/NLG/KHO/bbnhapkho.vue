
     <template>
  <q-page class="q-pa-md">
      <!-- <q-card class="my-card"> -->
          <q-card-section>
           
            <table style="width:100%;font-family: 'Times New Roman'" >
             <tr>
        <td class="col-10 top-title" align="center" style="border-bottom:0px solid black; border-left:0px solid black; border-right:0px solid black; border-top:0px solid black; height:21px; vertical-align:bottom; white-space:nowrap">
             BIÊN BẢN NGHIỆM THU GỖ XẺ TƯƠI
                    <br>
                    (Kiêm phiếu nhập kho)
                    
            </td>
        <td style="border-bottom:0px solid black; border-left:0px solid black; border-right:0px solid black; border-top:0px solid black; height:21px; vertical-align:bottom; white-space:nowrap">
             BM-COC-01B
                    <br>
                    Ngày ban hành:20/06/2018
                    <br>
                    Lần ban hành: 02
            </td>
        </tr>
        </table>
          </q-card-section>
        
          <q-card-section>
         
              <table border="1" cellspacing="0" style="width:100%;font-family: 'Times New Roman'" >
    <tbody>
        <tr>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; height:21px; vertical-align:bottom; white-space:nowrap">
            <b>Đơn vị giao hàng :</b>&nbsp; {{phieunhapkho.name}}
            </td>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; height:21px; vertical-align:bottom; white-space:nowrap">
            Số phiếu : {{phieunhapkho.sophieu}}
            </td>
        </tr>
        <tr>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
            <b>Địa chỉ : </b>{{phieunhapkho.NCC_ADDRESS}}
            </td>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
            Biển số xe: {{phieunhapkho.BIENSOXE}}</td>
        </tr>
        <tr>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
            <b>Kho nhập : </b>{{phieunhapkho.tenkho}}</td>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
            Ngày Nhập : {{phieunhapkho.ngaynhapht}}</td>
        </tr>
        <tr>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
            <b>Trạng thái MT</b>: FSC100%&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Nhóm SP:  W5</td>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
            Mã lô gỗ nhập :{{phieunhapkho.MALOGONHAP}}</td>
        </tr>
        <tr>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
             <b>Loại gỗ: Acacia Mangium</b></td>
           <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
           </td>
        </tr>
    </tbody>
    </table>
   </q-card-section>
        
         <q-card-section>

            <!-- start table thứ 3 -->
            <div v-html="table"></div>
            <!-- end tablet thứ 3 -->
            </q-card-section>
            
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
                Đại diện bên giao
                <br />
                <br />
                <br />
              </div>
              <div class="col-3">
                Đại diện xưởng sản xuất
                <br />
                <br />
                <br />
                <br />
                <span>{{ getDaiDienKho(phieunhapkho.sophieu)}}</span>
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
          
        
     
    <!-- </q-card> -->
    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="primary" />
    </q-page-scroller>
  </q-page>
</template>

<script>
import BoxSoPhieu from "../../../components/NLG/BoxSoPhieuInfo";
import { mapGetters } from "vuex";
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
      phieunhapkho: {},
      guid: "",
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
   
        print(){
        window.print()
    },
    formatDate(d){
      return formatDateVN(d)
    },
    go(guid){
          this.$router.push('/nlg-nghiem-thu1/')
           // this.$router.push({name:'add-nghiem-thu',params:{id:guid}})
        },
    async loadPhieu() {
      const guid = this.$route.query.guid.replace('-','/');
     // console.log(sophieu)
      if (guid) {
        this.guid = guid;
        const data = await this.$store.dispatch("nlg/GET_DS_PHIEU_NHAP_KHO3", {
          guid: guid
        });
        this.phieunhapkho = data.data[0];
      }
    },
    async loadDetail() {
      this.table=``
      let eltotal =``
      let eldata=``
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
          tylechinhpham = roundNumber(thetichQCCP/tongTheTichKho * 100,1);

        }
     
      for(let i = 0; i < cp.length; i++){
        const element = cp[i];
        let tongthanhtien = roundNumber(element.DONGIA_LOAI*roundNumber((element.KLKHO*element.QTY/element.SL_MAU),4),0);
        
           
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

            tongTheTichQCCP += roundNumber((element1.KLKHO*element1.SOTHANH/element.SL_MAU),2)*hc_gapdoi1;
            if (element1.TYPENAME.trim() !== 'Hàng Loại' ){
               
            tongTheTichQC += roundNumber((element1.KLKHO*element1.SOTHANH/element.SL_MAU),2)*hc_gapdoi1;
            }
          }
          }

        }
        tongCongThanhTien += tongthanhtien;
        tongtientb += roundNumber(tongthanhtien/(element.KLKHO),0)
       // thetichQCCP += roundNumber((element.KLKHO*element.QTY/element.SL_MAU),4)
       eldata+=`
            <tr >
              <td rowspan="" style="text-align:center;" id="sttid">${i+1}</td>
            
              <td style="text-align:center;">${element.DAY}</td>
              <td style="text-align:center;">${element.RONG}</td>
              <td style="text-align:center;">${element.CAO}</td>
             
             
              <td style="text-align:center;">${element.SOBO}</td>
              <td style="text-align:center;">${element.SOTHANH_BO}</td>
               <td style="text-align:center;">${formatNumber(element.TONGSOTHANH)}</td>
            
              
              <td style="text-align:center;">${roundNumber(element.KLKHO,2)}</td>
               <td style="text-align:center;">${element.MALOGONHAP ? element.MALOGONHAP :''}</td>
              <td style="text-align:center;">${element.NOTE}</td>
              
          </tr>
          `
      
     
      }
      
        
        
        eltotal=`<tr>
                  <td colspan="7" style="text-align:left;"><strong>Total :</strong></td> 
                
                  
                  <td  style="background-color:cadetblue; text-align:center;"><strong id="tongthetichkho">${roundNumber(tongTheTichKho,4)}</strong></td> 
                  <td style="text-align:center;"><span id="ghichu"></span></td>   
              </tr>
              `
          
          this.table = `<table border="1" cellspacing="0" style="width:100%;font-family: 'Times New Roman'">
              <tbody id="tabledata">
                <tr>
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:13pt"
                  >
                    <strong>
                      STT
                    </strong>
                  </td>
                  
                  <td
                    colspan="3"
                    rowspan="2"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:nowrap; width:60pt"
                  >
                    <strong>Quy cách (mm)</strong>
                  </td>
                 
                   <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:40pt"
                  >
                    <strong>Số bó</strong>
                  </td>
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:20pt"
                  >
                    <strong>Số thanh/bó</strong>
                  </td>
                 <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:60pt"
                  >
                    <strong>Tổng thanh</strong>
                  </td>
                 
                 
                  <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:60pt"
                  >
                    <strong>Tổng khối lượng(m3)</strong>
                  </td>
                  <td rowspan="3" style="height:18.0pt; text-align:center; vertical-align:middle; white-space:normal; width:75pt"><strong>Mã lô gỗ</strong></td> 
                 
                   <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:nowrap; width:80pt"
                  >
                    <strong>Ghi chú</strong>
                  </td>
                 
                  
                  
                 
                </tr>
                <tr></tr>
                <tr>
                  <td
                    style="height:15.0pt;width:25pt; text-align:center; vertical-align:middle; white-space:nowrap"
                  >
                    <strong>Dày</strong>
                  </td>
                  <td
                    style="height:15.0pt;width:10pt; text-align:center; vertical-align:middle; white-space:nowrap"
                  >
                    <strong>Rộng</strong>
                  </td>
                  <td
                    style="height:15.0pt;width:25pt; text-align:center; vertical-align:middle; white-space:nowrap"
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