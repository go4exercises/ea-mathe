"use strict";
/* ======================= 2.3 Geometrie ======================= */
/* ---------- Hilfen ---------- */
function ccInt(c1,r1,c2,r2){const d=V.dist(c1,c2);if(d>r1+r2+1e-9||d<Math.abs(r1-r2)-1e-9||d<1e-9)return[];const a=(r1*r1-r2*r2+d*d)/(2*d);const h=Math.sqrt(Math.max(0,r1*r1-a*a));
  const u=V.norm(V.sub(c2,c1)),p=V.add(c1,V.mul(u,a)),n=V.perp(u);return h<1e-9?[p]:[V.add(p,V.mul(n,h)),V.sub(p,V.mul(n,h))]}
function clInt(c,r,p,d){const u=V.norm(d);const w=V.sub(p,c);const b=V.dot(w,u),q=V.dot(w,w)-r*r;const D=b*b-q;if(D<-1e-9)return[];const s=Math.sqrt(Math.max(0,D));return D<1e-9?[V.add(p,V.mul(u,-b))]:[V.add(p,V.mul(u,-b-s)),V.add(p,V.mul(u,-b+s))]}
const distLine=(P,p,d)=>Math.abs(V.cross(V.norm(d),V.sub(P,p)));
/* Zirkelbogen um c durch die Nähe von Punkt q (±span Grad), Anteil t */
function compArc(f,c,r,q,span=28,t=1,o={}){const a=V.ang(V.sub(q,c));const s=span*PI/180;const a1=a-s,a2=a-s+2*s*t;if(t<=0)return;f.arc(c,a1,a2,r,Object.assign({c:o.c||'#7a6a9c',w:1.5},o));
  if(o.lab&&t>=1){let e=a2+0.08;if(o.away){const p1=V.add(c,V.mul(V.dir(a1-0.08),r)),p2=V.add(c,V.mul(V.dir(a2+0.08),r));if(V.dist(p1,o.away)>V.dist(p2,o.away))e=a1-0.08}const p=V.add(c,V.mul(V.dir(e),r+0.32));f.text(p,o.lab,'lbl',{fontSize:'15px',fill:o.c||'#7a6a9c'})}}
function lab(f,p,s,from,o={}){const d=V.norm(V.sub(p,from));return f.text(V.add(p,V.mul(d,o.r||0.45)),s,'lbl',o.st)}
const VI='#7a6a9c',VIH='#e7e1f1';
function repList(id,items,n){const ol=$(id);ol.innerHTML=items.slice(0,n).map((t,i)=>`<li class="${i<n-1?'done':'cur'}">\\(${t}\\)</li>`).join('');typesetEl(ol)}

/* ======================= 1a Ortslinien entdecken ======================= */
(function(){
  const f=new Fig($('f1'),{h:420});let mode='k',trail=[],show=0;
  const M={x:0,y:0},RAD=3,A={x:-2.5,y:-1.5},B={x:2.5,y:1},S={x:-0.5,y:-0.8},G1=V.dir(0.25),G2=V.dir(1.25),GP={x:-7,y:-1.2},GD={x:1,y:0.22},DD=2;
  const H={P:{x:3.6,y:2.6}};f.handle(H,'P');
  function cond(Q){if(mode==='k'){const v=V.dist(Q,M);return{ok:Math.abs(v-RAD)<0.07,txt:`\\(|\\overline{MP}|=${fmt(v)}\\text{ cm}\\), \\(r=3.0\\text{ cm}\\)`}}
    if(mode==='m'){const a=V.dist(Q,A),b=V.dist(Q,B);return{ok:Math.abs(a-b)<0.07,txt:`\\(|\\overline{PA}|=${fmt(a)}\\text{ cm}\\), \\(|\\overline{PB}|=${fmt(b)}\\text{ cm}\\)`}}
    if(mode==='w'){const a=distLine(Q,S,G1),b=distLine(Q,S,G2);return{ok:Math.abs(a-b)<0.07,txt:`Abstand von \\(g\\): \\(${fmt(a)}\\text{ cm}\\), von \\(h\\): \\(${fmt(b)}\\text{ cm}\\)`}}
    const a=distLine(Q,GP,GD);return{ok:Math.abs(a-DD)<0.07,txt:`Abstand von \\(g\\): \\(${fmt(a)}\\text{ cm}\\), verlangt \\(d=2.0\\text{ cm}\\)`}}
  f.draw=()=>{const Q=H.P;const c=cond(Q);const GR=C.gr;
    if(show>0){const t=ease(show);const st={c:GR,w:3,o:0.85};
      if(mode==='k')f.arc(M,0,2*PI*t,RAD,st);
      if(mode==='m'){const m=V.mid(A,B),d=V.perp(V.sub(B,A));f.line(m,d,Object.assign({},st,{o:0.85*t}))}
      if(mode==='w'){const b1=V.norm(V.add(G1,G2)),b2=V.perp(b1);f.line(S,b1,Object.assign({},st,{o:0.85*t}));f.line(S,b2,Object.assign({},st,{o:0.85*t,d:'9 6'}))}
      if(mode==='p'){const n=V.mul(V.perp(V.norm(GD)),DD);f.line(V.add(GP,n),GD,Object.assign({},st,{o:0.85*t}));f.line(V.sub(GP,n),GD,Object.assign({},st,{o:0.85*t}))}}
    trail.forEach(p=>f.dot(p,3.2,GR,0.8));
    if(mode==='k'){f.dot(M,4);lab(f,M,'M',{x:0.3,y:0.4});f.seg(M,Q,{c:C.blau,w:1.8,d:'5 4'})}
    if(mode==='m'){f.seg(A,B,{w:2.2});f.dot(A,4);f.dot(B,4);lab(f,A,'A',B);lab(f,B,'B',A);f.seg(A,Q,{c:C.blau,w:1.8,d:'5 4'});f.seg(B,Q,{c:C.or,w:1.8,d:'5 4'})}
    if(mode==='w'){f.line(S,G1,{w:2.2});f.line(S,G2,{w:2.2});f.text(V.add(S,V.mul(G1,6.5)),'g','lbl');f.text(V.add(S,V.mul(G2,4.4)),'h','lbl');
      const F1=footOf(Q,S,V.add(S,G1)).p,F2=footOf(Q,S,V.add(S,G2)).p;f.seg(Q,F1,{c:C.blau,w:1.8,d:'5 4'});f.seg(Q,F2,{c:C.or,w:1.8,d:'5 4'});
      f.rmark(F1,V.ang(V.sub(Q,F1))-(V.cross(G1,V.sub(Q,F1))>0?PI/2:0),0.3);f.rmark(F2,V.ang(V.sub(Q,F2))-(V.cross(G2,V.sub(Q,F2))>0?PI/2:0),0.3)}
    if(mode==='p'){f.line(GP,GD,{w:2.2});f.text(V.add(GP,V.mul(V.norm(GD),13.6)),'g','lbl');const F=footOf(Q,GP,V.add(GP,GD)).p;f.seg(Q,F,{c:C.blau,w:1.8,d:'5 4'});
      f.rmark(F,V.ang(V.sub(Q,F))-(V.cross(GD,V.sub(Q,F))>0?PI/2:0),0.3)}
    f.dot(Q,5,c.ok?GR:C.ink);lab(f,Q,'P',{x:Q.x-0.4,y:Q.y-0.4},{st:{fill:c.ok?GR:C.ink}});
    $('r1').innerHTML=c.txt+(c.ok?' <b class="ok">✓ Bedingung erfüllt</b>':'');typesetEl($('r1'))};
  f.onend=null;
  const oldMove=f.move.bind(f);f.move=e=>{oldMove(e);if(f.drag){const c=cond(H.P);if(c.ok&&!trail.some(p=>V.dist(p,H.P)<0.18)){trail.push({x:H.P.x,y:H.P.y});f.render()}}};
  btnGroup('#ortslinien [data-o]','o',v=>{mode=v;trail=[];show=0;rowsOn('o1tab','o',v);H.P={x:mode==='w'?2.5:3.6,y:mode==='p'?2.4:2.6};f.render()});
  $('o1show').addEventListener('click',()=>tween(1200,t=>{show=t;f.render()}));$('o1clr').addEventListener('click',()=>{trail=[];show=0;f.render()});
  rowsOn('o1tab','o','k');f.render();
})();

/* ======================= 1b Zwei Ortslinien ======================= */
(function(){
  const f=new Fig($('f2'),{h:420});let T,n=0,k=1;
  const TASKS=[
    {q:'Gesucht sind alle Punkte \\(P\\), die von \\(A\\) und \\(B\\) gleich weit entfernt sind <b>und</b> vom Punkt \\(C\\) den Abstand 3 cm haben.',
      A:{x:-3,y:-2},B:{x:3,y:-2},C:{x:1.5,y:1},
      rep:[R`m_{AB}\quad\text{(gleich weit von }A\text{ und }B)`,R`k(C;\,3\text{ cm})\quad\text{(Abstand 3 cm von }C)`,R`\{P_1,\,P_2\}=m_{AB}\cap k`],
      draw(f,n,t,T){f.seg(T.A,T.B,{w:2});[['A',T.A,T.B],['B',T.B,T.A]].forEach(([s,p,q])=>{f.dot(p,4);lab(f,p,s,q)});f.dot(T.C,4);lab(f,T.C,'C',{x:2,y:0});
        const m=V.mid(T.A,T.B),d={x:0,y:1};
        if(n>=1){compArc(f,T.A,4.2,{x:0,y:2},18,n>1?1:t,{c:'#9b8cbd'});compArc(f,T.B,4.2,{x:0,y:2},18,n>1?1:t,{c:'#9b8cbd'});compArc(f,T.A,4.2,{x:0,y:-6},14,n>1?1:t,{c:'#9b8cbd'});compArc(f,T.B,4.2,{x:0,y:-6},14,n>1?1:t,{c:'#9b8cbd'});
          if(n>1||t>=1){f.line(m,d,{c:C.blau,w:2.2});f.text({x:0.45,y:4.7},'m_AB','lbl',{fill:C.blau})}}
        if(n>=2){f.arc(T.C,0,2*PI*(n>2?1:t),3,{c:C.or,w:2.2});if(n>2||t>=1)f.text({x:T.C.x+2.4,y:T.C.y+2.2},'k','lbl',{fill:C.or})}
        if(n>=3&&t>0){clInt(T.C,3,m,d).forEach((p,i)=>{f.dot(p,6,C.rot);f.text({x:p.x-0.55,y:p.y+(i?-0.3:0.3)},'P_'+(i+1),'lbl',{fill:C.rot})})}}},
    {q:'Gesucht sind alle Punkte \\(P\\), die von den Geraden \\(g\\) und \\(h\\) gleich weit entfernt sind <b>und</b> vom Schnittpunkt \\(S\\) den Abstand 3 cm haben.',
      S:{x:-0.5,y:-0.3},g:V.dir(0.2),h:V.dir(1.35),
      rep:[R`w_1,\,w_2\quad\text{(die Winkelhalbierenden von }g\text{ und }h)`,R`k(S;\,3\text{ cm})`,R`\{P_1,\,P_2,\,P_3,\,P_4\}=(w_1\cup w_2)\cap k`],
      draw(f,n,t,T){f.line(T.S,T.g,{w:2});f.line(T.S,T.h,{w:2});f.text(V.add(T.S,V.mul(T.g,7)),'g','lbl');f.text(V.add(T.S,V.mul(T.h,4.6)),'h','lbl');f.dot(T.S,4);lab(f,T.S,'S',{x:T.S.x+1,y:T.S.y+0.6});
        const b1=V.norm(V.add(T.g,T.h)),b2=V.perp(b1);
        if(n>=1){const tt=n>1?1:t;f.line(T.S,b1,{c:C.blau,w:2.2,o:tt});f.line(T.S,b2,{c:C.blau,w:2.2,o:tt});if(tt>=1){f.text(V.add(T.S,V.mul(b1,5)),'w_1','lbl',{fill:C.blau});f.text(V.add(T.S,V.mul(b2,4.3)),'w_2','lbl',{fill:C.blau})}}
        if(n>=2){f.arc(T.S,0,2*PI*(n>2?1:t),3,{c:C.or,w:2.2});if(n>2||t>=1)f.text(V.add(T.S,V.mul(V.dir(-0.6),3.4)),'k','lbl',{fill:C.or})}
        if(n>=3&&t>0)[b1,b2].forEach((b,j)=>[1,-1].forEach((sg,i)=>{const p=V.add(T.S,V.mul(b,3*sg));f.dot(p,6,C.rot);f.text(V.add(p,V.mul(V.perp(b),0.45)),'P_'+(j*2+i+1),'lbl',{fill:C.rot})}))}},
    {q:'Gesucht sind alle Punkte \\(P\\), die von der Geraden \\(g\\) den Abstand 1.5 cm haben <b>und</b> von \\(A\\) und \\(B\\) gleich weit entfernt sind.',
      A:{x:-4,y:2},B:{x:1,y:-2.5},GP:{x:-7,y:-0.5},GD:{x:1,y:0},
      rep:[R`p_1,\,p_2\quad\text{(Parallelen zu }g\text{ im Abstand 1.5 cm)}`,R`m_{AB}`,R`\{P_1,\,P_2\}=(p_1\cup p_2)\cap m_{AB}`],
      draw(f,n,t,T){f.line(T.GP,T.GD,{w:2});f.text({x:7.2,y:-0.15},'g','lbl');f.dot(T.A,4);f.dot(T.B,4);lab(f,T.A,'A',T.B);lab(f,T.B,'B',T.A);
        const tt=n>1?1:t;
        if(n>=1){[1.5,-1.5].forEach((d,i)=>{f.line({x:0,y:-0.5+d},T.GD,{c:C.blau,w:2.2,o:tt});if(tt>=1)f.text({x:7.2,y:-0.5+d+0.3},'p_'+(i+1),'lbl',{fill:C.blau})});
          f.seg({x:5.5,y:-0.5},{x:5.5,y:1},{c:C.blau,w:1.4,me:'b'});if(tt>=1)f.text({x:5.95,y:0.25},'1.5','ann',{fill:C.blau})}
        const m=V.mid(T.A,T.B),d=V.perp(V.sub(T.B,T.A));
        if(n>=2){const t2=n>2?1:t;f.line(m,d,{c:C.or,w:2.2,o:t2});f.seg(T.A,T.B,{c:'#bbb',w:1,d:'3 3'});if(t2>=1)f.text(V.add(m,V.mul(V.norm(d),4.6)),'m_AB','lbl',{fill:C.or})}
        if(n>=3&&t>0)[1,-2].forEach((y,i)=>{const p=lineX(m,d,{x:0,y},T.GD);f.dot(p,6,C.rot);f.text({x:p.x+0.6,y:p.y+0.35},'P_'+(i+1),'lbl',{fill:C.rot})})}}];
  f.draw=()=>{if(T)T.draw(f,n,k,T)};
  function load(){T=TASKS[+$('o2sel').value];n=0;k=1;$('o2q').innerHTML=T.q;typesetEl($('o2q'));repList('o2rep',T.rep,0);f.render()}
  $('o2sel').innerHTML=TASKS.map((t,i)=>`<option value="${i}">Aufgabe ${i+1}</option>`).join('');$('o2sel').addEventListener('change',load);$('o2back').addEventListener('click',load);
  $('o2step').addEventListener('click',()=>{if(n>=T.rep.length)return;n++;repList('o2rep',T.rep,n);k=0;tween(1100,t=>{k=t;f.render()},()=>{k=1;f.render()})});load();
})();

