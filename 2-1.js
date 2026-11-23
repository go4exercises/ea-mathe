"use strict";
/* ======================= 2.1 Bruchrechnen mit algebraischen Termen ======================= */
const Fn=k=>RF.num(k), Fx=(v='x')=>RF.mono(1,{[v]:1}), Fl=(b,v='x',a=1)=>RF.lin(v,a,b);
const Fs=(p)=>RF.sum(p); // beliebige Summe als Faktor
const ab=(a,b)=>Fs(Poly.v('a').scale(a).add(Poly.v('b').scale(b))); // a ± b
function frT(nL,dL){const n=RF.expT(nL),d=RF.expT(dL);return d==='1'?n:R`\dfrac{${n}}{${d}}`}
function frC(nL,dL){const n=compress(nL),d=compress(dL);return d==='1'?n:R`\dfrac{${unb(n)}}{${unb(d)}}`}
/* äussere Klammer weglassen, wenn der ganze Term eine Klammer ist */
function unb(t){if(t[0]!=='('||t[t.length-1]!==')')return t;let d=0;for(let i=0;i<t.length;i++){if(t[i]==='(')d++;else if(t[i]===')'){d--;if(d===0&&i<t.length-1)return t}}return t.slice(1,-1)}
const sortF=L=>L.slice().sort((a,b)=>{const r=f=>f.p.isConst()?0:f.bin?2:1;return r(a)-r(b)||(a.t<b.t?-1:a.t>b.t?1:0)});

/* ---------------- 1 Kürzen ---------------- */
function kuerzLines(e){if(e.lines)return e.lines;
  const N=e.c.concat(e.n),D=e.c.concat(e.d);const k=e.c.length;
  const col=e.c.map((_,i)=>PAL[i%PAL.length]);const colN=N.map((_,i)=>i<k?col[i]:null),colD=D.map((_,i)=>i<k?col[i]:null);
  const can=N.map((_,i)=>i<k);const canD=D.map((_,i)=>i<k);
  const L=[[frT(N,D)+R`\;=\;?`]];
  L.push([R`\dfrac{${dotList(N)}}{${dotList(D)}}`,'Zähler und Nenner in Faktoren zerlegen']);
  L.push([R`\dfrac{${dotList(N,colN)}}{${dotList(D,colD)}}`,'gleiche Faktoren suchen']);
  L.push([R`\dfrac{${dotList(N,colN,can)}}{${dotList(D,colD,canD)}}`,'gleiche Faktoren kürzen']);
  L.push([frC(e.n,e.d)+R`\qquad ${dSet(D)}`,'Resultat und Definitionsmenge']);
  return L}
const KEX=[
  {name:'12x²y / 18xy³',c:[Fn(2),Fn(3),Fx(),Fx('y')],n:[Fn(2),Fx()],d:[Fn(3),Fx('y'),Fx('y')]},
  {name:'(3x + 6) / (x² + 2x)',c:[Fl(2)],n:[Fn(3)],d:[Fx()]},
  {name:'(x² − 9) / (x² + 3x)',c:[Fl(3)],n:[Fl(-3)],d:[Fx()]},
  {name:'(4a² − 4) / (2a + 2)',c:[Fn(2),Fl(1,'a')],n:[Fn(2),Fl(-1,'a')],d:[]},
  {name:'(x² − 6x + 9) / (2x − 6)',c:[Fl(-3)],n:[Fl(-3)],d:[Fn(2)]},
  {name:'(x² + 5x + 6) / (x² − 4)',c:[Fl(2)],n:[Fl(3)],d:[Fl(-2)]},
  {name:'(2x − 6) / (9 − 3x)  Vorzeichen',lines:[
    [R`\dfrac{2x-6}{9-3x}\;=\;?`],
    [R`\dfrac{2\cdot(x-3)}{3\cdot(3-x)}`,'Zähler und Nenner faktorisieren'],
    [R`\dfrac{2\cdot(x-3)}{-3\cdot(x-3)}`,'im Nenner −1 ausklammern: 3 − x = −(x − 3)'],
    [R`\dfrac{2\cdot{\color{#2f78a8}{\cancel{(x-3)}}}}{-3\cdot{\color{#2f78a8}{\cancel{(x-3)}}}}`,'gleiche Faktoren kürzen'],
    [R`-\dfrac{2}{3}\qquad\mathbb{D}=\mathbb{R}\setminus\{3\}`,'Resultat und Definitionsmenge']]}];
function kuerzRandom(){const t=rnd(1,3);const used=[];const lin=()=>{const f=rLin('x',used.map(u=>u));used.push(f.p.constVal());return f};
  const c=[lin()];if(Math.random()<0.4)c.unshift(Fn(pick([2,3])));const gpos=c[0].p.isConst()?c[0].p.constVal():1;
  let n,d;
  if(t===1){n=[lin()];d=[lin()]}else if(t===2){n=[Fn(pick([2,3,5].filter(k=>k!==gpos)))];d=[Fx()]}else{n=[Fx()];d=[lin()]}
  if(gpos!==1&&t===2){/* Zahlen teilerfremd halten */}
  return{c,n,d}}
