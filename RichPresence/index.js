(function(T,x,k,r,B,R,D,g,$){"use strict";function C(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}var b;(function(t){t[t.GAME=0]="GAME",t[t.STREAMING=1]="STREAMING",t[t.LISTENING=2]="LISTENING",t[t.WATCHING=3]="WATCHING",t[t.COMPETING=5]="COMPETING"})(b||(b={}));const l=function(){return y.storage},U={discord_application_id:"1054951789318909972"},_={get enabled(){return l().enabled??!1},get mode(){return l().mode??"none"},get applicationId(){return l().appID??U.discord_application_id},custom:{get enabled(){return(l().mode??"none")==="custom"},get(t,n){return l().customRpc?(l().customRpc??{})[t]||n:{}}},ws:{get enabled(){return(l().mode??"none")==="ws"},get(t,n){return(l().ws??{})[t]||n}}},M=function(t){const[,n]=r.React.useReducer(function(e){return e+1},0);return{get(e,a){return t?(l()[t]??{})[e]??a:l()[e]??a},set(e,a){if(t){const o=l()[t]??{};o[e]=a.length===0?void 0:a,l()[t]=o}else l()[e]=a;n()}}},{SET_ACTIVITY:W}=k.findByProps("SET_ACTIVITY"),{handler:V}=W;let Y=function(){function t(){C(this,t),this.lastActivityType=b.GAME}var n=t.prototype;return n.replaceHostname=function(e){return e.replace(/^(mp:)?(https?:\/\/)?([^\/]+\.)?discordapp\.(com|net)\/(.*)$/i,"https://dcp.developerland.ml?url=https://cdn.discordapp.com/$5").replace(/^(mp:)(attachments\/.*)$/i,"https://dcp.developerland.ml?url=https://cdn.discordapp.com/$2")},n.patchFilter=function(e){var a=this;e.before("dispatch",r.FluxDispatcher,function(o){const{type:d,activity:i}=o[0];d==="LOCAL_ACTIVITY_UPDATE"&&i&&(i.type=a.lastActivityType,a.lastActivityType=b.GAME,i.assets&&(i.assets.large_image&&(i.assets.large_image=a.replaceHostname(i.assets.large_image)),i.assets.small_image&&(i.assets.small_image=a.replaceHostname(i.assets.small_image))))})},n.sendRPC=async function(e){return Object.keys(e).forEach(function(a){return e[a]===void 0||e[a].length===0&&delete e[a]}),e.assets&&Object.keys(e.assets).forEach(function(a){return e.assets[a]===void 0||e.assets[a].length===0&&delete e.assets[a]}),this.lastActivityType=e.type??b.GAME,await this.sendRequest(e)},n.sendRequest=async function(e){return await V({isSocketConnected:function(){return!0},socket:{id:110,application:{id:_.applicationId,name:e?.name??"RichPresence"},transport:"ipc"},args:{pid:110,activity:e??null}})},n.clearRPC=async function(){return this.lastActivityType=b.GAME,await this.sendRequest(void 0)},t}();function P(t,n){return P=Object.setPrototypeOf||function(a,o){return a.__proto__=o,a},P(t,n)}function N(t,n){return P(t,n)}function j(t,n){if(typeof n!="function"&&n!==null)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(n&&n.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),n&&N(t,n)}function G(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch{return!1}}function v(t,n,e){return G()?v=Reflect.construct:v=function(o,d,i){var s=[null];s.push.apply(s,d);var c=Function.bind.apply(o,s),m=new c;return i&&N(m,i.prototype),m},v.apply(null,arguments)}function H(t,n,e){return v.apply(null,arguments)}function q(t){return Function.toString.call(t).indexOf("[native code]")!==-1}function I(t){return I=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},I(t)}function A(t){return I(t)}function L(t){var n=typeof Map=="function"?new Map:void 0;return L=function(a){if(a===null||!q(a))return a;if(typeof a!="function")throw new TypeError("Super expression must either be null or a function");if(typeof n<"u"){if(n.has(a))return n.get(a);n.set(a,o)}function o(){return H(a,arguments,A(this).constructor)}return o.prototype=Object.create(a.prototype,{constructor:{value:o,enumerable:!1,writable:!0,configurable:!0}}),N(o,a)},L(t)}function z(t){return L(t)}function K(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function J(t){if(t===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function X(t){return t&&t.constructor===Symbol?"symbol":typeof t}function Q(t,n){return n&&(X(n)==="object"||typeof n=="function")?n:J(t)}function Z(t){var n=K();return function(){var a=A(t),o;if(n){var d=A(this).constructor;o=Reflect.construct(a,arguments,d)}else o=a.apply(this,arguments);return Q(this,o)}}let p;const ee=function(t){p=t};let te=function(t){j(e,t);var n=Z(e);function e(o,d){C(this,e);var i;return i=n.call(this,`wss://localhost.direct:${o}`),i.onopen=function(s){p.info(`[OPEN] Connected to websocket: ${i.url}`)},i.onmessage=async function(s){if(s.data.includes("[READY] Websocket is ready to send rpc")){i.send("[READY] Websocket is ready to receive rpc");return}if(s.data.includes("[INFO] Stop showing")){await i.rpcClient.clearRPC();return}if(p.info(`[MESSAGE] Data received from websocket: ${s.data}`),!s.data.startsWith("{"))return;const c=JSON.parse(s.data),m=i.convert(c),f=await i.rpcClient.sendRPC(m);p.info("[INFO] Sent RPC Data",f)},i.onclose=function(s){s.wasClean?p.info(`[CLOSE] Connection closed cleanly, code=${s.code} reason=${s.reason}`):p.warn("[CLOSE] Connection died"),i.rpcClient.clearRPC()},i.onerror=function(s){p.error(`[ERROR] ${s.message}`)},i.convert=function(s){const c=s.d.activities[0],m=[];c?.buttons?.length&&c.buttons.forEach(function(de,fe){m.push({label:de??null,url:c.metadata.button_urls[fe]??null})});const f=c.assets??null;return f&&(f.large_image&&(f.large_image=i.replaceHostname(f.large_image)),f.small_image&&(f.small_image=i.replaceHostname(f.small_image))),{name:c.name??void 0,type:c.type??void 0,state:c.state??void 0,details:c.details??void 0,timestamps:c.timestamps??void 0,assets:f??void 0,buttons:m??void 0}},i.rpcClient=d,i.addEventListener("open",i.onopen),i.addEventListener("message",i.onmessage),i.addEventListener("close",i.onclose),i.addEventListener("error",i.onerror),i}var a=e.prototype;return a.replaceHostname=function(o){return o.replace(/^(mp:)?(https?:\/\/)?([^\/]+\.)?discordapp\.(com|net)\/(.*)$/i,"https://dcp.developerland.ml?url=https://cdn.discordapp.com/$5").replace(/^(mp:)(attachments\/.*)$/i,"https://dcp.developerland.ml?url=https://cdn.discordapp.com/$2")},e}(z(WebSocket));const{FormSection:E,FormInput:u,FormRow:O,FormSwitch:ne,FormText:ge}=D.Forms,{View:re,Text:w,ScrollView:ae}=r.ReactNative,S=r.stylesheet.createThemedStyleSheet({subText:{fontSize:14,marginLeft:16,marginRight:16,color:$.semanticColors.TEXT_MUTED,fontFamily:r.constants.Fonts.PRIMARY_NORMAL},textLink:{color:$.semanticColors.TEXT_LINK}});function ie(){const{get:t,set:n}=M("customRpc");return r.React.createElement(r.React.Fragment,null,r.React.createElement(ae,null,r.React.createElement(E,{title:"Basic"},r.React.createElement(u,{title:"Application Name",value:t("app_name"),placeholder:"Discord",onChange:function(e){return n("app_name",e)}}),r.React.createElement(u,{title:"Details",value:t("details"),placeholder:"Competitive",onChange:function(e){return n("details",e)}}),r.React.createElement(u,{title:"State",value:t("state"),placeholder:"Playing Solo",onChange:function(e){return n("state",e)}})),r.React.createElement(E,{title:"Images"},r.React.createElement(u,{title:"Large Image Asset Key or URL",value:t("large_image"),placeholder:"large_image_here",onChange:function(e){return n("large_image",e)}}),r.React.createElement(u,{title:"Large Image Text",value:t("large_image_text"),placeholder:"Playing on Joe's lobby",disabled:!t("large_image",!1),onChange:function(e){return n("large_image_text",e)}}),r.React.createElement(u,{title:"Small Image Asset Key or URL",value:t("small_image"),placeholder:"small_image_here",onChange:function(e){return n("small_image",e)}}),r.React.createElement(u,{title:"Small Image Text",value:t("small_image_text"),placeholder:"Solo",disabled:!t("small_image",!1),onChange:function(e){return n("small_image_text",e)}}),r.React.createElement(w,{style:S.subText},"Image assets key can be either a Discord asset name or a URL to an image.")),r.React.createElement(E,{title:"Timestamps"},r.React.createElement(w,{style:S.subText},"Timestamps are in Epoch seconds. You may use"," ",r.React.createElement(w,{style:S.textLink,onPress:function(){return r.url.openURL("https://www.epochconverter.com/")}},"this")," ","to convert your time to Unix Epoch time."),r.React.createElement(re,{style:{height:12}}),r.React.createElement(O,{label:"Enable timestamps",subLabel:"Set whether to show timestamps or not",trailing:r.React.createElement(ne,{value:t("enable_timestamps"),onValueChange:function(e){return n("enable_timestamps",e)}})}),r.React.createElement(u,{title:"Start Timestamp (seconds)",value:t("start_timestamp"),placeholder:"1234567890",disabled:!t("enable_timestamps",!1),onChange:function(e){return n("start_timestamp",e)}}),r.React.createElement(u,{title:"End Timestamp (seconds)",value:t("end_timestamp"),placeholder:"1234567890",disabled:!t("enable_timestamps",!1),onChange:function(e){return n("end_timestamp",e)}}),r.React.createElement(O,{label:"Use current time as start timestamp",subLabel:"This will override the start timestamp you set above",disabled:!t("enable_timestamps",!1),onPress:function(){n("start_timestamp",String(Date.now()/1e3|0))},trailing:O.Arrow}),r.React.createElement(w,{style:S.subText},"NOTE: Leaving start timestamp blank will use the time RPC started.")),r.React.createElement(E,{title:"Buttons"},r.React.createElement(u,{title:"First Button Text",value:t("button1_text"),placeholder:"random link #1",onChange:function(e){return n("button1_text",e)}}),r.React.createElement(u,{title:"First Button URL",value:t("button1_URL"),placeholder:"https://discord.com/vanityurl/dotcom/steakpants/flour/flower/index11.html",disabled:!t("button1_text",!1),onChange:function(e){return n("button1_URL",e)}}),r.React.createElement(u,{title:"Second Button Text",value:t("button2_text"),placeholder:"random link #2",onChange:function(e){return n("button2_text",e)}}),r.React.createElement(u,{title:"Second Button URL",value:t("button2_URL"),placeholder:"https://youtu.be/w0AOGeqOnFY",disabled:!t("button2_text",!1),onChange:function(e){return n("button2_URL",e)}}))))}const{ScrollView:oe}=r.ReactNative,{FormRow:h,FormSection:F,FormSwitch:se,FormInput:ce,FormDivider:le,FormText:he}=D.Forms;function ue(){const t=r.NavigationNative.useNavigation(),{get:n,set:e}=M(),a=R.getAssetIDByName("checked");return r.React.createElement(r.React.Fragment,null,r.React.createElement(oe,null,r.React.createElement(F,{title:"Rich Presence Settings",android_noDivider:!0},r.React.createElement(h,{label:"Enable Rich Presence",subLabel:"Rich presence will be updated when this toggle is turned on or after your Discord client is restarted.",trailing:r.React.createElement(se,{value:n("enabled",!1),onValueChange:function(o){if(o&&n("mode","none")=="none"){g.showToast("Please select a mode before enabling rich presence.",R.getAssetIDByName("Small"));return}e("enabled",o),y.init().then(function(){g.showToast(`Rich presence ${o?"enabled":"disabled"}.`,null)}).catch(function(d){g.showToast(`Failed to ${o?"enable":"disable"} rich presence.`,R.getAssetIDByName("Small")),p.error(d)})}})}),r.React.createElement(h,{label:"Force update rich presence",subLabel:"Use this to apply changes to your rich presence settings.",trailing:h.Arrow,disabled:!n("enabled",!1),onPress:function(){y.init().then(function(){g.showToast("Rich presence updated.",null)}).catch(function(o){g.showToast("Failed to update rich presence.",R.getAssetIDByName("Small")),p.error(o)})}})),r.React.createElement(F,{title:"Mode"},r.React.createElement(h,{label:"Custom settings",subLabel:"Set the rich presence according to your own settings.",trailing:n("mode","none")==="custom"?r.React.createElement(h.Icon,{source:a,color:"#5865F2"}):void 0,onPress:function(){e("mode","custom"),y.init().then(function(){g.showToast("Rich presence updated to mode custom.",null)}).catch(function(o){g.showToast("Failed to update rich presence.",R.getAssetIDByName("Small")),p.error(o)})}}),r.React.createElement(h,{label:"Websocket",subLabel:"Set the rich presence using websocket.",trailing:n("mode","none")==="ws"?r.React.createElement(h.Icon,{source:a,color:"#5865F2"}):void 0,onPress:function(){e("mode","ws"),y.init().then(function(){g.showToast("Rich presence updated to mode websocket.",null)}).catch(function(o){g.showToast("Failed to update rich presence (websocket).",R.getAssetIDByName("Small")),p.error(o)})}})),r.React.createElement(F,{title:"Configurations"},r.React.createElement(ce,{title:"Discord Application ID [optional]",value:n("appID"),placeholder:U.discord_application_id,onChange:function(o){return e("appID",o)}}),r.React.createElement(le,null),r.React.createElement(h,{label:"Configure custom rich presence",subLabel:"Show how cool you are to your friends by manually customizing your rich presence.",trailing:h.Arrow,onPress:function(){return t.push("VendettaCustomPage",{title:"Rich Presence Setup",render:function(){return ie()}})}}))))}let pe=function(){function t(){C(this,t),this.rpcClient=new Y,this.storage=B.storage,this.settings=ue,this.logger=x.logger}var n=t.prototype;return n.init=async function(){if(await this.rpcClient.clearRPC(),this.rpWebSocket?.close(),!!_.enabled)switch(this.logger.info("Starting RPC..."),_.mode){case"custom":const e=_.custom;this.logger.info("Starting user-set RPC...");const a=e.get("large_image"),o=e.get("small_image"),d=e.get("start_timestamp",-1),i=e.get("end_timestamp"),s=await this.rpcClient.sendRPC({name:e.get("app_name","Discord"),type:b.GAME,state:e.get("state"),details:e.get("details"),...e.get("enable_timestamps")?{timestamps:{start:Number(d)===-1?Date.now()/1e3|0:Number(d),...i&&!isNaN(+i)?{end:Number(i)}:{}}}:{},...a||o?{assets:{large_image:a,large_text:a?e.get("large_image_text"):void 0,small_image:e.get("small_image"),small_text:a?e.get("small_image_text"):void 0}}:{},buttons:[{label:e.get("button1_text"),url:e.get("button1_URL")},{label:e.get("button2_text"),url:e.get("button2_URL")}].filter(function(f){return!!f.label})});this.logger.info("Started user-set RPC. SET_ACTIVITY: ",s);break;case"ws":this.logger.info("Starting Websocket RPC...");let c=6463;this.createWebsocket(c,this.rpcClient);break;case"none":const m="RPC mode is set to none while it's enabled";throw new Error(m)}},n.onLoad=function(){var e=this;const a=function(){return e.init().then(function(){e.logger.info("RPC started!")}).catch(function(o){e.logger.error(o)})};ee(this.logger),this.rpcClient.patchFilter(x.patcher),k.findByStoreName("UserStore").getCurrentUser()?a():r.FluxDispatcher.subscribe("CONNECTION_OPEN",a)},n.onUnload=function(){this.rpWebSocket?.close(),this.rpcClient.clearRPC()},n.createWebsocket=async function(e,a){var o=this;this.rpWebSocket=new te(e,a),this.rpWebSocket.onerror=function(){e>6472||(o.createWebsocket(e+1,a),p.info(`Trying with port: ${e}`))}},t}();var y=new pe;return T.default=y,Object.defineProperty(T,"__esModule",{value:!0}),T})({},vendetta,vendetta.metro,vendetta.metro.common,vendetta.plugin,vendetta.ui.assets,vendetta.ui.components,vendetta.ui.toasts,vendetta.ui);