/* ======================= 2a Thaleskreis ======================= */
(function(){
  const f=new Fig($('f3'),{h:440,oy:210});const A={x:-4,y:-1.6},B={x:4,y:-1.6},M=V.mid(A,B),RR=4;const P={C:V.add(M,V.mul(V.dir(1.95),RR))};let pr=0;
  f.handle(P,'C',{constrain:p=>{const d=V.dist(p,M);if(Math.abs(d-RR)<0.14)p=V.add(M,V.mul(V.norm(V.sub(p,M)),RR));if(p.y<M.y+0.5)p.y=M.y+0.5;return p}});
  f.draw=()=>{const Cc=P.C;const d=V.dist(Cc,M);const on=Math.abs(d-RR)<1e-6;const w=ang2(Cc,A,B);
    const col=on?C.gr:d<RR?C.rot:C.blau;
    f.circ(M,RR,{c:'#9b8cbd',w:1.6,d:'7 5'});f.seg(A,B,{w:2.2});f.dot(M,3.5);f.text({x:M.x,y:M.y-0.45},'M','lbl');
    f.poly([A,B,Cc],{c:C.ink,w:2,f:'rgba(122,106,156,.08)'});
    if(pr>=1&&on){f.seg(M,Cc,{c:VI,w:2});f.ticks(M,A,1,VI);f.ticks(M,B,1,VI);f.ticks(M,Cc,1,VI)}
    if(pr>=2&&on){const a=ang2(A,B,Cc),b=ang2(B,Cc,A);f.angle(A,a.a1,a.a2,{r:1.1,c:C.or,f:'#f9e0c3',lab:'α'});f.angle(B,b.a1,b.a2,{r:1.1,c:C.gr,f:'#cde8d8',lab:'β'});
      const c1=ang2(Cc,A,M),c2=ang2(Cc,M,B);f.angle(Cc,c1.a1,c1.a2,{r:1.0,c:C.or,f:'#f9e0c3',lab:'α',right:false});f.angle(Cc,c2.a1,c2.a2,{r:1.0,c:C.gr,f:'#cde8d8',lab:'β',right:false})}
    else f.angle(Cc,w.a1,w.a2,{r:0.8,rr:0.8,c:col,f:on?'#cde8d8':d<RR?'#f6d2cf':'#cfe3f1',lab:on?null:'γ'});
    f.dot(A,4);f.dot(B,4);f.dot(Cc,5,col);lab(f,A,'A',B);lab(f,B,'B',A);lab(f,Cc,'C',M,{st:{fill:col}});
    const r=$('r3');let h=`\\(\\gamma=${gr(w.deg)}\\)`.replace('°','^\\circ')+` &nbsp; ${on?'<b class="ok">C auf dem Thaleskreis: rechter Winkel</b>':d<RR?'C innerhalb: γ > 90°':'C ausserhalb: γ < 90°'}`;
    if(pr>=1)h+=on?'<br>1. \\(|\\overline{MA}|=|\\overline{MB}|=|\\overline{MC}|=r\\): Die Dreiecke \\(AMC\\) und \\(MBC\\) sind gleichschenklig.':'<br><span class="warn">Ziehe C auf den Kreis, um den Beweis zu sehen.</span>';
    if(pr>=2&&on)h+='<br>2. Basiswinkel sind gleich: bei \\(A\\) und \\(C\\) je \\(\\alpha\\), bei \\(B\\) und \\(C\\) je \\(\\beta\\). Also ist \\(\\gamma=\\alpha+\\beta\\).';
    if(pr>=3&&on)h+='<br>3. Winkelsumme im Dreieck \\(ABC\\): \\(\\alpha+\\beta+(\\alpha+\\beta)=180^\\circ\\)<br>\\(\\Rightarrow\\;2(\\alpha+\\beta)=180^\\circ\\;\\Rightarrow\\;\\gamma=\\alpha+\\beta=90^\\circ\\)';
    if(r.dataset.h!==h){r.dataset.h=h;r.innerHTML=h;typesetEl(r)}};
  $('t3step').addEventListener('click',()=>{if(pr<3){pr++;f.render()}});$('t3back').addEventListener('click',()=>{pr=0;f.render()});f.render();
})();

/* ======================= 2b Tangenten ======================= */
(function(){
  const f=new Fig($('f4'),{h:400});const P={M:{x:-2.6,y:-0.3},P:{x:4.2,y:1.2}};const RR=2.3;let n=0,k=1;
  f.handle(P,'M');f.handle(P,'P');
  const REP=[R`\overline{MP}`,R`H=m_{MP}\cap\overline{MP}\quad\text{(Mittelpunkt)}`,R`k_T(H;\,|\overline{HM}|)\quad\text{(Thaleskreis)}`,R`\{T_1,\,T_2\}=k\cap k_T`,R`t_1=PT_1,\;\;t_2=PT_2`];
  f.draw=()=>{const M=P.M,Q=P.P;f.circ(M,RR,{c:C.ink,w:2.2});f.dot(M,4);lab(f,M,'M',Q);f.dot(Q,4);lab(f,Q,'P',M);f.text(V.add(M,V.mul(V.dir(2.3),RR+0.35)),'k','lbl');
    const inside=V.dist(M,Q)<=RR+0.05;if(inside){f.text({x:0,y:-4.3},'P liegt im Kreis: keine Tangente möglich.','ann',{fill:C.rot,fontSize:'15px'});return}
    const H=V.mid(M,Q),rT=V.dist(M,Q)/2;const tt=i=>n>i?1:n===i?k:0;
    if(n>=1)f.seg(M,V.lerp(M,Q,tt(1)),{c:VI,w:1.8});
    if(n>=2){const r0=V.dist(M,Q)*0.68;const up=V.add(H,V.mul(V.perp(V.norm(V.sub(Q,M))),3)),dn=V.sub(H,V.mul(V.perp(V.norm(V.sub(Q,M))),3));
      [M,Q].forEach(c=>{compArc(f,c,r0,up,14,tt(2),{c:'#9b8cbd'});compArc(f,c,r0,dn,14,tt(2),{c:'#9b8cbd'})});
      if(tt(2)>=1){const X=ccInt(M,r0,Q,r0);if(X.length===2)f.seg(X[0],X[1],{c:'#9b8cbd',w:1.3,d:'5 4'});f.dot(H,4.5,VI);f.text(V.add(H,{x:0.3,y:-0.4}),'H','lbl',{fill:VI})}}
    if(n>=3){f.arc(H,V.ang(V.sub(M,H)),V.ang(V.sub(M,H))+2*PI*tt(3),rT,{c:C.blau,w:2,d:'8 5'});if(tt(3)>=1)f.text(V.add(H,V.mul(V.dir(1.2),rT+0.35)),'k_T','lbl',{fill:C.blau})}
    const T=ccInt(M,RR,H,rT);
    if(n>=4&&tt(4)>0)T.forEach((p,i)=>{f.dot(p,6,C.rot);f.text(V.add(p,V.mul(V.norm(V.sub(p,M)),0.5)),'T_'+(i+1),'lbl',{fill:C.rot})});
    if(n>=5)T.forEach((p,i)=>{const d=V.sub(p,Q);f.seg(V.sub(Q,V.mul(d,0.25*tt(5))),V.add(Q,V.mul(d,1.45*tt(5))),{c:C.or,w:2.6});f.seg(M,p,{c:'#888',w:1.4,d:'4 3'});
      if(tt(5)>=1){const a=V.ang(V.sub(M,p));const s=V.cross(V.sub(M,p),V.sub(Q,p))>0?0:-PI/2;f.rmark(p,a+s,0.38,C.rot);f.text(V.add(Q,V.mul(d,1.55)),'t_'+(i+1),'lbl',{fill:C.or})}})};
  const reset=()=>{n=0;k=1;repList('t4rep',REP,0);f.render()};f.onstart=()=>{};
  $('t4step').addEventListener('click',()=>{if(n>=5)return;n++;repList('t4rep',REP,n);k=0;tween(1000,t=>{k=t;f.render()},()=>{k=1;f.render()})});$('t4back').addEventListener('click',reset);reset();
})();

/* ======================= 3 Dreieckskonstruktionen ======================= */
(function(){
  const f=new Fig($('f5'),{h:440,oy:240});let kind='sss',n=0,k=1;
  const V0={sss:{a:5,b:4,c:6},sws:{b:5,c:6,al:50},wsw:{c:6,al:50,be:60},ssw:{c:6,a:4.5,al:40}};let D=JSON.parse(JSON.stringify(V0));
  const SL={sss:[['a',3,8,0.5,'a','cm'],['b',3,8,0.5,'b','cm'],['c',4,9,0.5,'c','cm']],sws:[['b',3,8,0.5,'b','cm'],['c',4,9,0.5,'c','cm'],['al',20,140,5,'α','°']],
    wsw:[['c',4,9,0.5,'c','cm'],['al',20,120,5,'α','°'],['be',20,120,5,'β','°']],ssw:[['c',4,9,0.5,'c','cm'],['a',1.5,9,0.25,'a','cm'],['al',20,80,5,'α','°']]};
  const Y0=-3.4;
  function geo(){const d=D[kind];const c=d.c;const A={x:-c/2,y:Y0},B={x:c/2,y:Y0};let Cs=[],ray=null,ray2=null,note='';
    if(kind==='sss'){Cs=ccInt(A,d.b,B,d.a).filter(p=>p.y>Y0);if(!Cs.length)note=`Kein Dreieck: ${fmt(d.a)} + ${fmt(d.b)} ${d.a+d.b<=c?'≤':'>'} ${fmt(c)}. Zwei Seiten zusammen müssen länger sein als die dritte.`;}
    if(kind==='sws'){ray=V.dir(d.al*PI/180);Cs=[V.add(A,V.mul(ray,d.b))]}
    if(kind==='wsw'){ray=V.dir(d.al*PI/180);ray2=V.dir(PI-d.be*PI/180);const X=d.al+d.be<180?lineX(A,ray,B,ray2):null;if(X)Cs=[X];else note=`Kein Dreieck: α + β = ${d.al+d.be}° ≥ 180°.`}
    if(kind==='ssw'){ray=V.dir(d.al*PI/180);Cs=clInt(B,d.a,A,ray).filter(p=>V.dot(V.sub(p,A),ray)>1e-6);
      if(!Cs.length)note='Keine Lösung: Der Kreis um B erreicht den Strahl nicht.';else if(Cs.length===2)note='Zwei Lösungen \\(C_1\\) und \\(C_2\\): Der Winkel α liegt der kleineren Seite gegenüber (a < c).';else note=d.a>=c?'Genau eine Lösung: α liegt der grösseren Seite gegenüber (a ≥ c).':'Genau eine Lösung: Der Kreis berührt den Strahl.'}
    return{A,B,Cs,ray,ray2,note,d}}
  function steps(){const d=D[kind];const cm=v=>`${fmt(v)}\\text{ cm}`;
    if(kind==='sss')return[R`c=\overline{AB},\;|\overline{AB}|=${cm(d.c)}`,R`k_1(A;\,b=${cm(d.b)})`,R`k_2(B;\,a=${cm(d.a)})`,R`C\in k_1\cap k_2`,R`\text{Dreieck }ABC`];
    if(kind==='sws')return[R`c=\overline{AB},\;|\overline{AB}|=${cm(d.c)}`,R`\alpha=${d.al}^\circ\text{ in }A\text{ antragen: Strahl }s`,R`k(A;\,b=${cm(d.b)})`,R`C=k\cap s`,R`\text{Dreieck }ABC`];
    if(kind==='wsw')return[R`c=\overline{AB},\;|\overline{AB}|=${cm(d.c)}`,R`\alpha=${d.al}^\circ\text{ in }A\text{ antragen: Strahl }s_A`,R`\beta=${d.be}^\circ\text{ in }B\text{ antragen: Strahl }s_B`,R`C=s_A\cap s_B`,R`\text{Dreieck }ABC`];
    return[R`c=\overline{AB},\;|\overline{AB}|=${cm(d.c)}`,R`\alpha=${d.al}^\circ\text{ in }A\text{ antragen: Strahl }s`,R`k(B;\,a=${cm(d.a)})`,R`C\in k\cap s`,R`\text{Dreieck }ABC`]}
  f.draw=()=>{const G=geo();const{A,B,Cs,ray,ray2,d}=G;const tt=i=>n>i?1:n===i?k:0;const L=12;
    if(n>=1){f.seg(A,V.lerp(A,B,tt(1)),{w:2.6});f.dot(A,4);if(tt(1)>=1){f.dot(B,4);f.text({x:A.x-0.35,y:A.y-0.35},'A','lbl');f.text({x:B.x+0.35,y:B.y-0.35},'B','lbl');f.text({x:0,y:Y0-0.45},'c','lbl')}}
    const C0=Cs[0]||{x:0,y:Y0+3};
    if(kind==='sss'){if(n>=2){if(Cs.length)compArc(f,A,d.b,C0,22,tt(2),{lab:'k_1',away:B});else f.arc(A,0,PI*tt(2),d.b,{c:VI,w:1.5})}
      if(n>=3){if(Cs.length)compArc(f,B,d.a,C0,22,tt(3),{lab:'k_2',away:A});else f.arc(B,0,PI*tt(3),d.a,{c:VI,w:1.5})}}
    if(kind==='sws'||kind==='ssw'||kind==='wsw'){if(n>=2){f.seg(A,V.add(A,V.mul(ray,L*tt(2))),{c:VI,w:1.8});if(tt(2)>=1){f.angle(A,0,d.al*PI/180,{r:0.9,c:VI,f:VIH,lab:'α'});f.text(V.add(A,V.mul(ray,Math.min(9,(4.6-Y0)/Math.max(ray.y,0.3)))),kind==='wsw'?'s_A':'s','lbl',{fill:VI})}}}
    if(kind==='wsw'&&n>=3){f.seg(B,V.add(B,V.mul(ray2,L*tt(3))),{c:VI,w:1.8});if(tt(3)>=1){f.angle(B,PI-d.be*PI/180,PI,{r:0.9,c:VI,f:VIH,lab:'β'});f.text(V.add(B,V.mul(ray2,Math.min(9,(4.6-Y0)/Math.max(ray2.y,0.3)))),'s_B','lbl',{fill:VI})}}
    if(kind==='sws'&&n>=3)compArc(f,A,d.b,C0,22,tt(3),{lab:'k',away:B});
    if(kind==='ssw'&&n>=3){if(Cs.length===2){const a1=V.ang(V.sub(Cs[0],B)),a2=V.ang(V.sub(Cs[1],B));const lo=Math.min(a1,a2)-0.25,hi=Math.max(a1,a2)+0.25;f.arc(B,lo,lo+(hi-lo)*tt(3),d.a,{c:VI,w:1.5})}
      else if(Cs.length===1)compArc(f,B,d.a,C0,24,tt(3),{lab:'k',away:A});else f.arc(B,0,PI*tt(3),d.a,{c:VI,w:1.5});if(tt(3)>=1&&Cs.length)f.text(V.add(B,V.mul(V.dir(1.2),d.a+0.35)),'k','lbl',{fill:VI})}
    if(n>=4&&tt(4)>0)Cs.forEach((p,i)=>{f.dot(p,6,C.rot);f.text(V.add(p,{x:0.05,y:0.45}),Cs.length>1?'C_'+(i+1):'C','lbl',{fill:C.rot})});
    if(n>=5&&tt(5)>0)Cs.forEach((p,i)=>{f.poly([A,B,p],{c:i?C.or:C.blau,w:2.4,f:i?'rgba(217,130,43,.12)':'rgba(47,120,168,.12)',o:tt(5)});
      if(tt(5)>=1){const mb=V.mid(B,p),mc=V.mid(A,p);const nb=V.norm(V.perp(V.sub(p,B))),nc=V.norm(V.perp(V.sub(A,p)));f.text(V.add(mb,V.mul(nb,0.4)),'a','lbl',{fill:i?C.or:C.blau});f.text(V.add(mc,V.mul(nc,0.4)),'b','lbl',{fill:i?C.or:C.blau})}})};
  function info(){const d=D[kind];const t={sss:`Gegeben: \\(a=${fmt(d.a)}\\) cm, \\(b=${fmt(d.b)}\\) cm, \\(c=${fmt(d.c)}\\) cm (SSS)`,sws:`Gegeben: \\(b=${fmt(d.b)}\\) cm, \\(c=${fmt(d.c)}\\) cm, \\(\\alpha=${d.al}^\\circ\\) (SWS)`,
      wsw:`Gegeben: \\(c=${fmt(d.c)}\\) cm, \\(\\alpha=${d.al}^\\circ\\), \\(\\beta=${d.be}^\\circ\\) (WSW)`,ssw:`Gegeben: \\(c=${fmt(d.c)}\\) cm, \\(a=${+d.a}\\) cm, \\(\\alpha=${d.al}^\\circ\\) (SsW: \\(a\\) liegt \\(\\alpha\\) gegenüber)`}[kind];
    const G=geo();$('d5q').innerHTML=t+(n>=4&&G.note?`<br><span class="${G.Cs.length===1&&kind!=='ssw'?'':'warn'}">${G.note}</span>`:'')+(n===0?'<br><span class="hint" style="margin:0">Wie gehst du vor? Klicke auf «Schritt ›».</span>':'');typesetEl($('d5q'))}
  function sliders(){$('d5sl').innerHTML=SL[kind].map(([key,lo,hi,st,nm,u])=>`<label class="sld">${nm} = <input type="range" min="${lo}" max="${hi}" step="${st}" value="${D[kind][key]}" data-k="${key}"><b>${D[kind][key]} ${u}</b></label>`).join('');
    $('d5sl').querySelectorAll('input').forEach(inp=>inp.addEventListener('input',()=>{D[kind][inp.dataset.k]=+inp.value;inp.nextElementSibling.textContent=inp.value+' '+(inp.dataset.k.length>1?'°':'cm');reset()}))}
  function reset(){n=0;k=1;repList('d5rep',steps(),0);info();f.render()}
  function step(){if(n>=5)return;n++;repList('d5rep',steps(),n);info();k=0;tween(900,t=>{k=t;f.render()},()=>{k=1;f.render();info()})}
  btnGroup('#dreieck [data-k]','k',v=>{kind=v;sliders();reset()});$('d5step').addEventListener('click',step);$('d5back').addEventListener('click',reset);
  $('d5all').addEventListener('click',()=>{n=5;k=1;repList('d5rep',steps(),5);info();f.render()});sliders();reset();
})();