const k1=stepBox('k1','k1step','k1all');
$('k1sel').innerHTML=KEX.map((e,i)=>`<option value="${i}">${e.name}</option>`).join('');
$('k1sel').addEventListener('change',()=>k1.set(kuerzLines(KEX[+$('k1sel').value])));
$('k1rnd').addEventListener('click',()=>k1.set(kuerzLines(kuerzRandom())));
k1.set(kuerzLines(KEX[0]));

/* ---------------- 1b Einsetzprobe ---------------- */
(function(){
  const X=Poly.v('x'),c=v=>Poly.c(v);
  const P=[ // [Original Zähler, Nenner, Behauptung Zähler, Nenner, TeX, richtig?, Kommentar]
    [X.add(c(3)),c(3),X,c(1),R`\dfrac{x+3}{3}\overset{?}{=}x`,false,'Falsch. 3 ist im Zähler ein <b>Summand</b>, kein Faktor. Richtig wäre: Der Bruch lässt sich nicht kürzen.'],
    [X.scale(3).add(c(6)),c(3),X.add(c(2)),c(1),R`\dfrac{3x+6}{3}\overset{?}{=}x+2`,true,'Richtig. Nach dem Ausklammern \\(3x+6=3(x+2)\\) ist 3 ein Faktor.'],
    [X.pow(2).sub(c(4)),X.sub(c(2)),X.add(c(2)),c(1),R`\dfrac{x^2-4}{x-2}\overset{?}{=}x+2`,true,'Richtig für alle \\(x\\neq2\\). Für \\(x=2\\) ist der ursprüngliche Bruch nicht definiert. Darum gilt \\(\\mathbb{D}=\\mathbb{R}\\setminus\\{2\\}\\).'],
    [X.add(c(5)),X.add(c(2)),c(5),c(2),R`\dfrac{x+5}{x+2}\overset{?}{=}\dfrac{5}{2}`,false,'Falsch. \\(x\\) ist in Zähler und Nenner nur ein Summand. Man darf nicht kürzen.'],
    [X.pow(2).add(X),X,X.add(c(1)),c(1),R`\dfrac{x^2+x}{x}\overset{?}{=}x+1`,true,'Richtig für alle \\(x\\neq0\\): \\(\\dfrac{x(x+1)}{x}=x+1\\).'],
    [X.scale(2).add(X.pow(2)),X,X.pow(2).add(c(2)),c(1),R`\dfrac{2x+x^2}{x}\overset{?}{=}2+x^2`,false,'Falsch. Man muss <b>jeden</b> Summanden durch \\(x\\) dividieren: \\(\\dfrac{x(2+x)}{x}=2+x\\).']];
  const XS=[-2,-1,0,1,2,3];let cur=0,timer=null;
  $('k2sel').innerHTML=P.map((p,i)=>`<option value="${i}">Behauptung ${i+1}</option>`).join('');
  const val=(N,D,x)=>{const d=polyAt(D,'x',x);if(d===0)return null;return new Q(polyAt(N,'x',x),d)};
  function prep(){if(timer)clearInterval(timer);const p=P[cur];$('k2t').innerHTML=`\\(${p[4]}\\)`;typesetEl($('k2t'));$('k2v').innerHTML='';
    const row=(lab,f)=>`<tr><th style="text-align:left">${lab}</th>${XS.map((x,i)=>`<td data-i="${i}" data-r="${lab}">${f(x,i)}</td>`).join('')}</tr>`;
    $('k2tab').innerHTML=`<tr><th style="text-align:left">\\(x\\)</th>${XS.map(x=>`<th>${mn(x)}</th>`).join('')}</tr>`+row('links',()=>'?')+row('rechts',()=>'?')+row('gleich?',()=>'');typesetEl($('k2tab'))}
  function go(){if(timer)clearInterval(timer);const p=P[cur];let i=0;
    timer=setInterval(()=>{if(i>=XS.length){clearInterval(timer);timer=null;$('k2v').innerHTML=`<div class="verdict ${p[5]?'ja':'nein'}">${p[6]}</div>`;typesetEl($('k2v'));return}
      const x=XS[i];const a=val(p[0],p[1],x),b=val(p[2],p[3],x);const cells=$('k2tab').querySelectorAll(`td[data-i="${i}"]`);
      cells[0].innerHTML=a?a.html():'<span class="hint" style="margin:0">nicht def.</span>';cells[1].innerHTML=b?b.html():'<span class="hint" style="margin:0">nicht def.</span>';
      const eq=a&&b&&a.eq(b);cells[2].innerHTML=!a?'–':eq?'✓':'✗';cells[2].className=!a?'':eq?'gut':'bad';i++},380)}
  $('k2sel').addEventListener('change',()=>{cur=+$('k2sel').value;prep()});$('k2go').addEventListener('click',go);prep();
})();

