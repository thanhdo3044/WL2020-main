(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[85],{"2b30":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("q-page",{attrs:{padding:""}},[n("list-header",{attrs:{bgcolor:"bg-green-4"}},[e._v("Lịch sử ghi nhận")]),n("q-select",{attrs:{filled:"",label:"Chọn công đoạn",options:e.congDoans,"emit-value":"","map-options":"",behavior:"menu",dense:""},scopedSlots:e._u([{key:"no-option",fn:function(){return[n("q-item",[n("q-item-section",{staticClass:"text-grey"},[e._v("\n          No results\n        ")])],1)]},proxy:!0}]),model:{value:e.step,callback:function(t){e.step=t},expression:"step"}}),e.step?n("q-input",{attrs:{color:"teal",filled:"",label:"Tên chi tiết",dense:""},scopedSlots:e._u([{key:"prepend",fn:function(){return[n("q-icon",{attrs:{name:"search"}})]},proxy:!0},{key:"append",fn:function(){return[e.text?n("q-icon",{staticClass:"cursor-pointer",attrs:{name:"close"},on:{click:function(t){e.text=null}}}):e._e()]},proxy:!0}],null,!1,2487827114),model:{value:e.text,callback:function(t){e.text=t},expression:"text"}}):e._e(),e.step?n("q-input",{attrs:{filled:"",mask:"date",rules:["date"],dense:"",label:"Ngày ghi nhận"},scopedSlots:e._u([{key:"prepend",fn:function(){return[n("q-icon",{attrs:{name:"search"}})]},proxy:!0},{key:"append",fn:function(){return[e.date?n("q-icon",{staticClass:"cursor-pointer",attrs:{name:"close"},on:{click:function(t){e.date=""}}}):e._e(),n("q-icon",{staticClass:"cursor-pointer",attrs:{name:"event"}},[n("q-popup-proxy",{ref:"qDateProxy",attrs:{"transition-show":"scale","transition-hide":"scale"}},[n("q-date",{model:{value:e.date,callback:function(t){e.date=t},expression:"date"}},[n("div",{staticClass:"row items-center justify-end"},[n("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:"Close",color:"primary",flat:""}})],1)])],1)],1)]},proxy:!0}],null,!1,2492224907),model:{value:e.date,callback:function(t){e.date=t},expression:"date"}}):e._e(),e._l(e.lenhSanXuats,(function(t,a){return n("q-checkbox",{key:a,attrs:{dense:"",val:t,label:t,color:"teal"},model:{value:e.numbers,callback:function(t){e.numbers=t},expression:"numbers"}})})),n("div",{staticClass:"row justify-center q-mt-md"},e._l(e.sanLuongs(e.text),(function(t){return n("div",{key:t.id},[!e.numbers.includes(t.number)||e.date&&!e.moment(e.date.slice(0,10)).isSame(t.createdAt,"day")?e._e():n("q-card",{staticClass:"my-card"},[n("q-card-section",[n("div",{staticClass:"text-h6"},[e._v("\n            "+e._s(t.Item.name)+"\n            "+e._s([t.Item.height,t.Item.width,t.Item.length].join("*"))+"\n          ")]),t.accountId2?n("div",{staticClass:"text-subtitle2"},[n("q-badge",{attrs:{color:"primary"}},[e._v("Nhận bởi:\n            "+e._s(e._f("FullName")(e.getAccountById(t.accountId2)))+"\n            ")])],1):n("div",{staticClass:"text-subtitle2"},[n("q-badge",{attrs:{color:"secondary"}},[e._v("\n              Chờ nhận\n            ")])],1)]),n("q-list",[n("q-item",[n("q-item-section",[n("q-item-label",[e._v("Số lượng: "+e._s(t.quantity))]),n("q-item-label",[e._v("Người giao:\n                "+e._s(e._f("FullName")(e.getAccountById(t.accountId))))]),n("q-item-label",{attrs:{caption:""}},[e._v("Ngày giao: "+e._s(e._f("ngay")(t.createdAt)))]),n("q-item-label",{attrs:{caption:""}},[e._v("Lệnh sản xuất: "+e._s(t.number))])],1)],1)],1)],1),n("q-separator")],1)})),0)],2)},s=[],r=(n("8e6e"),n("8a81"),n("ac6a"),n("cadf"),n("06db"),n("456d"),n("a34a")),o=n.n(r),c=n("448a"),i=n.n(c),l=(n("96cf"),n("c973")),u=n.n(l),d=n("9523"),p=n.n(d),b=n("2f62"),m=n("2831");function f(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function h(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?f(Object(n),!0).forEach((function(t){p()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var g={data:function(){return{step:null,numbers:[],text:null,date:""}},components:{ListHeader:m["default"]},computed:h(h(h({},Object(b["c"])("production",["sanLuongs","lenhSanXuats"])),Object(b["c"])("base",["congDoans","userInfo"])),Object(b["c"])("orders",["getAccountById"])),methods:h(h({},Object(b["b"])("production",["getAllGhiNhans"])),{},{loadData:function(e){var t=this;return u()(o.a.mark((function n(){return o.a.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return t.date="",t.$q.loading.show({message:'Hệ thống đang lọc dữ liệu.<br/><span class="text-primary">Xin vui lòng chờ...</span>'}),n.next=4,t.getAllGhiNhans({stepId:e});case 4:t.numbers=i()(t.lenhSanXuats),t.$q.loading.hide();case 6:case"end":return n.stop()}}),n)})))()}}),watch:{step:function(e){e&&this.loadData(e)}}},y=g,v=n("2877"),q=n("9989"),x=n("ddd8"),_=n("66e5"),w=n("4074"),O=n("27f9"),k=n("0016"),j=n("7cbe"),C=n("52ee"),I=n("9c40"),Q=n("8f8e"),S=n("f09f"),P=n("a370"),D=n("58a8"),N=n("1c1c"),A=n("0170"),L=n("eb85"),B=n("7f67"),X=n("eebe"),E=n.n(X),$=Object(v["a"])(y,a,s,!1,null,null,null);t["default"]=$.exports;E()($,"components",{QPage:q["a"],QSelect:x["a"],QItem:_["a"],QItemSection:w["a"],QInput:O["a"],QIcon:k["a"],QPopupProxy:j["a"],QDate:C["a"],QBtn:I["a"],QCheckbox:Q["a"],QCard:S["a"],QCardSection:P["a"],QBadge:D["a"],QList:N["a"],QItemLabel:A["a"],QSeparator:L["a"]}),E()($,"directives",{ClosePopup:B["a"]})}}]);