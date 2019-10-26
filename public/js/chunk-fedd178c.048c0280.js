(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-fedd178c"],{"771b":function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"editor-page"},[r("div",{staticClass:"container page"},[r("div",{staticClass:"row"},[r("div",{staticClass:"col-md-10 offset-md-1 col-xs-12"},[r("ListErrors",{attrs:{errors:e.errors}}),r("form",{on:{submit:function(t){return t.preventDefault(),e.onPublish(e.event.slug)}}},[r("fieldset",{attrs:{disabled:e.inProgress}},[r("fieldset",{staticClass:"form-group"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.event.title,expression:"event.title"}],staticClass:"form-control form-control-lg",attrs:{type:"text",placeholder:"Event Title"},domProps:{value:e.event.title},on:{input:function(t){t.target.composing||e.$set(e.event,"title",t.target.value)}}})]),r("fieldset",{staticClass:"form-group"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.event.description,expression:"event.description"}],staticClass:"form-control",attrs:{type:"text",placeholder:"What's this event about? Write a catchy short description."},domProps:{value:e.event.description},on:{input:function(t){t.target.composing||e.$set(e.event,"description",t.target.value)}}})]),r("fieldset",{staticClass:"form-group"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.event.stream,expression:"event.stream"}],staticClass:"form-control",attrs:{type:"text",placeholder:"Enter a link to your IP camera stream."},domProps:{value:e.event.stream},on:{input:function(t){t.target.composing||e.$set(e.event,"stream",t.target.value)}}})]),r("fieldset",{staticClass:"form-group"},[r("textarea",{directives:[{name:"model",rawName:"v-model",value:e.event.body,expression:"event.body"}],staticClass:"form-control",attrs:{rows:"8",placeholder:"Write more interesting things about your event."},domProps:{value:e.event.body},on:{input:function(t){t.target.composing||e.$set(e.event,"body",t.target.value)}}})]),r("fieldset",{staticClass:"form-group"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.tagInput,expression:"tagInput"}],staticClass:"form-control",attrs:{type:"text",placeholder:"Enter tags"},domProps:{value:e.tagInput},on:{keypress:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:(t.preventDefault(),e.addTag(e.tagInput))},input:function(t){t.target.composing||(e.tagInput=t.target.value)}}}),r("div",{staticClass:"tag-list"},e._l(e.event.tagList,(function(t,n){return r("span",{key:t+n,staticClass:"tag-default tag-pill"},[r("i",{staticClass:"ion-close-round",on:{click:function(r){return e.removeTag(t)}}}),e._v("\n                  "+e._s(t)+"\n                ")])})),0)])]),r("button",{staticClass:"btn btn-lg pull-xs-right btn-primary",attrs:{disabled:e.inProgress,type:"submit"}},[e._v("\n            Publish Event\n          ")])])],1)])])])},s=[],a=(r("8e6e"),r("ac6a"),r("456d"),r("bd86")),o=(r("96cf"),r("3b8d")),i=r("2f62"),u=r("4360"),c=r("e98d"),l=r("6c33");function p(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function d(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?p(r,!0).forEach((function(t){Object(a["a"])(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):p(r).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var v={name:"EventEdit",components:{ListErrors:c["a"]},props:{previousEvent:{type:Object,required:!1}},beforeRouteUpdate:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t,r,n){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,u["a"].dispatch(l["i"]);case 2:return e.abrupt("return",n());case 3:case"end":return e.stop()}}),e)})));function t(t,r,n){return e.apply(this,arguments)}return t}(),beforeRouteEnter:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t,r,n){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,u["a"].dispatch(l["i"]);case 2:if(void 0===t.params.slug){e.next=5;break}return e.next=5,u["a"].dispatch(l["m"],t.params.slug,t.params.previousEvent);case 5:return e.abrupt("return",n());case 6:case"end":return e.stop()}}),e)})));function t(t,r,n){return e.apply(this,arguments)}return t}(),beforeRouteLeave:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t,r,n){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,u["a"].dispatch(l["i"]);case 2:n();case 3:case"end":return e.stop()}}),e)})));function t(t,r,n){return e.apply(this,arguments)}return t}(),data:function(){return{tagInput:null,inProgress:!1,errors:{}}},computed:d({},Object(i["b"])(["event"])),methods:{onPublish:function(e){var t=this,r=e?l["e"]:l["h"];this.inProgress=!0,this.$store.dispatch(r).then((function(e){var r=e.data;t.inProgress=!1,t.$router.push({name:"event",params:{slug:r.event.slug}})})).catch((function(e){var r=e.response;t.inProgress=!1,t.errors=r.data.errors}))},removeTag:function(e){this.$store.dispatch(l["g"],e)},addTag:function(e){this.$store.dispatch(l["f"],e),this.tagInput=null}}},m=v,f=r("2877"),g=Object(f["a"])(m,n,s,!1,null,null,null);t["default"]=g.exports},e98d:function(e,t,r){"use strict";var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",{staticClass:"error-messages"},e._l(e.errors,(function(t,n){return r("li",{key:n},[r("span",{domProps:{textContent:e._s(n)}}),e._l(t,(function(t){return r("span",{key:t,domProps:{textContent:e._s(t)}})}))],2)})),0)},s=[],a={name:"ListErorrs",props:{errors:{type:Object,required:!0}}},o=a,i=r("2877"),u=Object(i["a"])(o,n,s,!1,null,null,null);t["a"]=u.exports}}]);
//# sourceMappingURL=chunk-fedd178c.048c0280.js.map