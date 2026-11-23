"use strict";
/* ---------- Grundlagen ---------- */
const NS='http://www.w3.org/2000/svg', PI=Math.PI, DEG=180/PI;
const C={ink:'#1f2a33',blau:'#2f78a8',hell:'#bcd9eb',or:'#d9822b',orh:'#f7dcbd',gr:'#2f8f5f',grh:'#cde8d8',rot:'#c0463f',roth:'#f3d2cf',vi:'#7457ad',vih:'#e1d7f1',grau:'#8a99a6'};
const V={
  add:(a,b)=>({x:a.x+b.x,y:a.y+b.y}), sub:(a,b)=>({x:a.x-b.x,y:a.y-b.y}), mul:(a,k)=>({x:a.x*k,y:a.y*k}),
  dot:(a,b)=>a.x*b.x+a.y*b.y, cross:(a,b)=>a.x*b.y-a.y*b.x, len:a=>Math.hypot(a.x,a.y),
  norm:a=>{const l=Math.hypot(a.x,a.y)||1;return{x:a.x/l,y:a.y/l}}, mid:(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2}),
  dist:(a,b)=>Math.hypot(a.x-b.x,a.y-b.y), ang:a=>Math.atan2(a.y,a.x), dir:t=>({x:Math.cos(t),y:Math.sin(t)}),
  perp:a=>({x:-a.y,y:a.x}), lerp:(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}),
  rot:(p,c,t)=>{const s=Math.sin(t),k=Math.cos(t),dx=p.x-c.x,dy=p.y-c.y;return{x:c.x+dx*k-dy*s,y:c.y+dx*s+dy*k}}
};
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const fmt=(x,d=1)=>{const v=Math.round(x*10**d)/10**d;return (Object.is(v,-0)?0:v).toFixed(d)};
const norm2pi=a=>{a%=2*PI;return a<0?a+2*PI:a};
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function mk(tag,attrs,parent){const e=document.createElementNS(NS,tag);if(attrs)for(const k in attrs)if(attrs[k]!=null)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
function tween(ms,fn,done){const t0=performance.now();let stop=false;function f(now){if(stop)return;const t=Math.max(0,Math.min(1,(now-t0)/ms));fn(t);if(t<1)requestAnimationFrame(f);else if(done)done()}requestAnimationFrame(f);return()=>{stop=true}}
function lineX(p,d,q,e){const den=V.cross(d,e);if(Math.abs(den)<1e-12)return null;const t=V.cross(V.sub(q,p),e)/den;return V.add(p,V.mul(d,t))}
function footOf(P,A,B){const d=V.sub(B,A);const t=V.dot(V.sub(P,A),d)/V.dot(d,d);return{p:V.add(A,V.mul(d,t)),t}}
/* kleinerer Winkel zwischen den Strahlen VP und VQ: a1 -> a2 gegen den Uhrzeigersinn */
function ang2(Vx,P,Q){let a1=V.ang(V.sub(P,Vx)),a2=V.ang(V.sub(Q,Vx));let d=norm2pi(a2-a1);if(d>PI){const t=a1;a1=a2;a2=t;d=2*PI-d}return{a1,a2:a1+d,deg:d*DEG}}
const TRI={
  sides:(A,B,C)=>({a:V.dist(B,C),b:V.dist(C,A),c:V.dist(A,B)}),
  angles(A,B,C){const f=(P,Q,R)=>Math.acos(clamp(V.dot(V.sub(Q,P),V.sub(R,P))/(V.dist(P,Q)*V.dist(P,R)),-1,1))*DEG;return{al:f(A,B,C),be:f(B,C,A),ga:f(C,A,B)}},
  area2:(A,B,C)=>V.cross(V.sub(B,A),V.sub(C,A)),
  U(A,B,C){const d=2*(A.x*(B.y-C.y)+B.x*(C.y-A.y)+C.x*(A.y-B.y));const a=A.x*A.x+A.y*A.y,b=B.x*B.x+B.y*B.y,c=C.x*C.x+C.y*C.y;
    return{x:(a*(B.y-C.y)+b*(C.y-A.y)+c*(A.y-B.y))/d,y:(a*(C.x-B.x)+b*(A.x-C.x)+c*(B.x-A.x))/d}},
  S:(A,B,C)=>({x:(A.x+B.x+C.x)/3,y:(A.y+B.y+C.y)/3}),
  H(A,B,C){const U=TRI.U(A,B,C),S=TRI.S(A,B,C);return{x:3*S.x-2*U.x,y:3*S.y-2*U.y}},
  I(A,B,C){const s=TRI.sides(A,B,C),p=s.a+s.b+s.c;return{x:(s.a*A.x+s.b*B.x+s.c*C.x)/p,y:(s.a*A.y+s.b*B.y+s.c*C.y)/p}},
  type(A,B,C){ // exakte Einteilung (Rasterpunkte sind exakt darstellbar)
    const s=TRI.sides(A,B,C),m=Math.max(s.a,s.b,s.c),eq=(x,y)=>Math.abs(x-y)<1e-6*m;
    const dots={A:V.dot(V.sub(B,A),V.sub(C,A)),B:V.dot(V.sub(C,B),V.sub(A,B)),C:V.dot(V.sub(A,C),V.sub(B,C))};
    const sc=m*m*1e-7;let w='spitz',at=null;
    for(const k of['A','B','C']){if(Math.abs(dots[k])<sc){w='recht';at=k}else if(dots[k]<0){w='stumpf';at=k}}
    const nab=eq(s.a,s.b),nbc=eq(s.b,s.c),nca=eq(s.c,s.a);
    let sd='un',apex=null;
    if(nab&&nbc)sd='gl';else if(nab){sd='gs';apex='C'}else if(nbc){sd='gs';apex='A'}else if(nca){sd='gs';apex='B'}
    return{s:sd,w,at,apex}
  }
};
function ptsCopy(o){const r={};for(const k in o)r[k]={x:o[k].x,y:o[k].y};return r}
function morph(P,target,ms,render,done){const from=ptsCopy(P);return tween(ms,t=>{const e=ease(t);for(const k in target)P[k]=V.lerp(from[k],target[k],e);render()},done)}

/* ---------- Figur-Klasse (SVG, mathematisches Koordinatensystem, y nach oben) ---------- */
let figId=0;
class Fig{
  constructor(host,o={}){
    this.id=++figId;this.w=o.w||640;this.h=o.h||440;this.s=o.s||40;this.ox=o.ox??this.w/2;this.oy=o.oy??this.h/2;this.snap=o.snap||0;
    this.svg=mk('svg',{viewBox:`0 0 ${this.w} ${this.h}`,role:'img'});
    host.insertBefore(this.svg,host.firstChild);
    const defs=mk('defs',null,this.svg);
    for(const [n,c] of [['b',C.blau],['o',C.or],['k',C.ink]]){const m=mk('marker',{id:`ar${n}${this.id}`,viewBox:'0 0 10 10',refX:'8',refY:'5',markerWidth:'7',markerHeight:'7',orient:'auto-start-reverse'},defs);mk('path',{d:'M0,0 L10,5 L0,10 z',fill:c},m)}
    this.gGrid=mk('g',null,this.svg);this.g=mk('g',null,this.svg);this.hl=mk('g',null,this.svg);
    this.handles=[];this.drag=null;this.draw=()=>{};
    if(o.grid!==false)this.drawGrid();
    this.svg.addEventListener('pointermove',e=>this.move(e));
    const end=()=>{if(this.drag){this.drag.el.classList.remove('active');this.drag=null;if(this.onend)this.onend()}};
    this.svg.addEventListener('pointerup',end);this.svg.addEventListener('pointercancel',end);
  }
  get xmin(){return -this.ox/this.s} get xmax(){return (this.w-this.ox)/this.s}
  get ymin(){return -(this.h-this.oy)/this.s} get ymax(){return this.oy/this.s}
  S(p){return[this.ox+p.x*this.s,this.oy-p.y*this.s]}
  inView(p,m=0.45){return{x:clamp(p.x,this.xmin+m,this.xmax-m),y:clamp(p.y,this.ymin+m,this.ymax-m)}}
  drawGrid(){const st=this.s/2;for(let x=this.ox%st;x<=this.w;x+=st)mk('line',{x1:x,y1:0,x2:x,y2:this.h,class:'grid'},this.gGrid);
    for(let y=this.oy%st;y<=this.h;y+=st)mk('line',{x1:0,y1:y,x2:this.w,y2:y,class:'grid'},this.gGrid)}
  local(e){const pt=this.svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const q=pt.matrixTransform(this.svg.getScreenCTM().inverse());return{x:(q.x-this.ox)/this.s,y:(this.oy-q.y)/this.s}}
  handle(obj,key,opt={}){const el=mk('circle',{r:11,class:'hd'},this.hl);const h={obj,key,el,opt};
    el.addEventListener('pointerdown',e=>{e.preventDefault();if(this.onstart)this.onstart();this.drag=h;el.classList.add('active');this.svg.setPointerCapture(e.pointerId)});
    this.handles.push(h);return h}
  move(e){if(!this.drag)return;let p=this.inView(this.local(e),0.35);const h=this.drag;
    if(this.snap&&!h.opt.constrain)p={x:Math.round(p.x/this.snap)*this.snap,y:Math.round(p.y/this.snap)*this.snap};
    if(h.opt.constrain){p=h.opt.constrain(p);if(!p)return}
    if(h.opt.check&&!h.opt.check(p))return;
    h.obj[h.key]=p;this.render()}
  render(){this.g.replaceChildren();this.draw();for(const h of this.handles){const[x,y]=this.S(h.obj[h.key]);h.el.setAttribute('cx',x);h.el.setAttribute('cy',y);h.el.style.display=h.hidden?'none':''}}
  sty(e,o={}){e.setAttribute('stroke',o.c||C.ink);e.setAttribute('stroke-width',o.w??2);e.setAttribute('fill',o.f||'none');e.setAttribute('stroke-linecap','round');e.setAttribute('stroke-linejoin','round');
    if(o.d)e.setAttribute('stroke-dasharray',o.d);if(o.o!=null)e.setAttribute('opacity',o.o);if(o.me)e.setAttribute('marker-end',`url(#ar${o.me}${this.id})`);return e}
  seg(a,b,o){const[x1,y1]=this.S(a),[x2,y2]=this.S(b);return this.sty(mk('line',{x1,y1,x2,y2},this.g),o)}
  line(p,d,o,L=40){const u=V.norm(d);return this.seg(V.sub(p,V.mul(u,L)),V.add(p,V.mul(u,L)),o)}
  poly(pts,o){return this.sty(mk('polygon',{points:pts.map(p=>this.S(p).join(',')).join(' ')},this.g),o)}
  circ(c,r,o){const[x,y]=this.S(c);return this.sty(mk('circle',{cx:x,cy:y,r:r*this.s},this.g),o)}
  path(d,o){return this.sty(mk('path',{d},this.g),o)}
  dot(p,r=3.6,c=C.ink,op){const[x,y]=this.S(p);const e=mk('circle',{cx:x,cy:y,r,fill:c},this.g);if(op!=null)e.setAttribute('opacity',op);return e}
  arcD(v,a1,a2,r){const[vx,vy]=this.S(v),R=r*this.s;const sw=a2-a1;
    if(sw>=2*PI-1e-6)return`M${vx+R},${vy} A${R},${R} 0 1 0 ${vx-R},${vy} A${R},${R} 0 1 0 ${vx+R},${vy}`;
    return`M${vx+R*Math.cos(a1)},${vy-R*Math.sin(a1)} A${R},${R} 0 ${sw>PI?1:0} 0 ${vx+R*Math.cos(a2)},${vy-R*Math.sin(a2)}`}
  arc(v,a1,a2,r,o){if(a2-a1<1e-4)return null;return this.path(this.arcD(v,a1,a2,r),o)}
  wedge(v,a1,a2,r=0.9,o={}){const sw=a2-a1;if(sw<1e-4)return null;const st=Object.assign({c:C.blau,w:1.3,f:C.hell},o);
    if(sw>=2*PI-1e-6)return this.circ(v,r,st);
    const[vx,vy]=this.S(v),R=r*this.s;
    return this.path(`M${vx},${vy} L${vx+R*Math.cos(a1)},${vy-R*Math.sin(a1)} A${R},${R} 0 ${sw>PI?1:0} 0 ${vx+R*Math.cos(a2)},${vy-R*Math.sin(a2)} Z`,st)}
  rmark(v,a1,r=0.55,c=C.ink){this.arc(v,a1,a1+PI/2,r,{c,w:1.4});this.dot(V.add(v,V.mul(V.dir(a1+PI/4),r*0.5)),2.1,c)}
  angle(v,a1,a2,o={}){const r=o.r||0.9,sw=a2-a1;
    if(o.right!==false&&Math.abs(sw*DEG-90)<0.05)this.rmark(v,a1,o.rr||0.6,o.c||C.ink);
    else this.wedge(v,a1,a2,r,{c:o.c||C.blau,f:o.f||C.hell,o:o.op});
    if(o.lab){const m=(a1+a2)/2;const lr=o.lr||clamp(Math.max(0.6*r/0.9,0.33/Math.max(Math.sin(sw/2),0.04)),0.55,2.2);
      const t=this.text(V.add(v,V.mul(V.dir(m),lr)),o.lab,o.lcls||'lbl',o.lst);if(o.op!=null)t.setAttribute('opacity',o.op)}}
  text(p,s,cls='lbl',st){const[x,y]=this.S(p);const t=mk('text',{x,y,class:cls,'text-anchor':'middle','dominant-baseline':'central'},this.g);
    const m=String(s).match(/^([^_]*)_(.+)$/);
    if(m){mk('tspan',null,t).textContent=m[1];const s2=mk('tspan',{dy:'0.32em','font-size':'0.68em'},t);s2.textContent=m[2]}else t.textContent=s;
    if(st)for(const k in st)t.style[k]=st[k];return t}
  ticks(a,b,n,c=C.ink){const m=V.mid(a,b),d=V.norm(V.sub(b,a)),q=V.perp(d);for(let i=0;i<n;i++){const o=V.add(m,V.mul(d,(i-(n-1)/2)*0.13));this.seg(V.add(o,V.mul(q,0.2)),V.sub(o,V.mul(q,0.2)),{c,w:1.6})}}
}
/* Beschriftung eines Dreiecks */
function triLabels(f,P,o={}){
  const {A,B,C:Cc}=P,G=TRI.S(A,B,Cc),col=o.col||{};
  for(const [k,p] of [['A',A],['B',B],['C',Cc]]){const d=V.norm(V.sub(p,G));f.text(V.add(p,V.mul(d,0.5)),k,'lbl',col[k]?{fill:col[k]}:null)}
  if(o.sides!==false)for(const [n,p,q,opp] of [['a',B,Cc,A],['b',Cc,A,B],['c',A,B,Cc]]){const m=V.mid(p,q);let nn=V.perp(V.norm(V.sub(q,p)));if(V.dot(nn,V.sub(opp,m))>0)nn=V.mul(nn,-1);
    f.text(V.add(m,V.mul(nn,0.4)),n,'lbl',col[n]?{fill:col[n]}:null)}
}
function triAngles(f,P,o={}){
  const {A,B,C:Cc}=P;const out={};
  for(const [k,v,p,q,g] of [['A',A,B,Cc,'α'],['B',B,Cc,A,'β'],['C',Cc,A,B,'γ']]){const w=ang2(v,p,q);out[k]=w;if(o.skip&&o.skip[k])continue;
    const r=w.deg<35?1.35:0.9;const st=(o.st&&o.st[k])||{};f.angle(v,w.a1,w.a2,Object.assign({r,lab:o.lab===false?null:g},st))}
  return out
}
function rowsOn(tbl,attr,val){document.querySelectorAll(`#${tbl} tr[data-${attr}]`).forEach(r=>r.classList.toggle('on',r.dataset[attr]===val))}
function chipsOn(id,vals){document.querySelectorAll(`#${id} .chip`).forEach(c=>c.classList.toggle('on',vals.includes(c.dataset.k)))}
function btnGroup(sel,attr,cb){const bs=document.querySelectorAll(sel);bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.classList.toggle('on',x===b));cb(b.dataset[attr],b)}));return bs}
const cm=x=>fmt(x,1)+' cm', gr=x=>fmt(x,1)+'°';
/* ======================= Skizzenfeld (Stift) ======================= */
function sketchPad(box,bar){
  const cv=document.createElement('canvas');cv.className='skc';box.appendChild(cv);const ctx=cv.getContext('2d');
  let strokes=[],cur=null,col='#1f2a33',erase=false;
  function size(){const r=box.getBoundingClientRect(),dpr=window.devicePixelRatio||1;cv.width=Math.max(1,Math.round(r.width*dpr));cv.height=Math.max(1,Math.round(r.height*dpr));redraw()}
  function line(s){if(s.pts.length<1)return;const W=cv.width,H=cv.height;ctx.save();ctx.globalCompositeOperation=s.er?'destination-out':'source-over';ctx.strokeStyle=s.col;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.lineWidth=(s.er?22:2.4)*(window.devicePixelRatio||1);ctx.beginPath();s.pts.forEach((p,i)=>i?ctx.lineTo(p[0]*W,p[1]*H):ctx.moveTo(p[0]*W,p[1]*H));if(s.pts.length===1)ctx.lineTo(s.pts[0][0]*W+0.1,s.pts[0][1]*H);ctx.stroke();ctx.restore()}
  function redraw(){ctx.clearRect(0,0,cv.width,cv.height);strokes.forEach(line)}
  const pos=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]};
  cv.addEventListener('pointerdown',e=>{e.preventDefault();cv.setPointerCapture(e.pointerId);cur={col,er:erase,pts:[pos(e)]};strokes.push(cur);line(cur)});
  cv.addEventListener('pointermove',e=>{if(!cur)return;cur.pts.push(pos(e));redraw()});
  const end=()=>{cur=null};cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
  new ResizeObserver(size).observe(box);
  bar.innerHTML=`<span class="hint" style="margin:0 4px 0 0">Skizze:</span><button class="btn on" data-c="#1f2a33">✎ schwarz</button><button class="btn" data-c="#2f78a8">✎ blau</button><button class="btn" data-c="#c0463f">✎ rot</button><button class="btn" data-e="1">Radierer</button><button class="btn" data-u="1">↶</button><button class="btn" data-x="1">löschen</button>`;
  const bs=[...bar.querySelectorAll('button')];
  bs.forEach(b=>b.addEventListener('click',()=>{if(b.dataset.x){strokes=[];redraw();return}if(b.dataset.u){strokes.pop();redraw();return}
    bs.forEach(x=>{if(x.dataset.c||x.dataset.e)x.classList.toggle('on',x===b)});if(b.dataset.e){erase=true}else{erase=false;col=b.dataset.c}}));
  return{clear(){strokes=[];redraw()},front(){box.appendChild(cv);size()}}}