/* ======================= 4 Haus der Vierecke ======================= */
const QT={
  allg:{n:'allgemeines Viereck',p:[{x:-3.6,y:-2},{x:3,y:-2.5},{x:2.3,y:2},{x:-2.4,y:1.3}]},
  trapez:{n:'Trapez',p:[{x:-3.6,y:-2},{x:3.6,y:-2},{x:1.9,y:1.6},{x:-2.4,y:1.6}]},
  gltrapez:{n:'gleichschenkliges Trapez',p:[{x:-3.6,y:-2},{x:3.6,y:-2},{x:2,y:1.6},{x:-2,y:1.6}]},
  drachen:{n:'Drachenviereck',p:[{x:-3.8,y:-0.2},{x:0,y:-2.3},{x:2.1,y:-0.2},{x:0,y:1.9}]},
  parall:{n:'Parallelogramm',p:[{x:-3.6,y:-2},{x:2.4,y:-2},{x:3.6,y:1.6},{x:-2.4,y:1.6}]},
  rechteck:{n:'Rechteck',p:[{x:-3.2,y:-2},{x:3.2,y:-2},{x:3.2,y:1.6},{x:-3.2,y:1.6}]},
  raute:{n:'Raute (Rhombus)',p:[{x:-3.5,y:-0.2},{x:0,y:-2.2},{x:3.5,y:-0.2},{x:0,y:1.8}]},
  quadrat:{n:'Quadrat',p:[{x:-2,y:-2.1},{x:2,y:-2.1},{x:2,y:1.9},{x:-2,y:1.9}]}};
const QP=[['mindestens ein Paar paralleler Gegenseiten',['trapez','gltrapez','parall','rechteck','raute','quadrat']],['zwei Paare paralleler Gegenseiten',['parall','rechteck','raute','quadrat']],
  ['Gegenseiten gleich lang',['parall','rechteck','raute','quadrat']],['alle Seiten gleich lang',['raute','quadrat']],['zwei Paare gleich langer Nachbarseiten',['drachen','raute','quadrat']],
  ['alle Winkel 90°',['rechteck','quadrat']],['Gegenwinkel gleich gross',['parall','rechteck','raute','quadrat']],['Winkel an einer Grundseite gleich gross',['gltrapez','rechteck','quadrat']],
  ['Diagonalen halbieren sich',['parall','rechteck','raute','quadrat']],['Diagonalen stehen senkrecht aufeinander',['drachen','raute','quadrat']],['Diagonalen gleich lang',['gltrapez','rechteck','quadrat']],
  ['achsensymmetrisch',['gltrapez','drachen','rechteck','raute','quadrat']],['punktsymmetrisch',['parall','rechteck','raute','quadrat']]];
const AXES={allg:0,trapez:0,gltrapez:1,drachen:1,parall:0,rechteck:2,raute:2,quadrat:4};
(function(){
  const H=new Fig($('f6a'),{w:640,h:300,s:1,ox:0,oy:300,grid:false});let cur='allg',show=false;
  const N={allg:[320,28],trapez:[190,88],drachen:[470,88],gltrapez:[98,152],parall:[300,152],rechteck:[190,214],raute:[410,214],quadrat:[300,274]};
  const E=[['allg','trapez'],['allg','drachen'],['trapez','gltrapez'],['trapez','parall'],['gltrapez','rechteck'],['parall','rechteck'],['parall','raute'],['drachen','raute'],['rechteck','quadrat'],['raute','quadrat']];
  const short={allg:'Viereck',trapez:'Trapez',drachen:'Drachenviereck',gltrapez:'gleichschenkl. Trapez',parall:'Parallelogramm',rechteck:'Rechteck',raute:'Raute',quadrat:'Quadrat'};
  H.draw=()=>{const W=150,h=32;E.forEach(([a,b])=>{const[x1,y1]=N[a],[x2,y2]=N[b];H.seg({x:x1,y:300-y1-h/2},{x:x2,y:300-y2+h/2},{c:'#b9aed0',w:1.6})});
    for(const k in N){const[x,y]=N[k];const g=mk('g',{style:'cursor:pointer'},H.g);const on=k===cur;
      const Wk=k==='gltrapez'?172:W;mk('rect',{x:x-Wk/2,y:y-h/2,width:Wk,height:h,rx:7,fill:on?VI:'#fff',stroke:VI,'stroke-width':2},g);const t=mk('text',{x,y,'text-anchor':'middle','dominant-baseline':'central',fill:on?'#fff':'#1f2a33'},g);
      t.style.cssText='font:600 14.5px "Source Sans 3",sans-serif';t.textContent=short[k];g.addEventListener('click',()=>select(k))}};
  const f=new Fig($('f6'),{h:330,oy:160});let P=ptsCopy({A:QT.allg.p[0],B:QT.allg.p[1],C:QT.allg.p[2],D:QT.allg.p[3]});let moving=false;
  const near=(a,b,tol=1e-3)=>Math.abs(a-b)<tol;
  f.draw=()=>{const{A,B,C:Cc,D}=P;const pts=[A,B,Cc,D];const G={x:(A.x+B.x+Cc.x+D.x)/4,y:(A.y+B.y+Cc.y+D.y)/4};
    f.poly(pts,{c:C.ink,w:2.4,f:'rgba(122,106,156,.10)'});
    const sides=[[A,B,'a'],[B,Cc,'b'],[Cc,D,'c'],[D,A,'d']];
    if(show&&!moving){
      f.seg(A,Cc,{c:'#9aa7b1',w:1.4,d:'6 4'});f.seg(B,D,{c:'#9aa7b1',w:1.4,d:'6 4'});
      const X=lineX(A,V.sub(Cc,A),B,V.sub(D,B));if(X){f.text(V.add(V.lerp(A,Cc,0.3),{x:0,y:0.3}),'e','lbl',{fill:'#6b7a86'});f.text(V.add(V.lerp(B,D,0.3),{x:0.3,y:0}),'f','lbl',{fill:'#6b7a86'});
        if(near(V.dot(V.sub(Cc,A),V.sub(D,B)),0,1e-2))f.rmark(X,V.ang(V.sub(Cc,A)),0.32,'#6b7a86');
        if(near(V.dist(A,X),V.dist(X,Cc),1e-2)&&near(V.dist(B,X),V.dist(X,D),1e-2)){f.ticks(A,X,1,'#6b7a86');f.ticks(X,Cc,1,'#6b7a86');f.ticks(B,X,2,'#6b7a86');f.ticks(X,D,2,'#6b7a86')}}
      const ax=AXES[cur];const axc=C.or;
      const axLine=(p,q)=>{const d=V.sub(q,p);f.seg(V.sub(p,V.mul(V.norm(d),0.8)),V.add(q,V.mul(V.norm(d),0.8)),{c:axc,w:1.6,d:'10 4 2 4'})};
      if(cur==='gltrapez'||cur==='rechteck'||cur==='quadrat')axLine(V.mid(A,B),V.mid(Cc,D));
      if(cur==='rechteck'||cur==='quadrat')axLine(V.mid(D,A),V.mid(B,Cc));
      if(cur==='drachen'||cur==='raute'||cur==='quadrat')axLine(A,Cc);
      if(cur==='raute'||cur==='quadrat')axLine(B,D);
      /* gleiche Seiten */const L=sides.map(s=>V.dist(s[0],s[1]));const grp=[];L.forEach((l,i)=>{let g=grp.findIndex(x=>near(x,l,1e-3));if(g<0){grp.push(l);g=grp.length-1}sides[i].g=g});
      sides.forEach((s,i)=>{if(L.filter(l=>near(l,L[i],1e-3)).length>1)f.ticks(s[0],s[1],s.g+1,C.blau)});
      /* parallele Seiten */[[0,2],[1,3]].forEach(([i,j],q)=>{const u=V.sub(sides[i][1],sides[i][0]),v=V.sub(sides[j][1],sides[j][0]);if(Math.abs(V.cross(V.norm(u),V.norm(v)))<1e-3)[i,j].forEach(s=>{const m=V.mid(sides[s][0],sides[s][1]);const dd=V.norm(V.sub(sides[s][1],sides[s][0]));const dir=s===j?V.mul(dd,-1):dd;
          for(let z=0;z<=q;z++){const o=V.add(V.sub(m,V.mul(dir,0.35)),V.mul(dir,z*0.2));const tip=V.add(o,V.mul(dir,0.18));f.seg(V.add(o,V.mul(V.perp(dir),0.14)),tip,{c:C.gr,w:1.8});f.seg(V.sub(o,V.mul(V.perp(dir),0.14)),tip,{c:C.gr,w:1.8})}})});
      /* rechte Winkel */[[A,B,D],[B,Cc,A],[Cc,D,B],[D,A,Cc]].forEach(([v,p,q])=>{if(near(V.dot(V.sub(p,v),V.sub(q,v)),0,1e-2)){const w=ang2(v,p,q);f.rmark(v,w.a1,0.42,C.rot)}})}
    [['A',A],['B',B],['C',Cc],['D',D]].forEach(([s,p])=>{f.dot(p,3.6);const d=V.norm(V.sub(p,G));f.text(V.add(p,V.mul(d,0.42)),s,'lbl')});
    sides.forEach(([p,q,s])=>{const m=V.mid(p,q);let nn=V.norm(V.perp(V.sub(q,p)));if(V.dot(nn,V.sub(m,G))<0)nn=V.mul(nn,-1);f.text(V.add(m,V.mul(nn,0.38)),s,'lbl',{fontSize:'16px'})});
    f.text({x:0,y:3.6},QT[cur].n,'ann',{fontSize:'17px',fontWeight:'700',fill:VI})};
  function table(){$('v6tab').innerHTML=`<tr><th>Eigenschaft</th><th>${QT[cur].n}</th></tr>`+QP.map(([t,L])=>{const y=L.includes(cur);const v=!show?'?':y?(t==='achsensymmetrisch'?`✓ (${AXES[cur]})`:'✓'):'–';return`<tr${show&&y?' class="hl"':''}><td>${t}</td><td class="${show?(y?'y':'n'):''}">${v}</td></tr>`}).join('')}
  function select(k){cur=k;show=false;H.render();table();moving=true;const tg=QT[k].p;morph(P,{A:tg[0],B:tg[1],C:tg[2],D:tg[3]},900,()=>f.render(),()=>{moving=false;f.render()})}
  $('v6show').addEventListener('click',()=>{show=true;table();f.render()});H.render();table();f.render();
})();

/* ======================= 4b Winkelsumme im Viereck ======================= */
(function(){
  const f=new Fig($('f7'),{h:380});const P={A:{x:-4,y:-2.4},B:{x:3.4,y:-2.8},C:{x:2.6,y:2.4},D:{x:-2.8,y:1.6}};let why=0;
  const convex=Q=>{const p=[Q.A,Q.B,Q.C,Q.D];for(let i=0;i<4;i++){if(V.cross(V.sub(p[(i+1)%4],p[i]),V.sub(p[(i+2)%4],p[(i+1)%4]))<=0.05)return false}return true};
  for(const k of['A','B','C','D'])f.handle(P,k,{check:p=>{const Q=Object.assign({},P,{[k]:p});return convex(Q)}});
  f.draw=()=>{const{A,B,C:Cc,D}=P;
    if(why>0){f.poly([A,B,Cc],{c:'none',f:'rgba(47,120,168,.16)'});f.poly([A,Cc,D],{c:'none',f:'rgba(217,130,43,.18)'});f.seg(A,Cc,{c:VI,w:2,d:'6 4'});f.text(V.add(V.mid(A,Cc),{x:0.3,y:0.3}),'e','lbl',{fill:VI})}
    f.poly([A,B,Cc,D],{w:2.4});
    const W=[[A,B,D,'α'],[B,Cc,A,'β'],[Cc,D,B,'γ'],[D,A,Cc,'δ']].map(([v,p,q,g])=>{const w=ang2(v,p,q);return{v,p,q,g,w}});
    if(why>0){W.forEach(o=>{if(o.g==='α'||o.g==='γ'){const other=o.g==='α'?Cc:A;const w1=ang2(o.v,o.p,other),w2=ang2(o.v,other,o.q);
        f.angle(o.v,w1.a1,w1.a2,{r:0.9,c:o.g==='α'?C.blau:C.or,f:o.g==='α'?'#cfe3f1':'#f9e0c3',right:false});f.angle(o.v,w2.a1,w2.a2,{r:0.75,c:o.g==='α'?C.or:C.blau,f:o.g==='α'?'#f9e0c3':'#cfe3f1',right:false});
        f.text(V.add(o.v,V.mul(V.dir((o.w.a1+o.w.a2)/2),1.3)),o.g,'lbl')}else f.angle(o.v,o.w.a1,o.w.a2,{r:0.9,c:o.g==='β'?C.blau:C.or,f:o.g==='β'?'#cfe3f1':'#f9e0c3',lab:o.g,right:false})})}
    else W.forEach(o=>f.angle(o.v,o.w.a1,o.w.a2,{r:0.9,c:VI,f:VIH,lab:o.g,right:false}));
    const G={x:(A.x+B.x+Cc.x+D.x)/4,y:(A.y+B.y+Cc.y+D.y)/4};[['A',A],['B',B],['C',Cc],['D',D]].forEach(([s,p])=>f.text(V.add(p,V.mul(V.norm(V.sub(p,G)),0.5)),s,'lbl'));
    const s=W.reduce((a,o)=>a+o.w.deg,0);
    $('r7').innerHTML=W.map(o=>`${o.g} = ${gr(o.w.deg)}`).join(', ')+`<br>Summe: <b>${gr(s)}</b>`+(why?'<br>Die Diagonale \\(e\\) teilt das Viereck in die Dreiecke \\(ABC\\) (blau) und \\(ACD\\) (orange). Jedes hat die Winkelsumme \\(180^\\circ\\). Zusammen: \\(2\\cdot180^\\circ=360^\\circ\\).':'');if(why)typesetEl($('r7'))};
  $('v7show').addEventListener('click',()=>{why=1;f.render()});f.render();
})();

