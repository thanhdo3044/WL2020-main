(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[84],{"68c3":function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("q-page",{attrs:{padding:""}},[e("q-banner",{staticClass:"bg-primary text-orange"},[e("div",{staticClass:"text-h6 orange"},[t._v("\n      Sửa kế hoạch\n    ")])]),e("q-card",[e("q-card-section",[e("DxDataGrid",{attrs:{"data-source":t.keHoachSanXuats,"key-expr":"id"},on:{"row-updated":t.rowUpdated,"row-updating":t.rowUpdating}},[e("DxColumnChooser",{attrs:{enabled:!0}}),e("DxHeaderFilter",{attrs:{visible:!0}}),e("DxGroupPanel",{attrs:{visible:!0,"empty-panel-text":"Kéo một tiêu đề cột vào đây để nhóm theo cột đó"}}),e("DxScrolling",{attrs:{mode:"infinite"}}),e("DxGrouping",{attrs:{"auto-expand-all":!0}}),e("DxEditing",{attrs:{"allow-updating":!0,mode:"cell"}}),e("DxColumn",{attrs:{"data-field":"code",caption:"code",allowEditing:!1}}),e("DxColumn",{attrs:{"data-field":"itemName",caption:"SP/Chi tiết",allowEditing:!1}}),e("DxColumn",{attrs:{"data-field":"market",caption:"Mã thị trường",width:"100",allowEditing:!1}}),e("DxColumn",{attrs:{"data-field":"stepName",caption:"Công đoạn","group-index":1,"sort-index":1,"sort-order":"desc",allowEditing:!1}}),e("DxColumn",{attrs:{caption:"Qui Cách",alignment:"center",allowEditing:!1}},[e("DxColumn",{attrs:{caption:"Dầy","data-field":"itemHeight",alignment:"center",width:"60",allowEditing:!1}}),e("DxColumn",{attrs:{caption:"Rộng","data-field":"itemWidth",alignment:"center",width:"60",allowEditing:!1}}),e("DxColumn",{attrs:{caption:"Dài","data-field":"itemLength",alignment:"center",width:"60",allowEditing:!1}})],1),e("DxColumn",{attrs:{"data-field":"number",caption:"Lệnh sản xuất",width:"120",allowEditing:!1}}),e("DxColumn",{attrs:{"data-field":"keHoach",caption:"KHĐG","data-type":"number",width:"120",alignment:"center",allowEditing:!1}}),e("DxColumn",{attrs:{"data-field":"soLuongUuTien",caption:"Nhập về","data-type":"number",width:"120",alignment:"center",allowEditing:!0}}),e("DxColumn",{attrs:{"data-field":"hanMucTon",caption:"Giảm trừ","data-type":"number",width:"120",alignment:"center",allowEditing:!1}}),e("DxColumn",{attrs:{"data-field":"canThucHien",caption:"Thực hiện","data-type":"number",width:"120",alignment:"center",allowEditing:!1}}),e("DxColumn",{attrs:{"data-field":"ngayDongGoi",caption:"Ngày",width:"100",alignment:"center","data-type":"date",allowEditing:!1}}),e("DxColumn",{attrs:{"data-field":"factor",caption:"Hệ số phôi","data-type":"number",width:"100",alignment:"center",allowEditing:!0}}),e("DxExport",{attrs:{enabled:!0,"allow-export-selected-data":!1,"file-name":"In KHSX"}}),e("DxSearchPanel",{attrs:{visible:!0,placeholder:"Tìm kiếm",width:400}})],1)],1)],1)],1)},o=[],r=(e("8e6e"),e("8a81"),e("ac6a"),e("cadf"),e("06db"),e("456d"),e("a34a")),i=e.n(r),c=(e("96cf"),e("c973")),l=e.n(c),d=e("9523"),s=e.n(d),u=e("2f62"),p=e("d30a");function m(t,a){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable}))),e.push.apply(e,n)}return e}function g(t){for(var a=1;a<arguments.length;a++){var e=null!=arguments[a]?arguments[a]:{};a%2?m(Object(e),!0).forEach((function(a){s()(t,a,e[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):m(Object(e)).forEach((function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(e,a))}))}return t}var h={components:{DxDataGrid:p["DxDataGrid"],DxColumn:p["DxColumn"],DxSearchPanel:p["DxSearchPanel"],DxExport:p["DxExport"],DxEditing:p["DxEditing"],DxColumnChooser:p["DxColumnChooser"],DxHeaderFilter:p["DxHeaderFilter"],DxGroupPanel:p["DxGroupPanel"],DxScrolling:p["DxScrolling"],DxGrouping:p["DxGrouping"]},computed:g(g({},Object(u["c"])("lenhSanXuats",["lenhSanXuats","keHoachSanXuats"])),Object(u["c"])("base",["myFactoryInfor"])),methods:g(g({},Object(u["b"])("lenhSanXuats",["getAllLenhSanXuats","getLenhSanXuatCapPhois","updatePo"])),{},{rowUpdated:function(){return l()(i.a.mark((function t(){return i.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:console.log("OK");case 1:case"end":return t.stop()}}),t)})))()},loadData:function(t){var a=this;return l()(i.a.mark((function e(){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:a.getLenhSanXuatCapPhois(t);case 1:case"end":return e.stop()}}),e)})))()},rowUpdating:function(t){var a=this;return l()(i.a.mark((function e(){var n,o,r,c,d;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:n=t.newData,o=t.oldData,r=n.soLuongUuTien,c=n.factor,d=o.soLuongUuTien,void 0!==r&&a.$q.dialog({title:"Xác nhận",message:"".concat(o.itemName," nhập về: ").concat(r),cancel:!0,persistent:!0}).onOk(l()(i.a.mark((function t(){var e,r;return i.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,a.updatePo({code:o.code,data:g(g({},n),{},{soLuongUuTienC:d})});case 2:e=t.sent,console.log(e),r=a.myFactoryInfor.factoryId,a.loadData({factoryId:r});case 6:case"end":return t.stop()}}),t)})))).onCancel((function(){var t=a.myFactoryInfor.factoryId;a.loadData({factoryId:t})})),void 0!==c&&a.$q.dialog({title:"Xác nhận",message:"".concat(o.itemName," hệ số phôi: ").concat(c),cancel:!0,persistent:!0}).onOk(l()(i.a.mark((function t(){var e,r;return i.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,a.updatePo({code:o.code,data:n});case 2:e=t.sent,console.log(e),r=a.myFactoryInfor.factoryId,a.loadData({factoryId:r});case 6:case"end":return t.stop()}}),t)})))).onCancel((function(){var t=a.myFactoryInfor.factoryId;a.loadData({factoryId:t})}));case 5:case"end":return e.stop()}}),e)})))()}}),created:function(){var t=this.myFactoryInfor.factoryId;this.loadData({factoryId:t})}},f=h,x=e("2877"),w=e("9989"),D=e("54e1"),y=e("f09f"),b=e("a370"),C=e("eebe"),v=e.n(C),E=Object(x["a"])(f,n,o,!1,null,null,null);a["default"]=E.exports;v()(E,"components",{QPage:w["a"],QBanner:D["a"],QCard:y["a"],QCardSection:b["a"]})}}]);