(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[98],{"37b2":function(t,a,s){"use strict";s.r(a);var e=function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("q-page",{staticClass:"q-pa-md"},[s("app-bar",[t._v(" Danh sách mẻ sấy ")]),s("div",{staticClass:"row q-mt-md justify-center"},t._l(t.batchs,(function(a){return s("div",{key:a.id,staticClass:"col-12 col-md-3 q-ma-sm"},[s("card-batch",{staticStyle:{"margin-top":"10px"},attrs:{batch:a}},[s("div",{attrs:{slot:"action"},slot:"action"},[s("q-btn",{staticStyle:{color:"green"},attrs:{outline:"",label:"Xem chi tiết"},on:{click:function(s){return t.view(a)}}})],1)])],1)})),0),t.showButtonCreate?s("q-page-sticky",{attrs:{position:"bottom-right",offset:[18,18]}},[s("q-btn",{attrs:{fab:"",icon:"add",color:"primary"},on:{click:t.addPlan}})],1):t._e(),s("q-inner-loading",{attrs:{showing:t.showLoading}},[s("q-spinner-gears",{attrs:{size:"150px",color:"primary"}})],1)],1)},i=[],o=s("dd38"),c=function(){var t=this,a=t.$createElement,s=t._self._c||a;return t.batch.verify>0?s("q-card",{staticClass:"bg-secondary text-white"},[s("q-card-section",[s("p",{staticClass:"prodTextTitle"},[t._v(" Mẻ sấy số : "+t._s(t.batch.code))]),s("p",{staticClass:"prodTextTitle",staticStyle:{"margin-top":"-11px"}},[t._v(t._s(t.batch.kilnName))]),s("p",{staticStyle:{"margin-top":"-11px","margin-bottom":"-12px","font-family":"'Time New Roman'","font-size":"12px","font-style":"italic"}},[t._v("Trạng thái : "+t._s("process"===t.batch.status?"Đang sấy":"Đang vào lò"))])]),s("q-separator"),s("q-card-section",[s("p",{staticClass:"prodTextNormal"},[t._v("Chiều dầy sấy : "+t._s(t.batch.height)+" ")]),s("p",{staticClass:"prodTextNormal"},[t._v("Chiều dài sấy : "+t._s(t.batch.length)+" ")]),s("p",{staticClass:"prodTextNormal"},[t._v("Mục đích sấy : "+t._s(t.batch.type||"Không xác định")+" ")]),s("p",{staticClass:"prodTextNormal"},[t._v("Ngày dự kiến ra lò : "+t._s(t.batch.timeout)+" ")]),s("p",{staticClass:"prodTextNormal"},[t._v("Tổng số pallet : "+t._s(t.batch.ballets.length)+" ")]),t.batch.ballets.length>0?s("p",{staticClass:"prodTextNormal"},[t._v("Khối lượng mẻ : "+t._s(parseFloat(t.batch.totalM3).toFixed(2))+" (m³) ")]):t._e()]),s("q-card-actions",{attrs:{align:"right"}},[t._t("action")],2)],1):s("q-card",[s("q-card-section",[s("p",{staticClass:"prodTextTitle"},[t._v(" Mẻ sấy số : "+t._s(t.batch.code))]),s("p",{staticClass:"prodTextTitle",staticStyle:{"margin-top":"-11px"}},[t._v(t._s(t.batch.kilnName))]),s("p",{staticStyle:{"margin-top":"-11px","margin-bottom":"-12px","font-family":"'Time New Roman'","font-size":"12px","font-style":"italic"}},[t._v("Trạng thái : "+t._s("process"===t.batch.status?"Đang sấy":"Đang vào lò"))])]),s("q-separator"),s("q-card-section",[s("p",{staticClass:"prodTextNormal"},[t._v("Chiều dầy sấy : "+t._s(t.batch.height)+" ")]),s("p",{staticClass:"prodTextNormal"},[t._v("Chiều dài sấy : "+t._s(t.batch.length)+" ")]),s("p",{staticClass:"prodTextNormal"},[t._v("Mục đích sấy : "+t._s(t.batch.type||"Không xác định")+" ")]),s("p",{staticClass:"prodTextNormal"},[t._v("Ngày dự kiến ra lò : "+t._s(t.batch.timeout)+" ")]),s("p",{staticClass:"prodTextNormal"},[t._v("Tổng số pallet : "+t._s(t.batch.ballets.length)+" ")]),t.batch.ballets.length>0?s("p",{staticClass:"prodTextNormal"},[t._v("Khối lượng mẻ : "+t._s(parseFloat(t.batch.totalM3).toFixed(2))+" (m³) ")]):t._e()]),s("q-card-actions",{attrs:{align:"right"}},[t._t("action")],2)],1)},r=[],n={props:{batch:{type:Object}}},l=n,p=s("2877"),h=s("f09f"),d=s("a370"),b=s("eb85"),m=s("4b7e"),u=s("eebe"),_=s.n(u),g=Object(p["a"])(l,c,r,!1,null,null,null),y=g.exports;_()(g,"components",{QCard:h["a"],QCardSection:d["a"],QSeparator:b["a"],QCardActions:m["a"]});s("f79b");var f={components:{"app-bar":o["a"],"card-batch":y},data:function(){return{data:"",batchs:[],showLoading:!0,showButtonCreate:!1,typeScreen:""}},created:function(){this.initData();var t=this.$store.getters["base/myFactoryInfor"].id;this.$subcriberTopic(t+"-LOSAY")},methods:{initData:function(){var t=this,a=this.$route.query.type,s="";switch(this.typeScreen=a,a){case"ls":s="";break;case"kh":this.showButtonCreate=!0;break;case"vl":case"cd":s="?status=created";break;case"dg":s="?status=process";break;default:break}var e={queryGetBatch:s,factoryId:this.$store.getters["base/myFactoryInfor"].id};this.$store.dispatch("production/ACTION_GET_BATCH",e).then((function(a){t.batchs=t.$store.state.production.batchs,t.showLoading=!1}))},view:function(t){this.$store.dispatch("production/ACTION_SELECT_BATCH",t);var a="/production-detail-batch?type="+this.typeScreen;this.$router.push(a)},addPlan:function(){this.$router.push("/production-add-plan-batch")}}},v=f,C=s("9989"),x=s("9c40"),T=s("de5e"),q=s("74f7"),w=s("cf57"),N=Object(p["a"])(v,e,i,!1,null,null,null);a["default"]=N.exports;_()(N,"components",{QPage:C["a"],QBtn:x["a"],QPageSticky:T["a"],QInnerLoading:q["a"],QSpinnerGears:w["a"]})}}]);