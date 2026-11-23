/* ======================= Grundkonstruktionen ======================= */
function ccx(c1,r1,c2,r2){const d=V.dist(c1,c2);if(d<1e-9||d>r1+r2||d<Math.abs(r1-r2))return null;const a=(r1*r1-r2*r2+d*d)/(2*d),h=Math.sqrt(Math.max(0,r1*r1-a*a));
  const u=V.norm(V.sub(c2,c1)),m=V.add(c1,V.mul(u,a)),n=V.perp(u);return[V.add(m,V.mul(n,h)),V.sub(m,V.mul(n,h))]}
function clx(c,r,p,d){d=V.norm(d);const w=V.sub(p,c);const b=V.dot(w,d),q=V.dot(w,w)-r*r,disc=b*b-q;if(disc<0)return null;const s=Math.sqrt(disc);return[V.add(p,V.mul(d,-b-s)),V.add(p,V.mul(d,-b+s))]}
function arcIt(c,r,pts,mDeg){const m=mDeg/DEG;const as=pts.map(p=>V.ang(V.sub(p,c)));let a1,a2;
  if(as.length===1){a1=as[0]-m;a2=as[0]+m}else{const a=as[0],b=as[1],d=norm2pi(b-a);if(d<=PI){a1=a-m;a2=a+d+m}else{a1=b-m;a2=b+(2*PI-d)+m}}
  return{k:'arc',c,r,a1,a2}}
const ptIt=(p,lab,lo,col,from)=>({k:'pt',p,lab,lo:lo||{x:0.35,y:0.4},col,from});
const away=(p,c,k=0.45)=>V.mul(V.norm(V.sub(p,c)),k);
const upN=d=>{const n=V.perp(d);return n.y<0||(n.y===0&&n.x<0)?V.mul(n,-1):n};
function compassGlyph(f,c,pen){const d=V.sub(pen,c),L=V.len(d);let n=V.perp(V.norm(d));if(n.y<0)n=V.mul(n,-1);
  const h=V.add(V.mid(c,pen),V.mul(n,Math.max(1.2,L*0.62)));const leg={c:'#4f5a63',w:3.6,o:0.85};
  f.seg(c,h,leg);f.seg(h,V.lerp(h,pen,0.8),leg);f.seg(V.lerp(h,pen,0.8),pen,{c:C.or,w:3.6,o:0.95});
  f.seg(h,V.add(h,V.mul(n,0.55)),{c:'#4f5a63',w:6,o:0.85});f.circ(h,0.14,{c:'#4f5a63',w:2,f:'#fff'});f.dot(c,2.4,'#111')}
function rulerGlyph(f,s,e){const d=V.norm(V.sub(e,s));let n=V.perp(d);if(n.y<0)n=V.mul(n,-1);
  const a=V.add(s,V.mul(n,0.06)),b=V.add(e,V.mul(n,0.06));f.poly([a,b,V.add(b,V.mul(n,0.62)),V.add(a,V.mul(n,0.62))],{c:'#b8952e',w:1.2,f:'rgba(244,214,120,.38)'});
  const L=V.dist(a,b);for(let i=1;i<L*2;i++){const x=i/2,p=V.add(a,V.mul(d,x));f.seg(p,V.add(p,V.mul(n,i%2?0.12:0.22)),{c:'#b8952e',w:1})}}
/* Geodreieck: Nullpunkt Z auf der langen Kante (Richtung u), Spitze in Richtung n */
const geoEdge=deg=>{const t=deg/DEG;return 6/(Math.sin(t)+Math.abs(Math.cos(t)))};
function geoGlyph(f,Z,u,n,o={}){const H=6,L=6,op=o.op??1,col='#3f7fa8';
  const P1=V.sub(Z,V.mul(u,L)),P2=V.add(Z,V.mul(u,L)),Ap=V.add(Z,V.mul(n,H));
  f.poly([P1,P2,Ap],{c:col,w:1.4,f:'rgba(190,222,242,.55)',o:op});
  for(let i=-11;i<=11;i++){const x=i/2,p=V.add(Z,V.mul(u,x)),big=i%2===0;f.seg(p,V.add(p,V.mul(n,big?0.32:0.18)),{c:col,w:1,o:op});
    if(big&&i!==0&&Math.abs(i)<=10)f.text(V.add(p,V.mul(n,0.55)),String(Math.abs(x)),'ann',{fill:col,opacity:op,fontSize:'10px'})}
  f.seg(Z,V.add(Z,V.mul(n,H-0.9)),{c:col,w:1,o:op});f.circ(Z,0.12,{c:col,w:1.4,f:'#fff',o:op});
  if(o.helper&&o.helper<H-0.3){const h=o.helper,w=L*(1-h/H)-0.2,m=V.add(Z,V.mul(n,h));f.seg(V.sub(m,V.mul(u,w)),V.add(m,V.mul(u,w)),{c:col,w:1.6,d:'4 3',o:op})}
  const dir=a=>{const t=a/DEG;return V.add(V.mul(u,Math.cos(t)),V.mul(n,Math.sin(t)))};
  for(let a=10;a<=170;a+=5){const e=geoEdge(a),dd=dir(a),len=a%10?0.18:(a%30?0.3:0.42);f.seg(V.add(Z,V.mul(dd,e-len)),V.add(Z,V.mul(dd,e)),{c:col,w:1,o:op});
    if(a%30===0)f.text(V.add(Z,V.mul(dd,e-0.75)),String(a),'ann',{fill:col,opacity:op,fontSize:'10px'})}
  if(o.mark!=null){const e=geoEdge(o.mark),dd=dir(o.mark);f.seg(V.add(Z,V.mul(dd,e-0.5)),V.add(Z,V.mul(dd,e+0.12)),{c:C.or,w:2.8,o:op})}}
