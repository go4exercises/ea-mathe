"use strict";
/* ======================= Hilfen für Unterrichtsblock 2 ======================= */
const $=id=>document.getElementById(id);
const R=String.raw;
const PAL=['#2f78a8','#d9822b','#2f8f5f','#7457ad','#c0463f','#b0802a'];
const colT=(c,t)=>R`{\color{${c}}{${t}}}`;
/* Schrittfolge: lines = [[TeX, Begründung, opts]]; die erste Zeile ist die Aufgabe */
function stepBox(boxId,stepId,allId){
  const box=$(boxId);let n=0,cb=null;
  const api={
    set(lines,o={}){n=0;cb=o.onStep||null;box.innerHTML=lines.map((l,i)=>{const tex=l[0],why=l[1],op=l[2]||{};
      const pre=i===0||o.noEq||op.noEq?'':'=';const cls='sl'+(i===0?' on aufg':'')+(op.cls?' '+op.cls:'');
      return`<div class="${cls}"><span>${op.html?tex:`\\(${pre}${tex}\\)`}</span>${why?`<span class="why">← ${why}</span>`:''}</div>`}).join('');typesetEl(box)},
    step(){const ls=box.querySelectorAll('.sl');if(n<ls.length-1){n++;ls[n].classList.add('on');if(cb)cb(n)}},
    all(){const ls=box.querySelectorAll('.sl');ls.forEach(l=>l.classList.add('on'));n=ls.length-1;if(cb)cb(n)},
    get n(){return n}};
  if(stepId)$(stepId).addEventListener('click',()=>api.step());
  if(allId)$(allId).addEventListener('click',()=>api.all());
  return api}
/* SVG-Text mit kursiven Variablen */
function svgMath(f,p,str,st={}){const[x,y]=f.S(p);const t=mk('text',{x,y,'text-anchor':st.anchor||'middle','dominant-baseline':'central',class:'lbl'},f.g);
  t.style.fontStyle='normal';if(st.fontSize)t.style.fontSize=st.fontSize;if(st.fill)t.style.fill=st.fill;if(st.fontWeight)t.style.fontWeight=st.fontWeight;if(st.opacity!=null)t.setAttribute('opacity',st.opacity);
  const parts=String(str).replace(/-/g,'−').match(/\^\d+|[a-zA-Z]+|[^a-zA-Z^]+/g)||[];
  for(const q of parts){if(q[0]==='^'){const s=mk('tspan',{dy:'-0.45em','font-size':'0.7em'},t);s.textContent=q.slice(1);const z=mk('tspan',{dy:'0.45em'},t);z.textContent='\u200a'}
    else{const s=mk('tspan',null,t);s.textContent=q;if(/[a-zA-Z]/.test(q))s.style.fontStyle='italic'}}
  return t}
/* Multimengen von Faktoren (Faktor = {p,t}) */
function msInter(A,B){const b=B.slice(),r=[];for(const f of A){const i=b.findIndex(g=>g.t===f.t);if(i>=0){r.push(f);b.splice(i,1)}}return r}
function msMinus(A,B){const a=A.slice();for(const f of B){const i=a.findIndex(g=>g.t===f.t);if(i>=0)a.splice(i,1)}return a}
/* Faktorliste kompakt als TeX: Zahlen multiplizieren, gleiche Faktoren als Potenz */
function compress(L,o={}){let c=1;const m=new Map();
  for(const f of L){if(f.p.isConst()){c*=f.p.constVal();continue}const k=f.t;if(!m.has(k))m.set(k,{f,n:0});m.get(k).n++}
  const mono=[...m.values()].filter(x=>!x.f.bin).sort((a,b)=>a.f.t<b.f.t?-1:1),bin=[...m.values()].filter(x=>x.f.bin);
  const pw=(x)=>x.n>1?(x.f.bin?`${x.f.t}^{${x.n}}`:`${x.f.t}^{${x.n}}`):x.f.t;
  let body=mono.map(pw).join('')+bin.map(pw).join('');
  if(!body)return String(c);
  if(c===-1)return'-'+body;if(c===1)return body;return String(c)+(o.dot&&bin.length&&!mono.length?R`\cdot `:'')+body}
/* Faktoren als Produkt mit Malpunkten (für Zerlegungen) */
function dotList(L,col,cancel){if(!L.length)return'1';return L.map((f,i)=>{let t=f.t;const c=col&&col[i];if(c&&cancel&&cancel[i])return R`{\color{${c}}{\cancel{${t}}}}`;if(c)return colT(c,t);return t}).join(R`\cdot `)}
/* Nullstellen der Nenner: Definitionsmenge */
function dSet(L){const ex=new Map();const other=[];
  for(const f of L){if(f.p.isConst())continue;const vars=new Set();for(const k of f.p.m.keys())Object.keys(Poly.parseKey(k)).forEach(v=>vars.add(v));
    if(vars.size===1&&f.p.deg()===1){const v=[...vars][0];const a=f.p.m.get(v+'^1')||0,b=f.p.constVal();const r=-b/a;if(!ex.has(v))ex.set(v,new Set());ex.get(v).add(r)}
    else if(vars.size===1&&f.p.terms()===1){const v=[...vars][0];if(!ex.has(v))ex.set(v,new Set());ex.get(v).add(0)}
    else other.push(R`${f.p.tex()}\neq0`)}
  const parts=[];
  if(ex.size===1&&!other.length){const [v,set]=[...ex][0];const s=[...set].sort((a,b)=>a-b).map(x=>Number.isInteger(x)?x:new Q(Math.round(x*6),6).tex().replace('\\dfrac','\\tfrac')).join(R`;\,`);
    return R`\mathbb{D}=\mathbb{R}\setminus\{${s}\}`}
  for(const [v,set] of ex)for(const r of [...set].sort((a,b)=>a-b))parts.push(R`${v}\neq${r}`);
  return parts.concat(other).join(R`,\;`)}
/* Polynom in einer Variablen: Koeffizientenliste [a0,a1,...] */
function coeffs(P,v){const a=[];for(const [k,c] of P.m){const o=Poly.parseKey(k);const e=o[v]||0;if(Object.keys(o).some(n=>n!==v))return null;a[e]=(a[e]||0)+c}for(let i=0;i<a.length;i++)a[i]=a[i]||0;return a}
function fromCoeffs(a,v){let p=Poly.c(0);a.forEach((c,e)=>{if(c)p=p.add(Poly.v(v,e).scale(c))});return p}
function polyAt(P,v,x){const a=coeffs(P,v);if(!a)return NaN;return a.reduce((s,c,e)=>s+c*Math.pow(x,e),0)}
function divLin(P,v,r){const a=coeffs(P,v);const n=a.length-1;const q=[];let rem=0;for(let i=n;i>=0;i--){rem=rem*r+a[i];if(i>0)q[i-1]=rem}return{q:fromCoeffs(q,v),rem}}