/* ======================= Quiz-Motor (für alle Kapitel) ======================= */
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));const pick=a=>a[rnd(0,a.length-1)];
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=rnd(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
const fact=list=>()=>{const [q,o,e]=pick(list);return{q,opts:o,expl:e}};
const typesetEl=el=>{if(window.MathJax&&MathJax.typesetPromise&&MathJax.startup)MathJax.startup.promise.then(()=>MathJax.typesetPromise([el])).catch(()=>{})};
const QZ={gens:[],areas:{},chapters:{'11':'1.1 Grundoperationen','12':'1.2 Algebra','13':'1.3 Geometrie','21':'2.1 Bruchterme','22':'2.2 Gleichungen','23':'2.3 Geometrie'}};
function qzRegister(ch,areas,gens){for(const k in areas)QZ.areas[ch+'-'+k]=areas[k];gens.forEach(g=>{g.ch=ch;g.a=ch+'-'+g.a;const g0=g.gen;
  /* Zufallsfragen neu erzeugen, falls Antworten zusammenfallen (mindestens 4 verschiedene Optionen) */
  g.gen=function(){let best=null;for(let i=0;i<30;i++){const q=g0.call(g);const n=new Set(q.opts).size;if(n>=4)return q;if(!best||n>best.n)best={q,n}}return best.q};QZ.gens.push(g)})}
function runQuiz(chs){
  const $=id=>document.getElementById(id);const multi=chs.length>1;let round=[],idx=0,score=0;
  const sel=$('qarea');let h='<option value="all">'+(multi?'ganzer Block '+chs[0][0]+' gemischt':'alle Bereiche gemischt')+'</option>';
  for(const ch of chs){const ar=Object.keys(QZ.areas).filter(k=>k.startsWith(ch+'-'));
    if(multi)h+=`<optgroup label="${QZ.chapters[ch]}"><option value="ch:${ch}">${QZ.chapters[ch]} – alle Bereiche</option>`;
    h+=ar.map(k=>`<option value="${k}">${multi?'· ':''}${QZ.areas[k]}</option>`).join('');if(multi)h+='</optgroup>'}
  sel.innerHTML=h;
  const box=$('qbox'),pad=sketchPad(box,$('qsk'));
  function newRound(){const v=sel.value;const pool=QZ.gens.filter(g=>chs.includes(g.ch)&&(v==='all'||(v.startsWith('ch:')?g.ch===v.slice(3):g.a===v)));const N=+$('qn').value;let order=[];
    while(order.length<N){const s=shuffle(pool.slice());if(order.length&&s[0]===order[order.length-1]&&s.length>1)s.push(s.shift());order.push(...s)}
    round=order.slice(0,N).map(g=>{const q=g.gen();q.top=g.top;q.area=(multi?QZ.chapters[g.ch].split(' ')[0]+' · ':'')+QZ.areas[g.a];return q});idx=0;score=0;show()}
  function show(){$('qbar').style.width=(idx/round.length*100)+'%';pad.clear();
    const old=box.querySelector('svg');if(old)old.remove();
    if(idx>=round.length){$('qtop').textContent='Auswertung';const p=score/round.length;$('qq').innerHTML=`<p style="font-size:20px"><b>${score} von ${round.length}</b> Fragen richtig.</p><p>${p>=0.9?'Ausgezeichnet!':p>=0.7?'Gut gemacht. Schau dir die Themen der falschen Antworten nochmals an.':'Wiederhole die passenden Abschnitte und starte eine neue Runde.'}</p>`;
      $('qo').innerHTML='';$('qfb').innerHTML='';$('qnext').hidden=true;$('qstat').textContent='';const f=new Fig(box,{w:520,h:320,s:30});f.render();pad.front();return}
    const q=round[idx];$('qstat').textContent=`Frage ${idx+1} von ${round.length} · ${score} richtig`;$('qtop').textContent=q.area.endsWith(q.top)?q.area:q.area+' · '+q.top;$('qq').innerHTML=`<p>${q.q}</p>`;$('qfb').innerHTML='';$('qnext').hidden=true;
    const f=new Fig(box,{w:520,h:320,s:30});if(q.draw)f.draw=()=>q.draw(f);f.render();pad.front();
    $('qhint').textContent=q.draw?'Du kannst direkt in die Figur zeichnen.':'Diese Frage hat keine Figur. Nutze das Feld für eine Skizze oder Nebenrechnung.';
    const ok=q.opts[0];const opts=shuffle([...new Set(q.opts)]);const qo=$('qo');qo.innerHTML='';
    for(const o of opts){const b=document.createElement('button');b.className='opt';b.innerHTML=o;if(o===ok)b.dataset.ok='1';
      b.addEventListener('click',()=>{const right=o===ok;if(right)score++;[...qo.children].forEach(x=>{x.disabled=true;if(x.dataset.ok)x.classList.add('ok')});if(!right)b.classList.add('bad');
        $('qfb').innerHTML=`<div class="expl"><b class="${right?'ok':'warn'}">${right?'Richtig.':'Leider falsch.'}</b> ${q.expl}</div>`;typesetEl($('qfb'));$('qnext').hidden=false;$('qstat').textContent=`Frage ${idx+1} von ${round.length} · ${score} richtig`});
      qo.appendChild(b)}
    typesetEl($('qq'));typesetEl(qo)}
  $('qneu').addEventListener('click',newRound);sel.addEventListener('change',newRound);$('qn').addEventListener('change',newRound);$('qnext').addEventListener('click',()=>{idx++;show()});
  newRound()}

/* ======================= Zahlen-Helfer ======================= */
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a};
const lcm=(a,b)=>a/gcd(a,b)*b;
function primeFactors(n){const f=[];let p=2;while(n>1&&p*p<=n){while(n%p===0){f.push(p);n/=p}p++}if(n>1)f.push(n);return f}
class Q{constructor(n,d=1){if(d<0){n=-n;d=-d}const g=gcd(n,d)||1;this.n=n/g;this.d=d/g}
  add(o){return new Q(this.n*o.d+o.n*this.d,this.d*o.d)}sub(o){return new Q(this.n*o.d-o.n*this.d,this.d*o.d)}
  mul(o){return new Q(this.n*o.n,this.d*o.d)}div(o){return new Q(this.n*o.d,this.d*o.n)}eq(o){return this.n===o.n&&this.d===o.d}
  tex(){return this.d===1?String(this.n):(this.n<0?'-':'')+`\\dfrac{${Math.abs(this.n)}}{${this.d}}`}
  html(){return this.d===1?mn(this.n):(this.n<0?'−':'')+frH(Math.abs(this.n),this.d)}}