/* ======================= 5 Flächen ======================= */
(function(){
  const f=new Fig($('f8'),{h:400,oy:230});let mode='re',t=0,on=false,pyth=false;
  const D={re:{a:6,b:3},pa:{a:5,h:3,s:2},tr:{a:7,c:3,h:3,s:1.5},dr:{e:7,f:4,p:0.65},ra:{e:7,f:4}};
  const SL={re:[['a',1,9,1,'a'],['b',1,5,1,'b']],pa:[['a',3,7,0.5,'a'],['h',1,4.5,0.5,'h'],['s',0.5,3,0.5,'Verschiebung']],tr:[['a',4,9,0.5,'a'],['c',1,6,0.5,'c'],['h',1,4.5,0.5,'h']],dr:[['e',3,9,0.5,'e'],['f',2,5,0.5,'f'],['p',0.55,0.8,0.05,'Lage von f']],ra:[['e',3,9,0.5,'e'],['f',2,5,0.5,'f']]};
  const TXT={re:R`<p class="def"><b>Rechteck:</b> \(A=a\cdot b\), \(u=2a+2b\)</p><p>Die Fläche zählt, wie viele Quadrate von 1 cm² hineinpassen.</p>`,
    pa:R`<p class="def"><b>Parallelogramm:</b> \(A=a\cdot h_a\)</p><p>Schneidet man links ein rechtwinkliges Dreieck ab und setzt es rechts an, entsteht ein Rechteck mit den Seiten \(a\) und \(h_a\).</p>`,
    tr:R`<p class="def"><b>Trapez</b> (\(a\parallel c\)): Mittelparallele \(m=\dfrac{a+c}{2}\), \(A=m\cdot h=\dfrac{a+c}{2}\cdot h\)</p><p>Zwei gleiche Trapeze ergeben ein Parallelogramm mit der Grundseite \(a+c\) und der Höhe \(h\). Ein Trapez ist die Hälfte davon.</p>`,
    dr:R`<p class="def"><b>Drachenviereck:</b> \(A=\dfrac{e\cdot f}{2}\)</p><p>Die Diagonalen stehen senkrecht. Im umschriebenen Rechteck \(e\times f\) hat jedes innere Dreieck ein gleich grosses äusseres Gegenstück: Der Drachen ist die Hälfte des Rechtecks.</p>`,
    ra:R`<p class="def"><b>Raute:</b> \(A=a\cdot h_a=\dfrac{e\cdot f}{2}\)</p><p>Die Raute ist ein Drachen <b>und</b> ein Parallelogramm. Beide Formeln gelten.</p>`};
  f.draw=()=>{const d=D[mode];const T=ease(t);
    if(mode==='re'){const x0=-d.a/2,y0=-1.5;f.poly([{x:x0,y:y0},{x:x0+d.a,y:y0},{x:x0+d.a,y:y0+d.b},{x:x0,y:y0+d.b}],{w:2.4,f:'rgba(122,106,156,.08)'});
      if(on){const N=d.a*d.b,m=Math.floor(T*N+1e-9);for(let i=0;i<m;i++){const r=Math.floor(i/d.a),c=i%d.a;f.poly([{x:x0+c+0.06,y:y0+r+0.06},{x:x0+c+0.94,y:y0+r+0.06},{x:x0+c+0.94,y:y0+r+0.94},{x:x0+c+0.06,y:y0+r+0.94}],{c:VI,w:1,f:VIH});f.text({x:x0+c+0.5,y:y0+r+0.5},String(i+1),'ann',{fontSize:'11px'})}}
      f.text({x:0,y:y0-0.4},`a = ${d.a} cm`,'ann',{fontSize:'14px'});f.text({x:x0+d.a+0.3,y:y0+d.b/2},`b = ${d.b} cm`,'ann',{fontSize:'14px',textAnchor:'start'})}
    if(mode==='pa'){const x0=-(d.a+d.s)/2,y0=-1.5;const A={x:x0,y:y0},B={x:x0+d.a,y:y0},Cc={x:x0+d.a+d.s,y:y0+d.h},Dd={x:x0+d.s,y:y0+d.h},F={x:x0+d.s,y:y0};
      if(!on){f.poly([A,B,Cc,Dd],{w:2.4,f:'rgba(122,106,156,.10)'})}else{f.poly([F,B,Cc,Dd],{w:2,f:'rgba(122,106,156,.10)'});const sh={x:d.a*T,y:0};f.poly([V.add(A,sh),V.add(F,sh),V.add(Dd,sh)],{c:C.or,w:2,f:'rgba(217,130,43,.25)'});
        f.poly([A,B,Cc,Dd],{c:'#999',w:1.2,d:'4 3'})}
      if(pyth&&on&&t>=1){f.poly([A,F,Dd],{c:C.gr,w:2.6,f:'rgba(47,143,95,.22)'});f.text({x:(A.x+F.x)/2,y:y0+0.35},'s','lbl',{fill:C.gr});f.text(V.add(V.mid(A,Dd),V.mul(V.norm(V.perp(V.sub(Dd,A))),0.4)),'b','lbl',{fill:C.gr})}
      f.seg(Dd,F,{c:C.rot,w:1.8,d:'5 4'});f.rmark(F,0,0.3,C.rot);f.text({x:F.x+0.35,y:y0+d.h/2},'h_a','lbl',{fill:C.rot});f.text({x:(A.x+B.x)/2,y:y0-0.4},'a','lbl');
      [['A',A,{x:-0.3,y:-0.3}],['B',B,{x:0.3,y:-0.3}],['C',Cc,{x:0.3,y:0.3}],['D',Dd,{x:-0.3,y:0.3}]].forEach(([s,p,o])=>f.text(V.add(p,o),s,'lbl'))}
    if(mode==='tr'){const x0=-d.a/2-1,y0=-2.6;const off=(d.a-d.c)/2;const A={x:x0,y:y0},B={x:x0+d.a,y:y0},Cc={x:x0+off+d.c,y:y0+d.h},Dd={x:x0+off,y:y0+d.h};
      f.poly([A,B,Cc,Dd],{w:2.4,f:'rgba(122,106,156,.12)'});
      const Mbc=V.mid(B,Cc);if(on){const ang=PI*T;const r=p=>V.rot(p,Mbc,ang);f.poly([r(A),r(B),r(Cc),r(Dd)],{c:C.or,w:2,f:'rgba(217,130,43,.18)'});
        if(T>=1){f.seg(A,r(Dd),{c:C.gr,w:3});f.text({x:(A.x+r(Dd).x)/2,y:y0-0.95},`a + c = ${fmt(d.a+d.c)} cm`,'ann',{fill:C.gr,fontSize:'14px',fontWeight:'700'})}}
      const mL=V.mid(A,Dd),mR=V.mid(B,Cc);f.seg(mL,mR,{c:C.blau,w:1.8,d:'6 4'});f.text(V.add(mL,{x:-0.35,y:0}),'m','lbl',{fill:C.blau});
      f.seg(Dd,{x:Dd.x,y:y0},{c:C.rot,w:1.8,d:'5 4'});f.rmark({x:Dd.x,y:y0},0,0.3,C.rot);f.text({x:Dd.x+0.3,y:y0+d.h/2-0.4},'h','lbl',{fill:C.rot});
      f.text({x:(A.x+B.x)/2,y:y0-0.4},'a','lbl');f.text({x:(Cc.x+Dd.x)/2,y:y0+d.h+0.4},'c','lbl')}
    if(mode==='dr'||mode==='ra'){const p=mode==='ra'?0.5:d.p;const x0=-d.e/2,y0=-0.6;const A={x:x0,y:y0},Cc={x:x0+d.e,y:y0},X={x:x0+d.e*p,y:y0},B={x:X.x,y:y0-d.f/2},Dd={x:X.x,y:y0+d.f/2};
      const cols=['rgba(47,120,168,.30)','rgba(217,130,43,.30)','rgba(47,143,95,.30)','rgba(116,87,173,.30)'];
      const tri=[[A,X,B],[X,Cc,B],[X,Cc,Dd],[A,X,Dd]];const outer=[[A,B,{x:x0,y:B.y}],[Cc,B,{x:Cc.x,y:B.y}],[Cc,Dd,{x:Cc.x,y:Dd.y}],[A,Dd,{x:x0,y:Dd.y}]];
      if(on){f.poly([{x:x0,y:B.y},{x:Cc.x,y:B.y},{x:Cc.x,y:Dd.y},{x:x0,y:Dd.y}],{c:'#9aa7b1',w:1.6,d:'6 4',o:Math.min(1,T*2)});
        tri.forEach((q,i)=>f.poly(q,{c:'none',f:cols[i]}));outer.forEach((q,i)=>f.poly(q,{c:'none',f:cols[i],o:clamp(T*2-1,0,1)}))}
      f.poly([A,B,Cc,Dd],{w:2.4,f:on?'none':'rgba(122,106,156,.10)'});f.seg(A,Cc,{c:'#6b7a86',w:1.4,d:'6 4'});f.seg(B,Dd,{c:'#6b7a86',w:1.4,d:'6 4'});f.rmark(X,0,0.3);
      if(pyth&&on&&t>=1&&mode==='ra'){f.poly([A,X,B],{c:C.gr,w:2.6,f:'rgba(47,143,95,.3)'});f.text(V.add(V.mid(A,B),V.mul(V.norm(V.perp(V.sub(A,B))),0.4)),'a','lbl',{fill:C.gr});f.text({x:(A.x+X.x)/2,y:y0-0.3},'e/2','ann',{fill:C.gr,fontSize:'13px'});f.text({x:X.x+0.45,y:(X.y+B.y)/2},'f/2','ann',{fill:C.gr,fontSize:'13px'})}
      f.text({x:x0+d.e*0.25,y:y0+0.3},'e','lbl');f.text({x:X.x+0.3,y:y0+d.f/4},'f','lbl');[['A',A,{x:-0.35,y:0}],['B',B,{x:0,y:-0.35}],['C',Cc,{x:0.35,y:0}],['D',Dd,{x:0,y:0.35}]].forEach(([s,q,o])=>f.text(V.add(q,o),s,'lbl'))}};
  function calc(){const d=D[mode];let h='';const c2=v=>`${fmt(v,2).replace(/\.?0+$/,'')}`;
    if(!on){h='Wie berechnet man die Fläche? Überlege zuerst, dann klicke auf ▶ Herleitung.'}
    else if(mode==='re')h=`\\(A=a\\cdot b=${d.a}\\cdot${d.b}=${d.a*d.b}\\text{ cm}^2\\)<br>\\(u=2a+2b=${2*d.a+2*d.b}\\text{ cm}\\)`;
    else if(mode==='pa'){const b=Math.hypot(d.s,d.h);h=`\\(A=a\\cdot h_a=${d.a}\\cdot${d.h}=${c2(d.a*d.h)}\\text{ cm}^2\\)<br>`+(pyth?`Pythagoras im grünen Dreieck: \\(b=\\sqrt{s^2+h_a^2}=\\sqrt{${d.s}^2+${d.h}^2}=\\sqrt{${c2(d.s*d.s+d.h*d.h)}}\\approx${fmt(b,2)}\\text{ cm}\\)<br>`:`\\(b\\approx${fmt(b,2)}\\) cm gemessen<br>`)+`\\(u=2a+2b\\approx${c2(2*d.a+2*b)}\\text{ cm}\\)`}
    else if(mode==='tr')h=`\\(m=\\dfrac{a+c}{2}=\\dfrac{${d.a}+${d.c}}{2}=${c2((d.a+d.c)/2)}\\text{ cm}\\)<br>\\(A=m\\cdot h=${c2((d.a+d.c)/2)}\\cdot${d.h}=${c2((d.a+d.c)/2*d.h)}\\text{ cm}^2\\)`;
    else h=`\\(A=\\dfrac{e\\cdot f}{2}=\\dfrac{${d.e}\\cdot${d.f}}{2}=${c2(d.e*d.f/2)}\\text{ cm}^2\\)`+(mode==='ra'?(pyth?`<br>Pythagoras im grünen Dreieck: \\(a=\\sqrt{\\left(\\tfrac e2\\right)^2+\\left(\\tfrac f2\\right)^2}=\\sqrt{${c2(d.e/2)}^2+${c2(d.f/2)}^2}\\approx${fmt(Math.hypot(d.e/2,d.f/2),2)}\\text{ cm}\\)`:`<br>Seite \\(a\\approx${fmt(Math.hypot(d.e/2,d.f/2),2)}\\) cm (gemessen)`)+`<br>\\(u=4a\\approx${fmt(4*Math.hypot(d.e/2,d.f/2),2)}\\) cm`:'');
    $('r8').innerHTML=h;typesetEl($('r8'))}
  function sliders(){$('a8sl').innerHTML=(mode==='pa'||mode==='ra'?`<div class="ctrl" style="margin:0 0 4px"><span class="hint" style="margin:0 6px 0 0">Seite ${mode==='pa'?'b':'a'}:</span><button class="btn${pyth?'':' on'}" data-py="0">messen</button><button class="btn${pyth?' on':''}" data-py="1">mit Pythagoras berechnen</button></div>`:'')+SL[mode].map(([k,lo,hi,st,nm])=>`<label class="sld">${nm} = <input type="range" min="${lo}" max="${hi}" step="${st}" value="${D[mode][k]}" data-k="${k}"><b>${D[mode][k]}${k==='p'?'':' cm'}</b></label>`).join('');
    $('a8sl').querySelectorAll('[data-py]').forEach(b=>b.addEventListener('click',()=>{pyth=b.dataset.py==='1';$('a8sl').querySelectorAll('[data-py]').forEach(x=>x.classList.toggle('on',x===b));calc();f.render()}));
    $('a8sl').querySelectorAll('input').forEach(inp=>inp.addEventListener('input',()=>{const k=inp.dataset.k;D[mode][k]=+inp.value;if(mode==='tr'&&D.tr.c>=D.tr.a){D.tr.c=D.tr.a-0.5}inp.nextElementSibling.textContent=inp.value+(k==='p'?'':' cm');on=false;t=0;calc();f.render()}))}
  function load(){$('a8txt').innerHTML=TXT[mode];typesetEl($('a8txt'));on=false;t=0;sliders();calc();f.render()}
  btnGroup('#flaechen [data-f]','f',v=>{mode=v;load()});$('a8play').addEventListener('click',()=>{on=true;t=0;calc();tween(mode==='re'?2200:1600,x=>{t=x;f.render()},()=>{t=1;f.render()})});load();
})();

