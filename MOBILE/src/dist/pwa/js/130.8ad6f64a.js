(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[130],{"749c":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("q-page",{staticClass:"q-pa-md"},[!0===this.$store.state.production.loadItemsDone?n("div",[n("app-bar",[e._v("Tạo Số Lô")]),n("div",{staticClass:"row justify-center"},[n("div",{staticClass:"col-12 col-md-6 q-ma-md"},[n("info-factoryfsc"),n("div",{staticClass:"row"},[n("div",{staticClass:"col-12"},[n("q-select",{staticStyle:{"font-family":"'Time New Roman'","font-size":"16px","text-align":"center"},attrs:{behavior:"dialog",options:e.prodOrders,label:"Lệnh sản xuất"},on:{input:e.changeProdOrder},model:{value:e.prodOrder,callback:function(t){e.prodOrder=t},expression:"prodOrder"}})],1)]),n("div",{staticClass:"row"},[n("div",{staticClass:"col-12"},[n("q-select",{staticStyle:{"font-family":"'Time New Roman'","font-size":"16px","text-align":"center"},attrs:{behavior:"dialog",options:e.sources,label:"Bộ phận tạo số lô :"},on:{input:e.changeSource},model:{value:e.sourceSelect,callback:function(t){e.sourceSelect=t},expression:"sourceSelect"}})],1)]),n("div",{directives:[{name:"show",rawName:"v-show",value:e.showSelectDestination,expression:"showSelectDestination"}],staticClass:"row"},[n("div",{staticClass:"col-12"},[n("q-select",{staticStyle:{"font-family":"'Time New Roman'","font-size":"16px"},attrs:{behavior:"dialog",options:e.destinations,label:"Nơi xuất đến :"},model:{value:e.destinationSelect,callback:function(t){e.destinationSelect=t},expression:"destinationSelect"}})],1)]),n("div",{staticClass:"row"},[n("div",{staticClass:"col-12"},[n("q-select",{staticStyle:{"font-family":"'Time New Roman'","font-size":"16px"},attrs:{behavior:"dialog",options:e.palletTypes,label:"Hình thức :"},model:{value:e.palletTypeSelect,callback:function(t){e.palletTypeSelect=t},expression:"palletTypeSelect"}})],1)]),e.itemsSelected.length>0?n("div",{staticClass:"row justify-center"},[n("div",{staticClass:"col-12 q-ma-sm"},[n("q-card",{staticClass:"my-card"},[n("q-card-section",[n("div",{staticClass:"text-h6"},[e._v(e._s(e.itemsSelected[0].name))])]),n("q-card-section",[n("q-input",{attrs:{type:"text",label:"Số lượng đã sản xuất ",disable:!0},model:{value:this.current.quantity,callback:function(t){e.$set(this.current,"quantity",t)},expression:"this.current.quantity"}}),n("br"),n("q-input",{attrs:{type:"text",label:"Số lượng vật liệu đã nhận ",disable:!0},model:{value:this.receiveQty,callback:function(t){e.$set(this,"receiveQty",t)},expression:"this.receiveQty"}}),n("br"),n("q-input",{attrs:{outlined:"",type:"number",label:"Số lượng ghi nhận"},model:{value:e.itemsSelected[0].quantity,callback:function(t){e.$set(e.itemsSelected[0],"quantity",e._n(t))},expression:"itemsSelected[0].quantity"}})],1)],1)],1)]):e._e(),e.validate?n("div",{staticClass:"row justify-center"},[n("div",{staticClass:"col-8 justify-center"},[n("q-btn",{attrs:{color:"primary full-width q-mt-md",glossy:"",label:"Tạo pallet"},on:{click:function(t){e.showConfirm=!0}}})],1)]):e._e()],1)])],1):e._e(),n("dialog-success",{attrs:{show:e.showSuccess,palletCode:e.palletCode,closeDialog:e.closeDialog}}),n("q-dialog",{attrs:{persistent:""},model:{value:e.showConfirm,callback:function(t){e.showConfirm=t},expression:"showConfirm"}},[n("q-card",{staticStyle:{"min-width":"300px"}},[n("q-card-section",{staticClass:"row items-center"},[n("span",{staticClass:"prodTextTitle"},[e._v("Bạn đã chắc chắn ?")])]),n("q-card-actions",{attrs:{align:"right"}},[n("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Hủy",color:"primary"}}),n("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Đồng ý",color:"primary"},on:{click:e.createPallet}})],1)],1)],1)],1)},s=[],i=(n("6b54"),n("20d6"),n("7514"),n("ac6a"),n("cadf"),n("5df3"),n("a34a")),o=n.n(i),r=(n("7f7f"),n("96cf"),n("c973")),c=n.n(r),l=(n("551c"),n("06db"),n("28a5"),n("278c")),u=n.n(l),d=(n("f79b"),n("4778")),p=n("427f"),h=n("dd38"),f=n("9fb5"),m=n("075b"),v=n("c0af"),g=n("8e39"),y=(n("5918"),n("fa7d")),S=n("d30a"),b={components:{"app-bar":h["a"],"info-factoryfsc":d["a"],"card-itempallet":p["a"],"info-supplies":f["a"],"card-item-in-from":m["a"],"dialog-success":v["a"],"dialog-add-supplies":g["a"],DxDataGrid:S["DxDataGrid"],DxColumn:S["DxColumn"],DxEditing:S["DxEditing"],DxLookup:S["DxLookup"],DxRequiredRule:S["DxRequiredRule"],DxPopup:S["DxPopup"],DxPosition:S["DxPosition"],DxForm:S["DxForm"],DxItem:S["DxItem"]},beforeDestroy:function(){console.log("create pallet page destroy"),this.$store.dispatch("production/ACTION_LOAD_DONE_CREATE_PALLET_INIT"),this.item=null,this.removeItem()},beforeMount:function(){this.removeItem(),this.removeMaterial()},data:function(){return{items:[],parcel:"",dialog:!1,item:null,loadDone:0,showLoadling:!0,sources:[],sourceSelect:null,destinations:[],destinationSelect:null,palletTypes:[],palletTypeSelect:null,materials:[],materialSelected:null,requireMaterialSelect:!1,validate:!1,showSuccess:!1,palletCode:"",showDialogAddSupplie:!1,showSelectItem:!1,showSelectDestination:!0,showConfirm:!1,prodOrder:null,prodOrders:[],woodType:null,woodTypes:[],lenhsx:"",requireSelectLSX:!0,itemsSelected:[],current:{departmentId:0,quantity:0},currentsData:[],isHoanThien:!1,maxQuantityAvalible:0,currentRoutings:[],receiveQty:0}},computed:{wathValidate:function(){return"".concat(this.sourceSelect,"|").concat(this.destinationSelect,"|").concat(this.prodOrder)}},watch:{wathValidate:function(e,t){var n=e.split("|"),a=u()(n,5),s=a[0],i=a[1],o=a[2],r=a[3],c=a[4];"null"!==s&&"null"!==i&&"null"!==o&&"null"!==r?this.requireMaterialSelect?"null"!==mSelect?this.validate=!0:this.validate=!1:"null"!==c&&(this.validate=!0):this.validate=!1},item:function(e){}},created:function(){var e=this,t=this.$store.getters["base/myFactoryInfor"].id,n=this.$route.query.type;n&&(this.isHoanThien="ht"===n);var a=new Promise(function(){var n=c()(o.a.mark((function n(a,s){var i;return o.a.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,e.$store.dispatch("production/ACTION_LOAD_PROD_ORDERS_BY_FACTORY",t);case 2:i=n.sent,i.data.forEach((function(t){var n={label:t.name,value:t.id};e.prodOrders.push(n)})),a(!0);case 5:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}()),s=new Promise((function(t,n){var a;Object(y["h"])(e.$store.getters["base/myStepInfor"])||(a=e.$store.getters["base/myStepInfor"].packageTypeGroupId),Object(y["h"])(e.$store.getters["base/myXuongInfor"])||(a=e.$store.getters["base/myXuongInfor"].packageTypeGroupId),Object(y["h"])(e.$store.getters["base/myDepartmentInfor"])||(a=e.$store.getters["base/myDepartmentInfor"].packageTypeGroupId),Object(y["h"])(e.$store.getters["base/myFactoryInfor"])||(a=e.$store.getters["base/myFactoryInfor"].packageTypeGroupId),e.$store.dispatch("production/ACTION_GET_PACKAGE_TYPE").then((function(n){e.$store.state.production.packageTypes.forEach((function(t){if(t.typeId===a){var n={label:t.name,value:t.id};e.palletTypes.push(n)}})),t(!0)})).catch((function(e){n(!1)})),t(!0)})),i=new Promise(function(){var e=c()(o.a.mark((function e(t,n){return o.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:t(!0);case 1:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}());Promise.all([i,a,s]).then((function(t){e.$store.dispatch("production/ACTION_LOAD_DONE_CREATE_PALLET");var n=e.$store.getters["base/mySources"],a=e.$store.getters["base/myDestinations"];n.forEach((function(t){var n={label:t.name,value:t.id};e.sources.push(n)})),e.sources.length>0&&(e.sourceSelect=e.sources[0]),a.forEach((function(t){e.destinations.push({value:t.id,label:t.name})})),e.destinations.length>0?e.destinationSelect=e.destinations[0]:e.$q.notify({message:"Tài khoản chưa được cấu hình !"})})).catch((function(e){console.log(e)}))},methods:{changeProdOrder:function(e){var t=this;return c()(o.a.mark((function n(){return o.a.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,t.loadProdInLSX(e.value);case 2:case"end":return n.stop()}}),n)})))()},loadProdInLSX:function(e){var t=this;return c()(o.a.mark((function n(){var a,s,i,r,c,l,u,d;return o.a.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return t.$q.loading.show({message:"Chờ 1 chút ...",messageColor:"white"}),t.itemsSelected=[],t.receiveQty=0,n.next=5,t.$store.dispatch("wood/LOAD_MATERIAL_IN_PROD",e);case 5:a=n.sent,t.currentsData=a.data.current,a.data.products.length>0&&(s=a.data.products[0].quantity,i=a.data.products[0],[],t.previousCurrent=a.data.receive.find((function(e){return e.departmentId===t.sourceSelect.value})),t.previousCurrent&&(t.receiveQty=t.previousCurrent.quantity),-1!==t.currentsData.findIndex((function(e){return e.departmentId===t.sourceSelect.value}))?(r=t.currentsData.findIndex((function(e){return e.departmentId===t.sourceSelect.value})),t.current=t.currentsData[r],i.quantity=0):(t.current=[],t.$q.notify({message:"Lệnh sản xuất này chưa đc sản xuất !"})),t.itemsSelected.push(i),c=a.data.routings,c.length>0?(t.currentRoutings=c,u=c.findIndex((function(e){return e.departmentId===t.sourceSelect.value})),-1!==u&&(d=c[u].order,l=c.find((function(e){return e.order===parseInt(d+1)})),console.log(l),1===d&&(t.receiveQty=s,console.log(s)),l?t.destinationSelect={value:l.departmentId,label:l.name}:t.$q.notify({message:"LSX không có định tuyến cho công đoạn "+t.sourceSelect.label}))):t.$q.notify({message:"Lệnh sản xuất này chưa được định tuyến !"})),t.$q.loading.hide();case 9:case"end":return n.stop()}}),n)})))()},initNewRow:function(){},insertedRow:function(){},onEditorPreparing:function(e){"itemId"===e.dataField&&(e.editorOptions.disabled=!0)},insertingRow:function(){},blurMaLoGo:function(){},changeSource:function(e){var t=this;return c()(o.a.mark((function e(){return o.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.receiveQty=0,!t.prodOrder){e.next=4;break}return e.next=4,t.loadProdInLSX(t.prodOrder.value);case 4:case"end":return e.stop()}}),e)})))()},toAddSupplies:function(){},closeDialog:function(){this.showSuccess=!1,this.prodOrder=null,this.itemsSelected=[]},chooseItem:function(){this.$router.push("/production-items")},removeItem:function(){this.$store.dispatch("production/ACTION_REMOVE_ITEM"),this.item=null},removeMaterial:function(){this.$store.dispatch("production/ACTION_REMOVE_MATERIAL_SELECTED"),this.materialSelected=null},selectItemById:function(){this.$store.dispatch("production/ACTION_CHOOSE_ITEM",this.item)},selectMaterialById:function(){this.$store.dispatch("production/ACTION_SELECT_ONE_MATERIAL",this.materialSelected)},createPallet:function(){var e=this,t=!0,n=this.currentRoutings.findIndex((function(t){return t.departmentId===e.sourceSelect.value}));if(n>-1)if(1===this.itemsSelected.length&&parseInt(this.itemsSelected[0].quantity+this.current.quantity)>parseInt(this.receiveQty)&&(this.$q.notify({message:"Số lượng không chính xác !"}),t=!1),t){var a=this.sourceSelect.value,s=this.destinationSelect.value,i=this.itemsSelected[0].id,o=this.itemsSelected[0].quantity,r={sourceId:a,destinationId:s,itemId:i,quantity:o,productionOrdersId:this.prodOrder.value},c={eventName:"Tạo So Lo",timeStamp:(new Date).toISOString(),status:0,palletCode:"????????",palletType:this.prodOrder.label};this.$store.dispatch("production/ACTION_CREATE_PALLET",r).then((function(t){if(!0===t.meta.success){e.palletCode=t.data[0].code,e.showSuccess=!0,e.removeItem(),e.removeMaterial();var n=e.destinationSelect.value.toString()+"-RECIVED-PALLET",a="Đã nhận được pallet số "+e.palletCode,s="Nhận được pallet từ công đoạn "+e.sourceSelect.label+" chuyển đến công đoạn "+e.destinationSelect.label,i="/#/production-dashboard?code="+e.palletCode;e.$sendFcm(a,s,i,n,{}).then((function(e){console.log("send fcm success",e)})).catch((function(e){console.log("send Error: "+e)})),Object(y["o"])(),c.status=1,c.palletCode=t.data[0].code}else c.status=0,e.$q.notify({message:t.meta.messages.message,color:"red"});e.$eventLog(c)}))}else this.$q.notify({message:"Thiếu thông tin, vui lòng kiểm tra lại",color:"red"});else Object(y["n"])("Lệnh sản xuất này không đi qua công đoạn "+this.sourceSelect.label)},closeConfirmAddSupplie:function(){this.showDialogAddSupplie=!1},searchItem:function(e,t){var n=this,a=[];this.$store.state.production.items.forEach((function(e){var t={label:e.name+" -> "+e.height+" "+e.width+" "+e.length,value:e.id};a.push(t)})),t(""!==e?function(){var t=e.toLowerCase();n.items=a.filter((function(e){var n=e.label;if(n.toString().indexOf(t)>-1)return e}))}:function(){n.items=a})},searchMaterial:function(e,t){var n=this,a=[];this.$store.state.production.woods.forEach((function(e){var t={label:e.name+" -> "+e.height+" "+e.width+" "+e.length,value:e.id};a.push(t)})),t(""!==e?function(){var t=e.toLowerCase();n.materials=a.filter((function(e){var n=e.label;if(n.toString().indexOf(t)>-1)return e}))}:function(){n.materials=a})}}},w=b,I=n("2877"),x=n("9989"),C=n("ddd8"),T=n("27f9"),q=n("f09f"),D=n("a370"),O=n("9c40"),E=n("24e8"),$=n("4b7e"),_=n("7f67"),A=n("eebe"),L=n.n(A),k=Object(I["a"])(w,a,s,!1,null,null,null);t["default"]=k.exports;L()(k,"components",{QPage:x["a"],QSelect:C["a"],QInput:T["a"],QCard:q["a"],QCardSection:D["a"],QBtn:O["a"],QDialog:E["a"],QCardActions:$["a"]}),L()(k,"directives",{ClosePopup:_["a"]})}}]);