(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[22],{"07f1":function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",[e("q-btn",{attrs:{color:"primary",flat:"",icon:"keyboard_arrow_left",label:"Trở lại"},on:{click:t.goBack}}),e("q-card",{staticClass:"q-ma-lg"},[e("q-card-section",{staticClass:"bg-amber-8 q-mt-lg"},[e("div",{staticClass:"text-bold"},[t._v("Mã số : "+t._s(t.data.id)+"\r\n                - Tiêu đề : "+t._s(t.data.title))])]),e("q-card-section",{staticClass:"q-mt-lg shadow-10"},[e("q-input",{attrs:{disable:"",filled:"",label:"Tên người đăng kí :"},model:{value:t.data.Account.lastName,callback:function(a){t.$set(t.data.Account,"lastName",a)},expression:"data.Account.lastName"}}),e("q-input",{attrs:{disable:"",filled:"",label:"Chức vụ/phòng ban :"},model:{value:t.data.Account.position,callback:function(a){t.$set(t.data.Account,"position",a)},expression:"data.Account.position"}}),e("q-input",{attrs:{disable:"",filled:"",label:"SĐT liên hệ :"},model:{value:t.data.numberPhone,callback:function(a){t.$set(t.data,"numberPhone",a)},expression:"data.numberPhone"}}),e("q-input",{attrs:{disable:"",filled:"",label:"Địa điểm làm việc :"},model:{value:t.data.location,callback:function(a){t.$set(t.data,"location",a)},expression:"data.location"}}),e("q-input",{attrs:{disable:"",filled:"",label:"Thời gian bắt đầu :"},model:{value:t.dateTimeFormatStart,callback:function(a){t.dateTimeFormatStart=a},expression:"dateTimeFormatStart"}}),e("q-input",{attrs:{disable:"",filled:"",label:"Thời gian kết thúc :"},model:{value:t.timeTimeFormatEnd,callback:function(a){t.timeTimeFormatEnd=a},expression:"timeTimeFormatEnd"}})],1),e("q-card-section",[e("p",[t._v("\r\n        Danh sách thành viên đính kèm : "),e("b",[t._v(t._s(t.listAccounts.data.length))]),t._v(" người\r\n      ")]),e("p",[t._v("\r\n        Tối đa số lượng : "),e("b",[t._v(t._s(t.data.sumPeople))]),t._v(" người\r\n      ")]),e("ol",t._l(t.listAccounts.data,(function(a,n){return e("li",{staticClass:"q-ma-sm",staticStyle:{"font-weight":"bold"}},[t._v("\r\n          Tên : "+t._s(a.Account.lastName)+" - Mã NV : "+t._s(a.Account.id)+" -\r\n          Chức vụ :\r\n          "+t._s(null==a.Account.position?"chưa có":a.Account.position)+"\r\n        ")])})),0)])],1),t.data.sumPeople>t.listAccounts.data.length?e("q-dialog",{attrs:{persistent:""},model:{value:t.prompt,callback:function(a){t.prompt=a},expression:"prompt"}},[e("q-card",{staticStyle:{"min-width":"350px"}},[e("q-card-section",[e("div",{staticClass:"text-h6"},[t._v("Chọn người (Nhân viên)")])]),e("q-card-section",{staticClass:"q-pt-none"},[e("div",{staticClass:"q-gutter-md"},[e("q-select",{attrs:{filled:"",options:this.accounts,label:"Standard"},model:{value:t.result,callback:function(a){t.result=a},expression:"result"}})],1)]),e("q-card-actions",{staticClass:"text-primary",attrs:{align:"right"}},[e("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Hủy"}}),e("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Thêm người"},on:{click:function(a){return t.addAccount(t.userInfo.id)}}})],1)],1)],1):e("q-dialog",{model:{value:t.prompt,callback:function(a){t.prompt=a},expression:"prompt"}},[e("q-card",[e("q-card-section",[t._v("\r\n          Đã đủ số người đăng kí !\r\n        ")])],1)],1),e("q-btn",{staticStyle:{position:"sticky",bottom:"5%",top:"90%",left:"85%","z-index":"2"},attrs:{dense:"",round:"",color:"primary",size:"18px",icon:"add"},on:{click:function(a){t.prompt=!0}}})],1)},o=[],r=(e("8e6e"),e("8a81"),e("ac6a"),e("cadf"),e("06db"),e("456d"),e("9523")),c=e.n(r),i=e("a34a"),s=e.n(i),l=(e("96cf"),e("c973")),d=e.n(l),u=e("2f62"),p=e("bc3a"),m=e.n(p);function b(t,a){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable}))),e.push.apply(e,n)}return e}function f(t){for(var a=1;a<arguments.length;a++){var e=null!=arguments[a]?arguments[a]:{};a%2?b(Object(e),!0).forEach((function(a){c()(t,a,e[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):b(Object(e)).forEach((function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(e,a))}))}return t}var h={components:{QCalendar:QCalendar},created:function(){var t=this;return d()(s.a.mark((function a(){return s.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,t.loadData();case 2:return a.next=4,t.CutStringDate();case 4:return a.next=6,t.CutStringTime();case 6:t.account=t.accounts,t.result=t.convertArrayToObject(t.accounts,"id"),console.log(t.result);case 9:case"end":return a.stop()}}),a)})))()},computed:f(f(f({},Object(u["b"])("orders",["getOneOrder","addMessage","getAllRequests","sendToApproved"])),Object(u["c"])("orders",["getAccountById","getAccountsOption","getCarsOption","getCarById","accounts"])),Object(u["c"])("base",["userInfo","orders"])),data:function(){return{result:null,account:{},listAccounts:null,prompt:!1,dateTimeFormatStart:"",timeTimeFormatEnd:"",data:{}}},methods:{CutStringDate:function(){console.log(this.data,"this.dateFormatStart"),console.log("abc"),this.dateFormatStart=this.data.startDate.slice(0,10)},CutStringTime:function(){this.timeFormatStart=this.data.startDate.slice(11,19)},convertArrayToObject:function(t,a){var e={};return this.accounts.reduce((function(t,e){return f(f({},t),{},c()({},e[a],e))}),e)},loadData:function(){var t=this;return d()(s.a.mark((function a(){var e,n;return s.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return e=t.$route.query.id,console.log("id",e),a.next=4,m()({method:"GET",url:"http://localhost:1010/api/v1/calendarWork/"+e}).then((function(a){t.data=a.data.data,t.dateTimeFormatStart=t.data.startDate.slice(0,10)+" "+t.data.startDate.slice(11,19),t.timeTimeFormatEnd=t.data.endDate.slice(0,10)+" "+t.data.endDate.slice(11,19),console.log("data",t.data)})).catch((function(t){console.log("err",t)}));case 4:return n=t.$route.query.id,a.next=7,m()({method:"GET",url:"http://localhost:1010/api/v1/userRegistrationCalendarWork?calendarWorkId="+n}).then((function(a){a&&(t.listAccounts=a.data)})).catch((function(a){a&&t.$q.notify({type:"positive"})}));case 7:case"end":return a.stop()}}),a)})))()},goBack:function(){this.$router.go(-1)}}},g=h,v=(e("2233"),e("2877")),q=e("9c40"),k=e("f09f"),y=e("a370"),O=e("27f9"),T=e("24e8"),C=e("ddd8"),w=e("58a8"),x=e("4b7e"),A=e("7f67"),_=e("eebe"),S=e.n(_),j=Object(v["a"])(g,n,o,!1,null,"31ee81e5",null);a["default"]=j.exports;S()(j,"components",{QBtn:q["a"],QCard:k["a"],QCardSection:y["a"],QInput:O["a"],QDialog:T["a"],QSelect:C["a"],QBadge:w["a"],QCardActions:x["a"]}),S()(j,"directives",{ClosePopup:A["a"]})},2233:function(t,a,e){"use strict";var n=e("cd14"),o=e.n(n);o.a},cd14:function(t,a,e){}}]);