(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[148],{d003:function(e,a,t){"use strict";t.r(a);var n=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("q-page",{staticClass:"q-pa-md"},[t("div",{staticClass:"row"},[t("div",{staticClass:"col-12"},[t("card-ribbon",{attrs:{name:"Danh sách nhà cung cấp"},scopedSlots:e._u([{key:"content",fn:function(){return[t("DxDataGrid",{attrs:{"data-source":e.dataSource,"show-borders":!0,"key-expr":"id","word-wrap-enable":!0,"allow-column-reordering":!0},on:{editorPreparing:e.onEditorPreparing,"row-inserted":e.insert,"row-updated":e.updated}},[t("DxEditing",{attrs:{"allow-updating":!0,"allow-adding":!0,mode:"row"}}),t("DxColumn",{attrs:{"data-field":"id",width:"100"}}),t("DxColumn",{attrs:{"data-field":"code",caption:"Mã nhà cung cấp",width:"200"}},[t("DxRequiredRule")],1),t("DxColumn",{attrs:{"data-field":"name",caption:"Tên nhà cung cấp"}},[t("DxRequiredRule")],1),t("DxColumn",{attrs:{"data-field":"address",caption:"Địa chỉ"}},[t("DxRequiredRule")],1),t("DxColumn",{attrs:{"data-field":"regionId",caption:"Bảng giá"}},[t("DxLookup",{attrs:{"data-source":e.regions,"display-expr":"NAME","value-expr":"ID"}})],1)],1)]},proxy:!0}])})],1)])])},r=[],o=t("a34a"),d=t.n(o),s=(t("7f7f"),t("96cf"),t("c973")),i=t.n(s),c=(t("551c"),t("ac6a"),t("cadf"),t("06db"),t("5df3"),t("d30a")),u=t("f1d8"),l={components:{DxDataGrid:c["DxDataGrid"],DxColumn:c["DxColumn"],DxEditing:c["DxEditing"],DxLookup:c["DxLookup"],DxRequiredRule:c["DxRequiredRule"],DxSummary:c["DxSummary"],DxTotalItem:c["DxTotalItem"],DxGroupItem:c["DxGroupItem"],"card-ribbon":u["a"]},data:function(){return{dataSource:[],regions:[]}},created:function(){Promise.all([this.initData(),this.loadRegion()])},methods:{updated:function(e){var a=this;return i()(d.a.mark((function t(){var n,r;return d.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n={id:e.data.id,data:{name:e.data.name,active:1,address:e.data.address,regionId:e.data.regionId}},t.next=3,a.$store.dispatch("wood/UPDATE_VENDOR",n);case 3:r=t.sent,!0===r.meta.success?a.$q.notify({message:"Thành công !",color:"green"}):a.$q.notify({message:r.meta.message,color:"red"});case 5:case"end":return t.stop()}}),t)})))()},insert:function(e){var a=this;return i()(d.a.mark((function t(){var n,r;return d.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n={code:e.data.code,name:e.data.name,active:1,address:e.data.address,moduleId:a.$store.state.base.moduleSelected.id},t.next=3,a.$store.dispatch("wood/POST_VENDOR",n);case 3:r=t.sent,!0===r.meta.success?a.$q.notify({message:"Thành công !",color:"green"}):a.$q.notify({message:r.meta.message,color:"red"});case 5:case"end":return t.stop()}}),t)})))()},initData:function(){var e=this;return i()(d.a.mark((function a(){var t;return d.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,e.$store.dispatch("wood/GET_VENDORS",e.$store.state.base.moduleSelected.id);case 2:t=a.sent,e.dataSource=t.data;case 4:case"end":return a.stop()}}),a)})))()},onEditorPreparing:function(e){"id"===e.dataField&&(e.editorOptions.disabled=!0)},loadRegion:function(){var e=this;return i()(d.a.mark((function a(){var t;return d.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,e.$store.dispatch("wood/GET_REGION",e.$store.state.base.moduleSelected.id);case 2:t=a.sent,e.regions=t.data;case 4:case"end":return a.stop()}}),a)})))()}}},p=l,m=t("2877"),x=t("9989"),D=t("eebe"),f=t.n(D),g=Object(m["a"])(p,n,r,!1,null,null,null);a["default"]=g.exports;f()(g,"components",{QPage:x["a"]})}}]);