/* ---------------- 2 ggT und kgV (Mengenbild) ---------------- */
const GEX=[
  {name:'12a²b und 18ab³',ta:'12a^2b',tb:'18ab^3',ca:[Fn(2),Fx('a')],cm:[Fn(2),Fn(3),Fx('a'),Fx('b')],cb:[Fn(3),Fx('b'),Fx('b')]},
  {name:'4x + 8 und x² − 4',ta:'4x+8',tb:'x^2-4',ca:[Fn(2),Fn(2)],cm:[Fl(2)],cb:[Fl(-2)]},
  {name:'x² − x und x² − 1',ta:'x^2-x',tb:'x^2-1',ca:[Fx()],cm:[Fl(-1)],cb:[Fl(1)]},
  {name:'6x + 6 und 9x² − 9',ta:'6x+6',tb:'9x^2-9',ca:[Fn(2)],cm:[Fn(3),Fl(1)],cb:[Fn(3),Fl(-1)]},
  {name:'a² + 2ab + b² und a² − b²',ta:'a^2+2ab+b^2',tb:'a^2-b^2',ca:[ab(1,1)],cm:[ab(1,1)],cb:[ab(1,-1)]}];
function ggtRandom(){if(Math.random()<0.5){const pf=k=>primeFactors(k).map(Fn);const k1=pick([4,6,8,9,10,12,15,18]),k2=pick([6,8,9,12,14,15,20,21].filter(k=>k!==k1));
    const e=[rnd(1,3),rnd(0,2),rnd(1,3),rnd(1,3)];const A=pf(k1).concat(Array(e[0]).fill(0).map(()=>Fx('a')),Array(e[1]).fill(0).map(()=>Fx('b'))),B=pf(k2).concat(Array(e[2]).fill(0).map(()=>Fx('a')),Array(e[3]).fill(0).map(()=>Fx('b')));
    const cm=msInter(A,B);return{name:'',ta:compress(A),tb:compress(B),ca:msMinus(A,cm),cm,cb:msMinus(B,cm)}}
  const p=pick([-4,-3,-2,-1,1,2,3,4]);let q;do{q=pick([-4,-3,-2,-1,1,2,3,4])}while(q===p);const k=pick([2,3,4,5]);
  const A=primeFactors(k).map(Fn).concat([Fl(p)]),B=[Fl(p),Fl(q)];const cm=msInter(A,B);
  return{name:'',ta:RF.expT(A),tb:RF.expT(B),ca:msMinus(A,cm),cm,cb:msMinus(B,cm)}}
(function(){
  const f=new Fig($('f3'),{h:360,s:40,oy:170,grid:false});let E=GEX[0],k=0,st=0,stop=null;
  const CA={x:-1.9,y:-0.3},CB={x:1.9,y:-0.3},RR=3.25;
  const pos=(i,n,x)=>({x,y:-0.3+((n-1)/2-i)*0.62});
  f.draw=()=>{
    if(st>=3){f.circ(CA,RR,{c:'none',f:'#fdeedd'});f.circ(CB,RR,{c:'none',f:'#fdeedd'})}
    if(st===2){const h=Math.sqrt(RR*RR-1.9*1.9);const T=f.S({x:0,y:-0.3+h}),B=f.S({x:0,y:-0.3-h}),r=RR*f.s;f.path(`M${T[0]},${T[1]} A${r},${r} 0 0 1 ${B[0]},${B[1]} A${r},${r} 0 0 1 ${T[0]},${T[1]} Z`,{c:'none',f:'#fdeedd'})}
    f.circ(CA,RR,{c:C.blau,w:2});f.circ(CB,RR,{c:C.gr,w:2});
    svgMath(f,{x:-4.3,y:3.5},'A = '+texPlain(E.ta),{fontSize:'19px',fill:C.blau,anchor:'start'});svgMath(f,{x:4.3,y:3.5},'B = '+texPlain(E.tb),{fontSize:'19px',fill:C.gr,anchor:'end'});
    const t=ease(clamp(k,0,1));
    const put=(L,x,col,from)=>L.forEach((F,i)=>{const p=V.lerp(from,pos(i,L.length,x),t);svgMath(f,p,texPlain(F.t),{fontSize:'19px',fill:col,opacity:k>0?1:0})});
    if(k>0){put(E.ca,-3.4,C.blau,{x:-3.5,y:3.5});put(E.cm,0,C.or,{x:0,y:3.5});put(E.cb,3.4,C.gr,{x:3.5,y:3.5})}
    if(k>0){f.text({x:-3.4,y:-4.2},'nur in A','ann',{fill:C.blau,fontSize:'13px'});f.text({x:0,y:-4.2},'in A und B','ann',{fill:'#a65b12',fontSize:'13px'});f.text({x:3.4,y:-4.2},'nur in B','ann',{fill:C.gr,fontSize:'13px'})}};
  const cap=$('r3');
  function show(){const A=sortF(E.ca.concat(E.cm)),B=sortF(E.cm.concat(E.cb));
    const z=`\\(A=${dotList(A)}\\)<br>\\(B=${dotList(B)}\\)`;
    if(st===0)cap.innerHTML='Wie lauten ggT(A; B) und kgV(A; B)? Klicke auf «Schritt ›».';
    else if(st===1)cap.innerHTML=z;
    else if(st===2)cap.innerHTML=z+`<br>\\(\\text{ggT}(A;\\,B)=${compress(E.cm,{dot:true})}\\)`;
    else cap.innerHTML=z+`<br>\\(\\text{ggT}(A;\\,B)=${compress(E.cm,{dot:true})}\\)<br>\\(\\text{kgV}(A;\\,B)=${compress(sortF(E.ca.concat(E.cm,E.cb)),{dot:true})}\\)`;typesetEl(cap)}
  function load(e){if(stop)stop();E=e;st=0;k=0;f.render();show()}
  $('g3sel').innerHTML=GEX.map((e,i)=>`<option value="${i}">${e.name}</option>`).join('');
  $('g3sel').addEventListener('change',()=>load(GEX[+$('g3sel').value]));$('g3rnd').addEventListener('click',()=>load(ggtRandom()));
  $('g3step').addEventListener('click',()=>{if(st>=3)return;st++;if(st===1){stop=tween(1300,x=>{k=x;f.render()})}else f.render();show()});
  load(GEX[0]);
})();
/* TeX eines einfachen Terms in Klartext für SVG */
function texPlain(t){return t.replace(/\\cdot\s?/g,'·').replace(/\^\{(\d+)\}/g,'^$1').replace(/[{}]/g,'').replace(/\\left|\\right/g,'')}

