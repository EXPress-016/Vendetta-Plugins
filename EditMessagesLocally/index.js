(function(r,n,c,d,m,y){"use strict";function E(e,i){if(!(e instanceof i))throw new TypeError("Cannot call a class as a function")}let M=function(){function e(){E(this,e),this.patches=[]}var i=e.prototype;return i.onLoad=function(){const o=n.findByProps("openLazy","hideActionSheet"),h=n.findByProps("startEditMessage","editMessage"),S=n.findByStoreName("MessageStore"),p=n.findByStoreName("UserStore"),{FormRow:v}=y.Forms,A=n.findByName("Icon");this.patches.push(d.before("openLazy",o,function(t){const[u,s,B]=t;s=="MessageLongPressActionSheet"&&u.then(function(L){const P=d.after("default",L,function(U,l){const[f,a]=l.props?.children?.props?.children?.props?.children;if(f?e.message=f.props.message:e.message=B.message,a&&e.message.author.id!==p.getCurrentUser().id){const g=a.findIndex(function(N){return N.props.message=="Reply"}),C=a[g];a[g]=c.React.createElement(v,{label:"Edit Message Locally",leading:c.React.createElement(A,{source:m.getAssetIDByName("ic_message_edit")}),onPress:function(){o.hideActionSheet(),h.startEditMessage(e.message.channel_id,e.message.id,e.message.content)}}),l.props.children.props.children.props.children[1]=[C,...a]}P()})})})),this.patches.push(d.instead("editMessage",h,function(t,u){let s=S.getMessage(t[0],t[1]);if(s?.author?.id===p.getCurrentUser().id){u(...t);return}c.FluxDispatcher.dispatch({type:"MESSAGE_UPDATE",message:{channel_id:s.channel_id,id:s.id,content:t[2].content}})}))},i.onUnload=function(){this.patches.forEach(function(o){return o()})},e}();var _=new M;return r.default=_,Object.defineProperty(r,"__esModule",{value:!0}),r})({},vendetta.metro,vendetta.metro.common,vendetta.patcher,vendetta.ui.assets,vendetta.ui.components);