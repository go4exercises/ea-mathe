"use strict";
/* ======================= 2.2 Gleichungen ======================= */
const Xp=Poly.v('x'),Cp=v=>Poly.c(v);
const lin=(a,b)=>Xp.scale(a).add(Cp(b));
const fmtN=v=>{if(Number.isInteger(v))return String(v);const q=fracOf(v);return q?q.tex():String(Number(v.toFixed(4)))};
function fracOf(v){for(let d=2;d<=60;d++){const n=Math.round(v*d);if(Math.abs(n/d-v)<1e-9)return new Q(n,d)}return null}
const dec=v=>Number.isInteger(v)?String(v):String(Number(v.toFixed(4)));
/* Umformungsnotiz, z. B. op('-',3,'x') -> "| −3x" */
function opT(sign,v,unit=''){if(sign==='-'||sign==='+'){const neg=(sign==='-')!==(v<0);const a=Math.abs(v);return R`\big|\;${neg?'-':'+'}${a===1&&unit?'':a}${unit}`}
  return R`\big|\;${sign==='*'?R`\cdot`:':'}${v<0?`(${v})`:v}${unit}`}
/* Gleichung ax+b = cx+d schrittweise lösen (Zeilen mit Umformung) */
function linSolve(a,b,c,d,pre){const L=pre.slice();const addOp=op=>{L[L.length-1][0]+=R`\qquad ${op}`};
  const row=(P,Q,why)=>L.push([R`${P.tex()}=${Q.tex()}`,why||'']);
  if(c!==0){addOp(opT('-',c,'x'));row(lin(a-c,b),Cp(d),'x-Terme auf die linke Seite')}
  const A=a-c;
  if(A===0){const ok=b===d;L.push([R`${b}=${d}`,ok?'wahre Aussage':'falsche Aussage']);L.push([ok?R`\mathbb{L}=\mathbb{R}`:R`\mathbb{L}=\{\,\}`,ok?'jede Zahl ist Lösung':'keine Zahl ist Lösung']);return{L,sol:ok?'R':null}}
  if(b!==0){addOp(opT('-',b));row(lin(A,0),Cp(d-b),'Zahlen auf die rechte Seite')}
  const s=(d-b)/A;
  if(A!==1){addOp(opT(':',A));L.push([R`x=${fmtN(s)}`,`durch ${A} dividieren`])}
  return{L,sol:s}}
const probe=(f,s,lt,rt)=>[R`\text{Probe: }${lt}=${fmtN(f[0](s))},\;\;${rt}=${fmtN(f[1](s))}\;\checkmark`,'',{}];

