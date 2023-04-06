<template>
  <q-page class="q-pa-sm">
    <app-bar class="print-hide">Biên bản</app-bar>
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
    <div class="row justify-end q-mt-md print-hide">
      <div class="col-2">
        <q-btn @click="reject" color="amber" style="font-family:'Time New Roman'" glossy label="Từ chối" />
      </div>
      <div class="col-2">
        <q-btn color="primary" @click="completed"  style="font-family:'Time New Roman'" glossy label="Duyệt biên bản" />
      </div>
      <!-- <div class="col-2">
        <q-btn color="secondary" @click="saveChange"  style="font-family:'Time New Roman'" glossy label="Lưu đơn giá" />
      </div> -->
    </div>
    <div class="row q-ma-sm">
      <div class="col-12">
        <q-ribbon type="corner"
        position="top-right"
        color="#ffffff"
        background-color="#027BE3"
        leaf-position="bottom"
         glow>
            Duyệt biên bản
        </q-ribbon>
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
import AppBar from "../../components/AppBar";
import {QSpinnerIos} from 'quasar'
import { sortParent,roundNumber,formatNumber, formatDateVN } from "../../utils/utils";
export default {
  components: {
    "app-bar": AppBar
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
    };
  },
  created() {
    let receiptId = this.$route.params.id;
    Promise.all([
      this.loadReceiptInfo(receiptId),
      this.loadPay(receiptId)
    ]).then(res => {
      this.compareArray()
    });
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
      this.$q.loading.show({
        spinner:QSpinnerIos,
        spinnerSize:150,
        spinnerColor:'primary',
        message:'Vui lòng chờ ......',
        messageColor:'blue'
      })
      let listItem = ''
      let listQty =''
      if (this.sortArr.length>1) {
         for (let i = 0; i < this.sortArr.length; i++) {
          if (this.sortArr[i].ICODE==='INP') {
            listItem+=this.sortArr[i].ITEM_ID+','
            listQty +=this.sortArr[i].TOTAL_QTY+','
          }
        }
        listItem.slice(0,listItem.length-1)
        listQty.slice(0,listQty.length-1)
      }else {
        listItem = this.sortArr[0].ITEM_ID
        listQty =this.sortArr[0].TOTAL_QTY
      }
      let payload = {
        id: this.$route.params.id,
        data:{
          arr:this.sortArr,
          total: {
            totalAmount: this.totalAmount,
            totalWHVolumn: this.totalWHVolumn,
            totalQCVolumn:this.totalQCVolumn,
            AVGAmount: this.AVGAmount,
            insRate: this.insRate,
            payRate:this.payRate,
            taxVAT:this.taxVAT
          },
          manual:0,
        },
        pallet:{
          sourceId:this.$store.getters['base/mySources'][0].id,
          destinationId:this.$store.getters['base/myDestinations'][0].id,
          itemId:listItem,
          quantity:listQty
        },
      }
      let data  = await this.$store.dispatch('wood/COMPLETED_PAYMENT',payload)
      this.$q.loading.hide()
      if (data.meta.success===true) {
        this.$q.notify({
          message:'Thành công !',
          color:'green'
        })
        this.$router.push({name:'view-payment-completed',params:{'id':this.$route.params.id}})
      }
    },
    saveChange(){

    },
    async reject(){
      const data = await this.$store.dispatch('nlvan/REJECT_BB',receiptId)
    },
    goManual(){
      // this.changePrice=true
      let payload = {
        info:this.receipt,
        total: {
          totalQCVolumn:this.totalQCVolumn,
          totalWHVolumn:this.totalWHVolumn,
          insRate:this.insRate,
          AVGAmount:this.AVGAmount
        },
        detail:this.sortArr
      }
      this.$store.dispatch('wood/STORE_PAY_CALCUTALOR',payload)
      this.$router.push({ name: 'pay-manual', params: { id: this.$route.params.id } })
    },
    saveNewPrice(){
      
    },
    async loadReceiptInfo(id) {
      let receiptInfo = await this.$store.dispatch(
        "wood/GET_DETAIL_RECEIPT",
        id
      );
      this.receipt = receiptInfo.data[0];
    },
    async loadPay(id) {
      let dataPay = await this.$store.dispatch(
        "wood/GET_PAYMENT_DETAIL_BY_RECEIPT_ID",
        id
      );
      this.sortArr = sortParent(dataPay.data);
      this.payInfo = dataPay.data;
    },
    compareArray(){
      
      let eldata = ``
      let arrReceipt = this.sortArr.filter((s)=>{ return s.PARENTID===0})
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
      let tongTyLeThanhToan = 0
      arrReceipt.forEach(rc=>{
        let subTotalQCTTVolumn =0  // tổng thể tích QC được tính tiền
        let subTotalAmount = 0 // tổng thành tiền , tính cả nhập kho và hạ cấp cho mã nhập kho
        let tongTyLeTinhTienCuaHaCap = 0
        
        let totalChild = this.sortArr.filter(s=>{return s.PARENTID===rc.CID}).length // tổng record cho cả hạ cấp và nhập kho
        
        
        
        
        
        
        let rateA = rc.RATE_A
        // rowspan="${totalChild+1}"
        let elins=[]
        
        let dataInspect = this.sortArr.filter(s=>{return s.PARENTID===rc.CID})
        dataInspect.forEach(ins => {
          let itemIndex = this.sortArr.findIndex((s)=>{ return s.CID === ins.CID})
          
          let insPayRate = ins.PAY_RATE
          tongTyLeTinhTienCuaHaCap+=insPayRate
          let insQCTTVolum = roundNumber(insPayRate*ins.ITEM_VOLUMN*rc.TOTAL_QTY,4)
          
          // gán ngược lại model
          this.sortArr[itemIndex].QCTTVolum =insQCTTVolum
         
          this.sortArr[itemIndex].ITYPE_PRICE = ins.COM_PRICE > 0 ? ins.COM_PRICE+ins.OUT_PRICE : 0
          this.sortArr[itemIndex].ICODE = 'INS'
          this.sortArr[itemIndex].NOTE = ' '
         
          let insAmount = roundNumber(ins.ITYPE_PRICE* insQCTTVolum,0)
          this.sortArr[itemIndex].Amount = insAmount
          subTotalAmount+=insAmount
          subTotalQCTTVolumn+=parseFloat(insQCTTVolum)
          let elInsChangePrice = `<td style="border: 1px solid black;border-collapse: collapse;">${formatNumber(ins.COM_PRICE) || 0}</td>
          <td style="border: 1px solid black;border-collapse: collapse;">${formatNumber(ins.ITYPE_PRICE) || 0}</td>`
         
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
        
        tongTyLeThanhToan=tongTyLeTinhTienCuaHaCap+rc.PAY_RATE
        if (tongTyLeThanhToan>1) {
          rc.PAY_RATE = 1-tongTyLeTinhTienCuaHaCap
        }
       
        let rcQCTTVolumn = roundNumber(rc.PAY_RATE*rc.ITEM_VOLUMN*rc.PCS_PER_PACKAGE*rc.PACKAGE_QUANTITY,4)
        let totalPrice = rcQCTTVolumn*rc.COM_PRICE
        subTotalAmount+=parseInt(totalPrice)
        subTotalQCTTVolumn+=rcQCTTVolumn
        let rcDiff = rc.WH_VOLUMN - subTotalQCTTVolumn // lượng chênh lệch
        let avgAmount = subTotalAmount/rc.WH_VOLUMN
        let rcIndex = this.sortArr.findIndex((s)=>{return s.CID === rc.CID})
        this.sortArr[rcIndex].rcDiff =rcDiff
        this.sortArr[rcIndex].ICODE ='INP'
        this.sortArr[rcIndex].QCTTVolum =rcQCTTVolumn
        this.sortArr[rcIndex].Amount = totalPrice
        this.sortArr[rcIndex].avgAmount = roundNumber(avgAmount,0)
        this.sortArr[rcIndex].ITYPE_PRICE = formatNumber(rc.COM_PRICE+rc.OUT_PRICE)
        let rcNote  = `${rc.WOOD_TYPE} ${rc.DTYPE==='K' ? ' Khô' : ' Tươi'}`
        this.sortArr[rcIndex].NOTE = rcNote
        let elRcComPrice =`<td style="border: 1px solid black;border-collapse: collapse;">${formatNumber(rc.COM_PRICE) || 0}</td>
        <td style="border: 1px solid black;border-collapse: collapse;">${formatNumber(rc.ITYPE_PRICE) || 0}</td>`
        if (this.changePrice) {
          elRcComPrice = `<td  style="border: 1px solid black;border-collapse: collapse;">???</td>
          <td  style="border: 1px solid black;border-collapse: collapse;"><input value="${rc.ITYPE_PRICE}"/></td>`
        }
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
            <td style="border: 1px solid black;border-collapse: collapse;text-align:center;">${rcQCTTVolumn}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${rc.QC_VOLUMN}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${rc.WH_VOLUMN}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${roundNumber(rcDiff,4)}</td>
            <td rowspan="${totalChild+2}" style="text-align:center;border: 1px solid black;border-collapse: collapse;">${rcNote}</td>
            ${elRcComPrice} 
            <td style="border: 1px solid black;border-collapse: collapse;">${formatNumber(totalPrice).toString().split('.')[0]}</td>
            <td style="border: 1px solid black;border-collapse: collapse;">${formatNumber(roundNumber(avgAmount,0))}</td>
          </tr>
        `
        elins.forEach(element => {
          eldata+=element
        });
        totalQCVolumn+=subTotalQCTTVolumn
        totalAmount+=subTotalAmount
        totalWHVolumn+=rc.WH_VOLUMN
        totalSampletQty+=rc.SAMPLE_QTY
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
    this.AVGAmount = roundNumber(receiptAveAmount,0)
    this.totalWHVolumn =roundNumber(totalWHVolumn,4)
    this.totalQCVolumn = roundNumber(totalQCVolumn,4)
    this.taxVAT = roundNumber(taxVAT,0)
    this.totalAmount = totalAmount
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
        
        <td style="border: 1px solid black;border-collapse: collapse;text-align:center;font-weight:800">${roundNumber(roundNumber(receiptRate,4)*100,2)} %</td>
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