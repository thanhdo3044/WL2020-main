(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[116],{"7b5a":function(t,s,a){"use strict";a.r(s);var n=function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("q-page",{staticClass:"q-pa-md"},[a("div",{staticClass:"row justify-center"},[a("div",{staticClass:"prodTextTitle"},[t._v("\n            Chọn 1 dự án\n        ")])]),a("div",{staticClass:"row justify-center q-mt-sm"},t._l(t.projects,(function(s){return a("div",{key:s.id,staticClass:"col-12 col-sm-6 q-ma-sm"},[a("q-card",[a("q-card-section",[a("div",{staticClass:"prodTextTitle"},[a("p",[t._v(t._s(s.name))])])]),a("q-card-section",[a("div",{staticClass:"row"},[a("div",{staticClass:"col-6"},[t._v("\n                Mã dự án :\n              ")]),a("div",{staticClass:"col-6"},[t._v("\n                "+t._s(s.code)+"\n              ")])]),s.customer.id?a("div",{staticClass:"row"},[a("div",{staticClass:"col-6"},[t._v("\n                Khách hàng : \n              ")]),a("div",{staticClass:"col-6"},[t._v("\n                "+t._s(s.customer.name)+"\n              ")])]):t._e()]),a("q-card-section",{attrs:{align:"right"}},[a("q-btn",{attrs:{color:"primary",glossy:"",label:"Chọn"},on:{click:function(a){return t.selectProject(s)}}})],1)],1)],1)})),0),a("q-inner-loading",{attrs:{showing:t.showLoading}},[a("q-spinner-gears",{attrs:{size:"150px",color:"primary"}})],1)],1)},e=[],i=a("a34a"),c=a.n(i),r=(a("96cf"),a("c973")),o=a.n(r),l={data:function(){return{showLoading:!0,projects:[],items:[]}},created:function(){this.initData()},methods:{initData:function(){var t=this;return o()(c.a.mark((function s(){var a;return c.a.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return s.next=2,t.$store.dispatch("funiture/ACTION_LOAD_PROJECTS");case 2:a=s.sent,t.showLoading=!1,!0===a.meta.success?t.projects=a.data:t.$q.notify({message:a.meta.messages.message,color:"red"});case 5:case"end":return s.stop()}}),s)})))()},selectProject:function(t){this.$store.dispatch("funiture/ACTION_SELECT_PROJECT",t),this.$router.go(-1)}}},d=l,u=a("2877"),p=a("9989"),f=a("f09f"),m=a("a370"),v=a("9c40"),h=a("74f7"),C=a("cf57"),g=a("eebe"),w=a.n(g),_=Object(u["a"])(d,n,e,!1,null,null,null);s["default"]=_.exports;w()(_,"components",{QPage:p["a"],QCard:f["a"],QCardSection:m["a"],QBtn:v["a"],QInnerLoading:h["a"],QSpinnerGears:C["a"]})}}]);