/* ---------------- 1 Waage ---------------- */
(function(){
  const f=new Fig($('f1'),{h:380,s:40,oy:150,grid:false});const XV=3;
  const PRE=[
    {name:'3x + 2 = x + 8',s:{Lx:3,Lc:2,Rx:1,Rc:8},ops:[{x:1},{c:2},{k:2}]},
    {name:'2x + 5 = 11',s:{Lx:2,Lc:5,Rx:0,Rc:11},ops:[{c:5},{k:2}]},
    {name:'4x + 1 = 2x + 7',s:{Lx:4,Lc:1,Rx:2,Rc:7},ops:[{x:2},{c:1},{k:2}]},
    {name:'5x + 3 = 2x + 12',s:{Lx:5,Lc:3,Rx:2,Rc:12},ops:[{x:2},{c:3},{k:3}]}];
  let P,S,i,leaving=[],lt=0,tilt=0,busy=false,log=[],msg='';
  const side=(x,c)=>{const t=[];if(x)t.push((x===1?'':x)+'x');if(c||!x)t.push(String(c));return t.join(' + ')};
  const sideT=(x,c)=>{const t=[];if(x)t.push((x===1?'':x)+'x');if(c||!x)t.push(String(c));return t.join('+')};
  function items(x,c){const it=[];for(let j=0;j<x;j++)it.push({t:'x',j});for(let j=0;j<c;j++)it.push({t:'c',j});return it}
  function layout(it){const xs=it.filter(o=>o.t==='x'),cs=it.filter(o=>o.t==='c');const out=[];
    xs.forEach((o,j)=>out.push({o,dx:(j-(xs.length-1)/2)*0.88,b:0.08,w:0.78,h:0.78}));
    const per=7,b0=xs.length?0.98:0.08;cs.forEach((o,j)=>{const r=Math.floor(j/per),n=Math.min(per,cs.length-r*per),q=j%per;out.push({o,dx:(q-(n-1)/2)*0.54,b:b0+r*0.54,w:0.46,h:0.46})});return out}
  const isLeaving=(sd,o)=>leaving.some(l=>l.sd===sd&&l.t===o.t&&o.j>=l.from);
  f.draw=()=>{const piv={x:0,y:1.3};const Lb=V.rot({x:-5,y:1.3},piv,-tilt),Rb=V.rot({x:5,y:1.3},piv,-tilt);
    f.poly([{x:-0.9,y:-4.9},{x:0.9,y:-4.9},{x:0.25,y:1.1},{x:-0.25,y:1.1}],{c:'#8a99a6',f:'#dde5eb',w:1.5});
    f.seg({x:-2.2,y:-4.9},{x:2.2,y:-4.9},{c:'#8a99a6',w:4});
    f.seg(Lb,Rb,{c:C.ink,w:5});f.dot(piv,5,C.ink);
    for(const [sd,E,x,c] of [['L',Lb,S.Lx,S.Lc],['R',Rb,S.Rx,S.Rc]]){const pan={x:E.x,y:E.y-2.8};
      f.seg(E,{x:pan.x-2,y:pan.y},{c:'#8a99a6',w:1.2});f.seg(E,{x:pan.x+2,y:pan.y},{c:'#8a99a6',w:1.2});
      f.path(`M${f.S({x:pan.x-2.2,y:pan.y}).join(',')} Q${f.S({x:pan.x,y:pan.y-0.55}).join(',')} ${f.S({x:pan.x+2.2,y:pan.y}).join(',')}`,{c:C.ink,w:2.5,f:'#eef2f5'});
      for(const q of layout(items(x,c))){const lv=isLeaving(sd,q.o);const op=lv?1-lt:1;const up=lv?lt*1.4:0;const cx=pan.x+q.dx,cy=pan.y+q.b+up+q.h/2;
        const col=q.o.t==='x'?[C.blau,'#cfe3f1']:[C.or,'#f9e0c3'];
        f.poly([{x:cx-q.w/2,y:cy-q.h/2},{x:cx+q.w/2,y:cy-q.h/2},{x:cx+q.w/2,y:cy+q.h/2},{x:cx-q.w/2,y:cy+q.h/2}],{c:col[0],f:col[1],w:1.6,o:op});
        f.text({x:cx,y:cy},q.o.t==='x'?'x':'1','ann',{fill:col[0],fontSize:q.o.t==='x'?'17px':'11px',fontWeight:'700',fontStyle:q.o.t==='x'?'italic':'normal',opacity:op})}}
    svgMath(f,{x:0,y:3.2},side(S.Lx,S.Lc)+'  =  '+side(S.Rx,S.Rc),{fontSize:'24px'});
    if(msg)f.text({x:0,y:-5.45},msg,'ann',{fill:C.rot,fontSize:'15px',fontWeight:'700'})};
  function tiltTo(target,ms=700){const a=tilt;return new Promise(r=>tween(ms,t=>{tilt=a+(target-a)*ease(t);f.render()},r))}
  const weight=s=>({L:s.Lx*XV+s.Lc,R:s.Rx*XV+s.Rc});
  function readout(){const l=P.s.Lx*XV+P.s.Lc,r=P.s.Rx*XV+P.s.Rc;$('r1').innerHTML=log.map(q=>`\\(${q}\\)`).join('<br>')+(i>=P.ops.length?`<br><b>Lösung: \\(x=3\\)</b>, \\(\\mathbb{L}=\\{3\\}\\). Probe: links \\(${P.s.Lx}\\cdot3+${P.s.Lc}=${l}\\), rechts \\(${P.s.Rx?(P.s.Rx===1?'3':P.s.Rx+'\\cdot3')+'+':''}${P.s.Rc}=${r}\\) ✓`:'');typesetEl($('r1'))}
  function load(){P=PRE[+$('w1sel').value];S=Object.assign({},P.s);i=0;leaving=[];lt=0;tilt=0;msg='';log=[R`${sideT(S.Lx,S.Lc)}=${sideT(S.Rx,S.Rc)}`];f.render();
    $('r1').innerHTML=`\\(${log[0]}\\)<br><span class="hint" style="margin:0">Welche Zahl ist \\(x\\)? Wie kann man auf beiden Seiten gleich viel wegnehmen?</span>`;typesetEl($('r1'))}
  async function step(){if(busy||i>=P.ops.length)return;busy=true;const o=P.ops[i];const N=Object.assign({},S);let note;
    if(o.x){leaving=[{sd:'L',t:'x',from:S.Lx-o.x},{sd:'R',t:'x',from:S.Rx-o.x}];N.Lx-=o.x;N.Rx-=o.x;note=opT('-',o.x,'x')}
    else if(o.c){leaving=[{sd:'L',t:'c',from:S.Lc-o.c},{sd:'R',t:'c',from:S.Rc-o.c}];N.Lc-=o.c;N.Rc-=o.c;note=opT('-',o.c)}
    else{const k=o.k;leaving=[{sd:'L',t:'x',from:S.Lx/k},{sd:'L',t:'c',from:S.Lc/k},{sd:'R',t:'x',from:S.Rx/k},{sd:'R',t:'c',from:S.Rc/k}];for(const q of['Lx','Lc','Rx','Rc'])N[q]/=k;note=opT(':',k)}
    log[log.length-1]+=R`\qquad ${note}`;
    await new Promise(r=>tween(1000,t=>{lt=t;f.render()},r));S=N;leaving=[];lt=0;i++;log.push(R`${sideT(S.Lx,S.Lc)}=${sideT(S.Rx,S.Rc)}`);f.render();readout();busy=false}
  async function bad(){if(busy)return;busy=true;const B=Object.assign({},S);let lv;
    if(S.Lc>0){const n=Math.min(2,S.Lc);lv=[{sd:'L',t:'c',from:S.Lc-n}];B.Lc-=n;msg=`Nur links −${n}: Die Waage kippt!`}else{lv=[{sd:'L',t:'x',from:S.Lx-1}];B.Lx-=1;msg='Nur links −x: Die Waage kippt!'}
    leaving=lv;await new Promise(r=>tween(800,t=>{lt=t;f.render()},r));const old=S;S=B;leaving=[];lt=0;const w=weight(S);await tiltTo(clamp((w.R-w.L)*0.035,-0.22,0.22));
    await new Promise(r=>setTimeout(r,1600));S=old;msg='';await tiltTo(0,600);f.render();busy=false}
  $('w1sel').innerHTML=PRE.map((p,j)=>`<option value="${j}">${p.name}</option>`).join('');
  $('w1sel').addEventListener('change',load);$('w1back').addEventListener('click',load);$('w1step').addEventListener('click',step);$('w1bad').addEventListener('click',bad);load();
})();

/* ---------------- 2 Lineare Gleichungen ---------------- */
const LEX=[
  {name:'5x − 7 = 2x + 8',lines:()=>{const r=linSolve(5,-7,2,8,[[R`5x-7=2x+8`]]);return r.L.concat([probe([x=>5*x-7,x=>2*x+8],5,'5\\cdot5-7','2\\cdot5+8'),[R`\mathbb{L}=\{5\}`,'']])}},
  {name:'3(x − 2) + 4 = 2(x + 1) + 3',lines:()=>[].concat(linSolve(3,-2,2,5,[[R`3(x-2)+4=2(x+1)+3`],[R`3x-6+4=2x+2+3`,'Klammern auflösen'],[R`3x-2=2x+5`,'jede Seite zusammenfassen']]).L,[probe([x=>3*(x-2)+4,x=>2*(x+1)+3],7,'3\\cdot5+4','2\\cdot8+3'),[R`\mathbb{L}=\{7\}`,'']])},
  {name:'x/2 + x/3 = 10',lines:()=>[[R`\dfrac{x}{2}+\dfrac{x}{3}=10\qquad\big|\cdot6`],[R`3x+2x=60`,'mit dem Hauptnenner 6 multiplizieren'],[R`5x=60\qquad\big|\,:5`,'zusammenfassen'],[R`x=12`,'durch 5 dividieren'],[R`\text{Probe: }\tfrac{12}{2}+\tfrac{12}{3}=6+4=10\;\checkmark`,''],[R`\mathbb{L}=\{12\}`,'']]},
  {name:'(2x − 1)/3 − (x + 2)/4 = 1',lines:()=>[[R`\dfrac{2x-1}{3}-\dfrac{x+2}{4}=1\qquad\big|\cdot12`],[R`4(2x-1)-3(x+2)=12`,'mal 12; Zähler in Klammern!'],[R`8x-4-3x-6=12`,'Klammern auflösen: −3 · (+2) = −6'],[R`5x-10=12\qquad\big|+10`,'zusammenfassen'],[R`5x=22\qquad\big|\,:5`,''],[R`x=\dfrac{22}{5}=4.4`,''],[R`\text{Probe: }\tfrac{7.8}{3}-\tfrac{6.4}{4}=2.6-1.6=1\;\checkmark`,''],[R`\mathbb{L}=\{4.4\}`,'']]},
  {name:'(x + 2)² = (x − 1)(x + 3) + 1',lines:()=>[[R`(x+2)^2=(x-1)(x+3)+1`],[R`x^2+4x+4=x^2+2x-3+1`,'binomische Formel; ausmultiplizieren'],[R`x^2+4x+4=x^2+2x-2\qquad\big|-x^2`,'zusammenfassen'],].concat(linSolve(4,4,2,-2,[[R`4x+4=2x-2`,'x² fällt weg: lineare Gleichung']]).L,[[R`\text{Probe: }(-1)^2=1,\;\;(-4)\cdot0+1=1\;\checkmark`,''],[R`\mathbb{L}=\{-3\}`,'']])},
  {name:'2(x + 3) = 2x + 6   Sonderfall',lines:()=>[[R`2(x+3)=2x+6`],[R`2x+6=2x+6\qquad\big|-2x`,'Klammer auflösen'],[R`6=6`,'x fällt weg, wahre Aussage'],[R`\mathbb{L}=\mathbb{R}`,'jede Zahl ist Lösung']]},
  {name:'3x + 1 = 3(x − 2)   Sonderfall',lines:()=>[[R`3x+1=3(x-2)`],[R`3x+1=3x-6\qquad\big|-3x`,'Klammer auflösen'],[R`1=-6`,'x fällt weg, falsche Aussage'],[R`\mathbb{L}=\{\,\}`,'keine Zahl ist Lösung']]}];