/* ======================= 6a Geraden am Kreis ======================= */
(function(){
  const f=new Fig($('f9'),{h:400});const M={x:0,y:0},RR=3;const P={H:{x:1.8,y:3.7}};
  f.handle(P,'H',{constrain:p=>{const d=V.dist(p,M);if(Math.abs(d-RR)<0.15&&d>0.01)p=V.add(M,V.mul(V.norm(V.sub(p,M)),RR));if(d<0.15)p={x:0,y:0};return p}});
  f.draw=()=>{const H=P.H;const d=V.dist(H,M);const dir=d<1e-6?{x:1,y:0}:V.perp(V.norm(V.sub(H,M)));
    f.circ(M,RR,{w:2.4});f.dot(M,4);f.text({x:M.x-0.35,y:M.y-0.35},'M','lbl');
    let typ;if(d<1e-6)typ='d';else if(Math.abs(d-RR)<1e-6)typ='t';else typ=d>RR?'p':'s';
    const col={p:C.gr,t:C.rot,s:C.blau,d:C.or}[typ];f.line(H,dir,{c:col,w:2.6});
    if(d>1e-6)f.seg(M,H,{c:'#888',w:1.4,d:'5 4'});
    const end=V.add(H,V.mul(dir,5.3));f.text(V.add(end,V.mul(V.perp(dir),0.35)),{p:'p',t:'t',s:'g',d:'d'}[typ],'lbl',{fill:col});
    if(typ==='t'){f.rmark(H,V.ang(V.sub(M,H)),0.38,C.rot);f.dot(H,6,C.rot);f.text(V.add(H,V.mul(V.norm(V.sub(H,M)),0.5)),'T','lbl',{fill:C.rot});f.text(V.mid(M,H),'r','lbl',{fill:'#666'})}
    if(typ==='s'||typ==='d'){const S=clInt(M,RR,H,dir);if(S.length===2){f.seg(S[0],S[1],{c:col,w:5,o:0.55});S.forEach((p,i)=>{f.dot(p,5,col);f.text(V.add(p,V.mul(V.norm(V.sub(p,M)),0.45)),'S_'+(i+1),'lbl',{fill:col})});
      f.text(V.add(V.mid(S[0],S[1]),V.mul(V.perp(dir),-0.35)),typ==='d'?'':'s','lbl',{fill:col})}}
    if(typ==='p')f.rmark(H,V.ang(V.sub(M,H)),0.3,'#888');
    rowsOn('k9tab','g',typ);
    const S=clInt(M,RR,H,dir);$('r9').innerHTML=`Abstand \\(|\\overline{MH}|=${fmt(d)}\\) cm, \\(r=3.0\\) cm: <b>${{p:'Passante',t:'Tangente',s:'Sekante',d:'Sekante durch M: Durchmesser'}[typ]}</b>`+(typ==='s'||typ==='d'?`, Sehne \\(s=${fmt(V.dist(S[0],S[1]))}\\) cm`:'');typesetEl($('r9'))};
  f.render();
})();

/* ======================= 6b Kreiswinkelsätze ======================= */
(function(){
  const f=new Fig($('f10'),{h:420});const M={x:0,y:0},RR=3.6;const on=a=>V.add(M,V.mul(V.dir(a),RR));
  const P={A:on(3.75),B:on(5.75),C:on(1.6),C2:on(2.6)};let meas=false,two=false;
  const cons=p=>V.add(M,V.mul(V.norm(V.sub(p,M)),RR));
  ['A','B','C'].forEach(k=>f.handle(P,k,{constrain:cons}));const h2=f.handle(P,'C2',{constrain:cons});h2.hidden=true;
  /* Bogen b: von A nach B, ohne C */
  f.draw=()=>{const{A,B,C:Cc,C2}=P;const aA=V.ang(V.sub(A,M)),aB=V.ang(V.sub(B,M)),aC=V.ang(V.sub(Cc,M));
    let s1=aA,s2=aB;const inArc=(a,lo,hi)=>norm2pi(a-lo)<norm2pi(hi-lo);if(inArc(aC,s1,s2)){s1=aB;s2=aA}/* Bogen von s1 ccw nach s2 enthält C nicht */
    const sw=norm2pi(s2-s1);
    f.circ(M,RR,{w:2});f.arc(M,s1,s1+sw,RR,{c:C.blau,w:5,o:0.6});
    f.text(V.add(M,V.mul(V.dir(s1+sw/2),RR+0.4)),'b','lbl',{fill:C.blau});
    /* Zentriwinkel */f.seg(M,A,{c:C.or,w:1.8});f.seg(M,B,{c:C.or,w:1.8});f.wedge(M,s1,s1+sw,0.8,{c:C.or,f:'#f9e0c3'});f.text(V.add(M,V.mul(V.dir(s1+sw/2),1.15)),'φ','lbl',{fill:'#a65b12'});
    /* Peripheriewinkel */const pw=(X,g,col,fill)=>{f.seg(X,A,{c:col,w:2});f.seg(X,B,{c:col,w:2});const w=ang2(X,A,B);f.angle(X,w.a1,w.a2,{r:0.75,c:col,f:fill,lab:g,right:false});return w.deg};
    const g1=pw(Cc,'γ',C.gr,'#cde8d8');let g2=null,other=false;
    if(two){const aC2=V.ang(V.sub(C2,M));other=inArc(aC2,s1,s1+sw);g2=pw(C2,other?'δ':"γ'",other?C.rot:'#2f8f5f',other?'#f6d2cf':'#cde8d8')}
    f.dot(M,4);f.text({x:0.3,y:-0.4},'M','lbl');[['A',A],['B',B],['C',Cc]].concat(two?[[other?'D':"C'",C2]]:[]).forEach(([s,p])=>{f.dot(p,4);f.text(V.add(p,V.mul(V.norm(V.sub(p,M)),0.45)),s,'lbl')});
    if(meas){const phi=sw*DEG;let h=`\\(\\varphi=${fmt(phi)}^\\circ\\), \\(\\gamma=${fmt(g1)}^\\circ\\), \\(\\dfrac{\\varphi}{2}=${fmt(phi/2)}^\\circ\\)`;
      if(two)h+=other?`<br>\\(D\\) liegt auf dem Ergänzungsbogen: \\(\\delta=${fmt(g2)}^\\circ\\), \\(\\gamma+\\delta=${fmt(g1+g2)}^\\circ\\)`:`<br>\\(\\gamma'=${fmt(g2)}^\\circ=\\gamma\\)`;
      const r=$('r10');if(r.dataset.h!==h){r.dataset.h=h;r.innerHTML=h;typesetEl(r)}}};
  $('k10show').addEventListener('click',()=>{meas=true;f.render()});$('k10c2').addEventListener('click',()=>{two=!two;h2.hidden=!two;$('k10c2').classList.toggle('on',two);f.render()});f.render();
})();

/* ======================= 6c Berechnungen am Kreis ======================= */
(function(){
  const f=new Fig($('f11'),{h:440});let mode='kr',on=false;const D={kr:{r:3},se:{r:4,phi:120},ri:{R:4.5,r:2.5}};
  const SL={kr:[['r',0.5,5,0.1,'r','cm']],se:[['r',1,5,0.1,'r','cm'],['phi',10,350,5,'φ','°']],ri:[['R',1,5,0.1,'R','cm'],['r',0.5,4.5,0.1,'r','cm']]};
  const M={x:0,y:0};const n2=v=>v.toFixed(2);
  f.draw=()=>{const d=D[mode];
    if(mode==='kr'){f.circ(M,d.r,{w:2.4,f:on?'rgba(122,106,156,.15)':'none'});f.seg(M,{x:d.r,y:0},{c:C.rot,w:2});f.text({x:d.r/2,y:0.3},'r','lbl',{fill:C.rot});f.dot(M,4)}
    if(mode==='se'){f.circ(M,d.r,{c:'#bbb',w:1.4});const a=d.phi*PI/180;f.wedge(M,0,a,d.r,{c:C.ink,w:2,f:on?'rgba(122,106,156,.22)':'rgba(122,106,156,.08)'});f.arc(M,0,a,d.r,{c:C.blau,w:4});
      f.angle(M,0,a,{r:0.7,c:C.or,f:'#f9e0c3',lab:'φ',right:false});f.text(V.add(M,V.mul(V.dir(a/2),d.r+0.4)),'b','lbl',{fill:C.blau});f.text({x:d.r/2,y:-0.3},'r','lbl');f.dot(M,4)}
    if(mode==='ri'){f.circ(M,d.R,{w:2.2,f:on?'rgba(122,106,156,.22)':'none'});f.circ(M,d.r,{w:2.2,f:'#fff'});f.seg(M,V.mul(V.dir(0.6),d.R),{c:C.rot,w:2});f.seg(M,V.mul(V.dir(-0.5),d.r),{c:C.blau,w:2});
      f.text(V.mul(V.dir(0.6),d.R*0.7+0.3),'R','lbl',{fill:C.rot});f.text(V.mul(V.dir(-0.5),d.r*0.55-0.0),'r','lbl',{fill:C.blau});f.dot(M,4)}};
  function calc(){const d=D[mode];let h;
    if(!on)h='Berechne zuerst selbst (Taschenrechner), dann klicke auf ▶ berechnen.';
    else if(mode==='kr')h=`\\(u=2\\pi r=2\\cdot\\pi\\cdot${d.r}\\approx${n2(2*PI*d.r)}\\text{ cm}\\)<br>\\(A=\\pi r^2=\\pi\\cdot${d.r}^2\\approx${n2(PI*d.r*d.r)}\\text{ cm}^2\\)`;
    else if(mode==='se')h=`Anteil: \\(\\dfrac{${d.phi}^\\circ}{360^\\circ}\\)<br>\\(b=2\\pi\\cdot${d.r}\\cdot\\dfrac{${d.phi}^\\circ}{360^\\circ}\\approx${n2(2*PI*d.r*d.phi/360)}\\text{ cm}\\)<br>\\(A_{\\text{Sektor}}=\\pi\\cdot${d.r}^2\\cdot\\dfrac{${d.phi}^\\circ}{360^\\circ}\\approx${n2(PI*d.r*d.r*d.phi/360)}\\text{ cm}^2\\)`;
    else h=`\\(A=\\pi(R^2-r^2)=\\pi(${d.R}^2-${d.r}^2)\\approx${n2(PI*(d.R*d.R-d.r*d.r))}\\text{ cm}^2\\)`;
    $('r11').innerHTML=h;typesetEl($('r11'))}
  function sliders(){$('c11sl').innerHTML=SL[mode].map(([k,lo,hi,st,nm,u])=>`<label class="sld">${nm} = <input type="range" min="${lo}" max="${hi}" step="${st}" value="${D[mode][k]}" data-k="${k}"><b>${D[mode][k]} ${u}</b></label>`).join('');
    $('c11sl').querySelectorAll('input').forEach(inp=>inp.addEventListener('input',()=>{const k=inp.dataset.k;D[mode][k]=+inp.value;if(mode==='ri'&&D.ri.r>=D.ri.R-0.2){D.ri.r=+(D.ri.R-0.3).toFixed(1);}inp.nextElementSibling.textContent=inp.value+(k==='phi'?' °':' cm');on=false;calc();f.render()}))}
  function load(){on=false;sliders();calc();f.render()}
  btnGroup('#kreis [data-c]','c',v=>{mode=v;load()});$('c11go').addEventListener('click',()=>{on=true;calc();f.render()});load();
})();

/* ======================= 7 Trainer ======================= */
function chkVal(s,v,tol){const x=parseNum(String(s).replace(/(cm²|cm2|cm|°|grad)/gi,''));if(isNaN(x))return{ok:false,msg:'Gib eine Zahl ein.'};
  const t=tol??(Number.isInteger(v)?1e-9:0.011+Math.abs(v)*1e-4);return Math.abs(x-v)<=t?{ok:true}:{ok:false,msg:'Noch nicht richtig.'}}
