(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[39],{"3f6e":function(t,e,a){"use strict";var i=a("c165"),s=a.n(i);s.a},c165:function(t,e,a){},c5b6:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("q-page",{staticClass:"q-pa-sm"},[a("div",[a("transition-group",{attrs:{appear:"","enter-active-class":"animated fadeIn","leave-active-class":"animated fadeOut"}},[a("div",{key:"1",staticClass:"row justify-center",attrs:{id:"topbb"}},[a("div",{staticClass:"col-3",attrs:{align:"left"}},[a("img",{attrs:{src:"/statics/app-logo-128x128.png",alt:""}})]),a("div",{staticClass:"col-9"},[a("p",{staticClass:"bbTitle"},[t._v("BẢNG KÊ VÀ SỐ LIỆU NGHIỆM THU VÁN BÓC")])]),a("div",{staticClass:"col-12",attrs:{align:"right"}},[t.receipt.ALLOW_PAY?a("q-btn",{staticClass:"print-hide",attrs:{color:"secondary",label:"In biên bản"},on:{click:t.print}}):a("q-btn",{attrs:{label:"Hoàn thành",color:"primary"},on:{click:function(e){t.confirm=!0}}})],1)]),a("q-separator",{key:"2",staticClass:"q-mt-sm"}),a("div",{key:"3",staticClass:"row justify-center q-mt-sm"},[a("div",{staticClass:"col-12"},[a("div",{staticClass:"prodTextNormal"},[t._v("\n                    Nhà cung cấp : "),a("strong",[t._v(t._s(t.receipt.VENDOR_NAME||"..."))])])])]),a("div",{key:"4",staticClass:"row justify-center"},[a("div",{staticClass:"col-12"},[a("div",{staticClass:"prodTextNormal"},[t._v("\n                    Địa chỉ : "),a("strong",[t._v(t._s(t.receipt.VENDOR_ADDRESS||"..."))])])])]),a("div",{key:"5",staticClass:"row justify-center"},[a("div",{staticClass:"col-12"},[a("div",{staticClass:"prodTextNormal"},[t._v("\n                    Thời gian giao hàng : "),a("strong",[t._v(t._s(t.receipt.RECEIPT_DATE||"..."))])])])]),a("div",{key:"6",staticClass:"row justify-center"},[a("div",{staticClass:"col-12"},[a("div",{staticClass:"prodTextNormal"},[t._v("\n                    Thời gian kiểm tra : "),a("strong",[t._v(t._s((new Date).toISOString().slice(0,10)||"..."))])])])]),a("div",{key:"7",staticClass:"row justify-center q-ma-sm"},[a("table",{staticStyle:{width:"100%","font-family":"'Time New Roman'"}},[a("tr",[a("th",{staticClass:"text-center",staticStyle:{width:"10px","text-align":"center"},attrs:{rowspan:"2",colspan:"1"}},[t._v("STT")]),a("th",{attrs:{rowspan:"2",colspan:"1"}},[t._v("Phân loại")]),a("th",{staticClass:"text-center",attrs:{rowspan:"1",colspan:"3"}},[t._v("Qui cách(mm)")]),a("th",{staticClass:"text-center",attrs:{rowspan:"2",colspan:"1"}},[t._v("Số bó giao(bó)")]),a("th",{staticClass:"text-center",attrs:{rowspan:"2",colspan:"1"}},[t._v("SL mẫu kiểm tra(tờ)")]),a("th",{staticClass:"text-center",attrs:{rowspan:"2",colspan:"1"}},[t._v("Số tờ loại(tờ)")]),a("th",{staticClass:"text-center",attrs:{rowspan:"2",colspan:"1"}},[t._v("Tỷ lệ(%)")]),a("th",{staticClass:"text-center",attrs:{rowspan:"2",colspan:"1"}},[t._v("Loại gỗ")]),a("th",{staticClass:"text-center",attrs:{rowspan:"2",colspan:"1"}},[t._v("Ghi chú")])]),a("tr",[a("th",[t._v("Dày")]),a("th",[t._v("Rộng")]),a("th",[t._v("Dài")])]),t._l(t.dataDetail,(function(e,i){return a("tr",{key:i},["INPUT"===e.itype?a("td",{staticStyle:{"text-align":"center"},attrs:{rowspan:e.totalChild+1}},[t._v(t._s(e.STT))]):t._e(),"INPUT"===e.itype?a("td",{staticStyle:{"text-align":"center"}},[a("span",{staticClass:"fake-link",on:{click:function(a){return t.goEdit(e.id)}}},[t._v(t._s(e.type))])]):t._e(),"INSPECT"===e.itype?a("td",{staticStyle:{"text-align":"center"}},[a("span",{staticClass:"fake-link",on:{click:function(a){return t.goEdit(e.receiptDltId)}}},[t._v(t._s(e.type))])]):t._e(),"NULL"!==e.itype?a("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(e.itemHeight))]):t._e(),"NULL"!==e.itype?a("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(e.itemWidth))]):t._e(),"NULL"!==e.itype?a("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(e.itemLength))]):t._e(),"NULL"!==e.itype?a("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(e.packageQuantity>0?t.format(e.packageQuantity):"-"))]):t._e(),"NULL"!==e.itype?a("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(e.sampleQty>0?t.format(e.sampleQty):"-"))]):t._e(),"NULL"!==e.itype?a("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(e.defectQty>0?e.defectQty:"-"))]):t._e(),"NULL"!==e.itype?a("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(e.insRate?(100*e.insRate).toFixed(2):(e.defectQty/t.dataDetail[0].sampleQty*100).toFixed(2))+" %")]):t._e(),"INPUT"===e.itype?a("td",{staticStyle:{"text-align":"center"},attrs:{rowspan:e.totalChild+1}},[t._v(t._s(e.woodType))]):t._e(),"INPUT"===e.itype?a("td",{staticStyle:{"text-align":"center"},attrs:{rowspan:e.totalChild+1}},[a("div",{domProps:{innerHTML:t._s(e.insNote)}})]):t._e(),"NULL"===e.itype?a("td",{staticStyle:{"text-align":"center"},attrs:{colspan:"11"}},[0===e.packageQuantity?a("router-link",{attrs:{to:{name:"add-inspection",params:{id:e.receiptId}}}},[t._v("Nhấn để nghiệm thu")]):a("router-link",{attrs:{to:{name:"edit-inspection",params:{id:e.receiptId}}}},[t._v("Nhấn để sửa")])],1):t._e()])})),t.detail.length>0?a("tr",{staticStyle:{"background-color":"darkgray"}},[a("td",{staticClass:"text-center",attrs:{colspan:"5"}},[t._v("Tổng cộng")]),a("td",{staticClass:"text-right",staticStyle:{"text-align":"center"}},[t._v(t._s(t.sumPackage))]),a("td",{staticClass:"text-right"}),a("td"),a("td"),a("td"),a("td")]):a("tr",[a("td",{staticStyle:{"text-align":"center"},attrs:{colspan:"11"}},[t._v("\n                        không có dữ liệu !\n                    ")])])],2)]),a("div",{key:"8",staticClass:"row"},[a("div",{staticClass:"col-4"},[a("p",{staticClass:"woodText",staticStyle:{"font-weight":"800"}},[t._v("\n                    Đại diện Nhà cung cấp\n                ")])]),a("div",{staticClass:"col-4"},[a("p",{staticClass:"woodText",staticStyle:{"font-weight":"800"}},[t._v("\n                    Đại diện xưởng sản xuất\n                ")])]),a("div",{staticClass:"col-4"},[a("p",{staticClass:"woodText",staticStyle:{"font-weight":"800"}},[t._v("\n                    Người kiểm tra\n                ")])])])],1)],1),a("q-dialog",{attrs:{persistent:""},model:{value:t.confirm,callback:function(e){t.confirm=e},expression:"confirm"}},[a("q-card",{staticStyle:{"min-width":"90%"}},[a("q-card-section",{staticClass:"row items-center"},[a("span",{staticClass:"q-ml-sm prodTextTitle"},[t._v("Bạn đã chắc chắn ?")])]),a("q-card-actions",{attrs:{align:"right"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Hủy",color:"primary"}}),a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Đồng ý",color:"primary"},on:{click:t.completed}})],1)],1)],1),a("q-inner-loading",{attrs:{showing:t.isLoading}},[a("q-spinner-gears",{attrs:{size:"150px",color:"primary"}})],1)],1)},s=[],n=(a("20d6"),a("a34a")),r=a.n(n),c=(a("96cf"),a("c973")),o=a.n(c),l=(a("7514"),a("fa7d")),p={data:function(){return{receipt:{},dataDetail:[],detail:[],visible:!0,confirm:!1,isLoading:!0}},created:function(){this.loadReceipt()},computed:{numberReceipt:function(){return this.receipt?this.receipt.YEAR+"."+this.receipt.NUMBER_OF_MONTH+"/"+this.receipt.MONTH:"....."},sumPackage:function(){var t=0;return this.dataDetail.length>0&&this.dataDetail.forEach((function(e){t+=parseInt(e.packageQuantity)})),Object(l["d"])(t)}},methods:{goEdit:function(t){if(!1===this.receipt.ALLOW_PAY&&0===this.receipt.LOCK){var e=this.dataDetail.find((function(e){return e.id===t}));e.sampleQty&&e.sampleQty>0?this.$router.push({name:"edit-inspection",params:{id:t}}):this.$router.push({name:"add-inspection",params:{id:t}})}else this.$q.notify({message:"Biên bản đã khóa !"})},print:function(){window.print()},format:function(t){return t?Object(l["d"])(t):0},completed:function(){var t=this;return o()(r.a.mark((function e(){var a,i;return r.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a={receiptDetailId:t.$route.params.id,data:{allowPay:1,allowInspection:0,delFlag:"N",qcCompleted:!0}},e.next=3,t.$store.dispatch("wood/UPDATE_WH_RECEIPT",a);case 3:i=e.sent,i.data[0].RESULT?(t.$q.notify({message:"Thành công !",color:"green"}),t.$router.push("/wood-list-receipt")):t.$q.notify({message:i.data[0].MESSAGE,color:"red"});case 5:case"end":return e.stop()}}),e)})))()},initData:function(){return o()(r.a.mark((function t(){return r.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:case"end":return t.stop()}}),t)})))()},loadReceipt:function(){var t=this;return o()(r.a.mark((function e(){var a,i;return r.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a=t.$route.params.id,e.next=3,t.$store.dispatch("wood/GET_DETAIL_RECEIPT",a);case 3:if(i=e.sent,!i.data[0]){e.next=10;break}return t.receipt=i.data[0],t.visible=!1,e.next=9,t.loadDetailReceipt(t.receipt.ID);case 9:t.loadInspection(t.receipt.ID);case 10:t.visible=!1;case 11:case"end":return e.stop()}}),e)})))()},loadDetailReceipt:function(t){var e=this;return o()(r.a.mark((function a(){var i;return r.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,e.$store.dispatch("wood/GET_DETAIL_RECEIPT_BY_RECEIPT",t);case 2:i=a.sent,e.detail=i.data;case 4:case"end":return a.stop()}}),a)})))()},loadInspection:function(t){var e=this;return o()(r.a.mark((function a(){var i,s,n;return r.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,e.$store.dispatch("wood/GET_INSPECTION_BY_RECEIPT_ID",t);case 2:i=a.sent,s=[],n=1,e.detail.forEach((function(t){var e={id:t.ID,itype:"INPUT",type:t.PHANLOAI,itemHeight:t.HEIGHT,itemWidth:t.WIDTH,itemLength:t.LENGTH,pcsPerPackage:t.PCS_PER_PACKAGE,packageQuantity:t.PACKAGE_QUANTITY,sampleQty:t.SAMPLE_QTY,volumn:t.VOLUMN,defectQty:0,rateA:Object(l["k"])(100*t.RATE_A,2),rateB:Object(l["k"])(100*t.RATE_B,2),rateC:Object(l["k"])(100*t.RATE_C,2),insNote:t.INS_NOTE,totalChild:0,woodType:t.WOOD_TYPE,STT:n};n+=1;var a=0;if(s.push(e),i.data[0].length>0)if(-1!==i.data[0].findIndex((function(e){return e.RECEIPT_ID===t.ID}))){i.data[0].forEach((function(e){if(e.RECEIPT_ID===t.ID){var i=e.WOOD_TYPE,n='\n                                    <p class="woodText">'.concat(i,"</p>\n                                "),r={id:e.ID,itype:"INSPECT",type:e.TYPE,itemHeight:e.HEIGHT,itemWidth:e.WIDTH,itemLength:e.LENGTH,pcsPerPackage:"",packageQuantity:0,sampleQty:"",volumn:0,defectQty:e.DEFECT_QTY,rateA:t.SAMPLE_QUANTITY?100-(e.DEFECT_QTY/t.SAMPLE_QUANTITY*100).toFixed(2):"",rateB:t.SAMPLE_QUANTITY?(e.DEFECT_QTY/t.SAMPLE_QUANTITY*100).toFixed(2):"",receiptDltId:e.RECEIPT_ID,note:n,insRate:e.DEFECT_QTY<=0?e.PAY_RATE:e.DEFECT_QTY/t.SAMPLE_QTY};s.push(r),a+=e.DEFECT_QTY/t.SAMPLE_QTY}}));var r=s.findIndex((function(e){return e.id===t.ID}));s[r].totalChild=i.data[0].filter((function(e){return e.RECEIPT_ID===t.ID})).length,s[r].insRate=1-a}else{var c={itype:"NULL",receiptId:t.ID,rateB:null,rateA:null,packageQuantity:0};s.push(c)}else{var o={itype:"NULL",receiptId:t.ID,rateB:null,rateA:null,packageQuantity:0};s.push(o)}})),e.dataDetail=s,e.isLoading=!1;case 8:case"end":return a.stop()}}),a)})))()}}},d=p,u=(a("3f6e"),a("2877")),_=a("9989"),h=a("9c40"),v=a("eb85"),f=a("24e8"),g=a("f09f"),T=a("a370"),y=a("4b7e"),m=a("74f7"),E=a("cf57"),C=a("7f67"),w=a("eebe"),I=a.n(w),x=Object(u["a"])(d,i,s,!1,null,"9813f834",null);e["default"]=x.exports;I()(x,"components",{QPage:_["a"],QBtn:h["a"],QSeparator:v["a"],QDialog:f["a"],QCard:g["a"],QCardSection:T["a"],QCardActions:y["a"],QInnerLoading:m["a"],QSpinnerGears:E["a"]}),I()(x,"directives",{ClosePopup:C["a"]})}}]);