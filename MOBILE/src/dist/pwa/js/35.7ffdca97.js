(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[35],{"208e":function(t,e,a){"use strict";var s=a("667a"),i=a.n(s);i.a},"667a":function(t,e,a){},"8ed3":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("q-page",{staticClass:"q-pa-md"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-12 page-title",staticStyle:{"font-size":"24px"}},[t._v("\n      Lịch sử ghi nhận sản lượng\n    ")])]),a("div",{staticClass:"row"},[a("div",{staticClass:"col-12 q-mt-sm"},[a("div",{staticClass:"dx-field"},[a("div",{staticClass:"dx-field-label"},[t._v("Từ ngày :")]),a("div",{staticClass:"dx-field-value"},[a("DxDateBox",{attrs:{value:t.fromDate,type:"date","display-format":"dd/MM/yyyy"},on:{"value-changed":t.chonFromDate}})],1)])]),a("div",{staticClass:"col-12 q-mt-sm"},[a("div",{staticClass:"dx-field"},[a("div",{staticClass:"dx-field-label"},[t._v("Đến ngày :")]),a("div",{staticClass:"dx-field-value"},[a("DxDateBox",{attrs:{value:t.toDate,type:"date","display-format":"dd/MM/yyyy"},on:{"value-changed":t.chonToDate}})],1)])]),a("div",{staticClass:"col-12 q-mt-sm"},[a("div",{staticClass:"dx-field"},[a("div",{staticClass:"dx-field-label"},[t._v("Bộ phận :")]),a("div",{staticClass:"dx-field-value"},[a("DxSelectBox",{attrs:{"data-source":t.steps,value:t.step,"display-expr":"name","value-expr":"id"},on:{"value-changed":t.chonBoPhan}})],1)])])]),a("div",{staticClass:"row q-mt-sm"},[a("div",{staticClass:"col-12"},[a("DxTabs",{attrs:{"selected-index":t.selectedIndex,"data-source":t.tabs,"display-expr":"text","value-expr":"id",onItemClick:t.chonTab},on:{"update:selectedIndex":function(e){t.selectedIndex=e},"update:selected-index":function(e){t.selectedIndex=e}}})],1)]),a("div",{staticClass:"row "},t._l(t.history,(function(e){return a("div",{key:e.packageId,staticClass:"col-12 q-mt-sm"},[a("q-card",{class:"Đạt"===e.packageType?"border":"border bg-red-2"},[a("q-card-section",[a("div",{staticClass:"san-luong-title",on:{click:function(a){return t.goDetail(e.packageId)}}},[t._v("\n            "+t._s(e.packageId)+"\n          ")]),a("div",{staticClass:"text-subtitle2"},[t._v("\n            "+t._s(e.number)+" - "+t._s(e.market)+"\n          ")])]),a("q-card-section",[a("p",{staticClass:"item-title"},[t._v("Phân loại :"+t._s(e.packageType))]),a("p",{staticClass:"item-title"},[t._v("\n            ["+t._s(e.itemCode)+"] "+t._s(e.itemName)+" ("+t._s(e.itemHeight)+"*"+t._s(e.itemWidth)+"*"+t._s(e.itemLenght)+")\n          ")]),a("p",{staticClass:"item-quantity"},[t._v("Số lượng : "+t._s(e.quantity))]),a("p",{staticClass:"item-date"},[t._v("\n            Ngày làm việc : "+t._s(t.formatNgay(e.createDate))+"\n          ")]),a("p",{staticClass:"item-date"},[t._v("Tạo bởi : "+t._s(e.createBy))])])],1)],1)})),0)])},i=[],n=a("a34a"),c=a.n(n),d=(a("96cf"),a("c973")),o=a.n(d),l=a("9fc8"),r=a("fa7d"),u=a("3c7a"),p=a.n(u),h=a("bd4c"),f={components:{DxDateBox:l["DxDateBox"],DxSelectBox:l["DxSelectBox"],DxTabs:p.a},data:function(){return{tabs:[{id:1,text:"Tất cả"},{id:2,text:"Đạt"},{id:3,text:"Lỗi"}],fromDate:new Date,toDate:new Date,history:[],step:"Tổ Tinh Chế 2 X3",steps:[],selectedIndex:1,dupplicate:[],tabId:2}},created:function(){this.steps=this.$store.getters["base/mySources"],this.step=this.steps[0].id;var t=new Date;this.toDate=h["b"].addToDate(t,{days:1}),this.fromDate=h["b"].addToDate(t,{days:-7}),this.load()},methods:{goDetail:function(t){this.$router.push("/tracking-lot-no?code="+t)},chonTab:function(t){this.tabId=t.itemData.id,this.filtering()},filtering:function(){switch(this.tabId){case 2:this.history=this.dupplicate.filter((function(t){return"Đạt"===t.packageType}));break;case 3:this.history=this.dupplicate.filter((function(t){return"Đạt"!==t.packageType}));break;default:this.history=this.dupplicate;break}},load:function(){var t=this;return o()(c.a.mark((function e(){var a,s;return c.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a={fromDate:Object(r["b"])(t.fromDate,"YYYY-MM-DD"),toDate:Object(r["b"])(t.toDate,"YYYY-MM-DD"),stepId:t.step},e.next=3,t.$store.dispatch("production/GET_LICH_SU_CONFIRM",a);case 3:s=e.sent,t.history=s.data,t.dupplicate=s.data,t.filtering();case 7:case"end":return e.stop()}}),e)})))()},formatNgay:function(t){return Object(r["b"])(t,"DD/MM/YYYY HH:mm:ss")},chonBoPhan:function(t){this.step=t.value,this.load()},chonFromDate:function(t){this.fromDate=t.value,this.load()},chonToDate:function(t){this.toDate=t.value,this.load()}}},v=f,m=(a("208e"),a("2877")),x=a("9989"),D=a("f09f"),y=a("a370"),b=a("eebe"),C=a.n(b),g=Object(m["a"])(v,s,i,!1,null,"2973502d",null);e["default"]=g.exports;C()(g,"components",{QPage:x["a"],QCard:D["a"],QCardSection:y["a"]})}}]);