runTrainer({
  thales:{label:'Thaleskreis',gen(){const a=rnd(18,72);const t=rnd(1,2);
    if(t===1)return{q:`Das Dreieck \\(ABC\\) hat \\(C\\) auf dem Thaleskreis über \\(\\overline{AB}\\). Es ist \\(\\alpha=${a}^\\circ\\). Berechne \\(\\beta\\).`,ziel:'\\(\\beta=\\)',ph:'Grad',check:s=>chkVal(s,90-a),sol:`<p>\\(\\gamma=90^\\circ\\) (Thales), also \\(\\beta=180^\\circ-90^\\circ-${a}^\\circ=${90-a}^\\circ\\).</p>`};
    return{q:`\\(C\\) liegt auf dem Thaleskreis über \\(\\overline{AB}\\), \\(M\\) ist der Mittelpunkt von \\(\\overline{AB}\\). Es ist \\(\\angle MCA=${a}^\\circ\\). Wie gross ist \\(\\angle AMC\\)?`,ziel:'\\(\\angle AMC=\\)',ph:'Grad',check:s=>chkVal(s,180-2*a),
      sol:`<p>Dreieck \\(AMC\\) ist gleichschenklig (\\(|\\overline{MA}|=|\\overline{MC}|=r\\)), also auch \\(\\angle MAC=${a}^\\circ\\).</p><p>\\(\\angle AMC=180^\\circ-2\\cdot${a}^\\circ=${180-2*a}^\\circ\\)</p>`}}},
  periph:{label:'Zentri- und Peripheriewinkel',gen(){const phi=2*rnd(20,85);if(Math.random()<0.5)return{q:`Der Zentriwinkel über einem Bogen beträgt \\(\\varphi=${phi}^\\circ\\). Wie gross ist der Peripheriewinkel \\(\\gamma\\) über demselben Bogen?`,ziel:'\\(\\gamma=\\)',ph:'Grad',check:s=>chkVal(s,phi/2),sol:`<p>\\(\\gamma=\\dfrac{\\varphi}{2}=${phi/2}^\\circ\\)</p>`};
    return{q:`Ein Peripheriewinkel beträgt \\(\\gamma=${phi/2}^\\circ\\). Wie gross ist der Zentriwinkel über demselben Bogen?`,ziel:'\\(\\varphi=\\)',ph:'Grad',check:s=>chkVal(s,phi),sol:`<p>\\(\\varphi=2\\gamma=${phi}^\\circ\\)</p>`}}},
  vwinkel:{label:'Winkel im Viereck',gen(){const t=rnd(1,4);
    if(t===1){const a=rnd(40,140);return{q:`Im Parallelogramm \\(ABCD\\) ist \\(\\alpha=${a}^\\circ\\). Berechne \\(\\beta\\).`,ziel:'\\(\\beta=\\)',ph:'Grad',check:s=>chkVal(s,180-a),sol:`<p>Nachbarwinkel im Parallelogramm ergeben \\(180^\\circ\\): \\(\\beta=${180-a}^\\circ\\). (\\(\\gamma=\\alpha\\), \\(\\delta=\\beta\\))</p>`}}
    if(t===2){const a=rnd(45,85),b=rnd(50,88);return{q:`Im Trapez \\(ABCD\\) mit \\(a\\parallel c\\) ist \\(\\alpha=${a}^\\circ\\) und \\(\\beta=${b}^\\circ\\). Berechne \\(\\delta\\).`,ziel:'\\(\\delta=\\)',ph:'Grad',check:s=>chkVal(s,180-a),sol:`<p>\\(\\alpha\\) und \\(\\delta\\) liegen an derselben Schenkelseite zwischen den Parallelen: \\(\\alpha+\\delta=180^\\circ\\Rightarrow\\delta=${180-a}^\\circ\\).</p>`}}
    if(t===3){const a=rnd(40,100),g=rnd(40,100);const b=(360-a-g)/2;return{q:`Im Drachenviereck \\(ABCD\\) mit der Symmetrieachse \\(AC\\) ist \\(\\alpha=${a}^\\circ\\) und \\(\\gamma=${g}^\\circ\\). Berechne \\(\\beta\\).`,ziel:'\\(\\beta=\\)',ph:'Grad',check:s=>chkVal(s,b,0.01),sol:`<p>\\(\\beta=\\delta\\) (Symmetrie), \\(2\\beta=360^\\circ-${a}^\\circ-${g}^\\circ=${360-a-g}^\\circ\\Rightarrow\\beta=${b}^\\circ\\).</p>`}}
    const a=rnd(60,120),b=rnd(60,120),g=rnd(60,110);const d=360-a-b-g;return{q:`Im Viereck \\(ABCD\\) ist \\(\\alpha=${a}^\\circ\\), \\(\\beta=${b}^\\circ\\), \\(\\gamma=${g}^\\circ\\). Berechne \\(\\delta\\).`,ziel:'\\(\\delta=\\)',ph:'Grad',check:s=>chkVal(s,d),sol:`<p>\\(\\delta=360^\\circ-${a}^\\circ-${b}^\\circ-${g}^\\circ=${d}^\\circ\\)</p>`}}},
  flaeche:{label:'Flächen von Vierecken',gen(){const t=rnd(1,5);const h=v=>String(v);
    if(t===1){const a=rnd(3,12),hh=rnd(2,9);return{q:`Parallelogramm: \\(a=${a}\\) cm, \\(h_a=${hh}\\) cm. Berechne \\(A\\).`,ziel:'\\(A=\\)',ph:'cm²',check:s=>chkVal(s,a*hh),sol:`<p>\\(A=a\\cdot h_a=${a}\\cdot${hh}=${a*hh}\\text{ cm}^2\\)</p>`}}
    if(t===2){const a=rnd(6,14),c=rnd(2,a-1),hh=rnd(2,8);const A=(a+c)/2*hh;return{q:`Trapez: \\(a=${a}\\) cm, \\(c=${c}\\) cm, \\(h=${hh}\\) cm. Berechne \\(A\\).`,ziel:'\\(A=\\)',ph:'cm²',check:s=>chkVal(s,A,0.001),sol:`<p>\\(m=\\dfrac{${a}+${c}}{2}=${(a+c)/2}\\) cm, \\(A=m\\cdot h=${(a+c)/2}\\cdot${hh}=${A}\\text{ cm}^2\\)</p>`}}
    if(t===3){const e=rnd(4,14),ff=rnd(3,10);return{q:`Drachenviereck: Diagonalen \\(e=${e}\\) cm, \\(f=${ff}\\) cm. Berechne \\(A\\).`,ziel:'\\(A=\\)',ph:'cm²',check:s=>chkVal(s,e*ff/2,0.001),sol:`<p>\\(A=\\dfrac{e\\cdot f}{2}=\\dfrac{${e}\\cdot${ff}}{2}=${e*ff/2}\\text{ cm}^2\\)</p>`}}
    if(t===4){const a=rnd(5,12),c=rnd(2,a-1),hh=rnd(2,8);const A=(a+c)/2*hh;return{q:`Ein Trapez hat die Fläche \\(A=${A}\\text{ cm}^2\\), \\(a=${a}\\) cm und \\(c=${c}\\) cm. Berechne die Höhe \\(h\\).`,ziel:'\\(h=\\)',ph:'cm',check:s=>chkVal(s,hh),sol:`<p>\\(A=\\dfrac{a+c}{2}\\cdot h\\Rightarrow h=\\dfrac{2A}{a+c}=\\dfrac{${2*A}}{${a+c}}=${hh}\\text{ cm}\\)</p>`}}
    const a=rnd(3,12),b=rnd(2,9);const u=2*a+2*b;return{q:`Ein Rechteck hat den Umfang \\(u=${u}\\) cm und die Seite \\(a=${a}\\) cm. Berechne die Fläche.`,ziel:'\\(A=\\)',ph:'cm²',check:s=>chkVal(s,a*b),sol:`<p>\\(b=\\dfrac{u-2a}{2}=${b}\\) cm, \\(A=${a}\\cdot${b}=${a*b}\\text{ cm}^2\\)</p>`}}},
  pyth:{label:'Seite mit Pythagoras (Variante)',gen(){const [p,q,r]=pick([[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15]]);
    if(Math.random()<0.5)return{q:`Raute mit den Diagonalen \\(e=${2*p}\\) cm und \\(f=${2*q}\\) cm. Berechne die Seite \\(a\\) mit dem Satz des Pythagoras.`,ziel:'\\(a=\\)',ph:'cm',check:s=>chkVal(s,r),
      sol:`<p>Die Diagonalen halbieren sich und stehen senkrecht: rechtwinkliges Dreieck mit den Katheten \\(${p}\\) cm und \\(${q}\\) cm.</p><p>\\(a=\\sqrt{${p}^2+${q}^2}=\\sqrt{${p*p+q*q}}=${r}\\text{ cm}\\)</p>`};
    return{q:`Parallelogramm: Die Höhe ist \\(h_a=${q}\\) cm, der Fusspunkt der Höhe liegt \\(${p}\\) cm von \\(A\\) entfernt. Berechne die Seite \\(b=\\overline{AD}\\).`,ziel:'\\(b=\\)',ph:'cm',check:s=>chkVal(s,r),
      sol:`<p>Rechtwinkliges Dreieck \\(AFD\\): \\(b=\\sqrt{${p}^2+${q}^2}=\\sqrt{${p*p+q*q}}=${r}\\text{ cm}\\)</p>`}}},
  kreis:{label:'Kreisberechnungen',gen(){const t=rnd(1,5);const r=rnd(2,15)/(Math.random()<0.5?1:2);const R2=v=>Math.round(v*100)/100;
    if(t===1)return{q:`Kreis mit \\(r=${r}\\) cm. Berechne den Umfang.`,ziel:'\\(u\\approx\\)',ph:'cm',check:s=>chkVal(s,R2(2*PI*r)),sol:`<p>\\(u=2\\pi r=2\\cdot\\pi\\cdot${r}\\approx${R2(2*PI*r).toFixed(2)}\\text{ cm}\\)</p>`};
    if(t===2)return{q:`Kreis mit \\(d=${2*r}\\) cm. Berechne die Fläche.`,ziel:'\\(A\\approx\\)',ph:'cm²',check:s=>chkVal(s,R2(PI*r*r)),sol:`<p>\\(r=\\dfrac d2=${r}\\) cm, \\(A=\\pi r^2\\approx${R2(PI*r*r).toFixed(2)}\\text{ cm}^2\\)</p>`};
    if(t===3){const u=R2(2*PI*r);return{q:`Ein Kreis hat den Umfang \\(u=${u.toFixed(2)}\\) cm. Berechne den Radius (auf 1 Dezimale).`,ziel:'\\(r\\approx\\)',ph:'cm',check:s=>chkVal(s,Math.round(u/(2*PI)*10)/10,0.051),sol:`<p>\\(r=\\dfrac{u}{2\\pi}=\\dfrac{${u.toFixed(2)}}{2\\pi}\\approx${(u/(2*PI)).toFixed(2)}\\text{ cm}\\)</p>`}}
    const phi=pick([30,45,60,72,90,120,135,150,210,240,270]);
    if(t===4)return{q:`Kreissektor mit \\(r=${r}\\) cm und \\(\\varphi=${phi}^\\circ\\). Berechne die Bogenlänge \\(b\\).`,ziel:'\\(b\\approx\\)',ph:'cm',check:s=>chkVal(s,R2(2*PI*r*phi/360)),sol:`<p>\\(b=2\\pi r\\cdot\\dfrac{\\varphi}{360^\\circ}=2\\pi\\cdot${r}\\cdot\\dfrac{${phi}}{360}\\approx${R2(2*PI*r*phi/360).toFixed(2)}\\text{ cm}\\)</p>`};
    return{q:`Kreissektor mit \\(r=${r}\\) cm und \\(\\varphi=${phi}^\\circ\\). Berechne die Sektorfläche.`,ziel:'\\(A\\approx\\)',ph:'cm²',check:s=>chkVal(s,R2(PI*r*r*phi/360)),sol:`<p>\\(A=\\pi r^2\\cdot\\dfrac{\\varphi}{360^\\circ}=\\pi\\cdot${r}^2\\cdot\\dfrac{${phi}}{360}\\approx${R2(PI*r*r*phi/360).toFixed(2)}\\text{ cm}^2\\)</p>`}}}
});
runQuiz(['23']);

/* ======================= 3 Kongruenzabbildungen (freiwillig) ======================= */
(function(){
  const f=new Fig($('f12'),{h:430});let mode='as',show=false,kons=false,k=1,phi=90;
  const P={A:{x:-5.5,y:-1.5},B:{x:-2.5,y:-2},C:{x:-3.5,y:1.5},G1:{x:0,y:-4.5},G2:{x:0.8,y:4.5},Z:{x:-0.5,y:1},V1:{x:-6,y:-4},V2:{x:-1,y:-2.5}};
  const H={};for(const key in P)H[key]=f.handle(P,key);
  const vis={as:['G1','G2'],ps:['Z'],dr:['Z'],vs:['V1','V2']};
  function img(Q,t=1){if(mode==='as'){const F=footOf(Q,P.G1,P.G2).p;return V.lerp(Q,V.sub(V.mul(F,2),Q),t)}
    if(mode==='ps'){return V.lerp(Q,V.sub(V.mul(P.Z,2),Q),t)}
    if(mode==='dr')return V.rot(Q,P.Z,phi*PI/180*t);return V.add(Q,V.mul(V.sub(P.V2,P.V1),t))}
  f.draw=()=>{for(const key in H)H[key].hidden=!(['A','B','C'].includes(key)||vis[mode].includes(key));
    const T=[P.A,P.B,P.C],L=['A','B','C'];
    if(mode==='as'){f.line(P.G1,V.sub(P.G2,P.G1),{c:VI,w:2.4});f.text(V.add(P.G2,{x:0.35,y:-0.2}),'g','lbl',{fill:VI})}
    if(mode==='ps'||mode==='dr'){f.dot(P.Z,5,VI);f.text(V.add(P.Z,{x:0.35,y:-0.4}),'Z','lbl',{fill:VI})}
    if(mode==='vs'){f.seg(P.V1,P.V2,{c:VI,w:2.4,me:'k'});f.text(V.add(V.mid(P.V1,P.V2),V.mul(V.norm(V.perp(V.sub(P.V2,P.V1))),0.4)),'v','lbl',{fill:VI})}
    f.poly(T,{c:C.blau,w:2.4,f:'rgba(47,120,168,.15)'});T.forEach((p,i)=>{f.dot(p,4,C.blau);lab(f,p,L[i],TRI.S(...T),{st:{fill:C.blau}})});
    if(!show)return;const I=T.map(p=>img(p,k));
    if(kons&&k>=1){T.forEach((p,i)=>{const q=I[i];
      if(mode==='as'){const F=footOf(p,P.G1,P.G2).p;f.seg(p,q,{c:'#999',w:1.3,d:'5 4'});f.rmark(F,V.ang(V.sub(P.G2,P.G1)),0.3,'#777');f.ticks(p,F,i+1,'#777');f.ticks(F,q,i+1,'#777')}
      if(mode==='ps'){f.seg(p,q,{c:'#999',w:1.3,d:'5 4'});f.ticks(p,P.Z,i+1,'#777');f.ticks(P.Z,q,i+1,'#777')}
      if(mode==='dr'){const r=V.dist(P.Z,p);const a0=V.ang(V.sub(p,P.Z));const a1=a0+phi*PI/180;f.arc(P.Z,Math.min(a0,a1),Math.max(a0,a1),r,{c:'#999',w:1.3,d:'5 4'});if(i===0){f.seg(P.Z,p,{c:'#999',w:1.3});f.seg(P.Z,q,{c:'#999',w:1.3});f.wedge(P.Z,Math.min(a0,a1),Math.max(a0,a1),0.8,{c:C.or,f:'#f9e0c3'});f.text(V.add(P.Z,V.mul(V.dir((a0+a1)/2),1.15)),'φ','lbl',{fill:'#a65b12'})}}
      if(mode==='vs')f.seg(p,q,{c:'#999',w:1.3,d:'5 4',me:'k'})})}
    f.poly(I,{c:C.or,w:2.4,f:'rgba(217,130,43,.18)'});if(k>=1)I.forEach((p,i)=>{f.dot(p,4,C.or);lab(f,p,L[i]+"'",TRI.S(...I),{st:{fill:'#a65b12'}})});
    if(k>=1){const o1=TRI.area2(...T)>0,o2=TRI.area2(...I)>0;const s=TRI.sides(...T);
      const fix={as:'alle Punkte auf \\(g\\)',ps:'nur \\(Z\\)',dr:'nur \\(Z\\)',vs:'keine'}[mode];
      const h=`\\(|\\overline{BC}|=|\\overline{B'C'}|=${fmt(s.a)}\\) cm, \\(|\\overline{CA}|=|\\overline{C'A'}|=${fmt(s.b)}\\) cm, \\(|\\overline{AB}|=|\\overline{A'B'}|=${fmt(s.c)}\\) cm<br>Umlaufsinn: ${o1===o2?'<b>gleich</b>':'<b>umgekehrt</b>'} (\\(ABC\\) ${o1?'gegen':'im'} Uhrzeigersinn, \\(A'B'C'\\) ${o2?'gegen':'im'} Uhrzeigersinn)<br>Fixpunkte: ${fix}`;
      const r=$('r12');if(r.dataset.h!==h){r.dataset.h=h;r.innerHTML=h;typesetEl(r)}}};
  function sl(){$('g12sl').innerHTML=mode==='dr'?`<label class="sld">φ = <input type="range" min="-180" max="180" step="5" value="${phi}" id="g12phi"><b>${phi}°</b></label>`:'';
    if(mode==='dr')$('g12phi').addEventListener('input',e=>{phi=+e.target.value;e.target.nextElementSibling.textContent=phi+'°';f.render()})}
  function reset(){show=false;kons=false;k=1;$('g12k').classList.remove('on');$('r12').dataset.h='';$('r12').innerHTML='Wo liegt das Bilddreieck? Überlege zuerst, dann klicke auf ▶ abbilden.';f.render()}
  btnGroup('#kongruenz [data-g]','g',v=>{mode=v;rowsOn('g12tab','g',v);sl();reset()});
  $('g12go').addEventListener('click',()=>{show=true;k=0;tween(1400,t=>{k=t;f.render()},()=>{k=1;f.render()})});
  $('g12k').addEventListener('click',()=>{kons=!kons;$('g12k').classList.toggle('on',kons);if(kons&&!show){show=true;k=1}f.render()});
  rowsOn('g12tab','g','as');sl();reset();
})();

