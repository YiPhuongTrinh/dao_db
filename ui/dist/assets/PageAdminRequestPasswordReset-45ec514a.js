import{S as M,i as T,s as j,F as z,c as R,m as S,t as w,a as y,d as E,b as g,e as _,f as p,g as k,h as d,j as A,l as B,k as N,n as D,o as v,p as C,q as G,r as F,u as H,v as I,w as h,x as J,y as P,z as L}from"./index-32c823a1.js";function K(c){let e,s,n,l,t,i,f,m,o,a,b,u;return l=new G({props:{class:"form-field required",name:"email",$$slots:{default:[Q,({uniqueId:r})=>({5:r}),({uniqueId:r})=>r?32:0]},$$scope:{ctx:c}}}),{c(){e=_("form"),s=_("div"),s.innerHTML=`<h4 class="m-b-xs">Forgotten admin password</h4> 
                <p>Enter the email associated with your account and we’ll send you a recovery link:</p>`,n=g(),R(l.$$.fragment),t=g(),i=_("button"),f=_("i"),m=g(),o=_("span"),o.textContent="Send recovery link",p(s,"class","content txt-center m-b-sm"),p(f,"class","ri-mail-send-line"),p(o,"class","txt"),p(i,"type","submit"),p(i,"class","btn btn-lg btn-block"),i.disabled=c[1],F(i,"btn-loading",c[1]),p(e,"class","m-b-base")},m(r,$){k(r,e,$),d(e,s),d(e,n),S(l,e,null),d(e,t),d(e,i),d(i,f),d(i,m),d(i,o),a=!0,b||(u=H(e,"submit",I(c[3])),b=!0)},p(r,$){const q={};$&97&&(q.$$scope={dirty:$,ctx:r}),l.$set(q),(!a||$&2)&&(i.disabled=r[1]),(!a||$&2)&&F(i,"btn-loading",r[1])},i(r){a||(w(l.$$.fragment,r),a=!0)},o(r){y(l.$$.fragment,r),a=!1},d(r){r&&v(e),E(l),b=!1,u()}}}function O(c){let e,s,n,l,t,i,f,m,o;return{c(){e=_("div"),s=_("div"),s.innerHTML='<i class="ri-checkbox-circle-line"></i>',n=g(),l=_("div"),t=_("p"),i=h("Check "),f=_("strong"),m=h(c[0]),o=h(" for the recovery link."),p(s,"class","icon"),p(f,"class","txt-nowrap"),p(l,"class","content"),p(e,"class","alert alert-success")},m(a,b){k(a,e,b),d(e,s),d(e,n),d(e,l),d(l,t),d(t,i),d(t,f),d(f,m),d(t,o)},p(a,b){b&1&&J(m,a[0])},i:P,o:P,d(a){a&&v(e)}}}function Q(c){let e,s,n,l,t,i,f,m;return{c(){e=_("label"),s=h("Email"),l=g(),t=_("input"),p(e,"for",n=c[5]),p(t,"type","email"),p(t,"id",i=c[5]),t.required=!0,t.autofocus=!0},m(o,a){k(o,e,a),d(e,s),k(o,l,a),k(o,t,a),L(t,c[0]),t.focus(),f||(m=H(t,"input",c[4]),f=!0)},p(o,a){a&32&&n!==(n=o[5])&&p(e,"for",n),a&32&&i!==(i=o[5])&&p(t,"id",i),a&1&&t.value!==o[0]&&L(t,o[0])},d(o){o&&v(e),o&&v(l),o&&v(t),f=!1,m()}}}function U(c){let e,s,n,l,t,i,f,m;const o=[O,K],a=[];function b(u,r){return u[2]?0:1}return e=b(c),s=a[e]=o[e](c),{c(){s.c(),n=g(),l=_("div"),t=_("a"),t.textContent="Back to login",p(t,"href","/login"),p(t,"class","link-hint"),p(l,"class","content txt-center")},m(u,r){a[e].m(u,r),k(u,n,r),k(u,l,r),d(l,t),i=!0,f||(m=A(B.call(null,t)),f=!0)},p(u,r){let $=e;e=b(u),e===$?a[e].p(u,r):(N(),y(a[$],1,1,()=>{a[$]=null}),D(),s=a[e],s?s.p(u,r):(s=a[e]=o[e](u),s.c()),w(s,1),s.m(n.parentNode,n))},i(u){i||(w(s),i=!0)},o(u){y(s),i=!1},d(u){a[e].d(u),u&&v(n),u&&v(l),f=!1,m()}}}function V(c){let e,s;return e=new z({props:{$$slots:{default:[U]},$$scope:{ctx:c}}}),{c(){R(e.$$.fragment)},m(n,l){S(e,n,l),s=!0},p(n,[l]){const t={};l&71&&(t.$$scope={dirty:l,ctx:n}),e.$set(t)},i(n){s||(w(e.$$.fragment,n),s=!0)},o(n){y(e.$$.fragment,n),s=!1},d(n){E(e,n)}}}function W(c,e,s){let n="",l=!1,t=!1;async function i(){if(!l){s(1,l=!0);try{await C.admins.requestPasswordReset(n),s(2,t=!0)}catch(m){C.error(m)}s(1,l=!1)}}function f(){n=this.value,s(0,n)}return[n,l,t,i,f]}class Y extends M{constructor(e){super(),T(this,e,W,V,j,{})}}export{Y as default};