/* ---------------- 3 Addition und Subtraktion ---------------- */
/* Ein Beispiel: fr = [{s:+1|-1, n:Poly, d:[Faktoren]}], v = Variable */
function addCompute(ex){
  const v=ex.v||'x';const fr=ex.fr;
  const bases=[];fr.forEach(F=>F.d.forEach(f=>{if(!bases.some(b=>b.t===f.t))bases.push(f)}));
  bases.sort((a,b)=>{const r=f=>f.p.isConst()?0:f.bin?2:1;return r(a)-r(b)});
  const cnt=F=>bases.map(b=>F.d.filter(f=>f.t===b.t).length);const C=fr.map(cnt);const mx=bases.map((b,j)=>Math.max(...C.map(c=>c[j])));
  const HN=[];bases.forEach((b,j)=>{for(let i=0;i<mx[j];i++)HN.push(b)});
  const Ef=fr.map((F,i)=>{const L=[];bases.forEach((b,j)=>{for(let q=C[i][j];q<mx[j];q++)L.push(b)});return L});
  const sgn=(s,i)=>s<0?'-':(i?'+':'');
  const nb=p=>p.terms()>1?`(${p.tex()})`:p.tex();
  const lines=[];
  lines.push([fr.map((F,i)=>sgn(F.s,i)+R`\dfrac{${F.n.tex()}}{${RF.expT(F.d)}}`).join('')+R`\;=\;?`]);
  lines.push([fr.map((F,i)=>sgn(F.s,i)+R`\dfrac{${F.n.tex()}}{${unb(compress(F.d))}}`).join(''),'Nenner faktorisieren']);
  if(lines[1][0]===lines[0][0].replace(/\\;=\\;\?$/,''))lines.splice(1,1);
  const hn=compress(HN);
  const prodT=(n,e,col)=>{const E=col?colT('#2f8f5f',e):e;if(e==='1')return nb(n);if(n.isConst()&&n.constVal()===1)return E;
    if(n.isConst())return /^\d/.test(e)?R`${n.tex()}\cdot ${E}`:n.tex()+E;return /^\d/.test(e)?E+nb(n):nb(n)+E};
  lines.push([fr.map((F,i)=>{const e=compress(Ef[i]);return sgn(F.s,i)+R`\dfrac{${prodT(F.n,e,true)}}{${unb(hn)}}`}).join(''),'mit den fehlenden Faktoren erweitern (grüne Spalte)']);
  const num=fr.map((F,i)=>sgn(F.s,i)+prodT(F.n,compress(Ef[i]),false)).join('');
  lines.push([R`\dfrac{${num}}{${unb(hn)}}`,fr.some(F=>F.s<0)?'auf einen Bruchstrich; Minus: ganzen Zähler einklammern':'auf einen Bruchstrich']);
  const prods=fr.map((F,i)=>F.n.mul(RF.prodP(Ef[i])));
  const ex1=prods.map((p,i)=>{const s=fr[i].s;if(s<0)return p.terms()>1?`-(${p.tex()})`:(p.tex()[0]==='-'?'+'+p.tex().slice(1):'-'+p.tex());return(i&&p.tex()[0]!=='-'?'+':'')+p.tex()}).join('');
  lines.push([R`\dfrac{${ex1}}{${unb(hn)}}`,'ausmultiplizieren']);
  let Nn=prods.reduce((a,p,i)=>fr[i].s<0?a.sub(p):a.add(p),Poly.c(0));
  lines.push([R`\dfrac{${Nn.tex()}}{${unb(hn)}}`,'Zähler zusammenfassen']);
  /* Kürzen prüfen */
  let rest=HN.slice(),gone=[];const single=coeffs(Nn,v);
  if(single&&Nn.terms()>0){for(const f of HN){if(f.p.isConst()||!rest.includes(f))continue;
      const a=coeffs(f.p,v);if(!a||a.length!==2)continue;const r=-a[0]/a[1];
      if(Math.abs(polyAt(Nn,v,r))<1e-9){const d=divLin(Nn,v,r);Nn=d.q.scale(1/a[1]);gone.push(f);rest.splice(rest.indexOf(f),1)}}
    const cN=Nn.content(),cD=rest.filter(f=>f.p.isConst()).reduce((s,f)=>s*f.p.constVal(),1);const g=gcd(cN,cD);
    if(g>1&&[...Nn.m.values()].every(Number.isInteger)){let gg=g;for(const p of primeFactors(g)){const i=rest.findIndex(f=>f.p.isConst()&&f.p.constVal()===p);if(i>=0){gone.push(rest[i]);rest.splice(i,1)}}Nn=Nn.scale(1/g)}}
  let N0=Nn,D0=RF.prodP(rest);
  if(gone.length){const gT=gone.map(f=>colT('#c0463f',R`\cancel{${f.t}}`)).join(R`\cdot `);
    const nT=(Nn.isConst()&&Nn.constVal()===1)?gT:Nn.isConst()?R`${Nn.tex()}\cdot ${gT}`:R`${gT}\cdot ${Nn.terms()>1?`(${Nn.tex()})`:Nn.tex()}`;
    const restT=compress(rest);
    lines.push([R`\dfrac{${nT}}{${gT}${restT==='1'?'':R`\cdot ${restT}`}}`,'Zähler faktorisieren und kürzen']);
    lines.push([restT==='1'?Nn.tex():R`\dfrac{${Nn.tex()}}{${unb(restT)}}`,'Resultat']);}
  for(let i=lines.length-1;i>1;i--)if(lines[i][0]===lines[i-1][0])lines.splice(i,1);
  lines[lines.length-1][0]+=R`\qquad ${dSet(HN)}`;
  if(!gone.length)lines[lines.length-1][1]+=' (kein gemeinsamer Faktor: fertig)';
  return{lines,bases,C,mx,Ef,HN,N0,D0}}
