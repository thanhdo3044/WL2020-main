(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[140],{"9db7":function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("q-page",{staticClass:"q-pa-md"},[e("div",{staticClass:"row justify-center"},[e("div",{staticClass:"col-12"},[e("q-card",[e("q-card-section",[e("h5",[t._v("Danh sách yêu cầu phê duyệt bảng giá")])]),e("q-card-section",[e("table-request",{attrs:{dataSource:t.dataRequest,showApproval:!0}})],1)],1)],1)])])},s=[],r=e("a34a"),c=e.n(r),o=(e("96cf"),e("c973")),u=e.n(o),i=(e("551c"),e("ac6a"),e("cadf"),e("06db"),e("5df3"),e("0d06")),d={components:{"table-request":i["a"]},data:function(){return{dataRequest:[]}},created:function(){Promise.all([this.loadRequest()])},methods:{loadRequest:function(){var t=this;return new Promise(function(){var a=u()(c.a.mark((function a(e,n){var s;return c.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,t.$store.dispatch("wood/GET_MY_REQUEST");case 2:s=a.sent,t.dataRequest=s.data,e(!0);case 5:case"end":return a.stop()}}),a)})));return function(t,e){return a.apply(this,arguments)}}())}}},l=d,p=e("2877"),f=e("9989"),h=e("f09f"),w=e("a370"),q=e("eebe"),v=e.n(q),b=Object(p["a"])(l,n,s,!1,null,null,null);a["default"]=b.exports;v()(b,"components",{QPage:f["a"],QCard:h["a"],QCardSection:w["a"]})}}]);