/* ======================= 8 Konstruktionsaufgaben fürs Heft ======================= */
(function(){
  const OV=s=>`<span style="text-decoration:overline;font-style:italic">${s}</span>`,I=s=>`<i>${s}</i>`;
  const kx=v=>mn(fmt(v,1)),pt=p=>`(${kx(p.x)}; ${kx(p.y)})`,ptI=p=>`(${mn(p.x)}; ${mn(p.y)})`;
  const step=(a,b,s)=>a+s*rnd(0,Math.round((b-a)/s));
  const base=c=>({A:{x:-c/2,y:-4},B:{x:c/2,y:-4}});
  function axes(f){f.seg({x:f.xmin,y:0},{x:f.xmax-0.1,y:0},{c:'#55636e',w:1.3,me:'k'});f.seg({x:0,y:f.ymin},{x:0,y:f.ymax-0.1},{c:'#55636e',w:1.3,me:'k'});
    for(let x=Math.ceil(f.xmin+0.4);x<f.xmax-0.7;x++){if(!x)continue;f.seg({x,y:-0.1},{x,y:0.1},{c:'#55636e',w:1.2});if(x%2===0)f.text({x,y:-0.38},mn(x),'ann')}
    for(let y=Math.ceil(f.ymin+0.4);y<f.ymax-0.7;y++){if(!y)continue;f.seg({x:-0.1,y},{x:0.1,y},{c:'#55636e',w:1.2});if(y%2===0)f.text({x:-0.38,y},mn(y),'ann')}
    f.text({x:f.xmax-0.3,y:-0.4},'x','lbl sm');f.text({x:0.35,y:f.ymax-0.3},'y','lbl sm')}
  const AB=(f,d)=>{f.seg(d.A,d.B,{w:2.4});f.dot(d.A,3.8);f.dot(d.B,3.8);f.text({x:d.A.x-0.35,y:d.A.y-0.35},'A','lbl');f.text({x:d.B.x+0.35,y:d.B.y-0.35},'B','lbl');f.text({x:0,y:d.A.y-0.45},'c','lbl')};
  const triSol=(f,d,Cs)=>Cs.forEach((p,i)=>{f.poly([d.A,d.B,p],{c:i?C.or:C.blau,w:2,f:i?'rgba(217,130,43,.1)':'rgba(47,120,168,.1)'});f.dot(p,4,C.rot);f.text(V.add(p,{x:0,y:0.45}),Cs.length>1?'C_'+(i+1):'C','lbl',{fill:C.rot})});
  const angs=(A,B,Cc)=>{const a=TRI.angles(A,B,Cc);return`${I('α')} ≈ ${gr(a.al)}, ${I('β')} ≈ ${gr(a.be)}, ${I('γ')} ≈ ${gr(a.ga)}`};
  const TASKS={
    sss:{t:'Dreieck SSS',gen(){for(;;){const c=step(5,8,0.5),a=step(4,8,0.5),b=step(4,8,0.5);const d=base(c);const X=ccInt(d.A,b,d.B,a).filter(p=>p.y>-4);if(!X.length)continue;const w=TRI.angles(d.A,d.B,X[0]);if(Math.min(w.al,w.be,w.ga)>28&&X[0].y<6)return Object.assign(d,{a,b,c,C:X[0]})}},
      q:d=>`Die Seite ${I('c')} = ${OV('AB')} = ${fmt(d.c)} cm ist gezeichnet. Konstruiere das Dreieck mit ${I('a')} = ${fmt(d.a)} cm und ${I('b')} = ${fmt(d.b)} cm. Schreibe den Konstruktionsbericht und miss die drei Winkel.`,
      mess:()=>`${I('α')} = ______° &nbsp; ${I('β')} = ______° &nbsp; ${I('γ')} = ______°`,pre:AB,
      sol:d=>({txt:`Bericht: 1. ${I('k')}<sub>1</sub>(${I('A')}; ${fmt(d.b)} cm) &nbsp;2. ${I('k')}<sub>2</sub>(${I('B')}; ${fmt(d.a)} cm) &nbsp;3. ${I('C')} ∈ ${I('k')}<sub>1</sub> ∩ ${I('k')}<sub>2</sub><br>${angs(d.A,d.B,d.C)}`,
        draw(f){compArc(f,d.A,d.b,d.C,22);compArc(f,d.B,d.a,d.C,22);triSol(f,d,[d.C])}})},
    sws:{t:'Dreieck SWS',gen(){for(;;){const c=step(5,8,0.5),b=step(3.5,7,0.5),al=step(35,110,5);const d=base(c);const Cc=V.add(d.A,V.mul(V.dir(al*PI/180),b));const w=TRI.angles(d.A,d.B,Cc);if(Math.min(w.al,w.be,w.ga)>20&&Cc.y<6&&Cc.x>-8&&Cc.x<8)return Object.assign(d,{c,b,al,C:Cc})}},
      q:d=>`Die Seite ${I('c')} = ${fmt(d.c)} cm ist gezeichnet. Konstruiere das Dreieck mit ${I('b')} = ${fmt(d.b)} cm und ${I('α')} = ${d.al}°. Miss ${I('a')}, ${I('β')} und ${I('γ')}.`,
      mess:()=>`${I('a')} = ______ cm &nbsp; ${I('β')} = ______° &nbsp; ${I('γ')} = ______°`,pre:AB,
      sol:d=>({txt:`Bericht: 1. ${I('α')} = ${d.al}° in ${I('A')} antragen, Strahl ${I('s')} &nbsp;2. ${I('k')}(${I('A')}; ${fmt(d.b)} cm) &nbsp;3. ${I('C')} = ${I('k')} ∩ ${I('s')}<br>${I('a')} ≈ ${cm(V.dist(d.B,d.C))}, ${angs(d.A,d.B,d.C)}`,
        draw(f){f.seg(d.A,V.add(d.A,V.mul(V.dir(d.al*PI/180),d.b+1.5)),{c:VI,w:1.4});f.angle(d.A,0,d.al*PI/180,{r:0.8,c:VI,f:VIH,lab:'α'});compArc(f,d.A,d.b,d.C,18);triSol(f,d,[d.C])}})},
    wsw:{t:'Dreieck WSW',gen(){for(;;){const c=step(5,8,0.5),al=step(30,85,5),be=step(30,85,5);if(al+be>145)continue;const d=base(c);const Cc=lineX(d.A,V.dir(al*PI/180),d.B,V.dir(PI-be*PI/180));if(Cc.y<6)return Object.assign(d,{c,al,be,C:Cc})}},
      q:d=>`Die Seite ${I('c')} = ${fmt(d.c)} cm ist gezeichnet. Konstruiere das Dreieck mit ${I('α')} = ${d.al}° und ${I('β')} = ${d.be}°. Berechne ${I('γ')} und miss ${I('a')} und ${I('b')}.`,
      mess:()=>`${I('γ')} = ______° &nbsp; ${I('a')} = ______ cm &nbsp; ${I('b')} = ______ cm`,pre:AB,
      sol:d=>({txt:`Bericht: 1. ${I('α')} in ${I('A')} antragen, Strahl ${I('s')}<sub>A</sub> &nbsp;2. ${I('β')} in ${I('B')} antragen, Strahl ${I('s')}<sub>B</sub> &nbsp;3. ${I('C')} = ${I('s')}<sub>A</sub> ∩ ${I('s')}<sub>B</sub><br>${I('γ')} = 180° − ${d.al}° − ${d.be}° = ${180-d.al-d.be}°, ${I('a')} ≈ ${cm(V.dist(d.B,d.C))}, ${I('b')} ≈ ${cm(V.dist(d.A,d.C))}`,
        draw(f){f.angle(d.A,0,d.al*PI/180,{r:0.8,c:VI,f:VIH,lab:'α'});f.angle(d.B,PI-d.be*PI/180,PI,{r:0.8,c:VI,f:VIH,lab:'β'});triSol(f,d,[d.C])}})},
    ssw:{t:'Dreieck SsW',gen(){for(;;){const c=step(5,8,0.5),al=step(30,55,5);const two=Math.random()<0.6;const h=c*Math.sin(al*PI/180);const a=two?step(Math.ceil((h+0.4)*2)/2,c-0.5,0.5):step(c,c+2,0.5);if(two&&a>=c)continue;
        const d=base(c);const Cs=clInt(d.B,a,d.A,V.dir(al*PI/180)).filter(p=>V.dot(V.sub(p,d.A),V.dir(al*PI/180))>1e-6);if(Cs.length!==(two?2:1)||Cs.some(p=>p.y>6||p.y<-3.3))continue;return Object.assign(d,{c,a,al,Cs})}},
      q:d=>`Die Seite ${I('c')} = ${fmt(d.c)} cm ist gezeichnet. Konstruiere alle Dreiecke mit ${I('a')} = ${fmt(d.a)} cm und ${I('α')} = ${d.al}°. Wie viele Lösungen gibt es? Miss jeweils ${I('b')}.`,
      mess:()=>`Anzahl Lösungen: ______ &nbsp;&nbsp; ${I('b')} = ______ cm &nbsp; (${I('b')}<sub>2</sub> = ______ cm)`,pre:AB,
      sol:d=>({txt:`Bericht: 1. ${I('α')} in ${I('A')} antragen, Strahl ${I('s')} &nbsp;2. ${I('k')}(${I('B')}; ${fmt(d.a)} cm) &nbsp;3. ${I('C')} ∈ ${I('k')} ∩ ${I('s')}<br>${d.Cs.length} Lösung${d.Cs.length>1?'en':''}: ${d.Cs.map((p,i)=>`${I('b')}${d.Cs.length>1?'<sub>'+(i+1)+'</sub>':''} ≈ ${cm(V.dist(d.A,p))}`).join(', ')}<br>${d.Cs.length>1?`Zwei Lösungen, weil ${I('α')} der kleineren Seite gegenüberliegt (${I('a')} < ${I('c')}).`:`Eine Lösung, weil ${I('α')} der grösseren Seite gegenüberliegt (${I('a')} ≥ ${I('c')}).`}`,
        draw(f){f.seg(d.A,V.add(d.A,V.mul(V.dir(d.al*PI/180),11)),{c:VI,w:1.4});f.angle(d.A,0,d.al*PI/180,{r:0.8,c:VI,f:VIH,lab:'α'});d.Cs.forEach(p=>compArc(f,d.B,d.a,p,14));triSol(f,d,d.Cs)}})},
    thales:{t:'Rechtwinkliges Dreieck mit dem Thaleskreis',gen(){const c=step(6,9,0.5),a=step(3,c-1.5,0.5);const d=base(c);const M=V.mid(d.A,d.B);const X=ccInt(M,c/2,d.B,a).filter(p=>p.y>-4);return Object.assign(d,{c,a,C:X[0]})},
      q:d=>`Die Hypotenuse ${I('c')} = ${fmt(d.c)} cm ist gezeichnet. Konstruiere das rechtwinklige Dreieck mit ${I('γ')} = 90° und der Kathete ${I('a')} = ${fmt(d.a)} cm. Miss ${I('b')} und ${I('α')}.`,
      mess:()=>`${I('b')} = ______ cm &nbsp; ${I('α')} = ______° &nbsp; ${I('β')} = ______°`,pre:AB,
      sol:d=>{const M=V.mid(d.A,d.B);return{txt:`Bericht: 1. ${I('M')} = Mitte von ${OV('AB')} (Mittelsenkrechte) &nbsp;2. Thaleskreis ${I('k')}<sub>T</sub>(${I('M')}; ${fmt(d.c/2,2)} cm) &nbsp;3. ${I('k')}(${I('B')}; ${fmt(d.a)} cm) &nbsp;4. ${I('C')} ∈ ${I('k')} ∩ ${I('k')}<sub>T</sub><br>${I('b')} ≈ ${cm(V.dist(d.A,d.C))}, ${angs(d.A,d.B,d.C)}`,
        draw(f){f.arc(M,0,PI,d.c/2,{c:VI,w:1.4,d:'6 4'});f.dot(M,3,VI);f.text({x:M.x,y:M.y-0.4},'M','lbl',{fill:VI});compArc(f,d.B,d.a,d.C,18);triSol(f,d,[d.C]);const w=ang2(d.C,d.A,d.B);f.rmark(d.C,w.a1,0.4,C.rot)}}}},
    tang:{t:'Tangenten an einen Kreis',gen(){const r=step(2,3,0.5),dd=step(6,7.5,0.5);const M={x:-3.5,y:0.5};return{M,r,dd,P:{x:M.x+dd,y:0.5}}},
      q:d=>`Gegeben sind der Kreis ${I('k')}(${I('M')}; ${fmt(d.r)} cm) und der Punkt ${I('P')} mit ${OV('MP')} = ${fmt(d.dd)} cm. Konstruiere die beiden Tangenten von ${I('P')} an ${I('k')}. Miss die Tangentenabschnitte ${OV('PT')} und den Winkel ∠${I('T')}<sub>1</sub>${I('P')}${I('T')}<sub>2</sub>.`,
      mess:()=>`${OV('PT<sub>1</sub>')} = ______ cm &nbsp; ∠${I('T')}<sub>1</sub>${I('P')}${I('T')}<sub>2</sub> = ______°`,
      pre:(f,d)=>{f.circ(d.M,d.r,{w:2.2});f.dot(d.M,3.8);f.text({x:d.M.x-0.35,y:d.M.y-0.4},'M','lbl');f.dot(d.P,3.8);f.text({x:d.P.x+0.35,y:d.P.y+0.3},'P','lbl');f.text(V.add(d.M,V.mul(V.dir(2.3),d.r+0.35)),'k','lbl')},
      sol:d=>{const H=V.mid(d.M,d.P),T=ccInt(d.M,d.r,H,d.dd/2);const pt_=Math.sqrt(d.dd*d.dd-d.r*d.r),an=2*Math.asin(d.r/d.dd)*DEG;
        return{txt:`Bericht: 1. ${I('H')} = Mitte von ${OV('MP')} &nbsp;2. Thaleskreis ${I('k')}<sub>T</sub>(${I('H')}; ${fmt(d.dd/2,2)} cm) &nbsp;3. {${I('T')}<sub>1</sub>, ${I('T')}<sub>2</sub>} = ${I('k')} ∩ ${I('k')}<sub>T</sub> &nbsp;4. ${I('t')}<sub>1</sub> = ${I('PT')}<sub>1</sub>, ${I('t')}<sub>2</sub> = ${I('PT')}<sub>2</sub><br>${OV('PT')} ≈ ${cm(pt_)}, ∠${I('T')}<sub>1</sub>${I('P')}${I('T')}<sub>2</sub> ≈ ${gr(an)}`,
        draw(f){f.circ(H,d.dd/2,{c:VI,w:1.4,d:'6 4'});f.dot(H,3,VI);T.forEach((p,i)=>{const v=V.sub(p,d.P);f.seg(V.sub(d.P,V.mul(v,0.15)),V.add(d.P,V.mul(v,1.3)),{c:C.or,w:2});f.seg(d.M,p,{c:'#888',w:1.2,d:'4 3'});f.dot(p,4,C.rot);f.text(V.add(p,V.mul(V.norm(V.sub(p,d.M)),0.45)),'T_'+(i+1),'lbl',{fill:C.rot})})}}}},
    orts:{t:'Punkte mit zwei Bedingungen',axes:true,gen(){for(;;){const A={x:rnd(-6,-2),y:rnd(-5,-1)},B={x:rnd(1,6),y:rnd(-5,3)},Cc={x:rnd(-4,4),y:rnd(1,5)},r=step(2,4,0.5);
        const m=V.mid(A,B),dd=V.perp(V.sub(B,A));const X=clInt(Cc,r,m,dd);if(X.length===2&&V.dist(X[0],X[1])>1.5&&X.every(p=>Math.abs(p.x)<7.5&&p.y>-6&&p.y<6.5))return{A,B,C:Cc,r,X}}},
      q:d=>`Gegeben sind ${I('A')}${ptI(d.A)}, ${I('B')}${ptI(d.B)} und ${I('C')}${ptI(d.C)} (1 Einheit = 1 cm). Konstruiere alle Punkte ${I('P')}, die von ${I('A')} und ${I('B')} gleich weit entfernt sind und von ${I('C')} den Abstand ${fmt(d.r)} cm haben. Lies die Koordinaten ab.`,
      mess:()=>`${I('P')}<sub>1</sub> = ( ______ ; ______ ) &nbsp;&nbsp; ${I('P')}<sub>2</sub> = ( ______ ; ______ )`,
      pre:(f,d)=>{[['A',d.A],['B',d.B],['C',d.C]].forEach(([s,p])=>{f.dot(p,4);f.text(V.add(p,{x:0.35,y:0.35}),s,'lbl')})},
      sol:d=>({txt:`Bericht: 1. ${I('m')}<sub>AB</sub> &nbsp;2. ${I('k')}(${I('C')}; ${fmt(d.r)} cm) &nbsp;3. {${I('P')}<sub>1</sub>, ${I('P')}<sub>2</sub>} = ${I('m')}<sub>AB</sub> ∩ ${I('k')}<br>${I('P')}<sub>1</sub> ≈ ${pt(d.X[0])}, ${I('P')}<sub>2</sub> ≈ ${pt(d.X[1])}`,
        draw(f){f.line(V.mid(d.A,d.B),V.perp(V.sub(d.B,d.A)),{c:C.blau,w:1.8});f.seg(d.A,d.B,{c:'#999',w:1,d:'3 3'});f.circ(d.C,d.r,{c:C.or,w:1.8});d.X.forEach((p,i)=>{f.dot(p,4.5,C.rot);f.text(V.add(p,{x:0.45,y:-0.35}),'P_'+(i+1),'lbl',{fill:C.rot})})}})},
    para:{t:'Parallelogramm',gen(){const a=step(5,8,0.5),b=step(3,5,0.5),al=step(45,75,5);const A={x:-(a+b*Math.cos(al*PI/180))/2,y:-3.5};const B={x:A.x+a,y:A.y};const D=V.add(A,V.mul(V.dir(al*PI/180),b));return{a,b,al,A,B,D,C:V.add(D,{x:a,y:0})}},
      q:d=>`Die Seite ${I('a')} = ${OV('AB')} = ${fmt(d.a)} cm ist gezeichnet. Konstruiere das Parallelogramm ${I('ABCD')} mit ${I('b')} = ${fmt(d.b)} cm und ${I('α')} = ${d.al}°. Miss die Diagonalen ${I('e')}, ${I('f')} und die Höhe ${I('h')}<sub>a</sub>. Berechne den Flächeninhalt.`,
      mess:()=>`${I('e')} = ______ cm &nbsp; ${I('f')} = ______ cm &nbsp; ${I('h')}<sub>a</sub> = ______ cm &nbsp; ${I('A')} = ______ cm²`,
      pre:(f,d)=>{f.seg(d.A,d.B,{w:2.4});f.dot(d.A,3.8);f.dot(d.B,3.8);f.text({x:d.A.x-0.35,y:d.A.y-0.35},'A','lbl');f.text({x:d.B.x+0.35,y:d.B.y-0.35},'B','lbl');f.text({x:(d.A.x+d.B.x)/2,y:d.A.y-0.45},'a','lbl')},
      sol:d=>{const h=d.b*Math.sin(d.al*PI/180);return{txt:`Bericht: 1. ${I('α')} in ${I('A')} antragen, ${I('D')} auf dem Strahl mit ${OV('AD')} = ${fmt(d.b)} cm &nbsp;2. ${I('k')}(${I('D')}; ${fmt(d.a)} cm) &nbsp;3. ${I('k')}(${I('B')}; ${fmt(d.b)} cm) &nbsp;4. ${I('C')} = Schnittpunkt<br>${I('e')} ≈ ${cm(V.dist(d.A,d.C))}, ${I('f')} ≈ ${cm(V.dist(d.B,d.D))}, ${I('h')}<sub>a</sub> ≈ ${cm(h)}, ${I('A')} = ${I('a')} · ${I('h')}<sub>a</sub> ≈ ${fmt(d.a*h,1)} cm²`,
        draw(f){f.angle(d.A,0,d.al*PI/180,{r:0.8,c:VI,f:VIH,lab:'α'});compArc(f,d.D,d.a,d.C,14);compArc(f,d.B,d.b,d.C,14);f.poly([d.A,d.B,d.C,d.D],{c:C.blau,w:2,f:'rgba(47,120,168,.1)'});f.seg(d.A,d.C,{c:'#888',w:1.2,d:'5 4'});f.seg(d.B,d.D,{c:'#888',w:1.2,d:'5 4'});
          const F={x:d.D.x,y:d.A.y};f.seg(d.D,F,{c:C.rot,w:1.4,d:'4 3'});f.rmark(F,0,0.3,C.rot);[['C',d.C],['D',d.D]].forEach(([s,p])=>f.text(V.add(p,{x:0,y:0.4}),s,'lbl',{fill:C.blau}))}}}},
    spieg:{t:'Kongruenzabbildung (freiwillig)',axes:true,gen(){const T=()=>{for(;;){const A={x:rnd(-6,-2),y:rnd(-5,-1)},B={x:A.x+rnd(2,4),y:A.y+rnd(-1,1)},Cc={x:A.x+rnd(0,3),y:A.y+rnd(2,4)};if(Math.abs(TRI.area2(A,B,Cc))>3)return[A,B,Cc]}};
        for(;;){const P=T();const typ=pick(['ax','ay','pz','dr']);let map,el;
          if(typ==='ax'){const k=rnd(-1,1);map=p=>({x:2*k-p.x,y:p.y});el={t:'g',k,txt:`an der Geraden ${I('g')}: ${I('x')} = ${k}`}}
          if(typ==='ay'){const k=rnd(-1,1);map=p=>({x:p.x,y:2*k-p.y});el={t:'h',k,txt:`an der Geraden ${I('g')}: ${I('y')} = ${k}`}}
          if(typ==='pz'){const Z={x:rnd(-2,1),y:rnd(-1,1)};map=p=>({x:2*Z.x-p.x,y:2*Z.y-p.y});el={t:'z',Z,txt:`am Punkt ${I('Z')}${ptI(Z)}`}}
          if(typ==='dr'){const Z={x:rnd(-1,1),y:rnd(-1,1)};map=p=>({x:Z.x-(p.y-Z.y),y:Z.y+(p.x-Z.x)});el={t:'d',Z,txt:`um ${I('Z')}${ptI(Z)} mit ${I('φ')} = 90° (Gegenuhrzeigersinn)`}}
          const Q=P.map(map);if(Q.every(p=>Math.abs(p.x)<=7.5&&p.y>=-6&&p.y<=6.5))return{P,Q,typ,el}}},
      q:d=>`Gegeben ist das Dreieck ${I('A')}${ptI(d.P[0])}, ${I('B')}${ptI(d.P[1])}, ${I('C')}${ptI(d.P[2])}. Bilde es ab: ${{ax:'Achsenspiegelung',ay:'Achsenspiegelung',pz:'Punktspiegelung',dr:'Drehung'}[d.typ]} ${d.el.txt}. Gib die Koordinaten der Bildpunkte an. Ändert sich der Umlaufsinn?`,
      mess:()=>`${I('A')}' = ( ___ ; ___ ) &nbsp; ${I('B')}' = ( ___ ; ___ ) &nbsp; ${I('C')}' = ( ___ ; ___ ) &nbsp; Umlaufsinn: ________`,
      pre:(f,d)=>{f.poly(d.P,{c:C.ink,w:2.2,f:'rgba(47,120,168,.08)'});['A','B','C'].forEach((s,i)=>{f.dot(d.P[i],3.8);f.text(V.add(d.P[i],V.mul(V.norm(V.sub(d.P[i],TRI.S(...d.P))),0.42)),s,'lbl')});
        const e=d.el;if(e.t==='g'){f.line({x:e.k,y:0},{x:0,y:1},{c:VI,w:2});f.text({x:e.k+0.35,y:f.ymax-0.6},'g','lbl',{fill:VI})}if(e.t==='h'){f.line({x:0,y:e.k},{x:1,y:0},{c:VI,w:2});f.text({x:f.xmax-0.6,y:e.k+0.35},'g','lbl',{fill:VI})}
        if(e.Z){f.dot(e.Z,4.5,VI);f.text(V.add(e.Z,{x:0.35,y:-0.35}),'Z','lbl',{fill:VI})}},
      sol:d=>({txt:`${I('A')}' = ${ptI(d.Q[0])}, ${I('B')}' = ${ptI(d.Q[1])}, ${I('C')}' = ${ptI(d.Q[2])}<br>Umlaufsinn: ${d.typ[0]==='a'?'<b>umgekehrt</b> (Achsenspiegelung)':'<b>gleich</b>'}`,
        draw(f){f.poly(d.Q,{c:C.or,w:2.2,f:'rgba(217,130,43,.15)'});d.P.forEach((p,i)=>{f.seg(p,d.Q[i],{c:'#999',w:1.1,d:'4 3'});f.dot(d.Q[i],3.8,C.or);f.text(V.add(d.Q[i],V.mul(V.norm(V.sub(d.Q[i],TRI.S(...d.Q))),0.42)),'ABC'[i]+"'",'lbl',{fill:'#a65b12'})})}})}
  };
  const keys=Object.keys(TASKS);
  const makeTask=k=>({k,task:TASKS[k],d:TASKS[k].gen()});
  let cur=null,fig=null,showSol=false;
  function figDraw(f,t,withPre,sol){if(t.task.axes)axes(f);if(withPre||sol)t.task.pre(f,t.d);if(sol)sol(f)}
  function neu(){const v=$('ktyp').value;cur=makeTask(v==='mix'?pick(keys):v);showSol=false;
    $('kt').textContent=cur.task.t;$('kq').innerHTML=`<p>${cur.task.q(cur.d)}</p><p class="hint" style="margin:0">Messwerte: ${cur.task.mess(cur.d)}</p>`;
    const s=cur.task.sol(cur.d);$('kl').innerHTML=`<p><b>Kontrolle</b><br>${s.txt}</p>`;$('kl').classList.remove('on');$('kshow').textContent='Kontrolle anzeigen';
    const host=$('kf');host.querySelector('svg')?.remove();fig=new Fig(host,{w:560,h:380,s:30,oy:205});fig.draw=()=>figDraw(fig,cur,true,showSol?s.draw:null);fig.render()}
  $('kneu').addEventListener('click',neu);$('ktyp').addEventListener('change',neu);
  $('kshow').addEventListener('click',()=>{showSol=!showSol;$('kl').classList.toggle('on',showSol);$('kshow').textContent=showSol?'Kontrolle ausblenden':'Kontrolle anzeigen';fig.render()});
  neu();
  /* ---- Druckseite ---- */
  const PX=96/2.54;
  function printFig(holder,t,sol){const f=new Fig(holder,{w:17*PX,h:14*PX,s:PX,ox:8.5*PX,oy:7.5*PX});f.draw=()=>figDraw(f,t,true,sol);f.render();f.svg.style.cssText=`display:block;width:${17*PX}px;height:${14*PX}px;margin:0 auto`;return f.svg}
  function inlineSvg(svg){svg.querySelectorAll('[class]').forEach(el=>{const cs=getComputedStyle(el);for(const p of['stroke','stroke-width','fill','font-family','font-size','font-style','font-weight','paint-order','stroke-linejoin'])el.style.setProperty(p,cs.getPropertyValue(p))})}
  function page(inner,no,total){const pg=document.createElement('div');pg.className='pg';
    pg.innerHTML=`<div class="pg-kopf"><span>IDM EA Mathematik · Klasse EA2025</span><span>Geometrie 2.3 · Konstruktionen</span></div>${inner}<div class="pg-fuss"><span>Raphael Arnold Kohler</span><span>Seite ${no} / ${total}</span></div>`;return pg}
  const taskInner=(t,i)=>`<div class="pg-name"><span>Name: ______________________________</span><span>Datum: ______________</span></div><h2 class="pg-h">Aufgabe ${i+1}: ${t.task.t}</h2><p>${t.task.q(t.d)}</p>
    <p class="pg-klein">Hilfsmittel: Bleistift, Zirkel, Lineal bzw. Geodreieck. Konstruktionslinien stehen lassen, Konstruktionsbericht auf die Rückseite oder ins Heft. 1 Häuschen = 5 mm (beim Drucken «Tatsächliche Grösse / 100 %» wählen).</p><div class="pg-fig"></div><p class="pg-mess"><b>Messwerte:</b> ${t.task.mess(t.d)}</p>`;
  const solInner=(t,i)=>`<h2 class="pg-h">Lösung zu Aufgabe ${i+1}: ${t.task.t}</h2><p>${t.task.q(t.d)}</p><div class="pg-fig"></div><div class="pg-sol"><b>Kontrolle</b><br>${t.task.sol(t.d).txt}</div>`;
  const PRINTCSS=`@page{size:A4;margin:0}body{margin:0;background:#e6eaee;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.bar{position:sticky;top:0;z-index:5;background:#5f527f;color:#fff;font:15px "Source Sans 3",sans-serif;padding:10px 16px;display:flex;gap:14px;align-items:center}
.bar button{font:600 15px "Source Sans 3",sans-serif;background:#fff;color:#5f527f;border:0;border-radius:5px;padding:6px 14px;cursor:pointer}
.pg{width:210mm;height:296.5mm;overflow:hidden;margin:12px auto;box-shadow:0 2px 10px rgba(0,0,0,.18);padding:48px 64px 0;box-sizing:border-box;position:relative;background:#fff;color:#1f2a33;font:15px/1.5 "Source Serif 4",Georgia,serif}
.pg p{margin:0 0 8px}
.pg-kopf{display:flex;justify-content:space-between;border-bottom:1.5px solid #1f2a33;padding-bottom:4px;margin-bottom:12px;font:600 13px "Source Sans 3",sans-serif}
.pg-name{display:flex;justify-content:space-between;margin:0 0 12px;font:14px "Source Sans 3",sans-serif}
.pg-h{font:700 20px "Source Sans 3",sans-serif;margin:0 0 8px}
.pg-klein{font:12.5px "Source Sans 3",sans-serif;color:#55636e}
.pg-fig{margin:8px 0 10px}.pg-mess{font-size:15px;margin-top:6px}
.pg-sol{border:1px solid #c9d6df;border-radius:6px;padding:8px 12px;font-size:14.5px}
.pg-fuss{position:absolute;left:64px;right:64px;bottom:38px;display:flex;justify-content:space-between;border-top:1px solid #9aa7b1;padding-top:4px;font:12px "Source Sans 3",sans-serif;color:#55636e}
@media print{.bar{display:none}body{background:#fff}.pg{margin:0;box-shadow:none;break-after:page}}`;
  function buildPrintHtml(list,title){const specs=[];list.forEach((t,i)=>specs.push({inner:taskInner(t,i),t,sol:false}));list.forEach((t,i)=>specs.push({inner:solInner(t,i),t,sol:true}));
    const holder=document.createElement('div');holder.style.cssText='position:fixed;left:-20000px;top:0;';document.body.appendChild(holder);let body='';
    specs.forEach((sp,i)=>{holder.innerHTML='';const pg=page(sp.inner,i+1,specs.length);holder.appendChild(pg);const svg=printFig(pg.querySelector('.pg-fig'),sp.t,sp.sol?sp.t.task.sol(sp.t.d).draw:null);inlineSvg(svg);svg.querySelectorAll('.hd').forEach(e=>e.remove());body+=pg.outerHTML});
    holder.remove();
    return`<!DOCTYPE html><html lang="de-CH"><head><meta charset="utf-8"><title>${title}</title><link rel="stylesheet" href="${new URL('schriften.css',location.href).href}"><style>${PRINTCSS}</style></head><body>
<div class="bar"><button onclick="window.print()">⎙ Drucken</button><span>${title} · ${specs.length} Seiten · Im Druckdialog <b>beidseitig (lange Kante)</b> und <b>«Tatsächliche Grösse / 100 %»</b> wählen. (Falls der Knopf nicht reagiert: Ctrl+P bzw. ⌘P.)</span></div>
${body}<script>document.fonts&&document.fonts.ready.then(()=>setTimeout(()=>{try{window.print()}catch(e){}},500))<\/script></body></html>`}
  async function openPrint(list,title,filename){const st=$('kstat');const html=buildPrintHtml(list,title);let w=null;
    try{const url=URL.createObjectURL(new Blob([html],{type:'text/html'}));w=window.open(url,'_blank')}catch(e){w=null}
    if(w){st.innerHTML='<span class="ok">Druckseite in neuem Tab geöffnet.</span>';return}
    try{const dl=window.claude&&claude.use?await claude.use('downloads'):null;
      if(!dl){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));a.download=filename;document.body.appendChild(a);a.click();a.remove();st.innerHTML='<span class="ok">Druckseite heruntergeladen. Öffne die Datei: Sie erscheint in einem eigenen Tab und lässt sich direkt drucken.</span>';return}
      st.textContent='Der Browser lässt hier keinen neuen Tab zu. Speichern bestätigen …';await dl.save({filename,data:html});st.innerHTML='<span class="ok">Druckseite gespeichert. Öffne die Datei und drucke sie.</span>'}
    catch(e){st.innerHTML=e&&e.code==='declined'?'Speichern abgebrochen.':'<span class="warn">Druckseite konnte nicht erstellt werden.</span>'}}
  window.__k23print=list=>buildPrintHtml(list||[cur,makeTask(cur.k)],'Test');window.__k23make=makeTask;
  $('kprint').addEventListener('click',()=>{const v=$('ktyp').value;const k2=v==='mix'?pick(keys.filter(k=>k!==cur.k)):cur.k;const t2=makeTask(k2);
    const name=v==='mix'?'Konstruktionsaufgaben 2.3':`Konstruktionsaufgaben 2.3 ${cur.task.t}`;openPrint([cur,t2],name,name.replace(/\W+/g,'_')+'.html')});
})();
