(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[127],{aa1e:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("q-page",{staticClass:"q-pa-md"},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-12"},[e("div",{staticClass:"page-title"},[t._v("Tra cứu thông tin số lô")])])]),e("div",{staticClass:"row q-mt-sm justify-around"},[e("div",{staticClass:"col-9 "},[e("q-input",{ref:"notlo",attrs:{clearable:"",outlined:"",label:"Số số lô"},on:{clear:t.clearCode},model:{value:t.no,callback:function(a){t.no=a},expression:"no"}})],1),e("div",{staticClass:"col-2"},[e("q-btn",{staticClass:"full-width full-height glossy",staticStyle:{"font-family":"'Time'"},attrs:{color:"primary","no-caps":"",icon:"search"},on:{click:t.search}})],1)]),t.showDetail?e("div",{staticClass:"row q-mt-sm"},[e("div",{staticClass:"col-12"},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-12"},[e("fieldset",[e("legend",[t._v("Thông tin số lô ")]),e("div",[e("p",[t._v("- Mã kế hoạch : "),e("span",{staticStyle:{color:"green"}},[t._v(t._s(t.lot.po))])]),e("p",{staticStyle:{color:"green","font-weight":"800"}},[t._v("["+t._s(t.lot.itemCode)+"] "+t._s(t.lot.itemName)+" ("+t._s(t.lot.itemHieght)+"*"+t._s(t.lot.itemWidth)+"*"+t._s(t.lot.itemLength)+") ")]),e("p",[t._v("- Số lượng : "+t._s(t.lot.quantity)+" ")]),e("p",[t._v("- Công đoạn tạo : "+t._s(t.lot.fromName))]),e("p",[t._v("- Công đoạn tiếp theo: "+t._s(t.lot.toName))]),e("p",[t._v("- Ngày tạo : "+t._s(t.formatNgay(t.lot.createDate)))]),e("p",[t._v("- Người tạo :"+t._s(t.lot.createBy))])])])])]),e("div",{staticClass:"row q-mt-sm"},[e("div",{staticClass:"col-12"},[e("q-card",{staticClass:"my-card"},[e("q-card-section",[e("div",{staticClass:"row"},[e("div",{staticClass:"col-10"},[e("div",{staticClass:"text-h6"},[t._v("Thông tin truy nguyên")])]),e("div",{staticClass:"col-2"},[e("q-btn",{attrs:{flat:"",color:"green",icon:"add"},on:{click:function(a){t.showDialogAddCoc=!0}}})],1)])]),e("q-card-section",[e("q-markup-table",{attrs:{separator:"cell"}},[e("thead",[e("tr",[e("th",{staticClass:"text-left",staticStyle:{width:"30px"}},[t._v("Tên vật tư")]),e("th",{staticClass:"text-right"},[t._v("Số lô")]),e("th",{staticClass:"text-right"},[t._v("Nhà cung cấp")]),e("th",{staticClass:"text-right"},[t._v("Ngày ghi")]),e("th",{staticClass:"text-right"},[t._v("sao chép")])])]),e("tbody",t._l(t.coc,(function(a,s){return e("tr",{key:s},[e("td",{staticClass:"text-left",staticStyle:{width:"30px"}},[t._v(t._s(a.supplies))]),e("td",{staticClass:"text-right"},[t._v(t._s(a.parcel))]),e("td",{staticClass:"text-right"},[t._v(t._s(a.vendor))]),e("td",{staticClass:"text-right"},[t._v(t._s(t.formatNgay(a.createDate)))]),e("td",[e("span",{staticClass:"fake-link",on:{click:function(e){return t.coppyCoc(a)}}},[t._v("Sao chép")])])])})),0)])],1)],1)],1)])])]):t._e(),e("q-dialog",{attrs:{persistent:""},model:{value:t.showDialogAddCoc,callback:function(a){t.showDialogAddCoc=a},expression:"showDialogAddCoc"}},[e("q-card",{staticStyle:{"min-width":"300px"}},[e("q-card-section",{staticClass:"row items-center"},[e("div",{staticClass:"page-title col-12"},[t._v("\n                   Thêm thông tin COC\n               ")])]),e("q-card-section",{staticClass:"row"},[e("div",{staticClass:"col-12"},[e("q-select",{staticStyle:{"font-family":"'Time New Roman'","font-size":"16px"},attrs:{behavior:"dialog",options:t.vattu,label:"Chọn vật tư :","use-input":"","input-debounce":"0"},on:{filter:t.searchSupplies},model:{value:t.vt,callback:function(a){t.vt=a},expression:"vt"}})],1),e("div",{staticClass:"col-12 q-mt-sm"},[e("q-select",{staticStyle:{"font-family":"'Time New Roman'","font-size":"16px"},attrs:{behavior:"dialog",options:t.ncc,label:"Chọn Nhà cung cấp :","use-input":"","input-debounce":"0"},on:{filter:t.searchNCC},model:{value:t.nc,callback:function(a){t.nc=a},expression:"nc"}})],1),e("div",{staticClass:"col-12 q-mt-sm"},[e("q-input",{ref:"self1",attrs:{type:"text",label:"Số lô"},model:{value:t.parcel,callback:function(a){t.parcel=a},expression:"parcel"}})],1)]),e("q-card-actions",{attrs:{align:"right"}},[e("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Hủy",color:"primary"}}),e("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Đồng ý",color:"primary"},on:{click:t.addCOC}})],1)],1)],1)],1)},c=[],n=(e("20d6"),e("7f7f"),e("a34a")),i=e.n(n),o=(e("a481"),e("6b54"),e("96cf"),e("c973")),l=e.n(o),r=(e("386d"),e("551c"),e("ac6a"),e("cadf"),e("06db"),e("5df3"),e("fa7d")),u=e("0967"),d={data:function(){return{no:"",lot:null,showDetail:!1,vattu:[],ncc:[],patformString:"",coc:[],showDialogAddCoc:!1,vt:null,vattuDupplicate:[],nccDupplicate:[],nc:null,parcel:""}},created:function(){Promise.all([this.loadVatTu(),this.loadNcc()]);var t=this.$route.query.code;t&&(this.no=t,this.search()),console.log(u["b"].is)},computed:{solo:function(){return this.$refs["self1"]}},mounted:function(){console.log(this.$refs.self1)},methods:{clearCode:function(){},formatNgay:function(t){return Object(r["b"])(t,"DD/MM/YYYY HH:mm:ss")},search:function(){var t=this;return l()(i.a.mark((function a(){var e;return i.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return Object(r["m"])(),t.no.toString()!==t.$route.query.code&&t.$router.replace({path:t.$route.fullPath,query:{code:t.no}}),a.next=4,t.$store.dispatch("production/GET_DETAIL_PACKAGE",t.no);case 4:e=a.sent,e.data&&(t.lot=e.data),t.loadCOC(),t.showDetail=!0,Object(r["a"])();case 9:case"end":return a.stop()}}),a)})))()},loadVatTu:function(){var t=this;return l()(i.a.mark((function a(){var e;return i.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,t.$store.dispatch("production/GET_VAT_TU");case 2:e=a.sent,t.vattu=e.data,t.vattuDupplicate=e.data;case 5:case"end":return a.stop()}}),a)})))()},loadNcc:function(){var t=this;return l()(i.a.mark((function a(){var e;return i.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,t.$store.dispatch("production/GET_NCC");case 2:e=a.sent,t.ncc=e.data,t.nccDupplicate=e.data;case 5:case"end":return a.stop()}}),a)})))()},loadCOC:function(){var t=this;return l()(i.a.mark((function a(){var e,s;return i.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return e={po:t.lot.po},a.next=3,t.$store.dispatch("production/GET_COC",e);case 3:s=a.sent,t.coc=s.data;case 5:case"end":return a.stop()}}),a)})))()},addCOC:function(){var t=this;return l()(i.a.mark((function a(){var e,s;return i.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(!(t.parcel.length>0&&t.vt&&t.nc)){a.next=8;break}return e={po:t.lot.po,suppliesId:t.vt.value,quantity:1,parcel:t.parcel,vendorId:t.nc.value},a.next=4,t.$store.dispatch("production/ADD_COC",e);case 4:s=a.sent,s.meta.success&&(Object(r["o"])("Thêm thông tin COC thành công !"),t.showDialogAddCoc=!1,t.coc.push({suppliesId:t.vt.value,supplies:t.vt.label,quantity:1,parcel:t.solo,vendor:t.nc.label,vendorId:t.nc.value})),a.next=9;break;case 8:Object(r["p"])();case 9:case"end":return a.stop()}}),a)})))()},searchSupplies:function(t,a){var e=this,s=[];this.vattuDupplicate.forEach((function(t){var a={label:t.name||"??",value:t.id};s.push(a)})),a(""!==t?function(){var a=t.toLowerCase();e.vattu=s.filter((function(t){var e=t.label;if(e.toString().indexOf(a)>-1)return t}))}:function(){e.vattu=s})},searchNCC:function(t,a){var e=this,s=[];this.nccDupplicate.forEach((function(t){var a={label:t.name||"??",value:t.id};s.push(a)})),a(""!==t?function(){var a=t.toLowerCase();e.ncc=s.filter((function(t){var e=t.label;if(e.toString().indexOf(a)>-1)return t}))}:function(){e.ncc=s})},coppyCoc:function(t){var a=this.vattuDupplicate.findIndex((function(a){return a.id===t.suppliesId}));a>-1&&(this.vt={value:this.vattuDupplicate[a].id,label:this.vattuDupplicate[a].name});var e=this.ncc.findIndex((function(a){return a.id===t.vendorId}));e>-1&&(this.nc={value:this.nccDupplicate[e].id,label:this.nccDupplicate[e].name}),this.showDialogAddCoc=!0,this.$refs.self1&&this.$refs.self1.focus(),this.parcel=t.parcel}}},p=d,h=e("2877"),v=e("9989"),f=e("27f9"),C=e("9c40"),m=e("f09f"),g=e("a370"),w=e("2bb1"),b=e("24e8"),_=e("ddd8"),x=e("4b7e"),y=e("7f67"),q=e("eebe"),D=e.n(q),k=Object(h["a"])(p,s,c,!1,null,null,null);a["default"]=k.exports;D()(k,"components",{QPage:v["a"],QInput:f["a"],QBtn:C["a"],QCard:m["a"],QCardSection:g["a"],QMarkupTable:w["a"],QDialog:b["a"],QSelect:_["a"],QCardActions:x["a"]}),D()(k,"directives",{ClosePopup:y["a"]})}}]);