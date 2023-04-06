<template>
  <q-page class="q-pa-sm">
    <!-- <app-bar class="print-hide">Biên bản</app-bar> -->
    <h6>Biên bản</h6>
    <div id="topbb" class="row justify-center">
      <div class="col-3" align="left">
        <img src="/statics/app-logo-128x128.png" alt />
      </div>
      <div class="col-9 q-pa-md">
        <p class="woodText">QUY TÌNH KIỂM TRA TIẾP NHẬN</p>
        <p class="bbTitle" style="text-align:left !important">BIÊN BẢN TÍNH TIỀN NHẬP VÁN BÓC</p>
      </div>
    </div>
    <q-separator class="q-mt-sm"></q-separator>
    
    <div class="row q-ma-sm">
      <div class="col-12">
        <!-- <q-ribbon type="corner"
        position="top-right"
        color="#ffffff"
        background-color="#027BE3"
        leaf-position="bottom"
         glow>
            Đã Duyệt
        </q-ribbon> -->
        <table
          cellspacing="0"
          style="border-collapse:collapse; width:100%;font-family:'Time New Roman'"
          class="cke_show_border"
        >
          <tbody>
            <tr>
              <td
                colspan="3"
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:.7px solid black; border-top:1px solid black; height:24px; text-align:center; vertical-align:bottom; white-space:nowrap; width:145px"
              >
                <strong>Nhân viên kiểm tra</strong>
              </td>
              <td
                colspan="2"
                style="border-bottom:1px solid black; border-left:none; border-right:.7px solid black; border-top:1px solid black; text-align:center; vertical-align:bottom; white-space:nowrap; width:81px"
              >
                <strong>Chức vụ</strong>
              </td>
              <td
                colspan="2"
                style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:bottom; white-space:nowrap; width:136px"
              >
                <strong>Thời gian lập biên bản</strong>
              </td>
              <td
                colspan="6"
                style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:bottom; white-space:nowrap; width:412px"
              >
                <strong>Đại diện nhà cung cấp</strong>
              </td>
              <td
                colspan="2"
                style="border-bottom:1px solid black; border-left:none; border-right:.7px solid black; border-top:1px solid black; text-align:center; vertical-align:bottom; white-space:nowrap; width:134px"
              >
                <strong>Số phiếu</strong>
              </td>
            </tr>
            <tr>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:24px; text-align:center; vertical-align:middle; white-space:nowrap"
              >1</td>
              <td
                colspan="2"
                style="border-bottom:1px solid black; border-left:none; border-right:.7px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:nowrap"
              >{{receipt.QC_SATFF_NAME}}</td>
              <td
                colspan="2"
                style="border-bottom:1px solid black; border-left:none; border-right:.7px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:nowrap"
              >NV QC</td>
              <td
                colspan="2"
                style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:nowrap"
              >{{receipt.RECEIPT_DATE}}</td>
              <td
                style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:nowrap"
              >Họ tên</td>
              <td
                colspan="5"
                style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:nowrap"
              >{{receipt.VENDOR_NAME}}</td>
              <td
                colspan="2"
                style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:nowrap"
              >
                <strong>{{receipt.YEAR}}.{{receipt.NUMBER_OF_MONTH}}/{{receipt.MONTH}}{{receipt.WH_CODE}}</strong>
              </td>
            </tr>
            <tr>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:24px; text-align:center; vertical-align:middle; white-space:nowrap"
              >2</td>
              <td
                colspan="2"
                style="border-bottom:1px solid black; border-left:none; border-right:.7px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:nowrap"
              >{{receipt.WH_STAFF_NAME}}</td>
              <td
                colspan="2"
                style="border-bottom:1px solid black; border-left:none; border-right:.7px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:nowrap"
              >Thủ kho</td>
              <td
                colspan="2"
                style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:nowrap"
              >{{receipt.RECEIPT_DATE}}</td>
              <td
                style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:nowrap"
              >Địa chỉ</td>
              <td
                colspan="5"
                style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:nowrap"
              >{{receipt.VENDOR_ADDRESS}}</td>
              <td
                style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:nowrap"
              >Hiệu lực SD: 6/12/14</td>
              
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row q-ma-sm">
      <div class="col-12" v-html="elbind">
        
      </div>
    </div>
    <div class="row justify-around q-mt-md">
      <div class="col-3 prodTextTitle">Kế toán</div>
      <div class="col-3 prodTextTitle">Bộ phận Nguyên liệu gỗ</div>
    </div>
  </q-page>
