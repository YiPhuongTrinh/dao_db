import{S as se,i as ae,s as le,e as ce,f as ue,g as de,y as M,o as fe,J as he,K as ge,L as pe,I as ye,C as f,M as ke}from"./index-2cbf84c8.js";import{E as K,a as C,h as xe,b as me,c as be,d as we,e as Ee,s as Se,f as Ke,g as Ce,r as qe,i as Re,k as Le,j as Ie,l as Ae,m as Be,n as Oe,o as _e,p as ve,q as Y,C as L,S as Me,t as De}from"./index-808c8630.js";function He(e){Z(e,"start");var r={},n=e.languageData||{},p=!1;for(var y in e)if(y!=n&&e.hasOwnProperty(y))for(var h=r[y]=[],s=e[y],i=0;i<s.length;i++){var l=s[i];h.push(new Ue(l,e)),(l.indent||l.dedent)&&(p=!0)}return{name:n.name,startState:function(){return{state:"start",pending:null,indent:p?[]:null}},copyState:function(a){var m={state:a.state,pending:a.pending,indent:a.indent&&a.indent.slice(0)};return a.stack&&(m.stack=a.stack.slice(0)),m},token:We(r),indent:Ne(r,n),languageData:n}}function Z(e,r){if(!e.hasOwnProperty(r))throw new Error("Undefined state "+r+" in simple mode")}function Fe(e,r){if(!e)return/(?:)/;var n="";return e instanceof RegExp?(e.ignoreCase&&(n="i"),e=e.source):e=String(e),new RegExp((r===!1?"":"^")+"(?:"+e+")",n)}function Te(e){if(!e)return null;if(e.apply)return e;if(typeof e=="string")return e.replace(/\./g," ");for(var r=[],n=0;n<e.length;n++)r.push(e[n]&&e[n].replace(/\./g," "));return r}function Ue(e,r){(e.next||e.push)&&Z(r,e.next||e.push),this.regex=Fe(e.regex),this.token=Te(e.token),this.data=e}function We(e){return function(r,n){if(n.pending){var p=n.pending.shift();return n.pending.length==0&&(n.pending=null),r.pos+=p.text.length,p.token}for(var y=e[n.state],h=0;h<y.length;h++){var s=y[h],i=(!s.data.sol||r.sol())&&r.match(s.regex);if(i){s.data.next?n.state=s.data.next:s.data.push?((n.stack||(n.stack=[])).push(n.state),n.state=s.data.push):s.data.pop&&n.stack&&n.stack.length&&(n.state=n.stack.pop()),s.data.indent&&n.indent.push(r.indentation()+r.indentUnit),s.data.dedent&&n.indent.pop();var l=s.token;if(l&&l.apply&&(l=l(i)),i.length>2&&s.token&&typeof s.token!="string"){n.pending=[];for(var a=2;a<i.length;a++)i[a]&&n.pending.push({text:i[a],token:s.token[a-1]});return r.backUp(i[0].length-(i[1]?i[1].length:0)),l[0]}else return l&&l.join?l[0]:l}}return r.next(),null}}function Ne(e,r){return function(n,p){if(n.indent==null||r.dontIndentStates&&r.doneIndentState.indexOf(n.state)>-1)return null;var y=n.indent.length-1,h=e[n.state];e:for(;;){for(var s=0;s<h.length;s++){var i=h[s];if(i.data.dedent&&i.data.dedentIfLineStart!==!1){var l=i.regex.exec(p);if(l&&l[0]){y--,(i.next||i.push)&&(h=e[i.next||i.push]),p=p.slice(l[0].length);continue e}}}break}return y<0?0:n.indent[y]}}function Je(e){let r;return{c(){r=ce("div"),ue(r,"class","code-editor")},m(n,p){de(n,r,p),e[15](r)},p:M,i:M,o:M,d(n){n&&fe(r),e[15](null)}}}function Pe(e){return JSON.stringify([e==null?void 0:e.name,e==null?void 0:e.type,e==null?void 0:e.schema])}function Ve(e,r,n){let p;he(e,ge,t=>n(21,p=t));const y=pe();let{id:h=""}=r,{value:s=""}=r,{disabled:i=!1}=r,{placeholder:l=""}=r,{baseCollection:a=null}=r,{singleLine:m=!1}=r,{extraAutocompleteKeys:I=[]}=r,{disableRequestKeys:w=!1}=r,{disableIndirectCollectionsKeys:E=!1}=r,d,b,A=i,D=new L,H=new L,F=new L,T=new L,q=[],U=[],W=[],N=[],R="",B="";function O(){d==null||d.focus()}let _=null;function j(){clearTimeout(_),_=setTimeout(()=>{q=$(p),N=ee(),U=w?[]:te(),W=E?[]:ne()},300)}function $(t){let o=t.slice();return a&&f.pushOrReplaceByKey(o,a,"id"),o}function J(){b==null||b.dispatchEvent(new CustomEvent("change",{detail:{value:s},bubbles:!0}))}function P(){if(!h)return;const t=document.querySelectorAll('[for="'+h+'"]');for(let o of t)o.removeEventListener("click",O)}function V(){if(!h)return;P();const t=document.querySelectorAll('[for="'+h+'"]');for(let o of t)o.addEventListener("click",O)}function S(t,o="",u=0){var x,z,Q;let g=q.find(k=>k.name==t||k.id==t);if(!g||u>=4)return[];let c=f.getAllCollectionIdentifiers(g,o);for(const k of g.schema){const v=o+k.name;if(k.type==="relation"&&((x=k.options)!=null&&x.collectionId)){const X=S(k.options.collectionId,v+".",u+1);X.length&&(c=c.concat(X))}k.type==="select"&&((z=k.options)==null?void 0:z.maxSelect)!=1&&c.push(v+":each"),((Q=k.options)==null?void 0:Q.maxSelect)!=1&&["select","file","relation"].includes(k.type)&&c.push(v+":length")}return c}function ee(){return S(a==null?void 0:a.name)}function te(){const t=[];t.push("@request.method"),t.push("@request.query."),t.push("@request.data."),t.push("@request.headers."),t.push("@request.auth.id"),t.push("@request.auth.collectionId"),t.push("@request.auth.collectionName"),t.push("@request.auth.verified"),t.push("@request.auth.username"),t.push("@request.auth.email"),t.push("@request.auth.emailVisibility"),t.push("@request.auth.created"),t.push("@request.auth.updated");const o=q.filter(g=>g.type==="auth");for(const g of o){const c=S(g.id,"@request.auth.");for(const x of c)f.pushUnique(t,x)}const u=["created","updated"];if(a!=null&&a.id){const g=S(a.name,"@request.data.");for(const c of g){t.push(c);const x=c.split(".");x.length===3&&x[2].indexOf(":")===-1&&!u.includes(x[2])&&t.push(c+":isset")}}return t}function ne(){const t=[];for(const o of q){const u="@collection."+o.name+".",g=S(o.name,u);for(const c of g)t.push(c)}return t}function re(t=!0,o=!0){let u=[].concat(I);return u=u.concat(N||[]),t&&(u=u.concat(U||[])),o&&(u=u.concat(W||[])),u.sort(function(g,c){return c.length-g.length}),u}function ie(t){let o=t.matchBefore(/[\'\"\@\w\.]*/);if(o&&o.from==o.to&&!t.explicit)return null;let u=[{label:"false"},{label:"true"},{label:"@now"},{label:"@second"},{label:"@minute"},{label:"@hour"},{label:"@year"},{label:"@day"},{label:"@month"},{label:"@weekday"},{label:"@todayStart"},{label:"@todayEnd"},{label:"@monthStart"},{label:"@monthEnd"},{label:"@yearStart"},{label:"@yearEnd"}];E||u.push({label:"@collection.*",apply:"@collection."});const g=re(!w,!w&&o.text.startsWith("@c"));for(const c of g)u.push({label:c.endsWith(".")?c+"*":c,apply:c});return{from:o.from,options:u}}function G(){return Me.define(He({start:[{regex:/true|false|null/,token:"atom"},{regex:/"(?:[^\\]|\\.)*?(?:"|$)/,token:"string"},{regex:/'(?:[^\\]|\\.)*?(?:'|$)/,token:"string"},{regex:/0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,token:"number"},{regex:/\&\&|\|\||\=|\!\=|\~|\!\~|\>|\<|\>\=|\<\=/,token:"operator"},{regex:/[\{\[\(]/,indent:!0},{regex:/[\}\]\)]/,dedent:!0},{regex:/\w+[\w\.]*\w+/,token:"keyword"},{regex:f.escapeRegExp("@now"),token:"keyword"},{regex:f.escapeRegExp("@second"),token:"keyword"},{regex:f.escapeRegExp("@minute"),token:"keyword"},{regex:f.escapeRegExp("@hour"),token:"keyword"},{regex:f.escapeRegExp("@year"),token:"keyword"},{regex:f.escapeRegExp("@day"),token:"keyword"},{regex:f.escapeRegExp("@month"),token:"keyword"},{regex:f.escapeRegExp("@weekday"),token:"keyword"},{regex:f.escapeRegExp("@todayStart"),token:"keyword"},{regex:f.escapeRegExp("@todayEnd"),token:"keyword"},{regex:f.escapeRegExp("@monthStart"),token:"keyword"},{regex:f.escapeRegExp("@monthEnd"),token:"keyword"},{regex:f.escapeRegExp("@yearStart"),token:"keyword"},{regex:f.escapeRegExp("@yearEnd"),token:"keyword"},{regex:f.escapeRegExp("@request.method"),token:"keyword"}]}))}ye(()=>{const t={key:"Enter",run:o=>{m&&y("submit",s)}};return V(),n(11,d=new K({parent:b,state:C.create({doc:s,extensions:[xe(),me(),be(),we(),Ee(),C.allowMultipleSelections.of(!0),Se(De,{fallback:!0}),Ke(),Ce(),qe(),Re(),Le.of([t,...Ie,...Ae,Be.find(o=>o.key==="Mod-d"),...Oe,..._e]),K.lineWrapping,ve({override:[ie],icons:!1}),T.of(Y(l)),H.of(K.editable.of(!i)),F.of(C.readOnly.of(i)),D.of(G()),C.transactionFilter.of(o=>m&&o.newDoc.lines>1?[]:o),K.updateListener.of(o=>{!o.docChanged||i||(n(1,s=o.state.doc.toString()),J())})]})})),()=>{clearTimeout(_),P(),d==null||d.destroy()}});function oe(t){ke[t?"unshift":"push"](()=>{b=t,n(0,b)})}return e.$$set=t=>{"id"in t&&n(2,h=t.id),"value"in t&&n(1,s=t.value),"disabled"in t&&n(3,i=t.disabled),"placeholder"in t&&n(4,l=t.placeholder),"baseCollection"in t&&n(5,a=t.baseCollection),"singleLine"in t&&n(6,m=t.singleLine),"extraAutocompleteKeys"in t&&n(7,I=t.extraAutocompleteKeys),"disableRequestKeys"in t&&n(8,w=t.disableRequestKeys),"disableIndirectCollectionsKeys"in t&&n(9,E=t.disableIndirectCollectionsKeys)},e.$$.update=()=>{e.$$.dirty[0]&32&&n(13,R=Pe(a)),e.$$.dirty[0]&25352&&!i&&(B!=R||w!==-1||E!==-1)&&(n(14,B=R),j()),e.$$.dirty[0]&4&&h&&V(),e.$$.dirty[0]&2080&&d&&a!=null&&a.schema&&d.dispatch({effects:[D.reconfigure(G())]}),e.$$.dirty[0]&6152&&d&&A!=i&&(d.dispatch({effects:[H.reconfigure(K.editable.of(!i)),F.reconfigure(C.readOnly.of(i))]}),n(12,A=i),J()),e.$$.dirty[0]&2050&&d&&s!=d.state.doc.toString()&&d.dispatch({changes:{from:0,to:d.state.doc.length,insert:s}}),e.$$.dirty[0]&2064&&d&&typeof l<"u"&&d.dispatch({effects:[T.reconfigure(Y(l))]})},[b,s,h,i,l,a,m,I,w,E,O,d,A,R,B,oe]}class Qe extends se{constructor(r){super(),ae(this,r,Ve,Je,le,{id:2,value:1,disabled:3,placeholder:4,baseCollection:5,singleLine:6,extraAutocompleteKeys:7,disableRequestKeys:8,disableIndirectCollectionsKeys:9,focus:10},null,[-1,-1])}get focus(){return this.$$.ctx[10]}}export{Qe as default};
