(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[99],{d52a:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("q-page",{staticClass:"q-pa-md"},[a("div",{staticClass:"row justify-center q-ma-sm"},[a("div",{staticClass:"col-12 col-md-6"},[a("q-card",[a("q-card-section",[a("div",{staticClass:"prodTextTitle"},[e._v("\n              Scan 2 mã barcode \n            ")])]),a("q-separator"),a("q-card-section",[a("q-input",{ref:"self1",attrs:{clearable:"",color:"teal",outlined:"",label:"Mã barcode 1"},on:{focus:e.focus1,keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:(t.preventDefault(),e.handle1(t))}},model:{value:e.barcode1,callback:function(t){e.barcode1=t},expression:"barcode1"}}),a("br"),a("q-input",{ref:"self2",attrs:{clearable:"",readonly:e.disableBarcode2,color:"teal",outlined:"",label:"Mã barcode 2"},on:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:(t.preventDefault(),e.handle2(t))}},model:{value:e.barcode2,callback:function(t){e.barcode2=t},expression:"barcode2"}})],1)],1)],1)]),a("div",{directives:[{name:"show",rawName:"v-show",value:e.showResult,expression:"showResult"}],staticClass:"row justify-center q-ma-sm"},[a("div",{staticClass:"col-12 col-md-6"},[a("q-card",[a("q-card-section",[a("div",{staticClass:"prodTextTitle"},[e._v("\n                    Thông tin đóng gói\n                  ")])]),a("q-separator"),a("q-card-section",[a("div",{staticClass:"row"},[a("div",{staticClass:"col-6"},[e._v("\n                      Tên thị trường :\n                    ")]),a("div",{staticClass:"col-6"},[e._v("\n                      "+e._s(this.ikeaInfo.marketName)+"\n                    ")])]),a("div",{staticClass:"row"},[a("div",{staticClass:"col-6"},[e._v("\n                      Mã Thị trường :\n                    ")]),a("div",{staticClass:"col-6"},[e._v("\n                       "+e._s(this.ikeaInfo.market)+"\n                    ")])]),a("div",{staticClass:"row"},[a("div",{staticClass:"col-6"},[e._v("\n                      Số tuần : \n                    ")]),a("div",{staticClass:"col-6"},[e._v("\n                       "+e._s(this.ikeaInfo.week)+"\n                    ")])]),a("div",{staticClass:"row"},[a("div",{staticClass:"col-6"},[e._v("Số lượng :")]),a("div",{staticClass:"col-6"},[e._v("\n                       "+e._s(this.ikeaInfo.quantity)+"\n                    ")])])])],1)],1)]),a("div",{staticClass:"row justify-center q-ma-sm"},[a("div",{staticClass:"col-12 col-md-6"},[a("q-card",{staticClass:"bg-secondary text-white"},[a("q-card-section",[a("div",{staticClass:"prodTextTitle"},[e._v("\n              Hủy Mã Ikea\n            ")])]),a("q-separator"),a("q-card-section",[a("q-input",{ref:"self3",attrs:{color:"red",outlined:"",label:"Mã barcode 2"},on:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:(t.preventDefault(),e.handle3(t))}},model:{value:e.barcode3,callback:function(t){e.barcode3=t},expression:"barcode3"}})],1)],1)],1)]),a("div",{directives:[{name:"show",rawName:"v-show",value:e.showLoading,expression:"showLoading"}],staticClass:"row justify-center q-ma-md"},[a("div",{staticClass:"col-12 col-md-6 justify-center",staticStyle:{"min-height":"200px","text-align":"center"}},[a("q-spinner-ios",{attrs:{color:"primary",size:"4em"}})],1)])])},n=[],o=a("a34a"),r=a.n(o),i=(a("96cf"),a("c973")),c=a.n(i),d=new Audio("/statics/mp3/alarm2.mp3"),l=new Audio("/statics/mp3/ting.mp3"),u={data:function(){return{showResult:!1,barcode1:"",barcode2:"",barcode3:"",showLoading:!1,ikeaInfo:{},disableBarcode2:!0}},mounted:function(){this.$refs.self1.select()},methods:{focus1:function(){},handle1:function(e){var t=this;return c()(r.a.mark((function e(){var a,s;return r.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.showLoading=!0,"240"!==t.barcode1.substring(0,3)){e.next=9;break}return a={token:t.$store.state.production.userInfo.token,ikeaCode:t.barcode1.trim()},e.next=5,t.$store.dispatch("production/ACTION_GET_IKEA_SEARCH",a);case 5:s=e.sent,!0===s.meta.success?(t.ikeaInfo=s.data,t.showResult=!0,t.showLoading=!1,t.disableBarcode2=!1,t.$refs.self2.select(),l.play()):t.$q.notify({message:s.meta.messages.message,color:"red",position:"center"}),e.next=10;break;case 9:t.$q.notify({message:"Mã barcode 1 không chính xác !",color:"red",position:"center"});case 10:t.showLoading=!1;case 11:case"end":return e.stop()}}),e)})))()},handle2:function(e){var t=this;return c()(r.a.mark((function e(){var a,s;return r.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if("003"!==t.barcode2.trim().substring(0,3)){e.next=8;break}return a={token:t.$store.state.production.userInfo.token,sourceId:t.$store.getters["base/mySources"][0].id,destinationId:t.$store.getters["base/mySources"][0].id,itemId:t.ikeaInfo.itemId,quantity:t.ikeaInfo.quantity,ikeaCode:t.barcode1.trim(),ikeaGuid:t.barcode2.trim()},e.next=4,t.$store.dispatch("production/ACTION_CREATE_PALLET",a);case 4:s=e.sent,!0===s.meta.success?(l.play(),t.$q.notify({message:"Scan thành công !",color:"green",position:"center"}),t.barcode1="",t.barcode2="",t.showResult=!1,t.disableBarcode2=!0,t.$refs.self1.select()):(d.play(),t.$q.notify({message:s.meta.messages.message,color:"red",position:"center"})),e.next=9;break;case 8:t.$q.notify({message:"Mã barcode 2 không chính xác !",color:"red",position:"center"});case 9:case"end":return e.stop()}}),e)})))()},handle3:function(){var e=this;return c()(r.a.mark((function t(){var a,s;return r.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if("003"!==e.barcode3.trim().substring(0,3)){t.next=8;break}return a={ikeaCode:e.barcode3.trim(),token:e.$store.state.production.userInfo.token},t.next=4,e.$store.dispatch("production/ACTION_CANCEL_IKEA",a);case 4:s=t.sent,!0===s.meta.success?(e.$q.notify({message:"Hủy mã ikea thành công !",color:"green",position:"center"}),l.play(),e.barcode3=""):e.$q.notify({message:s.meta.messages.message,color:"red",position:"center"}),t.next=9;break;case 8:e.$q.notify({message:"Mã Ikea không chính xác !",color:"red",position:"center"});case 9:case"end":return t.stop()}}),t)})))()}}},f=u,m=a("2877"),p=a("9989"),b=a("f09f"),h=a("a370"),v=a("eb85"),k=a("27f9"),w=a("cb32"),g=a("d9b2"),y=a("eebe"),C=a.n(y),q=Object(m["a"])(f,s,n,!1,null,null,null);t["default"]=q.exports;C()(q,"components",{QPage:p["a"],QCard:b["a"],QCardSection:h["a"],QSeparator:v["a"],QInput:k["a"],QAvatar:w["a"],QSpinnerIos:g["a"]})}}]);