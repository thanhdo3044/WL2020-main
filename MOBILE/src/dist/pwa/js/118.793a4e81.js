(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[118],{"2bfd":function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("q-page",{staticClass:"q-pa-md"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-12 q-mb-sm"},[a("q-btn",{attrs:{color:"primary",flat:"",icon:"keyboard_arrow_left",label:"Trở lại"},on:{click:t.goBack}})],1),a("div",{staticClass:"col-12",attrs:{align:"center"}},[a("q-input",{attrs:{readonly:!0,type:"text",label:"Mã kế hoạch"},model:{value:t.po.number,callback:function(e){t.$set(t.po,"number",e)},expression:"po.number"}})],1),a("div",{staticClass:"col-12",attrs:{align:"center"}},[a("q-input",{attrs:{readonly:!0,type:"text",label:"Sản phẩm/Chi tiết"},model:{value:t.po.itemCustomeName,callback:function(e){t.$set(t.po,"itemCustomeName",e)},expression:"po.itemCustomeName"}})],1),a("div",{staticClass:"col-4",attrs:{align:"center"}},[a("q-input",{attrs:{readonly:!0,type:"text",label:"Dầy"},model:{value:t.po.itemHeight,callback:function(e){t.$set(t.po,"itemHeight",e)},expression:"po.itemHeight"}})],1),a("div",{staticClass:"col-4",attrs:{align:"center"}},[a("q-input",{attrs:{readonly:!0,type:"text",label:"Rộng"},model:{value:t.po.itemWidth,callback:function(e){t.$set(t.po,"itemWidth",e)},expression:"po.itemWidth"}})],1),a("div",{staticClass:"col-4",attrs:{align:"center"}},[a("q-input",{attrs:{readonly:!0,type:"text",label:"Dài"},model:{value:t.po.itemLenght,callback:function(e){t.$set(t.po,"itemLenght",e)},expression:"po.itemLenght"}})],1),a("div",{staticClass:"col-12",attrs:{align:"center"}},[a("q-input",{attrs:{readonly:!0,type:"text",label:"Số lượng theo Kế hoạch"},model:{value:t.po.keHoach,callback:function(e){t.$set(t.po,"keHoach",e)},expression:"po.keHoach"}})],1),a("div",{staticClass:"col-12 bg-green-3"},[a("q-list",[a("q-item-label",{attrs:{header:""}},[t._v("Phôi có thể xuất")]),t._l(t.po.nguyenLieu,(function(e){return a("div",{key:e.ITEM_ID},[e.ton>0?a("q-item",[a("q-item-section",{attrs:{top:"",avatar:""}},[a("q-avatar",{attrs:{icon:"check"}})],1),a("q-item-section",[a("q-item-label",{attrs:{caption:"",lines:"2"}},[t._v(t._s(e.NAME)+" "+t._s(e.HEIGHT*e.WIDTH*e.LENGTH)+":\n                "),a("q-badge",{attrs:{label:e.ton}})],1),a("q-item-label",{attrs:{caption:""}},[t._v("Nguồn phôi: "),a("q-badge",{attrs:{label:e.NGUONPHOI}})],1)],1)],1):t._e()],1)}))],2)],1),a("div",{staticClass:"col-12",attrs:{align:"center"}},[a("q-input",{attrs:{readonly:!1,type:"number",label:"Số lượng lỗi"},model:{value:t.defectQty,callback:function(e){t.defectQty=t._n(e)},expression:"defectQty"}})],1),a("div",{staticClass:"col-12",attrs:{align:"center"}},[a("q-input",{attrs:{readonly:!0,type:"text",label:"Đã sản xuất"},model:{value:t.po.quantity-t.po.loiCongDon,callback:function(e){t.$set(t.po.quantity-t.po,"loiCongDon",e)},expression:"po.quantity - po.loiCongDon"}})],1),a("div",{staticClass:"col-12",attrs:{align:"center"}},[a("q-input",{attrs:{readonly:!0,type:"text",label:"Lỗi"},model:{value:t.po.error,callback:function(e){t.$set(t.po,"error",e)},expression:"po.error"}})],1),a("div",{staticClass:"col-12",attrs:{align:"center"}},[a("q-input",{attrs:{readonly:!0,type:"text",label:"Lỗi công đoạn"},model:{value:t.po.loiCongDon,callback:function(e){t.$set(t.po,"loiCongDon",e)},expression:"po.loiCongDon"}})],1),a("div",{staticClass:"col-12",attrs:{align:"center"}},[a("q-input",{attrs:{readonly:!0,type:"text",label:"Công đoạn nhận"},model:{value:t.po.stepNextName,callback:function(e){t.$set(t.po,"stepNextName",e)},expression:"po.stepNextName"}})],1),a("div",{staticClass:"col-12",attrs:{align:"center"}},[a("q-input",{attrs:{readonly:!0,type:"number",label:"Số tồn có thể xuất"},model:{value:this.po.ton-this.po.xuatTon,callback:function(e){t.$set(this.po.ton-this.po,"xuatTon",t._n(e))},expression:"this.po.ton - this.po.xuatTon"}})],1),a("div",{staticClass:"col-12",attrs:{align:"center"}},[a("q-input",{attrs:{value:parseFloat((t.po.keHoach+t.po.loiCongDon-t.po.quantity).toFixed(6)),readonly:!0,type:"text",label:"Số lượng còn phải sản xuất"}})],1),a("div",{staticClass:"col-12",attrs:{align:"center"}},[a("q-input",{attrs:{type:"number",label:"Số lượng ghi nhận"},model:{value:t.confirmQty,callback:function(e){t.confirmQty=t._n(e)},expression:"confirmQty"}})],1),a("div",{staticClass:"col-12 q-mt-md q-pa-md",attrs:{align:"center"}},[a("q-btn",{staticClass:"full-width",staticStyle:{"font-family":"'Time'","font-weight":"800"},attrs:{color:"primary",glossy:"","no-caps":"",label:"Ghi nhận"},on:{click:t.onClick}})],1)]),a("q-dialog",{attrs:{persistent:""},model:{value:t.showConfirmDialog,callback:function(e){t.showConfirmDialog=e},expression:"showConfirmDialog"}},[a("q-card",{staticStyle:{"min-width":"300px"}},[a("q-card-section",{staticClass:"row items-center"},[a("span",{staticClass:"q-ml-sm"},[t._v("Bạn đã chắc chắn !")])]),a("q-card-section",[a("p",[t._v("Ghi nhận "+t._s(t.confirmQty)+" đạt vào kế hoạch "+t._s(t.po.number))]),a("span",{staticStyle:{color:"red"}},[t._v("Lỗi : "+t._s(t.defectQty))])]),a("q-card-actions",{attrs:{align:"right"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Hủy",color:"primary"}}),a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Đồng ý",color:"primary"},on:{click:t.add}})],1)],1)],1),a("DialogSuccess",{attrs:{closeDialog2:t.closeDialog2,palletCode:t.packageString,show:t.showSuccess,closeDialog:t.closeSuccessDialog}})],1)},n=[],i=(a("7514"),a("a34a")),s=a.n(i),c=(a("96cf"),a("c973")),r=a.n(c),l=(a("6b54"),a("06db"),a("c5f6"),a("7cdf"),a("28a5"),a("fa7d")),p=a("c0af"),u={components:{DialogSuccess:p["a"]},data:function(){return{showSuccess:!1,packageId:"",showConfirmDialog:!1,confirmQty:"",confirmData:"",po:{},target:"",defectQty:"",receiptQty:"0",maxQtyConfirm:0,packageString:"",totalDeliver:0,number:this.$route.params.code.split("_")[1]}},created:function(){this.load(),console.log("loadjfskdjfkjdkfjkdjfkdjkfjksdjfkjdkfjkdjfkd");var t=this.$route.params.code.split("_")[2];sessionStorage.setItem("search",t),console.log("seahchc",t)},watch:{defectQty:function(t){parseFloat(t)+parseFloat(this.confirmQty||0)>parseFloat((this.po.keHoach+this.po.loiCongDon-this.po.quantity).toFixed(6))&&this.$q.dialog({title:"Lỗi",message:"Tổng khối lượng vượt quá kế hoạch!"}),100005===this.po.UNIT_ID||Number.isInteger(t)||this.$q.dialog({title:"Lỗi",message:"Bạn cần nhập số nguyên!"})},confirmQty:function(t){parseFloat(this.defectQty||0)+parseFloat(t)>parseFloat((this.po.keHoach+this.po.loiCongDon-this.po.quantity).toFixed(6))&&this.$q.dialog({title:"Lỗi",message:"Tổng khối lượng vượt quá kế hoạch!"}),100005===this.po.UNIT_ID||Number.isInteger(t)||this.$q.dialog({title:"Lỗi",message:"Bạn cần nhập số nguyên!"})}},methods:{closeDialog2:function(){this.showSuccess=!1,this.$router.go(-1)},closeSuccessDialog:function(){var t=this;this.showSuccess=!1,this.confirmQty="",console.log("ok"),setTimeout((function(){t.$router.push("/tracking-lot-no?code="+t.packageId)}),1e3)},onClick:function(){this.confirmQty.toString().length>0||this.defectQty.toString().length>0?this.showConfirmDialog=!0:Object(l["p"])()},add:function(){var t=this;return r()(s.a.mark((function e(){var a,o;return s.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(a=t.defectQty||0,o=t.confirmQty||0,!(parseFloat(a)+parseFloat(o)>parseFloat((t.po.keHoach+t.po.loiCongDon-t.po.quantity).toFixed(6)))){e.next=6;break}t.$q.dialog({title:"Lỗi",message:"Tổng khối lượng vượt quá kế hoạch!"}),e.next=12;break;case 6:if(!(parseFloat(a)>0)){e.next=9;break}return e.next=9,t.createPackage(100004,a);case 9:if(!(parseFloat(o)>0)){e.next=12;break}return e.next=12,t.createPackage(100026,o);case 12:case"end":return e.stop()}}),e)})))()},createPackage:function(t,e){var a=this;return r()(s.a.mark((function o(){var n,i,c,r,p,u,d,m,g;return s.a.wrap((function(o){while(1)switch(o.prev=o.next){case 0:return n=a.po.stepNextId,100004===t&&(i=a.$store.getters["base/mySources"].find((function(t){return t.id===parseInt(a.po.stepId)})),i&&(n=i.error)),c={sourceId:a.po.stepId,destinationId:n,itemId:a.po.itemId,quantity:e,typeId:t,po:a.po.code},o.next=5,a.$store.dispatch("production/POST_SAN_LUONG",c);case 5:if(r=o.sent,!r.meta.success){o.next=22;break}if(a.packageString=r.data[0].id.toString(),a.packageId=r.data[0].id,a.maxQtyConfirm=a.maxQtyConfirm-parseFloat(e),100026===t&&(a.showSuccess=!0),p=null!==a.po.quantity?parseInt(a.po.quantity):0,u=null!==a.po.error?parseInt(a.po.error):0,d=parseInt(a.po.target),m=p+u+e,!(m>=d)){o.next=19;break}return g={status:"Hoàn thành",po:a.po.code},o.next=19,a.$store.dispatch("production/COMPLETED_PO",g);case 19:Object(l["o"])(),o.next=23;break;case 22:Object(l["n"])();case 23:case"end":return o.stop()}}),o)})))()},load:function(){var t=this;return r()(s.a.mark((function e(){var a,o;return s.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a={code:t.$route.params.code.split("_")[0],number:t.$route.params.code.split("_")[1]},e.next=3,t.$store.dispatch("production/GET_DETAI_PO",a);case 3:o=e.sent,console.log("dat",o.data),o.data&&(t.po=o.data,t.po.itemCustomeName="["+t.po.itemCode+"] "+t.po.itemName,t.po.startDate="01/04/2020 08:00:00",t.po.endDate="01/04/2020 08:00:00",t.po.target+=t.po.ton,t.maxQtyConfirm=t.po.target,t.receiptQty=t.maxQtyConfirm.toString());case 6:case"end":return e.stop()}}),e)})))()},getMapNguyenLieu:function(){return this.po.nguyenLieu.map((function(t){return t.maxQtyAvable}))},goBack:function(){this.$router.go(-1)}}},d=u,m=a("2877"),g=a("9989"),h=a("9c40"),f=a("27f9"),y=a("1c1c"),b=a("0170"),k=a("66e5"),v=a("4074"),x=a("cb32"),q=a("58a8"),C=a("24e8"),Q=a("f09f"),D=a("a370"),w=a("4b7e"),I=a("7f67"),_=a("eebe"),S=a.n(_),$=Object(m["a"])(d,o,n,!1,null,null,null);e["default"]=$.exports;S()($,"components",{QPage:g["a"],QBtn:h["a"],QInput:f["a"],QList:y["a"],QItemLabel:b["a"],QItem:k["a"],QItemSection:v["a"],QAvatar:x["a"],QBadge:q["a"],QDialog:C["a"],QCard:Q["a"],QCardSection:D["a"],QCardActions:w["a"]}),S()($,"directives",{ClosePopup:I["a"]})}}]);