function linRandom(br){let a,c,s,b,d;do{a=rnd(2,9);c=pick([-4,-3,-2,-1,0,1,2,3,4,5,6]);s=pick([-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8])}while(a===c);
  b=rnd(-12,12);d=(a-c)*s+b;
  if(!br){const T=R`${lin(a,b).tex()}=${lin(c,d).tex()}`;const r=linSolve(a,b,c,d,[[T]]);return{T,s,lines:r.L.concat([[R`\mathbb{L}=\{${s}\}`,'']])}}
  let k;do{k=pick([2,3,4,5])}while(k===c);const p=pick([-5,-4,-3,-2,-1,1,2,3,4,5]);const a1=k,q1=b-k*p;const A=a1+0;
  /* links: k(x+p) + q1 = kx + (kp+q1) */ const aa=k,bb=k*p+q1;const sgn=v=>v<0?`-${-v}`:`+${v}`;
  const d2=(aa-c)*s+bb;const T=R`${k}(x${sgn(p)})${q1?sgn(q1):''}=${lin(c,d2).tex()}`;
  const pre=[[T],[R`${k}x${sgn(k*p)}${q1?sgn(q1):''}=${lin(c,d2).tex()}`,'Klammer auflösen']];if(q1)pre.push([R`${lin(aa,bb).tex()}=${lin(c,d2).tex()}`,'zusammenfassen']);
  const r=linSolve(aa,bb,c,d2,pre);return{T,s,lines:r.L.concat([[R`\mathbb{L}=\{${s}\}`,'']])}}
(function(){const sb=stepBox('l2','l2step','l2all');
  $('l2sel').innerHTML=LEX.map((e,j)=>`<option value="${j}">${e.name}</option>`).join('');
  const load=L=>sb.set(L,{noEq:true});
  $('l2sel').addEventListener('change',()=>load(LEX[+$('l2sel').value].lines()));$('l2rnd').addEventListener('click',()=>load(linRandom(Math.random()<0.5).lines));load(LEX[0].lines());
})();

/* ---------------- 2b Schnittpunkt zweier Geraden ---------------- */
(function(){
  const f=new Fig($('f3'),{h:380,s:30});const GE=[
    {name:'2x − 1 = −x + 5',m1:2,q1:-1,m2:-1,q2:5,t1:'2x − 1',t2:'−x + 5',T:R`2x-1=-x+5`},
    {name:'x + 3 = −2x − 3',m1:1,q1:3,m2:-2,q2:-3,t1:'x + 3',t2:'−2x − 3',T:R`x+3=-2x-3`},
    {name:'0.5x + 2 = 0.5x − 1',m1:0.5,q1:2,m2:0.5,q2:-1,t1:'0.5x + 2',t2:'0.5x − 1',T:R`0.5x+2=0.5x-1`},
    {name:'2(x − 1) = 2x − 2',m1:2,q1:-2,m2:2,q2:-2,t1:'2(x − 1)',t2:'2x − 2',T:R`2(x-1)=2x-2`}];
  let G=GE[0],show=false,k=0;
  f.draw=()=>{f.seg({x:f.xmin,y:0},{x:f.xmax-0.1,y:0},{c:'#6b7a86',w:1.4,me:'k'});f.seg({x:0,y:f.ymin},{x:0,y:f.ymax-0.1},{c:'#6b7a86',w:1.4,me:'k'});
    for(let x=-10;x<=10;x+=2)if(x){f.seg({x,y:-0.12},{x,y:0.12},{c:'#6b7a86',w:1.2});f.text({x,y:-0.45},mn(x),'ann',{fontSize:'12px'})}
    for(let y=-6;y<=6;y+=2)if(y){f.seg({x:-0.12,y},{x:0.12,y},{c:'#6b7a86',w:1.2});f.text({x:-0.45,y},mn(y),'ann',{fontSize:'12px'})}
    f.text({x:f.xmax-0.4,y:-0.45},'x','lbl');f.text({x:0.45,y:f.ymax-0.4},'y','lbl');
    const same=G.m1===G.m2&&G.q1===G.q2;
    f.line({x:0,y:G.q1},{x:1,y:G.m1},{c:C.blau,w:2.6});f.line({x:0,y:G.q2},{x:1,y:G.m2},{c:C.or,w:2.6,d:same?'8 7':null});
    const lab=(m,q,t,col,dy)=>{let X=9.6;if(Math.abs(m*X+q)>5.2)X=((m>0?5.2:-5.2)-q)/m;svgMath(f,{x:X-0.15,y:m*X+q+dy},'y = '+t,{fill:col,fontSize:'16px',anchor:'end'})};
    lab(G.m1,G.q1,G.t1,C.blau,0.55);lab(G.m2,G.q2,G.t2,C.or,same?-0.6:0.55);
    if(show){if(G.m1!==G.m2){const x=(G.q2-G.q1)/(G.m1-G.m2),y=G.m1*x+G.q1;const t=ease(k);f.seg({x,y},{x,y:y*(1-t)},{c:C.rot,w:2,d:'5 4'});f.dot({x,y},6,C.rot);
        if(k>=1){f.text({x,y:y>0?-0.95:0.9},`x = ${mn(dec(x))}`,'lbl',{fill:C.rot,fontStyle:'normal',fontWeight:'700'});svgMath(f,{x:x+0.3,y:y+0.6},`S(${dec(x)}; ${dec(y)})`,{fill:C.rot,fontSize:'15px',anchor:'start'})}}
      else f.text({x:0,y:-5.3},same?'Die Geraden sind gleich: alle Punkte gemeinsam.':'Die Geraden sind parallel: kein Schnittpunkt.','ann',{fill:C.rot,fontSize:'15px',fontWeight:'700'})}};
  function upd(){$('r3').innerHTML=`\\(${G.T}\\)`+(show?'<br>'+(G.m1!==G.m2?`\\(\\mathbb{L}=\\{${dec((G.q2-G.q1)/(G.m1-G.m2))}\\}\\)`:(G.q1===G.q2?'\\(\\mathbb{L}=\\mathbb{R}\\)':'\\(\\mathbb{L}=\\{\\,\\}\\)')):'<br><span class="hint" style="margin:0">Wo findest du die Lösung im Bild?</span>');typesetEl($('r3'))}
  $('g3sel').innerHTML=GE.map((g,j)=>`<option value="${j}">${g.name}</option>`).join('');
  $('g3sel').addEventListener('change',()=>{G=GE[+$('g3sel').value];show=false;k=0;f.render();upd()});
  $('g3go').addEventListener('click',()=>{show=true;k=0;tween(900,t=>{k=t;f.render()},()=>{k=1;f.render();upd()})});f.render();upd();
})();

