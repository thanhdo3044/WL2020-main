(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[65],{"0b85":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("q-page",[a("order-header",{attrs:{order:e.order}}),a("q-card",{staticClass:"my-card"},[a("SuaChua",{attrs:{metaValue:e.metaValue,disable:e.disable}})],1),a("q-card",[a("q-card-section",[e.order.Requests&&!Object.keys(e.order.Requests).length||void 0==e.order.Requests?a("q-checkbox",{attrs:{label:"Đồng ý"},model:{value:e.disable,callback:function(t){e.disable=t},expression:"disable"}}):e._e()],1)],1),e.disable?a("order-approved",{attrs:{metaValue:e.metaValue,order:e.order}}):e._e(),a("send-message",{attrs:{order:e.order}})],1)},n=[],o=(a("8e6e"),a("8a81"),a("ac6a"),a("cadf"),a("06db"),a("456d"),a("f751"),a("9523")),s=a.n(o),i=a("2f62"),l=a("932a"),c=a("6664"),d=a("0ac8"),u=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("q-card-section",[a("div",{staticClass:"q-gutter-sm text-primary text-h6"},[e._v("\n       Chọn loại mẫu đề nghị :\n      "),a("br")]),a("div",{staticClass:"q-gutter-sm q-mt-sm"},[null==e.order.OrderMeta[0].selection?a("div",[a("q-radio",{attrs:{dense:"",val:"Đề xuất xin sửa chữa thiết bị",label:"Đề xuất xin sửa chữa thiết bị",color:"teal"},model:{value:e.metaValue.selection,callback:function(t){e.$set(e.metaValue,"selection",t)},expression:"metaValue.selection"}})],1):a("div",["Đề xuất xin sửa chữa thiết bị"==e.order.OrderMeta[0].selection?a("span",[a("q-radio",{attrs:{dense:"",val:"Đề xuất xin sửa chữa thiết bị",color:"red"},model:{value:e.metaValue.selection,callback:function(t){e.$set(e.metaValue,"selection",t)},expression:"metaValue.selection"}})],1):e._e(),a("span",{staticClass:"q-ml-sm",staticStyle:{"font-size":"20px"}},[e._v(e._s(e.metaValue.selection))])])]),"Đề xuất xin sửa chữa thiết bị"==e.metaValue.selection?a("div",["Không được duyệt"==e.order.status?a("div",[a("q-input",{staticClass:"q-mt-sm",attrs:{outlined:"",label:"Bộ phận /phòng ban : ",readonly:!e.disable},model:{value:e.nameDepartmentName.NAME,callback:function(t){e.$set(e.nameDepartmentName,"NAME",t)},expression:"nameDepartmentName.NAME"}}),a("q-input",{staticClass:"q-mt-sm",attrs:{outlined:"",label:"Đề xuất xin sửa chữa thiết bị : ",readonly:!e.disable},model:{value:e.order.OrderMeta[0].tenVT,callback:function(t){e.$set(e.order.OrderMeta[0],"tenVT",t)},expression:"order.OrderMeta[0].tenVT"}}),a("q-input",{staticClass:"q-mt-sm",attrs:{outlined:"",label:"Mã số : ",readonly:!e.disable},model:{value:e.order.OrderMeta[0].maVT,callback:function(t){e.$set(e.order.OrderMeta[0],"maVT",t)},expression:"order.OrderMeta[0].maVT"}}),a("q-input",{staticClass:"q-mt-sm",attrs:{outlined:"",label:"Tình trạng hư hỏng: ",readonly:!e.disable},model:{value:e.order.OrderMeta[0].description,callback:function(t){e.$set(e.order.OrderMeta[0],"description",t)},expression:"order.OrderMeta[0].description"}}),a("q-btn",{staticClass:"q-mt-sm",attrs:{color:"primary","text-color":"white",label:"Sửa"},on:{click:e.updatedOrderMeta}})],1):a("div",[a("q-input",{staticClass:"q-mt-sm",attrs:{outlined:"",label:"Bộ phận /phòng ban : ",readonly:e.disable},model:{value:e.nameDepartmentName.NAME,callback:function(t){e.$set(e.nameDepartmentName,"NAME",t)},expression:"nameDepartmentName.NAME"}}),a("q-input",{staticClass:"q-mt-sm",attrs:{outlined:"",label:"Đề xuất xin sửa chữa thiết bị : ",readonly:e.disable},model:{value:e.order.OrderMeta[0].tenVT,callback:function(t){e.$set(e.order.OrderMeta[0],"tenVT",t)},expression:"order.OrderMeta[0].tenVT"}}),a("q-input",{staticClass:"q-mt-sm",attrs:{outlined:"",label:"Mã số : ",readonly:e.disable},model:{value:e.order.OrderMeta[0].maVT,callback:function(t){e.$set(e.order.OrderMeta[0],"maVT",t)},expression:"order.OrderMeta[0].maVT"}}),a("q-input",{staticClass:"q-mt-sm",attrs:{outlined:"",label:"Tình trạng hư hỏng: ",readonly:e.disable},model:{value:e.order.OrderMeta[0].description,callback:function(t){e.$set(e.order.OrderMeta[0],"description",t)},expression:"order.OrderMeta[0].description"}})],1)]):e._e()])},m=[],p=(a("7f7f"),a("a34a")),b=a.n(p),h=(a("96cf"),a("c973")),O=a.n(h),f=a("6191"),g=a.n(f),M=a("bc3a"),v=a.n(M),x=a("d30a");function V(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function T(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?V(Object(a),!0).forEach((function(t){s()(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):V(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var y={components:{DxDataGrid:x["DxDataGrid"],DxColumn:x["DxColumn"],DxEditing:x["DxEditing"],DxPaging:x["DxPaging"],DxButton:g.a,DxLookup:x["DxLookup"]},props:["metaValue","disable","order"],data:function(){return{myDepartment:null,stepDepartment:null,departments:[],events:[],options:null,nameDepartmentName:null,account:[],active:!0}},created:function(){var e=this;return O()(b.a.mark((function t(){var a,r;return b.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return"Khôngđượcduyệt"==e.$route.query.status&&(e.active=!0,e.disable=!1,console.log("456")),e.active&&(e.disable=!1,console.log("789")),t.next=4,e.GET_DEPARTMENTSALL();case 4:return a=t.sent,console.log("dataa",a),t.next=8,e.GET_ACCOUNTS();case 8:return r=t.sent,console.log("account2",r),t.next=12,r.data.forEach((function(t){e.account.push({value:t.id,label:t.lastName,position:t.position,departmentId:t.departmentId})}));case 12:return console.log("account",e.account),t.next=15,e.GET_DEPARTMENTSBYID(e.userInfo.department);case 15:return e.nameDepartmentName=t.sent,t.next=18,a.forEach((function(t){e.departments.push({value:t.ID,label:t.NAME})}));case 18:console.log("options",e.departments);case 19:case"end":return t.stop()}}),t)})))()},methods:T(T(T(T(T({},Object(i["b"])("requests",["deleteRequest","resetOrder"])),{},{changed:function(){var e=this;return O()(b.a.mark((function t(){var a;return b.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return console.log("changed"),console.log("this.order.OrderMeta[0].position2 ",e.order.OrderMeta[0].position2),console.log("this.metaValue.account2.id",e.metaValue.accountName),e.order.OrderMeta[0].position2=e.metaValue.accountName.position,t.next=6,e.GET_DEPARTMENTSBYID(e.metaValue.accountName.departmentId);case 6:a=t.sent,console.log("department2",a),e.order.OrderMeta[0].department2=a.NAME;case 9:case"end":return t.stop()}}),t)})))()},filterFn:function(e,t){var a=this;t(""!==e?function(){var t=e.toLowerCase();a.options=a.account.filter((function(e){return e.label.toLowerCase().indexOf(t)>-1}))}:function(){a.options=a.account})}},Object(i["b"])("base",["GET_DEPARTMENTSBYID","GET_DEPARTMENTSALL","GET_ACCOUNTS"])),Object(i["b"])("orders",["getOneOrder","getAllRequests"])),Object(i["b"])("orderMetas",["getOneOrderMeta","addorderMeta","deleteOrderMeta","updateOrderMeta"])),{},{chonCongDoan:function(){console.log("myDepartment",this.myDepartment.value)},loadDepartment:function(){var e=this;return O()(b.a.mark((function t(){var a;return b.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$store.dispatch("base/GET_DEPARTMENTS",{factoryId:e.myFactoryInfor.id});case 2:return a=t.sent,console.log("data",a.data),t.next=6,a.data.forEach((function(t){e.departments.push({id:t.id,value:t.name})}));case 6:console.log("this.departments",e.departments);case 7:case"end":return t.stop()}}),t)})))()},updatedOrderMeta:function(){var e=this;return O()(b.a.mark((function t(){var a,r,n,o,s,i,l,c;return b.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return console.log("this.metaValue.account2.id",e.metaValue.accountName),a=e.userInfo.lastName,r=e.metaValue.selection,n=e.userInfo.position,o=e.userInfo.account,s=null==e.order.OrderMeta[0].maVT?" ":e.order.OrderMeta[0].maVT,i=null==e.order.OrderMeta[0].tenVT?" ":e.order.OrderMeta[0].tenVT,l=null==e.order.OrderMeta[0].description?" ":e.order.OrderMeta[0].description,c=null==e.nameDepartmentName.NAME?" ":e.nameDepartmentName.NAME,t.next=11,e.updateOrderMeta(T(T({},e.order.OrderMeta[0]),{},{metaValue:JSON.stringify([e.metaValue]),fullName:a,selection:r,position:n,maNV:o,maVT:s,tenVT:i,lyDo:l,department:c}));case 11:return t.next=13,v.a.put("/api/v2/orders?orderId=".concat(e.order.id));case 13:return t.next=15,e.deleteRequest(e.order.id);case 15:location.reload();case 16:case"end":return t.stop()}}),t)})))()}}),computed:T(T({},Object(i["c"])("orders",["order"])),Object(i["c"])("base",["myFactoryInfor","userInfo","dsCongDoans"])),watch:{disable:function(e){if(e){console.log("this.metaValue.account2.id",this.metaValue.accountName);var t=this.userInfo.lastName,a=this.metaValue.selection,r=this.userInfo.position,n=this.userInfo.account,o=null==this.order.OrderMeta[0].maVT?" ":this.order.OrderMeta[0].maVT,s=null==this.order.OrderMeta[0].tenVT?" ":this.order.OrderMeta[0].tenVT,i=null==this.order.OrderMeta[0].description?" ":this.order.OrderMeta[0].description,l=null==this.nameDepartmentName.NAME?" ":this.nameDepartmentName.NAME;this.updateOrderMeta(T(T({},this.order.OrderMeta[0]),{},{metaValue:JSON.stringify([this.metaValue]),fullName:t,selection:a,position:r,maNV:n,maVT:o,tenVT:s,lyDo:i,department:l}))}}}},D=y,N=a("2877"),E=a("a370"),q=a("3786"),j=a("27f9"),w=a("9c40"),C=a("eebe"),k=a.n(C),S=Object(N["a"])(D,u,m,!1,null,null,null),P=S.exports;function A(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function I(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?A(Object(a),!0).forEach((function(t){s()(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):A(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}k()(S,"components",{QCardSection:E["a"],QRadio:q["a"],QInput:j["a"],QBtn:w["a"]});var _={data:function(){return{disable:!1,metaValue:{kinhGui:"Ban TGĐ - Trưởng phòng/phó phòng ban :  -\tGĐSX/Phó GĐSX/Phụ trách nhà máy :",noiDungTT:"",soTien:0,vietBangChu:"",kemTheo:"",STT:"12",locationWork:"",position:"",position2:"",number:"",timeRecruit:"",description:"",fullName:"",fullName2:"",maNV:"",department:"",department2:"",stepDepartment:"",lyDo:"",dateStart:"",dateEnd:"",selection1:null,selection2:null,selection3:null,selection4:null,selection:null,thoiGianMangThai:"",tbiSuaChua:"",maSo:"",error:""}}},components:{SendMessage:l["a"],OrderHeader:c["a"],OrderApproved:d["a"],SuaChua:P},methods:I(I({},Object(i["b"])("orders",["getOneOrder","getAllRequests"])),Object(i["b"])("orderMetas",["getOneOrderMeta","addorderMeta"])),computed:I(I({},Object(i["c"])("orders",["order"])),Object(i["c"])("base",["userInfo","myFactoryInfor"])),created:function(){var e=this;this.$route.query.id?this.getOneOrder(this.$route.query.id).then((function(t){t.data.data.Requests.length&&(e.disable=!0),e.metaValue=Object.assign(e.metaValue,JSON.parse(t.data.data.OrderMeta[0].metaValue)[0])})):this.$router.push({path:"/tao-de-xuat"})}},$=_,R=a("9989"),G=a("f09f"),B=a("8f8e"),L=Object(N["a"])($,r,n,!1,null,null,null);t["default"]=L.exports;k()(L,"components",{QPage:R["a"],QCard:G["a"],QCardSection:E["a"],QCheckbox:B["a"]})}}]);