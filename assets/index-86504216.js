import{d as j,u as I,r as d,c as _,o as K,a as l,b as u,w as M,v as R,e as T,t as i,f as m,F as b,g,n as V,h as n,i as k}from"./index-79660912.js";import{u as $}from"./words-46377e1a.js";import{_ as F}from"./_plugin-vue_export-helper-c27b6911.js";const N={class:"add-wrap"},U={class:"add-box"},E=["disabled","placeholder","onKeyup"],q=["disabled"],z={key:0,class:"title"},A={class:"interprets"},G={key:1},H={class:"word-list"},J=["onClick"],O=j({__name:"save",setup(P){const p=$(),f=I(),o=d(""),a=d({}),r=d(!1),h=d(null);_(()=>!o.value.length);const x=_(()=>f.params.date||k(new Date,"YYYY-mm-dd")),Y=_(()=>f.params.date||k(new Date,"YYYY-mm-dd")),S=_(()=>(a.value.interpret||"").split(/\r?\n/)),w=d([]),B=()=>{c()},C=async e=>fetch(`https://langeasy.com.cn/loadLexisList.action?strict=1&word=${e}`).then(t=>t.json()).then(t=>t.wordlist[0]||null),W=async e=>fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${e}?key=5995bbce-03fd-4ef5-b686-1b39539ed434`).then(t=>t.json()).then(t=>t[0]&&t[0].hwi&&t[0].hwi.hw?(t[0].hwi.hw||"").replace(/\*/g,"."):""),c=async()=>{var e;await V(),(e=h.value)==null||e.focus()},y=()=>{o.value.length&&L()},D=async e=>{await p.del(e.id),v()},v=async()=>{w.value=await p.get()},L=async()=>{r.value=!0;const e=await C(o.value);if(!e){r.value=!1,a.value={},a.value={syllables:"没有数据"},c();return}const t=await W(o.value);e.date=x.value,e.syllables=t;try{await p.save(e),o.value="",r.value=!1,a.value=e,c(),v()}catch(s){alert(s),o.value="",r.value=!1,a.value={},c(),v()}};return K(()=>{v(),c()}),(e,t)=>(n(),l("div",N,[u("div",U,[M(u("input",{ref_key:"inputRef",ref:h,"onUpdate:modelValue":t[0]||(t[0]=s=>o.value=s),disabled:r.value,placeholder:Y.value,autofocus:!0,type:"text",onBlur:B,onKeyup:T(y,["enter"])},null,40,E),[[R,o.value,void 0,{trim:!0}]]),u("button",{disabled:r.value,onClick:y},"SUBMIT",8,q),a.value.syllables?(n(),l("div",z,i(a.value.syllables),1)):m("",!0),u("div",A,[(n(!0),l(b,null,g(S.value,s=>(n(),l("div",{key:s},i(s),1))),128))]),a.value.uk_pron?(n(),l("div",G,"/"+i(a.value.uk_pron)+"/",1)):m("",!0)]),u("div",H,[(n(!0),l(b,null,g(w.value,s=>(n(),l("div",{key:s.word,title:"点击删除",class:"item",onClick:Q=>D(s)},i(s.word)+" - "+i(s.date),9,J))),128))])]))}});const te=F(O,[["__scopeId","data-v-f335080f"]]);export{te as default};