/* ---------------- 3 Bruchgleichungen ---------------- */
const BEX=[
  {name:'3/x = 5/(x + 2)',ex:[-2,0],sol:3,lines:[[R`\dfrac{3}{x}=\dfrac{5}{x+2}`],[R`\mathbb{D}=\mathbb{R}\setminus\{-2;\,0\}`,'Definitionsmenge: Nenner ≠ 0',{d:1}],[R`3(x+2)=5x\qquad\big|\cdot x(x+2)`,'mit dem Hauptnenner multiplizieren'],[R`3x+6=5x\qquad\big|-3x`,'ausmultiplizieren'],[R`6=2x\qquad\big|\,:2`,''],[R`x=3`,'',{s:1}],[R`3\in\mathbb{D}\;\Rightarrow\;\mathbb{L}=\{3\}`,'Kontrolle']]},
  {name:'2/(x − 1) + 3/(x + 1) = 10/(x² − 1)',ex:[-1,1],sol:2.2,lines:[[R`\dfrac{2}{x-1}+\dfrac{3}{x+1}=\dfrac{10}{x^2-1}`],[R`x^2-1=(x+1)(x-1)\;\Rightarrow\;\mathbb{D}=\mathbb{R}\setminus\{-1;\,1\}`,'Definitionsmenge: Nenner faktorisieren',{d:1}],[R`2(x+1)+3(x-1)=10\qquad\big|\cdot(x+1)(x-1)`,'mit dem Hauptnenner multiplizieren'],[R`2x+2+3x-3=10`,'ausmultiplizieren'],[R`5x-1=10\qquad\big|+1`,'zusammenfassen'],[R`5x=11\qquad\big|\,:5`,''],[R`x=\dfrac{11}{5}=2.2`,'',{s:1}],[R`2.2\in\mathbb{D}\;\Rightarrow\;\mathbb{L}=\{2.2\}`,'Kontrolle']]},
  {name:'x/(x − 2) = 2/(x − 2) + 3   Vorsicht',ex:[2],sol:2,bad:true,lines:[[R`\dfrac{x}{x-2}=\dfrac{2}{x-2}+3`],[R`\mathbb{D}=\mathbb{R}\setminus\{2\}`,'Definitionsmenge',{d:1}],[R`x=2+3(x-2)\qquad\big|\cdot(x-2)`,'mit dem Hauptnenner multiplizieren'],[R`x=2+3x-6`,'ausmultiplizieren'],[R`x=3x-4\qquad\big|-3x`,'zusammenfassen'],[R`-2x=-4\qquad\big|\,:(-2)`,''],[R`x=2`,'',{s:1}],[R`2\notin\mathbb{D}\;\Rightarrow\;\mathbb{L}=\{\,\}`,'Kontrolle: 2 ist verboten!']]},
  {name:'(x + 1)/x − x/(x + 2) = 2/x',ex:[-2,0],sol:2,lines:[[R`\dfrac{x+1}{x}-\dfrac{x}{x+2}=\dfrac{2}{x}`],[R`\mathbb{D}=\mathbb{R}\setminus\{-2;\,0\}`,'Definitionsmenge',{d:1}],[R`(x+1)(x+2)-x\cdot x=2(x+2)\qquad\big|\cdot x(x+2)`,'mit dem Hauptnenner multiplizieren'],[R`x^2+3x+2-x^2=2x+4`,'ausmultiplizieren'],[R`3x+2=2x+4\qquad\big|-2x-2`,'x² fällt weg'],[R`x=2`,'',{s:1}],[R`2\in\mathbb{D}\;\Rightarrow\;\mathbb{L}=\{2\}`,'Kontrolle']]},
  {name:'4/(x + 3) = 2/(x − 1)',ex:[-3,1],sol:5,lines:[[R`\dfrac{4}{x+3}=\dfrac{2}{x-1}`],[R`\mathbb{D}=\mathbb{R}\setminus\{-3;\,1\}`,'Definitionsmenge',{d:1}],[R`4(x-1)=2(x+3)\qquad\big|\cdot(x+3)(x-1)`,'mit dem Hauptnenner multiplizieren'],[R`4x-4=2x+6\qquad\big|-2x+4`,'ausmultiplizieren'],[R`2x=10\qquad\big|\,:2`,''],[R`x=5`,'',{s:1}],[R`5\in\mathbb{D}\;\Rightarrow\;\mathbb{L}=\{5\}`,'Kontrolle']]}];
function bruchRandom(){for(let g=0;g<500;g++){const p=pick([-5,-4,-3,-2,-1,1,2,3,4,5]),q=pick([-5,-4,-3,-2,-1,1,2,3,4,5]);if(p===q)continue;const s=rnd(-6,8);if(s===-p||s===-q)continue;
    const a=rnd(1,6);const b=a*(s+q)/(s+p);if(!Number.isInteger(b)||b===0||b===a||Math.abs(b)>12)continue;
    const sg=v=>v<0?`-${-v}`:`+${v}`;const ex=[-p,-q].sort((u,v)=>u-v);
    const L=[[R`\dfrac{${a}}{x${sg(p)}}=\dfrac{${b}}{x${sg(q)}}`],[R`\mathbb{D}=\mathbb{R}\setminus\{${ex[0]};\,${ex[1]}\}`,'Definitionsmenge',{d:1}],
      [R`${a}(x${sg(q)})=${b}(x${sg(p)})\qquad\big|\cdot(x${sg(p)})(x${sg(q)})`,'mit dem Hauptnenner multiplizieren'],
      [R`${lin(a,a*q).tex()}=${lin(b,b*p).tex()}`,'ausmultiplizieren']];
    const all=linSolve(a,a*q,b,b*p,L).L;all[all.length-1][2]={s:1};
    all.push([R`${s}\in\mathbb{D}\;\Rightarrow\;\mathbb{L}=\{${s}\}`,'Kontrolle']);return{ex,sol:s,lines:all,a,b,p,q}}}
