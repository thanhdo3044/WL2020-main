(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[112],{3603:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("q-page",{staticClass:"q-pa-md"},[a("transition-group",{attrs:{appear:"","enter-active-class":"animated fadeIn","leave-active-class":"animated fadeOut"}},[a("div",{key:"key1",staticClass:"row justify-center"},[a("div",{staticClass:"col-12 col-sm-6"},[a("div",{staticClass:"prodTextTitle"},[t._v("Danh sách biên bản nghiệm thu")])])]),a("div",{key:"key2",staticClass:"row justify-center"},t._l(t.accepts,(function(e){return a("div",{key:e.id,staticClass:"col-12 col-sm-6 q-ma-sm"},[a("q-card",[a("q-card-section",[a("p",{staticClass:"prodTextTitle"},[t._v("\n                          Số biên bản : "+t._s(e.id)+"\n                      ")]),a("p",{staticClass:"prodTextNormal",staticStyle:{color:"orange"}},[t._v("Chủ đầu tư : "+t._s(e.customer.name)+" - "+t._s(e.customer.address))]),a("p",{staticClass:"prodTextNormal"},[t._v("Hạng mục : "+t._s(e.categories)+" ")])]),a("q-card-actions",{attrs:{align:"right"}},[a("q-btn",{attrs:{color:"primary",label:"Xem chi tiết"},on:{click:function(a){return t.selectAccept(e)}}})],1)],1)],1)})),0)]),a("q-page-sticky",{attrs:{position:"bottom-left",offset:[18,18]}},[a("q-btn",{attrs:{fab:"",icon:"add",color:"secondary"},on:{click:function(e){t.show=!0}}})],1),a("q-inner-loading",{attrs:{showing:t.visible}},[a("q-spinner-gears",{attrs:{size:"150px",color:"primary"}})],1),a("q-dialog",{model:{value:t.show,callback:function(e){t.show=e},expression:"show"}},[a("q-card",[a("q-card-section",{staticClass:"row items-center"},[a("div",{staticClass:"text-h6",staticStyle:{"font-family":"'Time'","font-weight":"700"}},[t._v("Form tạo biên bản nghiệm thu lắp đặt")]),a("q-space")],1),a("q-card-section",[a("div",{staticClass:"row "},[a("div",{staticClass:"col-12"},[a("q-select",{staticStyle:{"font-family":"'Time New Roman'","font-size":"16px"},attrs:{behavior:"dialog",options:t.projects,label:"Chọn dự án :"},model:{value:t.project,callback:function(e){t.project=e},expression:"project"}})],1)]),a("div",{staticClass:"row q-mt-sm"},[a("div",{staticClass:"col-12"},[a("q-input",{attrs:{outlined:"",label:"Hạng mục :"},model:{value:t.categories,callback:function(e){t.categories=e},expression:"categories"}})],1)]),a("div",{staticClass:"row q-mt-sm"},[a("div",{staticClass:"col-12",attrs:{align:"right"}},[a("q-btn",{attrs:{label:"Tạo biên bản",color:"secondary"},on:{click:t.create}})],1)])])],1)],1)],1)},c=[],n=(a("7514"),a("7f7f"),a("a34a")),i=a.n(n),r=(a("96cf"),a("c973")),o=a.n(r),l=(a("551c"),a("ac6a"),a("cadf"),a("06db"),a("5df3"),{data:function(){return{accepts:[],visible:!0,show:!1,project:null,projects:[],categories:""}},created:function(){var t=this;Promise.all([this.initData(),this.loadProject()]).then((function(e){t.visible=!1})).catch((function(t){console.log("promise all errror :"+t)}))},methods:{initData:function(){var t=this;return o()(i.a.mark((function e(){var a;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$store.dispatch("funiture/ACTION_GET_ACCEPTS");case 2:a=e.sent,!0===a.meta.success?t.accepts=a.data:t.$q.notify({message:a.meta.messages.message,color:"red"});case 4:case"end":return e.stop()}}),e)})))()},loadProject:function(){var t=this;return o()(i.a.mark((function e(){var a;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$store.dispatch("funiture/ACTION_LOAD_PROJECTS");case 2:a=e.sent,!0===a.meta.success?a.data.forEach((function(e){var a={label:e.name+" -> "+e.customer.name||"",value:e.id};t.projects.push(a)})):t.$q.notify({message:a.meta.messages.message,color:"red"});case 4:case"end":return e.stop()}}),e)})))()},create:function(){var t=this;return o()(i.a.mark((function e(){var a,s;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!(t.project&&t.categories.length>0)){e.next=20;break}return{projectId:t.project.value,categories:t.categories},t.show=!1,t.visible=!0,e.next=6,t.$store.dispatch("funiture/ACTION_CREATE_ACCEPT");case 6:if(a=e.sent,!0!==a.meta.success){e.next=17;break}return e.next=10,t.initData();case 10:t.$q.notify({message:"Tạo biên bản thành công !",color:"green"}),s=t.accepts.find((function(t){return t.id===a.data.id})),console.log(s),t.selectAccept(s),t.visible=!1,e.next=18;break;case 17:t.$q.notify({message:a.meta.messages.message,color:"red"});case 18:e.next=21;break;case 20:t.$q.notify({message:"Vui lòng nhập đủ thông tin !",color:"red"});case 21:case"end":return e.stop()}}),e)})))()},selectAccept:function(t){this.$store.dispatch("funiture/ACTION_SELECT_ACCEPT",t),this.$router.push({name:"detail-accept",params:{id:t.id}})}}}),d=l,u=a("2877"),p=a("9989"),m=a("f09f"),f=a("a370"),h=a("4b7e"),g=a("9c40"),v=a("de5e"),b=a("74f7"),C=a("cf57"),w=a("24e8"),q=a("2c91"),y=a("ddd8"),k=a("27f9"),x=a("eebe"),T=a.n(x),_=Object(u["a"])(d,s,c,!1,null,null,null);e["default"]=_.exports;T()(_,"components",{QPage:p["a"],QCard:m["a"],QCardSection:f["a"],QCardActions:h["a"],QBtn:g["a"],QPageSticky:v["a"],QInnerLoading:b["a"],QSpinnerGears:C["a"],QDialog:w["a"],QSpace:q["a"],QSelect:y["a"],QInput:k["a"]})}}]);