(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[108],{d7e1:function(t,e,o){"use strict";o.r(e);var i=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("q-page",{staticClass:"q-pa-md"},[o("app-bar",[t._v("Chọn qui cách")]),o("div",{staticClass:"row  justify-center"},t._l(t.items,(function(e){return o("div",{key:e.id,staticClass:"col-12 col-md-3 q-ma-sm"},[o("card-item",{key:e.id,attrs:{item:e,chooseItem:t.selectItemChoosed}})],1)})),0),o("q-page-sticky",{attrs:{position:"bottom-left",offset:[18,18]}},[o("q-fab",{attrs:{icon:"search",color:"accent"},on:{click:t.showSearch}})],1),o("q-dialog",{attrs:{"transition-show":"rotate","transition-hide":"rotate"},model:{value:t.showSearchModel,callback:function(e){t.showSearchModel=e},expression:"showSearchModel"}},[o("q-card",{staticStyle:{width:"300px"}},[o("q-card-section",[o("div",{staticClass:"prodTextTitle"},[t._v("Tìm kiếm")])]),o("q-card-section",[o("q-input",{attrs:{outlined:"",label:"Tìm theo qui cách"},on:{input:t.search},model:{value:t.quicachSearch,callback:function(e){t.quicachSearch=e},expression:"quicachSearch"}})],1),o("q-card-actions",{staticClass:"bg-white text-teal",attrs:{align:"right"}},[o("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"OK"},on:{click:t.showResult}})],1)],1)],1),o("q-inner-loading",{attrs:{showing:!t.loadDone}},[o("q-spinner-gears",{attrs:{size:"150px",color:"primary"}})],1)],1)},s=[],a=(o("386d"),o("6b54"),o("06db"),o("20d6"),o("dd38")),n=o("f11b"),c={components:{"app-bar":a["a"],"card-item":n["a"]},data:function(){return{quicachSearch:"",showSearchModel:!1,group:"",options:{},items:{},searchResultNumber:0,loadDone:!1}},mounted:function(){var t=this;setTimeout((function(){t.initItemData()}),500)},methods:{selectItemChoosed:function(t){var e=this;this.$store.dispatch("production/ACTION_CHOOSE_WOODS",t).then((function(){var o=e.items.findIndex((function(e){return e.id===t.id}));e.items.splice(o,1),e.$q.notify({message:"Đã chọn qui cách :"+e.items[o].height+" "+e.items[o].width+" "+e.items[o].length,color:"cyan",position:"center",timeout:2e3})}))},showSearch:function(){this.showSearchModel=!0},search:function(){var t=this,e=this.$store.state.production.woods.filter((function(e){var o=e.height||"",i=e.width||"",s=e.length||"",a=o.toString()+i.toString()+s.toString();if(-1!==a.toString().search(t.quicachSearch))return e}));e.length>0?(this.items=e,this.searchResultNumber=e.length):this.items=this.$store.state.production.woods},showResult:function(){this.$q.notify({message:"Tìm thấy ".concat(this.searchResultNumber," kết quả phù hợp"),color:"cyan",position:"center"})},initItemData:function(){var t=this;this.group=this.$store.state.production.groupItems[0],this.options=this.$store.state.production.groupItems;for(var e=this.$store.state.production.woodsSelected,o=[],i=function(i){var s=t.$store.state.production.woods[i],a=e.findIndex((function(t){return t.id===s.id}));-1===a&&o.push(s)},s=0;s<this.$store.state.production.woods.length;s++)i(s);this.items=o,this.loadDone=!0}}},r=c,h=o("2877"),d=o("9989"),u=o("de5e"),l=o("c294"),p=o("24e8"),m=o("f09f"),f=o("a370"),g=o("27f9"),w=o("4b7e"),q=o("9c40"),S=o("74f7"),b=o("cf57"),v=o("7f67"),C=o("eebe"),k=o.n(C),y=Object(h["a"])(r,i,s,!1,null,null,null);e["default"]=y.exports;k()(y,"components",{QPage:d["a"],QPageSticky:u["a"],QFab:l["a"],QDialog:p["a"],QCard:m["a"],QCardSection:f["a"],QInput:g["a"],QCardActions:w["a"],QBtn:q["a"],QInnerLoading:S["a"],QSpinnerGears:b["a"]}),k()(y,"directives",{ClosePopup:v["a"]})}}]);