(function(){const sb=stepBox('b4','b4step','b4all');const f=new Fig($('f4'),{h:96,s:38,oy:52,grid:false});let E,st={d:false,s:false},k=0;
  f.draw=()=>{f.seg({x:-8.2,y:0},{x:8.2,y:0},{c:C.ink,w:1.6,me:'k'});for(let x=-8;x<=8;x++){f.seg({x,y:-0.13},{x,y:0.13},{c:C.ink,w:1.2});f.text({x,y:-0.55},mn(x),'ann',{fontSize:'12px'})}
    if(st.d)E.ex.forEach(x=>{f.circ({x,y:0},0.2,{c:C.rot,w:2.4,f:'#fff'})});
    if(st.s){const x=E.sol,y=1.0*(1-ease(k));const bad=E.ex.includes(x);
      if(!bad||k<1)f.dot({x,y},6,bad&&k>=1?C.rot:C.gr);
      if(k>=1){if(bad){f.seg({x:x-0.25,y:-0.25},{x:x+0.25,y:0.25},{c:C.rot,w:3});f.seg({x:x-0.25,y:0.25},{x:x+0.25,y:-0.25},{c:C.rot,w:3});f.text({x,y:0.62},'∉ 𝔻','ann',{fill:C.rot,fontSize:'14px',fontWeight:'700'})}
        else f.text({x,y:0.62},'x = '+dec(x),'ann',{fill:C.gr,fontSize:'14px',fontWeight:'700'})}}};
  function load(e){E=e;st={d:false,s:false};k=0;f.render();
    sb.set(e.lines,{noEq:true,onStep:n=>{const op=e.lines[n][2]||{};if(op.d){st.d=true;f.render()}if(op.s){st.s=true;k=0;tween(800,t=>{k=t;f.render()},()=>{k=1;f.render()})}}})}
  $('b4sel').innerHTML=BEX.map((e,j)=>`<option value="${j}">${e.name}</option>`).join('');
  $('b4sel').addEventListener('change',()=>load(BEX[+$('b4sel').value]));$('b4rnd').addEventListener('click',()=>load(bruchRandom()));
  $('b4all').addEventListener('click',()=>{st.d=st.s=true;k=1;f.render()});load(BEX[0]);
})();

/* ---------------- 4 Formeln: Operationskette ---------------- */
const KEX=[
  {name:'u = 2(a + b), gesucht b',F:R`u=2(a+b)`,v:'b',z:'u',fw:['+a',R`\cdot2`],inv:[':2','-a'],res:R`b=\dfrac{u}{2}-a`},
  {name:'A = (a + c)/2 · h, gesucht c',F:R`A=\dfrac{a+c}{2}\cdot h`,v:'c',z:'A',fw:['+a',':2',R`\cdot h`],inv:[':h',R`\cdot2`,'-a'],res:R`c=\dfrac{2A}{h}-a`},
  {name:'F = 9/5 · C + 32, gesucht C',F:R`F=\tfrac95\,C+32`,v:'C',z:'F',fw:[R`\cdot\tfrac95`,'+32'],inv:['-32',R`\cdot\tfrac59`],res:R`C=\tfrac59\,(F-32)`},
  {name:'y = mx + q, gesucht x',F:R`y=mx+q`,v:'x',z:'y',fw:[R`\cdot m`,'+q'],inv:['-q',':m'],res:R`x=\dfrac{y-q}{m}`},
  {name:'E = m · g · h, gesucht h',F:R`E=m\cdot g\cdot h`,v:'h',z:'E',fw:[R`\cdot g`,R`\cdot m`],inv:[':m',':g'],res:R`h=\dfrac{E}{m\cdot g}`},
  {name:'u = 2πr, gesucht r',F:R`u=2\pi r`,v:'r',z:'u',fw:[R`\cdot2\pi`],inv:[R`:2\pi`],res:R`r=\dfrac{u}{2\pi}`}];
(function(){let E,n=0;
  const row=(start,ops,end,inv)=>`<div class="kette">${[`<span class="kb var">\\(${start}\\)</span>`].concat(ops.flatMap(o=>[`<span class="pf${inv?' inv':''}">→</span>`,`<span class="kb${inv?' inv':''}">\\(${o}\\)</span>`]),[`<span class="pf${inv?' inv':''}">→</span>`,`<span class="kb var">\\(${end}\\)</span>`]).map((h,j)=>h.replace('<span ',`<span style="opacity:0;animation:fadein .45s forwards;animation-delay:${(j*0.3).toFixed(2)}s" `)).join('')}</div>`;
  function show(){let h=`<p class="hint" style="margin:0">Gesucht: \\(${E.v}\\). ${n===0?'Was geschieht mit \\('+E.v+'\\), bis \\('+E.z+'\\) herauskommt? Klicke auf «Schritt ›».':''}</p>`;
    if(n>=1)h+=`<p class="sans" style="margin:10px 0 0;font-weight:700;color:var(--kopf-d)">Vorwärts: was mit \\(${E.v}\\) geschieht</p>`+row(E.v,E.fw,E.z,false);
    if(n>=2)h+=`<p class="sans" style="margin:10px 0 0;font-weight:700;color:#a65b12">Rückwärts: Umkehroperationen in umgekehrter Reihenfolge</p>`+row(E.z,E.inv,E.v,true);
    if(n>=3)h+=`<div class="verdict ja" style="font-size:20px;font-weight:400">\\(${E.res}\\)</div>`;
    $('k5').innerHTML=h;typesetEl($('k5'))}
  function load(){E=KEX[+$('k5sel').value];n=0;$('k5f').innerHTML=`\\(${E.F}\\)`;typesetEl($('k5f'));show()}
  $('k5sel').innerHTML=KEX.map((e,j)=>`<option value="${j}">${e.name}</option>`).join('');$('k5sel').addEventListener('change',load);$('k5back').addEventListener('click',load);
  $('k5step').addEventListener('click',()=>{if(n<3){n++;show()}});load();
})();
const FEX=[
  {name:'v = s/t nach t',lines:[[R`v=\dfrac{s}{t}\qquad\big|\cdot t`],[R`v\cdot t=s\qquad\big|\,:v`,'gesuchte Grösse aus dem Nenner holen'],[R`t=\dfrac{s}{v}`,'durch v dividieren']]},
  {name:'Z = K·p·t/100 nach p',lines:[[R`Z=\dfrac{K\cdot p\cdot t}{100}\qquad\big|\cdot100`],[R`100Z=K\cdot p\cdot t\qquad\big|\,:(K\cdot t)`,'Bruch wegschaffen'],[R`p=\dfrac{100Z}{K\cdot t}`,'durch die anderen Faktoren dividieren']]},
  {name:'A = (a + c)/2 · h nach h',lines:[[R`A=\dfrac{a+c}{2}\cdot h\qquad\big|\cdot2`],[R`2A=(a+c)\cdot h\qquad\big|\,:(a+c)`,'Bruch wegschaffen'],[R`h=\dfrac{2A}{a+c}`,'durch die ganze Klammer dividieren']]},
  {name:'s = a/2 · t² nach a',lines:[[R`s=\dfrac{a}{2}\,t^2\qquad\big|\cdot2`],[R`2s=a\,t^2\qquad\big|\,:t^2`,''],[R`a=\dfrac{2s}{t^2}`,'']]},
  {name:'1/f = 1/g + 1/b nach b (Linsenformel)',lines:[[R`\dfrac1f=\dfrac1g+\dfrac1b\qquad\big|\cdot fgb`],[R`gb=fb+fg\qquad\big|-fb`,'mit dem Hauptnenner multiplizieren'],[R`gb-fb=fg`,'alle Terme mit b auf eine Seite'],[R`b\,(g-f)=fg\qquad\big|\,:(g-f)`,'b ausklammern'],[R`b=\dfrac{fg}{g-f}`,'durch die Klammer dividieren (g ≠ f)']]},
  {name:'ax + b = cx + d nach x',lines:[[R`ax+b=cx+d\qquad\big|-cx-b`],[R`ax-cx=d-b`,'x-Terme links, Rest rechts'],[R`x\,(a-c)=d-b\qquad\big|\,:(a-c)`,'x ausklammern'],[R`x=\dfrac{d-b}{a-c}`,'(a ≠ c)']]}];