function hnTable(r,ex){const head=`<tr><th>Nenner</th>${r.bases.map(b=>`<th>\\(${b.t}\\)</th>`).join('')}<th class="e">Erweiterung</th></tr>`;
  const cell=(b,n)=>n===0?'<td class="leer">–</td>':`<td>\\(${n>1?(b.bin?`${b.t}^{${n}}`:`${b.t}^{${n}}`):b.t}\\)</td>`;
  const rows=ex.fr.map((F,i)=>`<tr><td>\\(${compress(F.d,{dot:true})}\\)</td>${r.bases.map((b,j)=>cell(b,r.C[i][j])).join('')}<td class="e">\\(${compress(r.Ef[i],{dot:true})}\\)</td></tr>`).join('');
  return`<table class="hn">${head}${rows}<tr class="hnr"><td>HN</td>${r.bases.map((b,j)=>cell(b,r.mx[j])).join('')}<td>\\(${compress(r.HN,{dot:true})}\\)</td></tr></table>`}
const X1=Poly.v('x'),cP=v=>Poly.c(v);
const AEX=[
  {name:'3/(4x) + 5/(6x²)',fr:[{s:1,n:cP(3),d:[Fn(2),Fn(2),Fx()]},{s:1,n:cP(5),d:[Fn(2),Fn(3),Fx(),Fx()]}]},
  {name:'x/(x + 2) + 3/(x − 2)',fr:[{s:1,n:X1,d:[Fl(2)]},{s:1,n:cP(3),d:[Fl(-2)]}]},
  {name:'2/(x − 1) − (x + 1)/(x² − 1)',fr:[{s:1,n:cP(2),d:[Fl(-1)]},{s:-1,n:X1.add(cP(1)),d:[Fl(1),Fl(-1)]}]},
  {name:'a/(a − b) − b/(a + b)',v:'a',fr:[{s:1,n:Poly.v('a'),d:[ab(1,-1)]},{s:-1,n:Poly.v('b'),d:[ab(1,1)]}]},
  {name:'5/(2x + 4) − 1/x + 2/(x² + 2x)',fr:[{s:1,n:cP(5),d:[Fn(2),Fl(2)]},{s:-1,n:cP(1),d:[Fx()]},{s:1,n:cP(2),d:[Fx(),Fl(2)]}]}];
function addRandom(){const t=rnd(1,3);const p=pick([-5,-4,-3,-2,-1,1,2,3,4,5]);let q;do{q=pick([-5,-4,-3,-2,-1,1,2,3,4,5])}while(q===p);const a=rnd(1,5),b=rnd(1,5),s=pick([1,-1]);
  if(t===1)return{fr:[{s:1,n:cP(a),d:[Fl(p)]},{s,n:cP(b),d:[Fl(q)]}]};
  if(t===2){const k=pick([2,3]);let a=pick([1,2,4,5].filter(z=>z%k!==0));return{fr:[{s:1,n:cP(a),d:primeFactors(k).map(Fn).concat([Fx()])},{s,n:cP(b),d:[Fx(),Fx()]}]}}
  return{fr:[{s:1,n:X1,d:[Fl(p)]},{s,n:cP(b),d:[Fl(p),Fl(q)]}]}}
(function(){const sb=stepBox('a4','a4step','a4all');let ex,res;
  function load(e){ex=e;res=addCompute(e);$('a4tabw').innerHTML='';const ix=res.lines.findIndex(l=>/erweitern/.test(l[1]||''));sb.set(res.lines,{onStep:n=>{if(n>=ix&&!$('a4tabw').innerHTML){$('a4tabw').innerHTML=hnTable(res,ex);typesetEl($('a4tabw'))}}})}
  $('a4sel').innerHTML=AEX.map((e,i)=>`<option value="${i}">${e.name}</option>`).join('');
  $('a4sel').addEventListener('change',()=>load(AEX[+$('a4sel').value]));$('a4rnd').addEventListener('click',()=>load(addRandom()));load(AEX[0]);
})();

