(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[79],{cd5c:function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("q-page",[r("order-header",{attrs:{order:e.order}}),r("q-card",{staticClass:"my-card"},[r("thanh-toan",{attrs:{metaValue:e.metaValue,disable:e.disable}})],1),r("q-card",[r("q-card-section",[e.order.Requests&&!Object.keys(e.order.Requests).length?r("q-checkbox",{attrs:{label:"Đồng ý"},model:{value:e.disable,callback:function(t){e.disable=t},expression:"disable"}}):e._e()],1)],1),e.disable?r("order-approved",{attrs:{order:e.order}}):e._e(),r("send-message",{attrs:{order:e.order}})],1)},n=[],o=(r("8e6e"),r("8a81"),r("ac6a"),r("cadf"),r("06db"),r("456d"),r("f751"),r("9523")),s=r.n(o),d=r("2f62"),c=r("932a"),i=r("6664"),u=r("0ac8"),l=r("f970");function b(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function O(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?b(Object(r),!0).forEach((function(t){s()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):b(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var p={data:function(){return{disable:!1,metaValue:{kinhGui:"Ban TGĐ",noiDungTT:"",soTien:0,vietBangChu:"",kemTheo:""}}},components:{SendMessage:c["a"],OrderHeader:i["a"],OrderApproved:u["a"],ThanhToan:l["a"]},methods:O(O({},Object(d["b"])("orders",["getOneOrder","getAllRequests"])),Object(d["b"])("orderMetas",["getOneOrderMeta","addorderMeta"])),computed:O(O({},Object(d["c"])("orders",["order"])),Object(d["c"])("base",["userInfo","myFactoryInfor"])),created:function(){var e=this;this.$route.query.id?this.getOneOrder(this.$route.query.id).then((function(t){t.data.data.Requests.length&&(e.disable=!0),e.metaValue=Object.assign(e.metaValue,JSON.parse(t.data.data.OrderMeta[0].metaValue)[0])})):this.$router.push({path:"/tao-de-xuat"})},watch:{disable:function(e){e&&this.addorderMeta(O(O({},this.order.OrderMeta[0]),{},{metaValue:JSON.stringify([this.metaValue])}))}}},f=p,h=r("2877"),g=r("9989"),m=r("f09f"),j=r("a370"),y=r("8f8e"),w=r("eebe"),v=r.n(w),q=Object(h["a"])(f,a,n,!1,null,null,null);t["default"]=q.exports;v()(q,"components",{QPage:g["a"],QCard:m["a"],QCardSection:j["a"],QCheckbox:y["a"]})}}]);