const mn=v=>String(v).replace(/-/g,'−');
const frH=(n,d)=>`<span class="fr"><span>${mn(n)}</span><span>${mn(d)}</span></span>`;
const tf=(n,d)=>`\\dfrac{${n}}{${d}}`;
/* Zahl mit Tausender-Apostroph (Schweizer Schreibweise) und Dezimalpunkt */
function sep(x,dec){let s=typeof x==='string'?x:(dec!=null?Number(x).toFixed(dec):String(Number(Number(x).toPrecision(12))));
  if(/e/i.test(s))s=Number(s).toFixed(20).replace(/0+$/,'').replace(/\.$/,'');
  let neg=s[0]==='-';if(neg)s=s.slice(1);let [i,f]=s.split('.');if(i.length>=4)i=i.replace(/\B(?=(\d{3})+(?!\d))/g,'′');return(neg?'−':'')+i+(f?'.'+f:'')}
/* Eingabe in Zahl umwandeln: akzeptiert ′ ' Leerzeichen, Komma als Dezimalzeichen, Bruch a/b */
function parseNum(str){if(str==null)return NaN;let s=String(str).trim().replace(/[′'’\s]/g,'').replace(/−/g,'-').replace(',','.');
  const m=s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);if(m)return parseFloat(m[1])/parseFloat(m[2]);return s===''?NaN:Number(s)}
function parseFrac(str){const s=String(str).trim().replace(/\s/g,'').replace(/−/g,'-').replace(':','/');let m=s.match(/^(-?\d+)\/(-?\d+)$/);if(m)return{n:+m[1],d:+m[2]};m=s.match(/^(-?\d+)$/);if(m)return{n:+m[1],d:1};return null}

/* ======================= Trainer-Motor ======================= */
function runTrainer(types){
  const $=id=>document.getElementById(id);let cur=null,tries=0,right=0,done=false,last=null;
  const sel=$('ttyp');sel.innerHTML='<option value="mix">alle Aufgabentypen gemischt</option>'+Object.entries(types).map(([k,t])=>`<option value="${k}">${t.label}</option>`).join('');
  function neu(){const keys=Object.keys(types);let k=sel.value;if(k==='mix'){do{k=pick(keys)}while(k===last&&keys.length>1)}last=k;cur=types[k].gen();done=false;
    $('ttitel').textContent=types[k].label;$('tq').innerHTML=cur.q;$('tziel').innerHTML=cur.ziel||'';$('tl').innerHTML=cur.sol;$('tl').classList.remove('on');$('tfb').innerHTML='';$('tin').value='';
    $('tin').placeholder=cur.ph||'';typesetEl($('tq'));typesetEl($('tziel'));typesetEl($('tl'))}
  function check(){const v=$('tin').value;if(!v.trim()){$('tfb').innerHTML='<span class="warn">Bitte eine Antwort eingeben.</span>';return}
    const r=cur.check(v);if(!done)tries++;if(r.ok&&!done){right++;done=true}
    $('tfb').innerHTML=r.ok?`<span class="ok">Richtig!</span> ${r.msg||''}`:`<span class="warn">${r.msg||'Noch nicht richtig.'}</span>`;typesetEl($('tfb'));
    $('tscore').textContent=`${right} richtig gelöst`}
  $('tneu').addEventListener('click',neu);sel.addEventListener('change',neu);$('tcheck').addEventListener('click',check);
  $('tin').addEventListener('keydown',e=>{if(e.key==='Enter')check()});$('tsol').addEventListener('click',()=>{$('tl').classList.toggle('on');done=true});
  neu()}

/* ======================= Terme mit Zahlen schrittweise berechnen ======================= */
function tokTerm(str){const s=String(str).replace(/\s/g,'').replace(/−/g,'-').replace(/[·*×]/g,'*').replace(/[:÷\/]/g,':').replace(/²/g,'^2').replace(/³/g,'^3');
  const T=[];let i=0;const isD=c=>/[0-9.]/.test(c);
  const readNum=()=>{let j=i;while(j<s.length&&isD(s[j]))j++;const v=parseFloat(s.slice(i,j));i=j;return v};
  while(i<s.length){const c=s[i];
    if(isD(c)){T.push({t:'n',v:readNum()});continue}
    if(c==='^'){i++;let br=s[i]==='(';if(br)i++;let neg=s[i]==='-';if(neg)i++;const v=readNum();if(br)i++;T.push({t:'p',v:neg?-v:v});continue}
    if('+-*:'.includes(c)){const last=T[T.length-1];const unary=c==='-'&&(!last||last.t==='o'||last.t==='(');
      if(unary&&isD(s[i+1]||'')){i++;const v=readNum();if(s[i]==='^'){T.push({t:'o',v:'-',u:true});T.push({t:'n',v})}else T.push({t:'n',v:-v});continue}
      T.push({t:'o',v:c,u:unary});i++;continue}
    if(c==='('||c===')'){T.push({t:c});i++;continue}
    throw new Error('Unbekanntes Zeichen: '+c)}
  return T}
function termNorm(T){T=T.map(x=>Object.assign({},x));let ch=true;
  while(ch){ch=false;
    for(let i=0;i<T.length-2;i++)if(T[i].t==='('&&T[i+1].t==='n'&&T[i+2].t===')'&&(!(T[i+3]&&T[i+3].t==='p')||T[i+1].v>=0)){T.splice(i,3,T[i+1]);ch=true;break}
    if(ch)continue;
    for(let i=0;i<T.length-1;i++)if(T[i].t==='o'&&T[i].u&&T[i].v==='-'&&T[i+1].t==='n'&&!(T[i+2]&&T[i+2].t==='p')){T.splice(i,2,{t:'n',v:-T[i+1].v});ch=true;break}}
  return T}
const rnd10=v=>Number(v.toPrecision(12));
function termStep(T){T=termNorm(T);let lo=0,hi=T.length-1,inBr=false,open=-1;
  for(let i=0;i<T.length;i++){if(T[i].t==='(')open=i;else if(T[i].t===')'){lo=open+1;hi=i-1;inBr=true;break}}
  if(inBr&&lo===hi&&T[lo].t==='n'&&T[hi+2]&&T[hi+2].t==='p'){const b=T[lo].v,e=T[hi+2].v;return{T,from:lo-1,to:hi+2,stage:2,inBr:false,res:rnd10(Math.pow(b,e)),txt:`Potenz: (${mn(b)})<sup>${e}</sup> = ${sep(rnd10(Math.pow(b,e)))}`}}
  for(let i=lo;i<=hi;i++)if(T[i].t==='p'&&T[i-1]&&T[i-1].t==='n'){const b=T[i-1].v,e=T[i].v,r=rnd10(Math.pow(b,e));return{T,from:i-1,to:i,stage:2,inBr,res:r,txt:`Potenz: ${b<0?'('+mn(b)+')':mn(b)}<sup>${e}</sup> = ${sep(r)}`}}
  for(let i=lo;i<=hi;i++)if(T[i].t==='o'&&(T[i].v==='*'||T[i].v===':')&&T[i-1].t==='n'&&T[i+1]&&T[i+1].t==='n'){const a=T[i-1].v,b=T[i+1].v,r=rnd10(T[i].v==='*'?a*b:a/b);
    return{T,from:i-1,to:i+1,stage:3,inBr,res:r,txt:`Punktrechnung${T.slice(lo,hi+1).filter(x=>x.t==='o'&&(x.v==='*'||x.v===':')).length>1?' (von links nach rechts)':''}: ${sep(a)} ${T[i].v==='*'?'·':':'} ${b<0?'('+mn(b)+')':sep(b)} = ${sep(r)}`}}
  for(let i=lo;i<=hi;i++)if(T[i].t==='o'&&!T[i].u&&(T[i].v==='+'||T[i].v==='-')&&T[i-1]&&T[i-1].t==='n'&&T[i+1]&&T[i+1].t==='n'){const a=T[i-1].v,b=T[i+1].v,r=rnd10(T[i].v==='+'?a+b:a-b);
    return{T,from:i-1,to:i+1,stage:4,inBr,res:r,txt:`Strichrechnung${T.slice(lo,hi+1).filter(x=>x.t==='o'&&!x.u&&(x.v==='+'||x.v==='-')).length>1?' (von links nach rechts)':''}: ${sep(a)} ${T[i].v==='+'?'+':'−'} ${b<0?'('+mn(b)+')':sep(b)} = ${sep(r)}`}}
  return null}
function termApply(st){const T=st.T.slice();T.splice(st.from,st.to-st.from+1,{t:'n',v:st.res,isNew:true});return termNorm(T)}
function termHTML(T,hl){let h='';T.forEach((x,i)=>{let s;const prev=T[i-1];
    if(x.t==='n')s=(x.v<0&&prev&&(prev.t==='o'))?`(${mn(sep(x.v))})`:sep(x.v);
    else if(x.t==='p')s=`<sup>${mn(x.v)}</sup>`;else if(x.t==='o')s=x.u?'−':{'+':' + ','-':' − ','*':' · ',':':' : '}[x.v];else s=x.t;
    const inHl=hl&&i>=hl.from&&i<=hl.to;
    if(inHl&&i===hl.from)h+=`<span class="tk s${hl.stage}">`;
    h+=x.isNew&&!hl?`<span class="tk new">${s}</span>`:s;
    if(inHl&&i===hl.to)h+='</span>'});return h}
function termSolve(str){let T=termNorm(tokTerm(str));const lines=[termHTML(T)],steps=[];let st,guard=0;
  while((st=termStep(T))&&guard++<60){steps.push(st);T=termApply(st);lines.push(termHTML(T.map(x=>Object.assign({},x,{isNew:false}))))}
  return{lines,steps,value:T.length===1&&T[0].t==='n'?T[0].v:NaN}}
