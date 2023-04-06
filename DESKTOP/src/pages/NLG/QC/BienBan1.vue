
     <template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          <q-card-section>
            <div class="row">
                <div class="col-10 top-title" align="center">
                    BẢNG KÊ VÀ SỐ LIỆU NGHIỆM THU GỖ XẺ
                    <br>
                    
                </div>
                 </div>
                  
                 
                   <div class="row justify-end">
          
              <div class="row" align="left">
                    BM-COC-01B
                    <br>
                    Ngày ban hành:20/06/2018
                    <br>
                    Lần ban hành 03
                   </div>
            </div>
          </q-card-section>
        
          
          <q-card-section>
              <BoxSoPhieu :phieunhapkho="phieunhapkho"/>
          </q-card-section>
         

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
          </div>
        </div>
      </q-card-section>
    </q-card>
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
        let tongthanhtien = roundNumber(element.DONGIA_LOAI*roundNumber((element.KLKHO*element.QTY/element.SL_MAU),2),0);
        
           
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
              <td rowspan=""  id="sttid">${i+1}</td>
              <td ><strong>Chính phẩm</strong></td>
              <td >${element.DAY}</td>
              <td >${element.RONG}</td>
              <td >${element.CAO}</td>
             
              <td >${formatNumber(element.TONGSOTHANH)}</td>
              <td >${element.SOBO}</td>
              <td >${element.SL_MAU}</td>
              <td >${element.QTY}</td>
              <td >${roundNumber((element.QTY/element.SL_MAU * 100),1)} %</td>
              <td style="text-align:center;">${roundNumber((element.KLKHO*element.QTY/element.SL_MAU),2) }</td>
              <td style="text-align:center;">${roundNumber(element.KLKHO,2)}</td>
              <td ></td>
              <td>${element.NOTE}</td>
              
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
              <td ></td>
              <td >${element2.SOTHANH}</td>
              <td >${roundNumber((Tyle * 100),1)} %</td>
              <td style="text-align:center;">${thetichQC}</td>
              <td style="text-align:center;"></td>
              <td >${note}</td>
              <td></td>
            
          </tr>
          `
         }
         }
       }
     
      }
      
        
        
        eltotal=`<tr>
                  <td colspan="9" style="text-align:left;"><strong>Total :</strong></td> 
                  <td style="text-align:center;"><span id="tongthetichnhap">${tylechinhpham}%</span></td>  
                  <td style="text-align:center;"><span id="tongthetichnhap">${roundNumber(tongTheTichQC,2)}</span></td>   
                  <td  style="background-color:cadetblue;"><strong id="tongthetichkho">${roundNumber(tongTheTichKho,2)}</strong></td> 
                 
              </tr>
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
                    <strong>Số bó</strong>
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
                    <strong>Gấp đôi</strong>
                  </td>
                   <td
                    rowspan="3"
                    style="height:18.0pt; text-align:center; vertical-align:middle; white-space:nowrap; width:68pt"
                  >
                    <strong>Ghi chú</strong>
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