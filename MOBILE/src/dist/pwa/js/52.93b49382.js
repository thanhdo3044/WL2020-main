(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[52],{f1f6:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"bg-amber-2 q-mt-sm text-h6  text-center",staticStyle:{padding:"12px"}},[t._v("\n    Ủy quyền phê duyệt\n  ")]),a("div",{staticClass:"q-ma-sm"},[0==t.statusAuthority?a("q-select",{staticClass:"q-mt-sm",staticStyle:{width:"100%"},attrs:{label:"Người được ủy quyền","transition-show":"flip-up","transition-hide":"flip-down",filled:"",readonly:t.statusAuthority,options:t.listAuthority},model:{value:t.authority,callback:function(e){t.authority=e},expression:"authority"}}):t._e(),0==t.statusAuthority?a("q-input",{staticClass:"q-mt-sm",attrs:{filled:"",label:"Ủy quyền từ ngày : "},scopedSlots:t._u([{key:"append",fn:function(){return[a("q-icon",{staticClass:"cursor-pointer",attrs:{name:"event"}},[a("q-popup-proxy",{ref:"qDateProxy",attrs:{"transition-show":"scale","transition-hide":"scale"}},[a("q-date",{attrs:{mask:"DD-MM-YYYY"},model:{value:t.timeStartAuthority,callback:function(e){t.timeStartAuthority=e},expression:"timeStartAuthority"}},[a("div",{staticClass:"row items-start justify-start"},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:"Close",color:"primary",flat:""}})],1)])],1)],1)]},proxy:!0}],null,!1,1199257223),model:{value:t.timeStartAuthority,callback:function(e){t.timeStartAuthority=e},expression:"timeStartAuthority"}}):t._e(),0==t.statusAuthority?a("q-input",{staticClass:"q-mt-sm",attrs:{filled:"",label:"Ủy quyền đến ngày : "},scopedSlots:t._u([{key:"append",fn:function(){return[a("q-icon",{staticClass:"cursor-pointer",attrs:{name:"event"}},[a("q-popup-proxy",{ref:"qDateProxy",attrs:{"transition-show":"scale","transition-hide":"scale"}},[a("q-date",{attrs:{mask:"DD-MM-YYYY"},model:{value:t.timeEndAuthority,callback:function(e){t.timeEndAuthority=e},expression:"timeEndAuthority"}},[a("div",{staticClass:"row items-start justify-start"},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:"Close",color:"primary",flat:""}})],1)])],1)],1)]},proxy:!0}],null,!1,3007555304),model:{value:t.timeEndAuthority,callback:function(e){t.timeEndAuthority=e},expression:"timeEndAuthority"}}):t._e(),t._m(0),a("q-card",{staticClass:"q-pa-sm q-mb-sm q-mt-sm"},[a("q-tree",{staticClass:"col-12 col-sm-6",attrs:{nodes:t.customize,"node-key":"label","tick-strategy":"leaf",ticked:t.ticked,expanded:t.expanded},on:{"update:ticked":function(e){t.ticked=e},"update:expanded":function(e){t.expanded=e}},scopedSlots:t._u([{key:"default-header",fn:function(e){return[a("div",{staticClass:"row items-center"},[a("div",{staticClass:"text-weight-bold text-primary q-ml-sm"},[t._v("\n              "+t._s(e.node.label)+"\n            ")])])]}},{key:"body-story",fn:function(e){return[a("span",{staticClass:"text-weight-thin"},[t._v("The story is:")]),t._v("\n          "+t._s(e.node.story)+"\n        ")]}},{key:"body-toggle",fn:function(e){return[a("p",{staticClass:"text-caption"},[t._v(t._s(e.node.caption))]),a("q-toggle",{attrs:{label:"I agree to the terms and conditions"},model:{value:e.node.enabled,callback:function(a){t.$set(e.node,"enabled",a)},expression:"prop.node.enabled"}})]}}])}),a("div",[t._v("Phiếu đã chọn : "+t._s(t.ticked))])],1),a("q-btn",{staticClass:"q-mt-sm bg-primary text-white shadow-8",on:{click:t.check}},[t._v("Xác nhận")]),a("q-btn",{staticClass:"q-mt-sm q-ml-sm bg-primary text-white shadow-8",on:{click:function(e){t.dialogHistory=!0}}},[t._v("Lịch sử ủy quyền")]),a("q-dialog",{staticStyle:{"z-index":"1 !important"},attrs:{"transition-show":"rotate","transition-hide":"rotate"},model:{value:t.dialogHistory,callback:function(e){t.dialogHistory=e},expression:"dialogHistory"}},[a("q-card",[a("q-card-section",{staticClass:"row items-center q-pb-none"},[a("div",{staticClass:"text-h6 bg-primary text-white shadow-8",staticStyle:{padding:"5px","border-radius":"5px"}},[t._v("\n            Lịch sử ủy quyền\n          ")]),a("q-space"),a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],staticClass:"bg-orange text-white",attrs:{size:"16px",icon:"directions",push:"",round:"",dense:""}})],1),a("q-card-section",[a("q-list",{attrs:{separator:""}},t._l(t.PermissionAuthorised.data.data.filter((function(t){return t.slug})),(function(e,n){return a("q-item",{key:n,staticClass:"q-mt-sm bg-cyan-1 shadow-8 text-black"},[a("q-item-section",[a("b",[t._v(t._s(e.name))]),a("br"),t._v("\n                Người Được ủy quyền : "),a("b",[t._v(t._s(e.LAST_NAME))]),a("br"),t._v("\n                Từ ngày : "+t._s(e.timeStartAuthority)),a("br"),t._v("\n                Đến ngày : "+t._s(e.timeEndAuthority)),a("br"),t._v("\n                Ngày tạo ủy quyền :\n                "+t._s(t.moment(e.createdAtAutho).format("l"))),a("br")]),a("q-item-section",{attrs:{side:""}},[a("q-icon",{staticClass:"bg-red shadow-6",staticStyle:{padding:"5px","border-radius":"50%","font-size":"20px"},attrs:{push:"",round:"",dense:"",name:"delete",color:"white"},on:{click:function(a){return t.del(e)}}}),a("q-icon",{staticClass:"q-mt-lg shadow-6 bg-orange",staticStyle:{padding:"5px","border-radius":"50%","font-size":"20px"},attrs:{push:"",round:"",dense:"",name:"edit",color:"white"},on:{click:function(a){return t.edit(e)}}})],1)],1)})),1)],1)],1)],1)],1),a("q-dialog",{staticStyle:{"z-index":"999999 !important"},attrs:{"transition-show":"rotate","transition-hide":"rotate"},model:{value:t.dialogEdit,callback:function(e){t.dialogEdit=e},expression:"dialogEdit"}},[a("q-card",[a("q-card-section",[a("q-card-section",{staticClass:"bg-primary text-white",staticStyle:{padding:"5px","border-radius":"5px","font-size":"20px"}},[t._v("\n          Chỉnh sửa ủy quyền\n        ")]),a("div",{staticClass:"q-mt-sm q-ml-sm text-bold"},[t._v(t._s(t.formDataEdit.name))]),a("q-select",{staticClass:"q-mt-sm",staticStyle:{width:"100%"},attrs:{label:"Người được ủy quyền","transition-show":"flip-up","transition-hide":"flip-down",filled:"",readonly:t.statusAuthority,options:t.listAuthority},model:{value:t.authority,callback:function(e){t.authority=e},expression:"authority"}}),a("q-input",{staticClass:"q-mt-sm",attrs:{filled:"",label:"Ủy quyền từ ngày : "},scopedSlots:t._u([{key:"append",fn:function(){return[a("q-icon",{staticClass:"cursor-pointer",attrs:{name:"event"}},[a("q-popup-proxy",{ref:"qDateProxy",attrs:{"transition-show":"scale","transition-hide":"scale"}},[a("q-date",{attrs:{mask:"DD-MM-YYYY"},model:{value:t.formDataEdit.timeStartAuthority,callback:function(e){t.$set(t.formDataEdit,"timeStartAuthority",e)},expression:"formDataEdit.timeStartAuthority"}},[a("div",{staticClass:"row items-start justify-start"},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:"Close",color:"primary",flat:""}})],1)])],1)],1)]},proxy:!0}]),model:{value:t.formDataEdit.timeStartAuthority,callback:function(e){t.$set(t.formDataEdit,"timeStartAuthority",e)},expression:"formDataEdit.timeStartAuthority"}}),a("q-input",{staticClass:"q-mt-sm",attrs:{filled:"",label:"Ủy quyền đến ngày : "},scopedSlots:t._u([{key:"append",fn:function(){return[a("q-icon",{staticClass:"cursor-pointer",attrs:{name:"event"}},[a("q-popup-proxy",{ref:"qDateProxy",attrs:{"transition-show":"scale","transition-hide":"scale"}},[a("q-date",{attrs:{mask:"DD-MM-YYYY"},model:{value:t.formDataEdit.timeEndAuthority,callback:function(e){t.$set(t.formDataEdit,"timeEndAuthority",e)},expression:"formDataEdit.timeEndAuthority"}},[a("div",{staticClass:"row items-start justify-start"},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:"Close",color:"primary",flat:""}})],1)])],1)],1)]},proxy:!0}]),model:{value:t.formDataEdit.timeEndAuthority,callback:function(e){t.$set(t.formDataEdit,"timeEndAuthority",e)},expression:"formDataEdit.timeEndAuthority"}}),a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],staticClass:"q-mt-lg",attrs:{label:"Xác nhận",color:"teal"},on:{click:t.activeEdit}})],1)],1)],1)],1)},r=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"bg-primary text-white  q-mt-sm row",staticStyle:{padding:"5px","border-radius":"5px"}},[a("div",{staticClass:" text-center",staticStyle:{"align-item":"center","font-size":"18px"}},[t._v("\n        Danh sách phiếu có thể ủy quyền :\n      ")])])}],i=(a("8e6e"),a("8a81"),a("ac6a"),a("cadf"),a("06db"),a("456d"),a("7f7f"),a("a34a")),s=a.n(i),o=(a("96cf"),a("c973")),u=a.n(o),c=a("9523"),l=a.n(c),d=a("2f62"),p=(a("06ae"),a("1732"),a("c1df"),a("bc3a")),m=a.n(p),h=a("2a19");a("f508"),a("d9b2");function y(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function f(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?y(Object(a),!0).forEach((function(e){l()(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):y(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var g={methods:f(f(f(f(f({},Object(d["b"])("requests",["getAllRequests"])),Object(d["b"])("base",["GET_DEPARTMENTSBYID","getAccountByID"])),Object(d["b"])("requests",["getOneRequest","addRequest","completedRequest","cancelRequest","activeRequestsMeta","completedTimeVT","deleteReqAuthority","isAuthority","permissionAuthorised","getPermissionAuthorised","editPermissionAuthorised","delPermissionAuthorised"])),Object(d["b"])("orders",["getOneOrder","sendToApproved","getAllOrders"])),{},{del:function(t){var e=this;return u()(s.a.mark((function a(){var n;return s.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return console.log(t),n={accountId:e.userInfo.id,id:t.idAutho},a.next=4,e.delPermissionAuthorised(n);case 4:e.loadData();case 5:case"end":return a.stop()}}),a)})))()},edit:function(t){var e=this;return u()(s.a.mark((function a(){return s.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:e.dialogEdit=!0,console.log(t),e.formDataEdit.name=t.name,e.formDataEdit.timeStartAuthority=t.timeStartAuthority,e.formDataEdit.timeEndAuthority=t.timeEndAuthority,e.formDataEdit.accountIdAuthorised=e.authority.value,e.formDataEdit.id=t.idAutho;case 7:case"end":return a.stop()}}),a)})))()},activeEdit:function(){var t=this;return u()(s.a.mark((function e(){var a;return s.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(a={accountIdAuthorised:t.authority.value,timeEndAuthority:t.formDataEdit.timeEndAuthority,timeStartAuthority:t.formDataEdit.timeStartAuthority,id:t.formDataEdit.id,accountId:t.userInfo.id},console.log("payloadActive",a),null==a.accountIdAuthorised){e.next=9;break}return e.next=5,t.editPermissionAuthorised(a);case 5:return e.next=7,t.loadData();case 7:e.next=10;break;case 9:h["a"].create({type:"negative",message:"Vui lòng chọn người được ủy quyền!"});case 10:case"end":return e.stop()}}),e)})))()},checkAllReq:function(t,e){var a=this;return u()(s.a.mark((function e(){return s.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:console.log("value",t),t&&console.log("listReq",a.listReq);case 2:case"end":return e.stop()}}),e)})))()},getAccount:function(t){var e=this;return u()(s.a.mark((function a(){var n;return s.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,e.getAccountByID(t);case 2:return n=a.sent,a.abrupt("return",n);case 4:case"end":return a.stop()}}),a)})))()},check:function(){var t=this;return u()(s.a.mark((function e(){return s.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:t.$q.dialog({title:"Xác nhận",message:"Bạn thực sự muốn Ủy quyền?",ok:{push:!0},cancel:{color:"negative"},persistent:!0}).onOk(u()(s.a.mark((function e(){var a,n,r;return s.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(null!=t.authority.value){e.next=5;break}console.log("menuSelectedRowKeys",t.menuSelectedRowKeys),h["a"].create({type:"negative",message:"Vui lòng chọn người được ủy quyền!"}),e.next=21;break;case 5:for(console.log("listReq",t.listReq),console.log("menuSelectedRowKeys",t.menuSelectedRowKeys),a={id:t.userInfo.id,permissonAuthorised:[]},n=[],console.log("this.listParentNS",t.listParentNS),r=0;r<t.listParentNS.length;r++)t.listParentNS[r].label==t.ticked[r]&&n.push({id:t.listParentNS[r].id});return t.ticked.filter((function(e){t.listParentVT.filter((function(t){e==t.label&&n.push({id:t.id})}))})),console.log("dataPush",n),e.next=15,n.forEach((function(e){console.log("e",e),a.permissonAuthorised.push({timeStartAuthority:t.timeStartAuthority,timeEndAuthority:t.timeEndAuthority,accountIdAuthorised:t.authority.value,accountId:t.userInfo.id,idProposalForm:e.id})}));case 15:return console.log("payload",a),e.next=18,t.permissionAuthorised(a);case 18:return e.sent,e.next=21,t.loadData();case 21:case"end":return e.stop()}}),e)}))));case 1:case"end":return e.stop()}}),e)})))()},loadData:function(){var t=this;return u()(s.a.mark((function e(){var a,n,r,i,o;return s.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.listAuthority=[],e.next=3,t.GET_DEPARTMENTSBYID(t.userInfo.departmentId);case 3:return a=e.sent,e.next=6,t.getAccountByID(a.accountId1);case 6:return n=e.sent,e.next=9,t.getAccountByID(a.accountId2);case 9:return r=e.sent,console.log("dataAccount2",n),console.log("dataAccount3",r),t.listAuthority.push({label:void 0==n?" ":n.LAST_NAME,value:void 0==n?" ":n.ID},{label:void 0==r?" ":r.LAST_NAME,value:void 0==r?" ":r.ID}),console.log("listAuthority",t.listAuthority),console.log("requests",t.request),t.getAllRequests(t.userInfo.id),t.selectedRowKeys=[],e.next=19,t.getAllOrders(t.userInfo.id);case 19:return t.dataOrder=e.sent,e.next=22,m.a.get("/api/v2/accountForm?accountId="+t.userInfo.id);case 22:return i=e.sent,o=i.data,t.dSBieuMauSuDung=o.data,console.log("this.dSBieuMauSuDung"),console.log(t.dSBieuMauSuDung),console.log("orderdsdsd",t.orders),e.next=30,t.getPermissionAuthorised(t.userInfo.id);case 30:t.PermissionAuthorised=e.sent,console.log("getPermissionAuthorised",t.PermissionAuthorised.data.data);case 32:case"end":return e.stop()}}),e)})))()}}),watch:{result:function(t,e){return u()(s.a.mark((function t(){return s.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:console.log("newValue",e);case 1:case"end":return t.stop()}}),t)})))()}},data:function(){return{selected:"",ticked:[],expanded:[],customize:[{label:"Danh sách đề xuất",header:"root",children:[]}],listParentNS:[],listParentVT:[],formDataEdit:{name:null,id:null,accountIdAuthorised:null,timeStartAuthority:null,timeEndAuthority:null},dataAccount:null,dialogHistory:!1,PermissionAuthorised:null,menuSelectedRowKeys:[],menuExpandedRowKeys:[],listReq:[],dialogEdit:!1,listRe1q:[],result:!0,dataListAuthority:[],nameDepartmentName:null,timeVTAccept:null,authority:{label:null,value:null},listAuthority:[],reqAuthority:[],statusAuthority:!1,timeEndAuthority:null,timeStartAuthority:null,val:null,showAddTask:!1,order:{},title:"",proposalForms:[],ordersData:null,dataOrder:null,expandedRowKeys:[],selectedRowKeys:[],dSBieuMauSuDung:null,dataListOrder:null,dataListOrderOnRq:null,isEditSource:!1}},computed:f(f(f({},Object(d["c"])("requests",["requestsTodo","request"])),Object(d["c"])("base",["userInfo"])),{},{bieuMaus:function(){return this.dSBieuMauSuDung?this.dSBieuMauSuDung.map((function(t){return t.parentId?t:f(f({},t),{},{parentId:0})})):[]}}),components:{"approvals-todo":a("c1fe").default,"no-approvals":a("2294").default},mounted:function(){var t=this;this.$root.$on("showAddOrder",(function(){t.showAddTask=!0})),this.proposalForms=this.dSBieuMauSuDung},created:function(){var t=this;return u()(s.a.mark((function e(){return s.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.loadData();case 2:return e.next=4,t.dSBieuMauSuDung.forEach((function(e){18==e.parentId&&t.listParentNS.push({label:e.name,header:"generic",slug:e.slug,id:e.id}),1024==e.parentId&&t.listParentVT.push({label:e.name,header:"generic",slug:e.slug,id:e.id})}));case 4:return console.log("listParentNS",t.listParentNS),e.next=7,t.dSBieuMauSuDung.forEach(function(){var e=u()(s.a.mark((function e(a){return s.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(null!=a.parentId||18!=a.id){e.next=3;break}return e.next=3,t.customize[0].children.push({label:a.name,header:"generic",icon:"book",children:t.listParentNS});case 3:if(null!=a.parentId||1024!=a.id){e.next=6;break}return e.next=6,t.customize[0].children.push({label:a.name,header:"generic",icon:"book",children:t.listParentVT});case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 7:console.log("this.customize",t.customize);case 8:case"end":return e.stop()}}),e)})))()}},b=g,v=a("2877"),q=a("ddd8"),A=a("27f9"),x=a("0016"),w=a("7cbe"),S=a("52ee"),k=a("9c40"),D=a("f09f"),E=a("7f41"),_=a("9564"),P=a("24e8"),C=a("a370"),I=a("2c91"),O=a("1c1c"),R=a("66e5"),N=a("4074"),M=a("7f67"),T=a("eebe"),j=a.n(T),Y=Object(v["a"])(b,n,r,!1,null,null,null);e["default"]=Y.exports;j()(Y,"components",{QSelect:q["a"],QInput:A["a"],QIcon:x["a"],QPopupProxy:w["a"],QDate:S["a"],QBtn:k["a"],QCard:D["a"],QTree:E["a"],QToggle:_["a"],QDialog:P["a"],QCardSection:C["a"],QSpace:I["a"],QList:O["a"],QItem:R["a"],QItemSection:N["a"]}),j()(Y,"directives",{ClosePopup:M["a"]})}}]);