const GC='#6f7c87';
function drawItem(f,it,fi,glyph){
  if(it.from!=null||it.to!=null){const a=it.from||0,b=it.to??1;fi=clamp((fi-a)/(b-a),0,1)}
  if(fi<=0)return;
  if(it.k==='arc'){const e=it.a1+(it.a2-it.a1)*fi;f.arc(it.c,it.a1,e,it.r,{c:it.col||GC,w:1.5});
    if(it.rTo)f.seg(it.c,it.rTo,{c:GC,w:1.2,d:'4 4',o:Math.min(1,fi*2)});
    if(it.rlab){const ra=it.rAng??(it.a1+0.3*(it.a2-it.a1)),q=V.add(it.c,V.mul(V.dir(ra),it.r));f.seg(it.c,q,{c:GC,w:1.2,d:'4 4',o:Math.min(1,fi*2)});
      f.text(V.add(V.mid(it.c,q),V.mul(V.perp(V.dir(ra)),0.3)),it.rlab,'lbl sm',{fill:'#55636e',opacity:Math.min(1,fi*2)})}
    if(it.lab&&fi>0.6){const la=it.labAng??(it.a2+0.05);f.text(f.inView(V.add(it.c,V.mul(V.dir(la),it.r+0.38))),it.lab,'lbl sm',{fill:'#55636e'})}
    if(glyph&&fi<1)compassGlyph(f,it.c,V.add(it.c,V.mul(V.dir(e),it.r)))}
  else if(it.k==='line'){const d=V.norm(V.sub(it.q,it.p));const s=it.ray?it.p:V.sub(it.p,V.mul(d,it.ext||0)),e=V.add(it.q,V.mul(d,it.ext||0));
    f.seg(s,V.lerp(s,e,fi),{c:it.col||C.or,w:it.w||2.6,d:it.dash});if(glyph&&fi<1&&!it.noRuler)rulerGlyph(f,s,e);
    if(fi>=1&&it.lab)f.text(f.inView(it.labAt),it.lab,'lbl',{fill:it.col||C.or})}
  else if(it.k==='pt'){if(fi>0.25){const k=Math.min(1,(fi-0.25)/0.4);f.dot(it.p,3.8*k+0.2,it.col||C.ink);if(it.lab)f.text(V.add(it.p,it.lo),it.lab,'lbl',{fill:it.col||C.ink,opacity:k})}}
  else if(it.k==='geo'){if(glyph&&fi<1){const s=it.noSlide?1:ease(clamp(fi/0.3,0,1));const Z=V.add(it.Z,V.mul(V.add(V.mul(it.n,1.6),V.mul(it.u,1.2)),1-s));geoGlyph(f,Z,it.u,it.n,{op:0.35+0.65*s,helper:it.helper,mark:it.mark})}}
  else if(it.k==='fn')it.fn(f,fi);
}
function lineBase(f,G1,G2,lab='g'){const d=V.norm(V.sub(G2,G1));f.line(G1,d,{w:2.6});f.text(f.inView(V.add(G2,V.add(V.mul(d,1.5),V.mul(V.perp(d),-0.45)))),lab);f.dot(G1,2.6,C.grau);f.dot(G2,2.6,C.grau)}
const rmarkBetween=(f,Pv,d1,d2,r,c)=>f.rmark(Pv,V.cross(d1,d2)>0?V.ang(d1):V.ang(d2),r,c);
const OV=s=>`<i>|</i><span class="ov">${s}</span><i>|</i>`;
function angleRayBase(f,S,u,lab='g'){f.seg(S,V.add(S,V.mul(u,30)),{w:2.6});f.dot(S,4);f.text(V.add(S,V.add(V.mul(u,-0.45),{x:0,y:-0.1})),'S');f.text(f.inView(V.add(S,V.add(V.mul(u,10),V.mul(upN(u),-0.45)))),lab)}
function angleFn(S,a1,deg,col,lr){return{k:'fn',fn:(f,fi)=>{if(fi<=0)return;f.wedge(S,a1,a1+deg/DEG,1.25,{c:col,f:col===C.or?C.orh:C.grh,o:fi});if(fi>0.5)f.text(V.add(S,V.mul(V.dir(a1+deg/2/DEG),lr||1.85)),deg+'°','ann',{fill:col})}}}

