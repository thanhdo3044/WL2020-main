(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[25],{"06a7":function(t,a,s){},bb0b:function(t,a,s){"use strict";s.r(a);var i=function(){var t=this,a=t.$createElement,s=t._self._c||a;return t.visible?t._e():s("q-page",{staticClass:"q-pa-md"},[s("div",[s("app-bar",[t._v("Chi tiết pallet số "+t._s(this.$route.params.code))]),void 0!==t.pallet.item&&t.pallet.item.length>1?s("div",{staticClass:"row"},t._l(t.pallet.item,(function(a){return s("div",{key:a.id,staticClass:"col-12 col-md-6 q-mt-md"},[s("q-card",{staticClass:"my-card",staticStyle:{"min-width":"100%"}},[s("q-card-section",[s("p",{staticClass:"prodTextTitle"},[t._v(t._s(a.name||"????"))]),s("p",{staticClass:"prodTextTitle"},[t._v("(QC: "+t._s(a.height+" "+a.width+" "+a.length)+")")]),s("div",{staticClass:"text-subtitle2"},[t._v("Số lượng : "+t._s(a.quantity)+" ("+t._s(a.unit.name||"Thanh")+")")])])],1)],1)})),0):s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-md-6"},[s("q-card",{staticClass:"my-card q-mt-md",staticStyle:{"min-width":"100%"}},[s("q-card-section",[s("div",{staticClass:"prodTextTitle"},[t._v(t._s(t.pallet.item[0].name||"????")+" (QC: "+t._s(t.pallet.item[0].height+" "+t.pallet.item[0].width+" "+t.pallet.item[0].length)+")")]),s("div",{staticClass:"text-subtitle2"},[t._v("Số lượng : "+t._s(t.pallet.inventory)+" ("+t._s(t.pallet.item[0].unit.name||"Thanh")+")")])])],1)],1)]),s("q-separator",{staticClass:"q-mt-md q-mb-md"}),s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-md-6"},[s("q-card",[s("q-card-section",[s("div",{staticClass:"prodTextTitle"},[t._v("Thông tin pallet")])]),s("q-separator"),s("q-card-section",[s("table",{staticStyle:{width:"100%"}},[s("tr",[s("td",[t._v("Ngày tạo")]),s("td",[t._v(t._s(t.pallet.createDate))])]),s("tr",[s("td",[t._v("Tạo bởi")]),s("td",[t._v(t._s(t.pallet.createName))])])])])],1)],1)]),s("div",{staticClass:"row q-mt-md"},[s("div",{staticClass:"col-12"},[s("table-coc")],1)]),s("div",{staticClass:"row q-mt-md"},[s("div",{staticClass:"col-12 col-md-4"},[s("q-card",{staticClass:"my-card q-pa-xs"},[s("q-card-section",[s("div",{staticClass:"prodTextTitle"},[t._v("Thông tin các công đoạn đã qua")])]),t._l(t.pallet.step,(function(a,i){return s("div",{key:a.id},[s("q-item",[s("q-item-section",{attrs:{avatar:""}},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12"},[s("q-chip",[s("q-avatar",{attrs:{color:"red"}},[t._v(t._s(i+1))]),s("div",{staticClass:"prodTextTitle"},[t._v(t._s(a.stepName))])],1)],1)])])],1),s("q-card-section",[s("div",{staticClass:"row"},[s("div",{staticClass:"col-6"},[s("div",{staticClass:"prodTextTitle",staticStyle:{"background-color":"#52f783",padding:"10px"}},[t._v("SL đạt : "+t._s(a.pass))])]),s("div",{staticClass:"col-6"},[s("div",{staticClass:"prodTextTitle",staticStyle:{"background-color":"#faa652",padding:"10px"}},[t._v("SL lỗi : "+t._s(a.notPass))])])]),s("div",{staticClass:"row"},[s("div",{staticClass:"col-12"},[t._v("Ngày làm việc : "+t._s(a.package[0].createDate))])]),s("div",{staticClass:"row"},[s("div",{staticClass:"col-12"},[t._v("Người làm : "+t._s(a.package[0].createName))])])]),s("q-separator")],1)}))],2)],1)])],1),s("q-inner-loading",{attrs:{showing:t.visible}},[s("q-spinner-gears",{attrs:{size:"150px",color:"primary"}})],1)],1)},e=[],c=s("dd38"),l=s("889c"),o={components:{"app-bar":c["a"],"table-coc":l["a"]},data:function(){return{visible:!0,pallet:{},showDialog:!1,steps:[]}},mounted:function(){var t=this;this.$root.$on("add-supplies-success",(function(){t.showDialog=!1})),this.initData()},methods:{initData:function(){var t=this,a=this.$route.params.code,s={token:this.$store.state.production.userInfo.token,palletCode:a};this.$store.dispatch("production/ACTION_GET_DETAIL_PALLET",s).then((function(a){!0===a.data.meta.success?(t.pallet=a.data.data,t.data,t.visible=!1):t.$q.notify({message:a.data.meta.messages.message,color:"red"})})).catch((function(t){console.log(t)}))},submitForm:function(t){this.showDialog=!1},cancelForm:function(){this.showDialog=!1}}},d=o,n=(s("bf18"),s("2877")),r=s("9989"),p=s("f09f"),v=s("a370"),m=s("eb85"),_=s("66e5"),h=s("4074"),u=s("b047"),C=s("cb32"),g=s("74f7"),q=s("cf57"),b=s("eebe"),f=s.n(b),w=Object(n["a"])(d,i,e,!1,null,"166d1305",null);a["default"]=w.exports;f()(w,"components",{QPage:r["a"],QCard:p["a"],QCardSection:v["a"],QSeparator:m["a"],QItem:_["a"],QItemSection:h["a"],QChip:u["a"],QAvatar:C["a"],QInnerLoading:g["a"],QSpinnerGears:q["a"]})},bf18:function(t,a,s){"use strict";var i=s("06a7"),e=s.n(i);e.a}}]);