/* ---------------- 4 Multiplikation und Division ---------------- */
function mdCompute(e){
  const eT=L=>RF.expT(L),one=(n,d)=>{const nn=eT(n),dd=eT(d);return dd==='1'?(d.length?nn:`(${nn})`):R`\dfrac{${nn}}{${dd}}`};
  const op=e.op===':'?':':R`\cdot`;const lines=[[R`${one(e.A.n,e.A.d)}\;${op}\;${e.B.d.length||e.op!==':'?one(e.B.n,e.B.d):`(${eT(e.B.n)})`}\;=\;?`]];
  let Bn=e.B.n,Bd=e.B.d;
  if(e.op===':'){Bn=e.B.d;Bd=e.B.n;const kw=Bd.length?R`\dfrac{${eT(Bn)}}{${eT(Bd)}}`:eT(Bn);
    lines.push([R`${one(e.A.n,e.A.d)}\cdot\class{mj-kipp}{${colT('#d9822b',Bn.length?kw:R`\dfrac{1}{${eT(Bd)}}`)}}`,'mit dem Kehrwert multiplizieren'])}
  const N=e.A.n.concat(Bn),D=e.A.d.concat(Bd);
  lines.push([R`\dfrac{${dotList(N)}}{${dotList(D)}}`,'auf einen Bruchstrich, alles in Faktoren zerlegt']);
  const used=new Array(D.length).fill(false);const cn=N.map(()=>null),cd=D.map(()=>null);let ci=0;
  N.forEach((f,i)=>{const j=D.findIndex((g,k)=>!used[k]&&g.t===f.t);if(j>=0){used[j]=true;cn[i]=cd[j]=PAL[ci++%PAL.length]}});
  lines.push([R`\dfrac{${dotList(N,cn)}}{${dotList(D,cd)}}`,'gleiche Faktoren suchen']);
  lines.push([R`\dfrac{${dotList(N,cn,cn.map(Boolean))}}{${dotList(D,cd,cd.map(Boolean))}}`,'kürzen']);
  const rn=N.filter((_,i)=>!cn[i]),rd=D.filter((_,i)=>!cd[i]);
  lines.push([frC(sortF(rn),sortF(rd))+R`\qquad ${dSet(e.A.d.concat(e.B.d,e.op===':'?e.B.n:[]))}`,'Resultat']);
  return{lines,N0:RF.prodP(rn),D0:RF.prodP(rd)}}
const MEX=[
  {name:'3a/(4b) · 8b²/(9a²)',op:'·',A:{n:[Fn(3),Fx('a')],d:[Fn(2),Fn(2),Fx('b')]},B:{n:[Fn(2),Fn(2),Fn(2),Fx('b'),Fx('b')],d:[Fn(3),Fn(3),Fx('a'),Fx('a')]}},
  {name:'(x² − 4)/(3x) · 6x²/(x + 2)',op:'·',A:{n:[Fl(2),Fl(-2)],d:[Fn(3),Fx()]},B:{n:[Fn(2),Fn(3),Fx(),Fx()],d:[Fl(2)]}},
  {name:'(x² + 2x + 1)/(x² − 1) · (x − 1)/(2x + 2)',op:'·',A:{n:[Fl(1),Fl(1)],d:[Fl(1),Fl(-1)]},B:{n:[Fl(-1)],d:[Fn(2),Fl(1)]}},
  {name:'(a² − b²)/(4a) : (a + b)/(2a²)',op:':',A:{n:[ab(1,1),ab(1,-1)],d:[Fn(2),Fn(2),Fx('a')]},B:{n:[ab(1,1)],d:[Fn(2),Fx('a'),Fx('a')]}},
  {name:'(5x − 10)/x² : (x − 2)/(3x)',op:':',A:{n:[Fn(5),Fl(-2)],d:[Fx(),Fx()]},B:{n:[Fl(-2)],d:[Fn(3),Fx()]}},
  {name:'(x² − 9)/(x + 1) : (x + 3)',op:':',A:{n:[Fl(3),Fl(-3)],d:[Fl(1)]},B:{n:[Fl(3)],d:[]}}];
function mdRandom(){const used=[];const lin=()=>{const f=rLin('x',used);used.push(f.p.constVal());return f};
  const c1=lin(),c2=lin(),r1=lin(),r2=lin();const k=pick([2,3,5]);const op=pick(['·',':']);
  if(op==='·')return{op,A:{n:[c1,r1],d:[Fn(k),c2]},B:{n:[Fn(k),Fx(),c2],d:[c1,Fx(),r2]}};
  return{op,A:{n:[c1,r1],d:[Fn(k),Fx()]},B:{n:[c1,c2],d:[Fn(k),Fx(),Fx()]}}}
(function(){const sb=stepBox('m5','m5step','m5all');
  $('m5sel').innerHTML=MEX.map((e,i)=>`<option value="${i}">${e.name}</option>`).join('');
  const load=e=>sb.set(mdCompute(e).lines);
  $('m5sel').addEventListener('change',()=>load(MEX[+$('m5sel').value]));$('m5rnd').addEventListener('click',()=>load(mdRandom()));load(MEX[0]);
})();