const KON={
  ms:{titel:'Mittelsenkrechte einer Strecke (Strecke halbieren)',hint:'Ziehe A und B.',
    check:G=>V.dist(G.A,G.B)>=2.5,
    build(G,v){const {A,B}=G,d=V.norm(V.sub(B,A)),M=V.mid(A,B),dAB=V.dist(A,B),n0=upN(d);
      const base=f=>{f.seg(A,B,{w:2.6});f.dot(A,4);f.dot(B,4);f.text(V.add(A,V.mul(d,-0.48)),'A');f.text(V.add(B,V.mul(d,0.48)),'B')};
      const fin=(from)=>({k:'fn',from,fn:(f,fi)=>{if(fi>0.4){f.ticks(A,M,1,C.or);f.ticks(M,B,1,C.or);rmarkBetween(f,M,d,n0,0.45,C.or)}}});
      const orts={on:M,dir:n0,draw(f,X){f.seg(X,A,{c:C.vi,w:1.6,d:'6 4'});f.seg(X,B,{c:C.vi,w:1.6,d:'6 4'});f.dot(X,4,C.vi);f.text(V.add(X,{x:0.4,y:0.35}),'X','lbl',{fill:C.vi});
          return`${OV('XA')} = ${cm(V.dist(X,A))} &nbsp; ${OV('XB')} = ${cm(V.dist(X,B))}<br>Ziehe <i>X</i> auf <i>m</i>: Die beiden Abstände bleiben immer gleich.`}};
      if(v==='geo')return{base,orts,warum:'Mit dem Massstab wird die Mitte <i>M</i> gemessen, mit der Mittellinie des Geodreiecks der rechte Winkel gezeichnet. Die Genauigkeit hängt vom Ablesen ab (etwa ±0.5 mm).',
        steps:[
          {tool:'g',rep:String.raw`M\in\overline{AB}\ \text{ mit }\ |\overline{AM}|=\tfrac12\,|\overline{AB}|`,cap:'Nullpunkt des Geodreiecks auf <i>A</i>, lange Kante auf <span class="ov">AB</span> legen. Die Länge ablesen und bei der Hälfte den Punkt <i>M</i> markieren.',
            items:[{k:'geo',Z:A,u:d,n:V.mul(n0,-1)},ptIt(M,'M',V.add(V.mul(d,0.42),V.mul(n0,-0.45)),C.or,0.55)]},
          {tool:'g',rep:String.raw`m\perp AB\ \text{ mit }\ M\in m`,cap:'Die Mittellinie des Geodreiecks auf <i>AB</i> legen und verschieben, bis die lange Kante durch <i>M</i> geht. Entlang der langen Kante die Senkrechte <i>m</i> zeichnen.',
            items:[{k:'geo',Z:M,u:n0,n:d},{k:'line',p:M,q:V.add(M,n0),ext:12,from:0.35,noRuler:true,lab:'m',labAt:V.add(M,V.add(V.mul(n0,3.3),V.mul(d,0.4)))},fin(0.6)]}]};
      const r=0.72*dAB;let [P,Q]=ccx(A,r,B,r);if(V.dot(V.sub(P,Q),n0)<0)[P,Q]=[Q,P];
      return{base,orts,warum:'<i>P</i> hat von <i>A</i> und von <i>B</i> den Abstand <i>r</i>, ebenso <i>Q</i>. Alle Punkte, die von <i>A</i> und <i>B</i> gleich weit entfernt sind, liegen auf der Mittelsenkrechten. Zwei solche Punkte genügen, um sie zu zeichnen.',
        steps:[
          {tool:'z',rep:String.raw`k_1(A;\,r)\ \text{ mit }\ r>\tfrac12\,|\overline{AB}|`,cap:'Zirkel in <i>A</i> einstechen. Radius grösser als die halbe Strecke wählen, Bögen ober- und unterhalb zeichnen.',items:[Object.assign(arcIt(A,r,[P,Q],16),{lab:'k_1',rlab:'r'})]},
          {tool:'z',rep:String.raw`k_2(B;\,r)`,cap:'Mit dem <b>gleichen Radius</b> in <i>B</i> einstechen und ebenso Bögen zeichnen.',items:[Object.assign(arcIt(B,r,[P,Q],16),{lab:'k_2'})]},
          {tool:null,rep:String.raw`\{P,\,Q\}=k_1\cap k_2`,cap:'Die beiden Schnittpunkte der Bögen markieren: <i>P</i> und <i>Q</i>.',items:[ptIt(P,'P',V.add(away(P,M),V.mul(d,0.3))),ptIt(Q,'Q',V.add(away(Q,M),V.mul(d,0.3)))]},
          {tool:'l',rep:String.raw`m=PQ`,cap:'Die Gerade durch <i>P</i> und <i>Q</i> zeichnen: die Mittelsenkrechte <i>m</i>.',items:[{k:'line',p:P,q:Q,ext:12,lab:'m',labAt:V.add(P,V.add(V.mul(n0,1.3),V.mul(d,0.4)))}]},
          {tool:null,rep:String.raw`M=m\cap AB`,cap:`<i>m</i> schneidet die Strecke im Mittelpunkt <i>M</i>: ${OV('AM')} = ${OV('MB')} und <i>m</i> ⊥ <i>AB</i>.`,
            items:[ptIt(M,'M',V.add(V.mul(d,0.42),V.mul(n0,-0.42)),C.or),fin(0)]}]}}},
  lot:{titel:'Lot von einem Punkt auf eine Gerade fällen',hint:'Ziehe P oder die Gerade g an ihren grauen Punkten.',
    check:G=>{const dd=V.dist(G.P,footOf(G.P,G.G1,G.G2).p);return V.dist(G.G1,G.G2)>=3&&dd>=1&&dd<=5},
    build(G,v){const {G1,G2,P}=G,d=V.norm(V.sub(G2,G1)),F=footOf(P,G1,G2).p,dist=V.dist(P,F),u=V.norm(V.sub(F,P));
      const base=f=>{lineBase(f,G1,G2);f.dot(P,4);f.text(V.add(P,V.add(V.mul(u,-0.45),V.mul(d,0.35))),'P')};
      const fin=(from)=>({k:'fn',from,fn:(f,fi)=>{if(fi>0.4){rmarkBetween(f,F,d,V.mul(u,-1),0.5,C.or);f.seg(P,F,{c:C.vi,w:4,o:.6});f.text(V.add(V.mid(P,F),V.mul(d,-0.42)),'d','lbl',{fill:C.vi})}}});
      const lotLine=(Q,from,noRuler)=>({k:'line',p:P,q:Q,ext:12,from,noRuler,lab:'l',labAt:V.add(P,V.add(V.mul(u,-1.6),V.mul(d,0.4)))});
      const warumG='Die Mittellinie des Geodreiecks steht senkrecht auf der langen Kante. Liegt die Mittellinie auf <i>g</i>, so ist die lange Kante senkrecht zu <i>g</i>.';
      if(v==='geo')return{base,warum:warumG,steps:[
          {tool:'g',rep:String.raw`l\perp g\ \text{ mit }\ P\in l`,cap:'Die Mittellinie des Geodreiecks auf <i>g</i> legen und verschieben, bis die lange Kante durch <i>P</i> geht. Entlang der langen Kante das Lot <i>l</i> zeichnen.',
            items:[{k:'geo',Z:F,u:V.mul(u,-1),n:d},lotLine(F,0.35,true)]},
          {tool:null,rep:String.raw`F=l\cap g,\quad d=|\overline{PF}|`,cap:`Der Schnittpunkt mit <i>g</i> ist der Lotfusspunkt <i>F</i>. Der Abstand von <i>P</i> zu <i>g</i> ist <i>d</i> = ${OV('PF')}.`,
            items:[ptIt(F,'F',V.add(V.mul(d,-0.45),V.mul(u,0.45)),C.or),fin(0)]}]};
      const r=Math.max(dist*1.45,dist+0.9);let [R,S]=clx(P,r,G1,d);const r2=0.6*V.dist(R,S);const X=ccx(R,r2,S,r2);const side=Math.sign(V.cross(d,V.sub(P,G1)));
      const Q=Math.sign(V.cross(d,V.sub(X[0],G1)))!==side?X[0]:X[1];
      return{base,warum:'<i>R</i> und <i>S</i> sind gleich weit von <i>P</i> entfernt, und <i>Q</i> ist gleich weit von <i>R</i> und <i>S</i> entfernt. Also liegen <i>P</i> und <i>Q</i> auf der Mittelsenkrechten von <span class="ov">RS</span>. Diese steht senkrecht auf <i>g</i>.',
        steps:[
          {tool:'z',rep:String.raw`k_1(P;\,r_1)`,cap:'Zirkel in <i>P</i> einstechen und einen Bogen zeichnen, der <i>g</i> in zwei Punkten schneidet.',items:[Object.assign(arcIt(P,r,[R,S],12),{lab:'k_1',rlab:'r_1'})]},
          {tool:null,rep:String.raw`\{R,\,S\}=k_1\cap g`,cap:'Die Schnittpunkte mit <i>g</i> markieren: <i>R</i> und <i>S</i>.',items:[ptIt(R,'R',V.add(V.mul(d,-0.3),V.mul(u,0.45))),ptIt(S,'S',V.add(V.mul(d,0.3),V.mul(u,0.45)))]},
          {tool:'z',rep:String.raw`k_2(R;\,r_2)\ \text{ mit }\ r_2>\tfrac12\,|\overline{RS}|`,cap:'Um <i>R</i> einen Bogen auf der <b>anderen Seite</b> von <i>g</i> zeichnen.',items:[Object.assign(arcIt(R,r2,[Q],18),{lab:'k_2',rlab:'r_2'})]},
          {tool:'z',rep:String.raw`k_3(S;\,r_2),\quad Q\in k_2\cap k_3`,cap:'Mit dem <b>gleichen Radius</b> um <i>S</i> einen Bogen zeichnen. Schnittpunkt: <i>Q</i>.',items:[Object.assign(arcIt(S,r2,[Q],18),{lab:'k_3'}),ptIt(Q,'Q',V.add(away(Q,F),V.mul(d,0.35)))]},
          {tool:'l',rep:String.raw`l=PQ`,cap:'Die Gerade durch <i>P</i> und <i>Q</i> zeichnen: das Lot <i>l</i>.',items:[lotLine(Q)]},
          {tool:null,rep:String.raw`F=l\cap g,\quad d=|\overline{PF}|`,cap:`Der Schnittpunkt mit <i>g</i> ist der Lotfusspunkt <i>F</i>. Der Abstand ist <i>d</i> = ${OV('PF')}.`,
            items:[ptIt(F,'F',V.add(V.mul(d,-0.45),V.mul(u,0.45)),C.or),fin(0)]}]}}},
  err:{titel:'Senkrechte in einem Punkt einer Geraden errichten',hint:'Verschiebe P auf der Geraden g oder drehe g an ihren grauen Punkten.',
    check:G=>V.dist(G.G1,G.G2)>=3,
    build(G,v){const {G1,G2}=G,d=V.norm(V.sub(G2,G1)),P=G.P,n=upN(d);
      const base=f=>{lineBase(f,G1,G2);f.dot(P,4);f.text(V.add(P,V.add(V.mul(n,-0.5),V.mul(d,-0.35))),'P')};
      const sLine=(Q,from,noRuler)=>({k:'line',p:P,q:Q,ext:12,from,noRuler,lab:'s',labAt:V.add(P,V.add(V.mul(n,3.6),V.mul(d,0.4)))});
      const fin=from=>({k:'fn',from,fn:(f,fi)=>{if(fi>0.5)f.rmark(P,V.ang(d),0.55,C.or)}});
      if(v==='geo')return{base,warum:'Der Nullpunkt liegt auf <i>P</i>, die Mittellinie auf <i>g</i>. Die lange Kante steht dann senkrecht auf <i>g</i> und geht durch <i>P</i>.',steps:[
          {tool:'g',rep:String.raw`s\perp g\ \text{ mit }\ P\in s`,cap:'Nullpunkt des Geodreiecks auf <i>P</i> legen, Mittellinie auf <i>g</i>. Entlang der langen Kante die Senkrechte <i>s</i> zeichnen.',
            items:[{k:'geo',Z:P,u:n,n:d},sLine(V.add(P,n),0.35,true),fin(0.85)]}]};
      const r=1.6,R=V.sub(P,V.mul(d,r)),S=V.add(P,V.mul(d,r)),r2=2.5;const X=ccx(R,r2,S,r2);const Q=V.dot(V.sub(X[0],P),n)>0?X[0]:X[1];
      return{base,warum:'<i>P</i> ist die Mitte von <span class="ov">RS</span>, und <i>Q</i> ist gleich weit von <i>R</i> und <i>S</i> entfernt. <i>PQ</i> ist also die Mittelsenkrechte von <span class="ov">RS</span> und steht senkrecht auf <i>g</i>.',
        steps:[
          {tool:'z',rep:String.raw`k_1(P;\,r_1)`,cap:'Zirkel in <i>P</i> einstechen und mit einem beliebigen Radius links und rechts von <i>P</i> Bögen durch <i>g</i> zeichnen.',items:[Object.assign(arcIt(P,r,[R],14),{lab:'k_1',rlab:'r_1',rAng:V.ang(d)+PI-0.25}),arcIt(P,r,[S],14)]},
          {tool:null,rep:String.raw`\{R,\,S\}=k_1\cap g`,cap:'Die Schnittpunkte markieren: <i>R</i> und <i>S</i>. Jetzt ist <i>P</i> die Mitte von <span class="ov">RS</span>.',items:[ptIt(R,'R',V.mul(n,-0.48)),ptIt(S,'S',V.mul(n,-0.48))]},
          {tool:'z',rep:String.raw`k_2(R;\,r_2)\ \text{ mit }\ r_2>r_1`,cap:'Mit einem <b>grösseren</b> Radius um <i>R</i> einen Bogen oberhalb von <i>g</i> zeichnen.',items:[Object.assign(arcIt(R,r2,[Q],16),{lab:'k_2',rlab:'r_2'})]},
          {tool:'z',rep:String.raw`k_3(S;\,r_2),\quad Q\in k_2\cap k_3`,cap:'Mit dem <b>gleichen Radius</b> um <i>S</i> einen Bogen zeichnen. Schnittpunkt: <i>Q</i>.',items:[Object.assign(arcIt(S,r2,[Q],16),{lab:'k_3'}),ptIt(Q,'Q',V.add(V.mul(n,0.45),V.mul(d,0.35)))]},
          {tool:'l',rep:String.raw`s=PQ`,cap:'Die Gerade durch <i>P</i> und <i>Q</i> zeichnen: die Senkrechte <i>s</i> ⊥ <i>g</i>.',items:[sLine(Q),fin(0.95)]}]}}},
  wh:{titel:'Winkel halbieren (Winkelhalbierende)',hint:'Ziehe den Scheitel S oder die Punkte P und Q auf den Schenkeln.',
    check:G=>{const w=ang2(G.S,G.P,G.Q);return w.deg>20&&w.deg<170&&V.dist(G.S,G.P)>3&&V.dist(G.S,G.Q)>3},
    build(G,v){const LBR='k_2',LBT='k_3';const {S,P,Q}=G,w=ang2(S,P,Q),u1=V.dir(w.a1),u2=V.dir(w.a2),bis=V.dir((w.a1+w.a2)/2);
      // P soll auf dem 1. Schenkel (Start des Winkels gegen den Uhrzeigersinn) liegen
      const first=V.dist(V.add(S,V.mul(u1,V.dist(S,P))),P)<1e-6?'P':'Q',second=first==='P'?'Q':'P';
      const base=f=>{f.seg(S,V.add(S,V.mul(u1,30)),{w:2.6});f.seg(S,V.add(S,V.mul(u2,30)),{w:2.6});f.dot(S,4);f.text(V.sub(S,V.mul(bis,0.5)),'S');
        f.dot(P,3,C.grau);f.dot(Q,3,C.grau);f.text(V.add(G[first],V.mul(V.perp(u1),-0.42)),first,'lbl sm');f.text(V.add(G[second],V.mul(V.perp(u2),0.42)),second,'lbl sm')};
      const check6={k:'fn',fn:(f,fi)=>{const m=(w.a1+w.a2)/2;f.wedge(S,w.a1,m,1.1,{c:C.or,f:C.orh,o:fi});f.wedge(S,m,w.a2,1.35,{c:C.or,f:C.orh,o:fi});
            if(fi>0.6){const t=fmt(w.deg/2,1)+'°';f.text(V.add(S,V.mul(V.dir((w.a1+m)/2),1.65)),t,'ann',{fill:C.or});f.text(V.add(S,V.mul(V.dir((m+w.a2)/2),1.9)),t,'ann',{fill:C.or})}}};
      const orts={on:S,dir:bis,ray:S,draw(f,X){const F1=footOf(X,S,V.add(S,u1)).p,F2=footOf(X,S,V.add(S,u2)).p;
          f.seg(X,F1,{c:C.vi,w:1.6,d:'6 4'});f.seg(X,F2,{c:C.vi,w:1.6,d:'6 4'});
          for(const [F,uu] of[[F1,u1],[F2,u2]])rmarkBetween(f,F,uu,V.norm(V.sub(X,F)),0.35,C.vi);
          f.dot(X,4,C.vi);f.text(V.add(X,{x:0.42,y:0.3}),'X','lbl',{fill:C.vi});
          return`Abstand zum 1. Schenkel: ${cm(V.dist(X,F1))} &nbsp; zum 2. Schenkel: ${cm(V.dist(X,F2))}<br>Ziehe <i>X</i> auf <i>w</i>: Jeder Punkt der Winkelhalbierenden ist von beiden Schenkeln gleich weit entfernt.`}};
      const wLabel=L=>V.add(S,V.add(V.mul(bis,L),V.mul(V.perp(bis),0.4)));
      if(v==='geo'){const W=V.add(S,V.mul(bis,geoEdge(w.deg/2)+0.35));return{base,orts,warum:'Der Winkel wird gemessen und die Hälfte abgetragen. Das ist schnell, aber nur so genau, wie man ablesen kann (etwa ±0.5°).',steps:[
          {tool:'g',rep:String.raw`\alpha=\angle ${first}S${second}\ \text{ messen}`,cap:'Nullpunkt des Geodreiecks auf den Scheitel <i>S</i>, lange Kante auf den ersten Schenkel legen. Die Winkelgrösse <i>α</i> ablesen.',items:[{k:'fn',fn:(f,fi)=>{f.arc(S,w.a1,w.a1+(w.a2-w.a1)*fi,2.3,{c:C.blau,w:1.8,me:fi>=1?'b':null});if(fi>=1)f.text(V.add(S,V.mul(V.dir(w.a1+0.8*(w.a2-w.a1)),2.75)),'α','lbl',{fill:C.blau})}},{k:'geo',Z:S,u:u1,n:V.perp(u1),mark:w.deg}]},
          {tool:'g',rep:String.raw`W\ \text{ mit }\ \angle ${first}SW=\tfrac{\alpha}{2}`,cap:'In der gleichen Lage bei der Hälfte des Winkels einen Punkt <i>W</i> markieren.',items:[{k:'geo',Z:S,u:u1,n:V.perp(u1),mark:w.deg/2,noSlide:true},ptIt(W,'W',V.mul(V.perp(bis),0.42),C.ink,0.4)]},
          {tool:'l',rep:String.raw`w=[SW`,cap:'Den Strahl von <i>S</i> durch <i>W</i> zeichnen: die Winkelhalbierende <i>w</i>.',items:[{k:'line',p:S,q:W,ray:true,ext:12,lab:'w',labAt:wLabel(8)}]},
          {tool:null,rep:String.raw`\angle ${first}SW=\angle WS${second}`,cap:'Kontrolle: Die beiden Teilwinkel sind gleich gross.',items:[check6]}]}}
      const r=2.2,R=V.add(S,V.mul(u1,r)),T=V.add(S,V.mul(u2,r));const r2=Math.max(0.8*V.dist(R,T),1.6);const X=ccx(R,r2,T,r2);const W=V.dot(V.sub(X[0],S),bis)>V.dot(V.sub(X[1],S),bis)?X[0]:X[1];
      return{base,orts,warum:`Es gilt ${OV('SR')} = ${OV('ST')} und ${OV('RW')} = ${OV('TW')}; die Seite <span class="ov">SW</span> haben beide Dreiecke gemeinsam. Die Dreiecke <i>SRW</i> und <i>STW</i> sind deshalb deckungsgleich, und die Winkel bei <i>S</i> sind gleich gross.`,
        steps:[
          {tool:'z',rep:String.raw`k_1(S;\,r_1)`,cap:'Zirkel im Scheitel <i>S</i> einstechen und einen Bogen zeichnen, der beide Schenkel schneidet.',items:[Object.assign({k:'arc',c:S,r,a1:w.a1-0.15,a2:w.a2+0.15},{lab:'k_1',rlab:'r_1',rAng:(w.a1+w.a2)/2})]},
          {tool:null,rep:String.raw`R=k_1\cap[S${first},\quad T=k_1\cap[S${second}`,cap:'Die Schnittpunkte mit den Schenkeln markieren: <i>R</i> und <i>T</i>.',items:[ptIt(R,'R',V.mul(V.perp(u1),-0.45)),ptIt(T,'T',V.mul(V.perp(u2),0.45))]},
          {tool:'z',rep:String.raw`k_2(R;\,r_2)`,cap:'Um <i>R</i> einen Bogen im Innern des Winkels zeichnen.',items:[Object.assign(arcIt(R,r2,[W],16),{lab:LBR,rlab:'r_2'})]},
          {tool:'z',rep:String.raw`k_3(T;\,r_2),\quad W\in k_2\cap k_3`,cap:'Mit dem <b>gleichen Radius</b> um <i>T</i> einen Bogen zeichnen. Schnittpunkt: <i>W</i>.',items:[Object.assign(arcIt(T,r2,[W],16),{lab:LBT}),ptIt(W,'W',V.add(V.mul(V.perp(bis),0.4),V.mul(bis,0.3)))]},
          {tool:'l',rep:String.raw`w=[SW`,cap:'Den Strahl von <i>S</i> durch <i>W</i> zeichnen: die Winkelhalbierende <i>w</i>.',items:[{k:'line',p:S,q:W,ray:true,ext:12,lab:'w',labAt:wLabel(V.dist(S,W)+4.5)}]},
          {tool:null,rep:String.raw`\angle ${first}SW=\angle WS${second}`,cap:'Kontrolle: Die beiden Teilwinkel sind gleich gross.',items:[check6]}]}}},
  par:{titel:'Parallele durch einen Punkt',hint:'Ziehe P oder die Gerade g an ihren grauen Punkten.',
    check:G=>{const dd=V.dist(G.P,footOf(G.P,G.G1,G.G2).p);return V.dist(G.G1,G.G2)>=3&&dd>=1&&dd<=5},
    build(G,v){const {G1,G2,P}=G,d=V.norm(V.sub(G2,G1)),F=footOf(P,G1,G2).p,side=V.norm(V.sub(P,F)),dist=V.dist(P,F);
      const base=f=>{lineBase(f,G1,G2);f.dot(P,4);f.text(V.add(P,V.add(V.mul(side,0.45),V.mul(d,-0.35))),'P')};
      const pLine=(Q,from,noRuler)=>({k:'line',p:P,q:Q,ext:12,from,noRuler,lab:'p',labAt:V.add(P,V.add(V.mul(d,6.5),V.mul(side,0.42)))});
      if(v==='geo')return{base,warum:'Die Hilfslinien des Geodreiecks sind parallel zur langen Kante. Liegt eine Hilfslinie auf <i>g</i>, so ist die lange Kante parallel zu <i>g</i>.',steps:[
          {tool:'g',rep:String.raw`p\parallel g\ \text{ mit }\ P\in p`,cap:'Eine Hilfslinie des Geodreiecks auf <i>g</i> legen und verschieben, bis die lange Kante durch <i>P</i> geht. Entlang der langen Kante die Parallele <i>p</i> zeichnen.',
            items:[{k:'geo',Z:V.add(P,V.mul(d,0.6)),u:d,n:V.mul(side,-1),helper:dist},pLine(V.add(P,d),0.35,true)]}]};
      const A=V.sub(F,V.mul(d,1.6)),r=V.dist(A,P),B=V.add(A,V.mul(d,r)),Q=V.add(P,V.mul(d,r));
      return{base,warum:'<i>ABQP</i> hat vier gleich lange Seiten (alle mit dem gleichen Radius konstruiert) und ist deshalb eine Raute. In einer Raute sind gegenüberliegende Seiten parallel, also <i>PQ</i> ∥ <i>AB</i> = <i>g</i>.',
        steps:[
          {tool:null,rep:String.raw`A\in g\ \text{ (beliebig)}`,cap:'Auf <i>g</i> einen beliebigen Punkt <i>A</i> wählen.',items:[ptIt(A,'A',V.add(V.mul(side,-0.48),V.mul(d,-0.2)))]},
          {tool:'z',rep:String.raw`k_1(A;\,|\overline{AP}|),\quad B\in k_1\cap g`,cap:'Zirkel in <i>A</i> einstechen, Radius bis <i>P</i> abgreifen und einen Bogen von <i>P</i> bis <i>g</i> zeichnen. Schnittpunkt mit <i>g</i>: <i>B</i>.',items:[Object.assign(arcIt(A,r,[B,P],10),{lab:'k_1',rTo:P}),ptIt(B,'B',V.add(V.mul(side,-0.48),V.mul(d,0.25)))]},
          {tool:'z',rep:String.raw`k_2(B;\,|\overline{AP}|)`,cap:'Mit dem <b>gleichen Radius</b> um <i>B</i> einen Bogen zeichnen.',items:[Object.assign(arcIt(B,r,[Q],18),{lab:'k_2'})]},
          {tool:'z',rep:String.raw`k_3(P;\,|\overline{AP}|),\quad Q\in k_2\cap k_3`,cap:'Mit dem <b>gleichen Radius</b> um <i>P</i> einen Bogen zeichnen. Schnittpunkt: <i>Q</i>.',items:[Object.assign(arcIt(P,r,[Q],18),{lab:'k_3'}),ptIt(Q,'Q',V.add(V.mul(side,0.45),V.mul(d,0.3)))]},
          {tool:'l',rep:String.raw`p=PQ`,cap:'Die Gerade durch <i>P</i> und <i>Q</i> zeichnen: die Parallele <i>p</i> ∥ <i>g</i>.',items:[pLine(Q)]},
          {tool:null,rep:String.raw`ABQP\ \text{ Raute}\ \Rightarrow\ p\parallel g`,cap:'Die vier Seiten von <i>ABQP</i> sind gleich lang: eine Raute. Gegenüberliegende Seiten sind parallel.',
            items:[{k:'fn',fn:(f,fi)=>{f.poly([A,B,Q,P],{c:C.vi,w:1.8,f:'rgba(116,87,173,.10)',o:fi});if(fi>0.5)for(const [x,y] of[[A,B],[B,Q],[Q,P],[P,A]])f.ticks(x,y,1,C.vi)}}]}]}}},
  w60:{titel:'60°-Winkel konstruieren',hint:'Ziehe den Scheitel S oder den Punkt P, um den Schenkel g zu drehen.',
    check:G=>V.dist(G.S,G.P)>=2.5&&Math.abs(V.ang(V.sub(G.P,G.S)))<0.9,
    build(G,v){return winkelKon(G,v,60)}},
  w30:{titel:'30°-Winkel konstruieren',hint:'Ziehe den Scheitel S oder den Punkt P, um den Schenkel g zu drehen.',
    check:G=>V.dist(G.S,G.P)>=2.5&&Math.abs(V.ang(V.sub(G.P,G.S)))<0.9,
    build(G,v){return winkelKon(G,v,30)}}
};
function winkelKon(G,v,deg){const LBR='k_3',LBT='k_4';const {S,P}=G,u=V.norm(V.sub(P,S)),a=V.ang(u);
  const base=f=>{angleRayBase(f,S,u);f.dot(P,3,C.grau);f.text(V.add(P,V.mul(upN(u),-0.42)),'P','lbl sm')};
  if(v==='geo'){const T=V.add(S,V.mul(V.dir(a+deg/DEG),geoEdge(deg)+0.35));return{base,warum:`Das Geodreieck hat eine Winkelskala. Der Winkel wird direkt abgetragen; die Genauigkeit hängt vom Ablesen ab.`,steps:[
      {tool:'g',rep:String.raw`T\ \text{ mit }\ \angle PST=${deg}^\circ`,cap:`Nullpunkt des Geodreiecks auf <i>S</i>, lange Kante auf <i>g</i> legen. Bei ${deg}° einen Punkt <i>T</i> markieren.`,items:[{k:'geo',Z:S,u,n:V.perp(u),mark:deg},ptIt(T,'T',V.mul(V.perp(V.dir(a+deg/DEG)),0.42),C.ink,0.45)]},
      {tool:'l',rep:String.raw`s=[ST`,cap:'Den Strahl von <i>S</i> durch <i>T</i> zeichnen.',items:[{k:'line',p:S,q:T,ray:true,ext:12,lab:'s',labAt:V.add(S,V.mul(V.dir(a+deg/DEG),7))},angleFn(S,a,deg,C.or)]}]}}
  const r=3,R=V.add(S,V.mul(u,r)),T=V.add(S,V.mul(V.dir(a+PI/3),r));
  const steps=[
    {tool:'z',rep:String.raw`k_1(S;\,r),\quad R=k_1\cap g`,cap:'Zirkel in <i>S</i> einstechen und mit beliebigem Radius <i>r</i> einen Bogen zeichnen, der <i>g</i> schneidet: <i>R</i>.',items:[Object.assign({k:'arc',c:S,r,a1:a-0.15,a2:a+1.25},{lab:'k_1',rlab:'r',rAng:a+0.55}),ptIt(R,'R',V.mul(upN(u),-0.45),C.ink,0.7)]},
    {tool:'z',rep:String.raw`k_2(R;\,r)`,cap:'Mit dem <b>gleichen Radius</b> in <i>R</i> einstechen und einen Bogen zeichnen, der den ersten schneidet.',items:[Object.assign(arcIt(R,r,[T],20),{lab:'k_2'})]},
    {tool:null,rep:String.raw`T=k_1\cap k_2`,cap:'Den Schnittpunkt der Bögen markieren: <i>T</i>.',items:[ptIt(T,'T',V.add(away(T,S,0.3),V.mul(V.perp(V.dir(a+PI/3)),0.35)))]}];
  if(deg===60){steps.push({tool:'l',rep:String.raw`s=[ST,\quad \angle RST=60^\circ`,cap:'Den Strahl von <i>S</i> durch <i>T</i> zeichnen. Der Winkel <i>RST</i> misst 60°.',items:[{k:'line',p:S,q:T,ray:true,ext:12,lab:'s',labAt:V.add(S,V.mul(V.dir(a+PI/3),7))},angleFn(S,a,60,C.or,1.85),{k:'fn',from:0.5,fn:(f,fi)=>f.poly([S,R,T],{c:C.vi,w:1.6,d:'5 4',f:'rgba(116,87,173,.08)',o:fi})}]});
    return{base,steps,warum:`Das Dreieck <i>SRT</i> hat drei gleich lange Seiten (alle mit dem Radius <i>r</i> konstruiert). Es ist gleichseitig, also misst jeder Winkel 60°.`}}
  const r2=0.8*r,X=ccx(R,r2,T,r2),bis=V.dir(a+PI/6),W=V.dot(V.sub(X[0],S),bis)>V.dot(V.sub(X[1],S),bis)?X[0]:X[1];
  steps.push({tool:'z',rep:String.raw`k_3(R;\,r_2)`,cap:'Jetzt den 60°-Winkel halbieren: um <i>R</i> einen Bogen im Innern zeichnen.',items:[Object.assign(arcIt(R,r2,[W],16),{lab:LBR,rlab:'r_2'})]},
    {tool:'z',rep:String.raw`k_4(T;\,r_2),\quad W\in k_3\cap k_4`,cap:'Mit dem <b>gleichen Radius</b> um <i>T</i>. Schnittpunkt: <i>W</i>.',items:[Object.assign(arcIt(T,r2,[W],16),{lab:LBT}),ptIt(W,'W',V.add(V.mul(V.perp(bis),-0.42),V.mul(bis,0.25)))]},
    {tool:'l',rep:String.raw`w=[SW,\quad \angle RSW=30^\circ`,cap:'Den Strahl von <i>S</i> durch <i>W</i> zeichnen. Der Winkel <i>RSW</i> misst 30°.',items:[{k:'line',p:S,q:W,ray:true,ext:12,lab:'w',labAt:V.add(S,V.mul(bis,7.5))},angleFn(S,a,30,C.or,2.3)]});
  return{base,steps,warum:'Zuerst entsteht mit dem gleichseitigen Dreieck <i>SRT</i> ein 60°-Winkel. Seine Winkelhalbierende teilt ihn in zwei Winkel von 30°.'}}
const TOOLTXT={z:'<span class="tool z">Zirkel</span>',l:'<span class="tool l">Lineal</span>',g:'<span class="tool g">Geodreieck</span>'};
function drawCons(f,cons,k,glyph){cons.base(f);cons.steps.forEach((st,i)=>{const fi=clamp(k-i,0,1);for(const it of st.items)drawItem(f,it,fi,glyph&&fi>0&&fi<1)})}