(function(){const sb=stepBox('f6','f6step','f6all');$('f6sel').innerHTML=FEX.map((e,j)=>`<option value="${j}">${e.name}</option>`).join('');
  const load=()=>sb.set(FEX[+$('f6sel').value].lines,{noEq:true});$('f6sel').addEventListener('change',load);load()})();

/* ---------------- 5 Textgleichungen: Balkenmodell ---------------- */
const TEX=[
  {name:'Alter',q:'Anna ist 5 Jahre älter als Ben. Zusammen sind sie 31 Jahre alt. Wie alt sind die beiden?',x:13,
    rows:[{lab:'Ben',seg:['x']},{lab:'Anna',seg:['x',5]}],tot:{rows:[0,1],v:31,lab:'zusammen 31'},
    lines:[['Was ist gesucht? Welche Grösse wählst du als \\(x\\)?','',{html:true}],['\\(x\\): Alter von Ben (in Jahren)','',{html:true,st:1}],['Anna: \\(x+5\\)','',{html:true,st:2}],
      [R`x+(x+5)=31`,'zusammen 31',{st:3}],[R`2x+5=31\qquad\big|-5`,'zusammenfassen'],[R`2x=26\qquad\big|\,:2`,''],[R`x=13`,'',{st:4}],['<b>Antwort:</b> Ben ist 13 Jahre, Anna 18 Jahre alt. <b>Probe am Text:</b> 18 − 13 = 5 ✓, 13 + 18 = 31 ✓','',{html:true,st:5}]]},
  {name:'Geld verteilen',q:'60 Fr. werden auf drei Personen verteilt. Carla erhält doppelt so viel wie Dario, Eva 12 Fr. mehr als Dario. Wie viel erhält jede Person?',x:12,
    rows:[{lab:'Dario',seg:['x']},{lab:'Carla',seg:['x','x']},{lab:'Eva',seg:['x',12]}],tot:{rows:[0,1,2],v:60,lab:'zusammen 60 Fr.'},
    lines:[['Was ist gesucht? Welche Grösse wählst du als \\(x\\)?','',{html:true}],['\\(x\\): Betrag von Dario (in Fr.)','',{html:true,st:1}],['Carla: \\(2x\\), Eva: \\(x+12\\)','',{html:true,st:2}],
      [R`x+2x+(x+12)=60`,'zusammen 60',{st:3}],[R`4x+12=60\qquad\big|-12`,'zusammenfassen'],[R`4x=48\qquad\big|\,:4`,''],[R`x=12`,'',{st:4}],['<b>Antwort:</b> Dario erhält 12 Fr., Carla 24 Fr., Eva 24 Fr. <b>Probe:</b> 12 + 24 + 24 = 60 ✓','',{html:true,st:5}]]},
  {name:'Rechteck',q:'Ein Rechteck ist 4 cm länger als breit. Sein Umfang beträgt 36 cm. Wie lang und wie breit ist es?',x:7,
    rows:[{lab:'Breite',seg:['x']},{lab:'Länge',seg:['x',4]},{lab:'Umfang',seg:['x','x',4,'x','x',4],sep:[1,3,4]}],tot:{rows:[2],v:36,lab:'Umfang 36 cm'},
    lines:[['Was ist gesucht? Welche Grösse wählst du als \\(x\\)?','',{html:true}],['\\(x\\): Breite (in cm)','',{html:true,st:1}],['Länge: \\(x+4\\). Der Umfang besteht aus zwei Breiten und zwei Längen.','',{html:true,st:2}],
      [R`2x+2(x+4)=36`,'Umfang',{st:3}],[R`2x+2x+8=36`,'Klammer auflösen'],[R`4x+8=36\qquad\big|-8`,'zusammenfassen'],[R`4x=28\qquad\big|\,:4`,''],[R`x=7`,'',{st:4}],['<b>Antwort:</b> Das Rechteck ist 7 cm breit und 11 cm lang. <b>Probe:</b> 2 · 7 + 2 · 11 = 36 ✓','',{html:true,st:5}]]},
  {name:'Zahlenrätsel',q:'Vermehrt man das Dreifache einer Zahl um 4, so erhält man gleich viel, wie wenn man das Fünffache der Zahl um 10 vermindert. Wie heisst die Zahl?',x:7,
    rows:[{lab:'3x + 4',seg:['x','x','x',4]},{lab:'5x − 10',seg:['x','x','x','x','x',-10]}],tot:{eq:true,lab:'gleich lang'},
    lines:[['Was ist gesucht? Welche Grösse wählst du als \\(x\\)?','',{html:true}],['\\(x\\): die gesuchte Zahl','',{html:true,st:1}],['Dreifaches um 4 vermehrt: \\(3x+4\\). Fünffaches um 10 vermindert: \\(5x-10\\)','',{html:true,st:2}],
      [R`3x+4=5x-10\qquad\big|-3x+10`,'«erhält gleich viel»',{st:3}],[R`14=2x\qquad\big|\,:2`,''],[R`x=7`,'',{st:4}],['<b>Antwort:</b> Die Zahl heisst 7. <b>Probe:</b> 3 · 7 + 4 = 25 und 5 · 7 − 10 = 25 ✓','',{html:true,st:5}]]}];