/* ---------------- 5 Doppelbrüche ---------------- */
const DEX=[
  {name:'(1/2 + 1/3) / (1/4)',a:R`\dfrac{\frac12+\frac13}{\frac14}`,
    m1:[[R`\dfrac{\frac{3}{6}+\frac{2}{6}}{\frac14}=\dfrac{\;\dfrac56\;}{\;\dfrac14\;}`,'Zähler zu einem Bruch zusammenfassen'],[R`\dfrac56:\dfrac14`,'Hauptbruchstrich = geteilt durch'],[R`\dfrac56\cdot\dfrac41=\dfrac{20}{6}`,'mit dem Kehrwert multiplizieren'],[R`\dfrac{10}{3}`,'kürzen']],
    m2:[[R`\dfrac{\left(\frac12+\frac13\right)\cdot\color{#2f8f5f}{12}}{\frac14\cdot\color{#2f8f5f}{12}}`,'mit dem Hauptnenner 12 aller Teilbrüche erweitern'],[R`\dfrac{6+4}{3}`,'jeder Teilbruch wird zu einer ganzen Zahl'],[R`\dfrac{10}{3}`,'zusammenfassen']]},
  {name:'(a/b) / (a²/b³)',a:R`\dfrac{\frac{a}{b}}{\frac{a^2}{b^3}}`,
    m1:[[R`\dfrac{a}{b}:\dfrac{a^2}{b^3}`,'Hauptbruchstrich = geteilt durch'],[R`\dfrac{a}{b}\cdot\dfrac{b^3}{a^2}`,'mit dem Kehrwert multiplizieren'],[R`\dfrac{a\cdot b\cdot b\cdot b}{b\cdot a\cdot a}=\dfrac{b^2}{a}`,'kürzen']],
    m2:[[R`\dfrac{\frac{a}{b}\cdot\color{#2f8f5f}{b^3}}{\frac{a^2}{b^3}\cdot\color{#2f8f5f}{b^3}}`,'mit dem Hauptnenner b³ erweitern'],[R`\dfrac{ab^2}{a^2}`,'die kleinen Nenner verschwinden'],[R`\dfrac{b^2}{a}`,'kürzen']]},
  {name:'(1 + 1/x) / (1 − 1/x²)',a:R`\dfrac{1+\frac1x}{1-\frac{1}{x^2}}`,
    m1:[[R`\dfrac{\;\dfrac{x+1}{x}\;}{\;\dfrac{x^2-1}{x^2}\;}`,'Zähler und Nenner je zu einem Bruch'],[R`\dfrac{x+1}{x}\cdot\dfrac{x^2}{x^2-1}`,'mit dem Kehrwert multiplizieren'],[R`\dfrac{(x+1)\cdot x\cdot x}{x\cdot(x+1)(x-1)}`,'faktorisieren'],[R`\dfrac{x}{x-1}`,'kürzen']],
    m2:[[R`\dfrac{\left(1+\frac1x\right)\cdot\color{#2f8f5f}{x^2}}{\left(1-\frac{1}{x^2}\right)\cdot\color{#2f8f5f}{x^2}}`,'mit dem Hauptnenner x² erweitern'],[R`\dfrac{x^2+x}{x^2-1}`,'ausmultiplizieren'],[R`\dfrac{x(x+1)}{(x+1)(x-1)}=\dfrac{x}{x-1}`,'faktorisieren und kürzen']]},
  {name:'(x/y − y/x) / (1/x + 1/y)',a:R`\dfrac{\frac{x}{y}-\frac{y}{x}}{\frac1x+\frac1y}`,
    m1:[[R`\dfrac{\;\dfrac{x^2-y^2}{xy}\;}{\;\dfrac{y+x}{xy}\;}`,'Zähler und Nenner je zu einem Bruch (HN xy)'],[R`\dfrac{x^2-y^2}{xy}\cdot\dfrac{xy}{x+y}`,'mit dem Kehrwert multiplizieren'],[R`\dfrac{(x+y)(x-y)\cdot xy}{xy\cdot(x+y)}`,'faktorisieren'],[R`x-y`,'kürzen']],
    m2:[[R`\dfrac{\left(\frac{x}{y}-\frac{y}{x}\right)\cdot\color{#2f8f5f}{xy}}{\left(\frac1x+\frac1y\right)\cdot\color{#2f8f5f}{xy}}`,'mit dem Hauptnenner xy erweitern'],[R`\dfrac{x^2-y^2}{y+x}`,'ausmultiplizieren'],[R`\dfrac{(x+y)(x-y)}{x+y}=x-y`,'faktorisieren und kürzen']]},
  {name:'(2/(x + 1)) / (4/(x² − 1))',a:R`\dfrac{\frac{2}{x+1}}{\frac{4}{x^2-1}}`,
    m1:[[R`\dfrac{2}{x+1}:\dfrac{4}{x^2-1}`,'Hauptbruchstrich = geteilt durch'],[R`\dfrac{2}{x+1}\cdot\dfrac{(x+1)(x-1)}{4}`,'Kehrwert, Nenner faktorisiert'],[R`\dfrac{x-1}{2}`,'kürzen']],
    m2:[[R`\dfrac{\frac{2}{x+1}\cdot\color{#2f8f5f}{(x+1)(x-1)}}{\frac{4}{(x+1)(x-1)}\cdot\color{#2f8f5f}{(x+1)(x-1)}}`,'mit dem Hauptnenner (x + 1)(x − 1) erweitern'],[R`\dfrac{2(x-1)}{4}`,'die kleinen Nenner verschwinden'],[R`\dfrac{x-1}{2}`,'kürzen']]}];
