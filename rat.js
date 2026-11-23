"use strict";
/* ======================= Bruchterme: Faktoren, Darstellung, Prüfung (Block 2) ======================= */
/* Ein Faktor ist {p: Poly, t: TeX}. Summen stehen in Klammern, Monome ohne. */
const RF={
  lin(v,a,b){const p=Poly.v(v).scale(a).add(Poly.c(b));return{p,t:`(${p.tex()})`,bin:true}},
  sum(p){return{p,t:`(${p.tex()})`,bin:p.terms()>1}},
  mono(c,o={}){let p=Poly.c(c);for(const n in o)for(let i=0;i<o[n];i++)p=p.mul(Poly.v(n));return{p,t:p.tex(),bin:false}},
  num(c){return{p:Poly.c(c),t:String(c),bin:false}},
  prodP(L){return L.reduce((a,f)=>a.mul(f.p),Poly.c(1))},
  /* Produkt als TeX: Zahl zuerst, dann Monome, dann Klammern; 1 wird weggelassen */
  prodT(L){if(!L.length)return'1';const c=L.filter(f=>f.p.isConst()).reduce((a,f)=>a*f.p.constVal(),1);
    const m=L.filter(f=>!f.p.isConst()&&!f.bin).map(f=>f.t),b=L.filter(f=>f.bin).map(f=>f.t);
    let s=(c===1&&(m.length||b.length))?'':c===-1&&(m.length||b.length)?'-':String(c);
    s+=m.join('')+(m.length&&b.length?'':'')+b.join('');return s||'1'},
  /* Polynomform als TeX (ausmultipliziert) */
  expT(L){return RF.prodP(L).tex()},
  frac(n,d){return d==='1'?n:`\\dfrac{${n}}{${d}}`}
};
/* Zufällige lineare Binome in x mit kleinen ganzen Zahlen */
function rLin(v='x',excl=[]){let b;do{b=pick([-6,-5,-4,-3,-2,-1,1,2,3,4,5,6])}while(excl.includes(b));return RF.lin(v,1,b)}

/* Antwort prüfen: ein (vollständig gekürzter) Bruch N/D, gleichwertig zu N0/D0 */
function splitFrac(ast){let neg=false;while(ast.t==='neg'||ast.t==='par'&&ast.a.t==='neg'){if(ast.t==='par'){ast=ast.a;continue}neg=!neg;ast=ast.a}
  if(ast.t==='div')return{n:ast.a,d:ast.b,neg};return{n:ast,d:{t:'num',v:1},neg}}
/* numerischer Vergleich, Stellen nahe bei Polstellen werden übersprungen */
function ratEquiv(ast,vars,vN,vD){let ok=0;for(let t=0;t<40&&ok<6;t++){const env={};vars.forEach(v=>env[v]=Math.round((Math.random()*8-4)*1000)/1000+0.0137);
    algVars(ast).forEach(v=>{if(!(v in env))env[v]=Math.random()*3+0.5});
    const d=vD.eval(env);if(Math.abs(d)<0.05)continue;const b=vN.eval(env)/d,a=algEval(ast,env);if(!isFinite(a)){if(Math.abs(a)===Infinity)continue;return false}
    if(Math.abs(a-b)>1e-6*Math.max(1,Math.abs(b)))return false;ok++}return ok>=4}
function checkRat(input,N0,D0,opt={}){let ast;
  try{ast=algParse(input)}catch(e){return{ok:false,msg:'Eingabe nicht lesbar: '+e.message+'. Schreibe z. B. (x+2)/(x-3) oder 3/(2x).'}}
  const vN=polyTarget(N0),vD=polyTarget(D0);const vars=new Set([...vN.vars,...vD.vars]);
  if(!ratEquiv(ast,vars,vN,vD))return{ok:false,msg:'Das Resultat ist nicht gleichwertig zur Aufgabe.'};
  const sp=splitFrac(ast);let N,D;
  try{N=toPoly(sp.n);D=toPoly(sp.d)}catch(e){return{ok:false,msg:'Gleichwertig, aber schreibe das Resultat als <b>einen</b> Bruch: (Zähler)/(Nenner).'}}
  if(N.deg()+D.deg()>N0.deg()+D0.deg())return{ok:false,msg:'Gleichwertig, aber noch nicht vollständig gekürzt. Zerlege Zähler und Nenner in Faktoren.'};
  const cn=N.content(),cd=D.content();if(cn&&cd&&gcd(cn,cd)>1&&N.m.size&&[...N.m.values()].every(Number.isInteger)&&[...D.m.values()].every(Number.isInteger))return{ok:false,msg:'Gleichwertig, aber die Zahlen lassen sich noch kürzen.'};
  return{ok:true}}
/* Polynom-Antwort (z. B. ggT oder kgV), Vorzeichen nach Wahl */
function checkPolyPM(input,P0){let ast;try{ast=algParse(input)}catch(e){return{ok:false,msg:'Eingabe nicht lesbar: '+e.message}}
  if(algEquiv(ast,polyTarget(P0))||algEquiv(ast,polyTarget(P0.neg())))return{ok:true};return{ok:false,msg:'Nicht richtig.'}}