(function(){const sb=stepBox('t7','t7step','t7all');const f=new Fig($('f7'),{h:230,s:40,oy:110,grid:false});let E,st=0;
  f.draw=()=>{if(!E)return;const tot=r=>r.seg.reduce((s,q)=>s+(q==='x'?E.x:q),0);const mx=Math.max(...E.rows.map(r=>r.seg.filter(q=>q==='x'||q>0).reduce((s,q)=>s+(q==='x'?E.x:q),0)));
    const W=(E.tot.eq?10.2:8.4)/mx,x0=-5.6;const n=E.rows.length;const ys=E.rows.map((_,j)=>1.6-j*(n>2?1.25:1.5));
    E.rows.forEach((r,j)=>{if(st<1||(j>0&&st<2))return;const y=ys[j];let x=x0;f.text({x:-7.6,y},r.lab,'ann',{fontSize:'15px',fontWeight:'700',textAnchor:'start'});
      r.seg.forEach(q=>{if(q!=='x'&&q<0){const w=-q*W;f.poly([{x:x-w,y:y-0.38},{x,y:y-0.38},{x,y:y+0.38},{x:x-w,y:y+0.38}],{c:C.rot,w:2,f:'#f6d2cf',d:'5 3',o:0.8});f.text({x:x-w/2,y},`−${-q}`,'ann',{fill:C.rot,fontSize:'14px',fontWeight:'700'});return}
        const v=q==='x'?E.x:q,w=v*W;const col=q==='x'?[C.blau,'#cfe3f1']:[C.or,'#f9e0c3'];
        f.poly([{x,y:y-0.38},{x:x+w,y:y-0.38},{x:x+w,y:y+0.38},{x,y:y+0.38}],{c:col[0],f:col[1],w:1.8});
        if(q==='x')svgMath(f,{x:x+w/2,y},st>=4?String(E.x):'x',{fontSize:'17px',fill:col[0],fontWeight:'700'});else f.text({x:x+w/2,y},String(q),'ann',{fill:col[0],fontSize:'14px',fontWeight:'700'});x+=w});
      if(st>=4&&!E.tot.eq)f.text({x:x0+tot(r)*W+0.25,y},'= '+tot(r),'ann',{textAnchor:'start',fontSize:'14px'})});
    if(st>=3){if(E.tot.eq){const xe=x0+tot(E.rows[0])*W;f.seg({x:xe,y:ys[0]+0.6},{x:xe,y:ys[1]-0.6},{c:C.rot,w:2,d:'6 4'});f.text({x:xe+0.2,y:ys[ys.length-1]-0.85},E.tot.lab+(st>=4?` (je ${tot(E.rows[0])})`:''),'ann',{fill:C.rot,fontSize:'14px',fontWeight:'700',textAnchor:'start'})}
      else{const rs=E.tot.rows;const y1=ys[rs[0]]+0.45,y2=ys[rs[rs.length-1]]-0.45;const xe=x0+Math.max(...rs.map(j=>tot(E.rows[j])))*W+(st>=4?1.6:0.3);
        f.seg({x:xe,y:y1},{x:xe,y:y2},{c:C.rot,w:2});f.seg({x:xe-0.2,y:y1},{x:xe,y:y1},{c:C.rot,w:2});f.seg({x:xe-0.2,y:y2},{x:xe,y:y2},{c:C.rot,w:2});
        f.text({x:xe+0.45,y:(y1+y2)/2},E.tot.lab,'ann',{fill:C.rot,fontSize:'14px',fontWeight:'700',textAnchor:'start'})}}};
  function load(){E=TEX[+$('t7sel').value];st=0;$('t7q').innerHTML='<b>Aufgabe:</b> '+E.q;f.render();
    sb.set(E.lines,{noEq:true,onStep:n=>{let s=0;for(let j=0;j<=n;j++){const o=E.lines[j][2]||{};if(o.st)s=Math.max(s,o.st)}st=s;f.render()}})}
  $('t7sel').innerHTML=TEX.map((e,j)=>`<option value="${j}">${e.name}</option>`).join('');$('t7sel').addEventListener('change',load);load();
})();

/* ---------------- 6 Trainer ---------------- */
const solL=L=>L.map(l=>l[2]&&l[2].html?`<p>${l[0]}</p>`:`<p>\\(${l[0]}\\)${l[1]?` <span class="hint" style="margin:0">← ${l[1]}</span>`:''}</p>`).join('');
function checkNum(s,v){const t=String(s).replace(/\s/g,'').replace(/^x=/,'').replace(/^L=/i,'');
  if(v===null){return/^(\{\}|\{\s*\}|leer|keine|∅)$/i.test(t)?{ok:true}:{ok:false,msg:'Prüfe die Definitionsmenge.'}}
  if(/^\{.*\}$/.test(t))return checkNum(t.slice(1,-1),v);const x=parseNum(t);if(isNaN(x))return{ok:false,msg:'Gib eine Zahl ein, z. B. 3, −2.5 oder 7/4.'};
  return Math.abs(x-v)<1e-9?{ok:true}:{ok:false,msg:'Noch nicht richtig. Mach die Probe!'}}