(function(){const sb=stepBox('d6','d6step','d6all');let m=1;
  const load=()=>{const e=DEX[+$('d6sel').value];sb.set([[e.a+R`\;=\;?`]].concat(e['m'+m]))};
  $('d6sel').innerHTML=DEX.map((e,i)=>`<option value="${i}">${e.name}</option>`).join('');$('d6sel').addEventListener('change',load);
  btnGroup('#doppel [data-m]','m',v=>{m=+v;load()});load();
})();

/* ---------------- 6 Trainer ---------------- */
const solHTML=lines=>lines.map((l,i)=>`<p>\\(${i?'=':''}${l[0].replace(/\\;=\\;\?$/,'').replace(/\\class\{mj-kipp\}/g,'')}\\)${l[1]?` <span class="hint" style="margin:0">← ${l[1]}</span>`:''}</p>`).join('');
const PH='z. B. (x+2)/(x-3)';
runTrainer({
  kuerzen:{label:'Kürzen',gen(){const e=kuerzRandom();const L=kuerzLines(e);return{q:`Kürze vollständig: \\(${L[0][0].replace(/\\;=\\;\?$/,'')}\\)`,ph:PH,
    check:s=>checkRat(s,RF.prodP(e.n),RF.prodP(e.d)),sol:solHTML(L)}}},
  ggt:{label:'ggT und kgV',gen(){const e=ggtRandom();const w=pick(['ggT','kgV']);const P=w==='ggT'?RF.prodP(e.cm):RF.prodP(e.ca.concat(e.cm,e.cb));
    const A=sortF(e.ca.concat(e.cm)),B=sortF(e.cm.concat(e.cb));
    return{q:`Bestimme den ${w} von \\(${e.ta}\\) und \\(${e.tb}\\).`,ziel:w+' =',ph:'z. B. 6ab oder 3(x+1)',check:s=>checkPolyPM(s,P),
      sol:`<p>\\(${e.ta}=${dotList(A)}\\)</p><p>\\(${e.tb}=${dotList(B)}\\)</p><p>\\(\\text{ggT}=${compress(e.cm,{dot:true})}\\), \\(\\text{kgV}=${compress(sortF(e.ca.concat(e.cm,e.cb)),{dot:true})}\\)</p>`}}},
  addsub:{label:'Addieren und Subtrahieren',gen(){const e=addRandom();const r=addCompute(e);return{q:`Berechne und kürze: \\(${r.lines[0][0].replace(/\\;=\\;\?$/,'')}\\)`,ph:PH,check:s=>checkRat(s,r.N0,r.D0),sol:solHTML(r.lines)}}},
  muldiv:{label:'Multiplizieren und Dividieren',gen(){const e=mdRandom();const r=mdCompute(e);return{q:`Berechne und kürze: \\(${r.lines[0][0].replace(/\\;=\\;\?$/,'')}\\)`,ph:PH,check:s=>checkRat(s,r.N0,r.D0),sol:solHTML(r.lines)}}},
  doppel:{label:'Doppelbrüche',gen(){const t=rnd(1,3);const X=Poly.v('x');
    if(t===1){const p=rnd(1,5);return{q:`Vereinfache: \\(\\dfrac{1+\\frac{${p}}{x}}{1-\\frac{${p*p}}{x^2}}\\)`,ph:PH,check:s=>checkRat(s,X,X.sub(Poly.c(p))),
      sol:`<p>mit \\(x^2\\) erweitern: \\(\\dfrac{x^2+${p}x}{x^2-${p*p}}=\\dfrac{x(x+${p})}{(x+${p})(x-${p})}=\\dfrac{x}{x-${p}}\\)</p>`}}
    if(t===2){const k=pick([2,3,4,6,8,9,10]),m=pick([3,4,6,9,12,15].filter(z=>z!==k));const g=gcd(k,m);return{q:`Vereinfache: \\(\\dfrac{\\frac{${k}}{x}}{\\frac{${m}}{x^2}}\\)`,ph:PH,check:s=>checkRat(s,X.scale(k/g),Poly.c(m/g)),
      sol:`<p>\\(\\dfrac{${k}}{x}\\cdot\\dfrac{x^2}{${m}}=\\dfrac{${k}x}{${m}}${g>1?`=\\dfrac{${k/g}x}{${m/g}}`:''}\\)</p>`}}
    const p=rnd(1,5);return{q:`Vereinfache: \\(\\dfrac{x-\\frac{${p*p}}{x}}{1+\\frac{${p}}{x}}\\)`,ph:PH,check:s=>checkRat(s,X.sub(Poly.c(p)),Poly.c(1)),
      sol:`<p>mit \\(x\\) erweitern: \\(\\dfrac{x^2-${p*p}}{x+${p}}=\\dfrac{(x+${p})(x-${p})}{x+${p}}=x-${p}\\)</p>`}}}
});
runQuiz(['21']);
