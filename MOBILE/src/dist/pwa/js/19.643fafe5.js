(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[19],{"70b8":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("q-page",[a("order-header",{attrs:{order:e.order}}),a("q-card",{staticClass:"my-card"},[a("TuyenNhanVien",{attrs:{order:e.order,metaValue:e.metaValue,disable:e.disable}})],1),a("q-card",[a("q-card-section",[void 0==e.order.Requests||e.order.Requests&&!Object.keys(e.order.Requests).length?a("q-checkbox",{attrs:{label:"Đồng ý"},model:{value:e.disable,callback:function(t){e.disable=t},expression:"disable"}}):e._e()],1)],1),e.disable?a("order-approved",{attrs:{metaValue:e.metaValue,order:e.order}}):e._e(),a("send-message",{attrs:{order:e.order}})],1)},n=[],s=(a("8e6e"),a("8a81"),a("ac6a"),a("cadf"),a("06db"),a("456d"),a("f751"),a("9523")),o=a.n(s),i=a("2f62"),l=a("932a"),c=a("6664"),d=a("0ac8"),u=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("q-card-section",[a("div",{staticClass:"q-gutter-sm text-primary text-h6"},[e._v("\r\n        Tuyển nhân viên :\r\n        "),a("br")]),a("div",{staticClass:"q-gutter-sm q-mt-sm"}),"Không được duyệt"==e.order.status?a("div",[e._l(e.order.OrderMeta.filter((function(e){return e.maNV})),(function(t,r){return a("div",{key:r},[a("q-card",{staticClass:"q-mb-sm q-mt-sm"},[a("q-card-section",[a("div",{staticClass:"row"},[a("q-input",{staticClass:"q-mt-sm col q-pr-sm",attrs:{outlined:"",label:"STT :",readonly:!e.disable},model:{value:t.STT,callback:function(a){e.$set(t,"STT",a)},expression:"task.STT"}}),a("q-input",{staticClass:"q-mt-sm col q-pr-sm",attrs:{outlined:"",label:"Phòng ban cần tuyển dụng :",readonly:!e.disable},model:{value:t.department2,callback:function(a){e.$set(t,"department2",a)},expression:"task.department2"}}),a("q-input",{staticClass:"q-mt-sm col ",attrs:{outlined:"",label:"Vị trí : ",readonly:!e.disable},model:{value:t.position,callback:function(a){e.$set(t,"position",a)},expression:"task.position"}})],1),a("div",{staticClass:"row"},[a("q-input",{staticClass:"q-mt-sm col q-mr-sm",attrs:{outlined:"",label:"Số lượng : ",readonly:!e.disable},model:{value:t.number,callback:function(a){e.$set(t,"number",a)},expression:"task.number"}}),a("q-input",{staticClass:"q-mt-sm col ",attrs:{outlined:"",label:"Địa điểm làm việc :",readonly:!e.disable},model:{value:t.locationWork,callback:function(a){e.$set(t,"locationWork",a)},expression:"task.locationWork"}})],1),a("q-input",{staticClass:"q-mt-sm row",attrs:{outlined:"",label:"Thời gian cần tuyển dụng : ",readonly:!e.disable},model:{value:t.timeRecruit,callback:function(a){e.$set(t,"timeRecruit",a)},expression:"task.timeRecruit"}}),a("div",{staticClass:"row"},[a("div",{staticClass:"col"},[a("q-input",{staticClass:"q-mt-sm col",attrs:{outlined:"",label:"Trạng thái phê duyệt : ",readonly:!0},model:{value:t.statusRequests,callback:function(a){e.$set(t,"statusRequests",a)},expression:"task.statusRequests "}})],1)]),a("q-btn",{staticClass:"q-mt-sm",attrs:{color:"primary","text-color":"white",label:"Sửa"},on:{click:function(a){return e.actEdit(t)}}}),a("q-btn",{staticClass:"q-mt-sm q-ml-sm",attrs:{color:"orange","text-color":"white",label:"Xóa"},on:{click:function(a){return e.RowDelted(t)}}})],1)],1)],1)})),a("q-btn",{directives:[{name:"show",rawName:"v-show",value:e.disable,expression:"disable"}],staticClass:"q-mt-sm q-mr-sm",attrs:{color:"primary","text-color":"white",label:"Thêm"},on:{click:function(t){return e.initNewRow(e.task)}}}),a("q-btn",{staticClass:"q-mt-sm",attrs:{color:"primary","text-color":"white",label:"Hoàn thành"},on:{click:e.updatedOrderMeta}})],2):a("div",[a("q-btn",{directives:[{name:"show",rawName:"v-show",value:!e.disable,expression:"!disable"}],staticClass:"q-mt-sm",attrs:{color:"primary","text-color":"white",label:"Thêm"},on:{click:function(t){return e.initNewRow(e.task)}}}),e._l(e.order.OrderMeta.filter((function(e){return e.maNV})),(function(t,r){return a("div",{key:r},[a("q-card",{staticClass:"q-mb-sm q-mt-sm"},[a("q-card-section",[a("div",{staticClass:"row"},[a("q-input",{staticClass:"q-mt-sm col q-pr-sm",attrs:{outlined:"",label:"STT :",readonly:e.disable},model:{value:t.STT,callback:function(a){e.$set(t,"STT",a)},expression:"task.STT"}}),a("q-input",{staticClass:"q-mt-sm col ",attrs:{outlined:"",label:"Phòng ban cần tuyển dụng :",readonly:e.disable},model:{value:t.department2,callback:function(a){e.$set(t,"department2",a)},expression:"task.department2"}})],1),a("div",{staticClass:"row"},[a("q-input",{staticClass:"q-mt-sm col q-mr-sm",attrs:{outlined:"",label:"Vị trí : ",readonly:e.disable},model:{value:t.position,callback:function(a){e.$set(t,"position",a)},expression:"task.position"}}),a("q-input",{staticClass:"q-mt-sm col ",attrs:{outlined:"",label:"Số lượng : ",readonly:e.disable},model:{value:t.number,callback:function(a){e.$set(t,"number",a)},expression:"task.number"}})],1),a("q-input",{staticClass:"q-mt-sm col ",attrs:{outlined:"",label:"Địa điểm làm việc :",readonly:e.disable},model:{value:t.locationWork,callback:function(a){e.$set(t,"locationWork",a)},expression:"task.locationWork"}}),a("q-input",{staticClass:"q-mt-sm row",attrs:{outlined:"",label:"Thời gian cần tuyển dụng : ",readonly:e.disable},model:{value:t.timeRecruit,callback:function(a){e.$set(t,"timeRecruit",a)},expression:"task.timeRecruit"}}),a("div",{staticClass:"row"},[a("div",{staticClass:"col"},[a("q-input",{staticClass:"q-mt-sm col",attrs:{outlined:"",label:"Trạng thái phê duyệt : ",readonly:!0},model:{value:t.statusRequests,callback:function(a){e.$set(t,"statusRequests",a)},expression:"task.statusRequests "}})],1)]),0==e.order.Requests.length&&"Xem xét"==t.statusRequests||"Hủy"==t.statusRequests?a("q-btn",{staticClass:"q-mt-sm shadow-7",attrs:{push:"",color:"primary","text-color":"white",label:"Sửa"},on:{click:function(a){return e.actEdit(t)}}}):e._e(),0==e.order.Requests.length&&"Xem xét"==t.statusRequests||"Hủy"==t.statusRequests?a("q-btn",{staticClass:"q-mt-sm q-ml-sm shadow-7",attrs:{push:"",color:"orange","text-color":"white",label:"Xóa"},on:{click:function(a){return e.RowDelted(t)}}}):e._e()],1)],1)],1)}))],2),a("q-dialog",{attrs:{"full-width":"",persistent:"","transition-show":"scale","transition-hide":"scale"},model:{value:e.active,callback:function(t){e.active=t},expression:"active"}},[a("q-card",{staticClass:"bg-white text-black",staticStyle:{width:"auto"}},[a("q-card-section",[a("div",{staticClass:"text-h6 bg-primary q-pa-sm text-white text-center shadow-5",staticStyle:{"border-radius":"5px"}},[e._v("Thêm dữ liệu")])]),a("q-card-section",{staticClass:"q-pt-none"},[a("q-input",{staticClass:"q-mt-sm q-pl-sm",attrs:{outlined:"",label:"STT: ",readonly:!1},model:{value:e.order.OrderMeta[0].STT,callback:function(t){e.$set(e.order.OrderMeta[0],"STT",t)},expression:"order.OrderMeta[0].STT"}}),a("q-input",{staticClass:"q-mt-sm q-pl-sm col",attrs:{outlined:"",label:"Phòng ban cần tuyển dụng :",readonly:!1},model:{value:e.order.OrderMeta[0].department2,callback:function(t){e.$set(e.order.OrderMeta[0],"department2",t)},expression:"order.OrderMeta[0].department2"}}),a("q-input",{staticClass:"q-mt-sm q-pl-sm",attrs:{outlined:"",label:"Vị trí: ",readonly:!1},model:{value:e.order.OrderMeta[0].position,callback:function(t){e.$set(e.order.OrderMeta[0],"position",t)},expression:"order.OrderMeta[0].position"}}),a("q-input",{staticClass:"q-mt-sm q-pl-sm",attrs:{outlined:"",label:"Số lượng: ",type:"number",readonly:!1},model:{value:e.order.OrderMeta[0].number,callback:function(t){e.$set(e.order.OrderMeta[0],"number",t)},expression:"order.OrderMeta[0].number"}}),a("q-input",{staticClass:"q-mt-sm q-pl-sm",attrs:{outlined:"",label:"Địa điểm làm việc: ",readonly:!1},model:{value:e.order.OrderMeta[0].locationWork,callback:function(t){e.$set(e.order.OrderMeta[0],"locationWork",t)},expression:"order.OrderMeta[0].locationWork"}}),a("div",{staticClass:"col q-pl-sm q-mt-sm"},[a("q-input",{attrs:{filled:"",label:"Thời gian cần tuyển dụng"},scopedSlots:e._u([{key:"append",fn:function(){return[a("q-icon",{staticClass:"cursor-pointer",attrs:{name:"access_time"}},[a("q-popup-proxy",{attrs:{"transition-show":"scale","transition-hide":"scale"}},[a("q-date",{attrs:{mask:"DD-MM-YYYY"},model:{value:e.order.OrderMeta[0].timeRecruit,callback:function(t){e.$set(e.order.OrderMeta[0],"timeRecruit",t)},expression:"order.OrderMeta[0].timeRecruit"}},[a("div",{staticClass:"row items-center justify-end"},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:"Close",color:"primary",flat:""}})],1)])],1)],1)]},proxy:!0}]),model:{value:e.order.OrderMeta[0].timeRecruit,callback:function(t){e.$set(e.order.OrderMeta[0],"timeRecruit",t)},expression:"order.OrderMeta[0].timeRecruit"}})],1)],1),a("q-card-actions",{staticClass:"bg-white text-teal",attrs:{align:"right"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"OK"},on:{click:e.RowInserted}}),a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Back"}})],1)],1)],1),a("q-dialog",{attrs:{"full-width":"",persistent:"","transition-show":"scale","transition-hide":"scale"},model:{value:e.activeEdit,callback:function(t){e.activeEdit=t},expression:"activeEdit"}},[a("q-card",{staticClass:"bg-white text-black",staticStyle:{width:"auto"}},[a("q-card-section",[a("div",{staticClass:"text-h6 bg-primary q-pa-sm text-white text-center shadow-5",staticStyle:{"border-radius":"5px"}},[e._v("Sửa dữ liệu")])]),a("q-card-section",{staticClass:"q-pt-none"},[a("q-input",{staticClass:"q-mt-sm q-pl-sm",attrs:{outlined:"",label:"STT: ",readonly:!1},model:{value:e.modelEdit.STT,callback:function(t){e.$set(e.modelEdit,"STT",t)},expression:"modelEdit.STT"}}),a("q-input",{staticClass:"q-mt-sm col q-pl-sm",attrs:{outlined:"",label:"Phòng ban cần tuyển dụng :",readonly:!1},model:{value:e.modelEdit.department2,callback:function(t){e.$set(e.modelEdit,"department2",t)},expression:"modelEdit.department2"}}),a("q-input",{staticClass:"q-mt-sm q-pl-sm",attrs:{outlined:"",label:"Vị trí: ",readonly:!1},model:{value:e.modelEdit.position,callback:function(t){e.$set(e.modelEdit,"position",t)},expression:"modelEdit.position"}}),a("q-input",{staticClass:"q-mt-sm q-pl-sm",attrs:{outlined:"",label:"Số lượng: ",type:"number",readonly:!1},model:{value:e.modelEdit.number,callback:function(t){e.$set(e.modelEdit,"number",t)},expression:"modelEdit.number"}}),a("q-input",{staticClass:"q-mt-sm q-pl-sm",attrs:{outlined:"",label:"Địa điểm làm việc: ",readonly:!1},model:{value:e.modelEdit.locationWork,callback:function(t){e.$set(e.modelEdit,"locationWork",t)},expression:"modelEdit.locationWork"}}),a("div",{staticClass:"col q-pl-sm q-mt-sm"},[a("q-input",{attrs:{filled:"",label:"Thời gian cần tuyển dụng"},scopedSlots:e._u([{key:"append",fn:function(){return[a("q-icon",{staticClass:"cursor-pointer",attrs:{name:"access_time"}},[a("q-popup-proxy",{attrs:{"transition-show":"scale","transition-hide":"scale"}},[a("q-date",{attrs:{mask:"DD-MM-YYYY"},model:{value:e.modelEdit.timeRecruit,callback:function(t){e.$set(e.modelEdit,"timeRecruit",t)},expression:"modelEdit.timeRecruit"}},[a("div",{staticClass:"row items-center justify-end"},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:"Close",color:"primary",flat:""}})],1)])],1)],1)]},proxy:!0}]),model:{value:e.modelEdit.timeRecruit,callback:function(t){e.$set(e.modelEdit,"timeRecruit",t)},expression:"modelEdit.timeRecruit"}})],1)],1),a("q-card-actions",{staticClass:"bg-white text-teal",attrs:{align:"right"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"OK"},on:{click:e.RowUpdated}}),a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Back"}})],1)],1)],1)],1)},m=[],p=(a("7f7f"),a("a34a")),b=a.n(p),f=(a("96cf"),a("c973")),q=a.n(f),h=a("bc3a"),v=a.n(h);a("c1df");function O(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function y(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?O(Object(a),!0).forEach((function(t){o()(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):O(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var k={props:["metaValue","disable","order"],created:function(){var e=this;return q()(b.a.mark((function t(){return b.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.GET_DEPARTMENTSBYID(e.userInfo.department);case 2:e.nameDepartmentName=t.sent,console.log("this.nameDepartmentName",e.nameDepartmentName.NAME),e.status=e.$route.query.status,console.log("status",e.status),console.log("dsCongDoans",e.dsCongDoans),console.log("userInfo",e.userInfo);case 8:case"end":return t.stop()}}),t)})))()},data:function(){return{events:[],nameDepartment:{},status:"",phoneNumber:"",nameDepartmentName:null,active:!1,options:null,account:[],accountName:"",totalHours:0,totalHoursUpd:0,activeEdit:!1,modelEdit:{STT:null,department2:null,position:null,number:null,locationWork:null,timeRecruit:null,id:null}}},computed:y(y({},Object(i["c"])("orders",["order"])),Object(i["c"])("base",["userInfo"])),methods:y(y(y(y(y({},Object(i["b"])("base",["GET_DEPARTMENTSBYID","GET_DEPARTMENTSALL","GET_ACCOUNTS"])),Object(i["b"])("orders",["getOneOrder","getAllRequests"])),Object(i["b"])("orderMetas",["getOneOrderMeta","addorderMeta","deleteOrderMeta","updateOrderMeta"])),Object(i["b"])("requests",["deleteRequest","resetOrder"])),{},{changed:function(){var e=this;return q()(b.a.mark((function t(){var a;return b.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return console.log("changed"),e.order.OrderMeta[0].fullName=e.accountName.name,e.order.OrderMeta[0].position2=e.accountName.position,t.next=5,e.GET_DEPARTMENTSBYID(e.accountName.departmentId);case 5:a=t.sent,console.log("department2",a),e.order.OrderMeta[0].department2=a.NAME;case 8:case"end":return t.stop()}}),t)})))()},filterFn:function(e,t){var a=this;t(""!==e?function(){var t=e.toLowerCase();a.options=a.account.filter((function(e){return e.label.toLowerCase().indexOf(t)>-1}))}:function(){a.options=a.account})},loadData:function(e){var t=this;return q()(b.a.mark((function a(){var r;return b.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return r=null,a.prev=1,a.next=4,t.getOneOrder(e);case 4:r=a.sent,a.next=10;break;case 7:a.prev=7,a.t0=a["catch"](1),console.log(a.t0);case 10:r||t.$router.push({path:"/tao-de-xuat"}),t.order.OrderMeta=r.data.data.OrderMeta,console.log(r);case 13:case"end":return a.stop()}}),a,null,[[1,7]])})))()},initNewRow:function(){console.log("init"),this.active=!0},actEdit:function(e){var t=this;return q()(b.a.mark((function a(){return b.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:console.log("task",e),t.modelEdit.number=e.number,t.modelEdit.STT=e.STT,t.modelEdit.locationWork=e.locationWork,t.modelEdit.timeRecruit=e.timeRecruit,t.modelEdit.position=e.position,t.modelEdit.department2=e.department2,t.modelEdit.id=e.id,t.activeEdit=!0;case 9:case"end":return a.stop()}}),a)})))()},RowInserted:function(){var e=this;return q()(b.a.mark((function t(){var a,r,n,s,o,i,l,c,d,u,m,p;return b.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.active=!1,a=e.userInfo.lastName,r=e.nameDepartmentName.NAME,n=e.order.OrderMeta[0].department2,s=e.userInfo.PHONE,o="Tuyển nhân viên",i=e.order.OrderMeta[0].STT,l=e.userInfo.account,c=e.order.OrderMeta[0].locationWork,d=e.order.OrderMeta[0].timeRecruit,u=e.order.OrderMeta[0].position,m=e.order.OrderMeta[0].number,p="Xem xét",t.next=15,e.addorderMeta(y(y({},e.order.OrderMeta[0]),{},{metaValue:JSON.stringify([e.metaValue]),fullName:a,phoneNumber:s,selection:o,STT:i,locationWork:c,timeRecruit:d,maNV:l,department:r,position:u,statusRequests:p,number:m,department2:n}));case 15:return t.next=17,e.loadData(e.$route.query.id);case 17:case"end":return t.stop()}}),t)})))()},RowDelted:function(e){var t=this;return q()(b.a.mark((function a(){return b.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return console.log("STT",e.id),a.next=3,t.deleteOrderMeta(e.id);case 3:return a.next=5,t.loadData(t.$route.query.id);case 5:case"end":return a.stop()}}),a)})))()},RowUpdated:function(e){var t=this;return q()(b.a.mark((function e(){var a,r,n,s,o,i,l,c,d,u,m,p,f;return b.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a=t.userInfo.lastName,r=t.nameDepartmentName.NAME,n=t.modelEdit.department2,s=t.userInfo.PHONE,o="Tuyển nhân viên",i=t.modelEdit.STT,l=t.userInfo.account,c=t.modelEdit.locationWork,d=t.modelEdit.timeRecruit,u=t.modelEdit.position,m=t.modelEdit.number,p="Xem xét",f=t.modelEdit.id,e.next=15,t.updateOrderMeta(y(y({},t.order.OrderMeta[0]),{},{metaValue:JSON.stringify([t.metaValue]),fullName:a,phoneNumber:s,selection:o,STT:i,locationWork:c,timeRecruit:d,maNV:l,department:r,position:u,statusRequests:p,id:f,number:m,department2:n}));case 15:return e.next=17,t.loadData(t.$route.query.id);case 17:case"end":return e.stop()}}),e)})))()},updatedOrderMeta:function(){var e=this;return q()(b.a.mark((function t(){var a,r,n,s,o;return b.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a=e.userInfo.lastName,r=e.userInfo.PHONE,n=e.userInfo.position,s=e.nameDepartmentName.NAME,o="Tuyển nhân viên",e.updateOrderMeta(y(y({},e.order.OrderMeta[0]),{},{metaValue:JSON.stringify([e.metaValue]),fullName:a,phoneNumber:r,position:n,department:s,selection:o})),t.next=8,v.a.put("/api/v2/orders?orderId=".concat(e.order.id));case 8:return t.next=10,e.deleteRequest(e.order.id);case 10:location.reload();case 11:case"end":return t.stop()}}),t)})))()}})},w=k,g=(a("9565"),a("2877")),x=a("a370"),T=a("f09f"),C=a("27f9"),E=a("9c40"),M=a("24e8"),R=a("0016"),N=a("7cbe"),S=a("52ee"),D=a("4b7e"),j=a("7f67"),$=a("eebe"),P=a.n($),V=Object(g["a"])(w,u,m,!1,null,"3b77ab71",null),I=V.exports;function _(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function W(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?_(Object(a),!0).forEach((function(t){o()(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):_(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}P()(V,"components",{QCardSection:x["a"],QCard:T["a"],QInput:C["a"],QBtn:E["a"],QDialog:M["a"],QIcon:R["a"],QPopupProxy:N["a"],QDate:S["a"],QCardActions:D["a"]}),P()(V,"directives",{ClosePopup:j["a"]});var A={data:function(){return{disable:!1,metaValue:{kinhGui:"Ban TGĐ - Trưởng phòng/phó phòng ban :  -\tGĐSX/Phó GĐSX/Phụ trách nhà máy :",noiDungTT:"",soTien:0,vietBangChu:"",kemTheo:"",STT:"12",locationWork:"",position:"",position2:"",number:"",timeRecruit:"",description:"",fullName:"",fullName2:"",maNV:"",department:"",department2:"",stepDepartment:"",lyDo:"",dateStart:"",dateEnd:"",selection1:null,selection2:null,selection3:null,selection4:null,selection:null,thoiGianMangThai:"",xinRaCong:"",luongHienTai:"",luongDeXuat:"",thoiGianTangLuongGanNhat:"",phoneNumber:""}}},components:{SendMessage:l["a"],OrderHeader:c["a"],OrderApproved:d["a"],TuyenNhanVien:I},methods:W(W({},Object(i["b"])("orders",["getOneOrder","getAllRequests"])),Object(i["b"])("orderMetas",["getOneOrderMeta","addorderMeta"])),computed:W(W({},Object(i["c"])("orders",["order"])),Object(i["c"])("base",["userInfo","myFactoryInfor"])),created:function(){var e=this;this.$route.query.id?this.getOneOrder(this.$route.query.id).then((function(t){t.data.data.Requests.length&&(e.disable=!0),e.metaValue=Object.assign(e.metaValue,JSON.parse(t.data.data.OrderMeta[0].metaValue)[0])})):this.$router.push({path:"/tao-de-xuat"})}},Q=A,G=a("9989"),Y=a("8f8e"),H=Object(g["a"])(Q,r,n,!1,null,null,null);t["default"]=H.exports;P()(H,"components",{QPage:G["a"],QCard:T["a"],QCardSection:x["a"],QCheckbox:Y["a"]})},9565:function(e,t,a){"use strict";var r=a("a3d6"),n=a.n(r);n.a},a3d6:function(e,t,a){}}]);