const FORM=[
  {F:R`v=\dfrac{s}{t}`,t:'t',a:'s/v',r:R`t=\dfrac{s}{v}`},{F:R`v=\dfrac{s}{t}`,t:'s',a:'v*t',r:R`s=v\cdot t`},{F:R`A=\dfrac{a+c}{2}\cdot h`,t:'h',a:'2A/(a+c)',r:R`h=\dfrac{2A}{a+c}`},{F:R`A=\dfrac{a+c}{2}\cdot h`,t:'c',a:'2A/h-a',r:R`c=\dfrac{2A}{h}-a`},
  {F:R`u=2(a+b)`,t:'a',a:'u/2-b',r:R`a=\dfrac{u}{2}-b`},{F:R`Z=\dfrac{K\cdot p\cdot t}{100}`,t:'K',a:'100Z/(p*t)',r:R`K=\dfrac{100Z}{p\cdot t}`},{F:R`y=mx+q`,t:'m',a:'(y-q)/x',r:R`m=\dfrac{y-q}{x}`},{F:R`F=m\cdot a`,t:'a',a:'F/m',r:R`a=\dfrac{F}{m}`},
  {F:R`s=\dfrac{a}{2}\,t^2`,t:'a',a:'2s/t^2',r:R`a=\dfrac{2s}{t^2}`},{F:R`A=\dfrac{g\cdot h}{2}`,t:'g',a:'2A/h',r:R`g=\dfrac{2A}{h}`},{F:R`U=R\cdot I`,t:'I',a:'U/R',r:R`I=\dfrac{U}{R}`},{F:R`\dfrac1f=\dfrac1g+\dfrac1b`,t:'g',a:'f*b/(b-f)',r:R`g=\dfrac{fb}{b-f}`},
];
function checkForm(s,T){let ast,ref;try{ast=algParse(s)}catch(e){return{ok:false,msg:'Eingabe nicht lesbar: '+e.message}}ref=algParse(T.a);
  if(algVars(ast).has(T.t))return{ok:false,msg:`Die gesuchte Grösse ${T.t} darf rechts nicht mehr vorkommen.`};
  const vars=new Set([...algVars(ref),...algVars(ast)]);
  for(let i=0;i<8;i++){const env={};vars.forEach(v=>env[v]=Math.round((Math.random()*4+0.6)*1000)/1000);const a=algEval(ast,env),b=algEval(ref,env);if(!isFinite(b))continue;if(!isFinite(a)||Math.abs(a-b)>1e-6*Math.max(1,Math.abs(b)))return{ok:false,msg:'Die Formel ist nicht richtig umgeformt.'}}return{ok:true}}
runTrainer({
  lin:{label:'Lineare Gleichung',gen(){const e=linRandom(false);return{q:`Löse: \\(${e.T}\\)`,ziel:'\\(x=\\)',ph:'z. B. 3',check:s=>checkNum(s,e.s),sol:solL(e.lines)}}},
  klammer:{label:'Gleichung mit Klammern',gen(){const e=linRandom(true);return{q:`Löse: \\(${e.T}\\)`,ziel:'\\(x=\\)',ph:'z. B. −2',check:s=>checkNum(s,e.s),sol:solL(e.lines)}}},
  brkoef:{label:'Gleichung mit Brüchen',gen(){let a,b;do{a=pick([2,3,4,5,6]);b=pick([2,3,4,5,6,8])}while(a===b);const L=lcm(a,b);const s=L*pick([1,2,3,-1]);const c=s/a+s/b;const sg=pick([1,-1]);const c2=s/a+sg*s/b;
    return{q:`Löse: \\(\\dfrac{x}{${a}}${sg>0?'+':'-'}\\dfrac{x}{${b}}=${c2}\\)`,ziel:'\\(x=\\)',ph:'z. B. 12',check:t=>checkNum(t,s),
      sol:`<p>mit dem Hauptnenner \\(${L}\\) multiplizieren: \\(${L/a}x${sg>0?'+':'-'}${L/b}x=${c2*L}\\)</p><p>\\(${L/a+sg*L/b}x=${c2*L}\\;\\Rightarrow\\;x=${s}\\)</p>`}}},
  bruch:{label:'Bruchgleichung',gen(){if(Math.random()<0.25){const p=rnd(1,6),k=pick([2,3,4]);return{q:`Löse: \\(\\dfrac{x}{x-${p}}=\\dfrac{${p}}{x-${p}}+${k}\\)`,ziel:'\\(\\mathbb{L}=\\)',ph:'Zahl oder {}',check:s=>checkNum(s,null),
        sol:`<p>\\(\\mathbb{D}=\\mathbb{R}\\setminus\\{${p}\\}\\). Mal \\((x-${p})\\): \\(x=${p}+${k}(x-${p})\\)</p><p>\\(x=${k}x-${(k-1)*p}\\;\\Rightarrow\\;${k-1}x=${(k-1)*p}\\;\\Rightarrow\\;x=${p}\\)</p><p>\\(${p}\\notin\\mathbb{D}\\), also \\(\\mathbb{L}=\\{\\,\\}\\).</p>`}}
    const e=bruchRandom();return{q:`Löse: \\(${e.lines[0][0]}\\)`,ziel:'\\(\\mathbb{L}=\\)',ph:'Zahl oder {}',check:s=>checkNum(s,e.sol),sol:solL(e.lines)}}},
  formel:{label:'Formel umformen',gen(){const T=pick(FORM);return{q:`Forme \\(${T.F}\\) nach \\(${T.t}\\) um.${T.hint?' '+T.hint:''}`,ziel:`\\(${T.t}=\\)`,ph:'z. B. 2A/h-a',check:s=>checkForm(s,T),sol:`<p>\\(${T.r}\\)</p><p class="hint" style="margin:0">Eingabe z. B.: <code>${T.a}</code></p>`}}},
  text:{label:'Textaufgabe',gen(){const t=rnd(1,3);
    if(t===1){const b=rnd(8,30),d=rnd(2,9);return{q:`Mia ist ${d} Jahre älter als Tom. Zusammen sind sie ${2*b+d} Jahre alt. Wie alt ist Tom?`,ziel:'Tom:',ph:'Jahre',check:s=>checkNum(s,b),
      sol:`<p>\\(x\\): Alter von Tom. \\(x+(x+${d})=${2*b+d}\\Rightarrow 2x=${2*b}\\Rightarrow x=${b}\\)</p><p>Tom ist ${b}, Mia ${b+d} Jahre alt.</p>`}}
    if(t===2){const w=rnd(3,12),d=rnd(1,8);return{q:`Ein Rechteck ist ${d} cm länger als breit. Sein Umfang beträgt ${4*w+2*d} cm. Wie breit ist es (in cm)?`,ziel:'Breite:',ph:'cm',check:s=>checkNum(s,w),
      sol:`<p>\\(x\\): Breite. \\(2x+2(x+${d})=${4*w+2*d}\\Rightarrow4x+${2*d}=${4*w+2*d}\\Rightarrow x=${w}\\)</p><p>Breite ${w} cm, Länge ${w+d} cm.</p>`}}
    const x=rnd(5,25),k=pick([2,3]),m=rnd(2,15);const tot=x+k*x+(x+m);return{q:`${tot} Fr. werden verteilt: Lea erhält ${k===2?'doppelt':'dreimal'} so viel wie Noah, Ivo ${m} Fr. mehr als Noah. Wie viel erhält Noah (in Fr.)?`,ziel:'Noah:',ph:'Fr.',check:s=>checkNum(s,x),
      sol:`<p>\\(x\\): Betrag von Noah. \\(x+${k}x+(x+${m})=${tot}\\Rightarrow${k+2}x=${tot-m}\\Rightarrow x=${x}\\)</p>`}}}
});
runQuiz(['22']);