</template>

<script>
import { sortParent,roundNumber,formatNumber, formatDateVN } from "../../ultils";
export default {
  components: {
  },
  data() {
    return {
      receipt: {},
      payInfo: [],
      sortArr: [],
      elbind:'',
      changePrice : false,
      AVGAmount:0,
      taxVAT: 0,
      insRate:0,
      totalAmount:0,
      totalWHVolumn:0,
      totalQCVolumn:0,
      payRate:0,
      payInfoData:{}
    };
  },
  created() {
    let receiptId = this.$route.params.id;
    Promise.all([
      this.loadReceiptInfo(receiptId),
      this.loadPay(receiptId),
      this.loadPayCompleted(receiptId)
    ]).then(res => {
      this.compareArray()
    });
    setTimeout(() => {
      this.showPrintPreview()
    }, 3000);
  },
  computed:{
    formatDate(str){
      return formatDateVN(str)
    }
  },
  watch:{
    changePrice(val) {
      this.compareArray()
    }
  },
  methods: {
    async completed(){
      
    },
    showPrintPreview(){
      // window.print()
    },
    goManual(){
      this.$router.push({ name: 'pay-manual', params: { id: this.$route.params.id } })
    },
    saveNewPrice(){
      
    },
    async loadReceiptInfo(id) {
      let receiptInfo = await this.$store.dispatch(
        "nlvan/GET_DETAIL_RECEIPT",
        id
      );
      this.receipt = receiptInfo.data[0];
    },
    async loadPayCompleted(id){
        let dataPay = await this.$store.dispatch(
            "nlvan/VIEW_COMPLETED_PAYMENT",
            id
        )
        this.payInfoData = dataPay.data
    },
    async loadPay(id) {
      let dataPay = await this.$store.dispatch(
        "nlvan/GET_PAYMENT_DETAIL_BY_RECEIPT_ID",
        id
      );
      this.sortArr = sortParent(dataPay.data);
      this.payInfo = dataPay.data;
    },
    compareArray(){
      
      let eldata = ``
      let arrReceipt = this.payInfoData.detail.filter((s)=>{ return s.PARENTID===0})
      let index = 1
      let totalQCVolumn =0 // tổng thể tích các qui cách gỗ được nhập
      let receiptRate = 0 // tỷ lệ chính phẩm của lô hàng
      let totalAmount = 0  // tổng thành tiền
      let totalWHVolumn = 0 // tổng thể tích nhập kho
      let totalSampletQty = 0 // Tổng số lượng lấy mẫu
      let totalGoodQty = 0 // Tổng số lượng đạt chính phẩm
      let taxVAT = 0 // Thuế GTGT 10%
      let totalTotalAmount = 0 // Tổng cộng (thuế cộng tổng tiền)
      let receiptAveAmount = 0 // đơn giá trung bình của biên bản
      arrReceipt.forEach(rc=>{
        let subTotalQCTTVolumn =0  // tổng thể tích QC được tính tiền
        let subTotalAmount = 0 // tổng thành tiền , tính cả nhập kho và hạ cấp cho mã nhập kho
        
        let totalChild = this.payInfoData.detail.filter((s)=>{ return s.PARENTID===rc.CID}).length // tổng record cho cả hạ cấp và nhập kho
        let rcQCTTVolumn = rc.QCTT_VOLUMN
        
        let totalPrice = rcQCTTVolumn*rc.COM_PRICE
        subTotalAmount+=parseInt(totalPrice)
        subTotalQCTTVolumn+=rcQCTTVolumn
        // rowspan="${totalChild+1}"
        let elins=[]
        let dataInspect = this.payInfoData.detail.filter(s=>{ return s.PARENTID===rc.CID})
        dataInspect.forEach(ins => {
          // let insPayRate = roundNumber(1-rc.PAY_RATE,2)
          let insPayRate = ins.PAY_RATE
          let insQCTTVolum = ins.QCTT_VOLUMN
          let insAmount = ins.AMOUNT
          // if (ins.PAY_RATE===-1) {
          //   insPayRate =0
          // }
          
          subTotalAmount+=insAmount
          subTotalQCTTVolumn+=insQCTTVolum 
          let elInsChangePrice = `<td style="border: 1px solid black;border-collapse: collapse;">${formatNumber(ins.COM_PRICE) || 0}</td>
          <td style="border: 1px solid black;border-collapse: collapse;">${formatNumber(ins.ITYPE_PRICE) || 0}</td>`
          if (this.changePrice) {
            elInsChangePrice =`<td  style="border: 1px solid black;border-collapse: collapse;"><input value="${ins.COM_PRICE}"/></td>
            <td  style="border: 1px solid black;border-collapse: collapse;"><input value="${ins.ITYPE_PRICE}"/></td>`
          }
          let elinspect =`
            <tr style="border: 1px solid black;border-collapse: collapse;">
              <td style="border: 1px solid black;border-collapse: collapse;">${ins.INPUT_NAME}</td>
              <td style="border: 1px solid black;border-collapse: collapse;">${ins.HEIGHT}</td>
              <td style="border: 1px solid black;border-collapse: collapse;">${ins.WIDTH}</td>
              <td style="border: 1px solid black;border-collapse: collapse;">${ins.LENGTH}</td>
              <td style="border: 1px solid black;border-collapse: collapse;"></td>
              <td style="border: 1px solid black;border-collapse: collapse;"></td>
              <td style="border: 1px solid black;border-collapse: collapse;">${ins.GOOD_QTY}</td>
              <td style="border: 1px solid black;border-collapse: collapse;">${roundNumber(ins.GOOD_QTY/rc.SAMPLE_QTY*100,2)} %</td>
              <td style="border: 1px solid black;border-collapse: collapse;">${roundNumber(insPayRate*100,2)} %</td>
              <td style="border: 1px solid black;border-collapse: collapse;text-align:center;">${insQCTTVolum}</td>
              <td style="border: 1px solid black;border-collapse: collapse;"></td>
              <td style="border: 1px solid black;border-collapse: collapse;"></td>
              <td style="border: 1px solid black;border-collapse: collapse;"></td>
              ${elInsChangePrice}
              <td style="border: 1px solid black;border-collapse: collapse;">${formatNumber(insAmount)}</td>
              <td style="border: 1px solid black;border-collapse: collapse;"></td>
            </tr>
          `
          elins.push(elinspect)
        });

        
        let rcDiff = -222 // lượng chênh lệch
        let avgAmount = subTotalAmount/rc.WH_VOLUMN
       
        eldata+=`
          <tr style="border: 1px solid black;border-collapse: collapse;">
            <td style="border: 1px solid black;border-collapse: collapse;" rowspan="${totalChild+2}">${index}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${rc.INPUT_NAME}</td>
            <td style="border: 1px solid black;border-collapse: collapse;width: 30px;">${rc.HEIGHT}</td>
            <td style="border: 1px solid black;border-collapse: collapse;width: 30px;">${rc.WIDTH}</td>
            <td style="border: 1px solid black;border-collapse: collapse;width: 30px;">${rc.LENGTH}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${formatNumber(rc.TOTAL_QTY)}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${rc.SAMPLE_QTY}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${rc.GOOD_QTY}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${(rc.INS_RATE*100).toFixed(2)} %</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${(rc.PAY_RATE*100).toFixed(2)} %</td>
            <td style="border: 1px solid black;border-collapse: collapse;text-align:center;">${rc.QCTT_VOLUMN}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${rc.QC_VOLUMN}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${rc.WH_VOLUMN}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${roundNumber(rc.DIFF,4)}</td>
            <td rowspan="${totalChild+1}" style="text-align:center;border: 1px solid black;border-collapse: collapse;">${rc.NOTE}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${formatNumber(rc.COM_PRICE)}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${formatNumber(rc.ITYPE_PRICE)}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${formatNumber(rc.AMOUNT)}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${formatNumber(rc.AVERAGE_PRICE)}</td>
          </tr>
        `
        elins.forEach(element => {
          eldata+=element
        });
        totalQCVolumn+=subTotalQCTTVolumn
        totalAmount+=subTotalAmount
        totalWHVolumn+=rc.WH_VOLUMN
        totalSampletQty+=rc.SAMPLE_QUANTITY
        totalGoodQty+=rc.GOOD_QTY
        taxVAT = totalAmount*0.1
        totalTotalAmount = totalAmount+taxVAT

        
        //end for inspect
        // add row sub total
        eldata += `
          <tr style="background-color:grey">
            <td colspan="9" style="border: 1px solid black;border-collapse: collapse;"></td>
            
            <td style="border: 1px solid black;border-collapse: collapse;text-align:center;">${roundNumber(subTotalQCTTVolumn,4)}</td>
            <td colspan="6" style="border: 1px solid black;border-collapse: collapse;"></td>
            
            <td style="border: 1px solid black;border-collapse: collapse;">${formatNumber(subTotalAmount)}</td>
            <td style="border: 1px solid black;border-collapse: collapse;"></td>
          </tr>
        `

        index+=1
      })
      
    // tính tỷ lệ chính phẩm
    receiptRate=totalGoodQty/totalSampletQty
    this.insRate = receiptRate
    // đơn gái trung bình của biên bản
    receiptAveAmount = totalAmount/totalWHVolumn
   
    let elTotal = `
      <tr style="border: 1px solid black;border-collapse: collapse;">
        <td colspan="10" style="border: 1px solid black;border-collapse: collapse;text-align:right;font-weight:800">
          Tổng thể tích các quy cách gỗ được nhập
        </td>
        
        <td style="border: 1px solid black;border-collapse: collapse; text-align:center;font-weight:800">${roundNumber(totalQCVolumn,4)}</td>
        <td style="border: 1px solid black;border-collapse: collapse;"></td>
        <td style="border: 1px solid black;border-collapse: collapse; text-align:center;font-weight:800">${roundNumber(totalWHVolumn,4)}</td>
        <td colspan="2" style="border: 1px solid black;border-collapse: collapse;"></td>
        <td colspan="2" style="text-align:center;border: 1px solid black;border-collapse: collapse;"><b> Cộng</b></td>
        <td style="border: 1px solid black;border-collapse: collapse;"><b>${formatNumber(totalAmount)}</b></td>
        <td style="border: 1px solid black;border-collapse: collapse;font-weight:800"> ${formatNumber(roundNumber(receiptAveAmount,0))}</td>
      </tr>
      <tr >
        <td colspan="10" style="border: 1px solid black;border-collapse: collapse;text-align:right;font-weight:800">
          Tổng thể tích quy cách gỗ nhập được thanh toán
        </td>
        
        <td style="border: 1px solid black;border-collapse: collapse; text-align:center;font-weight:800">${roundNumber(totalQCVolumn,4)}</td>
        <td colspan="4" style="border: 1px solid black;border-collapse: collapse;"></td>
        <td colspan="2" style="text-align:center;border: 1px solid black;border-collapse: collapse;"><b>Thuế GTGT 10%</b></td>
        <td style="border: 1px solid black;border-collapse: collapse;font-weight:800">${formatNumber(taxVAT.toFixed(0))}</td>
        <td style="border: 1px solid black;border-collapse: collapse;"></td>
      </tr>
      <tr >
        <td colspan="10" style="border: 1px solid black;border-collapse: collapse;text-align:right;font-weight:800">
          Tỷ lệ chính phẩm của lô hàng
        </td>
        
        <td style="border: 1px solid black;border-collapse: collapse;text-align:center;font-weight:800">${roundNumber(roundNumber(this.payInfoData.info.INPUT_RATE,4)*100,2)} %</td>
        <td colspan="4" style="border: 1px solid black;border-collapse: collapse;"></td>
        <td colspan="2" style="text-align:center;border: 1px solid black;border-collapse: collapse;"><b>Tổng cộng</b></td>
        <td style="border: 1px solid black;border-collapse: collapse;font-weight:800">${formatNumber(totalTotalAmount.toFixed(0))}</td>
        <td style="border: 1px solid black;border-collapse: collapse;font-weight:800"></td>
      </tr>
    `



      this.elbind=`
        <table
          cellspacing="0"
          style="border-collapse:collapse; width:100%;font-family:'Time New Roman"
          class="cke_show_border"
        >
          <tbody>
            <tr>
              <td
                rowspan="3"
                style="border-bottom:.7px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; height:95px; text-align:center; vertical-align:middle; white-space:normal; width:30px"
              >
                <strong>
                  S
                  <br />T
                  <br />T
                </strong>
              </td>
              <td
                rowspan="3"
                style="border-bottom:.7px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:nowrap; width:81px"
              >
                <strong>Phân loại</strong>
              </td>
              <td
                colspan="3"
                rowspan="2"
                style="border-bottom:.7px solid black; border-left:1px solid black; border-right:.7px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:nowrap; width:115px"
              >
                <strong>Quy cách (mm)</strong>
              </td>
              <td
                rowspan="3"
                style="border-bottom:.7px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:60px"
              >
                <strong>Số thanh, K lượng giao</strong>
              </td>
              <td
                rowspan="3"
                style="border-bottom:.7px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:76px"
              >
                <strong>Số thanh, K lượng mẫu</strong>
              </td>
              <td
                rowspan="3"
                style="border-bottom:.7px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:47px"
              >
                <strong>Đạt YC, Hạ cấp, Loại</strong>
              </td>
              <td
                rowspan="3"
                style="border-bottom:.7px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:73px"
              >
                <strong>
                  Tỷ lệ (%)
                  <br />nghiệm thu
                </strong>
              </td>
              <td
                rowspan="3"
                style="border-bottom:.7px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:73px"
              >
                <strong>
                  Tỷ lệ (%)
                  <br />thanh toán
                </strong>
              </td>
              <td
                rowspan="3"
                style="border-bottom:.7px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:73px"
              >
                <strong>Thể tích theo QC TT (m3)</strong>
              </td>
              <td
                rowspan="3"
                style="border-bottom:.7px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:73px"
              >
                <strong>Thể tích theo QC (m3)</strong>
              </td>
              <td
                rowspan="3"
                style="border-bottom:.7px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:73px"
              >
                <strong>Thể tích theo kho (m3)</strong>
              </td>
              <td
                rowspan="3"
                style="border-bottom:.7px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:52px"
              >
                <strong>K lượng chênh lệch</strong>
              </td>
              <td
                rowspan="3"
                style="border-bottom:.7px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:nowrap; width:82px"
              >
                <strong>Ghi chú</strong>
              </td>
              <td
                rowspan="3"
                style="border-bottom:none; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:90px"
              >
                <strong>
                  Đơn giá
                  <br />Công ty
                </strong>
              </td>
              <td
                rowspan="3"
                style="border-bottom:none; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:86px"
              >
                <strong>
                  Đơn giá
                  <br />tính theo
                  <br />phân loại
                </strong>
              </td>
              <td
                rowspan="3"
                style="border-bottom:none; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:nowrap; width:123px"
              >
                <strong>Thành tiền</strong>
              </td>
              <td
                rowspan="3"
                style="border-bottom:none; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:103px"
              >
                <strong>
                  Đơn giá
                  <br />trung bình
                </strong>
              </td>
            </tr>
            <tr></tr>
            <tr>
              <td
                style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; height:47px; text-align:center; vertical-align:middle; white-space:nowrap"
              >
                <strong>Dày</strong>
              </td>
              <td
                style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; text-align:center; vertical-align:middle; white-space:nowrap"
              >
                <strong>Rộng</strong>
              </td>
              <td
                style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; text-align:center; vertical-align:middle; white-space:nowrap"
              >
                <strong>Dài</strong>
              </td>
            </tr>
            
           ${eldata}
           ${elTotal}
          </tbody>
        </table>
      `
    }
  }
};
</script>

<style scoped>
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
@media print {
  .print-hide,
  aside {
    display: none !important;
  }
  .q-page-container {
    padding: 0px !important;
  }
  #topbb {
    margin-top: -75px;
  }
  .bg-dark {
    background-color: grey;
  }
}
</style>